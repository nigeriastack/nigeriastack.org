import { expect, test } from '@playwright/test';

// Representative rendered documents, not a substitute for the full HTTP inventory.
const baseURL = process.env.NS_APP_BASE_URL;
const routes = [
  '/sectors/directory/IND-01',
  '/protocols/sure-evidence',
  '/protocols/lga-governance-stack',
  '/protocols/lga-governance-stack/lga-01-council-complain',
  '/rfcs/NS-RFC-001',
  '/atlas/states/AB',
  '/atlas/lga-774/AB/AB-LGA-01',
];

test.describe('representative canonical descendants', () => {
  test.skip(!baseURL, 'Set NS_APP_BASE_URL to the production portal origin');
  for (const route of routes) {
    test(`${route}: document structure`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 390, height: 844 });
      const response = await page.goto(new URL(route, baseURL!).href, { waitUntil: 'networkidle' });
      const doc = await page.evaluate(() => ({
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
        canonicals: Array.from(document.querySelectorAll('link[rel="canonical"]'), e => e.getAttribute('href')),
        headings: Array.from(document.querySelectorAll('h1,h2,h3,h4'), e => ({ level: Number(e.tagName[1]), text: e.textContent?.trim(), id: e.id })),
        ids: Array.from(document.querySelectorAll('[id]'), e => e.id),
        breadcrumbs: Array.from(document.querySelectorAll('nav[aria-label*="readcrumb"] a'), e => e.getAttribute('href')),
        width: { client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth },
      }));
      await testInfo.attach('document.json', { body: Buffer.from(JSON.stringify({ route, status: response?.status(), ...doc }, null, 2)), contentType: 'application/json' });
      await page.screenshot({ path: testInfo.outputPath('page.png'), fullPage: true });
      expect(response?.status()).toBe(200);
      expect(doc.title.trim()).not.toBe('');
      expect(doc.description?.trim()).toBeTruthy();
      expect(doc.canonicals).toEqual([`https://nigeriastack.org${route}`]);
      expect(doc.headings.filter(h => h.level === 1)).toHaveLength(1);
      expect(doc.headings.every(h => h.text)).toBeTruthy();
      for (let i = 1; i < doc.headings.length; i++) {
        expect(doc.headings[i].level, `heading after ${doc.headings[i - 1].text}`).toBeLessThanOrEqual(doc.headings[i - 1].level + 1);
      }
      expect(doc.ids.filter(id => !id)).toEqual([]);
      expect(new Set(doc.ids).size).toBe(doc.ids.length);
      expect(doc.breadcrumbs.length, 'descendant breadcrumb links').toBeGreaterThan(0);
      for (const href of doc.breadcrumbs) {
        expect(href).toBeTruthy();
        const target = new URL(href!, baseURL!);
        if (target.origin === new URL(baseURL!).origin) expect((await page.request.get(target.href)).status(), `breadcrumb ${href}`).toBe(200);
      }
      expect(doc.width.scroll).toBeLessThanOrEqual(doc.width.client);
    });
  }
});

test.describe('filters and unknown routes', () => {
  test.skip(!baseURL, 'Set NS_APP_BASE_URL to the production portal origin');
  test('industry search narrows the results and reset restores them', async ({ page }) => {
    await page.goto(new URL('/sectors', baseURL!).href);
    await page.getByLabel('Search industries').fill('zzzz-nonexistent-industry');
    await page.getByRole('button', { name: 'Filter industries' }).click();
    await expect(page.getByText('No industries match these filters.')).toBeVisible();
    await page.getByRole('link', { name: 'Reset', exact: true }).click();
    await expect(page.getByText('32 of 32 industries')).toBeVisible();
  });
  for (const route of ['/sectors/directory/IND-999', '/protocols/not-a-protocol', '/protocols/lga-governance-stack/not-a-module', '/rfcs/NS-RFC-999', '/atlas/states/ZZ', '/atlas/lga-774/AB/not-a-council']) {
    test(`${route}: unknown entity is not found`, async ({ page }) => {
      const response = await page.goto(new URL(route, baseURL!).href);
      expect(response?.status()).toBe(404);
      await expect(page.locator('h1')).toContainText(/not found/i);
    });
  }
});
