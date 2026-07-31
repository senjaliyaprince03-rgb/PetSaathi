import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { getCurrentIdentity } from "@/modules/auth/session";
import { updatePartner } from "@/modules/partners/service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentIdentity();
    if (!user || (!user.roles.includes("SUPER_ADMIN") && !user.roles.includes("PARTNER_MANAGER"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const partner = await prisma.partner.findUnique({
      where: { id },
      include: {
        locations: true,
        verifications: true,
        services: true
      }
    });

    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    return NextResponse.json(partner);
  } catch (error) {
    logger.exception("partner.read_failed", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentIdentity();
    if (!user || (!user.roles.includes("SUPER_ADMIN") && !user.roles.includes("PARTNER_MANAGER"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const updated = await updatePartner(id, data);

    return NextResponse.json(updated);
  } catch (error) {
    logger.exception("partner.update_failed", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
