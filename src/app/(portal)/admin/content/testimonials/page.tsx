import { MessageSquare } from "lucide-react";
import { redirect } from "next/navigation";

import { TestimonialActions } from "@/components/portal/testimonial-actions";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["CONTENT_ADMIN", "SUPER_ADMIN"])) {
    redirect("/login?returnTo=/admin/content/testimonials");
  }

  const testimonials = await prisma.testimonial.findMany({
    where: { status: { in: ["DRAFT", "IN_REVIEW"] } },
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  return (
    <main className="min-h-screen bg-cream/50 py-10">
      <div className="container-shell">
        <p className="eyebrow">content moderation</p>
        <h1 className="section-title mt-5">Testimonial Review</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/60">
          Review and approve customer stories before they appear on the public website.
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {testimonials.length === 0 ? (
            <div className="rounded-5xl border border-dashed border-ink/15 bg-paper p-10 text-center lg:col-span-2">
              <MessageSquare className="mx-auto h-10 w-10 text-leaf" />
              <h2 className="mt-4 font-display text-3xl font-semibold">No testimonials awaiting review.</h2>
            </div>
          ) : (
            testimonials.map((t) => (
              <article key={t.id} className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo/10 text-indigo">
                    <MessageSquare className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-saffron/15 px-3 py-1 text-xs font-bold">{t.status}</span>
                </div>

                <h2 className="mt-5 font-display text-2xl font-semibold">{t.displayName}</h2>
                {t.city && <p className="mt-1 text-sm text-ink/50">{t.city}</p>}

                <blockquote className="mt-4 border-l-2 border-indigo/30 pl-4 text-sm italic leading-6 text-ink/60">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <p className="mt-3 text-xs text-ink/40">
                  Submitted {t.createdAt.toLocaleString("en-IN")}
                </p>

                <TestimonialActions id={t.id} status={t.status} />
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
