import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const publicPages = ["/", "/services", "/safety", "/societies", "/membership", "/journal", "/contact"];

async function gotoWithTransportRetry(page: Page, path: string) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const retryable = /ERR_(?:NETWORK_IO_SUSPENDED|ABORTED)/.test(message);
      if (!retryable || attempt === 3) throw error;
      await page.waitForTimeout(500 * attempt);
    }
  }
}

test("public surfaces have no serious or critical automated accessibility violations", async ({ page }) => {
  test.setTimeout(120_000);
  for (const path of publicPages) {
    await gotoWithTransportRetry(page, path);
    await page.locator("main").first().waitFor({ state: "visible" });
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    const violations = results.violations.filter(({ impact }) => impact === "serious" || impact === "critical");
    expect(violations, `${path}: ${violations.map(({ id, help }) => `${id} — ${help}`).join("; ")}`).toEqual([]);
  }
});
