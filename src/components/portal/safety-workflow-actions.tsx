"use client";

import { CheckCircle2, FileUp, LoaderCircle, LockKeyhole, MessageSquareText, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

type CorrectiveAction = { id: string; title: string; dueAt: string | null; completedAt: string | null };
type Props = { incidentId: string; status: string; bookingStatus: string; hasSitter: boolean; activeHold: boolean; correctiveActions: CorrectiveAction[] };

const transitions: Record<string, string[]> = {
  REPORTED: ["TRIAGING"],
  TRIAGING: ["ACTIVE_RESPONSE", "MONITORING"],
  ACTIVE_RESPONSE: ["VET_CONTACTED", "TRANSPORTING", "MONITORING", "IMMEDIATE_RISK_RESOLVED"],
  VET_CONTACTED: ["TRANSPORTING", "MONITORING", "IMMEDIATE_RISK_RESOLVED"],
  TRANSPORTING: ["MONITORING", "IMMEDIATE_RISK_RESOLVED"],
  MONITORING: ["ACTIVE_RESPONSE", "VET_CONTACTED", "IMMEDIATE_RISK_RESOLVED"],
  IMMEDIATE_RISK_RESOLVED: ["REVIEW_PENDING"],
  REVIEW_PENDING: ["CLOSED"],
  CORRECTIVE_ACTION_OPEN: ["CLOSED"]
};

const transitionEvent: Record<string, string> = {
  TRIAGING: "TRIAGE_NOTE",
  ACTIVE_RESPONSE: "TRIAGE_NOTE",
  VET_CONTACTED: "VET_CONTACTED",
  TRANSPORTING: "TRANSPORT_UPDATE",
  MONITORING: "MONITORING_UPDATE",
  IMMEDIATE_RISK_RESOLVED: "MONITORING_UPDATE",
  REVIEW_PENDING: "REVIEW_NOTE",
  CLOSED: "CLOSURE_NOTE"
};

export function SafetyWorkflowActions({ incidentId, status, bookingStatus, hasSitter, activeHold, correctiveActions }: Props) {
  const router = useRouter();
  const availableTransitions = useMemo(() => transitions[status] ?? [], [status]);
  const [toState, setToState] = useState(availableTransitions[0] ?? "");
  const [transitionNote, setTransitionNote] = useState("");
  const [bookingResolution, setBookingResolution] = useState("CONFIRMED");
  const [eventType, setEventType] = useState("OWNER_CONTACTED");
  const [eventNote, setEventNote] = useState("");
  const [actionTitle, setActionTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [completionNotes, setCompletionNotes] = useState<Record<string, string>>({});
  const [holdReason, setHoldReason] = useState("");
  const [holdExpiresAt, setHoldExpiresAt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function post(key: string, path: string, body: Record<string, unknown>) {
    setPending(key); setError(null); setMessage(null);
    const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json().catch(() => null) as { message?: string; error?: string } | null;
    setPending(null);
    if (!response.ok) { setError(result?.message ?? result?.error?.replaceAll("_", " ") ?? "The safety action could not be recorded."); return false; }
    setMessage("Recorded in the incident timeline and audit history."); router.refresh(); return true;
  }

  async function transition() {
    const closedHeld = toState === "CLOSED" && bookingStatus === "INCIDENT_HOLD";
    await post("transition", `/api/admin/incidents/${incidentId}/transition`, { toState, details: transitionNote, eventType: transitionEvent[toState], bookingResolution: closedHeld ? bookingResolution : undefined });
  }

  async function addAction() {
    const saved = await post("action", `/api/admin/incidents/${incidentId}/corrective-actions`, { title: actionTitle, dueAt: new Date(dueAt).toISOString() });
    if (saved) { setActionTitle(""); setDueAt(""); }
  }

  async function completeAction(actionId: string) {
    const saved = await post(`complete:${actionId}`, `/api/admin/incidents/${incidentId}/corrective-actions/${actionId}/complete`, { completionNote: completionNotes[actionId] });
    if (saved) setCompletionNotes((current) => ({ ...current, [actionId]: "" }));
  }

  async function updateHold() {
    const saved = await post("hold", `/api/admin/incidents/${incidentId}/sitter-hold`, activeHold ? { action: "RELEASE", reason: holdReason } : { action: "PLACE", reason: holdReason, expiresAt: holdExpiresAt ? new Date(holdExpiresAt).toISOString() : undefined });
    if (saved) { setHoldReason(""); setHoldExpiresAt(""); }
  }

  async function uploadEvidence() {
    if (!file) return;
    setPending("upload"); setError(null); setMessage(null);
    const signedResponse = await fetch("/api/uploads/sign", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ purpose: "INCIDENT_EVIDENCE", resourceId: incidentId, mimeType: file.type, sizeBytes: file.size }) });
    const signed = await signedResponse.json().catch(() => null) as { upload?: { signedUrl: string }; message?: string; error?: string } | null;
    if (!signedResponse.ok || !signed?.upload) { setPending(null); return setError(signed?.message ?? signed?.error?.replaceAll("_", " ") ?? "Evidence upload could not be prepared."); }
    const uploaded = await fetch(signed.upload.signedUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
    setPending(null);
    if (!uploaded.ok) return setError("The evidence file did not reach quarantine. Try again.");
    setFile(null); setMessage("Evidence uploaded to quarantine. It becomes part of the timeline only after malware scanning and promotion.");
  }

  return <div className="mt-6 grid gap-4 border-t border-ink/10 pt-6">
    <div className="grid gap-3 rounded-3xl bg-cream/55 p-4"><p className="flex items-center gap-2 text-sm font-bold"><MessageSquareText className="h-4 w-4 text-leaf" />Record contact or evidence note</p><div className="grid gap-3 sm:grid-cols-[15rem_1fr]"><select value={eventType} onChange={(event) => setEventType(event.target.value)} className="min-h-11 rounded-2xl border border-ink/15 bg-paper px-3 text-sm"><option value="OWNER_CONTACTED">Owner contacted</option><option value="VET_CONTACTED">Vet contacted</option><option value="COMMUNICATION_RECORDED">Communication recorded</option><option value="TRANSPORT_UPDATE">Transport update</option><option value="MONITORING_UPDATE">Monitoring update</option><option value="REVIEW_NOTE">Review note</option><option value="EVIDENCE_NOTE">Evidence note</option></select><textarea value={eventNote} onChange={(event) => setEventNote(event.target.value)} className="min-h-20 rounded-2xl border border-ink/15 bg-paper p-3 text-sm" placeholder="Attempt, outcome, approved update or factual evidence note" /></div><Button type="button" variant="outline" className="w-fit" onClick={() => post("event", `/api/admin/incidents/${incidentId}/events`, { type: eventType, details: eventNote })} disabled={Boolean(pending) || eventNote.trim().length < 5}>{pending === "event" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <MessageSquareText className="h-4 w-4" />}Add timeline event</Button></div>
    {availableTransitions.length > 0 && <div className="grid gap-3 rounded-3xl bg-indigo p-4 text-paper"><p className="flex items-center gap-2 text-sm font-bold"><ShieldCheck className="h-4 w-4 text-saffron" />Controlled state transition</p><div className="grid gap-3 sm:grid-cols-2"><select value={toState} onChange={(event) => setToState(event.target.value)} className="min-h-11 rounded-2xl border border-paper/15 bg-paper/10 px-3 text-sm">{availableTransitions.map((next) => <option key={next} value={next} className="text-ink">{next.replaceAll("_", " ")}</option>)}</select>{toState === "CLOSED" && bookingStatus === "INCIDENT_HOLD" && <select value={bookingResolution} onChange={(event) => setBookingResolution(event.target.value)} className="min-h-11 rounded-2xl border border-paper/15 bg-paper/10 px-3 text-sm"><option value="CONFIRMED" className="text-ink">Resume confirmed care</option><option value="IN_PROGRESS" className="text-ink">Resume in-progress care</option><option value="REPORT_PENDING" className="text-ink">Continue to report</option><option value="COMPLETED" className="text-ink">Return to completed review</option><option value="REPLACEMENT_REQUIRED" className="text-ink">Find customer-approved replacement</option></select>}</div><textarea value={transitionNote} onChange={(event) => setTransitionNote(event.target.value)} className="min-h-20 rounded-2xl border border-paper/15 bg-paper/10 p-3 text-sm placeholder:text-paper/40" placeholder="Factual reason and evidence for this state change" /><Button type="button" variant="accent" className="w-fit" onClick={transition} disabled={Boolean(pending) || !toState || transitionNote.trim().length < 5}>{pending === "transition" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}Record transition</Button></div>}
    {(["REVIEW_PENDING", "CORRECTIVE_ACTION_OPEN"] as string[]).includes(status) && <div className="grid gap-3 rounded-3xl border border-saffron/25 bg-saffron/10 p-4"><p className="text-sm font-bold">Corrective actions</p>{correctiveActions.map((action) => <div key={action.id} className="rounded-2xl bg-paper p-3"><div className="flex flex-wrap justify-between gap-2"><p className="text-sm font-semibold">{action.title}</p><span className="text-xs font-bold text-ink/45">{action.completedAt ? "Completed" : action.dueAt ? `Due ${new Date(action.dueAt).toLocaleDateString("en-IN")}` : "Deadline missing"}</span></div>{!action.completedAt && <div className="mt-3 flex flex-col gap-2 sm:flex-row"><input value={completionNotes[action.id] ?? ""} onChange={(event) => setCompletionNotes((current) => ({ ...current, [action.id]: event.target.value }))} className="min-h-11 flex-1 rounded-2xl border border-ink/15 px-3 text-sm" placeholder="Completion evidence and verification result" /><Button type="button" variant="outline" onClick={() => completeAction(action.id)} disabled={Boolean(pending) || (completionNotes[action.id]?.trim().length ?? 0) < 10}>{pending === `complete:${action.id}` ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}Complete</Button></div>}</div>)}<div className="grid gap-3 sm:grid-cols-[1fr_14rem_auto]"><input value={actionTitle} onChange={(event) => setActionTitle(event.target.value)} className="min-h-11 rounded-2xl border border-ink/15 bg-paper px-3 text-sm" placeholder="Preventive or follow-up action" /><input type="datetime-local" value={dueAt} onChange={(event) => setDueAt(event.target.value)} className="min-h-11 rounded-2xl border border-ink/15 bg-paper px-3 text-sm" /><Button type="button" variant="accent" onClick={addAction} disabled={Boolean(pending) || actionTitle.trim().length < 10 || !dueAt}>{pending === "action" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}Assign</Button></div></div>}
    {hasSitter && <div className="grid gap-3 rounded-3xl border border-ink/10 bg-paper p-4"><p className="flex items-center gap-2 text-sm font-bold"><LockKeyhole className="h-4 w-4 text-coral" />{activeHold ? "Release Saathi safety hold" : "Place purpose-limited Saathi hold"}</p><p className="text-xs leading-5 text-ink/55">A hold removes the Saathi from new matching without rewriting their profile status. It must be reasoned and can be released independently after review.</p><div className="grid gap-3 sm:grid-cols-[1fr_14rem_auto]"><input value={holdReason} onChange={(event) => setHoldReason(event.target.value)} className="min-h-11 rounded-2xl border border-ink/15 px-3 text-sm" placeholder={activeHold ? "Release rationale" : "Hold rationale"} />{!activeHold && <input type="datetime-local" value={holdExpiresAt} onChange={(event) => setHoldExpiresAt(event.target.value)} className="min-h-11 rounded-2xl border border-ink/15 px-3 text-sm" />}<Button type="button" variant="outline" onClick={updateHold} disabled={Boolean(pending) || holdReason.trim().length < 10}>{pending === "hold" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}{activeHold ? "Release hold" : "Place hold"}</Button></div></div>}
    <div className="grid gap-3 rounded-3xl border border-ink/10 bg-paper p-4"><p className="flex items-center gap-2 text-sm font-bold"><FileUp className="h-4 w-4 text-leaf" />Private incident evidence</p><p className="text-xs leading-5 text-ink/55">JPEG, PNG, WebP or PDF up to 15 MB. Files remain quarantined until an external scanner confirms the declared MIME type and promotes the object.</p><div className="flex flex-col gap-3 sm:flex-row"><input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="min-h-11 flex-1 rounded-2xl border border-ink/15 bg-cream/40 p-2 text-sm" /><Button type="button" variant="outline" onClick={uploadEvidence} disabled={Boolean(pending) || !file || file.size > 15 * 1024 * 1024}>{pending === "upload" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}Upload to quarantine</Button></div></div>
    {message && <p className="rounded-2xl bg-leaf/10 p-3 text-sm font-semibold text-leaf" role="status">{message}</p>}{error && <p className="rounded-2xl bg-coral/10 p-3 text-sm font-semibold text-coral" role="alert">{error}</p>}
  </div>;
}
