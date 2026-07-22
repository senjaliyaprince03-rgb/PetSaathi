import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { createRazorpayClient } from "@/modules/payments/razorpay";

export const dynamic = "force-dynamic";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await context.params;

  const booking = await prisma.booking.findFirst({
    where: { id, customerId: identity.id },
    select: { id: true, reference: true, status: true, quoteAmountPaise: true, currency: true, payments: { where: { status: { in: ["CREATED", "PENDING", "AUTHORIZED", "CAPTURED"] } }, orderBy: { createdAt: "desc" }, take: 1 } }
  });
  if (!booking) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (booking.status !== "PAYMENT_PENDING") return NextResponse.json({ error: "invalid_booking_state", message: "Payment is not available in the current booking state." }, { status: 409 });

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const existing = booking.payments[0];
  if (existing?.providerOrderId.startsWith("creating-")) return NextResponse.json({ error: "order_in_progress", message: "Payment setup is already in progress. Try again in a moment." }, { status: 409 });
  if (existing && keyId) return NextResponse.json({ order: { ...publicOrder(existing.providerOrderId, existing.amountPaise, existing.currency), keyId }, reused: true });

  const razorpay = createRazorpayClient();
  if (!razorpay || !keyId) return NextResponse.json({ error: "payments_not_configured" }, { status: 503 });

  const placeholderOrderId = `creating-${randomUUID()}`;
  const payment = await prisma.payment.create({ data: { bookingId: booking.id, providerOrderId: placeholderOrderId, amountPaise: booking.quoteAmountPaise, currency: booking.currency, status: "CREATED" } });

  try {
    const order = await razorpay.orders.create({
      amount: booking.quoteAmountPaise,
      currency: booking.currency,
      receipt: booking.reference,
      notes: { bookingId: booking.id, paymentRecordId: payment.id }
    });
    await prisma.payment.update({ where: { id: payment.id }, data: { providerOrderId: order.id, status: "PENDING" } });
    return NextResponse.json({ order: { ...publicOrder(order.id, booking.quoteAmountPaise, booking.currency), keyId } }, { status: 201 });
  } catch {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED", failureCode: "ORDER_CREATE_FAILED", failureReason: "Provider order creation failed" } });
    return NextResponse.json({ error: "provider_unavailable", message: "Payment setup could not be completed. No charge was made." }, { status: 502 });
  }
}

function publicOrder(id: string, amount: number, currency: string) {
  return { id, amount, currency };
}
