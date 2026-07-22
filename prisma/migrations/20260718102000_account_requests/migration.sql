CREATE TYPE "AccountRequestType" AS ENUM ('CORRECTION', 'EXPORT', 'DELETION');
CREATE TYPE "AccountRequestStatus" AS ENUM ('RECEIVED', 'IDENTITY_VERIFIED', 'IN_REVIEW', 'APPROVED', 'FULFILLED', 'REJECTED', 'CANCELLED');

CREATE TABLE "account_requests" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "reference" TEXT NOT NULL,
  "user_id" UUID NOT NULL,
  "type" "AccountRequestType" NOT NULL,
  "status" "AccountRequestStatus" NOT NULL DEFAULT 'RECEIVED',
  "details" JSONB NOT NULL,
  "handled_by" UUID,
  "resolution" TEXT,
  "requested_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "verified_at" TIMESTAMPTZ,
  "fulfilled_at" TIMESTAMPTZ,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "account_requests_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "account_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
);

CREATE UNIQUE INDEX "account_requests_reference_key" ON "account_requests"("reference");
CREATE INDEX "account_requests_user_id_requested_at_idx" ON "account_requests"("user_id", "requested_at");
CREATE INDEX "account_requests_type_status_requested_at_idx" ON "account_requests"("type", "status", "requested_at");
