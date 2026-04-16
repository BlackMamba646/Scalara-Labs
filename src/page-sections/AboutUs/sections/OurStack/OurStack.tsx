'use client';

import Image from 'next/image';
import { ScrollReveal, StaggerReveal } from '@/app/components/scroll-reveal';

import dockerIcon from '../../../../imports/aboutus-our-stack-docker.svg';
import googleCloudIcon from '../../../../imports/aboutus-our-stack-google-cloud.svg';
import kubernetesIcon from '../../../../imports/aboutus-our-stack-kubernetes.svg';
import langgraphIcon from '../../../../imports/aboutus-our-stack-langgraph.svg';
import angularIcon from '../../../../imports/aboutus-our-stack-angular.svg';
import flutterIcon from '../../../../imports/aboutus-our-stack-flutter-vector.svg';
import nextjsIcon from '../../../../imports/aboutus-our-stack-nextjs.svg';
import reactIcon from '../../../../imports/aboutus-our-stack-react.svg';
import springBootIcon from '../../../../imports/aboutus-our-stack-springboot.svg';
import awsIcon from '../../../../imports/aboutus-our-stack-aws.svg';
import javaIcon from '../../../../imports/aboutus-our-stack-java.svg';
import kafkaIcon from '../../../../imports/aboutus-our-stack-kafka.svg';
import postgresqlIcon from '../../../../imports/aboutus-our-stack-postgresql.svg';
import typescriptIcon from '../../../../imports/aboutus-our-stack-typescript.svg';
import pythonIcon from '../../../../imports/aboutus-our-stack-python.svg';
import swiftIconSvg from '../../../../imports/aboutus-our-stack-swift-icon.svg';
import swiftTextSvg from '../../../../imports/aboutus-our-stack-swift-text.svg';
import pixijsIcon from '../../../../imports/aboutus-our-stack-pixijs-main.svg';
import kotlinIcon from '../../../../imports/aboutus-our-stack-kotlin.svg';
import redisIcon from '../../../../imports/aboutus-our-stack-redis-content.svg';
import fastApiIcon from '../../../../imports/aboutus-our-stack-fastapi.svg';

interface LogoItem {
  src: typeof dockerIcon;
  alt: string;
  modifier: string;
  isSwift?: boolean;
}

const logos: LogoItem[] = [
  { src: dockerIcon, alt: 'Docker', modifier: 'docker' },
  { src: googleCloudIcon, alt: 'Google Cloud', modifier: 'google-cloud' },
  { src: kubernetesIcon, alt: 'Kubernetes', modifier: 'kubernetes' },
  { src: langgraphIcon, alt: 'LangGraph', modifier: 'langgraph' },
  { src: angularIcon, alt: 'Angular', modifier: 'angular' },
  { src: flutterIcon, alt: 'Flutter', modifier: 'flutter' },
  { src: nextjsIcon, alt: 'Next.js', modifier: 'nextjs' },
  { src: reactIcon, alt: 'React', modifier: 'react' },
  { src: springBootIcon, alt: 'Spring Boot', modifier: 'springboot' },
  { src: awsIcon, alt: 'AWS', modifier: 'aws' },
  { src: javaIcon, alt: 'Java', modifier: 'java' },
  { src: kafkaIcon, alt: 'Apache Kafka', modifier: 'kafka' },
  { src: postgresqlIcon, alt: 'PostgreSQL', modifier: 'postgresql' },
  { src: typescriptIcon, alt: 'TypeScript', modifier: 'typescript' },
  { src: pythonIcon, alt: 'Python', modifier: 'python' },
  { src: swiftIconSvg, alt: 'Swift', modifier: 'swift', isSwift: true },
  { src: pixijsIcon, alt: 'PixiJS', modifier: 'pixijs' },
  { src: kotlinIcon, alt: 'Kotlin', modifier: 'kotlin' },
  { src: redisIcon, alt: 'Redis', modifier: 'redis' },
  { src: fastApiIcon, alt: 'FastAPI', modifier: 'fastapi' },
];

interface OurStackLogo {
  name: string;
  logo?: { url: string; alternativeText?: string | null } | null;
}

interface OurStackProps {
  title?: string;
  caption?: string;
  logos?: OurStackLogo[];
}

/** Our Stack — displays the technology logos used by the team. */
export default function OurStack({
  title: titleProp = 'Our Stack',
  caption = 'The right software for your business',
  logos: cmsLogos,
}: OurStackProps) {
  // Build a CMS logo URL lookup by name for override
  // URLs must already be resolved to absolute by the server component
  const cmsLogoMap = new Map<string, string>();
  if (cmsLogos) {
    for (const l of cmsLogos) {
      if (l.logo?.url) {
        cmsLogoMap.set(l.name, l.logo.url);
      }
    }
  }
  return (
    <section className="aboutus-our-stack">
      <div className="aboutus-our-stack__inner">
      <ScrollReveal direction="left" distance={25}>
        <div className="aboutus-our-stack__heading">
          <h2 className="aboutus-our-stack__title">{titleProp}</h2>
          <p className="aboutus-our-stack__caption">
            {caption}
          </p>
        </div>
      </ScrollReveal>

      <div className="aboutus-our-stack__logos-container">
        <div className="aboutus-our-stack__logos">
          {logos.map((logo, i) => {
            const cmsUrl = cmsLogoMap.get(logo.alt);
            return logo.isSwift ? (
              <StaggerReveal
                key={logo.alt}
                index={i}
                direction="up"
                distance={15}
                staggerDelay={0.04}
                baseDelay={0.3}
                scale={0.92}
                as="span"
              >
                <span className="aboutus-our-stack__logo aboutus-our-stack__logo--swift">
                  {cmsUrl ? (
                    <img src={cmsUrl} alt="Swift" className="aboutus-our-stack__swift-icon" />
                  ) : (
                    <>
                      <Image src={swiftIconSvg} alt="Swift" className="aboutus-our-stack__swift-icon" />
                      <Image src={swiftTextSvg} alt="" className="aboutus-our-stack__swift-text" />
                    </>
                  )}
                </span>
              </StaggerReveal>
            ) : (
              <StaggerReveal
                key={logo.alt}
                index={i}
                direction="up"
                distance={15}
                staggerDelay={0.04}
                baseDelay={0.3}
                scale={0.92}
                as="span"
              >
                <span className={`aboutus-our-stack__logo aboutus-our-stack__logo--${logo.modifier}`}>
                  {cmsUrl ? (
                    <img src={cmsUrl} alt={logo.alt} />
                  ) : (
                    <Image src={logo.src} alt={logo.alt} />
                  )}
                </span>
              </StaggerReveal>
            );
          })}
        </div>
      </div>
      </div>
    </section>
  );
}
