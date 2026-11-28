"""Render the approved archive review experience without changing its URL set."""

from html import escape
import json
import re
import subprocess
from urllib.parse import urlencode

from lxml import html

from review_copy import (ATLAS_TASKS, CHECK_COPY, CONTRIBUTION_COPY, FAQ_ANSWERS,
                         GUIDE_COPY, HEADING_COPY, HOME_TASKS, PARENT_COPY,
                         PARENT_RETURN_LABELS, RFC_STATUS_COPY, SECTION_COPY,
                         SECONDARY_COPY, WORKING_GROUPS)
from review_data import ATLAS_SOURCE, CHARTER, GAP_LABELS, GUIDES, LEDGER_SOURCE

GITHUB_ORG = 'https://github.com/nigeriastack'
SPECIFICATION_REPO = GITHUB_ORG + '/protocol-specifications'
NUMBERING = re.compile(r'^\s*\d+\.(?:\d+(?:\.\d+)*)?\.?\s*')
TASK_TOPICS = tuple(dict.fromkeys(row[1] for row in GUIDES.values()))
REVIEW_ASSETS = ('tokens.css', 'review.css', 'review.mjs')
COLLECTION_INDEXES = {
    'industries': {'industries'}, 'specifications': {'specifications'},
    'guides': {'guides', 'municipal'}, 'municipal': {'municipal'},
    'atlas': {'states', 'councils'}, 'states': {'states'}, 'councils': {'councils'},
}


def paragraph(value):
    return f'<p>{escape(value)}</p>'


def link(url, label, attrs=''):
    path, delimiter, query = url.partition('?')
    if delimiter and path.startswith('/') and not path.startswith('//'):
        # Static directory hosts can drop query values while adding their slash.
        url = f'{path.rstrip("/")}/?{query}'
    return f'<a href="{escape(url)}"{attrs}>{escape(label)}</a>'


def links(items):
    return '<ul class="link-list">' + ''.join(f'<li>{link(url, label)}</li>' for url, label in items) + '</ul>'


def native_select(name, label, options, prompt='Any'):
    entries = ''.join(f'<option value="{escape(value)}">{escape(text)}</option>' for value, text in options)
    return f'<label>{escape(label)}<select name="{name}"><option value="">{escape(prompt)}</option>{entries}</select></label>'


def input_field(name, label, placeholder=''):
    return f'<label>{escape(label)}<input type="search" name="{name}" maxlength="120" placeholder="{escape(placeholder)}"></label>'


def rfc_link(model, identifier):
    record = model.rfcs[identifier]
    return link(f'/rfcs/{identifier}', record['title'])


def record_links(model, identifiers):
    return links((f'/rfcs/{rfc}', model.rfcs[rfc]['title']) for rfc in identifiers)


def task_nav(items, label):
    entries = ''.join(f'<li>{link(url, title)}{paragraph(description)}</li>' for url, title, description in items)
    return f'<nav class="task-index" aria-label="{escape(label)}"><ul>{entries}</ul></nav>'


def collection(kind, label, fields, table=False, export=False, fallback='#browse-records', filters=''):
    grid = ''
    if table:
        cells = ''.join(f'<th scope="col">{entry}</th>' for entry in ('Industry', 'Sector', 'Gap', 'Maturity', 'Evidence'))
        grid = (f'<div class="table-results"><table><caption>Industry results</caption><thead><tr>{cells}</tr></thead>'
                '<tbody data-results data-columns="title sector gap maturity status"></tbody></table></div>')
    download = '<button type="button" data-export>Export results as JSON</button>' if export else ''
    facets = f'<details class="filter-options" data-filter-options open><summary>More filters</summary><div class="filter-fields">{filters}</div></details>' if filters else ''
    return f'''<section class="collection" data-collection-region aria-label="{escape(label)}">
<form data-collection="{kind}" aria-label="{escape(label)}">
<div class="filter-fields">{fields}</div>{facets}
<div class="form-actions"><button type="submit">Apply</button><button type="button" data-clear>Clear</button>{download}</div>
</form>
<p class="result-status" role="status" aria-live="polite" data-status></p>
{grid}<ul class="record-results{' narrow-results' if table else ''}" data-results></ul>
<div class="form-actions" data-pagination hidden><button type="button" data-previous>Previous results</button><button type="button" data-next>More results</button></div>
<noscript><p>Search and filters use JavaScript. {link(fallback, 'Browse the directory')}.</p></noscript>
</section>'''


def state_options(model):
    return sorted((row['stateCode'], row['stateName']) for row in model.states.values())


def browse(items, title='Browse the full list'):
    return f'<details id="browse-records" class="reference"><summary>{escape(title)}</summary>{links(items)}</details>'


def home(model):
    tasks = tuple(('/governance#safeguards', text, copy) if route == '/governance' else (route, text, copy)
                  for route, text, copy in HOME_TASKS)
    architecture = (
        ('Industry workflows', '/sectors'), ('Open exchange protocols', '/protocols'),
        ('Trusted records', '/protocols/sure-evidence'), ('Public institution systems', '/governance#charter'),
        ('Offline operations', '/protocols/kioskbase-registries'),
    )
    layers = ''.join(f'<li>{link(url, label)}</li>' for label, url in architecture)
    return ('<div class="home-composition">' + task_nav(tasks, 'Choose a task')
            + f'<section class="architecture" aria-label="How systems connect"><p class="panel-title">How systems connect</p><ul>{layers}</ul>'
              f'<p>{rfc_link(model, "NS-RFC-001")}</p></section></div>'
            + f'<p class="source-action">{link(GITHUB_ORG, "Browse NigeriaStack on GitHub")}</p>')


def industries(model):
    sectors = [(row['name'], row['name']) for row in model.groups]
    gaps = [('Unassigned', 'Unassigned')] + [(name, name) for name in GAP_LABELS]
    maturity = [(value, value) for value in ('Research proposal', 'Live anchor', 'Normative draft', 'Research charter')]
    fields = input_field('q', 'Industry or workflow', 'Payments or IND-01')
    filters = (native_select('sector', 'Sector', sectors) + native_select('gap', 'Gap', gaps)
               + native_select('maturity', 'Maturity', maturity)
               + native_select('sort', 'Sort by', [('title', 'Name'), ('id', 'Identifier')], 'Best match'))
    directory = sorted((route, model.industries[route.rsplit('/', 1)[1]]['name'])
                       for route in model.pages if route.startswith('/sectors/'))
    return collection('industries', 'Filter industries', fields, table=True, export=True, filters=filters) + browse(directory, 'Browse all industries')


def protocols(model):
    fields = input_field('q', 'Search guides', 'Safe retry') + native_select('topic', 'What do you need to do?', [(value, value) for value in TASK_TOPICS], 'Any task')
    directory = [(route, GUIDE_COPY[route]['h1']) for route in GUIDES]
    return (collection('guides', 'Find a protocol guide', fields) + browse(directory, 'Browse all protocol guides')
            + f'<div class="context-link">{link("/protocols/lga-governance-stack", "Explore municipal workflows")}</div>')


def registrations(model):
    fields = input_field('id', 'Exact RFC identifier', 'NS-RFC-001') + input_field('q', 'Topic', 'Safe retry')
    filters = (native_select('status', 'Approval status', [(label, label) for label in ('Candidate standard', 'Draft', 'Ratified standard', 'Unverified')])
               + native_select('track', 'Track', [('Core', 'Core'), ('Extended', 'Extended archive')]))
    directory = [(route, record['title']) for identifier, record in model.rfcs.items() for route in [f'/rfcs/{identifier}']]
    directory.extend((route, f'Archive profile {route.rsplit("/", 1)[1]}') for route in model.pages
                     if route.startswith('/rfcs/') and route.rsplit('/', 1)[1] not in model.rfcs)
    return (collection('specifications', 'Search the specification registry', fields, filters=filters)
            + browse(directory, 'Browse the specification index')
            + f'<p class="source-action">{link(SPECIFICATION_REPO, "Browse the specification source on GitHub")}</p>')


def atlas_tools(model, scope):
    field = input_field('q', 'Place name or directory code', 'AMAC or Federal Capital Territory')
    if scope == 'atlas':
        field += native_select('scope', 'Record type', [('states', 'State or FCT'), ('councils', 'Council or area council')], 'All places')
    if scope in ('atlas', 'councils'):
        options = [(code, label) for code, label in sorted(state_options(model), key=lambda row: row[1])]
        field += native_select('jurisdiction', 'State or territory', options)
    if scope == 'atlas':
        fallback = task_nav(ATLAS_TASKS, 'Browse a directory')
        return fallback + collection(scope, 'Find a place', field, fallback='/atlas/lga-774') + f'<p>{link("/protocols/lga-governance-stack", "Explore proposed municipal workflows")}</p>'
    if scope == 'states':
        directory = [(f'/atlas/states/{code}', name) for code, name in state_options(model)]
    else:
        directory = sorted((route, f'{record["name"]} in {model.states[record["state"]]["stateName"]}') for route, record in model.councils.items())
    other = ('/atlas/lga-774', 'Switch to the council directory') if scope == 'states' else ('/atlas/states', 'Switch to states and the FCT')
    return collection(scope, 'Find a place', field) + browse(directory) + f'<p>{link(*other)}</p>'


def conformance():
    return f'''<span class="bookmark" id="test-input"></span><span class="bookmark" id="payload-input-and-sandbox-configuration"></span>
<form class="tool check-tool" id="local-verifier" aria-label="Sample payload check">
<p id="test-scope">{escape(CHECK_COPY['scope'])}</p>
<label for="test-payload">{escape(CHECK_COPY['input'])}</label>
<textarea id="test-payload" rows="5" maxlength="8192" aria-describedby="test-scope" required></textarea>
<div class="form-actions"><button type="button" data-example>{escape(CHECK_COPY['example'])}</button>
<button type="submit">{escape(CHECK_COPY['run'])}</button><button type="button" data-receipt hidden>{escape(CHECK_COPY['download'])}</button></div>
<p role="status" data-status></p><noscript><p>The check uses JavaScript.</p></noscript>
</form>'''


def group_record(model, identifier, group):
    actions = [('proposal', 'Draft a proposal'), ('erratum', 'Draft a correction'), ('concern', 'Draft a concern')]
    draft = links((f'/governance?{urlencode({"group": identifier, "task": key})}#contribute', label) for key, label in actions)
    specs = []
    for rfc in group['rfcs']:
        joint = ' (joint review)' if rfc == 'NS-RFC-014' and identifier == 'wg-03' else ''
        specs.append(f'<li>{rfc_link(model, rfc)}{joint}</li>')
    return (f'<details class="working-group" id="{identifier}" data-working-group>'
            f'<summary>{escape(group["title"])}</summary>{paragraph(group["remit"])}{paragraph(group["examples"])}'
            f'<ul class="link-list">{"".join(specs)}</ul>{paragraph(CONTRIBUTION_COPY["evidence_unavailable"])}'
            f'<p>{link(CHARTER + "#5-multi-stakeholder-governance--the-6-standards-working-groups", "Read the charter remit")}</p>{draft}</details>')


def draft_form():
    names = [('problem', 'Problem'), ('affected', 'Who it affects'), ('binding', 'Clause or requirement'),
             ('expected', 'Expected change'), ('example', 'Example with sample data'), ('disclosure', 'Relevant interests to disclose')]
    textareas = ''.join(f'<label>{label}<textarea rows="2" maxlength="2000" name="{field}"{" required" if field == "problem" else ""}></textarea></label>' for field, label in names)
    groups = native_select('group', 'Working Group', [(key, row['title']) for key, row in WORKING_GROUPS.items()], 'Choose a group')
    tasks = native_select('task', 'Type of contribution', [('proposal', 'Proposal'), ('erratum', 'Correction'), ('concern', 'Concern')], 'Choose a type')
    return f'''<form data-proposal-draft method="dialog" class="tool draft-form" aria-label="Prepare a local draft">
{paragraph(CONTRIBUTION_COPY['availability'])}{paragraph(CONTRIBUTION_COPY['instructions'])}
<div class="filter-fields">{groups}{tasks}{input_field('rfc', 'RFC identifier, if applicable')}{input_field('revision', 'Source revision, if known')}</div>
{paragraph(CONTRIBUTION_COPY['disclosure'])}{textareas}
<div class="form-actions"><button type="submit">Prepare draft</button><button type="button" data-copy-draft>Copy draft</button>
<button type="button" data-download-draft>Download draft</button></div>
<label>Local draft<textarea data-draft-output rows="6" readonly></textarea></label><p role="status" data-draft-status></p>
<noscript><p>Preparing a draft uses JavaScript. Use the checklist above to prepare a draft offline.</p></noscript></form>'''


def governance(model, heading, label, section):
    anchor = heading.get('id')
    if anchor in FAQ_ANSWERS:
        return (f'<details class="answer" data-answer="{anchor}"><summary>{escape(label)}</summary>'
                f'<h4 id="{anchor}">{escape(label)}</h4>{paragraph(FAQ_ANSWERS[anchor])}'
                '<button type="button" data-copy-answer>Copy answer link</button><p role="status" data-answer-status></p></details>')
    result = heading_markup(heading, label) + section
    if anchor == 'charter':
        result += paragraph('The institutional charter sets the independence and participation rules for the commons.') + f'<p>{link(CHARTER, "Read the institutional charter")}</p>'
    if anchor == 'safeguards':
        result += f'<p>{link(CHARTER, "Read the safeguards and disclosure policy")}</p>'
    if anchor == 'working-groups':
        result += '<label>Find a group by topic<select data-group-filter><option value="">All topics</option>' + ''.join(
            f'<option value="{key}">{escape(value["title"])}</option>' for key, value in WORKING_GROUPS.items()) + '</select></label><p role="status" data-group-status></p>'
    pairs = {
        'core-architecture--evidence-working-groups-wg-01--wg-02': ('wg-01', 'wg-02'),
        'financial-consent--commerce-working-groups-wg-03--wg-04': ('wg-03', 'wg-04'),
        'civic-offline--agent-safety-working-groups-wg-05--wg-06': ('wg-05', 'wg-06'),
    }
    if anchor in pairs:
        result += '<div class="group-list">' + ''.join(group_record(model, key, WORKING_GROUPS[key]) for key in pairs[anchor]) + '</div>'
    if anchor == 'submitting-standards-extensions--errata':
        result += draft_form() + f'<p class="source-action">{link(GITHUB_ORG, "Browse the project on GitHub")}</p>'
    return result


def heading_markup(node, value):
    identifier = node.get('id')
    attribute = f' id="{escape(identifier)}"' if identifier else ''
    return f'<{node.tag}{attribute}>{escape(value)}</{node.tag}>'


def archive_outline(route, root, model):
    sections = []
    headings = HEADING_COPY.get(route, {})
    copy = SECTION_COPY.get(route, {})
    for node in root.xpath('.//h2|.//h3|.//h4|.//h5|.//h6'):
        anchor = node.get('id', '')
        original = node.text_content()
        label = headings.get(anchor, NUMBERING.sub('', original))
        text = paragraph(copy[anchor]) if anchor in copy else ''
        if route == '/governance':
            sections.append(governance(model, node, label, text))
            continue
        if route == '/rfcs':
            match = re.match(r'(NS-RFC-\d{3}):', original)
            if match:
                identifier = match.group(1)
                label = model.rfcs[identifier]['title']
                text = f'<p>{rfc_link(model, identifier)}</p>'
            if anchor == 'draft-candidate-standard-ratified-standard-extended-track':
                text = paragraph('Core records shown here are candidate standards. Extended archive profiles have unverified approval status.')
        industry = re.match(r'^(IND-\d{2}):', original)
        if route == '/sectors' and industry:
            identifier = industry.group(1)
            destination = next(path for path in model.pages if path.endswith('/' + identifier))
            label = model.industries[identifier]['name']
            text = f'<p>{link(destination, "Read industry profile")}</p>'
        if route == '/conformance' and anchor in REF_CHECKS:
            text += record_links(model, REF_CHECKS[anchor])
        if route == '/conformance' and anchor == 'test-input':
            sections.append(f'<h3>{escape(label)}</h3><p>{link("#test-payload", "Go to the sample input")}</p>')
            continue
        if anchor in SECTION_LINKS:
            text += links(SECTION_LINKS[anchor])
        sections.append(heading_markup(node, label) + text)
    content = ''.join(sections)
    if route == '/governance':
        return content
    if route == '/conformance':
        return f'<section class="reference-content" aria-label="Check scope and references">{content}</section>'
    return f'<details class="reference" data-outline><summary>Read the reference notes</summary>{content}</details>'


REF_CHECKS = {
    'cryptographic-evidence-checks-sureevidence--ns-rfc-001': ('NS-RFC-005',),
    'consent--revocation-envelopes-clearam--ns-rfc-002': ('NS-RFC-006',),
    'idempotency--treasury-routing-confluence--ns-rfc-003--ns-rfc-009': ('NS-RFC-003', 'NS-RFC-009'),
    'delegated-authority-guardrails-givepower--ns-rfc-008': ('NS-RFC-008',),
}
SECTION_LINKS = {
    'cryptographic-evidence-sureevidence': (('/protocols/sure-evidence', 'Read the SureEvidence guide'), ('/rfcs/NS-RFC-005', 'Read the specification')),
    'permitted-consent-envelopes-clearam': (('/protocols/clearam-consent', 'Read the ClearAm guide'), ('/rfcs/NS-RFC-006', 'Read the specification')),
    'offline-store-and-forward-sync-kioskbase': (('/protocols/kioskbase-registries', 'Read the KioskBase guide'), ('/rfcs/NS-RFC-004', 'Read the specification')),
    'submitting-new-industry-workflow-rfcs': (('/governance#contribute', 'Prepare a local draft'),),
}


def review_footer(wordmark, notice, attribution):
    groups = (
        ('Explore', (('/sectors', 'Industries'), ('/protocols', 'Protocol guides'),
                     ('/rfcs', 'Specifications'), ('/atlas', 'Atlas'))),
        ('Project', (('/governance#charter', 'Charter'), ('/governance#working-groups', 'Working Groups'),
                     ('https://creativecommons.org/publicdomain/zero/1.0/', 'Open licence'))),
        ('Developer resources', ((GITHUB_ORG, 'NigeriaStack on GitHub'), (SPECIFICATION_REPO, 'Specification source'))),
    )
    navigation = ''.join(f'<nav aria-label="{label}"><p class="footer-label">{label}</p>{links(items)}</nav>'
                         for label, items in groups)
    identity = f'<div class="footer-brand">{wordmark}<p>Independent commons for open technical specifications.</p><p>{link("https://digiteco.org", attribution)}</p></div>'
    return f'<div class="frame footer-inner">{identity}{navigation}</div>' + (f'<div class="frame">{notice}</div>' if notice else '')


def source_notice(archive):
    notice = archive.xpath('./blockquote[1]')[0]
    notice.set('class', 'footer-notice')
    return html.tostring(notice, encoding='unicode')


def child_navigation(route):
    family = '/' + route.split('/')[1]
    if route == '/search':
        family = '/'
    collection_route = family
    if route.startswith('/protocols/lga-governance-stack/'):
        collection_route = '/protocols/lga-governance-stack'
    if route.startswith('/atlas/states/'):
        collection_route = '/atlas/states'
    if route.startswith('/atlas/lga-774/'):
        collection_route = '/atlas/lga-774'
    destinations = tuple(dict.fromkeys((family, collection_route)))
    entries = [link(url, PARENT_RETURN_LABELS[url], ' data-return-collection') for url in destinations]
    entries.append(link('/search', 'Back to search', ' data-return-search hidden'))
    return '<nav class="record-return" aria-label="Return to browse">' + ''.join(entries) + '</nav>'


def compatibility_anchors(source, excluded=()):
    ids = [node.get('id') for node in source.xpath('.//*[@id]')]
    return ''.join(f'<span class="bookmark" id="{escape(identifier)}"></span>' for identifier in dict.fromkeys(ids) if identifier not in excluded)


def child_sections(source, sections):
    old_sections = source.xpath('./h2')
    groups = [[] for _ in old_sections]
    for pos, heading in enumerate(old_sections):
        groups[pos].append(heading.get('id'))
        element = heading.getnext()
        while element is not None and element.tag != 'h2':
            groups[pos].extend(element.xpath('descendant-or-self::*[@id]/@id'))
            element = element.getnext()
    output = []
    for index, (title, content) in enumerate(sections):
        ids = [identifier for group in (groups[index:] if index == len(sections) - 1 else groups[index:index + 1]) for identifier in group if identifier]
        heading_attr = f' id="{escape(ids[0])}"' if ids else ''
        anchors = ''.join(f'<span class="bookmark" id="{escape(identifier)}"></span>' for identifier in dict.fromkeys(ids[1:]))
        output.append(f'<section class="record-section">{anchors}<h2{heading_attr}>{escape(title)}</h2>{content}</section>')
    return ''.join(output)


def reader_requirements(record):
    pieces = record['markdown'].splitlines()
    first_section = next((index for index, line in enumerate(pieces) if line.startswith('## ')), len(pieces))
    markup = subprocess.run(['pandoc', '-f', 'gfm-raw_html-smart', '-t', 'html5', '--wrap=none'],
                            input='\n'.join(pieces[first_section:]), text=True, capture_output=True, check=True).stdout
    root = html.fragment_fromstring(markup, create_parent='div')
    for node in root.xpath('.//h1|.//h2|.//h3|.//h4|.//h5|.//h6'):
        node.tag = f'h{min(6, max(3, int(node.tag[-1]) + 1))}'
        node.attrib.pop('id', None)
        title = NUMBERING.sub('', node.text_content()).lstrip('\\) ')
        node.clear(keep_tail=True)
        node.text = title
    for table in root.xpath('.//table'):
        for heading in table.xpath('./thead/tr/th'):
            heading.set('scope', 'col')
        wrapper = html.Element('div', {'class': 'table-scroll', 'tabindex': '0', 'role': 'region', 'aria-label': 'Specification table'})
        table.addprevious(wrapper)
        wrapper.append(table)
    # The reader labels this source state in public terms. The linked source retains the literal field values.
    return ''.join(html.tostring(element, encoding='unicode') for element in root).replace('DRAFT_UNPUBLISHED', 'Unpublished draft')


def rfc_reader(route, archive, model):
    identifier = route.rsplit('/', 1)[1]
    record = model.rfcs.get(identifier)
    if record is None:
        title = 'Extended specification profile'
        lead = RFC_STATUS_COPY['extended_scope']
        sections = [('Find a current specification', links([('/rfcs?track=Core', 'Browse core specifications'), ('/governance#working-groups', 'Find a Working Group')])
                     + f'<details class="reference"><summary>Source identifier</summary><p><code>{identifier}</code></p></details>')]
        return title, lead, child_sections(archive, sections), {'id': identifier, 'kind': 'specifications', 'status': 'Unverified', 'track': 'Extended',
            'meta': {'title': f'{identifier} archive profile | NigeriaStack',
                     'description': f'Read the preserved {identifier} profile and see which approval and Working Group details require verification.'},
        }
    title = record['title']
    group = record['group']
    contribution = '/governance?' + urlencode({'group': group, 'task': 'erratum', 'rfc': identifier, 'revision': record['blob']}) + '#contribute'
    related = [(f'/governance#{group}', WORKING_GROUPS[group]['title'])]
    if identifier == 'NS-RFC-014':
        related.extend([('/governance#wg-03', 'Joint review with the consent, privacy and public revenue group'), ('/protocols/lga-governance-stack', 'Browse municipal workflows')])
    artifacts = (paragraph(CHECK_COPY['reference_only']) + links([(record['url'], 'Read the source specification'),
                   (contribution, 'Prepare a correction for this revision')])
                 + f'<details class="reference"><summary>Source identifiers</summary><p>Specification <code>{identifier}</code></p>'
                   f'<p>Source revision <code>{record["blob"]}</code></p></details>')
    heading = archive.xpath('./h2[1]')[0]
    req_heading = archive.xpath('./h2[2]')[0]
    kept_ids = {heading.get('id'), req_heading.get('id'), archive.xpath('./h1')[0].get('id')}
    content = (f'<section class="record-section">{heading_markup(heading, "Status and Working Group")}'
               + paragraph(RFC_STATUS_COPY['core']) + links(related) + '</section>'
               + f'<div class="reader">{compatibility_anchors(archive, kept_ids)}<section>{heading_markup(req_heading, "Requirements")}'
               + '<details class="reference technical-requirements"><summary>Read technical requirements</summary>'
               + reader_requirements(record) + '</details></section><aside aria-label="Source and verification"><h2>Source and verification</h2>'
               + artifacts + '</aside></div>')
    return title, record['summary'], content, {
        'id': identifier, 'kind': 'specifications', 'status': RFC_STATUS_COPY['core'], 'track': 'Core',
        'meta': {'title': f'{title} | NigeriaStack specification'},
    }


def guide_record(route, archive, model):
    copy = GUIDE_COPY[route]
    topic, primary, related = GUIDES[route][1:4]
    sections = [(topic, paragraph(GUIDES[route][4])),
                ('Applicable specifications', record_links(model, (primary, *related))),
                ('Check and reference', paragraph(CHECK_COPY['reference_only']) + f'<p>{link(model.rfcs[primary]["url"], "Read the source")}</p>')]
    return copy['h1'], copy['lead'], child_sections(archive, sections), {'kind': 'guides', 'topics': [topic]}


def industry_record(route, archive, model):
    identifier = route.rsplit('/', 1)[1]
    record = model.industries[identifier]
    category = model.sector_by_industry[identifier]
    proposals = tuple(key for key in record['nigeriaStackIntervention']['rfcs'] if key in model.rfcs)
    provenance = record['assessmentProvenance']
    sections = [('Evidence and gaps', paragraph(f'Assessment: Not yet assessed. Gap: Unassigned. Maturity: Research proposal. Reviewed {provenance["reviewedOn"]}.')
                 + f'<p>{link(LEDGER_SOURCE, "Read the industry ledger")}</p>'),
                ('Related specifications', record_links(model, proposals) + paragraph('These are proposed bindings. Confirm which specifications fit your workflow before adoption.')),
                ('Prepare a correction', f'<p>{link("/governance#contribute", "Share a source or prepare a local draft")}</p>')]
    return record['name'], f'{category}. See the proposed integration references and current evidence.', child_sections(archive, sections), {
        'kind': 'industries', 'id': identifier, 'sector': category, 'gap': 'Unassigned', 'maturity': 'Research proposal', 'status': 'Not yet assessed',
        'aliases': [model.rfcs[rfc]['title'] for rfc in proposals],
        'meta': {'description': f'Find proposed NigeriaStack specifications for {record["name"]} and see the current industry assessment.'},
    }


def state_record(route, archive, model):
    code = route.rsplit('/', 1)[1]
    record = model.states[code]
    provenance = model.readiness[code]['assessmentProvenance']
    values = ''.join(f'<div><dt>{escape(label)}</dt><dd>Not yet assessed</dd></div>' for label in model.dimensions.values())
    sections = [('Directory record', paragraph(f'{record["zone"]}. Administrative seat: {record["capital"]}. Council records: {record["lgaCount"]}.')),
                ('Service readiness', f'<dl class="fact-list">{values}</dl>' + paragraph(f'Reviewed {next(iter(provenance.values()))["reviewedOn"]}. The atlas has no qualifying observations for these dimensions.')),
                ('Councils in this jurisdiction', f'<p>{link(f"/atlas/lga-774?jurisdiction={code}", "Browse and filter councils")}</p>' + links((url, model.councils[url]['name']) for url in model.councils_by_state[code])),
                ('Source', links([(ATLAS_SOURCE + '/states/subnational-36states-fct-atlas.json', 'Read the state and FCT evidence')]))]
    return record['stateName'], f'Find councils in {record["stateName"]} and see the dimensions tracked in the readiness assessment.', child_sections(archive, sections), {
        'kind': 'states', 'id': code, 'jurisdiction': code, 'aliases': [record['zone']], 'status': 'Not yet assessed',
        'meta': {'description': f'Read the {record["stateName"]} profile, related council directory and evidence available for service readiness.'},
    }


def council_record(route, archive, model):
    record = model.councils[route]
    code = record['state']
    state = model.states[code]
    audit = record['audit']
    sources = [(model.sources[ref]['url'], model.sources[ref]['publisher']) for ref in audit['sourceRefs'] if ref in model.sources]
    title = record['name']
    jurisdiction = state['stateName']
    identity = 'The reviewed source corroborates the directory name.' if record['checked'] and sources else 'The directory name or source match still needs review.'
    if not record['checked']:
        identity += f' The reviewed registry lists the spelling {record["reviewed_name"]}. Confirm the name with the responsible authority.'
    sections = [('Council identity', paragraph(identity) + paragraph(f'Directory code: {record["code"]}. Reviewed {audit["reviewedOn"]}.')
                 + f'<p>{link(f"/atlas/states/{code}", jurisdiction)}</p>' + (links(sources) if sources else '')),
                ('Proposed municipal workflows', links([('/protocols/lga-governance-stack', 'Browse municipal workflows'), ('/rfcs/NS-RFC-014', 'Read the municipal specification')])),
                ('Service availability', paragraph('The Atlas has not assessed local services. Ask the responsible authority which services are available.')
                 + f'<p>{link(ATLAS_SOURCE + "/lga-774/lga-774-constitutional-registry.json", "Read the council registry")}</p>')]
    return title, f'Council directory entry in {jurisdiction}.', child_sections(archive, sections), {
        'kind': 'councils', 'id': record['code'], 'jurisdiction': code, 'place': jurisdiction, 'aliases': record['aliases'] + [jurisdiction], 'status': 'Directory record',
        'meta': {'title': f'{title} in {jurisdiction} | NigeriaStack Atlas',
                 'description': f'Read the directory record for {title} in {jurisdiction}. Find its name sources and related municipal workflows.'},
    }


MODULE_DETAILS = (
    ('Report a fault or service issue', 'Record the concern. Assign it to the responsible officer and document the response before closing it.'),
    ('Review a building application', 'Record the site and route the application to the competent planning authority for review.'),
    ('Record a sanitation service', 'Record a documented service or discharge and link it to any authorised receipt.'),
    ('Review a shop or stall licence', 'Check the issuing authority and current fee schedule before linking a permit to a receipt.'),
    ('Record a vital event', 'Capture the event for review and reconcile it with the authorised registry.'),
    ('Review a community attestation', 'Route the request to the authorised issuer and record its decision or any evidence still needed.'),
    ('Record a safety inspection', 'Capture a site visit and the authorised clearance, including when it expires.'),
    ('Verify community works', 'Connect the work evidence to the procurement record for review before any authorised payout.'),
    ('Reconcile a property assessment', 'Match parcel boundaries with the applicable schedule and verify the authority before handling payment.'),
    ('Review a market or corridor ticket', 'Check the issuing authority, fee schedule and whether the ticket is recognised across councils.'),
    ('Record a primary health encounter', 'Capture permitted information so the responsible health provider can reconcile it through an authorised system.'),
    ('Reconcile council financial records', 'Compare council records and receipts with bank settlement evidence. Publish only approved aggregates.'),
    ('Manage a customary court record', 'Keep docket control with the competent registrar. Follow restrictions on individual and family records.'),
    ('Connect a parcel to an address', 'Link the field reference to the approved street naming record through an authorised officer.'),
)


def module_record(route, archive, model):
    record = model.modules[route]
    identifier = record['moduleId']
    title, action = MODULE_DETAILS[int(identifier[4:]) - 1]
    sections = [('Proposed workflow', paragraph(action)),
                ('Authority and service availability', paragraph('Implementation and service availability are unassessed. Confirm the competent authority, access channels and any service fees before use.')),
                ('Specifications and directory', record_links(model, ('NS-RFC-014', 'NS-RFC-004'))
                 + links([('/atlas/lga-774', 'Find a council'), ('/governance#wg-05', 'Find the Working Group'), (ATLAS_SOURCE + '/lga-774/lga-14-service-modules-spec.json', 'Read the module source')]))]
    return title, f'{record["canonicalName"]}. A proposed municipal workflow for the institutions responsible for this service.', child_sections(archive, sections), {
        'kind': 'municipal', 'id': identifier, 'status': 'Research proposal', 'aliases': [record['canonicalName']],
    }


def known_parent(route, model):
    if route == '/':
        return home(model)
    if route == '/sectors':
        return industries(model)
    if route == '/protocols':
        return protocols(model)
    if route == '/rfcs':
        return registrations(model)
    if route == '/atlas':
        return atlas_tools(model, 'atlas')
    if route == '/conformance':
        return conformance()
    return f'<nav class="jump-links" aria-label="Governance tasks"><p>{link("#working-groups", "Find a Working Group")}{link("#charter", "Read the charter")}{link("#safeguards", "Inspect safeguards")}{link("#contribute", "Prepare a contribution")}{link("#faqs", "Common questions")}</p></nav>'


def secondary(route, archive, model):
    copy = SECONDARY_COPY[route]
    params = {'kind': 'directories'}
    if route == '/search':
        fallback = links([(path, name['h1']) for path, name in PARENT_COPY.items() if path != '/'])
        tool = collection('all', 'Search NigeriaStack', input_field('q', 'Name, topic or identifier', 'AMAC or NS-RFC-001'), fallback='#directory-links')
        output = tool + f'<section id="directory-links" class="record-section"><h2>Browse by topic</h2>{fallback}</section>'
    elif route in ('/atlas/states', '/atlas/lga-774'):
        output = atlas_tools(model, 'states' if route.endswith('/states') else 'councils')
    else:
        directory = [(path, MODULE_DETAILS[int(item['moduleId'][4:]) - 1][0]) for path, item in model.modules.items()]
        output = collection('municipal', 'Find a municipal workflow', input_field('q', 'Task or module name')) + browse(directory, 'Browse all municipal workflows')
        output += f'<p>{rfc_link(model, "NS-RFC-014")}</p>' + links([('/atlas/lga-774', 'Find a council'), ('/governance#wg-05', 'Find the Working Group')])
        params['kind'] = 'guides'
    return copy['h1'], copy['lead'], output + archive_outline(route, archive, model), {**params, 'meta': copy}


def update_graph(graph, route, title, summary, faq):
    data = json.loads(graph)
    for node in data['@graph']:
        if node.get('@type') == 'BreadcrumbList':
            if node.get('itemListElement'):
                node['itemListElement'][-1]['name'] = title
        if node.get('@id') == f'https://nigeriastack.org{route}#entity':
            node['name'] = title
            node['description'] = summary
            for key in ('citation', 'version', 'keywords', 'featureList'):
                node.pop(key, None)
            if faq:
                node['mainEntity'] = [{'@type': 'Question', 'name': question, 'url': f'https://nigeriastack.org/governance#{anchor}',
                                       'acceptedAnswer': {'@type': 'Answer', 'text': answer}} for anchor, question, answer in faq]
    return json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c')


def render_review(route, archive, model, graph):
    original_h1 = archive.xpath('.//h1')[0]
    notice = source_notice(archive) if route in PARENT_COPY else ''
    if route in PARENT_COPY:
        copy = PARENT_COPY[route]
        title, lead = copy['h1'], copy['lead']
        body = known_parent(route, model) + archive_outline(route, archive, model)
        fields = {'kind': 'parents', 'meta': copy}
    else:
        if route in SECONDARY_COPY:
            render = secondary
        elif route in model.councils:
            render = council_record
        elif route in model.modules:
            render = module_record
        elif route in GUIDES:
            render = guide_record
        elif route.startswith('/atlas/states/'):
            render = state_record
        elif route.startswith('/sectors/'):
            render = industry_record
        elif route.startswith('/rfcs/'):
            render = rfc_reader
        else:
            raise ValueError(f'Missing review binding: {route}')
        title, lead, body, fields = render(route, archive, model)
        body = child_navigation(route) + body
    meta = fields.pop('meta', {})
    faq = [(anchor, HEADING_COPY['/governance'].get(anchor, archive.get_element_by_id(anchor).text_content()), answer)
           for anchor, answer in FAQ_ANSWERS.items()] if route == '/governance' else []
    description = meta.get('description', lead)
    root = html.fragment_fromstring(heading_markup(original_h1, title) + f'<p class="lead">{escape(lead)}</p>' + body, create_parent='div')
    return root, meta.get('title', title + ' | NigeriaStack'), description, update_graph(graph, route, title, description, faq), notice, {'title': title, **fields}
