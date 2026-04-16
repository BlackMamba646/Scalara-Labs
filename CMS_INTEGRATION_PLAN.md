# CMS Integration Plan

Guide for connecting each page to the Strapi CMS. Each page should be handled independently following these steps.

## Environment

- **CMS URL**: Configured in `.env` as `CMS_URL`
- **API Token**: Configured in `.env` as `CMS_API`
- Both are already set up. Do NOT hardcode these values anywhere.

## Step 1: Create the Strapi fetch utility

Before any page integration, create `src/lib/strapi.ts` with a reusable fetch function:

```typescript
const CMS_URL = process.env.CMS_URL || "http://localhost:1337";
const CMS_API = process.env.CMS_API;

export async function fetchStrapi<T>(path: string): Promise<T> {
  const res = await fetch(`${CMS_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${CMS_API}`,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Strapi fetch failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return json.data;
}
```

This util is server-side only (uses `process.env` without `NEXT_PUBLIC_` prefix). It must be called from Server Components or Server Actions only.

## Step 2: Integrate each page

For each page, the pattern is the same:

1. **Fetch data in the page's Server Component** (`page.tsx`) using `fetchStrapi()`
2. **Pass data as props** to section components
3. **Remove hardcoded data** from section components
4. **Add TypeScript interfaces** for the CMS data shapes

### Important rules

- **Do NOT change component styling or layout** -- only replace data sources
- **Do NOT handle images yet** -- skip any `image`, `heroImage`, or media fields for now. Keep existing placeholder/static images as-is
- **Keep `"use client"` sections as-is** -- pass CMS data via props from the Server Component parent
- **Keep existing fallback text** as default prop values where reasonable (in case CMS returns null)
- **Use `populate=*`** on all queries to get nested components in a single request

---

## Page-by-page reference

### Global (Header + Footer)

**Endpoint**: `/api/global?populate=*`

**Fields available**:
| Field | Type | Use |
|---|---|---|
| `siteName` | string | Site name |
| `headerCtaText` | string | Header CTA button text |
| `footerTagline` | string | Footer tagline paragraph |
| `footerCtaText` | string | Footer CTA link text |
| `footerCopyrightText` | string | Copyright line |
| `footerCompanyLinks` | array | `[{ label, href }]` |
| `footerServicesLinks` | array | `[{ label, href }]` |
| `defaultSeo` | object | `{ metaTitle, metaDescription }` |

**Components to modify**:
- `src/components/shared/Header/` -- replace hardcoded nav CTA text
- `src/components/shared/Footer/` -- replace hardcoded link arrays, tagline, copyright

**Strategy**: Fetch global data in `src/app/layout.tsx` and pass to Header/Footer.

---

### Home Page

**Endpoint**: `/api/home-page?populate=*`

**Fields available**:
| Field | Type | Use |
|---|---|---|
| `heroRating` | number | Star rating count |
| `heroHeadingSerif` | string | "Senior Software Engineers." |
| `heroHeadingBold` | string | "Startup Speed." |
| `heroHeadingGradient` | string | "Enterprise Quality." |
| `heroCtaText` | string | CTA button text |
| `heroDescription` | string | Hero paragraph |
| `heroTechLogos` | array | `[{ name }]` -- tech logo names |
| `servicesCaption` | string | "Our Services" |
| `servicesSubcaption` | string | Subcaption text |
| `servicesTitle` | string | Services section title |
| `whyChooseLabel` | string | "OUR DIFFERENCE" |
| `whyChooseTitle` | string | Section title |
| `whyChooseDescription` | string | Section description |
| `whyChooseCtaText` | string | CTA text |
| `whyChooseCards` | array | `[{ number, title, description }]` |
| `bottomHeroPrefixLight` | string | Light text prefix |
| `bottomHeroPrefixBold` | string | Bold text |
| `bottomHeroHeading` | string | Heading |
| `bottomHeroDescription` | string | Description paragraph |
| `bottomHeroButtonText` | string | Button text |
| `teamTitle` | string | Team section title |
| `teamSubtitle` | string | Team section subtitle |
| `teamMembers` | array | `[{ name, role, bio, linkedinUrl }]` |
| `consultationServices` | array | `[{ label, heading, subtitle }]` |
| `ctaOverrides` | object | `{ caption, title, description, buttonText }` |
| `seo` | object | `{ metaTitle, metaDescription }` |

**File**: `src/app/page.tsx` (currently `"use client"`)

**Strategy**: The home page is currently a Client Component. To fetch CMS data:
1. Convert `src/app/page.tsx` to a Server Component
2. Fetch CMS data there
3. Pass data as props to each child component (HeroSection, ServicesSection, WhyChooseSection, etc.)
4. The child components remain `"use client"` -- they just receive data via props instead of having it hardcoded

**Components to modify**:
- `src/app/components/hero-section.tsx` -- accept hero fields as props
- `src/app/components/services-section.tsx` -- accept services fields as props (note: the service cards on the home page come from the `home-page` API, NOT from `/api/services`)
- `src/app/components/why-choose-section.tsx` -- accept whyChoose fields as props
- `src/app/components/consultation-modal.tsx` -- accept consultationServices as props
- `src/components/shared/Team/` -- accept teamMembers, teamTitle, teamSubtitle as props
- `src/components/shared/Cta/` -- accept ctaOverrides as props

**Note about services on home page**: The home page services section displays 6 hardcoded services. The CMS `home-page` endpoint does NOT include individual service card data (title, description, tags, icon). Those come from the `/api/services` collection. Fetch services separately: `/api/services?sort=createdAt:asc&populate=*`. Each service has: `title`, `slug`, `tags[{ label }]`.

---

### About Us Page

**Endpoint**: `/api/about-us-page?populate=*`

**Fields available**:
| Field | Type | Use |
|---|---|---|
| `heroSubtitleLight` | string | Light text |
| `heroSubtitleAccent` | string | Accent text |
| `heroH1Normal` | string | H1 normal weight |
| `heroH1Large` | string | H1 large/bold |
| `heroBodyText` | string | Hero body |
| `heroCtaText` | string | CTA text |
| `bodyText` | string | Body text section |
| `ourDifferenceCaption` | string | Caption |
| `ourDifferenceTitle` | string | Title |
| `ourDifferenceSubtitle` | string | Subtitle |
| `ourDifferenceCard1Title` | string | First card title |
| `ourDifferenceCard1Body` | string | First card body |
| `ourDifferenceEngineeringTitle` | string | Engineering section title |
| `ourDifferenceEngineeringBody` | string | Engineering section body |
| `ourDifferenceBeliefCaption` | string | Belief caption |
| `ourDifferenceBeliefQuote` | string | Belief quote |
| `ourDifferenceBeliefLabel` | string | Belief label |
| `ourDifferenceClosingParagraphs` | string | Closing text (multiline, split by `\n\n`) |
| `ourStackTitle` | string | Stack section title |
| `ourStackCaption` | string | Stack caption |
| `ourStackLogos` | array | `[{ name }]` -- tech logo names |
| `whatMakesDifferentTitle` | string | Section title |
| `whatMakesDifferentCaption` | string | Section caption |
| `whatMakesDifferentCards` | array | `[{ number, title, description }]` |
| `seo` | object | `{ metaTitle, metaDescription }` |

**File**: `src/app/about-us/page.tsx` (Server Component)

**Strategy**: Fetch data in `page.tsx`, pass as props to each section.

**Components to modify**: All sections in `src/page-sections/AboutUs/sections/`

---

### Services Listing Page

**Endpoints**:
- Page content: `/api/services-page?populate=*`
- Service cards: `/api/services?populate=*&sort=createdAt:asc`

**Services page fields**:
| Field | Type | Use |
|---|---|---|
| `heroH1` | string | Page heading |
| `heroBody` | string | Hero body text |
| `heroBadgesLabel` | string | Badges label |
| `ctaOverrides` | object | `{ caption, title, description, buttonText }` |
| `seo` | object | `{ metaTitle, metaDescription }` |

**Each service has**:
| Field | Type | Use |
|---|---|---|
| `title` | string | Service name |
| `slug` | string | URL slug |
| `tags` | array | `[{ label }]` |
| `heroBodyText` | string | (may be null -- not all services have detail content) |
| `heroCtaText` | string | CTA text |

**File**: `src/app/services/page.tsx`

**Components to modify**: Sections in `src/page-sections/Services/sections/`

---

### Individual Service Pages

**Endpoint**: `/api/services?filters[slug]=$slug&populate=*`

**Full service fields** (when populated for detail page):
| Field | Type | Use |
|---|---|---|
| `title` | string | Service name |
| `slug` | string | URL slug |
| `heroSubtitle` | string | Subtitle |
| `heroKicker1` | string | Kicker line 1 |
| `heroKicker2` | string | Kicker line 2 |
| `heroBodyText` | string | Body text |
| `heroCtaText` | string | CTA button |
| `bodyTitle` | string | Body section title |
| `bodyChecklist` | array | `[{ text }]` |
| `featuresTitle` | string | Features section title |
| `featuresChecklist` | array | `[{ text }]` |
| `serviceContent` | array | `[{ kicker, title, description }]` |
| `caseStudy` | object | `{ clientHandle, clientName, heading, ctaText }` |
| `tags` | array | `[{ label }]` |
| `ctaOverrides` | object | `{ caption, title, description, buttonText }` |
| `seo` | object | `{ metaTitle, metaDescription }` |

**Note**: Currently only "Mobile App Development" has full detail content. Other services have null fields. Handle null gracefully -- show content only when available or use sensible defaults.

**File**: `src/app/services/[slug]/page.tsx` (dynamic route)

**Strategy**: Use `generateStaticParams()` to pre-render all service pages. Fetch the specific service by slug.

---

### Blog Listing Page

**Endpoints**:
- Page content: `/api/blog-listing-page?populate=*`
- Blog posts: `/api/blog-posts?populate=*&sort=date:desc`

**Blog listing page fields**:
| Field | Type | Use |
|---|---|---|
| `heroCaption` | string | Caption text |
| `heroTitleLight` | string | Title light text |
| `heroTitleAccent` | string | Title accent text |
| `heroSubtitle` | string | Subtitle |
| `seo` | object | `{ metaTitle, metaDescription }` |

**Each blog post has**:
| Field | Type | Use |
|---|---|---|
| `title` | string | Post title |
| `slug` | string | URL slug |
| `author` | string | Author name |
| `date` | string | Date (YYYY-MM-DD) |
| `excerpt` | string | Short description |
| `content` | string | Full post content |
| `heroImage` | media | (skip for now -- null in all posts) |
| `seo` | object | (null for now) |

**File**: `src/app/blog/page.tsx`

**Components to modify**: Sections in `src/page-sections/Blog/sections/`

---

### Individual Blog Posts

**Endpoint**: `/api/blog-posts?filters[slug]=$slug&populate=*`

**Strategy**: Use `generateStaticParams()` to pre-render all blog posts. Fetch the specific post by slug.

**File**: `src/app/blog/[slug]/page.tsx` (dynamic route)

---

### Lead Magnet Page

**Endpoint**: `/api/lead-magnet-page?populate=*`

**Fields available**:
| Field | Type | Use |
|---|---|---|
| `heroH1` | string | Page heading |
| `heroSubtitle` | string | Subtitle |
| `formTitle` | string | Form section title |
| `formButtonText` | string | Submit button text |
| `technicalDebtTitle` | string | Section title |
| `technicalDebtParagraphs` | string | Paragraphs (split by `\n\n`) |
| `auditRevealsCaption` | string | Caption |
| `auditRevealsTitle` | string | Title |
| `auditRevealsBody` | string | Body text |
| `auditChecklistTitle` | string | Checklist title |
| `auditChecklistItems` | array | `[{ text }]` |
| `whyAuditTitle` | string | Title |
| `whyAuditCards` | array | `[{ number, title, description }]` |
| `idealForHeading` | string | Heading |
| `idealForItems` | array | `[{ text }]` |
| `teamSubtitle` | string | Team subtitle override |
| `ctaOverrides` | object | `{ caption, title, description, buttonText }` |
| `seo` | object | `{ metaTitle, metaDescription }` |

**File**: `src/app/lead-magnet/page.tsx`

**Components to modify**: Sections in `src/page-sections/LeadMagnet/sections/`

---

### 404 Page

**Endpoint**: `/api/not-found-page?populate=*`

**Fields available**:
| Field | Type | Use |
|---|---|---|
| `heroH1` | string | "Oh No! Error 404" |
| `heroDescription` | string | Error message |
| `heroButtonText` | string | Button text |
| `heroButtonHref` | string | Button link |
| `seo` | object | `{ metaTitle, metaDescription }` |

**File**: `src/app/404/page.tsx` (or `src/app/not-found.tsx`)

---

## Step 3: SEO metadata

Each page has a `seo` object with `metaTitle` and `metaDescription`. Use Next.js `generateMetadata()` in each page's `page.tsx`:

```typescript
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchStrapi<YourPageType>("/api/your-page?populate=*");
  return {
    title: data.seo?.metaTitle ?? "Fallback Title",
    description: data.seo?.metaDescription ?? "Fallback description",
  };
}
```

---

## Verification checklist

After integrating each page:

1. Run `npm run dev` and visually check the page -- content should match what was there before (same text, same structure)
2. Verify no layout or styling changed
3. Check the browser console for fetch errors
4. Test with CMS_URL unset to ensure fallbacks work
5. Run `npm run build` to verify no build errors

---

## What NOT to do

- Do NOT add images from the CMS yet (keep static images as-is)
- Do NOT restructure or refactor components beyond what's needed for prop passing
- Do NOT add loading states or error boundaries (keep it simple for now)
- Do NOT modify the `/api/leads` endpoint -- it already works with the CMS
- Do NOT install new packages -- `fetch` is built into Next.js
