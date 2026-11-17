import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd(),suffix=process.argv[2]||'repository-exports';
if(!/^repository-exports(?:-[a-zA-Z0-9.-]+)?$/.test(suffix))throw Error('Use a scoped generated export directory');
const output=path.join(root,suffix);
const mapping={
 'protocol-specifications':[['specs/rfcs','rfcs'],['specs/openapi','openapi'],['specs/schemas','schemas'],['docs/standards','docs/standards']],
 'industry-capability-ledger':[['content/taxonomy','taxonomy'],['docs/research','research']],
 'subnational-readiness-atlas':[['content/atlas','atlas']],
 'clearam-consent-templates':[['specs/clearam-templates','templates'],['tests/conformance-itb/validation','validation']],
 'conformance-test-bed':[['tests/conformance-itb','tests/conformance-itb'],['packages/conformance-cli','packages/conformance-cli']],
 'joinbody-reference-sdks':[['packages','packages']]
};
mapping['joinbody-reference-sdks']=fs.readdirSync(path.join(root,'packages')).filter(n=>n.startsWith('joinbody-')).map(n=>[`packages/${n}`,`packages/${n}`]);
const excluded=new Set(['dist','node_modules','.git','.wrangler']);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function copy(source,dest,manifest){
 if(!fs.existsSync(source))return;
 if(fs.statSync(source).isDirectory()){for(const name of fs.readdirSync(source).sort()){if(!excluded.has(name))copy(path.join(source,name),path.join(dest,name),manifest);}return;}
 const bytes=fs.readFileSync(source);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes);manifest.push({source:path.relative(root,source),target:dest.slice(output.length+1),sha256:sha(bytes)});
}
const all=[];
for(const [repo,entries] of Object.entries(mapping)){
 const directory=path.join(output,repo);if(fs.existsSync(directory))throw Error(`Existing export ${repo}; use a new checkpoint directory or explicitly remove only generated exports.`);
 fs.mkdirSync(directory,{recursive:true});const files=[];
 for(const [source,target] of entries)copy(path.join(root,source),path.join(directory,target),files);
 copy(path.join(root,'LICENSES'),path.join(directory,'LICENSES'),files);
 copy(path.join(root,'LICENSING.md'),path.join(directory,'LICENSING.md'),files);
 const needsSDK=repo==='conformance-test-bed';
 if(needsSDK)for(const name of fs.readdirSync(path.join(root,'packages')).filter(n=>n.startsWith('joinbody-')))copy(path.join(root,'packages',name),path.join(directory,'bootstrap-reference-sdks',name),files);
 fs.writeFileSync(path.join(directory,'BOOTSTRAP.md'),`# ${repo}\n\nSource export for nigeriastack/${repo}. Remote creation and installation visibility are unverified; this is not a published repository or release.\n\n${needsSDK?'bootstrap-reference-sdks holds an explicit source snapshot for later dependency pinning; it is not an npm publication.':''}\nCanonical baseline remains the controlled nigeriastack-org workspace until remote migration is reconciled. Do not invent a remote commit or published dependency version.\n`);
 const manifest={repository:`nigeriastack/${repo}`,status:'SOURCE_EXPORT_REMOTE_PROVISIONING_BLOCKED',files};fs.writeFileSync(path.join(directory,'SOURCE-MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n');all.push({repository:manifest.repository,fileCount:files.length,status:manifest.status});
}
fs.mkdirSync(path.join(root,'control'),{recursive:true});fs.writeFileSync(path.join(root,'control/repository-export-manifest.json'),JSON.stringify({canonicalPortal:'nigeriastack/nigeriastack.org',remotesCreated:false,repositories:all},null,2)+'\n');console.log(JSON.stringify(all,null,2));
