-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('RECEIVED', 'TRIAGING', 'IN_REVIEW', 'ACTION_REQUIRED', 'RESOLVED', 'CLOSED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SupportCaseStatus" AS ENUM ('OPEN', 'WAITING_CUSTOMER', 'WAITING_OPERATIONS', 'ESCALATED', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "LedgerEntryType" AS ENUM ('PAYMENT', 'REFUND', 'PAYOUT', 'ADJUSTMENT', 'TAX', 'FEE', 'CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "SitterHoldStatus" AS ENUM ('ACTIVE', 'RELEASED', 'EXPIRED');

-- CreateTable
CREATE TABLE "admin_permissions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "permission" TEXT NOT NULL,
    "scope" JSONB,
    "status" "GateStatus" NOT NULL DEFAULT 'ACTIVE',
    "granted_by" UUID NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "reason" TEXT NOT NULL,

    CONSTRAINT "admin_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "household_members" (
    "customer_id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "role" TEXT NOT NULL,
    "status" "GateStatus" NOT NULL DEFAULT 'DRAFT',
    "invited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "household_members_pkey" PRIMARY KEY ("customer_id","member_id")
);

-- CreateTable
CREATE TABLE "pet_media" (
    "id" UUID NOT NULL,
    "pet_id" UUID NOT NULL,
    "upload_id" UUID NOT NULL,
    "media_type" TEXT NOT NULL,
    "caption" TEXT,
    "status" "UploadStatus" NOT NULL DEFAULT 'QUARANTINED',
    "captured_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pet_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "care_instructions" (
    "id" UUID NOT NULL,
    "pet_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "instructions" JSONB NOT NULL,
    "active_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active_until" TIMESTAMP(3),
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "care_instructions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medications" (
    "id" UUID NOT NULL,
    "pet_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "administration" TEXT,
    "prescribed_by" TEXT,
    "starts_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vaccinations" (
    "id" UUID NOT NULL,
    "pet_id" UUID NOT NULL,
    "vaccine" TEXT NOT NULL,
    "administered_at" DATE NOT NULL,
    "next_due_at" DATE,
    "clinic" TEXT,
    "evidence_ref" TEXT,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vaccinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet_health_events" (
    "id" UUID NOT NULL,
    "pet_id" UUID NOT NULL,
    "event_type" TEXT NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "details" JSONB,
    "provider_ref" TEXT,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pet_health_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet_risk_factors" (
    "id" UUID NOT NULL,
    "assessment_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "severity" "RiskLevel" NOT NULL,
    "evidence" JSONB,
    "mitigation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pet_risk_factors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sitter_applications" (
    "id" UUID NOT NULL,
    "sitter_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "status" "SitterStatus" NOT NULL DEFAULT 'APPLICANT',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_by" UUID,
    "reviewed_at" TIMESTAMP(3),
    "decision_notes" TEXT,

    CONSTRAINT "sitter_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practical_assessments" (
    "id" UUID NOT NULL,
    "sitter_id" UUID NOT NULL,
    "assessor_id" UUID NOT NULL,
    "service_code" "ServiceCode" NOT NULL,
    "rubric" JSONB NOT NULL,
    "score" INTEGER NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "assessed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "practical_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boarding_properties" (
    "id" UUID NOT NULL,
    "sitter_id" UUID NOT NULL,
    "address_id" UUID NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "assessment" JSONB NOT NULL,
    "evidence" JSONB,
    "assessed_by" UUID,
    "assessed_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "boarding_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reliability_scores" (
    "id" UUID NOT NULL,
    "sitter_id" UUID NOT NULL,
    "score" DECIMAL(5,2) NOT NULL,
    "components" JSONB NOT NULL,
    "window_start" TIMESTAMP(3) NOT NULL,
    "window_end" TIMESTAMP(3) NOT NULL,
    "calculated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reliability_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_variants" (
    "id" UUID NOT NULL,
    "service_type_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration_minutes" INTEGER,
    "attributes" JSONB,
    "status" "GateStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_prices" (
    "id" UUID NOT NULL,
    "service_type_id" UUID NOT NULL,
    "variant_id" UUID,
    "service_area_id" UUID,
    "version" INTEGER NOT NULL,
    "amount_paise" INTEGER NOT NULL,
    "sitter_paise" INTEGER NOT NULL,
    "tax_basis_points" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "effective_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3),
    "approved_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_instructions" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "instructions" JSONB NOT NULL,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_instructions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_quotes" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "service_price_id" UUID,
    "subtotal_paise" INTEGER NOT NULL,
    "tax_paise" INTEGER NOT NULL,
    "total_paise" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "breakdown" JSONB NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "accepted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaints" (
    "id" UUID NOT NULL,
    "reference" TEXT NOT NULL,
    "booking_id" UUID,
    "customer_id" UUID NOT NULL,
    "sitter_id" UUID,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "IncidentSeverity" NOT NULL,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'RECEIVED',
    "assigned_to" UUID,
    "resolution" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "complaints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communication_preferences" (
    "user_id" UUID NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "purpose" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "quiet_hours" JSONB,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "communication_preferences_pkey" PRIMARY KEY ("user_id","channel","purpose")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en-IN',
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "variables" JSONB NOT NULL,
    "status" "GateStatus" NOT NULL DEFAULT 'DRAFT',
    "approved_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_cases" (
    "id" UUID NOT NULL,
    "reference" TEXT NOT NULL,
    "user_id" UUID,
    "booking_id" UUID,
    "category" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "IncidentSeverity" NOT NULL DEFAULT 'LOW',
    "status" "SupportCaseStatus" NOT NULL DEFAULT 'OPEN',
    "assigned_to" UUID,
    "resolution" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "support_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payout_adjustments" (
    "id" UUID NOT NULL,
    "payout_id" UUID NOT NULL,
    "amount_paise" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "approved_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payout_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_entries" (
    "id" UUID NOT NULL,
    "entry_type" "LedgerEntryType" NOT NULL,
    "account" TEXT NOT NULL,
    "amount_paise" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "reference_type" TEXT NOT NULL,
    "reference_id" TEXT NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "metadata" JSONB,
    "posted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reconciliation_runs" (
    "id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "expected" JSONB,
    "actual" JSONB,
    "differences" JSONB,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "approved_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reconciliation_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incident_evidence" (
    "id" UUID NOT NULL,
    "incident_id" UUID NOT NULL,
    "upload_id" UUID NOT NULL,
    "evidence_type" TEXT NOT NULL,
    "description" TEXT,
    "status" "UploadStatus" NOT NULL DEFAULT 'QUARANTINED',
    "collected_by" UUID NOT NULL,
    "collected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incident_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incident_notifications" (
    "id" UUID NOT NULL,
    "incident_id" UUID NOT NULL,
    "recipient_type" TEXT NOT NULL,
    "recipient_ref" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'QUEUED',
    "notification_id" UUID,
    "sent_at" TIMESTAMP(3),
    "acknowledged_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incident_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sitter_holds" (
    "id" UUID NOT NULL,
    "sitter_id" UUID NOT NULL,
    "incident_id" UUID,
    "status" "SitterHoldStatus" NOT NULL DEFAULT 'ACTIVE',
    "reason" TEXT NOT NULL,
    "placed_by" UUID NOT NULL,
    "placed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "released_by" UUID,
    "released_at" TIMESTAMP(3),
    "release_reason" TEXT,

    CONSTRAINT "sitter_holds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_events" (
    "id" UUID NOT NULL,
    "subscription_id" UUID NOT NULL,
    "provider_event_id" TEXT,
    "event_type" TEXT NOT NULL,
    "status_before" "SubscriptionStatus",
    "status_after" "SubscriptionStatus" NOT NULL,
    "payload_hash" TEXT,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authors" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "slug" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "bio" TEXT,
    "credentials" TEXT,
    "avatar_path" TEXT,
    "status" "GateStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "city_pages" (
    "id" UUID NOT NULL,
    "city_id" UUID NOT NULL,
    "content_entry_id" UUID NOT NULL,
    "page_type" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),

    CONSTRAINT "city_pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_permissions_permission_status_idx" ON "admin_permissions"("permission", "status");

-- CreateIndex
CREATE UNIQUE INDEX "admin_permissions_user_id_permission_key" ON "admin_permissions"("user_id", "permission");

-- CreateIndex
CREATE INDEX "household_members_member_id_status_idx" ON "household_members"("member_id", "status");

-- CreateIndex
CREATE INDEX "pet_media_pet_id_status_created_at_idx" ON "pet_media"("pet_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "care_instructions_pet_id_active_from_active_until_idx" ON "care_instructions"("pet_id", "active_from", "active_until");

-- CreateIndex
CREATE UNIQUE INDEX "care_instructions_pet_id_version_key" ON "care_instructions"("pet_id", "version");

-- CreateIndex
CREATE INDEX "medications_pet_id_active_idx" ON "medications"("pet_id", "active");

-- CreateIndex
CREATE INDEX "vaccinations_pet_id_administered_at_idx" ON "vaccinations"("pet_id", "administered_at");

-- CreateIndex
CREATE INDEX "pet_health_events_pet_id_occurred_at_idx" ON "pet_health_events"("pet_id", "occurred_at");

-- CreateIndex
CREATE INDEX "pet_risk_factors_code_severity_idx" ON "pet_risk_factors"("code", "severity");

-- CreateIndex
CREATE UNIQUE INDEX "pet_risk_factors_assessment_id_code_key" ON "pet_risk_factors"("assessment_id", "code");

-- CreateIndex
CREATE INDEX "sitter_applications_status_submitted_at_idx" ON "sitter_applications"("status", "submitted_at");

-- CreateIndex
CREATE UNIQUE INDEX "sitter_applications_sitter_id_version_key" ON "sitter_applications"("sitter_id", "version");

-- CreateIndex
CREATE INDEX "practical_assessments_sitter_id_service_code_assessed_at_idx" ON "practical_assessments"("sitter_id", "service_code", "assessed_at");

-- CreateIndex
CREATE INDEX "boarding_properties_status_expires_at_idx" ON "boarding_properties"("status", "expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "boarding_properties_sitter_id_address_id_key" ON "boarding_properties"("sitter_id", "address_id");

-- CreateIndex
CREATE INDEX "reliability_scores_sitter_id_calculated_at_idx" ON "reliability_scores"("sitter_id", "calculated_at");

-- CreateIndex
CREATE UNIQUE INDEX "reliability_scores_sitter_id_window_start_window_end_key" ON "reliability_scores"("sitter_id", "window_start", "window_end");

-- CreateIndex
CREATE INDEX "service_variants_service_type_id_status_idx" ON "service_variants"("service_type_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "service_variants_service_type_id_key_key" ON "service_variants"("service_type_id", "key");

-- CreateIndex
CREATE INDEX "service_prices_service_type_id_effective_at_expires_at_idx" ON "service_prices"("service_type_id", "effective_at", "expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "service_prices_service_type_id_variant_id_service_area_id_v_key" ON "service_prices"("service_type_id", "variant_id", "service_area_id", "version");

-- CreateIndex
CREATE INDEX "booking_instructions_booking_id_created_at_idx" ON "booking_instructions"("booking_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "booking_instructions_booking_id_version_key" ON "booking_instructions"("booking_id", "version");

-- CreateIndex
CREATE INDEX "price_quotes_booking_id_created_at_idx" ON "price_quotes"("booking_id", "created_at");

-- CreateIndex
CREATE INDEX "price_quotes_expires_at_accepted_at_idx" ON "price_quotes"("expires_at", "accepted_at");

-- CreateIndex
CREATE UNIQUE INDEX "complaints_reference_key" ON "complaints"("reference");

-- CreateIndex
CREATE INDEX "complaints_status_severity_created_at_idx" ON "complaints"("status", "severity", "created_at");

-- CreateIndex
CREATE INDEX "complaints_customer_id_created_at_idx" ON "complaints"("customer_id", "created_at");

-- CreateIndex
CREATE INDEX "templates_key_status_idx" ON "templates"("key", "status");

-- CreateIndex
CREATE UNIQUE INDEX "templates_key_version_channel_locale_key" ON "templates"("key", "version", "channel", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "support_cases_reference_key" ON "support_cases"("reference");

-- CreateIndex
CREATE INDEX "support_cases_status_priority_created_at_idx" ON "support_cases"("status", "priority", "created_at");

-- CreateIndex
CREATE INDEX "support_cases_user_id_created_at_idx" ON "support_cases"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "payout_adjustments_payout_id_created_at_idx" ON "payout_adjustments"("payout_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ledger_entries_idempotency_key_key" ON "ledger_entries"("idempotency_key");

-- CreateIndex
CREATE INDEX "ledger_entries_account_posted_at_idx" ON "ledger_entries"("account", "posted_at");

-- CreateIndex
CREATE INDEX "ledger_entries_reference_type_reference_id_idx" ON "ledger_entries"("reference_type", "reference_id");

-- CreateIndex
CREATE INDEX "reconciliation_runs_status_period_end_idx" ON "reconciliation_runs"("status", "period_end");

-- CreateIndex
CREATE UNIQUE INDEX "reconciliation_runs_provider_period_start_period_end_key" ON "reconciliation_runs"("provider", "period_start", "period_end");

-- CreateIndex
CREATE INDEX "incident_evidence_incident_id_status_collected_at_idx" ON "incident_evidence"("incident_id", "status", "collected_at");

-- CreateIndex
CREATE INDEX "incident_notifications_incident_id_status_created_at_idx" ON "incident_notifications"("incident_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "sitter_holds_sitter_id_status_placed_at_idx" ON "sitter_holds"("sitter_id", "status", "placed_at");

-- CreateIndex
CREATE INDEX "sitter_holds_incident_id_status_idx" ON "sitter_holds"("incident_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_events_provider_event_id_key" ON "subscription_events"("provider_event_id");

-- CreateIndex
CREATE INDEX "subscription_events_subscription_id_occurred_at_idx" ON "subscription_events"("subscription_id", "occurred_at");

-- CreateIndex
CREATE UNIQUE INDEX "authors_user_id_key" ON "authors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "authors_slug_key" ON "authors"("slug");

-- CreateIndex
CREATE INDEX "authors_status_display_name_idx" ON "authors"("status", "display_name");

-- CreateIndex
CREATE UNIQUE INDEX "city_pages_content_entry_id_key" ON "city_pages"("content_entry_id");

-- CreateIndex
CREATE INDEX "city_pages_status_published_at_idx" ON "city_pages"("status", "published_at");

-- CreateIndex
CREATE UNIQUE INDEX "city_pages_city_id_page_type_key" ON "city_pages"("city_id", "page_type");

-- AddForeignKey
ALTER TABLE "admin_permissions" ADD CONSTRAINT "admin_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "household_members" ADD CONSTRAINT "household_members_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "household_members" ADD CONSTRAINT "household_members_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_media" ADD CONSTRAINT "pet_media_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_media" ADD CONSTRAINT "pet_media_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "upload_objects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "care_instructions" ADD CONSTRAINT "care_instructions_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medications" ADD CONSTRAINT "medications_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_health_events" ADD CONSTRAINT "pet_health_events_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_risk_factors" ADD CONSTRAINT "pet_risk_factors_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "pet_risk_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sitter_applications" ADD CONSTRAINT "sitter_applications_sitter_id_fkey" FOREIGN KEY ("sitter_id") REFERENCES "sitter_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practical_assessments" ADD CONSTRAINT "practical_assessments_sitter_id_fkey" FOREIGN KEY ("sitter_id") REFERENCES "sitter_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boarding_properties" ADD CONSTRAINT "boarding_properties_sitter_id_fkey" FOREIGN KEY ("sitter_id") REFERENCES "sitter_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boarding_properties" ADD CONSTRAINT "boarding_properties_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reliability_scores" ADD CONSTRAINT "reliability_scores_sitter_id_fkey" FOREIGN KEY ("sitter_id") REFERENCES "sitter_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_variants" ADD CONSTRAINT "service_variants_service_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_prices" ADD CONSTRAINT "service_prices_service_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_prices" ADD CONSTRAINT "service_prices_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "service_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_prices" ADD CONSTRAINT "service_prices_service_area_id_fkey" FOREIGN KEY ("service_area_id") REFERENCES "service_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_instructions" ADD CONSTRAINT "booking_instructions_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_quotes" ADD CONSTRAINT "price_quotes_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_quotes" ADD CONSTRAINT "price_quotes_service_price_id_fkey" FOREIGN KEY ("service_price_id") REFERENCES "service_prices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_sitter_id_fkey" FOREIGN KEY ("sitter_id") REFERENCES "sitter_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communication_preferences" ADD CONSTRAINT "communication_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_cases" ADD CONSTRAINT "support_cases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_cases" ADD CONSTRAINT "support_cases_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_adjustments" ADD CONSTRAINT "payout_adjustments_payout_id_fkey" FOREIGN KEY ("payout_id") REFERENCES "payouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_evidence" ADD CONSTRAINT "incident_evidence_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_evidence" ADD CONSTRAINT "incident_evidence_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "upload_objects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_notifications" ADD CONSTRAINT "incident_notifications_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sitter_holds" ADD CONSTRAINT "sitter_holds_sitter_id_fkey" FOREIGN KEY ("sitter_id") REFERENCES "sitter_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sitter_holds" ADD CONSTRAINT "sitter_holds_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_events" ADD CONSTRAINT "subscription_events_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "city_pages" ADD CONSTRAINT "city_pages_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "city_pages" ADD CONSTRAINT "city_pages_content_entry_id_fkey" FOREIGN KEY ("content_entry_id") REFERENCES "content_entries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Retain database-side UUID generation for trusted jobs and incident tooling.
ALTER TABLE "admin_permissions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "pet_media" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "care_instructions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "medications" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "vaccinations" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "pet_health_events" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "pet_risk_factors" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "sitter_applications" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "practical_assessments" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "boarding_properties" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "reliability_scores" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "service_variants" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "service_prices" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "booking_instructions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "price_quotes" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "complaints" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "templates" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "support_cases" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "payout_adjustments" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "ledger_entries" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "reconciliation_runs" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "incident_evidence" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "incident_notifications" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "sitter_holds" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "subscription_events" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "authors" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "city_pages" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- Cross-field invariants remain enforceable outside application code.
ALTER TABLE "household_members" ADD CONSTRAINT "household_members_distinct_users_check" CHECK ("customer_id" <> "member_id");
ALTER TABLE "care_instructions" ADD CONSTRAINT "care_instructions_window_check" CHECK ("active_until" IS NULL OR "active_until" > "active_from");
ALTER TABLE "medications" ADD CONSTRAINT "medications_window_check" CHECK ("ends_at" IS NULL OR "starts_at" IS NULL OR "ends_at" > "starts_at");
ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_due_check" CHECK ("next_due_at" IS NULL OR "next_due_at" > "administered_at");
ALTER TABLE "practical_assessments" ADD CONSTRAINT "practical_assessments_score_check" CHECK ("score" BETWEEN 0 AND 100);
ALTER TABLE "boarding_properties" ADD CONSTRAINT "boarding_properties_capacity_check" CHECK ("capacity" BETWEEN 1 AND 20);
ALTER TABLE "reliability_scores" ADD CONSTRAINT "reliability_scores_value_window_check" CHECK ("score" BETWEEN 0 AND 100 AND "window_end" > "window_start");
ALTER TABLE "service_prices" ADD CONSTRAINT "service_prices_amount_window_check" CHECK ("amount_paise" >= 0 AND "sitter_paise" >= 0 AND "sitter_paise" <= "amount_paise" AND "tax_basis_points" BETWEEN 0 AND 10000 AND ("expires_at" IS NULL OR "expires_at" > "effective_at"));
ALTER TABLE "price_quotes" ADD CONSTRAINT "price_quotes_amount_expiry_check" CHECK ("subtotal_paise" >= 0 AND "tax_paise" >= 0 AND "total_paise" >= 0 AND "expires_at" > "created_at" AND ("accepted_at" IS NULL OR "accepted_at" <= "expires_at"));
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_resolution_check" CHECK (("status" NOT IN ('RESOLVED', 'CLOSED')) OR ("resolution" IS NOT NULL AND "resolved_at" IS NOT NULL));
ALTER TABLE "support_cases" ADD CONSTRAINT "support_cases_resolution_check" CHECK (("status" NOT IN ('RESOLVED', 'CLOSED')) OR ("resolution" IS NOT NULL AND "resolved_at" IS NOT NULL));
ALTER TABLE "payout_adjustments" ADD CONSTRAINT "payout_adjustments_nonzero_check" CHECK ("amount_paise" <> 0);
ALTER TABLE "reconciliation_runs" ADD CONSTRAINT "reconciliation_runs_window_check" CHECK ("period_end" > "period_start");
ALTER TABLE "sitter_holds" ADD CONSTRAINT "sitter_holds_release_check" CHECK (("status" = 'ACTIVE' AND "released_at" IS NULL) OR ("status" <> 'ACTIVE' AND "released_at" IS NOT NULL AND "released_by" IS NOT NULL AND "release_reason" IS NOT NULL));
ALTER TABLE "city_pages" ADD CONSTRAINT "city_pages_publish_check" CHECK ("status" <> 'PUBLISHED' OR "published_at" IS NOT NULL);

-- Canonical operational records are server-only until purpose-specific policies
-- are explicitly reviewed. No catch-all authenticated policy is created here.
REVOKE ALL ON public.admin_permissions, public.household_members, public.pet_media,
  public.care_instructions, public.medications, public.vaccinations, public.pet_health_events, public.pet_risk_factors,
  public.sitter_applications, public.practical_assessments, public.boarding_properties, public.reliability_scores,
  public.service_variants, public.service_prices, public.booking_instructions, public.price_quotes,
  public.complaints, public.communication_preferences, public.templates, public.support_cases,
  public.payout_adjustments, public.ledger_entries, public.reconciliation_runs,
  public.incident_evidence, public.incident_notifications, public.sitter_holds,
  public.subscription_events, public.authors, public.city_pages
FROM anon, authenticated;

ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_health_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_risk_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sitter_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practical_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boarding_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reliability_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reconciliation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sitter_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_pages ENABLE ROW LEVEL SECURITY;
