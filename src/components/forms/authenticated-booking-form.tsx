"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CalendarDays, CheckCircle2, LoaderCircle, PawPrint } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import type { CoreServiceCode } from "@/modules/catalog/services";

import { ServiceAssessmentFlow } from "@/components/forms/service-assessment-flow";
import { DynamicPricingEngine } from "@/components/forms/dynamic-pricing-engine";

const requestSchema = z.object({ petId: z.string().uuid(), addressId: z.string().uuid(), serviceCode: z.enum(["DOG_WALK_30", "DOG_WALK_60", "HOME_VISIT", "HOME_SITTING_60", "GROOMING_HOME", "VET_SUPPORT", "TRAINING_ASSESSMENT", "PET_TAXI"]), scheduledStart: z.string().min(1, "Choose a date and time"), customerNotes: z.string().trim().max(800).optional(), careConsent: z.literal(true, { errorMap: () => ({ message: "Confirm the care details are accurate" }) }) });
type RequestInput = z.infer<typeof requestSchema>;

type PetOption = { id: string; name: string; species: string };
type AddressOption = { id: string; label: string; locality: string; city: string };
type ServiceOption = { code: CoreServiceCode; name: string; durationMinutes: number | null };
type PriceOption = { addressId: string; serviceCode: CoreServiceCode; servicePriceId: string; subtotalPaise: number; taxPaise: number; totalPaise: number; currency: string };

export function AuthenticatedBookingForm({ pets, addresses, services, prices, initialService }: { pets: PetOption[]; addresses: AddressOption[]; services: ServiceOption[]; prices: PriceOption[]; initialService?: CoreServiceCode }) {
  const [reference, setReference] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [assessmentData, setAssessmentData] = useState<Record<string, unknown>>({});
  const availableInitialService = services.some((service) => service.code === initialService) ? initialService : undefined;
  const form = useForm<RequestInput>({ resolver: zodResolver(requestSchema), defaultValues: { petId: pets[0]?.id ?? "", addressId: addresses[0]?.id ?? "", serviceCode: availableInitialService ?? services[0]?.code ?? "DOG_WALK_30", scheduledStart: "", customerNotes: "" } });

  if (!pets.length || !addresses.length) return <div className="relative overflow-hidden rounded-[1.75rem] border border-dashed border-indigo/15 bg-cream/35 p-8 text-center sm:p-10"><div className="absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo/10 blur-3xl" /><span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-paper text-coral shadow-lifted"><PawPrint className="h-6 w-6 animate-[float_4s_ease-in-out_infinite]" /></span><h2 className="relative mt-5 font-display text-3xl font-semibold tracking-[-0.04em]">Add the care essentials first.</h2><p className="relative mt-3 text-sm leading-6 text-ink/55">A booking needs one private pet profile and one service address before matching can begin.</p><div className="relative mt-6 flex flex-col justify-center gap-3 sm:flex-row">{!pets.length && <Link href="/pets/new" className={buttonVariants({ variant: "accent" })}>Add a pet</Link>}{!addresses.length && <Link href="/addresses/new" className={buttonVariants({ variant: "outline" })}>Add an address</Link>}</div></div>;

  if (reference) return <div className="rounded-[1.75rem] border border-leaf/15 bg-leaf/[0.06] p-8 text-center sm:p-10" role="status"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-leaf text-paper"><CheckCircle2 className="h-8 w-8" /></span><h2 className="mt-7 font-display text-4xl font-semibold">Request received.</h2><p className="mt-4 leading-7 text-ink/60">Reference <strong>{reference}</strong> is now in the eligibility and matching queue. Payment is requested only after you approve a proposed Saathi.</p><Link href="/dashboard" className={`${buttonVariants({ variant: "accent" })} mt-7`}>Open my dashboard</Link></div>;

  async function submit(values: RequestInput) {
    setServerError(null);
    const approvedPrice = prices.find((price) => price.addressId === values.addressId && price.serviceCode === values.serviceCode);
    if (!approvedPrice) return setServerError("This service and address do not have an approved price yet.");
    const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, servicePriceId: approvedPrice.servicePriceId, scheduledStart: new Date(values.scheduledStart).toISOString(), careConsent: undefined }) });
    const result = await response.json().catch(() => null) as { booking?: { reference: string }; error?: string; message?: string } | null;
    if (!response.ok || !result?.booking) return setServerError(result?.message ?? "The request could not be created. Check the time and try again.");
    setReference(result.booking.reference);
  }

  const selectedService = services.find(({ code }) => code === form.watch("serviceCode"));
  const selectedPrice = prices.find((price) => price.addressId === form.watch("addressId") && price.serviceCode === form.watch("serviceCode"));
  return <form onSubmit={form.handleSubmit(submit)} className="rounded-[1.75rem] border border-ink/[0.07] bg-paper p-5 shadow-[0_18px_55px_-42px_rgb(var(--ink)/0.35)] sm:p-7" noValidate>
    <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo text-paper"><CalendarDays className="h-5 w-5" /></span><div><p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-coral">Authenticated request</p><h2 className="mt-1 font-display text-3xl font-semibold tracking-[-0.04em]">Choose the care window</h2></div></div>
    {serverError && <p className="mt-6 rounded-2xl bg-coral/10 p-4 text-sm font-semibold text-coral" role="alert">{serverError}</p>}
    <div className="mt-8 grid gap-5 sm:grid-cols-2"><Field label="Pet" error={form.formState.errors.petId?.message}><select {...form.register("petId")} className="booking-input">{pets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name} · {pet.species.toLowerCase()}</option>)}</select></Field><Field label="Care address" error={form.formState.errors.addressId?.message}><select {...form.register("addressId")} className="booking-input">{addresses.map((address) => <option key={address.id} value={address.id}>{address.label} · {address.locality}</option>)}</select></Field><Field label="Service" error={form.formState.errors.serviceCode?.message}><select {...form.register("serviceCode")} className="booking-input">{services.map((service) => <option key={service.code} value={service.code}>{service.name}</option>)}</select></Field><Field label="Start date and time" error={form.formState.errors.scheduledStart?.message}><input type="datetime-local" {...form.register("scheduledStart")} className="booking-input" /></Field><div className="sm:col-span-2"><Field label="Care notes (optional)" error={form.formState.errors.customerNotes?.message}><textarea {...form.register("customerNotes")} className="booking-input min-h-28 resize-y" placeholder="Routine, temperament and handover guidance" /></Field></div></div>
    
    {(form.watch("serviceCode") === "GROOMING_HOME" || form.watch("serviceCode") === "VET_SUPPORT" || form.watch("serviceCode") === "TRAINING_ASSESSMENT" || form.watch("serviceCode") === "PET_TAXI") && (
      <div className="mt-6">
        <ServiceAssessmentFlow 
          serviceCode={form.watch("serviceCode")} 
          onComplete={(data) => setAssessmentData(data)} 
          onEmergency={() => alert("This is an emergency. Please contact the nearest clinic immediately.")} 
        />
      </div>
    )}

    {selectedPrice ? (
      <>
        {["GROOMING_HOME", "VET_SUPPORT", "TRAINING_ASSESSMENT"].includes(form.watch("serviceCode")) ? (
          <DynamicPricingEngine 
            serviceCode={form.watch("serviceCode")} 
            basePrice={selectedPrice.subtotalPaise / 100} 
            assessmentData={assessmentData} 
            petDetails={{ size: 'MEDIUM' }} // Hardcoded for prototype, usually from pet profile
          />
        ) : (
          <div className="mt-6 flex items-center justify-between rounded-3xl bg-indigo p-5 text-paper"><div><p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-paper/45">Approved quote · {selectedService?.name}</p><p className="mt-1 text-sm text-paper/65">₹{(selectedPrice.subtotalPaise / 100).toLocaleString("en-IN")} + ₹{(selectedPrice.taxPaise / 100).toLocaleString("en-IN")} tax · rechecked on submit</p></div><p className="font-display text-3xl font-semibold">₹{(selectedPrice.totalPaise / 100).toLocaleString("en-IN")}</p></div>
        )}
      </>
    ) : <div className="mt-6 rounded-3xl border border-saffron/50 bg-saffron/15 p-5"><p className="font-semibold">Booking is not open for this service and address.</p><p className="mt-2 text-sm leading-6 text-ink/60">An administrator must activate the service area and approve an immutable price before PetSaathi can accept this request.</p></div>}
    
    <label className="mt-6 flex items-start gap-3 rounded-2xl border border-ink/10 bg-paper/70 p-4 text-sm leading-6"><input type="checkbox" {...form.register("careConsent")} className="mt-1 h-4 w-4 accent-indigo" />I confirm the pet, address, time and care notes are accurate for eligibility review.</label>{form.formState.errors.careConsent && <span className="mt-2 block text-xs font-semibold text-coral">{form.formState.errors.careConsent.message}</span>}
    <Button type="submit" variant="accent" size="lg" className="mt-8" disabled={form.formState.isSubmitting || !selectedPrice}>{form.formState.isSubmitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <CalendarDays className="h-5 w-5" />}Send care request <ArrowRight className="h-5 w-5" /></Button>
    <style jsx>{`.booking-input{width:100%;min-height:3.25rem;border-radius:1rem;border:1px solid rgb(var(--ink)/.14);background:rgb(var(--paper)/.82);padding:.8rem 1rem;outline:none}.booking-input:focus{border-color:rgb(var(--indigo));box-shadow:0 0 0 3px rgb(var(--indigo)/.12)}`}</style>
  </form>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="block"><span className="mb-2 block text-sm font-semibold">{label}</span>{children}{error && <span className="mt-2 block text-xs font-semibold text-coral">{error}</span>}</label>; }
