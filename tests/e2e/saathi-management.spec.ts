import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { MongoClient } from "mongodb";

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

test("Saathi full lifecycle", async ({ browser }) => {
  const testEmail = `test-e2e-saathi-${Date.now()}@petsaathi.com`;

  const context = await browser.newContext();
  const page = await context.newPage();

  // 1. Sign up user via UI
  await page.goto("/login");
  await page.getByRole("button", { name: "Sign Up", exact: true }).click();
  const signUpForm = page.locator("form").filter({ hasText: "SIGN UP" });
  await signUpForm.getByLabel("Full name").fill("Test Saathi");
  await signUpForm.getByLabel("Email address").fill(testEmail);
  await signUpForm.getByLabel("Create password").fill("SecurePassword123!");
  await signUpForm.getByRole("button", { name: "SIGN UP", exact: true }).click();

  await page.getByLabel("Verification code").fill("123456");
  await page.getByRole("button", { name: "VERIFY & CONTINUE" }).click();
  await expect(page).toHaveURL("/dashboard");

  // 2. Go to /become-a-saathi and apply
  await page.goto("/become-a-saathi");
  await expect(page.getByRole("heading", { name: "Tell us about your care experience" })).toBeVisible();
  
  await page.getByLabel("Locality").fill("Test Locality");
  await page.getByLabel("Years caring for pets").fill("3");
  await page.getByLabel("30-minute walks").check();
  await page.getByLabel("Pet sitting").check();
  await page.getByLabel("Why would you be a thoughtful Saathi?").fill(
    "I have loved pets my entire life and have successfully raised three dogs. I understand their body language, nutritional needs, and exercise requirements completely. I am very responsible, detail-oriented, and I always ensure the safety of the pets under my care."
  );
  
  await page.getByRole("button", { name: "Submit application" }).click();
  await expect(page.getByRole("heading", { name: "Application received." })).toBeVisible();

  // 3. Admin: Verify application, create permissions
  const user = await prisma.user.findUnique({ where: { email: testEmail } });
  if (!user) throw new Error("User not found after signup");

  const sitter = await prisma.sitterProfile.findUnique({ where: { userId: user.id } });
  if (!sitter) throw new Error("Sitter profile not created");

  await prisma.$transaction(async (tx) => {
    await tx.sitterProfile.update({
      where: { id: sitter.id },
      data: { status: "APPROVED" }
    });

    // Mark service permissions as active
    await tx.sitterServicePermission.updateMany({
      where: { sitterId: sitter.id },
      data: { status: "ACTIVE" }
    });

    // Add background check pass verification
    await tx.sitterVerification.create({
      data: {
        sitterId: sitter.id,
        type: "BACKGROUND_CHECK",
        status: "PASSED",
        checkedAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    });

    // Add mock training module and attempt to verify training structure is prepared
    const module = await tx.trainingModule.create({
      data: {
        code: "ONBOARDING_101",
        title: "Saathi Essentials",
        contentRef: "s3://modules/onboarding_101.md"
      } as any
    });
    
    await tx.trainingAttempt.create({
      data: {
        sitterId: sitter.id,
        moduleId: module.id,
        status: "PASSED",
        score: 100,
        completedAt: new Date()
      } as any
    });
  });

  // 4. Check Saathi Dashboard
  await page.goto("/saathi");
  await expect(page.getByRole("heading", { name: "Your care ledger" })).toBeVisible();
  await expect(page.getByText("1 passed check")).toBeVisible();

  // 5. Create a Mock Booking Assignment for the Saathi
  await prisma.$transaction(async (tx) => {
    const serviceType = await tx.serviceType.findFirst({ where: { code: "DOG_WALK_30" } });
    if (!serviceType) throw new Error("Service type not found");

    const pet = await tx.pet.create({
      data: {
        ownerId: user.id, // Using the same user as owner just for mocking
        name: "Test Dog",
        species: "DOG"
      }
    });

    const address = await tx.address.create({
      data: {
        userId: user.id,
        label: "Home",
        line1: "123 Test St",
        locality: "Test Locality",
        city: "Test City",
        state: "Test State",
        postalCode: "123456"
      }
    });

    const booking = await tx.booking.create({
      data: {
        reference: `BKG-${Date.now()}`,
        customerId: user.id,
        petId: pet.id,
        serviceTypeId: serviceType.id,
        addressId: address.id,
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        scheduledEnd: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60000),
        status: "CONFIRMED",
        quoteAmountPaise: 50000
      }
    });

    await tx.bookingAssignment.create({
      data: {
        bookingId: booking.id,
        sitterId: sitter.id,
        status: "OFFERED",
        payoutPaise: 40000,
        responseDueAt: new Date(Date.now() + 60 * 60 * 1000)
      }
    });
  });

  // 6. Accept the Assignment
  await page.goto("/saathi/assignments");
  await expect(page.getByText("Test Dog")).toBeVisible();
  await page.getByRole("button", { name: "Accept offer" }).click();

  // Assuming it triggers a state update to 'ACCEPTED' or 'CUSTOMER_APPROVED'
  await expect(page.getByText("ACTIVE").or(page.getByText("ACCEPTED")).or(page.getByText("CUSTOMER APPROVED"))).toBeVisible();

});
