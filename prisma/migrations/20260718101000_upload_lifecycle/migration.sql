CREATE TYPE "UploadStatus" AS ENUM ('QUARANTINED', 'CLEAN', 'REJECTED', 'PROMOTED', 'DELETED');

CREATE TABLE "upload_objects" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "owner_id" UUID NOT NULL,
  "purpose" TEXT NOT NULL,
  "resource_id" UUID NOT NULL,
  "quarantine_path" TEXT NOT NULL,
  "destination_bucket" TEXT,
  "destination_path" TEXT,
  "mime_type" TEXT NOT NULL,
  "size_bytes" INTEGER NOT NULL,
  "sha256" TEXT,
  "status" "UploadStatus" NOT NULL DEFAULT 'QUARANTINED',
  "scanner_provider" TEXT,
  "scan_result" JSONB,
  "scanned_at" TIMESTAMPTZ,
  "promoted_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "upload_objects_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "upload_objects_positive_size" CHECK ("size_bytes" > 0 AND "size_bytes" <= 15728640)
);

CREATE UNIQUE INDEX "upload_objects_quarantine_path_key" ON "upload_objects"("quarantine_path");
CREATE UNIQUE INDEX "upload_objects_destination_path_key" ON "upload_objects"("destination_path");
CREATE INDEX "upload_objects_status_created_at_idx" ON "upload_objects"("status", "created_at");
CREATE INDEX "upload_objects_owner_id_purpose_resource_id_idx" ON "upload_objects"("owner_id", "purpose", "resource_id");
