import test from 'node:test';
import assert from 'node:assert/strict';
import {loadV23Research,verifyV23Research} from '../../scripts/ci/verify-v23-research.mjs';
const baseline=loadV23Research();
test('seven researched titles, 296 readiness cases and 97 names are source-bound',()=>{
  const d=verifyV23Research(baseline);
  assert.equal(d.roots,7); assert.equal(d.readinessCases,296);assert.equal(d.councilCases,97);
});
const mutations=[
 ['duplicate SEO title',d=>{d.roots.rootPages[1].title=d.roots.rootPages[0].title;},/duplicate root title/],
 ['old source H1 without owner decision',d=>{d.roots.rootPages[0].h1='Unapproved original';},/editorial H1 drift/],
 ['missing readiness case',d=>{d.atlas.cases.pop();},/296 case invariant/],
 ['duplicate readiness jurisdiction dimension',d=>{d.atlas.cases[1].dimension=d.atlas.cases[0].dimension;},/duplicate atlas dimension/],
 ['portal evidence falsely certifies a service',d=>{d.atlas.cases[0].currentReadiness='VERIFIED_LIVE';},/insufficient proof to promote/],
 ['unassessed cell published',d=>{d.atlas.cases[0].publishableFinding=true;},/falsely publishable/],
 ['missing constitutional-name case',d=>{d.names.cases.pop();},/97 council variant invariant/],
 ['unreviewed constitutional rename',d=>{d.names.cases[0].currentConstitutionalIdentity='CONFIRMED';},/unreviewed statutory name promoted/],
 ['silent council URL migration',d=>{d.names.cases[0].redirectDecision='CHANGE_ROUTE';},/premature URL migration/],
 ['institutional status downgraded',d=>{d.roots.institutionalStatus='PROPOSAL';},/Expected values to be strictly equal/]
];
for(const [name,mutate,error] of mutations){
  test('rejects '+name,()=>{const data=structuredClone(baseline);mutate(data);assert.throws(()=>verifyV23Research(data),error);});
}
