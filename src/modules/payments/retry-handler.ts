import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export const MAX_PAYMENT_ATTEMPTS = 3;

/**
 * Handles payment failure recorded from Razorpay webhook or checkout.
 * If failure count >= MAX_PAYMENT_ATTEMPTS (3), auto-cancels the booking and releases capacity.
 * Otherwise, sends a retry payment notification with active checkout link.
 */
export async function handlePaymentFailureRetry(
  bookingId: string,
  failureCode?: string,
  failureReason?: string
) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: {
        payments: { where: { status: "FAILED" } },
        capacityReservation: { select: { id: true, capacityLimitId: true, quantity: true, status: true } }
      }
    });

    if (!booking) throw new Error("Booking not found: " + bookingId);

    const failedCount = booking.payments.length;

    if (failedCount >= MAX_PAYMENT_ATTEMPTS) {
      if (booking.capacityReservation && ["HELD", "CONFIRMED"].includes(booking.capacityReservation.status)) {
        await tx.capacityLimit.updateMany({
          where: { id: booking.capacityReservation.capacityLimitId, reserved: { gte: booking.capacityReservation.quantity } },
          data: { reserved: { decrement: booking.capacityReservation.quantity } }
        });
        await tx.capacityReservation.update({
          where: { id: booking.capacityReservation.id },
          data: { status: "RELEASED", releaseReason: "Payment failed 3 times", releasedAt: new Date() }
        });
      }

      const updated = await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: "DECLINED",
          statusHistory: {
            create: {
              fromState: booking.status,
              toState: "DECLINED",
              reason: `Auto-cancelled after ${failedCount} failed payment attempts (${failureReason || failureCode || "Unknown failure"})`
            }
          }
        }
      });

      await tx.notificationOutbox.upsert({
        where: { idempotencyKey: `payment-exhausted:${booking.id}:${failedCount}` },
        create: {
          userId: booking.customerId,
          channel: "IN_APP",
          templateKey: "booking.payment_exhausted",
          destination: booking.customerId,
          payload: { bookingId: booking.id, attempts: failedCount, reason: failureReason },
          idempotencyKey: `payment-exhausted:${booking.id}:${failedCount}`
        },
        update: {}
      });

      return { action: "AUTO_CANCELLED" as const, bookingId: booking.id, attempts: failedCount };
    } else {
      await tx.notificationOutbox.upsert({
        where: { idempotencyKey: `payment-retry-prompt:${booking.id}:${failedCount}` },
        create: {
          userId: booking.customerId,
          channel: "IN_APP",
          templateKey: "booking.payment_retry_needed",
          destination: booking.customerId,
          payload: {
            bookingId: booking.id,
            remainingAttempts: MAX_PAYMENT_ATTEMPTS - failedCount,
            failureCode,
            failureReason
          },
          idempotencyKey: `payment-retry-prompt:${booking.id}:${failedCount}`
        },
        update: {}
      });

      return {
        action: "RETRY_REQUESTED" as const,
        bookingId: booking.id,
        attempts: failedCount,
        remainingAttempts: MAX_PAYMENT_ATTEMPTS - failedCount
      };
    }
  });
}
