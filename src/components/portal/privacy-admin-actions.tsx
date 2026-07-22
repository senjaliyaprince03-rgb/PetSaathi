"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const nextStates: Record<string, string[]> = { RECEIVED: ["IDENTITY_VERIFIED", "REJECTED"], IDENTITY_VERIFIED: ["IN_REVIEW", "REJECTED"], IN_REVIEW: ["APPROVED", "REJECTED"], APPROVED: ["FULFILLED", "REJECTED"] };

export function PrivacyAdminActions({ id, status, type }: { id: string; status: string; type: string }) {
  const router = useRouter();
  const [resolution, setResolution] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const actions = (nextStates[status] ?? []).filter((state) => !(type === "DELETION" && state === "FULFILLED"));
  if (!actions.length) return null;
  async function transition(toState: string) {
    setPending(true); setError(null);
    const response = await fetch(`/api/admin/account-requests/${id}/transition`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ toState, resolution }) });
    const result = await response.json() as { error?: string };
    setPending(false);
    if (!response.ok) return setError(result.error ?? "Privacy request update failed");
    setResolution(""); router.refresh();
  }
  return <div className="mt-4"><textarea value={resolution} onChange={(event) => setResolution(event.target.value)} minLength={10} maxLength={2000} className="min-h-24 w-full rounded-2xl border border-ink/10 bg-cream/35 p-3 text-sm" placeholder="Required verification or resolution evidence" /><div className="mt-3 flex flex-wrap gap-2">{actions.map((state) => <button key={state} type="button" disabled={pending || resolution.trim().length < 10} onClick={() => transition(state)} className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-paper disabled:opacity-40">{state.replaceAll("_", " ")}</button>)}</div>{error && <p role="alert" className="mt-2 text-xs font-semibold text-coral">{error}</p>}</div>;
}
