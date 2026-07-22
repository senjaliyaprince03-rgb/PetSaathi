import { expect, test } from "@playwright/test";

test("public homepage exposes the core conversion paths", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Their world stays warm");
  await expect(page.getByRole("link", { name: /find my petsaathi/i })).toBeVisible();
  const careThread = page.getByRole("heading", { name: "Care you can follow." });
  await careThread.scrollIntoViewIfNeeded();
  await expect(careThread).toBeVisible();
  const handover = page.getByRole("heading", { name: "Trust begins before the door closes." });
  await handover.scrollIntoViewIfNeeded();
  await expect(handover).toBeVisible();
  await expect(page.getByRole("img", { name: "A pet parent, her golden retriever and a PetSaathi caregiver sharing a calm handover in a sunlit courtyard" })).toBeVisible();
  const safety = page.getByRole("heading", { name: "Proof over promises." });
  await safety.scrollIntoViewIfNeeded();
  await expect(safety).toBeVisible();
});

test("homepage has no horizontal overflow on mobile", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("anonymous care request validates locally and hands off to secure sign-in", async ({ page }) => {
  await page.goto("/book");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Pet name").fill("Milo");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Date").fill("2030-01-01");
  await page.getByLabel("Start time").fill("09:00");
  await page.getByLabel("Locality").fill("Bopal");
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByText("Enter your name")).not.toBeVisible();
  await page.getByLabel("Your name").fill("QA Pet Parent");
  await page.getByLabel("Mobile number").fill("9876543210");
  await page.getByRole("button", { name: "Review request" }).click();

  await expect(page.getByRole("heading", { name: "Your care request is ready." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign in to continue" })).toHaveAttribute("href", "/login?returnTo=/book");
});

test("sign-in fails closed when auth credentials are absent", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText("OTP delivery stays disabled")).toBeVisible();
  await expect(page.getByRole("button", { name: /send secure otp/i })).toBeDisabled();
});

test("support records remain private to authenticated accounts", async ({ page }) => {
  await page.goto("/support");
  await expect(page).toHaveURL(/\/login\?returnTo=%2Fsupport|\/login\?returnTo=\/support/);

  const status = await page.evaluate(async () => {
    const response = await fetch("/api/support-cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: "ACCOUNT", priority: "LOW", subject: "Private support", description: "This anonymous request must not be accepted." })
    });
    return response.status;
  });
  expect([401, 403]).toContain(status);
});

test("pet health and communication settings remain private", async ({ page }) => {
  await page.goto("/pets");
  await expect(page).toHaveURL(/\/login\?returnTo=%2Fpets|\/login\?returnTo=\/pets/);

  await page.goto("/settings/notifications");
  await expect(page).toHaveURL(/\/login\?returnTo=%2Fsettings%2Fnotifications|\/login\?returnTo=\/settings\/notifications/);

  const status = await page.evaluate(async () => {
    const response = await fetch("/api/pets/00000000-0000-4000-8000-000000000000/care-instructions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedingRoutine: "Anonymous care data must not be accepted." })
    });
    return response.status;
  });
  expect([401, 403]).toContain(status);
});

test("catalog, pricing, capacity and reconciliation controls remain admin-only", async ({ page }) => {
  await page.goto("/admin/catalog");
  await expect(page).toHaveURL(/\/login\?returnTo=%2Fadmin%2Fcatalog|\/login\?returnTo=\/admin\/catalog/);

  const statuses = await page.evaluate(async () => {
    const requests = [
      fetch("/api/admin/service-areas", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }),
      fetch("/api/admin/service-prices", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }),
      fetch("/api/admin/capacity-limits", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }),
      fetch("/api/admin/reconciliation-runs", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })
    ];
    return Promise.all(requests.map(async (request) => (await request).status));
  });
  expect(statuses.every((status) => [401, 403].includes(status))).toBe(true);

  await page.goto("/admin/reports");
  await expect(page).toHaveURL(/\/login\?returnTo=%2Fadmin%2Freports|\/login\?returnTo=\/admin\/reports/);
  const reportReviewStatus = await page.evaluate(async () => {
    const response = await fetch("/api/admin/reports/00000000-0000-4000-8000-000000000000/review", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "APPROVE", note: "Anonymous review must not be accepted." }) });
    return response.status;
  });
  expect([401, 403]).toContain(reportReviewStatus);
});

test("anonymous callers cannot reserve booking capacity", async ({ page }) => {
  await page.goto("/book");
  const status = await page.evaluate(async () => {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ petId: crypto.randomUUID(), addressId: crypto.randomUUID(), servicePriceId: crypto.randomUUID(), serviceCode: "DOG_WALK_30", scheduledStart: "2030-01-01T09:00:00+05:30" })
    });
    return response.status;
  });
  expect([401, 403]).toContain(status);
});

test("live tracking remains private before the feature gate is enabled", async ({ page }) => {
  await page.goto("/book");
  const resourceId = "00000000-0000-4000-8000-000000000000";
  const statuses = await page.evaluate(async (id) => Promise.all([
    fetch(`/api/bookings/${id}/tracking`).then((response) => response.status),
    fetch(`/api/saathi/assignments/${id}/tracking`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "START", latitude: 23.0225, longitude: 72.5714 }) }).then((response) => response.status)
  ]), resourceId);
  expect(statuses.every((status) => [401, 403].includes(status))).toBe(true);
});

test("partner orders stay role-bound and feature-gated", async ({ page }) => {
  await page.goto("/partners");
  await expect(page).toHaveURL(/\/login\?returnTo=%2Fpartners|\/login\?returnTo=\/partners/);
  const status = await page.evaluate(async () => (await fetch("/api/partner-orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ partnerServiceId: crypto.randomUUID() }) })).status);
  expect([401, 403]).toContain(status);
});

test("incident, no-show and Safety controls remain authenticated and role-bound", async ({ page }) => {
  await page.goto("/admin/operations");
  await expect(page).toHaveURL(/\/login\?returnTo=%2Fadmin%2Foperations|\/login\?returnTo=\/admin\/operations/);
  await page.goto("/admin/safety");
  await expect(page).toHaveURL(/\/login\?returnTo=%2Fadmin%2Fsafety|\/login\?returnTo=\/admin\/safety/);

  const id = "00000000-0000-4000-8000-000000000000";
  const statuses = await page.evaluate(async (resourceId) => {
    const requests = [
      fetch(`/api/bookings/${resourceId}/incidents`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ category: "WELFARE", severity: "HIGH", description: "Anonymous users must not create authoritative incident records." }) }),
      fetch(`/api/admin/bookings/${resourceId}/no-show`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason: "Anonymous users must not record a verified service no-show." }) }),
      fetch(`/api/admin/incidents/${resourceId}/events`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "OWNER_CONTACTED", details: "Anonymous timeline update must be rejected." }) }),
      fetch(`/api/admin/incidents/${resourceId}/transition`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ toState: "TRIAGING", eventType: "TRIAGE_NOTE", details: "Anonymous state transition must be rejected." }) }),
      fetch(`/api/admin/incidents/${resourceId}/sitter-hold`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "PLACE", reason: "Anonymous hold action must be rejected by role checks." }) })
    ];
    return Promise.all(requests.map(async (request) => (await request).status));
  }, id);
  expect(statuses.every((status) => [401, 403].includes(status))).toBe(true);
});
