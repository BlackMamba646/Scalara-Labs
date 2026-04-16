# Homepage Animations

Documentacion de todas las animaciones implementadas en la Homepage de Scalara Labs.

---

## 1. Sistema de Animaciones Reutilizable

### ScrollReveal & StaggerReveal

**Archivo:** `src/app/components/scroll-reveal.tsx`

Componente wrapper principal para animaciones de entrada por scroll usando Framer Motion (`whileInView`).

| Propiedad | Valor por defecto |
|---|---|
| Duracion | 0.6s |
| Delay | 0s |
| Distancia | 30px |
| Easing | `[0.25, 0.1, 0.25, 1]` (cubic-bezier) |
| Once | true (se ejecuta una sola vez) |
| Viewport threshold | 0.15 |

**Direcciones soportadas:**

| Direccion | Estado inicial | Estado final |
|---|---|---|
| `up` | opacity: 0, y: +30px | opacity: 1, y: 0 |
| `down` | opacity: 0, y: -30px | opacity: 1, y: 0 |
| `left` | opacity: 0, x: +30px | opacity: 1, x: 0 |
| `right` | opacity: 0, x: -30px | opacity: 1, x: 0 |
| `none` | opacity: 0 | opacity: 1 |

**Variante scale:** Agrega scale: 0.9 -> 1.0 al estado inicial/final.

**StaggerReveal:** Version escalonada que calcula delay como `baseDelay + (index * staggerDelay)`. Stagger delay por defecto: 0.1s.

---

## 2. Hero Section

**Archivo:** `src/app/components/hero-section.tsx`

### Trust Badge (Estrellas + Logo Google)
- **Tipo:** ScrollReveal
- **Direccion:** up
- **Delay:** 0.1s
- **Distancia:** 20px
- **Trigger:** Scroll into view

### Heading (h1)
- **Tipo:** ScrollReveal
- **Direccion:** up
- **Delay:** 0.25s
- **Distancia:** 25px
- **Trigger:** Scroll into view

### Boton CTA
- **Animacion de entrada:** ScrollReveal, direccion up, delay 0.4s, distancia 20px
- **Hover:** translateY(0) -> translateY(-1px) via onMouseEnter/onMouseLeave
- **Tailwind hover:** `hover:bg-[#f0f0f0]`, `hover:shadow-lg`, `hover:shadow-white/10`
- **Active:** `active:scale-[0.97]`
- **Transicion:** `transition-all duration-300`

### Seccion About (Info empresa + Tech stack)
- **Tipo:** ScrollReveal
- **Direccion:** up
- **Delay:** 0.2s
- **Distancia:** 20px
- **Trigger:** Scroll into view

---

## 3. Services Section

**Archivo:** `src/app/components/services-section.tsx`

### Heading de seccion
- **Tipo:** ScrollReveal
- **Direccion:** up
- **Distancia:** 25px
- **Trigger:** Scroll into view

### Service Cards - Fila 1 (3 cards)
- **Tipo:** StaggerReveal
- **Direccion:** up
- **Distancia:** 30px
- **Stagger delay:** 0.12s entre cards (delays: 0s, 0.12s, 0.24s)
- **Trigger:** Scroll into view

### Service Cards - Fila 2 (3 cards)
- **Tipo:** StaggerReveal
- **Direccion:** up
- **Distancia:** 30px
- **Base delay:** 0.15s
- **Stagger delay:** 0.12s (delays: 0.15s, 0.27s, 0.39s)
- **Trigger:** Scroll into view

### Service Card Hover
- **Trigger:** onMouseEnter/onMouseLeave
- **Propiedades animadas:**
  - Background del icono: `bg-[#0c1b3b]` -> `bg-[#218af3]`
  - Color del titulo: `text-[#1f2228]` -> `text-[#f6f6f6]`
  - Color de descripcion: `text-[#475166]` -> `text-[rgba(231,231,231,0.8)]`
  - Color de la flecha: `transition-colors duration-300`
  - Color de borde: `transition-colors duration-300`
- **Transicion:** `transition-colors duration-300`

### Boton "View All Services"
- **Entrada:** ScrollReveal, direccion up, distancia 20px, delay 0.3s
- **Hover:** `hover:bg-[#162d5a]`, `hover:-translate-y-[1px]`
- **Active:** `active:scale-[0.97]`
- **Transicion:** `transition-all duration-300`

---

## 4. Why Choose Section

**Archivo:** `src/app/components/why-choose-section.tsx`

### Matrix Rain (Canvas)
- **Tipo:** Animacion continua con Canvas API + requestAnimationFrame
- **Caracteres:** Katakana japones + simbolos (`01アイウエオカキクケコ...`)
- **Font:** monospace, 13px
- **Color:** rgba(33, 138, 243) con opacidades variables (0.9, 0.5, 0.25)
- **Velocidad:** 0.05 + Math.random() * 0.05 por frame
- **Efecto trail:** Overlay semi-transparente `rgba(12, 27, 59, 0.12)`
- **Opacidad del canvas:** 0.6
- **Trigger:** Continua desde el mount del componente
- **Cleanup:** cancelAnimationFrame en unmount

### Heading de seccion
- **Tipo:** ScrollReveal
- **Direccion:** up
- **Distancia:** 25px
- **Trigger:** Scroll into view

### Difference Cards (4 cards)
- **Entrada:** StaggerReveal, direccion up, distancia 30px, stagger 0.1s (delays: 0s, 0.1s, 0.2s, 0.3s)
- **Trigger:** Scroll into view

### Difference Card Hover (Expansion)
- **Trigger:** onMouseEnter/onMouseLeave
- **Titulo:** Siempre `text-[#218af3]`
- **Descripcion - altura:** `gridTemplateRows: "0fr"` -> `"1fr"` (expansion)
- **Descripcion - opacidad:** 0 -> 1
- **Transicion:** `duration-500 ease-in-out`

### Bottom Hero Container
- **Entrada:** ScrollReveal, direccion up, distancia 35px
- **Boton hover:** translateY(0) -> translateY(-1px)
- **Tailwind:** `hover:bg-[#f0f0f0]`, `hover:shadow-lg`, `active:scale-[0.97]`

---

## 5. Consultation Modal

**Archivo:** `src/app/components/consultation-modal.tsx`

### Backdrop
- **Tipo:** CSS keyframe `fadeIn`
- **Clase:** `animate-[fadeIn_0.2s_ease-out]`
- **Propiedades:** opacity 0 -> 1
- **Duracion:** 0.2s

### Contenedor del modal
- **Tipo:** CSS keyframe `slideUp`
- **Clase:** `animate-[slideUp_0.3s_ease-out]`
- **Propiedades:** opacity 0 -> 1, translateY(20px) -> 0, scale(0.97) -> 1
- **Duracion:** 0.3s

### Keyframes definidos
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
```

### Boton de cerrar
- **Hover:** `hover:bg-white/10`, `transition-colors`

### Inputs del formulario (focus)
- **Border:** `border-white/10` -> `focus:border-[#218af3]/50`
- **Background:** `bg-white/5` -> `focus:bg-white/[0.07]`
- **Transicion:** `transition-all`

---

## 6. Header

**Archivos:** `src/components/shared/Header/Header.tsx`, `src/components/shared/Header/Header.css`

### Background en scroll
- **Propiedad:** background-color
- **Normal:** transparent
- **Scrolled:** `rgba(8, 14, 27, 0.95)` + `backdrop-filter: blur(8px)`
- **Duracion:** 0.3s ease

### Links de navegacion hover
- **Propiedad:** opacity 1 -> 0.7
- **Duracion:** 0.2s ease

### Boton CTA hover
- **Propiedad:** opacity 1 -> 0.7
- **Duracion:** 0.2s ease

### Hamburger menu (mobile)
- **Lineas:** transition de background-color, 0.3s ease
- **::before (open):** top -6px -> 0, rotate(45deg)
- **::after (open):** top 6px -> 0, rotate(-45deg)
- **Duracion:** 0.3s ease

### Mobile menu overlay
- **Propiedades:** opacity 0 -> 1, visibility hidden -> visible
- **Duracion:** 0.3s ease
- **Trigger:** Clase `.header__mobile-menu--open`

---

## 7. Team Section

**Archivos:** `src/components/shared/Team/Team.tsx`, `src/components/shared/Team/Team.css`

### Team Card hover (crossfade)
- **Estado activo:** opacity 1 -> 0 (se oculta en hover)
- **Estado hover:** opacity 0 -> 1 (aparece en hover)
- **Duracion:** 0.35s ease

### Carousel scroll
- **Tipo:** `scrollBy` con `behavior: "smooth"`
- **Trigger:** Click en botones prev/next

---

## 8. CTA Section

**Archivos:** `src/components/shared/Cta/Cta.tsx`, `src/components/shared/Cta/Cta.css`

### Boton CTA hover
- **Hover:** `hover:bg-[#f0f0f0]`, `hover:shadow-lg`, `hover:shadow-white/10`
- **Active:** `active:scale-[0.97]`
- **Transicion:** `transition-all duration-300`

---

## 9. Footer

**Archivos:** `src/components/shared/Footer/Footer.tsx`, `src/components/shared/Footer/Footer.css`

### Links hover
- **Normal:** `opacity-60`
- **Hover:** `hover:opacity-100`

---

## Resumen de Librerias Usadas

| Libreria | Uso |
|---|---|
| **Framer Motion** (`motion/react`) | ScrollReveal, StaggerReveal — animaciones whileInView con motion.div/motion.section |
| **Tailwind CSS** | Transiciones (transition-all, transition-colors), hover states, active states, keyframes inline |
| **CSS Keyframes** | fadeIn, slideUp (modal) |
| **Canvas API** | Matrix rain effect (requestAnimationFrame loop) |

## Tabla Resumen

| Componente | Tipo de Animacion | Trigger | Duracion | Easing |
|---|---|---|---|---|
| ScrollReveal | Fade + transform | Scroll (whileInView) | 0.6s | cubic-bezier(0.25, 0.1, 0.25, 1) |
| StaggerReveal | Fade + transform escalonado | Scroll (whileInView) | 0.6s | cubic-bezier(0.25, 0.1, 0.25, 1) |
| Hero CTA Button | Hover lift | Hover | 0.3s | ease |
| Service Cards | Color transition | Hover | 0.3s | ease |
| Matrix Rain | Canvas loop continuo | Mount | Per-frame | N/A |
| Difference Cards | Grid height expansion | Hover | 0.5s | ease-in-out |
| Modal Backdrop | Fade in | Modal open | 0.2s | ease-out |
| Modal Content | Slide up + scale | Modal open | 0.3s | ease-out |
| Header Background | Background + blur | Scroll | 0.3s | ease |
| Hamburger Menu | Rotacion de lineas | Click toggle | 0.3s | ease |
| Team Cards | Opacity crossfade | Hover | 0.35s | ease |
