/**
 * Update caseStudy.highlights for Strapi services.
 *
 * Usage:
 *   node scripts/update-service-highlights.mjs          # skip services that already have highlights
 *   node scripts/update-service-highlights.mjs --force  # overwrite existing highlights
 *
 * Reads CMS_URL and CMS_API from ../.env
 * Skips "mobile-app-development" (already populated).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

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

const FORCE = process.argv.includes("--force");
const SKIP_SLUG = "mobile-app-development";

const headers = {
  Authorization: `Bearer ${CMS_API}`,
  "Content-Type": "application/json",
};

// ── Copy to load ──────────────────────────────────────────────────────
const HIGHLIGHTS = [
  {
    slug: "web-development",
    highlights: [
      "Next.js & React development with server-side rendering",
      "Core Web Vitals optimization & performance tuning",
      "SEO-ready architecture & structured data implementation",
    ],
  },
  {
    slug: "web-app-development",
    highlights: [
      "Complex web app architecture & state management",
      "Real-time dashboards & WebSocket integration",
      "Authentication, authorization & role-based access control",
    ],
  },
  {
    slug: "ecommerce-development",
    highlights: [
      "Headless commerce storefront development",
      "Payment gateway integration & checkout optimization",
      "Product catalog, cart & inventory sync",
    ],
  },
  {
    slug: "mvp-development",
    highlights: [
      "Full-stack MVP build from concept to launch",
      "Authentication, billing & Stripe integration",
      "Analytics, deployment & launch-ready infrastructure",
    ],
  },
  {
    slug: "api-integration",
    highlights: [
      "Third-party API integration (payments, CRM, SaaS tools)",
      "Custom data pipelines & ETL workflows",
      "Webhook handling, sync logic & error-resilient retries",
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────
async function fetchServiceBySlug(slug) {
  const qs = new URLSearchParams();
  qs.set("filters[slug][$eq]", slug);
  qs.set("populate[caseStudy][populate]", "*");
  const url = `${CMS_URL}/api/services?${qs.toString()}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`GET ${url} → ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  const entry = json.data?.[0];
  if (!entry) throw new Error(`Service not found for slug: ${slug}`);
  return entry;
}

async function updateCaseStudyHighlights(service, highlightTexts) {
  const cs = service.caseStudy || {};
  const body = {
    data: {
      caseStudy: {
        clientHandle: cs.clientHandle,
        clientName: cs.clientName,
        heading: cs.heading,
        ctaText: cs.ctaText,
        clientAvatar: cs.clientAvatar?.id ?? null,
        highlights: highlightTexts.map((text) => ({ text })),
      },
    },
  };

  const url = `${CMS_URL}/api/services/${service.documentId}?populate[caseStudy][populate]=*`;
  const res = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`PUT ${url} → ${res.status} ${text}`);
  }
  const json = JSON.parse(text);
  return json.data?.caseStudy?.highlights ?? [];
}

// ── Main ───────────────────────────────────────────────────────────────
(async () => {
  let failed = 0;
  for (const { slug, highlights } of HIGHLIGHTS) {
    if (slug === SKIP_SLUG) {
      console.log(`→ ${slug}: skipped (explicit skip list)`);
      continue;
    }
    try {
      const service = await fetchServiceBySlug(slug);
      const existing = service.caseStudy?.highlights ?? [];
      if (existing.length > 0 && !FORCE) {
        console.log(
          `→ ${slug}: skipped (already has ${existing.length} highlights — pass --force to overwrite)`,
        );
        continue;
      }
      const updated = await updateCaseStudyHighlights(service, highlights);
      console.log(`✓ ${slug}: PUT 200 (${updated.length} highlights)`);
      updated.forEach((h, i) => console.log(`    ${i + 1}. ${h.text}`));
    } catch (err) {
      failed += 1;
      console.error(`✗ ${slug}: ${err.message}`);
    }
  }
  if (failed > 0) {
    console.error(`\n${failed} update(s) failed.`);
    process.exit(1);
  }
  console.log("\nDone.");
})();
