"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ClipboardCheck,
  Clock3,
  HeartPulse,
  Home,
  MapPinned,
  PawPrint,
  RotateCcw,
  Scissors,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope
} from "lucide-react";

import { ScrollReveal } from "@/components/3d/scroll-reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type PetChoice = "DOG" | "CAT" | "OTHER";
type CareNeed = "movement" | "routine" | "grooming" | "health";

const petChoices = [
  { value: "DOG", label: "Dog", icon: PawPrint },
  { value: "CAT", label: "Cat", icon: Sparkles },
  { value: "OTHER", label: "Another pet", icon: HeartPulse }
] as const;

const careNeeds = [
  { value: "movement", label: "Movement and exercise", detail: "A walk, outdoor rhythm or suitable enrichment.", icon: MapPinned },
  { value: "routine", label: "Home routine support", detail: "Food, water, play and selected care instructions.", icon: Home },
  { value: "grooming", label: "Grooming and hygiene", detail: "A comfort-led grooming plan at home.", icon: Scissors },
  { value: "health", label: "Veterinary coordination", detail: "Non-emergency clinical support and record routing.", icon: Stethoscope }
] as const;

const recommendations = {
  DOG_WALK_30: {
    title: "Start with a 30-minute dog walk",
    summary: "A controlled walk window is the clearest starting point for planned movement and companionship.",
    code: "DOG_WALK_30"
  },
  HOME_VISIT: {
    title: "Start with a home visit",
    summary: "A home visit keeps routine, enrichment and selected care instructions in the pet’s familiar environment.",
    code: "HOME_VISIT"
  },
  GROOMING_HOME: {
    title: "Start with at-home grooming",
    summary: "Share coat, size and handling context before an eligible groomer and service scope are proposed.",
    code: "GROOMING_HOME"
  },
  VET_SUPPORT: {
    title: "Start with veterinary support",
    summary: "Use this for planned, non-emergency coordination. Urgent symptoms should go directly to the nearest veterinary clinic.",
    code: "VET_SUPPORT"
  }
} as const;

const careDetailCards = [
  {
    number: "01",
    title: "Context before access",
    copy: "Caregivers see only the information required for the approved stage and service.",
    icon: ShieldCheck
  },
  {
    number: "02",
    title: "Updates with meaning",
    copy: "Photos, timings and notes stay attached to the care record instead of getting lost in chat.",
    icon: Camera
  },
  {
    number: "03",
    title: "Exceptions stay visible",
    copy: "Changes, concerns and support actions follow a traceable path toward accountable closure.",
    icon: ClipboardCheck
  }
] as const;

export function CareConcierge() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [pet, setPet] = useState<PetChoice>("DOG");
  const [need, setNeed] = useState<CareNeed>("movement");

  const recommendation = useMemo(() => {
    if (need === "health") return recommendations.VET_SUPPORT;
    if (need === "grooming") return recommendations.GROOMING_HOME;
    if (need === "movement" && pet === "DOG") return recommendations.DOG_WALK_30;
    return recommendations.HOME_VISIT;
  }, [need, pet]);

  const reset = () => {
    setPet("DOG");
    setNeed("movement");
    setStep(1);
  };

  return (
    <>
      <section className="pb-24 sm:pb-32" aria-labelledby="care-concierge-title">
        <div className="container-shell">
          <div className="overflow-hidden rounded-[3.5rem] border border-indigo/10 bg-[#2f2032] text-paper shadow-soft">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-[31rem] overflow-hidden lg:min-h-[43rem]">
                <Image
                  src="/images/care-handover-courtyard.png"
                  alt="A PetSaathi caregiver and pet parent calmly reviewing care needs with their dog"
                  fill
                  priority={false}
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover object-[85%_35%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2f2032] via-[#2f2032]/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#2f2032]/20" />
                <div className="absolute inset-x-5 bottom-5 rounded-3xl border border-paper/20 bg-[#2f2032]/55 p-5 backdrop-blur-xl sm:inset-x-8 sm:bottom-8">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-saffron">Original PetSaathi editorial</p>
                  <p className="mt-2 font-display text-2xl font-semibold">A good match starts with the right question.</p>
                </div>
              </div>

              <div className="relative p-6 sm:p-10 lg:p-14">
                <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border-[3.5rem] border-saffron/10" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-4">
                    <p className="inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-saffron">
                      <Sparkles className="h-4 w-4" /> Care concierge
                    </p>
                    <span className="text-xs font-bold text-paper/45">Step {step} of 3</span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2" aria-hidden="true">
                    {[1, 2, 3].map((item) => (
                      <span key={item} className={cn("h-1 rounded-full transition", item <= step ? "bg-saffron" : "bg-paper/12")} />
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {step === 1 ? (
                      <motion.div
                        key="pet-step"
                        initial={reduceMotion ? false : { opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, x: -18 }}
                        transition={{ duration: reduceMotion ? 0 : 0.32 }}
                        className="mt-9"
                      >
                        <h2 id="care-concierge-title" className="font-display text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                          Who needs care?
                        </h2>
                        <p className="mt-4 max-w-xl text-sm leading-7 text-paper/58">
                          This guide suggests a starting service only. Eligibility, availability and price are still checked before confirmation.
                        </p>
                        <div className="mt-8 grid gap-3 sm:grid-cols-3">
                          {petChoices.map(({ value, label, icon: Icon }) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setPet(value)}
                              aria-pressed={pet === value}
                              className={cn(
                                "flex min-h-28 flex-col items-center justify-center gap-3 rounded-3xl border px-4 text-sm font-bold transition",
                                pet === value ? "border-saffron bg-saffron text-ink" : "border-paper/12 bg-paper/[0.06] text-paper hover:border-paper/30"
                              )}
                            >
                              <Icon className="h-6 w-6" />
                              {label}
                            </button>
                          ))}
                        </div>
                        <button type="button" onClick={() => setStep(2)} className={cn(buttonVariants({ variant: "accent", size: "lg" }), "mt-8")}>
                          Continue <ArrowRight className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ) : null}

                    {step === 2 ? (
                      <motion.div
                        key="need-step"
                        initial={reduceMotion ? false : { opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, x: -18 }}
                        transition={{ duration: reduceMotion ? 0 : 0.32 }}
                        className="mt-9"
                      >
                        <h2 className="font-display text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">What does the day need?</h2>
                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                          {careNeeds.map(({ value, label, detail, icon: Icon }) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setNeed(value)}
                              aria-pressed={need === value}
                              className={cn(
                                "flex min-h-32 gap-4 rounded-3xl border p-5 text-left transition",
                                need === value ? "border-saffron bg-saffron text-ink" : "border-paper/12 bg-paper/[0.06] text-paper hover:border-paper/30"
                              )}
                            >
                              <Icon className="mt-0.5 h-6 w-6 shrink-0" />
                              <span>
                                <span className="block text-sm font-bold">{label}</span>
                                <span className={cn("mt-2 block text-xs leading-5", need === value ? "text-ink/58" : "text-paper/50")}>{detail}</span>
                              </span>
                            </button>
                          ))}
                        </div>
                        <div className="mt-8 flex flex-wrap gap-3">
                          <button type="button" onClick={() => setStep(1)} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-paper/15 px-5 text-sm font-bold text-paper hover:bg-paper/10">
                            <ChevronLeft className="h-4 w-4" /> Back
                          </button>
                          <button type="button" onClick={() => setStep(3)} className={buttonVariants({ variant: "accent", size: "lg" })}>
                            See suggestion <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    ) : null}

                    {step === 3 ? (
                      <motion.div
                        key="result-step"
                        initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: reduceMotion ? 0 : 0.38 }}
                        className="mt-9"
                        aria-live="polite"
                      >
                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf/15 text-leaf">
                          <CheckCircle2 className="h-7 w-7" />
                        </span>
                        <p className="mt-7 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-saffron">Suggested starting point</p>
                        <h2 className="mt-3 max-w-[12ch] font-display text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">{recommendation.title}</h2>
                        <p className="mt-5 max-w-xl text-sm leading-7 text-paper/58">{recommendation.summary}</p>

                        {need === "health" ? (
                          <div className="mt-6 flex gap-3 rounded-3xl border border-coral/30 bg-coral/10 p-4 text-sm leading-6 text-paper/75">
                            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
                            PetSaathi is not an emergency service. For breathing difficulty, collapse, severe bleeding or another urgent concern, contact the nearest veterinary clinic immediately.
                          </div>
                        ) : null}

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                          <Link
                            href={`/book?service=${recommendation.code}&petType=${pet}` as Route}
                            className={buttonVariants({ variant: "accent", size: "lg" })}
                          >
                            Continue with this care <ArrowRight className="h-4 w-4" />
                          </Link>
                          <button type="button" onClick={reset} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-paper/15 px-6 text-sm font-bold text-paper hover:bg-paper/10">
                            <RotateCcw className="h-4 w-4" /> Start again
                          </button>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 sm:pb-32" aria-labelledby="care-details-title">
        <div className="container-shell">
          <div className="grid items-center gap-10 lg:grid-cols-[1.06fr_0.94fr]">
            <ScrollReveal direction="left">
              <div className="relative min-h-[34rem] overflow-hidden rounded-[3.5rem] border border-indigo/10 shadow-soft sm:min-h-[42rem]">
                <Image
                  src="/images/care-observation-editorial-v2.webp"
                  alt="A PetSaathi caregiver recording care details beside a relaxed cat and dog"
                  fill
                  sizes="(min-width: 1024px) 54vw, 100vw"
                  className="object-cover object-[center_78%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-4 rounded-3xl border border-paper/30 bg-paper/85 p-5 text-ink backdrop-blur-xl sm:bottom-8 sm:left-8 sm:right-8">
                  <div>
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-indigo/55">Care record</p>
                    <p className="mt-1 font-display text-2xl font-semibold">Small details make reassurance useful.</p>
                  </div>
                  <Clock3 className="hidden h-6 w-6 shrink-0 text-coral sm:block" />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div>
                <p className="eyebrow">Designed around the handover</p>
                <h2 id="care-details-title" className="section-title mt-5">Care should feel considered before, during and after.</h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-ink/54">
                  Premium care is not decoration. It is clear context, limited access, meaningful updates and an accountable response when the plan changes.
                </p>

                <div className="mt-8 grid gap-3">
                  {careDetailCards.map(({ number, title, copy, icon: Icon }, index) => (
                    <motion.article
                      key={number}
                      initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : index * 0.08 }}
                      className="group flex gap-4 rounded-3xl border border-indigo/10 bg-paper/80 p-5 shadow-sm transition hover:border-indigo/25 hover:shadow-lifted"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo/[0.07] text-indigo transition group-hover:bg-indigo group-hover:text-paper">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-coral">{number}</p>
                        <h3 className="mt-1 font-display text-2xl font-semibold">{title}</h3>
                        <p className="mt-2 text-sm leading-6 text-ink/48">{copy}</p>
                      </div>
                    </motion.article>
                  ))}
                </div>

                <Link href="/safety" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-8")}>
                  Review the safety model <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
