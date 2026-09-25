import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { getCurrentIdentity } from "@/modules/auth/session";
import { resolveTerritoryScope } from "@/modules/rbac/territory-scope";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentIdentity();
    if (!user) {
      return NextResponse.json({ error: "unauthorized", message: "Authentication required" }, { status: 401 });
    }
    const hasRole = user.roles.some((r) => ["SUPER_ADMIN", "OPERATIONS_ADMIN", "SOCIETY_MANAGER"].includes(r));
    if (!hasRole) {
      return NextResponse.json({ error: "forbidden", message: "Society management privileges required" }, { status: 403 });
    }

    const { id } = await params;

    // Multi-tenant territory check for SOCIETY_MANAGER
    if (user.roles.includes("SOCIETY_MANAGER") && !user.roles.includes("SUPER_ADMIN") && !user.roles.includes("OPERATIONS_ADMIN")) {
      const scope = await resolveTerritoryScope(user.id, user.roles);
      if (!scope.unrestricted && !scope.societyIds.includes(id)) {
        return NextResponse.json({ error: "forbidden", message: "Access to this society is restricted" }, { status: 403 });
      }
    }

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
    if (!user) {
      return NextResponse.json({ error: "unauthorized", message: "Authentication required" }, { status: 401 });
    }
    const hasRole = user.roles.some((r) => ["SUPER_ADMIN", "OPERATIONS_ADMIN", "SOCIETY_MANAGER"].includes(r));
    if (!hasRole) {
      return NextResponse.json({ error: "forbidden", message: "Society management privileges required" }, { status: 403 });
    }

    const { id } = await params;

    // Multi-tenant territory check for SOCIETY_MANAGER
    if (user.roles.includes("SOCIETY_MANAGER") && !user.roles.includes("SUPER_ADMIN") && !user.roles.includes("OPERATIONS_ADMIN")) {
      const scope = await resolveTerritoryScope(user.id, user.roles);
      if (!scope.unrestricted && !scope.societyIds.includes(id)) {
        return NextResponse.json({ error: "forbidden", message: "Access to this society is restricted" }, { status: 403 });
      }
    }

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
