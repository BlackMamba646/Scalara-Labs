"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search } from "lucide-react";
import { countries, getCountryByCode, getFlagUrl } from "@/data/countries";

interface CountryCodeSelectProps {
  value: string; // ISO country code
  onChange: (code: string) => void;
  triggerClassName?: string;
}

export function CountryCodeSelect({ value, onChange, triggerClassName }: CountryCodeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selected = getCountryByCode(value);

  const filtered = useMemo(() => {
    if (!search) return countries;
    const q = search.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [search]);

  // Calculate dropdown position from trigger's bounding rect
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 4,
      left: rect.left,
    });
  }, []);

  // Close on click outside (check both trigger and portal dropdown)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      )
        return;
      setIsOpen(false);
      setSearch("");
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearch("");
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  // Focus search and reposition on scroll/resize while open
  useEffect(() => {
    if (!isOpen) return;
    searchInputRef.current?.focus();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, updatePosition]);

  function handleSelect(code: string) {
    onChange(code);
    setIsOpen(false);
    setSearch("");
  }

  return (
    <>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (!isOpen) updatePosition();
          setIsOpen(!isOpen);
        }}
        className={triggerClassName ?? "flex items-center gap-[4px] shrink-0 h-full pl-[12px] pr-[8px] border-r border-white/10 cursor-pointer hover:bg-white/5 transition-colors"}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getFlagUrl(value)}
          alt={selected?.name ?? ""}
          width={20}
          height={15}
          className="shrink-0 rounded-[2px] object-cover"
        />
        <span className="font-['Manrope',sans-serif] font-normal text-[14px] text-white/60 whitespace-nowrap">
          {selected?.dialCode ?? "+1"}
        </span>
        <ChevronDown className="size-[14px] text-white/40 shrink-0" />
      </button>

      {/* Dropdown — portalled to body to escape overflow clipping */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
            className="fixed z-[200] w-[280px] max-h-[300px] bg-[#0f1f3d] border border-white/10 rounded-[12px] shadow-2xl shadow-black/60 flex flex-col overflow-hidden animate-[fadeIn_0.15s_ease-out]"
          >
            {/* Search */}
            <div className="flex items-center gap-[8px] px-[12px] py-[10px] border-b border-white/10">
              <Search className="size-[14px] text-white/30 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country..."
                className="flex-1 bg-transparent text-[13px] text-white font-['Manrope',sans-serif] placeholder:text-white/25 focus:outline-none"
              />
            </div>

            {/* List */}
            <div className="overflow-y-auto overscroll-contain flex-1">
              {filtered.length === 0 ? (
                <div className="px-[12px] py-[16px] text-center text-[13px] text-white/30 font-['Manrope',sans-serif]">
                  No countries found
                </div>
              ) : (
                filtered.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelect(country.code)}
                    className={`flex items-center gap-[10px] w-full px-[12px] py-[8px] text-left cursor-pointer transition-colors hover:bg-white/5 ${
                      country.code === value ? "bg-white/[0.07]" : ""
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getFlagUrl(country.code)}
                      alt=""
                      width={20}
                      height={15}
                      className="shrink-0 rounded-[2px] object-cover"
                    />
                    <span className="flex-1 text-[13px] text-white/80 font-['Manrope',sans-serif] truncate">
                      {country.name}
                    </span>
                    <span className="text-[13px] text-white/40 font-['Manrope',sans-serif] tabular-nums shrink-0">
                      {country.dialCode}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
