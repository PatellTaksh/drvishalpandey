export const SITE_URL = "https://drvishalpandey.lovable.app";

/** Turns stored image URLs (including /api/public/media/... uploads) into absolute URLs for crawlers. */
export function absoluteUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return SITE_URL + url;
  return null;
}

type SocialMetaInput = {
  title: string;
  description: string;
  path: string;
  type: "website" | "article" | "profile";
  siteName?: string | null | undefined;
  images: Array<string | null | undefined>;
};

export function socialMeta({ title, description, path, type, siteName, images }: SocialMetaInput) {
  const url = SITE_URL + path;
  const image = images.map(absoluteUrl).find(Boolean) ?? null;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      ...(siteName ? [{ property: "og:site_name", content: siteName }] : []),
      { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      ...(image
        ? [
            { property: "og:image", content: image },
            { property: "og:image:alt", content: title },
            { name: "twitter:image", content: image },
          ]
        : []),
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
