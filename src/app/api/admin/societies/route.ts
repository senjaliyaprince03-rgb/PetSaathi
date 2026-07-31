import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/modules/auth/server";
import { registerSociety } from "@/modules/societies/service";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createSocietySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  city: z.string().min(1),
  locality: z.string().min(1),
  address: z.string().optional(),
  partnershipModel: z.string().optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  facilityContact: z.string().optional(),
  securityContact: z.string().optional(),
  emergencyContact: z.string().optional(),
  bookingCap: z.number().int().nonnegative().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const adminId = await getAdminSession();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createSocietySchema.parse(body);

    const society = await registerSociety(data);

    return NextResponse.json(society, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 422 });
    }
    console.error("Society creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const adminId = await getAdminSession();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const status = searchParams.get("status");

    const where: any = {};
    if (city) where.city = city;
    if (status) where.status = status;

    const societies = await prisma.society.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(societies, { status: 200 });
  } catch (error) {
    console.error("Society listing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
