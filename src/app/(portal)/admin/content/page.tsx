import { BookOpen, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

import { ContentCreateForm, ContentTransitionActions, ExpertReviewForm } from "@/components/portal/content-admin";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["CONTENT_ADMIN", "SUPER_ADMIN"])) redirect("/login?returnTo=/admin/content");
  const entries = await prisma.contentEntry.findMany({ orderBy: { updatedAt: "desc" }, take: 100, include: { expertReview: { select: { verdict: true, reviewerName: true } }, versions: { orderBy: { version: "desc" }, take: 1, select: { version: true } } } });
  return <main className="min-h-screen bg-cream/50 py-10"><div className="container-shell"><p className="eyebrow">structured editorial workflow</p><h1 className="section-title mt-5">Content studio</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-ink/60">Drafts cannot skip review or approval. Health and safety content cannot publish without an attached approved expert review.</p><div className="mt-10"><ContentCreateForm /></div><div className="mt-8 grid gap-5 lg:grid-cols-2">{entries.map((entry) => <article key={entry.id} className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted"><div className="flex items-center justify-between gap-3"><BookOpen className="h-6 w-6 text-indigo" /><span className="rounded-full bg-indigo/10 px-3 py-1 text-xs font-bold text-indigo">{entry.status}</span></div><p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-coral">{entry.type} · v{entry.versions[0]?.version ?? 0}</p><h2 className="mt-2 font-display text-3xl font-semibold">{entry.title}</h2><p className="mt-3 text-sm leading-6 text-ink/55">{entry.excerpt}</p>{entry.expertReview?.verdict === "APPROVED" && <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-leaf"><ShieldCheck className="h-4 w-4" />Expert reviewed by {entry.expertReview.reviewerName}</p>}{/health|medical|safety/i.test(entry.type) && entry.expertReview?.verdict !== "APPROVED" && <ExpertReviewForm id={entry.id} />}<ContentTransitionActions id={entry.id} status={entry.status} /></article>)}</div></div></main>;
}
