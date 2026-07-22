import { NextResponse } from "next/server";

import { getCurrentIdentity } from "@/modules/auth/session";
import { getPetTimeline } from "@/modules/health/timeline";
import { prisma } from "@/lib/db";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await context.params;

  // Verify ownership
  const pet = await prisma.pet.findUnique({ where: { id, ownerId: identity.id } });
  if (!pet) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const timeline = await getPetTimeline(id);

  return NextResponse.json({ timeline });
}
