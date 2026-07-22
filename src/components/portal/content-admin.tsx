"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle, Send } from "lucide-react";

const nextStates: Record<string, string[]> = { DRAFT: ["IN_REVIEW"], IN_REVIEW: ["DRAFT", "APPROVED"], APPROVED: ["DRAFT", "PUBLISHED"], PUBLISHED: ["ARCHIVED"], ARCHIVED: ["DRAFT"] };

export function ContentCreateForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(null);
    const data = new FormData(event.currentTarget);
    const paragraphs = String(data.get("body") ?? "").split(/\n\s*\n/).map((text) => text.trim()).filter(Boolean).map((text) => ({ type: "paragraph", text }));
    const response = await fetch("/api/admin/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: data.get("slug"), type: data.get("type"), title: data.get("title"), excerpt: data.get("excerpt"), primaryJob: data.get("primaryJob"), city: data.get("city") || undefined, body: paragraphs }) });
    const result = await response.json() as { error?: string };
    setPending(false);
    if (!response.ok) return setError(result.error ?? "Draft could not be created");
    event.currentTarget.reset(); router.refresh();
  }
  return <form onSubmit={submit} className="rounded-4xl border border-ink/10 bg-paper p-6"><h2 className="font-display text-3xl font-semibold">Create a structured draft</h2><div className="mt-5 grid gap-3 sm:grid-cols-2"><Input name="title" label="Title" required /><Input name="slug" label="URL slug" required /><Input name="type" label="Type" placeholder="LOCAL_GUIDE" required /><Input name="primaryJob" label="Primary reader job" required /><Input name="city" label="City (optional)" /><Input name="excerpt" label="Excerpt" required /></div><label className="mt-3 block text-sm font-semibold">Article paragraphs<textarea name="body" required minLength={30} className="mt-2 min-h-48 w-full rounded-2xl border border-ink/10 bg-cream/35 p-4 font-normal" placeholder="Separate paragraphs with a blank line. Stored as safe structured blocks, never raw HTML." /></label><button type="submit" disabled={pending} className="mt-4 flex items-center gap-2 rounded-full bg-indigo px-5 py-3 text-sm font-bold text-paper disabled:opacity-40">{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Create draft</button>{error && <p role="alert" className="mt-3 text-sm font-semibold text-coral">{error}</p>}</form>;
}

export function ContentTransitionActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const actions = nextStates[status] ?? [];
  async function transition(toState: string) {
    setPending(true); setError(null);
    const response = await fetch(`/api/admin/content/${id}/transition`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ toState, reason }) });
    const result = await response.json() as { error?: string };
    setPending(false);
    if (!response.ok) return setError(result.error ?? "Content transition failed");
    setReason(""); router.refresh();
  }
  return <div className="mt-4"><input value={reason} onChange={(event) => setReason(event.target.value)} minLength={10} maxLength={1000} className="w-full rounded-2xl border border-ink/10 bg-cream/35 px-4 py-3 text-sm" placeholder="Required editorial reason" /><div className="mt-3 flex flex-wrap gap-2">{actions.map((state) => <button key={state} type="button" disabled={pending || reason.trim().length < 10} onClick={() => transition(state)} className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-paper disabled:opacity-40">{state.replaceAll("_", " ")}</button>)}</div>{error && <p role="alert" className="mt-2 text-xs font-semibold text-coral">{error}</p>}</div>;
}

export function ExpertReviewForm({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(null);
    const data = new FormData(event.currentTarget);
    const response = await fetch(`/api/admin/content/${id}/expert-review`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reviewerName: data.get("reviewerName"), credentials: data.get("credentials"), scope: data.get("scope"), verdict: data.get("verdict"), notes: data.get("notes") }) });
    const result = await response.json() as { error?: string };
    setPending(false);
    if (!response.ok) return setError(result.error ?? "Expert review could not be recorded");
    event.currentTarget.reset(); router.refresh();
  }
  return <details className="mt-4 rounded-2xl border border-leaf/20 bg-leaf/5 p-4"><summary className="cursor-pointer text-sm font-bold text-leaf">Record expert review</summary><form onSubmit={submit} className="mt-4 grid gap-3"><Input name="reviewerName" label="Reviewer name" required /><Input name="credentials" label="Credentials and registration" required /><Input name="scope" label="Review scope" required /><label className="text-sm font-semibold">Verdict<select name="verdict" className="mt-2 min-h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4"><option value="APPROVED">Approved</option><option value="CHANGES_REQUIRED">Changes required</option></select></label><label className="text-sm font-semibold">Review notes<textarea name="notes" required minLength={20} className="mt-2 min-h-24 w-full rounded-2xl border border-ink/10 bg-paper p-3 font-normal" /></label><button type="submit" disabled={pending} className="rounded-full bg-leaf px-4 py-2 text-xs font-bold text-paper disabled:opacity-40">{pending ? "Saving…" : "Save review evidence"}</button>{error && <p role="alert" className="text-xs font-semibold text-coral">{error}</p>}</form></details>;
}

function Input({ name, label, required = false, placeholder }: { name: string; label: string; required?: boolean; placeholder?: string }) { return <label className="text-sm font-semibold">{label}<input name={name} required={required} placeholder={placeholder} className="mt-2 min-h-12 w-full rounded-2xl border border-ink/10 bg-cream/35 px-4 font-normal" /></label>; }
