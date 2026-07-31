import { AlertTriangle, Clock3, FileCheck2, PhoneCall, ShieldCheck, UserRound } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { SafetyWorkflowActions } from "@/components/portal/safety-workflow-actions";
import { prisma } from "@/lib/db";
import { maskEmail, maskPhone } from "@/lib/pii";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export default async function AdminSafetyPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SAFETY_ADMIN", "OPERATIONS_ADMIN", "SUPER_ADMIN"])) redirect("/login?returnTo=/admin/safety");
  const canAct = hasAnyRole(identity, ["SAFETY_ADMIN", "SUPER_ADMIN"]);
  const incidents = await prisma.incident.findMany({
    where: { status: { not: "CLOSED" } },
    orderBy: [{ severity: "desc" }, { detectedAt: "asc" }],
    take: 50,
    include: {
      booking: {
        select: {
          reference: true,
          status: true,
          customer: { select: { displayName: true, phoneE164: true, email: true } },
          pet: { select: { name: true } },
          assignments: { select: { sitterId: true, sitter: { select: { user: { select: { displayName: true } } } } } }
        }
      },
      events: { orderBy: { occurredAt: "desc" }, take: 20 },
      correctiveActions: { orderBy: [{ completedAt: "asc" }, { dueAt: "asc" }] },
      evidence: { orderBy: { collectedAt: "desc" }, select: { id: true, evidenceType: true, status: true, collectedAt: true } },
      notifications: { orderBy: { createdAt: "desc" }, take: 10, select: { status: true, recipientType: true } },
      sitterHolds: { orderBy: { placedAt: "desc" }, take: 5 }
    }
  });

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/50">purpose-limited access</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Safety command queue</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/60 mb-10">Every incident stays open through triage, response, owner communication, review and any required corrective action. Booking recovery and Saathi holds are explicit, reasoned decisions.</p>
        {!canAct && <p className="mt-5 rounded-2xl bg-saffron/15 p-4 text-sm font-semibold">Operations has read-only incident visibility. Safety or Super Admin authority is required for timeline decisions, holds and closure.</p>}
        <div className="mt-10 grid gap-6">{incidents.length ? incidents.map((incident) => {
    const linkedSitter = incident.booking.assignments.find(({ sitterId }) => sitterId === incident.sitterId)?.sitter.user.displayName;
    const activeHold = incident.sitterHolds.some(({ status, expiresAt }) => status === "ACTIVE" && (!expiresAt || expiresAt > new Date()));
    const deliveredNotifications = incident.notifications.filter(({ status }) => ["SENT", "DELIVERED", "READ"].includes(status)).length;
    return <article key={incident.id} className="rounded-4xl border border-coral/20 bg-paper p-6 shadow-lifted sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral/12 text-coral"><AlertTriangle className="h-6 w-6" /></span><div className="flex flex-wrap gap-2"><span className="rounded-full bg-coral/10 px-4 py-2 text-xs font-bold text-coral">{incident.severity}</span><span className="rounded-full bg-indigo/8 px-4 py-2 text-xs font-bold">{incident.status.replaceAll("_", " ")}</span>{activeHold && <span className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-paper">SAATHI HOLD</span>}</div></div><p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-ink/45">{incident.reference} · booking {incident.booking.reference} · {incident.booking.status.replaceAll("_", " ")}</p><h2 className="mt-2 font-display text-3xl font-semibold">{incident.category.replaceAll("_", " ")} · {incident.booking.pet.name}</h2><p className="mt-3 max-w-3xl leading-7 text-ink/65">{incident.description}</p>{incident.observedSymptoms && <p className="mt-3 rounded-2xl bg-coral/7 p-4 text-sm leading-6"><strong>Observed, not diagnosed:</strong> {incident.observedSymptoms}</p>}<div className="mt-5 grid gap-3 rounded-3xl bg-cream/55 p-4 text-sm sm:grid-cols-2 lg:grid-cols-4"><p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-coral" />{incident.detectedAt.toLocaleString("en-IN")}</p><p className="flex items-center gap-2"><UserRound className="h-4 w-4 text-leaf" />Owner: {incident.booking.customer.displayName}</p><p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-leaf" />Saathi: {linkedSitter ?? "not linked"}</p><p className="flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-leaf" />{incident.evidence.length} promoted evidence · {deliveredNotifications}/{incident.notifications.length} acknowledged/delivered</p></div><div className="mt-4 flex flex-wrap gap-3 text-sm">{incident.booking.customer.phoneE164 && <a href={`tel:${incident.booking.customer.phoneE164}`} className="inline-flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2 font-semibold"><PhoneCall className="h-4 w-4" />Call {maskPhone(incident.booking.customer.phoneE164)}</a>}{incident.booking.customer.email && <a href={`mailto:${incident.booking.customer.email}`} className="rounded-full border border-ink/10 px-4 py-2 font-semibold">Email {maskEmail(incident.booking.customer.email)}</a>}</div><div className="mt-6 grid gap-5 lg:grid-cols-2"><section><h3 className="text-sm font-bold uppercase tracking-[0.16em] text-ink/45">Incident timeline</h3><div className="mt-3 grid gap-2">{incident.events.map((event) => <div key={event.id} className="rounded-2xl border border-ink/8 bg-cream/30 p-3"><div className="flex flex-wrap justify-between gap-2"><p className="text-sm font-semibold">{event.type.replaceAll("_", " ")}</p><time className="text-xs text-ink/45">{event.occurredAt.toLocaleString("en-IN")}</time></div><pre className="mt-2 whitespace-pre-wrap font-sans text-xs leading-5 text-ink/55">{JSON.stringify(event.details, null, 2)}</pre></div>)}</div></section><section><h3 className="text-sm font-bold uppercase tracking-[0.16em] text-ink/45">Corrective action register</h3><div className="mt-3 grid gap-2">{incident.correctiveActions.length ? incident.correctiveActions.map((action) => <div key={action.id} className="rounded-2xl border border-ink/8 bg-cream/30 p-3"><p className="text-sm font-semibold">{action.title}</p><p className="mt-1 text-xs text-ink/50">{action.completedAt ? `Completed ${action.completedAt.toLocaleString("en-IN")}` : action.dueAt ? `Due ${action.dueAt.toLocaleString("en-IN")}` : "Deadline missing"}</p>{action.evidence && <pre className="mt-2 whitespace-pre-wrap font-sans text-xs leading-5 text-ink/55">{JSON.stringify(action.evidence, null, 2)}</pre>}</div>) : <p className="rounded-2xl border border-dashed border-ink/15 p-4 text-sm text-ink/50">No corrective action assigned yet.</p>}</div></section></div>{canAct && <SafetyWorkflowActions incidentId={incident.id} status={incident.status} bookingStatus={incident.booking.status} hasSitter={Boolean(incident.sitterId)} activeHold={activeHold} correctiveActions={incident.correctiveActions.map((action) => ({ id: action.id, title: action.title, dueAt: action.dueAt?.toISOString() ?? null, completedAt: action.completedAt?.toISOString() ?? null }))} />}</article>;
  }) : <div className="glass-panel rounded-5xl p-10 text-center"><ShieldCheck className="mx-auto h-11 w-11 text-leaf" /><h2 className="mt-5 font-display text-3xl font-semibold">No open incidents.</h2><p className="mt-3 text-ink/55">The queue is clear; monitoring remains active.</p></div>}</div>
      </div>
    </PortalShell>
  );
}
