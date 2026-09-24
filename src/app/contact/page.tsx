import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Building2, 
  Clock, 
  HelpCircle, 
  Mail, 
  MapPin, 
  MessageCircle, 
  PhoneCall, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles 
} from "lucide-react";

import { ContactForm } from "@/components/forms/contact-form";
import { PublicShell } from "@/components/marketing/public-shell";

export const metadata: Metadata = { 
  title: "Contact Care Concierge",
  description: "Get in touch with PetSaathi care specialists for booking assistance, society onboarding, or emergency support.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Care Concierge | PetSaathi",
    description: "Get in touch with PetSaathi care specialists for booking assistance, society onboarding, or emergency support.",
    url: "https://petsaathi.in/contact",
    siteName: "PetSaathi",
    images: [{ url: "/images/contact-concierge-hero.webp", width: 1200, height: 630, alt: "Contact PetSaathi Care Concierge" }],
    locale: "en_IN",
    type: "website",
  },
  robots: { index: true, follow: true }
};

const faqs = [
  {
    q: "How quickly will someone respond to my message?",
    a: "All messages are acknowledged within 2–4 business hours (Monday to Saturday, 8:00 AM – 8:00 PM IST). Safety and urgent operational matters are triaged with top priority."
  },
  {
    q: "What should I do if an active service is currently in progress?",
    a: "If you have an active booking right now, do not use the contact form. Open your Live Dashboard to access real-time GPS tracking, walk updates, or tap the emergency button for instant supervisor assistance."
  },
  {
    q: "How does our apartment society or RWA partner with PetSaathi?",
    a: "Select 'Society Partnership' in the form above. Our residential partnerships team will arrange an on-site security briefing, gate pass protocol demonstration, and customized pool setup for your residents."
  },
  {
    q: "I want to become a certified Saathi caregiver. Can I apply here?",
    a: "Yes! Choose 'Become a Saathi' in the enquiry form, or head directly to our Saathi Careers portal to begin your multi-stage background check and training application."
  }
];

export default async function ContactPage({ searchParams }: { searchParams?: Promise<{ topic?: string }> }) {
  let topic: string | undefined;
  try {
    const resolved = searchParams ? await searchParams.catch(() => undefined) : undefined;
    topic = resolved?.topic;
  } catch {
    topic = undefined;
  }

  return (
    <PublicShell>
      {/* 1. FULL-BLEED LUXURY HERO BANNER */}
      <section className="relative min-h-[440px] sm:min-h-[500px] lg:min-h-[540px] w-full overflow-hidden bg-ink text-paper" suppressHydrationWarning>
        <Image
          src="/images/contact-concierge-hero.webp"
          alt="PetSaathi Care Concierge & Pet Parent consultation"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[center_30%] opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/25 lg:w-3/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />

        <div className="container-shell relative flex h-full flex-col justify-center pb-20 pt-28 sm:pt-36">
          <div className="max-w-2xl text-left items-start flex flex-col">
            <span className="inline-flex items-center gap-2 rounded-full border border-saffron/40 bg-saffron/20 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-saffron backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" /> Care Concierge &amp; Support
            </span>
            <h1
              style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.85)) drop-shadow(0 0 18px rgba(255,255,255,0.65)) drop-shadow(0 0 32px rgba(255,255,255,0.40))" }}
              className="mt-5 font-display text-4xl font-bold tracking-tight text-[#301F30] sm:text-5xl lg:text-6xl sm:leading-[1.1]"
            >
              WE’RE HERE FOR YOUR PET FAMILY
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base font-medium leading-7 text-paper/85">
              Have a question about personalized pet sitting, daily walk schedules, society onboardings, or need immediate assistance? Our senior care specialists are ready to help.
            </p>

            {/* Quick Live Status Indicators */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-paper/80">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 backdrop-blur-md border border-white/15">
                <span className="h-2 w-2 rounded-full bg-leaf animate-pulse" /> Concierge Desk Active
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 backdrop-blur-md border border-white/15">
                <Clock className="h-3.5 w-3.5 text-saffron" /> 2–4 Hr Response SLA
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 backdrop-blur-md border border-white/15">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> ₹50,000 Safety Protocol
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN INTERACTIVE CONTENT GRID */}
      <section className="container-shell -mt-10 sm:-mt-14 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT COLUMN: DIRECT CHANNELS & OPERATIONS (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            
            {/* Priority Hotline Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-white/95 p-6 shadow-lifted transition-all hover:border-emerald-500/40 hover:shadow-2xl">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 shadow-sm transition-transform group-hover:scale-105">
                  <PhoneCall className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-emerald-100/70 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-emerald-800">
                  Priority Hotline
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">
                Direct Telephone Line
              </h3>
              <p className="mt-1 text-xs text-ink/70 leading-relaxed">
                Direct line to our senior care coordinators for instant scheduling, verification queries, and urgent requests.
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
                <div>
                  <span className="block text-[0.7rem] font-semibold uppercase tracking-wider text-ink/50">Toll-Free in India</span>
                  <a 
                    href="tel:+918000738722" 
                    className="text-base font-bold text-ink hover:text-emerald-700 transition-colors"
                  >
                    +91 80007 38722
                  </a>
                </div>
                <a
                  href="tel:+918000738722"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800"
                >
                  Call Now
                </a>
              </div>
              <p className="mt-2 text-[0.68rem] text-ink/50">
                Operating hours: Monday – Saturday, 8:00 AM – 8:00 PM IST
              </p>
            </div>

            {/* Instant WhatsApp Concierge Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-leaf/20 bg-white/95 p-6 shadow-lifted transition-all hover:border-leaf/40 hover:shadow-2xl">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf/10 text-leaf shadow-sm transition-transform group-hover:scale-105">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-leaf/15 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-leaf">
                  Instant Messaging
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">
                WhatsApp Care Concierge
              </h3>
              <p className="mt-1 text-xs text-ink/70 leading-relaxed">
                Prefer WhatsApp? Connect with our desk for quick package inquiries, neighborhood availability, and caregiver briefings.
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
                <span className="text-xs font-bold text-ink">Average reply: &lt; 15 mins</span>
                <a
                  href="https://wa.me/918000738722?text=Hi%20PetSaathi%2C%20I%20have%20an%20enquiry%20regarding%20pet%20care%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-leaf px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-leaf/90"
                >
                  Chat on WhatsApp <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Support Desk Email Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-indigo/15 bg-white/95 p-6 shadow-lifted transition-all hover:border-indigo/35 hover:shadow-2xl">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo/10 text-indigo shadow-sm transition-transform group-hover:scale-105">
                  <Mail className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-indigo/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-indigo">
                  Official Inquiries
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">
                Email Care Desk
              </h3>
              <p className="mt-1 text-xs text-ink/70 leading-relaxed">
                For corporate partnerships, vendor alliances, media queries, or detailed society proposals.
              </p>
              <div className="mt-4 border-t border-ink/10 pt-4">
                <a
                  href="mailto:support@petsaathi.com"
                  className="text-sm font-bold text-indigo hover:text-coral transition-colors"
                >
                  support@petsaathi.com
                </a>
              </div>
            </div>

            {/* Live Booking Safety Notice */}
            <div className="rounded-3xl border border-coral/20 bg-gradient-to-br from-paper to-coral/5 p-6 shadow-soft">
              <div className="flex items-center gap-2.5 text-coral">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">Active Booking in Progress?</span>
              </div>
              <p className="mt-2 text-xs text-ink/80 leading-relaxed">
                Need immediate updates on an ongoing walk, sitting, or caregiver visit? Don&apos;t wait for email. Access live GPS tracks, handover photos, and 24/7 supervisor SOS directly in your portal.
              </p>
              <Link
                href="/dashboard"
                className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold text-coral hover:text-coral/80 underline"
              >
                Go to Live Dashboard <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Operating Metros Chips */}
            <div className="rounded-3xl border border-ink/10 bg-white/80 p-5 shadow-xs">
              <span className="text-[0.68rem] font-bold uppercase tracking-wider text-ink/50 block mb-2">
                Active City Clusters
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-ink/75">
                {["Bengaluru", "Mumbai", "Delhi NCR", "Pune", "Hyderabad", "Ahmedabad"].map((city) => (
                  <span key={city} className="inline-flex items-center gap-1 rounded-lg bg-surface px-2.5 py-1 text-ink/80">
                    <MapPin className="h-3 w-3 text-coral" /> {city}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: LUXURY INTERACTIVE CONTACT FORM (7 COLS) */}
          <div className="lg:col-span-7">
            <ContactForm defaultTopic={topic} />
          </div>

        </div>
      </section>

      {/* 3. FREQUENTLY ASKED QUESTIONS SECTION */}
      <section className="border-t border-ink/10 bg-surface/40 py-16 sm:py-24">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-indigo">
              <HelpCircle className="h-3.5 w-3.5" /> Answers Before You Ask
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Common Questions &amp; Next Steps
            </h2>
            <p className="mt-3 text-sm text-ink/70">
              Everything you need to know about our response times, society partnerships, and safety mechanisms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft transition-all hover:border-indigo/25 hover:shadow-md">
                <h3 className="font-display text-base font-bold text-ink">
                  {faq.q}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-ink/70 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="mt-14 max-w-4xl mx-auto rounded-3xl border border-indigo/15 bg-gradient-to-r from-[#5B3D7A]/10 via-[#301F30]/5 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-indigo block">Looking to explore services?</span>
              <h4 className="font-display text-xl font-bold text-ink mt-1">Browse all verified caregiver offerings</h4>
              <p className="text-xs text-ink/70 mt-1">From GPS-tracked dog walking to veterinary home visits and boarding.</p>
            </div>
            <Link
              href="/services"
              className="shrink-0 rounded-2xl bg-indigo px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo/90 transition-all"
            >
              Explore Services →
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
