import assert from 'node:assert/strict';
import app from '../../../apps/web/src/worker.ts';
for (const path of ['/.well-known/ngstack-keys.json','/v1/audit/merkle-root','/v1/audit/treasury-merkle-root','/api/v1/summary','/api/v1/rfcs','/api/v1/industries','/api/v1/states','/api/v1/lga-modules','/api/v1/search?q=treasury']) {
 const response=await app.request('http://localhost'+path, {}, {SOVEREIGN_NON_IMPERSONATION_HEADER: 'Independent Commons — CC0'});
 assert.equal(response.status,503,path);
 const body=await response.json(); assert(body.status,path);
 console.log(path,response.status,body.status);
}
