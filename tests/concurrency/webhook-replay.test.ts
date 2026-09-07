import { describe, it, expect, beforeAll, afterAll } from "vitest";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import { POST } from "@/app/api/webhooks/razorpay/route";

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "sim_webhook_secret_test_mode";

describe("Concurrency: Webhook Replay Idempotency", () => {
  let bookingId: string;
  let paymentId: string;
  let providerOrderId: string;
  let providerPaymentId: string;
  let eventId: string;
  let rawBody: string;
  let signature: string;

  beforeAll(async () => {
    // 1. Seed customer, pet, address, service
    const customer = await prisma.user.findFirst({
      where: { roles: { some: { role: "CUSTOMER" } }, pets: { some: {} }, addresses: { some: {} } },
      include: { pets: true, addresses: true }
    });
    if (!customer) throw new Error("Customer missing");

    const serviceType = await prisma.serviceType.findFirst({ where: { active: true } });
    if (!serviceType) throw new Error("ServiceType missing");

    const pet = customer.pets[0];
    const address = customer.addresses[0];
    if (!pet || !address) throw new Error("Customer pet or address missing");

    // 2. Create booking in PAYMENT_PENDING state
    const scheduledStart = new Date(Date.now() + 4 * 3600 * 1000);
    const booking = await prisma.booking.create({
      data: {
        reference: `BK-CONCUR-WH-${Date.now().toString().slice(-6)}`,
        customerId: customer.id,
        petId: pet.id,
        addressId: address.id,
        serviceTypeId: serviceType.id,
        status: "PAYMENT_PENDING",
        scheduledStart,
        scheduledEnd: new Date(scheduledStart.getTime() + 30 * 60 * 1000),
        quoteAmountPaise: 29900,
        currency: "INR"
      }
    });
    bookingId = booking.id;

    // 3. Create payment in CREATED state
    providerOrderId = `order_replay_${Date.now().toString(36)}`;
    providerPaymentId = `pay_replay_${Date.now().toString(36)}`;
    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        provider: "razorpay",
        providerOrderId,
        providerPaymentId,
        amountPaise: 29900,
        currency: "INR",
        status: "PENDING"
      }
    });
    paymentId = payment.id;

    // 4. Craft valid payload and HMAC signature
    eventId = `evt_replay_${Date.now().toString(36)}`;
    const payload = {
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: providerPaymentId,
            order_id: providerOrderId,
            amount: 29900,
            currency: "INR",
            status: "captured"
          }
        }
      }
    };
    rawBody = JSON.stringify(payload);
    signature = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
  }, 30000);

  afterAll(async () => {
    await prisma.notificationOutbox.deleteMany({ where: { idempotencyKey: `booking-confirmed:${bookingId}:${paymentId}` } }).catch(() => {});
    await prisma.paymentEvent.deleteMany({ where: { providerEventId: eventId } }).catch(() => {});
    await prisma.payment.deleteMany({ where: { id: paymentId } }).catch(() => {});
    await prisma.bookingStatusHistory.deleteMany({ where: { bookingId } }).catch(() => {});
    await prisma.booking.delete({ where: { id: bookingId } }).catch(() => {});
  }, 30000);

  it("handles 5 identical concurrent webhook requests idempotently", async () => {
    let releaseBarrier: () => void;
    const barrier = new Promise<void>((resolve) => {
      releaseBarrier = resolve;
    });

    const fireWebhook = async () => {
      await barrier;
      const req = new Request("http://localhost:3000/api/webhooks/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-razorpay-event-id": eventId,
          "x-razorpay-signature": signature
        },
        body: rawBody
      });
      const res = await POST(req);
      return { status: res.status };
    };

    const requests = [fireWebhook(), fireWebhook(), fireWebhook(), fireWebhook(), fireWebhook()];
    releaseBarrier!();

    const results = await Promise.all(requests);
    console.log("\nWebhook Replay Statuses:", results.map(r => r.status));

    // All requests return 2xx (200 OK or 202 Accepted)
    for (const r of results) {
      expect([200, 202]).toContain(r.status);
    }

    // Exactly 1 PaymentEvent row exists for eventId
    const eventCount = await prisma.paymentEvent.count({
      where: { providerEventId: eventId }
    });
    expect(eventCount).toBe(1);

    // Booking transitions to CONFIRMED exactly once
    const updatedBooking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    expect(updatedBooking?.status).toBe("CONFIRMED");

    // Payment marked CAPTURED
    const updatedPayment = await prisma.payment.findUnique({
      where: { id: paymentId }
    });
    expect(updatedPayment?.status).toBe("CAPTURED");

    // Notification created exactly once via idempotencyKey
    const notifications = await prisma.notificationOutbox.findMany({
      where: { idempotencyKey: `booking-confirmed:${bookingId}:${paymentId}` }
    });
    expect(notifications).toHaveLength(1);
  });
});
