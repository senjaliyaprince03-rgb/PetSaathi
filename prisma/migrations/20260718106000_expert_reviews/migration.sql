CREATE TABLE "expert_reviews" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "reviewer_id" UUID NOT NULL,
  "reviewer_name" TEXT NOT NULL,
  "credentials" TEXT NOT NULL,
  "scope" TEXT NOT NULL,
  "verdict" TEXT NOT NULL,
  "notes" TEXT NOT NULL,
  "reviewed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "expert_reviews_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "content_entries" ADD CONSTRAINT "content_entries_expert_review_id_fkey" FOREIGN KEY ("expert_review_id") REFERENCES "expert_reviews"("id") ON DELETE RESTRICT;
CREATE INDEX "expert_reviews_reviewer_id_reviewed_at_idx" ON "expert_reviews"("reviewer_id", "reviewed_at");
REVOKE ALL ON public.expert_reviews FROM anon, authenticated;
ALTER TABLE public.expert_reviews ENABLE ROW LEVEL SECURITY;
