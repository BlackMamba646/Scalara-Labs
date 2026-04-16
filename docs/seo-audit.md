# Auditoría SEO On-Page — Scalara Labs

**Fecha:** 2026-04-06
**Alcance:** Auditoría técnica y on-page del sitio marketing (Next.js 15 App Router). Incluye crawlability, indexación, metadata, HTML semántico, Core Web Vitals, optimización de imágenes y estructura de contenido.
**Fuera de alcance:** Authority/backlinks, keyword research competitivo, medición real de Core Web Vitals (requiere Search Console / PageSpeed en producción), análisis de E-E-A-T externo.
**Framework:** `.claude/skills/seo-audit/SKILL.md`

---

## 1. Resumen ejecutivo

**Estado general:** El sitio tiene una arquitectura Next.js bien pensada para SEO (páginas como Server Components, `generateMetadata()` dinámico tirando del CMS, imágenes con nombres descriptivos, alt text en contenido), pero está **funcionalmente invisible para Google** porque faltan los elementos base de indexación: no hay `robots.txt`, no hay `sitemap.xml`, no hay `metadataBase`, la página 404 se puede indexar, y no existe structured data. A esto se suma un problema de performance severo derivado de (a) 21 imágenes PNG sin optimizar sobre 500 KB, (b) una imagen hero de 2.39 MB en `/services`, (c) carga de Google Fonts vía `@import` bloqueante, y (d) duplicación MUI + shadcn/ui que infla el bundle JavaScript.

La buena noticia: casi todos los fixes son de configuración o edición puntual. Los fundamentos (SSR, metadata dinámica, CMS Strapi, Tailwind v4) están bien; solo faltan las piezas declarativas.

### Top 5 issues críticos

| # | Issue | Impacto | Referencia |
|---|-------|---------|------------|
| 1 | **Sin `robots.txt` ni `sitemap.xml`** — Google no descubre ni recibe directivas de crawl | Crítico | No existen `src/app/robots.ts` ni `src/app/sitemap.ts` |
| 2 | **Sin `metadataBase` en layout root** — URLs canónicas y OG son relativas, rotas para sharing social | Crítico | `src/app/layout.tsx:4-8` |
| 3 | **`not-found.tsx` sin metadata ni `noindex`** — riesgo de indexar la 404; además coexiste con `src/app/404/page.tsx` duplicado | Alto | `src/app/not-found.tsx`, `src/app/404/page.tsx` |
| 4 | **Hero de `/services` pesa 2.39 MB** — above-the-fold, sin optimizar, impacta LCP directamente | Alto | `src/assets/images/servicespageslisting-hero-section-listing-hero.png` |
| 5 | **Cero structured data (JSON-LD)** — sin Organization, Article, BreadcrumbList, Service schema | Alto | Búsqueda global: ninguna coincidencia de `application/ld+json` |

### Quick wins (bajo esfuerzo, alto retorno)

- Crear `src/app/robots.ts` y `src/app/sitemap.ts` (rutas nativas de Next.js 15).
- Añadir `metadataBase: new URL(...)` al layout root + variable `NEXT_PUBLIC_SITE_URL` en `.env`.
- Borrar `src/app/404/page.tsx` (convención de App Router es solo `not-found.tsx`) y exportar `metadata` con `robots: { index: false }` en `not-found.tsx`.
- Añadir `export const viewport` en `src/app/layout.tsx` (requerido por Next.js 15 App Router).
- Reemplazar el `<a href>` por `<Link>` en `BlogCards.tsx:129` (un cambio de import + tag).
- Convertir la imagen hero de `/services` a WebP/AVIF y servirla vía `<Image>` con `priority`.

---

## 2. Hallazgos técnicos

### 2.1 Crawlability

#### [TÉC-01] No existe `robots.txt`
- **Impact:** Alto
- **Evidence:** No existe `public/robots.txt` ni ruta `src/app/robots.ts`. Búsqueda en `public/` y `src/app/` sin coincidencias.
- **Fix:** Crear `src/app/robots.ts` usando la convención de Next.js 15 (exportar función default que devuelve `MetadataRoute.Robots`). Debe: (a) permitir crawl general (`User-agent: *`, `Allow: /`), (b) desautorizar rutas no públicas (`/api/`), (c) referenciar el sitemap con URL absoluta construida desde `NEXT_PUBLIC_SITE_URL`.
- **Priority:** 1

#### [TÉC-02] No existe `sitemap.xml`
- **Impact:** Alto
- **Evidence:** No existe `public/sitemap.xml` ni `src/app/sitemap.ts`. Strapi expone `/api/services` y `/api/blog-posts` (cfr. `CLAUDE.md` sección CMS) pero ninguna ruta del frontend los consume para generar un sitemap.
- **Fix:** Crear `src/app/sitemap.ts` que devuelva `MetadataRoute.Sitemap`. Debe incluir: rutas estáticas (`/`, `/about-us`, `/services`, `/blog`, `/lead-magnet`, `/privacy-policy`, `/terms-and-conditions`, `/cookie-policy`), rutas dinámicas (iterar `fetchStrapi<{ slug: string }[]>('/api/services?fields[0]=slug')` — el mismo patrón ya usado en `src/app/services/[slug]/page.tsx:45` para `generateStaticParams` — y `/api/blog-posts?populate=*&sort=date:desc` usado en `src/app/blog/[slug]/page.tsx:51`). Cada entrada debe llevar `lastModified`, `changeFrequency` y `priority`.
- **Priority:** 1

#### [TÉC-03] Arquitectura del sitio — páginas huérfanas potenciales
- **Impact:** Medio
- **Evidence:** Las páginas legales (`privacy-policy`, `terms-and-conditions`, `cookie-policy`) se enlazan desde el Footer (`src/components/shared/Footer/Footer.tsx:172`). La página `/lead-magnet` no aparece explícitamente en el Header — revisar si está enlazada desde home o solo es accesible por campaña directa.
- **Fix:** Hacer auditoría manual del Header (`src/components/shared/Header/Header.tsx`) y Footer para confirmar que toda ruta pública tiene al menos un enlace interno. Si `/lead-magnet` es intencionalmente campaña-only, documentarlo y asegurarse de que sí aparezca en el sitemap (para que Google la indexe igual).
- **Priority:** 3

### 2.2 Indexación

#### [TÉC-04] Página 404 sin `noindex` — riesgo de indexación
- **Impact:** Alto
- **Evidence:** `src/app/not-found.tsx` no exporta `metadata` ni `robots`. El componente retorna `<main>` con Header + Hero 404 + Footer pero sin ninguna directiva para crawlers.
- **Fix:** Añadir `export const metadata: Metadata = { title: '...', robots: { index: false, follow: true } }` en `not-found.tsx`. Next.js enviará el status 404 automáticamente (lo que ya es señal suficiente), pero el `noindex` explícito previene indexación accidental de soft-404s.
- **Priority:** 1

#### [TÉC-05] Páginas 404 duplicadas
- **Impact:** Medio
- **Evidence:** Existen `src/app/not-found.tsx` Y `src/app/404/page.tsx`. Ambos renderizan el mismo contenido. Esto es una inconsistencia con App Router — la convención oficial es solo `not-found.tsx`. El archivo `src/app/404/page.tsx` crea una ruta accesible vía `/404` que, al ser una página normal (status 200), puede indexarse como contenido duplicado.
- **Fix:** Eliminar `src/app/404/` completo. Mantener solo `src/app/not-found.tsx`.
- **Priority:** 1

#### [TÉC-06] Sin `metadataBase` — URLs canónicas y OG relativas
- **Impact:** Crítico
- **Evidence:** `src/app/layout.tsx:4-8` solo declara `title` y `description`. Sin `metadataBase`, Next.js 15 emite warnings en build y las URLs en `og:image`, `og:url`, `twitter:image` y canonical son relativas — lo que rompe compartidos sociales (Facebook, LinkedIn, Twitter validan URLs absolutas).
- **Fix:** Añadir `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!)` al objeto `metadata` del layout root. Requiere crear la variable en `.env` (ver TÉC-07).
- **Priority:** 1

#### [TÉC-07] Falta `NEXT_PUBLIC_SITE_URL` en `.env`
- **Impact:** Crítico (bloqueante de TÉC-06, TÉC-01, TÉC-02)
- **Evidence:** `.env` actual solo contiene `CMS_URL` y `CMS_API`. No hay ninguna variable que exponga el dominio público del frontend.
- **Fix:** Añadir `NEXT_PUBLIC_SITE_URL=https://scalaralabs.com` (o el dominio real) a `.env` y `.env.example`. Usarla en `layout.tsx`, `robots.ts`, `sitemap.ts` y cualquier lugar donde se necesite construir URLs absolutas para Open Graph.
- **Priority:** 1

#### [TÉC-08] Sin canonical URLs en páginas
- **Impact:** Alto
- **Evidence:** Ninguna de las `generateMetadata()` incluye `alternates.canonical`. Revisado en: `src/app/page.tsx:9-25`, `src/app/about-us/page.tsx:33-46`, `src/app/services/page.tsx:12-25`, `src/app/services/[slug]/page.tsx:28-44`, `src/app/blog/page.tsx:27-40`, `src/app/blog/[slug]/page.tsx:34-49`, `src/app/lead-magnet/page.tsx:30-43`, y las tres páginas legales (`:22-27`).
- **Fix:** En cada `generateMetadata()`, añadir `alternates: { canonical: '/ruta-actual' }`. Con `metadataBase` configurado, Next.js resolverá a URL absoluta automáticamente. Para las páginas dinámicas (`[slug]`), construir la ruta con el slug recibido por params.
- **Priority:** 2

#### [TÉC-09] Sin `trailingSlash` explícito en `next.config.ts`
- **Impact:** Bajo
- **Evidence:** `next.config.ts` no declara `trailingSlash`. El default es `false`, pero dejarlo implícito puede crear ambigüedad si alguien añade rewrites o el hosting añade redirects propios.
- **Fix:** Declarar explícitamente `trailingSlash: false` en `next.config.ts` para documentar la decisión y evitar que `/servicios` y `/servicios/` se traten como distintas (canonicalización inconsistente).
- **Priority:** 4

### 2.3 Core Web Vitals (estimación estática)

> Nota: La skill recomienda medir CWV con PageSpeed Insights o Chrome DevTools. Este análisis es estimación basada en código estático — los valores reales requieren el sitio en producción.

#### [TÉC-10] LCP probable > 2.5s por imagen hero no optimizada
- **Impact:** Alto
- **Evidence:** `src/assets/images/servicespageslisting-hero-section-listing-hero.png` pesa **2.39 MB**. Es el hero de la página `/services`, above the fold. Aunque `next.config.ts:5` tiene `formats: ["image/avif", "image/webp"]` configurado, esto solo se aplica cuando la imagen se sirve mediante `<Image>` de `next/image`. Solo hay 3 usos de `<Image>` en todo el proyecto contra 49 usos de `<img>` raw.
- **Fix:** (a) convertir el archivo fuente a WebP o AVIF (tool externa o `sharp` en un script one-off); (b) reemplazar el `<img>` que lo renderiza por `<Image>` de `next/image` con `priority` y `sizes` correcto; (c) auditar las otras 20 imágenes > 500 KB (ver TÉC-12).
- **Priority:** 1

#### [TÉC-11] FCP/LCP penalizado por Google Fonts vía `@import`
- **Impact:** Alto
- **Evidence:** `src/styles/fonts.css:2` carga Manrope con `@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap')`. `@import` dentro de CSS bloquea el parse hasta que ese recurso externo se descarga. Además, se cargan 7 pesos (200-800) aunque probablemente no se usen todos.
- **Fix:** Migrar a `next/font/google` en `src/app/layout.tsx`. `next/font` (a) self-hostea las fuentes en build, eliminando la request externa; (b) inyecta `<link rel="preload">` automáticamente; (c) elimina el bloqueo de `@import`. La fuente self-hosted `Results Letter` (líneas 5-39 del mismo archivo) puede mantenerse porque ya usa `font-display: swap` y WOFF2 local, o migrarse a `next/font/local` para consistencia y zero-layout-shift.
- **Priority:** 1

#### [TÉC-12] 21 imágenes PNG > 500 KB sin convertir
- **Impact:** Alto
- **Evidence:** Archivos problemáticos en `src/assets/images/`:
  - `servicespageslisting-hero-section-listing-hero.png` (2.39 MB)
  - `aboutus-hero-section-team.png` (1.8 MB)
  - `servicespageslisting-services-grid-web-dev.png` (1.48 MB)
  - `servicespageslisting-services-grid-web-app.png` (1.36 MB)
  - `servicespageslisting-services-grid-api.png` (1.34 MB)
  - `servicespageslisting-services-grid-mobile-app.png` (1.26 MB)
  - `servicespageslisting-services-grid-mvp.png` (1.19 MB)
  - `servicespageslisting-services-grid-ecommerce.png` (1.11 MB)
  - `servicepage-case-study-image15.png` (904 KB)
  - `home-hero-mobile-bg.png` (847 KB)
  - `home-team-member-1.png` (782 KB)
  - `home-team-member-3.png` (760 KB)
  - `servicepage-why-choose-real-world-img.png` (746 KB)
  - `home-hero-overlay.png` (673 KB)
  - `home-team-member-4.png` (647 KB)
  - `aboutus-team-member-kris.png` (595 KB)
  - `servicepage-why-choose-built-beyond-img-overlay.png` (566 KB)
  - `servicepage-why-choose-native-cross-platform-img.png` (556 KB)
  - `home-team-member-2.png` (532 KB)
  - Plus 2 más listados por el scan.
- **Fix:** Dos opciones complementarias: (a) preprocesar: convertir todos los assets a WebP/AVIF con `sharp` o `cwebp` antes de commitear (ganancia de 60-80% en tamaño), guardando en `src/assets/images/` con extensión correcta y actualizando imports; (b) servir vía `<Image>`: Next.js convertirá on-the-fly al formato óptimo siempre que la imagen se importe y pase al componente `Image`. Hacer ambas es lo ideal, empezando por (b) porque requiere menos trabajo de build y se puede auditar archivo por archivo.
- **Priority:** 2

#### [TÉC-13] 49 `<img>` raw vs 3 `<Image>` — oportunidad masiva de optimización
- **Impact:** Alto
- **Evidence:** Grep de `<img ` da 49 coincidencias; grep de `from ['"]next/image['"]` + uso da solo 3. La mayoría de imágenes renderizadas en secciones (`src/page-sections/...`, `src/components/shared/...`, `src/app/components/...`) usan `<img>` estándar con `src={...}` importado.
- **Fix:** Reemplazar `<img>` por `<Image>` en todos los casos donde se muestre contenido rasterizado (PNG/JPG). Excepciones legítimas: SVGs inline que sí pueden quedar como `<img>` (no se benefician de optimización de Next.js) o backgrounds puramente decorativos cargados vía CSS. Priorizar reemplazos por above-the-fold primero: heroes de `/`, `/services`, `/about-us`, `/lead-magnet`.
- **Priority:** 2

#### [TÉC-14] Animaciones Motion sobre contenido above-the-fold
- **Impact:** Medio
- **Evidence:** `src/app/components/hero-section.tsx:94-134` envuelve trust badge, H1 y CTA en `<ScrollReveal>` con delays 0.1s, 0.25s y 0.4s respectivamente. Aunque `ScrollReveal` respeta `useReducedMotion()` (bueno), para usuarios sin esa preferencia el LCP se retrasa por la animación de entrada. Situación similar en `src/page-sections/LeadMagnetPage/sections/HeroContainer/HeroContainer.tsx` con delays escalonados en los campos del formulario (0.9s → 1.2s).
- **Fix:** Para contenido above-the-fold (hero H1 + CTA principal), eliminar `ScrollReveal` o usar `initial="visible"` para que el elemento aparezca sin animación en el primer render. Reservar las animaciones para contenido que entra al viewport por scroll. Alternativa: reducir los delays a 0 y usar solo `opacity` + pequeño `translateY` para que el LCP ocurra en el primer frame.
- **Priority:** 3

#### [TÉC-15] Bundle JavaScript inflado por duplicación MUI + shadcn/ui
- **Impact:** Alto
- **Evidence:** `package.json` declara `@mui/material@7.3.5`, `@mui/icons-material@7.3.5`, `@emotion/react@11.14.0`, `@emotion/styled@11.14.1` (MUI stack) junto a 30+ primitivos `@radix-ui/react-*` y ~48 componentes shadcn/ui en `src/app/components/ui/`. Adicionalmente hay dos librerías de carrusel (`embla-carousel-react@8.6.0` y `react-slick@0.31.0`). Estimación de bundle inicial: 600-700 KB gzipped.
- **Fix:** Auditoría de uso: (a) identificar qué componentes MUI realmente se importan en páginas públicas (ej. con `grep -r "from '@mui"` en `src/`). Si es un uso puntual, migrarlo a shadcn/ui/Radix para eliminar todo el stack MUI + Emotion. (b) Elegir una única librería de carrusel y eliminar la otra. (c) Revisar `src/app/components/ui/` y eliminar componentes shadcn que no se usen en ninguna ruta de producción (muchos se instalan por default y nunca se tocan).
- **Priority:** 2

#### [TÉC-16] CLS probablemente bajo — positivo
- **Impact:** N/A (positivo)
- **Evidence:** Animaciones Motion usan `transform` y `opacity` (sin forzar layout). `font-display: swap` en `src/styles/fonts.css` evita FOIT. Imágenes en heroes usan `sizes` explícito en los casos con `<Image>`.
- **Fix:** Mantener. Cuando se migren los `<img>` a `<Image>` (TÉC-13), asegurar siempre `width`/`height` o `fill` + contenedor con dimensiones definidas para que el CLS siga siendo bajo.
- **Priority:** N/A

### 2.4 Mobile-friendliness

#### [TÉC-17] Falta `export const viewport` en layout root
- **Impact:** Alto
- **Evidence:** `src/app/layout.tsx` no exporta `viewport`. Next.js 15 separa `viewport` de `metadata` y lanza warning en build si no se declara. Sin él, el comportamiento default puede variar y no hay garantía de `width=device-width, initial-scale=1`.
- **Fix:** Añadir `export const viewport: Viewport = { width: 'device-width', initialScale: 1 }`. Opcionalmente incluir `themeColor` para la barra del navegador móvil.
- **Priority:** 1

#### [TÉC-18] Responsive design implementado vía Tailwind breakpoints — positivo
- **Impact:** N/A (positivo)
- **Evidence:** Uso extensivo de `max-md:`, `max-lg:`, `max-sm:` en los componentes (ej. `src/app/components/hero-section.tsx:106,123`). Imágenes hero tienen `sizes="(max-width: 767px) 100vw, ..."`.
- **Fix:** Mantener. Verificar manualmente en Chrome DevTools (mobile emulation) que no hay overflow horizontal en ninguna página — especialmente en `/services/[slug]` que tiene secciones con layouts complejos.
- **Priority:** N/A

### 2.5 Seguridad / Headers

#### [TÉC-19] Sin security headers en `next.config.ts`
- **Impact:** Medio
- **Evidence:** `next.config.ts` no define la función `headers()`. Esto significa que no hay `Strict-Transport-Security` (HSTS), `X-Content-Type-Options: nosniff`, `X-Frame-Options`, `Referrer-Policy`, ni `Content-Security-Policy`. Tampoco hay `src/middleware.ts`.
- **Fix:** Añadir `headers()` en `next.config.ts` aplicando a `/(.*)`: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` (o `SAMEORIGIN` si alguna vez se embebe). CSP requiere más cuidado por los dominios externos (fuentes Google si no se migran, CDN Strapi) — considerar `report-only` primero. Adicionalmente, desactivar `poweredByHeader: false` para no exponer el framework.
- **Priority:** 3

### 2.6 URL structure

#### [TÉC-20] Estructura de URLs limpia — positivo
- **Impact:** N/A (positivo)
- **Evidence:** Rutas como `/about-us`, `/services`, `/services/[slug]`, `/blog`, `/blog/[slug]`, `/lead-magnet`, `/privacy-policy` son descriptivas, lowercase, con guiones. No hay parámetros de query para contenido, no hay IDs numéricos.
- **Fix:** Mantener. Validar que los slugs del CMS Strapi sigan la misma convención (lowercase, guiones, sin caracteres especiales). Para blog posts, considerar incluir la fecha o categoría si eso ayuda al keyword targeting, aunque tampoco es obligatorio.
- **Priority:** N/A

---

## 3. Hallazgos on-page

### 3.1 Title tags

#### [OP-01] Títulos sin formato consistente con brand
- **Impact:** Medio
- **Evidence:** Los fallbacks de título son inconsistentes:
  - `src/app/page.tsx:14` → `"Scalara Labs"` (sin pipe ni separador)
  - `src/app/about-us/page.tsx:38` → `"About Us | Scalara Labs"`
  - `src/app/services/page.tsx:17` → `"Services | Scalara Labs"`
  - `src/app/blog/page.tsx:32` → `"Blog | Scalara Labs"`
  - `src/app/lead-magnet/page.tsx:35` → `"Free Technical Audit | Scalara Labs"`
  - Páginas legales → `"Privacy Policy | Scalara Labs"`, etc.
  - Service detail (`services/[slug]/page.tsx:40`) → `service?.seo?.metaTitle ?? service?.title ?? 'Service'` (peor fallback: `"Service"` sin brand)
  - Blog post (`blog/[slug]/page.tsx:43`) → `post?.seo?.metaTitle ?? post?.title ?? 'Blog | Scalara Labs'`
- **Fix:** Usar `title.template` en el layout root para aplicar el sufijo brand automáticamente. Cada página solo declara el título de la página y Next.js lo compone con el template. Para home, usar `title.absolute` para que no aplique el template. Esto elimina la inconsistencia y asegura que `generateMetadata` dinámica de CMS nunca olvide el brand.
- **Priority:** 2

#### [OP-02] Títulos potencialmente subóptimos en longitud y keyword
- **Impact:** Medio
- **Evidence:** Los fallbacks son descriptivos pero cortos:
  - Home: `"Scalara Labs"` (12 chars) — desperdicia el espacio SERP (50-60 chars recomendados). El CMS puede sobrescribir pero el fallback es pobre.
  - Servicios: `"Services | Scalara Labs"` — genérico, sin keyword.
  - Blog: `"Blog | Scalara Labs"` — mismo problema.
- **Fix:** Mejorar fallbacks con keywords del negocio. Revisar el `seo.metaTitle` en Strapi para cada Single Type (`home-page`, `services-page`, `blog-listing-page`, etc.) para asegurar que tenga título optimizado (primaria keyword + beneficio + brand, 50-60 chars). Esto es cross-team: requiere poblar los campos `seo` en el CMS. Los fallbacks del código son solo safety net.
- **Priority:** 3

### 3.2 Meta descriptions

#### [OP-03] Descripciones inconsistentes y algunas muy cortas
- **Impact:** Medio
- **Evidence:**
  - `src/app/page.tsx:15-16` → `"Senior Software Engineers. Startup Speed. Enterprise Quality."` (61 chars, corto — el óptimo es 150-160)
  - `src/app/privacy-policy/page.tsx:25` → `"Scalara Labs privacy policy."` (28 chars, extremadamente corto)
  - `src/app/terms-and-conditions/page.tsx:25` → `"Scalara Labs terms and conditions."` (35 chars)
  - `src/app/cookie-policy/page.tsx:25` → `"Scalara Labs cookie policy."` (27 chars)
  - `src/app/services/[slug]/page.tsx:41` → fallback vacío `''` cuando no hay `service?.seo?.metaDescription`
  - `src/app/blog/[slug]/page.tsx:45-48` → usa `post?.excerpt` como fallback (razonable) pero luego cae a un genérico
- **Fix:** (a) Ampliar fallbacks de `page.tsx` a 150-160 chars con propuesta de valor clara + CTA implícito. (b) Nunca dejar `description: ''` — usar siempre un fallback útil aunque sea el de la página padre. (c) Para páginas legales, ampliar ligeramente (aunque no son páginas que se rankeen, vale la pena evitar descripciones que parezcan placeholder). (d) Poblar `seo.metaDescription` en todos los Single Types del CMS.
- **Priority:** 3

### 3.3 Open Graph y Twitter Cards

#### [OP-04] Sin OG en 9 de 10 páginas
- **Impact:** Alto
- **Evidence:** Solo `src/app/services/[slug]/page.tsx:41` define `openGraph.images`. Ninguna otra página tiene `openGraph` (ni home, ni about, ni services listing, ni blog listing, ni blog post, ni lead-magnet, ni legales, ni 404). El root layout (`src/app/layout.tsx:4-8`) tampoco define OG defaults.
- **Fix:** Tres niveles: (a) Definir `openGraph` default en el layout root con `siteName: 'Scalara Labs'`, `locale: 'en_US'` (o `es_ES` según idioma final), `type: 'website'`, e imagen fallback (crear un `opengraph-image.png` o `opengraph-image.tsx` en `src/app/` — Next.js lo picks up por convención). (b) En cada `generateMetadata` de página, sobrescribir `title`, `description`, `url` (computado con slug) y opcionalmente `images`. (c) Para páginas dinámicas (`/services/[slug]`, `/blog/[slug]`), usar la imagen de contenido del CMS — reutilizando `getStrapiImageUrl()` que ya existe en `src/app/services/[slug]/page.tsx:41`.
- **Priority:** 2

#### [OP-05] Cero Twitter Cards en el sitio
- **Impact:** Medio
- **Evidence:** Búsqueda global de `twitter:` en `generateMetadata` y layouts: ninguna coincidencia. El `metadata.twitter` nunca se declara.
- **Fix:** Definir `twitter` en el layout root con `card: 'summary_large_image'`, `site: '@handle'` (si existe cuenta Twitter corporativa), `creator`. Las páginas heredarán automáticamente, y donde haya OG image, Twitter la usará por default.
- **Priority:** 3

#### [OP-06] Sin `opengraph-image` ni `twitter-image` como convenciones de App Router
- **Impact:** Medio
- **Evidence:** No existe `src/app/opengraph-image.*` ni `src/app/twitter-image.*`. Next.js 15 permite definir una imagen OG default creando un archivo con ese nombre (estático `.png` o dinámico `.tsx`).
- **Fix:** Crear `src/app/opengraph-image.png` (1200x630, ideal) como fallback global. Opcional: crear `opengraph-image.tsx` dinámico por ruta para páginas que necesiten imagen específica (ej. `src/app/blog/[slug]/opengraph-image.tsx` que renderice el título del post con branding).
- **Priority:** 3

### 3.4 Heading hierarchy

#### [OP-07] Blog Listing salta de H1 → H3 sin H2 intermedio
- **Impact:** Alto
- **Evidence:** `src/page-sections/BlogListing/sections/BlogHero/BlogHero.tsx:52` tiene el H1 de la página. Luego, `src/page-sections/BlogListing/sections/BlogCards/BlogCards.tsx:146` renderiza los títulos de cada card como `<h3>`. No hay `<h2>` intermedio.
- **Fix:** Cambiar los títulos de cards a `<h2>` (cada blog post es la siguiente sección semántica después del hero). Alternativa: añadir un `<h2>` de sección antes del grid (ej. "Latest articles") y dejar las cards como `<h3>`.
- **Priority:** 2

#### [OP-08] Blog Post tiene jerarquía rota H1 → H3 → H2
- **Impact:** Alto
- **Evidence:** `src/page-sections/BlogPostPage/sections/BlogPostHero/BlogPostHero.tsx:47` define el `<h1>` del post. Luego, `src/page-sections/BlogPostPage/sections/BlogPostContent/BlogPostContent.tsx:188` usa un `<h3>` para "About This Article" (banner sidebar). Más adelante, el CTA compartido (`src/components/shared/Cta/Cta.tsx:76`) renderiza un `<h2>`. El orden resultante es H1 → H3 → H2, que los crawlers flag como malformación.
- **Fix:** Cambiar el `<h3>` del banner "About This Article" a `<h2>`, o moverlo después del CTA. Si es una barra lateral puramente decorativa, considerar quitar el heading completamente y usar un `<p>` con estilo visual de título.
- **Priority:** 2

#### [OP-09] About Us usa `<p>` estilizado como parte del H1
- **Impact:** Medio
- **Evidence:** `src/page-sections/AboutUs/sections/HeroSection/HeroSection.tsx:95` abre un `<h1>` con el texto principal. Línea 98 renderiza un `<p className="...h1...h1--large">` con un fragmento adicional del título. Esto parece ser un split visual para aplicar dos estilos distintos, pero semánticamente deja parte del "heading" fuera del tag H1.
- **Fix:** Opción A: mover el contenido del `<p>` dentro del `<h1>` como un `<span>` con la clase de estilo (el navegador permite mezclar spans dentro de H1 — esto es exactamente lo que hace el hero de home en `src/app/components/hero-section.tsx:105`). Opción B: dejarlo como párrafo separado pero cambiar la clase para que no sugiera que es un heading.
- **Priority:** 3

#### [OP-10] Lead Magnet — mismatch classname en sección heading
- **Impact:** Bajo
- **Evidence:** `src/page-sections/LeadMagnetPage/sections/AuditReveals/AuditReveals.tsx:111` renderiza un `<h2>` pero la clase aplicada incluye `__h4` (naming sugiere que visualmente es un h4). Semánticamente es correcto (es un H2), pero el naming es confuso para futuros devs.
- **Fix:** Renombrar la clase a algo coherente con el tag (`__section-heading` o similar). No urgente.
- **Priority:** 5

### 3.5 Content optimization

#### [OP-11] H1s son strong y keyword-rich — positivo
- **Impact:** N/A (positivo)
- **Evidence:** Los H1 de cada página están bien formulados:
  - Home: `"Senior Software Engineers. Startup Speed. Enterprise Quality."`
  - About Us: `"Experienced Engineers for High-Impact Digital Products"`
  - Services: `"Everything You Need to Build, Launch, and Scale"`
  - Blog: `"Our Blog. Build smarter. Avoid expensive mistakes."`
  - Lead Magnet: `"Get a Free Technical Audit of Your Software"`
  - Service detail: dinámico desde CMS (ej. `"Mobile App Development"`)
  - 404: `"Oh No! Error 404"`
- **Fix:** Mantener. Revisar con el equipo de marketing que estos reflejen las keywords primarias objetivo del sitio. Si "software development agency", "custom software development", "remote engineering team", etc. son keywords target, considerar incorporarlas en el H1 del home o el intro.
- **Priority:** N/A

#### [OP-12] Páginas legales dependen 100% de CMS para contenido
- **Impact:** Bajo
- **Evidence:** `src/page-sections/Legal/sections/LegalContent/LegalContent.tsx` renderiza el contenido dinámicamente desde Strapi con `const Tag = \`h${block.level || 2}\`` (línea ~60). Si el CMS está vacío o no responde, la página queda sin contenido.
- **Fix:** Añadir contenido de fallback hardcoded en el componente o un mensaje genérico. No es crítico para SEO — estas páginas no son ranking targets — pero sí para UX y trust signals.
- **Priority:** 5

### 3.6 Images

#### [OP-13] 49 `<img>` raw — ver TÉC-13
- **Impact:** Alto
- **Evidence:** Duplicado con el hallazgo técnico. El impacto on-page es que sin `<Image>` no hay lazy loading automático por default (salvo que se añada `loading="lazy"` manualmente), ni srcset responsive.
- **Fix:** Ver [TÉC-13].
- **Priority:** 2

#### [OP-14] Alt text descriptivo en contenido — positivo con excepciones
- **Impact:** N/A (mayoría positivo)
- **Evidence:** Alt text bueno encontrado:
  - `"Scalara Labs team working together"` (AboutUs hero)
  - `"Docker"`, `"AWS"`, `"React"`, `"Flutter"`, etc. (tech logos)
  - `"Mobile app dashboard with live data on multiple devices"` (service features)
  - `"Blog post hero illustration showing design components"`
  - Imágenes decorativas usan `alt=""` correctamente (con `aria-hidden="true"` donde aplica)
- **Fix:** Mantener el estándar. Auditar dos grupos con alt vacío:
  - (a) Header/Footer logos (`src/components/shared/Header/Header.tsx:63,66,69` y `src/components/shared/Footer/Footer.tsx:53,77`): OK funcionalmente porque el `<Link>` padre tiene `aria-label="Scalara Labs — Home"`, pero considerar dar alt descriptivo al logo principal para imagenes sin javascript.
  - (b) Iconos de caret/flecha en Header (`:93, :111, :155, :172`): son decorativos, OK como están.
- **Priority:** 4

#### [OP-15] Nombres de archivo de imágenes — descriptivos, positivo
- **Impact:** N/A (positivo)
- **Evidence:** Nombres como `aboutus-hero-section-team.png`, `servicepage-why-choose-real-world-img.png`, `bloglisting-blog-cards-image-01.webp` son descriptivos y seguiría una convención `{página}-{sección}-{elemento}`. No hay hashes binarios en `src/assets/images/`. Los hashes que aparecían en `public/assets/` fueron borrados (ver `git status`).
- **Fix:** Mantener. Para imágenes de blog post que vengan del CMS, asegurarse de que Strapi permita nombres descriptivos en upload y que el CMS los preserve en el URL público.
- **Priority:** N/A

### 3.7 Internal linking

#### [OP-16] BlogCards usa `<a href>` en vez de `<Link>` para rutas internas
- **Impact:** Medio
- **Evidence:** `src/page-sections/BlogListing/sections/BlogCards/BlogCards.tsx:129` renderiza `<a href={card.slug ? \`/blog/${card.slug}\` : '/blog/page'} ...>`. Esto: (a) rompe la navegación client-side de Next.js (full page reload), (b) hace que el prefetch automático no funcione, (c) el fallback `/blog/page` parece un bug (apunta a una ruta que no existe).
- **Fix:** Importar `Link` desde `next/link` y reemplazar `<a>` por `<Link>`. Corregir el fallback de href a algo válido (por ejemplo `'#'` o no renderizar el link cuando no haya slug).
- **Priority:** 2

#### [OP-17] Anchor text descriptivo — positivo
- **Impact:** N/A (positivo)
- **Evidence:** No se encontraron patrones genéricos de "click here", "read more", "aquí". Los CTAs usan copy accionable ("Get a free consultation", "Explore further", "Book a Free Consultation"). Los links sociales (Footer) tienen `aria-label="Instagram"`, `aria-label="LinkedIn"`.
- **Fix:** Mantener.
- **Priority:** N/A

#### [OP-18] Footer Contact — no usa `<address>` semántico
- **Impact:** Bajo
- **Evidence:** El bloque de contacto en Footer usa `<a href="mailto:...">` y `<a href="tel:...">` pero no está envuelto en `<address>`. `<address>` es el elemento HTML correcto para información de contacto del autor/organización en `<footer>`.
- **Fix:** Envolver el bloque de contacto (email, teléfono, dirección si existe) en `<address>`.
- **Priority:** 5

#### [OP-19] Fechas de blog no usan `<time datetime>`
- **Impact:** Bajo
- **Evidence:** Las fechas de las cards de blog se renderizan como `<p>` (ver `src/page-sections/BlogListing/sections/BlogCards/BlogCards.tsx` alrededor de línea 145). `<time datetime="YYYY-MM-DD">` es el elemento semántico correcto y es consumido por Google para rich snippets de artículos.
- **Fix:** Reemplazar `<p>` por `<time dateTime={...}>` en el render de fechas. Usar el campo `date` de Strapi como valor del attribute. Esto además se alinea con el `datePublished` del futuro JSON-LD de tipo Article (ver OP-22).
- **Priority:** 4

### 3.8 Semantic HTML

#### [OP-20] Home y About Us no envuelven el contenido en `<main>`
- **Impact:** Medio
- **Evidence:** `src/app/home-client.tsx` usa `<div className="size-full">` como wrapper exterior. `src/page-sections/AboutUs/sections/HeroSection/HeroSection.tsx` renderiza el contenido dentro de fragment `<>`. Ninguna de las dos páginas tiene el landmark `<main>` que los lectores de pantalla y crawlers usan para identificar el contenido principal. En contraste, `src/app/not-found.tsx`, las páginas legales, `/services`, `/services/[slug]`, `/blog`, `/blog/[slug]` y `/lead-magnet` sí usan `<main>` correctamente.
- **Fix:** Envolver el return de `home-client.tsx` en `<main>` (respetando el layout visual — `<main>` puede llevar `className="size-full"`). Para About Us, añadir `<main>` en `src/app/about-us/page.tsx` o en el primer componente shared que renderice la página.
- **Priority:** 3

#### [OP-21] Sin `<figure>`/`<figcaption>` ni otros semantics puntuales
- **Impact:** Bajo
- **Evidence:** No se usan `<figure>`, `<figcaption>`. Esto es opcional pero útil para imágenes de contenido con caption (ej. imágenes en blog posts).
- **Fix:** Considerar añadir `<figure>` + `<figcaption>` en el renderer de blog post content cuando la imagen tenga caption en el CMS. No crítico.
- **Priority:** 5

### 3.9 Structured data

#### [OP-22] Cero JSON-LD en el sitio
- **Impact:** Alto
- **Evidence:** Grep global de `application/ld+json` → 0 coincidencias. Grep de `@context` → solo coincidencias no-schema. El sitio no expone ningún structured data.
- **Fix:** Implementar al menos estos schemas como JSON-LD server-rendered (porque Next.js SSR, no hay problema de detección que menciona la skill):
  - **Organization**: en `src/app/layout.tsx` (global). Campos: `name`, `url`, `logo`, `contactPoint` (email, teléfono del Footer), `sameAs` (LinkedIn, GitHub si tiene), `foundingDate` si se sabe.
  - **WebSite** con `potentialAction.SearchAction`: opcional pero útil si hay búsqueda.
  - **BreadcrumbList**: en cada página que no sea home, describiendo la jerarquía (Home → Services → Mobile App Development).
  - **Article**: en `src/app/blog/[slug]/page.tsx`, con `headline`, `datePublished`, `dateModified`, `author`, `image`, `publisher` (referencia a Organization).
  - **Service**: en `src/app/services/[slug]/page.tsx`, describiendo cada servicio como `Service` con `provider` (Organization), `areaServed`, `serviceType`.
  - **FAQPage**: si alguna página tiene secciones Q&A explícitas (el componente `WhatMakesUsDifferent` parece acordeón — podría ser candidato).
  Para implementar: en cada página, construir el objeto y renderizarlo con `<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />`. Next.js lo enviará en el HTML inicial.
- **Priority:** 2

### 3.10 Favicon, manifest e icons

#### [OP-23] Solo existe `favicon.ico`; faltan PWA icons y manifest
- **Impact:** Bajo
- **Evidence:** Existe `src/app/favicon.ico`. No existen `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/manifest.webmanifest`, ni `src/app/manifest.ts`.
- **Fix:** Next.js 15 soporta convenciones de archivo: crear `icon.png` (512x512), `apple-icon.png` (180x180), y opcionalmente `manifest.webmanifest` o `manifest.ts` para PWA support. El manifest debería declarar `name`, `short_name`, `description`, `start_url`, `display`, `background_color`, `theme_color`, y array de `icons`.
- **Priority:** 4

### 3.11 Internationalization

#### [OP-24] `<html lang="en">` hardcoded — considerar si el sitio será multiidioma
- **Impact:** Bajo (depende de roadmap)
- **Evidence:** `src/app/layout.tsx` declara `<html lang="en">`. El contenido del sitio está en inglés. El usuario escribe en español pero eso no implica necesariamente que el sitio lo sea.
- **Fix:** Si se planea versión en español: configurar i18n routing de Next.js (`/en/...`, `/es/...`), declarar `alternates.languages` en metadata, y añadir `hreflang` tags. Si el sitio se queda en inglés, mantener `lang="en"` y documentarlo.
- **Priority:** 5 (o subir si hay plan bilingüe)

---

## 4. Hallazgos de contenido

> Nota: E-E-A-T y evaluación profunda de contenido requieren revisión editorial manual, no solo análisis de código. Estos hallazgos son los derivables del estado del repo.

### 4.1 E-E-A-T signals

#### [CNT-01] Trust signals presentes pero sin structured data de soporte
- **Impact:** Medio
- **Evidence:** El sitio tiene secciones que refuerzan trust: Team section (`src/components/shared/Team/Team.tsx`), tech logos (Docker, AWS, React, etc.), case study en service pages, badges de Clutch/Upwork/Fiverr en Footer, testimonios. Pero ninguno de estos está marcado con schema para que Google los reconozca.
- **Fix:** (a) Añadir `Person` schema para cada miembro del equipo si se usan en contenido público (con `jobTitle`, `image`, `sameAs` LinkedIn); (b) añadir `AggregateRating` si hay reviews de clientes cuantificadas (Clutch, Upwork); (c) marcar case studies con `Article` o `CreativeWork`. Duplica parcialmente OP-22.
- **Priority:** 3

#### [CNT-02] Sin páginas de autor para blog posts
- **Impact:** Medio
- **Evidence:** Los blog posts tienen campo `author` potencialmente en CMS, pero no existe una ruta `/author/[slug]` o `/team/[slug]` que permita navegar a una página individual del autor (lo cual es señal de E-E-A-T que Google valora).
- **Fix:** Considerar crear `src/app/team/[slug]/page.tsx` con bio, credenciales, posts escritos por ese autor. Cada blog post linkearía al autor. No urgente pero es una oportunidad para E-E-A-T.
- **Priority:** 4

### 4.2 Thin content

#### [CNT-03] Páginas legales hardcoded con descripciones de 1 línea
- **Impact:** Bajo
- **Evidence:** Los fallbacks de descripción de `privacy-policy`, `terms-and-conditions`, `cookie-policy` son mínimos (`"Scalara Labs privacy policy."` etc.). El contenido real viene del CMS — si el CMS no está poblado, las páginas aparecerán casi vacías para Google.
- **Fix:** Asegurar que el CMS tenga el contenido legal poblado. Estas páginas no son ranking targets pero la ausencia de contenido real es señal negativa (thin content) y además es requerimiento legal.
- **Priority:** 3 (legal) / 5 (SEO)

#### [CNT-04] Sin contenido evergreen pesado / pillar pages
- **Impact:** Medio
- **Evidence:** El blog existe (ruta `/blog`, render OK) pero no hay evidencia en el CMS de si hay contenido pillar, clusters temáticos, o solo posts sueltos. Revisión cruzada con el Plan CMS_INTEGRATION_PLAN.md podría aclarar.
- **Fix:** Conversación con equipo de contenido — fuera del alcance puramente técnico del audit. Asegurar que cada servicio tenga blog posts asociados (internal linking Service ↔ Article) y que exista un glosario o knowledge base si aplica al ICP.
- **Priority:** 3

---

## 5. Plan de acción priorizado

### Fase 1 — Bloqueadores de indexación (empezar aquí, día 1)

Sin estos fixes, el sitio no puede ser crawleado correctamente. Todos son trabajo de 1-2 horas máximo cada uno.

1. **[TÉC-07]** Añadir `NEXT_PUBLIC_SITE_URL` a `.env` y `.env.example`.
2. **[TÉC-06]** Añadir `metadataBase` en `src/app/layout.tsx` usando la variable anterior.
3. **[TÉC-01]** Crear `src/app/robots.ts`.
4. **[TÉC-02]** Crear `src/app/sitemap.ts` incluyendo rutas estáticas y las dinámicas del CMS (servicios + blog posts), reutilizando `fetchStrapi`.
5. **[TÉC-04]** Añadir `export const metadata` con `robots: { index: false, follow: true }` en `src/app/not-found.tsx`.
6. **[TÉC-05]** Borrar `src/app/404/page.tsx` y el directorio `src/app/404/`.
7. **[TÉC-17]** Añadir `export const viewport` en `src/app/layout.tsx`.

**Verificación Fase 1:**
- `npm run build` sin warnings de `metadataBase`.
- `npm run dev` + `curl localhost:3000/robots.txt` y `curl localhost:3000/sitemap.xml` devuelven contenido válido con URLs absolutas.
- Visitar `/ruta-inexistente` e inspeccionar `<head>`: ver `<meta name="robots" content="noindex">`.

### Fase 2 — Metadata y OG completas (semana 1)

8. **[OP-01]** Usar `title.template` en el layout root para formato consistente de títulos.
9. **[TÉC-08]** Añadir `alternates.canonical` en todas las `generateMetadata()`.
10. **[OP-04]** Definir `openGraph` default en layout root (siteName, locale, type, image fallback) y extender por página.
11. **[OP-06]** Crear `src/app/opengraph-image.png` (1200x630) como fallback global.
12. **[OP-05]** Añadir `twitter` metadata default en layout root.
13. **[OP-23]** Añadir `icon.png` y `apple-icon.png` en `src/app/`. Opcional: `manifest.ts`.
14. **[OP-03]** Ampliar descripciones de fallback a 150-160 chars.
15. **[OP-22]** (parcial) Implementar JSON-LD **Organization** en el layout root.

**Verificación Fase 2:**
- Para cada ruta, inspeccionar `<head>` en DevTools: title con template aplicado, description única, canonical absoluta, og:title/og:description/og:image/og:url, twitter:card, link rel=icon.
- Pasar una URL de producción por [opengraph.xyz](https://www.opengraph.xyz) y ver preview correcto en Facebook/LinkedIn/Twitter.
- Pasar el HTML del home por [Google Rich Results Test](https://search.google.com/test/rich-results) — debe detectar Organization.

### Fase 3 — HTML semántico y jerarquía (semana 1-2)

16. **[OP-07]** Cambiar `<h3>` a `<h2>` en `BlogCards.tsx:146` (o añadir h2 de sección).
17. **[OP-08]** Corregir jerarquía en `BlogPostContent.tsx:188` (H3 → H2).
18. **[OP-09]** Resolver el split del H1 en `HeroSection.tsx` de About Us (mover dentro del `<h1>` como `<span>`).
19. **[OP-16]** Reemplazar `<a>` por `<Link>` en `BlogCards.tsx:129` y corregir fallback de slug.
20. **[OP-20]** Envolver home y about-us en `<main>`.
21. **[OP-19]** Cambiar fechas de blog a `<time dateTime={...}>`.

**Verificación Fase 3:**
- Usar DevTools Accessibility panel para revisar outline de headings de cada página — debe ser lineal sin skips.
- Lighthouse Accessibility score debe subir si estaba deprimido.
- Navegar blog cards — debe hacer transición client-side (sin full reload) y el prefetch debe funcionar.

### Fase 4 — Performance y Core Web Vitals (semana 2-3)

22. **[TÉC-11]** Migrar Google Fonts (Manrope) de `@import` a `next/font/google`. Opcional: también Results Letter a `next/font/local`.
23. **[TÉC-10]** Convertir `servicespageslisting-hero-section-listing-hero.png` a WebP/AVIF y servir con `<Image priority>`.
24. **[TÉC-13]** Reemplazar los 49 `<img>` raw por `<Image>` de `next/image`, priorizando above-the-fold primero.
25. **[TÉC-12]** Convertir las 20 imágenes restantes > 500 KB a WebP/AVIF (o confiar en `<Image>` para que lo haga on-demand — elegir estrategia según contenidos).
26. **[TÉC-14]** Eliminar `ScrollReveal` o usar render inmediato en los elementos hero above-the-fold.
27. **[TÉC-15]** Auditoría de uso de MUI vs shadcn/ui. Eliminar la librería menos usada. Eliminar una de las dos librerías de carrusel (`react-slick` vs `embla-carousel-react`). Eliminar componentes de `src/app/components/ui/` no usados en producción.

**Verificación Fase 4:**
- Lighthouse Performance en mobile: LCP < 2.5s, CLS < 0.1, INP < 200ms.
- `npm run build` — verificar que el bundle size total baja significativamente. Comparar `.next/analyze` antes/después con `@next/bundle-analyzer`.
- Search Console (semanas después) — Core Web Vitals report debe pasar thresholds.

### Fase 5 — Structured data y hardening (semana 3-4)

28. **[OP-22]** Implementar JSON-LD completo: BreadcrumbList en todas las páginas no-home, Article en blog posts, Service en service detail pages, FAQPage donde aplique.
29. **[CNT-01]** Añadir Person schema para miembros del equipo públicos.
30. **[TÉC-19]** Configurar `headers()` en `next.config.ts` con HSTS, nosniff, X-Frame-Options, Referrer-Policy. `poweredByHeader: false`. CSP en modo report-only inicialmente.
31. **[OP-18]** Envolver contacto del Footer en `<address>`.
32. **[TÉC-09]** Declarar `trailingSlash: false` explícito en `next.config.ts`.
33. **[OP-02], [OP-12], [CNT-03]** Coordinación con equipo de contenido/CMS para poblar campos `seo.metaTitle` y `seo.metaDescription` en todos los Single Types de Strapi, más contenido legal completo.

**Verificación Fase 5:**
- Pasar cada página por Google Rich Results Test — debe detectar todos los schemas esperados.
- securityheaders.com: score mínimo B (ideal A).
- Crawl completo con Screaming Frog o similar — detectar cualquier 404, canonical mal referenciado, o heading duplicado residual.

---

## Anexo A — Archivos clave referenciados

**Layouts y metadata global:**
- `src/app/layout.tsx` — metadata root, viewport, lang
- `src/app/not-found.tsx`, `src/app/404/page.tsx` — 404s

**Páginas con `generateMetadata`:**
- `src/app/page.tsx:9-25`
- `src/app/about-us/page.tsx:33-46`
- `src/app/services/page.tsx:12-25`
- `src/app/services/[slug]/page.tsx:28-44` (única con OG image)
- `src/app/blog/page.tsx:27-40`
- `src/app/blog/[slug]/page.tsx:34-49`
- `src/app/lead-magnet/page.tsx:30-43`
- `src/app/privacy-policy/page.tsx:22-27`
- `src/app/terms-and-conditions/page.tsx:22-27`
- `src/app/cookie-policy/page.tsx:22-27`

**HTML semántico y jerarquía:**
- `src/app/home-client.tsx` (falta `<main>`)
- `src/page-sections/AboutUs/sections/HeroSection/HeroSection.tsx:95,98`
- `src/page-sections/BlogListing/sections/BlogCards/BlogCards.tsx:129,146`
- `src/page-sections/BlogPostPage/sections/BlogPostContent/BlogPostContent.tsx:188`

**Performance:**
- `next.config.ts` (images config + falta headers)
- `src/styles/fonts.css:2` (Google Fonts `@import`)
- `src/app/components/hero-section.tsx:94-134` (motion above-the-fold)
- `src/assets/images/servicespageslisting-hero-section-listing-hero.png` (2.39 MB)
- `package.json` (MUI + shadcn, slick + embla)

**Configuración:**
- `.env` (falta `NEXT_PUBLIC_SITE_URL`)
- `src/app/favicon.ico` (único icon presente)

**Utilidades reutilizables:**
- `fetchStrapi()` — en todas las `generateMetadata`; usarla también en `sitemap.ts`.
- `getStrapiImageUrl()` — `src/app/services/[slug]/page.tsx:41`; reutilizarla para OG images por página.
- `generateStaticParams()` — patrón en `services/[slug]` y `blog/[slug]`; paralelo al que necesita `sitemap.ts`.

---

## Anexo B — Estimación de impacto agregado

| Fase | Issues | Esfuerzo estimado | Impacto esperado |
|------|--------|-------------------|------------------|
| 1 — Bloqueadores | 7 | 1 día | Sitio pasa de "no indexable" a "indexable". Google empieza a crawlear. |
| 2 — Metadata/OG | 8 | 2-3 días | SERP snippets correctos, previews sociales funcionan, +CTR orgánico esperado. |
| 3 — Semántica/HTML | 6 | 1-2 días | Accessibility score sube, heading outline limpio, navegación blog funciona bien. |
| 4 — Performance | 6 | 3-5 días | LCP de probablemente > 4s a < 2.5s. Bundle JS potencialmente -30-40%. |
| 5 — Schema/Hardening | 6 | 2-3 días | Rich results elegibles (Article, Breadcrumbs, Organization). Security grade A/B. |

**Total:** ~2 semanas de trabajo enfocado para pasar el sitio de un estado SEO básico a uno production-ready según los estándares de la skill.

---

## Anexo C — Issues fuera del alcance de esta auditoría

Estos temas fueron identificados pero requieren decisiones de producto, contenido o acceso a herramientas externas:

- **Keyword research y análisis competitivo** — requiere Ahrefs/Semrush.
- **Medición real de Core Web Vitals** — requiere PageSpeed Insights en producción o Search Console.
- **Auditoría de backlinks (authority)** — requiere Ahrefs/Moz.
- **Análisis de contenido E-E-A-T profundo** — requiere revisión editorial manual.
- **Internacionalización** (OP-24) — depende de roadmap de producto.
- **Decisión MUI vs shadcn/ui** (TÉC-15) — decisión técnica que afecta más allá de SEO (design system).
- **Configuración de Analytics** — detectada ausencia de GA/GTM; es decisión de privacidad + tracking.
