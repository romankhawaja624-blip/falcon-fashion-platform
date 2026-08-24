---
name: Falcon Global Atelier
colors:
  surface: '#151311'
  surface-dim: '#151311'
  surface-bright: '#3b3936'
  surface-container-lowest: '#0f0e0c'
  surface-container-low: '#1d1b19'
  surface-container: '#1e201f'
  surface-container-high: '#2c2a27'
  surface-container-highest: '#373432'
  on-surface: '#e7e1dd'
  on-surface-variant: '#cec5b9'
  inverse-surface: '#e7e1dd'
  inverse-on-surface: '#32302d'
  outline: '#979084'
  outline-variant: '#4b463c'
  surface-tint: '#d6c5a2'
  primary: '#fffdff'
  on-primary: '#392f17'
  primary-container: '#f1dfbb'
  on-primary-container: '#6f6245'
  inverse-primary: '#6a5d41'
  secondary: '#b8c3ff'
  on-secondary: '#002388'
  secondary-container: '#0043eb'
  on-secondary-container: '#c6ceff'
  tertiary: '#fdfefa'
  on-tertiary: '#2e312f'
  tertiary-container: '#e0e1de'
  on-tertiary-container: '#626462'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f3e1bd'
  primary-fixed-dim: '#d6c5a2'
  on-primary-fixed: '#231a05'
  on-primary-fixed-variant: '#51452b'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#b8c3ff'
  on-secondary-fixed: '#001356'
  on-secondary-fixed-variant: '#0035be'
  tertiary-fixed: '#e2e3e0'
  tertiary-fixed-dim: '#c6c7c4'
  on-tertiary-fixed: '#1a1c1b'
  on-tertiary-fixed-variant: '#454745'
  background: '#151311'
  on-background: '#e7e1dd'
  surface-variant: '#373432'
  deep-ink: '#121413'
  outline-muted: '#4b463d'
  privacy-safe: '#a8b5b0'
  legal-neutral: '#8c8e8d'
  error-alert: '#ffb4ab'
typography:
  display-lg:
    fontFamily: Bodoni Moda
    fontSize: 80px
    fontWeight: '300'
    lineHeight: 90px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Bodoni Moda
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 52px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Bodoni Moda
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
  headline-md:
    fontFamily: Bodoni Moda
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  cta:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.15em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  section-gap: 120px
  container-max: 1440px
---

## Brand & Style

The design system embodies "Falcon," an AI-driven fashion experience that merges the prestige of high-end editorial magazines with the surgical precision of modern technology. The personality is **sophisticated, avant-garde, and meticulously tailored**, appealing to a global audience that values both heritage luxury and futuristic innovation.

The aesthetic follows an **Editorial Minimalism** approach. It utilizes high-contrast typography, expansive whitespace, and a monochromatic-leaning palette to create a digital "gallery" feel. The system is designed to be **language-agnostic and culturally versatile**, ensuring that the premium feel remains intact across LTR (Left-to-Right) and RTL (Right-to-Left) scripts through symmetric layout logic and robust global tokens. It evokes a sense of "quiet intelligence"—functional, silent, and premium.

## Colors

The palette is anchored in **Deep Ink** and **Champagne**, creating a high-fashion, high-contrast environment.

- **Primary (Champagne):** The hallmark of the brand. Used for CTAs and focus states. It represents luxury and human touch.
- **Secondary (Intelligent Blue):** Reserved for AI indicators and data-driven highlights.
- **Global Tokens for Privacy & Legal:**
    - `privacy-safe`: A desaturated, soft slate-green. It evokes trust and security without the alarmism of typical blue/green status colors.
    - `legal-neutral`: A mid-range grey used for fine print, terms of service, and cookie notices, ensuring transparency through legibility while remaining unobtrusive.
- **Color Mode:** The system is "Dark First" to highlight photography and generative textures. In RTL contexts, color weights remain identical to maintain visual equilibrium.

## Typography

This design system uses a triple-voice typographic strategy:
1.  **Editorial (Bodoni Moda):** Classic serif for headlines. For RTL languages like Arabic, substitute with a high-contrast Naskh-style serif to preserve the "fashion" feel.
2.  **Functional (Hanken Grotesk):** Modern sans-serif for body. Line heights are set to relative values (e.g., 1.5 - 1.6) to accommodate the taller ascenders/descenders of diverse scripts.
3.  **Technical (JetBrains Mono):** Used for metadata. Monospaced fonts provide a digital anchor.

**Internationalization:** Headlines use tight letter-spacing in English, but for scripts like Arabic or Hebrew, `letter-spacing` should be reset to `normal` as tracking is not applicable. Body text line-height is generous to prevent "collision" in dense scripts.

## Layout & Spacing

The layout is a **Fixed Grid** on desktop, centered in a 1440px container, and **Fluid** on mobile.

**RTL & Logical Properties:**
- Use logical spacing (e.g., `padding-inline-start` instead of `padding-left`) to ensure automatic mirroring for RTL languages.
- **Margins:** Generous margins (64px) are preserved globally to maintain the "luxury" whitespace regardless of reading direction.
- **The 50/50 Split:** In RTL, hero splits are mirrored; the imagery moves to the left and text to the right. 
- **Adaptability:** Spacing tokens are robust to handle translation expansion (e.g., German or French typically requiring 20-30% more horizontal space than English). Components must use `flex-wrap` or `min-width` constraints to prevent breakage.

## Elevation & Depth

Depth is established through **Tonal Layering** and **Atmospheric Blurs** rather than heavy shadows, keeping the interface feeling lightweight and digital.

- **Stacking:** The base layer is `deep-ink`. Successive layers (cards, menus) use `surface-container` tiers.
- **Backdrop Blurs:** Navigation and overlays utilize a `backdrop-blur-md` (approx 16px) with an 80% opaque surface tint to suggest a glass-like lens.
- **Ghost Outlines:** Secondary elements use `outline-muted` (1px) to define boundaries without adding visual weight.
- **Visual Direction:** In RTL, shadows or gradients that imply a light source from the top-left should be mirrored to appear from the top-right to match the natural eye-flow of the user.

## Shapes

The shape language is **Architectural and Precise**.

- **Subtle Radius:** A standard `0.25rem` (4px) radius is applied to interactive elements. This small curve prevents the UI from feeling aggressive while maintaining its structured, "tailored" appearance.
- **Sharp Alignment:** Layout containers and major section breaks remain at `0px` (sharp) to reinforce the editorial grid.
- **Logical Corners:** Corner treatments are applied using logical CSS (e.g., `border-start-start-radius`) to ensure the correct corners are rounded when the interface is mirrored for RTL scripts.

## Components

- **Buttons:** 
  - *Primary:* Solid `primary` fill, dark text.
  - *Secondary:* Ghost style with 1px `outline`.
  - *Icon Placement:* In RTL, icons in buttons must flip to the opposite side of the text (e.g., `margin-inline-end`).
- **Input Fields:** Bottom-border only for a "sketchbook" feel. Placeholders use `label-sm` (Technical Voice). Text alignment must be `start` to respect the language direction.
- **Privacy/Legal Badges:** Use `label-sm` with `privacy-safe` or `legal-neutral` outlines. These should be placed in the footer or account settings, following the document flow.
- **Cards:** Borderless with slight `surface-container` backgrounds. In RTL, image positioning within the card should mirror the layout of the parent container.
- **Navigation:** Top-level links are all-caps with generous tracking. The "Logo" and "Profile/Cart" positions swap in RTL to ensure the brand mark is always at the "start" of the reading line.