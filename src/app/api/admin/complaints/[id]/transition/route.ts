import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { canTransitionComplaint, requiresResolution } from "@/modules/support/state-machine";

const schema = z.object({
  toState: z.enum(["RECEIVED", "TRIAGING", "IN_REVIEW", "ACTION_REQUIRED", "RESOLVED", "CLOSED", "REJECTED"]),
  note: z.string().trim().min(5).max(2000)
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["OPERATIONS_ADMIN", "SAFETY_ADMIN", "SUPER_ADMIN"])) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  const complaint = await prisma.complaint.findUnique({ where: { id } });
  if (!complaint) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!canTransitionComplaint(complaint.status, parsed.data.toState)) return NextResponse.json({ error: "invalid_complaint_transition" }, { status: 409 });

  const terminal = requiresResolution(parsed.data.toState);
  await prisma.$transaction([
    prisma.complaint.update({ where: { id }, data: { status: parsed.data.toState, assignedTo: identity.id, resolution: terminal ? parsed.data.note : null, resolvedAt: terminal ? new Date() : null } }),
    prisma.auditLog.create({ data: { actorId: identity.id, actorRole: identity.roles[0], action: "complaint.transition", resourceType: "complaint", resourceId: id, before: { status: complaint.status }, after: { status: parsed.data.toState }, reason: parsed.data.note } })
  ]);
  return NextResponse.json({ transitioned: true, status: parsed.data.toState });
}
