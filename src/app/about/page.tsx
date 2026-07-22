import type { Metadata } from "next";

import { PageIntro, PublicShell } from "@/components/marketing/public-shell";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return <PublicShell><PageIntro eyebrow="why PetSaathi" title="Built for the handoff, not just the search." description="Finding a name is easy. Feeling confident about the match, the service and what happens when plans change is harder. PetSaathi is designed around that complete operating thread." /><section className="container-shell"><div className="mx-auto max-w-5xl rounded-5xl bg-saffron p-8 sm:p-14"><p className="font-display text-3xl font-semibold leading-tight sm:text-5xl">A trusted local marketplace should make care easier to understand before, during and after each service.</p><div className="mt-10 grid gap-5 sm:grid-cols-3">{[["Local","Start with one service area and real capacity."],["Managed","People review matches and sensitive exceptions."],["Traceable","Important events become structured records."]].map(([title,copy]) => <div key={title} className="rounded-3xl bg-paper/55 p-5"><h2 className="font-display text-2xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-6 text-ink/62">{copy}</p></div>)}</div></div></section></PublicShell>;
}
