import { ScrollReveal, StaggerReveal } from '@/app/components/scroll-reveal';
import checkIcon from '../../../../imports/servicepage-service-features-check.svg';
import type { ServiceChecklistItem } from '@/lib/types/service';

const defaultFeatures = [
  'iOS development (Swift)',
  'Android development (Kotlin)',
  'Cross-platform development (React Native, Flutter)',
  'Mobile UI implementation from design systems',
  'Backend integration & API development',
  'Real-time features (chat, notifications, live data)',
  'Performance optimization across devices',
  'Offline support & data synchronization',
  'App Store & Google Play deployment',
];

/** Single feature item with check icon and label */
function FeatureItem({ label }: { label: string }) {
  return (
    <div className="servicepage-service-features__item">
      <div className="servicepage-service-features__icon">
        <img src={checkIcon.src} alt="" width={10} height={10} />
      </div>
      <p className="servicepage-service-features__item-text">{label}</p>
    </div>
  );
}

export default function ServiceFeatures({
  featuresTitle,
  featuresChecklist,
}: {
  featuresTitle?: string | null;
  featuresChecklist?: ServiceChecklistItem[] | null;
}) {
  const features = featuresChecklist?.map((i) => i.text) ?? defaultFeatures;

  return (
    <section className="servicepage-service-features">
      <div className="content-container servicepage-service-features__inner">
        <ScrollReveal direction="up" distance={25}>
          <h2 className="servicepage-service-features__heading">
            {featuresTitle ?? 'Everything Your Mobile App Needs to Succeed'}
          </h2>
        </ScrollReveal>

        <div className="servicepage-service-features__container">
          <div className="servicepage-service-features__grid">
            {features.map((feature, i) => (
              <StaggerReveal key={feature} index={i} direction="up" distance={20} staggerDelay={0.08} baseDelay={0.1} className="servicepage-service-features__item-stagger">
                <FeatureItem label={feature} />
              </StaggerReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
