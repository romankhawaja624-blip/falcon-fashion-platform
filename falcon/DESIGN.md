---
name: Falcon AI-First Fashion
colors:
  surface: '#121413'
  surface-dim: '#121413'
  surface-bright: '#383a38'
  surface-container-lowest: '#0d0f0e'
  surface-container-low: '#1a1c1b'
  surface-container: '#1e201f'
  surface-container-high: '#282a29'
  surface-container-highest: '#333534'
  on-surface: '#e2e3e0'
  on-surface-variant: '#cec5b9'
  inverse-surface: '#e2e3e0'
  inverse-on-surface: '#2f3130'
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
  tertiary: '#fffdff'
  on-tertiary: '#2d2f40'
  tertiary-container: '#dfdff6'
  on-tertiary-container: '#616275'
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
  tertiary-fixed: '#e1e1f8'
  tertiary-fixed-dim: '#c4c5db'
  on-tertiary-fixed: '#181a2b'
  on-tertiary-fixed-variant: '#444558'
  background: '#121413'
  on-background: '#e2e3e0'
  surface-variant: '#333534'
  champagne-light: '#f3e1bd'
  intelligent-blue: '#2e5bff'
  deep-ink: '#0c0f0e'
  outline-muted: '#4b463d'
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
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
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

Falcon represents the intersection of high-end editorial fashion and cutting-edge artificial intelligence. The brand personality is **sophisticated, avant-garde, and precisely tailored**. It evokes the feeling of a digital atelier—quiet, premium, and highly personalized.

The design style is a blend of **Editorial Minimalism** and **Modern Digital Precision**. It utilizes extreme typographic contrast (classic serif vs. technical mono), a restrained "champagne and ink" color palette, and subtle generative motion to suggest intelligence without overwhelming the luxury aesthetic. The layout is spacious, prioritizing large-scale imagery and high-quality whitespace to create a "gallery-like" user experience.

## Colors
The palette is rooted in a deep, "Ink" black background (`#121413`) to allow fashion imagery and the "Champagne" primary color (`#f1dfbb`) to feel luminous. 

- **Primary (Champagne):** Used for key brand accents, call-to-action buttons, and active states. It suggests warmth and luxury.
- **Secondary (Intelligent Blue):** Reserved for subtle data visualizations or AI-specific indicators (found in the generative shader/grid lines).
- **Neutral/Surface:** A range of tiered dark greys and deep blacks provide depth.
- **Text:** High-contrast off-white (`#e2e3e1`) for readability, with muted champagne-tinted greys (`#cec5b9`) for secondary body text to maintain the monochromatic elegance.

## Typography
The typographic system relies on three distinct voices:
1. **The Editorial Voice (Bodoni Moda):** High-contrast serif used for large display headers and branding. It should be used with light weights to maintain an airy, luxury feel.
2. **The Functional Voice (Hanken Grotesk):** A clean, modern sans-serif for body copy and navigational elements. It provides a contemporary balance to the classic serif.
3. **The Technical Voice (JetBrains Mono):** A monospaced font used for small labels, badges, and technical "AI" metadata, emphasizing the "tailored by technology" aspect.

All CTA and Label styles utilize wide letter-spacing and uppercase transformations to reinforce the clean, structured aesthetic.

## Layout & Spacing
The layout uses a **Fixed Grid** model for desktop, centered within a `1440px` max-width container, while transitioning to a fluid model for mobile.

- **Rhythm:** A 4px base unit controls all micro-spacing.
- **Margins:** Generous side margins (64px on desktop) ensure content feels isolated and premium.
- **Sectioning:** Large vertical gaps (120px) separate major content blocks to prevent visual clutter.
- **Split-Screen:** Primary landing areas often utilize a 50/50 split between text and immersive visual content (shaders or high-fashion photography).

## Elevation & Depth
Depth is created through **Tonal Layering** and **Atmospheric Effects** rather than traditional shadows.

- **Surfaces:** `surface-dim` is the base layer. Interactive containers use `surface-container-low` to `highest` to create a stacked effect.
- **Backdrop Blurs:** Navigation bars use an 80% opacity background with a medium blur (`backdrop-blur-md`) to feel like a floating lens over the content.
- **Ghost Outlines:** Secondary buttons and badges use low-opacity champagne or grey borders (`border-outline`) instead of fills, maintaining the "light" feel of the interface.
- **Motion as Depth:** Generative shaders in the background use movement to imply a layer existing "behind" the UI.

## Shapes
The shape language is **Structured and Crisp**. 

- **Primary Corner Radius:** A subtle `0.25rem` (4px) radius is the default for buttons, inputs, and badges. This provides just enough softness to feel modern without losing the architectural precision of the design.
- **Sharp Intersections:** The intersection of major layout zones (like the split-screen hero) should remain perfectly sharp (0px).
- **Interactive States:** Buttons may transition to a slightly more rounded or "filled" state on hover, but should generally maintain their rectangular character.

## Components
- **Buttons:** 
  - *Primary:* Solid champagne fill with dark text. 
  - *Secondary:* Ghost style with 1px outline and high-tracking uppercase text. 
  - *Transition:* Smooth 300ms color fades on hover.
- **Badges:** Small `label-sm` text wrapped in a 1px border with the primary color, used for feature tags like "AI-FIRST FASHION".
- **Navigation:** Minimalist text links in uppercase with a `text-on-surface/70` color, shifting to full opacity or primary color on hover.
- **Inputs:** Clean, bottom-border or 1px outlined fields with `JetBrains Mono` placeholder text to emphasize the technical nature of the AI platform.
- **Cards:** Borderless or very thin-bordered containers that use slight background color shifts (`surface-container`) to define their boundaries.