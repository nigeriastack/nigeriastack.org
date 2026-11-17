# Corrected v2.1 portal implementation ledger

17 November 2026. Local implementation only; no commit, push, deployment, DNS, account or production changes performed.

## Implemented

- Genuine TanStack Start server-rendered application remains the root application. All seven governed route families resolve source records; invalid patterns, wrong sector/industry pairs and unknown entity keys return 404.
- 886 source-record potential URLs comprise seven roots, 32 industries, seven protocol guides, one municipal suite, 14 modules, 14 RFCs, 37 jurisdictions and 774 council records. This is a source/render inventory, not a live deployment count.
- 47 legitimate intermediate directories: eight sector directories, two atlas indexes and 37 state council directories. `/search` is one utility route. Total locally rendered inventory: 934.
- Existing authoritative root H1 copy retained. Corrected SEO candidates supply title/description, never override the governed H1. Descendant titles disambiguate council names using their parent state. Sector slugs are deterministic normalized names from the existing eight-group local taxonomy; the old generic `directory` token is rejected.
- Every rendered heading has a stable unique ID; hierarchy is checked across actual compiled HTML. Descendants use meaningful H2/H3 sections, with H4 only where a subordinate source, authority or assessment subsection exists. RFC source headings render within normative requirements rather than creating extra H1s.
- Reviewed corrected answer units merge by semantic intent with canonical benchmark anchors; alias anchors preserve both IDs. NS-ANSWER-11 and 12 occupy separate paragraphs beneath RAG-H2-14. All fifteen reviewed governance FAQ pairs render visibly at H3 and supply exactly matching FAQPage answers. The reviewed executive overview appears on home.
- Metadata includes route, entity, dataset, audience, parent, copy slot, canonical, language/review, evidence status, answer IDs and source authority. Rendered canonical, Open Graph, social title/description, breadcrumbs and JSON-LD are page-specific. JSON-LD types are restricted to Organization, WebSite, BreadcrumbList and governance FAQPage; the preview graph is never imported.
- All routes remain `noindex, follow`; the generated sitemap has zero locations, equal to the zero evidence-approved public release URLs. No environment switch alone certifies deployment. Institution remains the independent ratified commons; RFC and execution statuses remain separate.
- Critical transfer counts actual rendered HTML plus every linked CSS/script gzip asset. The deferred verifier is loaded only after user action; it is not misrepresented as an initially transferred asset.

## Validation

Commands executed from repository root:

```sh
pnpm --filter nigeriastack-org-portal build
node --import tsx scripts/ci/verify-cleanroom-nomenclature.ts
bash scripts/ci/validate-tokens.sh
```

The build includes Vite production client/server output, the browser verifier, `tsc --noEmit`, sample critical-transfer validation and the complete production-handler inventory. `apps/web/scripts/verify-http-inventory.mjs` sends actual Request objects through the compiled server's fetch handler and consumes actual Response HTML. The transport is explicitly `IN_PROCESS_FETCH`, not a network/live-site certificate.

Inventory checks cover all 934 successful responses, one H1, ordered headings, stable nonempty unique heading/fragment IDs, unique route title/description, self-canonical, release-held robots, existing breadcrumb parents, exact fifteen visible FAQ pairs/graph, permitted graph types, all-critical gzip <=35,840 bytes, an empty public sitemap and twelve invalid-route 404 cases. Results: `apps/web/dist/reports/route-inventory.json`; budget samples: `apps/web/dist/reports/critical-transfer.json`. Final byte maximum and build status are recorded below after final compilation.

Naming gate passed: 200 files; zero foreign clones, sectional terms or vendor layer headings. Token/anti-slop audit passed.

## Limits and remaining release evidence

No public endpoint, crawler/WAF behavior, accreditation or field deployment is certified by local SSR. Browser responsive/zoom/accessibility checks are owned by the separate QA workstream; their actual execution status must be retained. Socket-based preview transport, if unavailable, remains distinct from successful in-process production rendering. Release remains held for deployment-specific evidence and separate public release approval.

Final local build result: PASS, including TypeScript and all 934 compiled responses. Maximum all-critical gzip transfer: **14,169 / 35,840 bytes**. All twelve invalid cases returned 404. No extra dependencies were installed for this change.

The inventory also supports actual loopback HTTP transport when preview and validation run in the same environment lifecycle:

```sh
# From apps/web, against the separately started production preview:
NS_HTTP_BASE_URL=http://127.0.0.1:3000 node scripts/verify-http-inventory.mjs
```

That mode uses network fetch for all page responses, invalid paths and sitemap, and reports `HTTP_NETWORK`. It must not be inferred from the successful default `IN_PROCESS_FETCH` result; the root integration workstream owns the actual network attempt.
