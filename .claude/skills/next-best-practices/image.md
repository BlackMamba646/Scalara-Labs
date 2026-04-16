# Image Optimization

Use `next/image` for automatic image optimization.

## Always Use next/image

```tsx
// Bad: Avoid native img
<img src="/hero.png" alt="Hero" />

// Good: Use next/image
import Image from 'next/image'
<Image src="/hero.png" alt="Hero" width={800} height={400} />
```

## Required Props

Images need explicit dimensions to prevent layout shift:

```tsx
// Local images - dimensions inferred automatically
import heroImage from './hero.png'
<Image src={heroImage} alt="Hero" />

// Remote images - must specify width/height
<Image src="https://example.com/image.jpg" alt="Hero" width={800} height={400} />

// Or use fill for parent-relative sizing
<div style={{ position: 'relative', width: '100%', height: 400 }}>
  <Image src="/hero.png" alt="Hero" fill style={{ objectFit: 'cover' }} />
</div>
```

## Remote Images Configuration

Remote domains must be configured in `next.config.js`:

```js
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: '*.cdn.com', // Wildcard subdomain
      },
    ],
  },
}
```

## Responsive Images

Use `sizes` to tell the browser which size to download:

```tsx
// Full-width hero
<Image
  src="/hero.png"
  alt="Hero"
  fill
  sizes="100vw"
/>

// Responsive grid (3 columns on desktop, 1 on mobile)
<Image
  src="/card.png"
  alt="Card"
  fill
  sizes="(max-width: 768px) 100vw, 33vw"
/>

// Fixed sidebar image
<Image
  src="/avatar.png"
  alt="Avatar"
  width={200}
  height={200}
  sizes="200px"
/>
```

## Fill + Object-Fit Cover: Calculating `sizes`

When using `fill` with `object-fit: cover`, the `sizes` prop must account for how cover-cropping works, not just the container's CSS width.

**The problem:** `object-fit: cover` scales the image so it fills the container on **both** axes, then crops the overflow. If the container is portrait (e.g., 200px x 400px) and the source image is landscape (e.g., 2880x1354), the image must scale until its height reaches 400px. At that scale, the image width is ~850px — far larger than the 200px container width. If `sizes="200px"`, Next.js serves a ~200px image that gets stretched to cover that area, producing visible blur.

**The rule:** Set `sizes` to at least `max(containerWidth, containerHeight)` and round up generously. A good default multiplier is 1.5x the largest container dimension.

```tsx
// Bad: sizes matches container width, ignores cover crop
<div style={{ position: 'relative', width: 200, height: 400 }}>
  <Image src={photo} alt="Card" fill style={{ objectFit: 'cover' }} sizes="200px" />
</div>

// Good: sizes accounts for the tallest dimension + headroom
<div style={{ position: 'relative', width: 200, height: 400 }}>
  <Image src={photo} alt="Card" fill style={{ objectFit: 'cover' }} sizes="600px" />
</div>
```

**Quick reference for calculating `sizes` with `fill` + `cover`:**

| Container | Naive (wrong) | Correct `sizes` |
|-----------|--------------|-----------------|
| 200px x 400px (portrait) | `200px` | `600px` (400 x 1.5) |
| 400px x 200px (landscape) | `400px` | `400px` (width is already the larger dim) |
| 300px x 300px (square) | `300px` | `450px` (300 x 1.5) |
| 100% x 500px (fluid width) | `100vw` | `100vw` (vw already covers the full width) |

**When the container is responsive** (different sizes at different breakpoints), apply this logic per breakpoint:

```tsx
// Container: 200px wide at desktop, full-width on mobile with 300px height
<Image
  src={photo}
  alt="Card"
  fill
  style={{ objectFit: 'cover' }}
  sizes="(max-width: 767px) 100vw, 600px"
/>
```

**When in doubt, over-estimate.** A slightly larger image download (e.g., 600px vs 200px) adds negligible bytes compared to the visual damage of a blurry image.

## Blur Placeholder

Prevent layout shift with placeholders:

```tsx
// Local images - automatic blur hash
import heroImage from './hero.png'
<Image src={heroImage} alt="Hero" placeholder="blur" />

// Remote images - provide blurDataURL
<Image
  src="https://example.com/image.jpg"
  alt="Hero"
  width={800}
  height={400}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
/>

// Or use color placeholder
<Image
  src="https://example.com/image.jpg"
  alt="Hero"
  width={800}
  height={400}
  placeholder="empty"
  style={{ backgroundColor: '#e0e0e0' }}
/>
```

## Priority Loading

Use `priority` for above-the-fold images (LCP):

```tsx
// Hero image - loads immediately
<Image src="/hero.png" alt="Hero" fill priority />

// Below-fold images - lazy loaded by default (no priority needed)
<Image src="/card.png" alt="Card" width={400} height={300} />
```

## Common Mistakes

```tsx
// Bad: Missing sizes with fill - downloads largest image
<Image src="/hero.png" alt="Hero" fill />

// Good: Add sizes for proper responsive behavior
<Image src="/hero.png" alt="Hero" fill sizes="100vw" />

// Bad: Using width/height for aspect ratio only
<Image src="/hero.png" alt="Hero" width={16} height={9} />

// Good: Use actual display dimensions or fill with sizes
<Image src="/hero.png" alt="Hero" fill sizes="100vw" style={{ objectFit: 'cover' }} />

// Bad: sizes matches container width but container is portrait with cover crop
<div style={{ position: 'relative', width: 200, height: 400 }}>
  <Image src="/card.png" alt="Card" fill style={{ objectFit: 'cover' }} sizes="200px" />
</div>
// Result: blurry image — Next.js serves ~200px but cover needs ~850px

// Good: sizes accounts for the larger dimension after cover crop
<div style={{ position: 'relative', width: 200, height: 400 }}>
  <Image src="/card.png" alt="Card" fill style={{ objectFit: 'cover' }} sizes="600px" />
</div>

// Bad: Remote image without config
<Image src="https://untrusted.com/image.jpg" alt="Image" width={400} height={300} />
// Error: Invalid src prop, hostname not configured

// Good: Add hostname to next.config.js remotePatterns
```

## Static Export

When using `output: 'export'`, use `unoptimized` or custom loader:

```tsx
// Option 1: Disable optimization
<Image src="/hero.png" alt="Hero" width={800} height={400} unoptimized />

// Option 2: Global config
// next.config.js
module.exports = {
  output: 'export',
  images: { unoptimized: true },
}

// Option 3: Custom loader (Cloudinary, Imgix, etc.)
const cloudinaryLoader = ({ src, width, quality }) => {
  return `https://res.cloudinary.com/demo/image/upload/w_${width},q_${quality || 75}/${src}`
}

<Image loader={cloudinaryLoader} src="sample.jpg" alt="Sample" width={800} height={400} />
```
