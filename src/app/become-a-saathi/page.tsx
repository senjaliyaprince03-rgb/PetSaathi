import type { Metadata } from "next";
import { BadgeCheck, CalendarDays, Clock3, MapPin, ShieldCheck, Users } from "lucide-react";

import { SitterApplication } from "@/components/forms/sitter-application";
import { PageIntro, PublicShell } from "@/components/marketing/public-shell";

export const metadata: Metadata = { 
  title: "Become a Certified Saathi Caregiver",
  description: "Join India's leading managed pet care network. Earn competitive pay with reliable weekly payouts, emergency vet assistance coordination, and local society assignments.",
  openGraph: {
    title: "Become a Certified Saathi Caregiver | PetSaathi",
    description: "Join India's leading managed pet care network. Earn competitive pay with reliable weekly payouts, emergency vet assistance coordination, and local society assignments.",
    url: "https://petsaathi.in/become-a-saathi",
    siteName: "PetSaathi",
    images: [{ url: "/images/hero-care-handover-highres.webp", width: 1200, height: 630, alt: "Become a Certified Saathi" }],
    locale: "en_IN",
    type: "website",
  },
  robots: { index: true, follow: true }
};

export default function BecomeASaathiPage() {
  const steps = [
    ["01", "Tell your story", "Experience, locality and the kind of care you can responsibly offer."],
    ["02", "Complete checks", "Identity, training and practical assessment are reviewed independently."],
    ["03", "Earn permissions", "Approval is specific to a service and risk level—not a universal badge."],
    ["04", "Begin carefully", "Eligible offers arrive with only the context needed at each stage."],
  ] as const;
  const reviewPoints = [
    {
      icon: Users,
      title: "Who can apply",
      copy: "People with real pet-care experience and a responsible work style.",
    },
    {
      icon: BadgeCheck,
      title: "What gets checked",
      copy: "Identity, experience, training, and practical readiness are reviewed separately.",
    },
    {
      icon: ShieldCheck,
      title: "Why it is controlled",
      copy: "Permissions are given carefully so each Saathi only sees suitable requests.",
    },
    {
      icon: Clock3,
      title: "What happens next",
      copy: "Approved applicants receive only the first safe assignments that match their profile.",
    },
  ] as const;

  return (
    <PublicShell>
      <PageIntro
        eyebrow="Saathi onboarding"
        title="Earn trust one service at a time."
        description="A considered path for people who treat pet care as a responsibility, not a gig."
      />

      <div className="container-shell">
        <section className="mb-8 grid gap-3 rounded-5xl border border-indigo/10 bg-gradient-to-br from-[#f3eafa] via-paper to-[#fff0e8] p-5 shadow-soft md:grid-cols-2 xl:grid-cols-4">
          {steps.map(([number, title, copy]) => (
            <article key={number} className="rounded-3xl bg-paper/80 p-5">
              <p className="font-display text-3xl font-semibold text-coral">{number}</p>
              <h2 className="mt-4 font-display text-2xl font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/80">{copy}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-5xl bg-[#281d2b] p-8 text-paper shadow-lifted">
            <span className="inline-flex items-center gap-2 rounded-full border border-saffron/40 bg-saffron/15 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-saffron">
              <BadgeCheck className="h-3.5 w-3.5" />
              What we look for
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              A Saathi is chosen carefully, not quickly.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-paper/80">
              The application is meant to collect only the details needed to judge
              whether someone is ready for real pet care work.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {reviewPoints.map(({ icon: Icon, title, copy }) => (
                <div key={title} className="rounded-3xl border border-paper/10 bg-paper/[0.05] p-5">
                  <Icon className="h-6 w-6 text-saffron" />
                  <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-paper/80">{copy}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-5xl border border-indigo/10 bg-paper p-8 shadow-lifted">
            <span className="inline-flex items-center gap-2 rounded-full border border-coral/20 bg-coral/10 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-coral-text">
              <CalendarDays className="h-3.5 w-3.5" />
              Prerequisites & Standards
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.04em]">
              What you need before applying.
            </h2>
            <div className="mt-7 grid gap-4">
              {[
                ["Aadhaar / Photo ID", "Valid government ID with permanent and local address verification."],
                ["Handling Experience", "Demonstrated hands-on experience handling dogs, cats, or both breeds."],
                ["Character References", "Two verifiable professional or personal references vetted by ops."],
                ["Conduct Pledge", "Adherence to zero phone distractions, punctuality, and live session updates."]
              ].map(([title, copy], idx) => (
                <div key={title} className="flex gap-4 rounded-3xl border border-ink/10 bg-cream/40 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo/10 font-display text-sm font-bold text-indigo">
                    0{idx + 1}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{title}</h3>
                    <p className="mt-1 text-xs leading-5 text-ink/80">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <div className="mt-8">
          <SitterApplication />
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Real responsibility",
              copy: "Only people who can handle pet care carefully should move ahead.",
            },
            {
              title: "Safer matching",
              copy: "The system keeps permissions narrow so the right jobs reach the right person.",
            },
            {
              title: "Clear next step",
              copy: "After submission, the process stays simple and easy to review.",
            },
          ].map((card) => (
            <article key={card.title} className="rounded-4xl border border-indigo/10 bg-paper p-6 shadow-soft">
              <h3 className="font-display text-2xl font-semibold">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-ink/80">{card.copy}</p>
            </article>
          ))}
        </section>
      </div>
    </PublicShell>
  );
}
