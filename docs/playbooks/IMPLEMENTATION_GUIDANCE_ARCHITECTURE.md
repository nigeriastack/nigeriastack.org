# **NS-KB-04B: Whole-of-Economy Implementation Guidance Architecture & Adoption Playbooks**

**Document ID:** NS-PLAYBOOK-2026-KB04B-V1  
**Canonical Path:** `docs/playbooks/IMPLEMENTATION_GUIDANCE_ARCHITECTURE.md`  
**Governing Skill Harnesses:** NS-SH-01 (Whole-of-Economy DPI & Protocol Architect) & NS-SH-06 (Conformance Test Bed & Reference SDK Engineer)  
Verification Gates: Gate NS-G1 (Protocol Alignment) & Gate NS-G6 (ITB Conformance & SDK Verification)  
**Core Proposition:** *"Make Nigeria's digital systems work together without surrendering statutory authority, operational continuity, evidentiary integrity, or institutional independence."*

---

# **1\. Purpose & Architectural Scope**

Open technical specifications fail if adopting institutions must reverse-engineer 200-page RFCs from scratch (`MECH-08` Developer-Implementation Gap). This document provides concrete, step-by-step Implementation Guidance Playbooks for five core Nigerian adopter archetypes across the Federal, 36-State \+ FCT, 774-LGA, and Private Enterprise landscape:

1. **Playbook A:** Federal Ministries, Departments & Agencies (MDAs) & Statutory Base Registries  
2. **Playbook B:** 36 State Governments, State Judiciaries, Deeds Registries & State IRS (`SIRS`)  
3. **Playbook C:** 774 Constitutional Local Government Areas & 6 FCT Area Councils (`LgaGovernanceStack`)  
4. **Playbook D:** Commercial Banks, Fintechs, Insurers, HMOs, Logistics & Sectoral Operators  
5. **Playbook E:** Autonomous AI Agent Builders & Model Context Protocol (MCP) Integrators

---

# **2\. Playbook A: Federal MDAs & Statutory Base Registries (NIMC, CAC, NIBSS, NRS, NJC, NCS, FMOH)**

## **2.1 Architectural Principle: Zero Master-Database Surrender**

Federal MDAs retain 100% physical and legal custody of their master databases. Adopting `nigeriastack.org` requires deploying only a lightweight, stateless Outward Verification & Webhook Adapter in front of existing agency databases.

## **2.2 4-Step Implementation Sequence**

1. **Step 1 — Expose Signed Zero-Knowledge Verification Endpoints (`BB-01` / `SureProof-ID`):**  
   Instead of returning raw citizen PII rows over REST, return a signed `SureEvidence` W3C Verifiable Credential (`urn:ngstack:sure-evidence:v2026`) attesting whether the queried attribute (e.g., `NIN`, `RC`, `TIN`, `SCN`, `SONCAP`) matches the salted hash in the `ClearAm` consent token.  
2. **Step 2 — Implement Asynchronous `Confluence` Callbacks (`BB-03` / `NS-RFC-002`):**  
   For long-running clearances (e.g., NCS `PassCargo` port release or CAC post-incorporation filings), return `HTTP 202 Accepted` with a `cop_` ULID operation ID and emit an Ed25519-signed `/on_initiate` webhook upon completion.  
3. **Step 3 — Enforce `ClearAm` Statutory Purpose & Expiry Checks (`BB-04` / `NS-RFC-006`):**  
   Install `@nigeriastack/clearam-guard` middleware to reject any request whose `validUntilUtc` has lapsed with a deterministic `HTTP 403 CLEARAM_ARTIFACT_EXPIRED` before touching the database.  
4. **Step 4 — Run Self-Service ITB Certification (`Gate NS-G6`):**  
   Execute `npx @nigeriastack/conformance-cli --profile federal-mda --endpoint https://sandbox.mda.gov.ng` to generate a signed SHA-256 conformance receipt.

---

# **3\. Playbook B: 36 State Governments, State Judiciaries, Land Bureaus & State IRS (`SIRS`)**

## **3.1 Architectural Principle: Offline-First Edge Continuity & Section 121(3) CFRN Fiscal Autonomy**

State deployments solve `MECH-02` (Sub-National Coverage Gap), `MECH-05` (Section 84 Evidentiary Admissibility), and MECH-06 (Power/2G Connectivity Drops) without surrendering state revenues to private escrow.

## **3.2 4-Step Implementation Sequence**

1. **Step 1 — Deploy `KioskBase` Offline-First Registry Nodes (`BB-02` / `NS-RFC-004`):**  
   * Provision the `< 35 KB` Progressive Web App shell backed by client-side `SQLite WASM` and **Hybrid Logical Clock (HLC) CRDTs** across State High Court divisions, Magistracies, and State Deeds Registries.  
   * Configure automatic clock-drift detection (`> 300s` flags `DEGRADED_LOCAL_HLC` until cellular NTP/GPS resynchronization).  
2. **Step 2 — Provision Hardware FIDO2 / Ed25519 Registrar Keys (`BB-05` / `NS-RFC-005`):**  
   Issue low-cost FIDO2 WebAuthn hardware keys to Chief Registrars, Deeds Registrars, and certifying officers using `@nigeriastack/sure-evidence-crypto`. Every Certified True Copy (CTC), Probate Grant, and Land Search Certificate embeds an automated **Evidence Act 2011 Section 84(4) Certificate of Regularity** and 300-DPI offline-verifiable QR code.  
3. **Step 3 — Lock Statutory Privacy Quarantine at the Database Kernel (`NDPA Gate 10`):**  
   Enable PostgreSQL 17 `FORCE ROW LEVEL SECURITY` locking matrimonial (`HD/`, `WD/`), juvenile, adoption, and medical dockets inside `INTERNAL_RESTRICTED_NDPA` so they can never be exported to public outboxes.  
4. **Step 4 — Bind `SplitDirect` 100% Treasury Pass-Through (`BB-06` / `NS-RFC-009`):**  
   Configure Remita / State IRS payment webhooks with `platform_escrow_amount_kobo = 0`, routing 100% of statutory court and land fees directly into the State Consolidated Revenue Fund (CRF) or Judiciary Account under Section 121(3) CFRN.

---

# **4\. Playbook C: 774 Constitutional LGAs & 6 FCT Area Councils (`LgaGovernanceStack`)**

## **4.1 Architectural Principle: Fourth-Schedule Service Delivery & `SC/CV/343/2024` Direct Treasury Control**

Pursuant to Section 7(1) and the Fourth Schedule of the 1999 Constitution and the Supreme Court judgment in AG Federation v. AG Abia State & 35 Ors (SC/CV/343/2024), all 774 LGAs can deploy standardized municipal services without custom software capex or cash-touting leakage.

## **4.2 Phased Rollout of the 14 `LgaGovernanceStack` Modules (`NS-RFC-014`)**

* **Wave 1 (Days 1–30 — Direct Revenue & Zero-Cash-Touting Foundation):**  
  Deploy **`LGA-10` (`MarketCollect`)** on offline-capable POS/USSD terminals across motor parks, open markets, abattoirs, and loading bays, paired with **`LGA-09` (`TenementRate`)** and **`LGA-12` (`CouncilLedger`)**. All collections settle 100% directly into the LGA's sovereign treasury account (`SplitDirect`).  
* **Wave 2 (Days 31–60 — High-Volume Citizen Certificates & Licensing):**  
  Activate **`LGA-06` (`IndigeneProof`)** and **`LGA-05` (`VitalProof`)** issuing FIDO2 Ed25519 `SureEvidence` QR-sealed LGA Indigene/Residency and Birth/Death/Marriage certificates, alongside **`LGA-04` (`ShopPermit`)** and **`LGA-01` (`CouncilComplain`)**.  
* **Wave 3 (Days 61–90 — Ward Health, WASH, Public Works & Customary Courts):**  
  Activate **`LGA-11` (`WardPHC`)** for primary healthcare & immunization micro-planning, **`LGA-03` (`WashConnect`)** for rural borehole O\&M and sanitation desludging, **`LGA-08` (`WardWorks`)**, **`LGA-13` (`CustomaryDocket`)**, and **`LGA-14` (`StreetGrid`)**.

---

# **5\. Playbook D: Commercial Banks, Fintechs, HMOs, Logistics & Sectoral Operators**

## **5.1 4-Step Integration Checklist**

1. **Adopt Idempotent Workflow State Machines (`BB-03` / `NS-RFC-003`):**  
   Replace naive HTTP timeout retries with `@nigeriastack/confluence-transport`, preserving `UNKNOWN_TIMEOUT` states and enforcing same-reference reuse (`cop_` ULID) to eliminate double-debiting on payment transfers.  
2. **Consume Multi-Sector `ClearAm` Templates (`BB-04` / `NS-RFC-006`):**  
   Use standardized consent templates (`FIN-MSME-CREDIT-UNDERWRITING`, `LAW-LITIGATION-CLEARANCE`, `HLTH-PATIENT-RECORD-TRANSFER`, `EDU-DEGREE-VERIFICATION`, `AGRI-FARM-INPUT-FINANCING`) to combine Open Banking cash-flow data with court encumbrance and land title checks in a single consented workflow.  
3. **Join Unbundled `MarketLink` & `PassCargo` Networks (`BB-07` & `BB-08`):**  
   Publish merchant catalogs, courier fulfillment rates, or clearing manifests using `MarketLinkOrderContract.schema.json` and `PassCargoWaybillEvent.schema.json`.  
4. **Verify Counterparty `SureEvidence` QR Seals Offline (`BB-05`):**  
   Embed `@nigeriastack/sure-evidence-crypto` in bank credit desks, HMO claims portals, and employer HR systems to cryptographically verify court orders, academic diplomas (`SureLearn`), and medical claims in under 50ms.

---

# **6\. Playbook E: Autonomous AI Agent Builders & MCP Tool Integrators (`GivePower`)**

## **6.1 Mandatory Safety & Settlement Guardrails (`BB-12` / `NS-RFC-008`)**

1. **Default Read-Only Sandboxing:** Every MCP tool definition registered against Nigeria Stack schemas MUST default to `executionMode: "READ_ONLY_DEFAULT"`.  
2. **Human-in-the-Loop Countersignature (`NDPA s. 37`):** Any state-mutating agent action (e.g., initiating a filing, transferring funds, revoking consent) MUST carry a valid `humanCountersignatureEd25519` from the delegating principal.  
3. **Two-Phase HTTP 402 (`x402`) Escrow Invariance (`RED-CNT-03`):** Sub-cent machine settlements remain in two-phase cryptographic escrow and release to the downstream provider only upon verified delivery of a schema-valid JSON-RPC 200 payload.

---

# **7\. Self-Service Conformance Certification Workflow (`@nigeriastack/conformance-cli`)**

Every adopter completes verification in three deterministic commands without paying certification fees:

# **1\. Validate local OpenAPI 3.1.1 & JSON Schema 2020-12 payloads \+ Clean-Room Nomenclature**

npx @nigeriastack/conformance-cli lint \--dir ./specs

# **2\. Run Provider-Specific Network Failure & Recovery Scenario Packs (2G drops, delayed webhooks, clock drift)**

npx @nigeriastack/conformance-cli simulate \--profile confluence-async-recovery \--target http\://localhost:8787

# **3\. Execute Gherkin BDD Conformance Suite & Emit Signed SHA-256 Attestation Receipt**

npx @nigeriastack/conformance-cli certify \--bb BB-02,BB-05,BB-06 \--out ./conformance-receipt.json  
---

# **8\. 774-LGA Playbook Persona, Pain-Point & 14-Module Crosswalk (NS-RFC-014 & LgaGovernanceStack Alignment)**

To ensure seamless operational mapping across sub-national deployments, the 7 Playbook Audience Clusters align directly with the 14 municipal modules of the `LgaGovernanceStack` (`NS-RFC-014`), mapped dynamically across sub-national routes `/atlas/states/:state_code` and `/atlas/lga-774/:state_code/:lga_code` via the `nigeriastack/subnational-readiness-atlas` repository:

1. **Cluster 1 — Court Registrars & Customary Clerks:** Integrates with **`LGA-13`** (`CustomaryDocket`) for digitally signed customary records and Section 84 evidentiary compliance.  
2. **Cluster 2 — Legal Practitioners & Litigators:** Connects with **`LGA-05`** (`VitalProof`) and **`LGA-06`** (`IndigeneProof`) to verify verified status and vital statistics certificates.  
3. **Cluster 3 — State/LGA Executives & Treasurers:** Drives zero-cash-touting fiscal collection via **`LGA-09`** (`TenementRate`), **`LGA-10`** (`MarketCollect`), and **`LGA-12`** (`CouncilLedger`) under `SC/CV/343/2024` autonomy.  
4. **Cluster 4 — Corporate & Bank Risk Officers:** Leverages **`LGA-04`** (`ShopPermit`) and **`LGA-14`** (`StreetGrid`) for physical address verification and commercial operating license validation.  
5. **Cluster 5 — AI & System Integrators:** Binds **`LGA-02` (`BuildClear`)** and **`LGA-07` (`SafetyNOC`)** to MCP tool specifications and automated workflow agents.  
6. **Cluster 6 — Grassroots Citizens & Traders:** Interacts with **`LGA-01`** (`CouncilComplain`), **`LGA-03`** (`WashConnect`), and **`LGA-11`** (`WardPHC`) for essential municipal service requests and healthcare access.  
7. **Cluster 7 — Civic Researchers & Auditors:** Utilizes **`LGA-08`** (`WardWorks`) alongside the Subnational Readiness Atlas routes to monitor public works completion and treasury transparency.

---

# **9\. The Five Tests (01 Exit, 02 Code, 03 Audit, 04 Govern, 05 Fork) & Grassroots 774-LGA Pain-Point Safeguards (RED-AUDIT-01 to RED-AUDIT-07 Patch)**

## **9.1 Inter-LGA Commercial Vehicle Corridor Pass (`LGA-10 MarketCollect` Anti-Double-Taxation Rule)**

Haulage trucks, minibuses, and agricultural pickups holding a valid `SureEvidence` daily or annual transit emblem (`s84_` ULID) issued by a participating origin/corridor node MUST be verifiable offline via 300-DPI QR scan (\< 50ms) across all intermediate LGAs, blocking unlawful roadside cash touting and multiple taxation.

## **9.2 72-Hour Statutory SLA, USSD/NIN Vouching & Fee-Cap Invariance on `LGA-06 IndigeneProof`**

To prevent youth applicants (military, police, civil service, scholarship) from being delayed or extorted for weeks awaiting physical ward-head signatures, `LGA-06` (`IndigeneProof`) enforces a **72-Hour Statutory Issuance SLA**, supports zero-data USSD (`*347*LGA#`) community vouching by registered traditional/ward authorities, and locks the statutory fee schedule inside `SplitDirect` (`platform_escrow_amount_kobo == 0`).

## **9.3 Zero-Smartphone / 2G Feature-Phone Accessibility (`*347*LGA#` USSD & 5-Locale SMS Receipts)**

Every `LgaGovernanceStack` deployment MUST expose zero-data USSD and 5-locale (`en-NG`, `ha-NG`, `yo-NG`, `ig-NG`, `pcm-NG`) SMS verification for `LGA-01` (`CouncilComplain`), `LGA-05` (`VitalProof`), `LGA-10` (`MarketCollect`), and `LGA-11` (`WardPHC`), ensuring no citizen is denied municipal services for lacking a smartphone or data plan (01 Exit).

## **9.4 Land Use Act 1978 Section 6 Customary Right of Occupancy (Customary C of O) & `LGA-13 CustomaryDocket` Linkage**

Before an LGA issues a Customary Right of Occupancy or assesses `LGA-09` (`TenementRate`), the LandGuard 3×3m polygon check MUST query `LGA-13` (`CustomaryDocket`) and the State High Court lis pendens index to prevent double-allocation during active family inheritance or boundary litigation.
