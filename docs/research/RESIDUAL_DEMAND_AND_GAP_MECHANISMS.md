# **NS-KB-03A: Empirical 8-Mechanism Diagnostic Rubric & Residual Demand Specification**

* **Document ID:** `NS-RES-2026-KB03A-V2`  
* **Canonical Path:** `docs/research/RESIDUAL_DEMAND_AND_GAP_MECHANISMS.md`  
* **Governing Skill Harness:** `NS-SH-02` (Nigerian Industry Intelligence & Gap Analyst)  
* **Verification Gate:** `Gate NS-G2` (Evidence-Graded Industry Analysis & Anti-Overclaim Audit)

# **1\. Methodological Rule: Residual Demand vs. Invented Market Voids**

In accordance with the workspace research corpus (*Full-Industry Coverage and Product-Opportunity Map* and *Residual Demand: Where Existing Providers Leave Work Unfinished*), `nigeriastack.org` strictly prohibits claiming that Nigeria or Africa lacks foundational payment, messaging, KYC, logistics, or HR APIs where documented domestic incumbents already operate.

1. **The APIs.io Catalog Rule:** A thin or empty category in a global directory (such as APIs.io or RapidAPI) reflects catalog coverage, **not** proof that an industry lacks software in Nigeria.  
2. **The Residual Work Principle:** Domestic providers (NIBSS, Paystack, Moniepoint, Shipbubble, Bob Go, Termii, Africa's Talking, Dojah, Prembly, Workpay, SeamlessHR, Helium Health, Curacel, Turaco, AFEX) already solve single-provider operations. The true national bottleneck is the **unfinished residual engineering and legal compliance work** required when transactions cross institutional boundaries, survive 2G/3G/power drops, or face evidentiary scrutiny in a Nigerian High Court.

# **2\. The 8 Normative Failure Mechanisms (`MECH-01` to `MECH-08`)**

Every industry in `content/taxonomy/master-32-industry-matrix.json` is diagnosed against eight specific structural failure mechanisms:

| Mechanism Code | Failure Mechanism Name | Underlying Engineering & Legal Failure Mode in Nigeria | Canonical nigeriastack.org Architectural Remedy |
| :---- | :---- | :---- | :---- |
| **`MECH-01`** | **Source-Access Gap** | Authoritative data exists inside federal or state institutions (e.g., 30+ State Land Bureaus, Probate Registries, Professional Rolls), but no authorized, rate-limited, consent-gated programmatic interface is exposed. | **`ClearAm` Consent Envelopes (`NS-RFC-006`) & `SureProof-ID` Bridges (`BB-01`)** providing zero-knowledge, purpose-bound query adapters without duplicating master databases. |
| **`MECH-02`** | **Coverage Gap** | Digital solutions operate in Lagos, Abuja (FCT), or Port Harcourt, while 30+ states, 774 LGAs, lower courts (Magistracy/Customary/Area), and rural agricultural corridors remain completely paper-bound. | **`KioskBase` Offline Registry Kernel (`NS-RFC-004` / `BB-02`)** enabling zero-license, low-cost sub-national deployment across all 36 States \+ FCT. |
| **`MECH-03`** | **Semantic Gap** | Two functional systems cannot interoperate because their JSON payloads, status vocabularies (`Sent` vs `Delivered` vs `DND`), suit number formats, or tax codes conflict. | **Normative Domain Schemas (`NS-RFC-009..016`)** (LawTree AST / StatuteProof (urn:ngstack:lawtree:v2026), NDHX HL7 FHIR, LandGuard ISO 19152 LADM, Confluence Fiscal Ledger) with loss-aware mappings. |
| **`MECH-04`** | **Transaction Gap** | Discovery or status lookup exists, but independent parties cannot complete an atomic multi-party workflow (e.g., land title check \+ court `lis pendens` clearance \+ stamp duty split). | **`Confluence` Workflow State Machines (`NS-RFC-003`) & `MarketLink` / `PassCargo` Contracts (`NS-RFC-007`, `NS-RFC-010`)** managing `UNKNOWN_TIMEOUT` states and idempotent retries. |
| **`MECH-05`** | **Trust / Provenance Gap** | Data or PDF documents move over the wire, but are rejected in trial courts or bank credit committees for failing **Section 84(1)–(4) and Section 106 of the Evidence Act 2011** (lack of device regularity certificate and cryptographic chain of custody). | **`SureEvidence` (`SureProof`) Standard (`NS-RFC-005` / `BB-05`)** embedding SHA-256 digests, hardware operating state attestations, and Ed25519 FIDO2 seals with 300-DPI QR verification. |
| **`MECH-06`** | **Operational / Offline Gap** | Cloud-rendered portals assume continuous grid electricity and low-latency broadband, causing total registry or clinic gridlock during daily power outages and 2G/3G cellular drops. | **`< 35 KB` Offline-First PWA Shell \+ Client `SQLite WASM` \+ Hybrid Logical Clock (HLC) CRDTs (`NS-RFC-004`)** with 300-second hardware clock-drift flagging (`DEGRADED_LOCAL_HLC`). |
| **`MECH-07`** | **Commercial / Procurement Gap** | Foreign SaaS platforms require USD credit-card billing or charge 15–30% marketplace take-rates, while private collection portals escrow public revenue in violation of **Section 121(3) CFRN**. | **`SplitDirect` Pass-Through Treasury Invariance (`NS-RFC-009` / `BB-06`)** (`platform_escrow_kobo = 0`), open CC-BY-4.0/Apache-2.0 specs, and HTTP 402 (`x402`) sub-cent settlement schemas. |
| **`MECH-08`** | **Developer-Implementation Gap** | Statutory mandates (NDPA 2023, CBN Open Banking, NBA RPC Rule 39, Evidence Act s. 84\) exist only as static 200-page PDFs with zero executable code, SDKs, chaos fixtures, or conformance tests. | **`JoinBody` Reference SDKs (`@nigeriastack/*`) & Interoperability Test Bed (`@nigeriastack/conformance-cli`)** providing drop-in Ed25519 signing, PII redaction, and Gherkin failure-recovery packs. |

# **3\. Summary Distribution Across the 32 Industries**

* **Tier 1 (`TIER_1_LIVE_ANCHOR` — 10 Industries):** Industries `IND-01` (Payments), `IND-02` (Banking/Open Finance), `IND-05` (Tax/IGR), `IND-07` (Identity/KYB), `IND-17` (Land/Property Titles), `IND-21` (Judiciary/Legal), `IND-25` (Communications/Substituted Service), `IND-27` (AI/Languages), `IND-29` (Security/PKI), `IND-30` (Developer Workflows), `IND-31` (Data/Statutory ASTs), and `IND-32` (Autonomous Agents/MCP). Backed by live production schemas and executable conformance suites in the repository.  
* **Tier 2 (`TIER_2_NORMATIVE_DRAFT` — 14 Industries):** Industries `IND-03` (Insurance), `IND-06` (Accounting/ERP), `IND-08` (Payroll/Pensions), `IND-09` (Logistics), `IND-10` (Cross-Border Trade), `IND-11` (Open Retail), `IND-14` (Mobility/Transit), `IND-15` (Agriculture), `IND-19` (Healthcare FHIR), `IND-20` (Education Credentials), `IND-23` (Food Delivery), `IND-26` (Network Fraud Signals), and `IND-28` (Geospatial/Addressing).  
* **Tier 3 (`TIER_3_RESEARCH_CHARTER` — 6 Industries):** Industries `IND-04` (Capital Markets), `IND-12` (Smart Grids), `IND-13` (Connected Fleets), `IND-16` (Manufacturing IoT), `IND-18` (Climate/Hydrology), `IND-22` (Hospitality), and `IND-24` (Media/Creative Rights).
