

import { type ReactNode } from "react";

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
  LogIn,
  MapPin,
  PawPrint,
  ShieldCheck,
  UserRoundCheck
} from "lucide-react";

import { PetSaathiLogo } from "@/components/brand/logo";
import { CareMatchFinder } from "@/components/marketing/care-match-finder";

import { MobileNav } from "@/components/marketing/mobile-nav";
import { ScrollReveal, Scale3D, RotateOnScroll, Float3D } from "@/components/3d/scroll-reveal";
import { TextReveal, MagneticButton, AnimosCard, ScrollStaggerContainer, ScrollStaggerItem } from "@/components/effects/animos-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { services, trustSignals } from "@/modules/catalog/services";
import { PartnerStatsBar } from "@/components/marketing/partner-stats";
import { AuthNav } from "@/components/marketing/auth-nav";
import dynamic from "next/dynamic";

const CareConcierge = dynamic(() => import("@/components/marketing/care-concierge").then(m => m.CareConcierge));
const CareJourneyExplorer = dynamic(() => import("@/components/marketing/care-journey-explorer").then(m => m.CareJourneyExplorer));
const DiscoveryReviewRail = dynamic(() => import("@/components/marketing/discovery-review-rail").then(m => m.DiscoveryReviewRail));
const HeroVideoShowcase = dynamic(() => import("@/components/marketing/hero-video-showcase").then(m => m.HeroVideoShowcase));
const MarketplaceAssurance = dynamic(() => import("@/components/marketing/marketplace-assurance").then(m => m.MarketplaceAssurance));
const TestimonialsSection = dynamic(() => import("@/components/marketing/testimonials").then(m => m.TestimonialsSection));
const HowItWorksSection = dynamic(() => import("@/components/marketing/how-it-works").then(m => m.HowItWorksSection));
const VerificationProtocol = dynamic(() => import("@/components/marketing/verification-protocol").then(m => m.VerificationProtocol));

import { LazyAnimatedLogo } from "@/components/marketing/lazy-animated-logo";

const careSteps = [
  { number: "01", title: "Share the care context", copy: "Choose the service, pet, place and time without exposing more information than the request needs.", icon: PawPrint },
  { number: "02", title: "We check the fit", copy: "Availability, service permission, local capacity and relevant risk details are reviewed before a proposal.", icon: UserRoundCheck },
  { number: "03", title: "You approve the Saathi", copy: "Review the proposed caregiver and the server-approved quote before payment and confirmation.", icon: BadgeCheck },
  { number: "04", title: "Care leaves a trail", copy: "Milestones, reports and exceptions remain connected to one private, traceable care protocol.", icon: CheckCircle2 }
] as const;

const questions = [
  ["How do I book a pet sitting session?", "Download the PetSaathi app, create a profile for your pet, and browse verified partners near you. Pick a time slot, confirm the booking, and receive live GPS updates during the session."],
  ["Are PetSaathi Partners background verified?", "Yes. Every PetSaathi Partner goes through ID verification, reference checks, and a pet-handling assessment before going live on the platform. We also enforce a no-phone policy during walks."],
  ["What cities is PetSaathi available in?", "PetSaathi is currently live in select residential societies and neighbourhoods across Ahmedabad, Bangalore, and Pune. We are expanding to Mumbai and Delhi NCR next. Explore our Cities page or check your locality above."],
  ["How much does dog walking cost?", "Pricing varies by city and session length. A standard 30-minute walk starts at ₹199. You can see exact pricing after entering your location in the app."],
  ["What is PetConnect?", "PetConnect is a first-of-its-kind service in India — it lets pet lovers who don't own pets spend quality time with your dog, supervised and verified. It's a win-win: your pet gets extra love and the partner gets joy."],
  ["Is my pet insured during a session?", "All PetSaathi sessions are covered under our partner protection policy and emergency veterinary assistance protocol. Any incident during an active session is handled by our safety team immediately."],
  ["How do I become a PetSaathi Partner?", "Click 'Become a Partner', fill the application form, complete the verification process, and attend a brief onboarding session. You can start earning from flexible hours within a week."],
  ["Can I track my dog in real time during a walk?", "Yes. Outdoor sessions feature browser-based location check-ins, milestone photo updates, and a post-walk report card. In web browsers, GPS updates require the caregiver's device screen to remain active; our upcoming native apps will support continuous background telemetry."]
] as const;

import { FaqAccordionItem } from "@/components/marketing/faq-accordion";

export function MarketingExperience({
  footerContent,
}: {
  footerContent?: ReactNode;
}) {
  return (
    <main id="main-content" className="min-h-screen overflow-hidden bg-cream text-ink" data-motion-skip>
      
      <header className="absolute inset-x-0 top-4 z-50 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[4.5rem] max-w-container-max items-center justify-between rounded-full border border-white/70 bg-white/90 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-2xl sm:px-6">
          <PetSaathiLogo />
          <nav aria-label="Primary navigation" className="hidden items-center gap-4 xl:gap-5 lg:flex">
            <Link href={"/services" as Route} className="text-[0.82rem] font-semibold text-ink/80 transition hover:text-ink">Services</Link>
            <Link href={"/caregivers" as Route} className="text-[0.82rem] font-semibold text-ink/80 transition hover:text-ink">Saathis</Link>
            <Link href={"/safety" as Route} className="text-[0.82rem] font-semibold text-ink/80 transition hover:text-ink">Safety &amp; Trust</Link>
            <Link href={"/societies" as Route} className="text-[0.82rem] font-semibold text-ink/80 transition hover:text-ink">Societies</Link>
            <Link href={"/membership" as Route} className="text-[0.82rem] font-semibold text-ink/80 transition hover:text-ink">Membership</Link>
            <Link href={"/about" as Route} className="text-[0.82rem] font-semibold text-ink/80 transition hover:text-ink">About</Link>
            <Link href={"/journal" as Route} className="text-[0.82rem] font-semibold text-ink/80 transition hover:text-ink">Journal</Link>
            <Link href={"/contact" as Route} className="text-[0.82rem] font-semibold text-ink/80 transition hover:text-ink">Contact Us</Link>
          </nav>
          <div className="flex items-center gap-3">
            <AuthNav />
          </div>
        </div>
      </header>

      {/* Sticky Mobile Availability CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-[40] border-t border-ink/10 bg-cream/90 backdrop-blur-md p-3 sm:hidden" data-motion-skip>
        <Link href={"/book" as Route} className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full rounded-2xl font-bold bg-[#C84B31] hover:bg-[#B33E26] text-white shadow-lg")}>
          Check Availability
        </Link>
      </div>

      <section data-testid="marketing-hero" className="relative flex flex-col justify-center min-h-screen pt-28 pb-12 lg:pt-36 lg:pb-16 bg-[#1e1322] text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-dog-woman.webp"
            alt="PetSaathi Hero Background"
            fill priority fetchPriority="high" sizes="100vw"
            className="object-cover object-center lg:object-[35%_center]"
            aria-hidden="true"
            data-testid="marketing-hero-background"
          />
          {/* Subtle soft gradient scrim on left only for text readability while leaving the middle (dog & woman) and right completely bright, clear, and visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent lg:w-[45%]" />
        </div>
        
        <div className="container-shell relative grid gap-8 xl:gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:min-h-[60vh]">
          <div className="relative z-10 max-w-xl self-center">
            <ScrollReveal direction="up">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                <span className="status-dot bg-leaf" />Verified Local Caregivers, Managed With Love
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.08}>
              <h1 className="sr-only">Care That Feels Like Family.</h1>
              {/* filter: drop-shadow follows the exact letter shapes — no box, just a soft white glow behind each character */}
              <div
                className="mt-2 relative inline-block"
                aria-hidden="true"
                style={{
                  filter:
                    "drop-shadow(0 0 6px rgba(255,255,255,0.60)) drop-shadow(0 0 16px rgba(255,255,255,0.38)) drop-shadow(0 0 32px rgba(255,255,255,0.20))",
                }}
              >
                <TextReveal text="Care That Feels Like Family." className="max-w-[10ch] font-display text-[3.7rem] font-semibold leading-[0.91] tracking-[-0.065em] text-[#301F30] sm:text-[5.4rem] xl:text-[6.6rem]" delay={0.08} />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.16}>
              <p className="mt-7 max-w-xl text-base font-semibold leading-8 text-white drop-shadow-md sm:text-lg">
                Plan local care with clear service context for walks, home visits, grooming and non-emergency veterinary support. Availability and permissions are checked before confirmation.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.24}>
              <Float3D className="mt-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                {/* Left side: Overlapping circles */}
                <ScrollStaggerContainer className="flex -space-x-4">
                  <ScrollStaggerItem>
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white ring-2 ring-white shadow-md">
                      <Image src="/images/avatar-1.webp" alt="Pet parent" fill sizes="64px" className="object-cover" />
                    </div>
                  </ScrollStaggerItem>
                  <ScrollStaggerItem>
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white ring-2 ring-white shadow-md">
                      <Image src="/images/avatar-2.webp" alt="Pet parent" fill sizes="64px" className="object-cover" />
                    </div>
                  </ScrollStaggerItem>
                  <ScrollStaggerItem>
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white ring-2 ring-white shadow-md">
                      <Image src="/images/avatar-3.webp" alt="Pet parent" fill sizes="64px" className="object-cover" />
                    </div>
                  </ScrollStaggerItem>
                  <ScrollStaggerItem>
                    <div className="relative z-10 flex h-16 w-16 flex-col items-center justify-center rounded-full border-2 border-[#D4AF37] bg-[#f8f5f0] shadow-md ring-2 ring-white">
                      <span className="font-display text-sm font-bold leading-none text-[#725622]">Care</span>
                      <span className="text-[0.4rem] font-bold tracking-widest text-[#725622] uppercase mt-0.5">Plans</span>
                    </div>
                  </ScrollStaggerItem>
                </ScrollStaggerContainer>

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
                    <span className="text-[0.65rem] font-bold text-white uppercase tracking-wider">Care detail</span>
                  </div>
                  
                  <p className="mt-2 font-display text-2xl sm:text-3xl font-medium text-white drop-shadow-md">Designed for thoughtful local care</p>
                  
                  <div className="mt-2 flex items-center w-full max-w-sm opacity-60">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                    <svg className="mx-2 h-2.5 w-2.5 shrink-0 text-[#D4AF37] fill-[#D4AF37]" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    <div className="h-px w-full bg-gradient-to-r from-[#D4AF37] via-transparent to-transparent" />
                  </div>
                </div>
              </Float3D>
            </ScrollReveal>
          </div>

          <div className="relative z-10 w-full lg:max-w-[510px] xl:max-w-[530px] lg:ml-auto pt-8 self-center">
            <ScrollReveal direction="up" delay={0.24}>
              <CareMatchFinder />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.32}>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-y-3 text-xs font-bold text-white drop-shadow-md w-full">
                <Link href={"/caregivers" as Route} className="inline-flex items-center gap-1.5 text-white transition hover:text-coral">How matching works <ArrowRight className="h-3.5 w-3.5" /></Link>
                <span className="flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-saffron" />Structured service history</span>
                <span className="flex items-center gap-1.5"><HeartHandshake className="h-4 w-4 text-saffron" />Human exception support</span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <PartnerStatsBar />

      <section className="bg-cream py-12 sm:py-16 border-b border-indigo/10 overflow-hidden">
        <div className="container-shell grid items-start gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          <HeroVideoShowcase />
          
          <ScrollReveal direction="right">
            <div className="flex h-full flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral font-outfit">The PetSaathi Standard</p>
              <h2 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-ink sm:text-[4rem]">Every detail, meticulously managed.</h2>
              <p className="mt-6 max-w-md text-base leading-8 text-ink/80">We go beyond simple connections. From health support to specialized grooming, discover our ecosystem designed for pet longevity and owner peace of mind.</p>
              
              <ul className="mt-10 flex flex-col gap-6">
                <li className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-coral/10 text-coral">
                    <BadgeCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink">Service-Specific Permission Checks</h3>
                    <p className="mt-1 text-sm leading-6 text-ink/80">Every caregiver passes rigorous background checks.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-leaf/10 text-leaf">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink">Verified Photo Updates</h3>
                    <p className="mt-1 text-sm leading-6 text-ink/80">Follow along with event-based tracking.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo/10 text-indigo">
                    <HeartHandshake className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink">Accountable Human Support</h3>
                    <p className="mt-1 text-sm leading-6 text-ink/80">Our safety team is available during all active service hours.</p>
                  </div>
                </li>
              </ul>
              
              <Link href="/services" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-10 w-fit rounded-full border-ink text-ink font-bold hover:bg-ink hover:text-paper")}>Explore All Services</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <HowItWorksSection />
      
      <DiscoveryReviewRail />

      <TestimonialsSection />

      {/* ── Animated Trust Ticker ── */}
      <section className="relative overflow-hidden border-y border-indigo/10 bg-paper/70 py-0">
        {/* left + right fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-paper/90 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-paper/90 to-transparent" />

        {/* track 1 — scrolls left */}
        <div
          className="group flex w-max items-center py-4 hover:[animation-play-state:paused] will-change-transform"
          style={{ animation: "marquee 40s linear infinite" }}
        >
          {[...Array(2)].flatMap(() => trustSignals).map(({ label, icon: Icon }, i) => (
            <span
              key={`t1-${i}`}
              className="flex shrink-0 items-center gap-2.5 px-8 text-sm font-bold text-ink/80 transition-colors duration-300 hover:text-indigo"
            >
              <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-coral/10">
                <Icon className="h-3.5 w-3.5 text-coral" />
              </span>
              {label}
              {/* shimmer diamond separator */}
              <span className="ml-6 h-1 w-1 rotate-45 rounded-sm bg-saffron/50" />
            </span>
          ))}
        </div>
      </section>

      {/* keyframes for the ticker pulse removed */}
      <style>{`
        /* removed tickerPulse */
      `}</style>

      <section className="py-12 sm:py-16" id="services">
        <div className="container-shell">
          <ScrollReveal direction="up"><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="eyebrow font-outfit">Tailored Pet Care</p><h2 className="section-title mt-5 max-w-[14ch]">Comprehensive Services Designed for Every Need.</h2></div><p className="max-w-xl text-sm font-medium leading-7 text-ink/80">Every service follows service-specific permissions, transparent pricing, structured updates where agreed, and clear human support pathways.</p></div></ScrollReveal>

          <ScrollStaggerContainer className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map(({ slug, name, kicker, description, icon: Icon, image }) => (
              <ScrollStaggerItem key={slug}>
                <div className="h-full">
                  <Link href={`/services/${slug}` as Route} className="group flex h-full flex-col overflow-hidden rounded-5xl border border-indigo/10 bg-paper p-6 shadow-lifted transition-all duration-500 hover:-translate-y-1 hover:border-indigo/30 hover:shadow-soft antialiased">
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
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-paper text-indigo shadow-md transition group-hover:bg-indigo group-hover:text-paper"><Icon className="h-5 w-5" /></span>
                      </div>
                      <div className="absolute right-4 top-4">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink/80 shadow-md transition group-hover:bg-coral group-hover:text-paper"><ChevronRight className="h-4 w-4" /></span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col pt-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-coral font-outfit">{kicker}</p>
                      <div className="mt-2 h-[40px]">
                        <h3 className="font-display text-3xl font-bold tracking-[-0.04em] text-ink">{name}</h3>
                      </div>
                      <div className="mt-3 h-[96px]">
                        <p className="text-sm font-medium leading-6 text-ink/80">{description}</p>
                      </div>
                      <div className="mt-auto pt-4 border-t border-indigo/10 flex items-center justify-between text-xs font-bold text-indigo group-hover:text-coral transition">
                        <span>See service details</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </div>
              </ScrollStaggerItem>
            ))}
          </ScrollStaggerContainer>
        </div>
      </section>

      <MarketplaceAssurance />

      <CareJourneyExplorer />

      <CareConcierge />

      <section className="relative overflow-hidden bg-[#2f2032] py-12 text-paper sm:py-16">
        <div className="absolute inset-0 luxury-grid opacity-[0.08]" />
        <div className="container-shell relative">
          <ScrollReveal direction="up"><div className="max-w-3xl"><p className="eyebrow !text-saffron">A care protocol, not a loose transaction</p><h2 className="mt-5 font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl">Four clear moments. One accountable thread.</h2></div></ScrollReveal>

          <ScrollStaggerContainer className="mt-14 grid gap-4 lg:grid-cols-4">
            {careSteps.map(({ number, title, copy, icon: Icon }) => (
              <ScrollStaggerItem key={number}>
                  <article className="h-full rounded-4xl border border-paper/10 bg-[#3f2a44] p-6 transition duration-300 hover:border-saffron/30">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-3xl font-semibold text-saffron">{number}</span>
                      <Icon className="h-5 w-5 text-paper/80" />
                    </div>
                    <h3 className="mt-10 font-display text-2xl font-semibold">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-paper/80">{copy}</p>
                  </article>
              </ScrollStaggerItem>
            ))}
          </ScrollStaggerContainer>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-shell grid gap-12 lg:grid-cols-[1fr_0.92fr]">
          <ScrollReveal direction="left" className="h-full"><div className="relative h-full min-h-[34rem] overflow-hidden rounded-[3.5rem] border border-indigo/10 bg-gradient-to-br from-[#f3eafa] to-[#fff0e8] shadow-soft"><Image src="/images/privacy-stage-illustration.webp" alt="A pet parent reviewing a protected PetSaathi care record beside her resting dog" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" /><div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-paper/30 bg-paper p-5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo/80">Privacy by stage</p><p className="mt-2 font-display text-2xl font-semibold">The right information appears only when the relationship requires it.</p></div></div></ScrollReveal>
          <ScrollReveal direction="right"><div><p className="eyebrow">Trust without theatre</p><h2 className="section-title mt-5">No single badge can promise perfect care.</h2><p className="mt-6 text-base leading-8 text-ink/80">PetSaathi combines separate checks, service permissions, careful matching, structured proof and a formal exception path. Each layer has a specific job.</p><div className="mt-8 grid gap-3">{[[ShieldCheck, "Service-specific permissions", "A Saathi receives only the work their current evidence permits."], [Clock3, "Traceable service milestones", "Key moments belong to the booking record, not an unstructured chat."], [HeartHandshake, "People for exceptions", "Sensitive concerns move through support and safety workflows with accountable closure."]].map(([Icon, title, copy]) => { const TrustIcon = Icon as typeof ShieldCheck; return <div key={String(title)} className="flex gap-4 rounded-3xl border border-indigo/10 bg-paper/80 p-5 shadow-sm"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-leaf/10 text-leaf"><TrustIcon className="h-5 w-5" /></span><div><h3 className="font-bold">{String(title)}</h3><p className="mt-1 text-sm leading-6 text-ink/80">{String(copy)}</p></div></div>; })}</div><Link href="/safety" className={cn(buttonVariants({ variant: "outline" }), "mt-7")}>Explore the safety model <ArrowRight className="h-4 w-4" /></Link></div></ScrollReveal>
        </div>
      </section>

      <VerificationProtocol />

      <section className="pb-12 sm:pb-16">
        <div className="container-shell">
          <Scale3D>
            <div className="luxury-grid overflow-hidden rounded-[3.5rem] border border-indigo/10 bg-gradient-to-br from-[#f3eafa] via-paper to-[#fff0e8] p-7 shadow-soft sm:p-12 lg:p-16">
              <div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-start"><div><p className="eyebrow">Questions before the first request</p><h2 className="mt-5 font-display text-5xl font-semibold leading-[1] tracking-[-0.055em] sm:text-6xl">Clarity is part of care.</h2><p className="mt-5 max-w-md text-sm leading-7 text-ink/80">PetSaathi should be easy to understand before you share pet details, approve a match or pay.</p></div><div className="grid gap-3">{questions.map(([question, answer]) => <FaqAccordionItem key={question} question={question} answer={answer} />)}</div></div>
            </div>
          </Scale3D>
        </div>
      </section>

      <section className="pb-12">
        <div className="container-shell">
          <div className="relative overflow-hidden rounded-[3.5rem] bg-coral p-8 text-paper shadow-soft sm:p-14 lg:p-16">
            <RotateOnScroll className="absolute -right-20 -top-20 h-80 w-80">
              <div className="h-full w-full rounded-full border-[54px] border-paper/10" />
            </RotateOnScroll>
            <ScrollReveal direction="up" className="relative max-w-3xl">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-paper/80">Ready when their day needs you</p>
              <h2 className="mt-5 font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl">Plan thoughtful care in one calm flow.</h2>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <MagneticButton strength={0.3}>
                  <Link href="/book" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "bg-paper text-ink hover:bg-ink hover:text-paper font-bold")}>Find Care &amp; Book <ArrowRight className="h-5 w-5" /></Link>
                </MagneticButton>
                <MagneticButton strength={0.2}>
                  <Link href="/become-a-saathi" className="inline-flex min-h-14 items-center justify-center rounded-full border border-paper/30 px-7 text-sm font-bold text-paper transition hover:bg-paper/10">Become a Saathi</Link>
                </MagneticButton>
                <MagneticButton strength={0.2}>
                  <Link href="/membership" className="inline-flex min-h-14 items-center justify-center rounded-full bg-paper/10 px-7 text-sm font-bold text-paper transition hover:bg-paper/20">Join Membership</Link>
                </MagneticButton>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {footerContent}

      <nav aria-label="Mobile navigation" className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-[1.75rem] border border-paper/80 bg-paper/90 p-2 shadow-soft backdrop-blur-2xl lg:hidden">{[[Home, "Home", "/"], [PawPrint, "Services", "/services"], [MapPin, "Find care", "/book"], [LogIn, "Sign in", "/login"]].map(([Icon, label, href]) => { const NavIcon = Icon as typeof Home; return <Link key={String(label)} href={href as Route} className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[0.62rem] font-bold text-ink/80 transition hover:bg-indigo/[0.06] hover:text-indigo"><NavIcon className="h-4 w-4" />{String(label)}</Link>; })}</nav>
    </main>
  );
}



