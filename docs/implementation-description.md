# PetSaathi Implementation Description

Last verified: 11 August 2026 (Asia/Kolkata)

## Overview

PetSaathi is a full-stack pet-care platform built with Next.js, React, TypeScript, Tailwind CSS, MongoDB Atlas, and Prisma. The system is organized around the main business flows of the product: customer onboarding, pet profile management, booking creation, Saathi assignment, payment verification, service tracking, safety escalation, support handling, and admin operations.

The current implementation is designed to be production-oriented and fail-closed. Server-side checks validate identity, ownership, role permissions, booking state, service eligibility, payment integrity, and audit requirements before any sensitive action is allowed to complete.

## Algorithm / Method Followed

The application follows a step-by-step service workflow:

1. The user selects a service and enters booking details.
2. The system collects or reuses the pet profile, address, schedule, and service instructions.
3. Server-side validation checks the request shape, required fields, service availability, and policy restrictions.
4. A booking record is created only after the request is considered valid.
5. The system matches an eligible Saathi using role, permission, location, capacity, and service-specific rules.
6. Payment is created and verified through the server, not trusted from client-side state.
7. Booking status advances through the approved state machine as the service moves from request to confirmation, execution, report submission, and closure.
8. Tracking, incident handling, refunds, and support all follow their own audited transition paths.

This method keeps the business logic predictable and auditable while preventing invalid transitions.

## Coding / Development Details

The project is split into clear modules so each domain is easier to maintain:

- User and authentication flows
- Pet and health records
- Booking and assignment logic
- Saathi onboarding, availability, and reporting
- Payment and refund handling
- Tracking and live service updates
- Safety, incident, and complaint workflows
- Admin, operations, and support screens

Implementation choices:

- Frontend: Next.js App Router with React and TypeScript.
- Styling: Tailwind CSS with reusable UI components.
- Forms: React Hook Form with Zod validation.
- Server logic: Next.js API routes and server modules.
- Data access: Prisma ORM with MongoDB Atlas.
- Validation: Zod schemas at API boundaries and form boundaries.
- UX structure: shared layout shells, reusable cards, form primitives, status badges, and state-driven action panels.

The codebase uses reusable components for public pages, dashboards, admin tools, and workflow forms so the UI stays consistent while each domain remains isolated.

## Database Design

MongoDB Atlas is the active database, and Prisma is used to define and manage the schema. The schema stores the key operational records needed for the platform, including:

- Users and roles
- Pets and pet medical information
- Addresses and household members
- Bookings and booking history
- Saathi records, permissions, and assignments
- Payments, refunds, payouts, and reconciliation
- Tracking sessions and tracking points
- Reports, complaints, incidents, and corrective actions
- Notifications, support cases, and privacy requests
- Admin, content, society, partner, loyalty, and business records

The database design favors immutability and auditability:

- Important records are versioned where changes must be reviewable.
- Critical actions are tied to status transitions instead of silent overwrites.
- Unique indexes and transaction rules protect booking, payment, assignment, and incident invariants.
- Sensitive collections are owned by server-side flows rather than direct client writes.

## API Integration

Next.js API routes connect the frontend, database, and external services. The project includes APIs for:

- Authentication
- Pets and pet records
- Bookings and booking approval
- Saathi assignments and service events
- Payments, refunds, and verification
- Tracking and location sessions
- Reports, complaints, incidents, and support
- Admin operations and moderation
- Privacy requests and communications
- Razorpay order creation, signature verification, and webhook handling

The API layer is built to support consistent server checks:

- Requests are validated before processing.
- Role and ownership checks happen on the server.
- Booking and payment transitions are verified before state changes are committed.
- External providers are treated as adapters, not as trusted sources of truth.

## Testing Performed

The project is checked with the following gates:

- ESLint
- TypeScript strict checking
- Vitest unit tests
- Playwright E2E tests
- Production build validation
- Integration and database setup verification
- Dependency audit
- AI router smoke tests

## Setup Verification

The current setup has been checked and works with the verified local configuration. The latest successful validation pass included:

- `npm run doctor`
- `npm run doctor:production`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:integration`
- `npm run test:e2e`
- `npm run build`
- `npm run ai:test`
- `npm audit --omit=dev`

Result: the project is currently in a working, verified state for the checked gates.

## Implementation Summary

The platform is now implemented as a MongoDB Atlas and Prisma-backed Next.js application with clear domain separation, server-side validation, verified payment flow, audited operational state transitions, and automated test coverage across quality, integration, build, and browser layers.

The setup is working, and the remaining work should be treated as product refinement or launch governance rather than basic installation repair.
