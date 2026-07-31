import { notFound, redirect } from 'next/navigation';
import React from 'react';

import { PortalShell } from '@/components/portal/portal-shell';
import { prisma } from '@/lib/db';
import { getCurrentIdentity, hasAnyRole } from '@/modules/auth/session';

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login?returnTo=/admin/partners");
  if (!hasAnyRole(identity, ["PARTNER_MANAGER", "SUPER_ADMIN"])) notFound();

  const partners = await prisma.partner.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="mt-5">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">Partner Verification & Registry</h1>
        <p className="mt-3 text-sm leading-6 text-ink/60">
          Review the current partner registry. Operational partner changes are handled through the verified onboarding workflow.
        </p>
        
        <div className="mt-8 overflow-hidden rounded-4xl border border-indigo/10 bg-paper shadow-lifted">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-indigo/10 bg-cream/30">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Partner</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Category</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo/5">
                {partners.map((partner) => {
                  const meta = (partner.metadata || {}) as { registrationNumber?: string };
                  return (
                    <tr key={partner.id} className="transition-colors hover:bg-cream/20">
                      <td className="px-6 py-5">
                        <div className="font-semibold text-ink">
                          {partner.displayName}
                        </div>
                        <div className="mt-1 text-sm text-ink/60">{partner.contactEmail}</div>
                        {meta.registrationNumber && (
                          <div className="mt-2 inline-flex rounded-md bg-indigo/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo">
                            Reg: {meta.registrationNumber}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-medium text-ink/75">
                          {partner.category.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          partner.status === "ACTIVE" 
                            ? "bg-leaf/10 text-leaf" 
                            : "bg-saffron/20 text-saffron-dark"
                        }`}>
                          {partner.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {partners.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-sm font-medium text-ink/60">
                      No partners found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
