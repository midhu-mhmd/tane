/**
 * Tane logo.
 *  - The calligraphic wordmark is /images/logo-wordmark.png used as a CSS mask, so it takes the
 *    current text colour (white on teal, teal on white) without needing two files.
 *  - The leaf above the "e" is redrawn as inline SVG so it can animate. On hover/focus of the
 *    parent `.logo` link it "unfurls": rotate + scale from the stem (see `.logo-leaf` in globals.css).
 *
 * Swapping in an official file: replace /public/images/logo-wordmark.png (white artwork on a
 * transparent background, leaf removed) — or replace this component with
 * <img src="/images/your-logo.svg" alt="Tane Online Academy" width={…} height={…} />.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-block aspect-[544/314] ${className}`} aria-hidden="true">
      <span
        className="absolute inset-0 bg-current"
        style={{
          WebkitMaskImage: "url(/images/logo-wordmark.png)",
          maskImage: "url(/images/logo-wordmark.png)",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      />
      {/* Leaf: positioned in % of the wordmark box (sheet coords x700/y460, 68×130). */}
      <svg
        className="logo-leaf absolute overflow-visible"
        style={{ left: "70.22%", top: "13.38%", width: "12.5%", height: "41.4%" }}
        viewBox="0 0 68 130"
        fill="none"
        stroke="currentColor"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M35 4 C18 24 3 46 3 76 C3 104 18 120 34 126 C46 122 57 115 65 103" />
        <path d="M35 4 C51 22 63 44 63 64 C63 78 59 88 52 96" />
        <path d="M38 74 C43 84 42 93 34 101" />
      </svg>
    </span>
  );
}

