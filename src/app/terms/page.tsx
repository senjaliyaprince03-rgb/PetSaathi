import type { Metadata } from "next";

import { PageIntro, PublicShell } from "@/components/marketing/public-shell";

export const metadata: Metadata = { title: "Terms", robots: { index: false, follow: false } };

export default function TermsPage() {
  return <PublicShell><PageIntro eyebrow="legal review required" title="Service terms placeholder" description="Production terms require the final entity, prices, tax treatment, cancellations, refunds, caregiver relationship, boarding scope, emergency boundaries and dispute process." /><section className="container-shell"><div className="mx-auto max-w-3xl rounded-5xl border border-coral/25 bg-coral/10 p-8 leading-7 text-ink/68">This route exists so legal review has a stable product surface. It is intentionally excluded from search indexing and cannot be accepted as final terms.</div></section></PublicShell>;
}
