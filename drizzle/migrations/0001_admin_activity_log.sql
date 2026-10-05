CREATE TABLE public.admin_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  actor_id uuid,
  actor_email text,
  action text NOT NULL,
  entity text,
  entity_id text,
  summary text
);
GRANT SELECT ON public.admin_activity TO authenticated;
GRANT ALL ON public.admin_activity TO service_role;
ALTER TABLE public.admin_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin read activity" ON public.admin_activity FOR SELECT TO authenticated USING (public.is_admin());
CREATE INDEX admin_activity_created_idx ON public.admin_activity (created_at DESC);

CREATE OR REPLACE FUNCTION public.log_admin_event(_action text, _summary text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF _action NOT IN ('sign_in','sign_out','password_change') THEN
    RAISE EXCEPTION 'invalid action';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'not authorised';
  END IF;
  INSERT INTO public.admin_activity(actor_id, actor_email, action, summary)
  VALUES (auth.uid(), auth.jwt()->>'email', _action, left(_summary, 300));
END $$;
REVOKE EXECUTE ON FUNCTION public.log_admin_event(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.log_admin_event(text, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.log_content_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  rec jsonb;
  label text;
BEGIN
  IF auth.uid() IS NULL THEN RETURN NULL; END IF;
  IF TG_OP = 'UPDATE' AND (to_jsonb(NEW) - 'sort_order' - 'updated_at') = (to_jsonb(OLD) - 'sort_order' - 'updated_at') THEN
    RETURN NULL;
  END IF;
  rec := CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(NEW) END;
  label := coalesce(rec->>'title', rec->>'name', rec->>'label', rec->>'full_name', rec->>'degree', rec->>'job_title', rec->>'platform', rec->>'site_name', rec->>'subject');
  INSERT INTO public.admin_activity(actor_id, actor_email, action, entity, entity_id, summary)
  VALUES (auth.uid(), auth.jwt()->>'email', lower(TG_OP), TG_TABLE_NAME, rec->>'id', left(label, 300));
  RETURN NULL;
END $$;
REVOKE EXECUTE ON FUNCTION public.log_content_change() FROM PUBLIC, anon, authenticated;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['profile','site_settings','sections','nav_items','about_cards','skill_categories','skills','education','experience','projects','certifications','achievements','services','social_links','contact_info','resumes','contact_messages'] LOOP
    EXECUTE format('CREATE TRIGGER log_activity AFTER INSERT OR UPDATE OR DELETE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.log_content_change()', t);
  END LOOP;
END $$;