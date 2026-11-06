"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger, MQ, EASE } from "@/lib/gsap";

/**
 * Global motion layer:
 *  1. Lenis smooth scroll (lerp 0.1) driven by GSAP's ticker so ScrollTrigger stays in sync.
 *     Disabled entirely for prefers-reduced-motion (native scrolling instead).
 *  2. Generic reveals for any element marked `data-fade`:
 *       mobile  → 24px fade-up on enter (0.8s, power3.out)
 *       reduced → 200ms opacity fade, no movement
 *     On desktop `data-fade` does nothing — each section runs its own single effect.
 */
export default function MotionProvider() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    // ── 1. Smooth scroll ───────────────────────────────────────────────
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({
        lerp: 0.1, // ← smoothing amount (lower = floatier)
        anchors: true, // smooth-scroll in-page #links
        smoothWheel: true,
      });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });

    // ── 2a. Mobile: 24px fade-up on enter ───────────────────────────────
    mm.add(MQ.mobile, () => {
      const els = gsap.utils.toArray<HTMLElement>("[data-fade]");
      gsap.set(els, { opacity: 0, y: 24 });
      ScrollTrigger.batch(els, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: EASE, stagger: 0.08, overwrite: true }),
      });
    });

    // ── 2b. Reduced motion: 200ms opacity only ──────────────────────────
    mm.add(MQ.reduced, () => {
      const els = gsap.utils.toArray<HTMLElement>("[data-fade]");
      gsap.set(els, { opacity: 0 });
      ScrollTrigger.batch(els, {
        start: "top 95%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, duration: 0.2, ease: "none", overwrite: true }),
      });
    });

    return () => mm.revert();
  }, []);

  return null;
}

