/**
 * Upload images to Strapi CMS and connect them to content entries.
 *
 * Usage: node scripts/upload-images.mjs
 *
 * Reads CMS_URL and CMS_API from ../.env
 * Stores uploaded image IDs in scripts/image-ids.json for idempotency.
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

// ── Helpers ────────────────────────────────────────────────────────────
let imageIds = {};
if (fs.existsSync(IDS_FILE)) {
  imageIds = JSON.parse(fs.readFileSync(IDS_FILE, "utf8"));
  console.log(`Loaded ${Object.keys(imageIds).length} cached image IDs`);
}

function saveIds() {
  fs.writeFileSync(IDS_FILE, JSON.stringify(imageIds, null, 2));
}

const MAX_UPLOAD_SIZE = 900 * 1024; // 900KB — stay under nginx 1MB limit

async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".svg") return fs.readFileSync(filePath);

  const original = fs.readFileSync(filePath);
  if (original.length <= MAX_UPLOAD_SIZE) return original;

  console.log(`    Compressing ${path.basename(filePath)} (${(original.length / 1024).toFixed(0)}KB)...`);

  // Convert to WebP for best compression
  const compressed = await sharp(original)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  console.log(`    → ${(compressed.length / 1024).toFixed(0)}KB (WebP)`);
  return compressed;
}

async function uploadImage(filePath, altText) {
  const ext = path.extname(filePath).toLowerCase();
  const key = path.basename(filePath);
  if (imageIds[key]) {
    console.log(`  ✓ Already uploaded: ${key} (id: ${imageIds[key]})`);
    return imageIds[key];
  }

  const fileBuffer = await compressImage(filePath);
  // If we compressed to WebP, use .webp extension
  const originalName = path.basename(filePath);
  const wasCompressed = ext !== ".svg" && fs.readFileSync(filePath).length > MAX_UPLOAD_SIZE;
  const fileName = wasCompressed ? originalName.replace(/\.(png|jpg|jpeg)$/i, ".webp") : originalName;

  // Build multipart form data manually
  const boundary = "----FormBoundary" + Date.now().toString(36);
  const parts = [];

  // File part
  const fileExt = path.extname(fileName).toLowerCase();
  const mimeTypes = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
  };
  const mime = mimeTypes[fileExt] || "application/octet-stream";

  parts.push(
    `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="files"; filename="${fileName}"\r\n` +
      `Content-Type: ${mime}\r\n\r\n`
  );
  parts.push(fileBuffer);
  parts.push("\r\n");

  // fileInfo part (alternativeText)
  const fileInfo = JSON.stringify({ alternativeText: altText, caption: altText });
  parts.push(
    `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="fileInfo"\r\n` +
      `Content-Type: application/json\r\n\r\n` +
      fileInfo +
      "\r\n"
  );

  parts.push(`--${boundary}--\r\n`);

  // Combine parts into a single Buffer
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
    console.error(`  ✗ Upload failed for ${key}: ${res.status} ${text}`);
    return null;
  }

  const data = await res.json();
  const id = data[0]?.id;
  if (id) {
    imageIds[key] = id;
    saveIds();
    console.log(`  ✓ Uploaded: ${key} → id: ${id}`);
  }
  return id;
}

async function putStrapi(endpoint, body) {
  const res = await fetch(`${CMS_URL}${endpoint}`, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`  ✗ PUT ${endpoint} failed: ${res.status} ${text.slice(0, 300)}`);
    return null;
  }
  return res.json();
}

async function getStrapi(endpoint) {
  const res = await fetch(`${CMS_URL}${endpoint}`, { headers });
  if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.status}`);
  return res.json();
}

// ── Image paths ────────────────────────────────────────────────────────
const img = (name) => path.join(ROOT, "src/assets/images", name);
const svg = (name) => path.join(ROOT, "src/imports", name);
const pub = (name) => path.join(ROOT, "public/assets", name);

// ── Phase 1: Upload all images ─────────────────────────────────────────
async function uploadAll() {
  console.log("\n=== UPLOADING SERVICE MAIN IMAGES ===");
  const serviceImages = [
    { file: "servicespageslisting-services-grid-mobile-app.png", alt: "Mobile App Development" },
    { file: "servicespageslisting-services-grid-web-dev.png", alt: "Web Development" },
    { file: "servicespageslisting-services-grid-web-app.png", alt: "Web App Development" },
    { file: "servicespageslisting-services-grid-ecommerce.png", alt: "Ecommerce Development" },
    { file: "servicespageslisting-services-grid-mvp.png", alt: "MVP Development" },
    { file: "servicespageslisting-services-grid-api.png", alt: "API Integration" },
  ];
  for (const s of serviceImages) await uploadImage(img(s.file), s.alt);

  console.log("\n=== UPLOADING SERVICE CONTENT SECTION IMAGES ===");
  await uploadImage(img("servicepage-why-choose-built-beyond-img-overlay.png"), "Built beyond the UI");
  await uploadImage(img("servicepage-why-choose-native-cross-platform-img.png"), "Technology approach");
  await uploadImage(img("servicepage-why-choose-real-world-img.png"), "Real-world readiness");

  console.log("\n=== UPLOADING CASE STUDY AVATAR ===");
  await uploadImage(img("servicepage-case-study-avatar.jpg"), "Client avatar");

  console.log("\n=== UPLOADING TEAM DESKTOP PHOTOS ===");
  await uploadImage(img("aboutus-team-member-stefan.jpg"), "Hassan - Founder");
  await uploadImage(img("aboutus-team-member-marko.jpg"), "Kris Stigmerkukic - CEO");
  await uploadImage(img("aboutus-team-member-kris.png"), "Marko V. - COO");
  await uploadImage(img("aboutus-team-member-david.jpg"), "Hussain - CCO");

  console.log("\n=== UPLOADING TEAM MOBILE PHOTOS ===");
  await uploadImage(img("home-team-member-3.png"), "Hassan - Founder");
  await uploadImage(img("home-team-member-1.png"), "Kris Stigmerkukic - CEO");
  await uploadImage(img("home-team-member-2.png"), "Marko V. - COO");
  await uploadImage(img("home-team-member-4.png"), "Hussain - CCO");

  console.log("\n=== UPLOADING HERO TECH LOGO SVGS ===");
  await uploadImage(pub("Aws_logo.svg"), "AWS");
  await uploadImage(pub("pixijs.svg"), "Pixi.js");
  await uploadImage(pub("371585.svg"), "TypeScript");

  console.log("\n=== UPLOADING OUR STACK LOGO SVGS ===");
  const stackLogos = [
    { file: "aboutus-our-stack-docker.svg", alt: "Docker" },
    { file: "aboutus-our-stack-google-cloud.svg", alt: "Google Cloud" },
    { file: "aboutus-our-stack-kubernetes.svg", alt: "Kubernetes" },
    { file: "aboutus-our-stack-langgraph.svg", alt: "LangGraph" },
    { file: "aboutus-our-stack-angular.svg", alt: "Angular" },
    { file: "aboutus-our-stack-flutter-vector.svg", alt: "Flutter" },
    { file: "aboutus-our-stack-nextjs.svg", alt: "Next.js" },
    { file: "aboutus-our-stack-react.svg", alt: "React" },
    { file: "aboutus-our-stack-springboot.svg", alt: "Spring Boot" },
    { file: "aboutus-our-stack-aws.svg", alt: "AWS" },
    { file: "aboutus-our-stack-java.svg", alt: "Java" },
    { file: "aboutus-our-stack-kafka.svg", alt: "Apache Kafka" },
    { file: "aboutus-our-stack-postgresql.svg", alt: "PostgreSQL" },
    { file: "aboutus-our-stack-typescript.svg", alt: "TypeScript" },
    { file: "aboutus-our-stack-python.svg", alt: "Python" },
    { file: "aboutus-our-stack-swift-icon.svg", alt: "Swift" },
    { file: "aboutus-our-stack-pixijs-main.svg", alt: "PixiJS" },
    { file: "aboutus-our-stack-kotlin.svg", alt: "Kotlin" },
    { file: "aboutus-our-stack-redis-content.svg", alt: "Redis" },
    { file: "aboutus-our-stack-fastapi.svg", alt: "FastAPI" },
  ];
  for (const l of stackLogos) await uploadImage(svg(l.file), l.alt);

  console.log("\nAll uploads complete.");
}

// ── Phase 2: Connect images to entries ──────────────────────────────────
async function connectServices() {
  console.log("\n=== CONNECTING SERVICE IMAGES ===");

  const slugToImage = {
    "mobile-app-development": "servicespageslisting-services-grid-mobile-app.png",
    "web-development": "servicespageslisting-services-grid-web-dev.png",
    "web-app-development": "servicespageslisting-services-grid-web-app.png",
    "ecommerce-development": "servicespageslisting-services-grid-ecommerce.png",
    "mvp-development": "servicespageslisting-services-grid-mvp.png",
    "api-integration": "servicespageslisting-services-grid-api.png",
  };

  const contentImages = [
    imageIds["servicepage-why-choose-built-beyond-img-overlay.png"],
    imageIds["servicepage-why-choose-native-cross-platform-img.png"],
    imageIds["servicepage-why-choose-real-world-img.png"],
  ];

  const avatarId = imageIds["servicepage-case-study-avatar.jpg"];

  // Get all services
  const servicesRes = await getStrapi(
    "/api/services?populate[serviceContent][populate]=*&populate[caseStudy][populate]=*&populate[seo][populate]=*&populate[image]=true&sort=createdAt:asc"
  );

  for (const service of servicesRes.data) {
    const mainImageFile = slugToImage[service.slug];
    const mainImageId = mainImageFile ? imageIds[mainImageFile] : null;

    if (!mainImageId) {
      console.log(`  ⏭ Skipping ${service.slug} (no image mapped)`);
      continue;
    }

    console.log(`  → ${service.slug}`);

    // Build update payload
    const data = {
      image: mainImageId,
    };

    // Service content images — no id for component replacement
    if (service.serviceContent && service.serviceContent.length >= 3) {
      data.serviceContent = service.serviceContent.map((block, i) => ({
        kicker: block.kicker,
        title: block.title,
        paragraph: block.paragraph,
        image: contentImages[i] || null,
      }));
    }

    // Case study (no "image" field — only clientAvatar exists)
    if (service.caseStudy) {
      data.caseStudy = {
        clientHandle: service.caseStudy.clientHandle,
        clientName: service.caseStudy.clientName,
        heading: service.caseStudy.heading,
        ctaText: service.caseStudy.ctaText,
        clientAvatar: avatarId,
      };
    }

    // SEO og:image
    if (service.seo) {
      data.seo = {
        metaTitle: service.seo.metaTitle,
        metaDescription: service.seo.metaDescription,
        ogImage: mainImageId,
      };
    }

    const result = await putStrapi(`/api/services/${service.documentId}`, { data });
    if (result) console.log(`    ✓ Connected`);
  }
}

async function connectHomePage() {
  console.log("\n=== CONNECTING HOME PAGE IMAGES ===");

  const homeRes = await getStrapi(
    "/api/home-page?populate[teamMembers][populate]=*&populate[heroTechLogos][populate]=*"
  );
  const home = homeRes.data;

  // Team member photo mapping (by name → file)
  // Team photos are stored as WebP — see scripts/convert-team-to-webp.mjs
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

  // For single types, component updates must NOT include `id` (Strapi v5 replaces the array)
  const teamMembers = home.teamMembers.map((m) => ({
    name: m.name,
    role: m.role,
    bio: m.bio,
    linkedinUrl: m.linkedinUrl,
    desktopPhoto: imageIds[teamDesktopMap[m.name]] || null,
    mobilePhoto: imageIds[teamMobileMap[m.name]] || null,
  }));

  // Hero tech logo mapping (by name → file)
  const techLogoMap = {
    AWS: "Aws_logo.svg",
    "Pixi.js": "pixijs.svg",
    TypeScript: "371585.svg",
  };

  const heroTechLogos = home.heroTechLogos.map((l) => ({
    name: l.name,
    logo: imageIds[techLogoMap[l.name]] || null,
  }));

  const result = await putStrapi(`/api/home-page`, {
    data: { teamMembers, heroTechLogos },
  });
  if (result) console.log("  ✓ Home page images connected");
}

async function connectAboutUsPage() {
  console.log("\n=== CONNECTING ABOUT US PAGE IMAGES ===");

  const aboutRes = await getStrapi("/api/about-us-page?populate[ourStackLogos][populate]=*");
  const about = aboutRes.data;

  const logoFileMap = {
    Docker: "aboutus-our-stack-docker.svg",
    "Google Cloud": "aboutus-our-stack-google-cloud.svg",
    Kubernetes: "aboutus-our-stack-kubernetes.svg",
    LangGraph: "aboutus-our-stack-langgraph.svg",
    Angular: "aboutus-our-stack-angular.svg",
    Flutter: "aboutus-our-stack-flutter-vector.svg",
    "Next.js": "aboutus-our-stack-nextjs.svg",
    React: "aboutus-our-stack-react.svg",
    "Spring Boot": "aboutus-our-stack-springboot.svg",
    AWS: "aboutus-our-stack-aws.svg",
    Java: "aboutus-our-stack-java.svg",
    Kafka: "aboutus-our-stack-kafka.svg",
    "Apache Kafka": "aboutus-our-stack-kafka.svg",
    PostgreSQL: "aboutus-our-stack-postgresql.svg",
    TypeScript: "aboutus-our-stack-typescript.svg",
    Python: "aboutus-our-stack-python.svg",
    Swift: "aboutus-our-stack-swift-icon.svg",
    PixiJS: "aboutus-our-stack-pixijs-main.svg",
    Kotlin: "aboutus-our-stack-kotlin.svg",
    Redis: "aboutus-our-stack-redis-content.svg",
    FastAPI: "aboutus-our-stack-fastapi.svg",
  };

  // For single types, component updates must NOT include `id`
  const ourStackLogos = about.ourStackLogos.map((l) => ({
    name: l.name,
    logo: imageIds[logoFileMap[l.name]] || null,
  }));

  const result = await putStrapi(`/api/about-us-page`, {
    data: { ourStackLogos },
  });
  if (result) console.log("  ✓ About Us page logos connected");
}

async function connectBlogPosts() {
  console.log("\n=== CONNECTING BLOG POST HERO IMAGES ===");

  // Blog posts don't have a direct service mapping, so we'll assign
  // service images in order based on the 6 available service images
  // and cycle through them for the 9 blog posts.
  const serviceImageFiles = [
    "servicespageslisting-services-grid-mobile-app.png",
    "servicespageslisting-services-grid-web-dev.png",
    "servicespageslisting-services-grid-web-app.png",
    "servicespageslisting-services-grid-ecommerce.png",
    "servicespageslisting-services-grid-mvp.png",
    "servicespageslisting-services-grid-api.png",
  ];

  const blogsRes = await getStrapi("/api/blog-posts?populate=*&sort=date:desc");

  for (let i = 0; i < blogsRes.data.length; i++) {
    const blog = blogsRes.data[i];
    const imageFile = serviceImageFiles[i % serviceImageFiles.length];
    const imgId = imageIds[imageFile];

    if (!imgId) {
      console.log(`  ⏭ Skipping ${blog.slug} (no image)`);
      continue;
    }

    const result = await putStrapi(`/api/blog-posts/${blog.documentId}`, {
      data: { heroImage: imgId },
    });
    if (result) console.log(`  ✓ ${blog.slug} → ${imageFile}`);
  }
}

// ── Main ───────────────────────────────────────────────────────────────
async function main() {
  console.log(`CMS: ${CMS_URL}\n`);

  await uploadAll();
  await connectServices();
  await connectHomePage();
  await connectAboutUsPage();
  await connectBlogPosts();

  console.log("\n=== ALL DONE ===");
  console.log(`Image IDs saved to ${IDS_FILE}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
