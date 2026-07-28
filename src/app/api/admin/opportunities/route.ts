import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import { createOpportunity, listOpportunities, getPipelineSummary } from "@/modules/b2b/pipeline";
import type { OpportunityStage, ProgrammeType } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.some((r) => ["PARTNER_MANAGER", "SUPER_ADMIN"].includes(r))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const summary = url.searchParams.get("summary");
  if (summary === "true") {
    const data = await getPipelineSummary();
    return NextResponse.json(data);
  }

  const organizationId = url.searchParams.get("organizationId") ?? undefined;
  const stage = url.searchParams.get("stage") as OpportunityStage | undefined;
  const ownerId = url.searchParams.get("ownerId") ?? undefined;
  const programmeType = url.searchParams.get("programmeType") as ProgrammeType | undefined;
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") ?? "20", 10);

  const result = await listOpportunities({
    organizationId,
    stage: stage ?? undefined,
    ownerId,
    programmeType: programmeType ?? undefined,
    page,
    pageSize,
  });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.some((r) => ["PARTNER_MANAGER", "SUPER_ADMIN"].includes(r))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const opp = await createOpportunity({
    organizationId: body.organizationId,
    programmeType: body.programmeType,
    estimatedValue: body.estimatedValue,
    leadSource: body.leadSource,
    ownerId: body.ownerId ?? identity.id,
    notes: body.notes,
  });
  return NextResponse.json(opp, { status: 201 });
}
