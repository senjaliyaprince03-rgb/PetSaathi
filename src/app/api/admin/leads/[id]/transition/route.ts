import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { canTransitionLead } from "@/modules/leads/state-machine";

const schema = z.object({ toState: z.enum(["NEW", "CONTACTED", "QUALIFIED", "PILOT_PROPOSED", "CONVERTED", "DISQUALIFIED"]), note: z.string().trim().min(5).max(1000) });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["OPERATIONS_ADMIN", "SOCIETY_MANAGER", "PARTNER_MANAGER", "SUPER_ADMIN"])) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!canTransitionLead(lead.status, parsed.data.toState)) return NextResponse.json({ error: "invalid_lead_transition" }, { status: 409 });
  await prisma.$transaction([
    prisma.lead.update({ where: { id }, data: { status: parsed.data.toState, assignedTo: identity.id } }),
    prisma.auditLog.create({ data: { actorId: identity.id, actorRole: identity.roles[0], action: "lead.transition", resourceType: "lead", resourceId: id, before: { status: lead.status }, after: { status: parsed.data.toState }, reason: parsed.data.note } })
  ]);
  return NextResponse.json({ transitioned: true, status: parsed.data.toState });
}
