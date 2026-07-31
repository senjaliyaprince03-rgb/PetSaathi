import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/modules/auth/server";
import { createPlanVersion } from "@/modules/subscriptions/service";
import { prisma } from "@/lib/db";
import { z } from "zod";

const planVersionSchema = z.object({
  planKey: z.string().min(1),
  version: z.number().int().min(1),
  name: z.string().min(1),
  audience: z.string().min(1),
  pricePaise: z.number().int().min(0),
  billingInterval: z.string().min(1),
  totalBillingCycles: z.number().int().optional(),
  entitlements: z.record(z.number().int().min(0)),
});

export async function POST(req: NextRequest) {
  try {
    const adminId = await getAdminSession();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = planVersionSchema.parse(body);

    const planVersion = await createPlanVersion(data);

    return NextResponse.json(planVersion, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 422 });
    }
    console.error("Plan version creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const adminId = await getAdminSession();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const planVersions = await prisma.planVersion.findMany({
      orderBy: { planKey: "asc" },
    });

    return NextResponse.json(planVersions, { status: 200 });
  } catch (error) {
    console.error("Plan version listing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
