import { CtaOverrides } from "./home";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import type { StrapiImage } from "./strapi";

export interface ServiceChecklistItem { text: string }
export interface ServiceContentBlock { kicker: string; title: string; paragraph: BlocksContent; image?: StrapiImage | null }
export interface ServiceCaseStudy { clientHandle: string; clientName: string; heading: string; ctaText: string; clientAvatar?: StrapiImage | null; image?: StrapiImage | null; highlights?: ServiceChecklistItem[] | null }
export interface ServiceDetailSeo { metaTitle: string; metaDescription: string; ogImage?: StrapiImage | null }
export interface ServiceDetailTag { label: string }

export interface ServiceDetailData {
  title: string | null;
  slug: string;
  heroSubtitle: string | null;
  heroKicker1: string | null;
  heroKicker2: string | null;
  heroBodyText: string | null;
  heroCtaText: string | null;
  bodyTitle: string | null;
  bodyChecklist: ServiceChecklistItem[] | null;
  featuresTitle: string | null;
  featuresChecklist: ServiceChecklistItem[] | null;
  serviceContent: ServiceContentBlock[] | null;
  caseStudy: ServiceCaseStudy | null;
  tags: ServiceDetailTag[] | null;
  ctaOverrides: CtaOverrides | null;
  seo: ServiceDetailSeo | null;
  image?: StrapiImage | null;
}
