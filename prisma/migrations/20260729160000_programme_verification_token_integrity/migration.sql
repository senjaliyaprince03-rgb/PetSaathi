ALTER TABLE "programme_memberships"
ADD CONSTRAINT "programme_memberships_id_programme_id_key"
UNIQUE ("id", "programme_id");

ALTER TABLE "programme_verification_tokens"
ADD CONSTRAINT "programme_verification_tokens_membership_programme_fkey"
FOREIGN KEY ("membership_id", "programme_id")
REFERENCES "programme_memberships" ("id", "programme_id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "programme_verification_tokens"
ADD CONSTRAINT "programme_verification_tokens_attempt_limit_check"
CHECK ("attempt_count" <= "max_attempts"),
ADD CONSTRAINT "programme_verification_tokens_expiry_check"
CHECK ("expires_at" > "created_at"),
ADD CONSTRAINT "programme_verification_tokens_terminal_state_check"
CHECK (NOT ("consumed_at" IS NOT NULL AND "revoked_at" IS NOT NULL));

CREATE UNIQUE INDEX
"programme_verification_tokens_one_active_membership_idx"
ON "programme_verification_tokens" ("membership_id")
WHERE "consumed_at" IS NULL AND "revoked_at" IS NULL;
