import { defineConfig, devices } from '@playwright/test';
import { BASE_URL } from '@fixtures/testData';

export default defineConfig({
  testDir: './tests',

  // Each test file runs in parallel; tests within a file also run concurrently
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in source
  forbidOnly: !!process.env.CI,

  // Retry once on CI to absorb transient network issues; 0 locally so
  // failures surface immediately during development
  retries: process.env.CI ? 1 : 0,

  // Number of parallel workers — undefined lets Playwright auto-tune to CPU
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'], // concise terminal output during the run
  ],

  use: {
    baseURL: BASE_URL,

    // Capture a screenshot automatically whenever a test fails
    screenshot: 'only-on-failure',

    // Also capture a trace on first retry — invaluable for CI debugging
    trace: 'on-first-retry',

    // Viewport matching a typical QA/dev desktop
    viewport: { width: 1280, height: 720 },

    // 30 s is generous for SauceDemo; tightened for performance tests separately
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  // Screenshot artefacts land here (committed path only, contents gitignored)
  outputDir: 'test-results/',

  projects: [
    // ─── Setup project — runs once to persist auth session ──────────────────
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // ─── Chromium ────────────────────────────────────────────────────────────
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Reuse the saved session in every Chromium worker
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // ─── Firefox ─────────────────────────────────────────────────────────────
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
