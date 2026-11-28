#!/usr/bin/env python3
"""Compile route-bound ASCII artboards from the approved NigeriaStack IA ledger."""

import argparse
from collections import Counter
import csv
from dataclasses import dataclass, replace
import hashlib
from html.parser import HTMLParser
import io
import json
from pathlib import Path
import re
import runpy
import textwrap
import unicodedata
from urllib.parse import parse_qsl, quote, unquote, urlsplit
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo


WIDTHS = {1440: 118, 768: 84, 390: 51, 320: 42}
NOTICE_TEXT = ('Open Standards & Non-Impersonation Notice (CC0-1.0): NigeriaStack (nigeriastack.org) '
               'is an independent open specification and conformance commons attributed to Digital Economic '
               'Development Initiative | DIGITECO. It is not a government agency, payment processor, or '
               'central database operator. Statutory institutions retain 100% custody of their records and revenues.')
PARENTS = {
    '/': 'Home', '/sectors': 'Industries', '/protocols': 'Protocols',
    '/rfcs': 'Specifications', '/conformance': 'Conformance',
    '/atlas': 'Atlas', '/governance': 'Governance',
}
COLLECTIONS = {**PARENTS, '/atlas/states': 'States and FCT',
               '/atlas/lga-774': 'Councils', '/search': 'Search',
               '/protocols/lga-governance-stack': 'Municipal workflows'}
GROUPS = (
    ('wg-01', 'Architecture and reliable data exchange', '001 002 003', 'Describe an exchange, timeout or retry problem.'),
    ('wg-02', 'Digital evidence and legal records', '005 013', 'Show the document provenance requirement or clause to correct.'),
    ('wg-03', 'Consent, privacy and public revenue', '006 009 014', 'Explain a consent or routing rule with synthetic data.'),
    ('wg-04', 'Commerce, logistics and agriculture', '007 010 012', 'Show where a trade or delivery handoff breaks.'),
    ('wg-05', 'Local registries, offline services and health', '004 011 014', 'Describe an offline or assisted council workflow.'),
    ('wg-06', 'Agent delegation and safety checks', '008', 'Describe the action and who should authorise it.'),
)
GROUP_FOR = {number: name for _, name, refs, _ in GROUPS for number in refs.split()}
GUIDES = {
    'sure-evidence': ('Check the origin of a record', '005'),
    'clearam-consent': ('Share data with a clear purpose', '006'),
    'confluence-gateway': ('Recover after a timeout', '003'),
    'marketlink-commerce': ('Connect catalogues and orders', '007'),
    'givepower-agents': ('Set limits on an automated action', '008'),
    'kioskbase-registries': ('Keep a service usable offline', '004'),
    'lawtree-ast': ('Keep legal text and references in sync', '013'),
}
MODULE_TASKS = (
    'Report a neighbourhood problem', 'Review a building application',
    'Manage water and sanitation requests', 'Apply for a local business permit',
    'Record a life event', 'Verify local identity', 'Review a safety clearance',
    'Track public works', 'Review a property rate', 'Collect market dues',
    'Review a primary healthcare workflow', 'Inspect a council record',
    'Track a customary court case', 'Find or assign a street address',
)
STATE_SECTIONS = ('Courts and magistrates', 'Land records', 'Public revenue',
                  'Health and social services', 'Civil registration and councils',
                  'Public procurement', 'Agriculture services', 'Connectivity and hosting')
PLAIN_SYMBOLS = str.maketrans({'’': "'", '‘': "'", '“': '"', '”': '"', '‐': '-',
                              '–': '-', '—': '-', '…': '...', '→': '>', '×': 'x', '•': '-'})
LEDGER_COUNTS = {'/': 2, '/sectors': 33, '/protocols': 23, '/rfcs': 81,
                 '/conformance': 1, '/atlas': 814, '/governance': 1}


@dataclass(frozen=True)
class Action:
    label: str
    target: str


@dataclass(frozen=True)
class Panel:
    title: str
    lines: tuple[str, ...] = ()
    actions: tuple[Action, ...] = ()


@dataclass(frozen=True)
class Design:
    title: str
    context: str
    primary: Panel
    secondary: Panel
    sections: tuple[Panel, ...]
    layout: str


class RenderedPage(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.main = False
        self.footer = False
        self.notice = None
        self.notices = []
        self.current = None
        self.summary_anchor = ''
        self.headings = []
        self.fragments = set()
        self.links = set()
        self.main_links = set()
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'main':
            self.main = True
        if tag == 'footer':
            self.footer = True
        if tag == 'blockquote' and 'footer-notice' in attrs.get('class', '').split():
            self.notice = self.footer, []
        if 'id' in attrs:
            self.fragments.add(attrs['id'])
        if tag == 'a' and 'href' in attrs:
            self.links.add(attrs['href'])
            if self.main:
                self.main_links.add(attrs['href'])
        if tag == 'summary':
            self.summary_anchor = attrs.get('id', '')
        if self.main and tag in ('h1', 'h2', 'h3', 'h4'):
            self.current = tag, tag, attrs.get('id', ''), []
        elif self.main and attrs.get('role') == 'heading' and attrs.get('aria-level') in ('2', '3', '4'):
            self.current = tag, f'h{attrs["aria-level"]}', attrs.get('id', self.summary_anchor), []

    def handle_endtag(self, tag):
        if tag == 'main':
            self.main = False
        if tag == 'footer':
            self.footer = False
        if tag == 'blockquote' and self.notice:
            in_footer, chunks = self.notice
            self.notices.append((in_footer, ' '.join(''.join(chunks).split())))
            self.notice = None
        if self.current and tag == self.current[0]:
            _, level, anchor, chunks = self.current
            self.headings.append((level, ' '.join(''.join(chunks).split()), anchor))
            self.current = None
        if tag == 'summary':
            self.summary_anchor = ''

    def handle_data(self, data):
        if self.current:
            self.current[3].append(data)
        if self.notice:
            self.notice[1].append(data)


def load_json(path):
    return json.loads(path.read_text(encoding='utf-8'))


def sha(content):
    return hashlib.sha256(content).hexdigest()


def action(label, target):
    return Action(label, target)


def rfc(number):
    return f'/rfcs/NS-RFC-{number}'


def design_for(route, names, core, categories, industries, states, identities, modules, faq_names):
    title = names[route]
    if route == '/':
        return Design(title, 'Open standards for services and systems in Nigeria.',
            Panel('What do you need to do?', ('Use Search in the shared navigation to look up a name or identifier.',), (
                action('Find standards for an industry', '/sectors'), action('Choose a protocol', '/protocols'),
                action('Read a specification', '/rfcs'), action('Check an integration rule', '/conformance'),
                action('Find a state or council', '/atlas'), action('See who governs the work', '/governance'))),
            Panel('How the architecture fits together', (
                'Applications and services', '  Open exchange protocols', '  Verifiable records and legal text',
                'Statutory identity and treasury', 'Local infrastructure and offline work'),
                (action('Read the Hourglass specification', rfc('001')),)),
            (Panel('Who holds the records?', ('Statutory record custodians retain their responsibilities.',),
                   (action('Inspect safeguards', '/governance#safeguards'),)),
             Panel('Project source', (), (action('Browse NigeriaStack on GitHub', 'https://github.com/nigeriastack'),))), 'split')
    if route == '/sectors':
        samples = tuple(action(names[key], key) for key in names if key.startswith('/sectors/'))
        return Design(title, 'Compare the industry scope and evidence before choosing a standard.',
            Panel('Find an industry', ('[Search by name or identifier]',
                 '[Sector v] [Gap v] [Maturity v]', '[Apply] [Clear] [Sort] [Export filtered results]',
                 'Result count and selected filters are announced.'), samples[:2]),
            Panel('Industry comparison', ('Industry | Sector | Assessment | Gap | Maturity',
                  'Not yet assessed | Unassigned | Research proposal',
                  'No matches: clear filters or change the search.'), (action('Open the first industry record', samples[0].target),)),
            (Panel('Browse the full collection', ('Every admitted industry remains available when data is unavailable.',), samples[2:]),), 'table')
    if route == '/protocols':
        guides = tuple(action(task, f'/protocols/{slug}') for slug, (task, _) in GUIDES.items())
        return Design(title, 'Start with the problem you are trying to solve.', Panel('Choose a task', (), guides),
            Panel('Local government', ('See proposed workflows and what remains to be assessed.',),
                  (action('Browse municipal workflows', '/protocols/lga-governance-stack'),)),
            (Panel('Verification', ('Look for the requirement and matching reference before running a check.',)),), 'split')
    if route == '/rfcs':
        core_links = tuple(action(names[rfc(number)], rfc(number)) for number in core)
        return Design(title, 'Look up an exact identifier or browse by topic and publication status.',
            Panel('Find a specification', ('[Exact identifier] [Find]', '[Topic v] [Lifecycle v] [Track v]',
                  '[Filter] [Clear] [Sort]', 'Results show lifecycle, group, and source availability.'), core_links[:2]),
            Panel('Read a requirement', ('Requirement and revision on the left', 'Matching artefact and its scope on the right',
                  'On small screens, the same information reads in order.'), (action('Open the Hourglass reader', rfc('001')),)),
            (Panel('Core specifications', ('Current candidate status stays visible.',), core_links[2:]),
             Panel('Extended archive', ('Extended entries remain available by ID with their research status.',),
                  (action('Open an extended archive record', rfc('015')),)),
             Panel('Project source', (), (action('Browse specification source', 'https://github.com/nigeriastack/protocol-specifications'),))), 'table')
    if route == '/conformance':
        return Design(title, 'Compare a synthetic value with its expected digest on this device.',
            Panel('Synthetic digest check', ('Local reference check | Unsigned result', '[Load example]',
                  '[Payload JSON                     ]', '[Run check]'), ()),
            Panel('Check result', ('Run a check to get a result.', 'Malformed JSON: show an error beside the input.',
                  'Mismatch: show the comparison and its scope.', 'After an edit, clear the old result and receipt.',
                  'After a result: [Download unsigned receipt]'),
                  (action('Read specification references', '/rfcs'),)),
            (Panel('Scope of this check', ('Use synthetic values only. The result covers a local digest comparison.',)),), 'split')
    if route == '/atlas':
        return Design(title, 'Choose service readiness by jurisdiction or look up a council by name.',
            Panel('Find a council', ('Search by name. Choose a state or territory to narrow the list.',),
                  (action('Browse council identities', '/atlas/lga-774'),)),
            Panel('Explore state readiness', ('See which areas have an assessment and its source.',),
                  (action('Browse states and FCT', '/atlas/states'),)),
            (Panel('Local workflows', ('Municipal workflows describe proposals. Each council record states its evidence scope.',),
                   (action('Read municipal workflow proposals', '/protocols/lga-governance-stack'),)),), 'split')
    if route == '/governance':
        groups = tuple(Panel(name, (task, 'No public record verified for this group.'),
                      tuple(action(names[rfc(number)], rfc(number)) for number in refs.split()) +
                      tuple(action(label, f'/governance?group={group}&task={task_id}#contribute')
                            for task_id, label in (('proposal', 'Draft a proposal'), ('erratum', 'Draft a correction'),
                                                   ('concern', 'Draft a concern'))))
                      for group, name, refs, task in GROUPS)
        return Design(title, 'See who holds records, how standards are reviewed and where to start a contribution.',
            Panel('Explore governance', (), (action('Read the charter', '/governance#charter'),
                  action('Inspect safeguards', '/governance#safeguards'), action('Find a working group', '/governance#working-groups'),
                  action('Prepare a contribution', '/governance#contribute'), action('Find answers', '/governance#faqs'))),
            Panel('Working groups', ('[Show all topics v]', 'Choose a group to read its remit and references.'),
                  tuple(action(name, f'/governance#{group}') for group, name, _, _ in GROUPS)),
            groups + (Panel('Prepare a contribution', ('[Group v] [Proposal, erratum or concern v]',
                      '[Issue and effect] [Current rule] [Expected behaviour]', '[Safe example] [Disclosure]',
                      '[Copy draft] [Download draft]', 'Submission channel unavailable. Your draft stays on this device.')),
                    Panel('Common questions', (), tuple(action(f'Expand: {name}', f'/governance#{anchor}')
                          for name, anchor in faq_names))), 'split')
    if route == '/search':
        return Design(title, 'Search by name, topic or exact identifier, or browse a collection.',
            Panel('Search NigeriaStack', ('[Search terms] [Search]', '[Collection v]', '[Sort] [Clear]',
                  'Results show the destination type and evidence status.', 'No matches: try another spelling or browse.'),
                  (action('Example result: Abuja Municipal Area Council', '/atlas/lga-774/FC/FC-AC-02'),
                   action('Example result: Hourglass specification', rfc('001')))),
            Panel('Browse collections', (), tuple(action(name, path) for path, name in PARENTS.items() if path != '/')),
            (Panel('Return from a result', ('Back keeps the search terms, filters and result position.',)),), 'table')
    if route in ('/atlas/states', '/atlas/lga-774'):
        councils = route.endswith('lga-774')
        example = '/atlas/lga-774/FC/FC-AC-02' if councils else '/atlas/states/FC'
        return Design(title, 'Browse council identities.' if councils else 'Browse state and FCT readiness records.',
            Panel('Find a council' if councils else 'Find a state or the FCT',
                  ('[Council name]' if councils else '[State or territory]',
                   '[State or territory v]' if councils else '[Region v]', '[Search] [Clear] [Sort]', 'No matches: change the term or clear filters.',
                   'Similar matches: choose a result by jurisdiction.'), (action(names[example], example),)),
            Panel('What a result means', ('Identity and operating evidence are reported separately.' if councils else
                  'The assessment status describes the available evidence.', 'Each record includes its source and review scope.'),
                  (action('Switch to state readiness' if councils else 'Switch to council identities',
                          '/atlas/states' if councils else '/atlas/lga-774'),)), (), 'table')
    if route == '/protocols/lga-governance-stack':
        return Design(title, 'Explore proposed ways councils can organise local services.',
            Panel('Choose a workflow', ('[Filter by service area v]',),
                  tuple(action(MODULE_TASKS[i], path) for i, path in enumerate(modules))),
            Panel('Implementation scope', ('Workflow proposal | Deployment not assessed',
                  'Check local authority and available service channels before adoption.'),
                  (action('Read the municipal specification', rfc('014')),
                   action('Find your council', '/atlas/lga-774'), action('Find the local services working group', '/governance#wg-05'))),
            (), 'split')
    if route.startswith('/sectors/'):
        identifier = route.rsplit('/', 1)[1]
        linked = tuple(action(names[rfc(ref[-3:])], rfc(ref[-3:]))
                       for ref in industries[identifier]['nigeriaStackIntervention']['rfcs'] if ref[-3:] in core)
        return Design(title, 'Read the scope, available evidence and standards for this industry.',
            Panel('Industry profile', (categories[identifier], 'Assessment: Not yet assessed', 'Gap: Unassigned',
                  'Maturity: Research proposal'), linked),
            Panel('Evidence and limits', ('Open the source and read the assessment scope.', f'Industry record: {identifier}',
                  'Further evidence is needed to assign a gap.'), (action('Return to industry comparison', '/sectors'),)),
            (Panel('Apply the profile', ('Verify the exact requirement before adoption.',),
                   (action('Suggest a correction', '/governance#contribute'),)),), 'split')
    if route.startswith('/protocols/lga-governance-stack/'):
        module_id = modules[route]['moduleId']
        task = MODULE_TASKS[int(module_id.split('-')[-1]) - 1]
        return Design(title, 'Proposed municipal workflow. Check the local service and responsible authority.',
            Panel('Use case', (task, 'Deployment: Not assessed', 'Legal mapping requires validation.'),
                  (action('Read the municipal specification', rfc('014')),)),
            Panel('Before adoption', ('Check the proposed steps, evidence and assisted access options.', module_id),
                  (action('Find the responsible council', '/atlas/lga-774'), action('Read the working group remit', '/governance#wg-05'))),
            (), 'split')
    if route.startswith('/protocols/'):
        task, number = GUIDES[route.rsplit('/', 1)[1]]
        targets = (action('Read the exact requirement', rfc(number)),)
        if number == '003':
            targets += (action('Read the transport reference', rfc('002')),)
        return Design(title, task, Panel('When to use this guide', ('Review the task, inputs and expected result.',), targets),
            Panel('Verification references', ('Use the requirement and source for this integration.',
                  'Runnable protocol check: unavailable.'), (action('Browse specification references', '/rfcs'),)),
            (Panel('Source and revision', ('Read the exact requirement for its current source revision.',)),), 'split')
    if route.startswith('/rfcs/'):
        number = route[-3:]
        record = core.get(number)
        if not record:
            return Design(title, 'Extended archive entry. Confirm current status before relying on it.',
                Panel('Read the extended entry', ('Lifecycle: Archived research material', 'Current authoritative association unavailable.'),
                      (action('Browse current core specifications', '/rfcs'),)),
                Panel('Source status', ('Source: admitted archive', 'Matching artefact and runnable check unavailable.')), (), 'split')
        group = GROUP_FOR[number]
        if number == '014':
            group += ' with Consent, privacy and public revenue'
        links = tuple(action('Read the working group remit', f'/governance#{key}') for key, _, refs, _ in GROUPS if number in refs.split())
        return Design(title, 'Read the exact requirement and inspect its source revision.',
            Panel('Requirements', ('Lifecycle: Candidate standard', f'Working group: {group}',
                  '[Contents] [Read requirement]'), links),
            Panel('Revision and references', (f'Revision: {record["blob"]}', 'Runnable protocol check: unavailable.'),
                  (action('Read the source specification', record['url']),)),
            (Panel('Confirm the verification scope', ('Use the same revision when comparing the requirement and its references.',)),), 'split')
    if route.startswith('/atlas/states/'):
        code = route.rsplit('/', 1)[1]
        region = states[code]['zone']
        return Design(title, f'{region} | Readiness and evidence for this jurisdiction.',
            Panel('Readiness by service area', tuple(f'{label}: Not yet assessed' for label in STATE_SECTIONS)),
            Panel('Evidence and service links', ('No verified assessment linked to these entries.',
                  'Use the council directory for local authority and identity.'),
                  (action('Browse councils for this jurisdiction', f'/atlas/lga-774?jurisdiction={quote(code)}'),)),
            (), 'split')
    if route.startswith('/atlas/lga-774/'):
        code, record_id = route.split('/')[-2:]
        identity = identities[record_id]
        return Design(title, f'{states[code]["name"]} | Council directory record',
            Panel('Council identity', (identity['name_status'], 'Readiness: Not yet assessed', 'Service availability: unverified.'),
                  (action('Read the jurisdiction profile', f'/atlas/states/{code}'),)),
            Panel('Responsible authority and evidence', ('See the source and identity review scope.',
                  'Check with the relevant authority before using a service.',
                  f'Identity review: {identity["reviewed"]}', f'Directory reference: {record_id}'),
                  (action('Inspect local workflow proposals', '/protocols/lga-governance-stack'),)), (), 'split')
    raise ValueError(f'Unknown route family: {route}')


def ascii_text(value):
    value = unicodedata.normalize('NFKD', value.translate(PLAIN_SYMBOLS))
    return value.encode('ascii', errors='ignore').decode('ascii')


def wrap(value, width):
    return textwrap.wrap(ascii_text(value), width=width, break_on_hyphens=False) or ['']


def panel_lines(panel, width):
    lines = [panel.title, '-' * min(width, len(ascii_text(panel.title)))]
    lines.extend(panel.lines)
    lines.extend(f'[ {item.label} ]' for item in panel.actions)
    return [part for line in lines for part in wrap(line, width)]


def frame(design, width, breadcrumb, return_label, heading_nav, notice):
    inside = width - 4
    border = '+' + '-' * (width - 2) + '+'
    rows = [border]

    def append(*items):
        for item in items:
            rows.extend('| ' + part.ljust(inside) + ' |' for part in wrap(item, inside))

    append('NigeriaStack    [Collections]    [Search]' if width >= 80 else 'NigeriaStack    [Menu]    [Search]')
    rows.append(border)
    if breadcrumb:
        append(breadcrumb)
    append(design.title, design.context)
    if return_label:
        append(return_label)
    rows.append(border)
    if width < 80 and design.layout == 'table':
        all_lines = design.primary.lines
        facet_lines = [line for line in all_lines if line.startswith('[') and ' v]' in line]
        unfaceted = tuple(line for line in all_lines if line not in facet_lines)
        if facet_lines:
            unfaceted = unfaceted[:1] + ('[ More filters ]',) + unfaceted[1:]
        design = replace(design, primary=replace(design.primary, lines=unfaceted),
                         secondary=replace(design.secondary, lines=tuple(
                             'Each result shows industry, sector and evidence.' if 'Industry | Sector' in line else line
                             for line in design.secondary.lines)))
    if width >= 80 and design.layout == 'split':
        left = (inside - 3) // 2
        right = inside - left - 3
        first = panel_lines(design.primary, left)
        second = panel_lines(design.secondary, right)
        for i in range(max(len(first), len(second))):
            append((first[i] if i < len(first) else '').ljust(left) + ' | ' +
                   (second[i] if i < len(second) else ''))
    else:
        for panel in (design.primary, design.secondary):
            append(*panel_lines(panel, inside))
            rows.append(border)
    for section in design.sections:
        if rows[-1] != border:
            rows.append(border)
        append(*panel_lines(section, inside))
    if heading_nav:
        if rows[-1] != border:
            rows.append(border)
        append('On this page', *[f'[ {item} ]' for item in heading_nav])
    if rows[-1] != border:
        rows.append(border)
    append('NigeriaStack approved lockup and project attribution',
           'Explore: [Industries] [Protocol guides] [Specifications] [Atlas]',
           'Project: [Charter] [Working Groups] [Open licence]',
           'Developer resources: [NigeriaStack on GitHub] [Specification source]')
    if notice:
        append('', '(Footer fine print)', notice)
    rows.append(border)
    result = '\n'.join(rows)
    if any(len(line) != width for line in rows) or not result.isascii():
        raise AssertionError('Invalid ASCII artboard extent')
    return result


def archive_name(route):
    return 'wireframes/' + (route.strip('/') + '/' if route != '/' else '') + 'index.md'


def write_zip(zip_out, name, body):
    info = ZipInfo(name, date_time=(2026, 11, 26, 0, 0, 0))
    info.compress_type = ZIP_DEFLATED
    info.external_attr = 0o100644 << 16
    zip_out.writestr(info, body)


def clean_title(route, row, core, states, identities, modules):
    baseline = row['rendered_candidate_h1']
    if route.startswith('/rfcs/') and route[-3:] in core:
        heading = core[route[-3:]]['heading']
        return heading.split(': ', 1)[1].replace('**', '').replace('`', '').replace('\\', '').strip()
    if route.startswith('/atlas/states/'):
        return states[route.rsplit('/', 1)[1]]['name']
    if route.startswith('/atlas/lga-774/'):
        item_id = route.rsplit('/', 1)[1]
        return identities[item_id]['title']
    if route in modules:
        return modules[route]['canonicalName']
    baseline = re.sub(r'^IND-\d+:\s*|\s*[-–—]\s*Interoperability Profile$', '', baseline)
    if route == '/protocols/lga-governance-stack':
        return 'Explore municipal workflows'
    return baseline


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--ledger', type=Path, required=True)
    parser.add_argument('--readback', type=Path, required=True)
    parser.add_argument('--project', type=Path, required=True)
    parser.add_argument('--dist', type=Path, help='Optional rebuilt candidate with exact standalone HTML pages')
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--verify-footer-notice', action='store_true',
                        help='Require the exact notice in the seven candidate parent footers only')
    args = parser.parse_args()
    if args.verify_footer_notice and not args.dist:
        parser.error('--verify-footer-notice requires --dist')
    args.output.mkdir(parents=True, exist_ok=True)
    with args.ledger.open(newline='', encoding='utf-8') as infile:
        ledger = list(csv.DictReader(infile))
    rows = {x['route']: x for x in ledger if x['standalone_page_units'] == '1'}
    counts = Counter(x['navigation_parent'] for x in rows.values())
    fragments = [x['route'] for x in ledger if x['scope'] == 'fragment_binding_review']
    assert len(rows) == 955 and len(ledger) == 960 and counts == LEDGER_COUNTS
    assert fragments == [f'/governance#{f}' for f in ('charter', 'safeguards', 'contribute', 'faqs')]
    assert len([x for x in ledger if x['navigation_binding'] == 'alternate_source_for_existing_url']) == 1

    atlas = args.project / 'content' / 'atlas'
    taxonomy_path = args.project / 'content' / 'taxonomy' / 'route-groups.json'
    industry_path = taxonomy_path.with_name('master-32-industry-matrix.json')
    state_path = atlas / 'subnational-36states-fct-atlas.json'
    identity_path = atlas / 'lga-774-constitutional-registry.json'
    module_path = atlas / 'lga-14-service-modules-spec.json'
    readback = load_json(args.readback)
    core = {item['id'][-3:]: item for item in readback['rfc']}
    categories = {item_id: group['name'] for group in load_json(taxonomy_path)['groups'] for item_id in group['industryIds']}
    industries = {item['industryId']: item for item in load_json(industry_path)['industries']}
    states = {item['code']: item for item in load_json(state_path)['jurisdictions']}
    identities = {}
    for state in load_json(identity_path)['statesAndTerritory']:
        for entry in state['lgas']:
            record_id, name = entry.split(':', 1)
            audit = state['identityAudit'][record_id]
            status = 'Name corroborated' if audit['nameStatus'] == 'CORROBORATED_NAME' else 'Name requires further review'
            identities[record_id] = {'title': name, 'name_status': status,
                                     'reviewed': audit.get('reviewedOn') or 'Date unavailable'}
    modules = {item['route']: item for item in load_json(module_path)['modules']}
    assert len(core) == 14 and len(categories) == len(industries) == 32 and len(states) == 37 and len(identities) == 774 and len(modules) == 14

    for route, row in rows.items():
        archive_id = route.rsplit('/', 1)[-1]
        if not archive_id.startswith('FC-AC-'):
            continue
        archived_title = row['rendered_candidate_h1'].removesuffix(' Area Council')
        matches = [record for record_id, record in identities.items()
                   if record_id.startswith('FC-LGA-') and record['title'] == archived_title]
        if len(matches) != 1:
            raise ValueError(f'Area council identity requires a single name match: {route}')
        identities[archive_id] = matches[0]

    app = args.project / 'apps' / 'archive-web-v25'
    copy_path = app / 'review_copy.py'
    copy = runpy.run_path(str(copy_path)) if copy_path.is_file() else {}
    parent_copy = copy.get('PARENT_COPY', {})
    secondary_copy = copy.get('SECONDARY_COPY', {})
    guide_copy = copy.get('GUIDE_COPY', {})
    reviewed_copy = {**parent_copy, **secondary_copy, **guide_copy}

    parsed = {}
    public_index = {}
    source_heading_register = {route: [] for route in PARENTS}
    prefix_family = {'HOME': '/', 'SEC': '/sectors', 'PRO': '/protocols', 'RFC': '/rfcs',
                     'ITB': '/conformance', 'ATL': '/atlas', 'GOV': '/governance'}
    for line in readback['headingRegister']:
        code, level, anchor, label = map(str.strip, line.strip('|').split('|', maxsplit=3))
        prefix = re.sub(r'\d+$', '', code)
        source_heading_register[prefix_family[prefix]].append((level.lower(), label, anchor))
    if args.dist:
        for route in rows:
            child = args.dist / route.strip('/') / 'index.html'
            payload = child.read_bytes()
            parsed[route] = RenderedPage(payload.decode()), sha(payload)
        actual_routes = {'/' + p.parent.relative_to(args.dist).as_posix().removeprefix('.') for p in args.dist.rglob('index.html')}
        if actual_routes != set(rows):
            raise ValueError(f'Candidate path drift: missing={set(rows)-actual_routes}, extra={actual_routes-set(rows)}')
        index_file = args.dist / 'api' / 'v1' / 'index.json'
        if index_file.is_file():
            candidate_records = load_json(index_file)['records']
            public_index = {record['url']: record for record in candidate_records}
            if len(candidate_records) != len(public_index) or set(public_index) != set(rows):
                raise ValueError('Candidate search index differs from the admitted route set')
        for route, (page, _) in parsed.items():
            if sum(level == 'h1' for level, _, _ in page.headings) != 1:
                raise ValueError(f'{route} does not have exactly one main H1')
            expected_notices = [(True, NOTICE_TEXT)] if route in PARENTS else []
            if args.verify_footer_notice and page.notices != expected_notices:
                raise ValueError(f'{route} differs from the approved footer notice placement or text')
    names = {route: clean_title(route, row, core, states, identities, modules) for route, row in rows.items()}
    names.update({route: text['h1'] for route, text in reviewed_copy.items() if route in rows and 'h1' in text})
    names.update({route: next(title for level, title, _ in page.headings if level == 'h1') for route, (page, _) in parsed.items()})
    govt_headings = copy.get('HEADING_COPY', {}).get('/governance', {})
    faq_names = tuple((govt_headings.get(anchor, label), anchor)
                      for level, label, anchor in source_heading_register['/governance'] if level == 'h4')
    if args.dist:
        final_governance = {anchor: title for _, title, anchor in parsed['/governance'][0].headings if anchor}
        faq_names = tuple((final_governance.get(anchor, label), anchor) for label, anchor in faq_names)
    assert len(faq_names) == 15

    output = args.output / 'NigeriaStack-v25-ASCII-Wireframes.zip'
    index = io.StringIO(newline='')
    fields = ['route', 'navigation_parent', 'collection_return', 'h1', 'wireframe', 'viewports_css_px',
              'source_sha256', 'rendered_html_sha256', 'artboard_sha256']
    writer = csv.DictWriter(index, fields)
    writer.writeheader()
    edge_data = []
    live_coverage = Counter()
    faq_targets = {f'/governance#{anchor}' for _, anchor in faq_names}
    flow_target_paths = faq_targets | set(fragments) | {f'/governance#{key}' for key, _, _, _ in GROUPS} | {'/governance#working-groups'}

    with ZipFile(output, 'w') as zip_out:
        for route, row in rows.items():
            design = design_for(route, names, core, categories, industries, states, identities, modules, faq_names)
            if route in reviewed_copy:
                design = replace(design, context=reviewed_copy[route].get('lead', design.context))
            if route == '/' and 'HOME_TASKS' in copy:
                design = replace(design, primary=replace(design.primary, actions=tuple(
                    action(label, '/governance#safeguards' if path == '/governance' else path)
                    for path, label, _ in copy['HOME_TASKS'])))
            trail = row['navigation_path'].split(' > ')
            prior = trail[-2] if len(trail) > 1 else ''
            collection_name = COLLECTIONS.get(prior, '')
            return_label = f'[ Back to {collection_name} ]' if prior else ''
            breadcrumb = ' > '.join(['Home', *(COLLECTIONS[path] for path in trail[:-1] if path != '/')]) if route != '/' else ''
            page_data, rendered_sha = parsed.get(route, (None, ''))
            source_headings = source_heading_register.get(route, [])
            page_outline = page_data.headings if page_data else source_headings
            on_page = [name for level, name, _ in page_outline if level == 'h2']
            if prior:
                edge_data.append({'origin': prior, 'target': route, 'action': f'Open {design.title}',
                                  'kind': 'collection_result', 'availability': 'Collection or search result'})
            elif route != '/':
                edge_data.append({'origin': '/', 'target': route, 'action': PARENTS[route],
                                  'kind': 'global_navigation', 'availability': 'Shared navigation'})
            all_actions = tuple(x for panel in (design.primary, design.secondary, *design.sections) for x in panel.actions)
            if route == '/governance':
                all_actions += (action('Browse the project on GitHub', 'https://github.com/nigeriastack'),)
            if prior:
                all_actions += (action(f'Back to {collection_name}', prior),)
            edges = list(dict.fromkeys(all_actions))
            for edge in edges:
                parts = urlsplit(edge.target)
                if parts.scheme:
                    assert parts.scheme == 'https' and parts.netloc == 'github.com'
                elif parts.path not in rows or parts.fragment and (parts.path + '#' + parts.fragment) not in flow_target_paths:
                    raise ValueError(f'Unknown approved handoff from {route}: {edge.target}')
                result = dict(origin=route, target=edge.target, action=edge.label, kind='artboard_action')
                if page_data and not parts.scheme:
                    matches = []
                    for href in page_data.links:
                        link = urlsplit(href)
                        href_path = (unquote(link.path).rstrip('/') or '/') if link.path else route
                        if not link.netloc and href_path == parts.path and link.fragment == parts.fragment:
                            matches.append(link)
                    result['rendered_href_present'] = bool(matches)
                    result['rendered_exact_query_present'] = any(parse_qsl(x.query) == parse_qsl(parts.query) for x in matches)
                    if parts.fragment:
                        result['rendered_target_fragment_present'] = parts.fragment in parsed[parts.path][0].fragments
                    live_coverage['present' if matches else 'not_present'] += 1
                edge_data.append(result)
            doc = [f'# {design.title}', '', f'Route `{route}` · Parent `{row["navigation_parent"]}`', '',
                   f'Source `{row["source_sha256"]}`' + (f' · Candidate `{rendered_sha}`' if rendered_sha else ''), '',
                   '## Entry and onward paths', '']
            if prior:
                doc.extend((f'From [{collection_name}]({prior}), choose **{design.title}**. A shared link opens this record directly.', ''))
            elif route != '/':
                doc.extend((f'From [Home](/), open **{PARENTS[route]}** or use the same task link in shared navigation.', ''))
            doc.extend(('| Action | Destination |', '| --- | --- |'))
            for edge in edges:
                escaped = edge.label.replace('|', '\\|')
                doc.append(f'| {escaped} | `{edge.target}` |')
            doc.extend(('', '## Return and recovery', '',
                        'Return from a shared link through the breadcrumb or collection link. Browser Back retains the query, selected filters, sort and result position where applicable. Search return uses same-origin state. When a result is unavailable, provide a reset or a source-led browse path.', ''))
            for viewport, width in WIDTHS.items():
                artboard = frame(design, width, breadcrumb, return_label, on_page,
                                  NOTICE_TEXT if route in PARENTS else '')
                doc.extend((f'## {viewport} CSS px', '', '```text', artboard, '```', ''))
            if page_outline:
                doc.extend(('## Source outline', '', '| Level | Heading | Anchor |', '| --- | --- | --- |'))
                for level, label, anchor in page_outline:
                    escaped = label.replace('|', '\\|')
                    doc.append(f'| {level.upper()} | {escaped} | `{anchor}` |')
                doc.append('')
            payload = ('\n'.join(doc) + '\n').encode()
            name = archive_name(route)
            write_zip(zip_out, name, payload)
            writer.writerow(dict(route=route, navigation_parent=row['navigation_parent'], collection_return=prior, h1=design.title,
                                 wireframe=name, viewports_css_px='1440 768 390 320', source_sha256=row['source_sha256'],
                                 rendered_html_sha256=rendered_sha, artboard_sha256=sha(payload)))
        receipt = {'routes': len(rows), 'viewports': list(WIDTHS), 'artboards': len(rows) * len(WIDTHS),
                   'navigation_parent_counts': dict(counts), 'ledger_bindings': len(ledger),
                   'legacy_governance_fragments': fragments, 'new_working_group_fragments': sorted(f'/governance#{key}' for key, _, _, _ in GROUPS),
                   'legacy_faq_fragments': sorted(faq_targets),
                   'source_sha256': {path.name: sha(path.read_bytes()) for path in
                                     (args.ledger, args.readback, taxonomy_path, industry_path, state_path,
                                      identity_path, module_path, copy_path) if path.is_file()},
                   'input_candidate_html_pages': len(parsed), 'candidate_search_index_routes': len(public_index),
                   'rendered_href_observations': dict(live_coverage),
                   'artboard_footer_notice_routes': sorted(PARENTS),
                   'candidate_parent_notices_verified': args.verify_footer_notice,
                   'candidate_governance_fragment_coverage': (sum(
                       urlsplit(target).fragment in parsed['/governance'][0].fragments for target in flow_target_paths)
                       if parsed else None), 'intended_governance_fragments': len(flow_target_paths),
                   'parent_to_child_entry_edges': sum(edge['kind'] == 'collection_result' for edge in edge_data),
                   'global_navigation_edges': sum(edge['kind'] == 'global_navigation' for edge in edge_data),
                   'verification_scope': 'Exact route set, frame dimensions, source join and intended linkage. Browser geometry, task completion and rendered behavior require separate observation.'}
        write_zip(zip_out, 'route-index.csv', index.getvalue())
        write_zip(zip_out, 'handoffs.json', json.dumps(edge_data, ensure_ascii=False, indent=2))
        write_zip(zip_out, 'receipt.json', json.dumps(receipt, ensure_ascii=False, indent=2))
        write_zip(zip_out, 'generate_wireframes.py', Path(__file__).read_bytes())
        guide = Path(__file__).with_name('NigeriaStack-v25-Wireframe-Guide.md')
        write_zip(zip_out, guide.name, guide.read_bytes())

    with ZipFile(output) as readback_zip:
        assert readback_zip.testzip() is None
        for row in csv.DictReader(io.StringIO(readback_zip.read('route-index.csv').decode())):
            payload = readback_zip.read(row['wireframe'])
            assert sha(payload) == row['artboard_sha256']
            assert payload.count(b'```text\n') == 4
    receipt['archive_sha256'] = sha(output.read_bytes())
    (args.output / 'wireframe-receipt.json').write_text(json.dumps(receipt, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(receipt, indent=2))


if __name__ == '__main__':
    main()
