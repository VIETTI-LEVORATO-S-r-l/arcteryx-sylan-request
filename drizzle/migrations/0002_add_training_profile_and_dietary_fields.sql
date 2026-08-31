ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS weekly_volume TEXT,
  ADD COLUMN IF NOT EXISTS longest_run TEXT,
  ADD COLUMN IF NOT EXISTS monthly_elevation TEXT,
  ADD COLUMN IF NOT EXISTS recent_activity TEXT,
  ADD COLUMN IF NOT EXISTS dietary_profile TEXT,
  ADD COLUMN IF NOT EXISTS food_allergies TEXT;