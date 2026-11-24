---
route: "/protocols/lga-governance-stack/lga-01-council-complain"
canonical_url: "https://nigeriastack.org/protocols/lga-governance-stack/lga-01-council-complain"
seo_title: "LGA-01 CouncilComplain | NigeriaStack Municipal Open Specification"
meta_description: "Inspect the open, authority-owned CouncilComplain municipal interface, offline channels, legal boundaries and acceptance tests."
license: "CC0-1.0"
attribution: "Digital Economic Development Initiative | DIGITECO (https://digiteco.org)"
review_status: "COPY_CANDIDATE_UNDER_REVIEW"
public_release_authorized: false
---

# CouncilComplain: an interoperable municipal service specification

**LGA-01** defines a vendor-neutral workflow for civic grievance using a State or council system controlled by the legally competent authority. It does not authorize NigeriaStack to operate an official service or collect public money.

## What residents and institutions can do

### Use an accessible service channel

The reference design provides a mobile-friendly portal, an offline PWA, a paper-assisted counter and safe limited USSD discovery once an operator allocates the requested service code. Complaint receipt on basic phone; no sensitive narrative.

#### What stays offline

An offline form can preserve an encrypted draft and issue a clearly provisional intake reference. Final legal, fiscal or clinical decisions remain with an independently authorized official.

## How the service moves between institutions

### Source records and permitted checks

**Authority of record:** Public works/council or responsible State utility. **Main process:** Council infrastructure complaint intake; assigned responsible service owner.

#### The release and correction boundary

No citizen-forced closure, publish accountability trail without personal details. The implementation must provide a correction and appeal route before describing a record as finally resolved.

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

- Module: `LGA-01`
- API route: `/v1/municipal/{councilCode}/services/LGA-01`
- Linked building blocks: `BB-02`, `BB-05`
- HLC state transitions: `FILED_OFFLINE`, `VALIDATED`, `REFERRED_TO_COMPETENT_AUTHORITY`, `WORK_IN_PROGRESS`, `EVIDENCE_SUBMITTED`, `CITIZEN_REVIEW`, `CLOSED`, `REOPENED`
- Proposed request keys: `serviceCategory`, `wardCode`, `locationRef`, `hazardSeverity`, `issueDescription`, `photoDigest`
- Required guard: signed issuer authorization; privacy-segregated offline draft; no direct treasury settlement claim before independently verified bank receipt

</details>
