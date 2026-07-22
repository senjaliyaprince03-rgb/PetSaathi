import type { Metadata } from "next";

import { PageIntro, PublicShell } from "@/components/marketing/public-shell";

export const metadata: Metadata = { title: "Privacy notice", robots: { index: false, follow: false } };

export default function PrivacyPage() {
  return <PublicShell><PageIntro eyebrow="legal review required" title="Privacy notice placeholder" description="The production privacy notice must be approved with the final legal entity, vendors, retention periods, data-contact details and India DPDP compliance process. The product architecture already separates essential processing, marketing, public media and testimonial consent." /><section className="container-shell"><div className="mx-auto max-w-3xl rounded-5xl border border-coral/25 bg-coral/10 p-8 leading-7 text-ink/68">This page is intentionally not presented as final legal advice or production policy. It remains excluded from search indexing until owner-approved copy is supplied.</div></section></PublicShell>;
}
