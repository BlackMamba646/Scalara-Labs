'use client';

import { useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { ConsultationModal } from '@/app/components/consultation-modal';
import { ScrollReveal } from '@/app/components/scroll-reveal';

/* SVG imports */
import arrowUpRightDark from '../../../../imports/servicepage-hero-container-arrow-up-right-dark.svg';

/* Raster image imports */
import heroBg from '../../../../assets/images/servicepage-hero-container-background.jpg';

export default function HeroContainer({
  title,
  heroKicker1,
  heroKicker2,
  heroSubtitle,
  heroBodyText,
  heroCtaText,
  imageUrl,
}: {
  title?: string | null;
  heroKicker1?: string | null;
  heroKicker2?: string | null;
  heroSubtitle?: string | null;
  heroBodyText?: string | null;
  heroCtaText?: string | null;
  imageUrl?: string | null;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const bgSrc: StaticImageData | string = imageUrl || heroBg;

  return (
    <section className="servicepage-hero-container">
      {/* Background layers */}
      <div className="servicepage-hero-container__bg" aria-hidden="true">
        <Image
          className="servicepage-hero-container__bg-image"
          src={bgSrc}
          alt=""
          fill
          sizes="100vw"
          priority
          {...(!imageUrl ? { placeholder: 'blur' as const } : { unoptimized: true })}
        />
        <div className="servicepage-hero-container__bg-overlay-darken" />
        <div className="servicepage-hero-container__bg-overlay-vignette" />
      </div>

      <div className="content-container servicepage-hero-container__inner">
        {/* Content */}
        <div className="servicepage-hero-container__content">
          {/* Left column — Heading */}
          <div className="servicepage-hero-container__heading">
            {/* Subtitle */}
            <ScrollReveal immediate direction="up" delay={0.1} distance={20}>
              <p className="servicepage-hero-container__subtitle">
                <span className="servicepage-hero-container__subtitle-light">
                  {heroKicker1 ?? 'Experience at some of the world\'s most'}
                </span>
                <br />
                <span className="servicepage-hero-container__subtitle-accent">
                  {heroKicker2 ?? 'Demanding Organizations.'}
                </span>
              </p>
            </ScrollReveal>

            {/* Display heading */}
            <ScrollReveal immediate direction="up" delay={0.25} distance={25}>
              <div className="servicepage-hero-container__display-heading">
                <h1 className="servicepage-hero-container__h1">
                  {title ?? 'Mobile App Development'}
                </h1>
                <p className="servicepage-hero-container__quote">
                  {heroSubtitle ?? 'Build mobile apps that don\u2019t break at scale'}
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Right column — Body text */}
          <div className="servicepage-hero-container__body-column">
            <ScrollReveal immediate direction="up" delay={0.35} distance={20}>
            <div className="servicepage-hero-container__body">
              <p className="servicepage-hero-container__body-text">
                {heroBodyText ?? 'We design and develop native and cross-platform mobile apps backed by solid architecture. Work directly with senior engineers who understand real-world usage from day one.'}
              </p>
              <button type="button" onClick={() => setModalOpen(true)} className="servicepage-hero-container__cta">
                <span className="servicepage-hero-container__cta-text">{heroCtaText ?? 'Work With Us'}</span>
                <span className="servicepage-hero-container__cta-arrow">
                  <Image src={arrowUpRightDark} alt="" width={14} height={14} />
                </span>
              </button>
            </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
