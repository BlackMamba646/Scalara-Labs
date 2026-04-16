# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Scalara Labs marketing/landing page website. A multi-page Next.js site built from Figma designs, with a focus on pixel-perfect responsive implementation. The site includes pages for: home, about us, services listing, individual service pages, blog listing, blog posts, lead magnet, and 404.

## Commands

- `npm run dev` — start Next.js dev server
- `npm run build` — production build
- `npm run lint` — run ESLint
- No test framework is configured.

## Tech Stack

- **Next.js 15** (App Router) with React 18 and TypeScript
- **Tailwind CSS v4** via `@tailwindcss/postcss` — configured in `postcss.config.mjs`, no `tailwind.config` file (uses CSS-based config in `globals.css`)
- **shadcn/ui** components in `src/app/components/ui/` (Radix UI primitives + class-variance-authority + tailwind-merge)
- **Motion** (Framer Motion) for animations
- **MUI** (`@mui/material`) used alongside shadcn/ui in some components
- **CSS custom properties** extensively used for theming — defined in `src/styles/theme.css` (section-level design tokens) and `src/app/globals.css` (base theme)

## Architecture

### Two component systems coexist

1. **Home page** (`src/app/page.tsx`): Uses components from `src/app/components/` — these are `"use client"` components styled with Tailwind classes, built around shadcn/ui primitives. The home page manages a consultation modal at the top level and passes `onConsultationClick`/`onServiceClick` callbacks down.

2. **All other pages** (about-us, services, blog, lead-magnet, 404): Use a different pattern with:
   - **Shared components** in `src/components/shared/` (Header, Footer, Team, Services, Cta) — each in its own folder with a `.tsx` and `.css` file
   - **Page sections** in `src/page-sections/{PageName}/sections/{SectionName}/` — each section has its own `.tsx` and `.css` file
   - Styling via **CSS custom properties** defined in `src/styles/theme.css` and imported through `src/styles/index.css`

### CSS architecture

- `src/app/globals.css` — Tailwind v4 setup, base theme variables, shadcn/ui theme tokens
- `src/styles/fonts.css` — font-face declarations (Manrope from Google Fonts, self-hosted Results Letter)
- `src/styles/theme.css` — section-level CSS variables organized by page/component (colors, spacing, typography, sizing per section)
- `src/styles/index.css` — central CSS import hub that pulls in fonts, theme, and all component/section CSS files

### SVG imports

SVG assets from Figma are stored in `src/imports/` with descriptive names following the pattern `{page}-{section}-{element}.svg`.

### CMS (Strapi v5)

Remote Strapi instance — configured via `CMS_URL` and `CMS_API` (API token) environment variables in `.env`. Do NOT hardcode these values.

- **Single Types** (one per page): `global` (header/footer), `home-page`, `about-us-page`, `services-page`, `blog-listing-page`, `lead-magnet-page`, `not-found-page`
- **Collection Types**: `service` (like blog posts — `featured=true` shown on home, all on /services), `blog-post` (with slug), `lead` (form submissions)
- **Reusable components** in `cms/src/components/`: `shared.*` (nav-item, link-item, tech-logo, team-member, numbered-card, checklist-item, seo, etc.) and `blocks.*` (service-card, consultation-service, cta-overrides)
- **API queries**: `/api/services?filters[featured]=true&sort=order:asc&populate=*`, `/api/blog-posts?populate=*`, `/api/home-page?populate=*`
- **Frontend integration not yet done** — pages still use hardcoded content

### API

Single API route at `src/app/api/leads/route.ts` — proxies lead form submissions to Strapi at `CMS_URL/api/leads`. Uses `CMS_URL` and `CMS_API` environment variables from `.env`.

### Path alias

`@/*` maps to `./src/*` (configured in `tsconfig.json`).

### Content max width

The site uses a `1440px` max-width container (`.content-container` class in `src/styles/index.css`, `--content-max-width` variable).
