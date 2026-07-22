"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { createAddressSchema } from "@/modules/addresses/input";

type AddressInput = z.infer<typeof createAddressSchema>;

export function AddressForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<AddressInput>({ resolver: zodResolver(createAddressSchema), defaultValues: { label: "Home", line1: "", line2: "", landmark: "", locality: "Bopal", city: "Ahmedabad", state: "Gujarat", postalCode: "", accessNotes: "" } });

  async function submit(values: AddressInput) {
    setServerError(null);
    const response = await fetch("/api/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    if (!response.ok) return setServerError("We could not save this address. Check the details and try again.");
    router.push("/book");
    router.refresh();
  }

  return <form onSubmit={form.handleSubmit(submit)} className="glass-panel mx-auto max-w-3xl rounded-5xl p-6 sm:p-10" noValidate>
    <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf text-paper"><MapPin className="h-6 w-6" /></span><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/45">Private service address</p><h2 className="font-display text-3xl font-semibold">Where should care begin?</h2></div></div>
    {serverError && <p className="mt-6 rounded-2xl bg-coral/10 p-4 text-sm font-semibold text-coral" role="alert">{serverError}</p>}
    <div className="mt-8 grid gap-5 sm:grid-cols-2"><Field label="Label" error={form.formState.errors.label?.message}><input {...form.register("label")} className="address-input" /></Field><div className="sm:col-span-2"><Field label="Address line 1" error={form.formState.errors.line1?.message}><input {...form.register("line1")} className="address-input" autoComplete="address-line1" /></Field></div><div className="sm:col-span-2"><Field label="Address line 2 (optional)" error={form.formState.errors.line2?.message}><input {...form.register("line2")} className="address-input" autoComplete="address-line2" /></Field></div><Field label="Landmark (optional)" error={form.formState.errors.landmark?.message}><input {...form.register("landmark")} className="address-input" /></Field><Field label="Locality" error={form.formState.errors.locality?.message}><input {...form.register("locality")} className="address-input" /></Field><Field label="City" error={form.formState.errors.city?.message}><input {...form.register("city")} className="address-input" autoComplete="address-level2" /></Field><Field label="State" error={form.formState.errors.state?.message}><input {...form.register("state")} className="address-input" autoComplete="address-level1" /></Field><Field label="PIN code" error={form.formState.errors.postalCode?.message}><input {...form.register("postalCode")} className="address-input" inputMode="numeric" maxLength={6} autoComplete="postal-code" /></Field><div className="sm:col-span-2"><Field label="Access notes (optional)" error={form.formState.errors.accessNotes?.message}><textarea {...form.register("accessNotes")} className="address-input min-h-28 resize-y" placeholder="Gate, parking or handover guidance. Do not include lock codes here." /></Field></div></div>
    <p className="mt-5 text-xs leading-5 text-ink/50">The exact address is withheld from candidate caregivers and released only after an authorised assignment reaches the correct state.</p>
    <Button type="submit" variant="accent" size="lg" className="mt-8" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <MapPin className="h-5 w-5" />}Save address <ArrowRight className="h-5 w-5" /></Button>
    <style jsx>{`.address-input{width:100%;min-height:3.25rem;border-radius:1rem;border:1px solid rgb(var(--ink)/.14);background:rgb(var(--paper)/.82);padding:.8rem 1rem;outline:none}.address-input:focus{border-color:rgb(var(--indigo));box-shadow:0 0 0 3px rgb(var(--indigo)/.12)}`}</style>
  </form>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold">{label}</span>{children}{error && <span className="mt-2 block text-xs font-semibold text-coral">{error}</span>}</label>;
}
