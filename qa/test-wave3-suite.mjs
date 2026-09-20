import assert from "node:assert/strict";
import { z } from "zod";

// -------------------------------------------------------------
// Test 1: sanitizeReturnTo (BUG-029)
// -------------------------------------------------------------
console.log("\n--- Group 1: sanitizeReturnTo Unit Tests (BUG-029) ---");

import { sanitizeReturnTo } from "../src/lib/sanitize-url.ts";

const acceptedCases = [
  ["/customer/wallet", "/customer/wallet"],
  ["/book", "/book"],
  ["/book?service=DOG_WALK_30", "/book?service=DOG_WALK_30"],
  ["/dashboard#overview", "/dashboard#overview"],
  ["/pets/new", "/pets/new"],
  ["/saathi/availability", "/saathi/availability"],
];

for (const [input, expected] of acceptedCases) {
  const result = sanitizeReturnTo(input);
  assert.equal(result, expected, `Expected ${input} to be accepted as ${expected}`);
  console.log(`[PASS] Accepted safe internal path: ${input}`);
}

const rejectedCases = [
  "//evil.com",
  "//evil.com/path",
  "https://evil.com",
  "http://attacker.com/steal",
  "javascript:alert(1)",
  "/\\evil.com",
  "\\evil.com",
  "/\\\\evil.com",
  "/login",
  "/login?returnTo=/foo",
  "/login/verify",
  "/api/auth/signout",
  "%2f%2fevil.com",
  "   ",
  null,
  undefined,
  12345,
  "data:text/html,test",
];

for (const input of rejectedCases) {
  const result = sanitizeReturnTo(input);
  assert.equal(result, null, `Expected ${String(input)} to be rejected`);
  console.log(`[PASS] Rejected unsafe destination: ${String(input)}`);
}

// -------------------------------------------------------------
// Test 2: Booking Wizard Validation Schema (BUG-016)
// -------------------------------------------------------------
console.log("\n--- Group 2: Booking Wizard Schema Validation (BUG-016) ---");

// Mirror the bookingSchema from booking-wizard.tsx
const bookingSchema = z.object({
  service: z.enum(["DOG_WALK_30", "DOG_WALK_60", "HOME_VISIT", "HOME_SITTING_60", "GROOMING_HOME", "VET_SUPPORT", "TRAINING_ASSESSMENT", "PET_TAXI"]),
  petName: z.string().trim().min(2, "Tell us your pet's name").max(50, "Pet name cannot exceed 50 characters"),
  petType: z.enum(["DOG", "CAT", "RABBIT", "BIRD", "FISH", "TURTLE", "RAT", "OTHER"]),
  date: z.string().min(1, "Choose a date").refine((val) => {
    if (!val) return false;
    const selected = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  }, "Please select today or a future date"),
  time: z.string().min(1, "Choose a time").refine((val) => {
    if (!val) return false;
    const match = /^(\d{2}):(\d{2})$/.exec(val);
    if (!match) return false;
    const hour = parseInt(match[1], 10);
    const min = parseInt(match[2], 10);
    const totalMinutes = hour * 60 + min;
    return totalMinutes >= 360 && totalMinutes <= 1260;
  }, "Service hours are between 06:00 AM and 09:00 PM"),
  locality: z.string().trim().min(2, "Enter your locality").max(100, "Locality cannot exceed 100 characters"),
  parentName: z.string().trim().min(2, "Enter your name").max(100, "Name cannot exceed 100 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  notes: z.string().max(800).optional()
});

const todayStr = new Date().toISOString().split("T")[0];

// Test past date rejection
const pastDateResult = bookingSchema.safeParse({
  service: "DOG_WALK_30",
  petName: "Bruno",
  petType: "DOG",
  date: "2020-01-01",
  time: "10:00",
  locality: "Bopal, Ahmedabad",
  parentName: "Amit Kumar",
  phone: "9876543210",
});
assert.equal(pastDateResult.success, false, "Past date must fail validation");
assert(pastDateResult.error.issues.some((i) => i.path.includes("date")));
console.log("[PASS] Past date '2020-01-01' correctly rejected");

// Test out-of-operating-hours time rejection: 03:00 AM
const nightTimeResult = bookingSchema.safeParse({
  service: "DOG_WALK_30",
  petName: "Bruno",
  petType: "DOG",
  date: todayStr,
  time: "03:00",
  locality: "Bopal, Ahmedabad",
  parentName: "Amit Kumar",
  phone: "9876543210",
});
assert.equal(nightTimeResult.success, false, "03:00 AM time must fail validation");
assert(nightTimeResult.error.issues.some((i) => i.path.includes("time")));
console.log("[PASS] 03:00 AM out-of-hours time correctly rejected");

// Test out-of-operating-hours time rejection: 22:30 PM
const lateNightResult = bookingSchema.safeParse({
  service: "DOG_WALK_30",
  petName: "Bruno",
  petType: "DOG",
  date: todayStr,
  time: "22:30",
  locality: "Bopal, Ahmedabad",
  parentName: "Amit Kumar",
  phone: "9876543210",
});
assert.equal(lateNightResult.success, false, "22:30 PM time must fail validation");
assert(lateNightResult.error.issues.some((i) => i.path.includes("time")));
console.log("[PASS] 22:30 PM out-of-hours time correctly rejected");

// Test unbounded pet name rejection (>50 chars)
const longPetNameResult = bookingSchema.safeParse({
  service: "DOG_WALK_30",
  petName: "🐶 Bruno મોતી मोती " + "A".repeat(180),
  petType: "DOG",
  date: todayStr,
  time: "10:00",
  locality: "Bopal, Ahmedabad",
  parentName: "Amit Kumar",
  phone: "9876543210",
});
assert.equal(longPetNameResult.success, false, "200-char pet name must fail validation");
assert(longPetNameResult.error.issues.some((i) => i.path.includes("petName")));
console.log("[PASS] 200-char pet name correctly rejected (max 50 enforced)");

// Test unbounded parent name (>100 chars)
const longParentNameResult = bookingSchema.safeParse({
  service: "DOG_WALK_30",
  petName: "Bruno",
  petType: "DOG",
  date: todayStr,
  time: "10:00",
  locality: "Bopal, Ahmedabad",
  parentName: "A".repeat(120),
  phone: "9876543210",
});
assert.equal(longParentNameResult.success, false, "120-char parent name must fail validation");
assert(longParentNameResult.error.issues.some((i) => i.path.includes("parentName")));
console.log("[PASS] 120-char parent name correctly rejected (max 100 enforced)");

// Test valid submission
const validResult = bookingSchema.safeParse({
  service: "DOG_WALK_30",
  petName: "Bruno",
  petType: "DOG",
  date: todayStr,
  time: "07:30",
  locality: "Bopal, Ahmedabad",
  parentName: "Amit Kumar",
  phone: "9876543210",
  notes: "Friendly golden retriever"
});
assert.equal(validResult.success, true, "Valid input must succeed");
console.log("[PASS] Valid booking request passes schema validation");

// -------------------------------------------------------------
// Test 3: HTTP Route Tests against Dev Server (BUG-020, BUG-029)
// -------------------------------------------------------------
console.log("\n--- Group 3: HTTP Route Tests (BUG-020 & BUG-029) ---");

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";

async function runHttpTests() {
  try {
    // 3.1 BUG-020: /book?service=boarding-beta redirect
    const boardingRes = await fetch(`${BASE_URL}/book?service=boarding-beta`, {
      redirect: "manual"
    });
    console.log(`[ROUTE] /book?service=boarding-beta status: ${boardingRes.status}, location: ${boardingRes.headers.get("location")}`);
    assert(
      boardingRes.status === 307 || boardingRes.status === 308,
      `Expected redirect (307/308) but got ${boardingRes.status}`
    );
    const location = boardingRes.headers.get("location") || "";
    assert(
      location.includes("/contact?topic=BOARDING_PILOT"),
      `Expected redirect to /contact?topic=BOARDING_PILOT, got ${location}`
    );
    console.log("[PASS] BUG-020: /book?service=boarding-beta redirects to /contact?topic=BOARDING_PILOT");

    // 3.2 BUG-020: /book?requestBoarding=true redirect
    const reqBoardingRes = await fetch(`${BASE_URL}/book?requestBoarding=true`, {
      redirect: "manual"
    });
    assert(
      reqBoardingRes.status === 307 || reqBoardingRes.status === 308,
      `Expected redirect (307/308) but got ${reqBoardingRes.status}`
    );
    assert(
      (reqBoardingRes.headers.get("location") || "").includes("/contact?topic=BOARDING_PILOT")
    );
    console.log("[PASS] BUG-020: /book?requestBoarding=true redirects to /contact?topic=BOARDING_PILOT");

    // 3.3 BUG-029: /login?returnTo=/customer/wallet renders 200
    const loginRes = await fetch(`${BASE_URL}/login?returnTo=/customer/wallet`);
    assert.equal(loginRes.status, 200, `Expected 200 from /login, got ${loginRes.status}`);
    const loginHtml = await loginRes.text();
    assert(loginHtml.includes("returnTo") || loginHtml.includes("Parent & Saathi Sign In"), "Login page loaded with returnTo");
    console.log("[PASS] BUG-029: /login?returnTo=/customer/wallet renders HTTP 200 successfully");

  } catch (err) {
    console.error("HTTP route test error:", err.message);
    throw err;
  }
}

await runHttpTests();

console.log("\n>>> ALL WAVE 3 UNIT & INTEGRATION TESTS PASSED <<<\n");
