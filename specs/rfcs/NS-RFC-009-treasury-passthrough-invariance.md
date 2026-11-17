# **4\. NS-RFC-009: `SplitDirect` Public Treasury Pass-Through & Fiscal Invariance Protocol**

* **Status:** CANDIDATE STANDARD (Stage 3\)  
* **Working Group:** WG-03  
* **Namespace URI:** `urn:ngstack:splitdirect:v2026`  
* **Statutory Anchor:** 1999 Constitution of the Federal Republic of Nigeria (as amended), Section 121(3) (Financial Autonomy of State Judiciaries & Legislatures), Section 162, & Section 7(1) / Fourth Schedule; Supreme Court Judgment `AG Federation v. AG Abia State & 35 Ors (SC/CV/343/2024)`; Nigeria Revenue Service (NRS) ATRS e-Invoicing Standard.  
* **Target Gap Mechanisms:** `MECH-02` (Sub-National Coverage), `MECH-04` (Transaction Gap), `MECH-05` (Audit Provenance), `MECH-07` (Commercial Capture)

## **4.1 Zero Private Escrow of Public Statutory Revenue (`RED-CNT-01` Invariant)**

Section 121(3) concerns sums credited to a state House of Assembly or judiciary in the state Consolidated Revenue Fund. Section 162 and the 2024 local-government judgment concern a different fiscal setting. For each service the collecting body must establish the applicable fee authority and beneficiary account. SplitDirect’s zero-escrow checks are project controls. [Constitution, s. 121(3), as altered](https://ir.nilds.gov.ng/handle/123456789/1729) · [State House statement on local-government financial autonomy](https://statehouse.gov.ng/president-tinubu-welcomes-supreme-court-judgement-affirming-constitutional-rights-of-local-government/)

1. **Hard Invariant (`platform_escrow_amount_kobo == 0`):** No private Technical Service Provider (TSP) or software concessionaire implementing `nigeriastack.org` specifications MAY collect, pool, or hold statutory filing fees, probate assessments, land registration charges, state taxes, or LGA `MarketCollect` / `TenementRate` levies in a private corporate bank account.  
2. **Deterministic Gateway Split Schema (`revenue_split_rule`):** Every public-revenue payment payload routed to NIBSS, Remita, Interswitch, or a CBN-licensed payment gateway MUST declare an immutable split array at initiation:  
   * `statutoryPrincipalSplit`: `100%` of the statutory fee schedule routed directly to the account independently verified for this beneficiary and revenue stream.  
   * `tspConvenienceFeeSplit` *(Optional)*: Any contractually gazetted technology convenience fee is split at the payment gateway level as a separate line item and never commingled with statutory principal sums.  
3. **Cryptographic Settlement Verification Before Sealing:** A `KioskBase` or `SureEvidence` registry node MUST verify the signed gateway settlement webhook (`settlementStatus == "SETTLED_DIRECT_TO_TREASURY"`) before minting a final enrolled seal on a fee-bearing document.  
4. **Public Merkle Treasury Audit Log (03 Audit / RED-AUDIT-03):** Every `SplitDirect` gateway and 774-LGA / Court revenue node MUST publish an append-only SHA-256 Merkle root (`GET /v1/audit/treasury-merkle-root`) over daily statutory split receipts so State/Federal Auditors General, NFIU, and civic monitors (Cluster 7\) can reconcile included receipts against independent settlement records without exposing payer PII.
