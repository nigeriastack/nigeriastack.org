# **5\. NS-RFC-005: SureEvidence Cryptographic Regularity & Evidence Act 2011 Section 84 Credentials (`SureProof`)**

* **Status:** CANDIDATE STANDARD (Stage 3\)  
* **Working Group:** WG-02 (SureEvidence Cryptographic Trust, Legal ASTs & Admissibility)  
* **Namespace URI:** `urn:ngstack:sure-evidence:v2026`  
* **Statutory Anchor:** Evidence Act 2011, Section 84(1)–(4) & Section 106; W3C Verifiable Credentials Data Model 2.0.  
* **Target Gap Mechanism:** `MECH-05` (Trust & Evidentiary Provenance Gap)

## **5.1 Mandatory Section 84(4) Certificate Structure**

To prevent electronic printouts, Certified True Copies (CTCs), tax receipts, medical claims, land search certificates, or LGA Indigene certificates (IndigeneProof) from being rejected in Nigerian courts under Section 84 of the Evidence Act 2011, every `SureEvidence` credential (`s84_` ULID) MUST embed three normative blocks:

1. **`issuingAuthority`:** `jurisdictionSlug` (e.g., `highcourt.lagosstate.gov.ng` or `amac.fct.gov.ng`), `divisionOrDepartment`, `certifyingOfficerName`, `certifyingOfficerRole`, and `fido2KeyId`.  
2. **`deviceRegularityAttestation` (Section 84(2) & (4) Compliance):**  
   * `hardwareFingerprintSha256`: 64-char hex digest of the certifying workstation/HSM.  
   * `operatingConditionState`: `"NORMAL_CONTINUOUS_OPERATION"` or `"RECOVERED_OFFLINE_SYNC"`.  
   * `monotonicSealCounter`: Strictly increasing integer per hardware key.  
   * `clockSyncSource`: `"GPS_HARDWARE_RTC"` or `"CELLULAR_NTP_VERIFIED"`.  
   * `statutoryDeclarationText`: Verbatim statutory attestation under Section 84(4) Evidence Act 2011 stating that the computer device was operating properly at all material times.  
3. **`cryptographicSeal`:**  
   * `payloadSha256Digest`: 64-char hex SHA-256 digest of the canonical document bytes.  
   * `signatureAlgorithm`: `"Ed25519"` or `"ECDSA_P256_FIDO2"`.  
   * `signatureBase64Url`: Cryptographic signature verifiable offline against the issuer's public key encoded inside a 300-DPI QR code (`ngstack://verify/s84_{ulid}?sig=...`).

## **5.2 Append-Only Merkle Transparency Log & Independent Public Auditability (RED-AUDIT-03)**

* Every `SureEvidence` registry node MUST publish a daily signed SHA-256 Merkle root (`GET /v1/audit/merkle-root`) over all issued `s84_` credential digests and revocation events, enabling external researchers, auditors, and citizens to verify zero silent record alteration without privileged database access.
