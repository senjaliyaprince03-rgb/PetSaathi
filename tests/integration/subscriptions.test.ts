import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";
import { POST as PlanPOST } from "@/app/api/admin/plan-versions/route";
import { consumeEntitlement } from "@/modules/subscriptions/service";
import { randomUUID } from "node:crypto";
import { SubscriptionStatus } from "@prisma/client";

vi.mock("@/modules/auth/server", () => ({
  getAdminSession: vi.fn().mockResolvedValue("admin-123"),
}));

describe("Phase 9: Subscriptions and Entitlements Integration", () => {
  let customerId: string;

  beforeEach(async () => {
    const user = await prisma.user.create({
      data: {
        email: "sub_user@example.com",
        displayName: "Sub User",
        roles: { create: [{ role: "CUSTOMER" }] },
      }
    });
    customerId = user.id;
  });

  afterEach(async () => {
    await prisma.entitlementConsumption.deleteMany();
    await prisma.entitlementLedger.deleteMany();
    await prisma.subscriptionEvent.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.planVersion.deleteMany();
    await prisma.user.delete({ where: { id: customerId } });
  });

  it("should create a plan, subscribe, and consume entitlements", async () => {
    // 1. Admin creates a Plan Version
    const planReq = new NextRequest("http://localhost/api/admin/plan-versions", {
      method: "POST",
      body: JSON.stringify({
        planKey: "PREMIUM_TIER",
        version: 1,
        name: "Premium Pet Parent",
        audience: "CUSTOMER",
        pricePaise: 99900,
        billingInterval: "MONTHLY",
        entitlements: {
          "free_cancellation": 2,
          "vet_consultation": 1
        }
      })
    });
    const res = await PlanPOST(planReq);
    expect(res.status).toBe(201);
    const plan = await res.json();
    
    // 2. Customer subscribes (mocked manually since we can't hit Razorpay API easily in the test)
    const subscription = await prisma.subscription.create({
      data: {
        userId: customerId,
        planVersionId: plan.id,
        providerSubscriptionId: `sub_${randomUUID()}`,
        status: SubscriptionStatus.ACTIVE,
      }
    });

    // 3. Mock Webhook behavior: Give the user the entitlements
    await prisma.entitlementLedger.create({
      data: {
        subscriptionId: subscription.id,
        entitlementKey: "free_cancellation",
        delta: 2,
        balanceAfter: 2,
        reason: "Initial plan active",
      }
    });

    await prisma.entitlementLedger.create({
      data: {
        subscriptionId: subscription.id,
        entitlementKey: "vet_consultation",
        delta: 1,
        balanceAfter: 1,
        reason: "Initial plan active",
      }
    });

    // 4. Consume an entitlement
    const idempotencyKey = `cancel_${randomUUID()}`;
    const consumption = await consumeEntitlement(subscription.id, "free_cancellation", idempotencyKey);
    expect(consumption.entitlementKey).toBe("free_cancellation");

    // Verify balance is now 1
    const lastLedger = await prisma.entitlementLedger.findFirst({
      where: { subscriptionId: subscription.id, entitlementKey: "free_cancellation" },
      orderBy: { createdAt: "desc" }
    });
    expect(lastLedger?.balanceAfter).toBe(1);

    // 5. Duplicate consumption with same idempotency key returns the same consumption
    const duplicate = await consumeEntitlement(subscription.id, "free_cancellation", idempotencyKey);
    expect(duplicate.id).toBe(consumption.id);
    
    // Verify balance is still 1
    const lastLedger2 = await prisma.entitlementLedger.findFirst({
      where: { subscriptionId: subscription.id, entitlementKey: "free_cancellation" },
      orderBy: { createdAt: "desc" }
    });
    expect(lastLedger2?.balanceAfter).toBe(1);

    // 6. Over-consumption should throw
    const newKey1 = `cancel_${randomUUID()}`;
    await consumeEntitlement(subscription.id, "free_cancellation", newKey1); // Balance 0
    
    const newKey2 = `cancel_${randomUUID()}`;
    await expect(consumeEntitlement(subscription.id, "free_cancellation", newKey2))
      .rejects.toThrow("No balance left for entitlement: free_cancellation");
  });
});
