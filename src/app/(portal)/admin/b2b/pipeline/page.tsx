import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { listOpportunities } from "@/modules/b2b/pipeline";
import { Briefcase, Building, CheckCircle, KanbanSquare, Target } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["PARTNER_MANAGER", "SUPER_ADMIN"])) {
    redirect("/login?returnTo=/admin/b2b/pipeline");
  }

  const result = await listOpportunities({ page: 1, pageSize: 100 });
  const opps = result.items;

  const columns = [
    { title: "Target", stages: ["TARGET_ACCOUNT"], icon: Target, color: "text-blue-500" },
    { title: "Contacted", stages: ["CONTACT_IDENTIFIED", "CONTACTED", "DISCOVERY_SCHEDULED"], icon: Briefcase, color: "text-orange-500" },
    { title: "Pilot / Neg", stages: ["QUALIFIED", "SOLUTION_DESIGNED", "PROPOSAL_SENT", "PILOT_NEGOTIATION", "PILOT_CONTRACTED", "PILOT_ACTIVE", "PILOT_REVIEW", "COMMERCIAL_NEGOTIATION"], icon: Building, color: "text-purple-500" },
    { title: "Paid / Won", stages: ["PAID_CONTRACT", "ONBOARDING", "ACTIVE_ACCOUNT"], icon: CheckCircle, color: "text-green-500" },
  ];

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="mt-5">
        <h1 className="flex items-center gap-3 font-display text-4xl font-semibold tracking-[-0.04em]">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo/10 text-indigo">
            <KanbanSquare className="h-6 w-6" />
          </span>
          CRM Pipeline
        </h1>

        <div className="mt-8 flex gap-6 overflow-x-auto pb-6">
          {columns.map((col) => {
            const colOpps = opps.filter((o) => col.stages.includes(o.pipelineStage));
            const Icon = col.icon;
            
            // Map the legacy color string to our token-based classes
            let headerColorClass = "bg-indigo/10 text-indigo";
            if (col.color.includes("orange")) headerColorClass = "bg-saffron/20 text-saffron-dark";
            if (col.color.includes("purple")) headerColorClass = "bg-coral/10 text-coral";
            if (col.color.includes("green")) headerColorClass = "bg-leaf/10 text-leaf";

            return (
              <div key={col.title} className="flex min-w-[320px] shrink-0 flex-col gap-4 rounded-4xl border border-indigo/10 bg-cream/40 p-5 shadow-soft">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${headerColorClass}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    {col.title}
                  </h2>
                  <span className="rounded-full bg-paper px-3 py-1 text-xs font-bold text-ink/50 shadow-soft">
                    {colOpps.length}
                  </span>
                </div>
                
                <div className="flex flex-col gap-4">
                  {colOpps.map((opp) => (
                    <article key={opp.id} className="rounded-3xl border border-indigo/10 bg-paper p-5 shadow-lifted transition-shadow hover:shadow-soft">
                      <h3 className="font-semibold text-ink">{opp.organization.displayName}</h3>
                      <p className="mt-1 text-sm text-ink/60">{opp.programmeType.replace(/_/g, " ")}</p>
                      
                      <div className="mt-4 flex items-end justify-between">
                        <p className="text-sm font-bold text-ink">
                          ₹{opp.estimatedValue || 0}
                        </p>
                        <span className="inline-flex rounded-md bg-cream px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/50">
                          {opp.pipelineStage.replace(/_/g, " ")}
                        </span>
                      </div>
                    </article>
                  ))}
                  {colOpps.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-indigo/20 p-6 text-center">
                      <p className="text-sm font-medium text-ink/40 italic">No opportunities</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PortalShell>
  );
}
