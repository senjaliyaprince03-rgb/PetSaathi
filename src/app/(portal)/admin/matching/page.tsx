import { Activity, AlertCircle, CalendarDays, CheckCircle2, MapPin, PawPrint, Shield, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { redirect } from "next/navigation";

import { MatchSitterForm } from "@/components/portal/match-sitter-form";
import { PortalShell } from "@/components/portal/portal-shell";
import { RiskReviewForm } from "@/components/portal/risk-review-form";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { refreshMatchScores } from "@/modules/matching/persist-scores";
import { cn } from "@/lib/cn";

export const dynamic = "force-dynamic";

export default async function AdminMatchingPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["OPERATIONS_ADMIN", "SUPER_ADMIN"])) {
    redirect("/login?returnTo=/admin/matching");
  }

  const bookings = await prisma.booking.findMany({
    where: { status: { in: ["REQUESTED", "RISK_REVIEW", "MATCHING", "REPLACEMENT_REQUIRED"] } },
    orderBy: { scheduledStart: "asc" },
    take: 50,
    include: {
      pet: { select: { name: true, species: true, riskAssessments: { orderBy: { createdAt: "desc" }, take: 1, select: { finalLevel: true } } } },
      serviceType: { select: { id: true, name: true, code: true } },
      address: { select: { locality: true, city: true } }
    }
  });

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="max-w-6xl pb-16">
        {/* Header (Stitch Spec) */}
        <section className="mt-4 rounded-[2rem] border border-black/[0.06] bg-gradient-to-r from-paper via-cream to-[#fbf2ea] p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-indigo animate-pulse" />
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-indigo">Autonomous Matching Engine</p>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Matching & Dispatch Control
          </h1>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-ink/70 leading-relaxed">
            Shortlists are ranked in real time using verified caregiver distance, service permissions, training tiers, and schedule buffers.
          </p>
        </section>

        {/* Dispatch Queue */}
        <div className="mt-8 space-y-6">
          {bookings.length ? (
            await Promise.all(
              bookings.map(async (booking) => {
                const risk = booking.pet.riskAssessments[0]?.finalLevel ?? "GREEN";
                const readyToMatch = booking.status === "MATCHING" || booking.status === "REPLACEMENT_REQUIRED";

                let candidates: Array<{ id: string; name: string }> = [];
                if (readyToMatch) {
                  const ranked = await refreshMatchScores(booking.id, identity);
                  candidates = ranked.map((c) => ({
                    id: c.sitterId,
                    name: `${c.sitterName} (Score: ${Math.round(c.totalScore * 100)}% Match${
                      c.requiresHumanApproval
                        ? ` · ${c.status === "APPROVED" ? "review approved" : "review required"}`
                        : ""
                    })`,
                  }));
                }

                return (
                  <article
                    key={booking.id}
                    className="rounded-[2rem] border border-black/[0.06] bg-white p-6 shadow-sm transition sm:p-8 hover:shadow-md"
                  >
                    <div className="flex flex-col justify-between gap-4 border-b border-black/[0.06] pb-5 sm:flex-row sm:items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-indigo/10 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase text-indigo">
                            {booking.status.replaceAll("_", " ")}
                          </span>
                          <span className="text-xs text-ink/50">Ref: #{booking.reference}</span>
                        </div>
                        <h2 className="mt-1 font-display text-2xl font-bold text-ink">
                          {booking.serviceType.name} · <span className="text-coral">{booking.pet.name}</span>
                        </h2>
                      </div>

                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
                          risk === "GREEN"
                            ? "bg-leaf/10 text-leaf"
                            : risk === "YELLOW"
                            ? "bg-saffron/30 text-amber-900"
                            : "bg-coral/10 text-coral"
                        )}
                      >
                        Risk Level: {risk}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 text-xs text-ink/70 sm:grid-cols-3">
                      <p className="flex items-center gap-2">
                        <PawPrint className="h-4 w-4 text-indigo" />
                        Species: <strong className="text-ink">{booking.pet.species.toLowerCase()}</strong>
                      </p>
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-indigo" />
                        {booking.scheduledStart.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-indigo" />
                        {booking.address.locality}, {booking.address.city}
                      </p>
                    </div>

                    <div className="mt-6">
                      {readyToMatch ? (
                        <MatchSitterForm
                          bookingId={booking.id}
                          sitters={candidates}
                          replacement={booking.status === "REPLACEMENT_REQUIRED"}
                        />
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 rounded-2xl border border-saffron/40 bg-saffron/15 p-4 text-xs font-semibold text-ink">
                            <AlertCircle className="h-4 w-4 text-amber-800" />
                            <span>Complete the risk review below before sending caregiver dispatch offers.</span>
                          </div>
                          <RiskReviewForm bookingId={booking.id} />
                        </div>
                      )}
                    </div>
                  </article>
                );
              })
            )
          ) : (
            <div className="rounded-[2.5rem] border border-black/[0.06] bg-white p-12 text-center shadow-sm">
              <CheckCircle2 className="mx-auto h-12 w-12 text-leaf" />
              <h2 className="mt-4 font-display text-2xl font-bold text-ink">The matching queue is clear</h2>
              <p className="mt-1 text-xs text-ink/60">All active requests have been matched and assigned.</p>
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
