"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle, PawPrint } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";

const petFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your pet's name").max(80),
  species: z.enum(["DOG", "CAT", "OTHER"]),
  breed: z.string().trim().max(240).optional(),
  sex: z.enum(["FEMALE", "MALE", "UNKNOWN"]).optional(),
  birthDate: z.string().optional(),
  weightKg: z.coerce.number().positive().max(150).optional(),
  sterilised: z.boolean().optional(),
  allergies: z.string().trim().max(1000).optional(),
  conditions: z.string().trim().max(1000).optional(),
  medications: z.string().trim().max(1000).optional(),
  emergencyName: z.string().trim().max(120).optional(),
  emergencyPhone: z.string().trim().optional()
}).superRefine(({ emergencyName, emergencyPhone }, context) => {
  if (emergencyName && !/^\+?[1-9]\d{7,14}$/.test(emergencyPhone ?? "")) context.addIssue({ code: z.ZodIssueCode.custom, path: ["emergencyPhone"], message: "Add a valid emergency phone" });
});

type PetFormInput = z.infer<typeof petFormSchema>;

export function PetProfileForm({ pet }: { pet?: { id: string; name: string; species: "DOG" | "CAT" | "OTHER"; breed?: string | null; sex?: "FEMALE" | "MALE" | "UNKNOWN" | null; birthDate?: string | null; weightKg?: number | null; sterilised?: boolean | null; medical?: { allergies?: string | null; conditions?: string | null; medications?: string | null } | null; emergencyContact?: { name: string; phone: string } | null } }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<PetFormInput>({
    resolver: zodResolver(petFormSchema),
    defaultValues: pet ? {
      name: pet.name,
      species: pet.species,
      breed: pet.breed || "",
      sex: pet.sex || "UNKNOWN",
      birthDate: pet.birthDate ? pet.birthDate.split("T")[0] : "",
      weightKg: pet.weightKg || undefined,
      sterilised: pet.sterilised || false,
      allergies: pet.medical?.allergies || "",
      conditions: pet.medical?.conditions || "",
      medications: pet.medical?.medications || "",
      emergencyName: pet.emergencyContact?.name || "",
      emergencyPhone: pet.emergencyContact?.phone || ""
    } : { name: "", species: "DOG", breed: "", sex: "UNKNOWN", birthDate: "", allergies: "", conditions: "", medications: "", emergencyName: "", emergencyPhone: "" }
  });

  async function submit(values: PetFormInput) {
    setServerError(null);
    const url = pet ? `/api/pets/${pet.id}` : "/api/pets";
    const method = pet ? "PUT" : "POST";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        species: values.species,
        breed: values.breed || undefined,
        sex: values.sex,
        birthDate: values.birthDate || undefined,
        weightKg: Number.isFinite(values.weightKg) ? values.weightKg : undefined,
        sterilised: values.sterilised,
        medical: values.allergies || values.conditions || values.medications ? { allergies: values.allergies || undefined, conditions: values.conditions || undefined, medications: values.medications || undefined } : undefined,
        emergencyContact: values.emergencyName ? { name: values.emergencyName, phone: values.emergencyPhone } : undefined
      })
    });
    const result = await response.json().catch(() => null) as { message?: string; pet?: { id: string } } | null;
    if (!response.ok) {
      return setServerError(result?.message ?? "We could not save this profile. Check the details and try again.");
    }
    router.push(result?.pet?.id ? `/pets/${result.pet.id}` : "/pets");
    router.refresh();
  }

  return <form onSubmit={form.handleSubmit(submit)} className="glass-panel mx-auto max-w-4xl rounded-5xl p-6 sm:p-10" noValidate>
    <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron"><PawPrint className="h-6 w-6" /></span><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/45">Private pet record</p><h2 className="font-display text-3xl font-semibold">The essentials for thoughtful care</h2></div></div>
    {serverError && <p className="mt-6 rounded-2xl bg-coral/10 p-4 text-sm font-semibold text-coral" role="alert">{serverError}</p>}
    <div className="mt-8 grid gap-5 sm:grid-cols-2">
      <Field label="Pet name" error={form.formState.errors.name?.message}><input {...form.register("name")} className="portal-input" autoComplete="off" /></Field>
      <Field label="Species" error={form.formState.errors.species?.message}><select {...form.register("species")} className="portal-input"><option value="DOG">Dog</option><option value="CAT">Cat</option><option value="OTHER">Other</option></select></Field>
      <Field label="Breed (optional)" error={form.formState.errors.breed?.message}><input {...form.register("breed")} className="portal-input" /></Field>
      <Field label="Sex" error={form.formState.errors.sex?.message}><select {...form.register("sex")} className="portal-input"><option value="UNKNOWN">Prefer not to say</option><option value="FEMALE">Female</option><option value="MALE">Male</option></select></Field>
      <Field label="Birth date (optional)" error={form.formState.errors.birthDate?.message}><input type="date" {...form.register("birthDate")} className="portal-input" /></Field>
      <Field label="Weight in kg (optional)" error={form.formState.errors.weightKg?.message}><input type="number" min="0.1" max="150" step="0.1" {...form.register("weightKg")} className="portal-input" /></Field>
    </div>
    <label className="mt-5 flex items-center gap-3 rounded-2xl border border-ink/10 bg-paper/70 p-4 text-sm font-semibold"><input type="checkbox" {...form.register("sterilised")} className="h-4 w-4 accent-indigo" />Sterilised</label>
    <fieldset className="mt-8"><legend className="font-display text-2xl font-semibold">Health notes</legend><p className="mt-2 text-sm text-ink/50">Only authorised caregivers on an active assignment receive the care details they need.</p><div className="mt-5 grid gap-5 sm:grid-cols-3"><Field label="Allergies"><textarea {...form.register("allergies")} className="portal-input min-h-28 resize-y" /></Field><Field label="Conditions"><textarea {...form.register("conditions")} className="portal-input min-h-28 resize-y" /></Field><Field label="Medications"><textarea {...form.register("medications")} className="portal-input min-h-28 resize-y" /></Field></div></fieldset>
    <fieldset className="mt-8"><legend className="font-display text-2xl font-semibold">Emergency contact</legend><div className="mt-5 grid gap-5 sm:grid-cols-2"><Field label="Name (optional)" error={form.formState.errors.emergencyName?.message}><input {...form.register("emergencyName")} className="portal-input" /></Field><Field label="Phone" error={form.formState.errors.emergencyPhone?.message}><input {...form.register("emergencyPhone")} className="portal-input" inputMode="tel" placeholder="+91…" /></Field></div></fieldset>
    <Button type="submit" variant="accent" size="lg" className="mt-8" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <PawPrint className="h-5 w-5" />}Save pet profile <ArrowRight className="h-5 w-5" /></Button>
    <style jsx>{`.portal-input{width:100%;min-height:3.25rem;border-radius:1rem;border:1px solid rgb(var(--ink)/.14);background:rgb(var(--paper)/.82);padding:.8rem 1rem;outline:none}.portal-input:focus{border-color:rgb(var(--indigo));box-shadow:0 0 0 3px rgb(var(--indigo)/.12)}`}</style>
  </form>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold">{label}</span>{children}{error && <span className="mt-2 block text-xs font-semibold text-coral">{error}</span>}</label>;
}
