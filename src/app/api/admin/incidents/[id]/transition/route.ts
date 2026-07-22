import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { incidentStatuses } from "@/modules/incidents/state-machine";
import { IncidentWorkflowError, incidentBookingResolutions, incidentEventTypes, transitionIncident } from "@/modules/incidents/workflow";
import { consumeRateLimit } from "@/modules/security/rate-limit";

const transitionSchema = z.object({
  toState: z.enum(incidentStatuses),
  details: z.string().trim().min(5).max(2000),
  eventType: z.enum(incidentEventTypes),
  bookingResolution: z.enum(incidentBookingResolutions).optional()
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SAFETY_ADMIN", "SUPER_ADMIN"])) return problem(403, "forbidden", "Safety authority is required.");
  const rate = await consumeRateLimit("admin-incident-transition", identity.id, 100, 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const parsed = transitionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  try {
    const result = await transitionIncident(id, { id: identity.id, roles: identity.roles }, parsed.data);
    return NextResponse.json({ transitioned: true, status: result.incident.status, bookingStatus: result.bookingStatus }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof IncidentWorkflowError) return problem(error.status, error.code, error.message);
    console.error("incident.transition_failed", { incidentId: id, actorId: identity.id, error });
    return problem(500, "incident_transition_failed", "The incident transition could not be committed safely.");
  }
}

function problem(status: number, error: string, message: string) { return NextResponse.json({ error, message }, { status, headers: { "Cache-Control": "no-store" } }); }
