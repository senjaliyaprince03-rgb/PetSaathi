-- PetSaathi uses server-side APIs for domain data. RLS remains enabled as a
-- second boundary so browser keys cannot bypass role-aware projections.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN CREATE ROLE anon NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
END;
$$;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  person_name text;
BEGIN
  person_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'name', ''),
    NULLIF(NEW.phone, ''),
    split_part(COALESCE(NEW.email, 'Pet parent'), '@', 1)
  );

  INSERT INTO public.users (
    id, auth_user_id, email, phone_e164, display_name, status, created_at, updated_at
  ) VALUES (
    NEW.id, NEW.id, NEW.email, NEW.phone, person_name,
    CASE WHEN NEW.phone_confirmed_at IS NOT NULL OR NEW.email_confirmed_at IS NOT NULL
      THEN 'ACTIVE'::public."AccountStatus"
      ELSE 'PENDING'::public."AccountStatus"
    END,
    now(), now()
  )
  ON CONFLICT (auth_user_id) DO UPDATE SET
    email = EXCLUDED.email,
    phone_e164 = EXCLUDED.phone_e164,
    updated_at = now();

  INSERT INTO public.user_roles (user_id, role, granted_at)
  VALUES (NEW.id, 'CUSTOMER'::public."Role", now())
  ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.customer_profiles (id, user_id, preferred_language)
  VALUES (gen_random_uuid(), NEW.id, 'en')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_verified_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (NEW.phone_confirmed_at IS NOT NULL OR NEW.email_confirmed_at IS NOT NULL) THEN
    UPDATE public.users
    SET status = 'ACTIVE'::public."AccountStatus", last_login_at = now(), updated_at = now()
    WHERE auth_user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF to_regclass('auth.users') IS NOT NULL THEN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

    DROP TRIGGER IF EXISTS on_auth_user_verified ON auth.users;
    CREATE TRIGGER on_auth_user_verified
      AFTER UPDATE OF phone_confirmed_at, email_confirmed_at ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_verified_auth_user();
  END IF;
END;
$$;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sitter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_medical_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sitter_service_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sitter_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corrective_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.society_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlement_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public catalogue tables are deliberately readable but never writable by browser roles.
GRANT SELECT ON public.service_types, public.training_modules, public.feature_flags, public.societies, public.plan_versions, public.content_entries TO anon, authenticated;
ALTER TABLE public.service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.societies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_active_services ON public.service_types FOR SELECT USING (active = true);
CREATE POLICY public_active_training ON public.training_modules FOR SELECT USING (active = true);
CREATE POLICY public_enabled_flags ON public.feature_flags FOR SELECT USING (enabled = true);
CREATE POLICY public_active_societies ON public.societies FOR SELECT USING (status IN ('ACTIVE', 'PILOT'));
CREATE POLICY public_active_plans ON public.plan_versions FOR SELECT USING (active = true);
CREATE POLICY public_published_content ON public.content_entries FOR SELECT USING (status = 'PUBLISHED'::public."ContentStatus");

COMMENT ON FUNCTION public.handle_new_auth_user IS 'Creates the minimum private PetSaathi customer record after a Supabase Auth user is created.';
COMMENT ON FUNCTION public.handle_verified_auth_user IS 'Activates the corresponding PetSaathi account only after Supabase verifies a phone or email.';
