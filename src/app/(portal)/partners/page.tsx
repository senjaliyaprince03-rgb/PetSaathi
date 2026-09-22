import { Building2, Users, WalletCards, ShieldCheck, Activity, ChevronRight, FileText } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

import { PortalShell } from "@/components/portal/portal-shell";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function PartnerDashboardPage() {
  const identity = await getCurrentIdentity();
  
  // Only allow PARTNER_MANAGER or SUPER_ADMIN
  if (!identity || !hasAnyRole(identity, ["PARTNER_MANAGER", "SUPER_ADMIN"])) {
    return redirect("/login?returnTo=/partners");
  }

  // Mock data for B2B portal based on spec: "Corporate accounts allowing employers to provide pet wellness stipends"
  const employeeCount = 142;
  const utilizedWallets = 89;
  const currentStipendTotal = 450000;
  const amountUsedThisMonth = 124500;

  return (
    <PortalShell mode="partner" displayName={identity.displayName} showGreeting={true}>
      <div className="space-y-6 max-w-6xl">
        
        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-[24px] p-6 border border-ink/10 shadow-[0px_4px_16px_rgba(48,31,48,0.03)] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo/10 flex items-center justify-center text-indigo">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Active Roster
              </span>
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-ink">{employeeCount}</p>
              <p className="text-xs text-ink/70 mt-1">Enrolled remote/hybrid employees</p>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-ink/10 shadow-[0px_4px_16px_rgba(48,31,48,0.03)] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center text-coral">
                <WalletCards className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo bg-indigo/5 px-2.5 py-1 rounded-full">
                Wellness Stipend
              </span>
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-ink">₹{(currentStipendTotal / 1000).toFixed(1)}k</p>
              <p className="text-xs text-ink/70 mt-1">Monthly allocated budget</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#27152B] to-[#3C2240] rounded-[24px] p-6 border border-white/10 shadow-[0px_8px_24px_rgba(39,21,43,0.15)] flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-coral/20 blur-xl rounded-full"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-3xl font-display font-bold text-white">{Math.round((utilizedWallets / employeeCount) * 100)}%</p>
              <p className="text-xs text-white/80 mt-1">Wallet Utilization Rate</p>
              <div className="w-full bg-white/10 rounded-full h-1.5 mt-3">
                <div className="bg-coral h-1.5 rounded-full" style={{ width: `${(utilizedWallets / employeeCount) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Benefit Programs & Wallets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-[24px] border border-ink/10 shadow-[0px_4px_16px_rgba(48,31,48,0.03)] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-indigo/5 flex items-center justify-center text-indigo">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-ink">Benefit Programs</h2>
                <p className="text-xs text-ink/70 mt-0.5">Manage corporate stipends for remote employees</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-ink/10 flex justify-between items-center hover:border-indigo/30 transition-colors cursor-pointer group">
                <div>
                  <h3 className="font-bold text-sm text-ink group-hover:text-indigo transition-colors">Standard Pet Wellness</h3>
                  <p className="text-xs text-ink/70 mt-1">₹3,000/mo allowance • Grooming & Sitting</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">112 Enrolled</span>
                  <ChevronRight className="w-4 h-4 text-ink/40 group-hover:text-indigo" />
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-ink/10 flex justify-between items-center hover:border-indigo/30 transition-colors cursor-pointer group">
                <div>
                  <h3 className="font-bold text-sm text-ink group-hover:text-indigo transition-colors">Executive Care Pack</h3>
                  <p className="text-xs text-ink/70 mt-1">₹8,000/mo allowance • Full coverage + Vet</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">30 Enrolled</span>
                  <ChevronRight className="w-4 h-4 text-ink/40 group-hover:text-indigo" />
                </div>
              </div>
            </div>

            <button className="mt-6 w-full py-3 bg-white border-2 border-dashed border-ink/20 hover:border-indigo/40 hover:bg-indigo/5 text-indigo font-bold text-sm rounded-xl transition-all">
              + Create New Benefit Tier
            </button>
          </div>

          <div className="bg-white rounded-[24px] border border-ink/10 shadow-[0px_4px_16px_rgba(48,31,48,0.03)] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-ink">Recent Wallet Activity</h2>
                <p className="text-xs text-ink/70 mt-0.5">Corporate-sponsored grooming & sitting bookings</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { name: "Rahul S.", type: "Dog Walking Pack", amount: 2400, date: "Today, 10:42 AM" },
                { name: "Priya M.", type: "At-Home Grooming", amount: 1200, date: "Yesterday, 04:15 PM" },
                { name: "Arjun K.", type: "Vet Teleconsult", amount: 800, date: "Oct 12, 09:30 AM" },
                { name: "Sneha V.", type: "Pet Sitting (Day)", amount: 1500, date: "Oct 11, 11:20 AM" }
              ].map((tx, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-ink/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-ink/5 flex items-center justify-center text-xs font-bold text-ink/60">
                      {tx.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink">{tx.name}</p>
                      <p className="text-[10px] text-ink/60 mt-0.5">{tx.type} • {tx.date}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-ink">-₹{tx.amount}</span>
                </div>
              ))}
            </div>

            <Link href={"/partners/wallets" as any} className="mt-6 flex justify-center items-center gap-1.5 w-full py-3 bg-surface hover:bg-ink/5 text-ink text-xs font-bold rounded-xl transition-all">
              <FileText className="w-3.5 h-3.5" />
              <span>Download Monthly Invoice</span>
            </Link>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
