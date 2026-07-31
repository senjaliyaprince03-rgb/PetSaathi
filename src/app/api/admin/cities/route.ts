import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/modules/auth/server";
import { createCity } from "@/modules/cities/service";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createCitySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  state: z.string().min(1),
  timezone: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const adminId = await getAdminSession();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createCitySchema.parse(body);

    const city = await createCity(data);

    return NextResponse.json(city, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 422 });
    }
    console.error("City creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const adminId = await getAdminSession();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cities = await prisma.city.findMany({
      orderBy: { name: "asc" },
      include: {
        cityServiceConfigs: true
      }
    });

    return NextResponse.json(cities, { status: 200 });
  } catch (error) {
    console.error("City listing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
