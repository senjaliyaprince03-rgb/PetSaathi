import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { resolveTerritoryScope } from "@/modules/rbac/territory-scope";

export default async function OperatorEconomicsPage() {
  const identity = await getCurrentIdentity();
  if (!identity) return redirect("/login");
  if (!hasAnyRole(identity, ["OPERATOR", "CITY_MANAGER", "SUPER_ADMIN"])) {
    return (
      <PortalShell mode="operator" displayName={identity.displayName}>
        <div className="mt-5 max-w-3xl">
          <h1 className="font-display text-4xl font-semibold tracking-[-0.04em] text-coral">Access Denied</h1>
          <p className="mt-3 text-sm leading-6 text-ink/80">This page is only available to operating partners and city managers.</p>
        </div>
      </PortalShell>
    );
  }

  const scope = await resolveTerritoryScope(identity.id, identity.roles);

  const scopedCities = scope.unrestricted
    ? await prisma.city.findMany({ take: 20, orderBy: { name: "asc" } })
    : await prisma.city.findMany({ where: { id: { in: scope.cityIds } }, orderBy: { name: "asc" } });

  const financialRecords = await prisma.cityFinancialRecord.findMany({
    where: { cityId: { in: scopedCities.map((c) => c.id) } },
    orderBy: [{ periodYear: "desc" }, { periodMonth: "desc" }],
    distinct: ["cityId"],
  });

  const financialByCity = new Map(financialRecords.map((fr) => [fr.cityId, fr]));

  // Aggregate totals
  const totalGbv = financialRecords.reduce((sum, fr) => sum + Number(fr.gbvPaise), 0);
  const totalCm2 = financialRecords.reduce((sum, fr) => sum + Number(fr.cm2Paise), 0);
  const totalBookings = financialRecords.reduce((sum, fr) => sum + fr.totalBookings, 0);

  return (
    <PortalShell mode="operator" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/80">financial performance</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Economics</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/80 mb-10">Revenue, contribution margin, and booking volume across your territories.</p>

        {/* Aggregate KPIs */}
        <div className="grid gap-5 sm:grid-cols-3 mb-10">
          <div className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
            <DollarSign className="h-5 w-5 text-indigo" />
            <p className="mt-4 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-ink/80">Total GBV</p>
            <p className="mt-1 font-display text-3xl font-semibold">₹{(totalGbv / 100).toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
            {totalCm2 >= 0 ? <TrendingUp className="h-5 w-5 text-leaf" /> : <TrendingDown className="h-5 w-5 text-coral" />}
            <p className="mt-4 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-ink/80">Total CM2</p>
            <p className={`mt-1 font-display text-3xl font-semibold ${totalCm2 >= 0 ? "text-leaf" : "text-coral"}`}>₹{(totalCm2 / 100).toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
            <DollarSign className="h-5 w-5 text-saffron" />
            <p className="mt-4 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-ink/80">Total Bookings</p>
            <p className="mt-1 font-display text-3xl font-semibold">{totalBookings.toLocaleString()}</p>
          </div>
        </div>

        {/* City-level table */}
        {scopedCities.length > 0 ? (
          <div className="rounded-4xl border border-ink/10 bg-paper shadow-lifted overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-indigo/10 bg-cream/30">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/80">City</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/80">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.16em] text-ink/80">GBV</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.16em] text-ink/80">CM2</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.16em] text-ink/80">Bookings</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.16em] text-ink/80">Period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo/5">
                  {scopedCities.map((city) => {
                    const fin = financialByCity.get(city.id);
                    return (
                      <tr key={city.id} className="transition-colors hover:bg-cream/20">
                        <td className="px-6 py-5 font-semibold text-ink">{city.name}</td>
                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-full bg-leaf/10 px-3 py-1 text-xs font-bold text-leaf">{city.status}</span>
                        </td>
                        <td className="px-6 py-5 text-right font-mono text-sm text-ink/80">
                          {fin ? `₹${(Number(fin.gbvPaise) / 100).toLocaleString()}` : "—"}
                        </td>
                        <td className="px-6 py-5 text-right font-mono text-sm">
                          {fin ? (
                            <span className={Number(fin.cm2Paise) >= 0 ? "text-leaf" : "text-coral"}>
                              ₹{(Number(fin.cm2Paise) / 100).toLocaleString()}
                            </span>
                          ) : <span className="text-ink/80">—</span>}
                        </td>
                        <td className="px-6 py-5 text-right font-mono text-sm text-ink/80">
                          {fin ? fin.totalBookings.toLocaleString() : "—"}
                        </td>
                        <td className="px-6 py-5 text-right text-sm text-ink/80">
                          {fin ? `${fin.periodMonth}/${fin.periodYear}` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-5xl p-10 text-center">
            <DollarSign className="mx-auto h-10 w-10 text-indigo/80" />
            <h2 className="mt-5 font-display text-3xl font-semibold">No financial data available.</h2>
            <p className="mt-2 text-sm text-ink/80">Economics data will populate once cities are assigned and bookings are processed.</p>
          </div>
        )}
      </div>
    </PortalShell>
  );
}
