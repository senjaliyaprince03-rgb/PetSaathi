import { describe, it, expect, vi } from "vitest";
import { handlePaymentFailureRetry, MAX_PAYMENT_ATTEMPTS } from "../../src/modules/payments/retry-handler";
import { prisma } from "../../src/lib/db";

vi.mock("@/lib/db", () => ({
  prisma: {
    $transaction: vi.fn(async (cb) => cb({
      booking: {
        findUnique: vi.fn(),
        update: vi.fn()
      },
      capacityLimit: {
        updateMany: vi.fn().mockResolvedValue({ count: 1 })
      },
      capacityReservation: {
        update: vi.fn().mockResolvedValue({})
      },
      notificationOutbox: {
        upsert: vi.fn().mockResolvedValue({})
      }
    }))
  }
}));

describe("Payment Failure Webhook & 3-Attempt Auto-Cancel (Task 7.2)", () => {
  const baseBooking = {
    id: "booking_retry_123",
    reference: "BK-RETRY-01",
    customerId: "cust_retry_1",
    status: "PAYMENT_PENDING",
    payments: [] as Array<{ id: string; status: string }>,
    capacityReservation: {
      id: "cap_res_retry",
      capacityLimitId: "cap_lim_retry",
      quantity: 1,
      status: "HELD"
    }
  };

  it("prompts for retry when payment attempts are below limit (attempt 1 of 3)", async () => {
    const bookingWith1Fail = {
      ...baseBooking,
      payments: [{ id: "pay_fail_1", status: "FAILED" }]
    };

    const txMock = {
      booking: {
        findUnique: vi.fn().mockResolvedValue(bookingWith1Fail),
        update: vi.fn()
      },
      capacityLimit: { updateMany: vi.fn() },
      capacityReservation: { update: vi.fn() },
      notificationOutbox: { upsert: vi.fn().mockResolvedValue({}) }
    };

    (prisma.$transaction as any).mockImplementationOnce(async (cb: any) => cb(txMock));

    const result = await handlePaymentFailureRetry(
      bookingWith1Fail.id,
      "BAD_REQUEST_ERROR",
      "Insufficient balance"
    );

    expect(result.action).toBe("RETRY_REQUESTED");
    expect(result.remainingAttempts).toBe(2);
    expect(txMock.booking.update).not.toHaveBeenCalled();
    expect(txMock.notificationOutbox.upsert).toHaveBeenCalledWith(expect.objectContaining({
      create: expect.objectContaining({
        templateKey: "booking.payment_retry_needed"
      })
    }));
  });

  it("auto-cancels booking and releases capacity when payment failures reach 3 attempts", async () => {
    const bookingWith3Fails = {
      ...baseBooking,
      payments: [
        { id: "pay_fail_1", status: "FAILED" },
        { id: "pay_fail_2", status: "FAILED" },
        { id: "pay_fail_3", status: "FAILED" }
      ]
    };

    const txMock = {
      booking: {
        findUnique: vi.fn().mockResolvedValue(bookingWith3Fails),
        update: vi.fn().mockResolvedValue({
          id: bookingWith3Fails.id,
          status: "DECLINED"
        })
      },
      capacityLimit: { updateMany: vi.fn().mockResolvedValue({ count: 1 }) },
      capacityReservation: { update: vi.fn().mockResolvedValue({}) },
      notificationOutbox: { upsert: vi.fn().mockResolvedValue({}) }
    };

    (prisma.$transaction as any).mockImplementationOnce(async (cb: any) => cb(txMock));

    const result = await handlePaymentFailureRetry(
      bookingWith3Fails.id,
      "GATEWAY_ERROR",
      "Bank system down"
    );

    expect(result.action).toBe("AUTO_CANCELLED");
    expect(result.attempts).toBe(3);
    expect(txMock.capacityLimit.updateMany).toHaveBeenCalled();
    expect(txMock.capacityReservation.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        status: "RELEASED"
      })
    }));
    expect(txMock.booking.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        status: "DECLINED"
      })
    }));
    expect(txMock.notificationOutbox.upsert).toHaveBeenCalledWith(expect.objectContaining({
      create: expect.objectContaining({
        templateKey: "booking.payment_exhausted"
      })
    }));
  });
});
