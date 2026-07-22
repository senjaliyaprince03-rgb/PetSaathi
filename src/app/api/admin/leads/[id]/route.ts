import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body as { status: string };

    if (!status) {
      return NextResponse.json({ error: "VALIDATION_ERROR", message: "status is required" }, { status: 422 });
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: { status: status as "NEW" | "CONTACTED" | "QUALIFIED" | "PILOT_PROPOSED" | "CONVERTED" | "DISQUALIFIED" },
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Lead update error:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
