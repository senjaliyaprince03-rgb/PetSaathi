import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/modules/auth/server";
import { configureCityService } from "@/modules/cities/service";
import { z } from "zod";
import { ServiceStatus } from "@prisma/client";

const serviceConfigSchema = z.object({
  serviceTypeId: z.string().uuid(),
  status: z.enum(["DISABLED", "WAITLIST", "MANUAL_BETA", "ACTIVE_LIMITED", "ACTIVE"]),
  bookingMode: z.string().optional(),
  minimumNoticeMinutes: z.number().int().min(0).optional(),
  maximumAdvanceDays: z.number().int().min(1).optional(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminId = await getAdminSession();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cityId = (await params).id;
    const body = await req.json();
    const data = serviceConfigSchema.parse(body);

    const config = await configureCityService({
      cityId,
      ...data,
    });

    return NextResponse.json(config, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 422 });
    }
    console.error("Configure service error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
