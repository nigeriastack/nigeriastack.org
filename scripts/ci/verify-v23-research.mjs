import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

const root=resolve(fileURLToPath(new URL('../../',import.meta.url)));
const read=(path)=>JSON.parse(readFileSync(resolve(root,path),'utf8'));
export function loadV23Research(){
  return {
    seo:read('content/canonical/reviewed-v2.1/seo-metadata.json'),
    roots:read('content/canonical/v2.3/researched-root-copy.json'),
    atlas:read('content/research/v2.3/atlas-296-evidence.json'),
    names:read('content/research/v2.3/council-97-identity-review.json')
  };
}
export function verifyV23Research({seo,roots,atlas,names}){
  assert.equal(roots.institutionalStatus,'2026.6-RATIFIED');
  assert.equal(roots.publicReleaseAuthorized,false);
  assert.equal(roots.rootPages.length,7,'exactly seven researched root pages');
  assert.equal(new Set(roots.rootPages.map(p=>p.route)).size,7,'duplicate root route');
  assert.equal(new Set(roots.rootPages.map(p=>p.title)).size,7,'duplicate root title');
  for(const p of roots.rootPages){
    const old=seo.find(s=>s.route===p.route);
    assert.ok(old,'missing canonical SEO research source: '+p.route);
    assert.equal(p.title,old.title,'unapproved SEO title drift');
    assert.equal(p.h1,old.h1,'unapproved editorial H1 drift');
    assert.equal(p.metaDescription,old.metaDescription);
    assert.equal(p.preserveCharter,true);
  }
  assert.equal(atlas.total,296);
  assert.equal(atlas.cases.length,296,'296 case invariant');
  assert.equal(new Set(atlas.cases.map(x=>x.stateCode+'|'+x.dimension)).size,296,'duplicate atlas dimension');
  assert.equal(new Set(atlas.cases.map(x=>x.stateCode)).size,37,'37 jurisdictions');
  assert.equal(new Set(atlas.cases.map(x=>x.dimension)).size,8,'eight dimensions');
  let portals=0,verified=0;
  for(const c of atlas.cases){
    assert.match(c.caseId,/^ATLAS-[0-9]{3}$/);
    assert.ok(c.officialAuthorityCandidate && c.jurisdiction);
    if(c.portalSource){ portals++;assert.match(c.portalSource.url,/^https:\/\//);assert.ok(c.portalSource.limitation);assert.equal(c.portalSource.doesNotEstablishReadiness,true); }
    if(c.currentReadiness!=='NOT_ASSESSED'){
      verified++;
      assert.ok(c.operationalTestReceipt && c.evidenceDigest && c.primaryReviewer && c.independentReviewer,'insufficient proof to promote '+c.caseId);
    } else {
      assert.equal(c.publishableFinding,false,'unassessed cell falsely publishable');
    }
  }
  assert.equal(atlas.officialPagesIdentified,portals);
  assert.equal(atlas.readinessVerified,verified);
  assert.equal(names.cases.length,97,'97 council variant invariant');
  assert.equal(names.totals.cases,97);
  assert.equal(new Set(names.cases.map(c=>c.projectCode)).size,97,'duplicate council case');
  let identityVerified=0;
  for(const c of names.cases){
    assert.ok(c.projectName && c.state && c.constitutionSource?.url);
    assert.ok(c.sourceTextComparison && c.firstScheduleSourceTextCandidate);
    assert.equal(c.redirectDecision,'PRESERVE_EXISTING_URL_UNTIL_REVIEW','premature URL migration');
    if(c.currentConstitutionalIdentity!=='NOT_YET_LEGALLY_VERIFIED'){
      identityVerified++;
      assert.ok(c.independentReviewer && c.proposedCanonicalName && c.officialCodeVerified,'unreviewed statutory name promoted');
    } else {
      assert.equal(c.publishableCorrection,false,'unreviewed name promoted to website');
    }
  }
  assert.equal(names.totals.currentConstitutionalIdentitiesVerified,identityVerified);
  assert.equal(names.totals.differentPreliminaryText,names.cases.filter(c=>c.sourceTextComparison!=='PRELIMINARY_MATCH_IN_1999_SCHEDULE').length);
  return {roots:7,readinessCases:296,portalsDiscovered:portals,readinessVerified:verified,councilCases:97,legalIdentitiesVerified:identityVerified,publicReleaseAuthorized:false};
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{console.log(JSON.stringify(verifyV23Research(loadV23Research()),null,2));}
  catch(e){console.error(e);process.exitCode=1;}
}
