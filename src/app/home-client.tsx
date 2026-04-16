"use client";

import { useState } from "react";
import Header from "@/components/shared/Header/Header";
import { HeroSection } from "./components/hero-section";
import Services from "@/components/shared/Services/Services";
import { WhyChooseSection } from "./components/why-choose-section";
import Team from "@/components/shared/Team/Team";
import Cta from "@/components/shared/Cta/Cta";
import Footer from "@/components/shared/Footer/Footer";
import { ConsultationModal } from "./components/consultation-modal";
import type { HomePageData, TeamMemberCms } from "@/lib/types/home";
import type { GlobalServiceCms } from "@/lib/types/global";

interface HomeClientProps {
  homeData: HomePageData | null;
  services: GlobalServiceCms[] | null;
  teamMembers: TeamMemberCms[] | null;
}

export default function HomeClient({ homeData, services, teamMembers }: HomeClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  function openModal(serviceKey?: string) {
    setSelectedService(serviceKey ?? null);
    setModalOpen(true);
  }

  return (
    <div className="size-full">
      <Header services={services} />
      <HeroSection
        onConsultationClick={() => openModal()}
        rating={homeData?.heroRating ?? undefined}
        headingSerif={homeData?.heroHeadingSerif ?? undefined}
        headingBold={homeData?.heroHeadingBold ?? undefined}
        headingGradient={homeData?.heroHeadingGradient ?? undefined}
        ctaText={homeData?.heroCtaText ?? undefined}
        description={homeData?.heroDescription ?? undefined}
        techLogos={homeData?.heroTechLogos ?? undefined}
      />
      <div id="services">
        <Services
          caption={homeData?.servicesCaption ?? undefined}
          subcaption={homeData?.servicesSubcaption ?? undefined}
          title={homeData?.servicesTitle ?? undefined}
          services={services ?? undefined}
          showViewAll
        />
      </div>
      <div id="why-choose">
        <WhyChooseSection
          onConsultationClick={() => openModal()}
          label={homeData?.whyChooseLabel ?? undefined}
          title={homeData?.whyChooseTitle ?? undefined}
          description={homeData?.whyChooseDescription ?? undefined}
          ctaText={homeData?.whyChooseCtaText ?? undefined}
          cards={homeData?.whyChooseCards ?? undefined}
          bottomHeroPrefixLight={homeData?.bottomHeroPrefixLight ?? undefined}
          bottomHeroPrefixBold={homeData?.bottomHeroPrefixBold ?? undefined}
          bottomHeroHeading={homeData?.bottomHeroHeading ?? undefined}
          bottomHeroDescription={homeData?.bottomHeroDescription ?? undefined}
          bottomHeroButtonText={homeData?.bottomHeroButtonText ?? undefined}
        />
      </div>
      <div id="team">
        <Team
          title={homeData?.teamTitle ?? undefined}
          subtitle={homeData?.teamSubtitle ?? undefined}
          members={teamMembers ?? undefined}
        />
      </div>
      <div id="contact">
        <Cta
          variant="light"
          caption={homeData?.ctaOverrides?.caption ?? undefined}
          title={homeData?.ctaOverrides?.title ?? undefined}
          description={homeData?.ctaOverrides?.description ?? undefined}
          buttonText={homeData?.ctaOverrides?.buttonText ?? undefined}
        />
      </div>
      <Footer />
      <ConsultationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedService={selectedService}
        consultationServices={homeData?.consultationServices ?? undefined}
      />
    </div>
  );
}
