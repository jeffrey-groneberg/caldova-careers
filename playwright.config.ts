import { defineConfig, devices } from '@playwright/test';

// The apply flow writes to the database through an on-demand endpoint, so the
// e2e suite runs against the built Node server (not a static preview). A
// dedicated test database keeps e2e runs isolated from local dev data.
// The e2e port defaults to Astro's 4321 but can be overridden (e.g. to avoid a
// local port clash) via PLAYWRIGHT_PORT.
const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 4321);

export default defineConfig({
  testDir: './e2e-tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Build the site and start the Node server before running the tests.
  webServer: {
    command: 'npm run build && npm run start',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      DATABASE_URL: 'file:./.data/e2e.db',
      HOST: '0.0.0.0',
      PORT: String(PORT),
    },
  },
});
