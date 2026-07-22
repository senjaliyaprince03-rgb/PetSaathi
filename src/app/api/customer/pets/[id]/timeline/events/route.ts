import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentIdentity } from "@/modules/auth/session";
import { addTimelineEvent } from "@/modules/health/timeline";
import { prisma } from "@/lib/db";
import { HealthEventType } from "@prisma/client";

const eventSchema = z.object({
  type: z.nativeEnum(HealthEventType),
  title: z.string().min(1),
  description: z.string().optional(),
  eventDate: z.string().datetime(),
  documentUrl: z.string().url().optional(),
  metadata: z.any().optional(),
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await context.params;

  // Verify ownership
  const pet = await prisma.pet.findUnique({ where: { id, ownerId: identity.id } });
  if (!pet) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const parsed = eventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });

  const data = parsed.data;

  const event = await addTimelineEvent({
    petId: id,
    type: data.type,
    title: data.title,
    description: data.description,
    eventDate: new Date(data.eventDate),
    documentUrl: data.documentUrl,
    metadata: data.metadata,
  });

  return NextResponse.json(event, { status: 201 });
}
