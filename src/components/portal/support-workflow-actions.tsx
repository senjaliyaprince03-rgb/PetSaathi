"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const supportStates: Record<string, string[]> = {
  OPEN: ["WAITING_CUSTOMER", "WAITING_OPERATIONS", "ESCALATED", "RESOLVED"],
  WAITING_CUSTOMER: ["OPEN", "ESCALATED", "RESOLVED"],
  WAITING_OPERATIONS: ["OPEN", "ESCALATED", "RESOLVED"],
  ESCALATED: ["WAITING_CUSTOMER", "WAITING_OPERATIONS", "RESOLVED"],
  RESOLVED: ["OPEN", "CLOSED"]
};

const complaintStates: Record<string, string[]> = {
  RECEIVED: ["TRIAGING", "REJECTED"],
  TRIAGING: ["IN_REVIEW", "ACTION_REQUIRED", "RESOLVED", "REJECTED"],
  IN_REVIEW: ["ACTION_REQUIRED", "RESOLVED", "REJECTED"],
  ACTION_REQUIRED: ["IN_REVIEW", "RESOLVED"],
  RESOLVED: ["IN_REVIEW", "CLOSED"],
  REJECTED: ["IN_REVIEW", "CLOSED"]
};

export function SupportWorkflowActions({ id, status, kind }: { id: string; status: string; kind: "support" | "complaint" }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const actions = (kind === "support" ? supportStates : complaintStates)[status] ?? [];
  if (!actions.length) return null;

  async function transition(toState: string) {
    setPending(true);
    setError(null);
    const collection = kind === "support" ? "support-cases" : "complaints";
    const response = await fetch(`/api/admin/${collection}/${id}/transition`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ toState, note }) });
    const result = await response.json() as { error?: string };
    setPending(false);
    if (!response.ok) return setError(result.error ?? "Workflow update failed");
    setNote("");
    router.refresh();
  }

  return <div className="mt-4"><label className="block text-xs font-bold uppercase tracking-[0.14em] text-ink/60">Required case note<input value={note} onChange={(event) => setNote(event.target.value)} minLength={5} maxLength={2000} className="mt-2 w-full rounded-2xl border border-ink/10 bg-cream/40 px-4 py-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-indigo" /></label><div className="mt-3 flex flex-wrap gap-2">{actions.map((state) => <button key={state} type="button" disabled={pending || note.trim().length < 5} onClick={() => transition(state)} className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-paper transition hover:bg-coral disabled:opacity-40">{state.replaceAll("_", " ")}</button>)}</div>{error && <p role="alert" className="mt-2 text-xs font-semibold text-coral">{error}</p>}</div>;
}
