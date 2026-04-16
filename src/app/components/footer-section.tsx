import svgPaths from "@/imports/svg-l143mj227g";
import { ScrollReveal } from "./scroll-reveal";

/* ── Logo ── */
function Logo() {
  return (
    <div className="h-[46px] relative shrink-0 w-[163px]">
      {/* SCALARA text */}
      <div className="absolute inset-[23.56%_0_44.73%_30.99%]">
        <svg
          className="absolute block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 112.488 14.5854"
        >
          <path d={svgPaths.p3bff5200} fill="#C8D4E6" />
          <path d={svgPaths.p33ef6880} fill="#C8D4E6" />
          <path d={svgPaths.p37b2b380} fill="#C8D4E6" />
          <path d={svgPaths.p3b868f30} fill="#C8D4E6" />
          <path d={svgPaths.p3b13500} fill="#C8D4E6" />
          <path d={svgPaths.p1961a00} fill="#C8D4E6" />
          <path d={svgPaths.p3c95e480} fill="#C8D4E6" />
        </svg>
      </div>
      {/* Logo icon */}
      <div className="absolute inset-[0_73.96%_0_0]">
        <svg
          className="absolute block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 42.4533 46.0002"
        >
          <path d={svgPaths.p2267fe00} fill="#033076" />
          <path d={svgPaths.p26453700} fill="#7BD2FF" />
          <path d={svgPaths.pf9008c0} fill="#41AFFD" />
          <path d={svgPaths.p1bdbd080} fill="#218AF3" />
          <path d={svgPaths.p11ee9c00} fill="#75D0FD" />
          <path d={svgPaths.p23096400} fill="#2284F1" />
          <path d={svgPaths.p18cf4bc0} fill="#0D59C7" />
          <path d={svgPaths.p66dfa80} fill="#319FFE" />
          <path d={svgPaths.p21b30d80} fill="#0752AD" />
          <path d={svgPaths.p2289c900} fill="#1872E4" />
        </svg>
      </div>
      {/* LABS text */}
      <div className="absolute inset-[67.99%_49.42%_18.27%_31.03%]">
        <svg
          className="absolute block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 31.8688 6.32124"
        >
          <path d={svgPaths.p302e8700} fill="#3AA4FA" />
          <path d={svgPaths.p3f322e00} fill="#3AA4FA" />
          <path d={svgPaths.p27388480} fill="#3AA4FA" />
          <path d={svgPaths.p7e31500} fill="#3AA4FA" />
        </svg>
      </div>
    </div>
  );
}

/* ── Social Icons ── */
function SocialIcons() {
  const iconFill = "#8899B4";
  return (
    <div className="flex items-start shrink-0">
      {/* Instagram */}
      <a href="https://www.instagram.com/scalaralabs" target="_blank" rel="noopener noreferrer" className="flex items-center p-[10px] rounded-full shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
        <div className="relative shrink-0 size-[14px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
            <path d={svgPaths.p22c01180} fill={iconFill} />
          </svg>
          <div className="absolute inset-[24.32%_24.29%_24.3%_24.33%]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.19421 7.19283">
              <path d={svgPaths.paa3780} fill={iconFill} />
            </svg>
          </div>
          <div className="absolute inset-[17.31%_17.27%_70.7%_70.73%]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.6793 1.67919">
              <path d={svgPaths.p111f800} fill={iconFill} />
            </svg>
          </div>
        </div>
      </a>
      {/* LinkedIn */}
      <a href="https://www.linkedin.com/company/scalara-labs/" target="_blank" rel="noopener noreferrer" className="flex items-center p-[10px] rounded-full shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
        <div className="overflow-clip relative shrink-0 size-[14px]">
          <div className="absolute inset-[0.09%_0]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 13.9761">
              <path d={svgPaths.p146e8d80} fill={iconFill} />
              <path d={svgPaths.p116cb900} fill={iconFill} />
              <path d={svgPaths.p38279040} fill={iconFill} />
            </svg>
          </div>
        </div>
      </a>
    </div>
  );
}

/* ── Arrow Icon ── */
function ArrowUpRight() {
  return (
    <div className="opacity-60 overflow-clip relative shrink-0 size-[14px]">
      <div className="absolute inset-[21.88%_21.87%_21.87%_21.87%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.87524 7.87524">
          <path d={svgPaths.p7869180} fill="#E7E7E7" fillOpacity="0.8" />
        </svg>
      </div>
    </div>
  );
}

/* ── Footer Link ── */
function FooterLink({ children, onClick, href, target }: { children: React.ReactNode, onClick?: () => void, href?: string, target?: string }) {
  const content = (
    <p className="font-['Manrope',sans-serif] leading-[1.8] opacity-60 text-[#C8D4E6] text-[14px] whitespace-nowrap group-hover:opacity-100 transition-opacity">
      {children}
    </p>
  );

  if (href) {
    return (
      <a href={href} target={target} className="flex gap-[4px] items-center shrink-0 cursor-pointer group">
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="flex gap-[4px] items-center shrink-0 cursor-pointer group bg-transparent border-none p-0">
      {content}
    </button>
  );
}

/* ── Main Export ── */
export function FooterSection({
  onConsultationClick,
  onServiceClick,
}: {
  onConsultationClick?: () => void;
  onServiceClick?: (service: string) => void;
}) {
  return (
    <footer className="flex flex-col items-center justify-center relative w-full bg-[#080E1B]">
      {/* Top border line */}
      <div className="w-full h-px bg-[rgba(136,153,180,0.15)]" />

      {/* Logo row */}
      <ScrollReveal direction="up" distance={20}>
        <div className="relative shrink-0 w-full">
          <div className="flex flex-row items-center size-full">
            <div className="flex items-center pt-[64px] px-[40px] relative w-full max-md:px-[20px] max-md:pt-[40px]">
              <Logo />
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Main content */}
      <ScrollReveal direction="up" distance={25} delay={0.1} className="relative shrink-0 w-full">
        <div className="flex flex-row justify-center size-full">
          <div className="flex gap-[10px] items-start justify-center px-[40px] relative w-full max-lg:flex-col max-lg:gap-[40px] max-md:px-[20px]">
            {/* Left column - description + socials */}
            <div className="flex flex-1 flex-col gap-[40px] items-start justify-center min-h-px min-w-0 pb-[34px] pt-[80px] relative max-lg:pt-[40px] max-lg:pb-[0px]">
              <p className="font-['Manrope',sans-serif] leading-[1.8] max-w-[400px] text-[#8899B4] text-[15px]">
                You get the technical depth of a top-tier agency with a team
                that's efficient and easy to work with.
              </p>
              <SocialIcons />
            </div>

            {/* Company column */}
            <div className="relative self-stretch shrink-0 max-lg:self-auto max-lg:w-full">
              <div className="flex flex-col gap-[26px] h-full items-start pb-[34px] pl-[20px] pr-[40px] pt-[64px] relative max-lg:pt-[0px] max-lg:pl-[0px] max-lg:pb-[0px]">
                <p className="font-['Manrope',sans-serif] font-bold leading-[1.8] text-[#8899B4] text-[12px] tracking-[1.68px] uppercase whitespace-nowrap">
                  Company
                </p>
                <div className="flex flex-col gap-[12px] items-start pb-[20px] shrink-0 w-full">
                  <FooterLink href="#why-choose">About Us</FooterLink>
                  <FooterLink href="#team">Team</FooterLink>
                  <FooterLink href="#contact">Contact</FooterLink>
                </div>
              </div>
            </div>

            {/* Services column */}
            <div className="relative self-stretch shrink-0 max-lg:self-auto max-lg:w-full">
              <div className="flex flex-col gap-[26px] h-full items-start pb-[34px] pl-[20px] pr-[40px] pt-[64px] relative max-lg:pt-[0px] max-lg:pl-[0px] max-lg:pb-[0px]">
                <p className="font-['Manrope',sans-serif] font-bold leading-[1.8] text-[#8899B4] text-[12px] tracking-[1.68px] uppercase whitespace-nowrap">
                  Services
                </p>
                <div className="flex flex-col gap-[12px] items-start pb-[20px] shrink-0 w-full">
                  <FooterLink onClick={() => onServiceClick?.('mobile')}>Mobile App Development</FooterLink>
                  <FooterLink onClick={() => onServiceClick?.('web')}>Web Development</FooterLink>
                  <FooterLink onClick={() => onServiceClick?.('custom')}>Web App Development</FooterLink>
                  <FooterLink onClick={() => onServiceClick?.('ecommerce')}>Ecommerce Development</FooterLink>
                  <FooterLink onClick={() => onServiceClick?.('saas')}>Platform Providing</FooterLink>
                  <FooterLink onClick={() => onServiceClick?.('engineering')}>Custom Casino Titles</FooterLink>
                </div>
              </div>
            </div>

            {/* Contact info column */}
            <div className="flex-1 max-w-[400px] min-h-px min-w-0 relative max-lg:max-w-none max-lg:w-full">
              <div className="flex flex-col justify-center max-w-[inherit] size-full">
                <div className="flex flex-col gap-[40px] items-start justify-center max-w-[inherit] pb-[40px] pt-[64px] px-[40px] relative w-full max-lg:pt-[0px] max-lg:px-[0px] max-lg:pb-[20px]">
                  <div className="flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full">
                    <p className="font-['Manrope',sans-serif] font-medium leading-[1.8] text-[#8899B4] text-[10px] tracking-[0.6px] uppercase w-full">+43 664 7940765</p>
                    <a href="mailto:contact@scalaralabs.com" className="font-['Manrope',sans-serif] leading-[1.2] text-white text-[26px] tracking-[-0.78px] w-full max-md:text-[20px] hover:text-[#218af3] transition-colors">contact@scalaralabs.com</a>
                  </div>
                  <button
                    type="button"
                    onClick={onConsultationClick}
                    className="bg-[#0c1b3b] flex gap-[6px] items-center justify-center overflow-clip px-[24px] py-[14px] rounded-[999px] shrink-0 cursor-pointer transition-all duration-300 hover:bg-[#162d5a] hover:-translate-y-[1px] active:scale-[0.97]"
                  >
                    <span className="font-['Manrope',sans-serif] font-medium leading-[1.4] text-[10px] text-center text-white tracking-[0.8px] uppercase whitespace-nowrap">
                      Connect With Us
                    </span>
                    <ArrowUpRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Bottom bar */}
      <div className="w-full h-px bg-[rgba(136,153,180,0.15)]" />
      <div className="relative shrink-0 w-full">
        <div className="flex flex-row items-center size-full">
          <div className="flex items-center justify-between px-[40px] py-[12px] relative w-full max-lg:flex-col max-lg:gap-[12px] max-lg:items-start max-md:px-[20px] max-md:py-[16px]">
            <p className="font-['Manrope',sans-serif] leading-[2] opacity-80 text-[#8899B4] text-[12px] whitespace-nowrap">
              © 2026 - Scalara Labs. All Rights Reserved.
            </p>
            <div className="flex gap-[24px] items-center shrink-0 max-lg:flex-col max-lg:items-start max-lg:gap-[12px]">
              <div className="flex gap-[16px] items-start lg:border-r lg:border-[rgba(136,153,180,0.3)] lg:pr-[24px] max-sm:flex-wrap max-sm:gap-[8px]">
                <FooterLink>Privacy Policy</FooterLink>
                <FooterLink>{`Terms & Conditions`}</FooterLink>
                <FooterLink>Cookie Policy</FooterLink>
              </div>
              <div className="flex gap-[12px] items-center">
                <p className="font-['Manrope',sans-serif] leading-[2] opacity-80 text-[#8899B4] text-[12px] whitespace-nowrap">
                  As seen on
                </p>
                <div className="flex gap-[16px] items-center opacity-80 pl-2">
                  <img src="/assets/clutchco.svg" alt="Clutch" className="h-[18px] opacity-70 brightness-0 invert" />
                  <img src="/assets/upwork.svg" alt="Upwork" className="h-[18px] opacity-70 brightness-0 invert" />
                  <img src="/assets/fiverr-2.svg" alt="Fiverr" className="h-[18px] opacity-70 brightness-0 invert" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}