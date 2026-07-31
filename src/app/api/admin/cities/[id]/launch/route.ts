import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/modules/auth/server";
import { updateCityLaunchStage, CityConfigurationError } from "@/modules/cities/service";
import { z } from "zod";
import { CityLaunchStage } from "@prisma/client";

const launchSchema = z.object({
  targetStage: z.enum(["RESEARCH", "WAITLIST", "SUPPLY_BUILD", "CLOSED_BETA", "PUBLIC_LIMITED", "VALIDATED", "GROWTH", "MATURE", "PAUSED", "EXITED"]),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminId = await getAdminSession();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cityId = (await params).id;
    const body = await req.json();
    const data = launchSchema.parse(body);

    const updatedCity = await updateCityLaunchStage(cityId, data.targetStage);

    return NextResponse.json(updatedCity, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 422 });
    }
    if (error instanceof CityConfigurationError) {
      return NextResponse.json({ error: error.code, message: error.message }, { status: 422 }); // Unprocessable Entity
    }
    console.error("Launch gate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
