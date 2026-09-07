import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./tests/e2e',use:{browserName:'chromium'},webServer:[{command:'npm run dev:storefront',url:'http://localhost:3000',timeout:120000},{command:'npm run dev:merchant',url:'http://localhost:4200',timeout:120000},{command:'npm run dev:admin',url:'http://localhost:4300',timeout:120000},{command:'npm run dev:api',url:'http://localhost:3001/api/health',timeout:120000}]});

