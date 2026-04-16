'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ConsultationModal } from '@/app/components/consultation-modal';
import footerLogoIcon from '../../../imports/footer-logo-icon.svg';
import footerScalaraText from '../../../imports/footer-scalara-text.svg';
import footerLabsText from '../../../imports/footer-labs-text.svg';
import footerInstagram from '../../../imports/footer-instagram.svg';
import footerLinkedin from '../../../imports/footer-linkedin.svg';
import footerArrowUpRight from '../../../imports/footer-arrow-up-right.svg';


const companyLinks = [
  { label: 'About Us', href: '/about-us' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const servicesLinks = [
  { label: 'Mobile App Development', href: '#' },
  { label: 'Web Development', href: '#' },
  { label: 'Web App Development', href: '#' },
  { label: 'Ecommerce Development', href: '#' },
  { label: 'MVP Development', href: '#' },
  { label: 'API Integration', href: '#' },
];

const policyLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
];

const socialIcons = [
  { name: 'Instagram', icon: footerInstagram, href: 'https://www.instagram.com/scalaralabs' },
  { name: 'LinkedIn', icon: footerLinkedin, href: 'https://www.linkedin.com/company/scalara-labs/' },
];

/** Contact info block — reused for desktop (inline) and tablet/mobile (banner) */
function ContactBlock({ className, onConnectClick }: { className?: string; onConnectClick?: () => void }) {
  return (
    <div className={`footer__contact-col ${className || ''}`}>
      <div className="footer__contact-info">
        <a href="tel:+436647940765" className="footer__phone" aria-label="Call us at +43 664 7940765">+43 664 7940765</a>
        <a href="mailto:contact@scalaralabs.com" className="footer__email" aria-label="Email us at contact@scalaralabs.com">contact@scalaralabs.com</a>
      </div>
      <button type="button" onClick={onConnectClick} className="footer__cta-button">
        <span className="footer__cta-text">Connect With Us</span>
        <Image
          src={footerArrowUpRight}
          alt=""
          width={14}
          height={14}
          className="footer__cta-icon"
        />
      </button>
    </div>
  );
}

export default function Footer() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <footer className="footer">
      {/* Contact banner — only visible on tablet/mobile */}
      <ContactBlock className="footer__contact-col--banner" onConnectClick={() => setModalOpen(true)} />

      <div className="footer__inner">
      {/* Logo row */}
      <div className="footer__logo-row">
        <Link href="/" className="footer__logo" aria-label="Scalara Labs — Home">
          <Image
            src={footerLogoIcon}
            alt=""
            width={42}
            height={46}
            className="footer__logo-icon"
          />
          <Image
            src={footerScalaraText}
            alt="Scalara"
            width={112}
            height={15}
            className="footer__logo-scalara"
          />
          <Image
            src={footerLabsText}
            alt="Labs"
            width={32}
            height={6}
            className="footer__logo-labs"
          />
        </Link>
      </div>

      {/* Main content area — 4 columns on desktop */}
      <div className="footer__main">
        {/* Col 1: Description + Social icons */}
        <div className="footer__description-col">
          <p className="footer__tagline">
            You get the technical depth of a top-tier agency with a team
            that&apos;s efficient and easy to work with.
          </p>
          <div className="footer__social-icons">
            {socialIcons.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label={social.name}
              >
                <Image
                  src={social.icon}
                  alt=""
                  width={social.icon.width}
                  height={social.icon.height}
                  className="footer__social-icon"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Col 2: Company links */}
        <div className="footer__link-column footer__link-column--company">
          <p className="footer__column-title">Company</p>
          <div className="footer__column-links">
            {companyLinks.map((link) =>
              link.label === 'Contact' ? (
                <button
                  key={link.label}
                  type="button"
                  className="footer__link footer__link--button"
                  onClick={() => setModalOpen(true)}
                >
                  {link.label}
                </button>
              ) : (
                <a key={link.label} href={link.href} className="footer__link">
                  {link.label}
                </a>
              )
            )}
          </div>
        </div>

        {/* Col 3: Services links */}
        <div className="footer__link-column">
          <p className="footer__column-title">Services</p>
          <div className="footer__column-links">
            {servicesLinks.map((link) => (
              <a key={link.label} href={link.href} className="footer__link">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Col 4: Contact info — only visible on desktop */}
        <ContactBlock className="footer__contact-col--inline" onConnectClick={() => setModalOpen(true)} />

        {/* Site column — only visible on tablet */}
        <div className="footer__site-column">
          <p className="footer__column-title">Site</p>
          <div className="footer__column-links">
            {policyLinks.map((link) => (
              <Link key={link.label} href={link.href} className="footer__link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      </div>

      {/* Bottom bar */}
      <div className="w-full h-px bg-[rgba(136,153,180,0.15)]" />
      <div className="relative shrink-0 w-full">
        <div className="flex flex-row items-center size-full">
          <div className="flex items-center justify-between px-[40px] py-[12px] relative w-full max-lg:flex-col max-lg:gap-[12px] max-lg:items-start max-md:px-[20px] max-md:py-[16px]">
            <p className="font-['Manrope',sans-serif] leading-[2] opacity-80 text-[#8899B4] text-[12px] whitespace-nowrap">
              &copy; 2026 - Scalara Labs. All Rights Reserved.
            </p>
            <div className="flex gap-[24px] items-center shrink-0 max-lg:flex-col max-lg:items-start max-lg:gap-[12px]">
              <div className="flex gap-[16px] items-start lg:border-r lg:border-[rgba(136,153,180,0.3)] lg:pr-[24px] max-sm:flex-wrap max-sm:gap-[8px]">
                {policyLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="font-['Manrope',sans-serif] leading-[1.8] opacity-60 text-[#C8D4E6] text-[14px] whitespace-nowrap hover:opacity-100 transition-opacity"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex gap-[12px] items-center">
                <p className="font-['Manrope',sans-serif] leading-[2] opacity-80 text-[#8899B4] text-[12px] whitespace-nowrap">
                  As seen on
                </p>
                <div className="flex gap-[16px] max-sm:gap-[12px] items-end opacity-80 pl-2">
                  <img src="/assets/clutchco.svg" alt="Clutch" className="h-[18px] max-sm:h-[14px] opacity-70 brightness-0 invert" />
                  <img src="/assets/upwork.svg" alt="Upwork" className="h-[18px] max-sm:h-[14px] opacity-70 brightness-0 invert" />
                  <img src="/assets/fiverr-2.svg" alt="Fiverr" className="h-[18px] max-sm:h-[14px] opacity-70 brightness-0 invert" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </footer>
  );
}
