import { Activity, ArrowRight, CalendarClock, FileHeart, HeartPulse, Plus, ShieldCheck, Syringe } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardEmptyState, DashboardHeading, DashboardPanel, MetricCard } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function PetsPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/pets");

  const pets = await prisma.pet.findMany({
    where: { ownerId: identity.id, active: true },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      species: true,
      breed: true,
      birthDate: true,
      weightKg: true,
      medicalProfile: { select: { allergies: true, conditions: true } },
      _count: { select: { careInstructions: true, medications: true, vaccinations: true, healthEvents: true } },
    },
  });

  const totalRecords = pets.reduce((sum, pet) => sum + pet._count.careInstructions + pet._count.medications + pet._count.vaccinations + pet._count.healthEvents, 0);
  const careReady = pets.filter((pet) => pet.breed && pet.birthDate && pet.weightKg && pet.medicalProfile).length;

  return (
    <PortalShell mode="customer" displayName={identity.displayName} showSummaryCards={false}>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <MetricCard icon={FileHeart} label="Pet passports" value={`${pets.length} active`} hint="Private profiles available for care" />
        <MetricCard icon={ShieldCheck} label="Care ready" value={`${careReady} complete`} hint="Core identity and medical context" tone="leaf" />
        <MetricCard icon={HeartPulse} label="Health records" value={`${totalRecords} entries`} hint="Routines, medicines and events" tone="coral" />
      </div>

      <DashboardPanel className="mt-5">
        <DashboardHeading
          eyebrow="Pet passport collection"
          title="Every pet, beautifully organised."
          description="A profile-first layout keeps health context, routines and the next useful action visible without turning care into a spreadsheet."
          action={<Link href="/pets/new" className={buttonVariants({ variant: "accent" })}><Plus className="h-4 w-4" />Add a pet</Link>}
        />

        {pets.length ? (
          <div className="mt-7 grid gap-5 xl:grid-cols-2">
            {pets.map((pet, index) => {
              const records = pet._count.careInstructions + pet._count.medications + pet._count.vaccinations + pet._count.healthEvents;
              const signals = [pet.breed, pet.birthDate, pet.weightKg, pet.medicalProfile].filter(Boolean).length;
              const readiness = Math.round((signals / 4) * 100);
              const age = pet.birthDate ? Math.max(0, new Date().getFullYear() - pet.birthDate.getFullYear()) : null;
              return (
                <Link
                  key={pet.id}
                  href={`/pets/${pet.id}`}
                  className="group relative overflow-hidden rounded-[2rem] border border-ink/[0.07] bg-cream/45 p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo/20 hover:bg-paper hover:shadow-soft sm:p-6"
                  data-motion="rise"
                >
                  <div className={`absolute right-0 top-0 h-36 w-36 translate-x-1/3 -translate-y-1/3 rounded-full blur-3xl ${index % 2 ? "bg-coral/15" : "bg-indigo/15"}`} />
                  <div className="relative flex items-start justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <span className={`flex h-16 w-16 items-center justify-center rounded-[1.4rem] ${index % 2 ? "bg-coral/10 text-coral" : "bg-indigo/10 text-indigo"}`}>
                        <Activity className="h-7 w-7" />
                      </span>
                      <div>
                        <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-ink/35">{pet.species.toLowerCase()} passport</p>
                        <h2 className="mt-1 font-display text-3xl font-semibold tracking-[-0.04em]">{pet.name}</h2>
                        <p className="mt-1 text-xs text-ink/45">{pet.breed ?? "Breed not recorded"}{age !== null ? ` · ${age}y` : ""}</p>
                      </div>
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper text-ink/35 shadow-sm transition group-hover:bg-indigo group-hover:text-paper"><ArrowRight className="h-4 w-4" /></span>
                  </div>

                  <div className="relative mt-6 grid grid-cols-3 gap-2">
                    <PetSignal icon={FileHeart} label="Care notes" value={pet._count.careInstructions} />
                    <PetSignal icon={Syringe} label="Vaccines" value={pet._count.vaccinations} />
                    <PetSignal icon={HeartPulse} label="Health" value={pet._count.healthEvents + pet._count.medications} />
                  </div>

                  <div className="relative mt-5 rounded-2xl border border-ink/[0.06] bg-paper/75 p-4">
                    <div className="flex items-center justify-between gap-3 text-xs"><span className="font-bold">Passport readiness</span><span className="font-bold text-leaf">{readiness}%</span></div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/[0.06]"><div className="h-full rounded-full bg-gradient-to-r from-indigo to-leaf" style={{ width: `${readiness}%` }} /></div>
                    <p className="mt-3 flex items-center gap-2 text-[0.68rem] text-ink/42"><CalendarClock className="h-3.5 w-3.5 text-coral" />{records ? `${records} structured records ready for review` : "Add health and routine records before the next request"}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-7">
            <DashboardEmptyState icon={Activity} title="Create the first pet passport." description="Add identity, routine and health context once, then reuse it safely across future care requests." action={<Link href="/pets/new" className={buttonVariants({ variant: "accent" })}><Plus className="h-4 w-4" />Add your pet</Link>} />
          </div>
        )}
      </DashboardPanel>
    </PortalShell>
  );
}

function PetSignal({ icon: Icon, label, value }: { icon: typeof FileHeart; label: string; value: number }) {
  return <div className="rounded-2xl bg-paper/80 p-3"><Icon className="h-4 w-4 text-indigo" /><p className="mt-3 font-display text-xl font-semibold">{value}</p><p className="mt-0.5 text-[0.6rem] font-semibold text-ink/40">{label}</p></div>;
}
