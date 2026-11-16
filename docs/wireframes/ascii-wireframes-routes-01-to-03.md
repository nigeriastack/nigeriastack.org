# **NS-KB-14: 4-Viewport Swiss-Blueprint Annotated ASCII Wireframes (Routes 1 to 3 \+ 14 LGA Modules) \[v2026.6.5 Remediated\]**

* Document ID: `NS-WIREFRAMES-ASCII-KB14-V2026.6.5`  
* Canonical Path: `docs/wireframes/ascii-wireframes-routes-01-to-03.md`  
* Governing Skill Harness: `NS-SH-04` (Swiss-Blueprint 4-Viewport Wireframe Designer — Pattern B Co-Evolution Peer with `NS-SH-03`)  
* Upstream Authority: `NS-KB-04A` (W3C DTCG Tokens), `NS-KB-10` (Routes 1–4 Webcopy & `{copy_slot}` Contracts), `NS-KB-12` (5-Level Precedence Charter & Sitemap Tree), `NS-KB-13` (`RAG-H2-01` to `RAG-H2-13` Benchmarks)  
* Verification Gate: `Gate NS-G4` (4 Viewports `1440px` / `768px` / `390px` / `320px`; Zero Horizontal Overflow `scrollWidth <= clientWidth`; `>= 44x44px` Touch Targets; Mandatory Accessible Table Companion; \+35% 5-Locale Expansion Budget)  
* License: `CC0-1.0 Universal (Public Domain Dedication)`

---

# **0\. Global 4-Viewport Swiss-Grid & DTCG Token Geometry Contract**

| Viewport Tier | Breakpoint Width | Grid Columns | Column Gutter | Outer Margin | Navigation & Table Reflow Behavior |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Desktop (`VP-1440`)** | `1440px` (`max-content: 1360px`) | 12 Columns (`88px` col) | `24px` (`space6`) | `40px` | Full horizontal nav bar; split-pane inspectors (`Col 1–5` \+ `Col 6–12`); full 8-column data grid. |
| **Tablet (`VP-768`)** | `768px` | 8 Columns (`72px` col) | `16px` (`space4`) | `24px` | Condensed top bar \+ `[Menu v]` drawer trigger (`44x44px`); 2-up card grid; sticky column-1 table scroll with explicit scroll indicator. |
| **Mobile (`VP-390`)** | `390px` | 4 Columns (`77px` col) | `12px` (`space3`) | `16px` | Single-column stack; 44px sticky filter bar; tables reflow into structured key-value `<dl>` specification cards (`zero horizontal page overflow`). |
| **Small-Screen / 2G (`VP-320`)** | `320px` (WCAG 2.2 SC 1.4.10 400% Zoom) | 2 Columns (`140px` col) | `8px` (`space2`) | `12px` | `< 35 KB` Lite Mode shell; zero webfont blocking; all CTAs stack full-width (`min-height: 44px`) accommodating \+35% `ha-NG`/`yo-NG`/`ig-NG`/`pcm-NG` text expansion. |

---

# **1\. ROUTE 1 (`/`) — Home: Vendor-Neutral 5-Layer Sovereign Hourglass & 12 Building Blocks Explorer**

## **1.1 Viewport 1: Desktop `1440px` (12-Column Swiss Technical Schematic)**

```
+======================================================================================================================+
| [A1] {ngstack.global.non_impersonation_banner} (bg: #EEF3EF | border-bottom: 1px solid #D4DDD7 | ink: #0D1512 16.8:1)|
| [✓ OPEN STANDARDS COMMONS • CC0-1.0] nigeriastack.org is an independent open specification & conformance commons.    |
| It is NOT a federal agency, payment gateway, commercial API marketplace, or proprietary vendor product catalogue.    |
+======================================================================================================================+
| [A2] HEADER NAV (height: 64px | surface.panel #FFFFFF | border-bottom: 2px solid #0D1512)                            |
| [■ NIGERIA STACK]  [/ Architecture] [/sectors 32-Ind] [/protocols & 774-LGA] [/rfcs 14-RFCs] [/conformance ITB]      |
|                    [/atlas 36-States+774-LGA] [/governance]   [Locale: EN-NG v] [Lite <35KB: ON] [GitHub CC0-1.0 ↗]  |
+======================================================================================================================+
| [B1] HERO SPLIT-PANE (Col 1–6: 640px Task-Led Proposition) | [B2] INTERACTIVE 5-LAYER HOURGLASS SCHEMATIC (Col 7–12) |
| (surface.canvas #F8FAF8 | padding: 48px | border-right:1px)| (surface.terminal #0D1512 | ink: #F8FAF8 | 18.2:1 AAA)  |
|------------------------------------------------------------+---------------------------------------------------------|
| {home.hero.eyebrow_mono} (JetBrains Mono 12px #0A5C36):    |  +---------------------------------------------------+  |
| NIGERIA STACK v2026.6.5 • CC0-1.0 • 32 IND • 36 ST • 774LG |  | LAYER 5: WHOLE-OF-ECONOMY SECTOR NETWORKS & 774 LGA |  |
|                                                            |  | [8 Macro-Sectors] [32 Industries] [774-LGA Stack] |  |
| H1 {home.hero.h1} (Source Serif 4 36px/44px #0D1512):      |  +-------------------------+-------------------------+  |
| Make Nigeria's digital systems work together without       |                            |                            |
| surrendering statutory authority, operational continuity,  |  +-------------------------v-------------------------+  |
| evidentiary integrity, or institutional independence       |  | LAYER 4: SAFE RETRIES, DATA CONSENT & OPEN MARKETS   |  |
|                                                            |  | [Safe Webhooks] [Data Consent] [Open Trade Mesh]  |  |
| {home.hero.lead_sequence} (Public Sans 16px/26px <=65ch):  |  +-------------------------+-------------------------+  |
| • [1. Task]: Inspect, fork & verify open DPI specs & SDKs. |                            |                            |
| • [2. Evidence]: 14 NS-RFCs, Evidence Act s.84 W3C VCs,    |  +-------------------------v-------------------------+  |
|   NDPA 2023 ClearAm, & CFRN s.121(3) / SC/CV/343/2024.     |  | LAYER 3: OFFLINE LOCAL REGISTRIES & LAWS             |  |
| • [3. Limit]: Zero runtime payment switching, zero API     |  | [Court Evidence Seals] [Multilingual Laws (5 Loc)]|  |
|   brokerage tolls, zero master-database duplication.       |  +-------------------------+-------------------------+  |
| • [4. Action]: Select a Layer or run the WASM ITB.         |                            |                            |
|                                                            |  +-------------------------v-------------------------+  |
| [CTA 1: {home.cta.explore_stack}] (bg:#0A5C36 ink:#FFF 44px)|  | LAYER 2: STATUTORY IDENTITY & DIRECT TREASURY        |  |
| [Explore 5-layer blueprint ->]                             |  | [Identity Verification] [0-Escrow Treasury Settlement]|  |
| [CTA 2: {home.cta.run_itb}] (border:2px #52665B 44px)      |  +-------------------------+-------------------------+  |
| [Run ITB conformance suite]                                |                            |                            |
|                                                            |  +-------------------------v-------------------------+  |
| {home.cta.consequence_helper} (13px #3B4D44):              |  | LAYER 1: OFFLINE EDGE APP <35KB, *347*LGA# USSD     |  |
| Consequence: Opens local WASM verifier. Zero server logs.  |  | [Offline Council App] [Health Data] [Land Cadastre]|  |
|                                                            |  +---------------------------------------------------+  |
|                                                            |  [+ Open Technical Specification Drawer]              |
+======================================================================================================================+
| [C1] H2 [RAG-H2-01]: What is nigeriastack.org and how does its Four-Wall Anti-Capture Firewall work?                 |
| Lead Answer (<65w): Independent CC0-1.0 specification commons across 32 industries, 36 States, FCT & 774 LGAs...     |
| +--------------------------+ +--------------------------+ +--------------------------+ +---------------------------+ |
| | WALL 1: NOT A PAYMENT    | | WALL 2: NOT A COMMERCIAL | | WALL 3: NOT A STATUTORY  | | WALL 4: NOT A PROPRIETARY | |
| | GATEWAY OR SWITCH        | | API MARKETPLACE / BROKER | | GOVERNMENT PORTAL        | | VENDOR PRODUCT CATALOGUE  | |
| | 100% Direct Treasury     | | Zero runtime toll fees   | | Zero NIN/BVN/RC issuance | | 100% vendor-neutral specs | |
| | Settlement (0 Middleman) | |                          | |                          | |                           | |
| +--------------------------+ +--------------------------+ +--------------------------+ +---------------------------+ |
+======================================================================================================================+
| [D1] H2 [RAG-H2-02]: How does the vendor-neutral 5-layer Sovereign Hourglass connect 12 Building Blocks?             |
| Filter by Layer: [All 12 Building Blocks] [L1 Edge] [L2 Identity/Treasury] [L3 Trust/Laws] [L4 Retries] [L5 Sector]  |
| +--------------------------------------+ +--------------------------------------+ +--------------------------------+ |
| | 1. Official Identity & Roll Check    | | 2. Offline Local Registry Kernel     | | 3. Safe Async Messaging Mesh   | |
| | Zero-knowledge NIN/BVN/RC verification| | Offline council registry & POS kernel| | Signed async webhook delivery  | |
| | [+ Open Technical Spec Drawer]       | | [+ Open Technical Spec Drawer]       | | [+ Open Technical Spec Drawer] | |
| +--------------------------------------+ +--------------------------------------+ +--------------------------------+ |
| | 4. Citizen Data Consent & Revocation | | 5. Court-Admissible Digital Seals    | | 6. 100% Direct Treasury Settle | |
| | NDPA consent & 60s revocation window | | Evidence Act s.84 FIDO2 QR seals     | | Direct public revenue (0-escrow)| |
| | [+ Open Technical Spec Drawer]       | | [+ Open Technical Spec Drawer]       | | [+ Open Technical Spec Drawer] | |
| +--------------------------------------+ +--------------------------------------+ +--------------------------------+ |
| | 7. Open Unbundled Commerce Mesh      | | 8. Fast Transport & Trade Clearance  | | 9. Offline Health & Education VCs | |
| | Unbundled catalog & logistics network| | Port, border & transit <50ms QR pass | | Patient FHIR & academic records| |
| | [+ Open Technical Spec Drawer]       | | [+ Open Technical Spec Drawer]       | | [+ Open Technical Spec Drawer] | |
| +--------------------------------------+ +--------------------------------------+ +--------------------------------+ |
| | 10. Land Cadastre & Title Verification| | 11. Multilingual Laws & Lex Codes   | | 12. Human-Approved Agent Sandbox| |
| | 3x3m land grid & court caveat checks | | Bi-temporal laws in 5 locales        | | Read-only MCP & escrow controls| |
| | [+ Open Technical Spec Drawer]       | | [+ Open Technical Spec Drawer]       | | [+ Open Technical Spec Drawer] | |
| +--------------------------------------+ +--------------------------------------+ +--------------------------------+ |
+======================================================================================================================+
| [E1] H2 [RAG-H2-03]: How does the Nigeria Stack pass the Five Tests of Open-Commons DPI (01 Exit to 05 Replicate)?    |
| +--------------------+ +--------------------+ +--------------------+ +--------------------+ +----------------------+ |
| | [✓ 1. FREEDOM EXIT]| | [✓ 2. OPEN SOURCE] | | [✓ 3. PUBLIC AUDIT]| | [✓ 4. INCLUSIVE GOV| | [✓ 5. FREEDOM FORK]  | |
| | <60s consent revoke| | CC0-1.0 Public Dom | | Daily public hash  | | 6 Tripartite WGs   | | Self-host anywhere   | |
| | Zero cost export   | | + Open Apache SDKs | | Merkle tree audit  | | Public dissent log | | Open key endpoints   | |
| | *347*LGA# USSD     | | Zero SaaS lock-in  | | Audit verification | | Conflict registry  | | Complete code access | |
| | [+ Technical Spec] | | [+ Technical Spec] | | [+ Technical Spec] | | [+ Technical Spec] | | [+ Technical Spec]   | |
| +--------------------+ +--------------------+ +--------------------+ +--------------------+ +----------------------+ |
+======================================================================================================================+
```

## **1.2 Viewport 2: Tablet 768px (8-Column Grid Layout)**

```
+==============================================================================+
| [✓ OPEN PUBLIC STANDARDS • PUBLIC DOMAIN] Independent commons...            |
+==============================================================================+
| [■ NIGERIA STACK]         [Locale: EN-NG v] [Lite <35KB] [≡ Menu (44x44px)]  |
+==============================================================================+
| [B1] HERO PROPOSITION (Full 8-Col Width: 720px)                              |
| H1: Make Nigeria's digital systems work together without surrendering...     |
| [Explore 5-layer blueprint -> (44px)]  [Run ITB test suite (44px)]           |
| Help: Zero server logs; 100% local WASM execution.                           |
+==============================================================================+
| [B2] INTERACTIVE 5-LAYER HOURGLASS (Stacked Full-Width | 720px)              |
| +--------------------------------------------------------------------------+ |
| | Layer 5: Whole-of-Economy Sector Networks & Local Government Services     | |
| +--------------------------------------------------------------------------+ |
| | Layer 4: Safe Retries, Citizen Data Consent & Open Markets               | |
| +--------------------------------------------------------------------------+ |
| | Layer 3: Offline Registries, Digital Laws & Court-Admissible Seals       | |
| +--------------------------------------------------------------------------+ |
| | Layer 2: Statutory Identity Verification & Direct Treasury Settlement    | |
| +--------------------------------------------------------------------------+ |
| | Layer 1: Offline Edge App (<35 KB), Basic USSD (*347*LGA#) & Local Data  | |
| +--------------------------------------------------------------------------+ |
+==============================================================================+
| [C1/D1] 2-UP CARD GRID (Col 1–4 & Col 5–8 ¦ 352px each):                     |
| +-----------------------------------+  +-----------------------------------+ |
| | 1. Official Identity Proof        |  | 2. Offline Council App Kernel     | |
| | Verified national identity        |  | Offline local government service  | |
| | [+ Open Technical Specification]  |  | [+ Open Technical Specification]  | |
| +-----------------------------------+  +-----------------------------------+ |
+==============================================================================+
```

## **1.3 Viewport 3: Mobile 390px (4-Column Stack)**

```
+==========================================+
| 390px MOBILE (Margin: 16px ¦ 1-Col Stack)|
+==========================================+
| [✓ PUBLIC DOMAIN COMMONS]                |
| Independent technical standards.         |
+==========================================+
| [■ NIGERIA STACK]   [EN-NG] [≡ Menu 44px]|
+==========================================+
| Make Nigeria's digital systems work      |
| together without surrendering authority  |
| or operational independence.             |
|                                          |
| [Explore 5-layer blueprint  (358x48px)]  |
| [Run local test suite       (358x48px)]  |
| Runs 100% locally in browser WASM.       |
+==========================================+
| ACCORDION BLUEPRINT (44px Tap Headers):  |
| [v Layer 5: Public Sector & Councils   ] |
| [+ Layer 4: Data Consent & Open Market ] |
| [+ Layer 3: Registries & Digital Laws  ] |
| [+ Layer 2: Direct Treasury & Identity ] |
| [+ Layer 1: Offline Edge & USSD Access ] |
+==========================================+
```

## **1.4 Viewport 4: Small-Screen / 2G Lite 320px (2-Column 400% Zoom)**

```
+================================+
| 320px LITE (<35KB ¦ 400% Zoom) |
+================================+
| [✓ PUBLIC DOMAIN OPEN STANDARDS]|
+================================+
| [■ NG STACK]     [≡ Menu 44px] |
+================================+
| Make digital systems work      |
| together without surrendering  |
| statutory authority.           |
|                                |
| [Explore blueprint (296x48px)] |
| [Run verifier      (296x48px)] |
+================================+
| ACCORDION STACK (44px Headers):|
| [+ L5: Sector Networks & LGA ] |
| [+ L4: Consent & Open Retries] |
| [+ L3: Registries & Seals    ] |
| [+ L2: Direct Treasury Pay   ] |
| [+ L1: Offline Edge & *347*# ] |
+================================+
```

---

# **2\. ROUTE 2 (`/sectors` & `/sectors/:sector_slug/:industry_id`) — 8 Macro-Sectors & 32-Industry Capability & 8-Mechanism Gap Ledger**

## **2.1 Viewport 1: Desktop `1440px` (12-Column Matrix \+ Mandatory Sortable Accessible Table)**

```
+======================================================================================================================+
| [A1] {ngstack.global.non_impersonation_banner}  |  [A2] HEADER NAV (Active: [/sectors 32-Ind])                       |
+======================================================================================================================+
| [B1] ROUTE HEADER & 4-STEP LEAD DECK (Col 1–8: 880px)                | [B2] LEDGER TELEMETRY SUMMARY (Col 9–12: 440px)|
| H1 {sectors.header.h1}: Whole-of-economy 32-industry capability      | +-------------------------------------------+ |
| baseline and 8-mechanism residual-gap atlas                          | | LEDGER: NS-LEDGER-32IND-2026-V2 (CC0-1.0) | |
| • [1. Task]: Filter 32 industries across 8 macro-sectors & gaps.     | | Total Industries: 32 | Macro-Sectors: 8   | |
| • [2. Evidence]: Credits live Nigerian supply first (NIBSS, Paystack,| | Documented Domestic Supply: 16 Industries | |
|   Moniepoint, Remita, Shipbubble, Termii, Dojah, Helium Health, AFEX)| | Partial Coverage: 14 | Unresolved: 2      | |
| • [3. Limit]: Thin global directory overlap != domestic absence.     | | [Download master-32-industry-matrix.json] | |
| • [4. Action]: Filter by Sector or Bottleneck to inspect IND-01..32.  | +-------------------------------------------+ |
+======================================================================================================================+
| [C1] H2 [RAG-H2-04]: What are the 8 empirical interoperability failure mechanisms?                                 |
| Filter by Everyday Bottleneck (min-height: 44px | active bg: #0A5C36 ink: #FFFFFF):                                   |
| [All 32 Industries] [1. Locked Source Records] [2. State & Local Council Gaps] [3. Mismatched Data Formats]         |
| [4. Payment Timeouts] [5. Forged Paper Certificates] [6. Power & 2G Drops] [7. High Platform Commissions] [8. Laws] |
+======================================================================================================================+
| [D1] H2 [RAG-H2-05]: How do Nigeria's 8 Macro-Sectors and 32 Industries integrate existing domestic platforms?       |
| Macro-Sector Tabs (role="tablist" • 44px height):                                                                    |
| [All 8 Sectors] [S1 Finance (6)] [S2 Identity/Labor (2)] [S3 Commerce/Trade (7)] [S4 Health/Edu/Media (3)]           |
| [S5 Agri/Land/Climate (3)] [S6 Energy/IoT/Address (3)] [S7 Telecom/PKI/Dev (4)] [S8 Justice/AI/Statutes (4)]         |
+----------------------------------------------------------------------------------------------------------------------+
| ACCESSIBLE SORTABLE HTML DATA TABLE (<table role="grid" aria-label="32-Industry Capability & Gap Matrix">):          |
|----------------------------------------------------------------------------------------------------------------------|
| Industry & Sector           : Existing Nigerian Platforms      : Current Digital Status  : Everyday Bottleneck Solved|
|----------------------------------------------------------------------------------------------------------------------|
| Payments & Money            : NIBSS NIP, Paystack, Flutterwave : [✓ Documented Local   : Payment Timeouts & Commissions|
| (Finance & Revenue)         : Moniepoint, OPay, Remita         :    Supply]              : [+ Tech Drawer]            |
|----------------------------------------------------------------------------------------------------------------------|
| Banking & Open Finance      : CBN Open Banking, Mono, Stitch,  : [✓ Documented Local   : Locked Records & Paper Seals|
| (Finance & Revenue)         : OnePipe, Lendsqr                 :    Supply]              : [+ Tech Drawer]            |
|----------------------------------------------------------------------------------------------------------------------|
| Tax, e-Invoice & LGA IGR    : NRS ATRS, Remita, 36 SIRS,       : [✓ Documented Local   : State & Local Council Gaps |
| (Finance & Revenue)         : PayDirect, Digitax               :    Supply]              : [+ Tech Drawer]            |
|----------------------------------------------------------------------------------------------------------------------|
| Land Titles & Building      : LAGIS, AGIS, EDOGIS, KADGIS,     : [? Partial Coverage]    : Locked Source Records      |
| (Agriculture & Land)        : NAGIS, Council Cadastre          :                         : [+ Tech Drawer]            |
|----------------------------------------------------------------------------------------------------------------------|
| Judiciary & Legal           : NJC NCMS, Lagos CoMiS, RivCoMiS, : [? Partial Coverage]    : Paper-Only Laws & Seals    |
| (Justice & Statutes)        : LawPavilion                      :                         : [+ Tech Drawer]            |
|----------------------------------------------------------------------------------------------------------------------|
| [All 32 Industries rendered in deterministic order; click any row -> /sectors/:sector_slug/:ind_id]                 |
+======================================================================================================================+
```

## **2.2 Viewport 2: Tablet 768px (8-Column Grid with Sticky Column 1 & 2-Row Bottleneck Filter Pills)**

```
+==============================================================================+
| [✓ OPEN STANDARDS COMMONS • CC0-1.0] nigeriastack.org independent specs     |
+==============================================================================+
| [■ NIGERIA STACK]         [Locale: EN-NG v] [Lite <35KB] [≡ Menu (44x44px)]  |
+==============================================================================+
| ROUTE HEADER: Whole-of-Economy 32-Industry Capability & Gap Atlas           |
| Filter by Everyday Bottleneck (2-Row Wrap, 44px Touch Targets):              |
| [All 32 Industries] [1. Locked Records] [2. State/LGA Gaps] [3. Data Format]  |
| [4. Payment Timeouts] [5. Paper Seals] [6. 2G Drops] [7. High Tolls] [8. Laws]|
+==============================================================================+
| 32-INDUSTRY ACCESSIBLE DATA TABLE (Sticky Col 1 ID | Horizontal Scroll):    |
| +--------+--------------------------+-----------------------+---------------+|
| | ID     | Industry & Sector        | Domestic Supply       | Status        ||
| +--------+--------------------------+-----------------------+---------------+|
| | IND-01 | Payments & Money         | NIBSS NIP, Paystack   | [✓ DOCUMENTED]||
| | IND-02 | Banking & Open Finance   | CBN Open Banking      | [✓ DOCUMENTED]||
| | IND-05 | Tax, e-Invoice & LGA IGR | NRS ATRS, Remita      | [✓ DOCUMENTED]||
| | IND-17 | Land Titles & Cadastre   | LAGIS, AGIS, EDOGIS   | [? PARTIAL]   ||
| | IND-21 | Judiciary & Legal        | NJC NCMS, Lagos CoMiS | [? PARTIAL]   ||
| +--------+--------------------------+-----------------------+---------------+|
| [< Scroll horizontal for Gap Bottlenecks & Technical Drawer Links >]        |
+==============================================================================+
```

## **2.3 Viewport 3: Mobile 390px (4-Column Single-Stack Specification Cards — Zero Horizontal Table Overflow)**

```
+==========================================+
| 390px MOBILE (Margin: 16px ¦ 1-Col Stack)|
+==========================================+
| [✓ PUBLIC DOMAIN STANDARDS COMMONS]      |
+==========================================+
| [■ NIGERIA STACK]   [EN-NG] [≡ Menu 44px]|
+==========================================+
| Whole-of-Economy 32-Industry Atlas       |
|                                          |
| [Filter Sector: All 8 Sectors        v]  |
| [Filter Bottleneck: All Bottlenecks  v]  |
+==========================================+
| REFLOWED SPECIFICATION CARD STACK (<dl>): |
| +--------------------------------------+ |
| | TAX, E-INVOICE & LOCAL COUNCIL IGR   | |
| | Sector: Finance & Revenue            | |
| | Status: [✓ DOCUMENTED LOCAL SUPPLY]  | |
| | Supply: NRS ATRS, Remita, 36 SIRS    | |
| | Bottleneck: 2. State & Council Gaps  | |
| | Open Standard: Direct Treasury Pay   | |
| | [+ Open Technical Spec Drawer (44px)]| |
| +--------------------------------------+ |
| +--------------------------------------+ |
| | LAND TITLES & BUILDING PERMITS       | |
| | Sector: Agriculture & Land           | |
| | Status: [? PARTIAL DOMESTIC COVERAGE]| |
| | Bottleneck: 1. Locked Source Records | |
| | Open Standard: Land Cadastre Specs   | |
| | [+ Open Technical Spec Drawer (44px)]| |
| +--------------------------------------+ |
+==========================================+
```

## **2.4 Viewport 4: Small-Screen / 2G Lite 320px (2-Column 400% Zoom Reflow Card Stack)**

```
+================================+
| 320px LITE (<35KB ¦ 400% Zoom) |
+================================+
| [✓ PUBLIC DOMAIN OPEN STANDARDS]|
+================================+
| [■ NG STACK]     [≡ Menu 44px] |
+================================+
| 32-Industry Capability Atlas   |
|                                |
| [Sector: All 8 Sectors       v]|
| [Bottleneck: All Bottlenecks v]|
+================================+
| REFLOW CARD STACK (<dl>):      |
| +----------------------------+ |
| | Tax & Local Council IGR    | |
| | Status: [✓ DOCUMENTED]     | |
| | Supply: NRS, Remita, SIRS  | |
| | Bottleneck: State/LGA Gaps | |
| | Fix: Direct Treasury Pay   | |
| | [+ Open Spec Drawer (44px)]| |
| +----------------------------+ |
| +----------------------------+ |
| | Land Titles & Cadastre     | |
| | Status: [? PARTIAL]        | |
| | Bottleneck: Locked Records | |
| | Fix: Land Cadastre Specs   | |
| | [+ Open Spec Drawer (44px)]| |
| +----------------------------+ |
+================================+
```

---

# **3\. ROUTE 3 (`/protocols/:protocol_slug` & `/protocols/lga-governance-stack/lga-01..14`) — Clean-Room Pan-Nigerian Protocol Suite & All 14 774-LGA Municipal Modules**

## **3.1 Viewport 1: Desktop `1440px` (Left Tree Nav `Col 1–3` \+ Main `dpi/build` 4-Pillar & Five-Tests Workspace `Col 4–12`)**

```
+======================================================================================================================+
| [A1] {ngstack.global.non_impersonation_banner}  •  [A2] HEADER NAV (Active: [/protocols & 774-LGA])                  |
+======================================================================================================================+
| [COL 1–3: 320px STICKY SERVICE NAVIGATION TREE] ¦ [COL 4–12: 1016px CIVIC SERVICE & EVALUATION WORKSPACE]             |
|-------------------------------------------------+--------------------------------------------------------------------|
| PAN-NIGERIAN CORE OPEN STANDARDS (7)            ¦ Breadcrumb: Open Standards / Local Council Services / Module 10    |
| • Official Identity Verification                ¦ [✓ CANDIDATE OPEN STANDARD • CC0-1.0 PUBLIC DOMAIN COMMONS]        |
| • Citizen Data Consent & Privacy                ¦                                                                    |
| • Safe Async Messaging & Retries                ¦ H1: Market & Motor-Park Revenue — Digital POS/USSD Payment         |
| • Open Trade & Logistics Mesh                   ¦ & Inter-LGA Commercial Vehicle Transit Pass                         |
| • Human-Approved Agent Sandbox                  ¦                                                                    |
| • Offline Local Council Registry Kernel         ¦ H2 [RAG-H2-13]: How does this service ensure constitutional direct |
| • Multilingual Digital Laws & Lex Codes        ¦ local treasury settlement and eliminate illegal roadside cash fees? |
|-------------------------------------------------¦                                                                    |
| 774 LOCAL COUNCIL SERVICES                      ¦ THE 4 EVALUATION PILLARS (role="tablist" • 44px height):           |
| 1. Citizen Grievance Redress (CouncilComplain)  ¦ [1. Civic Evidence (Active)] [2. Components] [3. Framework] [4. M] |
| 2. Building & Setback Permits (BuildClear)      ¦ +----------------------------------------------------------------+ |
| 3. Rural Water & Sanitation (WashConnect)       ¦ | PILLAR 1 (CIVIC EVIDENCE): 4-STEP SERVICE & LEGAL GUIDE        | |
| 4. Market & Shop Licensing (ShopPermit)         ¦ | • [1. User Task]: Replace cash touting in markets/motor parks  | |
| 5. Birth, Death & Marriage Seals (VitalProof)   ¦ |   with offline POS/USSD tickets & a verifiable digital       | |
| 6. 72-Hour Indigene Certificate (IndigeneProof) ¦ |   Inter-LGA Commercial Vehicle Corridor Pass (<50ms QR scan).  | |
| 7. Fire & Health Clearances (SafetyNOC)         ¦ | • [2. Legal Basis]: Fourth Schedule Para 1(e) 1999 CFRN        | |
| 8. Ward Public Works Tracker (WardWorks)        ¦ |   & Supreme Court SC/CV/343/2024 (100% Direct Local Treasury   | |
| 9. Tenement Rates & Customary Land (TenementRate)¦ |   Settlement with zero middleman escrow holding).              | |
|>10. Market & Motor-Park Revenue (MarketCollect) ¦ | • [3. Safeguard Limit]: Prohibits roadside cash collection and | |
| 11. Primary Healthcare & Vaccines (WardPHC)     ¦ |   double-taxation across participating transit corridor LGAs.  | |
| 12. Direct Council Audit Ledger (CouncilLedger) ¦ | • [4. Next Action]: Run local verifier test in browser.        | |
| 13. Customary & Area Court Records (Customary)  ¦ |                                                                | |
| 14. Digital Address & Street Grid (StreetGrid)  ¦ | [+ Inspect Technical Schema & OpenAPI Contract]                | |
|                                                 ¦ +----------------------------------------------------------------+ |
|                                                 ¦ SERVICE STATUS & FIVESafeguards SCORECARD:                         |
|                                                 ¦ [REQUESTED] -> [DIRECT_LOCAL_TREASURY_SETTLED] -> [DIGITAL_QR]    |
|                                                 ¦ [✓ 1. Freedom Exit] [✓ 2. Open Source] [✓ 3. Public Audit]        |
|                                                 ¦ [✓ 4. Inclusive Governance] [✓ 5. Freedom to Self-Host]          |
+======================================================================================================================+
```

## **3.2 Viewport 2: Tablet 768px (8-Column Sticky Top Module Selector \+ 4-Pillar Workspace)**

```
+==============================================================================+
| TOP SELECTOR BAR: [Select Module: 10. Market & Motor-Park Revenue v] (44px)   |
+==============================================================================+
| THE 4 EVALUATION PILLARS (role="tablist" ¦ 44px height):                      |
| [1. Civic Evidence (Active)] [2. Components] [3. Framework] [4. Methods]     |
+==============================================================================+
| H1: Market & Motor-Park Revenue Collection + Inter-LGA Transit Pass          |
| • [1. User Task]: Replace cash touting with offline tickets & QR corridor pass|
| • [2. Legal Basis]: Fourth Schedule Para 1(e) & Direct Treasury Autonomy     |
| • [3. Boundary]: Prohibits roadside cash collection & double-taxation        |
| • [4. Action]: [Run Local Conformance Test -> (44px)]                        |
|                                                                              |
| [+ Open Technical Specification Drawer & OpenAPI Contract]                    |
+==============================================================================+
```

## **3.3 Viewport 3: Mobile 390px (4-Column Service Stack \+ Technical Drawer)**

```
+==========================================+
| 390px MOBILE (1-Column Stack)            |
+==========================================+
| [Select Local Module: 10. Market...   v] |
+==========================================+
| [1.Evidence][2.Components][3.Frmwk][4.M] |
+==========================================+
| H1: Market & Motor-Park Revenue          |
| • [Task]: Offline POS/USSD & <50ms QR.   |
| • [Evidence]: Direct Treasury Autonomy   |
| • [Limit]: Prevents double-taxation.     |
| • [Action]: [Run Conformance Test (44px)]|
|                                          |
| [+ Open Technical Specification Drawer]  |
+==========================================+
```

## **3.4 Viewport 4: Small-Screen / 2G Lite 320px (2-Column \*347\*LGA\# & 400% Zoom)**

```
+================================+
| 320px 2G LITE (<35KB ¦ 400% Zm)|
+================================+
| [Module: 10. Market Revenue v] |
+================================+
| [1. Civic Evidence (Active) v] |
+================================+
| H1: Market & Motor-Park Pass   |
| • [1. Task]: Offline POS/USSD. |
| • [2. Evidence]: 0-Escrow.     |
| [Run Test Suite (296x44px)]    |
|                                |
| [+ Technical Drawer]           |
+================================+
```

---

# **4\. Remediated Civic-Voice Wireframe Label & Progressive-Disclosure Overlay (v2026.6.5 — Zero Backend Bleed in Customer UI)**

Under Skill Harnesses `NS-SH-03` & `NS-SH-04`, this section specifies how every customer-facing wireframe box in Routes 1–3 (`/`, `/sectors`, `/protocols` \+ 14 Local Government Modules) renders plain-language civic labels in the primary view while isolating schema/code identifiers inside expandable `[+ Inspect Technical Schema & OpenAPI Contract]` drawers.

## **4.1 Route 1 (`/`) Civic Wireframe Labels (Replacing Raw Code Labels across `1440px / 768px / 390px / 320px`)**

* **Top Demarcation Bar:** `[✓ OPEN PUBLIC STANDARDS • PUBLIC DOMAIN] Independent technical specification commons — not a government agency, payment processor, API store, or private vendor catalog.`  
* **Hourglass Layer Labels:**  
  * **Layer 5:** Whole-of-Economy Sector Networks & Local Government Services (8 Sectors • 32 Industries • 774 Local Councils)  
  * **Layer 4:** Safe Retries, Citizen Data Consent, Open Markets & Human-Approved AI  
  * **Layer 3:** Offline Local Registries, Multilingual Digital Laws & Court-Admissible Digital Seals  
  * **Layer 2:** Statutory Identity Verification & 100% Direct Public Treasury Settlement  
  * **Layer 1:** Offline Edge App (Under 35 KB), Basic Phone USSD (\*347\*LGA\#) & Nigerian Data Hosting  
* **Five Public Safeguards Strip:** `[✓ 1. Freedom to Exit (<60s Consent Revoke & USSD Access)]` • `[✓ 2. Open Source Code (Public Domain)]` • `[✓ 3. Verifiable Public Audit]` • `[✓ 4. Inclusive Governance]` • `[✓ 5. Freedom to Self-Host]`

## **4.2 Route 2 (`/sectors`) Civic Filter Pills & Accessible Table Headers (`1440px / 768px / 390px / 320px`)**

* **Bottleneck Filter Pills (Replacing MECH-01..08 in Customer UI):**  
  `[All 32 Industries]` `[1. Locked Source Records]` `[2. State & Local Council Gaps]` `[3. Mismatched Data Formats]` `[4. Payment Timeouts & Double Debits]` `[5. Forged Paper Certificates]` `[6. Power & 2G Network Drops]` `[7. High Platform Commissions]` `[8. Paper-Only Laws]`  
* **Accessible Table Columns:** `Industry & Sector` : `Existing Nigerian Platforms Credited First` : `Current Digital Status` : `Everyday Bottleneck Solved` : `Open Standard & Technical Drawer [+]`

## **4.3 Route 3 (`/protocols` & All 14 Local Government Service Modules) Civic Labels (`1440px / 768px / 390px / 320px`)**

* **Left Navigation Tree displays human-first service names first:**  
  * 1\. Citizen Grievance Redress (CouncilComplain)  
  * 2\. Building & Setback Permits (BuildClear)  
  * 3\. Rural Water & Sanitation (WashConnect)  
  * 4\. Market & Shop Licensing (ShopPermit)  
  * 5\. Birth, Death & Marriage Records (VitalProof)  
  * 6\. 72-Hour Indigene Certificate (IndigeneProof)  
  * 7\. Fire & Health Clearances (SafetyNOC)  
  * 8\. Ward Public Works Tracker (WardWorks)  
  * 9\. Property Tenement Rates & Customary Land (TenementRate)  
  * 10\. Market & Motor-Park Revenue \+ Inter-LGA Transit Pass (MarketCollect)  
  * 11\. Ward Primary Healthcare & Immunization (WardPHC)  
  * 12\. Direct Council Treasury & Audit Ledger (CouncilLedger)  
  * 13\. Customary & Area Court Records (CustomaryDocket)  
  * 14\. Digital Street & House Addressing (StreetGrid)
