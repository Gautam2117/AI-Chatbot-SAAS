// scripts/generate-icons.js
import fs from "fs";
import path from "path";
import sharp from "sharp";

const SRC = "public/Botify_logo.png";            // your source
const OUT = "public/icons";                       // output dir
const sizes = [32, 192, 512];                     // standard icons
const APPLE = 180;                                // apple-touch-icon
const MASKABLES = [192, 512];                     // maskable sizes
const PAD = 0.2;                                  // 20% padding for maskables

(async () => {
  if (!fs.existsSync(SRC)) {
    console.error(`Source not found: ${SRC}`);
    process.exit(1);
  }
  fs.mkdirSync(OUT, { recursive: true });

  // Standard square icons
  for (const s of sizes) {
    await sharp(SRC)
      .resize({ width: s, height: s, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(OUT, `icon-${s}.png`));
  }

  // Apple touch icon (180x180, opaque background recommended)
  await sharp(SRC)
    .resize({ width: APPLE, height: APPLE, fit: "contain", background: "#ffffff" })
    .png()
    .toFile(path.join(OUT, "apple-touch-icon.png"));

  // Maskable icons with padding (logo sits inside with transparent margin)
  for (const s of MASKABLES) {
    const inner = Math.round(s * (1 - PAD)); // scale down to leave padding
    const buf = await sharp(SRC)
      .resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    // create transparent canvas and composite the smaller logo in the center
    await sharp({
      create: {
        width: s,
        height: s,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: buf, gravity: "center" }])
      .png()
      .toFile(path.join(OUT, `maskable-${s}.png`));
  }

  // Minimal pinned tab SVG (placeholder). Replace with your brand SVG if you have it.
  const pinned = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <path fill="#000" d="M32 6c14.36 0 26 11.64 26 26S46.36 58 32 58 6 46.36 6 32 17.64 6 32 6zm-6 18a2 2 0 100 4h12a2 2 0 100-4H26zm-4 10a2 2 0 012-2h20a2 2 0 010 4H24a2 2 0 01-2-2zm6 8a2 2 0 100 4h12a2 2 0 100-4H28z"/>
</svg>`;
  fs.writeFileSync(path.join(OUT, "safari-pinned-tab.svg"), pinned.trim(), "utf8");

  console.log("✅ Icons generated in public/icons");
})();
