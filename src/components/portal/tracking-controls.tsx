"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, LocateFixed, MapPinOff } from "lucide-react";

import { Button } from "@/components/ui/button";

type SessionResult = { session?: { id: string }; error?: string };

export function TrackingControls({ assignmentId }: { assignmentId: string }) {
  const watchId = useRef<number | null>(null);
  const sessionId = useRef<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => { if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current); }, []);

  async function start() {
    setPending(true);
    setError(null);
    if (!("geolocation" in navigator)) { setPending(false); setError("Location is not supported on this device."); return; }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const response = await fetch(`/api/saathi/assignments/${assignmentId}/tracking`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "START", latitude: position.coords.latitude, longitude: position.coords.longitude, accuracyM: position.coords.accuracy }) });
      const result = await response.json() as SessionResult;
      if (!response.ok || !result.session) { setPending(false); setError(result.error ?? "Location sharing could not start."); return; }
      sessionId.current = result.session.id;
      setSharing(true);
      setPending(false);
      watchId.current = navigator.geolocation.watchPosition((nextPosition) => void sendPoint(nextPosition), () => setError("Location updates paused by the device."), { enableHighAccuracy: true, maximumAge: 10_000, timeout: 20_000 });
    }, () => { setPending(false); setError("Allow location access to share service progress."); }, { enableHighAccuracy: true, timeout: 20_000 });
  }

  async function sendPoint(position: GeolocationPosition) {
    if (!sessionId.current) return;
    await fetch(`/api/saathi/assignments/${assignmentId}/tracking`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "POINT", sessionId: sessionId.current, latitude: position.coords.latitude, longitude: position.coords.longitude, accuracyM: position.coords.accuracy }) });
  }

  async function stop() {
    if (!sessionId.current) return;
    setPending(true);
    await fetch(`/api/saathi/assignments/${assignmentId}/tracking`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "STOP", sessionId: sessionId.current }) });
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    watchId.current = null;
    sessionId.current = null;
    setSharing(false);
    setPending(false);
  }

  return <div className="mt-4 rounded-2xl border border-paper/15 bg-paper/8 p-4"><p className="text-sm font-semibold">Live service location</p><p className="mt-1 text-xs leading-5 text-paper/50">Shared only with the pet parent and authorised operations during this active service. Location automatically expires and is removed on the configured retention schedule.</p><Button type="button" variant={sharing ? "outline" : "accent"} className={sharing ? "mt-3 border-paper/25 text-paper hover:bg-paper/10" : "mt-3"} onClick={sharing ? stop : start} disabled={pending}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : sharing ? <MapPinOff className="h-4 w-4" /> : <LocateFixed className="h-4 w-4" />}{sharing ? "Stop sharing" : "Start location sharing"}</Button>{error && <p role="alert" className="mt-2 text-xs font-semibold text-saffron">{error}</p>}</div>;
}
