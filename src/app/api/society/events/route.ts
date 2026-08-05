import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

const inputSchema = z.object({
  title: z.string().trim().min(3).max(100),
  description: z.string().trim().min(10).max(500),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  capacity: z.number().int().positive().optional(),
});

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SOCIETY_MANAGER", "SUPER_ADMIN"])) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Get manager's society
  const membership = await prisma.societyMember.findFirst({
    where: { userId: identity.id },
  });

  if (!membership) {
    return NextResponse.json({ error: "not_linked_to_society" }, { status: 403 });
  }

  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  }

  const { title, description, startsAt, endsAt, capacity } = parsed.data;

  const event = await prisma.societyEvent.create({
    data: {
      societyId: membership.societyId,
      title,
      description,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      capacity,
      status: "ACTIVE", // Auto-publish for pilot
    },
  });

  return NextResponse.json({ event });
}
