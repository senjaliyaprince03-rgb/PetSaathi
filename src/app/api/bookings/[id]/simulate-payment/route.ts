import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (process.env.NODE_ENV === "production" && process.env.PLAYWRIGHT_TEST !== "1") {
    return NextResponse.json({ error: "not_found", message: "Simulation endpoint is disabled in production" }, { status: 404 });
  }

  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id: bookingId } = await context.params;

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, customerId: identity.id },
    include: {
      payments: { orderBy: { createdAt: "desc" }, take: 1 },
      assignments: { where: { status: { in: ["CUSTOMER_APPROVED", "ACCEPTED"] } } }
    }
  });

  if (!booking) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (booking.status !== "PAYMENT_PENDING") {
    return NextResponse.json({
      error: "invalid_state",
      message: `Booking is not in PAYMENT_PENDING state (current: ${booking.status})`
    }, { status: 409 });
  }

  const providerOrderId = `order_sim_${Date.now().toString(36)}_${randomUUID().slice(0, 6)}`;
  const providerPaymentId = `pay_sim_${Date.now().toString(36)}_${randomUUID().slice(0, 6)}`;

  await prisma.$transaction(async (tx) => {
    // 1. Create or update payment record
    await tx.payment.create({
      data: {
        bookingId: booking.id,
        amountPaise: booking.quoteAmountPaise,
        currency: booking.currency,
        provider: "RAZORPAY",
        providerOrderId,
        providerPaymentId,
        status: "CAPTURED",
        signatureVerified: true,
        capturedAt: new Date()
      }
    });

    // 2. Transition booking to CONFIRMED
    await tx.booking.update({
      where: { id: booking.id },
      data: {
        status: "CONFIRMED",
        statusHistory: {
          create: {
            fromState: "PAYMENT_PENDING",
            toState: "CONFIRMED",
            actorId: identity.id,
            reason: "Simulated test checkout verified"
          }
        }
      }
    });

    // 3. Mark customer approved assignment as ACTIVE
    if (booking.assignments.length > 0) {
      await tx.bookingAssignment.updateMany({
        where: { bookingId: booking.id, status: { in: ["CUSTOMER_APPROVED", "ACCEPTED"] } },
        data: { status: "ACTIVE" }
      });
    }

    // 4. Audit log
    await tx.auditLog.create({
      data: {
        actorId: identity.id,
        actorRole: "CUSTOMER",
        action: "booking.payment_simulated_success",
        resourceType: "booking",
        resourceId: booking.id,
        before: { status: "PAYMENT_PENDING" },
        after: { status: "CONFIRMED" },
        reason: "Test payment verified in simulation mode"
      }
    });
  });

  return NextResponse.json({
    success: true,
    bookingStatus: "CONFIRMED",
    message: "Payment successfully authorized and booking confirmed!"
  });
}
