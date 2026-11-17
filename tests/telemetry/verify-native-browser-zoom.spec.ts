import { test, expect, chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// Real Chromium tab zoom via extension API, not CSS zoom, page scale or DPR emulation.
// References: playwright.dev/docs/chrome-extensions and developer.chrome.com/docs/extensions/reference/api/tabs#method-setZoom.
test('native Chromium 200% and 400% zoom with text spacing', async ({}, testInfo) => {
  test.setTimeout(180000);
  const baseURL = process.env.NS_APP_BASE_URL;
  expect(baseURL, 'native portal zoom requires the compiled HTTP server').toBeTruthy();
  const extension = path.resolve('tests/telemetry/zoom-extension');
  const context = await chromium.launchPersistentContext('', {
    channel: 'chromium', headless: true,
    viewport: { width: 1280, height: 960 },
    args: ['--disable-extensions-except=' + extension, '--load-extension=' + extension],
  });
  const measurements: any[] = [];
  const testedCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const reportPath = 'verification-output/native-zoom-evidence.json';
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify({ nativeZoomVerified: false, testedCommit, measurements }));
  try {
    let [worker] = context.serviceWorkers();
    if (!worker) worker = await context.waitForEvent('serviceworker', { timeout: 15000 });
    const page = await context.newPage();
    const targets = [
      { id: 'NS-KB-17', url: 'file://' + path.resolve('design-system/hifi-artboards/batch1-architecture-sectors-protocols-rfcs.html') },
      { id: 'NS-KB-18', url: 'file://' + path.resolve('design-system/hifi-artboards/batch2-conformance-atlas-governance.html') },
      ...['/', '/sectors', '/protocols', '/rfcs', '/conformance', '/atlas/states', '/atlas/lga-774', '/governance'].map((route, i) => ({ id: 'route-' + i, url: new URL(route, baseURL!).href })),
    ];
    for (const target of targets) {
      const response = await page.goto(target.url, { waitUntil: 'networkidle' });
      if (target.url.startsWith('http')) expect(response?.status()).toBe(200);
      const tabId = await worker.evaluate(async (url) => {
        const api = (globalThis as any).chrome;
        const tabs = await api.tabs.query({});
        const tab = tabs.find((entry: any) => entry.url === url);
        if (!tab?.id) throw Error('No extension tab matches the tested document');
        await api.tabs.setZoomSettings(tab.id, { mode: 'automatic', scope: 'per-tab' });
        await api.tabs.setZoom(tab.id, 1);
        return tab.id;
      }, page.url());
      await expect.poll(() => page.evaluate(() => innerWidth)).toBe(1280);
      const baselineDpr = await page.evaluate(() => devicePixelRatio);
      for (const factor of [2, 4]) {
        const actualZoom = await worker.evaluate(async ({ tabId, factor }) => {
          const api = (globalThis as any).chrome;
          await api.tabs.setZoom(tabId, factor);
          return await api.tabs.getZoom(tabId);
        }, { tabId, factor });
        expect(actualZoom).toBeCloseTo(factor, 6);
        await expect.poll(() => page.evaluate(() => innerWidth)).toBe(1280 / factor);
        const measure = () => page.evaluate(() => ({
          innerWidth, dpr: devicePixelRatio,
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
          cssZoom: getComputedStyle(document.documentElement).zoom,
        }));
        const normal = await measure();
        expect(normal.dpr / baselineDpr).toBeCloseTo(factor, 2);
        expect(normal.scrollWidth).toBeLessThanOrEqual(normal.clientWidth);
        expect(normal.bodyScrollWidth).toBeLessThanOrEqual(normal.clientWidth);
        const spacing = await page.addStyleTag({ content: '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }' });
        const spaced = await measure();
        expect(spaced.scrollWidth).toBeLessThanOrEqual(spaced.clientWidth);
        expect(spaced.bodyScrollWidth).toBeLessThanOrEqual(spaced.clientWidth);
        const screenshot = testInfo.outputPath(target.id + '-' + factor + '00pct.png');
        await page.screenshot({ path: screenshot, fullPage: true });
        measurements.push({ target: target.id, url: target.url, requestedZoom: factor, actualZoom, baselineDpr, normal, spaced, screenshot });
        await spacing.evaluate(el => el.remove());
      }
      await worker.evaluate(async (id) => { await (globalThis as any).chrome.tabs.setZoom(id, 1); }, tabId);
    }
    expect(measurements).toHaveLength(20);
    const report = { nativeZoomVerified: true, testedCommit, browser: context.browser()?.version(), method: 'chrome.tabs.setZoom + getZoom + layout/DPR readback', measurements, artifacts: measurements.map(m => m.screenshot) };
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
    console.log('NATIVE_ZOOM_EVIDENCE ' + JSON.stringify(report));
    await testInfo.attach('native-zoom-evidence.json', { path: reportPath, contentType: 'application/json' });
  } finally {
    await context.close();
  }
});
