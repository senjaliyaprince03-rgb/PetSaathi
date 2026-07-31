ALTER TABLE "testimonials"
ADD COLUMN "booking_id" UUID;

CREATE UNIQUE INDEX "testimonials_booking_id_key"
ON "testimonials" ("booking_id");

ALTER TABLE "testimonials"
ADD CONSTRAINT "testimonials_booking_id_fkey"
FOREIGN KEY ("booking_id") REFERENCES "bookings"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "testimonial_consents"
ADD CONSTRAINT "testimonial_consent_scope_check"
CHECK ("scope" IN ('TEXT_ONLY', 'FIRST_NAME_CITY'))
NOT VALID;

ALTER TABLE "testimonials"
ADD CONSTRAINT "published_testimonial_provenance_check"
CHECK (
  "status" <> 'PUBLISHED'
  OR (
    "user_id" IS NOT NULL
    AND "booking_id" IS NOT NULL
    AND "consent_id" IS NOT NULL
  )
)
NOT VALID;

ALTER TABLE "partner_programmes"
ADD CONSTRAINT "partner_programmes_date_window_check"
CHECK (
  "start_date" IS NULL
  OR "end_date" IS NULL
  OR "end_date" > "start_date"
)
NOT VALID;

CREATE UNIQUE INDEX "b2b_contracts_id_organization_id_key"
ON "b2b_contracts" ("id", "organization_id");

ALTER TABLE "partner_programmes"
ADD CONSTRAINT "partner_programmes_contract_organization_fkey"
FOREIGN KEY ("contract_id", "organization_id")
REFERENCES "b2b_contracts"("id", "organization_id")
ON DELETE NO ACTION ON UPDATE CASCADE
NOT VALID;

ALTER TABLE "programme_memberships"
ADD CONSTRAINT "programme_memberships_verified_at_check"
CHECK (
  "verification_status" <> 'VERIFIED'
  OR "verified_at" IS NOT NULL
)
NOT VALID;

ALTER TABLE "programme_memberships"
ADD CONSTRAINT "programme_memberships_expiry_window_check"
CHECK (
  "verified_at" IS NULL
  OR "eligibility_expiry" IS NULL
  OR "eligibility_expiry" > "verified_at"
)
NOT VALID;
