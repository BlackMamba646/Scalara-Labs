'use client';

import { ScrollReveal, StaggerReveal } from '@/app/components/scroll-reveal';
import checkIcon from '../../../../imports/leadmagnetpage-ideal-for-check.svg';

const IDEAL_FOR_ROWS: string[][] = [
  [
    'Startups preparing to scale',
    'Companies with an existing product that needs improvement',
    'Founders unsure about their current technical architecture',
  ],
  [
    'Teams planning a system redesign or upgrade',
    'Businesses experiencing performance or stability issues',
  ],
];

interface IdealForProps {
  heading?: string;
  items?: { text: string }[];
}

function toRows(flatItems: string[]): string[][] {
  const rows: string[][] = [];
  for (let i = 0; i < flatItems.length; i += 3) {
    rows.push(flatItems.slice(i, i + 3));
  }
  return rows;
}

/** "This Audit Is Ideal For" — checklist section. */
export default function IdealFor({ heading, items }: IdealForProps) {
  const rows = items ? toRows(items.map((i) => i.text)) : IDEAL_FOR_ROWS;

  return (
    <section className="leadmagnetpage-ideal-for">
      <div className="content-container leadmagnetpage-ideal-for__inner">
        {/* Heading */}
        <ScrollReveal direction="up" delay={0} distance={25}>
          <h2 className="leadmagnetpage-ideal-for__heading">
            {heading ?? 'This Audit Is Ideal For'}
          </h2>
        </ScrollReveal>

        {/* Items */}
        <div className="leadmagnetpage-ideal-for__container">
          {(() => {
            let flatIndex = 0;
            return rows.map((row, rowIndex) => (
              <div key={rowIndex} className="leadmagnetpage-ideal-for__row">
                {row.map((item) => {
                  const idx = flatIndex++;
                  return (
                    <StaggerReveal
                      key={item}
                      index={idx}
                      direction="up"
                      distance={20}
                      staggerDelay={0.1}
                      baseDelay={0.15}
                    >
                      <div className="leadmagnetpage-ideal-for__item">
                        <span
                          className="leadmagnetpage-ideal-for__icon"
                          aria-hidden="true"
                        >
                          <img
                            src={checkIcon.src}
                            alt=""
                            width={10}
                            height={10}
                          />
                        </span>
                        <p className="leadmagnetpage-ideal-for__text">{item}</p>
                      </div>
                    </StaggerReveal>
                  );
                })}
              </div>
            ));
          })()}
        </div>
      </div>
    </section>
  );
}
