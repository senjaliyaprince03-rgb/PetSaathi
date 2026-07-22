ALTER TABLE "plan_versions" ADD COLUMN "provider_plan_id" TEXT;
ALTER TABLE "plan_versions" ADD COLUMN "total_billing_cycles" INTEGER NOT NULL DEFAULT 12;
CREATE UNIQUE INDEX "plan_versions_provider_plan_id_key" ON "plan_versions"("provider_plan_id");
ALTER TABLE "plan_versions" ADD CONSTRAINT "plan_versions_total_billing_cycles_check" CHECK ("total_billing_cycles" > 0 AND "total_billing_cycles" <= 120);

-- Provider identifiers and immutable entitlement definitions are projected by
-- server routes rather than exposed directly through PostgREST.
DROP POLICY IF EXISTS public_active_plans ON public.plan_versions;
REVOKE ALL ON public.plan_versions FROM anon, authenticated;
