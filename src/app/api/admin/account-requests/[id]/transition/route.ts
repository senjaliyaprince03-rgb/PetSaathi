import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { canTransitionAccountRequest } from "@/modules/privacy/account-request-state";

const schema = z.object({ toState: z.enum(["IDENTITY_VERIFIED", "IN_REVIEW", "APPROVED", "FULFILLED", "REJECTED"]), resolution: z.string().trim().min(10).max(2000) });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SUPER_ADMIN"])) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  const accountRequest = await prisma.accountRequest.findUnique({ where: { id } });
  if (!accountRequest) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!canTransitionAccountRequest(accountRequest.status, parsed.data.toState)) return NextResponse.json({ error: "invalid_request_transition" }, { status: 409 });
  if (parsed.data.toState === "FULFILLED" && accountRequest.type === "DELETION") return NextResponse.json({ error: "deletion_execution_job_required" }, { status: 409 });
  await prisma.$transaction([
    prisma.accountRequest.update({ where: { id }, data: { status: parsed.data.toState, handledBy: identity.id, resolution: parsed.data.resolution, verifiedAt: parsed.data.toState === "IDENTITY_VERIFIED" ? new Date() : undefined, fulfilledAt: parsed.data.toState === "FULFILLED" ? new Date() : undefined } }),
    prisma.auditLog.create({ data: { actorId: identity.id, actorRole: "SUPER_ADMIN", action: "account_request.transition", resourceType: "account_request", resourceId: id, before: { status: accountRequest.status }, after: { status: parsed.data.toState }, reason: parsed.data.resolution } })
  ]);
  return NextResponse.json({ transitioned: true, status: parsed.data.toState });
}
