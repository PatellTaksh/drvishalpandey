import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Tables } from "@/integrations/supabase/types";

export type Profile = Omit<Tables<"profile">, "phone">;
export type SiteSettings = Omit<Tables<"site_settings">, "contact_email">;
export type Section = Tables<"sections">;
export type NavItem = Tables<"nav_items">;
export type AboutCard = Tables<"about_cards">;
export type SkillCategory = Tables<"skill_categories">;
export type Skill = Tables<"skills">;
export type Education = Tables<"education">;
export type Experience = Tables<"experience">;
export type Project = Tables<"projects">;
export type Certification = Tables<"certifications">;
export type Achievement = Tables<"achievements">;
export type Service = Tables<"services">;
export type SocialLink = Tables<"social_links">;
export type ContactInfo = Omit<Tables<"contact_info">, "phone">;
export type Resume = Tables<"resumes">;

const PROFILE_COLS =
  "id,full_name,professional_title,tagline,bio_short,bio_long,avatar_url,email,location,website,availability,hero_primary_label,hero_primary_href,hero_primary_visible,hero_secondary_label,hero_secondary_href,hero_secondary_visible,hero_tertiary_label,hero_tertiary_href,hero_tertiary_visible,created_at,updated_at";
const SETTINGS_COLS =
  "id,site_name,logo_url,favicon_url,accent_color,default_theme,footer_text,copyright,meta_title,meta_description,og_title,og_description,og_image_url,canonical_url,created_at,updated_at";
const CONTACT_COLS =
  "id,email,email_visible,phone_visible,public_phone,location,location_visible,website,website_visible,note,created_at,updated_at";

export type SiteData = {
  profile: Profile | null;
  settings: SiteSettings | null;
  sections: Section[];
  nav: NavItem[];
  aboutCards: AboutCard[];
  skillCategories: SkillCategory[];
  skills: Skill[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  achievements: Achievement[];
  services: Service[];
  socials: SocialLink[];
  contact: ContactInfo | null;
  resume: Resume | null;
};

/** All publicly visible portfolio content, in display order. */
export const getSiteData = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteData> => {
    const { createPublicClient } = await import("./supabase-public.server");
    const db = createPublicClient();

    const visible = <T extends { visible?: boolean }>(rows: T[] | null) => rows ?? [];

    const [
      profile,
      settings,
      sections,
      nav,
      aboutCards,
      skillCategories,
      skills,
      education,
      experience,
      projects,
      certifications,
      achievements,
      services,
      socials,
      contact,
      resume,
    ] = await Promise.all([
      db.from("profile").select(PROFILE_COLS).limit(1).maybeSingle(),
      db.from("site_settings").select(SETTINGS_COLS).limit(1).maybeSingle(),
      db.from("sections").select("*").eq("enabled", true).order("sort_order"),
      db.from("nav_items").select("*").eq("enabled", true).order("sort_order"),
      db.from("about_cards").select("*").eq("visible", true).order("sort_order"),
      db.from("skill_categories").select("*").eq("visible", true).order("sort_order"),
      db.from("skills").select("*").eq("visible", true).order("sort_order"),
      db.from("education").select("*").eq("visible", true).order("sort_order"),
      db.from("experience").select("*").eq("visible", true).order("sort_order"),
      db.from("projects").select("*").eq("visible", true).order("sort_order"),
      db.from("certifications").select("*").eq("visible", true).order("sort_order"),
      db.from("achievements").select("*").eq("visible", true).order("sort_order"),
      db.from("services").select("*").eq("visible", true).order("sort_order"),
      db.from("social_links").select("*").eq("visible", true).order("sort_order"),
      db.from("contact_info").select(CONTACT_COLS).limit(1).maybeSingle(),
      db.from("resumes").select("*").eq("is_active", true).limit(1).maybeSingle(),
    ]);

    return {
      profile: (profile.data as Profile | null) ?? null,
      settings: (settings.data as SiteSettings | null) ?? null,
      sections: sections.data ?? [],
      nav: nav.data ?? [],
      aboutCards: visible(aboutCards.data),
      skillCategories: visible(skillCategories.data),
      skills: visible(skills.data),
      education: visible(education.data),
      experience: visible(experience.data),
      projects: visible(projects.data),
      certifications: visible(certifications.data),
      achievements: visible(achievements.data),
      services: visible(services.data),
      socials: visible(socials.data),
      contact: (contact.data as ContactInfo | null) ?? null,
      resume: resume.data ?? null,
    };
  },
);

export type ProjectPageData = {
  project: Project | null;
  settings: SiteSettings | null;
  profile: Profile | null;
  socials: SocialLink[];
};

export const getProjectBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }): Promise<ProjectPageData> => {
    const { createPublicClient } = await import("./supabase-public.server");
    const db = createPublicClient();

    const [project, settings, profile, socials] = await Promise.all([
      db.from("projects").select("*").eq("slug", data.slug).eq("visible", true).maybeSingle(),
      db.from("site_settings").select(SETTINGS_COLS).limit(1).maybeSingle(),
      db.from("profile").select(PROFILE_COLS).limit(1).maybeSingle(),
      db.from("social_links").select("*").eq("visible", true).order("sort_order"),
    ]);

    return {
      project: project.data ?? null,
      settings: (settings.data as SiteSettings | null) ?? null,
      profile: (profile.data as Profile | null) ?? null,
      socials: socials.data ?? [],
    };
  });

const messageSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(5, "Please write a short message").max(5000),
});

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => messageSchema.parse(input))
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    const { createPublicClient } = await import("./supabase-public.server");
    const db = createPublicClient();

    const { error } = await db.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      subject: data.subject || null,
      message: data.message,
    });

    if (error) {
      console.error("contact message insert failed", error);
      throw new Error("Unable to send your message right now. Please try again.");
    }

    return { ok: true };
  });
