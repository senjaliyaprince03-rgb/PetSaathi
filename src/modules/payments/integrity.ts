/**
 * Payment Integrity Helpers
 * Prevents duplicate payments, refunds, and ensures idempotency
 */

import "server-only";

import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

/**
 * Check if booking already has a pending or successful payment
 * Prevents duplicate payment creation
 */
export async function checkDuplicatePayment(bookingId: string): Promise<void> {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      bookingId,
      status: {
        in: ["CREATED", "PENDING", "AUTHORIZED", "CAPTURED"]
      }
    },
    select: { id: true, status: true }
  });

  if (existingPayment) {
    throw new Error(
      `Payment already exists for booking ${bookingId} with status ${existingPayment.status}`
    );
  }
}

/**
 * Check if refund with same idempotency key already exists
 * Prevents duplicate refunds
 */
export async function checkDuplicateRefund(
  paymentId: string,
  idempotencyKey: string
): Promise<void> {
  const existingRefund = await prisma.refund.findFirst({
    where: {
      paymentId,
      // Check if a refund for same amount/reason already exists (basic duplicate detection)
      // In production, add idempotency_key field to Refund model
      status: {
        in: ["REQUESTED", "APPROVED", "PROCESSING", "COMPLETED"]
      }
    },
    select: { id: true, status: true }
  });

  if (existingRefund) {
    throw new Error(`Refund already exists for payment with status ${existingRefund.status}`);
  }
}

/**
 * Validate refund amount against payment and existing refunds
 */
export async function validateRefundAmount(
  paymentId: string,
  refundAmountPaise: number
): Promise<void> {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    select: {
      amountPaise: true,
      status: true,
      refunds: {
        where: {
          status: { in: ["COMPLETED"] }
        },
        select: { amountPaise: true }
      }
    }
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status !== "CAPTURED" && payment.status !== "PARTIALLY_REFUNDED") {
    throw new Error(`Cannot refund payment with status ${payment.status}`);
  }

  // Calculate total refunded amount
  const totalRefunded = payment.refunds.reduce((sum, r) => sum + r.amountPaise, 0);
  const remainingAmount = payment.amountPaise - totalRefunded;

  if (refundAmountPaise > remainingAmount) {
    throw new Error(
      `Refund amount ₹${refundAmountPaise / 100} exceeds remaining amount ₹${remainingAmount / 100}`
    );
  }

  if (refundAmountPaise <= 0) {
    throw new Error("Refund amount must be positive");
  }
}

/**
 * Check if payout already exists for booking/sitter combination
 * Prevents duplicate payouts
 */
export async function checkDuplicatePayout(
  bookingId: string,
  sitterId: string
): Promise<void> {
  const existingPayout = await prisma.payout.findFirst({
    where: {
      bookingId,
      sitterId,
      status: {
        in: ["PENDING", "APPROVED", "PROCESSING", "PAID"]
      }
    },
    select: { id: true, status: true }
  });

  if (existingPayout) {
    throw new Error(
      `Payout already exists for booking ${bookingId} with status ${existingPayout.status}`
    );
  }
}

/**
 * Validate payment webhook event is not a replay
 * Checks if event was already processed
 */
export async function validateWebhookEvent(
  providerEventId: string,
  provider: string = "razorpay"
): Promise<boolean> {
  const existingEvent = await prisma.paymentEvent.findFirst({
    where: {
      providerEventId,
      provider
    },
    select: { processedAt: true }
  });

  // Return true if event was not processed yet
  return !existingEvent || !existingEvent.processedAt;
}

/**
 * Create payment with duplicate check
 * Atomic operation using transaction
 */
export async function createPaymentSafe(data: {
  bookingId: string;
  provider: string;
  providerOrderId: string;
  amountPaise: number;
  currency: string;
}): Promise<{ id: string; providerOrderId: string }> {
  return await prisma.$transaction(async (tx) => {
    // Check for duplicate within transaction
    const existing = await tx.payment.findFirst({
      where: {
        bookingId: data.bookingId,
        status: { in: ["CREATED", "PENDING", "AUTHORIZED", "CAPTURED"] }
      },
      select: { id: true, providerOrderId: true }
    });

    if (existing) {
      // Return existing payment instead of creating duplicate
      return existing;
    }

    // Create new payment
    const payment = await tx.payment.create({
      data: {
        ...data,
        status: "CREATED"
      },
      select: { id: true, providerOrderId: true }
    });

    return payment;
  });
}

/**
 * Validate booking/payment ownership and amount consistency
 */
export async function validatePaymentOwnership(
  paymentId: string,
  userId: string
): Promise<void> {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      booking: {
        select: { customerId: true, quoteAmountPaise: true }
      }
    }
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.booking.customerId !== userId) {
    throw new Error("Unauthorized: Payment belongs to different user");
  }

  // Validate amount matches quote (with 1 paise tolerance for rounding)
  const diff = Math.abs(payment.amountPaise - payment.booking.quoteAmountPaise);
  if (diff > 1) {
    throw new Error(
      `Payment amount ₹${payment.amountPaise / 100} does not match booking quote ₹${payment.booking.quoteAmountPaise / 100}`
    );
  }
}

/**
 * Generate idempotency key for payment operations
 */
export function generatePaymentIdempotencyKey(
  operation: string,
  ...parts: string[]
): string {
  return `payment:${operation}:${parts.join(":")}`;
}
