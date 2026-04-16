import Image from 'next/image'
import { ScrollReveal } from '@/app/components/scroll-reveal'

/* Raster image imports */
import heroContentImage from '../../../../assets/images/blogpostpage-blogposthero-content.png'

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}.`;
}

interface BlogPostHeroProps {
  title?: string;
  author?: string;
  date?: string;
  heroImageUrl?: string;
}

export default function BlogPostHero({
  title = 'Why Most MVPs Fail After Launch (And How to Avoid It)',
  author = "Author's name",
  date,
  heroImageUrl,
}: BlogPostHeroProps) {
  const displayDate = date ? formatDate(date) : '17 May 2026.';
  return (
    <section className="blogpostpage-blog-post-hero">
      {/* Text content area — constrained by content-container */}
      <div className="content-container blogpostpage-blog-post-hero__content">
        <div className="blogpostpage-blog-post-hero__heading">
          {/* Author meta */}
          <ScrollReveal immediate direction="up" delay={0.1} distance={15}>
            <p className="blogpostpage-blog-post-hero__meta">
              <span className="blogpostpage-blog-post-hero__meta-author">
                {`By ${author}  `}
              </span>
              <span className="blogpostpage-blog-post-hero__meta-date">
                {displayDate}
              </span>
            </p>
          </ScrollReveal>

          {/* Display heading */}
          <ScrollReveal immediate direction="up" delay={0.25} distance={25}>
            <div className="blogpostpage-blog-post-hero__display-heading">
              <h1 className="blogpostpage-blog-post-hero__title">
                {title}
              </h1>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Hero image — full width, edge-to-edge */}
      <ScrollReveal immediate direction="none" delay={0.35}>
        <div className="blogpostpage-blog-post-hero__image-wrapper">
          <Image
            className="blogpostpage-blog-post-hero__image"
            src={heroImageUrl || heroContentImage}
            alt="Blog post hero illustration showing design components"
            fill
            sizes="100vw"
            priority
            {...(!heroImageUrl && { placeholder: "blur" })}
          />
        </div>
      </ScrollReveal>
    </section>
  )
}
