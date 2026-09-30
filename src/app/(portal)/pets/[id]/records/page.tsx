import { createElement } from "react";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { authorizedActorRole } from "@/modules/auth/authorization";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { PetHealthRecordsView } from "./records-view";

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
        deletedAt: null,
        ...(isStaff ? {} : { ownerId: identity.id }),
      },
      select: { id: true, name: true, ownerId: true },
    });
    if (!pet) return null;

    const events = await tx.petHealthEvent.findMany({
      where: { petId: pet.id },
      orderBy: { occurredAt: "desc" },
      take: 50,
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

  return createElement(PetHealthRecordsView, {
    pet,
    events,
    identity,
    isStaff,
  });
}
