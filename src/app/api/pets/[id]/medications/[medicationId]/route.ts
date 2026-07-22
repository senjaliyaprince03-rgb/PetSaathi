import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { consumeRateLimit } from "@/modules/security/rate-limit";

const schema = z.object({ active: z.literal(false) });

export async function PATCH(request: Request, context: { params: Promise<{ id: string; medicationId: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id, medicationId } = await context.params;
  const medication = await prisma.medication.findFirst({ where: { id: medicationId, petId: id, pet: { ownerId: identity.id, active: true } }, select: { id: true, active: true, endsAt: true } });
  if (!medication) return NextResponse.json({ error: "medication_not_found" }, { status: 404 });
  if (!medication.active) return NextResponse.json({ ended: true });
  const rate = await consumeRateLimit("pet-medication-status", identity.id, 20, 24 * 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const endedAt = medication.endsAt && medication.endsAt < new Date() ? medication.endsAt : new Date();
  await prisma.$transaction([
    prisma.medication.update({ where: { id: medication.id }, data: { active: false, endsAt: endedAt } }),
    prisma.auditLog.create({ data: { actorId: identity.id, actorRole: "CUSTOMER", action: "pet.medication_ended", resourceType: "pet", resourceId: id, after: { medicationId } } })
  ]);
  return NextResponse.json({ ended: true });
}
