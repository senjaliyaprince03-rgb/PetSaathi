import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

export async function approveCustomerAssignment(bookingId: string, assignmentId: string, customerId: string) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findFirst({
      where: { id: bookingId, customerId },
      select: {
        id: true,
        reference: true,
        status: true,
        payments: { where: { status: "CAPTURED", signatureVerified: true }, take: 1, select: { id: true } },
        assignments: { where: { id: assignmentId }, select: { id: true, status: true, type: true, sitter: { select: { userId: true } } } }
      }
    });
    const assignment = booking?.assignments[0];
    if (!booking || !assignment) throw new AssignmentApprovalError(404, "assignment_not_found", "The assignment does not exist for this booking.");
    if (booking.status !== "CUSTOMER_APPROVAL_PENDING" || assignment.status !== "ACCEPTED") throw new AssignmentApprovalError(409, "invalid_state", "This assignment is no longer available for approval.");
    const replacement = assignment.type === "REPLACEMENT";
    if (replacement && booking.payments.length === 0) throw new AssignmentApprovalError(409, "replacement_payment_missing", "The original captured payment could not be verified. No second payment is allowed; operations must reconcile the booking.");
    const nextState = replacement ? "CONFIRMED" : "PAYMENT_PENDING";

    await tx.bookingAssignment.update({ where: { id: assignment.id }, data: { status: "CUSTOMER_APPROVED" } });
    await tx.booking.update({ where: { id: booking.id }, data: { status: nextState, customerApprovedAt: new Date(), statusHistory: { create: { fromState: "CUSTOMER_APPROVAL_PENDING", toState: nextState, actorId: customerId, reason: replacement ? "Customer approved replacement Saathi; original captured payment retained" : "Customer approved proposed Saathi" } } } });
    await tx.auditLog.create({ data: { actorId: customerId, actorRole: "CUSTOMER", action: replacement ? "booking.replacement_approved" : "booking.assignment_approved", resourceType: "booking_assignment", resourceId: assignment.id, before: { assignmentStatus: assignment.status, bookingStatus: booking.status }, after: { assignmentStatus: "CUSTOMER_APPROVED", bookingStatus: nextState, paymentReused: replacement }, reason: replacement ? "Customer approved replacement without a second charge" : "Customer approved proposed Saathi" } });
    await tx.notificationOutbox.create({ data: { userId: assignment.sitter.userId, channel: "IN_APP", templateKey: replacement ? "assignment.replacement_approved" : "assignment.customer_approved", destination: assignment.sitter.userId, payload: { bookingId: booking.id, bookingReference: booking.reference, assignmentId: assignment.id, bookingStatus: nextState }, idempotencyKey: `assignment-customer-approved:${assignment.id}` } });
    return { approved: true as const, next: replacement ? "confirmed" as const : "payment" as const, paymentReused: replacement, bookingStatus: nextState };
  }, { maxWait: 5_000, timeout: 15_000 });
}

export class AssignmentApprovalError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) { super(message); }
}
