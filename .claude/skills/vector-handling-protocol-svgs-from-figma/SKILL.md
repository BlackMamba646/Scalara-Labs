---
name: vector-handling-protocol-svgs-from-figma
description: Handles the import and usage of SVG assets exported from Figma.
metadata:
  mcp-server: figma
---

# Vector Handling Protocol (SVGs) from Figma

## The Problem

The Figma MCP server exports every SVG with two attributes that cause visual distortion:

```xml
<svg preserveAspectRatio="none" width="100%" height="100%" viewBox="0 0 6 11" ...>
```

- `width="100%" height="100%"` makes the SVG fill whatever container it's placed in.
- `preserveAspectRatio="none"` tells the browser to **stretch** the vector content to fill that container, ignoring the original aspect ratio.

When the SVG's viewBox aspect ratio differs from the container's aspect ratio, the icon gets visually distorted:

| viewBox | Container | Result |
|---------|-----------|--------|
| 6×11 (narrow chevron) | 16×16 | Chevron stretches ~2.7× horizontally, looks thick and heavy |
| 9.6×5.25 (wide caret) | 14×14 | Caret stretches ~2.7× vertically, looks like a thick "V" |
| 11.25×11.25 (square arrow) | 20×20 | Arrow scales up 1.78×, strokes appear thicker than designed |

**This affects every SVG icon exported from the Figma MCP server.** Symptoms include:
- Thin-stroke chevrons appearing as thick, heavy arrows
- Subtle dropdown carets looking like bold "V" shapes
- Small icons appearing oversized relative to surrounding text
- Icons looking visually "off" compared to the expected Figma dimensions

## The Fix: Expand the viewBox

The solution is to expand the SVG's `viewBox` to match the container size, centering the original vector content with whitespace padding. This preserves every original vector path while framing the icon correctly within its intended space.

### Step 1: Identify the Figma layout positioning

In the Figma MCP output, each icon is placed inside a container with absolute positioning using percentage insets. Find the relevant code block:

```jsx
{/* Example: a caret-left icon inside a 16×16 container */}
<div className="size-[16px]" data-name="ARROWS/caret-left">
  <div className="absolute inset-[15.62%_34.37%_15.62%_28.12%]">
    <img src={imgVector} />
  </div>
</div>
```

Extract these values:
- **Container size**: `16×16` (from `size-[16px]`)
- **Insets**: `top=15.62%, right=34.37%, bottom=15.62%, left=28.12%`

### Step 2: Calculate the viewBox origin offset

Convert the **left** and **top** inset percentages into pixel offsets based on the container size:

```
x_offset = -(left% × container_width)
y_offset = -(top% × container_height)
```

Example for caret-left in a 16×16 container:
```
x_offset = -(0.2812 × 16) = -4.5
y_offset = -(0.1562 × 16) = -2.5
```

### Step 3: Rewrite the SVG attributes

Replace the original SVG opening tag:

```xml
<!-- BEFORE: causes stretching -->
<svg preserveAspectRatio="none" width="100%" height="100%"
     viewBox="0 0 6.00067 11.0006" ...>
```

With the expanded viewBox and fixed dimensions:

```xml
<!-- AFTER: correctly framed -->
<svg width="16" height="16"
     viewBox="-4.5 -2.5 16 16" ...>
```

**Rules for the new attributes:**
- `width` / `height` = the container dimensions (in pixels, not percentages)
- `viewBox` = `"x_offset y_offset container_width container_height"`
- **Remove** `preserveAspectRatio="none"` entirely (the default `xMidYMid meet` is correct)
- **Keep** all other attributes (`fill`, `xmlns`, `overflow`, `style`)
- **Do not change** any `<path>`, `<circle>`, `<rect>`, or other vector elements inside the SVG

### Step 4: Verify the CSS container matches

Make sure the CSS for the icon's `<img>` element sets dimensions that match the new SVG `width`/`height`:

```css
/* The img container should match the SVG's width/height */
.icon-container img {
  width: 16px;   /* matches SVG width="16" */
  height: 16px;  /* matches SVG height="16" */
}
```

No `object-fit` adjustments are needed — the expanded viewBox handles correct sizing internally.

## Quick Reference Table

Common Figma icon sizes and their viewBox calculations:

| Icon type | Typical viewBox | Container | Figma insets (T/R/B/L) | New viewBox |
|-----------|----------------|-----------|------------------------|-------------|
| Caret left | 6×11 | 16×16 | 15.62% / 34.37% / 15.62% / 28.12% | `-4.5 -2.5 16 16` |
| Caret right | 6×11 | 16×16 | 15.62% / 28.12% / 15.62% / 34.37% | `-5.5 -2.5 16 16` |
| Caret down | 9.6×5.25 | 14×14 | 34.37% / 15.62% / 28.12% / 15.62% | `-2.187 -4.812 14 14` |
| Arrow up-right | 11.25×11.25 | 20×20 | 21.88% / 21.87% / 21.87% / 21.87% | `-4.375 -4.375 20 20` |
| Envelope | 16.25×12.5 | 20×20 | 18.75% / 9.38% / 18.75% / 9.38% | `-1.876 -3.75 20 20` |
| Phone | 15.6×15.6 | 20×20 | 9.38% / 9.38% / 12.5% / 12.5% | `-2.5 -1.876 20 20` |

## When to Apply This Fix

**IMPORTANT:** Apply this fix to **every** SVG icon downloaded from the Figma MCP server **before** using it in a component. This is not an edge case — it affects all exported SVGs because the Figma MCP server always adds `preserveAspectRatio="none"` and `width="100%" height="100%"`.

**Checklist for each SVG:**
1. Open the SVG file
2. Check if it has `preserveAspectRatio="none"` — if yes, it needs fixing
3. Find the icon's container size and inset positioning in the Figma MCP output
4. Calculate the expanded viewBox using the formula above
5. Rewrite the SVG attributes
6. Verify the dimensions match the expected values from the Figma design context

## NEVER Substitute Figma Icons with Third-Party Libraries

**Every icon must come from Figma. No exceptions.**

Do not replace Figma-designed icons with third-party icon libraries such as `lucide-react`, `heroicons`, `react-icons`, `@phosphor-icons`, or any other package — even when the icon appears "generic" (chevrons, arrows, user, mail, phone, search, cart, close, menu, etc.).

**Why this matters:**
- The designer chose specific icon designs with intentional stroke widths, proportions, fill styles, and visual weight
- Third-party icons have a completely different visual language — different stroke widths, shapes, corner radii, and proportions
- Substituting icons breaks 1:1 visual fidelity with the Figma design, which is the primary goal
- Even icons that seem identical (e.g., a "chevron") differ in subtle but visible ways: thickness, angle, cap style

**What to do instead:**
1. Use `get_metadata` to find the icon's node ID in the Figma tree
2. Use `get_design_context` on that node to get the SVG source from the Figma MCP server
3. Download the SVG to `src/imports/` with a prefixed filename
4. Apply the viewBox expansion fix (see above)
5. Import as `<img src={icon.src} alt="" />` in the component

**If the Figma MCP server does not return an SVG for an icon:**
1. Try fetching the parent frame/instance node instead
2. If the icon is composed of multiple vector nodes, fetch each and combine
3. Only as a last resort — and with a documented note — use a library icon, but flag it for manual review

## What NOT to Do

- **Do not** substitute Figma icons with third-party icon libraries — download every icon from Figma
- **Do not** use `object-fit: contain` on the `<img>` — it does not override the SVG's internal `preserveAspectRatio="none"`
- **Do not** change any vector path data (`<path d="...">`) — only the `<svg>` root attributes need updating
- **Do not** add CSS transforms or scaling to work around the issue — fix the SVG at the source
- **Do not** set the `<img>` to the viewBox dimensions (e.g., 6×11) — this makes the icon too small and breaks the button/container layout
