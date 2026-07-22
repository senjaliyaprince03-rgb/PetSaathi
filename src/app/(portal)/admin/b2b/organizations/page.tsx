import { redirect } from "next/navigation";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { listOrganizations } from "@/modules/b2b/organizations";

export const dynamic = "force-dynamic";

export default async function OrganizationsPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["PARTNER_MANAGER", "SUPER_ADMIN"])) {
    redirect("/login?returnTo=/admin/b2b/organizations");
  }

  const result = await listOrganizations({ page: 1, pageSize: 50 });

  return (
    <div className="container-shell">
      <h1 className="section-title mb-6">Organizations</h1>
      <div className="bg-paper shadow rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-700">Name</th>
              <th className="p-4 font-semibold text-gray-700">Type</th>
              <th className="p-4 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((org) => (
              <tr key={org.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium text-gray-900">{org.displayName}</div>
                  <div className="text-sm text-gray-500">{org.legalName}</div>
                </td>
                <td className="p-4 text-gray-600">{org.organizationType}</td>
                <td className="p-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {org.status}
                  </span>
                </td>
              </tr>
            ))}
            {result.items.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No organizations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
