import type { Prisma, PetHealthEvent } from "@prisma/client";
import { FileText, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PortalShell } from "@/components/portal/portal-shell";
import { buttonVariants } from "@/components/ui/button";
import { toISTDateString } from "@/lib/date-utils";
import type { AppIdentity } from "@/modules/auth/session";

interface PetHealthRecordsViewProps {
  pet: { id: string; name: string; ownerId: string };
  events: PetHealthEvent[];
  identity: AppIdentity;
  isStaff: boolean;
}

export function PetHealthRecordsView({ pet, events, identity, isStaff }: PetHealthRecordsViewProps) {
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
          <p className="mt-3 text-sm leading-6 text-ink/80">
            A private timeline of structured health and service events.
          </p>
        </div>

        <div className="mt-8 flex items-start gap-4 rounded-3xl border border-saffron/20 bg-saffron/[0.08] p-5">
          <ShieldCheck className="h-6 w-6 shrink-0 text-coral" />
          <div>
            <h4 className="text-sm font-bold text-ink">Privacy & Data Ownership</h4>
            <p className="mt-2 text-sm leading-6 text-ink/80">
              These records are restricted to the pet owner and explicitly authorized
              trust-and-safety staff. Staff access is recorded in the audit trail.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          {events.length === 0 ? (
            <div className="rounded-3xl border border-indigo/10 bg-paper p-10 text-center shadow-soft">
              <p className="text-sm font-semibold text-ink/80">No health records found for this pet.</p>
            </div>
          ) : (
            events.map((record) => {
              const notes = notesFromDetails(record.details);
              return (
                <div key={record.id} className="flex gap-5 rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted">
                  <div className="shrink-0 pt-1">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl
                      ${
                        record.eventType === "VACCINATION"
                          ? "bg-leaf/10 text-leaf"
                          : record.eventType === "CONSULTATION"
                            ? "bg-indigo/10 text-indigo"
                            : "bg-coral/10 text-coral"
                      }`}
                    >
                      <FileText className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-ink/80">
                          {toISTDateString(record.occurredAt)}
                        </span>
                        <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">{record.summary}</h3>
                        <p className="mt-1 text-sm font-semibold text-ink/80">{record.source}</p>
                      </div>
                      {record.providerRef && (
                        <span className="shrink-0 rounded-full bg-cream px-3 py-1.5 text-xs font-bold text-ink/80">
                          Evidence reference recorded
                        </span>
                      )}
                    </div>
                    {notes && (
                      <div className="mt-5 rounded-2xl bg-cream/50 p-5">
                        <p className="text-sm leading-6 text-ink/80">{notes}</p>
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
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return null;
  }
  const notes = (details as Record<string, unknown>).notes;
  return typeof notes === "string" ? notes : null;
}
