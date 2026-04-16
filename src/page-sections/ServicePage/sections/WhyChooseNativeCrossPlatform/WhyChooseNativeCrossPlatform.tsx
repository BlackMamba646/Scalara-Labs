import Image from 'next/image';
import { ScrollReveal } from '@/app/components/scroll-reveal';
import type { BlocksContent } from '@strapi/blocks-react-renderer';
import StrapiBlocksRenderer from '@/components/shared/StrapiBlocksRenderer/StrapiBlocksRenderer';

import codePattern from '../../../../imports/servicepage-why-choose-native-cross-platform-code-pattern.svg';
import sectionImg from '../../../../assets/images/servicepage-why-choose-native-cross-platform-img.png';

/** "Why Choose — Native or Cross-Platform" section for the ServicePage. */
export default function WhyChooseNativeCrossPlatform({
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
    <section className="servicepage-why-choose-native-cross-platform">
      <div className="content-container servicepage-why-choose-native-cross-platform__inner">
        {/* Image column */}
        <ScrollReveal direction="right" distance={30} style={{ flex: '1 0 0', alignSelf: 'stretch', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div className="servicepage-why-choose-native-cross-platform__image-col">
          <div className="servicepage-why-choose-native-cross-platform__image-wrapper">
            <Image
              src={imageUrl || sectionImg}
              alt="Mobile app displayed on a phone stand"
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              {...(!imageUrl && { placeholder: "blur" })}
              className="servicepage-why-choose-native-cross-platform__image"
            />
          </div>
        </div>
        </ScrollReveal>

        {/* Text column */}
        <ScrollReveal direction="left" delay={0.15} distance={30} style={{ flex: '1 0 0', minWidth: 0 }}>
        <div className="servicepage-why-choose-native-cross-platform__text-col">
          {/* Decorative code pattern */}
          <div
            className="servicepage-why-choose-native-cross-platform__pattern"
            aria-hidden="true"
          >
            <Image src={codePattern} alt="" width={214} height={200} />
          </div>

          <p className="servicepage-why-choose-native-cross-platform__caption">
            {kicker ?? 'Native or Cross-Platform'}
          </p>

          <h2 className="servicepage-why-choose-native-cross-platform__title">
            {title ?? 'We build both native apps and cross-platform solutions'}
          </h2>

          <div className="servicepage-why-choose-native-cross-platform__body">
            {paragraph ? (
              <StrapiBlocksRenderer content={paragraph} />
            ) : (
              <>
                <p>We build both native apps (Swift, Kotlin) and cross-platform solutions (React Native, Flutter), depending on what your product actually needs. Not what&apos;s trendy.</p>
                <p>We&apos;ll help you choose the right approach based on performance requirements, budget, and long-term scalability, and execute it without compromise.</p>
              </>
            )}
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
