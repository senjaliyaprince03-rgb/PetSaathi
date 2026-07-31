import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { adminResourceIdSchema } from "@/modules/admin/mutation";
import { authorizeApi } from "@/modules/auth/authorization";
import {
  pauseProgramme,
  ProgrammeAdminError,
} from "@/modules/b2b/programme-admin";

export const dynamic = "force-dynamic";

const allowedRoles = ["PARTNER_MANAGER", "SUPER_ADMIN"] as const;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authorization = await authorizeApi(allowedRoles);
  if (!authorization.authorized) return authorization.response;

  const id = adminResourceIdSchema.safeParse((await params).id);
  if (!id.success) {
    return NextResponse.json(
      { error: "invalid_resource_id" },
      { status: 422, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const programme = await pauseProgramme(id.data, {
      ...authorization.identity,
      requestId: request.headers.get("x-request-id"),
    });
    return NextResponse.json(
      { programme },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof ProgrammeAdminError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        {
          status: error.status,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }
    logger.error(error instanceof Error ? error : "ProgrammePauseError", {
      event: "admin.partner_programme.pause_failed",
      actorId: authorization.identity.id,
      programmeId: id.data,
    });
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
