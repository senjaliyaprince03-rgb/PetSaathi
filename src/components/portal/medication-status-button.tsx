"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, LoaderCircle } from "lucide-react";

export function MedicationStatusButton({ petId, medicationId }: { petId: string; medicationId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  async function endMedication() {
    setPending(true);
    const response = await fetch(`/api/pets/${petId}/medications/${medicationId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: false }) });
    setPending(false);
    if (response.ok) router.refresh();
  }
  return <button type="button" disabled={pending} onClick={endMedication} className="mt-3 flex items-center gap-2 rounded-full border border-ink/10 px-3 py-2 text-xs font-bold transition hover:border-leaf/40 hover:text-leaf disabled:opacity-50">{pending ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}Mark ended</button>;
}
