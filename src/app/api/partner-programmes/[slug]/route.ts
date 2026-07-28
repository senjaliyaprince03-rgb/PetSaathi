/* eslint-disable */
import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getProgrammeBySlug } from "@/modules/b2b/programmes";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const programme = await getProgrammeBySlug(slug);
    // Remove internal info before sending to public clients
    const safeData = {
      id: programme.id,
      name: programme.name,
      slug: programme.slug,
      programmeType: programme.programmeType,
      cityScope: programme.cityScope,
      eligibilityMethod: programme.eligibilityMethod,
      eligibilityDomain: programme.eligibilityDomain,
      status: programme.status,
      startDate: programme.startDate,
      organizationName: programme.organization.displayName,
      organizationType: programme.organization.organizationType,
    };
    return NextResponse.json(safeData);
  } catch {
    return NextResponse.json({ error: "Programme not found" }, { status: 404 });
  }
}
