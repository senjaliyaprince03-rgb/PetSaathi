CREATE TYPE "LeadType" AS ENUM ('GENERAL', 'BOOKING_HELP', 'SITTER_INTEREST', 'SOCIETY', 'PARTNER', 'SAFETY');
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PILOT_PROPOSED', 'CONVERTED', 'DISQUALIFIED');

CREATE TABLE "leads" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "type" "LeadType" NOT NULL,
  "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone_e164" TEXT,
  "organisation_name" TEXT,
  "city" TEXT NOT NULL DEFAULT 'Ahmedabad',
  "locality" TEXT,
  "message" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "consent_to_contact" BOOLEAN NOT NULL,
  "assigned_to" UUID,
  "metadata" JSONB,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "leads_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "leads_contact_required" CHECK ("email" IS NOT NULL OR "phone_e164" IS NOT NULL)
);

CREATE INDEX "leads_type_status_created_at_idx" ON "leads"("type", "status", "created_at");
CREATE INDEX "leads_city_locality_status_idx" ON "leads"("city", "locality", "status");
