import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { createIncidentCorrectiveAction, IncidentWorkflowError } from "@/modules/incidents/workflow";
import { consumeRateLimit } from "@/modules/security/rate-limit";

const inputSchema = z.object({ title: z.string().trim().min(10).max(500), ownerId: z.string().uuid().optional(), dueAt: z.string().datetime({ offset: true }) });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SAFETY_ADMIN", "SUPER_ADMIN"])) return problem(403, "forbidden", "Safety authority is required.");
  const rate = await consumeRateLimit("admin-incident-corrective-action", identity.id, 100, 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const dueAt = new Date(parsed.data.dueAt);
  if (dueAt <= new Date()) return problem(422, "invalid_due_date", "The deadline must be in the future.");
  const { id } = await context.params;
  try {
    const action = await createIncidentCorrectiveAction(id, { id: identity.id, roles: identity.roles }, { ...parsed.data, dueAt });
    return NextResponse.json({ action }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof IncidentWorkflowError) return problem(error.status, error.code, error.message);
    console.error("incident.corrective_action_failed", { incidentId: id, actorId: identity.id, error });
    return problem(500, "corrective_action_failed", "The corrective action could not be recorded safely.");
  }
}

function problem(status: number, error: string, message: string) { return NextResponse.json({ error, message }, { status, headers: { "Cache-Control": "no-store" } }); }
