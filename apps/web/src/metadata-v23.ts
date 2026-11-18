/**
 * Explicit route-family SEO metadata. No generic title/description fallback.
 * Source: v2.3 owner-researched root copy, 32-industry ledger, 14 RFCs, 37 jurisdictions
 * and the 774 council registry. Describes specifications, NOT verified live deployments.
 * Keep production noindex until the separately authorized release gate.
 */
type RootSeo = {route:string;title:string;metaDescription:string};
type Resolved = {title:string;description:string;contractId:string};
const shorten = (value:string, max=184) => {
  const clean = String(value||'').replace(/\s+/g,' ').trim();
  if (clean.length<=max) return clean;
  const prefix=clean.slice(0,max-1);
  return prefix.slice(0,Math.max(1,prefix.lastIndexOf(' '))).trimEnd()+'…';
};
function verified(title:string,description:string,contractId:string):Resolved {
  if (!title.trim()||!description.trim()||/\{\{|\}\}|\bTODO\b|\bTBD\b/i.test(title+' '+description))
    throw Error('V23_METADATA_UNRESOLVED:'+contractId);
  return {title,description:shorten(description),contractId};
}
export function resolveV23Metadata(p:any,path:string,seo:RootSeo[]):Resolved {
  const root=seo.find(s=>s.route===path);
  if (root) return verified(root.title,root.metaDescription,'V23_RESEARCHED_ROOT:'+path);
  if (path==='/search')
    return verified('Search Open Specifications & Public Registers | NigeriaStack','Search NigeriaStack open specifications, industry profiles, state and council registry entries, and source-linked standards resources.','V23_SEARCH_UTILITY');
  if (p.kind==='sectors'&&p.item) {
    const a=p.item;
    return verified(`${a.name} Interoperability Standards | NigeriaStack`,
      `Explore ${a.name} in ${a.group}: documented cross-provider problem, specification approach and evidence still required for operational deployment.`,
      'V23_INDUSTRY:'+a.industryId);
  }
  if (p.kind==='sectors'&&p.sector)
    return verified(`${p.sector} Industry Profiles | NigeriaStack`,
      `Explore ${p.sector} industry records within NigeriaStack's 32-industry interoperability ledger. Compare the specified interfaces, source authorities and evidence limits.`,
      'V23_SECTOR_INDEX:'+p.sector);
  if (p.kind==='protocols'&&p.module)
    return verified(`${p.module.name} Municipal Standard | NigeriaStack`,
      `Inspect the ${p.module.name} municipal module's Fourth Schedule mandate, open interface and evidence boundaries. A specification does not establish a deployed local service.`,
      'V23_MUNICIPAL_MODULE:'+p.module.id);
  if (path==='/protocols/lga-governance-stack')
    return verified('Local Government Interoperability Standards | NigeriaStack',
      'Explore fourteen municipal service interoperability modules, their source authority, offline requirements, treasury boundaries and conformance references.','V23_MUNICIPAL_SUITE');
  if (p.kind==='protocols'&&p.item)
    return verified(`${p.item.name} Specification & Conformance | NigeriaStack`,
      `Understand ${p.item.name} (${p.item.title}): ${p.item.summary} Read ${p.item.rfc} and related conformance requirements.`,
      'V23_PROTOCOL:'+p.item.slug);
  if (p.kind==='rfcs'&&p.item)
    return verified(`${p.item.id} — ${p.item.title} | NigeriaStack`,
      `Read ${p.item.id}: ${p.item.title}. Inspect normative requirements, available schemas, version and reference-test scope independently from regulatory approval.`,
      'V23_RFC:'+p.item.id);
  if (p.kind==='atlas'&&p.lga&&p.state) {
    return verified(`${p.lga.name} — ${p.state.stateName} Council Profile | NigeriaStack`,
      `Inspect the ${p.lga.name} council registry entry in ${p.state.stateName}: name provenance, municipal interface specifications and unassessed operational service evidence.`,
      'V23_COUNCIL:'+p.lga.code);
  }
  if (p.kind==='atlas'&&p.state&&p.view==='councils')
    return verified(`${p.state.stateName} Local Council Directory | NigeriaStack`,
      `Browse ${p.state.stateName} local government or area council entries, name-validation status and source-linked municipal service specifications. Readiness is not assessed.`,
      'V23_COUNCIL_INDEX:'+p.state.stateCode);
  if (p.kind==='atlas'&&p.state&&p.view==='states')
    return verified(`${p.state.stateName} Service Readiness Atlas | NigeriaStack`,
      `Inspect ${p.state.stateName}'s eight public-service assessment dimensions and evidence-provenance records. All current readiness cells are explicitly unassessed.`,
      'V23_JURISDICTION:'+p.state.stateCode);
  if (path==='/atlas/states')
    return verified('36 States & FCT Service Readiness Directory | NigeriaStack',
      'Browse the 36 state and FCT public-service evidence register: eight assessment dimensions per jurisdiction, provenance requirements and current unknown readiness.','V23_STATE_INDEX');
  if (path==='/atlas/lga-774')
    return verified('774 Councils & Area Councils Directory | NigeriaStack',
      'Browse NigeriaStack municipality records for 768 state local government areas and six FCT area councils, with documented source-name uncertainty and no invented deployment status.','V23_NATIONAL_COUNCIL_INDEX');
  throw Error('V23_METADATA_MISSING_CONTRACT:'+path);
}
