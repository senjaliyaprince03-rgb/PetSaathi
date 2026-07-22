"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function MembershipActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (status !== "PENDING") {
    return <span className="mt-3 inline-block rounded-full bg-leaf/15 px-3 py-1 text-xs font-bold text-leaf">{status}</span>;
  }

  async function handleAction(action: "APPROVED" | "REJECTED") {
    setLoading(true);
    try {
      await fetch(`/api/admin/community/memberships/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 flex gap-3">
      <button
        disabled={loading}
        onClick={() => handleAction("APPROVED")}
        className="rounded-2xl bg-leaf/15 px-4 py-2 text-sm font-bold text-leaf transition hover:bg-leaf/25 disabled:opacity-50"
      >
        Approve
      </button>
      <button
        disabled={loading}
        onClick={() => handleAction("REJECTED")}
        className="rounded-2xl bg-coral/15 px-4 py-2 text-sm font-bold text-coral transition hover:bg-coral/25 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
