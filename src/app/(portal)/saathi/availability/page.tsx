import { CalendarDays, Clock3, Edit3 } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function SaathiAvailabilityPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) redirect("/login?returnTo=/saathi/availability");
  
  const sitter = await prisma.sitterProfile.findUnique({
    where: { userId: identity.id },
    select: {
      availabilityRules: { orderBy: [{ weekday: "asc" }, { startTime: "asc" }] },
      availabilityExceptions: { where: { endsAt: { gte: new Date() } }, orderBy: { startsAt: "asc" }, take: 12 }
    }
  });

  const rules = sitter?.availabilityRules ?? [];
  const exceptions = sitter?.availabilityExceptions ?? [];

  return (
    <PortalShell mode="saathi" displayName={identity.displayName}>
      <div className="max-w-6xl pb-16">
        {/* Header */}
        <section className="mt-4 rounded-[2rem] border border-black/[0.06] bg-gradient-to-r from-paper via-cream to-[#fbf2ea] p-6 shadow-sm sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-indigo animate-pulse" />
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-indigo">Availability Ledger</p>
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Working Hours &amp; Schedule
            </h1>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-ink/70 leading-relaxed">
              Define your recurring operating windows, blackout hours, and holiday schedules across your active locality.
            </p>
          </div>
          <Link
            href={"/saathi/availability/edit" as any}
            className="inline-flex items-center gap-2 rounded-xl bg-coral px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-coral-hover shrink-0"
          >
            <Edit3 className="h-4 w-4" />
            Edit Weekly Schedule
          </Link>
        </section>

        {/* Schedule Grid */}
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-black/[0.06] bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-ink">Recurring Weekly Windows</h2>
            <p className="mt-1 text-xs text-ink/60">Standard hours during which booking requests can be dispatched to you.</p>

            <div className="mt-6 space-y-2.5">
              {days.map((day, weekday) => {
                const slots = rules.filter((rule) => rule.weekday === weekday && rule.active);
                return (
                  <div key={day} className="flex items-center justify-between rounded-xl bg-[#FAF6F1] px-5 py-3.5 border border-black/[0.04]">
                    <span className="text-sm font-bold text-ink">{day}</span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${slots.length ? "bg-leaf/10 text-leaf" : "bg-black/[0.04] text-ink/50"}`}>
                      {slots.length ? slots.map((slot) => `${slot.startTime} – ${slot.endTime}`).join(" · ") : "Unavailable / Off"}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[2rem] border border-black/[0.06] bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-ink">Upcoming Exceptions</h2>
            <p className="mt-1 text-xs text-ink/60">Planned leaves, holidays, or emergency blocked periods.</p>

            <div className="mt-6 space-y-3">
              {exceptions.length ? (
                exceptions.map((item) => (
                  <article key={item.id} className="rounded-xl border border-black/[0.06] bg-[#FAF6F1] p-4">
                    <span className={`text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.available ? "bg-leaf/10 text-leaf" : "bg-coral/10 text-coral"}`}>
                      {item.available ? "Available Override" : "Blocked / On Leave"}
                    </span>
                    <p className="mt-2 flex items-center gap-2 text-sm font-bold text-ink">
                      <CalendarDays className="h-4 w-4 text-indigo" />
                      {item.startsAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-ink/70">
                      <Clock3 className="h-3.5 w-3.5" />
                      {item.startsAt.toLocaleTimeString("en-IN", { timeStyle: "short" })} – {item.endsAt.toLocaleTimeString("en-IN", { timeStyle: "short" })}
                    </p>
                    {item.reason && <p className="mt-2 text-xs text-ink/70">{item.reason}</p>}
                  </article>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-black/[0.12] p-8 text-center">
                  <p className="text-xs text-ink/60 font-medium">No upcoming exceptions recorded.</p>
                  <p className="mt-1 text-[0.7rem] text-ink/40">You are operating according to your regular weekly windows.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </PortalShell>
  );
}
