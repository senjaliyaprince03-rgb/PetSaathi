import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import {
  fileDataSubjectRequest,
} from "@/modules/privacy/dpdp";
import type { DataRequestType } from "@prisma/client";

/**
 * POST /api/privacy/dsr — File a Data Subject Request.
 *
 * Body: { requestType: DataRequestType, description?: string }
 */
export async function POST(req: NextRequest) {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { requestType, description } = body as {
    requestType: DataRequestType;
    description?: string;
  };

  if (!requestType) {
    return NextResponse.json(
      { error: "requestType is required" },
      { status: 400 },
    );
  }

  const dsr = await fileDataSubjectRequest({
    userId: identity.id,
    requestType,
    description,
  });

  return NextResponse.json({ dsr }, { status: 201 });
}
