import { redirect } from "next/navigation";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { listInvoices } from "@/modules/b2b/invoicing";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["FINANCE_ADMIN", "SUPER_ADMIN"])) {
    redirect("/login?returnTo=/admin/b2b/invoices");
  }

  const result = await listInvoices({ page: 1, pageSize: 50 });

  return (
    <div className="container-shell">
      <h1 className="section-title mb-6">Enterprise Invoices</h1>
      <div className="bg-paper shadow rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-700">Invoice Number</th>
              <th className="p-4 font-semibold text-gray-700">Organization</th>
              <th className="p-4 font-semibold text-gray-700">Total Amount</th>
              <th className="p-4 font-semibold text-gray-700">Status</th>
              <th className="p-4 font-semibold text-gray-700">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((inv) => (
              <tr key={inv.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium text-gray-900">{inv.invoiceNumber}</div>
                </td>
                <td className="p-4 text-gray-600">{inv.organization.displayName}</td>
                <td className="p-4 text-gray-900 font-medium">
                  ₹{(inv.totalAmount / 100).toFixed(2)}
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    {inv.status}
                  </span>
                </td>
                <td className="p-4 text-gray-600">
                  {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "N/A"}
                </td>
              </tr>
            ))}
            {result.items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
