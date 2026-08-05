"use client";

import { Car, CheckCircle2, LoaderCircle, MapPin, Send, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type Pet = { id: string; name: string };

const TRIP_TYPES = [
  { id: "OWNER_ACCOMPANIED", label: "Owner-Accompanied", description: "You travel together with your pet in a pet-friendly vehicle." },
  { id: "HANDLER_ACCOMPANIED", label: "Handler-Accompanied", description: "A trained handler travels alongside your pet." },
  { id: "UNACCOMPANIED", label: "Unaccompanied Transfer", description: "Direct pet transfer (Available after safety verification)." },
] as const;

const PURPOSES = ["Vet Visit", "Grooming Appointment", "Boarding Transfer", "Airport / Railway", "Relocation", "Other"] as const;

export function TaxiRequestForm({ pets }: { pets: Pet[] }) {
  const router = useRouter();
  const [tripType, setTripType] = useState<string>("OWNER_ACCOMPANIED");
  const [petId, setPetId] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [purpose, setPurpose] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [instructions, setInstructions] = useState("");
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
        pickupAddress,
        dropoffAddress,
        purpose,
        scheduledAt: scheduledAt || undefined,
        instructions: instructions || undefined,
      }),
    });
    const result = await response.json() as { error?: string; message?: string };
    setPending(false);
    if (!response.ok) return setMessage({ tone: "error", text: result.message ?? result.error ?? "Taxi request failed." });
    setPickupAddress("");
    setDropoffAddress("");
    setInstructions("");
    setMessage({ tone: "success", text: "Pet taxi request recorded for dispatch." });
    router.refresh();
  }

  return (
    <section className="mt-7 overflow-hidden rounded-[1.75rem] bg-[#281d2b] text-paper shadow-soft">
      <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
        <div className="relative overflow-hidden border-b border-paper/10 p-6 lg:border-b-0 lg:border-r">
          <div className="absolute -left-14 -top-14 h-48 w-48 rounded-full bg-saffron/30 blur-3xl" />
          <div className="relative">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron text-ink"><Car className="h-5 w-5" /></span>
            <p className="mt-8 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-saffron">Pet taxi transport</p>
            <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">Pet-safe rides, whenever you need.</h3>
            <p className="mt-3 text-sm leading-6 text-paper/55">Commercial permitted vehicles equipped with safety restraints, AC, and washable seat covers.</p>
            <div className="mt-7 grid gap-3">
              <Rule icon={ShieldCheck} text="Commercial permitted vehicles & verified drivers" />
              <Rule icon={MapPin} text="Live GPS & route updates" />
              <Rule icon={CheckCircle2} text="No un-related passenger pooling" />
            </div>
          </div>
        </div>

        <div className="bg-paper p-6 text-ink sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Trip Type">
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {TRIP_TYPES.map((t) => (
                    <button key={t.id} type="button" onClick={() => setTripType(t.id)} className={`rounded-xl border p-3 text-left transition ${tripType === t.id ? "border-indigo bg-indigo/5 font-semibold" : "border-ink/10"}`}>
                      <p className="text-xs font-bold">{t.label}</p>
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <Field label="Select Pet">
              <select value={petId} onChange={(e) => setPetId(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10">
                <option value="">Choose pet</option>
                {pets.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </Field>

            <Field label="Trip Purpose">
              <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10">
                <option value="">Select purpose</option>
                {PURPOSES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>

            <div className="sm:col-span-2">
              <Field label="Pickup Location">
                <input type="text" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} placeholder="Full pickup address or society name" className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Drop-off Location">
                <input type="text" value={dropoffAddress} onChange={(e) => setDropoffAddress(e.target.value)} placeholder="Full destination address" className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Pickup Time">
                <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Special Handling Instructions (optional)">
                <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} maxLength={1000} placeholder="Crate preference, motion sickness, assistance needed..." className="mt-2 min-h-24 w-full resize-y rounded-2xl border border-ink/12 bg-cream/45 p-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
              </Field>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Button type="button" variant="accent" onClick={submit} disabled={pending || !petId || !pickupAddress || !dropoffAddress}>
              {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Request Taxi
            </Button>
            {message ? <p role={message.tone === "error" ? "alert" : "status"} className={`text-sm font-semibold ${message.tone === "error" ? "text-coral" : "text-leaf"}`}>{message.text}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold">{label}{children}</label>;
}

function Rule({ icon: Icon, text }: { icon: typeof ShieldCheck; text: string }) {
  return <div className="flex items-center gap-3 text-xs text-paper/60"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-paper/[0.07] text-saffron"><Icon className="h-4 w-4" /></span>{text}</div>;
}
