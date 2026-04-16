'use client';

import Image from 'next/image';
import { ScrollReveal, StaggerReveal } from '@/app/components/scroll-reveal';

import dockerIcon from '../../../../imports/aboutus-body-text-badges-docker.svg';
import googleCloudIcon from '../../../../imports/aboutus-body-text-badges-google-cloud.svg';
import langgraphIcon from '../../../../imports/aboutus-body-text-badges-langgraph.svg';
import angularIcon from '../../../../imports/aboutus-body-text-badges-angular.svg';
import flutterIcon from '../../../../imports/aboutus-body-text-badges-flutter-vector.svg';
import nextjsIcon from '../../../../imports/aboutus-body-text-badges-nextjs.svg';
import reactIcon from '../../../../imports/aboutus-body-text-badges-react.svg';
import springBootIcon from '../../../../imports/aboutus-body-text-badges-spring-boot.svg';
import awsIcon from '../../../../imports/aboutus-body-text-badges-aws.svg';

const badges = [
  { src: dockerIcon, alt: 'Docker', modifier: 'docker' },
  { src: googleCloudIcon, alt: 'Google Cloud', modifier: 'google-cloud' },
  { src: langgraphIcon, alt: 'LangGraph', modifier: 'langgraph' },
  { src: angularIcon, alt: 'Angular', modifier: 'angular' },
  { src: flutterIcon, alt: 'Flutter', modifier: 'flutter' },
  { src: nextjsIcon, alt: 'Next.js', modifier: 'nextjs' },
  { src: reactIcon, alt: 'React', modifier: 'react' },
  { src: springBootIcon, alt: 'Spring Boot', modifier: 'spring-boot' },
  { src: awsIcon, alt: 'AWS', modifier: 'aws' },
];

interface BodyTextBadgesProps {
  bodyText?: string;
}

/** Short body text + trust badges with technology logos. */
export default function BodyTextBadges({
  bodyText = "We don\u2019t just write code, we understand systems, timelines, and what it actually takes to ship something that works.",
}: BodyTextBadgesProps) {
  return (
    <section className="aboutus-body-text-badges">
      <div className="aboutus-body-text-badges__inner">
      {/* Body text */}
      <ScrollReveal direction="left" distance={30}>
        <div className="aboutus-body-text-badges__text-container">
          <p className="aboutus-body-text-badges__text">
            {bodyText}
          </p>
        </div>
      </ScrollReveal>

      {/* Trust badges */}
      <div className="aboutus-body-text-badges__badges">
        <ScrollReveal direction="up" delay={0.1} distance={20}>
          <p className="aboutus-body-text-badges__badges-label">
            Modern stack. Production-ready.
          </p>
        </ScrollReveal>

        <div className="aboutus-body-text-badges__logos">
          {badges.map((badge, i) => (
            <StaggerReveal
              key={badge.alt}
              index={i}
              direction="up"
              distance={20}
              staggerDelay={0.06}
              baseDelay={0.2}
              scale={0.9}
              as="span"
            >
              <span className={`aboutus-body-text-badges__logo aboutus-body-text-badges__logo--${badge.modifier}`}>
                <Image src={badge.src} alt={badge.alt} />
              </span>
            </StaggerReveal>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
