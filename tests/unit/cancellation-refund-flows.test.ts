import { describe, it, expect, vi } from "vitest";
import {
  cancelConfirmedBookingWithRefund,
  abandonWalkIncident
} from "../../src/modules/bookings/cancel-booking";
import { prisma } from "../../src/lib/db";

vi.mock("@/lib/db", () => ({
  prisma: {
    $transaction: vi.fn(async (cb) => cb({
      booking: {
        findFirst: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn()
      },
      capacityLimit: {
        updateMany: vi.fn().mockResolvedValue({ count: 1 })
      },
      capacityReservation: {
        update: vi.fn().mockResolvedValue({})
      },
      entitlementConsumption: {
        findFirst: vi.fn().mockResolvedValue(null),
        delete: vi.fn()
      },
      refund: {
        create: vi.fn().mockResolvedValue({ id: "ref_123" })
      },
      serviceEvent: {
        create: vi.fn().mockResolvedValue({})
      },
      auditLog: {
        create: vi.fn().mockResolvedValue({})
      }
    }))
  }
}));

describe("Cancellation & Refund Flows (Task 7.1)", () => {
  const baseBooking = {
    id: "booking_abc123",
    reference: "BK-2026-TEST",
    customerId: "cust_123",
    status: "CONFIRMED",
    scheduledStart: new Date(Date.now() + 48 * 3600 * 1000),
    payments: [
      { id: "pay_123", amountPaise: 50000, status: "CAPTURED", createdAt: new Date() }
    ],
    capacityReservation: {
      id: "cap_res_1",
      capacityLimitId: "cap_lim_1",
      quantity: 1,
      status: "HELD"
    }
  };

  it("calculates 100% full refund when cancelled > 24 hours prior to service", async () => {
    const txMock = {
      booking: {
        findFirst: vi.fn().mockResolvedValue(baseBooking),
        update: vi.fn().mockResolvedValue({
          id: baseBooking.id,
          reference: baseBooking.reference,
          status: "CUSTOMER_CANCELLED"
        })
      },
      capacityLimit: { updateMany: vi.fn().mockResolvedValue({ count: 1 }) },
      capacityReservation: { update: vi.fn().mockResolvedValue({}) },
      refund: { create: vi.fn().mockResolvedValue({ id: "ref_100_percent" }) },
      auditLog: { create: vi.fn().mockResolvedValue({}) }
    };

    (prisma.$transaction as any).mockImplementationOnce(async (cb: any) => cb(txMock));

    const now = new Date();
    const result = await cancelConfirmedBookingWithRefund(
      baseBooking.id,
      baseBooking.customerId,
      "Trip cancelled",
      now
    );

    expect(result.refundAmountPaise).toBe(50000);
    expect(result.policyTier).toBe("GREATER_THAN_24_HOURS");
    expect(result.refundId).toBe("ref_100_percent");
    expect(txMock.refund.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        amountPaise: 50000,
        status: "REQUESTED"
      })
    }));
  });

  it("calculates 50% partial refund when cancelled between 4 and 24 hours prior", async () => {
    const startIn10h = new Date(Date.now() + 10 * 3600 * 1000);
    const midBooking = { ...baseBooking, scheduledStart: startIn10h };

    const txMock = {
      booking: {
        findFirst: vi.fn().mockResolvedValue(midBooking),
        update: vi.fn().mockResolvedValue({
          id: midBooking.id,
          reference: midBooking.reference,
          status: "CUSTOMER_CANCELLED"
        })
      },
      capacityLimit: { updateMany: vi.fn().mockResolvedValue({ count: 1 }) },
      capacityReservation: { update: vi.fn().mockResolvedValue({}) },
      refund: { create: vi.fn().mockResolvedValue({ id: "ref_50_percent" }) },
      auditLog: { create: vi.fn().mockResolvedValue({}) }
    };

    (prisma.$transaction as any).mockImplementationOnce(async (cb: any) => cb(txMock));

    const now = new Date();
    const result = await cancelConfirmedBookingWithRefund(
      midBooking.id,
      midBooking.customerId,
      "Emergency at home",
      now
    );

    expect(result.refundAmountPaise).toBe(25000);
    expect(result.policyTier).toBe("4_TO_24_HOURS");
    expect(result.refundId).toBe("ref_50_percent");
  });

  it("calculates 0% refund and does not create refund record when < 4 hours prior", async () => {
    const startIn2h = new Date(Date.now() + 2 * 3600 * 1000);
    const lateBooking = { ...baseBooking, scheduledStart: startIn2h };

    const txMock = {
      booking: {
        findFirst: vi.fn().mockResolvedValue(lateBooking),
        update: vi.fn().mockResolvedValue({
          id: lateBooking.id,
          reference: lateBooking.reference,
          status: "CUSTOMER_CANCELLED"
        })
      },
      capacityLimit: { updateMany: vi.fn().mockResolvedValue({ count: 1 }) },
      capacityReservation: { update: vi.fn().mockResolvedValue({}) },
      refund: { create: vi.fn() },
      auditLog: { create: vi.fn().mockResolvedValue({}) }
    };

    (prisma.$transaction as any).mockImplementationOnce(async (cb: any) => cb(txMock));

    const now = new Date();
    const result = await cancelConfirmedBookingWithRefund(
      lateBooking.id,
      lateBooking.customerId,
      "Last minute change",
      now
    );

    expect(result.refundAmountPaise).toBe(0);
    expect(result.policyTier).toBe("LESS_THAN_4_HOURS");
    expect(result.refundId).toBeNull();
    expect(txMock.refund.create).not.toHaveBeenCalled();
  });

  it("handles walk abandonment due to incident and transitions booking to INCIDENT_HOLD", async () => {
    const inProgressBooking = {
      ...baseBooking,
      status: "IN_PROGRESS"
    };

    const txMock = {
      booking: {
        findUnique: vi.fn().mockResolvedValue(inProgressBooking),
        update: vi.fn().mockResolvedValue({
          id: inProgressBooking.id,
          reference: inProgressBooking.reference,
          status: "INCIDENT_HOLD"
        })
      },
      serviceEvent: { create: vi.fn().mockResolvedValue({ id: "evt_1" }) },
      auditLog: { create: vi.fn().mockResolvedValue({ id: "audit_1" }) }
    };

    (prisma.$transaction as any).mockImplementationOnce(async (cb: any) => cb(txMock));

    const result = await abandonWalkIncident(
      inProgressBooking.id,
      "sitter_123",
      "SITTER",
      "Sudden thunderstorm, pet showed severe panic"
    );

    expect(result.status).toBe("INCIDENT_HOLD");
    expect(txMock.serviceEvent.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        type: "SAFETY_INCIDENT",
        notes: "Sudden thunderstorm, pet showed severe panic"
      })
    }));
    expect(txMock.auditLog.create).toHaveBeenCalled();
  });
});
