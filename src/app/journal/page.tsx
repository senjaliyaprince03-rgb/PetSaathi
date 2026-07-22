import { BookOpen, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro, PublicShell } from "@/components/marketing/public-shell";
import { isDatabaseConfigured, prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Care journal",
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
      <PageIntro
        eyebrow="reviewed care knowledge"
        title="Useful guidance, with its evidence visible."
        description="Local care guides are written as structured content, reviewed before publication and clearly marked when specialist review applies."
      />
      <section className="container-shell grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {entries.length ? (
          entries.map((entry) => (
            <Link
              key={entry.slug}
              href={`/journal/${entry.slug}`}
              className="group rounded-5xl border border-ink/10 bg-paper p-7 shadow-lifted transition hover:-translate-y-1"
            >
              <BookOpen className="h-6 w-6 text-indigo" />
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.17em] text-coral">
                {entry.type.replaceAll("_", " ")}
                {entry.city ? ` · ${entry.city}` : ""}
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight group-hover:text-indigo">
                {entry.title}
              </h2>
              <p className="mt-4 line-clamp-3 leading-7 text-ink/58">{entry.excerpt}</p>
              {entry.expertReview?.verdict === "APPROVED" && (
                <p className="mt-5 flex items-center gap-2 text-xs font-semibold text-leaf">
                  <ShieldCheck className="h-4 w-4" />
                  Reviewed by {entry.expertReview.reviewerName}
                </p>
              )}
            </Link>
          ))
        ) : (
          <div className="rounded-5xl border border-dashed border-ink/15 bg-paper p-12 text-center md:col-span-2 xl:col-span-3">
            <BookOpen className="mx-auto h-10 w-10 text-saffron" />
            <h2 className="mt-5 font-display text-3xl font-semibold">
              The journal opens after editorial review.
            </h2>
            <p className="mt-3 text-ink/70">Draft material is never displayed as published advice.</p>
          </div>
        )}
      </section>
    </PublicShell>
  );
}
