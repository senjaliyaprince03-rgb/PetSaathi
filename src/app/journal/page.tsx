import { BookOpen, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PublicShell } from "@/components/marketing/public-shell";
import { buttonVariants } from "@/components/ui/button";
import { isDatabaseConfigured, prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Care Journal | PetSaathi",
  description: "Reviewed PetSaathi guides for calmer local pet care and safer handovers."
};
export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const entries = isDatabaseConfigured()
    ? await prisma.contentEntry.findMany({
        where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
        orderBy: { publishedAt: "desc" },
        take: 24,
        select: {
          slug: true,
          type: true,
          title: true,
          excerpt: true,
          city: true,
          publishedAt: true,
          expertReview: { select: { reviewerName: true, credentials: true, verdict: true } }
        }
      })
    : [];

  return (
    <PublicShell>
      {/* 1. FULL-BLEED HERO BANNER (LEFT ALIGNED) */}
      <section className="relative h-[560px] sm:h-[620px] w-full overflow-hidden bg-ink text-paper">
        <Image
          src="/images/journal-hero-luxury-banner.jpg"
          alt="PetSaathi care journal study with pet parent and Golden Retriever"
          fill
          priority
          unoptimized
          quality={100}
          sizes="100vw"
          className="object-cover object-[75%_center] sm:object-[center_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-transparent md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

        <div className="container-shell relative flex h-full flex-col justify-center pb-10 pt-28 sm:pt-32">
          <div className="max-w-xl md:max-w-2xl text-left items-start flex flex-col">
            <span className="inline-flex items-center gap-2 rounded-full border border-saffron/40 bg-saffron/20 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-saffron backdrop-blur-md font-outfit">
              <Sparkles className="h-3.5 w-3.5" /> Reviewed Care Knowledge
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-paper sm:text-6xl sm:leading-[1.1]">
              VERIFIED PET CARE KNOWLEDGE
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base font-medium leading-7 text-paper/85">
              Local care guides written as structured content, reviewed before publication, and clearly marked when specialist review applies.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/book"
                className={buttonVariants({ variant: "accent", size: "lg", className: "rounded-full px-8 font-outfit shadow-lifted" })}
              >
                Explore Saathi Care <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. JOURNAL ENTRIES GRID */}
      <section className="bg-paper pb-28 pt-16">
        <div className="container-shell">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {entries.length ? (
              entries.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/journal/${entry.slug}`}
                  className="group flex flex-col rounded-[2.5rem] border border-ink/10 bg-paper p-8 shadow-lifted transition-all duration-500 hover:-translate-y-1 hover:border-indigo/30"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo/10 text-indigo shadow-sm">
                    <BookOpen className="h-6 w-6" />
                  </span>
                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.17em] text-coral font-outfit">
                    {entry.type.replaceAll("_", " ")}
                    {entry.city ? ` · ${entry.city}` : ""}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-ink transition duration-300 group-hover:text-indigo">{entry.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-ink/65">{entry.excerpt}</p>
                  {entry.expertReview ? (
                    <div className="mt-auto pt-6">
                      <div className="flex items-center gap-2 rounded-2xl bg-leaf/10 p-3 text-xs font-bold text-leaf">
                        <ShieldCheck className="h-4 w-4 shrink-0" />
                        Reviewed by {entry.expertReview.reviewerName}
                      </div>
                    </div>
                  ) : null}
                </Link>
              ))
            ) : (
              <div className="col-span-full rounded-[2.5rem] border border-indigo/10 bg-paper p-12 text-center shadow-lifted">
                <BookOpen className="mx-auto h-12 w-12 text-indigo" />
                <h2 className="mt-4 font-display text-3xl font-bold text-ink">Journal Guides Coming Soon</h2>
                <p className="mt-3 text-sm leading-7 text-ink/65">
                  Our veterinary advisors and certified Saathi leads are finalizing the next edition of local care handbooks.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
