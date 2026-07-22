"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const nextStates: Record<string, string[]> = { REQUESTED: ["ACCEPTED", "CANCELLED"], ACCEPTED: ["SCHEDULED", "CANCELLED", "DISPUTED"], SCHEDULED: ["IN_PROGRESS", "CANCELLED", "DISPUTED"], IN_PROGRESS: ["COMPLETED", "DISPUTED"], COMPLETED: ["DISPUTED"] };

export function PartnerOrderWorkflowActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const options = nextStates[status] ?? [];
  if (!options.length) return null;

  async function transition(toState: string) {
    setPending(toState); setError(null);
    const response = await fetch(`/api/admin/partner-orders/${id}/transition`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ toState, note, scheduledAt: scheduledAt || undefined }) });
    const result = await response.json() as { error?: string; message?: string };
    setPending(null);
    if (!response.ok) return setError(result.message ?? result.error ?? "The order could not be updated.");
    setNote(""); setScheduledAt(""); router.refresh();
  }

  return <div className="mt-5 rounded-3xl bg-cream/60 p-4"><label className="block text-xs font-bold uppercase tracking-[0.14em] text-ink/55">Manager note<textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-2 min-h-20 w-full rounded-2xl border border-ink/15 bg-paper p-3 text-sm font-normal normal-case tracking-normal" placeholder="Availability, handoff or dispute context" /></label>{options.includes("SCHEDULED") && <label className="mt-3 block text-xs font-bold uppercase tracking-[0.14em] text-ink/55">Confirmed time<input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} className="mt-2 min-h-11 w-full rounded-2xl border border-ink/15 bg-paper px-3 text-sm font-normal normal-case tracking-normal" /></label>}<div className="mt-3 flex flex-wrap gap-2">{options.map((state) => <button key={state} type="button" onClick={() => transition(state)} disabled={Boolean(pending) || note.trim().length < 5 || (state === "SCHEDULED" && !scheduledAt)} className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-paper hover:bg-coral disabled:opacity-40">{pending === state && <LoaderCircle className="mr-2 inline h-3.5 w-3.5 animate-spin" />}{state.replaceAll("_", " ")}</button>)}</div>{error && <p role="alert" className="mt-3 text-xs font-semibold text-coral">{error}</p>}</div>;
}
