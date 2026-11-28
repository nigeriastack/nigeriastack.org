#!/usr/bin/env python3
"""Prepare the four pending translation queues from an exact English inventory."""

import argparse
from hashlib import sha256
import json
from pathlib import Path

LOCALES = ('ha-NG', 'yo-NG', 'ig-NG', 'pcm-NG')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--build-receipt', type=Path, required=True)
    parser.add_argument('--inventory', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    build = sha256(args.build_receipt.read_bytes()).hexdigest()
    raw = args.inventory.read_bytes()
    inventory = json.loads(raw)
    if inventory['buildReceiptSha256'] != build:
        raise ValueError('English inventory belongs to a different build receipt')
    slots = inventory['slots']
    if not slots or len(slots) != len({slot['id'] for slot in slots}):
        raise ValueError('Provide a nonempty English inventory with unique slots')
    rows = []
    for locale in LOCALES:
        for slot in slots:
            english_digest = sha256(slot['english'].encode()).hexdigest()
            if slot['englishSha256'] != english_digest:
                raise ValueError(f'Source digest changed for {slot["id"]}')
            rows.append({
                'locale': locale, 'slot': slot['id'], 'englishSha256': english_digest,
                'translation': '', 'reviewState': 'DRAFT_UNPUBLISHED',
                'linguisticDecision': {'reviewer': '', 'date': '', 'textSha256': '', 'evidenceRef': ''},
                'legalSemanticDecision': {'reviewer': '', 'date': '', 'textSha256': '', 'evidenceRef': ''},
            })
    output = {
        'kind': 'locale-review', 'buildReceiptSha256': build,
        'inventorySha256': sha256(raw).hexdigest(), 'renderedBuildReceiptSha256': '',
        'translations': rows, 'renderedChecks': [],
    }
    args.output.write_text(json.dumps(output, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'Prepared {len(rows)} pending translation rows. No review decisions recorded.')


if __name__ == '__main__':
    main()
