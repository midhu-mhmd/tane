"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import sceneProgrammes from "../../public/images/scene-programmes.webp";
import imgSchool from "../../public/images/programme-school.webp";
import imgMadrasa from "../../public/images/programme-madrasa.webp";
import imgRemedial from "../../public/images/programme-remedial.webp";
import imgLife from "../../public/images/programme-lifeskills.webp";
import { gsap, MQ, useIsoLayoutEffect } from "@/lib/gsap";
import { programmes } from "@/content/site";
import { Arrow } from "./Hero";

const IMAGES: Record<string, StaticImageData> = {
  "programme-school": imgSchool,
  "programme-madrasa": imgMadrasa,
  "programme-remedial": imgRemedial,
  "programme-lifeskills": imgLife,
};

/**
 * PROGRAMMES
 *  Desktop: four sticky stacking cards (alternating teal / lime). As the next card slides up,
 *  the previous one scales to 0.94 and dims (a dark overlay fades to DIM). Scrubbed.
 *  Mobile: the same cards become a swipeable carousel with depth (Spotify SongDNA-style):
 *  the centred card is full size; neighbours scale down, dim and tilt slightly. It reacts to
 *  the user's swipe only — nothing auto-plays.
 *  Reduced motion: plain stacked list (no sticky), no depth.
 */
const SCALE_TO = 0.94; // ← how far the covered card shrinks
const DIM = 0.28; // ← overlay opacity on the covered card
const STICKY_TOP = 112; // px from the viewport top (clears the nav pill)

export default function Programmes() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia(root.current!);

    // Desktop — sticky stack
    mm.add(MQ.desktop, () => {
      const cards = gsap.utils.toArray<HTMLElement>(".prog-card");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: next,
            start: "top bottom", // next card starts entering
            end: `top ${STICKY_TOP + (i + 1) * 16}px`, // next card has docked
            scrub: true,
          },
        });
        tl.to(card.querySelector(".prog-inner"), { scale: SCALE_TO }, 0).to(
          card.querySelector(".prog-dim"),
          { opacity: DIM },
          0
        );
      });
    });

    // Mobile — carousel with depth
    mm.add(MQ.mobile, () => {
      const el = track.current!;
      const items = Array.from(el.querySelectorAll<HTMLElement>(".prog-inner"));
      let raf = 0;
      const update = () => {
        raf = 0;
        const mid = el.scrollLeft + el.clientWidth / 2;
        items.forEach((item) => {
          const li = item.parentElement!;
          const center = li.offsetLeft + li.offsetWidth / 2;
          const d = gsap.utils.clamp(-1, 1, (center - mid) / li.offsetWidth); // -1 … 1
          gsap.set(item, {
            scale: 1 - Math.abs(d) * 0.1, // depth: neighbours 10% smaller
            rotationY: d * -10, // slight turn away from centre
            opacity: 1 - Math.abs(d) * 0.35,
            transformPerspective: 900,
          });
        });
      };
      const onScroll = () => {
        if (!raf) raf = requestAnimationFrame(update);
      };
      update();
      el.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      return () => {
        cancelAnimationFrame(raf);
        el.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        gsap.set(items, { clearProps: "all" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="programmes"
      aria-labelledby="programmes-title"
      className="sheet relative z-[4] -mt-12 bg-white pb-24 text-ink md:pb-40"
    >
      {/* Header with the programme-choice scene */}
      <div className="mx-auto grid max-w-[1280px] items-end gap-10 px-6 pb-14 pt-28 md:grid-cols-[1fr_0.9fr] md:gap-16 md:px-10 md:pb-20 md:pt-36">
        <div>
          <p data-fade className="eyebrow mb-6 text-teal">
            {programmes.eyebrow}
          </p>
          <h2
            id="programmes-title"
            data-fade
            className="max-w-[14ch] font-display text-[clamp(2.25rem,5vw,4.75rem)] font-extrabold leading-[0.95] tracking-[-0.04em]"
          >
            {programmes.title}
          </h2>
          <p data-fade className="mt-6 max-w-[42ch] text-[18px] font-light leading-[1.65] tracking-[0.01em] md:text-[20px]">
            {programmes.body}
          </p>
        </div>
        <div data-fade className="overflow-hidden rounded-[36px]">
          <Image
            src={sceneProgrammes}
            alt="A girl rests her chin on her hand, smiling as she considers four programme cards floating above her."
            quality={95}
            sizes="(min-width: 768px) 560px, 100vw"
            className="h-auto w-full"
            placeholder="blur"
          />
        </div>
      </div>

      {/* Cards: carousel on mobile, sticky stack from md up */}
      <div data-fade className="mx-auto max-w-[1280px] md:px-10">
        <p className="eyebrow mb-4 px-6 text-teal md:hidden" aria-hidden="true">
          Swipe to explore →
        </p>
        <ul
          ref={track}
          tabIndex={0}
          aria-label="Programmes"
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-6 px-6 pb-4 md:block md:snap-none md:overflow-visible md:px-0 md:pb-0"
        >
          {programmes.items.map((p, i) => {
            const teal = p.tone === "teal";
            return (
              <li
                key={p.name}
                className="prog-card w-[84vw] shrink-0 snap-center md:mb-8 md:w-auto motion-safe:md:sticky"
                style={{ top: `${STICKY_TOP + i * 16}px` }}
              >
                <article
                  className={`prog-inner relative isolate flex h-[min(560px,78svh)] origin-top flex-col overflow-hidden rounded-[36px] md:h-[min(560px,72svh)] md:flex-row md:rounded-[48px] ${
                    teal ? "bg-teal text-white" : "bg-lime text-ink"
                  }`}
                >
                  <div className="relative z-10 flex flex-1 flex-col p-7 md:p-14">
                    <span className={`eyebrow ${teal ? "text-white" : "text-ink"}`}>0{i + 1} / 04</span>
                    <h3 className="mt-auto max-w-[12ch] font-display text-[clamp(2rem,4.4vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.04em] md:mt-auto">
                      {p.name}
                    </h3>
                    <p className="mt-4 max-w-[38ch] text-[18px] font-light leading-[1.65] tracking-[0.01em] md:text-[20px]">{p.line}</p>
                    <a
                      href={p.href}
                      className={`link-arrow mt-6 inline-flex items-center gap-2 self-start rounded-full text-[15px] font-semibold ${
                        teal ? "text-white" : "text-ink"
                      }`}
                    >
                      Learn more <span className="sr-only">about {p.name}</span>
                      <Arrow />
                    </a>
                  </div>
                  <div className="relative -mt-6 h-[44%] md:mt-0 md:h-auto md:w-[46%] md:self-end">
                    <Image
                      src={IMAGES[p.image]}
                      alt={p.alt}
                      quality={95}
                      sizes="(min-width: 768px) 520px, 84vw"
                      className="fade-edges h-full w-full object-cover object-right-bottom md:h-auto"
                    />
                  </div>
                  {/* Dim overlay used by the stacking effect */}
                  <span aria-hidden="true" className="prog-dim pointer-events-none absolute inset-0 z-20 bg-ink opacity-0" />
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
