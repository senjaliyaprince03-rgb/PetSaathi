import { prisma } from "@/lib/db";
import { SubscriptionStatus } from "@prisma/client";
import { randomUUID } from "node:crypto";

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
  return await prisma.planVersion.create({
    data: {
      ...data,
      totalBillingCycles: data.totalBillingCycles ?? 12,
      providerPlanId: `mock_plan_${randomUUID()}`,
    },
  });
}

/**
 * Initiates a subscription for a user to a specific plan.
 */
export async function createSubscription(userId: string, planVersionId: string) {
  const plan = await prisma.planVersion.findUnique({ where: { id: planVersionId } });
  if (!plan) throw new SubscriptionError("plan_not_found", "Plan version not found");

  return await prisma.subscription.create({
    data: {
      userId,
      planVersionId,
      providerSubscriptionId: `mock_sub_${randomUUID()}`,
      status: SubscriptionStatus.INCOMPLETE,
    },
  });
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
