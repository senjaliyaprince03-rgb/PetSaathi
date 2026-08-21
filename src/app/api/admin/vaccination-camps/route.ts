import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

const schema = z.object({
  societyId: z.string().uuid().optional(),
  name: z.string().min(3),
  date: z.coerce.date().min(new Date()),
  vetPartnerId: z.string().uuid(),
  capacity: z.number().int().min(1),
  location: z.string().min(3),
});

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["OPERATIONS_ADMIN", "SUPER_ADMIN"])) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });

  try {
    const societyId = parsed.data.societyId || (await prisma.society.findFirst())?.id;
    if (!societyId) {
      return NextResponse.json({ error: "society_required", message: "No society available." }, { status: 400 });
    }

    const event = await prisma.societyEvent.create({
      data: {
        societyId,
        title: parsed.data.name,
        description: `Vaccination Camp at ${parsed.data.location}`,
        startsAt: parsed.data.date,
        endsAt: new Date(parsed.data.date.getTime() + 4 * 60 * 60 * 1000), // +4 hours
        capacity: parsed.data.capacity,
        status: "ACTIVE",
        metadata: {
          eventType: "VACCINATION_CAMP",
          vetPartnerId: parsed.data.vetPartnerId,
          location: parsed.data.location,
        }
      }
    });
    
    return NextResponse.json({ event }, { status: 201 });
  } catch (err) {
    console.error("Failed to create SocietyEvent", err);
    return NextResponse.json({ error: "internal_error", message: "Failed to create camp" }, { status: 500 });
  }
}

export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["OPERATIONS_ADMIN", "SUPER_ADMIN"])) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    const camps = await prisma.societyEvent.findMany({
      where: { 
        title: { contains: "Vaccination", mode: "insensitive" }
      },
      orderBy: { startsAt: "desc" },
    });
    
    return NextResponse.json({ camps });
  } catch (err) {
    return NextResponse.json({ camps: [] });
  }
}
