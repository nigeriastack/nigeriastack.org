# NIGERIASTACK.ORG — INSTITUTIONAL POSITIONING CHARTER, ANTI-CAPTURE FIREWALL & WORKING GROUP GOVERNANCE

- **Document ID:** `NS-GOV-2026-KB01-V2`  
- **Version:** `2026.6-RATIFIED`  
- **Canonical Path:** `docs/governance/NIGERIA_STACK_INSTITUTIONAL_CHARTER.md`  
- **Governing Skill Harness:** `NS-SH-01` (Whole-of-Economy DPI & Protocol Architect)  
- **Verification Gate:** `Gate NS-G1` (Protocol, Demarcation & Anti-Capture Validity)  
- **Normative Language:** RFC 2119 / RFC 8174 (`MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHALL NOT`, `SHOULD`, `MAY`)  
- **Statutory Alignment:** 1999 Constitution of the Federal Republic of Nigeria (as amended) ss. 6(5), 36(3)–(4), 121(3); Nigeria Data Protection Act (NDPA) 2023 ss. 24–43 & NDPC GAID 2025; Evidence Act 2011 ss. 84 & 106; Companies and Allied Matters Act (CAMA) 2020; FMCIDE & NITDA National Digital Public Infrastructure (DPI) Framework.

---

## 1\. Defining Proposition & Constitutional Purpose

### 1.1 Core Defining Proposition

`nigeriastack.org` is an independent, Nigerian-designed, whole-of-economy open specification and conformance commons. Every RFC, schema, building block, gap-atlas entry, implementation playbook, and conformance test published under `nigeriastack.org` MUST enforce one foundational proposition:

> **"Make Nigeria's digital systems work together without surrendering statutory authority, operational continuity, evidentiary integrity, or institutional independence."**

### 1.2 The Four-Wall Anti-Capture Firewall (What `nigeriastack.org` Is NOT)

To prevent architectural drift, regulatory conflict, or commercial capture, `nigeriastack.org` is governed by four absolute negative constraints:

1. **NOT a Payment Gateway or Financial Switch:**  
   - `nigeriastack.org` MUST NOT process, clear, custody, or escrow fiat currency (NGN/USD), stablecoins, or statutory public revenues.  
   - It defines only open payload schemas, idempotent transaction state machines (`NS-RFC-003`), and pass-through revenue verification rules (`NS-RFC-009`). Runtime financial switching belongs exclusively to CBN-licensed operators (NIBSS, Remita, Interswitch, Paystack, Flutterwave, Moniepoint) and downstream settlement relays.  
2. **NOT a Commercial API Marketplace or Runtime Broker:**  
   - `nigeriastack.org` MUST NOT host commercial API proxy endpoints, issue paid runtime API keys, meter developer traffic, or charge per-call brokerage fees.  
   - It publishes static, versioned OpenAPI 3.1.1 contracts, JSON Schema 2020-12 definitions, and synthetic conformance test fixtures. Commercial runtime brokerage and dynamic agent tool resolution belong to downstream Technical Service Providers (TSPs) such as `api.net.ng`, MTN Chenosis, or enterprise gateways.  
3. **NOT a Government Portal or Statutory Regulator:**  
   - `nigeriastack.org` is not an agency of the Federal Government of Nigeria or any State Government, does not issue National Identity Numbers (`NIN`), Bank Verification Numbers (`BVN`), Corporate Registration Numbers (`RC`), or Supreme Court Enrollment Numbers (`SCN`), and exercises zero statutory enforcement power.  
   - Every web route, documentation header, and exported specification package MUST render the programmatic `NonImpersonationBanner` and embed the `Consortium` JSON-LD authority assertion defined in Section 6 of this Charter.  
4. **NOT a Proprietary MIDL Product Catalogue:**  
   - The 5 architectural layers and 12 building blocks of `nigeriastack.org` MUST remain 100% vendor-neutral and whole-of-economy across all 32 industries.  
   - No single private company—including Metropolitan Infrastructure Development Ltd (MIDL)—may be named in the normative title of any Nigeria Stack layer, building block, or RFC. First-party MIDL concessions (`courts.com.ng`, `openlaw.org.ng`, `justicelens.ng`, `api.net.ng`) participate strictly on equal footing with other verified Nigerian ecosystem implementations (e.g., NIBSS, Paystack, Shipbubble, Termii, Helium Health, Dojah, Workpay, Curacel) inside the **Accredited Reference Implementations Registry**.

---

## 2\. Vendor-Neutral 5-Layer Sovereign Hourglass Architecture

All vendor names are purged from the normative layer definitions. The Nigeria Stack operates as a 5-layer hourglass architecture where open protocols form the narrow waist connecting public foundation rails to 32 industry verticals:

```
========================================================================================================================
                THE NIGERIA STACK: VENDOR-NEUTRAL 5-LAYER WHOLE-OF-ECONOMY HOURGLASS ARCHITECTURE
========================================================================================================================

  +--------------------------------------------------------------------------------------------------------------------+
  | LAYER 5: WHOLE-OF-ECONOMY OPEN SECTORAL NETWORKS & CITIZEN / ENTERPRISE LIFE-EVENT FLOWS                           |
  | • 8 Macro Economic Sectors & 32 Industry Verticals (Finance, Justice, Commerce, Health, Education, Agri, Energy, AI)|
  | • Cradle-to-Grave Life-Event Orchestration without platform monopolies, subjective rankings, or vendor lock-in.    |
  +---------------------------------------------------------+----------------------------------------------------------+
                                                            ▲
                                                            │ (OpenAPI 3.1.1 / JSON-LD / W3C VC / MCP JSON-RPC 2.0)
                                                            ▼
  +--------------------------------------------------------------------------------------------------------------------+
  | LAYER 4: ASYNCHRONOUS DATA EXCHANGE, STATUTORY CONSENT & AGENT DELEGATION PROTOCOLS (THE NARROW WAIST)             |
  | • Confluence Gateway Spec (`Junction`): Signed asynchronous webhook transport, idempotency & state reconciliation. |
  | • ClearanceMesh Protocol (`ClearAm`): NDPA 2023 ss. 24–37 purpose-bound, time-limited consent envelopes.           |
  | • Warrant & Mandate Protocol (`GivePower`): Read-only default sandboxing & human countersignatures for AI agents.  |
  | • OpenMarket Protocol (`MarketLink`) & TradeCorridor Framework (`PassCargo`): Decentralized commerce & trade specs.|
  +---------------------------------------------------------+----------------------------------------------------------+
                                                            ▲
                                                            │ (Ed25519 Hardware Signatures & Zero-Knowledge Proofs)
                                                            ▼
  +--------------------------------------------------------------------------------------------------------------------+
  | LAYER 3: VERIFIABLE BASE REGISTRIES, STATUTORY ASTs & CRYPTOGRAPHIC EVIDENTIARY TRUST                              |
  | • SureEvidence Standard (`SureProof`): Evidence Act 2011 ss. 84 & 106 hardware regularity & QR verification specs. |
  | • Federated Local Registry Kernel (`KioskBase`): Sub-national registry data models & bi-temporal state schemas.    |
  | • Machine-Readable Statutory & Regulatory ASTs: Akoma Ntoso 3.0 (`urn:lex:ng:*`) & executable policy rules.        |
  +---------------------------------------------------------+----------------------------------------------------------+
                                                            ▲
                                                            │ (mTLS / Federated OIDC / Zero-Escrow Split Triggers)
                                                            ▼
  +--------------------------------------------------------------------------------------------------------------------+
  | LAYER 2: FEDERATED STATUTORY IDENTITY, CORPORATE, TAX & TREASURY FOUNDATION BRIDGES                                |
  | • Authoritative Identity Resolution: NIMC (`NIN`), CAC (`RC`), NIBSS (`BVN`), NBA/MDCN/COREN Professional Rolls.   |
  | • Pass-Through Public Treasury Invariance: 100% direct remittance to CRF/Judiciary/IRS accounts (CFRN s. 121(3)).  |
  | • Zero Master-Database Duplication: Federated verification adapters preserving statutory custodian sovereignty.    |
  +---------------------------------------------------------+----------------------------------------------------------+
                                                            ▲
                                                            │ (SQLite WASM / HLC CRDT Delta Sync / IXPN Peering)
                                                            ▼
  +--------------------------------------------------------------------------------------------------------------------+
  | LAYER 1: SOVEREIGN EDGE COMPUTING, OFFLINE CONTINUITY & PHYSICAL RESILIENCE INFRASTRUCTURE                         |
  | • Offline-First Edge Execution: < 35 KB PWA shells + client-side SQLite WASM + Hybrid Logical Clock (HLC) CRDTs.   |
  | • Sovereign Data Residency: Nigerian Tier-III Data Center hosting & Lagos (LOS) / Abuja (ABV) IXPN local peering.  |
  | • Cyber-Physical & Industrial Telemetry Integrity: Tamper-evident sensor, smart-grid & facility audit logging.     |
  +--------------------------------------------------------------------------------------------------------------------+
```

---

## 3\. The Five Non-Negotiable Constitutional & Open-Commons Invariants

### Invariant 1: Preservation of Statutory Authority

- Every specification in `nigeriastack.org` MUST recognize the statutory agency established by Act of the National Assembly or State House of Assembly as the sole authoritative source of truth for its domain.  
- Adapters MUST query or verify against authoritative agency endpoints or issuer-signed W3C Verifiable Credentials and MUST NOT construct shadow national identity or corporate registries.

### Invariant 2: Preservation of Operational Continuity (`MECH-06` Defense)

- Any specification targeting sub-national public administration (36 States \+ FCT \+ 774 LGAs), healthcare clinics, agricultural collection centers, or lower courts MUST support disconnected, offline-first operation.  
- Systems MUST remain operable during grid power outages and 2G/3G cellular drops using client-side storage (`SQLite WASM`) and deterministic **Hybrid Logical Clock (HLC) Conflict-Free Replicated Data Types (CRDTs)**, flagging clock drift exceeding 300 seconds (`DEGRADED_LOCAL_HLC`) until NTP/GPS resynchronization.

### Invariant 3: Preservation of Evidentiary Integrity (`MECH-05` Defense)

- Every cross-institutional certificate, receipt, medical claim, land title extract, or certified court process defined by `nigeriastack.org` MUST satisfy **Section 84(1)–(4) and Section 106 of the Evidence Act 2011**.  
- Payloads MUST embed a verifiable `SureEvidence` block containing: (a) the SHA-256 binary digest, (b) the certifying device hardware fingerprint and operating state attestation, and (c) an Ed25519/FIDO2 cryptographic signature verifiable offline via a 300-DPI QR payload.

### Invariant 4: Preservation of Institutional & Fiscal Independence (`MECH-07` Defense)

- Pursuant to **Section 121(3) of the 1999 Constitution**, specifications for public revenue collection (court filing fees, probate assessments, land registry charges, state taxes) MUST enforce `platform_escrow_amount_kobo = 0`.  
- Statutory principal sums MUST route directly from the payer to the designated State Consolidated Revenue Fund (CRF), Judiciary Account, or Treasury Single Account (TSA), with any approved private TSP convenience fee split at source by the payment gateway.

### Invariant 5: Right to Exit, Non-Coercion & Zero-Lock-In Portability (RED-AUDIT-01)

- **No Digital Exclusion (Constitutional Service Access):** No citizen, litigant, trader, or smallholder farmer may be denied a constitutional or statutory service (court filing, civil registration, primary healthcare, or market stall operation) solely for lacking a smartphone, data plan, or biometric token. Every digital building block MUST maintain a non-penalized offline (`KioskBase` / USSD `*347*#`) and paper-assisted registry fallback.  
- **\< 60-Second Consent Revocation SLA:** Any Data Subject revoking a `ClearAm` consent token (`clm_` ULID) MUST have that revocation propagated across all participating gateways within 60 seconds (`HTTP 403 CLEARAM_ARTIFACT_REVOKED`).  
- **Zero-Cost Bulk Institutional Exit & Data Portability:** Any Federal MDA, State Government, State Judiciary, or Local Government Council (`774 LGAs`) terminating a contract with a private Technical Service Provider (TSP) has an unconditional right to export 100% of its historical records, `SureEvidence` signatures, and `KioskBase` SQLite/PostgreSQL tables in open, unencrypted-at-export OASIS/W3C/JSON-LD formats at zero exit fee.

---

## 4\. The 12 Standardized Sovereign Building Blocks (`BB-01` to `BB-12`)

| Building Block ID | Canonical Name | Pan-Nigerian Protocol Anchor | Primary Failure Mechanisms Solved |
| :---- | :---- | :---- | :---- |
| **`BB-01`** | Federated Identity & Professional Roll Verification | `SureProof-ID` | `MECH-01` (Source-Access), `MECH-05` (Trust) |
| **`BB-02`** | Offline-First Sub-National Base Registry Kernel | `KioskBase` | `MECH-02` (Coverage), `MECH-06` (Offline) |
| **`BB-03`** | Asynchronous Signed Data Bus & Workflow Coordinator | `Confluence` (`Junction`) | `MECH-03` (Semantic), `MECH-04` (Transaction) |
| **`BB-04`** | Statutory Consent & Lawful-Purpose Mesh | `ClearanceMesh` (`ClearAm`) | `MECH-01` (Source-Access), `MECH-05` (Trust) |
| **`BB-05`** | Section 84 Evidentiary Trust & Hardware Signatures | `SureEvidence` (`SureProof`) | `MECH-05` (Trust/Provenance) |
| **`BB-06`** | Zero-Escrow Treasury Pass-Through & Micro-Settlement | `SplitDirect` | `MECH-04` (Transaction), `MECH-07` (Commercial) |
| **`BB-07`** | Decentralized Commerce, Catalog & Haulage Mesh | `OpenMarket` (`MarketLink`) | `MECH-04` (Transaction), `MECH-07` (Commercial) |
| **`BB-08`** | Multi-Party Cross-Border Trade & Port Corridor | `TradeCorridor` (`PassCargo`) | `MECH-03` (Semantic), `MECH-04` (Transaction) |
| **`BB-09`** | Patient-Consented Health & Verifiable Academic Records | `NDHX` & `SureLearn` | `MECH-03` (Semantic), `MECH-05` (Trust) |
| **`BB-10`** | Cadastral Polygon, Land Title & Lis Pendens Linker | `LandGuard` & `AgriTrust` | `MECH-01` (Source-Access), `MECH-05` (Trust) |
| **`BB-11`** | Machine-Readable Statutes (`urn:lex:ng:*`) & Policy-as-Code (LawTree AST / StatuteProof) | `LawTree AST` | `MECH-03` (Semantic), `MECH-08` (Implementation) |
| **`BB-12`** | Autonomous Agent Delegation & MCP Safety Sandbox | `Warrant & Mandate` (`GivePower`) | `MECH-04` (Transaction), `MECH-08` (Implementation) |

---

## 5\. Multi-Stakeholder Governance & The 6 Standards Working Groups

| WG ID | Working Group Name | Normative RFCs Owned | Primary Industry Sectors Served |
| :---- | :---- | :---- | :---- |
| **`WG-01`** | **Core Architecture, Confluence Transport & Workflow Continuity** | `NS-RFC-001` (Hourglass & 12 BBs) `NS-RFC-002` (`Confluence` Signed Async Transport) `NS-RFC-003` (Workflow State Machines & Safe Retry) | All 32 Industries (Cross-cutting transport, webhook verification, `unknown` state recovery, chaos test packs). |
| **`WG-02`** | **SureEvidence Cryptographic Trust, Legal ASTs & Admissibility** | `NS-RFC-005` (`SureEvidence` s. 84 Certificates & QR) `NS-RFC-013` (LawTree AST & Indigenous Legal AST) `NS-RFC-015` (NBA RPC Rule 39 Neutral Disposition Guard) | Judiciary (21), Identity/KYB (07), Insurance (03), Land Titles (17), Media/IP Rights (24), Security/PKI (29). |
| **`WG-03`** | **ClearanceMesh Privacy, Open Finance & Fiscal Invariance** | `NS-RFC-006` (`ClearAm` NDPA Consent Envelopes) `NS-RFC-009` (CFRN s. 121(3) Treasury Pass-Through & NRS e-Invoice) `NS-RFC-014` (Privacy-Preserving Fraud & CAMARA Signals) | Payments (01), Banking/Lending (02), Capital Markets (04), Tax/IGR (05), ERP (06), Payroll/Pensions (08), Telecom (25–26). |
| **`WG-04`** | **OpenMarket Commerce, Logistics, Trade & Agrarian Corridors** | `NS-RFC-007` (`MarketLink` Decentralized Commerce & Haulage) `NS-RFC-010` (`PassCargo` Customs & Port Interop) `NS-RFC-012` (`AgriTrust` Farm Polygons & Warehouse Receipts) | Logistics (09), Trade/Ports (10), Retail (11), Fleets/Mobility (13–14), Agriculture (15), Climate (18), Travel/Food (22–23). |
| **`WG-05`** | **KioskBase Sub-National Registries, Health, Education & Smart Grids** | `NS-RFC-004` (`KioskBase` Offline SQLite WASM & HLC-CRDT) `NS-RFC-011` (`NDHX` HL7 FHIR Health & `SureLearn` Academic VCs) `NS-RFC-016` (Smart-Grid Metering, Industrial IoT & Grid Postcodes) | Energy/Utilities (12), Manufacturing IoT (16), Land/Construction (17), Healthcare (19), Education (20), Geospatial (28). |
| **`WG-06`** | **GivePower Agentic AI Delegation, MCP Sandboxing & Conformance** | `NS-RFC-008` (`GivePower` Agent Delegation & MCP Profiles) | AI & Indigenous Languages (27), Developer Infrastructure (30), Data Products (31), Autonomous Agent Tools (32). |

---

## 6\. Programmatic Non-Impersonation & JSON-LD Provenance Contract

Every HTML5 document and web route under `nigeriastack.org` MUST include the following immutable DOM banner and JSON-LD structured data block:

```html
<aside
  role="region"
  aria-label="Sovereign Non-Impersonation and Institutional Demarcation Notice"
  data-slot-id="ngstack.global.non_impersonation_banner"
  data-claim-authority="NS-GOV-2026-KB01-V2"
  class="ns-non-impersonation-bar"
>
  <strong>[✓ OPEN STANDARDS COMMONS]</strong>
  <span>
    <strong>nigeriastack.org</strong> is an independent, whole-of-economy open technical specification and conformance commons aligned with FMCIDE and NITDA interoperability frameworks. It is <strong>not</strong> a statutory federal agency, payment gateway, commercial API marketplace, or proprietary vendor product catalogue.
  </span>
</aside>
```

---

## 8\. Accredited Reference Implementations & Ecosystem Registry Rules (QA-NS1-03 & QA-NS1-06 Patch)

### 8.1 Clean-Room Statutory AST Naming Update (`QA-NS1-03`)

- In Section 4 (`BB-11`), the protocol anchor is normalized from `LawTree AST / StatuteProof (urn:ngstack:lawtree:v2026)` to **`LawTree AST` (Lingua Franca Tag: `StatuteProof`, Namespace: `urn:ngstack:lawtree:v2026`)**, which implements the OASIS Akoma Ntoso 3.0 XML/JSON standard (`urn:lex:ng:*`) while strictly upholding the Gate NS-G1 ban on `-NG` suffixes in protocol names.

### 8.2 Objective Conformance Accreditation Rules (`QA-NS1-06`)

To reinforce the Four-Wall Anti-Capture Firewall, no public agency or private enterprise (whether NIBSS, Paystack, Flutterwave, Moniepoint, Remita, Shipbubble, Termii, Dojah, Prembly, Helium Health, Curacel, Workpay, or MIDL concessions) may be listed in the **Accredited Reference Implementations Registry** without satisfying three objective criteria:

5. **100% Automated ITB Conformance:** The implementation MUST pass 100% of the Gherkin BDD scenarios and failure-recovery test packs for its target Building Block (`BB-01` through `BB-12`) via `npx @nigeriastack/conformance-cli`.  
6. **Signed Conformance Attestation Receipt:** The test run MUST emit a cryptographically signed SHA-256 attestation manifest published to the `nigeriastack/conformance-test-bed` repository.  
7. **Equal Parity Presentation:** Accredited implementations MUST be displayed in deterministic alphabetical or chronological attestation order—never ranked by commercial sponsorship, equity affiliation, or paid placement.

---

## 9\. The Five Tests of Open-Commons DPI & Build Verification Matrix (RED-AUDIT-02 to RED-AUDIT-06 Patch)

### 9.1 CC0-1.0 Public Domain Dedication (`02 Code` & `RED-AUDIT-02`)

All normative specifications (`NS-RFC-001` through `NS-RFC-014`), OpenAPI 3.1.1 contracts, JSON Schema 2020-12 definitions, and 32-Industry / 774-LGA Gap Atlas datasets are dedicated to the public domain under **CC0-1.0 Universal (Public Domain Dedication)** so any public agency, state, LGA, or developer can adopt, fork, or self-host them with zero attribution-chain litigation risk. Reference SDKs (`JoinBody`) are dual-licensed under **Apache-2.0 OR MIT**.

### 9.2 The Five Tests Scorecard (`01 Exit`, `02 Code`, `03 Audit`, `04 Govern`, `05 Fork`)

8. **01 Exit (Right to Exit):** \< 60s `ClearAm` consent revocation SLA; zero-cost bulk data export for states/LGAs switching TSPs; mandatory USSD/offline/paper fallback so no citizen is excluded.  
9. **02 Code (True Open Source):** CC0-1.0 Public Domain specifications \+ Apache-2.0/MIT `JoinBody` reference SDKs (`sure-evidence-crypto`, `clearam-guard`, `confluence-transport`, `kioskbase-crdt`, `lga-kiosk-kit`) buildable with zero proprietary SaaS dependencies.  
10. **03 Audit (Independent Public Verifiability):** Every registry node and `SplitDirect` treasury gateway emits an append-only SHA-256 Merkle Transparency Log (`/v1/audit/merkle-root`) enabling external auditors and civic monitors to verify zero record tampering and zero kobo diversion without privileged database access.  
11. **04 Govern (Multi-Stakeholder Accountability):** Tripartite Working Groups (`WG-01..06`), mandatory Conflict-of-Interest disclosures, a public RFC dissent archive, and an emergency specification sunset/remedy procedure if any standard causes downstream harm.  
12. **05 Fork (Federated Self-Hosting Without Central Gatekeeping):** Decentralized `did:web` (`/.well-known/ngstack-keys.json`) public-key discovery allowing any State Judiciary, LGA Council, bank, or TSP to fork the repository, self-host on its own domain, and verify Ed25519 signatures without requesting a central API key from `nigeriastack.org`.

### 9.3 The `dpi/build` Four-Pillar Evaluation Matrix

Every Building Block (`BB-01..12`), Protocol, and 774-LGA Module (`LGA-01..14`) page on `nigeriastack.org` MUST expose four standardized build tabs: **(1) Evidence** (empirical gap mechanism `MECH-01..08` & provenance status), **(2) Components** (OpenAPI 3.1.1, JSON Schema 2020-12 & `JoinBody` SDK packages), **(3) Framework** (statutory citations & constitutional invariants), and **(4) Methods** (executable Gherkin ITB scenarios & chaos test fixtures).
