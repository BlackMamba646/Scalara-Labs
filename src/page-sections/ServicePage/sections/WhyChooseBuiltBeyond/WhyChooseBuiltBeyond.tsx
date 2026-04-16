import Image from 'next/image';
import { ScrollReveal } from '@/app/components/scroll-reveal';
import type { BlocksContent } from '@strapi/blocks-react-renderer';
import StrapiBlocksRenderer from '@/components/shared/StrapiBlocksRenderer/StrapiBlocksRenderer';

import codePattern from '../../../../imports/servicepage-why-choose-built-beyond-code-pattern.svg';
import sectionImg from '../../../../assets/images/servicepage-why-choose-built-beyond-img-overlay.png';

export default function WhyChooseBuiltBeyond({
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
    <section className="servicepage-why-choose-built-beyond">
      <div className="content-container servicepage-why-choose-built-beyond__inner">
        {/* ===== Text content (left on desktop, top on tablet/mobile) ===== */}
        <ScrollReveal direction="right" distance={30} style={{ flex: '1 0 0', minWidth: 0 }}>
        <div className="servicepage-why-choose-built-beyond__heading">
          {/* Decorative code pattern */}
          <div
            className="servicepage-why-choose-built-beyond__pattern"
            aria-hidden="true"
          >
            <img
              src={codePattern.src}
              alt=""
              width={214}
              height={200}
            />
          </div>

          <p className="servicepage-why-choose-built-beyond__caption">
            {kicker ?? 'Built Beyond the UI'}
          </p>

          <h2 className="servicepage-why-choose-built-beyond__title">
            {title ?? 'Most mobile apps look good. Few actually hold up under real usage.'}
          </h2>

          <div className="servicepage-why-choose-built-beyond__body">
            {paragraph ? (
              <StrapiBlocksRenderer content={paragraph} />
            ) : (
              <>
                <p>We focus on what happens behind the interface: data flow, backend communication, performance under load, and how the app behaves when things go wrong.</p>
                <p>Because that&apos;s what users notice after day one.</p>
              </>
            )}
          </div>
        </div>
        </ScrollReveal>

        {/* ===== Image (right on desktop, bottom on tablet/mobile) ===== */}
        <ScrollReveal direction="left" delay={0.15} distance={30} style={{ flex: '1 0 0', alignSelf: 'stretch', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div className="servicepage-why-choose-built-beyond__image-wrap">
          <div className="servicepage-why-choose-built-beyond__image">
            <Image
              src={imageUrl || sectionImg}
              alt="Mobile app dashboard with live data on multiple devices"
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 100vw, 50vw"
              {...(!imageUrl && { placeholder: "blur" })}
            />
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
