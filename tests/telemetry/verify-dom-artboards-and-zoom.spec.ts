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
  { name: 'reflow-320', width: 320, height: 640 } // 320 CSS px viewport; not a browser zoom operation
];

// These checks sample selected copy and page-level overflow. They do not establish
// complete copy fidelity, native browser zoom behavior, or WCAG conformance.
for (const artboard of ARTBOARDS) {
  for (const vp of VIEWPORTS) {
    for (const mode of ['default', 'text-200-spacing'] as const) {
      test(`[${artboard.id}] ${vp.name} ${mode}`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(artboard.path, { waitUntil: 'networkidle' });
        if (mode === 'text-200-spacing') {
          // Root-relative text scales; fixed-pixel text need not. This is not native zoom.
          await page.addStyleTag({ content: `
            html { font-size: 200% !important; }
            * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
            p { margin-bottom: 2em !important; }
          ` });
        }
        const measurement = await page.evaluate(() => ({
          innerWidth: window.innerWidth,
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
          rootFontSize: getComputedStyle(document.documentElement).fontSize,
          devicePixelRatio: window.devicePixelRatio,
        }));
        // Capture likely clipped elements for review, including cases hidden by
        // body overflow rules. Scrollable tables/code blocks are intentional.
        const clippingCandidates = await page.evaluate(() => Array.from(document.querySelectorAll('body *'))
          .filter((el) => {
            const node = el as HTMLElement;
            const r = node.getBoundingClientRect();
            const style = getComputedStyle(node);
            if (!r.width || !r.height || style.visibility === 'hidden') return false;
            let parent = node.parentElement;
            while (parent && parent !== document.body) {
              const parentStyle = getComputedStyle(parent);
              if (['auto', 'scroll'].includes(parentStyle.overflowX) && parent.scrollWidth > parent.clientWidth) return false;
              parent = parent.parentElement;
            }
            return r.left < -1 || r.right > innerWidth + 1;
          }).slice(0, 50).map(el => ({ tag: el.tagName, text: (el.textContent || '').trim().slice(0, 100), rect: { left: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right } })));
        await page.keyboard.press('Tab');
        const focus = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement;
          const style = getComputedStyle(el);
          return { tag: el.tagName, text: (el.textContent || '').trim().slice(0, 100), outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, boxShadow: style.boxShadow };
        });
        const bodyText = await page.locator('body').innerText();
        const missingCopy = artboard.requiredCopyStrings.filter(text => !bodyText.includes(text));
        const prohibited = ['JusticeLENS', 'JusticLENS', 'ACCESS API CORE', '374-LGA', 'delve', 'tapestry', 'In short:'].filter(text => bodyText.toLowerCase().includes(text.toLowerCase()));
        const prohibitedControls = await page.getByRole('button', { name: /^(sign in|sign up|request api key|pricing|book a demo)$/i }).allTextContents();
        prohibitedControls.push(...await page.getByRole('link', { name: /^(sign in|sign up|request api key|pricing|book a demo)$/i }).allTextContents());
        console.log(JSON.stringify({ artboard: artboard.id, viewport: vp.name, mode, ...measurement, missingCopy, prohibited }));
        await testInfo.attach('measurement.json', { body: Buffer.from(JSON.stringify({ artboard: artboard.id, viewport: vp, mode, ...measurement, missingCopy, prohibited, prohibitedControls, clippingCandidates, focus }, null, 2)), contentType: 'application/json' });
        await page.screenshot({ path: testInfo.outputPath('page.png'), fullPage: true });
        expect.soft(measurement.scrollWidth, 'page scroll width').toBeLessThanOrEqual(measurement.clientWidth);
        expect.soft(measurement.bodyScrollWidth, 'body content must not be hidden outside viewport').toBeLessThanOrEqual(measurement.clientWidth);
        expect.soft(clippingCandidates, 'non-scrollable content outside viewport').toEqual([]);
        expect.soft(missingCopy, 'selected required copy missing').toEqual([]);
        expect.soft(prohibited, 'selected prohibited copy present').toEqual([]);
        expect.soft(prohibitedControls, 'prohibited commercial controls present').toEqual([]);
        expect.soft(focus.tag, 'Tab should move focus to a control').not.toBe('BODY');
        expect.soft(focus.outlineStyle !== 'none' && focus.outlineWidth !== '0px' || focus.boxShadow !== 'none', 'keyboard focus should have a visible indicator').toBeTruthy();
        // Only descendants of actual horizontal scroll containers are exempt.

      });
    }
  }
}
