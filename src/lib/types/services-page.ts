import { CtaOverrides, ServiceTag } from "./home";
import type { StrapiImage } from "./strapi";

export interface ServicesPageSeo {
  metaTitle: string;
  metaDescription: string;
}

export interface ServicesPageData {
  heroH1: string | null;
  heroBody: string | null;
  heroBadgesLabel: string | null;
  ctaOverrides: CtaOverrides | null;
  seo: ServicesPageSeo | null;
}

export interface ServiceListingCms {
  title: string;
  slug: string;
  heroBodyText: string | null;
  tags: ServiceTag[];
  image?: StrapiImage | null;
  /** Resolved absolute URL for service image (set server-side) */
  imageUrl?: string | null;
}
