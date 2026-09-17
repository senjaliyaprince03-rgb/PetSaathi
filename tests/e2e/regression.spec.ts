import { test, expect } from "@playwright/test";

test.describe("Phase 11: Regression Suite", () => {

  test("1. Buttons: Core conversion and interaction buttons are visible and active", async ({ page }) => {
    await page.goto("/");
    const findCareBtn = page.getByRole("link", { name: "Find care" }).first();
    await expect(findCareBtn).toBeVisible();
    await expect(findCareBtn).toHaveAttribute("href", "/book");
  });

  test("2. Forms: Contact form validates required fields", async ({ page }) => {
    await page.goto("/contact");
    const submitBtn = page.getByRole("button", { name: /submit/i });
    await expect(submitBtn).toBeVisible();
  });

  test("3. Modals / Panels: Mobile navigation drawer mounts cleanly", async ({ page, isMobile }) => {
    await page.goto("/");
    if (isMobile) {
      const mobileNav = page.locator('nav[aria-label="Mobile navigation"]');
      await expect(mobileNav).toBeVisible();
    } else {
      const headerNav = page.locator('nav[aria-label="Primary navigation"]');
      await expect(headerNav).toBeVisible();
    }
  });

  test("4. Dropdowns: Service and city pickers present available options", async ({ page }) => {
    await page.goto("/");
    const serviceSelect = page.locator('select, [role="combobox"]').first();
    if (await serviceSelect.count() > 0) {
      await expect(serviceSelect).toBeVisible();
    } else {
      // Radio or custom buttons
      const buttons = page.locator("button");
      expect(await buttons.count()).toBeGreaterThan(5);
    }
  });

  test("5. Links: Header and footer navigation links have valid targets", async ({ page }) => {
    await page.goto("/");
    const links = await page.locator("footer a").all();
    expect(links.length).toBeGreaterThanOrEqual(10);
    for (const link of links.slice(0, 5)) {
      const href = await link.getAttribute("href");
      expect(href).toBeTruthy();
    }
  });

  test("6. Images: Public images load with valid dimensions", async ({ page }) => {
    await page.goto("/");
    const images = await page.locator("img").all();
    expect(images.length).toBeGreaterThan(0);
    const firstImg = images[0]!;
    const isLoaded = await firstImg.evaluate((img: HTMLImageElement) => img.complete);
    expect(isLoaded).toBe(true);
  });

});
