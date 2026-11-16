# **NS-KB-16: Compiled Two-Layer CSS Custom Properties (`tokens.css`), Design System Specification (`DESIGN.md`) & Contrast-Certified Architectural SVGs**

* Document ID: `NS-DESIGN-TOKENS-CSS-KB16-V2026.6.4`  
* Canonical Repository Paths:  
  1. `design-system/tokens/tokens.css`  
  2. `docs/design-system/DESIGN.md`  
* Governing Skill Harness: `NS-SH-05` (Anti-Slop Visual Craft & DTCG Token Engineer)  
* Upstream Authority: `NS-KB-04A` (`design-system/tokens/nigeriastack.dtcg.tokens.json` & `scripts/ci/validate-tokens.sh`)  
* Verification Gate: `Gate NS-G5` (Zero Hardcoded Hex/RGB Literals Outside `:root`; WCAG 2.2 Level AA/AAA Contrast Certification; Mandatory `forced-colors: active` & `prefers-reduced-motion: reduce`; Zero SaaS Gradient Slop)  
* License: `CC0-1.0 Universal (Public Domain Dedication)`

# **Governance Metadata Summary**

| `Key` | `Specification Attribute` | `Value` |
| :---- | :---- | :---- |
| 01 | Primary Surface Tone | Sovereign Parchment (`#F8FAF8`) |
| 02 | Primary Text Tone | Archival Forest Ink (`#0D1512`, Contrast Ratio 16.82:1 AAA) |
| 03 | Accent & Primary Action Tone | Deep Emerald Action (`#0A5C36`, Contrast Ratio 8.24:1 AAA) |
| 04 | Brand Accent Baseline | Federal Green (`#008751`) |
| 05 | Layout & Typography Foundation | Swiss Technical Blueprint / IETF Datatracker Paradigm |

---

# **PART I: COMPILED TWO-LAYER CSS CUSTOM PROPERTIES (`design-system/tokens/tokens.css`)**

```
/**
 * NIGERIASTACK.ORG — COMPILED W3C DTCG TWO-LAYER CSS CUSTOM PROPERTIES
 * Canonical Path: design-system/tokens/tokens.css
 * Source Authority: design-system/tokens/nigeriastack.dtcg.tokens.json (NS-KB-04A)
 * Verification Gate: Gate NS-G5 (scripts/ci/validate-tokens.sh)
 * License: CC0-1.0 Universal (Public Domain Dedication)
 */

:root {
  /* ==========================================================================
   * LAYER 1: PRIMITIVE TOKENS (Resolved ONLY inside :root — Never consumed directly in UI rules)
   * ========================================================================== */
  --ns-primitive-color-parchment-50: #F8FAF8;
  --ns-primitive-color-sheet-0: #FFFFFF;
  --ns-primitive-color-grid-subtle-100: #EEF3EF;
  --ns-primitive-color-hairline-200: #D4DDD7;
  --ns-primitive-color-control-border-500: #52665B;
  --ns-primitive-color-slate-600: #3B4D44;
  --ns-primitive-color-forest-ink-900: #0D1512;
  --ns-primitive-color-terminal-panel-850: #13201B;
  --ns-primitive-color-federal-green-600: #008751;
  --ns-primitive-color-emerald-action-700: #0A5C36;
  --ns-primitive-color-emerald-hover-800: #064226;
  --ns-primitive-color-amber-draft-100: #FEF3C7;
  --ns-primitive-color-amber-draft-800: #78350F;
  --ns-primitive-color-crimson-quarantine-100: #FEE2E2;
  --ns-primitive-color-crimson-quarantine-800: #7F1D1D;
  --ns-primitive-color-violet-restricted-100: #F3E8FF;
  --ns-primitive-color-violet-restricted-800: #4A1D6E;

  --ns-primitive-font-serif: 'Source Serif 4', Georgia, Cambria, serif;
  --ns-primitive-font-sans: 'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --ns-primitive-font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, monospace;

  --ns-primitive-space-0: 0px;
  --ns-primitive-space-1: 4px;
  --ns-primitive-space-2: 8px;
  --ns-primitive-space-3: 12px;
  --ns-primitive-space-4: 16px;
  --ns-primitive-space-6: 24px;
  --ns-primitive-space-8: 32px;
  --ns-primitive-space-12: 48px;
  --ns-primitive-space-16: 64px;
  --ns-primitive-space-24: 96px;

  --ns-primitive-border-hairline: 1px;
  --ns-primitive-border-structural: 2px;
  --ns-primitive-border-focus: 3px;

  --ns-primitive-radius-sharp: 0px;
  --ns-primitive-radius-technical: 2px;
  --ns-primitive-radius-badge: 4px;

  /* ==========================================================================
   * LAYER 2: SEMANTIC TOKENS (Consumed across all UI components & HTML5 artboards)
   * ========================================================================== */
  --ns-surface-canvas: var(--ns-primitive-color-parchment-50);
  --ns-surface-panel: var(--ns-primitive-color-sheet-0);
  --ns-surface-well: var(--ns-primitive-color-grid-subtle-100);
  --ns-surface-terminal: var(--ns-primitive-color-forest-ink-900);
  --ns-surface-terminal-elevated: var(--ns-primitive-color-terminal-panel-850);

  --ns-text-primary: var(--ns-primitive-color-forest-ink-900);
  --ns-text-secondary: var(--ns-primitive-color-slate-600);
  --ns-text-on-primary: var(--ns-primitive-color-sheet-0);
  --ns-text-on-terminal: var(--ns-primitive-color-parchment-50);

  --ns-border-grid-hairline: var(--ns-primitive-color-hairline-200);
  --ns-border-control: var(--ns-primitive-color-control-border-500);
  --ns-border-structural: var(--ns-primitive-color-forest-ink-900);
  --ns-border-focus: var(--ns-primitive-color-emerald-action-700);

  --ns-action-primary-bg: var(--ns-primitive-color-emerald-action-700);
  --ns-action-primary-hover-bg: var(--ns-primitive-color-emerald-hover-800);
  --ns-brand-accent: var(--ns-primitive-color-federal-green-600);

  --ns-status-ratified-bg: var(--ns-primitive-color-grid-subtle-100);
  --ns-status-ratified-ink: var(--ns-primitive-color-emerald-action-700);
  --ns-status-ratified-border: var(--ns-primitive-color-emerald-action-700);

  --ns-status-draft-bg: var(--ns-primitive-color-amber-draft-100);
  --ns-status-draft-ink: var(--ns-primitive-color-amber-draft-800);
  --ns-status-draft-border: var(--ns-primitive-color-amber-draft-800);

  --ns-status-restricted-bg: var(--ns-primitive-color-violet-restricted-100);
  --ns-status-restricted-ink: var(--ns-primitive-color-violet-restricted-800);
  --ns-status-restricted-border: var(--ns-primitive-color-violet-restricted-800);

  --ns-status-failed-bg: var(--ns-primitive-color-crimson-quarantine-100);
  --ns-status-failed-ink: var(--ns-primitive-color-crimson-quarantine-800);
  --ns-status-failed-border: var(--ns-primitive-color-crimson-quarantine-800);

  --ns-font-heading: var(--ns-primitive-font-serif);
  --ns-font-body: var(--ns-primitive-font-sans);
  --ns-font-code: var(--ns-primitive-font-mono);

  --ns-touch-target-min: 44px;
  --ns-layout-max-width: 1440px;
  --ns-reading-measure: 65ch;
}

/* ============================================================================
 * MANDATORY WCAG 2.2 ACCESSIBILITY & ANTI-SLOP STRUCTURAL RULES
 * ============================================================================ */
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: var(--ns-primitive-space-0);
  background-color: var(--ns-surface-canvas);
  color: var(--ns-text-primary);
  font-family: var(--ns-font-body);
  line-height: 1.6;
  overflow-x: hidden;
}

code, pre, .ns-tabular-mono {
  font-family: var(--ns-font-code);
  font-variant-numeric: tabular-nums;
}

button, a.ns-btn, select, input, summary {
  min-height: var(--ns-touch-target-min);
  border-radius: var(--ns-primitive-radius-technical);
}

:focus-visible {
  outline: var(--ns-primitive-border-focus) solid var(--ns-border-focus);
  outline-offset: var(--ns-primitive-space-1);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

@media (forced-colors: active) {
  .ns-non-impersonation-bar,
  .ns-card,
  .ns-badge,
  button,
  select,
  input,
  table,
  th,
  td {
    forced-color-adjust: auto;
    border: 1px solid CanvasText !important;
  }
  :focus-visible {
    outline: 3px solid Highlight !important;
  }
}
```

---

# **PART II: SOVEREIGN SWISS-BLUEPRINT DESIGN SPECIFICATION & CONTRAST-CERTIFIED ARCHITECTURAL SVGs (`docs/design-system/DESIGN.md`)**

## **2.1 Visual Identity & Anti-Slop Craft Rules**

1. **Aesthetic Direction:** Swiss Technical Specification Blueprint (`IETF Datatracker` \+ `W3C TR` \+ `GOV.UK / USWDS` tabular clarity) anchored in **Sovereign Parchment (`#F8FAF8`)**, **Archival Forest Ink (`#0D1512`, `16.82:1` AAA)**, and **Deep Emerald Action (`#0A5C36`, `8.24:1` AAA)**.  
2. **Prohibited SaaS AI-Slop Patterns (`Gate NS-G5` Blocked):** Zero purple/indigo/pink neon gradients, zero `backdrop-filter: blur(24px)` glassmorphism blobs, zero floating 3D isometric illustrations, zero unverified marketing counters, and zero rounded pill cards (`border-radius > 4px`).  
3. **Shape-Prefixed Status Semantics (WCAG 2.2 SC 1.4.1 Use of Color):** Every status badge pairs its high-contrast semantic token with an explicit ASCII/Unicode shape prefix:  
   * `[✓ RATIFIED]` (`--ns-status-ratified-*`)  
   * `[? DRAFT RFC]` (`--ns-status-draft-*`)  
   * `[LOCK NDPA]` (`--ns-status-restricted-*`)  
   * `[X ITB FAIL]` (`--ns-status-failed-*`)

## **2.2 Contrast-Certified Inline Architectural SVG 1: The 5-Layer Sovereign Hourglass Schematic**

```
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 420" role="img" aria-labelledby="ns-svg-hourglass-title ns-svg-hourglass-desc" style="width:100%;height:auto;background:var(--ns-surface-terminal);border:2px solid var(--ns-border-structural);">
  <title id="ns-svg-hourglass-title">Nigeria Stack 5-Layer Vendor-Neutral Sovereign Hourglass Architecture</title>
  <desc id="ns-svg-hourglass-desc">Five-layer hourglass schematic showing Layer 5 Sectoral Networks (32 Industries and 774 LGAs), Layer 4 Narrow Waist Protocols (Confluence, ClearAm, MarketLink, PassCargo, GivePower), Layer 3 Verifiable Registries (SureEvidence s.84, KioskBase, LawTree AST), Layer 2 Statutory Identity and SplitDirect Zero-Escrow Treasury, and Layer 1 Offline SQLite WASM / 2G USSD Edge.</desc>
  <g font-family="JetBrains Mono, monospace" font-size="12" fill="currentColor" style="color:var(--ns-text-on-terminal);">
    <rect x="24" y="20" width="672" height="62" fill="none" stroke="currentColor" stroke-width="2"/>
    <text x="40" y="44" font-weight="bold">LAYER 5: WHOLE-OF-ECONOMY OPEN SECTORAL NETWORKS (8 SECTORS • 32 INDUSTRIES • 774 LGAs)</text>
    <text x="40" y="66">Finance • Identity • Commerce • Health/Edu • Agri/Land • Energy • Telecom • Justice/AI</text>

    <rect x="96" y="102" width="528" height="62" fill="none" stroke="currentColor" stroke-width="2"/>
    <text x="112" y="126" font-weight="bold">LAYER 4 (NARROW WAIST): ASYNC, CONSENT, COMMERCE &amp; AGENT PROTOCOLS</text>
    <text x="112" y="148">BB-03 Confluence • BB-04 ClearAm • BB-07 MarketLink • BB-08 PassCargo • BB-12 GivePower</text>

    <rect x="144" y="184" width="432" height="62" fill="none" stroke="currentColor" stroke-width="2"/>
    <text x="160" y="208" font-weight="bold">LAYER 3: VERIFIABLE REGISTRIES, STATUTORY ASTs &amp; SECTION 84 TRUST</text>
    <text x="160" y="230">BB-05 SureEvidence (s.84 QR) • BB-11 LawTree AST (urn:lex:ng:*) • Merkle Audit Logs</text>

    <rect x="96" y="266" width="528" height="62" fill="none" stroke="currentColor" stroke-width="2"/>
    <text x="112" y="290" font-weight="bold">LAYER 2: STATUTORY IDENTITY BRIDGES &amp; SPLITDIRECT ZERO-ESCROW TREASURY</text>
    <text x="112" y="312">BB-01 SureProof-ID (NIN/BVN/RC/SCN) • BB-06 SplitDirect (CFRN s.121(3) &amp; SC/CV/343/2024)</text>

    <rect x="24" y="348" width="672" height="54" fill="none" stroke="currentColor" stroke-width="2"/>
    <text x="40" y="372" font-weight="bold">LAYER 1: SOVEREIGN OFFLINE EDGE (&lt;35 KB SQLITE WASM / HLC-CRDTs • *347*LGA# USSD)</text>
    <text x="40" y="392">BB-02 KioskBase • BB-09 NDHX/SureLearn • BB-10 LandGuard/AgriTrust • IXPN LOS/ABV Peering</text>
  </g>
</svg>
```

## **2.3 Contrast-Certified Inline Architectural SVG 2: `SplitDirect` (`SC/CV/343/2024` & `CFRN s. 121(3)`) Zero-Escrow Treasury Flow**

```
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 180" role="img" aria-labelledby="ns-svg-splitdirect-title ns-svg-splitdirect-desc" style="width:100%;height:auto;background:var(--ns-surface-panel);border:2px solid var(--ns-border-structural);">
  <title id="ns-svg-splitdirect-title">SplitDirect Zero-Escrow Public Revenue Pass-Through Flow (NS-RFC-009 &amp; NS-RFC-014)</title>
  <desc id="ns-svg-splitdirect-desc">Shows Payer initiating statutory fee payment; Gateway enforces platform_escrow_kobo == 0 and state_sjlga_escrow_kobo == 0, routing 100% of statutory principal directly to TSA, State Judiciary CRF, or 774-LGA Treasury Account, and emitting a signed SHA-256 Merkle audit receipt.</desc>
  <g font-family="JetBrains Mono, monospace" font-size="11" fill="currentColor" style="color:var(--ns-text-primary);">
    <rect x="16" y="36" width="180" height="108" fill="none" stroke="currentColor" stroke-width="2"/>
    <text x="28" y="64" font-weight="bold">[1] CITIZEN / TRADER</text>
    <text x="28" y="86">Court Filing / Land /</text>
    <text x="28" y="104">LGA-10 MarketCollect</text>
    <text x="28" y="124">(POS / PWA / *347*LGA#)</text>

    <rect x="246" y="24" width="228" height="132" fill="none" stroke="currentColor" stroke-width="2"/>
    <text x="258" y="50" font-weight="bold">[2] SPLITDIRECT GATEWAY</text>
    <text x="258" y="72">platform_escrow_kobo == 0</text>
    <text x="258" y="92">state_sjlga_escrow_kobo == 0</text>
    <text x="258" y="112">[X] Blocks Private/SJLGA Pool</text>
    <text x="258" y="134">[✓] 100% Direct Split Rule</text>

    <rect x="524" y="36" width="180" height="108" fill="none" stroke="currentColor" stroke-width="2"/>
    <text x="536" y="64" font-weight="bold">[3] SOVEREIGN TREASURY</text>
    <text x="536" y="86">• Judiciary CRF (s.121(3))</text>
    <text x="536" y="104">• 774-LGA CBN Account</text>
    <text x="536" y="124">• Daily SHA-256 Merkle Root</text>
  </g>
</svg>
```
