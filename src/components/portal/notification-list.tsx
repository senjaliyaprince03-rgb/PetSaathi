"use client";

import { BellRing, Check, CheckCheck, Circle, Clock3, Inbox } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type NotificationItem = {
  id: string;
  templateKey: string;
  status: string;
  scheduledAt: string;
  payload: Record<string, unknown> | null;
};

const notificationCopy: Record<string, { title: string; description: (payload: Record<string, unknown> | null) => string }> = {
  "booking.confirmed": { title: "Booking confirmed", description: (payload) => `Booking ${String(payload?.reference ?? "")} is confirmed and ready in your care timeline.` },
  "report.ready": { title: "Care report ready", description: (payload) => `The care report for booking ${String(payload?.reference ?? "")} is now available.` },
};

type Filter = "ALL" | "UNREAD" | "READ";

export function NotificationList({ notifications }: { notifications: NotificationItem[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("ALL");
  const unreadCount = notifications.filter((item) => item.status !== "READ").length;
  const visible = useMemo(() => notifications.filter((item) => filter === "ALL" || (filter === "READ" ? item.status === "READ" : item.status !== "READ")), [filter, notifications]);

  async function markRead(id: string) {
    setPendingId(id);
    try {
      const response = await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      if (response.ok) router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-ink/[0.07] bg-paper">
      <div className="flex flex-col justify-between gap-4 border-b border-ink/[0.07] p-4 sm:flex-row sm:items-center sm:p-5">
        <div><p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-coral">Account activity</p><p className="mt-1 text-sm text-ink/45">{unreadCount ? `${unreadCount} update${unreadCount === 1 ? "" : "s"} need attention` : "Everything has been reviewed"}</p></div>
        <div className="flex rounded-full bg-cream/60 p-1" aria-label="Filter notifications">{(["ALL", "UNREAD", "READ"] as const).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} aria-pressed={filter === item} className={`min-h-9 rounded-full px-4 text-[0.65rem] font-bold transition ${filter === item ? "bg-[#281d2b] text-paper shadow-sm" : "text-ink/45 hover:text-ink"}`}>{item === "ALL" ? `All ${notifications.length}` : item === "UNREAD" ? `Unread ${unreadCount}` : `Read ${notifications.length - unreadCount}`}</button>)}</div>
      </div>

      {!notifications.length ? <Empty title="You are all caught up." copy="Booking confirmations, service updates and care reports will appear here." /> : !visible.length ? <Empty title={`No ${filter.toLowerCase()} updates.`} copy="Choose another filter to review the rest of your notification history." /> : <div className="divide-y divide-ink/[0.07]">{visible.map((notification) => {
        const copy = notificationCopy[notification.templateKey] ?? { title: titleFromTemplate(notification.templateKey), description: () => "There is a new authenticated update in your PetSaathi workspace." };
        const isRead = notification.status === "READ";
        const isPending = notification.status === "QUEUED" || notification.status === "SENDING";
        return <article key={notification.id} className={`group relative p-5 transition sm:p-6 ${isRead ? "bg-paper" : "bg-gradient-to-r from-coral/[0.055] to-paper"}`}><span className={`absolute bottom-0 left-0 top-0 w-1 ${isRead ? "bg-transparent" : "bg-coral"}`} /><div className="flex items-start gap-4"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${isRead ? "bg-ink/[0.05] text-ink/35" : "bg-coral/10 text-coral"}`}>{isRead ? <CheckCheck className="h-5 w-5" /> : <BellRing className="h-5 w-5" />}</span><div className="min-w-0 flex-1"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><div className="flex items-center gap-2"><h3 className="font-bold">{copy.title}</h3>{!isRead ? <Circle className="h-2.5 w-2.5 fill-coral text-coral" /> : null}</div><p className="mt-2 max-w-2xl text-sm leading-6 text-ink/52">{copy.description(notification.payload)}</p><p className="mt-3 flex items-center gap-1.5 text-xs text-ink/35"><Clock3 className="h-3.5 w-3.5" />{new Date(notification.scheduledAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p></div>{!isRead && !isPending ? <button type="button" disabled={pendingId === notification.id} onClick={() => markRead(notification.id)} className="inline-flex min-h-9 shrink-0 items-center gap-2 self-start rounded-full border border-ink/10 bg-paper px-3.5 text-xs font-bold transition hover:border-leaf/30 hover:text-leaf disabled:opacity-50"><Check className="h-3.5 w-3.5" />Mark read</button> : isPending ? <span className="inline-flex items-center gap-2 self-start rounded-full bg-saffron/20 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-[#795715]"><Clock3 className="h-3.5 w-3.5" />{notification.status.toLowerCase()}</span> : null}</div></div></div></article>;
      })}</div>}
    </div>
  );
}

function Empty({ title, copy }: { title: string; copy: string }) {
  return <div className="p-10 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-cream text-indigo"><Inbox className="h-6 w-6 animate-[float_4s_ease-in-out_infinite]" /></span><h2 className="mt-5 font-display text-2xl font-semibold">{title}</h2><p className="mt-2 text-sm text-ink/50">{copy}</p></div>;
}

function titleFromTemplate(templateKey: string) {
  return templateKey.replaceAll(".", " · ").replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
