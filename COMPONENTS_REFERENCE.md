# 🎨 Components Reference Guide

## Quick Component Usage Examples

### 🌟 Scroll Animations

#### ScrollReveal
Reveals elements with directional animation on scroll.

```tsx
import { ScrollReveal } from '@/components/3d/scroll-reveal';

// Fade up
<ScrollReveal direction="up" delay={0.2}>
  <div>Your content</div>
</ScrollReveal>

// Other directions
<ScrollReveal direction="down">...</ScrollReveal>
<ScrollReveal direction="left">...</ScrollReveal>
<ScrollReveal direction="right">...</ScrollReveal>
<ScrollReveal direction="scale">...</ScrollReveal>
<ScrollReveal direction="rotate">...</ScrollReveal>
```

**Props:**
- `direction`: "up" | "down" | "left" | "right" | "scale" | "rotate"
- `delay`: number (seconds)
- `duration`: number (seconds, default 0.8)
- `className`: string

---

#### ParallaxScroll
Creates depth by moving elements at different speeds.

```tsx
import { ParallaxScroll } from '@/components/3d/scroll-reveal';

<ParallaxScroll speed={-20}>
  <img src="..." />
</ParallaxScroll>
```

**Props:**
- `speed`: number (positive = scroll with page, negative = scroll against)
- `className`: string

---

#### Scale3D
Scales and rotates elements in 3D space based on scroll.

```tsx
import { Scale3D } from '@/components/3d/scroll-reveal';

<Scale3D>
  <div className="card">Your card content</div>
</Scale3D>
```

**Props:**
- `className`: string

---

#### RotateOnScroll
Rotates element 360° based on scroll position.

```tsx
import { RotateOnScroll } from '@/components/3d/scroll-reveal';

<RotateOnScroll>
  <div className="logo">Logo</div>
</RotateOnScroll>
```

**Props:**
- `className`: string

---

#### Float3D
Continuous floating animation with 3D transforms.

```tsx
import { Float3D } from '@/components/3d/scroll-reveal';

<Float3D>
  <div className="badge">Premium</div>
</Float3D>
```

**Props:**
- `className`: string

---

### 🎴 Interactive Components

#### Card3D
Interactive card with mouse-tracking tilt effect.

```tsx
import { Card3D } from '@/components/3d/card-3d';

<Card3D className="w-full">
  <div className="card-content">
    <h3>Card Title</h3>
    <p>Card description</p>
  </div>
</Card3D>
```

**Features:**
- Mouse tracking tilt
- Spring physics
- 3D depth illusion
- Hover responsive

**Props:**
- `className`: string

---

### 🎬 Effects

#### CursorGlow
Custom glowing cursor that follows the mouse.

```tsx
import { CursorGlow } from '@/components/effects/cursor-glow';

// Add once in your main component
<CursorGlow />
```

**Features:**
- Glowing effect
- Trailing cursor
- Hover detection
- Spring animations

---

#### PageLoader
Beautiful loading animation shown on page load.

```tsx
import { PageLoader } from '@/components/effects/page-loader';

// Add once in your main component
<PageLoader />
```

**Features:**
- Animated logo
- Progress bar
- Particle effects
- Auto-dismisses when loaded

---

### 🌌 3D Canvas

#### EnhancedCanvas
Full-screen 3D background with particles and shapes.

```tsx
import { EnhancedCanvas } from '@/components/3d/enhanced-canvas';

// Add once at the root level
<EnhancedCanvas />
```

**Features:**
- 2000+ particles
- Floating geometries
- Scroll integration
- Mouse parallax
- Post-processing effects

---

### 🎯 Pre-built Sections

#### EnhancedHero
Complete hero section with animations.

```tsx
import { EnhancedHero } from '@/components/marketing/enhanced-hero';

<EnhancedHero />
```

**Includes:**
- Animated backgrounds
- Floating 3D card
- Interactive buttons
- Trust indicators
- Stats with animation

---

#### Testimonials3D
Testimonials section with 3D cards.

```tsx
import { Testimonials3D } from '@/components/marketing/testimonials-3d';

<Testimonials3D />
```

**Features:**
- 3D tilt cards
- Star animations
- Profile hovers
- Pet indicators

---

## 🎨 Framer Motion Patterns

### Basic Animation

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

---

### Hover Effects

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="button"
>
  Click Me
</motion.button>
```

---

### Stagger Children

```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

---

### Continuous Loop

```tsx
<motion.div
  animate={{
    rotate: [0, 360],
    scale: [1, 1.2, 1]
  }}
  transition={{
    duration: 4,
    repeat: Infinity,
    ease: "linear"
  }}
>
  Spinning!
</motion.div>
```

---

### Scroll-Linked

```tsx
import { useScroll, useTransform } from 'framer-motion';

function Component() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  
  return (
    <motion.div style={{ opacity }}>
      Fades on scroll
    </motion.div>
  );
}
```

---

## 🎭 CSS Utilities

### Perspective & 3D

```css
/* Apply to container */
.perspective-1000 {
  perspective: 1000px;
}

/* Apply to element */
.transform-gpu {
  transform: translateZ(0);
  will-change: transform;
}
```

---

### Gradients

```tsx
<div className="bg-gradient-to-r from-secondary to-tertiary-container">
  Gradient background
</div>

<h1 className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-on-background to-secondary-container animate-gradient">
  Animated gradient text
</h1>
```

---

### Shadows

```css
/* Soft ambient shadow */
.ambient-shadow {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 
              0 20px 60px -10px rgba(0, 0, 0, 0.1);
}

/* On hover */
.hover\:shadow-2xl:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

---

### Glass Effect

```tsx
<div className="glass-panel">
  Glass morphism
</div>
```

---

## 🎯 Common Patterns

### Card with Hover

```tsx
<motion.div
  whileHover={{ 
    y: -10,
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
  }}
  className="bg-white rounded-3xl p-6 transition-all"
>
  Card content
</motion.div>
```

---

### Button with Gradient Reveal

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="relative overflow-hidden px-8 py-4 rounded-full font-bold"
>
  <span className="relative z-10">Button Text</span>
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-secondary to-tertiary-container"
    initial={{ x: "-100%" }}
    whileHover={{ x: 0 }}
    transition={{ duration: 0.3 }}
  />
</motion.button>
```

---

### Icon with Rotation

```tsx
<motion.span
  whileHover={{ rotate: 360, scale: 1.2 }}
  transition={{ duration: 0.5 }}
  className="material-symbols-outlined cursor-pointer"
>
  settings
</motion.span>
```

---

### Floating Badge

```tsx
<motion.div
  animate={{ 
    y: [0, -10, 0],
    rotate: [0, 5, 0] 
  }}
  transition={{ 
    duration: 4, 
    repeat: Infinity 
  }}
  className="absolute -top-6 -right-6 bg-secondary text-white px-6 py-3 rounded-full font-bold shadow-2xl"
>
  New!
</motion.div>
```

---

### Section Container

```tsx
<section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto relative overflow-hidden">
  <ScrollReveal direction="up">
    <h2 className="font-headline-lg text-headline-lg mb-8">
      Section Title
    </h2>
  </ScrollReveal>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {items.map((item, i) => (
      <ScrollReveal key={item.id} direction="up" delay={0.1 + i * 0.1}>
        <Card3D>
          <div className="card-content">
            {item.content}
          </div>
        </Card3D>
      </ScrollReveal>
    ))}
  </div>
</section>
```

---

## 🎨 Color Palette

```tsx
// Brand colors
bg-secondary         // #8B6F47 (Warm Brown)
bg-tertiary-container // #360f00 (Dark Brown)
bg-primary           // #000000 (Black)

// Gradients
bg-gradient-to-r from-secondary to-tertiary-container
bg-gradient-to-br from-secondary/5 to-tertiary-container/5

// Text
text-on-background   // Main text
text-on-surface-variant // Muted text
text-secondary       // Accent text
```

---

## 📐 Spacing System

```tsx
// Padding
px-margin-mobile     // Mobile horizontal padding
px-margin-desktop    // Desktop horizontal padding
py-stack-lg          // Large vertical spacing

// Max width
max-w-container-max  // Content max width

// Gap
gap-gutter           // Standard grid gap
```

---

## 🔤 Typography

```tsx
// Headlines
font-headline-lg text-headline-lg
font-headline-md text-headline-md

// Display
font-display-lg text-display-lg
font-display-lg-mobile text-display-lg-mobile

// Body
font-body-lg text-body-lg
font-body-md text-body-md

// Labels
font-label-md text-label-md
font-label-sm text-label-sm
```

---

## 🎬 Animation Timings

```typescript
// Standard durations
instant: 0.15s
fast: 0.3s
normal: 0.6s
slow: 1.0s
verySlow: 1.5s

// Delays
stagger: 0.1s per item
sequence: 0.2s between groups

// Easing
ease: [0.25, 0.46, 0.45, 0.94]  // Custom cubic-bezier
```

---

## 💡 Best Practices

### Performance
```typescript
✅ Use transform instead of top/left
✅ Add transform-gpu for GPU acceleration
✅ Use will-change sparingly
✅ Limit particle counts on mobile
✅ Use IntersectionObserver for scroll triggers
```

### Accessibility
```typescript
✅ Add alt text to images
✅ Ensure sufficient color contrast
✅ Make interactive elements keyboard accessible
✅ Provide option to reduce motion
✅ Use semantic HTML
```

### Code Organization
```typescript
✅ Keep animations in separate components
✅ Use consistent naming conventions
✅ Extract repeated patterns
✅ Document complex animations
✅ Use TypeScript for type safety
```

---

## 🎉 Quick Copy-Paste Examples

### Animated Card Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {items.map((item, i) => (
    <ScrollReveal key={item.id} direction="up" delay={0.1 * i}>
      <Card3D>
        <motion.div
          whileHover={{ y: -10 }}
          className="bg-white rounded-3xl p-6 shadow-xl"
        >
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </motion.div>
      </Card3D>
    </ScrollReveal>
  ))}
</div>
```

---

### Floating Action Button

```tsx
<motion.button
  whileHover={{ scale: 1.1, rotate: 90 }}
  whileTap={{ scale: 0.9 }}
  animate={{ y: [0, -10, 0] }}
  transition={{ duration: 2, repeat: Infinity }}
  className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-secondary to-tertiary-container shadow-2xl flex items-center justify-center text-white z-50"
>
  <span className="material-symbols-outlined">add</span>
</motion.button>
```

---

### Stats Counter

```tsx
<motion.div
  initial={{ scale: 0 }}
  whileInView={{ scale: 1 }}
  transition={{ duration: 0.5 }}
  className="text-center"
>
  <div className="text-5xl font-bold text-secondary">500+</div>
  <div className="text-sm text-on-surface-variant">Happy Pets</div>
</motion.div>
```

---

*Use these components to build amazing, animated experiences! 🚀*
