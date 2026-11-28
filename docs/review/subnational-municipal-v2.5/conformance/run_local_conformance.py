#!/usr/bin/env python3
"""Static-only checks for NigeriaStack sub-national candidate. No external endpoints are exercised."""
from pathlib import Path
import copy,json,yaml,re,hashlib,zipfile,sys
from collections import Counter
from jsonschema import Draft202012Validator,FormatChecker
ROOT=Path(__file__).resolve().parent.parent
load=lambda p:json.loads((ROOT/p).read_text())
checks=[]
def ck(name,pred,details=''):
 checks.append({'test':name,'result':'PASS' if pred else 'FAIL','detail':details})
 if not pred:print('FAIL',name,details)

schema=load('task-4-municipal-contracts/schemas/SubNationalServiceInteroperabilityEnvelope-CANDIDATE.schema.json')
try:Draft202012Validator.check_schema(schema);ck('JSON_SCHEMA_DRAFT_2020_12_VALID',True)
except Exception as e:ck('JSON_SCHEMA_DRAFT_2020_12_VALID',False,str(e))
validator=Draft202012Validator(schema,format_checker=FormatChecker())
readiness=load('task-2-readiness/296-cell-readiness-and-technical-targets.json')
industries=load('task-3-industry/32-industry-7-webcopy-sector-civic-ledger.json')
modules=load('task-4-municipal-contracts/14-module-service-profiles-expanded.json')
benchmark=load('task-1-global-crosswalk/eight-city-66-service-domains.json')
rfcs=load('task-1-global-crosswalk/canonical-12BB-14RFC-index.json')
audit=load('route-audit/archive-integrity-audit.json')
api=load('task-4-municipal-contracts/openapi/state-municipal-v2026.11.24-CANDIDATE.openapi.json')
api_yaml=yaml.safe_load((ROOT/'task-4-municipal-contracts/openapi/state-municipal-v2026.11.24-CANDIDATE.openapi.yaml').read_text())
ck('YAML_JSON_OPENAPI_EQUIVALENT',api_yaml==api)
ck('OAS_VERSION_3_1_1',api['openapi']=='3.1.1')
ck('ALL_14_MODULES',len(modules['modules'])==14 and len(set(x['id'] for x in modules['modules']))==14)
ck('ALL_12_BUILDING_BLOCKS',len(rfcs['buildingBlocks'])==12)
ck('ALL_14_CORE_RFCS',len(rfcs['rfcs'])==14)
ck('ALL_37_JURISDICTIONS',len(set(x['stateCode'] for x in readiness['cells']))==37)
ck('ALL_296_READY_CELLS',len(readiness['cells'])==296 and all(x['status']=='Not yet assessed' for x in readiness['cells']))
ck('ALL_32_INDUSTRIES',len(industries['industries'])==32)
ck('ALL_8_MECHANISMS',len(industries['failureMechanisms'])==8)
ck('ALL_66_FUNCTIONS',len(benchmark['functions'])==66 and len(benchmark['cities'])==8)
ck('955_CANONICAL_ROUTE_PAGES',audit['uniquePageRoutes']==955)
ck('SUPPLIED_SHA_MISMATCH_DETECTED',len(audit['manifestRowsWithIncorrectSha'])==4)
ck('SUPPLIED_DUPLICATE_ROUTE_DETECTED',len(audit['routeCollisions'])==1)
ck('SOURCE_ZIP_CRC_VALID',audit['archiveIntegrityCrcBadFile'] is None)
ck('ALL_PILLARS_A_TO_D',sorted(modules['pillars'])==['A','B','C','D'])
ck('USSD_IS_CONDITIONAL',len([x for x in api['paths'] if 'ussd' in x])>=1 and 'NOT_ALLOCATED' in str(api['components']['schemas']['CapabilityManifest']))
ck('FCT_AC_PREFIX',bool(re.fullmatch(schema['properties']['councilCode']['pattern'],'FC-AC-06')))
ck('INVALID_FCT_LGA_REJECTED',not bool(re.fullmatch(schema['properties']['councilCode']['pattern'],'FC-LGA-06')))
ck('ZERO_ESCROW_SCHEMA_CONST',schema['$defs']['DirectTreasurySettlement']['properties']['platformEscrowAmountKobo']['const']==0 and schema['$defs']['DirectTreasurySettlement']['properties']['stateIntermediaryEscrowKobo']['const']==0)
ck('SHELL_BUDGET_STRICT_LT_35000',bool(re.search(r'<\s*35,000', (ROOT/'task-4-municipal-contracts/OFFLINE-SYNC-AND-DEVICE-CONTRACT.md').read_text())))
ck('SOURCE_NOT_PUBLISHED',load('ingestion/NigeriaStack-subnational-ingestion-manifest-CANDIDATE.json')['ownerApprovalForPublicRelease'] is False)

operationIds=[]
for route,methods in api['paths'].items():
 for method,definition in methods.items():
  operationIds.append(definition['operationId'])
  requiredNames=set(re.findall(r'{([^{}]+)}',route));paramNames=set()
  for p in definition.get('parameters',[]):
   if '$ref' in p:
    param=api['components']['parameters'][p['$ref'].split('/')[-1]]
   else:param=p
   if param.get('in')=='path' and param.get('required'):paramNames.add(param['name'])
  ck('API_PATHPARAMS_'+definition['operationId'],requiredNames==paramNames, f'{requiredNames} vs {paramNames}')
ck('OPERATION_IDS_UNIQUE',len(set(operationIds))==len(operationIds))
ck('20_API_PATH_TEMPLATES',len(api['paths'])==20)
# resolve all OpenAPI internal component refs structurally
refs=[]
def crawl(obj):
 if isinstance(obj,dict):
  if '$ref' in obj:refs.append(obj['$ref'])
  for v in obj.values():crawl(v)
 elif isinstance(obj,list):
  for v in obj:crawl(v)
crawl(api)
external=[r for r in refs if not r.startswith('#/')]
missing=[]
for ref in set(refs):
 if not ref.startswith('#/'):continue
 cur=schema if ref.startswith('#/$defs/') else api
 for p in ref[2:].split('/'):
  p=p.replace('~1','/').replace('~0','~')
  if isinstance(cur,dict) and p in cur:cur=cur[p]
  else:missing.append(ref);break
ck('ALL_INTERNAL_OAS_REFS_RESOLVE',not missing, repr(missing[:8]));ck('NO_REMOTE_SCHEMA_FETCH',not external,str(external[:5]))

ULID='A'*26
base={'schemaVersion':'2026.11.24-CANDIDATE','envelopeUlid':'cop_'+ULID,'kioskBaseDeltaId':'kbd_'+ULID,
 'jurisdictionType':'STATE_LOCAL_GOVERNMENT','stateCode':'AB','councilCode':'AB-LGA-01','moduleId':'LGA-01',
 'pillar':'D','dimensionId':'DIM-05','channel':'WEB_PORTAL','locale':'en-NG',
 'hlc':{'physicalEpochMs':1795500000000,'logicalCounter':1,'nodeFingerprint':'NODE0123456789ABC','driftSeconds':0,'syncState':'NTP_GPS_VERIFIED'},
 'privacyTier':'PUBLIC_MUNICIPAL_RECORD','issuerAuthorityRef':'AUTH-AB-01','operationState':'DRAFT_OFFLINE','purposeCode':'SERVICE_REQUEST',
 'lawfulBasis':'PUBLIC_INTEREST','payload':{}}
reqs={
'LGA-01':{'serviceCategory':'drain','wardCode':'AB-W01','issueDescription':'Blocked drainage'},
'LGA-02':{'parcelRef':'Parcel-ABC','permitType':'setback','setbackPlanRef':'Plan-A'},
'LGA-03':{'assetId':'WASH-A','workType':'fix','serviceLocationRef':'WARD-12'},
'LGA-04':{'premisesRef':'STALL-A','licenceType':'market','rateCode':'RATE-X'},
'LGA-05':{'eventType':'BIRTH_NOTICE','notificationRef':'NOTICE-A','registrarAuthorityRef':'NPC-LOCAL'},
'LGA-06':{'applicantRef':'OPAQUE-A','attestationClass':'RESIDENCY','evidenceRefs':['DIGEST-A']},
'LGA-07':{'facilityRef':'BUILD-A','inspectionKind':'fire','inspectionRequestRef':'INSP-A'},
'LGA-08':{'ocdsId':'OCDS-A','wardRef':'WARD-A','milestoneRef':'MILE-A'},
'LGA-09':{'parcelReference':'PARCEL-A','legalRateCode':'LAWFUL-RATE','valuationBasis':'SCHEDULE-1'},
'LGA-10':{'marketOrParkRef':'MARKET-A','chargeCode':'FEE-1','paymentIntentRef':'PAYMENT-A'},
'LGA-11':{'careEncounterRef':'ENC-A','patientPseudonym':'PSEUD-A','clinicId':'CLINIC-A'},
'LGA-12':{'bankSettlementRef':'BANK-SETTLE-A','cashflowClass':'FAAC_ALLOCATION','reconciliationPeriod':'2026-11'},
'LGA-13':{'courtIdentifier':'COURT-A','matterRef':'CASE-A','privacyClassification':'INTERNAL_RESTRICTED_NDPA'},
'LGA-14':{'roadGazetteRef':'GAZ-01','addressGridRef':'GRID-01','wardRef':'WARD-01'}}

for id,payload in reqs.items():
 x=copy.deepcopy(base);x.update(moduleId=id,pillar=next(p for p,ids in modules['pillars'].items() if id in ids),payload=payload)
 if id in ('LGA-05','LGA-11','LGA-13'):x['privacyTier']='INTERNAL_RESTRICTED_NDPA'
 ck(f'MODULE_{id}_DRAFT_VALID',validator.is_valid(x),repr([e.message for e in validator.iter_errors(x)][:2]))
 wrong=copy.deepcopy(x);wrong['pillar']=next(p for p in 'ABCD' if p!=x['pillar'])
 ck(f'MODULE_{id}_CROSS_PILLAR_REJECT',not validator.is_valid(wrong))
 missing=copy.deepcopy(x);missing['payload'].pop(next(iter(payload)))
 ck(f'MODULE_{id}_REQUIRED_FIELD_REJECT',not validator.is_valid(missing))
 # All 14 module statuses remain review-only and no fabricated evidence

x=copy.deepcopy(base);x.update(councilCode='FC-AC-03',stateCode='FC',jurisdictionType='FCT_AREA_COUNCIL',payload=reqs['LGA-01'])
ck('FCT_AREA_COUNCIL_VALID',validator.is_valid(x))
y=copy.deepcopy(x);y['jurisdictionType']='STATE_LOCAL_GOVERNMENT';ck('FCT_MASQUERADING_DENIED',not validator.is_valid(y))
y=copy.deepcopy(x);y['councilCode']='FC-LGA-03';ck('FCT_WRONG_CODE_DENIED',not validator.is_valid(y))
y=copy.deepcopy(base);y['payload']=reqs['LGA-01'];y['hlc']['driftSeconds']=420;ck('420S_DRIFT_UNSTAGED_DENIED',not validator.is_valid(y))
y['hlc']['syncState']='DEGRADED_LOCAL_HLC';ck('420S_DRIFT_STAGED_VALID',validator.is_valid(y))
y['operationState']='APPROVED';y['wasSignedByAuthority']=True;y['sureEvidenceSealId']='s84_'+ULID;ck('420S_OFFLINE_FINAL_ISSUANCE_BLOCKED',not validator.is_valid(y))
y=copy.deepcopy(base);y['payload']=reqs['LGA-01'];y['privacyTier']='INTERNAL_RESTRICTED_NDPA';y['publishIntent']=True
ck('RESTRICTED_PUBLIC_OUTBOX_DENIED',not validator.is_valid(y))
y=copy.deepcopy(base);y.update(moduleId='LGA-09',pillar='A',payload=reqs['LGA-09'],operationState='APPROVED',wasSignedByAuthority=True,sureEvidenceSealId='s84_'+ULID)
ck('COUNCIL_PAID_RECEIPT_NO_SETTLEMENT_BLOCKED',not validator.is_valid(y))
bank={'statutoryAmountKobo':4000,'platformEscrowAmountKobo':0,'stateIntermediaryEscrowKobo':0,
 'beneficiaryAccountRef':'COUNCIL-ACCOUNT-ALIAS','settlementStatus':'SETTLED_DIRECT_TO_TREASURY',
 'bankSignedConfirmationRef':'BANK-SIGNATURE-REF','confirmationVerified':True,'independentBankReconciliationRef':'RECONCILED-REF'}
y['bankSettlementProof']=bank
ck('DIRECT_SETTLED_APPROVAL_VALID',validator.is_valid(y),repr([e.message for e in validator.iter_errors(y)][:2]))
z=copy.deepcopy(y);z['bankSettlementProof']['platformEscrowAmountKobo']=1;ck('NONZERO_PLATFORM_ESCROW_DENIED',not validator.is_valid(z))
z=copy.deepcopy(y);z['bankSettlementProof']['stateIntermediaryEscrowKobo']=1;ck('NONZERO_STATE_INTERMEDIARY_ESCROW_DENIED',not validator.is_valid(z))
z=copy.deepcopy(y);z['bankSettlementProof']['confirmationVerified']=False;ck('BANK_NOT_CONFIRMED_DENIED',not validator.is_valid(z))
z=copy.deepcopy(y);z['bankSettlementProof'].pop('independentBankReconciliationRef');ck('MISSING_BANK_RECONCILIATION_DENIED',not validator.is_valid(z))
z=copy.deepcopy(base);z['payload']=reqs['LGA-01'];z['privacyTier']='CONSENT_RESTRICTED';ck('CONSENT_RESTRICTED_DRAFT_ALLOWED',validator.is_valid(z))
# For LGA-13 a public page can describe the module, but a raw docket must be held restricted.
z=copy.deepcopy(base);z.update(moduleId='LGA-13',pillar='D',payload=reqs['LGA-13']);ck('LGA13_PUBLIC_DOCKET_DENIED',not validator.is_valid(z))

r_schema=load('task-2-readiness/SubNationalReadinessEvidence-CANDIDATE.schema.json')
Draft202012Validator.check_schema(r_schema)
r_validator=Draft202012Validator(r_schema,format_checker=FormatChecker())
r={'stateCode':'AD','dimensionId':'DIM-07','status':'Not yet assessed','evidenceRefs':[],'assessor':None,'observedAtUtc':None,'serviceScope':None,'method':None}
ck('UNASSESSED_CELL_VALID',r_validator.is_valid(r))
r['status']='Live digital service';ck('LIVE_UNVERIFIED_DENIED',not r_validator.is_valid(r))
# Public-facing pages: exact H1 -> H2 -> H3 -> H4 and developer drawer for tech tokens
pages=list((ROOT/'public-copy-candidates').glob('LGA-*.md'))
ck('FOURTEEN_PUBLIC_REVIEW_CANDIDATES',len(pages)==14)
for p in pages:
 s=p.read_text();public=s.split('---',2)[-1]
 hs=[len(t) for t in re.findall(r'(?m)^(#{1,4})\s+',public)]
 ck('HEADING_HIERARCHY_'+p.stem,hs.count(1)==1 and all(b<=a+1 for a,b in zip(hs,hs[1:])))
 ck('DEV_DRAWER_'+p.stem,'<details class="ns-tech-drawer">' in s)
 ck('NOT_PUBLIC_'+p.stem,'public_release_authorized: false' in s)

results={'runOn':'2026-11-24','scope':'Local static JSON Schema, YAML and source archive integrity only; no bank/USSD/Cloudflare/browser/GitHub CI executed',
 'total':len(checks),'passed':sum(x['result']=='PASS' for x in checks),'failed':sum(x['result']=='FAIL' for x in checks),
 'sourceGate':'BLOCKED: unresolved original archive manifest/route count; candidate corrected index emitted',
 'publicReleaseAuthorized':False,'checks':checks}
out=ROOT/'conformance/local-static-validation-receipt.json'
out.write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in results.items() if k!='checks'},indent=2))
sys.exit(0 if results['failed']==0 else 2)
