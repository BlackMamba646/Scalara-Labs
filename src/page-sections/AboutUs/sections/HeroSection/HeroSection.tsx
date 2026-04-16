'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ScrollReveal } from '@/app/components/scroll-reveal';
import { ConsultationModal } from '@/app/components/consultation-modal';

/* SVG imports */
import arrowUpRightDark from '../../../../imports/footer-arrow-up-right.svg';
import codePattern from '../../../../imports/aboutus-hero-section-code-pattern.svg';
import sLogo from '../../../../imports/aboutus-hero-section-s-logo.svg';

/* Raster image imports */
import heroTeamImage from '../../../../assets/images/aboutus-hero-section-team.png';

const EASE = [0.25, 0.1, 0.25, 1] as const;

interface HeroSectionProps {
  subtitleLight?: string;
  subtitleAccent?: string;
  h1Normal?: string;
  h1Large?: string;
  bodyText?: string;
  ctaText?: string;
}

export default function HeroSection({
  subtitleLight = 'Scalara Labs is a software development agency ',
  subtitleAccent = 'based in Serbia.',
  h1Normal = 'Experienced Engineers for ',
  h1Large = 'High-Impact Digital Products',
  bodyText = 'Built around a core team of senior engineers with experience at some of the world\u2019s most demanding organizations.',
  ctaText = 'Work With Us',
}: HeroSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="aboutus-hero-section" style={{ paddingTop: 'var(--header-height, 54px)' }}>
      {/* Background decorations */}
      <div className="aboutus-hero-section__graphic" aria-hidden="true">
        <Image
          className="aboutus-hero-section__code-pattern"
          src={codePattern}
          alt=""
          width={696}
          height={547}
        />
        <Image
          className="aboutus-hero-section__s-logo"
          src={sLogo}
          alt=""
          width={882}
          height={960}
        />
      </div>

      {/* Hero image — Desktop (clip-path reveal) */}
      <motion.div
        className="aboutus-hero-section__hero-image-wrapper"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
        aria-hidden="true"
      >
        <Image
          className="aboutus-hero-section__hero-image"
          src={heroTeamImage}
          alt="Scalara Labs team working together"
          width={828}
          height={462}
          priority
          placeholder="blur"
        />
      </motion.div>

      {/* Content */}
      <div className="aboutus-hero-section__content">
        <div className="aboutus-hero-section__heading">
          {/* Subtitle */}
          <ScrollReveal immediate direction="up" delay={0.1} distance={20}>
            <p className="aboutus-hero-section__subtitle">
              <span className="aboutus-hero-section__subtitle-light">
                {subtitleLight}
              </span>
              <span className="aboutus-hero-section__subtitle-accent">
                {subtitleAccent}
              </span>
            </p>
          </ScrollReveal>

          {/* Display heading */}
          <ScrollReveal immediate direction="up" delay={0.25} distance={25}>
            <div className="aboutus-hero-section__display-heading">
              <h1 className="aboutus-hero-section__h1">
                {h1Normal}
              </h1>
              <p className="aboutus-hero-section__h1 aboutus-hero-section__h1--large">
                {h1Large}
              </p>
            </div>
          </ScrollReveal>

          {/* Body text + CTA */}
          <ScrollReveal immediate direction="up" delay={0.4} distance={20}>
            <div className="aboutus-hero-section__body">
              <p className="aboutus-hero-section__body-text">
                {bodyText}
              </p>
              <button type="button" onClick={() => setModalOpen(true)} className="aboutus-hero-section__cta">
                <span className="aboutus-hero-section__cta-text">{ctaText}</span>
                <span className="aboutus-hero-section__cta-arrow">
                  <Image src={arrowUpRightDark} alt="" width={14} height={14} />
                </span>
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Hero image — Tablet/Mobile (inline, below content) */}
      <ScrollReveal immediate direction="up" delay={0.3} distance={30} scale={0.97}>
        <div className="aboutus-hero-section__hero-image-inline">
          <Image
            src={heroTeamImage}
            alt="Scalara Labs team working together"
            width={2448}
            height={1302}
            priority
            placeholder="blur"
            sizes="(max-width: 767px) 480px, (max-width: 1023px) 100vw, 0px"
          />
        </div>
      </ScrollReveal>
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
