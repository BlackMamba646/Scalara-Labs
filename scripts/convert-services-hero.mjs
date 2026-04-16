/**
 * Convert the services page hero PNG to WebP on disk.
 *
 * Usage: node scripts/convert-services-hero.mjs
 *
 * - Reads src/assets/images/servicespageslisting-hero-section-listing-hero.png
 * - Writes the WebP next to it at quality 82
 * - Leaves the original PNG untouched (delete it manually once the import is updated)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SRC = path.join(
  ROOT,
  "src/assets/images/servicespageslisting-hero-section-listing-hero.png"
);
const DEST = SRC.replace(/\.png$/, ".webp");

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`Source not found: ${SRC}`);
    process.exit(1);
  }

  const original = fs.readFileSync(SRC);
  const webp = await sharp(original)
    .webp({ quality: 82, effort: 6 })
    .toBuffer();

  fs.writeFileSync(DEST, webp);

  console.log(
    `${path.basename(SRC)}: ${(original.length / 1024).toFixed(0)}KB → ${(
      webp.length / 1024
    ).toFixed(0)}KB (WebP)`
  );
  console.log(`Written: ${DEST}`);
}

main().catch((err) => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
