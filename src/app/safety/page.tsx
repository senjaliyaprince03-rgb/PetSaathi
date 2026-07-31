import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, FileClock, ShieldAlert, Sparkles, UserRoundCheck } from "lucide-react";

import { PublicShell } from "@/components/marketing/public-shell";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Safety | PetSaathi" };

const safetyCards = [
  [UserRoundCheck, "Evidence-specific checks", "Identity, interview, training and service permissions are separate records with status and expiry—not one vague verified label."],
  [BadgeCheck, "Permission before assignment", "A caregiver can receive only the service and pet-risk level that current evidence permits."],
  [FileClock, "A visible service trail", "Important booking, payment and service milestones create server-side history that cannot be replaced by a chat message."],
  [ShieldAlert, "A formal exception path", "Concerns move through triage, communication, response, review and corrective action with authorised closure."]
] as const;

export default function SafetyPage() {
  return (
    <PublicShell>
      {/* 1. FULL-BLEED HERO BANNER (LEFT ALIGNED) */}
      <section className="relative h-[560px] sm:h-[620px] w-full overflow-hidden bg-ink text-paper">
        <Image
          src="/images/safety-hero-luxury-banner.jpg"
          alt="Veterinary safety & wellness check for PetSaathi pets"
          fill
          priority          sizes="100vw"
          className="object-cover object-[80%_center] sm:object-[center_65%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-transparent md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

        <div className="container-shell relative flex h-full flex-col justify-center pb-10 pt-28 sm:pt-32">
          <div className="max-w-xl md:max-w-2xl text-left items-start flex flex-col">
            <span className="inline-flex items-center gap-2 rounded-full border border-saffron/40 bg-saffron/20 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-saffron backdrop-blur-md font-outfit">
              <Sparkles className="h-3.5 w-3.5" /> Proof Over Promises
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-paper sm:text-6xl sm:leading-[1.1]">
              TRUST IS BUILT IN LAYERS
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base font-medium leading-7 text-paper/85">
              No single badge can make pet care risk-free. PetSaathi combines current evidence, limited permissions, careful matching, service records, and people who respond.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/book"
                className={buttonVariants({ variant: "accent", size: "lg", className: "rounded-full px-8 font-outfit shadow-lifted" })}
              >
                Book Verified Care <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SAFETY CARDS GRID */}
      <section className="bg-paper pb-28 pt-16">
        <div className="container-shell">
          <div className="grid gap-8 md:grid-cols-2">
            {safetyCards.map(([Icon, title, copy]) => (
              <article key={title} className="group rounded-[2.5rem] border border-indigo/10 bg-paper p-8 shadow-lifted transition-all duration-500 hover:-translate-y-1 hover:border-indigo/30">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-coral/10 text-coral shadow-sm">
                  <Icon className="h-7 w-7" />
                </span>
                <h2 className="mt-8 font-display text-3xl font-bold text-ink">{title}</h2>
                <p className="mt-4 text-sm leading-7 text-ink/65">{copy}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-[2.5rem] bg-ink p-8 text-paper shadow-lifted sm:p-12">
            <p className="eyebrow !text-paper/50 font-outfit">Important Boundary</p>
            <h2 className="mt-4 font-display text-4xl font-bold">Emergency referral support is not veterinary care.</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-paper/70">
              PetSaathi can preserve clinic contacts, support escalation and document communication. It does not diagnose, treat, guarantee clinic availability, guarantee transport or provide insurance.
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
