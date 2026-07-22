import { Activity, ArrowRight, Plus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

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
    select: { id: true, name: true, species: true, breed: true, birthDate: true, weightKg: true, medicalProfile: { select: { allergies: true, conditions: true } }, _count: { select: { careInstructions: true, medications: true, vaccinations: true, healthEvents: true } } }
  });

  return <PortalShell mode="customer" displayName={identity.displayName}><section className="mt-5 rounded-4xl border border-ink/10 bg-paper p-6 sm:p-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="eyebrow">private care records</p><h2 className="mt-3 font-display text-4xl font-semibold">My pets</h2><p className="mt-2 text-sm leading-6 text-ink/70">Keep routines and health context current before requesting care.</p></div><Link href="/pets/new" className={buttonVariants({ variant: "accent" })}><Plus className="h-4 w-4" />Add a pet</Link></div><div className="mt-7 grid gap-4 md:grid-cols-2">{pets.length ? pets.map((pet) => { const recordCount = pet._count.careInstructions + pet._count.medications + pet._count.vaccinations + pet._count.healthEvents; return <Link key={pet.id} href={`/pets/${pet.id}`} className="group rounded-4xl border border-ink/10 bg-cream/35 p-6 transition hover:-translate-y-1 hover:border-indigo/30 hover:shadow-lifted"><div className="flex items-start justify-between gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo text-paper"><Activity className="h-5 w-5" /></span><ArrowRight className="h-5 w-5 text-ink/35 transition group-hover:translate-x-1 group-hover:text-coral" /></div><h3 className="mt-6 font-display text-3xl font-semibold">{pet.name}</h3><p className="mt-1 text-sm text-ink/65">{pet.species.toLowerCase()}{pet.breed ? ` · ${pet.breed}` : ""}</p><div className="mt-5 flex items-center gap-2 text-xs font-semibold text-leaf"><ShieldCheck className="h-4 w-4" />{recordCount} structured care record{recordCount === 1 ? "" : "s"}</div></Link>; }) : <div className="rounded-4xl border border-dashed border-ink/15 p-10 text-center md:col-span-2"><h3 className="font-display text-3xl font-semibold">Start with their essentials.</h3><p className="mt-3 text-sm text-ink/65">A private pet profile is required before booking.</p></div>}</div></section></PortalShell>;
}
