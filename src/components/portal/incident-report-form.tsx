"use client";

import { AlertTriangle, LoaderCircle, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type ExistingIncident = { reference: string; status: string } | null | undefined;

export function IncidentReportForm({ bookingId, existingIncident }: { bookingId: string; existingIncident?: ExistingIncident }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("WELFARE");
  const [severity, setSeverity] = useState("MODERATE");
  const [description, setDescription] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setPending(true); setError(null);
    const response = await fetch(`/api/bookings/${bookingId}/incidents`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ category, severity, description, observedSymptoms: symptoms || undefined }) });
    const result = await response.json().catch(() => null) as { message?: string; error?: string } | null;
    setPending(false);
    if (!response.ok) return setError(result?.message ?? result?.error?.replaceAll("_", " ") ?? "The incident could not be recorded.");
    setOpen(false); setDescription(""); setSymptoms(""); router.refresh();
  }

  if (existingIncident) return <section className="mt-6 rounded-3xl border border-coral/25 bg-coral/7 p-5"><div className="flex items-start gap-3"><ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-coral" /><div><p className="font-semibold">Safety case {existingIncident.reference}</p><p className="mt-1 text-sm leading-6 text-ink/60">Status: {existingIncident.status.replaceAll("_", " ").toLowerCase()}. The booking remains controlled by the Safety workflow until authorised recovery.</p></div></div></section>;

  return <section className="mt-6 rounded-3xl border border-coral/20 bg-paper p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-start gap-3"><AlertTriangle className="mt-1 h-5 w-5 text-coral" /><div><p className="font-display text-2xl font-semibold">Report a safety concern</p><p className="mt-1 max-w-2xl text-sm leading-6 text-ink/60">For immediate danger, protect the pet first and contact appropriate local emergency or veterinary help. This form creates PetSaathi’s authoritative safety record.</p></div></div><Button type="button" variant="outline" onClick={() => setOpen((value) => !value)}>{open ? "Close form" : "Open incident form"}</Button></div>{open && <div className="mt-5 grid gap-4"><div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold">Category<select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 min-h-11 w-full rounded-2xl border border-ink/15 bg-paper px-3 font-normal"><option value="INJURY">Injury</option><option value="ILLNESS">Illness</option><option value="ESCAPE">Escape or missing pet</option><option value="BITE">Bite or aggression</option><option value="PROPERTY">Property issue</option><option value="WELFARE">Welfare concern</option><option value="OTHER">Other</option></select></label><label className="text-sm font-semibold">Observed severity<select value={severity} onChange={(event) => setSeverity(event.target.value)} className="mt-2 min-h-11 w-full rounded-2xl border border-ink/15 bg-paper px-3 font-normal"><option value="LOW">Low</option><option value="MODERATE">Moderate</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option></select></label></div><textarea value={description} onChange={(event) => setDescription(event.target.value)} minLength={20} maxLength={3000} className="min-h-28 w-full rounded-2xl border border-ink/15 bg-cream/40 p-4 text-sm outline-none focus:border-coral" placeholder="Describe what happened, where the pet is now, and any immediate action already taken." /><textarea value={symptoms} onChange={(event) => setSymptoms(event.target.value)} maxLength={1500} className="min-h-20 w-full rounded-2xl border border-ink/15 bg-cream/40 p-4 text-sm outline-none focus:border-coral" placeholder="Observed symptoms or behaviour (optional; do not diagnose)" /><Button type="button" variant="accent" className="w-fit" onClick={submit} disabled={pending || description.trim().length < 20}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}Create safety case</Button>{error && <p className="text-sm font-semibold text-coral" role="alert">{error}</p>}</div>}</section>;
}
