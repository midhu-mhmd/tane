/**
 * Asset pipeline — run once with `npm run images`.
 *
 * Uses the high-resolution remastered artwork in /assets/source/hd (falling back
 * to /assets/source) and writes crisp, high-resolution WebP files to /public/images.
 *
 *  - hero.jpg             -> hero.webp (1920×1080 LCP image, preloaded)
 *  - scene-*.jpg          -> 4 separate high-res scene WebPs (1264×848, 3:2)
 *  - programme-*.jpg      -> 4 high-res programme card illustrations (1024×1024, 1:1)
 *                            with background colour matched to exact #0F7574 / #C5E19B
 *  - brand-logo-sheet.jpg -> logo-wordmark.png (4× supersampled 2176×1256 smooth alpha mask)
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "assets/source";
const HD = "assets/source/hd";
const OUT = "public/images";
await mkdir(OUT, { recursive: true });

const webp = { quality: 94, smartSubsample: true, effort: 6 };

// ── Hero (2× upscaled to 2880×1620, exact 16:9 aspect ratio) ────────────────
await sharp(`${HD}/hero.jpg`)
  .resize(2880, 1620, { fit: "cover", kernel: "lanczos3" })
  .sharpen({ sigma: 0.9, m1: 1.0, m2: 2.0 })
  .webp(webp)
  .toFile(`${OUT}/hero.webp`);

// ── Four 3:2 scenes (2× upscaled to 2528×1696) ──────────────────────────────
// scene-desk is cropped from the right desk area of the HD hero so all 4 grid scenes exist in 2× HD.
await sharp(`${HD}/hero.jpg`)
  .extract({ left: 328, top: 68, width: 1048, height: 700 })
  .resize(2528, 1696, { fit: "cover", kernel: "lanczos3" })
  .sharpen({ sigma: 0.85, m1: 1.0, m2: 2.0 })
  .webp(webp)
  .toFile(`${OUT}/scene-desk.webp`);

for (const name of ["scene-path", "scene-programmes", "scene-calendar"]) {
  await sharp(`${HD}/${name}.jpg`)
    .resize(2528, 1696, { fit: "cover", kernel: "lanczos3" })
    .sharpen({ sigma: 0.85, m1: 1.0, m2: 2.0 })
    .webp(webp)
    .toFile(`${OUT}/${name}.webp`);
}

// ── Programme card illustrations (2× upscaled to 2048×2048) ─────────────────
// Softly locks background pixels to the exact card tone (#0F7574 or #C5E19B) for a seamless blend.
const TONES = {
  teal: [15, 117, 116],
  lime: [197, 225, 155],
};
const programmeCards = [
  ["programme-school", "teal"],
  ["programme-madrasa", "lime"],
  ["programme-remedial", "teal"],
  ["programme-lifeskills", "lime"],
];

for (const [name, tone] of programmeCards) {
  const target = TONES[tone];
  const { data, info } = await sharp(`${HD}/${name}.jpg`)
    .resize(2048, 2048, { fit: "cover", kernel: "lanczos3" })
    .sharpen({ sigma: 0.85, m1: 1.0, m2: 2.0 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Sample top-center background colour and smoothly blend matching background pixels to exact brand hex.
  const refIdx = (10 * info.width + (info.width >> 1)) * info.channels;
  const ref = [data[refIdx], data[refIdx + 1], data[refIdx + 2]];

  for (let i = 0; i < data.length; i += info.channels) {
    const dr = data[i] - ref[0];
    const dg = data[i + 1] - ref[1];
    const db = data[i + 2] - ref[2];
    const dist = Math.hypot(dr, dg, db);
    if (dist < 26) {
      const t = dist < 12 ? 1 : 1 - (dist - 12) / 14;
      data[i] = Math.round(data[i] * (1 - t) + target[0] * t);
      data[i + 1] = Math.round(data[i + 1] * (1 - t) + target[1] * t);
      data[i + 2] = Math.round(data[i + 2] * (1 - t) + target[2] * t);
    }
  }

  await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .webp(webp)
    .toFile(`${OUT}/${name}.webp`);
}

// ── Logo: 4× supersampled contour-smoothed wordmark on transparent ──────────
// Crop box around "Tane" on the brand sheet (1240×1240), upscaled 4× (2176×1256).
const LOGO = { left: 318, top: 418, width: 544, height: 314 };
const SCALE = 4;
const W = LOGO.width * SCALE;
const H = LOGO.height * SCALE;

// Leaf box on the sheet — painted out so the inline SVG leaf can replace and animate it.
const inLeafBox = (sx, sy) =>
  sy >= 456 && sy <= 595 && sx >= 696 && (sy < 570 ? sx <= 773 : sx <= 761);

const { data } = await sharp(`${SRC}/brand-logo-sheet.jpg`)
  .extract(LOGO)
  .greyscale()
  .resize(W, H, { kernel: "lanczos3" })
  .blur(2.2)
  .raw()
  .toBuffer({ resolveWithObject: true });

const rgba = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = y * W + x;
    const inLeaf = inLeafBox(LOGO.left + x / SCALE, LOGO.top + y / SCALE);
    const a = inLeaf ? 0 : Math.max(0, Math.min(255, ((data[i] - 178) / 22) * 255));
    rgba[i * 4] = rgba[i * 4 + 1] = rgba[i * 4 + 2] = 255;
    rgba[i * 4 + 3] = Math.round(a);
  }
}
await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/logo-wordmark.png`);

// Social preview (Open Graph) — HD hero at 1200×630.
await sharp(`${HD}/hero.jpg`)
  .resize(1200, 630, { fit: "cover", kernel: "lanczos3" })
  .jpeg({ quality: 92 })
  .toFile(`${OUT}/og.jpg`);

console.log("✓ HD images written to", OUT);
