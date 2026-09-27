<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev).
<!-- LOVABLE:END -->

# Personal portfolio + private admin

A database-driven personal portfolio with a private content manager. Nothing on
the public site is hardcoded — every section reads from the database and can be
edited, hidden, reordered or deleted from the admin area.

## Public site

One page at `/` with sections in the order you set: hero, about, education,
skills, experience, projects, certifications, achievements, services, resume
download, contact form and social links. Project detail pages live at
`/projects/<slug>`. Visitors never sign in and there is no link to the admin.

## Admin area

Open `/admin`. It is hidden from the public site, excluded from search engines,
and protected by email/password sign-in plus an administrator check in the
database.

- **First run** — the sign-in card switches to setup mode while no administrator
  exists. Enter your own email and choose a password; the account is created and
  signed in.
- **Dashboard** — content counts and the newest contact messages.
- **Content** — add, edit, delete, show/hide, search and drag-to-reorder every
  collection. Images, logos and resume files upload straight into private
  storage and are served through `/api/public/media/...`.
- **Profile & hero**, **contact details**, **site & search preview** — single
  forms for the one-off content.
- **Messages** — read/unread, search, delete.
- **Account** — change your password. "Forgot your password?" on the sign-in
  card sends a reset email that lands on `/reset-password`.
- Light, dark and system themes; the choice is remembered.

## Running locally

```bash
bun install
bun run dev       # http://localhost:8080
```

Copy `.env.example` to `.env` and fill in your own backend values if you run
this outside Lovable.

## Security checklist

- Row level security is on for every table. The public may only read visible
  content and insert contact messages.
- All admin writes go through server functions that verify the signed-in user is
  an administrator before touching data.
- The media bucket is private; files are streamed through a read-only route.
- The service role key is used only on the server, never in browser code.
- The admin area sets `noindex, nofollow` and `robots.txt` disallows `/admin`.

## Tech

TanStack Start (React + TypeScript), Tailwind CSS, shadcn/ui, TanStack Query,
PostgreSQL with row level security, cloud file storage.
