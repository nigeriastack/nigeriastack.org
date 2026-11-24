---
route: "/protocols/lga-governance-stack/lga-13-customary-docket"
canonical_url: "https://nigeriastack.org/protocols/lga-governance-stack/lga-13-customary-docket"
seo_title: "LGA-13 CustomaryDocket | NigeriaStack Municipal Open Specification"
meta_description: "Inspect the open, authority-owned CustomaryDocket municipal interface, offline channels, legal boundaries and acceptance tests."
license: "CC0-1.0"
attribution: "Digital Economic Development Initiative | DIGITECO (https://digiteco.org)"
review_status: "COPY_CANDIDATE_UNDER_REVIEW"
public_release_authorized: false
---

# CustomaryDocket: an interoperable municipal service specification

**LGA-13** defines a vendor-neutral workflow for customary/area court docket using a State or council system controlled by the legally competent authority. It does not authorize NigeriaStack to operate an official service or collect public money.

## What residents and institutions can do

### Use an accessible service channel

The reference design provides a mobile-friendly portal, an offline PWA, a paper-assisted counter and safe limited USSD discovery once an operator allocates the requested service code. Public cause-list only if court rule permits.

#### What stays offline

An offline form can preserve an encrypted draft and issue a clearly provisional intake reference. Final legal, fiscal or clinical decisions remain with an independently authorized official.

## How the service moves between institutions

### Source records and permitted checks

**Authority of record:** Chief Registrar/competent court of the relevant State/FCT. **Main process:** Competent court case intake and record transfer, geography only for LGA.

#### The release and correction boundary

Council geo code gives no judicial competence; family/juvenile sealed. The implementation must provide a correction and appeal route before describing a record as finally resolved.

## Public evidence and operational readiness

### What can be verified

Verifiers may check the independent issuer signature, payload digest, document status and age of cached revocation information. A signed credential does not by itself establish lawful authority, factual correctness, admissibility or bank settlement.

#### What has been assessed

**Operational deployment: Not yet assessed** in the source readiness atlas. This page describes an open specification, not a confirmed local deployment.

## Technical implementation details

### Reference contract and test cases

The implementation profile is bound to [NS-RFC-014](/rfcs/NS-RFC-014) and the independently deployed issuer API. Raw identifiers are shown only in the developer panel.

#### Developer contract drawer

<details class="ns-tech-drawer">
<summary>Implementation identifiers, data keys and protocol controls</summary>

- Module: `LGA-13`
- API route: `/v1/municipal/{councilCode}/services/LGA-13`
- Linked building blocks: `BB-02`, `BB-04`, `BB-05`, `BB-10`
- HLC state transitions: `COURT_INTAKE`, `RESTRICTED_CLASSIFIED`, `REGISTRAR_REVIEW`, `DOCUMENT_SEALED`, `APPEAL_REFERRED`, `ARCHIVED`
- Proposed request keys: `courtIdentifier`, `matterRef`, `filingDate`, `privacyClassification`, `judicialDirectionRef`
- Required guard: signed issuer authorization; privacy-segregated offline draft; no direct treasury settlement claim before independently verified bank receipt

</details>
