import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { PartnerOrderWorkflowError, transitionPartnerOrder } from "@/modules/partners/order-workflow";

const schema = z.object({ toState: z.enum(["REQUESTED", "ACCEPTED", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "DISPUTED"]), note: z.string().trim().min(5).max(2_000), scheduledAt: z.coerce.date().optional() });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["PARTNER_MANAGER", "SUPER_ADMIN"])) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  try {
    const order = await transitionPartnerOrder(id, identity, parsed.data);
    return NextResponse.json({ transitioned: true, order: { id: order.id, status: order.status, scheduledAt: order.scheduledAt } });
  } catch (error) {
    if (error instanceof PartnerOrderWorkflowError) return NextResponse.json({ error: error.code, message: error.message }, { status: error.status });
    throw error;
  }
}
