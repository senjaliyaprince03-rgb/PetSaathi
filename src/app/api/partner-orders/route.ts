import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentIdentity } from "@/modules/auth/session";
import { isFeatureEnabled } from "@/modules/features/server";
import { createPartnerOrder, PartnerOrderWorkflowError } from "@/modules/partners/order-workflow";
import { consumeRateLimit } from "@/modules/security/rate-limit";

const schema = z.object({ partnerServiceId: z.string().uuid(), petId: z.string().uuid().optional(), scheduledAt: z.coerce.date().min(new Date()).optional(), instructions: z.string().trim().min(5).max(2_000).optional() });

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!await isFeatureEnabled("partner_marketplace")) return NextResponse.json({ error: "partner_marketplace_disabled" }, { status: 404 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const rate = await consumeRateLimit("partner-order-create", identity.id, 5, 24 * 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  try {
    const order = await createPartnerOrder(identity.id, parsed.data);
    return NextResponse.json({ order: { id: order.id, reference: order.reference, status: order.status } }, { status: 201 });
  } catch (error) {
    if (error instanceof PartnerOrderWorkflowError) return NextResponse.json({ error: error.code, message: error.message }, { status: error.status });
    throw error;
  }
}
