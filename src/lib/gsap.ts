"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/** House ease: matches cubic-bezier(.22,1,.36,1) closely. Change once, applies everywhere. */
export const EASE = "power3.out";
/** Default duration for entrance motion (seconds). Keep within 0.6–1.0. */
export const DURATION = 0.9;

/**
 * Media-query conditions shared by every section, used with gsap.matchMedia().
 *  - desktop : ≥768px and motion allowed  → section-specific effects (pin, parallax, scrub)
 *  - mobile  : <768px and motion allowed  → 24px fade-up only
 *  - reduced : prefers-reduced-motion     → 200ms opacity fades only
 */
export const MQ = {
  desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

