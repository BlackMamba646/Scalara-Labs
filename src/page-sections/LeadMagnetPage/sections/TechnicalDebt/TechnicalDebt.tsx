'use client';

import { ScrollReveal } from '@/app/components/scroll-reveal';
import patternGroup15 from '../../../../imports/leadmagnetpage-technical-debt-pattern-group15.svg';
import patternGroup14 from '../../../../imports/leadmagnetpage-technical-debt-pattern-group14.svg';
import patternCode from '../../../../imports/leadmagnetpage-technical-debt-pattern-code.svg';
import warningIcon from '../../../../imports/leadmagnetpage-technical-debt-warning-icon.svg';

interface TechnicalDebtProps {
  title?: string;
  paragraphs?: string;
}

/** "Many Software Projects Have Hidden Technical Debt" section. */
export default function TechnicalDebt({ title, paragraphs }: TechnicalDebtProps) {
  return (
    <section className="leadmagnetpage-technical-debt">
      <div className="content-container leadmagnetpage-technical-debt__inner">
        {/* Decorative background patterns */}
        <div className="leadmagnetpage-technical-debt__pattern" aria-hidden="true">
          <div className="leadmagnetpage-technical-debt__pattern-item leadmagnetpage-technical-debt__pattern-item--group15">
            <img src={patternGroup15.src} alt="" width={163} height={152} />
          </div>
          <div className="leadmagnetpage-technical-debt__pattern-item leadmagnetpage-technical-debt__pattern-item--group14">
            <img src={patternGroup14.src} alt="" width={163} height={152} />
          </div>
          <div className="leadmagnetpage-technical-debt__pattern-item leadmagnetpage-technical-debt__pattern-item--code">
            <img src={patternCode.src} alt="" width={214} height={200} />
          </div>
        </div>

        {/* Heading area */}
        <div className="leadmagnetpage-technical-debt__heading">
          {/* Warning badge — scroll-reveal entrance matching the rest of the page */}
          <ScrollReveal direction="up" delay={0.15} distance={20}>
            <div className="leadmagnetpage-technical-debt__badge-layer-1">
              <div className="leadmagnetpage-technical-debt__badge-layer-2">
                <div className="leadmagnetpage-technical-debt__badge-layer-3">
                  <div className="leadmagnetpage-technical-debt__badge-layer-4">
                    <div className="leadmagnetpage-technical-debt__badge-icon">
                      <img
                        src={warningIcon.src}
                        alt=""
                        width={20}
                        height={20}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3} distance={25}>
            <h2 className="leadmagnetpage-technical-debt__title">
              {title ?? 'Many Software Projects Have Hidden Technical Debt'}
            </h2>
          </ScrollReveal>
        </div>

        {/* Body text */}
        <ScrollReveal direction="up" delay={0.45} distance={20}>
          <div className="leadmagnetpage-technical-debt__container">
            <div className="leadmagnetpage-technical-debt__body">
              {paragraphs
                ? paragraphs.split('\n\n').map((p, i) => <p key={i}>{p}</p>)
                : (
                  <>
                    <p>
                      Most companies don&apos;t realize the technical issues inside their
                      software until it becomes a serious problem.
                    </p>
                    <p>
                      Slow performance, unstable infrastructure, poor architecture
                      decisions, or security vulnerabilities can silently limit your
                      product&apos;s growth.
                    </p>
                    <p>
                      A technical audit helps identify these risks before they turn into
                      expensive rebuilds.
                    </p>
                  </>
                )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
