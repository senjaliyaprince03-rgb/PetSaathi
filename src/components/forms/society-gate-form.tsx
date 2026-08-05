"use client";

import { useState } from "react";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export function SocietyGateForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const body = {
      visitorApprovalRequired: formData.get("visitorApprovalRequired") === "on",
      sitterRegistrationRequired: formData.get("sitterRegistrationRequired") === "on",
      identityDocumentRequired: formData.get("identityDocumentRequired") === "on",
      approvedGates: formData.get("approvedGates") as string,
      petLiftRules: formData.get("petLiftRules") as string,
    };

    try {
      const res = await fetch("/api/society/gate-protocol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update protocols");
        return;
      }
      setSuccess("Gate protocols updated successfully!");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="flex items-center gap-3 mb-2 border-b border-ink/10 pb-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral/10 text-coral">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">Access & Security Settings</h2>
          <p className="text-xs text-ink/60">Configure how PetSaathi sitters enter your premises</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-3 rounded-xl border border-ink/10 p-4 cursor-pointer hover:bg-black/5 transition">
          <input type="checkbox" name="visitorApprovalRequired" defaultChecked={initialData?.visitorApprovalRequired ?? true} className="h-5 w-5 rounded border-gray-300 text-indigo focus:ring-indigo" />
          <span className="text-sm font-semibold">Require MyGate/App Approval</span>
        </label>
        
        <label className="flex items-center gap-3 rounded-xl border border-ink/10 p-4 cursor-pointer hover:bg-black/5 transition">
          <input type="checkbox" name="sitterRegistrationRequired" defaultChecked={initialData?.sitterRegistrationRequired ?? true} className="h-5 w-5 rounded border-gray-300 text-indigo focus:ring-indigo" />
          <span className="text-sm font-semibold">Pre-register Sitter Identity</span>
        </label>
        
        <label className="flex items-center gap-3 rounded-xl border border-ink/10 p-4 cursor-pointer hover:bg-black/5 transition sm:col-span-2">
          <input type="checkbox" name="identityDocumentRequired" defaultChecked={initialData?.identityDocumentRequired ?? true} className="h-5 w-5 rounded border-gray-300 text-indigo focus:ring-indigo" />
          <span className="text-sm font-semibold">Physical ID surrender required at gate</span>
        </label>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="text-sm font-semibold mb-1 block">Approved Entry Gates (comma separated)</label>
          <input name="approvedGates" defaultValue={initialData?.approvedGates?.join(", ") ?? "Gate 1"} className="w-full h-12 rounded-xl border border-ink/20 px-4 text-sm outline-none focus:border-indigo" placeholder="e.g. Gate 1, Service Gate" />
        </div>
        
        <div>
          <label className="text-sm font-semibold mb-1 block">Pet / Service Lift Rules</label>
          <textarea name="petLiftRules" defaultValue={initialData?.petLiftRules ?? ""} className="w-full h-24 rounded-xl border border-ink/20 p-4 text-sm outline-none focus:border-indigo" placeholder="E.g. Dogs are only allowed in the Service Lift. Must be muzzled." />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-ink/10 pt-6">
        <div className="flex-1">
          {error && <p className="text-sm font-semibold text-coral">{error}</p>}
          {success && <p className="text-sm font-semibold text-leaf">{success}</p>}
        </div>
        <button type="submit" disabled={pending} className="flex h-12 w-48 items-center justify-center rounded-xl bg-indigo font-bold text-white transition hover:bg-indigo/90 disabled:opacity-50">
          {pending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : "Save Protocols"}
        </button>
      </div>
    </form>
  );
}
