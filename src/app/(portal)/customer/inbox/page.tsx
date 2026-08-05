import { Bell, Headphones, Inbox, MessageSquareText, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardEmptyState, DashboardHeading, DashboardPanel, MetricCard, StatusPill } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export default async function CustomerProtocolInboxPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/customer/inbox");

  const [notices, cases] = await Promise.all([
    prisma.notificationOutbox.findMany({ where: { userId: identity.id, status: { not: "CANCELLED" } }, orderBy: { scheduledAt: "desc" }, take: 30, select: { id: true, templateKey: true, status: true, scheduledAt: true } }),
    prisma.supportCase.findMany({ where: { userId: identity.id }, orderBy: { updatedAt: "desc" }, take: 20, select: { id: true, reference: true, subject: true, status: true, updatedAt: true, resolution: true } }),
  ]);
  const openCases = cases.filter((item) => item.status !== "CLOSED").length;
  const unread = notices.filter((item) => item.status !== "READ").length;

  return (
    <PortalShell mode="customer" displayName={identity.displayName} showSummaryCards={false}>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <MetricCard icon={Bell} label="Care updates" value={`${notices.length} notices`} hint={`${unread} not yet read`} />
        <MetricCard icon={Headphones} label="Support threads" value={`${openCases} open`} hint="Traceable customer cases" tone="coral" />
        <MetricCard icon={ShieldCheck} label="Record quality" value="Structured" hint="No untracked free-form chat" tone="leaf" />
      </div>

      <DashboardPanel className="mt-5">
        <DashboardHeading eyebrow="Care communication centre" title="Updates and support, side by side." description="Inspired by a modern inbox, but organised around accountable care and support records rather than loose conversations." action={<Link href="/support" className={buttonVariants({ variant: "outline" })}>Open support case</Link>} />
        <div className="mt-7 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[1.75rem] border border-ink/[0.07] bg-cream/35 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3"><div><p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-coral">Care feed</p><h3 className="mt-2 font-display text-2xl font-semibold">Protocol updates</h3></div><span className="rounded-full bg-paper px-3 py-1.5 text-xs font-bold text-ink/45">{notices.length}</span></div>
            {notices.length ? <div className="mt-5 grid gap-2">{notices.map((notice) => <article key={notice.id} className="rounded-[1.35rem] border border-ink/[0.05] bg-paper p-4 transition hover:border-indigo/15 hover:shadow-lifted"><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo/10 text-indigo"><Bell className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><p className="text-sm font-bold capitalize">{notice.templateKey.replaceAll(".", " · ").replaceAll("_", " ")}</p><StatusPill status={notice.status} /></div><p className="mt-2 text-xs text-ink/40">{notice.scheduledAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p></div></div></article>)}</div> : <div className="mt-5"><DashboardEmptyState compact icon={Inbox} title="No care updates yet." description="Booking, payment, report and safety notices will appear here." /></div>}
          </section>

          <section className="rounded-[1.75rem] border border-indigo/10 bg-gradient-to-br from-[#f3eafa] to-paper p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3"><div><p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-indigo">Accountable threads</p><h3 className="mt-2 font-display text-2xl font-semibold">Support cases</h3></div><MessageSquareText className="h-5 w-5 text-indigo" /></div>
            {cases.length ? <div className="mt-5 grid gap-2">{cases.map((item) => <article key={item.id} className="rounded-[1.35rem] border border-ink/[0.05] bg-paper/90 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-coral">{item.reference}</p><StatusPill status={item.status} /></div><p className="mt-3 font-bold">{item.subject}</p><p className="mt-1 text-xs text-ink/40">Updated {item.updatedAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>{item.resolution ? <p className="mt-3 rounded-xl bg-cream/55 p-3 text-sm leading-6 text-ink/52">{item.resolution}</p> : null}</article>)}</div> : <div className="mt-5"><DashboardEmptyState compact icon={Headphones} title="No support threads." description="A submitted support case creates a traceable conversation here." /></div>}
          </section>
        </div>
      </DashboardPanel>
    </PortalShell>
  );
}
