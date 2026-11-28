#!/usr/bin/env python3
"""Extract a draft language inventory from receipt-bound NigeriaStack review files."""

import argparse
from hashlib import sha256
import json
from pathlib import Path
import re

from lxml import html

PARENTS_AND_HANDOFFS = (
    '/', '/sectors', '/protocols', '/rfcs', '/conformance', '/atlas', '/governance',
    '/search', '/sectors/finance-revenue-and-fiscal-systems/IND-01',
    '/protocols/confluence-gateway', '/protocols/lga-governance-stack', '/rfcs/NS-RFC-001',
    '/atlas/states/FC', '/atlas/lga-774/FC/FC-AC-02',
)
ELEMENTS = '//h1|//h2|//h3|//h4|//h5|//h6|//a|//button|//summary|//option|//label|//p|//th|//dt|//dd'
ATTRIBUTES = '//*[@aria-label or @placeholder or @alt or @title]'
PROTECTED = re.compile(r'\$\{[^{}]+\}|\b(?:NS-RFC|WG|LGA|IND)-[0-9]{2,3}\b|\b(?:SHA-256|CC0-1\.0)\b|\bhttps?://\S+')
JS_LITERAL = re.compile(r"`([^`]+)`|'([^'\\\n]+)'|\"([^\"\\\n]+)\"")
VISIBLE_JS = re.compile(r"textContent\s*=|\bsay\(['\"]|\berror\s*:|^\s*[?:]\s*['`]|const noun\s*=")
EXPANDED_ELEMENTS = '//title|//legend|//caption|//figcaption|//li[not(descendant::li or descendant::p)]|//td[not(descendant::p)]'
EXPANDED_JS = re.compile(r'const (?:count|draft) = |^const exampleDocument = ')
INDEX_ASSETS = ('atlas', 'councils', 'guides', 'index', 'industries', 'municipal', 'specifications', 'states')
RESULT_FIELDS = ('title', 'sector', 'gap', 'maturity', 'status', 'place')


def digest(payload):
    return sha256(payload).hexdigest()


def read_bound(root, relative, expected):
    payload = (root / relative).read_bytes()
    if digest(payload) != expected:
        raise ValueError(f'File digest does not match receipt: {relative}')
    return payload


def add_slot(slots, text, purpose, location):
    text = ' '.join(text.split())
    if not text or not any(ch.isalpha() for ch in text):
        return
    identity = digest(f'{purpose}\0{text}'.encode())[:20]
    slot = slots.setdefault(identity, {
        'id': identity, 'english': text, 'englishSha256': digest(text.encode()),
        'purpose': purpose, 'locations': [], 'protectedTokens': sorted(set(PROTECTED.findall(text))),
    })
    if location not in slot['locations']:
        slot['locations'].append(location)


def html_slots(payload, route, slots, expanded=False):
    tree = html.fromstring(payload)
    for node in tree.xpath(ELEMENTS):
        # An enclosing label may contain a select list or input. Review the label
        # text and options separately so the translation keys remain useful.
        text = ' '.join(node.xpath('.//text()[not(ancestor::select or ancestor::textarea)]')) if node.tag == 'label' else node.text_content()
        purpose = 'authority-source' if node.xpath('ancestor-or-self::*[contains(concat(" ",normalize-space(@class)," ")," footer-notice ")]') else node.tag
        add_slot(slots, text, purpose, f'{route} {node.getroottree().getpath(node)}')
    for node in tree.xpath(ATTRIBUTES):
        for name in ('aria-label', 'placeholder', 'alt', 'title'):
            if node.get(name):
                add_slot(slots, node.get(name), name, f'{route} {node.getroottree().getpath(node)}')
    if not expanded:
        return
    for node in tree.xpath(EXPANDED_ELEMENTS):
        if node.tag in ('li', 'td') and not node.xpath('.//text()[not(ancestor::a or ancestor::button)]'):
            continue
        add_slot(slots, node.text_content(), node.tag, f'{route} {node.getroottree().getpath(node)}')
    for node in tree.xpath('//meta[@name="description" and @content]'):
        add_slot(slots, node.get('content'), 'meta-description', f'{route} {node.getroottree().getpath(node)} @content')


def runtime_slots(payload, relative, slots, expanded=False):
    in_draft_fields = False
    for number, line in enumerate(payload.decode().splitlines(), start=1):
        if expanded and line.startswith('const draftFields = {'):
            in_draft_fields = True
        elif in_draft_fields and line.startswith('};'):
            in_draft_fields = False
        extra = expanded and (in_draft_fields or EXPANDED_JS.search(line))
        if not extra and not VISIBLE_JS.search(line):
            continue
        for matched in JS_LITERAL.finditer(line):
            text = next(value for value in matched.groups() if value is not None)
            if extra or ' ' in text or text in {'result', 'results'} or text.startswith('${'):
                add_slot(slots, text, 'runtime-message', f'{relative}:{number}')


def index_slots(payload, relative, slots):
    for index, result in enumerate(json.loads(payload)['records']):
        for field in RESULT_FIELDS:
            if field == 'title' and result.get('track') == 'Extended':
                # The app uses its archive-title template for these records.
                continue
            value = result.get(field, [])
            path = f'{relative} /records/{index}/{field}'
            if isinstance(value, str):
                add_slot(slots, value, f'result-{field}', path)
            elif isinstance(value, list):
                for member, text in enumerate(value):
                    if isinstance(text, str):
                        add_slot(slots, text, f'result-{field}', f'{path}/{member}')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dist', type=Path, required=True)
    parser.add_argument('--build-receipt', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--source-revision', default='')
    parser.add_argument('--extra-route', action='append', default=[])
    parser.add_argument('--all-routes', action='store_true')
    parser.add_argument('--expanded-copy', action='store_true',
                        help='Collect additional page metadata, prose and search result labels for scope review')
    args = parser.parse_args()
    raw = args.build_receipt.read_bytes()
    receipt = json.loads(raw)
    route_digests = receipt['renderedPageSha256']
    routes = sorted(route_digests) if args.all_routes else list(dict.fromkeys((*PARENTS_AND_HANDOFFS, *args.extra_route)))
    slots = {}
    for route in routes:
        if route not in route_digests or not re.fullmatch(r'/(?:[A-Za-z0-9_-]+(?:/[A-Za-z0-9_-]+)*)?', route):
            raise ValueError(f'Route is not admitted by the receipt: {route}')
        relative = Path(route.strip('/')) / 'index.html'
        html_slots(read_bound(args.dist, relative, route_digests[route]), route, slots,
                   expanded=args.expanded_copy)
    assets = ('_assets/review.mjs', '_assets/verifier.mjs')
    for relative in assets:
        runtime_slots(read_bound(args.dist, relative, receipt['deploymentFiles'][relative]), relative, slots,
                      expanded=args.expanded_copy)
    indexes = [f'api/v1/{name}.json' for name in INDEX_ASSETS] if args.expanded_copy else []
    for relative in indexes:
        index_slots(read_bound(args.dist, relative, receipt['deploymentFiles'][relative]), relative, slots)
    inventory = {
        'language': 'en-NG', 'sourceRevision': args.source_revision, 'buildReceiptSha256': digest(raw),
        'scopeReview': {'complete': False, 'reviewer': '', 'evidenceRef': ''},
        'routes': routes, 'runtimeAssets': list(assets),
        'slots': sorted(slots.values(), key=lambda row: (row['purpose'], row['english'])),
    }
    if indexes:
        inventory['searchIndexes'] = indexes
    args.output.write_text(json.dumps(inventory, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'Extracted {len(slots)} source strings from {len(routes)} routes and {len(assets)} runtime assets. Scope review remains open.')


if __name__ == '__main__':
    main()
