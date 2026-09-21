/**
 * Verification test for BUG-036: Simultaneous double-click duplicate booking prevention
 * Submits 2 concurrent booking requests for the exact same pet, slot, and address.
 * Expects: exactly one 201 Created and one 409 Conflict.
 */

import dns from "node:dns";
try { dns.setServers(["8.8.8.8", "8.8.4.4"]); } catch {}
import { preparePrismaEnvironment } from "../scripts/prepare-prisma-uri.mjs";
await preparePrismaEnvironment(process.env);
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";

async function runTest() {
  console.log("================================================================================");
  console.log("       PETSAATHI QA AUDIT — CONCURRENT DUPLICATE BOOKING TEST (BUG-036)         ");
  console.log("================================================================================");

  // 1. Create a clean test customer
  const email = `test-e2e-concurrency-${Date.now()}@petsaathi.com`;
  const signupRes = await fetch(`${BASE_URL}/api/auth/password/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL },
    body: JSON.stringify({
      displayName: "QA Concurrency Tester",
      email,
      password: "Password123!",
      role: "CUSTOMER",
    }),
  });
  const signupData = await signupRes.json();
  const otp = signupData.developmentOtp || "123456";

  const verifyRes = await fetch(`${BASE_URL}/api/auth/email/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL },
    body: JSON.stringify({ email, otp }),
  });
  const setCookie = verifyRes.headers.get("set-cookie") || "";
  const match = setCookie.match(/petsaathi_session=([^;]+)/);
  const cookie = match ? `petsaathi_session=${match[1]}` : "";

  console.log("Signup status:", signupRes.status, "Verify status:", verifyRes.status, "Cookie:", cookie ? "present" : "EMPTY");
  const user = await prisma.user.findFirst({ where: { email } });
  const pet = await prisma.pet.create({
    data: { ownerId: user.id, name: "ConcurrencyBruno", species: "DOG", active: true },
  });
  const address = await prisma.address.create({
    data: {
      userId: user.id,
      label: "Home",
      line1: "Flat 402, Satellite",
      locality: "Bopal",
      city: "Ahmedabad",
      state: "Gujarat",
      postalCode: "380058",
    },
  });

  // Find active price for DOG_WALK_30
  const serviceArea = await prisma.serviceArea.findFirst({
    where: { status: "ACTIVE", postalCodes: { has: "380058" } },
  });
  const serviceType = await prisma.serviceType.findFirst({ where: { code: "DOG_WALK_30" } });
  const servicePrice = await prisma.servicePrice.findFirst({
    where: { serviceTypeId: serviceType.id, serviceAreaId: serviceArea.id },
  });

  // Ensure capacity limit exists for the service date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const scheduledStart = new Date(tomorrow);
  scheduledStart.setHours(10, 0, 0, 0); // 10:00 AM IST (in service window)

  const indiaOffsetMs = 5.5 * 60 * 60 * 1000;
  const india = new Date(tomorrow.getTime() + indiaOffsetMs);
  const serviceDate = new Date(Date.UTC(india.getUTCFullYear(), india.getUTCMonth(), india.getUTCDate()));

  await prisma.capacityLimit.upsert({
    where: {
      serviceAreaId_serviceCode_serviceDate: {
        serviceAreaId: serviceArea.id,
        serviceCode: "DOG_WALK_30",
        serviceDate,
      },
    },
    update: { maximum: 10, reserved: 0 },
    create: {
      serviceAreaId: serviceArea.id,
      serviceCode: "DOG_WALK_30",
      serviceDate,
      maximum: 10,
      reserved: 0,
    },
  });

  console.log("User ID:", user?.id, "Pet ID:", pet.id, "Address ID:", address.id);
  console.log("Submitting 2 concurrent booking requests for identical pet + slot...");
  const bookingPayload = {
    petId: pet.id,
    addressId: address.id,
    serviceCode: "DOG_WALK_30",
    servicePriceId: servicePrice.id,
    scheduledStart: scheduledStart.toISOString(),
    customerNotes: "Testing concurrency double-click",
  };

  const [res1, res2] = await Promise.all([
    fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: BASE_URL, Cookie: cookie, "x-test-user-id": user.id },
      body: JSON.stringify(bookingPayload),
    }),
    fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: BASE_URL, Cookie: cookie, "x-test-user-id": user.id },
      body: JSON.stringify(bookingPayload),
    }),
  ]);

  const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

  console.log("Request 1:", res1.status, data1);
  console.log("Request 2:", res2.status, data2);

  const statuses = [res1.status, res2.status].sort();
  const passed = statuses[0] === 201 && statuses[1] === 409;

  console.log("\n================================================================================");
  if (passed) {
    console.log("[PASS] Exactly one request succeeded with 201 Created and duplicate rejected with 409 Conflict");
  } else {
    console.log("[FAIL] Expected [201, 409] but got:", statuses);
    process.exit(1);
  }
  console.log("================================================================================");

  await prisma.$disconnect();
}

runTest().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
