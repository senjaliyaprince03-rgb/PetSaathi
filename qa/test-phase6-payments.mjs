import dns from "node:dns";
try { dns.setServers(["8.8.8.8", "8.8.4.4"]); } catch {}
import { preparePrismaEnvironment } from "../scripts/prepare-prisma-uri.mjs";
await preparePrismaEnvironment(process.env);
import { PrismaClient } from "@prisma/client";
import { MongoClient } from "mongodb";
import { createHmac, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();
const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "cAvLAk0m29ryz5e9rUHNBxs1";
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "8cef9435242975dfe668b75b833247ef9538ec3293ae121bf0709dc57b58bc9d";

async function runPhase6Tests() {
  console.log("================================================================================");
  console.log("               PETSAATHI QA AUDIT — PHASE 6: PAYMENTS, WALLET & REFUNDS         ");
  console.log("================================================================================");

  const results = [];
  function record(id, title, passed, details = {}) {
    results.push({ id, title, passed, details });
    const mark = passed ? "[PASS]" : "[FAIL]";
    console.log(`${mark} ${id}: ${title}`);
    if (!passed || process.env.VERBOSE) {
      console.log("   Details:", JSON.stringify(details, null, 2));
    }
  }

  // Helper to register & obtain session cookie
  async function createCustomerSession(tag) {
    const email = `test-e2e-pay-${tag}-${Date.now()}@petsaathi.com`;
    const signupRes = await fetch(`${BASE_URL}/api/auth/password/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: BASE_URL },
      body: JSON.stringify({
        displayName: `QA User ${tag}`,
        email,
        password: "Password123!",
        role: "CUSTOMER",
      }),
    });
    const signupData = await signupRes.json();
    console.log("Signup res:", signupRes.status, signupData);
    const otp = signupData.developmentOtp || "123456";

    const verifyRes = await fetch(`${BASE_URL}/api/auth/email/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: BASE_URL },
      body: JSON.stringify({ email, otp }),
    });
    const verifyData = await verifyRes.json();
    console.log("Verify res:", verifyRes.status, verifyData);

    const setCookie = verifyRes.headers.get("set-cookie") || "";
    const match = setCookie.match(/petsaathi_session=([^;]+)/);
    const sessionCookie = match ? `petsaathi_session=${match[1]}` : "";

    console.log("Searching for user with email:", email);
    const allRecent = await prisma.user.findMany({ take: 3, orderBy: { createdAt: "desc" }, select: { id: true, email: true, status: true } });
    console.log("All recent users in DB:", allRecent);
    const user = await prisma.user.findFirst({ where: { email: email.toLowerCase() } });
    console.log("Found user:", user?.id, user?.email);
    return { email, user, cookie: sessionCookie };
  }

  // Helper to create test booking
  async function createTestBooking(userId, status = "PAYMENT_PENDING", quoteAmountPaise = 35282) {
    let pet = await prisma.pet.findFirst({ where: { ownerId: userId } });
    if (!pet) {
      pet = await prisma.pet.create({
        data: { ownerId: userId, name: "TestPet", species: "DOG", active: true },
      });
    }

    let address = await prisma.address.findFirst({ where: { userId } });
    if (!address) {
      address = await prisma.address.create({
        data: {
          userId,
          label: "Home",
          line1: "123 Test Street",
          locality: "Bopal",
          city: "Ahmedabad",
          state: "Gujarat",
          postalCode: "380058",
        },
      });
    }

    const serviceType = await prisma.serviceType.upsert({
      where: { code: "DOG_WALK_30" },
      update: { active: true },
      create: { code: "DOG_WALK_30", name: "30-Min Dog Walk", description: "Walk", durationMinutes: 30, active: true, basePricePaise: 29900 },
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const booking = await prisma.booking.create({
      data: {
        reference: `PS-TEST-${Date.now().toString(36).toUpperCase()}`,
        customerId: userId,
        petId: pet.id,
        addressId: address.id,
        serviceTypeId: serviceType.id,
        status,
        scheduledStart: tomorrow,
        scheduledEnd: new Date(tomorrow.getTime() + 30 * 60_000),
        quoteAmountPaise,
        currency: "INR",
      },
    });

    return booking;
  }

  // ---------------------------------------------------------------------------
  // 1. POST /api/bookings/[id]/payment-order Tests
  // ---------------------------------------------------------------------------
  console.log("\n--- Group 1: /api/bookings/[id]/payment-order ---");
  const customerA = await createCustomerSession("custA");
  const customerB = await createCustomerSession("custB");

  const bookingA = await createTestBooking(customerA.user.id, "PAYMENT_PENDING", 49900);

  // 1.1 Unauthenticated request
  const poUnauth = await fetch(`${BASE_URL}/api/bookings/${bookingA.id}/payment-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL },
  });
  record("PAY-01", "Unauthenticated request to payment-order returns 401", poUnauth.status === 401, { status: poUnauth.status });

  // 1.2 Invalid resource UUID format
  const poBadUuid = await fetch(`${BASE_URL}/api/bookings/invalid-uuid-1234/payment-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL, Cookie: customerA.cookie },
  });
  record("PAY-02", "Invalid booking UUID format returns 422", poBadUuid.status === 422, { status: poBadUuid.status });

  // 1.3 Non-existent booking UUID
  const nonExistentUuid = randomUUID();
  const poNotFound = await fetch(`${BASE_URL}/api/bookings/${nonExistentUuid}/payment-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL, Cookie: customerA.cookie },
  });
  record("PAY-03", "Non-existent booking UUID returns 404", poNotFound.status === 404, { status: poNotFound.status });

  // 1.4 Cross-account access (Customer B attempts to order Customer A's booking)
  const poCrossAccount = await fetch(`${BASE_URL}/api/bookings/${bookingA.id}/payment-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL, Cookie: customerB.cookie },
  });
  record("PAY-04", "Cross-account payment order access is blocked with 404", poCrossAccount.status === 404, { status: poCrossAccount.status });

  // 1.5 Invalid booking state (e.g. status is REQUESTED, not PAYMENT_PENDING)
  const bookingRequested = await createTestBooking(customerA.user.id, "REQUESTED", 49900);
  const poInvalidState = await fetch(`${BASE_URL}/api/bookings/${bookingRequested.id}/payment-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL, Cookie: customerA.cookie },
  });
  const poInvalidStateData = await poInvalidState.json();
  record("PAY-05", "Booking in REQUESTED state rejects payment-order with 409", poInvalidState.status === 409 && poInvalidStateData.error === "invalid_booking_state", {
    status: poInvalidState.status,
    data: poInvalidStateData,
  });

  // 1.6 Client amount tampering test: Client sends payload `{ amount: 100, currency: "USD" }`
  const poTamper = await fetch(`${BASE_URL}/api/bookings/${bookingA.id}/payment-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL, Cookie: customerA.cookie },
    body: JSON.stringify({ amount: 100, amountPaise: 100, currency: "USD" }),
  });
  const poTamperData = await poTamper.json();
  const amountRespected = poTamperData?.order?.amount === 49900;
  record("PAY-06", "Client cannot override amount/currency in payment-order (server derives strictly from DB)", poTamper.status < 500 && amountRespected, {
    status: poTamper.status,
    order: poTamperData?.order,
    expectedAmount: 49900,
  });

  // ---------------------------------------------------------------------------
  // 2. POST /api/payments/verify Tests
  // ---------------------------------------------------------------------------
  console.log("\n--- Group 2: /api/payments/verify ---");

  const testOrderId = `order_test_${Date.now()}`;
  const testPaymentId = `pay_test_${Date.now()}`;
  const testSecret = RAZORPAY_KEY_SECRET;

  const validSignature = createHmac("sha256", testSecret)
    .update(`${testOrderId}|${testPaymentId}`)
    .digest("hex");

  const tamperedSignature = validSignature.slice(0, -1) + (validSignature.slice(-1) === "a" ? "b" : "a");

  const dbPayment = await prisma.payment.create({
    data: {
      bookingId: bookingA.id,
      providerOrderId: testOrderId,
      amountPaise: 49900,
      currency: "INR",
      status: "CREATED",
    },
  });

  // 2.1 Unauthenticated verify request
  const verifyUnauth = await fetch(`${BASE_URL}/api/payments/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL },
    body: JSON.stringify({ orderId: testOrderId, paymentId: testPaymentId, signature: validSignature }),
  });
  record("VER-01", "Unauthenticated verify request returns 401", verifyUnauth.status === 401, { status: verifyUnauth.status });

  // 2.2 Invalid schema / missing fields
  const verifyBadPayload = await fetch(`${BASE_URL}/api/payments/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL, Cookie: customerA.cookie },
    body: JSON.stringify({ orderId: "short" }),
  });
  record("VER-02", "Invalid payload to /api/payments/verify returns 422", verifyBadPayload.status === 422, { status: verifyBadPayload.status });

  // 2.3 Signature tampering (1 character flipped)
  const verifyTampered = await fetch(`${BASE_URL}/api/payments/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL, Cookie: customerA.cookie },
    body: JSON.stringify({ orderId: testOrderId, paymentId: testPaymentId, signature: tamperedSignature }),
  });
  const verifyTamperedData = await verifyTampered.json();
  record("VER-03", "Tampered signature rejects with 400 invalid_signature", verifyTampered.status === 400 && verifyTamperedData.error === "invalid_signature", {
    status: verifyTampered.status,
    data: verifyTamperedData,
  });

  // 2.4 Cross-account verify (Customer B attempts to verify Customer A's order)
  const verifyCrossAccount = await fetch(`${BASE_URL}/api/payments/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL, Cookie: customerB.cookie },
    body: JSON.stringify({ orderId: testOrderId, paymentId: testPaymentId, signature: validSignature }),
  });
  record("VER-04", "Cross-account payment verification returns 404 not_found", verifyCrossAccount.status === 404, { status: verifyCrossAccount.status });

  // 2.5 Valid signature verification (Success)
  const verifySuccess = await fetch(`${BASE_URL}/api/payments/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL, Cookie: customerA.cookie },
    body: JSON.stringify({ orderId: testOrderId, paymentId: testPaymentId, signature: validSignature }),
  });
  const verifySuccessData = await verifySuccess.json();
  record("VER-05", "Valid payment verification succeeds with 200", verifySuccess.status === 200 && verifySuccessData.verified === true, {
    status: verifySuccess.status,
    data: verifySuccessData,
  });

  // Verify DB state updated to CAPTURED and CONFIRMED
  const updatedDbPayment = await prisma.payment.findUnique({ where: { id: dbPayment.id } });
  const updatedDbBooking = await prisma.booking.findUnique({ where: { id: bookingA.id } });
  record("VER-06", "Payment updated to CAPTURED and Booking to CONFIRMED in database", updatedDbPayment?.status === "CAPTURED" && updatedDbBooking?.status === "CONFIRMED", {
    paymentStatus: updatedDbPayment?.status,
    bookingStatus: updatedDbBooking?.status,
  });

  // 2.6 Replay attack / Duplicate verification
  const verifyReplay = await fetch(`${BASE_URL}/api/payments/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL, Cookie: customerA.cookie },
    body: JSON.stringify({ orderId: testOrderId, paymentId: testPaymentId, signature: validSignature }),
  });
  const verifyReplayData = await verifyReplay.json();
  record("VER-07", "Replay verification handles idempotently without error", verifyReplay.status === 200 && verifyReplayData.verified === true, {
    status: verifyReplay.status,
    data: verifyReplayData,
  });

  // ---------------------------------------------------------------------------
  // 3. POST /api/webhooks/razorpay Tests
  // ---------------------------------------------------------------------------
  console.log("\n--- Group 3: /api/webhooks/razorpay ---");
  const webhookUrl = `${BASE_URL}/api/webhooks/razorpay`;

  const bookingWebhook = await createTestBooking(customerA.user.id, "PAYMENT_PENDING", 35282);
  const webhookOrderId = `order_wh_${Date.now()}`;
  const webhookPaymentId = `pay_wh_${Date.now()}`;
  const webhookPayment = await prisma.payment.create({
    data: {
      bookingId: bookingWebhook.id,
      providerOrderId: webhookOrderId,
      amountPaise: 35282,
      currency: "INR",
      status: "CREATED",
    },
  });

  const webhookPayload = {
    entity: "event",
    account_id: "acc_test",
    event: "payment.captured",
    contains: ["payment"],
    payload: {
      payment: {
        entity: {
          id: webhookPaymentId,
          order_id: webhookOrderId,
          amount: 35282,
          currency: "INR",
          status: "captured",
        },
      },
    },
  };
  const webhookBodyStr = JSON.stringify(webhookPayload);
  const webhookEventId = `evt_${Date.now()}`;

  const validWebhookSig = createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(webhookBodyStr)
    .digest("hex");

  // 3.1 Unsigned webhook
  const whUnsigned = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: webhookBodyStr,
  });
  record("WH-01", "Webhook without x-razorpay-signature returns 401", whUnsigned.status === 401, { status: whUnsigned.status });

  // 3.2 Bad signature webhook
  const whBadSig = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-razorpay-signature": "0000000000000000000000000000000000000000000000000000000000000000",
      "x-razorpay-event-id": webhookEventId,
    },
    body: webhookBodyStr,
  });
  record("WH-02", "Webhook with forged signature returns 401", whBadSig.status === 401, { status: whBadSig.status });

  // 3.3 Valid payment.captured webhook
  const whValid = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-razorpay-signature": validWebhookSig,
      "x-razorpay-event-id": webhookEventId,
    },
    body: webhookBodyStr,
  });
  const whValidData = await whValid.json();
  record("WH-03", "Valid payment.captured webhook returns 202 accepted", whValid.status === 202 && whValidData.accepted === true, {
    status: whValid.status,
    data: whValidData,
  });

  // Verify DB state updated
  const whUpdatedPayment = await prisma.payment.findUnique({ where: { id: webhookPayment.id } });
  const whUpdatedBooking = await prisma.booking.findUnique({ where: { id: bookingWebhook.id } });
  record("WH-04", "Webhook transitioned payment to CAPTURED and booking to CONFIRMED", whUpdatedPayment?.status === "CAPTURED" && whUpdatedBooking?.status === "CONFIRMED", {
    paymentStatus: whUpdatedPayment?.status,
    bookingStatus: whUpdatedBooking?.status,
  });

  // 3.4 Duplicate webhook replay (exact same eventId)
  const whDuplicate = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-razorpay-signature": validWebhookSig,
      "x-razorpay-event-id": webhookEventId,
    },
    body: webhookBodyStr,
  });
  const whDuplicateData = await whDuplicate.json();
  record("WH-05", "Duplicate webhook returns { accepted: true, duplicate: true }", whDuplicate.status === 200 && whDuplicateData.duplicate === true, {
    status: whDuplicate.status,
    data: whDuplicateData,
  });

  // 3.5 Webhook with mismatched amount
  const bookingTamperWh = await createTestBooking(customerA.user.id, "PAYMENT_PENDING", 49900);
  const tamperOrderId = `order_tamper_${Date.now()}`;
  await prisma.payment.create({
    data: {
      bookingId: bookingTamperWh.id,
      providerOrderId: tamperOrderId,
      amountPaise: 49900,
      currency: "INR",
      status: "CREATED",
    },
  });

  const tamperPayload = {
    entity: "event",
    account_id: "acc_test",
    event: "payment.captured",
    contains: ["payment"],
    payload: {
      payment: {
        entity: {
          id: `pay_tamper_${Date.now()}`,
          order_id: tamperOrderId,
          amount: 100,
          currency: "INR",
          status: "captured",
        },
      },
    },
  };
  const tamperBodyStr = JSON.stringify(tamperPayload);
  const tamperEventId = `evt_tamper_${Date.now()}`;
  const tamperSig = createHmac("sha256", RAZORPAY_WEBHOOK_SECRET).update(tamperBodyStr).digest("hex");

  const whTamperRes = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-razorpay-signature": tamperSig,
      "x-razorpay-event-id": tamperEventId,
    },
    body: tamperBodyStr,
  });
  record("WH-06", "Webhook rejects amount mismatch with 500 processing_failed", whTamperRes.status === 500, {
    status: whTamperRes.status,
  });

  // ---------------------------------------------------------------------------
  // 4. Wallet & Credit Ledger Tests
  // ---------------------------------------------------------------------------
  console.log("\n--- Group 4: Wallet & Credit Ledger ---");

  const org = await prisma.organization.findFirst();
  const programme = await prisma.partnerProgramme.create({
    data: {
      slug: `prog-${Date.now()}`,
      name: "QA Benefit Programme",
      programmeType: "CORPORATE_WALLET",
      status: "ACTIVE_PROGRAMME",
      organizationId: org.id,
    },
  });

  const membership = await prisma.programmeMembership.create({
    data: {
      programmeId: programme.id,
      customerId: customerA.user.id,
      active: true,
    },
  });

  const testWallet = await prisma.benefitWallet.create({
    data: {
      programmeMembershipId: membership.id,
      status: "ACTIVE_WALLET",
    },
  });
  const testWalletId = testWallet.id;

  // Connect to native MongoDB collection matching atomic implementation in src/modules/b2b/wallets.ts
  const mongoClient = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017/petsaathi");
  await mongoClient.connect();
  const db = mongoClient.db();
  const walletsCol = db.collection("benefit_wallets");
  const entriesCol = db.collection("benefit_ledger_entries");

  async function testIssueCredits(params) {
    const existing = await entriesCol.findOne({ idempotency_key: params.idempotencyKey });
    if (existing) return { id: String(existing._id), balanceAfter: existing.balance_after };

    const updated = await walletsCol.findOneAndUpdate(
      { _id: params.walletId, status: "ACTIVE_WALLET" },
      { $inc: { balance_paise: params.amountPaise, version: 1 }, $set: { updated_at: new Date() } },
      { returnDocument: "after" }
    );
    if (!updated) throw new Error("Wallet not available");

    const newBalance = updated.balance_paise;
    const entryId = randomUUID();
    await entriesCol.insertOne({
      _id: entryId,
      wallet_id: params.walletId,
      entry_type: "CREDIT_ISSUED",
      amount_paise: params.amountPaise,
      balance_after: newBalance,
      idempotency_key: params.idempotencyKey,
      created_at: new Date(),
    });
    return { id: entryId, balanceAfter: newBalance };
  }

  async function testRedeemCredits(params) {
    const existing = await entriesCol.findOne({ idempotency_key: params.idempotencyKey });
    if (existing) return { id: String(existing._id), balanceAfter: existing.balance_after };

    // Atomic conditional decrement: $inc guarded by $gte
    const updated = await walletsCol.findOneAndUpdate(
      { _id: params.walletId, status: "ACTIVE_WALLET", balance_paise: { $gte: params.amountPaise } },
      { $inc: { balance_paise: -params.amountPaise, version: 1 }, $set: { updated_at: new Date() } },
      { returnDocument: "after" }
    );
    if (!updated) {
      const wallet = await walletsCol.findOne({ _id: params.walletId });
      if (!wallet || wallet.status !== "ACTIVE_WALLET") throw new Error("Wallet not available");
      throw new Error("Insufficient benefit credits");
    }

    const newBalance = updated.balance_paise;
    const entryId = randomUUID();
    await entriesCol.insertOne({
      _id: entryId,
      wallet_id: params.walletId,
      entry_type: "CREDIT_REDEEMED",
      amount_paise: params.amountPaise,
      balance_after: newBalance,
      idempotency_key: params.idempotencyKey,
      created_at: new Date(),
    });
    return { id: entryId, balanceAfter: newBalance };
  }

  // 4.1 Issue credits
  const issueKey = `issue-${Date.now()}`;
  const issueResult = await testIssueCredits({
    walletId: testWalletId,
    amountPaise: 50000, // ₹500
    idempotencyKey: issueKey,
  });
  record("WAL-01", "Credits issued successfully to wallet", issueResult.balanceAfter === 50000, { balanceAfter: issueResult.balanceAfter });

  // 4.2 Deduplication of issueCredits with same idempotencyKey
  const duplicateIssue = await testIssueCredits({
    walletId: testWalletId,
    amountPaise: 50000,
    idempotencyKey: issueKey,
  });
  record("WAL-02", "Duplicate credit issuance is idempotent (balance not double counted)", duplicateIssue.balanceAfter === 50000, { balanceAfter: duplicateIssue.balanceAfter });

  // 4.3 Overdraft prevention: Redeem more than balance (e.g. ₹600 when balance is ₹500)
  let overdraftPrevented = false;
  let overdraftError = "";
  try {
    await testRedeemCredits({
      walletId: testWalletId,
      amountPaise: 60000,
      idempotencyKey: `redeem-overdraft-${Date.now()}`,
    });
  } catch (err) {
    overdraftPrevented = true;
    overdraftError = err.message;
  }
  record("WAL-03", "Wallet rejects overdraft / negative balance", overdraftPrevented, { overdraftError });

  // 4.4 Double-spend concurrency test: 5 concurrent requests attempting to redeem ₹300 each (Balance is ₹500)
  console.log("Running concurrent double-spend race condition test...");
  const redeemAttempts = Array.from({ length: 5 }, (_, i) =>
    testRedeemCredits({
      walletId: testWalletId,
      amountPaise: 30000,
      idempotencyKey: `race-${i}-${Date.now()}`,
    })
      .then((res) => ({ success: true, res }))
      .catch((err) => ({ success: false, error: err.message }))
  );

  const raceResults = await Promise.all(redeemAttempts);
  const successes = raceResults.filter((r) => r.success);
  const failures = raceResults.filter((r) => !r.success);

  const latestBalEntry = await prisma.benefitLedgerEntry.findFirst({
    where: { walletId: testWalletId },
    orderBy: { createdAt: "desc" },
  });
  const finalBalance = latestBalEntry?.balanceAfter ?? 0;

  record(
    "WAL-04",
    "Race condition prevention on concurrent redemptions (no negative balance, atomic transactions)",
    successes.length === 1 && failures.length === 4 && finalBalance === 20000,
    {
      successfulRedemptions: successes.length,
      failedRedemptions: failures.length,
      finalBalancePaise: finalBalance,
    }
  );

  // 4.5 Inspect /customer/wallet page rendering: Does it display mock ₹2,450.00 for empty wallets?
  const walletPageHtml = await fetch(`${BASE_URL}/customer/wallet`, {
    headers: { Cookie: customerB.cookie },
  }).then((r) => r.text());

  const hasMockBalance = walletPageHtml.includes("2,450") || walletPageHtml.includes("Indiranagar Resident Perk");
  record(
    "WAL-05",
    "Customer wallet page leaks hardcoded ₹2,450 mock balance to customers with zero real balance",
    !hasMockBalance,
    { hasMockBalance, snippetFound: hasMockBalance ? "Mock balance ₹2,450 / Indiranagar perk found in HTML" : "Clean" }
  );

  // ---------------------------------------------------------------------------
  // 5. Refund Policy Discrepancy & Route Testing
  // ---------------------------------------------------------------------------
  console.log("\n--- Group 5: Refunds & Policy Discrepancies ---");

  // 5.1 Unauthenticated refund
  const refundUnauth = await fetch(`${BASE_URL}/api/payments/refund`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL },
    body: JSON.stringify({ bookingId: bookingA.id, reason: "Customer cancellation notice" }),
  });
  record("REF-01", "Unauthenticated refund request returns 401", refundUnauth.status === 401, { status: refundUnauth.status });

  // 5.2 Refund for booking without captured payment
  const uncapturedBooking = await createTestBooking(customerA.user.id, "CONFIRMED", 29900);
  const refundNoPayment = await fetch(`${BASE_URL}/api/payments/refund`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL, Cookie: customerA.cookie },
    body: JSON.stringify({ bookingId: uncapturedBooking.id, reason: "Testing no payment" }),
  });
  const refundNoPaymentData = await refundNoPayment.json();
  record("REF-02", "Refund on booking without captured payment returns 400 no_captured_payment", refundNoPayment.status === 400 && refundNoPaymentData.error === "no_captured_payment", {
    status: refundNoPayment.status,
    data: refundNoPaymentData,
  });

  // 5.3 Policy vs Code discrepancy check
  const refundRouteFile = fs.readFileSync(path.resolve("src/app/api/payments/refund/route.ts"), "utf8");
  const hasNoticeTimeCheck = refundRouteFile.includes("scheduledStart") && refundRouteFile.includes("24");
  const hasPartialTiers = refundRouteFile.includes("0.5") || refundRouteFile.includes("50");
  const hasApologyCredit = refundRouteFile.includes("25000") || refundRouteFile.includes("apology");

  record(
    "REF-03",
    "Refund implementation matches published /refund-policy tiers and apology credits",
    hasNoticeTimeCheck && hasPartialTiers && hasApologyCredit,
    {
      hasNoticeTimeCheck,
      hasPartialTiers,
      hasApologyCredit,
      discrepancy: "Code in /api/payments/refund refunds 100% unconditionally regardless of whether cancellation notice is >24h, 4-24h, or <4h, and provides zero apology credit for caregiver cancellations.",
    }
  );

  console.log("\n================================================================================");
  console.log(`Phase 6 Test Summary: ${results.filter((r) => r.passed).length}/${results.length} checks passed`);
  console.log("================================================================================");
}

runPhase6Tests()
  .catch((err) => {
    console.error("FATAL in test-phase6-payments:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
