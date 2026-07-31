import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertContact, recordLeadMagnetRequest } from "@/modules/marketing/crm";
import { deliverLeadMagnetResource } from "@/modules/marketing/automation";
import { leadMagnetSlugs } from "@/modules/marketing/resources";
import { consumeRateLimit, requestIp } from "@/modules/security/rate-limit";
import { logger } from "@/lib/logger";

const schema = z.object({
  email: z.string().trim().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  magnetSlug: z.enum(leadMagnetSlugs),
  source: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const ip = requestIp(request);
    const { allowed, retryAfterSeconds } = await consumeRateLimit("public_lead_magnets", ip, 30, 60000);
    if (!allowed) {
      return NextResponse.json(
        { error: "too_many_requests" },
        { status: 429, headers: { "Retry-After": retryAfterSeconds.toString() } }
      );
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", issues: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const data = parsed.data;
    const contact = await upsertContact({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      source: data.source ?? "LEAD_MAGNET",
    });

    const requestRecord = await recordLeadMagnetRequest(contact.id, data.magnetSlug);
    await deliverLeadMagnetResource(requestRecord.id, data.magnetSlug);
    
    return NextResponse.json(
      { id: requestRecord.id, status: "queued" },
      { status: 201 },
    );
  } catch (error) {
    logger.exception("lead_magnet.request_failed", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
