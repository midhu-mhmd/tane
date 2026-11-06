"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import { nav } from "@/content/site";

/**
 * NAV — transparent over the hero, becomes a floating white pill with blur after 80px.
 * Motion: only the pill *background layer* animates (opacity + scale, 500ms, house ease).
 * Text/logo colour swaps at the same moment. Logo hover = leaf unfurl (CSS, see globals.css).
 */
const THRESHOLD = 80; // ← px scrolled before the pill appears

export default function Nav() {
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const onScroll = () => setFloating(window.scrollY > THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
      <nav
        aria-label="Primary"
        data-floating={floating}
        className={`group/nav relative mx-auto flex h-14 max-w-[72rem] items-center justify-between rounded-full pl-5 pr-2 md:h-16 md:pl-7 ${floating ? "text-teal" : "text-white"
          }`}
      >
        {/* Pill background — fades/scales in after THRESHOLD. transform + opacity only. */}
        <span
          aria-hidden="true"
          className="nav-pill pointer-events-none absolute inset-0 -z-10 rounded-full bg-white/80 shadow-[0_8px_30px_-12px_rgba(11,59,58,0.25)] ring-1 ring-ink/5 backdrop-blur-xl"
        />

        <a href="#top" className="logo -my-2 flex items-center rounded-xl py-2" aria-label="Tane Online Academy — home">
          <Logo className="h-8 md:h-9" />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="link-underline rounded-full px-4 py-2 text-[0.9375rem] font-medium tracking-[0.01em]"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#enrol" className="btn btn-lime h-10 px-5 text-[0.9375rem] font-semibold md:h-11">
          Join us
        </a>
      </nav>
    </header>
  );
}

