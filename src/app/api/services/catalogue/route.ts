import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const services = await prisma.serviceType.findMany({
      where: { active: true },
      include: {
        variants: {
          where: { status: "ACTIVE" },
        },
        prices: {
          orderBy: { version: "desc" },
          take: 10,
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error("[CATALOGUE_GET_ERROR]", error);
    return NextResponse.json({ error: "failed_to_fetch_catalogue" }, { status: 500 });
  }
}
