/**
 * Re-encode team member photos as WebP and reconnect them in Strapi.
 *
 * Usage: node scripts/convert-team-to-webp.mjs
 *
 * - Converts the 8 team source images (4 desktop + 4 mobile) to WebP
 * - Uploads the WebP versions to Strapi
 * - Updates /api/home-page teamMembers to point at the new WebP IDs
 * - Deletes the old JPG/PNG files from Strapi media library
 * - Updates scripts/image-ids.json (adds .webp keys, removes old ones)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const IDS_FILE = path.join(__dirname, "image-ids.json");

// ── Load .env ──────────────────────────────────────────────────────────
const envText = fs.readFileSync(path.join(ROOT, ".env"), "utf8");
const env = {};
envText.split("\n").forEach((line) => {
  const idx = line.indexOf("=");
  if (idx > 0) env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
});

const CMS_URL = env.CMS_URL;
const CMS_API = env.CMS_API;
if (!CMS_URL || !CMS_API) {
  console.error("Missing CMS_URL or CMS_API in .env");
  process.exit(1);
}

const headers = { Authorization: `Bearer ${CMS_API}` };

// ── Image IDs cache ────────────────────────────────────────────────────
let imageIds = {};
if (fs.existsSync(IDS_FILE)) {
  imageIds = JSON.parse(fs.readFileSync(IDS_FILE, "utf8"));
  console.log(`Loaded ${Object.keys(imageIds).length} cached image IDs`);
}

function saveIds() {
  fs.writeFileSync(IDS_FILE, JSON.stringify(imageIds, null, 2));
}

// ── Sharp encoding ─────────────────────────────────────────────────────
const DESKTOP_MAX = 900;
const MOBILE_MAX = 800;

async function toWebp(filePath, kind) {
  const original = fs.readFileSync(filePath);
  const webp = await sharp(original)
    .resize({
      width: kind === "desktop" ? DESKTOP_MAX : MOBILE_MAX,
      withoutEnlargement: true,
    })
    .webp({ quality: 85, effort: 6 })
    .toBuffer();
  console.log(
    `    ${path.basename(filePath)}: ${(original.length / 1024).toFixed(0)}KB → ${(webp.length / 1024).toFixed(0)}KB (WebP, ${kind})`
  );
  return webp;
}

// ── Strapi helpers ─────────────────────────────────────────────────────
async function uploadWebpBuffer(buffer, webpFileName, altText) {
  const boundary = "----FormBoundary" + Date.now().toString(36);
  const parts = [];

  parts.push(
    `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="files"; filename="${webpFileName}"\r\n` +
      `Content-Type: image/webp\r\n\r\n`
  );
  parts.push(buffer);
  parts.push("\r\n");

  const fileInfo = JSON.stringify({ alternativeText: altText, caption: altText });
  parts.push(
    `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="fileInfo"\r\n` +
      `Content-Type: application/json\r\n\r\n` +
      fileInfo +
      "\r\n"
  );
  parts.push(`--${boundary}--\r\n`);

  const bodyParts = parts.map((p) => (typeof p === "string" ? Buffer.from(p) : p));
  const body = Buffer.concat(bodyParts);

  const res = await fetch(`${CMS_URL}/api/upload`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed for ${webpFileName}: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data[0]?.id;
}

async function putStrapi(endpoint, body) {
  const res = await fetch(`${CMS_URL}${endpoint}`, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PUT ${endpoint} failed: ${res.status} ${text.slice(0, 400)}`);
  }
  return res.json();
}

async function deleteFile(id) {
  const res = await fetch(`${CMS_URL}/api/upload/files/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    console.warn(`  ⚠ DELETE /api/upload/files/${id} failed: ${res.status} ${text.slice(0, 200)}`);
    return false;
  }
  return true;
}

async function getStrapi(endpoint) {
  const res = await fetch(`${CMS_URL}${endpoint}`, { headers });
  if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.status}`);
  return res.json();
}

// ── Team images to convert ────────────────────────────────────────────
const TEAM_IMAGES = [
  // Desktop
  { src: "aboutus-team-member-stefan.jpg", alt: "Hassan - Founder", kind: "desktop" },
  { src: "aboutus-team-member-marko.jpg", alt: "Kris Stigmerkukic - CEO", kind: "desktop" },
  { src: "aboutus-team-member-kris.png", alt: "Marko V. - COO", kind: "desktop" },
  { src: "aboutus-team-member-david.jpg", alt: "Hussain - CCO", kind: "desktop" },
  // Mobile
  { src: "home-team-member-3.png", alt: "Hassan - Founder", kind: "mobile" },
  { src: "home-team-member-1.png", alt: "Kris Stigmerkukic - CEO", kind: "mobile" },
  { src: "home-team-member-2.png", alt: "Marko V. - COO", kind: "mobile" },
  { src: "home-team-member-4.png", alt: "Hussain - CCO", kind: "mobile" },
];

const toWebpName = (originalName) => originalName.replace(/\.(png|jpg|jpeg)$/i, ".webp");

// ── Phase 1: Convert + upload ─────────────────────────────────────────
async function uploadAllWebp() {
  console.log("\n=== CONVERTING & UPLOADING TEAM PHOTOS AS WEBP ===");
  for (const item of TEAM_IMAGES) {
    const srcPath = path.join(ROOT, "src/assets/images", item.src);
    const webpName = toWebpName(item.src);

    if (imageIds[webpName]) {
      console.log(`  ✓ Already uploaded: ${webpName} (id: ${imageIds[webpName]})`);
      continue;
    }

    const buffer = await toWebp(srcPath, item.kind);
    const id = await uploadWebpBuffer(buffer, webpName, item.alt);
    if (!id) throw new Error(`No id returned for ${webpName}`);

    imageIds[webpName] = id;
    saveIds();
    console.log(`  ✓ Uploaded: ${webpName} → id: ${id}`);
  }
}

// ── Phase 2: Reconnect home-page teamMembers ──────────────────────────
async function reconnectTeamMembers() {
  console.log("\n=== RECONNECTING HOME-PAGE TEAM MEMBERS ===");

  const teamDesktopMap = {
    Hassan: "aboutus-team-member-stefan.webp",
    "Kris Stigmerkukic": "aboutus-team-member-marko.webp",
    "Marko V.": "aboutus-team-member-kris.webp",
    Hussain: "aboutus-team-member-david.webp",
  };
  const teamMobileMap = {
    Hassan: "home-team-member-3.webp",
    "Kris Stigmerkukic": "home-team-member-1.webp",
    "Marko V.": "home-team-member-2.webp",
    Hussain: "home-team-member-4.webp",
  };

  const homeRes = await getStrapi(
    "/api/home-page?populate[teamMembers][populate]=*"
  );
  const home = homeRes.data;

  // Strapi v5 quirk: component updates must NOT include `id`
  const teamMembers = home.teamMembers.map((m) => {
    const desktopKey = teamDesktopMap[m.name];
    const mobileKey = teamMobileMap[m.name];
    const desktopId = desktopKey ? imageIds[desktopKey] : null;
    const mobileId = mobileKey ? imageIds[mobileKey] : null;
    if (!desktopId || !mobileId) {
      throw new Error(`Missing WebP id for ${m.name} (desktop=${desktopId}, mobile=${mobileId})`);
    }
    return {
      name: m.name,
      role: m.role,
      bio: m.bio,
      linkedinUrl: m.linkedinUrl,
      desktopPhoto: desktopId,
      mobilePhoto: mobileId,
    };
  });

  await putStrapi(`/api/home-page`, { data: { teamMembers } });
  console.log("  ✓ home-page teamMembers updated to WebP IDs");
}

// ── Phase 3: Delete old non-WebP files + clean image-ids.json ─────────
const OLD_KEYS = [
  "aboutus-team-member-stefan.jpg",
  "aboutus-team-member-marko.jpg",
  "aboutus-team-member-kris.png",
  "aboutus-team-member-david.jpg",
  "home-team-member-3.png",
  "home-team-member-1.png",
  "home-team-member-2.png",
  "home-team-member-4.png",
];

async function cleanupOldFiles() {
  console.log("\n=== DELETING OLD JPG/PNG TEAM FILES ===");
  for (const key of OLD_KEYS) {
    const id = imageIds[key];
    if (!id) {
      console.log(`  ⏭ ${key} not in cache — skipping`);
      continue;
    }
    const ok = await deleteFile(id);
    if (ok) {
      console.log(`  ✓ Deleted ${key} (id: ${id})`);
      delete imageIds[key];
      saveIds();
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────
async function main() {
  console.log(`CMS: ${CMS_URL}\n`);

  await uploadAllWebp();
  await reconnectTeamMembers();
  await cleanupOldFiles();

  console.log("\n=== ALL DONE ===");
  console.log(`Image IDs saved to ${IDS_FILE}`);
}

main().catch((err) => {
  console.error("\nFatal error:", err.message);
  process.exit(1);
});
