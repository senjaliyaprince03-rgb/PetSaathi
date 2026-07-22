"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BellRing, Check } from "lucide-react";

type NotificationItem = {
  id: string;
  templateKey: string;
  status: string;
  scheduledAt: string;
  payload: Record<string, unknown> | null;
};

const notificationCopy: Record<string, { title: string; description: (payload: Record<string, unknown> | null) => string }> = {
  "booking.confirmed": { title: "Booking confirmed", description: (payload) => `Booking ${String(payload?.reference ?? "")} is confirmed and ready in your care timeline.` },
  "report.ready": { title: "Care report ready", description: (payload) => `The care report for booking ${String(payload?.reference ?? "")} is now available.` }
};

export function NotificationList({ notifications }: { notifications: NotificationItem[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function markRead(id: string) {
    setPendingId(id);
    try {
      const response = await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      if (response.ok) router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  if (!notifications.length) return <div className="rounded-4xl border border-dashed border-ink/15 bg-paper p-10 text-center"><BellRing className="mx-auto h-7 w-7 text-coral" /><h2 className="mt-4 font-display text-2xl font-semibold">You are all caught up.</h2><p className="mt-2 text-sm text-ink/55">Booking confirmations, service updates and care reports will appear here.</p></div>;

  return <div className="grid gap-3">{notifications.map((notification) => {
    const copy = notificationCopy[notification.templateKey] ?? { title: "PetSaathi update", description: () => "There is a new update in your PetSaathi workspace." };
    const isRead = notification.status === "READ";
    return <article key={notification.id} className={`rounded-3xl border p-5 ${isRead ? "border-ink/8 bg-paper/60" : "border-coral/20 bg-paper shadow-lifted"}`}><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${isRead ? "bg-ink/20" : "bg-coral"}`} /><h2 className="font-semibold">{copy.title}</h2></div><p className="mt-2 text-sm leading-6 text-ink/55">{copy.description(notification.payload)}</p><p className="mt-3 text-xs text-ink/35">{new Date(notification.scheduledAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p></div>{!isRead && notification.status !== "QUEUED" && notification.status !== "SENDING" && <button type="button" disabled={pendingId === notification.id} onClick={() => markRead(notification.id)} className="flex shrink-0 items-center gap-2 rounded-full border border-ink/10 px-3 py-2 text-xs font-bold transition hover:border-leaf/40 hover:text-leaf disabled:opacity-50"><Check className="h-3.5 w-3.5" />Mark read</button>}</div></article>;
  })}</div>;
}
