"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import svgPaths from "@/imports/svg-q2iye5g8i4";
import Link from "next/link";
import { ScrollReveal, StaggerReveal } from "./scroll-reveal";
import imgAvatar1 from "@/assets/images/home-avatar-1.png";
import imgAvatar2 from "@/assets/images/home-avatar-2.png";
import imgAvatar3 from "@/assets/images/home-avatar-3.png";
import imgAvatar4 from "@/assets/images/home-avatar-4.png";
import imgHand from "@/assets/images/home-hand-image.png";

/* ── Card illustration SVGs ── */
import imgDiff01Phone from "@/imports/home-difference-01-phone.svg";
import imgDiff01Code from "@/imports/home-difference-01-code.svg";
import imgDiff01CircuitBottom from "@/imports/home-difference-01-circuit-bottom.svg";
import imgDiff01CircuitGroup from "@/imports/home-difference-01-circuit-group.svg";
import imgDiff01CircuitRec from "@/imports/home-difference-01-circuit-rec.svg";
import imgDiff01CircuitVer from "@/imports/home-difference-01-circuit-ver.svg";
import imgDiff02EuropeMask from "@/imports/home-difference-02-europe-mask.svg";
import imgDiff02Europe from "@/imports/home-difference-02-europe.svg";
import imgDiff02Code from "@/imports/home-difference-02-code.svg";
import imgDiff02Premium from "@/imports/home-difference-02-premium.svg";
import imgDiff03Flash from "@/imports/home-difference-03-flash.svg";
import imgDiff03Bubble from "@/imports/home-difference-03-bubble.svg";
import imgDiff03Bubble2 from "@/imports/home-difference-03-bubble2.svg";
import imgDiff03Code from "@/imports/home-difference-03-code.svg";
import imgDiff04Puzzle from "@/imports/home-difference-04-puzzle.svg";
import imgDiff04Code from "@/imports/home-difference-04-code.svg";
import imgDiff04CircuitGroup from "@/imports/home-difference-04-circuit-group.svg";
import imgDiff04CircuitRec from "@/imports/home-difference-04-circuit-rec.svg";
import imgDiff04CircuitVer from "@/imports/home-difference-04-circuit-ver.svg";

/* ── Matrix Rain Canvas ── */
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    const fontSize = 13;
    const columns = Math.floor(w / fontSize);
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン{}[]<>/=;:.()";

    // Initialize drops lazily via a ref-stored array
    if (!(canvas as any)._drops || (canvas as any)._drops.length !== columns) {
      (canvas as any)._drops = Array.from({ length: columns }, () =>
        Math.random() * -50
      );
    }
    const drops: number[] = (canvas as any)._drops;

    // Semi-transparent overlay for trail effect
    ctx.fillStyle = "rgba(12, 27, 59, 0.12)";
    ctx.fillRect(0, 0, w, h);

    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < columns; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Brighter head character
      const brightness = Math.random();
      if (brightness > 0.9) {
        ctx.fillStyle = "rgba(33, 138, 243, 0.9)";
      } else if (brightness > 0.6) {
        ctx.fillStyle = "rgba(33, 138, 243, 0.5)";
      } else {
        ctx.fillStyle = "rgba(33, 138, 243, 0.25)";
      }

      ctx.fillText(char, x, y);

      if (y > h && Math.random() > 0.985) {
        drops[i] = 0;
      }
      // Slowed down from 0.5 + Math.random() * 0.5
      drops[i] += 0.05 + Math.random() * 0.05;
    }

    animFrameRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 size-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

/* ── Data ── */
interface DifferenceCard {
  number: string;
  title: string;
  description: string;
}

const defaultCards: DifferenceCard[] = [
  {
    number: "01/",
    title: "Senior Talent, Not Junior Guesswork",
    description:
      "Our developers aren't learning on your project. They've shipped real products. You get engineers who have handled complexity before and know when to avoid it.",
  },
  {
    number: "02/",
    title: "Eastern European Quality At A Competitive Rate",
    description:
      "The myth is that you have to choose between quality and cost. Our team is based in Serbia, one of Europe's strongest engineering markets.",
  },
  {
    number: "03/",
    title: "Direct Communication, No Account Managers In Between",
    description:
      "You talk to the people actually building your product. No layers, no lost-in-translation briefs, no weekly status theater. Just a team that moves fast and communicates clearly.",
  },
  {
    number: "04/",
    title: "Small Team.\nFull Ownership.",
    description:
      "We don't take on more than we can deliver. Every project gets the attention it deserves. If we say we'll build it, we build it. On time, on scope.",
  },
];

const avatars = [
  imgAvatar1,
  imgAvatar2,
  imgAvatar3,
  imgAvatar4,
];

/* ── Decorative Background SVGs ── */
function IdeaDecoration() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-90">
      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.8; }
          }
          .animate-twinkle {
            animation: twinkle 3s ease-in-out infinite;
          }
          .animate-twinkle-delay-1 { animation-delay: 0.5s; animation-duration: 4s; }
          .animate-twinkle-delay-2 { animation-delay: 1.2s; animation-duration: 3.5s; }
          .animate-twinkle-delay-3 { animation-delay: 2.1s; animation-duration: 4.5s; }
          .animate-twinkle-delay-4 { animation-delay: 0.8s; animation-duration: 3.8s; }
          .animate-twinkle-delay-5 { animation-delay: 1.7s; animation-duration: 4.2s; }
        `}
      </style>
      {/* Group 15 - top left */}
      <div
        className="absolute"
        style={{ inset: "9.91% 77.01% 77.95% 11.7%" }}
      >
        <svg
          className="absolute block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 162.562 151.86"
        >
          <g opacity="0.4">
            <path className="animate-twinkle animate-twinkle-delay-1" d={svgPaths.p12e94c80} fill="#0C1B3B" />
            <path className="animate-twinkle animate-twinkle-delay-2" d={svgPaths.p234a1180} fill="#0C1B3B" />
            <path className="animate-twinkle animate-twinkle-delay-3" d={svgPaths.p29782d00} fill="#0C1B3B" />
            <path className="animate-twinkle animate-twinkle-delay-4" d={svgPaths.p21c16780} fill="#0C1B3B" />
            <path className="animate-twinkle animate-twinkle-delay-5" d={svgPaths.p2c955b00} fill="#0C1B3B" />
          </g>
        </svg>
      </div>
      {/* Group 14 - center */}
      <div
        className="absolute"
        style={{ inset: "18.23% 41.81% 69.64% 46.9%" }}
      >
        <svg
          className="absolute block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 162.579 151.841"
        >
          <g opacity="0.2">
            <path className="animate-twinkle animate-twinkle-delay-3" d={svgPaths.p29247900} fill="#0C1B3B" />
            <path className="animate-twinkle animate-twinkle-delay-1" d={svgPaths.p11082b80} fill="#0C1B3B" />
            <path className="animate-twinkle animate-twinkle-delay-5" d={svgPaths.p32b3a200} fill="#0C1B3B" />
            <path className="animate-twinkle animate-twinkle-delay-2" d={svgPaths.p173cc9c0} fill="#0C1B3B" />
            <path className="animate-twinkle animate-twinkle-delay-4" d={svgPaths.p16e05a80} fill="#0C1B3B" />
          </g>
        </svg>
      </div>
      {/* Code - right */}
      <div
        className="absolute"
        style={{ inset: "4% 17.78% 77.51% 65.02%" }}
      >
        <svg
          className="absolute block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 247.743 231.367"
        >
          <g opacity="0.2">
            <path className="animate-twinkle animate-twinkle-delay-5" d={svgPaths.p28e3a300} fill="#0C1B3B" />
            <path className="animate-twinkle animate-twinkle-delay-2" d={svgPaths.p1fe6a00} fill="#0C1B3B" />
            <path className="animate-twinkle animate-twinkle-delay-4" d={svgPaths.paea2480} fill="#0C1B3B" />
            <path className="animate-twinkle animate-twinkle-delay-1" d={svgPaths.p3e2a3500} fill="#0C1B3B" />
            <path className="animate-twinkle animate-twinkle-delay-3" d={svgPaths.p3c22fc00} fill="#0C1B3B" />
          </g>
        </svg>
      </div>
    </div>
  );
}

/* ── Avatar Stack ── */
function AvatarStack() {
  return (
    <div className="flex items-start pr-[10px]">
      {avatars.map((src, i) => (
        <div
          key={i}
          className="mr-[-10px] relative rounded-full shrink-0 size-[44px]"
        >
          <Image
            alt=""
            src={src}
            fill
            sizes="44px"
            placeholder="blur"
            className="object-cover rounded-full"
          />
          <div
            aria-hidden="true"
            className="absolute border border-solid border-white/20 inset-0 rounded-full"
          />
        </div>
      ))}
    </div>
  );
}

/* ── Arrow Up Right Icon ── */
function ArrowUpRight({
  color = "#0C1B3B",
  size = 20,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <div
      className="overflow-clip relative shrink-0"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute"
        style={{ inset: "21.88% 21.87% 21.87% 21.87%" }}
      >
        <svg
          className="absolute block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 11.2503 11.2503"
        >
          <path d={svgPaths.p2ad31880} fill={color} />
        </svg>
      </div>
    </div>
  );
}

function ArrowUpRightSmall({ color = "rgba(231,231,231,0.8)" }: { color?: string }) {
  return (
    <div className="opacity-60 overflow-clip relative shrink-0 size-[14px]">
      <div
        className="absolute"
        style={{ inset: "21.88% 21.87% 21.87% 21.87%" }}
      >
        <svg
          className="absolute block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 7.87524 7.87524"
        >
          <path
            d={svgPaths.p7869180}
            fill={color}
          />
        </svg>
      </div>
    </div>
  );
}

/* ── Heading Section ── */
function Heading({ onConsultationClick, label = "OUR DIFFERENCE", title = "Why Teams Choose Scalara Labs", description = "Engineers with deep experience in FinTech and security. Clean, scalable, and well-tested code by default.", ctaText = "Meet your new team" }: { onConsultationClick?: () => void; label?: string; title?: string; description?: string; ctaText?: string }) {
  return (
    <ScrollReveal direction="up" distance={25} className="flex flex-col items-center justify-center w-full relative z-10">
      <div className="flex flex-col gap-[10px] items-center justify-center pt-[26px] px-[26px] w-full max-md:px-0">
        <p className="font-['Manrope',sans-serif] font-extrabold text-[16px] leading-[1.8] text-[#218af3] text-center tracking-[1.28px] uppercase w-full">
          {label}
        </p>
        <p className="font-['Manrope',sans-serif] font-semibold text-[46px] leading-[1.2] text-white text-center tracking-[-1.38px] w-full max-md:text-[32px]">
          {title}
        </p>
        <p className="font-['Manrope',sans-serif] font-normal text-[15px] leading-[1.8] text-[#8899B4] text-center max-w-[400px] w-full">
          {description}
        </p>

        {/* CTA with avatars */}
        <div className="flex gap-[26px] items-center justify-center max-w-[600px] overflow-clip pt-[26px] w-full flex-wrap max-sm:gap-[16px]">
          <AvatarStack />
          <Link
            href="/about-us"
            className="flex gap-[8px] items-center justify-center rounded-[16px] cursor-pointer group"
          >
            <span className="font-['Manrope',sans-serif] font-normal text-[15px] leading-[0.95] text-[#C8D4E6] text-center whitespace-nowrap group-hover:text-[#218af3] transition-colors">
              {ctaText}
            </span>
            <ArrowUpRight color="#C8D4E6" />
          </Link>
        </div>
      </div>
    </ScrollReveal>
  );
}

/* ── Card Illustration Boxes ── */
function CardIllustration({ index }: { index: number }) {
  const gradients = [
    "radial-gradient(ellipse at 30% 40%, rgba(30, 80, 160, 0.4) 0%, transparent 60%)",
    "radial-gradient(ellipse at 50% 25%, rgba(30, 80, 160, 0.35) 0%, transparent 60%)",
    "radial-gradient(ellipse at 65% 80%, rgba(30, 80, 160, 0.35) 0%, transparent 60%)",
    "radial-gradient(ellipse at 35% 30%, rgba(30, 80, 160, 0.35) 0%, transparent 60%)",
  ];

  return (
    <div className="wc-diff-card__illus relative w-full h-[230px] overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-[#0a162c]" />
      <div className="absolute inset-0" style={{ background: gradients[index] }} />

      {index === 0 && (
        <>
          <img src={imgDiff01Code.src} alt="" className="absolute pointer-events-none wc-diff-drift-x wc-diff-anim-d1" style={{ left: "25.4%", top: "95px", width: "20.16%" }} />
          <div className="absolute pointer-events-none wc-diff-drift-diag wc-diff-anim-d2" style={{ left: "49.16%", top: "123px", width: "31.58%" }}>
            <img src={imgDiff01CircuitGroup.src} alt="" className="w-full" style={{ opacity: 0.8 }} />
            <img src={imgDiff01CircuitRec.src} alt="" className="absolute" style={{ left: "32.16%", top: "14.5px", width: "3.52%", height: "30px" }} />
            <img src={imgDiff01CircuitVer.src} alt="" className="absolute" style={{ left: "0", top: "47px", width: "30.66%", height: "3.5px" }} />
            <img src={imgDiff01CircuitBottom.src} alt="" className="absolute" style={{ left: "3%", top: "50px", width: "32.91%", height: "55px" }} />
          </div>
          <img src={imgDiff01Phone.src} alt="" className="absolute pointer-events-none wc-diff-float-y" style={{ left: "31.25%", top: "47px", width: "28.6%" }} />
        </>
      )}

      {index === 1 && (
        <>
          <div className="absolute inset-0 overflow-hidden opacity-40" style={{ WebkitMaskImage: `url(${imgDiff02EuropeMask.src})`, maskImage: `url(${imgDiff02EuropeMask.src})`, WebkitMaskSize: "90% auto", maskSize: "90% auto", WebkitMaskPosition: "center", maskPosition: "center", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" }}>
            <img src={imgDiff02Europe.src} alt="" className="w-[90%] h-auto" />
          </div>
          <img src={imgDiff02Code.src} alt="" className="absolute pointer-events-none wc-diff-drift-x wc-diff-anim-d1" style={{ left: "26.83%", top: "107px", width: "20.11%" }} />
          <img src={imgDiff02Premium.src} alt="" className="absolute pointer-events-none wc-diff-float-y" style={{ left: "34.71%", top: "55px", width: "29.87%" }} />
        </>
      )}

      {index === 2 && (
        <>
          <img src={imgDiff03Code.src} alt="" className="absolute pointer-events-none wc-diff-drift-x wc-diff-anim-d3" style={{ left: "18.73%", top: "111px", width: "20.13%" }} />
          <img src={imgDiff03Flash.src} alt="" className="absolute pointer-events-none wc-diff-float-y" style={{ left: "44.92%", top: "50px", width: "25.18%" }} />
          <img src={imgDiff03Bubble.src} alt="" className="absolute pointer-events-none wc-diff-drift-diag wc-diff-anim-d1" style={{ left: "25.4%", top: "55px", width: "35.07%" }} />
          <img src={imgDiff03Bubble2.src} alt="" className="absolute pointer-events-none wc-diff-drift-diag wc-diff-anim-d2" style={{ left: "46.33%", top: "129px", width: "25.64%" }} />
        </>
      )}

      {index === 3 && (
        <>
          <img src={imgDiff04Code.src} alt="" className="absolute pointer-events-none wc-diff-drift-x wc-diff-anim-d1" style={{ left: "18.09%", top: "140px", width: "20.15%" }} />
          <div className="absolute pointer-events-none wc-diff-drift-diag wc-diff-anim-d2" style={{ left: "55.71%", top: "49px", width: "31.91%" }}>
            <img src={imgDiff04CircuitGroup.src} alt="" className="w-full" style={{ opacity: 0.8 }} />
            <img src={imgDiff04CircuitRec.src} alt="" className="absolute" style={{ left: "32.84%", top: "14.5px", width: "3.48%", height: "31px" }} />
            <img src={imgDiff04CircuitVer.src} alt="" className="absolute" style={{ left: "0", top: "6.5px", width: "30.35%", height: "3.5px" }} />
          </div>
          <img src={imgDiff04Puzzle.src} alt="" className="absolute pointer-events-none wc-diff-float-y" style={{ left: "28.8%", top: "58px", width: "39.56%" }} />
        </>
      )}
    </div>
  );
}

/* ── Difference Card ── */
function DifferenceCardComponent({
  card,
  index,
}: {
  card: DifferenceCard;
  index: number;
}) {
  return (
    <div className="wc-diff-card flex flex-col gap-[34px] items-start min-w-0 relative">
      <p className="font-['Manrope',sans-serif] font-semibold text-[20px] capitalize tracking-[-0.4px] w-full text-[#218af3] leading-[1.8]">
        {card.number}
      </p>
      <CardIllustration index={index} />
      <div className="flex flex-col gap-[20px] items-start w-full">
        <p className="font-['Manrope',sans-serif] font-semibold text-[20px] capitalize tracking-[-0.4px] w-full whitespace-pre-line text-[#E8ECF4]">
          {card.title}
        </p>
        <p className="font-['Manrope',sans-serif] font-normal text-[15px] text-[#8899B4] w-full leading-[1.8]">
          {card.description}
        </p>
      </div>
    </div>
  );
}

/* ── Cards Row ── */
function CardsRow({ cards }: { cards?: DifferenceCard[] }) {
  const displayCards = cards ?? defaultCards;

  return (
    <div className="flex gap-[34px] items-start w-full relative z-10 leading-[1.8] max-lg:grid max-lg:grid-cols-2 max-sm:grid-cols-1 max-lg:gap-[34px]">
      <style>
        {`
          /* Card hover lift */
          .wc-diff-card {
            transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
          }
          .wc-diff-card:hover {
            transform: translateY(-4px);
          }
          .wc-diff-card__illus {
            transition: box-shadow 0.25s cubic-bezier(0.25, 1, 0.5, 1);
          }
          .wc-diff-card:hover .wc-diff-card__illus {
            box-shadow: 0 4px 24px rgba(33, 138, 243, 0.12);
          }

          /* Floating / drift keyframes */
          @keyframes wc-diff-float-y {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
          @keyframes wc-diff-drift-x {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(4px); }
          }
          @keyframes wc-diff-drift-diag {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-3px, 4px); }
          }
          .wc-diff-float-y {
            animation: wc-diff-float-y 6s ease-in-out infinite;
          }
          .wc-diff-drift-x {
            animation: wc-diff-drift-x 8s ease-in-out infinite;
          }
          .wc-diff-drift-diag {
            animation: wc-diff-drift-diag 7s ease-in-out infinite;
          }
          .wc-diff-anim-d1 { animation-delay: -2s; }
          .wc-diff-anim-d2 { animation-delay: -4s; }
          .wc-diff-anim-d3 { animation-delay: -6s; }

          @media (prefers-reduced-motion: reduce) {
            .wc-diff-card,
            .wc-diff-card__illus {
              transition: none;
            }
            .wc-diff-card:hover {
              transform: none;
            }
            .wc-diff-card:hover .wc-diff-card__illus {
              box-shadow: none;
            }
            .wc-diff-float-y,
            .wc-diff-drift-x,
            .wc-diff-drift-diag {
              animation: none;
            }
          }
        `}
      </style>
      {displayCards.map((card, i) => (
        <StaggerReveal key={card.number} index={i} direction="up" distance={30} staggerDelay={0.1} className="flex-1 min-w-0">
          <DifferenceCardComponent card={card} index={i} />
        </StaggerReveal>
      ))}
    </div>
  );
}

/* ── Bottom Hero Container ── */
function BottomHero({ onConsultationClick, prefixLight = "Our team's background goes beyond", prefixBold = "Standard Development", heading = "Working on Something More Complex?", description = "We have hands-on experience with Industrial IoT systems, Geospatial Information Systems, AI agent development, and fintech infrastructure. If your project involves real-time data, regulatory compliance, or high technical complexity, we\u2019d love to hear about it.", buttonText = "Tell us about your project" }: { onConsultationClick?: () => void; prefixLight?: string; prefixBold?: string; heading?: string; description?: string; buttonText?: string }) {
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <div
      className="relative rounded-[40px] shrink-0 w-full overflow-hidden z-10"
      style={{
        backgroundImage:
          'url(\'data:image/svg+xml;utf8,<svg viewBox="0 0 1360 415" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><rect x="0" y="0" height="100%" width="100%" fill="url(%23grad)" opacity="1"/><defs><radialGradient id="grad" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="10" gradientTransform="matrix(10.814 -37.084 58.552 7.0054 1167.8 370.84)"><stop stop-color="rgba(12,27,59,1)" offset="0"/><stop stop-color="rgba(6,14,30,0.5)" offset="0.5"/><stop stop-color="rgba(0,0,0,0)" offset="1"/></radialGradient></defs></svg>\'), url(\'data:image/svg+xml;utf8,<svg viewBox="0 0 1360 415" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><rect x="0" y="0" height="100%" width="100%" fill="url(%23grad)" opacity="1"/><defs><radialGradient id="grad" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="10" gradientTransform="matrix(16.244 20.75 -54.433 17.484 721.08 207.5)"><stop stop-color="rgba(12,27,59,1)" offset="0"/><stop stop-color="rgba(6,14,30,0.5)" offset="0.5"/><stop stop-color="rgba(0,0,0,0)" offset="1"/></radialGradient></defs></svg>\'), url(\'data:image/svg+xml;utf8,<svg viewBox="0 0 1360 415" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><rect x="0" y="0" height="100%" width="100%" fill="url(%23grad)" opacity="1"/><defs><radialGradient id="grad" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="10" gradientTransform="matrix(76.028 42.267 -138.51 78.067 123.25 -7.6655)"><stop stop-color="rgba(12,27,59,1)" offset="0"/><stop stop-color="rgba(6,14,30,0.5)" offset="0.5"/><stop stop-color="rgba(0,0,0,0)" offset="1"/></radialGradient></defs></svg>\'), linear-gradient(90deg, rgb(12, 27, 59) 0%, rgb(12, 27, 59) 100%)',
      }}
    >
      <div className="overflow-clip rounded-[inherit] size-full relative">
        {/* Gradient blurs */}
        <div
          className="absolute pointer-events-none"
          style={{
            height: 815,
            left: 446,
            top: -163,
            width: 1062,
          }}
        >
          <div
            className="absolute"
            style={{ inset: "-24.33% -22.88% -52.2% -22.88%" }}
          >
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 1548.08 1438.41"
            >
              <defs>
                <filter
                  colorInterpolationFilters="sRGB"
                  filterUnits="userSpaceOnUse"
                  height="916.116"
                  id="wc_f0"
                  width="797.485"
                  x="0"
                  y="266.955"
                >
                  <feFlood
                    floodOpacity="0"
                    result="BackgroundImageFix"
                  />
                  <feBlend
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    mode="normal"
                    result="shape"
                  />
                  <feGaussianBlur
                    result="effect1"
                    stdDeviation="121.519"
                  />
                </filter>
                <filter
                  colorInterpolationFilters="sRGB"
                  filterUnits="userSpaceOnUse"
                  height="982.847"
                  id="wc_f5"
                  width="823.435"
                  x="724.641"
                  y="232.502"
                >
                  <feFlood
                    floodOpacity="0"
                    result="BackgroundImageFix"
                  />
                  <feBlend
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    mode="normal"
                    result="shape"
                  />
                  <feGaussianBlur
                    result="effect1"
                    stdDeviation="121.519"
                  />
                </filter>
                <filter
                  colorInterpolationFilters="sRGB"
                  filterUnits="userSpaceOnUse"
                  height="1073.07"
                  id="wc_f3"
                  width="1128.68"
                  x="264.319"
                  y="365.341"
                >
                  <feFlood
                    floodOpacity="0"
                    result="BackgroundImageFix"
                  />
                  <feBlend
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    mode="normal"
                    result="shape"
                  />
                  <feGaussianBlur
                    result="effect1"
                    stdDeviation="212.658"
                  />
                </filter>
                <filter
                  colorInterpolationFilters="sRGB"
                  filterUnits="userSpaceOnUse"
                  height="809.433"
                  id="wc_f8"
                  width="1080.06"
                  x="174.974"
                  y="295.631"
                >
                  <feFlood
                    floodOpacity="0"
                    result="BackgroundImageFix"
                  />
                  <feBlend
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    mode="normal"
                    result="shape"
                  />
                  <feGaussianBlur
                    result="effect1"
                    stdDeviation="145.823"
                  />
                </filter>
              </defs>
              <g filter="url(#wc_f0)">
                <ellipse
                  cx="398.742"
                  cy="725.013"
                  fill="#1F4EA4"
                  fillOpacity="0.4"
                  rx="155.704"
                  ry="215.02"
                />
              </g>
              <g filter="url(#wc_f5)">
                <ellipse
                  cx="1136.36"
                  cy="723.926"
                  fill="#202B3D"
                  rx="168.68"
                  ry="248.385"
                />
              </g>
              <g filter="url(#wc_f3)">
                <ellipse
                  cx="828.657"
                  cy="901.875"
                  fill="#92B5F5"
                  rx="139.022"
                  ry="111.217"
                />
              </g>
              <g filter="url(#wc_f8)">
                <ellipse
                  cx="715.006"
                  cy="700.347"
                  fill="#0C1B3B"
                  rx="248.386"
                  ry="113.071"
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Hand image */}
        <div
          className="absolute pointer-events-none left-1/2 -translate-x-1/2 max-md:hidden"
          style={{
            height: 650,
            top: -120,
            width: 740,
            maxWidth: "80%",
          }}
        >
          <Image
            alt=""
            src={imgHand}
            fill
            sizes="(max-width: 767px) 0px, 740px"
            placeholder="blur"
            className="object-contain pointer-events-none"
          />
        </div>

        {/* Matrix rain animation */}
        <MatrixRain />

        {/* Content */}
        <div className="flex items-center justify-between p-[64px] relative size-full min-h-[415px] max-lg:flex-col max-lg:items-stretch max-lg:gap-[32px] max-md:p-[32px]">
          {/* Left content */}
          <div className="flex flex-1 flex-col gap-[34px] items-start justify-center max-w-[500px] min-w-0 pt-[20px] relative z-10">
            <div className="w-full">
              <p className="text-[15px]">
                <span className="font-['Manrope',sans-serif] font-light leading-[1.2] text-[#C8D4E6] capitalize">
                  {prefixLight}
                </span>
                <span className="font-['Manrope',sans-serif] font-bold leading-[1.2]">
                  {" "}
                </span>
                <span className="font-['Manrope',sans-serif] font-semibold leading-[1.2] text-[#C8D4E6] tracking-[1.8px] uppercase">
                  {prefixBold}
                </span>
              </p>
            </div>
            <div className="w-full">
              <p className="font-['Results_Letter',serif] font-thin not-italic text-[46px] leading-[1.2] text-white max-w-[500px] w-full max-md:text-[32px]">
                {heading}
              </p>
            </div>
          </div>

          {/* Right content */}
          <div className="flex flex-1 flex-col gap-[34px] items-start justify-center max-w-[480px] min-w-0 pt-[20px] relative z-10 max-lg:max-w-[500px] max-lg:pt-0">
            <p className="font-['Manrope',sans-serif] font-normal text-[14px] leading-[1.8] text-[#8899B4] max-w-[690px] min-w-full w-min">
              {description}
            </p>
            <button
              type="button"
              onClick={onConsultationClick}
              className="bg-white flex gap-[6px] items-center justify-center overflow-clip px-[24px] py-[14px] rounded-[999px] shrink-0 cursor-pointer transition-all duration-300 hover:bg-[#f0f0f0] active:scale-[0.97]"
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              style={{
                transform: btnHovered
                  ? "translateY(-1px)"
                  : "translateY(0)",
              }}
            >
              <span className="font-['Manrope',sans-serif] font-medium text-[10px] leading-[1.4] text-center text-[#0c1b3b] tracking-[0.8px] uppercase whitespace-nowrap">
                {buttonText}
              </span>
              <ArrowUpRightSmall color="#0c1b3b" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Export ── */
interface WhyChooseSectionProps {
  onConsultationClick?: () => void;
  label?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  cards?: DifferenceCard[];
  bottomHeroPrefixLight?: string;
  bottomHeroPrefixBold?: string;
  bottomHeroHeading?: string;
  bottomHeroDescription?: string;
  bottomHeroButtonText?: string;
}

export function WhyChooseSection({ onConsultationClick, label, title, description, ctaText, cards, bottomHeroPrefixLight, bottomHeroPrefixBold, bottomHeroHeading, bottomHeroDescription, bottomHeroButtonText }: WhyChooseSectionProps) {
  return (
    <section className="relative w-full">
      <div className="flex flex-col gap-[80px] items-center justify-center px-[40px] py-[56px] relative max-md:px-[20px] max-md:gap-[48px] max-w-[1440px] mx-auto">
        <IdeaDecoration />
        <Heading onConsultationClick={onConsultationClick} label={label} title={title} description={description} ctaText={ctaText} />
        <CardsRow cards={cards} />
        <ScrollReveal direction="up" distance={35} className="w-full">
          <BottomHero onConsultationClick={onConsultationClick} prefixLight={bottomHeroPrefixLight} prefixBold={bottomHeroPrefixBold} heading={bottomHeroHeading} description={bottomHeroDescription} buttonText={bottomHeroButtonText} />
        </ScrollReveal>
      </div>
    </section>
  );
}