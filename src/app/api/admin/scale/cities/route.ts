import { NextResponse } from "next/server";
import { assignCityManager, recordCityHealthScore, ScaleError } from "@/modules/scale/city-ops.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, cityId, userId, periodDate, overallScore, safetyScore, supplyScore, demandScore, operationsScore } = body;

    if (action === "ASSIGN_MANAGER") {
      const manager = await assignCityManager(cityId, userId);
      return NextResponse.json(manager);
    }

    if (action === "RECORD_HEALTH") {
      const health = await recordCityHealthScore(
        cityId,
        new Date(periodDate),
        overallScore,
        safetyScore,
        supplyScore,
        demandScore,
        operationsScore
      );
      return NextResponse.json(health);
    }

    return NextResponse.json({ error: "invalid_action", message: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    if (error instanceof ScaleError) {
      return NextResponse.json({ error: error.code, message: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "internal_error", message: error.message }, { status: 500 });
  }
}
