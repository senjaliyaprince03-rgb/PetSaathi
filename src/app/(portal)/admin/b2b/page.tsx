import { Building2, FileText, KanbanSquare, Receipt } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { listOrganizations } from "@/modules/b2b/organizations";
import { getPipelineSummary } from "@/modules/b2b/pipeline";
import { listProgrammes } from "@/modules/b2b/programmes";

export const dynamic = "force-dynamic";

export default async function EnterpriseB2BPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["PARTNER_MANAGER", "SUPER_ADMIN"])) {
    redirect("/login?returnTo=/admin/b2b");
  }

  const orgs = await listOrganizations({ page: 1, pageSize: 1 });
  const progs = await listProgrammes({ status: "ACTIVE_PROGRAMME", page: 1, pageSize: 1 });
  const pipeline = await getPipelineSummary();
  const totalPipelineOpps = pipeline.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="mt-5">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">Enterprise B2B Dashboard</h1>
        
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <section className="rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Total Organizations</h3>
            <p className="mt-2 font-display text-4xl font-semibold">{orgs.total}</p>
          </section>
          <section className="rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Active Programmes</h3>
            <p className="mt-2 font-display text-4xl font-semibold">{progs.total}</p>
          </section>
          <section className="rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Pipeline Opportunities</h3>
            <p className="mt-2 font-display text-4xl font-semibold">{totalPipelineOpps}</p>
          </section>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <Link href="/admin/b2b/organizations" className="group flex items-start gap-5 rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted transition-shadow hover:shadow-soft">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo/10 text-indigo transition-colors group-hover:bg-indigo group-hover:text-paper">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold">Organizations</h2>
              <p className="mt-1 text-sm leading-6 text-ink/60">Manage B2B partners and accounts.</p>
            </div>
          </Link>
          
          <Link href="/admin/b2b/pipeline" className="group flex items-start gap-5 rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted transition-shadow hover:shadow-soft">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-coral/10 text-coral transition-colors group-hover:bg-coral group-hover:text-paper">
              <KanbanSquare className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold">CRM Pipeline</h2>
              <p className="mt-1 text-sm leading-6 text-ink/60">Track B2B sales and onboarding.</p>
            </div>
          </Link>
          
          <Link href="/admin/b2b/programmes" className="group flex items-start gap-5 rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted transition-shadow hover:shadow-soft">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-leaf/10 text-leaf transition-colors group-hover:bg-leaf group-hover:text-paper">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold">Programmes</h2>
              <p className="mt-1 text-sm leading-6 text-ink/60">Active corporate benefit programs.</p>
            </div>
          </Link>
          
          <Link href="/admin/b2b/invoices" className="group flex items-start gap-5 rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted transition-shadow hover:shadow-soft">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-saffron/20 text-saffron-dark transition-colors group-hover:bg-saffron group-hover:text-paper">
              <Receipt className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold">Invoices</h2>
              <p className="mt-1 text-sm leading-6 text-ink/60">Enterprise billing and payments.</p>
            </div>
          </Link>
        </div>
      </div>
    </PortalShell>
  );
}
