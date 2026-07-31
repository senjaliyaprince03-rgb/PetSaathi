import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/modules/auth/server";
import { assignCityManager, CityConfigurationError } from "@/modules/cities/service";
import { z } from "zod";

const assignManagerSchema = z.object({
  userId: z.string().uuid(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminId = await getAdminSession();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cityId = (await params).id;
    const body = await req.json();
    const data = assignManagerSchema.parse(body);

    const manager = await assignCityManager(cityId, data.userId);

    return NextResponse.json(manager, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 422 });
    }
    if (error instanceof CityConfigurationError) {
      return NextResponse.json({ error: error.code, message: error.message }, { status: 409 });
    }
    console.error("Assign manager error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
