"use client";

import { useState } from "react";
import { Building2, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminSocietyProvisionForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const body = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      city: formData.get("city") as string,
      locality: formData.get("locality") as string,
      contactName: formData.get("contactName") as string,
      contactPhone: formData.get("contactPhone") as string,
      managerEmail: formData.get("managerEmail") as string,
    };

    try {
      const res = await fetch("/api/admin/societies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to provision society");
        return;
      }
      setSuccess(`Society ${data.society.name} provisioned successfully!`);
      event.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setPending(false);
    }
  }

  return (
    <article className="rounded-4xl border border-indigo/10 bg-gradient-to-br from-paper to-[#f8f9ff] p-6 shadow-lifted mb-10">
      <div className="flex items-center gap-3 mb-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo/10 text-indigo">
          <Building2 className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">Provision Society Partnership</h2>
          <p className="text-xs text-ink/60">Launch a new 30-day pilot for a residential society</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Society Name (e.g. Gokuldham)" className="h-11 rounded-xl bg-white px-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo/30" />
        <input name="slug" required placeholder="Slug (e.g. gokuldham)" pattern="[a-z0-9-]+" className="h-11 rounded-xl bg-white px-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo/30" />
        <input name="city" required placeholder="City" className="h-11 rounded-xl bg-white px-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo/30" />
        <input name="locality" required placeholder="Locality / Area" className="h-11 rounded-xl bg-white px-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo/30" />
        <input name="contactName" placeholder="RWA Contact Name" className="h-11 rounded-xl bg-white px-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo/30" />
        <input name="contactPhone" placeholder="RWA Contact Phone" className="h-11 rounded-xl bg-white px-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo/30" />
        <input name="managerEmail" type="email" placeholder="Manager Email (to assign access)" className="h-11 rounded-xl bg-white px-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo/30 sm:col-span-2" />
        
        <div className="sm:col-span-2 flex items-center justify-between mt-2">
          <div className="flex-1">
            {error && <p className="text-sm font-semibold text-coral">{error}</p>}
            {success && <p className="text-sm font-semibold text-leaf">{success}</p>}
          </div>
          <button type="submit" disabled={pending} className="flex h-11 w-40 items-center justify-center rounded-xl bg-indigo font-bold text-white transition hover:bg-indigo/90 disabled:opacity-50">
            {pending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : "PROVISION"}
          </button>
        </div>
      </form>
    </article>
  );
}
