"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpenText,
  Building2,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  Home,
  MapPinned,
  PawPrint,
  Scissors,
  ShieldCheck,
  Sparkles,
  Stethoscope
} from "lucide-react";

import { ScrollReveal } from "@/components/3d/scroll-reveal";
import { AnimosCard, ScrollStaggerContainer, ScrollStaggerItem } from "@/components/effects/animos-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const careJourneys = [
  {
    id: "walk",
    label: "Workday walk",
    title: "A familiar route, with a visible return.",
    service: "DOG_WALK_30",
    image: "/images/dog-walking-3d.png",
    icon: MapPinned,
    accent: "bg-saffron/16 text-[#8a5a00]",
    description: "Plan a controlled walk window around your pet’s pace, temperament and approved handover.",
    share: ["Preferred time window", "Walk habits and triggers", "Handover instructions"],
    checks: ["Local capacity", "Walk permission", "Schedule fit"],
    receive: ["Start and return milestone", "Walk notes", "Exception trail"]
  },
  {
    id: "home",
    label: "Home visit",
    title: "Their routine stays where it feels familiar.",
    service: "HOME_VISIT",
    image: "/images/service-pet-sitting.jpg",
    icon: Home,
    accent: "bg-coral/12 text-coral",
    description: "Organise feeding, water, play and selected care notes without exposing unnecessary home information.",
    share: ["Visit window", "Routine essentials", "Access handover choice"],
    checks: ["Home-care permission", "Pet context", "Visit capacity"],
    receive: ["Arrival milestone", "Routine summary", "Private photo update"]
  },
  {
    id: "grooming",
    label: "At-home grooming",
    title: "A composed grooming plan at your doorstep.",
    service: "GROOMING_HOME",
    image: "/images/care-journey-cat-grooming-v1.webp",
    icon: Scissors,
    accent: "bg-indigo/[0.09] text-indigo",
    description: "Share coat, comfort and handling context before a suitable service-approved groomer is proposed.",
    share: ["Pet size and coat", "Handling sensitivities", "Requested grooming scope"],
    checks: ["Grooming permission", "Equipment readiness", "Service-area fit"],
    receive: ["Approved scope", "Care notes", "Completion summary"]
  },
  {
    id: "vet",
    label: "Veterinary support",
    title: "Clinical support stays clear about its limits.",
    service: "VET_SUPPORT",
    image: "/images/care-journey-cat-vet-v1.webp",
    icon: Stethoscope,
    accent: "bg-leaf/12 text-leaf",
    description: "Coordinate non-emergency support and relevant records while urgent concerns remain directed to a clinic.",
    share: ["Support objective", "Relevant pet context", "Preferred clinic details"],
    checks: ["Professional scope", "Non-emergency eligibility", "Local routing"],
    receive: ["Support plan", "Record trail", "Clear escalation direction"]
  }
] as const;

const extendedPaths = [
  {
    eyebrow: "Membership",
    title: "Keep recurring care organised.",
    description: "Explore benefits designed around repeat routines without hiding service eligibility or approval steps.",
    href: "/membership",
    linkLabel: "Explore membership",
    icon: HeartHandshake,
    tone: "from-[#f4eaf8] to-[#fff5ef]"
  },
  {
    eyebrow: "Residential societies",
    title: "Coordinate care closer to home.",
    description: "See how community operations can support clearer access, handovers and local care readiness.",
    href: "/societies",
    linkLabel: "For residential societies",
    icon: Building2,
    tone: "from-[#eef7f2] to-[#fffaf0]"
  },
  {
    eyebrow: "Care journal",
    title: "Prepare before the request.",
    description: "Read practical guidance about pet routines, safer handovers and choosing the right care path.",
    href: "/journal",
    linkLabel: "Read the care journal",
    icon: BookOpenText,
    tone: "from-[#fff0e8] to-[#f3eafa]"
  }
] as const;

export function CareJourneyExplorer() {
  const reduceMotion = useReducedMotion();
  const [activeJourneyId, setActiveJourneyId] = useState<(typeof careJourneys)[number]["id"]>("walk");
  const activeJourney = careJourneys.find((journey) => journey.id === activeJourneyId) ?? careJourneys[0];
  const JourneyIcon = activeJourney.icon;

  return (
    <>
      <section className="py-24 sm:py-32" aria-labelledby="care-journey-title">
        <div className="container-shell">
          <ScrollReveal direction="up">
            <div className="grid gap-7 lg:grid-cols-[1fr_0.72fr] lg:items-end">
              <div>
                <p className="eyebrow">Explore before you request</p>
                <h2 id="care-journey-title" className="section-title mt-5 max-w-[13ch]">
                  Choose the care rhythm that fits the day.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-ink/52">
                Each service asks for different context, checks different evidence and produces a different care record. Preview that path before sharing personal details.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-10 grid grid-cols-2 gap-2 rounded-[2rem] border border-indigo/10 bg-paper/75 p-2 shadow-sm lg:grid-cols-4" role="tablist" aria-label="Care journey options">
            {careJourneys.map(({ id, label, icon: Icon }) => {
              const isActive = activeJourney.id === id;
              return (
                <button
                  key={id}
                  id={`care-journey-tab-${id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="care-journey-panel"
                  onClick={() => setActiveJourneyId(id)}
                  className={cn(
                    "flex min-h-14 items-center justify-center gap-2 rounded-[1.4rem] px-3 text-xs font-bold transition sm:text-sm",
                    isActive ? "bg-ink text-paper shadow-lifted" : "text-ink/52 hover:bg-indigo/[0.06] hover:text-indigo"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </button>
              );
            })}
          </div>

          <motion.div
            key={activeJourney.id}
            id="care-journey-panel"
            role="tabpanel"
            aria-labelledby={`care-journey-tab-${activeJourney.id}`}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 overflow-hidden rounded-[3rem] border border-indigo/10 bg-paper shadow-soft"
          >
            <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
              <div className="relative min-h-[23rem] overflow-hidden bg-gradient-to-br from-[#f3eafa] to-[#fff0e8] sm:min-h-[30rem]">
                <Image
                  src={activeJourney.image}
                  alt={`${activeJourney.label} PetSaathi care journey illustration`}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-[center_50%] sm:object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/48 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-paper/25 bg-ink/52 p-5 text-paper backdrop-blur-xl sm:bottom-7 sm:left-7 sm:right-7">
                  <span className="inline-flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-saffron">
                    <JourneyIcon className="h-4 w-4" /> {activeJourney.label}
                  </span>
                  <p className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{activeJourney.title}</p>
                </div>
              </div>

              <div className="p-6 sm:p-9 lg:p-11">
                <p className="max-w-2xl text-base leading-8 text-ink/54">{activeJourney.description}</p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {[
                    ["You share", activeJourney.share, PawPrint],
                    ["We check", activeJourney.checks, ShieldCheck],
                    ["You receive", activeJourney.receive, CheckCircle2]
                  ].map(([title, items, icon]) => {
                    const ColumnIcon = icon as typeof PawPrint;
                    return (
                      <div key={String(title)} className="rounded-3xl border border-indigo/10 bg-cream/65 p-5">
                        <span className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", activeJourney.accent)}>
                          <ColumnIcon className="h-5 w-5" />
                        </span>
                        <h3 className="mt-5 font-display text-xl font-semibold">{String(title)}</h3>
                        <div className="mt-4 grid gap-2.5">
                          {(items as readonly string[]).map((item) => (
                            <p key={item} className="flex gap-2 text-xs leading-5 text-ink/50">
                              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-leaf" />
                              {item}
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex flex-col gap-4 border-t border-indigo/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex max-w-md gap-2 text-xs leading-5 text-ink/42">
                    <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                    Availability and the final quote are checked before a caregiver proposal is approved.
                  </p>
                  <Link
                    href={`/book?service=${activeJourney.service}` as Route}
                    className={cn(buttonVariants({ variant: "primary", size: "lg" }), "shrink-0")}
                  >
                    Plan this care <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-24 sm:pb-32" aria-labelledby="care-ecosystem-title">
        <div className="container-shell">
          <ScrollReveal direction="up">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="eyebrow">More than one booking</p>
                <h2 id="care-ecosystem-title" className="section-title mt-5 max-w-[12ch]">
                  Build a calmer care ecosystem.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-ink/52">
                Continue into the parts of PetSaathi that help recurring routines, residential communities and better-informed decisions.
              </p>
            </div>
          </ScrollReveal>

          <ScrollStaggerContainer className="mt-12 grid gap-5 lg:grid-cols-3">
            {extendedPaths.map(({ eyebrow, title, description, href, linkLabel, icon: Icon, tone }) => (
              <ScrollStaggerItem key={href}>
                <AnimosCard glare={false}>
                  <Link
                    href={href as Route}
                    className={cn(
                      "group flex min-h-[22rem] h-full flex-col rounded-[2.5rem] border border-indigo/10 bg-gradient-to-br p-7 shadow-lifted transition duration-500 hover:-translate-y-1 hover:border-indigo/25",
                      tone
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-paper/85 text-indigo shadow-sm">
                        <Icon className="h-6 w-6" />
                      </span>
                      <Sparkles className="h-5 w-5 text-coral/60" />
                    </div>
                    <p className="mt-auto pt-12 text-[0.62rem] font-bold uppercase tracking-[0.19em] text-coral">{eyebrow}</p>
                    <h3 className="mt-3 max-w-[12ch] font-display text-3xl font-semibold tracking-[-0.04em]">{title}</h3>
                    <p className="mt-4 text-sm leading-7 text-ink/50">{description}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-indigo">
                      {linkLabel} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                </AnimosCard>
              </ScrollStaggerItem>
            ))}
          </ScrollStaggerContainer>
        </div>
      </section>
    </>
  );
}
