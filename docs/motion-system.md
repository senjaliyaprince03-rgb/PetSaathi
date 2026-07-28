# PetSaathi Motion System

Updated: 22 July 2026

## Purpose

PetSaathi uses motion to clarify hierarchy, state, and spatial relationships. The system is inspired by interaction categories studied in the Animos editor, but it is implemented as original application code and does not embed, export, or copy Animos templates.

## Animos patterns translated into PetSaathi

| Animos pattern studied | PetSaathi interpretation | Where it appears |
| --- | --- | --- |
| Depth Stack Scroll | Cards rise from a shallow perspective stack with a small X-axis rotation and scale correction | Articles, booking cards, report cards, admin queue cards |
| Grid Reveal | Sibling cards receive a capped 55ms stagger | Service grids, metrics, customer/Saathi/admin card collections |
| Split Reveal | Primary headings reveal through a vertical clip with a short rise | Page titles and `.section-title` headings |
| Reveal/Wipe | Eyebrows enter with a left-to-right clip | Section labels and route introductions |
| Focus Shift | Hovering a card gently lifts it while its siblings soften | Pointer-capable card grids only |
| Showcase/Orbit | Reserved for art-directed marketing moments | Homepage hero floating trust cards and explicit Framer Motion elements |
| Image Trail | Deliberately excluded from operational screens | Avoids distraction and unnecessary GPU work in care, payment, support, and safety workflows |

## Architecture

### Global observer

`src/components/motion/site-motion.tsx` is mounted once in `src/app/layout.tsx`.

It:

- observes only the current route DOM;
- assigns semantic motion kinds to sections, articles, forms, tables, description lists, headings, and eyebrows;
- reveals each element once;
- caps stagger delay at six siblings;
- watches streamed/dynamically-added route content;
- never changes document layout or business state;
- exits immediately when reduced motion is requested.

### CSS motion language

`src/app/globals.css` owns the shared durations, easing, reveal states, hover focus, image lift, and press feedback.

Primary easing: `cubic-bezier(0.16, 1, 0.3, 1)`.

| Motion | Duration |
| --- | ---: |
| Opacity/focus | 720ms |
| Rise/depth correction | 820ms |
| Split/wipe clip | 900ms |
| Card hover/focus shift | 360ms |
| Card image settle | 900ms |
| Route transition | 520ms |

### Route transition

`src/app/template.tsx` applies a restrained fade, 14px rise, slight scale correction, and blur settle. It directly uses Framer Motion’s `useReducedMotion` hook.

### Explicit marketing motion

The homepage already has art-directed Framer Motion and `ScrollReveal` choreography. Its root carries `data-motion-skip` so the global observer does not double-animate it.

`src/components/3d/scroll-reveal.tsx` now:

- reveals once rather than replaying on every scroll;
- uses the shared premium easing curve;
- reduces the visibility threshold for smoother mobile entry;
- disables parallax, rotation, scale, and floating loops when reduced motion is requested.

## Accessibility and safety rules

1. `prefers-reduced-motion: reduce` removes opacity, translation, scale, rotation, blur, and clipping transitions.
2. No motion hides content when JavaScript is unavailable; reveal styles activate only after the global client system is ready.
3. Forms and tables animate only on initial entry. Their values and interactions never move in response to typing or submission.
4. Hover/focus-shift effects run only with a fine pointer that supports hover.
5. Motion does not run timers, network requests, payment logic, tracking logic, or booking state transitions.
6. The observer disconnects cleanly and unobserves elements after their first reveal.

## Opt-out and explicit control

- Add `data-motion-skip` to a parent to exclude its subtree.
- Add `data-motion="rise"`, `depth`, `focus`, `wipe`, or `split` to choose an explicit style.
- Elements without an explicit value receive a semantic default from the global observer.

## Coverage

The system is mounted in the root layout, so it covers:

- public information and conversion pages;
- customer dashboard, pets, protocols, wallet, inbox, bookings, reports, checkout, feedback, and telemetry;
- Saathi dashboard, assignments, earnings, availability, inbox, reports, and profile;
- society workspace;
- admin, operations, safety, finance, support, content, verification, and legacy routes;
- loading/error routes through the shared route transition.

Legacy pages still need visual redesign, but they now receive the same safe route/reveal motion foundation.

## Verification

- Targeted ESLint passes for the motion system, root layout/template, marketing experience, portal shell, and scroll primitives.
- Full TypeScript `tsc --noEmit` passes after the motion implementation.
- The production build completed and wrote Next.js build ID `5m5DMdV0iZu7ZO-HshSE1` after Prisma generation, compilation, lint/type validation, and route generation.
