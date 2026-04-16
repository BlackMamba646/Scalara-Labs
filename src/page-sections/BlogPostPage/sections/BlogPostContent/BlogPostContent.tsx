'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ConsultationModal } from '@/app/components/consultation-modal'
import { ScrollReveal } from '@/app/components/scroll-reveal'
import checkIcon from '../../../../imports/blogpostpage-blogpostcontent-check.svg'
import arrowUpRight from '../../../../imports/blogpostpage-blogpostcontent-arrow-up-right.svg'
import usersIcon from '../../../../imports/blogpostpage-blogpostcontent-users.svg'
import patternGroup15 from '../../../../imports/blogpostpage-blogpostcontent-pattern-group15.svg'
import patternGroup14 from '../../../../imports/blogpostpage-blogpostcontent-pattern-group14.svg'
import patternCode from '../../../../imports/blogpostpage-blogpostcontent-code-pattern.svg'
import bannerImg from '../../../../assets/images/blogpostpage-blogpostcontent-banner-img.png'

const CHECKLIST_ITEMS = [
  ['Bespoke iOS Apps (Swift)', 'Tailored Android Apps (Kotlin)', 'Adaptable Cross-Platform Apps (React Native, Flutter)'],
  ['Flawless UI/UX Builds', 'Smart API Design and Setup', 'Dynamic User Interaction (Chat, Alerts, Live Feeds)'],
  ['Peak Performance on All Devices', 'Always-Available Offline Mode and Data Harmony', 'Effortless Launch on App Stores'],
]

interface BlogPostContentProps {
  content?: string;
}

function BlogPostContent({ content }: BlogPostContentProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section className="blogpostpage-blog-post-content">
      <div className="content-container blogpostpage-blog-post-content__inner">
        {/* ===== Left / Main content column ===== */}
        <article className="blogpostpage-blog-post-content__heading">
          {content ? (
            /* CMS content — render paragraphs from plain text */
            <ScrollReveal direction="up" distance={25}>
              <div className="blogpostpage-blog-post-content__text-block">
                {content.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="blogpostpage-blog-post-content__body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </ScrollReveal>
          ) : (
            /* Fallback — original hardcoded content */
            <>
              {/* Text block 1 */}
              <ScrollReveal direction="up" distance={25}>
              <div className="blogpostpage-blog-post-content__text-block">
                <p className="blogpostpage-blog-post-content__subheading">
                  Code Excellence
                </p>
                <p className="blogpostpage-blog-post-content__body">
                  Our global team features seasoned pros who&apos;ve built bank payment systems, advanced geo-platforms, and high-volume apps. They value deadlines.
                </p>
              </div>
              </ScrollReveal>

              {/* Quote block */}
              <ScrollReveal direction="up" distance={30}>
              <div className="blogpostpage-blog-post-content__quote">
                <p className="blogpostpage-blog-post-content__caption">
                  The Key Question
                </p>
                <p className="blogpostpage-blog-post-content__quote-text">
                  Should top-tier tech talent be limited to big firms with huge budgets?
                </p>
                <p className="blogpostpage-blog-post-content__quote-label">
                  Democratizing Access
                </p>
              </div>
              </ScrollReveal>

              {/* Text block 2 */}
              <ScrollReveal direction="up" distance={25}>
              <div className="blogpostpage-blog-post-content__text-block">
                <p className="blogpostpage-blog-post-content__body">
                  Scalara Labs brings elite tech skills to startups, growing firms, and visionary founders, at accessible prices. We focus on impactful projects (apps, platforms, custom software) and build them right.
                </p>
                <p className="blogpostpage-blog-post-content__body">
                  We strive to be your project&apos;s most effective team, not the largest agency.
                </p>
                <p className="blogpostpage-blog-post-content__subheading">
                  Code Excellence
                </p>
                <p className="blogpostpage-blog-post-content__body">
                  Our global team features seasoned pros who&apos;ve built bank payment systems, advanced geo-platforms, and high-volume apps. They value deadlines.
                </p>
              </div>
              </ScrollReveal>

              {/* Checklist */}
              <ScrollReveal direction="up" distance={25}>
              <div className="blogpostpage-blog-post-content__checklist-container">
                {CHECKLIST_ITEMS.map((row, rowIndex) => (
                  <div key={rowIndex} className="blogpostpage-blog-post-content__checklist-row">
                    {row.map((item) => (
                      <div key={item} className="blogpostpage-blog-post-content__checklist-item">
                        <div className="blogpostpage-blog-post-content__check-icon">
                          <img src={checkIcon.src} alt="" width={10} height={10} />
                        </div>
                        <p className="blogpostpage-blog-post-content__checklist-text">{item}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              </ScrollReveal>

              {/* Text block 3 */}
              <ScrollReveal direction="up" distance={25}>
                <div className="blogpostpage-blog-post-content__text-block">
                  <p className="blogpostpage-blog-post-content__body">
                    Scalara Labs brings elite tech skills to startups, growing firms, and visionary founders, at accessible prices. We focus on impactful projects (apps, platforms, custom software) and build them right.
                  </p>
                  <p className="blogpostpage-blog-post-content__body">
                    We strive to be your project&apos;s most effective team, not the largest agency.
                  </p>
                  <p className="blogpostpage-blog-post-content__subheading">
                    Code Excellence
                  </p>
                  <p className="blogpostpage-blog-post-content__body">
                    Our global team features seasoned pros who&apos;ve built bank payment systems, advanced geo-platforms, and high-volume apps. They value deadlines.
                  </p>
                </div>
              </ScrollReveal>
            </>
          )}
        </article>

        {/* ===== Right sidebar card (desktop only) ===== */}
        <ScrollReveal direction="left" delay={0.2} distance={25} className="blogpostpage-blog-post-content__card-wrapper">
        <aside className="blogpostpage-blog-post-content__card">
          {/* Decorative patterns */}
          <div className="blogpostpage-blog-post-content__pattern" aria-hidden="true">
            <div className="blogpostpage-blog-post-content__pattern-item blogpostpage-blog-post-content__pattern-item--group15">
              <img src={patternGroup15.src} alt="" width={163} height={152} />
            </div>
            <div className="blogpostpage-blog-post-content__pattern-item blogpostpage-blog-post-content__pattern-item--group14">
              <img src={patternGroup14.src} alt="" width={163} height={152} />
            </div>
            <div className="blogpostpage-blog-post-content__pattern-item blogpostpage-blog-post-content__pattern-item--code">
              <img src={patternCode.src} alt="" width={214} height={200} />
            </div>
          </div>

          {/* Icon box */}
          <div className="blogpostpage-blog-post-content__icon-box">
            <img src={usersIcon.src} alt="" width={20} height={20} />
          </div>

          {/* Card text */}
          <div className="blogpostpage-blog-post-content__card-text">
            <p className="blogpostpage-blog-post-content__card-title">
              Lean And Focused
            </p>
            <p className="blogpostpage-blog-post-content__card-body">
              We limit active projects to ensure dedicated teams for each client. Your project gets the complete focus it warrants.
            </p>
            <button type="button" onClick={() => setModalOpen(true)} className="blogpostpage-blog-post-content__btn">
              <span className="blogpostpage-blog-post-content__btn-text">
                Book a Free Consultation
              </span>
              <span className="blogpostpage-blog-post-content__btn-arrow">
                <img src={arrowUpRight.src} alt="" width={14} height={14} />
              </span>
            </button>
          </div>
        </aside>
        </ScrollReveal>

        {/* ===== Banner (tablet/mobile only) ===== */}
        <ScrollReveal direction="up" distance={25}>
        <div className="blogpostpage-blog-post-content__banner">
          <div className="blogpostpage-blog-post-content__banner-img" aria-hidden="true">
            <Image
              src={bannerImg}
              alt=""
              width={549}
              height={452}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              sizes="600px"
              placeholder="blur"
            />
          </div>
          <div className="blogpostpage-blog-post-content__banner-content">
            <div className="blogpostpage-blog-post-content__banner-heading-group">
              <h3 className="blogpostpage-blog-post-content__banner-title">
                Lean and Focused
              </h3>
              <p className="blogpostpage-blog-post-content__banner-desc">
                We limit active projects to ensure dedicated teams for each client. Your project gets the complete focus it warrants.
              </p>
            </div>
            <button type="button" onClick={() => setModalOpen(true)} className="blogpostpage-blog-post-content__btn">
              <span className="blogpostpage-blog-post-content__btn-text">
                Book a Free Consultation
              </span>
              <span className="blogpostpage-blog-post-content__btn-arrow">
                <img src={arrowUpRight.src} alt="" width={14} height={14} />
              </span>
            </button>
          </div>
        </div>
        </ScrollReveal>
      </div>
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}

export default BlogPostContent
