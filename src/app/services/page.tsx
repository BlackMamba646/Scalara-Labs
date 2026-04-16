import type { Metadata } from "next";
import { fetchStrapi } from "@/lib/strapi";
import { getStrapiImageUrl } from "@/lib/strapi-image";
import type { ServicesPageData, ServiceListingCms } from "@/lib/types/services-page";

import Header from '@/components/shared/Header/Header';
import HeroSection from '@/page-sections/ServicesPagesListing/sections/HeroSection/HeroSection';
import ServicesGrid from '@/page-sections/ServicesPagesListing/sections/ServicesGrid/ServicesGrid';
import CtaSection from '@/page-sections/ServicesPagesListing/sections/CtaSection/CtaSection';
import Footer from '@/components/shared/Footer/Footer';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await fetchStrapi<ServicesPageData>("/api/services-page?populate=*");
    return {
      title: data.seo?.metaTitle ?? "Services | Scalara Labs",
      description: data.seo?.metaDescription ?? "Explore our full range of software development services.",
    };
  } catch {
    return {
      title: "Services | Scalara Labs",
      description: "Explore our full range of software development services.",
    };
  }
}

export default async function ServicesPagesListingPage() {
  let pageData: ServicesPageData | null = null;
  let services: ServiceListingCms[] | null = null;

  try {
    [pageData, services] = await Promise.all([
      fetchStrapi<ServicesPageData>("/api/services-page?populate=*"),
      fetchStrapi<ServiceListingCms[]>("/api/services?populate[image]=true&populate[tags]=true&sort=createdAt:asc"),
    ]);
  } catch {
    // CMS unreachable — listings render empty state
  }

  return (
    <main>
      <Header variant="light" services={services} />
      <HeroSection
        heroH1={pageData?.heroH1 ?? undefined}
        heroBody={pageData?.heroBody ?? undefined}
        heroBadgesLabel={pageData?.heroBadgesLabel ?? undefined}
      />
      <ServicesGrid cmsServices={services?.map(s => ({
        ...s,
        imageUrl: getStrapiImageUrl(s.image, 'medium'),
      })) ?? undefined} />
      <CtaSection
        caption={pageData?.ctaOverrides?.caption ?? undefined}
        title={pageData?.ctaOverrides?.title ?? undefined}
        description={pageData?.ctaOverrides?.description ?? undefined}
        buttonText={pageData?.ctaOverrides?.buttonText ?? undefined}
      />
      <Footer />
    </main>
  );
}
