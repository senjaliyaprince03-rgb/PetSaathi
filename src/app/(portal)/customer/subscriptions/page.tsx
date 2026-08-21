import { redirect } from "next/navigation";
import { Sparkles, CalendarDays } from "lucide-react";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { SubscriptionCard } from "@/components/portal/subscription-card";

export default async function CustomerSubscriptionsPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/customer/subscriptions");

  // Fetch available CUSTOMER plans
  const availablePlans = await prisma.planVersion.findMany({
    where: { active: true, audience: "CUSTOMER" },
    orderBy: { pricePaise: "asc" },
  });

  // Fetch user's active subscriptions
  const userSubscriptions = await prisma.subscription.findMany({
    where: { userId: identity.id, status: { in: ["ACTIVE", "INCOMPLETE"] } },
    select: { planVersionId: true, status: true }
  });

  const activePlanIds = new Set(userSubscriptions.map((sub) => sub.planVersionId));

  return (
    <PortalShell mode="customer" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/80">Memberships</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Pet Parent Subscriptions</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/80 mb-10">Subscribe to recurring care packages and premium memberships. Gain priority matching, dedicated sitters, and zero service fees on routine care.</p>
        
        {availablePlans.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availablePlans.map((plan) => (
              <SubscriptionCard
                key={plan.id}
                plan={plan}
                isSubscribed={activePlanIds.has(plan.id)}
                features={[
                  "Priority matching for all bookings",
                  "Dedicated support concierge",
                  "Zero service fees",
                  "Free cancellation up to 24h"
                ]}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-5xl p-10 text-center">
            <Sparkles className="mx-auto h-10 w-10 text-leaf" />
            <h2 className="mt-5 font-display text-3xl font-semibold">No membership plans available yet.</h2>
            <p className="mt-2 text-sm text-ink/80">We are currently designing our premium membership plans. Check back soon!</p>
          </div>
        )}
      </div>
    </PortalShell>
  );
}
