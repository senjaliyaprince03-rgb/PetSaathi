import { CalendarDays, Syringe, Users } from "lucide-react";
import { redirect } from "next/navigation";

import { DashboardEmptyState, DashboardHeading, DashboardPanel, MetricCard, StatusPill } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { AdminCampForm } from "./admin-camp-form";

export const dynamic = "force-dynamic";

export default async function AdminVaccinationCampsPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["OPERATIONS_ADMIN", "SUPER_ADMIN"])) {
    redirect("/login?returnTo=/admin/vaccination-camps");
  }

  // Fetch camps (simulated by SocietyEvent containing 'Vaccination' in title)
  const camps = await prisma.societyEvent.findMany({
    where: { title: { contains: "Vaccination", mode: "insensitive" } },
    orderBy: { startsAt: "desc" },
    include: { society: { select: { name: true } } }
  });

  const now = new Date();
  const upcomingCamps = camps.filter(c => c.startsAt > now);
  
  // We simulate total registrations. In reality we'd join PartnerOrders with campId metadata
  const totalCamps = camps.length;

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/80">preventive care</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Vaccination Camps</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/80 mb-10">Manage community vaccination camps, partner vet assignments, and monitor registration capacity.</p>
        
        <div className="grid gap-4 sm:grid-cols-3 mb-10">
          <MetricCard icon={CalendarDays} label="Total Camps" value={totalCamps.toString()} hint="All time" tone="indigo" />
          <MetricCard icon={Syringe} label="Upcoming Camps" value={upcomingCamps.length.toString()} hint="Scheduled" tone="leaf" />
          <MetricCard icon={Users} label="Total Capacity" value={camps.reduce((acc, c) => acc + (c.capacity || 0), 0).toString()} hint="Max pets" tone="saffron" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <DashboardPanel>
            <DashboardHeading eyebrow="Management" title="Create Vaccination Camp" description="Schedule a new camp for a specific society." />
            <AdminCampForm />
          </DashboardPanel>

          <div className="space-y-4">
            <h3 className="font-display text-2xl font-semibold">Camp Roster</h3>
            {camps.length ? (
              camps.map(camp => (
                <article key={camp.id} className="rounded-2xl border border-ink/10 bg-paper p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{camp.title}</h4>
                      <p className="text-xs text-ink/80">{camp.society?.name ?? "Unknown Society"}</p>
                    </div>
                    <StatusPill status={camp.status} />
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm mt-4">
                    <span className="flex items-center gap-1.5 text-ink/80">
                      <CalendarDays className="w-4 h-4 text-indigo" />
                      {camp.startsAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </span>
                    <span className="flex items-center gap-1.5 text-ink/80">
                      <Users className="w-4 h-4 text-leaf" />
                      Capacity: {camp.capacity ?? "N/A"}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <DashboardEmptyState icon={Syringe} title="No camps scheduled" description="Create your first vaccination camp using the form." compact />
            )}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
