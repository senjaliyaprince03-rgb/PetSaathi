import { ArrowDownLeft, ArrowUpRight, BadgeCheck, Building2, History, ShieldCheck, WalletCards } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

import { DashboardEmptyState, DashboardHeading, DashboardPanel, MetricCard, StatusPill } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export default async function ServiceWalletPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/customer/wallet");

  const memberships = await prisma.programmeMembership.findMany({
    where: { customerId: identity.id, active: true },
    orderBy: { createdAt: "desc" },
    include: { programme: { select: { name: true, programmeType: true, status: true } }, wallet: { include: { entries: { orderBy: { createdAt: "desc" }, take: 30 } } } },
  });
  const wallets = memberships.flatMap((membership) => membership.wallet ? [{ membership, wallet: membership.wallet }] : []);
  const balancePaise = wallets.reduce((sum, { wallet }) => sum + (wallet.entries[0]?.balanceAfter ?? 0), 0);
  const entries = wallets.flatMap(({ membership, wallet }) => wallet.entries.map((entry) => ({ ...entry, programmeName: membership.programme.name, currency: wallet.currency }))).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <PortalShell mode="customer" displayName={identity.displayName} showSummaryCards={false}>
      <div className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <DashboardPanel tone="dark" className="relative min-h-[24rem] overflow-hidden p-7 sm:p-8">
          <Image src="/images/care-protocol-constellation.png" alt="Protected PetSaathi service credits" fill sizes="(min-width: 1280px) 40vw, 100vw" className="object-cover opacity-35" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#281d2b]/10 via-[#281d2b]/55 to-[#281d2b]" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-coral/20 blur-3xl" />
          <div className="relative flex h-full min-h-[20rem] flex-col justify-between"><div className="flex items-start justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-paper/10 text-saffron"><WalletCards className="h-5 w-5" /></span><StatusPill status={wallets.length ? "ACTIVE" : "NOT ACTIVE"} className="bg-paper/10 text-paper" /></div><div><p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-paper/45">Verified service credits</p><h2 className="mt-3 font-display text-5xl font-semibold tracking-[-0.05em] sm:text-6xl">{money(balancePaise)}</h2><p className="mt-3 max-w-md text-sm leading-6 text-paper/60">Available across active employer, society or partner programmes.</p><div className="mt-5 flex items-center gap-2 text-xs text-paper/45"><ShieldCheck className="h-4 w-4 text-saffron" />Eligibility and price checks still apply at redemption.</div></div></div>
        </DashboardPanel>

        <DashboardPanel tone="lavender">
          <DashboardHeading eyebrow="Active memberships" title="Benefits with clear provenance." description="Each wallet is tied to a verified programme so you always know where a credit came from." />
          {wallets.length ? <div className="mt-6 grid gap-3">{wallets.map(({ membership, wallet }) => <article key={wallet.id} className="rounded-[1.5rem] border border-ink/[0.07] bg-paper/85 p-5"><div className="flex items-start justify-between gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo/10 text-indigo"><Building2 className="h-5 w-5" /></span><StatusPill status={membership.programme.status} /></div><h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.035em]">{membership.programme.name}</h3><p className="mt-1 text-xs text-ink/42">{membership.programme.programmeType.replaceAll("_", " ")} · {wallet.currency}</p><div className="mt-4 flex items-center gap-2 text-xs font-bold text-leaf"><BadgeCheck className="h-4 w-4" />Verified programme wallet</div></article>)}</div> : <div className="mt-6"><DashboardEmptyState compact icon={Building2} title="No active programmes." description="A service wallet appears only after a verified programme membership is activated." /></div>}
        </DashboardPanel>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <MetricCard icon={WalletCards} label="Total balance" value={money(balancePaise)} hint="Across all active wallets" />
        <MetricCard icon={BadgeCheck} label="Programmes" value={`${wallets.length} active`} hint="Verified benefit sources" tone="leaf" />
        <MetricCard icon={History} label="Ledger" value={`${entries.length} entries`} hint="Issues, uses, refunds and expiry" tone="coral" />
      </div>

      <DashboardPanel className="mt-5">
        <DashboardHeading eyebrow="Credit ledger" title="Every movement, accounted for." description="Issue, redemption, refund and expiry events remain attached to the programme that authorised them." />
        {entries.length ? <div className="mt-7 grid gap-3">{entries.map((entry) => { const positive = entry.amountPaise >= 0; return <article key={entry.id} className="flex flex-col justify-between gap-4 rounded-[1.5rem] border border-ink/[0.06] bg-cream/45 p-5 transition hover:bg-paper hover:shadow-lifted sm:flex-row sm:items-center"><div className="flex gap-3"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${positive ? "bg-leaf/10 text-leaf" : "bg-coral/10 text-coral"}`}>{positive ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}</span><div><p className="font-bold">{entry.entryType.replaceAll("_", " ")}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-ink/42"><Building2 className="h-3.5 w-3.5" />{entry.programmeName} · {entry.createdAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}</p></div></div><div className="sm:text-right"><p className={`font-display text-2xl font-semibold ${positive ? "text-leaf" : "text-coral"}`}>{positive ? "+" : "−"}{money(Math.abs(entry.amountPaise))}</p><p className="mt-1 text-xs text-ink/40">Balance {money(entry.balanceAfter)}</p></div></article>; })}</div> : <div className="mt-7"><DashboardEmptyState icon={WalletCards} title="No service-wallet activity yet." description="An active verified programme creates the wallet; its first authorised credit creates the ledger." /></div>}
      </DashboardPanel>
    </PortalShell>
  );
}

function money(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}
