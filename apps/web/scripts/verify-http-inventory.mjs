import fs from 'node:fs';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
import handler from '../dist/server/server.js';
const root=path.resolve('../..');
const httpBase=process.env.NS_HTTP_BASE_URL;
const transport=httpBase?'HTTP_NETWORK':'IN_PROCESS_FETCH';
const requestPage=route=>httpBase?fetch(new URL(route,httpBase)):handler.fetch(new Request('https://nigeriastack.org'+route));
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const industries=read('content/taxonomy/master-32-industry-matrix.json').industries;
const councils=read('content/atlas/lga-774-constitutional-registry.json').statesAndTerritory;
const modules=read('content/atlas/lga-14-service-modules-spec.json').modules;
const slug=s=>s.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const routeGroups=read('content/taxonomy/route-groups.json');
const groups=routeGroups.groups.map(g=>g.name);
const assignments=routeGroups.groups.map(g=>g.industryIds.map(id=>Number(id.slice(4))));
const records=[];
const add=(pathname,family)=>records.push({pathname,family});
for(const route of ['/','/sectors','/protocols','/rfcs','/conformance','/atlas','/governance'])add(route,'root');
for(const i of industries)add(`/sectors/${slug(groups[assignments.findIndex(a=>a.includes(Number(i.industryId.slice(4))))])}/${i.industryId}`,'industry');
for(const p of ['sure-evidence','clearam-consent','confluence-gateway','marketlink-commerce','givepower-agents','kioskbase-registries','lawtree-ast'])add('/protocols/'+p,'protocol');
add('/protocols/lga-governance-stack','municipal-suite');
for(const m of modules)add(m.route,'municipal-module');
for(const f of fs.readdirSync(path.join(root,'specs/rfcs')))add('/rfcs/'+f.match(/NS-RFC-\d+/)[0],'rfc');
for(const s of councils){add('/atlas/states/'+s.stateCode,'state');for(const lga of s.lgas)add(`/atlas/lga-774/${s.stateCode}/${lga.split(':')[0]}`,'council');}
if(records.length!==886)throw Error(`Source inventory ${records.length} != 886`);
for(const g of groups)add('/sectors/'+slug(g),'intermediate-sector');
for(const route of ['/atlas/states','/atlas/lga-774'])add(route,'intermediate-atlas');
for(const s of councils)add('/atlas/lga-774/'+s.stateCode,'intermediate-councils');
add('/search','utility');
const attrs=(html,tag,name)=>[...html.matchAll(new RegExp(`<${tag}\\b[^>]*${name}="([^"]*)"`,'g'))].map(m=>m[1]);
const titles=new Set(),descriptions=new Set(),rendered=[];
const assetSizes=new Map();
for(const r of records){
 const response=await requestPage(r.pathname);
 if(response.status!==200)throw Error(`${r.pathname} status ${response.status}`);
 const html=await response.text(), headings=[...html.matchAll(/<h([1-4])\b[^>]*>([\s\S]*?)<\/h\1>/g)];
 if(headings.filter(h=>h[1]==='1').length!==1)throw Error(`${r.pathname} H1 count`);
 const headingTree=[];let previous=0;for(const h of headings){const level=Number(h[1]);if(level>previous+1)throw Error(`${r.pathname} skipped heading ${previous}->${level}`);previous=level;const id=h[0].match(/\bid="([^"]+)"/)?.[1];if(!id)throw Error(`${r.pathname} heading has no stable ID: ${h[0]}`);headingTree.push({level,id,text:h[2].replace(/<[^>]*>/g,''),sourceDocument:'NS-KB-12 / bound source record'});}
 const ids=attrs(html,'[a-z][a-z0-9]*','id');if(new Set(ids).size!==ids.length||ids.includes(''))throw Error(`${r.pathname} duplicate or empty IDs`);
 const title=html.match(/<title>(.*?)<\/title>/s)?.[1],description=html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/)?.[1];
 if(!title||titles.has(title))throw Error(`${r.pathname} empty/duplicate title ${title}`);titles.add(title);
 if(!description||descriptions.has(description))throw Error(`${r.pathname} empty/duplicate description`);descriptions.add(description);
 if(!html.includes(`rel="canonical" href="https://nigeriastack.org${r.pathname}"`))throw Error(`${r.pathname} canonical`);
 if(!html.includes('name="robots" content="noindex, follow"'))throw Error(`${r.pathname} release hold missing`);
 const breadcrumb=html.match(/<nav aria-label="Breadcrumb">([\s\S]*?)<\/nav>/)?.[1];if(!breadcrumb)throw Error(`${r.pathname} breadcrumb missing`);
 for(const href of attrs(breadcrumb,'a','href'))if(!records.some(row=>row.pathname===href))throw Error(`${r.pathname} breadcrumb unresolved ${href}`);
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]||'{}');
 const allowed=['Organization','WebSite','BreadcrumbList','FAQPage'];if(!graph['@graph']?.every(n=>allowed.includes(n['@type'])))throw Error(`${r.pathname} ungrounded graph`);
 if(r.pathname==='/governance'){const faq=graph['@graph'].find(n=>n['@type']==='FAQPage');if(faq?.mainEntity.length!==15)throw Error('FAQ count');for(const q of faq.mainEntity){const escape=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');if(!html.includes(escape(q.name))||!html.includes(escape(q.acceptedAnswer.text)))throw Error('FAQ differs from rendered copy');}}
 let criticalGzipBytes=gzipSync(html).length;
 for(const asset of new Set([...html.matchAll(/(?:src|href)="([^"?#]+\.(?:css|js))"/g)].map(m=>m[1]))){if(!assetSizes.has(asset))assetSizes.set(asset,gzipSync(fs.readFileSync(path.join('dist/client',asset))).length);criticalGzipBytes+=assetSizes.get(asset);}
 if(criticalGzipBytes>35840)throw Error(`${r.pathname} ${criticalGzipBytes} > 35840 gzip`);
 rendered.push({...r,status:response.status,title,description,h1Count:1,headingCount:headings.length,headingTree,canonical:`https://nigeriastack.org${r.pathname}`,indexStatus:'HELD_PENDING_RELEASE_EVIDENCE',criticalGzipBytes});
}
const unknown=['/sectors/not-a-sector/IND-01','/sectors/finance-revenue-and-fiscal-systems/IND-99','/protocols/sure-evidence/unknown','/protocols/no-such-protocol','/protocols/lga-governance-stack/unknown','/rfcs/NS-RFC-999','/rfcs/NS-RFC-001/unknown','/atlas/states/ZZ','/atlas/states/AB/AB-LGA-01','/atlas/lga-774/AB/no-such-council','/atlas/lga-774/AB/AB-LGA-01/extra','/not-found'];
for(const route of unknown){const response=await requestPage(route);if(response.status!==404)throw Error(`${route} expected 404, received ${response.status}`);}
const sitemap=httpBase?await (await fetch(new URL('/sitemap.xml',httpBase))).text():fs.readFileSync('dist/client/sitemap.xml','utf8');if(/<loc>/.test(sitemap))throw Error('Release-held sitemap advertises a public URL');
fs.mkdirSync('dist/reports',{recursive:true});
fs.writeFileSync('dist/reports/route-inventory.json',JSON.stringify({transport,sourceRecordPotential:886,intermediateCount:47,utilityCount:1,totalRendered:rendered.length,liveDeployedVerified:0,indexablePublicURLs:[],releaseHold:true,unknown404:unknown,maximumCriticalGzipBytes:Math.max(...rendered.map(r=>r.criticalGzipBytes)),routes:rendered},null,2));
console.log(`Verified ${rendered.length} actual compiled SSR responses: 886 source-record potential + 47 intermediate + 1 search utility. ${unknown.length} unknown paths returned 404. Maximum critical gzip ${Math.max(...rendered.map(r=>r.criticalGzipBytes))}/35840 bytes. ${transport}; no live deployment claim.`);
