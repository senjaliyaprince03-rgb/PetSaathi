import { Activity, AlertCircle, ArrowLeft, CalendarDays, CreditCard, PawPrint, Pill, ShieldCheck } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { MedicationStatusButton } from "@/components/portal/medication-status-button";
import { PetHealthRecordForms } from "@/components/portal/pet-health-record-forms";
import { PortalShell } from "@/components/portal/portal-shell";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  const { id } = await params;
  if (!identity?.roles.includes("CUSTOMER")) redirect(`/login?returnTo=/pets/${id}`);
  const pet = await prisma.pet.findFirst({
    where: { id, ownerId: identity.id, active: true },
    include: {
      medicalProfile: true,
      emergencyContacts: { orderBy: { priority: "asc" } },
      careInstructions: { orderBy: { version: "desc" }, take: 3 },
      medications: { orderBy: [{ active: "desc" }, { createdAt: "desc" }], take: 25 },
      vaccinations: { orderBy: { administeredAt: "desc" }, take: 25 },
      healthEvents: { orderBy: { occurredAt: "desc" }, take: 30 }
    }
  });
  if (!pet) notFound();
  const activeCare = pet.careInstructions.find((item) => !item.activeUntil);
  const care = object(activeCare?.instructions);

  return (
    <PortalShell mode="customer" displayName={identity.displayName} metrics={[`${pet.medications.filter((item) => item.active).length} active medication${pet.medications.filter((item) => item.active).length === 1 ? "" : "s"}`, `${pet.vaccinations.length} vaccination record${pet.vaccinations.length === 1 ? "" : "s"}`, `${pet.healthEvents.length} timeline event${pet.healthEvents.length === 1 ? "" : "s"}`]}>
      <div className="mt-5">
        <Link href="/pets" className={buttonVariants({ variant: "ghost", size: "sm" })}><ArrowLeft className="h-4 w-4" />My pets</Link>
        <section className="luxury-grid relative mt-5 overflow-hidden rounded-5xl border border-indigo/10 bg-gradient-to-br from-paper via-[#f3eafa] to-[#fff0e8] p-7 shadow-soft sm:p-10">
          <div className="absolute -right-14 -top-14 h-52 w-52 rounded-full bg-coral/10 blur-3xl" />
          <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center">
            <span className="flex h-28 w-28 shrink-0 items-center justify-center rounded-[2.25rem] bg-indigo text-paper shadow-soft"><PawPrint className="h-12 w-12" strokeWidth={1.5} /></span>
            <div><p className="eyebrow">Digital pet passport</p><h1 className="mt-4 font-display text-6xl font-semibold leading-none tracking-[-0.055em]">{pet.name}</h1><p className="mt-3 text-ink/55">{pet.species.toLowerCase()}{pet.breed ? ` · ${pet.breed}` : ""}{pet.weightKg ? ` · ${pet.weightKg.toString()} kg` : ""}</p><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-leaf/10 px-3 py-1.5 text-xs font-bold text-leaf">Private record</span><span className="rounded-full bg-indigo/10 px-3 py-1.5 text-xs font-bold text-indigo">ID · {pet.id.slice(0, 8).toUpperCase()}</span></div><Link href={`/pets/${pet.id}/id-card` as Route} className={`${buttonVariants({ variant: "outline", size: "sm" })} mt-5`}><CreditCard className="h-4 w-4" />Open digital ID card</Link></div>
          </div>
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <InfoCard icon={AlertCircle} title="Medical snapshot"><p>Allergies: {pet.medicalProfile?.allergies || "None recorded"}</p><p>Conditions: {pet.medicalProfile?.conditions || "None recorded"}</p></InfoCard>
          <InfoCard icon={ShieldCheck} title="Emergency contact">{pet.emergencyContacts[0] ? <><p>{pet.emergencyContacts[0].name}</p><p>{pet.emergencyContacts[0].phone}</p></> : <p>No contact recorded.</p>}</InfoCard>
          <InfoCard icon={Activity} title="Current routine">{activeCare ? <><p>Version {activeCare.version}</p><p>{text(care.feedingRoutine) || "Feeding routine recorded."}</p></> : <p>No structured routine yet.</p>}</InfoCard>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          <section className="rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted">
            <h2 className="font-display text-3xl font-semibold">Medication and vaccination</h2>
            <div className="mt-5 grid gap-3">
              {pet.medications.map((item) => <article key={item.id} className="rounded-2xl bg-cream/45 p-4"><div className="flex items-center justify-between gap-3"><p className="flex items-center gap-2 font-semibold"><Pill className="h-4 w-4 text-coral" />{item.name}</p><span className={`rounded-full px-3 py-1 text-xs font-bold ${item.active ? "bg-leaf/10 text-leaf" : "bg-ink/5 text-ink/55"}`}>{item.active ? "ACTIVE" : "ENDED"}</span></div><p className="mt-2 text-sm text-ink/70">{item.dosage} · {item.schedule}</p>{item.active && <MedicationStatusButton petId={pet.id} medicationId={item.id} />}</article>)}
              {pet.vaccinations.map((item) => <article key={item.id} className="rounded-2xl bg-indigo/5 p-4"><p className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4 text-indigo" />{item.vaccine}</p><p className="mt-2 text-sm text-ink/70">Given {item.administeredAt.toLocaleDateString("en-IN")}{item.nextDueAt ? ` · due ${item.nextDueAt.toLocaleDateString("en-IN")}` : ""}</p></article>)}
              {!pet.medications.length && !pet.vaccinations.length && <p className="text-sm text-ink/65">No structured medication or vaccination records.</p>}
            </div>
          </section>
          <section className="rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted">
            <h2 className="font-display text-3xl font-semibold">Health timeline</h2>
            <div className="mt-5 grid gap-3">{pet.healthEvents.length ? pet.healthEvents.map((event) => <article key={event.id} className="rounded-2xl border-l-4 border-saffron bg-cream/40 p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-coral">{event.eventType.replaceAll("_", " ")}</p><p className="mt-2 font-semibold">{event.summary}</p><p className="mt-2 flex items-center gap-2 text-xs text-ink/60"><CalendarDays className="h-3.5 w-3.5" />{event.occurredAt.toLocaleString("en-IN")}</p></article>) : <p className="text-sm text-ink/65">No timeline events recorded.</p>}</div>
          </section>
        </div>
        <PetHealthRecordForms petId={pet.id} />
        <p className="mt-5 rounded-3xl border border-saffron/20 bg-saffron/8 p-5 text-sm leading-6 text-ink/75"><strong>Medical disclaimer:</strong> These records organise information supplied by the pet parent. They do not replace veterinary advice, diagnosis, prescriptions or emergency treatment.</p>
      </div>
    </PortalShell>
  );
}

function InfoCard({ icon: Icon, title, children }: { icon: typeof Activity; title: string; children: React.ReactNode }) {
  return <section className="rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo/10 text-indigo"><Icon className="h-5 w-5" /></span><h2 className="mt-5 font-display text-2xl font-semibold">{title}</h2><div className="mt-3 grid gap-2 text-sm leading-6 text-ink/60">{children}</div></section>;
}

function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}
