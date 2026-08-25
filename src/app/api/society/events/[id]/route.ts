import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

const patchSchema = z.object({
  title: z.string().trim().min(3).max(100).optional(),
  description: z.string().trim().min(10).max(500).optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  capacity: z.number().int().positive().nullable().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SOCIETY_MANAGER", "SUPER_ADMIN"])) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const membership = await prisma.societyMember.findFirst({ where: { userId: identity.id } });
  if (!membership) {
    return NextResponse.json({ error: "not_linked_to_society" }, { status: 403 });
  }

  const { id } = await context.params;
  const existing = await prisma.societyEvent.findUnique({ where: { id }, select: { id: true, societyId: true, startsAt: true, endsAt: true } });
  if (!existing || existing.societyId !== membership.societyId) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  }

  const startsAt = parsed.data.startsAt ? new Date(parsed.data.startsAt) : existing.startsAt;
  const endsAt = parsed.data.endsAt ? new Date(parsed.data.endsAt) : existing.endsAt;
  if (endsAt <= startsAt) {
    return NextResponse.json({ error: "ends_at_before_starts_at" }, { status: 422 });
  }

  const event = await prisma.societyEvent.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      startsAt,
      endsAt,
      capacity: parsed.data.capacity === undefined ? undefined : parsed.data.capacity
    }
  });

  return NextResponse.json({ event });
}
