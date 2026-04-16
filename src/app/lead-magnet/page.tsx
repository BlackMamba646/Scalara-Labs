import type { Metadata } from 'next';
import { fetchStrapi } from '@/lib/strapi';
import { fetchTeamMembers } from '@/lib/team-members';
import type { LeadMagnetPageData } from '@/lib/types/lead-magnet';
import type { HomePageData } from '@/lib/types/home';
import type { GlobalData } from '@/lib/types/global';

import Header from '@/components/shared/Header/Header'
import HeroContainer from '@/page-sections/LeadMagnetPage/sections/HeroContainer/HeroContainer'
import TechnicalDebt from '@/page-sections/LeadMagnetPage/sections/TechnicalDebt/TechnicalDebt'
import AuditReveals from '@/page-sections/LeadMagnetPage/sections/AuditReveals/AuditReveals'
import WhyAudit from '@/page-sections/LeadMagnetPage/sections/WhyAudit/WhyAudit'
import IdealFor from '@/page-sections/LeadMagnetPage/sections/IdealFor/IdealFor'
import Team from '@/components/shared/Team/Team'
import Cta from '@/components/shared/Cta/Cta'
import Footer from '@/components/shared/Footer/Footer'

async function getLeadMagnetData() {
  try {
    const [leadMagnet, homePage, teamMembers, globalData] = await Promise.all([
      fetchStrapi<LeadMagnetPageData>('/api/lead-magnet-page?populate=*'),
      fetchStrapi<HomePageData>('/api/home-page?populate[seo]=true'),
      fetchTeamMembers(),
      fetchStrapi<GlobalData>('/api/global?populate[services][populate]=*'),
    ]);
    return { leadMagnet, homePage, teamMembers, globalData };
  } catch {
    return { leadMagnet: null, homePage: null, teamMembers: null, globalData: null };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await fetchStrapi<LeadMagnetPageData>('/api/lead-magnet-page?populate=*');
    return {
      title: data.seo?.metaTitle ?? 'Free Technical Audit | Scalara Labs',
      description: data.seo?.metaDescription ?? 'Get a free technical audit of your software. Discover hidden risks, performance issues, and scalability problems.',
    };
  } catch {
    return {
      title: 'Free Technical Audit | Scalara Labs',
      description: 'Get a free technical audit of your software. Discover hidden risks, performance issues, and scalability problems.',
    };
  }
}

export default async function LeadMagnetPage() {
  const { leadMagnet, homePage, teamMembers, globalData } = await getLeadMagnetData();

  return (
    <>
      <Header services={globalData?.services} />
      <HeroContainer
        heroH1={leadMagnet?.heroH1 ?? undefined}
        heroSubtitle={leadMagnet?.heroSubtitle ?? undefined}
        formTitle={leadMagnet?.formTitle ?? undefined}
        formButtonText={leadMagnet?.formButtonText ?? undefined}
      />
      <TechnicalDebt
        title={leadMagnet?.technicalDebtTitle ?? undefined}
        paragraphs={leadMagnet?.technicalDebtParagraphs ?? undefined}
      />
      <AuditReveals
        caption={leadMagnet?.auditRevealsCaption ?? undefined}
        title={leadMagnet?.auditRevealsTitle ?? undefined}
        body={leadMagnet?.auditRevealsBody ?? undefined}
        checklistTitle={leadMagnet?.auditChecklistTitle ?? undefined}
        checklistItems={leadMagnet?.auditChecklistItems ?? undefined}
      />
      <WhyAudit
        title={leadMagnet?.whyAuditTitle ?? undefined}
        cards={leadMagnet?.whyAuditCards ?? undefined}
      />
      <IdealFor
        heading={leadMagnet?.idealForHeading ?? undefined}
        items={leadMagnet?.idealForItems ?? undefined}
      />
      <Team
        subtitle={leadMagnet?.teamSubtitle ?? "We focus on building reliable, maintainable, and scalable software architectures."}
        title={homePage?.teamTitle ?? undefined}
        members={teamMembers ?? undefined}
      />
      <Cta
        variant="light"
        caption={leadMagnet?.ctaOverrides?.caption ?? undefined}
        title={leadMagnet?.ctaOverrides?.title ?? "Find Out the Real Health of Your Software"}
        description={leadMagnet?.ctaOverrides?.description ?? "Request your free technical audit and receive expert feedback about your system's architecture, performance, and scalability."}
        buttonText={leadMagnet?.ctaOverrides?.buttonText ?? "Request a Free Audit"}
      />
      <Footer />
    </>
  )
}
