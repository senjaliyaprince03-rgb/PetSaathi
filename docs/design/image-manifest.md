# Image Manifest

To ensure visual consistency and originality, every image used on PetSaathi must be logged in this manifest. All imagery must be unique (no repetition across sections), balanced between cats and dogs, and correctly licensed or generated.

| Filename | Animal Category | Section | Usage Count | Source | License Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `public/images/care-handover-courtyard.png` | Dog (Golden Retriever) | Homepage Hero | 1 | AI-generated (PetSaathi) | Original |
| `public/images/indoor-cat-sitting.jpg` | Cat (Tabby) | Services (Pet Sitting) | 1 | AI-generated (PetSaathi) | Original |
| `public/images/dog-walking-park.jpg` | Dog (Beagle) | Services (Dog Walking) | 1 | AI-generated (PetSaathi) | Original |
| `public/images/senior-pet-care.jpg` | Both | Trust & Safety Page | 1 | AI-generated (PetSaathi) | Original |
| `public/images/testimonial-avatar-1.jpg` | Dog (Indie) | Reviews (Homepage) | 1 | User Upload / AI mock | Model Released |
| `public/images/testimonial-avatar-2.jpg` | Cat (Persian) | Reviews (Homepage) | 1 | User Upload / AI mock | Model Released |

## Usage Guidelines
1. **No Global Filters:** Images must stand on their own; do not apply `.bg-black/50` or similar opacity filters over the entire image just to make text readable. Use structured background plates or text-shadow gradients instead.
2. **Balanced Representation:** Marketing materials should not lean exclusively toward dogs. Every multi-image section must show a balance of both cats and dogs.
3. **Descriptive Alt Text:** Never use generic "pet care" as `alt` text. Use descriptive text (e.g., "A Golden Retriever greeting a PetSaathi caregiver in a sunlit courtyard").
4. **Performance:** All above-the-fold images must use `next/image` with `priority={true}`, correct `width`, `height`, and `sizes`.

*Note: User-uploaded evidence and profile pictures are excluded from this public marketing manifest and are governed by our Data Classification Policy.*
