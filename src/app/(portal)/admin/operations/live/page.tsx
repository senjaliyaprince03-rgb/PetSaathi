import type { Role } from "@prisma/client";
import type { Route } from "next";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

const adminRoles: Role[] = ["OPERATIONS_ADMIN", "SUPER_ADMIN"];

export default async function LiveOperationsPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, adminRoles)) redirect("/login?returnTo=/admin/operations/live" as Route);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [activeSessions, overdueCheckins, pendingMatches, todayBookings, activeIncidents] = await Promise.all([
    prisma.trackingSession.findMany({
      where: { status: "ACTIVE", endedAt: null },
      include: { booking: { select: { reference: true, pet: { select: { name: true } }, serviceType: { select: { name: true } }, customer: { select: { displayName: true } } } } },
      orderBy: { startedAt: "desc" },
      take: 50,
    }),
    prisma.bookingAssignment.count({
      where: { status: "ACCEPTED", booking: { status: "CONFIRMED", scheduledStart: { lte: new Date(now.getTime() + 30 * 60_000) } } },
    }),
    prisma.matchScore.count({ where: { status: "PENDING", requiresHumanApproval: true } }),
    prisma.booking.count({ where: { scheduledStart: { gte: todayStart }, status: { notIn: ["CUSTOMER_CANCELLED", "DRAFT"] } } }),
    prisma.incident.count({ where: { status: { not: "CLOSED" } } }),
  ]);

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="space-y-6 max-w-6xl mx-auto p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Live Operations</h1>
          <p className="text-gray-400">Real-time service execution and matching across all cities.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-white/10 bg-black p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Active Walks</p>
            <p className="text-3xl font-bold text-emerald-400 mt-1">{activeSessions.length}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Today&apos;s Bookings</p>
            <p className="text-3xl font-bold text-blue-400 mt-1">{todayBookings}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Overdue Check-ins</p>
            <p className={`text-3xl font-bold mt-1 ${overdueCheckins > 0 ? "text-amber-400" : "text-gray-500"}`}>{overdueCheckins}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Match Approvals</p>
            <p className={`text-3xl font-bold mt-1 ${pendingMatches > 0 ? "text-rose-400" : "text-gray-500"}`}>{pendingMatches}</p>
          </div>
        </div>

        {/* Active Incidents Banner */}
        {activeIncidents > 0 && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
            <p className="text-sm font-semibold text-rose-400">⚠ {activeIncidents} open incident{activeIncidents === 1 ? "" : "s"} requiring attention</p>
          </div>
        )}

        {/* Active Tracking Sessions */}
        <div className="rounded-xl border border-white/10 bg-black p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Active Service Sessions</h2>
          {activeSessions.length === 0 ? (
            <p className="text-sm text-gray-500">No active tracking sessions right now.</p>
          ) : (
            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div>
                    <p className="text-sm font-medium text-white">{session.booking.reference}</p>
                    <p className="text-xs text-gray-400">
                      {session.booking.pet.name} • {session.booking.serviceType.name} • {session.booking.customer.displayName}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs text-emerald-400">Live</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {session.distanceM ? `${(session.distanceM / 1000).toFixed(1)} km` : "Starting..."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
