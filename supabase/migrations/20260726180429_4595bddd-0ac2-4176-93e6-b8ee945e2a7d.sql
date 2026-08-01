-- 1. Sequential complaint references
CREATE SEQUENCE IF NOT EXISTS public.complaint_ref_seq START 1;

CREATE OR REPLACE FUNCTION public.next_complaint_reference()
RETURNS text LANGUAGE sql VOLATILE SET search_path TO 'public' AS $$
  SELECT 'CMP' || lpad(nextval('public.complaint_ref_seq')::text, 4, '0');
$$;

-- keep new references ahead of anything already stored
SELECT setval('public.complaint_ref_seq', GREATEST(1, (SELECT count(*) FROM public.complaints)));

ALTER TABLE public.complaints ALTER COLUMN reference SET DEFAULT public.next_complaint_reference();

-- 2. New "Assigned" stage
ALTER TYPE public.complaint_status ADD VALUE IF NOT EXISTS 'Assigned' BEFORE 'In Progress';

-- 3. Status history
CREATE TABLE IF NOT EXISTS public.complaint_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  old_status public.complaint_status,
  new_status public.complaint_status NOT NULL,
  changed_by uuid,
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.complaint_status_history TO authenticated;
GRANT ALL ON public.complaint_status_history TO service_role;

ALTER TABLE public.complaint_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students read history of own complaints"
ON public.complaint_status_history FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.complaints c WHERE c.id = complaint_id AND c.user_id = auth.uid()));

CREATE POLICY "Admins read all history"
ON public.complaint_status_history FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS complaint_status_history_complaint_idx
  ON public.complaint_status_history (complaint_id, created_at DESC);