import { PlaywrightTestConfig, defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.test.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://localhost/',
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true, // Ignore HTTPS errors due to self-signed certificates
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'https://localhost:443/', // Ensure this matches your actual dev server URL
    timeout: 120000, // Increase timeout to 120 seconds
    reuseExistingServer: !process.env.CI,
  },
});
