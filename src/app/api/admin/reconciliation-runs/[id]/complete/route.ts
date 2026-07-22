import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { reconciliationDifference, reconciliationMatches, reconciliationTotals, type ReconciliationTotals } from "@/modules/pricing/economics";
import { completeReconciliationRunSchema } from "@/modules/pricing/input";
import { consumeRateLimit } from "@/modules/security/rate-limit";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["FINANCE_ADMIN", "SUPER_ADMIN"])) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const rate = await consumeRateLimit("admin-reconciliation-complete", identity.id, 30, 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const parsed = completeReconciliationRunSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await params;

  try {
    const run = await prisma.$transaction(async (tx) => {
      const current = await tx.reconciliationRun.findUnique({ where: { id } });
      if (!current) throw new ReconciliationError(404, "run_not_found", "The reconciliation run does not exist.");
      if (!current.expected) throw new ReconciliationError(409, "expected_missing", "Expected totals are missing; this run cannot be completed.");
      if (!(["QUEUED", "RUNNING"] as const).includes(current.status as "QUEUED" | "RUNNING")) throw new ReconciliationError(409, "run_finalized", "This reconciliation run is already finalized.");
      const expectedObject = current.expected as Record<string, unknown>;
      const expected = reconciliationTotals(Number(expectedObject.capturedPaise), Number(expectedObject.refundedPaise), Number(expectedObject.paidOutPaise));
      const actual = reconciliationTotals(parsed.data.capturedPaise, parsed.data.refundedPaise, parsed.data.paidOutPaise);
      const differences = reconciliationDifference(expected as ReconciliationTotals, actual);
      const status = reconciliationMatches(differences) ? "SUCCEEDED" : "FAILED";
      const now = new Date();
      const updated = await tx.reconciliationRun.update({ where: { id: current.id }, data: { status, actual: { ...actual, statementNote: parsed.data.note }, differences, startedAt: current.startedAt ?? now, completedAt: now, approvedBy: identity.id } });
      await tx.auditLog.create({ data: { actorId: identity.id, actorRole: identity.roles.includes("SUPER_ADMIN") ? "SUPER_ADMIN" : "FINANCE_ADMIN", action: "reconciliation_run.completed", resourceType: "reconciliation_run", resourceId: current.id, before: { status: current.status }, after: { status, actual, differences }, reason: parsed.data.note } });
      return updated;
    });
    return NextResponse.json({ run }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof ReconciliationError) return NextResponse.json({ error: error.code, message: error.message }, { status: error.status });
    console.error("reconciliation.complete_failed", { runId: id, actorId: identity.id, error });
    return NextResponse.json({ error: "reconciliation_failed", message: "Provider totals could not be reconciled safely." }, { status: 500 });
  }
}

class ReconciliationError extends Error { constructor(public readonly status: number, public readonly code: string, message: string) { super(message); } }
