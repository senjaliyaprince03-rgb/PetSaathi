import type { NextRequest} from "next/server";
/* eslint-disable */
import { NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import { createContract, listContracts } from "@/modules/b2b/contracts";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.some((r) => ["PARTNER_MANAGER", "FINANCE_ADMIN", "SUPER_ADMIN"].includes(r))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const url = new URL(req.url);
  const organizationId = url.searchParams.get("organizationId") ?? undefined;
  const status = url.searchParams.get("status") ?? undefined;
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") ?? "20", 10);

  const result = await listContracts({ organizationId, status: status as any, page, pageSize });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.some((r) => ["PARTNER_MANAGER", "SUPER_ADMIN"].includes(r))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const contract = await createContract({
    organizationId: body.organizationId,
    opportunityId: body.opportunityId,
    contractType: body.contractType,
    startDate: new Date(body.startDate),
    endDate: body.endDate ? new Date(body.endDate) : undefined,
    renewalDate: body.renewalDate ? new Date(body.renewalDate) : undefined,
    billingFrequency: body.billingFrequency,
    contractedValue: body.contractedValue,
    paymentTermsDays: body.paymentTermsDays,
    notes: body.notes,
  });
  return NextResponse.json(contract, { status: 201 });
}
