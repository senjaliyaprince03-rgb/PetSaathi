import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, ShieldCheck, Sparkles } from "lucide-react";

import { PublicShell } from "@/components/marketing/public-shell";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Find a trusted Saathi | PetSaathi" };

const profileViews = [
  { image: "/images/sitter-woman-cinematic.png", label: "Home care", detail: "Routine-led companionship, feeding and careful handovers" },
  { image: "/images/sitter-park-cinematic.png", label: "Neighbourhood walks", detail: "Service-specific permissions with recorded milestones" },
  { image: "/images/auth-pet-companion.png", label: "Day care", detail: "Local capacity, pet fit and human-reviewed matching" }
];

export default function CaregiversPage() {
  return (
    <PublicShell>
      {/* 1. FULL-BLEED HERO BANNER (LEFT ALIGNED) */}
      <section className="relative h-[560px] sm:h-[620px] w-full overflow-hidden bg-ink text-paper">
        <Image
          src="/images/saathis-hero-luxury-banner.jpg"
          alt="Verified PetSaathi woman caregiver cuddling a happy cat"
          fill
          priority
          unoptimized
          quality={100}
          sizes="100vw"
          className="object-cover object-[80%_center] sm:object-[center_45%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-transparent md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

        <div className="container-shell relative flex h-full flex-col justify-center pb-10 pt-28 sm:pt-32">
          <div className="max-w-xl md:max-w-2xl text-left items-start flex flex-col">
            <span className="inline-flex items-center gap-2 rounded-full border border-saffron/40 bg-saffron/20 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-saffron backdrop-blur-md font-outfit">
              <Sparkles className="h-3.5 w-3.5" /> Assisted Caregiver Discovery
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-paper sm:text-6xl sm:leading-[1.1]">
              MEET THE RIGHT SAATHI
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base font-medium leading-7 text-paper/85">
              PetSaathi checks service permissions, locality, schedule, and pet temperament before proposing a suitable caregiver for your approval.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/book"
                className={buttonVariants({ variant: "accent", size: "lg", className: "rounded-full px-8 font-outfit shadow-lifted" })}
              >
                Start A Care Request <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VERIFICATION BADGES & PROFILES */}
      <section className="bg-paper pb-28 pt-12">
        <div className="container-shell">
          <div className="flex flex-wrap justify-center gap-2">
            {["Identity reviewed", "Service permissions", "Local availability", "Pet-fit context", "Human support"].map((item) => (
              <span key={item} className="rounded-full border border-indigo/10 bg-paper px-4 py-2 text-xs font-bold text-ink/65 shadow-sm">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {profileViews.map((item, index) => (
              <article key={item.label} className="group overflow-hidden rounded-[2.5rem] border border-indigo/10 bg-paper shadow-lifted transition-all duration-500 hover:-translate-y-1 hover:border-indigo/30">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-indigo/5">
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover object-[center_20%] transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80" />
                  <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-paper/90 px-3 py-1.5 text-xs font-bold text-leaf backdrop-blur shadow-sm">
                    <ShieldCheck className="h-3.5 w-3.5" /> Profile view {index + 1}
                  </span>
                </div>

                <div className="p-7">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-coral font-outfit">What a proposal includes</p>
                  <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.035em] text-ink">{item.label}</h2>
                  <p className="mt-3 text-sm leading-7 text-ink/60">{item.detail}</p>
                  <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-ink/65">
                    <span className="flex items-center gap-1.5 rounded-full bg-indigo/[0.06] px-3.5 py-1.5"><BadgeCheck className="h-3.5 w-3.5 text-indigo" />Relevant checks</span>
                    <span className="flex items-center gap-1.5 rounded-full bg-coral/[0.06] px-3.5 py-1.5"><MapPin className="h-3.5 w-3.5 text-coral" />Local fit</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="luxury-grid mt-12 rounded-[2.5rem] border border-indigo/10 bg-gradient-to-br from-[#f3eafa] to-[#fff0e8] p-8 text-center shadow-soft sm:p-12">
            <Sparkles className="mx-auto h-8 w-8 text-coral" />
            <h2 className="mx-auto mt-5 max-w-[16ch] font-display text-4xl font-bold tracking-[-0.04em] text-ink sm:text-5xl">Your match stays private until it matters.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-ink/60">Names, exact locations and private pet details are revealed only at the appropriate approval stage. You review the proposed Saathi before payment and confirmation.</p>
            <Link href="/book" className={`${buttonVariants({ variant: "accent", size: "lg" })} mt-7 font-outfit rounded-full px-8 shadow-lifted`}>
              Start a care request <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
