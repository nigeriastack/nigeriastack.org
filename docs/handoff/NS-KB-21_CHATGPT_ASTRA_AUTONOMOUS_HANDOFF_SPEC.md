# NIGERIASTACK.ORG — GPT-6 ASTRA / GPT-6.1 SOL AUTONOMOUS AGENTIC HANDOFF, HEADLESS CHROMIUM ARTBOARD VERIFICATION, CLOUDFLARE EDGE DEPLOYMENT & 7-REPOSITORY EXECUTION SPECIFICATION

- **Document ID:** `NS-KB-21-ASTRA-HANDOFF-V2026.6.5`
- **Canonical Repository Path:** `docs/handoff/NS-KB-21_CHATGPT_ASTRA_AUTONOMOUS_HANDOFF_SPEC.md`
- **Target OpenAI Agentic Surfaces:**
  - **Primary Reasoning & Architecture Lead:** `gpt-6-astra` (`reasoning_effort: "high"` | `1.05M` context / `128K` max output)
  - **High-Throughput Multi-Repo Code & Migration Worker:** `gpt-6.1-sol` (`reasoning_effort: "medium"`)
  - **Computer-Use & Headless Chromium Visual QA Worker:** `gpt-6.1-terra` (Playwright DOM & 4-Viewport / Zoom Telemetry)
  - **Supported Runtimes:** OpenAI Codex CLI (`rust-v0.159.1+`), ChatGPT Work Cloud (Reusable Codex Cloud Environments), OpenAI Responses API Hosted Shell Container, and ChatGPT Dots (Always-On Repo Monitor).
- **Governing Skill Harnesses:** `.agents/skills/ns-sh-01..06/SKILL.md` (`NS-SH-01` Whole-of-Economy DPI Architect, `NS-SH-02` 32-Industry & 774-LGA Gap Analyst, `NS-SH-03` Civic-Voice Content & RAG Architect, `NS-SH-04` 4-Viewport Swiss-Blueprint Designer, `NS-SH-05` Anti-Slop W3C DTCG Token & Craft Engineer, `NS-SH-06` Conformance CLI & Edge Portal Builder)
- **Workspace Isolation Invariant:** Strictly scoped to `nigeriastack-org` (`https://nigeriastack.org` and `https://github.com/nigeriastack/*`). 100% decoupled from `JusticeLENS-fullstack-dev` and all sibling commercial or operational domains (`midl.ng`, `api.net.ng`, `courts.com.ng`, `openlaw.org.ng`, `justicelens.ng`).
- **License & Governance Baseline:** `CC0-1.0 Universal (Public Domain Dedication)` for all specifications, schemas, datasets, and playbooks; `Apache-2.0 / MIT` for all reference SDKs, CLI runners, and web portal source code.

---

## 1. ASTRA 5-BLOCK DETERMINISTIC CONTROL HEADER (`GOAL` / `CONTEXT` / `INSTRUCTION_PRIORITY` / `AUTONOMY` / `COMPLETION`)

Paste this block directly as the initial task prompt in ChatGPT Work, Codex CLI, or the Responses API orchestrator:

```yaml
GOAL:
  Hydrate, verify, build, and deploy the complete 7-repository Nigeria Stack open specification and conformance commons (`[github.com/nigeriastack/](https://github.com/nigeriastack/)*` and `[https://nigeriastack.org](https://nigeriastack.org)`, release baseline `v2026.6.5`) from the 30 verified artifacts (`NS-KB-01` through `NS-KB-21`), enforcing 100% pass rates across Gates NS-G1 through NS-G6, native Chromium 4-viewport + 200%/400% zoom DOM verification (`NS-KB-17` & `NS-KB-18`), Cloudflare D1 FTS5 SQLite migration (`0001_ngstack_d1_fts5_schema.sql`), and a < 35 KB gzipped initial shell.

CONTEXT:
  - Authoritative Source Artifacts (Read-First by Task):
    1. Precedence & Governance: `docs/content/authority-and-precedence.md` (NS-KB-12B) & `docs/governance/NIGERIA_STACK_INSTITUTIONAL_CHARTER.md` (NS-KB-01).
    2. Clean-Room Nomenclature & Tokens: `docs/standards/SOVEREIGN_NAMING_AND_PROTOCOL_GLOSSARY.md` (NS-KB-02), `design-system/tokens/nigeriastack.dtcg.tokens.json` (NS-KB-04A), `design-system/tokens/tokens.css` (NS-KB-16).
    3. Normative RFCs & Schemas: `specs/rfcs/NS-RFC-001..014.md` (NS-KB-05..07), `specs/openapi/v2026/*.yaml`, `specs/schemas/json-schema-2020-12/*.json` (NS-KB-08), `specs/clearam-templates/*.json` (NS-KB-09).
    4. Canonical Datasets: `content/taxonomy/master-32-industry-matrix.json` (NS-KB-03A), `content/atlas/subnational-36states-fct-atlas.json` (NS-KB-03B), `content/atlas/lga-774-constitutional-registry.json` (NS-KB-03C), `content/atlas/lga-14-service-modules-spec.json` (NS-KB-03D), `content/canonical/audited-faq-nigeriastack-15.json` (NS-KB-12A), `content/canonical/rag-geo-aeo-15-benchmarks.json` (NS-KB-13).
    5. Authoritative Pixel-Accurate DOM Artboards: `design-system/hifi-artboards/batch1-architecture-sectors-protocols-rfcs.html` (NS-KB-17) and `design-system/hifi-artboards/batch2-conformance-atlas-governance.html` (NS-KB-18). Raster diffusion images are conceptual previews only; `NS-KB-17` and `NS-KB-18` are the authoritative zero-typo DOM sources of truth.

INSTRUCTION_PRIORITY:
  1. Statutory & Constitutional Invariants (1999 CFRN s. 121(3) & Fourth Schedule, Supreme Court `SC/CV/343/2024` Direct LGA Treasury Pass-Through `platform_escrow_amount_kobo == 0`, Evidence Act 2011 s. 84 & s. 106, NDPA 2023 ss. 24–37).
  2. Platform-Enforced Hard Gates (`scripts/ci/verify-cleanroom-nomenclature.ts`, `scripts/ci/validate-tokens.sh`, OPA Rego `ndpa-statutory-boundary-rules.rego`, Playwright 4-Viewport + 200%/400% Zoom Telemetry, `< 35,840` byte gzipped shell cap).
  3. Zero Cross-Domain Brand Bleed (`UX-RED-01`), Zero SaaS Account/Paywall Chrome (`UX-RED-02`), and Zero Backend Variable Bleed in Primary Civic UI (`v2026.6.5`).
  4. OpenAI GPT-6 Astra Anti-Slop & Podmajersky 4-Step Civic Voice (`[1. User Task] -> [2. Supported Primary Specification/Evidence] -> [3. Material Scope/Statutory Boundary] -> [4. Concrete Technical Action]`).

AUTONOMY:
  - Execute all reversible file hydration, compilation, static AST linting, D1 local SQLite seeding, OPA Rego testing, Gherkin ITB verification, and Playwright headless Chromium rendering autonomously without pausing to ask for human confirmation.
  - For non-critical implementation details, make deterministic assumptions grounded in `NS-KB-01..20C` and append them with confidence tags (`VERIFIED`, `CORROBORATED`, `INFERRED`) to `docs/design-system/assumptions.log`.
  - Never invent ULIDs, statutory citations, state/LGA codes, cryptographic keys, or benchmark scores.
  - After any state-mutating command (`wrangler d1 migrations apply`, `git commit`), verify whether the state change already succeeded before retrying.
  - Pause and escalate to the human operator ONLY before executing irreversible production external mutations (live Cloudflare DNS zone cutover or production secret rotation).

COMPLETION:
  The task is finished ONLY when:
  1. All 7 repository worktrees (`Repos 1–7`) pass `verify-cleanroom-nomenclature.ts` and `validate-tokens.sh` with exit code `0`.
  2. Native Chromium Playwright tests (`verify-dom-artboards-and-zoom.spec.ts`) pass across `1440px`, `768px`, `390px`, `320px` (400% zoom), and `200%` text-spacing override with `horizontalOverflowPx == 0` and `typos == 0`, emitting `tests/telemetry/nigeriastack-viewport-telemetry.json`.
  3. All 5 Gherkin ITB scenarios (`ITB-01` to `ITB-05`) and OPA Rego policies pass 100%.
  4. `apps/web` builds cleanly with an initial gzipped HTML/CSS/runtime shell `<= 35,840 bytes` (`< 35 KB`) and D1 FTS5 migration `0001_ngstack_d1_fts5_schema.sql` applied and verified.
  5. Every executed terminal verification command and modified file path is cited in the final completion ledger (zero unverified completion claims).
```

---

## 2. ROOT `AGENTS.MD` SPECIFICATION (CUSTOMIZED FOR GPT-6 ASTRA & CODEX CLI)

Save the following file to `nigeriastack-org/AGENTS.md`. In accordance with OpenAI's September 2026 *"Rethinking skills and prompts for GPT-6 Astra"* guidelines, it keeps global rules compact, enforces task-tied reading rules, prevents test-suite ballooning, and enforces the official Astra Anti-Slop blocklist:

```markdown
# AGENTS.md — NigeriaStack.org (`v2026.6.5`) Autonomous Agent Contract

## 1. Mission & Non-Negotiable Platform Boundaries
You are operating inside the isolated `nigeriastack-org` workspace (`[https://nigeriastack.org](https://nigeriastack.org)` and `[https://github.com/nigeriastack/](https://github.com/nigeriastack/)*`).
- **Strict Workspace Isolation (`UX-RED-01`):** Never import, reference, or link `JusticeLENS` as a parent brand, nor bleed commercial chrome from `midl.ng`, `api.net.ng`, `courts.com.ng`, `openlaw.org.ng`, or `justicelens.ng`.
- **Zero SaaS Login or Paywall Chrome (`UX-RED-02`):** Never render `Sign In`, `Sign Up`, `Request API Key`, `Pricing`, or `Book a Demo` buttons.
- **Zero Backend Variable Bleed in Primary Civic UI (`v2026.6.5`):** Primary headings, lead decks, filter pills, status badges, and table headers MUST use human-first civic labels (`[✓ Live Digital Service]`, `[? Active Pilot Program]`, `[0 Paper-Only Registry]`, `[.. Not Yet Assessed]`). Raw database columns (`platform_escrow_amount_kobo == 0`), ULID prefixes (`s84_`, `clm_`, `cop_`, `gpw_`, `kbd_`), and internal diagnostic codes (`MECH-01..08`, `BB-01..12`) MUST stay inside `<details class="ns-tech-drawer">` or right-hand developer code tabs.
- **Defensive Compliance Framing (Astra Preparedness Guardrail):** All security and policy tasks in this repository are strictly **defensive static AST checks, OPA Rego boundary validations, and W3C/NDPA conformance verifications**. Never generate offensive exploit payloads.

## 2. Task-Tied Reading & Modular Skill Routing (Rule 3, 4 & 5)
Do NOT load all 30 workspace documents into context simultaneously. Load only the skill and upstream files matching your current task:
- **Protocol, RFC & Schema Tasks (`Repos 1 & 4`):** Read `.agents/skills/ns-sh-01-dpi-protocol-architect/SKILL.md` + `docs/standards/SOVEREIGN_NAMING_AND_PROTOCOL_GLOSSARY.md` + target `specs/rfcs/NS-RFC-*.md`.
- **32-Industry, 36-State & 774-LGA Atlas Tasks (`Repos 2 & 3`):** Read `.agents/skills/ns-sh-02-industry-gap-analyst/SKILL.md` + `content/atlas/*.json`.
- **Webcopy, FAQ & RAG/AEO Tasks (`Repo 7 Content`):** Read `.agents/skills/ns-sh-03-blueprint-content-architect/SKILL.md` + `docs/content/authority-and-precedence.md`.
- **Wireframe, W3C DTCG Token & DOM Artboard Tasks (`Repo 7 UI`):** Read `.agents/skills/ns-sh-04-swiss-wireframe-designer/SKILL.md` and `.agents/skills/ns-sh-05-antislop-dtcg-craft-engineer/SKILL.md` + `design-system/tokens/nigeriastack.dtcg.tokens.json`.
- **SDK, Conformance CLI & Cloudflare Worker/D1 Tasks (`Repos 5, 6 & 7`):** Read `.agents/skills/ns-sh-06-conformance-sdk-builder/SKILL.md` + `apps/web/wrangler.toml`.

## 3. Sub-Agent Delegation Policy (Astra + Sol + Terra)
GPT-6 Astra defaults to executing tasks solo unless explicitly instructed to delegate. Enforce this routing split:
1. **`gpt-6-astra` (`reasoning_effort: "high"`):** Owns cross-repo dependency resolution, `0001_ngstack_d1_fts5_schema.sql` verification, `ndpa-statutory-boundary-rules.rego` policy logic, and final 6-gate release sign-off.
2. **Delegate to `gpt-6.1-sol` (`reasoning_effort: "medium"`):** Delegate parallel package builds (`@nigeriastack/sure-evidence-crypto`, `@nigeriastack/clearam-guard`, `@nigeriastack/confluence-transport`, `@nigeriastack/kioskbase-crdt`, `@nigeriastack/lga-kiosk-kit`) and D1 JSON seed script generation.
3. **Delegate to `gpt-6.1-terra` (`reasoning_effort: "medium"`):** Delegate headless Chromium Playwright rendering (`verify-dom-artboards-and-zoom.spec.ts`) across `1440px`, `768px`, `390px`, and `320px`.

## 4. Check With Purpose — Test Proportionality Rule (Rule 6)
Do NOT write sprawling, redundant unit test files for single-line copy or CSS token edits. Run only the targeted verification gate that governs the modified file:
- Modified `.md` / `.ts` naming -> `npx tsx scripts/ci/verify-cleanroom-nomenclature.ts`
- Modified `.css` / `.html` / `.tsx` -> `bash scripts/ci/validate-tokens.sh`
- Modified DOM layout / artboards -> `npx playwright test tests/telemetry/verify-dom-artboards-and-zoom.spec.ts`
- Modified SDKs / Rego / Gherkin -> `pnpm --filter @nigeriastack/conformance-cli test`

## 5. GPT-6 Astra Anti-Slop & Civic Writing Rules
- **Banned Slop Vocabulary:** Never use `"delve"`, `"foster"`, `"leverage"`, `"tapestry"`, `"testament"`, `"underscore"`, `"pivotal"`, `"seamless"`, `"empower"`, `"unlock"`, `"game-changer"`, or rhetorical contrasts like `"This isn't about X. It's about Y."`
- **Banned Synthetic Hyphenated Compounds:** Never invent compound adjectives such as `"editorial-row layouts"`, `"exact-head checks"`, or `"trust-first mesh"`.
- **Banned Summary Closings:** Never end sections with `"In short:"`, `"Bottom line:"`, or `"The simplest mental model is:"`. State the concrete technical or statutory action directly.

## 6. Git & Pre-Commit Discipline
- Do not create unrequested feature branches; commit atomically per wave (`Wave 1` through `Wave 5`).
- Wait for all background shell processes to complete or explicitly terminate them before finishing a turn.
- If a pre-commit hook or CI gate fails, inspect the exact stderr output, remediate the root cause in-place, and re-run the gate before reporting completion.
```

---

## 3. CODEX CLOUD / RESPONSES API HOSTED SHELL CONTAINER SETUP

Configure the reusable **Codex Cloud Environment** (or OpenAI Responses API Hosted Container) with the following deterministic setup script and network allowlist so secret values remain outside model-visible context (`placeholder injection only`):

### 3.1 Container Environment & Network Policy (`codex-environment.json`)
```json
{
  "environment_name": "nigeriastack-org-v2026-6-5",
  "base_image": "[mcr.microsoft.com/playwright:v1.49.0-noble](https://mcr.microsoft.com/playwright:v1.49.0-noble)",
  "node_version": "22.11.0",
  "package_managers": ["pnpm@9.14.0"],
  "system_binaries": ["sqlite3", "opa", "gzip", "jq", "git"],
  "network_policy": {
    "mode": "allowlist",
    "allowed_domains": [
      "registry.npmjs.org",
      "github.com",
      "api.github.com",
      "api.cloudflare.com",
      "nigeriastack.org"
    ]
  },
  "secret_placeholders": {
    "CLOUDFLARE_API_TOKEN": "$SECRET_CF_API_TOKEN",
    "CLOUDFLARE_ACCOUNT_ID": "$SECRET_CF_ACCOUNT_ID",
    "GITHUB_TOKEN": "$SECRET_GH_ORG_TOKEN"
  }
}
```

### 3.2 Workspace Hydration & Pre-Flight Script (`scripts/ci/astra-container-bootstrap.sh`)
```bash
#!/usr/bin/env bash
set -euo pipefail

echo "=== [ASTRA / CODEX CLOUD] Hydrating NigeriaStack.org Workspace (v2026.6.5) ==="

mkdir -p nigeriastack-org/{.agents/skills,.github/workflows,docs/{governance,standards,research,playbooks,content,wireframes,design-system,handoff},content/{taxonomy,atlas,canonical},specs/{rfcs,openapi/v2026,schemas/json-schema-2020-12,clearam-templates},design-system/{tokens,hifi-artboards},packages/{joinbody-sure-evidence-crypto,joinbody-clearam-guard,joinbody-confluence-transport,joinbody-kioskbase-crdt,joinbody-lga-kiosk-kit,conformance-cli},apps/web/{src/{routes,components,db,middleware},public/.well-known,migrations},scripts/ci,tests/{conformance-itb,telemetry/screenshots}}

# Install Git Pre-Commit Platform Rule (Platform Limit > Prompt Request)
cat << 'EOF' > .git/hooks/pre-commit
#!/usr/bin/env bash
set -euo pipefail
echo "[PLATFORM GUARDRAIL] Enforcing Clean-Room Nomenclature & Zero-Literal CSS Token Gates..."
npx tsx scripts/ci/verify-cleanroom-nomenclature.ts
bash scripts/ci/validate-tokens.sh
EOF
chmod +x .git/hooks/pre-commit

echo "[PASS] Workspace hydrated and platform pre-commit guardrails locked."
```

---

## 4. PIXEL-ACCURATE NATIVE CHROMIUM ARTBOARD VERIFICATION & 4-VIEWPORT + 200%/400% ZOOM TELEMETRY SUITE (`GATE T2` & `GATE NS-G5`)

Execute the following Playwright headless Chromium suite (`tests/telemetry/verify-dom-artboards-and-zoom.spec.ts`) via the `gpt-6.1-terra` computer-use / browser runner or local container shell against **`design-system/hifi-artboards/batch1-architecture-sectors-protocols-rfcs.html` (`NS-KB-17`)** and **`design-system/hifi-artboards/batch2-conformance-atlas-governance.html` (`NS-KB-18`)**, as well as the compiled TanStack Start routes (`Routes 1–7`):

```typescript
// File: tests/telemetry/verify-dom-artboards-and-zoom.spec.ts
import { test, expect } from '@playwright/test';

const ARTBOARDS = [
  {
    id: 'NS-KB-17',
    path: 'file://' + process.cwd() + '/design-system/hifi-artboards/batch1-architecture-sectors-protocols-rfcs.html',
    routes: ['/', '/sectors', '/protocols', '/rfcs'],
    requiredCopyStrings: [
      'Make Nigeria’s digital systems work together without surrendering statutory authority',
      '1. Citizen Grievance Redress (CouncilComplain)',
      '10. Market & Motor-Park Revenue Collection (MarketCollect)',
      '14. Digital Street Addressing & Property Numbering (StreetGrid)',
      'SC/CV/343/2024',
      'CC0-1.0 PUBLIC DOMAIN'
    ]
  },
  {
    id: 'NS-KB-18',
    path: 'file://' + process.cwd() + '/design-system/hifi-artboards/batch2-conformance-atlas-governance.html',
    routes: ['/conformance', '/atlas/states', '/atlas/lga-774', '/governance'],
    requiredCopyStrings: [
      '774 Constitutional Local Government Areas',
      '[✓ Live Digital Service]',
      '[? Active Pilot Program]',
      '[0 Paper-Only Registry]',
      '[.. Not Yet Assessed]',
      '01 Exit',
      '02 Code',
      '03 Audit',
      '04 Govern',
      '05 Fork'
    ]
  }
];

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'reflow-320-400pct-zoom', width: 320, height: 640 } // WCAG 2.2 SC 1.4.10 400% Zoom Equivalent
];

for (const artboard of ARTBOARDS) {
  for (const vp of VIEWPORTS) {
    test(`[${artboard.id}] Native Chromium DOM Audit @ ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(artboard.path, { waitUntil: 'networkidle' });

      // 1. Assert Zero Horizontal Overflow (WCAG 2.2 SC 1.4.10)
      const overflowPx = await page.evaluate(() => {
        return Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth);
      });
      expect(overflowPx, `Horizontal overflow detected at ${vp.name}`).toBe(0);

      // 2. Assert 100% Zero-Typo Copy Fidelity, Zero Prohibited Chrome & Zero Astra Slop Words
      const bodyText = await page.locator('body').innerText();
      for (const expectedStr of artboard.requiredCopyStrings) {
        expect(bodyText).toContain(expectedStr);
      }
      const forbiddenTokens = [
        'JusticeLENS',
        'JusticLENS',
        'Sign in',
        'Sign up',
        'ACCESS API CORE',
        '374-LGA',
        'delve',
        'tapestry',
        'In short:'
      ];
      for (const forbidden of forbiddenTokens) {
        expect(bodyText).not.toContain(forbidden);
      }

      // 3. Test WCAG 2.2 SC 1.4.4 (200% Text Zoom) & SC 1.4.12 (Text Spacing Override)
      await page.addStyleTag({
        content: `
          html { font-size: 200% !important; }
          * {
            line-height: 1.5 !important;
            letter-spacing: 0.12em !important;
            word-spacing: 0.16em !important;
          }
          p { margin-bottom: 2em !important; }
        `
      });

      const zoomOverflowPx = await page.evaluate(() => {
        return Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth);
      });
      expect(zoomOverflowPx, `200% Zoom + SC 1.4.12 Text-Spacing overflow at ${vp.name}`).toBe(0);

      // 4. Emit Pixel-Accurate Screenshot Artifact
      await page.screenshot({
        path: `tests/telemetry/screenshots/${artboard.id}-${vp.name}-verified.png`,
        fullPage: true
      });
    });
  }
}
```

### 4.1 CLI Command to Execute Native Chromium Artboard Rendering & Visual Regression
```bash
npx playwright test tests/telemetry/verify-dom-artboards-and-zoom.spec.ts --reporter=json > tests/telemetry/nigeriastack-viewport-telemetry.json
```

---

## 5. CLOUDFLARE D1 FTS5 SQLITE SCHEMA MIGRATION (`0001_ngstack_d1_fts5_schema.sql`)

Save and execute the following complete D1 SQLite schema (`apps/web/migrations/0001_ngstack_d1_fts5_schema.sql` — with the FTS5 `entity_id` column definition cleanly formatted for SQLite 3.45+ strict parsing) to power sub-15ms edge search across all 14 Normative RFCs (`NS-RFC-001` to `NS-RFC-014`), 32 Industries (`IND-01` to `IND-32`), 36 States + FCT (`296` cells), 774 Constitutional LGAs, 14 Municipal Service Modules (`LGA-01` to `LGA-14`), 15 Audited Civic FAQs, and 15 RAG/GEO/AEO H2 Benchmarks:

```sql
-- File: apps/web/migrations/0001_ngstack_d1_fts5_schema.sql
-- Governing Card: NS-KB-20C / NS-KB-21-ASTRA
-- Target Runtime: Cloudflare D1 (SQLite 3.45+ with FTS5 & Strict Tables)

PRAGMA foreign_keys = ON;

-- 1. Normative RFC Registry (NS-RFC-001 to NS-RFC-014)
CREATE TABLE IF NOT EXISTS normative_rfcs (
  rfc_id TEXT PRIMARY KEY CHECK (rfc_id GLOB 'NS-RFC-[0-9][0-9][0-9]'),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  working_group TEXT NOT NULL CHECK (working_group IN ('WG-01', 'WG-02', 'WG-03', 'WG-04', 'WG-05', 'WG-06')),
  status TEXT NOT NULL CHECK (status IN ('RATIFIED_NORMATIVE', 'DRAFT_STANDARD', 'PUBLIC_CONSULTATION')),
  hourglass_layer TEXT NOT NULL,
  statutory_anchors_json TEXT NOT NULL,
  summary_civic TEXT NOT NULL,
  full_markdown_body TEXT NOT NULL,
  openapi_contract_path TEXT,
  json_schema_uri TEXT,
  sha256_digest TEXT NOT NULL,
  updated_at_utc TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
) STRICT;

-- 2. Master 32-Industry Capability & 8-Mechanism Gap Ledger (IND-01 to IND-32)
CREATE TABLE IF NOT EXISTS industry_capability_ledger (
  industry_id TEXT PRIMARY KEY CHECK (industry_id GLOB 'IND-[0-9][0-9]'),
  macro_sector TEXT NOT NULL,
  industry_name TEXT NOT NULL,
  civic_bottleneck_summary TEXT NOT NULL,
  primary_gap_mechanisms_json TEXT NOT NULL, -- JSON array of MECH-01..08
  building_blocks_json TEXT NOT NULL,        -- JSON array of BB-01..12
  protocols_json TEXT NOT NULL,              -- SureEvidence, ClearAm, MarketLink, etc.
  evidence_confidence TEXT NOT NULL CHECK (evidence_confidence IN ('VERIFIED', 'CORROBORATED', 'INFERRED', 'UNRESOLVED')),
  documented_incumbents_json TEXT NOT NULL,
  statutory_regulators_json TEXT NOT NULL
) STRICT;

-- 3. 36 States + FCT Sub-National Readiness Matrix (37 Jurisdictions x 8 Dimensions = 296 Cells)
CREATE TABLE IF NOT EXISTS subnational_state_atlas (
  state_code TEXT PRIMARY KEY CHECK (length(state_code) = 2),
  state_name TEXT NOT NULL UNIQUE,
  capital_city TEXT NOT NULL,
  geopolitical_zone TEXT NOT NULL CHECK (geopolitical_zone IN ('North-Central', 'North-East', 'North-West', 'South-East', 'South-South', 'South-West')),
  lga_count INTEGER NOT NULL CHECK (lga_count >= 6 AND lga_count <= 44),
  judiciary_status TEXT NOT NULL CHECK (judiciary_status IN ('LIVE_DIGITAL', 'ACTIVE_PILOT', 'PAPER_ONLY', 'NOT_ASSESSED')),
  land_registry_status TEXT NOT NULL CHECK (land_registry_status IN ('LIVE_DIGITAL', 'ACTIVE_PILOT', 'PAPER_ONLY', 'NOT_ASSESSED')),
  irs_treasury_status TEXT NOT NULL CHECK (irs_treasury_status IN ('LIVE_DIGITAL', 'ACTIVE_PILOT', 'PAPER_ONLY', 'NOT_ASSESSED')),
  health_shia_status TEXT NOT NULL CHECK (health_shia_status IN ('LIVE_DIGITAL', 'ACTIVE_PILOT', 'PAPER_ONLY', 'NOT_ASSESSED')),
  crvs_lga_status TEXT NOT NULL CHECK (crvs_lga_status IN ('LIVE_DIGITAL', 'ACTIVE_PILOT', 'PAPER_ONLY', 'NOT_ASSESSED')),
  open_contracting_status TEXT NOT NULL CHECK (open_contracting_status IN ('LIVE_DIGITAL', 'ACTIVE_PILOT', 'PAPER_ONLY', 'NOT_ASSESSED')),
  agri_extension_status TEXT NOT NULL CHECK (agri_extension_status IN ('LIVE_DIGITAL', 'ACTIVE_PILOT', 'PAPER_ONLY', 'NOT_ASSESSED')),
  fiber_row_hosting_status TEXT NOT NULL CHECK (fiber_row_hosting_status IN ('LIVE_DIGITAL', 'ACTIVE_PILOT', 'PAPER_ONLY', 'NOT_ASSESSED')),
  primary_evidence_links_json TEXT NOT NULL,
  last_verified_utc TEXT NOT NULL
) STRICT;

-- 4. 774 Constitutional LGAs & 6 FCT Area Councils Registry (SC/CV/343/2024 Direct Treasury Pass-Through)
CREATE TABLE IF NOT EXISTS constitutional_lga_774_registry (
  lga_code TEXT PRIMARY KEY, -- e.g., LA-LGA-11, FC-LGA-02
  state_code TEXT NOT NULL REFERENCES subnational_state_atlas(state_code),
  lga_name TEXT NOT NULL,
  constitutional_schedule_ref TEXT NOT NULL DEFAULT '1999 CFRN First Schedule Part I/II & Fourth Schedule',
  sc_cv_343_2024_direct_treasury_status TEXT NOT NULL CHECK (sc_cv_343_2024_direct_treasury_status IN ('DIRECT_TSA_CRF_ACTIVE', 'TRANSITION_ENROLLED', 'PAPER_CASH_BOUND', 'NOT_ASSESSED')),
  kioskbase_offline_node_status TEXT NOT NULL CHECK (kioskbase_offline_node_status IN ('LIVE_DIGITAL', 'ACTIVE_PILOT', 'PAPER_ONLY', 'NOT_ASSESSED')),
  active_lga_modules_json TEXT NOT NULL -- Subset of LGA-01..LGA-14
) STRICT;

-- 5. 14 Standardized Municipal Service Modules (LGA-01 to LGA-14)
CREATE TABLE IF NOT EXISTS lga_service_modules_14 (
  module_id TEXT PRIMARY KEY CHECK (module_id GLOB 'LGA-[0-9][0-9]'),
  route_slug TEXT NOT NULL UNIQUE,
  civic_service_name TEXT NOT NULL,
  protocol_tag TEXT NOT NULL,
  fourth_schedule_function TEXT NOT NULL,
  target_persona_clusters_json TEXT NOT NULL,
  failure_mechanisms_resolved_json TEXT NOT NULL,
  kioskbase_offline_capable INTEGER NOT NULL CHECK (kioskbase_offline_capable IN (0, 1)),
  splitdirect_zero_escrow_enforced INTEGER NOT NULL CHECK (splitdirect_zero_escrow_enforced = 1),
  json_schema_pointer TEXT NOT NULL
) STRICT;

-- 6. Daily Cryptographic Merkle Audit Log (Test 03: Audit & Zero-Escrow Verification)
CREATE TABLE IF NOT EXISTS daily_merkle_audit_roots (
  epoch_date TEXT PRIMARY KEY, -- YYYY-MM-DD
  merkle_root_sha256 TEXT NOT NULL,
  specification_commit_sha TEXT NOT NULL,
  verified_zero_escrow_invariant INTEGER NOT NULL CHECK (verified_zero_escrow_invariant = 1),
  ed25519_witness_signatures_json TEXT NOT NULL,
  published_at_utc TEXT NOT NULL
) STRICT;

-- 7. Unified FTS5 Full-Text Search Virtual Table (Sub-15ms Edge Querying)
CREATE VIRTUAL TABLE IF NOT EXISTS ngstack_global_search_fts USING fts5(
  entity_type,      -- 'RFC' | 'INDUSTRY' | 'STATE' | 'LGA' | 'LGA_MODULE' | 'FAQ' | 'RAG_BENCHMARK'
  entity_id,        -- e.g., 'NS-RFC-005', 'IND-05', 'LA-LGA-11', 'LGA-10', 'NS-FAQ-01'
  canonical_url,    -- e.g., '/rfcs/NS-RFC-005', '/protocols/lga-governance-stack/lga-10-market-collect'
  title_civic,
  body_searchable,
  statutory_tags,
  tokenize = 'porter unicode61 remove_diacritics 2'
);
```

---

## 6. CLOUDFLARE WORKERS / PAGES UNIFIED EDGE CONFIGURATION (`apps/web/wrangler.toml`) & DEPLOYMENT PIPELINE

```toml
# File: apps/web/wrangler.toml
name = "nigeriastack-org-portal"
main = "src/worker.ts"
compatibility_date = "2026-11-01"
compatibility_flags = ["nodejs_compat"]

# Custom Domain Routing (Zero Cross-Domain Bleed)
routes = [
  { pattern = "nigeriastack.org", custom_domain = true },
  { pattern = "www.nigeriastack.org", custom_domain = true }
]

# Static Assets (< 35 KB Gzipped Shell + Offline WASM Verifiers + Public Domain Schemas)
[assets]
directory = "./dist/client"
binding = "ASSETS"
html_handling = "auto-trailing-slash"
not_found_handling = "single-page-application"

# Cloudflare D1 FTS5 SQLite Binding
[[d1_databases]]
binding = "NGSTACK_D1"
database_name = "nigeriastack-commons-d1-prod"
database_id = "00000000-0000-0000-0000-ngstack2026d1"
migrations_dir = "migrations"

[vars]
ENVIRONMENT = "production"
COMMONS_VERSION = "v2026.6.5"
LICENSE_SPDX = "CC0-1.0"
SOVEREIGN_NON_IMPERSONATION_HEADER = "Independent Open Specification & Conformance Commons (CC0-1.0 Public Domain) — Not a Federal/State Executive Portal or Commercial API Gateway"
```

### 6.1 Idempotent Build, D1 Seed & Cloudflare Edge Deployment Script (`scripts/ci/astra-deploy-pipeline.sh`)
```bash
#!/usr/bin/env bash
set -euo pipefail

# Step 1: Install workspace dependencies (frozen lockfile)
pnpm install --frozen-lockfile

# Step 2: Run Gate NS-G1 to NS-G6 Pre-Deploy Verification
pnpm run ci:verify-all-gates

# Step 3: Build Reference SDKs & Browser WASM Verifier (@nigeriastack/sure-evidence-crypto, @nigeriastack/clearam-guard)
pnpm --filter "@nigeriastack/*" build

# Step 4: Build TanStack Start + Hono Production Portal & Assert < 35 KB Gzipped Shell Budget
pnpm --filter nigeriastack-org-portal build
INITIAL_SHELL_BYTES=$(gzip -c apps/web/dist/client/index.html | wc -c)
if [ "$INITIAL_SHELL_BYTES" -gt 35840 ]; then
  echo "[FATAL GATE NS-G6 FAIL] Initial shell ($INITIAL_SHELL_BYTES bytes) exceeds 35,840-byte 2G/3G budget!"
  exit 1
fi
echo "[PASS GATE NS-G6] Initial shell size: ${INITIAL_SHELL_BYTES} bytes gzipped (< 35 KB)."

# Step 5: Idempotent Local D1 FTS5 SQLite Migration & Seed Verification
npx wrangler d1 migrations apply nigeriastack-commons-d1-prod --local
npx wrangler d1 execute nigeriastack-commons-d1-prod --local --file=./scripts/seed-d1-from-canonical-json.sql

# Assert 37 Jurisdictions (36 States + FCT) and 774 Constitutional LGAs exist before remote promotion
STATE_COUNT=$(npx wrangler d1 execute nigeriastack-commons-d1-prod --local --command="SELECT COUNT(*) AS cnt FROM subnational_state_atlas;" --json | jq '.[0].results[0].cnt')
LGA_COUNT=$(npx wrangler d1 execute nigeriastack-commons-d1-prod --local --command="SELECT COUNT(*) AS cnt FROM constitutional_lga_774_registry;" --json | jq '.[0].results[0].cnt')
test "$STATE_COUNT" -eq 37
test "$LGA_COUNT" -eq 774

# Step 6: Remote D1 Migration & Unified Cloudflare Workers + Static Assets Deploy (Human Approval Checkpoint if First Cutover)
npx wrangler d1 migrations apply nigeriastack-commons-d1-prod --remote
npx wrangler d1 execute nigeriastack-commons-d1-prod --remote --file=./scripts/seed-d1-from-canonical-json.sql
npx wrangler deploy --config apps/web/wrangler.toml
```

---

## 7. PARALLEL 7-REPOSITORY CONTINUATION & ASTRA/SOL/TERRA MODEL ROUTING PLAN (`github.com/nigeriastack`)

| Execution Wave | GitHub Repository (`github.com/nigeriastack/*`) | Assigned OpenAI Model & Reasoning Effort | Source Cards (`nigeriastack-org/`) | Published Artifacts / NPM Packages | Blocking CI Gate & Release Tag |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Wave 1 (Upstream Normative Specs)** | **Repo 1:** `nigeriastack/protocol-specifications` | `gpt-6-astra` (`high` effort) | `NS-KB-01`, `NS-KB-02`, `NS-KB-05`, `NS-KB-06`, `NS-KB-07`, `NS-KB-08` | `NS-RFC-001`..`014`, 4 OpenAPI 3.1.1 specs, 5 JSON Schema 2020-12 envelopes (`@nigeriastack/protocol-specs@2026.6.5`) | `Gate NS-G1` (`verify-cleanroom-nomenclature.ts` + Redocly/Ajv lint) |
| **Wave 2 (Empirical Datasets & Gap Ledgers)** | **Repo 2:** `nigeriastack/industry-capability-ledger`<br>**Repo 3:** `nigeriastack/subnational-readiness-atlas` | `gpt-6.1-sol` (`medium` effort) supervised by `gpt-6-astra` | `NS-KB-03A`, `NS-KB-03B`, `NS-KB-03C`, `NS-KB-03D` | `master-32-industry-matrix.json`, `subnational-36states-fct-atlas.json` (296 cells), `lga-774-constitutional-registry.json`, `lga-14-service-modules-spec.json` | `Gate NS-G2` (296-cell + 774-LGA schema & provenance check) |
| **Wave 3 (NDPA Consent Profiles & Rego Policy)** | **Repo 4:** `nigeriastack/clearam-consent-templates` | `gpt-6-astra` (`high` effort) | `NS-KB-09` (Part A & Rego) | 6 multi-sector `ClearAm` JSON templates (`FIN`, `LAW`, `HLTH`, `EDU`, `AGRI`, `LGA`) + `ndpa-statutory-boundary-rules.rego` | `Gate NS-G1` & `Gate NS-G2` (`opa test` 100% pass) |
| **Wave 4 (Reference SDKs & Conformance Test Bed)** | **Repo 5:** `nigeriastack/conformance-test-bed`<br>**Repo 6:** `nigeriastack/joinbody-reference-sdks` | `gpt-6.1-sol` (`medium` effort) + `gpt-6-astra` (`high` effort for Ed25519/CRDT review) | `NS-KB-04B`, `NS-KB-09` (Part B), `NS-KB-20A`, `NS-KB-20B` | `@nigeriastack/sure-evidence-crypto`, `@nigeriastack/clearam-guard`, `@nigeriastack/confluence-transport`, `@nigeriastack/kioskbase-crdt`, `@nigeriastack/lga-kiosk-kit`, `@nigeriastack/conformance-cli` | `Gate NS-G6` (100% unit/property tests + `ITB-01..05` Gherkin pass) |
| **Wave 5 (Edge Web Portal & Public Verifier)** | **Repo 7:** `nigeriastack/nigeriastack.org` | `gpt-6-astra` (`high` effort) + `gpt-6.1-terra` (Playwright 4-Viewport & Zoom Computer Use) | `NS-KB-04A`, `NS-KB-10`..`19`, `NS-KB-20C`, `NS-KB-21` | Production TanStack Start + Hono Cloudflare Worker/Pages app (`< 35 KB` shell), D1 FTS5 search, `.well-known/ngstack-keys.json`, `/llms.txt` | `Gates NS-G1` through `NS-G6` + Playwright 4-Viewport & `200%`/`400%` Zoom Suite |

---

## 8. CODEX CLI & CHATGPT DOT CONTINUOUS EXECUTION COMMANDS

```bash
# 1. Run Wave 1–5 Autonomous Build in Codex CLI with GPT-6 Astra (High Reasoning Effort)
codex --model gpt-6-astra \
      --reasoning-effort high \
      --approval-mode full-auto \
      "Execute Waves 1 through 5 in docs/handoff/NS-KB-21_CHATGPT_ASTRA_AUTONOMOUS_HANDOFF_SPEC.md following AGENTS.md rules. Delegate Wave 2/4 package scaffolding to gpt-6.1-sol and Playwright 4-viewport verification to gpt-6.1-terra."

# 2. Run Defensive Statutory & Schema Conformance Scan via Codex Security Cloud
codex security scan --repo [github.com/nigeriastack/nigeriastack.org](https://github.com/nigeriastack/nigeriastack.org) --policy specs/clearam-templates/ndpa-statutory-boundary-rules.rego
```
