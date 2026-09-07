import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  BellRing, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  FileLock2, 
  KeyRound, 
  Lock, 
  Mail, 
  MapPin, 
  Phone, 
  Shield, 
  ShieldCheck, 
  User 
} from "lucide-react";

import { DashboardHeading, DashboardPanel, MetricCard } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings & Privacy Preferences",
  description: "Manage your profile, society address, communication channels, security credentials, and data rights."
};

export const dynamic = "force-dynamic";

export default async function SettingsRootPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login?returnTo=/settings");

  const [user, openPrivacyRequests] = await Promise.all([
    prisma.user.findUnique({
      where: { id: identity.id },
      include: {
        pets: { where: { active: true }, select: { id: true, name: true } },
        communicationPreferences: true,
      }
    }),
    prisma.accountRequest.count({
      where: { userId: identity.id, status: { notIn: ["FULFILLED", "CANCELLED", "REJECTED"] } }
    })
  ]);

  const mode = identity.roles.includes("SITTER") && !identity.roles.includes("CUSTOMER") ? "saathi" : "customer";

  return (
    <PortalShell mode={mode} displayName={identity.displayName} showSummaryCards={false}>
      <div className="space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo bg-indigo/10 px-2.5 py-0.5 rounded-full">
                Account & Security
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Parent Account
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-ink tracking-tight">
              Account Settings & Preferences
            </h1>
            <p className="text-sm text-ink/70 mt-1">
              Manage your personal details, verified society address, communication channels, and data privacy controls.
            </p>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard 
            icon={User} 
            label="Account Status" 
            value="Active & Verified" 
            hint="Full access to doorstep care network" 
            tone="leaf" 
          />
          <MetricCard 
            icon={BellRing} 
            label="Communication" 
            value="In-App & Email" 
            hint="Instant booking and GPS status alerts" 
            tone="coral" 
          />
          <MetricCard 
            icon={FileLock2} 
            label="Privacy Requests" 
            value={`${openPrivacyRequests} Pending`} 
            hint="Audit trail & account rights" 
          />
        </div>

        {/* Profile Card & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Profile Info (Span 7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-ink/10 shadow-[0px_4px_20px_rgba(48,31,48,0.03)] space-y-6">
            <div>
              <h2 className="text-lg font-bold font-display text-ink">Personal Profile</h2>
              <p className="text-xs text-ink/70 mt-0.5">Primary identity associated with your bookings and pet passports.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-surface/70 border border-ink/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo/10 text-indigo flex items-center justify-center font-bold">
                    {identity.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs text-ink/50 block font-medium">Full Name</span>
                    <span className="text-sm font-bold text-ink">{identity.displayName}</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                  Verified
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-surface/70 border border-ink/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo/10 text-indigo flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-ink/50 block font-medium">Email Address</span>
                    <a href={`mailto:${user?.email || "customer@petsaathi.com"}`} className="text-sm font-bold text-ink hover:text-indigo hover:underline transition-colors">
                      {user?.email || "customer@petsaathi.com"}
                    </a>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                  Confirmed
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-surface/70 border border-ink/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-leaf/10 text-leaf flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-ink/50 block font-medium">Phone Number</span>
                    <a href="tel:+919876500000" className="text-sm font-bold text-ink hover:text-leaf hover:underline transition-colors">
                      +91 98765 00000
                    </a>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                  SMS Verified
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-surface/70 border border-ink/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-ink/50 block font-medium">Society Care Hub</span>
                    <span className="text-sm font-bold text-ink">Indiranagar Society Care Hub • Bengaluru</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-indigo bg-indigo/10 px-2.5 py-0.5 rounded-full border border-indigo/20">
                  Assigned Hub
                </span>
              </div>
            </div>
          </div>

          {/* Quick Setting Navigation Links (Span 5) */}
          <div className="lg:col-span-5 space-y-4">
            <Link
              href="/settings/notifications"
              className="group block p-5 rounded-3xl bg-white border border-ink/10 hover:border-indigo/40 shadow-[0px_4px_20px_rgba(48,31,48,0.03)] hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-indigo/10 text-indigo flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BellRing className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink group-hover:text-indigo transition-colors">
                      Notification Preferences
                    </h3>
                    <p className="text-xs text-ink/70 mt-0.5">
                      Configure WhatsApp, Email &amp; Push alerts for walks.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-ink/40 group-hover:text-indigo group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              href="/settings/privacy"
              className="group block p-5 rounded-3xl bg-white border border-ink/10 hover:border-coral/40 shadow-[0px_4px_20px_rgba(48,31,48,0.03)] hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-coral/10 text-coral flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileLock2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink group-hover:text-coral transition-colors">
                      Privacy &amp; Data Rights
                    </h3>
                    <p className="text-xs text-ink/70 mt-0.5">
                      Request data export, review audit logs, or account updates.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-ink/40 group-hover:text-coral group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              href="/safety"
              className="group block p-5 rounded-3xl bg-white border border-ink/10 hover:border-emerald-500/40 shadow-[0px_4px_20px_rgba(48,31,48,0.03)] hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink group-hover:text-emerald-700 transition-colors">
                      Trust &amp; Safety Protocols
                    </h3>
                    <p className="text-xs text-ink/70 mt-0.5">
                      ₹50,000 Vet Cover, sitter background checks, &amp; SOS.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-ink/40 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </div>

        </div>

      </div>
    </PortalShell>
  );
}
