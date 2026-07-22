import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { createRazorpayClient } from "@/modules/payments/razorpay";
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
  if (!canTransitionRefund(refund.status, parsed.data.toState)) return NextResponse.json({ error: "invalid_refund_transition" }, { status: 409 });

  if (parsed.data.toState !== "PROCESSING") {
    const updated = await prisma.refund.update({ where: { id }, data: { status: parsed.data.toState, approvedBy: parsed.data.toState === "APPROVED" ? identity.id : undefined } });
    return NextResponse.json({ refund: { id: updated.id, status: updated.status } });
  }

  const razorpay = createRazorpayClient();
  if (!razorpay || !refund.payment.providerPaymentId) return NextResponse.json({ error: "refund_provider_not_configured" }, { status: 503 });
  const claimed = await prisma.refund.updateMany({ where: { id, status: refund.status }, data: { status: "PROCESSING", approvedBy: refund.approvedBy ?? identity.id } });
  if (claimed.count !== 1) return NextResponse.json({ error: "refund_changed_concurrently" }, { status: 409 });
  try {
    const providerRefund = await razorpay.payments.refund(refund.payment.providerPaymentId, { amount: refund.amountPaise, speed: "normal", receipt: `ps-${refund.id}`, notes: { refund_request_id: refund.id, finance_note: parsed.data.note } });
    const status = providerRefund.status === "processed" ? "COMPLETED" : providerRefund.status === "failed" ? "FAILED" : "PROCESSING";
    const updated = await prisma.refund.update({ where: { id }, data: { providerRefundId: providerRefund.id, status, completedAt: status === "COMPLETED" ? new Date() : null } });
    if (status === "COMPLETED") await updatePaymentRefundStatus(updated.paymentId);
    return NextResponse.json({ refund: { id: updated.id, status: updated.status, providerRefundId: updated.providerRefundId } });
  } catch {
    return NextResponse.json({ error: "refund_processing_uncertain", message: "Provider reconciliation is required before retrying." }, { status: 502 });
  }
}

async function updatePaymentRefundStatus(paymentId: string) {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId }, select: { amountPaise: true, refunds: { where: { status: "COMPLETED" }, select: { amountPaise: true } } } });
  if (!payment) return;
  const refundedPaise = payment.refunds.reduce((sum, item) => sum + item.amountPaise, 0);
  await prisma.payment.update({ where: { id: paymentId }, data: { status: refundedPaise >= payment.amountPaise ? "REFUNDED" : "PARTIALLY_REFUNDED" } });
}
