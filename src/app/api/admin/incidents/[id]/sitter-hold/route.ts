import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { IncidentWorkflowError, placeIncidentSitterHold, releaseIncidentSitterHold } from "@/modules/incidents/workflow";
import { consumeRateLimit } from "@/modules/security/rate-limit";

const inputSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("PLACE"), reason: z.string().trim().min(10).max(1000), expiresAt: z.string().datetime({ offset: true }).optional() }),
  z.object({ action: z.literal("RELEASE"), reason: z.string().trim().min(10).max(1000) })
]);

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SAFETY_ADMIN", "SUPER_ADMIN"])) return problem(403, "forbidden", "Safety authority is required.");
  const rate = await consumeRateLimit("admin-incident-sitter-hold", identity.id, 50, 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  try {
    const hold = parsed.data.action === "PLACE"
      ? await placeIncidentSitterHold(id, { id: identity.id, roles: identity.roles }, { reason: parsed.data.reason, expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined })
      : await releaseIncidentSitterHold(id, { id: identity.id, roles: identity.roles }, parsed.data.reason);
    return NextResponse.json({ hold }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof IncidentWorkflowError) return problem(error.status, error.code, error.message);
    console.error("incident.sitter_hold_failed", { incidentId: id, actorId: identity.id, error });
    return problem(500, "sitter_hold_failed", "The safety hold could not be committed safely.");
  }
}

function problem(status: number, error: string, message: string) { return NextResponse.json({ error, message }, { status, headers: { "Cache-Control": "no-store" } }); }
