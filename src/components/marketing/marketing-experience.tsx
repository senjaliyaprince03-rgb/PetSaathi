"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
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
import { CustomCursor } from "@/components/marketing/custom-cursor";
import { ScrollReveal } from "@/components/3d/scroll-reveal";
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
  const reduceMotion = useReducedMotion();

  return (
    <main className="min-h-screen overflow-hidden bg-cream text-ink">
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
            <Link href="/book" className={buttonVariants({ variant: "primary", size: "sm" })}>Find care <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </header>

      <section className="relative flex min-h-screen items-center pb-16 pt-32 sm:pt-36">
        <div className="absolute inset-0 luxury-grid opacity-70" />
        <div className="absolute left-[-10rem] top-28 h-[28rem] w-[28rem] rounded-full bg-saffron/20 blur-[110px]" />
        <div className="absolute right-[-8rem] top-8 h-[34rem] w-[34rem] rounded-full bg-indigo/15 blur-[120px]" />

        <div className="container-shell relative grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative z-10">
            <ScrollReveal direction="up">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo/10 bg-paper/80 px-4 py-2 text-xs font-bold text-indigo shadow-sm backdrop-blur"><span className="status-dot" />Assisted pet care, thoughtfully managed</div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.08}>
              <h1 className="mt-7 max-w-[10ch] font-display text-[3.7rem] font-semibold leading-[0.91] tracking-[-0.065em] sm:text-[5.4rem] xl:text-[6.6rem]">Care that feels <span className="italic text-coral">closer.</span></h1>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.16}>
              <p className="mt-7 max-w-xl text-base leading-8 text-ink/56 sm:text-lg">A calm, traceable way to request local pet care—built around careful matching, service-specific trust and human support when the day changes.</p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.24}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/book" className={buttonVariants({ variant: "accent", size: "lg" })}>Plan their care <ArrowRight className="h-5 w-5" /></Link><Link href={"/caregivers" as Route} className={buttonVariants({ variant: "outline", size: "lg" })}>How matching works</Link></div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.32}>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-ink/48"><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-leaf" />Role-protected records</span><span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-leaf" />Structured service history</span><span className="flex items-center gap-2"><HeartHandshake className="h-4 w-4 text-leaf" />Human exception support</span></div>
            </ScrollReveal>
          </div>

          <motion.div initial={reduceMotion ? false : { opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="relative mx-auto w-full max-w-2xl lg:mr-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[3.5rem] border-[10px] border-paper/70 bg-paper shadow-soft">
              <Image src="/images/auth-pet-companion.png" alt="A pet parent sharing a calm moment with her golden retriever" fill priority sizes="(min-width: 1024px) 52vw, 90vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-paper/5" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-paper sm:p-9"><p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-saffron">Designed around the handoff</p><p className="mt-3 max-w-[15ch] font-display text-3xl font-semibold leading-tight sm:text-4xl">The details that make home feel familiar.</p></div>
            </div>
            <motion.div animate={reduceMotion ? undefined : { y: [0, -10, 0], rotate: [-2, 1, -2] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-5 top-12 hidden w-48 rounded-3xl border border-paper/80 bg-paper/90 p-4 shadow-soft backdrop-blur-xl sm:block"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-leaf/10 text-leaf"><ShieldCheck className="h-5 w-5" /></span><p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/38">Trust by layer</p><p className="mt-1 text-sm font-bold">Evidence, permissions and fit</p></motion.div>
            <motion.div animate={reduceMotion ? undefined : { y: [0, 12, 0], rotate: [2, -1, 2] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-5 right-4 w-52 rounded-3xl border border-paper/80 bg-[#2f2032]/95 p-5 text-paper shadow-soft backdrop-blur-xl"><p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-saffron">One care thread</p><div className="mt-3 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-paper/10"><CalendarDays className="h-5 w-5" /></span><p className="text-sm font-bold leading-5">Request → match → care → report</p></div></motion.div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-indigo/10 bg-paper/70 py-6">
        <div className="container-shell flex flex-wrap items-center justify-center gap-x-10 gap-y-4">{trustSignals.map(({ label, icon: Icon }) => <span key={label} className="flex items-center gap-2 text-sm font-bold text-ink/52"><Icon className="h-4 w-4 text-coral" />{label}</span>)}</div>
      </section>

      <section className="py-24 sm:py-32" id="services">
        <div className="container-shell">
          <ScrollReveal direction="up"><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="eyebrow">Care for the real day</p><h2 className="section-title mt-5 max-w-[12ch]">Start with what PetSaathi can operate well.</h2></div><p className="max-w-xl text-sm leading-7 text-ink/52">Availability and scope stay explicit. Services do not silently unlock before the relevant city, capacity and safety controls are ready.</p></div></ScrollReveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{services.map(({ slug, name, kicker, description, icon: Icon }, index) => <ScrollReveal key={slug} direction="up" delay={index * 0.04}><Link href={`/services/${slug}` as Route} className="group flex h-full min-h-[23rem] flex-col rounded-5xl border border-indigo/10 bg-paper p-7 shadow-lifted transition duration-500 hover:-translate-y-2 hover:border-indigo/20 hover:shadow-soft"><div className="flex items-start justify-between"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo/[0.07] text-indigo"><Icon className="h-6 w-6" /></span><span className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo/10 text-ink/30 transition group-hover:bg-ink group-hover:text-paper"><ChevronRight className="h-5 w-5" /></span></div><p className="mt-auto pt-12 text-[0.62rem] font-bold uppercase tracking-[0.19em] text-coral">{kicker}</p><h3 className="mt-3 font-display text-4xl font-semibold tracking-[-0.045em]">{name}</h3><p className="mt-4 text-sm leading-7 text-ink/50">{description}</p></Link></ScrollReveal>)}</div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#2f2032] py-24 text-paper sm:py-32">
        <div className="absolute inset-0 luxury-grid opacity-[0.08]" />
        <div className="container-shell relative">
          <ScrollReveal direction="up"><div className="max-w-3xl"><p className="eyebrow !text-saffron">A care protocol, not a loose transaction</p><h2 className="mt-5 font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl">Four clear moments. One accountable thread.</h2></div></ScrollReveal>
          <div className="mt-14 grid gap-4 lg:grid-cols-4">{careSteps.map(({ number, title, copy, icon: Icon }, index) => <ScrollReveal key={number} direction="up" delay={index * 0.07}><article className="h-full rounded-4xl border border-paper/10 bg-paper/[0.06] p-6 backdrop-blur"><div className="flex items-center justify-between"><span className="font-display text-3xl font-semibold text-saffron">{number}</span><Icon className="h-5 w-5 text-paper/35" /></div><h3 className="mt-10 font-display text-2xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-paper/52">{copy}</p></article></ScrollReveal>)}</div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container-shell grid items-center gap-12 lg:grid-cols-[1fr_0.92fr]">
          <ScrollReveal direction="left"><div className="relative min-h-[34rem] overflow-hidden rounded-[3.5rem] border border-indigo/10 bg-gradient-to-br from-[#f3eafa] to-[#fff0e8] shadow-soft"><Image src="/images/pet-sitter-3d.png" alt="A sculptural PetSaathi caregiver and pet illustration" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" /><div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-paper/30 bg-paper/85 p-5 backdrop-blur"><p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo/60">Privacy by stage</p><p className="mt-2 font-display text-2xl font-semibold">The right information appears only when the relationship requires it.</p></div></div></ScrollReveal>
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
        <div className="container-shell"><div className="relative overflow-hidden rounded-[3.5rem] bg-coral p-8 text-paper shadow-soft sm:p-14 lg:p-16"><div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border-[54px] border-paper/10" /><div className="relative max-w-3xl"><p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-paper/65">Ready when their day needs you</p><h2 className="mt-5 font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl">Plan thoughtful care in one calm flow.</h2><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/book" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "bg-paper text-ink hover:bg-ink hover:text-paper")}>Start a care request <ArrowRight className="h-5 w-5" /></Link><Link href="/become-a-saathi" className="inline-flex min-h-14 items-center justify-center rounded-full border border-paper/30 px-7 text-sm font-bold text-paper transition hover:bg-paper/10">Become a Saathi</Link></div></div></div></div>
      </section>

      <footer className="border-t border-indigo/10 bg-paper/75 pb-28 pt-14 lg:pb-14">
        <div className="container-shell grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]"><div><PetSaathiLogo /><p className="mt-5 max-w-sm text-sm leading-7 text-ink/48">India-focused, trust-first pet care built around careful handoffs and traceable service delivery.</p></div>{[["Explore", [["Services", "/services"], ["Saathis", "/caregivers"], ["Membership", "/membership"]]], ["Trust", [["Safety", "/safety"], ["Privacy", "/privacy"], ["Terms", "/terms"]]], ["PetSaathi", [["About", "/about"], ["Journal", "/journal"], ["Contact", "/contact"]]]].map(([title, links]) => <div key={String(title)}><p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/35">{String(title)}</p><div className="mt-5 grid gap-3">{(links as string[][]).map(([label, href]) => <Link key={href} href={href as Route} className="text-sm font-semibold text-ink/52 hover:text-indigo">{label}</Link>)}</div></div>)}</div><div className="container-shell mt-12 flex flex-col gap-3 border-t border-indigo/10 pt-6 text-xs text-ink/40 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} PetSaathi</p><p>Care feels closer.</p></div>
      </footer>

      <nav aria-label="Mobile navigation" className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-[1.75rem] border border-paper/80 bg-paper/90 p-2 shadow-soft backdrop-blur-2xl lg:hidden">{[[Home, "Home", "/"], [PawPrint, "Services", "/services"], [MapPin, "Find care", "/book"], [Sparkles, "Sign in", "/login"]].map(([Icon, label, href]) => { const NavIcon = Icon as typeof Home; return <Link key={String(label)} href={href as Route} className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[0.62rem] font-bold text-ink/50 transition hover:bg-indigo/[0.06] hover:text-indigo"><NavIcon className="h-4 w-4" />{String(label)}</Link>; })}</nav>
    </main>
  );
}
