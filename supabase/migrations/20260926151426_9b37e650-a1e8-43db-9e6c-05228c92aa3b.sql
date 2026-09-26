CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.admins (
  user_id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admins TO authenticated;
GRANT ALL ON public.admins TO service_role;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read own row" ON public.admins FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
$$;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

CREATE TABLE public.profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL DEFAULT '',
  professional_title TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  bio_short TEXT NOT NULL DEFAULT '',
  bio_long TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  website TEXT,
  availability TEXT,
  hero_primary_label TEXT NOT NULL DEFAULT 'View My Work',
  hero_primary_href TEXT NOT NULL DEFAULT '#projects',
  hero_primary_visible BOOLEAN NOT NULL DEFAULT true,
  hero_secondary_label TEXT NOT NULL DEFAULT 'Download Resume',
  hero_secondary_href TEXT NOT NULL DEFAULT '',
  hero_secondary_visible BOOLEAN NOT NULL DEFAULT true,
  hero_tertiary_label TEXT NOT NULL DEFAULT 'Contact Me',
  hero_tertiary_href TEXT NOT NULL DEFAULT '#contact',
  hero_tertiary_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.about_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL DEFAULT 'sparkles',
  title TEXT NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.nav_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.skill_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  icon_url TEXT,
  level TEXT,
  percent INT,
  experience TEXT,
  description TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  location TEXT,
  start_date TEXT,
  end_date TEXT,
  currently_studying BOOLEAN NOT NULL DEFAULT false,
  grade TEXT,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  logo_url TEXT,
  location TEXT,
  employment_type TEXT NOT NULL DEFAULT 'Full-time',
  start_date TEXT,
  end_date TEXT,
  currently_working BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  responsibilities TEXT[] NOT NULL DEFAULT '{}',
  technologies TEXT[] NOT NULL DEFAULT '{}',
  website TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL DEFAULT '',
  detailed_description TEXT,
  thumbnail_url TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  technologies TEXT[] NOT NULL DEFAULT '{}',
  category TEXT,
  github_url TEXT,
  demo_url TEXT,
  video_url TEXT,
  start_date TEXT,
  end_date TEXT,
  status TEXT NOT NULL DEFAULT 'Completed',
  role TEXT,
  team_size TEXT,
  features TEXT[] NOT NULL DEFAULT '{}',
  challenges TEXT,
  solutions TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  logo_url TEXT,
  issue_date TEXT,
  expiry_date TEXT,
  credential_id TEXT,
  credential_url TEXT,
  image_url TEXT,
  pdf_url TEXT,
  description TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  organization TEXT,
  date TEXT,
  image_url TEXT,
  certificate_url TEXT,
  external_url TEXT,
  category TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'sparkles',
  description TEXT,
  features TEXT[] NOT NULL DEFAULT '{}',
  starting_price TEXT,
  cta_label TEXT,
  cta_href TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'link',
  url TEXT NOT NULL,
  label TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  email_visible BOOLEAN NOT NULL DEFAULT true,
  phone TEXT,
  phone_visible BOOLEAN NOT NULL DEFAULT false,
  location TEXT,
  location_visible BOOLEAN NOT NULL DEFAULT true,
  website TEXT,
  website_visible BOOLEAN NOT NULL DEFAULT true,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL DEFAULT 'Resume',
  file_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'Portfolio',
  logo_url TEXT,
  favicon_url TEXT,
  accent_color TEXT NOT NULL DEFAULT '#1D4ED8',
  default_theme TEXT NOT NULL DEFAULT 'system',
  footer_text TEXT NOT NULL DEFAULT '',
  copyright TEXT NOT NULL DEFAULT '',
  contact_email TEXT,
  meta_title TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  og_title TEXT NOT NULL DEFAULT '',
  og_description TEXT NOT NULL DEFAULT '',
  og_image_url TEXT,
  canonical_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['profile','about_cards','sections','nav_items','skill_categories','skills','education','experience','projects','certifications','achievements','services','social_links','contact_info','resumes','site_settings']
  LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "public read %1$s" ON public.%1$I FOR SELECT TO anon, authenticated USING (true)', t);
    EXECUTE format('CREATE POLICY "admin manage %1$s" ON public.%1$I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', t);
    EXECUTE format('CREATE TRIGGER set_updated_at_%1$s BEFORE UPDATE ON public.%1$I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t);
  END LOOP;
END $$;

GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can send a message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin read messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin update messages" ON public.contact_messages FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin delete messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.is_admin());

CREATE POLICY "admin read media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "admin upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "admin update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "admin delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.is_admin());

INSERT INTO public.profile (full_name, professional_title, tagline, bio_short, bio_long, email, phone, location, website, availability)
VALUES ('Dr Vishal Pandey', 'Dr Vishal Pandey', 'Clinician · Researcher · Health Data Enthusiast',
 'I combine clinical practice with data-driven research to improve patient outcomes.',
 'I am a clinician and researcher with a strong interest in evidence-based medicine, public health and applied health data analysis. Over the years I have worked across hospital departments, research collaborations and community health programmes, publishing and presenting work that connects day-to-day clinical care with measurable outcomes. I enjoy teaching, mentoring junior colleagues and building simple tools that make clinical work easier.',
 'drvishalpandey@gmail.com', '+91 00000 00000', 'India', 'https://example.com', 'Available for collaborations');

INSERT INTO public.about_cards (icon, title, value, sort_order) VALUES
 ('graduation-cap','Education','MBBS, MD',1),
 ('map-pin','Location','India',2),
 ('stethoscope','Current Role','Consultant Physician',3),
 ('heart','Interests','Evidence-based medicine, health data, teaching',4),
 ('circle-check','Availability','Open to research collaborations',5);

INSERT INTO public.sections (key, title, subtitle, sort_order) VALUES
 ('hero','Hero','',1),
 ('about','About Me','A little background',2),
 ('education','Education','Where I trained',3),
 ('skills','Skills','What I work with',4),
 ('experience','Experience','Where I have worked',5),
 ('projects','Featured Work','Selected projects and research',6),
 ('certifications','Certifications','Courses and credentials',7),
 ('achievements','Achievements','Recognition and highlights',8),
 ('services','Services','How I can help',9),
 ('contact','Contact','Let us get in touch',10);

INSERT INTO public.nav_items (label, href, sort_order) VALUES
 ('Home','#hero',1),('About','#about',2),('Education','#education',3),('Skills','#skills',4),
 ('Experience','#experience',5),('Work','#projects',6),('Certifications','#certifications',7),('Contact','#contact',8);

INSERT INTO public.skill_categories (id, name, sort_order) VALUES
 ('11111111-1111-1111-1111-111111111111','Clinical',1),
 ('22222222-2222-2222-2222-222222222222','Research',2),
 ('33333333-3333-3333-3333-333333333333','Data & Analytics',3),
 ('44444444-4444-4444-4444-444444444444','Tools',4),
 ('55555555-5555-5555-5555-555555555555','Soft Skills',5);

INSERT INTO public.skills (category_id, name, level, percent, sort_order) VALUES
 ('11111111-1111-1111-1111-111111111111','Internal Medicine','Expert',92,1),
 ('11111111-1111-1111-1111-111111111111','Emergency Care','Advanced',85,2),
 ('11111111-1111-1111-1111-111111111111','Preventive Health','Advanced',80,3),
 ('22222222-2222-2222-2222-222222222222','Clinical Research Design','Advanced',NULL,1),
 ('22222222-2222-2222-2222-222222222222','Scientific Writing','Advanced',88,2),
 ('33333333-3333-3333-3333-333333333333','Biostatistics','Intermediate',70,1),
 ('33333333-3333-3333-3333-333333333333','Python','Intermediate',65,2),
 ('33333333-3333-3333-3333-333333333333','SQL','Intermediate',60,3),
 ('44444444-4444-4444-4444-444444444444','SPSS',NULL,NULL,1),
 ('44444444-4444-4444-4444-444444444444','REDCap',NULL,NULL,2),
 ('55555555-5555-5555-5555-555555555555','Teaching & Mentoring','Expert',NULL,1),
 ('55555555-5555-5555-5555-555555555555','Patient Communication','Expert',NULL,2);

INSERT INTO public.education (degree, institution, location, start_date, end_date, grade, description, sort_order) VALUES
 ('MD, Internal Medicine','Government Medical College','India','2018','2021','Distinction','Postgraduate training in internal medicine with a thesis on cardiometabolic risk in young adults.',1),
 ('MBBS','Government Medical College','India','2012','2017','First Class','Undergraduate medical training with clinical rotations across all major specialties.',2);

INSERT INTO public.experience (job_title, company, location, employment_type, start_date, end_date, currently_working, description, responsibilities, technologies, sort_order) VALUES
 ('Consultant Physician','City Multispeciality Hospital','India','Full-time','2022',NULL,true,'Lead outpatient and inpatient care for adult medicine, with a focus on chronic disease management.',
  ARRAY['Manage the inpatient medicine ward and critical care referrals','Run a weekly chronic disease clinic','Supervise and teach resident doctors'],
  ARRAY['Clinical audit','Evidence-based protocols'],1),
 ('Senior Resident, Internal Medicine','Government Medical College Hospital','India','Full-time','2021','2022',false,'Supervised ward care, emergency admissions and resident teaching.',
  ARRAY['Managed emergency medical admissions','Coordinated multidisciplinary rounds'],
  ARRAY['Clinical research','SPSS'],2);

INSERT INTO public.projects (title, slug, short_description, detailed_description, technologies, category, status, role, team_size, features, challenges, solutions, featured, sort_order) VALUES
 ('Cardiometabolic Risk Screening Programme','cardiometabolic-risk-screening','A community screening programme that identified early cardiometabolic risk in over 2,000 adults.',
  'A structured community screening initiative delivered across three districts. We built a simple intake workflow, trained health workers, and used a scoring model to triage participants into follow-up tiers. The programme produced a reusable protocol now used by partner clinics.',
  ARRAY['Clinical protocol','Biostatistics','SPSS'],'Public Health','Completed','Principal investigator','Team of 8',
  ARRAY['Standardised screening form','Risk scoring and triage tiers','Referral pathway to specialist clinics','Outcome tracking at 6 and 12 months'],
  'Follow-up loss was high in the first cohort and data was captured inconsistently on paper.',
  'We moved to a single structured intake form and added scheduled reminder calls, which raised follow-up completion substantially.', true, 1),
 ('Antibiotic Stewardship Audit','antibiotic-stewardship-audit','A hospital-wide audit that reduced inappropriate antibiotic starts.',
  'A prospective audit of antibiotic prescribing across medicine wards, followed by a short intervention: a pocket guideline, prescriber feedback and a weekly review round. Repeat audit showed a clear improvement in guideline-concordant prescribing.',
  ARRAY['Clinical audit','Data analysis','Excel'],'Quality Improvement','Completed','Audit lead','Team of 5',
  ARRAY['Baseline and repeat audit cycles','Pocket prescribing guideline','Weekly stewardship round'],
  'Prescribers were reluctant to change familiar habits.',
  'Sharing anonymised ward-level feedback made the gap visible and drove voluntary change.', true, 2),
 ('Patient Follow-Up Reminder Tool','patient-followup-tool','A lightweight tool that keeps chronic-care patients on schedule.',
  'A small internal tool that tracks review dates for chronic disease patients and produces a daily call list for clinic staff. Built to be usable by non-technical staff with minimal training.',
  ARRAY['Python','SQL','Automation'],'Health Tech','Ongoing','Creator','Solo',
  ARRAY['Daily call list','Missed-visit flagging','Simple exportable reports'],NULL,NULL,true,3),
 ('Thesis: Cardiometabolic Risk in Young Adults','thesis-cardiometabolic-young-adults','Postgraduate research on early metabolic risk markers.',
  'A cross-sectional study of metabolic risk markers in adults under 40, examining the relationship between lifestyle factors and early markers of insulin resistance.',
  ARRAY['Research design','Biostatistics','Scientific writing'],'Research','Completed','Author','Solo',
  ARRAY['Cross-sectional design','Statistical modelling','Peer-reviewed publication'],NULL,NULL,false,4);

INSERT INTO public.certifications (name, issuer, issue_date, description, sort_order) VALUES
 ('Advanced Cardiac Life Support (ACLS)','American Heart Association','2023','Certified in advanced resuscitation and cardiac emergency protocols.',1),
 ('Good Clinical Practice (GCP)','NIDA Clinical Trials Network','2022','Ethical and scientific quality standards for clinical research.',2),
 ('Biostatistics in Public Health','Coursera','2021','Applied statistical methods for health research.',3);

INSERT INTO public.achievements (title, description, organization, date, category, sort_order) VALUES
 ('Best Paper Award','Recognised for research on cardiometabolic risk screening at the annual state medical conference.','State Medical Association','2023','Research',1),
 ('Gold Medal, Internal Medicine','Awarded for the highest academic standing in the postgraduate programme.','Government Medical College','2021','Academic',2),
 ('Community Health Volunteer Lead','Led a volunteer team delivering health camps to underserved communities.','District Health Society','2020','Service',3);

INSERT INTO public.services (name, icon, description, features, cta_label, cta_href, sort_order) VALUES
 ('Clinical Consultation','stethoscope','Adult internal medicine consultation with a focus on chronic disease management.',ARRAY['Detailed history and examination','Evidence-based management plan','Structured follow-up'],'Book a consultation','#contact',1),
 ('Research Collaboration','flask-conical','Study design, protocol writing and statistical support for clinical research.',ARRAY['Protocol and ethics support','Data analysis plan','Manuscript preparation'],'Discuss a project','#contact',2),
 ('Teaching & Workshops','graduation-cap','Sessions for students and junior doctors on clinical reasoning and research methods.',ARRAY['Case-based teaching','Research methods workshops','Exam preparation guidance'],'Invite me to speak','#contact',3);

INSERT INTO public.social_links (platform, icon, url, label, sort_order) VALUES
 ('LinkedIn','linkedin','https://linkedin.com/','LinkedIn',1),
 ('X','twitter','https://x.com/','X',2),
 ('GitHub','github','https://github.com/','GitHub',3);

INSERT INTO public.contact_info (email, phone, phone_visible, location, website, note)
VALUES ('drvishalpandey@gmail.com','+91 00000 00000', false, 'India', 'https://example.com', 'I usually reply within two working days.');

INSERT INTO public.site_settings (site_name, footer_text, copyright, contact_email, meta_title, meta_description, og_title, og_description)
VALUES ('Dr Vishal Pandey','Clinician, researcher and health data enthusiast.','© ' || to_char(now(),'YYYY') || ' Dr Vishal Pandey. All rights reserved.','drvishalpandey@gmail.com',
 'Dr Vishal Pandey — Clinician & Researcher','Portfolio of Dr Vishal Pandey: clinical practice, research projects, publications and health data work.',
 'Dr Vishal Pandey — Clinician & Researcher','Clinical practice, research projects and health data work.');