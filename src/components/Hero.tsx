"use client";

import Image from "next/image";
import { useRef } from "react";
import hero from "../../public/images/hero.webp";
import { gsap, ScrollTrigger, MQ, EASE, useIsoLayoutEffect } from "@/lib/gsap";
import { site } from "@/content/site";

/**
 * HERO (teal)
 *  ① Headline slides up line by line from a mask — 0.9s, stagger 0.08, power3.out (desktop).
 *  ② Hero image parallax — moves +60px over the hero's scroll, i.e. ~60px slower than the page.
 *  ③ Background drift — a deep-teal wash fades/slides between two teals, 14s yoyo loop.
 *     Paused while the hero is off-screen.
 *  Mobile: headline block uses the global 24px fade-up (data-fade); no parallax.
 *  Reduced motion: static background, 200ms fade on text.
 */
const LINES = ["Where future", "begins."];
const PARALLAX_PX = 60; // ← parallax distance
const DRIFT_SECONDS = 14; // ← full background loop (there and back)

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current!;
    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // ③ Background drift (opacity + transform only). Runs on all sizes; it's ambient & slow.
      const drift = gsap.fromTo(
        ".hero-drift",
        { opacity: 0, xPercent: -6 },
        {
          opacity: 0.55, // ← how deep the second teal gets
          xPercent: 6,
          duration: DRIFT_SECONDS / 2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        }
      );
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? drift.play() : drift.pause()),
      });
    });

    mm.add(MQ.desktop, () => {
      // ① Line-by-line mask reveal (initial translate set in CSS to avoid a flash;
      //    y: 0 clears the pixel offset that the browser computes from CSS translateY(110%)).
      gsap.fromTo(
        ".hero-line > span",
        { yPercent: 110, y: 0 },
        { yPercent: 0, y: 0, duration: 0.9, ease: EASE, stagger: 0.08, delay: 0.15 }
      );
      // Supporting copy follows once the headline has landed (opacity only, so only one thing moves).
      gsap.fromTo(".hero-sub", { opacity: 0 }, { opacity: 1, duration: 0.8, ease: EASE, delay: 0.7 });

      // ② Parallax — scrubbed to scroll.
      gsap.fromTo(
        ".hero-media",
        { y: 0 },
        {
          y: PARALLAX_PX,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        }
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-title"
      className="relative z-0 isolate overflow-hidden bg-teal text-white md:min-h-[max(100svh,45rem)]"
    >
      {/* ③ Drift layer sits above the photo's flat teal, below the text. */}
      <div
        aria-hidden="true"
        className="hero-drift pointer-events-none absolute -inset-x-[10%] inset-y-0 z-[1] bg-[radial-gradient(60%_70%_at_20%_25%,#0B3B3A_0%,transparent_70%)] opacity-0"
      />
      {/* Soft arc */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[40rem] w-[40rem] text-white/[0.05]"
        viewBox="0 0 640 640"
        fill="none"
      >
        <circle cx="320" cy="320" r="270" stroke="currentColor" strokeWidth="70" />
      </svg>

      <div className="relative z-10 mx-auto max-w-[84rem] px-6 pb-12 pt-24 md:px-10 md:pb-24 md:pt-24 lg:pt-28">
        <div data-fade>
          <p className="hero-sub eyebrow mb-4 text-white md:mb-5">{site.subTagline}</p>
          <h1
            id="hero-title"
            className="font-display text-[clamp(2.75rem,7.2vw+0.5rem,7.75rem)] font-extrabold leading-[0.95] tracking-[-0.04em]"
          >
            {LINES.map((line) => (
              // Each line is a mask (overflow hidden); the inner span slides up into view.
              <span key={line} className="hero-line block overflow-hidden pb-[0.08em]">
                <span className="block will-change-transform">{line}</span>
              </span>
            ))}
          </h1>
          <p className="hero-sub mt-5 max-w-[34ch] text-[1.125rem] font-light leading-[1.65] tracking-[0.01em] text-white md:mt-6 md:text-[1.25rem]">
            {site.description}
          </p>
          <div className="hero-sub mt-6 flex flex-wrap gap-3 md:mt-7">
            <a href="#programmes" className="btn btn-lime">
              Explore programmes
              <Arrow />
            </a>
            <a href="#enrol" className="btn btn-outline-light">
              Enroll a learner
            </a>
          </div>
        </div>
      </div>

      {/* Media: absolutely placed bottom-right on tablet/desktop; in flow on mobile.
          `priority` = preloaded + fetchpriority=high for a fast LCP. */}
      <div className="hero-media pointer-events-none relative md:absolute md:bottom-0 md:right-0 md:w-[min(100%,76rem)]">
        <Image
          src={hero}
          alt="A learner in headphones takes notes while a teacher explains a lesson on a laptop."
          priority
          quality={95}
          sizes="(min-width: 768px) 82vw, 100vw"
          className="hero-mask h-auto w-full"
          placeholder="blur"
        />
      </div>
    </section>
  );
}

export function Arrow() {
  return (
    <svg className="btn-arrow h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
