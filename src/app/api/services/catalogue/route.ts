import { NextResponse } from "next/server";

import { isDatabaseConfigured, prisma } from "@/lib/db";

export async function GET() {
  if (!isDatabaseConfigured()) return NextResponse.json([]);

  const catalogue = await prisma.serviceType.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      durationMinutes: true,
      basePricePaise: true,
      currency: true,
      variants: {
        where: { status: "ACTIVE" },
        select: { id: true, key: true, name: true, durationMinutes: true },
      },
      prices: {
        where: { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
        orderBy: { effectiveAt: "desc" },
        take: 1,
        select: { id: true, amountPaise: true, effectiveAt: true },
      },
    },
  });

  return NextResponse.json(catalogue);
}
