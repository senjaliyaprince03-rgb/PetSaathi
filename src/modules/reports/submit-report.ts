import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import type { BookingReportInput } from "@/modules/reports/input";

export async function submitBookingReport(assignmentId: string, sitterUserId: string, input: BookingReportInput) {
  return prisma.$transaction(async (tx) => {
    const assignment = await tx.bookingAssignment.findFirst({
      where: { id: assignmentId, sitter: { userId: sitterUserId } },
      include: { booking: { select: { id: true, reference: true, customerId: true, status: true, reports: { select: { id: true, version: true, reviewStatus: true }, orderBy: { version: "desc" }, take: 1 } } } }
    });
    if (!assignment) throw new ReportSubmissionError(404, "not_found", "The assignment does not exist.");
    const latest = assignment.booking.reports[0];
    const initialSubmission = assignment.status === "ACTIVE" && assignment.booking.status === "REPORT_PENDING" && !latest;
    const correctionSubmission = assignment.status === "COMPLETED" && assignment.booking.status === "COMPLETED" && latest?.reviewStatus === "CORRECTION_REQUIRED";
    if (!initialSubmission && !correctionSubmission) throw new ReportSubmissionError(409, "report_not_available", "A report is not available in the current assignment state.");

    const version = (latest?.version ?? 0) + 1;
    const created = await tx.bookingReport.create({ data: { bookingId: assignment.booking.id, submittedBy: sitterUserId, version, fields: input, concernFlag: input.concernFlag, reviewStatus: "PENDING" } });
    if (initialSubmission) {
      await tx.bookingAssignment.update({ where: { id: assignment.id }, data: { status: "COMPLETED", completedAt: new Date() } });
      await tx.booking.update({ where: { id: assignment.booking.id }, data: { status: "COMPLETED", statusHistory: { create: { fromState: "REPORT_PENDING", toState: "COMPLETED", actorId: sitterUserId, reason: "Structured care report submitted" } } } });
      await tx.payout.upsert({ where: { bookingId_sitterId: { bookingId: assignment.booking.id, sitterId: assignment.sitterId } }, create: { bookingId: assignment.booking.id, sitterId: assignment.sitterId, amountPaise: assignment.payoutPaise, status: input.concernFlag ? "HELD" : "PENDING" }, update: {} });
    }
    await tx.notificationOutbox.create({ data: { userId: assignment.booking.customerId, channel: "IN_APP", templateKey: correctionSubmission ? "report.updated" : "report.ready", destination: assignment.booking.customerId, payload: { bookingId: assignment.booking.id, reference: assignment.booking.reference, reportId: created.id, version }, idempotencyKey: `report-ready:${created.id}:${assignment.booking.customerId}` } });
    await tx.notificationOutbox.create({ data: { channel: "IN_APP", templateKey: correctionSubmission ? "report.resubmitted" : "report.review_pending", destination: "operations-queue", payload: { bookingId: assignment.booking.id, reference: assignment.booking.reference, reportId: created.id, version, concernFlag: input.concernFlag }, idempotencyKey: `report-review:${created.id}:operations` } });
    if (input.concernFlag) await tx.notificationOutbox.create({ data: { channel: "IN_APP", templateKey: "report.concern", destination: "safety-queue", payload: { bookingId: assignment.booking.id, reportId: created.id, version }, idempotencyKey: `report-concern:${created.id}:safety` } });
    return created;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, maxWait: 5_000, timeout: 15_000 });
}

export class ReportSubmissionError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) { super(message); }
}
