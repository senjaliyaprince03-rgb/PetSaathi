import { NextRequest, NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import { canUser } from "@/modules/rbac/authorize";
import { getRecentAuditLogs } from "@/modules/rbac/audit-logger";

export async function GET(request: NextRequest) {
  try {
    const identity = await getCurrentIdentity(request);
    if (!identity) {
      return NextResponse.json(
        { error: "unauthorized", message: "Authentication required" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }

    const hasAccess =
      identity.roles.includes("SUPER_ADMIN") ||
      (await canUser(identity, "system:audit_logs"));

    if (!hasAccess) {
      return NextResponse.json(
        { error: "forbidden", message: "Super Admin or Audit Log access required" },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "30", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const resourceType = searchParams.get("resourceType") || undefined;
    const actorId = searchParams.get("actorId") || undefined;
    const action = searchParams.get("action") || undefined;

    const data = await getRecentAuditLogs({
      limit,
      offset,
      resourceType,
      actorId,
      action,
    });

    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    return NextResponse.json(
      { error: "internal_server_error", message: error.message },
      { status: 500 },
    );
  }
}
