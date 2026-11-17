import { defineConfig } from '@playwright/test';
import { execFileSync } from 'node:child_process';

export default defineConfig({
  metadata: { testedCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() },
  testDir: './tests/telemetry',
  timeout: 30000,
  outputDir: process.env.NS_TEST_OUTPUT_DIR || './playwright-output',
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }], ['json', { outputFile: 'playwright-report/results.json' }]],
  use: {
    headless: true,
    browserName: 'chromium',
    launchOptions: {
      executablePath: process.env.NS_CHROMIUM_PATH,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    },
  },
});
