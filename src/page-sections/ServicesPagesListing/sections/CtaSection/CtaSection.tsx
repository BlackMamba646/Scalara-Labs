'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ConsultationModal } from '@/app/components/consultation-modal'
import { ScrollReveal } from '@/app/components/scroll-reveal'

/* SVG imports — arrow icon */
import arrowUpRight from '../../../../imports/servicespageslisting-cta-section-arrow-up-right.svg'

/* SVG imports — decorative patterns */
import patternGroup15 from '../../../../imports/servicespageslisting-cta-section-pattern-group15.svg'
import patternGroup14 from '../../../../imports/servicespageslisting-cta-section-pattern-group14.svg'
import patternCode from '../../../../imports/servicespageslisting-cta-section-pattern-code.svg'
import patternConfig from '../../../../imports/servicespageslisting-cta-section-pattern-config.svg'
import bottomOverlay from '../../../../imports/servicespageslisting-cta-section-bottom-overlay.svg'

/* SVG imports — trust badge logos */
import dockerIcon from '../../../../imports/servicespageslisting-cta-section-docker.svg'
import googleCloudIcon from '../../../../imports/servicespageslisting-cta-section-google-cloud.svg'
import angularIcon from '../../../../imports/servicespageslisting-cta-section-angular.svg'
import flutterIcon from '../../../../imports/servicespageslisting-cta-section-flutter-vector.svg'
import reactIcon from '../../../../imports/servicespageslisting-cta-section-react.svg'
import springBootIcon from '../../../../imports/servicespageslisting-cta-section-spring-boot.svg'
import awsIcon from '../../../../imports/servicespageslisting-cta-section-aws.svg'

interface CtaSectionProps {
  caption?: string;
  title?: string;
  description?: string;
  buttonText?: string;
}

/** CTA section — call-to-action with heading, button, and trust badges. */
function CtaSection({
  caption = 'Limited spots available per month.',
  title = "Let\u2019s Talk About Your Project",
  description = "Whether you need a mobile app, a web platform, or something more technical. The first step is a free 30-minute call. No commitment, no sales script. Just a straight conversation about what you\u2019re building and whether we\u2019re the right team to build it.",
  buttonText = 'Book a Free Consultation',
}: CtaSectionProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section className="servicespageslisting-cta-section">
      {/* Bottom decorative overlay */}
      <div
        className="servicespageslisting-cta-section__bottom-overlay"
        aria-hidden="true"
      >
        <Image src={bottomOverlay} alt="" width={599} height={163} />
      </div>

      <div className="content-container servicespageslisting-cta-section__inner">
        {/* Heading block */}
        <ScrollReveal direction="up" distance={30} style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <div className="servicespageslisting-cta-section__heading">
            {/* Decorative patterns behind text */}
            <div
              className="servicespageslisting-cta-section__patterns"
              aria-hidden="true"
            >
              <div className="servicespageslisting-cta-section__pattern servicespageslisting-cta-section__pattern--group15">
                <Image src={patternGroup15} alt="" width={158} height={152} />
              </div>
              <div className="servicespageslisting-cta-section__pattern servicespageslisting-cta-section__pattern--group14">
                <Image src={patternGroup14} alt="" width={158} height={152} />
              </div>
              <div className="servicespageslisting-cta-section__pattern servicespageslisting-cta-section__pattern--code">
                <Image src={patternCode} alt="" width={196} height={189} />
              </div>
              <div className="servicespageslisting-cta-section__pattern servicespageslisting-cta-section__pattern--config">
                <Image src={patternConfig} alt="" width={119} height={123} />
              </div>
            </div>

            <p className="servicespageslisting-cta-section__caption">
              {caption}
            </p>

            <h2 className="servicespageslisting-cta-section__title">
              {title}
            </h2>

            <p className="servicespageslisting-cta-section__description">
              {description}
            </p>
          </div>
        </ScrollReveal>

        {/* CTA button + trust badges */}
        <ScrollReveal direction="up" distance={20} delay={0.2}>
        <div className="servicespageslisting-cta-section__row">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="servicespageslisting-cta-section__btn"
          >
            <span className="servicespageslisting-cta-section__btn-text">
              {buttonText}
            </span>
            <span className="servicespageslisting-cta-section__btn-arrow">
              <Image src={arrowUpRight} alt="" width={14} height={14} />
            </span>
          </button>

          {/* Trust badges */}
          <div className="servicespageslisting-cta-section__badges">
            <p className="servicespageslisting-cta-section__badges-label">
              Modern stack. Production-ready.
            </p>

            <div className="servicespageslisting-cta-section__logos">
              <span className="servicespageslisting-cta-section__logo">
                <Image src={dockerIcon} alt="Docker" width={23} height={18} />
              </span>
              <span className="servicespageslisting-cta-section__logo">
                <Image
                  src={googleCloudIcon}
                  alt="Google Cloud"
                  width={22}
                  height={18}
                />
              </span>
              <span className="servicespageslisting-cta-section__logo">
                <Image
                  src={angularIcon}
                  alt="Angular"
                  width={17}
                  height={18}
                />
              </span>
              <span className="servicespageslisting-cta-section__logo">
                <Image
                  src={flutterIcon}
                  alt="Flutter"
                  width={15}
                  height={16}
                />
              </span>
              <span className="servicespageslisting-cta-section__logo">
                <Image src={reactIcon} alt="React" width={20} height={18} />
              </span>
              <span className="servicespageslisting-cta-section__logo">
                <Image
                  src={springBootIcon}
                  alt="Spring Boot"
                  width={18}
                  height={18}
                />
              </span>
              <span className="servicespageslisting-cta-section__logo">
                <Image src={awsIcon} alt="AWS" width={30} height={18} />
              </span>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </div>
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}

export default CtaSection
