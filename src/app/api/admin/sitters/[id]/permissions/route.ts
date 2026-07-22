import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

const inputSchema = z.object({ serviceTypeId: z.string().uuid(), status: z.enum(["ACTIVE", "SUSPENDED", "REVOKED"]), riskLimit: z.enum(["GREEN", "YELLOW"]), expiresAt: z.string().datetime({ offset: true }), reason: z.string().trim().min(10).max(500) });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["VERIFICATION_ADMIN", "SUPER_ADMIN"])) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  const [sitter, service] = await Promise.all([prisma.sitterProfile.findUnique({ where: { id }, select: { id: true, status: true } }), prisma.serviceType.findUnique({ where: { id: parsed.data.serviceTypeId }, select: { id: true, code: true } })]);
  if (!sitter || !service) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (service.code === "BOARDING_BETA" && parsed.data.status === "ACTIVE") return NextResponse.json({ error: "boarding_property_assessment_required" }, { status: 409 });
  if (parsed.data.status === "ACTIVE" && !["TRAINING", "APPROVED"].includes(sitter.status)) return NextResponse.json({ error: "sitter_not_ready_for_permission" }, { status: 409 });
  const expiresAt = new Date(parsed.data.expiresAt);
  if (expiresAt <= new Date()) return NextResponse.json({ error: "expiry_must_be_future" }, { status: 422 });

  const permission = await prisma.$transaction(async (tx) => {
    const updated = await tx.sitterServicePermission.upsert({ where: { sitterId_serviceTypeId: { sitterId: sitter.id, serviceTypeId: service.id } }, update: { status: parsed.data.status, riskLimit: parsed.data.riskLimit, expiresAt, reason: parsed.data.reason, grantedBy: parsed.data.status === "ACTIVE" ? identity.id : undefined, grantedAt: parsed.data.status === "ACTIVE" ? new Date() : undefined, revokedAt: parsed.data.status === "REVOKED" ? new Date() : undefined }, create: { sitterId: sitter.id, serviceTypeId: service.id, status: parsed.data.status, riskLimit: parsed.data.riskLimit, expiresAt, reason: parsed.data.reason, grantedBy: parsed.data.status === "ACTIVE" ? identity.id : undefined, grantedAt: parsed.data.status === "ACTIVE" ? new Date() : undefined } });
    await tx.auditLog.create({ data: { actorId: identity.id, actorRole: identity.roles.includes("SUPER_ADMIN") ? "SUPER_ADMIN" : "VERIFICATION_ADMIN", action: "sitter.permission_changed", resourceType: "sitter_service_permission", resourceId: updated.id, after: { serviceCode: service.code, status: updated.status, riskLimit: updated.riskLimit, expiresAt: updated.expiresAt?.toISOString() }, reason: parsed.data.reason } });
    return updated;
  });
  return NextResponse.json({ permission: { id: permission.id, status: permission.status, riskLimit: permission.riskLimit } });
}
