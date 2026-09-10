"use client";

import Link from "next/link";
import type { Route } from "next";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  FileCheck2,
  HeartHandshake,
  Lock,
  PhoneCall,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  Users
} from "lucide-react";

import { ScrollReveal } from "@/components/3d/scroll-reveal";
import { ScrollStaggerContainer, ScrollStaggerItem } from "@/components/effects/animos-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const verificationSteps = [
  {
    step: "01",
    title: "Government ID Verification",
    description: "Official government identification (Aadhaar / Passport) is cross-checked with biometric records and primary address documentation.",
    icon: UserCheck,
    tag: "Identity Validated"
  },
  {
    step: "02",
    title: "Background & Address Check",
    description: "Multi-point criminal history screening, permanent residential address verification, and professional character reference checks.",
    icon: Lock,
    tag: "Safety Screened"
  },
  {
    step: "03",
    title: "Practical Pet Handling Assessment",
    description: "Rigorous in-person and video evaluations of canine and feline handling, stress-signal recognition, leash control, and emergency calmness.",
    icon: FileCheck2,
    tag: "Skill Certified"
  },
  {
    step: "04",
    title: "Probationary Supervised Sessions",
    description: "Shadow sessions conducted under the direct supervision of a senior Saathi operations lead before independent booking eligibility.",
    icon: BadgeCheck,
    tag: "Active Mentorship"
  }
] as const;

const safetyHighlights = [
  {
    title: "Zero-Tolerance Conduct Policy",
    desc: "Strict protocol prohibiting personal phone use during active walks, unauthorized guests, and unrecorded deviations.",
    icon: ShieldCheck
  },
  {
    title: "Continuous Review & Audit",
    desc: "Real-time rating monitoring and quarterly re-verification audits to maintain the highest service standard.",
    icon: CheckCircle2
  },
  {
    title: "24/7 Emergency Care Guarantee",
    desc: "Partner network of accredited veterinary clinics, guaranteed backup caregiver dispatch, and ₹50,000 emergency medical cover.",
    icon: Stethoscope
  },
  {
    title: "Substitute Caregiver Guarantee",
    desc: "If your assigned Saathi experiences an unexpected emergency, our ops team dispatches an equally qualified substitute immediately.",
    icon: HeartHandshake
  }
] as const;

export function VerificationProtocol() {
  return (
    <section className="relative overflow-hidden bg-[#241727] py-16 text-paper sm:py-24" id="verification-protocol">
      <div className="absolute inset-0 luxury-grid opacity-[0.06]" />
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-coral/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-saffron/10 blur-3xl" />

      <div className="container-shell relative">
        <ScrollReveal direction="up">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-saffron/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-saffron backdrop-blur-md font-outfit">
                <ShieldCheck className="h-3.5 w-3.5" /> 4-Step Verification Protocol
              </span>
              <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-paper sm:text-6xl">
                Only the top 8% of applicants earn the Saathi badge.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-paper/80 lg:text-right">
              Every PetSaathi caregiver undergoes our rigorous multi-stage vetting architecture before taking on their first walk or home visit.
            </p>
          </div>
        </ScrollReveal>

        {/* 4-Step Protocol Cards */}
        <ScrollStaggerContainer className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {verificationSteps.map(({ step, title, description, icon: Icon, tag }) => (
            <ScrollStaggerItem key={step}>
              <article className="group relative flex h-full flex-col justify-between rounded-[2.25rem] border border-paper/10 bg-[#342238] p-6 transition-all duration-300 hover:border-saffron/40 hover:bg-[#3d2742]">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl font-bold text-saffron">{step}</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-paper/10 text-paper/90 transition group-hover:bg-saffron group-hover:text-ink">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <span className="mt-4 inline-block rounded-full bg-paper/5 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-saffron/90">
                    {tag}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-bold text-paper">{title}</h3>
                  <p className="mt-2 text-xs leading-6 text-paper/75">{description}</p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 border-t border-paper/10 pt-4 text-[0.65rem] font-semibold text-paper/60">
                  <CheckCircle2 className="h-3.5 w-3.5 text-leaf" /> Verified Requirement
                </div>
              </article>
            </ScrollStaggerItem>
          ))}
        </ScrollStaggerContainer>

        {/* Safety Highlights & Guarantee */}
        <div className="mt-12 grid gap-5 rounded-[2.5rem] border border-paper/10 bg-[#1e1322] p-8 sm:grid-cols-2 lg:grid-cols-4 sm:p-10">
          {safetyHighlights.map(({ title, desc, icon: Icon }) => (
            <div key={title} className="flex flex-col gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral/20 text-coral">
                <Icon className="h-5 w-5" />
              </span>
              <h4 className="font-display text-base font-bold text-paper">{title}</h4>
              <p className="text-xs leading-relaxed text-paper/70">{desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA to Safety Page */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-paper/10 bg-paper/5 px-6 py-4 sm:flex-row">
          <p className="text-xs text-paper/80 text-center sm:text-left">
            Want to review our comprehensive ₹50,000 medical guarantee, zero-tolerance policy, and incident response SLA?
          </p>
          <Link
            href={"/safety" as Route}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0 rounded-full border-paper/30 text-paper hover:bg-paper hover:text-ink font-bold")}
          >
            Explore Complete Safety Architecture <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
