import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const repository = fileURLToPath(new URL('../../', import.meta.url));
const collection = 'content/canonical/reviewed-v2.1/';
const roots = ['/', '/sectors', '/protocols', '/rfcs', '/conformance', '/atlas', '/governance'];
const families = [
  ['/sectors/:sector_slug/:industry_id', 32], ['/protocols/:protocol_slug', 7],
  ['/protocols/lga-governance-stack', 1], ['/protocols/lga-governance-stack/:lga_module_slug', 14],
  ['/rfcs/:rfc_id', 14], ['/atlas/states/:state_code', 37], ['/atlas/lga-774/:state_code/:lga_code', 774],
];
const words = value => value.trim().split(/\s+/u).length;
const ids = (items, field) => items.map(item => item[field]);
const sequence = (prefix, count) => Array.from({ length: count }, (_, i) => prefix + String(i + 1).padStart(2, '0'));
const sameSet = (actual, expected, label) => assert.deepEqual([...actual].sort(), [...expected].sort(), label);

export function loadContent(root = repository) {
  const json = name => JSON.parse(readFileSync(resolve(root, name), 'utf8'));
  const bindings = json(collection + 'bindings.json');
  for (const source of bindings.sourceCopies) {
    assert.match(source.sourceSha256, /^[a-f0-9]{64}$/, 'Missing source SHA');
    const digest = createHash('sha256').update(readFileSync(resolve(root, collection, source.file))).digest('hex');
    assert.equal(digest, source.reviewedSha256, `Unreviewed change to ${source.file}`);
  }
  return { bindings, manifest: json(collection + 'full-ia-manifest.json'), faq: json(collection + 'faq.json'),
    answers: json(collection + 'answer-units.json'), seo: json(collection + 'seo-metadata.json'),
    jsonld: json(collection + 'jsonld-baseline.json'), receipt: json(collection + 'local-conformance-receipt.json'),
    rag: json('content/canonical/rag-geo-aeo-15-benchmarks.json'), legacyFaq: json('content/canonical/audited-faq-nigeriastack-15.json'),
    executive: json(collection + 'executive-tldr.json'),
    authority: readFileSync(resolve(root, 'docs/content/authority-and-precedence.md'), 'utf8') };
}

export function verifyContent(data) {
  const { bindings, manifest, faq, answers, seo, jsonld, receipt, rag, legacyFaq, executive, authority } = data;
  assert.equal(bindings.institutionalStatus, '2026.6-RATIFIED', 'Institutional status must remain independent of execution');
  assert.equal(bindings.institutionalStatusIndependentOfExecution, true);
  sameSet(ids(manifest.rootRoutes, 'route'), roots, 'Seven governed roots');
  assert.deepEqual(manifest.families.map(f => [f.routePattern, f.expectedRecords]), families, 'Seven descendant families');
  assert.equal(manifest.baseSectionCount, 7);
  assert.equal(manifest.familyRecordCount, 879);
  assert.equal(manifest.expectedPotentialDocuments, 886);
  assert.equal(bindings.potentialInventory.meaning, 'POTENTIAL_SOURCE_RECORDS_NOT_LIVE_URLS');
  assert.equal(bindings.potentialInventory.total, 886);
  assert.equal(manifest.enumeratedModulePaths.length, 14);
  assert.equal(new Set(ids(manifest.enumeratedModulePaths, 'route')).size, 14, 'Duplicate module route');
  for (const [i, item] of manifest.enumeratedModulePaths.entries())
    assert.match(item.route, new RegExp(`^/protocols/lga-governance-stack/lga-${String(i+1).padStart(2,'0')}-[a-z-]+$`));
  const manifestAnswers = [];
  for (const page of [...manifest.rootRoutes, ...manifest.families]) {
    const label = page.route ?? page.routePattern;
    const tree = page.headingTree;
    assert.equal(tree.level, 1, `${label}: intentional H1`);
    assert.equal(tree.text, page.existingH1FromNSKB12 ?? page.h1, `${label}: source H1 drift`);
    function walk(node, parentLevel) {
      assert.equal(node.level, parentLevel + 1, `${label}: heading level skipped`);
      assert.ok((node.text ?? node.textTemplate)?.trim(), `${label}: empty heading`);
      assert.ok(node.level <= 4, `${label}: invalid heading level`);
      if (node.answerId) { assert.equal(node.level, 2); manifestAnswers.push([node.answerId, label, node.text]); }
      for (const child of node.children ?? []) walk(child, node.level);
    }
    walk(tree, 0);
    assert.equal(tree.children.length, page.sections.length, `${label}: unbound H2 section`);
    for (const [i, section] of page.sections.entries()) {
      const node = tree.children[i];
      assert.equal(node.text, section.h2, `${label}: H2 mismatch`);
      assert.deepEqual(node.children.map(n => n.text), section.h3, `${label}: H3 binding mismatch`);
      for (const child of node.children) assert.deepEqual(child.children.map(n => n.text ?? n.textTemplate), section.h4, `${label}: H4 binding mismatch`);
    }
  }
  sameSet(ids(bindings.h1Bindings, 'route'), roots, 'H1 bindings');
  sameSet(ids(seo, 'route'), roots, 'SEO root bindings');
  for (const page of manifest.rootRoutes) {
    const b = bindings.h1Bindings.find(b => b.route === page.route);
    assert.equal(b.approvedText, page.existingH1FromNSKB12);
    assert.ok(authority.replace(/\\([+()])/g, '$1').includes(b.approvedText), `${page.route}: H1 absent from NS-KB-12`);
    assert.equal(b.copySlot, page.headingTree.sourceBinding);
    assert.equal(b.decision, 'RETAIN_GOVERNED_SOURCE_H1');
    const metadata = seo.find(s => s.route === page.route);
    assert.equal(metadata.h1, b.candidateText, 'SEO H1 candidate must remain distinct');
    assert.equal(metadata.canonicalCandidate, `https://nigeriastack.org${page.route}`);
    assert.ok(metadata.title && metadata.metaDescription);
  }
  sameSet(ids(answers, 'id'), sequence('NS-ANSWER-',15), '15 distinct NS-ANSWER units');
  sameSet(ids(faq, 'id'), sequence('NS-FAQ-REVIEW-',15), '15 distinct reviewed FAQs');
  sameSet(ids(legacyFaq, 'faqId'), sequence('NS-FAQ-',15), 'Preserve legacy FAQ inventory');
  sameSet(ids(rag.benchmarks, 'benchmarkId'), sequence('RAG-H2-',15), '15 canonical RAG units');
  sameSet(manifestAnswers.map(x => x[0]), sequence('NS-ANSWER-',15), 'Manifest answer identities');
  sameSet(ids(bindings.answerCrosswalk, 'answerId'), sequence('NS-ANSWER-',15), 'Crosswalk completeness');
  sameSet(ids(bindings.ragBindings, 'benchmarkId'), sequence('RAG-H2-',15), 'RAG route bindings');
  for (const a of answers) {
    const b = bindings.answerCrosswalk.find(b => b.answerId === a.id);
    assert.ok(roots.includes(a.route), `${a.id}: ungoverned route`);
    assert.deepEqual(manifestAnswers.find(x => x[0] === a.id), [a.id,a.route,a.h2], `${a.id}: answer heading/route mismatch`);
    assert.equal(b.route, a.route); assert.equal(b.h2,a.h2);
    assert.equal(a.claimStatus, 'LOCAL_COPY_REVIEW_APPROVED');
    assert.equal(a.wordCount, words(a.leadAnswer), `${a.id}: stale word count`);
    assert.ok(words(a.leadAnswer) < 65, `${a.id}: answer must be under 65 words`);
    for (const id of b.relatedRagIds) assert.ok(rag.benchmarks.some(r => r.benchmarkId === id), `${a.id}: unknown RAG alias`);
    if (b.renderWithRagId) {
      assert.ok(b.relatedRagIds.includes(b.renderWithRagId));
      assert.equal(rag.benchmarks.find(r => r.benchmarkId === b.renderWithRagId).boundRoute,a.route,'Shared sections must retain canonical route');
    }
  }
  for (const r of rag.benchmarks) {
    const b = bindings.ragBindings.find(b => b.benchmarkId === r.benchmarkId);
    assert.equal(b.route,r.boundRoute); assert.equal(b.h2,r.h2Heading);
    assert.ok(words(r.leadAnswerUnder65Words)<65, `${r.benchmarkId}: answer limit`);
    assert.ok(roots.includes(r.boundRoute) || /^\/protocols\/[a-z-]+$/.test(r.boundRoute), 'Ungoverned RAG route');
  }
  assert.equal(bindings.faqDecision.headingLevel,3);
  const faqSection = manifest.rootRoutes.find(r => r.route === '/governance').sections.find(s => s.h2 === bindings.faqDecision.parentHeading);
  assert.deepEqual(faqSection.h3, faq.map(f => f.question), 'FAQs belong under governance H2');
  for (const f of faq) {
    assert.equal(f.visibleOnRouteCandidate, '/governance'); assert.equal(f.jsonLdEligibleOnlyIfVisible,true);
    assert.equal(f.claimStatus,'LOCAL_COPY_REVIEW_APPROVED'); assert.equal(f.answerWordCount,words(f.answer));
  }
  sameSet(jsonld['@graph'].map(n => n['@type']),['Organization','WebSite'],'Baseline entity types');
  assert.equal(receipt.verificationScope,'LOCAL_REFERENCE_SDK_ONLY');
  assert.equal(receipt.allScenariosPassed,true);
  sameSet(ids(receipt.scenarios,'scenarioId'),sequence('ITB-',5));
  assert.ok(receipt.scenarios.every(s => s.status === 'PASS'));
  assert.equal(receipt.scenarios.reduce((sum,s) => sum+s.executedSteps,0),24,'Executable step receipt count');
  const { attestationSha256Digest, ...unsignedReceipt } = receipt;
  assert.equal(createHash('sha256').update(JSON.stringify(unsignedReceipt)).digest('hex'),attestationSha256Digest,'Local receipt digest');
  assert.equal(executive.wordCount, words(executive.text), 'Executive answer count');
  assert.equal(executive.claimStatus,'LOCAL_COPY_REVIEW_APPROVED');
  assert.equal(bindings.executionEvidence.productionAccreditation,false);
  return { roots: 7, families: 7, potentialInventory: 886, canonicalRag: 15, reviewedAnswers: 15, reviewedFaqs: 15, scope: 'Local source and heading contracts; no live URL or accreditation claim' };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(verifyContent(loadContent()),null,2)); }
  catch (error) { console.error(error.message); process.exitCode=1; }
}
