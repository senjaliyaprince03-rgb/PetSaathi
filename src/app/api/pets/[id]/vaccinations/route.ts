import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { ownedPet } from "@/modules/pets/ownership";
import { vaccinationSchema } from "@/modules/pets/health-input";
import { consumeRateLimit } from "@/modules/security/rate-limit";

function date(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = vaccinationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  if (!await ownedPet(id, identity.id)) return NextResponse.json({ error: "pet_not_found" }, { status: 404 });
  const rate = await consumeRateLimit("pet-vaccination", identity.id, 20, 24 * 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });

  const vaccination = await prisma.vaccination.create({ data: { ...parsed.data, petId: id, administeredAt: date(parsed.data.administeredAt), nextDueAt: parsed.data.nextDueAt ? date(parsed.data.nextDueAt) : undefined } });
  await prisma.auditLog.create({ data: { actorId: identity.id, actorRole: "CUSTOMER", action: "pet.vaccination_recorded", resourceType: "pet", resourceId: id, after: { vaccinationId: vaccination.id, verified: false } } });
  return NextResponse.json({ vaccination: { id: vaccination.id, vaccine: vaccination.vaccine, administeredAt: vaccination.administeredAt } }, { status: 201 });
}
