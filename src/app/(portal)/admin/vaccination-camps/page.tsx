import { Building2, Calendar, Syringe } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { DashboardHeading, DashboardPanel, MetricCard } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminVaccinationCampsPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login?returnTo=/admin/vaccination-camps");
  if (!hasAnyRole(identity, ["OPERATIONS_ADMIN", "SUPER_ADMIN", "PARTNER_MANAGER", "SOCIETY_MANAGER"])) notFound();

  const [allEvents, societies] = await Promise.all([
    prisma.societyEvent.findMany({
      orderBy: { startsAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        startsAt: true,
        endsAt: true,
        capacity: true,
        status: true,
        metadata: true,
        society: { select: { name: true } },
      },
    }),
    prisma.society.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true },
    }),
  ]);

  const camps = allEvents.filter((e) => {
    const meta = (e.metadata || {}) as Record<string, unknown>;
    return meta.category === "VACCINATION" || e.title.toLowerCase().includes("vaccin");
  });

  const activeCamps = camps.filter((c) => c.status === "ACTIVE").length;

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <MetricCard icon={Syringe} label="Total camps" value={`${camps.length} drives`} hint="Society vaccination drives" tone="leaf" />
        <MetricCard icon={Calendar} label="Active drives" value={`${activeCamps} open`} hint="Registration open for residents" tone="saffron" />
        <MetricCard icon={Building2} label="Partner societies" value={`${societies.length} linked`} hint="Eligible RWAs" tone="indigo" />
      </div>

      <DashboardPanel className="mt-7">
        <DashboardHeading
          eyebrow="Vaccination Drives"
          title="Society Vaccination Camps"
          description="Manage RWA vaccination drives organized with local veterinary partners."
        />

        <div className="mt-8 overflow-hidden rounded-4xl border border-indigo/10 bg-paper shadow-lifted">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-indigo/10 bg-cream/30">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Camp Drive</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Society</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Date</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo/5">
                {camps.map((camp) => {
                  const meta = (camp.metadata || {}) as { location?: string };
                  return (
                    <tr key={camp.id} className="transition-colors hover:bg-cream/20">
                      <td className="px-6 py-5">
                        <div className="font-semibold text-ink">{camp.title}</div>
                        <div className="mt-1 text-xs text-ink/60">{meta.location || "Society grounds"}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-medium text-ink/75">{camp.society?.name ?? "Linked Society"}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs text-ink/60">{new Date(camp.startsAt).toLocaleDateString("en-IN")}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${camp.status === "ACTIVE" ? "bg-leaf/10 text-leaf" : "bg-ink/10 text-ink/50"}`}>
                          {camp.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {camps.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm font-medium text-ink/60">
                      No vaccination camps scheduled yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardPanel>
    </PortalShell>
  );
}
