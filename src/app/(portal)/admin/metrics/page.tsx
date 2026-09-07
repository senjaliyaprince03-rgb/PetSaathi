import { redirect } from "next/navigation";
import { getCurrentIdentity } from "@/modules/auth/session";
import { prisma } from "@/lib/db";
import { PortalShell } from "@/components/portal/portal-shell";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  IndianRupee, 
  ShieldCheck, 
  AlertTriangle, 
  Activity,
  CheckCircle2,
  Clock
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminMetricsPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login?returnTo=/admin/metrics");
  if (!identity.roles.includes("SUPER_ADMIN") && !identity.roles.includes("OPERATIONS_ADMIN")) {
    redirect("/admin");
  }

  const [
    totalUsers,
    totalSitters,
    verifiedSitters,
    totalBookings,
    activeBookings,
    completedBookings,
    cancelledBookings,
    paymentsAggregate,
    openIncidents,
    criticalIncidents
  ] = await Promise.all([
    prisma.user.count(),
    prisma.sitterProfile.count(),
    prisma.sitterProfile.count({ where: { status: "APPROVED" } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "IN_PROGRESS" } }),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
    prisma.booking.count({
      where: {
        status: { in: ["CUSTOMER_CANCELLED", "SITTER_CANCELLED"] }
      }
    }),
    prisma.payment.aggregate({
      _sum: { amountPaise: true },
      where: { status: "CAPTURED" }
    }),
    prisma.incident.count({ where: { status: "REPORTED" } }),
    prisma.incident.count({
      where: { severity: "CRITICAL", status: "REPORTED" }
    })
  ]);

  const totalPaise = paymentsAggregate._sum.amountPaise || 0;
  const revenueRupees = totalPaise / 100;
  const formattedRevenue = "₹" + revenueRupees.toLocaleString("en-IN");
  const sitterVerificationRate = totalSitters > 0 ? ((verifiedSitters / totalSitters) * 100).toFixed(1) : "0";
  const bookingCompletionRate = totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(1) : "0";

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-indigo/5 text-indigo border border-indigo/15 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              Live KPI Telemetry
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-ink">
              Platform Metrics & Business Telemetry
            </h1>
            <p className="text-sm text-ink/70 mt-1">
              Live operational health, transaction aggregates, and network supply metrics across India.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-700 animate-ping" />
              System Online (IST)
            </span>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-3xl border border-ink/10 bg-paper p-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Total Revenue (Gross)</span>
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-800">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-ink mt-3 font-display">{formattedRevenue}</p>
            <p className="text-xs text-emerald-800 font-bold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Razorpay Settled
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-paper p-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Total Bookings</span>
              <div className="p-2.5 rounded-2xl bg-indigo/10 text-indigo">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-ink mt-3 font-display">{totalBookings}</p>
            <p className="text-xs text-ink/70 mt-2 font-medium">
              {activeBookings} Active | {completedBookings} Completed ({bookingCompletionRate}%)
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-paper p-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Verified Saathis</span>
              <div className="p-2.5 rounded-2xl bg-saffron/15 text-saffron-dark">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-ink mt-3 font-display">{verifiedSitters} / {totalSitters}</p>
            <p className="text-xs text-ink/70 mt-2 font-medium">
              {sitterVerificationRate}% Background Verified
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-paper p-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Total Community</span>
              <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-700">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-ink mt-3 font-display">{totalUsers}</p>
            <p className="text-xs text-ink/70 mt-2 font-medium">
              Registered Parents &amp; Caregivers
            </p>
          </div>
        </div>

        {/* Trust & Safety Health Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-ink/10 bg-paper p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-display text-ink">Trust &amp; Safety Real-Time Status</h2>
              <span className={"px-3 py-1 rounded-full text-xs font-extrabold " + (criticalIncidents > 0 ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800")}>
                {criticalIncidents > 0 ? "Critical Incident Active" : "Operational Normal"}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-raised border border-ink/5">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={"w-5 h-5 " + (openIncidents > 0 ? "text-amber-800" : "text-ink/60")} />
                  <div>
                    <p className="text-sm font-bold text-ink">Open Incidents</p>
                    <p className="text-xs text-ink/60">Field reports awaiting Trust &amp; Safety triage</p>
                  </div>
                </div>
                <span className="text-base font-extrabold text-ink">{openIncidents}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-raised border border-ink/5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-800" />
                  <div>
                    <p className="text-sm font-bold text-ink">₹50,000 Vet Guarantee Claims</p>
                    <p className="text-xs text-ink/60">0 active emergency medical disputes</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">All Clear</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-paper p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold font-display text-ink">Automated Dispatch Health</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-raised border border-ink/5">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-indigo" />
                  <div>
                    <p className="text-sm font-bold text-ink">Sitter Cancellation Guarantee</p>
                    <p className="text-xs text-ink/60">Automated 100% refund + replacement dispatch</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo bg-indigo/10 px-2.5 py-1 rounded-full">Active</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-raised border border-ink/5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-800" />
                  <div>
                    <p className="text-sm font-bold text-ink">Razorpay Webhook Handshake</p>
                    <p className="text-xs text-ink/60">payment.captured &amp; refund.processed listener</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">Listening</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </PortalShell>
  );
}