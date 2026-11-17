# SDK verification ledger

Verified locally on 2026-11-17 with Node v24.22.1 and pnpm 11.25.0. Read the project AGENTS.md, SDK/conformance skill, and apps/web/wrangler.toml. Changes are confined to packages/ and this ledger; pnpm automatically synchronized the root lockfile while running the build after the CLI workspace dependencies changed. No commits, registry publishing, credentials, external adapter requests, or production deployment were performed.

## Findings and changes

The previous CLI and library entry point duplicated a static array of five PASS results, fixed elapsed times, and a constant receipt ID. Their test asserted those canned values. They did not execute the SDK behavior.

The library now performs asynchronous SDK assertions and measures elapsed time. A shared library entry point drives the CLI. A unique receipt ID, receipt digest, and explicit LOCAL_REFERENCE_SDK_ONLY scope are emitted. Every scenario lists its limitations. The CLI validates its command and options, emits NOT_RUN for unavailable behavior, and exits 1 whenever a scenario fails or is not run. Target building-block labels are metadata and do not establish coverage. The API runAllItbScenarios now returns a Promise; no other local consumers were found beyond the CLI and updated tests.

ITB-01 exercises timeout state conversion, rejects changed-reference retry, and accepts same-reference retry. It does not transmit a network request or prove durable idempotency.

ITB-02 exercises expired consent, exact expiry, invalid verifier time, local revocation, and valid scope acceptance. ClearAm now fails closed for an invalid verifier clock and rejects consent at the exact expiry instant. There is no consent signature verification, distributed revocation latency measurement, or observed gateway database query counter.

ITB-03 generates an ephemeral Ed25519 test key, signs and verifies test bytes, mutates one byte and observes digest rejection, and checks 420-second clock drift blocks public outbox sync. No real issuer, FIDO2 hardware, PDF parser, QR scanner, clock source, or final sealing service is verified. Test keys and fixture identities are not production credentials.

ITB-04 exercises the LGA zero-escrow validator with accepted and independently rejected platform/state escrow cases. LGA and Merkle amount validators reject invalid, nonfinite, fractional, or unsafe integer kobo amounts; Merkle totals also reject overflow. Neither bank account ownership nor actual payment routing/settlement is verified.

ITB-05 is NOT_RUN: this workspace has no executable GivePower gateway or x402 escrow implementation. No implementation was invented from feature prose.

The feature file remains a specification, without a Cucumber/Gherkin parser or adapter runner. The executable checks above exercise the available local SDK functions, not all feature steps against a deployed system. OPA binary was absent on initial inspection; Rego policy logic and policy tests are owned by the parent agent and are outside this SDK verification result.

## Commands and observed results

| Command | Observed result |
| --- | --- |
| pnpm --filter '@nigeriastack/*' build | First attempt found TypeScript CryptoKeyPair union narrowing error in new CLI; corrected. Subsequent run passed all six package builds. |
| pnpm --filter '@nigeriastack/*' test | Passed six suites and nine tests, including four CLI tests. |
| pnpm --filter @nigeriastack/conformance-cli build | Passed after final scenario assertion additions. |
| node packages/conformance-cli/dist/cli.js certify --bb BB-01,BB-02,BB-03,BB-04,BB-05,BB-06,BB-07,BB-08,BB-09,BB-10,BB-11,BB-12 --out /tmp/nigeriastack-reference-receipt.json | Wrote scoped receipt; ITB-01 through ITB-04 PASS; ITB-05 NOT_RUN; exited 1, correctly leaving conformance incomplete. |
| node --import tsx scripts/ci/verify-cleanroom-nomenclature.ts | Passed: 120 files audited. |

The CLI regression suite replaces validateSafeRetryAttempt with an incorrect acceptance result and confirms ITB-01 becomes FAIL. It also recomputes the receipt SHA-256, asserts ITB-05 stays incomplete, rejects invalid CLI input, and rejects invalid monetary values. This establishes that statuses depend on executed assertions rather than fixed labels.

## Modified paths

- packages/conformance-cli/package.json (workspace dependencies on the five SDKs)
- packages/conformance-cli/src/index.ts
- packages/conformance-cli/src/cli.ts
- packages/conformance-cli/src/merkle-audit.ts
- packages/conformance-cli/test/itb-scenarios.spec.ts
- packages/joinbody-clearam-guard/src/index.ts
- packages/joinbody-lga-kiosk-kit/src/index.ts
- Regenerated tracked outputs: packages/conformance-cli/dist/{index.js,index.d.ts,cli.js,cli.d.ts,merkle-audit.js}, packages/joinbody-clearam-guard/dist/index.js, packages/joinbody-lga-kiosk-kit/dist/index.js
- docs/handoff/sdk-verification-ledger.md

All package build and test processes completed. Passing local unit checks does not constitute statutory certification or deployed adapter conformance. The overall ITB gate is incomplete by design while ITB-05 lacks an implementation.
