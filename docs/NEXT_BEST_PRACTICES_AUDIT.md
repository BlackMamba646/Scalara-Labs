# Auditoría de Next.js Best Practices — Scalara Labs

> **Proyecto**: `scalara-labs` (landing page marketing)
> **Stack**: Next.js 15.3.3 · React 18 · Tailwind v4 · Strapi v5 (CMS)
> **Fecha de auditoría**: 2026-04-06
> **Base de la auditoría**: `.claude/skills/next-best-practices/`
> **Alcance**: Solo `scalara-labs/` (excluye `cms/`)

---

## 1. Resumen ejecutivo

Auditoría exhaustiva del proyecto siguiendo la skill `next-best-practices` de Next.js 15. El proyecto tiene **bases sólidas** — App Router bien estructurado, data fetching server-side con `Promise.all`, async params correctamente tipados, API route segura — pero presenta **varias violaciones críticas** que afectan directamente performance (LCP), SEO (indexación, sharing social) y manejo de errores en producción.

### Hallazgos por severidad

| Severidad | Cantidad | Ejemplo representativo |
|---|---|---|
| **CRÍTICO** | 4 | Google Fonts cargadas con `@import` bloqueante (duplicado en 2 archivos) |
| **ALTO** | 7 | Sin `sitemap.ts`/`robots.ts`, 12 archivos con `<img>` nativo, duplicate fetches en rutas dinámicas |
| **MEDIO** | 4 | Falta `optimizePackageImports`, `revalidate` global poco afinado |
| **BAJO** | 3 | Falta `icon.png`/`apple-icon.png`, `output: 'standalone'` ausente |
| **TOTAL** | **18** | — |

### Impacto estimado tras implementar los fixes

- **Performance (Lighthouse)**: +10 a +20 puntos — fuentes no bloqueantes, imágenes optimizadas (AVIF/WebP), bundle reducido.
- **SEO**: resolución de `metadataBase`, 404 reales para contenido inexistente, sitemap dinámico, OG images.
- **DX / Producción**: error boundaries reales, deduplicación de fetches al CMS, limpieza de dependencias muertas.

---

## 2. Matriz de prioridades

| # | Sev | Categoría | Archivo | Descripción | Esfuerzo |
|---|---|---|---|---|---|
| 1 | 🔴 CRÍTICO | Fuentes | `globals.css:1`, `fonts.css:2` | `@import` Google Fonts bloqueante (duplicado) | M |
| 2 | 🔴 CRÍTICO | Routing | `404/page.tsx` + `not-found.tsx` | Duplicación de 404 | S |
| 3 | 🔴 CRÍTICO | Errores | `app/` | Falta `error.tsx` y `global-error.tsx` | S |
| 4 | 🔴 CRÍTICO | Errores | `blog/[slug]/page.tsx:57`, `services/[slug]/page.tsx:58` | Rutas dinámicas no llaman `notFound()` | XS |
| 5 | 🟠 ALTO | Metadata | `layout.tsx:4` | Sin `metadataBase` ni `title.template` | XS |
| 6 | 🟠 ALTO | SEO | `app/` | Falta `sitemap.ts` y `robots.ts` | S |
| 7 | 🟠 ALTO | SEO | `app/` | Sin OG images (estáticas ni dinámicas) | M |
| 8 | 🟠 ALTO | Imágenes | 12 archivos | `<img>` HTML nativo en vez de `next/image` | M |
| 9 | 🟠 ALTO | Data | `blog/[slug]/page.tsx`, `services/[slug]/page.tsx` | Duplicate fetches (falta `React.cache`) | XS |
| 10 | 🟠 ALTO | Data | `blog/[slug]/page.tsx:25` | `generateStaticParams` con `populate=*` | XS |
| 11 | 🟠 ALTO | Bundle | `package.json` | ~9 dependencias pesadas sin uso | S |
| 12 | 🟡 MEDIO | Config | `next.config.ts` | Sin `experimental.optimizePackageImports` | XS |
| 13 | 🟡 MEDIO | Data | `lib/strapi.ts:9` | `revalidate: 60` global sin diferenciación | XS |
| 14 | 🟡 MEDIO | RSC | `shared/Services/Services.tsx:1` | `'use client'` innecesario | XS |
| 15 | 🟡 MEDIO | Limpieza | `fix-images.js` (root) | Script muerto (apunta a archivos borrados) | XS |
| 16 | 🟢 BAJO | Metadata | `app/` | Faltan `icon.png`, `apple-icon.png` | XS |
| 17 | 🟢 BAJO | Self-host | `next.config.ts` | Sin `output: 'standalone'` | XS |
| 18 | 🟢 BAJO | A11y | `hero-section.tsx:200,211,220` | `alt=""` sin `aria-hidden` | XS |

**Leyenda de esfuerzo**: XS (< 15 min) · S (< 1 h) · M (1–3 h) · L (> 3 h)

---

## 3. Hallazgos detallados

### 🔴 CRÍTICOS

#### #1 — Google Fonts con `@import` bloqueante (duplicado)

**Categoría**: Fuentes / Performance
**Archivos**:
- `src/app/globals.css:1`
- `src/styles/fonts.css:2`

**Problema**: Manrope se carga vía `@import url()` desde Google en dos archivos CSS distintos. Esto:

1. **Bloquea el render del navegador** hasta que el CSS descargue la hoja externa (dos round-trips a `fonts.googleapis.com` + otro a `fonts.gstatic.com`).
2. **Causa layout shift** (FOUT/FOIT) porque no hay `font-display` manejado por Next.
3. **Descarga los 7 pesos** (200–800) aunque probablemente solo se usan 400, 500, 600, 700.
4. **Duplica la petición** al estar en dos archivos.

**Código actual** — `src/app/globals.css:1` y `src/styles/fonts.css:1-2`:
```css
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');
```

Y self-hosted en `fonts.css:4-39`:
```css
@font-face {
  font-family: 'Results Letter';
  src: url('../assets/fonts/ResultsLetter-Thin.woff2') format('woff2'), ...
  font-display: swap;
}
/* + Extralight, Light, Regular */
```

**Fix recomendado** — migrar a `next/font`:

```ts
// src/lib/fonts.ts
import { Manrope } from 'next/font/google'
import localFont from 'next/font/local'

export const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-manrope',
})

export const resultsLetter = localFont({
  src: [
    { path: '../assets/fonts/ResultsLetter-Thin.woff2',       weight: '100', style: 'normal' },
    { path: '../assets/fonts/ResultsLetter-Extralight.woff2', weight: '200', style: 'normal' },
    { path: '../assets/fonts/ResultsLetter-Light.woff2',      weight: '300', style: 'normal' },
    { path: '../assets/fonts/ResultsLetter-Regular.woff2',    weight: '400', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-results-letter',
})
```

```tsx
// src/app/layout.tsx
import { manrope, resultsLetter } from '@/lib/fonts'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${resultsLetter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

Y en `globals.css`, eliminar ambos `@import` y usar las variables CSS:
```css
:root {
  --font-sans: var(--font-manrope), system-ui, sans-serif;
  --font-accent: var(--font-results-letter), serif;
}
```

**Impacto**: ~500 ms – 1 s de mejora en LCP/FCP, eliminación de FOUT, bundle de CSS reducido, preload automático.

---

#### #2 — Duplicación de ruta 404

**Categoría**: Routing / Convenciones
**Archivos**:
- `src/app/404/page.tsx:1-18`
- `src/app/not-found.tsx:1-15`

**Problema**: Existen dos implementaciones de "página no encontrada":

- `src/app/not-found.tsx` es el **archivo especial de Next.js** que se renderiza automáticamente cuando se llama `notFound()` o no matchea ninguna ruta.
- `src/app/404/page.tsx` es una **ruta manual** accesible en `/404` — no es convención Next.js App Router y solo se serviría si alguien navega explícitamente a esa URL.

Ambos archivos renderizan exactamente los mismos componentes (`Header`, `Hero`, `Error404Background`, `Footer`). Cualquier cambio futuro tiene que replicarse en dos sitios.

**Fix**: borrar `src/app/404/` completa. Next.js usa `not-found.tsx` sin configuración adicional.

```bash
rm -r src/app/404
```

**Impacto**: menos confusión, menos superficie para bugs, alineación con convenciones Next.

---

#### #3 — Sin `error.tsx` ni `global-error.tsx`

**Categoría**: Error Handling / UX
**Ubicación**: `src/app/` (ambos archivos faltan)

**Problema**: Sin `error.tsx`, cualquier error no capturado en un Server Component (por ejemplo, Strapi caído) muestra la página de error por defecto de Next.js en dev y un error genérico en producción. Para un sitio marketing esto significa perder el visitante ante cualquier fallo transitorio del CMS.

**Fix** — crear dos archivos:

```tsx
// src/app/error.tsx
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main style={{ padding: '4rem 1rem', textAlign: 'center' }}>
      <h1>Something went wrong</h1>
      <p>We hit an unexpected error. Please try again.</p>
      <button onClick={() => reset()}>Try again</button>
    </main>
  )
}
```

```tsx
// src/app/global-error.tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h1>Critical error</h1>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
```

**Impacto**: UI controlada ante fallos, posibilidad de reportar errores (Sentry, etc.) desde el `useEffect`.

---

#### #4 — Rutas dinámicas no llaman `notFound()` cuando el recurso no existe

**Categoría**: SEO / Error Handling
**Archivos**:
- `src/app/blog/[slug]/page.tsx:51-73`
- `src/app/services/[slug]/page.tsx:46-116`

**Problema**: Si el slug no existe en Strapi, ambas páginas renderizan con props `undefined` en lugar de devolver HTTP 404. Esto significa que:

1. Google indexa URLs vacías con HTTP 200.
2. Los usuarios ven una página rota en lugar del `not-found.tsx`.

**Código actual** — `src/app/blog/[slug]/page.tsx:56-73`:
```tsx
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  return (
    <>
      <Header />
      <BlogPostHero
        title={post?.title ?? undefined}  // ❌ renderiza vacío
        author={post?.author ?? undefined}
        date={post?.date ?? undefined}
        heroImageUrl={getStrapiImageUrl(post?.heroImage) ?? undefined}
      />
      ...
    </>
  );
}
```

**Fix**:
```tsx
import { notFound } from 'next/navigation'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound()  // ✅ dispara not-found.tsx + HTTP 404
  }

  return (
    <>
      <Header />
      <BlogPostHero title={post.title} author={post.author} date={post.date} ... />
      ...
    </>
  );
}
```

Mismo fix en `src/app/services/[slug]/page.tsx` tras `const service = results[0]`.

**Impacto**: SEO correcto (Google recibe 404 real), UX consistente, eliminación de optional chaining innecesario en todos los componentes hijos.

---

### 🟠 ALTOS

#### #5 — Root metadata sin `metadataBase` ni `title.template`

**Archivo**: `src/app/layout.tsx:4-8`

**Problema**:
- Sin `metadataBase`, Next emite warning en build y los `openGraph.images`, `alternates.canonical`, etc., no serán URLs absolutas.
- Sin `title.template`, cada página repite manualmente `" | Scalara Labs"` en su título.

**Código actual**:
```tsx
export const metadata: Metadata = {
  title: "Scalara Labs",
  description: "Senior Software Engineers. Startup Speed. Enterprise Quality.",
};
```

**Fix**:
```tsx
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scalaralabs.com'),
  title: {
    default: 'Scalara Labs',
    template: '%s | Scalara Labs',
  },
  description: 'Senior Software Engineers. Startup Speed. Enterprise Quality.',
  openGraph: {
    type: 'website',
    siteName: 'Scalara Labs',
  },
}
```

Después, cada `generateMetadata` solo devuelve `title: data.seo?.metaTitle` (sin el sufijo — se aplica automáticamente).

**Impacto**: URLs absolutas correctas en OG tags/canonical, DRY en títulos, sin warning de build.

---

#### #6 — Falta `sitemap.ts` y `robots.ts`

**Archivos faltantes**:
- `src/app/sitemap.ts`
- `src/app/robots.ts`

**Problema**: Sin sitemap dinámico, Google no descubre blog posts ni services rápidamente. Sin robots, no hay control de indexación.

**Fix** — `src/app/sitemap.ts` (dinámico, desde Strapi):

```ts
import type { MetadataRoute } from 'next'
import { fetchStrapi } from '@/lib/strapi'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scalaralabs.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, services] = await Promise.all([
    fetchStrapi<{ slug: string; updatedAt: string }[]>(
      '/api/blog-posts?fields[0]=slug&fields[1]=updatedAt'
    ).catch(() => []),
    fetchStrapi<{ slug: string; updatedAt: string }[]>(
      '/api/services?fields[0]=slug&fields[1]=updatedAt'
    ).catch(() => []),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/about-us`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/services`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/lead-magnet`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms-and-conditions`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/cookie-policy`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...postRoutes, ...serviceRoutes]
}
```

**Fix** — `src/app/robots.ts`:
```ts
import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scalaralabs.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/404'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
```

**Impacto**: Indexación completa y rápida en Google, control explícito sobre paths no indexables.

---

#### #7 — Sin OG images (ni estáticas ni dinámicas)

**Archivos faltantes**:
- `src/app/opengraph-image.tsx` (o `.png`)
- Opcional: `src/app/blog/[slug]/opengraph-image.tsx`
- Opcional: `src/app/services/[slug]/opengraph-image.tsx`

**Problema**: Cuando los usuarios comparten URLs del sitio en Slack, LinkedIn, Twitter, etc., no aparece preview visual, reduciendo drásticamente el CTR.

**Fix** — OG image estática global (`src/app/opengraph-image.tsx`):
```tsx
import { ImageResponse } from 'next/og'

export const alt = 'Scalara Labs — Senior Software Engineers'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#080E1B',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700 }}>Scalara Labs</div>
        <div style={{ fontSize: 32, marginTop: 24, opacity: 0.8 }}>
          Startup Speed. Enterprise Quality.
        </div>
      </div>
    ),
    { ...size }
  )
}
```

Para blog posts, generar con el título del post. Para services, ídem.

**Impacto**: CTR en redes sociales significativamente mejor, apariencia profesional.

---

#### #8 — `<img>` HTML nativo en vez de `next/image` (12 archivos)

**Archivos afectados** (confirmados con Grep):

1. `src/app/components/hero-section.tsx` (logos dinámicos del CMS — líneas 161-171)
2. `src/app/components/footer-section.tsx`
3. `src/app/components/figma/ImageWithFallback.tsx` **(código muerto — borrar)**
4. `src/components/shared/Footer/Footer.tsx`
5. `src/components/shared/Team/Team.tsx`
6. `src/page-sections/AboutUs/sections/OurStack/OurStack.tsx`
7. `src/page-sections/AboutUs/sections/OurDifference/OurDifference.tsx`
8. `src/page-sections/BlogPostPage/sections/BlogPostContent/BlogPostContent.tsx`
9. `src/page-sections/BlogListing/sections/BlogCards/BlogCards.tsx` (líneas 153, 228, 246, 274)
10. `src/page-sections/LeadMagnetPage/sections/WhyAudit/WhyAudit.tsx`
11. `src/page-sections/LeadMagnetPage/sections/TechnicalDebt/TechnicalDebt.tsx`
12. `src/page-sections/ServicePage/sections/WhyChooseRealWorld/WhyChooseRealWorld.tsx`
13. `src/page-sections/ServicePage/sections/ServiceFeatures/ServiceFeatures.tsx`

**Problema**: `<img>` no aprovecha la optimización automática de Next.js (AVIF/WebP, responsive sizes, lazy loading, placeholder blur). `next.config.ts` YA tiene `formats: ['image/avif', 'image/webp']` y `remotePatterns` configurados — solo falta usar `<Image>`.

**Caso común — Static imports + `.src`** (patrón visto en varias secciones):
```tsx
// ❌ Actual
import arrowUpRight from '@/assets/icons/arrow-up-right.svg'
<img src={arrowUpRight.src} alt="" width={20} height={20} />

// ✅ Fix
import Image from 'next/image'
import arrowUpRight from '@/assets/icons/arrow-up-right.svg'
<Image src={arrowUpRight} alt="" width={20} height={20} />
```

**Caso con imágenes remotas del CMS** (`hero-section.tsx:161`):
```tsx
// ❌ Actual
<img
  key={logo.name}
  src={logo.logo?.url || ""}
  alt={logo.name}
  className="h-[24px] brightness-0 invert"
/>

// ✅ Fix — necesita width/height del CMS
<Image
  key={logo.name}
  src={logo.logo?.url ?? ''}
  alt={logo.name}
  width={logo.logo?.width ?? 96}
  height={logo.logo?.height ?? 24}
  className="brightness-0 invert"
  style={{ height: 24, width: 'auto' }}
/>
```

**Código muerto**: `src/app/components/figma/ImageWithFallback.tsx` — borrar completo, no se importa en ningún lado.

**Impacto**: LCP mejor (lazy loading automático, AVIF), menos bytes al cliente, sin layout shift.

---

#### #9 — Duplicate fetches en rutas dinámicas (falta `React.cache`)

**Archivos**:
- `src/app/blog/[slug]/page.tsx:40` + `:57`
- `src/app/services/[slug]/page.tsx:34` + `53`

**Problema**: Cada página dinámica llama a Strapi **dos veces** para el mismo slug — una vez en `generateMetadata` y otra en el componente de página. Las URLs de fetch incluyen `populate` distintos, por lo que el cache automático de Next.js no deduplica.

**Código actual** — `src/app/blog/[slug]/page.tsx`:
```tsx
async function getBlogPost(slug: string) {
  try {
    const posts = await fetchStrapi<BlogPostData[]>(
      `/api/blog-posts?filters[slug]=${slug}&populate[heroImage]=true&populate[seo]=true`
    );
    return posts?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);  // ← primera llamada
  return { title: post?.seo?.metaTitle ?? post?.title ?? '...' }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);  // ← segunda llamada (misma URL exacta)
  ...
}
```

**Fix** — envolver con `React.cache`:
```tsx
import { cache } from 'react'

const getBlogPost = cache(async (slug: string) => {
  try {
    const posts = await fetchStrapi<BlogPostData[]>(
      `/api/blog-posts?filters[slug]=${slug}&populate[heroImage]=true&populate[seo]=true`
    )
    return posts?.[0] ?? null
  } catch {
    return null
  }
})
```

Para `services/[slug]/page.tsx`, crear una función `getService(slug)` envuelta con `cache()` y reutilizarla en ambos lugares (actualmente el fetch se duplica inline con `SERVICE_POPULATE`).

**Impacto**: 50% menos requests al CMS en rutas dinámicas, build más rápido, menos carga en Strapi.

---

#### #10 — `generateStaticParams` con `populate=*` (sobre-fetching)

**Archivo**: `src/app/blog/[slug]/page.tsx:23-32`

**Problema**: Para construir la lista de slugs, se pide todo el contenido completo:
```tsx
const posts = await fetchStrapi<BlogPostData[]>('/api/blog-posts?populate=*&sort=date:desc')
```

**Fix**:
```tsx
export async function generateStaticParams() {
  try {
    const posts = await fetchStrapi<{ slug: string }[]>(
      '/api/blog-posts?fields[0]=slug&sort=date:desc'
    )
    return posts.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}
```

Nota: `src/app/services/[slug]/page.tsx:19-24` **ya hace esto correctamente** con `?fields[0]=slug`. Solo falta replicarlo en blog.

**Impacto**: build más rápido, menos bytes transferidos, menos carga en el CMS en prerender.

---

#### #11 — Dependencias pesadas sin usar en `package.json`

**Archivo**: `package.json:12-69`

**Problema**: Las siguientes dependencias **no se importan en ningún archivo de `src/`** (verificado con Grep):

| Dependencia | Versión | Tamaño aprox | Uso real |
|---|---|---|---|
| `@mui/material` | 7.3.5 | ~300 KB | 0 imports |
| `@mui/icons-material` | 7.3.5 | ~100 KB (árbol) | 0 imports |
| `@emotion/react` | 11.14.0 | ~30 KB | 0 imports |
| `@emotion/styled` | 11.14.1 | ~10 KB | 0 imports |
| `recharts` | 2.15.2 | ~180 KB | solo en `ui/chart.tsx` (no se consume) |
| `react-day-picker` | 8.10.1 | ~90 KB | solo en `ui/calendar.tsx` (no se consume) |
| `react-dnd` | 16.0.1 | ~50 KB | 0 imports |
| `react-dnd-html5-backend` | 16.0.1 | ~20 KB | 0 imports |
| `react-slick` | 0.31.0 | ~40 KB | 0 imports |
| `react-responsive-masonry` | 2.7.1 | ~15 KB | 0 imports |
| `@popperjs/core` + `react-popper` | — | — | 0 imports directos |

Los archivos `src/app/components/ui/chart.tsx` y `src/app/components/ui/calendar.tsx` son shadcn/ui primitives que nadie consume — son código muerto.

**Fix**:
```bash
# 1. Borrar componentes shadcn muertos
rm src/app/components/ui/chart.tsx
rm src/app/components/ui/calendar.tsx
rm src/app/components/figma/ImageWithFallback.tsx

# 2. Desinstalar dependencias sin usar
npm uninstall @mui/material @mui/icons-material @emotion/react @emotion/styled \
              recharts react-day-picker react-dnd react-dnd-html5-backend \
              react-slick react-responsive-masonry @popperjs/core react-popper
```

**Nota**: antes de borrar, hacer una búsqueda final `grep -r "@mui\|@emotion\|recharts\|react-day-picker" src/` para confirmar. Los imports dentro de `ui/chart.tsx` y `ui/calendar.tsx` aparecerán, pero esos archivos también se borran.

**Impacto**:
- `node_modules` mucho más pequeño (~50–80 MB menos).
- `npm install` más rápido en CI.
- Package lock más limpio.
- **Protección futura**: si alguien importa `@mui` por error, el bundle NO se infla silenciosamente.

---

### 🟡 MEDIOS

#### #12 — `next.config.ts` sin `experimental.optimizePackageImports`

**Archivo**: `next.config.ts:3-19`

**Problema**: Next.js 15 aplica auto-optimización a algunas librerías (`lucide-react`, `date-fns`), pero listar explícitamente las libs grandes acelera dev-mode startup y asegura tree-shaking agresivo.

**Fix**:
```ts
const nextConfig: NextConfig = {
  images: { /* ... */ },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'motion',
      'date-fns',
      '@radix-ui/react-icons',
    ],
  },
}
```

**Impacto**: HMR más rápido en dev, bundle más pequeño en rutas que solo usan 2-3 iconos de `lucide-react`.

---

#### #13 — `strapi.ts` con `revalidate: 60` global

**Archivo**: `src/lib/strapi.ts:9`

**Problema**: Todos los endpoints cachean 60 segundos. Esto es bueno para home/global que cambian, pero blog posts y services cambian raramente — podrían cachear más agresivamente.

**Fix opcional** — permitir override por llamada:
```ts
export async function fetchStrapi<T>(
  path: string,
  options?: { revalidate?: number | false; tags?: string[] }
): Promise<T> {
  const res = await fetch(`${CMS_URL}${path}`, {
    headers: { Authorization: `Bearer ${CMS_API}` },
    next: {
      revalidate: options?.revalidate ?? 60,
      tags: options?.tags,
    },
  })
  if (!res.ok) throw new Error(`Strapi fetch failed: ${res.status}`)
  const json = await res.json()
  return json.data
}
```

Usar `revalidate: 3600` para blog/services, `revalidate: 60` para home/global. Considerar `revalidateTag('blog-posts')` desde un webhook de Strapi cuando se publique contenido (on-demand revalidation).

**Impacto**: menos hits al CMS en páginas estables, mejor cache hit rate.

---

#### #14 — `'use client'` innecesario en `shared/Services/Services.tsx`

**Archivo**: `src/components/shared/Services/Services.tsx:1`

**Problema**: Tiene `'use client'` pero el archivo no usa ningún hook propio — solo pasa props a `ScrollReveal` (que ya es client component). El boundary se puede formar naturalmente en `ScrollReveal`.

**Fix**: eliminar `'use client'` de la primera línea. Verificar con `npm run build` que no salte error (si `ScrollReveal` requiere que el padre sea client, se mantiene).

**Impacto**: un componente más renderizable en servidor, menos JavaScript al cliente.

---

#### #15 — Script muerto `fix-images.js`

**Archivo**: `fix-images.js` (root)

**Problema**: El script apunta a `src/imports/WhyChoose.tsx`, `src/imports/SectionsFeaturedProperties.tsx`, `src/imports/HeroContainer.tsx` — todos archivos marcados como `D` en `git status` (borrados). El script es un artifact de una migración pasada.

**Fix**: `rm fix-images.js` en la raíz.

**Impacto**: limpieza, menos confusión.

---

### 🟢 BAJOS

#### #16 — Falta `icon.png` y `apple-icon.png`

**Archivos faltantes**:
- `src/app/icon.png` (o `.svg`) — app icon moderno
- `src/app/apple-icon.png` (180x180) — iOS home screen

**Fix**: exportar el logo en los tamaños correctos y colocarlos en `src/app/`. Next.js los detecta automáticamente y genera los `<link>` tags.

**Impacto**: apariencia profesional al añadir a home screen en iOS, favicon limpio en todas las plataformas.

---

#### #17 — `next.config.ts` sin `output: 'standalone'`

**Archivo**: `next.config.ts`

**Problema**: Si el proyecto se despliega con Docker/self-hosting, `output: 'standalone'` genera un bundle mínimo con solo las dependencias necesarias en `.next/standalone`. No crítico si el deploy es Vercel.

**Fix** (si aplica):
```ts
const nextConfig: NextConfig = {
  output: 'standalone',
  images: { /* ... */ },
}
```

**Impacto**: imagen Docker significativamente más pequeña, deploys más rápidos.

---

#### #18 — `alt=""` en imágenes decorativas sin `aria-hidden`

**Archivo**: `src/app/components/hero-section.tsx:200,211,220`

**Problema**: `alt=""` es técnicamente correcto (excluye de screen readers) pero sin `aria-hidden="true"` un revisor humano no sabe si es intencional o un bug.

**Fix**:
```tsx
<Image src={...} alt="" aria-hidden="true" fill priority />
```

**Impacto**: DX / accesibilidad explícita.

---

## 4. Lo que ya está bien ✅

Para balancear la auditoría, estos patrones **se confirmaron correctos** y deben mantenerse:

- **Async params**: todas las rutas dinámicas tipan `params` como `Promise<{ slug: string }>` y hacen `await params` correctamente (`blog/[slug]/page.tsx`, `services/[slug]/page.tsx`).
- **Server Components por defecto**: todos los `page.tsx` son Server Components. Solo `src/app/home-client.tsx` delega al cliente — patrón recomendado.
- **Data fetching paralelo sin waterfalls**:
  - `src/app/page.tsx:28-40` — `Promise.all` con 3 fetches.
  - `src/app/about-us/page.tsx` — `Promise.all` con 4 fetches.
  - `src/app/services/[slug]/page.tsx:52-57` — `Promise.all` con servicio + team.
- **URL resolution server-side**: `getStrapiImageUrl` se invoca en servidor antes de pasar data al cliente (`src/app/page.tsx:43-54`).
- **Route handler seguro**: `src/app/api/leads/route.ts` valida `CMS_API`, maneja errores, no expone secretos, devuelve status codes correctos.
- **No hay `useSearchParams`/`usePathname` sin Suspense**: ningún CSR bailout accidental.
- **Hydration safe**: `window`, `Math.random`, `Date.now` solo dentro de `useEffect`/`useCallback` (verificado en `hero-section.tsx`, `why-choose-section.tsx`, `Header.tsx`, `consultation-modal.tsx`).
- **`sharp` en `dependencies`**: correcto para self-hosting en Next 15. **NO mover a devDependencies**.
- **`next.config.ts` con formatos modernos**: `['image/avif', 'image/webp']` + `deviceSizes`/`imageSizes` bien definidos.
- **`remotePatterns`**: `scalara.propphy.com` (CMS Strapi) y `flagcdn.com` (banderas) configurados.
- **Sin scripts de terceros**: no hay GA/GTM/Pixel contaminando el bundle.
- **Uso correcto de `generateMetadata` dinámico**: con fallbacks `try/catch`.
- **`useReducedMotion`** en `scroll-reveal.tsx:68` — respeta preferencias de accesibilidad.

---

## 5. Roadmap sugerido

### Fase 1 — Quick wins (< 1 día)

Alto ROI, bajo esfuerzo. Orden sugerido:

1. **Borrar código muerto**: `src/app/404/`, `src/app/components/figma/ImageWithFallback.tsx`, `src/app/components/ui/chart.tsx`, `src/app/components/ui/calendar.tsx`, `fix-images.js`.
2. **Añadir `notFound()`** en `blog/[slug]/page.tsx` y `services/[slug]/page.tsx`.
3. **Crear `src/app/error.tsx` y `src/app/global-error.tsx`**.
4. **Actualizar `layout.tsx`** con `metadataBase`, `title.template`.
5. **Optimizar `generateStaticParams`** en `blog/[slug]` (quitar `populate=*`).
6. **Envolver fetches dinámicos con `React.cache`**.
7. **Desinstalar dependencias sin usar** (MUI, emotion, recharts, react-day-picker, react-dnd, react-slick, react-responsive-masonry, popperjs, react-popper).

### Fase 2 — Performance & SEO (1–2 días)

8. **Migrar fuentes a `next/font`** (Manrope + Results Letter) — impacto LCP mayor.
9. **Reemplazar `<img>` → `next/image`** en los 12 archivos listados.
10. **Crear `sitemap.ts` y `robots.ts`** dinámicos.
11. **Crear `opengraph-image.tsx`** (estática global). Opcionalmente: por blog post y service.

### Fase 3 — Polish (medio día)

12. **Añadir `experimental.optimizePackageImports`** en `next.config.ts`.
13. **Diferenciar `revalidate`** por tipo de contenido en `strapi.ts`.
14. **Quitar `'use client'`** innecesario en `shared/Services/Services.tsx`.
15. **Añadir `icon.png`/`apple-icon.png`**.
16. **Añadir `output: 'standalone'`** (solo si self-hosting con Docker).
17. **Añadir `aria-hidden`** a imágenes decorativas del hero.

---

## 6. Verificación

Cómo validar cada fix antes de marcar como completo:

### Build y tipos
```bash
npm run build
npm run lint
```
- Sin warnings de `metadataBase`.
- Sin errores de tipos en rutas dinámicas.
- `First Load JS` reducido vs baseline.

### Rutas 404
```bash
# En dev o prod
curl -I http://localhost:3000/blog/slug-que-no-existe
curl -I http://localhost:3000/services/slug-inventado
```
- Ambos deben devolver **HTTP 404** (no 200).

### Fuentes
Abrir DevTools → Network → filtro "font".
- **NO** debe haber request a `fonts.googleapis.com/css2`.
- Los `.woff2` de Manrope deben servirse desde `/_next/static/media/`.
- `<link rel="preload">` automático de Next debe aparecer en el HTML.

### Imágenes
DevTools → Network → filtro "img".
- Requests a `/_next/image?url=...&w=...&q=75`.
- `Content-Type: image/avif` (o `image/webp` como fallback).
- Imágenes decorativas deben tener `loading="lazy"`, excepto el hero LCP.

### SEO
```bash
curl http://localhost:3000/robots.txt
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/opengraph-image
```
- `robots.txt` incluye el sitemap.
- `sitemap.xml` lista todas las rutas estáticas + blog posts + services desde Strapi.
- OG image renderiza (PNG válido, 1200x630).

### Error boundary
Temporalmente en alguna página: `throw new Error('audit test')`.
- Debe verse la UI de `error.tsx`, no la pantalla azul de dev Next.js.
- El botón "Try again" debe llamar `reset()`.

### React.cache
Añadir `console.log('fetching', slug)` dentro de `getBlogPost` y `getService`. Cargar la página.
- Debe loggearse **una vez** por request, no dos.

### Lighthouse
```bash
# Instalar lighthouse CLI o usar Chrome DevTools
npx lighthouse http://localhost:3000 --only-categories=performance,seo,best-practices --view
```

**Targets post-fix**:
- Performance: +10 puntos vs baseline.
- SEO: 95+ (con sitemap, robots, metadata).
- Best Practices: 95+.

### Bundle
```bash
# Analizar el bundle antes y después de borrar deps
npm run build
ls -la node_modules | wc -l    # comparar número de paquetes
du -sh node_modules             # comparar tamaño
```

---

## Apéndice — Referencias de la skill

Cada hallazgo mapea a una sub-skill en `.claude/skills/next-best-practices/`:

| Hallazgo | Sub-skill |
|---|---|
| #1 | `font.md` |
| #2 | `file-conventions.md`, `error-handling.md` |
| #3 | `error-handling.md` |
| #4 | `error-handling.md`, `functions.md` |
| #5 | `metadata.md` |
| #6 | `metadata.md` |
| #7 | `metadata.md` |
| #8 | `image.md` |
| #9 | `data-patterns.md` |
| #10 | `functions.md` |
| #11 | `bundling.md` |
| #12 | `bundling.md` |
| #13 | `data-patterns.md` |
| #14 | `rsc-boundaries.md`, `directives.md` |
| #17 | `self-hosting.md` |
