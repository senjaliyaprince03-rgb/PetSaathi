import { Prisma, type Role } from "@prisma/client";

import { prisma } from "@/lib/db";
import { canTransitionReportReview, reviewTarget, type reportReviewInputSchema } from "@/modules/reports/review";
import type { z } from "zod";

type ReviewInput = z.infer<typeof reportReviewInputSchema>;

export async function reviewBookingReport(reportId: string, reviewer: { id: string; roles: readonly Role[] }, input: ReviewInput) {
  const toState = reviewTarget(input.action);
  return prisma.$transaction(async (tx) => {
    const report = await tx.bookingReport.findUnique({
      where: { id: reportId },
      include: {
        booking: {
          select: {
            id: true, reference: true, customerId: true, status: true,
            reports: { orderBy: { version: "desc" }, take: 1, select: { id: true } },
            incidents: { where: { status: { not: "CLOSED" } }, select: { id: true } },
            capacityReservation: { select: { id: true, status: true } },
            assignments: { where: { status: "COMPLETED" }, orderBy: { completedAt: "desc" }, take: 1, select: { sitter: { select: { userId: true } } } }
          }
        }
      }
    });
    if (!report) throw new ReportReviewError(404, "report_not_found", "The report does not exist.");
    if (report.booking.reports[0]?.id !== report.id) throw new ReportReviewError(409, "stale_report_version", "Only the latest report version can be reviewed.");
    if (!canTransitionReportReview(report.reviewStatus, toState)) throw new ReportReviewError(409, "invalid_report_transition", "This report review decision is no longer available.");
    if (report.booking.status !== "COMPLETED") throw new ReportReviewError(409, "booking_not_completed", "Report review requires a completed booking.");
    if (toState === "APPROVED" && report.booking.incidents.length) throw new ReportReviewError(409, "incident_open", "Close every incident before approving the final report.");
    if (toState === "APPROVED" && report.concernFlag && !reviewer.roles.some((role) => role === "SAFETY_ADMIN" || role === "SUPER_ADMIN")) throw new ReportReviewError(403, "safety_approval_required", "A safety administrator must approve a concern-flagged report.");

    const actorRole: Role = reviewer.roles.includes("SUPER_ADMIN") ? "SUPER_ADMIN" : reviewer.roles.includes("SAFETY_ADMIN") ? "SAFETY_ADMIN" : "OPERATIONS_ADMIN";
    const updated = await tx.bookingReport.update({ where: { id: report.id }, data: { reviewStatus: toState, reviewedBy: reviewer.id, reviewedAt: new Date(), reviewNote: input.note } });
    const sitterUserId = report.booking.assignments[0]?.sitter.userId;

    if (toState === "APPROVED") {
      if (!report.booking.capacityReservation || report.booking.capacityReservation.status !== "HELD") throw new ReportReviewError(409, "capacity_hold_missing", "The booking capacity hold cannot be consumed safely.");
      await tx.capacityReservation.update({ where: { id: report.booking.capacityReservation.id }, data: { status: "CONSUMED" } });
      await tx.booking.update({ where: { id: report.booking.id }, data: { status: "CLOSED", statusHistory: { create: { fromState: "COMPLETED", toState: "CLOSED", actorId: reviewer.id, reason: `Report v${report.version} approved` } } } });
      await tx.notificationOutbox.create({ data: { userId: report.booking.customerId, channel: "IN_APP", templateKey: "booking.closed", destination: report.booking.customerId, payload: { bookingId: report.booking.id, reference: report.booking.reference, reportId: report.id }, idempotencyKey: `booking-closed:${report.booking.id}:${report.id}` } });
      await tx.notificationOutbox.upsert({
        where: { idempotencyKey: `testimonial-request:${report.booking.id}` },
        update: {},
        create: {
          userId: report.booking.customerId,
          channel: "IN_APP",
          templateKey: "testimonial.request",
          destination: report.booking.customerId,
          payload: {
            bookingId: report.booking.id,
            bookingReference: report.booking.reference,
          },
          idempotencyKey: `testimonial-request:${report.booking.id}`,
        },
      });
      if (sitterUserId) await tx.notificationOutbox.create({ data: { userId: sitterUserId, channel: "IN_APP", templateKey: "report.approved", destination: sitterUserId, payload: { bookingId: report.booking.id, reference: report.booking.reference, reportId: report.id }, idempotencyKey: `report-approved:${report.id}:${sitterUserId}` } });
    } else {
      await tx.payout.updateMany({ where: { bookingId: report.booking.id, status: { in: ["PENDING", "APPROVED", "PROCESSING", "FAILED"] } }, data: { status: "HELD" } });
      if (sitterUserId) await tx.notificationOutbox.create({ data: { userId: sitterUserId, channel: "IN_APP", templateKey: toState === "CORRECTION_REQUIRED" ? "report.correction_required" : "report.escalated", destination: sitterUserId, payload: { bookingId: report.booking.id, reference: report.booking.reference, reportId: report.id, note: input.note }, idempotencyKey: `report-${toState.toLowerCase()}:${report.id}:${sitterUserId}` } });
      if (toState === "ESCALATED") await tx.notificationOutbox.create({ data: { channel: "IN_APP", templateKey: "report.escalated", destination: "safety-queue", payload: { bookingId: report.booking.id, reference: report.booking.reference, reportId: report.id, note: input.note }, idempotencyKey: `report-escalated:${report.id}:safety` } });
    }

    await tx.auditLog.create({ data: { actorId: reviewer.id, actorRole, action: `booking_report.${toState.toLowerCase()}`, resourceType: "booking_report", resourceId: report.id, before: { reviewStatus: report.reviewStatus, bookingStatus: report.booking.status }, after: { reviewStatus: updated.reviewStatus, bookingStatus: toState === "APPROVED" ? "CLOSED" : report.booking.status }, reason: input.note } });
    return { report: { id: updated.id, reviewStatus: updated.reviewStatus }, bookingStatus: toState === "APPROVED" ? "CLOSED" : report.booking.status };
  }, { maxWait: 5_000, timeout: 15_000 });
}

export class ReportReviewError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) { super(message); }
}
