DO $$
BEGIN
  IF to_regclass('storage.buckets') IS NOT NULL THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES
      ('upload-quarantine', 'upload-quarantine', false, 15728640, ARRAY['image/jpeg','image/png','image/webp','application/pdf']),
      ('pet-media', 'pet-media', false, 8388608, ARRAY['image/jpeg','image/png','image/webp']),
      ('care-reports', 'care-reports', false, 15728640, ARRAY['image/jpeg','image/png','image/webp']),
      ('incident-evidence', 'incident-evidence', false, 15728640, ARRAY['image/jpeg','image/png','image/webp','application/pdf']),
      ('identity-evidence', 'identity-evidence', false, 15728640, ARRAY['image/jpeg','image/png','application/pdf'])
    ON CONFLICT (id) DO UPDATE SET
      public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;
  END IF;
END;
$$;

-- No anon/authenticated storage.object policies are created. Uploads are issued
-- only through purpose-authorised, short-lived URLs and land in quarantine.
