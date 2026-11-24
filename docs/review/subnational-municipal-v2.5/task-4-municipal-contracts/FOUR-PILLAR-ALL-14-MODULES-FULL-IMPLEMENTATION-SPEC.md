# Four-Pillar State and Municipal Application, Portal, PWA, USSD and API Specifications (Task 4)

## Open interoperable deployment envelope

### Independent issuers and technical service providers

#### No national government super-app

NigeriaStack publishes standards, schemas, conformance fixtures and a portable reference PWA. A lawful State/LGA/FCT institution or an expressly authorized technical service provider may host a conforming domain. NigeriaStack is never the payment switch, government resident master, Court case authority or official registry operator.

The reference runs on Cloudflare Workers + D1 for public status/search metadata with independent authority-owned source registries. Cloudflare is one implementation option and not a required vendor. The W3C DTCG baseline tokens are Sovereign Parchment #F8FAF8, Federal Green #008751 and Archival Ink #0D1512.

### Shared data contracts and API behavior

#### Versioned contracts; never redefine canonical identifiers silently

OpenAPI 3.1.1 with JSON Schema 2020-12 defines the 20 API path templates. This review version preserves `cop_` operation identifiers and `kbd_` offline delta identifiers from the core repository; the attached v2.4 used a conflicting `kbd_` envelopeId. A versioned adapter, not an unannounced breaking change, is required.

The FCT uses six `FC-AC-01..06` area-council identities, unlike the 768 State LGA codes. Validate against an authoritative 774-entry registry, not merely an identifier regex.

### Shared state and privacy rules

#### No offline official decision

All provisional client submissions can be encrypted and queued offline; legal, fiscal, clinical and judicial finality require a competent issuer and server-side transaction checks. `UNKNOWN_TIMEOUT` must remain unresolved without issuing a paid receipt. Rejected/reversed outcomes and appeal/review paths are first-class states. Restricted health, vital/family and court matter data are excluded from public sync and D1 FTS5.

## Pillar A — Direct Council Treasury Routing

### Domain architecture

#### Cross-institutional trust boundary

Direct account binding, authority-approved tariff/fee schedules, independent bank settlement confirmation and daily signed public aggregate roots. Statutory principal cannot be held by platform or state intermediary. A daily Merkle root alone is not bank reconciliation.

### LGA-09 TenementRate — complete service profile

#### Scope, actors and lawful issuer

**Service scope:** Rate assessment with published legal basis and direct council settlement. **Main actors:** Owner/occupier, valuer, revenue officer, council treasury. **Authority of record:** Legal rate-assessing council/authority.

#### Application, portal and assisted user journey

**Citizen portal:** View valuation basis, appeal, settle into verified treasury. **Proposed USSD/counter behavior:** Assessment inquiry, appeal, payment intent, receipt lookup.

#### Required data contract and object ownership

**Required payload keys:** `parcelReference`, `legalRateCode`, `valuationBasis`. **Additional candidate keys:** `parcelReference`, `legalRateCode`, `valuationBasis`, `objectionRef`, `beneficiaryAccountRef`.

**Module-scoped API:** `/v1/municipal/{councilCode}/services/LGA-09`. POST application, GET scoped case, POST staged observation/delta, POST authorized decision and permitted GET public verification. Module-specific JSON Schema: `schemas/modules/LGA-09.schema.json`.

#### Offline HLC state machine and reconciliation

ASSESSED → OBJECTED → ADJUDICATED → PAYMENT_PENDING → UNKNOWN_TIMEOUT → SETTLED_DIRECT → RECEIPT_SEALED.

Offline records are staged with HLC and operator attribution; the source authority resolves noncommutative conflicts. An officer cannot bypass trusted time, payment reconciliation or privacy rules by replaying a local CRDT event.

#### Statutory, financial and evidence rejection rules

No offline paid receipt and no title adjudication from geocode. No title creation from grid; no final receipt on uncertain transfer.

**Failure paths:** wrong issuer/tenant → 403; invalid schema → 422; duplicate unresolved operation → 409; restricted public export → 403; clock drift >300s → staged review; unpublished/unauthorized tariff → block payment; signed proof with stale revocation → report stale, not current-valid.

**Trust building blocks:** BB-02, BB-05, BB-06, BB-10. **Gap mechanisms:** MECH-02, MECH-05, MECH-07. **Operational status:** Not yet assessed.

### LGA-10 MarketCollect — complete service profile

#### Scope, actors and lawful issuer

**Service scope:** Public market or motor-park fee where local law permits. **Main actors:** Trader/driver, market official, council treasury, checker. **Authority of record:** Authorized market or motor park collecting authority.

#### Application, portal and assisted user journey

**Citizen portal:** Quote, pay directly, download signed token. **Proposed USSD/counter behavior:** Charge inspection and verified ticket lookup.

#### Required data contract and object ownership

**Required payload keys:** `marketOrParkRef`, `chargeCode`, `paymentIntentRef`. **Additional candidate keys:** `marketOrParkRef`, `chargeCode`, `permittedRouteRef`, `paymentIntentRef`, `confirmedSettlementRef`.

**Module-scoped API:** `/v1/municipal/{councilCode}/services/LGA-10`. POST application, GET scoped case, POST staged observation/delta, POST authorized decision and permitted GET public verification. Module-specific JSON Schema: `schemas/modules/LGA-10.schema.json`.

#### Offline HLC state machine and reconciliation

TICKET_REQUESTED → CHARGE_VALIDATED → PAYMENT_PENDING → UNKNOWN_TIMEOUT → SETTLED_DIRECT → PASS_SEALED.

Offline records are staged with HLC and operator attribution; the source authority resolves noncommutative conflicts. An officer cannot bypass trusted time, payment reconciliation or privacy rules by replaying a local CRDT event.

#### Statutory, financial and evidence rejection rules

Cross-council pass acceptance requires express reciprocal legal agreement. No final paid ticket before verified settlement; corridor reciprocity requires agreement.

**Failure paths:** wrong issuer/tenant → 403; invalid schema → 422; duplicate unresolved operation → 409; restricted public export → 403; clock drift >300s → staged review; unpublished/unauthorized tariff → block payment; signed proof with stale revocation → report stale, not current-valid.

**Trust building blocks:** BB-02, BB-05, BB-06. **Gap mechanisms:** MECH-05, MECH-06, MECH-07. **Operational status:** Not yet assessed.

### LGA-12 CouncilLedger — complete service profile

#### Scope, actors and lawful issuer

**Service scope:** Independent treasury records and privacy-safe public reconciliation. **Main actors:** Council treasury, auditor, external bank, citizen monitor. **Authority of record:** Auditor/treasurer with independently verified bank data.

#### Application, portal and assisted user journey

**Citizen portal:** Audit dashboard, aggregate download, dispute mismatch. **Proposed USSD/counter behavior:** View only broad public aggregates, not account details.

#### Required data contract and object ownership

**Required payload keys:** `bankSettlementRef`, `cashflowClass`, `reconciliationPeriod`. **Additional candidate keys:** `bankSettlementRef`, `faacAllocationRef`, `cashflowClass`, `dailyMerkleRoot`, `reconciliationException`.

**Module-scoped API:** `/v1/municipal/{councilCode}/services/LGA-12`. POST application, GET scoped case, POST staged observation/delta, POST authorized decision and permitted GET public verification. Module-specific JSON Schema: `schemas/modules/LGA-12.schema.json`.

#### Offline HLC state machine and reconciliation

DATA_RECEIVED → INDEPENDENT_BANK_MATCH → EXCEPTION_REVIEW → APPROVED_AGGREGATE → PUBLISHED.

Offline records are staged with HLC and operator attribution; the source authority resolves noncommutative conflicts. An officer cannot bypass trusted time, payment reconciliation or privacy rules by replaying a local CRDT event.

#### Statutory, financial and evidence rejection rules

Merkle root does not by itself prove bank settlement or zero escrow. Merkle root cannot prove money moved absent independent bank verification.

**Failure paths:** wrong issuer/tenant → 403; invalid schema → 422; duplicate unresolved operation → 409; restricted public export → 403; clock drift >300s → staged review; unpublished/unauthorized tariff → block payment; signed proof with stale revocation → report stale, not current-valid.

**Trust building blocks:** BB-03, BB-05, BB-06. **Gap mechanisms:** MECH-03, MECH-05. **Operational status:** Not yet assessed.

## Pillar B — Local Business, Land and Commercial Permitting

### Domain architecture

#### Cross-institutional trust boundary

Authorities must resolve planning, licensing, safety inspection, procurement and appeal powers individually. Spatial or photographic evidence informs a competent officer; it is not an automated permit or title decision.

### LGA-02 BuildClear — complete service profile

#### Scope, actors and lawful issuer

**Service scope:** Local building/planning application where legally competent. **Main actors:** Owner, planner, state planning authority, council inspector. **Authority of record:** Authorized state/FCT town planning authority or lawfully delegated council.

#### Application, portal and assisted user journey

**Citizen portal:** Apply, track plan review, request inspection. **Proposed USSD/counter behavior:** Check application reference only.

#### Required data contract and object ownership

**Required payload keys:** `parcelRef`, `permitType`, `setbackPlanRef`. **Additional candidate keys:** `parcelRef`, `setbackPlanRef`, `permitType`, `landAuthorityResponseRef`, `inspectionDigest`.

**Module-scoped API:** `/v1/municipal/{councilCode}/services/LGA-02`. POST application, GET scoped case, POST staged observation/delta, POST authorized decision and permitted GET public verification. Module-specific JSON Schema: `schemas/modules/LGA-02.schema.json`.

#### Offline HLC state machine and reconciliation

DRAFT → LODGED → LAND_QUERY_PENDING → INSPECTION_PENDING → DECISION_AWAITING_AUTHORITY → APPROVED → REJECTED → REVOKED.

Offline records are staged with HLC and operator attribution; the source authority resolves noncommutative conflicts. An officer cannot bypass trusted time, payment reconciliation or privacy rules by replaying a local CRDT event.

#### Statutory, financial and evidence rejection rules

Parcel match and caveat merely alert; human planning judgment required. No permit until competent authority signs; grid cannot prove title.

**Failure paths:** wrong issuer/tenant → 403; invalid schema → 422; duplicate unresolved operation → 409; restricted public export → 403; clock drift >300s → staged review; unpublished/unauthorized tariff → block payment; signed proof with stale revocation → report stale, not current-valid.

**Trust building blocks:** BB-02, BB-05, BB-10. **Gap mechanisms:** MECH-03, MECH-05. **Operational status:** Not yet assessed.

### LGA-04 ShopPermit — complete service profile

#### Scope, actors and lawful issuer

**Service scope:** Stall/shop and trading premises licensing as enabled by law. **Main actors:** Trader, authorized licensing official, treasury officer. **Authority of record:** Authorized local licensing council or state regulator.

#### Application, portal and assisted user journey

**Citizen portal:** Assess, pay directly, download status and verified permit. **Proposed USSD/counter behavior:** Request, check assessment, verify public license.

#### Required data contract and object ownership

**Required payload keys:** `premisesRef`, `licenceType`, `rateCode`. **Additional candidate keys:** `premisesRef`, `licenceType`, `tradeCategory`, `rateCode`, `tradingPermitExpiry`.

**Module-scoped API:** `/v1/municipal/{councilCode}/services/LGA-04`. POST application, GET scoped case, POST staged observation/delta, POST authorized decision and permitted GET public verification. Module-specific JSON Schema: `schemas/modules/LGA-04.schema.json`.

#### Offline HLC state machine and reconciliation

APPLICATION_RECEIVED → CHARGE_PUBLISHED → INSPECTION_IF_REQUIRED → PAID_CONFIRMED → ISSUED → SUSPENDED → EXPIRED.

Offline records are staged with HLC and operator attribution; the source authority resolves noncommutative conflicts. An officer cannot bypass trusted time, payment reconciliation or privacy rules by replaying a local CRDT event.

#### Statutory, financial and evidence rejection rules

No overlapping state licence impersonation; fee authority is recorded. Reject invented taxes, unauthorized issuance and third-party escrow.

**Failure paths:** wrong issuer/tenant → 403; invalid schema → 422; duplicate unresolved operation → 409; restricted public export → 403; clock drift >300s → staged review; unpublished/unauthorized tariff → block payment; signed proof with stale revocation → report stale, not current-valid.

**Trust building blocks:** BB-02, BB-05, BB-06. **Gap mechanisms:** MECH-05, MECH-07. **Operational status:** Not yet assessed.

### LGA-07 SafetyNOC — complete service profile

#### Scope, actors and lawful issuer

**Service scope:** Environmental and fire clearance only within issuer mandate. **Main actors:** Operator, inspector, public-health/fire authority. **Authority of record:** Competent environment, fire, health or safety regulator.

#### Application, portal and assisted user journey

**Citizen portal:** Request inspection, review findings, show valid clearance. **Proposed USSD/counter behavior:** Safe status and expiry only.

#### Required data contract and object ownership

**Required payload keys:** `facilityRef`, `inspectionKind`, `inspectionRequestRef`. **Additional candidate keys:** `facilityRef`, `inspectionKind`, `testResultRef`, `deficiencyNotices`, `certificateExpiry`.

**Module-scoped API:** `/v1/municipal/{councilCode}/services/LGA-07`. POST application, GET scoped case, POST staged observation/delta, POST authorized decision and permitted GET public verification. Module-specific JSON Schema: `schemas/modules/LGA-07.schema.json`.

#### Offline HLC state machine and reconciliation

INSPECTION_REQUESTED → ASSIGNED → INSPECTED → DEFICIENCY_NOTICE → DECISION_REVIEW → ISSUED → EXPIRED.

Offline records are staged with HLC and operator attribution; the source authority resolves noncommutative conflicts. An officer cannot bypass trusted time, payment reconciliation or privacy rules by replaying a local CRDT event.

#### Statutory, financial and evidence rejection rules

No automatic clearance from image upload; who can certify defined in authority map. No automatic NOC from unsigned photos; fire authority boundaries.

**Failure paths:** wrong issuer/tenant → 403; invalid schema → 422; duplicate unresolved operation → 409; restricted public export → 403; clock drift >300s → staged review; unpublished/unauthorized tariff → block payment; signed proof with stale revocation → report stale, not current-valid.

**Trust building blocks:** BB-02, BB-05. **Gap mechanisms:** MECH-05. **Operational status:** Not yet assessed.

### LGA-08 WardWorks — complete service profile

#### Scope, actors and lawful issuer

**Service scope:** Public works inspection against open procurement milestones. **Main actors:** Project officer, independent auditor, citizen observer. **Authority of record:** Procuring authority and independent auditor.

#### Application, portal and assisted user journey

**Citizen portal:** Browse awards, upload inspection, review corrective action. **Proposed USSD/counter behavior:** Public high-level milestone status.

#### Required data contract and object ownership

**Required payload keys:** `ocdsId`, `wardRef`, `milestoneRef`. **Additional candidate keys:** `ocdsId`, `wardRef`, `milestoneRef`, `contractVariationRef`, `proofDigest`.

**Module-scoped API:** `/v1/municipal/{councilCode}/services/LGA-08`. POST application, GET scoped case, POST staged observation/delta, POST authorized decision and permitted GET public verification. Module-specific JSON Schema: `schemas/modules/LGA-08.schema.json`.

#### Offline HLC state machine and reconciliation

CONTRACT_LINKED → MILESTONE_RECORDED → EVIDENCE_REVIEW → AUDITOR_ACCEPTED → PAYOUT_AUTHORIZED → CORRECTED.

Offline records are staged with HLC and operator attribution; the source authority resolves noncommutative conflicts. An officer cannot bypass trusted time, payment reconciliation or privacy rules by replaying a local CRDT event.

#### Statutory, financial and evidence rejection rules

Open contracting records must reflect legal restrictions and independent procurement authority. Public procurement visibility separate from sensitive whistleblower data.

**Failure paths:** wrong issuer/tenant → 403; invalid schema → 422; duplicate unresolved operation → 409; restricted public export → 403; clock drift >300s → staged review; unpublished/unauthorized tariff → block payment; signed proof with stale revocation → report stale, not current-valid.

**Trust building blocks:** BB-02, BB-05, BB-06. **Gap mechanisms:** MECH-05, MECH-07. **Operational status:** Not yet assessed.

## Pillar C — Civil Registration, Indigene Attestation and Digital Addressing

### Domain architecture

#### Cross-institutional trust boundary

NPC and other lawful issuer records are not duplicated. Birth/death notices and LGA attestation intake can be assisted or offline, but formal extract and final eligibility originate from competent agency. Address grids cannot establish land rights.

### LGA-05 VitalProof — complete service profile

#### Scope, actors and lawful issuer

**Service scope:** Notification and certified-registration referral for life events. **Main actors:** Family informant, NPC/competent registrar, caseworker. **Authority of record:** NPC and authorized registrar / source-of-record.

#### Application, portal and assisted user journey

**Citizen portal:** Capture notification and request lawful certificate verification. **Proposed USSD/counter behavior:** Appointment/status with opaque number only.

#### Required data contract and object ownership

**Required payload keys:** `eventType`, `notificationRef`, `registrarAuthorityRef`. **Additional candidate keys:** `eventType`, `eventDate`, `registrarAuthorityRef`, `notificationRef`, `familyRestrictedEvidenceRef`.

**Module-scoped API:** `/v1/municipal/{councilCode}/services/LGA-05`. POST application, GET scoped case, POST staged observation/delta, POST authorized decision and permitted GET public verification. Module-specific JSON Schema: `schemas/modules/LGA-05.schema.json`.

#### Offline HLC state machine and reconciliation

NOTIFIED_OFFLINE → REGISTRY_HANDOFF → AUTHORITATIVE_REGISTRY_ACK → ISSUER_APPROVED → ATTESTED → CORRECTED.

Offline records are staged with HLC and operator attribution; the source authority resolves noncommutative conflicts. An officer cannot bypass trusted time, payment reconciliation or privacy rules by replaying a local CRDT event.

#### Statutory, financial and evidence rejection rules

Council cannot automatically issue NPC certificate; protect minor identities. Offline draft is not official NPC birth/death registration.

**Failure paths:** wrong issuer/tenant → 403; invalid schema → 422; duplicate unresolved operation → 409; restricted public export → 403; clock drift >300s → staged review; unpublished/unauthorized tariff → block payment; signed proof with stale revocation → report stale, not current-valid.

**Trust building blocks:** BB-01, BB-02, BB-05. **Gap mechanisms:** MECH-05, MECH-06. **Operational status:** Not yet assessed.

### LGA-06 IndigeneProof — complete service profile

#### Scope, actors and lawful issuer

**Service scope:** Apply for lawful origin/residency attestation, not nationality determination. **Main actors:** Applicant, ward reference, lawfully empowered officer. **Authority of record:** Lawfully empowered council attestation officer.

#### Application, portal and assisted user journey

**Citizen portal:** Apply, supplement, track, challenge result. **Proposed USSD/counter behavior:** Request opaque reference, status and safe appointment.

#### Required data contract and object ownership

**Required payload keys:** `applicantRef`, `attestationClass`, `evidenceRefs`. **Additional candidate keys:** `applicantRef`, `attestationClass`, `wardVouchRef`, `evidenceRefs`, `appealRef`.

**Module-scoped API:** `/v1/municipal/{councilCode}/services/LGA-06`. POST application, GET scoped case, POST staged observation/delta, POST authorized decision and permitted GET public verification. Module-specific JSON Schema: `schemas/modules/LGA-06.schema.json`.

#### Offline HLC state machine and reconciliation

REQUESTED → WARD_REVIEW → ADDITIONAL_INFO → OFFICER_DECISION → ATTESTED → DENIED → APPEALED.

Offline records are staged with HLC and operator attribution; the source authority resolves noncommutative conflicts. An officer cannot bypass trusted time, payment reconciliation or privacy rules by replaying a local CRDT event.

#### Statutory, financial and evidence rejection rules

Non-discrimination review, defined eligibility and contestability; 72h is proposed SLO. 72h is proposed SLA not achieved metric; non-discrimination review.

**Failure paths:** wrong issuer/tenant → 403; invalid schema → 422; duplicate unresolved operation → 409; restricted public export → 403; clock drift >300s → staged review; unpublished/unauthorized tariff → block payment; signed proof with stale revocation → report stale, not current-valid.

**Trust building blocks:** BB-01, BB-02, BB-04, BB-05, BB-06. **Gap mechanisms:** MECH-02, MECH-05, MECH-07. **Operational status:** Not yet assessed.

### LGA-14 StreetGrid — complete service profile

#### Scope, actors and lawful issuer

**Service scope:** Street naming and numbering with no claim to land tenure. **Main actors:** Authorized council address officer, state GIS custodian, resident. **Authority of record:** Lawfully authorized road naming/address authority, validated State GIS owner.

#### Application, portal and assisted user journey

**Citizen portal:** Register named streets, manage address corrections, verify QR. **Proposed USSD/counter behavior:** Public address reference status only.

#### Required data contract and object ownership

**Required payload keys:** `roadGazetteRef`, `addressGridRef`, `wardRef`. **Additional candidate keys:** `roadGazetteRef`, `addressGridRef`, `wardRef`, `parcelCandidate`, `correctionNotice`.

**Module-scoped API:** `/v1/municipal/{councilCode}/services/LGA-14`. POST application, GET scoped case, POST staged observation/delta, POST authorized decision and permitted GET public verification. Module-specific JSON Schema: `schemas/modules/LGA-14.schema.json`.

#### Offline HLC state machine and reconciliation

PROVISIONAL_GRID_CAPTURE → GAZETTE_CHECK → ADDRESS_ASSIGNED → VERIFIED_OR_DISPUTED → CORRECTED.

Offline records are staged with HLC and operator attribution; the source authority resolves noncommutative conflicts. An officer cannot bypass trusted time, payment reconciliation or privacy rules by replaying a local CRDT event.

#### Statutory, financial and evidence rejection rules

Address code is not cadastral title or postal-delivery guarantee. 3x3m hash not legal land title; blur vulnerable persons locations.

**Failure paths:** wrong issuer/tenant → 403; invalid schema → 422; duplicate unresolved operation → 409; restricted public export → 403; clock drift >300s → staged review; unpublished/unauthorized tariff → block payment; signed proof with stale revocation → report stale, not current-valid.

**Trust building blocks:** BB-02, BB-05, BB-10. **Gap mechanisms:** MECH-02, MECH-06. **Operational status:** Not yet assessed.

## Pillar D — Grievance, WASH, Primary Health and Customary Justice

### Domain architecture

#### Cross-institutional trust boundary

Citizen complaints permit appeal, WASH treatments require operator and tariff authority, PHC data are clinical and protected, and court dockets remain judicially controlled. A council identifier denotes territory, not court authority.

### LGA-01 CouncilComplain — complete service profile

#### Scope, actors and lawful issuer

**Service scope:** Council infrastructure complaint intake; assigned responsible service owner. **Main actors:** Resident, ward officer, competent public works authority. **Authority of record:** Public works/council or responsible State utility.

#### Application, portal and assisted user journey

**Citizen portal:** Submit, track, add evidence, dispute premature closure. **Proposed USSD/counter behavior:** Complaint receipt on basic phone; no sensitive narrative.

#### Required data contract and object ownership

**Required payload keys:** `serviceCategory`, `wardCode`, `issueDescription`. **Additional candidate keys:** `serviceCategory`, `wardCode`, `locationRef`, `hazardSeverity`, `issueDescription`, `photoDigest`.

**Module-scoped API:** `/v1/municipal/{councilCode}/services/LGA-01`. POST application, GET scoped case, POST staged observation/delta, POST authorized decision and permitted GET public verification. Module-specific JSON Schema: `schemas/modules/LGA-01.schema.json`.

#### Offline HLC state machine and reconciliation

FILED_OFFLINE → VALIDATED → REFERRED_TO_COMPETENT_AUTHORITY → WORK_IN_PROGRESS → EVIDENCE_SUBMITTED → CITIZEN_REVIEW → CLOSED → REOPENED.

Offline records are staged with HLC and operator attribution; the source authority resolves noncommutative conflicts. An officer cannot bypass trusted time, payment reconciliation or privacy rules by replaying a local CRDT event.

#### Statutory, financial and evidence rejection rules

No citizen-forced closure, publish accountability trail without personal details. No citizen-forced closure; responsible agency verifies and provides appeal.

**Failure paths:** wrong issuer/tenant → 403; invalid schema → 422; duplicate unresolved operation → 409; restricted public export → 403; clock drift >300s → staged review; unpublished/unauthorized tariff → block payment; signed proof with stale revocation → report stale, not current-valid.

**Trust building blocks:** BB-02, BB-05. **Gap mechanisms:** MECH-02, MECH-06. **Operational status:** Not yet assessed.

### LGA-03 WashConnect — complete service profile

#### Scope, actors and lawful issuer

**Service scope:** Water/sanitation complaint and scheduled desludging. **Main actors:** Resident, sanitation contractor, treatment plant officer. **Authority of record:** Legally competent water/sanitation utility and council.

#### Application, portal and assisted user journey

**Citizen portal:** Report burst or sanitation issue, schedule service, verify completion. **Proposed USSD/counter behavior:** Service booking and receipt reference; no health data.

#### Required data contract and object ownership

**Required payload keys:** `assetId`, `workType`, `serviceLocationRef`. **Additional candidate keys:** `assetId`, `workType`, `operatorPermitRef`, `serviceChargeScheduleRef`, `deliveryProofDigest`.

**Module-scoped API:** `/v1/municipal/{councilCode}/services/LGA-03`. POST application, GET scoped case, POST staged observation/delta, POST authorized decision and permitted GET public verification. Module-specific JSON Schema: `schemas/modules/LGA-03.schema.json`.

#### Offline HLC state machine and reconciliation

REQUESTED → ASSIGNED → WORK_RECORDED → TREATMENT_CONFIRMED → CHARGE_ASSESSED → SETTLEMENT_PENDING → COMPLETE.

Offline records are staged with HLC and operator attribution; the source authority resolves noncommutative conflicts. An officer cannot bypass trusted time, payment reconciliation or privacy rules by replaying a local CRDT event.

#### Statutory, financial and evidence rejection rules

Distinguish public tariff principal from permitted private contractor compensation. No final settlement assertion until bank/plant confirmation; protect address.

**Failure paths:** wrong issuer/tenant → 403; invalid schema → 422; duplicate unresolved operation → 409; restricted public export → 403; clock drift >300s → staged review; unpublished/unauthorized tariff → block payment; signed proof with stale revocation → report stale, not current-valid.

**Trust building blocks:** BB-02, BB-05, BB-06. **Gap mechanisms:** MECH-04, MECH-06. **Operational status:** Not yet assessed.

### LGA-11 WardPHC — complete service profile

#### Scope, actors and lawful issuer

**Service scope:** Facility encounters, referrals and commodity inventory in authorized PHC. **Main actors:** Patient, nurse, facility and state PHC agency. **Authority of record:** State PHC agency or authorized PHC clinical operator.

#### Application, portal and assisted user journey

**Citizen portal:** Clinic roster, nonclinical appointments, private referrals. **Proposed USSD/counter behavior:** Public clinic directory/appointment only.

#### Required data contract and object ownership

**Required payload keys:** `careEncounterRef`, `patientPseudonym`, `clinicId`. **Additional candidate keys:** `careEncounterRef`, `patientPseudonym`, `clinicId`, `inventoryEvent`, `referralRef`.

**Module-scoped API:** `/v1/municipal/{councilCode}/services/LGA-11`. POST application, GET scoped case, POST staged observation/delta, POST authorized decision and permitted GET public verification. Module-specific JSON Schema: `schemas/modules/LGA-11.schema.json`.

#### Offline HLC state machine and reconciliation

ENCOUNTER_DRAFT → CLINIC_REVIEW → APPROVED_RECORD → STAGED_PROTECTED_SYNC → RECONCILED.

Offline records are staged with HLC and operator attribution; the source authority resolves noncommutative conflicts. An officer cannot bypass trusted time, payment reconciliation or privacy rules by replaying a local CRDT event.

#### Statutory, financial and evidence rejection rules

No diagnoses on USSD, protected FHIR transfers only, clinician authority. Sensitive data encrypted and excluded from public sync; no automated treatment decision.

**Failure paths:** wrong issuer/tenant → 403; invalid schema → 422; duplicate unresolved operation → 409; restricted public export → 403; clock drift >300s → staged review; unpublished/unauthorized tariff → block payment; signed proof with stale revocation → report stale, not current-valid.

**Trust building blocks:** BB-02, BB-04, BB-09. **Gap mechanisms:** MECH-02, MECH-06. **Operational status:** Not yet assessed.

### LGA-13 CustomaryDocket — complete service profile

#### Scope, actors and lawful issuer

**Service scope:** Competent court case intake and record transfer, geography only for LGA. **Main actors:** Court registrar, litigant, judicial supervisor. **Authority of record:** Chief Registrar/competent court of the relevant State/FCT.

#### Application, portal and assisted user journey

**Citizen portal:** Case status subject to court permissions; certified copy application. **Proposed USSD/counter behavior:** Public cause-list only if court rule permits.

#### Required data contract and object ownership

**Required payload keys:** `courtIdentifier`, `matterRef`, `privacyClassification`. **Additional candidate keys:** `courtIdentifier`, `matterRef`, `filingDate`, `privacyClassification`, `judicialDirectionRef`.

**Module-scoped API:** `/v1/municipal/{councilCode}/services/LGA-13`. POST application, GET scoped case, POST staged observation/delta, POST authorized decision and permitted GET public verification. Module-specific JSON Schema: `schemas/modules/LGA-13.schema.json`.

#### Offline HLC state machine and reconciliation

COURT_INTAKE → RESTRICTED_CLASSIFIED → REGISTRAR_REVIEW → DOCUMENT_SEALED → APPEAL_REFERRED → ARCHIVED.

Offline records are staged with HLC and operator attribution; the source authority resolves noncommutative conflicts. An officer cannot bypass trusted time, payment reconciliation or privacy rules by replaying a local CRDT event.

#### Statutory, financial and evidence rejection rules

Council geo code gives no judicial competence; family/juvenile sealed. Council has no judicial write rights; juvenile/family matters quarantined.

**Failure paths:** wrong issuer/tenant → 403; invalid schema → 422; duplicate unresolved operation → 409; restricted public export → 403; clock drift >300s → staged review; unpublished/unauthorized tariff → block payment; signed proof with stale revocation → report stale, not current-valid.

**Trust building blocks:** BB-02, BB-04, BB-05, BB-10. **Gap mechanisms:** MECH-02, MECH-05, MECH-06. **Operational status:** Not yet assessed.

## Device, channels, human review and implementation

### Low-bandwidth reference PWA

#### Download and storage budgets

Initial gzipped shell must be <35,000 bytes. Download SQLite WASM and locale packs separately and integrity-check their sizes; report both cold first-use and warmed offline startup, without implying an uninstalled PWA can start with no network. Use OPFS with an alternative encrypted local store on incompatible devices.

### USSD and five locales

#### No guaranteed short-code allocation

Requested pattern `*347*LGA#` is an unallocated interface design until NCC/operator evidence is attached. Support en-NG, ha-NG, yo-NG, ig-NG, pcm-NG as **target locales**, with translations and legal semantics reviewed before release. Use only safe reference/status menus on USSD.

### Portability and anti-capture

#### Export, exit and forking

A conformant implementation offers SQLite/JSON/JSON-LD exports appropriate to lawful disclosure, self-hosted key discovery, replacement TSP migration tests, reversible permissions and public conformance packs. No runtime operator may require that NigeriaStack itself store the official records.

### API and contracts catalog

#### Developer-ready candidate files

- `openapi/state-municipal-v2026.11.24-CANDIDATE.openapi.yaml` (20 paths, typed models, independent issuer scopes).
- `schemas/SubNationalServiceInteroperabilityEnvelope-CANDIDATE.schema.json` (operation ID, delta ID, module/pillar, HLC, privacy, settlement invariants).
- `schemas/modules/LGA-01.schema.json` through `LGA-14.schema.json` (14 module-specific input schemas).
- `OFFLINE-SYNC-AND-DEVICE-CONTRACT.md` (PWA, protected D1/FTS5 example, drift, CRDT conflict rules, verifier).
- `USSD-PAPER-LOCALES-CONTRACT.md` (operator provisioning, menu design and assisted counter).
- `../conformance/run_local_conformance.py` (local static checks; no false claims of live operation).
