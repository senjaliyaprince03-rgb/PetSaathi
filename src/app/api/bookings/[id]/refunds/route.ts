import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

const requestRefundSchema = z.object({
  amountPaise: z.number().int().positive().optional(),
  reason: z.string().trim().min(10).max(1000)
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = requestRefundSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  const payment = await prisma.payment.findFirst({
    where: { bookingId: id, booking: { customerId: identity.id }, status: { in: ["CAPTURED", "PARTIALLY_REFUNDED"] } },
    orderBy: { capturedAt: "desc" },
    include: { refunds: { where: { status: { notIn: ["FAILED", "REJECTED"] } }, select: { amountPaise: true } } }
  });
  if (!payment) return NextResponse.json({ error: "captured_payment_not_found" }, { status: 404 });
  const committedPaise = payment.refunds.reduce((sum, refund) => sum + refund.amountPaise, 0);
  const remainingPaise = payment.amountPaise - committedPaise;
  const amountPaise = parsed.data.amountPaise ?? remainingPaise;
  if (remainingPaise <= 0 || amountPaise > remainingPaise) return NextResponse.json({ error: "refund_exceeds_remaining_amount", remainingPaise }, { status: 409 });
  const refund = await prisma.refund.create({ data: { paymentId: payment.id, amountPaise, reason: parsed.data.reason, requestedBy: identity.id } });
  return NextResponse.json({ refund: { id: refund.id, status: refund.status, amountPaise: refund.amountPaise }, remainingPaise: remainingPaise - amountPaise }, { status: 201 });
}
