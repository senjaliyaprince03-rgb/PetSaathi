import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
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
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="mt-5">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">Enterprise Invoices</h1>
        
        <div className="mt-8 overflow-hidden rounded-4xl border border-indigo/10 bg-paper shadow-lifted">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-indigo/10 bg-cream/30">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Invoice Number</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Organization</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Total Amount</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo/5">
                {result.items.map((inv) => (
                  <tr key={inv.id} className="transition-colors hover:bg-cream/20">
                    <td className="px-6 py-5">
                      <div className="font-semibold text-ink">{inv.invoiceNumber}</div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-ink/75">{inv.organization.displayName}</td>
                    <td className="px-6 py-5 font-semibold text-ink">
                      ₹{(inv.totalAmount / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        inv.status === 'PAID' ? 'bg-leaf/10 text-leaf' :
                        inv.status === 'OVERDUE' ? 'bg-coral/10 text-coral' :
                        'bg-saffron/20 text-saffron-dark'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-ink/60">
                      {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-IN") : "N/A"}
                    </td>
                  </tr>
                ))}
                {result.items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm font-medium text-ink/60">
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex flex-col divide-y divide-indigo/5 md:hidden">
            {result.items.map((inv) => (
              <div key={inv.id} className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink">{inv.invoiceNumber}</span>
                  <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold ${
                        inv.status === 'PAID' ? 'bg-leaf/10 text-leaf' :
                        inv.status === 'OVERDUE' ? 'bg-coral/10 text-coral' :
                        'bg-saffron/20 text-saffron-dark'
                      }`}>
                    {inv.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-ink/75">{inv.organization.displayName}</div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="font-semibold text-ink">
                    ₹{(inv.totalAmount / 100).toFixed(2)}
                  </div>
                  <div className="text-xs text-ink/60">
                    Due: {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-IN") : "N/A"}
                  </div>
                </div>
              </div>
            ))}
            {result.items.length === 0 && (
              <div className="p-10 text-center text-sm font-medium text-ink/60">
                No invoices found.
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
