import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch active sitters with their approved service permissions
    const sitters = await prisma.sitterProfile.findMany({
      where: {
        status: "APPROVED",
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
          }
        },
        permissions: {
          where: {
            status: "ACTIVE"
          },
          include: {
            serviceType: true
          }
        }
      }
    });

    return NextResponse.json(sitters, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}
