"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookHeart,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Facebook,
  FileText,
  HeartHandshake,
  Home,
  Info,
  Instagram,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  Newspaper,
  PawPrint,
  ShieldCheck,
  Sparkles,
  Twitter,
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
import { ScrollReveal, ParallaxScroll, Scale3D, RotateOnScroll, Float3D } from "@/components/3d/scroll-reveal";
import TextEmerge from "@/components/originkit/ui/text-emerge";
import ScrollTextReveal from "@/components/originkit/ui/scroll-text-reveal";
import MagneticHoverButton from "@/components/originkit/ui/magnetic-hover-button";
import StardustBackground from "@/components/originkit/ui/stardust";
import ShinyPill from "@/components/originkit/ui/shiny-pill";
import { AnimosCard, ScrollStaggerContainer, ScrollStaggerItem } from "@/components/effects/animos-motion";
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
      <header className="absolute inset-x-0 top-4 z-50 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[4.5rem] max-w-container-max items-center justify-between rounded-full border border-paper/80 bg-paper/95 px-4 shadow-lifted backdrop-blur-2xl sm:px-6">
          <PetSaathiLogo />
          <nav aria-label="Primary navigation" className="hidden items-center gap-7 lg:flex">
            <Link href={"/services" as Route} className="text-sm font-bold text-ink/70 transition hover:text-ink">Services</Link>
            <Link href={"/caregivers" as Route} className="text-sm font-bold text-ink/70 transition hover:text-ink">Saathis</Link>
            <Link href={"/safety" as Route} className="text-sm font-bold text-ink/70 transition hover:text-ink">Safety</Link>
            <Link href={"/societies" as Route} className="text-sm font-bold text-ink/70 transition hover:text-ink">Societies</Link>
            <Link href={"/about" as Route} className="text-sm font-bold text-ink/70 transition hover:text-ink">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href={"/login" as Route} className="hidden text-sm font-bold text-ink sm:block">Sign in</Link>
            <Link href={"/book" as Route} className={cn(buttonVariants({ variant: "default", size: "default" }), "rounded-full font-bold bg-[#301F30] hover:bg-[#301F30]/90 text-white")}>
              Find care <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="marketing-hero-backdrop relative flex flex-col justify-center min-h-[95vh] pt-32 pb-16 lg:pt-40 lg:pb-24">
        <ParallaxScroll speed={-0.15} className="absolute inset-0">
          <Image
            src="/images/hero-dog-woman.jpg"
            alt="PetSaathi Hero Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            aria-hidden="true"
          />
        </ParallaxScroll>
        <div className="absolute inset-0 bg-white/40" aria-hidden="true" />

        <div className="container-shell relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:min-h-[60vh] z-10">
          <div className="relative z-10 max-w-xl self-center">
            <ScrollReveal direction="up">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                <span className="status-dot bg-leaf" />
                <ShinyPill text="Verified Local Caregivers, Managed With Love" textColor="#ffffff" shineColor="#D4AF37" speed={2} font={{ fontSize: "0.75rem", fontWeight: "bold" }} />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.08}>
              <h1 className="sr-only">Care That Feels Like Family.</h1>
              <div className="mt-2" aria-hidden="true">
                <TextEmerge 
                  text="Care That Feels Like Family." 
                  className="max-w-[10ch] font-display text-[3.7rem] font-semibold leading-[0.91] tracking-[-0.065em] text-[#301F30] drop-shadow-2xl sm:text-[5.4rem] xl:text-[6.6rem]" 
                />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.16}>
                <p className="mt-7 max-w-xl text-base font-semibold leading-8 text-white drop-shadow-md sm:text-lg">Connect with background-checked local Saathis for GPS-tracked walks, in-home sitting, grooming, and vet care—all backed by 24/7 human support.</p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.24}>
              <Float3D className="mt-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                {/* Left side: Overlapping circles */}
                <div className="flex -space-x-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white ring-2 ring-white shadow-md">
                    <Image src="/images/avatar_1_new.jpg" alt="Pet parent" fill className="object-cover" />
                  </div>
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white ring-2 ring-white shadow-md">
                    <Image src="/images/avatar_2_new.jpg" alt="Pet parent" fill className="object-cover" />
                  </div>
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white ring-2 ring-white shadow-md">
                    <Image src="/images/avatar_3_new.jpg" alt="Pet parent" fill className="object-cover" />
                  </div>
                  <div className="relative z-10 flex h-16 w-16 flex-col items-center justify-center rounded-full border-2 border-[#D4AF37] bg-[#f8f5f0] shadow-md ring-2 ring-white">
                    <span className="font-display text-lg font-bold leading-none text-[#987634]">10k+</span>
                    <span className="text-[0.4rem] font-bold tracking-widest text-[#987634] uppercase mt-0.5">Pet Parents</span>
                  </div>
                </div>

                {/* Right side: Stars, Rating, and Text */}
                <div className="flex flex-col justify-center">
                  <div className="inline-flex w-fit items-center gap-3 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-0.5">
                      <svg className="h-4 w-4 text-[#D4AF37] fill-[#D4AF37]" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <svg className="h-4 w-4 text-[#D4AF37] fill-[#D4AF37]" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <svg className="h-4 w-4 text-[#D4AF37] fill-[#D4AF37]" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <svg className="h-4 w-4 text-[#D4AF37] fill-[#D4AF37]" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <svg className="h-4 w-4 text-[#D4AF37] fill-[#D4AF37]" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    </div>
                    <span className="text-[0.65rem] font-bold text-white uppercase tracking-wider">78% Rating</span>
                  </div>
                  
                  <p className="mt-2 font-display text-2xl sm:text-3xl font-medium text-white drop-shadow-md">Loved by 10,000+ Pet Parents</p>
                  
                  <div className="mt-2 flex items-center w-full max-w-sm opacity-60">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                    <svg className="mx-2 h-2.5 w-2.5 shrink-0 text-[#D4AF37] fill-[#D4AF37]" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    <div className="h-px w-full bg-gradient-to-r from-[#D4AF37] via-transparent to-transparent" />
                  </div>
                </div>
              </Float3D>
            </ScrollReveal>
          </div>

          <div className="relative z-10 w-full pt-8 self-center">
            <ScrollReveal direction="up" delay={0.24}>
              <CareMatchFinder />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.32}>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-y-3 text-xs font-bold text-white drop-shadow-md w-full">
                <Link href={"/caregivers" as Route} className="inline-flex items-center gap-1.5 text-white transition hover:text-coral">How matching works <ArrowRight className="h-3.5 w-3.5" /></Link>
                <span className="flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-black" />Structured service history</span>
                <span className="flex items-center gap-1.5"><HeartHandshake className="h-4 w-4 text-black" />Human exception support</span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="bg-cream py-24 sm:py-32 border-b border-indigo/10 overflow-hidden relative">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
          <StardustBackground 
            background="rgba(0,0,0,0)" 
            particleColor="#301F30" 
            particleDensity={5} 
            speed={3} 
          />
        </div>
        <div className="container-shell grid items-start gap-16 lg:grid-cols-[1.15fr_0.85fr] relative z-10">
          <HeroVideoShowcase />
          
          <ScrollReveal direction="right">
            <div className="flex h-full flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral font-outfit">The PetSaathi Standard</p>
              <ScrollTextReveal 
                text="Every detail, meticulously managed." 
                className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-ink sm:text-[4rem]"
                tag="h2"
                color="inherit"
                font={{ fontSize: "inherit", fontWeight: "inherit", lineHeight: "inherit" }}
              />
              <p className="mt-6 max-w-md text-base leading-8 text-ink/60">We go beyond simple connections. From health support to specialized grooming, discover our ecosystem designed for pet longevity and owner peace of mind.</p>
              
              <ul className="mt-10 flex flex-col gap-6">
                <li className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-coral/10 text-coral">
                    <BadgeCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink">100% Verified Saathis</h3>
                    <p className="mt-1 text-sm leading-6 text-ink/60">Every caregiver passes rigorous background checks.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-leaf/10 text-leaf">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink">GPS & Photo Updates</h3>
                    <p className="mt-1 text-sm leading-6 text-ink/60">Follow along in real-time with continuous tracking.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo/10 text-indigo">
                    <HeartHandshake className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink">24/7 Human Support</h3>
                    <p className="mt-1 text-sm leading-6 text-ink/60">Our safety team is always available to assist you.</p>
                  </div>
                </li>
              </ul>
              
              <Link href="/services" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-10 w-fit rounded-full border-ink text-ink font-bold hover:bg-ink hover:text-paper")}>Explore All Services</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <DiscoveryReviewRail />

      <section className="border-y border-indigo/10 bg-paper/70 py-6">
        <div className="container-shell flex flex-wrap items-center justify-center gap-x-10 gap-y-4">{trustSignals.map(({ label, icon: Icon }) => <span key={label} className="flex items-center gap-2 text-sm font-bold text-ink/52"><Icon className="h-4 w-4 text-coral" />{label}</span>)}</div>
      </section>

      <section className="py-24 sm:py-32" id="services">
        <div className="container-shell">
          <ScrollReveal direction="up"><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="eyebrow font-outfit">Tailored Pet Care</p><ScrollTextReveal text="Comprehensive Services Designed for Every Need." tag="h2" className="section-title mt-5 max-w-[14ch]" color="inherit" font={{ fontSize: "inherit", fontWeight: "inherit", lineHeight: "inherit" }} /></div><p className="max-w-xl text-sm font-medium leading-7 text-ink/60">Every service is backed by background-checked Saathis, real-time photo/GPS telemetry, transparent pricing, and 24/7 support.</p></div></ScrollReveal>

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
          <ScrollReveal direction="up"><div className="max-w-3xl"><p className="eyebrow !text-saffron">A care protocol, not a loose transaction</p><ScrollTextReveal text="Four clear moments. One accountable thread." tag="h2" className="mt-5 font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl" /></div></ScrollReveal>

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
          <ScrollReveal direction="right"><div><p className="eyebrow">Trust without theatre</p><ScrollTextReveal text="No single badge can promise perfect care." tag="h2" className="section-title mt-5" color="inherit" font={{ fontSize: "inherit", fontWeight: "inherit", lineHeight: "inherit" }} /><p className="mt-6 text-base leading-8 text-ink/54">PetSaathi combines separate checks, service permissions, careful matching, structured proof and a formal exception path. Each layer has a specific job.</p><div className="mt-8 grid gap-3">{[[ShieldCheck, "Service-specific permissions", "A Saathi receives only the work their current evidence permits."], [Clock3, "Traceable service milestones", "Key moments belong to the booking record, not an unstructured chat."], [HeartHandshake, "People for exceptions", "Sensitive concerns move through support and safety workflows with accountable closure."]].map(([Icon, title, copy]) => { const TrustIcon = Icon as typeof ShieldCheck; return <div key={String(title)} className="flex gap-4 rounded-3xl border border-indigo/10 bg-paper/80 p-5 shadow-sm"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-leaf/10 text-leaf"><TrustIcon className="h-5 w-5" /></span><div><h3 className="font-bold">{String(title)}</h3><p className="mt-1 text-sm leading-6 text-ink/48">{String(copy)}</p></div></div>; })}</div><Link href="/safety" className={cn(buttonVariants({ variant: "outline" }), "mt-7")}>Explore the safety model <ArrowRight className="h-4 w-4" /></Link></div></ScrollReveal>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="container-shell">
          <Scale3D>
            <div className="luxury-grid overflow-hidden rounded-[3.5rem] border border-indigo/10 bg-gradient-to-br from-[#f3eafa] via-paper to-[#fff0e8] p-7 shadow-soft sm:p-12 lg:p-16">
              <div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-start"><div><p className="eyebrow">Questions before the first request</p><h2 className="mt-5 font-display text-5xl font-semibold leading-[1] tracking-[-0.055em] sm:text-6xl">Clarity is part of care.</h2><p className="mt-5 max-w-md text-sm leading-7 text-ink/50">PetSaathi should be easy to understand before you share pet details, approve a match or pay.</p></div><div className="grid gap-3">{questions.map(([question, answer]) => <details key={question} className="group rounded-3xl border border-indigo/10 bg-paper/85 p-5 open:shadow-lifted"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-semibold"><span>{question}</span><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo/[0.07] text-indigo transition group-open:rotate-45">+</span></summary><p className="mt-4 pr-9 text-sm leading-7 text-ink/52">{answer}</p></details>)}</div></div>
            </div>
          </Scale3D>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-shell">
          <div className="relative overflow-hidden rounded-[3.5rem] bg-coral p-8 text-paper shadow-soft sm:p-14 lg:p-16">
            <RotateOnScroll className="absolute -right-20 -top-20 h-80 w-80">
              <div className="h-full w-full rounded-full border-[54px] border-paper/10" />
            </RotateOnScroll>
            <div className="relative max-w-3xl">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-paper/65">Ready when their day needs you</p>
              <h2 className="mt-5 font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl">Plan thoughtful care in one calm flow.</h2>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <MagneticHoverButton 
                  label={<span className="flex items-center">Start a care request <ArrowRight className="ml-2 h-5 w-5" /></span>}
                  link="/book"
                  fill="#ffffff"
                  textColor="#000000"
                  sweepColor="#e6f2ff"
                  sweepTextColor="#000000"
                  radius={9999}
                  paddingX={28}
                  paddingY={16}
                  font={{ fontWeight: "bold" }}
                />
                <MagneticHoverButton 
                  label="Become a Saathi"
                  link="/become-a-saathi"
                  fill="transparent"
                  textColor="#ffffff"
                  sweepColor="rgba(255,255,255,0.1)"
                  sweepTextColor="#ffffff"
                  radius={9999}
                  paddingX={28}
                  paddingY={16}
                  border={true}
                  borderOptions={{ color: "rgba(255,255,255,0.3)", width: 1 }}
                  font={{ fontWeight: "bold" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#301F30] pb-28 pt-14 lg:pb-14">
        <div className="container-shell grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <PetSaathiLogo inverted={true} />
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/70">India-focused, trust-first pet care built around careful handoffs and traceable service delivery.</p>
          </div>
          
          {[
            ["Explore", [
              ["Services", "/services", PawPrint],
              ["Saathis", "/caregivers", UserRoundCheck],
              ["Membership", "/membership", BadgeCheck],
              ["Locations", "/locations", MapPin],
              ["Reviews", "/reviews", Sparkles]
            ]],
            ["Trust", [
              ["Safety", "/safety", ShieldCheck],
              ["Privacy", "/privacy", Lock],
              ["Terms", "/terms", FileText],
              ["Insurance", "/insurance", HeartHandshake],
              ["Guidelines", "/guidelines", BookOpen]
            ]],
            ["PetSaathi", [
              ["About", "/about", Info],
              ["Journal", "/journal", BookHeart],
              ["Careers", "/careers", Briefcase],
              ["Contact", "/contact", Mail],
              ["Press", "/press", Newspaper]
            ]]
          ].map(([title, links]) => (
            <div key={String(title)}>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">{String(title)}</p>
              <ul className="mt-5 grid gap-4">
                {(links as [string, Route, any][]).map(([label, href, Icon]) => (
                  <li key={href}>
                    <Link href={href} className="group flex w-fit items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white">
                      <Icon className="h-4 w-4 text-white/40 transition group-hover:text-saffron" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="container-shell mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <p className="text-xs font-medium text-white/50">© {new Date().getFullYear()} PetSaathi. All rights reserved.</p>
            <p className="text-xs font-medium text-white/50">Care feels closer.</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 transition hover:bg-saffron hover:text-[#301F30]" aria-label="Twitter">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 transition hover:bg-saffron hover:text-[#301F30]" aria-label="Instagram">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 transition hover:bg-saffron hover:text-[#301F30]" aria-label="Facebook">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 transition hover:bg-saffron hover:text-[#301F30]" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>

      <nav aria-label="Mobile navigation" className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-[1.75rem] border border-paper/80 bg-paper/90 p-2 shadow-soft backdrop-blur-2xl lg:hidden">{[[Home, "Home", "/"], [PawPrint, "Services", "/services"], [MapPin, "Find care", "/book"], [Sparkles, "Sign in", "/login"]].map(([Icon, label, href]) => { const NavIcon = Icon as typeof Home; return <Link key={String(label)} href={href as Route} className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[0.62rem] font-bold text-ink/50 transition hover:bg-indigo/[0.06] hover:text-indigo"><NavIcon className="h-4 w-4" />{String(label)}</Link>; })}</nav>
    </main>
  );
}
