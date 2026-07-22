import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

import { PageIntro, PublicShell } from "@/components/marketing/public-shell";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { publicEnv } from "@/lib/env";

type Props = { params: Promise<{ slug: string; service: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, service } = await params;
  if (!isDatabaseConfigured()) return { title: "Service not found", robots: { index: false } };

  const city = await prisma.city.findUnique({ where: { slug }, select: { name: true, state: true } });
  if (!city) return { title: "Service not found", robots: { index: false } };

  const serviceCode = service.toUpperCase().replaceAll("-", "_");
  const serviceType = await prisma.serviceType.findUnique({ where: { code: serviceCode as never }, select: { name: true, description: true } });
  const serviceName = serviceType?.name ?? service.replaceAll("-", " ");

  return {
    title: `${serviceName} in ${city.name} — PetSaathi`,
    description: `Book trusted ${serviceName.toLowerCase()} in ${city.name}, ${city.state}. Verified caregivers, real-time updates, and structured report cards.`,
    openGraph: {
      title: `${serviceName} in ${city.name} — PetSaathi`,
      description: `Verified ${serviceName.toLowerCase()} services in ${city.name} with human support.`,
    },
    alternates: {
      canonical: `${publicEnv.NEXT_PUBLIC_APP_URL}/cities/${slug}/${service}`,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function CityServicePage({ params }: Props) {
  const { slug, service } = await params;
  if (!isDatabaseConfigured()) notFound();

  const city = await prisma.city.findUnique({ where: { slug }, select: { id: true, name: true, state: true, slug: true } });
  if (!city) notFound();

  const serviceCode = service.toUpperCase().replaceAll("-", "_");
  const serviceType = await prisma.serviceType.findFirst({ where: { code: serviceCode as never } });
  if (!serviceType) notFound();

  // Fetch testimonials for this city (approved ones)
  const testimonials = await prisma.testimonial.findMany({
    where: { status: "APPROVED", city: city.name },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <PublicShell>
      <PageIntro
        eyebrow={`${city.name} · ${city.state}`}
        title={`${serviceType.name} in ${city.name}.`}
        description={serviceType.description}
      />

      {/* Service Details */}
      <section className="container-shell">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
          <article className="rounded-5xl bg-ink p-8 text-paper sm:p-10">
            <h2 className="font-display text-4xl font-semibold">How it works</h2>
            <ul className="mt-7 space-y-3 text-paper/70">
              {[
                "Submit a care request with your pet's details",
                "We match you with a verified local caregiver",
                "Receive structured updates during every session",
                "Get a detailed report card after completion",
                "Access human support at every step",
              ].map((item) => (
                <li key={item} className="border-b border-paper/10 pb-3">{item}</li>
              ))}
            </ul>
          </article>

          <article className="glass-panel rounded-5xl p-8 sm:p-10">
            <h2 className="font-display text-4xl font-semibold">Why PetSaathi</h2>
            <ul className="mt-5 space-y-4">
              {[
                { label: "Verified caregivers", desc: "Background checks, training and practical assessment" },
                { label: "Real-time visibility", desc: "Live route tracking and structured session updates" },
                { label: "Human support", desc: "Operations team available for every booking" },
                { label: "Report cards", desc: "Detailed post-session reports with observations" },
              ].map((item) => (
                <li key={item.label}>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-sm leading-6 text-ink/60">{item.desc}</p>
                </li>
              ))}
            </ul>
            <Link
              href="/book"
              className="mt-8 inline-flex rounded-full bg-saffron px-6 py-4 text-sm font-bold"
            >
              Check availability in {city.name}
            </Link>
          </article>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="container-shell mt-20">
          <h2 className="font-display text-4xl font-semibold">What pet parents say</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <article key={t.id} className="rounded-5xl border border-ink/10 bg-paper p-7 shadow-lifted">
                <ShieldCheck className="h-5 w-5 text-leaf" />
                <blockquote className="mt-4 text-sm italic leading-6 text-ink/60">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <p className="mt-4 text-sm font-semibold">{t.displayName}</p>
                {t.city && <p className="text-xs text-ink/40">{t.city}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-shell mt-20 mb-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl font-semibold">
            Ready for better {serviceType.name.toLowerCase()}?
          </h2>
          <p className="mt-4 text-lg leading-8 text-ink/60">
            Start with a trial session. Meet the caregiver, see the process, then decide.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full bg-saffron px-6 py-4 text-sm font-bold"
            >
              Book a trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              href={`/cities/${city.slug}` as any}
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-4 text-sm font-bold"
            >
              Explore all services in {city.name}
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
