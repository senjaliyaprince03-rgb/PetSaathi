import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/webhooks/razorpay/route";
import { createHmac } from "node:crypto";

const { mockDb, mockTx } = vi.hoisted(() => {
  const db = {
    paymentEvents: new Map<string, any>(),
    payments: new Map<string, any>(),
    bookings: new Map<string, any>(),
    refunds: new Map<string, any>(),
    outbox: [] as any[],
  };

  const tx = {
    payment: {
      findUnique: async ({ where }: { where: { providerOrderId: string } }) => {
        const p = db.payments.get(where.providerOrderId);
        if (!p) return null;
        const b = db.bookings.get(p.bookingId);
        return { ...p, booking: b };
      },
      update: async ({ where, data }: { where: { id: string }; data: any }) => {
        for (const [orderId, p] of db.payments.entries()) {
          if (p.id === where.id) {
            const updated = { ...p, ...data };
            db.payments.set(orderId, updated);
            return updated;
          }
        }
        return null;
      },
    },
    booking: {
      update: async ({ where, data }: { where: { id: string }; data: any }) => {
        const b = db.bookings.get(where.id);
        if (b) {
          const updated = { ...b, ...data };
          db.bookings.set(where.id, updated);
          return updated;
        }
        return null;
      },
    },
    paymentEvent: {
      update: async ({ where, data }: { where: { id: string }; data: any }) => {
        for (const [key, ev] of db.paymentEvents.entries()) {
          if (ev.id === where.id) {
            const updated = { ...ev, ...data };
            db.paymentEvents.set(key, updated);
            return updated;
          }
        }
        return null;
      },
    },
    notificationOutbox: {
      upsert: async ({ create }: { create: any }) => {
        db.outbox.push(create);
        return create;
      },
    },
    refund: {
      findUnique: async ({ where }: { where: { providerRefundId: string } }) => {
        const r = db.refunds.get(where.providerRefundId);
        if (!r) return null;
        const p = Array.from(db.payments.values()).find((pay) => pay.id === r.paymentId);
        return { ...r, payment: p };
      },
      update: async ({ where, data }: { where: { id: string }; data: any }) => {
        for (const [rid, r] of db.refunds.entries()) {
          if (r.id === where.id) {
            const updated = { ...r, ...data };
            db.refunds.set(rid, updated);
            return updated;
          }
        }
        return null;
      },
      aggregate: async () => ({ _sum: { amountPaise: 118000 } }),
    },
  };

  return { mockDb: db, mockTx: tx };
});

vi.mock("@/lib/db", () => ({
  isDatabaseConfigured: () => true,
  prisma: {
    paymentEvent: {
      findUnique: vi.fn(async ({ where }: { where: { providerEventId?: string; id?: string } }) => {
        if (where.providerEventId) return mockDb.paymentEvents.get(where.providerEventId) || null;
        if (where.id) {
          for (const ev of mockDb.paymentEvents.values()) {
            if (ev.id === where.id) return ev;
          }
        }
        return null;
      }),
      create: vi.fn(async ({ data }: { data: any }) => {
        const record = { id: `pevt_${Date.now()}_${Math.random()}`, ...data, attempts: 0, processedAt: null, processingError: null };
        mockDb.paymentEvents.set(data.providerEventId, record);
        return record;
      }),
      update: vi.fn(async ({ where, data }: { where: { id: string }; data: any }) => {
        for (const [key, ev] of mockDb.paymentEvents.entries()) {
          if (ev.id === where.id) {
            const updated = { ...ev, ...data };
            mockDb.paymentEvents.set(key, updated);
            return updated;
          }
        }
        return null;
      }),
    },
    payment: mockTx.payment,
    booking: mockTx.booking,
    refund: mockTx.refund,
    notificationOutbox: mockTx.notificationOutbox,
    $transaction: vi.fn(async (cb: any) => cb(mockTx)),
  },
}));

describe("Razorpay Webhook Handler Lifecycle", () => {
  const secret = "test_webhook_secret_xyz";
  const orderId = "order_hook_12345";
  const paymentId = "pay_hook_67890";
  const bookingId = "book_hook_11111";

  beforeEach(() => {
    process.env.RAZORPAY_WEBHOOK_SECRET = secret;
    mockDb.paymentEvents.clear();
    mockDb.payments.clear();
    mockDb.bookings.clear();
    mockDb.refunds.clear();
    mockDb.outbox = [];

    mockDb.bookings.set(bookingId, {
      id: bookingId,
      reference: "BK-REF-12345",
      customerId: "cust_123",
      status: "PAYMENT_PENDING",
      quoteAmountPaise: 118000,
      currency: "INR",
    });

    mockDb.payments.set(orderId, {
      id: "pay_rec_1",
      bookingId,
      providerOrderId: orderId,
      amountPaise: 118000,
      currency: "INR",
      status: "PENDING",
    });
  });

  it("rejects webhook requests with no signature", async () => {
    const payload = JSON.stringify({ event: "payment.captured" });
    const req = new Request("http://localhost/api/webhooks/razorpay", {
      method: "POST",
      headers: { "x-razorpay-event-id": "evt_1" },
      body: payload,
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("rejects webhook requests with an invalid signature", async () => {
    const payload = JSON.stringify({ event: "payment.captured" });
    const req = new Request("http://localhost/api/webhooks/razorpay", {
      method: "POST",
      headers: {
        "x-razorpay-signature": "invalid_sig",
        "x-razorpay-event-id": "evt_1",
      },
      body: payload,
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("processes payment.captured webhook, updates payment and confirms booking", async () => {
    const payload = JSON.stringify({
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: paymentId,
            order_id: orderId,
            amount: 118000,
            currency: "INR",
            status: "captured",
          },
        },
      },
    });
    const sig = createHmac("sha256", secret).update(payload).digest("hex");
    const req = new Request("http://localhost/api/webhooks/razorpay", {
      method: "POST",
      headers: {
        "x-razorpay-signature": sig,
        "x-razorpay-event-id": "evt_capture_101",
      },
      body: payload,
    });

    const res = await POST(req);
    expect(res.status).toBe(202);
    const body = await res.json();
    expect(body.accepted).toBe(true);

    const payment = mockDb.payments.get(orderId);
    expect(payment.status).toBe("CAPTURED");
    expect(payment.providerPaymentId).toBe(paymentId);
    expect(payment.signatureVerified).toBe(true);

    const booking = mockDb.bookings.get(bookingId);
    expect(booking.status).toBe("CONFIRMED");
  });

  it("guarantees webhook idempotency when duplicate event arrives", async () => {
    const payload = JSON.stringify({
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: paymentId,
            order_id: orderId,
            amount: 118000,
            currency: "INR",
            status: "captured",
          },
        },
      },
    });
    const sig = createHmac("sha256", secret).update(payload).digest("hex");
    const eventId = "evt_duplicate_test_202";

    // 1st delivery
    const req1 = new Request("http://localhost/api/webhooks/razorpay", {
      method: "POST",
      headers: { "x-razorpay-signature": sig, "x-razorpay-event-id": eventId },
      body: payload,
    });
    const res1 = await POST(req1);
    expect(res1.status).toBe(202);

    // 2nd delivery (replay of same event)
    const req2 = new Request("http://localhost/api/webhooks/razorpay", {
      method: "POST",
      headers: { "x-razorpay-signature": sig, "x-razorpay-event-id": eventId },
      body: payload,
    });
    const res2 = await POST(req2);
    expect(res2.status).toBe(200);
    const data2 = await res2.json();
    expect(data2.accepted).toBe(true);
    expect(data2.duplicate).toBe(true);
  });

  it("handles payment.failed webhook without confirming booking", async () => {
    const payload = JSON.stringify({
      event: "payment.failed",
      payload: {
        payment: {
          entity: {
            id: "pay_failed_303",
            order_id: orderId,
            amount: 118000,
            currency: "INR",
            status: "failed",
            error_code: "BAD_REQUEST_ERROR",
            error_description: "Payment failed due to insufficient funds",
          },
        },
      },
    });
    const sig = createHmac("sha256", secret).update(payload).digest("hex");
    const req = new Request("http://localhost/api/webhooks/razorpay", {
      method: "POST",
      headers: {
        "x-razorpay-signature": sig,
        "x-razorpay-event-id": "evt_fail_303",
      },
      body: payload,
    });

    const res = await POST(req);
    expect(res.status).toBe(202);

    const payment = mockDb.payments.get(orderId);
    expect(payment.status).toBe("FAILED");
    expect(payment.failureCode).toBe("BAD_REQUEST_ERROR");

    const booking = mockDb.bookings.get(bookingId);
    expect(booking.status).toBe("PAYMENT_PENDING"); // Booking remains pending/retryable!
  });

  it("does not corrupt CAPTURED payment status if out-of-order payment.failed arrives later", async () => {
    // Set payment to already CAPTURED
    mockDb.payments.set(orderId, {
      id: "pay_rec_1",
      bookingId,
      providerOrderId: orderId,
      amountPaise: 118000,
      currency: "INR",
      status: "CAPTURED",
    });

    const payload = JSON.stringify({
      event: "payment.failed",
      payload: {
        payment: {
          entity: {
            id: "pay_failed_404",
            order_id: orderId,
            amount: 118000,
            currency: "INR",
            status: "failed",
            error_code: "GATEWAY_ERROR",
          },
        },
      },
    });
    const sig = createHmac("sha256", secret).update(payload).digest("hex");
    const req = new Request("http://localhost/api/webhooks/razorpay", {
      method: "POST",
      headers: {
        "x-razorpay-signature": sig,
        "x-razorpay-event-id": "evt_ooo_404",
      },
      body: payload,
    });

    const res = await POST(req);
    expect(res.status).toBe(202);

    const payment = mockDb.payments.get(orderId);
    expect(payment.status).toBe("CAPTURED"); // Still CAPTURED!
  });
});

