import { ArrowDownRight, ArrowUpRight, Gift, History, Sparkles, WalletCards } from "lucide-react";
import { redirect } from "next/navigation";

import { DashboardEmptyState, DashboardHeading, DashboardPanel, MetricCard, ProgressRing } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { getLoyaltySummary } from "@/modules/loyalty/rewards";

export const dynamic = "force-dynamic";

export default async function CustomerLoyaltyPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["CUSTOMER"])) redirect("/login?returnTo=/customer/loyalty");

  const [summary, ledger] = await Promise.all([
    getLoyaltySummary(identity.id),
    prisma.loyaltyLedger.findMany({ where: { userId: identity.id }, orderBy: { createdAt: "desc" }, take: 20 }),
  ]);
  const availableRatio = summary.totalEarned > 0 ? Math.round((summary.balancePaise / summary.totalEarned) * 100) : 0;

  return (
    <PortalShell mode="customer" displayName={identity.displayName} showSummaryCards={false}>
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <DashboardPanel tone="dark" className="relative min-h-[19rem] overflow-hidden p-7 sm:p-8">
          <div className="absolute inset-0 luxury-grid opacity-20" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-coral/20 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between gap-5"><div><p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-saffron">PetSaathi care credits</p><p className="mt-5 text-sm text-paper/45">Available balance</p><h2 className="mt-1 font-display text-5xl font-semibold tracking-[-0.05em] sm:text-6xl">{money(summary.balancePaise)}</h2></div><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-paper/10 text-saffron"><WalletCards className="h-5 w-5" /></span></div>
            <div className="mt-8 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-paper/10 bg-paper/[0.06] p-4"><p className="text-[0.56rem] font-bold uppercase tracking-[0.16em] text-paper/35">Lifetime earned</p><p className="mt-2 font-display text-2xl font-semibold">{money(summary.totalEarned)}</p></div><div className="rounded-2xl border border-paper/10 bg-paper/[0.06] p-4"><p className="text-[0.56rem] font-bold uppercase tracking-[0.16em] text-paper/35">Redeemed</p><p className="mt-2 font-display text-2xl font-semibold">{money(summary.totalSpent)}</p></div></div>
          </div>
        </DashboardPanel>

        <DashboardPanel tone="lavender" className="flex items-center p-7 sm:p-8">
          <div><p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-coral">Reward clarity</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">Nothing provisional. Nothing hidden.</h2><p className="mt-3 text-sm leading-6 text-ink/50">Eligible credits appear only after the qualifying service or referral is complete. Every movement remains in the ledger.</p><div className="mt-7 rounded-[1.5rem] bg-[#281d2b] p-5 text-paper"><ProgressRing value={availableRatio} label="Credits still available" detail={summary.totalEarned ? `${availableRatio}% of all earned credits remain ready to use.` : "Your first eligible reward will appear here automatically."} /></div></div>
        </DashboardPanel>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <MetricCard icon={Sparkles} label="Earned" value={money(summary.totalEarned)} hint="Verified lifetime credit" tone="leaf" />
        <MetricCard icon={Gift} label="Available" value={money(summary.balancePaise)} hint="Ready for eligible redemption" />
        <MetricCard icon={ArrowDownRight} label="Redeemed" value={money(summary.totalSpent)} hint="Used credit history" tone="coral" />
      </div>

      <DashboardPanel className="mt-5">
        <DashboardHeading eyebrow="Transparent ledger" title="Every reward movement, explained." description="Credits and redemptions are ordered by date with the resulting balance visible after every entry." />
        {ledger.length ? (
          <div className="mt-7 overflow-hidden rounded-[1.75rem] border border-ink/[0.07]">
            <ul className="divide-y divide-ink/[0.07]">
              {ledger.map((entry) => {
                const positive = entry.delta > 0;
                return (
                  <li key={entry.id} className="flex flex-col justify-between gap-4 bg-paper p-5 transition hover:bg-cream/35 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${positive ? "bg-leaf/10 text-leaf" : "bg-coral/10 text-coral"}`}>{positive ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}</span><div><p className="font-bold">{entry.reason}</p><p className="mt-1 text-xs text-ink/40">{entry.createdAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p></div></div>
                    <div className="pl-15 sm:pl-0 sm:text-right"><p className={`font-display text-2xl font-semibold ${positive ? "text-leaf" : "text-coral"}`}>{positive ? "+" : "−"}{money(Math.abs(entry.delta))}</p><p className="mt-1 text-xs text-ink/40">Balance {money(entry.balanceAfter)}</p></div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : <div className="mt-7"><DashboardEmptyState icon={History} title="No credit history yet." description="Eligible services, memberships and referrals will add verified entries to this ledger automatically." /></div>}
      </DashboardPanel>
    </PortalShell>
  );
}

function money(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}
