import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { reconciliationTotals } from "@/modules/pricing/economics";
import { createReconciliationRunSchema } from "@/modules/pricing/input";
import { consumeRateLimit } from "@/modules/security/rate-limit";

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["FINANCE_ADMIN", "SUPER_ADMIN"])) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const rate = await consumeRateLimit("admin-reconciliation-create", identity.id, 20, 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const parsed = createReconciliationRunSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const periodStart = new Date(parsed.data.periodStart);
  const periodEnd = new Date(parsed.data.periodEnd);

  try {
    const run = await prisma.$transaction(async (tx) => {
      const [payments, refunds, payouts] = await Promise.all([
        tx.payment.aggregate({ where: { provider: parsed.data.provider, capturedAt: { gte: periodStart, lt: periodEnd }, status: { in: ["CAPTURED", "PARTIALLY_REFUNDED", "REFUNDED"] } }, _sum: { amountPaise: true } }),
        tx.refund.aggregate({ where: { completedAt: { gte: periodStart, lt: periodEnd }, status: "COMPLETED", payment: { provider: parsed.data.provider } }, _sum: { amountPaise: true } }),
        tx.payout.aggregate({ where: { paidAt: { gte: periodStart, lt: periodEnd }, status: "PAID" }, _sum: { amountPaise: true, adjustmentPaise: true } })
      ]);
      const expected = reconciliationTotals(payments._sum.amountPaise ?? 0, refunds._sum.amountPaise ?? 0, (payouts._sum.amountPaise ?? 0) + (payouts._sum.adjustmentPaise ?? 0));
      const created = await tx.reconciliationRun.create({ data: { provider: parsed.data.provider, periodStart, periodEnd, status: "QUEUED", expected, approvedBy: identity.id } });
      await tx.auditLog.create({ data: { actorId: identity.id, actorRole: identity.roles.includes("SUPER_ADMIN") ? "SUPER_ADMIN" : "FINANCE_ADMIN", action: "reconciliation_run.created", resourceType: "reconciliation_run", resourceId: created.id, after: { provider: created.provider, periodStart: created.periodStart.toISOString(), periodEnd: created.periodEnd.toISOString(), expected } } });
      return created;
    });
    return NextResponse.json({ run }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") return NextResponse.json({ error: "duplicate_period", message: "This provider period already has a reconciliation run." }, { status: 409 });
    console.error("reconciliation.create_failed", { actorId: identity.id, error });
    return NextResponse.json({ error: "reconciliation_failed", message: "Expected finance totals could not be snapshotted safely." }, { status: 500 });
  }
}
