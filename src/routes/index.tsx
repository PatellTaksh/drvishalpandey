import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteDataQuery } from "@/lib/site-queries";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  AboutSection,
  AchievementsSection,
  CertificationsSection,
  ContactSection,
  EducationSection,
  ExperienceSection,
  Hero,
  ProjectsSection,
  ServicesSection,
  SkillsSection,
} from "@/components/site/sections";
import type { Section, SiteData } from "@/lib/portfolio.functions";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteDataQuery),
  head: ({ loaderData }) => {
    const settings = loaderData?.settings;
    const profile = loaderData?.profile;
    const title =
      settings?.meta_title ||
      (profile ? `${profile.full_name} — ${profile.professional_title ?? "Portfolio"}` : "Portfolio");
    const description = settings?.meta_description || profile?.bio_short || "Personal portfolio.";
    const seo = socialMeta({
      title,
      description,
      path: "/",
      type: "website",
      siteName: settings?.site_name || profile?.full_name,
      images: [settings?.og_image_url, profile?.avatar_url],
    });
    seo.meta = seo.meta.map((m) =>
      "property" in m && m.property === "og:title" && settings?.og_title
        ? { ...m, content: settings.og_title }
        : "property" in m && m.property === "og:description" && settings?.og_description
          ? { ...m, content: settings.og_description }
          : m,
    );
    return seo;
  },
  component: HomePage,
});

function HomePage() {
  const { data } = useSuspenseQuery(siteDataQuery);
  const sectionFor = (key: string) => data.sections.find((section) => section.key === key);
  const enabled = (key: string) =>
    data.sections.length === 0 || data.sections.some((section) => section.key === key);

  const blocks: Array<
    [string, React.ComponentType<{ data: SiteData; section?: Section | undefined }>]
  > = [
    ["about", AboutSection],
    ["education", EducationSection],
    ["skills", SkillsSection],
    ["experience", ExperienceSection],
    ["projects", ProjectsSection],
    ["certifications", CertificationsSection],
    ["achievements", AchievementsSection],
    ["services", ServicesSection],
    ["contact", ContactSection],
  ];

  const ordered = data.sections.length
    ? data.sections
        .map((section) => blocks.find(([key]) => key === section.key))
        .filter((entry): entry is (typeof blocks)[number] => Boolean(entry))
    : blocks;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <SiteHeader nav={data.nav} profile={data.profile} settings={data.settings} />
      <main id="main">
        {enabled("hero") ? <Hero data={data} /> : null}
        {ordered.map(([key, Component]) => (
          <Component key={key} data={data} section={sectionFor(key)} />
        ))}
      </main>
      <SiteFooter
        profile={data.profile}
        settings={data.settings}
        nav={data.nav}
        socials={data.socials}
        contact={data.contact}
        resume={data.resume}
      />
    </>
  );
}
