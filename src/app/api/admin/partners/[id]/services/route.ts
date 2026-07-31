import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/modules/auth/server";
import { addPartnerService } from "@/modules/partners/service";
import { ServiceCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createServiceSchema = z.object({
  serviceCode: z.nativeEnum(ServiceCode),
  terms: z.any().optional(),
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
    const data = createServiceSchema.parse(body);

    const service = await addPartnerService(id, data);

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 422 });
    }
    console.error("Partner service creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminId = await getAdminSession();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    const services = await prisma.partnerService.findMany({
      where: { partnerId: id },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Partner service listing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
