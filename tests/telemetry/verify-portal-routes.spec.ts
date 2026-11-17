import { expect, test } from '@playwright/test';

// Set NS_APP_BASE_URL to the running portal. These are real HTTP route requests,
// not the static artboard's tab panels.
const baseURL = process.env.NS_APP_BASE_URL;
const routes = ['/', '/sectors', '/protocols', '/rfcs', '/conformance', '/atlas/states', '/atlas/lga-774', '/governance'];
const widths = [1440, 768, 390, 320];

test.describe('portal routes', () => {
  test.skip(!baseURL, 'Set NS_APP_BASE_URL to a running portal to test its routes');
  for (const route of routes) for (const width of widths) {
    test(`${route} at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(new URL(route, baseURL!).href, { waitUntil: 'networkidle' });
      const text = await page.locator('body').innerText();
      const headings = await page.locator('h1').allTextContents();
      const structure = await page.evaluate(() => ({
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
        canonicals: Array.from(document.querySelectorAll('link[rel="canonical"]'), el => el.getAttribute('href')),
        headings: Array.from(document.querySelectorAll('h1,h2,h3,h4'), el => ({ level: Number(el.tagName[1]), text: el.textContent?.trim() })),
        ids: Array.from(document.querySelectorAll('[id]'), el => el.id),
      }));
      const prohibited = ['JusticeLENS', 'JusticLENS', 'ACCESS API CORE', '374-LGA'].filter(s => text.toLowerCase().includes(s.toLowerCase()));
      const controls = await page.getByRole('button', { name: /^(sign in|sign up|request api key|pricing|book a demo)$/i }).allTextContents();
      controls.push(...await page.getByRole('link', { name: /^(sign in|sign up|request api key|pricing|book a demo)$/i }).allTextContents());
      const dimensions = await page.evaluate(() => ({ innerWidth, clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth, bodyScrollWidth: document.body.scrollWidth }));
      const clippingCandidates = await page.evaluate(() => Array.from(document.querySelectorAll('main *')).filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && (rect.left < -1 || rect.right > innerWidth + 1) && !el.closest('table, pre, [style*="overflow"]');
      }).slice(0, 50).map(el => ({ tag: el.tagName, text: (el.textContent || '').trim().slice(0, 100), left: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right })));
      await page.keyboard.press('Tab');
      const focus = await page.evaluate(() => { const el = document.activeElement as HTMLElement; const style = getComputedStyle(el); return { tag: el.tagName, text: (el.textContent || '').trim().slice(0, 100), outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, boxShadow: style.boxShadow }; });
      await testInfo.attach('measurement.json', { body: Buffer.from(JSON.stringify({ route, width, status: response?.status(), headings, structure, dimensions, prohibited, controls, clippingCandidates, focus }, null, 2)), contentType: 'application/json' });
      await page.screenshot({ path: testInfo.outputPath('page.png'), fullPage: true });
      expect.soft(response?.status()).toBe(200);
      expect.soft(headings.length, 'one H1 per document').toBe(1);
      expect.soft(structure.title.trim(), 'title').not.toBe('');
      expect.soft(structure.description?.trim(), 'description').toBeTruthy();
      expect.soft(structure.canonicals, 'canonical').toEqual([`https://nigeriastack.org${route === '/' ? '/' : route}`]);
      expect.soft(structure.headings.every(h => h.text), 'empty heading').toBeTruthy();
      for (let i = 1; i < structure.headings.length; i++) expect.soft(structure.headings[i].level, 'heading level skips').toBeLessThanOrEqual(structure.headings[i - 1].level + 1);
      expect.soft(structure.ids.filter(id => !id), 'empty IDs').toEqual([]);
      expect.soft(new Set(structure.ids).size, 'duplicate IDs').toBe(structure.ids.length);
      expect.soft(headings.join(' ')).not.toMatch(/page not found|unable to load/i);
      expect.soft(dimensions.scrollWidth, 'page horizontal overflow').toBeLessThanOrEqual(dimensions.clientWidth);
      expect.soft(prohibited).toEqual([]);
      expect.soft(controls).toEqual([]);
      expect.soft(focus.tag).not.toBe('BODY');
      expect.soft(focus.outlineStyle !== 'none' && focus.outlineWidth !== '0px' || focus.boxShadow !== 'none', 'keyboard focus indicator').toBeTruthy();
    });
  }
});
