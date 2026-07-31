import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/modules/auth/server";
import { recordPartnerVerification } from "@/modules/partners/service";
import { VerificationStatus } from "@prisma/client";
import { z } from "zod";

const createVerificationSchema = z.object({
  type: z.string().min(1),
  status: z.nativeEnum(VerificationStatus),
  evidenceRef: z.string().optional(),
  verifiedBy: z.string().uuid().optional(),
  expiresAt: z.string().datetime().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminId = await getAdminSession();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const data = createVerificationSchema.parse(body);

    const verification = await recordPartnerVerification(id, {
      ...data,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    });

    return NextResponse.json(verification, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 422 });
    }
    console.error("Partner verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
