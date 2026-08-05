import { CalendarClock, HeartPulse, History, PawPrint, ShieldAlert, Stethoscope } from "lucide-react";
import { redirect } from "next/navigation";

import { VetTriageForm } from "@/components/forms/vet-triage-form";
import { DashboardEmptyState, DashboardHeading, DashboardPanel, MetricCard, StatusPill } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function CustomerVetPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/customer/vet");

  const [pets, orders, vaccinations] = await Promise.all([
    prisma.pet.findMany({
      where: { ownerId: identity.id, active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.partnerOrder.findMany({
      where: {
        customerId: identity.id,
        partnerService: { serviceCode: "VET_SUPPORT" },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        reference: true,
        status: true,
        scheduledAt: true,
        createdAt: true,
        metadata: true,
        pet: { select: { name: true } },
      },
    }),
    prisma.vaccination.findMany({
      where: { pet: { ownerId: identity.id } },
      orderBy: { administeredAt: "desc" },
      take: 10,
      select: { id: true, vaccine: true, administeredAt: true, nextDueAt: true, pet: { select: { name: true } } },
    }),
  ]);

  const activeCount = orders.filter((o) => !["COMPLETED", "CANCELLED", "REJECTED"].includes(o.status)).length;

  return (
    <PortalShell mode="customer" displayName={identity.displayName} showSummaryCards={false}>
      {/* Emergency Notice Banner */}
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
        <ShieldAlert className="h-5 w-5 shrink-0 text-red-600" />
        <p className="text-xs leading-5">
          <strong className="font-semibold">Emergency Notice:</strong> Online support is not an emergency service. For life-threatening conditions (collapse, breathing trouble, severe bleeding), visit your nearest veterinary clinic immediately.
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <MetricCard icon={Stethoscope} label="Consultations" value={`${orders.length} total`} hint="Veterinary support requests" tone="leaf" />
        <MetricCard icon={CalendarClock} label="Active requests" value={`${activeCount} in progress`} hint="Vet coordination" tone="coral" />
        <MetricCard icon={HeartPulse} label="Vaccinations" value={`${vaccinations.length} recorded`} hint="Up-to-date health records" tone="indigo" />
      </div>

      <VetTriageForm pets={pets} />

      {/* Vaccination Records Section */}
      <DashboardPanel className="mt-7">
        <DashboardHeading eyebrow="Preventive care" title="Pet vaccination records" description="Keep track of annual rabies and multi-component vaccine dates and next-due reminders." />
        {vaccinations.length ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {vaccinations.map((v) => (
              <div key={v.id} className="rounded-2xl border border-ink/10 bg-paper p-4">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm">{v.vaccine}</p>
                  <span className="text-xs font-semibold text-leaf bg-leaf/10 px-2 py-0.5 rounded-full">{v.pet.name}</span>
                </div>
                <p className="mt-2 text-xs text-ink/50">Administered: {v.administeredAt.toLocaleDateString("en-IN")}</p>
                {v.nextDueAt && <p className="mt-1 text-xs font-bold text-coral">Next due: {v.nextDueAt.toLocaleDateString("en-IN")}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 text-sm text-ink/50">No vaccination records uploaded yet. Register for a society camp or upload via profile.</div>
        )}
      </DashboardPanel>

      <DashboardPanel className="mt-7" tone="lavender">
        <DashboardHeading eyebrow="Consultation history" title="Past vet requests" description="Review past veterinary support and consultation requests." />
        {orders.length ? (
          <div className="mt-7 grid gap-3">
            {orders.map((order) => (
              <article key={order.id} className="rounded-[1.5rem] border border-ink/[0.06] bg-paper/90 p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-coral">{order.reference}</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold">Vet Consultation Request</h3>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-ink/42">
                      <span className="flex items-center gap-1.5"><PawPrint className="h-3.5 w-3.5 text-indigo" />{order.pet?.name ?? "Pet"}</span>
                      <span className="flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5 text-indigo" />{order.scheduledAt ? order.scheduledAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Timing unconfirmed"}</span>
                    </div>
                  </div>
                  <StatusPill status={order.status} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-7">
            <DashboardEmptyState icon={History} title="No consultation history." description="Submit a vet support request above when needed." />
          </div>
        )}
      </DashboardPanel>
    </PortalShell>
  );
}
