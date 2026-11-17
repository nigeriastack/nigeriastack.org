import {test} from 'node:test';
import assert from 'node:assert/strict';
import {publicationKeys,verifyAuditRoot,auditSigningBytes,type AuditRoot} from '../../apps/web/src/publication-trust.ts';
const encode=(b:ArrayBuffer)=>Buffer.from(b).toString('base64url');
test('unprovisioned/malformed/private/duplicate publication keys rejected',async()=>{
 assert.deepEqual(publicationKeys(),[]);assert.deepEqual(publicationKeys('{}'),[]);
 const pair=await crypto.subtle.generateKey('Ed25519',true,['sign','verify']);const jwk=await crypto.subtle.exportKey('jwk',pair.publicKey);const key={id:'did:web:nigeriastack.org#test',jwk};
 assert.equal(publicationKeys(JSON.stringify([key])).length,1);
 assert.deepEqual(publicationKeys(JSON.stringify([key,key])),[]);
 assert.deepEqual(publicationKeys(JSON.stringify([key,{...key,id:"did:web:nigeriastack.org#same-material"}])),[]);
 assert.deepEqual(publicationKeys(JSON.stringify([{...key,jwk:{...jwk,d:'not-public'}}])),[]);
});
test('two distinct configured witnesses sign exact dated root; mutation/replay/stale/future/insufficient witness fail',async()=>{
 const pairs=await Promise.all([0,1].map(()=>crypto.subtle.generateKey('Ed25519',true,['sign','verify'])));
 const keys=await Promise.all(pairs.map(async(p,i)=>({id:`did:web:nigeriastack.org#fixture-${i}`,jwk:await crypto.subtle.exportKey('jwk',p.publicKey)})));
 const now=Date.parse('2026-11-17T18:00:00Z');
 const row:AuditRoot={epoch_date:'2026-11-17',merkle_root_sha256:'a'.repeat(64),specification_commit_sha:'b'.repeat(40),verified_zero_escrow_invariant:1,published_at_utc:'2026-11-17T17:00:00Z',ed25519_witness_signatures_json:'[]'};
 const sigs=await Promise.all(pairs.map(async(p,i)=>({keyId:keys[i].id,signatureBase64url:encode(await crypto.subtle.sign('Ed25519',p.privateKey,auditSigningBytes(row)))})));
 row.ed25519_witness_signatures_json=JSON.stringify(sigs);
 assert.equal(await verifyAuditRoot(row,keys,now),true);
 for(const bad of [{...row,merkle_root_sha256:'c'.repeat(64)},{...row,verified_zero_escrow_invariant:0},{...row,ed25519_witness_signatures_json:JSON.stringify([sigs[0],sigs[0]])},{...row,ed25519_witness_signatures_json:JSON.stringify(sigs.slice(0,1))},{...row,epoch_date:'2026-02-31'}])assert.equal(await verifyAuditRoot(bad,keys,now),false);
 assert.equal(await verifyAuditRoot(row,keys,now+72*3600*1000),false);
 assert.equal(await verifyAuditRoot(row,keys,now-2*3600*1000),false);
});
