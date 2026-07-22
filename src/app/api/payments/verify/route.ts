import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { validRazorpayCheckoutSignature } from "@/modules/payments/signature";

const verifySchema = z.object({ orderId: z.string().min(8).max(100), paymentId: z.string().min(8).max(100), signature: z.string().regex(/^[a-f0-9]{64}$/i) });

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return NextResponse.json({ error: "payments_not_configured" }, { status: 503 });

  const parsed = verifySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { orderId, paymentId, signature } = parsed.data;

  const payment = await prisma.payment.findFirst({ where: { providerOrderId: orderId, booking: { customerId: identity.id } }, select: { id: true, status: true } });
  if (!payment) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!validRazorpayCheckoutSignature(orderId, paymentId, signature, secret)) return NextResponse.json({ error: "invalid_signature" }, { status: 401 });

  if (payment.status !== "CAPTURED") await prisma.payment.update({ where: { id: payment.id }, data: { providerPaymentId: paymentId, signatureVerified: true, status: "AUTHORIZED" } });
  return NextResponse.json({ verified: true, settlement: payment.status === "CAPTURED" ? "captured" : "awaiting_webhook" });
}
