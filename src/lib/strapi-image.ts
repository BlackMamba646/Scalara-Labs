import type { StrapiImage } from "./types/strapi";

const CMS_URL = process.env.CMS_URL || "http://localhost:1337";

function resolveUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return `${CMS_URL}${url}`;
}

/**
 * Resolves a Strapi image to an absolute URL.
 * Pass a `format` to select a Strapi-generated size variant instead of the original.
 * Falls back to the original if the requested format doesn't exist.
 * Must be called from Server Components only (uses process.env).
 */
export function getStrapiImageUrl(
  image: StrapiImage | null | undefined,
  format?: "thumbnail" | "small" | "medium" | "large"
): string | null {
  if (!image?.url) return null;
  if (format && image.formats?.[format]?.url) {
    return resolveUrl(image.formats[format]!.url);
  }
  return resolveUrl(image.url);
}
