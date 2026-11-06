"use client";

import { useRef, useState } from "react";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { site } from "@/content/site";

/**
 * TEAR-OFF CALENDAR (Chengyu Calendar spell)
 *  Hover, focus or tap: the top page peels up from its binding — rotating toward the viewer
 *  from the top edge, drifting and fading — revealing "Next intake: [date]" underneath.
 *  Leave/blur/tap again: it settles back. Reduced motion: a 200ms crossfade instead.
 *  Tweak: PEEL (end pose) and DURATION.
 */
const PEEL = { rotationX: 72, rotationZ: -7, y: -14, x: 6 };
const DURATION = 0.75;

export default function TearCalendar() {
  const root = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      tl.current = gsap.timeline({ paused: true });
      if (reduce) {
        tl.current.to(".cal-top", { opacity: 0, duration: 0.2, ease: "none" });
        return;
      }
      tl.current
        // page lifts and curls up from the rings
        .to(".cal-top", { ...PEEL, duration: DURATION, ease: "power3.out", transformOrigin: "50% 0%" }, 0)
        // shading deepens as it lifts (opacity only)
        .to(".cal-shade", { opacity: 0.35, duration: DURATION * 0.5, ease: "none" }, 0)
        // and finally lets go
        .to(".cal-top", { opacity: 0, duration: DURATION * 0.45, ease: "none" }, DURATION * 0.4);
    }, root);
    return () => ctx.revert();
  }, []);

  const peel = (state: boolean) => {
    setOpen(state);
    if (state) tl.current?.play();
    else tl.current?.reverse();
  };

  return (
    <button
      ref={root}
      type="button"
      aria-pressed={open}
      aria-label={`Tear-off calendar. ${site.nextIntake.label}`}
      onMouseEnter={() => peel(true)}
      onMouseLeave={() => peel(false)}
      onFocus={(e) => e.currentTarget.matches(":focus-visible") && peel(true)}
      onBlur={() => peel(false)}
      onClick={() => {
        // Hover devices already peel on hover; tap toggles on touch screens.
        if (window.matchMedia("(hover: hover)").matches) return;
        peel(!open);
      }}
      className="group relative h-[132px] w-[116px] shrink-0 rounded-[18px] [perspective:600px]"
    >
      {/* Page stack edges (skeuomorphic depth) */}
      <span aria-hidden="true" className="absolute inset-x-2 -bottom-[6px] top-3 rounded-[16px] bg-white/60 shadow-[0_10px_24px_-12px_rgba(11,59,58,0.45)]" />
      <span aria-hidden="true" className="absolute inset-x-1 -bottom-[3px] top-2 rounded-[16px] bg-white/80" />

      {/* Under page — the reveal */}
      <span aria-hidden="true" className="absolute inset-0 flex flex-col overflow-hidden rounded-[16px] bg-white text-ink shadow-[0_1px_0_rgba(11,59,58,0.08)]">
        <span className="bg-teal pb-1.5 pt-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-white">Next intake</span>
        <span className="flex flex-1 flex-col items-center justify-center">
          <span className="font-display text-[40px] font-extrabold leading-none tracking-[-0.04em]">{site.nextIntake.day}</span>
          <span className="mt-1.5 text-[11px] font-medium">{site.nextIntake.month}</span>
        </span>
      </span>

      {/* Top page — peels away */}
      <span aria-hidden="true" className="cal-top absolute inset-0 flex flex-col overflow-hidden rounded-[16px] bg-white text-ink will-change-transform">
        <span className="bg-teal pb-1.5 pt-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-white">Tane</span>
        <span className="flex flex-1 flex-col items-center justify-center gap-2">
          <svg className="h-9 w-7 text-teal" viewBox="0 0 68 130" fill="none" stroke="currentColor" strokeWidth={7} strokeLinecap="round">
            <path d="M35 4 C18 24 3 46 3 76 C3 104 18 120 34 126 C46 122 57 115 65 103" />
            <path d="M35 4 C51 22 63 44 63 64 C63 78 59 88 52 96" />
            <path d="M38 74 C43 84 42 93 34 101" />
          </svg>
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink">Peek</span>
        </span>
        {/* dog-ear hint */}
        <span className="absolute bottom-0 right-0 h-5 w-5 rounded-tl-[8px] bg-[linear-gradient(135deg,#ffffff_45%,rgba(11,59,58,0.12)_50%,rgba(11,59,58,0.04))] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-125 origin-bottom-right" />
        <span className="cal-shade pointer-events-none absolute inset-0 bg-ink opacity-0" />
      </span>

      {/* Binding rings sit above both pages */}
      <span aria-hidden="true" className="absolute inset-x-0 -top-[5px] z-10 flex justify-center gap-10">
        <span className="h-3 w-[5px] rounded-full bg-ink/80 shadow-[0_1px_0_rgba(255,255,255,0.6)]" />
        <span className="h-3 w-[5px] rounded-full bg-ink/80 shadow-[0_1px_0_rgba(255,255,255,0.6)]" />
      </span>
    </button>
  );
}
