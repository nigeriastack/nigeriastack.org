# NIGERIASTACK.ORG — CLEAN-ROOM PAN-NIGERIAN SOVEREIGN NAMING SPECIFICATION & PROTOCOL GLOSSARY

- **Document ID:** `NS-STD-2026-KB02-V2`  
- **Canonical Path:** `docs/standards/SOVEREIGN_NAMING_AND_PROTOCOL_GLOSSARY.md`  
- **Status:** `NORMATIVE BASELINE (GATE NS-G1 ENFORCED)`  
- **Governing Skill Harness:** `NS-SH-01` (Whole-of-Economy DPI & Protocol Architect)  
- **Governing Principle:** All protocol names, schema namespaces, URI identifiers, and SDK packages published by `nigeriastack.org` MUST use neutral **Nigerian Institutional English** paired with **Pan-Nigerian Lingua Franca (Pidgin)** descriptive tags. Both foreign `-NG` clone suffixes and single-ethnic sectional terms are strictly prohibited.

---

## 1\. Retired & Prohibited Nomenclature Registry (CI/CD Blocked)

The static CI/CD verifier (`scripts/ci/verify-cleanroom-nomenclature.ts`) will fail any pull request containing the following retired tokens in specification prose, schema `$id` URIs, or TypeScript/Python identifiers:

| Category | Prohibited / Retired Tokens (BLOCKED BY GATE NS-G1) | Reason for Prohibition |
| :---- | :---- | :---- |
| **Category A: Foreign DPI Clone / `-NG` Suffixes** | `DEPA-NG`, `DEPA_NG`, `DepaConsent`, `Beckn-NG`, `ONDC-NG`, `DigiLocker-NG`, `ACDP-NG`, `SGTraDex-NG`, `ngstack-onix`, `Diia.Engine-NG`, `API-Setu-NG`, `Sahamati-NG`, `Aadhaar-NG`, `ng-eyecite`, `NG-RECAP`, `freelaw.org.ng`, `AkomaNtoso-NG` | Violates clean-room engineering originality; imports foreign regulatory assumptions (RBI/MeitY/US PACER) incompatible with Nigerian statutory law. |
| **Category B: Sectionalized Single-Ethnic Terms** | `Igbimọ`, `Igbimo`, `Èrí`, `EriTrust`, `ỌjaOpen`, `OjaOpen`, `Oríta`, `OritaBus`, `Àṣẹ`, `AseAgent`, `Ìpínlẹ̀`, `IpinleKernel`, `Kọrídọ`, `KoridoMesh`, `Àkójọpọ`, `AkojopoSdk` | Violates Federal Character and pan-Nigerian neutrality required for a national specification commons serving all 36 States \+ FCT. |

---

## 2\. Canonical Pan-Nigerian Protocol Primitives (Normative Definitions)

### 2.1 `SureEvidence` Standard (Lingua Franca Tag: `SureProof`)

- **Replaces:** `DigiLocker-NG`, `Èrí Trust Framework`, `Section84Credential`.  
- **Statutory Anchor:** Evidence Act 2011, Section 84(1)–(4) (Admissibility of Statements Produced by Computers) & Section 106 (Proof of Public Documents).  
- **Canonical Namespace URI:** `urn:ngstack:sure-evidence:v2026`  
- **JSON Schema `$id`:** `https://nigeriastack.org/schemas/v2026/SureEvidenceCredential.schema.json`  
- **Technical Scope:** Defines the W3C Verifiable Credential v2.0 envelope embedding:  
  1. `documentDigestSha256` (64-char hex digest of the canonical binary/PDF/JSON payload).  
  2. `section84DeviceAttestation` (`deviceFingerprintSha256`, `operatingConditionState`, `monotonicCounter`, `clockSyncSource`, and verbatim Section 84(4) statutory declaration).  
  3. `issuerEd25519Seal` (Hardware FIDO2/WebAuthn or HSM Ed25519 signature \+ offline-resolvable 300-DPI QR URI).

### 2.2 `ClearanceMesh` Protocol (Lingua Franca Tag: `ClearAm`)

- **Replaces:** `DEPA-NG`, `Igbimọ Protocol`.  
- **Statutory Anchor:** Nigeria Data Protection Act (NDPA) 2023, Sections 24, 25, 28, 30, 31, and 37 & NDPC General Application and Implementation Directive (GAID) 2025\.  
- **Canonical Namespace URI:** `urn:ngstack:clearam:v2026`  
- **JSON Schema `$id`:** `https://nigeriastack.org/schemas/v2026/ClearAmConsentEnvelope.schema.json`  
- **Technical Scope:** Defines machine-readable, cryptographically signed consent and lawful-basis artifacts across all 32 industries. Enforces:  
  1. Zero-knowledge Data Subject identity hashing (`SHA-256` salted digest of `NIN`, `BVN`, `RC`, `TIN`, or `SCN`).  
  2. Explicit `lawfulBasis` (`CONSENT`, `STATUTORY_MANDATE`, `PUBLIC_INTEREST_OPEN_COURT`, `CONTRACTUAL_NECESSITY`) and standardized `purposeCode`.  
  3. Deterministic expiry (`validUntilUtc`) where any expired token MUST trigger an immediate `HTTP 403 CLEARAM_ARTIFACT_EXPIRED` without payload inspection (`RED-CNT-02` invariant).

### 2.3 `OpenMarket` Protocol (Lingua Franca Tag: `MarketLink`)

- **Replaces:** `Beckn-NG`, `ONDC-NG`, `ỌjaOpen Protocol`.  
- **Statutory Anchor:** Federal Competition and Consumer Protection Act (FCCPA) 2018 & FMCIDE Open Commerce Interoperability Guidelines.  
- **Canonical Namespace URI:** `urn:ngstack:marketlink:v2026`  
- **JSON Schema `$id`:** `https://nigeriastack.org/schemas/v2026/MarketLinkOrderContract.schema.json`  
- **Technical Scope:** Unbundles discovery, catalog syndication, order creation, inter-state haulage dispatch, and proof-of-delivery settlement so independent merchants, agricultural cooperatives, restaurants, and logistics fleets can transact across networks without 20–30% aggregator commissions.

### 2.4 `Confluence Gateway` Specification (Lingua Franca Tag: `Junction`)

- **Replaces:** `API-Setu-NG`, `Oríta Interoperability Registry`.  
- **Statutory Anchor:** NITDA National Interoperability Framework & Nigerian Data Exchange (NGDX) Standards.  
- **Canonical Namespace URI:** `urn:ngstack:confluence:v2026`  
- **JSON Schema `$id`:** `https://nigeriastack.org/schemas/v2026/ConfluenceAsyncEnvelope.schema.json`  
- **Technical Scope:** Specifies the asynchronous request/callback envelope (`/initiate` \-\> `/on_initiate`), Ed25519 webhook signature headers (`X-NgStack-Signature-Ed25519`), operation state machines (`ACCEPTED`, `PENDING`, `UNKNOWN_TIMEOUT`, `RESOLVED_SUCCESS`, `RESOLVED_REVERSED`), and idempotent same-reference retry rules.

### 2.5 `Warrant & Mandate` Protocol (Lingua Franca Tag: `GivePower`)

- **Replaces:** `ACDP-NG`, `Àṣẹ Agent Delegation Architecture`.  
- **Statutory Anchor:** NDPA 2023 Section 37 (Automated Decision-Making & Profiling Safeguards) & AAIF Model Context Protocol (MCP) JSON-RPC 2.0.  
- **Canonical Namespace URI:** `urn:ngstack:givepower:v2026`  
- **JSON Schema `$id`:** `https://nigeriastack.org/schemas/v2026/GivePowerAgentMandate.schema.json`  
- **Technical Scope:** Governs how citizens and corporations delegate bounded authority to autonomous AI agents:  
  1. Enforces `READ_ONLY_DEFAULT` execution mode for all MCP tool calls.  
  2. Requires an explicit, time-bounded `humanCountersignatureEd25519` before any state-mutating action can execute.  
  3. Specifies two-phase escrow invariants for HTTP 402 (`x402`) sub-cent settlements (`RED-CNT-03` invariant).

### 2.6 `Federated Local Registry Kernel` (Lingua Franca Tag: `KioskBase`)

- **Replaces:** `Diia.Engine-NG`, `Ìpínlẹ̀ Base Registry Kernel`.  
- **Statutory Anchor:** 1999 Constitution ss. 6(5) & 36(3)–(4); Evidence Act 2011 s. 84; NDPA 2023 ss. 30–31.  
- **Canonical Namespace URI:** `urn:ngstack:kioskbase:v2026`  
- **JSON Schema `$id`:** `https://nigeriastack.org/schemas/v2026/KioskBaseCrdtDelta.schema.json`  
- **Technical Scope:** Defines the `< 35 KB` offline-first Progressive Web App (PWA) registry architecture powered by client-side `SQLite WASM` and **Hybrid Logical Clock (HLC) LWW-Element-Set CRDTs**. Includes kernel-level `INTERNAL_RESTRICTED_NDPA` quarantine flags so sensitive family, juvenile, and medical records never leak to public outboxes.

### 2.7 `TradeCorridor` Interop Framework (Lingua Franca Tag: `PassCargo`)

- **Replaces:** `SGTraDex-NG`, `Kọrídọ Trade & Customs Mesh`.  
- **Statutory Anchor:** Nigeria Customs Service (NCS) Act 2023, SONCAP/NAFDAC Statutory Clearances, & ECOWAS Trade Liberalization Scheme (ETLS).  
- **Canonical Namespace URI:** `urn:ngstack:passcargo:v2026`  
- **JSON Schema `$id`:** `https://nigeriastack.org/schemas/v2026/PassCargoWaybillEvent.schema.json`  
- **Technical Scope:** Harmonizes multi-agency cargo manifests, phytosanitary certificates, SONCAP quality attestations, port terminal release tokens, and interstate waybills into a single verifiable event chain.

### 2.8 `Unified Tooling SDKs` (Lingua Franca Tag: `JoinBody`)

- **Replaces:** `ngstack-onix`, `Àkójọpọ Reference SDKs`.  
- **Canonical Package Scope:** `@nigeriastack/*` (TypeScript/NPM), `nigeriastack_*` (Python/PyPI), `github.com/nigeriastack/joinbody-go` (Go).  
- **Core Packages:**  
  1. `@nigeriastack/sure-evidence-crypto`  
  2. `@nigeriastack/clearam-guard`  
  3. `@nigeriastack/confluence-transport`  
  4. `@nigeriastack/kioskbase-crdt`  
  5. `@nigeriastack/conformance-cli`

### 2.9 `LawTree AST` Standard (Lingua Franca Tag: `StatuteProof`)

- **Replaces:** `AkomaNtoso-NG`, `ng-laws-ast`.  
- **Statutory Anchor:** Laws of the Federation of Nigeria (LFN), 36 State Laws, Practice Directions, & OASIS LegalDocML (Akoma Ntoso 3.0).  
- **Canonical Namespace URI:** `urn:ngstack:lawtree:v2026`  
- **Section URN Grammar:** `urn:lex:ng:{jurisdiction}:act:{year}-{number}#sec_{section}`  
- **JSON Schema `$id`:** `https://nigeriastack.org/schemas/v2026/LawTreeStatuteNode.schema.json`  
- **Technical Scope:** Compiles Federal and 36-State statutes into bi-temporal OASIS Akoma Ntoso 3.0 (`urn:lex:ng:*`) XML/JSON ASTs and executable policy graphs with verbatim bounding-box provenance and 5-locale (`en-NG`, `ha-NG`, `yo-NG`, `ig-NG`, `pcm-NG`) legal-semantic review states.

---

## 3\. Canonical Identifier & URI Grammar (`NS-ID-GRAMMAR`)

| Entity Class | Prefix / URN Pattern | Regex Validation Pattern | Example |
| :---- | :---- | :---- | :---- |
| **Normative RFC** | `NS-RFC-` \+ 3 digits | `^NS-RFC-\d{3}$` | `NS-RFC-005` |
| **Building Block** | `BB-` \+ 2 digits | `^BB-(0[1-9]|1[0-2])$` | `BB-05` |
| **Industry Vertical** | `IND-` \+ 2 digits | `^IND-(0[1-9]|[12]\d|3[0-2])$` | `IND-21` |
| **Gap Failure Mechanism** | `MECH-` \+ 2 digits | `^MECH-0[1-8]$` | `MECH-05` |
| **SureEvidence Certificate** | `s84_` \+ ULID | `^s84_[0-9A-HJKMNP-TV-Z]{26}$` | `s84_01JBM8K9P2Q4R6S8T0V2W4X6Y8` |
| **ClearAm Consent Token** | `clm_` \+ ULID | `^clm_[0-9A-HJKMNP-TV-Z]{26}$` | `clm_01JBM8K9P2Q4R6S8T0V2W4X6Z9` |
| **Confluence Operation ID** | `cop_` \+ ULID | `^cop_[0-9A-HJKMNP-TV-Z]{26}$` | `cop_01JBM8K9P2Q4R6S8T0V2W4X700` |
| **GivePower Agent Mandate** | `gpw_` \+ ULID | `^gpw_[0-9A-HJKMNP-TV-Z]{26}$` | `gpw_01JBM8K9P2Q4R6S8T0V2W4X711` |
| **KioskBase CRDT Delta** | `kbd_` \+ ULID | `^kbd_[0-9A-HJKMNP-TV-Z]{26}$` | `kbd_01JBM8K9P2Q4R6S8T0V2W4X722` |
| **Statutory AST Node** | `urn:lex:ng:` \+ hierarchy | `^urn:lex:ng:[a-z0-9-]+:act:\d{4}-\d+.*$` | `urn:lex:ng:federal:act:2011-18#sec_84` |
