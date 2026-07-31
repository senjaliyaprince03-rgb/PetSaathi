import { NextResponse } from "next/server";
import { z } from "zod";

import { logger } from "@/lib/logger";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { completeIncidentCorrectiveAction, IncidentWorkflowError } from "@/modules/incidents/workflow";
import { consumeRateLimit } from "@/modules/security/rate-limit";

const inputSchema = z.object({ completionNote: z.string().trim().min(10).max(2000) });

export async function POST(request: Request, context: { params: Promise<{ id: string; actionId: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SAFETY_ADMIN", "SUPER_ADMIN"])) return problem(403, "forbidden", "Safety authority is required.");
  const rate = await consumeRateLimit("admin-incident-corrective-complete", identity.id, 100, 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id, actionId } = await context.params;
  try {
    const action = await completeIncidentCorrectiveAction(id, actionId, { id: identity.id, roles: identity.roles }, parsed.data.completionNote);
    return NextResponse.json({ action }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof IncidentWorkflowError) return problem(error.status, error.code, error.message);
    logger.exception("incident.corrective_complete_failed", error, {
      incidentId: id,
      actionId,
      actorId: identity.id,
    });
    return problem(500, "corrective_action_completion_failed", "The completion evidence could not be committed safely.");
  }
}

function problem(status: number, error: string, message: string) { return NextResponse.json({ error, message }, { status, headers: { "Cache-Control": "no-store" } }); }
