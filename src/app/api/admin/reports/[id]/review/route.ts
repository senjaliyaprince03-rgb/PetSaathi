import type { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { reportReviewInputSchema } from "@/modules/reports/review";
import { ReportReviewError, reviewBookingReport } from "@/modules/reports/review-report";
import { consumeRateLimit } from "@/modules/security/rate-limit";

const reportRoles: Role[] = ["OPERATIONS_ADMIN", "SAFETY_ADMIN", "SUPER_ADMIN"];

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, reportRoles)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const rate = await consumeRateLimit("admin-report-review", identity.id, 100, 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const parsed = reportReviewInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await params;

  try {
    const result = await reviewBookingReport(id, { id: identity.id, roles: identity.roles }, parsed.data);
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof ReportReviewError) return NextResponse.json({ error: error.code, message: error.message }, { status: error.status });
    console.error("report.review_failed", { reportId: id, actorId: identity.id, error });
    return NextResponse.json({ error: "report_review_failed", message: "The report decision could not be committed safely." }, { status: 500 });
  }
}
