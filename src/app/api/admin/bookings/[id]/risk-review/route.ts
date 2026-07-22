import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { suggestRiskLevel } from "@/modules/risk/assessment";

const riskSchema = z.object({
  finalLevel: z.enum(["GREEN", "YELLOW", "RED"]),
  factors: z.object({ biteHistory: z.boolean(), aggressionTowardPeople: z.boolean(), aggressionTowardAnimals: z.boolean(), escapeRisk: z.boolean(), leashReactivity: z.boolean(), medicalComplexity: z.boolean() }),
  reason: z.string().trim().min(10).max(500)
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["OPERATIONS_ADMIN", "SAFETY_ADMIN", "SUPER_ADMIN"])) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = riskSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  const booking = await prisma.booking.findUnique({ where: { id }, select: { id: true, status: true, petId: true, serviceType: { select: { code: true } } } });
  if (!booking) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!["REQUESTED", "RISK_REVIEW"].includes(booking.status)) return NextResponse.json({ error: "invalid_booking_state" }, { status: 409 });

  const suggestedLevel = suggestRiskLevel(parsed.data.factors);
  const nextStatus = parsed.data.finalLevel === "RED" ? "DECLINED" : "MATCHING";
  await prisma.$transaction([
    prisma.petRiskAssessment.create({ data: { petId: booking.petId, serviceCode: booking.serviceType.code, suggestedLevel, finalLevel: parsed.data.finalLevel, factorSnapshot: { ...parsed.data.factors, reviewerReason: parsed.data.reason }, reviewedBy: identity.id, reviewedAt: new Date(), expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60_000) } }),
    prisma.booking.update({ where: { id: booking.id }, data: { status: nextStatus, statusHistory: { create: { fromState: booking.status, toState: nextStatus, actorId: identity.id, reason: parsed.data.reason, metadata: { suggestedLevel, finalLevel: parsed.data.finalLevel } } } } })
  ]);
  return NextResponse.json({ suggestedLevel, finalLevel: parsed.data.finalLevel, nextStatus });
}
