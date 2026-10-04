-- Listing tables: public sees only published rows (admins keep full access via "admin manage" policies)
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['about_cards','skill_categories','skills','education','experience','projects','certifications','achievements','services','social_links'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'public read '||t, t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated USING (visible = true)', 'public read '||t, t);
  END LOOP;
  FOREACH t IN ARRAY ARRAY['sections','nav_items'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'public read '||t, t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated USING (enabled = true)', 'public read '||t, t);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "public read resumes" ON public.resumes;
CREATE POLICY "public read resumes" ON public.resumes FOR SELECT TO anon, authenticated USING (is_active = true);

-- Singletons: only the site's single row, and sensitive columns hidden from anonymous visitors
DROP POLICY IF EXISTS "public read profile" ON public.profile;
CREATE POLICY "public read profile" ON public.profile FOR SELECT TO anon, authenticated
  USING (id = (SELECT p.id FROM public.profile p ORDER BY p.created_at LIMIT 1));
REVOKE SELECT ON public.profile FROM anon;
GRANT SELECT (id, full_name, professional_title, tagline, bio_short, bio_long, avatar_url, email, location, website, availability,
  hero_primary_label, hero_primary_href, hero_primary_visible, hero_secondary_label, hero_secondary_href, hero_secondary_visible,
  hero_tertiary_label, hero_tertiary_href, hero_tertiary_visible, created_at, updated_at) ON public.profile TO anon;

DROP POLICY IF EXISTS "public read site_settings" ON public.site_settings;
CREATE POLICY "public read site_settings" ON public.site_settings FOR SELECT TO anon, authenticated
  USING (id = (SELECT s.id FROM public.site_settings s ORDER BY s.created_at LIMIT 1));
REVOKE SELECT ON public.site_settings FROM anon;
GRANT SELECT (id, site_name, logo_url, favicon_url, accent_color, default_theme, footer_text, copyright, meta_title, meta_description,
  og_title, og_description, og_image_url, canonical_url, created_at, updated_at) ON public.site_settings TO anon;

ALTER TABLE public.contact_info
  ADD COLUMN IF NOT EXISTS public_phone text GENERATED ALWAYS AS (CASE WHEN phone_visible THEN phone END) STORED;
DROP POLICY IF EXISTS "public read contact_info" ON public.contact_info;
CREATE POLICY "public read contact_info" ON public.contact_info FOR SELECT TO anon, authenticated
  USING (id = (SELECT c.id FROM public.contact_info c ORDER BY c.created_at LIMIT 1));
REVOKE SELECT ON public.contact_info FROM anon;
GRANT SELECT (id, email, email_visible, phone_visible, public_phone, location, location_visible, website, website_visible, note, created_at, updated_at)
  ON public.contact_info TO anon;

-- Contact form: only well-formed, unread submissions
DROP POLICY IF EXISTS "anyone can send a message" ON public.contact_messages;
CREATE POLICY "anyone can send a message" ON public.contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (
    is_read = false
    AND char_length(name) BETWEEN 1 AND 120
    AND char_length(email) BETWEEN 3 AND 200 AND email LIKE '%@%'
    AND (subject IS NULL OR char_length(subject) <= 200)
    AND char_length(message) BETWEEN 5 AND 5000
  );