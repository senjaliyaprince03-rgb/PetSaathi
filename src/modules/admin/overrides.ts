import { Prisma, Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import { canTransitionBooking, type BookingStatus } from "@/modules/bookings/state-machine";

export interface AdminActor {
  id: string;
  roles: Role[];
}

export class AdminOverrideError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) {
    super(message);
    this.name = "AdminOverrideError";
  }
}

function verifyAdminAuthority(actor: AdminActor) {
  const allowedRoles: Role[] = ["SUPER_ADMIN", "OPERATIONS_ADMIN"];
  if (!actor.roles.some((r) => allowedRoles.includes(r))) {
    throw new AdminOverrideError(403, "forbidden", "Operations or Super Admin authority is required for this action.");
  }
}

/**
 * Force cancel any booking with explicit admin audit reason
 */
export async function forceCancelBooking(
  bookingId: string,
  actor: AdminActor,
  reason: string
) {
  verifyAdminAuthority(actor);

  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: { capacityReservation: true }
    });

    if (!booking) throw new AdminOverrideError(404, "booking_not_found", "Booking does not exist.");

    // Release capacity if held
    if (booking.capacityReservation && ["HELD", "CONFIRMED"].includes(booking.capacityReservation.status)) {
      await tx.capacityLimit.updateMany({
        where: { id: booking.capacityReservation.capacityLimitId, reserved: { gte: booking.capacityReservation.quantity } },
        data: { reserved: { decrement: booking.capacityReservation.quantity } }
      });
      await tx.capacityReservation.update({
        where: { id: booking.capacityReservation.id },
        data: { status: "RELEASED", releaseReason: `Admin force cancel: ${reason}`, releasedAt: new Date() }
      });
    }

    const updated = await tx.booking.update({
      where: { id: booking.id },
      data: {
        status: "DECLINED",
        statusHistory: {
          create: {
            fromState: booking.status,
            toState: "DECLINED",
            actorId: actor.id,
            reason: `Admin override: ${reason}`
          }
        }
      },
      select: { id: true, reference: true, status: true }
    });

    await tx.auditLog.create({
      data: {
        actorId: actor.id,
        actorRole: actor.roles.includes("SUPER_ADMIN") ? "SUPER_ADMIN" : "OPERATIONS_ADMIN",
        action: "admin.force_cancel_booking",
        resourceType: "booking",
        resourceId: booking.id,
        before: { status: booking.status },
        after: { status: "DECLINED" },
        reason
      }
    });

    return updated;
  });
}

/**
 * Reassign an active or requested booking to a replacement sitter
 */
export async function reassignSitter(
  bookingId: string,
  newSitterId: string,
  actor: AdminActor,
  reason: string
) {
  verifyAdminAuthority(actor);

  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: {
        assignments: { where: { status: { in: ["ACTIVE", "CUSTOMER_APPROVED", "OFFERED"] } } }
      }
    });

    if (!booking) throw new AdminOverrideError(404, "booking_not_found", "Booking does not exist.");

    const newSitter = await tx.sitterProfile.findUnique({
      where: { id: newSitterId },
      include: { user: { select: { status: true } } }
    });

    if (!newSitter || newSitter.status !== "APPROVED" || newSitter.user.status !== "ACTIVE") {
      throw new AdminOverrideError(400, "invalid_sitter", "Target replacement sitter is not active and approved.");
    }

    // Cancel current active assignment if any
    for (const curr of booking.assignments) {
      await tx.bookingAssignment.update({
        where: { id: curr.id },
        data: { status: "CANCELLED" }
      });
    }

    // Carry over payout from previous assignment or default to 30000 (300 INR)
    const previousPayoutPaise = booking.assignments[0]?.payoutPaise ?? 30000;

    // Create new assignment
    const newAssignment = await tx.bookingAssignment.create({
      data: {
        bookingId: booking.id,
        sitterId: newSitter.id,
        status: "CUSTOMER_APPROVED",
        payoutPaise: previousPayoutPaise
      }
    });

    await tx.auditLog.create({
      data: {
        actorId: actor.id,
        actorRole: actor.roles.includes("SUPER_ADMIN") ? "SUPER_ADMIN" : "OPERATIONS_ADMIN",
        action: "admin.reassign_sitter",
        resourceType: "booking",
        resourceId: booking.id,
        before: { assignmentIds: booking.assignments.map(a => a.id) },
        after: { newAssignmentId: newAssignment.id, newSitterId: newSitter.id },
        reason
      }
    });

    return { bookingId: booking.id, newAssignmentId: newAssignment.id, sitterId: newSitter.id };
  });
}

/**
 * Issue a manual override refund directly linked to a captured payment
 */
export async function issueManualRefund(
  paymentId: string,
  amountPaise: number,
  actor: AdminActor,
  reason: string
) {
  verifyAdminAuthority(actor);

  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { id: paymentId },
      include: { refunds: { where: { status: { in: ["REQUESTED", "APPROVED", "PROCESSING", "COMPLETED"] } } } }
    });

    if (!payment) throw new AdminOverrideError(404, "payment_not_found", "Payment record not found.");
    if (payment.status !== "CAPTURED" && payment.status !== "PARTIALLY_REFUNDED") {
      throw new AdminOverrideError(409, "invalid_payment_state", `Cannot refund payment with status ${payment.status}`);
    }

    const totalRefundedPaise = payment.refunds.reduce((sum, r) => sum + r.amountPaise, 0);
    if (totalRefundedPaise + amountPaise > payment.amountPaise) {
      throw new AdminOverrideError(400, "refund_exceeds_amount", `Requested refund ${amountPaise} exceeds remaining unrefunded balance ${payment.amountPaise - totalRefundedPaise}`);
    }

    const refund = await tx.refund.create({
      data: {
        paymentId: payment.id,
        amountPaise,
        reason: `Admin manual refund: ${reason}`,
        status: "APPROVED",
        requestedBy: actor.id,
        approvedBy: actor.id
      }
    });

    await tx.auditLog.create({
      data: {
        actorId: actor.id,
        actorRole: actor.roles.includes("SUPER_ADMIN") ? "SUPER_ADMIN" : "OPERATIONS_ADMIN",
        action: "admin.issue_manual_refund",
        resourceType: "refund",
        resourceId: refund.id,
        before: { totalRefundedPaise },
        after: { refundId: refund.id, amountPaise, newTotal: totalRefundedPaise + amountPaise },
        reason
      }
    });

    return refund;
  });
}
