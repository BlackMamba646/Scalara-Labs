'use client';

import { ScrollReveal, StaggerReveal } from '@/app/components/scroll-reveal';
import patternGroup15 from '../../../../imports/leadmagnetpage-why-audit-pattern-group15.svg';
import patternGroup14 from '../../../../imports/leadmagnetpage-why-audit-pattern-group14.svg';
import patternCode from '../../../../imports/leadmagnetpage-why-audit-pattern-code.svg';
import scalaraText from '../../../../imports/leadmagnetpage-why-audit-scalara.svg';
import logoIcon from '../../../../imports/leadmagnetpage-why-audit-logo.svg';
import labsText from '../../../../imports/leadmagnetpage-why-audit-labs.svg';
import starBg from '../../../../imports/leadmagnetpage-why-audit-star-background.svg';
import starIcon from '../../../../imports/leadmagnetpage-why-audit-star.svg';
import bannerImg from '../../../../imports/leadmagnetpage-why-audit-banner-img.svg';
import MatrixRain from './MatrixRain';

/* Google Full Logo parts (desktop/tablet) */
import googleG from '../../../../imports/leadmagnetpage-why-audit-google-g.svg';
import googleO1 from '../../../../imports/leadmagnetpage-why-audit-google-o1.svg';
import googleO2 from '../../../../imports/leadmagnetpage-why-audit-google-o2.svg';
import googleCapitalG from '../../../../imports/leadmagnetpage-why-audit-google-capital-g.svg';
import googleL from '../../../../imports/leadmagnetpage-why-audit-google-l.svg';
import googleE from '../../../../imports/leadmagnetpage-why-audit-google-e.svg';

/* Google colored icon parts (mobile) */
import googleIcon1 from '../../../../imports/leadmagnetpage-why-audit-google-icon-1.svg';
import googleIcon2 from '../../../../imports/leadmagnetpage-why-audit-google-icon-2.svg';
import googleIcon3 from '../../../../imports/leadmagnetpage-why-audit-google-icon-3.svg';
import googleIcon4 from '../../../../imports/leadmagnetpage-why-audit-google-icon-4.svg';

const CARDS = [
  {
    number: '01/',
    text: 'Understand the real health of your software.',
  },
  {
    number: '02/',
    text: 'Identify scalability limitations before your product grows.',
  },
  {
    number: '03/',
    text: 'Detect performance bottlenecks affecting users.',
  },
  {
    number: '04/',
    text: 'Receive expert recommendations from experienced engineers.',
  },
];

function StarIcon() {
  return (
    <div className="leadmagnetpage-why-audit__star">
      <div className="leadmagnetpage-why-audit__star-bg">
        <img src={starBg.src} alt="" width={16} height={16} />
      </div>
      <div className="leadmagnetpage-why-audit__star-icon">
        <img src={starIcon.src} alt="" width={16} height={16} />
      </div>
    </div>
  );
}

function Card({ number, text }: { number: string; text: string }) {
  return (
    <div className="leadmagnetpage-why-audit__card">
      <p className="leadmagnetpage-why-audit__card-number">{number}</p>
      <div className="leadmagnetpage-why-audit__card-text">
        <p className="leadmagnetpage-why-audit__card-description">{text}</p>
      </div>
    </div>
  );
}

interface WhyAuditProps {
  title?: string;
  cards?: { number: string; title: string; description: string }[];
}

export default function WhyAudit({ title, cards: cardsProp }: WhyAuditProps) {
  const displayCards = cardsProp
    ? cardsProp.map((c) => ({ number: c.number, text: c.title }))
    : CARDS;

  return (
    <section className="leadmagnetpage-why-audit">
      <div className="content-container leadmagnetpage-why-audit__inner">
        {/* ===== Decorative background patterns ===== */}
        <div className="leadmagnetpage-why-audit__pattern" aria-hidden="true">
          <div className="leadmagnetpage-why-audit__pattern-item leadmagnetpage-why-audit__pattern-item--group15">
            <img src={patternGroup15.src} alt="" width={163} height={152} />
          </div>
          <div className="leadmagnetpage-why-audit__pattern-item leadmagnetpage-why-audit__pattern-item--group14">
            <img src={patternGroup14.src} alt="" width={163} height={152} />
          </div>
          <div className="leadmagnetpage-why-audit__pattern-item leadmagnetpage-why-audit__pattern-item--code">
            <img src={patternCode.src} alt="" width={214} height={200} />
          </div>
        </div>

        {/* ===== Heading area ===== */}
        <div className="leadmagnetpage-why-audit__heading">
          {/* Scalara Labs logo */}
          <ScrollReveal direction="none" scale={0.9}>
            <div className="leadmagnetpage-why-audit__logo-wrapper">
              <div className="leadmagnetpage-why-audit__logo">
                <div className="leadmagnetpage-why-audit__logo-scalara">
                  <img src={scalaraText.src} alt="" />
                </div>
                <div className="leadmagnetpage-why-audit__logo-icon">
                  <img src={logoIcon.src} alt="" />
                </div>
                <div className="leadmagnetpage-why-audit__logo-labs">
                  <img src={labsText.src} alt="" />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Main heading */}
          <ScrollReveal direction="up" delay={0.15} distance={25}>
            <h2 className="leadmagnetpage-why-audit__title">
              {title ?? 'Why Get a Technical Audit?'}
            </h2>
          </ScrollReveal>

          {/* Trust counter */}
          <ScrollReveal direction="up" delay={0.25} distance={15}>
            <div className="leadmagnetpage-why-audit__trust">
              <div className="leadmagnetpage-why-audit__reviews">
                <span className="leadmagnetpage-why-audit__rating">5.0</span>
                <div className="leadmagnetpage-why-audit__stars">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <StaggerReveal key={i} index={i} direction="none" scale={0.6} staggerDelay={0.06} baseDelay={0.4}>
                      <StarIcon />
                    </StaggerReveal>
                  ))}
                </div>
              </div>

            <div className="leadmagnetpage-why-audit__google-group">
              <span className="leadmagnetpage-why-audit__google-label">
                Star rated on
              </span>

              {/* Desktop/Tablet: Google Full Logo (multi-vector)
                  Positions: G-o-o-g-l-e from left to right */}
              <div className="leadmagnetpage-why-audit__google-full-logo">
                <div className="leadmagnetpage-why-audit__google-full-logo-part leadmagnetpage-why-audit__google-full-logo-part--capital-g">
                  <img src={googleCapitalG.src} alt="" />
                </div>
                <div className="leadmagnetpage-why-audit__google-full-logo-part leadmagnetpage-why-audit__google-full-logo-part--o1">
                  <img src={googleO1.src} alt="" />
                </div>
                <div className="leadmagnetpage-why-audit__google-full-logo-part leadmagnetpage-why-audit__google-full-logo-part--o2">
                  <img src={googleG.src} alt="" />
                </div>
                <div className="leadmagnetpage-why-audit__google-full-logo-part leadmagnetpage-why-audit__google-full-logo-part--g">
                  <img src={googleO2.src} alt="" />
                </div>
                <div className="leadmagnetpage-why-audit__google-full-logo-part leadmagnetpage-why-audit__google-full-logo-part--l">
                  <img src={googleL.src} alt="" />
                </div>
                <div className="leadmagnetpage-why-audit__google-full-logo-part leadmagnetpage-why-audit__google-full-logo-part--e">
                  <img src={googleE.src} alt="" />
                </div>
              </div>

              {/* Mobile: Google colored G icon (4-part) */}
              <div className="leadmagnetpage-why-audit__google-icon">
                <div className="leadmagnetpage-why-audit__google-icon-part leadmagnetpage-why-audit__google-icon-part--1">
                  <img src={googleIcon1.src} alt="" />
                </div>
                <div className="leadmagnetpage-why-audit__google-icon-part leadmagnetpage-why-audit__google-icon-part--2">
                  <img src={googleIcon2.src} alt="" />
                </div>
                <div className="leadmagnetpage-why-audit__google-icon-part leadmagnetpage-why-audit__google-icon-part--3">
                  <img src={googleIcon3.src} alt="" />
                </div>
                <div className="leadmagnetpage-why-audit__google-icon-part leadmagnetpage-why-audit__google-icon-part--4">
                  <img src={googleIcon4.src} alt="" />
                </div>
              </div>
            </div>
          </div>
          </ScrollReveal>
        </div>

        {/* ===== Desktop/Tablet Banner ===== */}
        <ScrollReveal direction="up" delay={0.1} distance={30} scale={0.98}>
        <div className="leadmagnetpage-why-audit__banner">
          {/* Gradient blur ellipses */}
          <div className="leadmagnetpage-why-audit__banner-glow" aria-hidden="true">
            <svg
              className="leadmagnetpage-why-audit__banner-glow-svg"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 1360 415"
            >
              <defs>
                <filter id="why-blur-1" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" x="0" y="60" width="700" height="500">
                  <feGaussianBlur stdDeviation="100" />
                </filter>
                <filter id="why-blur-2" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" x="660" y="40" width="700" height="500">
                  <feGaussianBlur stdDeviation="100" />
                </filter>
                <filter id="why-blur-3" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" x="300" y="100" width="800" height="400">
                  <feGaussianBlur stdDeviation="170" />
                </filter>
                <filter id="why-blur-4" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" x="200" y="80" width="900" height="350">
                  <feGaussianBlur stdDeviation="120" />
                </filter>
              </defs>
              <g filter="url(#why-blur-1)">
                <ellipse cx="350" cy="310" rx="130" ry="180" fill="#1F4EA4" fillOpacity="0.4" />
              </g>
              <g filter="url(#why-blur-2)">
                <ellipse cx="1010" cy="290" rx="140" ry="200" fill="#202B3D" />
              </g>
              <g filter="url(#why-blur-3)">
                <ellipse cx="700" cy="300" rx="115" ry="90" fill="#92B5F5" />
              </g>
              <g filter="url(#why-blur-4)">
                <ellipse cx="650" cy="250" rx="210" ry="95" fill="#0C1B3B" />
              </g>
            </svg>
          </div>

          {/* Matrix rain animation */}
          <MatrixRain />

          {/* Background parallelogram image */}
          <div className="leadmagnetpage-why-audit__banner-img" aria-hidden="true">
            <img src={bannerImg.src} alt="" width={772} height={365} />
          </div>

          {/* Cards grid — 4 across on desktop, 2x2 on tablet */}
          <div className="leadmagnetpage-why-audit__banner-grid">
            {displayCards.map((card, i) => (
              <StaggerReveal key={card.number} index={i} direction="up" distance={30} staggerDelay={0.12} baseDelay={0.15}>
                <Card number={card.number} text={card.text} />
              </StaggerReveal>
            ))}
          </div>
        </div>
        </ScrollReveal>

        {/* ===== Mobile: Stacked cards ===== */}
        <div className="leadmagnetpage-why-audit__mobile-cards">
          {/* Card 1 — single card */}
          <ScrollReveal direction="up" distance={25}>
            <div className="leadmagnetpage-why-audit__mobile-card">
              <MatrixRain />
              <Card number={displayCards[0].number} text={displayCards[0].text} />
            </div>
          </ScrollReveal>

          {/* Cards 2 & 3 — grouped in one card */}
          <ScrollReveal direction="up" delay={0.1} distance={25}>
            <div className="leadmagnetpage-why-audit__mobile-card">
              <MatrixRain />
              <Card number={displayCards[1].number} text={displayCards[1].text} />
              <Card number={displayCards[2].number} text={displayCards[2].text} />
            </div>
          </ScrollReveal>

          {/* Card 4 — single card */}
          <ScrollReveal direction="up" delay={0.2} distance={25}>
            <div className="leadmagnetpage-why-audit__mobile-card">
              <MatrixRain />
              <Card number={displayCards[3].number} text={displayCards[3].text} />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
