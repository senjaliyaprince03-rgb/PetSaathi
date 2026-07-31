"use client";

import { LoaderCircle, UserRoundCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function MatchSitterForm({ bookingId, sitters, replacement = false }: { bookingId: string; sitters: Array<{ id: string; name: string }>; replacement?: boolean }) {
  const router = useRouter();
  const [sitterId, setSitterId] = useState(sitters[0]?.id ?? "");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function offer() {
    setPending(true);
    setMessage(null);
    const response = await fetch(`/api/admin/bookings/${bookingId}/assignments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sitterId }) });
    const result = await response.json().catch(() => null) as { reasons?: string[]; error?: string } | null;
    setPending(false);
    if (!response.ok) return setMessage(result?.reasons?.join(", ").replaceAll("_", " ") ?? result?.error?.replaceAll("_", " ") ?? "Offer could not be created");
    router.refresh();
  }

  if (!sitters.length) return <p className="mt-4 rounded-2xl bg-saffron/12 p-4 text-sm font-semibold">No service-permitted Saathi is available in this shortlist.</p>;
  return <div className="mt-5"><div className="flex flex-col gap-3 sm:flex-row"><select value={sitterId} onChange={(event) => setSitterId(event.target.value)} aria-label={replacement ? "Proposed replacement Saathi" : "Proposed Saathi"} className="min-h-11 flex-1 rounded-2xl border border-ink/15 bg-paper px-4 text-sm outline-none">{sitters.map((sitter) => <option key={sitter.id} value={sitter.id}>{sitter.name}</option>)}</select><Button type="button" variant="accent" onClick={offer} disabled={pending}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UserRoundCheck className="h-4 w-4" />}{replacement ? "Send replacement offer" : "Send offer"}</Button></div>{message && <p className="mt-3 text-sm font-semibold text-coral" role="alert">{message}</p>}</div>;
}
