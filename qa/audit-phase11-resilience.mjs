import dns from "node:dns";
try { dns.setServers(["8.8.8.8", "8.8.4.4"]); } catch {}
import { preparePrismaEnvironment } from "../scripts/prepare-prisma-uri.mjs";
await preparePrismaEnvironment(process.env);
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";

async function auditPhase11() {
  console.log("================================================================================");
  console.log("       PETSAATHI QA AUDIT — PHASE 11: RESILIENCE & EDGE CASES                   ");
  console.log("================================================================================");

  const results = [];
  function record(id, title, passed, details = {}) {
    results.push({ id, title, passed, details });
    const mark = passed ? "[PASS]" : "[FAIL]";
    console.log(`${mark} ${id}: ${title}`);
    console.log("   Details:", JSON.stringify(details, null, 2));
  }

  // ---------------------------------------------------------------------------
  // 1. PWA Manifest & Offline Page (/offline)
  // ---------------------------------------------------------------------------
  console.log("\n--- 1. PWA & Offline Experience ---");

  // Check /manifest.json or /manifest.webmanifest
  const manifestRes = await fetch(`${BASE_URL}/manifest.json`);
  let manifestData = null;
  try {
    manifestData = await manifestRes.json();
  } catch {}
  record("RES-01", "PWA manifest.json is served with 200 OK and valid metadata", manifestRes.status === 200 && !!manifestData?.name, {
    status: manifestRes.status,
    name: manifestData?.name,
    themeColor: manifestData?.theme_color,
  });

  // Check /offline route
  const offlineRes = await fetch(`${BASE_URL}/offline`);
  const offlineHtml = await offlineRes.text();
  const hasOfflinePage = offlineRes.status === 200 && offlineHtml.includes("offline");
  record("RES-02", "Dedicated /offline fallback page exists for network disconnects", hasOfflinePage, {
    status: offlineRes.status,
    containsOfflineCopy: offlineHtml.includes("offline"),
  });

  // Check service worker file (public/sw.js or public/service-worker.js)
  const hasServiceWorker = fs.existsSync("public/sw.js") || fs.existsSync("public/service-worker.js") || fs.existsSync("src/sw.ts");
  record("RES-03", "Service Worker file is registered for offline asset caching", hasServiceWorker, {
    hasServiceWorker,
    location: fs.existsSync("public/sw.js") ? "public/sw.js" : "None",
  });

  // ---------------------------------------------------------------------------
  // 2. Double-Click / Concurrent Booking Creation Race Condition
  // ---------------------------------------------------------------------------
  console.log("\n--- 2. Concurrent Double Booking Creation Race Condition ---");

  // Create test customer
  const email = `test-e2e-resilience-${Date.now()}@petsaathi.com`;
  const signupRes = await fetch(`${BASE_URL}/api/auth/password/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL },
    body: JSON.stringify({
      displayName: "QA Resilience Customer",
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

  const user = await prisma.user.findFirst({ where: { email } });
  const pet = await prisma.pet.create({
    data: { ownerId: user.id, name: "Bruno", species: "DOG", active: true },
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
  const city = await prisma.city.findFirst({ where: { slug: "ahmedabad" } });
  const serviceArea = await prisma.serviceArea.findFirst({
    where: { status: "ACTIVE", postalCodes: { has: "380058" } },
  });
  const serviceType = await prisma.serviceType.findFirst({ where: { code: "DOG_WALK_30" } });
  const servicePrice = await prisma.servicePrice.findFirst({
    where: { serviceTypeId: serviceType.id, serviceAreaId: serviceArea.id },
  });

  // Ensure capacity limit exists
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const scheduledStart = new Date(tomorrow);
  scheduledStart.setHours(10, 0, 0, 0);

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

  // Submit 2 concurrent booking requests for the exact same pet, slot, and address
  console.log("Submitting 2 concurrent duplicate booking requests...");
  const bookingPayload = {
    petId: pet.id,
    addressId: address.id,
    serviceCode: "DOG_WALK_30",
    servicePriceId: servicePrice.id,
    scheduledStart: scheduledStart.toISOString(),
    customerNotes: "Testing concurrency",
  };

  const [res1, res2] = await Promise.all([
    fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: BASE_URL, Cookie: cookie },
      body: JSON.stringify(bookingPayload),
    }),
    fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: BASE_URL, Cookie: cookie },
      body: JSON.stringify(bookingPayload),
    }),
  ]);

  const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
  console.log("Concurrent booking 1 status:", res1.status, data1?.booking?.id || data1?.error);
  console.log("Concurrent booking 2 status:", res2.status, data2?.booking?.id || data2?.error);

  const bothSucceeded = res1.status === 201 && res2.status === 201;
  record(
    "RES-04",
    "Duplicate booking prevention on simultaneous double-click submissions",
    !bothSucceeded, // If both succeeded, it's a bug!
    {
      booking1Status: res1.status,
      booking1Id: data1?.booking?.id,
      booking2Status: res2.status,
      booking2Id: data2?.booking?.id,
      duplicateCreated: bothSucceeded,
    }
  );

  // ---------------------------------------------------------------------------
  // 3. Unicode, Emoji, and Script Handling
  // ---------------------------------------------------------------------------
  console.log("\n--- 3. Unicode & Multi-lingual Script Handling ---");
  const unicodePetName = "🐶 મોતી मोती Bruno 🐕‍🦺 123";
  const unicodeAddress = "૧૦૧ શિવાલય એપાર્ટમેન્ટ, बोपल, Ahmedabad - 380058";

  const unicodePet = await prisma.pet.create({
    data: { ownerId: user.id, name: unicodePetName, species: "DOG", active: true },
  });
  const unicodeAddr = await prisma.address.create({
    data: {
      userId: user.id,
      label: "ઘર / Home",
      line1: unicodeAddress,
      locality: "Bopal",
      city: "Ahmedabad",
      state: "Gujarat",
      postalCode: "380058",
    },
  });

  const savedPet = await prisma.pet.findUnique({ where: { id: unicodePet.id } });
  const savedAddr = await prisma.address.findUnique({ where: { id: unicodeAddr.id } });

  record(
    "RES-05",
    "Unicode, Gujarati, Hindi, and multi-byte emojis persist losslessly in database",
    savedPet?.name === unicodePetName && savedAddr?.line1 === unicodeAddress,
    {
      petNameSaved: savedPet?.name,
      addressSaved: savedAddr?.line1,
    }
  );

  console.log("\n================================================================================");
  console.log(`Phase 11 Summary: ${results.filter((r) => r.passed).length}/${results.length} checks passed`);
  console.log("================================================================================");
}

auditPhase11()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
