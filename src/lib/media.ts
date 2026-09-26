/**
 * Uploaded files live in a private storage bucket and are served back through
 * the site's own /api/public/media/* route, so stored URLs stay stable.
 */
export const MEDIA_ROUTE_PREFIX = "/api/public/media/";

export function mediaUrlForPath(path: string) {
  return MEDIA_ROUTE_PREFIX + path.split("/").map(encodeURIComponent).join("/");
}

export function isMediaUrl(url: string | null | undefined) {
  return !!url && url.startsWith(MEDIA_ROUTE_PREFIX);
}

export function mediaPathFromUrl(url: string) {
  return decodeURIComponent(url.slice(MEDIA_ROUTE_PREFIX.length));
}
