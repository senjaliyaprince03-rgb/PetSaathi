import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

// ──────────────────────────────────────────────────────────
// Errors
// ──────────────────────────────────────────────────────────

export class InsufficientCreditsError extends Error {
  constructor(public readonly available: number, public readonly requested: number) {
    super(`Insufficient credits: available ${available}, requested ${requested}`);
    this.name = "InsufficientCreditsError";
  }
}

// ──────────────────────────────────────────────────────────
// Credit operations (uses LoyaltyLedger as the ledger table)
// ──────────────────────────────────────────────────────────

interface CreditParams {
  userId: string;
  amountPaise: number;
  reason: string;
  referenceType?: string;
  referenceId?: string;
  idempotencyKey: string;
}

export async function issueCredits(params: CreditParams): Promise<{ id: string; balanceAfter: number }> {
  // Idempotency guard
  const existing = await prisma.loyaltyLedger.findUnique({ where: { idempotencyKey: params.idempotencyKey } });
  if (existing) return { id: existing.id, balanceAfter: existing.balanceAfter };

  return prisma.$transaction(async (tx) => {
    const last = await tx.loyaltyLedger.findFirst({ where: { userId: params.userId }, orderBy: { createdAt: "desc" }, select: { balanceAfter: true } });
    const currentBalance = last?.balanceAfter ?? 0;
    const newBalance = currentBalance + params.amountPaise;

    const entry = await tx.loyaltyLedger.create({
      data: {
        userId: params.userId,
        delta: params.amountPaise,
        balanceAfter: newBalance,
        reason: params.reason,
        referenceType: params.referenceType ?? null,
        referenceId: params.referenceId ?? null,
        idempotencyKey: params.idempotencyKey,
      },
    });

    return { id: entry.id, balanceAfter: entry.balanceAfter };
  }, { });
}

export async function consumeCredits(params: CreditParams): Promise<{ id: string; balanceAfter: number }> {
  const existing = await prisma.loyaltyLedger.findUnique({ where: { idempotencyKey: params.idempotencyKey } });
  if (existing) return { id: existing.id, balanceAfter: existing.balanceAfter };

  return prisma.$transaction(async (tx) => {
    const last = await tx.loyaltyLedger.findFirst({ where: { userId: params.userId }, orderBy: { createdAt: "desc" }, select: { balanceAfter: true } });
    const currentBalance = last?.balanceAfter ?? 0;

    if (currentBalance < params.amountPaise) throw new InsufficientCreditsError(currentBalance, params.amountPaise);

    const newBalance = currentBalance - params.amountPaise;
    const entry = await tx.loyaltyLedger.create({
      data: {
        userId: params.userId,
        delta: -params.amountPaise,
        balanceAfter: newBalance,
        reason: params.reason,
        referenceType: params.referenceType ?? null,
        referenceId: params.referenceId ?? null,
        idempotencyKey: params.idempotencyKey,
      },
    });

    return { id: entry.id, balanceAfter: entry.balanceAfter };
  }, { });
}

export async function getBalance(userId: string): Promise<number> {
  const last = await prisma.loyaltyLedger.findFirst({ where: { userId }, orderBy: { createdAt: "desc" }, select: { balanceAfter: true } });
  return last?.balanceAfter ?? 0;
}

export async function reverseCredits(params: { userId: string; originalEntryId: string; reason: string; idempotencyKey: string }): Promise<{ id: string; balanceAfter: number }> {
  const existing = await prisma.loyaltyLedger.findUnique({ where: { idempotencyKey: params.idempotencyKey } });
  if (existing) return { id: existing.id, balanceAfter: existing.balanceAfter };

  return prisma.$transaction(async (tx) => {
    const original = await tx.loyaltyLedger.findUniqueOrThrow({ where: { id: params.originalEntryId } });
    const last = await tx.loyaltyLedger.findFirst({ where: { userId: params.userId }, orderBy: { createdAt: "desc" }, select: { balanceAfter: true } });
    const currentBalance = last?.balanceAfter ?? 0;
    const reversalDelta = -original.delta;
    const newBalance = currentBalance + reversalDelta;

    const entry = await tx.loyaltyLedger.create({
      data: {
        userId: params.userId,
        delta: reversalDelta,
        balanceAfter: newBalance,
        reason: params.reason,
        referenceType: "reversal",
        referenceId: original.id,
        idempotencyKey: params.idempotencyKey,
      },
    });

    return { id: entry.id, balanceAfter: entry.balanceAfter };
  }, { });
}
