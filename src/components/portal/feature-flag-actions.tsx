"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function FeatureFlagAction({ flagKey, enabled }: { flagKey: string; enabled: boolean }) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function update() {
    setPending(true); setError(null);
    const response = await fetch(`/api/admin/features/${encodeURIComponent(flagKey)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled: !enabled, reason }) });
    const result = await response.json() as { error?: string };
    setPending(false);
    if (!response.ok) return setError(result.error ?? "Flag update failed");
    setReason(""); router.refresh();
  }
  return <div className="mt-4"><input value={reason} onChange={(event) => setReason(event.target.value)} minLength={10} maxLength={1000} className="w-full rounded-2xl border border-ink/10 bg-cream/35 px-4 py-3 text-sm outline-none focus:border-indigo" placeholder="Required operational reason" /><button type="button" onClick={update} disabled={pending || reason.trim().length < 10} className={`mt-3 rounded-full px-4 py-2 text-xs font-bold text-paper disabled:opacity-40 ${enabled ? "bg-coral" : "bg-leaf"}`}>{enabled ? "Disable safely" : "Enable deliberately"}</button>{error && <p role="alert" className="mt-2 text-xs font-semibold text-coral">{error}</p>}</div>;
}
