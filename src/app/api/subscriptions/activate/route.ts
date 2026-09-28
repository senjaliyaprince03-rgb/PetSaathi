import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentIdentity } from "@/modules/auth/session";
import { isFeatureEnabled } from "@/modules/features/server";
import { createSubscription, SubscriptionError } from "@/modules/subscriptions/service";

const input = z.object({ planVersionId: z.string().uuid(), petId: z.string().uuid() });
export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!await isFeatureEnabled("subscriptions")) return NextResponse.json({ error: "subscriptions_disabled" }, { status: 404 });
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 422 });
  try {
    const subscription = await createSubscription(identity.id, parsed.data.planVersionId, parsed.data.petId);
    return NextResponse.json({ subscriptionId: subscription.id, razorpaySubscriptionId: subscription.providerSubscriptionId, shortUrl: subscription.checkoutUrl }, { status: 201 });
  } catch (error) {
    const code = error instanceof SubscriptionError ? error.code : "subscription_reconciliation_required";
    return NextResponse.json({ error: code }, { status: code === "pet_not_owned" ? 403 : 503 });
  }
}
