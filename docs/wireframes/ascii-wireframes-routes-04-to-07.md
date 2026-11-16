# **NS-KB-15: 4-Viewport Swiss-Blueprint Annotated ASCII Wireframes (Routes 4 to 7 \+ 36-State & 774-LGA Explorer) — Remediated v2026.6.5**

* **Document ID:** `NS-WIREFRAMES-ASCII-KB15-V2026.6.5`  
* **Canonical Path:** `docs/wireframes/ascii-wireframes-routes-04-to-07.md`  
* **Governing Skill Harness:** `NS-SH-04` (Swiss-Blueprint 4-Viewport Wireframe Designer — Pattern B Co-Evolution Peer with `NS-SH-03`)  
* **Upstream Authority:** `NS-KB-04A` (W3C DTCG Tokens), `NS-KB-10` & `NS-KB-11` (Routes 4–7 Webcopy & `{copy_slot}` Contracts), `NS-KB-12` (5-Level Precedence Charter & Sitemap Tree), `NS-KB-13` (`RAG-H2-14` & `RAG-H2-15` Benchmarks)  
* **Verification Gate:** `Gate NS-G4` (4 Viewports `1440px` / `768px` / `390px` / `320px`; Zero Horizontal Overflow `scrollWidth <= clientWidth`; `>= 44x44px` Touch Targets; Mandatory Accessible Table Companion; \+35% 5-Locale Expansion Budget)  
* **License:** `CC0-1.0 Universal (Public Domain Dedication)`

---

# **1\. ROUTE 4 (`/rfcs` & `/rfcs/:rfc_id`) — Split-Pane Normative Standards Track Reader (`NS-RFC-001` to `NS-RFC-014`)**

## **1.1 Viewport 1: Desktop `1440px` (12-Col Dual-Pane: Civic Rules Pane ¦ Schema Code Pane)**

```
+======================================================================================================================+
| [A1] {ngstack.global.non_impersonation_banner}  •  [A2] HEADER NAV (Active: [/rfcs 14-RFCs])                         |
+======================================================================================================================+
| [B1] RFC SELECTOR & NORMATIVE FILTER BAR (height: 56px • surface.well #EEF3EF • border-bottom: 1px #D4DDD7)          |
| [RFC Selector: NS-RFC-014: LgaGovernanceStack (774 LGAs) v]  Filter Normative Keywords: [All] [MUST (18)] [SHALL (9)]|
| [MUST NOT (7)]  •  License: [✓ CC0-1.0 PUBLIC DOMAIN]  •  WG: [WG-05 & WG-03]  •  [Download Markdown] [Fork on GitHub]|
+======================================================================================================================+
| [C1] LEFT PANE: CIVIC & LEGAL PROSE (Col 1–6: 660px)       ¦ [C2] RIGHT PANE: LIVE TECHNICAL SCHEMA CODE (660px)     |
| (surface.panel #FFFFFF • reading-measure: <=65ch)          ¦ (surface.terminal #0D1512 • ink: #F8FAF8 • JetBrainsMono)|
|------------------------------------------------------------+---------------------------------------------------------|
| H1: NS-RFC-014 — LgaGovernanceStack:                       ¦ [Tab 1: JSON Schema 2020-12] [Tab 2: OpenAPI 3.1.1]     |
| 774 Constitutional LGAs & 6 FCT Area Councils Specification¦ [Tab 3: OPA Rego Guard]      [Tab 4: Five-Tests Proof]  |
|                                                            ¦---------------------------------------------------------|
| § 5.1 Direct Treasury Settlement Rule                      ¦ // specs/schemas/json-schema-2020-12/                   |
| 100% of local government and court fees settle directly    ¦ // LgaGovernanceServiceEnvelope.schema.json             |
| into the official council or judiciary bank account with   ¦ {                                                       |
| zero private middleman holding or escrow intermediary.     ¦   "$id": "https://nigeriastack.org/schemas/v2026/...",  |
| Every implementation across Nigeria's 774 LGAs [MUST]      ¦   "required": [                                         |
| support offline-first KioskBase (< 35 KB PWA / USSD).      ¦     "envelopeUlid", "lgaCode", "moduleId",              |
|                                                            ¦     "kioskBaseDeltaId", "splitDirectTreasuryProof"      |
| § 5.2 Supreme Court SC/CV/343/2024 Treasury Guarantee      ¦   ],                                                    |
| All market fees and rates [MUST] enforce zero platform     ¦   "properties": {                                       |
| escrow (`platform_escrow_amount_kobo == 0`) and zero       ¦     "lgaCode": { "pattern": "^[A-Z]{2}-LGA-[0-9]{2}$" },|
| state escrow (`state_intermediary_escrow_kobo == 0`).      ¦     "splitDirectTreasuryProof": {                       |
|                                                            ¦       "platformEscrowAmountKobo": { "const": 0 },  <--  |
| § 5.4 Grassroots Safeguards                                ¦       "stateIntermediaryEscrowKobo": { "const": 0 } <-- |
| • Inter-LGA Commercial Transit QR Pass (<50ms scan)        ¦     }                                                   |
| • 72-Hour IndigeneProof SLA & *347*LGA# USSD Vouching      ¦   }                                                     |
| • Customary Certificate of Occupancy Docket Check          ¦ }                                                       |
| [Run Conformance Test on NS-RFC-014 -> (44px)]             ¦ [Copy Schema JSON (44px)]  [Test in WASM Verifier ->]   |
+======================================================================================================================+
```

```
1.2 Viewport 2: Tablet 768px (8-Col Segmented Top Switcher: Civic View ¦ Code View)
+=============================================================================+
| [A1] HEADER NAV & NON-IMPERSONATION BANNER (height: 52px)                   |
+=============================================================================+
| [B1] RFC SELECTOR & KEYWORD FILTERS (stacked 2-row layout)                  |
| [RFC Selector: NS-RFC-014: LgaGovernanceStack v]                            |
| Filter: [All Keywords] [MUST (18)] [SHALL (9)] [MUST NOT (7)]                |
+=============================================================================+
| [C1] STICKY VIEW SEGMENTED SWITCHER (height: 44px • full-width 768px)       |
| [ Civic & Legal Rules (Active) ]  ¦  [ Live Technical Schema Code ]         |
+=============================================================================+
| [D1] ACTIVE VIEW CONTENT AREA (reading-measure: <=65ch • 768px padded)     |
| H1: NS-RFC-014 — LgaGovernanceStack: 774 Constitutional LGAs Specification    |
|                                                                             |
| § 5.1 Direct Treasury Settlement Rule                                       |
| 100% of local government and court fees settle directly into the official   |
| council or judiciary bank account with zero private middleman holding.      |
|                                                                             |
| § 5.2 Supreme Court SC/CV/343/2024 Treasury Guarantee                       |
| All market fees and rates [MUST] enforce zero platform escrow and zero      |
| state escrow intermediaries.                                                |
|                                                                             |
| [Run Conformance Test on NS-RFC-014 (min-height: 44px)]                      |
+=============================================================================+
```

```
1.3 Viewport 3: Mobile 390px (4-Col Single Column Prose + Inline Collapsible Technical Code Drawer)
+=========================================+
| [A1] NAV HEADER & BANNER (390px)        |
+=========================================+
| [B1] NS-RFC-014 SPECIFICATION           |
| H1: LgaGovernanceStack: 774 LGAs        |
|-----------------------------------------|
| § 5.1 Direct Treasury Settlement        |
| 100% of fees settle directly into the   |
| official council bank account with zero |
| private middleman holding.              |
|                                         |
| [> View Technical JSON Schema (44px)]   |
| v [Expanded Technical Code Drawer]      |
|   {                                     |
|     "lgaCode": "LA-LGA-11",             |
|     "platformEscrowKobo": 0             |
|   }                                     |
|-----------------------------------------|
| § 5.2 Supreme Court SC/CV/343/2024      |
| Direct statutory allocation invariant.  |
|                                         |
| [Run Conformance Test (100% Width)]     |
+=========================================+
```

```
1.4 Viewport 4: 2G Lite / 400% Zoom 320px (2-Col Ultra-Compact Prose)
+==============================+
| [A1] NAV BANNER (320px)      |
+==============================+
| NS-RFC-014 SPECIFICATION     |
|------------------------------|
| § 5.1 Direct Settlement      |
| 100% of fees settle direct to|
| official council bank account|
| with zero private holding.   |
|                              |
| [> Tech Schema Drawer (48px)]|
|------------------------------|
| § 5.2 SC/CV/343/2024 Rule    |
| Zero escrow requirement.     |
|                              |
| [Run Test (Full Width 48px)] |
+==============================+
```

---

# **2\. ROUTE 5 (`/conformance`) — Free Browser Verification Sandbox & Offline Network Simulator**

## **2.1 Viewport 1: Desktop `1440px` (12-Col Dual-Pane: Civic Test Selector & File Dropzone on Left ¦ Live Browser Verification Verdict & Developer JSON Drawer on Right)**

```
+======================================================================================================================+
| [A1] {ngstack.global.non_impersonation_banner}  •  [A2] HEADER NAV (Active: [/conformance Conformance Verifier])      |
+======================================================================================================================+
| [B1] CIVIC TEST SUITE SELECTOR & PROOF TABS (height: 56px • surface.well #EEF3EF • border-bottom: 1px #D4DDD7)       |
| Select Civic Test Suite: [1. Digital Evidence Seal] [2. Citizen Data Consent] [3. 100% Direct Council & Court Settlement]|
|                          [4. Human-Approved AI] [5. Safe Network Retry]                                              |
+======================================================================================================================+
| [C1] LEFT PANE: INPUT DATA & DROPZONE (Col 1–6: 660px)     ¦ [C2] RIGHT PANE: LIVE BROWSER VERIFICATION VERDICT    |
| (surface.panel #FFFFFF • min-height: 480px)                 ¦ (surface.well #EEF3EF • border-left: 1px #D4DDD7)      |
|------------------------------------------------------------+---------------------------------------------------------|
| H2: Civic Test Suite #3: Direct Treasury Settlement        ¦ VERDICT SUMMARY:                                        |
| Paste JSON Payload or Drag & Drop Verification Envelope:   ¦ [✓ PASSED] 5/5 Statutory Tests Succeeded                |
| +--------------------------------------------------------+ ¦ Execution: Local WASM Verifier (0ms network delay)      ¦
| | {                                                      | ¦ Storage: Zero Server Storage • 100% Client-Side Private │
| |   "envelopeUlid": "01J8X9N2M1K3P4Q5R6S7T8U9V0",        | ¦---------------------------------------------------------|
| |   "lgaCode": "LA-LGA-11",                              | ¦ STATUTORY GUARANTEE MATRIX:                             |
| |   "splitDirectTreasuryProof": {                        | ¦ • Council Bank Account Settlement Direct: [✓ PASSED]    │
| |     "platformEscrowAmountKobo": 0,                     | ¦ • Zero Platform Middleman Intermediary:   [✓ PASSED]    │
| |     "stateIntermediaryEscrowKobo": 0                   | ¦ • Zero State Intermediary Escrow Hold:   [✓ PASSED]    │
| |   }                                                    | ¦---------------------------------------------------------|
| | }                                                      | ¦ [Tab 1: Human Audit Report] [Tab 2: Raw Verification JSON]|
| +--------------------------------------------------------+ ¦---------------------------------------------------------|
| [Verify Data in Browser (Free • Zero Server Storage)]      ¦ [Download Verification Receipt JSON (44px CTA)]          |
+======================================================================================================================+
```

## **2.2 Viewport 2: Tablet `768px` (8-Col 2-Row Civic Test Pills \+ Stacked Verification Pane)**

```
+=============================================================================+
| [A1] HEADER NAV & NON-IMPERSONATION BANNER (height: 52px)                   |
+=============================================================================+
| [B1] CIVIC TEST SUITE SELECTOR PILLS (2-Row Wrap)                           |
| [1. Evidence Seal] [2. Data Consent] [3. 100% Direct Settlement (Active)]    |
| [4. Human-Approved AI] [5. Safe Retry]                                      |
+=============================================================================+
| [C1] INPUT PAYLOAD AREA (768px Padded • min-height: 200px)                  |
| Paste Payload or Upload Envelope File:                                      |
| [ Valid Direct Treasury Split Payload Sample v ]                            |
| [Verify Data in Browser (100% Width • 44px)]                                |
+=============================================================================+
| [D1] LIVE BROWSER VERIFICATION VERDICT PANE (Stacked)                       |
| VERDICT: [✓ PASSED] 5/5 Statutory Invariants Verified                      |
| Client WASM Engine • Zero Server Storage Guarantee                          |
| [Download Verification Receipt JSON (44px CTA)]                             |
+=============================================================================+
```

* 

```
+=========================================+
| [A1] NAV HEADER & BANNER (390px)        |
+=========================================+
| Select Civic Test Suite:                |
| [ 3. 100% Direct Settlement Test  v ]   |
|-----------------------------------------|
| Sample Payload:                         |
| [ Valid Direct Treasury Split     v ]   |
|                                         |
| [Verify data in browser (100% width)]   |
|-----------------------------------------|
| VERDICT OUTPUT:                         |
| [✓ PASSED] 5/5 Tests Passed             |
| Zero Server Storage • 100% Local WASM   |
|                                         |
| [Download Receipt JSON (48px)]          |
+=========================================+
```

* 

```
2.4 Viewport 4: 2G Lite / 400% Zoom 320px (Ultra-Compact Form)
+==============================+
| [A1] NAV BANNER (320px)      |
+==============================+
| Civic Test Suite:            |
| [ 3. 100% Direct Split   v ] |
|------------------------------|
| [Verify data (Full Width)]   |
|------------------------------|
| VERDICT: [✓ PASSED] 5/5      |
| [Download Receipt (48px)]    |
+==============================+
```

---

---

# **3\. ROUTE 6 (`/atlas`, `/atlas/states/:state_code` & `/atlas/lga-774/:state_code/:lga_code`) — Sub-National 36-States \+ FCT & 774-LGA Readiness & Federation Explorer**

## **3.1 Viewport 1: Desktop `1440px` (Dual-Mode 36-State 8-Dimension Matrix \+ 774-LGA Drill-Down Explorer)**

```
+======================================================================================================================+
| [A1] {ngstack.global.non_impersonation_banner}  |  [A2] HEADER NAV (Active: [/atlas 36-States+774-LGA])              |
+======================================================================================================================+
| [B1] EVIDENCE DISCIPLINE GUARDRAIL BANNER (bg: #FEF3C7 ink: #78350F):                                                |
| [! EVIDENCE DISCIPLINE GUARDRAIL] State and 774-LGA matrices display factual dimension statuses ([✓ Live Digital     |
| Service], [? Active Pilot Program], [0 Paper-Only Registry], [.. Not Yet Assessed]) only—never subjective scores.    |
+======================================================================================================================+
| [C1] ATLAS MODE SWITCHER & FILTERS (height: 56px | surface.well #EEF3EF):                                            |
| View Mode: [Tab A: 36 States + FCT] [Tab B: 774 Constitutional LGAs & 14 Modules (Active)]                            |
| Filter Zone: [All 6 Zones v] | State: [LA - Lagos State (20 LGAs) v] | LGA: [LA-LGA-11: Ikeja v] | [Search LGAs]    |
+======================================================================================================================+
| [D1] DYNAMIC STATE & LGA PROFILE HEADER:                                                                             |
| STATE: Lagos State (LA) • South-West Zone • Capital: Ikeja • 20 Constitutional LGAs                                 |
| ACTIVE COUNCIL: LA-LGA-11: Ikeja Local Government Council • Fourth-Schedule Profile                                  |
| [✓ 100% Direct Council Treasury Payment — Supreme Court SC/CV/343/2024 Compliant]                                    |
| [✓ Inter-LGA Commercial Vehicle QR Transit Pass Active (<1s Offline Scan)]                                          |
+======================================================================================================================+
| [E1] H2: How does the Sub-National Atlas track 8 DPI dimensions across 36 States, FCT, and 774 LGAs?                |
| MANDATORY ACCESSIBLE SORTABLE TABLE 1: 36 STATES + FCT 8-DIMENSION MATRIX                                            |
| +------+---------------+------------+------------+------------+------------+------------+------------+---------+---+
| | Code | State / FCT   | Zone       | Judiciary  | Land/GIS   | Direct Pay | Health     | Civil Reg  | OpenTrade   |
| +------+---------------+------------+------------+------------+------------+------------+------------+---------+---+
| | AB   | Abia State    | South-East | [0 Paper]  | [? Pilot]  | [✓ Live]   | [0 Paper]  | [0 Paper]  | [✓ Live]|...|
| | FC   | FCT Abuja     | N-Central  | [✓ Live]   | [✓ Live]   | [✓ Live]   | [? Pilot]  | [? Pilot]  | [✓ Live]|...|
| | LA   | Lagos State   | South-West | [✓ Live]   | [✓ Live]   | [✓ Live]   | [? Pilot]  | [? Pilot]  | [✓ Live]|...|
| +------+---------------+------------+------------+------------+------------+------------+------------+---------+---+
|----------------------------------------------------------------------------------------------------------------------|
| MANDATORY ACCESSIBLE SORTABLE TABLE 2: 774-LGA REGISTRY & 14 FOURTH-SCHEDULE MODULES                                 |
| +------------+--------------------+---------------+-------------------+--------------------------------------------+ |
| | LGA Code   | Constitutional LGA | Parent State  | 14-Module Wave    | Civic Safeguards & Direct Treasury Status  | |
| +------------+--------------------+---------------+-------------------+--------------------------------------------+ |
| | LA-LGA-11  | Ikeja              | Lagos (LA)    | Wave 1–3 Active   | 100% Direct Council Treasury Settled       | |
| +------------+--------------------+---------------+-------------------+--------------------------------------------+ |
| [Download 36-State Dataset JSON] [Download 774-LGA Registry JSON]                                                    |
+======================================================================================================================+
```

## **3.2 Viewport 2: Tablet `768px` (Side-by-Side Selectors ¦ Pinned Column Table)**

```
+=============================================================================+
| [A1] HEADER NAV & BANNER (768px)                                            |
+=============================================================================+
| [B1] SIDE-BY-SIDE JURISDICTION SELECTORS (Col 1–4 & Col 5–8)                 |
| State: [LA - Lagos State (20 LGAs) v] ¦ LGA: [LA-LGA-11: Ikeja v]           |
+=============================================================================+
| [C1] PINNED-COLUMN ACCESSIBLE TABLE (Left Col Pinned • Right Cols Scroll)    |
| +------------+---------------+----------------------+---------------------+ |
| | Pinned Code| Pinned Name   | Judiciary (Scroll ->)| Land/GIS (Scroll ->)| |
| +------------+---------------+----------------------+---------------------+ |
| | LA-LGA-11  | Ikeja         | [✓ Live Digital Serv]| [✓ Live Digital Serv| |
| +------------+---------------+----------------------+---------------------+ |
+=============================================================================+
```

## **3.3 Viewport 3: Mobile `390px` (Self-Contained 8-Dimension / 14-Module Civic Readiness Cards)**

```
+=========================================+
| [A1] NAV HEADER & BANNER (390px)        |
+=========================================+
| JURISDICTION READINESS CARD             |
| H2: LA-LGA-11 — Ikeja Local Council     |
| State: Lagos State (South-West)         |
|-----------------------------------------|
| CIVIC SAFEGUARD STATUS:                 |
| [✓ 100% Direct Council Treasury Payment |
|    Supreme Court SC/CV/343/2024 Passed] |
|-----------------------------------------|
| 8 DPI DIMENSION STATUSES:               |
| • Judiciary:  [✓ Live Digital Service]  |
| • Land/GIS:   [✓ Live Digital Service]  |
| • Direct Pay: [✓ Live Digital Service]  |
| • Health:     [? Active Pilot Program]  |
| • Civil Reg:  [? Active Pilot Program]  |
| • Open Trade: [✓ Live Digital Service]  |
|-----------------------------------------|
| [Inspect All 20 LGAs in Lagos State ->  |
|  (height: 48px | 100% width)]           |
+=========================================+
```

```
3.4 Viewport 4: 2G Lite / 400% Zoom 320px (Ultra-Compact Card)
+==============================+
| [A1] NAV BANNER (320px)      |
+==============================+
| LA-LGA-11: Ikeja Council     |
|------------------------------|
| [✓ Direct Treasury Payment   |
|   SC/CV/343/2024 Compliant]  |
|------------------------------|
| DPI Statuses:                |
| • Judiciary: [✓ Live]        |
| • Land/GIS:  [✓ Live]        |
| • DirectPay: [✓ Live]        |
| • Health:    [? Pilot]       |
|------------------------------|
| [Inspect LGAs (Full Width)]  |
+==============================+
```

---

---

# **4\. ROUTE 7 (`/governance`) — Institutional Charter, Four-Wall Anti-Capture Firewall, Five Public Safeguards, 6 Working Groups, Playbooks A–E & 15 Civic FAQs**

## **4.1 Viewport 1: Desktop `1440px` (Five Safeguards Matrix \+ Working Groups \+ Playbooks \+ 15 Civic FAQs Accordion)**

```
+======================================================================================================================+
| [A1] {ngstack.global.non_impersonation_banner}  |  [A2] HEADER NAV (Active: [/governance])                           |
+======================================================================================================================+
| [B1] ROUTE HEADER & LEAD DECK                                                                                        |
| H1: Ecosystem Governance, Four-Wall Anti-Capture Firewall, and Five Public Safeguards                                |
+======================================================================================================================+
| [C1] H2: The Five Public Safeguards of Open-Commons DPI                                                              |
| +------------------------------------------------------------------------------------------------------------------+ |
| | • [✓ 1. Freedom to Exit]: Zero-cost data portability and instant service provider migration guarantee.           | |
| | • [✓ 2. Open Source Code]: CC0-1.0 Public Domain specifications and open-source software libraries.              | |
| | • [✓ 3. Verifiable Public Audit]: Daily publicly verifiable cryptographic proof of system integrity.               | |
| | • [✓ 4. Inclusive Governance]: Multi-stakeholder working groups ensuring equal voice for public and private sectors| |
| | • [✓ 5. Freedom to Replicate]: Right to deploy independent infrastructure nodes without permission or fee.          | |
| +------------------------------------------------------------------------------------------------------------------+ |
+======================================================================================================================+
| [D1] H2: Six Tripartite Standards Working Groups (WG-01 to WG-06) & Role-Specific Adoption Playbooks                 |
| +-----------------------------------+ +-----------------------------------+ +--------------------------------------+ |
| | WG-01: Core Architecture          | | WG-02: Digital Evidence & Law     | | WG-03: Data Privacy & Treasury Split | |
| +-----------------------------------+ +-----------------------------------+ +--------------------------------------+ |
| | WG-04: Agriculture & Transport    | | WG-05: Local Govt & Offline Systems| | WG-06: Autonomous Verification & AI  | |
| +-----------------------------------+ +-----------------------------------+ +--------------------------------------+ |
| ADOPTION PLAYBOOKS: [Playbook A: Federal MDAs] [Playbook B: 36 States] [Playbook C: 774 LGAs] [Playbook D: Banks/HMOs] |
+======================================================================================================================+
| [E1] H2: Canonical 15-Question Audited Civic FAQ (NS-FAQ-01 to NS-FAQ-15)                                           |
| Filter: [All 15 FAQs] [Registrars] [Legal Counsel] [Local Councils] [Banks & Payments] [Citizens]                   |
| +------------------------------------------------------------------------------------------------------------------+ |
| | [v] NS-FAQ-01: Is nigeriastack.org a government portal or payment switch?                                      | |
| |     • Institutional Role: Open specification commons operating under strict anti-capture rules.                  | |
| |     • Operational Limits: Zero regulatory power, zero payment switching, zero fee tolls.                          | |
| +------------------------------------------------------------------------------------------------------------------+ |
| | [+] NS-FAQ-02 to NS-FAQ-15: [All 15 Civic FAQs rendered as accessible details accordions]                        | |
| +------------------------------------------------------------------------------------------------------------------+ |
+======================================================================================================================+
```

## **4.2 Viewport 2: Tablet `768px` (2-Column Working Groups Grid ¦ 2-Column Playbooks)**

```
+=============================================================================+
| [A1] HEADER NAV & BANNER (768px)                                            |
+=============================================================================+
| [B1] WORKING GROUPS (2-Column Grid • 3 Rows)                                |
| +----------------------------------+ +----------------------------------+ |
| | WG-01: Core Architecture         | | WG-02: Digital Evidence & Law    | |
| +----------------------------------+ +----------------------------------+ |
| | WG-03: Privacy & Treasury Split  | | WG-04: Agriculture & Transport   | |
| +----------------------------------+ +----------------------------------+ |
+=============================================================================+
| [C1] ADOPTION PLAYBOOKS (2-Column Grid, min-height: 44px buttons)           |
| [Playbook A: Federal MDAs]          ¦ [Playbook B: 36 States]             |
| [Playbook C: 774 Local Councils]   ¦ [Playbook D: Banks & Payments]      |
+=============================================================================+
```

## **4.3 Viewport 3: Mobile `390px` (Single-Column Stack ¦ 48px Tap Targets)**

```
+=========================================+
| [A1] NAV HEADER & BANNER (390px)        |
+=========================================+
| THE FIVE PUBLIC SAFEGUARDS:             |
| • 1. Freedom to Exit                    |
| • 2. Open Source Code                   |
| • 3. Verifiable Public Audit            |
| • 4. Inclusive Governance               |
| • 5. Freedom to Replicate               |
|-----------------------------------------|
| ADOPTION PLAYBOOKS:                     |
| [Playbook A: Federal MDAs (48px)]       |
| [Playbook B: 36 States (48px)]          |
| [Playbook C: 774 LGAs (48px)]           |
|-----------------------------------------|
| CIVIC FAQ ACCORDIONS:                   |
| [> NS-FAQ-01: Institutional Role (48px)]|
| [> NS-FAQ-02: Data Sovereignty (48px)]  |
+=========================================+
```

```
4.4 Viewport 4: 2G Lite / 400% Zoom 320px (Ultra-Compact Stack)
+==============================+
| [A1] NAV BANNER (320px)      |
+==============================+
| FIVE PUBLIC SAFEGUARDS:      |
| • 1. Freedom to Exit         |
| • 2. Open Source Code        |
| • 3. Verifiable Public Audit |
| • 4. Inclusive Governance    |
| • 5. Freedom to Replicate    |
|------------------------------|
| [> NS-FAQ-01 (48px Tap)]     |
| [> NS-FAQ-02 (48px Tap)]     |
+==============================+
```

---

---

# **5\. Remediated Civic-Voice Wireframe Label & Progressive-Disclosure Overlay (v2026.6.5 — Zero Backend Bleed in Customer UI)**

* **Governing Skill Harnesses:** `NS-SH-03` & `NS-SH-04` — Ensures all customer-facing wireframes across Routes 4–7 render plain-language civic text in the primary view while cleanly isolating raw schema keys and technical specifications within developer split-panes and expandable drawers.

## **5.1 Route 4 (`/rfcs`) — Remediated Civic-Voice Split-Pane Standards Reader**

* **Left Pane (Civic & Institutional Summary Plane):** Displays plain-language legal, operational, and fiscal rules tailored for executives, registrars, and council officers. For example: *"100% of local government and court fees settle directly into the official council or judiciary bank account with zero private middleman holding."*  
* **Right Pane / Mobile Collapsible Drawer (Developer & Architect Code Plane):** Isolates all technical implementation details including raw JSON Schema 2020-12 properties (e.g. `platformEscrowAmountKobo: 0`), OpenAPI 3.1.1 YAML endpoints, and ULID validation patterns across desktop (1440px), tablet (768px), mobile (390px), and 2G Lite (320px) viewports.

## **5.2 Route 5 (`/conformance`) — Remediated Civic Browser Verification Sandbox**

* **Customer-Facing Sandbox Tabs:**  
  * `[Tab 1: Digital Evidence Seal & Tamper Check]`  
  * `[Tab 2: Citizen Data Consent & 60s Revocation Check]`  
  * `[Tab 3: 100% Direct Council & Court Treasury Split Check]`  
  * `[Tab 4: Human-Approved AI & Protected Micro-Payment Check]`  
  * `[Tab 5: Safe Network Retry & Anti-Double-Debit Check]`  
* **Primary Action CTA:** `[Verify data in browser (Free • Zero Server Storage)]` — Guarantees 100% local WebAssembly execution with zero server logging.

## **5.3 Route 6 (`/atlas/states` & `/atlas/lga-774`) — Plain-Language Status Badges & Council Autonomy**

* **Plain-Language Status Badge Mapping:**  
  * `[✓ Live Digital Service]` (replaces raw backend enum `VERIFIED_LIVE_PORTAL`)  
  * `[? Active Pilot Program]` (replaces raw backend enum `CORROBORATED_PILOT`)  
  * `[0 Paper-Only Registry]` (replaces raw backend enum `PAPER_BOUND_GAP`)  
  * `[.. Not Yet Assessed]` (replaces raw backend enum `UNASSESSED`)  
* **LGA Autonomy & Transit Banner:** `[✓ 100% Direct Council Treasury Payment — Supreme Court SC/CV/343/2024 Compliant] • [✓ Inter-LGA Commercial Vehicle QR Transit Pass Active (<1s Offline Scan)]`

## **5.4 Route 7 (`/governance`) — Five Public Safeguards, Playbooks & 15 Civic FAQs**

* **The Five Public Safeguards:** `1. Freedom to Exit`, `2. Open Source Code`, `3. Verifiable Public Audit`, `4. Inclusive Governance`, and `5. Freedom to Replicate`.  
* **Adoption Playbooks & FAQs:** Integrates 5 role-specific adoption playbooks (`Playbooks A–E`) alongside the 15 plain-language audited FAQs (`NS-FAQ-01..15`) across all viewports with accessible mobile tap targets.
