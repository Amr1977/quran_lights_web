import { test, expect, defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 30000,
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
    { name: 'mobile', use: { viewport: { width: 375, height: 667 } } },
  ],
});