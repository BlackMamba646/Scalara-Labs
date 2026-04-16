'use client';

import { useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { ScrollReveal } from '@/app/components/scroll-reveal';
import imgMarko from '../../../assets/images/aboutus-team-member-marko.jpg';
import imgKris from '../../../assets/images/aboutus-team-member-kris.png';
import imgStefan from '../../../assets/images/aboutus-team-member-stefan.jpg';
import imgDavid from '../../../assets/images/aboutus-team-member-david.jpg';
import imgMobileHassan from '../../../assets/images/home-team-member-3.png';
import imgMobileKris from '../../../assets/images/home-team-member-1.png';
import imgMobileMarko from '../../../assets/images/home-team-member-2.png';
import imgMobileHussain from '../../../assets/images/home-team-member-4.png';
import linkedinIcon from '../../../imports/aboutus-team-linkedin.svg';
import slogoIcon from '../../../imports/aboutus-team-slogo.svg';
import type { TeamMemberCms } from '@/lib/types/home';


interface TeamMember {
  name: string;
  role: string;
  bio: string;
  linkedinUrl: string;
  photo: typeof imgMarko | string;
  mobilePhoto: typeof imgMarko | string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Hassan',
    role: 'Founder',
    bio: 'React & Node.js expert. Built multiple SaaS MVPs from 0 to 1.',
    linkedinUrl: '#',
    photo: imgStefan,
    mobilePhoto: imgMobileHassan,
  },
  {
    name: 'Kris Stigmerkukic',
    role: 'CEO',
    bio: '12+ years in fintech. Previously designed low-latency trading systems.',
    linkedinUrl: '#',
    photo: imgMarko,
    mobilePhoto: imgMobileKris,
  },
  {
    name: 'Marko V.',
    role: 'COO',
    bio: 'Specialist in Python & Go. Contributor to major open source DB projects.',
    linkedinUrl: '#',
    photo: imgKris,
    mobilePhoto: imgMobileMarko,
  },
  {
    name: 'Hussain',
    role: 'CCO',
    bio: 'Swift & Kotlin native specialist. Focused on smooth animations and UX.',
    linkedinUrl: '#',
    photo: imgDavid,
    mobilePhoto: imgMobileHussain,
  },
];

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <>
      {/* Desktop / Tablet card */}
      <div className="team__card team__card--desktop">
        {/* Active state (default) — photo with overlay */}
        <div className="team__card-active">
          <div className="team__card-photo-wrap" aria-hidden="true">
            <Image
              className="team__card-photo"
              src={member.photo}
              alt={member.name}
              fill
              sizes="(max-width: 767px) 80vw, (max-width: 1023px) 45vw, 25vw"
              {...(typeof member.photo !== 'string' && { placeholder: "blur" })}
            />
            <div className="team__card-overlay" />
          </div>

          <div className="team__card-info">
            <p className="team__card-name">{member.name}</p>
            <div className="team__card-role-badge">
              <p className="team__card-role-text">{member.role}</p>
            </div>
          </div>
        </div>

        {/* Hover state — dark card with details */}
        <div className="team__card-hover">
          <div className="team__card-slogo" aria-hidden="true">
            <img src={slogoIcon.src} alt="" />
          </div>

          <div className="team__card-hover-heading">
            <p className="team__card-hover-name">{member.name}</p>
            <p className="team__card-hover-role">{member.role}</p>
          </div>

          <div className="team__card-hover-bottom">
            <a
              className="team__card-linkedin"
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} LinkedIn profile`}
            >
              <img src={linkedinIcon.src} alt="" />
            </a>
            <p className="team__card-bio">{member.bio}</p>
          </div>
        </div>
      </div>

      {/* Mobile card */}
      <div className="team__card team__card--mobile">
        <div className="team__card-mobile-bg" aria-hidden="true">
          <svg fill="none" preserveAspectRatio="none" viewBox="0 0 285.5 260">
            <path d="M143.5 0H285.5L143.5 260H0L143.5 0Z" fill="rgba(231,231,231,0.8)" fillOpacity="0.08" />
          </svg>
        </div>
        <div className="team__card-mobile-image">
          <Image
            className="team__card-mobile-photo"
            src={member.mobilePhoto}
            alt={member.name}
            fill
            sizes="(max-width: 767px) 100vw, 0px"
            {...(typeof member.mobilePhoto !== 'string' && { placeholder: "blur" })}
          />
          <div className="team__card-mobile-actions">
            <a
              className="team__card-mobile-linkedin"
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} LinkedIn profile`}
            >
              <img src={linkedinIcon.src} alt="" />
            </a>
          </div>
        </div>
        <div className="team__card-mobile-info">
          <p className="team__card-mobile-name">{member.name}</p>
          <p className="team__card-mobile-role">{member.role}</p>
          <p className="team__card-mobile-bio">{member.bio}</p>
        </div>
      </div>
    </>
  );
}

export default function Team({ title, subtitle, members }: { title?: string; subtitle?: string; members?: TeamMemberCms[] }) {
  const cardsRef = useRef<HTMLDivElement>(null);

  const displayMembers = useMemo(() => {
    if (!members || members.length === 0) return teamMembers;
    return members.map((cms, i) => ({
      name: cms.name || teamMembers[i]?.name || '',
      role: cms.role || teamMembers[i]?.role || '',
      bio: cms.bio || teamMembers[i]?.bio || '',
      linkedinUrl: cms.linkedinUrl || teamMembers[i]?.linkedinUrl || '#',
      photo: cms.desktopPhotoUrl || teamMembers[i]?.photo || imgStefan,
      mobilePhoto: cms.mobilePhotoUrl || teamMembers[i]?.mobilePhoto || imgMobileHassan,
    }));
  }, [members]);

  const scrollCards = useCallback((direction: 'prev' | 'next') => {
    const container = cardsRef.current;
    if (!container) return;

    const cardWidth = container.querySelector('.team__card')?.clientWidth ?? 0;
    const gap = 16;
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  return (
    <section className="team">
      <div className="team__inner">
      <ScrollReveal direction="up" distance={25} style={{ width: '100%' }}>
        <div className="team__heading">
          <h2 className="team__title">
            {title ?? 'The People Building Your Product'}
          </h2>
          <p className="team__subtitle">
            {subtitle ?? 'No offshore black boxes. No revolving junior teams. Meet the engineers behind Scalara Labs.'}
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.15} distance={30} style={{ width: '100%' }}>
        <div className="team__cards" ref={cardsRef}>
          {displayMembers.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.3} distance={20} style={{ width: '100%' }}>
        <nav className="team__nav" aria-label="Team carousel navigation">
          <button
            className="team__nav-btn"
            onClick={() => scrollCards('prev')}
            type="button"
            aria-label="Previous team members"
          >
            <svg
              className="team__nav-chevron"
              viewBox="0 0 8 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 1L1 7L7 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Prev
          </button>
          <button
            className="team__nav-btn"
            onClick={() => scrollCards('next')}
            type="button"
            aria-label="Next team members"
          >
            Next
            <svg
              className="team__nav-chevron"
              viewBox="0 0 8 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L7 7L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </nav>
      </ScrollReveal>
      </div>
    </section>
  );
}
