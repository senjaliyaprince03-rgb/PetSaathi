import type { Prisma } from "@prisma/client";
import { FileText, ShieldCheck } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { authorizedActorRole } from "@/modules/auth/authorization";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { PortalShell } from "@/components/portal/portal-shell";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default async function PetHealthRecordsPage({ params }: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  const idResult = z.string().uuid().safeParse((await params).id);
  if (!idResult.success) notFound();
  const id = idResult.data;

  if (!identity) {
    redirect(`/login?returnTo=${encodeURIComponent(`/pets/${id}/records`)}`);
  }

  const staffRoles = ["SAFETY_ADMIN", "SUPER_ADMIN"] as const;
  const isStaff = hasAnyRole(identity, staffRoles);
  const actorRole = authorizedActorRole(identity, staffRoles);
  const result = await prisma.$transaction(async (tx) => {
    const pet = await tx.pet.findFirst({
      where: {
        id,
        active: true,
        ...(isStaff ? {} : { ownerId: identity.id }),
      },
      select: { id: true, name: true, ownerId: true },
    });
    if (!pet) return null;

    const events = await tx.petHealthEvent.findMany({
      where: { petId: pet.id },
      orderBy: { occurredAt: "desc" },
    });

    if (isStaff && actorRole && pet.ownerId !== identity.id) {
      await tx.auditLog.create({
        data: {
          actorId: identity.id,
          actorRole,
          action: "pet.health_records_viewed",
          resourceType: "pet",
          resourceId: pet.id,
          after: { eventCount: events.length },
          reason: "Authorized trust-and-safety review",
        },
      });
    }

    return { pet, events };
  });
  if (!result) notFound();
  const { pet, events } = result;

  return (
    <PortalShell mode={isStaff ? "admin" : "customer"} displayName={identity.displayName} showSummaryCards={false}>
      <div className="mt-5 max-w-4xl">
        <Link href={`/pets/${pet.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
          <ArrowLeft className="h-4 w-4" />Back to passport
        </Link>
        <div className="mt-5">
          <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">
            {pet.name}&apos;s Health & Service Records
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink/60">
            A private timeline of structured health and service events.
          </p>
        </div>

      <div className="mt-8 flex items-start gap-4 rounded-3xl border border-saffron/20 bg-saffron/[0.08] p-5">
        <ShieldCheck className="h-6 w-6 shrink-0 text-coral" />
        <div>
          <h4 className="text-sm font-bold text-ink">Privacy & Data Ownership</h4>
          <p className="mt-2 text-sm leading-6 text-ink/75">
            These records are restricted to the pet owner and explicitly authorized
            trust-and-safety staff. Staff access is recorded in the audit trail.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4">
        {events.length === 0 ? (
          <div className="rounded-3xl border border-indigo/10 bg-paper p-10 text-center shadow-soft">
            <p className="text-sm font-semibold text-ink/60">No health records found for this pet.</p>
          </div>
        ) : (
          events.map(record => {
            const notes = notesFromDetails(record.details);
            return (
              <div key={record.id} className="flex gap-5 rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted">
                <div className="shrink-0 pt-1">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl
                    ${record.eventType === 'VACCINATION' ? 'bg-leaf/10 text-leaf' :
                      record.eventType === 'CONSULTATION' ? 'bg-indigo/10 text-indigo' :
                      'bg-coral/10 text-coral'}`}>
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-ink/40">{record.occurredAt.toISOString().split('T')[0]}</span>
                      <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">{record.summary}</h3>
                      <p className="mt-1 text-sm font-semibold text-ink/75">{record.source}</p>
                    </div>
                    {record.providerRef && (
                      <span className="shrink-0 rounded-full bg-cream px-3 py-1.5 text-xs font-bold text-ink/60">
                        Evidence reference recorded
                      </span>
                    )}
                  </div>
                  {notes && (
                    <div className="mt-5 rounded-2xl bg-cream/50 p-5">
                      <p className="text-sm leading-6 text-ink/75">{notes}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      </div>
    </PortalShell>
  );
}

function notesFromDetails(details: Prisma.JsonValue | null) {
  if (
    !details ||
    typeof details !== "object" ||
    Array.isArray(details)
  ) {
    return null;
  }
  const notes = details.notes;
  return typeof notes === "string" ? notes : null;
}
