import { CheckCircle2, Clock3, FileClock, FileLock2, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

import { DashboardEmptyState, DashboardHeading, DashboardPanel, MetricCard, StatusPill } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { PrivacyRequestForm } from "@/components/portal/privacy-request-form";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function PrivacySettingsPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login?returnTo=/settings/privacy");
  const requests = await prisma.accountRequest.findMany({ where: { userId: identity.id }, orderBy: { requestedAt: "desc" }, take: 25 });
  const mode = identity.roles.includes("SITTER") && !identity.roles.includes("CUSTOMER") ? "saathi" : "customer";
  const completed = requests.filter((request) => request.status === "FULFILLED").length;
  const open = requests.filter((request) => !["FULFILLED", "CANCELLED", "REJECTED"].includes(request.status)).length;

  return (
    <PortalShell mode={mode} displayName={identity.displayName} showSummaryCards={false}>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <MetricCard icon={FileClock} label="Open requests" value={`${open} active`} hint="Awaiting review or fulfilment" tone="coral" />
        <MetricCard icon={CheckCircle2} label="Completed" value={`${completed} fulfilled`} hint="Finished privacy workflows" tone="leaf" />
        <MetricCard icon={FileLock2} label="Request history" value={`${requests.length} recorded`} hint="Account-scoped audit trail" />
      </div>

      <DashboardPanel className="mt-5">
        <DashboardHeading eyebrow="Privacy rights centre" title="Clear choices, deliberate safeguards." description="Start correction, export or deletion workflows and follow each request without implying that sensitive data changes happen instantly." />
        <div className="mt-7 grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
          <PrivacyRequestForm />
          <aside className="relative overflow-hidden rounded-[1.75rem] bg-[#281d2b] p-6 text-paper"><div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-indigo/35 blur-3xl" /><div className="relative"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-saffron text-ink"><ShieldCheck className="h-5 w-5" /></span><h3 className="mt-7 font-display text-3xl font-semibold tracking-[-0.04em]">What happens after submit?</h3><div className="relative mt-7 grid gap-5 before:absolute before:bottom-4 before:left-4 before:top-4 before:w-px before:bg-paper/10"><PrivacyStep number="1" title="Request recorded" copy="A unique reference is created." /><PrivacyStep number="2" title="Identity and scope review" copy="The team verifies ownership and affected records." /><PrivacyStep number="3" title="Fulfilment or explanation" copy="The outcome and resolution remain in your history." /></div></div></aside>
        </div>
      </DashboardPanel>

      <DashboardPanel className="mt-5" tone="lavender">
        <DashboardHeading eyebrow="Auditable history" title="Every request keeps its reference and outcome." description="Status, submission time and resolution are presented as a readable queue rather than a dense compliance table." />
        {requests.length ? <div className="mt-7 grid gap-3">{requests.map((request) => <article key={request.id} className="rounded-[1.5rem] border border-ink/[0.06] bg-paper/90 p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-coral">{request.reference}</p><h3 className="mt-2 font-display text-2xl font-semibold capitalize">{request.type.toLowerCase()} request</h3><p className="mt-2 flex items-center gap-1.5 text-xs text-ink/40"><Clock3 className="h-3.5 w-3.5" />{request.requestedAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>{request.resolution ? <p className="mt-4 max-w-2xl rounded-xl bg-leaf/[0.06] p-3 text-sm leading-6 text-ink/55">{request.resolution}</p> : null}</div><StatusPill status={request.status} /></div></article>)}</div> : <div className="mt-7"><DashboardEmptyState icon={FileLock2} title="No privacy requests recorded." description="When you exercise an account right, its reference, status and final resolution will appear here." /></div>}
      </DashboardPanel>
    </PortalShell>
  );
}

function PrivacyStep({ number, title, copy }: { number: string; title: string; copy: string }) {
  return <div className="relative flex gap-4"><span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper text-xs font-bold text-ink">{number}</span><div><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-paper/45">{copy}</p></div></div>;
}
