import { createSubscription, SubscriptionError } from "@/modules/subscriptions/service";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { isFeatureEnabled } from "@/modules/features/server";
import { createRazorpayClient } from "@/modules/payments/razorpay";
import { consumeRateLimit } from "@/modules/security/rate-limit";

const createSchema = z.object({ planVersionId: z.string().uuid() });

export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const subscriptions = await prisma.subscription.findMany({ where: { userId: identity.id }, orderBy: { createdAt: "desc" }, take: 25, select: { id: true, status: true, currentPeriodStart: true, currentPeriodEnd: true, cancelAtPeriodEnd: true, planVersion: { select: { name: true, audience: true, billingInterval: true } } } });
  return NextResponse.json({ subscriptions }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!await isFeatureEnabled("subscriptions")) return NextResponse.json({ error: "subscriptions_disabled" }, { status: 404 });
  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 422 });
  const rate = await consumeRateLimit("subscription-create-user", identity.id, 3, 24 * 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  try {
    const subscription = await createSubscription(identity.id, parsed.data.planVersionId);
    return NextResponse.json({ subscription }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof SubscriptionError ? error.code : "subscription_reconciliation_required" }, { status: 503 });
  }
}
