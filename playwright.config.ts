import { defineConfig, devices } from "@playwright/test";

const requestedPort = Number(process.env.PLAYWRIGHT_PORT ?? "3110");
const playwrightPort =
  Number.isInteger(requestedPort) && requestedPort >= 1024 && requestedPort <= 65_535
    ? requestedPort
    : 3110;
const baseURL = `http://localhost:${playwrightPort}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  timeout: 300_000,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  outputDir: "test-results",
  use: {
    baseURL,
    navigationTimeout: 90_000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  // webServer: {
  //   command: `npm run dev -- -p ${playwrightPort}`,
  //   url: baseURL,
  //   timeout: 420_000,
  //   reuseExistingServer: !process.env.CI,
  //   stdout: "pipe",
  //   stderr: "pipe",
  // },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } }
  ],
});
