import { AlertTriangle, Clock3, FileCheck2, PhoneCall, ShieldAlert, ShieldCheck, UserRound, Zap } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { SafetyWorkflowActions } from "@/components/portal/safety-workflow-actions";
import { prisma } from "@/lib/db";
import { maskEmail, maskPhone } from "@/lib/pii";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

function formatDetailValue(val: unknown): string {
  if (val === null || val === undefined) return "None";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (typeof val === "object") {
    try {
      const entries = Object.entries(val as Record<string, unknown>);
      if (entries.length === 0) return "No details provided";
      return entries
        .map(([k, v]) => `${k.replace(/([A-Z])/g, " $1")}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`)
        .join(" • ");
    } catch {
      return String(val);
    }
  }
  return String(val);
}

export default async function AdminSafetyPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SAFETY_ADMIN", "OPERATIONS_ADMIN", "SUPER_ADMIN"])) {
    redirect("/login?returnTo=/admin/safety");
  }
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
          assignments: {
            select: {
              sitterId: true,
              sitter: { select: { user: { select: { displayName: true } } } },
            },
          },
        },
      },
      events: { orderBy: { occurredAt: "desc" }, take: 20 },
      correctiveActions: { orderBy: [{ completedAt: "asc" }, { dueAt: "asc" }] },
      evidence: {
        orderBy: { collectedAt: "desc" },
        select: { id: true, evidenceType: true, status: true, collectedAt: true },
      },
      notifications: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { status: true, recipientType: true },
      },
      sitterHolds: { orderBy: { placedAt: "desc" }, take: 5 },
    },
  });

  const criticalIncidentsCount = incidents.filter(
    (i) => i.severity === "CRITICAL" || i.severity === "HIGH",
  ).length;
  const activeHoldsCount = incidents.filter((i) =>
    i.sitterHolds.some(
      ({ status, expiresAt }) =>
        status === "ACTIVE" && (!expiresAt || expiresAt > new Date()),
    ),
  ).length;

  return (
    <PortalShell mode="admin" displayName={identity.displayName} roles={identity.roles}>
      <div className="max-w-7xl pb-16 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                Safety &amp; Emergency Incident Response
              </span>
              <span className="text-xs text-ink/60 font-semibold hidden sm:inline-flex items-center gap-1">
                <Clock3 className="w-3.5 h-3.5 text-rose-600" />
                {incidents.length} Open Incidents Under Review
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-ink">
              Safety Command Queue
            </h1>
            <p className="mt-2 text-sm leading-6 text-ink/70 max-w-3xl">
              Every safety report stays open through triage, immediate veterinary intervention, customer communication, and formal hold evaluation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>24/7 Vet SOS Hotline</span>
            </a>
          </div>
        </div>

        {/* Safety KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Active Incidents</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-3xl font-bold font-display text-ink block">{incidents.length}</span>
            <p className="text-[11px] text-ink/60 mt-1 font-medium">Pending final safety resolution</p>
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">High / Critical SOS</span>
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </div>
            <span className="text-3xl font-bold font-display text-rose-700 block">{criticalIncidentsCount}</span>
            <p className="text-[11px] text-rose-700 mt-1 font-medium">Immediate response priority</p>
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Caregiver Holds</span>
              <ShieldCheck className="w-4 h-4 text-indigo" />
            </div>
            <span className="text-3xl font-bold font-display text-ink block">{activeHoldsCount}</span>
            <p className="text-[11px] text-indigo mt-1 font-medium">Temporary assignments blocked</p>
          </div>
        </div>

        {!canAct && (
          <div className="rounded-2xl bg-amber-50 border border-amber-200/80 p-4 text-xs sm:text-sm font-semibold text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Operations has read-only incident visibility. Safety or Super Admin authority is required for timeline decisions, holds, and closure.</span>
          </div>
        )}

        {/* Incident List */}
        <div className="grid gap-6">
          {incidents.length ? (
            incidents.map((incident) => {
              const linkedSitter = incident.booking.assignments.find(
                ({ sitterId }) => sitterId === incident.sitterId,
              )?.sitter.user.displayName;
              const activeHold = incident.sitterHolds.some(
                ({ status, expiresAt }) =>
                  status === "ACTIVE" && (!expiresAt || expiresAt > new Date()),
              );
              const deliveredNotifications = incident.notifications.filter(
                ({ status }) => ["SENT", "DELIVERED", "READ"].includes(status),
              ).length;

              const isCritical = incident.severity === "CRITICAL" || incident.severity === "HIGH";

              return (
                <article
                  key={incident.id}
                  className={`rounded-3xl border bg-white p-6 sm:p-8 shadow-2xs transition-shadow ${
                    isCritical ? "border-rose-300 ring-2 ring-rose-50" : "border-ink/10"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-ink/5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                          isCritical ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        <AlertTriangle className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-ink/70">
                            {incident.reference}
                          </span>
                          <span className="text-ink/30">•</span>
                          <span className="text-xs font-medium text-ink/60">
                            Booking: {incident.booking.reference}
                          </span>
                        </div>
                        <h2 className="font-display text-xl sm:text-2xl font-bold text-ink mt-0.5">
                          {incident.category.replaceAll("_", " ")} • {incident.booking.pet.name}
                        </h2>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider border ${
                          isCritical
                            ? "bg-rose-50 text-rose-800 border-rose-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        {incident.severity}
                      </span>
                      <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-ink/70 border border-ink/10">
                        {incident.status.replaceAll("_", " ")}
                      </span>
                      {activeHold && (
                        <span className="rounded-full bg-ink text-white px-3 py-1 text-xs font-extrabold tracking-wider">
                          SAATHI HOLD
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-ink/80">{incident.description}</p>

                  {incident.observedSymptoms && (
                    <div className="mt-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 p-3.5 text-xs leading-relaxed text-amber-950">
                      <strong>Observed Symptoms (Reported):</strong> {incident.observedSymptoms}
                    </div>
                  )}

                  {/* Metadata Chips */}
                  <div className="mt-4 grid gap-3 rounded-2xl bg-surface/70 p-4 text-xs sm:grid-cols-2 lg:grid-cols-4 border border-ink/5">
                    <p className="flex items-center gap-2 text-ink/70">
                      <Clock3 className="h-4 w-4 text-rose-600 shrink-0" />
                      <span>{incident.detectedAt.toLocaleString("en-IN")}</span>
                    </p>
                    <p className="flex items-center gap-2 text-ink/70">
                      <UserRound className="h-4 w-4 text-indigo shrink-0" />
                      <span>Parent: {incident.booking.customer.displayName}</span>
                    </p>
                    <p className="flex items-center gap-2 text-ink/70">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Saathi: {linkedSitter ?? "Unassigned"}</span>
                    </p>
                    <p className="flex items-center gap-2 text-ink/70">
                      <FileCheck2 className="h-4 w-4 text-purple-600 shrink-0" />
                      <span>
                        {incident.evidence.length} Evidence • {deliveredNotifications}/{incident.notifications.length} Alerts
                      </span>
                    </p>
                  </div>

                  {/* Contact Buttons */}
                  <div className="mt-4 flex flex-wrap gap-2.5 text-xs">
                    {incident.booking.customer.phoneE164 && (
                      <a
                        href={`tel:${incident.booking.customer.phoneE164}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-ink/10 bg-white px-3.5 py-1.5 font-bold text-ink hover:border-indigo/30 transition-colors shadow-2xs"
                      >
                        <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Call Parent ({maskPhone(incident.booking.customer.phoneE164)})</span>
                      </a>
                    )}
                    {incident.booking.customer.email && (
                      <a
                        href={`mailto:${incident.booking.customer.email}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-ink/10 bg-white px-3.5 py-1.5 font-bold text-ink hover:border-indigo/30 transition-colors shadow-2xs"
                      >
                        <span>Email {maskEmail(incident.booking.customer.email)}</span>
                      </a>
                    )}
                  </div>

                  {/* Incident Timeline & Corrective Actions */}
                  <div className="mt-6 grid gap-5 lg:grid-cols-2 pt-4 border-t border-ink/5">
                    <section>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink/60 mb-2.5">
                        Incident Timeline ({incident.events.length})
                      </h3>
                      <div className="space-y-2">
                        {incident.events.slice(0, 4).map((event) => (
                          <div key={event.id} className="rounded-xl border border-ink/5 bg-surface/60 p-3 text-xs">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-bold text-ink">{event.type.replaceAll("_", " ")}</span>
                              <time className="text-[10px] text-ink/50 font-medium">
                                {event.occurredAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </time>
                            </div>
                            <p className="text-[11px] text-ink/70 leading-relaxed font-medium">
                              {formatDetailValue(event.details)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink/60 mb-2.5">
                        Corrective Action Register ({incident.correctiveActions.length})
                      </h3>
                      <div className="space-y-2">
                        {incident.correctiveActions.length ? (
                          incident.correctiveActions.map((action) => (
                            <div key={action.id} className="rounded-xl border border-ink/5 bg-surface/60 p-3 text-xs">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="font-bold text-ink">{action.title}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  action.completedAt ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
                                }`}>
                                  {action.completedAt ? "Completed" : "Pending"}
                                </span>
                              </div>
                              <p className="text-[11px] text-ink/60">
                                {action.completedAt
                                  ? `Resolved ${action.completedAt.toLocaleDateString()}`
                                  : action.dueAt
                                  ? `Due ${action.dueAt.toLocaleDateString()}`
                                  : "Action in progress"}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-xl border border-dashed border-ink/15 p-4 text-center text-xs text-ink/50 italic">
                            No corrective actions required or assigned yet.
                          </div>
                        )}
                      </div>
                    </section>
                  </div>

                  {canAct && (
                    <div className="mt-6 pt-4 border-t border-ink/5">
                      <SafetyWorkflowActions
                        incidentId={incident.id}
                        status={incident.status}
                        bookingStatus={incident.booking.status}
                        hasSitter={Boolean(incident.sitterId)}
                        activeHold={activeHold}
                        correctiveActions={incident.correctiveActions.map((action) => ({
                          id: action.id,
                          title: action.title,
                          dueAt: action.dueAt?.toISOString() ?? null,
                          completedAt: action.completedAt?.toISOString() ?? null,
                        }))}
                      />
                    </div>
                  )}
                </article>
              );
            })
          ) : (
            <div className="rounded-3xl border border-dashed border-ink/15 bg-white p-12 text-center">
              <ShieldCheck className="mx-auto h-12 w-12 text-emerald-600 mb-3" />
              <h2 className="font-display text-2xl font-bold text-ink">Safety Queue Clear</h2>
              <p className="mt-1 text-xs text-ink/60 max-w-sm mx-auto">
                No open emergency incidents or safety alerts reported. Continuous telemetry monitoring remains active.
              </p>
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
