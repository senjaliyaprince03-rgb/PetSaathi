import { NextResponse } from "next/server";
import { createProgramme, activateProgramme } from "@/modules/b2b/programme.service";
import { B2bError } from "@/modules/b2b/contract.service";
import { authorizeApi } from "@/modules/auth/authorization";

const allowedRoles = ["PARTNER_MANAGER", "SUPER_ADMIN"] as const;

export async function POST(req: Request) {
  const authorization = await authorizeApi(allowedRoles);
  if (!authorization.authorized) return authorization.response;

  try {
    const body = await req.json();
    const { action, programmeId, organizationId, contractId, name, slug, programmeType, cityScope, eligibilityMethod, eligibilityDomain, startDate, endDate } = body;

    // Handle activate action
    if (action === "ACTIVATE" && programmeId) {
      const programme = await activateProgramme(programmeId);
      return NextResponse.json(programme);
    }

    const programme = await createProgramme(
      organizationId,
      contractId,
      name,
      slug,
      programmeType,
      cityScope,
      eligibilityMethod,
      eligibilityDomain,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );

    return NextResponse.json(programme, { status: 201 });
  } catch (error: any) {
    if (error instanceof B2bError) {
      return NextResponse.json({ error: error.code, message: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "internal_error", message: error.message }, { status: 500 });
  }
}
