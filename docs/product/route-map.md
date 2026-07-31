# PetSaathi Route Map

This document outlines the core routes and API paths that comprise the PetSaathi architecture.

## 1. Public Marketing & Informational Routes
- `/` - Homepage / Marketing Experience
- `/services` - Overview of all available care services
- `/services/[slug]` - Details for a specific service (e.g., Dog Walking, Pet Sitting)
- `/caregivers` - Information about PetSaathi Partners
- `/safety` - Trust & Safety policies and mechanisms
- `/membership` - Corporate benefits and membership options
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/login` - Authentication entry point

## 2. Customer Portal Routes (`/(portal)`)
- `/dashboard` - Customer overview (active bookings, action items)
- `/pets` - List of customer's registered pets
- `/pets/[id]` - Detailed pet profile
- `/pets/[id]/id-card` - Printable or shareable pet emergency card
- `/bookings/[id]` - Booking details and status tracker
- `/bookings/[id]/live` - Real-time active booking view (for LIVE states)
- `/bookings/[id]/checkout` - Payment flow for an offered booking
- `/customer/inbox` - Messages and notifications
- `/customer/wallet` - Loyalty points and corporate wallet balance

## 3. Partner Portal Routes (`/saathi`)
- `/saathi` - Partner dashboard
- `/saathi/assignments` - Active and upcoming service assignments
- `/saathi/availability` - Calendar and capacity management
- `/saathi/earnings` - Payouts and completed job history
- `/saathi/profile` - Partner identity and service credentials

## 4. Administrative Routes
- `/operator` - Base for Support/Finance/Admin staff
- *(Additional admin routes are typically grouped under specialized portals or nested under `/admin` depending on the frontend structure)*

## 5. Key API Routes
- `/api/auth/[...supabase]` - Authentication callbacks
- `/api/public/leads` - Capture public inquiries
- `/api/public/testimonials` - Fetch verified reviews
- `/api/customer/bookings` - Create or manage bookings
- `/api/saathi/assignments` - Partner acceptance/rejection of offers
- `/api/admin/leads` - Admin operations on leads/onboarding
- `/api/webhooks/razorpay` - Payment and refund reconciliation
- `/api/webhooks/sanity-publish` - CMS content updates
