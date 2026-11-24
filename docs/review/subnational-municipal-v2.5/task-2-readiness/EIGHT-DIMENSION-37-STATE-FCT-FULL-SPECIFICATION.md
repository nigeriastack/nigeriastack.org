# Eight-Dimension State and FCT Service Readiness and Technical Specification (Task 2)

## Assessment policy and empirical status

### Separate application design from deployment evidence

#### Evidence-grade definitions

The source atlas has 37 jurisdiction rows × 8 dimensions = **296 cells**; all remain **Not yet assessed**. Permitted future labels are **Live digital service**, **Active pilot program**, **Paper-only registry**, and **Not yet assessed**, and require service-specific, dated, independently reviewable proof. A complete state/LGA route or constitutional registry entry is not a deployment receipt. No composite score is constructed.

**State/FCT sources:** November 17 State/FCT atlas in `nigeriastack/nigeriastack.org`, the November 23 expansion, and the November 24 v2.4 attachment. Source files are retained without replacing their evidence states.

## DIM-01 — Judiciary & Magistracy Digitization

### Competent authority and service ownership

#### Jurisdiction and records custody

No council judicial write-plane; issuance by competent court registrar. The service cannot activate without a local authority map, explicit review/appeal procedure, issuer key ownership and applicable statutory mandate.

### Application and portal blueprint

#### Citizen, officer and auditor views

**Reference application:** State Court Registry and CTC Portal.

**Portal functions:** Court-controlled search, docket status, CTC requests, restricted appeal transfer.

**Target local role controls:** {'officer': 'authority-owned signing + role/attribute authorization', 'citizen': 'least-privilege authentication or assisted access', 'auditor': 'public aggregate/read-only unless authorized'}.

### Offline PWA, USSD and assisted fallback

#### Cache, stage and verify

**Offline:** Court registrar offline draft / court-controlled cause list cache. Encrypted KioskBase device storage is a reference. Submissions are provisional offline; legally significant finalization depends on the competent issuing authority and trusted reconciliation.

USSD is conditionally available only with a properly allocated code/operator integration; personal/medical/court content is never placed in public USSD responses. Paper-assisted counters require signed custody and audit logs.

### API and JSON interoperability

#### Path, protocols and cross-sector binding

**API template:** `/v1/state/{stateCode}/dimensions/DIM-01/records`.

**RFC bindings:** NS-RFC-004, NS-RFC-005, NS-RFC-009, NS-RFC-013. **Municipal modules:** LGA-13. **Industry links:** IND-21, IND-31.

**Global comparison lenses:** NYC Court e-File, Singapore eLitigation, UK CE-File.

### Evidence, acceptance and deployment

#### Current assessment: Not yet assessed

Before promoting a specific jurisdiction/dimension cell: dated endpoint/counter observation, owning agency confirmation, method, service scope, independent source, assessor, test receipt and correction method must all be recorded.

## DIM-02 — Land Cadastral & Deeds Registry (GIS)

### Competent authority and service ownership

#### Jurisdiction and records custody

State land authority is source; address/grid does not equal title. The service cannot activate without a local authority map, explicit review/appeal procedure, issuer key ownership and applicable statutory mandate.

### Application and portal blueprint

#### Citizen, officer and auditor views

**Reference application:** State Parcel and Deeds/GIS Portal.

**Portal functions:** Parcel polygon, encumbrance authorized query, planning status, Gazette version.

**Target local role controls:** {'officer': 'authority-owned signing + role/attribute authorization', 'citizen': 'least-privilege authentication or assisted access', 'auditor': 'public aggregate/read-only unless authorized'}.

### Offline PWA, USSD and assisted fallback

#### Cache, stage and verify

**Offline:** Offline parcel observation, geofence and address referencing; no title determination. Encrypted KioskBase device storage is a reference. Submissions are provisional offline; legally significant finalization depends on the competent issuing authority and trusted reconciliation.

USSD is conditionally available only with a properly allocated code/operator integration; personal/medical/court content is never placed in public USSD responses. Paper-assisted counters require signed custody and audit logs.

### API and JSON interoperability

#### Path, protocols and cross-sector binding

**API template:** `/v1/state/{stateCode}/dimensions/DIM-02/records`.

**RFC bindings:** NS-RFC-005, NS-RFC-006, NS-RFC-012. **Municipal modules:** LGA-02, LGA-14. **Industry links:** IND-17, IND-28.

**Global comparison lenses:** Auckland LIM / Landonline, Australia PEXA, Karnataka Bhoomi.

### Evidence, acceptance and deployment

#### Current assessment: Not yet assessed

Before promoting a specific jurisdiction/dimension cell: dated endpoint/counter observation, owning agency confirmation, method, service scope, independent source, assessor, test receipt and correction method must all be recorded.

## DIM-03 — State IRS & Direct Treasury Pass-Through

### Competent authority and service ownership

#### Jurisdiction and records custody

No statutory payment held by intermediary; fees require valid legal schedule. The service cannot activate without a local authority map, explicit review/appeal procedure, issuer key ownership and applicable statutory mandate.

### Application and portal blueprint

#### Citizen, officer and auditor views

**Reference application:** Revenue, Treasury and Direct Settlement Portal.

**Portal functions:** Tax/levy schedule, beneficiary binding, bank signed settlement, signed audit roots.

**Target local role controls:** {'officer': 'authority-owned signing + role/attribute authorization', 'citizen': 'least-privilege authentication or assisted access', 'auditor': 'public aggregate/read-only unless authorized'}.

### Offline PWA, USSD and assisted fallback

#### Cache, stage and verify

**Offline:** Offline assessment drafts and cashless payment references; no offline paid receipt. Encrypted KioskBase device storage is a reference. Submissions are provisional offline; legally significant finalization depends on the competent issuing authority and trusted reconciliation.

USSD is conditionally available only with a properly allocated code/operator integration; personal/medical/court content is never placed in public USSD responses. Paper-assisted counters require signed custody and audit logs.

### API and JSON interoperability

#### Path, protocols and cross-sector binding

**API template:** `/v1/state/{stateCode}/dimensions/DIM-03/records`.

**RFC bindings:** NS-RFC-002, NS-RFC-003, NS-RFC-009, NS-RFC-014. **Municipal modules:** LGA-09, LGA-10, LGA-12. **Industry links:** IND-01, IND-05, IND-06, IND-26.

**Global comparison lenses:** Seoul ETAX, Tokyo eLTAX, Malaysia PBTpay, Quezon City RPT.

### Evidence, acceptance and deployment

#### Current assessment: Not yet assessed

Before promoting a specific jurisdiction/dimension cell: dated endpoint/counter observation, owning agency confirmation, method, service scope, independent source, assessor, test receipt and correction method must all be recorded.

## DIM-04 — State Health Insurance & PHC EMRs

### Competent authority and service ownership

#### Jurisdiction and records custody

Sensitive data segregated; clinical decision by competent professional. The service cannot activate without a local authority map, explicit review/appeal procedure, issuer key ownership and applicable statutory mandate.

### Application and portal blueprint

#### Citizen, officer and auditor views

**Reference application:** State Health/PHC and Claims Portal.

**Portal functions:** Encounter, referral, immunization, FHIR profiles and authorized insurance claims.

**Target local role controls:** {'officer': 'authority-owned signing + role/attribute authorization', 'citizen': 'least-privilege authentication or assisted access', 'auditor': 'public aggregate/read-only unless authorized'}.

### Offline PWA, USSD and assisted fallback

#### Cache, stage and verify

**Offline:** Encrypted SQLite encounter and stock drafts, staged FHIR resources. Encrypted KioskBase device storage is a reference. Submissions are provisional offline; legally significant finalization depends on the competent issuing authority and trusted reconciliation.

USSD is conditionally available only with a properly allocated code/operator integration; personal/medical/court content is never placed in public USSD responses. Paper-assisted counters require signed custody and audit logs.

### API and JSON interoperability

#### Path, protocols and cross-sector binding

**API template:** `/v1/state/{stateCode}/dimensions/DIM-04/records`.

**RFC bindings:** NS-RFC-004, NS-RFC-006, NS-RFC-011. **Municipal modules:** LGA-11. **Industry links:** IND-03, IND-19.

**Global comparison lenses:** Surabaya Puskesmas, Indonesia SATUSEHAT, New Zealand Hira.

### Evidence, acceptance and deployment

#### Current assessment: Not yet assessed

Before promoting a specific jurisdiction/dimension cell: dated endpoint/counter observation, owning agency confirmation, method, service scope, independent source, assessor, test receipt and correction method must all be recorded.

## DIM-05 — Civil Registration, 774-LGA & KioskBase Edge

### Competent authority and service ownership

#### Jurisdiction and records custody

LGA counters are not NPC or NIMC masters; FCT council code family distinct. The service cannot activate without a local authority map, explicit review/appeal procedure, issuer key ownership and applicable statutory mandate.

### Application and portal blueprint

#### Citizen, officer and auditor views

**Reference application:** Municipal Service and CRVS Bridge Portal.

**Portal functions:** NPC reconciled vital-event and lawful local attestation, grievance/permit catalog.

**Target local role controls:** {'officer': 'authority-owned signing + role/attribute authorization', 'citizen': 'least-privilege authentication or assisted access', 'auditor': 'public aggregate/read-only unless authorized'}.

### Offline PWA, USSD and assisted fallback

#### Cache, stage and verify

**Offline:** Vital event notice, localized kiosk, protected attestation/outbox. Encrypted KioskBase device storage is a reference. Submissions are provisional offline; legally significant finalization depends on the competent issuing authority and trusted reconciliation.

USSD is conditionally available only with a properly allocated code/operator integration; personal/medical/court content is never placed in public USSD responses. Paper-assisted counters require signed custody and audit logs.

### API and JSON interoperability

#### Path, protocols and cross-sector binding

**API template:** `/v1/state/{stateCode}/dimensions/DIM-05/records`.

**RFC bindings:** NS-RFC-004, NS-RFC-005, NS-RFC-006, NS-RFC-007, NS-RFC-014. **Municipal modules:** LGA-01, LGA-03, LGA-04, LGA-05, LGA-06, LGA-07, LGA-14. **Industry links:** IND-07, IND-09, IND-11, IND-14, IND-20, IND-22, IND-23, IND-27, IND-28.

**Global comparison lenses:** Tokyo MyNa/Conveni-Kofu, DKI Jakarta JAKI, Singapore OneService, Makati Makatizen.

### Evidence, acceptance and deployment

#### Current assessment: Not yet assessed

Before promoting a specific jurisdiction/dimension cell: dated endpoint/counter observation, owning agency confirmation, method, service scope, independent source, assessor, test receipt and correction method must all be recorded.

## DIM-06 — Open Contracting & State Public Procurement

### Competent authority and service ownership

#### Jurisdiction and records custody

Bid secrecy, procurements and payment authority remain with procuring body. The service cannot activate without a local authority map, explicit review/appeal procedure, issuer key ownership and applicable statutory mandate.

### Application and portal blueprint

#### Citizen, officer and auditor views

**Reference application:** Open Contracting and WardWorks Public Portal.

**Portal functions:** OCDS planning/tender/award/implementation, verified milestone, audit linkage.

**Target local role controls:** {'officer': 'authority-owned signing + role/attribute authorization', 'citizen': 'least-privilege authentication or assisted access', 'auditor': 'public aggregate/read-only unless authorized'}.

### Offline PWA, USSD and assisted fallback

#### Cache, stage and verify

**Offline:** Geo-evidence drafts, OCDS view-only cached export. Encrypted KioskBase device storage is a reference. Submissions are provisional offline; legally significant finalization depends on the competent issuing authority and trusted reconciliation.

USSD is conditionally available only with a properly allocated code/operator integration; personal/medical/court content is never placed in public USSD responses. Paper-assisted counters require signed custody and audit logs.

### API and JSON interoperability

#### Path, protocols and cross-sector binding

**API template:** `/v1/state/{stateCode}/dimensions/DIM-06/records`.

**RFC bindings:** NS-RFC-005, NS-RFC-009, NS-RFC-014. **Municipal modules:** LGA-08. **Industry links:** IND-04, IND-06, IND-17.

**Global comparison lenses:** Seoul S-Map Projects, NYC Checkbook, India eGov DIGIT / MUKTA.

### Evidence, acceptance and deployment

#### Current assessment: Not yet assessed

Before promoting a specific jurisdiction/dimension cell: dated endpoint/counter observation, owning agency confirmation, method, service scope, independent source, assessor, test receipt and correction method must all be recorded.

## DIM-07 — Agricultural Extension, Farm Polygons & Warehouses

### Competent authority and service ownership

#### Jurisdiction and records custody

Parcel overlap flags do not establish land title, water right or eligibility. The service cannot activate without a local authority map, explicit review/appeal procedure, issuer key ownership and applicable statutory mandate.

### Application and portal blueprint

#### Citizen, officer and auditor views

**Reference application:** Farm Extension and Warehouse Evidence Portal.

**Portal functions:** Polygon, farm event, goods receipt, issuer provenance.

**Target local role controls:** {'officer': 'authority-owned signing + role/attribute authorization', 'citizen': 'least-privilege authentication or assisted access', 'auditor': 'public aggregate/read-only unless authorized'}.

### Offline PWA, USSD and assisted fallback

#### Cache, stage and verify

**Offline:** Offline GeoJSON and inputs/warehouse event attestations. Encrypted KioskBase device storage is a reference. Submissions are provisional offline; legally significant finalization depends on the competent issuing authority and trusted reconciliation.

USSD is conditionally available only with a properly allocated code/operator integration; personal/medical/court content is never placed in public USSD responses. Paper-assisted counters require signed custody and audit logs.

### API and JSON interoperability

#### Path, protocols and cross-sector binding

**API template:** `/v1/state/{stateCode}/dimensions/DIM-07/records`.

**RFC bindings:** NS-RFC-004, NS-RFC-005, NS-RFC-010, NS-RFC-012. **Municipal modules:** LGA-10, LGA-14. **Industry links:** IND-09, IND-10, IND-15, IND-18.

**Global comparison lenses:** India AgriStack, New Zealand LIC Traceability, Hokkaido Rural Municipal Stack.

### Evidence, acceptance and deployment

#### Current assessment: Not yet assessed

Before promoting a specific jurisdiction/dimension cell: dated endpoint/counter observation, owning agency confirmation, method, service scope, independent source, assessor, test receipt and correction method must all be recorded.

## DIM-08 — Fiber RoW Policy, IXPN Peering & Sovereign Hosting

### Competent authority and service ownership

#### Jurisdiction and records custody

NCC license, state RoW, utility owners and security restrictions must be checked. The service cannot activate without a local authority map, explicit review/appeal procedure, issuer key ownership and applicable statutory mandate.

### Application and portal blueprint

#### Citizen, officer and auditor views

**Reference application:** Fiber Right-of-Way and Infrastructure Portal.

**Portal functions:** RoW permits, asset coordinates, incident notices, public-key discovery.

**Target local role controls:** {'officer': 'authority-owned signing + role/attribute authorization', 'citizen': 'least-privilege authentication or assisted access', 'auditor': 'public aggregate/read-only unless authorized'}.

### Offline PWA, USSD and assisted fallback

#### Cache, stage and verify

**Offline:** Offline duct/pole survey, pending works record and restoration record. Encrypted KioskBase device storage is a reference. Submissions are provisional offline; legally significant finalization depends on the competent issuing authority and trusted reconciliation.

USSD is conditionally available only with a properly allocated code/operator integration; personal/medical/court content is never placed in public USSD responses. Paper-assisted counters require signed custody and audit logs.

### API and JSON interoperability

#### Path, protocols and cross-sector binding

**API template:** `/v1/state/{stateCode}/dimensions/DIM-08/records`.

**RFC bindings:** NS-RFC-002, NS-RFC-004, NS-RFC-005, NS-RFC-008. **Municipal modules:** LGA-01, LGA-02, LGA-03, LGA-14. **Industry links:** IND-12, IND-13, IND-16, IND-25, IND-29, IND-30, IND-32.

**Global comparison lenses:** Singapore APEX, Tokyo ISMAP GovCloud, Estonia X-Road.

### Evidence, acceptance and deployment

#### Current assessment: Not yet assessed

Before promoting a specific jurisdiction/dimension cell: dated endpoint/counter observation, owning agency confirmation, method, service scope, independent source, assessor, test receipt and correction method must all be recorded.

## Complete State/FCT readiness grid

### All 37 jurisdictions without fabricated classifications

#### Eight dimension-specific statuses per jurisdiction

| Code | State/FCT | DIM-01 | DIM-02 | DIM-03 | DIM-04 | DIM-05 | DIM-06 | DIM-07 | DIM-08 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AB | Abia State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| AD | Adamawa State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| AK | Akwa Ibom State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| AN | Anambra State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| BA | Bauchi State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| BY | Bayelsa State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| BE | Benue State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| BO | Borno State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| CR | Cross River State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| DE | Delta State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| EB | Ebonyi State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| ED | Edo State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| EK | Ekiti State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| EN | Enugu State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| FC | Federal Capital Territory (FCT Abuja) | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| GO | Gombe State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| IM | Imo State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| JI | Jigawa State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| KD | Kaduna State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| KN | Kano State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| KT | Katsina State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| KE | Kebbi State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| KO | Kogi State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| KW | Kwara State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| LA | Lagos State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| NA | Nasarawa State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| NI | Niger State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| OG | Ogun State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| ON | Ondo State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| OS | Osun State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| OY | Oyo State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| PL | Plateau State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| RI | Rivers State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| SO | Sokoto State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| TA | Taraba State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| YO | Yobe State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |
| ZA | Zamfara State | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed | Not yet assessed |

### Intake data contract

#### Valid and invalid evidence-state transitions

See `SubNationalReadinessEvidence-CANDIDATE.schema.json`. A non-unassessed status must include at least one linkable source, observed timestamp, assessor, service scope and collection method. A claim that a portal exists without operational evidence does not promote any cell.
