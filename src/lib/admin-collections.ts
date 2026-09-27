import type { AdminTable } from "./admin.functions";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "image"
  | "file"
  | "list"
  | "icon"
  | "select"
  | "relation";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  required?: boolean;
  options?: string[];
  relationTable?: AdminTable;
  folder?: string;
  rows?: number;
};

export type Collection = {
  slug: string;
  table: AdminTable;
  title: string;
  description: string;
  /** Column used as the row heading in list view. */
  titleField: string;
  subtitleField?: string;
  /** Column that toggles public visibility. */
  visibilityField?: "visible" | "enabled";
  sortable: boolean;
  searchFields: string[];
  fields: Field[];
};

const YES_NO = { type: "boolean" as const };

export const COLLECTIONS: Collection[] = [
  {
    slug: "about",
    table: "about_cards",
    title: "About highlights",
    description: "Small fact cards shown beside your About text.",
    titleField: "title",
    subtitleField: "value",
    visibilityField: "visible",
    sortable: true,
    searchFields: ["title", "value"],
    fields: [
      { name: "title", label: "Label", type: "text", required: true },
      { name: "value", label: "Value", type: "text", required: true },
      { name: "icon", label: "Icon", type: "icon" },
      { name: "visible", label: "Visible on site", ...YES_NO },
    ],
  },
  {
    slug: "education",
    table: "education",
    title: "Education",
    description: "Degrees, training and academic history.",
    titleField: "degree",
    subtitleField: "institution",
    visibilityField: "visible",
    sortable: true,
    searchFields: ["degree", "institution", "location"],
    fields: [
      { name: "degree", label: "Degree or programme", type: "text", required: true },
      { name: "institution", label: "Institution", type: "text", required: true },
      { name: "location", label: "Location", type: "text" },
      { name: "start_date", label: "Start", type: "text", help: "e.g. 2018 or Aug 2018" },
      { name: "end_date", label: "End", type: "text" },
      { name: "currently_studying", label: "Currently studying", ...YES_NO },
      { name: "grade", label: "Grade or distinction", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "logo_url", label: "Institution logo", type: "image", folder: "education" },
      { name: "website", label: "Website", type: "text" },
      { name: "visible", label: "Visible on site", ...YES_NO },
    ],
  },
  {
    slug: "skill-groups",
    table: "skill_categories",
    title: "Skill groups",
    description: "Groups that skills are listed under.",
    titleField: "name",
    visibilityField: "visible",
    sortable: true,
    searchFields: ["name"],
    fields: [
      { name: "name", label: "Group name", type: "text", required: true },
      { name: "visible", label: "Visible on site", ...YES_NO },
    ],
  },
  {
    slug: "skills",
    table: "skills",
    title: "Skills",
    description: "Individual skills with optional proficiency.",
    titleField: "name",
    subtitleField: "level",
    visibilityField: "visible",
    sortable: true,
    searchFields: ["name", "level", "experience"],
    fields: [
      { name: "name", label: "Skill", type: "text", required: true },
      {
        name: "category_id",
        label: "Group",
        type: "relation",
        relationTable: "skill_categories",
      },
      { name: "level", label: "Level", type: "text", help: "e.g. Advanced" },
      { name: "percent", label: "Proficiency %", type: "number", help: "0-100, optional" },
      { name: "experience", label: "Experience", type: "text", help: "e.g. 5 years" },
      { name: "description", label: "Note", type: "text" },
      { name: "icon_url", label: "Icon image", type: "image", folder: "skills" },
      { name: "visible", label: "Visible on site", ...YES_NO },
    ],
  },
  {
    slug: "experience",
    table: "experience",
    title: "Experience",
    description: "Roles, positions and appointments.",
    titleField: "job_title",
    subtitleField: "company",
    visibilityField: "visible",
    sortable: true,
    searchFields: ["job_title", "company", "location"],
    fields: [
      { name: "job_title", label: "Role", type: "text", required: true },
      { name: "company", label: "Organisation", type: "text", required: true },
      {
        name: "employment_type",
        label: "Type",
        type: "select",
        options: ["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Volunteer"],
      },
      { name: "location", label: "Location", type: "text" },
      { name: "start_date", label: "Start", type: "text" },
      { name: "end_date", label: "End", type: "text" },
      { name: "currently_working", label: "Current role", ...YES_NO },
      { name: "description", label: "Summary", type: "textarea" },
      {
        name: "responsibilities",
        label: "Responsibilities",
        type: "list",
        help: "One per line",
        rows: 5,
      },
      { name: "technologies", label: "Tools & skills", type: "list", help: "One per line" },
      { name: "logo_url", label: "Logo", type: "image", folder: "experience" },
      { name: "website", label: "Website", type: "text" },
      { name: "visible", label: "Visible on site", ...YES_NO },
    ],
  },
  {
    slug: "projects",
    table: "projects",
    title: "Projects",
    description: "Case studies and work shown on the site.",
    titleField: "title",
    subtitleField: "short_description",
    visibilityField: "visible",
    sortable: true,
    searchFields: ["title", "slug", "category", "short_description"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "slug",
        label: "URL slug",
        type: "text",
        required: true,
        help: "Used in the project link, e.g. cardiac-risk-study",
      },
      { name: "short_description", label: "Short description", type: "textarea", rows: 3 },
      { name: "detailed_description", label: "Full description", type: "textarea", rows: 8 },
      { name: "thumbnail_url", label: "Cover image", type: "image", folder: "projects" },
      { name: "images", label: "Gallery image URLs", type: "list", help: "One URL per line" },
      { name: "technologies", label: "Tools & methods", type: "list" },
      { name: "features", label: "Key features", type: "list" },
      { name: "challenges", label: "Challenges", type: "textarea", rows: 4 },
      { name: "solutions", label: "Solutions", type: "textarea", rows: 4 },
      { name: "category", label: "Category", type: "text" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["Completed", "Ongoing", "Planned", "Archived"],
      },
      { name: "role", label: "Your role", type: "text" },
      { name: "team_size", label: "Team size", type: "text" },
      { name: "start_date", label: "Start", type: "text" },
      { name: "end_date", label: "End", type: "text" },
      { name: "github_url", label: "Repository link", type: "text" },
      { name: "demo_url", label: "Live link", type: "text" },
      { name: "video_url", label: "Video link", type: "text" },
      { name: "featured", label: "Featured", ...YES_NO },
      { name: "visible", label: "Visible on site", ...YES_NO },
    ],
  },
  {
    slug: "certifications",
    table: "certifications",
    title: "Certifications",
    description: "Licences, courses and credentials.",
    titleField: "name",
    subtitleField: "issuer",
    visibilityField: "visible",
    sortable: true,
    searchFields: ["name", "issuer", "credential_id"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "issuer", label: "Issuer", type: "text", required: true },
      { name: "issue_date", label: "Issued", type: "text" },
      { name: "expiry_date", label: "Expires", type: "text" },
      { name: "credential_id", label: "Credential ID", type: "text" },
      { name: "credential_url", label: "Verification link", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "logo_url", label: "Issuer logo", type: "image", folder: "certifications" },
      { name: "image_url", label: "Certificate image", type: "image", folder: "certifications" },
      { name: "pdf_url", label: "Certificate PDF", type: "file", folder: "certifications" },
      { name: "visible", label: "Visible on site", ...YES_NO },
    ],
  },
  {
    slug: "achievements",
    table: "achievements",
    title: "Achievements",
    description: "Awards, publications and recognition.",
    titleField: "title",
    subtitleField: "organization",
    visibilityField: "visible",
    sortable: true,
    searchFields: ["title", "organization", "category"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "organization", label: "Organisation", type: "text" },
      { name: "date", label: "Date", type: "text" },
      { name: "category", label: "Category", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "image_url", label: "Image", type: "image", folder: "achievements" },
      { name: "certificate_url", label: "Certificate file", type: "file", folder: "achievements" },
      { name: "external_url", label: "External link", type: "text" },
      { name: "visible", label: "Visible on site", ...YES_NO },
    ],
  },
  {
    slug: "services",
    table: "services",
    title: "Services",
    description: "What you offer to clients and collaborators.",
    titleField: "name",
    subtitleField: "starting_price",
    visibilityField: "visible",
    sortable: true,
    searchFields: ["name", "description"],
    fields: [
      { name: "name", label: "Service", type: "text", required: true },
      { name: "icon", label: "Icon", type: "icon" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "features", label: "What's included", type: "list" },
      { name: "starting_price", label: "Starting price", type: "text" },
      { name: "cta_label", label: "Button label", type: "text" },
      { name: "cta_href", label: "Button link", type: "text", help: "e.g. #contact" },
      { name: "visible", label: "Visible on site", ...YES_NO },
    ],
  },
  {
    slug: "social",
    table: "social_links",
    title: "Social links",
    description: "Profiles linked in the header, hero and footer.",
    titleField: "platform",
    subtitleField: "url",
    visibilityField: "visible",
    sortable: true,
    searchFields: ["platform", "url", "label"],
    fields: [
      { name: "platform", label: "Platform", type: "text", required: true },
      { name: "url", label: "Link", type: "text", required: true },
      { name: "icon", label: "Icon", type: "icon" },
      { name: "label", label: "Accessible label", type: "text" },
      { name: "visible", label: "Visible on site", ...YES_NO },
    ],
  },
  {
    slug: "navigation",
    table: "nav_items",
    title: "Navigation",
    description: "Menu links in the header and footer.",
    titleField: "label",
    subtitleField: "href",
    visibilityField: "enabled",
    sortable: true,
    searchFields: ["label", "href"],
    fields: [
      { name: "label", label: "Label", type: "text", required: true },
      { name: "href", label: "Link target", type: "text", required: true, help: "e.g. #projects" },
      { name: "enabled", label: "Shown in menu", ...YES_NO },
    ],
  },
  {
    slug: "sections",
    table: "sections",
    title: "Sections",
    description: "Headings, intro text and order of each page section.",
    titleField: "title",
    subtitleField: "key",
    visibilityField: "enabled",
    sortable: true,
    searchFields: ["title", "key"],
    fields: [
      {
        name: "key",
        label: "Section key",
        type: "select",
        required: true,
        options: [
          "hero",
          "about",
          "education",
          "skills",
          "experience",
          "projects",
          "certifications",
          "achievements",
          "services",
          "contact",
        ],
      },
      { name: "title", label: "Heading", type: "text", required: true },
      { name: "subtitle", label: "Eyebrow text", type: "text" },
      { name: "description", label: "Intro text", type: "textarea" },
      { name: "enabled", label: "Section shown", ...YES_NO },
    ],
  },
  {
    slug: "resume",
    table: "resumes",
    title: "Resume files",
    description: "Upload resume versions and choose the active one.",
    titleField: "label",
    subtitleField: "file_url",
    sortable: false,
    searchFields: ["label"],
    fields: [
      { name: "label", label: "Label", type: "text", required: true },
      { name: "file_url", label: "Resume file", type: "file", folder: "resume", required: true },
      { name: "is_active", label: "Active version", ...YES_NO },
    ],
  },
];

export function collectionBySlug(slug: string) {
  return COLLECTIONS.find((collection) => collection.slug === slug);
}

/** Single-row editors. */
export const PROFILE_FIELDS: Field[] = [
  { name: "full_name", label: "Full name", type: "text", required: true },
  { name: "professional_title", label: "Professional title", type: "text" },
  { name: "tagline", label: "Tagline", type: "text" },
  { name: "bio_short", label: "Short bio", type: "textarea", rows: 3 },
  { name: "bio_long", label: "Full bio", type: "textarea", rows: 8, help: "One paragraph per line" },
  { name: "avatar_url", label: "Profile photo", type: "image", folder: "profile" },
  { name: "availability", label: "Availability badge", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "location", label: "Location", type: "text" },
  { name: "website", label: "Website", type: "text" },
  { name: "hero_primary_label", label: "Main button label", type: "text" },
  { name: "hero_primary_href", label: "Main button link", type: "text" },
  { name: "hero_primary_visible", label: "Show main button", type: "boolean" },
  { name: "hero_secondary_label", label: "Second button label", type: "text" },
  {
    name: "hero_secondary_href",
    label: "Second button link",
    type: "text",
    help: "Leave empty to use the active resume file",
  },
  { name: "hero_secondary_visible", label: "Show second button", type: "boolean" },
  { name: "hero_tertiary_label", label: "Third button label", type: "text" },
  { name: "hero_tertiary_href", label: "Third button link", type: "text" },
  { name: "hero_tertiary_visible", label: "Show third button", type: "boolean" },
];

export const CONTACT_FIELDS: Field[] = [
  { name: "note", label: "Intro text", type: "textarea", rows: 3 },
  { name: "email", label: "Email", type: "text" },
  { name: "email_visible", label: "Show email", type: "boolean" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "phone_visible", label: "Show phone", type: "boolean" },
  { name: "location", label: "Location", type: "text" },
  { name: "location_visible", label: "Show location", type: "boolean" },
  { name: "website", label: "Website", type: "text" },
  { name: "website_visible", label: "Show website", type: "boolean" },
];

export const SETTINGS_FIELDS: Field[] = [
  { name: "site_name", label: "Site name", type: "text", required: true },
  { name: "logo_url", label: "Logo", type: "image", folder: "brand" },
  { name: "favicon_url", label: "Favicon", type: "image", folder: "brand" },
  { name: "accent_color", label: "Accent colour", type: "text", help: "Hex value, e.g. #1D4ED8" },
  {
    name: "default_theme",
    label: "Default theme",
    type: "select",
    options: ["system", "light", "dark"],
  },
  { name: "footer_text", label: "Footer text", type: "textarea", rows: 3 },
  { name: "copyright", label: "Copyright line", type: "text" },
  { name: "contact_email", label: "Notification email", type: "text" },
  { name: "meta_title", label: "Browser/search title", type: "text" },
  { name: "meta_description", label: "Search description", type: "textarea", rows: 3 },
  { name: "og_title", label: "Share title", type: "text" },
  { name: "og_description", label: "Share description", type: "textarea", rows: 3 },
  { name: "og_image_url", label: "Share image", type: "image", folder: "brand" },
  { name: "canonical_url", label: "Site address", type: "text", help: "e.g. https://yourdomain.com" },
];
