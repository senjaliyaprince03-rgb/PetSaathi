import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { createRazorpayClient } from "@/modules/payments/razorpay";
import { logger } from "@/lib/logger";
import { calculateRefundTier } from "@/modules/payments/refund-policy";
import { issueCredits } from "@/modules/b2b/wallets";

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

  const activeRefund = await prisma.refund.findFirst({
    where: {
      paymentId: payment.id,
      status: { in: ["REQUESTED", "APPROVED", "PROCESSING", "COMPLETED"] },
    },
  });
  if (activeRefund) {
    return NextResponse.json({ error: "refund_already_exists", refundId: activeRefund.id }, { status: 409 });
  }

  // Determine if refund is eligible based on cancellation rules (e.g. status)
  if (booking.status !== "CONFIRMED" && booking.status !== "CUSTOMER_CANCELLED" && booking.status !== "SITTER_CANCELLED") {
    return NextResponse.json({ error: "invalid_booking_status_for_refund" }, { status: 400 });
  }

  // Enforces published /refund-policy cancellation notice windows:
  // > 24 hours = 100% refund, 4–24 hours = 50% refund, < 4 hours = 0% non-refundable
  const cancelledBy = booking.status === "SITTER_CANCELLED" ? "SITTER" : "CUSTOMER";
  const calculation = calculateRefundTier({
    scheduledStart: booking.scheduledStart,
    scheduledEnd: booking.scheduledEnd,
    cancelledBy,
    amountPaise: payment.amountPaise,
    now: new Date(),
  });

  const razorpay = createRazorpayClient();
  if (!razorpay && calculation.refundAmountPaise > 0) {
    return NextResponse.json({ error: "payments_not_configured" }, { status: 503 });
  }

  try {
    const refund = await prisma.$transaction(async (tx) => {
      // 1. Mark booking as CUSTOMER_CANCELLED if not already cancelled
      if (booking.status === "CONFIRMED") {
        await tx.booking.update({
          where: { id: booking.id },
          data: {
            status: "CUSTOMER_CANCELLED",
            statusHistory: {
              create: {
                fromState: booking.status,
                toState: "CUSTOMER_CANCELLED",
                actorId: identity.id,
                reason: `${reason} [Refund tier: ${calculation.tier}, ${calculation.refundAmountPaise / 100} INR]`,
              },
            },
          },
        });
      }

      // 2. Create Refund Record with exact tier applied
      const refundRecord = await tx.refund.create({
        data: {
          paymentId: payment.id,
          amountPaise: calculation.refundAmountPaise,
          reason: `${reason} [Tier: ${calculation.tier}]`,
          requestedBy: identity.id,
          status: calculation.refundAmountPaise > 0 ? "REQUESTED" : "REJECTED",
        },
      });

      return refundRecord;
    });

    // 3. If apology credit is applicable (caregiver cancellation), disburse to customer wallet
    if (calculation.apologyCreditPaise > 0) {
      try {
        const membership = await prisma.programmeMembership.findFirst({
          where: { customerId: booking.customerId, active: true },
          include: { wallet: true },
        });
        if (membership?.wallet) {
          await issueCredits({
            walletId: membership.wallet.id,
            amountPaise: calculation.apologyCreditPaise,
            reference: `Apology credit for caregiver cancellation on booking ${booking.reference}`,
            idempotencyKey: `apology-credit-booking-${booking.id}`,
          });
        }
      } catch (creditErr) {
        logger.warn("Could not issue caregiver cancellation apology credit", { bookingId: booking.id, error: String(creditErr) });
      }
    }

    // 4. If refund amount is 0 (e.g. cancelled < 4h), complete non-refundable flow without Razorpay API call
    if (calculation.refundAmountPaise === 0) {
      logger.info("Non-refundable cancellation processed", {
        event: "payment.refund_zero_eligible",
        bookingId: booking.id,
        tier: calculation.tier,
      });

      return NextResponse.json({
        success: true,
        refundId: refund.id,
        tier: calculation.tier,
        refundAmountPaise: 0,
        message: calculation.explanation,
      });
    }

    // 5. Initiate refund with Razorpay with the calculated tier amount
    const rpRefund = await razorpay!.payments.refund(payment.providerPaymentId, {
      amount: calculation.refundAmountPaise,
      notes: {
        bookingId: booking.id,
        refundRecordId: refund.id,
        tier: calculation.tier,
      },
    });

    // 6. Update the refund record with provider ID
    await prisma.refund.update({
      where: { id: refund.id },
      data: {
        providerRefundId: rpRefund.id,
        status: "PROCESSING",
      },
    });

    logger.info("Payment refund initiated with tier", {
      event: "payment.refund_initiated",
      bookingId: booking.id,
      tier: calculation.tier,
      amountPaise: calculation.refundAmountPaise,
    });

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      tier: calculation.tier,
      refundAmountPaise: calculation.refundAmountPaise,
    });
  } catch (error) {
    logger.error("RefundError", { bookingId, error: String(error) });
    return NextResponse.json({ error: "refund_failed" }, { status: 500 });
  }
}
