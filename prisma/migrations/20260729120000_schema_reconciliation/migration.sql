-- Reconcile schema.prisma with the committed migration chain.
-- Generated from a disposable PostgreSQL 16 database, then made upgrade-safe:
-- existing rows/defaults are retained, clusters are not dropped, and the
-- separately versioned verification-token table remains in the next migration.

-- CreateEnum
CREATE TYPE "ConsentPurpose" AS ENUM ('PHOTO_USAGE', 'TESTIMONIAL', 'MARKETING_EMAIL', 'MARKETING_WHATSAPP', 'MARKETING_SMS', 'SOCIAL_MEDIA_FEATURE', 'PAID_AD', 'THIRD_PARTY_SHARE', 'ANALYTICS');

-- CreateEnum
CREATE TYPE "DataRequestType" AS ENUM ('EXPORT', 'DELETION', 'CORRECTION', 'ACCESS_LOG');

-- CreateEnum
CREATE TYPE "DataRequestStatus" AS ENUM ('PENDING_DSR', 'IN_PROGRESS_DSR', 'COMPLETED_DSR', 'REJECTED_DSR');

-- CreateEnum
CREATE TYPE "OperatorStatus" AS ENUM ('PROSPECT_OP', 'ONBOARDING_OP', 'PILOT', 'ACTIVE_OP', 'SUSPENDED_OP', 'TERMINATED');

-- CreateEnum
CREATE TYPE "TerritoryType" AS ENUM ('EXCLUSIVE', 'NON_EXCLUSIVE', 'MANAGED');

-- CreateEnum
CREATE TYPE "CityLaunchStage" AS ENUM ('RESEARCH', 'WAITLIST', 'SUPPLY_BUILD', 'CLOSED_BETA', 'PUBLIC_LIMITED', 'VALIDATED', 'GROWTH', 'MATURE', 'PAUSED', 'EXITED');

-- CreateEnum
CREATE TYPE "ZoneLaunchStage" AS ENUM ('RESEARCH', 'WAITLIST', 'BETA', 'ACTIVE_LIMITED', 'ACTIVE', 'CAPACITY_PAUSED', 'SERVICE_PAUSED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('DISABLED', 'WAITLIST', 'MANUAL_BETA', 'ACTIVE_LIMITED', 'ACTIVE', 'CAPACITY_PAUSED', 'SAFETY_PAUSED');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('CORPORATE', 'DEVELOPER', 'SOCIETY', 'VET_CLINIC', 'PET_BRAND', 'HOTEL', 'RELOCATION', 'TRAINING_CHAIN', 'OTHER');

-- CreateEnum
CREATE TYPE "OrgStatus" AS ENUM ('PROSPECT', 'ACTIVE', 'PAUSED', 'CHURNED');

-- CreateEnum
CREATE TYPE "OpportunityStage" AS ENUM ('TARGET_ACCOUNT', 'CONTACT_IDENTIFIED', 'CONTACTED', 'DISCOVERY_SCHEDULED', 'QUALIFIED', 'SOLUTION_DESIGNED', 'PROPOSAL_SENT', 'PILOT_NEGOTIATION', 'PILOT_CONTRACTED', 'PILOT_ACTIVE', 'PILOT_REVIEW', 'COMMERCIAL_NEGOTIATION', 'PAID_CONTRACT', 'ONBOARDING', 'ACTIVE_ACCOUNT', 'RENEWAL', 'DISQUALIFIED', 'LOST', 'PAUSED_OPP', 'CHURNED_OPP');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT_CONTRACT', 'ACTIVE_CONTRACT', 'EXPIRED_CONTRACT', 'TERMINATED', 'RENEWED');

-- CreateEnum
CREATE TYPE "ProgrammeStatus" AS ENUM ('DRAFT_PROGRAMME', 'ACTIVE_PROGRAMME', 'PAUSED_PROGRAMME', 'COMPLETED_PROGRAMME', 'CANCELLED_PROGRAMME');

-- CreateEnum
CREATE TYPE "ProgrammeType" AS ENUM ('CORPORATE_ACCESS', 'CORPORATE_MANAGED', 'CORPORATE_WALLET', 'SOCIETY_LAUNCH', 'MANAGED_SOCIETY', 'TOWNSHIP_DESK', 'VET_REFERRAL', 'BRAND_CAMPAIGN', 'RELOCATION_SUPPORT');

-- CreateEnum
CREATE TYPE "EligibilityMethod" AS ENUM ('DOMAIN_EMAIL', 'OTP_VERIFY', 'EMPLOYEE_ID', 'HR_FILE', 'INVITATION_TOKEN', 'SOCIETY_APPROVAL', 'OPEN_ACCESS');

-- CreateEnum
CREATE TYPE "MemberVerificationStatus" AS ENUM ('PENDING_VERIFICATION', 'VERIFIED', 'REJECTED_VERIFICATION', 'EXPIRED_VERIFICATION');

-- CreateEnum
CREATE TYPE "WalletStatus" AS ENUM ('ACTIVE_WALLET', 'FROZEN', 'EXPIRED_WALLET', 'CLOSED');

-- CreateEnum
CREATE TYPE "BenefitEntryType" AS ENUM ('CREDIT_ISSUED', 'CREDIT_REDEEMED', 'CREDIT_EXPIRED', 'CREDIT_REFUNDED', 'CREDIT_ADJUSTMENT');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT_INVOICE', 'SENT', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED_INVOICE', 'CREDIT_NOTED');

-- CreateEnum
CREATE TYPE "OrgContactRole" AS ENUM ('PRIMARY_CONTACT', 'PROGRAMME_OWNER', 'HR_CONTACT', 'FINANCE_CONTACT', 'FACILITY_MANAGER', 'TECHNICAL_CONTACT', 'DECISION_MAKER', 'OTHER_CONTACT');

-- CreateEnum
CREATE TYPE "CreditType" AS ENUM ('SUBSCRIPTION', 'PROMOTIONAL', 'REFUND', 'LOYALTY', 'SERVICE_RECOVERY');

-- CreateEnum
CREATE TYPE "CreditAction" AS ENUM ('ISSUED', 'CONSUMED', 'EXPIRED', 'REVERSED', 'ADJUSTED');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'RECOMMENDED', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "HealthEventType" AS ENUM ('VACCINATION', 'MEDICATION', 'VET_VISIT', 'INCIDENT', 'NOTE', 'SERVICE_COMPLETED');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'LEFT', 'BANNED');

-- CreateEnum
CREATE TYPE "SuspensionReason" AS ENUM ('SAFETY_INCIDENT', 'QUALITY_VIOLATION', 'NO_SHOW', 'BACKGROUND_CHECK_FAIL', 'FRAUD', 'OTHER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'CITY_MANAGER';
ALTER TYPE "Role" ADD VALUE 'OPERATOR';

-- AlterTable
-- Convert the earlier generic gate states without discarding existing city rows.
ALTER TABLE "cities" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "cities"
  ALTER COLUMN "status" TYPE "CityLaunchStage"
  USING (
    CASE "status"::text
      WHEN 'DRAFT' THEN 'RESEARCH'
      WHEN 'REVIEW' THEN 'WAITLIST'
      WHEN 'ACTIVE' THEN 'PUBLIC_LIMITED'
      WHEN 'PAUSED' THEN 'PAUSED'
      WHEN 'CLOSED' THEN 'EXITED'
      WHEN 'ARCHIVED' THEN 'EXITED'
      ELSE 'RESEARCH'
    END
  )::"CityLaunchStage";
ALTER TABLE "cities" ALTER COLUMN "status" SET DEFAULT 'RESEARCH';

-- AlterTable
ALTER TABLE "incidents" ADD COLUMN     "financial_impact" INTEGER,
ADD COLUMN     "root_cause_analysis" JSONB;

-- AlterTable
-- Preserve legacy cluster_id data while introducing the canonical service-zone relation.
ALTER TABLE "service_areas" ADD COLUMN "service_zone_id" UUID;

-- CreateTable
CREATE TABLE "service_zones" (
    "id" UUID NOT NULL,
    "city_id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "ZoneLaunchStage" NOT NULL DEFAULT 'RESEARCH',
    "metadata" JSONB,
    "boundary" JSONB,
    "centroid" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_mandates" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "provider_mandate_id" TEXT NOT NULL,
    "providerName" TEXT NOT NULL DEFAULT 'RAZORPAY',
    "max_amount_paise" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_mandates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "city_service_configurations" (
    "id" UUID NOT NULL,
    "city_id" UUID NOT NULL,
    "service_type_id" UUID NOT NULL,
    "status" "ServiceStatus" NOT NULL DEFAULT 'DISABLED',
    "booking_mode" TEXT,
    "minimum_notice_minutes" INTEGER,
    "maximum_advance_days" INTEGER,
    "operating_hours" JSONB,
    "cancellation_policy_id" UUID,
    "support_policy_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "city_service_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zone_service_configurations" (
    "id" UUID NOT NULL,
    "service_zone_id" UUID NOT NULL,
    "service_type_id" UUID NOT NULL,
    "status" "ServiceStatus" NOT NULL DEFAULT 'DISABLED',
    "booking_mode" TEXT,
    "capacity_policy_id" UUID,
    "waitlist_enabled" BOOLEAN NOT NULL DEFAULT false,
    "launch_limit" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zone_service_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_credits" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "CreditType" NOT NULL,
    "amount_paise" INTEGER NOT NULL,
    "balance_paise" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "issued_reason" TEXT NOT NULL,
    "reference_id" UUID,
    "expires_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_credits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_credit_transactions" (
    "id" UUID NOT NULL,
    "credit_id" UUID NOT NULL,
    "booking_id" UUID,
    "action" "CreditAction" NOT NULL,
    "amount_paise" INTEGER NOT NULL,
    "balance_after" INTEGER NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_credit_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_scores" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "sitter_id" UUID NOT NULL,
    "total_score" DOUBLE PRECISION NOT NULL,
    "factors" JSONB NOT NULL,
    "rank" INTEGER NOT NULL,
    "requires_human_approval" BOOLEAN NOT NULL DEFAULT false,
    "approval_reasons" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "MatchStatus" NOT NULL DEFAULT 'PENDING',
    "approved_by" UUID,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_timeline_events" (
    "id" UUID NOT NULL,
    "pet_id" UUID NOT NULL,
    "type" "HealthEventType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "event_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "document_url" TEXT,
    "metadata" JSONB,

    CONSTRAINT "health_timeline_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" UUID NOT NULL,
    "email" TEXT,
    "phone_e164" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "source" TEXT NOT NULL DEFAULT 'ORGANIC',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_magnet_requests" (
    "id" UUID NOT NULL,
    "contact_id" UUID NOT NULL,
    "magnet_slug" TEXT NOT NULL,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "lead_magnet_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_groups" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "platform" TEXT NOT NULL DEFAULT 'WHATSAPP',
    "join_link" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_memberships" (
    "id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "contact_id" UUID NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'PENDING',
    "joined_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL,
    "legal_name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "organization_type" "OrganizationType" NOT NULL,
    "website" TEXT,
    "primary_city_id" UUID,
    "gstin" TEXT,
    "pan_encrypted" TEXT,
    "billing_address_id" UUID,
    "status" "OrgStatus" NOT NULL DEFAULT 'PROSPECT',
    "account_owner_id" UUID,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_contacts" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "department" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "role_type" "OrgContactRole" NOT NULL DEFAULT 'OTHER_CONTACT',
    "is_decision_maker" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "b2b_opportunities" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "programme_type" "ProgrammeType" NOT NULL,
    "pipeline_stage" "OpportunityStage" NOT NULL DEFAULT 'TARGET_ACCOUNT',
    "estimated_value" INTEGER,
    "probability" INTEGER DEFAULT 0,
    "expected_close_date" TIMESTAMP(3),
    "lead_source" TEXT,
    "next_action" TEXT,
    "next_action_at" TIMESTAMP(3),
    "owner_id" UUID,
    "loss_reason" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "b2b_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "b2b_contracts" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "opportunity_id" UUID,
    "contract_type" "ProgrammeType" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "renewal_date" TIMESTAMP(3),
    "billing_frequency" TEXT,
    "contracted_value" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "payment_terms_days" INTEGER NOT NULL DEFAULT 30,
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT_CONTRACT',
    "signed_document_id" UUID,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "b2b_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_programmes" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "contract_id" UUID,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "programme_type" "ProgrammeType" NOT NULL,
    "city_scope" TEXT[],
    "eligibility_method" "EligibilityMethod" NOT NULL DEFAULT 'INVITATION_TOKEN',
    "eligibility_domain" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "status" "ProgrammeStatus" NOT NULL DEFAULT 'DRAFT_PROGRAMME',
    "support_tier" TEXT,
    "account_manager_id" UUID,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_programmes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programme_memberships" (
    "id" UUID NOT NULL,
    "programme_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "verification_method" "EligibilityMethod",
    "verification_status" "MemberVerificationStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "verified_at" TIMESTAMP(3),
    "eligibility_expiry" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programme_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benefit_wallets" (
    "id" UUID NOT NULL,
    "programme_membership_id" UUID NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "WalletStatus" NOT NULL DEFAULT 'ACTIVE_WALLET',
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "benefit_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benefit_ledger_entries" (
    "id" UUID NOT NULL,
    "wallet_id" UUID NOT NULL,
    "entry_type" "BenefitEntryType" NOT NULL,
    "amount_paise" INTEGER NOT NULL,
    "balance_after" INTEGER NOT NULL,
    "booking_id" UUID,
    "invoice_id" UUID,
    "reference" TEXT,
    "idempotency_key" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "benefit_ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_codes" (
    "id" UUID NOT NULL,
    "programme_id" UUID,
    "code" TEXT NOT NULL,
    "discount_type" TEXT NOT NULL,
    "discount_value" INTEGER NOT NULL,
    "maximum_discount" INTEGER,
    "minimum_order" INTEGER,
    "total_usage_limit" INTEGER,
    "per_member_limit" INTEGER DEFAULT 1,
    "service_scope" TEXT[],
    "city_scope" TEXT[],
    "valid_from" TIMESTAMP(3) NOT NULL,
    "valid_until" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotion_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_invoices" (
    "id" UUID NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "organization_id" UUID NOT NULL,
    "contract_id" UUID,
    "supplier_gstin" TEXT,
    "customer_gstin" TEXT,
    "place_of_supply" TEXT,
    "billing_address" TEXT,
    "service_address" TEXT,
    "sac_code" TEXT,
    "taxable_value" INTEGER NOT NULL,
    "cgst" INTEGER NOT NULL DEFAULT 0,
    "sgst" INTEGER NOT NULL DEFAULT 0,
    "igst" INTEGER NOT NULL DEFAULT 0,
    "total_amount" INTEGER NOT NULL,
    "amount_paid" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT_INVOICE',
    "due_date" TIMESTAMP(3) NOT NULL,
    "paid_at" TIMESTAMP(3),
    "po_reference" TEXT,
    "notes" TEXT,
    "credit_note_of" UUID,
    "irn_number" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enterprise_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "city_financial_records" (
    "id" UUID NOT NULL,
    "city_id" UUID NOT NULL,
    "period_month" INTEGER NOT NULL,
    "period_year" INTEGER NOT NULL,
    "gbv_paise" BIGINT NOT NULL DEFAULT 0,
    "net_revenue_paise" BIGINT NOT NULL DEFAULT 0,
    "cm1_paise" BIGINT NOT NULL DEFAULT 0,
    "cm2_paise" BIGINT NOT NULL DEFAULT 0,
    "blended_cac_paise" INTEGER NOT NULL DEFAULT 0,
    "marketing_spend" BIGINT NOT NULL DEFAULT 0,
    "total_bookings" INTEGER NOT NULL DEFAULT 0,
    "active_customers" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "city_financial_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "city_health_scores" (
    "id" UUID NOT NULL,
    "city_id" UUID NOT NULL,
    "period_date" DATE NOT NULL,
    "overall_score" INTEGER NOT NULL,
    "safety_score" INTEGER NOT NULL,
    "supply_score" INTEGER NOT NULL,
    "demand_score" INTEGER NOT NULL,
    "operations_score" INTEGER NOT NULL,
    "has_unresolved_severe" BOOLEAN NOT NULL DEFAULT false,
    "cm2_deterioration" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "city_health_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "city_managers" (
    "id" UUID NOT NULL,
    "city_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "city_managers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_suspensions" (
    "id" UUID NOT NULL,
    "sitter_id" UUID NOT NULL,
    "incident_id" UUID,
    "reason" "SuspensionReason" NOT NULL,
    "description" TEXT NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "is_appealed" BOOLEAN NOT NULL DEFAULT false,
    "appeal_notes" TEXT,
    "lifted_at" TIMESTAMP(3),
    "lifted_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_suspensions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safety_audits" (
    "id" UUID NOT NULL,
    "sitter_id" UUID NOT NULL,
    "auditor_id" UUID NOT NULL,
    "audit_date" TIMESTAMP(3) NOT NULL,
    "score" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "notes" TEXT,
    "action_required" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "safety_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operating_partners" (
    "id" UUID NOT NULL,
    "legal_name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "contact_person_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "gstin" TEXT,
    "pan_encrypted" TEXT,
    "status" "OperatorStatus" NOT NULL DEFAULT 'PROSPECT_OP',
    "onboarded_at" TIMESTAMP(3),
    "pilot_started_at" TIMESTAMP(3),
    "terminated_at" TIMESTAMP(3),
    "termination_reason" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operating_partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "territories" (
    "id" UUID NOT NULL,
    "operating_partner_id" UUID NOT NULL,
    "city_id" UUID NOT NULL,
    "service_zone_id" UUID,
    "territoryType" "TerritoryType" NOT NULL DEFAULT 'MANAGED',
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "agreed_rev_share_bps" INTEGER NOT NULL DEFAULT 0,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "territories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_consent_records" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "purpose" "ConsentPurpose" NOT NULL,
    "consent_version" TEXT NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "revoked_reason" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_consent_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_subject_requests" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "request_type" "DataRequestType" NOT NULL,
    "status" "DataRequestStatus" NOT NULL DEFAULT 'PENDING_DSR',
    "description" TEXT,
    "handled_by_id" UUID,
    "completed_at" TIMESTAMP(3),
    "response_notes" TEXT,
    "due_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_subject_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_retention_policies" (
    "id" UUID NOT NULL,
    "entity_type" TEXT NOT NULL,
    "retention_days" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_run_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_retention_policies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_zones_city_id_status_idx" ON "service_zones"("city_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "service_zones_city_id_slug_key" ON "service_zones"("city_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "payment_mandates_provider_mandate_id_key" ON "payment_mandates"("provider_mandate_id");

-- CreateIndex
CREATE INDEX "payment_mandates_user_id_idx" ON "payment_mandates"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "city_service_configurations_city_id_service_type_id_key" ON "city_service_configurations"("city_id", "service_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "zone_service_configurations_service_zone_id_service_type_id_key" ON "zone_service_configurations"("service_zone_id", "service_type_id");

-- CreateIndex
CREATE INDEX "service_credits_user_id_is_active_expires_at_idx" ON "service_credits"("user_id", "is_active", "expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "service_credit_transactions_idempotency_key_key" ON "service_credit_transactions"("idempotency_key");

-- CreateIndex
CREATE INDEX "service_credit_transactions_credit_id_created_at_idx" ON "service_credit_transactions"("credit_id", "created_at");

-- CreateIndex
CREATE INDEX "match_scores_booking_id_rank_idx" ON "match_scores"("booking_id", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "match_scores_booking_id_sitter_id_key" ON "match_scores"("booking_id", "sitter_id");

-- CreateIndex
CREATE INDEX "health_timeline_events_pet_id_event_date_idx" ON "health_timeline_events"("pet_id", "event_date" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "contacts_email_key" ON "contacts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_phone_e164_key" ON "contacts"("phone_e164");

-- CreateIndex
CREATE INDEX "lead_magnet_requests_contact_id_magnet_slug_idx" ON "lead_magnet_requests"("contact_id", "magnet_slug");

-- CreateIndex
CREATE UNIQUE INDEX "community_groups_slug_key" ON "community_groups"("slug");

-- CreateIndex
CREATE INDEX "community_memberships_status_idx" ON "community_memberships"("status");

-- CreateIndex
CREATE UNIQUE INDEX "community_memberships_group_id_contact_id_key" ON "community_memberships"("group_id", "contact_id");

-- CreateIndex
CREATE INDEX "organizations_organization_type_status_idx" ON "organizations"("organization_type", "status");

-- CreateIndex
CREATE INDEX "organizations_primary_city_id_idx" ON "organizations"("primary_city_id");

-- CreateIndex
CREATE INDEX "organization_contacts_organization_id_idx" ON "organization_contacts"("organization_id");

-- CreateIndex
CREATE INDEX "b2b_opportunities_organization_id_idx" ON "b2b_opportunities"("organization_id");

-- CreateIndex
CREATE INDEX "b2b_opportunities_pipeline_stage_idx" ON "b2b_opportunities"("pipeline_stage");

-- CreateIndex
CREATE INDEX "b2b_opportunities_owner_id_idx" ON "b2b_opportunities"("owner_id");

-- CreateIndex
CREATE INDEX "b2b_contracts_organization_id_idx" ON "b2b_contracts"("organization_id");

-- CreateIndex
CREATE INDEX "b2b_contracts_status_idx" ON "b2b_contracts"("status");

-- CreateIndex
CREATE UNIQUE INDEX "partner_programmes_slug_key" ON "partner_programmes"("slug");

-- CreateIndex
CREATE INDEX "partner_programmes_organization_id_idx" ON "partner_programmes"("organization_id");

-- CreateIndex
CREATE INDEX "partner_programmes_status_idx" ON "partner_programmes"("status");

-- CreateIndex
CREATE INDEX "programme_memberships_customer_id_idx" ON "programme_memberships"("customer_id");

-- CreateIndex
CREATE INDEX "programme_memberships_verification_status_idx" ON "programme_memberships"("verification_status");

-- CreateIndex
CREATE UNIQUE INDEX "programme_memberships_programme_id_customer_id_key" ON "programme_memberships"("programme_id", "customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "benefit_wallets_programme_membership_id_key" ON "benefit_wallets"("programme_membership_id");

-- CreateIndex
CREATE UNIQUE INDEX "benefit_ledger_entries_idempotency_key_key" ON "benefit_ledger_entries"("idempotency_key");

-- CreateIndex
CREATE INDEX "benefit_ledger_entries_wallet_id_idx" ON "benefit_ledger_entries"("wallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "promotion_codes_code_key" ON "promotion_codes"("code");

-- CreateIndex
CREATE INDEX "promotion_codes_programme_id_idx" ON "promotion_codes"("programme_id");

-- CreateIndex
CREATE UNIQUE INDEX "enterprise_invoices_invoice_number_key" ON "enterprise_invoices"("invoice_number");

-- CreateIndex
CREATE INDEX "enterprise_invoices_organization_id_idx" ON "enterprise_invoices"("organization_id");

-- CreateIndex
CREATE INDEX "enterprise_invoices_status_idx" ON "enterprise_invoices"("status");

-- CreateIndex
CREATE INDEX "enterprise_invoices_due_date_idx" ON "enterprise_invoices"("due_date");

-- CreateIndex
CREATE UNIQUE INDEX "city_financial_records_city_id_period_month_period_year_key" ON "city_financial_records"("city_id", "period_month", "period_year");

-- CreateIndex
CREATE INDEX "city_health_scores_city_id_period_date_idx" ON "city_health_scores"("city_id", "period_date");

-- CreateIndex
CREATE INDEX "city_managers_city_id_status_idx" ON "city_managers"("city_id", "status");

-- CreateIndex
CREATE INDEX "provider_suspensions_sitter_id_idx" ON "provider_suspensions"("sitter_id");

-- CreateIndex
CREATE INDEX "safety_audits_sitter_id_idx" ON "safety_audits"("sitter_id");

-- CreateIndex
CREATE INDEX "operating_partners_status_idx" ON "operating_partners"("status");

-- CreateIndex
CREATE INDEX "territories_city_id_idx" ON "territories"("city_id");

-- CreateIndex
CREATE UNIQUE INDEX "territories_operating_partner_id_city_id_service_zone_id_key" ON "territories"("operating_partner_id", "city_id", "service_zone_id");

-- CreateIndex
CREATE INDEX "content_consent_records_user_id_purpose_idx" ON "content_consent_records"("user_id", "purpose");

-- CreateIndex
CREATE INDEX "data_subject_requests_user_id_idx" ON "data_subject_requests"("user_id");

-- CreateIndex
CREATE INDEX "data_subject_requests_status_idx" ON "data_subject_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "data_retention_policies_entity_type_key" ON "data_retention_policies"("entity_type");

-- CreateIndex
CREATE INDEX "service_areas_city_id_service_zone_id_status_idx" ON "service_areas"("city_id", "service_zone_id", "status");

-- AddForeignKey
ALTER TABLE "service_zones" ADD CONSTRAINT "service_zones_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_areas" ADD CONSTRAINT "service_areas_service_zone_id_fkey" FOREIGN KEY ("service_zone_id") REFERENCES "service_zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "city_service_configurations" ADD CONSTRAINT "city_service_configurations_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "city_service_configurations" ADD CONSTRAINT "city_service_configurations_service_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zone_service_configurations" ADD CONSTRAINT "zone_service_configurations_service_zone_id_fkey" FOREIGN KEY ("service_zone_id") REFERENCES "service_zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zone_service_configurations" ADD CONSTRAINT "zone_service_configurations_service_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_credits" ADD CONSTRAINT "service_credits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_credit_transactions" ADD CONSTRAINT "service_credit_transactions_credit_id_fkey" FOREIGN KEY ("credit_id") REFERENCES "service_credits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_scores" ADD CONSTRAINT "match_scores_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_scores" ADD CONSTRAINT "match_scores_sitter_id_fkey" FOREIGN KEY ("sitter_id") REFERENCES "sitter_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_timeline_events" ADD CONSTRAINT "health_timeline_events_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_magnet_requests" ADD CONSTRAINT "lead_magnet_requests_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_memberships" ADD CONSTRAINT "community_memberships_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "community_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_memberships" ADD CONSTRAINT "community_memberships_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_primary_city_id_fkey" FOREIGN KEY ("primary_city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_billing_address_id_fkey" FOREIGN KEY ("billing_address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_account_owner_id_fkey" FOREIGN KEY ("account_owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_contacts" ADD CONSTRAINT "organization_contacts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "b2b_opportunities" ADD CONSTRAINT "b2b_opportunities_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "b2b_opportunities" ADD CONSTRAINT "b2b_opportunities_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "b2b_contracts" ADD CONSTRAINT "b2b_contracts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "b2b_contracts" ADD CONSTRAINT "b2b_contracts_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "b2b_opportunities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_programmes" ADD CONSTRAINT "partner_programmes_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_programmes" ADD CONSTRAINT "partner_programmes_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "b2b_contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_programmes" ADD CONSTRAINT "partner_programmes_account_manager_id_fkey" FOREIGN KEY ("account_manager_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programme_memberships" ADD CONSTRAINT "programme_memberships_programme_id_fkey" FOREIGN KEY ("programme_id") REFERENCES "partner_programmes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programme_memberships" ADD CONSTRAINT "programme_memberships_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benefit_wallets" ADD CONSTRAINT "benefit_wallets_programme_membership_id_fkey" FOREIGN KEY ("programme_membership_id") REFERENCES "programme_memberships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benefit_ledger_entries" ADD CONSTRAINT "benefit_ledger_entries_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "benefit_wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_codes" ADD CONSTRAINT "promotion_codes_programme_id_fkey" FOREIGN KEY ("programme_id") REFERENCES "partner_programmes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_invoices" ADD CONSTRAINT "enterprise_invoices_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_invoices" ADD CONSTRAINT "enterprise_invoices_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "b2b_contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "city_financial_records" ADD CONSTRAINT "city_financial_records_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "city_health_scores" ADD CONSTRAINT "city_health_scores_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "city_managers" ADD CONSTRAINT "city_managers_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "city_managers" ADD CONSTRAINT "city_managers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_suspensions" ADD CONSTRAINT "provider_suspensions_sitter_id_fkey" FOREIGN KEY ("sitter_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_suspensions" ADD CONSTRAINT "provider_suspensions_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_suspensions" ADD CONSTRAINT "provider_suspensions_lifted_by_fkey" FOREIGN KEY ("lifted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safety_audits" ADD CONSTRAINT "safety_audits_sitter_id_fkey" FOREIGN KEY ("sitter_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safety_audits" ADD CONSTRAINT "safety_audits_auditor_id_fkey" FOREIGN KEY ("auditor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_partners" ADD CONSTRAINT "operating_partners_contact_person_id_fkey" FOREIGN KEY ("contact_person_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "territories" ADD CONSTRAINT "territories_operating_partner_id_fkey" FOREIGN KEY ("operating_partner_id") REFERENCES "operating_partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "territories" ADD CONSTRAINT "territories_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "territories" ADD CONSTRAINT "territories_service_zone_id_fkey" FOREIGN KEY ("service_zone_id") REFERENCES "service_zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_consent_records" ADD CONSTRAINT "content_consent_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_subject_requests" ADD CONSTRAINT "data_subject_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_subject_requests" ADD CONSTRAINT "data_subject_requests_handled_by_id_fkey" FOREIGN KEY ("handled_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Private-by-default access for newly introduced domain tables.
REVOKE ALL ON public."service_zones" FROM anon, authenticated;
ALTER TABLE public."service_zones" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."payment_mandates" FROM anon, authenticated;
ALTER TABLE public."payment_mandates" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."city_service_configurations" FROM anon, authenticated;
ALTER TABLE public."city_service_configurations" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."zone_service_configurations" FROM anon, authenticated;
ALTER TABLE public."zone_service_configurations" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."service_credits" FROM anon, authenticated;
ALTER TABLE public."service_credits" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."service_credit_transactions" FROM anon, authenticated;
ALTER TABLE public."service_credit_transactions" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."match_scores" FROM anon, authenticated;
ALTER TABLE public."match_scores" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."health_timeline_events" FROM anon, authenticated;
ALTER TABLE public."health_timeline_events" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."contacts" FROM anon, authenticated;
ALTER TABLE public."contacts" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."lead_magnet_requests" FROM anon, authenticated;
ALTER TABLE public."lead_magnet_requests" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."community_groups" FROM anon, authenticated;
ALTER TABLE public."community_groups" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."community_memberships" FROM anon, authenticated;
ALTER TABLE public."community_memberships" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."organizations" FROM anon, authenticated;
ALTER TABLE public."organizations" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."organization_contacts" FROM anon, authenticated;
ALTER TABLE public."organization_contacts" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."b2b_opportunities" FROM anon, authenticated;
ALTER TABLE public."b2b_opportunities" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."b2b_contracts" FROM anon, authenticated;
ALTER TABLE public."b2b_contracts" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."partner_programmes" FROM anon, authenticated;
ALTER TABLE public."partner_programmes" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."programme_memberships" FROM anon, authenticated;
ALTER TABLE public."programme_memberships" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."benefit_wallets" FROM anon, authenticated;
ALTER TABLE public."benefit_wallets" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."benefit_ledger_entries" FROM anon, authenticated;
ALTER TABLE public."benefit_ledger_entries" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."promotion_codes" FROM anon, authenticated;
ALTER TABLE public."promotion_codes" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."enterprise_invoices" FROM anon, authenticated;
ALTER TABLE public."enterprise_invoices" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."city_financial_records" FROM anon, authenticated;
ALTER TABLE public."city_financial_records" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."city_health_scores" FROM anon, authenticated;
ALTER TABLE public."city_health_scores" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."city_managers" FROM anon, authenticated;
ALTER TABLE public."city_managers" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."provider_suspensions" FROM anon, authenticated;
ALTER TABLE public."provider_suspensions" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."safety_audits" FROM anon, authenticated;
ALTER TABLE public."safety_audits" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."operating_partners" FROM anon, authenticated;
ALTER TABLE public."operating_partners" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."territories" FROM anon, authenticated;
ALTER TABLE public."territories" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."content_consent_records" FROM anon, authenticated;
ALTER TABLE public."content_consent_records" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."data_subject_requests" FROM anon, authenticated;
ALTER TABLE public."data_subject_requests" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public."data_retention_policies" FROM anon, authenticated;
ALTER TABLE public."data_retention_policies" ENABLE ROW LEVEL SECURITY;
