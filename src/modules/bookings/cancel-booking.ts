import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { canTransitionBooking, type BookingStatus } from "@/modules/bookings/state-machine";

const financiallyCommitted = ["AUTHORIZED", "CAPTURED", "PARTIALLY_REFUNDED", "REFUNDED", "DISPUTED"] as const;

export async function cancelBookingBeforePayment(bookingId: string, customerId: string, reason: string) {
  return prisma.$transaction(async (tx) => {
    const current = await tx.booking.findFirst({
      where: { id: bookingId, customerId },
      select: { id: true, status: true, payments: { select: { status: true } }, capacityReservation: { select: { id: true, capacityLimitId: true, quantity: true, status: true } } }
    });
    if (!current) throw new CancellationError(404, "booking_not_found", "The booking is unavailable.");
    if (!canTransitionBooking(current.status as BookingStatus, "CUSTOMER_CANCELLED")) throw new CancellationError(409, "cancellation_not_allowed", "This booking can no longer be cancelled online. Contact support for a reviewed resolution.");
    if (current.payments.some(({ status }) => financiallyCommitted.includes(status as typeof financiallyCommitted[number]))) throw new CancellationError(409, "refund_review_required", "A payment is already financially committed. Open a support case so cancellation and refund policy can be reviewed together.");
    if (!current.capacityReservation || !["HELD", "CONFIRMED"].includes(current.capacityReservation.status)) throw new CancellationError(409, "capacity_release_failed", "The capacity reservation is not releasable. No booking status was changed.");

    const entitlementConsumption = await tx.entitlementConsumption.findFirst({ where: { bookingId: current.id } });

    const released = await tx.capacityLimit.updateMany({
      where: { id: current.capacityReservation.capacityLimitId, reserved: { gte: current.capacityReservation.quantity } },
      data: { reserved: { decrement: current.capacityReservation.quantity } },
    });
    if (released.count !== 1) throw new CancellationError(409, "capacity_release_failed", "Capacity could not be released consistently. No booking status was changed.");

    const now = new Date();
    await tx.capacityReservation.update({ where: { id: current.capacityReservation.id }, data: { status: "RELEASED", releaseReason: reason, releasedAt: now } });
    const updated = await tx.booking.update({ where: { id: current.id }, data: { status: "CUSTOMER_CANCELLED", statusHistory: { create: { fromState: current.status, toState: "CUSTOMER_CANCELLED", actorId: customerId, reason } } }, select: { id: true, reference: true, status: true } });

    if (entitlementConsumption) {
      const latest = await tx.entitlementLedger.findFirst({
        where: { subscriptionId: entitlementConsumption.subscriptionId, entitlementKey: entitlementConsumption.entitlementKey },
        orderBy: { createdAt: "desc" },
        select: { balanceAfter: true }
      });
      await tx.entitlementLedger.create({
        data: {
          subscriptionId: entitlementConsumption.subscriptionId,
          entitlementKey: entitlementConsumption.entitlementKey,
          delta: entitlementConsumption.quantity,
          balanceAfter: (latest?.balanceAfter ?? 0) + entitlementConsumption.quantity,
          reason: `Refunded for cancelled booking ${current.id}`,
          referenceType: "cancellation",
          referenceId: current.id
        }
      });
      await tx.entitlementConsumption.delete({ where: { id: entitlementConsumption.id } });
    }

    await tx.auditLog.create({ data: { actorId: customerId, actorRole: "CUSTOMER", action: "booking.customer_cancelled", resourceType: "booking", resourceId: current.id, before: { status: current.status }, after: { status: updated.status, capacityReservation: "RELEASED", entitlementRefunded: !!entitlementConsumption }, reason } });
    return updated;
  }, { maxWait: 5_000, timeout: 15_000 });
}

export class CancellationError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) { super(message); }
}
