import test from 'node:test';
import assert from 'node:assert/strict';
import { loadContent, verifyContent } from '../../scripts/ci/verify-content-counts.mjs';

const baseline = loadContent();
test('complete reviewed source contract passes', () => assert.equal(verifyContent(baseline).potentialInventory,886));
const failures = [
  ['duplicate FAQ identity', d => { d.faq[1].id=d.faq[0].id; }, /15 distinct reviewed FAQs/],
  ['candidate silently replaces governed H1', d => { d.bindings.h1Bindings[0].approvedText=d.seo[0].h1; }, /Expected values to be strictly equal/],
  ['canonical RAG heading demoted or lost', d => { d.bindings.ragBindings[5].h2='Replacement question'; }, /Expected values to be strictly equal/],
  ['RAG route silently reassigned', d => { d.bindings.ragBindings[5].route='/protocols'; }, /Expected values to be strictly equal/],
  ['answer copied onto wrong route', d => { d.answers[0].route='/rfcs'; }, /answer heading\/route mismatch/],
  ['heading jumps from H2 to H4', d => { d.manifest.rootRoutes[0].headingTree.children[0].children[0].level=4; }, /heading level skipped/],
  ['H4 subtree removed despite declared binding', d => { d.manifest.families[0].headingTree.children[0].children[0].children=[]; }, /H4 binding mismatch/],
  ['descendant family omitted', d => { d.manifest.families.pop(); }, /Seven descendant families/],
  ['planned inventory presented as live URLs', d => { d.bindings.potentialInventory.meaning='LIVE_URLS'; }, /Expected values to be strictly equal/],
  ['institution downgraded because tests pending', d => { d.bindings.institutionalStatus='PROPOSAL'; }, /Institutional status/],
  ['blank answer carrying stale word count', d => { d.answers[0].leadAnswer=''; }, /stale word count/],
  ['overlong answer despite valid recalculated count', d => { d.answers[0].leadAnswer=Array(65).fill('word').join(' '); d.answers[0].wordCount=65; }, /under 65 words/],
  ['FAQ promoted above parent', d => { d.bindings.faqDecision.headingLevel=2; }, /Expected values to be strictly equal/],
  ['unknown merged answer alias', d => { d.bindings.answerCrosswalk[0].relatedRagIds=['RAG-H2-99']; }, /unknown RAG alias/],
  ['failed local scenario presented as complete', d => { d.receipt.scenarios[4].status='NOT_RUN'; }, /evaluated to a falsy value/],
  ['deployment entity slipped into baseline JSON-LD', d => { d.jsonld['@graph'].push({'@type':'WebAPI'}); }, /Baseline entity types/],
];
for (const [name, mutate, error] of failures) test(`rejects ${name}`, () => {
  const fixture=structuredClone(baseline); mutate(fixture); assert.throws(() => verifyContent(fixture),error);
});
