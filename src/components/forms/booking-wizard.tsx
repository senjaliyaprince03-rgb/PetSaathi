"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3, MapPin, PawPrint } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const bookingSchema = z.object({
  service: z.enum(["DOG_WALK_30", "DOG_WALK_60", "HOME_VISIT", "HOME_SITTING_60", "GROOMING_HOME", "VET_SUPPORT", "TRAINING_ASSESSMENT", "PET_TAXI"]),
  petName: z.string().trim().min(2, "Tell us your pet's name"),
  petType: z.enum(["DOG", "CAT", "OTHER"]),
  date: z.string().min(1, "Choose a date"),
  time: z.string().min(1, "Choose a time"),
  locality: z.string().trim().min(2, "Enter your locality"),
  parentName: z.string().trim().min(2, "Enter your name"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  notes: z.string().max(800).optional()
});

type BookingInput = z.infer<typeof bookingSchema>;
type BookingPrefill = Partial<Pick<BookingInput, "service" | "petType" | "locality">>;

const stepFields: Array<Array<keyof BookingInput>> = [
  ["service"],
  ["petName", "petType"],
  ["date", "time", "locality"],
  ["parentName", "phone", "notes"]
];

const services = [
  ["DOG_WALK_30", "30-minute walk", "A focused neighbourhood walk"],
  ["DOG_WALK_60", "60-minute walk", "More time to explore and settle"],
  ["HOME_VISIT", "Home visit", "Food, water and a reassuring check-in"],
  ["HOME_SITTING_60", "One-hour sitting", "Company, play and routine at home"],
  ["GROOMING_HOME", "Home grooming", "Professional grooming at your doorstep"],
  ["VET_SUPPORT", "Vet consultation", "Primary veterinary support and checkups"],
  ["TRAINING_ASSESSMENT", "Training assessment", "Expert evaluation of behavioral needs"],
  ["PET_TAXI", "Pet taxi", "Safe transport for your pet"]
] as const;

export function BookingWizard({ initialValues = {} }: { initialValues?: BookingPrefill }) {
  const [step, setStep] = useState(0);
  const [attemptedStep, setAttemptedStep] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      service: initialValues.service ?? "DOG_WALK_30",
      petType: initialValues.petType ?? "DOG",
      petName: "",
      date: "",
      time: "",
      locality: initialValues.locality ?? "",
      parentName: "",
      phone: "",
      notes: ""
    }
  });

  const next = async () => {
    setAttemptedStep(step);
    if (await form.trigger(stepFields[step] ?? [])) {
      setAttemptedStep(null);
      setStep((current) => Math.min(current + 1, 3));
    }
  };

  const errorFor = (field: keyof BookingInput) => attemptedStep === step ? form.formState.errors[field]?.message : undefined;

  if (submitted) {
    return (
      <div className="glass-panel mx-auto max-w-2xl rounded-5xl p-8 text-center sm:p-12" role="status">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-leaf text-paper"><Check className="h-8 w-8" /></span>
        <h2 className="mt-7 font-display text-4xl font-semibold tracking-tight">Your care request is ready.</h2>
        <p className="mx-auto mt-4 max-w-lg leading-7 text-ink/62">Your details are valid on this device. Sign in to save the pet and address privately, confirm the live price and send the request for matching.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/login?returnTo=/book" className={buttonVariants({ variant: "accent" })}>Sign in to continue</Link><Button variant="outline" onClick={() => { form.reset(); setStep(0); setAttemptedStep(null); setSubmitted(false); }}>Start again</Button></div>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(() => setSubmitted(true), () => setAttemptedStep(3))} className="glass-panel mx-auto max-w-3xl rounded-5xl p-5 sm:p-9" noValidate>
      <div className="mb-8 flex items-center gap-2" aria-label={`Step ${step + 1} of 4`}>
        {[0, 1, 2, 3].map((index) => <span key={index} className={cn("h-2 flex-1 rounded-full transition", index <= step ? "bg-saffron" : "bg-ink/10")} />)}
      </div>

      {step === 0 && <fieldset><legend className="font-display text-3xl font-semibold">What kind of care?</legend><p className="mt-2 text-sm text-ink/55">Choose one service to begin.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{services.map(([value, label, copy]) => <label key={value} className={cn("cursor-pointer rounded-3xl border p-5 transition hover:-translate-y-0.5", form.watch("service") === value ? "border-saffron bg-saffron/10 shadow-lifted" : "border-ink/10 bg-paper/70")}><input type="radio" value={value} {...form.register("service")} className="sr-only" /><PawPrint className="h-5 w-5 text-coral" /><span className="mt-4 block font-semibold">{label}</span><span className="mt-1 block text-sm leading-6 text-ink/55">{copy}</span></label>)}</div></fieldset>}

      {step === 1 && <fieldset><legend className="font-display text-3xl font-semibold">Who are we caring for?</legend><div className="mt-7 grid gap-5 sm:grid-cols-2"><Field label="Pet name" error={errorFor("petName")}><input {...form.register("petName")} className="form-input" placeholder="e.g. Miso" /></Field><Field label="Pet type" error={errorFor("petType")}><select {...form.register("petType")} className="form-input"><option value="DOG">Dog</option><option value="CAT">Cat</option><option value="OTHER">Other</option></select></Field></div></fieldset>}

      {step === 2 && <fieldset><legend className="font-display text-3xl font-semibold">When and where?</legend><div className="mt-7 grid gap-5 sm:grid-cols-2"><Field label="Date" icon={<CalendarDays className="h-4 w-4" />} error={errorFor("date")}><input type="date" {...form.register("date")} className="form-input" /></Field><Field label="Start time" icon={<Clock3 className="h-4 w-4" />} error={errorFor("time")}><input type="time" {...form.register("time")} className="form-input" /></Field><div className="sm:col-span-2"><Field label="Locality" icon={<MapPin className="h-4 w-4" />} error={errorFor("locality")}><input {...form.register("locality")} className="form-input" placeholder="Bopal, Ahmedabad" /></Field></div></div></fieldset>}

      {step === 3 && <fieldset><legend className="font-display text-3xl font-semibold">How can we reach you?</legend><div className="mt-7 grid gap-5 sm:grid-cols-2"><Field label="Your name" error={errorFor("parentName")}><input {...form.register("parentName")} className="form-input" autoComplete="name" /></Field><Field label="Mobile number" error={errorFor("phone")}><input {...form.register("phone")} className="form-input" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile" /></Field><div className="sm:col-span-2"><Field label="Anything useful for the first call?" error={errorFor("notes")}><textarea {...form.register("notes")} className="form-input min-h-28 resize-y" placeholder="Routine, temperament, access or timing notes" /></Field></div></div></fieldset>}

      <div className="mt-9 flex items-center justify-between gap-3"><Button type="button" variant="ghost" onClick={() => setStep((current) => Math.max(current - 1, 0))} disabled={step === 0}><ArrowLeft className="h-4 w-4" />Back</Button>{step < 3 ? <Button key="continue" type="button" variant="accent" onClick={(event) => { event.preventDefault(); void next(); }}>Continue<ArrowRight className="h-4 w-4" /></Button> : <Button key="submit" type="submit" variant="accent">Review request<ArrowRight className="h-4 w-4" /></Button>}</div>
      <style jsx>{`.form-input{width:100%;min-height:3.25rem;border-radius:1rem;border:1px solid rgb(var(--ink)/.14);background:rgb(var(--paper)/.8);padding:.8rem 1rem;outline:none}.form-input:focus{border-color:rgb(var(--indigo));box-shadow:0 0 0 3px rgb(var(--indigo)/.12)}`}</style>
    </form>
  );
}

function Field({ label, icon, error, children }: { label: string; icon?: React.ReactNode; error?: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 flex items-center gap-2 text-sm font-semibold">{icon}{label}</span>{children}{error && <span className="mt-2 block text-xs font-semibold text-coral">{error}</span>}</label>;
}
