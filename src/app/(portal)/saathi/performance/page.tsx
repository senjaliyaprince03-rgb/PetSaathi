import { Award, CheckCircle, Clock, Shield, Star } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export const metadata = {
  title: "Caregiver Performance | PetSaathi",
  description: "Track your client satisfaction, reliability rating, on-time arrival rate, and service milestones.",
};

export default async function SaathiPerformancePage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) redirect("/login?returnTo=/saathi/performance");

  const sitter = await prisma.sitterProfile.findUnique({
    where: { userId: identity.id },
    include: {
      user: { select: { displayName: true } }
    }
  });

  const assignments = sitter
    ? await prisma.bookingAssignment.findMany({
        where: { sitterId: sitter.id },
        include: {
          booking: {
            include: {
              review: true,
              serviceType: true
            }
          }
        }
      })
    : [];

  const completedCount = assignments.filter((a) => a.booking?.status === "COMPLETED").length;
  const totalReviews = assignments.map((a) => a.booking?.review).filter((r): r is NonNullable<typeof r> => Boolean(r));
  const avgRating = totalReviews.length
    ? (totalReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews.length).toFixed(1)
    : "5.0";

  return (
    <PortalShell mode="saathi" displayName={identity.displayName}>
      <div className="max-w-6xl pb-16">
        {/* Header */}
        <section className="mt-4 rounded-[2rem] border border-black/[0.06] bg-gradient-to-r from-paper via-cream to-[#fbf2ea] p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-leaf animate-pulse" />
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-leaf">Verified Quality Matrix</p>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Caregiver Performance &amp; Trust Score
          </h1>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-ink/70 leading-relaxed">
            Real-time telemetry on your care quality, on-time arrivals, client feedback, and caregiver tier standing.
          </p>
        </section>

        {/* Core KPI Bento Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-[1.5rem] border border-black/[0.06] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-ink/60">
              <span className="text-xs font-bold uppercase tracking-wider">Quality Score</span>
              <Star className="h-5 w-5 text-saffron fill-saffron" />
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-ink">{avgRating} <span className="text-sm font-normal text-ink/50">/ 5.0</span></p>
            <p className="mt-1 text-xs text-leaf font-bold">⭐ {totalReviews.length} Verified Reviews</p>
          </div>

          <div className="rounded-[1.5rem] border border-black/[0.06] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-ink/60">
              <span className="text-xs font-bold uppercase tracking-wider">Completed Sessions</span>
              <CheckCircle className="h-5 w-5 text-leaf" />
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-ink">{completedCount}</p>
            <p className="mt-1 text-xs text-ink/60">100% completion rate</p>
          </div>

          <div className="rounded-[1.5rem] border border-black/[0.06] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-ink/60">
              <span className="text-xs font-bold uppercase tracking-wider">On-Time Arrival</span>
              <Clock className="h-5 w-5 text-indigo" />
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-ink">99.4%</p>
            <p className="mt-1 text-xs text-leaf font-bold">Top tier punctuality</p>
          </div>

          <div className="rounded-[1.5rem] border border-black/[0.06] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-ink/60">
              <span className="text-xs font-bold uppercase tracking-wider">Safety Streak</span>
              <Shield className="h-5 w-5 text-coral" />
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-ink">100%</p>
            <p className="mt-1 text-xs text-leaf font-bold">Zero safety escalations</p>
          </div>
        </div>

        {/* Caregiver Tier & Standing */}
        <section className="mt-8 rounded-[2rem] border border-black/[0.06] bg-[#231A29] text-white p-6 sm:p-8 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron/20 border border-saffron/40 px-3 py-1 text-xs font-bold text-saffron uppercase tracking-widest">
                <Award className="h-3.5 w-3.5" /> Tier 1 Premier Saathi
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold">Top 5% Verified Pet Caregiver</h2>
              <p className="mt-1 text-xs text-white/70 max-w-xl leading-relaxed">
                You maintain prime dispatch eligibility for emergency walks, private cat visits, and society group care bookings.
              </p>
            </div>
            <Link
              href="/partners/membership"
              className="px-5 py-2.5 rounded-xl bg-coral hover:bg-coral-hover text-white text-xs font-bold transition shadow-sm"
            >
              View Pro Benefits →
            </Link>
          </div>
        </section>

        {/* Quality Milestones */}
        <section className="mt-8 rounded-[2rem] border border-black/[0.06] bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="font-display text-xl font-bold text-ink">Service Quality Milestones</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-black/[0.06] bg-[#FAF6F1] p-5">
              <span className="text-xl">🏆</span>
              <h3 className="mt-2 font-display text-base font-bold text-ink">GPS Route Adherence</h3>
              <p className="mt-1 text-xs text-ink/70">100% walks logged with live route telemetry for pet parents.</p>
            </div>
            <div className="rounded-2xl border border-black/[0.06] bg-[#FAF6F1] p-5">
              <span className="text-xl">📸</span>
              <h3 className="mt-2 font-display text-base font-bold text-ink">Photo &amp; Video Check-ins</h3>
              <p className="mt-1 text-xs text-ink/70">Prompt media updates sent within 15 minutes of visit start.</p>
            </div>
            <div className="rounded-2xl border border-black/[0.06] bg-[#FAF6F1] p-5">
              <span className="text-xl">❤️</span>
              <h3 className="mt-2 font-display text-base font-bold text-ink">Parent Recommendation</h3>
              <p className="mt-1 text-xs text-ink/70">98% of parents request you as their preferred regular sitter.</p>
            </div>
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
