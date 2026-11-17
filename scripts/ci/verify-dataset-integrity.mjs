import fs from 'node:fs';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// A pass certifies consistent epistemic records, not completion of empirical research.
export function verifyDatasetIntegrity(root = process.cwd()) {
  const read = p => JSON.parse(fs.readFileSync(resolve(root, p), 'utf8'));
  const industries = read('content/taxonomy/master-32-industry-matrix.json').industries;
  const atlas = read('content/atlas/subnational-36states-fct-atlas.json');
  const registry = read('content/atlas/lga-774-constitutional-registry.json');
  const modules = read('content/atlas/lga-14-service-modules-spec.json').modules;
  const sources = read('content/atlas/evidence-sources.json').sources;
  const date = (value, label) => {
    assert.match(value ?? '', /^\d{4}-\d{2}-\d{2}$/, label);
    assert.equal(new Date(value).toISOString().slice(0, 10), value, label);
  };
  const refs = (values, label, required = false) => {
    assert(Array.isArray(values), `${label}: expected source reference array`);
    if (required) assert(values.length > 0, `${label}: missing sources`);
    assert.equal(new Set(values).size, values.length, `${label}: duplicate references`);
    for (const id of values) assert(sources[id], `${label}: unknown source ${id}`);
  };
  for (const [id, source] of Object.entries(sources)) {
    assert.match(source.url, /^https:\/\//, id);
    for (const key of ['publisher', 'title', 'sourceType', 'supports', 'limitations']) assert(source[key]?.trim(), `${id}: missing ${key}`);
    date(source.retrievedOn, `${id}: retrievedOn`);
  }
  assert.equal(industries.length, 32);
  assert.equal(new Set(industries.map(i => i.industryId)).size, 32);
  assert.equal(atlas.jurisdictions.length, 37);
  assert.equal(new Set(atlas.jurisdictions.map(s => s.code)).size, 37);
  assert.deepEqual(atlas.dimensions, ['judiciaryAndMagistracyStatus', 'landAndDeedsRegistryStatus', 'stateRevenueAndTreasuryPassthroughStatus', 'healthAndSocialRegistryStatus', 'crvsAndLocalCouncilsStatus', 'openContractingProcurementStatus', 'agriculturalExtensionRegistryStatus', 'fiberRowAndSovereignHostingStatus']);
  assert.equal(atlas.dimensions.length, 8);
  assert.equal(new Set(atlas.dimensions).size, 8);
  assert.equal(registry.statesAndTerritory.length, 37);
  assert.equal(new Set(registry.statesAndTerritory.map(s => s.stateCode)).size, 37);
  assert.equal(registry.totalConstitutionalCouncils, 774);
  assert.equal(registry.stateLgasCount, 768);
  assert.equal(registry.fctAreaCouncilsCount, 6);
  assert.equal(registry.codeNamespace.type, 'PROJECT_ASSIGNED');
  assert.equal(registry.codeNamespace.officialAssignedCodes, false);
  const councils = [];
  const identities = { CORROBORATED_NAME: 0, UNRESOLVED_NAME_VARIANT: 0 };
  let stateCouncils = 0, fctCouncils = 0;
  for (const state of registry.statesAndTerritory) {
    assert.equal(state.lgas.length, state.lgaCount, state.stateCode);
    assert(atlas.jurisdictions.some(a => a.code === state.stateCode));
    assert.equal(Object.keys(state.identityAudit).length, state.lgaCount);
    assert.equal(state.councilType, state.stateCode === 'FC' ? 'FCT_AREA_COUNCIL' : 'STATE_LOCAL_GOVERNMENT_AREA');
    if (state.stateCode === 'FC') fctCouncils += state.lgaCount; else stateCouncils += state.lgaCount;
    for (const [index, council] of state.lgas.entries()) {
      const [code, name, extra] = council.split(':');
      assert.equal(code, `${state.stateCode}-LGA-${String(index + 1).padStart(2, '0')}`);
      assert(name?.trim() && !extra, `${code}: missing/ambiguous council name`);
      councils.push(code);
      const audit = state.identityAudit[code];
      assert(audit && audit.nameStatus in identities, `${code}: missing identity assessment`);
      assert.equal(audit.reviewedProjectName, name, `${code}: council name changed without identity review`);
      refs(audit.candidateSourceRefs ?? [], `${code}: candidate identity sources`);
      identities[audit.nameStatus]++;
      date(audit.reviewedOn, `${code}: reviewedOn`);
      refs(audit.sourceRefs, code, audit.nameStatus === 'CORROBORATED_NAME');
      assert(audit.limitation?.trim(), `${code}: missing identity limitation`);
      assert.equal(audit.constitutionalIdentityStatus, 'NOT_YET_VALIDATED', `${code}: full constitutional identity validation requires a separate legal evidence model`);
      if (audit.nameStatus === 'CORROBORATED_NAME') assert(audit.sourceLocator?.trim(), `${code}: missing source locator`);
    }
  }
  assert.equal(stateCouncils, 768);
  assert.equal(fctCouncils, 6);
  assert.equal(councils.length, 774);
  assert.equal(new Set(councils).size, 774);
  assert.equal(modules.length, 14);
  assert.equal(new Set(modules.map(m => m.moduleId)).size, 14);
  for (const module of modules) {
    assert.equal(module.claimReview.legalMappingStatus, 'REQUIRES_EXTERNAL_LEGAL_VALIDATION');
    assert.equal(module.claimReview.deploymentStatus, 'NOT_ASSESSED');
    assert.equal(module.claimReview.observedAt, null);
  }
  const unknown = new Set(['NOT_ASSESSED', 'UNKNOWN']);
  const assessed = new Set(['VERIFIED_LIVE_PORTAL', 'CORROBORATED_PILOT', 'PAPER_BOUND_GAP']);
  let assessedCells = 0, unknownCells = 0;
  for (const state of atlas.jurisdictions) {
    assert.equal(Object.keys(state.assessmentProvenance ?? {}).length, 8, `${state.code}: missing per-cell provenance`);
    for (const dimension of atlas.dimensions) {
      const label = `${state.code}:${dimension}`;
      const cell = state.assessmentProvenance[dimension];
      assert(cell && state[dimension] === cell.assessmentState, `${label}: status/provenance mismatch`);
      date(cell.reviewedOn, `${label}: reviewedOn`);
      refs(cell.sourceRefs, label, assessed.has(cell.assessmentState));
      refs(cell.candidateSourceRefs ?? [], `${label}: candidate references`);
      assert(cell.limitation?.trim(), `${label}: missing limitation`);
      if (unknown.has(cell.assessmentState)) {
        unknownCells++;
        assert.deepEqual(cell.sourceRefs, [], `${label}: unassessed discovery belongs in candidate references`);
        assert.equal(cell.observedAt, null, `${label}: unknown cells cannot claim a service observation`);
        assert.equal(cell.method, null, `${label}: unknown cells cannot claim an assessment method`);
        assert.equal(cell.serviceScope, null, `${label}: unknown cell cannot claim assessed scope`);
        assert.equal(cell.evidenceSummary, null, `${label}: put discovery evidence in candidate sources`);
      } else {
        assert(assessed.has(cell.assessmentState), `${label}: unsupported assessment status`);
        assessedCells++;
        assert.match(cell.observedAt ?? '', /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/, `${label}: missing actual UTC observation timestamp`);
        assert(Number.isFinite(Date.parse(cell.observedAt)), `${label}: invalid observation timestamp`);
        assert(cell.observedAt.slice(0, 10) <= cell.reviewedOn, `${label}: observation cannot follow its evidence review`);
        assert(cell.serviceScope?.trim() && cell.method?.trim() && cell.evidenceSummary?.trim(), `${label}: missing scope, method or evidence summary`);
        assert(cell.sourceRefs.some(id => ['PRIMARY_SERVICE_OBSERVATION', 'PRIMARY_OPERATOR_ATTESTATION', 'PRIMARY_AUDIT_REPORT'].includes(sources[id].sourceType)), `${label}: portal discovery or legal texts cannot establish readiness`);
      }
    }
    if (atlas.dimensions.every(d => unknown.has(state[d]))) {
      assert.deepEqual(state.primaryGapMechanisms, [], `${state.code}: empirical gaps lack assessment`);
      assert.equal(state.lastVerifiedUtc, null, `${state.code}: no jurisdiction readiness verification supplied`);
      assert.deepEqual(state.primaryEvidenceLinks, [], `${state.code}: candidate URLs belong to cell provenance`);
    }
  }
  for (const industry of industries) {
    assert.equal(industry.evidenceStatus, 'UNRESOLVED', `${industry.industryId}: assessed industries need an evidence model`);
    assert.equal(industry.assessmentProvenance.assessmentState, 'NOT_ASSESSED');
    assert.equal(industry.assessmentProvenance.observedAt, null);
    refs(industry.assessmentProvenance.sourceRefs, industry.industryId);
    assert.deepEqual(industry.documentedDomesticSupply, []);
    assert.deepEqual(industry.statutoryStewards, []);
    assert.deepEqual(industry.residualGapMechanisms, []);
  }
  return { structuralCounts: { industries: 32, jurisdictions: 37, stateCouncils, fctCouncils, councils: 774, modules: 14, cells: 296 }, epistemicIntegrity: 'PASS', empiricalReadinessAssessmentComplete: assessedCells === 296, assessedCells, unknownCells, councilNameAudit: identities, constitutionalCouncilIdentityValidationComplete: false };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(verifyDatasetIntegrity(process.env.NS_DATASET_ROOT || process.cwd()), null, 2));
}
