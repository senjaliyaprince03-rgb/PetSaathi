import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, LockKeyhole, Repeat2, Sparkles } from "lucide-react";

import { CustomerSubscriptionActions } from "@/components/portal/customer-subscription-actions";
import { PublicShell } from "@/components/marketing/public-shell";
import { buttonVariants } from "@/components/ui/button";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { isFeatureEnabled } from "@/modules/features/server";

export const metadata: Metadata = { title: "Membership | PetSaathi", robots: { index: false, follow: true } };
export const dynamic = "force-dynamic";

export default async function MembershipPage() {
  const enabled = await isFeatureEnabled("subscriptions");
  const identity = await getCurrentIdentity();
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
      <section className="relative h-[560px] sm:h-[620px] w-full overflow-hidden bg-ink text-paper">
        <Image
          src="/images/membership-hero-luxury-banner.jpg"
          alt="Luxury pet lounge membership experience"
          fill
          priority          sizes="100vw"
          className="object-cover object-[75%_center] sm:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-transparent md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

        <div className="container-shell relative flex h-full flex-col justify-center pb-10 pt-28 sm:pt-32">
          <div className="max-w-xl md:max-w-2xl text-left items-start flex flex-col">
            <span className="inline-flex items-center gap-2 rounded-full border border-saffron/40 bg-saffron/20 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-saffron backdrop-blur-md font-outfit">
              <Sparkles className="h-3.5 w-3.5" /> Controlled Membership
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

      {/* 2. PLANS & MEMBERSHIP CONTENT */}
      <section className="bg-paper pb-28 pt-16">
        <div className="container-shell">
          {plans.length ? (
            <div className="grid gap-8 lg:grid-cols-3">
              {plans.map((plan) => (
                <article key={plan.id} className="rounded-[2.5rem] border border-ink/10 bg-paper p-8 shadow-lifted">
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
                    <Link href={`/login?returnTo=/membership`} className={`${buttonVariants({ variant: "accent" })} mt-7 block text-center w-full rounded-2xl`}>
                      Sign in to continue
                    </Link>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-2xl rounded-[2.5rem] border border-saffron/25 bg-saffron/10 p-10 text-center shadow-lifted">
              <LockKeyhole className="mx-auto h-12 w-12 text-indigo" />
              <h2 className="mt-4 font-display text-3xl font-bold text-ink">Membership Enrollment Controlled</h2>
              <p className="mt-3 text-sm leading-7 text-ink/65">
                Membership plans remain server-gated until final pricing mandates, local capacity, and cancellation rules are approved in your locality.
              </p>
              <Link href="/book" className={buttonVariants({ variant: "primary", size: "lg", className: "mt-6 rounded-full px-8 font-outfit" })}>
                Book Pay-As-You-Go Care <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
