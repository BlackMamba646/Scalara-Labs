"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode, CSSProperties } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  style?: CSSProperties;
  once?: boolean;
  amount?: number;
  scale?: number;
  as?: "div" | "section" | "footer" | "p" | "span";
  /**
   * When true, the animation fires on mount instead of on scroll.
   * Use for above-the-fold content (e.g. hero sections) so the reveal
   * does not depend on an IntersectionObserver callback — iOS Safari
   * can fail to deliver the initial entry for already-visible elements.
   */
  immediate?: boolean;
}

const getInitial = (
  direction: Direction,
  distance: number,
  scale?: number
): any => {
  const base: Record<string, number> = { opacity: 0 };
  if (scale) base.scale = scale;
  switch (direction) {
    case "up":
      base.y = distance;
      break;
    case "down":
      base.y = -distance;
      break;
    case "left":
      base.x = distance;
      break;
    case "right":
      base.x = -distance;
      break;
    case "none":
      break;
  }
  return base;
};

const getAnimate = (scale?: number): any => {
  const base: Record<string, number> = { opacity: 1, x: 0, y: 0 };
  if (scale) base.scale = 1;
  return base;
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 30,
  className,
  style,
  once = true,
  amount = 0.15,
  scale,
  as = "div",
  immediate = false,
}: ScrollRevealProps) {
  const Component = motion[as] as any;
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;

    // Immediate mode: fire on mount, skip observer entirely. Use this for
    // above-the-fold content (hero sections) where IntersectionObserver is
    // unreliable on iOS Safari for elements already in view at mount.
    if (immediate) {
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    // Fallback safety net for non-immediate reveals: if the element is
    // already on screen when this effect runs, flip state without waiting
    // for an observer callback.
    const rect = el.getBoundingClientRect();
    const inViewOnMount =
      rect.top < window.innerHeight && rect.bottom > 0;
    if (inViewOnMount) {
      setIsVisible(true);
      if (once) return;
    }

    const threshold = Math.max(0, Math.min(1, amount));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.disconnect();
              return;
            }
          } else if (!once) {
            setIsVisible(false);
          }
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, amount, prefersReducedMotion, immediate]);

  if (prefersReducedMotion) {
    return (
      <Component className={className} style={style}>
        {children}
      </Component>
    );
  }

  const initial = getInitial(direction, distance, scale);

  return (
    <Component
      ref={ref as any}
      initial={initial}
      animate={isVisible ? getAnimate(scale) : initial}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      style={style}
    >
      {children}
    </Component>
  );
}

/* Stagger wrapper — just adds a stagger delay to each child index */
interface StaggerChildProps extends Omit<ScrollRevealProps, "delay"> {
  index: number;
  staggerDelay?: number;
  baseDelay?: number;
}

export function StaggerReveal({
  index,
  staggerDelay = 0.1,
  baseDelay = 0,
  ...props
}: StaggerChildProps) {
  return <ScrollReveal {...props} delay={baseDelay + index * staggerDelay} />;
}
