import { LocateFixed, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { TrackingViewer } from "@/components/portal/tracking-viewer";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { isFeatureEnabled } from "@/modules/features/server";

export default async function LiveTelemetryPage({ params }: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity(); const { id } = await params;
  if (!identity?.roles.includes("CUSTOMER")) redirect(`/login?returnTo=/bookings/${id}/live`);
  const [booking, enabled] = await Promise.all([prisma.booking.findFirst({ where: { id, customerId: identity.id }, include: { pet: { select: { name: true } }, serviceType: { select: { name: true } }, trackingSessions: { orderBy: { startedAt: "desc" }, take: 1, select: { status: true, startedAt: true, expiresAt: true } } } }), isFeatureEnabled("live_walk_tracking")]);
  if (!booking) notFound(); const eligible = enabled && ["SITTER_EN_ROUTE", "IN_PROGRESS"].includes(booking.status);
  return <PortalShell mode="customer" displayName={identity.displayName} metrics={[enabled ? "Feature enabled" : "Feature disabled", booking.status.replaceAll("_", " "), booking.trackingSessions[0]?.status ?? "No session"]}><div className="mx-auto mt-5 max-w-4xl rounded-5xl border border-indigo/10 bg-gradient-to-br from-[#f3eafa] to-paper p-7 shadow-soft sm:p-10"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="eyebrow">Live telemetry feed</p><h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em]">{booking.pet.name} · {booking.serviceType.name}</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-ink/52">Location is fetched only on request during an eligible, consented service window. PetSaathi does not present continuous tracking outside that boundary.</p></div><Link href={`/bookings/${booking.id}`} className={buttonVariants({ variant: "outline" })}>Booking overview</Link></div>{eligible ? <TrackingViewer bookingId={booking.id} /> : <div className="mt-8 rounded-4xl border border-dashed border-indigo/15 bg-paper/70 p-10 text-center"><LocateFixed className="mx-auto h-10 w-10 text-indigo/30" /><h2 className="mt-4 font-display text-3xl font-semibold">Telemetry is not available now.</h2><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-ink/48">{enabled ? "This booking is outside the en-route or in-progress service states." : "Live walk tracking remains disabled by the server-side release gate."}</p><p className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-leaf"><ShieldCheck className="h-4 w-4" />Fail-closed by design</p></div>}</div></PortalShell>;
}
