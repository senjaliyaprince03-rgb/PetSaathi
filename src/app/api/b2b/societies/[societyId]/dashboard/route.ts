import { NextResponse } from "next/server";
import { getSocietyDashboard } from "@/modules/b2b/service";
import { getCurrentIdentity } from "@/modules/auth/session";
import { resolveTerritoryScope } from "@/modules/rbac/territory-scope";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ societyId: string }> }
) {
  try {
    const identity = await getCurrentIdentity();
    if (!identity) {
      return NextResponse.json(
        { error: "unauthorized", message: "Authentication required" },
        { status: 401 }
      );
    }

    const { societyId } = await params;

    const isCentralAdmin = identity.roles.some((r) =>
      ["SUPER_ADMIN", "OPERATIONS_ADMIN"].includes(r)
    );
    const isSocietyManager = identity.roles.includes("SOCIETY_MANAGER");

    if (!isCentralAdmin && !isSocietyManager) {
      return NextResponse.json(
        { error: "forbidden", message: "Society management privileges required" },
        { status: 403 }
      );
    }

    let authorizedScope: { societyIds?: string[] } | null = null;
    if (isSocietyManager && !isCentralAdmin) {
      const scope = await resolveTerritoryScope(identity.id, identity.roles);
      if (!scope.unrestricted && !scope.societyIds.includes(societyId)) {
        return NextResponse.json(
          { error: "forbidden", message: "Access to this society is restricted" },
          { status: 403 }
        );
      }
      authorizedScope = { societyIds: scope.societyIds };
    }

    const dashboard = await getSocietyDashboard(societyId, authorizedScope);
    return NextResponse.json({ dashboard }, { status: 200 });
  } catch (error: any) {
    if (error.code === "society_not_found") {
      return NextResponse.json({ error: "not_found", message: error.message }, { status: 404 });
    }
    console.error("Error in GET society dashboard API:", error);
    return NextResponse.json(
      { error: "internal_error", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
