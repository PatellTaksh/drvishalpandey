-- The singleton-row policies on profile/site_settings/contact_info subquery their
-- own table, which causes infinite recursion and breaks ALL public reads.
-- Replace them with SECURITY DEFINER helpers that bypass RLS for the lookup.

create or replace function public.public_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.profile order by created_at limit 1
$$;

create or replace function public.public_site_settings_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.site_settings order by created_at limit 1
$$;

create or replace function public.public_contact_info_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.contact_info order by created_at limit 1
$$;

grant execute on function public.public_profile_id() to anon, authenticated;
grant execute on function public.public_site_settings_id() to anon, authenticated;
grant execute on function public.public_contact_info_id() to anon, authenticated;

drop policy "public read profile" on public.profile;
create policy "public read profile" on public.profile
for select to anon
using (id = public.public_profile_id());

drop policy "public read site_settings" on public.site_settings;
create policy "public read site_settings" on public.site_settings
for select to anon
using (id = public.public_site_settings_id());

drop policy "public read contact_info" on public.contact_info;
create policy "public read contact_info" on public.contact_info
for select to anon
using (id = public.public_contact_info_id());