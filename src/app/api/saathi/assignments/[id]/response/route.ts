import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { sitterEligibility } from "@/modules/sitters/eligibility";

const responseSchema = z.object({ action: z.enum(["ACCEPT", "DECLINE"]) });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = responseSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 422 });
  const { id } = await context.params;

  const assignment = await prisma.bookingAssignment.findFirst({
    where: { id, sitter: { userId: identity.id } },
    include: { sitter: { select: { id: true, status: true, holds: { where: { status: "ACTIVE", OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] }, take: 1, select: { id: true } } } }, booking: { include: { pet: { select: { riskAssessments: { orderBy: { createdAt: "desc" }, take: 1, select: { finalLevel: true } } } }, serviceType: { select: { id: true } } } } }
  });
  if (!assignment) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (assignment.status !== "OFFERED" || assignment.booking.status !== "SITTER_PROPOSED") return NextResponse.json({ error: "offer_not_active" }, { status: 409 });
  if (assignment.responseDueAt && assignment.responseDueAt < new Date()) return NextResponse.json({ error: "offer_expired" }, { status: 409 });

  if (parsed.data.action === "DECLINE") {
    const declinedTo = assignment.type === "REPLACEMENT" ? "REPLACEMENT_REQUIRED" : "MATCHING";
    await prisma.$transaction([
      prisma.bookingAssignment.update({ where: { id: assignment.id }, data: { status: "DECLINED", respondedAt: new Date() } }),
      prisma.booking.update({ where: { id: assignment.bookingId }, data: { status: declinedTo, statusHistory: { create: { fromState: "SITTER_PROPOSED", toState: declinedTo, actorId: identity.id, reason: assignment.type === "REPLACEMENT" ? "Replacement Saathi declined offer" : "Saathi declined offer" } } } }),
      prisma.auditLog.create({ data: { actorId: identity.id, actorRole: "SITTER", action: "booking.assignment_declined", resourceType: "booking_assignment", resourceId: assignment.id, before: { status: assignment.status, bookingStatus: assignment.booking.status }, after: { status: "DECLINED", bookingStatus: declinedTo }, reason: "Saathi declined offer" } })
    ]);
    return NextResponse.json({ accepted: false });
  }

  const permission = await prisma.sitterServicePermission.findUnique({ where: { sitterId_serviceTypeId: { sitterId: assignment.sitter.id, serviceTypeId: assignment.booking.serviceType.id } } });
  if (!permission) return NextResponse.json({ error: "permission_missing" }, { status: 409 });
  const conflicts = await prisma.bookingAssignment.count({ where: { id: { not: assignment.id }, sitterId: assignment.sitter.id, status: { in: ["ACCEPTED", "CUSTOMER_APPROVED", "ACTIVE"] }, booking: { scheduledStart: { lt: assignment.booking.scheduledEnd }, scheduledEnd: { gt: assignment.booking.scheduledStart } } } });
  const eligibility = sitterEligibility({ sitterStatus: assignment.sitter.status, permissionStatus: permission.status, permissionExpiresAt: permission.expiresAt, riskLimit: permission.riskLimit, petRisk: assignment.booking.pet.riskAssessments[0]?.finalLevel ?? "UNASSESSED", hasScheduleConflict: conflicts > 0, hasActiveHold: assignment.sitter.holds.length > 0 });
  if (!eligibility.eligible) return NextResponse.json({ error: "no_longer_eligible", reasons: eligibility.reasons }, { status: 409 });

  await prisma.$transaction([
    prisma.bookingAssignment.update({ where: { id: assignment.id }, data: { status: "ACCEPTED", respondedAt: new Date() } }),
    prisma.booking.update({ where: { id: assignment.bookingId }, data: { status: "CUSTOMER_APPROVAL_PENDING", statusHistory: { create: { fromState: "SITTER_PROPOSED", toState: "CUSTOMER_APPROVAL_PENDING", actorId: identity.id, reason: assignment.type === "REPLACEMENT" ? "Eligible replacement Saathi accepted offer" : "Eligible Saathi accepted offer" } } } }),
    prisma.auditLog.create({ data: { actorId: identity.id, actorRole: "SITTER", action: "booking.assignment_accepted", resourceType: "booking_assignment", resourceId: assignment.id, before: { status: assignment.status, bookingStatus: assignment.booking.status }, after: { status: "ACCEPTED", bookingStatus: "CUSTOMER_APPROVAL_PENDING", assignmentType: assignment.type }, reason: "Server eligibility checks passed at acceptance" } }),
    prisma.notificationOutbox.create({ data: { userId: assignment.booking.customerId, channel: "IN_APP", templateKey: assignment.type === "REPLACEMENT" ? "booking.replacement_approval_required" : "booking.assignment_approval_required", destination: assignment.booking.customerId, payload: { bookingId: assignment.bookingId, assignmentId: assignment.id, assignmentType: assignment.type }, idempotencyKey: `assignment-accepted:${assignment.id}:customer` } })
  ]);
  return NextResponse.json({ accepted: true });
}
