'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { ScrollReveal, StaggerReveal } from '@/app/components/scroll-reveal';

import patternGroup15 from '../../../../imports/aboutus-what-makes-us-different-pattern-group15.svg';
import patternGroup14 from '../../../../imports/aboutus-what-makes-us-different-pattern-group14.svg';
import patternCode from '../../../../imports/aboutus-what-makes-us-different-pattern-code.svg';
import scalaraText from '../../../../imports/aboutus-what-makes-us-different-scalara-text.svg';
import logoIcon from '../../../../imports/aboutus-what-makes-us-different-logo.svg';
import labsText from '../../../../imports/aboutus-what-makes-us-different-labs-text.svg';
import avatar1 from '../../../../assets/images/aboutus-what-makes-us-different-avatar-1.jpg';
import avatar2 from '../../../../assets/images/aboutus-what-makes-us-different-avatar-2.jpg';
import avatar3 from '../../../../assets/images/aboutus-what-makes-us-different-avatar-3.jpg';
import avatar4 from '../../../../assets/images/aboutus-what-makes-us-different-avatar-4.jpg';

const EASE = [0.25, 0.1, 0.25, 1] as const;

interface CardProps {
  number: string;
  title: string;
  body: string;
}

function Card({ number, title, body }: CardProps) {
  return (
    <div className="aboutus-what-makes-us-different__card">
      <p className="aboutus-what-makes-us-different__card-number">{number}</p>
      <div className="aboutus-what-makes-us-different__card-text">
        <p className="aboutus-what-makes-us-different__card-title">{title}</p>
        <p className="aboutus-what-makes-us-different__card-body">{body}</p>
      </div>
    </div>
  );
}

import type { WhatMakesDifferentCard } from '@/lib/types/about-us';

const defaultCards: CardProps[] = [
  {
    number: '01/',
    title: "We don\u2019t hide our team behind a brand.",
    body: "A lot of agencies sell you on the pitch and then hand you off to someone you\u2019ve never met. At Scalara, you know exactly who\u2019s building your product before you sign anything. You see the faces, read the backgrounds, and talk to the people doing the actual work.",
  },
  {
    number: '02/',
    title: 'Our benchmark is enterprise. Our rates are not.',
    body: "The engineers on our team have worked on systems that handle millions of transactions, real-time data at scale, and compliance requirements most developers never encounter. That experience doesn\u2019t disappear on smaller projects, it shows up in how we architect, how we test, and how we think about problems before they become problems.",
  },
  {
    number: '03/',
    title: "Serbia is not a compromise. It\u2019s a competitive advantage.",
    body: 'Serbia has a strong engineering tradition and a deep pool of technical talent. Combined with a more efficient cost structure, this allows us to offer high-quality development at rates that are highly competitive internationally.',
  },
  {
    number: '04/',
    title: 'We value clarity and honest communication',
    body: 'If a project can be simplified, we will say so. If priorities need to shift, we will address it early. If timelines change, you will hear it directly from us. We believe strong delivery starts with clear, transparent communication.',
  },
];

const avatars = [
  { src: avatar1, alt: 'Team member' },
  { src: avatar2, alt: 'Team member' },
  { src: avatar3, alt: 'Team member' },
  { src: avatar4, alt: 'Team member' },
];

interface WhatMakesUsDifferentProps {
  title?: string;
  caption?: string;
  cards?: WhatMakesDifferentCard[];
}

export default function WhatMakesUsDifferent({
  title: titleProp = 'What Makes Us Different',
  caption = 'And Why It Matters For Your Project',
  cards: cardsProp,
}: WhatMakesUsDifferentProps) {
  const displayCards: CardProps[] = cardsProp
    ? cardsProp.map((c) => ({
        number: c.number,
        title: c.title,
        body: c.description,
      }))
    : defaultCards;
  return (
    <section className="aboutus-what-makes-us-different">
      {/* Background decorative patterns */}
      <div className="aboutus-what-makes-us-different__patterns" aria-hidden="true">
        <div className="aboutus-what-makes-us-different__pattern aboutus-what-makes-us-different__pattern--group15">
          <Image src={patternGroup15} alt="" width={163} height={152} />
        </div>
        <div className="aboutus-what-makes-us-different__pattern aboutus-what-makes-us-different__pattern--group14">
          <Image src={patternGroup14} alt="" width={163} height={152} />
        </div>
        <div className="aboutus-what-makes-us-different__pattern aboutus-what-makes-us-different__pattern--code">
          <Image src={patternCode} alt="" width={214} height={200} />
        </div>
      </div>

      <div className="aboutus-what-makes-us-different__inner">
      {/* Heading area */}
      <div className="aboutus-what-makes-us-different__heading">
        <ScrollReveal direction="none" scale={0.95}>
          <div className="aboutus-what-makes-us-different__cta">
            {/* Logo */}
            <div className="aboutus-what-makes-us-different__logo">
              <div className="aboutus-what-makes-us-different__logo-icon">
                <Image src={logoIcon} alt="" width={31} height={34} />
              </div>
              <div className="aboutus-what-makes-us-different__logo-scalara">
                <Image src={scalaraText} alt="" width={83} height={11} />
              </div>
              <div className="aboutus-what-makes-us-different__logo-labs">
                <Image src={labsText} alt="" width={23} height={5} />
              </div>
            </div>

            {/* Avatars with scale-in stagger */}
            <div className="aboutus-what-makes-us-different__avatars">
              {avatars.map((avatar, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2 + index * 0.08,
                    ease: EASE,
                  }}
                  className="aboutus-what-makes-us-different__avatar"
                >
                  <Image
                    src={avatar.src}
                    alt={avatar.alt}
                    fill
                    sizes="44px"
                    placeholder="blur"
                    className="aboutus-what-makes-us-different__avatar-img"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.15} distance={25}>
          <h2 className="aboutus-what-makes-us-different__title">
            {titleProp}
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.25} distance={20}>
          <p className="aboutus-what-makes-us-different__caption">
            {caption}
          </p>
        </ScrollReveal>
      </div>

      {/* Cards row */}
      <div className="aboutus-what-makes-us-different__row">
        {displayCards.map((card, i) => (
          <StaggerReveal
            key={card.number}
            index={i}
            direction="up"
            distance={30}
            staggerDelay={0.1}
            baseDelay={0.1}
          >
            <Card {...card} />
          </StaggerReveal>
        ))}
      </div>
      </div>
    </section>
  );
}
