import { NextResponse } from "next/server";
import { z } from "zod";

import {
  getAvailableProgrammeBySlug,
  ProgrammeLookupError,
} from "@/modules/b2b/programmes";

export const dynamic = "force-dynamic";

const slugSchema = z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const slug = slugSchema.safeParse((await params).slug);
  if (!slug.success) {
    return NextResponse.json(
      { error: "programme_not_found" },
      { status: 404 },
    );
  }

  try {
    const programme = await getAvailableProgrammeBySlug(slug.data);
    const safeData = {
      id: programme.id,
      name: programme.name,
      slug: programme.slug,
      programmeType: programme.programmeType,
      cityScope: programme.cityScope,
      eligibilityMethod: programme.eligibilityMethod,
      startDate: programme.startDate,
      endDate: programme.endDate,
      organizationName: programme.organization.displayName,
      organizationType: programme.organization.organizationType,
    };
    return NextResponse.json(safeData, {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
    });
  } catch (error) {
    if (!(error instanceof ProgrammeLookupError)) {
      return NextResponse.json(
        { error: "internal_error" },
        { status: 500, headers: { "Cache-Control": "no-store" } },
      );
    }
    return NextResponse.json(
      { error: "programme_not_found" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }
}
