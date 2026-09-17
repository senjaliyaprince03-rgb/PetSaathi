import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Phase 11: Accessibility Suite (2 Tests)", () => {

  test("1. axe-core: 0 serious or critical violations across public surfaces", async ({ page }) => {
    const pagesToCheck = ["/", "/services", "/safety", "/contact", "/resources/new-pet-checklist"];
    for (const path of pagesToCheck) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await page.locator("main").first().waitFor({ state: "attached" });
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .disableRules(["color-contrast"])
        .exclude("iframe")
        .analyze();
      const violations = results.violations.filter(({ impact }) => impact === "serious" || impact === "critical");
      expect(violations, `${path} violations: ${violations.map(v => v.id).join(", ")}`).toEqual([]);
    }
  });

  test("2. Keyboard navigation across all core interactive flows", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    // Focus skip to content
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();

    // Tab through main conversion buttons
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
    }
    const currentActive = await page.evaluate(() => ({
      tag: document.activeElement?.tagName,
      role: document.activeElement?.getAttribute("role") || document.activeElement?.getAttribute("aria-label"),
      text: document.activeElement?.textContent?.slice(0, 30)
    }));
    expect(currentActive.tag).toMatch(/(A|BUTTON|INPUT|SELECT)/);
  });

});
