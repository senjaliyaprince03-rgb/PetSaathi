import type { Metadata } from "next";
import type { Route } from "next";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";

import { PageIntro, PublicShell } from "@/components/marketing/public-shell";
import { buttonVariants } from "@/components/ui/button";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export const metadata: Metadata = {
  title: "Pet Care Locations & Society Hubs",
  description: "Explore PetSaathi operational cities: verified caregivers, structured service zones and locally reviewed pet care guides across India."
};

export const dynamic = "force-dynamic";

const STATUS_ORDER = ["LAUNCHED", "ACTIVE_LIMITED", "MANUAL_BETA", "BETA", "PREPARING", "RESEARCH"];

export default async function CitiesIndexPage() {
  let cities: Array<{ id: string; slug: string; name: string; state: string; status: string }> = [];
  if (isDatabaseConfigured()) {
    try {
      cities = await prisma.city.findMany({
        orderBy: [{ status: "asc" }, { name: "asc" }],
        select: { id: true, slug: true, name: true, state: true, status: true },
      });
      cities.sort((a, b) => {
        const rank = (status: string) => {
          const index = STATUS_ORDER.indexOf(status);
          return index === -1 ? STATUS_ORDER.length : index;
        };
        return rank(a.status) - rank(b.status) || a.name.localeCompare(b.name);
      });
    } catch (error) {
      logger.warn("cities_index_unavailable", {
        error: error instanceof Error ? error.message : "unknown_error",
      });
    }
  }

  return (
    <PublicShell>
      <PageIntro
        eyebrow="Locations"
        title="Pet care across Indian cities."
        description="PetSaathi launches city by city with verified caregiver capacity, structured service zones and reviewed local guides."
      />

      <section className="container-shell pb-28">
        {cities.length ? (
          <>
            <p className="text-sm font-semibold text-ink/80">{cities.length} cit{cities.length === 1 ? "y" : "ies"} on the PetSaathi map.</p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((city) => (
                <Link
                  key={city.id}
                  href={`/cities/${city.slug}` as Route}
                  className="group flex flex-col rounded-5xl border border-ink/10 bg-paper p-7 shadow-lifted transition hover:-translate-y-1 hover:border-indigo/30"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron/15 text-saffron">
                    <MapPin className="h-6 w-6" />
                  </span>
                  <h2 className="mt-5 font-display text-2xl font-bold text-ink transition group-hover:text-indigo">{city.name}</h2>
                  <p className="mt-1 text-sm font-medium text-ink/80">{city.state}</p>
                  <span className="mt-4 w-fit rounded-full bg-indigo/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-indigo">
                    {city.status.replaceAll("_", " ")}
                  </span>
                  <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-indigo">
                    Explore {city.name} <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-[2.5rem] border border-dashed border-ink/15 bg-paper p-12 text-center shadow-lifted">
            <MapPin className="mx-auto h-10 w-10 text-saffron" />
            <h2 className="mt-4 font-display text-3xl font-bold text-ink">City launches are being scheduled.</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-ink/80">
              We publish a city hub as soon as caregiver capacity, service zones and safety workflows are ready. Tell us where you are and we will prioritise your city.
            </p>
            <Link href="/contact" className={`${buttonVariants({ variant: "accent" })} mt-7 rounded-full px-8 font-outfit shadow-lifted`}>
              Request your city <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        )}
      </section>
    </PublicShell>
  );
}
