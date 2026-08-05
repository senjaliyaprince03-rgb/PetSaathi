import { BadgeCheck, CircleDashed, Gift, HeartHandshake, Sparkles, UserRoundCheck } from "lucide-react";
import { redirect } from "next/navigation";

import { DashboardEmptyState, DashboardHeading, DashboardPanel, MetricCard, StatusPill } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export default async function ReferralProtocolPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/customer/referrals");

  const referrals = await prisma.referral.findMany({ where: { referrerId: identity.id }, orderBy: { createdAt: "desc" }, include: { referred: { select: { displayName: true } } } });
  const rewarded = referrals.filter((item) => Boolean(item.rewardedAt)).length;
  const qualified = referrals.filter((item) => Boolean(item.qualifiedAt)).length;

  return (
    <PortalShell mode="customer" displayName={identity.displayName} showSummaryCards={false}>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <MetricCard icon={HeartHandshake} label="Invitations" value={`${referrals.length} shared`} hint="Campaign-authorised referrals" />
        <MetricCard icon={UserRoundCheck} label="Qualified" value={`${qualified} complete`} hint="Required action verified" tone="leaf" />
        <MetricCard icon={Gift} label="Rewarded" value={`${rewarded} released`} hint="Final rewards only" tone="coral" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
        <DashboardPanel tone="dark" className="relative min-h-[28rem] overflow-hidden p-7 sm:p-8">
          <div className="absolute inset-0 luxury-grid opacity-20" />
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-coral/25 blur-3xl" />
          <div className="relative flex h-full min-h-[24rem] flex-col justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron text-ink"><Gift className="h-5 w-5" /></span><div><p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-saffron">Referral protocol</p><h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">Thoughtful care is worth sharing.</h2><p className="mt-4 text-sm leading-6 text-paper/55">Codes never bypass identity, safety, payment or qualifying-action checks. A reward becomes real only when the ledger says so.</p><div className="mt-6 grid grid-cols-3 gap-2"><JourneyStep number="01" label="Invite" /><JourneyStep number="02" label="Qualify" /><JourneyStep number="03" label="Reward" /></div></div></div>
        </DashboardPanel>

        <DashboardPanel>
          <DashboardHeading eyebrow="Invitation ledger" title="A clear path from invite to reward." description="Every invitation shows who accepted it, its current state and whether a verified reward was released." />
          {referrals.length ? <div className="mt-7 grid gap-3">{referrals.map((referral) => <article key={referral.id} className="rounded-[1.6rem] border border-ink/[0.07] bg-cream/45 p-5 transition hover:border-indigo/20 hover:bg-paper hover:shadow-lifted"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-coral">Referral code</p><p className="mt-1 font-mono text-sm font-bold tracking-[0.12em] text-indigo">{referral.code}</p></div><StatusPill status={referral.status} /></div><h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.035em]">{referral.referred?.displayName ?? "Invitation waiting"}</h3><div className="mt-4 grid grid-cols-3 gap-2"><ReferralState active icon={HeartHandshake} label="Shared" /><ReferralState active={Boolean(referral.qualifiedAt)} icon={UserRoundCheck} label="Qualified" /><ReferralState active={Boolean(referral.rewardedAt)} icon={BadgeCheck} label="Rewarded" /></div><p className="mt-4 text-xs text-ink/40">Created {referral.createdAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}{referral.rewardedAt ? ` · rewarded ${referral.rewardedAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}` : ""}</p></article>)}</div> : <div className="mt-7"><DashboardEmptyState icon={HeartHandshake} title="No invitations yet." description="An authorised referral campaign will place a shareable code here. There are no hidden or provisional rewards." /></div>}
        </DashboardPanel>
      </div>
    </PortalShell>
  );
}

function JourneyStep({ number, label }: { number: string; label: string }) {
  return <div className="rounded-2xl border border-paper/10 bg-paper/[0.06] p-3"><p className="text-[0.58rem] font-bold text-saffron">{number}</p><p className="mt-2 text-xs font-bold text-paper/70">{label}</p></div>;
}

function ReferralState({ active, icon: Icon, label }: { active: boolean; icon: typeof Sparkles; label: string }) {
  return <div className={`rounded-2xl p-3 ${active ? "bg-leaf/10 text-leaf" : "bg-ink/[0.04] text-ink/30"}`}>{active ? <Icon className="h-4 w-4" /> : <CircleDashed className="h-4 w-4" />}<p className="mt-2 text-[0.62rem] font-bold">{label}</p></div>;
}
