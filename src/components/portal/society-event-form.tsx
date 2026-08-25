"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, Loader2, Save, X } from "lucide-react";

export type SocietyEventDraft = {
  id?: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  capacity?: number | null;
};

function toLocalInput(value: Date | string | null | undefined): string {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function SocietyEventForm({ event, onClose }: { event?: SocietyEventDraft; onClose: () => void }) {
  const router = useRouter();
  const isEdit = Boolean(event?.id);
  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [startsAt, setStartsAt] = useState(toLocalInput(event?.startsAt));
  const [endsAt, setEndsAt] = useState(toLocalInput(event?.endsAt));
  const [capacity, setCapacity] = useState(event?.capacity ? String(event.capacity) : "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    setError(null);
    if (!title.trim() || !description.trim() || !startsAt || !endsAt) {
      setError("Title, description and both dates are required.");
      return;
    }
    if (new Date(endsAt) <= new Date(startsAt)) {
      setError("The end time must be after the start time.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(isEdit ? `/api/society/events/${event!.id}` : "/api/society/events", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          startsAt: new Date(startsAt).toISOString(),
          endsAt: new Date(endsAt).toISOString(),
          ...(capacity ? { capacity: Number(capacity) } : {})
        })
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(payload?.error === "forbidden" ? "You are not allowed to manage events." : "Could not save the event. Try again.");
        return;
      }
      onClose();
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="col-span-full rounded-[2rem] border border-indigo/20 bg-paper p-6 shadow-lifted sm:p-8">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 font-display text-2xl font-semibold">
          <CalendarPlus className="h-6 w-6 text-indigo" />
          {isEdit ? "Edit Event" : "Plan New Event"}
        </p>
        <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/60 text-ink/80 transition hover:bg-cream">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-ink/80 sm:col-span-2">
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} className="min-h-11 rounded-2xl border border-ink/12 bg-cream/45 px-4 text-sm font-normal normal-case tracking-normal text-ink outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" placeholder="Sunday vaccination camp" />
        </label>
        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-ink/80 sm:col-span-2">
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} rows={3} className="rounded-2xl border border-ink/12 bg-cream/45 px-4 py-3 text-sm font-normal normal-case tracking-normal text-ink outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" placeholder="What will happen, who should join, what to bring." />
        </label>
        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-ink/80">
          Starts at
          <input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="min-h-11 rounded-2xl border border-ink/12 bg-cream/45 px-4 text-sm font-normal text-ink outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
        </label>
        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-ink/80">
          Ends at
          <input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className="min-h-11 rounded-2xl border border-ink/12 bg-cream/45 px-4 text-sm font-normal text-ink outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
        </label>
        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-ink/80">
          Capacity (optional)
          <input type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} className="min-h-11 rounded-2xl border border-ink/12 bg-cream/45 px-4 text-sm font-normal text-ink outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" placeholder="Unlimited" />
        </label>
      </div>

      {error ? <p className="mt-4 rounded-2xl bg-coral/10 p-3 text-sm font-semibold text-coral">{error}</p> : null}

      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="rounded-2xl bg-cream/60 px-5 py-3 text-sm font-bold text-ink/80 transition hover:bg-cream">Cancel</button>
        <button onClick={submit} disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-indigo px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo/90 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "Save Changes" : "Publish Event"}
        </button>
      </div>
    </div>
  );
}
