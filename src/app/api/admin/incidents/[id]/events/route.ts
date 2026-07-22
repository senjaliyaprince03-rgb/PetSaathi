import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { IncidentWorkflowError, incidentEventTypes, recordIncidentEvent } from "@/modules/incidents/workflow";
import { consumeRateLimit } from "@/modules/security/rate-limit";

const inputSchema = z.object({ type: z.enum(incidentEventTypes), details: z.string().trim().min(5).max(2000) });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SAFETY_ADMIN", "SUPER_ADMIN"])) return problem(403, "forbidden", "Safety authority is required.");
  const rate = await consumeRateLimit("admin-incident-event", identity.id, 200, 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  try {
    const event = await recordIncidentEvent(id, { id: identity.id, roles: identity.roles }, parsed.data);
    return NextResponse.json({ event }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof IncidentWorkflowError) return problem(error.status, error.code, error.message);
    console.error("incident.event_failed", { incidentId: id, actorId: identity.id, error });
    return problem(500, "incident_event_failed", "The timeline event could not be recorded safely.");
  }
}

function problem(status: number, error: string, message: string) { return NextResponse.json({ error, message }, { status, headers: { "Cache-Control": "no-store" } }); }
