'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ConsultationModal } from '@/app/components/consultation-modal';
import type { GlobalServiceCms } from '@/lib/types/global';
import headerLogoIcon from '../../../imports/header-logo-icon.svg';
import headerScalaraText from '../../../imports/header-scalara-text.svg';
import headerScalaraTextBlue from '../../../imports/header-scalara-text-blue.svg';
import headerLabsText from '../../../imports/header-labs-text.svg';
import headerCaretDown from '../../../imports/header-caret-down.svg';
import headerArrowUpRight from '../../../imports/header-arrow-up-right.svg';
import headerArrowUpRightDark from '../../../imports/header-arrow-up-right-dark.svg';


interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  action?: 'modal';
  children?: NavChild[];
}

const staticServicesChildren: NavChild[] = [
  { label: 'Mobile App Development', href: '/services/mobile-app-development' },
  { label: 'Web Development', href: '/services/web-development' },
  { label: 'Web App Development', href: '/services/web-app-development' },
  { label: 'Ecommerce Development', href: '/services/ecommerce-development' },
  { label: 'MVP Development', href: '/services/mvp-development' },
  { label: 'API Integration', href: '/services/api-integration' },
];

interface HeaderProps {
  variant?: 'dark' | 'light';
  services?: GlobalServiceCms[] | null;
}

export default function Header({ variant = 'dark', services }: HeaderProps) {
  const servicesChildren: NavChild[] = services?.map(s => ({
    label: s.title.toLowerCase().replace(/^\w/, c => c.toUpperCase()),
    href: `/services/${s.slug}`,
  })) ?? staticServicesChildren;

  const navItems: NavItem[] = [
    { label: 'About us', href: '/about-us' },
    { label: 'Services', href: '/services', hasDropdown: true, children: servicesChildren },
    { label: 'Blog', href: '/blog' },
  ];
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setMobileDropdownOpen(null);
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isLight = variant === 'light' && !scrolled && !menuOpen;

  return (
    <>
    <header className={`header${scrolled || menuOpen ? ' header--scrolled' : ''}${isLight ? ' header--light' : ''}`}>
      <div className="header__inner">
        {/* Logo */}
        <Link href="/" className="header__logo" aria-label="Scalara Labs — Home">
          <span className="header__logo-icon">
            <Image src={headerLogoIcon} alt="" width={35} height={38} priority />
          </span>
          <span className="header__logo-scalara">
            <Image src={isLight ? headerScalaraTextBlue : headerScalaraText} alt="" width={92} height={12} priority />
          </span>
          <span className="header__logo-labs">
            <Image src={headerLabsText} alt="" width={26} height={5} priority />
          </span>
        </Link>

        {/* Navigation */}
        <nav className="header__nav" aria-label="Main navigation">
          {navItems.map((item) => {
            const hasChildren = item.hasDropdown && item.children && item.children.length > 0;
            const itemClasses = `header__nav-item${hasChildren ? ' header__nav-item--has-dropdown' : ''}`;
            return (
              <div key={item.label} className={itemClasses}>
                {item.action === 'modal' ? (
                  <button
                    type="button"
                    className="header__nav-link header__nav-link--button"
                    onClick={() => setModalOpen(true)}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link href={item.href} className="header__nav-link">
                    {item.label}
                  </Link>
                )}
                {item.hasDropdown && (
                  <Image
                    src={headerCaretDown}
                    alt=""
                    width={14}
                    height={14}
                    className="header__caret-icon"
                  />
                )}
                {hasChildren && (
                  <div className="header__dropdown" role="menu">
                    {item.children!.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="header__dropdown-link"
                        role="menuitem"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* CTA Button */}
          <button
            type="button"
            className="header__cta"
            onClick={() => setModalOpen(true)}
          >
            <span className="header__cta-text">Get a free consultation</span>
            <Image
              src={headerArrowUpRight}
              alt=""
              width={20}
              height={20}
              className="header__cta-arrow"
            />
          </button>

          {/* Hamburger menu button */}
          <button
            className={`header__hamburger${menuOpen ? ' header__hamburger--open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="header__hamburger-line" />
          </button>
        </nav>
      </div>

      {/* Mobile menu overlay */}
      <div className={`header__mobile-menu${menuOpen ? ' header__mobile-menu--open' : ''}`}>
        <nav className="header__mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item) => {
            const hasChildren = item.hasDropdown && item.children && item.children.length > 0;
            const isOpen = mobileDropdownOpen === item.label;

            if (item.action === 'modal') {
              return (
                <button
                  key={item.label}
                  type="button"
                  className="header__mobile-link header__mobile-link--button"
                  onClick={() => { setMenuOpen(false); setModalOpen(true); }}
                >
                  {item.label}
                </button>
              );
            }

            if (hasChildren) {
              return (
                <div key={item.label} className="header__mobile-group">
                  <button
                    type="button"
                    className={`header__mobile-link header__mobile-link--button header__mobile-link--has-dropdown${isOpen ? ' header__mobile-link--open' : ''}`}
                    aria-expanded={isOpen}
                    onClick={() => setMobileDropdownOpen(isOpen ? null : item.label)}
                  >
                    {item.label}
                    <Image
                      src={headerCaretDown}
                      alt=""
                      width={14}
                      height={14}
                      className="header__caret-icon"
                    />
                  </button>
                  <div className={`header__mobile-dropdown${isOpen ? ' header__mobile-dropdown--open' : ''}`}>
                    {item.children!.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="header__mobile-dropdown-link"
                        onClick={() => setMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className="header__mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            className="header__mobile-cta"
            onClick={() => { setMenuOpen(false); setModalOpen(true); }}
          >
            <span>Get a free consultation</span>
            <Image
              src={headerArrowUpRightDark}
              alt=""
              width={20}
              height={20}
            />
          </button>
        </nav>
      </div>
    </header>

    <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
