"use client";

import Image from "next/image";
import { useRef } from "react";
import sceneCalendar from "../../public/images/scene-calendar.webp";
import { gsap, MQ, useIsoLayoutEffect } from "@/lib/gsap";
import { enrol, site } from "@/content/site";
import { Arrow } from "./Hero";
import TearCalendar from "./TearCalendar";

/**
 * ENROL (lime)
 *  The parent-and-child image reveals with a clip-path inset 12% → 0, scrubbed as it scrolls in.
 *  (clip-path is the one intentional exception to "transform/opacity only" — it's GPU-composited
 *  in modern browsers and doesn't trigger layout.)
 *  Tweak: CLIP_FROM, and start/end of the trigger.
 *  The tear-off calendar has its own hover interaction (see TearCalendar.tsx).
 */
const CLIP_FROM = "inset(12% 12% 12% 12% round 48px)";
const CLIP_TO = "inset(0% 0% 0% 0% round 40px)";

export default function Enrol() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia(root.current!);
    mm.add(MQ.desktop, () => {
      gsap.fromTo(
        ".enrol-media",
        { clipPath: CLIP_FROM },
        {
          clipPath: CLIP_TO,
          ease: "none",
          scrollTrigger: { trigger: ".enrol-media", start: "top 85%", end: "center 55%", scrub: true },
        }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="enrol"
      aria-labelledby="enrol-title"
      className="sheet relative z-[5] -mt-12 rounded-b-[3rem] bg-lime text-ink"
    >
      <div className="mx-auto grid max-w-[84rem] items-center gap-12 px-6 pb-28 pt-24 md:grid-cols-[1.1fr_1fr] md:gap-16 md:px-10 md:pb-40 md:pt-32">
        <div data-fade className="enrol-media overflow-hidden rounded-[2.5rem]">
          <Image
            src={sceneCalendar}
            alt="A smiling father points at a laptop screen beside his son, next to a desk calendar with a date ticked."
            quality={95}
            sizes="(min-width: 768px) 48vw, 100vw"
            className="h-auto w-full"
            placeholder="blur"
          />
        </div>

        <div className="relative">
          <p data-fade className="eyebrow mb-6 text-ink">
            {enrol.eyebrow}
          </p>
          <h2
            id="enrol-title"
            data-fade
            className="max-w-[12ch] font-display text-[clamp(2.25rem,5vw,4.75rem)] font-extrabold leading-[0.95] tracking-[-0.04em]"
          >
            {enrol.title}
          </h2>
          <p data-fade className="mt-6 max-w-[40ch] text-[1.125rem] font-light leading-[1.65] tracking-[0.01em] md:text-[1.25rem]">
            {enrol.body}
          </p>
          <div data-fade className="mt-10 flex flex-wrap items-center gap-8">
            <a href={site.assessmentHref} className="btn btn-teal">
              {enrol.cta}
              <Arrow />
            </a>
            <TearCalendar />
          </div>
        </div>
      </div>
    </section>
  );
}
