import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

const ADMIN_ROLES = ["OPERATIONS_ADMIN", "SUPER_ADMIN", "PARTNER_MANAGER", "SOCIETY_MANAGER"] as const;

export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ADMIN_ROLES)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const events = await prisma.societyEvent.findMany({
    orderBy: { startsAt: "desc" },
    select: {
      id: true,
      societyId: true,
      title: true,
      description: true,
      startsAt: true,
      endsAt: true,
      capacity: true,
      status: true,
      metadata: true,
      society: { select: { name: true } },
    },
  });

  // Filter vaccination events in memory
  const camps = events.filter((e) => {
    const meta = (e.metadata || {}) as Record<string, unknown>;
    return meta.category === "VACCINATION" || e.title.toLowerCase().includes("vaccin");
  });

  return NextResponse.json(camps);
}

const createSchema = z.object({
  societyId: z.string().min(1),
  title: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  location: z.string().min(2),
  vetPartnerId: z.string().optional(),
  capacity: z.number().int().positive().default(50),
});

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ADMIN_ROLES)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });

  const { societyId, title, description, startsAt, endsAt, location, vetPartnerId, capacity } = parsed.data;

  const event = await prisma.societyEvent.create({
    data: {
      societyId,
      title,
      description: description || "Rabies & Annual Pet Vaccination Camp",
      status: "ACTIVE",
      startsAt,
      endsAt,
      capacity,
      metadata: { category: "VACCINATION", location, vetPartnerId, registeredCount: 0 },
    },
  });

  return NextResponse.json({ camp: event }, { status: 201 });
}
