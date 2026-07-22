import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

const schema = z.object({ enabled: z.boolean(), reason: z.string().trim().min(10).max(1000) });

export async function PATCH(request: Request, context: { params: Promise<{ key: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SUPER_ADMIN"])) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { key } = await context.params;
  const flag = await prisma.featureFlag.findUnique({ where: { key } });
  if (!flag) return NextResponse.json({ error: "not_found" }, { status: 404 });
  await prisma.$transaction([
    prisma.featureFlag.update({ where: { key }, data: { enabled: parsed.data.enabled, updatedBy: identity.id } }),
    prisma.auditLog.create({ data: { actorId: identity.id, actorRole: "SUPER_ADMIN", action: "feature_flag.update", resourceType: "feature_flag", resourceId: key, before: { enabled: flag.enabled, rules: flag.rules }, after: { enabled: parsed.data.enabled, rules: flag.rules }, reason: parsed.data.reason } })
  ]);
  return NextResponse.json({ key, enabled: parsed.data.enabled });
}
