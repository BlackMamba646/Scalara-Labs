import type { StrapiImage } from "./strapi";

export interface AboutUsPageSeo {
  metaTitle: string;
  metaDescription: string;
}

export interface WhatMakesDifferentCard {
  number: string;
  title: string;
  description: string;
}

export interface OurStackLogo {
  name: string;
  logo?: StrapiImage | null;
}

export interface AboutUsPageData {
  heroSubtitleLight: string | null;
  heroSubtitleAccent: string | null;
  heroH1Normal: string | null;
  heroH1Large: string | null;
  heroBodyText: string | null;
  heroCtaText: string | null;
  bodyText: string | null;
  ourDifferenceCaption: string | null;
  ourDifferenceTitle: string | null;
  ourDifferenceSubtitle: string | null;
  ourDifferenceCard1Title: string | null;
  ourDifferenceCard1Body: string | null;
  ourDifferenceEngineeringTitle: string | null;
  ourDifferenceEngineeringBody: string | null;
  ourDifferenceBeliefCaption: string | null;
  ourDifferenceBeliefQuote: string | null;
  ourDifferenceBeliefLabel: string | null;
  ourDifferenceClosingParagraphs: string | null;
  ourStackTitle: string | null;
  ourStackCaption: string | null;
  ourStackLogos: OurStackLogo[] | null;
  whatMakesDifferentTitle: string | null;
  whatMakesDifferentCaption: string | null;
  whatMakesDifferentCards: WhatMakesDifferentCard[] | null;
  seo: AboutUsPageSeo | null;
}
