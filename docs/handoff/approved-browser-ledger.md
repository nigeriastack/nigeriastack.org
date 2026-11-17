# Browser verification ledger

2026-11-17. Local browser execution remains blocked. A normal Playwright launch without an override failed because the Playwright Chromium executable was not installed. A second run with `NS_CHROMIUM_PATH=/usr/bin/chromium` reached Chromium but aborted at `process_singleton_posix.cc:297`: `socket() failed: Operation not permitted (1)`. No pages loaded, so neither run produced fresh browser measurements or screenshots. No browser pass is claimed.

`npx playwright test tests/telemetry/verify-dom-artboards-and-zoom.spec.ts --list` discovers 16 static artboard cases: two artboards, four viewport widths, and default or root-font-and-spacing overrides. `bash scripts/ci/validate-tokens.sh` passes after the artboard changes.

The suite attaches a per-case JSON measurement and full-page screenshot on successful page load. It checks selected copy and prohibited strings, page width, and the first keyboard focus indicator; potential off-screen elements are recorded for manual review. These samples do not establish complete copy fidelity, absence of all clipping, accessibility conformance, or absence of typos. A 320 CSS-pixel viewport is a reflow check. The 200% root-font override affects root-relative text and is not native browser zoom or a complete text-resize test. Actual browser zoom remains unverified.

A Chromium-capable CI runner should install Playwright Chromium, run the suite, retain `playwright-output/` and `playwright-report/`, review screenshots and clipping candidates, and report the actual results. The old artboard telemetry table's unsupported scores were removed.

A separate HTTP portal suite discovers 32 cases across eight routes and four viewport widths. Start the actual portal server, set `NS_APP_BASE_URL` to its origin, and run `npx playwright test tests/telemetry`; without that environment variable these cases are marked skipped. They require a successful response and main heading and record the same focus, width, prohibited control, screenshot, and clipping-candidate evidence. They have not run locally. Review the CI report for skipped tests and manually inspect the attachments.
