import { ShieldAlert, Plus, Banknote } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { AdminPlanForm } from "@/components/portal/admin-plan-form";

export default async function AdminPlansPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SUPER_ADMIN", "FINANCE_ADMIN"])) redirect("/login?returnTo=/admin/plans");
  
  const plans = await prisma.planVersion.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/80">commercial strategy</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Membership Plans</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/80 mb-10">Configure recurring subscription models for customers, partners, and societies. Changes create new plan versions to protect existing active subscriptions.</p>
        
        <div className="mb-10">
          <AdminPlanForm />
        </div>

        <h2 className="font-display text-2xl font-semibold mb-6">Active Plans</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.length > 0 ? plans.map((plan) => (
            <article key={plan.id} className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
              <div className="flex flex-col gap-2">
                <span className="self-start rounded-full bg-indigo/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-indigo">{plan.audience}</span>
                <h3 className="font-display text-2xl font-semibold mt-2">{plan.name}</h3>
                <p className="text-3xl font-bold font-display mt-2">₹{(plan.pricePaise / 100).toLocaleString("en-IN")}<span className="text-sm text-ink/80 font-medium">/{plan.billingInterval.toLowerCase()}</span></p>
              </div>
              <div className="mt-6 space-y-2 text-sm text-ink/80">
                <p>Plan Key: <span className="font-mono text-ink/80">{plan.planKey}</span> v{plan.version}</p>
                <p>Cycles: <span className="font-mono text-ink/80">{plan.totalBillingCycles}</span></p>
                {plan.providerPlanId && <p>Razorpay ID: <span className="font-mono text-ink/80 text-xs">{plan.providerPlanId}</span></p>}
              </div>
            </article>
          )) : (
            <div className="sm:col-span-2 lg:col-span-3 glass-panel rounded-5xl p-10 text-center">
              <Banknote className="mx-auto h-10 w-10 text-leaf" />
              <h2 className="mt-5 font-display text-3xl font-semibold">No active plans configured.</h2>
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
