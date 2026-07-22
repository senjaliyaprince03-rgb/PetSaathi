import { CheckCircle2, Star } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ReviewAction } from "@/components/portal/customer-booking-actions";
import { PortalShell } from "@/components/portal/portal-shell";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export default async function SessionFeedbackPage({ params }: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity(); const { id } = await params;
  if (!identity?.roles.includes("CUSTOMER")) redirect(`/login?returnTo=/bookings/${id}/feedback`);
  const booking = await prisma.booking.findFirst({ where: { id, customerId: identity.id }, include: { pet: { select: { name: true } }, serviceType: { select: { name: true } }, review: true } });
  if (!booking) notFound();
  return <PortalShell mode="customer" displayName={identity.displayName} metrics={[booking.status.replaceAll("_", " "), booking.review ? `${booking.review.rating}/5 rating` : "Awaiting feedback", booking.review?.public ? "Publication consented" : "Private by default"]}><div className="mx-auto mt-5 max-w-3xl rounded-5xl border border-indigo/10 bg-gradient-to-br from-[#f3eafa] via-paper to-[#fff0e8] p-7 shadow-soft sm:p-10"><p className="eyebrow">Session feedback protocol</p><h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em]">How did care feel?</h1><p className="mt-4 text-sm leading-7 text-ink/52">Feedback for {booking.serviceType.name.toLowerCase()} with {booking.pet.name} remains private unless you separately consent to moderated publication.</p>{booking.review ? <div className="mt-8 rounded-4xl bg-paper/90 p-6 text-center shadow-lifted"><CheckCircle2 className="mx-auto h-9 w-9 text-leaf" /><div className="mt-4 flex justify-center gap-1 text-saffron">{Array.from({ length: booking.review.rating }).map((_, index) => <Star key={index} className="h-6 w-6 fill-current" />)}</div><h2 className="mt-4 font-display text-3xl font-semibold">Feedback recorded.</h2>{booking.review.body && <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink/50">{booking.review.body}</p>}<Link href={`/bookings/${booking.id}`} className={`${buttonVariants({ variant: "outline" })} mt-6`}>Return to booking</Link></div> : booking.status === "COMPLETED" ? <div className="mt-8"><ReviewAction bookingId={booking.id} /></div> : <div className="mt-8 rounded-4xl border border-dashed border-indigo/15 bg-paper/60 p-8 text-center"><Star className="mx-auto h-9 w-9 text-indigo/30" /><h2 className="mt-4 font-display text-3xl font-semibold">Feedback opens after care.</h2><p className="mt-2 text-sm text-ink/48">The booking must reach completed status before a review can be submitted.</p></div>}</div></PortalShell>;
}
