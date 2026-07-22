import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { consumeRateLimit } from "@/modules/security/rate-limit";
import { sitterEligibility } from "@/modules/sitters/eligibility";

const inputSchema = z.object({ sitterId: z.string().uuid(), type: z.enum(["PRIMARY", "BACKUP", "REPLACEMENT"]).default("PRIMARY") });
const operationsRoles = ["OPERATIONS_ADMIN", "SUPER_ADMIN"] as const;

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, operationsRoles)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const rate = await consumeRateLimit("admin-assignment-offer", identity.id, 100, 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      pet: { select: { riskAssessments: { orderBy: { createdAt: "desc" }, take: 1, select: { finalLevel: true } } } },
      serviceType: { select: { id: true } },
      priceQuotes: { where: { acceptedAt: { not: null } }, orderBy: { acceptedAt: "desc" }, take: 1, select: { totalPaise: true, servicePrice: { select: { sitterPaise: true } } } }
    }
  });
  if (!booking) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!["MATCHING", "REPLACEMENT_REQUIRED"].includes(booking.status)) return NextResponse.json({ error: "invalid_booking_state" }, { status: 409 });
  const acceptedQuote = booking.priceQuotes[0];
  if (!acceptedQuote?.servicePrice || acceptedQuote.totalPaise !== booking.quoteAmountPaise) return NextResponse.json({ error: "payout_policy_not_configured", message: "The accepted immutable quote is missing its approved Saathi amount." }, { status: 409 });

  const sitter = await prisma.sitterProfile.findUnique({
    where: { id: parsed.data.sitterId },
    select: { id: true, status: true, userId: true, holds: { where: { status: "ACTIVE", OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] }, take: 1, select: { id: true } }, permissions: { where: { serviceTypeId: booking.serviceType.id }, take: 1, select: { status: true, expiresAt: true, riskLimit: true } } }
  });
  const permission = sitter?.permissions[0];
  if (!sitter || !permission) return NextResponse.json({ error: "sitter_not_permitted" }, { status: 409 });

  const conflictCount = await prisma.bookingAssignment.count({
    where: { sitterId: sitter.id, status: { in: ["ACCEPTED", "CUSTOMER_APPROVED", "ACTIVE"] }, booking: { scheduledStart: { lt: booking.scheduledEnd }, scheduledEnd: { gt: booking.scheduledStart } } }
  });
  const eligibility = sitterEligibility({ sitterStatus: sitter.status, permissionStatus: permission.status, permissionExpiresAt: permission.expiresAt, riskLimit: permission.riskLimit, petRisk: booking.pet.riskAssessments[0]?.finalLevel ?? "UNASSESSED", hasScheduleConflict: conflictCount > 0, hasActiveHold: sitter.holds.length > 0 });
  if (!eligibility.eligible) return NextResponse.json({ error: "sitter_ineligible", reasons: eligibility.reasons }, { status: 409 });

  const payoutPaise = acceptedQuote.servicePrice.sitterPaise;
  const assignment = await prisma.$transaction(async (tx) => {
    const assignmentType = booking.status === "REPLACEMENT_REQUIRED" ? "REPLACEMENT" : parsed.data.type;
    const created = await tx.bookingAssignment.create({ data: { bookingId: booking.id, sitterId: sitter.id, type: assignmentType, payoutPaise, responseDueAt: new Date(Date.now() + 30 * 60_000) } });
    await tx.booking.update({ where: { id: booking.id }, data: { status: "SITTER_PROPOSED", statusHistory: { create: { fromState: booking.status, toState: "SITTER_PROPOSED", actorId: identity.id, reason: assignmentType === "REPLACEMENT" ? "Eligible replacement Saathi offered by operations" : "Eligible Saathi offered by operations", metadata: { assignmentId: created.id, assignmentType } } } } });
    await tx.auditLog.create({ data: { actorId: identity.id, actorRole: identity.roles.includes("SUPER_ADMIN") ? "SUPER_ADMIN" : "OPERATIONS_ADMIN", action: "booking.assignment_offered", resourceType: "booking_assignment", resourceId: created.id, before: { bookingStatus: booking.status }, after: { bookingStatus: "SITTER_PROPOSED", sitterId: sitter.id, assignmentType, payoutPaise }, reason: "Server eligibility checks passed" } });
    await tx.notificationOutbox.create({ data: { userId: sitter.userId, channel: "IN_APP", templateKey: assignmentType === "REPLACEMENT" ? "assignment.replacement_offered" : "assignment.offered", destination: sitter.userId, payload: { assignmentId: created.id, bookingId: booking.id, assignmentType, responseDueAt: created.responseDueAt?.toISOString() }, idempotencyKey: `assignment-offered:${created.id}` } });
    return created;
  });
  return NextResponse.json({ assignment }, { status: 201 });
}
