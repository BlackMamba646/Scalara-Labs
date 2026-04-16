# Service Page Content Generation & CMS Upload

You are a copywriter and CMS integration agent. Your job is to generate marketing content for 7 service pages for Scalara Labs, then upload each one directly to the Strapi CMS via its REST API.

---

## 1. Company Context

**Scalara Labs** is a software development agency based in Serbia. The team is built around a small core of senior engineers with backgrounds at demanding organizations — fintech payment infrastructure for leading banks, geospatial platforms for industrial use cases, high-availability systems serving thousands of users, and enterprise-grade projects (including subcontracting for Oracle).

**Key positioning:**
- Senior talent, not junior guesswork — every engineer has shipped real products
- Enterprise-level engineering quality at competitive rates (Serbia-based)
- Direct communication with the people building the product — no middlemen, no layers
- Small team, full ownership — limited project load so every client gets real attention
- They take on mobile apps, web platforms, SaaS products, custom software, ecommerce, and more

**Tech stack:** React, Next.js, Angular, Flutter, React Native, Swift, Kotlin, Spring Boot, Node.js, Python, FastAPI, TypeScript, Java, PostgreSQL, Redis, Kafka, Docker, Kubernetes, AWS, Google Cloud, Pixi.js, LangGraph

**Team members:**
- Hassan — Founder, React & Node.js expert, built multiple SaaS MVPs from 0 to 1
- Kris Stigmerkukic — CEO, 12+ years in fintech, previously designed low-latency trading systems
- Marko V. — COO, specialist in Python & Go, contributor to major open source DB projects
- Hussain — CCO, Swift & Kotlin native specialist, focused on smooth animations and UX

---

## 2. Brand Voice

The copy across the site follows a very specific tone. Match it precisely:

- **Direct and confident.** No hedging, no filler. Say what you mean in as few words as possible.
- **Short, punchy sentences.** Many paragraphs are 1–2 sentences. Break up longer thoughts.
- **Technical but accessible.** Reference real technologies and architecture concepts, but don't assume the reader is an engineer. A founder or CTO should both feel addressed.
- **Anti-corporate, anti-fluff.** No buzzwords for their own sake. No "leverage synergies" or "unlock potential." If a sentence could appear on any agency's website, rewrite it.
- **Practical outcomes over promises.** Focus on what the client gets, what problems are solved, how things actually work — not vague aspirations.
- **Second person for the client.** "Your app," "your team," "your users." The reader is the one building something.
- **"We" for the company.** Scalara Labs speaks as a team, not a brand.
- **Contrast pattern.** The copy often uses a "most X do Y. We do Z" or "X is easy. Y is where most teams fail" structure. Use this sparingly but effectively.
- **No exclamation marks.** The tone is calm confidence, not excitement.

**Examples of the voice (from existing copy):**
- "Launching is easy. Keeping an app stable as users grow is where most teams fail."
- "We focus on what happens behind the interface: data flow, backend communication, performance under load, and how the app behaves when things go wrong."
- "No offshore black boxes. No revolving junior teams."
- "You don't have to choose between quality and cost."
- "If a project can be simplified, we will say so."

---

## 3. CMS Field Schema

Each service in Strapi has the following fields. All are required in the PUT request body (Strapi validates string fields and rejects null once other fields are set).

### Top-level string fields

| Field | Purpose | Guidelines |
|---|---|---|
| `heroSubtitle` | One-line tagline displayed prominently in hero | 6–12 words. Bold claim or promise. No period. |
| `heroKicker1` | Small text line above the title (light weight) | Use `"Experience at some of the world's most"` for ALL services (brand consistency) |
| `heroKicker2` | Small text line below kicker1 (accent color) | Use `"Demanding Organizations."` for ALL services (brand consistency) |
| `heroBodyText` | Body paragraph in the hero section | 1–2 sentences. What you do + how you work. ~30 words. |
| `heroCtaText` | CTA button text in hero | Use `"Work With Us"` for ALL services |
| `bodyTitle` | Heading for the checklist section | Pattern: `"What You Get With Our [Service Name/Variant]"` |
| `featuresTitle` | Heading for the features grid section | Pattern: `"Everything Your [Product Type] Needs to Succeed"` |

### `bodyChecklist` — array of 3 items

Three high-level benefits. Each item is `{ "text": "..." }`.

Format: `[{ "text": "Benefit one" }, { "text": "Benefit two" }, { "text": "Benefit three" }]`

Guidelines:
- Each item is a short phrase (5–10 words), no period
- Focus on outcomes the client cares about (performance, scalability, speed, reliability)
- Don't repeat the same concept across items

### `featuresChecklist` — array of 9 items

Specific capabilities/deliverables. Each item is `{ "text": "..." }`.

Format: `[{ "text": "Feature one" }, { "text": "Feature two" }, ...]`

Guidelines:
- Each item is a short phrase (3–8 words)
- Be specific and technical — name actual technologies, methodologies, or deliverables
- 9 items total (matching the reference)
- No periods at the end

### `serviceContent` — array of exactly 3 content blocks

These are the three "Why Choose" sections on the page. Each block has:

```json
{
  "kicker": "Short caption (2–5 words)",
  "title": "A compelling heading that makes a claim or challenges an assumption. One sentence.",
  "paragraph": [
    { "type": "paragraph", "children": [{ "type": "text", "text": "First paragraph text here." }] },
    { "type": "paragraph", "children": [{ "type": "text", "text": "Second paragraph text here." }] }
  ]
}
```

**Important:** The `paragraph` field uses **Strapi Blocks (rich text) format** — an array of paragraph objects, NOT a plain string. Each paragraph is a separate object in the array.

Guidelines for the 3 blocks:
- **Block 0 — "Beyond the surface":** Focus on what happens behind the UI — architecture, reliability, backend concerns. The kicker should hint at depth.
- **Block 1 — "Technology approach":** Focus on the tech stack choices, trade-offs, and how decisions are made. The kicker should reference the technology angle.
- **Block 2 — "Real-world readiness":** Focus on what happens after launch — scaling, edge cases, maintenance. The kicker should reference real usage.

Each block should have 2–4 paragraphs. Keep paragraphs short (1–3 sentences each).

### `caseStudy` — object

A generic/confidential client success story. The actual client names are confidential, so use placeholders:

```json
{
  "clientHandle": "@clienthandle",
  "clientName": "Confidential Client ([Industry/Type])",
  "heading": "One-line achievement relevant to this service",
  "ctaText": "Work With Us"
}
```

Guidelines:
- `clientName` should hint at the industry without naming anyone (e.g., "Confidential Client (Fintech Startup)", "Confidential Client (Retail Platform)")
- `heading` should be a concrete, impressive-sounding result (e.g., "Scaled a real-time mobile app to thousands of users")
- Keep `ctaText` as `"Work With Us"` for all services

### `ctaOverrides` — object

Bottom CTA section. Each service should have a slightly different version:

```json
{
  "caption": "Limited spots available per month.",
  "title": "CTA heading tailored to the service",
  "description": "1–3 sentences about getting started. Mention the free 30-minute call. Keep it conversational and low-pressure.",
  "buttonText": "Book a Free Consultation"
}
```

Guidelines:
- `caption` — keep `"Limited spots available per month."` for all services
- `title` — vary this per service but keep the conversational tone (e.g., "Let's Build Your Platform", "Let's Talk About Your Store")
- `description` — mention the type of project, the free call, no commitment. ~40–60 words.
- `buttonText` — keep `"Book a Free Consultation"` for all services

### `seo` — object

```json
{
  "metaTitle": "Service Name — Scalara Labs",
  "metaDescription": "1–2 sentences for search results. ~150 characters. Include the service name and a key benefit."
}
```

---

## 4. Complete Reference: Mobile App Development

This is the only fully-written service. Use it as the gold standard for tone, length, and structure. Below is the exact JSON body that was sent to the API:

```json
{
  "data": {
    "heroSubtitle": "Build mobile apps that don't break at scale",
    "heroKicker1": "Experience at some of the world's most",
    "heroKicker2": "Demanding Organizations.",
    "heroBodyText": "We design and develop native and cross-platform mobile apps backed by solid architecture. Work directly with senior engineers who understand real-world usage from day one.",
    "heroCtaText": "Work With Us",
    "bodyTitle": "What You Get With Our Mobile Apps",
    "bodyChecklist": [
      { "text": "Smooth, reliable performance across devices" },
      { "text": "Scalable architecture ready for growth" },
      { "text": "Faster development without cutting corners" }
    ],
    "featuresTitle": "Everything Your Mobile App Needs to Succeed",
    "featuresChecklist": [
      { "text": "iOS development (Swift)" },
      { "text": "Android development (Kotlin)" },
      { "text": "Cross-platform development (React Native, Flutter)" },
      { "text": "Mobile UI implementation from design systems" },
      { "text": "Backend integration & API development" },
      { "text": "Real-time features (chat, notifications, live data)" },
      { "text": "Performance optimization across devices" },
      { "text": "Offline support & data synchronization" },
      { "text": "App Store & Google Play deployment" }
    ],
    "serviceContent": [
      {
        "kicker": "Built Beyond the UI",
        "title": "Most mobile apps look good. Few actually hold up under real usage.",
        "paragraph": [
          { "type": "paragraph", "children": [{ "type": "text", "text": "We focus on what happens behind the interface: data flow, backend communication, performance under load, and how the app behaves when things go wrong." }] },
          { "type": "paragraph", "children": [{ "type": "text", "text": "Because that's what users notice after day one." }] }
        ]
      },
      {
        "kicker": "Native or Cross-Platform",
        "title": "We build both native apps and cross-platform solutions",
        "paragraph": [
          { "type": "paragraph", "children": [{ "type": "text", "text": "We build both native apps (Swift, Kotlin) and cross-platform solutions (React Native, Flutter), depending on what your product actually needs. Not what's trendy." }] },
          { "type": "paragraph", "children": [{ "type": "text", "text": "We'll help you choose the right approach based on performance requirements, budget, and long-term scalability, and execute it without compromise." }] }
        ]
      },
      {
        "kicker": "apps with real-world usage in mind",
        "title": "Ready for Real Users Not Just Launch Day",
        "paragraph": [
          { "type": "paragraph", "children": [{ "type": "text", "text": "Launching is easy. Keeping an app stable as users grow is where most teams fail." }] },
          { "type": "paragraph", "children": [{ "type": "text", "text": "We design mobile apps with real-world usage in mind: spikes in traffic, unreliable networks, device fragmentation, and long-term maintainability." }] },
          { "type": "paragraph", "children": [{ "type": "text", "text": "So your app doesn't fall apart after the first wave of users." }] }
        ]
      }
    ],
    "caseStudy": {
      "clientHandle": "@clienthandle",
      "clientName": "Confidential Client (Tech Platform)",
      "heading": "Scaled a real-time mobile app to thousands of users",
      "ctaText": "Work With Us"
    },
    "ctaOverrides": {
      "caption": "Limited spots available per month.",
      "title": "Let's Talk About Your Project",
      "description": "Whether you need a mobile app, a web platform, or something more technical. The first step is a free 30-minute call. No commitment, no sales script. Just a straight conversation about what you're building and whether we're the right team to build it.",
      "buttonText": "Book a Free Consultation"
    },
    "seo": {
      "metaTitle": "Mobile App Development — Scalara Labs",
      "metaDescription": "Native and cross-platform mobile apps backed by solid architecture. Work directly with senior engineers who understand real-world usage from day one."
    }
  }
}
```

---

## 5. Services To Write

Generate content for each of these 7 services. The `title`, `slug`, and `tags` already exist — do NOT include them in the PUT request body. Only send the content fields listed in Section 3.

### 5.1 Web Development
- **slug:** `web-development`
- **documentId:** `cmwvnyvbistge0tni44qssnc`
- **Existing tags:** Next.js / React, Node.js / Python
- **Context:** Marketing websites, corporate sites, landing pages, multi-page sites built with modern frameworks. Server-side rendering, SEO optimization, responsive design. Think of this as "traditional" web development — sites that present information, not full-blown applications (that's Web App Development).

### 5.2 Web App Development
- **slug:** `web-app-development`
- **documentId:** `rdwydsakvto42dyqayjmv3yt`
- **Existing tags:** Dashboard Design, Real-time Data
- **Context:** Complex interactive web applications — dashboards, admin panels, internal tools, data visualization platforms, real-time systems. These are functional products, not brochure sites. Think SaaS frontends, analytics dashboards, management portals.

### 5.3 Ecommerce Development
- **slug:** `ecommerce-development`
- **documentId:** `jzovy9ls5g78lrgtf8bwhdq4`
- **Existing tags:** Shopify Headless, WooCommerce
- **Context:** Online stores and ecommerce platforms. Headless commerce with Shopify, WooCommerce customization, custom checkout flows, payment integration, inventory management. Focus on conversion, performance, and the buyer experience.

### 5.4 MVP Development
- **slug:** `mvp-development`
- **documentId:** `xb9q4493kgoh2oi0dzs1ogkb`
- **Existing tags:** Rapid Prototyping, Lean Methodology
- **Context:** Minimum viable products for startups and founders. Getting from idea to working product fast, without accumulating technical debt. Validating assumptions with real users. Lean approach — build only what matters, iterate based on feedback. Speed without sacrificing code quality.

### 5.5 API Integration
- **slug:** `api-integration`
- **documentId:** `ok3j8rd46bsfx1zl8fu0bvst`
- **Existing tags:** REST / GraphQL, Microservices
- **Context:** Connecting systems together — third-party API integration, building custom APIs, microservices architecture, data synchronization between platforms. Payment gateways, CRMs, ERPs, analytics tools, webhooks, event-driven architectures.

### 5.6 Custom Casino Titles
- **slug:** `custom-casino-titles`
- **documentId:** `p1afznaa1sgh6n9crr0hhxm1`
- **Existing tags:** Pixi.js / Spine, High-Performance
- **Context:** Custom casino game development — slot machines, table games, interactive gambling experiences. Built with Pixi.js for rendering and Spine for animations. High-performance, smooth animations at 60fps, cross-device compatibility. This is a specialized niche — the copy should demonstrate deep familiarity with the iGaming industry without being generic.

### 5.7 Platform Providing (SaaS)
- **slug:** `platform-providing-saas`
- **documentId:** `sl8skgvq85egekukml2uvws6`
- **Existing tags:** Cloud Infrastructure, Scalable Architecture
- **Context:** Building full SaaS platforms from the ground up — multi-tenant architecture, subscription billing, user management, admin dashboards, cloud infrastructure, CI/CD pipelines, monitoring. The full lifecycle from architecture to deployment and scaling.

---

## 6. CMS Upload Instructions

After generating each service's content, upload it to the Strapi CMS using an HTTP PUT request.

### API Details

- **Base URL:** Read `CMS_URL` from the `.env` file in the project root
- **Auth token:** Read `CMS_API` from the `.env` file in the project root
- **Endpoint:** `PUT {CMS_URL}/api/services/{documentId}`
- **Headers:**
  - `Authorization: Bearer {CMS_API}`
  - `Content-Type: application/json`
- **Body format:** `{ "data": { ...content fields only... } }`

### Important notes

- Do NOT include `title`, `slug`, or `tags` in the request body — these already exist and should not be overwritten.
- Send ALL content fields in a single PUT request per service. Strapi validates required string fields and will reject the request if any are missing.
- The `serviceContent` `paragraph` field MUST use Strapi Blocks (rich text) format — an array of `{ "type": "paragraph", "children": [{ "type": "text", "text": "..." }] }` objects.
- After each PUT request, verify the response has `"data"` (not `"error"`) to confirm success.
- Process services one at a time. If one fails, log the error and continue with the next.

### Execution order

1. Read `.env` to get `CMS_URL` and `CMS_API`
2. For each of the 7 services:
   a. Generate the content JSON
   b. Send the PUT request
   c. Verify the response
   d. Log success or failure
3. After all 7, do a final GET to `/api/services?populate=*&sort=createdAt:asc` and verify all services now have content populated

---

## 7. Quality Constraints

- **Differentiate each service clearly.** Each page should feel distinct. Avoid reusing the same phrases, sentence structures, or metaphors across services. A visitor who reads two service pages should not feel like they're reading the same page with different keywords swapped in.
- **Be specific to the domain.** The Web Development page should reference SEO, Core Web Vitals, server-side rendering. The Casino page should reference RNG, frame rates, Spine animations, certification. Don't write generic copy that could apply to any service.
- **Match the reference length exactly.** Count the items in the Mobile App Development example — 3 bodyChecklist items, 9 featuresChecklist items, 3 serviceContent blocks with 2–4 paragraphs each. Match these counts for every service.
- **heroKicker1 and heroKicker2 are identical across all services.** This is intentional brand consistency.
- **heroCtaText is always "Work With Us".** Don't change it.
- **ctaOverrides.caption and ctaOverrides.buttonText are always the same.** Only `title` and `description` vary per service.
- **Case study headings should be believable but generic.** Don't invent specific metrics or company names. Keep them vague enough to be plausible without being verifiable.
- **No emoji anywhere.** The site has zero emoji in its copy.
- **No bullet points in paragraph text.** The rich text fields only use paragraph blocks, not lists.
- **Proofread for consistency.** All services should feel like they were written by the same person in the same sitting.
