"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, HeartHandshake, LoaderCircle, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import { sitterApplicationSchema } from "@/modules/sitters/application-input";

type ApplicationInput = z.infer<typeof sitterApplicationSchema>;
const serviceOptions = [["DOG_WALK_30", "30-minute walks"], ["DOG_WALK_60", "60-minute walks"], ["HOME_VISIT", "Home visits"], ["HOME_SITTING_60", "Pet sitting"], ["BOARDING_BETA", "Boarding beta interest"], ["GROOMING_HOME", "Grooming-at-Home"], ["VET_SUPPORT", "Veterinary Support"], ["TRAINING_ASSESSMENT", "Dog Training"]] as const;

export function SitterApplication({ authenticated }: { authenticated: boolean }) {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<ApplicationInput>({ resolver: zodResolver(sitterApplicationSchema), defaultValues: { locality: "Bopal", yearsExperience: 0, services: [], motivation: "" } });

  if (!authenticated) return <div className="glass-panel mx-auto max-w-2xl rounded-5xl p-9 text-center"><LockKeyhole className="mx-auto h-10 w-10 text-indigo" /><h2 className="mt-5 font-display text-4xl font-semibold">Sign in before applying.</h2><p className="mt-4 leading-7 text-ink/60">One verified identity can hold both pet-parent and caregiver roles, while each workspace keeps separate permissions.</p><Link href="/login?returnTo=/become-a-saathi" className={`${buttonVariants({ variant: "accent" })} mt-7`}>Sign in securely</Link></div>;
  if (sent) return <div className="glass-panel mx-auto max-w-2xl rounded-5xl p-10 text-center"><Check className="mx-auto h-12 w-12 text-leaf" /><h2 className="mt-5 font-display text-4xl font-semibold">Application received.</h2><p className="mt-4 leading-7 text-ink/60">Identity, interview, training and service permissions are reviewed separately. Nothing has been published publicly.</p><Link href="/saathi" className={`${buttonVariants({ variant: "accent" })} mt-7`}>Open Saathi workspace</Link></div>;

  async function submit(values: ApplicationInput) {
    setServerError(null);
    const response = await fetch("/api/saathi/application", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const result = await response.json().catch(() => null) as { error?: string } | null;
    if (!response.ok) return setServerError(result?.error?.replaceAll("_", " ") ?? "The application could not be saved.");
    setSent(true);
  }

  return <form onSubmit={form.handleSubmit(submit)} className="glass-panel mx-auto max-w-3xl rounded-5xl p-6 sm:p-10" noValidate>
    <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron"><HeartHandshake className="h-6 w-6" /></span><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/45">Step one</p><h2 className="font-display text-3xl font-semibold">Tell us about your care experience</h2></div></div>
    {serverError && <p className="mt-6 rounded-2xl bg-coral/10 p-4 text-sm font-semibold text-coral" role="alert">{serverError}</p>}
    <div className="mt-8 grid gap-5 sm:grid-cols-2"><Field label="Locality" error={form.formState.errors.locality?.message}><input {...form.register("locality")} className="application-input" /></Field><Field label="Years caring for pets" error={form.formState.errors.yearsExperience?.message}><input type="number" min="0" max="60" {...form.register("yearsExperience")} className="application-input" /></Field></div>
    <fieldset className="mt-6"><legend className="text-sm font-semibold">Services you are interested in</legend><div className="mt-3 flex flex-wrap gap-3">{serviceOptions.map(([value, label]) => <label key={value} className="flex cursor-pointer items-center gap-2 rounded-full border border-ink/12 bg-paper/70 px-4 py-3 text-sm"><input type="checkbox" value={value} {...form.register("services")} className="accent-indigo" />{label}</label>)}</div>{form.formState.errors.services && <span className="mt-2 block text-xs font-semibold text-coral">{form.formState.errors.services.message}</span>}</fieldset>
    <Field label="Why would you be a thoughtful Saathi?" error={form.formState.errors.motivation?.message}><textarea {...form.register("motivation")} className="application-input mt-6 min-h-36 resize-y" placeholder="Describe real routines, species, temperaments and responsibilities you have handled." /></Field>
    <p className="mt-5 text-xs leading-5 text-ink/50">Submitting interest does not create a public listing or approval. Identity, interview, training and service permissions are reviewed separately.</p><Button type="submit" variant="accent" size="lg" className="mt-7" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <HeartHandshake className="h-5 w-5" />}Submit application <ArrowRight className="h-5 w-5" /></Button>
    <style jsx>{`.application-input{width:100%;min-height:3.25rem;border-radius:1rem;border:1px solid rgb(var(--ink)/.14);background:rgb(var(--paper)/.82);padding:.8rem 1rem;outline:none}.application-input:focus{border-color:rgb(var(--indigo));box-shadow:0 0 0 3px rgb(var(--indigo)/.12)}`}</style>
  </form>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="block"><span className="mb-2 block text-sm font-semibold">{label}</span>{children}{error && <span className="mt-2 block text-xs font-semibold text-coral">{error}</span>}</label>; }
