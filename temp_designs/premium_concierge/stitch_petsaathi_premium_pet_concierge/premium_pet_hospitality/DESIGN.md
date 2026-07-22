---
name: Premium Pet Hospitality
colors:
  surface: '#fff8f6'
  surface-dim: '#fed1ba'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1eb'
  surface-container: '#ffeae0'
  surface-container-high: '#ffe2d5'
  surface-container-highest: '#ffdbca'
  on-surface: '#2d1508'
  on-surface-variant: '#4a463f'
  inverse-surface: '#452a1b'
  inverse-on-surface: '#ffede6'
  outline: '#7b766e'
  outline-variant: '#ccc6bc'
  surface-tint: '#635e54'
  primary: '#635e54'
  on-primary: '#ffffff'
  primary-container: '#fff7ea'
  on-primary-container: '#767167'
  inverse-primary: '#cdc6ba'
  secondary: '#974800'
  on-secondary: '#ffffff'
  secondary-container: '#ff964d'
  on-secondary-container: '#6e3300'
  tertiary: '#7c5800'
  on-tertiary: '#ffffff'
  tertiary-container: '#fff7f0'
  on-tertiary-container: '#936b13'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e9e2d5'
  primary-fixed-dim: '#cdc6ba'
  on-primary-fixed: '#1e1b14'
  on-primary-fixed-variant: '#4a463d'
  secondary-fixed: '#ffdbc7'
  secondary-fixed-dim: '#ffb688'
  on-secondary-fixed: '#311300'
  on-secondary-fixed-variant: '#733500'
  tertiary-fixed: '#ffdea8'
  tertiary-fixed-dim: '#f1bf62'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5e4200'
  background: '#fff8f6'
  on-background: '#2d1508'
  surface-variant: '#ffdbca'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
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
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is anchored in the concept of "The Modern Sanctuary." It bridges the gap between high-end Indian hospitality and contemporary global tech aesthetics. The personality is high-trust, emotionally resonant, and sophisticated, avoiding the typical "playful" tropes of pet care in favor of an editorial, premium home-interior feel.

The design style utilizes a refined **Minimalism** blended with **Tactile** elements. This is achieved through generous white space, a warm color story, and subtle depth through soft shadows. The visual language should feel like a premium concierge service—secure, warm, and highly curated. Key visual elements include:
- **Subtle Noise Textures:** Applied to background layers to give a paper-like, organic feel.
- **Editorial Compositions:** Asymmetric layouts and high-quality photography of pets in modern, sun-drenched interiors.
- **Organic Movement:** Soft transitions and floating 3D pet-care items (e.g., a ceramic bowl or a leather leash) to add dimension without clutter.

## Colors

The palette is inspired by natural fibers, warm sunlight, and premium leather. 

- **Primary Canvas:** Warm Cream (#FFF7EA) serves as the main background color to provide a softer, more inviting experience than pure white. Soft Sand (#F5E6D3) is used for section differentiation and recessed containers.
- **Action & Emphasis:** Warm Orange (#E9853D) is the primary CTA color, chosen for its vibrancy and association with warmth/energy. Soft Gold (#D8A84E) is reserved for premium badges, star ratings, and subtle accents.
- **Typography & Structure:** Luxury Brown (#4A2E1F) replaces black for text to maintain a softer, more sophisticated contrast.
- **Functional Accents:** Trust Green (#4E8F6D) is used for safety markers, verified badges, and availability indicators.

## Typography

This design system uses a classic serif and modern sans-serif pairing to communicate both heritage and efficiency.

- **Headlines:** Playfair Display provides an authoritative, editorial feel. Use "Display" sizes for hero sections and "Headline" sizes for card titles and section starts.
- **Body & UI:** Manrope is utilized for its exceptional legibility and modern, clean geometry. It handles all functional UI elements, long-form descriptions, and labels.
- **Styling Note:** Use Luxury Brown (#4A2E1F) for all primary text. For secondary information, use the brown at 70% opacity rather than shifting to a cold grey.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** with generous padding to evoke a sense of luxury and calm. 

- **Grid:** A 12-column grid for desktop with 24px gutters. On mobile, transition to a single-column layout with 20px side margins.
- **Rhythm:** Use an 8px base unit. Components should favor large internal padding (e.g., 32px or 40px for cards) to maintain the "airy" editorial feel.
- **Alignment:** Content should often be centered or use asymmetrical offsets to break the "standard SaaS" look, leaning more into a lifestyle magazine aesthetic.

## Elevation & Depth

Visual hierarchy is achieved through **Ambient Shadows** and **Tonal Layers**.

- **Shadows:** Use extremely soft, long-range shadows. Instead of grey, shadows should be tinted with the Luxury Brown color at a very low opacity (e.g., `box-shadow: 0 10px 40px rgba(74, 46, 31, 0.08)`).
- **Surface Strategy:** 
  - Level 0: Warm Cream background with a subtle noise texture.
  - Level 1: Soft Sand or White cards with soft shadows.
  - Level 2: Muted Sage or Floating elements used for tooltips or high-priority overlays.
- **Glassmorphism:** Use sparingly for navigation bars or image overlays, using a heavy backdrop blur (20px+) and a semi-transparent Warm Cream tint.

## Shapes

The shape language is organic and inviting. All interactive elements and containers utilize significant rounding to remove visual tension and reinforce the "friendly" brand pillar.

- **Primary Radius:** 0.5rem (8px) for small components like inputs and small buttons.
- **Secondary Radius (Large):** 1rem (16px) for main product/service cards and image containers.
- **Extra Large Radius:** 1.5rem (24px) for prominent hero sections or promotional banners.
- **Iconography:** Use thick-stroke (2pt), rounded icons to match the Manrope typeface.

## Components

### Buttons
- **Primary:** Warm Orange background, white text, 16px vertical padding. Use a subtle lift on hover (elevation increase).
- **Secondary:** Transparent with a 1.5px Luxury Brown border or Soft Gold tint.
- **Tertiary:** Text-only with an underline that expands from the center on hover.

### Cards
- **Service Cards:** White or Soft Sand background, 16px radius, soft ambient shadow. Images should have a subtle 0.5s zoom effect on hover.
- **Profile Chips:** Use Muted Sage backgrounds for sitter attributes (e.g., "Verified," "Pet CPR Trained") with 24px pill-shaping.

### Input Fields
- **Styling:** Soft Sand background with no border. On focus, transition to a 1.5px border in Soft Gold. Labels should always be visible in Manrope Bold (Label-sm).

### Lists & Selection
- Use radio buttons and checkboxes that utilize the Trust Green color when active. List items should have generous vertical spacing (16px+) and be separated by faint Soft Sand lines.

### Specialized Components
- **Trust Badges:** Circular or organic "stamp" shapes in Soft Gold or Trust Green, used to signify premium status or safety certification.
- **Booking Bar:** A floating bottom bar on mobile (Glassmorphic Warm Cream) that houses the primary price and "Book Now" CTA.