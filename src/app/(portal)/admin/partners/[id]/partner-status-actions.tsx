"use client";

import { useState, useTransition } from "react";
import { Ban, Loader2, RotateCcw } from "lucide-react";

import { setPartnerStatus } from "./actions";

export function PartnerStatusActions({ partnerId, status }: { partnerId: string; status: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(next: "ACTIVE" | "PAUSED") {
    setError(null);
    startTransition(async () => {
      const result = await setPartnerStatus(partnerId, next);
      if (!result.ok) setError(result.error ?? "update_failed");
    });
  }

  if (error) {
    return <p className="text-sm font-semibold text-coral">Action failed ({error}). Refresh and retry.</p>;
  }

  if (status === "PAUSED") {
    return (
      <button
        onClick={() => run("ACTIVE")}
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-2xl bg-leaf/10 px-5 py-3 text-sm font-bold text-leaf transition hover:bg-leaf/20 disabled:opacity-60"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
        Resume Partner
      </button>
    );
  }

  return (
    <button
      onClick={() => run("PAUSED")}
      disabled={isPending || status !== "ACTIVE"}
      title={status === "ACTIVE" ? "Suspend Partner" : "Only active partners can be suspended"}
      className="inline-flex items-center gap-2 rounded-2xl bg-coral/10 px-5 py-3 text-sm font-bold text-coral transition hover:bg-coral/20 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
      Suspend Partner
    </button>
  );
}
