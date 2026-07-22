-- New server-only workflow tables must never be reachable through Supabase's
-- anon/authenticated PostgREST roles. The modular monolith exposes projected,
-- role-aware APIs instead.
REVOKE ALL ON public.rate_limit_buckets FROM anon, authenticated;
REVOKE ALL ON public.upload_objects FROM anon, authenticated;
REVOKE ALL ON public.leads FROM anon, authenticated;
REVOKE ALL ON public.account_requests FROM anon, authenticated;

ALTER TABLE public.rate_limit_buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upload_objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_requests ENABLE ROW LEVEL SECURITY;

-- Feature rules and society contact details are operational configuration,
-- not public catalogue records. Public pages must use server-side projections.
DROP POLICY IF EXISTS public_enabled_flags ON public.feature_flags;
DROP POLICY IF EXISTS public_active_societies ON public.societies;
REVOKE ALL ON public.feature_flags, public.societies FROM anon, authenticated;
