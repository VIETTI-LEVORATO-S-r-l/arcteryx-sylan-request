-- ENUMS
CREATE TYPE public.application_status AS ENUM ('APPLICATION_RECEIVED','WAITLISTED','ACCEPTED','DECLINED','CONFIRMED','CANCELLED');

-- EVENTS
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  location text NOT NULL DEFAULT 'LAKE MAGGIORE',
  meeting_point text NOT NULL DEFAULT 'VIETTI — ARONA, LAKE MAGGIORE',
  meeting_time text NOT NULL DEFAULT '09:00',
  distance_km text NOT NULL DEFAULT '[XX KM]',
  elevation_m text NOT NULL DEFAULT '[XXX M D+]',
  surface text NOT NULL DEFAULT 'MOSTLY OFF-ROAD',
  route_notes text NOT NULL DEFAULT 'Final route details will be confirmed before the event.',
  latitude double precision NOT NULL DEFAULT 45.7597,
  longitude double precision NOT NULL DEFAULT 8.5556,
  weather_enabled boolean NOT NULL DEFAULT true,
  applications_open boolean NOT NULL DEFAULT true,
  waitlist_mode boolean NOT NULL DEFAULT false,
  max_applications integer NOT NULL DEFAULT 500,
  capacity integer NOT NULL DEFAULT 40,
  final_date_id uuid,
  privacy_url text NOT NULL DEFAULT '/privacy',
  terms_url text NOT NULL DEFAULT '/terms',
  cookie_url text NOT NULL DEFAULT '/cookies',
  privacy_version text NOT NULL DEFAULT 'v1-draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon, authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events public read" ON public.events FOR SELECT TO anon, authenticated USING (true);

-- DATE OPTIONS
CREATE TABLE public.date_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  event_date date NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, event_date)
);
GRANT SELECT ON public.date_options TO anon, authenticated;
GRANT ALL ON public.date_options TO service_role;
ALTER TABLE public.date_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "date options public read" ON public.date_options FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public.events ADD CONSTRAINT events_final_date_fk FOREIGN KEY (final_date_id) REFERENCES public.date_options(id) ON DELETE SET NULL;

-- APPLICATIONS (no public access at all)
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  is_adult boolean NOT NULL DEFAULT false,
  preferred_date_id uuid NOT NULL REFERENCES public.date_options(id) ON DELETE RESTRICT,
  running_level text NOT NULL,
  trail_experience text NOT NULL,
  pace text,
  shoe_size_system text NOT NULL,
  shoe_size text NOT NULL,
  footwear_fit text NOT NULL,
  instagram_handle text,
  runner_description text,
  status public.application_status NOT NULL DEFAULT 'APPLICATION_RECEIVED',
  confirmation_token uuid NOT NULL DEFAULT gen_random_uuid(),
  ip_hash text,
  UNIQUE (event_id, email)
);
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.application_date_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  date_option_id uuid NOT NULL REFERENCES public.date_options(id) ON DELETE CASCADE,
  UNIQUE (application_id, date_option_id)
);
GRANT ALL ON public.application_date_availability TO service_role;
ALTER TABLE public.application_date_availability ENABLE ROW LEVEL SECURITY;

-- PARTICIPANTS (stage two)
CREATE TABLE public.participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL UNIQUE REFERENCES public.applications(id) ON DELETE CASCADE,
  attendance_confirmed boolean NOT NULL DEFAULT false,
  emergency_contact_name text,
  emergency_contact_phone text,
  final_shoe_size text,
  rules_acknowledged boolean NOT NULL DEFAULT false,
  image_release_accepted boolean NOT NULL DEFAULT false,
  medical_note text,
  confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.participants TO service_role;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- CONSENTS
CREATE TABLE public.consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  consent_key text NOT NULL,
  granted boolean NOT NULL,
  policy_version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.consents TO service_role;
ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;

-- EVENT SETTINGS (key/value editable content, e.g. legal drafts)
CREATE TABLE public.event_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  key text NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, key)
);
GRANT SELECT ON public.event_settings TO anon, authenticated;
GRANT ALL ON public.event_settings TO service_role;
ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.event_settings FOR SELECT TO anon, authenticated USING (true);

-- Aggregated, anonymous preference stats
CREATE OR REPLACE FUNCTION public.date_preference_stats(_event_id uuid)
RETURNS TABLE (date_option_id uuid, event_date date, preferred_count bigint, total bigint, pct numeric)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH valid AS (
    SELECT preferred_date_id FROM public.applications
    WHERE event_id = _event_id AND status <> 'CANCELLED'
  ), t AS (SELECT count(*)::bigint AS total FROM valid)
  SELECT d.id, d.event_date,
         (SELECT count(*) FROM valid v WHERE v.preferred_date_id = d.id)::bigint,
         t.total,
         CASE WHEN t.total = 0 THEN 0
              ELSE round(((SELECT count(*) FROM valid v WHERE v.preferred_date_id = d.id)::numeric * 100) / t.total, 0)
         END
  FROM public.date_options d, t
  WHERE d.event_id = _event_id AND d.is_active
  ORDER BY d.sort_order, d.event_date;
$$;
GRANT EXECUTE ON FUNCTION public.date_preference_stats(uuid) TO anon, authenticated, service_role;

-- SEED
INSERT INTO public.events (slug, title) VALUES ('sylan-2-trail-run', 'ARC''TERYX × VIETTI — SYLAN 2 TRAIL RUN');
INSERT INTO public.date_options (event_id, event_date, sort_order)
SELECT id, d.dt, d.ord FROM public.events e,
  (VALUES ('2026-09-17'::date, 1), ('2026-09-18'::date, 2), ('2026-09-19'::date, 3)) AS d(dt, ord)
WHERE e.slug = 'sylan-2-trail-run';
