"use client";

import Link from "next/link";
import { useState } from "react";
import { PortalShell } from "@/components/portal/portal-shell";
import { 
  ArrowRight, 
  CalendarDays, 
  CheckCircle2, 
  Clock, 
  GraduationCap, 
  IndianRupee, 
  Layers, 
  ListChecks, 
  TrendingUp, 
  WalletCards, 
  Wifi, 
  WifiOff, 
  Zap 
} from "lucide-react";

export default function SaathiDashboardClient({ 
  displayName,
  firstName, 
  completedCount, 
  upcomingCount 
}: { 
  displayName: string;
  firstName: string; 
  initialChar: string; 
  completedCount: number; 
  upcomingCount: number; 
}) {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <PortalShell mode="saathi" displayName={displayName}>
      <div className="space-y-8 relative">
        {/* Offline Overlay */}
        {!isOnline && (
          <div className="absolute inset-0 z-30 bg-[#FAF6F1]/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 min-h-[400px]">
            <div className="bg-white p-8 rounded-2xl border border-ink/10 shadow-lg max-w-md w-full text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-5 text-ink/40">
                <WifiOff className="w-8 h-8" />
              </div>
              <h2 className="font-display text-xl font-bold text-ink mb-2">You&apos;re currently offline</h2>
              <p className="text-xs text-ink/70 mb-6 leading-relaxed">
                Go online to receive new assigned visits, route updates, and client messages in your neighborhood.
              </p>
              <button 
                onClick={() => setIsOnline(true)}
                className="w-full bg-[#E16649] hover:bg-[#d05538] text-white py-3 px-6 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Wifi className="w-4 h-4" />
                <span>Go Online &amp; Accept Jobs</span>
              </button>
            </div>
          </div>
        )}

        {/* Top Header & Mission Control Status Banner */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="inline-flex items-center gap-1.5 bg-indigo/5 text-indigo border border-indigo/15 text-[11px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                  <Zap className="w-3.5 h-3.5 text-indigo fill-indigo" />
                  Saathi Mission Control
                </span>
                <button
                  onClick={() => setIsOnline(!isOnline)}
                  className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1 rounded-full border shadow-2xs transition-colors ${
                    isOnline 
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200/60" 
                      : "bg-surface text-ink/60 border-ink/10"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-600 animate-pulse" : "bg-ink/40"}`}></span>
                  {isOnline ? "Online • Dispatch Ready" : "Offline"}
                </button>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-ink tracking-tight">
                Mission Control
              </h1>
              <p className="text-sm text-ink/75 mt-1 font-normal leading-relaxed">
                Daily care rhythm, verified route cards, and automated weekly settlements.
              </p>
            </div>

            <Link
              href="/saathi/assignments"
              className="inline-flex items-center justify-center gap-2 bg-[#E16649] hover:bg-[#d05538] text-white text-sm font-extrabold px-5 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(225,102,73,0.35)] hover:shadow-[0_6px_20px_rgba(225,102,73,0.45)] hover:-translate-y-0.5 transition-all self-start sm:self-auto"
            >
              <ListChecks className="w-4 h-4 text-white" />
              <span>Assignments Queue</span>
            </Link>
          </div>

          {/* Catchup Status Card */}
          <div className="bg-white border border-ink/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-ink">You&apos;re all caught up, {firstName}.</h2>
                <p className="text-xs text-ink/70 mt-1 flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-indigo" />
                  Next assignment in <strong className="text-indigo font-bold">45 minutes</strong>
                </p>
              </div>
            </div>
            <Link 
              href="/saathi/availability" 
              className="relative z-10 px-4 py-2 rounded-xl border border-ink/10 text-ink hover:text-indigo hover:border-indigo/30 bg-surface/50 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <span>View Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Bento Grid: Stats & Performance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Today's Earnings */}
          <div className="bg-white border border-ink/10 rounded-2xl p-5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Today&apos;s Earnings</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold font-display text-ink block">₹1,850</span>
              <p className="text-[11px] font-bold text-emerald-700 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12% from avg</span>
              </p>
            </div>
          </div>

          {/* Card 2: Completed Jobs */}
          <div className="bg-white border border-ink/10 rounded-2xl p-5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Completed</span>
              <div className="w-8 h-8 rounded-lg bg-indigo/10 text-indigo flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold font-display text-ink block">{completedCount}</span>
              <p className="text-[11px] font-semibold text-ink/60 mt-1">Jobs finished</p>
            </div>
          </div>

          {/* Card 3: Upcoming Queue */}
          <div className="bg-white border border-ink/10 rounded-2xl p-5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Upcoming</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold font-display text-ink block">{upcomingCount}</span>
              <p className="text-[11px] font-semibold text-ink/60 mt-1">In queue</p>
            </div>
          </div>

          {/* Card 4: Trust & Quality Score */}
          <div className="bg-gradient-to-br from-[#2D1A3B] to-[#1E1129] text-white rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-200">Trust &amp; Quality</span>
                <span className="text-[10px] bg-white/10 text-purple-200 px-2 py-0.5 rounded-full font-bold">Top 5%</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold font-display text-white">99.2</span>
                <span className="text-sm font-bold text-purple-200">%</span>
              </div>
            </div>
            <p className="text-[11px] text-purple-200/80 mt-2 font-medium">Verified Caregiver Rating</p>
          </div>
        </div>

        {/* Quick Actions Ribbon */}
        <div>
          <h3 className="font-display text-base font-bold text-ink mb-4">Caregiver Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/saathi/assignments" 
              className="bg-white hover:bg-surface border border-ink/10 hover:border-indigo/30 rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 text-center shadow-2xs hover:shadow-xs transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo/5 text-indigo group-hover:scale-110 flex items-center justify-center transition-transform">
                <ListChecks className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-ink">View Assignments</span>
            </Link>

            <Link 
              href="/saathi/availability" 
              className="bg-white hover:bg-surface border border-ink/10 hover:border-indigo/30 rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 text-center shadow-2xs hover:shadow-xs transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo/5 text-indigo group-hover:scale-110 flex items-center justify-center transition-transform">
                <CalendarDays className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-ink">Update Availability</span>
            </Link>

            <Link 
              href="/saathi/earnings" 
              className="bg-white hover:bg-surface border border-ink/10 hover:border-indigo/30 rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 text-center shadow-2xs hover:shadow-xs transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo/5 text-indigo group-hover:scale-110 flex items-center justify-center transition-transform">
                <WalletCards className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-ink">View Wallet</span>
            </Link>

            <Link 
              href={"/saathi/academy" as any} 
              className="bg-white hover:bg-surface border border-ink/10 hover:border-indigo/30 rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 text-center shadow-2xs hover:shadow-xs transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 group-hover:scale-110 flex items-center justify-center transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-ink">Saathi Academy</span>
            </Link>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}

