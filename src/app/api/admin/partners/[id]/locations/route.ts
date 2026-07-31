import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/modules/auth/server";
import { addPartnerLocation } from "@/modules/partners/service";
import { z } from "zod";

const createLocationSchema = z.object({
  name: z.string().min(1),
  cityId: z.string().uuid().optional(),
  address: z.any(),
  coordinates: z.any().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminId = await getAdminSession();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const data = createLocationSchema.parse(body);

    const location = await addPartnerLocation(id, data as any);

    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 422 });
    }
    console.error("Partner location creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
