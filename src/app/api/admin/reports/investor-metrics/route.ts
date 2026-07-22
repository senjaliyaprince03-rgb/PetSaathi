import { NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import { generateInvestorMetrics } from "@/modules/reporting/investor-metrics";

/**
 * GET /api/admin/reports/investor-metrics
 *
 * Returns the full investor KPI matrix. Restricted to SUPER_ADMIN and FINANCE_ADMIN.
 * BigInt values are serialized as strings for JSON compatibility.
 */
export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAuthorized =
    identity.roles.includes("SUPER_ADMIN") ||
    identity.roles.includes("FINANCE_ADMIN");

  if (!isAuthorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const metrics = await generateInvestorMetrics();

  // Serialize BigInts for JSON
  const serialized = JSON.parse(
    JSON.stringify(metrics, (_key, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );

  return NextResponse.json(serialized);
}
