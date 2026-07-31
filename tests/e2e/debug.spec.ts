import { expect, test } from "@playwright/test";

test("care-journey interaction has no browser errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("/");

  const homeVisitTab = page
    .getByLabel(/care journey/i)
    .getByRole("tab", { name: "Home visit", exact: false });
  await homeVisitTab.click();

  await expect(homeVisitTab).toHaveAttribute("aria-selected", "true");
  expect(errors).toEqual([]);
});
