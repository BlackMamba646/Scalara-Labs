'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ScrollReveal } from '@/app/components/scroll-reveal'
import { ConsultationModal } from '@/app/components/consultation-modal'

/* SVG imports — arrow icon */
import arrowUpRight from '../../../imports/cta-arrow-up-right.svg'

/* SVG imports — decorative patterns */
import patternGroup15 from '../../../imports/cta-pattern-group15.svg'
import patternGroup14 from '../../../imports/cta-pattern-group14.svg'
import patternCode from '../../../imports/cta-pattern-code.svg'
import patternConfig from '../../../imports/cta-pattern-config.svg'
import bottomOverlay from '../../../imports/cta-bottom-overlay.svg'

/* SVG imports — trust badge logos */
import dockerIcon from '../../../imports/cta-docker.svg'
import googleCloudIcon from '../../../imports/cta-google-cloud.svg'
import angularIcon from '../../../imports/cta-angular.svg'
import flutterIcon from '../../../imports/cta-flutter-vector.svg'
import reactIcon from '../../../imports/cta-react.svg'
import springBootIcon from '../../../imports/cta-spring-boot.svg'
import awsIcon from '../../../imports/cta-aws.svg'

/** Shared CTA section — call-to-action with heading, button, and trust badges. */
export default function Cta({
  variant = 'dark',
  caption,
  title,
  description,
  buttonText,
}: {
  variant?: 'dark' | 'light'
  caption?: string
  title?: string
  description?: string
  buttonText?: string
}) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section className={`cta${variant === 'light' ? ' cta--light' : ''}`}>
      {/* Bottom decorative overlay */}
      <div className="cta__bottom-overlay" aria-hidden="true">
        <Image src={bottomOverlay} alt="" width={599} height={163} />
      </div>

      <div className="content-container cta__inner">
        {/* Heading block */}
        <div className="cta__heading">
          {/* Decorative patterns behind text */}
          <div className="cta__patterns" aria-hidden="true">
            <div className="cta__pattern cta__pattern--group15">
              <Image src={patternGroup15} alt="" width={158} height={152} />
            </div>
            <div className="cta__pattern cta__pattern--group14">
              <Image src={patternGroup14} alt="" width={158} height={152} />
            </div>
            <div className="cta__pattern cta__pattern--code">
              <Image src={patternCode} alt="" width={196} height={189} />
            </div>
            <div className="cta__pattern cta__pattern--config">
              <Image src={patternConfig} alt="" width={119} height={123} />
            </div>
          </div>

          <ScrollReveal direction="up" delay={0} distance={20}>
            <p className="cta__caption">
              {caption ?? 'Limited spots available per month.'}
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.12} distance={25}>
            <h2 className="cta__title">
              {title ?? "Let\u2019s Talk About Your Project"}
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.24} distance={20}>
            <p className="cta__description">
              {description ?? "Whether you need a mobile app, a web platform, or something more technical. The first step is a free 30-minute call. No commitment, no sales script. Just a straight conversation about what you\u2019re building and whether we\u2019re the right team to build it."}
            </p>
          </ScrollReveal>
        </div>

        {/* CTA button + trust badges */}
        <div className="cta__row">
          <ScrollReveal direction="up" delay={0.35} distance={20}>
            <button type="button" onClick={() => setModalOpen(true)} className="cta__btn">
              <span className="cta__btn-text">
                {buttonText ?? 'Book a Free Consultation'}
              </span>
              <span className="cta__btn-arrow">
                <Image src={arrowUpRight} alt="" width={14} height={14} />
              </span>
            </button>
          </ScrollReveal>

          {/* Trust badges */}
          <ScrollReveal direction="up" delay={0.45} distance={15}>
            <div className="cta__badges">
              <p className="cta__badges-label">
                Modern stack. Production-ready.
              </p>

              <div className="cta__logos">
                <span className="cta__logo">
                  <Image src={dockerIcon} alt="Docker" width={23} height={18} />
                </span>
                <span className="cta__logo">
                  <Image
                    src={googleCloudIcon}
                    alt="Google Cloud"
                    width={22}
                    height={18}
                  />
                </span>
                <span className="cta__logo">
                  <Image
                    src={angularIcon}
                    alt="Angular"
                    width={17}
                    height={18}
                  />
                </span>
                <span className="cta__logo">
                  <Image
                    src={flutterIcon}
                    alt="Flutter"
                    width={15}
                    height={16}
                  />
                </span>
                <span className="cta__logo">
                  <Image src={reactIcon} alt="React" width={20} height={18} />
                </span>
                <span className="cta__logo">
                  <Image
                    src={springBootIcon}
                    alt="Spring Boot"
                    width={18}
                    height={18}
                  />
                </span>
                <span className="cta__logo">
                  <Image src={awsIcon} alt="AWS" width={30} height={18} />
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}
