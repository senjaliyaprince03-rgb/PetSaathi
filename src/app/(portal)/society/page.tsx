import { Building2, CalendarDays, MapPin, Users } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export default async function SocietyDashboardPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SOCIETY_MANAGER")) redirect("/login?returnTo=/society");
  const membership = await prisma.societyMember.findFirst({
    where: { userId: identity.id },
    include: {
      society: {
        include: {
          _count: { select: { members: true, sitterPools: true, events: true } },
          events: { where: { endsAt: { gte: new Date() } }, orderBy: { startsAt: "asc" }, take: 6 }
        }
      }
    }
  });
  if (!membership) return <PortalShell mode="society" displayName={identity.displayName} metrics={["0 residents", "0 Saathis", "0 events"]}><section className="mt-5 rounded-4xl border border-dashed border-indigo/15 bg-paper p-10 text-center shadow-lifted"><Building2 className="mx-auto h-10 w-10 text-indigo/35" /><h2 className="mt-4 font-display text-3xl font-semibold">No society is linked yet.</h2><p className="mt-2 text-sm text-ink/48">An authorised operations team must verify the society relationship before community data becomes available.</p></section></PortalShell>;
  const { society } = membership;
  return <PortalShell mode="society" displayName={identity.displayName} metrics={[`${society._count.members} resident${society._count.members === 1 ? "" : "s"}`, `${society._count.sitterPools} Saathi pool entr${society._count.sitterPools === 1 ? "y" : "ies"}`, `${society._count.events} event${society._count.events === 1 ? "" : "s"}`]}><section className="mt-5 overflow-hidden rounded-5xl border border-indigo/10 bg-gradient-to-br from-[#f3eafa] to-[#fff0e8] p-7 shadow-soft sm:p-9"><p className="eyebrow">Society admin dashboard</p><h2 className="mt-3 font-display text-5xl font-semibold tracking-[-0.05em]">{society.name}</h2><p className="mt-3 flex items-center gap-2 text-sm text-ink/52"><MapPin className="h-4 w-4 text-coral" />{society.locality}, {society.city} · {society.status.replaceAll("_", " ")}</p><div className="mt-7 grid gap-3 sm:grid-cols-3"><Mini icon={Users} label="Verified residents" value={String(society._count.members)} /><Mini icon={Building2} label="Partnership" value={society.agreementAt ? "Recorded" : "Pending"} /><Mini icon={CalendarDays} label="Pilot window" value={society.pilotEndsAt ? `To ${society.pilotEndsAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}` : "Not scheduled"} /></div></section><section className="mt-5 rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted"><p className="eyebrow">Events & notices</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em]">What’s happening nearby.</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{society.events.length ? society.events.map((event) => <article key={event.id} className="rounded-3xl bg-cream/55 p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-coral">{event.status}</p><h3 className="mt-2 font-display text-2xl font-semibold">{event.title}</h3><p className="mt-2 text-sm leading-6 text-ink/50">{event.description}</p><p className="mt-4 flex items-center gap-2 text-xs font-bold text-indigo"><CalendarDays className="h-4 w-4" />{event.startsAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p></article>) : <p className="rounded-3xl border border-dashed border-indigo/15 p-8 text-center text-sm text-ink/48 md:col-span-2">No upcoming community events are recorded.</p>}</div></section></PortalShell>;
}

function Mini({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) { return <div className="rounded-3xl bg-paper/85 p-4"><Icon className="h-5 w-5 text-indigo" /><p className="mt-4 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-ink/38">{label}</p><p className="mt-1 font-display text-2xl font-semibold">{value}</p></div>; }
