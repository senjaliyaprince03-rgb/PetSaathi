import { BookOpen, CheckCircle2, GraduationCap, PlayCircle, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

import { PortalShell } from "@/components/portal/portal-shell";
import { getCurrentIdentity } from "@/modules/auth/session";

export const metadata = {
  title: "Saathi Academy & Training Certification | PetSaathi",
  description: "Complete professional pet handling modules, Canine First Aid certifications, and unlock higher-tier assignments.",
};

const modules = [
  {
    id: "canine-body-language",
    title: "Canine Stress Signals & Calming Protocols",
    duration: "25 mins",
    level: "Core Certification",
    completed: true,
    score: "100%",
    description: "Master tail positions, whale eye detection, submissive vs fear postures, and proactive de-escalation techniques.",
  },
  {
    id: "feline-handling",
    title: "Feline Home Visits & Safe Low-Stress Care",
    duration: "20 mins",
    level: "Specialist",
    completed: true,
    score: "96%",
    description: "Litterbox observation, interactive wand play, hiding space respect, and non-intrusive meal provisioning.",
  },
  {
    id: "pet-first-aid",
    title: "Pet First Aid & Emergency Protocol",
    duration: "45 mins",
    level: "Advanced Vet Prep",
    completed: true,
    score: "98%",
    description: "Immediate action plans for heatstroke, paw lacerations, accidental ingestion, and direct veterinary escalation handoffs.",
  },
  {
    id: "gps-reporting",
    title: "GPS Walk Logging & Session Report Cards",
    duration: "15 mins",
    level: "Operational",
    completed: true,
    score: "100%",
    description: "Best practices for clear parent photos, pee/poop logging, mood notes, and route milestone accuracy.",
  },
];

export default async function SaathiAcademyPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) redirect("/login?returnTo=/saathi/academy");

  return (
    <PortalShell mode="saathi" displayName={identity.displayName}>
      <div className="max-w-6xl pb-16">
        {/* Header */}
        <section className="mt-4 rounded-[2rem] border border-black/[0.06] bg-gradient-to-r from-paper via-cream to-[#fbf2ea] p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-purple-600 animate-pulse" />
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-purple-600">Professional Development</p>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Saathi Academy &amp; Certifications
          </h1>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-ink/70 leading-relaxed">
            Enhance your pet care skills, complete accredited training modules, and earn certified badges that boost your booking frequency.
          </p>
        </section>

        {/* Progress Overview Card */}
        <div className="mt-8 rounded-[2rem] border border-black/[0.06] bg-[#221C2B] text-white p-6 sm:p-8 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 px-3 py-1 text-xs font-bold text-purple-300 uppercase tracking-widest">
                <Trophy className="h-3.5 w-3.5" /> Certification Progress
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold">Certified Professional Saathi (4/4 Completed)</h2>
              <p className="mt-1 text-xs text-white/70 max-w-xl leading-relaxed">
                All mandatory safety, health, and operational readiness modules are active and in good standing.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-display text-3xl font-bold text-saffron">100%</p>
                <p className="text-[0.65rem] text-white/60 uppercase tracking-wider font-bold">Curriculum Done</p>
              </div>
            </div>
          </div>
        </div>

        {/* Training Modules Grid */}
        <div className="mt-8 space-y-4">
          <h2 className="font-display text-xl font-bold text-ink">Training Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((mod) => (
              <article key={mod.id} className="rounded-[1.5rem] border border-black/[0.06] bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[0.68rem] font-bold uppercase tracking-wider text-indigo bg-indigo/10 px-2.5 py-0.5 rounded-full">
                      {mod.level}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-bold text-ink">{mod.title}</h3>
                    <p className="mt-1.5 text-xs text-ink/70 leading-relaxed">{mod.description}</p>
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-leaf shrink-0" />
                </div>
                <div className="mt-4 pt-4 border-t border-black/[0.06] flex items-center justify-between text-xs text-ink/60">
                  <span>⏱️ {mod.duration}</span>
                  <span className="font-bold text-leaf">Score: {mod.score} (Passed)</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
