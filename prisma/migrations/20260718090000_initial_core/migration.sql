-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'SITTER', 'OPERATIONS_ADMIN', 'VERIFICATION_ADMIN', 'SAFETY_ADMIN', 'FINANCE_ADMIN', 'CONTENT_ADMIN', 'SOCIETY_MANAGER', 'PARTNER_MANAGER', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'PENDING', 'SUSPENDED', 'DEACTIVATED', 'DELETION_REQUESTED');

-- CreateEnum
CREATE TYPE "SitterStatus" AS ENUM ('APPLICANT', 'UNDER_REVIEW', 'TRAINING', 'APPROVED', 'PAUSED', 'SUSPENDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('GREEN', 'YELLOW', 'RED', 'UNASSESSED');

-- CreateEnum
CREATE TYPE "ServiceCode" AS ENUM ('DOG_WALK_30', 'DOG_WALK_60', 'HOME_VISIT', 'HOME_SITTING_60', 'TRAVEL_SITTING', 'BOARDING_BETA', 'GROOMING_HOME', 'VET_SUPPORT', 'TRAINING_ASSESSMENT', 'PET_TAXI');

-- CreateEnum
CREATE TYPE "PermissionStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('DRAFT', 'REQUESTED', 'RISK_REVIEW', 'MATCHING', 'SITTER_PROPOSED', 'CUSTOMER_APPROVAL_PENDING', 'PAYMENT_PENDING', 'CONFIRMED', 'SITTER_EN_ROUTE', 'IN_PROGRESS', 'REPORT_PENDING', 'COMPLETED', 'CLOSED', 'DECLINED', 'CUSTOMER_CANCELLED', 'SITTER_CANCELLED', 'REPLACEMENT_REQUIRED', 'NO_SHOW', 'INCIDENT_HOLD');

-- CreateEnum
CREATE TYPE "AssignmentType" AS ENUM ('PRIMARY', 'BACKUP', 'REPLACEMENT');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('OFFERED', 'ACCEPTED', 'DECLINED', 'CUSTOMER_APPROVED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('CREATED', 'PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'CANCELLED', 'PARTIALLY_REFUNDED', 'REFUNDED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('REQUESTED', 'APPROVED', 'PROCESSING', 'COMPLETED', 'FAILED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'APPROVED', 'PROCESSING', 'PAID', 'HELD', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'PASSED', 'FAILED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('REPORTED', 'TRIAGING', 'ACTIVE_RESPONSE', 'VET_CONTACTED', 'TRANSPORTING', 'MONITORING', 'IMMEDIATE_RISK_RESOLVED', 'REVIEW_PENDING', 'CORRECTIVE_ACTION_OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "IncidentSeverity" AS ENUM ('LOW', 'MODERATE', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'WHATSAPP', 'SMS', 'PUSH', 'PHONE');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('QUEUED', 'SENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('INCOMPLETE', 'ACTIVE', 'PAUSED', 'GRACE', 'PAST_DUE', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "auth_user_id" UUID NOT NULL,
    "email" TEXT,
    "phone_e164" TEXT,
    "display_name" TEXT NOT NULL,
    "avatar_path" TEXT,
    "status" "AccountStatus" NOT NULL DEFAULT 'PENDING',
    "locale" TEXT NOT NULL DEFAULT 'en-IN',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" UUID NOT NULL,
    "role" "Role" NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "granted_by" UUID,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role")
);

-- CreateTable
CREATE TABLE "consents" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "purpose" TEXT NOT NULL,
    "policy_version" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "captured_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withdrawn_at" TIMESTAMP(3),
    "evidence" JSONB,

    CONSTRAINT "consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "preferred_language" TEXT NOT NULL DEFAULT 'en',
    "emergency_contact_name" TEXT,
    "emergency_contact_phone" TEXT,

    CONSTRAINT "customer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sitter_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" "SitterStatus" NOT NULL DEFAULT 'APPLICANT',
    "bio" TEXT,
    "years_experience" INTEGER NOT NULL DEFAULT 0,
    "service_radius_km" DECIMAL(5,2) NOT NULL DEFAULT 5,
    "reliability_score" DECIMAL(5,2),
    "application_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_at" TIMESTAMP(3),
    "suspended_at" TIMESTAMP(3),

    CONSTRAINT "sitter_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "label" TEXT NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "landmark" TEXT,
    "locality" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "country_code" TEXT NOT NULL DEFAULT 'IN',
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "geocode_provider" TEXT,
    "geocode_ref" TEXT,
    "access_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pets" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "breed" TEXT,
    "sex" TEXT,
    "birth_date" DATE,
    "weight_kg" DECIMAL(6,2),
    "sterilised" BOOLEAN,
    "photo_path" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet_medical_profiles" (
    "id" UUID NOT NULL,
    "pet_id" UUID NOT NULL,
    "allergies" TEXT,
    "conditions" TEXT,
    "medications" TEXT,
    "veterinarian_name" TEXT,
    "veterinarian_phone" TEXT,
    "emergency_clinic_name" TEXT,
    "emergency_clinic_phone" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pet_medical_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet_emergency_contacts" (
    "id" UUID NOT NULL,
    "pet_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "relation" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "pet_emergency_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet_risk_assessments" (
    "id" UUID NOT NULL,
    "pet_id" UUID NOT NULL,
    "service_code" "ServiceCode" NOT NULL,
    "suggested_level" "RiskLevel" NOT NULL DEFAULT 'UNASSESSED',
    "final_level" "RiskLevel" NOT NULL DEFAULT 'UNASSESSED',
    "factors" JSONB NOT NULL,
    "reviewed_by" UUID,
    "reviewed_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pet_risk_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_types" (
    "id" UUID NOT NULL,
    "code" "ServiceCode" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration_minutes" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "requires_manual_match" BOOLEAN NOT NULL DEFAULT true,
    "requires_property" BOOLEAN NOT NULL DEFAULT false,
    "base_price_paise" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',

    CONSTRAINT "service_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sitter_service_permissions" (
    "id" UUID NOT NULL,
    "sitter_id" UUID NOT NULL,
    "service_type_id" UUID NOT NULL,
    "status" "PermissionStatus" NOT NULL DEFAULT 'PENDING',
    "risk_limit" "RiskLevel" NOT NULL DEFAULT 'GREEN',
    "granted_by" UUID,
    "granted_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "reason" TEXT,

    CONSTRAINT "sitter_service_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availability_rules" (
    "id" UUID NOT NULL,
    "sitter_id" UUID NOT NULL,
    "weekday" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "availability_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availability_exceptions" (
    "id" UUID NOT NULL,
    "sitter_id" UUID NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "available" BOOLEAN NOT NULL,
    "reason" TEXT,

    CONSTRAINT "availability_exceptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sitter_verifications" (
    "id" UUID NOT NULL,
    "sitter_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT,
    "evidence_path" TEXT,
    "checked_by" UUID,
    "checked_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "public_label" TEXT,

    CONSTRAINT "sitter_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_modules" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "passing_score" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "training_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_attempts" (
    "id" UUID NOT NULL,
    "sitter_id" UUID NOT NULL,
    "module_id" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "attempted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" UUID NOT NULL,
    "reference" TEXT NOT NULL,
    "customer_id" UUID NOT NULL,
    "pet_id" UUID NOT NULL,
    "service_type_id" UUID NOT NULL,
    "address_id" UUID NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduled_start" TIMESTAMP(3) NOT NULL,
    "scheduled_end" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "customer_notes" TEXT,
    "quote_amount_paise" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "matching_notes" TEXT,
    "customer_approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_assignments" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "sitter_id" UUID NOT NULL,
    "type" "AssignmentType" NOT NULL DEFAULT 'PRIMARY',
    "status" "AssignmentStatus" NOT NULL DEFAULT 'OFFERED',
    "offered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "response_due_at" TIMESTAMP(3),
    "responded_at" TIMESTAMP(3),
    "activated_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "payout_paise" INTEGER NOT NULL,

    CONSTRAINT "booking_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_status_history" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "from_state" "BookingStatus",
    "to_state" "BookingStatus" NOT NULL,
    "actor_id" UUID,
    "reason" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_events" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "actor_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "notes" TEXT,
    "evidence" JSONB,

    CONSTRAINT "service_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracking_sessions" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "consent_basis" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "distance_m" INTEGER,

    CONSTRAINT "tracking_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracking_points" (
    "id" BIGSERIAL NOT NULL,
    "session_id" UUID NOT NULL,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "accuracy_m" DECIMAL(7,2),
    "recorded_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tracking_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'razorpay',
    "provider_order_id" TEXT NOT NULL,
    "provider_payment_id" TEXT,
    "amount_paise" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'CREATED',
    "signature_verified" BOOLEAN NOT NULL DEFAULT false,
    "captured_at" TIMESTAMP(3),
    "failure_code" TEXT,
    "failure_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_events" (
    "id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_event_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "payload_hash" TEXT NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),
    "processing_error" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "payment_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refunds" (
    "id" UUID NOT NULL,
    "payment_id" UUID NOT NULL,
    "provider_refund_id" TEXT,
    "amount_paise" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "RefundStatus" NOT NULL DEFAULT 'REQUESTED',
    "requested_by" UUID NOT NULL,
    "approved_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "refunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payouts" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "sitter_id" UUID NOT NULL,
    "amount_paise" INTEGER NOT NULL,
    "adjustment_paise" INTEGER NOT NULL DEFAULT 0,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "provider_ref" TEXT,
    "approved_by" UUID,
    "approved_at" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_reports" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "submitted_by" UUID NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "fields" JSONB NOT NULL,
    "concern_flag" BOOLEAN NOT NULL DEFAULT false,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),

    CONSTRAINT "booking_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_media" (
    "id" UUID NOT NULL,
    "report_id" UUID NOT NULL,
    "object_path" TEXT NOT NULL,
    "media_type" TEXT NOT NULL,
    "captured_at" TIMESTAMP(3),

    CONSTRAINT "report_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "body" TEXT,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "consented_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidents" (
    "id" UUID NOT NULL,
    "reference" TEXT NOT NULL,
    "booking_id" UUID NOT NULL,
    "pet_id" UUID NOT NULL,
    "sitter_id" UUID,
    "customer_id" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "severity" "IncidentSeverity" NOT NULL,
    "status" "IncidentStatus" NOT NULL DEFAULT 'REPORTED',
    "description" TEXT NOT NULL,
    "observed_symptoms" TEXT,
    "detected_at" TIMESTAMP(3) NOT NULL,
    "resolved_at" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),
    "closed_by" UUID,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incident_events" (
    "id" UUID NOT NULL,
    "incident_id" UUID NOT NULL,
    "actor_id" UUID,
    "type" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incident_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corrective_actions" (
    "id" UUID NOT NULL,
    "incident_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "owner_id" UUID NOT NULL,
    "due_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "evidence" JSONB,

    CONSTRAINT "corrective_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_outbox" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "channel" "NotificationChannel" NOT NULL,
    "template_key" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'QUEUED',
    "idempotency_key" TEXT NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent_at" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "last_error" TEXT,

    CONSTRAINT "notification_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_deliveries" (
    "id" UUID NOT NULL,
    "notification_id" UUID NOT NULL,
    "provider_message_id" TEXT,
    "status" "NotificationStatus" NOT NULL,
    "provider_payload" JSONB,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "key" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "rules" JSONB,
    "updated_by" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "societies" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "contact_name" TEXT,
    "contact_phone" TEXT,
    "agreement_at" TIMESTAMP(3),
    "pilot_starts_at" TIMESTAMP(3),
    "pilot_ends_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "societies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "society_members" (
    "society_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "unit_ref" TEXT,
    "verified_at" TIMESTAMP(3),
    "status" TEXT NOT NULL,

    CONSTRAINT "society_members_pkey" PRIMARY KEY ("society_id","user_id")
);

-- CreateTable
CREATE TABLE "plan_versions" (
    "id" UUID NOT NULL,
    "plan_key" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "price_paise" INTEGER NOT NULL,
    "billing_interval" TEXT NOT NULL,
    "entitlements" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plan_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "plan_version_id" UUID NOT NULL,
    "provider_subscription_id" TEXT,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'INCOMPLETE',
    "current_period_start" TIMESTAMP(3),
    "current_period_end" TIMESTAMP(3),
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entitlement_ledger" (
    "id" UUID NOT NULL,
    "subscription_id" UUID NOT NULL,
    "entitlement_key" TEXT NOT NULL,
    "delta" INTEGER NOT NULL,
    "balance_after" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "reference_type" TEXT,
    "reference_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entitlement_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_entries" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "body" JSONB NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "primary_job" TEXT NOT NULL,
    "city" TEXT,
    "service_code" "ServiceCode",
    "author_id" UUID NOT NULL,
    "expert_review_id" UUID,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" BIGSERIAL NOT NULL,
    "actor_id" UUID,
    "actor_role" "Role",
    "action" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "reason" TEXT,
    "ip_hash" TEXT,
    "request_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_user_id_key" ON "users"("auth_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_e164_key" ON "users"("phone_e164");

-- CreateIndex
CREATE INDEX "consents_user_id_purpose_idx" ON "consents"("user_id", "purpose");

-- CreateIndex
CREATE UNIQUE INDEX "customer_profiles_user_id_key" ON "customer_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "sitter_profiles_user_id_key" ON "sitter_profiles"("user_id");

-- CreateIndex
CREATE INDEX "sitter_profiles_status_idx" ON "sitter_profiles"("status");

-- CreateIndex
CREATE INDEX "addresses_city_locality_idx" ON "addresses"("city", "locality");

-- CreateIndex
CREATE INDEX "pets_owner_id_active_idx" ON "pets"("owner_id", "active");

-- CreateIndex
CREATE UNIQUE INDEX "pet_medical_profiles_pet_id_key" ON "pet_medical_profiles"("pet_id");

-- CreateIndex
CREATE INDEX "pet_emergency_contacts_pet_id_priority_idx" ON "pet_emergency_contacts"("pet_id", "priority");

-- CreateIndex
CREATE INDEX "pet_risk_assessments_pet_id_service_code_created_at_idx" ON "pet_risk_assessments"("pet_id", "service_code", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "service_types_code_key" ON "service_types"("code");

-- CreateIndex
CREATE INDEX "sitter_service_permissions_service_type_id_status_idx" ON "sitter_service_permissions"("service_type_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "sitter_service_permissions_sitter_id_service_type_id_key" ON "sitter_service_permissions"("sitter_id", "service_type_id");

-- CreateIndex
CREATE INDEX "availability_rules_sitter_id_weekday_idx" ON "availability_rules"("sitter_id", "weekday");

-- CreateIndex
CREATE INDEX "availability_exceptions_sitter_id_starts_at_ends_at_idx" ON "availability_exceptions"("sitter_id", "starts_at", "ends_at");

-- CreateIndex
CREATE INDEX "sitter_verifications_sitter_id_type_status_idx" ON "sitter_verifications"("sitter_id", "type", "status");

-- CreateIndex
CREATE UNIQUE INDEX "training_modules_slug_key" ON "training_modules"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "training_modules_slug_version_key" ON "training_modules"("slug", "version");

-- CreateIndex
CREATE INDEX "training_attempts_sitter_id_module_id_attempted_at_idx" ON "training_attempts"("sitter_id", "module_id", "attempted_at");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_reference_key" ON "bookings"("reference");

-- CreateIndex
CREATE INDEX "bookings_customer_id_created_at_idx" ON "bookings"("customer_id", "created_at");

-- CreateIndex
CREATE INDEX "bookings_status_scheduled_start_idx" ON "bookings"("status", "scheduled_start");

-- CreateIndex
CREATE INDEX "bookings_service_type_id_scheduled_start_idx" ON "bookings"("service_type_id", "scheduled_start");

-- CreateIndex
CREATE INDEX "booking_assignments_booking_id_type_status_idx" ON "booking_assignments"("booking_id", "type", "status");

-- CreateIndex
CREATE INDEX "booking_assignments_sitter_id_status_idx" ON "booking_assignments"("sitter_id", "status");

-- CreateIndex
CREATE INDEX "booking_status_history_booking_id_created_at_idx" ON "booking_status_history"("booking_id", "created_at");

-- CreateIndex
CREATE INDEX "service_events_booking_id_occurred_at_idx" ON "service_events"("booking_id", "occurred_at");

-- CreateIndex
CREATE INDEX "tracking_sessions_booking_id_started_at_idx" ON "tracking_sessions"("booking_id", "started_at");

-- CreateIndex
CREATE INDEX "tracking_points_session_id_recorded_at_idx" ON "tracking_points"("session_id", "recorded_at");

-- CreateIndex
CREATE UNIQUE INDEX "payments_provider_order_id_key" ON "payments"("provider_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_provider_payment_id_key" ON "payments"("provider_payment_id");

-- CreateIndex
CREATE INDEX "payments_booking_id_status_idx" ON "payments"("booking_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "payment_events_provider_event_id_key" ON "payment_events"("provider_event_id");

-- CreateIndex
CREATE INDEX "payment_events_processed_at_received_at_idx" ON "payment_events"("processed_at", "received_at");

-- CreateIndex
CREATE UNIQUE INDEX "refunds_provider_refund_id_key" ON "refunds"("provider_refund_id");

-- CreateIndex
CREATE INDEX "refunds_payment_id_status_idx" ON "refunds"("payment_id", "status");

-- CreateIndex
CREATE INDEX "payouts_sitter_id_status_idx" ON "payouts"("sitter_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "payouts_booking_id_sitter_id_key" ON "payouts"("booking_id", "sitter_id");

-- CreateIndex
CREATE UNIQUE INDEX "booking_reports_booking_id_version_key" ON "booking_reports"("booking_id", "version");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_booking_id_key" ON "reviews"("booking_id");

-- CreateIndex
CREATE INDEX "reviews_customer_id_created_at_idx" ON "reviews"("customer_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "incidents_reference_key" ON "incidents"("reference");

-- CreateIndex
CREATE INDEX "incidents_status_severity_detected_at_idx" ON "incidents"("status", "severity", "detected_at");

-- CreateIndex
CREATE INDEX "incidents_booking_id_idx" ON "incidents"("booking_id");

-- CreateIndex
CREATE INDEX "incident_events_incident_id_occurred_at_idx" ON "incident_events"("incident_id", "occurred_at");

-- CreateIndex
CREATE INDEX "corrective_actions_incident_id_completed_at_idx" ON "corrective_actions"("incident_id", "completed_at");

-- CreateIndex
CREATE UNIQUE INDEX "notification_outbox_idempotency_key_key" ON "notification_outbox"("idempotency_key");

-- CreateIndex
CREATE INDEX "notification_outbox_status_scheduled_at_idx" ON "notification_outbox"("status", "scheduled_at");

-- CreateIndex
CREATE INDEX "notification_deliveries_notification_id_occurred_at_idx" ON "notification_deliveries"("notification_id", "occurred_at");

-- CreateIndex
CREATE UNIQUE INDEX "societies_slug_key" ON "societies"("slug");

-- CreateIndex
CREATE INDEX "societies_city_locality_status_idx" ON "societies"("city", "locality", "status");

-- CreateIndex
CREATE UNIQUE INDEX "plan_versions_plan_key_version_key" ON "plan_versions"("plan_key", "version");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_provider_subscription_id_key" ON "subscriptions"("provider_subscription_id");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_status_idx" ON "subscriptions"("user_id", "status");

-- CreateIndex
CREATE INDEX "entitlement_ledger_subscription_id_entitlement_key_created__idx" ON "entitlement_ledger"("subscription_id", "entitlement_key", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "content_entries_slug_key" ON "content_entries"("slug");

-- CreateIndex
CREATE INDEX "content_entries_status_published_at_idx" ON "content_entries"("status", "published_at");

-- CreateIndex
CREATE INDEX "content_entries_city_service_code_idx" ON "content_entries"("city", "service_code");

-- CreateIndex
CREATE INDEX "audit_logs_resource_type_resource_id_created_at_idx" ON "audit_logs"("resource_type", "resource_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_actor_id_created_at_idx" ON "audit_logs"("actor_id", "created_at");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consents" ADD CONSTRAINT "consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_profiles" ADD CONSTRAINT "customer_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sitter_profiles" ADD CONSTRAINT "sitter_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_medical_profiles" ADD CONSTRAINT "pet_medical_profiles_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_emergency_contacts" ADD CONSTRAINT "pet_emergency_contacts_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_risk_assessments" ADD CONSTRAINT "pet_risk_assessments_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sitter_service_permissions" ADD CONSTRAINT "sitter_service_permissions_sitter_id_fkey" FOREIGN KEY ("sitter_id") REFERENCES "sitter_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sitter_service_permissions" ADD CONSTRAINT "sitter_service_permissions_service_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_rules" ADD CONSTRAINT "availability_rules_sitter_id_fkey" FOREIGN KEY ("sitter_id") REFERENCES "sitter_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_exceptions" ADD CONSTRAINT "availability_exceptions_sitter_id_fkey" FOREIGN KEY ("sitter_id") REFERENCES "sitter_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sitter_verifications" ADD CONSTRAINT "sitter_verifications_sitter_id_fkey" FOREIGN KEY ("sitter_id") REFERENCES "sitter_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_attempts" ADD CONSTRAINT "training_attempts_sitter_id_fkey" FOREIGN KEY ("sitter_id") REFERENCES "sitter_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_attempts" ADD CONSTRAINT "training_attempts_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "training_modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_service_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_assignments" ADD CONSTRAINT "booking_assignments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_assignments" ADD CONSTRAINT "booking_assignments_sitter_id_fkey" FOREIGN KEY ("sitter_id") REFERENCES "sitter_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_status_history" ADD CONSTRAINT "booking_status_history_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_events" ADD CONSTRAINT "service_events_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_sessions" ADD CONSTRAINT "tracking_sessions_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_points" ADD CONSTRAINT "tracking_points_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "tracking_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_sitter_id_fkey" FOREIGN KEY ("sitter_id") REFERENCES "sitter_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_reports" ADD CONSTRAINT "booking_reports_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_media" ADD CONSTRAINT "report_media_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "booking_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_events" ADD CONSTRAINT "incident_events_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corrective_actions" ADD CONSTRAINT "corrective_actions_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_outbox" ADD CONSTRAINT "notification_outbox_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_deliveries" ADD CONSTRAINT "notification_deliveries_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notification_outbox"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "society_members" ADD CONSTRAINT "society_members_society_id_fkey" FOREIGN KEY ("society_id") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_version_id_fkey" FOREIGN KEY ("plan_version_id") REFERENCES "plan_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entitlement_ledger" ADD CONSTRAINT "entitlement_ledger_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
