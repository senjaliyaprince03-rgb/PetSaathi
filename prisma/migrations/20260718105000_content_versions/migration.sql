CREATE TABLE "content_versions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "content_id" UUID NOT NULL,
  "version" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "excerpt" TEXT,
  "body" JSONB NOT NULL,
  "status" "ContentStatus" NOT NULL,
  "author_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "content_versions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "content_versions_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_entries"("id") ON DELETE RESTRICT
);

CREATE UNIQUE INDEX "content_versions_content_id_version_key" ON "content_versions"("content_id", "version");
CREATE INDEX "content_versions_content_id_created_at_idx" ON "content_versions"("content_id", "created_at");

REVOKE ALL ON public.content_versions FROM anon, authenticated;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;

-- Published content is projected through server pages so draft/version metadata
-- cannot be inferred through PostgREST.
DROP POLICY IF EXISTS public_published_content ON public.content_entries;
REVOKE ALL ON public.content_entries FROM anon, authenticated;
