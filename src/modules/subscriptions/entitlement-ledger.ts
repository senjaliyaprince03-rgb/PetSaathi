/**
 * Entitlement Ledger Operations
 * Ensures append-only, idempotent credit/debit operations
 */

import "server-only";

import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

/**
 * Grant entitlement credits (idempotent)
 * Used for subscription renewals and purchases
 */
export async function grantEntitlementCredits(
  subscriptionId: string,
  entitlementKey: string,
  credits: number,
  reason: string,
  idempotencyKey: string
): Promise<void> {
  if (credits <= 0) {
    throw new Error("Credits must be positive");
  }

  await prisma.$transaction(async (tx) => {
    // Check if this grant already exists (idempotency)
    const existing = await tx.entitlementLedger.findFirst({
      where: {
        subscriptionId,
        entitlementKey,
        referenceType: "credit_grant",
        referenceId: idempotencyKey
      }
    });

    if (existing) {
      // Already processed - return silently
      return;
    }

    // Get current balance
    const latest = await tx.entitlementLedger.findFirst({
      where: { subscriptionId, entitlementKey },
      orderBy: { createdAt: "desc" },
      select: { balanceAfter: true }
    });

    const currentBalance = latest?.balanceAfter ?? 0;
    const newBalance = currentBalance + credits;

    // Create ledger entry
    await tx.entitlementLedger.create({
      data: {
        subscriptionId,
        entitlementKey,
        delta: credits,
        balanceAfter: newBalance,
        reason,
        referenceType: "credit_grant",
        referenceId: idempotencyKey
      }
    });
  });
}

/**
 * Consume entitlement credits (idempotent)
 * Used for booking redemption
 */
export async function consumeEntitlementCredits(
  subscriptionId: string,
  entitlementKey: string,
  credits: number,
  reason: string,
  idempotencyKey: string
): Promise<{ success: boolean; balanceAfter: number }> {
  if (credits <= 0) {
    throw new Error("Credits to consume must be positive");
  }

  return await prisma.$transaction(async (tx) => {
    // Check if this consumption already exists (idempotency)
    const existing = await tx.entitlementLedger.findFirst({
      where: {
        subscriptionId,
        entitlementKey,
        referenceType: "consumption",
        referenceId: idempotencyKey
      },
      select: { balanceAfter: true }
    });

    if (existing) {
      // Already processed - return existing balance
      return { success: true, balanceAfter: existing.balanceAfter };
    }

    // Get current balance
    const latest = await tx.entitlementLedger.findFirst({
      where: { subscriptionId, entitlementKey },
      orderBy: { createdAt: "desc" },
      select: { balanceAfter: true }
    });

    const currentBalance = latest?.balanceAfter ?? 0;

    // Check if sufficient credits
    if (currentBalance < credits) {
      return { success: false, balanceAfter: currentBalance };
    }

    const newBalance = currentBalance - credits;

    // Create ledger entry (negative delta for consumption)
    await tx.entitlementLedger.create({
      data: {
        subscriptionId,
        entitlementKey,
        delta: -credits,
        balanceAfter: newBalance,
        reason,
        referenceType: "consumption",
        referenceId: idempotencyKey
      }
    });

    return { success: true, balanceAfter: newBalance };
  });
}

/**
 * Get current entitlement balance
 */
export async function getEntitlementBalance(
  subscriptionId: string,
  entitlementKey: string
): Promise<number> {
  const latest = await prisma.entitlementLedger.findFirst({
    where: { subscriptionId, entitlementKey },
    orderBy: { createdAt: "desc" },
    select: { balanceAfter: true }
  });

  return latest?.balanceAfter ?? 0;
}

/**
 * Get all entitlement balances for a subscription
 */
export async function getAllEntitlementBalances(
  subscriptionId: string
): Promise<Record<string, number>> {
  // Get latest entry for each entitlement key
  const entries = await prisma.entitlementLedger.groupBy({
    by: ["entitlementKey"],
    where: { subscriptionId },
    _max: { createdAt: true }
  });

  const balances: Record<string, number> = {};

  for (const entry of entries) {
    const latest = await prisma.entitlementLedger.findFirst({
      where: {
        subscriptionId,
        entitlementKey: entry.entitlementKey,
        createdAt: entry._max.createdAt ?? undefined
      },
      select: { balanceAfter: true }
    });

    balances[entry.entitlementKey] = latest?.balanceAfter ?? 0;
  }

  return balances;
}

/**
 * Refund entitlement credits (idempotent)
 * Used for booking cancellations
 */
export async function refundEntitlementCredits(
  subscriptionId: string,
  entitlementKey: string,
  credits: number,
  reason: string,
  idempotencyKey: string
): Promise<void> {
  if (credits <= 0) {
    throw new Error("Credits to refund must be positive");
  }

  await prisma.$transaction(async (tx) => {
    // Check if this refund already exists (idempotency)
    const existing = await tx.entitlementLedger.findFirst({
      where: {
        subscriptionId,
        entitlementKey,
        referenceType: "refund",
        referenceId: idempotencyKey
      }
    });

    if (existing) {
      // Already processed - return silently
      return;
    }

    // Get current balance
    const latest = await tx.entitlementLedger.findFirst({
      where: { subscriptionId, entitlementKey },
      orderBy: { createdAt: "desc" },
      select: { balanceAfter: true }
    });

    const currentBalance = latest?.balanceAfter ?? 0;
    const newBalance = currentBalance + credits;

    // Create ledger entry (positive delta for refund)
    await tx.entitlementLedger.create({
      data: {
        subscriptionId,
        entitlementKey,
        delta: credits,
        balanceAfter: newBalance,
        reason,
        referenceType: "refund",
        referenceId: idempotencyKey
      }
    });
  });
}

/**
 * Generate idempotency key for entitlement operations
 */
export function generateEntitlementIdempotencyKey(
  operation: string,
  ...parts: string[]
): string {
  return `entitlement:${operation}:${parts.join(":")}`;
}
