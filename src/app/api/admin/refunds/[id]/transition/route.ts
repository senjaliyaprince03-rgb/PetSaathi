import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { processRefund } from "@/modules/payments/refunds";
import { canTransitionRefund } from "@/modules/payments/refund-state-machine";

const transitionSchema = z.object({ toState: z.enum(["APPROVED", "REJECTED", "PROCESSING"]), note: z.string().trim().min(5).max(500) });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["FINANCE_ADMIN", "SUPER_ADMIN"])) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = transitionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  const refund = await prisma.refund.findUnique({ where: { id }, include: { payment: { select: { providerPaymentId: true } } } });
  if (!refund) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!(refund.status === "PROCESSING" && parsed.data.toState === "PROCESSING") && !canTransitionRefund(refund.status, parsed.data.toState)) return NextResponse.json({ error: "invalid_refund_transition" }, { status: 409 });

  if (parsed.data.toState !== "PROCESSING") {
    const updated = await prisma.refund.update({ where: { id }, data: { status: parsed.data.toState, approvedBy: parsed.data.toState === "APPROVED" ? identity.id : undefined } });
    return NextResponse.json({ refund: { id: updated.id, status: updated.status } });
  }

  try {
    const result = await processRefund(id);
    return NextResponse.json(result, { status: result.uncertain ? 202 : 200 });
  } catch {
    return NextResponse.json({ error: "refund_reconciliation_required" }, { status: 503 });
  }
}
