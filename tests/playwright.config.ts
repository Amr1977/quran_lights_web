import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 30000,
  webServer: {
    command: 'python3 -m http.server 8080 --directory public',
    url: 'http://localhost:8080',
    reuseExistingServer: true,
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
    { name: 'mobile', use: { viewport: { width: 375, height: 667 } } },
  ],
});