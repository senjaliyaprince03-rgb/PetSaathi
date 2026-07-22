import { NextResponse } from "next/server";

import { getCurrentIdentity } from "@/modules/auth/session";
import { getLoyaltySummary } from "@/modules/loyalty/rewards";
import { getUserTier } from "@/modules/loyalty/tiers";
import { getUserBenefits } from "@/modules/loyalty/benefits";

export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const summary = await getLoyaltySummary(identity.id);
  const tierInfo = await getUserTier(identity.id);
  const benefits = await getUserBenefits(identity.id);

  return NextResponse.json({
    balancePaise: summary.balancePaise,
    totalEarned: summary.totalEarned,
    totalSpent: summary.totalSpent,
    rewardCount: summary.rewardCount,
    tier: {
      current: tierInfo.currentTier,
      next: tierInfo.nextTier,
      pointsToNext: tierInfo.pointsToNextTier,
    },
    benefits,
  });
}
