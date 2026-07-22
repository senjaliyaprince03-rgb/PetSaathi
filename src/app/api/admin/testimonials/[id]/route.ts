import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body as { action: "APPROVED" | "REJECTED" };

    if (!action || !["APPROVED", "REJECTED"].includes(action)) {
      return NextResponse.json({ error: "VALIDATION_ERROR", message: "action must be APPROVED or REJECTED" }, { status: 422 });
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: action === "APPROVED"
        ? { status: "APPROVED", publishedAt: new Date() }
        : { status: "ARCHIVED" },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Testimonial update error:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
