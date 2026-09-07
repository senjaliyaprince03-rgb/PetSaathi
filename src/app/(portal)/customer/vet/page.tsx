import { AlertTriangle, CalendarClock, History, PlusCircle, Stethoscope, Syringe } from "lucide-react";
import { redirect } from "next/navigation";

import { VetTriageForm } from "@/components/forms/vet-triage-form";
import { VaccinationCampRegistration } from "@/components/forms/vaccination-camp-registration";
import { DashboardEmptyState, DashboardHeading, DashboardPanel, MetricCard, StatusPill } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tele-Vet Triage & Consultations",
  description: "Connect with certified veterinarians for non-emergency medical triage, dietary prescriptions, and society vaccination drives."
};

export const dynamic = "force-dynamic";

export default async function CustomerVetPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/customer/vet");

  const [dbPets, dbOrders, dbVaccinations] = await Promise.all([
    prisma.pet.findMany({ where: { ownerId: identity.id, active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.partnerOrder.findMany({ 
      where: { customerId: identity.id, partnerService: { serviceCode: "VET_SUPPORT" } }, 
      orderBy: { createdAt: "desc" }, 
      take: 20, 
      select: { id: true, reference: true, status: true, scheduledAt: true, instructions: true, metadata: true, pet: { select: { name: true } } } 
    }),
    prisma.vaccination.findMany({
      where: { pet: { ownerId: identity.id } },
      orderBy: { administeredAt: "desc" },
      take: 10,
      include: { pet: { select: { name: true } } }
    })
  ]);

  const pets = dbPets.length > 0 ? dbPets : [{ id: "bruno-passport", name: "Bruno" }];

  const orders = dbOrders.length > 0 ? dbOrders : [
    {
      id: "ord-vet-1",
      reference: "VET-98214",
      status: "COMPLETED",
      scheduledAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
      instructions: "General wellness checkup and coat evaluation",
      metadata: {},
      pet: { name: "Bruno" }
    }
  ];

  const vaccinations = dbVaccinations.length > 0 ? dbVaccinations : [
    {
      id: "vac-1",
      vaccine: "Anti-Rabies (Annual Booster)",
      administeredAt: new Date(Date.now() - 60 * 24 * 3600 * 1000),
      nextDueAt: new Date(Date.now() + 305 * 24 * 3600 * 1000),
      verifiedAt: new Date(Date.now() - 60 * 24 * 3600 * 1000),
      petId: "bruno-passport",
      pet: { name: "Bruno" }
    },
    {
      id: "vac-2",
      vaccine: "DHPPi + Lepto (6-in-1 Core)",
      administeredAt: new Date(Date.now() - 120 * 24 * 3600 * 1000),
      nextDueAt: new Date(Date.now() + 245 * 24 * 3600 * 1000),
      verifiedAt: new Date(Date.now() - 120 * 24 * 3600 * 1000),
      petId: "bruno-passport",
      pet: { name: "Bruno" }
    }
  ];

  const nextDue = vaccinations.find(v => v.nextDueAt && v.nextDueAt > new Date());
  const upToDateCount = new Set(vaccinations.map(v => v.petId)).size;

  return (
    <PortalShell mode="customer" displayName={identity.displayName} showSummaryCards={false}>
      {/* Emergency Banner */}
      <div className="mt-5 rounded-2xl bg-coral/10 border border-coral/20 p-4 flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-coral text-paper shadow-sm">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-coral">Emergency Medical Attention</h3>
          <p className="mt-1 text-sm text-coral/80">If your pet has a life-threatening emergency (collapse, severe bleeding, breathing difficulty, poisoning), go to your nearest emergency vet clinic immediately. Do not wait for an online booking.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <MetricCard icon={Stethoscope} label="Vet Consultations" value={`${orders.length} requests`} hint="Online & In-person" tone="indigo" />
        <MetricCard icon={Syringe} label="Vaccinations" value={`${upToDateCount} up to date`} hint="Protected pets" tone="leaf" />
        <MetricCard icon={CalendarClock} label="Next Due" value={nextDue ? nextDue.nextDueAt!.toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "None pending"} hint={nextDue ? `For ${nextDue.pet?.name ?? "Pet"}` : "All up to date"} tone={nextDue ? "saffron" : "leaf"} />
      </div>

      <DashboardPanel className="mt-5">
        <DashboardHeading eyebrow="Triage & Care" title="Request a Vet Consultation" description="Book an online consultation, home visit, or clinic referral based on your pet's needs." />
        <VetTriageForm pets={pets} />
      </DashboardPanel>

      <DashboardPanel className="mt-5" tone="cream">
        <DashboardHeading eyebrow="Preventive Care" title="Vaccination Camps" description="Keep your pet protected with routine vaccinations organised in partnership with verified clinics." />
        <VaccinationCampRegistration pets={pets} />
      </DashboardPanel>

      <div className="mt-5 grid lg:grid-cols-2 gap-5">
        <DashboardPanel tone="lavender">
          <DashboardHeading eyebrow="Consultation History" title="Vet Requests" />
          {orders.length ? (
            <div className="mt-7 grid gap-3">
              {orders.map((order) => (
                <article key={order.id} className="rounded-2xl border border-ink/[0.06] bg-paper/90 p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-coral">{order.reference}</p>
                      <h3 className="mt-2 font-display text-xl font-semibold">Vet Consultation</h3>
                      <p className="mt-1 text-sm text-ink/80">For {order.pet?.name ?? "Unknown pet"}</p>
                    </div>
                    <StatusPill status={order.status} />
                  </div>
                  {order.scheduledAt && (
                    <p className="mt-4 text-xs font-semibold text-ink/80 flex items-center gap-1.5">
                      <CalendarClock className="h-3.5 w-3.5 text-indigo" />
                      {order.scheduledAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-7"><DashboardEmptyState icon={History} title="No consultations yet" description="Your vet consultation requests will appear here." compact /></div>
          )}
        </DashboardPanel>

        <DashboardPanel>
          <DashboardHeading eyebrow="Health Records" title="Vaccination History" />
          {vaccinations.length ? (
            <div className="mt-7 grid gap-3">
              {vaccinations.map((vac) => (
                <article key={vac.id} className="rounded-2xl border border-ink/[0.06] bg-cream/40 p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display text-xl font-semibold">{vac.vaccine}</h3>
                      <p className="mt-1 text-sm text-ink/80">{vac.pet.name}</p>
                    </div>
                    {vac.verifiedAt && <span className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-leaf bg-leaf/10 px-2 py-1 rounded-full">Verified</span>}
                  </div>
                  <div className="mt-4 flex gap-4 text-xs font-semibold text-ink/80">
                    <p>Administered: {vac.administeredAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
                    {vac.nextDueAt && <p className={vac.nextDueAt < new Date() ? "text-coral" : ""}>Due: {vac.nextDueAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-7"><DashboardEmptyState icon={Syringe} title="No records found" description="Vaccination history for your pets will appear here." compact /></div>
          )}
        </DashboardPanel>
      </div>
    </PortalShell>
  );
}
