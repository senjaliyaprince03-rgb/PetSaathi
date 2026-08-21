import { redirect } from "next/navigation";
import { Award } from "lucide-react";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { SubscriptionCard } from "@/components/portal/subscription-card";

export default async function PartnerMembershipPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) redirect("/login?returnTo=/partners/membership");

  // Fetch available SITTER plans
  const availablePlans = await prisma.planVersion.findMany({
    where: { active: true, audience: "SITTER" },
    orderBy: { pricePaise: "asc" },
  });

  // Fetch user's active subscriptions
  const userSubscriptions = await prisma.subscription.findMany({
    where: { userId: identity.id, status: { in: ["ACTIVE", "INCOMPLETE"] } },
    select: { planVersionId: true }
  });

  const activePlanIds = new Set(userSubscriptions.map((sub) => sub.planVersionId));

  return (
    <PortalShell mode="saathi" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/80">Grow your business</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Sitter Pro Membership</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/80 mb-10">Upgrade to Sitter Pro to unlock zero-commission bookings, priority ranking in search results, and advanced business analytics.</p>
        
        {availablePlans.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availablePlans.map((plan) => (
              <SubscriptionCard
                key={plan.id}
                plan={plan}
                isSubscribed={activePlanIds.has(plan.id)}
                features={[
                  "0% Platform Commission",
                  "Priority Search Ranking",
                  "Advanced Analytics Dashboard",
                  "Direct Messaging with Customers"
                ]}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-5xl p-10 text-center">
            <Award className="mx-auto h-10 w-10 text-saffron" />
            <h2 className="mt-5 font-display text-3xl font-semibold">Pro Membership coming soon.</h2>
            <p className="mt-2 text-sm text-ink/80">We are currently designing our Pro tier. Keep delivering great service!</p>
          </div>
        )}
      </div>
    </PortalShell>
  );
}
