import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileCheck,
  MapPin,
  ShieldCheck
} from "lucide-react";

import { ScrollReveal, Float3D, Scale3D } from "@/components/3d/scroll-reveal";
import { AnimosCard, ScrollStaggerContainer, ScrollStaggerItem } from "@/components/effects/animos-motion";
import ScrollTextReveal from "@/components/originkit/ui/scroll-text-reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const proposalPreviews = [
  {
    image: "/images/proposal_home_care_v2.jpg",
    service: "Home care",
    locality: "Local care radius",
    availability: "Availability checked",
    summary: "A calm routine-led proposal for feeding, play, medication notes and a careful home handover.",
    evidence: ["Identity reviewed", "Home-care permission", "Pet context checked"]
  },
  {
    image: "/images/proposal_walks_v2.jpg",
    service: "Neighbourhood walks",
    locality: "Route-aware matching",
    availability: "Schedule aligned",
    summary: "A walk proposal shaped around duration, weather, pet temperament and the approved service window.",
    evidence: ["Walk permission", "Milestone reports", "Exception support"]
  },
  {
    image: "/images/sitter-man-cinematic.png",
    service: "Day companionship",
    locality: "Capacity confirmed",
    availability: "Pet fit reviewed",
    summary: "A considered care option when the pet needs company, enrichment and a traceable collection plan.",
    evidence: ["Capacity check", "Care instructions", "Private handover"]
  }
] as const;

const reportEvents = [
  { time: "09:02", label: "Care started", detail: "Saathi checked in within the approved service window.", icon: MapPin },
  { time: "09:16", label: "Routine complete", detail: "Food, water and care instructions were recorded.", icon: ClipboardCheck },
  { time: "09:38", label: "Photo update", detail: "A private update was attached to the booking timeline.", icon: Camera },
  { time: "10:00", label: "Handover ready", detail: "Service summary and exceptions were prepared for review.", icon: FileCheck }
] as const;

export function MarketplaceAssurance() {
  return (
    <>
      <section className="py-24 sm:py-32" aria-labelledby="proposal-preview-title">
        <div className="container-shell">
          <ScrollReveal direction="up">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="eyebrow">The useful parts of discovery</p>
                <ScrollTextReveal 
                  text="Compare care evidence, not an endless directory." 
                  tag="h2" 
                  className="section-title mt-5 max-w-[13ch]" 
                  color="inherit" 
                  font={{ fontSize: "inherit", fontWeight: "inherit", lineHeight: "inherit" }} 
                />
              </div>
              <div className="max-w-xl">
                <p className="text-sm leading-7 text-ink/52">
                  PetSaathi adapts marketplace comparison into a quieter assisted flow. Profiles appear as relevant proposals after locality,
                  schedule, service permission and pet context are checked.
                </p>
                <Link href={"/caregivers" as Route} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo hover:text-coral">
                  See how Saathi proposals work <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>

          <ScrollStaggerContainer className="mt-12 grid gap-5 lg:grid-cols-3">
            {proposalPreviews.map((proposal, index) => (
              <ScrollStaggerItem key={proposal.service}>
                <AnimosCard className="h-full" glare={false}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-5xl border border-indigo/10 bg-paper">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={proposal.image}
                        alt={`${proposal.service} PetSaathi proposal setting`}
                        fill
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        className="object-cover object-[center_20%] transition duration-700 group-hover:scale-[1.035]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-ink/5" />
                      <Float3D className="absolute left-4 top-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-paper/35 bg-paper/90 px-3 py-2 text-[0.62rem] font-bold text-leaf backdrop-blur-xl">
                          <BadgeCheck className="h-3.5 w-3.5" /> Example proposal
                        </span>
                      </Float3D>
                      <Float3D className="absolute bottom-4 left-4">
                        <span className="rounded-full border border-paper/20 bg-ink/42 px-3 py-2 text-[0.62rem] font-bold text-paper backdrop-blur-xl">
                          0{index + 1} · {proposal.availability}
                        </span>
                      </Float3D>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.17em] text-coral">
                            <MapPin className="h-3.5 w-3.5" /> {proposal.locality}
                          </p>
                          <h3 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em]">{proposal.service}</h3>
                        </div>
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo/[0.07] text-indigo">
                          <ShieldCheck className="h-5 w-5" />
                        </span>
                      </div>

                      <p className="mt-4 text-sm leading-7 text-ink/50">{proposal.summary}</p>
                      <div className="mt-auto grid gap-2 pt-6">
                        {proposal.evidence.map((item) => (
                          <span key={item} className="flex items-center gap-2 rounded-2xl bg-cream/75 px-3 py-2.5 text-xs font-semibold text-ink/55">
                            <CheckCircle2 className="h-3.5 w-3.5 text-leaf" /> {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </AnimosCard>
              </ScrollStaggerItem>
            ))}
          </ScrollStaggerContainer>

          <p className="mt-5 text-center text-xs text-ink/40">
            Illustrative proposal previews only. Real availability, identity details and prices are shown at the appropriate approval stage.
          </p>
        </div>
      </section>

      <section className="pb-24 sm:pb-32" aria-labelledby="care-report-title">
        <div className="container-shell">
          <div className="relative overflow-hidden rounded-[3.5rem] border border-indigo/10 bg-[#2f2032] p-6 text-paper shadow-soft sm:p-10 lg:p-14">
            <div className="pointer-events-none absolute -right-28 -top-36 h-[28rem] w-[28rem] rounded-full border-[4.5rem] border-saffron/10" />
            <div className="pointer-events-none absolute inset-0 luxury-grid opacity-[0.08]" />

            <div className="relative grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
              <ScrollReveal direction="left">
                <div>
                  <p className="eyebrow !text-saffron">A report card families can actually use</p>
                  <ScrollTextReveal 
                    text="Every important moment stays attached to the care." 
                    tag="h2" 
                    className="mt-5 max-w-[11ch] font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl" 
                    color="inherit" 
                    font={{ fontSize: "inherit", fontWeight: "inherit", lineHeight: "inherit" }} 
                  />
                  <p className="mt-6 max-w-xl text-sm leading-7 text-paper/56">
                    Photos, routine notes, timing and exceptions belong to one private booking record—so reassurance does not depend on scattered chat messages.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {["Timed milestones", "Private photo updates", "Care notes", "Exception trail"].map((item) => (
                      <span key={item} className="rounded-full border border-paper/10 bg-paper/[0.06] px-3 py-2 text-xs font-semibold text-paper/68">
                        {item}
                      </span>
                    ))}
                  </div>

                  <Link href="/safety" className={cn(buttonVariants({ variant: "outline" }), "mt-8 border-paper/20 bg-paper/[0.04] text-paper hover:bg-paper hover:text-ink")}>
                    Explore care accountability <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right">
                <Scale3D>
                  <div className="relative rounded-[2.35rem] border border-paper/[0.12] bg-paper/[0.07] p-4 backdrop-blur sm:p-5">
                    <div className="flex flex-col gap-4 rounded-[1.8rem] bg-paper p-5 text-ink shadow-lifted sm:p-6">
                      <div className="flex items-start justify-between gap-4 border-b border-indigo/10 pb-5">
                        <div>
                          <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-indigo/55">Sample care report · PS-2026</p>
                          <h3 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em]">Milo’s home visit</h3>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf/10 px-3 py-2 text-[0.62rem] font-bold text-leaf">
                          <BadgeCheck className="h-3.5 w-3.5" /> Complete
                        </span>
                      </div>

                      <div className="grid gap-3">
                        {reportEvents.map(({ time, label, detail, icon: Icon }, index) => (
                          <div key={label} className="relative grid grid-cols-[3.4rem_2.6rem_1fr] items-start gap-3">
                            {index < reportEvents.length - 1 ? <span className="absolute left-[5.4rem] top-9 h-[calc(100%+0.75rem)] w-px bg-indigo/[0.12]" aria-hidden="true" /> : null}
                            <time className="pt-2 text-[0.65rem] font-bold text-ink/38">{time}</time>
                            <div className="relative z-10 flex h-10 w-10 rounded-2xl bg-paper">
                              <span className="flex h-full w-full items-center justify-center rounded-2xl bg-indigo/[0.07] text-indigo">
                                <Icon className="h-4 w-4" />
                              </span>
                            </div>
                            <div className="rounded-2xl bg-cream/72 px-4 py-3">
                              <p className="text-sm font-bold">{label}</p>
                              <p className="mt-1 text-xs leading-5 text-ink/48">{detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-2 border-t border-indigo/10 pt-5 text-center">
                        {[["58 min", "Service"], ["4", "Updates"], ["0", "Exceptions"]].map(([value, label]) => (
                          <div key={label} className="rounded-2xl bg-indigo/[0.05] px-2 py-3">
                            <p className="font-display text-xl font-semibold">{value}</p>
                            <p className="mt-0.5 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-ink/38">{label}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 px-2 text-xs text-paper/48">
                      <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" /> Visible to authorised participants</span>
                      <span className="hidden items-center gap-1.5 sm:flex"><ShieldCheck className="h-3.5 w-3.5" /> Traceable record</span>
                    </div>
                  </div>
                </Scale3D>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
