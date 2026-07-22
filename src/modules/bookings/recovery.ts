import { Prisma, type Role } from "@prisma/client";

import { prisma } from "@/lib/db";
import { canTransitionBooking, type BookingStatus } from "@/modules/bookings/state-machine";

type RecoveryActor = { id: string; roles: Role[] };

export async function markSitterNoShow(bookingId: string, actor: RecoveryActor, reason: string) {
  if (!actor.roles.some((role) => role === "OPERATIONS_ADMIN" || role === "SUPER_ADMIN")) throw new BookingRecoveryError(403, "forbidden", "Operations authority is required.");
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        reference: true,
        status: true,
        scheduledStart: true,
        customerId: true,
        capacityReservation: { select: { status: true } },
        assignments: { where: { status: { in: ["CUSTOMER_APPROVED", "ACTIVE"] } }, orderBy: { offeredAt: "desc" }, take: 1, select: { id: true, sitterId: true, sitter: { select: { userId: true } } } }
      }
    });
    if (!booking) throw new BookingRecoveryError(404, "booking_not_found", "The booking does not exist.");
    if (booking.scheduledStart > new Date()) throw new BookingRecoveryError(409, "service_not_due", "A no-show cannot be recorded before the scheduled service start.");
    if (!canTransitionBooking(booking.status as BookingStatus, "NO_SHOW")) throw new BookingRecoveryError(409, "no_show_not_available", "A no-show cannot be recorded from this booking state.");
    const assignment = booking.assignments[0];
    if (!assignment) throw new BookingRecoveryError(409, "active_assignment_missing", "No active Saathi assignment is available to mark as a no-show.");
    if (booking.capacityReservation?.status !== "HELD") throw new BookingRecoveryError(409, "capacity_hold_missing", "Replacement recovery requires the original held capacity reservation.");

    await tx.bookingAssignment.update({ where: { id: assignment.id }, data: { status: "NO_SHOW" } });
    await tx.booking.update({ where: { id: booking.id }, data: { status: "NO_SHOW", statusHistory: { create: { fromState: booking.status, toState: "NO_SHOW", actorId: actor.id, reason, metadata: { assignmentId: assignment.id } } } } });
    await tx.booking.update({ where: { id: booking.id }, data: { status: "REPLACEMENT_REQUIRED", statusHistory: { create: { fromState: "NO_SHOW", toState: "REPLACEMENT_REQUIRED", actorId: actor.id, reason: "Approved replacement search opened after recorded no-show", metadata: { assignmentId: assignment.id } } } } });
    await tx.serviceEvent.create({ data: { bookingId: booking.id, actorId: actor.id, type: "SITTER_NO_SHOW", notes: reason } });
    await tx.auditLog.create({ data: { actorId: actor.id, actorRole: actor.roles.includes("SUPER_ADMIN") ? "SUPER_ADMIN" : "OPERATIONS_ADMIN", action: "booking.sitter_no_show", resourceType: "booking", resourceId: booking.id, before: { status: booking.status, assignmentStatus: "CUSTOMER_APPROVED" }, after: { status: "REPLACEMENT_REQUIRED", assignmentStatus: "NO_SHOW", capacityReservation: "HELD" }, reason } });
    await queueRecoveryNotification(tx, booking.customerId, "booking.replacement_required", { bookingId: booking.id, bookingReference: booking.reference, reason: "SITTER_NO_SHOW" }, `replacement-no-show:${booking.id}:customer`);
    await queueRecoveryNotification(tx, assignment.sitter.userId, "assignment.no_show_recorded", { bookingId: booking.id, bookingReference: booking.reference, reason }, `replacement-no-show:${booking.id}:sitter`);
    await queueRecoveryNotification(tx, undefined, "booking.replacement_required", { bookingId: booking.id, bookingReference: booking.reference, reason: "SITTER_NO_SHOW" }, `replacement-no-show:${booking.id}:operations`, "operations-queue");
    return { bookingId: booking.id, status: "REPLACEMENT_REQUIRED" as const, assignmentId: assignment.id, assignmentStatus: "NO_SHOW" as const, capacityRetained: true };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, maxWait: 5_000, timeout: 15_000 });
}

export async function cancelConfirmedAssignment(assignmentId: string, sitterUserId: string, reason: string) {
  return prisma.$transaction(async (tx) => {
    const assignment = await tx.bookingAssignment.findFirst({
      where: { id: assignmentId, sitter: { userId: sitterUserId } },
      include: { sitter: { select: { userId: true } }, booking: { select: { id: true, reference: true, status: true, customerId: true, capacityReservation: { select: { status: true } } } } }
    });
    if (!assignment) throw new BookingRecoveryError(404, "assignment_not_found", "The assignment does not exist.");
    if (assignment.status !== "CUSTOMER_APPROVED" || assignment.booking.status !== "CONFIRMED") throw new BookingRecoveryError(409, "cancellation_not_available", "Once travel or care begins, contact operations and use the incident workflow where needed.");
    if (assignment.booking.capacityReservation?.status !== "HELD") throw new BookingRecoveryError(409, "capacity_hold_missing", "Replacement recovery requires the original held capacity reservation.");

    await tx.bookingAssignment.update({ where: { id: assignment.id }, data: { status: "CANCELLED" } });
    await tx.booking.update({ where: { id: assignment.booking.id }, data: { status: "SITTER_CANCELLED", statusHistory: { create: { fromState: "CONFIRMED", toState: "SITTER_CANCELLED", actorId: sitterUserId, reason, metadata: { assignmentId: assignment.id } } } } });
    await tx.booking.update({ where: { id: assignment.booking.id }, data: { status: "REPLACEMENT_REQUIRED", statusHistory: { create: { fromState: "SITTER_CANCELLED", toState: "REPLACEMENT_REQUIRED", actorId: sitterUserId, reason: "Replacement search opened after Saathi cancellation", metadata: { assignmentId: assignment.id } } } } });
    await tx.auditLog.create({ data: { actorId: sitterUserId, actorRole: "SITTER", action: "booking.sitter_cancelled", resourceType: "booking", resourceId: assignment.booking.id, before: { status: "CONFIRMED", assignmentStatus: assignment.status }, after: { status: "REPLACEMENT_REQUIRED", assignmentStatus: "CANCELLED", capacityReservation: "HELD" }, reason } });
    await queueRecoveryNotification(tx, assignment.booking.customerId, "booking.replacement_required", { bookingId: assignment.booking.id, bookingReference: assignment.booking.reference, reason: "SITTER_CANCELLED" }, `replacement-cancel:${assignment.booking.id}:customer`);
    await queueRecoveryNotification(tx, undefined, "booking.replacement_required", { bookingId: assignment.booking.id, bookingReference: assignment.booking.reference, reason: "SITTER_CANCELLED" }, `replacement-cancel:${assignment.booking.id}:operations`, "operations-queue");
    return { bookingId: assignment.booking.id, status: "REPLACEMENT_REQUIRED" as const, capacityRetained: true };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, maxWait: 5_000, timeout: 15_000 });
}

async function queueRecoveryNotification(tx: Prisma.TransactionClient, userId: string | undefined, templateKey: string, payload: Prisma.InputJsonObject, idempotencyKey: string, destination = userId) {
  if (!destination) return;
  await tx.notificationOutbox.create({ data: { userId, channel: "IN_APP", templateKey, destination, payload, idempotencyKey } });
}

export class BookingRecoveryError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) { super(message); }
}
