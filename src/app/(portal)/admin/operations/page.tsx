import { CalendarDays, Clock3, MapPin, PawPrint, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminNoShowAction } from "@/components/portal/booking-recovery-actions";
import { PortalShell } from "@/components/portal/portal-shell";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export default async function AdminOperationsPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["OPERATIONS_ADMIN", "SUPER_ADMIN"])) redirect("/login?returnTo=/admin/operations");
  const bookings = await prisma.booking.findMany({
    where: { status: { in: ["CONFIRMED", "SITTER_EN_ROUTE", "IN_PROGRESS", "INCIDENT_HOLD"] } },
    orderBy: { scheduledStart: "asc" },
    take: 100,
    select: {
      id: true, reference: true, status: true, scheduledStart: true,
      pet: { select: { name: true, species: true } },
      serviceType: { select: { name: true } },
      address: { select: { locality: true, city: true } },
      assignments: { where: { status: { in: ["CUSTOMER_APPROVED", "ACTIVE"] } }, orderBy: { offeredAt: "desc" }, take: 1, select: { sitter: { select: { user: { select: { displayName: true } } } } } },
      incidents: { where: { status: { not: "CLOSED" } }, select: { id: true, reference: true, severity: true } }
    }
  });
  const now = new Date();
  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/50">operations recovery</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Live service monitor</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/60 mb-10">Monitor confirmed and active care, verify exceptions, and open controlled recovery. No-show actions preserve the original payment and service-area capacity while replacement matching runs.</p>
        <div className="mt-10 grid gap-5">{bookings.length ? bookings.map((booking) => <article key={booking.id} className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">{booking.reference} · {booking.status.replaceAll("_", " ")}</p><h2 className="mt-2 font-display text-3xl font-semibold">{booking.serviceType.name} for {booking.pet.name}</h2></div><span className="rounded-full bg-saffron/15 px-4 py-2 text-xs font-bold">{booking.assignments[0]?.sitter.user.displayName ?? "Assignment missing"}</span></div><div className="mt-5 grid gap-3 text-sm text-ink/60 sm:grid-cols-3"><p className="flex items-center gap-2"><PawPrint className="h-4 w-4 text-leaf" />{booking.pet.species.toLowerCase()}</p><p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-leaf" />{booking.scheduledStart.toLocaleDateString("en-IN", { dateStyle: "medium" })}</p><p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-leaf" />{booking.scheduledStart.toLocaleTimeString("en-IN", { timeStyle: "short" })}</p><p className="flex items-center gap-2 sm:col-span-3"><MapPin className="h-4 w-4 text-leaf" />{booking.address.locality}, {booking.address.city}</p></div>{booking.incidents.length > 0 ? <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-coral/10 p-4"><p className="flex items-center gap-2 text-sm font-semibold text-coral"><ShieldAlert className="h-4 w-4" />{booking.incidents.map(({ reference, severity }) => `${reference} (${severity})`).join(", ")}</p><Link href="/admin/safety" className={buttonVariants({ variant: "outline", size: "sm" })}>Open Safety queue</Link></div> : ["CONFIRMED", "SITTER_EN_ROUTE"].includes(booking.status) && (booking.scheduledStart <= now ? <AdminNoShowAction bookingId={booking.id} /> : <p className="mt-5 rounded-2xl bg-cream/60 p-4 text-sm font-semibold text-ink/55">No-show controls unlock at the scheduled service start. Continue routine monitoring until then.</p>)}</article>) : <div className="glass-panel rounded-5xl p-10 text-center"><Clock3 className="mx-auto h-10 w-10 text-leaf" /><h2 className="mt-5 font-display text-3xl font-semibold">No live service requires monitoring.</h2></div>}</div>
      </div>
    </PortalShell>
  );
}
