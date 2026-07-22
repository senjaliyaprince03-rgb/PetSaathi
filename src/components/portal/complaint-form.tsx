"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle, MessageSquareWarning, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ComplaintForm({ bookingId, existingReference }: { bookingId: string; existingReference?: string }) {
  const router = useRouter();
  const [category, setCategory] = useState("CARE_QUALITY");
  const [severity, setSeverity] = useState("LOW");
  const [description, setDescription] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (existingReference) return <section className="mt-6 rounded-4xl border border-coral/20 bg-paper p-6"><MessageSquareWarning className="h-6 w-6 text-coral" /><h2 className="mt-3 font-display text-2xl font-semibold">Complaint under review</h2><p className="mt-2 text-sm text-ink/70">Reference {existingReference}. Operations will keep this record separate from the public review system.</p></section>;

  async function submit() {
    setPending(true);
    setError(null);
    const response = await fetch(`/api/bookings/${bookingId}/complaints`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ category, severity, description }) });
    const result = await response.json() as { error?: string; reference?: string };
    setPending(false);
    if (!response.ok) return setError(result.error === "complaint_already_open" ? `A complaint is already open${result.reference ? ` (${result.reference})` : ""}.` : "The complaint could not be recorded. Check the details and try again.");
    setDescription("");
    router.refresh();
  }

  return <details className="mt-6 rounded-4xl border border-ink/10 bg-paper p-6"><summary className="cursor-pointer font-display text-2xl font-semibold">Report a problem with this booking</summary><p className="mt-3 text-sm leading-6 text-ink/70">Use this for a formal care, communication, property, payment or safety complaint. For an active emergency, follow the emergency instructions immediately.</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold">Category<select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-ink/15 bg-cream/35 px-4 font-normal"><option value="CARE_QUALITY">Care quality</option><option value="COMMUNICATION">Communication</option><option value="NO_SHOW">No show</option><option value="PROPERTY">Property</option><option value="PAYMENT">Payment</option><option value="SAFETY">Safety</option><option value="OTHER">Other</option></select></label><label className="text-sm font-semibold">Severity<select value={severity} onChange={(event) => setSeverity(event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-ink/15 bg-cream/35 px-4 font-normal"><option value="LOW">Low</option><option value="MODERATE">Moderate</option><option value="HIGH">High</option></select></label></div><label className="mt-3 block text-sm font-semibold">What happened?<textarea value={description} onChange={(event) => setDescription(event.target.value)} minLength={30} maxLength={4000} className="mt-2 min-h-36 w-full rounded-2xl border border-ink/15 bg-cream/35 p-4 font-normal" /></label><Button type="button" variant="accent" className="mt-4" onClick={submit} disabled={pending || description.trim().length < 30}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Record complaint</Button>{error && <p role="alert" className="mt-3 text-sm font-semibold text-coral">{error}</p>}</details>;
}
