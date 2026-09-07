import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { canTransitionBooking, type BookingStatus } from "@/modules/bookings/state-machine";

const financiallyCommitted = ["AUTHORIZED", "CAPTURED", "PARTIALLY_REFUNDED", "REFUNDED", "DISPUTED"] as const;

export class CancellationError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) {
    super(message);
    this.name = "CancellationError";
  }
}

/**
 * Cancel a booking before payment has been captured
 */
export async function cancelBookingBeforePayment(bookingId: string, customerId: string, reason: string) {
  return prisma.$transaction(async (tx) => {
    const current = await tx.booking.findFirst({
      where: { id: bookingId, customerId },
      select: {
        id: true,
        status: true,
        payments: { select: { status: true } },
        capacityReservation: { select: { id: true, capacityLimitId: true, quantity: true, status: true } }
      }
    });
    if (!current) throw new CancellationError(404, "booking_not_found", "The booking is unavailable.");
    if (!canTransitionBooking(current.status as BookingStatus, "CUSTOMER_CANCELLED")) {
      throw new CancellationError(409, "cancellation_not_allowed", "This booking can no longer be cancelled online. Contact support for a reviewed resolution.");
    }
    if (current.payments.some(({ status }) => financiallyCommitted.includes(status as typeof financiallyCommitted[number]))) {
      throw new CancellationError(409, "refund_review_required", "A payment is already financially committed. Open a support case so cancellation and refund policy can be reviewed together.");
    }
    if (!current.capacityReservation || !["HELD", "CONFIRMED"].includes(current.capacityReservation.status)) {
      throw new CancellationError(409, "capacity_release_failed", "The capacity reservation is not releasable. No booking status was changed.");
    }

    const entitlementConsumption = await tx.entitlementConsumption.findFirst({ where: { bookingId: current.id } });

    const released = await tx.capacityLimit.updateMany({
      where: { id: current.capacityReservation.capacityLimitId, reserved: { gte: current.capacityReservation.quantity } },
      data: { reserved: { decrement: current.capacityReservation.quantity } },
    });
    if (released.count !== 1) throw new CancellationError(409, "capacity_release_failed", "Capacity could not be released consistently. No booking status was changed.");

    const now = new Date();
    await tx.capacityReservation.update({
      where: { id: current.capacityReservation.id },
      data: { status: "RELEASED", releaseReason: reason, releasedAt: now }
    });

    const updated = await tx.booking.update({
      where: { id: current.id },
      data: {
        status: "CUSTOMER_CANCELLED",
        statusHistory: {
          create: { fromState: current.status, toState: "CUSTOMER_CANCELLED", actorId: customerId, reason }
        }
      },
      select: { id: true, reference: true, status: true }
    });

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

    await tx.auditLog.create({
      data: {
        actorId: customerId,
        actorRole: "CUSTOMER",
        action: "booking.customer_cancelled",
        resourceType: "booking",
        resourceId: current.id,
        before: { status: current.status },
        after: { status: updated.status, capacityReservation: "RELEASED", entitlementRefunded: !!entitlementConsumption },
        reason
      }
    });

    return updated;
  }, { maxWait: 5_000, timeout: 15_000 });
}

/**
 * Cancel a confirmed booking after payment has been captured
 * Calculates refund based on Indian pet-care cancellation policy:
 * - > 24 hours before start: 100% full refund
 * - 4 to 24 hours before start: 50% partial refund
 * - < 4 hours before start: 0% refund (slot locked for sitter)
 */
export async function cancelConfirmedBookingWithRefund(
  bookingId: string,
  customerId: string,
  reason: string,
  now: Date = new Date()
) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findFirst({
      where: { id: bookingId, customerId },
      include: {
        payments: {
          where: { status: "CAPTURED" },
          orderBy: { createdAt: "desc" },
          take: 1
        },
        capacityReservation: true
      }
    });

    if (!booking) throw new CancellationError(404, "booking_not_found", "The booking is unavailable.");
    if (booking.status !== "CONFIRMED") {
      throw new CancellationError(409, "cancellation_not_allowed", `Booking status '${booking.status}' cannot be cancelled via confirmed refund flow.`);
    }

    const payment = booking.payments[0];
    if (!payment) {
      throw new CancellationError(409, "captured_payment_missing", "No captured payment found for confirmed booking.");
    }

    // Time difference in hours
    const diffHours = (booking.scheduledStart.getTime() - now.getTime()) / (1000 * 60 * 60);

    let refundRatio = 0.0;
    let policyTier = "LESS_THAN_4_HOURS";
    if (diffHours >= 24) {
      refundRatio = 1.0;
      policyTier = "GREATER_THAN_24_HOURS";
    } else if (diffHours >= 4) {
      refundRatio = 0.5;
      policyTier = "4_TO_24_HOURS";
    } else {
      refundRatio = 0.0;
      policyTier = "LESS_THAN_4_HOURS";
    }

    const refundAmountPaise = Math.round(payment.amountPaise * refundRatio);

    // Release capacity if held
    if (booking.capacityReservation && ["HELD", "CONFIRMED"].includes(booking.capacityReservation.status)) {
      await tx.capacityLimit.updateMany({
        where: { id: booking.capacityReservation.capacityLimitId, reserved: { gte: booking.capacityReservation.quantity } },
        data: { reserved: { decrement: booking.capacityReservation.quantity } }
      });
      await tx.capacityReservation.update({
        where: { id: booking.capacityReservation.id },
        data: { status: "RELEASED", releaseReason: reason, releasedAt: now }
      });
    }

    // Update booking state
    const updatedBooking = await tx.booking.update({
      where: { id: booking.id },
      data: {
        status: "CUSTOMER_CANCELLED",
        statusHistory: {
          create: {
            fromState: booking.status,
            toState: "CUSTOMER_CANCELLED",
            actorId: customerId,
            reason: `${reason} [Refund policy: ${policyTier}, ${refundAmountPaise / 100} INR]`
          }
        }
      },
      select: { id: true, reference: true, status: true }
    });

    let refundRecord = null;
    if (refundAmountPaise > 0) {
      refundRecord = await tx.refund.create({
        data: {
          paymentId: payment.id,
          amountPaise: refundAmountPaise,
          reason: `Customer cancellation (${policyTier}): ${reason}`,
          status: "REQUESTED",
          requestedBy: customerId
        }
      });
    }

    await tx.auditLog.create({
      data: {
        actorId: customerId,
        actorRole: "CUSTOMER",
        action: "booking.customer_cancelled_with_refund",
        resourceType: "booking",
        resourceId: booking.id,
        before: { status: booking.status },
        after: {
          status: updatedBooking.status,
          refundAmountPaise,
          policyTier,
          refundId: refundRecord?.id ?? null
        },
        reason
      }
    });

    return {
      booking: updatedBooking,
      refundAmountPaise,
      policyTier,
      refundId: refundRecord?.id ?? null
    };
  }, { maxWait: 5_000, timeout: 15_000 });
}

/**
 * Handle in-progress walk abandonment or safety emergency
 * Moves booking to INCIDENT_HOLD with zero penalty to pet parent, full capacity audit
 */
export async function abandonWalkIncident(
  bookingId: string,
  actorId: string,
  actorRole: "CUSTOMER" | "SITTER" | "OPERATIONS_ADMIN",
  incidentReason: string
) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: {
        payments: { where: { status: "CAPTURED" }, take: 1 }
      }
    });

    if (!booking) throw new CancellationError(404, "booking_not_found", "The booking is unavailable.");
    if (!["IN_PROGRESS", "SITTER_EN_ROUTE"].includes(booking.status)) {
      throw new CancellationError(409, "invalid_state", `Cannot record walk abandonment from status: ${booking.status}`);
    }

    const updated = await tx.booking.update({
      where: { id: booking.id },
      data: {
        status: "INCIDENT_HOLD",
        statusHistory: {
          create: {
            fromState: booking.status,
            toState: "INCIDENT_HOLD",
            actorId,
            reason: `Service abandoned due to incident: ${incidentReason}`
          }
        }
      },
      select: { id: true, reference: true, status: true }
    });

    await tx.serviceEvent.create({
      data: {
        bookingId: booking.id,
        actorId,
        type: "SAFETY_INCIDENT",
        notes: incidentReason
      }
    });

    await tx.auditLog.create({
      data: {
        actorId,
        actorRole,
        action: "booking.walk_abandoned_incident",
        resourceType: "booking",
        resourceId: booking.id,
        before: { status: booking.status },
        after: { status: "INCIDENT_HOLD" },
        reason: incidentReason
      }
    });

    return updated;
  }, { maxWait: 5_000, timeout: 15_000 });
}
