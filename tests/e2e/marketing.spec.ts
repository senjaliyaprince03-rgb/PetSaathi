import { expect, test } from "@playwright/test";

test("public homepage exposes the core conversion paths", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Care That Feels Like Family.");
  await expect(page.getByRole("button", { name: "Find My Verified Saathi" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Quick service shortcuts" })).toBeVisible();
  const careStories = page.getByRole("heading", { name: "See the details families can compare." });
  await careStories.scrollIntoViewIfNeeded();
  await expect(careStories).toBeVisible();
  const careThread = page.getByRole("heading", { name: "Four clear moments. One accountable thread." });
  await careThread.scrollIntoViewIfNeeded();
  await expect(careThread).toBeVisible();
  const trust = page.getByRole("heading", { name: "No single badge can promise perfect care." });
  await trust.scrollIntoViewIfNeeded();
  await expect(trust).toBeVisible();
  await expect(page.getByRole("img", { name: "A pet parent reviewing a protected PetSaathi care record beside her resting dog" })).toBeVisible();
  const proposals = page.getByRole("heading", { name: "Compare care evidence, not an endless directory." });
  await proposals.scrollIntoViewIfNeeded();
  await expect(proposals).toBeVisible();
  const reportCard = page.getByRole("heading", { name: "Every important moment stays attached to the care." });
  await reportCard.scrollIntoViewIfNeeded();
  await expect(reportCard).toBeVisible();
  const journeyExplorer = page.getByRole("heading", { name: "Choose the care rhythm that fits the day." });
  await journeyExplorer.scrollIntoViewIfNeeded();
  await expect(journeyExplorer).toBeVisible();
  await expect(page.getByRole("heading", { name: "Build a calmer care ecosystem." })).toBeVisible();
  const concierge = page.getByRole("heading", { name: "Who needs care?" });
  await concierge.scrollIntoViewIfNeeded();
  await expect(concierge).toBeVisible();
  await expect(page.getByRole("heading", { name: "Care should feel considered before, during and after." })).toBeVisible();
  const clarity = page.getByRole("heading", { name: "Clarity is part of care." });
  await clarity.scrollIntoViewIfNeeded();
  await expect(clarity).toBeVisible();
});

test("homepage uses the unified colored logo and favicon family", async ({ page }) => {
  await page.goto("/");

  const logo = page.getByRole("img", { name: "PetSaathi — Since 2026" });
  await expect(logo).toBeVisible();
  expect(await logo.evaluate((image: HTMLImageElement) => image.currentSrc)).toContain(
    "petsaathi-logo-horizontal-brand.png"
  );

  const iconHref = await page.locator('link[rel="icon"][type="image/png"]').getAttribute("href");
  expect(iconHref).toBe("/icons/petsaathi-favicon-v2.png");
});

test("homepage content imagery is unique, topic-specific, and includes cats", async ({ page }) => {
  await page.goto("/");

  const contentImages = page.locator("main img");
  const sources = await contentImages.evaluateAll((images) =>
    images
      .filter((image) => image.getAttribute("alt") !== "PetSaathi — Since 2026")
      .map((image) => {
        const currentSource = (image as HTMLImageElement).currentSrc || image.getAttribute("src") || "";
        const sourceUrl = new URL(currentSource, window.location.href);
        return sourceUrl.searchParams.get("url") ?? sourceUrl.pathname;
      })
  );

  expect(new Set(sources).size).toBe(sources.length);
  await expect(page.getByRole("img", { name: "Home care story setting" })).toHaveAttribute(
    "src",
    /care-story-home-v1\.webp/
  );
  await expect(page.getByRole("img", { name: "Home Pet Sitting" })).toHaveAttribute(
    "src",
    /service_pet_sitting_v2\.jpg/
  );

  const journeyImages = [
    ["Workday walk", "dog-walking-3d.png"],
    ["Home visit", "service-pet-sitting.jpg"],
    ["At-home grooming", "care-journey-cat-grooming-v1.webp"],
    ["Veterinary support", "care-journey-cat-vet-v1.webp"]
  ] as const;

  for (const [label, fileName] of journeyImages) {
    await page.getByRole("tab", { name: label, exact: true }).click();
    const image = page.getByRole("img", { name: `${label} PetSaathi care journey illustration` });
    await expect(image).toHaveAttribute("src", new RegExp(fileName.replace(".", "\\.")));
    await expect(image).toBeVisible();
  }
});

test("service shortcut rail and care story carousel remain functional", async ({ page }) => {
  await page.goto("/");

  const shortcuts = page.getByRole("navigation", { name: "Quick service shortcuts" });
  await expect(shortcuts).toBeVisible();
  await expect(shortcuts.getByRole("link")).toHaveCount(6);
  await expect(shortcuts.getByRole("link", { name: "Grooming" })).toHaveAttribute("href", "/book?service=GROOMING_HOME");

  const storiesHeading = page.getByRole("heading", { name: "See the details families can compare." });
  await storiesHeading.scrollIntoViewIfNeeded();
  const firstStoryBefore = page.locator('[aria-live="polite"] article').first();
  const firstStoryText = await firstStoryBefore.textContent();
  await page.getByRole("button", { name: "Show next care stories" }).click();
  await expect(page.locator('[aria-live="polite"] article').first()).not.toHaveText(firstStoryText ?? "");
});

test("care concierge recommends a safe service and preserves pet context", async ({ page }) => {
  await page.goto("/");

  const concierge = page.getByRole("heading", { name: "Who needs care?" });
  await concierge.scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Cat", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: /home routine support/i }).click();
  await page.getByRole("button", { name: "See suggestion" }).click();

  await expect(page.getByRole("heading", { name: "Start with a home visit" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Continue with this care" })).toHaveAttribute("href", "/book?service=HOME_VISIT&petType=CAT");
});

test("care concierge routes urgent health intent away from emergency claims", async ({ page }) => {
  await page.goto("/");

  const concierge = page.getByRole("heading", { name: "Who needs care?" });
  await concierge.scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: /veterinary coordination/i }).click();
  await page.getByRole("button", { name: "See suggestion" }).click();

  await expect(page.getByText("PetSaathi is not an emergency service.", { exact: false })).toBeVisible();
  await expect(page.getByRole("link", { name: "Continue with this care" })).toHaveAttribute("href", "/book?service=VET_SUPPORT&petType=DOG");
});

test("care journey explorer changes context and preserves service intent", async ({ page }) => {
  await page.goto("/");

  const groomingTab = page.getByRole("tab", { name: "At-home grooming", exact: true });
  await groomingTab.scrollIntoViewIfNeeded();
  await groomingTab.click();

  await expect(groomingTab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("heading", { name: "You share" })).toBeVisible();
  await expect(page.getByText("Pet size and coat", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Plan this care" })).toHaveAttribute("href", "/book?service=GROOMING_HOME");
});

test("homepage has no horizontal overflow on mobile", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("luxury cursor halo stays viewport-anchored through scroll", async ({ page }) => {
  await page.goto("/");

  const hasFinePointer = await page.evaluate(() => matchMedia("(pointer: fine)").matches);
  const halo = page.getByTestId("luxury-cursor-halo");

  if (!hasFinePointer) {
    await expect(halo).toHaveCount(0);
    return;
  }

  await page.mouse.move(320, 240);
  await expect(halo).toBeVisible();
  expect(await halo.evaluate((element) => element.parentElement === document.body)).toBe(true);

  const beforeScroll = await halo.boundingBox();
  await page.mouse.wheel(0, 700);
  const afterScroll = await halo.boundingBox();

  expect(beforeScroll?.x).toBeCloseTo(afterScroll?.x ?? -1, 0);
  expect(beforeScroll?.y).toBeCloseTo(afterScroll?.y ?? -1, 0);
});

test("hero care films stream and remain selectable", async ({ page, request }) => {
  await page.goto("/");

  const film = page.locator("#hero-care-film");
  const walkingTab = page.getByRole("tab", { name: "Premium dog walking", exact: true });
  const trainingTab = page.getByRole("tab", { name: "Dog training", exact: true });

  await expect(film).toBeVisible();
  await expect(film).toHaveAttribute("poster", "/videos/dog-walking.jpg");
  await expect(walkingTab).toHaveAttribute("aria-selected", "true");

  await trainingTab.click();
  await expect(trainingTab).toHaveAttribute("aria-selected", "true");
  await expect(film.locator("source")).toHaveAttribute("src", "/videos/dog-training.mp4");

  const rangeResponse = await request.get("/videos/dog-training.mp4", {
    headers: { Range: "bytes=0-1023" }
  });
  expect(rangeResponse.status()).toBe(206);
  expect(rangeResponse.headers()["content-type"]).toContain("video/mp4");
});

test("quick care match carries safe selections into the booking wizard", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Care service").selectOption("GROOMING_HOME");
  await page.getByLabel("Pet type").selectOption("CAT");
  await page.getByLabel("City or locality").fill("Ahmedabad");
  await page.getByRole("button", { name: "Start private matching" }).click();

  await expect(page).toHaveURL(/\/book\?.*service=GROOMING_HOME.*petType=CAT.*locality=Ahmedabad/);
  await expect(page.locator('input[type="radio"][value="GROOMING_HOME"]')).toBeChecked();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByLabel("Pet type")).toHaveValue("CAT");
  await page.getByLabel("Pet name").fill("Milo");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByLabel("Locality")).toHaveValue("Ahmedabad");
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
