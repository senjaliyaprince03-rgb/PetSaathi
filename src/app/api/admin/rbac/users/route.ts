import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { canUser, resolveUserPermissions } from "@/modules/rbac/authorize";
import type { Role } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const identity = await getCurrentIdentity(request);
    if (!identity) {
      return NextResponse.json(
        { error: "unauthorized", message: "Authentication required" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }

    // Only users with users:read:any or SUPER_ADMIN can view all users' RBAC details
    const allowed = await canUser(identity, "users:read:any");
    if (!allowed) {
      return NextResponse.json(
        { error: "forbidden", message: "Admin privileges required" },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json({ success: true, users: [], total: 0 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";
    const roleFilter = searchParams.get("role") as Role | null;
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20", 10), 1), 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query) {
      where.OR = [
        { displayName: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ];
    }

    if (roleFilter) {
      where.roles = {
        some: {
          role: roleFilter,
        },
      };
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          displayName: true,
          email: true,
          status: true,
          createdAt: true,
          roles: {
            select: {
              role: true,
              grantedAt: true,
              grantedBy: true,
            },
          },
          permissionsHeld: {
            where: { status: "ACTIVE" },
            select: {
              permission: true,
              reason: true,
              expiresAt: true,
              grantedAt: true,
              grantedBy: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Enhance each user with their effective permissions
    const enhancedUsers = await Promise.all(
      users.map(async (u) => {
        const roleList = u.roles.map((r) => r.role);
        const effectivePerms = await resolveUserPermissions(u.id, roleList);
        return {
          id: u.id,
          displayName: u.displayName,
          email: u.email,
          status: u.status,
          createdAt: u.createdAt,
          roles: roleList,
          roleDetails: u.roles,
          customPermissions: u.permissionsHeld,
          effectivePermissions: Array.from(effectivePerms),
        };
      }),
    );

    return NextResponse.json({
      success: true,
      users: enhancedUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "internal_server_error", message: error.message },
      { status: 500 },
    );
  }
}
