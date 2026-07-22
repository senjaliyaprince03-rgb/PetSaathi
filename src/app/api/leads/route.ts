import { NextResponse } from "next/server";

import { isDatabaseConfigured, prisma } from "@/lib/db";
import { leadInputSchema } from "@/modules/leads/input";
import { consumeRateLimit, requestIp } from "@/modules/security/rate-limit";

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) return NextResponse.json({ error: "lead_capture_not_configured" }, { status: 503 });
  const parsed = leadInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const rate = await consumeRateLimit("public-lead", requestIp(request), 5, 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const lead = await prisma.lead.create({ data: { type: parsed.data.type, name: parsed.data.name, email: parsed.data.email || null, phoneE164: parsed.data.phone ? `+91${parsed.data.phone}` : null, organisationName: parsed.data.organisationName || null, locality: parsed.data.locality || null, message: parsed.data.message, consentToContact: parsed.data.consentToContact, source: "website-contact" } });
  return NextResponse.json({ lead: { id: lead.id, status: lead.status } }, { status: 201 });
}
