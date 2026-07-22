import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { createOrganization, listOrganizations } from "@/modules/b2b/organizations";
import type { OrganizationType, OrgStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.some((r) => ["PARTNER_MANAGER", "SUPER_ADMIN"].includes(r))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type") as OrganizationType | undefined;
  const status = url.searchParams.get("status") as OrgStatus | undefined;
  const cityId = url.searchParams.get("cityId") ?? undefined;
  const search = url.searchParams.get("search") ?? undefined;
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") ?? "20", 10);

  const result = await listOrganizations({ type: type ?? undefined, status: status ?? undefined, cityId, search, page, pageSize });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.some((r) => ["PARTNER_MANAGER", "SUPER_ADMIN"].includes(r))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const org = await createOrganization({
    legalName: body.legalName,
    displayName: body.displayName,
    organizationType: body.organizationType,
    website: body.website,
    primaryCityId: body.primaryCityId,
    gstin: body.gstin,
    billingAddressId: body.billingAddressId,
    accountOwnerId: body.accountOwnerId ?? identity.userId,
    notes: body.notes,
  });
  return NextResponse.json(org, { status: 201 });
}
