ALTER TABLE public.participants
  ADD COLUMN IF NOT EXISTS dietary_profile text,
  ADD COLUMN IF NOT EXISTS food_allergies text,
  ADD COLUMN IF NOT EXISTS dietary_consent boolean NOT NULL DEFAULT false;