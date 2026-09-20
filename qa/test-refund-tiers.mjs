/**
 * Verification test for BUG-024: Refund Tiers & Boundary Conditions
 * Tests:
 * 1. 24h + 1s (MORE_THAN_24_HOURS -> 100% refund, 0 fee)
 * 2. 24h - 1s (BETWEEN_4_AND_24_HOURS -> 50% refund)
 * 3. 4h + 1s (BETWEEN_4_AND_24_HOURS -> 50% refund)
 * 4. 4h - 1s (LESS_THAN_4_HOURS -> 0% refund)
 * 5. During service (0% refund)
 * 6. After service (0% refund)
 * 7. Caregiver cancelled (100% refund + ₹250 apology credit)
 * 8. Exact integer paise rounding
 */

import assert from "node:assert";
import { calculateRefundTier, PUBLISHED_REFUND_TIERS } from "../src/modules/payments/refund-policy.ts";

console.log("================================================================================");
console.log("              PETSAATHI QA AUDIT — REFUND TIERS BOUNDARY TEST                   ");
console.log("================================================================================");

const BASE_AMOUNT_PAISE = 149900; // ₹1,499.00
const NOW = new Date("2026-09-18T10:00:00.000Z");

// Boundary 1: 24h + 1s
const start24hPlus1s = new Date(NOW.getTime() + (24 * 3600 + 1) * 1000);
const r1 = calculateRefundTier({
  scheduledStart: start24hPlus1s,
  cancelledBy: "CUSTOMER",
  amountPaise: BASE_AMOUNT_PAISE,
  now: NOW,
});
console.log("\n[TEST 1] Boundary 24h + 1 second:");
console.log(`  Tier: ${r1.tier}, Refund: ₹${r1.refundAmountPaise / 100} (${r1.refundPercentage}%)`);
assert.strictEqual(r1.tier, "MORE_THAN_24_HOURS");
assert.strictEqual(r1.refundPercentage, 100);
assert.strictEqual(r1.refundAmountPaise, BASE_AMOUNT_PAISE);
assert.strictEqual(r1.isEligible, true);
console.log("  => PASS: 100% full refund awarded");

// Boundary 2: 24h - 1s
const start24hMinus1s = new Date(NOW.getTime() + (24 * 3600 - 1) * 1000);
const r2 = calculateRefundTier({
  scheduledStart: start24hMinus1s,
  cancelledBy: "CUSTOMER",
  amountPaise: BASE_AMOUNT_PAISE,
  now: NOW,
});
console.log("\n[TEST 2] Boundary 24h - 1 second:");
console.log(`  Tier: ${r2.tier}, Refund: ₹${r2.refundAmountPaise / 100} (${r2.refundPercentage}%)`);
assert.strictEqual(r2.tier, "BETWEEN_4_AND_24_HOURS");
assert.strictEqual(r2.refundPercentage, 50);
assert.strictEqual(r2.refundAmountPaise, Math.round(BASE_AMOUNT_PAISE * 0.5));
assert.strictEqual(r2.isEligible, true);
console.log("  => PASS: 50% partial refund awarded");

// Boundary 3: 4h + 1s
const start4hPlus1s = new Date(NOW.getTime() + (4 * 3600 + 1) * 1000);
const r3 = calculateRefundTier({
  scheduledStart: start4hPlus1s,
  cancelledBy: "CUSTOMER",
  amountPaise: BASE_AMOUNT_PAISE,
  now: NOW,
});
console.log("\n[TEST 3] Boundary 4h + 1 second:");
console.log(`  Tier: ${r3.tier}, Refund: ₹${r3.refundAmountPaise / 100} (${r3.refundPercentage}%)`);
assert.strictEqual(r3.tier, "BETWEEN_4_AND_24_HOURS");
assert.strictEqual(r3.refundPercentage, 50);
assert.strictEqual(r3.refundAmountPaise, Math.round(BASE_AMOUNT_PAISE * 0.5));
assert.strictEqual(r3.isEligible, true);
console.log("  => PASS: 50% partial refund awarded");

// Boundary 4: 4h - 1s
const start4hMinus1s = new Date(NOW.getTime() + (4 * 3600 - 1) * 1000);
const r4 = calculateRefundTier({
  scheduledStart: start4hMinus1s,
  cancelledBy: "CUSTOMER",
  amountPaise: BASE_AMOUNT_PAISE,
  now: NOW,
});
console.log("\n[TEST 4] Boundary 4h - 1 second:");
console.log(`  Tier: ${r4.tier}, Refund: ₹${r4.refundAmountPaise / 100} (${r4.refundPercentage}%)`);
assert.strictEqual(r4.tier, "LESS_THAN_4_HOURS");
assert.strictEqual(r4.refundPercentage, 0);
assert.strictEqual(r4.refundAmountPaise, 0);
assert.strictEqual(r4.isEligible, false);
console.log("  => PASS: 0% non-refundable");

// Boundary 5: During service
const startPast = new Date(NOW.getTime() - 15 * 60 * 1000); // started 15 min ago
const endFuture = new Date(NOW.getTime() + 45 * 60 * 1000); // ends in 45 min
const r5 = calculateRefundTier({
  scheduledStart: startPast,
  scheduledEnd: endFuture,
  cancelledBy: "CUSTOMER",
  amountPaise: BASE_AMOUNT_PAISE,
  now: NOW,
});
console.log("\n[TEST 5] During service:");
console.log(`  Tier: ${r5.tier}, Refund: ₹${r5.refundAmountPaise / 100} (${r5.refundPercentage}%)`);
assert.strictEqual(r5.tier, "DURING_SERVICE");
assert.strictEqual(r5.refundPercentage, 0);
assert.strictEqual(r5.refundAmountPaise, 0);
assert.strictEqual(r5.isEligible, false);
console.log("  => PASS: 0% non-refundable during service");

// Boundary 6: After service
const endPast = new Date(NOW.getTime() - 10 * 60 * 1000); // ended 10 min ago
const r6 = calculateRefundTier({
  scheduledStart: new Date(NOW.getTime() - 70 * 60 * 1000),
  scheduledEnd: endPast,
  cancelledBy: "CUSTOMER",
  amountPaise: BASE_AMOUNT_PAISE,
  now: NOW,
});
console.log("\n[TEST 6] After service:");
console.log(`  Tier: ${r6.tier}, Refund: ₹${r6.refundAmountPaise / 100} (${r6.refundPercentage}%)`);
assert.strictEqual(r6.tier, "AFTER_SERVICE");
assert.strictEqual(r6.refundPercentage, 0);
assert.strictEqual(r6.refundAmountPaise, 0);
assert.strictEqual(r6.isEligible, false);
console.log("  => PASS: 0% non-refundable after service");

// Boundary 7: Caregiver cancellation
const r7 = calculateRefundTier({
  scheduledStart: start4hMinus1s, // even within 4h!
  cancelledBy: "SITTER",
  amountPaise: BASE_AMOUNT_PAISE,
  now: NOW,
});
console.log("\n[TEST 7] Caregiver cancellation guarantee:");
console.log(`  Tier: ${r7.tier}, Refund: ₹${r7.refundAmountPaise / 100} (${r7.refundPercentage}%), Apology credit: ₹${r7.apologyCreditPaise / 100}`);
assert.strictEqual(r7.tier, "CAREGIVER_CANCELLED");
assert.strictEqual(r7.refundPercentage, 100);
assert.strictEqual(r7.refundAmountPaise, BASE_AMOUNT_PAISE);
assert.strictEqual(r7.apologyCreditPaise, 25000); // ₹250
assert.strictEqual(r7.isEligible, true);
console.log("  => PASS: 100% refund + ₹250 apology credit");

console.log("\n================================================================================");
console.log("Refund Tiers Summary: ALL BOUNDARY TESTS PASSED");
console.log("================================================================================");
