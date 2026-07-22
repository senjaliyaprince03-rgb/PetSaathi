"use client";

import { AlertTriangle, CheckCircle2, FilePenLine, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ReportReviewActions({ reportId, status, concernFlag, canApproveConcern }: { reportId: string; status: string; concernFlag: boolean; canApproveConcern: boolean }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  if (status === "APPROVED" || status === "CORRECTION_REQUIRED") return null;

  async function review(action: "APPROVE" | "REQUEST_CORRECTION" | "ESCALATE") {
    setPending(action); setError(null);
    const response = await fetch(`/api/admin/reports/${reportId}/review`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, note }) });
    const result = await response.json().catch(() => null) as { message?: string; error?: string } | null;
    setPending(null);
    if (!response.ok) return setError(result?.message ?? result?.error?.replaceAll("_", " ") ?? "Report decision failed.");
    setNote(""); router.refresh();
  }

  return <div className="mt-5 rounded-3xl bg-cream/50 p-4"><label className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45">Review evidence and decision note<textarea value={note} onChange={(event) => setNote(event.target.value)} minLength={10} maxLength={2000} className="mt-2 min-h-24 w-full rounded-2xl border border-ink/12 bg-paper p-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-indigo" placeholder="Record what was checked and why this decision is appropriate" /></label><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => review("APPROVE")} disabled={Boolean(pending) || note.trim().length < 10 || (concernFlag && !canApproveConcern)} className="flex items-center gap-2 rounded-full bg-leaf px-4 py-2 text-xs font-bold text-paper disabled:opacity-35">{pending === "APPROVE" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}Approve and close</button><button type="button" onClick={() => review("REQUEST_CORRECTION")} disabled={Boolean(pending) || note.trim().length < 10} className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-bold text-paper disabled:opacity-35">{pending === "REQUEST_CORRECTION" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FilePenLine className="h-4 w-4" />}Request correction</button><button type="button" onClick={() => review("ESCALATE")} disabled={Boolean(pending) || note.trim().length < 10} className="flex items-center gap-2 rounded-full bg-coral px-4 py-2 text-xs font-bold text-paper disabled:opacity-35">{pending === "ESCALATE" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}Escalate</button></div>{concernFlag && !canApproveConcern && <p className="mt-3 text-xs font-semibold text-coral">A Safety or Super Admin must approve a concern-flagged report.</p>}{error && <p className="mt-3 text-sm font-semibold text-coral" role="alert">{error}</p>}</div>;
}
