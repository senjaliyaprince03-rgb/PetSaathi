import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { healthEventSchema } from "@/modules/pets/health-input";
import { ownedPet } from "@/modules/pets/ownership";
import { consumeRateLimit } from "@/modules/security/rate-limit";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = healthEventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const occurredAt = new Date(parsed.data.occurredAt);
  if (occurredAt.getTime() > Date.now() + 5 * 60_000) return NextResponse.json({ error: "future_health_event" }, { status: 422 });
  const { id } = await context.params;
  if (!await ownedPet(id, identity.id)) return NextResponse.json({ error: "pet_not_found" }, { status: 404 });
  const rate = await consumeRateLimit("pet-health-event", identity.id, 30, 24 * 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });

  const event = await prisma.petHealthEvent.create({ data: { petId: id, eventType: parsed.data.eventType, occurredAt, source: "PET_PARENT", summary: parsed.data.summary, details: parsed.data.details ? { note: parsed.data.details } : undefined, providerRef: parsed.data.providerRef, createdBy: identity.id } });
  await prisma.auditLog.create({ data: { actorId: identity.id, actorRole: "CUSTOMER", action: "pet.health_event_recorded", resourceType: "pet", resourceId: id, after: { healthEventId: event.id, eventType: event.eventType } } });
  return NextResponse.json({ event: { id: event.id, eventType: event.eventType, occurredAt: event.occurredAt } }, { status: 201 });
}
