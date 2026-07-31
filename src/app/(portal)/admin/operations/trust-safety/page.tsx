import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import {
  ShieldAlert,
  AlertTriangle,
  UserX,
  ClipboardCheck,
} from "lucide-react";
import { PortalShell } from "@/components/portal/portal-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trust & Safety Command Center | PetSaathi Admin",
  description: "Monitor incidents, provider suspensions, and safety audits.",
};

export default async function TrustSafetyCommandCenter() {
  const identity = await getCurrentIdentity();

  if (!identity) {
    return notFound();
  }

  // Check roles (SUPER_ADMIN, OPERATIONS_ADMIN)
  const isAuthorized =
    identity.roles.includes("SUPER_ADMIN") ||
    identity.roles.includes("SAFETY_ADMIN") ||
    identity.roles.includes("OPERATIONS_ADMIN");

  if (!isAuthorized) {
    return (
      <PortalShell mode="admin" displayName={identity.displayName}>
        <div className="max-w-7xl pb-12">
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] text-coral">Access Denied</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/60 mb-10">You do not have permission to view Trust & Safety metrics.</p>
        </div>
      </PortalShell>
    );
  }

  // Fetch critical incidents
  const pendingIncidents = await prisma.incident.findMany({
    where: {
      status: {
        in: ["REPORTED", "TRIAGING"],
      },
    },
    orderBy: [
      { severity: "desc" },
      { detectedAt: "asc" },
    ],
    take: 10,
  });

  // Fetch active provider suspensions
  const activeSuspensions = await prisma.providerSuspension.findMany({
    where: {
      liftedAt: null,
      OR: [
        { expiresAt: { gt: new Date() } },
        { expiresAt: null },
      ],
    },
    include: {
      sitter: true,
    },
    orderBy: { issuedAt: "desc" },
    take: 10,
  });

  // Fetch flagged safety audits
  const actionRequiredAudits = await prisma.safetyAudit.findMany({
    where: {
      actionRequired: true,
    },
    include: {
      sitter: true,
      auditor: true,
    },
    orderBy: { auditDate: "desc" },
    take: 10,
  });

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12 space-y-8">
        {/* Header */}
        <div>
          <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/50">
            <ShieldAlert className="w-3 h-3 text-coral" />
            Trust & Safety
          </span>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Command Center</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/60 mb-10">
            Monitor and manage platform integrity, incidents, and provider interventions.
          </p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Incidents Layer */}
        <section className="bg-paper p-6 rounded-4xl shadow-lifted space-y-6 border border-ink/5">
          <div className="flex items-center justify-between border-b border-ink/10 pb-4">
            <h2 className="text-xl font-display font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-coral" />
              Active Incidents
            </h2>
            <span className="bg-coral/10 text-coral px-3 py-1 rounded-full text-xs font-semibold">
              {pendingIncidents.length} Pending
            </span>
          </div>

          <div className="space-y-4">
            {pendingIncidents.length === 0 ? (
              <p className="text-ink/50 text-sm">No active incidents at the moment.</p>
            ) : (
              pendingIncidents.map((incident) => (
                <div key={incident.id} className="p-4 bg-cream/50 rounded-2xl border border-ink/5 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div className="font-semibold">{incident.category}</div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      incident.severity === 'CRITICAL' ? 'bg-coral text-white' : 
                      incident.severity === 'HIGH' ? 'bg-coral/20 text-coral' : 'bg-yellow-500/20 text-yellow-700'
                    }`}>
                      {incident.severity}
                    </span>
                  </div>
                  <p className="text-sm text-ink/70 line-clamp-2">{incident.description}</p>
                  <div className="text-xs text-ink/50 flex justify-between mt-2">
                    <span>{new Date(incident.detectedAt).toLocaleDateString()}</span>
                    <span>Ref: {incident.reference}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <div className="space-y-8">
          {/* Provider Suspensions */}
          <section className="bg-paper p-6 rounded-4xl shadow-lifted space-y-6 border border-ink/5">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <h2 className="text-xl font-display font-bold flex items-center gap-2">
                <UserX className="w-5 h-5 text-ink" />
                Active Suspensions
              </h2>
            </div>

            <div className="space-y-4">
              {activeSuspensions.length === 0 ? (
                <p className="text-ink/50 text-sm">No active provider suspensions.</p>
              ) : (
                activeSuspensions.map((suspension) => (
                  <div key={suspension.id} className="p-4 bg-cream/50 rounded-2xl border border-coral/20 flex justify-between items-center gap-4">
                    <div>
                      <div className="font-semibold">{suspension.sitter.displayName}</div>
                      <div className="text-sm text-coral font-medium mt-1">{suspension.reason.replace(/_/g, ' ')}</div>
                      <div className="text-xs text-ink/60 mt-1 line-clamp-1">{suspension.description}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-semibold text-ink">
                        {suspension.expiresAt ? `Expires: ${new Date(suspension.expiresAt).toLocaleDateString()}` : "PERMANENT"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Safety Audits */}
          <section className="bg-paper p-6 rounded-4xl shadow-lifted space-y-6 border border-ink/5">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <h2 className="text-xl font-display font-bold flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-leaf" />
                Action Required Audits
              </h2>
            </div>

            <div className="space-y-4">
              {actionRequiredAudits.length === 0 ? (
                <p className="text-ink/50 text-sm">No audits currently require action.</p>
              ) : (
                actionRequiredAudits.map((audit) => (
                  <div key={audit.id} className="p-4 bg-cream/50 rounded-2xl border border-yellow-500/30 flex justify-between items-center gap-4">
                    <div>
                      <div className="font-semibold text-sm">Provider: {audit.sitter.displayName}</div>
                      <div className="text-xs text-ink/60 mt-1">Audited by: {audit.auditor.displayName}</div>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono font-bold text-lg ${audit.score < 70 ? 'text-coral' : 'text-yellow-600'}`}>
                        {audit.score}/100
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
      </div>
    </PortalShell>
  );
}
