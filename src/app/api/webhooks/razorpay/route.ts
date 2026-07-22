import { createHash } from "node:crypto";

import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { isDatabaseConfigured, prisma } from "@/lib/db";
import { validRazorpaySignature } from "@/modules/payments/signature";
import { canTransitionSubscription } from "@/modules/subscriptions/state-machine";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !isDatabaseConfigured()) return NextResponse.json({ error: "webhook_not_configured" }, { status: 503 });

  const signature = request.headers.get("x-razorpay-signature");
  const eventId = request.headers.get("x-razorpay-event-id");
  const rawBody = await request.text();
  if (!signature || !eventId || !validRazorpaySignature(rawBody, signature, secret)) return NextResponse.json({ error: "invalid_signature" }, { status: 401 });

  let payload: unknown;
  try { payload = JSON.parse(rawBody); } catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }
  const eventType = readEventType(payload);

  let event = await prisma.paymentEvent.findUnique({ where: { providerEventId: eventId } });
  if (!event) {
    try {
      event = await prisma.paymentEvent.create({ data: { provider: "razorpay", providerEventId: eventId, eventType, payload: payload as Prisma.InputJsonValue, payloadHash: createHash("sha256").update(rawBody).digest("hex") } });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") throw error;
      event = await prisma.paymentEvent.findUnique({ where: { providerEventId: eventId } });
    }
  }
  if (!event) return NextResponse.json({ error: "event_storage_failed" }, { status: 500 });
  if (event.processedAt) return NextResponse.json({ accepted: true, duplicate: true });

  try {
    await processEvent(event.id, eventType, payload);
    return NextResponse.json({ accepted: true }, { status: 202 });
  } catch (error) {
    await prisma.paymentEvent.update({ where: { id: event.id }, data: { attempts: { increment: 1 }, processingError: error instanceof Error ? error.message.slice(0, 500) : "Unknown processing error" } });
    return NextResponse.json({ error: "processing_failed" }, { status: 500 });
  }
}

async function processEvent(eventRecordId: string, eventType: string, payload: unknown) {
  const subscriptionEntity = readSubscriptionEntity(payload);
  if (subscriptionEntity && eventType.startsWith("subscription.")) {
    await prisma.$transaction(async (tx) => {
      const subscription = await tx.subscription.findUnique({ where: { providerSubscriptionId: subscriptionEntity.id }, include: { planVersion: { select: { entitlements: true } } } });
      if (!subscription) throw new Error("Subscription is unknown");
      const toState = mapSubscriptionStatus(subscriptionEntity.status);
      if (!canTransitionSubscription(subscription.status, toState)) {
        await tx.paymentEvent.update({ where: { id: eventRecordId }, data: { processedAt: new Date(), attempts: { increment: 1 }, processingError: `Ignored out-of-order subscription transition ${subscription.status} to ${toState}` } });
        return;
      }
      await tx.subscription.update({ where: { id: subscription.id }, data: { status: toState, currentPeriodStart: unixDate(subscriptionEntity.currentStart), currentPeriodEnd: unixDate(subscriptionEntity.currentEnd) } });
      if (eventType === "subscription.charged") await grantSubscriptionEntitlements(tx, subscription.id, subscription.planVersion.entitlements, eventRecordId);
      await tx.paymentEvent.update({ where: { id: eventRecordId }, data: { processedAt: new Date(), attempts: { increment: 1 }, processingError: null } });
    });
    return;
  }

  const refundEntity = readRefundEntity(payload);
  if (refundEntity && ["refund.created", "refund.processed", "refund.failed"].includes(eventType)) {
    await prisma.$transaction(async (tx) => {
      const refund = await tx.refund.findUnique({ where: { providerRefundId: refundEntity.id }, include: { payment: { select: { id: true, providerPaymentId: true, amountPaise: true } } } });
      if (!refund) throw new Error("Refund is unknown");
      if (refund.amountPaise !== refundEntity.amount || refund.payment.providerPaymentId !== refundEntity.paymentId) throw new Error("Provider refund does not match the approved request");
      const status = eventType === "refund.processed" ? "COMPLETED" : eventType === "refund.failed" ? "FAILED" : "PROCESSING";
      await tx.refund.update({ where: { id: refund.id }, data: { status, completedAt: status === "COMPLETED" ? new Date() : null } });
      if (status === "COMPLETED") {
        const completed = await tx.refund.aggregate({ where: { paymentId: refund.payment.id, status: "COMPLETED" }, _sum: { amountPaise: true } });
        const refundedPaise = completed._sum.amountPaise ?? 0;
        await tx.payment.update({ where: { id: refund.payment.id }, data: { status: refundedPaise >= refund.payment.amountPaise ? "REFUNDED" : "PARTIALLY_REFUNDED" } });
      }
      await tx.paymentEvent.update({ where: { id: eventRecordId }, data: { processedAt: new Date(), attempts: { increment: 1 }, processingError: null } });
    });
    return;
  }

  const entity = readPaymentEntity(payload);
  if (!entity || !["payment.captured", "payment.failed"].includes(eventType)) {
    await prisma.paymentEvent.update({ where: { id: eventRecordId }, data: { processedAt: new Date(), attempts: { increment: 1 }, processingError: null } });
    return;
  }

  await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { providerOrderId: entity.orderId }, include: { booking: { select: { id: true, reference: true, customerId: true, status: true } } } });
    if (!payment) throw new Error("Payment order is unknown");
    if (payment.amountPaise !== entity.amount || payment.currency !== entity.currency) throw new Error("Provider amount or currency does not match the server quote");

    if (eventType === "payment.captured") {
      await tx.payment.update({ where: { id: payment.id }, data: { providerPaymentId: entity.id, status: "CAPTURED", signatureVerified: true, capturedAt: new Date() } });
      if (payment.booking.status === "PAYMENT_PENDING") {
        await tx.booking.update({ where: { id: payment.booking.id }, data: { status: "CONFIRMED", statusHistory: { create: { fromState: "PAYMENT_PENDING", toState: "CONFIRMED", reason: "Verified Razorpay capture webhook" } } } });
      }
      await tx.notificationOutbox.upsert({
        where: { idempotencyKey: `booking-confirmed:${payment.booking.id}:${payment.id}` },
        create: {
          userId: payment.booking.customerId,
          channel: "IN_APP",
          templateKey: "booking.confirmed",
          destination: payment.booking.customerId,
          payload: { bookingId: payment.booking.id, reference: payment.booking.reference },
          idempotencyKey: `booking-confirmed:${payment.booking.id}:${payment.id}`
        },
        update: {}
      });
    } else {
      await tx.payment.update({ where: { id: payment.id }, data: { providerPaymentId: entity.id, status: "FAILED", failureCode: entity.errorCode, failureReason: entity.errorDescription } });
    }
    await tx.paymentEvent.update({ where: { id: eventRecordId }, data: { processedAt: new Date(), attempts: { increment: 1 }, processingError: null } });
  });
}

async function grantSubscriptionEntitlements(tx: Prisma.TransactionClient, subscriptionId: string, value: Prisma.JsonValue, eventRecordId: string) {
  if (await tx.entitlementLedger.count({ where: { subscriptionId, referenceType: "subscription_event", referenceId: eventRecordId } })) return;
  if (typeof value !== "object" || value === null || Array.isArray(value)) return;
  for (const [entitlementKey, deltaValue] of Object.entries(value)) {
    if (typeof deltaValue !== "number" || !Number.isInteger(deltaValue) || deltaValue <= 0) continue;
    const latest = await tx.entitlementLedger.findFirst({ where: { subscriptionId, entitlementKey }, orderBy: { createdAt: "desc" }, select: { balanceAfter: true } });
    await tx.entitlementLedger.create({ data: { subscriptionId, entitlementKey, delta: deltaValue, balanceAfter: (latest?.balanceAfter ?? 0) + deltaValue, reason: "Verified Razorpay subscription charge", referenceType: "subscription_event", referenceId: eventRecordId } });
  }
}

function readSubscriptionEntity(payload: unknown) {
  if (typeof payload !== "object" || !payload || !("payload" in payload)) return null;
  const root = payload.payload;
  if (typeof root !== "object" || !root || !("subscription" in root)) return null;
  const subscription = root.subscription;
  if (typeof subscription !== "object" || !subscription || !("entity" in subscription)) return null;
  const entity = subscription.entity;
  if (typeof entity !== "object" || !entity) return null;
  const value = entity as Record<string, unknown>;
  const statuses = ["created", "authenticated", "active", "pending", "halted", "cancelled", "completed", "expired"] as const;
  if (typeof value.id !== "string" || typeof value.status !== "string" || !(statuses as readonly string[]).includes(value.status)) return null;
  return { id: value.id, status: value.status as typeof statuses[number], currentStart: typeof value.current_start === "number" ? value.current_start : null, currentEnd: typeof value.current_end === "number" ? value.current_end : null };
}

function mapSubscriptionStatus(status: NonNullable<ReturnType<typeof readSubscriptionEntity>>["status"]) {
  if (status === "active") return "ACTIVE" as const;
  if (status === "pending") return "PAST_DUE" as const;
  if (status === "halted") return "PAUSED" as const;
  if (status === "cancelled") return "CANCELLED" as const;
  if (status === "completed" || status === "expired") return "EXPIRED" as const;
  return "INCOMPLETE" as const;
}

function unixDate(value: number | null) { return value ? new Date(value * 1000) : null; }

function readRefundEntity(payload: unknown) {
  if (typeof payload !== "object" || !payload || !("payload" in payload)) return null;
  const root = payload.payload;
  if (typeof root !== "object" || !root || !("refund" in root)) return null;
  const refund = root.refund;
  if (typeof refund !== "object" || !refund || !("entity" in refund)) return null;
  const entity = refund.entity;
  if (typeof entity !== "object" || !entity) return null;
  const value = entity as Record<string, unknown>;
  if (typeof value.id !== "string" || typeof value.payment_id !== "string" || typeof value.amount !== "number") return null;
  return { id: value.id, paymentId: value.payment_id, amount: value.amount };
}

function readEventType(payload: unknown) {
  return typeof payload === "object" && payload && "event" in payload && typeof payload.event === "string" ? payload.event : "unknown";
}

function readPaymentEntity(payload: unknown) {
  if (typeof payload !== "object" || !payload || !("payload" in payload)) return null;
  const root = payload.payload;
  if (typeof root !== "object" || !root || !("payment" in root)) return null;
  const payment = root.payment;
  if (typeof payment !== "object" || !payment || !("entity" in payment)) return null;
  const entity = payment.entity;
  if (typeof entity !== "object" || !entity) return null;
  const value = entity as Record<string, unknown>;
  if (typeof value.id !== "string" || typeof value.order_id !== "string" || typeof value.amount !== "number" || typeof value.currency !== "string") return null;
  return { id: value.id, orderId: value.order_id, amount: value.amount, currency: value.currency, errorCode: typeof value.error_code === "string" ? value.error_code : undefined, errorDescription: typeof value.error_description === "string" ? value.error_description : undefined };
}
