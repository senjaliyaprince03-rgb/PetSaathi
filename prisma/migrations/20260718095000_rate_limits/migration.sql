CREATE TABLE "rate_limit_buckets" (
  "key" TEXT NOT NULL,
  "window_start" TIMESTAMPTZ NOT NULL,
  "count" INTEGER NOT NULL,
  "expires_at" TIMESTAMPTZ NOT NULL,
  CONSTRAINT "rate_limit_buckets_pkey" PRIMARY KEY ("key")
);

CREATE INDEX "rate_limit_buckets_expires_at_idx" ON "rate_limit_buckets"("expires_at");
