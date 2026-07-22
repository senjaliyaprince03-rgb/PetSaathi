import { getUserTier, type TierName } from "./tiers";

export const TIER_BENEFITS: Record<TierName, string[]> = {
  BRONZE: ["Standard matching priority"],
  SILVER: ["Priority matching queue", "Free schedule changes (up to 24h before)"],
  GOLD: ["Top-tier matching queue", "Waived cancellation fees", "Free pet health report sync"],
  PLATINUM: ["Dedicated support line", "Free last-minute emergency booking fee", "Exclusive partner discounts"],
};

export async function getUserBenefits(userId: string): Promise<string[]> {
  const { currentTier } = await getUserTier(userId);
  return TIER_BENEFITS[currentTier] ?? TIER_BENEFITS.BRONZE;
}

export async function hasBenefit(userId: string, benefitKeyword: string): Promise<boolean> {
  const benefits = await getUserBenefits(userId);
  return benefits.some((b) => b.toLowerCase().includes(benefitKeyword.toLowerCase()));
}
