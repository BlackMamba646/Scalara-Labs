export interface BlogListingPageSeo {
  metaTitle: string;
  metaDescription: string;
}

export interface BlogListingPageData {
  heroCaption: string | null;
  heroTitleLight: string | null;
  heroTitleAccent: string | null;
  heroSubtitle: string | null;
  seo: BlogListingPageSeo | null;
}

import type { StrapiImage } from "./strapi";

export interface BlogPostCms {
  title: string;
  slug: string;
  author: string | null;
  date: string | null;
  excerpt: string | null;
  content: string | null;
  heroImage?: StrapiImage | null;
  /** Resolved absolute URL for hero image (set server-side) */
  heroImageUrl?: string | null;
}
