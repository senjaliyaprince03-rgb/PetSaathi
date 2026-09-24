import { NextRequest, NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import { assignUserRole, revokeUserRole } from "@/modules/rbac/authorize";
import { roles, type Role } from "@/modules/rbac/permissions";

export async function POST(request: NextRequest) {
  try {
    const identity = await getCurrentIdentity(request);
    if (!identity) {
      return NextResponse.json(
        { error: "unauthorized", message: "Authentication required" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "bad_request", message: "Missing request body" },
        { status: 400 },
      );
    }

    const { targetUserId, role, action, reason } = body;

    if (!targetUserId || typeof targetUserId !== "string") {
      return NextResponse.json(
        { error: "bad_request", message: "targetUserId is required" },
        { status: 400 },
      );
    }

    if (!role || !roles.includes(role as Role)) {
      return NextResponse.json(
        { error: "bad_request", message: `Invalid role: ${role}` },
        { status: 400 },
      );
    }

    if (action !== "ASSIGN" && action !== "REVOKE") {
      return NextResponse.json(
        { error: "bad_request", message: "action must be 'ASSIGN' or 'REVOKE'" },
        { status: 400 },
      );
    }

    const requestId = request.headers.get("x-request-id") || crypto.randomUUID();

    if (action === "ASSIGN") {
      const result = await assignUserRole({
        actorIdentity: identity,
        targetUserId,
        role: role as Role,
        reason: reason || "Admin role assignment",
        requestId,
      });
      return NextResponse.json(result);
    } else {
      const result = await revokeUserRole({
        actorIdentity: identity,
        targetUserId,
        role: role as Role,
        reason: reason || "Admin role revocation",
        requestId,
      });
      return NextResponse.json(result);
    }
  } catch (error: any) {
    const status = error.message?.includes("Privilege escalation")
      ? 403
      : error.message?.includes("not found")
      ? 404
      : error.message?.includes("permission")
      ? 403
      : 500;

    return NextResponse.json(
      { error: "operation_failed", message: error.message },
      { status },
    );
  }
}
