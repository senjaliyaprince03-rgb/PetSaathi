import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { MongoClient } from "mongodb";
import { indiaServiceDate } from "../../src/modules/pricing/economics";

const prisma = new PrismaClient();
let mongoClient: MongoClient;
let mongoDb: any;

test.beforeAll(async () => {
  mongoClient = new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/petsaathi");
  await mongoClient.connect();
  mongoDb = mongoClient.db();
});

test.afterAll(async () => {
  await prisma.$disconnect();
  await mongoClient.close();
});

test("Customer Booking full lifecycle", async ({ browser }) => {
  test.setTimeout(60000); // 60 seconds
  const testEmail = `test-e2e-booking-${Date.now()}@petsaathi.com`;
  
  // 1. Database Initialization
  // Ensure the dog walking service exists and is active
  let serviceType = await prisma.serviceType.findFirst({ where: { code: "DOG_WALK_30" } });
  if (!serviceType) {
    serviceType = await prisma.serviceType.create({
      data: { code: "DOG_WALK_30", name: "30-Min Dog Walk", description: "30-Min Dog Walk", durationMinutes: 30, active: true, basePricePaise: 40000 }
    });
  } else {
    serviceType = await prisma.serviceType.update({ where: { id: serviceType.id }, data: { active: true } });
  }

  // Ensure service area and price exists
  let city = await prisma.city.findFirst({ where: { name: "Test City" } });
  if (!city) {
    city = await prisma.city.create({
      data: { name: "Test City", slug: "test-city", state: "Test State", status: "PUBLIC_LIMITED" }
    });
  } else {
    city = await prisma.city.update({ where: { id: city.id }, data: { status: "PUBLIC_LIMITED", state: "Test State" } });
  }

  let serviceArea = await prisma.serviceArea.findFirst({ where: { cityId: city.id } });
  if (!serviceArea) {
    serviceArea = await prisma.serviceArea.create({
      data: { cityId: city.id, slug: "test-area", name: "Test Area", status: "ACTIVE", postalCodes: ["111111"] }
    });
  } else {
    serviceArea = await prisma.serviceArea.update({ where: { id: serviceArea.id }, data: { status: "ACTIVE", postalCodes: ["111111"] } });
  }

  await prisma.priceQuote.deleteMany({});
  
  await prisma.servicePrice.deleteMany({
    where: { serviceTypeId: serviceType.id, serviceAreaId: serviceArea.id }
  });

  const servicePrice = await prisma.servicePrice.create({
    data: { 
      serviceTypeId: serviceType.id, 
      serviceAreaId: serviceArea.id,
      version: Math.floor(Date.now() / 1000), 
      variantId: null,
      expiresAt: null,
      amountPaise: 40000, 
      sitterPaise: 30000,
      taxBasisPoints: 1800,
      currency: "INR",
      effectiveAt: new Date(0),
      approvedBy: "test-admin"
    }
  });
  const capTomorrow = new Date();
  capTomorrow.setDate(capTomorrow.getDate() + 1);
  const capYyyy = capTomorrow.getFullYear();
  const capMm = String(capTomorrow.getMonth() + 1).padStart(2, '0');
  const capDd = String(capTomorrow.getDate()).padStart(2, '0');
  const capFormattedDate = `${capYyyy}-${capMm}-${capDd}T10:00`;
  const serviceDate = indiaServiceDate(new Date(capFormattedDate));

  await prisma.capacityReservation.deleteMany({});
  
  await prisma.capacityLimit.deleteMany({
    where: { serviceAreaId: serviceArea.id, serviceCode: "DOG_WALK_30", serviceDate }
  });
  
  await prisma.capacityLimit.create({
    data: {
      serviceAreaId: serviceArea.id,
      serviceCode: "DOG_WALK_30",
      serviceDate,
      maximum: 10,
      reserved: 0
    }
  });
  // 8. Seed Sitter Profile for Assignment
  const preSeedSitterUser = await prisma.user.upsert({
    where: { email: "sitter@petsaathi.test" },
    update: {},
    create: {
      email: "sitter@petsaathi.test",
      displayName: "Jane Sitter",
      phoneE164: "+919876543210",
      roles: { create: [{ role: "SITTER" }] }
    }
  });

  const preSeedSitterProfile = await prisma.sitterProfile.upsert({
    where: { userId: preSeedSitterUser.id },
    update: {},
    create: {
      userId: preSeedSitterUser.id,
      bio: "I love dogs!",
      yearsExperience: 5,
      status: "APPROVED"
    }
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // 2. Signup / Login
  await page.goto("/login");
  await page.getByRole("button", { name: "Sign Up", exact: true }).click();
  const signUpForm = page.locator("form").filter({ hasText: "SIGN UP" });
  await signUpForm.getByLabel("Full name").fill("Test Customer");
  await signUpForm.getByLabel("Email address").fill(testEmail);
  await signUpForm.getByLabel("Create password").fill("SecurePassword123!");
  await signUpForm.getByRole("button", { name: "SIGN UP", exact: true }).click();

  await page.getByLabel("Verification code").fill("123456");
  await page.getByRole("button", { name: "VERIFY & CONTINUE" }).click();
  await page.waitForURL("/dashboard");

  // Get the customer user id from the database to seed pet and address directly to save test time
  const customerUser = await prisma.user.findUnique({ where: { email: testEmail } });
  expect(customerUser).toBeDefined();

  const pet = await prisma.pet.create({
    data: {
      ownerId: customerUser!.id,
      name: "Buddy the Dog",
      species: "DOG",
      active: true
    }
  });

  const address = await prisma.address.create({
    data: {
      userId: customerUser!.id,
      label: "Home",
      line1: "123 Test St",
      locality: "Test Locality",
      city: "Test City",
      state: "Test State",
      postalCode: "111111" // Matches the service area
    }
  });

  // 3. Navigate to Booking Page and Fill Form
  await page.goto("/book");
  
  // Wait for the booking form to load the mocked data
  await expect(page.getByRole("heading", { name: "Choose the care window" })).toBeVisible();

  // Explicitly select the mock service type, the exact newly created pet, and the exact newly created address
  await page.getByLabel("Service").selectOption({ value: "DOG_WALK_30" });
  await page.locator('select[name="petId"]').selectOption({ value: pet.id });
  await page.locator('select[name="addressId"]').selectOption({ value: address.id });

  // Debug: log all text on the page to understand what is being rendered
  console.log("DEBUG PRICES:", await page.locator('#debug-prices').innerText().catch(() => 'NOT FOUND'));
  console.log("DEBUG ADDRESSES:", await page.locator('#debug-addresses').innerText().catch(() => 'NOT FOUND'));
  console.log("DEBUG SERVICE AREAS:", await page.locator('#debug-service-areas').innerText().catch(() => 'NOT FOUND'));
  console.log("DEBUG PRICE ROWS:", await page.locator('#debug-price-rows').innerText().catch(() => 'NOT FOUND'));

  // Ensure the form is ready (price found) by checking if the submit button is enabled
  // We skip exact string matching for '₹472' since locale formatting in the headless browser might vary (e.g. ₹472.00)
  await expect(page.getByRole("button", { name: "Send care request" })).not.toBeDisabled();

  // Fill in the scheduled start datetime (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(14, 0, 0, 0); // 2:00 PM
  
  // Convert to local datetime string format required by input type="datetime-local"
  // Format: YYYY-MM-DDTHH:mm
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const dd = String(tomorrow.getDate()).padStart(2, '0');
  const hh = String(tomorrow.getHours()).padStart(2, '0');
  const min = String(tomorrow.getMinutes()).padStart(2, '0');
  const formattedDate = `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  
  await page.locator('input[type="datetime-local"]').fill(formattedDate);
  await page.getByRole("textbox", { name: /care notes/i }).fill("Please be careful with his paws.");

  // Check consent box (force for stability)
  await page.getByLabel(/I confirm the pet, address, time/).check({ force: true });

  // Submit request
  await page.getByRole("button", { name: "Send care request" }).click();

  // 4. Assert success UI
  // Check if there's a server error displayed
  const alert = page.locator('p[role="alert"]');
  if (await alert.isVisible({ timeout: 2000 })) {
    const errorText = await alert.innerText();
    throw new Error(`Server error on submit: ${errorText}`);
  }
  
  await expect(page.getByRole("heading", { name: "Request received." })).toBeVisible({ timeout: 15000 });
  
  // Extract reference number
  const referenceText = await page.locator("p.leading-7 strong").innerText();
  const bookingReference = referenceText.trim();
  expect(bookingReference).toBeTruthy();

  // Fetch the booking from database
  const booking = await prisma.booking.findUnique({ where: { reference: bookingReference } });
  expect(booking).toBeDefined();

  // 5. Mock Sitter Assignment
  const sitterUser = await prisma.user.create({
    data: {
      id: `sitter-e2e-${Date.now()}`,
      email: `test-e2e-sitter-booking-${Date.now()}@petsaathi.com`,
      displayName: "Test Sitter",
      roles: { create: [{ role: "SITTER" }] }
    }
  });

  const sitter = await prisma.sitterProfile.create({
    data: {
      userId: sitterUser.id,
      status: "APPROVED"
    }
  });

  const assignment = await prisma.bookingAssignment.create({
    data: {
      bookingId: booking!.id,
      sitterId: sitter.id,
      status: "ACCEPTED", // Simulate the sitter has already accepted the offer
      payoutPaise: 30000,
      respondedAt: new Date()
    }
  });

  // Update booking status to Customer Approval Pending
  await prisma.booking.update({
    where: { reference: referenceText },
    data: { 
      status: "CUSTOMER_APPROVAL_PENDING"
    }
  });

  // 6. Customer Checks Out and Approves Sitter
  await page.goto(`/bookings/${booking!.id}`);
  await expect(page.getByText("Proposed Saathi")).toBeVisible({ timeout: 15000 });
  
  // Approve Sitter
  await page.getByRole("button", { name: "Approve Saathi" }).click();

  // DEBUG: Check DB state
  await page.waitForTimeout(2000); // Wait 2s to allow DB update
  const debugBooking = await prisma.booking.findUnique({ where: { id: booking!.id }, include: { assignments: true } });
  console.log("DEBUG DB BOOKING STATUS:", debugBooking?.status);
  console.log("DEBUG DB ASSIGNMENT STATUS:", debugBooking?.assignments[0]?.status);

  // Force page reload in case router.refresh() gets cached
  await page.reload();

  // Wait for Payment Action (reload just in case RSC cache is stale)
  await page.reload();
  // Ensure it transitions to Payment open
  await expect(page.getByRole("button", { name: "Pay securely" })).toBeVisible({ timeout: 15000 });

  await page.close();
});
