import { createHmac, randomUUID } from "node:crypto";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import Razorpay from "razorpay";

import { POST as webhookPost } from "@/app/api/webhooks/razorpay/route";
import {
  validRazorpayCheckoutSignature,
  validRazorpaySignature,
} from "@/modules/payments/signature";

const prisma = new PrismaClient();

const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

describe("Razorpay Test-Mode End-to-End Payment Lifecycle", () => {
  let razorpay: Razorpay;
  let testUser: any;
  let testPet: any;
  let serviceType: any;
  let address: any;

  beforeAll(async () => {
    expect(keyId).toBeDefined();
    expect(keyId?.startsWith("rzp_test_")).toBe(true);
    expect(keySecret).toBeDefined();
    expect(webhookSecret).toBeDefined();

    razorpay = new Razorpay({ key_id: keyId!, key_secret: keySecret! });

    const email = `test-customer-${Date.now()}@petsaathi.test`;
    testUser = await prisma.user.create({
      data: {
        email,
        displayName: "E2E Test Customer",
        roles: { create: [{ role: "CUSTOMER" }] },
        status: "ACTIVE",
      },
    });

    testPet = await prisma.pet.create({
      data: {
        ownerId: testUser.id,
        name: "Max",
        species: "DOG",
        breed: "Labrador",
        active: true,
      },
    });

    serviceType = await prisma.serviceType.upsert({
      where: { code: "DOG_WALK_30" },
      update: {},
      create: {
        code: "DOG_WALK_30",
        name: "30-Min Dog Walk",
        description: "30 min dog walk",
        durationMinutes: 30,
        basePricePaise: 100000,
        active: true,
      },
    });

    address = await prisma.address.create({
      data: {
        userId: testUser.id,
        label: "Home",
        line1: "42 Indiranagar 100ft Rd",
        locality: "Indiranagar",
        city: "Bengaluru",
        state: "Karnataka",
        postalCode: "560038",
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("Phase 3: Creates booking with server-calculated price lock and Razorpay test order", async () => {
    const quoteAmountPaise = 118000; // ₹1,180
    const reference = `BK-TEST-${Date.now()}`;

    const booking = await prisma.booking.create({
      data: {
        reference,
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

    expect(booking.id).toBeDefined();
    expect(booking.quoteAmountPaise).toBe(118000);
    expect(booking.currency).toBe("INR");
    expect(booking.status).toBe("PAYMENT_PENDING");

    // Real Razorpay Test API call
    const rpOrder = await razorpay.orders.create({
      amount: booking.quoteAmountPaise,
      currency: booking.currency,
      receipt: booking.reference,
      notes: {
        bookingId: booking.id,
      },
    });

    expect(rpOrder.id).toBeDefined();
    expect(rpOrder.id.startsWith("order_")).toBe(true);
    expect(rpOrder.amount).toBe(booking.quoteAmountPaise);
    expect(rpOrder.currency).toBe("INR");
    expect(rpOrder.receipt).toBe(booking.reference);

    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        provider: "razorpay",
        providerOrderId: rpOrder.id,
        amountPaise: booking.quoteAmountPaise,
        currency: booking.currency,
        status: "PENDING",
      },
    });

    expect(payment.providerOrderId).toBe(rpOrder.id);
    expect(payment.status).toBe("PENDING");
  });

  it("Phase 4 & 5: Verifies valid checkout signature and rejects tampered signatures", async () => {
    const orderId = "order_test_" + randomUUID().replace(/-/g, "").slice(0, 10);
    const paymentId = "pay_test_" + randomUUID().replace(/-/g, "").slice(0, 10);

    const validSig = createHmac("sha256", keySecret!)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    // Valid
    expect(validRazorpayCheckoutSignature(orderId, paymentId, validSig, keySecret!)).toBe(true);

    // Tampered payment ID
    expect(validRazorpayCheckoutSignature(orderId, "pay_tampered", validSig, keySecret!)).toBe(false);

    // Tampered order ID
    expect(validRazorpayCheckoutSignature("order_tampered", paymentId, validSig, keySecret!)).toBe(false);

    // Tampered signature hex
    expect(validRazorpayCheckoutSignature(orderId, paymentId, "0".repeat(64), keySecret!)).toBe(false);

    // Tampered secret
    expect(validRazorpayCheckoutSignature(orderId, paymentId, validSig, "wrong_secret")).toBe(false);
  });

  it("Phase 6, 7 & 8: Delivers payment.captured webhook, updates DB to CAPTURED/CONFIRMED, and guarantees idempotency", async () => {
    const booking = await prisma.booking.create({
      data: {
        reference: `BK-HOOK-${Date.now()}`,
        customerId: testUser.id,
        petId: testPet.id,
        serviceTypeId: serviceType.id,
        addressId: address.id,
        scheduledStart: new Date(Date.now() + 86400000),
        scheduledEnd: new Date(Date.now() + 86400000 + 1800000),
        quoteAmountPaise: 118000,
        currency: "INR",
        status: "PAYMENT_PENDING",
      },
    });

    const rpOrder = await razorpay.orders.create({
      amount: booking.quoteAmountPaise,
      currency: booking.currency,
      receipt: booking.reference,
    });

    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        provider: "razorpay",
        providerOrderId: rpOrder.id,
        amountPaise: booking.quoteAmountPaise,
        currency: booking.currency,
        status: "PENDING",
      },
    });

    const testPaymentId = "pay_test_" + randomUUID().replace(/-/g, "").slice(0, 12);
    const webhookEventId = "evt_test_" + randomUUID().replace(/-/g, "").slice(0, 12);

    const payloadObj = {
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
    };

    const rawBody = JSON.stringify(payloadObj);
    const validSignature = createHmac("sha256", webhookSecret!).update(rawBody).digest("hex");

    // Rejection of invalid signature
    const badReq = new Request("http://localhost:3000/api/webhooks/razorpay", {
      method: "POST",
      headers: {
        "x-razorpay-signature": "bad_signature_hex",
        "x-razorpay-event-id": webhookEventId,
      },
      body: rawBody,
    });
    const badRes = await webhookPost(badReq);
    expect(badRes.status).toBe(401);

    // Initial successful webhook delivery
    const req1 = new Request("http://localhost:3000/api/webhooks/razorpay", {
      method: "POST",
      headers: {
        "x-razorpay-signature": validSignature,
        "x-razorpay-event-id": webhookEventId,
      },
      body: rawBody,
    });
    const res1 = await webhookPost(req1);
    expect(res1.status).toBe(202);
    const json1 = await res1.json();
    expect(json1.accepted).toBe(true);

    // Verify DB states
    const updatedPayment = await prisma.payment.findUnique({ where: { id: payment.id } });
    const updatedBooking = await prisma.booking.findUnique({ where: { id: booking.id } });
    expect(updatedPayment?.status).toBe("CAPTURED");
    expect(updatedPayment?.providerPaymentId).toBe(testPaymentId);
    expect(updatedPayment?.signatureVerified).toBe(true);
    expect(updatedPayment?.capturedAt).toBeDefined();
    expect(updatedBooking?.status).toBe("CONFIRMED");

    // Idempotency: Replaying exact same event
    const req2 = new Request("http://localhost:3000/api/webhooks/razorpay", {
      method: "POST",
      headers: {
        "x-razorpay-signature": validSignature,
        "x-razorpay-event-id": webhookEventId,
      },
      body: rawBody,
    });
    const res2 = await webhookPost(req2);
    expect(res2.status).toBe(200);
    const json2 = await res2.json();
    expect(json2.accepted).toBe(true);
    expect(json2.duplicate).toBe(true);

    // Out of order: late payment.failed does not regress CAPTURED payment
    const oooEventId = "evt_ooo_" + randomUUID().replace(/-/g, "").slice(0, 12);
    const oooPayload = JSON.stringify({
      entity: "event",
      event: "payment.failed",
      payload: {
        payment: {
          entity: {
            id: testPaymentId,
            order_id: rpOrder.id,
            amount: booking.quoteAmountPaise,
            currency: "INR",
            status: "failed",
            error_code: "GATEWAY_ERROR",
          },
        },
      },
    });
    const oooSig = createHmac("sha256", webhookSecret!).update(oooPayload).digest("hex");
    const oooReq = new Request("http://localhost:3000/api/webhooks/razorpay", {
      method: "POST",
      headers: {
        "x-razorpay-signature": oooSig,
        "x-razorpay-event-id": oooEventId,
      },
      body: oooPayload,
    });
    const oooRes = await webhookPost(oooReq);
    expect(oooRes.status).toBe(202);

    const paymentStillCaptured = await prisma.payment.findUnique({ where: { id: payment.id } });
    expect(paymentStillCaptured?.status).toBe("CAPTURED");
  });

  it("Phase 9: Handles payment.failed without confirming booking (leaving booking pending for retry)", async () => {
    const booking = await prisma.booking.create({
      data: {
        reference: `BK-FAIL-${Date.now()}`,
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

    const rpOrder = await razorpay.orders.create({
      amount: booking.quoteAmountPaise,
      currency: booking.currency,
      receipt: booking.reference,
    });

    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        provider: "razorpay",
        providerOrderId: rpOrder.id,
        amountPaise: booking.quoteAmountPaise,
        currency: booking.currency,
        status: "PENDING",
      },
    });

    const failEventId = "evt_fail_" + randomUUID().replace(/-/g, "").slice(0, 12);
    const failPayload = JSON.stringify({
      entity: "event",
      event: "payment.failed",
      payload: {
        payment: {
          entity: {
            id: "pay_failed_" + randomUUID().replace(/-/g, "").slice(0, 10),
            order_id: rpOrder.id,
            amount: booking.quoteAmountPaise,
            currency: "INR",
            status: "failed",
            error_code: "BAD_REQUEST_ERROR",
            error_description: "Payment failed due to insufficient funds",
          },
        },
      },
    });
    const failSig = createHmac("sha256", webhookSecret!).update(failPayload).digest("hex");

    const failReq = new Request("http://localhost:3000/api/webhooks/razorpay", {
      method: "POST",
      headers: {
        "x-razorpay-signature": failSig,
        "x-razorpay-event-id": failEventId,
      },
      body: failPayload,
    });
    const failRes = await webhookPost(failReq);
    expect(failRes.status).toBe(202);

    const failedPayment = await prisma.payment.findUnique({ where: { id: payment.id } });
    const bookingAfterFail = await prisma.booking.findUnique({ where: { id: booking.id } });

    expect(failedPayment?.status).toBe("FAILED");
    expect(failedPayment?.failureCode).toBe("BAD_REQUEST_ERROR");
    expect(bookingAfterFail?.status).toBe("PAYMENT_PENDING"); // Booking is not confirmed and remains retryable!
  });

  it("Phase 11: Completes refund lifecycle and reconciles payment to REFUNDED", async () => {
    // 1. Create confirmed booking with captured payment
    const booking = await prisma.booking.create({
      data: {
        reference: `BK-RFND-${Date.now()}`,
        customerId: testUser.id,
        petId: testPet.id,
        serviceTypeId: serviceType.id,
        addressId: address.id,
        scheduledStart: new Date(Date.now() + 86400000),
        scheduledEnd: new Date(Date.now() + 86400000 + 1800000),
        quoteAmountPaise: 118000,
        currency: "INR",
        status: "CONFIRMED",
      },
    });

    const testPaymentId = "pay_test_" + randomUUID().replace(/-/g, "").slice(0, 12);
    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        provider: "razorpay",
        providerOrderId: "order_rfnd_" + randomUUID().replace(/-/g, "").slice(0, 10),
        providerPaymentId: testPaymentId,
        amountPaise: 118000,
        currency: "INR",
        status: "CAPTURED",
        signatureVerified: true,
        capturedAt: new Date(),
      },
    });

    const testRefundId = "rfnd_test_" + randomUUID().replace(/-/g, "").slice(0, 12);
    const refund = await prisma.refund.create({
      data: {
        paymentId: payment.id,
        providerRefundId: testRefundId,
        amountPaise: payment.amountPaise,
        reason: "Customer cancelled appointment",
        requestedBy: testUser.id,
        status: "PROCESSING",
      },
    });

    // 2. Deliver refund.processed webhook
    const refundEventId = "evt_rfnd_" + randomUUID().replace(/-/g, "").slice(0, 12);
    const refundPayload = JSON.stringify({
      entity: "event",
      event: "refund.processed",
      payload: {
        refund: {
          entity: {
            id: testRefundId,
            payment_id: testPaymentId,
            amount: payment.amountPaise,
            status: "processed",
          },
        },
      },
    });
    const refundSig = createHmac("sha256", webhookSecret!).update(refundPayload).digest("hex");

    const refundReq = new Request("http://localhost:3000/api/webhooks/razorpay", {
      method: "POST",
      headers: {
        "x-razorpay-signature": refundSig,
        "x-razorpay-event-id": refundEventId,
      },
      body: refundPayload,
    });
    const refundRes = await webhookPost(refundReq);
    expect(refundRes.status).toBe(202);

    const finalRefund = await prisma.refund.findUnique({ where: { id: refund.id } });
    const finalPayment = await prisma.payment.findUnique({ where: { id: payment.id } });

    expect(finalRefund?.status).toBe("COMPLETED");
    expect(finalRefund?.completedAt).toBeDefined();
    expect(finalPayment?.status).toBe("REFUNDED");
  });
});
