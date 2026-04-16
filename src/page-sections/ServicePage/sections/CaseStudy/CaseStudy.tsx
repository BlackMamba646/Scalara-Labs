'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ConsultationModal } from '@/app/components/consultation-modal'
import { ScrollReveal } from '@/app/components/scroll-reveal'

/* SVG imports — arrow icon */
import arrowUpRight from '../../../../imports/servicepage-case-study-arrow-up-right.svg'
import checkIcon from '../../../../imports/servicepage-case-study-check.svg'

/* Raster imports */
import avatarImg from '../../../../assets/images/servicepage-case-study-avatar.jpg'

import imgHand from '../../../../assets/images/home-hand-image.png'

/* ── Matrix Rain Canvas (from Homepage BottomHero) ── */
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    const dpr = window.devicePixelRatio || 1
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
    }

    const fontSize = 13
    const columns = Math.floor(w / fontSize)
    const chars =
      '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン{}[]<>/=;:.()';

    if (
      !(canvas as any)._drops ||
      (canvas as any)._drops.length !== columns
    ) {
      ;(canvas as any)._drops = Array.from({ length: columns }, () =>
        Math.random() * -50,
      )
    }
    const drops: number[] = (canvas as any)._drops

    ctx.fillStyle = 'rgba(12, 27, 59, 0.12)'
    ctx.fillRect(0, 0, w, h)
    ctx.font = `${fontSize}px monospace`

    for (let i = 0; i < columns; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)]
      const x = i * fontSize
      const y = drops[i] * fontSize

      const brightness = Math.random()
      if (brightness > 0.9) {
        ctx.fillStyle = 'rgba(33, 138, 243, 0.9)'
      } else if (brightness > 0.6) {
        ctx.fillStyle = 'rgba(33, 138, 243, 0.5)'
      } else {
        ctx.fillStyle = 'rgba(33, 138, 243, 0.25)'
      }

      ctx.fillText(char, x, y)

      if (y > h && Math.random() > 0.985) {
        drops[i] = 0
      }
      drops[i] += 0.05 + Math.random() * 0.05
    }

    animFrameRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 size-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}

/* ── Gradient blur SVG (from Homepage BottomHero) ── */
function GradientBlurs() {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ height: 815, left: 446, top: -163, width: 1062 }}
    >
      <div
        className="absolute"
        style={{ inset: '-24.33% -22.88% -52.2% -22.88%' }}
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 1548.08 1438.41"
        >
          <defs>
            <filter
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
              height="916.116"
              id="cs_f0"
              width="797.485"
              x="0"
              y="266.955"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                in="SourceGraphic"
                in2="BackgroundImageFix"
                mode="normal"
                result="shape"
              />
              <feGaussianBlur result="effect1" stdDeviation="121.519" />
            </filter>
            <filter
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
              height="982.847"
              id="cs_f5"
              width="823.435"
              x="724.641"
              y="232.502"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                in="SourceGraphic"
                in2="BackgroundImageFix"
                mode="normal"
                result="shape"
              />
              <feGaussianBlur result="effect1" stdDeviation="121.519" />
            </filter>
            <filter
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
              height="1073.07"
              id="cs_f3"
              width="1128.68"
              x="264.319"
              y="365.341"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                in="SourceGraphic"
                in2="BackgroundImageFix"
                mode="normal"
                result="shape"
              />
              <feGaussianBlur result="effect1" stdDeviation="212.658" />
            </filter>
            <filter
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
              height="809.433"
              id="cs_f8"
              width="1080.06"
              x="174.974"
              y="295.631"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                in="SourceGraphic"
                in2="BackgroundImageFix"
                mode="normal"
                result="shape"
              />
              <feGaussianBlur result="effect1" stdDeviation="145.823" />
            </filter>
          </defs>
          <g filter="url(#cs_f0)">
            <ellipse
              cx="398.742"
              cy="725.013"
              fill="#1F4EA4"
              fillOpacity="0.4"
              rx="155.704"
              ry="215.02"
            />
          </g>
          <g filter="url(#cs_f5)">
            <ellipse
              cx="1136.36"
              cy="723.926"
              fill="#202B3D"
              rx="168.68"
              ry="248.385"
            />
          </g>
          <g filter="url(#cs_f3)">
            <ellipse
              cx="828.657"
              cy="901.875"
              fill="#92B5F5"
              rx="139.022"
              ry="111.217"
            />
          </g>
          <g filter="url(#cs_f8)">
            <ellipse
              cx="715.006"
              cy="700.347"
              fill="#0C1B3B"
              rx="248.386"
              ry="113.071"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}

/* Banner background inline style (from Homepage BottomHero) */
const bannerBgStyle = {
  backgroundImage:
    'url(\'data:image/svg+xml;utf8,<svg viewBox="0 0 1360 415" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><rect x="0" y="0" height="100%25" width="100%25" fill="url(%23grad)" opacity="1"/><defs><radialGradient id="grad" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="10" gradientTransform="matrix(10.814 -37.084 58.552 7.0054 1167.8 370.84)"><stop stop-color="rgba(12,27,59,1)" offset="0"/><stop stop-color="rgba(6,14,30,0.5)" offset="0.5"/><stop stop-color="rgba(0,0,0,0)" offset="1"/></radialGradient></defs></svg>\'), url(\'data:image/svg+xml;utf8,<svg viewBox="0 0 1360 415" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><rect x="0" y="0" height="100%25" width="100%25" fill="url(%23grad)" opacity="1"/><defs><radialGradient id="grad" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="10" gradientTransform="matrix(16.244 20.75 -54.433 17.484 721.08 207.5)"><stop stop-color="rgba(12,27,59,1)" offset="0"/><stop stop-color="rgba(6,14,30,0.5)" offset="0.5"/><stop stop-color="rgba(0,0,0,0)" offset="1"/></radialGradient></defs></svg>\'), url(\'data:image/svg+xml;utf8,<svg viewBox="0 0 1360 415" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><rect x="0" y="0" height="100%25" width="100%25" fill="url(%23grad)" opacity="1"/><defs><radialGradient id="grad" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="10" gradientTransform="matrix(76.028 42.267 -138.51 78.067 123.25 -7.6655)"><stop stop-color="rgba(12,27,59,1)" offset="0"/><stop stop-color="rgba(6,14,30,0.5)" offset="0.5"/><stop stop-color="rgba(0,0,0,0)" offset="1"/></radialGradient></defs></svg>\'), linear-gradient(90deg, rgb(12, 27, 59) 0%, rgb(12, 27, 59) 100%)',
}

/** CaseStudy section — client case study banner with highlights. */
function CaseStudy({
  clientHandle,
  clientName,
  heading,
  ctaText,
  clientAvatarUrl,
  highlights,
}: {
  clientHandle?: string | null;
  clientName?: string | null;
  heading?: string | null;
  ctaText?: string | null;
  clientAvatarUrl?: string | null;
  highlights?: { text: string }[] | null;
}) {
  const [modalOpen, setModalOpen] = useState(false)

  const resolvedHighlights =
    highlights && highlights.length > 0
      ? highlights
      : [
          { text: 'Mobile UI implementation from design systems' },
          { text: 'Backend integration & API development' },
          { text: 'Real-time features (chat, notifications, live data)' },
        ]

  return (
    <section className="servicepage-case-study">
      {/* Decorative background patterns (desktop only) */}
      <div
        className="servicepage-case-study__patterns"
        aria-hidden="true"
      >
        <div className="servicepage-case-study__pattern servicepage-case-study__pattern--group15" />
        <div className="servicepage-case-study__pattern servicepage-case-study__pattern--group14" />
        <div className="servicepage-case-study__pattern servicepage-case-study__pattern--code" />
      </div>

      <div className="content-container servicepage-case-study__inner">
        {/* Banner card */}
        <ScrollReveal direction="up" distance={35}>
        <div
          className="servicepage-case-study__banner"
          style={bannerBgStyle}
        >
          {/* Animated background layer */}
          <div className="servicepage-case-study__banner-bg-layer">
            <GradientBlurs />

            {/* Hand image */}
            <div className="servicepage-case-study__banner-hand">
              <Image
                alt=""
                src={imgHand}
                fill
                sizes="(max-width: 767px) 0px, 740px"
                placeholder="blur"
                className="object-contain pointer-events-none"
              />
            </div>

            <MatrixRain />
          </div>

          {/* Text content */}
          <div className="servicepage-case-study__text-content">
            {/* Client CTA */}
            <div className="servicepage-case-study__cta">
              <div className="servicepage-case-study__avatar-outline">
                <div className="servicepage-case-study__avatar">
                  <Image
                    src={clientAvatarUrl || avatarImg}
                    alt="Client avatar"
                    width={30}
                    height={30}
                    {...(!clientAvatarUrl && { placeholder: "blur" })}
                  />
                </div>
              </div>
              <div className="servicepage-case-study__client-info">
                <p className="servicepage-case-study__client-handle">
                  {clientHandle ?? '@clienthandle'}
                </p>
                <p className="servicepage-case-study__client-name">
                  {clientName ?? 'Confidential Client (Tech Platform)'}
                </p>
              </div>
            </div>

            {/* Display heading */}
            <h2 className="servicepage-case-study__heading">
              {heading ?? 'Scaled a real-time mobile app to thousands of users'}
            </h2>

            {/* CTA button */}
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="servicepage-case-study__btn"
            >
              <span className="servicepage-case-study__btn-text">
                {ctaText ?? 'Work With Us'}
              </span>
              <span className="servicepage-case-study__btn-arrow">
                <Image src={arrowUpRight} alt="" width={14} height={14} />
              </span>
            </button>
          </div>

          {/* Feature items */}
          <div className="servicepage-case-study__items">
            {resolvedHighlights.map((h, i) => (
              <div key={i} className="servicepage-case-study__item">
                <div className="servicepage-case-study__item-icon">
                  <Image src={checkIcon} alt="" width={10} height={10} />
                </div>
                <p className="servicepage-case-study__item-text">
                  {h.text}
                </p>
              </div>
            ))}
          </div>
        </div>
        </ScrollReveal>
      </div>
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}

export default CaseStudy
