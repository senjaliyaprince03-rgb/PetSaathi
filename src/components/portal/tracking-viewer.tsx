"use client";

import { useState } from "react";
import { LocateFixed, RefreshCw } from "lucide-react";

type TrackingResult = { session: null | { status: string; distanceM: number | null; points: Array<{ latitude: number; longitude: number; accuracyM: number | null; recordedAt: string }> } };

export function TrackingViewer({ bookingId }: { bookingId: string }) {
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [pending, setPending] = useState(false);
  async function refresh() {
    setPending(true);
    const response = await fetch(`/api/bookings/${bookingId}/tracking`, { cache: "no-store" });
    if (response.ok) setResult(await response.json() as TrackingResult);
    setPending(false);
  }
  const last = result?.session?.points.at(-1);
  return <section className="mt-6 rounded-4xl border border-indigo/15 bg-indigo p-6 text-paper"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-saffron">Live service tracking</p><h2 className="mt-2 font-display text-3xl font-semibold">Private location updates</h2></div><button type="button" onClick={refresh} disabled={pending} className="flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-xs font-bold text-ink disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${pending ? "animate-spin" : ""}`} />Refresh</button></div>{!result ? <p className="mt-4 text-sm text-paper/55">Location is fetched only when you request it.</p> : !result.session || !last ? <p className="mt-4 text-sm text-paper/55">The Saathi has not started location sharing.</p> : <div className="mt-5 flex items-start gap-3 rounded-3xl bg-paper/10 p-4"><LocateFixed className="mt-0.5 h-5 w-5 text-saffron" /><div><p className="font-semibold">Last update {new Date(last.recordedAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", second: "2-digit" })}</p><p className="mt-1 text-sm text-paper/55">Approx. coordinates {last.latitude.toFixed(5)}, {last.longitude.toFixed(5)} · distance {result.session.distanceM ?? 0} m</p></div></div>}</section>;
}
