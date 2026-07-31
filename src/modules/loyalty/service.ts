import { PrismaClient, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

export class LoyaltyError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "LoyaltyError";
  }
}

export async function getLoyaltyBalance(userId: string) {
  const latestEntry = await prisma.loyaltyLedger.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  return latestEntry?.balanceAfter ?? 0;
}

export async function getLoyaltyHistory(userId: string, limit = 50) {
  return await prisma.loyaltyLedger.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
}

export async function awardLoyaltyPoints(
  userId: string,
  delta: number,
  reason: string,
  idempotencyKey: string,
  referenceType?: string,
  referenceId?: string
) {
  if (delta <= 0) {
    throw new LoyaltyError("invalid_amount", "Delta for award must be positive");
  }

  return await prisma.$transaction(async (tx) => {
    // Check idempotency
    const existing = await tx.loyaltyLedger.findUnique({
      where: { idempotencyKey }
    });
    if (existing) {
      return existing;
    }

    // Lock user for balance update (in a real high-concurrency app we might use raw SQL pg_advisory_xact_lock or FOR UPDATE)
    const latest = await tx.loyaltyLedger.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const currentBalance = latest?.balanceAfter ?? 0;
    const balanceAfter = currentBalance + delta;

    return await tx.loyaltyLedger.create({
      data: {
        userId,
        delta,
        balanceAfter,
        reason,
        idempotencyKey,
        referenceType,
        referenceId
      }
    });
  });
}

export async function redeemLoyaltyPoints(
  userId: string,
  delta: number,
  reason: string,
  idempotencyKey: string,
  referenceType?: string,
  referenceId?: string
) {
  if (delta <= 0) {
    throw new LoyaltyError("invalid_amount", "Delta for redeem must be positive (it will be subtracted)");
  }

  return await prisma.$transaction(async (tx) => {
    // Check idempotency
    const existing = await tx.loyaltyLedger.findUnique({
      where: { idempotencyKey }
    });
    if (existing) {
      return existing;
    }

    const latest = await tx.loyaltyLedger.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const currentBalance = latest?.balanceAfter ?? 0;
    if (currentBalance < delta) {
      throw new LoyaltyError("insufficient_balance", "Not enough loyalty points");
    }
    const balanceAfter = currentBalance - delta;

    return await tx.loyaltyLedger.create({
      data: {
        userId,
        delta: -delta,
        balanceAfter,
        reason,
        idempotencyKey,
        referenceType,
        referenceId
      }
    });
  });
}
