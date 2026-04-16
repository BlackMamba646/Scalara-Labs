'use client'

import Link from 'next/link'
import Image, { type StaticImageData } from 'next/image'
import { StaggerReveal } from '@/app/components/scroll-reveal'
import type { ServiceListingCms } from '@/lib/types/services-page'

import imgMobileApp from '../../../../assets/images/servicespageslisting-services-grid-mobile-app.png'

import dotIcon from '../../../../imports/servicespageslisting-services-grid-dot.svg'
import separatorIcon from '../../../../imports/servicespageslisting-services-grid-separator-icon.svg'
import caretRight from '../../../../imports/servicespageslisting-services-grid-caret-right.svg'

interface ServiceTag {
  label: string
  variant: 'dot' | 'separator'
}

interface ServiceCardData {
  image: StaticImageData | string
  alt: string
  title: string
  description: string
  tags: ServiceTag[]
  href: string
}

function ServiceCard({ card }: { card: ServiceCardData }) {
  return (
    <Link href={card.href} className="servicespageslisting-services-grid__card-link">
      <article className="servicespageslisting-services-grid__card">
        {/* Image area */}
        <div className="servicespageslisting-services-grid__card-img">
          <Image
            className="servicespageslisting-services-grid__card-img-element"
            src={card.image}
            alt={card.alt}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            {...(typeof card.image !== 'string'
              ? { placeholder: 'blur' as const }
              : { unoptimized: true }
            )}
          />

          {/* Tags overlay */}
          <div className="servicespageslisting-services-grid__tags">
            {card.tags.map((tag) => (
              <div key={tag.label} className="servicespageslisting-services-grid__tag-item">
                {tag.variant === 'dot' ? (
                  <div className="servicespageslisting-services-grid__tag-dot">
                    <img
                      className="servicespageslisting-services-grid__tag-dot-img"
                      src={dotIcon.src}
                      alt=""
                      width={6}
                      height={6}
                    />
                  </div>
                ) : (
                  <img
                    className="servicespageslisting-services-grid__tag-separator-img"
                    src={separatorIcon.src}
                    alt=""
                    width={14}
                    height={14}
                  />
                )}
                <span className="servicespageslisting-services-grid__tag-label">
                  {tag.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="servicespageslisting-services-grid__card-content">
          <h3 className="servicespageslisting-services-grid__card-title">
            {card.title}
          </h3>
          <p className="servicespageslisting-services-grid__card-description">
            {card.description}
          </p>
        </div>

        {/* Actions */}
        <div className="servicespageslisting-services-grid__card-actions">
          <span className="servicespageslisting-services-grid__button">
            <span className="servicespageslisting-services-grid__button-text">
              Request service
            </span>
            <img
              className="servicespageslisting-services-grid__button-icon"
              src={caretRight.src}
              alt=""
              width={20}
              height={20}
            />
          </span>
        </div>
      </article>
    </Link>
  )
}

function ServicesGrid({ cmsServices }: { cmsServices?: ServiceListingCms[] }) {
  const services: ServiceCardData[] = (cmsServices ?? []).map((cms) => ({
    image: cms.imageUrl || imgMobileApp,
    alt: cms.title,
    title: cms.title,
    description: cms.heroBodyText || '',
    tags: cms.tags.map((t, j) => ({
      label: t.label,
      variant: j === 0 ? ('dot' as const) : ('separator' as const),
    })),
    href: `/services/${cms.slug}`,
  }));

  return (
    <section className="servicespageslisting-services-grid">
      <div className="content-container servicespageslisting-services-grid__inner">
        <div className="servicespageslisting-services-grid__cards">
          {services.length === 0 ? (
            <p className="servicespageslisting-services-grid__empty">No services available.</p>
          ) : (
            services.map((card, i) => (
              <StaggerReveal
                key={card.title}
                index={i % 3}
                direction="up"
                distance={30}
                staggerDelay={0.12}
                baseDelay={i >= 3 ? 0.15 : 0}
                className="servicespageslisting-services-grid__card-stagger"
              >
                <ServiceCard card={card} />
              </StaggerReveal>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default ServicesGrid
