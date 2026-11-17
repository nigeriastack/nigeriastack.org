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
