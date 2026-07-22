import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { medicationSchema } from "@/modules/pets/health-input";
import { ownedPet } from "@/modules/pets/ownership";
import { consumeRateLimit } from "@/modules/security/rate-limit";

function date(value?: string) {
  return value ? new Date(`${value}T00:00:00.000Z`) : undefined;
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = medicationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  if (!await ownedPet(id, identity.id)) return NextResponse.json({ error: "pet_not_found" }, { status: 404 });
  const rate = await consumeRateLimit("pet-medication", identity.id, 20, 24 * 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });

  const medication = await prisma.medication.create({ data: { ...parsed.data, petId: id, startsAt: date(parsed.data.startsAt), endsAt: date(parsed.data.endsAt) } });
  await prisma.auditLog.create({ data: { actorId: identity.id, actorRole: "CUSTOMER", action: "pet.medication_recorded", resourceType: "pet", resourceId: id, after: { medicationId: medication.id, active: medication.active } } });
  return NextResponse.json({ medication: { id: medication.id, name: medication.name, active: medication.active } }, { status: 201 });
}
