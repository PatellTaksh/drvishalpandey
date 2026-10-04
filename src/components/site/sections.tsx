import {
  ArrowUpRight,
  CalendarDays,
  ExternalLink,
  Github,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DynamicIcon } from "./DynamicIcon";
import { Reveal } from "./Reveal";
import { ContactForm } from "./ContactForm";
import type { SiteData, Section } from "@/lib/portfolio.functions";

function dateRange(start?: string | null, end?: string | null, current?: boolean) {
  const from = start || "";
  const to = current ? "Present" : end || "";
  if (from && to) return `${from} — ${to}`;
  return from || to || "";
}

export function SectionShell({
  id,
  section,
  children,
  tone = "default",
}: {
  id: string;
  section?: Section | undefined;
  children: React.ReactNode;
  tone?: "default" | "paper";
}) {
  return (
    <section
      id={id}
      className={tone === "paper" ? "bg-paper py-20 sm:py-28" : "bg-background py-20 sm:py-28"}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {section ? (
          <Reveal className="mb-12 max-w-2xl">
            {section.subtitle ? (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {section.subtitle}
              </p>
            ) : null}
            <h2 className="mt-2 text-3xl sm:text-4xl">{section.title}</h2>
            {section.description ? (
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {section.description}
              </p>
            ) : null}
          </Reveal>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export function Hero({ data }: { data: SiteData }) {
  const { profile, socials, resume } = data;
  if (!profile) return null;

  const resumeHref = profile.hero_secondary_href || resume?.file_url || "";

  return (
    <section id="hero" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] size-[32rem] rounded-full bg-accent/60 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 md:grid-cols-[1.4fr_1fr]">
        <Reveal>
          {profile.availability ? (
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden />
              {profile.availability}
            </p>
          ) : null}
          <h1 className="mt-5 text-4xl leading-[1.05] sm:text-6xl">
            Hi, I'm <span className="italic text-primary">{profile.full_name}</span>
          </h1>
          {profile.tagline ? (
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">{profile.tagline}</p>
          ) : null}
          {profile.bio_short ? (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              {profile.bio_short}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            {profile.hero_primary_visible && profile.hero_primary_label ? (
              <Button asChild size="lg">
                <a href={profile.hero_primary_href || "#projects"}>
                  {profile.hero_primary_label}
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
            ) : null}
            {profile.hero_secondary_visible && profile.hero_secondary_label && resumeHref ? (
              <Button asChild size="lg" variant="outline">
                <a href={resumeHref} target="_blank" rel="noreferrer noopener">
                  {profile.hero_secondary_label}
                </a>
              </Button>
            ) : null}
            {profile.hero_tertiary_visible && profile.hero_tertiary_label ? (
              <Button asChild size="lg" variant="ghost">
                <a href={profile.hero_tertiary_href || "#contact"}>{profile.hero_tertiary_label}</a>
              </Button>
            ) : null}
          </div>

          {socials.length > 0 ? (
            <ul className="mt-8 flex flex-wrap gap-2">
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
        </Reveal>

        <Reveal delay={120} className="justify-self-center">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-3 rounded-[2rem] border border-border bg-paper"
            />
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="relative size-56 rounded-[1.5rem] object-cover shadow-lift sm:size-72"
              />
            ) : (
              <div className="relative flex size-56 items-center justify-center rounded-[1.5rem] bg-card font-display text-6xl text-primary shadow-lift sm:size-72">
                {profile.full_name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function AboutSection({ data, section }: { data: SiteData; section?: Section | undefined }) {
  const { profile, aboutCards } = data;
  return (
    <SectionShell id="about" section={section} tone="paper">
      <div className="grid gap-10 md:grid-cols-[1.3fr_1fr]">
        <Reveal className="space-y-4 text-base leading-relaxed text-muted-foreground">
          {(profile?.bio_long || profile?.bio_short || "")
            .split("\n")
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
        </Reveal>
        {aboutCards.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
            {aboutCards.map((card, index) => (
              <Reveal as="li" key={card.id} delay={index * 60}>
                <div className="flex h-full items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <DynamicIcon name={card.icon} className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {card.title}
                    </p>
                    <p className="text-sm font-medium">{card.value}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        ) : null}
      </div>
    </SectionShell>
  );
}

export function EducationSection({ data, section }: { data: SiteData; section?: Section | undefined }) {
  if (data.education.length === 0) return null;
  return (
    <SectionShell id="education" section={section}>
      <ol className="relative space-y-6 border-l border-border pl-6 sm:pl-8">
        {data.education.map((item, index) => (
          <Reveal as="li" key={item.id} delay={index * 70} className="relative">
            <span
              aria-hidden
              className="absolute -left-[31px] top-6 size-3 rounded-full border-2 border-background bg-primary sm:-left-[39px]"
            />
            <article className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {item.logo_url ? (
                    <img
                      src={item.logo_url}
                      alt=""
                      className="size-11 rounded-lg border border-border object-cover"
                    />
                  ) : null}
                  <div>
                    <h3 className="text-xl">{item.degree}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.website ? (
                        <a
                          className="hover:text-primary"
                          href={item.website}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {item.institution}
                        </a>
                      ) : (
                        item.institution
                      )}
                      {item.location ? ` · ${item.location}` : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>{dateRange(item.start_date, item.end_date, item.currently_studying)}</p>
                  {item.grade ? <p className="text-primary">{item.grade}</p> : null}
                </div>
              </div>
              {item.description ? (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
            </article>
          </Reveal>
        ))}
      </ol>
    </SectionShell>
  );
}

export function SkillsSection({ data, section }: { data: SiteData; section?: Section | undefined }) {
  const { skills, skillCategories } = data;
  if (skills.length === 0) return null;

  const grouped = skillCategories
    .map((category) => ({
      category,
      items: skills.filter((skill) => skill.category_id === category.id),
    }))
    .filter((group) => group.items.length > 0);

  const uncategorised = skills.filter(
    (skill) => !skill.category_id || !skillCategories.some((c) => c.id === skill.category_id),
  );

  return (
    <SectionShell id="skills" section={section} tone="paper">
      <div className="grid gap-5 md:grid-cols-2">
        {grouped.map((group, index) => (
          <Reveal key={group.category.id} delay={index * 60}>
            <div className="h-full rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="text-lg">{group.category.name}</h3>
              <ul className="mt-4 space-y-3.5">
                {group.items.map((skill) => (
                  <li key={skill.id}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2 font-medium">
                        {skill.icon_url ? (
                          <img src={skill.icon_url} alt="" className="size-4 rounded" />
                        ) : null}
                        {skill.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {skill.level || skill.experience || ""}
                      </span>
                    </div>
                    {typeof skill.percent === "number" ? (
                      <Progress value={skill.percent} className="mt-2 h-1.5" />
                    ) : null}
                    {skill.description ? (
                      <p className="mt-1 text-xs text-muted-foreground">{skill.description}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
        {uncategorised.length > 0 ? (
          <Reveal>
            <div className="h-full rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="text-lg">Other</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {uncategorised.map((skill) => (
                  <li key={skill.id}>
                    <Badge variant="secondary">{skill.name}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ) : null}
      </div>
    </SectionShell>
  );
}

export function ExperienceSection({ data, section }: { data: SiteData; section?: Section | undefined }) {
  if (data.experience.length === 0) return null;
  return (
    <SectionShell id="experience" section={section}>
      <ol className="space-y-5">
        {data.experience.map((item, index) => (
          <Reveal as="li" key={item.id} delay={index * 70}>
            <article className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {item.logo_url ? (
                    <img
                      src={item.logo_url}
                      alt=""
                      className="size-11 rounded-lg border border-border object-cover"
                    />
                  ) : null}
                  <div>
                    <h3 className="text-xl">{item.job_title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.website ? (
                        <a
                          className="hover:text-primary"
                          href={item.website}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {item.company}
                        </a>
                      ) : (
                        item.company
                      )}
                      {item.location ? ` · ${item.location}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 text-sm text-muted-foreground">
                  <Badge variant="secondary">{item.employment_type}</Badge>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" aria-hidden />
                    {dateRange(item.start_date, item.end_date, item.currently_working)}
                  </span>
                </div>
              </div>

              {item.description ? (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
              {item.responsibilities.length > 0 ? (
                <ul className="mt-3 space-y-1.5">
                  {item.responsibilities.map((entry) => (
                    <li
                      key={entry}
                      className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                      {entry}
                    </li>
                  ))}
                </ul>
              ) : null}
              {item.technologies.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {item.technologies.map((tech) => (
                    <li key={tech}>
                      <Badge variant="outline">{tech}</Badge>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          </Reveal>
        ))}
      </ol>
    </SectionShell>
  );
}

export function ProjectsSection({ data, section }: { data: SiteData; section?: Section | undefined }) {
  if (data.projects.length === 0) return null;
  const ordered = [...data.projects].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || a.sort_order - b.sort_order,
  );

  return (
    <SectionShell id="projects" section={section} tone="paper">
      <ul className="grid gap-6 sm:grid-cols-2">
        {ordered.map((project, index) => (
          <Reveal as="li" key={project.id} delay={index * 60}>
            <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-lift">
              {project.thumbnail_url ? (
                <img
                  src={project.thumbnail_url}
                  alt={project.title}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[16/9] w-full items-center justify-center bg-accent">
                  <span className="font-display text-3xl text-accent-foreground">
                    {project.title.slice(0, 1)}
                  </span>
                </div>
              )}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  {project.featured ? <Badge>Featured</Badge> : null}
                  {project.category ? <Badge variant="outline">{project.category}</Badge> : null}
                </div>
                <h3 className="mt-3 text-xl">
                  <Link
                    to="/projects/$slug"
                    params={{ slug: project.slug }}
                    className="transition-colors hover:text-primary"
                  >
                    {project.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {project.short_description}
                </p>
                {project.technologies.length > 0 ? (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <li key={tech}>
                        <Badge variant="secondary">{tech}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-5 flex flex-wrap gap-2 pt-1">
                  <Button asChild size="sm">
                    <Link to="/projects/$slug" params={{ slug: project.slug }}>
                      View project
                    </Link>
                  </Button>
                  {project.github_url ? (
                    <Button asChild size="sm" variant="outline">
                      <a href={project.github_url} target="_blank" rel="noreferrer noopener">
                        <Github className="size-4" /> GitHub
                      </a>
                    </Button>
                  ) : null}
                  {project.demo_url ? (
                    <Button asChild size="sm" variant="ghost">
                      <a href={project.demo_url} target="_blank" rel="noreferrer noopener">
                        <ExternalLink className="size-4" /> Live demo
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </SectionShell>
  );
}

export function CertificationsSection({ data, section }: { data: SiteData; section?: Section | undefined }) {
  if (data.certifications.length === 0) return null;
  return (
    <SectionShell id="certifications" section={section}>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.certifications.map((item, index) => (
          <Reveal as="li" key={item.id} delay={index * 60}>
            <article className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-card">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt=""
                  loading="lazy"
                  className="mb-4 aspect-[4/3] w-full rounded-lg object-cover"
                />
              ) : null}
              <div className="flex items-start gap-3">
                {item.logo_url ? (
                  <img
                    src={item.logo_url}
                    alt=""
                    className="size-9 rounded border border-border object-cover"
                  />
                ) : null}
                <div>
                  <h3 className="text-lg leading-snug">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.issuer}</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {[item.issue_date, item.expiry_date ? `expires ${item.expiry_date}` : null]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {item.description ? (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
              <div className="mt-auto flex flex-wrap gap-3 pt-4 text-sm">
                {item.credential_url ? (
                  <a
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                    href={item.credential_url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Verify <ExternalLink className="size-3.5" />
                  </a>
                ) : null}
                {item.pdf_url ? (
                  <a
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                    href={item.pdf_url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Certificate
                  </a>
                ) : null}
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </SectionShell>
  );
}

export function AchievementsSection({ data, section }: { data: SiteData; section?: Section | undefined }) {
  if (data.achievements.length === 0) return null;
  return (
    <SectionShell id="achievements" section={section} tone="paper">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.achievements.map((item, index) => (
          <Reveal as="li" key={item.id} delay={index * 60}>
            <article className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-card">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt=""
                  loading="lazy"
                  className="mb-4 aspect-[4/3] w-full rounded-lg object-cover"
                />
              ) : null}
              {item.category ? (
                <Badge variant="outline" className="w-fit">
                  {item.category}
                </Badge>
              ) : null}
              <h3 className="mt-3 text-lg leading-snug">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {[item.organization, item.date].filter(Boolean).join(" · ")}
              </p>
              {item.description ? (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
              {item.external_url || item.certificate_url ? (
                <a
                  className="mt-auto inline-flex items-center gap-1 pt-4 text-sm text-primary hover:underline"
                  href={item.external_url || item.certificate_url!}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Read more <ExternalLink className="size-3.5" />
                </a>
              ) : null}
            </article>
          </Reveal>
        ))}
      </ul>
    </SectionShell>
  );
}

export function ServicesSection({ data, section }: { data: SiteData; section?: Section | undefined }) {
  if (data.services.length === 0) return null;
  return (
    <SectionShell id="services" section={section}>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.services.map((item, index) => (
          <Reveal as="li" key={item.id} delay={index * 60}>
            <article className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-card">
              <span className="flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <DynamicIcon name={item.icon} className="size-5" />
              </span>
              <h3 className="mt-4 text-xl">{item.name}</h3>
              {item.description ? (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
              {item.features.length > 0 ? (
                <ul className="mt-4 space-y-1.5">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>
              ) : null}
              {item.starting_price ? (
                <p className="mt-4 text-sm font-medium">From {item.starting_price}</p>
              ) : null}
              {item.cta_label && item.cta_href ? (
                <Button asChild variant="outline" size="sm" className="mt-auto w-fit self-start pt-0">
                  <a href={item.cta_href}>{item.cta_label}</a>
                </Button>
              ) : null}
            </article>
          </Reveal>
        ))}
      </ul>
    </SectionShell>
  );
}

export function ContactSection({ data, section }: { data: SiteData; section?: Section | undefined }) {
  const { contact } = data;
  return (
    <SectionShell id="contact" section={section} tone="paper">
      <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
        <Reveal className="space-y-4">
          {contact?.note ? (
            <p className="text-base leading-relaxed text-muted-foreground">{contact.note}</p>
          ) : null}
          <ul className="space-y-3">
            {contact?.email_visible && contact.email ? (
              <li className="flex items-center gap-3 text-sm">
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Mail className="size-4" aria-hidden />
                </span>
                <a className="hover:text-primary" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </li>
            ) : null}
            {contact?.public_phone ? (
              <li className="flex items-center gap-3 text-sm">
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Phone className="size-4" aria-hidden />
                </span>
                <a className="hover:text-primary" href={`tel:${contact.public_phone}`}>
                  {contact.public_phone}
                </a>
              </li>
            ) : null}
            {contact?.location_visible && contact.location ? (
              <li className="flex items-center gap-3 text-sm">
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <MapPin className="size-4" aria-hidden />
                </span>
                {contact.location}
              </li>
            ) : null}
            {contact?.website_visible && contact.website ? (
              <li className="flex items-center gap-3 text-sm">
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <ExternalLink className="size-4" aria-hidden />
                </span>
                <a
                  className="hover:text-primary"
                  href={contact.website}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {contact.website}
                </a>
              </li>
            ) : null}
          </ul>
        </Reveal>
        <Reveal delay={90}>
          <ContactForm />
        </Reveal>
      </div>
    </SectionShell>
  );
}
