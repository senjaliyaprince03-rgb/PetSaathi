import { NextResponse } from "next/server";
import { z } from "zod";

import Razorpay from "razorpay";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { isFeatureEnabled } from "@/modules/features/server";
import { createRazorpayClient } from "@/modules/payments/razorpay";

const activateSchema = z.object({
  planVersionId: z.string().uuid(),
  petId: z.string().uuid(),
});

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!identity.roles.includes("CUSTOMER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!await isFeatureEnabled("subscriptions")) return NextResponse.json({ error: "subscriptions_disabled" }, { status: 404 });

  const parsed = activateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 422 });

  // Fetch the plan version to get Razorpay plan ID
  const planVersion = await prisma.planVersion.findUnique({
    where: { id: parsed.data.planVersionId },
    select: { id: true, providerPlanId: true, entitlements: true },
  });
  if (!planVersion?.providerPlanId) return NextResponse.json({ error: "plan_provider_not_configured" }, { status: 503 });

  // Check for existing active subscription
  const existing = await prisma.subscription.findFirst({
    where: {
      userId: identity.id,
      planVersionId: planVersion.id,
      status: { in: ["INCOMPLETE", "ACTIVE", "PAUSED", "GRACE", "PAST_DUE"] },
    },
  });
  if (existing) return NextResponse.json({ error: "subscription_already_exists", subscriptionId: existing.id }, { status: 409 });

  const razorpay = createRazorpayClient();
  if (!razorpay) return NextResponse.json({ error: "payment_provider_not_configured" }, { status: 503 });

  // Create Razorpay Subscription (e-mandate registration for UPI AutoPay)
  const rzpSubscription = await (razorpay as any).subscriptions.create({
    plan_id: planVersion.providerPlanId,
    total_count: 12, // 12 billing cycles (12 months)
    quantity: 1,
    start_at: Math.floor(Date.now() / 1000) + 86400, // starts tomorrow
    customer_notify: 1, // Razorpay notifies customer
    notes: {
      customerId: identity.id,
      petId: parsed.data.petId,
      planVersionId: planVersion.id,
    },
  });

  // Store the subscription and mandate in database
  const subscription = await prisma.subscription.create({
    data: {
      userId: identity.id,
      planVersionId: planVersion.id,
      providerSubscriptionId: rzpSubscription.id,
      status: "INCOMPLETE",
    },
  });

  // Create PaymentMandate record for the e-mandate
  await prisma.paymentMandate.create({
    data: {
      userId: identity.id,
      providerMandateId: rzpSubscription.id,
      providerName: "RAZORPAY",
      maxAmountPaise: planVersion.entitlements && typeof planVersion.entitlements === "object" && "price_paise" in planVersion.entitlements
        ? Number(planVersion.entitlements.price_paise)
        : 0,
      status: "CREATED",
    },
  });

  return NextResponse.json({
    subscriptionId: subscription.id,
    razorpaySubscriptionId: rzpSubscription.id,
    shortUrl: rzpSubscription.short_url, // Send to customer for mandate activation
  }, { status: 201 });
}