import { BadgeCheck, LockKeyhole, Repeat2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro, PublicShell } from "@/components/marketing/public-shell";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { isFeatureEnabled } from "@/modules/features/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import { CustomerSubscriptionActions } from "@/components/portal/customer-subscription-actions";

export const metadata: Metadata = { title: "Membership", robots: { index: false, follow: true } };
export const dynamic = "force-dynamic";

export default async function MembershipPage() {
  const enabled = await isFeatureEnabled("subscriptions");
  const identity = await getCurrentIdentity();
  const plans = enabled ? await prisma.planVersion.findMany({ where: { active: true, providerPlanId: { not: null } }, orderBy: { pricePaise: "asc" }, select: { id: true, name: true, audience: true, pricePaise: true, billingInterval: true, entitlements: true } }) : [];
  
  return (
    <PublicShell>
      <PageIntro eyebrow="controlled membership" title="A steadier care rhythm, when the pilot is ready." description="Membership remains server-gated until final pricing, mandates, cancellation rules and entitlement operations are approved." />
      <section className="container-shell">
        {plans.length ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan.id} className="rounded-5xl border border-ink/10 bg-paper p-8 shadow-lifted">
                <Repeat2 className="h-7 w-7 text-indigo" />
                <p className="mt-8 text-xs font-bold uppercase tracking-[0.17em] text-ink/45">{plan.audience}</p>
                <h2 className="mt-2 font-display text-4xl font-semibold">{plan.name}</h2>
                <p className="mt-5 font-display text-3xl font-semibold">
                  ₹{(plan.pricePaise / 100).toLocaleString("en-IN")} <span className="font-sans text-sm text-ink/45">/ {plan.billingInterval.toLowerCase()}</span>
                </p>
                <div className="mt-5 flex items-start gap-2 text-sm text-ink/55">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
                  Entitlements are ledger-backed and activate only after a verified provider webhook.
                </div>
                {identity ? (
                  <CustomerSubscriptionActions planVersionId={plan.id} />
                ) : (
                  <Link href={`/login?returnTo=/membership`} className={`${buttonVariants({ variant: "accent" })} mt-7 block text-center w-full`}>
                    Sign in to continue
                  </Link>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl rounded-5xl border border-saffron/25 bg-saffron/10 p-10 text-center">
            <LockKeyhole className="mx-auto h-10 w-10 text-indigo" />
            <h2 className="mt-5 font-display text-4xl font-semibold">Membership is not open yet.</h2>
            <p className="mt-4 leading-7 text-ink/60">No plan, price, mandate or benefit is presented as purchasable before the controlled pilot gate is approved.</p>
            <Link href="/contact?topic=GENERAL" className={`${buttonVariants({ variant: "outline" })} mt-7`}>Register interest</Link>
          </div>
        )}
      </section>
    </PublicShell>
  );
}
