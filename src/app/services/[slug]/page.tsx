import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageIntro, PublicShell } from "@/components/marketing/public-shell";
import { services } from "@/modules/catalog/services";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return services.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  return { title: service?.name ?? "Service" };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  const Icon = service.icon;
  return <PublicShell><PageIntro eyebrow={service.kicker} title={service.name} description={service.description} /><section className="container-shell"><div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2"><article className="rounded-5xl bg-ink p-8 text-paper sm:p-10"><Icon className="h-8 w-8 text-saffron" /><h2 className="mt-14 font-display text-4xl font-semibold">What the service records</h2><ul className="mt-7 space-y-3 text-paper/70">{["Authorised start and finish milestones","Relevant care observations and concerns","Structured report card after completion","A clear path to human support when needed"].map((item) => <li key={item} className="border-b border-paper/10 pb-3">{item}</li>)}</ul></article><article className="glass-panel rounded-5xl p-8 sm:p-10"><h2 className="font-display text-4xl font-semibold">Before a booking</h2><p className="mt-5 leading-7 text-ink/60">Pet details, risk factors, caregiver permissions, schedule and local capacity are checked before a match is confirmed. Exact availability and price are shown in the booking context.</p><a href="/book" className="mt-8 inline-flex rounded-full bg-saffron px-6 py-4 text-sm font-bold">Start a care request</a></article></div></section></PublicShell>;
}
