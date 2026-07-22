import { redirect } from "next/navigation";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { listOpportunities } from "@/modules/b2b/pipeline";
import { KanbanSquare, Building, CheckCircle, Target, Briefcase } from "lucide-react";

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
    <div className="container-shell">
      <h1 className="section-title mb-6 flex items-center gap-2">
        <KanbanSquare className="w-6 h-6" /> CRM Pipeline
      </h1>

      <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4">
        {columns.map((col) => {
          const colOpps = opps.filter((o) => col.stages.includes(o.pipelineStage));
          const Icon = col.icon;
          return (
            <div key={col.title} className="bg-gray-100 p-4 rounded-lg min-w-[300px] flex-shrink-0">
              <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${col.color}`}>
                <Icon className="w-5 h-5" /> {col.title} ({colOpps.length})
              </h2>
              <div className="space-y-3">
                {colOpps.map((opp) => (
                  <div key={opp.id} className="bg-paper p-4 shadow rounded border border-gray-200">
                    <div className="font-semibold">{opp.organization.displayName}</div>
                    <div className="text-xs text-gray-500 mt-1">{opp.programmeType}</div>
                    <div className="mt-2 text-sm">Value: ₹{opp.estimatedValue || 0}</div>
                    <div className="mt-1 text-xs px-2 py-0.5 bg-gray-200 inline-block rounded">
                      {opp.pipelineStage.replace(/_/g, " ")}
                    </div>
                  </div>
                ))}
                {colOpps.length === 0 && (
                  <div className="text-sm text-gray-400 italic">No opportunities</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
