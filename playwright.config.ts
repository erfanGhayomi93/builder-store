import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  use: { browserName: 'chromium', channel: process.env.PLAYWRIGHT_CHANNEL },
  webServer: [
    {
      command: 'npm run dev:storefront',
      url: 'http://localhost:3100',
      timeout: 120000,
      reuseExistingServer: process.env.E2E_REUSE_SERVER === 'true',
    },
    {
      command: `npm run dev:merchant -- --port ${process.env.E2E_MERCHANT_PORT ?? 4200}`,
      url: `http://localhost:${process.env.E2E_MERCHANT_PORT ?? 4200}`,
      timeout: 120000,
      reuseExistingServer: process.env.E2E_REUSE_SERVER === 'true',
    },
    {
      command: 'npm run dev:admin',
      url: 'http://localhost:4300',
      timeout: 120000,
      reuseExistingServer: process.env.E2E_REUSE_SERVER === 'true',
    },
    {
      command: 'npm run dev:api',
      url: 'http://localhost:3101/api/health',
      timeout: 120000,
      reuseExistingServer: process.env.E2E_REUSE_SERVER === 'true',
    },
  ],
});
