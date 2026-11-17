# Corrected P0–P7 v2.1 implementation ledger — 17 November 2026

**Current outcome: corrected v2.1 implementation merged to GitHub main through PR #2 at `7fd69e72cc53d53977e0962c078637eef7aa35e0`. Hosted source, browser and evidence-coherence jobs passed. Production release and the remaining six-repository audit are not completed. Earlier entries below preserve the original checkpoint's history.**

## Authority and review

The attached corrected v2.1 recommendation and institutional erratum were reconciled with NS-KB-12, webcopy contracts, the ratified charter and source registries. The mounted source snapshots and original documents were not modified. Canonical reviewed derivatives and SHA-256 source/review records are under `content/canonical/reviewed-v2.1/`; decisions are in `docs/content/v2.1-binding-reconciliation.md` and `docs/IMPLEMENTATION-MERGE-v2.1.md`.

The institution remains the ratified independent, Nigerian-designed, whole-of-economy open specification and conformance commons. Individual RFC status lines retain the verified remote baseline's CANDIDATE STANDARD lifecycle; technical claim corrections do not silently rename that lifecycle or downgrade the institution. Governed source H1s are retained; SEO title/description candidates are separate. NS-ANSWER and RAG-H2 identifiers remain traceable through semantic alias decisions, with15 visible reviewed FAQs and matching FAQPage data.

## Implemented and verified locally

| Area | Evidence |
| --- | --- |
| Full IA |934 independently rendered documents:886 source-record paths,47 resolved intermediate indexes and1 search utility. These are local implementation paths, not934 live URLs. |
| Actual HTTP |Production SSR preview tested over loopback network.934 pages return200;12 unknown paths return404. Full heading/metadata/breadcrumb/ID inventory in `evidence/v21-network-route-inventory.json`. |
| Transfer budget |Final HTTP-network maximum14175 bytes; corresponding in-process maximum14176 bytes. Both sum actual gzip HTML plus initial CSS/JS and are below35840 bytes. Dynamic verifier code is loaded after user action. |
| Indexing |All pages remain noindex; sitemap contains zero public-release-approved URLs. No preview SoftwareApplication/WebAPI graph was published. |
| Framework |Genuine TanStack Start SSR with compiled universal fetch handler; Hono APIs and static asset routing integrated. Unknown civic routes reach the router rather than a static200 fallback. |
| Source/reference checks |15 integrated command groups pass; exact commands and exit codes in `verification-output/results.json`. The runner continues independent checks and bounds each subprocess to180 seconds. |
| Content contracts |17 regression cases pass, including negative mutations; governed H1s, full IA families, NS-ANSWER/RAG/FAQ distinctions, source hashes and local conformance receipt are checked. |
| Contracts |17 JSON schemas,5 content instances,6 templates,4 OpenAPI documents/6 operations and a freshly signed local SDK credential validated. This is technical validation, not legal approval. |
| SDKs/conformance |Six package builds pass;24 package tests pass. Five parsed Gherkin scenarios execute24 bound steps. Results remain local reference behavior, not deployed accreditation. |
| OPA |11 targeted boundary tests pass. No inference of statutory certification. |
| Publication trust |Two test groups cover exact signed root data, distinct configured witness material, malformed/private keys, tampering, freshness, future dates, duplicate/insufficient witnesses. Runtime refuses unprovisioned or invalid publications. Production keys and audit data were not invented. |
| Worker preparation |TypeScript passes; Wrangler dry-run bundles the SSR/API Worker. This dry-run performs no remote D1 migration, deployment or DNS cutover. |
| D1/SQLite |Local D1 reseeded from source. SQLite has14 RFCs,32 industries,37 jurisdictions,774 councils,14 modules,901 FTS rows and0 audit roots; repeated logical rows match, foreign keys clear, integrity ok. Search paths map to implemented descendants and reviewed FAQ text. |
| Data integrity |All296 readiness cells explicitly unassessed;677 council names corroborated,97 variants unresolved. Codes are project-assigned. These unknowns are preserved, not converted into readiness scores or absent-service claims. |
| Repository preparation |Six substantive source exports and SHA manifests prepared under `repository-exports-v21/`. They are not six created remotes or independently released packages. |
| Retrieval evaluation |60-question evaluation protocol prepared; all external-engine runs remain NOT_RUN. No citation/visibility performance fabricated. |

## Access: account role versus actual integration ability

Using the explicitly selected `nigeriastack` connection:

- Repository metadata returns admin=true, push=true and pull=true for `nigeriastack/nigeriastack.org`.
- Actual create-branch request for `repair/corrected-p0-p7-v2-1` returns403 `Resource not accessible by integration`.
- Readback of that proposed ref returns404; no branch was created. Remote main remains `2083b50267c4fc1af5f41692a96658c37d6b4723`.
- The six other requested repositories return404 through this connection. Missing visibility versus nonexistence is unresolved.
- Available connector actions do not include repository creation or administration-scope elevation. GitHub CLI has no authenticated account here. Earlier secure browser verification did not complete; the current browser has no retained sign-in tabs. No credentials were requested in chat or exposed.

The account's admin role does not expand installation-token permissions. The integration cannot grant itself scopes, create a Codex installation or guarantee permanent access. An owner must authorize the write-enabled Codex integration for the correct account/repositories (or supply an approved code-writing runtime outside model-visible secrets). See `docs/access/GITHUB-ACCESS-REMEDIATION.md`. ChatGPT approval preferences alone cannot repair provider permissions. No alternative account, weakened security control or fabricated successful write was used.

## Outstanding evidence and release gates

- Real Chromium viewport/accessibility runs remain blocked by socket EPERM.62 browser cases are discoverable, not passed. Actual native200%/400% zoom remains unverified. No old screenshot is promoted as current evidence.
- Full empirical assessment of296 readiness cells and resolution of97 council-name variants remain unfinished research tasks. Legal mappings, USSD allocation and deployment claims require their own evidence.
- Four external retrieval systems have not been measured. The prepared60-query protocol is not a baseline result.
- No remote branch, PR, repository creation, hosted CI run, GitHub protection setting, production key provisioning, remote D1 migration, Cloudflare deployment, DNS cutover or secret rotation was completed.
- `scripts/ci/verify-release-readiness.mjs` exits1 with explicit blockers; production preparation cannot silently deploy. Separate public release authorization remains absent.

## No execution deadlock

`control/EXECUTION-STATE.json` separates external blocked prerequisites from ready work. `control/ISSUES.json` records owners, acceptance conditions and partial states. Independent implementation, tests, exports and checkpoints proceeded around authentication/permission failures. Tests have bounded subprocess timeouts; preview servers are terminated using a shell trap. External mutations are read back before retry. Failed checks are not weakened, and missing evidence is not relabeled PASS.

## Verification commands and records

- `OPA_BIN=/workspace/scratch/9d2277dd6412/opa node scripts/ci/run-verification.mjs` →15 command groups pass. Source/reference scope only; outputs in `verification-output/`.
- `PORT=36237 node scripts/serve.mjs` from `apps/web`, bounded readiness check, then `NS_HTTP_BASE_URL=http://127.0.0.1:36237 node scripts/verify-http-inventory.mjs` →934 actual HTTP200,12 HTTP404, zero published URLs; server stopped by trap. The first final attempt raced startup and failed; the successful rerun used an explicit bounded readiness check.
- `node scripts/generate-d1-seed.mjs` →deterministic source-hashed seed. A first attempt rejected an unapproved intermediate RFC status rewrite; governed lifecycle lines were restored before regeneration.
- `python3 scripts/ci/verify-seed-sqlite.py` →logical idempotency, integrity, foreign keys and all indexed path targets pass. A stricter initial whole-database byte comparison was replaced with logical comparison because FTS internal segment metadata may legitimately change.
- `CI=true pnpm exec wrangler d1 execute nigeriastack-commons-d1-prod --local --config apps/web/wrangler.toml --file=./scripts/seed-d1-from-canonical-json.sql` →local reseed success, no remote flag.
- `node --import tsx --test tests/edge/publication-trust.test.ts` and `./node_modules/.bin/tsc --noEmit -p apps/web/tsconfig.json` →pass after correcting typed-array and witness-set implementation errors.
- `CI=true pnpm exec wrangler deploy --dry-run --config apps/web/wrangler.toml --outdir apps/web/dist/worker` →Worker packaging only; no deployment.
- `node scripts/ci/github-access-preflight.mjs` →CLI authentication unavailable, explicit failure receipt. The connector's actual403 probe is recorded separately above.
- `node scripts/export-repositories.mjs repository-exports-v21` →six source exports, file hash manifests and remote-provisioning blockers recorded. Earlier generated export directory is retained separately, not overwritten.
- `node scripts/evaluation/build-retrieval-suite.mjs` →60 protocol entries, zero engine-result claims.
- `node scripts/ci/verify-release-readiness.mjs` →expected exit1, `BLOCKED`.
- Browser discovery, type checks and socket-failure command details: `docs/handoff/v21-qa-ledger.md`. Source and portal-specific commands: `docs/handoff/v21-source-ledger.md` and `docs/handoff/v21-portal-ledger.md`.
- `git diff --check` reports retained Markdown hard-line-break whitespace inside source-derived SQL; `git -c core.whitespace=-blank-at-eol diff --check` is the appropriate source-preserving whitespace check. It does not waive any functional gate.

Changed paths are enumerated in `docs/handoff/v21-modified-paths.txt`. Final local commit, clean-status readback, bundle verification and artifact hashes are in the checkpoint receipt delivered with this ledger. A local checkpoint is not represented as a remote merge.

## Continuation: GitHub connection repaired

The historical access failure above is resolved for portal code/PR/workflow writes. With owner approval, ChatGPT Codex Connector was installed on nigeriastack for the selected portal repository (installation183083839). An actual branch create and separate matching SHA readback succeeded from the same Work session. Receipt: evidence/github-access-restored-2026-11-17.json. Administration access, six-repository provisioning, hosted CI results, implementation merge and production release remain separate acceptance conditions. This continuation proceeds with remote review and hosted verification.

## Continuation completed: remote merge and native Chromium evidence

PR #2 (https://github.com/nigeriastack/nigeriastack.org/pull/2) merged at `7fd69e72cc53d53977e0962c078637eef7aa35e0`; a separate main-ref readback verified the merge. The reviewed implementation head was `d214ff66c4d33dcfb9e0b2a9fafc6f7ec33c99fc`, merged tree `de046d07e7ac7c6f938e78f11a04df448abd88c2`. GitHub Actions run 44178043156 tested PR checkout `826e229c27aa43dd164d72689871acee8793f9c0`: https://github.com/nigeriastack/nigeriastack.org/actions/runs/44178043156. Source, browser and release-evidence jobs all concluded success.

- All15 source/reference command groups passed again locally and on the hosted runner.
- All63 browser tests passed. The added native-zoom test performs20 target/factor measurements: both authoritative artboards and8 portal routes at200% and400%. Chromium's native tab zoom is set through chrome.tabs.setZoom and read through getZoom, with independent CSS viewport and device-pixel-ratio checks. Normal and text-spacing measurements show0 horizontal overflow. Screenshots are retained in the browser-evidence artifact. This is tested behavior, not a blanket WCAG certification or exhaustive typo audit.
- Corrected an outdated representative industry test URL to its canonical sector path. Removed artboard body overflow suppression, constrained grid/flex controls and now assert body overflow and non-scrollable clipping. The earlier61/62 run exposed the stale URL; the first native run rejected400% represented as3.9999999999999996, corrected with a bounded numeric tolerance while retaining exact viewport checks.
- Source, Playwright and native receipts are bound to the tested Git commit. The release-evidence job downloads and checks them together. The production verifier correctly returns BLOCKED with only the explicit public-release authorization and Cloudflare binding prerequisites in that technical evidence job. It never deploys.
- Initial transfer remains under35840 bytes; hosted build/inventory measured maximum14175 bytes.
- Connector repository selection still includes only the portal. The owner browser confirmed protocol-specifications is an existing private repository with history. No replacement repository was created, no visibility was changed, and no broader app grant was saved. The other five404s remain visibility/existence uncertainties until the intended six repositories are selected for the installation.
- The cloud workspace/browser became unavailable during repository-access inspection. Subsequent code and evidence were persisted directly through GitHub. Local checkout at0adeed0488892c6337865b68ca5648fcb69df4bc needs reconciliation when that workspace returns; preserve any surviving local diff. The earlier browser-worker CSS command's local effect was not verified.
- Current durable receipts: `evidence/remote-merge-hosted-ci-2026-11-17.json` and `evidence/native-zoom-hosted-2026-11-17.json`. Older committed failed viewport telemetry is removed from source; every new browser run emits `tests/telemetry/nigeriastack-viewport-telemetry.json` and retains it in the CI artifact.

Continuation verification commands: `OPA_BIN=/workspace/scratch/9d2277dd6412/opa node scripts/ci/run-verification.mjs` (15 groups pass), `git -c core.whitespace=-blank-at-eol diff --check` (exit0), `node --import tsx scripts/ci/verify-cleanroom-nomenclature.ts` (exit0), and the Git pre-commit naming/token checks (both exit0). Hosted commands and their full outputs are in the linked run: `pnpm install --frozen-lockfile`, `pnpm run ci:verify-all-gates`, `pnpm exec playwright install --with-deps chromium`, SDK/portal builds, bounded portal startup, `NS_APP_BASE_URL=http://127.0.0.1:3000 pnpm exec playwright test tests/telemetry`, and `node scripts/ci/verify-release-readiness.mjs` (expected exit1 for external production prerequisites; evidence-coherence wrapper exits0). GitHub mutations used create_tree, create_commit, leased update_ref, create_pull_request and expected-head merge_pull_request with separate ref readbacks. The uploaded initial tree14d4da056304a8958ad1429a6d0850656675be78 exactly matched the local checkpoint before hosted corrections.

Changed paths for this continuation and initial publication are in `continuation-modified-paths-2026-11-17.txt`. Public deployment, remote D1, production keys, administration settings, full empirical provenance and external retrieval-engine measurements remain unfinished.
