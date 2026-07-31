import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, CalendarCheck, Sparkles, UsersRound } from "lucide-react";

import { PublicShell } from "@/components/marketing/public-shell";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "For Societies | PetSaathi" };

const societyFeatures = [
  [Building2, "Controlled Access", "Document local gate and caregiver-access procedures with clear digital verification."],
  [UsersRound, "Approved Local Pool", "Build continuity with a smaller, society-aware caregiver group assigned to your campus."],
  [CalendarCheck, "Shared Service Rhythm", "Coordinate walking windows, resident interest, and community pet wellness events."]
] as const;

export default function SocietiesPage() {
  return (
    <PublicShell>
      {/* 1. FULL-BLEED HERO BANNER (LEFT ALIGNED) */}
      <section className="relative h-[560px] sm:h-[620px] w-full overflow-hidden bg-ink text-paper">
        <Image
          src="/images/societies-hero-luxury-banner.jpg"
          alt="Luxury gated residential society pet care in India"
          fill
          priority          sizes="100vw"
          className="object-cover object-[75%_center] sm:object-[center_55%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-transparent md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

        <div className="container-shell relative flex h-full flex-col justify-center pb-10 pt-28 sm:pt-32">
          <div className="max-w-xl md:max-w-2xl text-left items-start flex flex-col">
            <span className="inline-flex items-center gap-2 rounded-full border border-saffron/40 bg-saffron/20 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-saffron backdrop-blur-md font-outfit">
              <Sparkles className="h-3.5 w-3.5" /> Care At Community Scale
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-paper sm:text-6xl sm:leading-[1.1]">
              MORE FAMILIAR FACES. CLEARER ACCESS.
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base font-medium leading-7 text-paper/85">
              A society partnership concentrates demand and creates an approved local operating rhythm while individual care stays private.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact?topic=SOCIETY"
                className={buttonVariants({ variant: "accent", size: "lg", className: "rounded-full px-8 font-outfit shadow-lifted" })}
              >
                Discuss A Controlled Pilot <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SOCIETY FEATURES GRID */}
      <section className="bg-paper pb-28 pt-16">
        <div className="container-shell">
          <div className="grid gap-8 md:grid-cols-3">
            {societyFeatures.map(([Icon, title, copy]) => (
              <article key={title} className="group rounded-[2.5rem] border border-indigo/10 bg-paper p-8 shadow-lifted transition-all duration-500 hover:-translate-y-1 hover:border-indigo/30">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo/10 text-indigo shadow-sm">
                  <Icon className="h-7 w-7" />
                </span>
                <h2 className="mt-8 font-display text-3xl font-bold text-ink">{title}</h2>
                <p className="mt-4 text-sm leading-7 text-ink/65">{copy}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/contact?topic=SOCIETY" className={buttonVariants({ variant: "primary", size: "lg", className: "rounded-full px-8 font-outfit" })}>
              Start A Society Discussion <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
