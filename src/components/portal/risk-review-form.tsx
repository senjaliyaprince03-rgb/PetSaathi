"use client";

import { LoaderCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const factors = [["biteHistory", "Known bite history"], ["aggressionTowardPeople", "Aggression toward people"], ["aggressionTowardAnimals", "Aggression toward animals"], ["escapeRisk", "Escape or bolting risk"], ["leashReactivity", "Leash reactivity"], ["medicalComplexity", "Medical complexity"]] as const;

export function RiskReviewForm({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [finalLevel, setFinalLevel] = useState<"GREEN" | "YELLOW" | "RED">("GREEN");
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (reason.trim().length < 10) return setError("Add a clear review reason of at least 10 characters.");
    setPending(true);
    setError(null);
    const factorPayload = Object.fromEntries(factors.map(([key]) => [key, Boolean(selected[key])]));
    const response = await fetch(`/api/admin/bookings/${bookingId}/risk-review`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ finalLevel, factors: factorPayload, reason }) });
    const result = await response.json().catch(() => null) as { error?: string } | null;
    setPending(false);
    if (!response.ok) return setError(result?.error?.replaceAll("_", " ") ?? "Risk review could not be saved.");
    router.refresh();
  }

  return <div className="mt-5 rounded-3xl border border-ink/10 bg-cream/60 p-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/45">Structured risk review</p><div className="mt-4 grid gap-2 sm:grid-cols-2">{factors.map(([key, label]) => <label key={key} className="flex items-center gap-3 rounded-2xl bg-paper p-3 text-sm font-semibold"><input type="checkbox" checked={Boolean(selected[key])} onChange={(event) => setSelected((current) => ({ ...current, [key]: event.target.checked }))} className="h-4 w-4 accent-indigo" />{label}</label>)}</div><div className="mt-4 grid gap-3 sm:grid-cols-[10rem_1fr]"><select aria-label="Final risk level" value={finalLevel} onChange={(event) => setFinalLevel(event.target.value as typeof finalLevel)} className="min-h-11 rounded-2xl border border-ink/15 bg-paper px-4 text-sm"><option value="GREEN">Green</option><option value="YELLOW">Yellow</option><option value="RED">Red</option></select><input aria-label="Risk review reason" value={reason} onChange={(event) => setReason(event.target.value)} className="min-h-11 rounded-2xl border border-ink/15 bg-paper px-4 text-sm" placeholder="Evidence and reason for the final level" /></div><Button type="button" variant="accent" className="mt-4" onClick={submit} disabled={pending}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}Save review</Button>{error && <p className="mt-3 text-sm font-semibold text-coral" role="alert">{error}</p>}</div>;
}
