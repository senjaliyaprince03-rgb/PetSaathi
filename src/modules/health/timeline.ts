import { prisma } from "@/lib/db";
import type { HealthEventType, Prisma } from "@prisma/client";

export interface TimelineEvent {
  id: string;
  type: HealthEventType;
  title: string;
  description: string | null;
  date: Date;
  documentUrl: string | null;
  metadata: unknown;
  source: "MANUAL" | "SYSTEM";
}

export async function getPetTimeline(petId: string): Promise<TimelineEvent[]> {
  // 1. Fetch manual timeline events
  const manualEvents = await prisma.healthTimelineEvent.findMany({
    where: { petId },
    orderBy: { eventDate: "desc" },
  });

  // 2. Fetch service completions (automated timeline events)
  const services = await prisma.booking.findMany({
    where: { petId, status: "COMPLETED" },
    orderBy: { scheduledEnd: "desc" },
    select: { id: true, reference: true, scheduledEnd: true, serviceType: { select: { name: true } } },
  });

  const timeline: TimelineEvent[] = [
    ...manualEvents.map((e) => ({
      id: e.id,
      type: e.type,
      title: e.title,
      description: e.description,
      date: e.eventDate,
      documentUrl: e.documentUrl,
      metadata: e.metadata as Prisma.JsonValue,
      source: "MANUAL" as const,
    })),
    ...services.map((s) => ({
      id: `svc_${s.id}`,
      type: "SERVICE_COMPLETED" as HealthEventType,
      title: `Completed ${s.serviceType.name}`,
      description: `Service reference: ${s.reference}`,
      date: s.scheduledEnd,
      documentUrl: null,
      metadata: { bookingId: s.id },
      source: "SYSTEM" as const,
    })),
  ];

  // Sort unified timeline by date descending
  return timeline.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function addTimelineEvent(params: {
  petId: string;
  type: HealthEventType;
  title: string;
  description?: string;
  eventDate: Date;
  documentUrl?: string;
  metadata?: unknown;
}) {
  return prisma.healthTimelineEvent.create({
    data: {
      petId: params.petId,
      type: params.type,
      title: params.title,
      description: params.description,
      eventDate: params.eventDate,
      documentUrl: params.documentUrl,
      metadata: params.metadata ? JSON.parse(JSON.stringify(params.metadata)) : undefined,
    },
  });
}
