# **5\. NS-RFC-014: `LgaGovernanceStack` — 768 State LGAs and 6 FCT Area Councils Municipal Specification**

* **Status:** CANDIDATE STANDARD (Stage 3\)  
* **Working Group:** WG-05 (in joint session with WG-03)  
* **Namespace URI:** `urn:ngstack:lga-stack:v2026`  
* **Statutory Anchor:** Section 7(1) & Fourth Schedule, 1999 Constitution of the Federal Republic of Nigeria (as amended); Supreme Court Judgment *AG Federation v. AG Abia State & 35 Ors (SC/CV/343/2024, July 11, 2024\)*; Birth, Death, Etc. (Compulsory Registration) Act; Evidence Act 2011 s. 84\.  
* **Target Gap Mechanisms:** `MECH-02` (Grassroots Coverage Gap), `MECH-05` (Forged Paper Certificates), `MECH-06` (Rural Power/2G Drops), `MECH-07` (Cash-Touting / *Agbero* IGR Leakage)


## 5.1 Municipal service profiles

The registry contains 774 council entries, including six FCT area councils. Each module below is a proposed offline-first `KioskBase` workflow. An implementing authority must confirm its competence, applicable state or FCT law, fee schedule, responsible officer, permitted disclosure and access to the relevant registries before enabling a service. The Fourth Schedule describes council functions and participation in state functions. The module catalog also includes integrations involving other authorities. [Constitution, s. 7 and Fourth Schedule](https://ir.nilds.gov.ng/handle/123456789/1729)

| Module and proposed route | Workflow and scope |
| --- | --- |
| `LGA-01` CouncilComplain · `/protocols/lga-governance-stack/lga-01-council-complain` | Residents can file offline, receive a ward assignment, inspect the repair evidence and confirm closure. |
| `LGA-02` BuildClear · `/protocols/lga-governance-stack/lga-02-build-clear` | A planning authority records a site, validates the applicable setback and signs a reviewed permit. |
| `LGA-03` WashConnect · `/protocols/lga-governance-stack/lga-03-wash-connect` | The treatment plant records a discharge receipt. Where authorized, settlement follows completion without a private intermediary holding a public tariff. |
| `LGA-04` ShopPermit · `/protocols/lga-governance-stack/lga-04-shop-permit` | The issuing authority applies its published fee schedule and links each shop or stall licence to its receipt. |
| `LGA-05` VitalProof · `/protocols/lga-governance-stack/lga-05-vital-proof` | A registrar records vital events offline and reconciles them with the authorized registry. Enrollment depends on issuer authority and registry acceptance. |
| `LGA-06` IndigeneProof · `/protocols/lga-governance-stack/lga-06-indigene-proof` | Applicants submit an attestation request. The proposed service target is a decision or receipted deficiency notice in 72 hours. Ward vouching and any fee require local authorization. |
| `LGA-07` SafetyNOC · `/protocols/lga-governance-stack/lga-07-safety-noc` | An inspector records a site visit, signs the authorized clearance and records its expiry. |
| `LGA-08` WardWorks · `/protocols/lga-governance-stack/lga-08-ward-works` | The auditor links an OCDS procurement record to the work evidence and verifies the milestone before payout. |
| `LGA-09` TenementRate · `/protocols/lga-governance-stack/lga-09-tenement-rate` | Assessors reconcile parcel boundaries and applicable rate schedules. The gateway records the authorized fee and destination. |
| `LGA-10` MarketCollect · `/protocols/lga-governance-stack/lga-10-market-collect` | Drivers and traders can present a signed market ticket or corridor pass for offline checks. Acceptance by other councils requires an agreement and a current fee schedule. |
| `LGA-11` WardPHC · `/protocols/lga-governance-stack/lga-11-ward-phc` | A participating primary health centre can capture ward encounters offline. Access to individual clinical records requires authorization. |
| `LGA-12` CouncilLedger · `/protocols/lga-governance-stack/lga-12-council-ledger` | Auditors reconcile allocation and fee receipts with bank settlement records. Only disclosure-approved aggregates belong in the public ledger. |
| `LGA-13` CustomaryDocket · `/protocols/lga-governance-stack/lga-13-customary-docket` | The competent court registrar controls the docket and appellate transmission. Family and minor records remain restricted. The council identifier identifies geography and confers no judicial authority. |
| `LGA-14` StreetGrid · `/protocols/lga-governance-stack/lga-14-street-grid` | An authorized officer links an offline parcel code to the approved street-naming record. |

## 5.2 Treasury and evidence

A participating fee collector MUST use `SplitDirect` with zero platform and state-intermediary escrow for an authorized direct-to-council collection. The settlement destination must be verified for the specific payment. The 2024 local-government autonomy judgment concerns local-government finance. Its application to a particular fee or collection arrangement requires separate legal review. A receipt or Merkle inclusion proof evidences what was recorded. A reconciliation with authoritative bank records is needed to verify settlement. [State House statement, 11 July 2024](https://statehouse.gov.ng/president-tinubu-welcomes-supreme-court-judgement-affirming-constitutional-rights-of-local-government/)

`SureEvidence` verification requires independently trusted issuer keys. An offline result MUST state its revocation-data freshness. The profile targets a QR verification computation below 50 milliseconds on the selected test device, excluding camera capture and network lookup. Record actual measurements before making a performance claim. Registry operators MUST limit access to docket or health data used in any `LandGuard` cross-check. A spatial match alone cannot establish title or rights of occupancy.

## 5.3 Access, governance and the Five Tests

- **01 Exit.** Implementers SHOULD provide export in SQLite or JSON-LD, a paper-assisted channel, and the ClearAm revocation propagation target. The offline PWA shell targets less than 35 KB compressed. Feature-phone workflows for CouncilComplain, VitalProof, MarketCollect and WardPHC require an assigned USSD code and operator integration. No allocation is recorded here. Message fees and availability depend on the operator. [NCC short-code guidance](https://consumer.ncc.gov.ng/information-education/faqs/11-short-codes)
- **02 Code.** This specification uses CC0-1.0. The reference SDK declares Apache-2.0 OR MIT.
- **03 Audit.** Publish daily signed treasury and credential roots. Give authorized auditors the inclusion proofs and independent settlement records needed for reconciliation.
- **04 Govern.** WG-05 and WG-03 are proposed project review groups. Record the accountable authority, approvals and redress route for each deployment.
- **05 Fork.** Implementers can self-host and publish issuer key material under a domain they control. Verify the issuer’s authority independently before trusting its keys.

The five proposed service locales are `en-NG`, `ha-NG`, `yo-NG`, `ig-NG` and `pcm-NG`. Apply the NS-RFC-013 review state before publishing statutory or consent text. The module catalog records proposed transitions and scope for each service.
