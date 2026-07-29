import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Sparkles, PawPrint } from "lucide-react";

import { PublicShell } from "@/components/marketing/public-shell";
import { buttonVariants } from "@/components/ui/button";
import { services } from "@/modules/catalog/services";

export const metadata: Metadata = { title: "Services | PetSaathi" };

export default function ServicesPage() {
  return (
    <PublicShell>
      {/* 1. FULL-BLEED ULTRA-LUXURY HERO BANNER (LEFT ALIGNED) */}
      <section className="relative h-[560px] sm:h-[640px] lg:h-[680px] w-full overflow-hidden bg-ink text-paper">
        <Image
          src="/images/services-hero-luxury-banner.jpg"
          alt="Luxury pet care outing with verified Saathi"
          fill
          priority
          unoptimized
          quality={100}
          sizes="100vw"
          className="object-cover object-[70%_center] sm:object-[center_85%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-transparent md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

        <div className="container-shell relative flex h-full flex-col justify-center pb-10 pt-28 sm:pt-32">
          <div className="max-w-xl md:max-w-2xl text-left items-start flex flex-col">
            <span className="inline-flex items-center gap-2 rounded-full border border-saffron/40 bg-saffron/20 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-saffron backdrop-blur-md font-outfit">
              <PawPrint className="h-3.5 w-3.5" /> Care That Fits The Day
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-paper sm:text-6xl sm:leading-[1.1]">
              PET CARE SERVICES MADE EASY
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base font-semibold leading-7 text-white drop-shadow-md">
              Find verified, background-checked Saathis nearby with transparent pricing, real-time telemetry, and 24/7 supervisor care.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/book"
                className={buttonVariants({ variant: "accent", size: "lg", className: "rounded-full px-8 font-outfit shadow-lifted" })}
              >
                Find My Verified Saathi <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 6 SERVICES GRID SECTION */}
      <section className="bg-paper pb-28 pt-12">
        <div className="container-shell">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map(({ slug, name, kicker, description, icon: Icon, image }) => (
              <article
                key={slug}
                className="group flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-indigo/10 bg-paper p-6 shadow-lifted transition-all duration-500 hover:-translate-y-1 hover:border-indigo/30 hover:shadow-soft"
              >
                <div className="relative h-52 w-full overflow-hidden rounded-[1.75rem] bg-indigo/5">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-[center_30%] transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-paper/90 text-indigo shadow-md backdrop-blur transition duration-300 group-hover:bg-indigo group-hover:text-paper">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="absolute right-4 top-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink/60 shadow-md backdrop-blur transition duration-300 group-hover:bg-coral group-hover:text-paper">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col pt-6">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-coral font-outfit">{kicker}</p>
                  <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-ink">{name}</h2>
                  <p className="mt-3 text-sm leading-7 text-ink/60">{description}</p>
                  <div className="mt-auto pt-6">
                    <Link
                      href={`/services/${slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-indigo transition duration-300 group-hover:text-coral"
                    >
                      See service details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
