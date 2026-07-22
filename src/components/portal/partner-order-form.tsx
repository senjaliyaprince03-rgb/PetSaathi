"use client";

import { CalendarPlus, LoaderCircle, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type Service = { id: string; serviceCode: string; partnerName: string };
type Pet = { id: string; name: string };

export function PartnerOrderForm({ services, pets }: { services: Service[]; pets: Pet[] }) {
  const router = useRouter();
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [petId, setPetId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [instructions, setInstructions] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setPending(true); setError(null);
    const response = await fetch("/api/partner-orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ partnerServiceId: serviceId, petId: petId || undefined, scheduledAt: scheduledAt || undefined, instructions: instructions || undefined }) });
    const result = await response.json() as { error?: string; message?: string };
    setPending(false);
    if (!response.ok) return setError(result.message ?? result.error ?? "The request could not be recorded.");
    setInstructions(""); setScheduledAt(""); router.refresh();
  }

  return <section className="mt-5 rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted"><p className="eyebrow">controlled partner request</p><h2 className="mt-3 font-display text-3xl font-semibold">Request a verified partner service</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-ink/60">This records a service request only. A verified partner manager confirms availability and timing before any commercial terms or payment are discussed.</p><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Service<select value={serviceId} onChange={(event) => setServiceId(event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-ink/15 bg-cream/45 px-3 font-normal"><option value="">Choose a service</option>{services.map((service) => <option key={service.id} value={service.id}>{service.partnerName} · {service.serviceCode.replaceAll("_", " ")}</option>)}</select></label><label className="text-sm font-semibold">Pet (optional)<select value={petId} onChange={(event) => setPetId(event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-ink/15 bg-cream/45 px-3 font-normal"><option value="">No pet selected</option>{pets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name}</option>)}</select></label><label className="text-sm font-semibold sm:col-span-2">Preferred time (optional)<input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-ink/15 bg-cream/45 px-3 font-normal" /></label></div><label className="mt-4 block text-sm font-semibold">Context for the partner (optional)<textarea value={instructions} onChange={(event) => setInstructions(event.target.value)} maxLength={2_000} className="mt-2 min-h-24 w-full rounded-2xl border border-ink/15 bg-cream/45 p-3 font-normal" placeholder="Share only the service context needed for a response. Do not include medical or access details here." /></label><Button type="button" variant="accent" className="mt-5" onClick={submit} disabled={pending || !serviceId}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Request review</Button>{error && <p role="alert" className="mt-3 text-sm font-semibold text-coral">{error}</p>}</section>;
}

export function PartnerMarketplaceUnavailable() {
  return <section className="mt-5 rounded-4xl border border-saffron/25 bg-saffron/10 p-6"><CalendarPlus className="h-6 w-6 text-coral" /><h2 className="mt-3 font-display text-3xl font-semibold">Partner services are not open yet.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-ink/60">This pilot stays closed until contracts, verification requirements and commercial policies are approved. Existing service requests remain visible below.</p></section>;
}
