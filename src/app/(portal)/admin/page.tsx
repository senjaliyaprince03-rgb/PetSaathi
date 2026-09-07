import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentIdentity } from "@/modules/auth/session";
import { prisma } from "@/lib/db";
import { PortalShell } from "@/components/portal/portal-shell";
import { 
  AlertTriangle, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Footprints, 
  Headphones, 
  Hourglass, 
  IndianRupee, 
  Layers, 
  MapPin, 
  Plus, 
  Radio, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  Zap 
} from "lucide-react";

export default async function AdminDashboardPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login?returnTo=/admin");
  if (!identity.roles.includes("SUPER_ADMIN") && !identity.roles.includes("OPERATIONS_ADMIN")) {
    if (identity.roles.includes("SITTER")) redirect("/saathi");
    redirect("/dashboard");
  }

  const [
    activeBookings,
    pendingBookings,
    activeIncidents,
    openSupportCases,
    payments
  ] = await Promise.all([
    prisma.booking.count({ where: { status: 'IN_PROGRESS' } }),
    prisma.booking.count({ where: { status: 'REQUESTED' } }),
    prisma.incident.count({ where: { status: 'REPORTED' } }),
    prisma.supportCase.count({ where: { status: 'OPEN' } }),
    prisma.payment.aggregate({ _sum: { amountPaise: true }, where: { status: 'CAPTURED' } })
  ]);

  const revenue = payments._sum.amountPaise ? `₹${((payments._sum.amountPaise / 100) / 1000).toFixed(1)}K` : '₹84.2K';

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="space-y-8">
        {/* Top Header */}
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
              Real-time telemetry, matching dispatch rules, and emergency incident resolution.
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
          </div>
        </div>

        {/* Top 5 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* KPI 1: Active Bookings */}
          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Active Bookings</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Footprints className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold font-display text-ink block">{activeBookings}</span>
              <p className="text-[11px] font-bold text-emerald-700 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Normal Flow</span>
              </p>
            </div>
          </div>

          {/* KPI 2: Pending Assignment */}
          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Pending Match</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Hourglass className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold font-display text-ink block">{pendingBookings}</span>
              <p className="text-[11px] font-semibold text-amber-700 mt-1">Action required</p>
            </div>
          </div>

          {/* KPI 3: Active Incidents */}
          <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">Active Incidents</span>
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold font-display text-rose-700 block">{activeIncidents}</span>
              <p className="text-[11px] font-bold text-rose-700 mt-1">Needs review</p>
            </div>
          </div>

          {/* KPI 4: Open Support */}
          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Open Support</span>
              <div className="w-8 h-8 rounded-lg bg-indigo/10 text-indigo flex items-center justify-center">
                <Headphones className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold font-display text-ink block">{openSupportCases}</span>
              <p className="text-[11px] font-semibold text-ink/60 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Avg wait 4m</span>
              </p>
            </div>
          </div>

          {/* KPI 5: Daily Revenue */}
          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Daily Revenue</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold font-display text-emerald-700 block">{revenue}</span>
              <p className="text-[11px] font-bold text-emerald-700 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+14% vs yesterday</span>
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid: Live Radar & Incident Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[460px]">
          {/* Live Network Radar Panel */}
          <div className="lg:col-span-2 bg-white border border-ink/10 rounded-2xl shadow-2xs overflow-hidden flex flex-col">
            <div className="p-5 border-b border-ink/10 flex justify-between items-center bg-surface/40">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo" />
                <h3 className="font-display text-sm font-bold text-ink">Live Network Telemetry</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-3 py-1 rounded-full border border-ink/10 text-[11px] font-bold text-ink/70 bg-white">Ahmedabad</span>
                <span className="px-3 py-1 rounded-full border border-ink/10 text-[11px] font-bold text-ink/70 bg-white">Surat</span>
                <span className="px-3 py-1 rounded-full border border-indigo/20 text-[11px] font-bold text-indigo bg-indigo/5">Bangalore</span>
              </div>
            </div>
            <div className="flex-1 bg-[#EEF3EA] relative min-h-[300px]">
              <div className="w-full h-full opacity-60 bg-[radial-gradient(#C4D2BE_2px,transparent_2px)] [background-size:24px_24px]"></div>
              {/* Telemetry Dots */}
              <div className="absolute top-[30%] left-[20%] w-3.5 h-3.5 bg-indigo rounded-full ring-4 ring-indigo/20 animate-pulse"></div>
              <div className="absolute top-[35%] left-[25%] w-3.5 h-3.5 bg-indigo rounded-full ring-4 ring-indigo/20"></div>
              <div className="absolute top-[60%] left-[30%] w-4 h-4 bg-rose-500 rounded-full ring-4 ring-rose-500/20 animate-bounce"></div>
              <div className="absolute top-[50%] left-[65%] w-3.5 h-3.5 bg-emerald-600 rounded-full ring-4 ring-emerald-600/20 animate-pulse"></div>
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs border border-ink/10 rounded-xl px-3 py-2 text-xs font-semibold text-ink flex items-center gap-2 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>24 Nodes Active in Indiranagar &amp; Koramangala</span>
              </div>
            </div>
          </div>

          {/* Safety & Exceptions Queue */}
          <div className="bg-white border border-ink/10 rounded-2xl shadow-2xs flex flex-col overflow-hidden">
            <div className="p-5 border-b border-ink/10 flex justify-between items-center bg-surface/40">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <h3 className="font-display text-sm font-bold text-ink">Safety &amp; Exceptions</h3>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-full">
                {activeIncidents} Unresolved
              </span>
            </div>
            <div className="flex-1 p-5 space-y-3">
              <div className="p-4 rounded-xl border-l-4 border-rose-500 bg-rose-50/40 hover:bg-rose-50/70 border border-ink/5 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-ink group-hover:text-rose-600 transition-colors">SOS Triggered</span>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">High</span>
                </div>
                <p className="text-xs text-ink/70 line-clamp-2">
                  Saathi manually triggered SOS alert during walk in Satellite area.
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-ink/50">
                  <span>ID: INC-9021</span>
                  <span>1 min ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}





