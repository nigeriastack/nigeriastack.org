# **5\. NS-RFC-005: SureEvidence Cryptographic Regularity & Evidence Act 2011 Section 84 Credentials (`SureProof`)**

* **Status:** CANDIDATE STANDARD (Stage 3\)  
* **Working Group:** WG-02 (SureEvidence Cryptographic Trust, Legal ASTs & Admissibility)  
* **Namespace URI:** `urn:ngstack:sure-evidence:v2026`  
* **Statutory Anchor:** Evidence Act 2011, Section 84(1)–(4) & Section 106; W3C Verifiable Credentials Data Model 2.0.  
* **Target Gap Mechanism:** `MECH-05` (Trust & Evidentiary Provenance Gap)

## 5.1 Certificate and verification scope

Section 84 of the Evidence Act 2011, as amended in 2023, addresses computer-generated statements. A section 84(4) certificate identifies the document, explains its production, describes relevant devices and addresses applicable operating conditions. A responsible person supplies the certification. Courts assess admissibility in the circumstances of the proceeding. [Evidence Act 2011, s. 84](https://www.wipo.int/wipolex/en/legislation/details/22677) · [Evidence (Amendment) Act 2023](https://www.wipo.int/wipolex/en/legislation/details/22678)

The published `SureEvidenceCredential` envelope MUST identify the issuing authority, device attestation, document and cryptographic seal. The issuer records the facts it can attest. `statutoryDeclarationText` is the issuer’s factual account. A QR code, minimum character count and hardware fingerprint are project fields and cannot establish those facts.

The local JoinBody SDK emits the separate `SureEvidenceSdkCredential` representation. Its verifier checks the document digest and signature against a caller-supplied trusted key. Consumers MUST verify the original signed representation. Copying fields between representations changes the signing input. Fresh revocation information, officer authority and the full evidentiary foundation need independent verification. The example declaration in the SDK requires case-specific review before evidentiary use.

## 5.2 Transparency log

Each participating registry SHOULD publish a daily signed commitment to issued credentials and revocation events at `GET /v1/audit/merkle-root`. An auditor needs the signed root, authenticated issuer identity and inclusion or consistency evidence for the entries examined. The public log MUST exclude personal document contents.
