# D1 seed hydration and SQLite verification

The seed now derives deterministically from the six canonical JSON files and fourteen RFC Markdown files in this checkout. Run `node scripts/generate-d1-seed.mjs` from the repository root. It writes identical SQL to `scripts/seed-d1-from-canonical-json.sql` and `apps/web/scripts/seed-d1-from-canonical-json.sql`. Every input has a SHA-256 comment and each generated row has its source document or JSON pointer. These hashes establish byte provenance within this checkout; they do not establish empirical verification, legal authority, signatures, or production audit history.

The generated SQL uses a transaction, primary-key upserts, and replacement of the seven managed FTS entity categories. Repeated application preserves logical rows and prevents duplicate FTS results. Audit-root rows are neither inserted nor removed. Existing unrelated FTS entity categories are retained. This is hydration of the supplied canonical collection, not a general database reconciliation migration: rows removed from future canonical JSON are not automatically deleted from primary tables.

## Schema mappings and known limits

| Input or missing field | Stored mapping | Limit |
| --- | --- | --- |
| RFC `CANDIDATE STANDARD (Stage 3)` | `DRAFT_STANDARD` | The schema has no candidate enum. No source RFC is promoted to ratified. Original status remains in full Markdown. |
| RFC metadata lacking update date, hourglass layer, or contract binding | Empty string for required text; `NULL` for optional contract/schema fields | No update time or binding is inferred. The title is the civic summary. Statutory anchor metadata is copied verbatim apart from Markdown formatting. |
| Industry source evidence assertions without URLs or verification dates | `UNRESOLVED` | Source incumbent names and failure descriptions remain documentary assertions, not verified supply claims. |
| Industry missing `macroSector` (28 of 32 rows) or protocols | Empty string or empty JSON array respectively | No sector codes or protocol assignments are fabricated. Four explicit sector assignments are preserved. |
| State readiness assertions without linked evidence or verified dates | All 296 cells `NOT_ASSESSED`, evidence `[]`, verified date `''` | Original JSON is unchanged. `VERIFIED_LIVE_PORTAL`, `CORROBORATED_PILOT`, and `PAPER_BOUND_GAP` source assertions are not treated as empirically established readiness. Empty date means unknown, not a verification event. |
| State name, capital, zone, LGA codes/counts/names | Copy from constitutional registry JSON | The 37 atlas codes must join the 37 registry codes. Codes and spellings are preserved exactly; they are not independently certified constitutional records. |
| LGA treasury, offline node, active modules without deployment evidence | `NOT_ASSESSED`, `NOT_ASSESSED`, `[]` | Neither the fiscal mandate nor module catalogue proves a deployment. |
| Module names and protocol tags | Canonical module name | Source has no separate civic label or protocol-tag property. No replacement label is invented. |
| Module offline capability | `1` only when source channels include `KIOSKBASE_OFFLINE_PWA` | A specification capability, not an operational deployment status. |
| Module `splitdirect_zero_escrow_enforced` | `1` | A required specification constraint from the shared LGA service envelope schema (both escrow fields `const: 0`) and fiscal mandate; never a production attestation. The exact handoff schema accepts no other value. |
| Module schema pointer | Existing `LgaGovernanceServiceEnvelope.schema.json` `$id` | Every seeded module ID is checked against the real schema's module enum. No individual module schema URI is invented. |
| FAQ and benchmark copy | Source strings and declared source references | Indexing preserves canonical assertions; it is not a new factual audit of those claims. |
| Daily Merkle audit roots | No rows seeded | No signed root, witness signature, verification key, commit witness, or publication time is supplied. |

## Verification performed

`node scripts/generate-d1-seed.mjs` completed successfully. The seed SHA-256 is `6ef3ee669fb37c2bd9646550371f4e495c984ee9f8ee5254c9c385fbbd28a3cc`.

A Python `sqlite3` in-memory database applied the exact handoff migration and seed twice. SQLite version was `3.53.1`. This verifies SQLite syntax and data behavior; it is not a Cloudflare D1 runtime result. Evidence is recorded in `docs/handoff/evidence/d1-sqlite-verification.json`.

| Collection | Rows after first and second seed |
| --- | ---: |
| RFC | 14 |
| Industry | 32 |
| State/FCT | 37 |
| LGA/Area Council | 774 |
| Municipal service module | 14 |
| Merkle audit root | 0 |
| Unified FTS | 901 |

Checks passed: all 296 readiness cells are `NOT_ASSESSED`; all 37 state verification dates are empty; foreign-key check returns no rows; integrity check is `ok`; logical rows are identical after reseeding; full RFC bodies and digests match source bytes; seed mirrors are identical; FTS matches `SureEvidence`, `Aba`, `treasury`, and quoted `NS-RFC-005`.

Reproduce the core SQLite checks from the repository root:

```sh
node scripts/generate-d1-seed.mjs
python - <<'PY'
import sqlite3
from pathlib import Path
db = sqlite3.connect(':memory:')
db.executescript(Path('apps/web/migrations/0001_ngstack_d1_fts5_schema.sql').read_text())
seed = Path('scripts/seed-d1-from-canonical-json.sql').read_text()
tables = ['normative_rfcs', 'industry_capability_ledger', 'subnational_state_atlas',
          'constitutional_lga_774_registry', 'lga_service_modules_14',
          'daily_merkle_audit_roots', 'ngstack_global_search_fts']
db.executescript(seed)
rows = lambda: {t: sorted(db.execute('SELECT * FROM ' + t).fetchall()) for t in tables}
before = rows()
db.executescript(seed)
assert before == rows()
assert [len(before[t]) for t in tables] == [14, 32, 37, 774, 14, 0, 901]
assert db.execute('PRAGMA foreign_key_check').fetchall() == []
assert db.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
assert db.execute("SELECT COUNT(*) FROM ngstack_global_search_fts WHERE ngstack_global_search_fts MATCH 'SureEvidence'").fetchone()[0] > 0
print('SQLite seed and repeat-application checks passed')
PY
```

An initial verification compared SQLite's internal FTS shadow-table dump and failed because delete/reinsert changes index internals. The final verification compares the public logical rows of all seven tables, which is the relevant idempotency property. No underlying data failure was observed.

Cloudflare D1 execution and any Wrangler environment blockers are recorded by the release owner separately. No remote D1 writes were performed by this task. Missing empirical provenance and signed audit evidence remain release limitations; the seed does not certify them.
