---
name: PetSaathi Luxury Narrative
colors:
  surface: '#fcf9f4'
  surface-dim: '#dcdad5'
  surface-bright: '#fcf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ee'
  surface-container: '#f0ede9'
  surface-container-high: '#ebe8e3'
  surface-container-highest: '#e5e2dd'
  on-surface: '#1c1c19'
  on-surface-variant: '#4f453f'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f3f0eb'
  outline: '#81746f'
  outline-variant: '#d3c3bc'
  surface-tint: '#73594b'
  primary: '#321f14'
  on-primary: '#ffffff'
  primary-container: '#4a3428'
  on-primary-container: '#bb9c8c'
  inverse-primary: '#e1c0af'
  secondary: '#994700'
  on-secondary: '#ffffff'
  secondary-container: '#fb7800'
  on-secondary-container: '#592600'
  tertiary: '#001e5b'
  on-tertiary: '#ffffff'
  tertiary-container: '#003189'
  on-tertiary-container: '#7e9eff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#e1c0af'
  on-primary-fixed: '#29170d'
  on-primary-fixed-variant: '#594235'
  secondary-fixed: '#ffdbc8'
  secondary-fixed-dim: '#ffb68b'
  on-secondary-fixed: '#321200'
  on-secondary-fixed-variant: '#753400'
  tertiary-fixed: '#dbe1ff'
  tertiary-fixed-dim: '#b4c5ff'
  on-tertiary-fixed: '#00174b'
  on-tertiary-fixed-variant: '#003ea8'
  background: '#fcf9f4'
  on-background: '#1c1c19'
  surface-variant: '#e5e2dd'
typography:
  display-lg:
    fontFamily: Fraunces
    fontSize: 84px
    fontWeight: '700'
    lineHeight: 92px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Fraunces
    fontSize: 64px
    fontWeight: '600'
    lineHeight: 72px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Fraunces
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
  headline-lg-mobile:
    fontFamily: Fraunces
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Fraunces
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 32px
  margin-desktop: 80px
  margin-tablet: 40px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  stack-xl: 64px
---

## Brand & Style

The design system is engineered to elevate pet care from a utility to a high-end lifestyle experience. It targets a discerning audience that values heritage, quality, and emotional storytelling. The UI is designed to evoke a sense of "Immersive Cinematic Editorial"—combining the prestige of a luxury fashion magazine with the fluid, interactive nature of modern high-performance web experiences.

The design style is a sophisticated blend of **Glassmorphism** and **Minimalist Editorial**. It utilizes deep layered depth, bento-grid structures, and "floating" UI elements to create a sense of weightlessness. High-quality animal photography should be treated as hero art, with UI elements acting as elegant overlays rather than containers.

## Colors

The palette is anchored in organic, earthy tones to reflect warmth and premium quality. 
- **Primary (#4A3428):** Used for sophisticated branding, primary navigation, and high-level headings.
- **CTA (#FF7A00):** A vibrant, high-energy orange reserved exclusively for primary actions to ensure high conversion and visual pop.
- **Background (#FAF7F2):** A warm cream that reduces eye strain and provides a much softer, more luxurious feel than pure white.
- **Surface (#FFFDFB):** A subtle lift from the background used for cards and floating containers.
- **Glass/Overlay:** Use semi-transparent white (Alpha 40-70%) with a 20px-40px backdrop blur for glassmorphic effects.

## Typography

This design system uses a high-contrast typographic pairing to balance tradition and modernity. **Fraunces** provides a variable serif with soft, organic curves that feel editorial and authoritative. It should be used for large titles and storytelling hooks. **Manrope** provides a clean, geometric sans-serif counterpoint for body copy and UI labels, ensuring maximum readability and a technical, precise feel for functional data.

## Layout & Spacing

The layout philosophy follows a **Bento Grid** model—organizing content into modular, rounded rectangles of varying sizes. This creates a rhythmic, organized look even with complex data. 

- **Desktop:** 12-column grid with generous 80px side margins to emphasize luxury through whitespace.
- **Mobile:** Single column with 20px margins.
- **Rhythm:** Use a strict 8px base grid for all internal padding and component spacing. Elements should feel airy; when in doubt, increase the `stack-xl` padding to allow the content to breathe.

## Elevation & Depth

Depth is the cornerstone of this design system. It uses a three-tier elevation model:
1. **Base Layer:** The Warm Cream background (#FAF7F2), acting as the canvas.
2. **Mid Layer:** Floating Bento cards with soft, realistic shadows. Shadows should be long and diffused: `offset-y: 20px, blur: 40px, color: rgba(74, 52, 40, 0.08)`.
3. **Top Layer:** Glassmorphic overlays and modals. These use `backdrop-filter: blur(24px)` and a 1px solid border with 20% white opacity to define the edges against the background.

Use "Squishy" depth for interactions: when a card is hovered, it should subtly lift (shadow deepens) and scale up by 1-2%.

## Shapes

The shape language is organic and approachable. Standard UI components use **0.5rem (8px)** corner radii, while larger layout containers and Bento cards use **1.5rem (24px)** to create a soft, friendly frame for content. 

Buttons and interactive chips should utilize a **Pill-shape (full rounding)** to contrast against the structured grid of the cards.

## Components

### Premium Cards
Bento-style cards are the primary container. They feature a #FFFDFB background, 24px corner radius, and a subtle 1px border (#4A3428 at 5% opacity). For high-impact areas, use frosted glass backgrounds with high-contrast text.

### Buttons
- **Primary:** Pill-shaped, #FF7A00 background, white text, bold weight. Includes a subtle glow shadow of the same color.
- **Secondary:** Pill-shaped, transparent with a 1.5px #4A3428 border.
- **Tertiary:** Text-only with a Manrope Bold label and a small 8px animated arrow icon.

### Input Fields
Inputs are minimal: a single bottom border or a very light tinted fill (#4A3428 at 3% opacity). On focus, the label should float upward using Fraunces Medium, and the border color shifts to the Primary Brown.

### Elegant Iconography
Use thin-stroke (1.5pt) linear icons. Icons should be oversized in hero sections and strictly functional in lists. Use the Primary Brown for icons on light backgrounds, and White for glassmorphic overlays.

### Chips & Tags
Small, pill-shaped elements with #4A3428 at 5% fill and Primary Brown text. Used for pet categories, health statuses, or architectural labels.