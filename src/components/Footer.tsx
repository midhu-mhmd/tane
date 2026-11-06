"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { gsap, MQ, ScrollTrigger, useIsoLayoutEffect } from "@/lib/gsap";
import { nav, programmes, site } from "@/content/site";

/**
 * FOOTER — revealed from behind the page.
 *  The footer is `position: sticky; bottom: 0` underneath <main> (which has a higher z-index
 *  and rounded bottom corners), so the page lifts away like a sheet to uncover it.
 *  Sticky is only applied when the footer fits in the viewport (otherwise it would be cut off).
 *  The giant "Tane" wordmark rises (yPercent 45 → 0) scrubbed over the final stretch of scroll.
 *  Mobile / reduced: normal flow; wordmark fades in via data-fade.
 */
const RISE_FROM = 45; // ← % of its own height the wordmark starts below its resting place

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const [fits, setFits] = useState(false);

  // Only reveal-from-behind when the footer is shorter than the viewport.
  useEffect(() => {
    const el = root.current!;
    const check = () => setFits(el.offsetHeight <= window.innerHeight && window.innerWidth >= 768);
    const ro = new ResizeObserver(check);
    ro.observe(el);
    window.addEventListener("resize", check);
    check();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
    };
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [fits]);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia(root.current!);
    mm.add(MQ.desktop, () => {
      gsap.fromTo(
        ".footer-mark",
        { yPercent: RISE_FROM, y: 0 },
        {
          yPercent: 0,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "#main",
            start: "bottom bottom", // main's end reaches viewport bottom = reveal begins
            end: "max", // …to the very end of the page
            scrub: true,
          },
        }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <footer
      ref={root}
      className={`${fits ? "motion-safe:sticky" : "relative"} bottom-0 z-0 -mt-12 overflow-hidden bg-teal text-white`}
    >
      <div className="mx-auto max-w-[1280px] px-6 pt-32 md:px-10 md:pt-28">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:gap-10">
          <div data-fade>
            <p className="font-display text-3xl font-extrabold leading-[0.95] tracking-[-0.04em] md:text-4xl">{site.tagline}</p>
            <p className="eyebrow mt-4 max-w-[30ch] leading-relaxed text-white">{site.subTagline}</p>
          </div>

          <nav data-fade aria-label="Programmes">
            <h2 className="eyebrow mb-4 text-white">Programmes</h2>
            <ul className="space-y-2.5 font-light">
              {programmes.items.map((p) => (
                <li key={p.name}>
                  <a className="link-underline" href={p.href}>
                    {p.name.replace("Tane ", "")}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav data-fade aria-label="Academy">
            <h2 className="eyebrow mb-4 text-white">Academy</h2>
            <ul className="space-y-2.5 font-light">
              <li>
                <a className="link-underline" href="#about">About</a>
              </li>
              {nav.map((n) => (
                <li key={n.href}>
                  <a className="link-underline" href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div data-fade>
            <h2 className="eyebrow mb-4 text-white">Contact</h2>
            <address className="space-y-2.5 font-light not-italic">
              <p>
                <a className="link-underline" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              </p>
              <p>
                <a className="link-underline" href={`tel:${site.contact.phone}`}>{site.contact.phone}</a>
              </p>
              <p>{site.contact.address}</p>
            </address>
            <ul className="mt-5 flex flex-wrap gap-2">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="btn btn-outline-light h-9 px-4 text-xs" rel="noopener">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-2 border-t border-white/15 pt-6 text-sm font-light md:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>
            <a className="link-underline" href="[/privacy]">Privacy</a>
            <span aria-hidden="true"> · </span>
            <a className="link-underline" href="[/terms]">Terms</a>
          </p>
        </div>
      </div>

      {/* Giant wordmark rising into place */}
      <div aria-hidden="true" className="mx-auto flex max-w-[1280px] justify-center overflow-hidden px-6 pt-10 md:px-10">
        <div data-fade className="footer-mark -mb-[4%] w-[min(80vw,560px,58svh)] text-lime">
          <Logo className="logo w-full" />
        </div>
      </div>
    </footer>
  );
}
