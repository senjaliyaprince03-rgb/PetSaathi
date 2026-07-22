"use client";

import { CheckCircle2, LoaderCircle, MapPin, Navigation, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { TrackingControls } from "@/components/portal/tracking-controls";

export function ServiceActions({ assignmentId, bookingStatus, trackingEnabled = false }: { assignmentId: string; bookingStatus: string; trackingEnabled?: boolean }) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const action = bookingStatus === "CONFIRMED" ? { type: "EN_ROUTE", label: "Start journey", icon: Navigation } : bookingStatus === "SITTER_EN_ROUTE" ? { type: "CHECK_IN", label: "Confirm check-in", icon: MapPin } : bookingStatus === "IN_PROGRESS" ? { type: "CHECK_OUT", label: "Complete service", icon: CheckCircle2 } : null;

  async function send(type: string) {
    setPending(type); setError(null);
    const response = await fetch(`/api/saathi/assignments/${assignmentId}/events`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, notes: notes || undefined }) });
    setPending(null);
    if (!response.ok) return setError("This milestone is not available in the current service state.");
    setNotes(""); router.refresh();
  }

  if (!action && bookingStatus !== "IN_PROGRESS") return null;
  const Icon = action?.icon;
  return <div className="mt-5 rounded-3xl bg-indigo p-5 text-paper"><p className="text-xs font-bold uppercase tracking-[0.18em] text-paper/45">Service controls</p>{bookingStatus === "IN_PROGRESS" && <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-4 min-h-20 w-full rounded-2xl border border-paper/15 bg-paper/10 p-3 text-sm outline-none placeholder:text-paper/35" placeholder="Optional structured update note" />}<div className="mt-4 flex flex-wrap gap-3">{bookingStatus === "IN_PROGRESS" && <Button type="button" variant="outline" className="border-paper/25 text-paper hover:bg-paper/10" onClick={() => send("CARE_UPDATE")} disabled={Boolean(pending)}>{pending === "CARE_UPDATE" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Send update</Button>}{action && <Button type="button" variant="accent" onClick={() => send(action.type)} disabled={Boolean(pending)}>{pending === action.type ? <LoaderCircle className="h-4 w-4 animate-spin" /> : Icon && <Icon className="h-4 w-4" />}{action.label}</Button>}</div>{bookingStatus === "IN_PROGRESS" && trackingEnabled && <TrackingControls assignmentId={assignmentId} />}{error && <p className="mt-3 text-sm font-semibold text-saffron" role="alert">{error}</p>}</div>;
}

export function ReportForm({ assignmentId, correctionNote }: { assignmentId: string; correctionNote?: string }) {
  const router = useRouter();
  const [summary, setSummary] = useState("");
  const [behaviour, setBehaviour] = useState("");
  const [concern, setConcern] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit() {
    setPending(true); setError(null);
    const response = await fetch(`/api/saathi/assignments/${assignmentId}/report`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ summary, behaviour: behaviour || undefined, concernFlag: concern }) });
    setPending(false);
    if (!response.ok) return setError("Add a meaningful summary before submitting the report.");
    router.refresh();
  }
  return <div className="mt-5 rounded-3xl border border-ink/10 bg-paper p-5"><p className="font-display text-2xl font-semibold">{correctionNote ? "Submit a corrected report" : "Complete the care report"}</p>{correctionNote && <p className="mt-3 rounded-2xl bg-saffron/15 p-3 text-sm leading-6"><strong>Reviewer note:</strong> {correctionNote}</p>}<textarea value={summary} onChange={(event) => setSummary(event.target.value)} className="mt-4 min-h-28 w-full rounded-2xl border border-ink/15 bg-cream/40 p-4" placeholder="What happened during care?" /><textarea value={behaviour} onChange={(event) => setBehaviour(event.target.value)} className="mt-3 min-h-20 w-full rounded-2xl border border-ink/15 bg-cream/40 p-4" placeholder="Behaviour and settling notes (optional)" /><label className="mt-4 flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={concern} onChange={(event) => setConcern(event.target.checked)} className="accent-indigo" />Flag this report for operations review</label><Button type="button" variant="accent" className="mt-5" onClick={submit} disabled={pending}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}{correctionNote ? "Submit corrected report" : "Submit report"}</Button>{error && <p className="mt-3 text-sm font-semibold text-coral" role="alert">{error}</p>}</div>;
}
