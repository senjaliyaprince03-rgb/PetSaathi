import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ChartNoAxesCombined,
  FileCheck2,
  ShieldCheck,
  WalletCards,
  Workflow,
} from "lucide-react";

import { PublicShell } from "@/components/marketing/public-shell";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Employee Pet-Care Programmes | PetSaathi",
  description:
    "Explore controlled employee pet-care programmes with verified eligibility, auditable service credits, and operations-led activation.",
};

const programmeControls = [
  {
    icon: BadgeCheck,
    title: "Eligibility is explicit",
    body: "Employee access is tied to an active programme and a controlled verification method. Enrollment alone never grants benefits.",
  },
  {
    icon: WalletCards,
    title: "Credits remain traceable",
    body: "Approved programme credits move through a dedicated ledger, preserving the reason, amount, and related service context.",
  },
  {
    icon: ShieldCheck,
    title: "Care gates still apply",
    body: "A benefit never bypasses city availability, service permissions, capacity, pricing, pet risk, or human review.",
  },
] as const;

const activationSteps = [
  {
    number: "01",
    title: "Define the programme",
    body: "PetSaathi and the organisation agree scope, dates, city coverage, eligibility, service rules, and commercial terms.",
  },
  {
    number: "02",
    title: "Activate controlled access",
    body: "Authorised managers activate the programme only after its organisation and contract controls are current.",
  },
  {
    number: "03",
    title: "Verify each member",
    body: "Eligible employees authenticate and complete the configured verification path before a wallet can be used.",
  },
  {
    number: "04",
    title: "Review real outcomes",
    body: "Operations can review programme enrollment, service usage, credits, complaints, and capacity using auditable records.",
  },
] as const;

export default function CorporateBenefitsPage() {
  return (
    <PublicShell>
      <section className="relative overflow-hidden border-b border-indigo/10 bg-cream pb-24 pt-32 sm:pt-40">
        <div className="pointer-events-none absolute -right-28 top-8 h-96 w-96 rounded-full bg-saffron/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-indigo/10 blur-3xl" />

        <div className="container-shell relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-leaf/20 bg-leaf/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-leaf">
              <Building2 className="h-4 w-4" />
              Employer and association programmes
            </span>
            <h1 className="mt-7 max-w-[12ch] font-display text-5xl font-semibold tracking-[-0.055em] text-ink sm:text-7xl">
              Pet-care benefits with accountable controls.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-ink/65">
              Create a structured route for eligible members to request local
              pet care. Every programme stays bounded by its contract,
              verification method, city scope, active dates, and available
              provider capacity.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className={buttonVariants({
                  variant: "accent",
                  size: "lg",
                })}
              >
                Discuss a programme <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/safety"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                })}
              >
                Review safety controls
              </Link>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-paper/80 bg-paper/90 p-6 shadow-lifted backdrop-blur sm:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-ink/10 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral">
                  Programme control plane
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold">
                  Designed to fail closed.
                </h2>
              </div>
              <Workflow className="h-9 w-9 text-indigo" />
            </div>
            <div className="mt-6 grid gap-3">
              {[
                ["Contract", "Current and organisation-bound"],
                ["Membership", "Authenticated and verified"],
                ["Service access", "Permission and capacity checked"],
                ["Benefits", "Ledger-backed and auditable"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-cream/60 px-4 py-3"
                >
                  <span className="text-sm font-semibold text-ink/55">
                    {label}
                  </span>
                  <span className="text-right text-sm font-bold text-ink">
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-ink/45">
              Programme activation is contractual and operational. This page
              does not create eligibility, pricing, or a service guarantee.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="container-shell">
          <div className="max-w-3xl">
            <p className="eyebrow">What the platform enforces</p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Benefits never sit outside the care workflow.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {programmeControls.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="rounded-[2rem] border border-indigo/10 bg-cream/45 p-7"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo/10 text-indigo">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-ink/60">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-indigo py-24 text-paper">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <FileCheck2 className="h-10 w-10 text-saffron" />
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-saffron">
              Controlled activation
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Four stages from agreement to evidence.
            </h2>
            <p className="mt-5 text-sm leading-7 text-paper/65">
              The recommended implementation keeps commercial approval,
              member eligibility, service operations, and reporting as
              separate auditable decisions.
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {activationSteps.map((step) => (
              <li
                key={step.number}
                className="rounded-[2rem] border border-paper/10 bg-paper/[0.06] p-6"
              >
                <span className="text-xs font-bold tracking-[0.18em] text-saffron">
                  {step.number}
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-paper/65">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream py-24">
        <div className="container-shell">
          <div className="rounded-[2.75rem] border border-indigo/10 bg-paper p-8 shadow-lifted sm:p-12">
            <ChartNoAxesCombined className="h-10 w-10 text-coral" />
            <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="eyebrow">Start with operational fit</p>
                <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                  Explore a programme without making premature promises.
                </h2>
                <p className="mt-5 text-sm leading-7 text-ink/60">
                  Share the organisation, intended member group, cities, and
                  desired care context. PetSaathi will record the enquiry for
                  a human review; no programme or booking is created from an
                  enquiry alone.
                </p>
              </div>
              <Link
                href="/contact"
                className={buttonVariants({
                  variant: "accent",
                  size: "lg",
                  className: "shrink-0",
                })}
              >
                Contact the partner team <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
