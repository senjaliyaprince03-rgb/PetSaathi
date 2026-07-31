import { NextResponse } from "next/server";
import { z } from "zod";
import { submitEnquiry } from "@/modules/marketing/crm";
import { LeadType } from "@prisma/client";
import { consumeRateLimit, requestIp } from "@/modules/security/rate-limit";
import { logger } from "@/lib/logger";

const schema = z.object({
  email: z.string().trim().email().max(254).toLowerCase().optional(),
  phoneE164: z.string().trim().regex(/^\+[1-9]\d{7,14}$/).optional(),
  firstName: z.string().trim().min(1).max(100).optional(),
  lastName: z.string().trim().min(1).max(100).optional(),
  type: z.nativeEnum(LeadType),
  notes: z.string().trim().max(2_000).optional(),
  source: z.string().trim().min(1).max(100).optional(),
}).strict().refine(data => data.email || data.phoneE164, {
  message: "Either email or phone is required",
  path: ["email"],
});

export async function POST(request: Request) {
  try {
    const ip = requestIp(request);
    const { allowed, retryAfterSeconds } = await consumeRateLimit("public_leads", ip, 30, 60000);
    if (!allowed) {
      return NextResponse.json(
        { error: "too_many_requests" },
        { status: 429, headers: { "Retry-After": retryAfterSeconds.toString() } }
      );
    }

    const parsed = schema.safeParse(
      await request.json().catch(() => null),
    );
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", issues: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const lead = await submitEnquiry(parsed.data);
    return NextResponse.json({ id: lead.id, status: "success" }, { status: 201 });
  } catch (error) {
    logger.exception("lead.submission_failed", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
