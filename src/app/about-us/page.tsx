import type { Metadata } from 'next';
import { fetchStrapi } from '@/lib/strapi';
import { getStrapiImageUrl } from '@/lib/strapi-image';
import { fetchTeamMembers } from '@/lib/team-members';
import type { AboutUsPageData } from '@/lib/types/about-us';
import type { HomePageData } from '@/lib/types/home';
import type { GlobalData } from '@/lib/types/global';

import Header from '@/components/shared/Header/Header';
import HeroSection from '@/page-sections/AboutUs/sections/HeroSection/HeroSection';
import BodyTextBadges from '@/page-sections/AboutUs/sections/BodyTextBadges/BodyTextBadges';
import OurDifference from '@/page-sections/AboutUs/sections/OurDifference/OurDifference';
import OurStack from '@/page-sections/AboutUs/sections/OurStack/OurStack';
import WhatMakesUsDifferent from '@/page-sections/AboutUs/sections/WhatMakesUsDifferent/WhatMakesUsDifferent';
import Team from '@/components/shared/Team/Team';
import Services from '@/components/shared/Services/Services';
import Footer from '@/components/shared/Footer/Footer';

async function getAboutUsData() {
  try {
    const [aboutUs, homePage, globalData, teamMembers] = await Promise.all([
      fetchStrapi<AboutUsPageData>('/api/about-us-page?populate[ourStackLogos][populate]=*&populate[whatMakesDifferentCards]=true&populate[seo]=true'),
      fetchStrapi<HomePageData>('/api/home-page?populate[seo]=true'),
      fetchStrapi<GlobalData>('/api/global?populate[services][populate]=*'),
      fetchTeamMembers(),
    ]);
    return { aboutUs, homePage, globalData, teamMembers };
  } catch {
    return { aboutUs: null, homePage: null, globalData: null, teamMembers: null };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await fetchStrapi<AboutUsPageData>('/api/about-us-page?populate=*');
    return {
      title: data.seo?.metaTitle ?? 'About Us | Scalara Labs',
      description: data.seo?.metaDescription ?? 'Learn about Scalara Labs, a software development agency based in Serbia.',
    };
  } catch {
    return {
      title: 'About Us | Scalara Labs',
      description: 'Learn about Scalara Labs, a software development agency based in Serbia.',
    };
  }
}

export default async function AboutUsPage() {
  const { aboutUs, homePage, globalData, teamMembers } = await getAboutUsData();

  return (
    <>
      <Header services={globalData?.services} />
      <HeroSection
        subtitleLight={aboutUs?.heroSubtitleLight ?? undefined}
        subtitleAccent={aboutUs?.heroSubtitleAccent ?? undefined}
        h1Normal={aboutUs?.heroH1Normal ?? undefined}
        h1Large={aboutUs?.heroH1Large ?? undefined}
        bodyText={aboutUs?.heroBodyText ?? undefined}
        ctaText={aboutUs?.heroCtaText ?? undefined}
      />
      <BodyTextBadges
        bodyText={aboutUs?.bodyText ?? undefined}
      />
      <OurDifference
        caption={aboutUs?.ourDifferenceCaption ?? undefined}
        title={aboutUs?.ourDifferenceTitle ?? undefined}
        subtitle={aboutUs?.ourDifferenceSubtitle ?? undefined}
        card1Title={aboutUs?.ourDifferenceCard1Title ?? undefined}
        card1Body={aboutUs?.ourDifferenceCard1Body ?? undefined}
        engineeringTitle={aboutUs?.ourDifferenceEngineeringTitle ?? undefined}
        engineeringBody={aboutUs?.ourDifferenceEngineeringBody ?? undefined}
        beliefCaption={aboutUs?.ourDifferenceBeliefCaption ?? undefined}
        beliefQuote={aboutUs?.ourDifferenceBeliefQuote ?? undefined}
        beliefLabel={aboutUs?.ourDifferenceBeliefLabel ?? undefined}
        closingParagraphs={aboutUs?.ourDifferenceClosingParagraphs ?? undefined}
      />
      <OurStack
        title={aboutUs?.ourStackTitle ?? undefined}
        caption={aboutUs?.ourStackCaption ?? undefined}
        logos={aboutUs?.ourStackLogos?.map(l => ({
          ...l,
          logo: l.logo ? { ...l.logo, url: getStrapiImageUrl(l.logo) || l.logo.url } : null,
        })) ?? undefined}
      />
      <WhatMakesUsDifferent
        title={aboutUs?.whatMakesDifferentTitle ?? undefined}
        caption={aboutUs?.whatMakesDifferentCaption ?? undefined}
        cards={aboutUs?.whatMakesDifferentCards ?? undefined}
      />
      <Team
        title={homePage?.teamTitle ?? undefined}
        subtitle={homePage?.teamSubtitle ?? undefined}
        members={teamMembers ?? undefined}
      />
      <Services services={globalData?.services ?? undefined} />
      <Footer />
    </>
  );
}
