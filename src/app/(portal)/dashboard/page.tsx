import Link from "next/link";
import type { Route } from "next";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

const quickActions: Array<{ label: string; href: Route }> = [
  { label: "Open pet passports", href: "/pets" },
  { label: "Request trusted care", href: "/book" },
  { label: "Open service wallet", href: "/customer/wallet" as Route },
  { label: "Review loyalty rewards", href: "/customer/loyalty" },
  { label: "Open protocol inbox", href: "/customer/inbox" as Route },
  { label: "Contact support", href: "/support" }
];

export default async function CustomerDashboardPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/dashboard");
  const [activeBookings, pets, reports, recentBookings] = await Promise.all([
    prisma.booking.count({ where: { customerId: identity.id, status: { notIn: ["CLOSED", "DECLINED", "CUSTOMER_CANCELLED", "NO_SHOW"] } } }),
    prisma.pet.count({ where: { ownerId: identity.id, active: true } }),
    prisma.bookingReport.count({ where: { booking: { customerId: identity.id } } }),
    prisma.booking.findMany({ where: { customerId: identity.id }, orderBy: { createdAt: "desc" }, take: 5, select: { id: true, reference: true, status: true, scheduledStart: true, pet: { select: { name: true } }, serviceType: { select: { name: true } } } })
  ]);
  return <PortalShell mode="customer" displayName={identity.displayName} metrics={[`${activeBookings} active booking${activeBookings === 1 ? "" : "s"}`, `${pets} pet passport${pets === 1 ? "" : "s"}`, `${reports} care stor${reports === 1 ? "y" : "ies"}`]}>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
      <section className="rounded-4xl border border-indigo/10 bg-paper/90 p-5 shadow-lifted sm:p-6">
        <div className="flex items-center justify-between gap-4"><div><p className="eyebrow">Care protocols</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em]">Recent care</h2></div><Link href="/book" className="text-sm font-bold text-coral hover:text-indigo">Plan care →</Link></div>
        <div className="mt-5 grid gap-2">{recentBookings.length > 0 ? recentBookings.map((booking) => <Link key={booking.id} href={`/bookings/${booking.id}`} className="flex flex-col justify-between gap-3 rounded-3xl border border-transparent bg-cream/60 p-4 transition hover:border-indigo/10 hover:bg-indigo/[0.04] sm:flex-row sm:items-center"><div><p className="font-bold">{booking.serviceType.name} · {booking.pet.name}</p><p className="mt-1 text-xs text-ink/45">{booking.reference} · {booking.scheduledStart.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p></div><span className="w-fit rounded-full bg-coral/10 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-coral">{booking.status.replaceAll("_", " ")}</span></Link>) : <div className="rounded-3xl border border-dashed border-indigo/15 p-8 text-center"><p className="font-display text-2xl font-semibold">Your next care story starts here.</p><p className="mt-2 text-sm text-ink/48">When a request is confirmed, its timeline will appear in this space.</p></div>}</div>
      </section>
      <section className="rounded-4xl border border-indigo/10 bg-gradient-to-br from-[#f3eafa] to-paper p-5 shadow-lifted sm:p-6"><p className="eyebrow">Quick actions</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em]">Everything close at paw.</h2><div className="mt-5 grid gap-2">{quickActions.map(({ label, href }) => <Link key={href} href={href} className="flex items-center justify-between rounded-2xl bg-paper/80 px-4 py-3 text-sm font-bold text-ink/62 transition hover:text-indigo"><span>{label}</span><span aria-hidden>↗</span></Link>)}</div></section>
    </div>
  </PortalShell>;
}
