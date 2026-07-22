---
name: PetSaathi Design System
colors:
  surface: '#fff8f3'
  surface-dim: '#e2d9cf'
  surface-bright: '#fff8f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fcf2e8'
  surface-container: '#f6ece3'
  surface-container-high: '#f0e7dd'
  surface-container-highest: '#eae1d8'
  on-surface: '#1f1b15'
  on-surface-variant: '#444748'
  inverse-surface: '#343029'
  inverse-on-surface: '#f9efe6'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5f5e5b'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2dd'
  on-secondary-container: '#656461'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#360f00'
  on-tertiary-container: '#c56c43'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e5e2dd'
  secondary-fixed-dim: '#c9c6c2'
  on-secondary-fixed: '#1c1c19'
  on-secondary-fixed-variant: '#474743'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb597'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#78310c'
  background: '#fff8f3'
  on-background: '#1f1b15'
  surface-variant: '#eae1d8'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base-unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  section-gap: 120px
---

## Brand & Style
The brand personality is "Quiet Luxury for the Modern Caretaker." It targets high-net-worth pet parents in India who view their pets as family and expect a digital experience that mirrors a concierge service. The UI must evoke a sense of calm, reliability, and emotional resonance.

The design style is a hybrid of **High-End Editorial** and **Glassmorphism**. It utilizes expansive white space (Minimalism) to provide breathing room for high-quality animal photography, while layering information on semi-transparent, frosted surfaces to create depth. The aesthetic is tactile yet digital-first, moving away from flat utility toward an immersive, premium environment.

## Colors
The palette is "Luxury Organic," drawing inspiration from natural materials and high-end interiors.
- **Deep Charcoal (#1A1A1A):** Used for primary typography and core structural elements. It provides a grounded, authoritative feel superior to pure black.
- **Warm Sand (#F5F2ED):** The primary background color. It is softer on the eyes than white, providing an immediate sense of warmth and "Airbnb-style" hospitality.
- **Soft Terracotta (#D97B51):** The accent color, used sparingly for primary actions and emotional highlights. It reflects Indian heritage in a modern, sophisticated way.
- **Muted Stone (#8C857D):** Used for secondary text and decorative borders to maintain a low-contrast, premium look.

## Typography
The typography strategy relies on a dramatic contrast between the authoritative **Playfair Display** and the functional **Inter**. 

Headlines use serif to establish an editorial feel, reminiscent of a luxury magazine. For larger displays, negative letter-spacing is applied to create a tighter, more "designed" appearance. Body text is set in Inter with generous line-height to ensure maximum readability and a clean, "Apple-esque" utility. Labels and metadata should use uppercase with increased tracking to differentiate functional UI from narrative content.

## Layout & Spacing
The system uses a **Fluid-Fixed Hybrid Grid**. Content is housed in a 12-column grid with a maximum width of 1280px to prevent excessive line lengths on ultra-wide monitors. 

Spacing is intentionally oversized to create an "Awwwards" editorial flow. Section gaps are significantly larger than standard SaaS layouts to force a slower, more deliberate scrolling experience. On mobile, the grid collapses to 4 columns with 20px margins, maintaining the "warm sand" gutters to separate content blocks visually.

## Elevation & Depth
Depth is communicated through **Glassmorphism** and **Ambient Shadows**.
- **The Glass Layer:** Floating modals and navigation bars use a background blur (32px) with a semi-transparent Deep Charcoal or white fill (10-20% opacity). A 1px white inner border (0.1 opacity) creates a "glass edge" effect.
- **Realistic Shadows:** Objects do not use standard drop shadows. Instead, use a dual-shadow approach: one tight, low-opacity shadow for definition, and one very large, highly diffused shadow (e.g., 60px blur) to simulate natural light hitting a physical card.
- **Parallax Layers:** Background decorative elements or large animal photography should move at a 0.9x scroll speed relative to the foreground cards to enhance the "immersive" feeling.

## Shapes
The design system adopts a **Rounded** profile. This softens the technical edges of the app, making the experience feel more approachable and "human," which is critical for a pet-focused platform. Secondary buttons and search bars may occasionally use "Pill-shaped" (Level 3) rounding to suggest a friendly, interactive touchpoint.

## Components
- **Buttons:** Primary buttons use a solid Deep Charcoal fill with white Inter (Bold) text. No borders. Secondary buttons are "ghost" style with a 1px Stone border.
- **Floating Cards:** The centerpiece of the UI. These feature white or Glassmorphic backgrounds, Level 2 rounded corners, and ambient shadows. They should never have hard borders.
- **Input Fields:** Minimalist design with only a bottom border in Muted Stone. Upon focus, the label floats upward and the border darkens to Deep Charcoal.
- **Pet Profiles:** Use circular imagery for animals to contrast with the rectangular card layouts. 
- **Chips/Badges:** Small, Soft Terracotta fills with low opacity (10%) and solid Terracotta text for status indicators (e.g., "Vaccinated," "Luxury Suite").
- **Navigation:** A floating, glassmorphic bottom bar for mobile, and a transparent-to-solid transition top bar for desktop.