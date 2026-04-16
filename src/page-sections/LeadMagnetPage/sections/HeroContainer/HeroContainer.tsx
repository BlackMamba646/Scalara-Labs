'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import { ScrollReveal } from '@/app/components/scroll-reveal'
import { CountryCodeSelect } from '@/app/components/country-code-select'
import { getCountryByCode } from '@/data/countries'
/* Decorative gradient SVGs */
import gradientRect1 from '../../../../imports/leadmagnetpage-hero-container-gradient-rect1.svg'
import gradientEllipse from '../../../../imports/leadmagnetpage-hero-container-gradient-ellipse.svg'
import bright from '../../../../imports/leadmagnetpage-hero-container-bright.svg'
import gradientRect2 from '../../../../imports/leadmagnetpage-hero-container-gradient-rect2.svg'

/* Decorative pattern SVGs */
import patternGroup15 from '../../../../imports/leadmagnetpage-hero-container-pattern-group15.svg'
import patternGroup14 from '../../../../imports/leadmagnetpage-hero-container-pattern-group14.svg'
import patternGroup16 from '../../../../imports/leadmagnetpage-hero-container-pattern-group16.svg'
import patternCode from '../../../../imports/leadmagnetpage-hero-container-pattern-code.svg'

/* Form icon SVGs */
import envelopeIcon from '../../../../imports/leadmagnetpage-hero-container-envelope-light.svg'
import phoneIcon from '../../../../imports/leadmagnetpage-hero-container-phone-light.svg'
import arrowUpRightButton from '../../../../imports/leadmagnetpage-hero-container-arrow-up-right-button.svg'

const EASE = [0.25, 0.1, 0.25, 1] as const;

interface HeroContainerProps {
  heroH1?: string;
  heroSubtitle?: string;
  formTitle?: string;
  formButtonText?: string;
}

function HeroContainer({ heroH1, heroSubtitle, formTitle, formButtonText }: HeroContainerProps) {
  const prefersReducedMotion = useReducedMotion();
  const [countryCode, setCountryCode] = useState('US');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const dialCode = getCountryByCode(countryCode)?.dialCode ?? '';
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            name: formData.name,
            email: formData.email,
            phone: `${dialCode} ${formData.phone}`,
            source: 'lead-magnet',
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to submit');
      setSubmitted(true);
    } catch {
      setErrorMsg('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldReveal = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 12 } as const,
          animate: { opacity: 1, y: 0 } as const,
          transition: { delay, duration: 0.4, ease: EASE },
        };

  return (
    <section className="leadmagnetpage-hero-container">
      {/* Background decorations */}
      <div className="leadmagnetpage-hero-container__graphic" aria-hidden="true">
        {/* Gradient layer */}
        <div className="leadmagnetpage-hero-container__gradient">
          <div className="leadmagnetpage-hero-container__gradient-rect1">
            <Image src={gradientRect1} alt="" width={1557} height={1240} />
          </div>
          <div className="leadmagnetpage-hero-container__gradient-ellipse">
            <Image src={gradientEllipse} alt="" width={857} height={586} />
          </div>
          <div className="leadmagnetpage-hero-container__bright">
            <Image src={bright} alt="" width={693} height={629} />
          </div>
          <div className="leadmagnetpage-hero-container__gradient-rect2">
            <Image src={gradientRect2} alt="" width={1922} height={817} />
          </div>
        </div>

        {/* Patterns layer */}
        <div className="leadmagnetpage-hero-container__patterns">
          <div className="leadmagnetpage-hero-container__pattern-group15">
            <Image src={patternGroup15} alt="" width={163} height={152} />
          </div>
          <div className="leadmagnetpage-hero-container__pattern-group14">
            <Image src={patternGroup14} alt="" width={96} height={90} />
          </div>
          <div className="leadmagnetpage-hero-container__pattern-group16">
            <Image src={patternGroup16} alt="" width={86} height={80} />
          </div>
          <div className="leadmagnetpage-hero-container__pattern-code">
            <Image src={patternCode} alt="" width={199} height={90} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content-container leadmagnetpage-hero-container__inner">
        <div className="leadmagnetpage-hero-container__content">
          {/* Text column */}
          <div className="leadmagnetpage-hero-container__text">
            <ScrollReveal immediate direction="up" delay={0.1} distance={25}>
              <h1 className="leadmagnetpage-hero-container__heading">
                {heroH1 ?? 'Get a Free Technical Audit of Your Software'}
              </h1>
            </ScrollReveal>
            <ScrollReveal immediate direction="up" delay={0.25} distance={20}>
              <p className="leadmagnetpage-hero-container__subtitle">
                {heroSubtitle ?? 'Discover hidden risks, performance issues, and scalability problems before they become expensive mistakes.'}
              </p>
            </ScrollReveal>
          </div>

          {/* Form card — orchestrated entrance */}
          <motion.div
            className="leadmagnetpage-hero-container__form"
            {...(prefersReducedMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 40, scale: 0.97 },
                  animate: { opacity: 1, y: 0, scale: 1 },
                  transition: { duration: 0.7, delay: 0.4, ease: EASE },
                })}
          >
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div className="leadmagnetpage-hero-container__form-content">
                  <motion.div {...fieldReveal(0.9)}>
                    <p className="leadmagnetpage-hero-container__form-title">
                      {formTitle ?? 'Request Your Free Technical Audit'}
                    </p>
                  </motion.div>

                  {errorMsg && (
                    <div className="leadmagnetpage-hero-container__error">
                      {errorMsg}
                    </div>
                  )}

                  <div className="leadmagnetpage-hero-container__fields">
                    {/* Name + Email row */}
                    <motion.div {...fieldReveal(1.0)}>
                      <div className="leadmagnetpage-hero-container__field-row">
                        {/* Name field */}
                        <div className="leadmagnetpage-hero-container__field">
                          <label className="leadmagnetpage-hero-container__field-label">
                            Name
                          </label>
                          <div className="leadmagnetpage-hero-container__field-input">
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                              }
                              placeholder="John Doe"
                              className="leadmagnetpage-hero-container__input"
                            />
                          </div>
                        </div>

                        {/* Email field */}
                        <div className="leadmagnetpage-hero-container__field">
                          <label className="leadmagnetpage-hero-container__field-label">
                            Email
                          </label>
                          <div className="leadmagnetpage-hero-container__field-input">
                            <span className="leadmagnetpage-hero-container__field-icon">
                              <Image src={envelopeIcon} alt="" width={20} height={20} />
                            </span>
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                              }
                              placeholder="user@example.com"
                              className="leadmagnetpage-hero-container__input"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Phone field */}
                    <motion.div {...fieldReveal(1.1)}>
                      <div className="leadmagnetpage-hero-container__field leadmagnetpage-hero-container__field--full">
                        <label className="leadmagnetpage-hero-container__field-label">
                          Phone
                        </label>
                        <div className="leadmagnetpage-hero-container__field-input">
                          {/* Country code dropdown */}
                          <CountryCodeSelect
                            value={countryCode}
                            onChange={setCountryCode}
                            triggerClassName="leadmagnetpage-hero-container__phone-drop"
                          />
                          <span className="leadmagnetpage-hero-container__phone-icon">
                            <Image src={phoneIcon} alt="" width={20} height={20} />
                          </span>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            placeholder="xxx xxx xxxx"
                            className="leadmagnetpage-hero-container__input"
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Actions bar */}
                <motion.div {...fieldReveal(1.2)}>
                  <div className="leadmagnetpage-hero-container__actions">
                    <button
                      className="leadmagnetpage-hero-container__btn"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <span className="leadmagnetpage-hero-container__btn-text">
                        {isSubmitting ? 'Sending...' : (formButtonText ?? 'Request now')}
                      </span>
                      {!isSubmitting && (
                        <span className="leadmagnetpage-hero-container__btn-arrow">
                          <Image src={arrowUpRightButton} alt="" width={14} height={14} />
                        </span>
                      )}
                    </button>
                  </div>
                </motion.div>
              </form>
            ) : (
              <div className="leadmagnetpage-hero-container__success">
                <div className="leadmagnetpage-hero-container__success-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <p className="leadmagnetpage-hero-container__success-title">
                  Request Received!
                </p>
                <p className="leadmagnetpage-hero-container__success-text">
                  Thank you for reaching out. Our team will review your request and get back to you within 24 hours.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroContainer
