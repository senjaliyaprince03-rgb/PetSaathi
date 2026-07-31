"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const nextStates: Record<string, string[]> = { NEW: ["CONTACTED", "DISQUALIFIED"], CONTACTED: ["QUALIFIED", "DISQUALIFIED"], QUALIFIED: ["PILOT_PROPOSED", "CONVERTED", "DISQUALIFIED"], PILOT_PROPOSED: ["CONVERTED", "QUALIFIED", "DISQUALIFIED"], DISQUALIFIED: ["NEW"] };

export function LeadActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const actions = nextStates[status] ?? [];
  if (!actions.length) return null;
  async function transition(toState: string) {
    setPending(true); setError(null);
    const response = await fetch(`/api/admin/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: toState, reason: note }) });
    const result = await response.json() as { error?: string };
    setPending(false);
    if (!response.ok) return setError(result.error ?? "Lead update failed");
    router.refresh();
  }
  return <div className="mt-4"><input value={note} onChange={(event) => setNote(event.target.value)} minLength={5} maxLength={1000} className="w-full rounded-2xl border border-ink/10 bg-cream/40 px-4 py-3 text-sm outline-none focus:border-indigo" placeholder="Required qualification note" /><div className="mt-3 flex flex-wrap gap-2">{actions.map((state) => <button key={state} type="button" disabled={pending || note.trim().length < 5} onClick={() => transition(state)} className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-paper transition hover:bg-coral disabled:opacity-40">{state.replaceAll("_", " ")}</button>)}</div>{error && <p role="alert" className="mt-2 text-xs font-semibold text-coral">{error}</p>}</div>;
}
