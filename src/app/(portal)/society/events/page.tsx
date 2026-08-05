import { CalendarPlus, Megaphone } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export default async function SocietyEventsPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SOCIETY_MANAGER", "SUPER_ADMIN"])) {
    redirect("/login?returnTo=/society/events");
  }

  // Find which society this user manages
  const membership = await prisma.societyMember.findFirst({
    where: { userId: identity.id },
    include: { society: true },
  });

  if (!membership) {
    return (
      <PortalShell mode="society" displayName={identity.displayName}>
        <div className="max-w-7xl pb-12">
          <h1 className="font-display text-4xl font-semibold">Community Events</h1>
          <p className="mt-5 rounded-2xl bg-coral/10 p-4 text-coral font-semibold">You are not linked to a society as a manager.</p>
        </div>
      </PortalShell>
    );
  }

  const events = await prisma.societyEvent.findMany({
    where: { societyId: membership.societyId },
    orderBy: { startsAt: "desc" },
  });

  return (
    <PortalShell mode="society" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12">
        <div className="flex flex-wrap items-center justify-between gap-5 border-b border-ink/10 pb-8">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/50">acquistion & engagement</p>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Community Events</h1>
          </div>
          <button className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-indigo px-6 font-bold text-white transition hover:bg-indigo/90">
            <CalendarPlus className="h-5 w-5" />
            Plan New Event
          </button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.length > 0 ? (
            events.map((event) => (
              <article key={event.id} className="flex flex-col justify-between rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${event.status === "ACTIVE" ? "bg-leaf/15 text-leaf" : "bg-ink/10 text-ink/70"}`}>
                      {event.status}
                    </span>
                    <span className="text-sm font-semibold text-ink/60">
                      {event.startsAt.toLocaleDateString("en-IN", { dateStyle: "short" })}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-semibold">{event.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/70">{event.description}</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4">
                  <p className="text-xs font-semibold text-ink/50">Capacity: {event.capacity ?? "Unlimited"}</p>
                  <button className="text-sm font-bold text-indigo hover:underline">Edit</button>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full glass-panel rounded-5xl p-10 text-center">
              <Megaphone className="mx-auto h-12 w-12 text-saffron" />
              <h2 className="mt-5 font-display text-3xl font-semibold">No community events planned yet.</h2>
              <p className="mt-2 text-ink/60 max-w-lg mx-auto">
                Host a free pet care consultation, vaccination camp, or training workshop in your society to encourage residents to join the PetSaathi platform.
              </p>
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
