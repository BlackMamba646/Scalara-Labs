'use client'

import Image from 'next/image'
import { ScrollReveal } from '@/app/components/scroll-reveal'

/* Background decorations — same as About Us hero */
import codePattern from '../../../../imports/aboutus-hero-section-code-pattern.svg'
import sLogo from '../../../../imports/aboutus-hero-section-s-logo.svg'

interface BlogHeroProps {
  caption?: string
  titleLight?: string
  titleAccent?: string
  subtitle?: string
}

function BlogHero({
  caption = 'Learn how better software gets built',
  titleLight = 'Our Blog ',
  titleAccent = 'Build smarter. Avoid expensive mistakes.',
  subtitle = "Practical insights on architecture, performance, and product decisions from engineers who've built systems under real-world pressure.",
}: BlogHeroProps) {
  return (
    <section className="bloglisting-blog-hero">
      {/* Background decorations */}
      <div className="bloglisting-blog-hero__graphic" aria-hidden="true">
        <Image
          className="bloglisting-blog-hero__code-pattern"
          src={codePattern}
          alt=""
          width={696}
          height={547}
        />
        <Image
          className="bloglisting-blog-hero__s-logo"
          src={sLogo}
          alt=""
          width={882}
          height={960}
        />
      </div>

      {/* Content */}
      <div className="content-container bloglisting-blog-hero__inner">
        <div className="bloglisting-blog-hero__display-heading">
          <ScrollReveal immediate direction="up" delay={0.1} distance={20}>
            <p className="bloglisting-blog-hero__caption">
              {caption}
            </p>
          </ScrollReveal>
          <ScrollReveal immediate direction="up" delay={0.25} distance={25}>
            <h1 className="bloglisting-blog-hero__title">
              <span className="bloglisting-blog-hero__title-light">{titleLight}</span>
              <span className="bloglisting-blog-hero__title-accent">
                {titleAccent}
              </span>
            </h1>
          </ScrollReveal>
          <ScrollReveal immediate direction="up" delay={0.4} distance={20}>
            <p className="bloglisting-blog-hero__subtitle">
              {subtitle}
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

export default BlogHero
