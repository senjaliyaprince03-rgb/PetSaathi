import { NextResponse } from "next/server";
import { createContract, activateContract, getContracts, B2bError } from "@/modules/b2b/contract.service";
import { authorizeApi } from "@/modules/auth/authorization";

const allowedRoles = ["PARTNER_MANAGER", "FINANCE_ADMIN", "SUPER_ADMIN"] as const;

export async function POST(req: Request) {
  const authorization = await authorizeApi(allowedRoles);
  if (!authorization.authorized) return authorization.response;

  try {
    const body = await req.json();
    const { organizationId, contractType, startDate, endDate, contractedValue, action, contractId } = body;

    // Handle activate action if action is provided
    if (action === "ACTIVATE" && contractId) {
      const contract = await activateContract(contractId);
      return NextResponse.json(contract);
    }

    const contract = await createContract(
      organizationId,
      contractType,
      new Date(startDate),
      endDate ? new Date(endDate) : undefined,
      contractedValue
    );

    return NextResponse.json(contract, { status: 201 });
  } catch (error: any) {
    if (error instanceof B2bError) {
      return NextResponse.json({ error: error.code, message: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "internal_error", message: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const authorization = await authorizeApi(allowedRoles);
  if (!authorization.authorized) return authorization.response;

  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get("organizationId") || undefined;

  const contracts = await getContracts(organizationId);
  return NextResponse.json(contracts);
}
