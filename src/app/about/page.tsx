import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, CheckCircle2, FileCheck, HeartHandshake, MapPin, ShieldCheck, Sparkles, Users } from "lucide-react";

import { PublicShell } from "@/components/marketing/public-shell";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { 
  title: "About Us",
  description: "Learn how PetSaathi is elevating pet care standards across India with background-vetted caregivers, transparent handoffs, and neighborhood-first community care.",
  openGraph: {
    title: "About Us | PetSaathi",
    description: "Learn how PetSaathi is elevating pet care standards across India with background-vetted caregivers, transparent handoffs, and neighborhood-first community care.",
    url: "https://petsaathi.in/about",
    siteName: "PetSaathi",
    images: [{ url: "/images/about-hero-luxury-banner.webp", width: 1200, height: 630, alt: "PetSaathi Team & Caregivers" }],
    locale: "en_IN",
    type: "website",
  },
  robots: { index: true, follow: true }
};

export const revalidate = 86400;

const corePillars = [
  {
    icon: Building2,
    tag: "Proximity & Focus",
    title: "Hyper-Local Density",
    description: "We launch cluster by cluster inside gated residential societies so caregivers remain focused, punctual, and unhurried."
  },
  {
    icon: BadgeCheck,
    tag: "Individual Permissions",
    title: "Multi-Stage Vetting",
    description: "Aadhaar authentication, police reference checks, breed-handling assessments, and practical drills before anyone is approved."
  },
  {
    icon: FileCheck,
    tag: "Evidence-Based",
    title: "Audit-Trail Care",
    description: "Every walk is GPS-tracked with milestone photo handoffs and veterinarian-reviewed notes that replace informal chat promises."
  },
  {
    icon: ShieldCheck,
    tag: "Ecosystem Protection",
    title: "₹50,000 Safety Net",
    description: "Emergency medical assistance coordination, 24/7 supervisor support, and dedicated operational leads backing every booking."
  }
] as const;

export default function AboutPage() {
  return (
    <PublicShell>
      {/* 1. FULL-BLEED LUXURY HERO BANNER (LEFT ALIGNED) */}
      <section className="relative h-[480px] sm:h-[560px] lg:h-[620px] w-full overflow-hidden bg-ink text-paper">
        <Image
          src="/images/about-hero-luxury-banner.webp"
          alt="PetSaathi caregiver and pet parent sharing a happy moment with a Golden Retriever in a luxury living room"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[70%_center] sm:object-[60%_center] lg:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/65 to-transparent md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

        <div className="container-shell relative flex h-full flex-col justify-center pb-10 pt-28 sm:pt-32">
          <div className="max-w-xl md:max-w-2xl text-left items-start flex flex-col">
            <span className="inline-flex items-center gap-2 rounded-full border border-saffron/40 bg-saffron/20 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-saffron backdrop-blur-md font-outfit">
              <Sparkles className="h-3.5 w-3.5" /> High-Trust Care Movement
            </span>
            <h1
              style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.85)) drop-shadow(0 0 18px rgba(255,255,255,0.65)) drop-shadow(0 0 32px rgba(255,255,255,0.40))" }}
              className="mt-5 font-display text-4xl font-bold tracking-tight text-[#301F30] sm:text-6xl sm:leading-[1.1]"
            >
              BUILT FOR THE HANDOFF, NOT JUST SEARCH
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base font-medium leading-7 text-paper/85">
              Finding a phone number is easy. Feeling confident about caregiver trustworthiness, handling discipline, and emergency veterinary readiness is harder. PetSaathi is engineered around the complete operating thread.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/book"
                className={buttonVariants({ variant: "accent", size: "lg", className: "rounded-full px-8 font-outfit shadow-lifted" })}
              >
                Start A Care Request <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
              <Link
                href="/safety"
                className="inline-flex items-center gap-2 rounded-full border border-paper/30 bg-paper/10 px-6 py-3 text-sm font-semibold text-paper backdrop-blur-sm transition hover:bg-paper/20"
              >
                Our Safety Architecture
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE OPERATING PILLARS GRID */}
      <section className="bg-paper pb-20 pt-16" id="our-mission">
        <div className="container-shell">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo/20 bg-indigo/5 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-indigo font-outfit">
              <HeartHandshake className="h-3.5 w-3.5" /> Foundational Commitments
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
              Care should be predictable before, during, and after each service.
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-7 text-ink/75">
              We replaced informal promises and unsupervised kennels with structured routines, strict service permissions, and digital accountability.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {corePillars.map(({ icon: Icon, tag, title, description }) => (
              <article
                key={title}
                className="group flex flex-col justify-between rounded-[2.5rem] border border-indigo/10 bg-paper p-7 shadow-lifted transition-all duration-500 hover:-translate-y-1 hover:border-indigo/30"
              >
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo/10 text-indigo shadow-sm transition group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="mt-4 inline-block rounded-full bg-indigo/5 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-indigo">
                    {tag}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-bold text-ink">{title}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-6 text-ink/75">{description}</p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 border-t border-ink/5 pt-4 text-[0.65rem] font-semibold text-leaf">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verified Standard
                </div>
              </article>
            ))}
          </div>

          {/* 3. FOUNDING STORY & CORPORATE TRANSPARENCY */}
          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <article className="rounded-5xl bg-[#281d2b] p-8 sm:p-12 text-paper shadow-lifted relative overflow-hidden">
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-saffron/20 blur-3xl" />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-saffron/40 bg-saffron/15 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-saffron">
                  <Sparkles className="h-3.5 w-3.5" /> Our Origin Story
                </span>
                <h3 className="mt-5 font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                  The PetSaathi Philosophy
                </h3>
                <p className="mt-4 text-sm sm:text-base leading-7 text-paper/80">
                  Indian pet parents in gated communities face a common dilemma: relying on informal domestic help without canine handling training, or leaving their dogs in stressful, overcrowded kennels.
                </p>
                <p className="mt-3 text-sm sm:text-base leading-7 text-paper/80">
                  PetSaathi was founded in 2026 to pioneer doorstep, high-trust companionship delivered by background-vetted animal lovers who treat your pet like family. We provide caregivers with fair living wages, training, and institutional backing.
                </p>
                <div className="mt-8 flex items-center gap-6 border-t border-paper/10 pt-6">
                  <div>
                    <p className="font-display text-3xl font-bold text-saffron">100%</p>
                    <p className="text-xs text-paper/70 mt-1">Verified Backgrounds</p>
                  </div>
                  <div className="h-10 w-px bg-paper/10" />
                  <div>
                    <p className="font-display text-3xl font-bold text-saffron">₹50K</p>
                    <p className="text-xs text-paper/70 mt-1">Safety Assistance</p>
                  </div>
                  <div className="h-10 w-px bg-paper/10" />
                  <div>
                    <p className="font-display text-3xl font-bold text-saffron">3 Cities</p>
                    <p className="text-xs text-paper/70 mt-1">Ahmedabad · BLR · Pune</p>
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-5xl border border-indigo/10 bg-paper p-8 sm:p-12 shadow-lifted flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-indigo/20 bg-indigo/5 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-indigo font-outfit">
                  <MapPin className="h-3.5 w-3.5" /> Corporate Governance
                </span>
                <h3 className="mt-5 font-display text-3xl font-bold tracking-[-0.03em] text-ink sm:text-4xl">
                  Operational Base & Standards
                </h3>
                <p className="mt-4 text-sm sm:text-base leading-7 text-ink/80">
                  Headquartered in Ahmedabad with pilot operational zones expanding across Bangalore and Pune, PetSaathi combines digital safety protocols with on-ground supervision to protect pets and support independent caregivers with fair living wages.
                </p>

                <div className="mt-6 rounded-3xl bg-cream/40 border border-ink/10 p-5 space-y-2 text-xs sm:text-sm text-ink/80">
                  <p><strong>Registered Operations:</strong> Ahmedabad, Gujarat 380058, India</p>
                  <p><strong>Corporate Entity:</strong> PetSaathi Technologies Pvt. Ltd.</p>
                  <p><strong>Care Concierge:</strong> <a href="mailto:support@petsaathi.com" className="font-bold text-indigo hover:underline">support@petsaathi.com</a> | +91 80007 38722</p>
                  <p><strong>Operating Hours:</strong> 7:00 AM – 10:00 PM IST (Emergency Vet Support: 24/7)</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/societies"
                  className={buttonVariants({ variant: "outline", size: "sm", className: "rounded-full font-semibold" })}
                >
                  Explore Society Hubs →
                </Link>
                <Link
                  href="/contact"
                  className={buttonVariants({ variant: "ghost", size: "sm", className: "rounded-full font-semibold" })}
                >
                  Contact Concierge →
                </Link>
              </div>
            </article>
          </div>

          {/* 4. COMMUNITY INVITATION CTA */}
          <div className="mt-16 rounded-[2.5rem] border border-indigo/10 bg-gradient-to-br from-[#f3eafa] via-paper to-[#fff0e8] p-8 text-center shadow-soft sm:p-14">
            <HeartHandshake className="mx-auto h-10 w-10 text-coral" />
            <h2 className="mx-auto mt-4 max-w-xl font-display text-3xl font-bold tracking-[-0.04em] text-ink sm:text-5xl">
              Experience the warmth of true pet companionship.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base font-medium leading-7 text-ink/80">
              Whether you are looking for trusted daily walks in your gated society or want to turn your love for animals into a verified profession, PetSaathi welcomes you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/book"
                className={buttonVariants({ variant: "accent", size: "lg", className: "rounded-full px-8 font-outfit shadow-lifted" })}
              >
                Find A Trusted Saathi <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
              <Link
                href="/become-a-saathi"
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-paper px-8 py-3 text-sm font-semibold text-ink shadow-sm transition hover:bg-ink hover:text-paper"
              >
                Become A Certified Saathi
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
