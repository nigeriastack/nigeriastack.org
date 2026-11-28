#!/usr/bin/env python3
"""Bind agent translation drafts to the existing, unapproved review queue."""

import argparse
from collections import Counter
import csv
from hashlib import sha256
import json
from pathlib import Path
import re
import unicodedata

LOCALES = ('ha-NG', 'yo-NG', 'ig-NG', 'pcm-NG')
TEMPLATE = re.compile(r'\$\{[^{}]+\}')
FIGURES = re.compile(r'\d+')
HIGH_RISK = re.compile(
    r'authori[st]|candidate|ratifi|consent|revoc|statut|licen[cs]|signature|signed|'
    r'identity|not yet|not assessed|unverified|unavailable|personal data|enforcement|'
    r'local draft|safeguard|digests?|receipt|legal|judicial|custod|independen', re.I
)


def unique_object(pairs):
    values = {}
    for key, value in pairs:
        if key in values:
            raise ValueError(f'Duplicate JSON field: {key}')
        values[key] = value
    return values


def read_json(path):
    return json.loads(path.read_bytes(), object_pairs_hook=unique_object)


def digest(value):
    return sha256(value).hexdigest()


def audit_draft(slot, text):
    source = slot['english']
    issues = []
    for token in slot['protectedTokens']:
        if source.count(token) != text.count(token):
            issues.append(f'Changed protected token quantity: {token}')
    if Counter(TEMPLATE.findall(source)) != Counter(TEMPLATE.findall(text)):
        issues.append('Changed runtime placeholders')
    if Counter(FIGURES.findall(source)) != Counter(FIGURES.findall(text)):
        issues.append('Confirm that reference values and figures preserve the source meaning')
    if any(unicodedata.category(character) in ('Cc', 'Cf') for character in text):
        issues.append('Control character in translated text')
    if text == source:
        issues.append('Confirm that the source wording should stay unchanged')
    return issues


def bind(inventory_file, queue_file, draft_directory):
    inventory = read_json(inventory_file)
    queue = read_json(queue_file)
    if queue['inventorySha256'] != digest(inventory_file.read_bytes()):
        raise ValueError('Original English inventory and locale queue are different')
    if inventory['buildReceiptSha256'] != queue['buildReceiptSha256']:
        raise ValueError('The queue and source inventory identify different builds')
    slots = {slot['id']: slot for slot in inventory['slots']}
    if len(slots) != len(inventory['slots']):
        raise ValueError('Duplicate source slot')
    for slot in slots.values():
        if digest(slot['english'].encode()) != slot['englishSha256']:
            raise ValueError(f'English text changed: {slot["id"]}')
    work = {(row['locale'], row['slot']): row for row in queue['translations']}
    if len(work) != len(queue['translations']) or set(work) != {
        (locale, source) for locale in LOCALES for source in slots
    }:
        raise ValueError('Review queue has missing, duplicate or extra rows')
    sheets = {}
    details = {}
    for locale in LOCALES:
        draft = read_json(draft_directory / f'{locale}.json')
        if set(draft) - set(slots):
            raise ValueError(f'{locale} includes a draft for a slot outside the inventory')
        issues_by_kind = Counter()
        sheets[locale] = []
        for index, (key, slot) in enumerate(slots.items(), start=1):
            row = work[locale, key]
            if row['reviewState'] != 'DRAFT_UNPUBLISHED' or row.get('translation'):
                raise ValueError(f'Use a fresh re-identified queue to avoid overwriting existing work: {locale} {key}')
            if row['englishSha256'] != slot['englishSha256']:
                raise ValueError(f'The approval row points to stale wording: {locale} {key}')
            text = draft.get(key, '')
            if not isinstance(text, str):
                raise ValueError(f'{locale} {key} is not text')
            text = unicodedata.normalize('NFC', text.strip())
            issues = audit_draft(slot, text) if text else ['Draft missing']
            issues_by_kind.update(issue.split(':', 1)[0] for issue in issues)
            row['translation'] = text
            priority = 'Critical meaning' if slot['purpose'] == 'authority-source' or HIGH_RISK.search(slot['english']) else 'Ordinary interface'
            sheets[locale].append({
                'number': index, 'slot': key, 'review_priority': priority,
                'purpose': slot['purpose'], 'source': slot['english'],
                'draft': text, 'machine_notes': ' | '.join(issues),
                'locations': ' | '.join(slot['locations']),
                'english_sha256': slot['englishSha256'],
                'draft_sha256': digest(text.encode()) if text else '',
                'review_state': row['reviewState'],
                'linguistic_reviewer': '', 'linguistic_date': '', 'linguistic_evidence': '', 'linguistic_findings': '',
                'legal_semantic_reviewer': '', 'legal_semantic_date': '', 'legal_semantic_evidence': '', 'legal_semantic_findings': '',
            })
        details[locale] = {
            'slots': len(slots),
            'drafted': sum(bool(row['draft']) for row in sheets[locale]),
            'approved': 0,
            'machine_flags': dict(sorted(issues_by_kind.items())),
        }
    return queue, sheets, {
        'kind': 'agent-draft-check', 'englishSlots': len(slots),
        'sourceRevision': inventory['sourceRevision'],
        'sourceBuildReceiptSha256': inventory['buildReceiptSha256'],
        'inventorySha256': queue['inventorySha256'],
        'locales': details,
    }


def excel_safe(value):
    if isinstance(value, str) and value.startswith(('=', '+', '-', '@', '\t', '\r')):
        return "'" + value
    return value


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--inventory', type=Path, required=True)
    parser.add_argument('--queue', type=Path, required=True)
    parser.add_argument('--draft-directory', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    queue, sheets, audit = bind(args.inventory, args.queue, args.draft_directory)
    args.out.mkdir(parents=True, exist_ok=False)
    for locale, rows in sheets.items():
        with (args.out / f'{locale}-review.csv').open('w', encoding='utf-8-sig', newline='') as handle:
            writer = csv.DictWriter(handle, fieldnames=tuple(rows[0]))
            writer.writeheader()
            writer.writerows({key: excel_safe(value) for key, value in row.items()} for row in rows)
    for filename, content in (('locale-draft-receipt.json', queue), ('draft-structural-audit.json', audit)):
        (args.out / filename).write_text(json.dumps(content, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps(audit, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
