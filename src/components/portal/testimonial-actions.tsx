"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TestimonialActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "PUBLISHED" || status === "ARCHIVED") {
    return <span className="mt-3 inline-block rounded-full bg-leaf/15 px-3 py-1 text-xs font-bold text-leaf">{status}</span>;
  }

  async function handleAction(action: "APPROVED" | "PUBLISHED" | "REJECTED") {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const result = await response.json() as { error?: string; message?: string };
      if (!response.ok) {
        setError(result.message ?? result.error ?? "Testimonial update failed");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4">
      <div className="flex gap-3">
        <button
          disabled={loading}
          onClick={() => handleAction(status === "APPROVED" ? "PUBLISHED" : "APPROVED")}
          className="rounded-2xl bg-leaf/15 px-4 py-2 text-sm font-bold text-leaf transition hover:bg-leaf/25 disabled:opacity-50"
        >
          {status === "APPROVED" ? "Publish with consent" : "Approve"}
        </button>
        <button
          disabled={loading}
          onClick={() => handleAction("REJECTED")}
          className="rounded-2xl bg-coral/15 px-4 py-2 text-sm font-bold text-coral transition hover:bg-coral/25 disabled:opacity-50"
        >
          Reject
        </button>
      </div>
      {error && <p role="alert" className="mt-2 text-xs font-semibold text-coral">{error}</p>}
    </div>
  );
}
