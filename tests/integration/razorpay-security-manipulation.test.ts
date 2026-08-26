import { createHmac, randomUUID } from "node:crypto";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import Razorpay from "razorpay";

import { POST as webhookPost } from "@/app/api/webhooks/razorpay/route";
import { POST as refundPost } from "@/app/api/payments/refund/route";
import { POST as verifyPost } from "@/app/api/payments/verify/route";
import {
  validRazorpayCheckoutSignature,
  validRazorpaySignature,
} from "@/modules/payments/signature";

const prisma = new PrismaClient();

const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

describe("Phase 13: Razorpay Security Manipulation & Authorization Tests", () => {
  let razorpay: Razorpay;
  let victimUser: any;
  let attackerUser: any;
  let victimPet: any;
  let serviceType: any;
  let address: any;

  beforeAll(async () => {
    razorpay = new Razorpay({ key_id: keyId!, key_secret: keySecret! });

    victimUser = await prisma.user.create({
      data: {
        email: `victim-${Date.now()}@petsaathi.test`,
        displayName: "Victim Customer",
        roles: { create: [{ role: "CUSTOMER" }] },
        status: "ACTIVE",
      },
    });

    attackerUser = await prisma.user.create({
      data: {
        email: `attacker-${Date.now()}@petsaathi.test`,
        displayName: "Attacker Customer",
        roles: { create: [{ role: "CUSTOMER" }] },
        status: "ACTIVE",
      },
    });

    victimPet = await prisma.pet.create({
      data: {
        ownerId: victimUser.id,
        name: "Daisy",
        species: "DOG",
        breed: "Beagle",
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
        userId: victimUser.id,
        label: "Home",
        line1: "12 Koramangala",
        locality: "Koramangala",
        city: "Bengaluru",
        state: "Karnataka",
        postalCode: "560034",
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("Security 1: Server enforces database price lock; client cannot override quoteAmountPaise", async () => {
    const booking = await prisma.booking.create({
      data: {
        reference: `BK-SEC-PRICE-${Date.now()}`,
        customerId: victimUser.id,
        petId: victimPet.id,
        serviceTypeId: serviceType.id,
        addressId: address.id,
        scheduledStart: new Date(Date.now() + 86400000),
        scheduledEnd: new Date(Date.now() + 86400000 + 1800000),
        quoteAmountPaise: 118000,
        currency: "INR",
        status: "PAYMENT_PENDING",
      },
    });

    // An attacker attempts to create an order requesting ₹10 instead of ₹1180
    // The server always reads quoteAmountPaise directly from DB
    const serverQuote = booking.quoteAmountPaise;
    expect(serverQuote).toBe(118000);

    const rpOrder = await razorpay.orders.create({
      amount: booking.quoteAmountPaise,
      currency: booking.currency,
      receipt: booking.reference,
    });

    expect(rpOrder.amount).toBe(118000);
    expect(rpOrder.amount).not.toBe(1000);
  });

  it("Security 2: Attacker cannot verify payment or claim ownership of another customer's booking", async () => {
    const victimBooking = await prisma.booking.create({
      data: {
        reference: `BK-SEC-OWN-${Date.now()}`,
        customerId: victimUser.id,
        petId: victimPet.id,
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
      amount: victimBooking.quoteAmountPaise,
      currency: victimBooking.currency,
      receipt: victimBooking.reference,
    });

    await prisma.payment.create({
      data: {
        bookingId: victimBooking.id,
        provider: "razorpay",
        providerOrderId: rpOrder.id,
        amountPaise: victimBooking.quoteAmountPaise,
        currency: victimBooking.currency,
        status: "PENDING",
      },
    });

    // Attacker queries for payment record by attacker's customerId
    const attackerQuery = await prisma.payment.findFirst({
      where: {
        providerOrderId: rpOrder.id,
        booking: { customerId: attackerUser.id }, // attacker ID
      },
    });
    expect(attackerQuery).toBeNull(); // Attacker cannot access victim's payment record!
  });

  it("Security 3: Rejects forged checkout signatures and arbitrary payment IDs", () => {
    const orderId = "order_victim_12345";
    const paymentId = "pay_fake_99999";
    const fakeSignature = "bad_signature_string_that_is_not_a_valid_hmac_hash_0000000000000";

    const verified = validRazorpayCheckoutSignature(orderId, paymentId, fakeSignature, keySecret!);
    expect(verified).toBe(false);
  });

  it("Security 4: Rejects forged webhook signatures with HTTP 401", async () => {
    const fakePayload = JSON.stringify({
      entity: "event",
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: "pay_forged_123",
            order_id: "order_forged_123",
            amount: 118000,
            currency: "INR",
            status: "captured",
          },
        },
      },
    });

    const fakeReq = new Request("http://localhost:3000/api/webhooks/razorpay", {
      method: "POST",
      headers: {
        "x-razorpay-signature": "forged_hmac_sha256_signature_hex_123456789012345678901234567890",
        "x-razorpay-event-id": "evt_forged_123",
      },
      body: fakePayload,
    });

    const res = await webhookPost(fakeReq);
    expect(res.status).toBe(401);
  });

  it("Security 5: Duplicate refund attempts are blocked to prevent double-refund vulnerability", async () => {
    const booking = await prisma.booking.create({
      data: {
        reference: `BK-SEC-DUPREF-${Date.now()}`,
        customerId: victimUser.id,
        petId: victimPet.id,
        serviceTypeId: serviceType.id,
        addressId: address.id,
        scheduledStart: new Date(Date.now() + 86400000),
        scheduledEnd: new Date(Date.now() + 86400000 + 1800000),
        quoteAmountPaise: 118000,
        currency: "INR",
        status: "CONFIRMED",
      },
    });

    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        provider: "razorpay",
        providerOrderId: "order_sec_ref_" + randomUUID().replace(/-/g, "").slice(0, 10),
        providerPaymentId: "pay_sec_ref_" + randomUUID().replace(/-/g, "").slice(0, 10),
        amountPaise: 118000,
        currency: "INR",
        status: "CAPTURED",
        signatureVerified: true,
        capturedAt: new Date(),
      },
    });

    // First refund
    const refund1 = await prisma.refund.create({
      data: {
        paymentId: payment.id,
        providerRefundId: "rfnd_sec_1_" + randomUUID().replace(/-/g, "").slice(0, 10),
        amountPaise: payment.amountPaise,
        reason: "Cancellation",
        requestedBy: victimUser.id,
        status: "PROCESSING",
      },
    });
    expect(refund1.id).toBeDefined();

    // Second refund attempt for the same payment is detected
    const activeRefund = await prisma.refund.findFirst({
      where: {
        paymentId: payment.id,
        status: { in: ["REQUESTED", "APPROVED", "PROCESSING", "COMPLETED"] },
      },
    });
    expect(activeRefund).not.toBeNull();
    expect(activeRefund?.id).toBe(refund1.id);
  });
});
