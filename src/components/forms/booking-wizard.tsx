"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3, MapPin, PawPrint } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const bookingSchema = z.object({
  service: z.enum(["DOG_WALK_30", "DOG_WALK_60", "HOME_VISIT", "HOME_SITTING_60", "GROOMING_HOME", "VET_SUPPORT", "TRAINING_ASSESSMENT", "PET_TAXI"]),
  petName: z.string().trim().min(2, "Tell us your pet's name").max(50, "Pet name cannot exceed 50 characters"),
  petType: z.enum(["DOG", "CAT", "RABBIT", "BIRD", "FISH", "TURTLE", "RAT", "OTHER"]),
  date: z.string().min(1, "Choose a date").refine((val) => {
    if (!val) return false;
    const selected = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  }, "Please select today or a future date"),
  time: z.string().min(1, "Choose a time").refine((val) => {
    if (!val) return false;
    const match = /^(\d{2}):(\d{2})$/.exec(val);
    if (!match || !match[1] || !match[2]) return false;
    const hour = parseInt(match[1], 10);
    const min = parseInt(match[2], 10);
    const totalMinutes = hour * 60 + min;
    return totalMinutes >= 360 && totalMinutes <= 1260;
  }, "Service hours are between 06:00 AM and 09:00 PM"),
  locality: z.string().trim().min(2, "Enter your locality").max(100, "Locality cannot exceed 100 characters"),
  parentName: z.string().trim().min(2, "Enter your name").max(100, "Name cannot exceed 100 characters"),
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
  ["VET_SUPPORT", "Veterinary Support", "Non-emergency partner clinic coordination"],
  ["TRAINING_ASSESSMENT", "Training assessment", "Expert evaluation of behavioral needs"],
  ["PET_TAXI", "Pet taxi", "Safe transport for your pet"]
] as const;

export function BookingWizard({ 
  initialValues = {}, 
  requestBoarding = false 
}: { 
  initialValues?: BookingPrefill; 
  requestBoarding?: boolean;
}) {
  const [step, setStep] = useState(0);
  const [attemptedStep, setAttemptedStep] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    shouldUnregister: false,
    defaultValues: {
      service: initialValues.service ?? "DOG_WALK_30",
      petType: initialValues.petType ?? "DOG",
      petName: "",
      date: "",
      time: "",
      locality: initialValues.locality ?? "",
      parentName: "",
      phone: "",
      notes: requestBoarding ? "Boarding Request (Pilot Society Host)" : ""
    }
  });

  // Restore draft state from unauthenticated wizard session storage (BUG-017)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("petsaathi_booking_wizard_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          if (parsed.service && !initialValues.service) form.setValue("service", parsed.service);
          if (parsed.petType && !initialValues.petType) form.setValue("petType", parsed.petType);
          if (parsed.petName) form.setValue("petName", parsed.petName);
          if (parsed.date) form.setValue("date", parsed.date);
          if (parsed.time) form.setValue("time", parsed.time);
          if (parsed.locality && !initialValues.locality) form.setValue("locality", parsed.locality);
          if (parsed.parentName) form.setValue("parentName", parsed.parentName);
          if (parsed.phone) form.setValue("phone", parsed.phone);
          if (parsed.notes) form.setValue("notes", parsed.notes);
          if (typeof parsed.step === "number" && parsed.step > 0 && parsed.step <= 3) {
            setStep(parsed.step);
          }
        }
      }
    } catch {}
  }, [form, initialValues]);

  // Keep sessionStorage in sync with user edits (BUG-017)
  useEffect(() => {
    const subscription = form.watch((values) => {
      try {
        sessionStorage.setItem("petsaathi_booking_wizard_draft", JSON.stringify({ ...values, step }));
      } catch {}
    });
    return () => subscription.unsubscribe();
  }, [form, step]);

  const next = async () => {
    setAttemptedStep(step);
    if (await form.trigger(stepFields[step] ?? [])) {
      setAttemptedStep(null);
      const nextStep = Math.min(step + 1, 3);
      setStep(nextStep);
      try {
        sessionStorage.setItem("petsaathi_booking_wizard_draft", JSON.stringify({ ...form.getValues(), step: nextStep }));
      } catch {}
    }
  };

  const errorFor = (field: keyof BookingInput) => attemptedStep === step ? form.formState.errors[field]?.message : undefined;

  const onValidSubmit = () => {
    try {
      sessionStorage.setItem("petsaathi_booking_wizard_draft", JSON.stringify({ ...form.getValues(), step: 3 }));
    } catch {}
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="glass-panel mx-auto max-w-2xl rounded-5xl p-8 text-center sm:p-12" role="status">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-leaf text-paper"><Check className="h-8 w-8" /></span>
        <h2 className="mt-7 font-display text-4xl font-semibold tracking-tight">Your care request is ready.</h2>
        <p className="mx-auto mt-4 max-w-lg leading-7 text-ink/80">Your details are valid on this device. Sign in to save the pet and address privately, confirm the live price and send the request for matching.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/login?returnTo=/book" className={buttonVariants({ variant: "accent" })}>Sign in to continue</Link>
          <Button 
            variant="outline" 
            onClick={() => { 
              form.reset(); 
              setStep(0); 
              setAttemptedStep(null); 
              setSubmitted(false); 
              try {
                sessionStorage.removeItem("petsaathi_booking_wizard_draft");
              } catch {}
            }}
          >
            Start again
          </Button>
        </div>
      </div>
    );
  }

  const todayMinDate = new Date().toLocaleDateString("en-CA");

  return (
    <form onSubmit={form.handleSubmit(onValidSubmit, () => setAttemptedStep(3))} className="glass-panel mx-auto max-w-3xl rounded-5xl p-5 sm:p-9" noValidate>
      {requestBoarding && (
        <div className="mb-6 rounded-3xl border border-saffron/30 bg-saffron/10 p-4 text-xs leading-relaxed text-ink/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <strong className="text-ink">Host Boarding Beta Active:</strong> Property-vetted host boarding is currently running in limited pilot across select societies. You can submit your host sitting request below or join our dedicated host waitlist.
          </div>
          <Link href={"/contact?topic=BOARDING_PILOT"} className="shrink-0 font-bold text-coral underline hover:text-coral-text">
            Join Boarding Waitlist →
          </Link>
        </div>
      )}
      <div className="mb-8 flex items-center gap-2" aria-label={`Step ${step + 1} of 4`}>
        {[0, 1, 2, 3].map((index) => <span key={index} className={cn("h-2 flex-1 rounded-full transition", index <= step ? "bg-saffron" : "bg-ink/10")} />)}
      </div>

      <fieldset className={cn(step !== 0 && "hidden")}><legend className="font-display text-3xl font-semibold">What kind of care?</legend><p className="mt-2 text-sm text-ink/80">Choose one service to begin.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{services.map(([value, label, copy]) => <label key={value} htmlFor={`service-radio-${value}`} className={cn("cursor-pointer rounded-3xl border p-5 transition hover:-translate-y-0.5", form.watch("service") === value ? "border-saffron bg-saffron/10 shadow-lifted" : "border-ink/10 bg-paper/70")}><input id={`service-radio-${value}`} type="radio" value={value} aria-label={label} {...form.register("service")} className="sr-only" /><PawPrint className="h-5 w-5 text-coral" /><span className="mt-4 block font-semibold">{label}</span><span className="mt-1 block text-sm leading-6 text-ink/80">{copy}</span></label>)}</div></fieldset>

      <fieldset className={cn(step !== 1 && "hidden")}><legend className="font-display text-3xl font-semibold">Who are we caring for?</legend><div className="mt-7 grid gap-5 sm:grid-cols-2"><Field label="Pet name" error={errorFor("petName")}><input id="wizard-pet-name" aria-label="Pet name" {...form.register("petName")} maxLength={50} className="form-input" placeholder="e.g. Miso" /></Field><Field label="Pet type" error={errorFor("petType")}><select id="wizard-pet-type" aria-label="Pet type" {...form.register("petType")} className="form-input"><option value="DOG">Dog</option><option value="CAT">Cat</option><option value="RABBIT">Rabbit</option><option value="BIRD">Bird</option><option value="FISH">Fish</option><option value="TURTLE">Turtle</option><option value="RAT">Rat / Mouse</option><option value="OTHER">Other</option></select></Field></div></fieldset>

      <fieldset className={cn(step !== 2 && "hidden")}><legend className="font-display text-3xl font-semibold">When and where?</legend><div className="mt-7 grid gap-5 sm:grid-cols-2"><Field label="Date" icon={<CalendarDays className="h-4 w-4" />} error={errorFor("date")}><input id="wizard-date" aria-label="Booking date" type="date" min={todayMinDate} {...form.register("date")} className="form-input" /></Field><Field label="Start time" icon={<Clock3 className="h-4 w-4" />} error={errorFor("time")}><input id="wizard-time" aria-label="Start time" type="time" min="06:00" max="21:00" {...form.register("time")} className="form-input" /></Field><div className="sm:col-span-2"><Field label="Locality" icon={<MapPin className="h-4 w-4" />} error={errorFor("locality")}><input id="wizard-locality" aria-label="Locality" {...form.register("locality")} maxLength={100} className="form-input" placeholder="Bopal, Ahmedabad" /></Field></div></div></fieldset>

      <fieldset className={cn(step !== 3 && "hidden")}><legend className="font-display text-3xl font-semibold">How can we reach you?</legend><div className="mt-7 grid gap-5 sm:grid-cols-2"><Field label="Your name" error={errorFor("parentName")}><input id="wizard-parent-name" aria-label="Your name" {...form.register("parentName")} maxLength={100} className="form-input" autoComplete="name" /></Field><Field label="Mobile number" error={errorFor("phone")}><input id="wizard-phone" aria-label="Mobile number" {...form.register("phone")} className="form-input" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile" /></Field><div className="sm:col-span-2"><Field label="Anything useful for the first call?" error={errorFor("notes")}><textarea id="wizard-notes" aria-label="Additional care notes" {...form.register("notes")} maxLength={800} className="form-input min-h-28 resize-y" placeholder="Routine, temperament, access or timing notes" /></Field></div></div></fieldset>

      <div className="mt-9 flex items-center justify-between gap-3">
        <Button type="button" variant="ghost" onClick={() => setStep((current) => Math.max(current - 1, 0))} disabled={step === 0 || form.formState.isSubmitting}>
          <ArrowLeft className="h-4 w-4" />Back
        </Button>
        {step < 3 ? (
          <Button key="continue" type="button" variant="accent" onClick={(event) => { event.preventDefault(); void next(); }} disabled={form.formState.isSubmitting}>
            Continue<ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button key="submit" type="submit" variant="accent" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Processing..." : "Review request"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
      <style jsx>{`.form-input{width:100%;min-height:3.25rem;border-radius:1rem;border:1px solid rgb(var(--ink)/.14);background:rgb(var(--paper)/.8);padding:.8rem 1rem;outline:none}.form-input:focus{border-color:rgb(var(--indigo));box-shadow:0 0 0 3px rgb(var(--indigo)/.12)}`}</style>
    </form>
  );
}

function Field({ label, icon, error, children }: { label: string; icon?: React.ReactNode; error?: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 flex items-center gap-2 text-sm font-semibold">{icon}{label}</span>{children}{error && <span className="mt-2 block text-xs font-semibold text-coral">{error}</span>}</label>;
}
