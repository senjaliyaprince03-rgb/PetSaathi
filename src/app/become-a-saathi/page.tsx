import type { Metadata } from "next";

import { SitterApplication } from "@/components/forms/sitter-application";
import { PageIntro, PublicShell } from "@/components/marketing/public-shell";
import { getCurrentIdentity } from "@/modules/auth/session";

export const metadata: Metadata = { title: "Become a Saathi" };

export default async function BecomeASaathiPage() {
  const identity = await getCurrentIdentity();
  const steps = [["01", "Tell your story", "Experience, locality and the kind of care you can responsibly offer."], ["02", "Complete checks", "Identity, training and practical assessment are reviewed independently."], ["03", "Earn permissions", "Approval is specific to a service and risk level—not a universal badge."], ["04", "Begin carefully", "Eligible offers arrive with only the context needed at each stage."]];
  return <PublicShell><PageIntro eyebrow="Saathi onboarding" title="Earn trust one service at a time." description="A considered path for people who treat pet care as a responsibility, not a gig." /><div className="container-shell"><section className="mb-6 grid gap-3 rounded-5xl border border-indigo/10 bg-gradient-to-br from-[#f3eafa] via-paper to-[#fff0e8] p-5 shadow-soft md:grid-cols-2 xl:grid-cols-4">{steps.map(([number, title, copy]) => <article key={number} className="rounded-3xl bg-paper/80 p-5"><p className="font-display text-3xl font-semibold text-coral">{number}</p><h2 className="mt-4 font-display text-2xl font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-ink/50">{copy}</p></article>)}</section><SitterApplication authenticated={Boolean(identity)} /></div></PublicShell>;
}
