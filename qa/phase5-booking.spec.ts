import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";
const ARTIFACTS_DIR = path.resolve("qa/artifacts");

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

test.describe("Phase 5: Booking Flow End-to-End Audit", () => {
  test.setTimeout(120_000);

  // -------------------------------------------------------------
  // Test 1: Service Preselection from /book and /services/[slug]
  // -------------------------------------------------------------
  test("1. Verify ?service= preselection across all service codes and /services/[slug]", async ({ page }) => {
    console.log("Testing service preselection...");
    const serviceCodes = [
      "DOG_WALK_30",
      "DOG_WALK_60",
      "HOME_VISIT",
      "HOME_SITTING_60",
      "GROOMING_HOME",
      "VET_SUPPORT",
      "TRAINING_ASSESSMENT",
      "PET_TAXI",
    ];

    for (const code of serviceCodes) {
      await page.goto(`${BASE_URL}/book?service=${code}`);
      const selectedRadio = page.locator(`input[type="radio"][value="${code}"]`);
      await expect(selectedRadio).toBeChecked();
    }
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "p5-service-preselect.png") });

    // Test boarding-beta page CTA landing
    await page.goto(`${BASE_URL}/services/boarding-beta`);
    const waitlistCta = page.getByRole("link", { name: /Boarding Waitlist/i });
    await expect(waitlistCta).toBeVisible();
    const href = await waitlistCta.getAttribute("href");
    console.log("Boarding beta CTA href:", href);
    expect(href).toContain("/contact?topic=BOARDING_PILOT");

    // Test /book?service=boarding-beta behavior
    await page.goto(`${BASE_URL}/book?service=boarding-beta`);
    const defaultRadio = page.locator('input[type="radio"][value="DOG_WALK_30"]');
    const isDogWalkChecked = await defaultRadio.isChecked();
    console.log("/book?service=boarding-beta defaulted to DOG_WALK_30:", isDogWalkChecked);
  });

  // -------------------------------------------------------------
  // Test 2: Unauthenticated Wizard Validation & State Persistence
  // -------------------------------------------------------------
  test("2. Unauthenticated BookingWizard validation edge cases, XSS, and state loss", async ({ page }) => {
    console.log("Testing unauthenticated wizard validation...");
    await page.goto(`${BASE_URL}/book`);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "p5-wizard-step0.png") });

    // Step 0 -> Step 1
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Who are we caring for?")).toBeVisible();

    // 2.1 Empty pet name
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Tell us your pet's name")).toBeVisible();
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "p5-empty-pet-name.png") });

    // 2.2 200-char pet name + Hindi/Gujarati/Emoji
    const longName = "🐶 Bruno મોતી मोती " + "A".repeat(180);
    await page.getByPlaceholder("e.g. Miso").fill(longName);
    await page.getByRole("button", { name: "Continue" }).click();
    // Step 1 should pass because no max length is enforced
    await expect(page.getByText("When and where?")).toBeVisible();

    // 2.3 Past date and 2-years future date
    const dateInput = page.locator('input[type="date"]');
    await dateInput.fill("2020-01-01"); // past date
    const timeInput = page.locator('input[type="time"]');
    await timeInput.fill("03:00"); // 3 AM
    const localityInput = page.getByPlaceholder("Bopal, Ahmedabad");
    await localityInput.fill("Invalid Locality Non-Pilot Mars Colony");
    await page.getByRole("button", { name: "Continue" }).click();
    // Step 2 should pass because no date range or locality checks exist in wizard
    await expect(page.getByText("How can we reach you?")).toBeVisible();
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "p5-wizard-step3.png") });

    // 2.4 Mobile validation: 9-digit, letters, valid Indian mobile
    const phoneInput = page.getByPlaceholder("10-digit mobile");
    await phoneInput.fill("987654321"); // 9 digits
    await page.getByRole("button", { name: "Review request" }).click();
    await expect(page.getByText("Enter a valid 10-digit Indian mobile number")).toBeVisible();

    await phoneInput.fill("abcdefghij"); // letters
    await page.getByRole("button", { name: "Review request" }).click();
    await expect(page.getByText("Enter a valid 10-digit Indian mobile number")).toBeVisible();

    // Fill valid mobile + parent name + XSS payload in notes
    await page.getByPlaceholder("10-digit mobile").fill("9876543210");
    await page.locator('input[autocomplete="name"]').fill("Test Parent <script>alert(1)</script>");
    await page.getByPlaceholder(/Routine, temperament/).fill('<script>alert("XSS")</script>');
    await page.getByRole("button", { name: "Review request" }).click();

    // Check submission status UI
    await expect(page.getByText("Your care request is ready.")).toBeVisible();
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "p5-wizard-submitted.png") });

    // 2.5 State loss on refresh mid-wizard
    await page.goto(`${BASE_URL}/book`);
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByPlaceholder("e.g. Miso").fill("TempPetName");
    await page.reload();
    // After reload, wizard resets to step 0
    await expect(page.getByText("What kind of care?")).toBeVisible();
  });

  // -------------------------------------------------------------
  // Test 3: Authenticated Booking Flow & Price Tampering Interception
  // -------------------------------------------------------------
  test("3. Authenticated booking creation, price tampering interception, and DB verification", async ({ page, request }) => {
    console.log("Testing authenticated booking creation...");
    const testEmail = `qa-book-auth-${Date.now()}@petsaathi.com`;

    // 1. Register & verify test customer
    await page.goto(`${BASE_URL}/login`);
    await page.getByRole("button", { name: "Sign Up", exact: true }).click();
    const signUpForm = page.locator("form").filter({ hasText: "SIGN UP" });
    await signUpForm.getByLabel("Full name").fill("QA Booking Parent");
    await signUpForm.getByLabel("Email address").fill(testEmail);
    await signUpForm.getByLabel("Create password").fill("SecurePassword123!");
    await signUpForm.getByRole("button", { name: "SIGN UP", exact: true }).click();

    const verificationCode = page.getByLabel("Verification code");
    await expect(verificationCode).toBeVisible();
    await verificationCode.fill("123456");
    await page.getByRole("button", { name: "VERIFY & CONTINUE" }).click();
    await page.waitForURL("**/dashboard");

    // 2. Seed Pet, Address, ServiceArea, ServicePrice, CapacityLimit via Prisma
    const customerUser = await prisma.user.findUnique({ where: { email: testEmail } });
    expect(customerUser).toBeTruthy();

    const pet = await prisma.pet.create({
      data: {
        ownerId: customerUser!.id,
        name: "Sheru",
        species: "DOG",
        active: true,
      },
    });

    // Ensure City and Service Area exist
    const city = await prisma.city.upsert({
      where: { slug: "ahmedabad" },
      update: { status: "PUBLIC_LIMITED" },
      create: { name: "Ahmedabad", slug: "ahmedabad", state: "Gujarat", status: "PUBLIC_LIMITED" },
    });

    const serviceArea = await prisma.serviceArea.upsert({
      where: { cityId_slug: { cityId: city.id, slug: "bopal" } },
      update: { status: "ACTIVE", postalCodes: ["380058"] },
      create: { cityId: city.id, slug: "bopal", name: "Bopal", status: "ACTIVE", postalCodes: ["380058"] },
    });

    const address = await prisma.address.create({
      data: {
        userId: customerUser!.id,
        label: "Home",
        line1: "A-101 Galaxy Heights, South Bopal",
        locality: "Bopal",
        city: "Ahmedabad",
        state: "Gujarat",
        postalCode: "380058",
      },
    });

    // Ensure service DOG_WALK_30 exists
    const serviceType = await prisma.serviceType.upsert({
      where: { code: "DOG_WALK_30" },
      update: { active: true },
      create: { code: "DOG_WALK_30", name: "30-Min Dog Walk", description: "Walking", durationMinutes: 30, active: true, basePricePaise: 29900 },
    });

    // Seed approved price
    const servicePrice = await prisma.servicePrice.create({
      data: {
        serviceTypeId: serviceType.id,
        serviceAreaId: serviceArea.id,
        version: Math.floor(Date.now() / 1000),
        amountPaise: 29900,
        sitterPaise: 20000,
        taxBasisPoints: 1800,
        currency: "INR",
        effectiveAt: new Date(0),
        approvedBy: "test-admin",
      },
    });

    // Seed capacity limit for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const serviceDate = tomorrow.toISOString().slice(0, 10);

    await prisma.capacityLimit.upsert({
      where: {
        serviceAreaId_serviceCode_serviceDate: {
          serviceAreaId: serviceArea.id,
          serviceCode: "DOG_WALK_30",
          serviceDate,
        },
      },
      update: { maximum: 20, reserved: 0 },
      create: {
        serviceAreaId: serviceArea.id,
        serviceCode: "DOG_WALK_30",
        serviceDate,
        maximum: 20,
        reserved: 0,
      },
    });

    // 3. Test price tampering interception via direct API request
    console.log("Testing price tampering interception...");
    const scheduledStart = new Date(tomorrow);
    scheduledStart.setHours(10, 0, 0, 0);

    // Attempt tampering: passing a forged servicePriceId
    const tamperedRes = await page.request.post(`${BASE_URL}/api/bookings`, {
      headers: { "Content-Type": "application/json", Origin: BASE_URL },
      data: {
        petId: pet.id,
        addressId: address.id,
        serviceCode: "DOG_WALK_30",
        servicePriceId: "forged-fake-price-id",
        scheduledStart: scheduledStart.toISOString(),
        customerNotes: "Tampering test",
      },
    });
    console.log("Price tampering response status:", tamperedRes.status(), await tamperedRes.json());
    expect([404, 409, 422]).toContain(tamperedRes.status());

    // 4. Valid booking submission via UI
    await page.goto(`${BASE_URL}/book`);
    await expect(page.getByRole("heading", { name: "Choose the care window" })).toBeVisible();

    await page.locator('select[name="petId"]').selectOption(pet.id);
    await page.locator('select[name="addressId"]').selectOption(address.id);
    await page.locator('select[name="serviceCode"]').selectOption("DOG_WALK_30");

    // Format datetime-local
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    await page.locator('input[type="datetime-local"]').fill(`${yyyy}-${mm}-${dd}T10:00`);
    await page.locator('textarea[name="customerNotes"]').fill("Notes: handle gently. <script>alert(1)</script>");

    await page.getByRole("button", { name: "Send care request" }).click();
    await expect(page.getByRole("heading", { name: "Request received." })).toBeVisible({ timeout: 15_000 });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "p5-booking-received.png") });

    // 5. Inspect database record
    const savedBooking = await prisma.booking.findFirst({
      where: { customerId: customerUser!.id },
      include: { pet: true, address: true, serviceType: true, priceQuotes: true },
      orderBy: { createdAt: "desc" },
    });
    console.log("SAVED DB BOOKING:", JSON.stringify(savedBooking, null, 2));
    expect(savedBooking).toBeTruthy();
    expect(savedBooking?.status).toBe("REQUESTED");
    expect(savedBooking?.quoteAmountPaise).toBeGreaterThan(0);
  });
});
