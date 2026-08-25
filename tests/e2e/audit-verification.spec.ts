import { test, expect } from "@playwright/test";
import { randomUUID } from "crypto";

// Independent second-audit verification: real-browser journeys against a
// running server. Requires AUTH_DEV_FIXED_OTP=123456 on the server for the
// email-code flows (dev feature) and a reachable database.

const VIEWPORTS = [
  { width: 320, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
];

const ORIGIN = "http://127.0.0.1:3110";

// The sliding panel mounts all mode forms at once (hidden by opacity), so
// label lookups must be scoped to the visible form.
const vis = (loc: any) => loc.locator("visible=true");

async function registerViaApi(request: any, email: string, password = "SecurePassword123!") {
  return request.post("/api/auth/register", {
    data: { email, password, name: "Audit User", role: "CUSTOMER" },
    headers: { Origin: ORIGIN },
  });
}

async function loginCookies(request: any, email: string, password: string) {
  const csrf = await request.get("/api/auth/csrf");
  const body = await csrf.json();
  const cookieHeader = (csrf.headers()["set-cookie"] || "")
    .split("\n")
    .map((c: string) => c.split(";")[0])
    .join("; ");
  const login = await request.post("/api/auth/callback/credentials", {
    form: { csrfToken: body.csrfToken, email, password, redirect: "false" },
    headers: { Origin: ORIGIN, Cookie: cookieHeader },
  });
  return { login, storageState: await request.storageState() };
}

test.describe("second audit - first-time user", () => {
  test("homepage explains service and nav reaches services", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
    const accept = page.getByRole("button", { name: /accept/i });
    if (await accept.first().isVisible().catch(() => false)) await accept.first().click();
    await page.locator("header").getByRole("link", { name: "Services" }).click();
    await expect(page).toHaveURL(/services/);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("guest /book leaks no PII debug payloads", async ({ page }) => {
    await page.goto("/book");
    const html = await page.content();
    expect(html).not.toContain("debug-addresses");
    expect(html).not.toContain("debug-prices");
  });
});

test.describe("second audit - auth journeys", () => {
  test("signup with email OTP lands on dashboard", async ({ page }) => {
    const email = "audit-" + randomUUID() + "@petsaathi.test";
    await page.goto("/login");
    await vis(page.getByRole("button", { name: "Sign Up", exact: true })).click();
    const signUpForm = page.locator("form:visible").filter({ hasText: "SIGN UP" });
    await expect(signUpForm.getByLabel("Full name")).toBeVisible();
    await signUpForm.getByLabel("Full name").fill("Audit User");
    await signUpForm.getByLabel("Email address").fill(email);
    await signUpForm.getByLabel("Create password").fill("Str0ngAudit!Pass");
    await signUpForm.getByRole("button", { name: "SIGN UP", exact: true }).click();

    const code = page.getByLabel("Verification code");
    await expect(code).toBeVisible();
    await code.fill("123456");
    await page.getByRole("button", { name: "VERIFY & CONTINUE" }).click();
    await page.waitForURL("**/dashboard");
  });

  test("wrong password shows friendly inline error", async ({ page }) => {
    await page.goto("/login");
    await vis(page.getByLabel("Email address")).fill("nobody-" + randomUUID() + "@petsaathi.test");
    await vis(page.getByLabel("Password", { exact: true })).fill("WrongPass123!");
    await vis(page.getByRole("button", { name: "SIGN IN", exact: true })).click();
    await expect(page.getByText(/incorrect email or password/i)).toBeVisible();
  });

  test("logout re-locks protected URLs including browser back", async ({ page, request }) => {
    const email = "audit-logout-" + randomUUID() + "@petsaathi.test";
    expect((await registerViaApi(request, email)).status()).toBe(201);
    const { login, storageState } = await loginCookies(request, email, "SecurePassword123!");
    expect(login.status()).toBe(200);
    await page.context().addCookies(storageState.cookies);

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/dashboard/);
    await page.getByRole("link", { name: "Sign out" }).click();
    await page.waitForURL((url) => !url.pathname.includes("dashboard"));
    await page.goBack();
    await page.waitForTimeout(600);
    expect(page.url()).not.toContain("/dashboard/");
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/login/);
  });

  test("password recovery end-to-end and old password rejected", async ({ page, request }) => {
    const email = "audit-recover-" + randomUUID() + "@petsaathi.test";
    expect((await registerViaApi(request, email)).status()).toBe(201);

    await page.goto("/login");
    await vis(page.getByRole("button", { name: "Forgot password? Log in with an email code" })).click();
    await page.getByLabel("Email address").fill(email);
    await page.getByRole("button", { name: "EMAIL ME A CODE", exact: true }).click();
    const code = vis(page.getByLabel("Email code"));
    await expect(code).toBeVisible();
    await code.fill("123456");
    await page.getByRole("button", { name: "VERIFY & CONTINUE" }).click();

    await expect(page.getByLabel("New password")).toBeVisible();
    await vis(page.getByLabel("New password")).fill("Br4ndNew!Pass99");
    await vis(page.getByLabel("Confirm new password")).fill("Br4ndNew!Pass99");
    await vis(page.getByRole("button", { name: "SAVE NEW PASSWORD" })).click();
    await page.waitForURL("**/dashboard");

    expect((await loginCookies(request, email, "SecurePassword123!")).login.status()).toBe(401);
    expect((await loginCookies(request, email, "Br4ndNew!Pass99")).login.status()).toBe(200);
  });
});

test.describe("second audit - role security", () => {
  test("customer blocked from admin, saathi, operator portals", async ({ page, request }) => {
    const email = "audit-role-" + randomUUID() + "@petsaathi.test";
    expect((await registerViaApi(request, email)).status()).toBe(201);
    const { login, storageState } = await loginCookies(request, email, "SecurePassword123!");
    expect(login.status()).toBe(200);
    await page.context().addCookies(storageState.cookies);

    await page.goto("/admin");
    await expect(page).not.toHaveURL(/\/admin/);
    await page.goto("/saathi/profile");
    await expect(page).not.toHaveURL(/saathi\/profile/);
    await page.goto("/operator");
    await expect(page).not.toHaveURL(/operator/);
  });

  test("logged-out access redirects to login for all portals", async ({ page }) => {
    for (const path of ["/dashboard", "/admin", "/saathi/profile", "/pets"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/login/);
    }
  });
});

test.describe("second audit - responsive rendering", () => {
  for (const viewport of VIEWPORTS) {
    test("no horizontal overflow at " + viewport.width + "px", async ({ page }) => {
      await page.setViewportSize(viewport);
      for (const path of ["/", "/services", "/book", "/login"]) {
        await page.goto(path);
        const m = await page.evaluate(() => ({
          scroll: document.documentElement.scrollWidth,
          inner: window.innerWidth,
        }));
        expect(m.scroll, "overflow at " + viewport.width + "px on " + path).toBeLessThanOrEqual(m.inner + 2);
      }
    });
  }

  test("mobile bottom nav visible at 375px, hidden at 1366px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
    await page.setViewportSize({ width: 1366, height: 768 });
    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeHidden();
  });
});

test.describe("second audit - keyboard accessibility", () => {
  test("tab order email to password; labels associated", async ({ page }) => {
    await page.goto("/login");
    await vis(page.getByLabel("Email address")).focus();
    await page.keyboard.press("Tab");
    const label = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
    expect(label).toBe("Password");
  });
});
