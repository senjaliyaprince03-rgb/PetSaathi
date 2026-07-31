CREATE TABLE "programme_verification_tokens" (
  "id" UUID NOT NULL,
  "programme_id" UUID NOT NULL,
  "membership_id" UUID NOT NULL,
  "token_hash" VARCHAR(64) NOT NULL,
  "expires_at" TIMESTAMPTZ NOT NULL,
  "attempt_count" INTEGER NOT NULL DEFAULT 0,
  "max_attempts" INTEGER NOT NULL DEFAULT 5,
  "consumed_at" TIMESTAMPTZ,
  "revoked_at" TIMESTAMPTZ,
  "issued_by" UUID NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "programme_verification_tokens_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "programme_verification_tokens_attempt_count_check"
    CHECK ("attempt_count" >= 0),
  CONSTRAINT "programme_verification_tokens_max_attempts_check"
    CHECK ("max_attempts" BETWEEN 1 AND 10),
  CONSTRAINT "programme_verification_tokens_programme_id_fkey"
    FOREIGN KEY ("programme_id") REFERENCES "partner_programmes"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "programme_verification_tokens_membership_id_fkey"
    FOREIGN KEY ("membership_id") REFERENCES "programme_memberships"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "programme_verification_tokens_issued_by_fkey"
    FOREIGN KEY ("issued_by") REFERENCES "users"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "programme_verification_tokens_token_hash_key"
  ON "programme_verification_tokens"("token_hash");
CREATE INDEX "programme_verification_tokens_membership_id_expires_at_idx"
  ON "programme_verification_tokens"("membership_id", "expires_at");
CREATE INDEX "programme_verification_tokens_programme_id_expires_at_idx"
  ON "programme_verification_tokens"("programme_id", "expires_at");
CREATE INDEX "programme_verification_tokens_expires_at_consumed_at_revoked_at_idx"
  ON "programme_verification_tokens"("expires_at", "consumed_at", "revoked_at");

REVOKE ALL ON public.programme_verification_tokens FROM anon, authenticated;
ALTER TABLE public.programme_verification_tokens ENABLE ROW LEVEL SECURITY;
