-- Report review is a separate, auditable decision after sitter submission.
CREATE TYPE "ReportReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'CORRECTION_REQUIRED', 'ESCALATED');

ALTER TABLE "booking_reports"
  ADD COLUMN "review_status" "ReportReviewStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "reviewed_by" UUID,
  ADD COLUMN "review_note" TEXT;

CREATE INDEX "booking_reports_review_status_submitted_at_idx"
  ON "booking_reports"("review_status", "submitted_at");

ALTER TABLE "booking_reports"
  ADD CONSTRAINT "booking_reports_reviewed_by_fkey"
  FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "booking_reports"
  ADD CONSTRAINT "booking_reports_review_decision_check" CHECK (
    ("review_status" = 'PENDING' AND "reviewed_by" IS NULL AND "reviewed_at" IS NULL AND "review_note" IS NULL)
    OR
    ("review_status" <> 'PENDING' AND "reviewed_by" IS NOT NULL AND "reviewed_at" IS NOT NULL AND NULLIF(BTRIM("review_note"), '') IS NOT NULL)
  );
