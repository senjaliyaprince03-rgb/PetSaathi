import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { createAddressSchema } from "@/modules/addresses/input";
import { getCurrentIdentity } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const addresses = await prisma.address.findMany({
    where: { userId: identity.id },
    orderBy: { createdAt: "asc" },
    select: { id: true, label: true, line1: true, line2: true, landmark: true, locality: true, city: true, state: true, postalCode: true }
  });
  return NextResponse.json({ addresses }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = createAddressSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });

  const address = await prisma.address.create({
    data: { ...parsed.data, userId: identity.id, countryCode: "IN" },
    select: { id: true, label: true, locality: true, city: true, postalCode: true }
  });
  return NextResponse.json({ address }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
}
