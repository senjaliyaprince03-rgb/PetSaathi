import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentIdentity } from "@/modules/auth/session";
import { IncidentWorkflowError, incidentCategories, incidentSeverities, reportBookingIncident } from "@/modules/incidents/workflow";
import { consumeRateLimit } from "@/modules/security/rate-limit";

const incidentSchema = z.object({
  category: z.enum(incidentCategories),
  severity: z.enum(incidentSeverities),
  description: z.string().trim().min(20).max(3000),
  observedSymptoms: z.string().trim().max(1500).optional(),
  detectedAt: z.string().datetime({ offset: true }).optional()
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity) return problem(401, "unauthorized", "Sign in to report a booking incident.");
  const rate = await consumeRateLimit("booking-incident-report", identity.id, 12, 24 * 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const parsed = incidentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  try {
    const result = await reportBookingIncident(id, { id: identity.id, roles: identity.roles }, { ...parsed.data, detectedAt: parsed.data.detectedAt ? new Date(parsed.data.detectedAt) : undefined });
    return NextResponse.json({ incident: { id: result.incident.id, reference: result.incident.reference, status: result.incident.status }, bookingHeld: result.bookingHeld }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof IncidentWorkflowError) return problem(error.status, error.code, error.message);
    console.error("incident.report_failed", { bookingId: id, actorId: identity.id, error });
    return problem(500, "incident_report_failed", "The incident could not be recorded safely.");
  }
}

function problem(status: number, error: string, message: string) { return NextResponse.json({ error, message }, { status, headers: { "Cache-Control": "no-store" } }); }
