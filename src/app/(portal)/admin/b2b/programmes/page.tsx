import { redirect } from "next/navigation";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { listProgrammes } from "@/modules/b2b/programmes";

export const dynamic = "force-dynamic";

export default async function ProgrammesPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["PARTNER_MANAGER", "SUPER_ADMIN"])) {
    redirect("/login?returnTo=/admin/b2b/programmes");
  }

  const result = await listProgrammes({ page: 1, pageSize: 50 });

  return (
    <div className="container-shell">
      <h1 className="section-title mb-6">Active Programmes</h1>
      <div className="bg-paper shadow rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-700">Programme Name</th>
              <th className="p-4 font-semibold text-gray-700">Type / Method</th>
              <th className="p-4 font-semibold text-gray-700">Status</th>
              <th className="p-4 font-semibold text-gray-700">Members</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((prog) => (
              <tr key={prog.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium text-gray-900">{prog.name}</div>
                  <div className="text-sm text-gray-500">/{prog.slug}</div>
                  <div className="text-xs text-gray-400">Org: {prog.organization.displayName}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-gray-800">{prog.programmeType}</div>
                  <div className="text-xs text-gray-500 mt-1">{prog.eligibilityMethod}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    prog.status === "ACTIVE_PROGRAMME" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {prog.status}
                  </span>
                </td>
                <td className="p-4 text-gray-600 font-medium">
                  {prog._count.memberships}
                </td>
              </tr>
            ))}
            {result.items.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No programmes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
