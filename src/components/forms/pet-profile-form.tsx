"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle, PawPrint } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { compactDefinedFields } from "@/modules/pets/input-utils";
import { petProfileFormSchema, type PetProfileFormValues } from "@/modules/pets/profile-input";

type PetProfileInput = {
  id: string;
  name: string;
  species: "DOG" | "CAT" | "OTHER";
  breed?: string | null;
  sex?: "FEMALE" | "MALE" | "UNKNOWN" | null;
  birthDate?: string | null;
  weightKg?: number | null;
  sterilised?: boolean | null;
  medical?: {
    allergies?: string | null;
    conditions?: string | null;
    medications?: string | null;
    veterinarianName?: string | null;
    veterinarianPhone?: string | null;
    emergencyClinicName?: string | null;
    emergencyClinicPhone?: string | null;
  } | null;
  emergencyContact?: {
    name?: string | null;
    relation?: string | null;
    phone?: string | null;
  } | null;
};

export function PetProfileForm({ pet }: { pet?: PetProfileInput }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const defaultValues: PetProfileFormValues = pet
    ? {
        name: pet.name,
        species: pet.species,
        breed: pet.breed ?? undefined,
        sex: pet.sex ?? "UNKNOWN",
        birthDate: pet.birthDate ? pet.birthDate.split("T")[0] : undefined,
        weightKg: pet.weightKg ?? undefined,
        sterilised: pet.sterilised ?? false,
        allergies: pet.medical?.allergies ?? undefined,
        conditions: pet.medical?.conditions ?? undefined,
        medications: pet.medical?.medications ?? undefined,
        veterinarianName: pet.medical?.veterinarianName ?? undefined,
        veterinarianPhone: pet.medical?.veterinarianPhone ?? undefined,
        emergencyClinicName: pet.medical?.emergencyClinicName ?? undefined,
        emergencyClinicPhone: pet.medical?.emergencyClinicPhone ?? undefined,
        emergencyName: pet.emergencyContact?.name ?? undefined,
        emergencyRelation: pet.emergencyContact?.relation ?? undefined,
        emergencyPhone: pet.emergencyContact?.phone ?? undefined
      }
    : {
        name: "",
        species: "DOG",
        breed: undefined,
        sex: "UNKNOWN",
        birthDate: undefined,
        weightKg: undefined,
        sterilised: false,
        allergies: undefined,
        conditions: undefined,
        medications: undefined,
        veterinarianName: undefined,
        veterinarianPhone: undefined,
        emergencyClinicName: undefined,
        emergencyClinicPhone: undefined,
        emergencyName: undefined,
        emergencyRelation: undefined,
        emergencyPhone: undefined
      };

  const form = useForm<PetProfileFormValues>({
    resolver: zodResolver(petProfileFormSchema),
    defaultValues
  });

  async function submit(values: PetProfileFormValues) {
    setServerError(null);

    const url = pet ? `/api/pets/${pet.id}` : "/api/pets";
    const method = pet ? "PUT" : "POST";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        species: values.species,
        breed: values.breed,
        sex: values.sex,
        birthDate: values.birthDate,
        weightKg: values.weightKg,
        sterilised: values.sterilised,
        medical: compactDefinedFields({
          allergies: values.allergies,
          conditions: values.conditions,
          medications: values.medications,
          veterinarianName: values.veterinarianName,
          veterinarianPhone: values.veterinarianPhone,
          emergencyClinicName: values.emergencyClinicName,
          emergencyClinicPhone: values.emergencyClinicPhone
        }),
        emergencyContact: compactDefinedFields({
          name: values.emergencyName,
          relation: values.emergencyRelation,
          phone: values.emergencyPhone
        })
      })
    });

    const result = await response.json().catch(() => null) as { message?: string; pet?: { id: string } } | null;
    if (!response.ok) {
      return setServerError(result?.message ?? "We could not save this profile. Check the details and try again.");
    }

    router.push(result?.pet?.id ? `/pets/${result.pet.id}` : "/pets");
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="glass-panel mx-auto max-w-4xl rounded-5xl p-6 sm:p-10" noValidate>
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron">
          <PawPrint className="h-6 w-6" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/45">Private pet record</p>
          <h2 className="font-display text-3xl font-semibold">The essentials for thoughtful care</h2>
        </div>
      </div>

      {serverError && <p className="mt-6 rounded-2xl bg-coral/10 p-4 text-sm font-semibold text-coral" role="alert">{serverError}</p>}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Pet name" error={form.formState.errors.name?.message}>
          <input {...form.register("name")} className="portal-input" autoComplete="off" />
        </Field>
        <Field label="Species" error={form.formState.errors.species?.message}>
          <select {...form.register("species")} className="portal-input">
            <option value="DOG">Dog</option>
            <option value="CAT">Cat</option>
            <option value="OTHER">Other</option>
          </select>
        </Field>
        <Field label="Breed (optional)" error={form.formState.errors.breed?.message}>
          <input {...form.register("breed")} className="portal-input" autoComplete="off" />
        </Field>
        <Field label="Sex" error={form.formState.errors.sex?.message}>
          <select {...form.register("sex")} className="portal-input">
            <option value="UNKNOWN">Prefer not to say</option>
            <option value="FEMALE">Female</option>
            <option value="MALE">Male</option>
          </select>
        </Field>
        <Field label="Birth date (optional)" error={form.formState.errors.birthDate?.message}>
          <input type="date" {...form.register("birthDate")} className="portal-input" />
        </Field>
        <Field label="Weight in kg (optional)" error={form.formState.errors.weightKg?.message}>
          <input type="number" min="0.1" max="150" step="any" {...form.register("weightKg")} className="portal-input" inputMode="decimal" />
        </Field>
      </div>

      <label className="mt-5 flex items-center gap-3 rounded-2xl border border-ink/10 bg-paper/70 p-4 text-sm font-semibold">
        <input type="checkbox" {...form.register("sterilised")} className="h-4 w-4 accent-indigo" />
        Sterilised
      </label>

      <fieldset className="mt-8 rounded-[2rem] border border-ink/10 bg-paper/70 p-5 sm:p-6">
        <legend className="px-2 font-display text-2xl font-semibold">Health notes</legend>
        <p className="mt-2 text-sm text-ink/50">These notes help the care team avoid preventable risks and keep daily routines consistent.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <Field label="Allergies" error={form.formState.errors.allergies?.message}>
            <textarea {...form.register("allergies")} className="portal-input min-h-28 resize-y" />
          </Field>
          <Field label="Conditions" error={form.formState.errors.conditions?.message}>
            <textarea {...form.register("conditions")} className="portal-input min-h-28 resize-y" />
          </Field>
          <Field label="Medications" error={form.formState.errors.medications?.message}>
            <textarea {...form.register("medications")} className="portal-input min-h-28 resize-y" />
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-8 rounded-[2rem] border border-ink/10 bg-paper/70 p-5 sm:p-6">
        <legend className="px-2 font-display text-2xl font-semibold">Veterinary support</legend>
        <p className="mt-2 text-sm text-ink/50">Add the primary vet and emergency clinic so urgent care can be handed off quickly.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="Veterinarian name" error={form.formState.errors.veterinarianName?.message}>
            <input {...form.register("veterinarianName")} className="portal-input" autoComplete="off" />
          </Field>
          <Field label="Veterinarian phone" error={form.formState.errors.veterinarianPhone?.message}>
            <input {...form.register("veterinarianPhone")} className="portal-input" inputMode="tel" placeholder="+91 98765 43210" />
          </Field>
          <Field label="Emergency clinic name" error={form.formState.errors.emergencyClinicName?.message}>
            <input {...form.register("emergencyClinicName")} className="portal-input" autoComplete="off" />
          </Field>
          <Field label="Emergency clinic phone" error={form.formState.errors.emergencyClinicPhone?.message}>
            <input {...form.register("emergencyClinicPhone")} className="portal-input" inputMode="tel" placeholder="+91 98765 43210" />
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-8 rounded-[2rem] border border-ink/10 bg-paper/70 p-5 sm:p-6">
        <legend className="px-2 font-display text-2xl font-semibold">Emergency contact</legend>
        <p className="mt-2 text-sm text-ink/50">We only show this information to authorised caregivers on active work.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <Field label="Name" error={form.formState.errors.emergencyName?.message}>
            <input {...form.register("emergencyName")} className="portal-input" autoComplete="off" />
          </Field>
          <Field label="Relation (optional)" error={form.formState.errors.emergencyRelation?.message}>
            <input {...form.register("emergencyRelation")} className="portal-input" autoComplete="off" />
          </Field>
          <Field label="Phone" error={form.formState.errors.emergencyPhone?.message}>
            <input {...form.register("emergencyPhone")} className="portal-input" inputMode="tel" placeholder="+91 98765 43210" />
          </Field>
        </div>
      </fieldset>

      <Button type="submit" variant="accent" size="lg" className="mt-8" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <PawPrint className="h-5 w-5" />}
        Save pet profile
        <ArrowRight className="h-5 w-5" />
      </Button>

      <style jsx>{`
        .portal-input {
          width: 100%;
          min-height: 3.25rem;
          border-radius: 1rem;
          border: 1px solid rgb(var(--ink) / 0.14);
          background: rgb(var(--paper) / 0.82);
          padding: 0.8rem 1rem;
          outline: none;
        }

        .portal-input:focus {
          border-color: rgb(var(--indigo));
          box-shadow: 0 0 0 3px rgb(var(--indigo) / 0.12);
        }
      `}</style>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      {children}
      {error && <span className="mt-2 block text-xs font-semibold text-coral">{error}</span>}
    </label>
  );
}
