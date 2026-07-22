-- CreateEnum
CREATE TYPE "GateStatus" AS ENUM ('DRAFT', 'REVIEW', 'ACTIVE', 'PAUSED', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PartnerOrderStatus" AS ENUM ('REQUESTED', 'ACCEPTED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "cities" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "status" "GateStatus" NOT NULL DEFAULT 'DRAFT',
    "launch_criteria" JSONB,
    "launched_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clusters" (
    "id" UUID NOT NULL,
    "city_id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "GateStatus" NOT NULL DEFAULT 'DRAFT',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clusters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_areas" (
    "id" UUID NOT NULL,
    "city_id" UUID NOT NULL,
    "cluster_id" UUID,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "postal_codes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "boundary" JSONB,
    "status" "GateStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capacity_limits" (
    "id" UUID NOT NULL,
    "service_area_id" UUID NOT NULL,
    "service_code" "ServiceCode" NOT NULL,
    "service_date" DATE NOT NULL,
    "maximum" INTEGER NOT NULL,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capacity_limits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "society_sitter_pools" (
    "society_id" UUID NOT NULL,
    "sitter_id" UUID NOT NULL,
    "status" "GateStatus" NOT NULL DEFAULT 'DRAFT',
    "approved_by" UUID,
    "approved_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "society_sitter_pools_pkey" PRIMARY KEY ("society_id","sitter_id")
);

-- CreateTable
CREATE TABLE "society_events" (
    "id" UUID NOT NULL,
    "society_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER,
    "status" "GateStatus" NOT NULL DEFAULT 'DRAFT',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "society_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "society_partnerships" (
    "id" UUID NOT NULL,
    "society_id" UUID NOT NULL,
    "agreement_version" TEXT NOT NULL,
    "status" "GateStatus" NOT NULL DEFAULT 'DRAFT',
    "starts_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),
    "commercial_terms" JSONB,
    "signed_document_ref" TEXT,
    "approved_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "society_partnerships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "legal_name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" "GateStatus" NOT NULL DEFAULT 'DRAFT',
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_locations" (
    "id" UUID NOT NULL,
    "partner_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "city_id" UUID,
    "address" JSONB NOT NULL,
    "coordinates" JSONB,
    "status" "GateStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_verifications" (
    "id" UUID NOT NULL,
    "partner_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "evidence_ref" TEXT,
    "verified_by" UUID,
    "verified_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partner_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_services" (
    "id" UUID NOT NULL,
    "partner_id" UUID NOT NULL,
    "service_code" "ServiceCode" NOT NULL,
    "status" "GateStatus" NOT NULL DEFAULT 'DRAFT',
    "terms" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_orders" (
    "id" UUID NOT NULL,
    "reference" TEXT NOT NULL,
    "partner_service_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "pet_id" UUID,
    "status" "PartnerOrderStatus" NOT NULL DEFAULT 'REQUESTED',
    "scheduled_at" TIMESTAMP(3),
    "amount_paise" INTEGER,
    "instructions" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entitlement_consumption" (
    "id" UUID NOT NULL,
    "subscription_id" UUID NOT NULL,
    "entitlement_key" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "booking_id" UUID,
    "idempotency_key" TEXT NOT NULL,
    "consumed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entitlement_consumption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_ledger" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "delta" INTEGER NOT NULL,
    "balance_after" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "reference_type" TEXT,
    "reference_id" TEXT,
    "idempotency_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loyalty_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referrals" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "referrer_id" UUID NOT NULL,
    "referred_id" UUID,
    "status" "GateStatus" NOT NULL DEFAULT 'DRAFT',
    "qualified_at" TIMESTAMP(3),
    "rewarded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "display_name" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "context" TEXT,
    "city" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "consent_id" UUID,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonial_consents" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "scope" TEXT NOT NULL,
    "evidence_ref" TEXT NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL,
    "withdrawn_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "testimonial_consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "status" "GateStatus" NOT NULL DEFAULT 'DRAFT',
    "audience" JSONB NOT NULL,
    "starts_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),
    "budget_paise" INTEGER,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiments" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "hypothesis" TEXT NOT NULL,
    "status" "GateStatus" NOT NULL DEFAULT 'DRAFT',
    "allocation" JSONB NOT NULL,
    "success_metric" TEXT NOT NULL,
    "starts_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),
    "result" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experiments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policy_versions" (
    "id" UUID NOT NULL,
    "policy_key" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "content_hash" TEXT NOT NULL,
    "document_ref" TEXT NOT NULL,
    "status" "GateStatus" NOT NULL DEFAULT 'DRAFT',
    "approved_by" UUID,
    "effective_at" TIMESTAMP(3),
    "retired_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "policy_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_access_logs" (
    "id" BIGSERIAL NOT NULL,
    "actor_id" UUID,
    "actor_role" "Role",
    "purpose" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "fields" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "request_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_access_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retention_jobs" (
    "id" UUID NOT NULL,
    "policy_key" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "cutoff_at" TIMESTAMP(3) NOT NULL,
    "scanned" INTEGER NOT NULL DEFAULT 0,
    "affected" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "retention_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_events" (
    "id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_event_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload_hash" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "processed_at" TIMESTAMP(3),
    "error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_runs" (
    "id" UUID NOT NULL,
    "job_key" TEXT NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "input" JSONB,
    "result" JSONB,
    "error" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cities_slug_key" ON "cities"("slug");

-- CreateIndex
CREATE INDEX "cities_status_name_idx" ON "cities"("status", "name");

-- CreateIndex
CREATE INDEX "clusters_city_id_status_idx" ON "clusters"("city_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "clusters_city_id_slug_key" ON "clusters"("city_id", "slug");

-- CreateIndex
CREATE INDEX "service_areas_city_id_cluster_id_status_idx" ON "service_areas"("city_id", "cluster_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "service_areas_city_id_slug_key" ON "service_areas"("city_id", "slug");

-- CreateIndex
CREATE INDEX "capacity_limits_service_date_service_code_idx" ON "capacity_limits"("service_date", "service_code");

-- CreateIndex
CREATE UNIQUE INDEX "capacity_limits_service_area_id_service_code_service_date_key" ON "capacity_limits"("service_area_id", "service_code", "service_date");

-- CreateIndex
CREATE INDEX "society_sitter_pools_society_id_status_idx" ON "society_sitter_pools"("society_id", "status");

-- CreateIndex
CREATE INDEX "society_events_society_id_status_starts_at_idx" ON "society_events"("society_id", "status", "starts_at");

-- CreateIndex
CREATE INDEX "society_partnerships_society_id_status_idx" ON "society_partnerships"("society_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "partners_slug_key" ON "partners"("slug");

-- CreateIndex
CREATE INDEX "partners_category_status_idx" ON "partners"("category", "status");

-- CreateIndex
CREATE INDEX "partner_locations_partner_id_status_idx" ON "partner_locations"("partner_id", "status");

-- CreateIndex
CREATE INDEX "partner_locations_city_id_status_idx" ON "partner_locations"("city_id", "status");

-- CreateIndex
CREATE INDEX "partner_verifications_partner_id_type_status_idx" ON "partner_verifications"("partner_id", "type", "status");

-- CreateIndex
CREATE INDEX "partner_services_service_code_status_idx" ON "partner_services"("service_code", "status");

-- CreateIndex
CREATE UNIQUE INDEX "partner_services_partner_id_service_code_key" ON "partner_services"("partner_id", "service_code");

-- CreateIndex
CREATE UNIQUE INDEX "partner_orders_reference_key" ON "partner_orders"("reference");

-- CreateIndex
CREATE INDEX "partner_orders_customer_id_created_at_idx" ON "partner_orders"("customer_id", "created_at");

-- CreateIndex
CREATE INDEX "partner_orders_partner_service_id_status_scheduled_at_idx" ON "partner_orders"("partner_service_id", "status", "scheduled_at");

-- CreateIndex
CREATE UNIQUE INDEX "entitlement_consumption_idempotency_key_key" ON "entitlement_consumption"("idempotency_key");

-- CreateIndex
CREATE INDEX "entitlement_consumption_subscription_id_entitlement_key_con_idx" ON "entitlement_consumption"("subscription_id", "entitlement_key", "consumed_at");

-- CreateIndex
CREATE UNIQUE INDEX "loyalty_ledger_idempotency_key_key" ON "loyalty_ledger"("idempotency_key");

-- CreateIndex
CREATE INDEX "loyalty_ledger_user_id_created_at_idx" ON "loyalty_ledger"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "referrals_code_key" ON "referrals"("code");

-- CreateIndex
CREATE UNIQUE INDEX "referrals_referred_id_key" ON "referrals"("referred_id");

-- CreateIndex
CREATE INDEX "referrals_referrer_id_status_created_at_idx" ON "referrals"("referrer_id", "status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "testimonials_consent_id_key" ON "testimonials"("consent_id");

-- CreateIndex
CREATE INDEX "testimonials_status_published_at_idx" ON "testimonials"("status", "published_at");

-- CreateIndex
CREATE INDEX "testimonial_consents_user_id_granted_at_idx" ON "testimonial_consents"("user_id", "granted_at");

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_key_key" ON "campaigns"("key");

-- CreateIndex
CREATE INDEX "campaigns_status_starts_at_idx" ON "campaigns"("status", "starts_at");

-- CreateIndex
CREATE UNIQUE INDEX "experiments_key_key" ON "experiments"("key");

-- CreateIndex
CREATE INDEX "experiments_status_starts_at_idx" ON "experiments"("status", "starts_at");

-- CreateIndex
CREATE INDEX "policy_versions_policy_key_status_effective_at_idx" ON "policy_versions"("policy_key", "status", "effective_at");

-- CreateIndex
CREATE UNIQUE INDEX "policy_versions_policy_key_version_key" ON "policy_versions"("policy_key", "version");

-- CreateIndex
CREATE INDEX "data_access_logs_resource_type_resource_id_created_at_idx" ON "data_access_logs"("resource_type", "resource_id", "created_at");

-- CreateIndex
CREATE INDEX "data_access_logs_actor_id_created_at_idx" ON "data_access_logs"("actor_id", "created_at");

-- CreateIndex
CREATE INDEX "retention_jobs_policy_key_status_created_at_idx" ON "retention_jobs"("policy_key", "status", "created_at");

-- CreateIndex
CREATE INDEX "webhook_events_status_created_at_idx" ON "webhook_events"("status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_events_provider_provider_event_id_key" ON "webhook_events"("provider", "provider_event_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_runs_idempotency_key_key" ON "job_runs"("idempotency_key");

-- CreateIndex
CREATE INDEX "job_runs_job_key_status_created_at_idx" ON "job_runs"("job_key", "status", "created_at");

-- AddForeignKey
ALTER TABLE "clusters" ADD CONSTRAINT "clusters_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_areas" ADD CONSTRAINT "service_areas_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_areas" ADD CONSTRAINT "service_areas_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "clusters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capacity_limits" ADD CONSTRAINT "capacity_limits_service_area_id_fkey" FOREIGN KEY ("service_area_id") REFERENCES "service_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "society_sitter_pools" ADD CONSTRAINT "society_sitter_pools_society_id_fkey" FOREIGN KEY ("society_id") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "society_sitter_pools" ADD CONSTRAINT "society_sitter_pools_sitter_id_fkey" FOREIGN KEY ("sitter_id") REFERENCES "sitter_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "society_events" ADD CONSTRAINT "society_events_society_id_fkey" FOREIGN KEY ("society_id") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "society_partnerships" ADD CONSTRAINT "society_partnerships_society_id_fkey" FOREIGN KEY ("society_id") REFERENCES "societies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_locations" ADD CONSTRAINT "partner_locations_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_locations" ADD CONSTRAINT "partner_locations_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_verifications" ADD CONSTRAINT "partner_verifications_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_services" ADD CONSTRAINT "partner_services_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_orders" ADD CONSTRAINT "partner_orders_partner_service_id_fkey" FOREIGN KEY ("partner_service_id") REFERENCES "partner_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_orders" ADD CONSTRAINT "partner_orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_orders" ADD CONSTRAINT "partner_orders_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entitlement_consumption" ADD CONSTRAINT "entitlement_consumption_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entitlement_consumption" ADD CONSTRAINT "entitlement_consumption_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_ledger" ADD CONSTRAINT "loyalty_ledger_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referred_id_fkey" FOREIGN KEY ("referred_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_consent_id_fkey" FOREIGN KEY ("consent_id") REFERENCES "testimonial_consents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonial_consents" ADD CONSTRAINT "testimonial_consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Keep UUID defaults available to controlled SQL jobs as well as Prisma clients.
ALTER TABLE "cities" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "clusters" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "service_areas" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "capacity_limits" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "society_events" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "society_partnerships" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "partners" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "partner_locations" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "partner_verifications" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "partner_services" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "partner_orders" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "entitlement_consumption" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "loyalty_ledger" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "referrals" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "testimonials" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "testimonial_consents" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "campaigns" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "experiments" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "policy_versions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "retention_jobs" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "webhook_events" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "job_runs" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- Cross-field invariants must hold regardless of which trusted worker writes.
ALTER TABLE "capacity_limits" ADD CONSTRAINT "capacity_limits_counts_check" CHECK ("maximum" >= 0 AND "reserved" >= 0 AND "reserved" <= "maximum");
ALTER TABLE "society_events" ADD CONSTRAINT "society_events_window_check" CHECK ("ends_at" > "starts_at" AND ("capacity" IS NULL OR "capacity" > 0));
ALTER TABLE "society_partnerships" ADD CONSTRAINT "society_partnerships_window_check" CHECK ("ends_at" IS NULL OR "starts_at" IS NULL OR "ends_at" > "starts_at");
ALTER TABLE "partner_orders" ADD CONSTRAINT "partner_orders_amount_check" CHECK ("amount_paise" IS NULL OR "amount_paise" >= 0);
ALTER TABLE "entitlement_consumption" ADD CONSTRAINT "entitlement_consumption_quantity_check" CHECK ("quantity" > 0);
ALTER TABLE "testimonials" ADD CONSTRAINT "published_testimonial_consent_check" CHECK ("status" <> 'PUBLISHED' OR ("consent_id" IS NOT NULL AND "published_at" IS NOT NULL));
ALTER TABLE "testimonial_consents" ADD CONSTRAINT "testimonial_consent_window_check" CHECK (("withdrawn_at" IS NULL OR "withdrawn_at" >= "granted_at") AND ("expires_at" IS NULL OR "expires_at" > "granted_at"));
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_window_budget_check" CHECK (("ends_at" IS NULL OR "starts_at" IS NULL OR "ends_at" > "starts_at") AND ("budget_paise" IS NULL OR "budget_paise" >= 0));
ALTER TABLE "experiments" ADD CONSTRAINT "experiments_window_check" CHECK ("ends_at" IS NULL OR "starts_at" IS NULL OR "ends_at" > "starts_at");
ALTER TABLE "retention_jobs" ADD CONSTRAINT "retention_jobs_counts_check" CHECK ("scanned" >= 0 AND "affected" >= 0 AND "affected" <= "scanned");
ALTER TABLE "webhook_events" ADD CONSTRAINT "webhook_events_attempts_check" CHECK ("attempts" >= 0);

-- These are operational/private domains. They remain unreachable from direct
-- Supabase client roles until a narrower reviewed policy is added explicitly.
REVOKE ALL ON public.cities, public.clusters, public.service_areas, public.capacity_limits,
  public.society_sitter_pools, public.society_events, public.society_partnerships,
  public.partners, public.partner_locations, public.partner_verifications, public.partner_services, public.partner_orders,
  public.entitlement_consumption, public.loyalty_ledger, public.referrals,
  public.testimonials, public.testimonial_consents, public.campaigns, public.experiments,
  public.policy_versions, public.data_access_logs, public.retention_jobs, public.webhook_events, public.job_runs
FROM anon, authenticated;

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capacity_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.society_sitter_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.society_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.society_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlement_consumption ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonial_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retention_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_runs ENABLE ROW LEVEL SECURITY;
