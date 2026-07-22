import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

const inputSchema = z.object({ type: z.string().trim().min(2).max(80).regex(/^[A-Z0-9_]+$/), status: z.enum(["PASSED", "FAILED"]), provider: z.string().trim().max(120).optional(), publicLabel: z.string().trim().max(100).optional(), expiresAt: z.string().datetime({ offset: true }).optional() });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["VERIFICATION_ADMIN", "SUPER_ADMIN"])) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  const sitter = await prisma.sitterProfile.findUnique({ where: { id }, select: { id: true } });
  if (!sitter) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const verification = await prisma.$transaction(async (tx) => {
    const created = await tx.sitterVerification.create({ data: { sitterId: sitter.id, type: parsed.data.type, status: parsed.data.status, provider: parsed.data.provider, publicLabel: parsed.data.status === "PASSED" ? parsed.data.publicLabel : undefined, expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined, checkedBy: identity.id, checkedAt: new Date() } });
    await tx.auditLog.create({ data: { actorId: identity.id, actorRole: identity.roles.includes("SUPER_ADMIN") ? "SUPER_ADMIN" : "VERIFICATION_ADMIN", action: "sitter.verification_recorded", resourceType: "sitter_verification", resourceId: created.id, after: { sitterId: sitter.id, type: created.type, status: created.status, expiresAt: created.expiresAt?.toISOString() } } });
    return created;
  });
  return NextResponse.json({ verification: { id: verification.id, type: verification.type, status: verification.status } }, { status: 201 });
}
