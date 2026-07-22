ALTER TYPE "AssignmentStatus" ADD VALUE IF NOT EXISTS 'NO_SHOW';

CREATE UNIQUE INDEX "booking_assignments_one_active_primary_or_replacement_idx"
ON "booking_assignments" ("booking_id")
WHERE "type" IN ('PRIMARY', 'REPLACEMENT')
  AND "status" IN ('OFFERED', 'ACCEPTED', 'CUSTOMER_APPROVED', 'ACTIVE');

CREATE UNIQUE INDEX "sitter_holds_one_active_idx"
ON "sitter_holds" ("sitter_id")
WHERE "status" = 'ACTIVE';

ALTER TABLE "incidents"
ADD CONSTRAINT "incidents_closure_metadata_check"
CHECK (
  ("status" = 'CLOSED' AND "closed_at" IS NOT NULL AND "closed_by" IS NOT NULL)
  OR
  ("status" <> 'CLOSED' AND "closed_at" IS NULL AND "closed_by" IS NULL)
);

ALTER TABLE "corrective_actions"
ADD CONSTRAINT "corrective_actions_completion_evidence_check"
CHECK ("completed_at" IS NULL OR "evidence" IS NOT NULL);

ALTER TABLE "sitter_holds"
ADD CONSTRAINT "sitter_holds_release_metadata_check"
CHECK (
  ("status" = 'ACTIVE' AND "released_at" IS NULL AND "released_by" IS NULL AND "release_reason" IS NULL)
  OR
  ("status" IN ('RELEASED', 'EXPIRED') AND "released_at" IS NOT NULL AND "release_reason" IS NOT NULL)
);
