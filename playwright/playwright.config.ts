import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';

// Workaround: macOS 27 blocks unsigned Firefox builds from ~/Library/Application Support/Firefox
// (Mozilla bug 2078511). Give Firefox its own data folders instead.
const MOZ_DIRS = { MOZ_APP_DATA: '/tmp/pw-moz-appdata', MOZ_LOCAL_APP_DATA: '/tmp/pw-moz-localappdata' };
Object.values(MOZ_DIRS).forEach((d) => fs.mkdirSync(d, { recursive: true }));

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
    {
  name: 'firefox',
  use: {
    ...devices['Desktop Firefox'],
    launchOptions: { env: { ...(process.env as Record<string, string>), ...MOZ_DIRS } },
  },
},
    // TODO (week 2): add a mobile viewport project, e.g. devices['Pixel 7']
  ],
});
