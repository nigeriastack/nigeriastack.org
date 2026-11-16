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

      // 2. Assert 100% Zero-Typo Copy Fidelity & Zero Prohibited Chrome
      const bodyText = await page.locator('body').innerText();
      for (const expectedStr of artboard.requiredCopyStrings) {
        expect(bodyText).toContain(expectedStr);
      }
      expect(bodyText).not.toContain('JusticLENS');
      expect(bodyText).not.toContain('Sign in');
      expect(bodyText).not.toContain('Sign up');
      expect(bodyText).not.toContain('ACCESS API CORE');
      expect(bodyText).not.toContain('374-LGA');

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
