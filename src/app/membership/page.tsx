import type { Metadata, Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, LockKeyhole, Repeat2, ShieldCheck, Users } from "lucide-react";

import { CustomerSubscriptionActions } from "@/components/portal/customer-subscription-actions";
import { PublicShell } from "@/components/marketing/public-shell";
import { buttonVariants } from "@/components/ui/button";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { isFeatureEnabled } from "@/modules/features/server";

export const metadata: Metadata = { 
  title: "Membership & Care Passes | PetSaathi", 
  description: "Predictable routine care passes, priority Saathi assignment, ledger-backed credits, and dedicated supervisor support for your pets.",
  openGraph: {
    title: "Membership & Care Passes | PetSaathi",
    description: "Predictable routine care passes, priority Saathi assignment, and dedicated supervisor support for your pets.",
    url: "https://petsaathi.in/membership",
    siteName: "PetSaathi",
    images: [{ url: "/images/membership-hero-luxury-banner.webp", width: 1200, height: 630, alt: "PetSaathi Membership" }],
    locale: "en_IN",
    type: "website",
  },
  robots: { index: true, follow: true } 
};
export const dynamic = "force-dynamic";

export default async function MembershipPage() {
  const enabled = await isFeatureEnabled("subscriptions");
  const identity = await getCurrentIdentity();
  const membershipBenefits = [
    {
      icon: Users,
      title: "Priority assignment",
      copy: "Member requests are matched with extra care and local context.",
    },
    {
      icon: ShieldCheck,
      title: "Controlled access",
      copy: "The system keeps membership rules narrow so approvals stay trustworthy.",
    },
    {
      icon: Clock3,
      title: "Stable routine care",
      copy: "Regular visits and repeat bookings are easier to plan and follow.",
    },
    {
      icon: BadgeCheck,
      title: "Supervisor support",
      copy: "A verified process helps keep updates clear and accountable.",
    },
  ] as const;
  const membershipSteps = [
    ["01", "Choose care", "Start with the service and frequency that fits your routine."],
    ["02", "Check eligibility", "Local capacity and service rules are reviewed on the server."],
    ["03", "Approve the proposal", "You confirm the plan only after the offer is matched."],
    ["04", "Keep it steady", "Once active, the routine can be managed with less effort."],
  ] as const;
  const plans = (enabled && isDatabaseConfigured())
    ? await prisma.planVersion.findMany({
        where: { active: true, providerPlanId: { not: null } },
        orderBy: { pricePaise: "asc" },
        select: { id: true, name: true, audience: true, pricePaise: true, billingInterval: true, entitlements: true }
      })
    : [];

  return (
    <PublicShell>
      {/* 1. FULL-BLEED HERO BANNER (LEFT ALIGNED) */}
      <section className="relative h-[480px] sm:h-[560px] lg:h-[620px] w-full overflow-hidden bg-ink text-paper">
        <Image
          src="/images/membership-hero-luxury-banner.webp"
          alt="Luxury pet lounge membership experience"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[70%_center] sm:object-[60%_center] lg:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-transparent md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

        <div className="container-shell relative flex h-full flex-col justify-center pb-10 pt-28 sm:pt-32">
          <div className="max-w-xl md:max-w-2xl text-left items-start flex flex-col">
            <span className="inline-flex items-center gap-2 rounded-full border border-saffron/40 bg-saffron/20 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-saffron backdrop-blur-md font-outfit">
              <BadgeCheck className="h-3.5 w-3.5" /> Controlled Membership
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-paper sm:text-6xl sm:leading-[1.1]">
              A STEADIER CARE RHYTHM
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base font-medium leading-7 text-paper/85">
              Predictable routine care, priority Saathi assignment, ledger-backed credits, and dedicated supervisor support.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/book"
                className={buttonVariants({ variant: "accent", size: "lg", className: "rounded-full px-8 font-outfit shadow-lifted" })}
              >
                Explore Member Care <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MEMBERSHIP FLOW CONTENT */}
      <section className="bg-paper pb-16 pt-16">
        <div className="container-shell">
          <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <article className="rounded-[2.5rem] bg-[#281d2b] p-8 text-paper shadow-lifted">
              <span className="inline-flex items-center gap-2 rounded-full border border-saffron/40 bg-saffron/15 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-saffron">
                <BadgeCheck className="h-3.5 w-3.5" />
                Why membership feels steadier
              </span>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Membership works best when the routine stays predictable.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-paper/80">
                The plan is meant for families that want regular care, careful matching,
                and fewer surprises around scheduling.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-paper/10 bg-paper/[0.05] p-5">
                  <p className="font-display text-2xl font-bold text-saffron">Zero Rush</p>
                  <p className="mt-2 text-xs leading-6 text-paper/80">
                    Every session is scheduled with ample buffer time so no caregiver rushes through feeding or walks.
                  </p>
                </div>
                <div className="rounded-3xl border border-paper/10 bg-paper/[0.05] p-5">
                  <p className="font-display text-2xl font-bold text-saffron">Same Saathi</p>
                  <p className="mt-2 text-xs leading-6 text-paper/80">
                    Dedicated primary caregiver consistency so your pets bond with a familiar, trusted companion.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-[2.5rem] border border-indigo/10 bg-cream/40 p-8 shadow-lifted">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo/20 bg-indigo/10 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-indigo">
                <Repeat2 className="h-3.5 w-3.5" />
                How the member flow works
              </span>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.04em]">
                A simple path from request to routine.
              </h2>
              <div className="mt-7 grid gap-4">
                {membershipSteps.map(([number, title, copy]) => (
                  <div key={number} className="flex gap-4 rounded-3xl border border-ink/10 bg-paper p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo/10 font-display text-lg font-semibold text-indigo">
                      {number}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-ink/80">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <div className="mx-auto mt-10 max-w-2xl rounded-[2.5rem] border border-saffron/25 bg-saffron/10 p-8 sm:p-10 text-center shadow-lifted">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron/20 text-saffron">
              <LockKeyhole className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-ink">Membership Waitlist Active</h2>
            <p className="mt-3 text-sm leading-7 text-ink/80">
              PetSaathi memberships roll out society-by-society to ensure dedicated caregiver density, zero rush, and strict safety standards. Register your society to unlock member passes.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/book" className={buttonVariants({ variant: "primary", size: "lg", className: "rounded-full px-8 font-outfit" })}>
                Book Pay-As-You-Go Care <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
              <Link
                href={"/contact?topic=SOCIETY_PARTNERSHIP" as Route}
                className="inline-flex items-center gap-1.5 rounded-full border border-indigo/20 bg-paper px-6 py-3 text-sm font-bold text-indigo hover:border-indigo/40 hover:bg-indigo/5"
              >
                Join Society Waitlist <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {plans.length > 0 ? (
            <div className="mt-10 grid gap-8 lg:grid-cols-3">
              {plans.map((plan) => (
                <article key={plan.id} className="rounded-[2.5rem] border border-ink/10 bg-paper p-8 shadow-lifted">
                  <Repeat2 className="h-7 w-7 text-indigo" />
                  <p className="mt-8 text-xs font-bold uppercase tracking-[0.17em] text-ink/80">{plan.audience}</p>
                  <h2 className="mt-2 font-display text-4xl font-semibold">{plan.name}</h2>
                  <p className="mt-5 font-display text-2xl font-semibold text-ink">
                    Pricing coming soon
                  </p>
                  <div className="mt-5 flex items-start gap-2 text-sm text-ink/80">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
                    Entitlements are ledger-backed and activate only after a verified provider webhook.
                  </div>
                  {identity ? (
                    <CustomerSubscriptionActions planVersionId={plan.id} />
                  ) : (
                    <Link href={`/login?returnTo=/membership`} className={`${buttonVariants({ variant: "accent" })} mt-7 block text-center w-full rounded-2xl`}>
                      Sign in to continue
                    </Link>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-12">
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo font-outfit">Upcoming Pass Tiers</span>
                <h3 className="mt-2 font-display text-3xl font-bold text-ink">Preview Membership Plans</h3>
                <p className="mt-2 text-sm text-ink/70 max-w-xl mx-auto">
                  Fixed predictable monthly rates for recurring care routines in launched society clusters.
                </p>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {[
                  {
                    name: "Care Pass Starter",
                    audience: "Working Pet Parents",
                    price: "Pricing coming soon",
                    badge: "Most Popular",
                    features: [
                      "8 Scheduled Routine Walks / Visits",
                      "Dedicated Primary Saathi + Vetted Backup",
                      "Zero Booking or Peak Surcharge Fees",
                      "Real-Time Milestone Photos & GPS Route"
                    ]
                  },
                  {
                    name: "Daily Routine Pass",
                    audience: "Active Canine Routines",
                    price: "Pricing coming soon",
                    badge: "Best Value",
                    features: [
                      "24 Monthly Care Outings or Sitting Sessions",
                      "Dedicated Primary Saathi Pairing",
                      "Free Rollover of Unused Sessions (Up to 4)",
                      "Priority Clinical & Vet Dispatch Access"
                    ]
                  },
                  {
                    name: "Society VIP Concierge",
                    audience: "Multi-Pet Households",
                    price: "Pricing coming soon",
                    badge: "All-Inclusive",
                    features: [
                      "Unlimited Priority Dispatch Scheduling",
                      "Multi-Pet Household Coverage (Up to 3 Pets)",
                      "Priority Holiday Boarding Host Allocation",
                      "Direct Senior Ops Supervisor Support"
                    ]
                  }
                ].map((tier) => (
                  <article key={tier.name} className="flex flex-col justify-between rounded-[2.5rem] border border-ink/10 bg-paper p-8 shadow-lifted transition hover:-translate-y-1 hover:border-indigo/30">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[0.68rem] font-bold uppercase tracking-wider text-indigo bg-indigo/10 px-3 py-1 rounded-full">
                          {tier.badge}
                        </span>
                        <Repeat2 className="h-5 w-5 text-ink/40" />
                      </div>
                      <h4 className="mt-4 font-display text-2xl font-bold text-ink">{tier.name}</h4>
                      <p className="text-xs text-ink/60 font-medium mt-1">{tier.audience}</p>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="font-display text-xl font-bold text-ink">{tier.price}</span>
                        <span className="text-xs font-medium text-ink/60">(society launch)</span>
                      </div>
                      <ul className="mt-6 space-y-2.5 text-xs text-ink/80 border-t border-ink/10 pt-6">
                        {tier.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2">
                            <BadgeCheck className="h-4 w-4 shrink-0 text-leaf mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link
                      href={"/contact?topic=SOCIETY_PARTNERSHIP" as Route}
                      className="mt-8 block text-center w-full rounded-full bg-ink py-3 text-xs font-bold text-paper transition hover:bg-ink/90 shadow-sm"
                    >
                      Request Early Access
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {membershipBenefits.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="rounded-4xl border border-indigo/10 bg-paper p-6 shadow-soft">
                <Icon className="h-7 w-7 text-coral" />
                <h3 className="mt-4 font-display text-2xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink/80">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
