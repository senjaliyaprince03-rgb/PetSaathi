---
name: Ethereal Paws
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#4b4451'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#7c7482'
  outline-variant: '#cdc3d3'
  surface-tint: '#7448ab'
  primary: '#3c0372'
  on-primary: '#ffffff'
  primary-container: '#532589'
  on-primary-container: '#c495ff'
  inverse-primary: '#d9b9ff'
  secondary: '#a73a00'
  on-secondary: '#ffffff'
  secondary-container: '#fd651e'
  on-secondary-container: '#571a00'
  tertiary: '#00302b'
  on-tertiary: '#ffffff'
  tertiary-container: '#004842'
  on-tertiary-container: '#4cbcaf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eedbff'
  primary-fixed-dim: '#d9b9ff'
  on-primary-fixed: '#2a0054'
  on-primary-fixed-variant: '#5b2e91'
  secondary-fixed: '#ffdbce'
  secondary-fixed-dim: '#ffb599'
  on-secondary-fixed: '#370e00'
  on-secondary-fixed-variant: '#7f2b00'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
  surface-glass: rgba(255, 255, 255, 0.7)
  glass-border: rgba(255, 255, 255, 0.4)
  violet-soft: '#F3E8FF'
  orange-soft: '#FFEDD5'
typography:
  display-hero:
    fontFamily: Clash Display
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 80px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Clash Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Clash Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Clash Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Clash Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  label-bold:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
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
  margin-mobile: 20px
  stack-xl: 120px
  stack-lg: 64px
  stack-md: 32px
  stack-sm: 16px
  stack-xs: 8px
---

## Brand & Style

The design system is engineered to position the product as a premier destination for high-end luxury pet care. It centers on a **Light & Airy Glassmorphism** aesthetic, evoking the feeling of a premium digital sanctuary. The goal is to create an emotional response of absolute serenity, trust, and sophisticated delight.

The style is characterized by:
- **Ultra-Bright Surfaces:** A pure white foundation that maximizes light and breathability.
- **Glassmorphism:** Translucent layers with delicate backdrop blurs to suggest depth without weight.
- **Organic Flow:** A balance between structured grids and soft, rounded elements that feel approachable yet elite.
- **Selective Vibrancy:** A restrained use of high-chroma accents against a neutral, high-key backdrop.

## Colors

The color strategy uses a **Deep Violet** primary to establish institutional trust and authority in the pet care space. **Warm Orange** is utilized sparingly as a delight-inducing secondary color, specifically for calls-to-action and rewarding interactions. 

The background is strictly **Pure White (#FFFFFF)**. Functional colors (tertiary and neutrals) are kept at low saturation to ensure the brand colors remain the focal points. Glassmorphic effects utilize semi-transparent white overlays to create the "frosted" look, maintaining a light-filled environment even when layering multiple UI elements.

## Typography

The typography pairings contrast the high-fashion editorial feel of **Clash Display** with the modern, friendly legibility of **Plus Jakarta Sans**. 

- **Headlines:** Use Clash Display for all high-level headings. It should feel authoritative and expensive. Tight letter-spacing on larger sizes is preferred to maintain a "logo-like" quality in headlines.
- **Body & UI:** Plus Jakarta Sans provides a warm, approachable character for long-form text and interface labels. 
- **Scale:** On mobile, large display type should scale aggressively to avoid excessive word-wrapping, while body sizes remain constant to ensure accessibility.

## Layout & Spacing

This design system utilizes a **Fluid Grid** with generous white space to reinforce the "Airy" aesthetic. 

- **Desktop:** A 12-column grid with 32px gutters. Large 80px margins create a "frame" for the content, making the UI feel like a curated gallery.
- **Mobile:** A 4-column grid with 20px margins.
- **Vertical Rhythm:** We use a "stack" philosophy. Components are separated by significant vertical gaps (64px+) to prevent the layout from feeling cluttered. Content groups should be clearly delineated by whitespace rather than heavy lines.

## Elevation & Depth

Depth is communicated through **Ambient Shadows** and **Tonal Glassmorphism**. Unlike standard material designs, shadows here are extremely diffused and low-opacity (2-8%), often tinted with a hint of the Primary Violet to keep them from looking "dirty" on the pure white background.

**Layering Rules:**
1. **Base:** Pure #FFFFFF.
2. **Surface Level 1 (Glass):** 70% opacity white with a 20px - 40px backdrop blur. Used for cards and navigation bars.
3. **Elevated (Floating):** Soft shadows (Offset: 0, 10px; Blur: 30px; Color: rgba(83, 37, 137, 0.05)) used for primary buttons and active modals.
4. **Outlines:** Instead of solid borders, use a 1px "glass border" (White at 40% opacity) to define edges of glassmorphic elements.

## Shapes

The shape language is **Rounded (Level 2)**. This specific degree of curvature strikes a balance between professional precision and pet-friendly softness.

- **Standard Elements:** 0.5rem (8px) radius for input fields and small buttons.
- **Containers/Cards:** 1rem (16px) radius for primary glass cards.
- **Display Elements:** 1.5rem (24px) for featured hero images or promotional banners.
- **Interactive States:** Use a slightly higher roundedness for focus states to make the UI feel "plush."

## Components

- **Buttons:** Primary buttons use the Deep Violet with white text. Secondary buttons are "Glass" buttons with a violet outline. For "Delight" moments (e.g., booking confirmation), use the Warm Orange. All buttons have a subtle 4px vertical lift on hover.
- **Glass Cards:** The signature component. White background at 70% opacity, 24px backdrop blur, and a 1px soft-white border. No heavy shadows; use a very faint violet-tinted glow instead.
- **Input Fields:** Minimalist design with a 1px light gray border that transitions to a Deep Violet border with a soft violet outer glow on focus.
- **Chips & Tags:** Use the "Violet-Soft" and "Orange-Soft" named colors for background fills with high-contrast text for status indicators.
- **Lists:** Items are separated by generous padding and thin, 10% opacity violet dividers.
- **Pet Profiles:** Use circular or highly-rounded avatars to mirror the soft, organic nature of the brand.