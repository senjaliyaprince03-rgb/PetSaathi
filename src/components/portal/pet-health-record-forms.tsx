"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Activity, ClipboardPlus, LoaderCircle, Pill, ShieldPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PetHealthRecordForms({ petId }: { petId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [care, setCare] = useState({ feedingRoutine: "", walkRoutine: "", behaviour: "", handoverNotes: "" });
  const [medication, setMedication] = useState({ name: "", dosage: "", schedule: "", administration: "", prescribedBy: "", startsAt: "", endsAt: "", notes: "" });
  const [vaccination, setVaccination] = useState({ vaccine: "", administeredAt: "", nextDueAt: "", clinic: "", evidenceRef: "" });
  const [event, setEvent] = useState({ eventType: "VET_VISIT", occurredAt: "", summary: "", details: "", providerRef: "" });

  async function submit(kind: string, path: string, payload: Record<string, unknown>, clear: () => void) {
    setPending(kind);
    setMessage(null);
    const response = await fetch(`/api/pets/${petId}/${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json().catch(() => null) as { error?: string } | null;
    setPending(null);
    if (!response.ok) return setMessage(result?.error === "too_many_requests" ? "Daily update limit reached. Try again later." : "This record could not be saved. Check every field and try again.");
    clear();
    setMessage("Record saved.");
    router.refresh();
  }

  return <section className="mt-6 rounded-4xl border border-ink/10 bg-paper p-6"><h2 className="font-display text-3xl font-semibold">Add to the care record</h2><p className="mt-2 text-sm leading-6 text-ink/70">PetSaathi stores what you report; it does not diagnose conditions or verify clinical records.</p>{message && <p aria-live="polite" className="mt-4 rounded-2xl bg-saffron/10 p-3 text-sm font-semibold text-ink/75">{message}</p>}<div className="mt-6 grid gap-4">
    <RecordPanel icon={ClipboardPlus} title="Care instructions"><label className="block text-sm font-semibold">Feeding routine<textarea value={care.feedingRoutine} onChange={(e) => setCare({ ...care, feedingRoutine: e.target.value })} className="record-input min-h-24" /></label><label className="block text-sm font-semibold">Walk or activity routine<textarea value={care.walkRoutine} onChange={(e) => setCare({ ...care, walkRoutine: e.target.value })} className="record-input min-h-20" /></label><label className="block text-sm font-semibold">Behaviour and handling<textarea value={care.behaviour} onChange={(e) => setCare({ ...care, behaviour: e.target.value })} className="record-input min-h-20" /></label><label className="block text-sm font-semibold">Handover notes<textarea value={care.handoverNotes} onChange={(e) => setCare({ ...care, handoverNotes: e.target.value })} className="record-input min-h-20" /></label><SaveButton pending={pending === "care"} disabled={care.feedingRoutine.trim().length < 5} onClick={() => submit("care", "care-instructions", clean(care), () => setCare({ feedingRoutine: "", walkRoutine: "", behaviour: "", handoverNotes: "" }))} /></RecordPanel>
    <RecordPanel icon={Pill} title="Medication"><div className="grid gap-3 sm:grid-cols-2"><Field label="Name"><input value={medication.name} onChange={(e) => setMedication({ ...medication, name: e.target.value })} className="record-input" /></Field><Field label="Dosage"><input value={medication.dosage} onChange={(e) => setMedication({ ...medication, dosage: e.target.value })} className="record-input" /></Field><Field label="Schedule"><input value={medication.schedule} onChange={(e) => setMedication({ ...medication, schedule: e.target.value })} className="record-input" /></Field><Field label="How it is given"><input value={medication.administration} onChange={(e) => setMedication({ ...medication, administration: e.target.value })} className="record-input" /></Field><Field label="Start date"><input type="date" value={medication.startsAt} onChange={(e) => setMedication({ ...medication, startsAt: e.target.value })} className="record-input" /></Field><Field label="End date"><input type="date" value={medication.endsAt} onChange={(e) => setMedication({ ...medication, endsAt: e.target.value })} className="record-input" /></Field></div><Field label="Notes"><textarea value={medication.notes} onChange={(e) => setMedication({ ...medication, notes: e.target.value })} className="record-input min-h-20" /></Field><SaveButton pending={pending === "medication"} disabled={medication.name.trim().length < 2 || medication.dosage.trim().length < 2 || medication.schedule.trim().length < 2} onClick={() => submit("medication", "medications", clean(medication), () => setMedication({ name: "", dosage: "", schedule: "", administration: "", prescribedBy: "", startsAt: "", endsAt: "", notes: "" }))} /></RecordPanel>
    <RecordPanel icon={ShieldPlus} title="Vaccination"><div className="grid gap-3 sm:grid-cols-2"><Field label="Vaccine"><input value={vaccination.vaccine} onChange={(e) => setVaccination({ ...vaccination, vaccine: e.target.value })} className="record-input" /></Field><Field label="Administered"><input type="date" value={vaccination.administeredAt} onChange={(e) => setVaccination({ ...vaccination, administeredAt: e.target.value })} className="record-input" /></Field><Field label="Next due"><input type="date" value={vaccination.nextDueAt} onChange={(e) => setVaccination({ ...vaccination, nextDueAt: e.target.value })} className="record-input" /></Field><Field label="Clinic"><input value={vaccination.clinic} onChange={(e) => setVaccination({ ...vaccination, clinic: e.target.value })} className="record-input" /></Field></div><SaveButton pending={pending === "vaccination"} disabled={vaccination.vaccine.trim().length < 2 || !vaccination.administeredAt} onClick={() => submit("vaccination", "vaccinations", clean(vaccination), () => setVaccination({ vaccine: "", administeredAt: "", nextDueAt: "", clinic: "", evidenceRef: "" }))} /></RecordPanel>
    <RecordPanel icon={Activity} title="Health timeline event"><div className="grid gap-3 sm:grid-cols-2"><Field label="Event type"><select value={event.eventType} onChange={(e) => setEvent({ ...event, eventType: e.target.value })} className="record-input"><option value="VET_VISIT">Vet visit</option><option value="ILLNESS">Illness</option><option value="INJURY">Injury</option><option value="WEIGHT">Weight update</option><option value="DIET_CHANGE">Diet change</option><option value="BEHAVIOUR">Behaviour</option><option value="OTHER">Other</option></select></Field><Field label="When it happened"><input type="datetime-local" value={event.occurredAt} onChange={(e) => setEvent({ ...event, occurredAt: e.target.value })} className="record-input" /></Field></div><Field label="Summary"><input value={event.summary} onChange={(e) => setEvent({ ...event, summary: e.target.value })} className="record-input" /></Field><Field label="Details"><textarea value={event.details} onChange={(e) => setEvent({ ...event, details: e.target.value })} className="record-input min-h-24" /></Field><SaveButton pending={pending === "event"} disabled={!event.occurredAt || event.summary.trim().length < 5} onClick={() => submit("event", "health-events", { ...clean(event), occurredAt: new Date(event.occurredAt).toISOString() }, () => setEvent({ eventType: "VET_VISIT", occurredAt: "", summary: "", details: "", providerRef: "" }))} /></RecordPanel>
  </div><style jsx>{`.record-input{display:block;width:100%;min-height:3rem;margin-top:.45rem;border-radius:1rem;border:1px solid rgb(var(--ink)/.14);background:rgb(var(--cream)/.35);padding:.75rem 1rem;font-weight:400;outline:none}.record-input:focus{border-color:rgb(var(--indigo));box-shadow:0 0 0 3px rgb(var(--indigo)/.1)}`}</style></section>;
}

function clean<T extends Record<string, string>>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item.trim().length > 0));
}

function RecordPanel({ icon: Icon, title, children }: { icon: typeof Activity; title: string; children: React.ReactNode }) {
  return <details className="rounded-3xl border border-ink/10 bg-cream/25 p-5"><summary className="flex cursor-pointer list-none items-center gap-3 font-display text-2xl font-semibold"><Icon className="h-5 w-5 text-indigo" />{title}</summary><div className="mt-5 grid gap-3">{children}</div></details>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold">{label}{children}</label>;
}

function SaveButton({ pending, disabled, onClick }: { pending: boolean; disabled: boolean; onClick: () => void }) {
  return <Button type="button" variant="accent" className="mt-2 w-fit" disabled={pending || disabled} onClick={onClick}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ClipboardPlus className="h-4 w-4" />}Save record</Button>;
}
