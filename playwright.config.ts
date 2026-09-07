import { defineConfig, devices } from "@playwright/test";

const requestedPort = Number(process.env.PLAYWRIGHT_PORT ?? "3110");
const playwrightPort =
  Number.isInteger(requestedPort) && requestedPort >= 1024 && requestedPort <= 65_535
    ? requestedPort
    : 3110;
// 127.0.0.1 (not localhost) so Playwright never resolves ::1 while the dev/
// prod servers bind IPv4 — an IPv6/IPv4 mismatch shows up as ECONNREFUSED.
const baseURL = `http://127.0.0.1:${playwrightPort}`;

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
  webServer: {
    command: `npx next start -p ${playwrightPort} -H 127.0.0.1`,
    url: baseURL,
    timeout: 120_000,
    reuseExistingServer: true,
    stdout: "pipe",
    stderr: "pipe",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } }
  ],
});
