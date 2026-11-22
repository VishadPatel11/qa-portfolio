import { defineConfig, devices } from '@playwright/test';

/**
 * BASE_URL lets the same suite run against local Docker, a CI service container,
 * or a Kubernetes deployment later (Phase 5) without code changes.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,          // fail CI if someone leaves test.only in
  retries: process.env.CI ? 2 : 0,       // retry in CI only; locally, flakiness should be visible
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',             // full trace (DOM, network, console) when a retry happens
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // TODO (week 2): add a mobile viewport project, e.g. devices['Pixel 7']
  ],
});
