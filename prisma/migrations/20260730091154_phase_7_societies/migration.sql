/*
  Warnings:

  - You are about to drop the column `cluster_id` on the `service_areas` table. All the data in the column will be lost.
  - You are about to drop the `clusters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "account_requests" DROP CONSTRAINT "account_requests_user_id_fkey";

-- DropForeignKey
ALTER TABLE "clusters" DROP CONSTRAINT "clusters_city_id_fkey";

-- DropForeignKey
ALTER TABLE "content_entries" DROP CONSTRAINT "content_entries_expert_review_id_fkey";

-- DropForeignKey
ALTER TABLE "content_versions" DROP CONSTRAINT "content_versions_content_id_fkey";

-- DropForeignKey
ALTER TABLE "partner_programmes" DROP CONSTRAINT "partner_programmes_contract_organization_fkey";

-- DropForeignKey
ALTER TABLE "programme_verification_tokens" DROP CONSTRAINT "programme_verification_tokens_membership_programme_fkey";

-- DropForeignKey
ALTER TABLE "service_areas" DROP CONSTRAINT "service_areas_cluster_id_fkey";

-- DropIndex
DROP INDEX "b2b_contracts_id_organization_id_key";

-- DropIndex
DROP INDEX "service_areas_city_id_cluster_id_status_idx";

-- DropIndex
DROP INDEX "sitter_profiles_service_locality_status_idx";

-- AlterTable
ALTER TABLE "account_requests" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "requested_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "verified_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "fulfilled_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "admin_permissions" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "authors" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "boarding_properties" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "booking_instructions" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "campaigns" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "capacity_limits" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "capacity_reservations" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "care_instructions" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "cities" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "city_pages" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "complaints" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "content_versions" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "entitlement_consumption" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "experiments" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "expert_reviews" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "reviewed_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "incident_evidence" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "incident_notifications" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "job_runs" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "leads" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ledger_entries" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "loyalty_ledger" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "medications" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "partner_locations" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "partner_orders" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "partner_services" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "partner_verifications" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "partners" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "payout_adjustments" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "pet_health_events" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "pet_media" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "pet_risk_factors" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "policy_versions" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "practical_assessments" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "price_quotes" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "programme_verification_tokens" ALTER COLUMN "expires_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "consumed_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "revoked_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "rate_limit_buckets" ALTER COLUMN "window_start" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "expires_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "reconciliation_runs" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "referrals" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "reliability_scores" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "retention_jobs" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "service_areas" DROP COLUMN "cluster_id",
ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "service_prices" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "service_variants" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "sitter_applications" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "sitter_holds" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "societies" ADD COLUMN     "address" TEXT,
ADD COLUMN     "booking_cap" INTEGER,
ADD COLUMN     "emergency_contact" TEXT,
ADD COLUMN     "facility_contact" TEXT,
ADD COLUMN     "geofence" JSONB,
ADD COLUMN     "partnership_model" TEXT,
ADD COLUMN     "security_contact" TEXT;

-- AlterTable
ALTER TABLE "society_events" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "society_partnerships" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "subscription_events" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "support_cases" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "templates" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "testimonial_consents" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "testimonials" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "upload_objects" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "scanned_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "promoted_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "vaccinations" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "webhook_events" ALTER COLUMN "id" DROP DEFAULT;

-- DropTable
DROP TABLE "clusters";

-- CreateTable
CREATE TABLE "society_access_rules" (
    "society_id" UUID NOT NULL,
    "visitor_approval_required" BOOLEAN NOT NULL DEFAULT true,
    "sitter_registration_required" BOOLEAN NOT NULL DEFAULT true,
    "identity_document_required" BOOLEAN NOT NULL DEFAULT true,
    "allowed_entry_times" JSONB,
    "approved_gates" TEXT[],
    "pet_lift_rules" TEXT,
    "replacement_sitter_process" TEXT,
    "emergency_entry_process" TEXT,
    "last_verified_at" TIMESTAMP(3),

    CONSTRAINT "society_access_rules_pkey" PRIMARY KEY ("society_id")
);

-- AddForeignKey
ALTER TABLE "account_requests" ADD CONSTRAINT "account_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "society_access_rules" ADD CONSTRAINT "society_access_rules_society_id_fkey" FOREIGN KEY ("society_id") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_entries" ADD CONSTRAINT "content_entries_expert_review_id_fkey" FOREIGN KEY ("expert_review_id") REFERENCES "expert_reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_entries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "programme_verification_tokens_expires_at_consumed_at_revoked_at" RENAME TO "programme_verification_tokens_expires_at_consumed_at_revoke_idx";
