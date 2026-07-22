import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { careInstructionSchema } from "@/modules/pets/health-input";
import { ownedPet } from "@/modules/pets/ownership";
import { consumeRateLimit } from "@/modules/security/rate-limit";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = careInstructionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  if (!await ownedPet(id, identity.id)) return NextResponse.json({ error: "pet_not_found" }, { status: 404 });
  const rate = await consumeRateLimit("pet-care-instructions", identity.id, 20, 24 * 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });

  const created = await prisma.$transaction(async (tx) => {
    const latest = await tx.careInstruction.findFirst({ where: { petId: id }, orderBy: { version: "desc" }, select: { id: true, version: true } });
    if (latest) await tx.careInstruction.update({ where: { id: latest.id }, data: { activeUntil: new Date() } });
    const instruction = await tx.careInstruction.create({ data: { petId: id, version: (latest?.version ?? 0) + 1, instructions: parsed.data, createdBy: identity.id } });
    await tx.auditLog.create({ data: { actorId: identity.id, actorRole: "CUSTOMER", action: "pet.care_instructions_versioned", resourceType: "pet", resourceId: id, after: { version: instruction.version } } });
    return instruction;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

  return NextResponse.json({ instruction: { id: created.id, version: created.version, activeFrom: created.activeFrom } }, { status: 201 });
}
