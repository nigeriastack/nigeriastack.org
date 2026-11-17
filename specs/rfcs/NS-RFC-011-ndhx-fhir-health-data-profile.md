# **2\. NS-RFC-011: Nigeria Digital Health Exchange (`NDHX`) & `SureLearn` Verifiable Academic Credentials**

* **Status:** CANDIDATE STANDARD (Stage 3\)  
* **Working Group:** WG-05 (Sub-National Registries, Health, Education & Smart Grids)  
* **Namespace URIs:** `urn:ngstack:ndhx:v2026` & `urn:ngstack:surelearn:v2026`  
* **Statutory Anchor:** National Health Act 2014; NHIA Act 2022; NDPA 2023 ss. 30–31 (Sensitive Personal Data); NUC / NBTE / WAEC / JAMB Enabling Acts.  
* **Target Gap Mechanisms:** `MECH-01` (Source-Access), `MECH-03` (Semantic), `MECH-05` (Trust/Provenance)

## **2.1 `NDHX` Patient-Consented HL7 FHIR R4 Profile (`IND-19`)**

1. **Mandatory `ClearAm` Sensitive-Data Gate:** No hospital EMR, HMO, pharmacy, or diagnostic lab MAY exchange patient summaries, e-prescriptions (`eRx`), or NHIA/HMO e-claims without a valid `ClearAm` token (`clm_` ULID) carrying `purposeCode: "HLTH-PATIENT-RECORD-TRANSFER"`. Emergency or other non-consent exchange requires a separately authorized profile outside this catalog.  
2. **Offline Ward PHC Synchronization:** Rural Primary Healthcare Centres (PHCs) operating under `LGA-11` (`WardPHC`) MUST support offline `KioskBase` immunization and maternal-health encounter capture with automatic HLC-CRDT sync.

## **2.2 `SureLearn` W3C Verifiable Academic & Professional Credentials (`IND-20`)**

* Universities, Polytechnics, WAEC, NECO, JAMB, NYSC, and professional bodies (NBA, MDCN, COREN, ICAN, TRCN) SHALL issue degree transcripts, discharge certificates, and practicing licenses as W3C Verifiable Credentials v2.0 wrapped in a `SureEvidence` (`s84_` ULID) hardware signature.  
* A verifier can check the signature offline using an independently trusted issuer key. Credential acceptance, current revocation status and actual verification charges depend on the receiving institution.

---
