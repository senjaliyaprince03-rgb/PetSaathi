import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { StructuredContent } from "@/components/content/structured-content";
import { PublicShell } from "@/components/marketing/public-shell";
import { LeadMagnetCta } from "@/components/marketing/lead-magnet-cta";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { ArticleJsonLd } from "@/components/seo/json-ld";
import { getCanonicalBaseUrl } from "@/lib/app-url";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isDatabaseConfigured()) notFound();
  const entry = await prisma.contentEntry.findFirst({
    where: { slug, status: "PUBLISHED", publishedAt: { lte: new Date() } },
    select: { title: true, excerpt: true },
  });
  if (!entry) notFound();
  const baseUrl = getCanonicalBaseUrl();
  return { 
    title: `${entry.title} | PetSaathi Journal`, 
    description: entry.excerpt ?? "Expert canine and feline care guide from PetSaathi.",
    alternates: {
      canonical: `${baseUrl}/journal/${slug}`,
    },
    openGraph: {
      title: `${entry.title} | PetSaathi Journal`,
      description: entry.excerpt ?? "Expert canine and feline care guide from PetSaathi.",
      url: `${baseUrl}/journal/${slug}`,
      siteName: "PetSaathi",
      images: [{ url: "/images/hero-care-handover-highres.webp", width: 1200, height: 630, alt: entry.title }],
      locale: "en_IN",
      type: "article",
    }
  };
}

export default async function JournalDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!isDatabaseConfigured()) notFound();
  const entry = await prisma.contentEntry.findFirst({ where: { slug, status: "PUBLISHED", publishedAt: { lte: new Date() } }, include: { expertReview: true } });
  if (!entry) notFound();
  const baseUrl = getCanonicalBaseUrl();
  return (
    <PublicShell>
      <ArticleJsonLd
        title={entry.title}
        description={entry.excerpt ?? ""}
        datePublished={entry.publishedAt?.toISOString() ?? entry.createdAt.toISOString()}
        dateModified={entry.updatedAt.toISOString()}
        authorName="PetSaathi Editorial"
        url={`${baseUrl}/journal/${slug}`}
      />
      <article className="container-shell py-16">
        <header className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center">{entry.type.replaceAll("_", " ")}{entry.city ? ` · ${entry.city}` : ""}</p>
          <h1 className="section-title mx-auto mt-5 max-w-[14ch]">{entry.title}</h1>
          {entry.excerpt && <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-ink/80">{entry.excerpt}</p>}
          {entry.expertReview?.verdict === "APPROVED" ? (
            <div className="mx-auto mt-7 inline-flex items-center gap-2 rounded-full border border-leaf/20 bg-leaf/10 px-4 py-2 text-xs font-semibold text-leaf">
              <ShieldCheck className="h-4 w-4" />
              PetSaathi Editorial Team — general care information, not veterinary advice
            </div>
          ) : (
            <div className="mx-auto mt-7 inline-flex items-center gap-2 rounded-full border border-indigo/20 bg-indigo/5 px-4 py-2 text-xs font-semibold text-indigo">
              <ShieldCheck className="h-4 w-4" />
              PetSaathi Editorial Team — general care information, not veterinary advice
            </div>
          )}
        </header>
        <div className="mx-auto mt-14 max-w-3xl rounded-5xl border border-ink/10 bg-paper p-7 shadow-lifted sm:p-10">
          <StructuredContent value={entry.body} />
        </div>
        
        <div className="mx-auto mt-14 max-w-3xl">
          <LeadMagnetCta 
            title="Download the New Pet Parent Checklist"
            description="A comprehensive printable guide covering everything you need for the first 30 days."
            magnetSlug="new-pet-checklist"
          />
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-xs leading-5 text-ink/80">
          General care education only. This article does not diagnose, treat, guarantee clinic availability, transport or insurance coverage.
        </p>
      </article>
    </PublicShell>
  );
}
