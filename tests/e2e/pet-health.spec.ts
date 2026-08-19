import { test, expect } from "@playwright/test";
import { randomBytes, createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { MongoClient } from "mongodb";

const prisma = new PrismaClient();

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

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

test("Customer can add and view pet health records", async ({ browser }) => {
  const testEmail = `test-e2e-${Date.now()}@petsaathi.com`;

  const context = await browser.newContext();
  const page = await context.newPage();

  // 1. Sign up via UI
  await page.goto("/login");
  await page.getByRole("button", { name: "Sign Up", exact: true }).click();
  const signUpForm = page.locator("form").filter({ hasText: "SIGN UP" });
  await signUpForm.getByLabel("Full name").fill("Test User");
  await signUpForm.getByLabel("Email address").fill(testEmail);
  await signUpForm.getByLabel("Create password").fill("SecurePassword123!");
  await signUpForm.getByRole("button", { name: "SIGN UP", exact: true }).click();

  await page.getByLabel("Verification code").fill("123456");
  await page.getByRole("button", { name: "VERIFY & CONTINUE" }).click();
  await expect(page).toHaveURL("/dashboard");
  console.log("Cookies after login:", await context.cookies());

  // 2. Fetch created user and add pet
  const user = await prisma.user.findUnique({ where: { email: testEmail } });
  if (!user) throw new Error("User not found after signup");

  const pet = await prisma.pet.create({
    data: {
      ownerId: user.id,
      name: "Buddy",
      species: "DOG",
      breed: "Golden Retriever",
    }
  });

  // 3. Navigate to Pet Page (Mock creation didn't have full fields, so we will edit it)
  await page.goto(`/pets/${pet.id}/edit`);
  await page.getByLabel("Name", { exact: true }).fill("Buddy Edited");
  
  // Fill emergency contact
  await page.locator("input[name='emergencyName']").fill("John Doe");
  await page.locator("input[name='emergencyPhone']").fill("+919876543210");
  
  await page.getByRole("button", { name: "Save pet profile" }).click();
  
  await page.waitForURL(new RegExp(`/pets/${pet.id}`));
  await page.reload();
  await expect(page.getByRole("heading", { name: "Buddy Edited" })).toBeVisible();

  // 5. Submit Care Instructions
  await page.locator("summary").filter({ hasText: "Care instructions" }).click();
  await page.getByLabel("Feeding routine").fill("2 cups dry food morning and evening.");
  await page.getByLabel("Walk or activity routine").fill("30 mins walk in the evening.");
  await page.getByLabel("Behaviour and handling").fill("Friendly but pulls on leash.");
  await page.getByLabel("Handover notes").fill("Don't forget his favorite toy.");
  await page.getByRole("button", { name: "Save record" }).click();
  await expect(page.getByText("Record saved.")).toBeVisible();
  await page.reload();

  await expect(page.getByText("Feeding: 2 cups dry food morning and evening.")).toBeVisible();
  await expect(page.getByText("Walk/Activity: 30 mins walk in the evening.")).toBeVisible();
  await expect(page.getByText("Behaviour: Friendly but pulls on leash.")).toBeVisible();
  await expect(page.getByText("Notes: Don't forget his favorite toy.")).toBeVisible();

  // 6. Submit Medication
  await page.locator("summary").filter({ hasText: "Medication" }).click();
  await page.getByLabel("Name", { exact: true }).fill("Heartworm Pill");
  await page.getByLabel("Dosage").fill("1 tablet");
  await page.getByLabel("Schedule").fill("Monthly");
  await page.getByLabel("How it is given").fill("With food");
  await page.getByRole("button", { name: "Save record" }).click();
  await expect(page.getByText("Record saved.")).toBeVisible();
  await page.reload();
  
  await expect(page.getByText("Heartworm Pill")).toBeVisible();
  await expect(page.getByText("Admin: With food")).toBeVisible();

  // 7. Submit Vaccination
  await page.locator("summary").filter({ hasText: "Vaccination" }).click();
  await page.getByLabel("Vaccine").fill("Rabies");
  await page.getByLabel("Administered").fill("2024-01-01");
  await page.getByLabel("Clinic").fill("City Vet");
  await page.getByRole("button", { name: "Save record" }).click();
  await expect(page.getByText("Record saved.")).toBeVisible();
  await page.reload();

  await expect(page.getByText("Rabies")).toBeVisible();
  await expect(page.getByText("Clinic: City Vet")).toBeVisible();

  // 8. Submit Health Event
  await page.locator("summary").filter({ hasText: "Health timeline event" }).click();
  await page.getByLabel("Summary").fill("Annual Checkup");
  await page.getByLabel("When it happened").fill("2024-02-01T10:00");
  await page.getByLabel("Details").fill("Everything looks good.");
  await page.getByRole("button", { name: "Save record" }).click();
  await expect(page.getByText("Record saved.")).toBeVisible();
  await page.reload();

  await expect(page.getByText("Annual Checkup")).toBeVisible();

  // Verify the records page displays details properly
  await page.goto(`/pets/${pet.id}/records`);
  await expect(page.getByRole("heading", { name: "Annual Checkup" })).toBeVisible();
  await expect(page.getByText("Everything looks good.")).toBeVisible();
});
