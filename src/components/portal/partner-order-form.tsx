"use client";

import { BadgeCheck, CalendarPlus, CheckCircle2, LoaderCircle, Send, ShieldCheck } from "lucide-react";
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
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  async function submit() {
    setPending(true);
    setMessage(null);
    const response = await fetch("/api/partner-orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ partnerServiceId: serviceId, petId: petId || undefined, scheduledAt: scheduledAt || undefined, instructions: instructions || undefined }) });
    const result = await response.json() as { error?: string; message?: string };
    setPending(false);
    if (!response.ok) return setMessage({ tone: "error", text: result.message ?? result.error ?? "The request could not be recorded." });
    setInstructions("");
    setScheduledAt("");
    setMessage({ tone: "success", text: "Request recorded for partner review." });
    router.refresh();
  }

  return (
    <section className="mt-7 overflow-hidden rounded-[1.75rem] bg-[#281d2b] text-paper shadow-soft">
      <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
        <div className="relative overflow-hidden border-b border-paper/10 p-6 lg:border-b-0 lg:border-r">
          <div className="absolute -left-14 -top-14 h-48 w-48 rounded-full bg-indigo/40 blur-3xl" />
          <div className="relative"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron text-ink"><CalendarPlus className="h-5 w-5" /></span><p className="mt-8 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-saffron">Controlled request</p><h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">Ask a verified partner.</h3><p className="mt-3 text-sm leading-6 text-paper/55">The partner reviews timing and availability before commercial terms or payment are discussed.</p><div className="mt-7 grid gap-3"><Rule icon={BadgeCheck} text="Provider verification checked" /><Rule icon={ShieldCheck} text="Sensitive access details stay out" /><Rule icon={CheckCircle2} text="Status remains in your ledger" /></div></div>
        </div>
        <div className="bg-paper p-6 text-ink sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Verified service"><select value={serviceId} onChange={(event) => setServiceId(event.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10"><option value="">Choose a service</option>{services.map((service) => <option key={service.id} value={service.id}>{service.partnerName} · {service.serviceCode.replaceAll("_", " ")}</option>)}</select></Field>
            <Field label="Pet (optional)"><select value={petId} onChange={(event) => setPetId(event.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10"><option value="">No pet selected</option>{pets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name}</option>)}</select></Field>
            <div className="sm:col-span-2"><Field label="Preferred time (optional)"><input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" /></Field></div>
            <div className="sm:col-span-2"><Field label="Context for the partner (optional)"><textarea value={instructions} onChange={(event) => setInstructions(event.target.value)} maxLength={2_000} className="mt-2 min-h-28 w-full resize-y rounded-2xl border border-ink/12 bg-cream/45 p-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" placeholder="Share only the service context needed for a response." /></Field></div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4"><Button type="button" variant="accent" onClick={submit} disabled={pending || !serviceId}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Request review</Button>{message ? <p role={message.tone === "error" ? "alert" : "status"} className={`text-sm font-semibold ${message.tone === "error" ? "text-coral" : "text-leaf"}`}>{message.text}</p> : null}</div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold">{label}{children}</label>;
}

function Rule({ icon: Icon, text }: { icon: typeof BadgeCheck; text: string }) {
  return <div className="flex items-center gap-3 text-xs text-paper/60"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-paper/[0.07] text-saffron"><Icon className="h-4 w-4" /></span>{text}</div>;
}

export function PartnerMarketplaceUnavailable() {
  return <section className="relative mt-7 overflow-hidden rounded-[1.75rem] border border-saffron/20 bg-saffron/10 p-6"><div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-coral/10 blur-3xl" /><span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-paper text-coral shadow-sm"><CalendarPlus className="h-5 w-5" /></span><h2 className="relative mt-5 font-display text-3xl font-semibold tracking-[-0.04em]">Partner services are not open yet.</h2><p className="relative mt-3 max-w-2xl text-sm leading-6 text-ink/55">The pilot remains closed until contracts, verification requirements and commercial policies are approved. Existing requests stay visible below.</p></section>;
}
