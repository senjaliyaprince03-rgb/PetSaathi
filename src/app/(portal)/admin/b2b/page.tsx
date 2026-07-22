import { redirect } from "next/navigation";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { listOrganizations } from "@/modules/b2b/organizations";
import { listProgrammes } from "@/modules/b2b/programmes";
import { getPipelineSummary } from "@/modules/b2b/pipeline";
import Link from "next/link";
import { Building, KanbanSquare, Receipt, FileText } from "lucide-react";

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
    <div className="container-shell">
      <h1 className="section-title mb-6">Enterprise B2B Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-paper p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Organizations</h3>
          <p className="text-3xl font-bold mt-2">{orgs.total}</p>
        </div>
        <div className="bg-paper p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Active Programmes</h3>
          <p className="text-3xl font-bold mt-2">{progs.total}</p>
        </div>
        <div className="bg-paper p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Pipeline Opportunities</h3>
          <p className="text-3xl font-bold mt-2">{totalPipelineOpps}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/b2b/organizations" className="bg-paper p-6 rounded-lg shadow hover:shadow-md transition flex items-center space-x-4">
          <Building className="w-8 h-8 text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold">Organizations</h2>
            <p className="text-gray-500">Manage B2B partners and accounts.</p>
          </div>
        </Link>
        <Link href="/admin/b2b/pipeline" className="bg-paper p-6 rounded-lg shadow hover:shadow-md transition flex items-center space-x-4">
          <KanbanSquare className="w-8 h-8 text-purple-500" />
          <div>
            <h2 className="text-xl font-semibold">CRM Pipeline</h2>
            <p className="text-gray-500">Track B2B sales and onboarding.</p>
          </div>
        </Link>
        <Link href="/admin/b2b/programmes" className="bg-paper p-6 rounded-lg shadow hover:shadow-md transition flex items-center space-x-4">
          <FileText className="w-8 h-8 text-green-500" />
          <div>
            <h2 className="text-xl font-semibold">Programmes</h2>
            <p className="text-gray-500">Active corporate benefit programs.</p>
          </div>
        </Link>
        <Link href="/admin/b2b/invoices" className="bg-paper p-6 rounded-lg shadow hover:shadow-md transition flex items-center space-x-4">
          <Receipt className="w-8 h-8 text-red-500" />
          <div>
            <h2 className="text-xl font-semibold">Invoices</h2>
            <p className="text-gray-500">Enterprise billing and payments.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
