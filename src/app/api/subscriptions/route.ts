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
  const plan = await prisma.planVersion.findFirst({ where: { id: parsed.data.planVersionId, active: true }, select: { id: true, providerPlanId: true, totalBillingCycles: true } });
  if (!plan?.providerPlanId) return NextResponse.json({ error: "plan_provider_not_configured" }, { status: 503 });
  const existing = await prisma.subscription.findFirst({ where: { userId: identity.id, planVersionId: plan.id, status: { in: ["INCOMPLETE", "ACTIVE", "PAUSED", "GRACE", "PAST_DUE"] } } });
  if (existing) return NextResponse.json({ error: "subscription_already_exists", subscriptionId: existing.id }, { status: 409 });
  const razorpay = createRazorpayClient();
  if (!razorpay) return NextResponse.json({ error: "payment_provider_not_configured" }, { status: 503 });
  const provider = await razorpay.subscriptions.create({ plan_id: plan.providerPlanId, total_count: plan.totalBillingCycles, quantity: 1, customer_notify: 1, notes: { user_id: identity.id, plan_version_id: plan.id } });
  const subscription = await prisma.subscription.create({ data: { userId: identity.id, planVersionId: plan.id, providerSubscriptionId: provider.id, status: "INCOMPLETE" } });
  return NextResponse.json({ subscription: { id: subscription.id, status: subscription.status, providerSubscriptionId: provider.id, checkoutUrl: provider.short_url } }, { status: 201 });
}
