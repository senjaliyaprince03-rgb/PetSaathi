"use client";

import {
  ClipboardCheck,
  HeartHandshake,
  Radio,
  SlidersHorizontal,
  Cpu,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { ScrollReveal } from "@/components/3d/scroll-reveal";
import { cn } from "@/lib/cn";

const steps = [
  {
    number: "01",
    badge: "Step 01",
    icon: SlidersHorizontal,
    title: "Select Care & Locality",
    description: "Pick from 7 tailored care services and enter your locality or society to view verified real-time availability.",
    highlight: "Instant local quotes",
    color: "amber",
    gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
    iconBg: "bg-amber-50 text-amber-600 border-amber-200/80 group-hover:bg-amber-500 group-hover:text-white",
    tagBg: "bg-amber-50 text-amber-700 border-amber-200/60"
  },
  {
    number: "02",
    badge: "Step 02",
    icon: Cpu,
    title: "Care Match Engine",
    description: "Our algorithm evaluates caregiver certifications, pet temperament fit, distance, and verified schedule capacity.",
    highlight: "100% Vetted Saathis",
    color: "violet",
    gradient: "from-violet-500/10 via-violet-500/5 to-transparent",
    iconBg: "bg-violet-50 text-violet-600 border-violet-200/80 group-hover:bg-violet-600 group-hover:text-white",
    tagBg: "bg-violet-50 text-violet-700 border-violet-200/60"
  },
  {
    number: "03",
    badge: "Step 03",
    icon: HeartHandshake,
    title: "Free Meet & Greet",
    description: "Enjoy a relaxed preliminary introduction before your session starts to ensure complete pet comfort and routine alignment.",
    highlight: "Zero-pressure intro",
    color: "rose",
    gradient: "from-rose-500/10 via-rose-500/5 to-transparent",
    iconBg: "bg-rose-50 text-rose-600 border-rose-200/80 group-hover:bg-rose-500 group-hover:text-white",
    tagBg: "bg-rose-50 text-rose-700 border-rose-200/60"
  },
  {
    number: "04",
    badge: "Step 04",
    icon: Radio,
    title: "Live GPS & Updates",
    description: "Follow outdoor GPS checkpoints, timestamped check-ins, hydration stops, and photo updates live on your phone.",
    highlight: "Live GPS & photos",
    isLive: true,
    color: "emerald",
    gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200/80 group-hover:bg-emerald-600 group-hover:text-white",
    tagBg: "bg-emerald-50 text-emerald-700 border-emerald-200/60"
  },
  {
    number: "05",
    badge: "Step 05",
    icon: ClipboardCheck,
    title: "Pet Report Card",
    description: "Receive an itemized digital report card detailing distance walked, meals, bathroom breaks, and caregiver observations.",
    highlight: "Complete vitals log",
    color: "purple",
    gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
    iconBg: "bg-purple-50 text-purple-600 border-purple-200/80 group-hover:bg-purple-600 group-hover:text-white",
    tagBg: "bg-purple-50 text-purple-700 border-purple-200/60"
  }
];

export function HowItWorksSection() {
  return (
    <section className="relative py-20 lg:py-24 bg-[#FAF7F2] border-t border-indigo/10 overflow-hidden" id="how-it-works">
      {/* Subtle ambient light accents */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-full max-w-4xl bg-gradient-to-b from-saffron/10 via-coral/5 to-transparent blur-3xl" />
      
      <div className="container-shell relative z-10">
        <ScrollReveal direction="up" immediate>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-coral/20 bg-coral/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-coral shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-coral" />
              </span>
              Accountable Care Protocol
            </div>
            <h2 className="section-title mt-5 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-ink">
              How PetSaathi Works
            </h2>
            <p className="mt-4 text-ink/75 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              A calm, structured 5-step journey built so pet parents stay fully informed and pets stay safe, calm, and happy at every milestone.
            </p>
          </div>
        </ScrollReveal>

        {/* 5-Step Connected Timeline */}
        <div className="mt-16 relative">
          {/* Subtle connected track behind cards on desktop */}
          <div className="hidden lg:block absolute top-10 left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-amber-200 via-violet-200 to-purple-200 z-0 opacity-60" />

          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 relative z-10">
            {steps.map((step, idx) => (
              <ScrollReveal key={step.number} direction="up" delay={0.06 * idx} immediate>
                <div
                  className="group relative flex h-full flex-col justify-between rounded-[2rem] border border-indigo/10 bg-white p-5 xl:p-6 shadow-[0_4px_24px_rgba(30,19,34,0.04)] transition-all duration-300 hover:-translate-y-2 hover:border-indigo/20 hover:shadow-[0_20px_40px_rgba(30,19,34,0.10)]"
                >
                  {/* Card top: Step pill & directional indicator */}
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="inline-flex items-center rounded-full bg-[#FAF7F2] border border-indigo/10 px-3 py-1 font-mono text-[0.7rem] font-bold tracking-wider text-ink/70 group-hover:bg-ink group-hover:text-white transition-colors duration-200">
                        {step.badge}
                      </span>
                      {idx < steps.length - 1 && (
                        <ChevronRight className="hidden lg:block h-4 w-4 text-indigo/25 group-hover:text-coral transition-colors" />
                      )}
                    </div>

                    {/* Step Icon */}
                    <div className="mb-5 flex items-center justify-start">
                      <div className={cn("relative flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300 shadow-xs group-hover:scale-105 group-hover:shadow-md", step.iconBg)}>
                        <step.icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                        {step.isLive && (
                          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Step Title & Description */}
                    <h3 className="font-display text-lg font-bold text-ink mb-2 group-hover:text-coral transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-[0.82rem] text-ink/70 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Micro-benefit highlight tag at bottom */}
                  <div className="mt-6 pt-4 border-t border-indigo/5">
                    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-bold tracking-wide transition-colors", step.tagBg)}>
                      <CheckCircle2 className="h-3 w-3 shrink-0" />
                      {step.highlight}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
