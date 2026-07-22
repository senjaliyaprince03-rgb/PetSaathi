import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ExceptionQueuePage() {
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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Operations Exception Queue</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-red-600 mb-4">
          High-Risk Matches Requiring Approval ({flaggedMatches.length})
        </h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {flaggedMatches.length === 0 ? (
              <li className="p-6 text-gray-500 text-center">No matches require manual approval.</li>
            ) : (
              flaggedMatches.map((match) => (
                <li key={match.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {match.booking.reference} — {match.booking.serviceType.name} for {match.booking.pet.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Proposed Sitter: {match.sitter.user.displayName} (Score: {(match.totalScore * 100).toFixed(0)}%)
                      </p>
                      <ul className="list-disc list-inside mt-2 text-xs text-red-500">
                        {match.approvalReasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                    <Link
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      href={`/admin/bookings/${match.booking.id}` as any}
                      className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                    >
                      Review
                    </Link>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Stuck Bookings (&gt;15m without assignment) ({stuckBookings.length})
        </h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {stuckBookings.length === 0 ? (
              <li className="p-6 text-gray-500 text-center">No stuck bookings. Queue is healthy.</li>
            ) : (
              stuckBookings.map((booking) => (
                <li key={booking.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {booking.reference} — {booking.serviceType.name} for {booking.pet.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Status: {booking.status} | Created: {booking.createdAt.toLocaleTimeString()}
                      </p>
                    </div>
                    <Link
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      href={`/admin/bookings/${booking.id}` as any}
                      className="px-4 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
                    >
                      Intervene
                    </Link>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
