import type { CtaOverrides } from './home';

export interface ChecklistItem {
  text: string;
}

export interface WhyAuditCard {
  number: string;
  title: string;
  description: string;
}

export interface LeadMagnetSeo {
  metaTitle: string;
  metaDescription: string;
}

export interface LeadMagnetPageData {
  heroH1: string | null;
  heroSubtitle: string | null;
  formTitle: string | null;
  formButtonText: string | null;

  technicalDebtTitle: string | null;
  technicalDebtParagraphs: string | null;

  auditRevealsCaption: string | null;
  auditRevealsTitle: string | null;
  auditRevealsBody: string | null;
  auditChecklistTitle: string | null;
  auditChecklistItems: ChecklistItem[] | null;

  whyAuditTitle: string | null;
  whyAuditCards: WhyAuditCard[] | null;

  idealForHeading: string | null;
  idealForItems: ChecklistItem[] | null;

  teamSubtitle: string | null;

  ctaOverrides: CtaOverrides | null;
  seo: LeadMagnetSeo | null;
}
