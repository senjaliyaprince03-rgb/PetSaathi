"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PrivacyRequestForm() {
  const router = useRouter();
  const [type, setType] = useState("CORRECTION");
  const [details, setDetails] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit() {
    setPending(true); setError(null);
    const response = await fetch("/api/account-requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, details }) });
    const result = await response.json() as { error?: string; reference?: string };
    setPending(false);
    if (!response.ok) return setError(result.error === "request_already_open" ? `A request is already open${result.reference ? ` (${result.reference})` : ""}.` : "The request could not be recorded. Check the details and try again.");
    setDetails(""); router.refresh();
  }
  return <div className="rounded-4xl border border-ink/10 bg-paper p-6"><h2 className="font-display text-3xl font-semibold">Start a privacy request</h2><p className="mt-2 text-sm leading-6 text-ink/55">This records the request; it never deletes or exports protected data without identity verification and review.</p><select value={type} onChange={(event) => setType(event.target.value)} className="mt-5 min-h-13 w-full rounded-2xl border border-ink/15 bg-cream/35 px-4"><option value="CORRECTION">Correct account data</option><option value="EXPORT">Export my data</option><option value="DELETION">Request account deletion</option></select><textarea value={details} onChange={(event) => setDetails(event.target.value)} minLength={20} maxLength={2000} className="mt-3 min-h-32 w-full rounded-2xl border border-ink/15 bg-cream/35 p-4" placeholder="Describe the records or account scope involved." /><Button type="button" variant="accent" className="mt-4" onClick={submit} disabled={pending || details.trim().length < 20}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Record request</Button>{error && <p role="alert" className="mt-3 text-sm font-semibold text-coral">{error}</p>}</div>;
}
