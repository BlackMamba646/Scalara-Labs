# Animation Implementation Plan: Services and Blog Pages

## Overview

Add scroll-triggered entrance animations, hover micro-interactions, and decorative polish to 4 pages (Services Listing, Service Detail, Blog Listing, Blog Post) using the existing ScrollReveal/StaggerReveal system from motion/react. All animations follow homepage conventions: 0.6s duration, cubic-bezier(0.25, 0.1, 0.25, 1) easing, GPU-only properties, prefers-reduced-motion respected automatically.

---

## PART 1: SERVICES LISTING PAGE (/services)

### 1A. HeroSection (SERVER component)

**File:** src/page-sections/ServicesPagesListing/sections/HeroSection/HeroSection.tsx

Add import: ScrollReveal from @/app/components/scroll-reveal

| Element | Direction | Delay | Distance |
|---------|-----------|-------|----------|
| Trust badges block | up | 0.1s | 20px |
| H1 heading block | up | 0.25s | 25px |
| Tablet/mobile hero image | none (fade only) | 0.35s | N/A |

Desktop graphic: CSS-only fade-in keyframe in HeroSection.css (1s ease, 0.3s delay).

### 1B. ServicesGrid (SERVER component)

**File:** src/page-sections/ServicesPagesListing/sections/ServicesGrid/ServicesGrid.tsx

Add import: StaggerReveal from @/app/components/scroll-reveal

| Element | Stagger | Base Delay | Distance |
|---------|---------|------------|----------|
| Cards 0-2 (row 1) | 0.12s | 0s | 30px |
| Cards 3-5 (row 2) | 0.12s | 0.15s | 30px |

Wrap each card individually with StaggerReveal. Add CSS class for grid compat (display:flex, min-width:0).

**CSS hover additions (ServicesGrid.css):**
- Card lift: translateY(-4px), box-shadow on hover (0.3s ease)
- Image zoom: scale(1.04) on hover (0.4s ease)
- Button arrow nudge: translateX(3px) on hover (0.3s ease)

### 1C. CtaSection (CLIENT component)

**File:** src/page-sections/ServicesPagesListing/sections/CtaSection/CtaSection.tsx

Add import: ScrollReveal from @/app/components/scroll-reveal

| Element | Direction | Delay | Distance |
|---------|-----------|-------|----------|
| Heading block (caption+h2+desc) | up | 0s | 30px |
| CTA row (button+badges) | up | 0.2s | 20px |

**CSS additions (CtaSection.css):**
- Decorative pattern float keyframe (5-7s, translateY 0 to -8px, staggered start per pattern)
- Button hover: translateY(-1px), active scale(0.97)

---

## PART 2: SERVICE DETAIL PAGE (/services/page)

### 2A. HeroContainer (CLIENT)

**File:** src/page-sections/ServicePage/sections/HeroContainer/HeroContainer.tsx

| Element | Direction | Delay | Distance |
|---------|-----------|-------|----------|
| Subtitle | up | 0.1s | 20px |
| H1 + quote | up | 0.25s | 25px |
| Body text + CTA | up | 0.35s | 20px |

CSS: Button hover translateY(-1px), active scale(0.97).

### 2B. BodyText (SERVER)

**File:** src/page-sections/ServicePage/sections/BodyText/BodyText.tsx

| Element | Direction | Delay | Distance |
|---------|-----------|-------|----------|
| Title | up | 0s | 25px |
| Feature items (3) | up, stagger 0.1s | base 0.15s | 20px |

### 2C-E. WhyChoose Sections (all SERVER)

**WhyChooseBuiltBeyond** (text left, image right):
- Text column: direction=right, delay=0s, distance=30px
- Image column: direction=left, delay=0.15s, distance=30px

**WhyChooseNativeCrossPlatform** (image left, text right):
- Image column: direction=right, delay=0s, distance=30px
- Text column: direction=left, delay=0.15s, distance=30px

**WhyChooseRealWorld** (text left, image right):
- Text column: direction=right, delay=0s, distance=30px
- Image column: direction=left, delay=0.15s, distance=30px

All three get decorative code pattern float animations in CSS (7s, ease-in-out, translateY -6px + rotate 1deg).

### 2F. ServiceFeatures (SERVER)

**File:** src/page-sections/ServicePage/sections/ServiceFeatures/ServiceFeatures.tsx

| Element | Direction | Delay | Distance |
|---------|-----------|-------|----------|
| Heading | up | 0s | 25px |
| Feature items (9) | up, stagger 0.1s | base 0.1s | 20px |

### 2G. CaseStudy (CLIENT)

Single ScrollReveal on banner (direction=up, distance=35px). Do NOT animate internals.

### 2H. Team and Cta -- ALREADY ANIMATED, no changes.

---

## PART 3: BLOG LISTING PAGE (/blog)

### 3A. BlogHero (SERVER)

| Element | Direction | Delay | Distance |
|---------|-----------|-------|----------|
| Caption | up | 0.1s | 20px |
| Title (h1) | up | 0.25s | 25px |
| Subtitle | up | 0.4s | 20px |

### 3B. BlogCards (CLIENT)

Cards stagger by row: row=floor(i/3), col=i%3
- Row 1: stagger 0.12s, baseDelay 0s
- Row 2: stagger 0.12s, baseDelay 0.15s
- Row 3: stagger 0.12s, baseDelay 0.30s

**CSS hover additions:**
- Card lift: translateY(-4px)
- Image zoom: scale(1.04)
- Button text accent color + arrow translateX(3px)
- Pagination hover feedback

---

## PART 4: BLOG POST PAGE (/blog/page)

### 4A. BlogPostHero (SERVER)

| Element | Direction | Delay | Distance |
|---------|-----------|-------|----------|
| Author meta | up | 0.1s | 15px |
| Title (h1) | up | 0.25s | 25px |
| Hero image | none (fade) | 0.35s | N/A |

### 4B. BlogPostContent (CLIENT)

| Element | Direction | Delay | Distance |
|---------|-----------|-------|----------|
| Text block 1 | up | 0s | 25px |
| Quote block | up | 0s | 30px |
| Text block 2 | up | 0s | 25px |
| Checklist | up | 0s | 25px |
| Text block 3 | up | 0s | 25px |
| Sidebar card | left | 0.2s | 25px |
| Banner (mobile) | up | 0s | 25px |

CSS: Sidebar pattern float. Button hover lift.

---

## IMPLEMENTATION ORDER

### Phase 1 -- Core scroll reveals:
1. HeroSection (Services Listing)
2. BlogHero (Blog Listing)
3. BlogPostHero (Blog Post)
4. BodyText (Service Detail)

### Phase 2 -- Card grids with stagger:
5. ServicesGrid
6. BlogCards
7. ServiceFeatures

### Phase 3 -- Two-column directional reveals:
8-10. WhyChoose sections

### Phase 4 -- Client components:
11. HeroContainer
12. CtaSection
13. CaseStudy
14. BlogPostContent

### Phase 5 -- CSS polish:
15-18. Hover effects + float animations + graphic fade-in
