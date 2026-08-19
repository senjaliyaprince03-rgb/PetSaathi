import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { createRazorpayClient } from "@/modules/payments/razorpay";
import { logger } from "@/lib/logger";

const refundSchema = z.object({
  bookingId: z.string().uuid(),
  reason: z.string().min(5),
});

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = refundSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  }

  const { bookingId, reason } = parsed.data;

  // Verify ownership and booking status
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, customerId: identity.id },
  });

  if (!booking) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Find the captured payment
  const payment = await prisma.payment.findFirst({
    where: { bookingId: booking.id, status: "CAPTURED" },
  });

  if (!payment || !payment.providerPaymentId) {
    return NextResponse.json({ error: "no_captured_payment" }, { status: 400 });
  }

  const razorpay = createRazorpayClient();
  if (!razorpay) {
    return NextResponse.json({ error: "payments_not_configured" }, { status: 503 });
  }

  try {
    // Determine if refund is eligible based on cancellation rules (e.g. status)
    if (booking.status !== "CONFIRMED" && booking.status !== "CUSTOMER_CANCELLED" && booking.status !== "SITTER_CANCELLED") {
       return NextResponse.json({ error: "invalid_booking_status_for_refund" }, { status: 400 });
    }

    const refund = await prisma.$transaction(async (tx) => {
      // 1. Mark booking as CUSTOMER_CANCELLED if not already cancelled
      if (booking.status === "CONFIRMED") {
         await tx.booking.update({
           where: { id: booking.id },
           data: { status: "CUSTOMER_CANCELLED" },
         });
      }

      // 2. Create Refund Record
      const refundRecord = await tx.refund.create({
        data: {
          paymentId: payment.id,
          amountPaise: payment.amountPaise,
          reason,
          requestedBy: identity.id,
          status: "REQUESTED",
        },
      });

      return refundRecord;
    });

    // 3. Initiate refund with Razorpay
    const rpRefund = await razorpay.payments.refund(payment.providerPaymentId, {
      amount: payment.amountPaise,
      notes: {
        bookingId: booking.id,
        refundRecordId: refund.id,
      },
    });

    // 4. Update the refund record with provider ID
    await prisma.refund.update({
      where: { id: refund.id },
      data: {
        providerRefundId: rpRefund.id,
        status: "PROCESSING",
      },
    });
    
    logger.info("Payment refund initiated", { event: "payment.refund_initiated", bookingId: booking.id });

    return NextResponse.json({ success: true, refundId: refund.id });
  } catch (error) {
    logger.error(error instanceof Error ? error : "RefundError", { event: "payment.refund_failed", bookingId });
    return NextResponse.json({ error: "refund_failed" }, { status: 500 });
  }
}
