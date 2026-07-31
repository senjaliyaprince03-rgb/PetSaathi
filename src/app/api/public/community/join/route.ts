import { NextResponse } from "next/server";
import { z } from "zod";
import { requestCommunityJoin } from "@/modules/marketing/community";
import { consumeRateLimit, requestIp } from "@/modules/security/rate-limit";
import { logger } from "@/lib/logger";

const schema = z.object({
  email: z.string().trim().email().max(254).toLowerCase().optional(),
  phoneE164: z.string().trim().regex(/^\+[1-9]\d{7,14}$/).optional(),
  firstName: z.string().trim().min(1).max(100).optional(),
  lastName: z.string().trim().min(1).max(100).optional(),
  groupSlug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),
  source: z.string().trim().min(1).max(100).optional(),
}).strict().refine(data => data.email || data.phoneE164, {
  message: "Either email or phone is required",
  path: ["email"],
});

export async function POST(request: Request) {
  try {
    const ip = requestIp(request);
    const { allowed, retryAfterSeconds } = await consumeRateLimit("public_community_join", ip, 30, 60000);
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

    const data = parsed.data;
    const membership = await requestCommunityJoin(data.groupSlug, {
      email: data.email,
      phoneE164: data.phoneE164,
      firstName: data.firstName,
      lastName: data.lastName,
      source: data.source ?? "COMMUNITY_JOIN",
    });
    
    return NextResponse.json({ id: membership.id, status: membership.status }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: "NOT_FOUND", message: "Group not found" }, { status: 404 });
    }
    logger.exception("community.join_failed", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
