import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

const inputSchema = z.object({ moduleId: z.string().uuid(), score: z.number().int().min(0).max(100) });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["VERIFICATION_ADMIN", "SUPER_ADMIN"])) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  const [sitter, module] = await Promise.all([prisma.sitterProfile.findUnique({ where: { id }, select: { id: true } }), prisma.trainingModule.findUnique({ where: { id: parsed.data.moduleId } })]);
  if (!sitter || !module?.active) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const passed = parsed.data.score >= module.passingScore;
  const attempt = await prisma.$transaction(async (tx) => {
    const created = await tx.trainingAttempt.create({ data: { sitterId: sitter.id, moduleId: module.id, score: parsed.data.score, passed } });
    await tx.auditLog.create({ data: { actorId: identity.id, actorRole: identity.roles.includes("SUPER_ADMIN") ? "SUPER_ADMIN" : "VERIFICATION_ADMIN", action: "sitter.training_attempt_recorded", resourceType: "training_attempt", resourceId: created.id, after: { sitterId: sitter.id, moduleSlug: module.slug, moduleVersion: module.version, score: created.score, passed } } });
    return created;
  });
  return NextResponse.json({ attempt: { id: attempt.id, score: attempt.score, passed: attempt.passed } }, { status: 201 });
}
