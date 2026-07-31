import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { getCurrentIdentity } from "@/modules/auth/session";
import { bookingReportSchema } from "@/modules/reports/input";
import { ReportSubmissionError, submitBookingReport } from "@/modules/reports/submit-report";
import { consumeRateLimit } from "@/modules/security/rate-limit";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const rate = await consumeRateLimit("sitter-report-submit", identity.id, 20, 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const parsed = bookingReportSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  try {
    const report = await submitBookingReport(id, identity.id, parsed.data);
    return NextResponse.json({ report: { id: report.id, version: report.version, submittedAt: report.submittedAt } }, { status: 201 });
  } catch (error) {
    if (error instanceof ReportSubmissionError) return NextResponse.json({ error: error.code, message: error.message }, { status: error.status });
    logger.exception("report.submit_failed", error, {
      assignmentId: id,
      sitterUserId: identity.id,
    });
    return NextResponse.json({ error: "report_submission_failed", message: "The report could not be committed safely." }, { status: 500 });
  }
}
