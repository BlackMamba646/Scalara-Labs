import Image from 'next/image';
import { ScrollReveal } from '@/app/components/scroll-reveal';
import type { BlocksContent } from '@strapi/blocks-react-renderer';
import StrapiBlocksRenderer from '@/components/shared/StrapiBlocksRenderer/StrapiBlocksRenderer';

import codePattern from '../../../../imports/servicepage-why-choose-real-world-code-pattern.svg';
import mainImg from '../../../../assets/images/servicepage-why-choose-real-world-img.png';

export default function WhyChooseRealWorld({
  kicker,
  title,
  paragraph,
  imageUrl,
}: {
  kicker?: string | null;
  title?: string | null;
  paragraph?: BlocksContent | null;
  imageUrl?: string | null;
}) {

  return (
    <section className="servicepage-why-choose-real-world">
      <div className="content-container servicepage-why-choose-real-world__inner">
        {/* ===== Left — Text content ===== */}
        <ScrollReveal direction="right" distance={30} style={{ flex: '1 0 0', minWidth: 0 }}>
        <div className="servicepage-why-choose-real-world__heading">
          {/* Decorative code pattern */}
          <div className="servicepage-why-choose-real-world__pattern" aria-hidden="true">
            <img src={codePattern.src} alt="" width={214} height={200} />
          </div>

          <p className="servicepage-why-choose-real-world__caption">
            {kicker ?? 'apps with real-world usage in mind'}
          </p>

          <h2 className="servicepage-why-choose-real-world__title">
            {title ?? 'Ready for Real Users\nNot Just Launch Day'}
          </h2>

          <div className="servicepage-why-choose-real-world__body">
            {paragraph ? (
              <StrapiBlocksRenderer content={paragraph} />
            ) : (
              <>
                <p>Launching is easy. Keeping an app stable as users grow is where most teams fail.</p>
                <p>We design mobile apps with real-world usage in mind: spikes in traffic, unreliable networks, device fragmentation, and long-term maintainability.</p>
                <p>So your app doesn&apos;t fall apart after the first wave of users.</p>
              </>
            )}
          </div>
        </div>
        </ScrollReveal>

        {/* ===== Right — Image ===== */}
        <ScrollReveal direction="left" delay={0.15} distance={30} style={{ flex: '1 0 0', alignSelf: 'stretch', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div className="servicepage-why-choose-real-world__image-wrapper">
          <div className="servicepage-why-choose-real-world__image-container">
            <Image
              src={imageUrl || mainImg}
              alt="Laptop and phone showing real-world app usage"
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              priority={false}
              {...(!imageUrl && { placeholder: "blur" })}
            />
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
