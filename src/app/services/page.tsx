import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { PageIntro, PublicShell } from "@/components/marketing/public-shell";
import { services } from "@/modules/catalog/services";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return <PublicShell><PageIntro eyebrow="care that fits the day" title="Start with what we can operate well." description="Walking and home care are active. Boarding stays controlled while adjacent services unlock only after quality and local capacity are proven." /><section className="container-shell grid gap-5 lg:grid-cols-3">{services.map(({ slug, name, kicker, description, icon: Icon }) => <article key={slug} className="glass-panel rounded-5xl p-8"><Icon className="h-7 w-7 text-coral" /><p className="mt-12 text-xs font-bold uppercase tracking-[0.2em] text-ink/45">{kicker}</p><h2 className="mt-3 font-display text-4xl font-semibold">{name}</h2><p className="mt-5 leading-7 text-ink/60">{description}</p><Link href={`/services/${slug}`} className="mt-9 inline-flex items-center gap-2 text-sm font-bold">See service details <ArrowRight className="h-4 w-4" /></Link></article>)}</section></PublicShell>;
}
