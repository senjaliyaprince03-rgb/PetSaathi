import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { SubscriptionCard } from "@/components/portal/subscription-card";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Care Passes & Monthly Memberships",
  description: "Manage your active dog walking care passes, recurring session bookings, and member discount benefits."
};

export default async function CustomerSubscriptionsPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/customer/subscriptions");

  let dbPlans: Array<{
    id: string;
    name: string;
    pricePaise: number;
    billingInterval: string;
    totalBillingCycles: number;
  }> = [];
  let userSubscriptions: Array<{ planVersionId: string; status: any }> = [];

  try {
    dbPlans = await prisma.planVersion.findMany({
      where: { active: true, audience: "CUSTOMER" },
      orderBy: { pricePaise: "asc" },
    });
    userSubscriptions = await prisma.subscription.findMany({
      where: { userId: identity.id, status: { in: ["ACTIVE", "INCOMPLETE"] } },
      select: { planVersionId: true, status: true }
    });
  } catch (err) {
    console.warn("Failed to fetch database subscriptions/plans, using static presets:", err);
  }

  const availablePlans = dbPlans.length > 0 ? dbPlans : [
    {
      id: "plan-essential",
      name: "Essential Care Pass",
      pricePaise: 99900,
      billingInterval: "MONTHLY",
      totalBillingCycles: 12
    },
    {
      id: "plan-concierge",
      name: "Premium Saathi Concierge",
      pricePaise: 249900,
      billingInterval: "MONTHLY",
      totalBillingCycles: 12
    },
    {
      id: "plan-vip",
      name: "VIP Society Elite",
      pricePaise: 499900,
      billingInterval: "MONTHLY",
      totalBillingCycles: 12
    }
  ];

  const activePlanIds = new Set(userSubscriptions.map((sub) => sub.planVersionId));

  const getPlanFeatures = (name: string) => {
    if (name.includes("VIP")) {
      return [
        "Unlimited dog walks with top 1% Saathis",
        "24/7 dedicated veterinarian hotline",
        "Free in-home grooming session every month",
        "₹1,00,000 emergency medical cover guarantee",
        "Zero platform & cancellation fees"
      ];
    }
    if (name.includes("Concierge")) {
      return [
        "12 scheduled walks or sitting sessions/mo",
        "Priority neighborhood sitter matching",
        "24/7 tele-vet consultation access",
        "₹50,000 emergency vet cover guarantee",
        "Free cancellation up to 2 hours before care"
      ];
    }
    return [
      "4 verified walks or home check-ins/mo",
      "Live GPS tracking and photo milestones",
      "₹50,000 active booking insurance",
      "Dedicated care support concierge"
    ];
  };

  return (
    <PortalShell mode="customer" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/80">Memberships &amp; Care Passes</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Pet Parent Subscriptions</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/80 mb-10">Subscribe to recurring care packages and premium memberships. Gain priority matching, dedicated sitters, and zero service fees on routine care.</p>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availablePlans.map((plan) => (
            <SubscriptionCard
              key={plan.id}
              plan={plan}
              isSubscribed={activePlanIds.has(plan.id)}
              features={getPlanFeatures(plan.name)}
            />
          ))}
        </div>
      </div>
    </PortalShell>
  );
}
