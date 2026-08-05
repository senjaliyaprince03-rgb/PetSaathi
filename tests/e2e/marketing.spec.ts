import { expect, test } from "@playwright/test";

test("public homepage exposes the core conversion paths", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Care That Feels Like Family.");
  await expect(page.getByRole("button", { name: "Start Assisted Matching" })).toBeVisible();
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

  const logo = page.getByRole("img", { name: "PetSaathi — Since 2026" }).first();
  await expect(logo).toBeVisible();
  expect(await logo.evaluate((image: HTMLImageElement) => image.currentSrc)).toContain(
    "petsaathi-logo-horizontal-brand.png"
  );

  const iconHref = await page.locator('link[rel="icon"][type="image/png"]').getAttribute("href");
  expect(iconHref).toBe("/icons/petsaathi-favicon-v2.png");
});

test("hero background stays clear, full-bleed, and free of a page-wide filter", async ({ page }) => {
  await page.goto("/");

  const hero = page.getByTestId("marketing-hero");
  const background = page.getByTestId("marketing-hero-background");
  await expect(hero).toBeVisible();
  await expect(background).toBeVisible();

  const imageState = await background.evaluate((image: HTMLImageElement) => ({
    complete: image.complete,
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight
  }));
  expect(imageState.complete).toBe(true);
  expect(imageState.naturalWidth).toBeGreaterThan(300);
  expect(imageState.naturalHeight).toBeGreaterThan(200);

  const [heroBox, backgroundBox] = await Promise.all([hero.boundingBox(), background.boundingBox()]);
  expect(backgroundBox?.width).toBeGreaterThanOrEqual((heroBox?.width ?? 0) - 1);
  expect(backgroundBox?.height).toBeGreaterThanOrEqual((heroBox?.height ?? 0) - 1);
  await expect(hero.locator(":scope > .absolute.inset-0.bg-white\\/40")).toHaveCount(0);
});

test("homepage trust copy contains no fabricated scale or universal guarantees", async ({ page }) => {
  await page.goto("/");

  const publicCopy = await page.locator("main").innerText();
  for (const unsupportedClaim of [
    /10,?000\+?/i,
    /78%\s*rating/i,
    /100%\s*(verified|background-checked)/i,
    /24\/7\s*(human|supervisor|support)/i,
    /continuous tracking/i,
  ]) {
    expect(publicCopy).not.toMatch(unsupportedClaim);
  }
  expect(publicCopy).toContain("Service-Specific Permission Checks");
});

test("corporate programme page is truthful and has a working enquiry path", async ({
  page,
}) => {
  await page.goto("/corporate/pet-care-benefits");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Pet-care benefits with accountable controls.",
    }),
  ).toBeVisible();
  await expect(page.getByText("Designed to fail closed.")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Contact the partner team" }),
  ).toHaveAttribute("href", "/contact");

  const copy = await page.locator("main").innerText();
  expect(copy).not.toMatch(/emergency boarding|priority access|leading companies/i);
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
  await expect(page.getByRole("img", { name: "Pet parent", exact: false }).first()).toBeVisible();

  const journeyImages = [
    ["Workday walk", "dog-walking-3d.png"],
    ["Home visit", "service-pet-sitting.jpg"],
    ["At-home grooming", "care-journey-cat-grooming-v1.webp"],
    ["Veterinary support", "care-journey-cat-vet-v1.webp"]
  ] as const;

  for (const [label, fileName] of journeyImages) {
    await page.getByLabel(/care journey/i).getByRole("tab", { name: label, exact: false }).click();
    const image = page.getByRole("img", { name: new RegExp(`^${label} PetSaathi care journey illustration$`) });
    await expect(image).toHaveAttribute("src", new RegExp(fileName.replace(".", "\\.")));
    await expect(image).toBeVisible();
  }
});

test("services grid renders and contains the right services", async ({ page }) => {
  await page.goto("/");

  const servicesSection = page.getByRole("heading", { name: "Comprehensive Services Designed for Every Need." });
  await servicesSection.scrollIntoViewIfNeeded();
  await expect(servicesSection).toBeVisible();

  await expect(page.getByRole("heading", { name: /In-Home Grooming/i }).first()).toBeVisible();
});

test("care concierge recommends a safe service and preserves pet context", async ({ page }) => {
  await page.goto("/");

  const concierge = page.getByRole("heading", { name: "Who needs care?" });
  await concierge.scrollIntoViewIfNeeded();

  const catButton = page.getByRole("button", { name: "Cat" });
  await expect(catButton).toBeVisible();
  await catButton.click();

  const continueBtn = page.getByRole("button", { name: "Continue" });
  await expect(continueBtn).toBeVisible();
  await continueBtn.click();

  const routineBtn = page.getByRole("button", { name: /home routine support/i });
  await expect(routineBtn).toBeVisible();
  await routineBtn.click();

  const suggestionBtn = page.getByRole("button", { name: "See suggestion" });
  await expect(suggestionBtn).toBeVisible();
  await suggestionBtn.click();

  await expect(page.getByRole("heading", { name: "Start with a home visit" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Continue with this care" })).toHaveAttribute("href", "/book?service=HOME_VISIT&petType=CAT");
});

test("care concierge routes urgent health intent away from emergency claims", async ({ page }) => {
  await page.goto("/");

  const concierge = page.getByRole("heading", { name: "Who needs care?" });
  await concierge.scrollIntoViewIfNeeded();

  const continueBtn = page.getByRole("button", { name: "Continue" });
  await expect(continueBtn).toBeVisible();
  await continueBtn.click();

  const vetBtn = page.getByRole("button", { name: /veterinary coordination/i });
  await expect(vetBtn).toBeVisible();
  await vetBtn.click();

  const suggestionBtn = page.getByRole("button", { name: "See suggestion" });
  await expect(suggestionBtn).toBeVisible();
  await suggestionBtn.click();

  await expect(page.locator('text=/PetSaathi is not an emergency service/i')).toBeVisible();
  await expect(page.getByRole("link", { name: "Continue with this care" })).toHaveAttribute("href", "/book?service=VET_SUPPORT&petType=DOG");
});

test("care journey explorer changes context and preserves service intent", async ({ page }) => {
  await page.goto("/");

  const groomingTab = page.locator('#care-journey-tab-grooming');
  await groomingTab.scrollIntoViewIfNeeded();
  await groomingTab.click({ force: true });

  await expect(page.locator('h3:has-text("You share")')).toBeVisible();
  await expect(page.locator('text="Pet size and coat"').first()).toBeVisible();
  await expect(page.locator('a:has-text("Plan this care")').first()).toHaveAttribute("href", "/book?service=GROOMING_HOME");
});

test("homepage has no horizontal overflow on mobile", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("custom cursor remains fixed behind the pointer while the document scrolls", async ({ page, isMobile }) => {
  test.skip(isMobile, "Touch devices intentionally do not render a custom cursor.");

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const supportsFinePointer = await page.evaluate(() => matchMedia("(pointer: fine)").matches);
  test.skip(!supportsFinePointer, "The browser project does not expose a fine pointer.");

  const halo = page.getByTestId("luxury-cursor-halo");
  await expect(halo).toHaveAttribute("data-ready", "true");
  await page.mouse.move(320, 240);
  await expect(halo).toBeVisible();
  expect(await halo.evaluate((element) => element.parentElement === document.body)).toBe(true);
  await expect(halo).toHaveCSS("position", "fixed");
  await expect(halo).toHaveCSS("pointer-events", "none");

  const beforeScroll = await halo.boundingBox();
  await page.evaluate(() => window.scrollBy({ top: 900, behavior: "instant" }));
  const afterScroll = await halo.boundingBox();

  expect(beforeScroll?.x).toBeCloseTo(afterScroll?.x ?? -1, 0);
  expect(beforeScroll?.y).toBeCloseTo(afterScroll?.y ?? -1, 0);
});

test("hero care films stream and remain selectable", async ({ page, request }) => {
  await page.goto("/");

  const film = page.locator("#hero-care-film");
  const walkingTab = page.locator('button[aria-controls="hero-care-film"]:has-text("Premium dog walking")');
  const trainingTab = page.locator('button[aria-controls="hero-care-film"]:has-text("Dog training")');

  await expect(film).toBeVisible();
  await expect(film).toHaveAttribute("poster", /dog-walking\.jpg/);
  await expect(walkingTab).toHaveAttribute("aria-selected", "true");

  await trainingTab.click({ force: true });
  await expect(trainingTab).toHaveAttribute("aria-selected", "true");
  await expect(film.locator("source")).toHaveAttribute("src", /dog-training\.mp4/);

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
  await page.getByRole("button", { name: "Start Assisted Matching" }).click();

  await page.waitForURL(/\/book\?.*service=GROOMING_HOME.*petType=CAT.*locality=Ahmedabad/);
  await expect(page.locator('input[type="radio"][value="GROOMING_HOME"]')).toBeChecked();
  await page.waitForTimeout(500); // Give React time to hydrate the wizard form
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByLabel("Pet type")).toHaveValue("CAT");
  await page.getByLabel("Pet name").fill("Milo");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByLabel("Locality")).toHaveValue("Ahmedabad");
});

test("anonymous care request validates locally and hands off to secure sign-in", async ({ page }) => {
  await page.goto("/book");
  await page.waitForTimeout(500); // Allow hydration
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

test("sign-in presents the configured password flow", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Password", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "SIGN IN" })).toBeEnabled();
  await expect(page.getByText("OTP delivery stays disabled")).toHaveCount(0);
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
  await expect(page).toHaveURL(/\/login\?returnTo=%2Fadmin|\/login\?returnTo=\/admin/);

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
  await expect(page).toHaveURL(/\/login\?returnTo=%2Fadmin|\/login\?returnTo=\/admin/);
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
  await expect(page).toHaveURL(/\/login\?returnTo=%2Fadmin|\/login\?returnTo=\/admin/);
  await page.goto("/admin/safety");
  await expect(page).toHaveURL(/\/login\?returnTo=%2Fadmin|\/login\?returnTo=\/admin/);

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
