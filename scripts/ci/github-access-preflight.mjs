// Run only in an owner-authorized CLI environment with credentials injected securely.
// This does not grant permissions or borrow the read-only connector's credentials.
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
const args=process.argv.slice(2),write=args.includes('--write-probe');
const i=args.indexOf('--repository'),repo=i<0?'nigeriastack/nigeriastack.org':args[i+1];
if(!/^nigeriastack\/[a-zA-Z0-9._-]+$/.test(repo??''))throw Error('Repository must be explicitly in NigeriaStack scope');
const result={repository:repo,accountRole:null,read:false,write:'NOT_TESTED',administration:'NOT_TESTED',checks:[]};
function api(endpoint,method='GET',payload){
 const cmd=['api','--hostname','github.com','--method',method,endpoint];
 if(payload)cmd.push('--input','-');
 const run=spawnSync('gh',cmd,{input:payload?JSON.stringify(payload):undefined,encoding:'utf8',timeout:30000});
 // Capture provider error messages without credentials or arbitrary successful body dumps.
 result.checks.push({endpoint,method,exitCode:run.status,error:run.status?String(run.stderr??'').slice(0,2000):null});
 if(run.status!==0)return null;
 return JSON.parse(run.stdout);
}
const metadata=api(`repos/${repo}`);if(metadata){result.read=true;result.accountRole=metadata.permissions??null;}
if(metadata&&write){
 const branch=api(`repos/${repo}/branches/main`);
 if(branch){const name=`access-verification-${new Date().toISOString().replace(/[^0-9]/g,'').slice(0,14)}`;
 const changed=api(`repos/${repo}/git/refs`,'POST',{ref:`refs/heads/${name}`,sha:branch.commit.sha});
 if(changed){const readback=api(`repos/${repo}/git/ref/heads/${name}`);result.write=readback?.object?.sha===branch.commit.sha?'VERIFIED':'READBACK_UNCERTAIN';result.probeBranch=name;}else result.write='DENIED';}
}
fs.mkdirSync('verification-output',{recursive:true});fs.writeFileSync('verification-output/github-access.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));if(!result.read||(write&&result.write!=='VERIFIED'))process.exitCode=1;
