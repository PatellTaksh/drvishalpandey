import { DynamicIcon } from "./DynamicIcon";
import type {
  ContactInfo,
  NavItem,
  Profile,
  Resume,
  SiteSettings,
  SocialLink,
} from "@/lib/portfolio.functions";

export function SiteFooter({
  profile,
  settings,
  nav,
  socials,
  contact,
  resume,
}: {
  profile: Profile | null;
  settings: SiteSettings | null;
  nav: NavItem[];
  socials: SocialLink[];
  contact: ContactInfo | null;
  resume: Resume | null;
}) {
  const brand = settings?.site_name || profile?.full_name || "Portfolio";

  return (
    <footer className="border-t border-border bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl">{brand}</p>
          {settings?.footer_text ? (
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {settings.footer_text}
            </p>
          ) : null}
          {socials.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {socials.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label || social.platform}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <DynamicIcon name={social.icon} className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {nav.length > 0 ? (
          <nav aria-label="Footer">
            <p className="text-sm font-semibold">Explore</p>
            <ul className="mt-3 space-y-2">
              {nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href.startsWith("#") ? `/${item.href}` : item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div>
          <p className="text-sm font-semibold">Get in touch</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {contact?.email_visible && contact.email ? (
              <li>
                <a className="transition-colors hover:text-primary" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </li>
            ) : null}
            {contact?.phone_visible && contact.phone ? (
              <li>
                <a className="transition-colors hover:text-primary" href={`tel:${contact.phone}`}>
                  {contact.phone}
                </a>
              </li>
            ) : null}
            {contact?.location_visible && contact.location ? <li>{contact.location}</li> : null}
            {resume ? (
              <li>
                <a
                  className="transition-colors hover:text-primary"
                  href={resume.file_url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Download resume
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-muted-foreground sm:px-8">
          {settings?.copyright || `© ${new Date().getFullYear()} ${brand}`}
        </p>
      </div>
    </footer>
  );
}
