"use client";

import { LoaderCircle, RotateCcw, UserRoundX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function SitterCancellationAction({ assignmentId }: { assignmentId: string }) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function cancel() {
    setPending(true); setError(null);
    const response = await fetch(`/api/saathi/assignments/${assignmentId}/cancel`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason }) });
    const result = await response.json().catch(() => null) as { message?: string; error?: string } | null;
    setPending(false);
    if (!response.ok) return setError(result?.message ?? result?.error?.replaceAll("_", " ") ?? "The replacement request could not be opened.");
    router.refresh();
  }
  return <div className="mt-4 rounded-3xl border border-saffron/30 bg-saffron/10 p-4"><p className="text-sm font-semibold">Unable to fulfil this confirmed service?</p><p className="mt-1 text-xs leading-5 text-ink/55">Record the reason immediately. The customer’s verified payment and booking capacity stay attached while Operations searches for a customer-approved replacement.</p><textarea value={reason} onChange={(event) => setReason(event.target.value)} minLength={10} maxLength={1000} className="mt-3 min-h-20 w-full rounded-2xl border border-ink/15 bg-paper p-3 text-sm" placeholder="Explain the change and any handover information" /><Button type="button" variant="outline" className="mt-3" onClick={cancel} disabled={pending || reason.trim().length < 10}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}Request replacement</Button>{error && <p className="mt-3 text-sm font-semibold text-coral" role="alert">{error}</p>}</div>;
}

export function AdminNoShowAction({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function record() {
    setPending(true); setError(null);
    const response = await fetch(`/api/admin/bookings/${bookingId}/no-show`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason }) });
    const result = await response.json().catch(() => null) as { message?: string; error?: string } | null;
    setPending(false);
    if (!response.ok) return setError(result?.message ?? result?.error?.replaceAll("_", " ") ?? "The no-show could not be recorded.");
    router.refresh();
  }
  return <div className="mt-5 rounded-3xl border border-coral/20 bg-coral/5 p-4"><p className="text-sm font-semibold">Verified Saathi no-show</p><p className="mt-1 text-xs leading-5 text-ink/55">Use only after Operations verifies the missed arrival. This records the no-show, preserves the original payment/capacity and opens replacement matching.</p><textarea value={reason} onChange={(event) => setReason(event.target.value)} minLength={10} maxLength={1000} className="mt-3 min-h-20 w-full rounded-2xl border border-ink/15 bg-paper p-3 text-sm" placeholder="Verification steps, attempted contact and observed outcome" /><Button type="button" variant="outline" className="mt-3" onClick={record} disabled={pending || reason.trim().length < 10}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UserRoundX className="h-4 w-4" />}Record no-show and find replacement</Button>{error && <p className="mt-3 text-sm font-semibold text-coral" role="alert">{error}</p>}</div>;
}
