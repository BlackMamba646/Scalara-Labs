'use client';

import Image from 'next/image';
import { ScrollReveal, StaggerReveal } from '@/app/components/scroll-reveal';

/* SVG imports */
import checkIcon from '../../../../imports/leadmagnetpage-audit-reveals-check.svg';
import codePatternMain from '../../../../imports/leadmagnetpage-audit-reveals-code-pattern.svg';
import codePatternSmall from '../../../../imports/leadmagnetpage-audit-reveals-code-pattern-small.svg';
import patternGroup1 from '../../../../imports/leadmagnetpage-audit-reveals-pattern-group1.svg';
import patternGroup2 from '../../../../imports/leadmagnetpage-audit-reveals-pattern-group2.svg';

/** Checklist items for the "Your Free Audit Includes" section */
const AUDIT_ITEMS: string[][] = [
  [
    'Code Quality Overview',
    'System Architecture Review',
    'Performance and Scalability Analysis',
  ],
  [
    'Security Risk Assessment',
    'Infrastructure and Deployment Review',
    'Database Structure Evaluation',
  ],
  [
    'Technical Debt Identification',
    'Actionable Recommendations for Improvement',
  ],
];

function CheckItem({ text }: { text: string }) {
  return (
    <div className="leadmagnetpage-audit-reveals__item">
      <span className="leadmagnetpage-audit-reveals__check-icon" aria-hidden="true">
        <Image
          className="leadmagnetpage-audit-reveals__check-img"
          src={checkIcon}
          alt=""
          width={10}
          height={10}
        />
      </span>
      <p className="leadmagnetpage-audit-reveals__item-text">{text}</p>
    </div>
  );
}

interface AuditRevealsProps {
  caption?: string;
  title?: string;
  body?: string;
  checklistTitle?: string;
  checklistItems?: { text: string }[];
}

function toRows(items: string[]): string[][] {
  const rows: string[][] = [];
  for (let i = 0; i < items.length; i += 3) {
    rows.push(items.slice(i, i + 3));
  }
  return rows;
}

export default function AuditReveals({ caption, title, body, checklistTitle, checklistItems }: AuditRevealsProps) {
  return (
    <section className="leadmagnetpage-audit-reveals">
      {/* Background decorative patterns */}
      <div className="leadmagnetpage-audit-reveals__patterns" aria-hidden="true">
        <Image
          className="leadmagnetpage-audit-reveals__pattern-code leadmagnetpage-audit-reveals__pattern-code--main"
          src={codePatternMain}
          alt=""
          width={214}
          height={200}
        />
        <Image
          className="leadmagnetpage-audit-reveals__pattern-code leadmagnetpage-audit-reveals__pattern-group--1"
          src={patternGroup1}
          alt=""
          width={163}
          height={152}
        />
        <Image
          className="leadmagnetpage-audit-reveals__pattern-code leadmagnetpage-audit-reveals__pattern-group--2"
          src={patternGroup2}
          alt=""
          width={163}
          height={152}
        />
      </div>

      <div className="content-container leadmagnetpage-audit-reveals__inner">
        {/* Left column: heading area */}
        <div className="leadmagnetpage-audit-reveals__heading">
          {/* Code pattern decoration positioned relative to heading */}
          <Image
            className="leadmagnetpage-audit-reveals__pattern-code leadmagnetpage-audit-reveals__pattern-code--heading"
            src={codePatternSmall}
            alt=""
            width={214}
            height={200}
            aria-hidden="true"
          />

          <ScrollReveal direction="up" delay={0} distance={20}>
            <p className="leadmagnetpage-audit-reveals__caption">
              {caption ?? 'A better way forward'}
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.12} distance={25}>
            <h2 className="leadmagnetpage-audit-reveals__h4">
              {title ?? 'What Our Technical Audit Reveals'}
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.24} distance={20}>
            <p className="leadmagnetpage-audit-reveals__body">
              {body ?? 'Our engineers analyze your product from a technical perspective and deliver a clear report with insights and recommendations to improve your system.'}
            </p>
          </ScrollReveal>
        </div>

        {/* Right column: checklist */}
        <div className="leadmagnetpage-audit-reveals__checklist">
          <ScrollReveal direction="left" delay={0.1} distance={25}>
            <p className="leadmagnetpage-audit-reveals__checklist-title">
              {checklistTitle ?? 'Your Free Audit Includes'}
            </p>
          </ScrollReveal>
          <div className="leadmagnetpage-audit-reveals__items-container">
            {(() => {
              const rows = checklistItems
                ? toRows(checklistItems.map((i) => i.text))
                : AUDIT_ITEMS;
              let flatIndex = 0;
              return rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="leadmagnetpage-audit-reveals__items-row"
                >
                  {row.map((item) => {
                    const idx = flatIndex++;
                    return (
                      <StaggerReveal
                        key={item}
                        index={idx}
                        direction="up"
                        distance={20}
                        staggerDelay={0.08}
                        baseDelay={0.2}
                      >
                        <CheckItem text={item} />
                      </StaggerReveal>
                    );
                  })}
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}
