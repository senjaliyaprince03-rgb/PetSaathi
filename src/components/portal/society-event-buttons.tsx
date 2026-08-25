"use client";

import { useState } from "react";
import { CalendarPlus } from "lucide-react";

import { SocietyEventForm, type SocietyEventDraft } from "./society-event-form";

export function PlanEventButton() {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div className="col-span-full">
        <SocietyEventForm onClose={() => setOpen(false)} />
      </div>
    );
  }

  return (
    <button
      onClick={() => setOpen(true)}
      className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-indigo px-6 font-bold text-white transition hover:bg-indigo/90"
    >
      <CalendarPlus className="h-5 w-5" />
      Plan New Event
    </button>
  );
}

export function EditEventButton({ event }: { event: SocietyEventDraft }) {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div className="col-span-full">
        <SocietyEventForm event={event} onClose={() => setOpen(false)} />
      </div>
    );
  }

  return (
    <button onClick={() => setOpen(true)} className="text-sm font-bold text-indigo hover:underline">
      Edit
    </button>
  );
}
