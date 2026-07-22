import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import { createProgramme, listProgrammes } from "@/modules/b2b/programmes";
import type { ProgrammeStatus, ProgrammeType } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.some((r) => ["PARTNER_MANAGER", "SUPER_ADMIN"].includes(r))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const url = new URL(req.url);
  const organizationId = url.searchParams.get("organizationId") ?? undefined;
  const status = url.searchParams.get("status") as ProgrammeStatus | undefined;
  const type = url.searchParams.get("type") as ProgrammeType | undefined;
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") ?? "20", 10);

  const result = await listProgrammes({ organizationId, status: status ?? undefined, type: type ?? undefined, page, pageSize });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.some((r) => ["PARTNER_MANAGER", "SUPER_ADMIN"].includes(r))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const programme = await createProgramme({
    organizationId: body.organizationId,
    contractId: body.contractId,
    name: body.name,
    slug: body.slug,
    programmeType: body.programmeType,
    cityScope: body.cityScope,
    eligibilityMethod: body.eligibilityMethod,
    eligibilityDomain: body.eligibilityDomain,
    startDate: body.startDate ? new Date(body.startDate) : undefined,
    endDate: body.endDate ? new Date(body.endDate) : undefined,
    accountManagerId: body.accountManagerId,
    metadata: body.metadata,
  });
  return NextResponse.json(programme, { status: 201 });
}
