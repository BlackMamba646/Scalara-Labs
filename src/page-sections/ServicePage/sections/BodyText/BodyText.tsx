import Image from 'next/image';
import { ScrollReveal, StaggerReveal } from '@/app/components/scroll-reveal';
import checkIcon from '../../../../imports/servicepage-body-text-check.svg';
import type { ServiceChecklistItem } from '@/lib/types/service';

const defaultItems = [
  'Smooth, reliable performance across devices',
  'Scalable architecture ready for growth',
  'Faster development without cutting corners',
];

/** Body text section with title and three feature items with check icons. */
export default function BodyText({
  bodyTitle,
  bodyChecklist,
}: {
  bodyTitle?: string | null;
  bodyChecklist?: ServiceChecklistItem[] | null;
}) {
  const items = bodyChecklist?.map((i) => i.text) ?? defaultItems;

  return (
    <section className="servicepage-body-text">
      <div className="content-container servicepage-body-text__inner">
        {/* Section title */}
        <ScrollReveal direction="up" distance={25}>
          <h2 className="servicepage-body-text__title">
            {bodyTitle ?? 'What You Get With Our Mobile Apps'}
          </h2>
        </ScrollReveal>

        {/* Feature items */}
        <div className="servicepage-body-text__items">
          {items.map((text, i) => (
            <StaggerReveal key={text} index={i} direction="up" distance={20} staggerDelay={0.1} baseDelay={0.15}>
              <div className="servicepage-body-text__item">
                <span className="servicepage-body-text__icon" aria-hidden="true">
                  <Image src={checkIcon} alt="" width={10} height={10} />
                </span>
                <p className="servicepage-body-text__item-text">{text}</p>
              </div>
            </StaggerReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
