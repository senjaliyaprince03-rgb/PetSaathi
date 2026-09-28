import { providerDeadline } from "@/modules/payments/provider-deadline";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { validRazorpayCheckoutSignature } from "@/modules/payments/signature";
import { canTransitionBooking } from "@/modules/bookings/state-machine";
import { canTransitionPayment } from "@/modules/payments/state-machine";
import { createRazorpayClient } from "@/modules/payments/razorpay";

const verifySchema = z.object({ orderId: z.string().min(8).max(100), paymentId: z.string().min(8).max(100), signature: z.string().regex(/^[a-f0-9]{64}$/i) });

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return NextResponse.json({ error: "payments_not_configured" }, { status: 503 });

  const parsed = verifySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { orderId, paymentId, signature } = parsed.data;

  const payment = await prisma.payment.findFirst({
    where: { providerOrderId: orderId, booking: { customerId: identity.id } },
    include: { booking: true }
  });
  if (!payment) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!validRazorpayCheckoutSignature(orderId, paymentId, signature, secret)) return NextResponse.json({ error: "invalid_signature" }, { status: 400 });

  const terminalBookingStatuses = [
    "CUSTOMER_CANCELLED",
    "SITTER_CANCELLED",
    "DECLINED",
    "COMPLETED",
    "CLOSED",
  ];
  if (terminalBookingStatuses.includes(payment.booking.status)) {
    return NextResponse.json(
      {
        error: "terminal_state",
        message: `Cannot verify payment for a booking in terminal state '${payment.booking.status}'`,
      },
      { status: 409 }
    );
  }

  const terminalPaymentStatuses = ["REFUNDED", "FAILED"];
  if (terminalPaymentStatuses.includes(payment.status)) {
    return NextResponse.json(
      {
        error: "terminal_state",
        message: `Cannot verify payment with terminal payment status '${payment.status}'`,
      },
      { status: 409 }
    );
  }

  const provider = createRazorpayClient();
  if (!provider) return NextResponse.json({ error: "payments_not_configured" }, { status: 503 });
  let captured;
  try { captured = await providerDeadline(provider.payments.fetch(paymentId)); }
  catch { return NextResponse.json({ error: "provider_verification_unavailable" }, { status: 503 }); }
  if (captured.id !== paymentId || captured.order_id !== orderId || captured.status !== "captured" ||
      Number(captured.amount) !== payment.amountPaise || captured.currency !== payment.currency ||
      payment.amountPaise !== payment.booking.quoteAmountPaise || payment.currency !== payment.booking.currency ||
      (payment.providerPaymentId && payment.providerPaymentId !== paymentId)) {
    return NextResponse.json({ error: "provider_payment_mismatch" }, { status: 409 });
  }
  let changed = false;
  try {
    changed = await prisma.$transaction(async tx => {
      const current = await tx.payment.findFirst({ where: { id: payment.id, providerOrderId: orderId, booking: { customerId: identity.id } }, include: { booking: true } });
      if (!current || current.amountPaise !== Number(captured.amount) || current.currency !== captured.currency ||
          current.amountPaise !== current.booking.quoteAmountPaise || current.currency !== current.booking.currency ||
          (current.providerPaymentId && current.providerPaymentId !== paymentId)) throw new Error("payment_changed");
      if (current.status === "CAPTURED" && current.providerPaymentId === paymentId) return false;
      if (!canTransitionPayment(current.status, "CAPTURED") || !canTransitionBooking(current.booking.status, "CONFIRMED")) throw new Error("invalid_transition");
      const assigned = await tx.bookingAssignment.updateMany({ where: { bookingId: current.bookingId, status: "CUSTOMER_APPROVED" }, data: { status: "ACTIVE", activatedAt: new Date() } });
      if (assigned.count !== 1) throw new Error("approved_assignment_required");
      await tx.payment.update({ where: { id: current.id, status: current.status }, data: { providerPaymentId: paymentId, signatureVerified: true, status: "CAPTURED", capturedAt: new Date() } });
      await tx.booking.update({ where: { id: current.bookingId, status: current.booking.status }, data: { status: "CONFIRMED", statusHistory: { create: { fromState: current.booking.status, toState: "CONFIRMED", actorId: identity.id, reason: "Provider capture reconciled after checkout signature" } } } });
      for (const channel of ["IN_APP", ...(current.booking.customerId ? ["EMAIL"] : [])] as const) {
        const customer = channel === "EMAIL" ? await tx.user.findUnique({ where: { id: identity.id }, select: { email: true } }) : null;
        if (channel === "EMAIL" && !customer?.email) continue;
        const key = "booking-confirmed:" + current.bookingId + ":" + current.id + ":" + channel;
        await tx.notificationOutbox.upsert({ where: { idempotencyKey: key }, create: { userId: identity.id, channel: channel as "EMAIL" | "IN_APP", templateKey: "booking.confirmed", destination: customer?.email ?? identity.id, payload: { bookingId: current.bookingId, reference: current.booking.reference }, idempotencyKey: key }, update: {} });
      }
      return true;
    });
  } catch {
    return NextResponse.json({ error: "payment_state_conflict", message: "Payment must be reconciled before confirmation." }, { status: 409 });
  }
  if (changed) {
    // Optional MyGate visitor registration if society gate integration is active
    try {
      const confirmedBooking = await prisma.booking.findUnique({
        where: { id: payment.bookingId },
        include: {
          address: true,
          assignments: {
            where: { status: "ACTIVE" },
            take: 1,
            include: { sitter: { include: { user: true } } },
          },
        },
      });

      if (confirmedBooking?.assignments[0]?.sitter?.user) {
        const sitterUser = confirmedBooking.assignments[0].sitter.user;
        const { registerMygateVisitor } = await import("@/lib/mygate");
        await registerMygateVisitor({
          societyGateId: confirmedBooking.addressId,
          visitorName: sitterUser.displayName,
          visitorPhone: sitterUser.phoneE164 || "",
          purposeOfVisit: `PetSaathi care service for booking ${confirmedBooking.reference}`,
          scheduledEntryTime: confirmedBooking.scheduledStart,
          scheduledExitTime: confirmedBooking.scheduledEnd,
          unitNumber: confirmedBooking.address.line1,
        });
      }
    } catch (mygateErr) {
      console.error("[MyGate] Pre-approval registration notice:", mygateErr);
    }

  }
  return NextResponse.json({ verified: true, settlement: "captured" });
}
