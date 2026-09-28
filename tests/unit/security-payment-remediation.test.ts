import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/payments/verify/route";
import { createHmac } from "node:crypto";

vi.mock("@/modules/auth/session", () => ({
  getCurrentIdentity: vi.fn(),
}));

vi.mock("@/modules/payments/razorpay", () => ({ createRazorpayClient: () => ({ payments: { fetch: vi.fn().mockResolvedValue({id: "pay_test_67890", order_id: "order_test_12345", status: "captured", amount: 10000, currency: "INR"}) } }) }));
vi.mock("@/lib/db", () => ({
  prisma: {
    notificationOutbox: { upsert: vi.fn() },
    user: { findUnique: vi.fn().mockResolvedValue(null) },
    payment: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    booking: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    bookingAssignment: {
      updateMany: vi.fn().mockResolvedValue({count: 1}),
    },
    $transaction: vi.fn(async function (this: any, cb: any) { return cb(this); }),
  },
}));

describe("Phase 5 Payments & Signature Replay Remediation", () => {
  const secret = "test_secret_key_1234567890123456";
  const orderId = "order_test_12345";
  const paymentId = "pay_test_67890";
  const validSig = createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  beforeEach(() => {
    vi.clearAllMocks();
    (process.env as any).RAZORPAY_KEY_SECRET = secret;
  });

  it("rejects payment verification replay on terminal booking status (CUSTOMER_CANCELLED)", async () => {
    const { getCurrentIdentity } = await import("@/modules/auth/session");
    const { prisma } = await import("@/lib/db");

    vi.mocked(getCurrentIdentity).mockResolvedValueOnce({
      id: "cust-1",
      displayName: "Customer",
      status: "ACTIVE",
      roles: ["CUSTOMER"],
    } as any);

    vi.mocked(prisma.payment.findFirst).mockResolvedValueOnce({
      id: "pay-rec-1",
      status: "PENDING",
      bookingId: "b-1",
      booking: {
        id: "b-1",
        status: "CUSTOMER_CANCELLED",
      },
    } as any);

    const req = new Request("http://localhost:3000/api/payments/verify", {
      method: "POST",
      body: JSON.stringify({
        orderId,
        paymentId,
        signature: validSig,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toBe("terminal_state");
    expect(prisma.payment.update).not.toHaveBeenCalled();
    expect(prisma.booking.update).not.toHaveBeenCalled();
  });

  it("rejects payment verification replay on terminal payment status (REFUNDED)", async () => {
    const { getCurrentIdentity } = await import("@/modules/auth/session");
    const { prisma } = await import("@/lib/db");

    vi.mocked(getCurrentIdentity).mockResolvedValueOnce({
      id: "cust-1",
      displayName: "Customer",
      status: "ACTIVE",
      roles: ["CUSTOMER"],
    } as any);

    vi.mocked(prisma.payment.findFirst).mockResolvedValueOnce({
      id: "pay-rec-1",
      status: "REFUNDED",
      bookingId: "b-1",
      booking: {
        id: "b-1",
        status: "PAYMENT_PENDING",
      },
    } as any);

    const req = new Request("http://localhost:3000/api/payments/verify", {
      method: "POST",
      body: JSON.stringify({
        orderId,
        paymentId,
        signature: validSig,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toBe("terminal_state");
    expect(prisma.payment.update).not.toHaveBeenCalled();
    expect(prisma.booking.update).not.toHaveBeenCalled();
  });

  it("successfully transitions non-terminal payment and booking to CAPTURED and CONFIRMED", async () => {
    const { getCurrentIdentity } = await import("@/modules/auth/session");
    const { prisma } = await import("@/lib/db");

    vi.mocked(getCurrentIdentity).mockResolvedValueOnce({
      id: "cust-1",
      displayName: "Customer",
      status: "ACTIVE",
      roles: ["CUSTOMER"],
    } as any);

    vi.mocked(prisma.payment.findFirst).mockResolvedValue({
      id: "pay-rec-1",
      status: "PENDING",
      bookingId: "b-1",
      amountPaise: 10000,
      currency: "INR",
      booking: {
        id: "b-1",
        status: "PAYMENT_PENDING",
        quoteAmountPaise: 10000,
        currency: "INR",
      },
    } as any);

    const req = new Request("http://localhost:3000/api/payments/verify", {
      method: "POST",
      body: JSON.stringify({
        orderId,
        paymentId,
        signature: validSig,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.verified).toBe(true);
    expect(prisma.payment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "pay-rec-1", status: "PENDING" },
        data: expect.objectContaining({ status: "CAPTURED" }),
      })
    );
    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "b-1", status: "PAYMENT_PENDING" },
        data: expect.objectContaining({ status: "CONFIRMED" }),
      })
    );
  });
});
