<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules

- Public site content comes from Supabase via `src/lib/portfolio.functions.ts`; components never hardcode content so the admin stays the single source of truth.
- All admin reads/writes go through `src/lib/admin.functions.ts` server functions that call `is_admin()` first, so the browser never gets privileged access.
- Admin UI is generic: collections are declared in `src/lib/admin-collections.ts` and rendered by `CollectionManager`/`SingletonEditor`, so new content types need config only.
- The `media` storage bucket is private; files are served through `src/routes/api/public/media/$.ts` so uploads never require a public bucket.
- Public reads of profile/site_settings/contact_info use explicit column lists (anon has column-level grants; phone/contact_email hidden, contact phone exposed via generated `public_phone`) so private fields never leave the database.
