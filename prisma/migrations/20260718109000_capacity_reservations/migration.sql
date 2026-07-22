-- Capacity reservations make the per-area booking limit auditable and reversible.
CREATE TYPE "CapacityReservationStatus" AS ENUM ('HELD', 'CONSUMED', 'RELEASED');

CREATE TABLE "capacity_reservations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "booking_id" UUID NOT NULL,
    "capacity_limit_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "status" "CapacityReservationStatus" NOT NULL DEFAULT 'HELD',
    "release_reason" TEXT,
    "released_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capacity_reservations_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "capacity_reservations_quantity_check" CHECK ("quantity" > 0),
    CONSTRAINT "capacity_reservations_release_check" CHECK (
      ("status" = 'RELEASED' AND "released_at" IS NOT NULL AND NULLIF(BTRIM("release_reason"), '') IS NOT NULL)
      OR
      ("status" IN ('HELD', 'CONSUMED') AND "released_at" IS NULL AND "release_reason" IS NULL)
    )
);

CREATE UNIQUE INDEX "capacity_reservations_booking_id_key" ON "capacity_reservations"("booking_id");
CREATE INDEX "capacity_reservations_capacity_limit_id_status_created_at_idx" ON "capacity_reservations"("capacity_limit_id", "status", "created_at");

-- PostgreSQL treats NULL values as distinct in a regular unique constraint.
-- These indexes make immutable price versions unique for every nullable scope.
CREATE UNIQUE INDEX "service_prices_global_version_key"
  ON "service_prices"("service_type_id", "version")
  WHERE "variant_id" IS NULL AND "service_area_id" IS NULL;
CREATE UNIQUE INDEX "service_prices_area_version_key"
  ON "service_prices"("service_type_id", "service_area_id", "version")
  WHERE "variant_id" IS NULL AND "service_area_id" IS NOT NULL;
CREATE UNIQUE INDEX "service_prices_variant_global_version_key"
  ON "service_prices"("service_type_id", "variant_id", "version")
  WHERE "variant_id" IS NOT NULL AND "service_area_id" IS NULL;

ALTER TABLE "capacity_reservations"
  ADD CONSTRAINT "capacity_reservations_booking_id_fkey"
  FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "capacity_reservations"
  ADD CONSTRAINT "capacity_reservations_capacity_limit_id_fkey"
  FOREIGN KEY ("capacity_limit_id") REFERENCES "capacity_limits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Server-only until a purpose-specific customer policy is reviewed.
REVOKE ALL ON public.capacity_reservations FROM anon, authenticated;
ALTER TABLE public.capacity_reservations ENABLE ROW LEVEL SECURITY;
