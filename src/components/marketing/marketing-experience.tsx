"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HeartHandshake,
  Home,
  MapPin,
  PawPrint,
  ShieldCheck,
  Sparkles,
  UserRoundCheck
} from "lucide-react";

import { PetSaathiLogo } from "@/components/brand/logo";
import { CareMatchFinder } from "@/components/marketing/care-match-finder";
import { CareConcierge } from "@/components/marketing/care-concierge";
import { CareJourneyExplorer } from "@/components/marketing/care-journey-explorer";
import { CustomCursor } from "@/components/marketing/custom-cursor";
import { DiscoveryReviewRail } from "@/components/marketing/discovery-review-rail";
import { HeroVideoShowcase } from "@/components/marketing/hero-video-showcase";
import { MarketplaceAssurance } from "@/components/marketing/marketplace-assurance";
import { ScrollReveal } from "@/components/3d/scroll-reveal";
import { TextReveal, MagneticButton, AnimosCard, ScrollStaggerContainer, ScrollStaggerItem } from "@/components/effects/animos-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { services, trustSignals } from "@/modules/catalog/services";

const careSteps = [
  { number: "01", title: "Share the care context", copy: "Choose the service, pet, place and time without exposing more information than the request needs.", icon: PawPrint },
  { number: "02", title: "We check the fit", copy: "Availability, service permission, local capacity and relevant risk details are reviewed before a proposal.", icon: UserRoundCheck },
  { number: "03", title: "You approve the Saathi", copy: "Review the proposed caregiver and the server-approved quote before payment and confirmation.", icon: BadgeCheck },
  { number: "04", title: "Care leaves a trail", copy: "Milestones, reports and exceptions remain connected to one private, traceable care protocol.", icon: CheckCircle2 }
] as const;

const questions = [
  ["Can I browse every Saathi publicly?", "PetSaathi uses assisted matching. A relevant profile is proposed after service, locality, availability and pet-fit checks, protecting both families and caregivers from unnecessary data exposure."],
  ["When is payment requested?", "Payment opens only after you approve the proposed Saathi. The amount comes from a server-side quote and is verified again before the booking state changes."],
  ["Is live tracking always enabled?", "No. Tracking is feature-gated, time-limited and visible only for an eligible active service with the required consent basis."],
  ["What happens if care does not go as planned?", "Support, incident triage, replacement matching, refunds and corrective actions use explicit workflows with authorised decisions and recorded history."]
] as const;

export function MarketingExperience() {
  return (
    <main className="min-h-screen overflow-hidden bg-cream text-ink" data-motion-skip>
      <CustomCursor />
      <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6">
        <div className="mx-auto flex min-h-[4.5rem] max-w-container-max items-center justify-between rounded-full border border-paper/80 bg-paper/80 px-4 shadow-lifted backdrop-blur-2xl sm:px-6">
          <PetSaathiLogo />
          <nav aria-label="Primary navigation" className="hidden items-center gap-7 lg:flex">
            <Link href="/services" className="text-sm font-bold text-ink/55 transition hover:text-indigo">Services</Link>
            <Link href={"/caregivers" as Route} className="text-sm font-bold text-ink/55 transition hover:text-indigo">Saathis</Link>
            <Link href="/safety" className="text-sm font-bold text-ink/55 transition hover:text-indigo">Safety</Link>
            <Link href="/societies" className="text-sm font-bold text-ink/55 transition hover:text-indigo">Societies</Link>
            <Link href="/about" className="text-sm font-bold text-ink/55 transition hover:text-indigo">About</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex")}>Sign in</Link>
            <MagneticButton strength={0.25}>
              <Link href="/book" className={buttonVariants({ variant: "primary", size: "sm" })}>Find care <ArrowRight className="h-4 w-4" /></Link>
            </MagneticButton>
          </div>
        </div>
      </header>

      <section className="marketing-hero-backdrop relative flex min-h-screen items-center pb-24 pt-32 sm:pb-28 sm:pt-36">
        <Image
          src="/images/hero-care-handover.jpg"
          alt="A PetSaathi caregiver handing over a dog to its pet parent"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%]"
          aria-hidden="true"
        />
        <div className="container-shell relative grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative z-10">
            <ScrollReveal direction="up">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo/10 bg-paper/80 px-4 py-2 text-xs font-bold text-indigo shadow-sm backdrop-blur"><span className="status-dot" />Verified Local Caregivers, Managed With Love</div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.08}>
              <h1 className="sr-only">Care That Feels Like Family.</h1>
              <div className="mt-7" aria-hidden="true">
                <TextReveal text="Care That Feels Like Family." className="max-w-[10ch] font-display text-[3.7rem] font-semibold leading-[0.91] tracking-[-0.065em] sm:text-[5.4rem] xl:text-[6.6rem]" delay={0.08} />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.16}>
              <p className="mt-7 max-w-xl text-base font-medium leading-8 text-ink/70 sm:text-lg">Connect with background-checked local Saathis for GPS-tracked walks, in-home sitting, grooming, and vet care—all backed by 24/7 human support.</p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.24}>
              <CareMatchFinder />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.32}>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-bold text-ink/48">
                <Link href={"/caregivers" as Route} className="inline-flex items-center gap-1.5 text-indigo transition hover:text-coral">How matching works <ArrowRight className="h-3.5 w-3.5" /></Link>
                <span className="hidden items-center gap-2 sm:flex"><Clock3 className="h-4 w-4 text-leaf" />Structured service history</span>
                <span className="hidden items-center gap-2 sm:flex"><HeartHandshake className="h-4 w-4 text-leaf" />Human exception support</span>
              </div>
            </ScrollReveal>
          </div>

          <HeroVideoShowcase />
        </div>
      </section>

      <DiscoveryReviewRail />

      <section className="border-y border-indigo/10 bg-paper/70 py-6">
        <div className="container-shell flex flex-wrap items-center justify-center gap-x-10 gap-y-4">{trustSignals.map(({ label, icon: Icon }) => <span key={label} className="flex items-center gap-2 text-sm font-bold text-ink/52"><Icon className="h-4 w-4 text-coral" />{label}</span>)}</div>
      </section>

      <section className="py-24 sm:py-32" id="services">
        <div className="container-shell">
          <ScrollReveal direction="up"><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="eyebrow font-outfit">Tailored Pet Care</p><h2 className="section-title mt-5 max-w-[14ch]">Comprehensive Services Designed for Every Need.</h2></div><p className="max-w-xl text-sm font-medium leading-7 text-ink/60">Every service is backed by background-checked Saathis, real-time photo/GPS telemetry, transparent pricing, and 24/7 support.</p></div></ScrollReveal>

          <ScrollStaggerContainer className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map(({ slug, name, kicker, description, icon: Icon, image }) => (
              <ScrollStaggerItem key={slug}>
                <AnimosCard>
                  <Link href={`/services/${slug}` as Route} className="group flex h-full flex-col overflow-hidden rounded-5xl border border-indigo/10 bg-paper p-6 shadow-lifted transition duration-500 hover:border-indigo/30 hover:shadow-soft">
                    <div className="relative h-48 w-full overflow-hidden rounded-4xl bg-indigo/5">
                      <Image
                        src={image}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80" />
                      <div className="absolute left-4 top-4 flex items-center gap-2">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-paper/90 text-indigo shadow-md backdrop-blur transition group-hover:bg-indigo group-hover:text-paper"><Icon className="h-5 w-5" /></span>
                      </div>
                      <div className="absolute right-4 top-4">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink/60 shadow-md backdrop-blur transition group-hover:bg-coral group-hover:text-paper"><ChevronRight className="h-4 w-4" /></span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col pt-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-coral font-outfit">{kicker}</p>
                      <h3 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-ink">{name}</h3>
                      <p className="mt-3 text-sm font-medium leading-6 text-ink/60">{description}</p>
                      <div className="mt-5 pt-3 border-t border-indigo/10 flex items-center justify-between text-xs font-bold text-indigo group-hover:text-coral transition">
                        <span>See service details</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </AnimosCard>
              </ScrollStaggerItem>
            ))}
          </ScrollStaggerContainer>
        </div>
      </section>

      <MarketplaceAssurance />

      <CareJourneyExplorer />

      <CareConcierge />

      <section className="relative overflow-hidden bg-[#2f2032] py-24 text-paper sm:py-32">
        <div className="absolute inset-0 luxury-grid opacity-[0.08]" />
        <div className="container-shell relative">
          <ScrollReveal direction="up"><div className="max-w-3xl"><p className="eyebrow !text-saffron">A care protocol, not a loose transaction</p><h2 className="mt-5 font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl">Four clear moments. One accountable thread.</h2></div></ScrollReveal>

          <ScrollStaggerContainer className="mt-14 grid gap-4 lg:grid-cols-4">
            {careSteps.map(({ number, title, copy, icon: Icon }) => (
              <ScrollStaggerItem key={number}>
                <AnimosCard glare={false}>
                  <article className="h-full rounded-4xl border border-paper/10 bg-paper/[0.06] p-6 backdrop-blur transition duration-300 hover:border-saffron/30">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-3xl font-semibold text-saffron">{number}</span>
                      <Icon className="h-5 w-5 text-paper/35" />
                    </div>
                    <h3 className="mt-10 font-display text-2xl font-semibold">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-paper/52">{copy}</p>
                  </article>
                </AnimosCard>
              </ScrollStaggerItem>
            ))}
          </ScrollStaggerContainer>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container-shell grid items-center gap-12 lg:grid-cols-[1fr_0.92fr]">
          <ScrollReveal direction="left"><div className="relative min-h-[34rem] overflow-hidden rounded-[3.5rem] border border-indigo/10 bg-gradient-to-br from-[#f3eafa] to-[#fff0e8] shadow-soft"><Image src="/images/privacy-stage-illustration.jpg" alt="A pet parent reviewing a protected PetSaathi care record beside her resting dog" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" /><div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-paper/30 bg-paper/85 p-5 backdrop-blur"><p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo/60">Privacy by stage</p><p className="mt-2 font-display text-2xl font-semibold">The right information appears only when the relationship requires it.</p></div></div></ScrollReveal>
          <ScrollReveal direction="right"><div><p className="eyebrow">Trust without theatre</p><h2 className="section-title mt-5">No single badge can promise perfect care.</h2><p className="mt-6 text-base leading-8 text-ink/54">PetSaathi combines separate checks, service permissions, careful matching, structured proof and a formal exception path. Each layer has a specific job.</p><div className="mt-8 grid gap-3">{[[ShieldCheck, "Service-specific permissions", "A Saathi receives only the work their current evidence permits."], [Clock3, "Traceable service milestones", "Key moments belong to the booking record, not an unstructured chat."], [HeartHandshake, "People for exceptions", "Sensitive concerns move through support and safety workflows with accountable closure."]].map(([Icon, title, copy]) => { const TrustIcon = Icon as typeof ShieldCheck; return <div key={String(title)} className="flex gap-4 rounded-3xl border border-indigo/10 bg-paper/80 p-5 shadow-sm"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-leaf/10 text-leaf"><TrustIcon className="h-5 w-5" /></span><div><h3 className="font-bold">{String(title)}</h3><p className="mt-1 text-sm leading-6 text-ink/48">{String(copy)}</p></div></div>; })}</div><Link href="/safety" className={cn(buttonVariants({ variant: "outline" }), "mt-7")}>Explore the safety model <ArrowRight className="h-4 w-4" /></Link></div></ScrollReveal>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="container-shell">
          <div className="luxury-grid overflow-hidden rounded-[3.5rem] border border-indigo/10 bg-gradient-to-br from-[#f3eafa] via-paper to-[#fff0e8] p-7 shadow-soft sm:p-12 lg:p-16">
            <div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-start"><div><p className="eyebrow">Questions before the first request</p><h2 className="mt-5 font-display text-5xl font-semibold leading-[1] tracking-[-0.055em] sm:text-6xl">Clarity is part of care.</h2><p className="mt-5 max-w-md text-sm leading-7 text-ink/50">PetSaathi should be easy to understand before you share pet details, approve a match or pay.</p></div><div className="grid gap-3">{questions.map(([question, answer]) => <details key={question} className="group rounded-3xl border border-indigo/10 bg-paper/85 p-5 open:shadow-lifted"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-semibold"><span>{question}</span><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo/[0.07] text-indigo transition group-open:rotate-45">+</span></summary><p className="mt-4 pr-9 text-sm leading-7 text-ink/52">{answer}</p></details>)}</div></div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-shell">
          <div className="relative overflow-hidden rounded-[3.5rem] bg-coral p-8 text-paper shadow-soft sm:p-14 lg:p-16">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border-[54px] border-paper/10" />
            <div className="relative max-w-3xl">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-paper/65">Ready when their day needs you</p>
              <h2 className="mt-5 font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl">Plan thoughtful care in one calm flow.</h2>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <MagneticButton strength={0.3}>
                  <Link href="/book" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "bg-paper text-ink hover:bg-ink hover:text-paper")}>Start a care request <ArrowRight className="h-5 w-5" /></Link>
                </MagneticButton>
                <MagneticButton strength={0.2}>
                  <Link href="/become-a-saathi" className="inline-flex min-h-14 items-center justify-center rounded-full border border-paper/30 px-7 text-sm font-bold text-paper transition hover:bg-paper/10">Become a Saathi</Link>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-indigo/10 bg-paper/75 pb-28 pt-14 lg:pb-14">
        <div className="container-shell grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]"><div><PetSaathiLogo /><p className="mt-5 max-w-sm text-sm leading-7 text-ink/48">India-focused, trust-first pet care built around careful handoffs and traceable service delivery.</p></div>{[["Explore", [["Services", "/services"], ["Saathis", "/caregivers"], ["Membership", "/membership"]]], ["Trust", [["Safety", "/safety"], ["Privacy", "/privacy"], ["Terms", "/terms"]]], ["PetSaathi", [["About", "/about"], ["Journal", "/journal"], ["Contact", "/contact"]]]].map(([title, links]) => <div key={String(title)}><p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/35">{String(title)}</p><div className="mt-5 grid gap-3">{(links as string[][]).map(([label, href]) => <Link key={href} href={href as Route} className="text-sm font-semibold text-ink/52 hover:text-indigo">{label}</Link>)}</div></div>)}</div><div className="container-shell mt-12 flex flex-col gap-3 border-t border-indigo/10 pt-6 text-xs text-ink/40 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} PetSaathi</p><p>Care feels closer.</p></div>
      </footer>

      <nav aria-label="Mobile navigation" className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-[1.75rem] border border-paper/80 bg-paper/90 p-2 shadow-soft backdrop-blur-2xl lg:hidden">{[[Home, "Home", "/"], [PawPrint, "Services", "/services"], [MapPin, "Find care", "/book"], [Sparkles, "Sign in", "/login"]].map(([Icon, label, href]) => { const NavIcon = Icon as typeof Home; return <Link key={String(label)} href={href as Route} className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[0.62rem] font-bold text-ink/50 transition hover:bg-indigo/[0.06] hover:text-indigo"><NavIcon className="h-4 w-4" />{String(label)}</Link>; })}</nav>
    </main>
  );
}
