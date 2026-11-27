#!/usr/bin/env python3
"""Check evidence integrity for the three human-review gates."""

import argparse
from collections import Counter
from datetime import date
from hashlib import sha256
import json
from pathlib import Path
import re
import sys

AUDIENCES = {'federal-steward', 'state-council-leader', 'enterprise-implementer', 'software-implementer', 'resident-msme-litigant'}
READERS = {
    'nvda-windows': ('Windows', ('Chrome', 'Firefox'), 'NVDA'),
    'voiceover-ios': ('iOS', ('Safari',), 'VoiceOver'),
    'talkback-android': ('Android', ('Chrome',), 'TalkBack'),
}
SPEECH_CASES = {'home-landmarks', 'search-matches', 'search-no-match', 'search-unavailable', 'industry-filters',
                'specification-exact', 'working-group-draft', 'faq-disclosure', 'verifier-outcomes'}
LOCALES = {'ha-NG', 'yo-NG', 'ig-NG', 'pcm-NG'}
REVIEW_STATES = {'DRAFT_UNPUBLISHED', 'LINGUISTIC_REVIEW_PASSED', 'LEGAL_SEMANTIC_REVIEW_APPROVED'}
RENDER_CHECKS = {'documentLanguage', 'fallbackLanguage', 'navigation', 'statusMessages', 'narrowReflow'}
RUNTIME_PLACEHOLDER = re.compile(r'\$\{[^{}]+\}')


class Gate:
    def __init__(self):
        self.errors = []
        self.pending = []
        self.blockers = []

    def require(self, condition, message):
        if not condition:
            self.errors.append(message)
        return condition

    def need(self, condition, message):
        if not condition:
            self.pending.append(message)

    def receipt(self):
        status = 'INVALID' if self.errors else 'BLOCKED' if self.blockers else 'PENDING' if self.pending else 'PASS'
        return {'status': status, 'missing': self.pending, 'blockers': self.blockers, 'errors': self.errors}


def nonempty(value):
    return isinstance(value, str) and bool(value.strip())


def required_text(row, *keys):
    return all(nonempty(row.get(key)) for key in keys)


def plausible_date(value):
    try:
        return date.fromisoformat(value).isoformat() == value
    except (TypeError, ValueError):
        return False


def validate_receipt(record, kind, build):
    gate = Gate()
    gate.require(record.get('kind') == kind, f'Expected kind {kind}')
    given = record.get('buildReceiptSha256')
    if given:
        gate.require(given == build, 'Evidence build receipt differs from the candidate')
    else:
        gate.need(False, 'Bind this receipt to the candidate build SHA-256')
    return gate


def validate_findings(gate, findings):
    seen = set()
    for finding in findings:
        identifier = finding.get('id')
        gate.require(nonempty(identifier) and identifier not in seen, 'Finding IDs must be present and unique')
        seen.add(identifier)
        gate.require(required_text(finding, 'impact', 'evidenceRef'), f'Finding {identifier} needs impact and evidence')
        gate.require(finding.get('status') in {'open', 'closed'} and type(finding.get('blocking')) is bool,
                     f'Finding {identifier} needs open/closed status and a boolean blocking decision')
        if finding.get('status') == 'closed':
            gate.require(required_text(finding, 'resolution', 'retestRef'), f'Closed finding {identifier} needs resolution and retest')
        elif finding.get('blocking') is True:
            gate.blockers.append(f'Unresolved finding {identifier}')
    return seen


def audience_gate(record, build):
    gate = validate_receipt(record, 'audience-testing', build)
    finding_ids = validate_findings(gate, record.get('findings', []))
    coverage = set()
    participants = set()
    for entry in record.get('observations', []):
        audience = entry.get('audience')
        alias = entry.get('participant')
        key = (audience, alias)
        label = f'Audience {audience} participant {alias}'
        gate.require(audience in AUDIENCES and key not in participants, f'{label}: unknown audience or duplicate row')
        participants.add(key)
        gate.require(entry.get('mode') == 'actual-representative', f'{label}: requires an observed representative session')
        gate.require(required_text(entry, 'participant', 'device', 'input', 'connection', 'startRoute', 'firstAction', 'observed', 'comprehension', 'recovery', 'evidenceRef')
                     and plausible_date(entry.get('date')), f'{label}: missing observation details')
        outcome = entry.get('outcome')
        gate.require(outcome in {'completed-unassisted', 'completed-assisted', 'not-completed'}, f'{label}: invalid outcome')
        gate.require(type(entry.get('understoodAuthorityAndStatus')) is bool and type(entry.get('recovered')) is bool,
                     f'{label}: rate comprehension and recovery explicitly')
        if outcome == 'completed-unassisted' and entry.get('understoodAuthorityAndStatus') is True and entry.get('recovered') is True:
            coverage.add(audience)
        else:
            reported = set(entry.get('findingIds', []))
            gate.require(bool(reported) and reported <= finding_ids, f'{label}: record a finding for the incomplete evidence')
    for audience in sorted(AUDIENCES - coverage):
        gate.need(False, f'No successful representative observation for {audience}')
    return gate


def speech_gate(record, build):
    gate = validate_receipt(record, 'spoken-accessibility', build)
    finding_ids = validate_findings(gate, record.get('findings', []))
    by_profile = set()
    observed = set()
    for profile in record.get('profiles', []):
        profile_id = profile.get('id')
        if not gate.require(profile_id in READERS and profile_id not in by_profile, f'Unexpected or duplicate profile {profile_id}'):
            continue
        by_profile.add(profile_id)
        if not profile.get('results'):
            continue
        system, browsers, reader = READERS[profile_id]
        gate.require(profile.get('os') == system and profile.get('reader') == reader and profile.get('browser') in browsers,
                     f'{profile_id}: incorrect reader/browser/OS combination')
        gate.require(required_text(profile, 'device', 'osVersion', 'browserVersion', 'readerVersion', 'voiceLanguage', 'input', 'observer')
                     and plausible_date(profile.get('date')), f'{profile_id}: record actual device, tool versions and observation date')
        seen = set()
        for result in profile['results']:
            case = result.get('case')
            label = f'{profile_id}/{case}'
            gate.require(case in SPEECH_CASES and case not in seen, f'Unknown or duplicate spoken case {label}')
            seen.add(case)
            state = result.get('outcome')
            gate.require(state in {'pass', 'fail', 'blocked'}, f'{label}: bad outcome')
            if state == 'blocked':
                gate.need(False, f'{label} blocked: {result.get("reason", "No reason supplied")}')
                continue
            gate.require(result.get('speechHeardByHuman') is True and
                         required_text(result, 'route', 'action', 'heard', 'focusAfter', 'evidenceRef'),
                         f'{label}: requires actual heard speech, focus and evidence')
            if state == 'pass':
                observed.add((profile_id, case))
            elif state == 'fail':
                gate.require(result.get('findingId') in finding_ids, f'{label}: failed result needs a finding ID')
    for profile_id in sorted(READERS):
        for case in sorted(SPEECH_CASES):
            if (profile_id, case) not in observed:
                gate.need(False, f'Missing spoken pass for {profile_id}/{case}')
    return gate


def decision_valid(decision, digest):
    return (required_text(decision, 'reviewer', 'evidenceRef') and plausible_date(decision.get('date'))
            and decision.get('textSha256') == digest)


def locale_gate(record, build, english_build, inventory, raw_inventory):
    gate = validate_receipt(record, 'locale-review', english_build)
    gate.require(inventory.get('language') == 'en-NG' and inventory.get('buildReceiptSha256') == english_build,
                 'English inventory does not match the source serving-file receipt')
    gate.require(record.get('inventorySha256') == sha256(raw_inventory).hexdigest(), 'English inventory bytes differ from translation receipt')
    scope_review = inventory.get('scopeReview', {})
    gate.need(scope_review.get('complete') is True and required_text(scope_review, 'reviewer', 'evidenceRef')
              and nonempty(inventory.get('sourceRevision')), 'Review and version the English source inventory')
    source_rows = inventory.get('slots', [])
    slots = {slot['id']: slot for slot in source_rows}
    gate.require(bool(slots) and len(slots) == len(source_rows), 'English inventory must have unique, nonempty slots')
    for slot in source_rows:
        gate.require(required_text(slot, 'id', 'english', 'purpose') and bool(slot.get('locations'))
                     and slot.get('englishSha256') == sha256(slot['english'].encode()).hexdigest(),
                     f'Unbound English slot {slot.get("id")}')
    found = set()
    approvals = Counter()
    for row in record.get('translations', []):
        locale = row.get('locale')
        key = (locale, row.get('slot'))
        if not gate.require(locale in LOCALES and key[1] in slots and key not in found, f'Unexpected or duplicate translation {key}'):
            continue
        found.add(key)
        slot = slots[key[1]]
        gate.require(row.get('englishSha256') == slot.get('englishSha256'), f'Stale English source digest for {key}')
        state = row.get('reviewState')
        gate.require(state in REVIEW_STATES, f'Unknown review state for {key}')
        if state not in REVIEW_STATES or state == 'DRAFT_UNPUBLISHED':
            continue
        translation = row.get('translation')
        if not gate.require(nonempty(translation), f'Reviewed translation {key} is empty'):
            continue
        english = slot['english']
        tokens_valid = gate.require(
            all(english.count(token) == translation.count(token) for token in slot.get('protectedTokens', [])),
            f'Translation {key} changed a protected token',
        )
        placeholders_valid = gate.require(
            Counter(RUNTIME_PLACEHOLDER.findall(english)) == Counter(RUNTIME_PLACEHOLDER.findall(translation)),
            f'Translation {key} changed runtime placeholders',
        )
        digest = sha256(translation.encode()).hexdigest()
        linguist = row.get('linguisticDecision', {})
        linguist_valid = gate.require(decision_valid(linguist, digest), f'Invalid or stale linguistic decision for {key}')
        if state == 'LEGAL_SEMANTIC_REVIEW_APPROVED':
            legal = row.get('legalSemanticDecision', {})
            legal_valid = gate.require(decision_valid(legal, digest) and legal.get('reviewer') != linguist.get('reviewer'),
                                       f'Independent legal-semantic decision missing or stale for {key}')
            if tokens_valid and placeholders_valid and linguist_valid and legal_valid:
                approvals[locale] += 1
    rendered = set()
    confirmed = record.get('renderedBuildReceiptSha256')
    if confirmed:
        gate.require(confirmed == build, 'Locale rendering evidence differs from the candidate')
    else:
        gate.need(False, 'Bind rendered locale retest to the candidate build SHA-256')
    for row in record.get('renderedChecks', []):
        locale = row.get('locale')
        if not gate.require(locale in LOCALES and locale not in rendered, f'Unexpected or duplicate rendered locale {locale}'):
            continue
        rendered.add(locale)
        verified = all(row.get(check) is True for check in RENDER_CHECKS)
        gate.need(verified and required_text(row, 'reviewer', 'evidenceRef') and bool(row.get('testedRoutes')),
                  f'Rendered checks incomplete for {locale}')
    for locale in sorted(LOCALES):
        gate.need(approvals[locale] == len(slots), f'{locale}: {approvals[locale]} of {len(slots)} strings approved')
        gate.need(locale in rendered, f'No rendered verification for {locale}')
    return gate


def load_json(path):
    return json.loads(path.read_bytes())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--build-receipt', type=Path, required=True)
    parser.add_argument('--english-source-receipt', type=Path)
    parser.add_argument('--audience', type=Path)
    parser.add_argument('--speech', type=Path)
    parser.add_argument('--locale', type=Path)
    parser.add_argument('--inventory', type=Path)
    parser.add_argument('--allow-open', action='store_true', help='Exit zero for a pending evidence draft. Result still reports PENDING.')
    args = parser.parse_args()
    if args.locale and not args.inventory:
        parser.error('--locale requires --inventory')
    validators = {}
    try:
        build = sha256(args.build_receipt.read_bytes()).hexdigest()
        english_build = sha256(args.english_source_receipt.read_bytes()).hexdigest() if args.english_source_receipt else build
        if args.audience:
            validators['audience'] = audience_gate(load_json(args.audience), build)
        if args.speech:
            validators['speech'] = speech_gate(load_json(args.speech), build)
        if args.locale:
            raw = args.inventory.read_bytes()
            validators['locale'] = locale_gate(load_json(args.locale), build, english_build, json.loads(raw), raw)
    except (OSError, KeyError, TypeError, AttributeError, ValueError) as exc:
        parser.error(f'Invalid input: {exc}')
    if not validators:
        parser.error('Provide at least one evidence receipt')
    checked = {key: gate.receipt() for key, gate in validators.items()}
    statuses = {gate['status'] for gate in checked.values()}
    passed = len(checked) == 3 and statuses == {'PASS'}
    print(json.dumps({'allThreeGatesPassed': passed, 'reviewedGates': checked}, indent=2, ensure_ascii=False))
    if statuses & {'INVALID', 'BLOCKED'}:
        sys.exit(1)
    if 'PENDING' in statuses and not args.allow_open:
        sys.exit(2)


if __name__ == '__main__':
    main()
