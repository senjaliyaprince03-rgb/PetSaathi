import { AlertCircle, CalendarDays, MapPin, PawPrint } from "lucide-react";
import { redirect } from "next/navigation";

import { MatchSitterForm } from "@/components/portal/match-sitter-form";
import { RiskReviewForm } from "@/components/portal/risk-review-form";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { rankCandidates } from "@/modules/matching/score-engine";

export const dynamic = "force-dynamic";

export default async function AdminMatchingPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["OPERATIONS_ADMIN", "SUPER_ADMIN"])) redirect("/login?returnTo=/admin/matching");

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

  return <main className="min-h-screen bg-cream/50 py-10"><div className="container-shell">
    <p className="eyebrow">operations · Bopal pilot</p>
    <h1 className="section-title mt-5">Matching queue</h1>
    <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/60">The shortlist is powered by our AI scoring engine. The server rechecks status, service permission, expiry, risk and schedule overlap when an offer is sent.</p>
    <div className="mt-10 grid gap-5">{bookings.length ? (
      await Promise.all(bookings.map(async (booking) => {
        const risk = booking.pet.riskAssessments[0]?.finalLevel ?? "UNASSESSED";
        const readyToMatch = booking.status === "MATCHING" || booking.status === "REPLACEMENT_REQUIRED";
        
        let candidates: Array<{id: string, name: string}> = [];
        if (readyToMatch) {
          const ranked = await rankCandidates(booking.id);
          candidates = ranked.map(c => ({
            id: c.sitterId,
            name: `${c.sitterName} (Score: ${Math.round(c.totalScore * 100)}/100)`
          }));
        }

        return <article key={booking.id} className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
          <div className="flex flex-col justify-between gap-4 sm:flex-row"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">{booking.reference} · {booking.status.replaceAll("_", " ")}</p><h2 className="mt-2 font-display text-3xl font-semibold">{booking.serviceType.name} for {booking.pet.name}</h2></div><span className="h-fit rounded-full bg-saffron/20 px-4 py-2 text-xs font-bold">Risk: {risk}</span></div>
          <div className="mt-5 grid gap-3 text-sm text-ink/60 sm:grid-cols-3"><p className="flex items-center gap-2"><PawPrint className="h-4 w-4 text-leaf" />{booking.pet.species.toLowerCase()}</p><p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-leaf" />{booking.scheduledStart.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p><p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-leaf" />{booking.address.locality}, {booking.address.city}</p></div>
          {readyToMatch ? <MatchSitterForm bookingId={booking.id} sitters={candidates} replacement={booking.status === "REPLACEMENT_REQUIRED"} /> : <><p className="mt-5 flex items-center gap-2 rounded-2xl bg-saffron/12 p-4 text-sm font-semibold"><AlertCircle className="h-4 w-4" />Complete the risk review before matching.</p><RiskReviewForm bookingId={booking.id} /></>}
        </article>;
      }))
    ) : <div className="glass-panel rounded-5xl p-10 text-center"><PawPrint className="mx-auto h-10 w-10 text-leaf" /><h2 className="mt-5 font-display text-3xl font-semibold">The queue is clear.</h2></div>}</div>
  </div></main>;
}
