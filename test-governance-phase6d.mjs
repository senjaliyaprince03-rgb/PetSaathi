import 'dotenv/config';

import { rateLimiter, concurrencyController, abuseStore, budgetStore } from './ai/governance/index.mjs';
import { validateOutput } from './ai/governance/quality.mjs';
import { CONFIG as RATE_LIMIT_CONFIG } from './ai/governance/rate-limit.mjs';
import { CONCURRENCY_CONFIG } from './ai/governance/concurrency.mjs';
import { initializeGovernance } from './ai/governance/index.mjs';

let passed = 0;
let total = 0;

function assert(condition, testName) {
  total++;
  if (condition) {
    console.log(`✅ [${testName}]`);
    passed++;
  } else {
    console.error(`❌ [${testName}] FAILED`);
  }
}

async function runGovernanceTests() {
  console.log("Starting Phase 6D Governance Tests...\n");
  
  await initializeGovernance(); // Initializes Redis if GOVERNANCE_STORE=redis, throws if unreachable

  // 1. Rate Limiting
  console.log("--- 1. Rate Limiting ---");
  const testUserId = `user-${Date.now()}`;
  
  // Burn through all 30 tokens
  let lastCheck;
  for (let i = 0; i < 30; i++) {
    lastCheck = await rateLimiter.checkRateLimit(testUserId);
  }
  assert(lastCheck.allowed === true, "30th request allowed");
  
  // 31st request should be blocked
  const blockedCheck = await rateLimiter.checkRateLimit(testUserId);
  assert(blockedCheck.allowed === false, "31st request blocked");
  assert(blockedCheck.retryAfterMs > 0, "Returns retryAfterMs");

  // 2. Concurrency Limits
  console.log("\n--- 2. Concurrency Limits ---");
  const concUser = `user-${Date.now()}`;
  
  const acq1 = await concurrencyController.tryAcquire(concUser);
  const acq2 = await concurrencyController.tryAcquire(concUser);
  const acq3 = await concurrencyController.tryAcquire(concUser);
  assert(acq1.acquired && acq2.acquired && acq3.acquired, "Acquires 3 slots successfully");

  const acq4 = await concurrencyController.tryAcquire(concUser);
  assert(acq4.acquired === false, "4th slot blocked (per-user limit)");
  assert(acq4.reason === "USER_CONCURRENCY_LIMIT", "Correct rejection reason");

  await concurrencyController.release(concUser);
  const acq5 = await concurrencyController.tryAcquire(concUser);
  assert(acq5.acquired === true, "Can acquire slot after releasing");

  // Cleanup for other tests
  await concurrencyController.release(concUser);
  await concurrencyController.release(concUser);
  await concurrencyController.release(concUser);

  // 3. Abuse Protection
  console.log("\n--- 3. Abuse Protection ---");
  const abuseUser = `user-${Date.now()}`;
  
  // Rapid repeats
  const prompt = "What is the best dog food?";
  await abuseStore.checkAbuse(abuseUser, prompt);
  await abuseStore.checkAbuse(abuseUser, prompt); // 2nd
  await abuseStore.checkAbuse(abuseUser, "   What is the best dog food?   "); // 3rd, normalized

  const abuseCheck = await abuseStore.checkAbuse(abuseUser, prompt.toUpperCase()); // 4th, blocks
  assert(abuseCheck.blocked === true, "Rapid identical prompts blocked");
  assert(abuseCheck.reason === "RAPID_REPEAT_PROMPT", "Reason is RAPID_REPEAT_PROMPT");

  // Record security violation to trigger cooldown
  const banUser = `user-ban-${Date.now()}`;
  await abuseStore.recordViolation(banUser, 'SECURITY_BLOCK');
  const triggered = await abuseStore.recordViolation(banUser, 'SECURITY_BLOCK'); // 50+50 = 100 -> ban
  assert(triggered === true, "Security violations trigger cooldown");
  
  const postBanCheck = await abuseStore.checkAbuse(banUser, "Hello");
  assert(postBanCheck.blocked === true, "User is blocked during cooldown");
  assert(postBanCheck.reason === "ABUSE_COOLDOWN", "Reason is ABUSE_COOLDOWN");

  // 4. Budget Tracking
  console.log("\n--- 4. Budget Tracking ---");
  const budgetUser = `user-${Date.now()}`;
  
  const b1 = await budgetStore.checkBudget(budgetUser, 5000);
  assert(b1.allowed === true, "Request within limits allowed");
  
  const b2 = await budgetStore.checkBudget(budgetUser, 10000);
  assert(b2.allowed === false, "Single request exceeding 8000 tokens blocked");

  await budgetStore.recordUsage(budgetUser, 40000);
  const b3 = await budgetStore.checkBudget(budgetUser, 5000); // 40000 + 5000 = 45000, allowed (limit 49500)
  assert(b3.allowed === true, "Under hourly limit");

  await budgetStore.recordUsage(budgetUser, 5000); // 45000 total
  const b4 = await budgetStore.checkBudget(budgetUser, 5000); // 45000 + 5000 = 50000, blocked (> 49500)
  assert(b4.allowed === false, "Hourly limit exceeded");

  // 5. Quality Gates
  console.log("\n--- 5. Quality Gates ---");
  
  const q1 = validateOutput("abc");
  assert(q1.passed === false && q1.reason === "TRUNCATED_RESPONSE", "Truncated response blocked");

  const q2 = validateOutput("I apologize, but I cannot answer that query.");
  assert(q2.passed === true && q2.flags.includes("SAFETY_REFUSAL"), "Refusal flagged but not blocked by quality gate");

  const q3 = validateOutput("I'm not sure, but here is a guess.");
  assert(q3.passed === true && q3.flags.includes("WEAK_CONFIDENCE"), "Weak confidence flagged");

  const q4 = validateOutput("I looked up the database and found 3 dogs.", { toolCallsMade: 0 });
  assert(q4.passed === true && q4.flags.includes("POSSIBLE_HALLUCINATION_TOOLS"), "Tool hallucination flagged");

  console.log(`\n=== Results: ${passed}/${total} Tests Passed ===\n`);
  
  if (passed < total) {
    process.exit(1);
  }
}

runGovernanceTests().catch(err => {
  console.error("Governance test suite failed:", err);
  process.exit(1);
});
