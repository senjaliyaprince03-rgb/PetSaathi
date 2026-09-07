import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/modules/auth/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await getAdminSession(); // Only admin can call this
  const { id } = await params;

  const { status, referenceNumber, notes } = await request.json();
  // status: "CLEAR" | "PENDING" | "REJECTED"

  await prisma.sitterVerification.updateMany({
    where: {
      sitterId: id,
      type: "POLICE_CHECK",
    },
    data: {
      status: status === "CLEAR" ? "PASSED" : status === "REJECTED" ? "FAILED" : "PENDING",
      checkedAt: status === "CLEAR" ? new Date() : null,
      evidencePath: referenceNumber,
      checkedBy: notes,
      provider: "MANUAL_ADMIN",
    },
  });

  return NextResponse.json({ success: true });
}