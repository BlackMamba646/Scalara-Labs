import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchStrapi } from '@/lib/strapi';
import { getStrapiImageUrl } from '@/lib/strapi-image';
import { fetchTeamMembers } from '@/lib/team-members';
import type { ServiceDetailData } from '@/lib/types/service';
import type { GlobalData } from '@/lib/types/global';

import Header from '@/components/shared/Header/Header';
import HeroContainer from '@/page-sections/ServicePage/sections/HeroContainer/HeroContainer';
import BodyText from '@/page-sections/ServicePage/sections/BodyText/BodyText';
import WhyChooseBuiltBeyond from '@/page-sections/ServicePage/sections/WhyChooseBuiltBeyond/WhyChooseBuiltBeyond';
import WhyChooseNativeCrossPlatform from '@/page-sections/ServicePage/sections/WhyChooseNativeCrossPlatform/WhyChooseNativeCrossPlatform';
import WhyChooseRealWorld from '@/page-sections/ServicePage/sections/WhyChooseRealWorld/WhyChooseRealWorld';
import ServiceFeatures from '@/page-sections/ServicePage/sections/ServiceFeatures/ServiceFeatures';
import Team from '@/components/shared/Team/Team';
import CaseStudy from '@/page-sections/ServicePage/sections/CaseStudy/CaseStudy';
import Cta from '@/components/shared/Cta/Cta';
import Footer from '@/components/shared/Footer/Footer';

export async function generateStaticParams() {
  const services = await fetchStrapi<{ slug: string }[]>(
    '/api/services?fields[0]=slug'
  );
  return services.map((s) => ({ slug: s.slug }));
}

const SERVICE_POPULATE = '&populate[image]=true&populate[serviceContent][populate][image]=true&populate[caseStudy][populate]=*&populate[seo][populate]=*&populate[tags]=true&populate[bodyChecklist]=true&populate[featuresChecklist]=true&populate[ctaOverrides]=true';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const results = await fetchStrapi<ServiceDetailData[]>(
    `/api/services?filters[slug]=${slug}${SERVICE_POPULATE}`
  );
  const service = results[0];
  if (!service) notFound();
  const ogImageUrl = getStrapiImageUrl(service.seo?.ogImage);
  return {
    title: service.seo?.metaTitle ?? service.title ?? 'Service',
    description: service.seo?.metaDescription ?? '',
    ...(ogImageUrl && { openGraph: { images: [ogImageUrl] } }),
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [results, teamMembers, globalData] = await Promise.all([
    fetchStrapi<ServiceDetailData[]>(
      `/api/services?filters[slug]=${slug}${SERVICE_POPULATE}`
    ),
    fetchTeamMembers(),
    fetchStrapi<GlobalData>('/api/global?populate[services][populate]=*').catch(() => null),
  ]);
  const service = results[0];
  if (!service) notFound();

  return (
    <main>
      <Header variant="dark" services={globalData?.services} />
      <HeroContainer
        title={service.title}
        heroKicker1={service.heroKicker1}
        heroKicker2={service.heroKicker2}
        heroSubtitle={service.heroSubtitle}
        heroBodyText={service.heroBodyText}
        heroCtaText={service.heroCtaText}
        imageUrl={getStrapiImageUrl(service.image, 'large')}
      />
      <BodyText
        bodyTitle={service.bodyTitle}
        bodyChecklist={service.bodyChecklist}
      />
      <WhyChooseBuiltBeyond
        kicker={service.serviceContent?.[0]?.kicker}
        title={service.serviceContent?.[0]?.title}
        paragraph={service.serviceContent?.[0]?.paragraph}
        imageUrl={getStrapiImageUrl(service.serviceContent?.[0]?.image)}
      />
      <WhyChooseNativeCrossPlatform
        kicker={service.serviceContent?.[1]?.kicker}
        title={service.serviceContent?.[1]?.title}
        paragraph={service.serviceContent?.[1]?.paragraph}
        imageUrl={getStrapiImageUrl(service.serviceContent?.[1]?.image)}
      />
      <WhyChooseRealWorld
        kicker={service.serviceContent?.[2]?.kicker}
        title={service.serviceContent?.[2]?.title}
        paragraph={service.serviceContent?.[2]?.paragraph}
        imageUrl={getStrapiImageUrl(service.serviceContent?.[2]?.image)}
      />
      <ServiceFeatures
        featuresTitle={service.featuresTitle}
        featuresChecklist={service.featuresChecklist}
      />
      <Team members={teamMembers ?? undefined} />
      <CaseStudy
        clientHandle={service.caseStudy?.clientHandle}
        clientName={service.caseStudy?.clientName}
        heading={service.caseStudy?.heading}
        ctaText={service.caseStudy?.ctaText}
        clientAvatarUrl={getStrapiImageUrl(service.caseStudy?.clientAvatar)}
        highlights={service.caseStudy?.highlights}
      />
      <Cta
        variant="light"
        caption={service.ctaOverrides?.caption}
        title={service.ctaOverrides?.title}
        description={service.ctaOverrides?.description}
        buttonText={service.ctaOverrides?.buttonText}
      />
      <Footer />
    </main>
  );
}
