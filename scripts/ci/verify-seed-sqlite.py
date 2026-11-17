"""Check logical seed idempotency, foreign keys and index targets, not FTS internals."""
import json,sqlite3,hashlib
from pathlib import Path
r=json.loads(Path('apps/web/dist/reports/route-inventory.json').read_text())
c=sqlite3.connect(':memory:')
c.executescript(Path('apps/web/migrations/0001_ngstack_d1_fts5_schema.sql').read_text())
s=Path('scripts/seed-d1-from-canonical-json.sql').read_text()
tables=['normative_rfcs','industry_capability_ledger','subnational_state_atlas','constitutional_lga_774_registry','lga_service_modules_14','daily_merkle_audit_roots','ngstack_global_search_fts']
def logical_rows():
 return {t:c.execute('SELECT * FROM '+t+(' ORDER BY entity_type,entity_id' if t.endswith('_fts') else ' ORDER BY 1')).fetchall() for t in tables}
c.executescript(s);first=logical_rows();c.executescript(s);second=logical_rows();assert first==second,'Logical seed rows changed on reapplication'
counts={t:len(rows) for t,rows in first.items()}
assert list(counts.values())==[14,32,37,774,14,0,901],counts
assert c.execute('PRAGMA integrity_check').fetchone()[0]=='ok'
assert c.execute('PRAGMA foreign_key_check').fetchall()==[]
routes={p['pathname'] for p in r['routes']}
bad=[u[0] for u in c.execute('SELECT canonical_url FROM ngstack_global_search_fts') if u[0].split('#')[0] not in routes];assert not bad,bad[:10]
result={'runtime':'Python SQLite; not remote D1','counts':counts,'logicalIdempotency':True,'integrity':'ok','foreignKeys':[],'ftsPathTargetsAllExistInCompiledInventory':True,'seedSha256':hashlib.sha256(s.encode()).hexdigest(),'limitations':'FTS internal segment bytes may differ after reseeding; fragment binding is checked separately by content gates; no live release claim'}
Path('verification-output').mkdir(exist_ok=True)
Path('verification-output/sqlite-seed.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
