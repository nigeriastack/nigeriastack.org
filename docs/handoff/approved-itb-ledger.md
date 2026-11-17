# Approved ITB and SDK implementation ledger

Date: 2026-11-17. Scope: executable local reference SDK behavior in the existing repository. No remote action, production key, deployment, payment execution, or deployed-system accreditation is established by these results.

## Implementation

- `packages/conformance-cli/src/gherkin.ts` parses the repository's documented Scenario/Given/When/Then/And subset. Every step must resolve to exactly one executable binding. Unsupported syntax, duplicate IDs, missing scenarios, unbound steps and assertion failures fail execution. This is a strict repository subset, not a general Cucumber implementation.
- `packages/conformance-cli/src/itb-fixtures.ts` binds all five scenarios and all 24 steps from `tests/conformance-itb/features/ns_itb_full_conformance.feature` to actual SDK calls and assertions. Fixture UTC clock is fixed at 2026-11-17; cryptographic keys are generated ephemerally. Receipt timestamps and IDs remain runtime values.
- Receipts retain `LOCAL_REFERENCE_SDK_ONLY`, include per-scenario limitations, actual completed step counts and the source feature SHA-256. The legacy `certify` command now exits zero when all five local scenarios pass; building-block arguments are labels, not evidence of complete building-block coverage. Receipt SHA-256 is an integrity digest, not an issuer signature or accreditation.
- ITB-01 executes the timeout state machine and new-reference conflict, and verifies same-reference retry remains permitted.
- ITB-02 executes a real guarded query callback; expired consent produces HTTP 403 and the query counter remains zero. The allowed path invokes the callback. This does not verify a ClearAm consent signature.
- ITB-03 signs and verifies real Ed25519 SureEvidence, rejects single-byte tampering and exposes an explicit final-enrolled-sealing gate. Clock drift beyond 300 seconds in either direction and nonfinite clocks deny sealing. The resynchronized path permits sealing for unrestricted fixture records.
- ITB-04 rejects platform and intermediary escrow independently and creates one full-principal treasury transfer plan only for an account present in the caller-supplied trusted fixture registry. It does not execute transfers or independently prove bank-account ownership. The feature's LGA branch is exercised; court account integrations are not claimed.
- ITB-05 executes `GivePowerReferenceGateway` and `ReferenceEscrowLedger` in `packages/conformance-cli/src/givepower.ts`. Missing human signatures produce the specified 403. A valid signature authorizes the fixture action before an escrow challenge is locked; a downstream 503 refunds the caller exactly once with zero provider payout.
- SureEvidence base64url encoding/decoding uses browser-compatible `btoa`/`atob`, and malformed/unsupported signature encodings fail verification. The portal can import the individual SDK; the combined CLI runner uses Node filesystem/assert APIs.

## Explicit local GivePower profile

The human countersignature requirement is the repository RFC-008 design guardrail; this implementation does not interpret NDPA section 37 as a blanket statutory signature mandate. RFC-008 leaves the signed envelope and storage format open. This implementation defines a local reference profile, without changing the normative RFC:

1. Ed25519 signs domain-separated sorted-key JSON over the exact agent ID, audience, tool and action parameters plus principal ID, key ID, nonce, UTC issuance and expiry. Non-JSON or nonfinite values are rejected. Test helpers generate ephemeral keys; no human presence or WebAuthn ceremony is asserted.
2. Trusted registration supplies each principal's public key, agent, audience and allowed tools. Every registered tool declares `READ_ONLY_DEFAULT`; registered nonmutating queries work without a countersignature. Unknown tools and unauthorized mutations fail closed.
3. Mutation mandates must be currently valid, have a positive lifetime of at most 300 seconds and carry a 16–128 character nonce. Invalid or missing signatures, changed action parameters, wrong identities, missing capabilities, revoked keys and replay attempts are denied. Inputs are snapshotted before asynchronous verification. Replay lookup and consumption have no intervening await; a concurrent test authorizes exactly one of 24 attempts.
4. The integer-kobo ledger deducts a positive safe integer from the caller at lock, pays no provider while locked, and allows one terminal release or refund. Duplicate challenge IDs, overdrafts and invalid amounts fail. Initial total funds must remain representable as a safe integer.
5. Release requires HTTP 200, a schema-valid JSON-RPC 2.0 success with the matching request ID and result, delivered bytes that decode to that same response, and a valid SureEvidence signature/digest under the caller-supplied trusted provider issuer key. JSON whitespace/key order is accepted; the evidence verifies the exact delivered bytes. Errors, missing/invalid proofs, 5xx responses and timeout outcomes refund.
6. `expire(id, observedClock)` deterministically refunds at the deadline. `deliver` refunds unsuccessful deliveries and protects existing terminal outcomes, including a refund racing with proof verification. The reference has no background scheduler; an integration must invoke expiry on observed deadlines and supply a trusted clock.

## Verification

| Command | Result |
| --- | --- |
| `pnpm --filter '@nigeriastack/*' build` | PASS, all six SDK/CLI packages |
| `pnpm --filter '@nigeriastack/*' test` | PASS, five SDK tests plus 19 CLI tests; 24 tests total in final run |
| `pnpm --filter @nigeriastack/conformance-cli build` | PASS after final CLI changes |
| `pnpm --filter @nigeriastack/conformance-cli test` | PASS, final 19 CLI tests across three files |
| `node packages/conformance-cli/dist/cli.js certify --out /tmp/approved-itb-receipt.json` | PASS, five scenarios / 24 executable steps, exit 0 |
| `node --import tsx scripts/ci/verify-cleanroom-nomenclature.ts` | PASS, 154 audited files at this run |
| `git diff --check -- packages` | PASS |

Tests cover exact action and issuer binding, capabilities, expiry boundaries, invalid clocks, nonce replay under concurrency, revocation, lossy JSON rejection, valid response release, whitespace-preserving proof checks, malformed/error/wrong-ID responses, digest/signature failure, timeout/5xx refunds, expiry racing delivery, idempotent terminal transitions, budget conservation over 100 challenge amounts, invalid/overflow amounts, real query callback gating, drift/sealing boundaries, trusted treasury routing, changed Gherkin assertions, unbound steps, feature completeness and CLI exit behavior.

`npx tsx` could not create its IPC pipe in this environment (`EPERM`); the repository's `node --import tsx` invocation ran the same nomenclature script successfully.

## Remaining integration work

Production use requires durable atomic replay/escrow storage shared across gateway instances, bounded replay retention, actual tool dispatch and transport delivery, principal/key enrollment and WebAuthn verification, trusted clock/expiry scheduling, provider issuer enrollment, consent signature verification, real treasury-account evidence and downstream payment-rail integration. The reference balances are numbers in memory; NigeriaStack does not process funds. The CLI currently expects the repository feature file at its known relative path; packaging for standalone distribution must include that fixture or provide its source explicitly.

The legacy `renderUssd347Menu` helper now marks every locale as an illustrative menu and does not render an unverified allocated shortcode. Existing abbreviated SDK DTOs remain local helper shapes; published wire-schema compatibility is not claimed without an explicit adapter.

No package dependencies, root manifest or lockfile changes were required. Existing baseline retry, expiry, scope, digest and integer-amount protections were preserved. Compiled `dist` outputs were rebuilt with the source changes. No commit or remote action was performed.
