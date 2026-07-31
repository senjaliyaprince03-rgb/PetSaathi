import type { Metadata } from "next";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { MapPin, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

import { PageIntro, PublicShell } from "@/components/marketing/public-shell";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { publicEnv } from "@/lib/env";
import { LocalBusinessJsonLd } from "@/components/seo/json-ld";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isDatabaseConfigured()) return { title: "City not found", robots: { index: false } };
  const city = await prisma.city.findUnique({ where: { slug }, select: { name: true, state: true } });
  if (!city) return { title: "City not found", robots: { index: false } };
  return {
    title: `Pet Care in ${city.name} — Dog Walking, Pet Sitting & More`,
    description: `Find trusted, verified pet care services in ${city.name}, ${city.state}. PetSaathi offers managed dog walking, home pet sitting, and boarding with structured updates.`,
    openGraph: {
      title: `PetSaathi ${city.name} — Trusted Local Pet Care`,
      description: `Verified caregivers in ${city.name} for dog walking, pet sitting and boarding.`,
    },
    alternates: {
      canonical: `${publicEnv.NEXT_PUBLIC_APP_URL}/cities/${slug}`,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function CityHubPage({ params }: Props) {
  const { slug } = await params;
  if (!isDatabaseConfigured()) notFound();

  const city = await prisma.city.findUnique({
    where: { slug },
    include: {
      cityServiceConfigs: {
        where: { status: { in: ["ACTIVE", "ACTIVE_LIMITED", "MANUAL_BETA"] } },
        include: { serviceType: true },
      },
      serviceZones: {
        where: { status: { in: ["ACTIVE", "ACTIVE_LIMITED", "BETA"] } },
        take: 12,
      },
      cityPages: {
        where: { status: "PUBLISHED" },
        include: { contentEntry: { select: { title: true, excerpt: true, slug: true } } },
      },
    },
  });

  if (!city) notFound();

  const activeServices = city.cityServiceConfigs;
  const activeZones = city.serviceZones;
  const publishedGuides = city.cityPages;

  return (
    <PublicShell>
      <LocalBusinessJsonLd
        name={`PetSaathi ${city.name}`}
        city={city.name}
        state={city.state}
        description={`Trusted pet care services in ${city.name}`}
      />

      <PageIntro
        eyebrow={`${city.state} · ${city.status.replaceAll("_", " ").toLowerCase()}`}
        title={`Pet care in ${city.name}.`}
        description={`Verified caregivers, structured updates and human support for pet parents in ${city.name}.`}
      />

      {/* Active Services */}
      <section className="container-shell">
        <h2 className="font-display text-4xl font-semibold">Available services</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {activeServices.length > 0 ? (
            activeServices.map((config) => (
              <Link
                key={config.id}
                href={`/cities/${slug}/${config.serviceType.code.toLowerCase().replaceAll("_", "-")}` as Route<string>}
                className="group rounded-5xl border border-ink/10 bg-paper p-7 shadow-lifted transition hover:-translate-y-1"
              >
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-coral">
                  {config.status.replaceAll("_", " ")}
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold group-hover:text-indigo">
                  {config.serviceType.name}
                </h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/60">
                  {config.serviceType.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-indigo">
                  Learn more <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))
          ) : (
            <div className="rounded-5xl border border-dashed border-ink/15 bg-paper p-10 text-center md:col-span-2 lg:col-span-3">
              <MapPin className="mx-auto h-10 w-10 text-saffron" />
              <h3 className="mt-4 font-display text-2xl font-semibold">Services launching soon.</h3>
              <p className="mt-2 text-ink/60">We are building caregiver capacity in {city.name}.</p>
            </div>
          )}
        </div>
      </section>

      {/* Service Zones */}
      {activeZones.length > 0 && (
        <section className="container-shell mt-20">
          <h2 className="font-display text-4xl font-semibold">Service areas</h2>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-ink/60">
            We currently serve the following areas in {city.name}.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {activeZones.map((zone) => (
              <span
                key={zone.id}
                className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper px-4 py-2 text-sm font-medium shadow-sm"
              >
                <MapPin className="h-3.5 w-3.5 text-leaf" />
                {zone.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Local Guides */}
      {publishedGuides.length > 0 && (
        <section className="container-shell mt-20">
          <h2 className="font-display text-4xl font-semibold">Local guides</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {publishedGuides.map((page) => (
              <Link
                key={page.id}
                href={`/journal/${page.contentEntry.slug}`}
                className="group rounded-5xl border border-ink/10 bg-paper p-7 shadow-lifted transition hover:-translate-y-1"
              >
                <h3 className="font-display text-2xl font-semibold group-hover:text-indigo">
                  {page.contentEntry.title}
                </h3>
                {page.contentEntry.excerpt && (
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/60">
                    {page.contentEntry.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Community CTA */}
      <section className="container-shell mt-20 mb-20">
        <div className="rounded-5xl bg-ink p-10 text-paper sm:p-14">
          <Users className="h-8 w-8 text-saffron" />
          <h2 className="mt-10 font-display text-4xl font-semibold">
            Join the {city.name} pet parent community.
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-paper/70">
            Connect with local pet parents, get care tips specific to {city.name}, and receive availability updates.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-full bg-saffron px-6 py-4 text-sm font-bold text-ink"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
