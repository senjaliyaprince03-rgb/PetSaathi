import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

// ──────────────────────────────────────────────────────────
// Reward rules — behaviour-linked, not gamified
// ──────────────────────────────────────────────────────────

export const REWARD_RULES = {
  COMPLETED_SERVICE: { creditsPaise: 5000, reason: "Loyalty reward: completed service" },
  SUBSCRIPTION_RENEWAL: { creditsPaise: 10000, reason: "Loyalty reward: subscription renewal" },
  REFERRAL_COMPLETED: { creditsPaise: 15000, reason: "Loyalty reward: successful referral" },
  FIVE_STAR_REVIEW: { creditsPaise: 2000, reason: "Loyalty reward: 5-star review" },
} as const;

export type RewardType = keyof typeof REWARD_RULES;

// ──────────────────────────────────────────────────────────
// Award a loyalty reward (idempotent)
// ──────────────────────────────────────────────────────────

export async function awardLoyaltyReward(params: {
  userId: string;
  rewardType: RewardType;
  referenceType: string;
  referenceId: string;
}): Promise<{ id: string; balanceAfter: number; creditsPaise: number }> {
  const rule = REWARD_RULES[params.rewardType];
  const idempotencyKey = `loyalty_${params.rewardType}_${params.referenceId}`;

  const existing = await prisma.loyaltyLedger.findUnique({ where: { idempotencyKey } });
  if (existing) return { id: existing.id, balanceAfter: existing.balanceAfter, creditsPaise: rule.creditsPaise };

  return prisma.$transaction(async (tx) => {
    const last = await tx.loyaltyLedger.findFirst({ where: { userId: params.userId }, orderBy: { createdAt: "desc" }, select: { balanceAfter: true } });
    const currentBalance = last?.balanceAfter ?? 0;
    const newBalance = currentBalance + rule.creditsPaise;

    const entry = await tx.loyaltyLedger.create({
      data: {
        userId: params.userId,
        delta: rule.creditsPaise,
        balanceAfter: newBalance,
        reason: rule.reason,
        referenceType: params.referenceType,
        referenceId: params.referenceId,
        idempotencyKey,
      },
    });

    return { id: entry.id, balanceAfter: entry.balanceAfter, creditsPaise: rule.creditsPaise };
  }, { });
}

// ──────────────────────────────────────────────────────────
// Loyalty summary for a user
// ──────────────────────────────────────────────────────────

export async function getLoyaltySummary(userId: string): Promise<{
  balancePaise: number;
  totalEarned: number;
  totalSpent: number;
  rewardCount: number;
}> {
  const entries = await prisma.loyaltyLedger.findMany({ where: { userId }, select: { delta: true, balanceAfter: true } });

  if (entries.length === 0) return { balancePaise: 0, totalEarned: 0, totalSpent: 0, rewardCount: 0 };

  const last = await prisma.loyaltyLedger.findFirst({ where: { userId }, orderBy: { createdAt: "desc" }, select: { balanceAfter: true } });
  const totalEarned = entries.filter((e) => e.delta > 0).reduce((s, e) => s + e.delta, 0);
  const totalSpent = entries.filter((e) => e.delta < 0).reduce((s, e) => s + Math.abs(e.delta), 0);

  return {
    balancePaise: last?.balanceAfter ?? 0,
    totalEarned,
    totalSpent,
    rewardCount: entries.filter((e) => e.delta > 0).length,
  };
}
