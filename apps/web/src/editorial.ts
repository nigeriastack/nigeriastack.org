import safeRagData from '../../../content/canonical/reviewed-v2.1/benchmark-answer-overrides.json';
import candidates from '../../../content/canonical/reviewed-v2.1/answer-units.json';
import seo from '../../../content/canonical/reviewed-v2.1/seo-metadata.json';
import baseline from '../../../content/canonical/reviewed-v2.1/jsonld-baseline.json';
import rag from '../../../content/canonical/rag-geo-aeo-15-benchmarks.json';
import { resolveV23Metadata } from './metadata-v23';
const equivalence:Record<string,string>={'NS-ANSWER-01':'RAG-H2-01','NS-ANSWER-02':'RAG-H2-02','NS-ANSWER-03':'RAG-H2-04','NS-ANSWER-04':'RAG-H2-05','NS-ANSWER-11':'RAG-H2-14','NS-ANSWER-12':'RAG-H2-14','NS-ANSWER-13':'RAG-H2-15'};
const safeRag:Record<string,string>=safeRagData;
function targetRoute(p:any,path:string){return p.kind==='atlas'?(p.state||p.lga?'': '/atlas'):p.kind==='protocols'&&p.item?`/protocols/${p.item.slug}`:p.item||p.module||p.sector?'':path;}
export function decoratePage(p:any,path:string,query:string){
 if(p.kind==='missing')return p;
 const sourceRoute=targetRoute(p,path), units=candidates.filter(a=>a.route===sourceRoute);
 const benchmarks=rag.benchmarks.filter(b=>b.boundRoute===sourceRoute);
 const answers:any[]=[];
 for(const b of benchmarks){const aliases=units.filter(a=>equivalence[a.id]===b.benchmarkId);answers.push({id:b.benchmarkId,aliases:aliases.map(a=>a.id),bodies:aliases.length?aliases.map(a=>a.leadAnswer):undefined,heading:b.h2Heading,body:aliases.length?aliases.map(a=>a.leadAnswer).join(' '):safeRag[b.benchmarkId]||b.leadAnswerUnder65Words,sources:[...new Set([...b.primarySources,...aliases.flatMap(a=>a.sourceIds)])]});}
 for(const a of units.filter(a=>!equivalence[a.id]))answers.push({id:a.id,aliases:[],heading:a.h2,body:a.leadAnswer,sources:a.sourceIds});
 const isFiltered=!!query;
 const {title,description,contractId}=resolveV23Metadata(p,path,seo);
 const crumbs=[{name:'Architecture',path:'/'}];
 if(path!=='/') {const parts=path.split('/').filter(Boolean);for(let i=1;i<=parts.length;i++){const href='/'+parts.slice(0,i).join('/');crumbs.push({name:i===parts.length?p.title:parts[i-1].replace(/-/g,' '),path:href});}}
 // Release approval is deliberately separate from local rendering. No environment flag alone attests deployment evidence.
 const canonical=`https://nigeriastack.org${path}`;
 const graph:any[]=[...baseline['@graph'],{'@type':'BreadcrumbList','@id':`${canonical}#breadcrumb`,itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.name,item:`https://nigeriastack.org${c.path}`}))}];
 if(p.kind==='governance'&&p.faqs.length===15)graph.push({'@type':'FAQPage','@id':`${canonical}#faq`,mainEntity:p.faqs.map((f:any)=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))});
 return {...p,path,answers,breadcrumbs:crumbs,metadata:{title,description,canonical,robots:'noindex, follow',language:'en-NG',localeReviewStatus:'AUTHORITATIVE_ENGLISH',indexStatus:'HELD_PENDING_RELEASE_EVIDENCE',queryVariant:isFiltered,routePattern:p.lga?'/atlas/lga-774/:state_code/:lga_code':p.state?`/atlas/${p.view==='councils'?'lga-774':'states'}/:state_code`:p.module?'/protocols/lga-governance-stack/:lga_module_slug':p.item&&p.kind==='sectors'?'/sectors/:sector_slug/:industry_id':p.item?`/${p.kind}/:${p.kind==='rfcs'?'rfc_id':'protocol_slug'}`:path,entityId:p.lga?.code||p.state?.stateCode||p.module?.id||p.item?.id||p.item?.industryId||p.item?.slug||path,sourceDocument:'NS-KB-12',datasetKey:p.kind==='atlas'?(p.lga?'lga-774-constitutional-registry':'subnational-36states-fct-atlas'):p.kind==='sectors'?'master-32-industry-matrix':p.kind==='protocols'?'NS-KB-12 / lga-14-service-modules-spec':p.kind==='rfcs'?'specs/rfcs':'reviewed-v2.1',primaryAudience:p.kind==='rfcs'||p.kind==='conformance'?'Implementers and institutional reviewers':'Citizens and institutional reviewers',navigationParent:crumbs.at(-2)?.path||null,copySlot:path==='/'?'home.hero.h1':path==='/atlas'?'atlas.states.h1':path===`/${p.kind}`?`${p.kind}.header.h1`:`ngstack.${p.kind}.${p.lga?.code||p.state?.stateCode||p.module?.id||p.item?.id||p.item?.industryId||p.item?.slug||'header'}.h1`,claimEvidenceStatus:'SOURCE_RECORD_AND_LOCAL_REFERENCE_ONLY',h1Authority:seo.some(x=>x.route===path)?'OWNER_EDITORIAL_OVERRIDE_V23':'SOURCE_RECORD',metadataContractId:contractId,answerIds:answers.flatMap(a=>[a.id,...a.aliases]),graph:{'@context':'https://schema.org','@graph':graph}}};
}
export function pageHead(p:any){if(!p?.metadata)return {meta:[{name:'robots',content:'noindex, follow'}]};const m=p.metadata;return {meta:[{title:m.title},{name:'description',content:m.description},{name:'robots',content:m.robots},{property:'og:title',content:m.title},{property:'og:description',content:m.description},{property:'og:type',content:'website'},{property:'og:url',content:m.canonical},{name:'twitter:card',content:'summary'},{name:'twitter:title',content:m.title},{name:'twitter:description',content:m.description}],links:[{rel:'canonical',href:m.canonical}]};}
