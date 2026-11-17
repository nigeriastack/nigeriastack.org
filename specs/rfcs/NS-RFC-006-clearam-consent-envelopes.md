# **1\. NS-RFC-006: ClearanceMesh (`ClearAm`) Multi-Sectoral Consent & Lawful-Purpose Envelopes**

* **Status:** CANDIDATE STANDARD (Stage 3\)  
* **Working Group:** WG-03 (ClearanceMesh Privacy, Open Finance & Fiscal Invariance)  
* **Namespace URI:** `urn:ngstack:clearam:v2026`  
* **Statutory Anchor:** Nigeria Data Protection Act (NDPA) 2023, Sections 24, 25, 28, 30, 31, and 37; NDPC General Application and Implementation Directive (GAID) 2025; CBN Open Banking Operational Guidelines.  
* **Target Gap Mechanisms:** `MECH-01` (Source-Access Gap), `MECH-05` (Trust/Provenance Gap)

## **1.1 Normative Envelope Structure (`clm_` ULID)**

Every cross-institutional request for personal or corporate-restricted records across any of the 32 industries MUST carry a signed `ClearAm` consent envelope (clm\_\[0-9A-HJKMNP-TV-Z\]{26}) containing:

1. **`dataPrincipal`:**  
   * `identifierType`: `"NIN"` \| `"BVN"` \| `"RC_NUMBER"` \| `"TIN"` \| `"SCN"` \| `"NHIA_ID"`.  
   * `saltedIdentityHashSha256`: 64-char hex SHA-256 digest of the identifier; raw NIN/BVN strings MUST NOT be transmitted in cleartext headers.  
2. **`lawfulBasisAndPurpose` (project purpose declaration):**  
   * `lawfulBasis`: `"EXPLICIT_DATA_SUBJECT_CONSENT"` \| `"STATUTORY_PUBLIC_MANDATE"` \| `"OPEN_COURT_PUBLIC_INTEREST"` \| `"CONTRACTUAL_PERFORMANCE"`.  
   * `purposeCode`: Must match a registered template in the repository’s `specs/clearam-templates/clearam-template-catalog.json` (e.g., `FIN-MSME-CREDIT-UNDERWRITING`, `LAW-LITIGATION-CLEARANCE`, `HLTH-PATIENT-RECORD-TRANSFER`, `EDU-DEGREE-VERIFICATION`, `AGRI-FARM-INPUT-FINANCING`, `LGA-INDIGENE-AND-VITAL-ATTESTATION`).  
3. **`dataProvidersAndScopes`:**  
   * Explicit allow-list of target `providerCategory` nodes and field-level `permittedScopes` (e.g., `["CASHFLOW_SUMMARY_90D"]` for the finance template).  
4. **`temporalBoundsAndExpiry` (`RED-CNT-02` Invariant):**  
   * `issuedAtUtc`, `validUntilUtc`, `maxRetentionDays`, and the mandatory expiry rejection action. Gateways may also impose a query-frequency limit.  
   * **Mandatory Expiry Rejection Rule (`RED-CNT-02`):** Any Data Information Provider (DIP) or gateway receiving a request whose `validUntilUtc <= current_utc_timestamp` MUST immediately abort processing with `HTTP 403 CLEARAM_ARTIFACT_EXPIRED` and MUST NOT introspect or cache the downstream payload.

## **1.2 Right to Exit & \< 60-Second Consent Revocation SLA (01 Exit / RED-AUDIT-01)**

Any Data Subject revoking a `ClearAm` consent token (`DELETE /v1/clearam/consents/{clm_ulid}`) MUST have that revocation propagated across all participating gateways within 60 seconds, causing any subsequent query using that token to abort at the perimeter with `HTTP 403 CLEARAM_ARTIFACT_REVOKED` and zero database queries.

The 60-second bound is a project propagation target. A template names a proposed purpose. The controller must determine and document its applicable lawful basis, restrictions on disclosure and retention, including for open-court material. A stored label or signed envelope alone cannot determine that authority. [NDPA 2023, ss. 24–26 and 35](https://ndpc.gov.ng/wp-content/uploads/2024/03/Nigeria_Data_Protection_Act_2023.pdf)
