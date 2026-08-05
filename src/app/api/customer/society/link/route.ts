import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

const inputSchema = z.object({
  societyId: z.string().trim().uuid(),
  unitRef: z.string().trim().optional(),
});

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  }

  const { societyId, unitRef } = parsed.data;

  // Check if society exists
  const society = await prisma.society.findUnique({ where: { id: societyId } });
  if (!society) {
    return NextResponse.json({ error: "society_not_found" }, { status: 404 });
  }

  // Check if already linked
  const existing = await prisma.societyMember.findUnique({
    where: { societyId_userId: { societyId, userId: identity.id } },
  });

  if (existing) {
    return NextResponse.json({ error: "already_linked" }, { status: 409 });
  }

  // Link to society
  const member = await prisma.societyMember.create({
    data: {
      societyId,
      userId: identity.id,
      unitRef,
      status: "ACTIVE", // During pilot, auto-verify
      verifiedAt: new Date(),
    },
  });

  // Ensure they have the CUSTOMER role
  if (!identity.roles.includes("CUSTOMER")) {
    await prisma.userRole.create({
      data: { userId: identity.id, role: "CUSTOMER" }
    });
  }

  return NextResponse.json({ member });
}
