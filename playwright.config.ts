import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/telemetry',
  timeout: 30000,
  use: {
    headless: true,
    browserName: 'chromium',
    launchOptions: {
      executablePath: '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    },
  },
});
