"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { X, Send, CheckCircle, Phone } from "lucide-react";
import { CountryCodeSelect } from "./country-code-select";
import { getCountryByCode } from "@/data/countries";

/* ── Service metadata for modal context ── */
const serviceInfo: Record<string, { label: string; heading: string; subtitle: string }> = {
  web: {
    label: "Web Development",
    heading: "Let's build your web platform",
    subtitle: "Tell us about the web application you're envisioning and we'll map out the fastest path to launch.",
  },
  mobile: {
    label: "Mobile App Development",
    heading: "Let's build your mobile app",
    subtitle: "Share your mobile app idea and we'll help you ship a polished product on iOS, Android, or both.",
  },
  custom: {
    label: "Custom Software Development",
    heading: "Let's build your custom solution",
    subtitle: "Describe the workflows and challenges you need to solve, and we'll design software around them.",
  },
  saas: {
    label: "SaaS Development",
    heading: "Let's launch your SaaS product",
    subtitle: "Tell us about your SaaS vision and we'll architect a platform built for scale from day one.",
  },
  engineering: {
    label: "Dedicated Engineering Support",
    heading: "Let's extend your engineering team",
    subtitle: "Describe the skills and capacity you need, and we'll match you with senior engineers fast.",
  },
  ecommerce: {
    label: "Ecommerce Development",
    heading: "Let's launch your online store",
    subtitle: "Share your ecommerce goals and we'll build a storefront designed to convert.",
  },
};

const SERVICE_KEYS = ["web", "mobile", "custom", "saas", "engineering", "ecommerce"];

interface ConsultationModalProps {
  open: boolean;
  onClose: () => void;
  selectedService?: string | null;
  consultationServices?: { label: string; heading: string; subtitle: string }[];
}

export function ConsultationModal({ open, onClose, selectedService, consultationServices }: ConsultationModalProps) {
  const resolvedServiceInfo = useMemo(() => {
    if (!consultationServices || consultationServices.length === 0) return serviceInfo;
    const cmsMap: Record<string, { label: string; heading: string; subtitle: string }> = {};
    consultationServices.forEach((svc, i) => {
      const key = SERVICE_KEYS[i];
      if (key) cmsMap[key] = svc;
    });
    return { ...serviceInfo, ...cmsMap };
  }, [consultationServices]);

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [countryCode, setCountryCode] = useState("US");
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", phone: "", message: "" });
        setCountryCode("US");
      }, 300);
    }
  }, [open]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            ...formData,
            phone: formData.phone
              ? `${getCountryByCode(countryCode)?.dialCode ?? ""} ${formData.phone}`
              : "",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting lead:", error);
      setErrorMsg("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  if (!open) return null;

  const info = selectedService && resolvedServiceInfo[selectedService] ? resolvedServiceInfo[selectedService] : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out] pointer-events-none" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-[#0a162c] border border-white/10 rounded-[24px] w-full max-w-[560px] max-h-[85dvh] overflow-y-auto shadow-2xl shadow-black/50 animate-[slideUp_0.3s_ease-out]"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-[32px] pt-[32px] pb-[16px] max-sm:px-[20px] max-sm:pt-[24px]">
          <div className="flex flex-col gap-[6px]">
            <p className="font-['Manrope',sans-serif] font-extrabold text-[12px] leading-[1.8] text-[#218af3] tracking-[1.28px] uppercase">
              {info ? info.label : "Free Consultation"}
            </p>
            <p className="font-['Results_Letter',serif] not-italic text-[28px] leading-[1.3] text-white max-sm:text-[22px]">
              {info ? info.heading : "Let's build something great"}
            </p>
            {info && (
              <p className="font-['Manrope',sans-serif] font-normal text-[14px] leading-[1.6] text-white/50 mt-[2px]">
                {info.subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center size-[40px] rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer shrink-0 ml-[16px] mt-[4px]"
            aria-label="Close modal"
          >
            <X className="size-[18px] text-white/60" />
          </button>
        </div>

        <div className="px-[32px] pb-[32px] max-sm:px-[16px] max-sm:pb-[16px]">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-[16px] max-sm:gap-[10px] mt-[8px]">
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-[12px] p-[12px] text-[13px] text-red-400 font-['Manrope',sans-serif]">
                  {errorMsg}
                </div>
              )}
              {/* Name & Email row */}
              <div className="flex gap-[12px] max-sm:flex-col">
                <div className="flex flex-col gap-[6px] flex-1">
                  <label className="font-['Manrope',sans-serif] font-medium text-[12px] text-white/60 tracking-[0.5px] uppercase">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    className="bg-white/5 border border-white/10 rounded-[12px] px-[16px] py-[12px] text-[15px] text-white font-['Manrope',sans-serif] placeholder:text-white/25 focus:outline-none focus:border-[#218af3]/50 focus:bg-white/[0.07] transition-all"
                  />
                </div>
                <div className="flex flex-col gap-[6px] flex-1">
                  <label className="font-['Manrope',sans-serif] font-medium text-[12px] text-white/60 tracking-[0.5px] uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@company.com"
                    className="bg-white/5 border border-white/10 rounded-[12px] px-[16px] py-[12px] text-[15px] text-white font-['Manrope',sans-serif] placeholder:text-white/25 focus:outline-none focus:border-[#218af3]/50 focus:bg-white/[0.07] transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-[6px]">
                <label className="font-['Manrope',sans-serif] font-medium text-[12px] text-white/60 tracking-[0.5px] uppercase">
                  Phone
                </label>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-[12px] overflow-hidden focus-within:border-[#218af3]/50 focus-within:bg-white/[0.07] transition-all">
                  {/* Country code selector */}
                  <CountryCodeSelect value={countryCode} onChange={setCountryCode} />
                  {/* Phone icon */}
                  <div className="shrink-0 pl-[12px]">
                    <Phone className="size-[18px] text-white/40" />
                  </div>
                  {/* Phone input */}
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="xxx xxx xxxx"
                    className="flex-1 bg-transparent px-[12px] py-[12px] text-[15px] text-white font-['Manrope',sans-serif] placeholder:text-white/25 focus:outline-none"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-[6px]">
                <label className="font-['Manrope',sans-serif] font-medium text-[12px] text-white/60 tracking-[0.5px] uppercase">
                  Tell us about your project
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Brief description of what you'd like to build..."
                  rows={4}
                  className="bg-white/5 border border-white/10 rounded-[12px] px-[16px] py-[12px] text-[15px] text-white font-['Manrope',sans-serif] placeholder:text-white/25 focus:outline-none focus:border-[#218af3]/50 focus:bg-white/[0.07] transition-all resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex gap-[8px] items-center justify-center bg-white px-[24px] py-[14px] rounded-[999px] mt-[8px] cursor-pointer transition-all duration-300 hover:bg-[#f0f0f0] hover:shadow-lg hover:shadow-white/10 hover:-translate-y-[1px] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-['Manrope',sans-serif] font-medium text-[12px] text-[#0c1b3b] tracking-[0.8px] uppercase">
                  {isSubmitting ? 'Sending...' : 'Send Request'}
                </span>
                {!isSubmitting && <Send className="size-[14px] text-[#0c1b3b] opacity-60" />}
              </button>
            </form>
          ) : (
            /* Success state */
            <div className="flex flex-col items-center gap-[20px] py-[40px] text-center">
              <div className="flex items-center justify-center size-[64px] rounded-full bg-[#218af3]/15">
                <CheckCircle className="size-[32px] text-[#218af3]" />
              </div>
              <div className="flex flex-col gap-[8px]">
                <p className="font-['Manrope',sans-serif] font-semibold text-[20px] text-white">
                  Request Received!
                </p>
                <p className="font-['Manrope',sans-serif] font-normal text-[15px] text-white/60 leading-[1.6] max-w-[360px]">
                  Thank you for reaching out. Our team will review your project details and get back to you within 24 hours.
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center bg-white/10 px-[24px] py-[12px] rounded-[999px] mt-[8px] cursor-pointer transition-all duration-300 hover:bg-white/15"
              >
                <span className="font-['Manrope',sans-serif] font-medium text-[12px] text-white tracking-[0.8px] uppercase">
                  Close
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}