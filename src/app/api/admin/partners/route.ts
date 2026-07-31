import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/modules/auth/server";
import { registerPartner } from "@/modules/partners/service";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createPartnerSchema = z.object({
  slug: z.string().min(1),
  legalName: z.string().min(1),
  displayName: z.string().min(1),
  category: z.string().min(1),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  metadata: z.any().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const adminId = await getAdminSession();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createPartnerSchema.parse(body);

    const partner = await registerPartner(data);

    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 422 });
    }
    console.error("Partner creation error:", error);
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
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;

    const partners = await prisma.partner.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(partners, { status: 200 });
  } catch (error) {
    console.error("Partner listing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
