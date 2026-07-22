import { getLoyaltySummary } from "./rewards";

export const LOYALTY_TIERS = {
  BRONZE: { name: "Bronze", minPoints: 0, multiplier: 1.0 },
  SILVER: { name: "Silver", minPoints: 10000, multiplier: 1.25 }, // 10k points (₹100) lifetime earned
  GOLD: { name: "Gold", minPoints: 50000, multiplier: 1.5 },   // 50k points (₹500) lifetime earned
  PLATINUM: { name: "Platinum", minPoints: 150000, multiplier: 2.0 },
} as const;

export type TierName = keyof typeof LOYALTY_TIERS;

export async function getUserTier(userId: string): Promise<{
  currentTier: TierName;
  nextTier: TierName | null;
  pointsToNextTier: number | null;
  lifetimePoints: number;
}> {
  const summary = await getLoyaltySummary(userId);
  const lifetimePoints = summary.totalEarned; // Tiers are based on lifetime earned, not current balance

  let currentTier: TierName = "BRONZE";
  let nextTier: TierName | null = "SILVER";
  let pointsToNextTier: number | null = LOYALTY_TIERS.SILVER.minPoints - lifetimePoints;

  if (lifetimePoints >= LOYALTY_TIERS.PLATINUM.minPoints) {
    currentTier = "PLATINUM";
    nextTier = null;
    pointsToNextTier = null;
  } else if (lifetimePoints >= LOYALTY_TIERS.GOLD.minPoints) {
    currentTier = "GOLD";
    nextTier = "PLATINUM";
    pointsToNextTier = LOYALTY_TIERS.PLATINUM.minPoints - lifetimePoints;
  } else if (lifetimePoints >= LOYALTY_TIERS.SILVER.minPoints) {
    currentTier = "SILVER";
    nextTier = "GOLD";
    pointsToNextTier = LOYALTY_TIERS.GOLD.minPoints - lifetimePoints;
  }

  return { currentTier, nextTier, pointsToNextTier, lifetimePoints };
}
