/** Local publication profile. Configuration must come from the authorized issuer. */
export interface PublicationKey { id:string; jwk:JsonWebKey }
export interface AuditRoot { epoch_date:string; merkle_root_sha256:string; specification_commit_sha:string; verified_zero_escrow_invariant:number; ed25519_witness_signatures_json:string; published_at_utc:string }
const decode=(s:string)=>{
 if(!/^[A-Za-z0-9_-]+$/.test(s))throw Error('Invalid base64url');
 const t=s.replace(/-/g,'+').replace(/_/g,'/');return Uint8Array.from(atob(t+'='.repeat((4-t.length%4)%4)),c=>c.charCodeAt(0));
};
export function publicationKeys(raw?:string):PublicationKey[]{
 if(!raw)return [];
 try{
  const keys:PublicationKey[]=JSON.parse(raw);
  if(!Array.isArray(keys)||!keys.length||keys.length>20) return [];
  const seen=new Set<string>(),materials=new Set<string>();
  for(const key of keys){
   if(typeof key.id!=='string'||!key.id.startsWith('did:web:nigeriastack.org#')||seen.has(key.id)||key.jwk?.kty!=='OKP'||key.jwk.crv!=='Ed25519'||typeof key.jwk.x!=='string'||Object.hasOwn(key.jwk,"d")||materials.has(key.jwk.x)||decode(key.jwk.x).length!==32)return [];
   seen.add(key.id);materials.add(key.jwk.x);
  }
  return keys;
 }catch{return [];}
}
export function auditSigningBytes(row:AuditRoot):Uint8Array<ArrayBuffer>{
 return new TextEncoder().encode(JSON.stringify({profile:'NS-AUDIT-PUBLICATION-v1',epochDate:row.epoch_date,merkleRootSha256:row.merkle_root_sha256,specificationCommitSha:row.specification_commit_sha,verifiedZeroEscrowInvariant:row.verified_zero_escrow_invariant,publishedAtUtc:row.published_at_utc}));
}
export async function verifyAuditRoot(row:AuditRoot,keys:PublicationKey[],now=Date.now(),quorum=2):Promise<boolean>{
 try{
  if(publicationKeys(JSON.stringify(keys)).length!==keys.length)return false;
  if(!Number.isInteger(quorum)||quorum<2||quorum>keys.length||!Number.isFinite(now))return false;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(row.epoch_date)||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(row.published_at_utc))return false;
  const day=Date.parse(row.epoch_date+'T00:00:00Z'),published=Date.parse(row.published_at_utc);
  if(!Number.isFinite(day)||!Number.isFinite(published)||new Date(day).toISOString().slice(0,10)!==row.epoch_date||row.published_at_utc.slice(0,10)!==row.epoch_date||published>now||now-published>48*3600*1000)return false;
  if(!/^[a-f0-9]{64}$/.test(row.merkle_root_sha256)||!/^[a-f0-9]{40}$/.test(row.specification_commit_sha)||row.verified_zero_escrow_invariant!==1)return false;
  const signatures=JSON.parse(row.ed25519_witness_signatures_json);
  if(!Array.isArray(signatures)||signatures.length>20)return false;
  const seen=new Set<string>(),bytes=auditSigningBytes(row);
  for(const signature of signatures){
   const key=keys.find(k=>k.id===signature.keyId);
   if(!key||seen.has(key.id))return false;
   const imported=await crypto.subtle.importKey('jwk',key.jwk,{name:'Ed25519'},false,['verify']);
   if(!await crypto.subtle.verify('Ed25519',imported,decode(signature.signatureBase64url),bytes))return false;
   seen.add(key.id);
  }
  return seen.size>=quorum;
 }catch{return false;}
}
