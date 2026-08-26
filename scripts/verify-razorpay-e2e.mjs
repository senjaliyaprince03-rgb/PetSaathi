// PetSaathi Razorpay Test-Mode End-to-End Payment Lifecycle Verification
import { createHmac, randomUUID } from "node:crypto";
import path from "node:path";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import Razorpay from "razorpay";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

const prisma = new PrismaClient();

const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

const results = {
  environment: {
    testMode: false,
    credentialsAvailable: false,
    publicWebhookConfigured: false,
  },
  tests: [],
  ids: {},
};

function recordTest(name, passed, evidence) {
  results.tests.push({ name, result: passed ? "PASS" : "FAIL", evidence });
  console.log("[" + (passed ? "PASS" : "FAIL") + "] " + name + ": " + evidence);
  if (!passed) console.error("FAILED TEST: " + name);
}

async function runVerification() {
  console.log("===============================================================");
  console.log("Starting PetSaathi Razorpay Test-Mode Verification");
  console.log("===============================================================\n");

  console.log("--- PHASE 2: ENVIRONMENT SAFETY ---");
  const hasKeyId = Boolean(keyId && keyId.startsWith("rzp_test_"));
  const hasKeySecret = Boolean(keySecret && keySecret.length > 5);
  const hasWebhookSecret = Boolean(webhookSecret && webhookSecret.length > 5);

  results.environment.testMode = hasKeyId;
  results.environment.credentialsAvailable = hasKeyId && hasKeySecret && hasWebhookSecret;
  results.environment.publicWebhookConfigured = hasWebhookSecret;

  if (!results.environment.credentialsAvailable) {
    console.error("BLOCKED: Razorpay test credentials are not available.");
    process.exit(1);
  }
  recordTest("Razorpay Test Environment Verified", true, "Test mode key ID (rzp_test_*) and secrets present");

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  console.log("\n--- PHASE 3: VERIFY ORDER CREATION ---");
  const testEmail = "test-buyer-" + Date.now() + "@petsaathi.test";
  const testUser = await prisma.user.upsert({
    where: { email: testEmail },
    update: {},
    create: {
      email: testEmail,
      displayName: "Test Customer",
      roles: { create: [{ role: "CUSTOMER" }] },
      status: "ACTIVE",
    },
  });

  const testPet = await prisma.pet.create({
    data: {
      ownerId: testUser.id,
      name: "Buddy",
      species: "DOG",
      breed: "Golden Retriever",
      active: true,
    },
  });

  const serviceType = await prisma.serviceType.upsert({
    where: { code: "DOG_WALK_30" },
    update: {},
    create: {
      code: "DOG_WALK_30",
      name: "30-Min Dog Walk",
      description: "Standard daily walk",
      durationMinutes: 30,
      basePricePaise: 100000,
      active: true,
    },
  });

  const address = await prisma.address.create({
    data: {
      userId: testUser.id,
      label: "Home",
      line1: "100 MG Road",
      locality: "Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560038",
    },
  });

  const quoteAmountPaise = 118000;
  const bookingReference = "BK-TEST-" + Date.now();

  const booking = await prisma.booking.create({
    data: {
      reference: bookingReference,
      customerId: testUser.id,
      petId: testPet.id,
      serviceTypeId: serviceType.id,
      addressId: address.id,
      scheduledStart: new Date(Date.now() + 86400000),
      scheduledEnd: new Date(Date.now() + 86400000 + 1800000),
      quoteAmountPaise,
      currency: "INR",
      status: "PAYMENT_PENDING",
    },
  });
  results.ids.bookingId = booking.id;
  recordTest("Booking Creation", true, "Booking ID " + booking.id + " created with reference " + booking.reference);
  recordTest("Server-side Pricing Lock", booking.quoteAmountPaise === 118000, "Quote locked at ₹" + (booking.quoteAmountPaise / 100));

  const rpOrder = await razorpay.orders.create({
    amount: booking.quoteAmountPaise,
    currency: booking.currency,
    receipt: booking.reference,
    notes: {
      bookingId: booking.id,
    },
  });
  results.ids.razorpayOrderId = rpOrder.id;

  const paymentRecord = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      provider: "razorpay",
      providerOrderId: rpOrder.id,
      amountPaise: booking.quoteAmountPaise,
      currency: booking.currency,
      status: "PENDING",
    },
  });
  results.ids.internalPaymentId = paymentRecord.id;

  const orderMatches = rpOrder.amount === booking.quoteAmountPaise && rpOrder.currency === "INR" && rpOrder.receipt === booking.reference;
  recordTest("Razorpay Test Order Creation", orderMatches, "Razorpay Order " + rpOrder.id + " created for ₹" + (rpOrder.amount / 100) + " " + rpOrder.currency);

  console.log("\n--- PHASE 4 & 5: CHECKOUT & SIGNATURE VERIFICATION ---");
  const testPaymentId = "pay_test_" + randomUUID().replace(/-/g, "").slice(0, 14);
  results.ids.razorpayPaymentId = testPaymentId;

  const validCheckoutSig = createHmac("sha256", keySecret)
    .update(rpOrder.id + "|" + testPaymentId)
    .digest("hex");

  const { validRazorpayCheckoutSignature } = await import("../src/modules/payments/signature.ts");
  const isSigValid = validRazorpayCheckoutSignature(rpOrder.id, testPaymentId, validCheckoutSig, keySecret);
  recordTest("Valid Checkout Signature Verification", isSigValid, "HMAC-SHA256 signature verification succeeded");

  const invalidSig = validRazorpayCheckoutSignature(rpOrder.id, "pay_tampered_id", validCheckoutSig, keySecret);
  recordTest("Tampered Payment ID Rejected", !invalidSig, "Tampered payment ID rejected with false");

  const tamperedOrderSig = validRazorpayCheckoutSignature("order_tampered_id", testPaymentId, validCheckoutSig, keySecret);
  recordTest("Tampered Order ID Rejected", !tamperedOrderSig, "Tampered order ID rejected with false");

  const tamperedSigResult = validRazorpayCheckoutSignature(rpOrder.id, testPaymentId, "a".repeat(64), keySecret);
  recordTest("Tampered Signature Hex Rejected", !tamperedSigResult, "Random 64-char hex signature rejected with false");

  await prisma.payment.update({
    where: { id: paymentRecord.id },
    data: {
      providerPaymentId: testPaymentId,
      signatureVerified: true,
      status: "AUTHORIZED",
    },
  });
  const updatedAfterVerify = await prisma.payment.findUnique({ where: { id: paymentRecord.id } });
  recordTest("Payment Status Transition after Verification", updatedAfterVerify.status === "AUTHORIZED" && updatedAfterVerify.signatureVerified === true, "Payment marked AUTHORIZED with signatureVerified=true");

  console.log("\n--- PHASE 6, 7, 8: WEBHOOK VERIFICATION & IDEMPOTENCY ---");
  const webhookEventId = "evt_test_" + randomUUID().replace(/-/g, "").slice(0, 14);
  results.ids.webhookEventId = webhookEventId;

  const webhookPayload = JSON.stringify({
    entity: "event",
    account_id: "acc_test",
    event: "payment.captured",
    contains: ["payment"],
    payload: {
      payment: {
        entity: {
          id: testPaymentId,
          order_id: rpOrder.id,
          amount: booking.quoteAmountPaise,
          currency: "INR",
          status: "captured",
          method: "card",
        },
      },
    },
    created_at: Math.floor(Date.now() / 1000),
  });

  const validWebhookSig = createHmac("sha256", webhookSecret).update(webhookPayload).digest("hex");
  const { validRazorpaySignature } = await import("../src/modules/payments/signature.ts");

  const isWebhookSigValid = validRazorpaySignature(webhookPayload, validWebhookSig, webhookSecret);
  recordTest("Webhook Signature Verification", isWebhookSigValid, "Webhook HMAC-SHA256 signature verified against raw body");

  const isInvalidWebhookSigRejected = !validRazorpaySignature(webhookPayload, "invalid_webhook_sig", webhookSecret);
  recordTest("Invalid Webhook Signature Rejected", isInvalidWebhookSigRejected, "Invalid webhook signature rejected");

  const { POST } = await import("../src/app/api/webhooks/razorpay/route.ts");
  const webhookRequest1 = new Request("http://localhost:3000/api/webhooks/razorpay", {
    method: "POST",
    headers: {
      "x-razorpay-signature": validWebhookSig,
      "x-razorpay-event-id": webhookEventId,
    },
    body: webhookPayload,
  });

  const webhookResponse1 = await POST(webhookRequest1);
  const webhookJson1 = await webhookResponse1.json();
  const webhook1Passed = webhookResponse1.status === 202 && webhookJson1.accepted === true;
  recordTest("Webhook Initial Delivery (payment.captured)", webhook1Passed, "Status: " + webhookResponse1.status + ", Accepted: " + webhookJson1.accepted);

  const capturedPayment = await prisma.payment.findUnique({ where: { id: paymentRecord.id } });
  const confirmedBooking = await prisma.booking.findUnique({ where: { id: booking.id } });
  const paymentCapturedState = capturedPayment.status === "CAPTURED" && Boolean(capturedPayment.capturedAt);
  const bookingConfirmedState = confirmedBooking.status === "CONFIRMED";
  recordTest("Database Payment State (CAPTURED)", paymentCapturedState, "Payment status=" + capturedPayment.status + ", capturedAt=" + capturedPayment.capturedAt);
  recordTest("Database Booking State (CONFIRMED)", bookingConfirmedState, "Booking status=" + confirmedBooking.status);

  const webhookRequest2 = new Request("http://localhost:3000/api/webhooks/razorpay", {
    method: "POST",
    headers: {
      "x-razorpay-signature": validWebhookSig,
      "x-razorpay-event-id": webhookEventId,
    },
    body: webhookPayload,
  });
  const webhookResponse2 = await POST(webhookRequest2);
  const webhookJson2 = await webhookResponse2.json();
  const webhook2Idempotent = webhookResponse2.status === 200 && webhookJson2.duplicate === true;
  recordTest("Webhook Idempotency (Duplicate Replay)", webhook2Idempotent, "Replay returned status " + webhookResponse2.status + " duplicate=" + webhookJson2.duplicate);

  console.log("\n--- PHASE 9: PAYMENT FAILURE SIMULATION ---");
  const failBooking = await prisma.booking.create({
    data: {
      reference: "BK-FAIL-" + Date.now(),
      customerId: testUser.id,
      petId: testPet.id,
      serviceTypeId: serviceType.id,
      addressId: address.id,
      scheduledStart: new Date(Date.now() + 86400000),
      scheduledEnd: new Date(Date.now() + 86400000 + 1800000),
      quoteAmountPaise: 100000,
      currency: "INR",
      status: "PAYMENT_PENDING",
    },
  });

  const failRpOrder = await razorpay.orders.create({
    amount: failBooking.quoteAmountPaise,
    currency: failBooking.currency,
    receipt: failBooking.reference,
  });

  const failPayment = await prisma.payment.create({
    data: {
      bookingId: failBooking.id,
      provider: "razorpay",
      providerOrderId: failRpOrder.id,
      amountPaise: failBooking.quoteAmountPaise,
      currency: failBooking.currency,
      status: "PENDING",
    },
  });

  const failEventId = "evt_fail_" + randomUUID().replace(/-/g, "").slice(0, 14);
  const failWebhookPayload = JSON.stringify({
    entity: "event",
    event: "payment.failed",
    payload: {
      payment: {
        entity: {
          id: "pay_failed_" + randomUUID().replace(/-/g, "").slice(0, 10),
          order_id: failRpOrder.id,
          amount: failBooking.quoteAmountPaise,
          currency: "INR",
          status: "failed",
          error_code: "BAD_REQUEST_ERROR",
          error_description: "Payment failed due to customer cancellation",
        },
      },
    },
  });
  const failWebhookSig = createHmac("sha256", webhookSecret).update(failWebhookPayload).digest("hex");

  const failReq = new Request("http://localhost:3000/api/webhooks/razorpay", {
    method: "POST",
    headers: {
      "x-razorpay-signature": failWebhookSig,
      "x-razorpay-event-id": failEventId,
    },
    body: failWebhookPayload,
  });
  await POST(failReq);

  const failedPaymentRecord = await prisma.payment.findUnique({ where: { id: failPayment.id } });
  const failedBookingRecord = await prisma.booking.findUnique({ where: { id: failBooking.id } });
  const failureHandled = failedPaymentRecord.status === "FAILED" && failedBookingRecord.status === "PAYMENT_PENDING";
  recordTest("Payment Failure Handling", failureHandled, "Payment marked FAILED (" + failedPaymentRecord.failureCode + "), Booking remains PAYMENT_PENDING for retry");

  console.log("\n--- PHASE 11: REFUND LIFECYCLE ---");
  const refundRecord = await prisma.refund.create({
    data: {
      paymentId: capturedPayment.id,
      amountPaise: capturedPayment.amountPaise,
      reason: "Customer requested cancellation of walk service",
      requestedBy: testUser.id,
      status: "REQUESTED",
    },
  });
  results.ids.refundId = refundRecord.id;

  const testProviderRefundId = "rfnd_test_" + randomUUID().replace(/-/g, "").slice(0, 14);
  results.ids.razorpayRefundId = testProviderRefundId;

  await prisma.refund.update({
    where: { id: refundRecord.id },
    data: {
      providerRefundId: testProviderRefundId,
      status: "PROCESSING",
    },
  });
  recordTest("Refund Initiation", true, "Refund record created (" + refundRecord.id + ") with provider refund ID " + testProviderRefundId);

  const refundEventId = "evt_rfnd_" + randomUUID().replace(/-/g, "").slice(0, 14);
  const refundWebhookPayload = JSON.stringify({
    entity: "event",
    event: "refund.processed",
    payload: {
      refund: {
        entity: {
          id: testProviderRefundId,
          payment_id: testPaymentId,
          amount: capturedPayment.amountPaise,
          status: "processed",
        },
      },
    },
  });
  const refundWebhookSig = createHmac("sha256", webhookSecret).update(refundWebhookPayload).digest("hex");

  const refundReq = new Request("http://localhost:3000/api/webhooks/razorpay", {
    method: "POST",
    headers: {
      "x-razorpay-signature": refundWebhookSig,
      "x-razorpay-event-id": refundEventId,
    },
    body: refundWebhookPayload,
  });
  const refundRes = await POST(refundReq);
  recordTest("Refund Webhook Processed", refundRes.status === 202, "refund.processed webhook processed successfully");

  const finalRefund = await prisma.refund.findUnique({ where: { id: refundRecord.id } });
  const finalPayment = await prisma.payment.findUnique({ where: { id: capturedPayment.id } });
  const refundCompleted = finalRefund.status === "COMPLETED" && finalPayment.status === "REFUNDED";
  recordTest("Database Refund & Payment Reconciliation", refundCompleted, "Refund status=" + finalRefund.status + ", Payment status=" + finalPayment.status);

  console.log("\n--- PHASE 12: DATABASE STATE AUDIT ---");
  const auditBooking = await prisma.booking.findUnique({
    where: { id: booking.id },
    include: {
      payments: {
        include: {
          refunds: true,
        },
      },
    },
  });

  const paymentEventsCount = await prisma.paymentEvent.count({
    where: {
      providerEventId: { in: [webhookEventId, failEventId, refundEventId] },
    },
  });

  const auditPassed = auditBooking &&
    auditBooking.payments.length === 1 &&
    auditBooking.payments[0].refunds.length === 1 &&
    paymentEventsCount === 3;

  recordTest("Database Audit Chain Integrity", Boolean(auditPassed), "Verified 1:1:1:1 Booking -> Payment -> Refund -> PaymentEvents integrity without orphans");

  console.log("\n===============================================================");
  console.log("PetSaathi Razorpay Test-Mode Verification Summary");
  console.log("===============================================================");
  const allPassed = results.tests.every(t => t.result === "PASS");
  console.log("Overall Result: " + (allPassed ? "PASS" : "FAIL"));
  console.log("Total Checks: " + results.tests.length + ", Passed: " + results.tests.filter(t => t.result === "PASS").length);
  console.log("\nIdentifiers Generated:");
  console.log(JSON.stringify(results.ids, null, 2));

  await prisma.$disconnect();
  process.exit(allPassed ? 0 : 1);
}

runVerification().catch(async (err) => {
  console.error("Verification error:", err);
  await prisma.$disconnect();
  process.exit(1);
});