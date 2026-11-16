# **NS-KB-12: Content Authority, 5-Level Precedence Hierarchy & Information Architecture Charter**

| Metadata Field | Value |
| :---- | :---- |
| **Document ID** | `NS-CONTENT-PRECEDENCE-KB12-V2026.6.5` |
| **Canonical Path** | `docs/content/authority-and-precedence.md` |
| **Governing Skill Harness** | `NS-SH-03` (Blueprint Content & RAG/AEO Experience Architect) |
| **Verification Gate** | `Gate NS-G3` (Deterministic Conflict-Resolution Order, Zero Unbound Marketing Copy, & Mandatory H1–H4 / `{copy_slot}` Binding) |
| **License** | `CC0-1.0 Universal (Public Domain Dedication)` |

---

# **1\. The 5-Level Content & Specification Precedence Hierarchy (Conflict-Resolution Rule)**

Whenever any discrepancy arises between a UI wireframe, a webcopy paragraph, a localized translation string, an OpenAPI/JSON Schema contract, or a statutory mandate, compilers, reviewers, and automated CI gates (`Gates NS-G1` through NS-G6) MUST resolve the conflict strictly in this descending order of authority:

```
                NIGERIASTACK.ORG — 5-LEVEL DETERMINISTIC AUTHORITY & PRECEDENCE HIERARCHY
[LEVEL 1 — SUPREME AUTHORITY]: Nigerian Constitutional & Statutory Law + Supreme Court Judgments
• 1999 Constitution (as amended): ss. 6(5), 7(1), 36(3)–(4), 121(3), 162, First Schedule & Fourth Schedule
• Supreme Court LGA Financial Autonomy Judgment: AG Federation v. AG Abia State & 35 Ors (SC/CV/343/2024)
• Nigeria Data Protection Act (NDPA) 2023 ss. 24–43 & NDPC GAID 2025 | Evidence Act 2011 ss. 84 & 106
• NBA Rules of Professional Conduct (RPC) 2023 Rule 39 | Land Use Act 1978 s. 6 | FCCPA 2018
│
▼ (Overrides all lower levels)
[LEVEL 2 — NORMATIVE PROTOCOL & SCHEMA AUTHORITY]: NS-RFC-001..014, OpenAPI 3.1.1, JSON Schema 2020-12 & OPA Rego
• Institutional Positioning Charter (NS-KB-01) & Four-Wall Anti-Capture Firewall + Five Tests (01 Exit–05 Fork)
• Clean-Room Pan-Nigerian Protocol Glossary (NS-KB-02) & verify-cleanroom-nomenclature.ts
• Normative Specifications NS-RFC-001 through NS-RFC-014 (NS-KB-05, NS-KB-06, NS-KB-07)
• Canonical OpenAPI 3.1.1, JSON Schema 2020-12 & Gherkin/OPA Rego ITB Contracts (NS-KB-08, NS-KB-09)
│
▼ (Overrides all lower levels)
[LEVEL 3 — CANONICAL EMPIRICAL & RAG TRUTH]: Audited JSON Ledgers, 15 FAQs & 15 H2 RAG/GEO/AEO Benchmarks
• Master 32-Industry & 8-Mechanism Capability Ledger (master-32-industry-matrix.json — NS-KB-03A)
• 36-State + FCT 8-Dimension Atlas & 774-LGA Registry (NS-KB-03B, NS-KB-03C, NS-KB-03D)
• Canonical 15-Question Whole-of-Society Audited FAQ (audited-faq-nigeriastack-15.json — NS-KB-12)
• Canonical 15 H2 Query-Answer RAG/GEO/AEO Benchmarks (rag-geo-aeo-15-benchmarks.json — NS-KB-13)
│
▼ (Locks exact H1–H4 headings & {copy_slot} IDs)
[LEVEL 4 — DESIGN TOKENS, {copy_slot} CONTRACTS & 4-VIEWPORT WIREFRAMES]: W3C DTCG & Swiss Blueprints
• W3C DTCG Design Tokens (nigeriastack.dtcg.tokens.json — NS-KB-04A) & validate-tokens.sh
• Production Webcopy Decks & Wireframe {copy_slot} Tables (NS-KB-10 & NS-KB-11)
• Annotated 4-Viewport (1440px / 768px / 390px / 320px) ASCII Wireframes (NS-KB-14 & NS-KB-15)
│
▼ (Consumes Level 1–4 artifacts with zero ad-hoc overrides)
[LEVEL 5 — RENDERED UI & LOCALISATION BUNDLES]: HTML5 Artboards, TanStack Start App & 5-Locale Strings
• Hi-Fi Interactive HTML5 Blueprint Artboards (NS-KB-17 & NS-KB-18) & Apps/Web Shell (NS-KB-20C)
• 5-Locale Bundles (en-NG, ha-NG, yo-NG, ig-NG, pcm-NG) gated by reviewState == "LEGAL_SEMANTIC_REVIEW_APPROVED"
```

````

---

## 2. Master Website Sitemap & Content Architecture Tree (`https://nigeriastack.org`)

Every public route, dynamic parameter, H1–H2 hierarchy, and `{copy_slot}` namespace is governed by this single Information Architecture tree:

```text
https://nigeriastack.org/
│
├── [GLOBAL PERSISTENT CHROME — Rendered on 100% of Routes]
│   ├── Top Bar: {ngstack.global.non_impersonation_banner} ([✓ OPEN STANDARDS COMMONS • CC0-1.0 PUBLIC DOMAIN])
│   ├── Header Nav: [Architecture /] [32 Industries /sectors] [Protocols & 774-LGA /protocols] [14 RFCs /rfcs]
│   │               [ITB Verifier /conformance] [36-State & 774-LGA Atlas /atlas] [Governance & FAQ /governance]
│   │               [Locale: EN-NG | HA-NG | YO-NG | IG-NG | PCM-NG] [Lite Mode: <35KB ON]
│   └── Footer: CC0-1.0 Public Domain • Five Tests (01 Exit..05 Fork) • Daily Merkle Root • github.com/nigeriastack
│
├── 1. ROUTE 1: / (Home — 5-Layer Vendor-Neutral Hourglass & 12 Building Blocks Explorer)
│   ├── H1: {home.hero.h1} (Defining Proposition)
│   ├── H2 [RAG-H2-01]: What is Nigeria Stack and how does it stay independent of government agencies and private vendors?
│   ├── H2 [RAG-H2-02]: How do the five layers of the Nigeria Stack connect public registries and private sector apps without centralizing databases?
│   └── H2 [RAG-H2-03]: How does Nigeria Stack guarantee citizens' right to exit, open-source code, public audits, and self-hosting?
│
├── 2. ROUTE 2: /sectors & /sectors/:sector_slug/:industry_id (8 Macro-Sectors & 32-Industry Gap Ledger)
│   ├── H1: {sectors.header.h1} (Whole-of-Economy 32-Industry Capability Baseline & 8-Mechanism Gap Atlas)
│   ├── H2 [RAG-H2-04]: What are the eight everyday digital bottlenecks slowing down Nigeria's 32 industries?
│   └── H2 [RAG-H2-05]: How does Nigeria Stack work alongside existing Nigerian payment, identity, logistics, and health platforms?
│
├── 3. ROUTE 3: /protocols & /protocols/:protocol_slug (Clean-Room Pan-Nigerian Protocol Suite & 14 LGA Modules)
│   ├── /protocols/sure-evidence      -> H2 [RAG-H2-06]: Plain-language protocol guide (Digital Evidence)
│   ├── /protocols/clearam-consent    -> H2 [RAG-H2-07]: Plain-language protocol guide (Personal Data Consent)
│   ├── /protocols/confluence-gateway -> H2 [RAG-H2-08]: Plain-language protocol guide (Safe Retries)
│   ├── /protocols/marketlink-commerce-> H2 [RAG-H2-09]: Plain-language protocol guide (Open Commerce)
│   ├── /protocols/givepower-agents   -> H2 [RAG-H2-10]: Plain-language protocol guide (Safe AI Agents)
│   ├── /protocols/kioskbase-registries-> H2 [RAG-H2-11]: Plain-language protocol guide (Offline Registries)
│   ├── /protocols/lawtree-ast        -> H2 [RAG-H2-12]: Plain-language protocol guide (Multilingual Digital Laws)
│   └── /protocols/lga-governance-stack (Parent + 14 Explicit Fourth-Schedule Sub-Routes LGA-01..LGA-14)
│       ├── H2 [RAG-H2-13]: How does the 774 Local Government Stack deliver constitutional municipal services and route revenue directly to local council treasuries?
│       └── Sub-Routes: /lga-01-council-complain .. /lga-14-street-grid
│
├── 4. ROUTE 4: /rfcs & /rfcs/:rfc_id (Split-Pane Normative Standards Track Reader: NS-RFC-001 to NS-RFC-014)
│   ├── H1: {rfcs.header.h1}
│   └── Split-Pane View: Left Col (Normative RFC 2119 Prose) + Right Col (Live OpenAPI 3.1.1 / JSON Schema 2020-12 / Sequence Inspector)
│
├── 5. ROUTE 5: /conformance (Self-Service Interoperability Test Bed [ITB], Browser WASM Verifier & Chaos Runner)
│   ├── H1: {conformance.header.h1}
│   └── H2 [RAG-H2-14]: How can ministries, states, local councils, banks, and developers test and certify their systems for free in the browser?
│
├── 6. ROUTE 6: /atlas, /atlas/states/:state_code & /atlas/lga-774/:state_code/:lga_code (Sub-National Readiness Atlas)
│   ├── H1: {atlas.states.h1} & {atlas.lga774.h1}
│   └── H2 [RAG-H2-15]: How does the Sub-National Readiness Atlas track digital public services across all 36 States, the FCT, and 774 Local Government Areas without fabricated rankings?
│
└── 7. ROUTE 7: /governance (Institutional Charter, Five Tests Scorecard, 6 Working Groups, Playbooks A–E & 15 Canonical FAQs)
    ├── H1: {governance.header.h1}
    └── Sections: Four-Wall Firewall • Five Tests Table • WG-01..06 • Playbooks A–E • 15 Canonical Whole-of-Society FAQs
````

---

# **3\. Mandatory 5-Locale Legal-Semantic Gate (`en-NG`, `ha-NG`, `yo-NG`, `ig-NG`, `pcm-NG`)**

1. Every string in `locales/{en-NG,ha-NG,yo-NG,ig-NG,pcm-NG}/messages.json` MUST carry a deterministic `reviewState`:  
   * `"DRAFT_UNPUBLISHED"`  
   * `"LINGUISTIC_REVIEW_PASSED"`  
   * `"LEGAL_SEMANTIC_REVIEW_APPROVED"`  
2. **Hard Rendering Rule (`NS-RFC-013`):** If a user selects `ha-NG`, `yo-NG`, `ig-NG`, or `pcm-NG` and a specific statutory or consent slot is not yet `"LEGAL_SEMANTIC_REVIEW_APPROVED"`, the UI MUST display the approved `en-NG` statutory text alongside a clear `[! LINGUISTIC PREVIEW — AUTHORITATIVE STATUTORY TEXT IN ENGLISH]` badge.  
3. **Container Expansion Budget (`Gate NS-G4`):** All UI buttons, badges, and table headers in `NS-KB-10` and `NS-KB-11` are budgeted for **\+35% character expansion** so Hausa, Yoruba, Igbo, and Pidgin strings never clip or overflow on `320px` viewports.

---

# **4\. Anti-Backend-Bleed Demarcation, Human-First Civic Translation Table & Regenerated H1–H4 Page Outlines (v2026.6.5)**

## **4.1 The Anti-Backend-Bleed Rule (GOV.UK / USWDS / eGov DIGIT Benchmark)**

* Public-facing H1–H4 headings, navigation bars, filter pills, and citizen/executive copy MUST NEVER expose raw database column names (`platform_escrow_amount_kobo == 0`), ULID prefixes (`clm_`, `s84_`, `cop_`, `kbd_`), internal gap mechanism codes (`MECH-01..08`), or building-block serials (`BB-01..12`) as primary user-facing text.  
* Raw JSON Schema properties, OpenAPI 3.1.1 paths, ULID regexes, and OPA Rego code are isolated strictly inside secondary **Technical Specification Drawers** and the `/rfcs` / `/conformance` developer split-pane tabs.

## **4.2 Human-First Civic Translation Table (Backend Primitive \-\> Customer-Facing Label)**

| Backend Primitive / Technical ID | Customer-Facing Civic Label |
| :---- | :---- |
| `SplitDirect (platform_escrow_amount_kobo == 0)` | **100% Direct Treasury Payments (Zero Middleman Holding)** |
| `SureEvidence (s84_ ULID)` | **Court-Admissible Digital Seals & Instant QR Verification (Evidence Act Section 84\)** |
| `ClearanceMesh / ClearAm (clm_ ULID)` | **Citizen-Controlled Data Consent & 60-Second Revocation (NDPA 2023\)** |
| `KioskBase (<35 KB SQLite WASM / HLC-CRDT)` | **Offline-First Local Registry & 2G USSD Access (\*347\*LGA\#)** |
| `Confluence (cop_ ULID / UNKNOWN_TIMEOUT)` | **Safe Payment & Filing Retries (Zero Double-Debiting on Network Drops)** |
| `OpenMarket / MarketLink` | **Open Digital Markets & Direct Haulage Booking (Zero Monopoly Commissions)** |
| `GivePower (READ_ONLY_DEFAULT / x402)` | **Human-Approved AI Assistants & Protected Micro-Payments** |
| `MECH-01..08` | **The Eight Everyday Digital Bottlenecks** (1. Access Restrictions to Official Source Data, 2\. Limited State & Local Government Digital Coverage, 3\. Mismatched Data Formats Across Systems, 4\. Multi-Party Payment & Settlement Delays, 5\. Forged Paper Certificates & Privacy Gaps, 6\. Power Outages & 2G Network Drops, 7\. High Platform Commissions & Foreign-Currency Fees, 8\. Static Paper Laws Without Developer Tools) |

## **4.3 Regenerated H1–H4 Page Content Outlines Across All 7 Canonical Routes (https\://nigeriastack.org)**

### **Route 1 (/ — Home)**

* **H1:** Make Nigeria's digital systems work together without surrendering statutory authority, operational continuity, evidentiary integrity, or institutional independence  
* **H2 (RAG-H2-01):** What is Nigeria Stack and how does it stay independent of government agencies and private vendors?  
* **H2 (RAG-H2-02):** How do the five layers of the Nigeria Stack connect public registries and private sector apps without centralizing databases?  
* **H2 (RAG-H2-03):** How does Nigeria Stack guarantee citizens' right to exit, open-source code, public audits, and self-hosting?

### **Route 2 (/sectors — 32 Industries)**

* **H1:** Whole-of-economy 32-industry digital capability directory and integration ledger  
* **H2 (RAG-H2-04):** What are the eight everyday digital bottlenecks slowing down Nigeria's 32 industries?  
* **H2 (RAG-H2-05):** How does Nigeria Stack work alongside existing Nigerian payment, identity, logistics, and health platforms?

### **Route 3 (/protocols & 14 Local Government Modules)**

* **H1:** Open pan-Nigerian protocols and the 14 Local Government digital service standards  
* **H2 (RAG-H2-06..12):** Plain-language protocol guides (Digital Evidence, Personal Data Consent, Safe Retries, Open Commerce, Safe AI Agents, Offline Registries, and Multilingual Digital Laws)  
* **H2 (RAG-H2-13):** How does the 774 Local Government Stack deliver constitutional municipal services and route revenue directly to local council treasuries? (Sub-routes 1–14: Grievance Redress, Building Permits, Rural Water & WASH, Market & Trade Licensing, Birth & Death Records, Indigene & Residency Attestation, Safety Inspections, Ward Public Works, Property Tenement Rates, Park & Market Revenue Collection \+ Inter-LGA Haulage Pass, Ward Primary Healthcare, Direct Treasury Ledger, Customary & Area Court Records, and Digital Street Addressing)

### **Route 4 (/rfcs)**

* **H1:** Nigeria Stack Open Standards Registry & Public Specifications (Plain-Language Overview on Left \+ Technical Schema Drawer on Right)

### **Route 5 (/conformance)**

* **H1:** National Interoperability Test Bed: Free browser-based verification and offline network testing  
* **H2 (RAG-H2-14):** How can ministries, states, local councils, banks, and developers test and certify their systems for free in the browser?

### **Route 6 (/atlas/states & /atlas/lga-774)**

* **H1:** Sub-National Digital Infrastructure Atlas: 36 States, FCT, and 774 Local Government Areas service readiness explorer  
* **H2 (RAG-H2-15):** How does the Sub-National Readiness Atlas track digital public services across all 36 States, the FCT, and 774 Local Government Areas without fabricated rankings?

### **Route 7 (/governance)**

* **H1:** Ecosystem governance, institutional safeguards framework, open public standards, and collaborative working groups
