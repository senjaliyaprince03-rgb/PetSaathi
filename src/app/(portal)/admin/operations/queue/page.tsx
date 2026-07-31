import { notFound, redirect } from "next/navigation";
import { AlertTriangle, Clock, Play } from "lucide-react";

import { PortalShell } from "@/components/portal/portal-shell";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function ExceptionQueuePage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login?returnTo=/admin/operations/queue");
  if (!hasAnyRole(identity, ["OPERATIONS_ADMIN", "SUPER_ADMIN"])) notFound();
  // Find bookings in MATCHING status that require human approval
  const flaggedMatches = await prisma.matchScore.findMany({
    where: { requiresHumanApproval: true, status: "PENDING" },
    include: {
      booking: { include: { pet: true, serviceType: true } },
      sitter: { include: { user: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Find bookings that have been stuck in REQUESTED or MATCHING for > 15 minutes
  const fifteenMinsAgo = new Date(Date.now() - 15 * 60000);
  const stuckBookings = await prisma.booking.findMany({
    where: {
      status: { in: ["REQUESTED", "MATCHING"] },
      createdAt: { lt: fifteenMinsAgo },
    },
    include: { pet: true, serviceType: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="mt-5 max-w-5xl">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">Operations Exception Queue</h1>
        <p className="mt-3 text-sm leading-6 text-ink/60">
          Monitor and resolve high-risk matches and stalled workflows.
        </p>

        <section className="mt-10">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral/10 text-coral">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <h2 className="font-display text-2xl font-semibold text-ink">
              High-Risk Matches Requiring Approval
            </h2>
            <span className="ml-2 rounded-full bg-coral px-3 py-1 text-xs font-bold text-paper">
              {flaggedMatches.length}
            </span>
          </div>
          
          <div className="mt-6 overflow-hidden rounded-4xl border border-indigo/10 bg-paper shadow-lifted">
            <ul className="divide-y divide-indigo/5">
              {flaggedMatches.length === 0 ? (
                <li className="p-8 text-center text-sm font-medium text-ink/60">
                  No matches require manual approval.
                </li>
              ) : (
                flaggedMatches.map((match) => (
                  <li key={match.id} className="p-6 transition-colors hover:bg-cream/20">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="font-semibold text-ink">
                          <span className="font-mono text-ink/50">{match.booking.reference}</span>
                          <span className="mx-2 text-ink/30">•</span>
                          {match.booking.serviceType.name} for {match.booking.pet.name}
                        </p>
                        <p className="mt-1 text-sm font-medium text-ink/75">
                          Proposed Sitter: <span className="font-semibold">{match.sitter.user.displayName}</span> 
                          <span className="mx-2 text-ink/30">•</span>
                          Match Score: {(match.totalScore * 100).toFixed(0)}%
                        </p>
                        <ul className="mt-3 grid gap-1 border-l-2 border-coral/30 pl-3">
                          {match.approvalReasons.map((r, i) => (
                            <li key={i} className="text-xs font-semibold text-coral/80">{r}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex shrink-0 gap-3">
                        <form action={async () => {
                          "use server";
                          const { reviewMatch } = await import("./actions");
                          await reviewMatch(match.id, "reject");
                        }}>
                          <button className={buttonVariants({ variant: "outline", size: "sm" })}>
                            Reject match
                          </button>
                        </form>
                        <form action={async () => {
                          "use server";
                          const { reviewMatch } = await import("./actions");
                          await reviewMatch(match.id, "approve");
                        }}>
                          <button className={buttonVariants({ variant: "accent", size: "sm", className: "bg-leaf text-paper hover:bg-leaf/90" })}>
                            Approve match
                          </button>
                        </form>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-saffron/20 text-saffron-dark">
              <Clock className="h-5 w-5" />
            </span>
            <h2 className="font-display text-2xl font-semibold text-ink">
              Stuck Bookings
            </h2>
            <span className="ml-2 rounded-full bg-saffron px-3 py-1 text-xs font-bold text-ink">
              {stuckBookings.length}
            </span>
            <span className="text-sm font-medium text-ink/50">(&gt;15m without assignment)</span>
          </div>

          <div className="mt-6 overflow-hidden rounded-4xl border border-indigo/10 bg-paper shadow-lifted">
            <ul className="divide-y divide-indigo/5">
              {stuckBookings.length === 0 ? (
                <li className="p-8 text-center text-sm font-medium text-ink/60">
                  No stuck bookings. Queue is healthy.
                </li>
              ) : (
                stuckBookings.map((booking) => (
                  <li key={booking.id} className="p-6 transition-colors hover:bg-cream/20">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="font-semibold text-ink">
                          <span className="font-mono text-ink/50">{booking.reference}</span>
                          <span className="mx-2 text-ink/30">•</span>
                          {booking.serviceType.name} for {booking.pet.name}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-sm">
                          <span className="inline-flex rounded-full bg-indigo/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo">
                            {booking.status}
                          </span>
                          <span className="text-ink/60">
                            Created: {booking.createdAt.toLocaleTimeString("en-IN")}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {booking.status === "REQUESTED" ? (
                          <form action={async () => {
                            "use server";
                            const { advanceBookingToMatching } = await import("./actions");
                            await advanceBookingToMatching(booking.id);
                          }}>
                            <button className={buttonVariants({ variant: "outline", size: "sm" })}>
                              <Play className="mr-2 h-4 w-4" /> Advance to Matching
                            </button>
                          </form>
                        ) : (
                          <span className="rounded-full bg-saffron/10 px-3 py-1.5 text-xs font-bold text-saffron-dark">
                            Candidate review required
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
