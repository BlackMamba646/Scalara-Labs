import type { StrapiImage } from "./strapi";

// ---------- Shared sub-types ----------

export interface HomePageSeo {
  metaTitle: string;
  metaDescription: string;
}

export interface HeroTechLogo {
  name: string;
  logo?: StrapiImage | null;
}

export interface WhyChooseCard {
  number: string;
  title: string;
  description: string;
}

export interface ConsultationServiceInfo {
  label: string;
  heading: string;
  subtitle: string;
}

export interface CtaOverrides {
  caption?: string;
  title?: string;
  description?: string;
  buttonText?: string;
}

export interface TeamMemberCms {
  name: string;
  role: string;
  bio: string;
  linkedinUrl: string;
  desktopPhoto?: StrapiImage | null;
  mobilePhoto?: StrapiImage | null;
  /** Resolved absolute URL for desktop photo (set server-side) */
  desktopPhotoUrl?: string | null;
  /** Resolved absolute URL for mobile photo (set server-side) */
  mobilePhotoUrl?: string | null;
}

export interface ServiceTag {
  label: string;
}

// ---------- Home Page endpoint ----------

export interface HomePageData {
  // Hero
  heroRating: number | null;
  heroHeadingSerif: string | null;
  heroHeadingBold: string | null;
  heroHeadingGradient: string | null;
  heroCtaText: string | null;
  heroDescription: string | null;
  heroTechLogos: HeroTechLogo[] | null;

  // Services section headings
  servicesCaption: string | null;
  servicesSubcaption: string | null;
  servicesTitle: string | null;

  // Why Choose
  whyChooseLabel: string | null;
  whyChooseTitle: string | null;
  whyChooseDescription: string | null;
  whyChooseCtaText: string | null;
  whyChooseCards: WhyChooseCard[] | null;

  // Bottom Hero
  bottomHeroPrefixLight: string | null;
  bottomHeroPrefixBold: string | null;
  bottomHeroHeading: string | null;
  bottomHeroDescription: string | null;
  bottomHeroButtonText: string | null;

  // Team (members live in the dedicated /api/team-members single type)
  teamTitle: string | null;
  teamSubtitle: string | null;

  // Consultation modal
  consultationServices: ConsultationServiceInfo[] | null;

  // CTA section
  ctaOverrides: CtaOverrides | null;

  // SEO
  seo: HomePageSeo | null;
}

// ---------- Services endpoint ----------

export interface ServiceCms {
  title: string;
  slug: string;
  tags: ServiceTag[];
}
