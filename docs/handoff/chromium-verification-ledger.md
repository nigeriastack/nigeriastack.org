# Chromium verification ledger

2026-11-17. Scope: the two static HTML artboards, four viewport widths (1440, 768, 390, 320 CSS pixels), default and root text scaling plus spacing override.

- `npx playwright test tests/telemetry/verify-dom-artboards-and-zoom.spec.ts --workers=1 --reporter=line`: 16 failures before page load. `/usr/bin/chromium` aborted at `process_singleton_posix.cc:297` with `socket() failed: Operation not permitted (1)`; no measurements or screenshots were produced. The shell also reported an `unexpected operator` in the Chromium launcher. These are environment launch failures, not evidence of page overflow or copy errors.
- `npx playwright test tests/telemetry/verify-dom-artboards-and-zoom.spec.ts --list`: passed discovery, 16 cases.

Changed `tests/telemetry/verify-dom-artboards-and-zoom.spec.ts` to record client and scroll widths, root font size and device pixel ratio, report selected missing and prohibited strings, and attach screenshots and measurements before assertions. Playwright saves attachments under `test-results` when the browser runs. Historical telemetry and screenshots were not replaced by new measurements. No compiled portal routes were measured because Chromium could not launch.

A 320 CSS-pixel viewport is a reflow proxy, not native browser zoom. `html { font-size: 200% }` scales root-relative text but may not scale fixed-pixel text; it is not a complete 200% text resize test. The spacing override and page-wide width measurement alone cannot establish WCAG conformance or rule out clipping. Copy checks cover selected snippets only and cannot establish zero typos. Re-run in a Chromium-capable environment and inspect screenshots, clipping, and native zoom separately.
