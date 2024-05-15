import { defineConfig, devices } from '@playwright/test';
import { testPlanFilter } from "allure-playwright/dist/testplan";

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: 'tests',

  // Folder for test artifacts such as screenshots, videos, traces, etc.
  outputDir: 'test-results',

  // Run all tests in parallel.
  fullyParallel: true,
  
  // Single test run tme limit in ms
  timeout: 30*1000,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only.
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 4 : undefined,

  // Reporter to use
  rep: testPlanFilter(),
  reporter: [["line"], [
    "allure-playwright",
    {
      detail: true,
      outputFolder: "allure-results",
      suiteTitle: true,
      environmentInfo: {
        framework: "playwright",
      },
    },
  ]],

  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: 'https://automationintesting.online',
    actionTimeout: 10*1000,
    headless: true,
    navigationTimeout: 10*1000,
    // Collect trace when retrying the failed test.
    trace: 'on',
    screenshot: 'on',
  },
  expect:{
    timeout: 10*1000
  },
  // Configure projects for major browsers.
  projects: [
    // Setup project
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1680, height: 1200},
        storageState: '.auth/admin-booking.json'
      },
      dependencies: ['setup'],
      trace: 'on-failure'
    },
  ],
});

