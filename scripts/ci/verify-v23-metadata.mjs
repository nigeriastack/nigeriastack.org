import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {resolveV23Metadata} from '../../apps/web/src/metadata-v23.ts';

const root=resolve(fileURLToPath(new URL('../../',import.meta.url)));
const read=path=>JSON.parse(readFileSync(resolve(root,path),'utf8'));
const seo=read('content/canonical/reviewed-v2.1/seo-metadata.json');
const registry=read('content/atlas/lga-774-constitutional-registry.json');
const groups=read('content/taxonomy/route-groups.json').groups;
const industries=read('content/taxonomy/master-32-industry-matrix.json').industries;
const modules=read('content/atlas/lga-14-service-modules-spec.json').modules;
const slug=s=>s.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const found=[];
function add(path,p){
  const meta=resolveV23Metadata(p,path,seo);
  if(!meta.title||!meta.description||!meta.contractId)throw Error('Unbound metadata '+path);
  if(/\{\{|\}\}|TODO|TBD/i.test(meta.title+' '+meta.description))throw Error('Unresolved metadata template '+path);
  found.push({path,...meta});
}
for(const r of seo)add(r.route,{kind:r.route==='/'?'home':r.route.slice(1)});
for(const ind of industries){
  const sector=groups.find(g=>g.industryIds.includes(ind.industryId));
  if(!sector)throw Error('Missing industry sector for '+ind.industryId);
  add('/sectors/'+slug(sector.name)+'/'+ind.industryId,{kind:'sectors',item:{...ind,group:sector.name}});
}
const protocols=[
 ['sure-evidence','SureEvidence','Digital evidence','NS-RFC-005'],
 ['clearam-consent','ClearAm','Personal data consent','NS-RFC-006'],
 ['confluence-gateway','Confluence','Safe retries','NS-RFC-002'],
 ['marketlink-commerce','MarketLink','Open commerce','NS-RFC-007'],
 ['givepower-agents','GivePower','Safe AI agents','NS-RFC-008'],
 ['kioskbase-registries','KioskBase','Offline registries','NS-RFC-004'],
 ['lawtree-ast','LawTree','Multilingual digital laws','NS-RFC-013']
];
for(const [slug,name,title,rfc] of protocols)
  add('/protocols/'+slug,{kind:'protocols',item:{slug,name,title,rfc,summary:'Open specification and reference tests.'}});
add('/protocols/lga-governance-stack',{kind:'protocols',item:{slug:'lga-governance-stack',name:'Local Government Stack'}});
const moduleNames=['Grievance redress','Building permits','Rural water & WASH','Market & trade licensing','Birth & death records','Indigene & residency attestation','Safety inspections','Ward public works','Property tenement rates','Park & market revenue collection','Ward primary healthcare','Direct treasury ledger','Customary & Area Court records','Digital street addressing'];
for(const [i,m] of modules.entries())add(m.route,{kind:'protocols',module:{id:m.moduleId,name:moduleNames[i]}});
for(const f of readdirSync(resolve(root,'specs/rfcs')).filter(f=>/NS-RFC-\d+/.test(f))){
  const text=readFileSync(resolve(root,'specs/rfcs',f),'utf8');
  const name=text.split('\n')[0].replace(/^#+\s*/,'').replace(/\*\*/g,'').replace(/\\([.()_#*])/g,'').trim().replace(/^\d+\.\s*/,'');
  const id=f.match(/NS-RFC-\d+/)[0];
  add('/rfcs/'+id,{kind:'rfcs',item:{id,title:name}});
}
for(const s of registry.statesAndTerritory){
  const state={stateCode:s.stateCode,stateName:s.stateName};
  add('/atlas/states/'+s.stateCode,{kind:'atlas',view:'states',state});
  add('/atlas/lga-774/'+s.stateCode,{kind:'atlas',view:'councils',state});
  for(const entry of s.lgas){const [code,name]=entry.split(':');add('/atlas/lga-774/'+s.stateCode+'/'+code,{kind:'atlas',view:'councils',state,lga:{code,name}});}
}
for(const g of groups)add('/sectors/'+slug(g.name),{kind:'sectors',sector:g.name});
add('/atlas/states',{kind:'atlas',view:'states'});
add('/atlas/lga-774',{kind:'atlas',view:'councils'});
add('/search',{kind:'search'});
assert.equal(found.length,934,'934 SSR metadata contracts');
for(const key of ['path','title','description']){
  const dups=found.map(x=>x[key]).filter((x,i,a)=>a.indexOf(x)!==i);
  assert.deepEqual(dups,[],'duplicate '+key);
}
const totals={total:found.length,root:seo.length,industries:industries.length,protocols:protocols.length,modules:modules.length,rfcs:readdirSync(resolve(root,'specs/rfcs')).filter(f=>/NS-RFC-\d+/.test(f)).length,jurisdictions:registry.statesAndTerritory.length,councils:registry.statesAndTerritory.reduce((n,s)=>n+s.lgas.length,0),intermediate:groups.length+2+registry.statesAndTerritory.length,search:1};
console.log(JSON.stringify(totals,null,2));
