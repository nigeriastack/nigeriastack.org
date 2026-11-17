# v2.1 source and content gate ledger

Local work on 17 November 2026. Read project AGENTS.md, the content architect instructions, protocol architect instructions, NS-KB-12, protocol glossary and source snapshots 02, 04, 06, 07, 10, 11, 13 and corrected 15. No mounted original or project_sources snapshot was changed. No commit, remote repository write or deployment was performed.

## Reviewed collection

`content/canonical/reviewed-v2.1` contains the FAQ, answer-unit, executive TL;DR, SEO, baseline Organization/WebSite and full IA review copies. `bindings.json` records source snapshot names, SHA-256 source digests, reviewed-copy digests, the seven exact governed H1 decisions, all fifteen NS-ANSWER and fifteen canonical RAG bindings, FAQ hierarchy and independent execution/institutional statuses. The full source tree is preserved with candidate provenance labels; approved local decisions are explicit in the sidecar.

The seven H1 SOURCE strings remain controlling. V2 title, description and canonical candidates can be used independently of the rejected automatic H1 replacement. Semantic crosswalk merges retain canonical RAG heading/route and NS-ANSWER aliases. Related protocol summaries remain distinct from source leaf benchmarks. Fifteen reviewed governance FAQs replace the visible legacy wording without deleting the historical collection.

NS-ANSWER-11 and FAQ-10 contained stale four-pass/one-pending prose. A fresh local CLI run produced `local-conformance-receipt.json`: five passing scenarios, 24 executable Gherkin steps, `LOCAL_REFERENCE_SDK_ONLY`. The reviewed prose states this scope and makes no deployment or formal-accreditation claim. All answer and FAQ word counts were computed from the actual reviewed text.

`docs/content/v2.1-binding-reconciliation.md` explains H1 precedence, semantic crosswalk, full family inventory and evidence boundaries. NS-KB-12 links that matrix without changing its governed H1 source text or the five-level hierarchy.

## Gates and regression cases

`verify-content-counts.mjs` now validates source-copy hashes; exact governed H1/copy-slot decisions; distinct FAQ, NS-ANSWER and RAG inventories; H2 and route binding; full H1–H4 tree adjacency and section agreement across all seven roots and seven families; 14 explicit municipal paths; 886 potential records; source/approved status independence; visible FAQ hierarchy; baseline entity types; local receipt scope and scenario completion. It exports the validator so negative fixtures exercise semantic failures directly rather than merely tripping a file digest.

`node --test tests/ci/content-contracts.test.mjs` passes 17 tests. Sixteen bad fixtures prove rejection of duplicate FAQ IDs, silent H1 replacement, lost RAG headings, reassigned RAG routes, answer-route mismatch, skipped heading levels, removed H4 subtree, omitted family, inventory presented as live URLs, institutional downgrade, stale counts, overlong answers, promoted FAQ hierarchy, unknown aliases, incomplete local scenarios and unsupported deployed entity types.

`node scripts/ci/verify-content-counts.mjs` passes. This is source-contract validation; browser/HTTP and render manifests remain separate checks owned by the portal task.

`node scripts/ci/verify-spec-contracts.mjs` passes unchanged: 17 draft 2020-12 schemas, five content instances, six ClearAm templates, four OpenAPI 3.1.1 documents/six operations and a freshly signed SDK credential instance. Inspection found no material schema fix necessary in this task. The validator compiles schemas, checks glossary references, validates schema-marked data, verifies template catalog equality/orphans, dereferences and validates API contracts, enforces path parameters/operation IDs and compiles embedded request/response schemas.

`node --import tsx scripts/ci/verify-cleanroom-nomenclature.ts` passes: 192 audited files in this run. These counts describe the local run and may increase with concurrent portal changes.

The 886 planning inventory is not production crawl evidence. No fresh readiness, industry-provider or installation evidence was invented.
