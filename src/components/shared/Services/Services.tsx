'use client';

import Link from 'next/link';
import { ScrollReveal } from '@/app/components/scroll-reveal';

import iconMobile from '../../../imports/aboutus-services-icon-mobile.svg';
import iconGlobe from '../../../imports/aboutus-services-icon-globe.svg';
import iconDesktop from '../../../imports/aboutus-services-icon-desktop.svg';
import iconShoppingBag from '../../../imports/aboutus-services-icon-shopping-bag.svg';
import iconRocket from '../../../imports/aboutus-services-icon-rocket.svg';
import iconPlugs from '../../../imports/aboutus-services-icon-plugs.svg';
import iconArrowSquareOut from '../../../imports/aboutus-services-icon-arrow-square-out.svg';
import iconCaretRight from '../../../imports/aboutus-services-icon-caret-right.svg';
import bulletDot from '../../../imports/aboutus-services-bullet-dot.svg';
import bulletDotAlt from '../../../imports/aboutus-services-bullet-dot-alt.svg';

import type { GlobalServiceCms } from '@/lib/types/global';

interface ServicesProps {
  services?: GlobalServiceCms[];
  caption?: string;
  subcaption?: string;
  title?: string;
  showViewAll?: boolean;
}

interface ServiceTag {
  label: string;
  variant: 'dot' | 'alt';
}

interface ServiceCardData {
  icon: { src: string; alt: string };
  title: string;
  description: string;
  tags: ServiceTag[];
  href?: string;
  featured?: boolean;
}

const DEFAULT_ICONS = [
  { src: iconMobile.src, alt: 'Mobile app development icon' },
  { src: iconGlobe.src, alt: 'Web development icon' },
  { src: iconDesktop.src, alt: 'Web app development icon' },
  { src: iconShoppingBag.src, alt: 'Ecommerce development icon' },
  { src: iconRocket.src, alt: 'MVP development icon' },
  { src: iconPlugs.src, alt: 'API integration icon' },
];

const servicesRow1: ServiceCardData[] = [
  {
    icon: DEFAULT_ICONS[0],
    title: 'Mobile App Development',
    description:
      "We build native and cross-platform mobile apps for iOS and Android. Whether you have a detailed spec or just an idea, we'll help you shape it and ship it.",
    tags: [
      { label: 'iOS (Swift)', variant: 'dot' },
      { label: 'Android (Kotlin)', variant: 'alt' },
    ],
  },
  {
    icon: DEFAULT_ICONS[1],
    title: 'Web Development',
    description:
      'Clean, fast, conversion-optimized websites for businesses that need more than a template. Built to rank and built to last.',
    tags: [
      { label: 'Next.js / React', variant: 'dot' },
      { label: 'Node.js / Python', variant: 'alt' },
    ],
    featured: true,
  },
  {
    icon: DEFAULT_ICONS[2],
    title: 'Web App Development',
    description:
      'Custom web applications, dashboards, and SaaS platforms tailored to how your business actually works, not the other way around.',
    tags: [
      { label: 'Dashboard Design', variant: 'dot' },
      { label: 'Real-time Data', variant: 'alt' },
    ],
  },
];

const servicesRow2: ServiceCardData[] = [
  {
    icon: DEFAULT_ICONS[3],
    title: 'Ecommerce Development',
    description:
      'Shopify, WooCommerce, or fully custom. We build ecommerce experiences that convert browsers into buyers.',
    tags: [
      { label: 'Shopify Headless', variant: 'dot' },
      { label: 'WooCommerce', variant: 'alt' },
    ],
  },
  {
    icon: DEFAULT_ICONS[4],
    title: 'MVP Development',
    description:
      'Got a startup idea? We help you validate it fast. We scope, build, and ship your MVP so you can get real feedback before over-investing.',
    tags: [
      { label: 'Rapid Prototyping', variant: 'dot' },
      { label: 'Lean Methodology', variant: 'alt' },
    ],
  },
  {
    icon: DEFAULT_ICONS[5],
    title: 'API Integration',
    description:
      'We connect your tools, automate your workflows, and make your systems talk to each other. Clean integrations, zero headaches.',
    tags: [
      { label: 'REST / GraphQL', variant: 'dot' },
      { label: 'Microservices', variant: 'alt' },
    ],
  },
];

function buildCardsFromCms(cmsServices: GlobalServiceCms[]): ServiceCardData[] {
  return cmsServices.map((svc, i) => ({
    icon: DEFAULT_ICONS[i % DEFAULT_ICONS.length],
    title: svc.title,
    description: svc.heroBodyText ?? '',
    tags: svc.tags.map((t, j) => ({
      label: t.label,
      variant: j === 0 ? 'dot' as const : 'alt' as const,
    })),
    href: `/services/${svc.slug}`,
  }));
}

function ServiceCard({ card }: { card: ServiceCardData }) {
  const classes = ['services__card'];
  if (card.featured) classes.push('services__card--featured');

  const content = (
    <article className={classes.join(' ')}>
      {/* Content */}
      <div className="services__card-content">
        {/* Icons row */}
        <div className="services__icons-container">
          <div className="services__icon-box services__icon-box--primary">
            <img
              className="services__icon-img"
              src={card.icon.src}
              alt={card.icon.alt}
              width={20}
              height={20}
            />
          </div>
          <div className="services__icon-box services__icon-box--link">
            <img
              className="services__icon-img"
              src={iconArrowSquareOut.src}
              alt=""
              width={20}
              height={20}
            />
          </div>
        </div>

        {/* Title */}
        <h3 className="services__card-title">{card.title}</h3>

        {/* Description */}
        <p className="services__card-description">{card.description}</p>

        {/* Tags */}
        <div className="services__card-items">
          {card.tags.map((tag) => (
            <div key={tag.label} className="services__item">
              {tag.variant === 'dot' ? (
                <div className="services__item-dot">
                  <img
                    className="services__item-dot-img"
                    src={bulletDot.src}
                    alt=""
                    width={6}
                    height={6}
                  />
                </div>
              ) : (
                <img
                  className="services__item-dot-alt-img"
                  src={bulletDotAlt.src}
                  alt=""
                  width={14}
                  height={14}
                />
              )}
              <span className="services__card-tag">{tag.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="services__card-actions">
        <button type="button" className="services__button">
          <span className="services__button-text">Request service</span>
          <img
            className="services__button-icon"
            src={iconCaretRight.src}
            alt=""
            width={20}
            height={20}
          />
        </button>
      </div>
    </article>
  );

  if (card.href) {
    return <Link href={card.href} className="services__card-link">{content}</Link>;
  }
  return content;
}

export default function Services({
  services,
  caption = 'Our Services',
  subcaption = 'From mobile apps to complex web platforms',
  title = 'We take your idea from concept to launch. Fast, clean, and built to scale.',
  showViewAll = false,
}: ServicesProps) {
  const allCards = services && services.length > 0
    ? buildCardsFromCms(services)
    : [...servicesRow1, ...servicesRow2];

  const row1 = allCards.slice(0, 3);
  const row2 = allCards.slice(3, 6);

  return (
    <section className="services">
      <div className="services__inner">
      {/* Heading */}
      <ScrollReveal direction="up" distance={25} style={{ width: '100%' }}>
        <div className="services__heading">
          <p className="services__caption">{caption}</p>
          <p className="services__subcaption">{subcaption}</p>
          <h2 className="services__title">{title}</h2>
        </div>
      </ScrollReveal>

      {/* Cards */}
      <div className="services__cards">
        {/* Row 1 */}
        <ScrollReveal direction="up" distance={30} style={{ width: '100%' }}>
          <div className="services__row">
            {row1.map((card) => (
              <ServiceCard key={card.title} card={card} />
            ))}
          </div>
        </ScrollReveal>

        {/* Row 2 */}
        {row2.length > 0 && (
        <ScrollReveal direction="up" distance={30} delay={0.15} style={{ width: '100%' }}>
          <div className="services__row">
            {row2.map((card) => (
              <ServiceCard key={card.title} card={card} />
            ))}
          </div>
        </ScrollReveal>
        )}
      </div>

      {showViewAll && (
        <ScrollReveal direction="up" distance={20} delay={0.3} style={{ width: '100%' }}>
          <div className="services__view-all">
            <Link href="/services" className="services__view-all-btn">
              <span className="services__view-all-text">View All Services</span>
              <img
                className="services__view-all-icon"
                src={iconCaretRight.src}
                alt=""
                width={20}
                height={20}
              />
            </Link>
          </div>
        </ScrollReveal>
      )}
      </div>
    </section>
  );
}
