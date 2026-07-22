"use client";

import { Check, LoaderCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function AssignmentActions({ assignmentId }: { assignmentId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState<"ACCEPT" | "DECLINE" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function respond(action: "ACCEPT" | "DECLINE") {
    setPending(action);
    setError(null);
    const response = await fetch(`/api/saathi/assignments/${assignmentId}/response`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    const result = await response.json().catch(() => null) as { reasons?: string[] } | null;
    setPending(null);
    if (!response.ok) return setError(result?.reasons?.join(", ").replaceAll("_", " ") ?? "This offer is no longer available.");
    router.refresh();
  }

  return <div className="mt-5"><div className="flex flex-wrap gap-3"><Button type="button" variant="accent" onClick={() => respond("ACCEPT")} disabled={Boolean(pending)}>{pending === "ACCEPT" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Accept offer</Button><Button type="button" variant="outline" onClick={() => respond("DECLINE")} disabled={Boolean(pending)}>{pending === "DECLINE" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}Decline</Button></div>{error && <p className="mt-3 text-sm font-semibold text-coral" role="alert">{error}</p>}</div>;
}
