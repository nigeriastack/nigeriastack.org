import { spawnSync, execFileSync } from 'node:child_process';
import fs from 'node:fs';
const dir = 'verification-output';
const testedCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
fs.mkdirSync(dir,{recursive:true});
const checks = [
 ['naming', ['node','--import','tsx','scripts/ci/verify-cleanroom-nomenclature.ts']],
 ['contracts',['node','scripts/ci/verify-spec-contracts.mjs']],
 ['data',['node','scripts/ci/verify-dataset-integrity.mjs']],
 ['content',['node','scripts/ci/verify-content-counts.mjs']],
 ['content-negative-controls',['node','--test','tests/ci/content-contracts.test.mjs']],
 ['v23-research',['node','scripts/ci/verify-v23-research.mjs']],
 ['v23-negative-controls',['node','--test','tests/ci/v23-research.test.mjs']],
 ['v23-metadata',['node','--import','tsx','scripts/ci/verify-v23-metadata.mjs']],
 ['tokens',['bash','scripts/ci/validate-tokens.sh']],
 ['edge-trust',['node','--import','tsx','--test','tests/edge/publication-trust.test.ts']],
 ['policy',[process.env.OPA_BIN??'opa','test','tests/conformance-itb/validation','-v']],
 ['sdk-build',['pnpm','--filter','@nigeriastack/*','build']],
 ['sdk-test',['pnpm','--filter','@nigeriastack/*','test']],
 ['gherkin',['node','packages/conformance-cli/dist/cli.js','certify','--bb','BB-01,BB-02,BB-03,BB-04,BB-05,BB-06,BB-07,BB-08,BB-09,BB-10,BB-11,BB-12','--out',`${dir}/conformance-receipt.json`]],
 ['portal-build',['pnpm','--filter','nigeriastack-org-portal','build']],
 ['full-route-inventory',['pnpm','--filter','nigeriastack-org-portal','exec','node','scripts/verify-http-inventory.mjs']],
 ['seed-generate',['node','scripts/generate-d1-seed.mjs']],
 ['sqlite-seed',['python3','scripts/ci/verify-seed-sqlite.py']],
];
const results=[];
for(const [name,command] of checks){
 const run=spawnSync(command[0],command.slice(1),{encoding:'utf8',maxBuffer:32*1024*1024,timeout:180000,killSignal:'SIGTERM'});
 const result={name,command,exitCode:run.status,error:run.error?.message??null};results.push(result);
 fs.writeFileSync(`${dir}/${name}.log`,(run.stdout??'')+(run.stderr??''));
 console.log(`${name}: ${run.status===0?'PASS':'FAIL'}`);
}
fs.writeFileSync(`${dir}/results.json`,JSON.stringify({testedCommit, completedAtUtc: new Date().toISOString(), scope:'source and reference implementation verification; browser and release evidence are separate',results},null,2));
process.exitCode=results.every(r=>r.exitCode===0)?0:1;
