import { CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PaymentAction } from "@/components/portal/customer-booking-actions";
import { PortalShell } from "@/components/portal/portal-shell";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export default async function ProtocolCheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity(); const { id } = await params;
  if (!identity?.roles.includes("CUSTOMER")) redirect(`/login?returnTo=/bookings/${id}/checkout`);
  const booking = await prisma.booking.findFirst({ where: { id, customerId: identity.id }, include: { pet: { select: { name: true } }, serviceType: { select: { name: true } }, assignments: { where: { status: { in: ["CUSTOMER_APPROVED", "ACTIVE", "COMPLETED"] } }, take: 1, select: { sitter: { select: { user: { select: { displayName: true } } } } } }, payments: { orderBy: { createdAt: "desc" }, take: 1, select: { status: true } } } });
  if (!booking) notFound();
  return <PortalShell mode="customer" displayName={identity.displayName} metrics={[booking.status.replaceAll("_", " "), `₹${(booking.quoteAmountPaise / 100).toLocaleString("en-IN")}`, booking.payments[0]?.status ?? "No payment"]}><div className="mx-auto mt-5 grid max-w-5xl gap-5 lg:grid-cols-[1.1fr_0.9fr]"><section className="rounded-5xl border border-indigo/10 bg-paper p-7 shadow-soft sm:p-9"><p className="eyebrow">Protocol checkout</p><h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em]">Review before payment.</h1><div className="mt-8 grid gap-3">{[["Care service", booking.serviceType.name], ["Pet", booking.pet.name], ["Approved Saathi", booking.assignments[0]?.sitter.user.displayName ?? "Not approved"], ["Booking reference", booking.reference]].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 rounded-2xl bg-cream/55 px-4 py-3"><p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/40">{label}</p><p className="text-sm font-bold text-right">{value}</p></div>)}</div><div className="mt-7 flex items-start gap-3 rounded-3xl border border-leaf/15 bg-leaf/[0.06] p-5"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-leaf" /><p className="text-sm leading-6 text-ink/55">The amount is taken from the immutable server quote. Provider success does not confirm care until the signed response is verified.</p></div></section><aside>{booking.status === "PAYMENT_PENDING" ? <PaymentAction bookingId={booking.id} reference={booking.reference} amountPaise={booking.quoteAmountPaise} /> : <div className="rounded-5xl border border-indigo/10 bg-gradient-to-br from-[#f3eafa] to-paper p-7 text-center shadow-lifted"><CreditCard className="mx-auto h-9 w-9 text-indigo/40" /><h2 className="mt-5 font-display text-3xl font-semibold">Checkout is not open.</h2><p className="mt-3 text-sm leading-6 text-ink/50">Payment becomes available only after a proposed Saathi is approved. Current state: {booking.status.replaceAll("_", " ").toLowerCase()}.</p><Link href={`/bookings/${booking.id}`} className={`${buttonVariants({ variant: "outline" })} mt-6`}>Return to booking</Link></div>}</aside></div></PortalShell>;
}
