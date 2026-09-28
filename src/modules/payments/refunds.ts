import { providerDeadline } from "@/modules/payments/provider-deadline";
import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { createRazorpayClient } from "./razorpay";

type ProviderRefund = { id: string; payment_id: string; amount: number; status: string };

/** Shared by provider responses and signed webhooks; completed refunds never regress. */
export async function reconcileRefund(tx: Prisma.TransactionClient, refundId: string, provider: ProviderRefund) {
  const refund = await tx.refund.findUnique({ where: { id: refundId }, include: { payment: true } });
  if (!refund || refund.amountPaise !== provider.amount || refund.payment.providerPaymentId !== provider.payment_id ||
      (refund.providerRefundId && refund.providerRefundId !== provider.id)) throw new Error("refund_provider_mismatch");
  if (refund.status === "REJECTED") throw new Error("refund_rejected_requires_review");
  const status = refund.status === "COMPLETED" ? "COMPLETED" : provider.status === "processed" ? "COMPLETED" :
    provider.status === "failed" ? "FAILED" : refund.status === "FAILED" ? "FAILED" : "PROCESSING";
  const updated = await tx.refund.update({ where: { id: refund.id }, data: {
    providerRefundId: provider.id, status, completedAt: status === "COMPLETED" ? refund.completedAt ?? new Date() : null,
  } });
  if (status === "COMPLETED") {
    const completed = await tx.refund.aggregate({ where: { paymentId: refund.paymentId, status: "COMPLETED" }, _sum: { amountPaise: true } });
    const amount = completed._sum.amountPaise ?? 0;
    if (amount > refund.payment.amountPaise) throw new Error("refund_total_exceeds_payment");
    await tx.payment.updateMany({ where: { id: refund.paymentId, status: { in: ["CAPTURED", "PARTIALLY_REFUNDED"] } },
      data: { status: amount >= refund.payment.amountPaise ? "REFUNDED" : "PARTIALLY_REFUNDED" } });
  }
  return updated;
}

/** Claim before the network call. PROCESSING includes unknown outcomes: reconcile, never blindly resend. */
export async function processRefund(refundId: string) {
  const refund = await prisma.refund.findUnique({ where: { id: refundId }, include: { payment: true } });
  if (!refund) throw new Error("refund_not_found");
  if (["COMPLETED", "REJECTED", "REQUESTED", "FAILED"].includes(refund.status)) return { refund, uncertain: false };
  const provider = createRazorpayClient();
  if (!provider || !refund.payment.providerPaymentId) throw new Error("refund_provider_not_configured");
  const paymentId = refund.payment.providerPaymentId;
  if (refund.status === "PROCESSING") {
    // Receipt/notes correlate even when the webhook beats the local HTTP response.
    const result = refund.providerRefundId ? await providerDeadline(provider.refunds.fetch(refund.providerRefundId)) :
      (await providerDeadline(provider.payments.fetchMultipleRefund(paymentId, { count: 100 }))).items.find(item =>
        item.receipt === `ps-${refund.id}` || item.notes?.refund_request_id === refund.id);
    if (!result) return { refund, uncertain: true };
    const updated = await prisma.$transaction(tx => reconcileRefund(tx, refund.id, result as ProviderRefund));
    return { refund: updated, uncertain: false };
  }
  const claim = await prisma.refund.updateMany({ where: { id: refund.id, status: "APPROVED" }, data: { status: "PROCESSING" } });
  if (claim.count !== 1) return { refund: await prisma.refund.findUnique({ where: { id: refund.id } }), uncertain: true };
  try {
    const result = await providerDeadline(provider.payments.refund(paymentId, {
      amount: refund.amountPaise, speed: "normal", receipt: `ps-${refund.id}`, notes: { refund_request_id: refund.id },
    }));
    const updated = await prisma.$transaction(tx => reconcileRefund(tx, refund.id, result as ProviderRefund));
    return { refund: updated, uncertain: false };
  } catch {
    return { refund: await prisma.refund.findUnique({ where: { id: refund.id } }), uncertain: true };
  }
}
