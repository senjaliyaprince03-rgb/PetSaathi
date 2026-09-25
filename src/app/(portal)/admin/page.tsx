import Link from "next/link";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { getCurrentIdentity } from "@/modules/auth/session";
import { prisma } from "@/lib/db";
import { PortalShell } from "@/components/portal/portal-shell";
import { getDefaultDashboardForRoles } from "@/modules/auth/admin-access";
import { 
  ArrowRight,
  ArrowUpRight,
  Clock, 
  FileCheck2,
  FileLock2, 
  Footprints, 
  Headphones, 
  Hourglass, 
  KeyRound, 
  Layers, 
  MapPin, 
  Radio, 
  ShieldAlert, 
  ShieldCheck, 
  Sliders, 
  SlidersHorizontal,
  TrendingUp, 
  Users, 
  Zap 
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login?returnTo=/admin");

  // Route non-governance/non-operations admins to their dedicated dashboards
  if (!identity.roles.includes("SUPER_ADMIN") && !identity.roles.includes("OPERATIONS_ADMIN")) {
    redirect(getDefaultDashboardForRoles(identity.roles) as Route);
  }

  const isSuperAdmin = identity.roles.includes("SUPER_ADMIN");

  // If SUPER_ADMIN, render dedicated Platform Governance & Security Authority dashboard
  if (isSuperAdmin) {
    const [
      totalAdminRolesCount,
      activePermissionsCount,
      totalFlagsCount,
      enabledFlagsCount,
      totalAuditLogsCount,
      recentAuditLogs,
      openPrivacyRequestsCount,
      featureFlagsList,
    ] = await Promise.all([
      prisma.userRole.count().catch(() => 0),
      prisma.adminPermission.count({ where: { status: "ACTIVE" } }).catch(() => 0),
      prisma.featureFlag.count().catch(() => 0),
      prisma.featureFlag.count({ where: { enabled: true } }).catch(() => 0),
      prisma.auditLog.count().catch(() => 0),
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }).catch(() => []),
      prisma.accountRequest.count({
        where: { status: { notIn: ["FULFILLED", "REJECTED", "CANCELLED"] } },
      }).catch(() => 0),
      prisma.featureFlag.findMany({
        take: 6,
        orderBy: { key: "asc" },
      }).catch(() => []),
    ]);

    return (
      <PortalShell mode="admin" displayName={identity.displayName} roles={identity.roles}>
        <div className="space-y-8 max-w-7xl pb-16">
          {/* Super Admin Top Governance Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="inline-flex items-center gap-1.5 bg-indigo/5 text-indigo border border-indigo/15 text-[11px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                  <KeyRound className="w-3.5 h-3.5 text-indigo" />
                  Platform Governance &amp; Security Authority
                </span>
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Rank 100 Invariant Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-ink tracking-tight">
                Governance &amp; Security Control
              </h1>
              <p className="text-sm text-ink/75 mt-1 font-normal leading-relaxed max-w-3xl">
                Global platform configuration, role &amp; capability governance, server-side feature gates, and immutable audit inspection.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/rbac"
                className="inline-flex items-center justify-center gap-2 bg-[#E16649] hover:bg-[#d05538] text-white text-sm font-extrabold px-5 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(225,102,73,0.35)] hover:shadow-[0_6px_20px_rgba(225,102,73,0.45)] hover:-translate-y-0.5 transition-all"
              >
                <KeyRound className="w-4 h-4 text-white" />
                <span>RBAC Security Matrix</span>
              </Link>
            </div>
          </div>

          {/* Top 4 Governance & Security KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Role Assignments</span>
                <div className="w-8 h-8 rounded-lg bg-indigo/10 text-indigo flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <span className="text-3xl font-bold font-display text-ink block">{totalAdminRolesCount}</span>
              <p className="text-[11px] font-semibold text-indigo mt-1 flex items-center gap-1">
                <span>12 Canonical Roles Supported</span>
              </p>
            </div>

            <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Custom Capabilities</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
              </div>
              <span className="text-3xl font-bold font-display text-emerald-700 block">{activePermissionsCount}</span>
              <p className="text-[11px] font-semibold text-emerald-700 mt-1">Active AdminPermission Grants</p>
            </div>

            <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Feature Gates</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
              </div>
              <span className="text-3xl font-bold font-display text-ink block">
                {enabledFlagsCount} / {totalFlagsCount}
              </span>
              <p className="text-[11px] font-semibold text-amber-700 mt-1">Release Gates Enabled</p>
            </div>

            <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Audit Trail Integrity</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <FileLock2 className="w-4 h-4" />
                </div>
              </div>
              <span className="text-3xl font-bold font-display text-purple-700 block">{totalAuditLogsCount}</span>
              <p className="text-[11px] font-semibold text-purple-700 mt-1">Immutable Log Events</p>
            </div>
          </div>

          {/* Main Governance Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Governance Tiers & Audit Activity (Span 8) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Card 1: Four-Tier Authority Architecture */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-ink/10 shadow-2xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-ink/5">
                  <div>
                    <h2 className="text-lg font-bold font-display text-ink">Administrative Authority Hierarchy</h2>
                    <p className="text-xs text-ink/60 mt-0.5">Enforced Rank Invariant: Actors can only manage roles strictly lower than their own rank.</p>
                  </div>
                  <Link href="/admin/rbac" className="text-xs font-bold text-indigo hover:text-coral flex items-center gap-1 transition-colors">
                    <span>Manage RBAC</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-indigo/5 border border-indigo/15">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-extrabold text-indigo">Tier 1 • Governance</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo/10 text-indigo">Rank 100</span>
                    </div>
                    <h3 className="font-bold text-sm text-ink">SUPER_ADMIN</h3>
                    <p className="text-xs text-ink/60 mt-1">Platform authority, roles, security policies &amp; audit inspection.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface/80 border border-ink/10">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-extrabold text-ink/70">Tier 2 • Department Admins</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-ink/5 text-ink/70">Rank 60–70</span>
                    </div>
                    <h3 className="font-bold text-sm text-ink">Operations, Safety, Finance, Verification</h3>
                    <p className="text-xs text-ink/60 mt-1">Autonomous oversight for operations, incident triage, refunds &amp; KYC.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface/80 border border-ink/10">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-extrabold text-ink/70">Tier 3 • Territory Scoped</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-ink/5 text-ink/70">Rank 40–50</span>
                    </div>
                    <h3 className="font-bold text-sm text-ink">City Manager, Operator, Society Manager</h3>
                    <p className="text-xs text-ink/60 mt-1">Data queries bounded strictly to assigned cities, zones &amp; societies.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-extrabold text-emerald-800">Tier 4 • Care Participants</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Rank 10–20</span>
                    </div>
                    <h3 className="font-bold text-sm text-ink">Sitter &amp; Customer</h3>
                    <p className="text-xs text-emerald-800/80 mt-1">Access restricted strictly to owned pets or assigned visits.</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Recent Security Audit Logs Feed */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-ink/10 shadow-2xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-ink/5">
                  <div className="flex items-center gap-2">
                    <FileLock2 className="w-4 h-4 text-purple-700" />
                    <h2 className="text-lg font-bold font-display text-ink">Recent Security Audit Events</h2>
                  </div>
                  <Link href="/admin/rbac" className="text-xs font-bold text-indigo hover:text-coral flex items-center gap-1 transition-colors">
                    <span>Full Audit Trail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {recentAuditLogs.length > 0 ? (
                  <div className="space-y-2.5">
                    {recentAuditLogs.map((log) => (
                      <div key={log.id} className="p-3.5 rounded-xl bg-surface/70 border border-ink/5 flex items-center justify-between text-xs">
                        <div className="min-w-0 flex-1 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-ink truncate">{log.action}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                              {log.resourceType}
                            </span>
                          </div>
                          <p className="text-[11px] text-ink/60 mt-0.5 truncate font-mono">
                            Actor: {log.actorId ? `${log.actorId.substring(0, 12)}...` : "system"} • Target: {log.resourceId}
                          </p>
                        </div>
                        <time className="text-[11px] text-ink/50 whitespace-nowrap font-medium">
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </time>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-ink/50 py-4 text-center italic">No security events recorded yet.</p>
                )}
              </div>
            </div>

            {/* Right Column: Feature Gates, Privacy & Actions (Span 4) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Feature Flags Status Panel */}
              <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-2xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-ink/5">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-600" />
                    <h3 className="font-bold text-sm text-ink">Feature Release Gates</h3>
                  </div>
                  <Link href="/admin/features" className="text-xs font-bold text-indigo hover:text-coral transition-colors">
                    Manage
                  </Link>
                </div>

                <div className="space-y-2">
                  {featureFlagsList.slice(0, 5).map((flag) => (
                    <div key={flag.key} className="flex items-center justify-between p-2.5 rounded-xl bg-surface/70 border border-ink/5 text-xs">
                      <span className="font-medium text-ink truncate max-w-[170px]">{flag.key.replaceAll("_", " ")}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        flag.enabled ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-ink/5 text-ink/50"
                      }`}>
                        {flag.enabled ? "ACTIVE" : "OFF"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Compliance Queue Panel */}
              <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-2xs">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-ink/5">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-coral" />
                    <h3 className="font-bold text-sm text-ink">Data Privacy Compliance</h3>
                  </div>
                  <Link href="/admin/privacy" className="text-xs font-bold text-indigo hover:text-coral transition-colors">
                    Review
                  </Link>
                </div>
                <div className="p-4 rounded-2xl bg-surface/80 border border-ink/5 text-center">
                  <span className="text-2xl font-bold font-display text-ink block">{openPrivacyRequestsCount}</span>
                  <p className="text-xs text-ink/60 mt-1 font-medium">Pending DSR / Data Rights Requests</p>
                  <Link
                    href="/admin/privacy"
                    className="mt-3 inline-block w-full py-2 bg-indigo/5 hover:bg-indigo/10 text-indigo text-xs font-bold rounded-xl transition-colors"
                  >
                    Open Privacy Queue →
                  </Link>
                </div>
              </div>

              {/* Quick Governance Links */}
              <div className="bg-gradient-to-br from-indigo to-[#2A1540] text-white rounded-3xl p-6 shadow-md space-y-4">
                <h3 className="font-bold text-sm text-white">Platform Governance Quick Links</h3>
                <div className="space-y-2 text-xs">
                  <Link href="/admin/rbac" className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors">
                    <span>Role Assignment &amp; Grants</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="/admin/features" className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors">
                    <span>Feature Flag Toggles</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="/admin/privacy" className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors">
                    <span>User Privacy Requests</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PortalShell>
    );
  }

  // If OPERATIONS_ADMIN (and not Super Admin), render Operations Command Dashboard
  const [
    activeBookings,
    pendingBookings,
    activeIncidents,
    openSupportCases,
  ] = await Promise.all([
    prisma.booking.count({ where: { status: "IN_PROGRESS" } }).catch(() => 0),
    prisma.booking.count({ where: { status: "REQUESTED" } }).catch(() => 0),
    prisma.incident.count({ where: { status: "REPORTED" } }).catch(() => 0),
    prisma.supportCase.count({ where: { status: "OPEN" } }).catch(() => 0),
  ]);

  return (
    <PortalShell mode="admin" displayName={identity.displayName} roles={identity.roles}>
      <div className="space-y-8 max-w-7xl pb-16">
        {/* Top Operations Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-indigo/5 text-indigo border border-indigo/15 text-[11px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                <Radio className="w-3.5 h-3.5 text-indigo animate-pulse" />
                Network Operations Control
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                System Normal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-ink tracking-tight">
              Operations Command
            </h1>
            <p className="text-sm text-ink/75 mt-1 font-normal leading-relaxed">
              Real-time care session telemetry, matching dispatch rules, and operational service flow.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/matching"
              className="inline-flex items-center justify-center gap-2 bg-[#E16649] hover:bg-[#d05538] text-white text-sm font-extrabold px-5 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(225,102,73,0.35)] hover:shadow-[0_6px_20px_rgba(225,102,73,0.45)] hover:-translate-y-0.5 transition-all"
            >
              <Zap className="w-4 h-4 text-white" />
              <span>Matching Engine</span>
            </Link>
            <Link
              href="/admin/operations"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-surface border border-ink/10 text-ink text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-2xs"
            >
              <Clock className="w-4 h-4 text-indigo" />
              <span>Live Monitor</span>
            </Link>
          </div>
        </div>

        {/* Top 4 Operations KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Active Bookings</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Footprints className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-bold font-display text-ink block">{activeBookings}</span>
              <p className="text-[11px] font-bold text-emerald-700 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Active in Field</span>
              </p>
            </div>
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Pending Match</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Hourglass className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-bold font-display text-ink block">{pendingBookings}</span>
              <p className="text-[11px] font-semibold text-amber-700 mt-1">Requires Saathi Assignment</p>
            </div>
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Active Incidents</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-bold font-display text-rose-700 block">{activeIncidents}</span>
              <p className="text-[11px] font-semibold text-rose-700 mt-1">Under Safety Investigation</p>
            </div>
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Open Support Cases</span>
              <div className="w-8 h-8 rounded-lg bg-indigo/10 text-indigo flex items-center justify-center">
                <Headphones className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-bold font-display text-ink block">{openSupportCases}</span>
              <p className="text-[11px] font-semibold text-ink/60 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Avg Response: 4m</span>
              </p>
            </div>
          </div>
        </div>

        {/* Live Network Radar Panel */}
        <div className="bg-white border border-ink/10 rounded-3xl shadow-2xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-ink/10 flex justify-between items-center bg-surface/40">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo" />
              <h3 className="font-display text-base font-bold text-ink">Live Network Telemetry</h3>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-3 py-1 rounded-full border border-ink/10 text-[11px] font-bold text-ink/70 bg-white">Ahmedabad</span>
              <span className="px-3 py-1 rounded-full border border-ink/10 text-[11px] font-bold text-ink/70 bg-white">Surat</span>
              <span className="px-3 py-1 rounded-full border border-indigo/20 text-[11px] font-bold text-indigo bg-indigo/5">Bangalore</span>
            </div>
          </div>
          <div className="flex-1 bg-[#EEF3EA] relative min-h-[340px]">
            <div className="w-full h-full opacity-60 bg-[radial-gradient(#C4D2BE_2px,transparent_2px)] [background-size:24px_24px]"></div>
            <div className="absolute top-[30%] left-[20%] w-3.5 h-3.5 bg-indigo rounded-full ring-4 ring-indigo/20 animate-pulse"></div>
            <div className="absolute top-[35%] left-[25%] w-3.5 h-3.5 bg-indigo rounded-full ring-4 ring-indigo/20"></div>
            <div className="absolute top-[60%] left-[30%] w-4 h-4 bg-rose-500 rounded-full ring-4 ring-rose-500/20 animate-bounce"></div>
            <div className="absolute top-[50%] left-[65%] w-3.5 h-3.5 bg-emerald-600 rounded-full ring-4 ring-emerald-600/20 animate-pulse"></div>
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xs border border-ink/10 rounded-2xl px-4 py-2.5 text-xs font-semibold text-ink flex items-center gap-2 shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Active Nodes in Bangalore (Indiranagar &amp; Koramangala)</span>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
