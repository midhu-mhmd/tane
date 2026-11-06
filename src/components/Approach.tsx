"use client";

import Image from "next/image";
import { useRef } from "react";
import scenePath from "../../public/images/scene-path.webp";
import { gsap, MQ, EASE, useIsoLayoutEffect } from "@/lib/gsap";
import { approach } from "@/content/site";

/**
 * APPROACH (teal, pinned on desktop) — one scrubbed timeline, played in sequence so only one
 * thing moves at a time:
 *   1. Image card scales 0.88 → 1
 *   2. Lime line draws left → right (scaleX 0 → 1)
 *   3. Each node pops in (scale 0.4 → 1 + fade) exactly when the line reaches it
 *  Nodes sit at the centre of three equal columns, so they're hit at 1/6, 3/6, 5/6 of the line.
 *  Tweak: PIN_LENGTH, and the relative `duration`s below (they're proportions of the scroll).
 *  Mobile / reduced: no pin; static vertical line, items fade in via data-fade.
 */
const PIN_LENGTH = "+=160%";
const NODE_AT = [1 / 6, 3 / 6, 5 / 6];

export default function Approach() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia(root.current!);
    mm.add(MQ.desktop, () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: PIN_LENGTH,
          pin: true,
          scrub: true,
        },
      });

      // 1. Card settles (first 25% of the pin)
      tl.fromTo(".approach-card", { scale: 0.88 }, { scale: 1, duration: 1 });

      // 2. Line draws (remaining 75%)
      const LINE_START = 1.1;
      const LINE_DURATION = 3;
      tl.fromTo(".approach-line", { scaleX: 0 }, { scaleX: 1, duration: LINE_DURATION }, LINE_START);

      // 3. Nodes pop as the line passes them
      gsap.utils.toArray<HTMLElement>(".approach-node").forEach((node, i) => {
        const at = LINE_START + LINE_DURATION * NODE_AT[i];
        tl.fromTo(
          node.querySelector(".approach-dot"),
          { scale: 0.4, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: EASE },
          at - 0.05
        );
        tl.fromTo(node.querySelector(".approach-copy"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, at);
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="approach"
      aria-labelledby="approach-title"
      className="sheet relative z-[3] -mt-12 overflow-hidden bg-teal text-white md:flex md:min-h-svh md:items-center"
    >
      {/* Soft arc */}
      <svg aria-hidden="true" className="pointer-events-none absolute -right-48 -top-48 h-[38.75rem] w-[38.75rem] text-white/[0.05]" viewBox="0 0 620 620" fill="none">
        <circle cx="310" cy="310" r="260" stroke="currentColor" strokeWidth="64" />
      </svg>

      <div className="relative mx-auto w-full max-w-[84rem] px-6 py-24 md:px-10 md:pb-16 md:pt-28">
        <div className="grid items-center gap-10 md:grid-cols-[1.05fr_1fr] md:gap-16">
          <div>
            <p data-fade className="eyebrow mb-6 text-white">
              {approach.eyebrow}
            </p>
            <h2
              id="approach-title"
              data-fade
              className="font-display text-[clamp(2.25rem,4.6vw,4.25rem)] font-extrabold leading-[0.95] tracking-[-0.04em]"
            >
              {approach.title}
            </h2>
            <p data-fade className="mt-6 max-w-[46ch] text-[1.125rem] font-light leading-[1.65] tracking-[0.01em] text-white md:text-[1.25rem]">
              {approach.body}
            </p>
          </div>
          <div data-fade className="approach-card overflow-hidden rounded-[2.5rem] shadow-[0_30px_60px_-30px_rgba(11,59,58,0.6)] md:aspect-[1264/848] md:h-[min(38svh,26rem)] md:w-auto md:justify-self-end">
            <Image
              src={scenePath}
              alt="A boy with a backpack walks a winding path past icons for reading, community and achievement toward a glowing graduation cap."
              quality={95}
              sizes="(min-width: 768px) 45vw, 100vw"
              className="h-full w-full object-cover"
              placeholder="blur"
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="relative mt-16 md:mt-[min(7svh,4.5rem)]">
          {/* Desktop: horizontal line through node centres (node = 4.5rem → centre 2.25rem - 0.1875rem = 2.0625rem). */}
          <div aria-hidden="true" className="absolute inset-x-0 top-[2.0625rem] hidden h-[0.375rem] rounded-full bg-white/10 md:block" />
          <div aria-hidden="true" className="approach-line absolute inset-x-0 top-[2.0625rem] hidden h-[0.375rem] origin-left rounded-full bg-lime md:block" />
          {/* Mobile: static vertical line */}
          <div aria-hidden="true" className="absolute bottom-8 left-[1.6875rem] top-8 w-[0.25rem] rounded-full bg-lime md:hidden" />

          <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
            {approach.steps.map((step, i) => (
              <li key={step.title} data-fade className="approach-node flex gap-5 md:flex-col md:items-center md:text-center">
                <span className="approach-dot grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-ink shadow-[0_12px_30px_-10px_rgba(11,59,58,0.55)] md:h-[4.5rem] md:w-[4.5rem]">
                  <StepIcon name={step.icon} />
                </span>
                <div className="approach-copy pt-2 md:pt-6">
                  <p className="eyebrow mb-2 text-white">Step 0{i + 1}</p>
                  <h3 className="font-display text-xl font-extrabold leading-[1.05] tracking-[-0.03em] md:text-2xl">{step.title}</h3>
                  <p className="mx-auto mt-2 max-w-[32ch] text-[1.0625rem] font-light leading-[1.65] tracking-[0.01em] text-white">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function StepIcon({ name }: { name: "target" | "book" | "cap" }) {
  const common = {
    className: "h-6 w-6 md:h-8 md:w-8",
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "target")
    return (
      <svg {...common}>
        <circle cx="16" cy="16" r="10" />
        <circle cx="16" cy="16" r="1.6" />
        <path d="M16 2v8M16 22v8M2 16h8M22 16h8" />
      </svg>
    );
  if (name === "book")
    return (
      <svg {...common}>
        <path d="M4 7c4-1.5 8-1.5 12 1 4-2.5 8-2.5 12-1v17c-4-1.5-8-1.5-12 1-4-2.5-8-2.5-12-1z" />
        <path d="M16 8v17M8 12h4M8 16h4M20 12h4M20 16h4" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M3 11l11-5 11 5-11 5z" />
      <path d="M8 13.5V18c3 2 9 2 12 0v-4.5M25 11v6" />
      <path d="M6 27l7-6 4 3 9-8M21 16h5v5" />
    </svg>
  );
}
