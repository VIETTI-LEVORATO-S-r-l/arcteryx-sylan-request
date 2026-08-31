ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS rules_url text NOT NULL DEFAULT '/regolamento',
  ADD COLUMN IF NOT EXISTS compliance_checklist jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.applications ALTER COLUMN country SET DEFAULT 'Italia';

UPDATE public.events SET
  title = 'ARC''TERYX × VIETTI — SYLAN 2 COMMUNITY TRAIL RUN',
  location = 'Lago Maggiore, Piemonte',
  meeting_point = 'Arona, Lago Maggiore — punto di ritrovo comunicato ai partecipanti confermati',
  route_notes = 'Percorso guidato su sentieri naturali con tratti tecnici e sconnessi. Ritmo community, gruppi accompagnati da guide. Nessun cronometraggio.',
  surface = 'Sentiero, sterrato, tratti tecnici'
WHERE slug = 'sylan-2-trail-run';

WITH e AS (SELECT id FROM public.events WHERE slug = 'sylan-2-trail-run')
UPDATE public.date_options d SET event_date = v.dt, is_active = true
FROM (
  SELECT row_number() OVER (ORDER BY sort_order, event_date) AS rn, id
  FROM public.date_options
  WHERE event_id = (SELECT id FROM e)
) src,
(VALUES (1, DATE '2026-09-17'), (2, DATE '2026-09-18'), (3, DATE '2026-09-19')) AS v(rn, dt)
WHERE d.id = src.id AND src.rn = v.rn;