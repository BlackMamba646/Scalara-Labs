import Image, { type StaticImageData } from "next/image";
import svgPaths from "@/imports/svg-k0m03y63qi";
import { ScrollReveal, StaggerReveal } from "./scroll-reveal";
import imgMember1 from "@/assets/images/home-team-member-1.png";
import imgMember2 from "@/assets/images/home-team-member-2.png";
import imgMember3 from "@/assets/images/home-team-member-3.png";
import imgMember4 from "@/assets/images/home-team-member-4.png";

/* ── Data ── */
interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: StaticImageData;
  isLead?: boolean;
}

const members: TeamMember[] = [
  {
    name: "Hassan",
    role: "Founder",
    description:
      "React & Node.js expert. Built multiple SaaS MVPs from 0 to 1.",
    image: imgMember3,
  },
  {
    name: "Kris Stigmerkukic",
    role: "CEO",
    description:
      "12+ years in fintech. Previously designed low-latency trading systems.",
    image: imgMember1,
    isLead: true,
  },
  {
    name: "Marko V.",
    role: "COO",
    description:
      "Specialist in Python & Go. Contributor to major open source DB projects.",
    image: imgMember2,
  },
  {
    name: "Hussain",
    role: "CCO",
    description:
      "Swift & Kotlin native specialist. Focused on smooth animations and UX.",
    image: imgMember4,
  },
];

/* ── LinkedIn Icon ── */
function LinkedInIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[18px]">
      <div className="absolute inset-[0.09%_0]">
        <svg
          className="absolute block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 18 17.9691"
        >
          <path
            d={svgPaths.p36a7d600}
            fill="rgba(231,231,231,0.8)"
            fillOpacity="0.8"
          />
          <path d={svgPaths.p863d800} fill="white" />
          <path d={svgPaths.p215c700} fill="white" />
        </svg>
      </div>
    </div>
  );
}

/* ── Member Card ── */
function MemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex flex-1 flex-col gap-[16px] items-start justify-center min-w-0 overflow-clip relative">
      {/* Background decorative shape */}
      <div className="absolute h-[260px] left-[19px] top-0 w-[calc(100%-19px)]">
        <svg
          className="absolute block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 285.5 260"
        >
          <path
            d={svgPaths.pe972700}
            fill="rgba(231,231,231,0.8)"
            fillOpacity="0.08"
          />
        </svg>
      </div>

      {/* Image */}
      <div className="h-[260px] relative rounded-[16px] shrink-0 w-full">
        <Image
          alt={member.name}
          src={member.image}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
          placeholder="blur"
          className="object-contain pointer-events-none rounded-[16px]"
        />
        <div className="flex flex-col items-end justify-end overflow-clip rounded-[inherit] size-full">
          <div className="flex flex-col gap-[10px] items-end justify-end p-[10px] relative size-full">
            {/* Lead tag */}
            {member.isLead && (
              <div className="flex flex-1 flex-col items-start min-w-0 w-full">
                <div className="bg-[#f6f6f6] flex items-center justify-center px-[12px] py-[8px] rounded-[12px] shrink-0 relative">
                  <div
                    aria-hidden="true"
                    className="absolute border border-[rgba(231,231,231,0.8)] border-solid inset-0 pointer-events-none rounded-[12px]"
                  />
                  <p className="font-['Manrope',sans-serif] leading-[1.1] text-[#1f2228] text-[12px]">
                    Lead
                  </p>
                </div>
              </div>
            )}
            {/* LinkedIn button */}
            <div className="bg-[#0c1b3b] flex items-center justify-center p-[12px] rounded-full shrink-0 cursor-pointer hover:bg-[#162d5a] transition-colors">
              <LinkedInIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-[4px] items-start shrink-0 w-full">
        <p className="font-['Manrope',sans-serif] font-bold text-[16px] tracking-[-0.32px] uppercase text-white w-full">
          {member.name}
        </p>
        <p className="font-['Manrope',sans-serif] text-[12px] leading-[2] text-[#218af3] w-full">
          {member.role}
        </p>
        <p className="font-['Manrope',sans-serif] text-[12px] leading-[2] text-[#8899B4] max-w-[260px] w-full">
          {member.description}
        </p>
      </div>
    </div>
  );
}

/* ── Main Export ── */
export function TeamSection() {
  return (
    <section className="relative w-full">
      <div className="flex flex-col gap-[40px] items-center px-[40px] py-[56px] relative max-md:px-[20px]">
        {/* Heading */}
        <ScrollReveal direction="up" distance={25} className="shrink-0 w-full z-[2]">
          <div className="flex flex-col gap-[10px] items-start">
            <p className="font-['Manrope',sans-serif] text-[40px] leading-[1.4] tracking-[-1.2px] text-white max-md:text-[28px]">
              The People Building Your Product
            </p>
            <p className="font-['Manrope',sans-serif] text-[15px] leading-[1.8] text-[#8899B4]">Meet the engineers behind Scalara Labs.</p>
          </div>
        </ScrollReveal>

        {/* Cards grid */}
        <div className="flex gap-[16px] items-start w-full z-[1] max-lg:grid max-lg:grid-cols-2 max-sm:grid-cols-1">
          {members.map((member, i) => (
            <StaggerReveal key={member.name} index={i} direction="up" distance={30} staggerDelay={0.12} className="flex-1 min-w-0">
              <MemberCard member={member} />
            </StaggerReveal>
          ))}
        </div>
      </div>
    </section>
  );
}