import { CalendarDays, Clock3 } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function SaathiAvailabilityPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) redirect("/login?returnTo=/saathi/availability");
  const sitter = await prisma.sitterProfile.findUnique({ where: { userId: identity.id }, select: { availabilityRules: { orderBy: [{ weekday: "asc" }, { startTime: "asc" }] }, availabilityExceptions: { where: { endsAt: { gte: new Date() } }, orderBy: { startsAt: "asc" }, take: 12 } } });
  const rules = sitter?.availabilityRules ?? [];
  const exceptions = sitter?.availabilityExceptions ?? [];
  return <PortalShell mode="saathi" displayName={identity.displayName} metrics={[`${rules.filter((rule) => rule.active).length} active windows`, `${exceptions.length} upcoming exception${exceptions.length === 1 ? "" : "s"}`, "Asia/Kolkata"]}><div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]"><section className="rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted"><p className="eyebrow">Availability ledger</p><h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em]">Your regular week.</h2><div className="mt-6 grid gap-2">{days.map((day, weekday) => { const slots = rules.filter((rule) => rule.weekday === weekday && rule.active); return <div key={day} className="grid gap-2 rounded-2xl bg-cream/55 px-4 py-3 sm:grid-cols-[8rem_1fr] sm:items-center"><p className="text-sm font-bold">{day}</p><p className="text-sm text-ink/52">{slots.length ? slots.map((slot) => `${slot.startTime}–${slot.endTime}`).join(" · ") : "Unavailable"}</p></div>; })}</div></section><section className="rounded-4xl border border-indigo/10 bg-gradient-to-br from-[#f3eafa] to-paper p-6 shadow-lifted"><p className="eyebrow">Exceptions</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em]">Upcoming changes</h2><div className="mt-5 grid gap-3">{exceptions.length ? exceptions.map((item) => <article key={item.id} className="rounded-3xl bg-paper/85 p-4"><p className={`text-xs font-bold uppercase tracking-[0.12em] ${item.available ? "text-leaf" : "text-coral"}`}>{item.available ? "Available" : "Blocked"}</p><p className="mt-2 flex items-center gap-2 text-sm font-bold"><CalendarDays className="h-4 w-4 text-indigo" />{item.startsAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}</p><p className="mt-1 flex items-center gap-2 text-xs text-ink/48"><Clock3 className="h-3.5 w-3.5" />{item.startsAt.toLocaleTimeString("en-IN", { timeStyle: "short" })}–{item.endsAt.toLocaleTimeString("en-IN", { timeStyle: "short" })}</p>{item.reason && <p className="mt-2 text-xs leading-5 text-ink/45">{item.reason}</p>}</article>) : <p className="rounded-3xl border border-dashed border-indigo/15 p-7 text-center text-sm text-ink/48">No upcoming exceptions are recorded.</p>}</div><p className="mt-5 text-xs leading-5 text-ink/42">Availability editing remains controlled until the operations workflow is connected; this ledger never implies acceptance of a booking.</p></section></div></PortalShell>;
}
