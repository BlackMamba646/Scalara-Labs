'use client';

import Image from 'next/image';
import { ScrollReveal } from '@/app/components/scroll-reveal';

/* Trust badge SVG imports */
import dockerIcon from '../../../../imports/servicespageslisting-hero-section-docker.svg';
import googleCloudIcon from '../../../../imports/servicespageslisting-hero-section-google-cloud.svg';
import langgraphIcon from '../../../../imports/servicespageslisting-hero-section-langgraph.svg';
import angularIcon from '../../../../imports/servicespageslisting-hero-section-angular.svg';
import flutterVector from '../../../../imports/servicespageslisting-hero-section-flutter-vector.svg';
import reactIcon from '../../../../imports/servicespageslisting-hero-section-react.svg';
import springBootIcon from '../../../../imports/servicespageslisting-hero-section-spring-boot.svg';
import awsIcon from '../../../../imports/servicespageslisting-hero-section-aws.svg';

/* Raster image imports */
import heroGraphic from '../../../../assets/images/servicespageslisting-hero-section-graphic.jpg';
import heroListing from '../../../../assets/images/servicespageslisting-hero-section-listing-hero.webp';

interface HeroSectionProps {
  heroH1?: string;
  heroBody?: string;
  heroBadgesLabel?: string;
}

export default function HeroSection({
  heroH1 = 'Everything You Need to Build, Launch, and Scale',
  heroBody = 'From mobile apps to enterprise-grade platforms — one team, end-to-end.',
  heroBadgesLabel = 'Modern stack. Production-ready.',
}: HeroSectionProps) {
  return (
    <section className="servicespageslisting-hero-section">
      {/* Desktop hero graphic — absolute positioned on right */}
      <div className="servicespageslisting-hero-section__graphic" aria-hidden="true">
        <Image
          src={heroGraphic}
          alt=""
          width={805}
          height={449}
          priority
          placeholder="blur"
          sizes="(min-width: 1024px) 805px, 0px"
        />
      </div>

      <div className="content-container servicespageslisting-hero-section__inner">
        {/* Content area */}
        <div className="servicespageslisting-hero-section__content">
          {/* Trust badges */}
          <ScrollReveal immediate direction="up" delay={0.1} distance={20}>
            <div className="servicespageslisting-hero-section__badges">
              <p className="servicespageslisting-hero-section__badges-label">
                {heroBadgesLabel}
              </p>
              <div className="servicespageslisting-hero-section__logos">
                <span className="servicespageslisting-hero-section__logo-docker">
                  <Image src={dockerIcon} alt="Docker" width={30} height={24} />
                </span>
                <span className="servicespageslisting-hero-section__logo-google-cloud">
                  <Image src={googleCloudIcon} alt="Google Cloud" width={25} height={20} />
                </span>
                <span className="servicespageslisting-hero-section__logo-langgraph">
                  <Image src={langgraphIcon} alt="LangGraph" width={39} height={20} />
                </span>
                <span className="servicespageslisting-hero-section__logo-angular">
                  <Image src={angularIcon} alt="Angular" width={19} height={20} />
                </span>
                <span className="servicespageslisting-hero-section__logo-flutter">
                  <Image src={flutterVector} alt="Flutter" width={16} height={18} />
                </span>
                <span className="servicespageslisting-hero-section__logo-react">
                  <Image src={reactIcon} alt="React" width={22} height={20} />
                </span>
                <span className="servicespageslisting-hero-section__logo-spring-boot">
                  <Image src={springBootIcon} alt="Spring Boot" width={20} height={20} />
                </span>
                <span className="servicespageslisting-hero-section__logo-aws">
                  <Image src={awsIcon} alt="AWS" width={33} height={20} />
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Display heading */}
          <ScrollReveal immediate direction="up" delay={0.25} distance={25}>
            <div className="servicespageslisting-hero-section__heading">
              <h1 className="servicespageslisting-hero-section__h1">
                {heroH1}
              </h1>
              <p className="servicespageslisting-hero-section__body">
                {heroBody}
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Hero image — Tablet/Mobile (inline, below content) */}
        <ScrollReveal immediate direction="none" delay={0.35}>
          <div className="servicespageslisting-hero-section__hero-image-inline">
            <Image
              src={heroListing}
              alt="Scalara Labs services hero"
              width={908}
              height={440}
              priority
              placeholder="blur"
              sizes="(max-width: 767px) 660px, (max-width: 1023px) 908px, 0px"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
