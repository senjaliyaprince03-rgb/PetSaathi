import { BookOpen, CheckCircle2, FileEdit, MessageSquareQuote, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ContentCreateForm, ContentTransitionActions, ExpertReviewForm } from "@/components/portal/content-admin";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["CONTENT_ADMIN", "SUPER_ADMIN"])) {
    redirect("/login?returnTo=/admin/content");
  }

  const entries = await prisma.contentEntry.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: {
      expertReview: { select: { verdict: true, reviewerName: true } },
      versions: { orderBy: { version: "desc" }, take: 1, select: { version: true } },
    },
  });

  const publishedCount = entries.filter((e) => e.status === "PUBLISHED").length;
  const draftCount = entries.filter((e) => e.status === "DRAFT" || e.status === "IN_REVIEW").length;
  const vetReviewedCount = entries.filter((e) => e.expertReview?.verdict === "APPROVED").length;

  return (
    <PortalShell mode="admin" displayName={identity.displayName} roles={identity.roles}>
      <div className="max-w-7xl pb-16 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-indigo/5 text-indigo border border-indigo/15 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                <BookOpen className="w-3.5 h-3.5 text-indigo" />
                CMS &amp; Community Editorial Studio
              </span>
              <span className="text-xs text-ink/60 font-semibold hidden sm:inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-leaf" />
                Vet Approval Gate Active
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-ink">
              Content Studio &amp; Editorial Desk
            </h1>
            <p className="mt-2 text-sm leading-6 text-ink/70 max-w-3xl">
              Curate educational guides, breed nutrition advice, and community stories. Medical, health, and breed safety articles require verified veterinary sign-off before publication.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/content/testimonials"
              className="inline-flex items-center gap-2 bg-white hover:bg-surface border border-ink/10 text-ink text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-2xs"
            >
              <MessageSquareQuote className="w-4 h-4 text-indigo" />
              <span>Review Moderation</span>
            </Link>
          </div>
        </div>

        {/* Top 4 Content KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Total Articles</span>
              <BookOpen className="w-4 h-4 text-indigo" />
            </div>
            <span className="text-3xl font-bold font-display text-ink block">{entries.length}</span>
            <p className="text-[11px] text-ink/60 mt-1 font-medium">Knowledge base entries</p>
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Live Published</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-3xl font-bold font-display text-emerald-700 block">{publishedCount}</span>
            <p className="text-[11px] text-emerald-700 mt-1 font-medium">Publicly accessible guides</p>
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">In Review / Draft</span>
              <FileEdit className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-3xl font-bold font-display text-amber-700 block">{draftCount}</span>
            <p className="text-[11px] text-amber-700 mt-1 font-medium">Under active drafting</p>
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Vet Reviewed</span>
              <ShieldCheck className="w-4 h-4 text-leaf" />
            </div>
            <span className="text-3xl font-bold font-display text-leaf block">{vetReviewedCount}</span>
            <p className="text-[11px] text-leaf mt-1 font-medium">Approved clinical content</p>
          </div>
        </div>

        {/* Content Creation Drawer / Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-2xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-ink/5">
            <Sparkles className="w-4 h-4 text-coral" />
            <h2 className="font-display text-lg font-bold text-ink">Compose New Educational Resource</h2>
          </div>
          <ContentCreateForm />
        </div>

        {/* Content Entries Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-ink/5">
            <h2 className="font-display text-xl font-bold text-ink">Articles &amp; Breed Guides ({entries.length})</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {entries.length ? (
              entries.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-3xl border border-ink/10 bg-white p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-indigo" />
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-coral">
                          {entry.type} • v{entry.versions[0]?.version ?? 1}
                        </span>
                      </div>
                      <span className={`rounded-full px-3 py-0.5 text-[10px] uppercase font-extrabold tracking-wider border ${
                        entry.status === "PUBLISHED"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}>
                        {entry.status}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-ink mb-2 leading-snug">
                      {entry.title}
                    </h3>
                    <p className="text-xs text-ink/70 leading-relaxed font-medium line-clamp-3">
                      {entry.excerpt}
                    </p>

                    {entry.expertReview?.verdict === "APPROVED" && (
                      <div className="mt-3.5 flex items-center gap-2 text-xs font-semibold text-leaf bg-leaf/5 px-3 py-1.5 rounded-xl border border-leaf/15">
                        <ShieldCheck className="h-4 w-4 shrink-0" />
                        <span>Veterinary verified by {entry.expertReview.reviewerName}</span>
                      </div>
                    )}

                    {/health|medical|safety/i.test(entry.type) && entry.expertReview?.verdict !== "APPROVED" && (
                      <div className="mt-4 pt-3 border-t border-ink/5">
                        <ExpertReviewForm id={entry.id} />
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-ink/5">
                    <ContentTransitionActions id={entry.id} status={entry.status} />
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-ink/15 bg-white p-12 text-center md:col-span-2">
                <BookOpen className="mx-auto h-12 w-12 text-ink/30 mb-3" />
                <h3 className="font-display text-xl font-bold text-ink">No Content Published Yet</h3>
                <p className="text-xs text-ink/60 mt-1">Use the composer above to publish your first educational article or breed guide.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
