import fs from 'node:fs';
const units=JSON.parse(fs.readFileSync('content/canonical/reviewed-v2.1/answer-units.json','utf8'));
if(units.length!==15)throw new Error('Expected15 governed answer units');
const questions=units.flatMap((u,i)=>[
 {kind:'direct',question:u.h2},
 {kind:'source',question:`Which authoritative sources support this NigeriaStack answer: ${u.h2}`},
 {kind:'boundary',question:`What remains unverified, outside scope or deployment-dependent when answering: ${u.h2}`},
 {kind:'navigation',question:`Which NigeriaStack page and source records should I inspect for: ${u.h2}`}
].map((q,j)=>({id:`NS-EVAL-${String(i*4+j+1).padStart(2,'0')}`,unitId:u.id,route:u.route,...q,expectedSourceIds:u.sourceIds,requiredDistinctions:['institutional identity','specification lifecycle','execution evidence'],engineRuns:{googleAI:{status:'NOT_RUN'},bingCopilot:{status:'NOT_RUN'},chatgpt:{status:'NOT_RUN'},perplexity:{status:'NOT_RUN'}}})));
fs.writeFileSync('content/evaluation/retrieval-suite-60.json',JSON.stringify({version:'2026-11-17-v2.1',scope:'Evaluation protocol; not measured external engine results',questionCount:questions.length,scoring:['retrieval','citation source correctness','factual accuracy','institutional disambiguation','unsupported deployment claims'],evidenceRequired:['engine','runTimeUtc','exactQuery','verbatimAnswerOrArtifactReference','citedUrls','reviewerAssessment'],questions},null,2)+'\n');
console.log('Prepared60 evaluation questions;0 externalengine measurements claimed');
