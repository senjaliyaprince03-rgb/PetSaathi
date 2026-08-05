import { CheckCircle2, Clock3, Headphones, LifeBuoy, ShieldAlert } from "lucide-react";
import { redirect } from "next/navigation";

import { DashboardEmptyState, DashboardHeading, DashboardPanel, MetricCard, StatusPill } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { SupportCaseForm } from "@/components/portal/support-case-form";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login?returnTo=/support");
  const cases = await prisma.supportCase.findMany({ where: { userId: identity.id }, orderBy: { createdAt: "desc" }, take: 50 });
  const mode = identity.roles.includes("SITTER") && !identity.roles.includes("CUSTOMER") ? "saathi" : "customer";
  const open = cases.filter((item) => item.status !== "CLOSED").length;
  const closed = cases.filter((item) => item.status === "CLOSED").length;

  return (
    <PortalShell mode={mode} displayName={identity.displayName} showSummaryCards={false}>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <MetricCard icon={LifeBuoy} label="Open cases" value={`${open} active`} hint="Waiting, assigned or in progress" tone="coral" />
        <MetricCard icon={CheckCircle2} label="Resolved" value={`${closed} closed`} hint="Completed support history" tone="leaf" />
        <MetricCard icon={Clock3} label="Total history" value={`${cases.length} cases`} hint="Accountable case record" />
      </div>

      <div className="mt-5 flex items-start gap-4 rounded-[1.5rem] border border-coral/20 bg-coral/[0.07] p-5" data-motion="focus"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-coral/10 text-coral"><ShieldAlert className="h-5 w-5" /></span><div><p className="font-bold">Active emergency?</p><p className="mt-1 text-sm leading-6 text-ink/55">Use the emergency and veterinary escalation instructions attached to the booking. A support case does not replace emergency response.</p></div></div>

      <DashboardPanel className="mt-5">
        <DashboardHeading eyebrow="Support workspace" title="Create a case, then follow it without guesswork." description="The request form and case queue share one page so context, ownership, status and resolution remain easy to understand." />
        <div className="mt-7 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <SupportCaseForm />
          <section className="rounded-[1.75rem] border border-indigo/10 bg-gradient-to-br from-[#f3eafa] to-paper p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3"><div><p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-indigo">Request queue</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em]">Case history</h2></div><span className="rounded-full bg-paper px-3 py-1.5 text-xs font-bold text-ink/45 shadow-sm">{cases.length}</span></div>
            {cases.length ? <div className="mt-6 grid gap-3">{cases.map((supportCase) => <article key={supportCase.id} className="rounded-[1.4rem] border border-ink/[0.06] bg-paper/90 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-coral">{supportCase.reference}</p><StatusPill status={supportCase.status} /></div><h3 className="mt-3 font-bold">{supportCase.subject}</h3><p className="mt-1 text-xs capitalize text-ink/40">{supportCase.category.toLowerCase()} · {supportCase.createdAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>{supportCase.resolution ? <p className="mt-3 rounded-xl bg-leaf/[0.06] p-3 text-sm leading-6 text-ink/55">{supportCase.resolution}</p> : null}</article>)}</div> : <div className="mt-6"><DashboardEmptyState compact icon={Headphones} title="No support cases." description="When you need help, a traceable case will appear here with its current status." /></div>}
          </section>
        </div>
      </DashboardPanel>
    </PortalShell>
  );
}
