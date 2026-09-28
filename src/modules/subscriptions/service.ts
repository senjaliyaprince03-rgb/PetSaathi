import { providerDeadline } from "@/modules/payments/provider-deadline";
import { createRazorpayClient } from "@/modules/payments/razorpay";
import { prisma } from "@/lib/db";
import { SubscriptionStatus } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { canTransitionSubscription } from "./state-machine";

export class SubscriptionError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

/**
 * Creates a new immutable plan version.
 */
export async function createPlanVersion(data: {
  planKey: string;
  version: number;
  name: string;
  audience: string;
  pricePaise: number;
  billingInterval: string;
  totalBillingCycles?: number;
  entitlements: any;
}) {
  const periods: Record<string, "daily" | "weekly" | "monthly" | "yearly"> = { DAILY: "daily", WEEKLY: "weekly", MONTHLY: "monthly", YEARLY: "yearly" };
  const period = periods[data.billingInterval.toUpperCase()];
  if (!period || data.pricePaise <= 0 || (data.totalBillingCycles ?? 12) < 1) throw new SubscriptionError("invalid_plan", "Invalid billing configuration");
  const provider = createRazorpayClient();
  if (!provider) throw new SubscriptionError("provider_unavailable", "Payment provider is not configured");
  // Persist an inactive intention first; an uncertain external outcome must not create another plan.
  const plan = await prisma.planVersion.create({ data: { ...data, totalBillingCycles: data.totalBillingCycles ?? 12, active: false } });
  const remote = await providerDeadline(provider.plans.create({ period, interval: 1, item: { name: data.name, amount: data.pricePaise, currency: "INR" }, notes: { plan_version_id: plan.id } }));
  if (!/^plan_[A-Za-z0-9]+$/.test(remote.id)) throw new SubscriptionError("invalid_provider_plan", "Provider did not return a valid plan");
  return prisma.planVersion.update({ where: { id: plan.id }, data: { providerPlanId: remote.id } });
}

/** One durable subscription intention, shared by both customer entry routes. */
export async function createSubscription(userId: string, planVersionId: string, petId?: string) {
  if (petId && !await prisma.pet.findFirst({ where: { id: petId, ownerId: userId }, select: { id: true } })) throw new SubscriptionError("pet_not_owned", "Pet is not owned by this customer");
  const plan = await prisma.planVersion.findFirst({ where: { id: planVersionId, active: true } });
  if (!plan?.providerPlanId || !/^plan_[A-Za-z0-9]+$/.test(plan.providerPlanId)) throw new SubscriptionError("plan_provider_not_configured", "Active provider plan required");
  const provider = createRazorpayClient();
  if (!provider) throw new SubscriptionError("provider_unavailable", "Payment provider is not configured");
  const remotePlan = await providerDeadline(provider.plans.fetch(plan.providerPlanId));
  if (remotePlan.id !== plan.providerPlanId || Number(remotePlan.item.amount) !== plan.pricePaise || remotePlan.item.currency !== "INR") throw new SubscriptionError("plan_mismatch", "Provider plan differs from the configured plan");
  const intent = await prisma.$transaction(async tx => {
    // Concurrent creations for one customer conflict on this common document.
    await tx.user.update({ where: { id: userId }, data: { updatedAt: new Date() } });
    const existing = await tx.subscription.findFirst({ where: { userId, planVersionId, status: { in: ["INCOMPLETE", "ACTIVE", "PAUSED", "GRACE", "PAST_DUE"] } } });
    if (existing) return { subscription: existing, created: false };
    return { subscription: await tx.subscription.create({ data: { userId, planVersionId, status: "INCOMPLETE" } }), created: true };
  });
  if (intent.subscription.providerSubscriptionId) {
    const remote = await providerDeadline(provider.subscriptions.fetch(intent.subscription.providerSubscriptionId));
    return { ...intent.subscription, checkoutUrl: remote.short_url };
  }
  if (!intent.created) {
    const matches = (await providerDeadline(provider.subscriptions.all({ count: 100 }))).items.filter(item => item.notes?.subscription_id === intent.subscription.id);
    if (matches.length !== 1 || !matches[0]) throw new SubscriptionError("subscription_reconciliation_required", "Provider result is uncertain; do not create another subscription");
    const updated = await prisma.subscription.update({ where: { id: intent.subscription.id }, data: { providerSubscriptionId: matches[0].id } });
    return { ...updated, checkoutUrl: matches[0].short_url };
  }
  const remote = await providerDeadline(provider.subscriptions.create({ plan_id: plan.providerPlanId, total_count: plan.totalBillingCycles, quantity: 1, customer_notify: 1, notes: { subscription_id: intent.subscription.id, user_id: userId, plan_version_id: plan.id, ...(petId ? { pet_id: petId } : {}) } }));
  const updated = await prisma.subscription.update({ where: { id: intent.subscription.id }, data: { providerSubscriptionId: remote.id } });
  return { ...updated, checkoutUrl: remote.short_url };
}

/**
 * Webhook handler to transition a subscription's state and credit entitlements if activated.
 */
export async function handleSubscriptionEvent(
  providerSubscriptionId: string,
  eventType: string,
  statusAfter: SubscriptionStatus
) {
  return await prisma.$transaction(async (tx) => {
    const subscription = await tx.subscription.findUnique({
      where: { providerSubscriptionId },
      include: { planVersion: true },
    });

    if (!subscription) throw new SubscriptionError("subscription_not_found", "Subscription not found");

    const statusBefore = subscription.status;

    if (statusBefore !== statusAfter && !canTransitionSubscription(statusBefore, statusAfter)) {
      throw new SubscriptionError(
        "invalid_transition",
        `Cannot transition subscription from ${statusBefore} to ${statusAfter}`
      );
    }

    const updated = await tx.subscription.update({
      where: { id: subscription.id },
      data: {
        status: statusAfter,
        currentPeriodStart: statusAfter === SubscriptionStatus.ACTIVE ? new Date() : subscription.currentPeriodStart,
        currentPeriodEnd: statusAfter === SubscriptionStatus.ACTIVE ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : subscription.currentPeriodEnd,
      },
    });

    await tx.subscriptionEvent.create({
      data: {
        subscriptionId: subscription.id,
        providerEventId: `evt_${randomUUID()}`,
        eventType,
        statusBefore,
        statusAfter,
        occurredAt: new Date(),
      }
    });

    // Credit entitlements on first activation
    if (statusBefore !== SubscriptionStatus.ACTIVE && statusAfter === SubscriptionStatus.ACTIVE) {
      const entitlements = subscription.planVersion.entitlements as Record<string, number>;
      if (entitlements && typeof entitlements === "object") {
        for (const [key, qty] of Object.entries(entitlements)) {
          // Check current balance
          const lastLedger = await tx.entitlementLedger.findFirst({
            where: { subscriptionId: subscription.id, entitlementKey: key },
            orderBy: { createdAt: "desc" }
          });
          const currentBalance = lastLedger ? lastLedger.balanceAfter : 0;
          
          await tx.entitlementLedger.create({
            data: {
              subscriptionId: subscription.id,
              entitlementKey: key,
              delta: qty,
              balanceAfter: currentBalance + qty,
              reason: "Subscription activated",
            }
          });
        }
      }
    }

    return updated;
  });
}

/**
 * Consume a specific entitlement (e.g. free cancellation).
 */
export async function consumeEntitlement(
  subscriptionId: string,
  entitlementKey: string,
  idempotencyKey: string
) {
  return await prisma.$transaction(async (tx) => {
    // Check for double spending
    const existing = await tx.entitlementConsumption.findUnique({
      where: { idempotencyKey }
    });
    if (existing) return existing; // Already consumed

    const lastLedger = await tx.entitlementLedger.findFirst({
      where: { subscriptionId, entitlementKey },
      orderBy: { createdAt: "desc" }
    });

    const balance = lastLedger ? lastLedger.balanceAfter : 0;
    if (balance <= 0) {
      throw new SubscriptionError("insufficient_balance", `No balance left for entitlement: ${entitlementKey}`);
    }

    await tx.entitlementLedger.create({
      data: {
        subscriptionId,
        entitlementKey,
        delta: -1,
        balanceAfter: balance - 1,
        reason: "Consumption",
        referenceType: "CONSUMPTION_EVENT",
        referenceId: idempotencyKey,
      }
    });

    return await tx.entitlementConsumption.create({
      data: {
        subscriptionId,
        entitlementKey,
        quantity: 1,
        idempotencyKey,
      }
    });
  });
}
