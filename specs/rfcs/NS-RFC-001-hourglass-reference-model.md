# **1\. NS-RFC-001: The Sovereign 5-Layer Hourglass & 12 Building Blocks Reference Model**

* **Status:** CANDIDATE STANDARD (Stage 3\)  
* **Working Group:** WG-01 (Core Architecture, Confluence Transport & Workflow Continuity)  
* **Statutory Alignment:** FMCIDE & NITDA National Digital Public Infrastructure Framework; 1999 Constitution ss. 6(5), 7(1), 121(3); NDPA 2023 ss. 24–43; Evidence Act 2011 ss. 84 & 106\.

## **1.1 Normative Hourglass Requirements (RFC 2119\)**

1. **Vendor-Neutral Layer Separation:** Every Nigeria Stack specification MUST separate infrastructure into five vendor-neutral layers:  
   * **Layer 1:** Sovereign Edge Computing, Offline Continuity & Physical Resilience Infrastructure (`KioskBase` edge nodes, Nigerian Tier-III Data Center residency, LOS/ABV IXPN peering).  
   * **Layer 2:** Federated Statutory Identity, Corporate, Tax & Treasury Foundation Bridges (NIMC `NIN`, CAC `RC`, NIBSS `BVN`/`NIP`, NRS `TIN`, NBA `SCN`, and `SplitDirect` zero-escrow public revenue pass-through).  
   * **Layer 3:** Verifiable Base Registries, Statutory ASTs & Cryptographic Evidentiary Trust (`SureEvidence` Section 84 credentials, `KioskBase` state schemas, `LawTree AST` \[`urn:ngstack:lawtree:v2026`\]).  
   * **Layer 4 (The Narrow Waist):** Asynchronous Data Exchange (`Confluence` / `Junction`), Statutory Consent (`ClearanceMesh` / `ClearAm`), Decentralized Commerce (`OpenMarket` / `MarketLink`), Cross-Border Trade (`TradeCorridor` / `PassCargo`), and Agentic Delegation (`Warrant & Mandate` / `GivePower`).  
   * **Layer 5:** Whole-of-Economy Sectoral Networks across all 8 Macro-Sectors, 32 Industries (`IND-01` to `IND-32`), 36 States \+ FCT, and 774 Constitutional LGAs (`LgaGovernanceStack`).  
2. **Prohibition of Master-Database Duplication:** Participating nodes MUST NOT construct centralized shadow copies of statutory master registries (NIMC, CAC, NIBSS, State Land Bureaus, or Court Dockets). All verifications SHALL operate via authorized, federated digest checks or issuer-signed `SureEvidence` credentials.

## **1.2 Architectural Layer Summary**

| Layer | Functional Scope | Primary Components & Technical Constructs | Key Governance & Constraints |
| :---- | :---- | :---- | :---- |
| **Layer 5** | Sectoral Applications | Macro-Sectors, `IND-01` to `IND-32`, `LgaGovernanceStack` | Strict local domain autonomy |
| **Layer 4** | The Narrow Waist | `Confluence`, `ClearanceMesh`, `OpenMarket`, `TradeCorridor`, `Warrant & Mandate` | Standardized, open protocol interfaces |
| **Layer 3** | Verifiable Trust & ASTs | `SureEvidence`, `KioskBase` Schemas, `LawTree AST` | Provenance information for Section 84 review |
| **Layer 2** | Statutory Identity & Bridges | NIMC `NIN`, CAC `RC`, NIBSS `BVN`/`NIP`, NRS `TIN`, `SplitDirect` | Federated statutory authority |
| **Layer 1** | Physical Infrastructure | Tier-III Data Centers, IXPN Peering, `KioskBase` Nodes | Sovereign in-country data residency |
