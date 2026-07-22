ALTER TABLE public.sitter_profiles
ADD COLUMN service_locality TEXT;

CREATE INDEX sitter_profiles_service_locality_status_idx
ON public.sitter_profiles (service_locality, status);
