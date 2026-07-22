import type { Metadata } from "next";
import { BadgeCheck, FileClock, ShieldAlert, UserRoundCheck } from "lucide-react";

import { PageIntro, PublicShell } from "@/components/marketing/public-shell";

export const metadata: Metadata = { title: "Safety" };

const safetyCards = [
  [UserRoundCheck, "Evidence-specific checks", "Identity, interview, training and service permissions are separate records with status and expiry—not one vague verified label."],
  [BadgeCheck, "Permission before assignment", "A caregiver can receive only the service and pet-risk level that current evidence permits."],
  [FileClock, "A visible service trail", "Important booking, payment and service milestones create server-side history that cannot be replaced by a chat message."],
  [ShieldAlert, "A formal exception path", "Concerns move through triage, communication, response, review and corrective action with authorised closure."]
] as const;

export default function SafetyPage() {
  return <PublicShell><PageIntro eyebrow="proof over promises" title="Trust is built in layers." description="No single badge can make pet care risk-free. PetSaathi combines current evidence, limited permissions, careful matching, service records and people who can respond." /><section className="container-shell grid gap-5 md:grid-cols-2">{safetyCards.map(([Icon,title,copy]) => <article key={title} className="glass-panel rounded-5xl p-8"><Icon className="h-7 w-7 text-coral" /><h2 className="mt-10 font-display text-3xl font-semibold">{title}</h2><p className="mt-4 leading-7 text-ink/60">{copy}</p></article>)}</section><section className="container-shell mt-8"><div className="rounded-5xl bg-ink p-8 text-paper sm:p-12"><p className="eyebrow !text-paper/50">important boundary</p><h2 className="mt-5 font-display text-4xl font-semibold">Emergency referral support is not veterinary care.</h2><p className="mt-5 max-w-3xl leading-7 text-paper/65">PetSaathi can preserve clinic contacts, support escalation and document communication. It does not diagnose, treat, guarantee clinic availability, guarantee transport or provide insurance.</p></div></section></PublicShell>;
}
