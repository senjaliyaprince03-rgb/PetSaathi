import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, CalendarDays, MapPin, ShieldCheck } from "lucide-react";

import { PublicShell } from "@/components/marketing/public-shell";
import { buttonVariants } from "@/components/ui/button";
import { isDatabaseConfigured, prisma } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

async function getSitter(id: string) {
  if (!isDatabaseConfigured() || !id) return null;
  try {
    return await prisma.sitterProfile.findFirst({
      where: { id, status: "APPROVED" },
      select: {
        id: true,
        bio: true,
        yearsExperience: true,
        serviceLocality: true,
        serviceRadiusKm: true,
        approvedAt: true,
        user: { select: { displayName: true } },
        verifications: {
          where: { status: "PASSED", revokedAt: null },
          select: { id: true, publicLabel: true, type: true },
        },
      },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const sitter = await getSitter(id);
  if (!sitter) return { title: "Saathi not found | PetSaathi", robots: { index: false } };
  return {
    title: `${sitter.user.displayName} | PetSaathi Saathi`,
    description: sitter.bio ?? `Verified local pet care by ${sitter.user.displayName}.`,
    robots: { index: false }
  };
}

export default async function SitterPage({ params }: Props) {
  const { id } = await params;
  const sitter = await getSitter(id);
  if (!sitter) notFound();

  return (
    <PublicShell>
      <section className="bg-paper pb-28 pt-16">
        <div className="container-shell max-w-3xl">
          <article className="rounded-[2.5rem] border border-ink/10 bg-paper p-8 shadow-lifted sm:p-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-indigo font-display text-4xl font-semibold text-paper shadow-soft">
                {sitter.user.displayName.slice(0, 1).toUpperCase()}
              </span>
              <div>
                <p className="eyebrow">Verified Saathi</p>
                <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink">{sitter.user.displayName}</h1>
                <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink/80">
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-coral" />{sitter.serviceLocality ?? "Service locality pending"}</span>
                  <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-indigo" />{sitter.yearsExperience} years experience</span>
                </p>
              </div>
            </div>

            {sitter.bio ? (
              <p className="mt-7 text-base leading-8 text-ink/80">{sitter.bio}</p>
            ) : null}

            <div className="mt-8 grid gap-3 rounded-[1.75rem] bg-cream/50 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-coral-text">Care coverage</p>
              <p className="text-sm font-medium text-ink/80">Serves within ~{sitter.serviceRadiusKm} km{sitter.serviceLocality ? ` of ${sitter.serviceLocality}` : ""}.</p>
            </div>

            {sitter.verifications.length ? (
              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-coral-text">Passed verifications</p>
                <ul className="mt-4 grid gap-3">
                  {sitter.verifications.map((verification) => (
                    <li key={verification.id} className="flex items-center gap-3 rounded-2xl border border-leaf/20 bg-leaf/5 p-4 text-sm font-semibold text-ink">
                      <ShieldCheck className="h-5 w-5 shrink-0 text-leaf" />
                      {verification.publicLabel ?? verification.type.replaceAll("_", " ")}
                      <BadgeCheck className="ml-auto h-4 w-4 shrink-0 text-leaf" />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <p className="mt-8 text-xs leading-5 text-ink/80">Profile verified as of {sitter.approvedAt?.toLocaleDateString("en-IN") ?? "review"}. Identity documents and evidence stay private with PetSaathi.</p>

            <Link href="/book" className={`${buttonVariants({ variant: "accent", size: "lg" })} mt-8 font-outfit rounded-full px-8 shadow-lifted`}>
              Request this Saathi <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </article>
        </div>
      </section>
    </PublicShell>
  );
}
