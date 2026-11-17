# Approved data implementation and evidence limits

Reviewed on 17 November 2026. This ledger supersedes earlier dataset/seed handoff statements that described the source JSON as unchanged or treated missing empirical evidence as a structural gate failure. A successful gate now means the evidence states are internally consistent. It does not mean Nigeria's services have been empirically assessed.

## Readiness atlas

All 37 jurisdictions have eight explicit evidence records: 296 of 296 cells are `NOT_ASSESSED`; zero are empirically assessed. The former live, pilot and paper-bound labels had no per-cell evidence bundles. They are withdrawn from the current status fields and preserved only in `withdrawnSourceAssertions`. No inference of paper-only operation or absence of a service follows from an unknown record. Unsubstantiated geographic gap mechanisms and recommendations have also been withdrawn from current fields.

`assessmentProvenance[dimension]` records assessment state, review date, actual observation timestamp, source references, service scope, assessment method, evidence summary and limitations. An unknown record has a real repository review date, but no service observation date. The review date is not a service verification date. `content/atlas/readiness-provenance.schema.json` describes the record; `scripts/ci/verify-dataset-integrity.mjs` enforces its central invariants plus source resolution, cardinality, status consistency and council identity records.

A claimed live/pilot/paper-only status requires dated primary service observation, operator attestation or audit evidence, precise scope, method, summary and limitations. A portal URL, indexed excerpt, legal text or generic announcement cannot satisfy that readiness gate. Future observations must describe what was actually tested and where; a successful page load is insufficient to certify a whole multi-service dimension. The gate does not establish that a submitted source is true, independent or adequate; evidence still requires human review.

One discovery candidate was examined for Lagos land services. The official Lands Multipurpose Desk search excerpt describes application and tracking functions, but direct retrieval returned HTTP 404. It remains a candidate source, explicitly excluded from assessed evidence and D1 readiness-source URLs. No transaction, service coverage, production operation or interoperability was verified. Every other cell remains unassessed because no qualifying cell evidence bundle was established. No review dates were substituted for operational observation dates.

## Council identity audit

The registry contains **768 state local government areas and six FCT area councils: 774 total**. The FCT six are included in 774. The Ministry of Justice constitutional publication supports that count in section 3(6); it is an edition containing only the first three alterations, so it does not establish the current consolidated state of all law.

Every council has an `identityAudit` record. An exact comparison after removing ASCII punctuation/spacing and lowercasing against the corresponding jurisdiction's NBS survey category names corroborated 671 project names. The six FCT names are corroborated separately by INEC's February 2026 statement, yielding **677 corroborated names and 97 unresolved variants**. NBS categories are statistical metadata; they are not treated as a certified constitutional identity register. Source names with differing spellings are not automatically merged or copied over the project records. All 774 constitutional identity statuses remain `NOT_YET_VALIDATED`.

Only two corrections were made, corroborated by NBS and the INEC Adamawa office locator search excerpt: `AD-LGA-04` Gayuk → Guyuk and `AD-LGA-06` Grie → Girei. The direct INEC locator fetch returned HTTP 403; that limitation is recorded. Stable project codes were retained. No council was added, removed or moved to another jurisdiction.

The `XX-LGA-NN` namespace and two-letter state codes are **NigeriaStack project identifiers**, with no claim that a government body assigned them. Project sequence order differs from source category order; numeric survey category locators are solely references to that dataset. No official-code crosswalk is claimed. `identityAuditMethod` records the retrieved NBS response hash, category count and normalization method. The hash establishes byte identification, not authenticity, signatures or continuing availability. The 97 unresolved names are individually identified in the canonical JSON, with reasons and candidate evidence references.

## Sources actually consulted

| Source | Supported use | Material limit |
| --- | --- | --- |
| [Federal Ministry of Justice constitution PDF](https://justice.gov.ng/wp-content/uploads/2020/09/Nigerian-Constitution.pdf) | Section 3(6) count and identification of First Schedule Parts I/II | First three alterations only; schedule extraction contains OCR errors; not accepted as a complete current-law audit |
| [NBS GHSP Wave 5 LGA categories](https://microdata.nigerianstat.gov.ng/index.php/catalog/82/variable/F93/V3866?name=lga) | All 774 names compared within their corresponding jurisdictions | Statistical categories have spelling variants; code authority, boundaries and legal identities not established |
| [INEC February 2026 media remarks](https://wp1.inecnigeria.org/remarks-by-the-honourable-chairman-independent-national-electoral-commission-inec-prof-joash-amupitan-san-at-the-first-regular-consultative-meeting-with-media-executives-held-at-the-inec-confer/) | Six FCT council names | Election statement, no digital service assessment |
| [INEC Adamawa CVR locator](https://cvr.inecnigeria.org/locator/browse/state_id%3A2) | Search excerpt corroborates Girei/Guyuk names | Direct fetch failed with 403 |
| [Lagos Lands Multipurpose Desk](https://lmpd.lagosstate.gov.ng/) | Candidate discovery only | Search excerpt reviewed; direct fetch 404; operation and coverage unknown |

The source catalog at `content/atlas/evidence-sources.json` records publishers, retrieval dates, source types, supported scope and limitations. Dates are evidence-review dates on this run. They are not historical service observation dates.

## Industry and municipal specifications

The 32 industry entries lacked dated primary support for their supplier, regulator, coverage and failure assertions. Those inputs are quarantined in `unverifiedSourceAssertions`; current supply/regulator/gap arrays are empty, empirical evidence is `UNRESOLVED`, and civic descriptions say assessment is pending. Proposed building blocks and interventions remain design proposals. They must not be described as audited market gaps, incumbent performance findings or deployed capabilities. The industry gate currently permits the honest unassessed state; a future assessed-industry model requires a separate scoped evidence design.

The 14 municipal modules are proposed specifications. Each now records external legal review pending and deployment not assessed. Their legacy Fourth Schedule mappings and claimed outcomes are unvalidated source assertions. Proposed channels, offline features and zero-escrow constraints do not attest to deployment or allocated telecommunications resources.

External legal review is still required for:

- The application of SC/CV/343/2024 to each payment flow, distinctions between project zero-escrow policy and the judgment's actual orders, and the relevant treatment under sections 121(3) and 162.
- Every proposed module's asserted Fourth Schedule paragraph, the division of federal/state/local authority, and any required enabling legislation. Court records, registration/attestation, property/land and health modules especially need jurisdiction-specific review.
- Evidence Act admissibility, the effect of cryptographic seals, applicable current amendments, and any claimed court acceptance. A protocol conformance result is not an admissibility ruling.
- NDPA legal basis, consent/revocation guarantees, data-controller responsibilities and applicable current guidance. Technical controls alone do not establish compliance.
- Any assumed live USSD shortcode allocation, live council treasury integration, active pilot, deployment count, open interface or operator guarantee.

No legal conclusion or operational deployment was established by this data work.

## D1 generation and checks

The generator now calls the integrity gate before writing either SQL mirror. Readiness values are mapped from the current JSON statuses; unknowns map conservatively to `NOT_ASSESSED`. Only evidence URLs belonging to assessed cells enter D1's legacy evidence-links field. A jurisdiction verification timestamp remains empty unless all eight dimensions have actual observation timestamps. Discovery candidates remain in canonical JSON and are not promoted into D1 evidence.

The fixed D1 schema has no per-cell provenance or council identity-review columns. The canonical JSON is therefore the full evidence record; D1 is a reduced projection, with source pointers and byte hashes. Council FTS text identifies codes as project identifiers. Industry FTS avoids withdrawn assertions; module FTS labels proposed specifications and legal review. No audit roots are fabricated or seeded.

`docs/handoff/evidence/approved-data-verification.json` records an in-memory SQLite test applying the exact handoff migration and seed twice. Logical rows are identical after reseeding; foreign keys and integrity checks pass; the SQL mirrors are identical; all 296 stored readiness values remain `NOT_ASSESSED`. Counts are 14 RFCs, 32 industries, 37 jurisdictions, 774 councils, 14 modules, zero audit roots and 901 FTS rows. This verifies local SQLite, not a remote Cloudflare D1 deployment.

Four isolated mutation checks passed: the gate rejects an assessed claim without sources/date, missing cell provenance, a readiness claim based only on portal discovery, and an unknown cell with an invented observation timestamp. These checks used temporary copies, leaving canonical data untouched. Changing either corrected council name without updating the identity review is also rejected by the gate's reviewed-name comparison.

Reproduce with `node scripts/ci/verify-dataset-integrity.mjs` and `node scripts/generate-d1-seed.mjs`. If another approved content owner changes FAQ, benchmarks or RFC inputs, regenerate both SQL mirrors and recheck SQLite idempotence before release; the verification hash records the exact source snapshot tested here. No remote writes were performed.
