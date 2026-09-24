import { NextRequest, NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import { grantCustomPermission, revokeCustomPermission } from "@/modules/rbac/authorize";
import { permissions, type Permission } from "@/modules/rbac/permissions";

export async function POST(request: NextRequest) {
  try {
    const identity = await getCurrentIdentity(request);
    if (!identity) {
      return NextResponse.json(
        { error: "unauthorized", message: "Authentication required" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (!identity.roles.includes("SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "forbidden", message: "Super Admin privileges required to manage custom permissions" },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "bad_request", message: "Missing request body" },
        { status: 400 },
      );
    }

    const { targetUserId, permission, action, reason, expiresAt, scope } = body;

    if (!targetUserId || typeof targetUserId !== "string") {
      return NextResponse.json(
        { error: "bad_request", message: "targetUserId is required" },
        { status: 400 },
      );
    }

    if (!permission || !permissions.includes(permission as Permission)) {
      return NextResponse.json(
        { error: "bad_request", message: `Invalid permission: ${permission}` },
        { status: 400 },
      );
    }

    if (action !== "GRANT" && action !== "REVOKE") {
      return NextResponse.json(
        { error: "bad_request", message: "action must be 'GRANT' or 'REVOKE'" },
        { status: 400 },
      );
    }

    const requestId = request.headers.get("x-request-id") || crypto.randomUUID();

    if (action === "GRANT") {
      if (!reason || typeof reason !== "string") {
        return NextResponse.json(
          { error: "bad_request", message: "A documented business reason is required to grant custom permissions" },
          { status: 400 },
        );
      }

      const result = await grantCustomPermission({
        actorIdentity: identity,
        targetUserId,
        permission,
        reason,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        scope,
        requestId,
      });

      return NextResponse.json(result);
    } else {
      const result = await revokeCustomPermission({
        actorIdentity: identity,
        targetUserId,
        permission,
        reason: reason || "Revocation by Super Admin",
        requestId,
      });

      return NextResponse.json(result);
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "operation_failed", message: error.message },
      { status: 500 },
    );
  }
}
