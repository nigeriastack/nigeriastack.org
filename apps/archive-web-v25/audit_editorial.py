"""Verify the visible English review surfaces against their build receipt."""

import argparse
from collections import Counter
import csv
from hashlib import sha256
import json
from pathlib import Path
import re

from lxml import html

from parent_review import GITHUB_ORG, SPECIFICATION_REPO
from review_copy import GUIDE_COPY, PARENT_COPY

DECORATIVE = re.compile(r'[\d\[\]✓☑≤≥±·]')
NOTICE = 'Open Standards & Non-Impersonation Notice'
EXECUTIVE_SUMMARY = re.compile(r'\bexecutive[\s-]+summary\b', re.I)
NUMBERED_SECTION = re.compile(
    r'^(?:(?:section|chapter|part|phase|step|appendix)\s+(?:\d+|[ivxlcdm]+|[a-z])\b|'
    r'\(?(?:\d+(?:\.\d+)*|[ivxlcdm]+)\)?[.)]\s+|\d+(?:\.\d+)*\s*[:–—]\s+)', re.I,
)
THESIS_HEADING = re.compile(
    r'^(?:abstract|preface|introduction|table of contents|literature review|'
    r'(?:research )?methodology|results and discussion|conclusions?)\s*[:.]?$', re.I,
)


def normalized(node):
    return ' '.join(node.text_content().split())


def verify(condition, message):
    if not condition:
        raise ValueError(message)


def page_path(directory, route):
    return directory / route.strip('/') / 'index.html'


def verify_presentation(page, main, route):
    text = ' '.join(' '.join(page.xpath('//title/text()|//meta[@name="description"]/@content|//body//text()')).split())
    verify(not EXECUTIVE_SUMMARY.search(text), f'Executive summary copy at {route}')
    labels = page.xpath('//h1|//h2|//h3|//h4|//h5|//h6|//summary|//caption|//a|//button|//label')
    for label in labels:
        value = normalized(label) if label.tag != 'label' else ' '.join(label.xpath('./text()')).strip()
        verify(not NUMBERED_SECTION.search(value), f'Numbered presentation label at {route}: {value}')
        if label.tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'summary'):
            verify(not THESIS_HEADING.search(value), f'Generic thesis heading at {route}: {value}')
    ordered = main.xpath('.//ol')
    verify(all(node.xpath('ancestor::details[not(@open) and contains(concat(" ",normalize-space(@class)," ")," technical-requirements ")]')
               for node in ordered), f'Ordered list outside protected technical requirements at {route}')
    return len(labels), len(ordered)


def verify_copy(directory, receipt):
    observed = Counter()
    rows = []
    for route, digest in receipt['renderedPageSha256'].items():
        data = page_path(directory, route).read_bytes()
        verify(sha256(data).hexdigest() == digest, f'HTML differs from the receipt at {route}')
        page = html.fromstring(data)
        main, = page.xpath('//main')
        heading, = main.xpath('.//h1')
        title = page.findtext('head/title')
        description, = page.xpath('//meta[@name="description"]/@content')
        lead, = main.xpath('.//p[@class="lead"]')
        authored = PARENT_COPY.get(route) or GUIDE_COPY.get(route)
        if authored:
            verify(normalized(heading) == authored['h1'] and normalized(lead) == authored['lead'],
                   f'Rendering differs from the reviewed heading or lead at {route}')
            observed['reviewedHeadingAndLeadBindings'] += 1
        all_labels, technical_lists = verify_presentation(page, main, route)
        observed['allPresentationLabels'] += all_labels
        observed['technicalListsRetainingOrderSemantics'] += technical_lists
        verify(page.xpath('//link[@rel="canonical"]/@href') == ['https://nigeriastack.org' + route], f'Canonical URL changed at {route}')
        labels = main.xpath('(.//h1|.//h2|.//h3|.//h4|.//summary|.//label|.//button)[not(ancestor::details[not(@open)]) and not(ancestor-or-self::*[@hidden])]')
        labels += main.xpath('.//details[not(@open) and not(ancestor::details[not(@open)])]/summary[not(ancestor-or-self::*[@hidden])]')
        # Select options are independent controls; keep them out of the parent label's text.
        for label in labels:
            text = normalized(label) if label.tag != 'label' else ' '.join(label.xpath('text()')).strip()
            verify(not DECORATIVE.search(text), f'Decorative heading or control label at {route}: {text}')
            observed['defaultLabels'] += 1
        verify(not main.xpath('.//ol[not(ancestor::details[not(@open)])]'), f'Ordered list exposed in primary copy at {route}')
        verify(not any(NOTICE in normalized(node) for node in page.xpath('//header|//main')), f'Open notice above footer at {route}')
        notices = [node for node in page.xpath('//footer//blockquote') if NOTICE in normalized(node)]
        verify(len(notices) == int(route in PARENT_COPY), f'Wrong footer notice count at {route}')
        observed['noticeFooters'] += len(notices)
        footer_links = set(page.xpath('//footer//a/@href'))
        verify({GITHUB_ORG, SPECIFICATION_REPO}.issubset(footer_links), f'Missing source links at {route}')
        verify(not any('api.net.ng' in link for link in footer_links), f'Unavailable external service exposed at {route}')
        observed['footersWithGitHub'] += 1
        target = {'/': GITHUB_ORG, '/rfcs': SPECIFICATION_REPO, '/governance': GITHUB_ORG}.get(route)
        if target:
            verify(target in main.xpath('.//a/@href'), f'Missing contextual GitHub action at {route}')
            observed['contextualGitHubActions'] += 1
        if route == '/governance':
            graph = json.loads(page.xpath('//script[@type="application/ld+json"]')[0].text)['@graph']
            items = next(node['mainEntity'] for node in graph if node['@type'] == 'FAQPage')
            visible_answers = [(normalized(details.find('summary')), normalized(details.find('p'))) for details in main.xpath('.//details[@data-answer]')]
            verify(len(items) == len(visible_answers) == 15 and
                   [(item['name'], item['acceptedAnswer']['text']) for item in items] == visible_answers,
                   'Governance answers differ from their structured record')
            observed['faqPairs'] += len(items)
        primary = ' '.join(main.xpath('.//text()[not(ancestor::details[not(@open)]) and not(ancestor::*[@hidden])]'))
        details = [normalized(node) for node in main.xpath('.//details[not(@open) and not(ancestor::details[not(@open)])]')]
        rows.append((route, title, description, normalized(heading), normalized(lead), ' '.join(primary.split()), '\n\n'.join(details)))
    verify(len(rows) == 955, 'Expected 955 reviewed page records')
    verify(observed['reviewedHeadingAndLeadBindings'] == len(PARENT_COPY) + len(GUIDE_COPY),
           'Reviewed heading and lead coverage differs from the source deck')
    verify('.technical-requirements ol { list-style-type: disc; }' in (directory / '_assets/review.css').read_text(),
           'Technical requirements must render list markers as bullets')
    verify(len({row[1] for row in rows}) == len({row[2] for row in rows}) == 955, 'Titles or descriptions are duplicated')
    return rows, dict(pages=len(rows), **observed)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('site', type=Path)
    parser.add_argument('build_receipt', type=Path)
    parser.add_argument('--webcopy', type=Path)
    args = parser.parse_args()
    receipt = json.loads(args.build_receipt.read_text())
    verify(receipt['taskFirstReview'], 'Expected the reviewed candidate')
    rows, result = verify_copy(args.site, receipt)
    if args.webcopy:
        with args.webcopy.open('w', encoding='utf-8', newline='') as handle:
            writer = csv.writer(handle)
            writer.writerow(('route', 'title', 'description', 'h1', 'lead', 'primary_copy', 'reference_disclosures'))
            writer.writerows(rows)
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
