import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentIdentity } from "@/modules/auth/session";
import { approveCustomerAssignment, AssignmentApprovalError } from "@/modules/bookings/approve-assignment";
import { consumeRateLimit } from "@/modules/security/rate-limit";

const inputSchema = z.object({ assignmentId: z.string().uuid() });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return problem(401, "unauthorized", "A customer account is required.");
  const rate = await consumeRateLimit("customer-assignment-approval", identity.id, 30, 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 422 });
  const { id } = await context.params;
  try {
    const result = await approveCustomerAssignment(id, parsed.data.assignmentId, identity.id);
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof AssignmentApprovalError) return problem(error.status, error.code, error.message);
    console.error("assignment.approval_failed", { bookingId: id, assignmentId: parsed.data.assignmentId, customerId: identity.id, error });
    return problem(500, "assignment_approval_failed", "The assignment approval could not be committed safely.");
  }
}

function problem(status: number, error: string, message: string) { return NextResponse.json({ error, message }, { status, headers: { "Cache-Control": "no-store" } }); }
