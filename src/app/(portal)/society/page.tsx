import { Building2, CalendarDays, MapPin, Users } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export default async function SocietyDashboardPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SOCIETY_MANAGER", "SUPER_ADMIN"])) redirect("/login?returnTo=/society");
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
  if (!membership) return <PortalShell mode="society" displayName={identity.displayName} metrics={["0 residents", "0 Saathis", "0 events"]}><section className="mt-5 rounded-4xl border border-dashed border-indigo/15 bg-paper p-10 text-center shadow-lifted"><Building2 className="mx-auto h-10 w-10 text-indigo/80" /><h2 className="mt-4 font-display text-3xl font-semibold">No society is linked yet.</h2><p className="mt-2 text-sm text-ink/80">An authorised operations team must verify the society relationship before community data becomes available.</p></section></PortalShell>;
  const { society } = membership;
  return <PortalShell mode="society" displayName={identity.displayName} metrics={[`${society._count.members} resident${society._count.members === 1 ? "" : "s"}`, `${society._count.sitterPools} Saathi pool entr${society._count.sitterPools === 1 ? "y" : "ies"}`, `${society._count.events} event${society._count.events === 1 ? "" : "s"}`]}>
    <div className="space-y-6">
      <section className="mt-5 overflow-hidden rounded-5xl border border-indigo/10 bg-gradient-to-br from-[#f3eafa] to-[#fff0e8] p-7 shadow-soft sm:p-9"><p className="eyebrow">Society admin dashboard</p><h2 className="mt-3 font-display text-3xl sm:text-5xl font-semibold tracking-[-0.05em]">{society.name}</h2><p className="mt-3 flex items-center gap-2 text-sm text-ink/80"><MapPin className="h-4 w-4 text-coral" />{society.locality}, {society.city} · {society.status.replaceAll("_", " ")}</p><div className="mt-7 grid gap-3 sm:grid-cols-3"><Mini icon={Users} label="Verified residents" value={String(society._count.members)} /><Mini icon={Building2} label="Partnership" value={society.agreementAt ? "Recorded" : "Pending"} /><Mini icon={CalendarDays} label="Pilot window" value={society.pilotEndsAt ? `To ${society.pilotEndsAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}` : "Not scheduled"} /></div></section>
      
      {/* Gate Security Protocols & QR Code Scanner */}
      <section className="rounded-4xl border border-ink/10 bg-white p-6 shadow-lifted">
        <div className="flex items-center justify-between border-b border-ink/5 pb-4 mb-4">
          <div>
            <p className="eyebrow">Gate Security Protocols</p>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em] text-ink">MyGate / Security Desk Verification</h2>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">System Active</span>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 bg-surface rounded-3xl border border-ink/5 flex flex-col items-center justify-center text-center">
            <div className="w-40 h-40 bg-white border-2 border-indigo/20 p-2 rounded-2xl shadow-sm mb-4">
              {/* Simulated QR Code rendering */}
              <div className="w-full h-full border-4 border-ink p-1 relative flex items-center justify-center">
                 <div className="absolute top-0 left-0 w-3 h-3 border-t-4 border-l-4 border-coral" />
                 <div className="absolute top-0 right-0 w-3 h-3 border-t-4 border-r-4 border-coral" />
                 <div className="absolute bottom-0 left-0 w-3 h-3 border-b-4 border-l-4 border-coral" />
                 <div className="absolute bottom-0 right-0 w-3 h-3 border-b-4 border-r-4 border-coral" />
                 <div className="grid grid-cols-4 grid-rows-4 gap-1 w-2/3 h-2/3 bg-ink/5 mix-blend-multiply opacity-50" />
                 <span className="font-bold font-display text-lg text-ink absolute">SCAN</span>
              </div>
            </div>
            <h3 className="font-bold text-sm text-ink mb-1">Scan Caregiver ID Pass</h3>
            <p className="text-xs text-ink/70">Security guards can scan a Saathi&apos;s digital ID here to verify their assignment to a resident&apos;s flat.</p>
            <button className="mt-4 px-4 py-2 bg-indigo text-white text-xs font-bold rounded-lg shadow-sm">Launch Scanner</button>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-ink mb-2">Whitelisted Society Pool</h3>
            {[
              { name: "Rajesh K.", status: "Inside Premises", flat: "A-402", time: "Arrived 10:15 AM" },
              { name: "Anjali S.", status: "Pre-approved", flat: "B-105", time: "Scheduled 04:30 PM" },
              { name: "Vikram M.", status: "Completed", flat: "C-901", time: "Left 09:00 AM" }
            ].map((s, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 border border-ink/5 rounded-2xl bg-white hover:border-indigo/20 transition-colors">
                <div>
                  <p className="text-xs font-bold text-ink">{s.name}</p>
                  <p className="text-[10px] text-ink/60 mt-0.5">Flat {s.flat} • {s.time}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${s.status === 'Inside Premises' ? 'bg-indigo/10 text-indigo' : s.status === 'Pre-approved' ? 'bg-amber-50 text-amber-700' : 'bg-surface text-ink/50'}`}>
                  {s.status}
                </span>
              </div>
            ))}
            <button className="w-full mt-2 py-2 border border-dashed border-ink/20 text-xs font-bold text-indigo rounded-xl hover:bg-indigo/5">View Full Registry</button>
          </div>
        </div>
      </section>

      <section className="rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted"><p className="eyebrow">Events & notices</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em]">What’s happening nearby.</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{society.events.length ? society.events.map((event) => <article key={event.id} className="rounded-3xl bg-cream/55 p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-coral">{event.status}</p><h3 className="mt-2 font-display text-2xl font-semibold">{event.title}</h3><p className="mt-2 text-sm leading-6 text-ink/80">{event.description}</p><p className="mt-4 flex items-center gap-2 text-xs font-bold text-indigo"><CalendarDays className="h-4 w-4" />{event.startsAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p></article>) : <p className="rounded-3xl border border-dashed border-indigo/15 p-8 text-center text-sm text-ink/80 md:col-span-2">No upcoming community events are recorded.</p>}</div></section>
    </div>
  </PortalShell>;
}

function Mini({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) { return <div className="rounded-3xl bg-paper/85 p-4"><Icon className="h-5 w-5 text-indigo" /><p className="mt-4 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-ink/80">{label}</p><p className="mt-1 font-display text-2xl font-semibold">{value}</p></div>; }
