import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { validRazorpaySignature } from "@/modules/payments/signature";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = (await headers()).get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret || !signature) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!validRazorpaySignature(body, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const eventId = payload.id ?? `evt_${randomUUID()}`;
    const eventType = payload.event;
    
    // Idempotency check: Have we processed this webhook event already?
    const existingEvent = await prisma.paymentEvent.findUnique({
      where: { providerEventId: eventId },
    });

    if (existingEvent) {
      return NextResponse.json({ received: true, message: "Already processed" });
    }

    // Save event
    const savedEvent = await prisma.paymentEvent.create({
      data: {
        provider: "razorpay",
        providerEventId: eventId,
        eventType,
        payload: payload,
        payloadHash: signature,
      },
    });

    // Handle event based on type
    const entity = payload.payload?.payment?.entity;
    
    if (!entity) {
      return NextResponse.json({ received: true });
    }

    const providerOrderId = entity.order_id;
    const providerPaymentId = entity.id;

    if (eventType === "payment.authorized" || eventType === "payment.captured" || eventType === "order.paid") {
      const payment = await prisma.payment.findUnique({
        where: { providerOrderId },
      });
      if (payment && payment.status !== "CAPTURED") {
        await prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { id: payment.id },
            data: {
              status: "CAPTURED",
              providerPaymentId,
              capturedAt: new Date(),
            },
          });
          
          await tx.booking.update({
            where: { id: payment.bookingId },
            data: { status: "CONFIRMED" },
          });

          await tx.paymentEvent.update({
            where: { id: savedEvent.id },
            data: { processedAt: new Date() },
          });
        });
        
        logger.info("Payment captured", { event: "webhook.payment_captured", bookingId: payment.bookingId });
        
        const booking = await prisma.booking.findUnique({
          where: { id: payment.bookingId },
          include: { customer: true }
        });
        
        if (booking?.customer?.email) {
          const { sendBookingConfirmationEmail } = await import("@/lib/email/booking-confirmation");
          const { sendPaymentReceiptEmail } = await import("@/lib/email/payment-receipt");
          
          await sendBookingConfirmationEmail(booking.id, booking.customer.email);
          await sendPaymentReceiptEmail(payment.id, booking.customer.email);
        }
      }
    } else if (eventType === "payment.failed") {
      const payment = await prisma.payment.findUnique({
        where: { providerOrderId },
      });
      if (payment) {
        await prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { id: payment.id },
            data: {
              status: "FAILED",
              failureCode: entity.error_code,
              failureReason: entity.error_description,
            },
          });
          await tx.paymentEvent.update({
            where: { id: savedEvent.id },
            data: { processedAt: new Date() },
          });
        });
      }
    } else if (eventType === "refund.processed") {
      const refundEntity = payload.payload?.refund?.entity;
      if (refundEntity) {
        const refund = await prisma.refund.findUnique({
          where: { providerRefundId: refundEntity.id },
        });
        
        if (refund) {
          await prisma.$transaction(async (tx) => {
            await tx.refund.update({
              where: { id: refund.id },
              data: { status: "COMPLETED" },
            });
            await tx.paymentEvent.update({
              where: { id: savedEvent.id },
              data: { processedAt: new Date() },
            });
          });
        }
      }
    } else {
       await prisma.paymentEvent.update({
          where: { id: savedEvent.id },
          data: { processedAt: new Date() },
       });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    logger.error(err instanceof Error ? err : new Error(String(err)), { event: "webhook.error" });
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}
