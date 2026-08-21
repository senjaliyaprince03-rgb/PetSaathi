"use client";

import { AlertTriangle, Car, LoaderCircle, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type Pet = { id: string; name: string };

const TRIP_PURPOSES = ["Vet Visit", "Grooming", "Boarding", "Airport", "Other"];

export function TaxiRequestForm({ pets }: { pets: Pet[] }) {
  const router = useRouter();
  const [tripType, setTripType] = useState<"OWNER_ACCOMPANIED" | "HANDLER_ACCOMPANIED" | "UNACCOMPANIED" | "">("");
  const [petId, setPetId] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [purpose, setPurpose] = useState("");
  const [instructions, setInstructions] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  async function submit() {
    setPending(true);
    setMessage(null);
    const response = await fetch("/api/customer/taxi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        tripType, 
        petId, 
        pickup, 
        dropoff, 
        purpose, 
        instructions, 
        scheduledAt: scheduledAt || undefined 
      })
    });
    
    const result = await response.json() as { error?: string; message?: string };
    setPending(false);
    
    if (!response.ok) return setMessage({ tone: "error", text: result.message ?? result.error ?? "Failed to book taxi." });
    
    setMessage({ tone: "success", text: "Taxi booked successfully." });
    setTripType("");
    setPetId("");
    setPickup("");
    setDropoff("");
    setPurpose("");
    setInstructions("");
    setScheduledAt("");
    router.refresh();
  }

  return (
    <section className="mt-7 overflow-hidden rounded-[1.75rem] bg-[#281d2b] text-paper shadow-soft">
      <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
        <div className="relative overflow-hidden border-b border-paper/10 p-6 lg:border-b-0 lg:border-r">
          <div className="absolute -left-14 -top-14 h-48 w-48 rounded-full bg-indigo/40 blur-3xl" />
          <div className="relative">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo text-paper">
              <Car className="h-5 w-5" />
            </span>
            <p className="mt-8 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-indigo">Pet Transportation</p>
            <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">Book a Pet Taxi.</h3>
            <p className="mt-3 text-sm leading-6 text-paper/80">Safe, stress-free rides tailored for pets. From vet visits to boarding drops.</p>
          </div>
        </div>
        
        <div className="bg-paper p-6 text-ink sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Trip Type">
                <select value={tripType} onChange={(e) => setTripType(e.target.value as any)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10">
                  <option value="">Select trip type</option>
                  <option value="OWNER_ACCOMPANIED">Owner Accompanied</option>
                  <option value="HANDLER_ACCOMPANIED">Handler Accompanied (We provide handler)</option>
                  <option value="UNACCOMPANIED">Unaccompanied (Pet travels alone)</option>
                </select>
              </Field>
              
              {tripType === "UNACCOMPANIED" && (
                <div className="mt-3 p-3 bg-saffron/10 border border-saffron/20 rounded-xl text-saffron flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="text-xs">Unaccompanied trips require your pet to be comfortable in a secure crate and not prone to severe travel anxiety.</p>
                </div>
              )}
            </div>

            <Field label="Pet">
              <select value={petId} onChange={(e) => setPetId(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10">
                <option value="">Select a pet</option>
                {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </Field>

            <Field label="Trip Purpose">
              <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10">
                <option value="">Select purpose</option>
                {TRIP_PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>

            <div className="sm:col-span-2">
              <Field label="Pickup Address">
                <input type="text" value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Full pickup address" className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Drop-off Address">
                <input type="text" value={dropoff} onChange={(e) => setDropoff(e.target.value)} placeholder="Full destination address" className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Pickup Time">
                <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Special Instructions (Optional)">
                <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} className="mt-2 min-h-24 w-full resize-y rounded-2xl border border-ink/12 bg-cream/45 p-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" placeholder="E.g., Gets car sick, needs help boarding..." />
              </Field>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Button variant="accent" onClick={submit} disabled={pending || !tripType || !petId || !pickup || !dropoff || !scheduledAt || !purpose}>
              {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Request Taxi
            </Button>
            {message && (
              <span className={`text-sm font-semibold ${message.tone === 'success' ? 'text-leaf' : 'text-coral'}`}>
                {message.text}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold">{label}{children}</label>;
}
