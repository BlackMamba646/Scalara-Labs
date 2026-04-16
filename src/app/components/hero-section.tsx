"use client";

import { useState } from "react";
import Image from "next/image";
import svgPaths from "@/imports/svg-o7qtbz0mkr";
import { ScrollReveal } from "./scroll-reveal";
import imgHeroBackground from "@/assets/images/home-hero-background.png";
import imgHeroOverlay from "@/assets/images/home-hero-overlay.png";
import imgHeroMobile from "@/assets/images/home-hero-mobile-bg.png";

function StarIcon() {
  return (
    <svg className="size-[16px] shrink-0" fill="none" viewBox="0 0 16 16">
      <clipPath id="starClip">
        <rect fill="white" height="16" width="16" />
      </clipPath>
      <g clipPath="url(#starClip)">
        <path d={svgPaths.pfae9b00} fill="white" />
      </g>
    </svg>
  );
}

function StarsRating({ rating = 5.0 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-[4px]">
      <span className="font-['Manrope',sans-serif] font-medium text-[15px] leading-none text-[#f6f6f6]">{rating}</span>
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} />
        ))}
      </div>
    </div>
  );
}

function GoogleLogo() {
  return (
    <div className="flex items-center gap-[4px]">
      <span className="font-['Manrope',sans-serif] font-normal text-[14px] leading-none text-[#f6f6f6] opacity-80">Star rated on</span>
      <div className="h-[16px] relative shrink-0 w-[48.606px]">
        <div className="absolute inset-[27.64%_57.21%_22.39%_26.29%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.02168 7.9964">
            <path d={svgPaths.p1760c900} fill="white" />
          </svg>
        </div>
        <div className="absolute inset-[27.64%_39.4%_22.39%_44.09%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.02168 7.9964">
            <path d={svgPaths.p25f61100} fill="white" />
          </svg>
        </div>
        <div className="absolute inset-[27.64%_22.34%_0_61.89%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.66473 11.5782">
            <path d={svgPaths.p14ef3c80} fill="white" />
          </svg>
        </div>
        <div className="absolute inset-[2.85%_16.69%_23.92%_79.79%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.7125 11.717">
            <path d="M1.7125 0V11.717H0V0H1.7125Z" fill="white" />
          </svg>
        </div>
        <div className="absolute inset-[27.62%_0_22.4%_84.83%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.37452 7.99639">
            <path d={svgPaths.pd285cf0} fill="white" />
          </svg>
        </div>
        <div className="absolute inset-[0_75.11%_22.4%_0]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.0974 12.4164">
            <path d={svgPaths.p2418600} fill="white" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ArrowUpRightSmall() {
  return (
    <div className="shrink-0 opacity-60 size-[14px] p-[3.06px]">
      <svg className="block size-full" fill="none" viewBox="0 0 7.87524 7.87524" overflow="visible">
        <path d={svgPaths.p7869180} fill="#0C1B3B" />
      </svg>
    </div>
  );
}

function HeroContent({ onConsultationClick, rating, headingSerif = "Senior Software Engineers.", headingBold = "Startup Speed.", headingGradient = "Enterprise Quality.", ctaText = "Get a free consultation" }: { onConsultationClick: () => void; rating?: number; headingSerif?: string; headingBold?: string; headingGradient?: string; ctaText?: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-start px-[80px] py-[64px] w-full max-md:px-[24px] max-md:py-[40px]">
      <div className="flex flex-col gap-[24px] items-start justify-center max-w-[900px] pt-[40px] max-md:pt-[20px]">
        {/* Trust Badge */}
        <ScrollReveal immediate direction="up" delay={0.1} distance={20}>
          <div className="flex items-center justify-center">
            <div className="flex gap-[12px] items-center justify-center flex-wrap">
              <StarsRating rating={rating} />
              <GoogleLogo />
            </div>
          </div>
        </ScrollReveal>

        {/* Display Heading */}
        <ScrollReveal immediate direction="up" delay={0.25} distance={25}>
          <h1 className="flex flex-col items-start text-white w-full">
            <span className="font-['Results_Letter',serif] font-thin not-italic text-[60px] leading-[1.2] max-lg:text-[44px] max-md:text-[36px]">
              {headingSerif}
            </span>
            <span className="font-['Manrope',sans-serif] font-semibold text-[46px] tracking-[-0.92px] leading-[1.2] max-lg:text-[34px] max-md:text-[28px]">
              <span>{headingBold} </span>
              <span className="bg-clip-text bg-gradient-to-r from-[#218af3] to-white text-transparent">
                {headingGradient}
              </span>
            </span>
          </h1>
        </ScrollReveal>

        {/* CTA Button */}
        <ScrollReveal immediate direction="up" delay={0.4} distance={20}>
          <button
            onClick={onConsultationClick}
            className="bg-white flex gap-[6px] items-center justify-center px-[24px] py-[14px] rounded-[999px] cursor-pointer transition-all duration-300 hover:bg-[#f0f0f0] hover:shadow-lg hover:shadow-white/10 active:scale-[0.97]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              transform: isHovered ? "translateY(-1px)" : "translateY(0)",
            }}
          >
            <span className="font-['Manrope',sans-serif] font-medium leading-[1.4] text-[#0c1b3b] text-[10px] text-center tracking-[0.8px] uppercase whitespace-nowrap">
              {ctaText}
            </span>
            <ArrowUpRightSmall />
          </button>
        </ScrollReveal>
      </div>
    </div>
  );
}

const defaultTechLogos = [
  { src: "/assets/Aws_logo.svg", alt: "AWS", height: "24px" },
  { src: "/assets/pixijs.svg", alt: "Pixi.js", height: "20px" },
  { src: "/assets/371585.svg", alt: "TypeScript", height: "24px" },
];

function AboutSection({ description = "Powered by engineers who have built payment systems for leading banks, geospatial platforms, and industrial IoT solutions.\u0020Deep expertise. Reliable delivery.", techLogos }: { description?: string; techLogos?: { name: string; logo?: { url: string } | null }[] }) {
  return (
    <ScrollReveal immediate direction="up" delay={0.2} distance={20}>
      <div className="relative w-full">
        <div className="border-t border-[rgba(0,0,0,0.4)]" />
        <div className="px-[80px] py-[40px] flex items-center justify-between gap-[40px] max-md:flex-col max-md:items-start max-md:gap-[24px] max-md:px-[24px] max-md:py-[24px]">
          <div className="max-w-[690px]">
            <p className="font-['Manrope',sans-serif] font-normal text-[15px] text-white leading-[1.8] max-md:text-[#E7E7E7]/80">
              {description}
            </p>
          </div>
          {/* Tech Stack Logos */}
          <div className="flex items-center gap-[32px] opacity-80 shrink-0 flex-wrap">
            {techLogos && techLogos.some(l => l.logo?.url) ? (
              techLogos.map((logo) => (
                <img
                  key={logo.name}
                  src={logo.logo?.url || ""}
                  alt={logo.name}
                  className="h-[24px] brightness-0 invert"
                />
              ))
            ) : (
              defaultTechLogos.map((logo) => (
                <img key={logo.alt} src={logo.src} alt={logo.alt} className={`h-[${logo.height}] brightness-0 invert`} style={{ height: logo.height }} />
              ))
            )}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

interface HeroSectionProps {
  onConsultationClick: () => void;
  rating?: number;
  headingSerif?: string;
  headingBold?: string;
  headingGradient?: string;
  ctaText?: string;
  description?: string;
  techLogos?: { name: string; logo?: { url: string } | null }[];
}

export function HeroSection({ onConsultationClick, rating, headingSerif, headingBold, headingGradient, ctaText, description, techLogos }: HeroSectionProps) {
  return (
    <div className="relative flex flex-col items-end w-full min-h-[614px]">
      {/* Background layers */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute bg-[#080e1b] inset-0" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute h-[120.49%] left-[15.9%] top-[-14.91%] w-[93.55%] max-md:left-1/2 max-md:-translate-x-1/2 max-md:w-[200%]">
            <Image
              alt=""
              src={imgHeroBackground}
              fill
              sizes="100vw"
              priority
              placeholder="blur"
              className="object-cover max-md:object-center"
            />
          </div>
        </div>
        <Image
          alt=""
          src={imgHeroOverlay}
          fill
          sizes="100vw"
          priority
          placeholder="blur"
          className="object-cover max-md:hidden"
        />
        <Image
          alt=""
          src={imgHeroMobile}
          fill
          sizes="(max-width: 767px) 100vw, 0px"
          priority
          placeholder="blur"
          className="object-cover object-top hidden max-md:block"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 1440 614\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"none\"><rect x=\"0\" y=\"0\" height=\"100%\" width=\"100%\" fill=\"url(%23grad)\" opacity=\"1\"/><defs><radialGradient id=\"grad\" gradientUnits=\"userSpaceOnUse\" cx=\"0\" cy=\"0\" r=\"10\" gradientTransform=\"matrix(121.7 35.275 -111.14 196.01 223 0.0000066206)\"><stop stop-color=\"rgba(12,27,59,1)\" offset=\"0\"/><stop stop-color=\"rgba(12,27,59,0)\" offset=\"0.6\"/></radialGradient></defs></svg>'), url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 1440 614\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"none\"><rect x=\"0\" y=\"0\" height=\"100%\" width=\"100%\" fill=\"url(%23grad)\" opacity=\"1\"/><defs><radialGradient id=\"grad\" gradientUnits=\"userSpaceOnUse\" cx=\"0\" cy=\"0\" r=\"10\" gradientTransform=\"matrix(144 30.7 -111.83 236.3 -0.000024997 307)\"><stop stop-color=\"rgba(8,14,27,1)\" offset=\"0\"/><stop stop-color=\"rgba(12,27,59,0)\" offset=\"1\"/></radialGradient></defs></svg>'), linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.8) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative flex flex-col w-full flex-1 pt-[70px] max-md:pt-[60px] max-w-[1440px] mx-auto">
        <div className="flex-1 flex flex-col justify-end relative">
          <HeroContent onConsultationClick={onConsultationClick} rating={rating} headingSerif={headingSerif} headingBold={headingBold} headingGradient={headingGradient} ctaText={ctaText} />
        </div>
        <AboutSection description={description} techLogos={techLogos} />
      </div>
    </div>
  );
}