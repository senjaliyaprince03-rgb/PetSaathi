import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { canTransitionPayout } from "@/modules/payments/payout-state-machine";
import { consumeRateLimit } from "@/modules/security/rate-limit";

const transitionSchema = z.object({
  toState: z.enum(["PENDING", "APPROVED", "PROCESSING", "PAID", "HELD", "FAILED", "CANCELLED"]),
  providerRef: z.string().trim().min(3).max(200).optional(),
  adjustmentPaise: z.number().int().optional(),
  note: z.string().trim().min(5).max(1_000)
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["FINANCE_ADMIN", "SUPER_ADMIN"])) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const rate = await consumeRateLimit("admin-payout-transition", identity.id, 100, 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const parsed = transitionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  const payout = await prisma.payout.findUnique({ where: { id }, include: { booking: { select: { status: true, reports: { orderBy: { version: "desc" }, take: 1, select: { id: true, reviewStatus: true } } } }, sitter: { select: { userId: true } } } });
  if (!payout) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!canTransitionPayout(payout.status, parsed.data.toState)) return NextResponse.json({ error: "invalid_payout_transition" }, { status: 409 });
  if (["APPROVED", "PROCESSING", "PAID"].includes(parsed.data.toState) && (payout.booking.status !== "CLOSED" || payout.booking.reports[0]?.reviewStatus !== "APPROVED")) return NextResponse.json({ error: "report_review_required", message: "The latest care report must be approved and the booking closed before payout approval or processing." }, { status: 409 });
  if (parsed.data.toState === "PAID" && !parsed.data.providerRef && !payout.providerRef) return NextResponse.json({ error: "provider_reference_required" }, { status: 422 });
  const netPaise = payout.amountPaise + (parsed.data.adjustmentPaise ?? payout.adjustmentPaise);
  if (netPaise < 0) return NextResponse.json({ error: "negative_net_payout" }, { status: 422 });
  const updated = await prisma.$transaction(async (tx) => {
    const changed = await tx.payout.update({ where: { id }, data: { status: parsed.data.toState, providerRef: parsed.data.providerRef, adjustmentPaise: parsed.data.adjustmentPaise, approvedBy: parsed.data.toState === "APPROVED" ? identity.id : undefined, approvedAt: parsed.data.toState === "APPROVED" ? new Date() : undefined, paidAt: parsed.data.toState === "PAID" ? new Date() : undefined } });
    const adjustmentDelta = (parsed.data.adjustmentPaise ?? payout.adjustmentPaise) - payout.adjustmentPaise;
    if (adjustmentDelta !== 0) await tx.payoutAdjustment.create({ data: { payoutId: payout.id, amountPaise: adjustmentDelta, reason: parsed.data.note, approvedBy: identity.id } });
    await tx.auditLog.create({ data: { actorId: identity.id, actorRole: identity.roles.includes("SUPER_ADMIN") ? "SUPER_ADMIN" : "FINANCE_ADMIN", action: "payout.transition", resourceType: "payout", resourceId: payout.id, before: { status: payout.status, providerRef: payout.providerRef, adjustmentPaise: payout.adjustmentPaise }, after: { status: changed.status, providerRef: changed.providerRef, adjustmentPaise: changed.adjustmentPaise }, reason: parsed.data.note } });
    if (changed.status === "PAID") await tx.notificationOutbox.create({ data: { userId: payout.sitter.userId, channel: "IN_APP", templateKey: "payout.paid", destination: payout.sitter.userId, payload: { payoutId: payout.id, bookingId: payout.bookingId, amountPaise: changed.amountPaise + changed.adjustmentPaise, providerRef: changed.providerRef }, idempotencyKey: `payout-paid:${payout.id}` } });
    return changed;
  });
  return NextResponse.json({ payout: { id: updated.id, status: updated.status, providerRef: updated.providerRef } });
}
