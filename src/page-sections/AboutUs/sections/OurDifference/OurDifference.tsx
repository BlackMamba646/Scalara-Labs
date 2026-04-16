'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { ScrollReveal } from '@/app/components/scroll-reveal';

import patternGroup15 from '../../../../imports/aboutus-our-difference-pattern-group15.svg';
import patternGroup14 from '../../../../imports/aboutus-our-difference-pattern-group14.svg';
import patternCode from '../../../../imports/aboutus-our-difference-pattern-code.svg';
import usersIcon from '../../../../imports/aboutus-our-difference-users-icon.svg';

import avatar1 from '../../../../assets/images/aboutus-our-difference-avatar-1.jpg';
import avatar2 from '../../../../assets/images/aboutus-our-difference-avatar-2.jpg';
import avatar3 from '../../../../assets/images/aboutus-our-difference-avatar-3.jpg';
import avatar4 from '../../../../assets/images/aboutus-our-difference-avatar-4.jpg';

const EASE = [0.25, 0.1, 0.25, 1] as const;

const avatars = [
  { src: avatar1, alt: 'Team member' },
  { src: avatar2, alt: 'Team member' },
  { src: avatar3, alt: 'Team member' },
  { src: avatar4, alt: 'Team member' },
];

interface OurDifferenceProps {
  caption?: string;
  title?: string;
  subtitle?: string;
  card1Title?: string;
  card1Body?: string;
  engineeringTitle?: string;
  engineeringBody?: string;
  beliefCaption?: string;
  beliefQuote?: string;
  beliefLabel?: string;
  closingParagraphs?: string;
}

export default function OurDifference({
  caption = 'OUR DIFFERENCE',
  title = "Built by People Who\u2019ve Done This at the Highest Level",
  subtitle = 'Most development agencies are built around sales teams that then go find developers. Scalara Labs was built the other way around.',
  card1Title = 'We intentionally keep our team focused.',
  card1Body = 'We take on a limited number of projects at a time so we can give each engagement the attention it deserves. This allows us to stay closely involved, maintain high standards, and ensure every client works with a team that is fully engaged in the outcome.',
  engineeringTitle = 'We started with engineering.',
  engineeringBody = 'Scalara Labs was founded by a close-knit team of senior developers in Serbia who had already worked on payment infrastructure for leading financial institutions, geospatial systems for industrial use cases, and high-availability platforms serving thousands of users. Several members of our team have also contributed to enterprise-grade projects as subcontractors for global technology companies, including Oracle.',
  beliefCaption = 'Our belief was simple.',
  beliefQuote = 'High-level engineering expertise should not be limited to large enterprises with equally large budgets.',
  beliefLabel = 'That is why we built Scalara Labs.',
  closingParagraphs,
}: OurDifferenceProps) {
  const closingTexts = closingParagraphs
    ? closingParagraphs.split('\n\n')
    : [
        'We help startups, growing businesses, and ambitious founders access the kind of technical depth typically associated with larger organizations. Whether we are building mobile applications, web platforms, or custom software, we approach every project with the same level of care, structure, and technical rigor.',
        "We\u2019re not trying to be the biggest agency in the room. We\u2019re trying to be the best team on your project.",
      ];
  return (
    <section className="aboutus-our-difference">
      <div className="aboutus-our-difference__inner">
      {/* ===== Heading area ===== */}
      <div className="aboutus-our-difference__heading">
        {/* Decorative background patterns */}
        <div className="aboutus-our-difference__pattern" aria-hidden="true">
          <div className="aboutus-our-difference__pattern-item aboutus-our-difference__pattern-item--group15">
            <img src={patternGroup15.src} alt="" width={163} height={152} />
          </div>
          <div className="aboutus-our-difference__pattern-item aboutus-our-difference__pattern-item--group14">
            <img src={patternGroup14.src} alt="" width={163} height={152} />
          </div>
          <div className="aboutus-our-difference__pattern-item aboutus-our-difference__pattern-item--code">
            <img src={patternCode.src} alt="" width={214} height={200} />
          </div>
        </div>

        <ScrollReveal direction="up" distance={20}>
          <p className="aboutus-our-difference__caption">{caption}</p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1} distance={25}>
          <h2 className="aboutus-our-difference__title">
            {title}
          </h2>
        </ScrollReveal>

        {/* Avatar group with scale-in stagger */}
        <div className="aboutus-our-difference__cta">
          <div className="aboutus-our-difference__avatars">
            {avatars.map((avatar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.4,
                  delay: 0.2 + i * 0.08,
                  ease: EASE,
                }}
                style={{ display: 'contents' }}
              >
                <Image
                  className="aboutus-our-difference__avatar"
                  src={avatar.src}
                  alt={avatar.alt}
                  width={40}
                  height={40}
                  placeholder="blur"
                />
              </motion.div>
            ))}
          </div>
        </div>

        <ScrollReveal direction="up" delay={0.35} distance={20}>
          <p className="aboutus-our-difference__subtitle">
            {subtitle}
          </p>
        </ScrollReveal>
      </div>

      {/* ===== Two-column content area ===== */}
      <div className="aboutus-our-difference__container">
        {/* Left card */}
        <ScrollReveal direction="left" delay={0.1} distance={30}>
          <div className="aboutus-our-difference__card">
            <div className="aboutus-our-difference__icon-box">
              <img src={usersIcon.src} alt="" width={20} height={20} />
            </div>

            <div className="aboutus-our-difference__card-text">
              <p className="aboutus-our-difference__card-title">
                {card1Title}
              </p>
              <p className="aboutus-our-difference__card-body">
                {card1Body}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Right content */}
        <ScrollReveal direction="right" delay={0.2} distance={30}>
          <div className="aboutus-our-difference__content">
            <div className="aboutus-our-difference__engineering-text">
              <p className="aboutus-our-difference__engineering-title">
                {engineeringTitle}
              </p>
              <p className="aboutus-our-difference__engineering-body">
                {engineeringBody}
              </p>
            </div>

            <p className="aboutus-our-difference__belief-caption">
              {beliefCaption}
            </p>

            {/* Quote emphasis animation */}
            <motion.p
              className="aboutus-our-difference__belief-quote"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            >
              {beliefQuote}
            </motion.p>

            <p className="aboutus-our-difference__belief-statement">
              {beliefLabel}
            </p>

            <div className="aboutus-our-difference__closing-text">
              {closingTexts.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
      </div>
    </section>
  );
}
