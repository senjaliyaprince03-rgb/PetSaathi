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
  if (!isDatabaseConfigured()) notFound();
  const city = await prisma.city.findUnique({ where: { slug }, select: { name: true, state: true } });
  if (!city) notFound();
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

const PILOT_LOCALITIES: Record<string, Array<{ name: string; status: string; dot: string }>> = {
  ahmedabad: [
    { name: "Bopal", status: "Limited Availability", dot: "bg-leaf" },
    { name: "Ambli", status: "Waitlist", dot: "bg-saffron" },
    { name: "Prahlad Nagar", status: "Limited Availability", dot: "bg-leaf" },
    { name: "South Bopal", status: "Waitlist", dot: "bg-saffron" },
    { name: "Thaltej", status: "Early Access", dot: "bg-indigo" },
    { name: "Bodakdev", status: "Early Access", dot: "bg-indigo" },
  ],
  bangalore: [
    { name: "Indiranagar", status: "Limited Availability", dot: "bg-leaf" },
    { name: "HSR Layout", status: "Limited Availability", dot: "bg-leaf" },
    { name: "Koramangala", status: "Waitlist", dot: "bg-saffron" },
    { name: "Whitefield", status: "Early Access", dot: "bg-indigo" },
    { name: "Bellandur", status: "Early Access", dot: "bg-indigo" },
  ],
  pune: [
    { name: "Koregaon Park", status: "Limited Availability", dot: "bg-leaf" },
    { name: "Baner", status: "Limited Availability", dot: "bg-leaf" },
    { name: "Kalyani Nagar", status: "Waitlist", dot: "bg-saffron" },
    { name: "Viman Nagar", status: "Early Access", dot: "bg-indigo" },
  ],
};

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
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-coral-text">
                  {config.status.replaceAll("_", " ")}
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold group-hover:text-indigo">
                  {config.serviceType.name}
                </h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/80">
                  {config.serviceType.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-indigo">
                  Learn more <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))
          ) : (
            <div className="rounded-5xl border border-dashed border-ink/15 bg-paper p-10 text-center md:col-span-2 lg:col-span-3 shadow-lifted">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-saffron/15 text-saffron">
                <MapPin className="h-7 w-7" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold text-ink">Neighborhood Pilot in {city.name}</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink/80">
                We are onboarding and safety-vetting caregivers across {city.name}. Check your neighborhood availability to request early access, or apply to join our local caregiver roster.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={"/book" as Route}
                  className="inline-flex items-center gap-2 rounded-full bg-[#C84B31] px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#B33E26]"
                >
                  Check My Neighborhood Availability <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={"/apply/sitter" as Route}
                  className="inline-flex items-center gap-2 rounded-full border border-indigo/20 bg-paper px-6 py-2.5 text-sm font-bold text-indigo transition hover:border-indigo/40 hover:bg-indigo/5"
                >
                  Become a Saathi in {city.name} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Service Zones / Neighborhood Pilot Availability */}
      <section className="container-shell mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-4xl font-semibold">Neighborhood availability</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-ink/80">
              {city.name} operates on a neighborhood-first rollout to ensure high caregiver quality, zero rush, and strict safety compliance.
            </p>
          </div>
          <Link
            href={`/book` as Route}
            className="inline-flex items-center gap-2 rounded-full border border-indigo/20 bg-paper px-5 py-2 text-xs font-bold text-indigo hover:border-indigo/40 hover:bg-indigo/5 w-fit"
          >
            Check My Specific Area <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(activeZones.length > 0
            ? activeZones.map((z) => ({
                id: z.id,
                name: z.name,
                status: z.status.replaceAll("_", " "),
                dot: z.status === "ACTIVE" ? "bg-leaf" : "bg-saffron",
              }))
            : (PILOT_LOCALITIES[slug] ?? [
                { id: "1", name: "Central District", status: "Waitlist", dot: "bg-saffron" },
                { id: "2", name: "North Zone", status: "Early Access", dot: "bg-indigo" },
                { id: "3", name: "South Zone", status: "Waitlist", dot: "bg-saffron" },
              ])
          ).map((zone) => (
            <div
              key={zone.name}
              className="flex items-center justify-between rounded-2xl border border-ink/10 bg-paper p-4 shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-ink/60" />
                <span className="text-sm font-semibold text-ink">{zone.name}</span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-2.5 py-1 text-[0.68rem] font-bold text-ink/80">
                <span className={`h-1.5 w-1.5 rounded-full ${zone.dot}`} />
                {zone.status}
              </span>
            </div>
          ))}
        </div>
      </section>

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
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/80">
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
          <p className="mt-5 max-w-2xl leading-7 text-paper/80">
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
