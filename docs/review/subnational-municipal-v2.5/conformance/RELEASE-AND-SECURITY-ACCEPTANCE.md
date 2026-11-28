# Implementation and Security Acceptance Criteria

## No institutional capture
### Statutory identity and custody
#### Mandatory controls
- Verify exact source-of-record steward and locally applicable enabling law, procurement and fee order before activating any module in any council.
- No NigeriaStack-hosted government login, treasury master account, unified resident record, land-title owner file, patient file, or court write-plane.
- Portable self-hosted deployment with open schema, source export, signed audit data, no vendor-sealed keys, and documented independent offboarding.

## State transitions and finance
### Block incomplete transactions
#### Mandatory controls
- Idempotency: a retry with the same operation ref returns current state, not a second charge; conflicting new operation for same unresolved intent fails safely.
- For `UNKNOWN_TIMEOUT`, do not issue a paid receipt; reconcile against independent bank records and include reversal pathway.
- Require zero intermediary escrow fields and account independently confirmed for exact revenue stream. Record distinct service-provider fees only where law/contract permits, never co-mingle statutory principal.
- Daily signed Merkle roots prove inclusion/immutability of recorded data, not settlement. Verify bank/treasury ledger independently and preserve exceptions.

## Privacy, evidence and inclusion
### Reject unsafe release
#### Mandatory controls
- Restricted `LGA-11` clinical, `LGA-13` family/juvenile and `LGA-05` vital data must never appear in public search/sync/event queues. Purpose-bound lawful basis, access governance and retention rules per source authority.
- `ClearAm` revocation propagation is a design SLO; `<60s` requires measured tests. Expired/revoked grants fail at API perimeter without protected-source query.
- Signatures, hashes and device logs assist evidence preservation but do not assert automatic Evidence Act admissibility; legal review includes 2023 amendments.
- Test degraded radio, dead battery, 300s clock threshold, out-of-order callbacks, device loss, issuer-key rotation, duplicate refunds, accidental family disclosure and 400% zoom.

## Release gates
### CI and authority deployment
#### Evidence-required status model
1. G1 canonical identifiers and clean-room naming.
2. G2 research/provenance: 296 unknown cells stay unknown without primary evidence.
3. G3 schema/OpenAPI validation, endpoint contract and versioned adapters.
4. G4 anti-capture, bank reconciliation, consent and signature/admissibility gates.
5. G5 four-viewport headless browser with zoom, 5-locale *review*, offline and access test.
6. G6 independent source Git/Drive readback, hash receipt and review; public release authorization separately.

**A document declaring `Gate NS-G1..G6 PASS` does not prove execution of those tests.** Only actual signed logs and test artefacts satisfy the gate.
