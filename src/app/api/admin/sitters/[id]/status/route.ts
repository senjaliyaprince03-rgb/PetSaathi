import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { canTransitionSitter } from "@/modules/sitters/status-machine";

const inputSchema = z.object({ status: z.enum(["APPLICANT", "UNDER_REVIEW", "TRAINING", "APPROVED", "PAUSED", "SUSPENDED", "REJECTED"]), reason: z.string().trim().min(10).max(500) });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["VERIFICATION_ADMIN", "SUPER_ADMIN"])) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  const sitter = await prisma.sitterProfile.findUnique({ where: { id }, include: { verifications: { where: { status: "PASSED", revokedAt: null } }, trainingAttempts: { where: { passed: true }, include: { module: { select: { slug: true } } } }, permissions: { where: { status: "ACTIVE" } } } });
  if (!sitter) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!canTransitionSitter(sitter.status, parsed.data.status)) return NextResponse.json({ error: "invalid_sitter_transition" }, { status: 409 });

  if (parsed.data.status === "APPROVED") {
    const requiredVerifications = listPolicy(process.env.REQUIRED_SITTER_VERIFICATIONS);
    const requiredTraining = listPolicy(process.env.REQUIRED_SITTER_TRAINING_MODULES);
    if (!requiredVerifications.length || !requiredTraining.length) return NextResponse.json({ error: "approval_policy_not_configured" }, { status: 503 });
    const activeTypes = new Set(sitter.verifications.filter(({ expiresAt }) => !expiresAt || expiresAt > new Date()).map(({ type }) => type));
    const passedModules = new Set(sitter.trainingAttempts.map(({ module }) => module.slug));
    const missingVerifications = requiredVerifications.filter((type) => !activeTypes.has(type));
    const missingTraining = requiredTraining.filter((slug) => !passedModules.has(slug));
    if (missingVerifications.length || missingTraining.length || !sitter.permissions.length) return NextResponse.json({ error: "approval_requirements_incomplete", missingVerifications, missingTraining, activeServicePermissionRequired: !sitter.permissions.length }, { status: 409 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const profile = await tx.sitterProfile.update({ where: { id: sitter.id }, data: { status: parsed.data.status, approvedAt: parsed.data.status === "APPROVED" ? new Date() : undefined, suspendedAt: parsed.data.status === "SUSPENDED" ? new Date() : parsed.data.status === "APPROVED" ? null : undefined } });
    await tx.auditLog.create({ data: { actorId: identity.id, actorRole: identity.roles.includes("SUPER_ADMIN") ? "SUPER_ADMIN" : "VERIFICATION_ADMIN", action: "sitter.status_changed", resourceType: "sitter_profile", resourceId: sitter.id, before: { status: sitter.status }, after: { status: profile.status }, reason: parsed.data.reason } });
    return profile;
  });
  return NextResponse.json({ sitter: { id: updated.id, status: updated.status } });
}

function listPolicy(value: string | undefined) { return value?.split(",").map((item) => item.trim()).filter(Boolean) ?? []; }
