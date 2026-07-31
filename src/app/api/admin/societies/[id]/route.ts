import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
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
        accessRule: true,
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
    logger.exception("society.read_failed", error);
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

    const { accessRule, ...societyData } = data;

    const updated = await prisma.$transaction(async (tx) => {
      const society = await tx.society.update({
        where: { id },
        data: {
          status: societyData.status,
          contactName: societyData.contactName,
          contactPhone: societyData.contactPhone,
          partnershipModel: societyData.partnershipModel,
          facilityContact: societyData.facilityContact,
          securityContact: societyData.securityContact,
          emergencyContact: societyData.emergencyContact,
          bookingCap: societyData.bookingCap,
          address: societyData.address,
          geofence: societyData.geofence,
          pilotStartsAt: societyData.pilotStartsAt ? new Date(societyData.pilotStartsAt) : undefined,
          pilotEndsAt: societyData.pilotEndsAt ? new Date(societyData.pilotEndsAt) : undefined,
          agreementAt: societyData.agreementAt ? new Date(societyData.agreementAt) : undefined,
        },
        include: {
          accessRule: true,
        }
      });

      if (accessRule) {
        await tx.societyAccessRule.upsert({
          where: { societyId: id },
          update: { ...accessRule, lastVerifiedAt: new Date() },
          create: { societyId: id, ...accessRule },
        });
        society.accessRule = await tx.societyAccessRule.findUnique({ where: { societyId: id } });
      }
      return society;
    });

    return NextResponse.json(updated);
  } catch (error) {
    logger.exception("society.update_failed", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
