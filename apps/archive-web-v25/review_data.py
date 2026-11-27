"""Source-bound public data for the v2.5 parent and record review."""

from collections import defaultdict
from hashlib import sha1
import json
from pathlib import Path
import re
import unicodedata

APP = Path(__file__).resolve().parent
REPOSITORY = APP.parents[1]
CONTENT = REPOSITORY / 'content'
PROTOCOL_SOURCE = 'https://github.com/nigeriastack/protocol-specifications'
PROTOCOL_REVISION = 'cf1dbcb84b8768a19e7ea5464fb9d97882d045d8'
ATLAS_SOURCE = 'https://github.com/nigeriastack/subnational-readiness-atlas/blob/main'
LEDGER_SOURCE = 'https://github.com/nigeriastack/industry-capability-ledger/blob/main/taxonomy/master-32-industry-matrix.json'
CHARTER = 'https://github.com/nigeriastack/nigeriastack.org/blob/main/docs/governance/NIGERIA_STACK_INSTITUTIONAL_CHARTER.md'

RFC_TITLES = (
    'The Hourglass reference model', 'Confluence signed asynchronous transport',
    'Workflow state and safe same-reference retry', 'KioskBase offline records and clock sync',
    'SureEvidence for digital records', 'ClearAm consent and lawful purpose',
    'MarketLink for decentralised commerce', 'GivePower agent delegation and approval',
    'SplitDirect treasury routing', 'PassCargo trade and customs exchange',
    'NDHX health exchange and SureLearn credentials', 'AgriTrust farm boundaries and warehouse receipts',
    'LawTree structured legal text', 'Municipal interoperability for local councils',
)
RFC_GROUPS = ('01', '01', '01', '05', '02', '03', '04', '06', '03', '04', '05', '04', '02', '05')
RFC_SUMMARIES = (
    'See how local operations, institutional records, open exchange protocols and industry workflows fit together.',
    'Exchange signed messages without requiring both systems to be online at the same time.',
    'Keep track of an uncertain outcome and retry the same reference without repeating completed work.',
    'Keep a local record during an outage and reconcile changes when a connection returns.',
    'Inspect who produced a record, whether it has changed and what evidence accompanies it.',
    'Record the purpose, scope and expiry of consent and communicate withdrawal between systems.',
    'Exchange catalogues, orders and delivery updates across independent providers.',
    'Set the permissions for an agent and identify when a person must approve a change.',
    'Describe how authorised payments can reach their designated public recipient.',
    'Exchange trade and cargo records across participating systems.',
    'Exchange health information with permission and verify academic credentials.',
    'Exchange farm boundaries and warehouse receipt information in a shared format.',
    'Identify the version of a legal text and cite the relevant provision.',
    'Explore proposed council workflows and the authorities responsible for adopting them.',
)

GUIDES = {
    '/protocols/sure-evidence': ('SureEvidence for digital records', 'Check a digital record', 'NS-RFC-005', (), 'Inspect a record’s issuer and integrity. The authority receiving the record decides whether to accept it.'),
    '/protocols/clearam-consent': ('ClearAm for consent and revocation', 'Share data with permission', 'NS-RFC-006', (), 'Record the purpose, scope and expiry of a data request. Communicate withdrawal so the receiving system can apply it.'),
    '/protocols/confluence-gateway': ('Confluence for reliable data exchange', 'Recover after a timeout', 'NS-RFC-003', ('NS-RFC-002',), 'Check the outcome of an interrupted exchange before retrying. If the outcome is still uncertain, use the same reference to avoid repeating completed work.'),
    '/protocols/marketlink-commerce': ('MarketLink for catalogues and orders', 'Connect marketplaces and deliveries', 'NS-RFC-007', (), 'Exchange catalogue, order and fulfilment information between independent services.'),
    '/protocols/givepower-agents': ('GivePower for delegated permissions', 'Define when a person must approve a change', 'NS-RFC-008', (), 'Set the operation and permissions an agent may use. Identify changes that require a person’s approval.'),
    '/protocols/kioskbase-registries': ('KioskBase for offline records', 'Keep a record during an outage', 'NS-RFC-004', (), 'Keep working through a loss of connectivity and reconcile updates when the connection returns.'),
    '/protocols/lawtree-ast': ('LawTree for structured legal text', 'Find and cite a legal provision', 'NS-RFC-013', (), 'Identify a provision, its source and the version in force for the relevant date.'),
}
DIMENSION_LABELS = ('Courts and registries', 'Land and deeds', 'Revenue and treasury', 'Health and social services', 'Civil registration and councils', 'Public procurement', 'Agricultural services', 'Connectivity and hosting')
GAP_LABELS = ('Access to source records', 'Service coverage', 'Meaning of shared data', 'Transaction continuity', 'Trust in records', 'Offline continuity', 'Commercial and procurement barriers', 'Implementation resources')


def read_json(path):
    return json.loads(path.read_text())


def normalize_name(value):
    decomposed = unicodedata.normalize('NFKD', value.casefold())
    return ''.join(character for character in decomposed if character.isalnum())


def council_key(value):
    return normalize_name(re.sub(r'\s+\((?:AMAC)\)$', '', value))


def read_rfc_sources():
    sources = read_json(APP / 'rfc-sources.json')
    result = {}
    for identifier, binding in sources.items():
        position = int(identifier[-3:]) - 1
        payload = (REPOSITORY / 'specs/rfcs' / binding['file']).read_bytes()
        fingerprint = sha1(f'blob {len(payload)}\0'.encode() + payload).hexdigest()
        if fingerprint != binding['blob']:
            raise ValueError(f'Primary source has changed for {identifier}')
        markdown = payload.decode()
        header = markdown.splitlines()[:8]
        if not any('CANDIDATE STANDARD' in line for line in header):
            raise ValueError(f'Candidate status needs review for {identifier}')
        if not any(f'WG-{RFC_GROUPS[position]}' in line for line in header):
            raise ValueError(f'Working Group needs review for {identifier}')
        result[identifier] = dict(title=RFC_TITLES[position], summary=RFC_SUMMARIES[position],
                                  group='wg-' + RFC_GROUPS[position], blob=fingerprint,
                                  url=f'{PROTOCOL_SOURCE}/blob/{PROTOCOL_REVISION}/rfcs/{binding["file"]}',
                                  markdown=markdown)
    return result


class ReviewData:
    def __init__(self, pages):
        self.pages = {row['route']: row for row in pages}
        self.rfcs = read_rfc_sources()
        self.groups = read_json(CONTENT / 'taxonomy/route-groups.json')['groups']
        self.sector_by_industry = {identifier: group['name'] for group in self.groups for identifier in group['industryIds']}
        self.industries = {row['industryId']: row for row in read_json(CONTENT / 'taxonomy/master-32-industry-matrix.json')['industries']}
        atlas = read_json(CONTENT / 'atlas/subnational-36states-fct-atlas.json')
        self.dimensions = dict(zip(atlas['dimensions'], DIMENSION_LABELS, strict=True))
        self.readiness = {row['code']: row for row in atlas['jurisdictions']}
        registry = read_json(CONTENT / 'atlas/lga-774-constitutional-registry.json')
        self.states = {row['stateCode']: row for row in registry['statesAndTerritory']}
        self.sources = read_json(CONTENT / 'atlas/evidence-sources.json')['sources']
        self.modules = {row['route']: row for row in read_json(CONTENT / 'atlas/lga-14-service-modules-spec.json')['modules']}
        self.councils = {}
        self.councils_by_state = defaultdict(list)
        for route, page in self.pages.items():
            if not route.startswith('/atlas/lga-774/'):
                continue
            jurisdiction, code = route.split('/')[3:]
            state = self.states[jurisdiction]
            record_code = code.replace('FC-AC-', 'FC-LGA-')
            audit = state['identityAudit'][record_code]
            archive_name = re.sub(r' (Local Government Area|Area Council)$', '', page['h1'])
            reviewed_name = audit['reviewedProjectName']
            corrections = [row['previousName'] for row in registry['identityCorrections'] if row['projectCode'] == record_code]
            corroborated = audit['nameStatus'] == 'CORROBORATED_NAME'
            same_name = council_key(archive_name) in {council_key(name) for name in [reviewed_name, *corrections]}
            label = reviewed_name if same_name or corroborated and record_code == 'AB-LGA-09' else archive_name
            aliases = [archive_name] if label != archive_name else []
            if jurisdiction == 'FC' and same_name and corroborated:
                aliases.append(record_code)
            self.councils[route] = dict(name=label, state=jurisdiction, code=code, audit=audit,
                                        reviewed_name=reviewed_name, checked=same_name or record_code == 'AB-LGA-09' and corroborated,
                                        aliases=aliases)
            self.councils_by_state[jurisdiction].append(route)
        if (len(self.industries), len(self.rfcs), len(self.states), len(self.councils), len(self.modules)) != (32, 14, 37, 774, 14):
            raise ValueError('Review data differs from admitted inventories')
        if not all(row['maturityTier'] == 'RESEARCH_PROPOSAL' and not row['residualGapMechanisms']
                   and row['assessmentProvenance']['assessmentState'] == 'NOT_ASSESSED' for row in self.industries.values()):
            raise ValueError('Industry evidence has changed. Review the display binding.')
        if any(row[key] != 'NOT_ASSESSED' for row in self.readiness.values() for key in self.dimensions):
            raise ValueError('State evidence has changed. Review the display binding.')
