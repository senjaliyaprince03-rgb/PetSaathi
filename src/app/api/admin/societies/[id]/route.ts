import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentIdentity();
    if (!user || (!user.roles.includes("SUPER_ADMIN") && !user.roles.includes("OPERATIONS_ADMIN") && !user.roles.includes("SOCIETY_MANAGER"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const society = await prisma.society.findUnique({
      where: { id },
      include: {
        members: true,
        sitterPools: {
          include: {
            sitter: {
              include: {
                user: {
                  select: {
                    id: true,
                    displayName: true,
                  }
                }
              }
            }
          }
        },
        partnerships: true
      }
    });

    if (!society) {
      return NextResponse.json({ error: "Society not found" }, { status: 404 });
    }

    return NextResponse.json(society);
  } catch (error) {
    console.error("[SOCIETY_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentIdentity();
    if (!user || (!user.roles.includes("SUPER_ADMIN") && !user.roles.includes("SOCIETY_MANAGER"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const updated = await prisma.society.update({
      where: { id },
      data: {
        status: data.status,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        pilotStartsAt: data.pilotStartsAt ? new Date(data.pilotStartsAt) : undefined,
        pilotEndsAt: data.pilotEndsAt ? new Date(data.pilotEndsAt) : undefined,
        agreementAt: data.agreementAt ? new Date(data.agreementAt) : undefined,
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[SOCIETY_PATCH_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
