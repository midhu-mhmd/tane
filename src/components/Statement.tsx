"use client";

import { useRef } from "react";
import { gsap, MQ, useIsoLayoutEffect } from "@/lib/gsap";
import { statement } from "@/content/site";

/**
 * STATEMENT (white, pinned for one viewport on desktop)
 *  Each word goes from 15% → 100% opacity, scrubbed to scroll while the section is pinned.
 *  Tweak: PIN_LENGTH (how long it stays pinned), WORD_STAGGER (overlap between words).
 *  Mobile / reduced motion: no pin; text simply fades in via data-fade.
 */
const PIN_LENGTH = "+=100%"; // ← one viewport of scroll
const START_OPACITY = 0.15;

export default function Statement() {
  const root = useRef<HTMLElement>(null);
  const words = statement.sentence.split(" ");

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia(root.current!);
    mm.add(MQ.desktop, () => {
      gsap.fromTo(
        ".stmt-word",
        { opacity: START_OPACITY },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1, // WORD_STAGGER
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: PIN_LENGTH,
            pin: true,
            scrub: true,
          },
        }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="about"
      aria-labelledby="statement-title"
      className="sheet relative z-[2] -mt-12 bg-white text-ink md:flex md:min-h-svh md:items-center"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 py-24 md:px-10 md:py-28">
        <p data-fade className="eyebrow mb-8 text-teal">
          {statement.eyebrow}
        </p>
        <h2
          id="statement-title"
          data-fade
          className="max-w-[20ch] font-display text-[clamp(2.25rem,5.2vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.04em]"
        >
          {words.map((w, i) => (
            <span key={i} className="stmt-word">
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </h2>

        <div className="mt-14 grid gap-10 border-t border-ink/10 pt-10 md:mt-20 md:grid-cols-2 md:gap-16">
          <div data-fade>
            <h3 className="eyebrow mb-3 text-teal">Our mission</h3>
            <p className="max-w-[44ch] text-[18px] font-light leading-[1.65] tracking-[0.01em] md:text-[20px]">{statement.mission}</p>
          </div>
          <div data-fade>
            <h3 className="eyebrow mb-3 text-teal">Our vision</h3>
            <p className="max-w-[44ch] text-[18px] font-light leading-[1.65] tracking-[0.01em] md:text-[20px]">{statement.vision}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

