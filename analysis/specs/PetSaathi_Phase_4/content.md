# PetSaathi Phase 4

- Source: `DOCX/PetSaathi Phase 4.docx`
- Pages: 962
- Ordered content blocks: 24138
- Embedded media: 0
- Comments: 0
- Tracked insertions: 0
- Tracked deletions: 0

## Ordered content

PetSaathi Phase 4 — MVP Website / PWA Development 🚀🐾

Executive assessment

Phase 4 should convert PetSaathi’s validated manual processes into a working, mobile-first digital operating system for customers, sitters and administrators.

The proposed direction is approved, with one important correction:

Phase 4 should not build an open, fully automated marketplace. It should build an operations-assisted MVP that digitises the workflows already proven in Phases 1–3.

The first product should automate:

Data collection

Booking records

Payments

Status updates

Sitter assignments

Service reports

Reviews

Incident escalation

Admin oversight

The first product should not automatically approve sitters, classify complex pet risks, guarantee sitter availability or open boarding to every provider.

1. What Phase 4 Actually Means

Phase 1

PetSaathi established whether customers experience the problem and whether they show willingness to pay.

Phase 2

PetSaathi manually tested:

Paid bookings

Service delivery

Customer satisfaction

Repeat demand

Unit economics

Local market density

Phase 3

PetSaathi created:

Sitter screening

Verification checks

Training

Service permissions

Pet-risk matching

Trial bookings

Performance tracking

Boarding controls

Emergency procedures

Phase 4

PetSaathi now converts those processes into software.

The main question is:

Can the proven manual workflow be made faster, more accurate and easier to operate without weakening safety or service quality?

2. Why a PWA Is Suitable

A Progressive Web App is built using web technologies but can provide an app-like experience. A PWA can run across supported devices from one web codebase and may be installed on the user’s home screen without PetSaathi initially maintaining separate Android, iOS and desktop applications.

A proper PWA normally includes:

A responsive web interface

HTTPS

A web app manifest containing the app name, icons and installation metadata

Optional service-worker functionality for controlled caching, offline screens and background capabilities

Mobile-friendly navigation

The web app manifest tells browsers how the installed application should appear and behave. Service workers can support caching and offline operation, although they are not themselves mandatory for every installable PWA.

Recommended Phase 4 approach

Build:

One responsive application with role-based customer, sitter and admin experiences.

Do not build three unrelated products.

The same backend and data model should support:

Customer-facing PWA

Sitter-facing PWA

Admin web dashboard

3. Correct Phase 4 Main Objective

The official objective should be:

Build a secure, mobile-first MVP that allows pet parents to create pet profiles and request services, enables approved sitters to manage assigned work and submit service reports, and gives administrators complete control over sitter matching, payments, safety and booking operations.

The MVP should support manual admin intervention whenever:

Pet risk is Yellow or Red

No ideal sitter match exists

A new sitter is under probation

Boarding is requested

Payment reconciliation fails

An incident occurs

A customer disputes a service

4. Three Main Product Experiences

### Table 1

| Product area | Primary user | Main purpose |
| --- | --- | --- |
| Customer PWA | Pet parent | Create pet records, request and monitor care |
| Sitter PWA | Approved caregiver | Manage assignments and service delivery |
| Admin dashboard | PetSaathi team | Control matching, verification, payments and safety |

The three experiences may share one authentication system but must have separate role permissions.

5. Customer PWA

5.1 Pet-parent signup

The customer should be able to register using:

Mobile number and OTP

Email as a secondary identifier

Name

City and locality

Terms acceptance

Privacy acknowledgement

Communication preferences

MVP rule

Do not force the customer to enter every possible detail during initial signup.

Use progressive onboarding:

Create account

Create pet profile

Request service

Add address and emergency details when required

This reduces unnecessary data collection and customer drop-off.

5.2 Pet-profile creation

Each pet profile should include:

Basic details

Pet name

Species

Breed

Age or date of birth

Sex

Approximate weight

Photograph

Neutered or spayed status

Behaviour information

Comfort with strangers

Comfort with dogs

Comfort with cats

Leash pulling

Bite history

Escape history

Separation anxiety

Resource guarding

Noise sensitivity

Medical information

Known medical conditions

Allergies

Medication

Vaccination status

Mobility limitations

Regular veterinarian

Emergency clinic

Care instructions

Food

Water

Toilet routine

Walking equipment

Restricted activities

Home-access instructions

Emergency contact

Risk status

A newly created pet should begin as:

UNASSESSED

The system may calculate a preliminary risk indication, but Yellow and Red cases should remain subject to administrator review.

6. Service Booking

Customer booking flow

The customer should:

Select the pet.

Select the service.

Choose date and time.

Select duration.

Add instructions.

Confirm service address.

Review the estimated price.

Submit the request.

Wait for sitter matching.

Approve the proposed sitter.

Complete payment.

Receive confirmation.

Important correction

A submitted request is not automatically a confirmed booking.

Use:

Request submitted

rather than:

Booking confirmed

until sitter availability, risk compatibility, customer approval and payment are complete.

7. Booking Status Workflow

Use a controlled status model.

DRAFT

→ REQUESTED

→ RISK_REVIEW

→ MATCHING

→ SITTER_PROPOSED

→ CUSTOMER_APPROVAL_PENDING

→ PAYMENT_PENDING

→ CONFIRMED

→ SITTER_EN_ROUTE

→ IN_PROGRESS

→ REPORT_PENDING

→ COMPLETED

→ CLOSED

Alternative outcomes:

CUSTOMER_CANCELLED

SITTER_CANCELLED

REPLACEMENT_REQUIRED

NO_SHOW

INCIDENT_HOLD

REFUND_PENDING

PARTIALLY_REFUNDED

REFUNDED

DECLINED

Status rules

CONFIRMED requires payment and accepted sitter assignment.

IN_PROGRESS requires sitter check-in or authorised admin action.

COMPLETED requires service end confirmation.

CLOSED requires report delivery and settlement of open issues.

A Level 2 or Level 3 incident may move the booking to INCIDENT_HOLD.

Refund status should remain separate from booking status.

Every status change should create a timestamped history record rather than silently replacing the previous value.

8. Sitter Browsing and Matching

Recommended MVP model

Do not initially create a completely open marketplace where customers browse hundreds of sitters and book anyone instantly.

Use an admin-assisted curated matching model:

Customer requests service.

System applies mandatory eligibility filters.

Admin reviews the shortlist.

One or more suitable sitters are proposed.

Customer reviews limited profile information.

Customer accepts a sitter.

Payment confirms the booking.

Customer-visible sitter information

Show:

Public first name

Profile photograph

Approximate locality

Approved services

Approved pet-size category

Evidence-specific trust badges

Completed booking count

Rating and review count

Short experience summary

Languages

Repeat-booking availability

Do not show:

Complete address

Identity documents

Personal phone number before operational need

Background-check documents

Banking details

Internal scorecard

Unrelated incident records

Exact daily schedule

Matching must use hard filters first

A sitter must be removed from consideration when:

Operational status is not active or probation-approved.

The service permission is missing.

Pet species or dog-size permission is insufficient.

Pet risk exceeds the sitter’s permission.

Required verification has expired.

Sitter is unavailable.

Another booking conflicts.

Travel time is unreasonable.

Boarding-property approval is absent.

Sitter declines the payout or booking.

Only eligible candidates should receive a ranking score.

9. Payment Collection

Recommended payment flow

Customer confirms the sitter and service.

Backend creates a payment order.

Frontend opens the approved checkout.

Customer completes payment.

Backend verifies the payment signature.

Payment provider webhook updates the payment record.

Booking becomes confirmed only after the accepted payment state is verified.

Razorpay’s Standard Checkout documentation recommends using the Orders API and verifying the payment signature to reduce tampering risk. Razorpay webhooks provide server-to-server notifications for payment, refund, dispute and settlement events.

Never rely only on the frontend success screen

A user closing the browser, network interruption or manipulated client response should not create a false paid status.

The server should be the source of truth for:

Order creation

Payment verification

Capture status

Refunds

Webhook events

Payment-to-booking reconciliation

Payment statuses

CREATED

PENDING

AUTHORIZED

CAPTURED

FAILED

EXPIRED

CANCELLED

PARTIALLY_REFUNDED

REFUNDED

DISPUTED

Razorpay notes that webhook payloads represent the entity at the time of the event, so the backend should process events idempotently and confirm the latest payment state rather than assuming webhook delivery order.

10. Booking Tracking

The customer dashboard should show:

Booking ID

Pet

Service

Scheduled time

Proposed or assigned sitter

Payment status

Booking status

Preparation instructions

Cancellation conditions

Support contact

Service updates

Pet Report Card

Review status

Suggested customer timeline

Request received

Risk reviewed

Sitter matched

Payment received

Booking confirmed

Sitter travelling

Service started

Service completed

Report delivered

Review requested

Do not show internal notes, sitter disciplinary information or sensitive admin communications.

11. Sitter Dashboard

The sitter dashboard should initially be available only to applicants or providers who have entered PetSaathi’s approved onboarding system.

Sitter home screen

Show:

Current status

Verification and training tasks

Approved services

Restrictions

Availability

Upcoming assignments

Booking offers

Pending reports

Payout status

Support and emergency actions

Booking offer screen

Show:

Service type

Approximate locality before acceptance

Scheduled time

Duration

Pet species

Pet size

Approved risk summary

Important handling requirements

Payout

Travel estimate

Accept-by deadline

Sensitive information such as the exact address should appear only after assignment acceptance and customer approval.

Active service screen

The sitter should be able to:

Confirm travel

Check in

Record actual start time

Review instructions

Start agreed location sharing

Send service updates

Report a concern

Call emergency support

Check out

Submit the report

Critical rule

The sitter must never be able to mark their own incident as resolved without administrator review.

12. Report Card Submission

The sitter should complete a structured report appropriate to the service.

Dog-walking fields

Actual start and finish

Duration

Approximate distance

Water

Pee

Poop

Waste collected

Mood

Behaviour

Route issue

Photographs

Concern flag

Sitter note

Home-sitting fields

Arrival and departure

Food

Water

Litter or toilet

Play

Rest

Mood

Medication task

Home secured

Photographs or videos

Concern flag

Sitter note

Boarding fields

Feeding updates

Water

Rest

Activity

Toilet

Resident-pet interaction

Separation status

Health observation

Daily photographs or video

Incident status

Pickup confirmation

Submission rules

Required fields depend on service type.

The report must be linked to the booking.

Media should be stored privately.

Report edits after delivery should be versioned.

A concern should create or suggest an incident record.

Customer-visible and internal notes should remain separate.

13. Customer Reviews

A review should be allowed only when:

The booking was completed.

The customer owns or authorised the booking.

The customer has not already submitted a review for the same booking.

Review fields

Overall rating

Punctuality

Communication

Pet handling

Report quality

Written feedback

Same-sitter request

Public-publication permission

Complaint flag

Important rule

A review is different from an incident or complaint.

A customer may:

Give a good rating and still report a minor issue.

Give a low rating without alleging a safety incident.

Submit a private complaint without publishing a review.

The admin system should keep these concepts separate.

14. Admin Operations Dashboard

The admin dashboard is the most important Phase 4 component.

A visually attractive customer interface will not solve operational problems when the admin cannot manage bookings safely.

Required admin modules

### Table 2

| Module | Purpose |
| --- | --- |
| Operations Overview | Current bookings, alerts and pending actions |
| Customer and Pet Records | Customer profiles and pet-risk data |
| Booking Queue | Requests, matching and confirmations |
| Sitter Matching | Eligible sitter shortlist and assignment |
| Sitter Management | Profiles, status and permissions |
| Verification Queue | Review sitter evidence |
| Training Tracker | Training and assessment records |
| Availability Board | Capacity and conflict management |
| Payment Reconciliation | Payments, refunds and payouts |
| Report Review | Missing or concerning reports |
| Review and Complaint Centre | Feedback and service disputes |
| Incident Centre | Emergency and safety management |
| Audit History | Sensitive actions and status changes |

15. Admin Operations Overview

The landing dashboard should display:

New booking requests

Risk reviews pending

Sitter matching pending

Payments pending

Services starting soon

Sitter late alerts

Active services

Reports overdue

Open incidents

Replacement requests

Refunds pending

Sitter verification tasks

Payouts requiring approval

Alert priority

### Table 3

| Priority | Example |
| --- | --- |
| Critical | Lost pet, breathing emergency, severe injury |
| High | Sitter no-show, pet-risk mismatch, unapproved boarding |
| Medium | Late sitter, missing report, payment mismatch |
| Normal | New application, review request, routine verification |

16. Sitter Verification in the MVP

Do not implement one verified = true switch.

Store individual verification records:

Phone confirmed

Identity checked

Interview completed

Reference checked

Background check completed

Training passed

Practical assessment passed

Boarding home assessed

Emergency simulation passed

Every record should contain:

Status

Submission date

Reviewer

Review date

Evidence reference

Expiry

Failure reason

Revocation reason

Public badges

Public badges should be generated only from valid underlying records.

For example:

Identity check status = PASSED

AND not expired

→ show Identity Checked badge

An administrator should not manually type “fully verified” into a public profile.

17. Safety and Incident Tracking

Incident creation methods

An incident may be opened by:

Sitter

Customer

Admin

Report-card concern flag

Complaint workflow

Automated operational rule

Incident fields

Incident ID

Booking ID

Pet ID

Sitter ID

Customer ID

Incident category

Provisional severity

Current status

Detection time

Description

Observed symptoms

Owner contact attempts

Vet contact attempts

Evidence

Transport

Resolution

Follow-up

Corrective actions

Incident status flow

REPORTED

→ TRIAGING

→ ACTIVE_RESPONSE

→ VET_CONTACTED

→ TRANSPORTING

→ MONITORING

→ IMMEDIATE_RISK_RESOLVED

→ REVIEW_PENDING

→ CORRECTIVE_ACTION_OPEN

→ CLOSED

A critical incident should not be closable until:

The immediate response is recorded.

Owner communication is documented.

Veterinary involvement is recorded where applicable.

A review is completed.

Required corrective actions are assigned.

18. PWA Capabilities to Use Carefully

Installability

Provide:

Web app manifest

App icons

Standalone display mode

Install guidance

Mobile home-screen experience

Browsers use manifest metadata to present and install a PWA, although exact installation criteria and user experience vary by browser.

Offline access

Use offline support for low-risk functions such as:

Previously loaded service instructions

Emergency contact screen

Draft report card

Static help content

App shell

Do not allow offline mode to independently finalise:

Payments

Booking confirmation

Sitter reassignment

Refunds

Verification approval

Incident closure

Offline actions should remain visibly pending until the server confirms synchronisation.

Push notifications

Push notifications may support:

Booking offer

Sitter assigned

Payment confirmed

Service reminder

Sitter arrival

Report ready

However, notification support differs across browsers and requires user permission. Notifications are not available consistently enough to be PetSaathi’s only urgent communication channel.

For critical alerts, maintain fallbacks such as:

In-app alert

WhatsApp

SMS

Phone call

Email for non-urgent records

19. Recommended Technical Architecture

A lean modular architecture is sufficient.

Customer PWA ─┐

Sitter PWA ───┼── Backend API ── Relational database

Admin Web ────┘ │

├── Private file storage

├── Payment gateway

├── Notification services

├── Audit and monitoring

└── Background jobs

Recommended components

Frontend

Responsive mobile-first web application

Shared design system

Role-specific routes

Web app manifest

Controlled service worker

Accessible forms

Error and loading states

Backend

Authentication

Authorisation

Business workflows

Risk and matching rules

Payment integration

Incident handling

Notification jobs

Audit logs

Database

Use a relational database because PetSaathi contains strongly connected records:

Users

Pets

Sitters

Services

Bookings

Assignments

Payments

Reports

Reviews

Incidents

Permissions

File storage

Use private object storage for:

Sitter verification documents

Pet photographs

Service photographs

Boarding-home images

Incident evidence

Do not store large files directly inside normal booking or sitter database rows.

20. Core MVP Database Tables

### Table 4

| Table | Purpose |
| --- | --- |
| users | Authentication identity |
| user_roles | Customer, sitter and admin roles |
| customer_profiles | Pet-parent information |
| sitter_profiles | Caregiver information |
| addresses | Controlled customer and sitter locations |
| pet_profiles | Pet details |
| pet_medical_profiles | Restricted medical information |
| pet_risk_assessments | Service-specific risk assessments |
| service_types | Walking, sitting and boarding definitions |
| sitter_service_permissions | Exact sitter eligibility |
| sitter_availability | Working slots and exceptions |
| bookings | Main service record |
| booking_assignments | Primary, backup and replacement sitters |
| booking_status_history | Booking audit trail |
| payments | Customer transactions |
| refunds | Full and partial refunds |
| payouts | Sitter earnings |
| booking_reports | Pet Report Cards |
| reviews | Booking-linked feedback |
| incidents | Safety cases |
| incident_events | Append-only incident timeline |
| sitter_verifications | Individual trust checks |
| training_records | Modules, quizzes and assessments |
| admin_audit_logs | Sensitive administrative changes |

21. Security and Privacy Requirements

PetSaathi will process:

Customer addresses

Home-entry instructions

Pet medical information

Live or recent location data

Sitter identity documents

Boarding-home photographs

Payment references

Incident evidence

Security is therefore a core MVP requirement, not a post-launch feature.

OWASP’s Application Security Verification Standard provides a structured basis for testing authentication, access control, input handling, secure storage and other web-application controls.

Mandatory controls

Role-based access

Customers see only their own pets and bookings.

Sitters see only assignments they are authorised to access.

Operations staff do not automatically see full identity documents.

Finance staff do not need home-entry instructions.

Verification staff do not need unnecessary customer medical records.

Safety admins receive access only where operationally justified.

Server-side authorisation

Hiding a button in the frontend is not security.

Every API request must verify:

User identity

User role

Resource ownership

Permission for the action

OWASP emphasises the separation of authentication, session management and access control, with secure authorisation required for private data and operations.

Secure file uploads

Verification and incident uploads should have:

Allowed file types

File-size limits

Random storage names

Malware scanning where available

Authentication

Authorisation

Private storage

Expiring access links

OWASP identifies uploaded files as a significant attack surface and recommends both authenticated and authorised upload access.

Audit logs

Record:

Login failures

Verification decisions

Service-permission changes

Booking reassignment

Refunds

Payout edits

Incident access

Suspensions

Risk changes

Security and access-control failures should be logged with enough context to investigate suspicious activity.

22. Data-Protection Design

The Digital Personal Data Protection Rules, 2025 were notified with staged commencement. The notified Rules include requirements relating to clear notices, specific purposes, reasonable security safeguards, access controls, logs, backups, breach communication and user-rights mechanisms, with different provisions commencing according to the published schedule.

Phase 4 should therefore include:

Clear privacy notice

Itemised description of collected information

Specific purpose for each data category

Separate optional marketing consent

Consent-withdrawal mechanism

Account correction and deletion request flow

Published privacy-contact information

Data-retention rules

Data-export or access-request process

Security incident response plan

Breach-notification workflow

Processor agreements with hosting and messaging vendors

Important product rule

Do not combine these into one compulsory checkbox:

Terms of service

Essential service-data processing

Marketing messages

Public use of customer photographs

Public use of sitter introduction videos

23. What to Build in the First MVP

Build now

### Table 5

| Feature | Phase 4 priority |
| --- | --- |
| Customer signup | Mandatory |
| Pet profiles | Mandatory |
| Risk questionnaire | Mandatory |
| Booking requests | Mandatory |
| Admin-assisted matching | Mandatory |
| Sitter proposal and approval | Mandatory |
| Payment integration | Mandatory |
| Booking status | Mandatory |
| Sitter assignments | Mandatory |
| Sitter availability | Mandatory |
| Service check-in/check-out | Mandatory |
| Pet Report Cards | Mandatory |
| Reviews | Mandatory |
| Incident reporting | Mandatory |
| Admin dashboard | Mandatory |
| Verification tracking | Mandatory |
| Audit history | Mandatory |
| Basic PWA installation | Recommended |

24. What Not to Build Yet

Defer:

Fully automatic sitter matching

AI-generated pet-risk decisions

Open public onboarding without review

Instant self-service boarding

Real-time public GPS tracking map

Complex in-app chat

Wallet and stored monetary balance

Sophisticated subscriptions

Dynamic pricing engine

Referral gamification

National multi-city architecture

Public sitter rankings with tiny samples

Advanced loyalty points

Grooming and veterinary booking marketplace

Native Android and iOS apps

Why these should wait

They add:

Development time

Security exposure

Operational complexity

Customer-support burden

Additional edge cases

without first proving that the core booking workflow works digitally.

25. Features That May Remain Manual Behind the MVP

During the first launch, admins may continue manually handling:

Yellow and Red pet-risk review

Final sitter selection

Boarding approval

Replacement sitter decision

Refund approval

Sitter verification

Sitter payout approval

Incident severity confirmation

Customer complaint resolution

The software should organise these decisions, not eliminate necessary human judgement.

26. Proposed Phase 4 Success Criteria

### Table 6

| Metric | Proposed target |
| --- | --- |
| Customer signup completion | 70%+ of users starting registration |
| Pet-profile completion | 80%+ of booking users |
| Booking requests successfully created | 95%+ |
| Confirmed-payment reconciliation | 100% |
| Completed booking status accuracy | 98%+ |
| Completed bookings with report card | 100% |
| Incident records linked correctly | 100% |
| Active sitter permissions mapped | 100% |
| Admin actions auditable | 100% of sensitive actions |
| Customer rating | 4.5+ |
| Sitter no-show target | 0% |
| Critical security defects before launch | 0 |
| Unresolved critical incidents | 0 |

These are internal product gates rather than industry standards.

27. MVP Usability Tests

Before public launch, test these complete journeys.

Customer journey

Register → add pet → submit service request → approve sitter → pay → track service → receive report → review

Sitter journey

Sign in → set availability → receive offer → accept → view instructions → check in → complete service → submit report → view payout

Admin journey

Review request → assess risk → identify eligible sitters → propose sitter → monitor payment → monitor service → review report → process payout

Incident journey

Sitter reports issue → admin receives critical alert → owner/vet contacts recorded → booking placed on incident hold → corrective action created → incident reviewed

Failure journeys

Test:

Payment succeeds but customer closes the page.

Webhook arrives twice.

Payment fails.

Sitter cancels.

Customer cancels.

Report upload fails.

User loses connectivity.

Duplicate booking is submitted.

Sitter tries to access another sitter’s assignment.

Customer tries to access another customer’s pet.

Expired verification exists.

Boarding is requested from an unapproved property.

Admin attempts to close an unresolved Level 3 incident.

28. Recommended Product Positioning

Do not market the MVP as:

“India’s fully automated pet-care marketplace.”

Use:

PetSaathi is a managed pet-care platform that connects pet parents with service-approved local caregivers and provides structured booking, payment, service-update and support processes.

This reflects what the first product genuinely provides.

Corrected Phase 4 Product Scope

### Table 7

| Area | MVP model |
| --- | --- |
| Customer acquisition | Mobile website/PWA |
| Pet onboarding | Structured pet profile |
| Risk assessment | Form plus admin review |
| Sitter selection | Curated, admin-assisted |
| Payment | Online prepaid booking |
| Booking operations | Status-driven workflow |
| Service delivery | Sitter checklist and updates |
| Quality | Reports and booking-linked reviews |
| Safety | Incident escalation and audit records |
| Boarding | Controlled beta only |
| Matching algorithm | Hard filters plus human decision |
| Support | Human operations supported by software |

Final Phase 4 Principle

Do not use software to automate chaos. First digitise the stable workflows validated during Phases 2 and 3. The MVP should make booking, matching, payment, reporting and safety easier to manage while keeping important risk and approval decisions under human control.

Simple explanation for professor

“During Phase 4, PetSaathi will convert its manual booking and sitter-trust processes into a mobile-first website and Progressive Web App. Pet parents will be able to create accounts, add pet profiles, request services, approve proposed sitters, make payments, track bookings, receive report cards and submit reviews. Sitters will be able to manage availability, accept authorised bookings, review pet instructions, send service updates and submit reports. The admin dashboard will control pet-risk review, sitter matching, verification, payments, incidents and payouts. The first MVP will not use fully automatic matching or open boarding. These higher-risk decisions will remain under human review. The PWA will use a shared web codebase, private role-based data access, payment verification, secure document storage and auditable status histories. PetSaathi should launch only after the core customer, sitter, admin, payment and incident journeys have been tested successfully.”

PetSaathi Phase 4 — The Lean-MVP Rule 🚀🐾

Executive correction

Your main principle is correct:

Do not build a Rover-level product during Phase 4.

However, the proposed “Correct” list contains four features that are still too advanced for the first MVP:

Full live chat

Complex AI matching

Insurance system

Full subscription engine

These should remain deferred features, not Phase 4 requirements.

Corrected scope

### Table 8

| Build during Phase 4 | Defer until later |
| --- | --- |
| Mobile-first website/PWA | Separate Android customer app |
| Customer booking flow | Separate iOS customer app |
| Sitter dashboard | Separate Android sitter app |
| Admin dashboard | Separate iOS sitter app |
| Payment integration | Pet-product store |
| Booking-status workflow | Full live chat |
| Pet Report Card system | Complex AI matching |
| Reviews and repeat booking | Internal insurance system |
| Manual and rules-assisted matching | Full recurring-subscription engine |
| Basic incident reporting | Dynamic pricing |
| Evidence-specific sitter badges | Open self-service boarding |
| Simple prepaid service packs | Large multi-vendor marketplace |

1. Official Phase 4 Rule

The official principle should be:

Build one responsive, mobile-first PWA with role-based customer, sitter and admin flows. Digitise only the workflows that were proven manually in Phases 2 and 3. Keep matching, sitter approval, boarding, refunds and serious safety decisions under admin control.

A PWA can work across platforms from a single web codebase and can provide an installable, app-like experience. Its web app manifest defines installation details such as the app name, icon and display behaviour. This makes a PWA a suitable first product before PetSaathi funds separate native Android and iOS applications.

2. What Is Wrong With Building Separate Native Apps Now?

Wrong structure

PetSaathi would build:

Customer Android app

Customer iOS app

Sitter Android app

Sitter iOS app

Admin application

Product store

This creates several separate products before PetSaathi has proved that its digital booking workflow works.

The team would need to maintain:

Multiple user interfaces

Multiple release processes

Platform-specific defects

Separate notification behaviour

App-store submissions

Version compatibility

More testing combinations

More customer-support cases

The problem is not that native apps are inherently bad. The problem is that they are premature for the present stage.

Correct structure

Build one system:

One shared backend

│

├── Customer PWA

├── Sitter PWA

└── Admin web dashboard

These may use the same web application and design system, with different routes and permissions according to the user’s role.

Practical result

A customer can open PetSaathi through a link, use it in a browser and install it where supported. The sitter uses the same platform but sees sitter-specific screens. The administrator uses an operations-oriented desktop or tablet interface.

3. Features That Must Be Included

A. Customer Booking Flow

This is the primary customer journey.

Sign up

→ Add pet

→ Complete risk questions

→ Select service

→ Select date and time

→ Submit booking request

→ Receive sitter proposal

→ Approve sitter

→ Pay

→ Track service

→ Receive report

→ Leave review

→ Repeat booking

Minimum customer features

The customer should be able to:

Register using mobile number or email

Create and update a pet profile

Add behavioural and medical instructions

Request walking or sitting

See the price before payment

Review a proposed sitter

Complete online payment

See booking status

Receive service updates

Open the Pet Report Card

Rate the service

Request the same sitter again

Do not include yet

The customer should not initially be able to:

Instantly book any sitter without review

Override risk restrictions

Book an unassessed boarding host

Directly change the assigned sitter

Negotiate private prices

Close an incident

Publish unmoderated medical or safety accusations

B. Sitter Dashboard

The sitter dashboard should support actual service execution, not become a social-media profile platform.

Minimum sitter screens

Home screen

Show:

Current operational status

Approved services

Upcoming assignments

New booking offers

Availability

Pending report cards

Payout status

Training or reverification tasks

Booking-offer screen

Show:

Service

Approximate locality

Date and time

Duration

Pet species

Pet size

Relevant risk summary

Important instructions

Proposed payout

Accept or decline deadline

The exact customer address should normally be released only after the sitter accepts and the assignment is confirmed.

Active-service screen

Allow the sitter to:

Confirm that they are travelling

Mark arrival

Start the service

View care instructions

Send structured updates

Report a concern

Access the emergency process

Mark service completion

Submit the report card

Payout screen

Show:

Booking

Base payout

Bonus

Adjustment

Final payout

Payment status

Expected payment date

C. Admin Dashboard

The admin dashboard is the most important Phase 4 feature.

Without it, PetSaathi may have an attractive customer interface but still operate through chaotic WhatsApp messages and spreadsheets.

Required admin modules

### Table 9

| Module | Purpose |
| --- | --- |
| Booking Queue | Review all new service requests |
| Pet Risk Review | Review Yellow and Red cases |
| Matching Board | Select eligible sitters |
| Active Operations | Monitor current services |
| Sitter Management | Manage status and service permissions |
| Verification Queue | Review identity and trust checks |
| Availability Board | Identify usable sitter capacity |
| Payment Reconciliation | Confirm payments and refunds |
| Report Review | Find missing or concerning reports |
| Incident Centre | Handle safety cases |
| Payout Approval | Approve sitter payouts |
| Audit History | Record sensitive admin actions |

Admin-assisted matching flow

Customer request

↓

System removes ineligible sitters

↓

System displays eligible shortlist

↓

Admin reviews compatibility

↓

Sitter accepts

↓

Customer approves

↓

Payment received

↓

Booking confirmed

This is safer than instant automatic assignment during the first MVP.

4. Payment Integration

Payment integration is a valid Phase 4 requirement.

Correct payment sequence

Backend creates a payment order.

Customer opens the payment checkout.

Customer completes payment.

Backend verifies the payment result.

Payment webhook updates the server record.

Booking changes to CONFIRMED.

Admin can reconcile payment, refund and booking status.

Razorpay’s official web integration recommends creating an order on the server for every payment and verifying the payment signature to prevent tampering. Razorpay also recommends webhooks for server-side payment-status verification rather than relying only on the browser’s success response.

Critical rule

Never confirm a booking merely because the customer sees a “Payment successful” screen.

The server should confirm:

Payment order

Amount

Currency

Payment identifier

Signature

Captured status

Booking ID

Webhook processing status

MVP payment methods

Use:

Razorpay Checkout

UPI

Cards and supported online methods

Payment Link fallback

Manually recorded bank transfer only under an authorised exception

Do not build an internal wallet during the first MVP.

5. Pet Report Card System

The report-card system is a core MVP feature because it converts service delivery into structured customer evidence.

Report workflow

Service completed

→ Sitter completes structured report

→ Concern automatically flagged

→ Admin reviews where required

→ Report delivered to customer

→ Review requested

Required fields

Dog walk

Actual start and end time

Duration

Distance

Water

Pee and poop

Waste collected

Mood

Behaviour

Photographs

Route issue

Concern

Sitter note

Home sitting

Arrival and departure

Food

Water

Toilet or litter

Play

Rest

Mood

Medication task

Home secured

Photographs

Concern

Sitter note

Product rules

Report must be linked to a booking.

Required fields depend on service type.

Media must remain private.

Material edits should be versioned.

A serious concern should open an incident workflow.

Internal notes should remain separate from customer-visible notes.

The customer should receive the report within the defined service target.

6. Manual and Semi-Automated Matching

This belongs in the MVP.

However, “semi-automated” should mean rules-assisted, not AI-dependent.

Step 1 — Hard eligibility filters

The system should exclude a sitter when:

Sitter status is not active or probation-approved.

Sitter lacks permission for the requested service.

Pet type or size exceeds sitter approval.

Pet risk exceeds sitter capability.

Required training or verification has expired.

Sitter is unavailable.

Sitter already has a conflicting booking.

Travel time exceeds the limit.

Boarding property is not approved.

Sitter has an active safety restriction.

Step 2 — Rank remaining sitters

Possible ranking factors:

### Table 10

| Factor | Suggested importance |
| --- | --- |
| Pet-risk compatibility | 25% |
| Exact service capability | 20% |
| Distance/travel reliability | 20% |
| Availability | 15% |
| Recent performance | 10% |
| Same-sitter continuity | 5% |
| Payout/economics fit | 5% |

Step 3 — Admin approval

An administrator reviews the shortlist before sending a sitter proposal.

Why this is the right MVP

The system saves time by excluding clearly unsuitable candidates, while a human remains responsible for ambiguous risk, new sitters, unusual pets and important customer concerns.

7. Why Full Live Chat Should Be Deferred

Full live chat is not only a message box

A production chat system may require:

Two-way real-time connections

Message storage

Delivery status

Read status

Attachment upload

Message moderation

User blocking

Notification fallback

Offline delivery

Customer-support access

Data retention

Abuse reporting

Incident preservation

Access control

Search and export

WebSockets provide real-time two-way browser-server communication, but that is only the transport layer. PetSaathi would still need to design all the operational, privacy, moderation and notification behaviour around it.

Correct MVP replacement

Use:

Structured in-app booking updates

Templated sitter messages

Admin-controlled WhatsApp communication

Click-to-call support

Incident-call button

Limited booking notes

Push notifications where permission is granted

Web push can send asynchronous notifications even while the app is not in the foreground, but users must grant permission. It should not be the only channel for critical safety communication.

Build later

Full in-app chat should be considered only after PetSaathi has demonstrated that:

WhatsApp creates operational problems

Customers frequently need real-time sitter communication

Moderation and retention rules are established

The team can support chat-related disputes and abuse reports

8. Why Complex AI Matching Should Be Deferred

Problem with AI matching at this stage

PetSaathi will initially have:

A relatively small sitter pool

Limited completed-booking data

Few incident examples

Changing service rules

New risk classifications

Manual exceptions

Small review samples

A complex model trained on limited or inconsistent data may create misleading confidence.

Correct Phase 4 system

Use:

Hard safety filters

+ configurable weighted ranking

+ admin judgement

This gives PetSaathi:

Explainable decisions

Clear rejection reasons

Easier debugging

Manual correction

Auditable matching

Faster development

Possible later AI functions

After sufficient reliable data exists, AI may help:

Summarise customer instructions

Identify missing profile information

Detect contradictory availability

Suggest eligible sitter shortlists

Flag unusual report language

Categorise support tickets

AI should not initially make final decisions about:

Whether a Red-risk pet is safe to accept

Whether a sitter is trustworthy

Whether an incident is resolved

Whether a boarding property is safe

Whether emergency veterinary care is needed

9. Why an Insurance System Should Be Deferred

Do not build insurance internally

PetSaathi should not attempt to become an insurer or create its own insurance product during Phase 4.

In India, IRDAI states that registration is mandatory when an entity ventures into the insurance industry. Insurance-related distribution and web-aggregator activity are also subject to regulatory frameworks. PetSaathi should therefore use a properly licensed insurance partner if it later wants to offer insurance-linked protection.

Correct Phase 4 scope

Build:

Incident reporting

Evidence storage

Expense records

Refund workflow

Customer-support escalation

Sitter suspension controls

Optional field for external policy or claim reference

Do not build:

Policy underwriting

Premium calculation

Claim adjudication

Insurance guarantee

Risk-pool management

Policy issuance

Customer statements suggesting every booking is insured

Safe customer wording

Use:

“PetSaathi provides a documented incident-escalation and customer-support process.”

Do not say:

“Every booking is fully insured.”

unless a genuine policy exists and its insurer, coverage, exclusions and claim process are clearly disclosed.

10. Why the Full Subscription Engine Should Be Deferred

A complete subscription system is not necessary to sell repeat care.

Recurring-payment systems introduce:

Plans

Billing cycles

Automatic charges

Invoices

Failed payment attempts

Pauses

Cancellations

Upgrades and downgrades

Refund calculations

Webhook events

Customer notification

Reconciliation

Razorpay’s subscription workflow creates invoices at billing-cycle boundaries, attempts charges and emits payment and subscription events. This is substantially more complex than selling a prepaid pack.

Correct MVP replacement: prepaid packs

Start with:

Five-walk pack

Ten-walk pack

Weekly sitting pack

Manually renewed monthly plan

Fixed number of service credits

Clear validity and cancellation rules

Simple data structure

Package purchased: 10 walks

Package used: 3 walks

Package remaining: 7 walks

Validity end: [date]

Preferred sitter: [sitter ID]

The customer makes one payment. PetSaathi deducts one service credit after each completed booking.

Build recurring billing later when

Customers repeatedly buy the same package.

Customers request automatic renewal.

Cancellation and pause rules are stable.

Failed-payment support is ready.

Accounting and reconciliation are reliable.

11. Why the Pet-Product Store Should Be Deferred

A pet-product store creates a separate business model involving:

Product catalogue

Inventory

Suppliers

Warehousing or dropshipping

Delivery

Returns

Product complaints

Pricing and tax

Stock reconciliation

Customer support

It does not directly validate PetSaathi’s core service marketplace.

The Phase 4 product should remain focused on:

Finding, booking, paying and managing trusted pet-care services.

A store may be explored later only when it clearly improves customer retention or service economics.

12. Correct Phase 4 MVP Feature Matrix

Priority 0 — Required before launch

### Table 11

| Feature | Reason |
| --- | --- |
| Authentication and roles | Protect customer, sitter and admin areas |
| Pet profiles | Store service and safety requirements |
| Risk questionnaire | Support safe matching |
| Booking request | Core transaction |
| Admin matching | Assign suitable sitters |
| Sitter acceptance | Confirm real availability |
| Customer sitter approval | Build trust |
| Payment integration | Confirm paid bookings |
| Booking statuses | Operational control |
| Check-in/check-out | Service evidence |
| Report Card | Quality and trust |
| Incident reporting | Safety |
| Admin dashboard | Operational source of truth |
| Audit history | Accountability |

Priority 1 — Strong launch features

### Table 12

| Feature | Reason |
| --- | --- |
| PWA installation | App-like repeat access |
| Push notifications | Timely non-critical updates |
| Repeat booking | Customer retention |
| Prepaid packs | Recurring use without subscription complexity |
| Sitter availability | Better matching |
| Reviews | Booking-linked service feedback |
| Payout ledger | Sitter transparency |
| Evidence-specific badges | Customer trust |

Priority 2 — Later

### Table 13

| Feature | Reason to defer |
| --- | --- |
| Full in-app chat | Moderation and infrastructure complexity |
| Complex AI matching | Insufficient reliable training data |
| Insurance marketplace | Regulatory and partner complexity |
| Full subscriptions | Billing lifecycle complexity |
| Wallet | Financial reconciliation complexity |
| Product store | Separate operational business |
| Open boarding | High safety risk |
| Native apps | Duplicate development and maintenance |
| Dynamic pricing | Insufficient demand data |
| Multi-city automation | Micro-market model not yet proven digitally |

13. Minimum PWA Requirements

The PWA should include:

Responsive mobile-first interface

Secure HTTPS delivery

Web app manifest

App name and icons

Installable experience where supported

Mobile navigation

Fast loading

Error handling

Controlled caching

Safe offline screen

Update mechanism

A PWA should continue to work as a normal website for users who do not install it. Official PWA guidance emphasises that installed and browser-based usage both need to be supported.

Safe offline functionality

Offline access may include:

Previously downloaded booking instructions

Emergency contact information

Draft report card

Static safety instructions

Previously loaded booking schedule

Offline mode should not independently finalise:

Payments

Booking confirmation

Refunds

Sitter assignments

Verification approval

Incident closure

These actions should remain pending until the server confirms them.

14. Security Is Part of the MVP

PetSaathi will store:

Customer addresses

Pet medical and behavioural details

Sitter identity information

Home-access instructions

Boarding-home photographs

Service photographs

Payment references

Incident evidence

Security cannot be postponed until after launch.

OWASP ASVS provides a structured standard for testing web-application security controls and can be used as a baseline for authentication, authorisation, data handling and secure development.

Minimum controls

Server-side role authorisation

Customers can access only their own records

Sitters can access only confirmed assignments

Sensitive documents stored privately

Signed or expiring media access links

Password/OTP rate limits

Secure session handling

File-type and size validation

Payment-signature verification

Idempotent webhook processing

Audit logs

Database backups

Error monitoring

Production/test environment separation

15. Recommended Phase 4 Success Condition

Phase 4 is successful when PetSaathi can complete the full digital lifecycle:

Customer creates pet

→ requests service

→ admin reviews risk

→ eligible sitter accepts

→ customer approves sitter

→ payment is verified

→ booking is completed

→ sitter submits report

→ customer receives report

→ payout is recorded

→ review or incident is processed

Suggested internal launch gates

### Table 14

| Metric | Target |
| --- | --- |
| Successful booking-request creation | 95%+ |
| Payment-to-booking reconciliation | 100% |
| Active sitters with mapped permissions | 100% |
| Completed bookings with report card | 100% |
| Sensitive admin actions audited | 100% |
| Critical access-control defects | 0 |
| Unresolved critical incidents | 0 |
| Customer rating | 4.5+ |
| Sitter no-show target | 0% |
| Booking status accuracy | 98%+ |

These are PetSaathi’s internal product targets rather than universal marketplace benchmarks.

Final Approved Phase 4 Scope

Build

A mobile-first PWA containing customer booking, sitter operations, admin control, online payments, status tracking, Pet Report Cards, reviews, sitter verification records, basic incident management and manual/rules-assisted matching.

Do not build yet

Separate native apps, a pet store, full live chat, complex AI matching, an insurance system, a full recurring-subscription engine, open boarding or a nationwide automated marketplace.

Simple explanation for professor

“During Phase 4, PetSaathi should not attempt to build a full Rover-level platform. Four separate Android and iOS applications would create excessive cost and maintenance before the digital workflow has been validated. Instead, PetSaathi will build one mobile-first Progressive Web App with separate customer, sitter and admin experiences. Customers will create pet profiles, request services, approve sitters, pay online, track bookings, receive report cards and leave reviews. Sitters will manage availability, accept authorised bookings, follow service checklists and submit reports. Administrators will review pet risk, match sitters, monitor payments, manage verification and handle incidents. Full live chat, complex AI matching, insurance, recurring subscriptions and the pet-product store will be postponed. The first MVP will use structured updates, rules-based sitter filtering, prepaid packages and human oversight so that PetSaathi can launch quickly without weakening safety or operational control.”

PetSaathi Phase 4 — 60-Day MVP Website/PWA Development Plan 🚀🐾

Executive decision

Your 60-day MVP recommendation is practical and appropriate provided that PetSaathi builds:

One city

One primary micro-market

Dog walking and pet sitting as active services

Boarding as an admin-controlled beta

Manual or rules-assisted matching

One shared responsive web application

No native apps, live chat, AI matching, wallet or subscription engine

The best architecture is a modular monolith: one Next.js codebase, one PostgreSQL database and three role-based interfaces for customers, sitters and administrators.

Recommended stack: Next.js + TypeScript + Tailwind/shadcn + Supabase PostgreSQL/Auth/Storage + Prisma + Razorpay + WhatsApp Cloud API + Resend + Vercel + Sentry.

1. Recommended Phase 4 duration

### Table 15

| Version | Duration | Suitable scope |
| --- | --- | --- |
| Fast MVP | 30 days | Customer request form, manual admin assignment and basic payment |
| Standard MVP | 45–60 days | Customer, sitter and admin flows with payments, reports and incidents |
| Strong MVP | 75–90 days | More polished UX, stronger automation and broader testing |

Recommended duration: 60 days

A 60-day timeline is realistic when:

Phase 2 and Phase 3 workflows are already documented.

One experienced full-stack developer is available full time.

Product requirements are frozen during the first week.

UI design remains functional rather than highly customised.

Matching remains admin-assisted.

Boarding remains restricted.

No native mobile applications are included.

Testing and deployment are included in the 60 days.

A solo developer working part-time should use the 75–90-day plan instead.

2. Final MVP service scope

Active service 1 — Dog walking

Dog walking should be the primary repeat-use service.

The MVP should support:

30-minute and 60-minute walks

One-time booking

Repeat-booking request

Same-sitter preference

Walking instructions

Actual start and finish times

Location update

Distance

Pee and poop information

Pet Report Card

Active service 2 — Home pet sitting

Pet sitting should support:

Short home visits

One-hour sitting

Feeding and water

Cat visits

Travel-period visits

Play and rest updates

Arrival and departure confirmation

Home-security checklist

Pet Report Card

Do not include medically complex sitting unless the sitter has an appropriate permission and the booking receives manual approval.

Controlled-beta service — Pet boarding

Boarding should not be publicly open to every sitter.

The software should allow boarding only when:

The host has boarding permission.

The specific property has an active assessment.

Capacity is available.

Household and resident-pet information is current.

The customer’s pet passes boarding compatibility review.

An administrator approves the match.

The first product may label this:

Boarding Beta — availability confirmed manually

Basic veterinary emergency support

This should mean:

Saved regular veterinarian

Saved emergency clinic

Click-to-call clinic contact

Emergency escalation instructions

Admin incident coordination

Partner-clinic directory

It should not mean:

Veterinary diagnosis

Guaranteed clinic availability

Medical treatment by PetSaathi

Guaranteed emergency transport

Insurance coverage

Use the customer-facing description:

Emergency escalation and veterinary referral support

Services to postpone

### Table 16

| Service | Phase 4 treatment |
| --- | --- |
| Grooming | Add later as a partner workflow |
| Training | Add later after partner verification |
| Pet taxi | Postpone because of transport and scheduling complexity |
| Product store | Postpone because it creates a separate inventory business |
| Open boarding | Postpone until the beta is proven |
| Subscription billing | Replace initially with repeat booking or prepaid packages |

3. Final recommended technology stack

Stack decision table

### Table 17

| Layer | Final recommendation | Decision |
| --- | --- | --- |
| Framework | Next.js App Router + TypeScript | Approve |
| UI | Tailwind CSS + shadcn/ui | Approve |
| Architecture | Modular monolith | Approve |
| Database | Supabase-hosted PostgreSQL | Approve |
| ORM | Prisma | Approve |
| Authentication | Supabase Auth | Recommended |
| Storage | Supabase Storage | Approve |
| Payments | Razorpay Standard Checkout | Approve |
| Messaging | WhatsApp Cloud API | Approve |
| Email | Resend | Approve |
| Maps | Mappls or Google, after address benchmark | Choose one |
| Hosting | Vercel | Approve |
| Monitoring | Sentry | Approve |
| Product analytics | GA4 | Approve with privacy controls |
| Behaviour analytics | Microsoft Clarity | Optional and restricted |
| Admin dashboard | Custom Next.js dashboard | Approve |

4. Frontend — Next.js and TypeScript

Use the Next.js App Router, not the older Pages Router, for a new project. App Router provides layouts, loading states, Server Components, Client Components and file-based Route Handlers. Next.js Route Handlers support normal HTTP methods and are appropriate for payment, WhatsApp and other webhook endpoints.

Recommended usage

Server Components

Use Server Components for:

Dashboard pages

Booking lists

Sitter profiles

Pet-profile display

Admin tables

Report-card display

Client Components

Use Client Components only where interaction is required:

Date and time selection

Maps

Multi-step forms

File uploads

Razorpay Checkout

Live status controls

PWA installation prompt

Server Actions

Use Server Actions for internal authenticated form mutations such as:

Creating a pet

Updating availability

Accepting a booking

Submitting a review

Saving care instructions

Server Actions run on the server and can handle form mutations without creating unnecessary public API endpoints.

Route Handlers

Use Route Handlers for:

Razorpay webhooks

WhatsApp webhooks

Authentication callbacks

Signed upload requests

Public support endpoints

Scheduled tasks

5. UI — Tailwind CSS and shadcn/ui

Tailwind and shadcn/ui are a strong combination for rapid MVP development. Both provide official Next.js setup paths.

Use shadcn/ui for:

Forms

Dialogs

Tables

Alerts

Tabs

Drawers

Dropdowns

Calendar inputs

Admin navigation

Status badges

Design-system requirements

Define these before building individual screens:

Typography scale

Spacing rules

Form-field design

Success, warning and critical states

Booking-status colours

Risk-level presentation

Empty states

Loading skeletons

Mobile bottom navigation

Desktop admin sidebar

Tailwind-version consideration

Tailwind v4 uses a modern browser baseline. Its documentation states support expectations beginning with relatively recent browser versions; if pilot users frequently use older Android devices or embedded browsers, verify compatibility before committing, or use Tailwind 3.4.

6. Backend architecture — modular monolith

Do not begin Phase 4 with microservices.

Use one Next.js application divided into domain modules:

src/

├── app/

│ ├── (public)/

│ ├── customer/

│ ├── sitter/

│ ├── admin/

│ └── api/

├── modules/

│ ├── auth/

│ ├── customers/

│ ├── pets/

│ ├── sitters/

│ ├── risk/

│ ├── bookings/

│ ├── matching/

│ ├── payments/

│ ├── reports/

│ ├── reviews/

│ ├── incidents/

│ ├── payouts/

│ └── notifications/

├── components/

├── lib/

├── emails/

└── prisma/

Why a modular monolith is appropriate

It provides:

One deployment

One database transaction boundary

Faster development

Easier debugging

Shared validation rules

Lower infrastructure complexity

Modules can be separated into services later if transaction volume or team structure genuinely requires it.

7. Database — Supabase PostgreSQL with Prisma

Supabase provides hosted PostgreSQL, while Prisma supports Supabase and other PostgreSQL-compatible databases.

Recommended connection model

Use:

A pooled connection for runtime serverless queries

A direct database connection for migrations and administrative tasks

SSL connections

Prisma migrations under version control

Supabase provides its Supavisor connection pooler; server-side pooling is particularly relevant for auto-scaling and serverless functions because it prevents short-lived functions from exhausting database connections.

Important architecture decision

Do not access core PetSaathi tables directly from the browser.

Use:

Browser

↓

Authenticated Next.js server

↓

Prisma

↓

PostgreSQL

This keeps:

Pricing rules

Matching rules

Payment transitions

Sitter permissions

Incident controls

Audit logging

inside the trusted server environment.

8. Authentication — use one system

Do not combine Supabase Auth, Auth.js and Clerk in the same MVP.

Recommended choice: Supabase Auth

Use:

Phone OTP for pet parents and sitters

Email magic link or Google login for administrators

Stronger admin authentication controls

Role records stored in the PetSaathi database

Supabase supports phone OTP authentication, but it requires an external supported SMS provider to deliver the codes.

User structure

Supabase Auth owns the authentication identity.

PetSaathi owns the application record:

auth user UUID

↓

users

├── customer_profile

├── sitter_profile

└── user_roles

Roles

CUSTOMER

SITTER

OPERATIONS_ADMIN

VERIFICATION_ADMIN

SAFETY_ADMIN

FINANCE_ADMIN

SUPER_ADMIN

A user may hold more than one role.

Authorization rule

Authentication answers:

“Who is the user?”

Authorization answers:

“What may this user access or change?”

Every server mutation must verify:

Active session

Required role

Resource ownership

Current business status

Permission to perform the action

9. File storage — Supabase Storage

Use private Supabase Storage buckets.

Suggested buckets:

pet-profile-media

service-report-media

sitter-verification-documents

boarding-home-evidence

incident-evidence

marketing-assets

Supabase Storage supports access control through PostgreSQL Row Level Security, and uploads are denied by default until policies are created.

Storage rules

Pet photographs

Visible to:

Pet owner

Assigned sitter during the booking

Authorised admin

Service-report media

Visible to:

Booking customer

Assigned sitter

Operations and safety staff

Verification documents

Visible only to:

Verification admins

Limited senior administrators

Incident evidence

Visible only to:

Safety admins

Specifically authorised operations staff

Other people when required for resolution

Never use public URLs for

Identity documents

Customer home photographs

Medical documents

Boarding-home evidence

Incident images

Access instructions

Generate expiring signed URLs where access is justified.

10. Payment integration — Razorpay

Use Razorpay Standard Checkout for prepaid bookings.

Correct payment workflow

Customer approves sitter

↓

Server creates Razorpay order

↓

Customer completes Checkout

↓

Server verifies payment signature

↓

Razorpay webhook confirms payment state

↓

Payment record becomes CAPTURED

↓

Booking becomes CONFIRMED

Razorpay recommends creating an order on the server for every payment and passing its order_id to Checkout. The order ties the payment to the server-generated amount and reduces tampering risk.

Razorpay webhooks are asynchronous server-to-server notifications. They should be used for authoritative payment-state reconciliation rather than treating the browser success screen as the final source of truth.

Payment tables

payments

Booking ID

Customer ID

Razorpay order ID

Razorpay payment ID

Amount

Currency

Status

Signature-verification status

Captured timestamp

Failure reason

payment_events

Provider event ID

Event type

Received timestamp

Processing result

Payload reference

Duplicate status

refunds

Payment ID

Refund amount

Reason

Requested by

Approved by

Razorpay refund ID

Status

Completed timestamp

Payment statuses

CREATED

PENDING

AUTHORIZED

CAPTURED

FAILED

CANCELLED

PARTIALLY_REFUNDED

REFUNDED

DISPUTED

Idempotency rule

Processing the same webhook twice must not:

Confirm the booking twice

Add package credits twice

Send duplicate payout

Create duplicate refunds

Store the external event identifier and reject already processed events.

11. WhatsApp integration

Use the official WhatsApp Cloud API, not browser automation, scraped sessions or unofficial WhatsApp Web libraries. Meta’s older On-Premises API was sunset in October 2025, making Cloud API the supported platform direction.

Use WhatsApp for

OTP alternatives only when an approved authentication setup exists

Booking-request acknowledgement

Sitter proposal notice

Payment reminder

Booking confirmation

Service reminder

Sitter-arrival update

Report-card-ready message

Review request

Operational alerts

Meta’s messaging APIs support message templates, interactive messages and webhook-based status handling.

Do not use WhatsApp as the database

Every message-triggering event must originate from a database record.

Booking status changes

↓

notification_outbox record created

↓

WhatsApp API called

↓

provider message ID stored

↓

delivery webhook received

↓

notification status updated

Suggested notification statuses

QUEUED

SENDING

SENT

DELIVERED

READ

FAILED

CANCELLED

Important rule

WhatsApp failure must not change the underlying booking status.

For example:

Payment is captured.

Booking becomes confirmed.

WhatsApp message fails.

The booking remains confirmed, and the admin sees a notification-delivery alert.

12. Transaction email — Resend

Use email for:

Welcome message

Payment receipt

Booking confirmation

Report-card delivery

Refund confirmation

Sitter onboarding records

Admin incident summaries

Payout statements

Resend provides an official Next.js integration and requires an API key and verified sending domain.

Use a branded domain such as:

bookings@petsaathi.in

care@petsaathi.in

safety@petsaathi.in

Avoid sending important operational messages from generic development domains.

13. Maps — choose one provider after testing

Do not integrate both Google Maps and Mappls fully during the first MVP.

Test both providers using real addresses

Before deciding, run a short benchmark using approximately 50 addresses from the actual pilot localities.

Test:

Society-name search

Apartment entrance accuracy

PIN code accuracy

Reverse geocoding

Route duration

Two-wheeler route support

Local landmark quality

API response consistency

Pricing

Developer experience

Google’s Geocoding API converts addresses into coordinates, while its Routes API can calculate distances and travel times between multiple origins and destinations.

Mappls offers India-focused search, geocoding, route, navigation and location APIs, including address-to-coordinate conversion.

Recommended implementation

Create a provider abstraction:

interface MapsProvider {

geocode(address: string): Promise<Coordinates>;

reverseGeocode(point: Coordinates): Promise<string>;

calculateTravelTime(

origin: Coordinates,

destination: Coordinates

): Promise<TravelEstimate>;

}

Then select one provider for production.

Matching use

Store:

Latitude

Longitude

Locality

PIN code

Geocoding-provider reference

Accuracy result

Calculate sitter matching using travel minutes, not only straight-line kilometres.

14. Hosting — Vercel and Supabase

Deploy the Next.js application to Vercel and host the database, authentication and storage in Supabase.

Vercel provides direct support for Next.js deployments and automatically configures the framework’s build and deployment behaviour.

Environments

Create three separate environments:

### Table 18

| Environment | Purpose |
| --- | --- |
| Development | Local development and test data |
| Staging | Internal QA and customer UAT |
| Production | Real customers and payments |

Use separate:

Razorpay test/live keys

WhatsApp test/production configuration

Databases or protected schemas

Storage buckets

Sentry environments

Analytics IDs

Never use production identity documents or customer addresses in local developer fixtures.

15. Monitoring — Sentry

Use Sentry for:

Frontend exceptions

Server exceptions

Failed API requests

Slow transactions

Payment-processing failures

Webhook errors

Release tracking

Source maps

Sentry provides a dedicated Next.js setup covering server, browser and framework runtime environments.

Add business-context tags

Examples:

booking_id

payment_id

user_role

service_type

environment

incident_id

Do not send:

Pet medical notes

Identity-document data

Home-access codes

Full customer addresses

Payment credentials

16. Analytics — GA4 and Clarity

GA4

Use GA4 to measure funnel events such as:

sign_up_started

sign_up_completed

pet_profile_created

booking_request_started

booking_request_submitted

sitter_proposed

sitter_approved

payment_started

purchase

service_completed

report_viewed

review_submitted

repeat_booking_requested

GA4 uses event-based measurement and supports custom and recommended events, including purchase and refund events.

Do not send personally identifiable information, pet medical information or exact addresses to analytics. Google’s enhanced-measurement guidance explicitly requires implementers to avoid collecting personally identifiable information.

Microsoft Clarity

Clarity may be useful for:

Public landing pages

Signup-funnel usability

Booking-form usability

Detecting confusing buttons or abandonment

Do not load Clarity on:

Admin pages

Sitter-verification pages

Payment pages

Pet medical forms

Home-access pages

Incident pages

Identity-document upload pages

If used, enable strict masking. Clarity provides global and element-level masking, and masking changes do not apply retroactively to previous recordings.

17. PWA implementation

A PWA can be installed while remaining accessible as an ordinary website from one shared codebase.

Required PWA elements

HTTPS

Web app manifest

App name

Short name

Icons

Theme colour

Start URL

Standalone display

Mobile-responsive navigation

The web app manifest defines how the installed application appears and behaves and is required for consistent installability across browsers.

Service worker scope

Use a service worker for:

Static app shell

Offline fallback page

Cached safety instructions

Draft report card

Previously loaded booking summary

Service workers can support caching, offline use and push capabilities, but browser support and lifecycle behaviour vary; they should be treated as enhancement rather than a requirement for the core booking system.

Never complete these offline

Payment

Booking confirmation

Sitter reassignment

Refund

Payout

Verification approval

Incident closure

Boarding approval

Show:

“Saved offline — waiting to synchronise”

until the server confirms the mutation.

18. Core database architecture

Identity and profiles

### Table 19

| Table | Purpose |
| --- | --- |
| users | Application identity linked to auth user |
| user_roles | Customer, sitter and admin roles |
| customer_profiles | Customer-specific information |
| sitter_profiles | Sitter profile and operational status |
| addresses | Controlled customer/sitter addresses |

Pet and risk

### Table 20

| Table | Purpose |
| --- | --- |
| pets | Basic pet information |
| pet_medical_profiles | Restricted medical details |
| pet_emergency_contacts | Emergency contacts |
| pet_risk_assessments | Service-specific risk decision |
| pet_risk_factors | Bite, pulling, anxiety, medical and escape flags |

Sitter trust system

### Table 21

| Table | Purpose |
| --- | --- |
| sitter_verifications | Identity, interview and other checks |
| training_modules | Training catalogue |
| sitter_training_attempts | Quiz and completion history |
| practical_assessments | Walking, sitting and boarding assessments |
| sitter_service_permissions | Exact permitted services |
| sitter_availability_rules | Recurring availability |
| sitter_availability_exceptions | Leave and temporary changes |
| boarding_properties | Assessed boarding locations |

Booking operations

### Table 22

| Table | Purpose |
| --- | --- |
| service_types | Walking, sitting and boarding definitions |
| bookings | Main service order |
| booking_assignments | Primary, backup and replacement sitter |
| booking_status_history | Every booking state change |
| booking_instructions | Structured service instructions |
| booking_reports | Pet Report Card |
| report_media | Private photos and videos |
| reviews | Completed-booking feedback |

Finance and safety

### Table 23

| Table | Purpose |
| --- | --- |
| payments | Customer payments |
| payment_events | Razorpay webhook events |
| refunds | Refund tracking |
| payouts | Sitter earnings |
| payout_adjustments | Bonuses or deductions |
| incidents | Main safety case |
| incident_events | Append-only timeline |
| incident_notifications | Owner, admin and vet contacts |
| incident_corrective_actions | Prevention and follow-up |

System controls

### Table 24

| Table | Purpose |
| --- | --- |
| notification_outbox | Pending messages |
| notification_deliveries | WhatsApp/email delivery status |
| admin_audit_logs | Sensitive admin actions |
| feature_flags | Boarding and experimental features |
| policy_versions | Terms, privacy and operational rules |

19. Essential database constraints

The database should enforce important business facts.

Examples:

Booking end time must be after start time.

Only one active primary sitter may exist per booking.

A suspended sitter cannot receive a confirmed assignment.

A boarding booking requires active host and property approval.

A review requires a completed booking.

One customer review is allowed per booking.

A payout requires a completed assignment.

A payment amount must match the server-calculated booking amount.

A critical incident cannot close without a final review.

Expired verification cannot generate a public badge.

Booking status changes must create history records.

Do not rely only on frontend validation.

20. Customer journey

Step 1 — Signup

Customer enters:

Name

Mobile number

OTP

City/locality

Terms and privacy acceptance

Step 2 — Pet profile

Customer adds:

Basic pet details

Behaviour information

Medical information

Emergency contact

Care instructions

Step 3 — Risk questionnaire

The system captures:

Bite history

Pulling

Stranger anxiety

Other-pet compatibility

Medical conditions

Medication

Escape history

Food allergies

The system may suggest Green, Yellow or Red, but Yellow and Red cases should enter manual review.

Step 4 — Service request

Customer selects:

Pet

Service

Date

Time

Duration

Address

Instructions

Step 5 — Matching

The system removes ineligible sitters and shows an admin shortlist.

Step 6 — Sitter proposal

Customer sees:

First name

Photograph

Locality

Service permissions

Evidence-specific badges

Booking count

Rating and review count

Step 7 — Payment

Customer pays only after accepting the sitter and price.

Step 8 — Service tracking

Customer sees:

Confirmed

Sitter travelling

Arrived

In progress

Completed

Report ready

Step 9 — Report and review

Customer receives the report card, gives a rating and requests repeat care.

21. Sitter journey

Step 1 — Login

The sitter sees:

Operational status

Service permissions

Training tasks

Availability

Upcoming bookings

Pending reports

Payouts

Step 2 — Booking offer

The sitter receives:

Service

Approximate locality

Pet type

Pet size

Relevant risk information

Date/time

Duration

Payout

Accept deadline

Step 3 — Acceptance

After acceptance and customer confirmation, the sitter receives:

Exact address

Customer contact

Pet instructions

Emergency contacts

Access instructions

Step 4 — Service execution

The sitter can:

Mark en route

Mark arrived

Check in

Send structured updates

Report a concern

Call emergency support

Check out

Step 5 — Report submission

The sitter submits service-specific report fields and media.

Step 6 — Payout

The dashboard shows:

Base payout

Bonus

Adjustment

Payout status

Expected payout date

22. Admin journey

Booking queue

Admin reviews:

New request

Pet risk

Payment status

Sitter availability

Service area

Special instructions

Matching board

The system presents only eligible sitters.

Admin compares:

Distance and travel time

Service permission

Pet-risk compatibility

Availability

Recent score

Customer continuity

Payout economics

Operations dashboard

Admin monitors:

Services starting soon

Sitter en-route status

Late arrivals

Active services

Missing updates

Reports overdue

Incidents

Replacement requirements

Financial controls

Admin manages:

Payment mismatches

Refunds

Sitter payouts

Bonuses

Disputed amounts

Safety controls

Admin can:

Open incident

Apply temporary sitter hold

Record owner and veterinary calls

Assign corrective actions

Restrict one service permission

Close the case after review

23. Booking status model

DRAFT

REQUESTED

RISK_REVIEW

MATCHING

SITTER_PROPOSED

CUSTOMER_APPROVAL_PENDING

PAYMENT_PENDING

CONFIRMED

SITTER_EN_ROUTE

IN_PROGRESS

REPORT_PENDING

COMPLETED

CLOSED

Alternative outcomes:

DECLINED

CUSTOMER_CANCELLED

SITTER_CANCELLED

REPLACEMENT_REQUIRED

NO_SHOW

INCIDENT_HOLD

Payment and refund states should remain separate from the booking status.

24. Sixty-day execution schedule

Week 1 — Product definition and architecture

Build

Freeze MVP scope

Finalise user roles

Draw customer, sitter and admin flows

Finalise booking states

Finalise database schema

Define permissions

Create wireframes

Create risk register

Prepare repository and environments

Output

Product requirements document

Database ERD

User-flow diagrams

API and event list

UI wireframes

Development backlog

Week 1 rule

No major feature should be added after this week without removing or delaying another feature.

Week 2 — Technical foundation

Build

Next.js application

Tailwind and shadcn setup

Supabase project

Prisma schema and migrations

Authentication

User roles

Route protection

Base admin layout

Storage buckets

Logging and Sentry

Development/staging deployment

Output

A user can sign in and reach the correct role-specific dashboard.

Week 3 — Customer and pet flows

Build

Customer profile

Address management

Pet profiles

Medical details

Emergency contacts

Pet-risk questionnaire

Service selection

Date/time selection

Booking-request creation

Customer booking history

Output

A customer can create a complete booking request.

Week 4 — Sitter and admin matching

Build

Sitter profiles

Evidence-specific badges

Service permissions

Availability

Booking-offer screen

Accept/decline process

Admin booking queue

Eligibility filters

Matching shortlist

Customer sitter-approval screen

Boarding feature flag

Output

An admin can match an eligible sitter and obtain both sitter and customer acceptance.

Week 5 — Payments, statuses and notifications

Build

Server-side Razorpay order creation

Checkout

Signature verification

Webhooks

Payment reconciliation

Booking-status history

WhatsApp message outbox

Email templates

Customer and sitter reminders

Refund initiation workflow

Output

A paid booking can move safely from payment pending to confirmed.

Week 6 — Service execution and quality

Build

En-route and arrival actions

Check-in/check-out

Structured updates

Dog-walking report

Sitting report

Boarding-beta report

Media upload

Report review

Customer review

Same-sitter repeat request

Payout ledger

Output

A booking can complete digitally from arrival to customer review.

Week 7 — Safety, PWA and analytics

Build

Incident creation

Emergency-contact interface

Incident timeline

Sitter temporary hold

Corrective actions

PWA manifest

Offline fallback

Draft report persistence

GA4 funnel events

Restricted Clarity setup

Scheduled reminders

Audit logs

Privacy controls

Output

The platform can handle a failed or unsafe booking without returning to unstructured WhatsApp operations.

Week 8 — QA, security and UAT

Test

Customer journey

Sitter journey

Admin journey

Payment success and failure

Duplicate webhooks

Sitter cancellation

Customer cancellation

Replacement

File-upload failure

Weak network

Expired verification

Unapproved boarding property

Cross-account data access

Incident escalation

Refund

Payout calculation

Output

Test report

Defect list

Security review

Pilot-user sign-off

Launch checklist

Days 57–60 — Controlled launch

Activities

Import approved sitters

Import active customers and pets

Confirm permissions

Reconcile test payments

Run production smoke tests

Launch to a limited customer group

Monitor errors and operations closely

Fix launch-blocking issues

Document support procedures

Launch group

Start with:

10–20 existing customers

5–10 reliable sitters

One micro-market

Walking and sitting

Very limited boarding beta

Do not open public acquisition immediately on launch day.

25. Background and scheduled jobs

Use scheduled jobs for:

Upcoming-booking reminders

Overdue report reminders

Payment reconciliation

Expired verification checks

Stale booking cleanup

Payout preparation

Daily operational summaries

Vercel supports scheduled Cron Jobs through Vercel Functions. Its documentation warns that scheduled execution may be duplicated or occasionally missed, so the job logic should be idempotent and reconciliation-based.

Example:

Do not write:

Add ₹100 to sitter payout every time this job runs.

Write:

Create payout for completed booking only when no payout exists.

26. Privacy and security architecture

PetSaathi will process substantial personal and operational information:

Names and phone numbers

Customer addresses

Home-access instructions

Live or recent location

Sitter identity evidence

Boarding-home photographs

Pet medical details

Incident records

India’s DPDP Act establishes the framework for lawful digital-personal-data processing, while the DPDP Rules, 2025 were notified with staged commencement dates. Product design should therefore include purpose-specific notices, access controls, retention rules, user-rights handling and security safeguards from the beginning.

Required controls

Server-side authorization

Role-based access

Private storage

Signed media URLs

Encryption in transit

Strong secret management

Audit history

Database backups

Retention policy

Account correction request

Account deletion request

Incident-response plan

Vendor-access review

Separate marketing consent

Never store in analytics or logs

Full customer address

Door code

Identity-document number

Pet medical narrative

Emergency spending instruction

Payment credentials

Private WhatsApp message body

27. Testing strategy

Unit tests

Test:

Price calculations

Risk rules

Permission rules

Booking transitions

Cancellation calculations

Payout calculations

Integration tests

Test:

Auth and role access

Prisma transactions

Razorpay order creation

Webhook processing

Storage permissions

WhatsApp outbox

Email sending

End-to-end tests

Test:

Customer

Signup → pet → request → sitter approval → payment → report → review

Sitter

Offer → accept → check in → update → report → payout

Admin

Risk review → matching → monitor → refund/payout

Incident

Concern → incident → owner/vet contact → restriction → review

Security tests

Attempt:

Customer A reading Customer B’s pet

Sitter reading an unassigned address

Finance admin accessing identity documents

Expired sitter accepting a booking

Customer changing the booking price in the browser

Duplicate webhook creation

Unapproved host accepting boarding

Normal admin closing a critical incident without authority

28. Feature priorities

P0 — mandatory before launch

Authentication

Roles

Customer and pet profiles

Risk questionnaire

Booking request

Admin matching

Sitter acceptance

Customer sitter approval

Payment

Booking statuses

Sitter service execution

Report cards

Reviews

Incident reporting

Audit logs

Admin dashboard

P1 — include when time permits

Installable PWA

WhatsApp automation

Email notifications

Repeat booking

Sitter payout view

Limited prepaid package

Map travel estimates

Basic analytics

Offline draft report

P2 — postpone

Full live chat

AI matching

Wallet

Automatic subscription engine

Native applications

Product store

Open boarding

Grooming marketplace

Pet taxi

Dynamic pricing

Multi-city automation

29. Phase 4 launch gates

Do not launch until:

### Table 25

| Gate | Requirement |
| --- | --- |
| Customer journey | Completes successfully end to end |
| Sitter journey | Completes successfully end to end |
| Admin journey | Completes successfully end to end |
| Payment reconciliation | 100% in testing |
| Duplicate webhook safety | Confirmed |
| Active sitter permissions | 100% mapped |
| Report-card generation | Working for every active service |
| Boarding restrictions | Enforced server-side |
| Cross-account access defects | Zero |
| Critical security defects | Zero |
| Unresolved critical incidents | Zero |
| Audit logging | Enabled for sensitive actions |
| Error monitoring | Production-ready |
| Backup and restore process | Tested |
| Privacy notice and terms | Published |
| Support escalation | Documented |

30. Phase 4 success targets

### Table 26

| Metric | Recommended target |
| --- | --- |
| Signup completion | 70%+ |
| Pet-profile completion among booking users | 80%+ |
| Successful booking-request creation | 95%+ |
| Payment reconciliation | 100% |
| Correct booking status | 98%+ |
| Completed bookings with report card | 100% |
| Sitter permissions mapped | 100% |
| Incident-to-booking linkage | 100% |
| Sensitive admin actions audited | 100% |
| Customer rating | 4.5+ |
| Sitter no-show target | 0% |
| Critical application errors | 0 unresolved |
| Cross-user data exposure | 0 |

These are PetSaathi’s internal launch targets, not universal software-industry benchmarks.

Final stack recommendation

Use this stack

Frontend

Next.js App Router + TypeScript

UI

Tailwind CSS + shadcn/ui

Backend

Next.js Server Actions and Route Handlers

Modular monolith architecture

Authentication

Supabase Auth

Database

Supabase PostgreSQL

ORM

Prisma

File storage

Private Supabase Storage buckets

Payments

Razorpay Orders + Standard Checkout + webhooks

Messaging

WhatsApp Cloud API

Email

Resend

Maps

One provider selected after Mappls/Google locality testing

Hosting

Vercel

Monitoring

Sentry

Analytics

GA4

Clarity only on non-sensitive pages with strict masking

Final recommendation

Your proposed stack is approved with four refinements:

Use Supabase Auth rather than introducing Auth.js or Clerk alongside Supabase.

Use App Router Route Handlers, rather than designing around legacy Next.js API Routes.

Select only one map provider after testing actual pilot addresses.

Restrict Clarity completely from medical, verification, payment, admin and incident screens.

The 60-day product should be:

A mobile-first, installable PWA that digitises PetSaathi’s validated customer booking, sitter operations, payment, reporting and safety workflows while keeping risk assessment, sitter matching and boarding under human control.

Simple explanation for professor

“Phase 4 will take approximately sixty days and will convert PetSaathi’s manual system into a working Progressive Web App. I will use Next.js and TypeScript for the customer, sitter and admin interfaces, PostgreSQL and Prisma for structured business data, Supabase for authentication and private file storage, Razorpay for prepaid bookings, WhatsApp and email for notifications, and Vercel for deployment. Dog walking and home pet sitting will be active services, while boarding will remain an administrator-controlled beta. Customers will create pet profiles, request services, approve sitters, pay and receive report cards. Sitters will manage assignments, send updates and submit reports. Administrators will control pet-risk review, matching, verification, incidents, refunds and payouts. The system will be developed as one modular application instead of separate native apps or microservices. The product will launch first to a small group in one micro-market after payment, security, privacy and complete booking journeys have passed testing.”

PetSaathi Phase 4 — User Roles and Public Website, End to End 🐾🚀

Executive decision

Your role strategy is correct:

Build only three authenticated MVP experiences: Customer, Sitter and Admin.

Treat Guest as an unauthenticated website visitor rather than a database role. Treat Support Agent as a restricted Admin permission set instead of building a separate application. Vet partners and society representatives should initially use links, forms, phone, email or WhatsApp rather than receiving dedicated dashboards.

The public website must perform three jobs:

Convert pet parents into booking requests.

Convert suitable candidates into sitter applications.

Establish trust without making unsupported claims about safety, verification or emergency protection.

Part 1 — Phase 4 User Roles

Recommended role model

### Table 27

| Role | MVP status | Main purpose |
| --- | --- | --- |
| Guest | Public access, not an authenticated role | Browse services, prices and trust information |
| Customer / Pet Parent | Build now | Create pets, request and manage services |
| Sitter | Build now | Manage assignments and submit service reports |
| Admin | Build now | Operate bookings, sitters, payments and safety |
| Support Agent | Admin permission set | Handle routine booking and support tasks |
| Vet Partner | Manual workflow | Emergency contact and referral support |
| Society Admin | Manual workflow | Society enquiries, onboarding and partnerships |

Important architecture correction

Do not create only one field such as:

role = CUSTOMER

A person may be both:

A customer who owns a pet

An approved sitter

An internal administrator

Use a many-to-many role model:

users

user_roles

customer_profiles

sitter_profiles

admin_permissions

For example:

User: USR-001

Roles:

- CUSTOMER

- SITTER

OWASP recommends enforcing authorization according to defined roles and permissions and applying the principle of least privilege and deny-by-default. The backend must check permissions on every protected action; hiding an admin button in the frontend is not sufficient security.

2. Guest

What a Guest can do

A guest should be able to:

Visit the homepage

Read service descriptions

View indicative prices

Read how PetSaathi works

Read safety and verification explanations

View supported cities and areas

Read FAQs

Open WhatsApp, email or phone contact

Start customer registration

Start a sitter application

Submit a society partnership enquiry

What a Guest cannot do

A guest should not be able to:

View customer records

View exact sitter locations

View private sitter documents

View pet medical information

Submit a confirmed booking

Make a payment without a booking context

View incident records

Access admin or sitter routes

Technical treatment

Guest is simply:

authentication_status = UNAUTHENTICATED

There is no need to insert a “guest user” record for every anonymous website visitor.

Create a user record only when the visitor:

Registers

Starts an application that must be saved

Submits a lead form

Requests a service

Explicitly agrees to the relevant data processing

3. Customer / Pet Parent

Main customer permissions

A customer may:

Create and edit their own profile

Add authorised household members

Create pet profiles

Add care, behaviour and medical information

Create service requests

Review proposed sitters

Pay for bookings

Track bookings

View service updates

View Pet Report Cards

Submit reviews and complaints

Request repeat bookings

Manage communication preferences

Request correction or deletion of account information

Customer restrictions

A customer must not be able to:

See another customer’s pet

See full sitter identity documents

Modify sitter verification records

Change the server-calculated price

Directly assign an unapproved sitter

Change the risk result themselves after admin review

Mark a booking completed

Close an incident

Approve their own refund

Access sitter payout information

4. Sitter

Main sitter permissions

A sitter may:

View their own onboarding status

Complete assigned training

Upload requested verification evidence

Manage availability

View approved services and restrictions

Receive eligible booking offers

Accept or decline offers

View confirmed booking instructions

Mark en route, arrived, started and completed

Send structured updates

Open an incident or emergency alert

Submit a Pet Report Card

View their payout ledger

View permitted performance feedback

Request temporary inactivity

Sitter restrictions

A sitter must not be able to:

Browse the complete customer database

View an exact address before authorised assignment

Accept a service outside their permissions

Change a pet’s risk classification

Mark their own verification as passed

Award themselves a badge

Alter their payout

Remove customer complaints

Resolve their own incident

View another sitter’s internal score

Download unrestricted customer lists

5. Admin

“Admin” should be the only separate internal MVP interface, but it should contain permission groups.

Recommended internal permission groups

### Table 28

| Permission group | Typical access |
| --- | --- |
| Operations | Bookings, matching, schedules and reports |
| Recruitment | Applications and interviews |
| Verification | Restricted sitter evidence |
| Training | Modules, quizzes and assessments |
| Safety | Pet risk, incidents and service restrictions |
| Finance | Payments, refunds and payouts |
| Content | Public pages, FAQs and pricing content |
| Super Admin | Role assignment and system configuration |

Why this matters

A support employee who changes a booking does not automatically need access to:

Government identity documents

Bank details

Boarding-home photographs

Pet medical records unrelated to the booking

Complete incident evidence

Access should be granted according to the task. OWASP specifically identifies excessive access and failure to deny access by default as common broken-access-control risks.

6. Support Agent

MVP treatment

Do not create a fourth application.

Create an Admin account with restricted permissions such as:

BOOKING_READ

BOOKING_UPDATE_BASIC

CUSTOMER_CONTACT

REPORT_READ

REFUND_REQUEST_CREATE

INCIDENT_CREATE

Do not grant:

SITTER_VERIFICATION_APPROVE

PAYOUT_APPROVE

REFUND_APPROVE

INCIDENT_CLOSE

ROLE_MANAGE

This gives PetSaathi a support function without creating a separate role-based product.

7. Vet Partner

MVP treatment

Do not provide a vet dashboard yet.

Store the partner in an internal partner directory containing:

Clinic name

Practitioner or contact name

Telephone number

Address

Opening hours

Emergency availability

Service area

Registration reference where applicable

Last verification date

Partnership status

Vet interaction options

For Phase 4, use:

Click-to-call link

WhatsApp or phone escalation

Referral form

Secure email

Manual incident notes

Uploaded veterinary document or invoice

Customer-facing wording

Use:

Veterinary referral and emergency escalation support

Avoid:

Guaranteed emergency vet support

unless a clinic has formally committed to guaranteed capacity—which is unlikely in all circumstances.

8. Society Admin

MVP treatment

A society representative should use:

Society partnership landing page

Enquiry form

WhatsApp

Email

Scheduled call

Admin-created society record

Store:

Society name

Area

Representative

Contact details

Number of pet households, if voluntarily provided

Services requested

Meeting status

Pilot status

Entry requirements

Approved communication channels

A dedicated society portal should wait until PetSaathi has several active society partnerships with repeated administrative needs.

9. Final MVP Role Matrix

### Table 29

| Action | Guest | Customer | Sitter | Admin |
| --- | --- | --- | --- | --- |
| View public pages | ✓ | ✓ | ✓ | ✓ |
| Create pet profile | — | Own | — | Assisted |
| Request booking | — | Own | — | Assisted |
| Pay for booking | — | Own | — | Record/reconcile |
| Accept booking assignment | — | — | Eligible own offers | Assign |
| Submit service report | — | — | Assigned booking | Review/correct |
| Submit review | — | Own completed booking | — | Moderate |
| Update sitter availability | — | — | Own | Override with reason |
| Approve sitter verification | — | — | — | Restricted admin |
| Change pet risk | — | Submit information | — | Safety admin |
| Manage incident | — | Report/view relevant updates | Report/view assignment | Safety admin |
| Approve refund | — | Request | — | Finance admin |
| View audit records | — | — | — | Authorised admin |

Part 2 — MVP Modules

Your MVP should eventually contain:

Public website

Authentication

Customer and pet profiles

Booking workflow

Sitter matching

Payment

Customer dashboard

Sitter dashboard

Service execution and reports

Reviews and repeat bookings

Admin dashboard

Incident and safety tracking

This response focuses on Module 1: the public website, because it is the entry point for customers, sitters, societies and search engines.

Part 3 — Public Website Purpose

Primary objective

The public website should convert a relevant visitor into one of four actions:

### Table 30

| Visitor | Primary conversion |
| --- | --- |
| Pet parent | Submit a service request or create an account |
| Sitter candidate | Submit a sitter application |
| Society representative | Request a partnership call |
| General visitor | Contact PetSaathi or join a waitlist |

Secondary objective

It should answer the main objections:

Can I trust the sitter?

What checks are completed?

Which service is right for my pet?

What happens if a sitter cancels?

What updates will I receive?

How much does the service cost?

What happens during an emergency?

Is boarding available in my area?

What is the cancellation or refund policy?

How is my address and pet information protected?

4. Recommended Public Navigation

Desktop navigation

Logo

Services

How It Works

Safety

Pricing

Cities

Become a Sitter

FAQ

Contact

[Book Pet Care]

Mobile navigation

Use a compact menu with two persistent actions:

Book Pet Care

WhatsApp Us

Do not place eight competing buttons in the hero section.

Header behaviour

The header should:

Remain compact

Show the active page

Provide visible keyboard focus

Keep the booking CTA clear

Avoid covering content on mobile

Open and close reliably with keyboard and screen readers

WCAG 2.2 provides the current accessibility reference for perceivable, operable, understandable and robust interfaces. Forms, navigation and interactive elements should support keyboard use, visible focus, labels and adequate contrast.

Part 4 — Public Website Pages

Page 1 — Home

Purpose

The homepage should quickly communicate:

What PetSaathi provides

Where it operates

Why customers should trust the process

What the first action is

Which services are currently available

Primary CTA

Book Pet Care

Secondary CTA

Become a Sitter

Optional tertiary link

Partner Your Society

Do not give all three actions equal visual weight. Pet-parent conversion should remain the homepage’s primary purpose.

Page 2 — Services

Purpose

Explain each service clearly and prevent customers from choosing the wrong category.

Recommended service structure

/services

/services/dog-walking

/services/pet-sitting

/services/pet-boarding

Each service page should contain

What the service is

Who it is suitable for

Duration options

What is included

What is not included

Safety requirements

Price starting point

Service area

Booking steps

Cancellation conditions

FAQs

Booking CTA

Dog-walking page

Explain:

30- and 60-minute options

On-leash default

Start and finish confirmation

Photo/update policy

Pee and poop update

Approximate distance where tracked

Pet Report Card

Yellow-risk review for pulling or anxiety

Same-sitter preference, subject to availability

Suggested headline:

Reliable dog walks with service-approved local walkers

Avoid:

The safest dog walkers in India

That is not objectively supportable.

Pet-sitting page

Explain:

Care takes place at the pet parent’s home

Arrival and departure confirmation

Feeding and water

Play and rest

Cat visits

Home privacy

Restricted-room rules

Medication limits

Pet Report Card

Emergency escalation

Suggested headline:

Home pet sitting that follows your pet’s routine

Pet-boarding page

This must be presented as controlled availability.

Suggested headline:

Controlled boarding beta with assessed hosts

State clearly:

Not available in every area

Host and property approval required

Pet compatibility review required

Vaccination or health conditions may apply

Availability confirmed manually

Initial meet-and-greet may be required

Group boarding is not automatically available

Final acceptance follows admin review

Avoid a prominent “Instant Book Boarding” button.

Use:

Check Boarding Availability

Page 3 — Pricing

Purpose

Provide useful transparency without pretending one price applies to every pet, area or time.

Recommended pricing table

### Table 31

| Service | Starting price | Important condition |
| --- | --- | --- |
| 30-minute dog walk | From ₹149 | Final price shown before payment |
| 60-minute dog walk | From ₹299 | Area and pet requirements may affect availability |
| One-hour pet sitting | From ₹299 | Additional pets or tasks may change the price |
| Boarding beta | From ₹999/night | Subject to host, property and pet approval |

Prices remain PetSaathi pilot hypotheses until tested in the selected market.

Pricing page must explain

What “from” means

Service duration

Number of pets included

Additional-pet charges

Peak-time or urgent-booking charges

Package discounts

Taxes, where applicable

Payment timing

Cancellation policy

Refund timing

Failed-service treatment

India’s Consumer Protection (E-Commerce) Rules require transparent consumer-facing conduct and state that cancellation charges should not be imposed on consumers unless similar charges are borne by the business when it cancels unilaterally. PetSaathi’s public cancellation terms should therefore be balanced and disclosed before payment.

Page 4 — How It Works

Purpose

Convert the complex internal workflow into a simple customer journey.

Customer version

Step 1 — Tell us about your pet

Customer creates a pet profile and adds:

Basic details

Behaviour

Health information

Care instructions

Emergency contact

Step 2 — Request a service

Customer selects:

Walking, sitting or controlled boarding

Date

Time

Duration

Address

Instructions

Step 3 — We review and match

PetSaathi reviews:

Service eligibility

Pet requirements

Sitter capability

Availability

Location

Safety conditions

Step 4 — Review your sitter and price

The customer sees:

Sitter first name

Photo

Approved services

Evidence-specific badges

Rating and booking count

Final price

Step 5 — Pay and confirm

Payment is completed through the approved checkout.

Step 6 — Receive service updates

Depending on the service:

Arrival

Start

Photos

Care update

Completion

Report Card

Step 7 — Review or repeat

Customer rates the booking and may request the same sitter again.

Recommended visual text

Choose → Request → Match → Pay → Receive Updates → Review

“Choose” should mean choosing the service, not instantly choosing any sitter in the database.

Page 5 — Safety and Trust

Purpose

This page is essential, but it must describe real controls rather than marketing promises.

Recommended page sections

A. How sitter approval works

Explain:

Application review

Phone or video interview

Identity check

Safety training

Quiz

Practical assessment

Service-specific permission

Probation

Performance monitoring

B. What badges mean

Show exact definitions:

### Table 32

| Badge | Meaning |
| --- | --- |
| Identity Checked | Required identity evidence was reviewed |
| Video Interview Completed | Structured interview was completed |
| Pet Safety Training Passed | Mandatory training and quiz were passed |
| Dog Walking Approved | Walking assessment was passed |
| Boarding Home Assessed | The listed property passed the current assessment |
| Proven Sitter | Defined booking and performance threshold was met |

C. Pet-risk matching

Explain that PetSaathi considers:

Pet size

Pulling

Anxiety

Bite or escape history

Medical requirements

Other-pet compatibility

Sitter experience

Service type

D. Service evidence

Explain:

Check-in and completion status

Structured updates

Pet Report Cards

Booking-linked reviews

Incident records

E. Emergency process

Use:

Emergency escalation process

Explain that PetSaathi may coordinate:

Owner contact

Emergency contact

Veterinary referral

Transport decision

Incident documentation

Do not call it an “emergency guarantee.”

F. Data and privacy

Explain how PetSaathi handles:

Addresses

Access instructions

Pet medical information

Sitter documents

Service photographs

Incident information

The DPDP Rules, 2025 were published by MeitY with an enforcement timeline and staged commencement. The website should provide clear notices describing the personal information collected and its purposes rather than relying on one blanket consent box.

Corrected safety wording

Avoid

Fully verified sitters

100% safe

Zero-risk boarding

Guaranteed emergency help

Police verified, unless the exact applicable check was completed

Background checked, when only ID was reviewed

Every booking insured

Best sitter guaranteed

Use

Identity checked

Interview completed

Safety training passed

Approved for the selected service

Boarding home assessed

Matching reviewed according to pet requirements

Structured service updates

Emergency escalation support

Replacement process, subject to local availability

Page 6 — Become a Sitter

Purpose

Generate suitable applications—not the maximum possible number of low-quality leads.

Page structure

Hero

Earn through responsible pet-care work in your locality

Supporting sentence:

Apply for dog walking, home pet sitting or controlled boarding. Approved providers complete screening, training and service-specific assessment.

CTA:

Start Sitter Application

What the work involves

Explain:

Punctuality

Safe pet handling

Following instructions

Customer privacy

Updates and reports

Incident honesty

Availability commitments

Who can apply

Use broad, fair criteria:

Adults meeting the eligibility requirement

People in active service areas

Applicants with relevant experience or willingness to train

People who can complete screening and practical assessment

Applicants available for repeat services

Do not say only pet owners can apply.

Services available

Dog walking

Home pet sitting

Cat visits

Senior-pet care

Boarding assessment

Emergency backup consideration

Onboarding steps

Apply

→ Phone screening

→ Video interview

→ Verification

→ Training

→ Assessment

→ Trial

→ Probation

Earnings

Show indicative ranges and conditions, not guaranteed income.

Example:

Typical pilot payout for a 30-minute walk: ₹100–₹110, depending on the approved service and booking conditions.

FAQ

Address:

Do I need to own a pet?

Is experience mandatory?

How are payouts made?

Can I choose my availability?

Can I provide boarding?

What documents are required?

Does applying guarantee approval?

Can I work on other platforms?

Job structured data

When PetSaathi publishes a specific, genuine sitter opening with a defined location and application process, Google supports JobPosting structured data for eligible job pages. Do not use it for a vague evergreen marketing page that does not represent an actual opening.

Page 7 — Contact

Purpose

Provide fast assistance and establish a legitimate business identity.

Include:

WhatsApp

Phone

Email

Support hours

Booking support

Safety escalation instructions

City/service-area information

Company or business details required under applicable policy

Grievance/contact person where required

Expected response times as internal service targets

Contact categories

The form should ask:

I need help with:

- New booking

- Existing booking

- Sitter application

- Society partnership

- Payment/refund

- Safety concern

- Other

Safety concerns should receive a more prominent call instruction.

Do not ask someone to submit a life-threatening pet emergency through a normal contact form.

Page 8 — City Pages

Purpose

Help users understand whether PetSaathi operates in their location and support genuine local search discovery.

Suggested URL structure

/cities/bengaluru

/cities/pune

/cities/mumbai

After an area genuinely launches:

/cities/bengaluru/whitefield

Required city-page content

Each live city page should contain unique information:

Active status

Areas currently served

Services available

Boarding status

Starting prices

Local operating hours

Local booking process

Local sitter availability statement

Local partner or support information

Local testimonials, when genuine

Area-specific FAQs

Waitlist option for unsupported areas

Important SEO correction

Do not create fifty near-identical pages by changing only the city or locality name. Google describes multiple substantially similar city or regional pages that funnel users to the same destination as possible doorway abuse. City pages must provide genuine, useful, location-specific content.

Correct launch policy

Only publish an indexable city page when at least one of these is true:

The service is active.

A defined launch date exists.

A genuine waitlist is being collected.

Meaningful local information is available.

Use noindex for thin internal placeholders.

Page 9 — FAQ

Purpose

Resolve high-friction questions before a customer contacts support.

Recommended categories

Booking

How do I request a service?

When is my booking confirmed?

Can I request the same sitter?

Can I make an urgent booking?

Sitters

What checks does PetSaathi complete?

Can I meet the sitter first?

Can a sitter bring someone else?

How are ratings created?

Safety

What information should I provide?

What happens if my pet becomes unwell?

What happens if a sitter cancels?

Is live location always available?

How does boarding approval work?

Payments

When do I pay?

What happens when payment fails?

How do refunds work?

Are package credits refundable?

Privacy

Who sees my address?

Who sees my pet’s medical information?

How are photographs used?

Can I request deletion?

FAQ implementation

Use an accessible accordion:

Question is a proper button

Keyboard operable

Visible focus

Correct expanded state

Content remains available in rendered HTML

No hidden keyword stuffing

FAQ content must be visible to users if it is included in structured data; Google states that structured data should describe the visible content of the page.

Part 5 — Homepage, Section by Section

Section 1 — Hero

Purpose

Tell the visitor what PetSaathi does, where it operates and what to do next.

Proposed headline correction

Your proposed copy is:

“Book verified dog walkers, pet sitters, and safe boarding.”

This contains two potentially overbroad claims:

“Verified”

“Safe boarding”

Recommended headline

Book trusted local dog walking and pet sitting

Supporting text

Get matched with service-approved local caregivers and receive structured updates and a Pet Report Card. Controlled boarding is available in selected areas after compatibility review.

CTA buttons

Primary:

Book Pet Care

Secondary:

Explore Services

Text link:

Become a Sitter

Location indicator

Currently serving: [Primary city/areas]

If the visitor is outside the area:

Join the launch waitlist.

Hero trust strip

Use factual trust points:

Service-specific sitter approval

Prepaid booking confirmation

Structured service updates

Human support and escalation

Avoid placing five-star ratings in the hero until PetSaathi has enough genuine completed-booking reviews.

Section 2 — Problem

Purpose

Show that PetSaathi understands the customer’s real situation.

Suggested heading

Pet care should not depend on last-minute favours

Three customer problems

Busy schedule

Work, travel and daily commitments can make regular pet care difficult.

Trust uncertainty

An informal referral may not explain the caregiver’s experience, reliability or service process.

Lack of visibility

Pet parents need to know whether the service started, what happened and whether anything unusual occurred.

Transition statement

PetSaathi organises booking, sitter matching, payment, service updates and post-service reporting in one managed process.

Section 3 — Services

Suggested layout

Use three service cards.

Dog Walking

30- or 60-minute options

On-leash service

Start and finish confirmation

Pet Report Card

CTA:

View Dog Walking

Home Pet Sitting

Feeding and water

Play and companionship

Home-entry and departure updates

Pet Report Card

CTA:

View Pet Sitting

Controlled Boarding Beta

Assessed host and property

Compatibility review

Structured daily updates

Limited availability

CTA:

Check Availability

Add a clear label:

Beta

Section 4 — Trust

Suggested heading

Trust built through a process—not one badge

Four trust cards

Evidence-specific checks

Profiles show the checks and assessments actually completed.

Service-specific approval

A walker is approved only for defined services, pet types and handling levels.

Pet-compatible matching

Pet requirements, sitter capability, availability and locality are reviewed before confirmation.

Booking-level quality records

Completed bookings generate reports, feedback and sitter-performance data.

Supporting link

See how PetSaathi safety works

Section 5 — How It Works

Use a five-step visual flow:

1. Add your pet

Create the pet profile and care instructions.

2. Request care

Choose service, date, time and location.

3. Review the match

Check the proposed caregiver, badges and final price.

4. Pay and receive care

Confirm online and receive service updates.

5. Get the report

Review the Pet Report Card and book again.

Important wording

Do not say:

Choose any sitter and book instantly.

The MVP uses curated matching.

Section 6 — Pricing

Suggested heading

Clear pilot pricing before payment

Use a concise table:

### Table 33

| Service | Starting from |
| --- | --- |
| 30-minute dog walk | ₹149 |
| 60-minute dog walk | ₹299 |
| One-hour home sitting | ₹299 |
| Controlled boarding beta | ₹999/night |

Supporting text:

Final price and inclusions are shown before payment. Availability and additional charges may depend on area, pet requirements, timing and number of pets.

CTA:

View Full Pricing

Do not hide material charges until the final checkout screen.

Section 7 — Report Card Demonstration

This is missing from your original homepage outline and should be added because it is one of PetSaathi’s clearest differentiators.

Suggested heading

Know what happened during every service

Show a sample card containing:

Actual service time

Food and water

Walk distance

Pee and poop

Mood

Behaviour

Photographs

Sitter note

Concern status

Label it clearly:

Sample Pet Report Card

Do not use a real customer’s pet information without permission.

Section 8 — Reviews and Testimonials

Purpose

Provide genuine social proof.

Rules

Only display testimonials when:

They originate from a real interaction or completed booking.

The customer consented to publication.

Editing does not change the meaning.

The pet photograph has separate publication permission.

The statement is not misleading.

The relationship is disclosed if it came from a free or discounted pilot.

Recommended format

“The walker arrived on time, sent the promised updates and Bruno’s report was easy to understand.”

Then show:

First name or initials

Locality, with consent

Service used

“Completed booking” label where verifiable

Avoid displaying:

4.9 from 500 customers

unless that is genuinely supported.

Section 9 — Become a Sitter CTA

Suggested heading

Responsible with pets and reliable with people?

Supporting text:

Apply for flexible local pet-care work. Selected applicants complete screening, training and a service-specific assessment before receiving bookings.

CTA:

Apply to Become a Sitter

Add:

Application does not guarantee approval.

Section 10 — Society CTA

Suggested heading

Bring organised pet care to your apartment community

Supporting text:

PetSaathi can help societies test local walking and sitting support through a controlled pilot with resident communication, service-approved caregivers and structured reports.

CTA:

Request a Society Pilot

Do not say “society-approved” unless the society has actually approved the stated process.

Section 11 — FAQ Preview

Show five to seven high-conversion questions:

What sitter checks are completed?

When is a booking confirmed?

Can I meet the sitter?

What happens if the sitter cancels?

How does boarding approval work?

What updates will I receive?

How are cancellations and refunds handled?

CTA:

View All FAQs

Section 12 — Final CTA

Suggested copy

Need dependable care for your pet?

Tell us what your pet needs and we will review availability in your area.

Buttons:

Book Pet Care

WhatsApp PetSaathi

Section 13 — Footer

Recommended footer groups

Services

Dog Walking

Pet Sitting

Boarding Beta

Pricing

Company

About

How It Works

Safety

Cities

Contact

Join

Become a Sitter

Society Partnerships

Support

FAQ

Cancellation and Refund Policy

Incident and Emergency Information

Grievance Contact

Legal

Terms of Service

Privacy Notice

Sitter Terms

Cookie Preferences

Accessibility

Data Request

Company information

Include applicable business details, contact information and support hours.

Part 6 — Public Website Conversion Flows

Pet-parent flow

Google / Instagram / Referral

↓

Homepage or city/service page

↓

Service and trust information

↓

Book Pet Care

↓

Signup

↓

Pet profile

↓

Booking request

Sitter flow

Social post / college / referral

↓

Become a Sitter page

↓

Read requirements and payout range

↓

Application form

↓

CRM onboarding pipeline

Society flow

Society outreach / local search

↓

Society CTA

↓

Partnership enquiry form

↓

Admin follow-up

↓

Manual meeting and pilot proposal

Contact flow

Contact or FAQ

↓

Select issue type

↓

WhatsApp / phone / email / form

↓

Support ticket or lead record

Every form submission should create a structured CRM record rather than only sending an untracked email.

Part 7 — URL and Information Architecture

Recommended public routes

/

/services

/services/dog-walking

/services/pet-sitting

/services/pet-boarding

/pricing

/how-it-works

/safety

/become-a-sitter

/society-partnerships

/cities

/cities/[city]

/cities/[city]/[area]

/faq

/contact

/about

/privacy

/terms

/cancellation-refund-policy

Private routes

/customer/*

/sitter/*

/admin/*

Private application routes should generally be excluded from search indexing.

Next.js supports route-level metadata, generated sitemaps and robots.txt through App Router metadata APIs and file conventions. Use these to provide unique titles and descriptions, expose public pages in the sitemap and disallow or noindex private application routes.

Part 8 — SEO Strategy

1. Write pages for users first

Google recommends helpful, reliable, people-first content and advises using the language people would genuinely use to find the page in titles, headings and descriptive content.

For example, a Whitefield page should naturally answer:

Is dog walking available in Whitefield?

Which localities are covered?

What are the working hours?

What does a walk include?

What is the starting price?

How is a sitter selected?

Is boarding available?

How can residents request a society pilot?

It should not repeat “dog walker Whitefield” unnaturally twenty times.

2. Page metadata

Every public page should have:

Unique title

Unique meta description

Canonical URL

Open Graph image

Social description

Appropriate robots directive

Example:

Title:

Dog Walking in Whitefield, Bengaluru | PetSaathi

Description:

Request local dog walking in selected Whitefield areas with

service-approved walkers, structured updates and a Pet Report Card.

3. Structured data

Potentially use:

Organization on the homepage

LocalBusiness where PetSaathi qualifies and the displayed information is accurate

BreadcrumbList on service and city pages

JobPosting for genuine sitter vacancies

Google states that Organization structured data can help it understand and distinguish a business, while LocalBusiness data can provide details such as business information and opening hours. Structured data must match visible page content and should be tested before release.

Do not insert fabricated review ratings into structured data.

4. Google Business Profile

PetSaathi may be a service-area business rather than a storefront.

Google permits businesses serving customers at their locations to specify service areas. When customers are not served at the business address, Google advises removing the public address and displaying only the genuine service areas.

Do not publish a residential founder address as a customer-facing office unless customers genuinely visit and the listing complies with Google’s business-representation requirements.

Part 9 — Mobile, Performance and Accessibility

Mobile-first requirements

Design for common phone widths before desktop.

Ensure:

Buttons are easy to tap

Forms use suitable input types

No horizontal scrolling

Pricing is readable

Sticky CTAs do not hide content

WhatsApp links open correctly

Images are responsive

Navigation works with one hand

Form progress is preserved

Error messages appear near the relevant fields

Google uses mobile-first indexing, so the mobile version should contain the same essential content and metadata as the desktop experience.

Performance

Monitor Core Web Vitals, which focus on loading, responsiveness and visual stability. Keep the public website lightweight by optimising images, limiting third-party scripts and avoiding large animations above the fold.

Accessibility acceptance criteria

Correct heading order

Form labels

Error summaries

Keyboard-operable navigation

Visible focus states

Descriptive link text

Alternative text for meaningful images

Captions for instructional videos

Sufficient contrast

No information communicated only by colour

Accessible accordion behaviour

Large enough touch targets

Part 10 — Analytics

Public website events

Track:

homepage_view

service_page_view

city_page_view

pricing_view

book_pet_care_clicked

whatsapp_clicked

signup_started

sitter_application_started

sitter_application_submitted

society_enquiry_started

society_enquiry_submitted

faq_opened

Conversion funnels

Customer

Landing page

→ Booking CTA

→ Signup

→ Pet profile

→ Booking request

Sitter

Become Sitter page

→ Application started

→ Application submitted

→ Phone screen

Society

Society page

→ Enquiry started

→ Enquiry submitted

→ Meeting scheduled

Do not send to analytics:

Customer names

Telephone numbers

Email addresses

Full addresses

Pet medical information

Identity-document information

Door or access instructions

Part 11 — Public Website Content Ownership

Assign an owner for every content type.

### Table 34

| Content | Owner |
| --- | --- |
| Service inclusions | Operations |
| Safety and verification claims | Safety/verification lead |
| Pricing | Finance/operations |
| Refund policy | Operations and legal review |
| Privacy notice | Privacy/legal owner |
| Testimonials | Marketing with consent record |
| City availability | City operations |
| Sitter payouts | Supply operations |
| Emergency wording | Safety lead and veterinary reviewer |

This prevents marketing content from promising something operations cannot deliver.

Part 12 — Public Website Definition of Done

The public module is ready only when:

Content

Every service has clear inclusions and exclusions.

Boarding is visibly labelled controlled beta.

Prices explain “starting from.”

Verification badges have exact definitions.

Emergency language does not imply guaranteed medical care.

Testimonials are genuine and authorised.

Policies are published.

City availability is accurate.

Functionality

All CTAs work.

Customer signup works.

Sitter application reaches the CRM.

Society enquiry reaches the CRM.

WhatsApp, email and phone links work.

Forms validate correctly.

Error states are understandable.

Mobile navigation works.

Analytics events work.

SEO

Unique metadata exists.

Sitemap includes public pages.

Private dashboards are not indexable.

Canonical URLs are correct.

Structured data validates.

City pages contain unique useful content.

Broken links are removed.

Security and privacy

Admin pages require authorization.

Sensitive fields are not sent to analytics.

Forms include purpose-specific notices.

Spam protection and rate limits exist.

Submitted data uses HTTPS.

Marketing consent is optional and separate.

Data-retention responsibility is defined.

Accessibility and quality

Keyboard journey works.

Contrast passes the selected WCAG target.

Images have appropriate alt text.

Forms have labels and errors.

Core pages are tested on lower-end mobile devices.

Critical Core Web Vitals problems are addressed.

Corrected Homepage Structure

Header

↓

Hero

↓

Customer problem

↓

Service cards

↓

Trust process

↓

How it works

↓

Starting prices

↓

Sample Pet Report Card

↓

Customer testimonials

↓

Become a Sitter CTA

↓

Society partnership CTA

↓

FAQ preview

↓

Final booking CTA

↓

Footer and policies

Final Phase 4 Role and Website Recommendation

PetSaathi should build:

One mobile-first public website/PWA with three authenticated role experiences: Customer, Sitter and Admin. Guests use the public website without an account. Support is handled through restricted Admin permissions, while veterinary and society partners remain manual workflows during the MVP.

The public website should:

Explain walking, sitting and controlled boarding

Display transparent starting prices

Describe the exact trust process

Convert pet parents into bookings

Convert suitable applicants into sitter applications

Generate society enquiries

Publish useful city-specific pages

Provide clear contact and policy information

Avoid vague claims such as “fully verified,” “completely safe” or “guaranteed emergency support”

Simple explanation for professor

“Phase 4 will use only three authenticated roles: Customer, Sitter and Admin. Guests will browse the public website without a stored account. Support employees will use restricted admin permissions rather than a separate product, while veterinarians and society representatives will interact through links, forms, phone or WhatsApp. The public website will include the homepage, service pages, pricing, how-it-works, safety, sitter recruitment, city pages, contact and FAQs. Its main purpose is to convert visitors into customer bookings, sitter applications or society enquiries. The homepage will explain the customer problem, active services, PetSaathi’s trust process, booking steps, starting prices, sample report card and genuine testimonials. Boarding will be presented only as a controlled beta. Verification and emergency statements will describe the exact checks and support actually provided. The website will be mobile-first, accessible, search-friendly and connected directly to the PetSaathi CRM and booking workflow.”

PetSaathi Phase 4 — Customer Dashboard, End to End 🐾🚀

Core objective

The Customer Dashboard should let a pet parent complete the entire service journey digitally:

Create account → add pet → request care → review sitter → pay → track service → receive report → review → book again

The dashboard should not behave like an unrestricted marketplace where a customer instantly books any available person. PetSaathi’s first MVP should remain a managed marketplace:

The customer requests a service.

PetSaathi checks pet risk and sitter eligibility.

An eligible sitter accepts the assignment.

The customer reviews the proposed sitter.

Payment confirms the booking.

1. What the customer can do

### Table 35

| Customer capability | MVP treatment |
| --- | --- |
| Sign up and log in | Required |
| Create and update pet profiles | Required |
| Choose a service | Required |
| Select date and time | Required |
| Add service location | Required |
| See estimated price | Required |
| Submit booking request | Required |
| Review proposed sitter | Required |
| Pay online | Required |
| Track booking status | Required |
| Receive service updates | Required |
| View Pet Report Card | Required |
| Submit review | Required |
| Request the same sitter again | Required |
| Manage cancellations | Required |
| View payment/refund status | Required |
| Report a problem | Required |

2. Recommended Customer Dashboard Navigation

Mobile navigation

Use five primary navigation items:

Home

Pets

Book

Bookings

Profile

Reports, payments, reviews and support can appear inside the relevant booking or profile screens.

Desktop navigation

Dashboard

My Pets

Book a Service

My Bookings

Reports

Payments

Support

Profile & Settings

Avoid exposing every database function as a navigation item. The customer should see tasks, not internal system architecture.

3. Customer Dashboard Home Screen

The dashboard landing page should answer:

What is my next booking?

Does anything require my action?

How quickly can I book again?

Is my pet profile complete?

Is there an unresolved payment, report or complaint?

Recommended home-screen sections

Upcoming booking

Display:

Pet

Service

Date and time

Assigned or proposed sitter

Current status

Payment status

Main next action

Example:

Bruno’s 30-minute walkTomorrow, 7:30 AMSitter: RiyaStatus: ConfirmedPayment: Paid

Action required

Examples:

Complete pet-risk information

Review proposed sitter

Complete payment

Confirm address

Review completed service

Respond to an incident follow-up

Quick actions

Book a walk

Book pet sitting

Repeat last booking

Add another pet

Contact support

Recent report cards

Show the latest two or three completed service reports.

Saved pets

Show:

Pet photograph

Name

Profile-completion state

Risk-review state

Vaccination-information status where relevant

4. Complete Customer MVP Flow

Signup / Login

↓

Create or select pet profile

↓

Choose service

↓

Select date, time and duration

↓

Add or select service address

↓

Add booking instructions

↓

Review estimated price

↓

Submit booking request

↓

Pet risk and availability review

↓

Eligible sitter accepts

↓

Customer reviews proposed sitter

↓

Customer approves sitter

↓

Online payment

↓

Server verifies payment

↓

Booking confirmed

↓

Service status and updates

↓

Service completed

↓

Pet Report Card delivered

↓

Customer review

↓

Repeat booking

Step 1 — Signup and Login

Recommended MVP authentication

Use mobile number and OTP as the primary customer login method.

Optional alternatives:

Email OTP

Email magic link

Google login later

Supabase Auth supports one-time-password login, including phone OTP. Phone delivery requires a supported messaging provider to be configured.

Signup fields

Collect only:

Full name

Mobile number

Email, optional initially

City

Primary locality

Terms acceptance

Privacy-notice acknowledgement

Do not force the customer to enter:

Full address

Pet medical history

Emergency contacts

Payment details

during basic account creation.

These details should be requested when they are relevant to a booking.

Signup flow

Enter mobile number

↓

Send OTP

↓

Verify OTP

↓

New user?

├── Yes → Complete basic profile

└── No → Open dashboard

Required controls

OTP expiration

Resend timer

Attempt limits

Rate limits by phone number and IP

Generic error messages that do not expose account existence

Secure session management

Logout from current device

Admin-assisted account recovery

Customer-visible messages

Successful OTP

Mobile number verified. Let us create your pet’s profile.

Invalid OTP

The code is incorrect or has expired. Please request a new code.

Too many attempts

Too many attempts were made. Please wait before trying again.

Errors should be displayed in text and placed near the relevant field. WCAG guidance requires form controls to have clear labels and unsuccessful submissions to identify the error rather than simply redisplaying the form without explanation.

Step 2 — Create a Pet Profile

Purpose

The pet profile gives PetSaathi the information required to:

Understand care requirements

Perform preliminary risk review

Match a suitable sitter

Prepare emergency information

Avoid repeatedly asking the same questions

A customer should be allowed to save more than one pet.

Pet profile sections

A. Basic information

### Table 36

| Field | Required? |
| --- | --- |
| Pet name | Yes |
| Species | Yes |
| Breed or mixed breed | Yes |
| Age or date of birth | Yes |
| Sex | Yes |
| Approximate weight | Required for dogs |
| Photograph | Recommended |
| Neutered/spayed status | Recommended |

B. Behaviour

Ask:

Is your pet comfortable with unfamiliar people?

Has your pet ever bitten or seriously injured anyone?

Does your dog pull strongly?

Does your pet attempt to escape?

Does your pet become anxious when separated?

Is your pet comfortable with dogs?

Is your pet comfortable with cats?

Does your pet guard food, toys or resting areas?

Is your pet afraid of traffic, lifts, children or loud noises?

C. Medical and health information

Collect:

Known medical conditions

Allergies

Current medication

Mobility limitations

Seizure history

Emergency history

Vaccination-information status

Regular veterinarian

Emergency clinic

D. Routine and care instructions

Collect:

Food and quantity

Water instructions

Toilet routine

Walking equipment

Approved treats

Restricted food

Normal walking route

Play preferences

Sleeping or resting routine

Important commands

E. Emergency contacts

Collect:

Primary pet parent

Secondary authorised person

Telephone number

Relationship

Treatment-authorisation status

Pet-profile completion states

Use:

INCOMPLETE

BASIC_COMPLETE

CARE_DETAILS_COMPLETE

RISK_REVIEW_REQUIRED

READY_FOR_BOOKING

Do not prevent the customer from saving a partially completed profile.

Instead, show:

Pet profile 70% complete. Add behaviour and emergency information before requesting care.

Pet-risk state

Every newly created pet should start as:

UNASSESSED

Possible service-specific outcomes:

GREEN

YELLOW

RED

A pet should not be permanently labelled with only one universal risk. A dog may be Green for home sitting but Yellow for walking and Red for shared boarding.

Step 3 — Choose a Service

Active MVP services

Dog walking

Options:

30 minutes

60 minutes

One-time

Repeat request

Same-sitter preference

Home pet sitting

Options:

Short home visit

One-hour sitting

Multiple daily visits

Cat visit

Travel-period sitting

Controlled boarding beta

Options:

Check availability

Daycare beta

Overnight beta where approved

Boarding should never appear as automatic instant booking.

Use:

Request Boarding Review

rather than:

Book Boarding Now

Service-card content

Each service card should explain:

Service duration

What is included

Starting price

Eligibility conditions

Updates provided

Whether manual review is required

Example:

30-minute dog walk

On-leash walk with arrival confirmation, service updates and a Pet Report Card. Suitable sitter availability and pet-handling requirements will be reviewed before confirmation.

Step 4 — Select Date, Time and Duration

Booking-time inputs

The customer selects:

Date

Preferred start time

Acceptable time window

Duration

One-time or repeat request

Urgency

Better than one fixed time

Instead of asking only:

7:00 AM

allow:

Preferred time: 7:00 AMAcceptable window: 6:45–7:30 AM

This gives operations enough flexibility to match a reliable local sitter.

Scheduling rules

The interface should prevent:

Booking in the past

Invalid duration

Requests outside service hours

Same-day booking after the operational cutoff

Boarding requests shorter than the allowed minimum

Recurring bookings without an end or review date

Availability wording

Before sitter acceptance, show:

Requested time — availability not yet confirmed.

Do not display:

Available

solely because the calendar slot is open. An eligible sitter must still accept.

Step 5 — Add or Select Address

Address fields

Collect:

Flat or house number

Building or society

Street or locality

City

PIN code

Landmark

Map pin

Building-entry notes

Lift, gate or security instructions

Address categories

Allow:

HOME

WORK

FAMILY_HOME

OTHER

Privacy rule

Before matching, an unassigned sitter should see only:

Approximate locality

Estimated travel distance

Building type where operationally relevant

The complete address should be released only after:

Sitter accepts

Customer approves

Booking reaches the required confirmation stage

The customer should always access only their own pets, addresses, bookings and reports. The backend must enforce ownership on every request and should deny access by default rather than relying on hidden frontend controls.

Step 6 — Add Booking-Specific Instructions

Even when the pet profile is complete, every booking should allow temporary instructions.

Examples:

Use the red harness today.

Avoid the main road because of construction.

Feed at 6:30 PM.

The pet is recovering from a minor procedure.

Security will issue a visitor pass.

Call before entering.

Important distinction

Pet-profile instruction

A long-term fact:

Bruno is allergic to chicken.

Booking instruction

A temporary requirement:

Use the blue harness today.

Do not overwrite permanent pet information with temporary booking notes.

Step 7 — View Estimated Price

Price calculation

The estimate may use:

Base service price

+ duration adjustment

+ additional pet charge

+ peak-time charge

+ urgency charge

+ service-area adjustment

− package or promotional discount

= estimated customer price

Customer price breakdown

Example:

### Table 37

| Item | Amount |
| --- | --- |
| 30-minute dog walk | ₹149 |
| Additional pet | ₹50 |
| Promotion | −₹20 |
| Estimated total | ₹179 |

Use the words:

Estimated total

until risk review, sitter availability and operational conditions are confirmed.

Final-price rule

The final amount should be calculated on the server.

The customer must not be able to alter:

Service price

Discount

Tax

Additional-pet charge

Sitter payout

Final payable amount

by editing the browser request.

Step 8 — Review Booking Summary

Before submission, display one final review screen.

Summary sections

Pet

Name

Species

Relevant risk information

Special instructions

Service

Service type

Duration

Date and time window

Location

Society/locality

Full address hidden only where appropriate from screenshots or shared summaries

Pricing

Estimated price

Possible reasons for adjustment

Policies

Cancellation rule

Payment timing

Boarding conditions where relevant

Emergency limitations

Data use

Primary action

Submit Booking Request

Do not use:

Confirm Booking

because no sitter or payment has yet been confirmed.

Step 9 — Submit Booking Request

Initial booking state

After submission:

REQUESTED

The customer should see:

Your request has been received. PetSaathi is reviewing your pet’s requirements, sitter availability and service location.

System actions

The backend should:

Create a booking ID.

Save a price snapshot.

Save a pet-risk snapshot.

Save booking instructions.

Create a booking-status history entry.

Notify operations.

Begin sitter eligibility filtering.

Send customer acknowledgement.

Booking ID example

BK-2026-00128

Display it in:

Customer dashboard

Customer emails

WhatsApp messages

Payment record

Sitter assignment

Report card

Incident record

Step 10 — Risk and Operations Review

Possible booking states

REQUESTED

↓

RISK_REVIEW

↓

MATCHING

Green request

May move directly into sitter matching.

Yellow request

May require:

Admin review

Experienced sitter

Meet-and-greet

Additional instructions

Equipment confirmation

Individual rather than group care

Red request

Requires manual decision:

Modify service

Request veterinary or behaviour information

Specialist caregiver

Waitlist

Decline

The customer should see a neutral message:

This request needs a short manual review because of the care information provided. Our team will contact you if more information is needed.

Do not show alarming internal labels such as:

RED-RISK PET

on the customer-facing interface.

Step 11 — Sitter Matching and Acceptance

Matching sequence

System applies hard filters

↓

Admin reviews eligible shortlist

↓

Offer sent to sitter

↓

Sitter accepts or declines

↓

Customer receives sitter proposal

Hard filters

A sitter is eligible only when:

Operational status permits bookings.

Required service permission exists.

Pet species and dog-size permissions match.

Pet-risk compatibility is sufficient.

Training and verification are current.

Sitter is available.

No booking conflict exists.

Travel time is acceptable.

Boarding-property approval is active where applicable.

Sitter accepts the payout and assignment.

Customer state during matching

Display:

Finding a suitable sitter

Show:

Request received time

Expected response target

Support contact

Option to cancel before a sitter is proposed, according to policy

Do not continuously expose rejected sitter candidates or internal match scores.

Step 12 — Review the Proposed Sitter

Once an eligible sitter accepts, the booking moves to:

SITTER_PROPOSED

or:

CUSTOMER_APPROVAL_PENDING

Customer-visible sitter profile

Show:

First name

Profile photograph

Approximate locality

Short experience summary

Approved service

Approved pet-size category

Evidence-specific badges

Completed booking count

Rating and review count

Languages

Repeat-booking availability

Example:

RiyaApproved for medium- and large-dog walking18 completed PetSaathi bookings4.8/5 from 14 reviews

✅ Identity Checked✅ Video Interview Completed✅ Pet Safety Training Passed✅ Dog Walking Assessment Passed

Do not show

Complete legal name unnecessarily

Personal address

Identity-document copy

Background-check document

Personal bank information

Internal scorecard

Other customers’ comments that were not approved for publication

Personal phone number before operational need

Customer options

Approve sitter

Ask PetSaathi a question

Request another match

Cancel request

Repeated match rejection may require an admin call rather than unlimited automated rematching.

Step 13 — Payment

After the customer approves the sitter:

PAYMENT_PENDING

Correct payment sequence

Server calculates final price

↓

Server creates Razorpay order

↓

Customer opens checkout

↓

Customer completes payment

↓

Server verifies returned signature

↓

Webhook confirms payment state

↓

Payment becomes CAPTURED

↓

Booking becomes CONFIRMED

Razorpay recommends creating an order on the server, passing its order_id to Checkout, verifying the returned payment signature and checking the payment or order state before delivering services.

Webhooks send payment-event notifications to the server. Because webhook payloads represent the entity at the time of the event and payment states may change quickly, webhook handling should be idempotent and the backend should reconcile the latest state rather than depend on arrival order.

Payment screen

Show:

Booking ID

Pet

Service

Date/time

Sitter

Final price

Cancellation summary

Payment button

Secure-payment notice

Payment outcomes

Success

Payment received. Your booking is confirmed.

Pending

Your payment is being verified. Do not make another payment yet.

Failed

Payment was not completed. Your booking is not confirmed.

Duplicate attempt

The backend should detect whether the same order is already paid and prevent duplicate confirmation.

Critical booking rule

The browser success callback must not independently mark the booking confirmed.

Only the server may transition:

PAYMENT_PENDING → CONFIRMED

after validating the payment.

Step 14 — Booking Confirmation

The customer should receive:

Booking ID

Pet name

Service

Confirmed time

Sitter first name

Service address

Payment receipt

Preparation checklist

Cancellation rule

Support number

Emergency instructions

Preparation checklist example

For dog walking:

Keep leash and harness ready.

Ensure the sitter can access the building.

Inform PetSaathi of any health or behaviour change.

Do not hand the pet to an unrecognised substitute.

Keep the emergency contact available.

Step 15 — Track Booking Status

Customer-visible status timeline

Request received

Risk review

Matching in progress

Sitter proposed

Payment pending

Confirmed

Sitter travelling

Sitter arrived

Service in progress

Service completed

Report ready

Closed

Internal status model

DRAFT

REQUESTED

RISK_REVIEW

MATCHING

SITTER_PROPOSED

CUSTOMER_APPROVAL_PENDING

PAYMENT_PENDING

CONFIRMED

SITTER_EN_ROUTE

SITTER_ARRIVED

IN_PROGRESS

REPORT_PENDING

COMPLETED

CLOSED

Alternative outcomes:

DECLINED

CUSTOMER_CANCELLED

SITTER_CANCELLED

REPLACEMENT_REQUIRED

NO_SHOW

INCIDENT_HOLD

Payment and refund status should remain separate from booking status.

Step 16 — View the Assigned Sitter

After confirmation, the customer can view:

Sitter profile summary

Approved service

Relevant badges

Service start time

Contact method

Support number

Communication model

For the first MVP, prefer:

Structured booking updates

Admin-assisted WhatsApp

Click-to-call where permitted

Emergency-support button

Do not expose unrestricted customer and sitter contact information before booking confirmation.

Step 17 — Service-Day Experience

Before service

The customer receives:

Reminder

Sitter confirmation

Preparation checklist

Option to report changed pet conditions

During service

Possible updates:

Sitter en route

Sitter arrived

Service started

Photo update

Food/water update

Walk progress

Concern raised

Service completed

Customer dashboard card

Example:

Service in progressBruno — 30-minute dog walkStarted: 7:32 AMSitter: RiyaNext update: Completion report

Do not promise real-time GPS unless that functionality is actually active for the booking.

Step 18 — Service Completion

When the sitter finishes:

IN_PROGRESS → REPORT_PENDING

The customer should initially see:

Service completed. Your Pet Report Card is being prepared.

The service should not become fully closed before:

Sitter checkout

Report submission

Concern review

Incident check

Required admin review

Step 19 — Pet Report Card

Customer report-card fields

General

Pet name

Service

Date

Scheduled time

Actual start and end

Sitter

Duration

Dog walk

Approximate distance

Water

Pee

Poop

Waste collected

Mood

Behaviour

Photos

Sitter note

Concern

Home sitting

Food

Water

Toilet/litter

Play

Rest

Medication task

Home secured

Photos/videos

Mood

Sitter note

Concern

Boarding beta

Feeding

Water

Activity

Rest

Toilet

Other-pet interaction

Health observation

Photos/video

Pickup status

Concern

Report statuses

DRAFT

SUBMITTED

ADMIN_REVIEW_REQUIRED

DELIVERED

AMENDED

Any material amendment after delivery should preserve:

Previous version

Updated version

Editor

Timestamp

Reason

Concern handling

If the sitter selects:

CONCERN = YES

the system should require:

Concern type

Description

Time

Immediate action

Media where appropriate

Admin notification

A serious concern should open an incident process rather than being hidden inside the report card.

Step 20 — Submit a Review

After report delivery, the customer may submit:

Overall rating

Punctuality rating

Communication rating

Pet-handling rating

Report-quality rating

Written feedback

Same-sitter preference

Private complaint

Publication consent

Review rule

A review should require:

Completed booking

Authorised customer

One review per booking

No duplicate review

Moderation state

Separate review from complaint

A customer may:

Give five stars and mention a small private concern.

Give three stars without reporting a safety incident.

Open a serious complaint without publishing a public review.

Use separate records for:

REVIEW

COMPLAINT

INCIDENT

Step 21 — Book Again

Repeat-booking options

The customer may choose:

Same service

Same pet

Same duration

Same address

Same sitter preferred

New date and time

Important wording

Use:

Request the same sitter

not:

Guaranteed same sitter

The system must recheck:

Sitter availability

Service permission

Pet-risk compatibility

Verification validity

Travel conflict

Current operational status

Repeat-booking screen

Show:

Rebook Bruno’s 30-minute walk with Riya preferred.

Allow the customer to edit:

Date

Time

Duration

Address

Instructions

Do not silently reuse old medical or safety assumptions without asking:

Has anything changed in your pet’s health or behaviour?

5. Customer Booking Status Table

### Table 38

| Status | Customer meaning | Available action |
| --- | --- | --- |
| Draft | Request not submitted | Continue or delete |
| Requested | PetSaathi received request | View or cancel |
| Risk review | Care details under review | Add requested information |
| Matching | Suitable sitter being identified | Wait or contact support |
| Sitter proposed | Caregiver is ready for review | Approve or request change |
| Payment pending | Sitter approved, payment required | Pay |
| Confirmed | Booking fully scheduled | View details |
| Sitter en route | Sitter travelling | Track update/contact support |
| In progress | Service underway | View updates |
| Report pending | Service ended; report being prepared | Wait |
| Completed | Report available | View and review |
| Incident hold | Safety or service issue under review | View authorised updates |
| Cancelled | Booking cancelled | View refund status |
| Closed | All actions completed | Rebook |

6. Cancellation, Replacement and Refund Flows

Customer cancellation

The customer should see before cancelling:

Applicable cancellation rule

Refund estimate

Package-credit treatment

Expected processing time

Require:

Cancellation reason

Confirmation

Timestamp

Sitter cancellation

The booking becomes:

SITTER_CANCELLED

then:

REPLACEMENT_REQUIRED

The customer should receive:

Immediate notification

Replacement search status

Option to accept replacement

Option to cancel for refund according to policy

No replacement available

Offer:

Full refund

Service credit, only if customer chooses

Rescheduled service

Alternative time

Do not silently substitute a sitter.

7. Customer Support and Problem Reporting

Every active booking should provide:

Contact support

Report delay

Sitter has not arrived

Pet condition changed

Payment problem

Safety concern

Request cancellation

Critical concern button

Use:

Urgent safety concern

It should display:

PetSaathi call number

Owner’s saved veterinarian

Emergency clinic

Booking ID

Incident-report action

A web form should not be the only route for an immediate veterinary emergency.

8. Customer Dashboard Data Model

Core tables

users

customer_profiles

addresses

pets

pet_medical_profiles

pet_emergency_contacts

pet_risk_assessments

bookings

booking_instructions

booking_assignments

booking_status_history

payments

refunds

booking_reports

report_media

reviews

complaints

incidents

notification_deliveries

Important relationships

Customer

├── Addresses

├── Pets

│ ├── Medical profile

│ ├── Emergency contacts

│ └── Risk assessments

└── Bookings

├── Assignment

├── Payment

├── Status history

├── Report card

├── Review

└── Incident

9. Essential Backend Rules

Customer ownership

A customer may read or change a pet only when:

pet.customer_id = authenticated_customer.id

Booking creation

A request requires:

Active customer

Owned pet

Valid service

Valid date/time

Valid address

Required instructions

Server-generated estimate

Payment confirmation

A booking becomes confirmed only when:

payment.status = CAPTURED

AND

payment.amount = booking.final_amount

AND

payment.signature_valid = true

Review creation

A review requires:

booking.status IN (COMPLETED, CLOSED)

AND

booking.customer_id = authenticated_customer.id

AND

no_existing_review = true

Report access

The customer may access only the report linked to their booking.

10. Security and Privacy Requirements

The Customer Dashboard contains:

Personal contact details

Exact home addresses

Building-entry instructions

Pet medical and behavioural information

Emergency contacts

Service photographs

Payment records

Incident records

These records require role-based access and purpose-limited processing. India’s DPDP Act establishes the framework for digital personal-data processing, and the final DPDP Rules, 2025 were published in November 2025 with staged commencement.

Mandatory controls

HTTPS

Secure sessions

OTP rate limiting

Server-side authorization

Deny-by-default access

Private media storage

Expiring signed media links

Audit logs for sensitive actions

Data-retention policy

Account-correction process

Account-deletion request

Separate marketing consent

No sensitive information in analytics

No complete addresses in error-monitoring logs

11. Accessibility and Mobile UX

All customer forms should include:

Visible labels

Helpful instructions

Text-based error messages

Keyboard access

Visible focus

Proper field grouping

Step indicator

Back button

Draft saving

Large touch targets

No information communicated only through colour

WCAG 2.2 is the current W3C accessibility standard and applies across desktop and mobile web experiences. Its guidance includes labelled controls, understandable instructions and identifiable form errors.

Multi-step form pattern

Show:

Step 2 of 6 — Choose a service

Recommended booking steps:

Pet

Service

Schedule

Location

Instructions

Review

Allow customers to move backward without losing information.

12. Notifications

Customer notification events

### Table 39

| Event | In-app | WhatsApp/email |
| --- | --- | --- |
| Booking request received | Yes | Yes |
| More information needed | Yes | Yes |
| Sitter proposed | Yes | Yes |
| Payment required | Yes | Yes |
| Payment confirmed | Yes | Yes |
| Service reminder | Yes | Yes |
| Sitter en route | Yes | Optional |
| Sitter arrived | Yes | Optional |
| Service started | Yes | Optional |
| Report ready | Yes | Yes |
| Review requested | Yes | Yes |
| Replacement required | Yes | Yes/call |
| Incident update | Yes | Call plus message |

The database must remain the source of truth. A failed WhatsApp notification must not change the booking itself.

13. Customer Analytics Funnel

Track anonymised product events such as:

signup_started

signup_completed

pet_profile_started

pet_profile_completed

service_selected

schedule_selected

address_added

booking_review_viewed

booking_request_submitted

sitter_proposal_viewed

sitter_approved

payment_started

payment_completed

service_completed

report_viewed

review_submitted

repeat_booking_requested

Do not send:

Name

Phone number

Email

Exact address

Pet medical details

Access instructions

Emergency contacts

to analytics platforms.

14. Failure and Edge Cases

The MVP must test more than the ideal flow.

Authentication

OTP delayed

Incorrect OTP

Number already associated with another account

Session expires during booking

Pet profile

Pet photograph upload fails

Required medical question unanswered

Customer changes information after match review

Multiple household members edit the same pet

Booking

Requested time becomes unavailable

No eligible sitter exists

Sitter accepts, then withdraws

Customer rejects proposed sitter

Customer submits duplicate request

Price changes after risk review

Payment

Payment succeeds but browser closes

Payment remains authorised but not captured

Webhook arrives twice

Webhook arrives out of order

Customer pays twice

Payment fails after sitter acceptance

Service

Sitter late

Sitter no-show

Customer unavailable at handover

Wrong address

Access denied by society security

Pet condition differs from profile

Connectivity lost during report submission

Completion

Report missing

Report contains concern

Media upload fails

Customer disputes completion

Customer requests refund

Incident remains open

15. Customer Dashboard Definition of Done

The module is ready only when:

Authentication

Customer can register and log in.

OTP resend and rate limits work.

Session expiry is handled.

Customer cannot access another customer’s account.

Pet profiles

Multiple pets are supported.

Draft profiles can be saved.

Medical and behaviour information is restricted.

Service-specific risk review works.

Booking

Customer can complete all six booking steps.

Estimated and final prices are distinguished.

Request does not appear confirmed prematurely.

Ineligible services are blocked.

Booking-status history is preserved.

Sitter proposal

Customer sees only appropriate public sitter information.

Approve, rematch and cancellation actions work.

Exact private sitter data is protected.

Payments

Razorpay order is created server-side.

Signature is verified.

Webhooks are authenticated and idempotent.

Duplicate payment does not duplicate the booking.

Booking confirms only after validated payment.

Service tracking

Customer sees accurate status.

Delays and replacement states are understandable.

Incident status does not expose inappropriate internal data.

Reports and reviews

Every completed service requires a report.

Customer can view only their report.

One review is permitted per booking.

Complaints and incidents remain separate.

Repeat booking revalidates sitter eligibility.

Recommended Final Customer Flow

Customer registers

↓

Creates pet and care profile

↓

Pet starts as UNASSESSED

↓

Customer chooses service, schedule and address

↓

System calculates estimated price

↓

Customer submits request

↓

PetSaathi reviews risk and availability

↓

Eligible sitter accepts

↓

Customer reviews and approves sitter

↓

Server creates payment order

↓

Customer pays

↓

Server verifies payment

↓

Booking becomes confirmed

↓

Customer receives service statuses

↓

Sitter completes service and report

↓

Customer receives Pet Report Card

↓

Customer reviews service

↓

Customer requests repeat booking

Final Operating Principle

The Customer Dashboard should make booking simple without hiding the managed work required for safe service delivery. A request is not a confirmed booking, an estimate is not a final price, and a proposed sitter is not assigned until acceptance and payment conditions are satisfied. Every important state must be explicit, auditable and understandable to the customer.

Simple explanation for professor

“The PetSaathi Customer Dashboard will allow pet parents to complete the entire booking lifecycle digitally. A customer first registers using a mobile OTP and creates a pet profile containing care, behaviour, medical and emergency information. The customer then chooses a service, selects a date and time, adds the address and booking instructions, and reviews an estimated price. Submitting the form creates a booking request, not a confirmed booking. PetSaathi reviews the pet’s requirements and matches an eligible sitter. The sitter must accept, after which the customer reviews the sitter’s approved services, verification badges, experience and rating. The customer then completes online payment. The backend verifies the payment before confirming the booking. During the service, the customer sees status updates such as sitter en route, arrived, service started and completed. After the service, the customer receives a structured Pet Report Card, leaves a booking-linked review and may request the same sitter again. The system also handles cancellations, replacements, refunds, incidents and privacy through controlled status workflows and role-based access.”

PetSaathi Phase 4 — Pet Profile Module, End to End 🐾

Executive decision

The Pet Profile module should be treated as a core safety and matching system, not merely a form containing the pet’s name, breed and photograph.

It must support four operational purposes:

Give the sitter accurate care instructions.

Identify behavioural, handling and medical concerns.

determine which services and sitters may be appropriate.

Provide essential owner, veterinarian and emergency information.

Established pet-care platforms use pet profiles to communicate veterinary contacts, daily care instructions and individual habits to caregivers. Veterinary emergency guidance similarly recommends keeping structured information about the owner, pet, medications, veterinarian and emergency hospital.

The correct MVP principle is:

The customer provides the facts, the system identifies rule-based risk flags, and an authorised administrator makes the final service-specific risk decision.

Do not use AI to automatically approve, reject or diagnose a pet during the MVP.

1. Corrected Pet Profile Structure

Your proposed fields are a good starting point, but several should be made more structured.

### Table 40

| Proposed field | Recommended design |
| --- | --- |
| Pet name | Required text field |
| Pet type | Controlled list: dog, cat, other supported pet |
| Breed | Searchable field plus mixed/unknown option |
| Age | Date of birth or estimated age |
| Weight | Numeric value in kilograms plus last-updated date |
| Gender | Store as biological sex plus neutered/spayed status |
| Vaccination status | Individual vaccination records, dates and evidence |
| Aggression history | Detailed incident questions, not only yes/no |
| Pulls leash? | Frequency and severity |
| Anxious with strangers? | Frequency, behaviour and triggers |
| Medical condition | Structured conditions plus customer notes |
| Food instructions | Approved food, quantity, restrictions and allergies |
| Vet contact | Structured veterinary clinic record |
| Emergency contact | Prioritised authorised contacts |
| Pet photo | Private uploaded media |
| Pet risk classification | Versioned, service-specific admin assessment |

2. Pet Profile Sections

The form should be divided into manageable steps.

Section A — Basic Identity

### Table 41

| Field | Required? | Example |
| --- | --- | --- |
| Pet name | Yes | Bruno |
| Pet type/species | Yes | Dog |
| Breed | Yes | Labrador Retriever |
| Date of birth | Preferred | 12 June 2023 |
| Estimated age | Alternative | Approximately 3 years |
| Sex | Yes | Male |
| Neutered/spayed status | Recommended | Neutered |
| Current weight | Required for dogs | 28 kg |
| Weight measured on | Recommended | 1 July 2026 |
| Pet photograph | Recommended | Private profile image |
| Microchip or identification information | Optional | Restricted internal record |

Important correction: breed must not determine risk

Breed can help describe the animal, but it should never automatically determine whether the pet is Green, Yellow or Red.

AVMA guidance emphasises that bite risk is better assessed from the individual animal’s history and behaviour rather than breed alone.

Section B — Behaviour and Handling

This is one of the most important sections.

Stranger behaviour

Ask:

How does your pet usually respond to an unfamiliar caregiver?

Options:

Calm and friendly

Initially cautious but settles

Hides or avoids interaction

Barks or vocalises

Growls

Snaps

Attempts to bite

Attempts to escape

Behaviour varies

Unsure

Then ask:

Describe what the sitter should do when first meeting your pet.

Bite and injury history

Do not ask only:

“Aggression history: Yes or No?”

Ask:

Has the pet ever bitten a person?

Has the pet ever bitten another animal?

Did the bite break the skin?

When did it happen?

What triggered the incident?

Who or what was bitten?

Has it happened more than once?

What management method is currently used?

Has a veterinarian or behaviour professional assessed the pet?

Aggression is a serious behavioural issue, and bite or attempted-bite history requires professional consideration rather than a casual binary field.

Leash behaviour

Ask:

Does the dog pull?

How strongly?

What triggers pulling?

Does the dog lunge at animals, people or vehicles?

What equipment is normally used?

Can the owner demonstrate the walking process?

Has the dog ever escaped from a leash, collar or harness?

Suggested values:

NEVER

OCCASIONALLY

MODERATELY

STRONGLY

UNMANAGEABLE_WITHOUT_SPECIALIST

UNKNOWN

Anxiety and fear

Ask separately about:

Unfamiliar people

Separation from owner

Other dogs

Cats

Children

Traffic

Lifts

Thunder

Fireworks

Grooming or touching

Confinement

New environments

Also ask what anxiety looks like:

Hiding

Trembling

Panting

Pacing

Barking

Destructive behaviour

Refusing food

Growling

Snapping

Attempting to escape

Signs such as hiding, cowering, excessive panting, lip licking or aggression may indicate stress, fear, pain or illness and may require veterinary or behaviour-professional advice.

Resource guarding

Ask whether the pet guards:

Food

Treats

Toys

Bed or resting area

Owner

Doorways

Other objects

A sitter should never discover serious food or toy guarding for the first time during a booking.

Handling tolerance

Ask whether the pet is comfortable with:

Collar or harness being attached

Paws being touched

Face or ears being touched

Food bowl being handled

Being lifted

Being dried or cleaned

Medication administration

Entering a car

Entering a crate

Other-animal compatibility

Record separately:

Comfortable with dogs

Comfortable with cats

Comfortable with small animals

Comfortable inside the home

Comfortable outside

Comfortable while eating

Comfortable sharing toys

Unknown or never tested

“Friendly during a brief park meeting” should not automatically mean suitable for shared boarding.

Section C — Medical and Health Information

The customer should report known facts, but neither the customer form nor the admin should diagnose the pet.

Recommended fields

### Table 42

| Field | Example |
| --- | --- |
| Known medical conditions | Skin allergy |
| Current symptoms | None |
| Current medication | Antihistamine prescribed by veterinarian |
| Medication schedule | 8:00 PM |
| Allergies | Chicken |
| Mobility limitation | None |
| Seizure history | No |
| Breathing or cardiac condition | No |
| Previous emergency | Allergic reaction in 2025 |
| Recent surgery | No |
| Regular veterinarian | ABC Veterinary Clinic |
| Emergency clinic | XYZ 24-hour Hospital |
| Medical notes last updated | 10 July 2026 |

Critical current-health questions

Before each booking, ask:

Is your pet currently experiencing any of the following?

Vomiting

Diarrhoea

Coughing

Breathing difficulty

Lethargy

Injury

Fever reported by a veterinarian

Seizure activity

Unusual aggression

Refusal of food or water

Possible infectious illness

Current illness should trigger a new booking review even when the stored profile is old.

Medication fields

Do not use one general text box.

Record:

Medication name

Purpose reported by customer

Dose

Method

Scheduled time

Prescribing veterinarian

Start and end dates

What to do if refused or vomited

Whether PetSaathi permits the task

Whether the assigned sitter is trained for it

The sitter must never change the dose or provide unapproved medication.

3. Vaccination Records

Do not use only:

vaccinated = true

That field is insufficient because vaccinations have different names, dates and validity periods.

Recommended vaccination record

### Table 43

| Field | Example |
| --- | --- |
| Vaccine name | Rabies |
| Date administered | 15 March 2026 |
| Next due date | 15 March 2027 |
| Veterinary clinic | ABC Veterinary Clinic |
| Evidence uploaded | Yes |
| Verification status | Pending/Reviewed |
| Notes | None |

A pet may have several vaccination records.

Vaccination recommendations can depend on species, age, lifestyle, geography and exposure risk. PetSaathi should therefore record the veterinary evidence and apply a veterinarian-reviewed service policy instead of inventing one universal vaccination schedule.

Service-specific vaccination treatment

Dog walking

Missing vaccination evidence may trigger a warning or manual review, depending on policy, but it does not automatically mean that every individual walk must be rejected.

Home sitting

PetSaathi should record the health information and protect the sitter, particularly where communicable illness is suspected.

Boarding or daycare

A stricter health and vaccination policy is appropriate because pets may share an environment. Dogs in social settings may face infectious-disease exposure, and boarding/daycare vaccination needs should be defined with veterinary advice.

4. Food and Care Instructions

Food fields

Record:

Food brand or type

Portion

Feeding times

Preparation instructions

Approved treats

Prohibited food

Food allergy

Food guarding

Whether pets must be fed separately

What to do if the pet refuses food

Example:

Food: Customer-provided dry food

Quantity: 180 grams

Time: 7:00 PM

Treats: Only customer-provided allergy-safe treats

Restriction: No outside food; chicken allergy

Water instructions

Record:

Water-access requirement

Bowl location

Refill instructions

Filtered or normal water, where relevant

Unusual drinking behaviour to report

Daily routine

Record:

Normal wake time

Feeding time

Walking time

Toilet routine

Play preferences

Rest routine

Sleeping arrangement

Crate use

Household restrictions

Normal alone-time tolerance

Detailed care instructions and information about the pet’s normal habits help the sitter deliver consistent care.

5. Veterinary and Emergency Contacts

Regular veterinarian

Store:

Clinic name

Veterinarian name, where known

Phone

Address

Operating hours

Customer’s relationship with clinic

Last confirmed date

Emergency clinic

Store separately:

Clinic name

Emergency number

Address

Operating hours

Estimated travel time

Map location

Last verified date

Owner emergency contacts

Each contact should contain:

Name

Relationship

Phone

Priority

Whether they can authorise veterinary care

Whether they can authorise spending

Maximum approved spending, if the customer chooses to specify

Availability notes

AVMA emergency-planning material recommends retaining owner, medication, veterinarian and emergency-hospital details so that they are available when an urgent event occurs.

6. Pet Photograph

Purpose

The photograph helps:

Confirm the correct pet

Assist sitter recognition

Support lost-pet procedures

Improve customer and sitter usability

AVMA emergency-planning guidance includes maintaining a current photograph of the pet.

MVP rules

Photograph is private by default.

Customer chooses the main profile image.

Assigned sitter may view it for the authorised booking.

Administrators may access it for operations or safety.

It is not automatically usable for marketing.

Marketing consent must be separate.

Old photos may remain in audit history only where required.

Uploads should have file-type and size restrictions.

7. End-to-End Customer Flow

Create pet

↓

Enter basic information

↓

Enter behaviour and handling details

↓

Enter medical and vaccination information

↓

Add food and routine instructions

↓

Add veterinarian and emergency contacts

↓

Upload photograph

↓

Save profile

↓

System checks completeness

↓

Rule-based safety flags generated

↓

Admin risk review

↓

More information requested, where needed

↓

Service-specific risk assessments created

↓

Pet becomes eligible for suitable booking types

Step 1 — Create pet

The customer selects:

Add a Pet

The system creates a draft pet ID.

Example:

PET-000145

Initial profile state:

DRAFT

Initial risk state:

UNASSESSED

Step 2 — Complete basic details

The customer enters:

Name

Species

Breed

Date of birth or approximate age

Sex

Neutered/spayed status

Weight

Photograph

The customer may save and continue later.

Step 3 — Complete behaviour questions

Use simple language rather than asking the customer to diagnose aggression.

For example:

Has Bruno ever growled, snapped or bitten when an unfamiliar person approached?

is better than:

Is Bruno aggressive?

Step 4 — Complete health information

Ask only information needed for care and matching.

The form should clearly say:

PetSaathi does not diagnose medical conditions. Please provide information supplied by your veterinarian and contact your veterinarian when you are unsure.

Step 5 — Add routine instructions

Allow customers to describe:

Feeding

Walking

Toilet routine

Play

Rest

Home access

Important commands

Step 6 — Add contacts

Require:

Primary owner

At least one emergency contact for higher-risk or boarding bookings

Regular veterinarian where available

Emergency clinic for boarding and medically complex services

Step 7 — Customer declaration

Before submission, require confirmation:

I confirm that I have provided accurate information about my pet’s behaviour, bite history, health and care requirements. I understand that missing or incorrect information may affect the safety or availability of the service.

This should be a separate declaration from marketing consent.

Step 8 — Completeness validation

Possible profile states:

DRAFT

INCOMPLETE

SUBMITTED

MORE_INFORMATION_REQUIRED

ADMIN_REVIEW_REQUIRED

ACTIVE

REASSESSMENT_REQUIRED

ARCHIVED

A customer may save a draft, but they should not request a service until the mandatory fields for that service are complete.

8. Pet Risk Classification

Official recommendation

Use the following risk values:

UNASSESSED

GREEN

YELLOW

RED

Do not use:

REJECTED

as a risk value.

Why REJECTED should be separate

Risk describes the pet-care conditions.

Rejection describes PetSaathi’s current ability or decision to provide a particular service.

For example:

Risk: RED

Booking decision: ACCEPT_WITH_CONTROLS

may be possible when a suitable professional and care plan exist.

Another request may be:

Risk: YELLOW

Booking decision: DECLINE

because no qualified sitter is available in the locality.

Separate booking decision

Use:

ACCEPT_STANDARD

ACCEPT_WITH_CONTROLS

MANUAL_REVIEW

WAITLIST

DECLINE

Suggested decline reasons:

NO_SUITABLE_SITTER

MEDICAL_CLEARANCE_REQUIRED

ACTIVE_ILLNESS

SAFETY_INFORMATION_INCOMPLETE

BOARDING_REQUIREMENT_NOT_MET

OUTSIDE_SERVICE_SCOPE

UNSAFE_EQUIPMENT

CUSTOMER_DECLINED_REQUIRED_CONTROLS

9. Meaning of Each Risk Level

Green — Routine controls

Typical characteristics may include:

Calm with unfamiliar caregivers

No known bite history

Manageable on normal equipment

No significant current medical concern

Clear care instructions

Suitable for the requested service

No known escape or serious guarding concern

Matching

Use a sitter approved for the relevant:

Service

Pet type

Size

Locality

Green does not mean zero risk.

Yellow — Additional controls required

Possible reasons:

Strong leash pulling

Stranger anxiety

Separation anxiety

Escape history

Food or toy guarding

Senior age or mobility limits

Medication requirement

Uncertain other-pet compatibility

Large dog requiring experienced handling

Previous non-severe incident

Incomplete boarding history

Matching controls

Depending on the service:

More experienced sitter

Meet-and-greet

Large-dog permission

Same-sitter continuity

Individual service

Detailed instructions

Reduced route

Customer handover

Stronger admin monitoring

Boarding separation plan

Red — Manual specialist review

Possible reasons:

Recent bite causing injury

Repeated bite or attack behaviour

Serious uncontrolled aggression

Uncontrolled seizure or medical instability

Severe breathing or cardiac concern

Recent repeated escape

Unsafe equipment

Serious incompatibility with resident animals

Current serious illness

Customer refuses to disclose relevant history

Care needs beyond PetSaathi’s approved provider capability

Decision

A Red assessment means:

Do not automatically match.

Possible outcomes:

Obtain veterinary information

Obtain behaviour-professional assessment

Change the requested service

Assign a specialist caregiver

Add mandatory controls

Waitlist

Decline the service

10. Risk Must Be Service-Specific

Do not store one permanent colour for the entire pet.

Example:

### Table 44

| Service | Possible assessment |
| --- | --- |
| Home sitting in familiar home | Green |
| Walking with unfamiliar sitter | Yellow |
| Shared boarding | Red |
| Individual boarding | Manual review |
| Cat home visit | Green |

The assessment belongs to:

Pet + service + environment + current condition

not only to the animal.

11. Admin-Controlled Risk Workflow

Recommended workflow

Profile submitted

↓

System checks mandatory fields

↓

System generates deterministic flags

↓

Admin reviews evidence

↓

Admin requests clarification where required

↓

Admin selects service-specific risk level

↓

Admin records reason codes and controls

↓

Second approval for high-risk cases, where required

↓

Assessment activated

The system may generate flags

Examples:

BITE_HISTORY_REPORTED

STRONG_PULLING

STRANGER_ANXIETY

ESCAPE_HISTORY

RESOURCE_GUARDING

MEDICATION_REQUIRED

SEIZURE_HISTORY

ACTIVE_SYMPTOMS

VACCINATION_INFORMATION_MISSING

OTHER_PET_INCOMPATIBILITY

LARGE_DOG

SENIOR_PET

The system should not automatically conclude

BITE_HISTORY_REPORTED → RED

without context.

The admin needs to understand:

When it happened

Severity

Trigger

Recurrence

Requested service

Current management

Sitter capability

12. No AI Risk Decisions in the MVP

Why AI should not make the final decision

During Phase 4, PetSaathi will have:

Limited historical booking data

Few verified incident examples

Changing policies

Small sitter samples

Customer-written descriptions of inconsistent quality

Medical and behavioural situations requiring human judgement

An AI output could appear precise while being based on incomplete information.

Correct MVP design

Use:

Structured customer form

+ deterministic warning rules

+ admin assessment

+ veterinarian/behaviour referral where needed

AI may later assist with low-risk administrative tasks such as:

Highlighting incomplete fields

Summarising long customer notes

Detecting contradictory answers

Suggesting follow-up questions

It should not independently:

Diagnose illness

Declare a pet safe

Reject a pet

Approve group boarding

Override bite history

Determine emergency treatment

Assign a sitter to a Red case

13. Risk Assessment Record

Every assessment should record:

### Table 45

| Field | Purpose |
| --- | --- |
| Assessment ID | Unique history record |
| Pet ID | Pet assessed |
| Service type | Walking, sitting or boarding |
| Overall risk | Green, Yellow or Red |
| Behaviour risk | Structured sublevel |
| Medical risk | Structured sublevel |
| Handling risk | Structured sublevel |
| Escape risk | Structured sublevel |
| Compatibility risk | Structured sublevel |
| Reason codes | Why the level was selected |
| Required controls | Meet-and-greet, specialist sitter, etc. |
| Assessed by | Admin or safety reviewer |
| Assessment date | Effective date |
| Review due | Reassessment date, where configured |
| Current status | Active, superseded or revoked |
| Customer information version | Evidence used |

Never overwrite an old assessment. Create a new version.

14. Booking-Time Risk Snapshot

When a customer submits a booking, copy the relevant assessment into a booking snapshot.

This is important because the customer may later edit the profile.

Example:

Pet profile on booking date:

Pulling: Strong

Weight: 28 kg

Walking risk: Yellow

Required sitter: Large-dog approved

If the customer changes “Pulling: Strong” to “No pulling” after the booking, the original booking record must still show the information used during matching.

15. Reassessment Triggers

Set the profile to:

REASSESSMENT_REQUIRED

when:

Customer reports a bite

Pet escapes

Medical condition changes

New medication is added

Pet’s mobility changes

Serious complaint or incident occurs

Boarding compatibility changes

Weight changes materially for handling

Customer reports new aggression or anxiety

Profile has not been reviewed for the configured period

Admin discovers inaccurate information

A customer edit affecting safety should not silently alter the approved risk level.

16. Example: Bruno

Customer-provided profile

### Table 46

| Field | Value |
| --- | --- |
| Name | Bruno |
| Type | Dog |
| Breed | Labrador |
| Age | 3 years |
| Weight | 28 kg |
| Sex | Male |
| Vaccination | Records reported current |
| Bite history | No |
| Strong pulling | Yes |
| Stranger anxiety | Sometimes |
| Medical condition | Skin allergy |
| Food restriction | No outside food |
| Vet | Local veterinary clinic |
| Emergency contact | Owner and family member |

System flags

LARGE_DOG

STRONG_PULLING

STRANGER_ANXIETY

FOOD_RESTRICTION

MEDICAL_CONDITION_REPORTED

Provisional admin review

Dog walking

Likely classification:

YELLOW

Possible required controls:

Large-dog-approved walker

Experience with pulling

Meet-and-greet before first walk

Owner demonstrates harness

No outside treats

Quiet initial route

Same-sitter preference

Home sitting

This may be Green or Yellow depending on:

How Bruno reacts when the owner is absent

Whether the allergy requires medication

Whether strangers can enter safely

Whether he guards food or space

Shared boarding

Requires separate review of:

Other-pet compatibility

Separation anxiety

Vaccination evidence

Feeding separation

Host capability

Property approval

The system must not classify all three services identically.

17. Customer-Facing Risk Language

Do not show:

Bruno is a RED pet.

Use respectful operational wording.

Green

Bruno’s current information supports standard matching for this service.

Yellow

This request needs an experienced caregiver or additional preparation. PetSaathi will review the match before confirmation.

Red

This service requires a manual safety review. Our team may request additional veterinary, behavioural or care information before deciding availability.

Declined

PetSaathi cannot safely support this service under the current information and available provider capabilities. Our team will explain the reason and any possible alternatives.

The risk classification must never be used as a moral judgement about the animal.

18. MVP Data Architecture

For a lean MVP, use the following main tables.

pets

Stores:

ID

Customer ID

Name

Species

Breed

Birth date

Estimated-age flag

Sex

Neutered status

Weight

Photograph reference

Profile status

Created/updated timestamps

pet_behavior_profiles

Stores:

Stranger response

Bite history

Pulling severity

Escape history

Separation anxiety

Resource guarding

Other-pet compatibility

Handling tolerance

Customer notes

pet_medical_profiles

Stores:

Conditions

Allergies

Medication summary

Mobility issues

Seizure history

Emergency history

Last updated date

pet_vaccination_records

One row for each vaccination:

Vaccine

Date administered

Next due

Clinic

Evidence reference

Review status

pet_care_instructions

Stores:

Food

Water

Walk routine

Toilet routine

Play

Rest

Prohibited items

Home instructions

pet_contacts

Stores:

Regular veterinarian

Emergency clinic

Owner contacts

Authorisation scope

Contact priority

pet_risk_assessments

Stores each versioned, service-specific risk assessment.

pet_risk_factors

Stores the structured reasons and required controls attached to an assessment.

19. Role and Access Rules

Customer

May:

Create pets

Edit their own pets

Upload evidence

View customer-facing risk status

Respond to information requests

May not:

Assign final risk level

Edit admin reason codes

Remove incident history

Mark vaccination evidence verified

Sitter

May view only the information necessary for an accepted assignment, such as:

Pet identity and photo

Handling instructions

Relevant behavioural risks

Food and medical tasks

Emergency contacts

Veterinary contact

The sitter should not receive unrelated customer or pet information.

Operations admin

May view booking and matching information.

Safety admin

May review:

Bite history

Medical-risk information

Incidents

Red-risk assessments

Required controls

Verification or finance staff

Should not automatically receive full access to pet medical profiles.

20. Privacy and Security

The Pet Profile links customer identity, contact details, home information, emergency contacts and service history. PetSaathi should provide a clear notice explaining what information is collected, why it is required, who can access it and how correction or deletion requests are handled. The official DPDP Rules were published in November 2025 with staged commencement provisions.

Minimum protections include:

HTTPS

Server-side authorisation

Private file storage

Expiring media links

Role-restricted medical information

Audit records for risk changes

No pet medical details in analytics

No full emergency contacts in application logs

No sensitive data in URL query strings

Retention and deletion rules

OWASP recommends restricting access to sensitive information, avoiding unnecessary storage and removing sensitive records when they are no longer required.

21. Important Validation Rules

Basic data

Pet name cannot be empty.

Birth date cannot be in the future.

Weight must be numeric and positive.

Dog-walking requests require current weight.

Species must be from the supported list.

Photograph upload must use an approved format and size.

Behaviour

A reported bite requires incident details.

Strong pulling requires dog weight and walking equipment.

Stranger aggression requires customer instructions.

Resource guarding requires context.

“Unknown” must be a valid answer where the customer genuinely does not know.

Medical

Medication requires name, dose and timing.

Seizure history requires emergency instructions.

Current emergency symptoms block ordinary automatic booking flow.

Medical information should show when it was last updated.

Boarding

Boarding requests require:

Other-pet compatibility

Vaccination records according to policy

Separation-anxiety information

Feeding and sleeping instructions

Emergency contacts

Current health confirmation

Manual risk review

22. Edge Cases

Customer does not know the breed

Allow:

MIXED

UNKNOWN

Do not block the profile.

Customer does not know exact age

Allow estimated age and mark:

age_is_estimated = true

Multiple pets

Create a separate profile for each pet.

The booking may then contain several pets, with:

Individual risks

Shared household instructions

Compatibility information

Additional-pet price

Customer changes critical information after matching

Examples:

Adds bite history

Reports vomiting

Adds seizure medication

Changes dog weight substantially

Action:

Place booking into review

Notify admin

Recheck sitter eligibility

Preserve previous information snapshot

Pet is deceased or permanently inactive

Use:

ARCHIVED

Do not delete completed booking, report or incident history.

Customer refuses mandatory safety questions

The pet profile may remain saved, but the affected service cannot proceed.

23. Pet Profile Dashboard

The customer should see a clear pet card.

Example

Bruno

Labrador · Male · 3 years · 28 kg

Profile status: CompleteWalking review: Additional controls requiredHome sitting review: Under reviewBoarding: Compatibility review required

Actions:

View profile

Update care instructions

Update health information

Request a service

View reports

Archive profile

Profile sections

Use tabs or sections:

Overview

Care Routine

Behaviour

Health

Vaccinations

Vet & Emergency

Risk Review

Service History

Internal admin reasoning should not appear in the customer interface.

24. Definition of Done

The Pet Profile module is ready only when:

Customer experience

Customer can create multiple pet profiles.

Draft profiles can be saved.

Required questions depend on selected service.

Customer can update routine and medical information.

Critical changes trigger review.

Customer sees respectful review messages.

Data quality

Age and weight are stored structurally.

Bite history contains context.

Vaccination is not a single Boolean field.

Veterinarian and emergency contacts are structured.

Temporary booking instructions do not overwrite permanent data.

Risk assessments are versioned.

Historical booking snapshots are preserved.

Risk management

New pets begin as UNASSESSED.

Admin controls final classification.

Green, Yellow and Red are service-specific.

REJECTED is not a risk value.

Decline decisions have reason codes.

Yellow and Red cannot be automatically matched.

Required controls are enforced during matching.

Security

Customer accesses only their pets.

Sitter accesses only assigned-pet information.

Medical details are restricted.

Private media is not publicly accessible.

Risk changes are audited.

Sensitive data is excluded from analytics and logs.

Operations

Admin can request additional information.

Booking eligibility updates after assessment.

A profile change can pause matching.

Incident records trigger reassessment.

Boarding has separate mandatory questions.

Emergency contacts are available during active bookings.

Final Approved Pet Profile Model

Approve

Detailed pet profile

Structured behaviour questions

Medical and food instructions

Veterinary and emergency contacts

Private pet photograph

Admin-controlled risk classification

Service-specific Green, Yellow and Red assessments

Rule-based system flags

Versioned assessments

Booking-time risk snapshots

Modify

Replace pet “gender” with sex plus neutered/spayed status.

Replace vaccination yes/no with vaccination records.

Replace aggression yes/no with incident and behaviour details.

Replace universal pet risk with service-specific assessments.

Replace REJECTED risk with a separate service decision.

Reject for the MVP

AI-generated final risk decisions

Breed-based automatic classification

Customer-controlled final risk level

One permanent colour for all services

Automatic Red-pet rejection

Automatic boarding approval

Medical diagnosis by the platform

Final Operating Principle

The Pet Profile is the foundation of PetSaathi’s matching and safety system. The customer provides structured, accurate information; the software identifies missing information and objective warning flags; and an authorised administrator assigns a service-specific risk classification and matching controls. Risk classification supports safer decisions—it does not diagnose, punish or permanently label the pet.

Simple explanation for professor

“The Pet Profile module will store the animal’s identity, care routine, behaviour, health information, vaccination records, food restrictions, veterinarian details and emergency contacts. The customer will complete the profile, but the customer will not assign the final risk level. The software will identify objective flags such as bite history, strong leash pulling, stranger anxiety, escape history, medication requirements or other-pet incompatibility. An authorised PetSaathi administrator will review those facts and assign a Green, Yellow or Red classification separately for walking, home sitting and boarding. Green means routine controls are normally sufficient, Yellow means an experienced sitter or additional precautions are required, and Red means manual specialist review. ‘Rejected’ will not be stored as a risk level; it will be recorded separately as a service decision with a clear reason. The MVP will not use AI to approve, reject or diagnose pets. Every risk assessment will be versioned, linked to the administrator who approved it and preserved as a booking-time snapshot for future safety and audit review.”

PetSaathi Phase 4 — Booking Module, End to End 🐾🚀

Executive decision

The Booking Module is the operational core of the PetSaathi MVP. It connects:

Customer → Pet → Service → Risk review → Sitter → Payment → Service execution → Report → Review → Payout

Your proposed lifecycle is directionally correct, but it should not be implemented as one overloaded booking_status enum containing payment, assignment, report, review and refund states.

For production-grade logic, maintain separate state machines for:

### Table 47

| State machine | What it controls |
| --- | --- |
| Booking status | Overall service lifecycle |
| Assignment status | Primary, backup and replacement sitters |
| Payment status | Customer payment |
| Refund status | Full or partial refund |
| Report status | Pet Report Card |
| Review status | Customer feedback |
| Incident status | Safety investigation |

This separation prevents contradictions such as:

Booking status = REFUNDED, but the service was already completed.

Booking status = REVIEW_PENDING forever because the customer never reviews.

Booking status = SITTER_ASSIGNED, while the assigned sitter has cancelled.

Payment status = paid, but booking status was overwritten as cancelled.

1. Correct Production Architecture

Your proposed flow

REQUESTED

PENDING_ADMIN_REVIEW

SITTER_MATCHING

SITTER_ASSIGNED

PAYMENT_PENDING

CONFIRMED

SERVICE_STARTED

SERVICE_COMPLETED

REPORT_SUBMITTED

REVIEW_PENDING

CLOSED

CANCELLED

REFUNDED

Recommended official booking lifecycle

REQUESTED

→ PENDING_ADMIN_REVIEW

→ SITTER_MATCHING

→ SITTER_ASSIGNED

→ PAYMENT_PENDING

→ CONFIRMED

→ SERVICE_STARTED

→ SERVICE_COMPLETED

→ REPORT_SUBMITTED

→ CLOSED

Possible exception states:

DECLINED

CANCELLED

REPLACEMENT_REQUIRED

NO_SHOW

INCIDENT_HOLD

Important modifications

REVIEW_PENDING

Keep this as a separate review status:

NOT_ELIGIBLE

PENDING

SUBMITTED

SKIPPED

MODERATION_REQUIRED

A booking should be able to close even when the customer chooses not to submit a review.

REFUNDED

Keep this as a payment/refund status, not a booking status.

A booking may be:

Booking status: CANCELLED

Refund status: PROCESSED

or:

Booking status: CLOSED

Refund status: PARTIALLY_PROCESSED

SITTER_ASSIGNED

This may remain visible in the booking workflow, but the actual sitter relationship must also be stored in a separate assignment record.

2. Corrected Booking Fields

Main booking record

### Table 48

| Field | Recommended design | Example |
| --- | --- | --- |
| Internal ID | UUID primary key | 8a9d… |
| Public booking code | Unique customer-facing code | BK-1001 |
| Customer ID | Foreign key | C-001 |
| Service type | Controlled service reference | Dog walking |
| Scheduled start | Timezone-aware timestamp | 2026-08-01 07:00 IST |
| Scheduled end | Timezone-aware timestamp | 2026-08-01 07:30 IST |
| Duration | Integer minutes | 30 |
| Service address | Address reference plus snapshot | Bopal address |
| City | Derived/snapshotted | Ahmedabad |
| Area | Derived/snapshotted | Bopal |
| Booking status | Overall workflow status | CONFIRMED |
| Risk snapshot | Risk at booking time | Yellow walking risk |
| Final amount | Integer in paise | 14900 |
| Currency | ISO currency code | INR |
| Customer notes | Booking-specific note | Use red harness |
| Created at | Timestamp | — |
| Updated at | Timestamp | — |
| Version | Concurrency-control number | 4 |

Do not store only one pet_id

A booking may later include:

Two dogs for one walk

Two cats during a home visit

Multiple pets during sitting

Different pricing for each additional pet

Use a relationship table:

booking_pets

-------------

booking_id

pet_id

risk_assessment_id

additional_pet_amount

service_instructions_snapshot

This supports one booking with one or more pets.

Do not store only one price

Store a price snapshot containing:

### Table 49

| Price component | Example |
| --- | --- |
| Base service amount | ₹149 |
| Additional pet charge | ₹50 |
| Peak-time charge | ₹20 |
| Urgent-booking charge | ₹0 |
| Discount | −₹20 |
| Tax | ₹0 |
| Final payable amount | ₹199 |

Store monetary values in the smallest currency unit:

₹149 = 14,900 paise

This avoids floating-point arithmetic problems.

Do not store only one notes field

Separate notes according to purpose:

### Table 50

| Field | Visible to |
| --- | --- |
| Customer booking instructions | Customer, assigned sitter, operations |
| Pet-care instruction snapshot | Assigned sitter and operations |
| Internal admin notes | Authorised admins only |
| Sitter assignment note | Sitter and operations |
| Safety note | Safety-authorised users |
| Cancellation reason | Relevant users according to policy |
| Incident note | Safety team |

A note such as “dog pulls leash” should normally come from the pet-risk or handling snapshot, not depend only on an unstructured booking note.

3. Booking Creation Flow

Customer journey

Select pet

↓

Choose service

↓

Choose schedule

↓

Choose address

↓

Add booking instructions

↓

View estimated price

↓

Review policies

↓

Submit request

Server-side process

When the customer submits the request, the backend should:

Confirm the customer owns the selected pet.

Confirm the service is active in the selected area.

Confirm the requested time is valid.

Retrieve the current pet profile.

Retrieve the applicable service-specific risk assessment.

Calculate the estimated price on the server.

Create the booking.

Create pet and instruction snapshots.

Create a status-history entry.

Notify operations.

Initial status:

REQUESTED

The customer should see:

Your request has been received. PetSaathi will review your pet’s care requirements, sitter availability and service area before confirmation.

4. Booking Statuses Explained

Status 1 — REQUESTED

Meaning

The customer has submitted a complete booking request.

Required data

Customer

Pet

Service

Schedule

Address

Basic instructions

Estimated price

Customer message

Booking request received.

Permitted next states

PENDING_ADMIN_REVIEW

CANCELLED

DECLINED

A request is not yet a confirmed booking.

Status 2 — PENDING_ADMIN_REVIEW

Meaning

PetSaathi is checking:

Pet-risk information

Service-area availability

Current health information

Booking instructions

Boarding requirements

Any special handling requirements

Admin actions

Approve for matching

Ask customer for more information

Change required controls

Propose another service

Decline the request

Customer message

Your booking is under review. We may contact you if additional care or safety information is needed.

Permitted next states

SITTER_MATCHING

DECLINED

CANCELLED

Status 3 — SITTER_MATCHING

Meaning

The system and admin are finding an eligible sitter.

Hard matching filters

A sitter should be excluded when:

Their operational status is not active or probation-approved.

They lack permission for the service.

Pet size exceeds their handling permission.

Pet risk exceeds their approval.

Required training or verification has expired.

They are unavailable.

They have a conflicting assignment.

Travel time is unreasonable.

Boarding-property approval is absent.

They have an active safety restriction.

Matching process

Eligible sitters identified

↓

Offers sent

↓

Sitter accepts or declines

↓

Admin confirms compatibility

↓

Primary sitter selected

Permitted next states

SITTER_ASSIGNED

DECLINED

CANCELLED

5. Sitter Assignment Architecture

Do not put only:

sitter_id = ST-004

inside the booking table.

Use a separate table:

booking_assignments

-------------------

id

booking_id

sitter_id

assignment_role

assignment_status

offered_at

responded_at

accepted_at

assigned_at

removed_at

removal_reason

Assignment roles

PRIMARY

BACKUP

REPLACEMENT

SUPERVISOR

Assignment statuses

OFFERED

VIEWED

ACCEPTED

DECLINED

EXPIRED

ASSIGNED

REMOVED

COMPLETED

NO_SHOW

This permits:

One primary sitter

One named backup

A replacement sitter

Historical sitter assignments

Use a database uniqueness rule to prevent more than one active primary sitter for the same booking. PostgreSQL primary keys, unique constraints and foreign keys are designed to enforce uniqueness and referential integrity at the database level rather than relying only on application code.

Status 4 — SITTER_ASSIGNED

Meaning

An eligible sitter has:

Accepted the offer

Passed admin compatibility review

Been proposed or approved according to the customer workflow

Required data

Active primary assignment

Applicable service permission

No scheduling conflict

Price finalised

Customer-visible sitter profile ready

Customer actions

Review sitter

Approve sitter

Request another match

Cancel request

Permitted next states

PAYMENT_PENDING

SITTER_MATCHING

CANCELLED

If the sitter withdraws before payment:

SITTER_ASSIGNED → SITTER_MATCHING

The previous assignment remains in history as REMOVED.

6. Payment Flow

Status 5 — PAYMENT_PENDING

Meaning

The sitter and final price have been accepted, but payment has not yet been verified.

Correct payment sequence

Server calculates final amount

↓

Server creates Razorpay order

↓

Customer opens Razorpay Checkout

↓

Customer attempts payment

↓

Server verifies payment signature

↓

Webhook/payment API confirms captured status

↓

Booking becomes CONFIRMED

Razorpay requires payment-signature verification on the server before fulfilling an order. Its documentation also says the backend should verify that the payment reaches the captured state; the browser success response alone is not sufficient.

Razorpay’s Orders integration binds payment attempts to an order, while a captured payment causes the associated order to be marked paid.

Separate payment table

payments

--------

id

booking_id

provider

provider_order_id

provider_payment_id

amount

currency

status

signature_verified

captured_at

failed_at

failure_code

failure_description

created_at

updated_at

Payment statuses

CREATED

PENDING

AUTHORIZED

CAPTURED

FAILED

EXPIRED

CANCELLED

REFUNDED

Razorpay itself uses payment states including created, authorized, captured, refunded and failed; PetSaathi should map provider states into its own internal payment model without confusing them with the booking lifecycle.

Payment guards

The transition:

PAYMENT_PENDING → CONFIRMED

should require:

payment.status = CAPTURED

payment.amount = booking.final_amount

payment.currency = booking.currency

payment.signature_verified = true

active_primary_assignment_exists = true

The frontend must never be allowed to send:

booking.status = CONFIRMED

directly.

Only the backend workflow may perform that transition.

Webhook processing

Use a Next.js Route Handler for the payment webhook. Next.js Route Handlers support custom HTTP handlers and explicitly support receiving third-party webhooks.

Store every external event:

payment_events

--------------

provider_event_id

event_type

received_at

payload_hash

processing_status

processed_at

error_message

Webhook processing must be idempotent. Razorpay specifically advises understanding idempotency and webhook-event ordering before production use.

Prisma likewise describes idempotent APIs and optimistic concurrency control as important patterns for read-modify-write operations.

7. Booking Confirmation

Status 6 — CONFIRMED

Meaning

All confirmation requirements are satisfied:

Primary sitter assigned

Customer accepted the sitter

Payment captured

Address confirmed

Instructions complete

No unresolved safety block

Confirmation content

Send:

Booking ID

Pet

Service

Confirmed date and time

Duration

Assigned sitter

Address

Amount paid

Preparation instructions

Cancellation policy

Support contact

Emergency instructions

Permitted next states

SERVICE_STARTED

CANCELLED

REPLACEMENT_REQUIRED

NO_SHOW

INCIDENT_HOLD

You may optionally add:

SITTER_EN_ROUTE

SITTER_ARRIVED

as operational statuses or timeline events without making them mandatory top-level booking states.

8. Service Execution

Optional operational events

Before service start, record:

SITTER_EN_ROUTE

SITTER_ARRIVED

CUSTOMER_HANDOVER_COMPLETE

These may be stored in a booking-event timeline even when they are not part of the core status enum.

Status 7 — SERVICE_STARTED

Meaning

The sitter has begun the authorised service.

Entry requirements

Booking is confirmed.

Correct sitter is assigned.

Service is within the permitted start window.

Check-in has been recorded.

Customer handover or home-entry requirements are satisfied.

No active cancellation exists.

Data recorded

Actual start time

Sitter check-in

Location evidence where applicable

Initial pet condition

Equipment or handover check

Service-start photograph where required

Permitted next states

SERVICE_COMPLETED

INCIDENT_HOLD

NO_SHOW

A sitter cannot legitimately enter SERVICE_STARTED if they never reached the customer.

Status 8 — SERVICE_COMPLETED

Meaning

The sitter has ended the physical service, but the booking is not yet administratively complete.

Required data

Actual end time

Pet safely handed back or secured

Sitter checkout

Basic completion confirmation

Concern indicator

Incident linkage where relevant

Customer message

The service has ended. Your Pet Report Card is being prepared.

Permitted next states

REPORT_SUBMITTED

INCIDENT_HOLD

9. Report Card

Status 9 — REPORT_SUBMITTED

Meaning

The assigned sitter has submitted the required service report.

Separate report status

DRAFT

SUBMITTED

ADMIN_REVIEW_REQUIRED

DELIVERED

AMENDED

REJECTED_FOR_CORRECTION

Report table

booking_reports

---------------

id

booking_id

sitter_id

status

actual_start_at

actual_end_at

food_update

water_update

pee_update

poop_update

walk_distance_metres

mood

behaviour

sitter_note

concern_flag

submitted_at

delivered_at

version

Service-specific information may be stored in structured fields or validated JSON, but common operational fields should remain searchable columns.

Report rules

Only the assigned sitter may submit the report.

The report must belong to a completed service.

Required fields depend on service type.

A concern flag may create an incident.

Material edits must create a new version.

Media must remain private.

Customer-visible and internal notes must be separated.

Report requirement

A booking should not move to CLOSED until the report has been delivered, except through a documented admin exception.

10. Review Workflow

After the report is delivered:

review_status = PENDING

The customer may:

Submit rating

Submit written feedback

Request the same sitter

Report a private complaint

Skip the review

Review statuses

NOT_ELIGIBLE

PENDING

SUBMITTED

SKIPPED

MODERATION_REQUIRED

PUBLISHED

Review table

reviews

-------

id

booking_id

customer_id

sitter_id

overall_rating

punctuality_rating

communication_rating

pet_handling_rating

report_quality_rating

comment

same_sitter_requested

publication_consent

moderation_status

submitted_at

Important rule

Do not hold the booking open indefinitely while waiting for a review.

Recommended logic:

Report delivered

↓

Review requested

↓

Booking may close

↓

Review remains PENDING or becomes SUBMITTED later

11. Booking Closure

Status 10 — CLOSED

Meaning

The routine operational lifecycle has finished.

Closure requirements

Service completed

Report delivered

No unresolved critical incident

Payment reconciled

Assignment finalised

Payout record created or queued

Refund state recorded where applicable

Required audit events exist

A review is encouraged but should not be mandatory for closure.

12. Cancellation Flow

Booking status

CANCELLED

Separate cancellation record

booking_cancellations

---------------------

id

booking_id

cancelled_by

reason_code

reason_text

cancelled_at

policy_version

refund_eligibility

replacement_attempted

Possible cancellation actors

CUSTOMER

SITTER

ADMIN

SYSTEM

Cancellation reason examples

CUSTOMER_PLAN_CHANGED

PET_UNWELL

SITTER_UNAVAILABLE

NO_ELIGIBLE_SITTER

PAYMENT_NOT_COMPLETED

OUTSIDE_SERVICE_AREA

UNSAFE_OR_INCOMPLETE_INFORMATION

WEATHER_OR_FORCE_MAJEURE

Customer cancellation

Possible sequence:

CONFIRMED

→ CANCELLED

→ Refund eligibility calculated

→ Refund requested where applicable

Sitter cancellation

Possible sequence:

CONFIRMED

→ REPLACEMENT_REQUIRED

→ New sitter matching

If replacement succeeds:

REPLACEMENT_REQUIRED

→ SITTER_ASSIGNED

→ CONFIRMED

If replacement fails:

REPLACEMENT_REQUIRED

→ CANCELLED

The customer must approve any replacement unless the applicable policy clearly provides otherwise.

13. Refund Flow

Refunds require a separate table because they can be:

Full

Partial

Pending

Failed

Retried

Associated with completed or cancelled bookings

Refund statuses

REQUESTED

APPROVED

PROCESSING

PROCESSED

PARTIALLY_PROCESSED

FAILED

REJECTED

Refund table

refunds

-------

id

booking_id

payment_id

provider_refund_id

amount

reason_code

status

requested_by

approved_by

requested_at

processed_at

failure_reason

Razorpay sends separate refund webhook events, including creation, successful processing and failure, supporting the need to model refund progress independently.

Correct combined state

booking_status = CANCELLED

payment_status = CAPTURED

refund_status = PROCESSING

After completion:

booking_status = CANCELLED

payment_status = REFUNDED

refund_status = PROCESSED

14. No-Show Flow

A no-show should not be represented as a normal cancellation.

Sitter no-show

booking_status = NO_SHOW

assignment_status = NO_SHOW

System actions:

Notify admin immediately.

Notify customer.

Attempt approved replacement.

Create a reliability event.

Determine refund or compensation.

Temporarily pause sitter where policy requires.

Record investigation outcome.

Customer no-show or inaccessible location

Examples:

Customer does not answer.

Pet is not available.

Security refuses access.

Address is incorrect.

Record separately because sitter payout and refund outcomes may differ.

15. Incident Hold

Use:

INCIDENT_HOLD

when a safety event or serious dispute interrupts normal closure.

Examples:

Pet injury

Bite

Escape

Medical emergency

Customer alleges serious misconduct

Sitter reports unsafe conditions

Property damage

Wrong pet or wrong instructions

Incident-hold rule

The booking may remain linked to its last service state:

Previous operational state: SERVICE_STARTED

Current control state: INCIDENT_HOLD

Do not lose the fact that the service had already started.

After review, possible outcomes include:

SERVICE_COMPLETED

CANCELLED

CLOSED

with separate refund, payout and corrective-action decisions.

16. Booking Status History

Never store only the current status.

Use:

booking_status_history

----------------------

id

booking_id

from_status

to_status

changed_by_user_id

actor_type

reason_code

notes

created_at

request_id

Example:

### Table 51

| Time | From | To | Actor |
| --- | --- | --- | --- |
| 6:10 PM | — | REQUESTED | Customer |
| 6:18 PM | REQUESTED | PENDING_ADMIN_REVIEW | System |
| 6:42 PM | PENDING_ADMIN_REVIEW | SITTER_MATCHING | Admin |
| 7:05 PM | SITTER_MATCHING | SITTER_ASSIGNED | Admin |
| 7:11 PM | SITTER_ASSIGNED | PAYMENT_PENDING | Customer |
| 7:14 PM | PAYMENT_PENDING | CONFIRMED | Payment workflow |

This creates a reliable operational and audit history.

17. Transition Rules

Do not allow arbitrary state edits from an admin dropdown.

Define allowed transitions.

### Table 52

| Current state | Allowed next states |
| --- | --- |
| REQUESTED | PENDING_ADMIN_REVIEW, CANCELLED |
| PENDING_ADMIN_REVIEW | SITTER_MATCHING, DECLINED, CANCELLED |
| SITTER_MATCHING | SITTER_ASSIGNED, DECLINED, CANCELLED |
| SITTER_ASSIGNED | PAYMENT_PENDING, SITTER_MATCHING, CANCELLED |
| PAYMENT_PENDING | CONFIRMED, SITTER_MATCHING, CANCELLED |
| CONFIRMED | SERVICE_STARTED, REPLACEMENT_REQUIRED, CANCELLED, NO_SHOW, INCIDENT_HOLD |
| SERVICE_STARTED | SERVICE_COMPLETED, INCIDENT_HOLD |
| SERVICE_COMPLETED | REPORT_SUBMITTED, INCIDENT_HOLD |
| REPORT_SUBMITTED | CLOSED, INCIDENT_HOLD |
| REPLACEMENT_REQUIRED | SITTER_ASSIGNED, CANCELLED |
| INCIDENT_HOLD | SERVICE_COMPLETED, CANCELLED, CLOSED |
| CLOSED | No normal transition |

Any exceptional correction should require:

Elevated admin permission

Reason

Audit record

Original state preserved

18. Actor Permissions

### Table 53

| Transition | Customer | Sitter | Admin/System |
| --- | --- | --- | --- |
| Create request | Yes | No | Assisted |
| Move to review | No | No | Yes |
| Approve matching | No | Accept offer only | Yes |
| Approve proposed sitter | Yes | No | Assisted |
| Confirm payment | No | No | Payment workflow |
| Start service | No | Assigned sitter | Exceptional admin |
| Complete service | No | Assigned sitter | Exceptional admin |
| Submit report | No | Assigned sitter | Correction review |
| Cancel booking | According to policy | Request/cancel according to policy | Yes |
| Process refund | Request only | No | Finance workflow |
| Close incident | No | No | Safety admin |

19. Transaction and Concurrency Controls

Several actions may happen simultaneously:

Two admins try to assign different sitters.

Sitter accepts while another sitter is being selected.

Customer cancels while payment is processing.

Webhook arrives twice.

Sitter starts a booking that has just been cancelled.

Admin changes a booking while the sitter submits a report.

Use database transactions and concurrency controls for critical transitions.

Example: assigning a sitter

The transaction should:

Lock or version-check the booking.

Confirm status is SITTER_MATCHING.

Confirm sitter remains eligible.

Confirm no schedule conflict exists.

Create the primary assignment.

Change booking status.

Create status history.

Create notification event.

Commit everything together.

PostgreSQL supports transaction isolation and row locking for coordinating concurrent database changes, although locks must be applied carefully to avoid deadlocks.

Optimistic concurrency

Add:

version INTEGER NOT NULL DEFAULT 1

An update should include:

WHERE id = booking_id

AND version = expected_version

If no record is updated, another operation changed the booking first.

20. Notification Outbox

Do not send WhatsApp or email directly in the middle of the main booking transaction.

Use an outbox table:

notification_outbox

-------------------

id

event_type

booking_id

recipient_user_id

channel

template_code

payload

status

attempt_count

next_attempt_at

created_at

Process:

Booking transition committed

↓

Outbox event exists

↓

Background worker sends notification

↓

Delivery status recorded

This prevents a failed WhatsApp message from rolling back a valid booking confirmation.

21. Recommended Tables

Core tables

bookings

booking_pets

booking_address_snapshots

booking_price_snapshots

booking_instructions

booking_assignments

booking_status_history

booking_events

Financial tables

payments

payment_events

refunds

payouts

payout_adjustments

Service-quality tables

booking_reports

report_media

reviews

complaints

incidents

System-control tables

notification_outbox

notification_deliveries

admin_audit_logs

policy_versions

22. Recommended bookings Table

A production-ready simplified structure might contain:

bookings

--------

id UUID PRIMARY KEY

public_code VARCHAR UNIQUE NOT NULL

customer_id UUID NOT NULL

service_type_id UUID NOT NULL

service_address_id UUID NOT NULL

status booking_status NOT NULL

scheduled_start_at TIMESTAMPTZ NOT NULL

scheduled_end_at TIMESTAMPTZ NOT NULL

timezone VARCHAR NOT NULL

duration_minutes INTEGER NOT NULL

risk_snapshot_id UUID

currency CHAR(3) NOT NULL

estimated_amount INTEGER NOT NULL

final_amount INTEGER

customer_notes TEXT

cancellation_reason_code VARCHAR

created_at TIMESTAMPTZ NOT NULL

updated_at TIMESTAMPTZ NOT NULL

version INTEGER NOT NULL

Database constraints should enforce facts such as:

scheduled_end_at > scheduled_start_at

duration_minutes > 0

estimated_amount >= 0

final_amount >= 0

Foreign keys should ensure that referenced customers, services and addresses exist. PostgreSQL constraints are specifically intended to maintain such relational integrity.

23. Customer Dashboard View

For each booking, show:

Booking code

Pet

Service

Schedule

Address summary

Assigned sitter

Booking status

Payment status

Refund status

Next required action

Report availability

Review status

Support action

Example

Bruno’s Dog Walk

Booking: BK-1001Date: 1 August, 7:00–7:30 AMArea: BopalSitter: RiyaBooking: ConfirmedPayment: Paid

Next action:

Keep Bruno’s harness ready before 7:00 AM.

24. Sitter Dashboard View

For an assigned booking, show:

Booking code

Service

Approximate area before assignment

Exact address after confirmation

Pet profile

Relevant risk and handling instructions

Schedule

Payout

Current status

Start-service action

Emergency action

Report submission

The sitter should not be able to manually alter:

Customer price

Payment status

Risk level

Booking ownership

Refund state

Final payout

25. Admin Dashboard View

The booking detail screen should contain:

Summary

Booking code

Customer

Pet

Service

Schedule

Current status

Amount

Payment state

Risk

Service-specific pet risk

Matching controls

Current-health declaration

Restrictions

Assignment

Offers sent

Declines

Primary sitter

Backup sitter

Replacement history

Timeline

Every booking-status transition

Payment event

Notification

Sitter check-in

Report

Review

Cancellation

Incident

Finance

Payment

Refund

Sitter payout

Adjustment

Contribution

Safety

Incident status

Evidence

Restrictions

Corrective actions

26. Required Tests

Normal journey

REQUESTED

→ PENDING_ADMIN_REVIEW

→ SITTER_MATCHING

→ SITTER_ASSIGNED

→ PAYMENT_PENDING

→ CONFIRMED

→ SERVICE_STARTED

→ SERVICE_COMPLETED

→ REPORT_SUBMITTED

→ CLOSED

Payment tests

Successful captured payment

Failed payment

Browser closes after payment

Duplicate webhook

Out-of-order webhook

Two payment attempts

Wrong amount

Invalid signature

Partial refund

Full refund

Assignment tests

Two sitters accept simultaneously

Sitter becomes unavailable before assignment

Primary sitter cancels

Backup accepts

No replacement exists

Sitter has overlapping booking

Expired permission

Service tests

Sitter starts too early

Sitter starts cancelled booking

Customer inaccessible

Sitter no-show

Incident during service

Report missing

Report contains safety concern

Security tests

Customer accesses another booking

Sitter accesses an unassigned address

Sitter changes the price

Customer confirms their own payment

Support agent approves a refund

Ordinary admin closes critical incident

Duplicate request creates duplicate bookings

27. Definition of Done

The Booking Module is ready only when:

Lifecycle

Every allowed transition is explicitly defined.

Invalid transitions are rejected server-side.

Current status and complete history are available.

Cancellation, replacement, incident and no-show flows work.

Review does not block closure permanently.

Assignment

Primary, backup and replacement assignments are separate records.

Only eligible sitters may be assigned.

Double-booking is prevented.

Historical assignments remain visible.

Customer approval is recorded.

Payment

Final price is calculated server-side.

Razorpay order is created server-side.

Signature is verified.

Captured status is checked.

Webhooks are validated and idempotent.

Booking does not confirm from the frontend callback alone.

Refunds are separate from booking status.

Reports

Every completed service requires a report or authorised exception.

Reports are service-specific.

Concern flags create safety review.

Material edits are versioned.

Media remains private.

Security

Customer accesses only their bookings.

Sitter accesses only authorised assignments.

Exact addresses are released only when operationally required.

Sensitive actions are audited.

Admin permissions are separated.

Reliability

Concurrent assignment attempts are safe.

Duplicate webhook delivery is safe.

Notification failure does not corrupt booking state.

Database constraints protect core integrity.

Failed workflows can be retried safely.

Final Recommended Production Logic

Booking status

REQUESTED

PENDING_ADMIN_REVIEW

SITTER_MATCHING

SITTER_ASSIGNED

PAYMENT_PENDING

CONFIRMED

SERVICE_STARTED

SERVICE_COMPLETED

REPORT_SUBMITTED

CLOSED

DECLINED

CANCELLED

REPLACEMENT_REQUIRED

NO_SHOW

INCIDENT_HOLD

Payment status

CREATED

PENDING

AUTHORIZED

CAPTURED

FAILED

EXPIRED

CANCELLED

REFUNDED

Refund status

REQUESTED

APPROVED

PROCESSING

PROCESSED

PARTIALLY_PROCESSED

FAILED

REJECTED

Assignment status

OFFERED

VIEWED

ACCEPTED

DECLINED

EXPIRED

ASSIGNED

REMOVED

COMPLETED

NO_SHOW

Report status

DRAFT

SUBMITTED

ADMIN_REVIEW_REQUIRED

DELIVERED

AMENDED

Review status

NOT_ELIGIBLE

PENDING

SUBMITTED

SKIPPED

MODERATION_REQUIRED

PUBLISHED

Final operating principle

Build the booking lifecycle as a controlled state machine, but do not force assignment, payment, refund, report and review information into one status field. Every transition must have clear prerequisites, an authorised actor, a timestamp and an audit record. The server—not the browser—must control prices, assignments, payment confirmation and status transitions.

Simple explanation for professor

“The Booking Module will manage the complete PetSaathi service lifecycle. A customer first submits a request containing the pet, service, location, schedule and instructions. PetSaathi reviews the request and finds an eligible sitter based on service permission, pet risk, availability and location. After the sitter accepts and the customer approves, online payment is collected and verified by the backend before the booking becomes confirmed. The sitter then starts and completes the service, submits a Pet Report Card and the customer may leave a review. The system will keep booking, sitter assignment, payment, refund, report and review statuses separately because these processes can change independently. Every status change will be validated, timestamped and preserved in a history table. Cancellation, replacement, no-show, incident and refund cases will also have controlled workflows. This design allows the Phase 4 MVP to remain lean while using production-quality booking logic from the beginning.”

PetSaathi Phase 4 — Payment Module, End to End 💳🐾

Executive decision

Use Razorpay Standard Checkout as the primary payment method and Razorpay Payment Links as an operational fallback for WhatsApp-assisted or manually handled bookings.

The central rule is correct:

A booking must not become CONFIRMED until the required payment has been captured, unless an authorised administrator records a specific payment override.

However, the proposed status enum needs restructuring. It currently combines:

Payment processing

Payment-link delivery

Refund processing

Customer-facing labels

These should be stored separately so the system remains accurate as payment attempts, refunds and boarding instalments become more complex.

1. Final MVP Payment Policy

### Table 54

| Payment case | Recommended Phase 4 rule |
| --- | --- |
| Trial booking | Full prepayment |
| One-time service | Full prepayment |
| Repeat booking | Full prepayment |
| Prepaid service pack | One upfront payment; deduct service credits |
| Boarding | Deposit first, balance before check-in |
| Urgent replacement booking | Prepaid when operationally possible |
| Active medical emergency | Do not delay emergency action for payment |
| Refund | Admin initiated; provider status tracked |
| Cash | Avoid except documented exceptional cases |
| Internal wallet | Do not build in the first MVP |

Recommended payment principle

Payment secures the booking; the platform does not treat a browser message, payment-link delivery or bank debit claim as proof of payment.

For normal bookings, PetSaathi should consider a payment successful only after the server verifies the checkout signature and confirms that the Razorpay payment is captured. Razorpay recommends creating an Order server-side, passing the Order ID to Checkout, verifying the returned signature on the server and checking that the payment is captured or the order is paid before providing services.

2. Important Status-Model Correction

Proposed enum

UNPAID

PAYMENT_LINK_SENT

PAID

FAILED

REFUND_REQUESTED

REFUNDED

PARTIALLY_REFUNDED

This is understandable for a basic spreadsheet, but it should not become the production backend model.

Problems

PAYMENT_LINK_SENT describes communication, not payment.

PAID does not distinguish authorised from captured payments.

One booking can have several failed attempts before one succeeds.

Boarding may be partially paid without being fully paid.

Refund requests and refund completion are different processes.

A completed booking may later receive a partial refund.

Razorpay Orders remain paid after the associated payment is refunded, so refund information must be stored separately.

3. Recommended Payment State Architecture

Use four separate status systems.

A. Charge status

A charge represents what the customer owes.

DRAFT

DUE

PARTIALLY_PAID

PAID

WAIVED

CANCELLED

OVERDUE

Examples:

Full dog-walk charge

Boarding deposit

Boarding balance

Urgent service surcharge

Manual adjustment

B. Payment status

A payment represents one customer payment attempt.

CREATED

PENDING

AUTHORIZED

CAPTURED

FAILED

EXPIRED

CANCELLED

DISPUTED

Meaning

### Table 55

| Status | Meaning |
| --- | --- |
| CREATED | Razorpay order/payment request created |
| PENDING | Customer started or payment result is unresolved |
| AUTHORIZED | Bank authorised payment but capture is not yet confirmed |
| CAPTURED | Payment successfully collected |
| FAILED | Attempt failed |
| EXPIRED | Payment request or permitted payment period expired |
| CANCELLED | Order/link was intentionally cancelled |
| DISPUTED | Payment is subject to a formal payment dispute |

Use CAPTURED as the backend equivalent of the customer-facing word Paid.

Razorpay’s order lifecycle uses created, attempted and paid; an order becomes paid after a payment is successfully captured. Razorpay also exposes amount_paid and amount_due, including support for partial-payment orders.

C. Refund status

NOT_REQUESTED

REQUESTED

APPROVED

PROCESSING

PROCESSED

PARTIALLY_PROCESSED

FAILED

REJECTED

CANCELLED

Razorpay supports full and partial refunds, but refunds can be initiated only against captured payments. Refund events include creation, successful processing and failure, so PetSaathi must not mark a refund complete immediately after an administrator clicks “Approve.”

D. Payment-link status

Use this only when a Payment Link is actually created.

NOT_CREATED

CREATED

SENT

OPENED

PARTIALLY_PAID

PAID

EXPIRED

CANCELLED

PAYMENT_LINK_SENT belongs here—not in the main payment status.

Razorpay Payment Links can be generated through the Dashboard or API, shared through email, SMS or other channels, assigned expiry dates and configured for partial payments.

4. Simple Customer-Facing Payment Labels

The frontend does not need to expose all internal states.

### Table 56

| Internal condition | Customer-facing label |
| --- | --- |
| No required payment captured | Payment required |
| Attempt in progress | Payment processing |
| Payment captured | Paid |
| Deposit captured, balance remains | Deposit paid — balance due |
| Payment failed | Payment failed |
| Refund approved but unfinished | Refund processing |
| Some amount refunded | Partially refunded |
| Entire eligible amount refunded | Refunded |
| Admin override active | Payment due under approved exception |

This keeps the customer experience simple while preserving production-quality data internally.

5. Core Payment Data Model

booking_charges

Represents amounts owed for a booking.

booking_charges

---------------

id

booking_id

charge_type

description

amount_paise

currency

due_at

status

required_for_confirmation

required_before_service

created_at

cancelled_at

Suggested charge types

FULL_SERVICE

BOARDING_DEPOSIT

BOARDING_BALANCE

ADDITIONAL_PET

URGENT_BOOKING

PEAK_TIME

EXTENSION

DAMAGE_OR_EXPENSE

MANUAL_ADJUSTMENT

payment_orders

Represents Razorpay Orders or Payment Links created by PetSaathi.

payment_orders

--------------

id

booking_id

provider

provider_order_id

provider_payment_link_id

amount_paise

currency

status

partial_payment_allowed

expires_at

created_at

payment_attempts

A customer may attempt payment more than once.

payment_attempts

----------------

id

payment_order_id

provider_payment_id

amount_paise

status

method

signature_verified

failure_code

failure_description

created_at

authorized_at

captured_at

failed_at

Do not overwrite a failed attempt when the customer retries.

Example:

Attempt 1: UPI — FAILED

Attempt 2: Card — FAILED

Attempt 3: UPI — CAPTURED

payment_allocations

Connects captured payments to charges.

payment_allocations

-------------------

payment_attempt_id

booking_charge_id

allocated_amount_paise

This supports:

One payment covering several charges

Several payments covering one boarding charge

Partial payments

Deposit and balance tracking

Accurate partial refunds

payment_events

Stores Razorpay webhook events.

payment_events

--------------

id

provider_event_id

event_type

provider_payment_id

raw_payload_reference

signature_verified

processing_status

received_at

processed_at

error_message

refunds

refunds

-------

id

booking_id

payment_attempt_id

provider_refund_id

amount_paise

reason_code

status

requested_by

approved_by

requested_at

approved_at

processed_at

failure_reason

payment_overrides

payment_overrides

-----------------

id

booking_id

override_type

reason_code

reason_text

approved_by

approved_at

amount_due_paise

payment_due_at

resolved_at

Every override must be auditable.

6. Standard One-Time Payment Flow

This flow applies to:

Trial dog walks

One-time dog walks

One-time home sitting

Normal repeat bookings

End-to-end sequence

Sitter/customer conditions approved

↓

Backend calculates final amount

↓

Booking enters PAYMENT_PENDING

↓

Backend creates Razorpay Order

↓

Frontend opens Razorpay Checkout

↓

Customer attempts payment

↓

Checkout returns payment ID, order ID and signature

↓

Backend verifies signature

↓

Webhook/API confirms CAPTURED status

↓

Charge becomes PAID

↓

Booking becomes CONFIRMED

↓

Receipt and confirmation notifications sent

Step 1 — Calculate price on the server

Never trust an amount sent by the browser.

The backend calculates:

Base service

+ duration

+ additional pets

+ urgency or peak charge

+ approved adjustment

− discount

= final payable amount

Example:

### Table 57

| Item | Amount |
| --- | --- |
| 30-minute walk | ₹149 |
| Additional pet | ₹50 |
| Discount | −₹20 |
| Total | ₹179 |

Store currency values in paise:

₹179 = 17,900 paise

Step 2 — Create the charge

charge_type = FULL_SERVICE

amount = 17900

status = DUE

required_for_confirmation = true

Step 3 — Create Razorpay Order

The server creates an order containing:

Amount

Currency

Unique receipt/reference

Booking reference in notes

Customer information where appropriate

Using Razorpay Orders binds multiple payment attempts to the same order and helps avoid treating each retry as a separate customer obligation.

Step 4 — Open Checkout

The browser receives only:

Razorpay Key ID

Order ID

Amount

Currency

Customer prefill data

Safe booking description

The Razorpay secret key must remain server-side.

Step 5 — Process the Checkout callback

Checkout may return:

razorpay_payment_id

razorpay_order_id

razorpay_signature

Store the payment ID, but do not immediately confirm the booking.

The server must generate and compare the expected HMAC signature using the server-side Order ID and secret. Razorpay explicitly requires server-side signature verification before fulfilling the order.

Step 6 — Confirm captured status

After signature verification:

Check the payment or order through Razorpay’s API, or

Wait for and process the authenticated webhook.

The payment must be captured, not merely authorized, before the normal booking becomes confirmed. Razorpay recommends verifying that the payment is captured and the order is paid before providing the service.

Step 7 — Confirm booking atomically

In one database transaction:

Verify booking is still PAYMENT_PENDING.

Verify active sitter assignment exists.

Verify captured amount equals required amount.

Mark payment CAPTURED.

Mark charge PAID.

Move booking to CONFIRMED.

Add status-history record.

Create receipt.

Add notification events.

Commit transaction.

7. Payment Confirmation Guard

A normal booking may transition to CONFIRMED only when:

active_primary_sitter_assignment = true

AND

captured_amount

>= confirmation_required_amount

AND

no_active_payment_block = true

AND

no_unresolved_risk_block = true

In pseudologic:

if requiredChargesPaid || validAdminOverride:

confirmBooking()

else:

rejectTransition()

The customer, sitter and ordinary support agent must not be able to directly set:

booking.status = CONFIRMED

8. Trial Booking Payment

Rule

Trial bookings require full prepayment.

Flow

Trial request accepted

→ Sitter proposed

→ Customer approves

→ Full payment captured

→ Trial booking confirmed

Why

Trial bookings involve:

A new customer

A reserved sitter slot

Increased operational supervision

A higher chance of cancellation or uncertainty

Therefore, trial bookings should not normally receive payment overrides.

Exception

Only use an override for:

An internal test booking

A specifically authorised promotional booking

A documented society pilot funded by PetSaathi

Record the discount or subsidy separately instead of pretending the booking was paid.

9. Repeat Customer Payment

MVP rule

Repeat customers still prepay each booking.

Being a repeat customer should make booking easier, not bypass payment controls.

Use:

Saved pet details

Saved address

Same-sitter preference

One-click repeat request

Faster matching

Prepaid service packages

Do not build a cash wallet yet

For the MVP, use non-transferable service credits instead.

Example:

10-walk package purchased: 10 credits

Completed walks: 3 credits

Remaining balance: 7 service credits

Service credits should:

Be linked to the customer

Have clear validity

State eligible services

Not be transferable as cash

Be deducted only after a completed service

Be restored when PetSaathi cancels an eligible booking

This provides wallet-like convenience without building a full stored-money system.

10. Boarding Deposit and Balance Flow

Boarding requires a payment schedule rather than one simple payment field.

Recommended MVP model

Use two distinct charges:

### Table 58

| Charge | Example |
| --- | --- |
| Reservation deposit | ₹499 |
| Remaining balance | ₹1,500 |
| Total boarding amount | ₹1,999 |

Why two charges are preferable

Separate charges make it easier to determine:

What secured the host slot

How much remains due

Which amount is refundable

Whether the booking can begin

Which payment should receive a partial refund

Although Razorpay Orders and Standard Payment Links can support partial payments and expose amount_paid and amount_due, separate deposit and balance charges are usually clearer for an early operational MVP.

Boarding flow

Boarding request submitted

↓

Pet and host compatibility reviewed

↓

Host accepts

↓

Customer accepts host and terms

↓

Deposit charge created

↓

Deposit captured

↓

Reservation secured

↓

Balance charge created

↓

Balance reminder sent

↓

Balance captured before check-in deadline

↓

Boarding service authorised to start

Suggested rules

Deposit

Required to reserve the host and dates

Amount and treatment disclosed before payment

Recorded as BOARDING_DEPOSIT

Booking displays Deposit paid — balance due

Balance

Due 24–48 hours before check-in, according to the published policy

Recorded as BOARDING_BALANCE

Service cannot start until captured, unless emergency override exists

Booking state

After the deposit:

booking_status = CONFIRMED

payment_summary = PARTIALLY_PAID

balance_due = ₹1,500

The wording must make clear that the reservation is confirmed but payment is incomplete.

Service-start guard

boarding_balance_charge.status = PAID

must be true before normal boarding check-in.

Alternative: Partial-Payment Link

Razorpay Payment Links allow a first instalment and additional payments against the same link, and may be configured with expiry and reminders.

This can be useful in a manual pilot, but PetSaathi should still create internal records for:

Deposit received

Balance remaining

Due date

Refund treatment

Check-in eligibility

Do not rely only on the link’s status page as the platform ledger.

11. Emergency Payment Flow

The word emergency needs to be separated into two cases.

Case A — Urgent replacement or urgent sitter booking

Examples:

Regular sitter cancels

Customer needs a walker within two hours

Travel plan changes unexpectedly

Rule

Prepaid where operationally possible.

Flow:

Urgent request

→ Admin confirms available sitter

→ Customer approves urgent price

→ Payment captured

→ Booking confirmed

An admin override may be permitted when:

Payment gateway is unavailable

A trusted repeat customer needs immediate replacement

Delay would create a significant pet-welfare issue

Case B — Medical or safety emergency during an active service

Examples:

Pet collapses

Pet is injured

Pet escapes

Serious breathing difficulty

Emergency veterinary transport required

Rule

Do not delay emergency action while waiting for payment.

Operational actions proceed first:

Contact veterinary support.

Contact owner and emergency contact.

Arrange authorised transport.

Record owner authorisation and expense approval.

Create charges or reimbursement records afterward.

The payment module must support:

EMERGENCY_EXPENSE

VET_TRANSPORT

ADDITIONAL_CARE_TIME

These charges require evidence and admin review before collection.

12. Razorpay Payment Links

Primary versus fallback use

Primary method

Use Razorpay Standard Checkout inside the Customer Dashboard.

Fallback method

Use a Payment Link when:

Customer is completing payment through WhatsApp

Booking was created manually by support

Customer cannot access the dashboard

A balance or adjustment is being collected

Boarding instalments are handled manually

A temporary operational recovery is required

Razorpay allows Payment Links to be created through the Dashboard or API and shared with customers; links can also have expiry dates, reminders and partial-payment functionality.

Payment Link fields

Record:

provider_link_id

booking_id

charge_id

amount

minimum_first_payment

short_url

status

created_at

sent_at

expires_at

cancelled_at

Always include a unique booking or charge reference.

13. Webhook Processing

Webhooks are necessary because:

The customer may close the browser after paying.

Network connectivity may interrupt the callback.

Payment status may change after the original attempt.

Refund processing is asynchronous.

Duplicate or out-of-order events may arrive.

Razorpay says webhook signatures must be calculated from the raw request body. It also warns that duplicate events are expected and that events may not always arrive in chronological order. The x-razorpay-event-id header can be used to detect previously processed events.

Correct webhook process

Webhook received

↓

Read raw request body

↓

Verify X-Razorpay-Signature

↓

Read provider event ID

↓

Check whether event already processed

↓

Store event

↓

Lock related payment/order record

↓

Apply valid state update

↓

Recalculate booking payment summary

↓

Create audit and notification events

↓

Return success response

Never

Parse and reconstruct the body before signature verification

Trust an unsigned webhook

Confirm the same booking twice

Assume event arrival order

Delete failed webhook records

Trigger duplicate package credits or refunds

14. Refund Workflow

Refund request flow

Customer/support raises refund request

↓

Admin reviews booking and policy

↓

Refund amount calculated

↓

Authorised finance admin approves

↓

Backend calls Razorpay Refund API

↓

Refund status becomes PROCESSING

↓

Webhook/API confirms final result

↓

Customer and ledger updated

Refund authority

### Table 59

| Actor | Permission |
| --- | --- |
| Customer | Request refund |
| Support agent | Create refund case |
| Operations admin | Recommend amount |
| Finance admin | Approve and initiate |
| System | Process provider events |
| Sitter | No customer-refund authority |

Full refund

Example:

Captured payment: ₹299

Refund amount: ₹299

Refund status: PROCESSED

Customer payment summary: REFUNDED

Partial refund

Example:

Captured payment: ₹999

Service completed partially

Approved refund: ₹300

Refund status: PARTIALLY_PROCESSED

Net retained: ₹699

Critical refund rule

An administrator clicking “Approve Refund” should not immediately display Refunded.

Use:

APPROVED → PROCESSING → PROCESSED

Razorpay recommends using refund API results for the immediate response and refund webhooks for final status tracking.

Idempotency

Refund requests must be safe to retry after a timeout or server error. Razorpay supports idempotency keys for normal and instant refund requests.

15. Admin Payment Override

Default rule

No captured required payment

= no confirmed normal booking

Permitted override cases

An authorised admin may override when:

Payment gateway outage affects a trusted repeat customer

An urgent sitter replacement is required

A society/corporate customer has approved invoice terms

PetSaathi is funding a promotional trial

An active welfare emergency cannot wait

A bank transfer is visibly pending and management accepts the risk

Do not permit overrides for

Unknown first-time customers without senior approval

Open boarding without a deposit

Customers with unresolved previous non-payment

Sitters requesting informal cash payment

Ordinary convenience

Bypassing payment fees

Required override fields

override_reason_code

override_explanation

approved_by

approved_at

amount_outstanding

due_at

customer_notified

collection_owner

Recommended permission

Only:

FINANCE_ADMIN

SUPER_ADMIN

or a specifically authorised senior operations role may approve the override.

Customer display

Booking confirmed under an approved payment exception. Amount due: ₹[amount] by [date].

Do not display the booking simply as Paid.

16. Booking and Payment Integration

Normal booking

Booking status: PAYMENT_PENDING

Payment status: CREATED

Charge status: DUE

After capture:

Booking status: CONFIRMED

Payment status: CAPTURED

Charge status: PAID

Payment failure

Booking status: PAYMENT_PENDING

Payment attempt: FAILED

Charge status: DUE

The customer can retry without creating another booking.

Boarding deposit paid

Booking status: CONFIRMED

Deposit charge: PAID

Balance charge: DUE

Payment summary: PARTIALLY_PAID

Cancelled and refund processing

Booking status: CANCELLED

Payment status: CAPTURED

Refund status: PROCESSING

Refunded completed booking

Booking status: CLOSED

Payment status: CAPTURED

Refund status: PARTIALLY_PROCESSED

The service history remains completed even after a customer receives compensation.

17. Payment Notifications

### Table 60

| Event | Customer notification |
| --- | --- |
| Payment required | Payment link/checkout available |
| Payment attempt failed | Retry payment |
| Payment pending | Do not pay again yet |
| Payment captured | Receipt and booking confirmation |
| Boarding deposit paid | Reservation secured; balance and due date |
| Balance reminder | Outstanding amount and deadline |
| Refund requested | Request received |
| Refund approved | Refund being processed |
| Refund completed | Amount and reference |
| Refund failed | Support reviewing the issue |

All notification messages should include:

Booking code

Amount

Relevant due date

Safe payment route

Support contact

Do not place sensitive payment credentials in notifications.

18. Daily Payment Reconciliation

Run a scheduled reconciliation job that compares:

PetSaathi payment records

Razorpay payment/order states

Refund states

Booking confirmation state

Captured amount

Charge amount

Package credits

Reconciliation flags

CAPTURED_BUT_BOOKING_NOT_CONFIRMED

BOOKING_CONFIRMED_WITHOUT_PAYMENT

AMOUNT_MISMATCH

DUPLICATE_CAPTURE

REFUND_STATUS_MISMATCH

PAYMENT_WITHOUT_BOOKING

EXPIRED_LINK_STILL_ACTIVE

BALANCE_OVERDUE

Payment confirmation should normally be real-time, but reconciliation catches missed callbacks, delayed events and operational errors.

19. Security Requirements

Mandatory controls

Create Razorpay Orders only on the server.

Calculate price only on the server.

Keep Razorpay Key Secret server-side.

Verify Checkout signatures.

Verify webhook signatures using the raw body.

Store and deduplicate provider event IDs.

Process events idempotently.

Confirm captured status before service.

Restrict refund approvals by role.

Audit overrides, refunds and manual adjustments.

Separate test and live credentials.

Do not store card details.

Do not send payment secrets to analytics or logs.

Rate-limit order and payment-link creation.

20. Important Edge Cases

Customer pays but closes the page

The webhook confirms the payment and the booking becomes confirmed without relying on the browser.

Customer says money was debited, but status is pending

Show:

Payment verification is pending. Do not pay again yet.

Run API/webhook reconciliation before creating a second order.

Two payment attempts succeed

Confirm only once.

Flag excess capture.

Create refund-review case for the duplicate amount.

Do not issue two sitter assignments or two package-credit allocations.

Sitter cancels after customer pays

Begin replacement flow.

Preserve captured payment.

Ask the customer to approve the replacement.

Refund according to policy when no acceptable replacement exists.

Price changes after risk review

Cancel or supersede the earlier unpaid charge.

Show the revised breakdown.

Require explicit customer acceptance.

Never silently charge a higher amount.

Payment Link expires

Keep the booking PAYMENT_PENDING.

Cancel the old link.

Create a new link/order if the slot remains available.

Reconfirm price and sitter availability when necessary.

Refund API times out

Retry with the same idempotency key rather than creating another refund.

Boarding balance not paid

Send reminders.

Block check-in after the deadline.

Apply the disclosed cancellation policy.

Do not let the sitter informally collect the balance.

21. Required Test Cases

Checkout

Successful UPI payment

Successful card payment

Failed payment

Cancelled checkout

Invalid signature

Wrong amount

Browser closes after success

Pending or late-authorised payment

Two payment retries

Duplicate successful payment

Webhooks

Valid signature

Invalid signature

Duplicate event ID

Events delivered out of order

Unknown payment

Webhook retry

Processing failure followed by retry

Boarding

Deposit succeeds

Deposit fails

Balance succeeds

Balance overdue

Partial payment

Cancellation after deposit

Partial refund after boarding change

Refunds

Full refund

Partial refund

Duplicate refund request

Refund API timeout

Refund processed webhook

Refund failed webhook

Refund against non-captured payment

Admin override

Approved trusted-customer override

Unauthorised support-agent attempt

Override without reason

Outstanding amount collected later

Overdue override escalated

22. Payment Module Definition of Done

The Payment Module is ready only when:

Collection

Price is generated server-side.

Razorpay Orders are generated server-side.

Standard Checkout works in test and live environments.

Checkout signature is verified.

Captured status is confirmed.

Payment retries do not create duplicate bookings.

Payment Links work as a controlled fallback.

Status architecture

Payment, charge, refund and link statuses are separate.

Failed attempts remain in history.

Partial payments are supported.

Boarding deposit and balance are separate.

PAID means captured, not merely initiated.

PAYMENT_LINK_SENT is not treated as payment.

Booking integration

Unpaid normal bookings cannot become confirmed.

Valid overrides require an authorised admin and reason.

Boarding cannot start with an unpaid balance.

Payment failure does not delete the booking request.

A refund does not overwrite the completed service history.

Refunds

Customer can request.

Admin can review and approve.

Refund API is called server-side.

Idempotency is used.

Final status comes from provider reconciliation.

Full and partial refunds are supported.

Refund history cannot be silently edited.

Reliability

Webhook signatures are validated.

Raw request body is retained for validation.

Duplicate webhooks are safe.

Out-of-order events are safe.

Daily reconciliation exists.

Amount mismatches generate alerts.

Notification failure does not corrupt payment status.

Security

Secrets remain server-side.

Role permissions are enforced.

Manual adjustments are audited.

Payment data is excluded from analytics.

Test and live credentials are isolated.

No customer is instructed to pay a sitter’s personal UPI account.

Final Recommended Backend States

Payment status

CREATED

PENDING

AUTHORIZED

CAPTURED

FAILED

EXPIRED

CANCELLED

DISPUTED

Charge status

DRAFT

DUE

PARTIALLY_PAID

PAID

WAIVED

CANCELLED

OVERDUE

Refund status

NOT_REQUESTED

REQUESTED

APPROVED

PROCESSING

PROCESSED

PARTIALLY_PROCESSED

FAILED

REJECTED

CANCELLED

Payment Link status

NOT_CREATED

CREATED

SENT

OPENED

PARTIALLY_PAID

PAID

EXPIRED

CANCELLED

Customer-facing summary

PAYMENT_REQUIRED

PAYMENT_PROCESSING

PARTIALLY_PAID

PAID

PAYMENT_FAILED

REFUND_PROCESSING

PARTIALLY_REFUNDED

REFUNDED

Final Operating Principle

The Payment Module should treat the booking obligation, individual payment attempts, Payment Links and refunds as separate records. Normal bookings become confirmed only after the required payment is captured and verified by the backend. Boarding uses a deposit-and-balance schedule, urgent welfare action may use an audited exception, and refunds remain admin-controlled but are considered complete only after Razorpay confirms processing.

Simple explanation for professor

“PetSaathi will use Razorpay for prepaid customer bookings. Trial services, one-time services and normal repeat bookings will require full payment before confirmation. The backend will calculate the price, create a Razorpay Order and verify both the payment signature and captured status before changing the booking to confirmed. Payment Links will be used only as a fallback for manual or WhatsApp-assisted bookings. Boarding will use two payment stages: a deposit to reserve the host and a balance that must be paid before check-in. Medical or safety emergencies will not be delayed for payment, but any resulting expenses will be documented and reviewed afterward. Payment, refund and Payment Link statuses will be stored separately because each process has its own lifecycle. Customers may request refunds, but only authorised administrators can approve them, and the system will mark the refund complete only after Razorpay confirms it. Every payment attempt, refund, override and status change will remain auditable.”

PetSaathi Phase 4 — Sitter Dashboard, End to End 🐾📱

Core objective

The Sitter Dashboard should let an approved or probationary caregiver complete the full work journey digitally:

Log in → manage availability → receive eligible booking offer → accept or decline → review authorised pet details → complete service → submit updates and report → view payout and performance

The dashboard is not merely a sitter profile page. It is an operational tool for:

Assignment control

Pet-safety instructions

Service evidence

Incident escalation

Report-card submission

Payout transparency

Performance monitoring

1. Important corrections to the proposed flow

Your proposed flow is:

Login

↓

View assigned booking

↓

Accept booking

↓

View pet details

↓

Start service

↓

Upload updates

↓

Submit report card

↓

Booking completed

↓

Payout pending

The main structure is correct, but four changes are necessary.

Correction 1 — A sitter first receives an offer, not an assignment

Before the sitter accepts, the booking should be called:

Booking Offer

The sitter becomes assigned only after:

PetSaathi confirms that the sitter is eligible.

The sitter accepts the offer.

Admin confirms the match.

The customer approves the proposed sitter where required.

Payment and confirmation conditions are satisfied.

Correct flow:

Booking offer received

↓

Sitter reviews limited booking details

↓

Sitter accepts or declines

↓

Admin/customer approval

↓

Booking confirmed

↓

Sitter receives full service details

Platforms such as Rover also let providers decide whether to accept or decline requests based on their preferences and calendar availability, reinforcing the need to distinguish a request from a confirmed booking.

Correction 2 — Do not show every pet or address detail before confirmation

Before acceptance, show only what the sitter needs to decide whether they can perform the service:

Service type

Approximate locality

Date and time

Duration

Pet species

Pet size

Relevant risk summary

Required skills

Proposed payout

Estimated travel time

Do not initially disclose:

Exact home address

Door code

Customer’s full phone number

Complete medical history

Emergency-contact details

Unrelated household information

The full operational information should become available only after the sitter is authorised for the booking.

OWASP recommends deny-by-default access and least privilege, meaning users should receive only the information required for their authorised task.

Correction 3 — “L4 Trained” should not be the main sitter-verification field

Do not show one universal field such as:

Verification level: L4 Trained

That mixes several separate concepts.

Instead store and display:

Identity check status

Interview status

Training status

Practical-assessment status

Service permissions

Boarding-property status

Operational status

Performance tier

Rover similarly displays distinct badges for separate evidence such as a completed background check and passing a knowledge quiz; it does not treat those as the same trust check.

Correction 4 — Completing the report does not automatically release payment

After report submission, the booking should pass through operational completion checks:

Report submitted

↓

Concern/incident check

↓

Admin review where required

↓

Booking closed

↓

Payout becomes eligible

↓

Payout processed

A normal booking may be paid automatically after the required checks, while a disputed booking may require a controlled hold on only the affected amount.

2. What the sitter can do

### Table 61

| Capability | MVP treatment |
| --- | --- |
| Log in securely | Required |
| View own profile | Required |
| View approval and training status | Required |
| Update availability | Required |
| View eligible booking offers | Required |
| Accept or decline offers | Required |
| View confirmed assignments | Required |
| Access authorised pet instructions | Required |
| Mark en route and arrived | Recommended |
| Start and complete service | Required |
| Send structured updates | Required |
| Upload photos/videos | Required |
| Open emergency or incident alert | Required |
| Submit Pet Report Card | Required |
| View payout ledger | Required |
| View ratings and performance | Required |
| Request profile changes | Required |
| Change own verification status | Not permitted |
| Change own service eligibility | Not permitted |
| Change customer price or payout | Not permitted |
| Close an incident | Not permitted |

3. Recommended Sitter Dashboard navigation

Mobile navigation

Use five primary tabs:

Home

Offers

Bookings

Earnings

Profile

Additional functions can be accessed from those pages:

Availability

Training

Support

Emergency help

Ratings

Settings

Desktop navigation

Dashboard

Booking Offers

My Bookings

Calendar & Availability

Service Reports

Earnings

Ratings & Performance

Training & Verification

Profile

Support

Do not create twenty top-level navigation items. The sitter interface should prioritise the next operational action.

4. Sitter Dashboard home screen

The home screen should immediately answer:

Do I have a service today?

Is there a new booking offer?

Is a report overdue?

Is my availability current?

Is any verification or training expiring?

Is a payout pending?

Recommended sections

Today’s booking

Example:

Bruno — 30-minute dog walkToday, 7:30 AMBaner, PuneStatus: ConfirmedNext action: Mark En Route

Action required

Possible alerts:

Booking offer expires in 20 minutes

Confirm tomorrow’s booking

Submit report for BK-1042

Update availability for next week

Training refresher due

Identity evidence requires resubmission

Payout information incomplete

Quick actions

Update availability

View next booking

Submit pending report

Contact operations

Open emergency support

Weekly summary

Show:

Completed bookings

On-time rate

Reports completed

Earnings eligible

Customer rating

Repeat-sitter requests

These summaries should be clearly identified as performance information, not guarantees of future work.

5. Sitter login and access

Login flow

Enter mobile number

↓

Receive OTP

↓

Verify OTP

↓

Backend checks sitter account

↓

Dashboard opens according to operational status

Authentication confirms who the user is; authorisation determines what that sitter may access. OWASP treats these as separate controls and recommends checking access on every protected operation.

Status-based login result

Active sitter

Can receive and perform eligible bookings.

Probation sitter

Can receive only controlled trial or Green-risk assignments.

Inactive sitter

Can view profile, history and earnings, but cannot receive new offers.

Retraining required

Can view training requirements but cannot accept restricted services.

Reverification required

Can view evidence requests but may have booking access restricted.

Suspended or under investigation

Can view limited account information, existing payout information and the review process, but cannot accept new assignments.

Removed sitter

Should not receive operational access, though legally or operationally required historical records may remain accessible in a limited form.

6. Sitter profile module

The sitter profile needs separate public, private and operational information.

A. Public sitter profile

Information a customer may see after an appropriate sitter proposal:

### Table 62

| Field | Example |
| --- | --- |
| Public name | Riya S. |
| Profile photo | Approved profile image |
| Approximate locality | Baner, Pune |
| Approved services | Dog walking, home sitting |
| Experience summary | Three years handling family and client pets |
| Languages | English, Hindi, Marathi |
| Completed PetSaathi bookings | 12 |
| Customer rating | 4.8/5 from 10 reviews |
| Public badges | Identity Checked, Training Passed |
| Short bio | Responsible local caregiver experienced with medium and large dogs |

B. Private sitter information

Visible only to authorised internal staff:

Full legal name

Full residential address

Date-of-birth or age-eligibility evidence

Government identity evidence

Emergency contact

Bank details

Background-check evidence

Interview notes

Internal complaints

Internal scorecard

Suspension history

Property-assessment evidence

C. Operational information

Used for matching:

Active city and locality

Service radius

Transport method

Approved service areas

Approved pet species

Approved dog sizes

Maximum risk level

Service permissions

Availability

Maximum daily assignments

Boarding capacity

Backup eligibility

Current operational status

7. Corrected sitter profile fields

Your proposed fields should be implemented as follows.

### Table 63

| Proposed field | Recommended implementation |
| --- | --- |
| Full name | Legal name private; abbreviated public name |
| City | Required operational field |
| Area | Required for matching; approximate area public |
| Services | Derived from active service permissions |
| Verification level | Replace with evidence-specific checks and badges |
| Rating | Show average plus number of completed-service reviews |
| Completed bookings | Count completed PetSaathi bookings |
| Availability | Use calendar rules and exceptions |
| Service radius | Operational field, measured with travel-time limits |
| Bio | Admin-reviewed public text |
| Profile photo | Private upload, customer-visible after approval |
| Intro video | Optional, consent-based and reviewed |
| Badges | Generated from valid evidence records |

Rating must include its sample size

Do not show only:

4.8 rating

Show:

4.8/5 from 10 completed-booking reviews

A 5.0 score from one booking is not equivalent to a 4.8 score from fifty bookings.

Rover lets providers view customer reviews through their public profile, showing how ratings and profile information can be combined while still remaining separate from internal operational metrics.

Intro video rules

An intro video may help customers understand the sitter’s communication style, but it should be optional.

Requirements:

Sitter explicitly agrees to public display.

Video is reviewed before publication.

No customer, home or unrelated pet appears without permission.

No identity document is visible.

File type and size are limited.

Video is stored privately until approved.

Sitter may request removal from the public profile.

OWASP recommends allowing uploads only for authenticated and authorised users and validating file types, filenames, size and storage permissions.

8. Evidence-specific badges

Recommended customer-visible badges include:

### Table 64

| Badge | Requirement |
| --- | --- |
| Identity Checked | Applicable identity evidence passed review |
| Video Interview Completed | Structured interview completed |
| Pet Safety Training Passed | Mandatory modules and quiz passed |
| Dog Walking Approved | Practical walking assessment passed |
| Home Sitting Approved | Home-sitting assessment completed |
| Boarding Home Assessed | Approved host and current property assessment |
| Background Check Completed | Actual background-check process completed |
| Proven Sitter | Defined booking, rating and reliability threshold met |
| Emergency Protocol Trained | Emergency module and simulation passed |

Badge rules

Every badge should have:

Evidence source

Award date

Reviewer

Expiry where applicable

Public/private setting

Revocation status

A badge should disappear or become inactive when its underlying verification expires or is revoked.

9. Service permissions

The sitter profile should not simply say:

Services: walking, sitting

It should store exact permission records.

Example

Dog walking

Status: APPROVED

Species: Dog

Maximum size: Large

Maximum walking risk: Yellow

Area: Baner and nearby approved zones

Maximum simultaneous pets: 1

Home sitting

Status: PROBATION

Species: Dog and cat

Maximum risk: Green

Medication tasks: Not approved

Overnight sitting: Not approved

Boarding

Status: NOT APPROVED

Reason: Property assessment incomplete

Permission statuses

PENDING

PROBATION

APPROVED

RESTRICTED

SUSPENDED

EXPIRED

REVOKED

The dashboard should show these permissions clearly so the sitter understands what assignments they may legally and operationally accept.

10. Availability module

Purpose

The availability module should tell PetSaathi when the sitter can genuinely perform bookings.

Rover provides service- and date-specific availability management and recommends keeping the calendar accurate, demonstrating why availability should be treated as structured operational data rather than a free-text field.

Availability fields

Recurring availability

Example:

### Table 65

| Day | Time |
| --- | --- |
| Monday | 6:00–9:00 AM, 5:00–8:00 PM |
| Tuesday | 6:00–9:00 AM |
| Saturday | 7:00 AM–5:00 PM |

Exceptions

Leave

Examination dates

Travel

Personal appointment

Additional one-time availability

Temporary reduced radius

Capacity

Record:

Maximum walks per morning

Maximum sitting bookings per day

Maximum boarding pets

Minimum travel buffer

Maximum travel time

Emergency-backup availability

Availability states

AVAILABLE

LIMITED

UNAVAILABLE

ON_LEAVE

FULLY_BOOKED

Important rules

The sitter should not be able to make themselves available for:

A suspended service

Boarding at an unapproved property

A pet size outside their permission

A risk level outside their approval

Availability means:

“The sitter may be considered for a booking.”

It does not mean:

“Every booking in that period is automatically acceptable.”

11. Booking offer screen

Information visible before acceptance

Show:

Public booking code

Service type

Date and time

Duration

Approximate area

Estimated travel time

Pet species

Pet size

Number of pets

Relevant handling summary

Risk category appropriate for sitter display

Required tasks

Proposed payout

Accept-by time

Example:

Dog Walking Offer — BK-1001Baner, approximately 1.4 km awayTomorrow, 7:00–7:30 AMOne Labrador, 28 kgWalking assessment: Yellow — strong pullingRequired: Large-dog-approved walkerPayout: ₹105

Information hidden before acceptance

Exact flat number

Door or gate code

Customer’s full phone number

Complete medical record

Emergency-contact information

Internal customer notes

Other sitter offers

Customer payment amount, unless PetSaathi chooses transparent payout economics

12. Accept or decline booking

Accept flow

Sitter opens offer

↓

Reviews service, risk, time and payout

↓

Confirms availability

↓

Accepts offer

↓

Assignment status becomes ACCEPTED

↓

Admin validates final eligibility

↓

Customer approval/payment proceeds

↓

Assignment becomes ASSIGNED

Acceptance confirmation

Before accepting, the sitter should confirm:

I am available for the full service window.

I can reach the location reliably.

I have reviewed the pet size and handling summary.

The service is within my approved permissions.

I accept the stated payout.

I will not send an unauthorised substitute.

Decline flow

Require a structured reason:

TIME_CONFLICT

TOO_FAR

PET_OUTSIDE_COMFORT

SERVICE_OUTSIDE_CAPABILITY

PAYOUT_NOT_ACCEPTED

PERSONAL_UNAVAILABILITY

OTHER

The sitter should not be penalised for declining a booking that does not match approved preferences or availability. Rover similarly lets providers define preferences and decline requests they cannot fulfil.

Offer statuses

OFFERED

VIEWED

ACCEPTED

DECLINED

EXPIRED

WITHDRAWN

Acceptance should not become a final confirmed assignment when:

The customer cancels.

Payment is not completed.

The admin finds a risk mismatch.

Another sitter was already assigned.

The sitter’s eligibility changed before confirmation.

13. Confirmed booking screen

After confirmation, the sitter may see:

Customer information

Customer first name

Operational phone/contact method

Full service address

Building and entry instructions

Handover instructions

Pet information

Pet name and photo

Species and breed

Weight

Relevant behaviour

Bite or escape warning

Pulling or handling instructions

Medical conditions relevant to the service

Food and allergy information

Approved medication task, if any

Equipment instructions

Emergency information

PetSaathi emergency contact

Primary owner contact

Authorised secondary contact

Regular vet

Emergency clinic

Pre-agreed emergency instructions

Financial information

Sitter payout

Bonus where applicable

Payout eligibility conditions

Expected payout timing

14. Pre-service checklist

Before the booking, the sitter should confirm:

Booking date and time

Pet identity

Service type

Address

Customer contact method

Pet-handling instructions

Food and medication restrictions

Emergency contacts

Required equipment

Report requirements

Arrival process

Dog-walking checklist

Collar/harness available

Leash condition confirmed

Approved route understood

Treat restrictions reviewed

Pulling or trigger information reviewed

Weather and surface conditions considered

Home-sitting checklist

Access method confirmed

Restricted rooms understood

Feeding and water instructions reviewed

Exit-security checklist available

Customer privacy rules acknowledged

Boarding checklist

Property approval active

Capacity available

Resident-pet information current

Pet compatibility reviewed

Feeding separation arranged

Emergency transport available

15. Service-day workflow

Recommended workflow:

Confirmed booking

↓

Sitter marks En Route

↓

Sitter marks Arrived

↓

Handover/access completed

↓

Sitter starts service

↓

Structured updates submitted

↓

Concern or incident reported where necessary

↓

Sitter ends service

↓

Pet secured or handed over

↓

Report card submitted

16. Mark En Route and Arrived

En Route

The sitter may select:

Start Travel

Record:

Timestamp

Estimated arrival

Optional location consent/status

Delay reason where applicable

Arrived

Record:

Arrival timestamp

Location confirmation where operationally used

Access problem, if any

Customer handover status

Late arrival rule

When a delay becomes likely, the sitter should:

Inform operations immediately.

Give an honest estimated arrival time.

Avoid marking “arrived” before reaching the location.

Wait for rescheduling or replacement instructions.

17. Start service

The Start Service button should be enabled only when:

Booking status is confirmed.

Logged-in sitter is the active assigned sitter.

Current time is inside the permitted start window.

Booking is not cancelled or on incident hold.

Arrival or handover requirements are complete.

Starting the service records

Actual start timestamp

Sitter ID

Device/session reference

Initial condition check

Optional start photo

Location confirmation where required

The sitter should not be able to start:

Another sitter’s booking

A cancelled booking

An unpaid/unconfirmed booking

A booking outside their service permission

18. Structured service updates

Do not rely only on an unrestricted text box.

Dog-walking updates

Allow the sitter to record:

Start photo

Pee

Poop

Water

Approximate distance

Route issue

Pet mood

Behaviour concern

Mid-walk photo

End photo

Rover Cards provide a comparable structured model, recording service start/stop, photos and events such as pee, poop, food and water; Rover’s walking map may also include route, duration and distance.

Home-sitting updates

Arrival photo where approved

Food provided

Water refreshed

Litter/toilet update

Play

Rest

Medication task

Mood

Home/security concern

Photo/video update

Boarding updates

Settling update

Feeding

Water

Toilet

Rest

Activity

Resident-pet interaction

Separation status

Health observation

Daily photo/video

Pickup preparation

19. Photo and video upload

Upload requirements

Authenticated sitter

Active assigned booking

Approved file types

File-size limit

Private storage

Randomised storage filename

Malware/security scanning where available

Media linked to booking and report

Access audit where required

OWASP recommends authenticating and authorising upload users and validating file extension, type and size before storage.

Visibility choices

Each media record should state:

CUSTOMER_VISIBLE

ADMIN_ONLY

INCIDENT_EVIDENCE

PROFILE_PUBLIC

A sitter should not be able to publish customer-home media to their public profile without separate customer permission.

Upload failure

The app should:

Save report data locally or as a server draft where possible.

Show upload failure clearly.

Allow retry.

Prevent duplicate files.

Never falsely display “uploaded” before server confirmation.

20. Concern and emergency reporting

The active booking screen should contain a clearly visible:

Report Concern / Emergency

Concern categories

PET_UNWELL

INJURY

BITE

AGGRESSION

PET_ESCAPED

ACCESS_PROBLEM

EQUIPMENT_FAILURE

CUSTOMER_UNAVAILABLE

PROPERTY_SAFETY

OTHER

Critical flow

Sitter detects issue

↓

Stops unsafe activity

↓

Calls emergency support/vet where required

↓

Notifies owner and admin

↓

Creates incident record

↓

Continues only under authorised instructions

The sitter may open and update an incident, but must not mark a serious incident resolved or closed.

21. Complete service

The Complete Service action should require:

Pet returned, handed over or safely secured

Actual end time

Service tasks confirmed

Concern indicator

Report-card workflow started

Location sharing stopped where applicable

Possible outcome:

SERVICE_STARTED

→ SERVICE_COMPLETED

→ REPORT_PENDING

The customer may see:

Service completed. Report Card is being prepared.

The booking should not yet be operationally closed.

22. Pet Report Card submission

General fields

Booking ID

Pet

Service

Scheduled time

Actual start

Actual end

Duration

Assigned sitter

Dog-walking fields

Distance

Pee

Poop

Water

Waste collected

Mood

Leash behaviour

Interaction with animals/people

Route issue

Photos

Sitter note

Concern

Home-sitting fields

Food

Water

Toilet/litter

Play

Rest

Medication

Mood

Behaviour

Home secured

Photos/videos

Sitter note

Concern

Submission statuses

DRAFT

SUBMITTED

CORRECTION_REQUIRED

ADMIN_REVIEW_REQUIRED

DELIVERED

AMENDED

Report rules

Required fields vary by service.

Only the assigned sitter may submit.

A concern requires additional details.

Material changes create a new version.

Previous versions remain available internally.

Customer-visible and admin-only notes remain separate.

23. When the booking becomes completed

The sitter’s service work is complete when:

Service end is recorded.

Report is submitted.

No mandatory field is missing.

The booking may become fully closed only after:

Report delivery

Incident check

Admin review where required

Payment reconciliation

Payout creation

The sitter should not control the final booking closure.

24. Earnings and payout screen

The earnings page should give the sitter a transparent ledger.

Rover, for example, lets sitters view earnings and withdrawals by year, illustrating the value of keeping earnings history available in the provider account.

Earnings summary

Show:

Earnings this week

Earnings this month

Pending payout

Paid amount

Bonuses

Adjustments

Disputed amount

Booking-level earnings

### Table 66

| Item | Example |
| --- | --- |
| Booking | BK-1001 |
| Service | 30-minute walk |
| Base payout | ₹105 |
| Emergency/peak bonus | ₹0 |
| Adjustment | ₹0 |
| Final sitter earning | ₹105 |
| Status | Payout pending |

Payout statuses

NOT_ELIGIBLE

PENDING_SERVICE_COMPLETION

PENDING_REPORT

READY_FOR_APPROVAL

APPROVED

PROCESSING

PAID

FAILED

DISPUTED

PARTIALLY_HELD

Important payout rule

Do not display the difference between the customer price and sitter payout as hidden “deduction.”

Clearly distinguish:

Customer service price

Sitter agreed payout

Bonus

Adjustment

Tax or statutory deduction where applicable

Final bank payment

25. Ratings and performance

Customer-visible rating

Show:

Average rating

Number of completed-booking reviews

Selected published reviews

Completed booking count

Public badge status

Sitter-visible performance

Show more operational information:

Latest-five-booking score

Latest-ten-booking score

On-time rate

Report completion rate

Customer rating

Repeat requests

Cancellation count

No-show count

Coaching or retraining action

Do not show raw confidential information

The sitter should not automatically see:

Customer’s private complaint details before review

Identity of anonymous safety reporters

Another sitter’s performance

Internal investigation notes

Unverified accusations

Example performance card

Current performance: A — ActiveCustomer rating: 4.8/5 from 10 reviewsOn-time rate: 95%Report completion: 100%Repeat requests: 4Coaching action: None

26. Sitter scorecard relationship

The dashboard may display a summary, but the system should store booking-level components.

### Table 67

| Factor | Maximum points |
| --- | --- |
| Safety and pet handling | 25 |
| On-time arrival | 15 |
| Communication | 15 |
| Instruction compliance | 15 |
| Report quality | 10 |
| Customer rating | 15 |
| Administrative reliability | 5 |
| Total | 100 |

A serious safety or integrity violation should override the numerical score and trigger a review.

27. Correct state models

Do not use one sitter-dashboard status for everything.

A. Operational sitter status

ACTIVE

INACTIVE

PAUSED_BY_SITTER

REVERIFICATION_REQUIRED

RETRAINING_REQUIRED

UNDER_INVESTIGATION

SUSPENDED

REMOVED

B. Booking-offer status

OFFERED

VIEWED

ACCEPTED

DECLINED

EXPIRED

WITHDRAWN

C. Assignment status

ACCEPTED

ASSIGNED

REMOVED

REPLACED

COMPLETED

NO_SHOW

D. Service-execution status

NOT_STARTED

EN_ROUTE

ARRIVED

IN_PROGRESS

SERVICE_COMPLETED

REPORT_PENDING

FINISHED

E. Report status

DRAFT

SUBMITTED

CORRECTION_REQUIRED

DELIVERED

AMENDED

F. Payout status

NOT_ELIGIBLE

PENDING

APPROVED

PROCESSING

PAID

FAILED

DISPUTED

28. Recommended backend tables

Sitter profile

sitter_profiles

sitter_public_profiles

sitter_operational_status_history

sitter_service_permissions

sitter_badges

sitter_verifications

Availability

sitter_availability_rules

sitter_availability_exceptions

sitter_capacity_limits

Bookings

bookings

booking_pets

booking_offers

booking_assignments

booking_status_history

booking_events

Service execution

service_checkins

service_updates

booking_reports

report_media

incidents

incident_events

Performance and money

reviews

sitter_booking_scores

sitter_performance_summaries

payouts

payout_adjustments

29. Essential backend rules

Profile access

A sitter may access only:

sitter_profile.user_id = authenticated_user.id

Offer visibility

A booking offer is visible only when:

It was explicitly sent to that sitter.

Offer has not expired.

Sitter remains eligible.

Booking remains in matching state.

Acceptance

An offer may be accepted only when:

Offer status is OFFERED or VIEWED.

Sitter status permits new work.

Service permission remains valid.

Availability still matches.

No conflicting assignment exists.

Booking has not already been assigned.

Pet details

Full pet details are visible only when:

The sitter has an active authorised assignment.

The information is necessary for that service.

The assignment has not been removed.

Start service

Allowed only when:

Booking is confirmed.

Sitter is the active assignment.

Service start window is valid.

Booking is not cancelled or held.

Report submission

Allowed only when:

Sitter completed the assigned service.

Booking belongs to the sitter.

Required report fields are present.

Earnings

The sitter may view only their own payout records.

These checks must occur on the server. Frontend visibility alone does not enforce access control.

30. Sitter notifications

### Table 68

| Event | Notification |
| --- | --- |
| New booking offer | In-app + WhatsApp/push |
| Offer expiring | In-app reminder |
| Offer accepted | Confirmation |
| Customer approved | Assignment update |
| Booking confirmed | Full booking details |
| Upcoming booking | Advance reminder |
| Booking changed | Immediate update |
| Customer cancelled | Immediate update |
| Replacement needed | Urgent offer |
| Report overdue | Reminder |
| Payout approved | Earnings update |
| Payout paid | Payment confirmation |
| Verification expiring | Advance warning |
| Training due | Dashboard alert |

Notification failure must not change the booking or assignment status. The database remains the source of truth.

31. What not to build yet

Defer these sitter features:

Full live customer chat

Public bidding on bookings

Sitter-controlled pricing

Instant access to all customer requests

Automatic approval of profile changes

Public sitter social feed

Tips wallet

Complex tax dashboard

AI-generated sitter grading

Automated incident decisions

Public comparison with other sitters

Unrestricted substitution

Self-approved service expansion

The MVP should optimise service execution and safety, not become a general freelancer marketplace.

32. Important edge cases

Two sitters accept simultaneously

The backend should allow only one active assignment. The other accepted offer should become:

WITHDRAWN — BOOKING FILLED

Sitter accepts but customer does not pay

The assignment may remain provisionally held until a deadline, then return to matching.

Sitter becomes unavailable after confirmation

The sitter must use:

Report Unavailability

The booking enters replacement workflow. The sitter must never send a friend or substitute.

Pet information changes before service

When the customer reports:

New bite incident

Vomiting

Medication change

Increased aggression

Equipment problem

the booking should return to risk/admin review.

Sitter loses internet connection

Allow:

Cached essential instructions

Draft report

Emergency contact access

Do not allow offline completion to become final until synchronised with the server.

Media upload fails

The text report should remain saved as a draft, with upload retry clearly shown.

Incident occurs before report submission

The incident workflow takes priority. The report remains pending but should not hide the emergency response.

Payout fails

The booking remains completed. Finance investigates the payout record without reversing the completed service status.

33. Required test journeys

Normal sitter journey

Login

→ View offer

→ Accept

→ Booking confirmed

→ View pet instructions

→ Mark en route

→ Arrive

→ Start

→ Add updates

→ Complete

→ Submit report

→ View pending payout

Decline journey

Offer

→ Review

→ Decline with reason

→ Availability remains accurate

Replacement journey

Confirmed booking

→ Primary sitter unavailable

→ Operations opens replacement

→ Backup accepts

→ Customer approves replacement

→ New sitter completes service

Incident journey

Service in progress

→ Sitter opens emergency action

→ Calls support/vet

→ Incident created

→ Service placed on hold

→ Admin controls resolution

Security tests

Attempt to confirm that:

Sitter A cannot view Sitter B’s booking.

Sitter cannot view an unassigned customer address.

Suspended sitter cannot accept an offer.

Walker cannot accept unapproved boarding.

Sitter cannot change payout amount.

Sitter cannot mark identity check as passed.

Sitter cannot close an incident.

Removed assignment loses access to pet details.

Media URLs are not publicly accessible.

34. Definition of done

The Sitter Dashboard is ready only when:

Account and profile

Sitter can log in securely.

Public and private profile data are separated.

Verification checks and service permissions are separate.

Sitter cannot approve their own evidence.

Public badges are evidence-based.

Availability

Recurring slots are supported.

One-time exceptions are supported.

Time conflicts are detected.

Suspended services cannot be made available.

Availability changes are auditable.

Booking offers

Sitter sees only eligible offers.

Approximate details appear before acceptance.

Exact sensitive details appear only after authorisation.

Acceptance and decline reasons are recorded.

Simultaneous acceptance is handled safely.

Service execution

En route, arrival, start and completion work.

Only the assigned sitter can execute the booking.

Required checklists are enforced.

Safety and emergency actions are prominent.

Reports and media

Service-specific reports work.

Drafts can be saved.

Uploads are private and validated.

Concern flags create the correct safety workflow.

Report amendments are versioned.

Earnings

Booking-level payouts are transparent.

Pending and paid earnings are separated.

Bonuses and adjustments are explained.

Sitter sees only their own financial records.

Ratings

Average rating includes the review count.

Internal performance differs from the public rating.

Serious incidents override the ordinary score.

Private complaints are handled appropriately.

Corrected final Sitter MVP flow

Sitter logs in

↓

Dashboard checks operational status

↓

Sitter updates availability

↓

Eligible booking offer received

↓

Sitter reviews service, risk, location and payout

↓

Sitter accepts or declines

↓

Admin/customer/payment confirmation

↓

Booking becomes confirmed

↓

Sitter receives authorised pet and address details

↓

Sitter reviews pre-service checklist

↓

Marks en route and arrived

↓

Starts service

↓

Sends structured updates and private media

↓

Reports emergency or concern where necessary

↓

Completes service

↓

Submits Pet Report Card

↓

Report reviewed/delivered

↓

Booking closed

↓

Payout becomes eligible and is processed

↓

Rating and performance records update

Final operating principle

The Sitter Dashboard must give the caregiver enough information and control to perform an authorised service safely, while preventing access to unrelated customer data or actions outside the sitter’s permission. Booking offers, confirmed assignments, service execution, reports and payouts must remain separate controlled stages.

Simple explanation for professor

“The PetSaathi Sitter Dashboard will allow approved caregivers to manage their profile, availability, booking offers, services, reports and earnings. A sitter will first receive a limited booking offer showing the service, approximate area, pet size, relevant handling requirements and payout. The sitter may accept or decline it. Acceptance does not immediately confirm the booking; PetSaathi must still complete the admin, customer and payment confirmation process. After confirmation, the sitter receives the exact address, pet-care instructions and emergency information required for that assignment. On the service day, the sitter marks themselves en route, records arrival, starts the service, sends structured updates and uploads private photographs or videos. Any safety concern opens an incident process that the sitter cannot close independently. After safely completing the service, the sitter submits a Pet Report Card. The booking is then reviewed and closed, and the payout moves from pending to paid. The sitter’s profile will display evidence-specific badges, approved services, booking count, rating and review count rather than one misleading L0-to-L8 verification level.”

PetSaathi Phase 4 — Report Card Module, End to End 🐾📋

Executive decision

The Report Card Module should be mandatory after every completed service.

Its purpose is to create structured evidence of:

When the service occurred

What care was provided

How the pet behaved

What updates were observed

Whether any concern occurred

Which photos or videos were shared

Your proposed structure is strong, with four important corrections:

The sitter should normally submit the report. An admin may submit or correct it only in an exceptional, auditable situation.

A concern must do more than create a note. Urgent concerns should automatically open the incident workflow.

Photos should be required, but videos should be conditional. Requiring a video after every short walk may create unnecessary upload, privacy and bandwidth problems.

GPS and route tracking should remain optional during the MVP. Manual distance, start/end time and optional live-location use are sufficient initially.

Rover Cards provide a useful industry example: sitters start and stop a service record, attach photographs and record events such as pee, poop, food and water. Rover’s walking map can additionally show the route, total time and distance, but those route features do not need to be copied into PetSaathi’s first MVP.

1. Purpose of the Report Card

The Report Card should serve five users.

### Table 69

| User | Why the report matters |
| --- | --- |
| Customer | Confirms what happened during the service |
| Sitter | Creates a professional service-completion record |
| Operations | Detects incomplete or poor-quality service |
| Safety team | Identifies concerns and incidents |
| Product team | Produces structured quality and performance data |

The report is not simply a WhatsApp message such as:

“Walk completed, Bruno was good.”

It should produce searchable and auditable data linked to:

Booking

Customer

Pet

Assigned sitter

Service type

Actual service time

Media

Incident, where applicable

Customer review

Sitter score

2. Correct End-to-End Workflow

Booking confirmed

↓

Sitter checks in

↓

Draft report automatically created

↓

Sitter records updates during service

↓

Sitter checks out

↓

System calculates actual duration

↓

Sitter completes required fields

↓

Sitter selects concern status

↓

Report validated

↓

Sitter submits report

↓

Admin review, when required

↓

Report delivered to customer

↓

Customer review requested

↓

Booking closed

Important separation

The following should remain separate:

### Table 70

| Record | Meaning |
| --- | --- |
| Booking status | Overall service lifecycle |
| Report status | Preparation and delivery of the report |
| Incident status | Safety concern or investigation |
| Review status | Customer feedback |
| Sitter score | Internal performance evaluation |

For example:

Booking status: SERVICE_COMPLETED

Report status: ADMIN_REVIEW_REQUIRED

Incident status: TRIAGING

Review status: NOT_ELIGIBLE

This is clearer than trying to represent everything through one booking status.

3. Who Submits the Report?

Primary rule

The assigned sitter submits the report.

The person who performed the service should record the observations.

Admin submission exception

An admin may submit on behalf of the sitter only when:

The sitter has a genuine technical problem.

The original information exists in WhatsApp, phone notes or another authorised record.

The admin records why they submitted it.

The system identifies the sitter as the service provider.

The system identifies the admin as the submitting actor.

The customer-visible report is not fabricated or guessed.

Example audit record:

Service provider: ST-004

Report entered by: ADMIN-02

Reason: Sitter application upload failure

Source: Completion update and images received through support

Admin correction

An admin may return a report for correction when:

Required fields are missing.

Times are inconsistent.

The report contains inappropriate language.

A concern is mentioned but not classified.

Media belongs to the wrong booking.

Information contradicts an incident record.

The admin should not silently rewrite the sitter’s observations.

4. Correct Field Matrix

Recommended MVP matrix

### Table 71

| Field | Dog walking | Pet sitting | Boarding |
| --- | --- | --- | --- |
| Actual start time | Required | Required | Required |
| Actual end time | Required | Required | Required |
| Actual duration | Calculated | Calculated | Calculated |
| Food update | Conditional | Required when included | Required |
| Water update | Required | Required | Required |
| Pee update | Required | Conditional | Required |
| Poop update | Required | Conditional | Required |
| Mood | Required | Required | Required |
| Behaviour | Required | Required | Required |
| Photos | Required | Required | Required |
| Video | Optional/booking-specific | Optional/booking-specific | Recommended daily |
| Sitter note | Required | Required | Required |
| Concern status | Required | Required | Required |
| Walk distance | Required or unavailable reason | Not applicable | Not applicable |
| Route map | Optional | Not applicable | Not applicable |
| Food quantity | Not applicable normally | Conditional | Required |
| Play/activity | Optional | Required | Required |
| Rest/sleep | Not applicable | Conditional | Required |
| Medication task | Not applicable normally | Conditional | Conditional |
| Home secured | Not applicable | Required | Not applicable |
| Other-pet interaction | Conditional | Conditional | Required where relevant |
| Pickup/handover confirmation | Required | Required | Required |

5. Common Report Fields

Every service report should contain these system fields.

### Table 72

| Field | Example |
| --- | --- |
| Report ID | RPT-1001 |
| Booking ID | BK-1001 |
| Customer ID | C-001 |
| Pet ID | P-001 |
| Sitter ID | ST-004 |
| Service | Dog walking |
| Scheduled start | 7:00 AM |
| Actual start | 7:04 AM |
| Actual end | 7:35 AM |
| Actual duration | 31 minutes |
| Report status | Submitted |
| Submitted at | 7:43 AM |
| Concern severity | None |
| Report version | 1 |

Use complete timezone-aware timestamps internally. PostgreSQL’s timestamp with time zone converts timestamp values to UTC for storage and presents them according to the applicable timezone, making it suitable for reliable service records.

Do not allow manual duration entry

Calculate:

Actual duration = Actual end time − Actual start time

The sitter should not type “30 minutes” when the recorded service lasted 18 minutes.

6. Dog-Walking Report

Required dog-walking fields

Start and end evidence

Record:

Check-in time

Start time

End time

Checkout time

Start photo, where operationally required

Completion photo

Water

Do not use only a yes/no field.

Use:

NOT_REQUIRED

OFFERED_AND_DRANK

OFFERED_AND_REFUSED

WATER_GIVEN_AT_HOME

NOT_AVAILABLE

Pee and poop

Use separate structured fields.

Pee status

OBSERVED

NOT_OBSERVED

UNKNOWN

Poop status

OBSERVED_AND_CLEANED

OBSERVED_NOT_CLEANED

NOT_OBSERVED

UNKNOWN

If poop was not cleaned, require an explanation.

Mood

Use a selectable value plus optional note:

HAPPY_ACTIVE

CALM

TIRED

ANXIOUS

OVEREXCITED

FEARFUL

AGGRESSIVE_BEHAVIOUR_OBSERVED

UNWELL

OTHER

The value AGGRESSIVE_BEHAVIOUR_OBSERVED should not automatically become a medical or behavioural diagnosis. It records what the sitter observed.

Behaviour

Examples:

Calm on leash

Pulled occasionally

Pulled strongly

Barked at another dog

Tried to pick up food

Avoided strangers

Refused to continue walking

Distance

Store:

Distance value

Unit

Source

Accuracy status

Example:

Distance: 1.3 km

Source: MANUAL_ESTIMATE

Possible sources:

MANUAL_ESTIMATE

DEVICE_TRACKED

MAP_CALCULATED

NOT_AVAILABLE

Do not display a manual estimate as an exact GPS measurement.

7. Pet-Sitting Report

Required pet-sitting fields

Food

Use:

NOT_SCHEDULED

FULL_PORTION_EATEN

PARTIAL_PORTION_EATEN

FOOD_REFUSED

FOOD_PREPARED_NOT_OBSERVED

OTHER

Also record:

Food provided

Quantity

Time

Any deviation from instructions

Water

Record:

Bowl checked

Refilled

Pet observed drinking

Pet refused

Concern identified

Toilet or litter update

For dogs:

Pee

Poop

Indoor accident

For cats:

Litter checked

Urination observed

Stool observed

Litter cleaned

Unusual litter behaviour

Play and rest

Record:

PLAYED

RESTED

MIXED_ACTIVITY

PET_DID_NOT_ENGAGE

PET_REMAINED_HIDDEN

Home security

Require a final confirmation:

Door locked

Windows left as instructed

Key returned or stored correctly

Lights/appliances handled as instructed

Restricted rooms not entered

Use a declaration:

I confirm that I completed the customer’s departure and home-security instructions.

Medication task

Medication information should appear only when:

It is part of the approved booking.

The sitter holds the required permission.

Written customer instructions exist.

Record:

Medication

Scheduled time

Given/not given

Reason if not given

Pet response

Customer/admin informed

8. Boarding Report

Boarding should not depend on one single report produced only at checkout.

Recommended boarding structure

Create:

Check-in record

Daily update reports

Final checkout report

Boarding check-in record

Capture:

Handover time

Pet’s visible condition

Existing scratches or injuries

Food and belongings received

Medication received

Behaviour at handover

Customer instructions confirmed

Pickup plan

Daily boarding update

### Table 73

| Field | Requirement |
| --- | --- |
| Food | Required |
| Water | Required |
| Pee/poop | Required |
| Activity | Required |
| Rest/sleep | Required |
| Mood | Required |
| Resident-pet interaction | Required where applicable |
| Medication | Conditional |
| Photo | Required |
| Video | Recommended where promised |
| Concern | Required |
| Sitter note | Required |

Checkout report

Capture:

Final health observation

Final feeding/toilet update

Pickup time

Pet handed to

Belongings returned

Medication returned

Any incident or concern

Customer acknowledgement

9. Photo and Video Rules

Recommended MVP standard

Dog walking

Minimum: one clear service photo

Recommended: start or mid-service photo plus completion photo

Video: optional

Pet sitting

Minimum: one or two relevant photos

Video: optional unless promised in the booking

Boarding

At least one daily photo

Short video recommended when included in the boarding package

Upload controls

Allow only approved formats and sizes.

Suggested internal limits:

### Table 74

| Media | Suggested MVP limit |
| --- | --- |
| Image | Maximum 5–10 MB before compression |
| Video | Maximum 30–60 seconds |
| Images per report | 1–5 |
| Videos per report | 0–1 normally |

These are internal product limits and can be adjusted after pilot testing.

Web applications can use file inputs to let users choose images or videos, but the server must still verify the uploaded content. MDN notes that the accept setting helps guide users toward permitted file types, while OWASP recommends validating extensions, content types, filenames and file size rather than trusting the browser alone.

Security requirements

The backend should:

Validate actual MIME type

Restrict file extension

Enforce size limits

Generate random storage names

Remove original device filenames from public display

Scan files where feasible

Reject executable or unexpected formats

Prevent files from being directly executed

Remove sensitive metadata where appropriate

10. Private Media Storage

Service photographs and videos may reveal:

Customer homes

Addresses

Family possessions

Pet medical conditions

Building layouts

Location metadata

They should therefore be stored in private object storage.

Supabase Storage buckets are private by default and can serve authorised files through authenticated access or time-limited signed URLs. This is appropriate for customer report media because the files should not have permanent public links.

Recommended access

### Table 75

| User | Media access |
| --- | --- |
| Customer | Media from their own bookings |
| Assigned sitter | Media uploaded for their assignment |
| Operations admin | Operationally relevant reports |
| Safety admin | Incident-linked evidence |
| General website visitor | No access |

Marketing use

Service photos should not automatically become marketing content.

Separate consent is required for:

Social media

Website testimonials

Advertisements

Public sitter profiles

Training material

11. Concern Field and Incident Escalation

A simple Concern: Yes/No field is not sufficient.

Recommended concern level

NONE

MINOR_OBSERVATION

FOLLOW_UP_REQUIRED

URGENT

EMERGENCY

Examples

None

Normal service, no concern observed.

Minor observation

Pet appeared slightly tired near the end of the walk.

Follow-up required

Pet refused food and appeared quieter than normal.

Urgent

Pet vomited repeatedly or developed a visible injury.

Emergency

Pet collapsed, had breathing difficulty, escaped or experienced a seizure.

System behaviour

### Table 76

| Concern level | Action |
| --- | --- |
| None | Normal report delivery |
| Minor observation | Display clearly in report |
| Follow-up required | Notify admin and customer |
| Urgent | Create incident and require admin review |
| Emergency | Trigger emergency escalation immediately |

The sitter must not wait until report submission to disclose an emergency. AVMA guidance states that emergency first aid does not replace veterinary care and advises contacting a veterinarian or emergency veterinary hospital during serious events.

Critical rule

The Report Card documents an emergency; it does not replace the emergency response.

12. GPS and Route Tracking

MVP recommendation

Approve the following model:

### Table 77

| Feature | MVP treatment |
| --- | --- |
| Actual start/end time | Mandatory |
| Manual walk distance | Allowed |
| Optional device distance | Allowed |
| WhatsApp live location | Optional operational fallback |
| Stored full GPS route | Not required |
| Continuous background tracking | Build later |
| Customer real-time map | Build later |

Manual GPS workflow

For a dog walk, the sitter may:

Mark service started.

Optionally share WhatsApp live location.

Complete the walk.

Mark service ended.

Enter estimated distance.

Select the distance source.

Submit the report.

WhatsApp allows a user to share live location for a selected length of time and control when that sharing ends. PetSaathi should use it only with appropriate customer/sitter notice and should not treat it as permanent route storage.

Do not copy WhatsApp data automatically

During the MVP:

Do not scrape WhatsApp messages.

Do not attempt to extract a location history from chats.

Do not store the sitter’s continuous location beyond operational need.

Do not describe a manual estimate as “GPS verified.”

Future route tracking

Full route tracking may be added later when PetSaathi can properly handle:

Background-location permission

Battery use

Loss of connectivity

Inaccurate points

Consent and retention

Start/stop failures

Customer display

Safety and privacy complaints

13. Report Status Model

Use:

DRAFT

SUBMISSION_PENDING

SUBMITTED

ADMIN_REVIEW_REQUIRED

CORRECTION_REQUIRED

APPROVED

DELIVERED

AMENDED

LOCKED

Status meanings

### Table 78

| Status | Meaning |
| --- | --- |
| Draft | Sitter is entering information |
| Submission pending | Media or data waiting to upload |
| Submitted | Sitter completed the report |
| Admin review required | Concern or validation rule triggered |
| Correction required | Returned to sitter |
| Approved | Cleared for customer delivery |
| Delivered | Customer can view it |
| Amended | Updated version issued |
| Locked | Normal edits no longer permitted |

Normal path

DRAFT

→ SUBMITTED

→ DELIVERED

→ LOCKED

Concern path

DRAFT

→ SUBMITTED

→ ADMIN_REVIEW_REQUIRED

→ APPROVED

→ DELIVERED

→ LOCKED

Correction path

SUBMITTED

→ CORRECTION_REQUIRED

→ SUBMITTED

→ DELIVERED

14. Automatic Validation Rules

The system should check the report before submission.

Common validation

Actual end is after actual start.

Report belongs to the assigned sitter.

Booking reached SERVICE_COMPLETED.

Required fields are complete.

At least one permitted photo exists.

Concern level is selected.

Sitter note is not empty.

Media uploads have finished.

Dog-walking validation

Distance or unavailable reason is entered.

Pee status is entered.

Poop status is entered.

Water status is entered.

Duration is plausible.

Report does not claim a route was tracked when source is manual.

Pet-sitting validation

Food status is completed when feeding was included.

Water update is completed.

Home-secured confirmation is completed.

Medication status is completed when applicable.

Boarding validation

Required daily report exists.

Feeding and toilet fields are complete.

Other-pet interaction is completed where relevant.

Final checkout report exists before closure.

15. Admin Review Triggers

The system should automatically require review when:

Concern is FOLLOW_UP_REQUIRED, URGENT or EMERGENCY.

Pet injury or illness is mentioned.

Report is submitted substantially late.

Actual service duration is significantly shorter than booked.

Required media is missing.

Distance appears implausible.

Sitter reports access or handover failure.

Customer disputes that service occurred.

The booking involved a probation sitter.

The booking was a controlled boarding beta.

The report was submitted by an admin on behalf of the sitter.

An incident is linked to the booking.

These are workflow rules, not medical judgements.

16. Report Delivery Target

PetSaathi may set the following internal target:

Submit and deliver the Report Card within 30 minutes after service completion.

This should be treated as an internal service-level target rather than a guaranteed universal deadline.

Recommended alert rules:

### Table 79

| Delay | Action |
| --- | --- |
| 15 minutes | Sitter reminder |
| 30 minutes | Overdue alert |
| 60 minutes | Operations escalation |
| Repeated late reports | Sitter score impact or coaching |

An active emergency should take priority over completing the report.

17. Customer Report View

The customer should receive a clean, readable card.

Example

Pet Report Card 🐾

Pet: BrunoService: 30-minute dog walkDate: 15 July 2026Scheduled: 7:30–8:00 AMActual: 7:32–8:03 AMSitter: Riya

### Table 80

| Update | Result |
| --- | --- |
| Water | Offered and drank |
| Pee | Observed |
| Poop | Observed and cleaned |
| Walk distance | Approximately 1.3 km |
| Mood | Happy and active |
| Behaviour | Calm overall; pulled briefly near another dog |
| Concern | None |

Sitter note

Bruno enjoyed the walk and responded well after moving away from a busy area.

Media

Two photographs shared.

Customer actions

After viewing the report:

Rate service

Report an issue

Ask a question

Request the same sitter

Book again

Download a customer-friendly PDF later, if required

The customer should not see:

Internal safety notes

Sitter disciplinary information

Admin score

Unrelated incident records

Private staff comments

18. Editing and Version History

A submitted report must not be silently overwritten.

Amendment record

Store:

Original report version

Updated version

Changed fields

Changed by

Time

Reason

Whether the customer was notified

Example:

Version 1:

Walk distance: 13 km

Version 2:

Walk distance: 1.3 km

Reason:

Sitter corrected typing error

The customer should see:

Updated report — distance corrected at 8:25 AM.

For a material safety change, notify the customer and safety admin.

19. Suggested Database Structure

booking_reports

id

public_report_code

booking_id

sitter_id

service_type

status

actual_start_at

actual_end_at

duration_seconds

mood

behaviour_summary

sitter_note

concern_level

concern_summary

submitted_at

delivered_at

created_by_user_id

submitted_by_user_id

version

created_at

updated_at

walking_report_details

report_id

water_status

pee_status

poop_status

waste_cleaned

distance_metres

distance_source

route_tracking_used

equipment_issue

sitting_report_details

report_id

food_status

food_quantity

water_status

toilet_status

play_status

rest_status

medication_status

home_secured

key_handling_status

boarding_report_details

report_id

report_period_start

report_period_end

food_status

water_status

toilet_status

activity_status

rest_status

other_pet_interaction

medication_status

pickup_status

report_media

id

report_id

media_type

storage_path

mime_type

size_bytes

uploaded_by

captured_at

upload_status

customer_visible

created_at

report_revisions

id

report_id

version

previous_data

new_data

changed_by

reason

created_at

20. Offline and Weak-Network Support

The sitter should be able to save a local report draft when connectivity is weak.

Offline-safe actions

Allow:

Entering notes

Selecting food/water/toilet updates

Saving start/end draft data

Queuing photo uploads

Saving concern description

Server-confirmed actions

Do not treat these as complete until synchronised:

Final report submission

Media upload confirmation

Service completion

Incident creation

Customer delivery

Display:

Saved on this device — waiting to synchronise.

When the connection returns, the app should:

Upload pending media.

Submit report fields.

Check for conflicts.

Receive server confirmation.

Show the final submission timestamp.

21. Privacy and Retention

Report cards may contain personal data because they are linked to:

Customer identity

Home location

Assigned sitter

Photographs

Service history

Incident information

PetSaathi should define:

Who can access reports

How long service media is retained

How long incident evidence is retained

Whether customers can request deletion

Which records must remain for disputes, safety or accounting

How marketing consent differs from service processing

MeitY published the Digital Personal Data Protection Rules, 2025 and an enforcement timeline in November 2025. PetSaathi should therefore design clear notices, access restrictions, security controls and retention processes into the module rather than treating service media as unrestricted content.

22. Required Tests

Normal service

Check in

→ Start

→ Add update

→ End

→ Add photo

→ Submit

→ Deliver

→ Customer reviews

Media tests

Image upload succeeds

Video upload fails

Upload resumes

Unsupported file rejected

Oversized file rejected

Duplicate media prevented

Wrong booking media blocked

Private media URL expires

Timing tests

End time before start time

Sitter forgets to start

Sitter forgets to end

Report submitted one hour later

Timezone shown correctly

Admin corrects a timestamp with reason

Concern tests

Minor concern

Urgent concern opens incident

Emergency occurs before report completion

Report and incident information conflict

Customer receives only approved information

Security tests

Sitter accesses another sitter’s report

Customer accesses another customer’s photos

Public user opens storage link

Admin without safety permission opens incident evidence

Malicious upload is attempted

23. Definition of Done

The Report Card Module is ready only when:

Service logic

Every completed service generates a draft report.

Required fields change according to service.

Actual duration is calculated automatically.

Concern severity is mandatory.

Urgent concerns create incidents.

Report delivery is linked to the correct customer.

Sitter experience

Report can be completed on mobile.

Draft saves automatically.

Upload progress is visible.

Weak-network recovery works.

Missing fields are clearly identified.

Sitter can correct a returned report.

Customer experience

Report is readable on mobile.

Customer can view only their reports.

Customer can report a problem.

Customer can rate and rebook.

Amendments are clearly disclosed.

Admin experience

Overdue reports are visible.

Concern reports enter a review queue.

Admin submissions are attributed.

Corrections are auditable.

Boarding daily reports are trackable.

Security

Media is stored privately.

Signed links expire.

Uploads are validated.

Sensitive media is excluded from analytics.

Permission checks are enforced server-side.

Revisions are preserved.

Final Approved MVP Scope

Build now

Service-specific structured reports

Actual start/end time

Automatic duration

Food, water and toilet updates

Mood and behaviour

Photos

Optional videos

Sitter notes

Concern classification

Manual or optional walk distance

Report review and delivery

Revision history

Incident linking

Private media storage

Build later

Continuous background GPS

Full live route map

Automatic distance calculation

AI-generated report summaries

Automatic mood detection

Video analysis

Public social-media sharing

Complex report analytics

Final Operating Principle

Every PetSaathi service must produce a structured Report Card, but the report must remain proportionate to the service. The sitter records the service, the system validates the evidence, the admin reviews exceptions, and the customer receives a clear summary. GPS is optional during the MVP, while accurate time records, structured care updates, private media and immediate concern escalation are mandatory.

Simple explanation for professor

“After every PetSaathi service, the assigned sitter will submit a structured Pet Report Card. The report will include the actual start and end times, care updates, the pet’s mood and behaviour, photos, sitter notes and any concerns. Dog-walking reports will additionally contain water, pee, poop and estimated distance information. Pet-sitting reports will include feeding, water, play, rest and home-security confirmation. Boarding will use check-in, daily and checkout reports rather than only one final update. GPS route tracking will remain optional during the MVP; the sitter may enter an estimated distance or use optional live-location sharing. If the sitter reports an urgent concern, the system will immediately create an incident instead of waiting for the report to be delivered. Reports and media will remain private, revisions will be recorded and customers will receive the completed report before being asked to review or rebook the service.”

PetSaathi Phase 4 — Review/Rating Module and Admin Dashboard 🐾🚀

Executive decision

Both modules are essential, but two corrections should become official:

A review is booking-linked feedback, not an incident investigation. A low rating, private complaint and safety incident must be stored separately.

“Admin manages everything” should not mean every employee receives unrestricted access. PetSaathi needs one Admin interface with narrowly defined Operations, Support, Verification, Safety and Finance permissions.

The recommended architecture is:

Completed booking

↓

Customer review

├── Public sitter feedback

├── Private PetSaathi feedback

└── Complaint / incident escalation

Admin dashboard

├── Customers and pets

├── Sitters and verification

├── Bookings and reports

├── Payments and payouts

├── Reviews and complaints

├── Incidents

└── Pricing and service areas

Module 8 — Review and Rating System

1. Purpose

The Review Module should create trustworthy, structured evidence about:

Sitter punctuality

Pet-handling quality

Communication

Overall customer experience

Repeat-booking interest

Private concerns

Safety complaints

Pet-care platforms commonly tie feedback to booked services rather than allowing unrestricted anonymous reviews. Rover permits feedback for booked services, normally after care is completed, and PetBacker describes reviews attached to bookings as verified reviews.

2. Official eligibility rule

A customer may submit a review only when:

The booking belongs to that customer.

The physical service has been completed.

The assigned sitter actually performed the service.

No review already exists for that booking.

The booking has not been identified as fraudulent or invalid.

Recommended eligibility condition:

booking.status IN (

SERVICE_COMPLETED,

REPORT_SUBMITTED,

CLOSED

)

AND booking.customer_id = logged_in_customer.id

AND review_does_not_exist = true

A PostgreSQL unique constraint on booking_id can ensure that only one review record exists for a booking, even when two requests arrive simultaneously. PostgreSQL uses unique constraints and indexes to reject duplicate values at the database layer.

3. Customer review fields

### Table 81

| Rating item | Scale | Recommended use |
| --- | --- | --- |
| Sitter punctuality | 1–5 | Internal and public summary |
| Pet handling | 1–5 | Internal and public summary |
| Communication | 1–5 | Internal and public summary |
| Overall experience | 1–5 | Main public star rating |
| Would book again? | Yes/No | Repeat-interest metric |
| Written review | Optional text | Public when authorised |
| Private feedback | Optional text | PetSaathi only |
| Report a problem | Yes/No | Opens complaint flow |
| Publication consent | Yes/No | Controls public display |

Important calculation rule

Use Overall Experience as the sitter’s public star rating.

Do not calculate the main public rating by averaging every sub-score because:

Some customers may skip a category.

Punctuality and pet handling do not necessarily have equal meaning.

Changing the category structure later would change historical ratings.

The other scores should remain useful for:

Coaching

Sitter scorecards

Quality monitoring

Service-specific analysis

4. Recommended review form

Screen 1 — Overall experience

How was your experience with Riya?

★ ★ ★ ★ ★

Screen 2 — Service details

Rate:

Punctuality

Pet handling

Communication

Screen 3 — Future preference

Would you book Riya again?

Yes

No

Not sure

Adding NOT_SURE is useful even though the simplest public interface may show only Yes/No. It prevents uncertain customers from being forced into a negative answer.

Screen 4 — Written feedback

What went well, or what could be improved?

Screen 5 — Private concern

Is there anything you would like to tell PetSaathi privately?

Options:

No concern

Routine service concern

Payment or refund issue

Sitter conduct complaint

Pet-safety concern

Urgent incident

5. Review, complaint and incident must remain separate

Review

A customer’s evaluation of the completed service.

Example:

“Riya was friendly, but she arrived ten minutes late.”

Complaint

A service problem that requires support action.

Example:

“The sitter did not follow the feeding instructions.”

Incident

A safety-sensitive event requiring a formal investigation.

Example:

“The pet escaped during the walk.”

Recommended relationship:

review

├── optional complaint_id

└── optional incident_id

Rover’s feedback policy similarly distinguishes ordinary feedback from allegations of mistreatment or harmful action, which may trigger a customer-service investigation.

A customer may therefore:

Submit five stars and still report a private minor concern.

Submit two stars without alleging a safety incident.

Open a serious incident without publishing a public review.

6. Review status workflow

Use:

PENDING

SUBMITTED

MODERATION_PENDING

PUBLISHED

HIDDEN_PENDING_INVESTIGATION

REMOVED_POLICY_VIOLATION

WITHDRAWN_BY_CUSTOMER

PENDING

Customer is eligible but has not submitted feedback.

SUBMITTED

Review has been saved.

MODERATION_PENDING

Automated or manual policy review is required.

PUBLISHED

Approved customer-visible review.

HIDDEN_PENDING_INVESTIGATION

Temporarily hidden because it may expose personal information or is linked to a serious unresolved complaint.

REMOVED_POLICY_VIOLATION

Removed for a documented content-policy reason.

WITHDRAWN_BY_CUSTOMER

Customer asked PetSaathi to remove their own public review, subject to record-retention requirements.

7. Review moderation rules

PetSaathi should not remove or edit a review merely because it is negative.

Rover’s published review policy states that it generally does not censor or edit reviews but may remove content that violates its terms. That is an appropriate structural principle for PetSaathi.

Permitted moderation reasons

Customer address or phone number exposed

Sitter phone number exposed

Threats or harassment

Hate speech

Spam or promotional content

Review is unrelated to the booking

Proven review manipulation

Impersonation

Extortion

Court-restricted or legally prohibited content

Graphic medical or injury media published inappropriately

Moderation must not be based on

Star rating

Whether the review is commercially inconvenient

Whether the sitter disagrees

Whether the customer requested a refund

Whether the feedback reduces the average rating

Preserve the original

When content is moderated, store:

Original text

Displayed/redacted text

Moderation reason

Moderator

Timestamp

Linked policy version

Do not silently rewrite the customer’s meaning.

8. Sitter response

A sitter-response feature is useful but may be treated as Priority 1, not an absolute launch requirement.

Rover allows sitters to post a response to customer reviews, demonstrating a common marketplace pattern.

Recommended rules:

One response per review

Professional language required

No customer addresses, phone numbers or pet medical details

No retaliation or threats

Response can be reported

Material edits are versioned

Serious disputes move to private support, not a public argument

9. Public and internal review information

Public sitter profile

Show:

Average overall rating

Number of completed-booking reviews

Public written reviews

Date or approximate period

Service type

Sitter response, where enabled

Example:

⭐ 4.8/5 from 18 completed-booking reviews

Always show the review count. A 5.0 rating from one review is not equivalent to 4.8 from fifty reviews.

Internal admin view

Also show:

Punctuality average

Handling average

Communication average

Would-book-again rate

Private feedback

Complaint count

Incident links

Rating trend

Review coverage

Sitter view

Show:

Public rating

Individual category feedback

Written review

Private coaching summary

Do not expose:

Customer’s private support message

Internal safety investigation notes

Other sitters’ private scorecards

10. Rating aggregation

Public average

average_rating =

sum(overall_experience ratings)

÷ number of published eligible reviews

Display one decimal place:

4.76 → 4.8

Would-book-again rate

Yes responses

÷ all Yes/No responses

× 100

Exclude NOT_SURE from the denominator or display it separately.

Review coverage

Bookings with submitted reviews

÷ completed eligible bookings

× 100

Recent quality

The admin dashboard should display:

Latest five-booking average

Latest ten-booking average

Lifetime average

A sitter’s public lifetime rating should not be overwritten by the latest score.

11. Recommended database tables

reviews

id

booking_id

customer_id

sitter_id

overall_rating

punctuality_rating

pet_handling_rating

communication_rating

would_book_again

public_comment

private_feedback

publication_consent

status

submitted_at

published_at

version

review_moderation_actions

id

review_id

action

reason_code

original_content

display_content

moderated_by

policy_version

created_at

review_responses

id

review_id

sitter_id

response_text

status

submitted_at

published_at

Database constraints

Recommended constraints:

UNIQUE (booking_id)

CHECK (overall_rating BETWEEN 1 AND 5)

CHECK (punctuality_rating BETWEEN 1 AND 5)

CHECK (pet_handling_rating BETWEEN 1 AND 5)

CHECK (communication_rating BETWEEN 1 AND 5)

PostgreSQL constraints reject invalid data even when the bad value reaches the database through application code or defaults.

12. Review notifications

### Table 82

| Event | Notification |
| --- | --- |
| Report delivered | Invite customer to review |
| Review submitted | Thank customer |
| Low rating submitted | Alert operations |
| Safety concern selected | Alert safety team immediately |
| Review published | Notify sitter |
| Sitter responds | Notify customer |
| Moderation action | Notify affected party where appropriate |

Recommended internal rules:

Rating of 1–2: create support-review task

Rating of 3: optional quality-review task

Safety concern: create incident immediately

“Would not book again”: include in sitter trend analysis

Do not automatically suspend a sitter solely because one customer selected two stars. Use the review together with objective booking records and any complaint evidence.

13. Review edge cases

Customer has not received the report

Allow review after service completion, but show:

Your report is still pending. You may submit feedback now or after reviewing it.

Booking was partially completed

Admin determines whether it qualifies for review and records the reason.

Sitter was replaced

The review should attach to the sitter who actually delivered the service.

Two sitters completed the service

Either:

Allow one service review with separate sitter subratings, or

Generate one review opportunity per performing assignment.

For the MVP, avoid multiple-provider bookings where practical.

Refund was issued

A refund does not automatically invalidate the customer’s experience. A completed but refunded service may still be reviewable.

Incident is open

Permit private feedback immediately. Public publication may be temporarily held when necessary to protect personal data or an active investigation.

14. Review Module definition of done

The Review Module is complete when:

Only eligible customers can review.

One review is allowed per booking.

All ratings are validated between 1 and 5.

Overall rating and category ratings remain separate.

Public and private feedback are separate.

Complaints and incidents use separate records.

Negative reviews cannot be removed arbitrarily.

All moderation actions are auditable.

Public ratings include review counts.

Rating aggregates update safely.

Customers cannot review other customers’ bookings.

Sitters cannot edit customer reviews.

Module 9 — Admin Dashboard

1. Core objective

The Admin Dashboard should become PetSaathi’s operational control centre.

It should answer:

What requires action now?

Which bookings are at risk?

Which payments do not reconcile?

Which sitter can fulfil a request?

Which reports are overdue?

Which incidents remain open?

Which payouts are ready?

Which areas have insufficient supply?

2. Do not create one unlimited Admin role

Use one Admin interface with several permission groups:

### Table 83

| Internal role | Main permissions |
| --- | --- |
| Support Agent | Customers, routine booking support |
| Operations Admin | Matching, assignments and service monitoring |
| Verification Admin | Restricted sitter verification |
| Training Admin | Training and practical assessments |
| Safety Admin | Pet risk, incidents and sitter restrictions |
| Finance Admin | Payments, refunds and payouts |
| Content/Pricing Admin | Public prices and area settings |
| Super Admin | Roles, configuration and exceptional overrides |

OWASP recommends deny-by-default access and least privilege: users should receive only the permissions required to do their work.

Next.js also documents server-side checks that first confirm an active session and then verify that the user has the required role; role checks must occur on protected routes and actions, not only in the visible menu.

3. Recommended Admin navigation

Overview

Operations

├── Booking Management

├── Active Services

├── Report Cards

└── Replacements

Customers & Pets

├── Customers

├── Pet Profiles

└── Risk Reviews

Sitter Network

├── Applications

├── Verification

├── Training

├── Service Permissions

├── Availability

└── Performance

Safety

├── Incidents

├── Complaints

└── Corrective Actions

Finance

├── Payments

├── Refunds

├── Payouts

└── Adjustments

Marketplace Settings

├── Cities and Areas

├── Service Availability

├── Pricing

└── Policies

System

├── Notifications

├── Audit History

├── Admin Users

└── Configuration

4. Overview Dashboard

Purpose

Show immediate operational priorities—not vanity metrics.

Critical alerts

Display first:

Active Level 3 incident

Lost pet

Sitter no-show

Unapproved sitter assigned

Boarding at unapproved property

Payment captured but booking not confirmed

Service started without valid assignment

Operational cards

### Table 84

| Card | Meaning |
| --- | --- |
| Requests awaiting review | New customer demand |
| Matching pending | Requests needing a sitter |
| Payments pending | Sitter selected but payment incomplete |
| Starting in next two hours | Near-term operational load |
| Active services | Services currently underway |
| Late sitter alerts | Attendance risk |
| Reports overdue | Missing service evidence |
| Replacement required | Cancellation/no-show recovery |
| Open incidents | Safety workload |
| Payouts ready | Finance workload |

Dashboard filters

City

Area

Service

Date

Risk level

Sitter

Booking status

Incident severity

5. Customer Management

Customer list columns

Customer ID

Name

Phone

City/area

Number of pets

Completed bookings

Active bookings

Last booking

Total paid

Complaint flag

Account status

Admin actions

View customer profile

Correct contact information

Assist with pet creation

View booking history

Contact customer

Apply account restriction

Process privacy request

Archive account according to policy

Important correction

“Edit customer” should not mean admins may silently change customer information.

For sensitive edits, store:

Previous value

New value

Reason

Admin

Date

Whether customer was notified

6. Pet Profiles and Risk Review

Pet list columns

Pet ID

Customer

Pet name

Species/breed

Weight

Profile status

Walking risk

Sitting risk

Boarding risk

Current health flag

Last reviewed

Admin actions

View pet details

Request additional information

Assign service-specific risk

Add required controls

Place profile under reassessment

Block one service

Link incident

Review vaccination evidence

Risk decision panel

Show:

Behaviour flags

Medical flags

Bite/escape history

Requested service

Existing assessment

Relevant incidents

Suitable sitter requirements

Admin reason codes

Only Safety-authorised admins should modify final risk classifications.

7. Sitter Applications

Queue views

New

Information required

Phone screening

Interview scheduled

Shortlisted

On hold

Rejected

Withdrawn

Application detail

Display:

Contact information

Locality

Availability

Experience

Requested services

Pet-size comfort

Boarding interest

Payout expectation

Recruitment source

Screening notes

Admin actions

Move to screening

Schedule interview

Request information

Hold

Reject with reason

Assign reviewer

Application rejection does not automatically mean permanent provider removal. Recruitment outcomes and active-sitter operational statuses should remain separate.

8. Sitter Verification

Verification queue

Separate checks:

Phone

Identity

Interview

Reference

Background check

Training

Practical assessment

Boarding-home assessment

Each check should show

Sitter

Check type

Status

Submitted date

Evidence

Assigned reviewer

Expiry

Previous attempts

Reason for failure

Admin actions

Pass

Fail

Request resubmission

Mark not required

Set expiry

Revoke

Escalate for second review

Verification evidence should use private storage and restricted access. Supabase recommends enabling Row Level Security on exposed tables and granting only the permissions each role requires; its Storage service also supports RLS policies controlling private-object access.

9. Booking Management

Booking list columns

Booking ID

Customer

Pet

Service

Area

Schedule

Pet risk

Primary sitter

Payment status

Booking status

Incident flag

Next action

Main queues

Admin review pending

Matching pending

Customer approval pending

Payment pending

Confirmed today

Active

Replacement required

Report pending

Incident hold

Cancelled/refund pending

Booking actions

Review pet risk

View eligible sitters

Offer booking

Assign primary sitter

Assign backup

Replace sitter

Update allowed time window

Cancel booking

Request refund

Open incident

Add internal note

Guardrails

An admin should not be able to:

Assign an ineligible sitter without an explicit authorised override.

Confirm an unpaid booking accidentally.

Start or complete a service without recording an exceptional reason.

Delete booking history.

Rewrite the original price snapshot.

Remove a sitter assignment from history.

10. Payment Management

Payment list columns

Booking ID

Customer

Provider order ID

Amount

Payment status

Booking status

Payment time

Reconciliation state

Refund status

Admin actions

Fetch latest provider status

Reconcile payment

Record authorised offline exception

Request full refund

Request partial refund

View webhook history

Investigate duplicate payment

Critical rule

Admin should not normally type PAID manually.

Payment status should come from:

Verified gateway response

Valid webhook

Provider API reconciliation

A manual offline-payment override should require:

Elevated permission

Payment evidence

Amount

Method

Reference

Reason

Audit entry

Razorpay supports full and partial refunds only for captured payments and provides refund webhooks for created, processed and failed states. Razorpay recommends using refund webhook outcomes for definitive tracking.

11. Report Card Management

Report queues

Draft overdue

Submitted

Concern flagged

Admin review required

Delivered

Amended

Report detail

Show:

Booking

Actual times

Service-specific updates

Media

Sitter note

Concern

Linked incident

Version history

Admin actions

Review report

Request sitter correction

Mark concern reviewed

Create incident

Deliver report

Issue authorised amendment

Important rule

Admins should not silently rewrite a sitter report.

A correction must preserve:

Original version

Revised version

Editor

Reason

Timestamp

12. Review Management

Review list columns

Booking ID

Customer

Sitter

Overall rating

Category ratings

Would book again

Public comment

Private concern

Moderation status

Complaint/incident link

Filters

Rating

City

Sitter

Service

Publication status

Concern flag

Date

Repeat preference

Admin actions

Publish

Redact personal data

Hold for investigation

Remove for policy violation

Link complaint

Link incident

Request clarification

Review sitter response

Moderation principle

A low rating is not a moderation violation.

Every moderation action requires a reason and audit record.

13. Incident Management

Incident queues

Active Level 3

Active Level 2

Owner not reached

Vet not reached

Transport pending

Investigation pending

Corrective action overdue

Closure review pending

Incident detail

Show:

Incident ID

Booking

Pet

Customer

Sitter

Severity

Detection time

Description

Timeline

Contact attempts

Veterinary instructions

Evidence

Expenses

Restrictions applied

Corrective actions

Admin actions

Confirm severity

Add timeline event

Call owner/vet

Apply sitter hold

Restrict one service

Arrange replacement

Add corrective action

Record final decision

Close incident

Only authorised Safety Admins should close serious incidents.

Closure should require:

Immediate resolution recorded

Owner communication recorded

Required vet information recorded

Investigation decision

Corrective-action decision

Follow-up ownership

14. Payout Management

Payout list columns

Sitter

Booking

Service

Completion date

Base payout

Bonus

Adjustment

Final payout

Status

Expected payment date

Payout workflow

Service completed

↓

Report accepted

↓

Incident/refund impact reviewed

↓

Payout calculated

↓

Finance approval

↓

Payment initiated

↓

Payment reconciled

Payout statuses

NOT_ELIGIBLE

CALCULATED

APPROVAL_PENDING

APPROVED

PROCESSING

PAID

FAILED

DISPUTED

HELD

Admin actions

Calculate

Approve

Add documented bonus

Add documented adjustment

Hold disputed booking amount

Mark payment reference

Retry failed payout

Do not hold all of a sitter’s unrelated earnings because one booking is disputed.

15. City and Area Settings

Area fields

City

Locality

PIN codes or geographic boundary

Operational status

Services enabled

Booking hours

Same-day cutoff

Maximum travel time

Boarding availability

Emergency support contact

Launch date

Statuses

DRAFT

WAITLIST_ONLY

ACTIVE

TEMPORARILY_PAUSED

CLOSED

Important rule

Disabling an area should affect new requests.

It should not automatically cancel existing confirmed bookings. Existing bookings must enter a separate operational review.

16. Pricing Settings

Pricing rule fields

City

Area

Service

Duration

Number of included pets

Base amount

Additional-pet amount

Peak-time amount

Urgency amount

Discount rules

Effective date

End date

Status

Version

Pricing workflow

Draft

→ Review

→ Scheduled

→ Active

→ Superseded

Critical rule

New pricing must not retroactively modify existing booking-price snapshots.

An existing booking keeps:

Price version

Base price

Adjustments

Discount

Final amount

Pricing changes should require an audit reason and preferably a second approval for material changes.

17. Service Permission Management

This page is missing from the original list but should be mandatory.

Display a matrix such as:

### Table 85

| Sitter | Walking | Sitting | Boarding | Large dogs | Yellow risk |
| --- | --- | --- | --- | --- | --- |
| Riya | Approved | Approved | Not eligible | Approved | Approved |
| Aman | Probation | Pending | Beta | Restricted | Restricted |

Admin actions:

Approve service

Set probation

Restrict size

Restrict risk level

Restrict area

Suspend one permission

Set expiry

Require reassessment

Suspending boarding should not automatically suspend dog walking unless the underlying incident affects both.

18. Audit History

Every sensitive action should create an append-only audit record.

Audit fields

id

actor_user_id

actor_role

action

entity_type

entity_id

previous_value

new_value

reason_code

request_id

created_at

Track:

Sitter approvals

Verification decisions

Risk changes

Booking overrides

Refund approvals

Payout changes

Review removals

Incident closure

Price changes

Service-area changes

Admin-role changes

OWASP recommends application security logging for investigation and monitoring, while cautioning that logs themselves require protection.

Do not place these in audit logs:

Passwords or OTPs

Complete payment credentials

Full identity-document contents

Door-access codes

Full pet medical narratives

Secret API keys

19. Admin data security

Server-side permissions

Every Admin page and mutation must verify:

Authentication

Active admin status

Required permission

Allowed city or area, where applicable

Allowed action on the specific record

Do not rely on:

Hidden sidebar items

Disabled buttons

Frontend route checks alone

Database controls

For any tables exposed through Supabase APIs, RLS must be enabled and explicitly configured. Supabase warns that exposed tables without RLS may be accessible to roles with matching grants.

Admin session controls

Recommended:

Strong authentication

Shorter session lifetime for privileged accounts

Reauthentication for role changes or critical financial actions

Immediate deactivation when staff leave

Login and permission-change alerts

Device/session review

20. Admin dashboard MVP priorities

Priority 0 — Required before launch

Overview dashboard

Customer and pet lookup

Pet-risk review

Sitter applications

Verification checks

Service permissions

Booking management

Payment reconciliation

Report review

Review moderation

Incident management

Payout calculation

Audit history

Priority 1 — Strong launch enhancements

Availability calendar

Supply map

Automated overdue alerts

Bulk sitter offers

Saved filters

CSV export with permissions

Dashboard trends

Configurable notification templates

Postpone

AI sitter selection

Predictive demand forecasting

Complex fraud scoring

Fully automated refund decisions

Automatic incident severity diagnosis

Large multi-city command centre

Custom dashboard builder

21. Recommended Admin page routes

/admin

/admin/customers

/admin/customers/[id]

/admin/pets

/admin/pets/[id]

/admin/risk-reviews

/admin/sitters

/admin/sitter-applications

/admin/verifications

/admin/training

/admin/service-permissions

/admin/availability

/admin/bookings

/admin/bookings/[id]

/admin/active-services

/admin/replacements

/admin/payments

/admin/refunds

/admin/payouts

/admin/reports

/admin/reviews

/admin/complaints

/admin/incidents

/admin/cities

/admin/service-areas

/admin/pricing

/admin/audit

/admin/admin-users

/admin/settings

Next.js App Router uses file-system routes and supports server-side role protection for Admin pages and handlers.

22. Admin Dashboard definition of done

The Admin Dashboard is ready when:

Permissions

Admin functions use granular permissions.

Support agents cannot approve refunds or verifications.

Finance staff cannot view unnecessary identity or medical records.

Safety admins can restrict sitters and manage incidents.

Every protected action is checked server-side.

Operations

New requests appear in the booking queue.

Admin can review risk and find eligible sitters.

Primary and backup assignments are supported.

Late, cancelled and no-show bookings are visible.

Replacement workflow functions.

Status history cannot be deleted.

Finance

Provider payment status is reconciled.

Manual payment overrides require evidence.

Full and partial refunds are supported.

Refund status updates through provider events.

Payouts are linked to completed assignments.

Quality

Missing reports are visible.

Concerned reports create alerts.

Reviews are linked to completed bookings.

Negative feedback is not removed arbitrarily.

Complaints and incidents are separate.

Safety

Incidents have severity, timeline and ownership.

Critical incidents receive priority alerts.

Sitter restrictions can be service-specific.

Serious incidents cannot close without review.

Corrective actions have owners and deadlines.

Data integrity

Pricing is versioned.

Area deactivation does not rewrite existing bookings.

Verification history is preserved.

One review per booking is enforced.

Every sensitive admin action creates an audit record.

Final official module structure

Review Module

Completed booking

→ Review eligible

→ Customer submits ratings

→ Public/private feedback separated

→ Complaint or incident created when necessary

→ Moderation

→ Rating aggregates updated

→ Sitter performance updated

Admin Dashboard

Overview and alerts

├── Customers and pets

├── Sitter trust system

├── Booking operations

├── Payments and refunds

├── Reports and reviews

├── Incidents and complaints

├── Payouts

├── Pricing and areas

└── Audit and permissions

Final operating principle

Only genuine completed bookings should generate sitter reviews. Overall rating, category ratings, repeat interest, private complaints and safety incidents must be stored separately. The Admin Dashboard should control every critical workflow, but individual staff members must receive only the minimum permissions necessary for their responsibilities. Every approval, override, refund, moderation decision, risk change and incident closure must be validated server-side and preserved in an audit history.

Simple explanation for professor

“The Review Module will allow customers to rate sitter punctuality, pet handling, communication and overall experience only after a real completed booking. The public star rating will use the overall-experience score, while the other ratings will help PetSaathi coach and evaluate sitters. Customers may also indicate whether they would book the sitter again. Public reviews, private complaints and safety incidents will be stored separately because they require different responses. Negative reviews will not be removed merely because they are unfavourable; moderation will be limited to clear policy violations such as personal-data exposure, threats, spam or fraud.

The Admin Dashboard will be PetSaathi’s main operational panel. It will manage customers, pet-risk profiles, sitter applications, verification, service permissions, bookings, payments, reports, reviews, incidents, payouts, pricing and service areas. PetSaathi will use one Admin interface, but support, verification, safety and finance staff will receive different permissions. Booking overrides, refunds, sitter approvals, risk changes, review moderation and incident closure will all require authorised roles, reason codes and audit records. This gives PetSaathi one powerful operational system without giving every employee unrestricted access.”

PetSaathi Phase 4 — MVP Database, API, Pages and Design Audit 🐾🚀

Executive verdict

Your proposal is a strong functional blueprint, but I would not implement the database exactly as written.

The current schema successfully identifies the major business objects:

Customers

Pets

Sitters

Bookings

Payments

Reports

Reviews

Incidents

Payouts

However, it currently combines several independent processes inside single tables and fields. That will create contradictions once cancellations, replacement sitters, partial refunds, multiple pets, expired verification, amended reports and service-specific pet risks begin occurring.

Overall decision

### Table 86

| Area | Decision |
| --- | --- |
| General product architecture | Approve |
| Main business entities | Approve |
| Current database tables | Approve as conceptual draft only |
| Current API list | Modify before development |
| Public/customer/sitter/admin routes | Approve with additions |
| Design direction | Approve with claim and accessibility corrections |
| Feature prioritisation | Modify |
| Deferred-feature list | Approve |

The correct technical principle is:

Keep one source of truth for each business process, preserve history, separate financial and operational states, and enforce critical rules on the server and database—not only in the interface.

1. Six architectural rules for the MVP

Rule 1 — Authentication, roles and profiles are different

A person may be:

A customer

A sitter

An administrator

Both a customer and sitter

Therefore, avoid:

users.role = "CUSTOMER"

Use:

users

user_roles

customer_profiles

sitter_profiles

Supabase Auth can provide the authenticated identity, while PostgreSQL Row Level Security can restrict which records that identity may access. Supabase documents Auth and RLS as complementary layers, and its Storage service also uses RLS-based access policies.

Rule 2 — Current values and historical evidence must be separate

Examples:

sitter_profiles.rating can be a cached aggregate.

Individual ratings belong in reviews.

bookings.status stores the current status.

Every transition belongs in booking_status_history.

sitter_profiles.status stores current operational status.

Every change belongs in a sitter-status history table.

Never overwrite important operational history.

Rule 3 — Booking-time information needs snapshots

Suppose a customer books using:

Address A

Price ₹149

Yellow walking risk

“Use red harness” instruction

The customer might edit their profile later. The historical booking must still preserve the exact address, price, instructions and risk assessment used when that booking was matched.

Use:

Address snapshot

Price snapshot

Pet-risk snapshot

Care-instruction snapshot

Policy-version snapshot

Rule 4 — Payment, booking, assignment and refund states are independent

A booking may simultaneously have:

Booking status: CANCELLED

Payment status: CAPTURED

Refund status: PROCESSING

Assignment status: REMOVED

One status field cannot accurately represent all four processes.

Rule 5 — Sensitive files must not be ordinary public URLs

These files require private storage:

Sitter identity evidence

Boarding-home photographs

Pet medical documents

Service photographs

Incident evidence

Customer home images

Supabase Storage denies or permits access through RLS-backed policies, so files can be delivered only to authorised users rather than exposed through permanent public URLs.

Rule 6 — Critical multi-table operations must be transactional

Assigning a sitter may involve:

Checking the current booking version

Checking sitter eligibility

Checking schedule conflicts

Creating an assignment

Updating booking status

Adding status history

Adding an audit entry

Queuing a notification

These records should succeed or fail together. Prisma supports nested writes and database transactions for such related operations.

2. Identity and user schema

Original table

users

- id

- name

- phone

- email

- role

- city

- area

- created_at

- updated_at

Problems

One role does not support multiple roles.

City and area do not represent full addresses.

Customer and sitter details become mixed.

No account status exists.

No link to the authentication-provider identity exists.

Phone and email verification states are missing.

Recommended structure

users

id

auth_user_id

name

phone

email

phone_verified_at

email_verified_at

account_status

created_at

updated_at

user_roles

id

user_id

role

assigned_at

assigned_by

revoked_at

Possible roles:

CUSTOMER

SITTER

OPERATIONS_ADMIN

VERIFICATION_ADMIN

SAFETY_ADMIN

FINANCE_ADMIN

SUPER_ADMIN

customer_profiles

user_id

preferred_language

communication_preference

default_address_id

created_at

updated_at

addresses

id

user_id

address_type

line_1

line_2

building_or_society

locality

city

state

pincode

landmark

latitude

longitude

entry_instructions

is_active

created_at

updated_at

A full address should not be stored redundantly in every user record.

3. Pet-profile schema

Original table

pets

- id

- customer_id

- name

- type

- breed

- age

- weight

- gender

- vaccination_status

- behavior_notes

- medical_notes

- risk_level

- photo_url

- created_at

Main problems

age becomes outdated automatically.

Vaccination is not a simple yes/no value.

Behaviour and medical information are too important for one text field.

Risk must be service-specific and versioned.

One customer may share ownership with another authorised household member.

A public photo_url is unsafe.

Recommended core table

pets

id

primary_customer_id

name

species

breed

date_of_birth

age_is_estimated

sex

sterilisation_status

weight_grams

weight_updated_at

profile_status

photo_asset_id

created_at

updated_at

archived_at

Supporting pet tables

pet_behavior_profiles

pet_id

stranger_response

bite_history

bite_details

pulling_severity

escape_history

separation_anxiety

resource_guarding

other_dog_compatibility

cat_compatibility

handling_notes

updated_at

pet_medical_profiles

pet_id

conditions

allergies

medication_summary

mobility_limitations

seizure_history

recent_emergency

medical_notes

last_confirmed_at

pet_vaccination_records

id

pet_id

vaccine_name

administered_at

next_due_at

clinic_name

evidence_asset_id

review_status

reviewed_by

reviewed_at

pet_care_instructions

pet_id

food_instructions

water_instructions

walking_instructions

toilet_routine

play_preferences

rest_routine

approved_treats

prohibited_food

special_commands

updated_at

pet_emergency_contacts

id

pet_id

contact_name

relationship

phone

priority

can_authorise_treatment

can_authorise_spending

pet_risk_assessments

id

pet_id

service_type_id

overall_level

behaviour_level

medical_level

handling_level

escape_level

compatibility_level

reason_codes

required_controls

assessed_by

effective_from

review_due_at

status

created_at

Risk values:

UNASSESSED

GREEN

YELLOW

RED

Do not store REJECTED as a risk level. Store service decisions separately:

ACCEPT_STANDARD

ACCEPT_WITH_CONTROLS

MANUAL_REVIEW

WAITLIST

DECLINE

4. Sitter-profile schema

Original table

sitter_profiles

- id

- user_id

- bio

- city

- area

- pincode

- service_radius_km

- verification_level

- status

- rating

- completed_bookings

- profile_photo_url

- intro_video_url

- created_at

Main problems

One verification level mixes unrelated checks.

Rating and completed-booking count are derived data.

Service eligibility is not represented precisely.

No verification expiry exists.

No service-size or risk restriction exists.

Public and private profile fields are mixed.

Recommended sitter_profiles

id

user_id

public_display_name

bio

home_service_area_id

service_radius_metres

operational_status

profile_photo_asset_id

intro_video_asset_id

approved_at

created_at

updated_at

Separate verification records

sitter_verifications

id

sitter_id

verification_type

status

submitted_at

reviewed_at

reviewed_by

valid_from

expires_at

evidence_asset_id

failure_reason

revoked_at

Verification types may include:

PHONE

IDENTITY

VIDEO_INTERVIEW

REFERENCE

BACKGROUND_CHECK

TRAINING

PRACTICAL_WALKING_ASSESSMENT

HOME_SITTING_ASSESSMENT

BOARDING_HOME_ASSESSMENT

EMERGENCY_PROTOCOL_ASSESSMENT

Public badges

sitter_badges

id

sitter_id

badge_type

source_verification_id

awarded_at

expires_at

revoked_at

is_public

Examples:

Identity Checked

Video Interview Completed

Pet Safety Training Passed

Dog Walking Approved

Boarding Home Assessed

Proven Sitter

Do not store only:

verification_level = L4

5. Sitter service permissions

Original table

sitter_services

- id

- sitter_id

- service_type

- is_enabled

- base_price

Problem

An enabled/disabled flag does not answer:

Is the sitter on probation?

Can the sitter handle large dogs?

Can the sitter handle Yellow-risk pets?

Which area is approved?

Is boarding permitted at a specific property?

Has permission expired?

Recommended table

sitter_service_permissions

id

sitter_id

service_type_id

permission_status

pet_species

maximum_dog_weight_grams

maximum_risk_level

maximum_pet_count

service_area_id

approved_at

approved_by

expires_at

restriction_notes

Permission statuses:

PENDING

PROBATION

APPROVED

RESTRICTED

SUSPENDED

EXPIRED

REVOKED

Pricing correction

Customer pricing should not normally be stored as a sitter’s base_price.

Separate:

Customer service price

Sitter payout rule

Platform margin

Service-area surcharge

Promotional discount

Use:

service_types

pricing_rules

sitter_payout_rules

6. Availability schema

Original table

sitter_availability

- id

- sitter_id

- day_of_week

- start_time

- end_time

- is_available

This works for a very basic recurring schedule, but it cannot represent:

Leave

One-time availability

Holidays

Temporary changes

Different service areas

Different services

Effective dates

Recommended model

sitter_availability_rules

id

sitter_id

day_of_week

start_time

end_time

timezone

service_type_id

service_area_id

effective_from

effective_until

is_active

sitter_availability_exceptions

id

sitter_id

exception_date

start_time

end_time

exception_type

reason

Exception types:

AVAILABLE

UNAVAILABLE

LEAVE

BLOCKED

Existing confirmed assignments must also be considered before a sitter is shown as available.

7. Service, location and pricing tables

These are missing from the proposed schema.

service_types

id

code

display_name

default_duration_minutes

requires_risk_review

requires_property_approval

is_active

Possible values:

Dog walking

Home pet sitting

Cat home visit

Boarding daycare beta

Boarding overnight beta

service_areas

id

city

area

pincode

latitude

longitude

service_radius_or_boundary

status

launch_date

Statuses:

PLANNED

WAITLIST

ACTIVE

PAUSED

DISABLED

pricing_rules

id

service_type_id

service_area_id

duration_minutes

base_amount

currency

additional_pet_amount

peak_amount

urgent_amount

effective_from

effective_until

is_active

Store money as integer paise:

₹149 = 14900

Do not use floating-point amounts.

8. Booking schema

Original table

bookings

- id

- customer_id

- pet_id

- sitter_id

- service_type

- city

- area

- address

- scheduled_date

- start_time

- duration_minutes

- price

- status

- payment_status

- notes

- created_at

- updated_at

This is the table requiring the largest correction.

Main problems

One booking may contain multiple pets.

A booking may have primary, backup and replacement sitters.

City, area and address can change after booking if not snapshotted.

Separate date and time fields complicate timezone handling.

Price needs components and history.

Payment status does not belong in the booking lifecycle.

One notes field is insufficient.

No status history exists.

No concurrency version exists.

Recommended bookings

id

public_code

customer_id

service_type_id

status

scheduled_start_at

scheduled_end_at

timezone

service_address_snapshot_id

risk_snapshot_id

estimated_amount

final_amount

currency

customer_notes

created_at

updated_at

version

Example public code:

BK-2026-01001

Supporting booking tables

booking_pets

booking_id

pet_id

risk_assessment_id

care_instruction_snapshot_id

additional_pet_amount

booking_assignments

id

booking_id

sitter_id

assignment_role

status

offered_at

accepted_at

assigned_at

removed_at

removal_reason

Roles:

PRIMARY

BACKUP

REPLACEMENT

SUPERVISOR

booking_status_history

id

booking_id

from_status

to_status

changed_by

reason_code

notes

created_at

booking_price_components

id

booking_id

component_type

amount

description

booking_address_snapshots

Preserve the exact address used for that service.

booking_instruction_snapshots

Preserve the customer instructions used when matching and servicing the booking.

booking_cancellations

booking_id

cancelled_by

reason_code

policy_version

refund_eligibility

cancelled_at

PostgreSQL supports foreign keys, unique constraints and check constraints to enforce relational integrity directly in the database.

9. Booking lifecycle

Use the following booking statuses:

REQUESTED

PENDING_ADMIN_REVIEW

SITTER_MATCHING

SITTER_ASSIGNED

PAYMENT_PENDING

CONFIRMED

SERVICE_STARTED

SERVICE_COMPLETED

REPORT_SUBMITTED

CLOSED

DECLINED

CANCELLED

REPLACEMENT_REQUIRED

NO_SHOW

INCIDENT_HOLD

Keep these outside the booking status:

Payment state

Refund state

Review state

Assignment state

Report state

Incident state

Avoid a generic endpoint that lets a client send any status value.

10. Payment schema

Original table

payments

- id

- booking_id

- customer_id

- amount

- platform_fee

- sitter_payout

- provider

- provider_payment_id

- status

- paid_at

- refunded_at

Main problems

Razorpay order ID is missing.

Signature-verification result is missing.

One refund timestamp cannot support partial or failed refunds.

Sitter payout should not be stored as the payment itself.

Payment-provider events need idempotency.

Multiple payment attempts may exist for one booking.

Recommended payments

id

booking_id

customer_id

provider

provider_order_id

provider_payment_id

amount

currency

status

signature_verified

captured_at

failed_at

failure_code

failure_description

created_at

updated_at

Payment statuses:

CREATED

PENDING

AUTHORIZED

CAPTURED

FAILED

EXPIRED

CANCELLED

REFUNDED

payment_events

id

provider

provider_event_id

event_type

payment_id

payload_hash

processing_status

received_at

processed_at

provider_event_id should be unique so duplicate webhooks cannot create duplicate effects.

refunds

id

booking_id

payment_id

provider_refund_id

amount

reason_code

status

requested_by

approved_by

requested_at

processed_at

failure_reason

Refund statuses:

REQUESTED

APPROVED

PROCESSING

PROCESSED

PARTIALLY_PROCESSED

FAILED

REJECTED

Razorpay recommends creating Orders on the server, passing the Order ID into Checkout, verifying the payment signature on the server, checking captured/paid status before providing services and using webhooks for asynchronous updates.

11. Sitter payouts

Original table

payouts

- id

- sitter_id

- booking_id

- amount

- status

- payout_date

- payment_reference

This is acceptable for very small manual payouts but will become restrictive.

Recommended model

payouts

Represents one payment made to a sitter.

id

sitter_id

gross_amount

adjustment_amount

final_amount

currency

status

scheduled_at

paid_at

payment_reference

created_at

payout_items

Links one payout to one or more bookings.

id

payout_id

booking_id

base_amount

bonus_amount

deduction_amount

final_amount

payout_adjustments

id

sitter_id

booking_id

adjustment_type

amount

reason

approved_by

created_at

This permits weekly payout batches instead of requiring one bank transfer for every booking.

12. Report-card schema

Original table

report_cards

- id

- booking_id

- sitter_id

- start_time

- end_time

- food_update

- water_update

- toilet_update

- mood

- walk_distance

- sitter_note

- concern

- media_urls

- created_at

Main corrections

Store actual timestamps, not just clock times.

Media needs a separate table.

Reports require a workflow status.

Changes should be versioned.

Concern fields require structured detail.

Service-specific information must be validated.

Recommended booking_reports

id

booking_id

sitter_id

status

actual_start_at

actual_end_at

food_update

water_update

pee_update

poop_update

mood

behaviour

walk_distance_metres

sitter_note

concern_flag

concern_type

submitted_at

delivered_at

version

created_at

updated_at

Statuses:

DRAFT

SUBMITTED

ADMIN_REVIEW_REQUIRED

DELIVERED

AMENDED

REJECTED_FOR_CORRECTION

report_media

id

report_id

asset_id

media_type

caption

captured_at

sort_order

Do not store an uncontrolled array of public media URLs.

13. Review schema

Original table

reviews

- id

- booking_id

- customer_id

- sitter_id

- rating

- comment

- would_book_again

- created_at

This is a reasonable minimum, but your review module requires separate category scores.

Recommended table

id

booking_id

customer_id

sitter_id

punctuality_rating

pet_handling_rating

communication_rating

overall_rating

comment

would_book_again

publication_consent

moderation_status

submitted_at

published_at

Constraints:

Booking must be completed or closed.

Customer must own the booking.

Only one customer review per booking.

Every rating must be between 1 and 5.

Do not store only an editable aggregate rating in the sitter profile. Calculate sitter rating from valid booking-linked reviews, then optionally cache it for performance.

14. Incident schema

Original table

incidents

- id

- booking_id

- pet_id

- sitter_id

- severity

- incident_type

- description

- media_urls

- status

- resolution

- created_at

This is insufficient for real safety management.

Recommended core table

incidents

id

public_code

booking_id

pet_id

sitter_id

customer_id

incident_type

severity

status

detected_at

reported_at

description

current_pet_status

incident_manager_id

resolved_at

closed_at

created_at

updated_at

Supporting incident tables

incident_events

Append-only timeline:

id

incident_id

event_type

description

created_by

created_at

incident_attachments

Private evidence references.

incident_notifications

Records:

Owner call

Emergency contact

Veterinarian contact

Admin notification

Whether contact succeeded

Instructions received

incident_corrective_actions

id

incident_id

action

owner_id

priority

due_at

status

completed_at

incident_reviews

Stores root cause, policy compliance and final approval.

A serious incident should not be “resolved” by editing one text field.

15. Administrative and system tables

The proposed database is missing several infrastructure tables.

Add:

admin_audit_logs

Records:

Who made the change

Which entity changed

Previous value

New value

Reason

Timestamp

notification_outbox

Queues WhatsApp, email and push messages after a business transaction succeeds.

notification_deliveries

Stores:

Channel

Provider message ID

Sent

Delivered

Read

Failed

policy_versions

Stores the version of:

Terms

Cancellation policy

Privacy notice

Sitter agreement

Boarding policy

file_assets

Central metadata for private uploaded files.

feature_flags

Controls:

Boarding beta

New city launch

Prepaid packages

Experimental functionality

16. Recommended relationship map

users

├── user_roles

├── customer_profiles

└── sitter_profiles

customer_profiles

├── addresses

├── pets

│ ├── pet_behavior_profiles

│ ├── pet_medical_profiles

│ ├── pet_vaccination_records

│ ├── pet_care_instructions

│ └── pet_risk_assessments

└── bookings

sitter_profiles

├── sitter_verifications

├── sitter_badges

├── sitter_service_permissions

├── sitter_availability_rules

├── sitter_availability_exceptions

└── booking_assignments

bookings

├── booking_pets

├── booking_assignments

├── booking_status_history

├── booking_price_components

├── payments

│ ├── payment_events

│ └── refunds

├── booking_reports

│ └── report_media

├── reviews

├── incidents

│ ├── incident_events

│ ├── incident_notifications

│ └── incident_corrective_actions

└── payout_items

17. API architecture audit

Current API list

The general resource grouping is good, but several endpoints are too broad.

The largest risk is:

PUT /api/bookings/:id/status

This could allow a client or incorrectly authorised staff member to jump from:

REQUESTED → COMPLETED

without matching, payment or service evidence.

Better rule

Use explicit business commands:

POST /api/bookings

POST /api/bookings/:id/cancel

POST /api/bookings/:id/approve-sitter

POST /api/bookings/:id/start

POST /api/bookings/:id/complete

POST /api/bookings/:id/reviews

Admin commands:

POST /api/admin/bookings/:id/review

POST /api/admin/bookings/:id/assignments

POST /api/admin/bookings/:id/request-information

POST /api/admin/bookings/:id/decline

POST /api/admin/bookings/:id/replace-sitter

Every command should validate the current state, actor permission and prerequisites.

Next.js App Router supports Route Handlers inside the app directory for standard HTTP methods and webhook-style endpoints. The official documentation notes that Route Handlers are the App Router equivalent of Pages Router API Routes, so the project does not need both systems for the same API layer.

18. Recommended API structure

Authentication

When using Supabase Auth, you generally do not need to recreate a password-authentication system in custom API routes.

Use Supabase authentication for:

OTP initiation

OTP verification

Session creation

Session refresh

Logout

PetSaathi still needs backend logic for:

Creating the application profile

Assigning roles

Accepting policy versions

Auditing account changes

Possible routes:

GET /api/auth/me

POST /api/auth/complete-profile

POST /api/auth/accept-policies

Never store or process custom passwords unless there is a clear need.

Customer APIs

GET /api/customer/profile

PATCH /api/customer/profile

GET /api/customer/addresses

POST /api/customer/addresses

PATCH /api/customer/addresses/:id

GET /api/customer/bookings

GET /api/customer/bookings/:id

POST /api/customer/bookings/:id/approve-sitter

POST /api/customer/bookings/:id/cancel

Pet APIs

POST /api/pets

GET /api/pets

GET /api/pets/:id

PATCH /api/pets/:id

POST /api/pets/:id/archive

POST /api/pets/:id/vaccinations

PATCH /api/pets/:id/vaccinations/:recordId

POST /api/pets/:id/risk-review-request

Prefer archive over permanent delete when completed bookings reference the pet.

Booking APIs

POST /api/bookings

GET /api/bookings/:id

POST /api/bookings/:id/cancel

POST /api/bookings/:id/repeat

GET /api/bookings/:id/timeline

Do not expose a generic unrestricted status endpoint.

Sitter APIs

GET /api/sitter/profile

PATCH /api/sitter/profile

GET /api/sitter/availability

POST /api/sitter/availability/rules

POST /api/sitter/availability/exceptions

GET /api/sitter/offers

POST /api/sitter/offers/:assignmentId/accept

POST /api/sitter/offers/:assignmentId/decline

GET /api/sitter/bookings

GET /api/sitter/bookings/:id

POST /api/sitter/bookings/:id/en-route

POST /api/sitter/bookings/:id/start

POST /api/sitter/bookings/:id/complete

Report APIs

POST /api/bookings/:id/report

GET /api/bookings/:id/report

PATCH /api/bookings/:id/report/draft

POST /api/bookings/:id/report/submit

Review APIs

POST /api/bookings/:id/reviews

GET /api/bookings/:id/reviews

Incident APIs

POST /api/incidents

GET /api/incidents/:id

POST /api/incidents/:id/events

POST /api/incidents/:id/attachments

Admin:

POST /api/admin/incidents/:id/assign

POST /api/admin/incidents/:id/restrict-sitter

POST /api/admin/incidents/:id/corrective-actions

POST /api/admin/incidents/:id/close

Payment APIs

POST /api/payments/orders

GET /api/payments/:id

POST /api/payments/:id/reconcile

POST /api/admin/refunds

Webhook:

POST /api/webhooks/razorpay

The webhook route must verify the provider signature, reject malformed requests and process events idempotently. Razorpay recommends webhook configuration and signature checking as part of production payment integration.

Upload APIs

Use signed, restricted upload workflows:

POST /api/uploads/create

POST /api/uploads/complete

DELETE /api/uploads/:id

The server should control:

Allowed bucket

Object path

File type

File size

User ownership

Intended purpose

19. Page-structure audit

Your page hierarchy is strong.

Public routes

Recommended:

/

/services

/services/dog-walking

/services/pet-sitting

/services/pet-boarding

/pricing

/how-it-works

/safety

/become-a-sitter

/society-partnerships

/contact

/cities/[city]

/cities/[city]/[area]

/faq

/privacy

/terms

/cancellation-refund-policy

Use plural /cities consistently.

Customer routes

/customer/dashboard

/customer/pets

/customer/pets/new

/customer/pets/[id]

/customer/book

/customer/bookings

/customer/bookings/[id]

/customer/reports

/customer/payments

/customer/support

/customer/profile

/customer/settings

Sitter routes

/sitter/dashboard

/sitter/profile

/sitter/availability

/sitter/offers

/sitter/bookings

/sitter/bookings/[id]

/sitter/reports

/sitter/earnings

/sitter/verification

/sitter/training

/sitter/settings

Admin routes

/admin

/admin/customers

/admin/customers/[id]

/admin/pets

/admin/pets/[id]

/admin/sitters

/admin/sitters/[id]

/admin/sitter-applications

/admin/verifications

/admin/training

/admin/bookings

/admin/bookings/[id]

/admin/payments

/admin/refunds

/admin/payouts

/admin/reports

/admin/reviews

/admin/incidents

/admin/incidents/[id]

/admin/service-areas

/admin/pricing

/admin/audit

/admin/settings

20. Admin dashboard corrections

Your proposed admin capabilities are valid, but “Admin manages everything” should not mean that every staff member can access everything.

Recommended internal permissions

Operations

View bookings

Assign sitters

Request replacement

Review reports

Contact customers

Verification

Review sitter evidence

Approve or reject checks

Manage badge evidence

Safety

Review pet risk

Manage incidents

Suspend service permissions

Close serious cases

Finance

Reconcile payments

Approve refunds

Approve payouts

Content and configuration

Manage prices

Manage service areas

Manage public content

Super Admin

Manage roles

Change system configuration

Access audit history

Supabase recommends RLS for controlling which data roles may access, and PostgreSQL constraints provide an additional integrity layer. Application-level permission checks are still required for sensitive commands.

21. Design-direction audit 🎨

Approved design qualities

The product should feel:

Premium

Warm

Safe

Calm

Trustworthy

Operationally clear

Mobile-first

Professional

Recommended colour roles

### Table 87

| Colour family | Use |
| --- | --- |
| Cream | Page backgrounds |
| Soft blue | Primary trust and navigation |
| Warm orange | Calls to action and friendly emphasis |
| Pet-friendly green | Success and normal completion |
| Amber | Warnings and pending states |
| Red | Critical incidents and destructive actions |
| Neutral grey | Secondary text and borders |

Do not communicate a state only through colour.

For example, show:

Yellow — Additional controls required

not merely a yellow dot.

Typography

Use a rounded but highly readable sans-serif.

Good characteristics:

Clear numerals

Strong distinction between similar letters

Comfortable small-text readability

Multiple weights

Indian-language support if multilingual expansion is planned

Components

Use:

Large mobile CTAs

Status timelines

Pet cards

Sitter cards

Booking cards

Report cards

Alert banners

Accessible drawers and dialogs

Clearly labelled forms

WCAG 2.2 should guide keyboard operation, focus visibility, labels, contrast and interaction behaviour.

22. Hero-copy correction

Original

Book verified dog walkers, pet sitters, and safe boarding with live updates, report cards, and emergency support.

Problems

“Verified” does not identify which checks were completed.

“Safe boarding” may imply a guarantee.

“Live updates” may imply real-time GPS or chat when only structured updates exist.

“Emergency support” may imply guaranteed veterinary availability.

Recommended hero

Trusted pet care, right near your home.

Supporting copy:

Request service-approved dog walkers and pet sitters with structured updates and Pet Report Cards. Controlled boarding is available in selected areas after host, property and pet review.

Primary CTA:

Book Pet Care

Secondary CTA:

Become a Sitter

During an early pricing experiment, “Book a Trial” can be used only when a genuine trial offer is active.

23. Corrected feature priorities

Several features currently listed as P1 are actually required for a functional and safe launch.

P0 — Must exist before launch

### Table 88

| Feature | Reason |
| --- | --- |
| Authentication and role control | Protect all private areas |
| Mobile-first public website | Customer acquisition |
| Customer and pet profiles | Booking and safety |
| Pet-risk review | Matching protection |
| Booking state machine | Core operations |
| Admin booking management | Core marketplace control |
| Sitter profiles and permissions | Supply control |
| Basic sitter availability | Prevent invalid assignments |
| Sitter offer accept/decline | Confirm actual availability |
| Primary and backup assignment | Reliability |
| Payment integration | Booking confirmation |
| Payment reconciliation | Financial integrity |
| Service start/completion | Operational evidence |
| Media upload | Required service updates |
| Report-card submission | Quality record |
| Customer booking history | Customer usability |
| Customer review | Quality monitoring |
| Incident reporting | Safety-critical |
| Admin dashboard | Operational source of truth |
| Audit history | Accountability |
| Basic notifications | Timely action |

P1 — Strong early improvements

### Table 89

| Feature | Reason |
| --- | --- |
| Advanced availability calendar | Better scheduling UX |
| Automated payout batches | Reduce finance workload |
| City/area pricing editor | Useful after more than one active area |
| Automatic badge generation | Can begin manually |
| Travel-time estimates | Improve matching efficiency |
| PWA install prompt | Convenience |
| Offline report drafts | Weak-network support |
| Prepaid packs | Repeat retention |
| Advanced report analytics | Later optimisation |

P2 — Do not build in Phase 4

Native customer and sitter apps

AI matching

Full GPS route tracking

Insurance engine

Full recurring subscription system

Wallet

Product store

Open marketplace search

Complex in-app chat

Dynamic pricing

Nationwide multi-city automation

24. End-to-end database journey

Step 1 — Customer registration

Writes:

users

user_roles

customer_profiles

policy_acceptances

Step 2 — Pet creation

Writes:

pets

pet_behavior_profiles

pet_medical_profiles

pet_care_instructions

pet_emergency_contacts

Admin later creates:

pet_risk_assessments

Step 3 — Booking request

Writes:

bookings

booking_pets

booking_address_snapshot

booking_instruction_snapshot

booking_price_components

booking_status_history

Current status:

REQUESTED

Step 4 — Admin review and matching

Reads:

Pet risk

Service permissions

Sitter availability

Sitter bookings

Service area

Recent performance

Writes:

booking_assignments

booking_status_history

notification_outbox

Step 5 — Payment

Writes:

payments

payment_events

booking_status_history

Booking becomes confirmed only after the validated payment reaches the accepted state.

Step 6 — Service execution

Writes:

booking_events

booking_status_history

report_media drafts

Step 7 — Report submission

Writes:

booking_reports

report_media

booking_status_history

A concern may additionally create:

incidents

incident_events

Step 8 — Customer review

Writes:

reviews

Updates the sitter’s calculated performance metrics.

Step 9 — Payout

Writes:

payout_items

payouts

Step 10 — Closure

Writes:

booking_status_history

admin_audit_logs

notification_outbox

25. Essential database constraints

At minimum, enforce:

Unique public booking code

Unique provider webhook/event ID

Unique review per booking

Booking end after booking start

Positive duration

Non-negative financial amounts

One active primary assignment per booking

Active sitter permission before assignment

Completed booking before review

Completed assignment before payout item

Current boarding-property approval before boarding assignment

Incident review before closing a critical incident

No public badge from expired or failed verification

Customer ownership before pet or booking modification

Constraints should be implemented in PostgreSQL wherever possible rather than left entirely to frontend validation.

26. Indexes required early

Add indexes for frequent operational queries:

bookings(customer_id, created_at)

bookings(status, scheduled_start_at)

booking_assignments(sitter_id, status)

sitter_service_permissions(service_type_id, permission_status)

sitter_availability_rules(sitter_id, day_of_week)

pet_risk_assessments(pet_id, service_type_id, status)

payments(provider_order_id)

payments(provider_payment_id)

incidents(status, severity)

reviews(sitter_id, submitted_at)

PostgreSQL notes that indexes primarily improve lookup performance, although unnecessary indexes add write cost, so they should reflect real query patterns.

27. Security rules

Browser

The browser may receive:

Public profile data

User-owned customer records

Assigned sitter booking data

Signed media links

The browser must never receive:

Supabase service-role credentials

Razorpay secret

WhatsApp API secret

Complete verification documents without permission

Other customers’ data

Unrelated sitter incident history

Server

The server controls:

Price calculation

Booking transitions

Sitter eligibility

Assignment

Payment verification

Refund approval

Payout calculation

Badge generation

Risk changes

Incident closure

Database and Storage

Use:

RLS

Foreign keys

Unique constraints

Private buckets

Audit logs

Environment separation

Backups

Retention policies

28. Definition of done

The MVP architecture is ready only when:

Data

Every core entity has a stable identifier.

Roles are many-to-many.

Historical status changes are preserved.

Booking-time snapshots exist.

Pet risk is service-specific.

Sitter permission is service-specific.

Files are private.

Payments and refunds are separate.

APIs

Generic status changes are blocked.

Explicit business commands enforce transitions.

Every protected route checks identity and permission.

Payment webhook processing is signed and idempotent.

Multi-table changes use transactions.

Error responses do not leak sensitive data.

Pages

Customer, sitter and admin journeys are complete.

Mobile forms preserve user progress.

Private pages are not publicly indexable.

Critical actions require clear confirmation.

Status and error messages are understandable.

Operations

Admin can identify the next action for every booking.

Sitter assignment history is visible.

Failed payments and refunds can be reconciled.

Reports and incidents are linked to bookings.

Payout calculations can be audited.

Final recommendation

Your proposed schema should be treated as a domain inventory, not the final database migration.

The final Phase 4 MVP should use:

A normalised PostgreSQL model with separate roles, pet-risk assessments, sitter verification records, service permissions, booking assignments, operational histories, payment events, refunds, report media, structured reviews, incident timelines and payout items.

The API should combine:

Resource-based read endpoints

Explicit command endpoints for state changes

Next.js Route Handlers for external webhooks

Server-side permission checks

Transactional writes

RLS-backed data and file access

The design direction should remain warm and premium, but all trust claims must state the exact process actually completed.

Simple explanation for professor

“The proposed PetSaathi schema correctly identifies the main parts of the platform, but several fields need to be separated before development. A user can have more than one role, so roles will have their own table. Pet vaccination, behaviour, medical information and service-specific risk assessments will use structured records instead of one text field. Sitter verification, training, service permissions and public badges will also be stored separately. A booking may contain several pets and primary, backup or replacement sitters, so those relationships will have their own tables. Payment, refund, report, review and incident states will not be mixed into one booking status. Every important status change will be preserved in a history table. The API will use specific actions such as assign sitter, accept offer, start service, complete service and cancel booking instead of allowing a user to set any status directly. The final MVP will therefore remain lean but will use a database and backend structure capable of supporting future production growth safely.”

PetSaathi Phase 4 — Week 1 MVP Product Planning, End to End 🚀🐾

Executive assessment

Your Week 1 structure is correct:

### Table 90

| Day | Main focus | Core result |
| --- | --- | --- |
| Day 1 | Feature freeze | Agreed MVP scope |
| Day 2 | User flows | Complete customer, sitter and admin journeys |
| Day 3 | Wireframes | Screen-level product design |
| Day 4 | Database schema | Structured data model |
| Day 5 | API planning | Backend contract and integration plan |
| Day 6 | UI system | Reusable visual and interaction standards |
| Day 7 | Review | Development-ready specification |

However, Week 1 should also produce five items that are currently missing:

Role and permission matrix

Booking and payment state-transition rules

Security and privacy requirements

Analytics and audit-event plan

Testable acceptance criteria

Without these, developers may create attractive screens while implementing different interpretations of booking confirmation, sitter access, refunds and incident handling.

Week 1 core goal

The official Week 1 objective should be:

Convert all validated Phase 2 and Phase 3 workflows into one unambiguous development specification covering product scope, users, screens, data, APIs, permissions, business rules, security requirements and acceptance criteria.

At the end of the week, a developer should not need to ask basic questions such as:

When does a booking become confirmed?

Can a sitter see the address before accepting?

Who assigns the pet-risk level?

What happens when payment succeeds but the browser closes?

Can a customer cancel after the service starts?

Who can approve a refund?

Can an admin manually override a booking status?

What happens if a report contains a serious concern?

Which boarding requests are allowed?

Which fields are public, internal or restricted?

Corrected Week 1 deliverables

### Table 91

| Deliverable | Required? | Purpose |
| --- | --- | --- |
| Product Requirements Document | Yes | Defines what the MVP will and will not do |
| Scope and priority matrix | Yes | Separates P0, P1 and deferred features |
| User-flow map | Yes | Shows complete journeys and exception paths |
| Role-permission matrix | Yes | Defines who may access or change each resource |
| Wireframes | Yes | Defines screens, layouts and actions |
| Clickable prototype | Recommended | Tests important journeys before coding |
| Page and route list | Yes | Defines public and authenticated product structure |
| Database ERD | Yes | Shows tables and relationships |
| Prisma schema draft | Yes | Converts the logical model into code structure |
| Data dictionary | Yes | Defines every important field and enum |
| Status-transition specification | Yes | Controls booking, payment, assignment and reports |
| API contract list | Yes | Defines endpoints, inputs, outputs and permissions |
| Integration plan | Yes | Covers Razorpay, WhatsApp, storage and email |
| Design system | Yes | Defines reusable UI patterns |
| Security requirements | Yes | Prevents access-control and data-handling mistakes |
| Analytics event plan | Yes | Measures product funnels without sensitive data |
| Test strategy | Yes | Defines how critical workflows will be verified |
| Sprint backlog | Yes | Converts plans into buildable engineering tasks |
| Risk register | Yes | Records product, safety and technical risks |

Day 1 — Feature Freeze and Product Scope

Goal

Decide exactly what will be built during the 60-day MVP and what will be deliberately postponed.

“Feature freeze” does not mean that no change is ever allowed. It means:

The MVP baseline is formally agreed. Any new feature must replace another feature, extend the timeline or be postponed.

This protects the project from continuous scope expansion.

Day 1 input

Review the outputs from earlier phases:

Phase 2 evidence

Which services received paid demand?

Which booking steps required repeated admin work?

What caused cancellations and refunds?

Which service had positive contribution?

Which customer questions appeared repeatedly?

Phase 3 evidence

What sitter information is necessary?

Which verification records exist?

Which service permissions must be enforced?

What pet-risk information affects matching?

What emergency and incident steps must be supported?

Phase 4 constraints

One city

One primary micro-market

Dog walking and pet sitting active

Boarding controlled beta

Manual or rules-assisted matching

No native applications

No complex AI

No full live chat

No product marketplace

Day 1 scope classification

Use three priority groups.

P0 — Required for controlled launch

### Table 92

| Feature | Why it is mandatory |
| --- | --- |
| Authentication | Identifies customers, sitters and admins |
| Role-based access | Prevents unauthorised data access |
| Customer profiles | Stores account information |
| Pet profiles | Supports care and risk decisions |
| Booking requests | Core commercial action |
| Admin risk review | Protects matching safety |
| Sitter assignment | Connects booking with provider |
| Online payment | Confirms paid service |
| Booking status workflow | Controls operations |
| Sitter service execution | Records actual service |
| Report Card | Provides service evidence |
| Reviews | Captures booking-linked feedback |
| Incident reporting | Supports safety operations |
| Admin dashboard | Operates the platform |
| Audit history | Records important changes |

P1 — Build when core P0 work is stable

### Table 93

| Feature | Treatment |
| --- | --- |
| Sitter availability calendar | Recommended |
| WhatsApp notifications | Recommended |
| Email notifications | Recommended |
| Repeat booking | Recommended |
| Prepaid walk packs | Simple version |
| Map-based travel estimates | Basic version |
| Sitter payout ledger | Recommended |
| PWA installation | Recommended |
| Offline report draft | Useful but not launch-blocking |

P2 — Explicitly postponed

### Table 94

| Feature | Why postponed |
| --- | --- |
| Native Android/iOS apps | Duplicate development effort |
| Complex AI matching | Insufficient reliable data |
| Full live chat | Moderation and infrastructure burden |
| Open boarding marketplace | High safety risk |
| Full GPS route tracking | Not necessary for core validation |
| Insurance engine | Regulatory and partner work |
| Automatic subscription billing | Complex billing lifecycle |
| Internal wallet | Financial reconciliation complexity |
| Product store | Separate business model |
| Nationwide rollout | Hyperlocal operations not yet proven digitally |

Day 1 PRD sections

The Product Requirements Document should contain:

1. Product summary

What PetSaathi is and what the MVP is meant to validate.

2. Pilot scope

City

Areas

Services

Customer type

Sitter type

Boarding restrictions

Launch group

3. Problem statement

Example:

Pet parents currently use fragmented calls, WhatsApp messages, payments and updates. PetSaathi needs one managed digital workflow that preserves human safety review while reducing manual administrative work.

4. Product objectives

Examples:

Reduce booking coordination time.

Prevent assignment of ineligible sitters.

Ensure prepaid booking confirmation.

Deliver a report for every completed service.

Maintain full operational status history.

Keep serious safety decisions under human control.

5. Non-objectives

Explicitly state what Phase 4 will not solve.

6. User roles

Customer

Sitter

Admin

Restricted internal admin permissions

7. Functional requirements

What each role must be able to do.

8. Non-functional requirements

Mobile responsiveness

Accessibility

Security

Performance

Reliability

Auditability

Privacy

Error recovery

Backup and restore

9. Success metrics

Booking request completion

Payment reconciliation

Report completion

Status accuracy

Access-control defects

Customer rating

Sitter no-shows

10. Launch gates

Conditions that must pass before production use.

Day 1 output

A signed-off document called:

PetSaathi Phase 4 MVP Scope and PRD — Version 1.0

Day 1 acceptance criteria

Day 1 is complete when:

Every feature has a priority.

Every deferred feature is listed.

Active services are defined.

Boarding restrictions are documented.

Pilot city and area are identified.

Customer, sitter and admin objectives are written.

Success metrics are measurable.

Product owner and technical owner approve the scope.

Day 2 — User Flows and Business Logic

Goal

Document how each user completes their tasks, including failure cases—not merely the happy path.

Required flow categories

Customer flows

Signup and login

Create pet

Update pet

Request service

Review sitter

Pay

Track booking

Cancel

Receive report

Submit review

Request repeat booking

Report a problem

Sitter flows

Login

View profile and permissions

Set availability

Receive booking offer

Accept or reject

View confirmed booking

Start service

Send updates

Report concern

Complete service

Submit report

View payout

Admin flows

Review booking request

Review pet risk

Identify eligible sitters

Assign primary and backup sitter

Confirm customer approval

Monitor payment

Monitor active service

Process cancellation

Arrange replacement

Review report

Process refund

Approve payout

Open and close an incident

Customer main flow

Signup

→ Create pet

→ Choose service

→ Select schedule

→ Add address

→ Add instructions

→ Review estimated price

→ Submit request

→ Risk review

→ Sitter matching

→ Review proposed sitter

→ Approve sitter

→ Pay

→ Booking confirmed

→ Service tracked

→ Report received

→ Review submitted

→ Repeat request

Sitter main flow

Login

→ View eligible booking offer

→ Review service, locality, pet and payout

→ Accept or reject

→ Assignment confirmed

→ View full instructions

→ Mark en route

→ Mark arrival

→ Start service

→ Send updates

→ Complete service

→ Submit report

→ Payout becomes pending

Admin main flow

New booking request

→ Validate pet and service

→ Review risk

→ Apply sitter eligibility filters

→ Offer booking

→ Assign accepted sitter

→ Obtain customer approval

→ Trigger payment

→ Confirm payment

→ Monitor service

→ Review report

→ Create payout

→ Close booking

Exception flows that must be designed

The flow map should include:

### Table 95

| Exception | Required flow |
| --- | --- |
| No eligible sitter | Waitlist, alternative time or decline |
| Sitter rejects | Offer next eligible sitter |
| Customer rejects sitter | Rematch or cancel |
| Payment fails | Retry without duplicate booking |
| Payment succeeds but browser closes | Confirm through server/webhook |
| Sitter cancels | Replacement workflow |
| Sitter no-show | Urgent replacement, refund and investigation |
| Customer unavailable | Contact attempts and policy decision |
| Pet information changes | Pause and repeat risk review |
| Report missing | Reminder and admin escalation |
| Concern in report | Create safety review or incident |
| Boarding property unavailable | Rematch or decline |
| Refund fails | Keep financial status pending and retry |

Role and permission matrix

Define permission at the action level.

### Table 96

| Action | Customer | Sitter | Admin |
| --- | --- | --- | --- |
| Create pet profile | Own records | No | Assisted |
| Assign risk level | No | No | Safety permission |
| Create booking request | Own booking | No | Assisted |
| Accept sitter assignment | Approve proposal | Accept offer | Assign |
| Change customer price | No | No | Pricing-authorised admin |
| Confirm payment | No | No | Server payment workflow |
| Start service | No | Assigned sitter | Emergency override |
| Submit report | No | Assigned sitter | Correction/review |
| Approve refund | Request only | No | Finance permission |
| Close incident | No | No | Safety permission |

OWASP ASVS provides a structured basis for specifying and testing web-application security controls, so role and permission requirements should be written into the product plan rather than added after development.

State-machine diagrams

Document separate state machines for:

Booking

Assignment

Payment

Refund

Report

Review

Incident

Sitter operational status

This is essential because payment, refund and review status should not be forced into one booking-status field.

Day 2 output

A visual flow document containing:

Happy paths

Failure paths

User decisions

System decisions

Admin decisions

Status transitions

Notification points

Day 2 acceptance criteria

Every P0 feature appears in at least one flow.

Every page has an identified user and purpose.

Every status change has an actor.

Cancellation and replacement paths are mapped.

Payment success and failure paths are mapped.

Safety escalation is mapped.

No flow depends on an undefined manual action.

Day 3 — Figma Low-Fidelity Wireframes

Goal

Turn the flows into screens before development begins.

Low-fidelity wireframes should focus on:

Information hierarchy

Navigation

Actions

Required information

Error states

Role-specific views

They should not spend significant time on illustrations, animations or polished branding.

Figma prototypes can connect screens into interactive flows, allowing the team to test how users will move through the product before development.

Public screens to wireframe

Homepage

Services

Dog walking

Pet sitting

Boarding beta

Pricing

Safety

Become a Sitter

Contact

City page

FAQ

Login/signup

Customer screens to wireframe

Authentication

Phone entry

OTP verification

Profile setup

Pet module

Pet list

Add pet

Basic information

Behaviour

Health

Vet and emergency

Pet summary

Admin-review state

Booking module

Choose pet

Choose service

Schedule

Address

Instructions

Price estimate

Review request

Matching state

Sitter proposal

Payment

Confirmation

Active booking

Report Card

Review

Cancellation

Sitter screens to wireframe

Dashboard

Profile

Verification status

Service permissions

Availability

Booking offers

Offer details

Confirmed booking

Pet instructions

Active service

Upload update

Emergency action

Report submission

Earnings

Ratings

Admin screens to wireframe

Operations overview

Booking queue

Booking detail

Pet-risk review

Sitter shortlist

Assignment panel

Customer profile

Pet profile

Sitter profile

Verification review

Active service monitoring

Payment detail

Refund review

Report review

Incident centre

Payout management

Pricing settings

Area settings

Wireframe states

Every important screen should include:

### Table 97

| State | Example |
| --- | --- |
| Loading | Booking information loading |
| Empty | No upcoming bookings |
| Success | Payment confirmed |
| Validation error | Missing emergency contact |
| System error | Payment provider unavailable |
| Permission denied | Sitter accessing unassigned booking |
| Pending | Risk review in progress |
| Restricted | Boarding unavailable in area |
| Offline | Report saved locally, not yet submitted |

Mobile-first design requirement

Create mobile wireframes first for:

Customer flows

Sitter flows

Public website

Create desktop-first wireframes for:

Admin tables

Operations dashboards

Verification review

Incident management

Prototype test scenarios

Test at least these journeys:

Customer creates a pet and requests a walk.

Customer approves a sitter and pays.

Sitter accepts and completes a service.

Sitter submits a report with no concern.

Sitter submits a report with a serious concern.

Admin replaces a cancelled sitter.

Admin processes a refund.

Day 3 output

Low-fidelity screen library

Clickable core prototype

Annotation notes

Mobile and desktop breakpoints

Missing-information list

Day 3 acceptance criteria

Every main user flow has screens.

Every screen has one clear primary action.

Back navigation does not lose entered information.

Booking states are understandable without internal jargon.

Critical actions require confirmation.

Error, empty and loading states exist.

Boarding is visibly marked controlled beta.

Day 4 — Database and Prisma Schema

Goal

Create the data architecture that supports current workflows and preserves future audit history.

Do not begin by directly writing a large Prisma file. First create:

Conceptual model

Entity relationship diagram

Data dictionary

Constraints and lifecycle rules

Prisma schema draft

Prisma uses a declarative schema for data models and produces SQL migration files that can be reviewed and customised. Its migration workflow separates development migration generation from production deployment.

Core entity groups

Identity

users

user_roles

customer_profiles

sitter_profiles

admin_permissions

Pets

pets

pet_behavior_profiles

pet_medical_profiles

pet_vaccination_records

pet_emergency_contacts

pet_risk_assessments

Sitter trust

sitter_verifications

sitter_service_permissions

sitter_availability_rules

sitter_availability_exceptions

sitter_training_attempts

boarding_properties

Bookings

bookings

booking_pets

booking_assignments

booking_instructions

booking_price_snapshots

booking_status_history

booking_events

Service output

booking_reports

report_media

reviews

complaints

Finance

payments

payment_events

refunds

payouts

payout_adjustments

Safety

incidents

incident_events

incident_notifications

incident_attachments

incident_corrective_actions

System

notification_outbox

notification_deliveries

admin_audit_logs

service_areas

pricing_rules

policy_versions

Database design decisions to finalise

IDs

Use:

Internal UUID

Human-readable public code where necessary

Example:

Internal ID: 8ac312…

Public booking code: BK-1001

Money

Store amounts in paise as integers.

₹149 = 14900

Time

Store booking times as timezone-aware timestamps and preserve the local timezone.

History

Do not overwrite important historical facts.

Preserve:

Booking status changes

Pet-risk assessment versions

Price snapshots

Sitter assignments

Verification changes

Report amendments

Incident timeline

Admin decisions

Soft deletion

Do not physically delete completed booking, payment, report or incident history.

Use states such as:

Archived

Deactivated

Revoked

Superseded

Critical constraints

Define constraints before coding:

Booking end must be after start.

Customer must own the selected pet.

Only one active primary sitter may exist per booking.

Assigned sitter must hold the correct service permission.

Boarding booking requires approved host and approved property.

Review requires a completed booking.

One customer review per booking.

Payout requires a completed sitter assignment.

Captured amount must match booking amount.

Suspended sitter cannot accept an offer.

Level 3 incident cannot close without final review.

Expired verification cannot generate a public badge.

Row-level access planning

Even when most database access passes through the Next.js server, define ownership and role rules early. Supabase documents Row Level Security as a PostgreSQL mechanism for restricting row access and integrating authorization with Supabase Auth; it also recommends ensuring exposed tables have RLS or equivalent safeguards.

Create an access matrix for every table:

### Table 98

| Table | Customer | Sitter | Operations | Safety | Finance |
| --- | --- | --- | --- | --- | --- |
| Pets | Own | Assigned booking subset | Relevant | Full safety view | No |
| Addresses | Own | Confirmed assignment only | Relevant | Incident need | No |
| Verification docs | No | Own submission | No | Limited | No |
| Payments | Own summary | No | Status only | No | Full |
| Incidents | Relevant updates | Assigned incident | Operational | Full | Expense only |

Day 4 output

Entity relationship diagram

Prisma schema draft

Data dictionary

Enum catalogue

Constraint list

Access-control matrix

Migration strategy

Day 4 acceptance criteria

Every P0 feature has supporting tables.

No critical workflow depends on one overloaded field.

Historical states are preserved.

Sensitive fields have access rules.

Booking, payment and assignment are separate entities.

Foreign keys and uniqueness rules are defined.

Production migration approach is documented.

Day 5 — API and Backend Contract Planning

Goal

Define how the frontend, backend, payment provider, storage and notification systems communicate.

For a new App Router project, current Next.js documentation uses Route Handlers inside the app directory for custom HTTP handlers. Folders define route segments, and a route is exposed only when a corresponding page or route file exists.

First decision: Server Action or Route Handler?

Server Actions

Use for internal authenticated form mutations such as:

Create pet

Update pet

Change availability

Accept booking

Submit review

Route Handlers

Use for:

Razorpay webhooks

WhatsApp webhooks

File-upload signing

External integrations

Public form endpoints

Mobile/API clients later

Explicitly versioned APIs

Do not automatically create a REST endpoint for every button when a secure internal server action is sufficient.

API contract fields

Document every API or server action with:

### Table 99

| Field | Meaning |
| --- | --- |
| Name | Stable operation name |
| Method | GET, POST, PATCH, DELETE |
| Route | Endpoint path |
| Actor | Customer, sitter, admin or provider |
| Authentication | Required session or webhook signature |
| Permission | Exact role/ownership requirement |
| Request schema | Accepted fields and data types |
| Validation | Business rules |
| Response schema | Successful response |
| Error codes | Expected failures |
| Idempotency | Duplicate-request treatment |
| Audit event | Whether action is logged |
| Notification | Messages triggered |
| Transaction boundary | Records updated together |

Recommended API groups

Authentication

POST /api/auth/otp/request

POST /api/auth/otp/verify

POST /api/auth/logout

GET /api/auth/session

Pets

POST /api/pets

GET /api/pets

GET /api/pets/:id

PATCH /api/pets/:id

POST /api/pets/:id/submit-review

POST /api/pets/:id/archive

Bookings

POST /api/bookings

GET /api/bookings/:id

POST /api/bookings/:id/cancel

POST /api/bookings/:id/approve-sitter

POST /api/bookings/:id/request-rematch

Avoid a generic public endpoint such as:

PUT /api/bookings/:id/status

That would make arbitrary status changes too easy. Use purpose-specific actions:

POST /api/sitter/bookings/:id/start

POST /api/sitter/bookings/:id/complete

POST /api/admin/bookings/:id/assign

Payment APIs

POST /api/payments/orders

POST /api/payments/verify

POST /api/webhooks/razorpay

POST /api/admin/refunds

Razorpay states that webhook delivery may produce duplicate events and recommends idempotent processing. That requirement should appear in the API specification before implementation.

Sitter APIs

GET /api/sitter/profile

PATCH /api/sitter/profile

GET /api/sitter/availability

PUT /api/sitter/availability

GET /api/sitter/offers

POST /api/sitter/offers/:id/accept

POST /api/sitter/offers/:id/reject

POST /api/sitter/bookings/:id/en-route

POST /api/sitter/bookings/:id/start

POST /api/sitter/bookings/:id/complete

Report APIs

POST /api/bookings/:id/report

PATCH /api/reports/:id

GET /api/bookings/:id/report

POST /api/reports/:id/media

Admin APIs

GET /api/admin/dashboard

GET /api/admin/bookings

GET /api/admin/bookings/:id

POST /api/admin/bookings/:id/review-risk

POST /api/admin/bookings/:id/assign

POST /api/admin/bookings/:id/replacement

POST /api/admin/bookings/:id/cancel

POST /api/admin/sitters/:id/verification-decision

POST /api/admin/incidents/:id/action

POST /api/admin/payouts/:id/approve

Standard error model

Use consistent responses such as:

{

"error": {

"code": "SITTER_NOT_ELIGIBLE",

"message": "This sitter is not eligible for the requested service.",

"requestId": "req_123"

}

}

Define expected error codes during planning:

AUTHENTICATION_REQUIRED

FORBIDDEN

RESOURCE_NOT_FOUND

INVALID_BOOKING_STATE

PET_REVIEW_REQUIRED

SITTER_NOT_ELIGIBLE

TIME_SLOT_CONFLICT

PAYMENT_NOT_CAPTURED

DUPLICATE_REQUEST

BOARDING_PROPERTY_NOT_APPROVED

Day 5 output

Complete endpoint catalogue

Request/response schemas

Validation rules

Error-code catalogue

Authentication requirements

Webhook specifications

Idempotency rules

Audit and notification mapping

Day 5 acceptance criteria

Every wireframe action maps to an API or server action.

Every endpoint has an authorised actor.

Generic status-changing endpoints are avoided.

Payment and refund actions are idempotent.

Webhook validation is documented.

Every critical mutation has a transaction plan.

Sensitive fields are not returned unnecessarily.

Day 6 — UI System and Interaction Standards

Goal

Create reusable design rules so the product feels consistent and can be developed quickly.

Figma’s design-system guidance centres on reusable styles and components that can be documented and shared across product screens.

Foundation tokens

Define:

Colour tokens

Use semantic names rather than fixed component-specific names:

background-default

background-subtle

text-primary

text-secondary

border-default

action-primary

status-success

status-warning

status-critical

status-info

Do not rely only on colour to communicate:

Pet risk

Booking status

Payment result

Incident severity

Always include text or icons.

Typography

Define:

Display heading

Page heading

Section heading

Body

Small body

Label

Caption

Button text

Spacing

Use a consistent spacing scale such as:

4, 8, 12, 16, 24, 32, 48, 64

Radius and elevation

Define a small number of card and modal styles rather than creating different shadows on every page.

Core components

Form components

Text input

Phone input

Number input

Select

Radio group

Checkbox

Text area

Date picker

Time window selector

File uploader

Multi-step form navigation

Validation error

Required-field indicator

Product components

Pet card

Sitter card

Service card

Booking card

Price breakdown

Verification badge

Risk-review notice

Status timeline

Report Card

Review form

Incident alert

Payout row

Admin components

Data table

Filters

Search

Status badge

Action drawer

Confirmation dialog

Audit timeline

Evidence viewer

Permission-gated action

Component states

Every interactive component should define:

Default

Hover

Focus

Active

Disabled

Loading

Error

Success

Read-only

Accessibility standard

Use WCAG 2.2 as the design target. W3C’s guidance says accessible forms need clear labels, instructions and feedback, and multi-page forms should communicate structure and progress.

Minimum requirements:

Visible form labels

Text instructions for required formats

Keyboard navigation

Visible focus

Adequate contrast

Large mobile touch targets

Error text near the field

Error summary for long forms

Step number for multi-step flows

Accessible modal focus handling

Alt text for meaningful pet images

Captions or text alternatives for training video content

Status language

Define customer-friendly language separately from internal codes.

### Table 100

| Internal code | Customer-facing text |
| --- | --- |
| PENDING_ADMIN_REVIEW | Care details under review |
| SITTER_MATCHING | Finding a suitable sitter |
| PAYMENT_PENDING | Payment required |
| INCIDENT_HOLD | Service issue under review |
| YELLOW risk | Additional matching review required |
| RED risk | Manual safety review required |

Day 6 output

Design tokens

Component inventory

Component states

Mobile navigation

Desktop admin navigation

Status-copy catalogue

Form rules

Accessibility checklist

Day 6 acceptance criteria

Core screens use reusable components.

Customer and sitter screens are mobile-first.

Admin screens support dense operational data.

Statuses have consistent text.

Accessibility requirements are included in component specifications.

Error and loading states are defined.

Sensitive actions have confirmation patterns.

Day 7 — Product, Technical and Development-Readiness Review

Goal

Verify that the product can enter implementation without unresolved structural questions.

Day 7 is not a presentation-only day. It is a formal quality gate.

Review 1 — Scope review

Confirm:

Every P0 item remains included.

P1 items are clearly optional.

P2 features have not silently returned.

Boarding is still controlled beta.

No requirement assumes automated AI matching.

No requirement assumes unrestricted live chat.

Review 2 — Flow-to-screen traceability

Create a matrix:

### Table 101

| Requirement | Flow | Screen | API | Database table | Acceptance test |
| --- | --- | --- | --- | --- | --- |
| Customer adds pet | Customer onboarding | Add Pet | POST /api/pets | pets | Valid pet saved |
| Admin assigns sitter | Matching | Assignment panel | Assignment action | booking_assignments | Only eligible sitter assigned |
| Customer pays | Payment | Checkout | Create/verify payment | payments | Booking confirms only after capture |
| Sitter reports concern | Service execution | Report form | Submit report | incidents | Incident created |

Every P0 requirement should appear across the full chain.

Review 3 — Security review

Use an initial OWASP ASVS-derived checklist for:

Authentication

Session handling

Role authorization

Ownership validation

File uploads

Sensitive-data exposure

Audit logs

Error handling

Secrets

Webhook validation

OWASP ASVS is designed to provide both secure-development requirements and a basis for testing application security controls.

Review 4 — Data review

Confirm:

Correct table ownership

History and audit tables

No overloaded statuses

No public identity documents

No customer address exposed before assignment

Risk assessments are versioned

Price snapshots are preserved

Refunds remain separate from bookings

Reviews are linked to completed bookings

Review 5 — Prototype walkthrough

Run the prototype with:

One pet parent

One approved sitter

One operations user

Give each person a task without explaining where to click.

Observe:

Confusing labels

Missing information

Dead ends

Excessive steps

Hidden actions

Misunderstood statuses

Missing back navigation

Review 6 — Technical risk assessment

Track risks such as:

### Table 102

| Risk | Mitigation |
| --- | --- |
| Payment webhook duplicates | Event deduplication and idempotency |
| OTP provider delay | Retry and fallback policy |
| Sensitive file exposure | Private storage and signed links |
| Incorrect sitter access | Server authorization and RLS |
| Booking double-assignment | Database constraint and transaction |
| Report upload failure | Draft and retry workflow |
| Unclear risk information | Admin clarification workflow |
| Scope growth | Change-control rule |

Review 7 — Sprint planning

Convert requirements into engineering stories.

Example:

Epic: Customer Pet Profile

Story

As a pet parent, I need to create a pet profile so PetSaathi can review care needs and match an appropriate sitter.

Acceptance criteria

Customer may create more than one pet.

Required fields are validated.

Bite history opens additional questions.

Medical details are stored privately.

New pet starts as UNASSESSED.

Customer cannot assign risk level.

Admin receives a review task.

Customer cannot access another customer’s pet.

Day 7 output

Approved planning package

Final issue list

Resolved design decisions

Prioritised sprint backlog

Dependency map

Risk register

Definition of Ready

Week 2 development plan

Sprint Backlog Structure

Organise the backlog into epics.

Epic 1 — Foundation

Next.js project

Database connection

Authentication

Roles and permissions

Environments

Logging

Error monitoring

Epic 2 — Customer and Pet

Customer profile

Address

Pet profile

Behaviour

Health

Emergency contacts

Risk-review submission

Epic 3 — Booking

Booking form

Price estimate

Booking state machine

Assignment

Cancellation

Replacement

Epic 4 — Payments

Order creation

Checkout

Verification

Webhooks

Refunds

Reconciliation

Epic 5 — Sitter Operations

Profile

Permissions

Availability

Offers

Service actions

Reports

Earnings

Epic 6 — Admin Operations

Overview

Booking queue

Matching

Verification

Reports

Incidents

Refunds

Payouts

Epic 7 — Quality and Launch

Notifications

Analytics

Accessibility

Security testing

UAT

PWA

Deployment

Definition of Ready

A story may enter development only when:

User and purpose are defined.

UI or expected interaction is defined.

API action is defined.

Data fields are defined.

Permission rule is defined.

Validation rules are defined.

Error states are defined.

Acceptance criteria are testable.

Dependencies are identified.

Analytics and audit requirements are identified.

Definition of Done

A story is complete only when:

Code is implemented.

Server-side authorization exists.

Validation exists.

Loading and error states work.

Automated tests pass.

Accessibility checks pass.

Audit events are created where required.

Analytics excludes sensitive data.

Code review is complete.

Staging test passes.

Documentation is updated.

Corrected Week 1 schedule

### Table 103

| Day | Focus | Required final output |
| --- | --- | --- |
| Day 1 | Scope and feature freeze | PRD, priorities, launch goals and exclusions |
| Day 2 | User and system flows | Role matrix, state machines and exception flows |
| Day 3 | Wireframes | Mobile/desktop screens and clickable core prototype |
| Day 4 | Data architecture | ERD, data dictionary, Prisma schema and constraints |
| Day 5 | Backend contracts | API list, schemas, errors, webhooks and idempotency |
| Day 6 | Design system | Tokens, components, states and accessibility rules |
| Day 7 | Readiness review | Approved package, sprint backlog, risks and build plan |

Week 1 success criteria

### Table 104

| Metric | Target |
| --- | --- |
| P0 features defined | 100% |
| P2 exclusions documented | 100% |
| Core user flows mapped | 100% |
| Exception flows mapped | 100% of critical cases |
| P0 screens wireframed | 100% |
| Core prototype journeys | At least 5 |
| Database entities mapped | 100% of P0 features |
| Critical constraints defined | 100% |
| API actions mapped to screens | 100% |
| Role permissions defined | 100% |
| Security requirements identified | Yes |
| Sprint backlog prioritised | Yes |
| Unresolved launch-blocking questions | 0 |

Common Week 1 mistakes to avoid

Mistake 1 — Designing only the happy path

The product must handle payment failure, cancellation, no sitter, replacement, report failure and incidents.

Mistake 2 — Starting database coding before workflows are stable

This leads to overloaded fields such as one status column for payment, refund, report and booking state.

Mistake 3 — Creating wireframes without real data

Screens should use realistic examples:

Long society names

Multiple pets

Yellow-risk instructions

Failed payment

Long sitter notes

Missing media

Partial refund

Mistake 4 — Treating security as a later sprint

Ownership rules, role permissions and private-file access affect the schema, APIs and interfaces from the beginning.

Mistake 5 — Treating the design system as only colours

The design system must include forms, validation, statuses, loading, errors, accessibility and responsive behaviour.

Mistake 6 — Writing a route list without API contracts

An endpoint name alone does not explain permissions, validations, errors, state transitions or idempotency.

Mistake 7 — Over-polishing Figma

Week 1 should optimise workflow clarity, not spend several days perfecting illustrations or animations.

Final Week 1 deliverable package

At the end of the week, create one structured workspace containing:

01 — MVP Scope and PRD

02 — User Roles and Permissions

03 — User Flows and State Machines

04 — Figma Wireframes and Prototype

05 — Page and Route Map

06 — Database ERD

07 — Prisma Schema Draft

08 — Data Dictionary and Enums

09 — API and Integration Contracts

10 — Design System

11 — Security and Privacy Requirements

12 — Analytics and Audit Events

13 — Test Strategy

14 — Risk Register

15 — Sprint Backlog

16 — Development Readiness Sign-off

Final operating principle

Week 1 is successful only when product, design and engineering describe the same system. Every important customer action must map to a screen, every screen action to a controlled backend operation, every operation to structured data and permissions, and every requirement to a testable acceptance criterion.

Simple explanation for professor

“During the first week of MVP development, PetSaathi will not begin deep coding immediately. Day 1 will freeze the feature scope and separate mandatory, optional and postponed features. Day 2 will map complete customer, sitter and admin workflows, including payment failure, cancellation, replacement and incident cases. Day 3 will convert those workflows into mobile-first Figma wireframes and a clickable prototype. Day 4 will define the database relationships, field meanings, constraints and Prisma schema. Day 5 will map every screen action to a secure API or server action, including payment and webhook rules. Day 6 will define reusable buttons, forms, cards, statuses, error states and accessibility standards. Day 7 will review the complete system, connect each requirement to a screen, API, database table and acceptance test, and convert the plan into a prioritised sprint backlog. Development begins only after all launch-blocking questions have been resolved.”

PetSaathi Phase 4 — Week 2: Project Setup and Public Website 🐾🚀

Week 2 objective

Week 2 should produce a working, mobile-first public website on a staging URL, not merely a collection of static designs.

By Day 14, a visitor should be able to:

Understand what PetSaathi offers

See which services are currently active

Understand pricing and the trust process

Start a customer booking journey

Submit a sitter application

Contact PetSaathi

Use every important page comfortably on a phone

The correct Week 2 outcome is:

A technically sound, responsive and conversion-ready public website that becomes the front door of the future customer, sitter and admin platform.

Important scope boundary

Build during Week 2

Next.js project foundation

Shared public website layout

Header, navigation and footer

Homepage

Service pages

Pricing page

Safety page

Become-a-Sitter page and application form

Contact and FAQ pages

Initial city page

Mobile-responsive design

Basic SEO

Staging deployment

Do not build deeply during Week 2

Customer authentication

Customer dashboard

Pet-profile database

Booking state machine

Payment integration

Sitter dashboard

Admin operations

Report-card workflow

Incident management

Those modules depend on the database and application workflows that follow. Week 2 should establish the visual, routing and content foundations they will reuse.

Corrected Week 2 plan

### Table 105

| Day | Focus | Production-ready output |
| --- | --- | --- |
| Day 8 | Next.js project setup | Repository, environments and deployed application shell |
| Day 9 | Tailwind and shadcn/ui | Design tokens and reusable component system |
| Day 10 | Homepage | Complete conversion-focused landing page |
| Day 11 | Service pages | Walking, sitting and boarding-beta pages |
| Day 12 | Pricing and safety | Transparent pricing and precise trust explanations |
| Day 13 | Become-a-Sitter page | Functional sitter recruitment and application flow |
| Day 14 | Responsive, SEO and QA | Mobile-ready staging website |

Before Day 8 — Required inputs

The developer should receive these before coding starts:

Approved logo or temporary wordmark

Brand colours

Homepage copy

Service descriptions

Starting prices

Supported city and areas

Contact number

WhatsApp number

Support email

Sitter application questions

Terms and privacy draft links

Approved photographs or properly licensed temporary images

Confirmed wording for verification and emergency support

Missing content is one of the most common reasons a “seven-day website task” becomes a three-week task. Development should not depend on repeatedly inventing business policy during implementation.

Day 8 — Set Up Next.js and TypeScript

Goal

Create a clean, deployable codebase that can later support the public website, customer dashboard, sitter dashboard and admin dashboard.

Next.js currently recommends starting new applications with create-next-app; the setup supports TypeScript, ESLint, Tailwind, the App Router and import aliases. The App Router uses file-based layouts and pages inside the app directory.

Day 8 tasks

1. Create the repository

Create:

GitHub or GitLab repository

main branch for production

develop or staging workflow if the team needs it

Pull-request review rule

Basic issue and sprint labels

Recommended project name:

petsaathi-web

2. Create the Next.js project

Recommended choices:

TypeScript: Yes

ESLint: Yes

Tailwind CSS: Yes

src directory: Yes

App Router: Yes

Import alias: @/*

Recommended package manager:

pnpm

The particular package manager is less important than using one consistently and committing its lock file.

3. Create the initial project structure

src/

├── app/

│ ├── (marketing)/

│ │ ├── page.tsx

│ │ ├── services/

│ │ ├── pricing/

│ │ ├── safety/

│ │ ├── how-it-works/

│ │ ├── become-a-sitter/

│ │ ├── contact/

│ │ ├── faq/

│ │ └── city/

│ ├── layout.tsx

│ ├── not-found.tsx

│ ├── sitemap.ts

│ └── robots.ts

├── components/

│ ├── ui/

│ ├── layout/

│ ├── marketing/

│ └── forms/

├── content/

├── lib/

│ ├── seo/

│ ├── validation/

│ └── utils/

├── styles/

└── types/

Route groups such as (marketing) help organise the application without adding that group name to the public URL.

4. Configure environment variables

Create:

.env.example

.env.local

Potential early variables:

NEXT_PUBLIC_SITE_URL=

NEXT_PUBLIC_WHATSAPP_NUMBER=

NEXT_PUBLIC_SUPPORT_EMAIL=

SITTER_APPLICATION_WEBHOOK_URL=

Do not commit secret keys.

Week 2 may not need Razorpay, Supabase or WhatsApp API credentials yet, but the environment structure should be ready for later integrations.

5. Add code-quality controls

Configure:

ESLint

Prettier

Type checking

Import ordering

Pre-commit checks, optional

Production build check

Minimum required commands:

pnpm dev

pnpm lint

pnpm typecheck

pnpm build

A task should not be considered complete when it only works under pnpm dev; the production build must also pass.

6. Connect Vercel

Connect the repository to Vercel and create:

Preview deployments for development branches

A staging URL

Production environment configuration later

Vercel can automatically build connected Git repositories and issue a separate preview URL for deployments, which is useful for design review and mobile testing before production release.

Day 8 output

Working Next.js application

TypeScript enabled

Git repository

Reusable project structure

Staging deployment

Environment-variable template

Passing lint and production build

Day 8 acceptance criteria

The application loads from a public staging URL.

/, /services, /pricing and /safety routes can be created without restructuring the repository.

Pull requests generate preview deployments.

No secrets are stored in the repository.

pnpm build completes successfully.

Day 9 — Tailwind CSS and shadcn/ui Setup

Goal

Create a reusable design system before individual pages are developed.

The current shadcn/ui setup supports Next.js and configures project dependencies, CSS variables and utilities through its CLI. Tailwind provides the utility framework used by shadcn components.

Day 9 tasks

1. Initialise shadcn/ui

Add only the components needed immediately:

Button

Card

Accordion

Input

Textarea

Select

Checkbox

Dialog

Sheet

Badge

Alert

Form

Navigation menu

Separator

Do not install the entire component catalogue.

2. Define brand tokens

Create semantic design variables rather than adding arbitrary colours inside every page.

Suggested palette

### Table 106

| Token | Intended use |
| --- | --- |
| Cream | Main page background |
| Soft blue | Trust and informational sections |
| Warm orange | Primary CTA |
| Pet-friendly green | Positive success state |
| Deep neutral | Main text |
| Muted neutral | Supporting text |
| Red | Safety alerts and errors only |

Do not use the same green for normal branding and critical success states without sufficient distinction.

3. Define typography

Use one primary font family with a limited scale.

Suggested hierarchy:

### Table 107

| Style | Purpose |
| --- | --- |
| Display | Homepage hero |
| H1 | Page title |
| H2 | Main section |
| H3 | Card or subsection |
| Body large | Supporting hero copy |
| Body | General text |
| Small | Labels and supplementary information |

Use a rounded modern font carefully. Excessively playful typography may reduce perceived professionalism for safety, payment and emergency information.

4. Build core reusable components

Create:

SiteHeader

MobileNavigation

SiteFooter

PageContainer

SectionHeading

PrimaryCTA

SecondaryCTA

ServiceCard

TrustCard

PricingCard

TestimonialCard

FAQAccordion

CityAvailabilityBadge

FormField

EmptyState

Every marketing page should reuse these components rather than independently implementing new buttons, spacing and card layouts.

5. Define component states

Every interactive component needs:

Default state

Hover state

Keyboard-focus state

Disabled state

Loading state

Error state

Success state

WCAG 2.2 guidance requires interfaces to remain understandable and operable for keyboard and touch users; sufficiently sized and spaced interaction targets reduce accidental activation.

Day 9 output

Brand variables

Typography system

Button variants

Form styles

Card styles

Header and footer

Mobile-navigation pattern

Reusable section components

Day 9 acceptance criteria

No page-specific random colour values.

Buttons have consistent sizes and states.

Focus indicators remain visible.

Components work in narrow mobile layouts.

Error and success styles are clearly distinguishable.

Header and footer render correctly on all public routes.

Day 10 — Build the Homepage

Goal

Create the primary conversion page for pet parents while still supporting sitter and society acquisition.

The homepage should not stop at “hero + CTA.” It should contain the full conversion story.

Recommended homepage structure

Header

↓

Hero

↓

Customer problem

↓

Services

↓

Trust system

↓

How PetSaathi works

↓

Pricing preview

↓

Sample Pet Report Card

↓

Testimonials

↓

Become-a-Sitter CTA

↓

Society partnership CTA

↓

FAQ preview

↓

Final CTA

↓

Footer

1. Header

Include:

Logo

Services

How It Works

Safety

Pricing

Become a Sitter

Contact

Book Pet Care CTA

On mobile, use:

Logo

Book Pet Care button

Menu button

2. Hero

Recommended headline

Trusted pet care, right near your home.

Supporting text

Request service-approved local dog walkers and pet sitters, receive structured updates and get a Pet Report Card after every completed service. Controlled boarding is available in selected areas.

Primary CTA

Book Pet Care

Secondary CTA

Become a Sitter

Location text

Currently serving selected areas in [Pilot City].

Avoid claims such as:

“100% safe”

“India’s safest”

“Fully verified”

“Guaranteed emergency care”

unless PetSaathi can demonstrate the exact meaning and fulfilment of the claim.

3. Customer problem

Use three concise problems:

Busy routine

Work, travel and family commitments can make regular pet care difficult.

Trust uncertainty

Informal referrals may not provide clear information about screening, training or service expectations.

Lack of visibility

Pet parents need confirmation that the service happened and a clear update about their pet.

4. Services

Show three cards:

Dog Walking

30- and 60-minute options

Structured start and completion updates

Pet Report Card

Home Pet Sitting

Feeding, water, play and companionship

Home-entry and exit updates

Pet Report Card

Boarding Beta

Assessed host and property

Pet compatibility review

Limited availability

Use a clear Beta label for boarding.

5. Trust section

Suggested heading:

Trust built through a process—not one badge

Explain:

Evidence-specific sitter checks

Service-specific approval

Pet-compatible matching

Structured service reporting

Emergency escalation process

6. How it works

Use five steps:

Add your pet

→ Request care

→ Review the proposed sitter

→ Pay and receive the service

→ Get the report and review

Do not imply that the customer can instantly select any sitter in the database.

7. Pricing preview

Display starting prices:

### Table 108

| Service | Starting price |
| --- | --- |
| 30-minute dog walk | ₹149 |
| 60-minute dog walk | ₹299 |
| One-hour pet sitting | ₹299 |
| Boarding beta | ₹999/night |

Add:

Final availability and price are shown before payment. Pet needs, number of pets, area and timing may affect the final amount.

8. Pet Report Card preview

This should be a visible differentiator.

Show a sample containing:

Service time

Food and water

Walk distance

Pee/poop

Mood

Photos

Sitter note

Concern status

Label it:

Sample Pet Report Card

9. Testimonials

Use only genuine pilot feedback with publication permission.

Every testimonial should identify:

Service used

First name or initials

Locality, where consented

Completed-booking status, where applicable

Do not fabricate ratings, booking counts or customer quotations.

10. Sitter and society CTAs

Sitter

Responsible with pets and reliable with people?

Apply for flexible local pet-care work. Selected applicants complete screening, training and service-specific assessment.

Society

Bring organised pet care to your apartment community.

Request a conversation about a controlled society pilot.

Homepage image handling

Use properly sized images and define their dimensions to minimise layout movement. Next.js’s Image component can serve appropriately sized formats, lazy-load non-critical images and reserve image space to reduce visual instability.

Day 10 output

Complete homepage

Responsive header and footer

Working CTA links

Real or approved temporary content

Optimised images

Mobile layout

Day 10 acceptance criteria

A new visitor understands the product within the first screen.

The primary CTA is clear.

Boarding is identified as a controlled beta.

All homepage sections work without horizontal overflow.

Every CTA opens the correct route.

No unsupported trust claims appear.

Day 11 — Build Service Pages

Goal

Explain each service clearly enough that customers understand what they are requesting.

Routes

/services

/services/dog-walking

/services/pet-sitting

/services/pet-boarding

Shared service-page structure

Every service page should include:

Service headline

Who the service is suitable for

Available duration

What is included

What is excluded

Starting price

Pet and safety requirements

Updates provided

Booking steps

Cancellation summary

FAQ

Booking CTA

Use one reusable page template with service-specific content rather than three unrelated designs.

Dog-walking page

Include

30- and 60-minute options

On-leash default

Arrival and start confirmation

Water and toilet update

Approximate distance, when recorded

End confirmation

Pet Report Card

Additional review for pulling, anxiety or bite history

CTA

Request a Dog Walk

Pet-sitting page

Include

Short visits and one-hour sessions

Feeding and water

Play and companionship

Cat-care support

Home privacy

Arrival and departure confirmation

Medication only under an approved process

Pet Report Card

CTA

Request Pet Sitting

Boarding page

Include

Controlled beta label

Limited areas

Assessed host and property

Household and resident-pet disclosure

Pet compatibility review

Vaccination/health requirements

Meet-and-greet where required

Daycare or overnight-beta distinction

Manual confirmation

CTA

Check Boarding Availability

Do not use “Instant Book.”

Day 11 output

Services index

Dog-walking page

Pet-sitting page

Boarding-beta page

Reusable service-page component

Service-specific FAQ sections

Day 11 acceptance criteria

Each service explains inclusions and exclusions.

Starting prices match the pricing page.

All service CTAs use the correct language.

Boarding cannot be confused with an open booking service.

No service page contradicts the safety page.

Day 12 — Pricing and Safety Pages

Goal

Answer the two biggest pre-booking questions:

What will the service cost?

Why should I trust the process?

Pricing page

Pricing structure

### Table 109

| Service | Duration | Starting price | Booking treatment |
| --- | --- | --- | --- |
| Dog walk | 30 min | ₹149 | Active |
| Dog walk | 60 min | ₹299 | Active |
| Home pet sitting | 60 min | ₹299 | Active |
| Boarding | Per night | ₹999 | Manual beta review |

Explain possible adjustments

Additional pet

Peak slot

Urgent request

Special handling

Extended duration

Area availability

Package discount

Add policies

Link to:

Cancellation policy

Refund policy

Payment timing

Failed-payment treatment

Boarding conditions

Use starting from only when the factors affecting the final price are clearly described.

Safety page

Recommended sections

1. Sitter approval process

Application

→ Screening

→ Interview

→ Verification checks

→ Training

→ Assessment

→ Trial

→ Service permission

→ Performance monitoring

2. Exact badge meanings

Explain:

Identity Checked

Video Interview Completed

Safety Training Passed

Dog-Walking Assessment Passed

Boarding Home Assessed

Proven Sitter

3. Pet-compatible matching

Explain that matching considers:

Service

Pet size

Behaviour

Medical needs

Sitter capability

Availability

Area and travel time

4. Service evidence

Explain:

Arrival and completion status

Structured updates

Photos where included

Pet Report Card

Booking-linked reviews

5. Emergency escalation

Use:

PetSaathi maintains an emergency escalation and incident-recording process.

Do not use:

PetSaathi guarantees emergency treatment.

6. Privacy

Explain how PetSaathi handles:

Addresses

Pet information

Sitter documents

Service photographs

Emergency contacts

Day 12 output

Complete pricing page

Complete safety page

Consistent trust wording

Links to policy placeholders or drafts

FAQ answers for payment, verification and emergencies

Day 12 acceptance criteria

No hidden mandatory price component.

“Verified” is not used without defining the underlying check.

Boarding limitations are visible.

Refund and cancellation links are easy to find.

The safety page describes actual operational controls.

Day 13 — Become-a-Sitter Page and Application Flow

Goal

Generate useful, qualified sitter applications rather than unstructured WhatsApp messages.

Page structure

Hero

Earn through responsible pet-care work in your locality

Apply for walking, home sitting or controlled boarding. Selected candidates complete screening, training and service-specific assessment.

CTA:

Start Application

Explain the role

Include:

Punctuality

Safe handling

Following pet instructions

Customer privacy

Service updates

Report cards

Honest incident reporting

Eligibility

Applicants should generally:

Meet the minimum age requirement

Live in or near an active area

Have reliable availability

Be willing to attend an interview

Be willing to complete verification and training

Accept service and safety rules

Do not imply that every applicant will be accepted.

Minimum application form

Personal details

Full name

Phone

WhatsApp number

Email

City

Locality

PIN code

Availability

Days

Morning/evening/weekend slots

Travel radius

Transport method

Experience

Pet experience

Dog/cat experience

Large-dog comfort

Anxious-pet comfort

Service interest

Dog walking

Home pet sitting

Cat care

Boarding assessment

Emergency backup consideration

Readiness

Willing to attend video interview

Willing to complete training

Willing to provide required verification evidence

Consent to be contacted

Do not request full identity documents on this public first-stage form.

Form behaviour

The form must have:

Client-side usability validation

Server-side validation

Spam protection

Duplicate-phone handling

Submission loading state

Clear success page

Clear failure state

Privacy notice

Stable application reference

Suggested success message:

Application received. Your reference is APP-1042. PetSaathi will review your locality, availability and service interests before contacting you.

The form must persist data to a CRM, database or secure interim lead system. A form that only displays “Submitted” without saving the application is not complete.

Day 13 output

Complete sitter recruitment page

Functional application form

Submission storage

Confirmation state

Recruitment tracking source

Privacy and consent notice

Day 13 acceptance criteria

A real test application appears in the tracking system.

Duplicate and invalid submissions are handled.

No sensitive identity document is publicly requested.

Applicant source is recorded.

Mobile form completion is practical.

Applying does not imply approval.

Day 14 — Responsive Polish, SEO and Quality Assurance

Goal

Turn the individual pages into one coherent and launchable public website.

1. Responsive testing

Test at minimum:

320px phone width

375px phone width

390–430px modern phone widths

Tablet portrait

Tablet landscape

Laptop

Large desktop

Check:

No horizontal scrolling

Header does not cover content

Tables remain readable

CTA buttons fit

Cards stack correctly

Forms remain usable

Footer links do not become crowded

Text does not become too small

2. Accessibility review

Test:

Keyboard navigation

Visible focus

Heading hierarchy

Form labels

Text-based validation errors

Colour contrast

Touch-target size

Alternative image text

Accordion controls

Menu open/close behaviour

Reduced-motion behaviour where applicable

WCAG 2.2 provides the current accessibility criteria and implementation reference for navigation, forms, focus, contrast and interaction.

3. Basic SEO implementation

Page metadata

Every public page should have:

Unique title

Unique description

Canonical URL

Open Graph title

Open Graph description

Social-sharing image

Next.js supports static metadata, generated metadata and special files for icons and Open Graph images.

Example:

Title:

Dog Walking in Bopal, Ahmedabad | PetSaathi

Description:

Request local dog walking in selected Bopal areas with

service-approved walkers, structured updates and a Pet Report Card.

Google recommends descriptive page titles and useful, page-specific meta descriptions that help users understand why a result is relevant.

Sitemap and robots

Create:

src/app/sitemap.ts

src/app/robots.ts

Include public marketing pages in the sitemap.

Later private routes such as /customer, /sitter and /admin should be protected and set to noindex; robots.txt alone is not a security mechanism or guaranteed de-indexing mechanism. Next.js provides special sitemap and robots files, while Google recommends noindex or authentication for content that must not appear in search.

Internal links

Use real anchor links between:

Homepage and services

Services and pricing

Safety and sitter onboarding

City pages and services

FAQ and policies

Google uses crawlable links to discover pages and understand their relationship.

City-page rule

Publish only the first genuinely supported city or micro-market.

Do not create dozens of nearly identical city pages by changing the city name. Unsupported areas should use a genuine waitlist page or remain unpublished.

4. Performance review

Check:

Hero image size

Font loading

Third-party scripts

Unused JavaScript

Layout shifts

Slow mobile navigation

Large testimonial images

Unnecessary animation

Google’s Core Web Vitals assess real-world loading, responsiveness and visual stability; Next.js also provides image, font and production optimisations that should be reviewed before release.

5. Functional QA

Test every:

Navigation link

CTA

Contact link

WhatsApp link

Email link

Form

Validation message

Success state

Error state

Accordion

Pricing link

Policy link

Also test:

404 page

Invalid sitter-form data

Network failure during form submission

Double-click submission

Missing image

Long testimonial text

Long city/locality name

6. Staging review

Use the Vercel preview deployment to review the actual website on real mobile devices rather than relying only on browser resizing. Preview deployments provide a shareable environment for product, content and design approval before production.

Day 14 output

Mobile-responsive public website

SEO metadata

Sitemap

Robots configuration

Open Graph image

Functional sitter application

QA report

Staging deployment approved for the next sprint

Recommended public routes at the end of Week 2

/

/services

/services/dog-walking

/services/pet-sitting

/services/pet-boarding

/pricing

/safety

/how-it-works

/become-a-sitter

/contact

/faq

/city/[launch-city]

/privacy

/terms

/cancellation-refund-policy

Policy pages may contain reviewed drafts, but broken or empty legal links should not be placed in the production footer.

Week 2 Definition of Done

Technical foundation

Next.js App Router project works.

TypeScript checks pass.

Lint passes.

Production build passes.

Repository is connected to Vercel.

Preview deployment works.

Environment variables are documented.

UI system

Brand tokens are defined.

Header and footer are reusable.

Buttons, cards, forms and alerts are consistent.

Loading, error and disabled states exist.

Keyboard focus is visible.

Content

Homepage contains the complete conversion sequence.

Dog-walking page is complete.

Pet-sitting page is complete.

Boarding is clearly marked beta.

Pricing is transparent.

Safety claims are precise.

Contact information is accurate.

Lead generation

Customer CTA has a real destination.

Sitter application submits successfully.

Application data is stored.

Society enquiry route or contact option works.

WhatsApp and email links work.

Responsive quality

No horizontal overflow.

Mobile navigation works.

Forms work on phones.

Buttons are easily usable.

Images resize correctly.

Content remains readable at narrow widths.

SEO

Every public page has a unique title and description.

Sitemap is generated.

Robots configuration exists.

Open Graph metadata works.

Internal links are crawlable.

Only genuine city pages are indexable.

Quality

No broken public links.

No unsupported safety claims.

No fake testimonials.

No sensitive information is requested unnecessarily.

No major console errors.

Staging review is complete.

Corrected Week 2 deliverables

### Table 110

| Deliverable | Required output |
| --- | --- |
| Public website | Complete responsive marketing shell |
| Homepage | Full conversion page, not only hero |
| Service pages | Walking, sitting and boarding beta |
| Pricing page | Transparent starting prices and conditions |
| Safety page | Evidence-specific trust process |
| Sitter application | Functional form connected to tracking |
| Contact and FAQ | Working support and objection handling |
| Basic SEO | Metadata, sitemap, robots and internal links |
| Mobile responsiveness | Tested on real phone sizes |
| Staging deployment | Shareable, production-style preview |
| QA checklist | Defects recorded and resolved |

Common Week 2 mistakes

Mistake 1 — Spending the entire week on visual polish

The primary objective is a usable website with accurate content and working conversion paths. Elaborate animation should not delay sitter applications or customer CTAs.

Mistake 2 — Building each page independently

Without shared components, every page develops different spacing, buttons and cards. Create the design system first.

Mistake 3 — Publishing vague trust claims

“Verified,” “safe” and “emergency supported” must explain the exact process behind them.

Mistake 4 — Creating a fake application form

The sitter application must save data and show a traceable success result.

Mistake 5 — Treating desktop as the main design

Most early traffic from Instagram, WhatsApp and local referrals is likely to open the link on a phone. Mobile behaviour should be tested throughout the week, not only on Day 14.

Mistake 6 — Generating many thin city pages

Launch with one accurate city page. Expand only when PetSaathi has real local service information.

Mistake 7 — Starting customer dashboards too early

Week 2 should finish the public foundation. Mixing marketing, authentication and booking logic during the same seven days increases unfinished work across every module.

Final Week 2 success condition

Week 2 is successful when PetSaathi can say:

“Our public website is live on staging, works properly on mobile, clearly explains our services and trust process, displays transparent pricing, captures sitter applications, directs customers toward booking and provides a technically clean foundation for customer, sitter and admin development.”

Simple explanation for professor

“During Week 2, I will create the technical foundation and public website for PetSaathi. On Day 8, I will set up the Next.js and TypeScript codebase, repository and staging deployment. On Day 9, I will create the reusable UI system using Tailwind CSS and shadcn components. On Day 10, I will build the full homepage with services, trust, pricing, report-card preview and conversion buttons. On Day 11, I will create the dog-walking, pet-sitting and controlled-boarding pages. On Day 12, I will build the pricing and safety pages. On Day 13, I will create a functional sitter recruitment and application flow. On Day 14, I will test mobile responsiveness, accessibility, SEO, forms, links and performance. The Week 2 result will be a complete public website on a staging URL, ready to connect with the customer, sitter and admin modules in the following development weeks.”

PetSaathi Phase 4 — Week 3

Authentication and Customer Module, End to End 🐾🔐

Executive decision

Week 3 should not be treated as merely building login, signup and a pet form.

It establishes the identity, ownership and data-access foundation for every later PetSaathi module:

Customer account → Customer profile → Pet profile → Booking → Payment → Report → Review

The correct Week 3 principle is:

The authentication system proves who the customer is, authorization determines which records they may access, and every pet must remain securely linked to its owner.

Next.js distinguishes authentication, session management and authorization as separate concerns and recommends using an established authentication library instead of building the complete security system manually.

1. Week 3 final scope

Goal

Allow pet parents to:

Create a secure PetSaathi account

Log in and log out

Recover access to their account

View a customer dashboard

Create multiple pet profiles

Save incomplete pet profiles as drafts

View, edit and archive their pets

Update their customer information

Receive understandable validation and error messages

Access only their own account and pet records

Week 3 production flow

Visitor

↓

Create account

↓

Server validates information

↓

Password securely hashed

↓

Customer account created

↓

Authenticated session created

↓

Customer onboarding

↓

Customer dashboard

↓

Create pet profile

↓

Save draft or submit completed profile

↓

View, edit or archive pet

↓

Ready for booking module

2. Recommended authentication model

MVP authentication methods

P0 — Build during Week 3

Email and password signup

Email and password login

Logout

Session management

Forgot-password flow

Reset-password flow

Protected customer routes

Customer-role authorization

P1 — Add after the basic MVP is stable

Email verification

Mobile OTP login

Google login

Multi-factor authentication

Login-device management

Suspicious-login notifications

For an academic MVP, email and password authentication is sufficient. The customer’s mobile number should still be collected as a contact field, but it should not be considered verified unless OTP verification is implemented.

Authentication library

Use an established authentication library compatible with the Next.js App Router instead of manually creating session encryption, cookie handling and provider logic.

Auth.js provides Next.js route handlers, session helpers, sign-in and sign-out methods. Its current installation documentation uses next-auth@beta, so the project should pin the exact tested package version rather than accepting uncontrolled upgrades.

Recommended project decision:

Framework: Next.js App Router

Language: TypeScript

Authentication: Auth.js or an equivalent established provider

Database: PostgreSQL

ORM: Prisma

Validation: Zod

Testing: Playwright

3. Authentication architecture

Authentication consists of three separate layers.

Layer 1 — Authentication

Answers:

Who is this person?

Examples:

Correct email and password

Valid password-reset token

Valid authenticated session

Layer 2 — Session management

Answers:

Is this customer still logged in?

The session should contain only essential information:

{

userId: "uuid",

role: "CUSTOMER",

sessionVersion: 1

}

Do not store complete customer profiles, addresses, pet details or medical information inside the session token.

Layer 3 — Authorization

Answers:

Is this logged-in customer allowed to perform this action?

Example:

Authenticated customer: C-001

Requested pet: PET-145

Pet owner: C-001

Result: Allowed

Authenticated customer: C-001

Requested pet: PET-238

Pet owner: C-009

Result: Forbidden

Being logged in does not mean a user may access every record. OWASP recommends denying access by default, applying least privilege and checking ownership for every protected resource.

4. Customer account statuses

Use a controlled status instead of a simple is_active Boolean.

PENDING_VERIFICATION

ACTIVE

SUSPENDED

DEACTIVATED

DELETION_REQUESTED

ANONYMIZED

Meaning

### Table 111

| Status | Meaning |
| --- | --- |
| PENDING_VERIFICATION | Account created but email or phone verification is incomplete |
| ACTIVE | Customer may normally use PetSaathi |
| SUSPENDED | Access temporarily restricted by an authorised administrator |
| DEACTIVATED | Customer voluntarily deactivated the account |
| DELETION_REQUESTED | Data-deletion request is being processed |
| ANONYMIZED | Personal data removed where retention is no longer required |

For the basic Week 3 implementation, new users may become ACTIVE immediately if email verification has not yet been implemented. The schema should still support future verification.

5. Signup flow

Customer-facing fields

Full name

Email address

Mobile number

Password

Confirm password

City

Area

Accept Terms of Service

Accept Privacy Notice

Marketing consent must be separate and optional.

Do not combine:

I accept the Terms and agree to receive promotional messages.

Use separate choices:

Required:

I accept the Terms of Service and Privacy Notice.

Optional:

I would like to receive PetSaathi offers and updates.

Backend signup process

Receive signup form

↓

Normalise email and mobile number

↓

Validate fields on server

↓

Check email uniqueness

↓

Check mobile uniqueness, if required by policy

↓

Hash password

↓

Create user and customer profile in one transaction

↓

Create authenticated session

↓

Record acceptance versions

↓

Redirect to customer onboarding

Next.js supports Server Actions for secure server-side form processing and recommends validating submitted data on the server.

Duplicate account response

Do not return unnecessary technical details.

Good customer response:

An account already exists with this email address. Please log in or reset your password.

For higher-security environments, a more generic response may be used to reduce account enumeration.

6. Password security

Never store:

Plain-text passwords

Reversible encrypted passwords

Passwords in application logs

Passwords in analytics

Passwords in URLs

Passwords in error-monitoring payloads

Use a strong adaptive hashing algorithm such as Argon2id. OWASP recommends Argon2id as the preferred password-hashing approach and explicitly warns against plain-text storage or fast general-purpose hashes such as SHA-256 for password storage.

Recommended project password policy

Minimum 10–12 characters

Maximum at least 128 characters

Allow spaces and passphrases

Allow Unicode characters

Reject known compromised or extremely common passwords where practical

Do not silently trim passwords

Do not force unnecessary monthly password changes

Rate-limit login and reset attempts

Password database field

password_hash

Never use:

password

password_plain_text

encrypted_password

7. Login flow

Customer enters email and password

↓

Server normalises email

↓

Server finds authentication record

↓

Password hash is verified

↓

Account status is checked

↓

Session is created

↓

Customer redirected to dashboard

Login outcomes

Successful

Welcome back to PetSaathi.

Incorrect credentials

The email or password is incorrect.

Do not reveal whether the email exists unless that disclosure is an intentional product decision.

Suspended account

This account is temporarily unavailable. Please contact PetSaathi support.

Too many attempts

Too many unsuccessful login attempts. Please try again later or reset your password.

OWASP recommends protecting authentication systems against brute-force and automated attacks through controls such as throttling and monitoring.

8. Session and protected-route flow

Public pages

/

/services

/pricing

/login

/signup

/forgot-password

/reset-password

Protected customer pages

/customer/dashboard

/customer/pets

/customer/pets/new

/customer/pets/[petId]

/customer/pets/[petId]/edit

/customer/profile

/customer/settings

Route-protection logic

Request protected page

↓

Read authenticated session

↓

No session?

└── Redirect to /login

↓

Check role

↓

Role is not CUSTOMER?

└── Return forbidden response

↓

Load customer-owned data

Route-level protection improves user experience, but ownership checks must also be performed inside every server action, query and API handler.

Next.js warns that exported Server Actions remain reachable through direct POST requests. Therefore, authorization must be checked inside the action itself rather than assuming that hiding a button protects the operation.

9. Recommended customer database design

Do not place authentication, profile, consent and address information in one oversized table.

users

id

public_code

email

phone

role

status

email_verified_at

phone_verified_at

created_at

updated_at

last_login_at

session_version

user_credentials

id

user_id

password_hash

password_changed_at

failed_login_count

locked_until

created_at

updated_at

This table is required only when PetSaathi manages passwords directly.

customer_profiles

id

user_id

full_name

profile_photo_reference

city

area

pincode

preferred_language

timezone

created_at

updated_at

customer_consents

id

customer_id

consent_type

policy_version

accepted

recorded_at

source

Possible consent types:

TERMS_OF_SERVICE

PRIVACY_NOTICE

MARKETING_EMAIL

MARKETING_WHATSAPP

PET_MEDIA_MARKETING

password_reset_tokens

id

user_id

token_hash

expires_at

used_at

created_at

Store a token hash, not the raw reset token.

10. Customer dashboard

Dashboard purpose

The dashboard should tell the customer:

What information is incomplete

Which pets have been created

What action should be taken next

Whether the account is ready to request a booking

Recommended dashboard sections

Welcome card

Welcome, Prit 👋

Complete Bruno’s profile to request your first pet-care service.

Profile-completion card

Customer profile: 80% complete

Missing: Emergency contact

Pet cards

Bruno

Labrador · Male · 3 years

Profile: Incomplete

Next action: Add vaccination information

Quick actions

Add a pet

Complete pet profile

Update account

Request a service — disabled until booking module is ready

Contact support

Empty state

When no pet exists:

Add your first pet to begin preparing for dog walking, pet sitting or boarding.

Primary CTA:

Add a Pet

11. Pet Profile creation flow

The pet form should be a multi-step wizard rather than one very long page.

Step 1 — Basic identity

Step 2 — Behaviour and handling

Step 3 — Health and medication

Step 4 — Vaccination records

Step 5 — Food and daily routine

Step 6 — Vet and emergency contacts

Step 7 — Photo and declaration

Step 8 — Review and submit

Draft behaviour

When the customer selects Add a Pet:

Create draft pet record

↓

Generate pet code

↓

Status = DRAFT

↓

Customer completes steps

↓

Autosave or manual Save and Continue

Example public code:

PET-000145

The customer should be able to leave and return without losing completed information.

12. Pet profile statuses

Use:

DRAFT

INCOMPLETE

SUBMITTED

MORE_INFORMATION_REQUIRED

ADMIN_REVIEW_REQUIRED

ACTIVE

REASSESSMENT_REQUIRED

ARCHIVED

During Week 3, the primary implemented states are:

DRAFT

INCOMPLETE

SUBMITTED

ARCHIVED

Later admin and risk workflows will use the remaining states.

Rules

DRAFT: Customer has started the form.

INCOMPLETE: Required fields are missing.

SUBMITTED: Mandatory profile information has been supplied.

ARCHIVED: Pet is inactive, deceased or no longer using the platform.

Archived pets remain connected to historical bookings and reports.

Do not hard-delete a pet once operational history exists.

13. Pet profile CRUD

CRUD means:

Create a pet

Read pet information

Update pet information

Delete or archive the pet

Prisma provides typed CRUD queries and supports relational operations and transactional writes.

Create

Customer creates a new pet.

Required starting fields:

Pet name

Species

Everything else may initially be saved as a draft.

Read

Customer can view:

Pet summary

Care routine

Behaviour information

Health information

Vaccinations

Vet contacts

Profile status

Last-updated dates

Update

Customer can edit only their own pet.

Safety-critical changes should eventually trigger reassessment:

New bite history

New medication

New medical condition

Material weight change

New escape history

New aggression information

Delete

Recommended customer-facing action:

Archive Pet

Not:

Permanently Delete Pet

Permanent deletion should be handled only through an authorised privacy or retention workflow.

14. Ownership enforcement

Never trust a customerId sent by the browser.

Bad:

const pet = await prisma.pet.findUnique({

where: { id: input.petId }

})

Better:

const pet = await prisma.pet.findFirst({

where: {

id: input.petId,

customerId: session.user.id

}

})

The same ownership condition must apply to:

View pet

Edit pet

Archive pet

Upload pet photograph

Add vaccination record

Add vet contact

Submit pet profile

This prevents horizontal privilege escalation, where one customer changes an ID in the URL to access another customer’s information.

15. Recommended pet database structure

Do not use one overloaded pets table for every form field.

pets

id

public_code

customer_id

name

species

breed

birth_date

age_is_estimated

estimated_age_months

sex

neutered_status

weight_kg

weight_measured_at

profile_photo_reference

profile_status

created_at

updated_at

archived_at

version

pet_behavior_profiles

id

pet_id

stranger_response

bite_history_reported

pulling_severity

escape_history

separation_anxiety

resource_guarding

other_pet_compatibility

handling_notes

customer_notes

updated_at

pet_medical_profiles

id

pet_id

known_conditions

allergies

mobility_limitations

seizure_history

emergency_history

medical_notes

information_updated_at

pet_medications

id

pet_id

name

reported_purpose

dose

method

scheduled_time

start_date

end_date

prescribing_vet

customer_instructions

pet_vaccination_records

id

pet_id

vaccine_name

administered_date

next_due_date

clinic_name

evidence_reference

verification_status

notes

pet_care_instructions

id

pet_id

food_type

portion

feeding_times

approved_treats

prohibited_food

water_instructions

walking_routine

toilet_routine

play_preferences

sleeping_arrangement

home_instructions

pet_contacts

id

pet_id

contact_type

name

relationship

phone

address

priority

can_authorise_care

can_authorise_spending

spending_limit

last_confirmed_at

Contact types:

REGULAR_VET

EMERGENCY_CLINIC

OWNER_EMERGENCY_CONTACT

16. Customer profile management

Customer profile fields:

Full name

Email

Mobile number

Profile photograph

City

Area

Pincode

Preferred language

Notification preferences

Marketing preferences

Sensitive changes

Changing email

Require:

Current authenticated session

Password re-verification where applicable

Verification of the new email

Audit record

Changing mobile number

Require:

Current session

OTP verification when OTP is supported

Audit record

Changing password

Require:

Current password or valid reset token

New password validation

Session revocation or session-version update

Account deactivation

Do not immediately delete all records.

Use:

DEACTIVATED

Then apply the approved retention and deletion workflow.

PetSaathi will process personal data such as names, mobile numbers, addresses and account information. Privacy notices, data minimisation and controlled retention should therefore be designed into the account flow rather than added later. India’s Digital Personal Data Protection Rules, 2025 were officially published with staged commencement dates.

17. Validation strategy

Validation must happen at two levels

Client-side validation

Provides immediate feedback:

Required fields

Email format

Number ranges

Date controls

Character limits

File type and size

Server-side validation

Provides actual security and data integrity:

Authentication

Ownership

Unique email

Allowed enum values

Valid dates

Positive weight

File validation

Database state

Account status

The frontend improves usability, but the server remains the source of truth.

Zod provides schema-based validation for TypeScript data, while Next.js documentation specifically demonstrates server-side form validation using Zod.

Important pet validation rules

Basic identity

Pet name cannot be empty.

Birth date cannot be in the future.

Estimated age must be positive.

Weight must be positive.

Species must come from a supported list.

Unknown breed must be permitted.

age_is_estimated must be recorded when exact birth date is unavailable.

Behaviour

Reported bite history requires incident context.

Strong pulling requires weight and equipment information.

Escape history requires handling instructions.

Resource guarding requires context.

UNKNOWN must be accepted as a valid response.

Medical

Medication requires name, dose, method and timing.

Allergy information must not be hidden inside a general note.

Medical information should display its last-updated date.

Current severe symptoms must later block ordinary booking progression.

Vaccination

One vaccination is one database record.

Vaccination must not be represented only as true or false.

Uploaded evidence must have approved file type and size.

18. Error-handling design

Field-level error

Weight must be greater than 0 kg.

Form-level error

We could not save Bruno’s profile. Review the highlighted information and try again.

Authentication error

Your session has expired. Please log in again.

Permission error

You do not have permission to access this pet profile.

Database or server error

Something went wrong while saving the profile. Your existing information has not been changed.

Do not expose:

Stack traces

SQL errors

Database table names

Internal user IDs

Authentication secrets

Storage paths

Next.js recommends handling expected errors, such as validation failures, as explicit application results rather than uncaught crashes.

19. Recommended API and action structure

Avoid a generic endpoint that allows arbitrary account or pet changes.

Authentication

POST /api/auth/register

POST /api/auth/login

POST /api/auth/logout

POST /api/auth/forgot-password

POST /api/auth/reset-password

GET /api/auth/session

Auth.js may manage some of these routes internally.

Customer

GET /api/customer/profile

PATCH /api/customer/profile

POST /api/customer/change-password

POST /api/customer/deactivate

Pets

POST /api/pets

GET /api/pets

GET /api/pets/:petId

PATCH /api/pets/:petId

POST /api/pets/:petId/submit

POST /api/pets/:petId/archive

Pet child records

POST /api/pets/:petId/vaccinations

PATCH /api/pets/:petId/vaccinations/:recordId

DELETE /api/pets/:petId/vaccinations/:recordId

POST /api/pets/:petId/medications

PATCH /api/pets/:petId/medications/:medicationId

DELETE /api/pets/:petId/medications/:medicationId

Every endpoint must independently verify:

Valid session

Correct role

Customer ownership

Valid input

Allowed operation

Current resource state

20. Recommended page structure

app/

├── (public)/

│ ├── page.tsx

│ └── services/

│

├── (auth)/

│ ├── login/page.tsx

│ ├── signup/page.tsx

│ ├── forgot-password/page.tsx

│ └── reset-password/page.tsx

│

├── customer/

│ ├── layout.tsx

│ ├── dashboard/page.tsx

│ ├── profile/page.tsx

│ ├── settings/page.tsx

│ └── pets/

│ ├── page.tsx

│ ├── new/page.tsx

│ └── [petId]/

│ ├── page.tsx

│ └── edit/page.tsx

│

├── api/

│ ├── auth/

│ ├── customer/

│ └── pets/

│

├── actions/

│ ├── auth-actions.ts

│ ├── customer-actions.ts

│ └── pet-actions.ts

│

└── lib/

├── auth/

├── db/

├── validation/

├── permissions/

└── services/

21. Day-by-day execution plan

Day 15 — Authentication setup

Work

Install and configure authentication library

Configure environment secrets

Create user, credential and session-related schema

Build signup page

Build login page

Implement logout

Add protected customer layout

Add role checks

Seed test customer

Add login rate limiting

Output

Working signup

Working login

Working logout

Protected customer routes

Persistent authenticated session

Acceptance criteria

Duplicate email cannot create two accounts.

Password is never stored in plain text.

Logged-out users cannot access customer pages.

Customers cannot access sitter or admin pages.

Invalid credentials return safe errors.

Session survives normal page navigation.

Day 16 — Customer dashboard

Work

Create authenticated dashboard layout

Add navigation

Add customer summary

Add profile-completion state

Add pet-summary cards

Add empty states

Add loading and error states

Make dashboard mobile-responsive

Output

Base customer dashboard

Customer navigation

Profile-completion card

Pet overview

Quick actions

Acceptance criteria

Dashboard uses only authenticated customer data.

No pet produces a useful empty state.

Incomplete profile shows a clear next action.

Dashboard works on mobile widths.

Refreshing the page preserves the session.

Day 17 — Pet profile form

Work

Create draft pet record

Build multi-step pet wizard

Add basic details

Add behaviour section

Add medical section

Add vaccination records

Add food and care instructions

Add vet and emergency contacts

Add pet photograph

Add save-and-continue

Add final declaration

Output

Create-pet flow

Draft saving

Structured pet form

Pet-profile submission

Acceptance criteria

Customer can save an incomplete draft.

Refreshing does not lose saved information.

Required fields are clearly marked.

Birth date cannot be in the future.

Weight validation works.

Multiple vaccinations can be recorded.

Bite history requires additional details.

Customer cannot assign a risk classification.

Day 18 — Pet list and detail pages

Work

Build pet list page

Build pet card component

Build pet detail view

Build edit flow

Build archive flow

Add ownership checks

Add optimistic-concurrency version

Add last-updated timestamps

Output

Pet list

Pet details

Edit pet

Archive pet

Multiple-pet management

Acceptance criteria

Customer can create multiple pets.

Customer sees only their pets.

Editing another customer’s pet is rejected.

Archived pets are separated from active pets.

Existing historical records are not hard-deleted.

Conflicting edits do not silently overwrite newer information.

Day 19 — Customer profile

Work

Build profile-information form

Add contact details

Add city, area and pincode

Add notification preferences

Add marketing preferences

Add password-change flow

Prepare email/mobile verification states

Add account-deactivation option

Record privacy and terms versions

Output

Customer profile management

Contact preferences

Password change

Account settings

Consent records

Acceptance criteria

Customer can update ordinary profile information.

Email and phone changes use protected workflows.

Password change verifies the current user.

Marketing consent remains optional.

Required service consent is versioned.

Sensitive values are excluded from logs.

Day 20 — Validation and UX errors

Work

Centralise Zod schemas

Add client-side feedback

Add server-side validation

Add duplicate-submission protection

Add loading states

Add disabled states

Add accessible labels

Add success notifications

Add expected-error handling

Add file upload validation

Review mobile form usability

Output

Consistent validation

Friendly error messages

Accessible forms

Reliable loading states

Clean mobile UX

Acceptance criteria

Every form displays field-specific errors.

Invalid browser requests are rejected server-side.

Double-clicking submit does not create duplicate pets.

Form controls have accessible labels.

Keyboard navigation works.

Errors do not erase valid form values.

Technical errors are not exposed to customers.

Day 21 — Testing and customer flow completion

Work

Unit-test schemas and business rules

Integration-test authentication and database operations

End-to-end test the customer journey

Test ownership isolation

Test desktop and mobile layouts

Test error states

Test session expiry

Test archive flow

Fix critical defects

Prepare demonstration data

Output

Tested signup and login

Tested customer dashboard

Tested pet CRUD

Tested profile management

Customer flow ready for Week 4

Playwright supports reusable authenticated browser state and isolated browser contexts, which makes it suitable for testing both authenticated customer flows and cross-user access isolation.

22. Required Week 3 test cases

Authentication tests

Valid signup

Duplicate email signup

Invalid email

Weak or invalid password

Correct login

Incorrect password

Unknown email

Suspended account

Logout

Expired session

Rate-limited login

Password reset token expired

Password reset token reused

Authorization tests

Customer opens own profile

Customer attempts to open another customer’s profile

Customer opens own pet

Customer changes URL to another pet ID

Logged-out visitor calls pet API

Customer attempts admin endpoint

Customer attempts sitter endpoint

Pet-profile tests

Create draft pet

Create multiple pets

Missing pet name

Unknown breed

Estimated age

Future birth date

Negative weight

Bite history without details

Multiple vaccination records

Medication without dosage

Edit pet

Archive pet

Edit archived pet

Simultaneous conflicting update

UX tests

Mobile signup

Mobile multi-step form

Keyboard-only form completion

Screen-reader labels

Slow network

Server error

Refresh during pet creation

Double-submit prevention

23. What should not be built in Week 3

Avoid expanding the sprint into unrelated modules.

Do not build yet:

Booking workflow

Sitter matching

Razorpay payments

Admin risk approval

AI risk classification

Full GPS tracking

Customer-sitter chat

Sitter payouts

Review and report-card modules

Native mobile application

Complex social-login combinations

However, the Week 3 database and APIs must be structured so these modules can be added without redesigning customer identity or pet ownership.

24. Week 3 deliverables

Functional deliverables

Customer signup

Customer login

Logout

Session management

Forgot/reset password

Protected customer routes

Customer dashboard

Customer profile management

Pet-profile creation

Pet-profile listing

Pet-profile details

Pet-profile editing

Pet-profile archiving

Multiple-pet support

Validation and error handling

Technical deliverables

Authentication configuration

Database migrations

Prisma models

Zod schemas

Ownership authorization helpers

Server actions or API handlers

Protected layouts

Test data

Unit tests

Integration tests

Playwright end-to-end tests

Environment-variable documentation

Documentation deliverables

Authentication flow diagram

Customer user-flow diagram

Pet-profile data dictionary

API list

Validation-rule list

Access-control matrix

Test-case report

Known limitations

25. Definition of Done

Week 3 is complete only when all the following are true.

Authentication

Passwords are securely hashed.

Login and logout work.

Sessions are protected.

Account status is enforced.

Customer routes reject unauthenticated access.

Login abuse has basic throttling.

Password-reset tokens expire and cannot be reused.

Authorization

Customers can access only their own records.

Ownership checks happen on the server.

Customer IDs are not trusted from request bodies.

Admin and sitter routes remain inaccessible.

Forbidden access is tested.

Customer profile

Customer details can be viewed and updated.

Marketing consent is optional.

Policy acceptance is versioned.

Sensitive changes use stronger verification.

Account deactivation is supported.

Pet profile

Multiple pets are supported.

Drafts can be saved.

Pet data is structurally stored.

Vaccination is not a Boolean field.

Behaviour and bite history contain context.

Medical and medication details are structured.

Pet photographs remain private.

Customers cannot assign final risk.

Pets can be archived without destroying history.

Quality

Server-side validation exists for every mutation.

Errors are readable and non-technical.

Mobile layout is usable.

Loading and empty states are complete.

Critical paths have automated tests.

The complete customer journey works without manual database editing.

Final recommended Week 3 operating principle

Build authentication as the security boundary and the customer module as the ownership boundary. Every account, pet, photograph, vaccination record and medical instruction must be linked to the authenticated customer and checked on the server. The customer may create and update accurate pet information, but risk classification and operational approval remain controlled by PetSaathi administrators.

Simple explanation for professor

“During Week 3, I will develop the Authentication and Customer Module. First, pet owners will be able to create an account, log in securely and access a protected customer dashboard. The authentication system will identify the user, maintain the login session and ensure that each customer can view only their own information.

After login, the customer can create one or more structured pet profiles. The pet profile will include basic identity, behaviour, medical information, vaccination records, food instructions, veterinarian details and emergency contacts. The customer can save an incomplete profile as a draft, update it later and archive a pet when it is no longer active.

All form information will be validated on both the frontend and backend. Passwords will be securely hashed, sensitive data will not be exposed in logs and every pet operation will include an ownership check. At the end of Week 3, the complete customer flow—from signup and login to pet-profile creation and profile management—will be ready for the booking and payment module in Week 4.”

PetSaathi Phase 4 — Week 4

Booking and Payment Module, End to End 🐾💳

Executive decision

Week 4 builds the first commercial transaction flow in PetSaathi:

Customer selects pet and service → system calculates price → booking request is created → PetSaathi approves payment eligibility → Razorpay payment is completed → backend verifies the payment → booking becomes confirmed

The booking and payment modules must remain separate.

A booking describes the requested pet-care service. A payment describes the financial transaction connected to that booking. Combining both into one status field creates contradictions when payments fail, bookings are cancelled or refunds occur.

The correct Week 4 principle is:

The server calculates the price, creates the Razorpay order, verifies the payment and controls booking confirmation. The browser must never be trusted to confirm payment or change the final amount.

Razorpay requires payment signatures to be verified on the server before an order is fulfilled. It also treats captured payment as the reliable point at which the associated order becomes paid.

1. Week 4 final scope

Goal

Allow authenticated pet parents to:

Select one or more pets

Select a pet-care service

Choose a date, start time and duration

Select or enter a service address

Add booking-specific instructions

Receive a server-calculated estimated price

Submit a booking request

View booking status

Start a Razorpay payment

Complete payment through Razorpay Checkout

Receive verified payment confirmation

View payment and booking results

Retry a failed payment safely

Production flow

Authenticated customer

↓

Select pet

↓

Select service

↓

Select date, time and duration

↓

Select service address

↓

Add temporary instructions

↓

Server validates eligibility

↓

Server calculates price

↓

Customer reviews estimate

↓

Booking request created

↓

Admin/rules approve payment eligibility

↓

Razorpay order created

↓

Customer completes checkout

↓

Backend verifies signature

↓

Webhook/API confirms captured payment

↓

Booking becomes CONFIRMED

2. Important Week 4 dependency

The Week 4 module depends on Week 3 data:

Authenticated customer

Active customer account

Customer-owned pet

Sufficient pet-profile information

Service-specific eligibility information

Valid customer address

Current contact information

A customer must not be able to create a booking for another customer’s pet by changing a URL or request payload.

Every booking request must verify:

Authenticated customer ID

=

Selected pet’s customer ID

3. Week 4 scope versus later modules

The complete production lifecycle is:

REQUESTED

PENDING_ADMIN_REVIEW

SITTER_MATCHING

SITTER_ASSIGNED

PAYMENT_PENDING

CONFIRMED

SERVICE_STARTED

SERVICE_COMPLETED

REPORT_SUBMITTED

CLOSED

However, Week 4 focuses mainly on:

REQUESTED

PENDING_ADMIN_REVIEW

PAYMENT_PENDING

CONFIRMED

CANCELLED

DECLINED

The sitter-matching module may be implemented later. During Week 4 testing, either:

Use a seeded test sitter;

Allow an admin to approve the booking for payment; or

Use a temporary internal PAYMENT_READY action that is replaced by sitter assignment later.

Do not let customers pay for a request that PetSaathi cannot fulfil.

4. Correct booking and payment separation

Booking status

REQUESTED

PENDING_ADMIN_REVIEW

SITTER_MATCHING

SITTER_ASSIGNED

PAYMENT_PENDING

CONFIRMED

SERVICE_STARTED

SERVICE_COMPLETED

REPORT_SUBMITTED

CLOSED

DECLINED

CANCELLED

REPLACEMENT_REQUIRED

NO_SHOW

INCIDENT_HOLD

Payment status

CREATED

PENDING

AUTHORIZED

CAPTURED

FAILED

EXPIRED

CANCELLED

REFUNDED

PARTIALLY_REFUNDED

Refund status

NOT_REQUESTED

REQUESTED

APPROVED

PROCESSING

PROCESSED

PARTIALLY_PROCESSED

FAILED

REJECTED

Example combinations

Booking: PAYMENT_PENDING

Payment: CREATED

Booking: CONFIRMED

Payment: CAPTURED

Booking: CANCELLED

Payment: CAPTURED

Refund: PROCESSING

Booking: CLOSED

Payment: PARTIALLY_REFUNDED

Refund: PARTIALLY_PROCESSED

REFUNDED must not replace the booking lifecycle. Razorpay’s order can remain paid even after the associated payment is refunded, which is another reason PetSaathi needs independent booking, payment and refund records.

5. Booking form structure

The booking form should use manageable steps.

Step 1 — Select pet

Show:

Pet name

Photograph

Species

Breed

Weight

Profile status

Service-specific eligibility

Missing safety information

Example:

Bruno

Labrador · 28 kg

Walking review: Additional controls required

Rules:

Customer sees only their own pets.

Archived pets cannot be selected.

Incomplete profiles may be blocked depending on service.

A booking may include multiple pets.

Each pet receives an individual price and risk snapshot.

Step 2 — Select service

MVP services:

DOG_WALKING

PET_SITTING

PET_BOARDING

Each service card should display:

Service name

Short description

Starting price

Standard duration

Eligible pet types

Important requirements

Cancellation summary

Example:

Dog Walking

30-minute private walk

Starting from ₹149

Step 3 — Select date and time

Collect:

Scheduled date

Start time

Duration

Timezone

Duration options may include:

Dog walking

30 minutes

45 minutes

60 minutes

Pet sitting

2 hours

4 hours

8 hours

Overnight

Boarding

Check-in date/time

Check-out date/time

Number of nights

Validation:

Date cannot be in the past.

Start time must satisfy minimum advance-booking rules.

End time must be after start time.

Duration must match the selected service.

Timezone must be stored.

Service availability must be checked server-side.

Duplicate requests must be prevented.

Use TIMESTAMPTZ for production timestamps and save the relevant timezone, such as:

Asia/Kolkata

Step 4 — Select service address

The customer may select:

Saved home address

Another saved address

New temporary service address

Collect:

Address line 1

Address line 2

Landmark

Area

City

State

Pincode

Latitude, optional

Longitude, optional

Access instructions

Society or building name

Security instructions

The booking should store an address snapshot. If the customer later changes the saved address, the old booking must retain the address used when it was created.

Step 5 — Booking-specific instructions

Collect only temporary information relevant to this service:

Use the red harness

Call before arriving

Security gate number 2

Walk on the quiet internal road

Do not give outside treats

Permanent care information should remain in the Pet Profile.

Do not require customers to repeat information such as:

Long-term food allergy

Bite history

Medication

Stranger anxiety

Pulling severity

Instead, copy relevant information into a booking-time snapshot.

Step 6 — Price estimate

Display:

Base service amount

Duration adjustment

Additional pet charge

Peak-time charge

Urgent-booking charge

City/area adjustment

Discount

Tax, when applicable

Final estimated amount

Step 7 — Policy confirmation

Require:

I confirm that my pet’s current health, behaviour and care information is accurate.

I agree to the booking and cancellation policy.

I understand that this is a request until PetSaathi confirms sitter availability and payment.

Step 8 — Submit request

Customer CTA:

Submit Booking Request

Not:

Confirm Booking

The booking is not confirmed at this point.

6. Pricing architecture

Core rule

Never trust a price sent by the browser.

Bad request:

{

"service": "DOG_WALKING",

"price": 149

}

The customer could modify 149 to 1.

Correct request:

{

"serviceTypeId": "dog-walking-id",

"petIds": ["pet-id"],

"scheduledStartAt": "2026-08-01T07:00:00+05:30",

"durationMinutes": 30,

"addressId": "address-id"

}

The backend retrieves current pricing rules and calculates the amount.

Recommended pricing formula

Base amount

+ Duration adjustment

+ Additional-pet amount

+ Peak-time adjustment

+ Weekend/festival adjustment

+ Urgent-booking amount

+ Area adjustment

− Promotional discount

+ Applicable tax

= Final amount

Example

30-minute dog walk ₹149

Additional dog ₹50

Early-morning adjustment ₹20

Promotion −₹20

------------------------------------

Final estimated amount ₹199

Money storage

Store financial values as integers in the smallest currency unit.

₹149.00 = 14,900 paise

₹199.00 = 19,900 paise

Razorpay’s Orders API expects the amount in currency subunits and requires a unique receipt reference for an order.

Recommended fields:

estimated_amount = 19900

final_amount = 19900

currency = INR

Do not use floating-point values such as:

199.00

for financial calculations.

7. Pricing rule model

service_prices

id

service_type_id

city_id

area_id

duration_minutes

base_amount

currency

effective_from

effective_until

status

created_at

updated_at

pricing_rules

id

rule_type

service_type_id

city_id

area_id

calculation_type

amount

percentage

conditions

priority

effective_from

effective_until

is_active

Possible rule types:

ADDITIONAL_PET

PEAK_TIME

WEEKEND

FESTIVAL

URGENT_BOOKING

AREA_SURCHARGE

DISCOUNT

booking_price_snapshots

id

booking_id

pricing_version

base_amount

duration_amount

additional_pet_amount

peak_amount

urgent_amount

area_amount

discount_amount

tax_amount

final_amount

currency

calculation_details

created_at

Never recalculate an old booking using new prices. Preserve the pricing snapshot used when the customer submitted or paid.

8. Estimate versus final price

Use two values:

estimated_amount

final_amount

Estimated amount

Shown before administrative review or sitter matching.

Final amount

Locked before Razorpay order creation.

The final amount may change because of:

Additional pet

Changed duration

Service-area adjustment

Special handling requirement

Boarding dates

Customer-approved add-on

Valid promotion

Administrative correction

If the amount changes after the customer reviewed it, require explicit customer acceptance before opening payment.

9. Booking creation transaction

When the customer submits the form, the backend should execute one controlled transaction.

Validate session

↓

Validate customer status

↓

Verify pet ownership

↓

Verify pet eligibility

↓

Validate service, time and area

↓

Calculate price on server

↓

Create booking

↓

Create booking-pet records

↓

Create address snapshot

↓

Create price snapshot

↓

Create pet-care snapshots

↓

Create booking instructions

↓

Create status-history entry

↓

Commit transaction

Prisma supports transactions for operations that must succeed or fail together and documents idempotency and optimistic concurrency patterns for reliable read-modify-write flows.

If any required operation fails, the entire booking creation should fail without leaving partial records.

10. Recommended booking database design

bookings

id

public_code

customer_id

service_type_id

status

scheduled_start_at

scheduled_end_at

timezone

duration_minutes

estimated_amount

final_amount

currency

customer_notes

created_at

updated_at

version

Example code:

BK-1001

booking_pets

id

booking_id

pet_id

pet_profile_version

risk_assessment_id

additional_pet_amount

care_instructions_snapshot

health_snapshot

behaviour_snapshot

created_at

Do not store only one pet_id inside bookings. Multiple-pet bookings will otherwise require a major redesign.

booking_address_snapshots

id

booking_id

address_line_1

address_line_2

landmark

area

city

state

pincode

latitude

longitude

access_instructions

created_at

booking_instructions

id

booking_id

customer_visible_note

sitter_instruction

admin_internal_note

safety_note

created_at

updated_at

Access to internal and safety notes must be restricted by role.

booking_status_history

id

booking_id

from_status

to_status

actor_type

actor_id

reason_code

notes

request_id

created_at

Never store only the current status.

11. Booking status rules for Week 4

REQUESTED

Meaning:

Customer submitted a booking request.

Requirements:

Customer authenticated

Pet selected

Service selected

Valid date and time

Valid service address

Estimated price recorded

Required declarations accepted

Allowed next states:

PENDING_ADMIN_REVIEW

CANCELLED

PENDING_ADMIN_REVIEW

Meaning:

PetSaathi checks:

Pet-profile completeness

Service-area eligibility

Current-health declaration

Booking instructions

Risk conditions

Price

Potential sitter availability

Allowed next states:

SITTER_MATCHING

PAYMENT_PENDING

DECLINED

CANCELLED

For the final production architecture, the normal path should pass through sitter matching and sitter assignment before payment.

PAYMENT_PENDING

Meaning:

Final amount is locked

Customer has accepted it

Booking is permitted to proceed to payment

No unresolved safety block exists

Sitter is assigned when the assignment module is active

Allowed next states:

CONFIRMED

CANCELLED

SITTER_MATCHING

A failed payment does not necessarily cancel the booking. It may remain PAYMENT_PENDING while the customer retries.

CONFIRMED

Requirements:

Payment status = CAPTURED

Payment amount = booking final amount

Payment currency = booking currency

Signature verified = true

No unresolved safety block

Active assignment exists when required

Only the backend workflow can perform:

PAYMENT_PENDING → CONFIRMED

12. Customer booking status page

Recommended route:

/customer/bookings/[bookingId]

Header

Bruno’s Dog Walk

Booking BK-1001

Booking summary

Show:

Pet

Service

Date

Time

Duration

Area

Address summary

Booking amount

Booking status

Payment status

Assigned sitter, when available

Next required action

Timeline

Example:

Booking request submitted

1 August 2026 · 6:10 PM

Request under review

1 August 2026 · 6:18 PM

Payment requested

1 August 2026 · 6:42 PM

Payment completed

1 August 2026 · 6:45 PM

Booking confirmed

1 August 2026 · 6:46 PM

Status-specific customer messages

Requested

Your request has been received. PetSaathi will review the pet information, service location and availability.

Under review

Your booking is being reviewed. We will notify you if additional information is needed.

Payment pending

Your booking is ready for payment. Complete payment before the payment window expires.

Confirmed

Your booking is confirmed. The complete service details are shown below.

Payment failed

Payment was not completed. No successful charge has been confirmed. You may try again.

Cancelled

This booking has been cancelled. Refund information will appear separately when applicable.

13. Payment eligibility

Do not create a Razorpay order immediately when the first booking form is submitted.

Create the order only when:

Booking status = PAYMENT_PENDING

Final amount is locked

Currency is locked

Customer still owns booking

Booking has not expired

Booking has not been cancelled

No unresolved safety block exists

Required assignment exists

No successful payment already exists

This prevents:

Paying for an unavailable service

Duplicate orders

Wrong amounts

Payment after cancellation

Payment after confirmation

Payment for another customer’s booking

14. Razorpay order creation flow

Recommended endpoint:

POST /api/payments/create-order

Request:

{

"bookingId": "internal-booking-id"

}

Do not send the amount from the browser.

Backend process

Authenticate customer

↓

Load booking using customer ownership condition

↓

Confirm booking is PAYMENT_PENDING

↓

Confirm no captured payment exists

↓

Read final amount from database

↓

Generate unique payment-attempt record

↓

Create Razorpay order on server

↓

Store Razorpay order ID

↓

Return safe checkout configuration

Razorpay order data

amount: booking.final_amount

currency: INR

receipt: PetSaathi payment-attempt reference

notes:

booking_code

payment_attempt_code

Razorpay’s Orders API creates orders using an amount and currency, supports a unique receipt reference and returns the provider order ID used by Checkout.

Do not place sensitive pet, medical, address or customer information in Razorpay notes.

15. Payment attempt model

One booking may have several payment attempts.

Example:

Attempt 1: Failed

Attempt 2: Customer closed checkout

Attempt 3: Captured

Use:

payment_attempts

id

public_code

booking_id

customer_id

provider

provider_order_id

provider_payment_id

amount

currency

status

signature_verified

failure_code

failure_description

created_at

authorized_at

captured_at

failed_at

updated_at

Do not overwrite failed attempts when creating a retry.

Example:

PAY-1001-A1

PAY-1001-A2

PAY-1001-A3

Add a uniqueness constraint to provider_order_id and provider_payment_id.

PostgreSQL unique constraints and foreign keys are appropriate for enforcing uniqueness and relational integrity at the database level.

16. Razorpay Checkout flow

Customer selects Pay Now

↓

Frontend requests Razorpay order from backend

↓

Backend returns:

key ID

Razorpay order ID

amount

currency

booking display data

↓

Frontend opens Razorpay Checkout

↓

Customer selects UPI/card/net banking/etc.

↓

Razorpay processes payment

↓

Checkout returns payment ID, order ID and signature

↓

Frontend sends those values to PetSaathi backend

Never expose:

RAZORPAY_KEY_SECRET

The frontend may receive the public key ID, but the secret must remain server-side.

17. Payment signature verification

Recommended endpoint:

POST /api/payments/verify

Input:

{

"bookingId": "booking-id",

"razorpayOrderId": "order_xxx",

"razorpayPaymentId": "pay_xxx",

"razorpaySignature": "signature"

}

Backend verification

The backend must:

Authenticate the customer.

Load the payment attempt.

Confirm the booking belongs to the customer.

Confirm the stored Razorpay order ID matches.

Generate the expected signature using the Razorpay secret.

Compare signatures safely.

Store the provider payment ID.

Mark signature_verified = true only after successful verification.

Verify captured payment through webhook or provider API.

Confirm amount, currency and order relationship.

Change booking to CONFIRMED only when all guards pass.

Razorpay explicitly requires server-side signature verification using the returned payment ID, order ID and signature. A frontend success callback alone is not sufficient proof of a valid payment.

18. Capture verification

A successful Checkout callback may indicate that the customer completed the visible payment flow, but PetSaathi must still establish the authoritative payment state.

Recommended confirmation sources:

Valid signature verification

Razorpay payment.captured or order.paid webhook

Provider API fetch as fallback or reconciliation

Razorpay documents that payment.captured and order.paid are emitted when payment is captured, and recommends webhooks or API queries to handle callback failures and confirm payment details.

Confirmation guard

signature_verified = true

AND payment_status = CAPTURED

AND payment_amount = booking.final_amount

AND payment_currency = booking.currency

AND razorpay_order_id matches stored order

Only then:

booking.status = CONFIRMED

19. Webhook architecture

Recommended endpoint:

POST /api/payments/webhook

Next.js App Router Route Handlers can receive third-party webhook requests through custom HTTP handlers.

Relevant payment events

At minimum:

payment.authorized

payment.captured

payment.failed

order.paid

Later:

refund.created

refund.processed

refund.failed

Webhook processing flow

Receive raw request body

↓

Read Razorpay webhook signature

↓

Validate webhook signature

↓

Check provider event ID / payload identity

↓

Store event

↓

If already processed:

return success without duplicating work

↓

Map provider entity to payment attempt

↓

Validate amount, currency and order

↓

Apply idempotent state update

↓

Create booking status event if eligible

↓

Mark webhook processed

Razorpay advises validating and testing webhooks, designing handlers for idempotency and accounting for event ordering.

payment_events

id

provider

provider_event_id

event_type

provider_order_id

provider_payment_id

payload_hash

payload_reference

processing_status

received_at

processed_at

error_message

Possible processing statuses:

RECEIVED

PROCESSING

PROCESSED

IGNORED

FAILED

20. Idempotency rules

The same webhook may be delivered more than once.

The same customer may also:

Double-click Pay Now

Refresh after payment

Open Checkout in two tabs

Retry while the first payment is still processing

Therefore:

One webhook event must not confirm twice.

One payment must not create two booking transitions.

One booking must not receive two successful final payments.

One Razorpay order must map to one payment attempt.

Recommended controls:

Unique provider event key

Unique provider payment ID

Unique provider order ID

Transaction around payment and booking updates

Current-state guards

Optimistic concurrency version

Idempotency/request key for order creation

Prisma documents idempotent APIs and optimistic concurrency control as patterns for avoiding duplicate and conflicting operations.

21. Payment transaction logic

When a captured payment is confirmed:

Begin database transaction

↓

Load payment attempt

↓

Confirm attempt is not already CAPTURED

↓

Load booking with lock/version check

↓

Confirm booking is PAYMENT_PENDING

↓

Confirm amount and currency

↓

Update payment status to CAPTURED

↓

Record captured timestamp

↓

Update booking status to CONFIRMED

↓

Insert booking-status history

↓

Create notification-outbox event

↓

Commit transaction

If two webhook processes attempt the same update, one must become a safe no-op or fail the concurrency check.

PostgreSQL supports transaction isolation and row-level locking for coordinating concurrent updates. SELECT ... FOR UPDATE can prevent a selected record from being changed by another transaction until the current transaction ends.

22. Payment failure flow

Provider failure

Payment attempt status = FAILED

Booking status = PAYMENT_PENDING

The customer may retry unless:

Booking expired

Sitter became unavailable

Price changed

Booking was cancelled

Admin placed the booking on hold

Customer message:

Payment was not completed. Your booking is not confirmed. You may try again while the request remains available.

Checkout dismissed

Do not immediately mark payment as failed.

Possible state:

Payment attempt = PENDING

Reconcile using webhook or order/payment fetch before deciding.

Signature failure

Payment attempt = FAILED_SECURITY_CHECK

Booking remains PAYMENT_PENDING

Security event recorded

Do not confirm or fulfil the booking.

23. Payment retry flow

Customer selects Try Again

↓

Server checks booking eligibility

↓

Server checks existing captured payment

↓

Server checks pending provider order

↓

Reuse safe open order or create new attempt

↓

Open Checkout

Before creating a new order, verify that a successful payment has not already been received through a delayed webhook.

Otherwise, the customer may accidentally pay twice.

24. Booking expiration

A payment-ready booking should not remain open forever.

Recommended fields:

payment_due_at

booking_expires_at

Example:

Payment due within 20 minutes

When the payment window expires:

Booking remains unconfirmed

Payment attempt becomes EXPIRED where applicable

Reserved availability is released

Customer must request review again or create a new booking

The exact duration should be a configurable business rule, not hard-coded throughout the application.

25. Payment link versus Razorpay order

Recommended Week 4 choice

Use:

Razorpay Orders API + Standard Checkout

This provides:

Direct connection between PetSaathi booking and provider order

Controlled amount

Payment-attempt tracking

Signature verification

Checkout integration

Webhook reconciliation

Better automated confirmation

A standalone Payment Link can be useful for manual support workflows, but it should not be the primary automated booking flow.

Possible later admin action:

Send Payment Link

Use cases:

Customer cannot open normal checkout

Support-assisted booking

Exceptional manual recovery

Offline customer journey

26. Recommended API structure

Booking APIs

POST /api/bookings/estimate

POST /api/bookings

GET /api/bookings

GET /api/bookings/:bookingId

POST /api/bookings/:bookingId/cancel

POST /api/bookings/:bookingId/accept-price

Avoid:

PUT /api/bookings/:id/status

A generic status endpoint permits invalid or unauthorised transitions.

Use action-specific endpoints:

POST /api/admin/bookings/:id/approve-for-payment

POST /api/admin/bookings/:id/decline

POST /api/admin/bookings/:id/cancel

Payment APIs

POST /api/payments/create-order

POST /api/payments/verify

POST /api/payments/webhook

GET /api/payments/booking/:bookingId

POST /api/payments/:paymentAttemptId/reconcile

The webhook endpoint must not require a customer login session. It must authenticate the Razorpay request using webhook-signature verification.

27. API authorization matrix

### Table 112

| Action | Customer | Admin/System | Razorpay |
| --- | --- | --- | --- |
| Request estimate | Yes | Assisted | No |
| Create booking | Yes | Assisted | No |
| View booking | Owner only | Yes | No |
| Approve for payment | No | Yes | No |
| Create order | Owner when eligible | Yes | No |
| Verify Checkout response | Owner’s request | System | No |
| Send webhook | No | No | Signed provider request |
| Confirm booking | No | Payment workflow | No direct database access |
| Cancel booking | According to policy | Yes | No |
| Change final price | No | Authorised admin/system | No |

28. Customer booking pages

/customer/book

/customer/book/review

/customer/bookings

/customer/bookings/[bookingId]

/customer/bookings/[bookingId]/payment

/customer/bookings/[bookingId]/payment/success

/customer/bookings/[bookingId]/payment/processing

/customer/bookings/[bookingId]/payment/failed

Payment success page

Do not display confirmed immediately based only on the browser callback.

First show:

Payment received. We are verifying the transaction.

Then fetch authoritative status.

Possible final results:

Confirmed

Payment verified

Booking confirmed

Processing

Payment verification is still in progress.

Do not make another payment yet.

Failed

We could not verify this payment.

No booking confirmation has been issued.

29. Recommended folder structure

app/

├── customer/

│ ├── book/

│ │ ├── page.tsx

│ │ ├── review/page.tsx

│ │ └── actions.ts

│ │

│ └── bookings/

│ ├── page.tsx

│ └── [bookingId]/

│ ├── page.tsx

│ └── payment/

│ ├── page.tsx

│ ├── success/page.tsx

│ ├── processing/page.tsx

│ └── failed/page.tsx

│

├── api/

│ ├── bookings/

│ │ ├── estimate/route.ts

│ │ ├── route.ts

│ │ └── [bookingId]/route.ts

│ │

│ └── payments/

│ ├── create-order/route.ts

│ ├── verify/route.ts

│ └── webhook/route.ts

│

├── actions/

│ ├── booking-actions.ts

│ └── payment-actions.ts

│

└── lib/

├── bookings/

│ ├── pricing.ts

│ ├── eligibility.ts

│ ├── transitions.ts

│ └── snapshots.ts

│

├── payments/

│ ├── razorpay.ts

│ ├── signature.ts

│ ├── reconciliation.ts

│ └── webhooks.ts

│

└── validation/

├── booking-schema.ts

└── payment-schema.ts

30. Day-by-day execution plan

Day 22 — Booking form

Work

Create booking multi-step flow

Select pet

Select service

Select date and time

Select duration

Select service address

Add instructions

Add current-health declaration

Add booking-policy confirmation

Add draft form state

Add responsive mobile UX

Output

Booking request form

Service/date/time selection

Address selection

Booking review step

Acceptance criteria

Only authenticated customers can access the form.

Customer sees only their own active pets.

Unsupported service/pet combinations are blocked.

Past dates are rejected.

Invalid durations are rejected.

Address must fall within an enabled service area.

Customer cannot submit without required declarations.

Refreshing does not unexpectedly duplicate the booking.

Day 23 — Pricing logic

Work

Create service price tables

Build server-side pricing service

Add duration pricing

Add additional-pet charge

Add city and area rules

Add peak-time rules

Add discount framework

Create price estimate API

Create customer-facing breakdown

Add price snapshot schema

Output

Server-calculated estimate

Pricing breakdown

Price snapshot

Configurable pricing rules

Acceptance criteria

Browser cannot set the price.

Money is stored as integer currency subunits.

Same valid request produces the expected estimate.

Expired pricing rules are ignored.

New pricing does not alter old booking snapshots.

Additional pets affect the estimate correctly.

Invalid promotion codes do not reduce the amount.

Day 24 — Booking creation

Work

Create booking schema and migration

Create booking-pet relationship

Create address snapshot

Create price snapshot

Create pet/risk snapshot

Create status history

Generate unique public booking code

Add idempotent submission protection

Implement booking creation transaction

Add ownership and eligibility checks

Output

Persistent booking record

Booking snapshots

Initial REQUESTED status

Status-history entry

Acceptance criteria

Booking is created atomically.

No partial record remains after failure.

Public booking code is unique.

Customer cannot book another customer’s pet.

Price is recalculated before persistence.

Duplicate submissions do not create duplicate bookings.

Pet and address information is preserved as snapshots.

Day 25 — Booking status page

Work

Build booking list

Build booking-detail page

Add status badge

Add payment badge

Add timeline

Add price summary

Add next-action card

Add cancellation action

Add loading and error states

Add access-control test

Output

Customer booking history

Booking detail page

Status timeline

Next-action guidance

Acceptance criteria

Customer sees only their bookings.

Booking and payment statuses are displayed separately.

Timeline comes from status-history records.

Internal admin notes remain hidden.

Exact payment errors are sanitised.

Cancel action respects current booking state.

Mobile layout remains usable.

Day 26 — Razorpay order creation

Work

Create Razorpay test account configuration

Add server-side SDK or API client

Secure environment variables

Add payment-attempt table

Build create-order endpoint

Connect Standard Checkout

Prefill safe customer data

Prevent order creation for ineligible bookings

Prevent duplicate active orders

Record provider order ID

Output

Razorpay order creation

Checkout launch

Payment-attempt tracking

Acceptance criteria

Secret key never reaches the browser.

Amount comes from the database.

Currency comes from the database.

Booking must be PAYMENT_PENDING.

Confirmed or cancelled bookings cannot create a new order.

Order ID is recorded before Checkout begins.

Payment retry creates or reuses an attempt safely.

Day 27 — Payment verification

Work

Implement Checkout callback handler

Implement server-side signature verification

Add webhook Route Handler

Validate webhook signatures

Process payment.captured

Process payment.failed

Process order.paid

Add provider-event storage

Add idempotency checks

Add payment reconciliation

Confirm booking transactionally

Add payment success/processing/failure pages

Output

Verified payment workflow

Webhook processing

Payment status updates

Automatic booking confirmation

Acceptance criteria

Frontend callback cannot confirm booking by itself.

Invalid signature is rejected.

Wrong amount is rejected.

Wrong order ID is rejected.

Duplicate webhook does not duplicate updates.

Out-of-order events do not corrupt state.

Captured payment confirms only the correct booking.

Customer refresh does not create another payment.

Day 28 — Payment and booking testing

Work

Test complete booking journey

Test successful payment

Test failed payment

Test dismissed Checkout

Test duplicate webhook

Test delayed webhook

Test wrong amount

Test invalid signature

Test two browser tabs

Test customer cancellation during payment

Test payment after cancellation

Test duplicate booking submission

Test mobile flow

Fix critical defects

Prepare demonstration data

Output

Stable booking request flow

Stable Razorpay test integration

Verified payment confirmation

Tested booking status page

Razorpay provides test-mode integration flows, while its webhook guidance specifically emphasises validation, idempotency and event-order testing before production deployment.

31. Required test matrix

Booking tests

Valid dog-walking request

Valid pet-sitting request

Boarding date range

Past date

Invalid duration

Unsupported service area

Incomplete pet profile

Archived pet

Another customer’s pet ID

Multiple pets

Duplicate submission

Price changes before submission

Booking cancellation

Booking expiration

Pricing tests

Base price

Additional pet

Peak time

Weekend

Festival

Area surcharge

Discount

Invalid discount

Expired rule

Overlapping rules

Zero or negative final amount

Currency mismatch

Old booking with new price rules

Payment tests

Successful captured payment

Failed payment

Invalid signature

Wrong payment ID

Wrong order ID

Wrong amount

Wrong currency

Duplicate payment verification

Duplicate webhook

Delayed webhook

Out-of-order webhook

Checkout closed by customer

Browser closes after successful payment

Two simultaneous payment attempts

Payment received after booking cancellation

Webhook received before callback

Callback received before webhook

Payment endpoint called by another customer

Security tests

Customer edits amount in browser

Customer changes booking ID

Customer calls another customer’s payment endpoint

Secret key exposed in frontend bundle

Forged webhook signature

Replayed webhook

Sensitive notes sent to Razorpay

SQL or script payload in booking instructions

Internal admin note returned to customer

Rate abuse against order creation

32. Notification events

Create notification events after committed state changes.

Examples:

BOOKING_REQUESTED

BOOKING_UNDER_REVIEW

PAYMENT_REQUESTED

PAYMENT_CAPTURED

PAYMENT_FAILED

BOOKING_CONFIRMED

BOOKING_CANCELLED

Do not send WhatsApp, email or push notifications inside the main database transaction.

Use:

notification_outbox

id

event_type

booking_id

customer_id

channel

template_code

payload

status

attempt_count

next_attempt_at

created_at

This prevents notification failure from corrupting a successful booking or payment update.

33. Basic refund readiness

Refund UI may be implemented later, but Week 4 should prepare the schema.

refunds

id

booking_id

payment_attempt_id

provider_refund_id

amount

currency

reason_code

status

requested_by

approved_by

requested_at

processed_at

failure_reason

Do not directly update payment to REFUNDED when an admin clicks refund.

Use:

REQUESTED

APPROVED

PROCESSING

PROCESSED

FAILED

Razorpay provides refund APIs and webhook events, and recommends relying on final refund webhook status for definitive reconciliation.

34. What should not be built in Week 4

Do not expand the sprint into:

Full sitter marketplace matching

Live GPS route tracking

Sitter payout settlement

Subscription wallet

Complex coupon engine

Split payments

Automated boarding deposit balance flow

Dynamic surge pricing

AI price optimisation

Cross-border currencies

Native mobile payments

Complex refund policy automation

However, the schema should support future:

FULL_PREPAYMENT

DEPOSIT

BALANCE_PAYMENT

ADMIN_PAYMENT_LINK

WALLET

For the Week 4 MVP, use:

FULL_PREPAYMENT

35. Week 4 deliverables

Functional deliverables

Booking form

Pet selection

Service selection

Date/time selection

Duration selection

Service-address selection

Booking instructions

Server-side estimated pricing

Booking creation

Booking history

Booking status page

Razorpay order creation

Razorpay Checkout

Payment-signature verification

Payment webhook processing

Payment success, processing and failure UX

Booking confirmation after captured payment

Safe payment retry

Technical deliverables

Booking database migration

Booking-pet relationship

Address snapshots

Price snapshots

Pet/risk snapshots

Booking-status history

Payment-attempt schema

Payment-event schema

Pricing service

Eligibility service

Razorpay server client

Signature-verification utility

Webhook handler

Idempotency controls

Concurrency protection

Automated tests

Documentation deliverables

Booking flow diagram

Payment sequence diagram

Booking-state transition table

Payment-state transition table

Pricing-rule document

Razorpay environment setup

API documentation

Webhook event mapping

Test report

Known limitations

36. Definition of Done

Week 4 is complete only when the following conditions are satisfied.

Booking

Authenticated customers can submit requests.

Customers can book only their pets.

Service, date, duration and address are validated.

Multiple pets are structurally supported.

Booking creation is transactional.

Status history is preserved.

Invalid transitions are rejected server-side.

Customers can view only their bookings.

Pricing

Pricing is calculated on the backend.

Money is stored as integer currency subunits.

Price breakdown is shown clearly.

Price snapshots are preserved.

Browser-supplied prices are ignored.

Final amount is locked before order creation.

Payments

Razorpay order is created on the server.

Secret key remains server-side.

Every payment attempt is recorded.

Signature is verified on the server.

Captured status is verified.

Amount, currency and order relationship are checked.

Duplicate webhooks are safe.

Delayed and out-of-order webhooks are handled.

Browser callback alone cannot confirm the booking.

Successful payment confirms the booking transactionally.

UX

Customer sees requested, review, payment and confirmation states.

Processing state prevents unnecessary duplicate payment.

Failed payment can be retried safely.

Errors are understandable.

Booking status page works on mobile.

Customer sees a clear next action.

Security and reliability

Ownership is verified for every booking and payment endpoint.

Webhook signatures are checked.

Sensitive values are not logged.

Provider secrets are never exposed.

Duplicate booking requests are prevented.

Concurrent payment updates cannot corrupt records.

Database constraints protect provider identifiers.

Notification failures do not roll back booking confirmation.

Final recommended Week 4 operating principle

Treat a booking request as an operational record and a Razorpay payment as a separate financial record. The backend must calculate the price, create the order, verify the signature, confirm capture and perform the booking transition. Every price, address, pet instruction and status used during the transaction must be preserved as a snapshot and audit record.

Simple explanation for professor

“During Week 4, I will develop the Booking and Payment Module. First, an authenticated customer will select their pet, choose a service such as dog walking, pet sitting or boarding, and provide the required date, time, duration and service address. The system will validate the information and calculate the estimated price on the backend so that the customer cannot manually change it.

When the booking request is submitted, the system will create the booking record together with snapshots of the selected pets, address, care instructions and price. The customer will then be able to view the booking status through a timeline.

After PetSaathi approves the request for payment, the backend will create a Razorpay order using the final amount. The customer will complete payment through Razorpay Checkout. The booking will not be confirmed only because the browser displays a success message. The backend will verify the Razorpay signature and confirm that the payment has been captured for the correct order, amount and currency. Only after all verification conditions are satisfied will the booking become confirmed.

The booking status and payment status will remain separate. This makes failed payments, payment retries, cancellations and future refunds easier to handle correctly. At the end of Week 4, the project will have a complete booking-request flow, server-side pricing, Razorpay payment integration, verified payment confirmation and a customer booking-status page.”

PetSaathi Phase 4 — Week 5

Sitter Dashboard and Pet Report Card, End to End 🐾📋

Executive decision

Week 5 creates the operational workspace used by PetSaathi caregivers.

The complete sitter journey should be:

Approved sitter logs in → reviews a booking offer → accepts or declines → receives authorised pet information → starts the service → submits updates and private media → completes the service → submits the Pet Report Card → views pending earnings

The correct operating principle is:

A sitter may perform actions only for an active assignment. Accepting an offer does not automatically confirm the customer’s booking, starting a service does not automatically complete it, and completing the physical service does not remove the requirement to submit a report.

Authentication and authorization must be checked inside every server-side mutation. Rendering an action only on a protected dashboard is not enough because server actions and endpoints can still be called directly. Current Next.js guidance explicitly recommends verifying authentication and authorization inside every Server Action.

1. Week 5 final scope

Goal

Allow approved sitters to:

Log in securely

View and maintain permitted profile information

Set or review availability

View booking offers and confirmed assignments

Accept or decline booking offers

View necessary pet-care and safety instructions

Start an authorised service

Upload service updates

Complete the physical service

Submit a structured Pet Report Card

View estimated, pending and paid earnings

Report a concern or incident

Week 5 flow

Approved sitter

↓

Login

↓

Sitter dashboard

↓

View booking offer

↓

Review service, area, pet and handling requirements

↓

Accept or decline

↓

Admin/system confirms assignment

↓

Booking confirmed after payment

↓

View authorised service details

↓

Start service

↓

Upload private updates

↓

Complete service

↓

Submit Pet Report Card

↓

Earning becomes pending/eligible

2. Important dependencies

Week 5 depends on the earlier modules.

From Week 3

User authentication

Role-based authorization

Customer and pet ownership

Structured Pet Profile

Private pet photograph

Behaviour and medical instructions

From Week 4

Booking record

Booking status

Assignment records

Payment status

Address snapshot

Pet-information snapshot

Price snapshot

Booking-status history

A sitter must never receive access merely because they know a booking ID.

Access must require:

Authenticated user role = SITTER

AND

Active assignment belongs to authenticated sitter

AND

Assignment status permits requested action

OWASP recommends checking authorization at every request and denying access by default rather than relying only on navigation visibility.

3. Separate the sitter account, profile and verification state

Do not store every sitter concept inside the users table.

Use separate records for:

User identity

Sitter profile

Verification checks

Service permissions

Availability

Booking assignments

Earnings

Payouts

User role

CUSTOMER

SITTER

ADMIN

A user may later have more than one role, but the MVP may use one primary operational role.

Sitter profile status

DRAFT

SUBMITTED

UNDER_REVIEW

MORE_INFORMATION_REQUIRED

APPROVED

ACTIVE

SUSPENDED

INACTIVE

REJECTED

Meaning

### Table 113

| Status | Meaning |
| --- | --- |
| DRAFT | Application or profile is incomplete |
| SUBMITTED | Profile submitted for review |
| UNDER_REVIEW | Verification is in progress |
| MORE_INFORMATION_REQUIRED | Additional evidence is needed |
| APPROVED | Verification approved, but activation may still be pending |
| ACTIVE | Sitter may receive booking offers |
| SUSPENDED | Temporarily blocked from accepting or performing work |
| INACTIVE | Sitter voluntarily or administratively inactive |
| REJECTED | Application not approved |

Only ACTIVE sitters should normally receive new booking offers.

4. Do not use one overloaded verification level

The existing example uses:

Verification level: L4 Trained

That can be customer-friendly display language, but the database should keep separate verification facts.

Recommended verification checks

IDENTITY

ADDRESS

POLICE_VERIFICATION

BANK_ACCOUNT

TRAINING

PET_FIRST_AID

SERVICE_ASSESSMENT

BOARDING_PROPERTY

REFERENCES

Verification status

NOT_STARTED

PENDING

VERIFIED

EXPIRED

REJECTED

REQUIRES_UPDATE

Example internal record

Check: POLICE_VERIFICATION

Status: VERIFIED

Verified at: 10 July 2026

Expires at: 10 July 2027

Verified by: Safety Admin

Evidence: Private document reference

Customer-visible badges

The customer may see:

Identity Verified

Training Completed

Large-Dog Approved

Boarding Home Approved

The customer should not see:

Verification document numbers

Police-report documents

Bank details

Internal rejection notes

Administrator comments

5. Sitter profile structure

Customer-visible fields

### Table 114

| Field | Example |
| --- | --- |
| Display name | Riya S. |
| City | Ahmedabad |
| Area | Bopal |
| Services | Walking, sitting |
| Experience | Three years |
| Service radius | 3 km |
| Bio | Experienced caregiver for dogs and cats |
| Profile photograph | Approved private upload |
| Intro video | Optional |
| Languages | Gujarati, Hindi, English |
| Rating | 4.8 |
| Completed bookings | 12 |
| Badges | Identity verified, trained |

Internal operational fields

Legal name

Date of birth

Full address

Emergency contact

Verification records

Training records

Service permissions

Pet-type permissions

Dog-size permissions

Risk-level permissions

Bank and payout status

Internal restrictions

Incident restrictions

Sitter-editable fields

The sitter may edit:

Bio

Display photograph

Intro video

Languages

Service radius

Availability

Service preferences

Experience description

Notification preferences

Sitter-restricted fields

The sitter must not directly edit:

Verification status

Police-verification result

Training approval

Customer ratings

Completed-booking count

Incident restrictions

Service-risk permission

Earnings calculation

Payout status

Platform commission

Administrative notes

6. Sitter dashboard structure

The dashboard should answer four questions immediately:

What requires my action?

What service is next?

What must I know about the pet?

What earnings are pending?

Recommended dashboard cards

Action required

2 booking offers require a response

Today’s assignments

7:00 AM — Bruno’s Dog Walk

Area: Bopal

Status: Confirmed

Profile readiness

Profile: Active

Availability: Updated

Training renewal: Due in 28 days

Earnings summary

Pending: ₹596

Eligible for payout: ₹298

Paid this month: ₹1,490

Performance summary

Rating: 4.8

Completed bookings: 12

Acceptance rate: 84%

Report submission rate: 100%

For a new sitter, do not show misleading percentages based on one or two bookings. Show:

Not enough completed bookings yet

7. Sitter dashboard pages

/sitter/dashboard

/sitter/profile

/sitter/verification

/sitter/services

/sitter/availability

/sitter/bookings

/sitter/bookings/[bookingId]

/sitter/earnings

/sitter/ratings

/sitter/support

During Week 5, the essential pages are:

/sitter/dashboard

/sitter/profile

/sitter/bookings

/sitter/bookings/[bookingId]

/sitter/earnings

8. Booking offers versus assigned bookings

Do not show all records as “assigned bookings.”

There are three operational groups:

Booking offers

The sitter may accept or decline.

Assignment status = OFFERED

Accepted offers awaiting confirmation

The sitter accepted, but the system or administrator has not yet made them the active primary sitter.

Assignment status = ACCEPTED

Confirmed assignments

The sitter has been selected as the active caregiver.

Assignment status = ASSIGNED

The customer’s booking may still be waiting for payment.

9. Assignment status model

Use:

OFFERED

VIEWED

ACCEPTED

DECLINED

EXPIRED

ASSIGNED

REMOVED

COMPLETED

NO_SHOW

Correct interpretation

OFFERED

The booking has been proposed to the sitter.

VIEWED

The sitter opened the offer.

ACCEPTED

The sitter agreed to perform it if selected.

DECLINED

The sitter declined and optionally supplied a reason.

EXPIRED

The sitter did not respond before the deadline.

ASSIGNED

The sitter is the active primary, backup or replacement caregiver.

REMOVED

The assignment was withdrawn or replaced.

COMPLETED

The sitter completed their assignment obligations.

NO_SHOW

The sitter failed to attend and the event was recorded.

10. Booking-offer information

Before acceptance, the sitter should receive enough information to decide safely, but not all customer information.

Show before acceptance

Service type

Date

Start time

Duration

Approximate area

Approximate travel distance

Pet type

Pet size

Number of pets

Relevant risk category

Essential handling requirements

Required qualifications

Estimated sitter earnings

Response deadline

Hide before final assignment

Full customer address

Customer personal phone number

Full emergency-contact information

Home-entry code

Sensitive medical details unrelated to decision-making

Internal administrator notes

Example offer:

Dog Walking Offer

Date: 1 August 2026

Time: 7:00–7:30 AM

Area: Bopal

Pet: One Labrador, 28 kg

Handling: Strong pulling

Required: Large-dog-approved walker

Estimated earning: ₹104

Respond before: 6:00 PM

11. Accept-booking flow

Recommended endpoint:

POST /api/sitter/booking-offers/:assignmentId/accept

Backend process

Authenticate sitter

↓

Load assignment belonging to sitter

↓

Confirm assignment status = OFFERED or VIEWED

↓

Confirm offer has not expired

↓

Confirm sitter account is ACTIVE

↓

Recheck service permission

↓

Recheck availability

↓

Recheck schedule conflicts

↓

Recheck safety or training restrictions

↓

Change assignment to ACCEPTED

↓

Record response timestamp

↓

Create event and notification

Important rule

Accepting an offer does not automatically mean:

booking.status = SITTER_ASSIGNED

The final assignment may still require:

Admin selection

Customer approval

Compatibility review

Backup-sitter decision

Confirmation that no other sitter has already been assigned

Use:

Offer accepted

rather than:

Booking confirmed

12. Decline-booking flow

Recommended endpoint:

POST /api/sitter/booking-offers/:assignmentId/decline

Decline reasons

UNAVAILABLE

TOO_FAR

SCHEDULE_CONFLICT

PET_SIZE_UNSUPPORTED

RISK_REQUIREMENT_UNSUPPORTED

SERVICE_NOT_PREFERRED

PERSONAL_EMERGENCY

INSUFFICIENT_NOTICE

OTHER

The sitter may optionally provide a short explanation.

Do not expose internal decline notes directly to the customer.

Result

Assignment status = DECLINED

Booking remains in SITTER_MATCHING

Declining one offer should not cancel the customer’s booking.

13. Preventing two sitters from becoming primary

Several sitters may accept almost simultaneously.

Use a controlled assignment transaction:

Load booking and current version

↓

Confirm booking is in SITTER_MATCHING

↓

Confirm no active primary assignment exists

↓

Recheck selected sitter eligibility

↓

Mark selected record ASSIGNED

↓

Mark role PRIMARY

↓

Expire or remove remaining open offers

↓

Change booking to SITTER_ASSIGNED

↓

Create status history

↓

Commit

Use:

version INTEGER NOT NULL DEFAULT 1

and update using the expected version.

Prisma documents optimistic concurrency control using a version or timestamp token to detect conflicting updates rather than silently overwriting newer state.

14. Service-detail access

After final assignment and confirmation, the sitter may view the information required to perform the service.

Show

Pet identity and photograph

Behaviour and handling instructions

Food restrictions

Relevant medication instructions

Allergies

Emergency actions

Veterinarian contact

Authorised emergency contacts

Service address

Building access instructions

Customer’s booking instructions

Start and completion controls

Do not show

Unrelated customer bookings

Full customer account history

Payment-card information

Customer’s platform price when not operationally required

Other sitters’ offers or earnings

Internal complaints unrelated to the assignment

Unnecessary pet medical history

Access should be limited to the minimum information required for the active assignment.

15. Service-start workflow

Recommended endpoint:

POST /api/sitter/bookings/:bookingId/start

Start requirements

Authenticated user is active assigned sitter

Booking status = CONFIRMED

Assignment status = ASSIGNED

Current time is within permitted start window

Payment status = CAPTURED or approved override

Booking is not CANCELLED

No active INCIDENT_HOLD

Required handover checks completed

Data recorded

Actual start timestamp

Sitter ID

Assignment ID

Server request timestamp

Optional location evidence

Handover status

Initial pet condition

Equipment confirmation

Start note

Status transition

CONFIRMED → SERVICE_STARTED

Customer message

The sitter has started Bruno’s service.

Sitter message

Service started. Follow the care instructions and submit updates from this booking screen.

Use the backend server timestamp as the authoritative start time. A device timestamp may be recorded separately for diagnostic purposes.

16. Start-service safeguards

The sitter must not be able to start:

Another sitter’s booking

A cancelled booking

An unpaid booking

A booking far outside the allowed time window

A booking for which they were removed

A booking already completed

A booking on incident hold

The same booking twice

The request must be idempotent.

If a duplicate start request arrives after success:

Return existing SERVICE_STARTED state

Do not create another start event

17. During-service updates

During an active service, the sitter may record updates.

Possible event types:

ARRIVED

HANDOVER_COMPLETE

WALK_STARTED

FOOD_GIVEN

WATER_REFRESHED

TOILET_UPDATE

PHOTO_UPDATE

VIDEO_UPDATE

BEHAVIOUR_NOTE

CONCERN_REPORTED

SERVICE_ENDING

These are timeline events, not necessarily top-level booking statuses.

Example:

7:03 AM — Service started

7:12 AM — Water update

7:20 AM — Photo uploaded

7:31 AM — Service completed

18. Service-completion workflow

Recommended endpoint:

POST /api/sitter/bookings/:bookingId/complete

Completion requirements

Booking status = SERVICE_STARTED

Authenticated sitter owns active assignment

Actual start exists

Actual end does not exist

Pet is safely handed back or secured

Mandatory service checks completed

Concern status supplied

Data recorded

Actual completion time

Handover or secure-home confirmation

Final pet condition

Completion note

Concern indicator

Optional final media

Assignment completion evidence

Status transition

SERVICE_STARTED → SERVICE_COMPLETED

This means the physical service ended.

It does not mean:

Booking closed

Report delivered

Earnings paid

19. Report Card lifecycle

Use a separate report status.

DRAFT

SUBMITTED

ADMIN_REVIEW_REQUIRED

DELIVERED

AMENDED

RETURNED_FOR_CORRECTION

Meaning

DRAFT

The sitter is preparing the report.

SUBMITTED

The sitter submitted the report and ordinary editing is locked.

ADMIN_REVIEW_REQUIRED

The report contains a concern or requires moderation.

DELIVERED

The customer may view it.

AMENDED

An approved corrected version exists.

RETURNED_FOR_CORRECTION

An administrator requested a correction.

20. Service-specific Report Card fields

Common fields

### Table 115

| Field | Walking | Sitting | Boarding |
| --- | --- | --- | --- |
| Actual start time | Required | Required | Required |
| Actual end time | Required | Required | Required |
| Water update | Required | Required | Required |
| Mood | Required | Required | Required |
| Photos | Required | Required | Required |
| Sitter note | Required | Required | Required |
| Concern reported | Required | Required | Required |

Dog walking

Walk duration

Distance, optional/manual MVP

Pee update

Poop update

Leash behaviour

Interactions with people

Interactions with animals

Water update

Weather observation

Route note

Pet sitting

Food update

Water update

Toilet update

Play/activity

Medication task

Mood

Home condition

Arrival/departure

Boarding

Food update

Water update

Toilet update

Sleep/rest

Other-pet interaction

Separation behaviour

Medication task

Daily activity

Health observation

For the MVP, distance may be entered manually or omitted. Full GPS route capture can remain a later phase.

21. Structured Report Card values

Do not store every answer in one large note.

Mood

CALM

HAPPY

PLAYFUL

TIRED

ANXIOUS

RESTLESS

WITHDRAWN

UNWELL

MIXED

Food status

NOT_APPLICABLE

ATE_ALL

ATE_MOST

ATE_SOME

REFUSED

NOT_OFFERED

Water status

NORMAL

DRANK_MORE_THAN_USUAL

DRANK_LESS_THAN_USUAL

REFUSED

REFILLED

NOT_OBSERVED

Toilet status

NORMAL

NO_OUTPUT

LOOSE_STOOL

CONSTIPATION_CONCERN

URINATION_CONCERN

ACCIDENT_IN_HOME

NOT_OBSERVED

These values support reporting and operations, but they must not be presented as medical diagnoses.

22. Concern and incident separation

A sitter should answer:

Did anything require customer or PetSaathi attention?

YES / NO

If yes, collect:

Concern category

Observed time

Description

Urgency

Media

Action taken

Customer contacted?

Admin contacted?

Emergency support needed?

Concern categories

BEHAVIOUR

INJURY

ILLNESS

MEDICATION

ESCAPE_RISK

PROPERTY

CUSTOMER_ACCESS

EQUIPMENT

OTHER

A concern is not automatically a critical incident.

Possible flow:

Concern reported

↓

Rule/admin review

↓

Routine report note

or

Incident record created

↓

Booking enters INCIDENT_HOLD when necessary

Emergency issues should be reported immediately during the service rather than waiting for Report Card submission.

23. Report submission flow

Recommended endpoint:

POST /api/sitter/bookings/:bookingId/report/submit

Submission guards

Authenticated sitter owns assignment

Booking status = SERVICE_COMPLETED

Assignment status = ASSIGNED

Report belongs to same booking and sitter

Required fields for service type are complete

Required media uploaded

No duplicate submitted report exists

Transaction

Validate report

↓

Mark report SUBMITTED

↓

Record submitted timestamp

↓

If concern:

create review/incident workflow

Else:

mark for delivery

↓

Change booking:

SERVICE_COMPLETED → REPORT_SUBMITTED

↓

Update assignment status

↓

Create earnings eligibility event

↓

Create notifications

A booking should not become CLOSED merely because the physical service ended.

24. Report versioning

Do not overwrite an already delivered report silently.

Use:

report_id

version_number

supersedes_report_version_id

status

created_at

submitted_at

amended_at

amended_by

amendment_reason

Example:

Version 1 — Submitted by sitter

Version 2 — Corrected after admin request

The customer should see the current approved version.

Administrators should retain the version history for audit and dispute resolution.

25. Media upload architecture

Service photos and videos may contain:

The pet

The customer’s home

Building interiors

Location clues

People

Security systems

Therefore, media must be private by default.

Recommended flow

Sitter selects file

↓

Frontend sends file metadata to backend

↓

Backend authenticates sitter

↓

Backend verifies active assignment

↓

Backend creates upload-intent record

↓

Backend generates unique object key

↓

Backend issues short-lived presigned upload URL

↓

Browser uploads directly to private object storage

↓

Frontend calls finalize-upload endpoint

↓

Backend verifies uploaded object

↓

Media record becomes READY

Amazon S3 presigned URLs can allow uploads without exposing AWS credentials, but they remain usable until expiration and an upload to an existing key can replace that object. PetSaathi should therefore issue short-lived URLs and server-generated unique object keys.

26. Media validation rules

Do not trust only:

File extension

Browser MIME type

Original filename

OWASP recommends layered file-upload controls, including allowlisted extensions, content validation, generated filenames, size restrictions, authorization and storage outside the publicly served web root.

Recommended image formats

JPEG

PNG

WEBP

HEIC only if conversion is supported

Recommended video formats

MP4

MOV only if processing is supported

MVP size limits

Example product limits:

Image: up to 10 MB

Video: up to 100 MB

Maximum images per report: 10

Maximum videos per report: 2

The exact values should be configurable.

Required controls

Authenticate uploader

Verify sitter owns active assignment

Allowlist file types

Inspect file signature

Apply size limit

Generate object filename

Reject executable content

Strip unnecessary metadata where practical

Scan files where malware scanning is available

Verify upload completion

Preserve checksum or integrity metadata

Store in private bucket

Generate short-lived viewing links

Audit deletion and moderation

Amazon S3 supports upload-integrity validation using checksums and can reject data when the provided and calculated checksums do not match.

27. Media visibility

Sitter

May view media for their assigned booking.

Customer

May view customer-approved Report Card media for their booking.

Operations admin

May view media for routine support.

Safety admin

May view concern and incident evidence.

Public

No access.

Marketing team

No automatic access.

A separate marketing consent must be required before service media is reused publicly.

Do not store permanent public URLs such as:

https://public-bucket/.../customer-home-video.mp4

Use private object references and time-limited signed viewing URLs. AWS documents signed or presigned URLs as temporary access mechanisms for private objects.

28. Recommended media tables

media_upload_intents

id

uploader_user_id

booking_id

report_id

object_key

expected_content_type

maximum_size_bytes

purpose

status

expires_at

created_at

finalized_at

Upload-intent status

CREATED

URL_ISSUED

UPLOADED

VALIDATING

READY

REJECTED

EXPIRED

DELETED

report_media

id

booking_id

report_id

sitter_id

object_key

media_type

content_type

size_bytes

checksum

visibility

moderation_status

caption

captured_at

uploaded_at

created_at

Media purpose

SERVICE_START

SERVICE_UPDATE

SERVICE_COMPLETION

REPORT_CARD

CONCERN_EVIDENCE

INCIDENT_EVIDENCE

29. Sitter earnings model

The sitter dashboard should not simply show:

Customer paid ₹149

Therefore sitter earned ₹149

Customer price and sitter earning are separate.

Example calculation

Customer service amount ₹149

Platform commission ₹35

Sitter incentive ₹10

Adjustment ₹0

---------------------------------------

Sitter earning ₹124

The exact amounts must come from the compensation rules stored at booking time.

Earnings states

ESTIMATED

PENDING_SERVICE

PENDING_REPORT

ON_HOLD

ELIGIBLE

QUEUED

PROCESSING

PAID

FAILED

REVERSED

CANCELLED

Meaning

ESTIMATED

Shown on an offer before the sitter accepts.

PENDING_SERVICE

The booking is confirmed but has not been completed.

PENDING_REPORT

The physical service ended, but the report is incomplete.

ON_HOLD

An incident, complaint or reconciliation issue exists.

ELIGIBLE

The earning is ready for a payout batch.

QUEUED

A payout has been scheduled.

PROCESSING

The provider is processing the transfer.

PAID

The payout reached the expected successful state.

FAILED

The transfer failed.

REVERSED

The provider reversed the payout.

30. Earnings eligibility rule

A sitter earning should usually become eligible only when:

Booking status = REPORT_SUBMITTED or CLOSED

Assignment status = COMPLETED

Payment status = CAPTURED

Report status = DELIVERED or approved

No unresolved incident hold

No blocking complaint

Earning calculation is locked

Do not mark earnings payable merely when the customer completes payment.

The sitter has not yet delivered the service at that point.

31. Basic earnings dashboard

Summary cards

Estimated

Pending

Eligible

Paid

On hold

Transaction rows

Show:

Booking code

Service

Service date

Pet name

Gross customer service amount, optional

Platform fee or commission

Sitter earning

Adjustment

Earning status

Expected payout cycle

Payout reference, after payment

Example:

BK-1001 · Bruno’s Dog Walk

1 August 2026

Sitter earning: ₹104

Status: Pending Report

Do not expose

Other sitters’ earnings

Customer payment credentials

Razorpay secret identifiers

Internal fraud information

Bank account numbers in full

Administrator-only payout notes

32. Earnings and payout database design

sitter_earnings

id

sitter_id

booking_id

assignment_id

currency

gross_service_amount

platform_fee

sitter_base_amount

incentive_amount

adjustment_amount

final_earning_amount

calculation_version

status

eligible_at

held_at

hold_reason

created_at

updated_at

payouts

id

sitter_id

currency

total_amount

provider

provider_payout_id

status

scheduled_at

processing_at

paid_at

failed_at

reversed_at

failure_code

created_at

updated_at

payout_items

id

payout_id

sitter_earning_id

amount

created_at

One payout may contain earnings from several bookings.

33. Future RazorpayX integration

Week 5 only requires a basic earnings view. Actual automated payout processing can remain a later phase.

When RazorpayX is integrated:

Create contacts and fund accounts

Use payout idempotency keys

Use payout webhooks

Map provider states into internal payout states

Handle queued, processing, failed and reversed conditions

Do not treat an API request response as final payout success

Current RazorpayX documentation states that idempotency keys are mandatory for payout requests and describes payout states including pending, queued, processing, failed and reversed. It recommends webhook-based status updates because payouts are asynchronous.

34. Recommended database tables

Sitter identity and capability

sitter_profiles

sitter_verification_checks

sitter_training_records

sitter_service_permissions

sitter_pet_permissions

sitter_availability

sitter_unavailability

Booking operations

booking_assignments

assignment_status_history

booking_events

service_checkins

service_completions

Reports and media

booking_reports

booking_report_versions

report_service_details

media_upload_intents

report_media

Earnings

sitter_earnings

earning_adjustments

payouts

payout_items

Safety

concerns

incidents

incident_media

sitter_restrictions

35. Recommended simplified sitter profile schema

sitter_profiles

---------------

id

user_id

public_code

display_name

legal_name

bio

city

area

pincode

service_radius_km

years_experience

profile_photo_reference

intro_video_reference

profile_status

average_rating

completed_booking_count

created_at

updated_at

version

Do not let frontend requests update:

profile_status

average_rating

completed_booking_count

These should be controlled by system or admin workflows.

36. Report Card table

booking_reports

---------------

id

booking_id

assignment_id

sitter_id

service_type

status

version_number

actual_start_at

actual_end_at

mood

food_status

water_status

toilet_status

walk_distance_metres

activity_summary

behaviour_summary

sitter_note

concern_reported

submitted_at

delivered_at

created_at

updated_at

version

Service-specific details may be stored in dedicated tables or validated JSON, but frequently searched fields should remain normal database columns.

37. API structure

Sitter profile

GET /api/sitter/profile

PATCH /api/sitter/profile

GET /api/sitter/availability

PUT /api/sitter/availability

Booking offers

GET /api/sitter/booking-offers

GET /api/sitter/booking-offers/:assignmentId

POST /api/sitter/booking-offers/:assignmentId/view

POST /api/sitter/booking-offers/:assignmentId/accept

POST /api/sitter/booking-offers/:assignmentId/decline

Assigned bookings

GET /api/sitter/bookings

GET /api/sitter/bookings/:bookingId

POST /api/sitter/bookings/:bookingId/start

POST /api/sitter/bookings/:bookingId/complete

POST /api/sitter/bookings/:bookingId/report-concern

Report Card

GET /api/sitter/bookings/:bookingId/report

POST /api/sitter/bookings/:bookingId/report

PATCH /api/sitter/bookings/:bookingId/report

POST /api/sitter/bookings/:bookingId/report/submit

Media

POST /api/sitter/bookings/:bookingId/media/upload-intent

POST /api/sitter/bookings/:bookingId/media/finalize

DELETE /api/sitter/bookings/:bookingId/media/:mediaId

Earnings

GET /api/sitter/earnings

GET /api/sitter/earnings/:earningId

GET /api/sitter/payouts

Avoid a generic endpoint such as:

PUT /api/sitter/bookings/:id/status

Use action-specific endpoints with explicit transition rules.

38. Actor permission matrix

### Table 116

| Action | Sitter | Customer | Admin/System |
| --- | --- | --- | --- |
| Update sitter bio | Own profile | No | Yes |
| Change verification | No | No | Authorised admin |
| View offer | Offer recipient | No | Yes |
| Accept offer | Offer recipient | No | Assisted |
| Assign primary sitter | No | Customer approval where required | Yes |
| Start service | Assigned sitter | No | Exceptional admin |
| Complete service | Assigned sitter | No | Exceptional admin |
| Submit report | Assigned sitter | No | Correction assistance |
| View Report Card | Assigned sitter | Booking owner | Yes |
| Change earning | No | No | Finance workflow |
| Process payout | No | No | Finance workflow |
| Create incident | Yes | Yes | Yes |
| Resolve critical incident | No | No | Safety admin |

39. Folder structure

app/

├── sitter/

│ ├── layout.tsx

│ ├── dashboard/page.tsx

│ ├── profile/page.tsx

│ ├── availability/page.tsx

│ ├── bookings/

│ │ ├── page.tsx

│ │ └── [bookingId]/

│ │ ├── page.tsx

│ │ ├── report/page.tsx

│ │ └── media/page.tsx

│ └── earnings/page.tsx

│

├── api/

│ └── sitter/

│ ├── profile/

│ ├── availability/

│ ├── booking-offers/

│ ├── bookings/

│ ├── reports/

│ ├── media/

│ └── earnings/

│

├── actions/

│ ├── sitter-profile-actions.ts

│ ├── assignment-actions.ts

│ ├── service-actions.ts

│ ├── report-actions.ts

│ └── media-actions.ts

│

└── lib/

├── sitter/

│ ├── permissions.ts

│ ├── eligibility.ts

│ └── availability.ts

├── assignments/

│ ├── transitions.ts

│ └── conflicts.ts

├── reports/

│ ├── validation.ts

│ └── delivery.ts

├── media/

│ ├── storage.ts

│ ├── validation.ts

│ └── signed-urls.ts

└── earnings/

├── calculation.ts

└── eligibility.ts

40. Day-by-day execution plan

Day 29 — Sitter login and profile

Work

Add SITTER role authorization

Create protected sitter layout

Build sitter login redirect

Build profile page

Add service and experience fields

Display verification badges

Add availability summary

Prevent restricted-field editing

Add profile completion state

Seed an approved test sitter

Output

Sitter authentication

Protected dashboard

Sitter account

Editable profile

Verification display

Acceptance criteria

Customer accounts cannot access sitter routes.

Sitter accounts cannot access admin routes.

Suspended sitters cannot accept new work.

Sitter can update only permitted profile fields.

Verification and rating fields cannot be changed through browser requests.

Sensitive verification evidence remains private.

Day 30 — Sitter booking list

Work

Build booking-offer list

Build confirmed-assignment list

Add filters

Add date grouping

Build booking detail

Add approximate-area display before assignment

Add full authorised details after confirmation

Add empty states

Add countdown for offer expiry

Add mobile layout

Output

Booking offers

Upcoming assignments

Completed assignments

Booking detail page

Acceptance criteria

Sitter sees only their offers and assignments.

Full address is hidden before authorised release.

Expired offers cannot be accepted.

Removed assignments disappear from actionable lists but remain in history.

Pet safety instructions are shown only when access is authorised.

Day 31 — Accept or reject booking

Work

Implement accept endpoint

Implement decline endpoint

Add decline reason

Recheck sitter eligibility

Recheck availability

Detect schedule conflicts

Add response timestamps

Add offer-expiry handling

Add concurrency protection

Add notification events

Output

Accept booking offer

Decline booking offer

Eligibility validation

Assignment response history

Acceptance criteria

Sitter cannot accept another sitter’s offer.

Offer can be accepted only once.

Expired offer is rejected.

Suspended sitter cannot accept.

Schedule conflict is blocked.

Acceptance does not automatically confirm booking.

Declining does not cancel the customer booking.

Simultaneous acceptances cannot create two primary sitters.

Day 32 — Start and complete service

Work

Build start-service action

Build completion action

Add permitted time window

Add server timestamps

Add handover checklist

Add initial and final pet condition

Add optional location evidence

Add service-event timeline

Add concern shortcut

Add idempotency guards

Output

Service start

Service completion

Operational timeline

Concern reporting

Acceptance criteria

Only assigned sitter can start.

Booking must be confirmed.

Cancelled booking cannot start.

Service cannot complete before it starts.

Duplicate start or completion requests are safe.

Actual timestamps are stored.

Concern reporting remains available throughout the service.

Day 33 — Report Card form

Work

Create report schema

Create service-specific validation

Build walking form

Build sitting form

Build boarding form

Add draft saving

Add mood and care updates

Add concern section

Add final sitter note

Add submission lock

Add version preparation

Output

Structured Report Card

Draft saving

Service-specific fields

Report submission

Acceptance criteria

Only assigned sitter can create the report.

Report belongs to one booking.

Required fields vary by service.

Walking distance is not required for sitting or boarding.

Concern requires details.

Report cannot submit before service completion.

Submitted report cannot be silently overwritten.

Day 34 — Media upload

Work

Configure private object storage

Build upload-intent endpoint

Generate unique object keys

Issue short-lived upload URLs

Add image and video limits

Validate type and size

Add upload progress

Add finalize endpoint

Add media gallery

Add signed viewing URLs

Add failure and retry states

Output

Private image upload

Private video upload

Upload validation

Report media gallery

Acceptance criteria

Only assigned sitter can request an upload.

Storage credentials are not sent to the browser.

Public permanent media URLs are not created.

Invalid types are rejected.

Oversized files are rejected.

Duplicate filenames cannot overwrite another file.

Uploaded object is verified before becoming visible.

Customer can view only media attached to their booking.

Day 35 — Sitter earnings view

Work

Create sitter-earnings table

Create compensation snapshot

Calculate estimated earning

Add pending, eligible and paid states

Build earnings summary

Build transaction list

Add payout placeholder data

Add hold status

Exclude customer payment credentials

Add test adjustments

Output

Basic earnings dashboard

Booking-level earnings

Pending payout information

Paid history placeholder

Acceptance criteria

Sitter sees only their earnings.

Earnings are calculated server-side.

Customer payment does not immediately create payable earnings.

Unsubmitted report keeps earnings pending.

Incident hold prevents payout eligibility.

Adjustments are recorded rather than silently replacing amounts.

Payout status cannot be changed by sitter.

41. Required test matrix

Authentication and profile tests

Active sitter login

Customer attempts sitter login area

Suspended sitter login

Sitter edits bio

Sitter attempts verification change

Sitter attempts rating change

Missing profile fields

Expired verification

Booking-offer tests

View own offer

View another sitter’s offer

Accept active offer

Accept expired offer

Accept twice

Decline offer

Decline after assignment

Sitter has schedule conflict

Sitter lacks required permission

Two sitters accept simultaneously

Primary assignment already exists

Service tests

Start confirmed booking

Start unpaid booking

Start cancelled booking

Start too early

Start too late

Start another sitter’s booking

Duplicate start

Complete before start

Complete twice

Concern during service

Network retry after successful completion

Report tests

Save draft

Submit walking report

Submit sitting report

Submit boarding report

Missing required field

Concern without details

Report before completion

Another sitter submits report

Duplicate submission

Admin returns report

Amended report version

Media tests

Valid image

Valid video

Invalid extension

Forged MIME type

Oversized file

Empty file

Duplicate object key

Expired upload URL

Upload for another booking

Malware-test file

Interrupted upload

Finalise missing object

Customer views another booking’s media

Earnings tests

Confirmed future booking

Completed service without report

Submitted report

Incident hold

Cancelled booking

Sitter no-show

Incentive

Negative adjustment

Duplicate earnings creation

Sitter views another sitter’s earnings

42. Notification events

Recommended events:

BOOKING_OFFERED

BOOKING_OFFER_VIEWED

BOOKING_OFFER_ACCEPTED

BOOKING_OFFER_DECLINED

OFFER_EXPIRED

SITTER_ASSIGNED

SERVICE_START_REMINDER

SERVICE_STARTED

SERVICE_COMPLETED

REPORT_SUBMITTED

REPORT_RETURNED

REPORT_DELIVERED

EARNING_ELIGIBLE

PAYOUT_PROCESSING

PAYOUT_PAID

PAYOUT_FAILED

CONCERN_REPORTED

As in the booking module, send notifications through an outbox rather than inside the critical database transaction.

43. What should not be built in Week 5

Do not expand the sprint into:

Full live GPS route tracking

Real-time video streaming

Complex customer-sitter chat

Automatic AI Report Card writing

AI incident diagnosis

Automatic sitter suspension without review

Automated RazorpayX payouts

Tax invoice engine

Dynamic incentive marketplace

Public media gallery

Facial recognition

Automatic mood diagnosis from photographs

Native mobile background tracking

For the Week 5 MVP:

Manual distance entry = acceptable

Private photo/video update = required

Structured report = required

Basic earnings ledger = required

Automated bank payout = later

44. Week 5 deliverables

Functional deliverables

Sitter login and protected dashboard

Sitter profile management

Verification-badge display

Booking-offer list

Assigned-booking list

Accept-booking flow

Decline-booking flow

Start-service action

Complete-service action

Service timeline

Structured Pet Report Card

Concern reporting

Private photo upload

Private video upload

Basic earnings dashboard

Technical deliverables

Sitter database models

Service-permission models

Assignment state machine

Assignment status history

Start and completion records

Report Card schema

Report versioning

Media upload-intent model

Private object-storage integration

Signed upload and viewing URLs

Earnings ledger

Eligibility rules

Concurrency protection

Automated tests

Documentation deliverables

Sitter user-flow diagram

Assignment transition table

Service-start checklist

Service-completion checklist

Report Card data dictionary

Media-security policy

Earnings calculation example

Sitter access-control matrix

API documentation

Test report

Known limitations

45. Definition of Done

Week 5 is complete only when the following are true.

Sitter security

Only authenticated sitters access sitter pages.

Suspended sitters cannot accept or perform work.

Sitter identity is checked during every mutation.

Sitters access only their assignments.

Restricted profile fields cannot be self-edited.

Sensitive customer data is shown only when necessary.

Assignment

Offers, acceptances and assignments are separate states.

Accepting does not automatically confirm a customer booking.

Expired offers cannot be accepted.

Schedule conflicts are checked.

Multiple active primary sitters are prevented.

Assignment history is preserved.

Service execution

Only the assigned sitter can start.

Booking must be confirmed.

Start and completion timestamps are recorded.

Invalid state transitions are rejected.

Duplicate requests are idempotent.

Concerns can be reported during service.

Report Card

Required fields depend on service type.

Report drafts can be saved.

Submission requires completed service.

Concern flags trigger review.

Submitted reports are locked.

Material corrections create new versions.

Report submission updates the booking lifecycle.

Media

Files are private by default.

Upload permissions require an active assignment.

File type and size are validated.

Server-generated object keys are used.

Storage credentials remain private.

Viewing links expire.

Media access is role- and booking-restricted.

Marketing use requires separate consent.

Earnings

Earnings are calculated on the server.

Customer payment and sitter earnings remain separate.

Service completion alone does not guarantee payout.

Report submission affects eligibility.

Incident holds block eligibility.

Payout states remain separate.

Sitter sees only their own records.

Final Week 5 operating principle

The Sitter Dashboard is an authorised operational workspace, not a general booking database. Every sitter action must be tied to a specific assignment, valid booking state and server-side permission check. Service completion must produce structured evidence through the Pet Report Card, while customer media remains private and sitter earnings remain pending until all operational requirements are satisfied.

Simple explanation for professor

“During Week 5, I will develop the Sitter Dashboard and Pet Report Card Module. An approved sitter will be able to log in, update allowed profile information and view booking offers. The sitter may accept or reject an offer, but accepting does not automatically confirm the booking. PetSaathi will still verify eligibility and select the final assigned sitter.

After assignment and customer payment confirmation, the sitter can view the required pet-care information and service address. The sitter can start the service only for an authorised and confirmed booking. The system records the actual start time, service updates and final completion time.

After completing the service, the sitter must submit a structured Pet Report Card. The report contains information such as food, water, toilet updates, mood, walk distance where applicable, photos, videos, sitter notes and any concerns. The report fields change according to dog walking, pet sitting or boarding.

Service photos and videos will be stored privately using secure, time-limited upload and viewing links. They will not be publicly available or used for marketing without separate permission.

The sitter will also see a basic earnings dashboard showing estimated, pending, eligible and paid earnings. Customer payment and sitter payout will remain separate because a sitter earning becomes eligible only after the service and report requirements are completed. At the end of Week 5, the project will have a secure sitter dashboard, booking acceptance, service-status updates, Report Card submission, private media upload and a basic earnings view.”

PetSaathi Phase 4 — Week 6

Admin Dashboard, Operations and Safety Control 🛡️🐾

Executive decision

Week 6 builds the operational control centre for PetSaathi.

The admin dashboard should not be a single unrestricted panel where every employee can edit customers, approve sitters, assign bookings, issue refunds and close safety incidents.

Use role-based access control, separation of duties and complete audit history.

Every administrative action must identify who performed it, what changed, why it changed and when it happened.

Next.js Server Functions can be invoked through direct POST requests, so hiding an admin button is not security. Authentication and permission checks must run inside every Server Action, API handler and data-access operation.

1. Week 6 goal

Allow authorised PetSaathi team members to:

View operational performance

Search customers and pets

Review structured Pet Profiles

Approve and verify sitters

Assign sitters to bookings

Track booking lifecycles

Reconcile payments

Initiate controlled refunds

Review Pet Report Cards

Moderate customer reviews

Create and investigate incidents

Apply safety restrictions

Maintain complete audit records

End-to-end administrative flow

Admin signs in

↓

Role and permissions verified

↓

Dashboard displays authorised queues

↓

Admin opens a customer, sitter, booking or incident

↓

System checks action-specific permission

↓

Admin enters decision and reason

↓

Server validates current state

↓

Database transaction applies change

↓

Audit event is recorded

↓

Notification event is created

↓

Relevant dashboard queues update

2. Do not use one universal admin role

Recommended admin roles:

SUPER_ADMIN

OPERATIONS_ADMIN

SITTER_VERIFICATION_ADMIN

SAFETY_ADMIN

FINANCE_ADMIN

CUSTOMER_SUPPORT

REPORT_QUALITY_REVIEWER

REVIEW_MODERATOR

READ_ONLY_ANALYST

Role responsibilities

### Table 117

| Role | Main permissions |
| --- | --- |
| SUPER_ADMIN | Role configuration and exceptional system administration |
| OPERATIONS_ADMIN | Booking review, matching, assignment and replacement |
| SITTER_VERIFICATION_ADMIN | Sitter applications, documents and service permissions |
| SAFETY_ADMIN | Pet risk, incidents, restrictions and high-risk decisions |
| FINANCE_ADMIN | Payments, refunds, reconciliation and payouts |
| CUSTOMER_SUPPORT | Customer communication and limited profile assistance |
| REPORT_QUALITY_REVIEWER | Report Card review and correction requests |
| REVIEW_MODERATOR | Review moderation and abuse handling |
| READ_ONLY_ANALYST | Aggregated operational reporting without mutation rights |

OWASP recommends least privilege, deny-by-default authorization and permission checks on every request.

Important restrictions

A support administrator should not automatically be able to:

Verify police documents

Approve a Red-risk pet

Issue refunds

Change sitter earnings

Resolve a critical incident

Edit payment status

Read complete medical information

Assign themselves additional permissions

A finance administrator should not automatically receive access to detailed pet medical information.

3. Administrator account security

Admin accounts require stronger controls than ordinary customer accounts.

P0 requirements

Separate admin route group

Strong authenticated session

Shorter inactivity timeout

Re-authentication for sensitive actions

Login throttling

Device and login-event history

Secure, HTTP-only cookies

Immediate session revocation after suspension

Audit event for permission changes

No shared admin accounts

Recommended additional control

Require MFA for:

SUPER_ADMIN

FINANCE_ADMIN

SAFETY_ADMIN

SITTER_VERIFICATION_ADMIN

MFA adds management complexity, but it provides an additional security boundary for privileged accounts.

Sensitive actions requiring re-authentication

Full or partial refund

Changing an administrator’s role

Disabling a sitter

Closing a severe incident

Downloading verification evidence

Exporting personal information

Overriding a booking transition

Removing a safety restriction

4. Permission architecture

Do not write checks such as:

if (user.role === "ADMIN") {

// allow everything

}

Use granular permissions:

customers.read

customers.update_basic

customers.suspend

pets.read

pets.request_information

pets.review_risk

sitters.read

sitters.review_application

sitters.verify_identity

sitters.approve

sitters.suspend

bookings.read

bookings.review

bookings.assign

bookings.replace_sitter

bookings.cancel

payments.read

payments.reconcile

refunds.request

refunds.approve

reports.read

reports.request_correction

reports.deliver

reviews.moderate

reviews.remove

incidents.create

incidents.investigate

incidents.resolve

incidents.close

Authorization flow

Authenticated administrator

↓

Admin account ACTIVE?

↓

Required permission exists?

↓

Resource is within permitted city/team scope?

↓

Action is valid for current state?

↓

Additional approval required?

↓

Perform transaction

PostgreSQL Row-Level Security can provide an additional database-level boundary, including default-deny behaviour when row-security policies exist but no policy permits access. It should complement—not replace—application authorization.

5. Admin dashboard shell

Recommended route:

/admin

Main navigation

Overview

Customers

Pet Profiles

Sitters

Bookings

Payments

Refunds

Report Cards

Reviews

Incidents

Payouts

Service Areas

Pricing

Audit Logs

Settings

Dashboard summary cards

Operations

Booking requests awaiting review

Bookings needing sitter assignment

Payments awaiting reconciliation

Services starting today

Overdue Report Cards

Verification

New sitter applications

Documents awaiting review

Expiring verifications

Profiles needing more information

Safety

Open incidents

Critical incidents

Pet reassessments required

Sitter restrictions

Bookings on incident hold

Finance

Captured payments

Failed payments

Refunds awaiting approval

Refunds processing

Payouts pending

Dashboard principles

Show counts and queues, not unnecessary personal details.

Critical safety alerts appear above ordinary metrics.

Each card links to a filtered operational queue.

Avoid displaying full addresses, medical notes or contact numbers on overview screens.

Use server-side filters and permissions for every dashboard query.

Display data freshness, such as “Updated 2 minutes ago.”

6. Operational queues

The admin dashboard should be queue-driven rather than only database-list driven.

Recommended queues:

BOOKING_REVIEW_REQUIRED

SITTER_ASSIGNMENT_REQUIRED

PAYMENT_RECONCILIATION_REQUIRED

REFUND_APPROVAL_REQUIRED

REPORT_REVIEW_REQUIRED

INCIDENT_TRIAGE_REQUIRED

PET_REASSESSMENT_REQUIRED

SITTER_VERIFICATION_REQUIRED

Each queue item should show:

Priority

Public reference code

Current status

Reason it entered the queue

Assigned admin

Age of task

Service date or deadline

Next permitted action

Example:

Priority: High

Booking: BK-1001

Reason: Strong-pulling pet requires experienced sitter

Assigned to: Operations Team

Age: 18 minutes

Next action: Review eligible sitters

7. Customer management

Customer list

Display:

Customer code

Name

City and area

Account status

Number of pets

Completed bookings

Open bookings

Unresolved complaints

Created date

Filters

ACTIVE

SUSPENDED

DEACTIVATED

PROFILE_INCOMPLETE

HAS_OPEN_INCIDENT

HAS_PAYMENT_ISSUE

CITY

AREA

CREATED_DATE

Customer detail sections

Overview

Contact information

Pet profiles

Bookings

Payments

Refunds

Reports

Reviews

Complaints

Incidents

Consent records

Audit history

Admin actions

An authorised administrator may:

Correct an obvious profile error

Request updated customer information

Suspend or reactivate an account

Add an internal support note

Record a complaint

View related bookings

Assist with account recovery

Start a privacy-request workflow

Important rules

Do not let administrators silently replace customer-provided safety information.

Example:

Original customer answer:

Strong pulling: Yes

Admin action:

Correction requested from customer

Not:

Admin silently changes:

Strong pulling: No

Safety-critical customer information should retain:

Original value

Updated value

Person who changed it

Reason

Timestamp

Version

8. Pet Profile administration

Pet list

Show:

Pet code

Customer

Species

Weight

Profile status

Walking risk status

Sitting risk status

Boarding risk status

Reassessment state

Last health update

Admin pet-profile tabs

Identity

Behaviour

Medical

Vaccinations

Care routine

Vet and emergency

Risk assessments

Bookings

Incidents

Version history

Operations administrator may

Check profile completeness

Request missing information

Review booking-specific suitability

View applicable risk summary

Safety administrator may

Review bite history

Review escape history

Review medical handling concerns

Create service-specific assessment

Apply required controls

Trigger reassessment

Restrict a service

Safety assessment actions

Assign GREEN

Assign YELLOW

Assign RED

Request more information

Require meet-and-greet

Require specialist sitter

Require veterinary information

Restrict boarding

Revoke assessment

Non-negotiable rules

Breed must not automatically assign risk.

One permanent risk colour must not be used for all services.

Old assessments must not be overwritten.

Customer edits affecting safety must trigger reassessment.

Booking-time snapshots must remain unchanged.

9. Sitter application workflow

Recommended flow:

DRAFT

↓

SUBMITTED

↓

UNDER_REVIEW

↓

MORE_INFORMATION_REQUIRED

↓

UNDER_REVIEW

↓

APPROVED

↓

ACTIVE

Alternative outcomes:

REJECTED

SUSPENDED

INACTIVE

Application review sections

Identity

Address

Experience

Services

Pet-size permissions

Police verification

Training

References

Bank/payout readiness

Boarding property

Internal assessment

Verification decision record

Every verification decision should include:

Verification type

Decision

Reason code

Evidence reviewed

Reviewed by

Reviewed at

Expiry date

Next review date

Internal note

Suggested reason codes

DOCUMENT_VALID

DOCUMENT_UNREADABLE

DOCUMENT_EXPIRED

INFORMATION_MISMATCH

TRAINING_REQUIRED

REFERENCE_UNVERIFIED

PROPERTY_REQUIREMENT_NOT_MET

OUTSIDE_SERVICE_SCOPE

SAFETY_REVIEW_REQUIRED

Approval requirements

A sitter should become ACTIVE only when:

Required identity checks pass

Required service training passes

Service permissions are explicitly assigned

No blocking safety restriction exists

Availability and area are configured

Required agreements are accepted

Payout readiness is recorded, where required

Service permissions

Approval should be granular:

DOG_WALKING

PET_SITTING

PET_BOARDING

LARGE_DOG_HANDLING

YELLOW_RISK_HANDLING

MEDICATION_SUPPORT

OVERNIGHT_CARE

A sitter approved for cat home visits should not automatically be approved for large-dog boarding.

10. Sitter suspension workflow

Use a structured record:

ACTIVE

↓

SUSPENSION_PENDING_REVIEW

↓

SUSPENDED

↓

REINSTATEMENT_REVIEW

↓

ACTIVE

Possible causes:

VERIFICATION_EXPIRED

SERIOUS_COMPLAINT

NO_SHOW

SAFETY_INCIDENT

DOCUMENT_MISMATCH

POLICY_VIOLATION

PAYMENT_OR_FRAUD_REVIEW

TRAINING_EXPIRED

When suspension begins:

Stop new offers.

Identify future assignments.

Move affected bookings to replacement review.

Preserve current evidence.

Notify authorised staff.

Notify the sitter with appropriate information.

Record appeal or reassessment process.

Do not delete the sitter profile or historical assignments.

11. Booking management

Booking list

Display:

Booking code

Customer

Pet

Service

Scheduled time

Area

Booking status

Assignment status

Payment status

Risk status

Incident status

Next action

Filters

REQUESTED

PENDING_ADMIN_REVIEW

SITTER_MATCHING

SITTER_ASSIGNED

PAYMENT_PENDING

CONFIRMED

SERVICE_STARTED

SERVICE_COMPLETED

REPORT_SUBMITTED

CLOSED

CANCELLED

DECLINED

REPLACEMENT_REQUIRED

INCIDENT_HOLD

Booking detail sections

Summary

Customer and pets

Risk requirements

Price

Assignment

Payment

Service timeline

Report Card

Review

Incident

Audit history

12. Booking-review workflow

REQUESTED

↓

PENDING_ADMIN_REVIEW

↓

Check service area

Check current health

Check risk assessment

Check customer instructions

Check profile completeness

Check price

↓

Approve for matching

or

Request information

or

Decline

Review decisions

APPROVE_FOR_MATCHING

REQUEST_MORE_INFORMATION

CHANGE_SERVICE_REQUIRED

MEDICAL_INFORMATION_REQUIRED

SAFETY_REVIEW_REQUIRED

DECLINE

CANCEL

The decision should contain:

Decision code

Admin

Customer-facing explanation

Internal note

Required controls

Timestamp

13. Sitter assignment

Hard eligibility filters

Exclude a sitter when:

Account is not active

Service permission is absent

Verification expired

Training requirement not met

Pet-size permission insufficient

Risk permission insufficient

Area or radius does not match

Availability does not match

Schedule conflict exists

Boarding property is not approved

Active restriction exists

Maximum workload reached

Candidate ranking factors

After hard filters, candidates may be ranked by:

Distance

Availability fit

Relevant experience

Same-sitter continuity

Customer preference

Acceptance history

Suitable rating confidence

Required language

Operational workload

Ranking must not bypass hard safety requirements.

Assignment transaction

Lock or version-check booking

↓

Confirm booking = SITTER_MATCHING

↓

Confirm candidate still eligible

↓

Confirm schedule still available

↓

Confirm no active primary sitter

↓

Create primary assignment

↓

Close remaining offers

↓

Change booking to SITTER_ASSIGNED

↓

Create status history

↓

Create notification events

↓

Commit

Prisma supports optimistic concurrency using a version token, while PostgreSQL row locks can block conflicting writers until a transaction completes.

14. Replacement workflow

When a sitter withdraws:

CONFIRMED

↓

REPLACEMENT_REQUIRED

↓

Remove active assignment

↓

Identify eligible replacements

↓

Customer approval where required

↓

New sitter assigned

↓

CONFIRMED

If no replacement is found:

REPLACEMENT_REQUIRED

↓

CANCELLED

↓

Refund review

Record:

Original sitter

Removal reason

Removal timestamp

Replacement attempts

Customer communication

New sitter

Price change, if any

Refund or compensation outcome

15. Payment management

The admin payment page must display provider and internal states separately.

Internal payment status

CREATED

PENDING

AUTHORIZED

CAPTURED

FAILED

EXPIRED

CANCELLED

REFUNDED

PARTIALLY_REFUNDED

Provider data

Display:

Razorpay order ID

Razorpay payment ID

Amount

Currency

Method

Provider status

Internal status

Capture status

Refund status

Amount refunded

Created time

Captured time

Last webhook

Reconciliation state

Razorpay payment entities currently use statuses including created, authorized, captured, refunded and failed, with separate refund-status and refunded-amount fields.

Admin actions

Finance administrators may:

Fetch current provider status

Reconcile a payment

Review failed attempts

Review webhook history

Request a refund

Approve a refund

Retry failed internal processing

Add a finance note

They must not directly type:

Payment status = CAPTURED

Provider-backed states must be updated through verified provider evidence or controlled reconciliation.

16. Payment reconciliation

Recommended states:

NOT_REQUIRED

PENDING

MATCHED

MISMATCH

MANUAL_REVIEW

RESOLVED

Reconciliation checks

Internal payment ID exists

Provider order matches

Provider payment matches

Amount matches

Currency matches

Customer booking matches

Capture state matches

Refund amount matches

Duplicate successful payment absent

Examples

Matched

Internal: CAPTURED

Provider: captured

Amount: ₹199

Result: MATCHED

Mismatch

Internal: PENDING

Provider: captured

Result: MANUAL_REVIEW

Duplicate payment

Booking final amount: ₹199

Captured attempt 1: ₹199

Captured attempt 2: ₹199

Result: Duplicate-payment investigation

17. Refund administration

Refunds should use a maker–checker workflow for higher-value or exceptional cases.

Refund statuses

REQUESTED

PENDING_APPROVAL

APPROVED

PROCESSING

PROCESSED

PARTIALLY_PROCESSED

FAILED

REJECTED

Refund flow

Admin requests refund

↓

Validate captured payment

↓

Calculate maximum refundable amount

↓

Check prior refunds

↓

Require approval where applicable

↓

Create idempotent provider request

↓

Status = PROCESSING

↓

Webhook updates final state

Razorpay permits refunds only against captured payments and supports full or partial refund amounts. Its refund webhooks distinguish created, processed and failed outcomes, so PetSaathi should not treat refund initiation as completion.

Refund controls

Never refund more than the unrefunded captured amount.

Prevent duplicate refund requests.

Store customer-facing and internal reasons separately.

Require an audit reason.

Use provider idempotency where supported.

Do not delete failed refund attempts.

Notify the customer only after a reliable state is available.

Razorpay documents idempotent refund requests as a way to retry safely without repeating the refund.

18. Report Card management

Report queues

SUBMITTED

ADMIN_REVIEW_REQUIRED

RETURNED_FOR_CORRECTION

DELIVERED

AMENDED

Review criteria

An admin or quality reviewer checks:

Correct booking

Correct sitter

Actual times

Required service fields

Clear care updates

Required media

Appropriate customer-facing language

Concern indicator

Internal versus customer-visible notes

Possible incident indicators

Admin actions

DELIVER_TO_CUSTOMER

RETURN_FOR_CORRECTION

ESCALATE_TO_SAFETY

REQUEST_MISSING_MEDIA

APPROVE_AMENDMENT

Important rules

Do not rewrite the sitter’s factual observation without preserving the original.

Do not remove a concern simply to improve appearance.

Do not diagnose the pet.

Material corrections must create a new version.

Concern reports may trigger an incident.

Report media remains private.

19. Review moderation

Customer reviews should remain authentic unless they violate a defined policy.

Review statuses

PENDING

PUBLISHED

MODERATION_REQUIRED

HIDDEN

REMOVED

APPEALED

RESTORED

Valid moderation reasons

PERSONAL_INFORMATION

THREAT_OR_HARASSMENT

HATEFUL_CONTENT

SPAM

FRAUDULENT_REVIEW

OFF_TOPIC

LEGAL_REVIEW

DUPLICATE

Invalid moderation reason

The review gives the sitter a low rating.

Admins should not:

Increase ratings

Rewrite criticism

Delete accurate negative feedback without policy reason

Submit reviews for customers

Alter “would book again”

Change the sitter’s aggregate rating directly

Rating aggregates should be system-calculated from eligible reviews.

20. Incident management

The incident module is the primary safety-control system.

Incident sources

An incident may be created from:

Sitter concern

Customer complaint

Report Card concern

Admin observation

No-show

Payment dispute linked to service

Pet escape

Bite or injury

Medical emergency

Property damage

Wrong pet or instructions

Privacy or media concern

Incident severity

Recommended levels:

SEV_1_CRITICAL

SEV_2_HIGH

SEV_3_MODERATE

SEV_4_LOW

SEV 1 — Critical

Examples:

Life-threatening emergency

Missing pet

Serious bite or injury

Emergency hospitalisation

Immediate danger

Alleged serious misconduct

SEV 2 — High

Examples:

Injury requiring professional attention

Significant escape event

Serious property or access issue

Repeated unsafe sitter conduct

Major medication error

SEV 3 — Moderate

Examples:

Non-critical care failure

Significant delay

Equipment problem

Customer-sitter dispute

Report discrepancy

SEV 4 — Low

Examples:

Minor service complaint

Small documentation issue

Non-urgent communication problem

21. Incident status lifecycle

Use:

OPEN

TRIAGE

INVESTIGATING

ACTION_REQUIRED

MONITORING

RESOLVED

CLOSED

REOPENED

Correct workflow

Incident created

↓

Severity assigned

↓

Immediate safety actions taken

↓

Booking placed on hold where necessary

↓

Evidence preserved

↓

People contacted

↓

Investigation performed

↓

Findings recorded

↓

Corrective actions assigned

↓

Resolution approved

↓

Incident closed

Immediate controls

Depending on severity:

Contact emergency services or veterinary support

Notify owner

Notify authorised emergency contact

Stop service

Place booking on INCIDENT_HOLD

Suspend sitter from new assignments

Pause pet matching

Preserve photos, videos and messages

Identify future affected bookings

Escalate to senior safety admin

The software supports operational escalation; it must not replace emergency or veterinary judgement.

22. Incident record

Required fields

Incident ID

Booking ID

Customer ID

Pet ID

Sitter ID

Incident type

Severity

Current status

Reported by

Reported time

Occurred time

Location

Description

Immediate actions

Customer contacted

Emergency contact used

Veterinarian contacted

Evidence references

Assigned investigator

Findings

Resolution

Corrective actions

Closed by

Closed at

Incident types

PET_INJURY

SITTER_INJURY

BITE

ESCAPE

MEDICAL_EMERGENCY

MEDICATION_ERROR

PROPERTY_DAMAGE

ACCESS_OR_SECURITY

NO_SHOW

CUSTOMER_CONDUCT

SITTER_CONDUCT

WRONG_INFORMATION

PRIVACY_OR_MEDIA

PAYMENT_DISPUTE

OTHER

23. Incident evidence

Evidence may include:

Original customer instructions

Booking-time Pet Profile snapshot

Risk assessment

Assignment history

Check-in and completion times

Photos and videos

Report Card versions

Customer messages

Sitter statements

Admin notes

Veterinarian or emergency references

Payment and refund records

Evidence rules

Preserve original files.

Store checksum or integrity information.

Do not silently edit media.

Record who uploaded or viewed evidence.

Use private storage.

Restrict access to authorised safety personnel.

Do not include sensitive evidence in ordinary application logs.

Record legal or retention holds where necessary.

24. Corrective actions

Possible corrective actions:

CUSTOMER_INFORMATION_UPDATE

PET_REASSESSMENT

SITTER_RETRAINING

SITTER_RESTRICTION

SITTER_SUSPENSION

SERVICE_TYPE_REMOVAL

POLICY_UPDATE

REFUND

CUSTOMER_CREDIT

PROCESS_CHANGE

TECHNICAL_FIX

NO_ACTION_REQUIRED

A resolved incident should not automatically be considered closed.

Before closure, verify:

Immediate danger ended

Customer communication complete

Required refund decision complete

Pet reassessment completed

Sitter decision completed

Future bookings reviewed

Corrective actions assigned

Evidence retained

Closure approved by authorised role

25. Admin audit logging

Every sensitive admin mutation must create an audit event.

admin_audit_logs

id

admin_user_id

admin_role_snapshot

action_code

resource_type

resource_id

before_summary

after_summary

reason_code

reason_text

request_id

ip_hash

session_id_hash

created_at

Actions requiring audit logs

CUSTOMER_SUSPENDED

PET_RISK_CHANGED

SITTER_APPROVED

SITTER_SUSPENDED

BOOKING_ASSIGNED

BOOKING_CANCELLED

PAYMENT_RECONCILED

REFUND_REQUESTED

REFUND_APPROVED

REPORT_RETURNED

REVIEW_REMOVED

INCIDENT_SEVERITY_CHANGED

INCIDENT_CLOSED

ADMIN_PERMISSION_CHANGED

OWASP recommends application-level security logging because infrastructure logs alone do not capture business decisions and application events.

Do not log

Passwords

Access tokens

Complete session IDs

Encryption keys

Full bank information

Payment-card information

Full medical notes

Government identifiers

Full emergency contacts

Raw verification documents

OWASP specifically identifies access tokens, passwords, sensitive personal data, bank information and cryptographic secrets as data that should not be recorded directly in logs.

26. Admin notes

Use separate note types:

CUSTOMER_VISIBLE

SITTER_VISIBLE

OPERATIONS_INTERNAL

SAFETY_RESTRICTED

FINANCE_RESTRICTED

LEGAL_RESTRICTED

Do not store every comment in one universal notes field.

Every note should record:

Author

Visibility

Resource

Content

Created time

Edited time

Edit reason

Retention classification

Customer-facing messages must not expose internal allegations, fraud signals or unrelated personal information.

27. Data privacy

The admin dashboard may expose:

Customer identity

Home address

Mobile number

Emergency contacts

Pet medical information

Sitter identity documents

Police-verification records

Payment references

Incident evidence

Therefore, access must follow data minimisation and purpose limitation.

The final Digital Personal Data Protection Rules, 2025 were published by India’s Ministry of Electronics and Information Technology on 14 November 2025, with staged commencement provisions. PetSaathi should obtain professional legal review for its exact compliance obligations.

Minimum admin privacy controls

Mask personal data in lists

Reveal full information only after authorised navigation

Record access to highly sensitive evidence

Use private file storage

Use expiring file links

Restrict exports

Add export watermarks and identifiers

Prevent sensitive information in URLs

Support correction and deletion workflows

Apply retention rules

Remove data from analytics where unnecessary

Restrict clipboard or bulk-export features where practical

28. Recommended database tables

Admin identity and access

admin_profiles

roles

permissions

role_permissions

admin_role_assignments

admin_scopes

admin_sessions

Operations

admin_work_queues

admin_task_assignments

admin_notes

admin_audit_logs

Customers and pets

customer_profiles

customer_status_history

pet_information_requests

pet_risk_assessments

pet_risk_factors

pet_reassessment_requests

Sitters

sitter_applications

sitter_verification_checks

sitter_service_permissions

sitter_restrictions

sitter_status_history

Bookings

bookings

booking_assignments

assignment_status_history

booking_status_history

booking_events

booking_cancellations

Finance

payments

payment_attempts

payment_events

payment_reconciliations

refunds

refund_approvals

payouts

Quality and safety

booking_reports

booking_report_versions

reviews

review_moderation_actions

complaints

incidents

incident_evidence

incident_actions

incident_status_history

29. Admin API structure

Dashboard

GET /api/admin/dashboard

GET /api/admin/queues

GET /api/admin/audit-logs

Customers and pets

GET /api/admin/customers

GET /api/admin/customers/:customerId

POST /api/admin/customers/:customerId/suspend

POST /api/admin/customers/:customerId/reactivate

GET /api/admin/pets

GET /api/admin/pets/:petId

POST /api/admin/pets/:petId/request-information

POST /api/admin/pets/:petId/risk-assessments

POST /api/admin/pets/:petId/reassessment

Sitters

GET /api/admin/sitters

GET /api/admin/sitters/:sitterId

POST /api/admin/sitters/:sitterId/request-information

POST /api/admin/sitters/:sitterId/approve

POST /api/admin/sitters/:sitterId/reject

POST /api/admin/sitters/:sitterId/activate

POST /api/admin/sitters/:sitterId/suspend

POST /api/admin/sitters/:sitterId/permissions

Bookings

GET /api/admin/bookings

GET /api/admin/bookings/:bookingId

POST /api/admin/bookings/:bookingId/approve-for-matching

POST /api/admin/bookings/:bookingId/assign

POST /api/admin/bookings/:bookingId/replace-sitter

POST /api/admin/bookings/:bookingId/cancel

POST /api/admin/bookings/:bookingId/decline

Finance

GET /api/admin/payments

GET /api/admin/payments/:paymentId

POST /api/admin/payments/:paymentId/reconcile

POST /api/admin/refunds

POST /api/admin/refunds/:refundId/approve

POST /api/admin/refunds/:refundId/reject

POST /api/admin/refunds/:refundId/retry

Reports and reviews

GET /api/admin/reports

POST /api/admin/reports/:reportId/deliver

POST /api/admin/reports/:reportId/request-correction

POST /api/admin/reports/:reportId/escalate

GET /api/admin/reviews

POST /api/admin/reviews/:reviewId/hide

POST /api/admin/reviews/:reviewId/remove

POST /api/admin/reviews/:reviewId/restore

Incidents

GET /api/admin/incidents

POST /api/admin/incidents

POST /api/admin/incidents/:incidentId/assign

POST /api/admin/incidents/:incidentId/change-severity

POST /api/admin/incidents/:incidentId/add-action

POST /api/admin/incidents/:incidentId/resolve

POST /api/admin/incidents/:incidentId/close

POST /api/admin/incidents/:incidentId/reopen

Avoid generic endpoints such as:

PUT /api/admin/resource/:id/status

Use action-specific endpoints with explicit validation, permission and audit requirements.

30. Recommended admin page structure

/admin

/admin/customers

/admin/customers/[customerId]

/admin/pets

/admin/pets/[petId]

/admin/sitters

/admin/sitters/[sitterId]

/admin/sitters/[sitterId]/verification

/admin/bookings

/admin/bookings/[bookingId]

/admin/bookings/[bookingId]/assignment

/admin/payments

/admin/payments/[paymentId]

/admin/refunds

/admin/refunds/[refundId]

/admin/reports

/admin/reports/[reportId]

/admin/reviews

/admin/incidents

/admin/incidents/[incidentId]

/admin/payouts

/admin/audit-logs

/admin/settings/roles

/admin/settings/pricing

/admin/settings/service-areas

31. Day-by-day execution plan

Day 36 — Admin layout

Work

Create protected admin route group

Add role and permission checks

Build sidebar and responsive shell

Add dashboard cards

Add operational queues

Add global search

Add notifications

Add loading, empty and forbidden states

Add administrator audit foundation

Add MFA-ready account settings

Output

Secure admin dashboard shell

Role-aware navigation

Overview metrics

Operational queues

Acceptance criteria

Non-admin users cannot access admin pages.

Navigation displays only authorised modules.

Direct API calls still enforce permissions.

Suspended admins lose access.

Overview does not expose unnecessary sensitive data.

Every administrative mutation can create an audit event.

Day 37 — Customer and Pet Profile management

Work

Build customer list and filters

Build customer detail

Build Pet Profile list

Build pet detail tabs

Add profile-completeness review

Add request-information flow

Add account suspension

Add risk-assessment view

Add version history

Add privacy-aware data masking

Output

Customer administration

Pet Profile administration

Information-request workflow

Risk review view

Acceptance criteria

Support can access only permitted customer information.

Customer edits remain attributable.

Safety information is versioned.

Pet risk remains service-specific.

Ordinary support cannot change final risk.

Sensitive fields are masked in lists.

Customer suspension records actor and reason.

Day 38 — Sitter management

Work

Build sitter application list

Build application detail

Add document review

Add verification checks

Add request-more-information

Add approval and rejection

Add service permissions

Add verification expiry

Add suspension workflow

Add decision history

Output

Sitter application review

Verification workflow

Approval and activation

Service permissions

Acceptance criteria

Only verification admins approve sitters.

Evidence is private.

Approval requires mandatory checks.

Rejection includes a reason code.

Service permissions are granular.

Expired checks affect eligibility.

Suspended sitters stop receiving new offers.

Historical assignments remain preserved.

Day 39 — Booking management

Work

Build booking list and filters

Build booking detail

Add admin review

Add eligible-sitter search

Add assignment workflow

Add replacement workflow

Add cancellation and decline

Add required controls

Add transactional assignment

Add booking timeline

Output

Booking review

Sitter matching

Primary assignment

Replacement management

Acceptance criteria

Ineligible sitters are excluded.

Only one active primary sitter exists.

Concurrent assignment attempts are safe.

Assignment history remains visible.

Customer approval is recorded where required.

Booking cancellation does not overwrite payment state.

Every transition is recorded.

Day 40 — Payment management

Work

Build payment list

Show Razorpay and internal states

Add payment-attempt history

Add webhook-event history

Add reconciliation

Add refund request

Add refund approval

Add partial-refund support

Add idempotency controls

Add finance notes

Output

Payment tracking

Reconciliation workflow

Refund management

Acceptance criteria

Provider states cannot be manually fabricated.

Captured, failed and refunded states remain distinct.

Amount and currency mismatches are flagged.

Refund requires captured payment.

Refund cannot exceed available refundable amount.

Duplicate refund request is prevented.

Finance actions are fully audited.

Ordinary operations admins cannot approve refunds.

Day 41 — Report and review management

Work

Build Report Card queue

Build report detail

Add service-specific completeness checks

Add correction request

Add delivery action

Add concern escalation

Build review moderation queue

Add policy-based hide/remove/restore

Preserve report versions

Add moderation audit trail

Output

Report quality review

Report correction flow

Customer report delivery

Review moderation

Acceptance criteria

Submitted report cannot be silently overwritten.

Concern flags reach safety review.

Original sitter statements remain preserved.

Low ratings are not removed without policy reason.

Review aggregates cannot be manually edited.

Moderator decisions contain reason codes.

Customer-visible and internal notes remain separate.

Day 42 — Incident management

Work

Build incident list

Add severity and status

Build incident detail

Add evidence

Add assigned investigator

Add immediate action checklist

Add booking hold

Add sitter/pet restrictions

Add findings and resolution

Add corrective actions

Add close and reopen actions

Add incident notification rules

Output

Incident intake

Safety triage

Investigation workflow

Corrective action tracking

Incident closure

Acceptance criteria

Any authorised user can escalate a safety concern.

Critical incidents appear prominently.

Evidence is private and preserved.

Incident status history cannot be deleted.

Booking and payout holds work.

Only safety admins close critical incidents.

Closure requires corrective-action review.

Reopened incidents preserve previous resolution.

Pet and sitter reassessment can be triggered.

32. Required test matrix

Admin authentication

Non-admin opens /admin

Customer calls admin API

Sitter calls admin API

Suspended admin

Expired admin session

Admin without required permission

Role changed during active session

Sensitive action without re-authentication

Customer and pet management

View authorised customer

View restricted medical information

Edit customer basic information

Attempt silent safety-data overwrite

Request missing pet information

Create service-specific risk assessment

Concurrent pet assessment update

View historical versions

Sitter management

Approve complete application

Approve incomplete application

Reject with reason

Verification expires

Assign unsupported permission

Suspend active sitter

Future bookings after suspension

Download verification evidence without permission

Two admins review simultaneously

Booking management

Assign eligible sitter

Assign unavailable sitter

Assign suspended sitter

Assign sitter with schedule conflict

Two admins assign simultaneously

Replace sitter

Cancel paid booking

Decline request

Move booking through invalid transition

Assign sitter without required risk permission

Payments and refunds

Captured payment

Failed payment

Provider/internal mismatch

Duplicate webhook

Missing payment

Full refund

Partial refund

Refund more than remaining amount

Duplicate refund request

Refund failed

Unauthorized refund approval

Payment marked captured manually

Reports and reviews

Deliver complete report

Return incomplete report

Escalate concern

Amend report

Hide review containing personal data

Attempt to remove valid negative review

Restore review

Recalculate rating

Incidents

Create low-severity incident

Create critical incident

Escalate severity

Reduce severity without permission

Add evidence

Access evidence without safety permission

Place booking on hold

Hold sitter payout

Suspend sitter

Trigger pet reassessment

Resolve without corrective action

Close incident

Reopen incident

Audit and privacy

Audit event created

Before/after state captured safely

Password or token excluded

Medical details excluded from logs

Export attempt recorded

Audit record modification rejected

Read-only analyst attempts mutation

33. What should not be built in Week 6

Avoid expanding this sprint into:

AI sitter approval

AI incident resolution

Automatic pet risk decisions

Automatic refund approval

Full fraud-detection engine

Insurance claims system

Legal case-management platform

Complex workforce scheduling

Automated disciplinary decisions

Unrestricted bulk data exports

Editable provider-payment states

One universal super-admin dashboard

AI may later help summarise notes or identify missing fields, but it should not independently approve sitters, resolve incidents, alter risk classifications or issue refunds.

34. Week 6 deliverables

Functional deliverables

Secure admin dashboard

Role-aware navigation

Customer management

Pet Profile management

Sitter application review

Sitter verification

Sitter approval and suspension

Booking review

Sitter assignment

Replacement workflow

Payment tracking

Payment reconciliation

Refund workflow

Report Card quality control

Review moderation

Incident intake and investigation

Corrective-action tracking

Audit history

Technical deliverables

Role and permission models

Permission middleware/helpers

Admin route protection

Admin work queues

Audit-log infrastructure

Transactional assignment

Optimistic concurrency controls

Payment reconciliation service

Refund state machine

Report versioning

Review moderation records

Incident state machine

Evidence access rules

Automated tests

Documentation deliverables

Admin-role matrix

Permission matrix

Sitter-verification checklist

Booking-assignment procedure

Payment-reconciliation procedure

Refund-approval procedure

Report-review checklist

Review-moderation policy

Incident severity guide

Incident-response checklist

Audit-log specification

Privacy-access policy

Test report

35. Definition of Done

Week 6 is complete only when the following conditions are satisfied.

Access control

Admin authentication is separate and protected.

Permissions are granular.

Access is denied by default.

Every mutation checks authorization server-side.

Sensitive modules require elevated roles.

Shared admin accounts are prohibited.

Privilege changes invalidate old access where necessary.

Customer and Pet Profiles

Customer and pet records are searchable.

Sensitive information is role-restricted.

Safety-critical changes are versioned.

Pet risk is service-specific.

Admin information requests are trackable.

Historical booking snapshots remain unchanged.

Sitter verification

Applications follow a controlled lifecycle.

Required checks are structured.

Approval reasons and evidence are recorded.

Service permissions are granular.

Expired verification affects eligibility.

Suspension protects future bookings.

Historical sitter data remains available.

Booking operations

Requests can be reviewed.

Eligible sitters can be identified.

Only one active primary sitter exists.

Assignment is concurrency-safe.

Replacement and cancellation workflows function.

Booking state history is complete.

Invalid transitions are rejected.

Finance

Provider and internal states remain separate.

Captured payments can be reconciled.

Refunds require valid captured payments.

Partial refunds are supported.

Duplicate refunds are prevented.

High-impact finance actions require approval.

All finance changes are audited.

Quality management

Reports can be reviewed and returned.

Material report edits are versioned.

Concerns escalate to safety.

Reviews are moderated by policy.

Ratings cannot be manually manipulated.

Original content remains preserved.

Incident safety

Incidents have severity and status.

Critical incidents are immediately visible.

Evidence remains private.

Booking and payout holds work.

Corrective actions are tracked.

Closure requires authorised approval.

Closed incidents can be reopened.

Pet and sitter reassessments can be initiated.

Audit and privacy

Sensitive actions create audit records.

Audit records include actor, reason and timestamp.

Logs exclude passwords, tokens and sensitive evidence.

Personal information is masked where possible.

Export access is controlled.

Sensitive evidence access is traceable.

Retention and deletion states are supported.

Final Week 6 operating principle

The Admin Dashboard must provide operational control without creating unrestricted internal access. Each administrator receives only the permissions required for their responsibility. Every approval, assignment, payment action, moderation decision and incident resolution must follow a controlled state transition, require a reason and create an immutable audit trail.

Simple explanation for professor

“During Week 6, I will develop the PetSaathi Admin Dashboard. This dashboard will give authorised team members control over customers, pets, sitters, bookings, payments, reports, reviews and incidents.

The system will not use one unrestricted admin account. Different roles will be created for operations, sitter verification, finance, safety, customer support and report quality. For example, an operations administrator can assign a sitter, but they cannot approve a refund or close a serious safety incident.

The admin team can review customer and pet information, request missing details and view service-specific pet-risk assessments. The sitter-verification team can check documents, training and service permissions before activating a sitter.

For bookings, the operations team can review requests, find eligible sitters and assign one primary sitter. The system will prevent two administrators from assigning different primary sitters at the same time.

The finance panel will show internal and Razorpay payment statuses separately. Finance administrators can reconcile payments and process controlled refunds, but they cannot manually mark an unverified payment as successful.

The report-quality team can review Pet Report Cards, request corrections and escalate safety concerns. Customer reviews can be moderated only when they violate a defined policy; administrators cannot remove a review simply because it is negative.

The incident module will record safety events such as injuries, bites, escapes, medical emergencies, no-shows or property damage. Each incident will have a severity, investigator, evidence, actions, resolution and corrective measures.

Finally, every important administrator action will be recorded in an audit log containing the administrator, action, reason and timestamp. This makes the Week 6 dashboard secure, accountable and suitable for future production operations.”

PetSaathi Phase 4 — Week 7

Notifications, QA and Security Hardening 🔐🐾

Executive decision

Week 7 converts PetSaathi from a collection of working features into an MVP that can safely support controlled real-world bookings.

The complete Week 7 objective is:

Deliver important booking updates reliably, enforce permissions at every backend boundary, validate all untrusted data, handle failures without corrupting bookings or payments, monitor production errors, test the complete platform and validate it with real users.

A visually working interface is not sufficient. The MVP must behave correctly when:

A notification provider is unavailable

A user changes an ID in the URL

Razorpay sends a duplicate webhook

A sitter submits the same Report Card twice

The network disconnects during booking

An invalid file is uploaded

Two admins assign sitters simultaneously

A database request fails

A customer closes the browser after payment

An unauthorised user calls an API directly

Next.js Server Functions remain directly callable through HTTP requests, so authentication and authorization must be verified inside every server-side action—not only through protected layouts or hidden buttons.

1. Week 7 final scope

Goal

Make the PetSaathi MVP stable enough for controlled pilot bookings by completing:

WhatsApp and email notifications

Role-based access control

Server-side input validation

Consistent error handling

Sentry monitoring and error tracking

Full quality-assurance testing

User acceptance testing

Critical bug resolution

Pilot-release readiness checks

End-to-end reliability flow

Business event occurs

↓

Database transaction completes

↓

Notification event added to outbox

↓

Background worker sends WhatsApp/email

↓

Provider response recorded

↓

Delivery webhook updates status

↓

Failure retried safely

↓

Permanent failure escalated

At the same time:

Request reaches PetSaathi

↓

Authenticate user

↓

Check role, ownership and resource scope

↓

Validate and normalise input

↓

Confirm current workflow state

↓

Execute transaction

↓

Return safe result

↓

Record audit/monitoring event

2. Week 7 launch principle

Use the following production rule:

No critical booking operation should depend on the successful delivery of an email or WhatsApp message.

For example:

A successful payment must remain successful even if the confirmation email fails.

A booking assignment must remain saved even if WhatsApp is temporarily unavailable.

A Report Card must remain submitted even if the customer notification fails.

Notifications are important side effects, but they must not control the integrity of the main transaction.

3. Notification module architecture

Recommended channels

P0 — Week 7

WhatsApp Business Platform Cloud API

Transactional email

In-app notification centre

Admin operational alerts

P1 — Later

SMS fallback

Mobile push notifications

Browser push notifications

Automated voice calls for critical cases

Meta’s WhatsApp Cloud API uses the Graph API for sending messages and webhooks for receiving messages and delivery-status updates.

For email, a service such as Resend can be integrated through a Next.js server route using a private API key and a verified sending domain. The provider should remain replaceable behind an internal notification interface.

4. Transactional versus marketing notifications

Do not combine operational messages and promotional messages.

Transactional notifications

These are directly related to an account, booking or service:

ACCOUNT_CREATED

BOOKING_REQUESTED

BOOKING_UNDER_REVIEW

SITTER_ASSIGNED

PAYMENT_REQUIRED

PAYMENT_CAPTURED

BOOKING_CONFIRMED

SERVICE_REMINDER

SERVICE_STARTED

SERVICE_COMPLETED

REPORT_DELIVERED

BOOKING_CANCELLED

REFUND_PROCESSING

REFUND_PROCESSED

INCIDENT_UPDATE

Marketing notifications

Examples:

FESTIVAL_DISCOUNT

NEW_SERVICE_LAUNCH

REFERRAL_OFFER

MONTHLY_PROMOTION

Marketing consent must remain separate and optional.

A customer must not lose essential booking notifications merely because they declined marketing communication.

5. WhatsApp notification rules

Utility templates

Booking updates such as confirmations, reminders, cancellations and refund information should normally use approved utility-message templates.

WhatsApp templates are required for messages sent outside an active customer-service window. Meta categorises utility templates as messages commonly connected to a customer action or request.

Example template:

Hello {{customer_name}},

Your PetSaathi booking {{booking_code}} for {{pet_name}} has been confirmed.

Service: {{service_name}}

Date: {{service_date}}

Time: {{service_time}}

Sitter: {{sitter_name}}

View booking: {{booking_link}}

Do not include unnecessary sensitive data

Avoid sending through WhatsApp:

Full home address

Pet medical history

Emergency-contact details

Bite-history descriptions

Internal risk classifications

Payment-provider identifiers

Verification documents

Administrative notes

Use a secure booking link for details.

Delivery tracking

WhatsApp webhooks can report message delivery states such as messages being sent, delivered or read. PetSaathi should store those states independently from the booking state.

6. Email notification rules

Email should serve as:

A booking receipt

A payment confirmation

A cancellation record

A refund update

A detailed Report Card notification

A fallback when WhatsApp delivery fails

A security notification for account changes

Email requirements

Each transactional email should contain:

Brand identity

Clear subject

Recipient context

Booking reference

Required action

Secure application link

Support information

Privacy-safe content

Plain-text fallback

Example subject:

PetSaathi booking BK-1001 is confirmed

Email security

Keep the provider API key server-side.

Use a verified sending domain.

Configure SPF, DKIM and DMARC through the chosen provider.

Do not put access tokens in ordinary query strings.

Use short-lived signed links for sensitive actions.

Do not attach private pet media directly when a secure dashboard link is sufficient.

7. Notification preferences

Recommended customer settings:

Booking updates: Required

Payment updates: Required

Service reminders: Required

Safety alerts: Required

Report Card updates: Required

Marketing email: Optional

Marketing WhatsApp: Optional

Sitter settings:

Booking offers: Required

Assignment changes: Required

Service reminders: Required

Report reminders: Required

Payout updates: Required

Marketing/training updates: Optional

Critical operational notifications should not be disabled while the customer or sitter has an active booking.

8. Notification outbox

Do not call Meta or the email provider from inside the main booking transaction.

notification_outbox

id

event_type

resource_type

resource_id

recipient_user_id

channel

template_code

template_version

payload

priority

status

attempt_count

maximum_attempts

next_attempt_at

deduplication_key

created_at

processed_at

Notification statuses

PENDING

PROCESSING

SENT

DELIVERED

READ

FAILED_RETRYABLE

FAILED_PERMANENT

CANCELLED

Worker flow

Select pending notifications

↓

Lock selected jobs

↓

Confirm event is still relevant

↓

Render approved template

↓

Send to provider

↓

Record provider message ID

↓

Update SENT status

↓

Webhook later updates DELIVERED/READ/FAILED

Deduplication example

Deduplication key:

BOOKING_CONFIRMED:BK-1001:CUSTOMER:C-001:WHATSAPP

The same event must not send the same confirmation multiple times because of worker retry or duplicate processing.

9. Notification retries

Use exponential or staged retry intervals.

Example:

Attempt 1: Immediately

Attempt 2: After 1 minute

Attempt 3: After 5 minutes

Attempt 4: After 30 minutes

Attempt 5: After 2 hours

Do not repeatedly retry permanent failures such as:

Invalid email address

Invalid phone number

Recipient opted out where opt-out is permitted

Rejected WhatsApp template

Deleted provider account

Unsupported destination

Retry temporary failures such as:

Provider timeout

Rate limit

Temporary network failure

Provider server error

Channel fallback

Example:

WhatsApp failed permanently

↓

Send transactional email

↓

Create in-app alert

↓

For urgent service event:

notify operations admin

10. Notification table design

notifications

id

recipient_user_id

event_type

title

message

action_url

read_at

created_at

notification_deliveries

id

notification_id

channel

provider

provider_message_id

status

attempt_count

failure_code

failure_description

sent_at

delivered_at

read_at

failed_at

created_at

updated_at

notification_templates

id

template_code

channel

language

version

provider_template_name

subject

body

status

created_at

approved_at

Template statuses:

DRAFT

UNDER_REVIEW

ACTIVE

REJECTED

RETIRED

11. Role-based access control

Week 7 must verify and centralise the permissions created across Weeks 3–6.

Main roles

CUSTOMER

SITTER

CUSTOMER_SUPPORT

OPERATIONS_ADMIN

SITTER_VERIFICATION_ADMIN

REPORT_REVIEWER

REVIEW_MODERATOR

SAFETY_ADMIN

FINANCE_ADMIN

SUPER_ADMIN

Access decision

Every protected request should evaluate:

Is the user authenticated?

↓

Is the account active?

↓

Does the user have the required permission?

↓

Does the user own or have an assignment to this resource?

↓

Is the resource in the user’s permitted city/team scope?

↓

Is the action valid for the current state?

OWASP recommends deny-by-default access control, least privilege and authorization checks on every request.

12. Role is not enough

A user’s role alone does not determine access.

Example:

Role: CUSTOMER

Booking owner: C-001

Requested booking owner: C-009

Result: DENIED

Role: SITTER

Assigned sitter: ST-004

Authenticated sitter: ST-011

Result: DENIED

Role: FINANCE_ADMIN

Requested action: View full pet medical record

Result: DENIED

Access control must combine:

Role

Permission

Ownership

Assignment

City or operational scope

Current resource state

Temporary restrictions

13. Recommended permission helper

Conceptual server-side function:

type AuthorisationInput = {

userId: string;

permission: string;

resourceType?: string;

resourceId?: string;

};

async function requirePermission(input: AuthorisationInput) {

const session = await requireActiveSession(input.userId);

const allowed = await permissionService.check({

userId: session.userId,

permission: input.permission,

resourceType: input.resourceType,

resourceId: input.resourceId,

});

if (!allowed) {

throw new ForbiddenError();

}

return session;

}

Use the same permission service in:

Server Actions

Route Handlers

Background workers

Admin tools

File-access endpoints

WebSocket or real-time handlers

Protected navigation is useful for UX but must not be the only control.

14. Required Week 7 permission tests

Customer isolation

Customer views own pet

Customer requests another customer’s pet

Customer views own booking

Customer changes booking ID in URL

Customer attempts refund approval

Customer accesses sitter earnings

Sitter isolation

Sitter views assigned booking

Sitter views another sitter’s booking

Sitter starts removed assignment

Sitter submits another sitter’s report

Sitter accesses another sitter’s earnings

Suspended sitter accepts an offer

Admin separation

Support agent attempts refund

Finance admin attempts pet-risk decision

Operations admin attempts sitter-document approval

Report reviewer attempts incident closure

Safety admin attempts role assignment

Read-only analyst attempts mutation

15. Input validation strategy

Every external value must be treated as untrusted, including:

Form submissions

API request bodies

URL parameters

Query strings

Cookies

Session data

File metadata

WhatsApp webhooks

Razorpay webhooks

Email-provider webhooks

Admin-entered notes

OWASP recommends validating input as early as possible, using allowlists and applying both syntactic and semantic validation.

Validation layers

Layer 1 — Client validation

Purpose:

Fast user feedback

Required-field indicators

Date and range feedback

Character limits

File-size warnings

Layer 2 — Server schema validation

Purpose:

Security

Authoritative data validation

Enum restrictions

Length and format controls

Relationship validation

Layer 3 — Business-rule validation

Examples:

Booking date is still available

Pet belongs to customer

Sitter is eligible

Payment amount matches

Booking may transition to requested state

Refund does not exceed captured balance

Layer 4 — Database constraints

Examples:

UNIQUE email

UNIQUE provider_payment_id

FOREIGN KEY booking_id

CHECK amount >= 0

CHECK end_at > start_at

CHECK duration_minutes > 0

16. Validation rules by module

Authentication

Normalise email addresses consistently.

Validate phone numbers in a stored international format.

Enforce password rules.

Rate-limit login and reset requests.

Reject expired reset tokens.

Pet Profiles

Birth date cannot be in the future.

Weight must be positive.

Medication requires dose and timing.

Bite history requires details.

Vaccination records require valid dates.

File uploads require approved type and size.

Bookings

Pet belongs to customer.

Service is enabled in selected area.

Date is not in the past.

Duration is permitted for service.

Server recalculates price.

Booking instructions have maximum length.

Address contains required fields.

Payments

Amount comes from database.

Currency matches booking.

Provider order ID matches stored record.

Signature is verified.

Duplicate provider payment ID is rejected.

Report Cards

Assigned sitter owns report.

Booking is completed.

Required fields match service.

Concern details are required when concern is true.

Submitted report cannot be overwritten.

Admin actions

Reason codes come from allowlisted values.

Notes have length limits.

Resource state supports the action.

Elevated permission exists.

Re-authentication is performed where required.

17. Normalisation

Validation and normalisation are different.

Examples:

Email:

" PRINCE@EXAMPLE.COM "

→ "prince@example.com"

Phone:

"72019 63486"

→ normalised stored format

Pet name:

" Bruno "

→ "Bruno"

Do not normalise passwords by trimming or changing characters.

Do not automatically “correct” customer safety information.

18. Request limits

Apply size and rate restrictions.

Examples:

JSON body: configured maximum

Profile note: 2,000 characters

Booking note: 1,000 characters

Admin note: 5,000 characters

Image: configured MB limit

Video: configured MB limit

Login attempts: rate-limited

Payment-order creation: rate-limited

Password reset: rate-limited

OWASP recommends rejecting oversized API requests and monitoring repeated validation failures because they may indicate abuse.

19. Error-handling architecture

Separate errors into three categories.

Category 1 — Expected business errors

Examples:

BOOKING_NOT_AVAILABLE

PAYMENT_ALREADY_CAPTURED

SITTER_OFFER_EXPIRED

PET_PROFILE_INCOMPLETE

INVALID_STATUS_TRANSITION

REFUND_AMOUNT_TOO_HIGH

These should return a clear and safe result.

Current Next.js guidance recommends modelling expected Server Function errors as returned values rather than treating them as unhandled exceptions.

Category 2 — Validation and authorization errors

Examples:

VALIDATION_FAILED

UNAUTHENTICATED

FORBIDDEN

RESOURCE_NOT_FOUND

RATE_LIMITED

These must not expose internal implementation details.

Category 3 — Unexpected system errors

Examples:

Database unavailable

Unexpected provider response

Storage failure

Programming exception

Infrastructure failure

These should:

Generate an internal error ID.

Be reported to Sentry.

Return a generic user-safe message.

Preserve completed transactions.

Trigger alerting when severity requires it.

20. Standard error response

Example API error:

{

"error": {

"code": "PET_PROFILE_INCOMPLETE",

"message": "Complete the required pet information before requesting this service.",

"requestId": "req_7fa93c"

}

}

Unexpected error:

{

"error": {

"code": "INTERNAL_ERROR",

"message": "We could not complete this action. Please try again.",

"requestId": "req_b96d20"

}

}

Do not return:

Stack traces

SQL queries

Table names

Environment variables

Provider secrets

File-system paths

Internal service URLs

Session tokens

21. User-facing recovery

Every error screen should answer:

What happened?

Was the operation completed?

Is it safe to retry?

What should the user do next?

How can support identify the issue?

Payment example

Bad:

Something went wrong.

Better:

We have not confirmed this payment yet. Do not make another payment. We are checking the transaction automatically. Reference: req_b96d20.

Booking example

This sitter offer has expired. The booking remains active, and PetSaathi will continue searching for another eligible sitter.

Report example

The report was already submitted. Your saved report has not been duplicated.

22. Idempotent recovery

Critical operations must be safe to repeat:

Create booking

Create payment order

Verify payment

Process webhook

Accept sitter offer

Start service

Complete service

Submit Report Card

Send notification

Request refund

A network retry must not create:

Two bookings

Two payments

Two sitter assignments

Two Report Cards

Two refunds

Multiple confirmation messages

Use:

Idempotency keys

Unique database constraints

Current-state guards

Transactions

Request IDs

Deduplication keys

Version checks

23. Error boundaries and pages

Recommended Next.js files:

app/error.tsx

app/global-error.tsx

app/not-found.tsx

app/customer/error.tsx

app/sitter/error.tsx

app/admin/error.tsx

Next.js recommends custom production handling for expected errors, uncaught exceptions and not-found states.

Each boundary should:

Show a safe message

Offer a valid retry where appropriate

Preserve navigation

Display a reference ID

Avoid leaking error details

Log the unexpected error

24. Sentry implementation

Sentry should be used for:

Uncaught frontend errors

Server-side exceptions

API failures

Route Handler failures

Background-worker failures

Performance traces

Release comparison

Error alerts

Selected user feedback

Sentry provides dedicated Next.js setup guidance for capturing errors, logs and traces, including source-map integration for production debugging.

Recommended environments

development

test

staging

production

Do not mix staging and production events.

Recommended Sentry tags

environment

release

module

route

user_role

booking_status

payment_status

service_type

error_category

Safe context

booking_public_code

payment_attempt_public_code

notification_event_type

request_id

Do not send

Passwords

Session tokens

API keys

Full addresses

Full phone numbers

Pet medical notes

Emergency contacts

Verification documents

Payment-card data

Razorpay secrets

Private media URLs

Sentry documents client-side and server-side data-scrubbing options and recommends controlling which sensitive data reaches the monitoring platform.

25. Session Replay caution

Session Replay can help diagnose difficult UI failures, but PetSaathi contains sensitive customer, pet, medical and address data.

For the MVP:

Disable replay initially, or

Enable only after privacy review

Mask text and form inputs

Block pet photos and private media

Exclude admin verification screens

Exclude payment pages

Use low sampling

Verify that canvas or custom-rendered content does not expose data

Sentry specifically warns that privacy and personally identifiable information require careful consideration when enabling Session Replay.

26. Alerting strategy

Critical alerts

Notify the technical team immediately for:

Payment captured but booking not confirmed

Duplicate successful payments

Refund-processing failure

Booking status corruption

Customer accesses another customer’s record

Sitter accesses unassigned booking

Admin permission bypass

Database unavailable

WhatsApp/email queue stopped

Critical incident notification failure

Warning alerts

Increasing login failures

High notification failure rate

Slow booking creation

Report uploads failing

Payment reconciliation queue growing

Webhook processing delay

Low-priority monitoring

Single form-validation failure

User closes Checkout

Individual declined sitter offer

Temporary image-upload retry

Avoid alert fatigue. Not every user mistake should wake the technical team.

27. Application logging

Application logs and Sentry serve related but different purposes.

Log

Authentication success/failure categories

Authorization denial

Booking transitions

Payment and webhook processing

Notification attempts

Report submission

Incident escalation

Admin mutations

Worker failures

Do not log

Passwords

Tokens

Secret keys

Complete session IDs

Full medical information

Full addresses

Full emergency contacts

Private file contents

Payment-card details

OWASP recommends application-level security logging because infrastructure logs alone do not contain the necessary business and security context.

28. QA strategy

Testing should use multiple layers.

Static checks

↓

Unit tests

↓

Integration tests

↓

API and authorization tests

↓

End-to-end tests

↓

Security tests

↓

Cross-browser/mobile tests

↓

User acceptance testing

Static quality checks

TypeScript strict checks

ESLint

Formatting checks

Dependency audit

Database migration checks

Environment-variable validation

Build verification

Unit tests

Test individual business rules:

Price calculation

Booking transitions

Notification template rendering

Permission decisions

Validation schemas

Earnings calculations

Refund limits

Risk controls

Integration tests

Test combinations:

API and database

Booking and pricing

Payment and booking confirmation

Assignment and availability

Report and earnings eligibility

Notification outbox and delivery status

End-to-end tests

Test complete user journeys in a real browser.

Playwright uses isolated browser contexts, which helps keep tests reproducible and prevents authentication or state from leaking between users.

29. Critical end-to-end journeys

Customer journey

Signup

→ Login

→ Create pet

→ Complete Pet Profile

→ Request booking

→ Review price

→ Pay

→ View confirmed booking

→ Receive notifications

→ View Report Card

→ Submit review

Sitter journey

Login

→ View offer

→ Accept

→ Receive assignment

→ View pet instructions

→ Start service

→ Upload update

→ Complete service

→ Submit Report Card

→ View pending earnings

Admin journey

Login

→ Review booking

→ Assign sitter

→ Track payment

→ Review report

→ Moderate review

→ Create and resolve incident

Exception journey

Payment succeeds

→ Browser closes

→ Webhook arrives

→ Booking confirms

→ Notification is sent

Sitter cancels

→ Replacement required

→ New sitter assigned

→ Customer informed

Concern reported

→ Incident created

→ Booking held

→ Evidence reviewed

→ Resolution recorded

30. Browser and device coverage

Minimum pilot coverage:

Desktop

Chrome

Firefox

Safari/WebKit

Edge

Mobile

Android Chrome

iPhone Safari

Small-screen responsive layout

Slow-network simulation

Important mobile tests

Multi-step Pet Profile

Booking date/time selection

Razorpay Checkout

Sitter start-service control

Media upload from camera

Report Card submission

Admin emergency view

31. Playwright debugging

Configure Playwright to preserve evidence when tests fail:

Screenshot on failure

Trace on first retry

Video for selected critical flows

Network and console diagnostics

HTML test report

Playwright Trace Viewer records browser actions, DOM snapshots, console messages and network requests, making it useful for investigating failures in CI.

Do not use retries to hide unstable tests. A test that passes only after repeated retries must still be investigated.

32. Security test checklist

Authentication

Weak password rejected

Invalid reset token rejected

Expired session rejected

Suspended account blocked

Login throttling works

Session invalidated after password change

Authorization

Cross-customer access rejected

Cross-sitter access rejected

Admin separation works

Direct API calls checked

Hidden-button bypass fails

Modified URL ID fails

File-access link respects ownership

Input attacks

Script in customer note

SQL-like payload in search

Oversized JSON request

Invalid enum values

Negative price

Future and past date abuse

Malformed webhook

Forged provider signature

Unsupported file type

Double file extension

Workflow attacks

Customer confirms own payment

Sitter starts cancelled booking

Admin performs invalid transition

Duplicate refund requested

Two primary sitters assigned

Report submitted before service completion

Booking paid after expiry

33. Performance and resilience tests

Performance checks

Measure:

Dashboard load time

Booking estimate response

Booking creation

Payment-status refresh

Admin-list filtering

Media upload

Report submission

Notification queue delay

Resilience tests

Temporarily simulate:

WhatsApp API unavailable

Email provider unavailable

Razorpay timeout

Object storage timeout

Database transaction failure

Duplicate webhook

Delayed webhook

Worker restart

Browser network interruption

Expected result:

Core records remain consistent, retryable work remains queued and the user receives an accurate state.

34. Accessibility QA

Check:

Keyboard navigation

Visible focus indicators

Semantic labels

Error association with fields

Contrast

Screen-reader status announcements

Touch-target size

Form step clarity

Meaningful button text

Avoiding colour-only status communication

Examples:

Do not show only:

Yellow badge

Also show:

Additional controls required

Do not use:

Click here

Use:

View booking BK-1001

35. Bug-management workflow

Severity levels

Severity 0 — Launch blocker

Security breach

Payment corruption

Data loss

Cross-user access

Booking cannot complete

Critical incident alert failure

Severity 1 — Critical

Major booking path broken

Payment verification unreliable

Sitter cannot start service

Report cannot be submitted

Incorrect admin permission

Severity 2 — Major

Important feature has workaround

Notification missing

Mobile flow partially broken

Incorrect validation message

Severity 3 — Minor

Layout problem

Copy issue

Non-critical visual inconsistency

Small performance issue

Bug lifecycle

NEW

TRIAGED

IN_PROGRESS

READY_FOR_RETEST

VERIFIED

CLOSED

REOPENED

DEFERRED

Every bug should contain:

Reproduction steps

Expected behaviour

Actual behaviour

Environment

Role

Screenshot or trace

Request ID

Severity

Owner

Fix version

Retest result

36. User Acceptance Testing

UAT determines whether PetSaathi works for actual operational users, not merely whether the code passes automated tests.

Recommended pilot participants

3–5 pet parents

2–4 approved test sitters

1 operations administrator

1 safety administrator

1 finance or payment tester

Project mentor or professor observer

Use test bookings or tightly controlled pilot bookings.

UAT environments

Preferred:

Staging environment

Razorpay test mode

Test WhatsApp recipients

Test email addresses

Private test media

Synthetic emergency information

Do not expose real private data unnecessarily.

37. UAT scenarios

Pet parent scenarios

Create account.

Create a pet.

Save an incomplete draft.

Complete pet information.

Request dog walking.

View estimated price.

Complete test payment.

Receive confirmation.

Track booking status.

View Report Card.

Submit review.

Sitter scenarios

Log in.

Review offer.

Accept or decline.

View assigned booking.

Read pet instructions.

Start service.

Upload photograph.

Complete service.

Submit Report Card.

View earning status.

Admin scenarios

Review customer and pet.

Approve sitter.

Review booking.

Assign sitter.

Track payment.

Review Report Card.

Moderate policy-violating review.

Create an incident.

Apply corrective action.

Close incident with audit history.

38. UAT feedback questions

Ask test users:

Customers

Was booking easy to understand?

Did you know whether the booking was requested or confirmed?

Did the price breakdown make sense?

Did notifications arrive at the correct time?

Did you understand the Report Card?

Did any screen feel unsafe or confusing?

Sitters

Did the offer contain enough information?

Was any information shown too early?

Were pet instructions easy to find?

Was starting and completing service clear?

Was media upload reliable?

Was the earnings status understandable?

Administrators

Could you identify urgent work quickly?

Were permissions appropriate?

Could you understand payment and booking states separately?

Did incident escalation feel safe?

Was the audit trail sufficient?

39. UAT acceptance record

Each scenario should record:

Test case ID

Participant role

Environment

Starting conditions

Steps

Expected result

Actual result

Pass/fail

Comments

Issue IDs

Sign-off status

Sign-off states

APPROVED

APPROVED_WITH_MINOR_ISSUES

REQUIRES_FIXES

REJECTED

Do not consider informal verbal feedback sufficient for launch approval.

40. Pilot launch gates

The MVP should not accept pilot bookings until:

Security

No known cross-user access issue

No critical authorization defect

Secrets are outside source control

Webhook signatures are verified

File uploads are private

Admin roles are tested

Booking and payment

Booking creation is idempotent

Server calculates prices

Payment capture is verified

Duplicate webhooks are safe

Browser closure after payment is handled

Refund path is tested

Operations

Eligible sitter can be assigned

Sitter can start and complete service

Report Card can be submitted

Incident can be created

Admin can place booking on hold

Notifications

Booking confirmation delivered

Failed notification is retried

Delivery statuses are recorded

Critical fallback exists

Duplicate notifications are prevented

Monitoring

Sentry receives test error

Source maps work

Critical alerts reach team

Logs contain request IDs

Sensitive information is scrubbed

QA

All Severity 0 issues closed

All Severity 1 issues closed

Major user journeys pass

UAT is signed off

Rollback procedure exists

41. Day-by-day execution plan

Day 43 — WhatsApp and email notifications

Work

Configure WhatsApp Cloud API

Configure email provider

Create notification templates

Build notification outbox

Build worker

Build retry policy

Add delivery webhooks

Add in-app notifications

Add customer and sitter preferences

Add channel fallback

Test duplicate prevention

Output

WhatsApp booking updates

Email booking updates

Delivery tracking

Retryable notification queue

Acceptance criteria

Notification failure does not roll back booking.

Each event is deduplicated.

Provider IDs are stored.

Delivery status updates through webhook.

Required messages ignore marketing preference.

Sensitive data is excluded.

Permanent failures use fallback or escalation.

Provider secrets remain server-side.

Day 44 — Role-based access control

Work

Centralise permission definitions

Add server-side permission helper

Apply role checks to all actions

Add ownership and assignment checks

Apply admin scopes

Review private media access

Add forbidden responses

Add authorization logging

Create permission test suite

Remove insecure route-only assumptions

Output

Central RBAC service

Resource ownership checks

Admin permission separation

Secure media access

Acceptance criteria

Every mutation validates authorization.

Direct API access is protected.

Customer cannot access another customer.

Sitter cannot access unassigned booking.

Finance and safety duties remain separate.

Denied requests are logged safely.

Suspended accounts are blocked.

Day 45 — Input validation and data protection

Work

Centralise validation schemas

Add server validation to every mutation

Add URL and query validation

Add request-size limits

Add rate limits

Validate provider webhooks

Review file-upload validation

Add database constraints

Add output sanitisation

Review logs for sensitive data

Output

Validated API boundaries

Protected forms

Request limits

Database integrity

Acceptance criteria

Client validation is never the only validation.

Invalid enums are rejected.

Oversized requests are rejected.

Browser-supplied prices are ignored.

Forged webhooks fail.

Unsafe files fail.

Sensitive fields are absent from logs.

Validation errors are understandable.

Day 46 — Error handling

Work

Define error-code catalogue

Separate expected and unexpected errors

Add request IDs

Add error boundaries

Add safe API responses

Add retryable state handling

Add idempotency guards

Add provider fallback paths

Add transaction rollback tests

Add user recovery messages

Output

Stable failure handling

Safe error messages

Retryable workflows

Error reference IDs

Acceptance criteria

No stack trace reaches users.

Payment ambiguity displays a processing state.

Duplicate operations remain safe.

Completed operations are not lost after notification failure.

Unexpected errors contain request IDs.

Users receive accurate next steps.

Errors reach monitoring.

Day 47 — Sentry and monitoring

Work

Install Sentry for Next.js

Configure client/server/edge monitoring

Add environments and releases

Upload source maps

Add module tags

Configure data scrubbing

Configure alert rules

Add performance monitoring

Test captured exceptions

Document monitoring ownership

Output

Frontend error tracking

Backend error tracking

Performance traces

Critical alerts

Acceptance criteria

Test errors appear in correct environment.

Source-mapped stack traces are readable.

Passwords and tokens are absent.

Pet medical and address data are absent.

Critical payment and access failures alert the team.

Staging events are separate from production.

Alert ownership is defined.

Day 48 — QA testing and bug fixes

Work

Run unit tests

Run integration tests

Run Playwright tests

Test role isolation

Test payment edge cases

Test notification failures

Test mobile browsers

Test accessibility

Test concurrency

Triage defects

Fix launch blockers

Retest resolved bugs

Output

QA checklist

Automated test report

Defect register

Verified bug fixes

Acceptance criteria

Main customer journey passes.

Main sitter journey passes.

Main admin journey passes.

Duplicate webhooks are safe.

Two-sitter assignment conflict is safe.

Cross-user access fails.

Mobile booking works.

Failed tests provide traces.

Severity 0 and Severity 1 issues are resolved.

Day 49 — User Acceptance Testing

Work

Prepare test users

Prepare scenario scripts

Seed realistic pets and bookings

Conduct customer UAT

Conduct sitter UAT

Conduct admin UAT

Record observations

Classify defects

Fix critical UAT issues

Obtain sign-off

Prepare pilot checklist

Output

Real-user test results

UAT sign-off

Final bug list

Pilot readiness decision

Acceptance criteria

Test participants complete core journeys.

Booking state is understandable.

Sitter instructions are usable.

Admin queues support real work.

Notification timing is acceptable.

Critical UAT defects are resolved.

Final approval is recorded.

Known limitations are documented.

42. Recommended Week 7 test suite

Notifications

WhatsApp sent

Email sent

Invalid phone

Invalid email

Duplicate event

Provider timeout

Webhook delivered

Webhook arrives twice

Fallback channel

Marketing opt-out

Required operational notification

Rejected template

Queue worker restart

Permissions

Customer/customer isolation

Sitter/sitter isolation

Customer/admin isolation

Sitter/admin isolation

Admin role separation

Suspended account

Deleted assignment

Expired session

Private-media access

Direct endpoint attack

Validation

Invalid JSON

Oversized body

Unsupported enum

Negative amount

Invalid date

Script payload

Invalid file

Forged webhook

Duplicate provider ID

Long text fields

Invalid public code

Error recovery

Database error

Payment timeout

Email failure

WhatsApp failure

Storage failure

Browser refresh

Browser closes after payment

Worker restarts

Duplicate button click

Concurrent assignment

Report double-submit

Monitoring

Client error

Server error

Worker error

API error

Payment mismatch

Authorization denial

Scrubbed data verification

Alert delivery

Source-map verification

43. Week 7 deliverables

Functional deliverables

WhatsApp transactional notifications

Email transactional notifications

In-app notification centre

Delivery-status tracking

Notification retries

Channel fallback

Central RBAC

Ownership and assignment checks

Server-side validation

Request and rate limits

Safe error handling

Sentry monitoring

Alert configuration

QA checklist

Bug register

UAT report

Pilot sign-off

Technical deliverables

Notification outbox

Notification worker

Notification templates

Provider webhook handlers

Permission service

Validation schemas

Error-code catalogue

Global error boundaries

Request-ID middleware

Sentry configuration

Data-scrubbing configuration

Automated Playwright suite

Security tests

QA evidence

Release checklist

Documentation deliverables

Notification-event matrix

WhatsApp template list

Email template list

Permission matrix

Validation-rule catalogue

Error-code catalogue

Monitoring and alert guide

QA checklist

UAT scripts

Defect report

Pilot operating guide

Incident escalation contacts

Rollback procedure

44. Definition of Done

Week 7 is complete only when the following are true.

Notifications

Notifications originate from business events.

Main transactions do not depend on provider delivery.

Messages are deduplicated.

Failed messages are retried.

Permanent failures are recorded.

Delivery webhooks update status.

Sensitive data is excluded.

Marketing and transactional consent remain separate.

Access control

All protected actions authenticate users.

Server actions enforce permission.

Ownership and assignment checks exist.

Access is denied by default.

Admin permissions are separated.

Suspended users are blocked.

Private media is access-controlled.

Authorization tests pass.

Validation

Every mutation validates on the server.

Request sizes are controlled.

Rates are limited.

Financial values come from the server.

File uploads are validated.

Provider signatures are verified.

Database constraints protect core integrity.

Validation errors are safe and readable.

Error handling

Expected errors use stable codes.

Unexpected errors create reference IDs.

No sensitive implementation details reach users.

Critical operations are idempotent.

Transactions roll back cleanly.

Provider failure does not corrupt records.

Processing states prevent duplicate user actions.

Monitoring

Client and server errors reach Sentry.

Releases and environments are identified.

Source maps are available.

Sensitive data is scrubbed.

Critical alerts are configured.

Monitoring ownership is documented.

A test incident has verified the alert path.

QA and UAT

Customer, sitter and admin flows pass.

Payment edge cases pass.

Notification failures are recoverable.

Cross-role attacks are rejected.

Mobile flows are tested.

Accessibility basics are checked.

Severity 0 and 1 bugs are closed.

UAT sign-off is recorded.

Known limitations are documented.

Final Week 7 operating principle

Reliability is not the absence of errors. Reliability means PetSaathi detects invalid actions, contains failures, preserves correct business records, informs users accurately, alerts the team and provides a safe recovery path.

Simple explanation for professor

“During Week 7, I will make the PetSaathi MVP secure and stable enough for controlled real bookings.

First, I will add WhatsApp and email notifications for important events such as booking requests, sitter assignment, payment confirmation, service reminders, service completion, Report Card delivery, cancellation and refund updates. The notification system will use a queue, so a failed email or WhatsApp message will not damage the booking or payment record. Failed notifications will be retried and their delivery status will be stored.

Next, I will complete role-based access control. Customers will access only their pets and bookings. Sitters will access only their offers and assigned services. Different administrators will receive different permissions for operations, finance, safety and verification. Every permission will be checked on the backend because hiding a button is not sufficient security.

All input will be validated on the server. This includes forms, URL parameters, file uploads, booking amounts and payment webhooks. The frontend will provide quick feedback, but the server and database will remain the final source of truth.

I will then create consistent error handling. Expected problems, such as an expired sitter offer or incomplete Pet Profile, will show clear messages. Unexpected technical errors will generate a reference ID and be sent to Sentry without exposing passwords, addresses or private medical information.

After that, I will perform unit, integration, security and end-to-end testing. The complete customer, sitter and admin journeys will be tested, including payment failures, duplicate webhooks, unauthorised access and notification-provider failures.

Finally, real test users will perform User Acceptance Testing. Their results, bugs and feedback will be recorded, fixed and signed off. At the end of Week 7, PetSaathi will have notifications, secure permissions, protected data, reliable error handling, production monitoring, a QA report and evidence that the MVP is ready for a controlled pilot.”

PetSaathi Phase 4 — Week 8

Launch Preparation and Controlled Soft Launch 🚀🐾

Executive decision

Week 8 converts the tested PetSaathi MVP into a controlled production release.

The release sequence should be:

Public pages become search-ready → analytics and privacy controls are configured → performance is optimised → PWA installation is enabled → policies are reviewed and published → pilot data is imported safely → a release candidate is tested → access is opened gradually to controlled users

The correct launch principle is:

Do not release every feature to every user immediately. Release to one service area, limited users, verified sitters and controlled booking volumes while monitoring payments, assignments, notifications, reports and incidents.

Schedule correction

Your plan contains:

Days 50–56: seven preparation days

Days 57–60: four soft-launch days

Therefore, this is technically an 11-day release phase, not one seven-day week.

Recommended label:

Week 8 — Launch Preparation

Days 50–56

Controlled Soft-Launch Window

Days 57–60

1. Week 8 final scope

Goal

Prepare PetSaathi for a controlled production launch by completing:

Search-engine metadata

Search Console and sitemap setup

GA4 analytics

Microsoft Clarity behaviour analytics

Privacy-aware event tracking

Core Web Vitals optimisation

Installable PWA support

Privacy, Terms and Refund policies

Pilot customer and sitter import

Production release candidate

Controlled cohort launch

Monitoring, rollback and launch-support procedures

End-to-end launch flow

Feature development complete

↓

Security and QA gates passed

↓

Public SEO configuration completed

↓

Analytics configured with privacy controls

↓

Performance budgets passed

↓

PWA manifest and safe caching enabled

↓

Legal policies approved and versioned

↓

Pilot data validated and imported

↓

Production release candidate deployed

↓

Internal smoke test

↓

Small invited cohort enabled

↓

Operational monitoring

↓

Booking limits gradually increased

2. Search-readiness architecture

SEO should apply only to PetSaathi’s public acquisition pages.

Pages that should normally be indexable

/

/services

/services/dog-walking

/services/pet-sitting

/services/pet-boarding

/pricing

/safety

/become-a-sitter

/contact

/faq

/city/ahmedabad

/city/ahmedabad/bopal

/privacy

/terms

/cancellation-refund-policy

Pages that must not be indexed

/customer/**

/sitter/**

/admin/**

/api/**

/payment/**

/reset-password/**

/private-media/**

Private pages require real authentication and authorization. robots.txt and noindex are search-engine controls, not security mechanisms.

3. Next.js metadata implementation

Current Next.js App Router supports:

Static metadata

Dynamic generateMetadata

File-based favicons

Open Graph images

Twitter/social images

robots.ts

sitemap.ts

Web App Manifest files

These APIs are designed for search metadata and link-share previews.

Root metadata

import type { Metadata } from "next";

export const metadata: Metadata = {

metadataBase: new URL("https://petsaathi.in"),

title: {

default: "PetSaathi — Trusted Pet Care Near You",

template: "%s | PetSaathi",

},

description:

"Book verified dog walkers, pet sitters and safe pet boarding with service updates, Pet Report Cards and emergency support.",

applicationName: "PetSaathi",

alternates: {

canonical: "/",

},

openGraph: {

type: "website",

siteName: "PetSaathi",

title: "Trusted pet care, right near your home",

description:

"Book verified dog walkers, pet sitters and boarding services.",

url: "https://petsaathi.in",

images: ["/opengraph-image.jpg"],

},

twitter: {

card: "summary_large_image",

title: "PetSaathi — Trusted Pet Care",

description:

"Verified dog walking, pet sitting and boarding services.",

images: ["/twitter-image.jpg"],

},

robots: {

index: true,

follow: true,

},

};

Service-page metadata

Example:

export const metadata: Metadata = {

title: "Dog Walking in Ahmedabad",

description:

"Book verified dog walkers in Ahmedabad with structured pet instructions, service updates and Pet Report Cards.",

alternates: {

canonical: "/services/dog-walking",

},

};

Dynamic city metadata

export async function generateMetadata({

params,

}: {

params: Promise<{ city: string }>;

}): Promise<Metadata> {

const { city } = await params;

const serviceArea = await getPublicServiceArea(city);

if (!serviceArea?.isPublic) {

return {

title: "Service Area Unavailable",

robots: {

index: false,

follow: false,

},

};

}

return {

title: `Pet Care Services in ${serviceArea.name}`,

description: `Book verified dog walking, pet sitting and boarding services in ${serviceArea.name}.`,

alternates: {

canonical: `/city/${serviceArea.slug}`,

},

};

}

Do not generate hundreds of empty city pages merely for keywords. A city or area page should be indexable only when it contains genuine service availability and useful local information.

4. Required SEO metadata

Each public page should have:

Unique title

Unique meta description

Canonical URL

Open Graph title

Open Graph description

Open Graph image

Social sharing image

Index/follow decision

Structured page heading

Meaningful internal links

Title examples

Dog Walking in Ahmedabad | PetSaathi

Pet Sitting Services in Bopal | PetSaathi

Become a Verified Pet Sitter | PetSaathi

PetSaathi Safety and Verification

Avoid

Home

Service Page

Pet Website

Best Best Best Pet Care India

5. Sitemap and robots configuration

Next.js supports app/sitemap.ts and app/robots.ts. Google uses sitemaps to discover important canonical URLs more efficiently, although sitemap submission is a hint rather than a guarantee of indexing.

app/sitemap.ts

import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

const serviceAreas = await getIndexableServiceAreas();

const staticPages: MetadataRoute.Sitemap = [

{

url: "https://petsaathi.in",

lastModified: new Date(),

changeFrequency: "weekly",

priority: 1,

},

{

url: "https://petsaathi.in/services/dog-walking",

lastModified: new Date(),

changeFrequency: "weekly",

priority: 0.9,

},

{

url: "https://petsaathi.in/services/pet-sitting",

lastModified: new Date(),

changeFrequency: "weekly",

priority: 0.9,

},

{

url: "https://petsaathi.in/services/pet-boarding",

lastModified: new Date(),

changeFrequency: "weekly",

priority: 0.9,

},

];

const cityPages = serviceAreas.map((area) => ({

url: `https://petsaathi.in/city/${area.slug}`,

lastModified: area.updatedAt,

changeFrequency: "weekly" as const,

priority: 0.8,

}));

return [...staticPages, ...cityPages];

}

app/robots.ts

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {

return {

rules: {

userAgent: "*",

allow: "/",

disallow: [

"/customer/",

"/sitter/",

"/admin/",

"/api/",

"/payment/",

"/reset-password/",

"/private-media/",

],

},

sitemap: "https://petsaathi.in/sitemap.xml",

};

}

6. Search Console launch tasks

Before public release:

Verify production domain

Submit sitemap.xml

Test robots.txt

Inspect homepage

Inspect service pages

Inspect city pilot page

Check mobile rendering

Check canonical URLs

Review crawl errors

Request indexing for major launch pages

Google uses the mobile version of pages for mobile-first indexing, so PetSaathi’s public content and structured information must remain complete on mobile rather than being reduced to a simplified placeholder.

7. Structured data

Recommended initial structured data:

Organization

WebSite

BreadcrumbList

LocalBusiness — only where PetSaathi has a genuine local operating presence

Google states that Organization structured data can help it understand and distinguish an organisation, while LocalBusiness markup can describe genuine business information such as location and operating details. Markup should reflect visible, accurate content and must be validated before release.

Do not add

Fake review ratings

Fake sitter counts

Unsupported service locations

Invented office addresses

Aggregate ratings that differ from visible reviews

LocalBusiness markup for cities where PetSaathi has no real presence

8. Analytics architecture

Use two different measurement tools for different purposes.

GA4

Use for:

Acquisition

Page traffic

Funnel measurement

Conversion events

Marketing performance

Device and location trends

Booking conversion analysis

GA4 uses an event-based measurement model across websites and applications.

Microsoft Clarity

Use for:

Heatmaps

Session behaviour

Rage clicks

Dead clicks

Scroll behaviour

UX friction

Form confusion

Clarity is designed to analyse how users interact with a website or application.

Internal product analytics

PetSaathi’s own database should remain the source of truth for:

Number of bookings

Captured payments

Confirmed services

Refunds

Sitter assignments

Reports

Incidents

Earnings

GA4 must not be used as the financial or operational ledger.

9. GA4 setup

Configuration

Create production GA4 property

Set timezone to Asia/Kolkata

Set currency to INR

Create production web stream

Add Google tag

Separate staging and production properties or streams

Disable unwanted advertising features initially

Configure retention

Define internal traffic

Verify events in DebugView

Google’s setup flow requires creating a property and adding the appropriate web or app data stream.

Recommended event plan

Acquisition events

page_view

view_service

select_service

become_sitter_started

generate_lead

Customer funnel

sign_up

login

pet_profile_started

pet_profile_completed

booking_form_started

booking_estimate_viewed

booking_requested

begin_checkout

purchase

Booking operations

booking_confirmed

booking_cancelled

refund

report_viewed

review_submitted

Sitter funnel

sitter_application_started

sitter_application_submitted

booking_offer_viewed

booking_offer_accepted

service_started

service_completed

report_submitted

GA4 provides recommended events for online sales and lead-generation measurement. Using recommended events such as sign_up, generate_lead, begin_checkout, purchase and refund where their documented meanings fit will produce more useful standard reporting.

Purchase example

trackEvent("purchase", {

transaction_id: "BK-1001",

value: 199,

currency: "INR",

items: [

{

item_id: "DOG_WALKING_30",

item_name: "30 Minute Dog Walk",

item_category: "Pet Care Service",

price: 199,

quantity: 1,

},

],

});

Use only public or pseudonymous booking references. Do not send internal database UUIDs unnecessarily.

10. Analytics privacy rules

Google prohibits customers from sending personally identifiable information to Google Analytics. Do not send email addresses, telephone numbers, names or other directly identifiable information in event parameters, URLs or User IDs.

Never send to GA4

Customer name

Email address

Phone number

Full address

Emergency contacts

Pet medical notes

Bite-history descriptions

Medication information

Sitter identity documents

Razorpay payment ID

Private media URL

Admin notes

Safe examples

service_type = DOG_WALKING

city_code = AMD

duration_minutes = 30

booking_status = REQUESTED

pet_count = 1

payment_result = SUCCESS

User ID

When GA4 User-ID is used, use an internal non-identifying random identifier. Google states that User IDs must not contain information a third party could use to identify a person.

11. Microsoft Clarity setup

Recommended use

Install Clarity on:

Homepage

Service pages

Pricing

Become-a-sitter public page

Public booking introduction

Use strict masking or consider disabling recording on:

/customer/profile

/customer/pets/**

/customer/bookings/**

/sitter/**

/admin/**

/payment/**

/incident/**

/private-media/**

Clarity masks sensitive content by default, including form inputs, but masking configuration should still be reviewed carefully. Explicitly masked content is not uploaded to Clarity.

Clarity data protection

Mask:

Customer names

Addresses

Pet names where combined with account information

Medical information

Sitter details

Booking references

Prices if operationally sensitive

Report Card text

Pet media

Admin screens

Clarity’s consent mode can defer cookie access until valid consent is provided.

12. Analytics consent

PetSaathi should show a privacy choice that distinguishes:

Required cookies

Analytics cookies

Marketing cookies

Recommended behaviour:

Required cookies:

Always active for login, security and booking operations

Analytics:

GA4 and Clarity activated according to approved consent configuration

Marketing:

Disabled unless separately accepted

Google advises informing users about stored identifiers and allowing consent to be granted or denied where applicable.

The exact consent implementation should be reviewed against PetSaathi’s operating locations and legal advice.

13. Analytics data quality

Exclude

Developer traffic

Internal administrators

Automated monitoring

Staging environment

Payment-provider callbacks

Health-check endpoints

Test bookings

Naming conventions

Use:

lowercase_snake_case

Example:

booking_requested

pet_profile_completed

report_submitted

Avoid changing event names after launch because it divides reporting history.

Event catalogue

Each event should record:

Event name

Business meaning

Trigger

Allowed parameters

Prohibited parameters

Owner

Environment

Key-event status

Validation method

14. Performance targets

PetSaathi should target Google’s current “good” Core Web Vitals thresholds at the 75th percentile:

LCP: 2.5 seconds or less

INP: 200 milliseconds or less

CLS: 0.1 or less

These respectively measure loading performance, interaction responsiveness and visual stability.

Additional internal targets

Public page initial JavaScript: controlled by route budget

Booking estimate API: under 1 second under normal pilot load

Booking creation: under 2 seconds

Dashboard interactive state: under 3 seconds on pilot mobile network

Payment status refresh: under 2 seconds excluding provider delay

These are product targets rather than universal standards.

15. Performance optimisation plan

Images

Use Next.js image optimisation

Use responsive dimensions

Use WebP or AVIF where appropriate

Define width and height

Compress hero images

Lazy-load below-the-fold images

Do not load private full-resolution pet media in lists

JavaScript

Keep public landing pages primarily server-rendered

Limit client components

Lazy-load Clarity and non-critical analytics

Dynamically load heavy dashboards

Remove unused libraries

Avoid shipping admin code to customer routes

Fonts

Use Next.js font optimisation

Limit font families and weights

Use display: swap

Preload only critical font files

Database

Index common filters

Paginate admin lists

Avoid N+1 queries

Select only required columns

Cache public service configuration

Do not publicly cache private account data

Network

Use CDN delivery for public assets

Enable compression

Add long-lived immutable caching for versioned assets

Use short or no caching for sensitive data

Preconnect only to essential providers

Third-party scripts

Load after essential content where possible:

GA4

Clarity

Support widget

Marketing scripts

Third-party analytics should not delay the booking form or payment button.

16. Performance measurement

Use:

Lighthouse

PageSpeed Insights

Chrome DevTools

Core Web Vitals field data

GA4 technical events

Sentry performance tracing

PageSpeed Insights reports LCP, CLS and INP alongside supporting diagnostic metrics, helping distinguish laboratory issues from real-user experience.

Test separately:

Homepage

Dog-walking page

Signup

Pet Profile

Booking form

Payment page

Customer dashboard

Sitter dashboard

Admin dashboard

17. PWA strategy

The PetSaathi MVP should become installable, but it should not pretend to be a fully offline booking system.

Current Next.js App Router documentation provides manifest support through app/manifest.ts or app/manifest.json, along with service-worker and home-screen installation guidance.

Correct MVP PWA scope

Support

Home-screen installation

Standalone display

Branded splash and icons

Cached public shell

Offline message

Retry after connection returns

Optional push-notification preparation

Do not support offline

Creating a booking

Confirming payment

Starting or completing service

Uploading Report Cards

Changing risk information

Assigning a sitter

Processing a refund

Closing an incident

These operations require authoritative server state.

18. Web App Manifest

app/manifest.ts

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {

return {

name: "PetSaathi — Trusted Pet Care",

short_name: "PetSaathi",

description:

"Book verified pet-care services and receive trusted service updates.",

start_url: "/",

scope: "/",

display: "standalone",

background_color: "#FFF9F0",

theme_color: "#F28C45",

orientation: "portrait-primary",

categories: ["lifestyle", "pets"],

icons: [

{

src: "/icons/icon-192.png",

sizes: "192x192",

type: "image/png",

},

{

src: "/icons/icon-512.png",

sizes: "512x512",

type: "image/png",

},

{

src: "/icons/icon-512-maskable.png",

sizes: "512x512",

type: "image/png",

purpose: "maskable",

},

],

};

}

The manifest should include valid names, icons, start URL, display mode and theme information so supported browsers can offer installation.

19. Service-worker caching policy

Cache safely

Public logo

Public icons

Public CSS and JavaScript bundles

Public service pages

Public safety page

Offline fallback page

Never cache through a broad “cache everything” rule

/api/**

/customer/**

/sitter/**

/admin/**

/payment/**

/private-media/**

/reset-password/**

Webhooks

Signed media URLs

Customer addresses

Medical information

Mutation behaviour while offline

When the device is offline:

Show offline status

Disable payment button

Disable booking submission

Disable service start/completion

Disable report submission

Preserve unsent local form draft only when safe

Require server revalidation after reconnection

Do not present locally queued payment or service actions as successfully completed.

20. PWA installation UX

Show the installation suggestion only after meaningful engagement, such as:

Customer completes a Pet Profile

Customer creates a booking

Sitter receives first assignment

User visits dashboard multiple times

Do not show an aggressive install modal immediately on the homepage.

Recommended message:

Add PetSaathi to your home screen for faster access to bookings and pet-care updates.

21. Legal page set

PetSaathi should not launch with only one generic “Terms and Privacy” page.

Recommended legal and policy documents:

Privacy Notice

Terms of Use

Customer Service Terms

Sitter Agreement

Cancellation and Refund Policy

Cookie and Analytics Notice

Safety and Emergency Notice

Community/Review Policy

Grievance and Contact Information

The Consumer Protection Act, 2019 expressly covers e-commerce involving goods or services over electronic networks and provides measures against unfair trade practices in e-commerce.

All policies should receive qualified Indian legal review before accepting real paid bookings.

22. Privacy Notice

The Privacy Notice should clearly explain:

Who operates PetSaathi

What data is collected

Why each category is collected

How pet information is used

How sitter verification information is used

Who receives booking information

Use of Razorpay

Use of WhatsApp/email providers

Use of GA4 and Clarity

Storage and retention

International service providers

Data-security controls

Correction and deletion requests

Grievance/contact method

Policy-effective date

The final DPDP Rules, 2025 were published on 14 November 2025 with staged commencement. Their notice provisions describe clear and plain-language notices, itemised personal-data descriptions, specified purposes and accessible mechanisms for withdrawal or rights requests. As of July 2026, not all provisions have reached their scheduled commencement dates, but PetSaathi should design for them rather than wait for the final deadline.

Privacy principles

Collect only necessary data

Explain each purpose

Separate service consent from marketing consent

Provide correction mechanisms

Define retention

Restrict access

Do not publish pet or sitter media automatically

Maintain a data-request contact

23. Terms of Use

The Terms should cover:

Platform identity

Account eligibility

Accurate-information obligation

Pet behaviour and health disclosure

Booking-request versus confirmed-booking distinction

Payment obligations

Sitter assignment and replacement

Customer access responsibilities

Prohibited activities

Service limitations

User-generated content

Reviews

Suspension and termination

Intellectual property

Dispute and grievance process

Applicable law and jurisdiction

Do not make claims that PetSaathi cannot operationally fulfil, such as:

Every sitter is completely risk-free

Every service is guaranteed

All emergencies will be resolved

Every booking will always have a backup sitter

24. Cancellation and Refund Policy

The policy must align exactly with backend rules.

It should explain

When a customer may cancel

When a sitter cancellation triggers replacement

When PetSaathi may cancel

Cancellation fees by time window

No-show treatment

Full-refund conditions

Partial-refund conditions

Non-refundable components

Refund-request method

Refund approval process

Provider/bank processing dependency

Dispute and grievance process

Razorpay supports full and partial refunds of captured payments, and actual processing involves provider and banking workflows. The policy should therefore avoid promising an impossible immediate bank credit merely because an internal administrator approved a refund.

Policy example

More than 24 hours before service:

Full or near-full refund according to the displayed policy.

6–24 hours before service:

Partial cancellation fee may apply.

Less than 6 hours:

Higher cancellation fee may apply.

PetSaathi or sitter cancellation without replacement:

Eligible amount refunded according to policy.

Safety-information omission:

Refund decision depends on work already performed and policy.

These windows are business examples and require legal and commercial approval before publication.

25. Policy versioning

Store:

policy_code

version

effective_at

published_at

document_hash

status

User acceptance:

user_id

policy_code

policy_version

accepted_at

acceptance_source

ip_hash

user_agent_summary

Never store only:

terms_accepted = true

That does not identify which Terms the user accepted.

When material terms change:

Publish new version

↓

Display effective date

↓

Request renewed acceptance where required

↓

Keep old version for historical bookings

26. Pilot data migration strategy

Do not import customer and sitter spreadsheets directly into production tables.

Use:

Source files

↓

Staging tables

↓

Validation

↓

Duplicate detection

↓

Transformation

↓

Approval

↓

Transactional import

↓

Reconciliation

PostgreSQL supports CSV import through COPY, while pg_dump can create restorable database backups before migration.

27. Pilot migration source files

Recommended separate templates:

customers.csv

customer_addresses.csv

pets.csv

pet_vaccinations.csv

sitters.csv

sitter_services.csv

sitter_availability.csv

sitter_verifications.csv

Do not put all records into one spreadsheet with repeated customer and pet information.

Required source columns

Customers

source_customer_id

full_name

email

phone

city

area

pincode

consent_source

consent_recorded_at

Pets

source_pet_id

source_customer_id

name

species

breed

birth_date

age_is_estimated

weight_kg

profile_status

Sitters

source_sitter_id

full_name

email

phone

city

area

service_radius_km

application_status

28. Migration safety rules

Identity

Normalise email

Normalise phone

Detect duplicates

Preserve source IDs

Generate new internal UUIDs

Create mapping table

Security

Never import plain-text passwords

Send account-activation or password-reset links

Do not email temporary passwords

Do not mark email or phone verified without actual verification

Sitter verification

Do not import VERIFIED merely because a spreadsheet says “yes”

Link evidence

Record reviewer

Record date

Record expiry

Flag missing evidence

Pet safety information

Preserve unknown values

Do not invent vaccination dates

Do not convert empty aggression fields into NO

Use UNKNOWN or MORE_INFORMATION_REQUIRED

Consent

Do not assume pilot contacts agreed to marketing

Record the real source and purpose

Require account activation and current-policy acceptance

29. Migration staging tables

migration_batches

migration_source_files

staging_customers

staging_pets

staging_sitters

migration_validation_errors

migration_entity_mappings

migration_import_results

Batch statuses

CREATED

FILE_UPLOADED

VALIDATING

VALIDATION_FAILED

READY_FOR_IMPORT

IMPORTING

IMPORTED

RECONCILED

ROLLED_BACK

Validation severity

ERROR

WARNING

INFORMATION

Example:

ERROR:

Duplicate phone number for two customers

WARNING:

Pet breed is unknown

ERROR:

Sitter marked verified without evidence

WARNING:

Vaccination next-due date is missing

30. Idempotent migration

A migration batch should be safe to retry.

Use a unique relationship:

source_system

source_entity_type

source_entity_id

Before creating a new customer:

Does mapping already exist?

↓

Yes → update or skip according to approved mode

No → create and store mapping

Do not use name alone for matching.

Two people may have the same name.

31. Migration reconciliation

After import, produce a report:

Customers received

Customers imported

Customers skipped

Customers failed

Pets received

Pets imported

Pets incomplete

Pets failed

Sitters received

Sitters imported

Sitters needing verification

Sitters rejected

Duplicate emails

Duplicate phones

Missing relationships

Invalid dates

Unknown service areas

Example:

Customer rows received: 25

Imported: 23

Duplicate: 1

Invalid phone: 1

Pet rows received: 31

Imported: 31

Profiles requiring completion: 8

Sitter rows received: 10

Imported: 10

Ready for activation: 4

Verification required: 6

32. Release candidate

After Days 50–55, create a release candidate such as:

v0.8.0-rc.1

Release-candidate rules

Feature freeze

No unnecessary redesign

Only launch-blocking fixes

Exact dependency lockfile committed

Database migrations reviewed

Environment variables documented

Production configuration tested

Release notes prepared

Rollback version identified

Environments

Development

Test

Staging

Production

Do not test live Razorpay transactions or real customer migration for the first time directly in production.

33. Production configuration checklist

Domain and transport

Production domain configured

HTTPS active

www/non-www redirect decided

Canonical host configured

Security headers enabled

Authentication

Production session secret

Secure cookies

Correct callback URLs

Admin MFA where configured

Password reset domain

Payments

Razorpay live credentials

Webhook secret

Live webhook URL

Captured-payment test

Refund permissions

Reconciliation access

Communications

WhatsApp templates approved

WhatsApp production phone configured

Email domain verified

SPF/DKIM/DMARC reviewed

Support inbox monitored

Storage

Private production bucket

Signed-link expiry

CORS restrictions

File-size limits

Lifecycle rules

Backup policy

Observability

Sentry production environment

Release version

Alerts enabled

Health checks

Notification queue monitor

Payment reconciliation monitor

Analytics

Production GA4 ID

Production Clarity project

Consent configuration

PII review

Internal traffic exclusion

34. Final test suite

Before soft launch, rerun the complete critical suite.

Customer

Signup

Login

Create pet

Edit pet

Request booking

View estimate

Pay

Receive confirmation

View status

View Report Card

Submit review

Cancel booking

Sitter

Login

View offer

Accept offer

View assignment

Start service

Upload photo

Complete service

Submit Report Card

View earnings

Admin

Review booking

Approve sitter

Assign sitter

Track payment

Initiate refund

Review report

Moderate review

Create incident

Close incident

Resilience

Duplicate payment webhook

Browser closes after payment

WhatsApp failure

Email failure

Storage interruption

Sitter replacement

Refund failure

Database retry

Notification-worker restart

35. Launch candidate smoke test

Run immediately after production deployment:

Homepage loads

Metadata appears correctly

Sitemap loads

robots.txt loads

Signup works

Login works

Pet Profile works

Booking estimate works

Test payment works

Webhook received

Booking confirms

Notification sent

Sitter assignment works

Service start works

Report upload works

Admin dashboard works

Sentry test error received

Do not open access until the smoke test passes.

36. Controlled soft-launch design

Phase A — Internal dry run

Participants:

Project team

Mentor

Internal test customer

Internal test sitter

Operations admin

Volume:

1–3 simulated or supervised bookings

Purpose:

Validate live environment

Validate notification delivery

Validate payment reconciliation

Validate assignment

Validate support procedures

Phase B — Trusted pilot

Participants:

5–10 known pet parents

2–4 fully verified sitters

One city

One or two areas

Dog walking only or walking + sitting

Volume:

Maximum 3–5 bookings per day

Phase C — Expanded pilot

Participants:

15–30 invited customers

5–8 sitters

Selected Ahmedabad areas

Only expand when:

Payment success is stable

Sitters arrive on time

Reports are submitted

No unresolved critical incident exists

Support capacity is sufficient

37. Recommended initial launch limits

City: Ahmedabad

Areas: Bopal and selected nearby areas

Service: Dog walking first

Operating hours: Controlled daytime hours

Booking lead time: Minimum configured notice

Bookings per day: Limited

Pets per booking: One initially

Payment: Full prepayment

Assignment: Manual admin approval

Risk: Green and selected Yellow only

Boarding: Disabled until separately approved

Do not release boarding merely because the page exists. Boarding requires stronger property, compatibility, vaccination and overnight-operational readiness.

38. Feature flags

Use configurable flags:

DOG_WALKING_ENABLED

PET_SITTING_ENABLED

BOARDING_ENABLED

CITY_AHMEDABAD_ENABLED

AREA_BOPAL_ENABLED

PUBLIC_SIGNUP_ENABLED

INVITE_ONLY_MODE

PAYMENTS_ENABLED

WHATSAPP_ENABLED

PWA_INSTALL_PROMPT_ENABLED

Operational purpose

Feature flags allow PetSaathi to:

Disable boarding without redeploying

Stop new bookings while preserving existing ones

Open an area gradually

Disable a broken notification channel

Return temporarily to invite-only mode

Feature flags must be server-controlled. A browser flag must not be the only protection.

39. Pilot metrics

Acquisition

Landing-page visitors

Signup started

Signup completed

Become-a-sitter leads

Activation

Customer profile completed

Pet Profile completed

First booking requested

Sitter application completed

Booking funnel

Booking form started

Estimate viewed

Request submitted

Approved for matching

Sitter assigned

Payment started

Payment captured

Booking confirmed

Operations

Offer acceptance rate

Time to assign sitter

On-time service-start rate

Service-completion rate

Report submission rate

Replacement rate

Finance

Payment success rate

Duplicate-payment count

Refund requests

Refund-processing failures

Reconciliation mismatches

Reliability

Crash-free sessions

API error rate

Notification delivery rate

Webhook delay

Media-upload failure rate

Core Web Vitals

Safety

Concerns

Incidents

Incidents by severity

Pet reassessment requests

Sitter restrictions

Do not place sensitive medical or incident descriptions in analytics tools.

40. Soft-launch dashboard

The launch team should see:

Active pilot customers

Active pilot sitters

Today’s bookings

Unassigned bookings

Payments needing review

Services currently active

Overdue Report Cards

Open incidents

Notification failures

Application errors

Launch status

GREEN

Normal controlled operations

AMBER

Reduced booking volume or additional monitoring

RED

Pause new bookings and execute incident/rollback plan

41. Launch pause conditions

Pause new booking creation when:

Payment capture is unreliable

Confirmed bookings lack assignments

Multiple cross-user access errors occur

Critical security defect is discovered

Notification system cannot deliver critical updates

Operations cannot support active bookings

Serious incident remains uncontrolled

Database integrity is uncertain

Incorrect pricing reaches customers

Duplicate charges occur

Pausing new bookings should not disable access to existing booking information or emergency support.

42. Rollback plan

A rollback plan should answer:

What version will be restored?

How will database compatibility be handled?

Which features can be disabled by flag?

Who authorises rollback?

How will active bookings continue?

How will customers and sitters be informed?

How will payments be reconciled?

Safe rollback hierarchy

1. Disable affected feature

2. Return to invite-only mode

3. Stop new booking requests

4. Preserve existing service access

5. Roll back application version

6. Restore database only when explicitly required

Database restoration is a high-impact action. Do not restore an old backup casually after live payments, because valid newer transactions may be lost.

43. Daily soft-launch operations

Morning check

Review system health

Review today’s bookings

Confirm sitter assignments

Check payment queue

Check notification queue

Check open incidents

During operations

Monitor services starting

Monitor sitter check-ins

Handle replacements

Monitor failed payments

Monitor support messages

Evening review

Confirm all services completed

Confirm reports submitted

Reconcile payments

Review refunds

Review incidents

Review Sentry errors

Record pilot feedback

44. Day-by-day execution plan

Day 50 — SEO metadata

Work

Configure root metadata

Add page titles and descriptions

Add canonical URLs

Add Open Graph images

Add icons and favicon

Add robots.ts

Add sitemap.ts

Add Organization structured data

Add Search Console property

Inspect important URLs

Output

Search-ready public pages

Sitemap

Robots configuration

Social-share previews

Search Console setup

Acceptance criteria

Every public page has unique metadata.

Private pages are not indexable.

Sitemap contains only canonical public pages.

Invalid service areas are excluded.

Open Graph previews work.

Structured data reflects visible facts.

Search Console can access public pages.

Day 51 — Analytics setup

Work

Create production GA4 property

Create Clarity project

Create analytics consent controls

Add GA4 event catalogue

Add key events

Configure internal traffic exclusion

Configure Clarity masking

Disable recording on sensitive routes

Verify events

Document data governance

Output

GA4 measurement

Clarity behaviour analysis

Privacy-aware event tracking

Launch funnel dashboard

Acceptance criteria

Staging and production are separated.

No PII is sent to GA4.

Sensitive Clarity content is masked.

Payment and medical information are excluded.

Booking events use consistent names.

Internal team traffic is excluded.

Consent behaviour is verified.

Day 52 — Performance optimisation

Work

Measure all major routes

Optimise hero and service images

Reduce client JavaScript

Lazy-load analytics

Optimise fonts

Add database indexes

Paginate admin lists

Review caching

Remove unused packages

Set route performance budgets

Output

Faster public pages

Faster dashboards

Core Web Vitals report

Performance budget

Acceptance criteria

Public pages target good CWV thresholds.

Images have dimensions.

Third-party scripts do not block booking.

Private responses are not publicly cached.

Mobile performance is tested.

Large admin queries are paginated.

Major regressions are documented or fixed.

Day 53 — Mobile PWA setup

Work

Create manifest

Add 192 px and 512 px icons

Add maskable icon

Configure theme colours

Create service worker

Add safe cache policy

Create offline page

Add install prompt

Test Android installation

Test iPhone home-screen installation

Test offline behaviour

Output

Installable PWA

Home-screen icon

Standalone experience

Offline fallback

Acceptance criteria

Manifest is valid.

Icons display correctly.

App opens in standalone mode.

Private routes are not cached broadly.

Booking and payment are blocked offline.

Offline state is clearly displayed.

Reconnection triggers server revalidation.

Old application versions update safely.

Day 54 — Legal pages

Work

Draft Privacy Notice

Draft Terms

Draft Customer Service Terms

Draft Sitter Agreement

Draft Cancellation/Refund Policy

Draft Cookie/Analytics Notice

Draft Safety Notice

Add grievance contact

Obtain legal review

Add policy versioning

Add acceptance records

Output

Privacy Notice

Terms

Refund policy

Sitter agreement

Consent and policy records

Acceptance criteria

Policies identify the operating entity.

Data purposes are clearly explained.

Analytics providers are disclosed.

Refund terms match backend rules.

Booking-request and confirmation states are explained.

Sitter obligations are clear.

Policy versions are retained.

Users accept the current required versions.

Legal reviewer approval is recorded.

Day 55 — Pilot data migration

Work

Finalise import templates

Back up production

Upload source files

Import into staging

Validate rows

Detect duplicates

Map source IDs

Import customers

Import pets

Import sitters

Reconcile counts

Send account-activation invitations

Output

Imported pilot customers

Imported Pet Profiles

Imported sitter applications

Migration report

Acceptance criteria

No plain-text passwords are imported.

Duplicate users are resolved.

Customer-pet relationships are correct.

Unknown values remain unknown.

Verification status has evidence.

Consent source is recorded.

Migration is idempotent.

Import counts reconcile.

Failed rows are documented.

Day 56 — Final testing and release candidate

Work

Freeze features

Create release candidate

Run automated tests

Run security tests

Run payment test

Run notification test

Test backup and rollback

Execute production smoke test

Verify Sentry alerts

Obtain launch sign-off

Output

Release candidate

Final QA report

Launch checklist

Rollback plan

Acceptance criteria

No Severity 0 or Severity 1 defects remain.

Customer journey passes.

Sitter journey passes.

Admin journey passes.

Payment and webhook paths pass.

Notification fallback passes.

Analytics privacy checks pass.

PWA works.

Policies are published.

Launch approval is recorded.

Day 57 — Internal production dry run

Work

Enable team accounts

Create supervised booking

Complete live-mode payment with a controlled amount

Assign test sitter

Start and complete service

Submit Report Card

Verify earnings

Test cancellation/refund

Review all monitoring systems

Output

Verified production workflow

Internal dry-run report

Acceptance criteria

All production providers work.

Payment reconciles.

Notifications deliver.

Report media remains private.

Audit logs exist.

Refund workflow is verified.

No uncontrolled defect remains.

Day 58 — Trusted customer cohort

Work

Invite first customer group

Keep bookings manually approved

Monitor every request

Contact users for feedback

Review analytics funnel

Fix urgent defects

Keep booking cap low

Output

First external pilot bookings

Customer feedback

Operational observations

Day 59 — Controlled sitter and service expansion

Work

Add eligible sitters

Expand booking allowance slightly

Monitor acceptance and on-time service

Review Report Card quality

Review payment and notifications

Hold launch review meeting

Output

Expanded pilot cohort

Sitter performance data

Launch-health report

Day 60 — Soft-launch decision

Work

Review KPIs

Review incidents

Review refunds

Review support workload

Review Sentry errors

Review Core Web Vitals

Review customer and sitter feedback

Decide expand, continue controlled mode or pause

Publish soft-launch report

Output

Soft-launch report

Go/hold/pause decision

Next-phase backlog

45. Required launch tests

SEO

Missing title

Duplicate title

Incorrect canonical

Private page indexed

Broken sitemap URL

Invalid structured data

Broken Open Graph image

Mobile content differs materially

Analytics

GA4 receives page views

Signup event

Booking-request event

Checkout event

Purchase event

Refund event

Staging excluded

PII scan

Clarity masking

Consent rejection

PWA

Valid manifest

Install on Android

Add to Home Screen on iOS

App starts correctly

Offline fallback

Payment blocked offline

Service action blocked offline

Cache update after deployment

Private-page cache test

Legal

Current policy linked

Required consent recorded

Marketing consent optional

Old policy version retrievable

Refund wording matches application

Privacy contact works

Sitter agreement accepted

Migration

Duplicate customer

Duplicate sitter

Missing pet owner

Invalid phone

Invalid date

Unknown vaccination

Sitter verified without evidence

Retry same batch

Rollback batch

Reconcile totals

Soft launch

Booking cap enforced

Disabled area blocked

Feature flag works

Emergency support available

Pause-new-bookings function works

Existing booking remains available during pause

Launch dashboard accurate

46. Week 8 deliverables

Functional deliverables

Search-ready public pages

Production sitemap and robots configuration

Search Console property

GA4 analytics

Microsoft Clarity

Consent-aware tracking

Performance-optimised MVP

Installable PWA

Offline fallback

Legal and policy pages

Versioned policy acceptance

Imported pilot customers

Imported Pet Profiles

Imported sitter profiles

Production release candidate

Controlled soft launch

Technical deliverables

Metadata configuration

Open Graph assets

Structured data

GA4 event layer

Analytics privacy rules

Clarity masking

Performance budgets

Web App Manifest

Service worker

Cache rules

Migration staging tables

Migration scripts

Import reconciliation

Feature flags

Production smoke tests

Rollback procedure

Launch monitoring dashboard

Documentation deliverables

SEO checklist

Metadata catalogue

Analytics event catalogue

Analytics privacy specification

Core Web Vitals report

PWA caching policy

Privacy Notice

Terms

Cancellation and Refund Policy

Sitter Agreement

Migration mapping document

Migration reconciliation report

Production checklist

Soft-launch operating guide

Launch report

47. Definition of Done

Week 8 and the soft-launch window are complete only when the following conditions are satisfied.

SEO

Public pages have unique metadata.

Private pages are excluded.

Sitemap contains valid canonical pages.

Search Console is configured.

Social previews are correct.

Structured data is accurate.

Mobile content is complete.

Analytics

GA4 production measurement works.

Events follow a documented naming standard.

Key funnel events are tracked.

GA4 contains no known PII.

Clarity masking is verified.

Sensitive routes are excluded or strictly masked.

Consent choices work.

Internal traffic is separated.

Performance

Core routes meet approved budgets.

Images and fonts are optimised.

Third-party scripts are controlled.

Database queries are indexed.

Public and private cache rules differ.

Mobile performance is tested.

Performance regressions are monitored.

PWA

Manifest is valid.

Installation works.

Icons and standalone mode work.

Offline fallback exists.

Sensitive data is not broadly cached.

Payment cannot complete offline.

Service lifecycle mutations cannot complete offline.

Updates replace old cached builds safely.

Legal

Required policies are published.

Policies identify the business.

Privacy purposes are clear.

Refund policy matches operations.

Sitter responsibilities are documented.

Policy versions are stored.

Acceptance is attributable.

Legal review is recorded.

Migration

Source files are preserved.

Production backup exists.

Import uses staging.

Duplicates are resolved.

Unknown data is not guessed.

Verification evidence is respected.

No plain-text password is imported.

Import is idempotent.

Counts reconcile.

Failed records are documented.

Launch

Production smoke test passes.

Live payment flow is verified.

Notifications deliver.

Monitoring is active.

Support responsibilities are assigned.

Booking limits are configured.

Feature flags work.

Pause and rollback procedures are tested.

Pilot users are controlled.

Launch decision is documented.

Final Week 8 operating principle

PetSaathi should launch as a controlled operating service, not merely as a publicly accessible website. Search, analytics, PWA support and marketing matter, but booking safety, payment integrity, verified supply, support capacity and incident readiness determine whether the platform is truly launch-ready.

Simple explanation for professor

“During Week 8, I will prepare PetSaathi for a controlled production launch.

First, I will make the public website search-ready by adding page titles, descriptions, canonical links, social-sharing images, a sitemap and a robots file. Only public pages such as services, pricing and safety will be searchable. Customer, sitter, payment and admin pages will remain private.

Next, I will configure Google Analytics 4 and Microsoft Clarity. GA4 will measure the customer journey from website visit to signup, Pet Profile completion, booking request and payment. Clarity will help identify user-interface problems such as confusing buttons or abandoned forms. Personal information such as names, phone numbers, addresses, medical information and private booking data will not be sent to analytics tools.

I will then improve website performance by optimising images, fonts, JavaScript, database queries and third-party scripts. The project will target good Core Web Vitals so that the application loads quickly and responds properly on mobile devices.

After that, I will convert the website into an installable Progressive Web App. Customers and sitters will be able to add PetSaathi to their phone’s home screen. However, sensitive actions such as booking, payment, starting a service and submitting a Report Card will still require an internet connection and server verification.

I will also prepare the Privacy Notice, Terms of Use, Customer Service Terms, Sitter Agreement and Cancellation and Refund Policy. Every policy will have a version and effective date so the system can record exactly which version each user accepted.

The pilot customer, pet and sitter information will be imported through staging tables. The system will validate duplicates, missing information and incorrect records before inserting anything into production. Passwords will not be imported, and sitter verification will not be approved without supporting evidence.

Finally, I will create a release candidate and run complete customer, sitter, admin, payment, notification and security tests. PetSaathi will then be released gradually to a small number of invited customers and verified sitters in selected Ahmedabad areas. Booking numbers will remain limited and every service will be monitored.

At the end of this phase, PetSaathi will have a live MVP, analytics, installable PWA support, legal policies, imported pilot data, monitoring, rollback controls and a controlled soft-launch process.”

PetSaathi Phase 4 — MVP Launch Readiness Checklist

Product, Technology, Operations, City Rollout and UX Control 🐾🚀

Executive decision

Your checklist has the correct categories, but several items are too general to produce a reliable launch decision.

For example:

Payment works

Database backups enabled

Role-based access working

Emergency vet contact active

These statements need measurable acceptance criteria.

The launch rule should be:

PetSaathi may accept controlled real bookings only when every launch-blocking product, payment, security, operations and safety requirement has passed with recorded evidence.

A second important decision:

Do not launch Bengaluru, Pune, Mumbai, Gurugram, Ahmedabad and Surat simultaneously.

Begin with:

One city

One or two micro-areas

One primary service

A limited number of verified sitters

A daily booking cap

Manual admin-controlled matching

The remaining city strategies should initially remain rollout hypotheses, not production commitments.

1. Launch decision categories

Every checklist item should have one of these classifications:

### Table 118

| Classification | Meaning |
| --- | --- |
| Launch blocker | Real bookings cannot start until passed |
| Conditional launch | May launch with a documented restriction or feature flag |
| Post-launch improvement | Useful but not required for the first controlled pilot |

Examples

Launch blockers

Cross-user access vulnerability

Payment cannot be reliably verified

Admin cannot assign sitters

Sitter cannot submit a Report Card

No incident escalation procedure

No production backup

Refund policy contradicts backend behaviour

No active support contact

Unverified sitters imported as active

Conditional launch

Full GPS route tracking

Recurring plans

Native app

Automated sitter matching

Automated payouts

Multilingual content

Post-launch improvements

Referral programme

Advanced loyalty system

AI sitter recommendations

Public sitter search marketplace

Insurance integration

2. Corrected Product checklist

2.1 Homepage

Required result

Loads successfully on mobile and desktop

Communicates walking, sitting and boarding clearly

Shows only services currently available

Contains a working primary CTA

Shows visible trust information

Links to safety, pricing, Terms and Privacy pages

Does not make unsupported claims

Launch test

Open homepage

→ Select primary CTA

→ Reach correct booking or signup page

→ Navigate back without losing state

Important claim rule

Do not display:

Live GPS tracking included

24/7 emergency veterinary support

Police-verified sitter

Instant confirmation

unless those features are genuinely operational for that user and service.

India’s Consumer Protection Act addresses false and misleading advertisements and provides measures for protecting consumers in e-commerce. Public claims should therefore match actual service capability.

2.2 Booking flow

Your five-step structure is correct:

1. Choose service

2. Choose pet

3. Choose date and time

4. Add/select address

5. Review price and request/pay

Do not turn this into twelve visible screens.

Pet Profile completion, risk review and sitter matching should occur outside the visible booking wizard wherever possible.

Pass criteria

Customer can select only their pets

Archived pets cannot be selected

Required Pet Profile information is checked

Past date/time cannot be submitted

Unsupported area cannot be booked

Pricing is calculated by the server

Duplicate submission does not create duplicate bookings

Customer understands whether the booking is:

Requested

Under review

Awaiting payment

Confirmed

Launch blocker

A customer must never see Confirmed immediately after submitting the request unless all confirmation conditions have passed.

2.3 Payment

“Payment works” must mean all of the following:

Razorpay order is created by the backend

Amount comes from the booking database

Currency matches the booking

Checkout signature is verified

Captured payment is confirmed

Webhook signature is verified using the raw request body

Duplicate webhooks are idempotent

Out-of-order webhook events do not corrupt the booking

Browser closure after payment is recoverable

Failed payment can be retried safely

Refund workflow has been tested

Razorpay requires webhook signatures to be validated and specifically warns that duplicate and out-of-order webhook delivery must be handled.

Required final state

Booking status: CONFIRMED

Payment status: CAPTURED

Signature verified: true

Amount verified: true

Currency verified: true

Launch blocker

The frontend must never be able to directly set:

payment_status = PAID

booking_status = CONFIRMED

2.4 Customer dashboard

Required modules

Customer profile

Pet cards

Pet Profile completion state

Upcoming bookings

Previous bookings

Payment status

Report Cards

Reviews

Support action

Account settings

Pass criteria

Customer sees only their data

Booking and payment statuses are separate

Mobile navigation is usable

Empty states explain the next action

Sensitive information is not placed in URLs

Session expiry returns the user safely to login

2.5 Sitter dashboard

Required modules

Sitter profile and verification badges

Availability

Booking offers

Accepted and assigned bookings

Service instructions

Start-service action

Complete-service action

Report Card

Media upload

Earnings summary

Pass criteria

Sitter sees only their offers and assignments

Full address is hidden until operationally authorised

Suspended sitter cannot accept work

Expired offer cannot be accepted

Cancelled booking cannot start

Service cannot complete before it starts

Earnings cannot be edited by sitter

2.6 Admin assignment

Required process

Customer requests booking

↓

Admin reviews profile and risk

↓

Admin identifies eligible sitters

↓

Offer sent

↓

Sitter accepts

↓

Admin assigns primary sitter

↓

Customer receives confirmation after payment

Pass criteria

Ineligible sitters are excluded

Schedule conflicts are checked

Risk and service permissions are checked

Verification expiry is checked

Only one active primary sitter is allowed

Assignment history is retained

Concurrent admin actions cannot assign two primary sitters

2.7 Report Card

Required result

After every completed service, the assigned sitter submits a structured report containing:

Actual start and end time

Food update where applicable

Water update

Toilet update

Mood

Activity or walking update

Photo/video proof

Sitter note

Concern indicator

Pass criteria

Only assigned sitter can submit

Service must already be completed

Required fields change by service

Report is versioned

Concern can create an incident

Submitted report cannot be silently overwritten

Customer media remains private

2.8 Customer review

Rules

Review allowed only for eligible completed bookings

One active review per customer per booking

Customer can rate:

Punctuality

Pet handling

Communication

Overall experience

Would book again

Admin cannot raise ratings manually

Negative reviews cannot be removed merely for being negative

Personal data, harassment and spam may be moderated under a documented policy

2.9 Incident management

Incident types

Bite

Pet escape

Pet injury

Sitter injury

Medical emergency

Medication error

No-show

Property damage

Unsafe customer environment

Privacy/media issue

Serious complaint

Required process

Incident created

→ Severity assigned

→ Immediate action recorded

→ Booking/payout placed on hold if needed

→ Evidence preserved

→ Investigator assigned

→ Findings documented

→ Corrective actions completed

→ Authorised safety admin closes incident

Launch blocker

At least one authorised person must be reachable during every active pilot booking.

2.10 Form validation

“All forms have validation” must mean:

Client-side usability validation

Server-side schema validation

Business-rule validation

Database constraints

Examples:

Birth date cannot be future

Weight must be positive

Pet belongs to customer

Booking area must be enabled

Price comes from server

Medication requires dose and time

Refund cannot exceed captured balance

Client-side validation alone is not a security control.

2.11 Mobile layout

Minimum devices

Android Chrome

iPhone Safari

Small-screen Android device

Desktop Chrome

Desktop Safari/WebKit

Desktop Firefox or Edge

Mobile pass criteria

No horizontal scrolling

Buttons have adequate touch size

Form errors remain visible

Razorpay Checkout works

Camera upload works

Date/time controls are usable

Sticky CTA does not cover fields

Keyboard does not hide the submit button

Performance targets

At the 75th percentile, target:

LCP ≤ 2.5 seconds

INP ≤ 200 milliseconds

CLS ≤ 0.1

These are Google’s current “good” Core Web Vitals thresholds.

3. Corrected Technical checklist

3.1 Database backups

“Backups enabled” is insufficient.

Required:

Automated scheduled backup

Encrypted backup storage

Backup kept separately from production

Defined retention

Backup monitoring

Documented restore process

Successful restore drill

Recovery Point Objective

Recovery Time Objective

PostgreSQL officially supports SQL dumps, filesystem-level backups and continuous archiving. The appropriate combination depends on the required recovery capability.

Recommended MVP minimum

Daily logical backup

+ provider-managed point-in-time recovery

+ monthly restore drill

+ backup before every production migration

A backup that has never been restored should be treated as unverified.

3.2 Environment variables

Required secrets include:

DATABASE_URL

AUTH_SECRET

RAZORPAY_KEY_ID

RAZORPAY_KEY_SECRET

RAZORPAY_WEBHOOK_SECRET

WHATSAPP_ACCESS_TOKEN

EMAIL_PROVIDER_KEY

STORAGE_ACCESS_KEY

STORAGE_SECRET

SENTRY_AUTH_TOKEN

Pass criteria

No production secret committed to Git

Public and private environment variables are separated

Secrets differ between staging and production

Exposed secret can be rotated

Logs do not print secrets

Only server code accesses private keys

3.3 Payment webhooks

Required:

HTTPS endpoint

Raw request body retained for signature check

Razorpay signature validated

Event ID stored

Duplicate event returns safe success

Out-of-order events handled

Failed event processing retried

Webhook monitoring enabled

Reconciliation job available

Razorpay explicitly requires signature verification against the raw webhook body and documents duplicate and non-sequential event delivery.

3.4 Role-based access control

Required dimensions:

Role

Permission

Ownership

Assignment

Operational scope

Current resource state

Account status

Example:

Customer + owns booking + booking active

→ may view booking

Sitter + assigned booking

→ may view pet instructions

Finance admin

→ may reconcile payment

→ may not edit pet risk

OWASP recommends least privilege, deny-by-default behaviour and authorization checks for every request.

3.5 File uploads

“File uploads limited” and “media compressed” are not enough.

Required:

Allowed file extensions

Real content/file-signature check

Maximum image size

Maximum video size

Server-generated filename

Authorised uploader

Private storage

Malware scanning where available

Image metadata stripping where practical

Compression/transcoding

Short-lived viewing URL

Booking-level access check

OWASP advises allowlisting extensions, verifying file types rather than trusting the browser MIME type, generating filenames, enforcing size limits and restricting uploads to authorised users.

Example limits

Images: JPEG, PNG, WebP; maximum 10 MB

Videos: MP4; maximum 100 MB

Maximum images per report: 10

Maximum videos per report: 2

These values should remain configurable.

3.6 Compression rules

Images

Resize oversized images

Correct orientation

Remove unnecessary metadata

Convert to efficient delivery format

Keep original privately only when needed for evidence

Generate thumbnail and medium version

Videos

Limit duration

Generate preview thumbnail

Transcode to supported MP4 profile

Prevent automatic loading on list screens

Keep incident evidence immutable where required

Compression must not replace security validation.

3.7 Error logging

Required:

Sentry or equivalent enabled

Client, server and worker errors separated

Environment and release tags

Request ID

Payment and booking reference codes

Alerts for critical failures

Sensitive-data scrubbing

Critical alerts

Captured payment but unconfirmed booking

Duplicate captured payments

Cross-user access attempt

Webhook queue stopped

Incident notification failure

Database unavailable

Media storage unavailable

Do not send passwords, full addresses, pet medical notes, emergency contacts or tokens to monitoring tools.

3.8 Analytics

GA4 and Clarity may be active, but:

They are not the operational ledger

Test and internal traffic must be excluded

Personal data must not be included

Sensitive dashboard routes should be excluded or heavily masked

Consent configuration must match the approved privacy model

Use the PetSaathi database as the source of truth for bookings, payments, refunds, reports and incidents.

3.9 Privacy, Terms and Refund pages

Required pages:

/privacy

/terms

/cancellation-refund-policy

/sitter-agreement

/safety

/cookie-policy

/contact-or-grievance

The final DPDP Rules, 2025 have staged commencement dates. Their notice provisions call for clear, understandable notices with itemised personal-data descriptions and specified processing purposes.

Legal launch rule

Policies must:

Identify the operating entity

Match actual backend behaviour

Include effective date and version

Be accepted through attributable records

Receive qualified Indian legal review before a real paid public rollout

4. Corrected Operations checklist

4.1 Approved sitters imported

Each active sitter must have:

Identity record

Verified contact information

Service area

Services allowed

Pet size permissions

Risk-handling permissions

Availability

Training status

Police/KYC evidence where required

Signed sitter agreement

Payout readiness

Emergency contact

Do not import:

verified = true

without evidence, reviewer and date.

4.2 Pricing by city and area

Pricing must be stored as a versioned configuration.

City

Area

Service

Duration

Base amount

Additional-pet fee

Peak-time rule

Urgent-booking fee

Effective date

Pass criteria

Server calculates final amount

Old booking retains old price snapshot

Area can be disabled

Zero or negative price is rejected

Price shown before payment matches charged amount

4.3 Support number

“Support number active” should mean:

Published number

Defined operating hours

Person or rota assigned

Missed-call procedure

WhatsApp fallback

Emergency escalation

Booking lookup process

Support notes recorded

Response-time target

Suggested pilot target:

Active service emergency:

Immediate acknowledgement

Upcoming booking problem:

Within 15–30 minutes during operating hours

General question:

Within one business day

These are internal operating targets, not promises unless the team can consistently meet them.

4.4 Emergency veterinary support

One universal veterinarian contact is not enough.

Maintain by area:

Regular partner clinic

24-hour emergency clinic

Phone

Address

Operating hours

Map location

Travel estimate

Last verified date

Services available

Operating rule

PetSaathi must not describe itself as providing veterinary diagnosis or treatment.

The system should:

Surface verified contact details

Contact the owner

Follow authorised emergency instructions

Escalate to qualified veterinary professionals

Preserve incident history

4.5 Payout rules

Define before launch:

Sitter earning calculation

Platform commission

Incentives

Cancellation compensation

No-show result

Incident hold

Payout schedule

Minimum payout amount

Failed-payout handling

Adjustment approval

Tax/document responsibilities

Example:

Confirmed booking:

Earning = PENDING_SERVICE

Service completed:

Earning = PENDING_REPORT

Report approved:

Earning = ELIGIBLE

Incident open:

Earning = ON_HOLD

Payout successful:

Earning = PAID

4.6 Cancellation policy

Must specify:

Customer cancellation windows

Sitter cancellation process

Replacement attempts

Pet illness

Unsafe or incomplete information

Severe weather

Customer inaccessible

Sitter no-show

Refund amount

Refund processing stages

The website copy, admin actions and backend calculation must all use the same policy version.

4.7 Incident protocol

Required operational document:

Who receives the alert?

Who contacts the owner?

Who contacts the vet?

Who stops the service?

Who suspends matching?

Who controls evidence?

Who approves refunds?

Who communicates closure?

Run one simulated incident before launch.

5. City-specific strategy

Critical correction

The following “user expectations” should be treated as pilot hypotheses, not proven facts:

Bengaluru users expect app-like smoothness

Pune users respond to value bundles

Gurugram users need premium support

Surat users prefer WhatsApp

They are reasonable product hypotheses, but PetSaathi must validate them through interviews, conversion data and pilot feedback.

5.1 Bengaluru

Positioning hypothesis

Premium, app-like convenience with visible sitter quality.

MVP emphasis

Fast mobile UI

Clear verification badges

Accurate availability

GPS-ready architecture

Apartment-society onboarding

Recurring walking waitlist

Suggested pages

/city/bengaluru/dog-walking-whitefield

/city/bengaluru/pet-sitting-hsr-layout

Launch risk

Publishing these pages before real Whitefield or HSR service coverage would create misleading expectations.

Go-live condition

Active verified sitters in locality

Defined radius

Local pricing

Support coverage

Real availability data

Unique local content

5.2 Pune

Positioning hypothesis

Reliable care with clear value and repeat-service packages.

MVP emphasis

Trial + weekly bundle

Transparent package savings

Society-specific onboarding

Strong student-sitter verification

Repeat booking

Suggested pages

/city/pune/dog-walking-baner

/city/pune/pet-sitting-wakad

Important control

“Student sitter” must never mean reduced verification.

Every sitter should pass the same core identity, safety, service-permission and training requirements.

5.3 Mumbai

Positioning hypothesis

Hyperlocal reliability is more important than broad geographic coverage.

MVP emphasis

Tight service radius

Travel-time validation

Area-specific sitter pools

Premium local walker positioning

Building/security instructions

Replacement sitter coverage

Suggested pages

/city/mumbai/dog-walking-powai

/city/mumbai/pet-sitting-bandra

Required system change

Do not match based only on city.

Use:

Area

Pincode

Coordinates

Service radius

Estimated travel time

Sitter availability

5.4 Gurugram

Positioning hypothesis

Trust, verification and premium support are major conversion drivers.

MVP emphasis

KYC/police-verification display

Society-approved sitter programme

Experienced-handler badges

Premium response support

Controlled access instructions

Transparent replacement support

Suggested pages

/city/gurugram/dog-walking-dlf

/city/gurugram/pet-sitting-golf-course-road

Copy rule

Display the precise verification completed.

Use:

Identity verified

Police verification reviewed on 10 July 2026

Training completed

Avoid vague badges such as:

100% safe

Fully trusted

Risk-free sitter

5.5 Ahmedabad

Recommended first pilot city

This is the strongest initial option because the existing project planning, reports and pilot strategy already use Ahmedabad and Bopal.

MVP emphasis

Local trust

Family-friendly explanations

Verified local caregivers

Vet and pet-shop relationships

WhatsApp-assisted onboarding

Gujarati/Hindi content later

Strong trial-service education

Suggested pages

/city/ahmedabad/dog-walking-bopal

/city/ahmedabad/pet-sitting-satellite

Recommended launch configuration

City: Ahmedabad

Initial area: Bopal

Second area: Satellite after validation

Initial service: Dog walking

Secondary service: Home sitting

Boarding: Disabled

Matching: Manual admin-controlled

Daily booking cap: 3–5

Risk: Green and selected Yellow cases

Payment: Prepaid

5.6 Surat

Positioning hypothesis

Assisted booking and family-style care may initially outperform a fully self-service journey.

MVP emphasis

WhatsApp-first assistance

Phone support

Family-style sitting

Referral-led sitter supply

Carefully controlled boarding

Simple service explanations

Suggested pages

/city/surat/pet-sitting-vesu

/city/surat/pet-boarding-adajan

Boarding warning

Do not launch boarding merely because the page exists.

Boarding requires:

Property approval

Vaccination policy

Other-pet compatibility

Feeding separation

Escape controls

Emergency planning

Overnight responsibility

Capacity limits

6. City landing-page quality rules

Do not generate dozens of nearly identical city pages by replacing only the city and area names.

Google identifies pages created primarily to rank for similar location queries without unique value as doorway abuse.

Each city-area page must contain genuine local value:

Actual service availability

Real price or starting price

Supported pincodes or radius

Local sitter supply

Local operating hours

Local emergency-support information

Area-specific booking expectations

Real FAQs

Unique photographs where authorised

Local society or partnership information

Honest waitlist status when unavailable

Indexing rule

Real service active

+ useful unique content

+ operational support

→ indexable page

No sitters

+ no pricing

+ generic copied content

→ noindex or do not publish

7. Refined UX rules

Rule 1 — Keep booking simple

Visible booking steps:

Service

Pet

Schedule

Address

Review and request/pay

Use progressive disclosure for:

Special instructions

Coupons

Additional pets

Access instructions

Emergency notes

Do not request permanent Pet Profile information again inside every booking.

Rule 2 — Show trust where the decision occurs

Do not place all safety information only on /safety.

Show relevant trust elements on:

Homepage

Verified caregivers

Private updates

Secure payment

Report Cards

Support availability

Sitter card

Exact verification badges

Service permissions

Experience

Rating confidence

Completed bookings

Booking review

Payment protection

Cancellation summary

Service instructions

Confirmation process

Confirmed booking

Assigned sitter

Support contact

Emergency actions

Preparation instructions

Rule 3 — Admin controls matching

For the MVP:

Customer request

→ admin review

→ eligible sitter offers

→ sitter acceptance

→ admin primary assignment

→ payment/confirmation

Do not automatically choose a sitter based only on:

Distance

Rating

Breed

Price

Availability

Safety, service permission, pet size, handling requirements and current restrictions must remain hard filters.

Rule 4 — Make repeat booking easy

After the Report Card, show:

Book same sitter again

Repeat this service

Join weekly-plan waitlist

Update care instructions

Refer a pet parent

Repeat-booking rule

Do not copy the previous booking blindly.

Revalidate:

Sitter availability

Current pricing

Pet health

Risk assessment

Address

Current service area

Payment

Customer instructions

8. Recommended launch phases

Phase 0 — Internal dry run

1–3 supervised test bookings

No public acquisition

Team members only

Phase 1 — Ahmedabad/Bopal trusted pilot

5–10 customers

2–4 verified sitters

Dog walking

3–5 bookings per day maximum

Manual matching

Phase 2 — Ahmedabad expansion

Add Satellite

Add home sitting

15–30 customers

5–8 sitters

Phase 3 — Second-city pilot

Choose only after evaluating:

Demand

Verified sitter supply

Local support availability

Emergency partners

Acquisition cost

Booking completion

Incident rate

Repeat-booking rate

Bengaluru, Pune, Mumbai, Gurugram and Surat should remain behind feature flags until their operational requirements pass.

9. Launch scorecard

Product

### Table 119

| Gate | Required result |
| --- | --- |
| Booking | Complete end-to-end pass |
| Payment | Captured and reconciled |
| Assignment | One eligible primary sitter |
| Service | Start and complete actions pass |
| Report | Delivered to customer |
| Review | Completed-booking restriction works |
| Incident | Simulated incident completed |

Technology

### Table 120

| Gate | Required result |
| --- | --- |
| Backup | Automated and restore-tested |
| Security | No critical access-control defect |
| Webhook | Signature, duplicate and ordering tests pass |
| Upload | Private, validated and limited |
| Monitoring | Critical alerts received |
| Performance | Mobile routes meet approved budget |

Operations

### Table 121

| Gate | Required result |
| --- | --- |
| Sitters | Verified and active |
| Pricing | Approved city/area rules |
| Support | Staffed during services |
| Vet contacts | Verified per active area |
| Payout | Rules documented |
| Cancellation | Backend and policy aligned |
| Incident | Team has completed drill |

10. Go, hold or stop decision

Green — Launch

No critical security issue

Payment is stable

Sitters are verified

Support is staffed

Incident procedure works

All launch blockers passed

Amber — Restricted launch

One non-critical component has a workaround

Booking volume remains capped

Affected feature remains disabled

Owner and resolution date recorded

Red — Do not launch or pause

Cross-user access

Duplicate charges

Payment mismatch

No sitter assignment

Critical incident uncontrolled

Support unavailable

Database integrity uncertain

Misleading service claims

No verified emergency process

Final approved operating principle

PetSaathi’s MVP is launch-ready only when the complete service can be delivered safely—not merely when the website is online. The platform needs verified supply, controlled matching, reliable payments, private service evidence, responsive support, incident handling and measurable technical safeguards.

Simple explanation for professor

“Before launching PetSaathi, I will check the product, technology and operations separately. The product must support the complete journey from signup and Pet Profile creation to booking, payment, sitter assignment, service completion, Report Card and customer review.

The technical system must have secure access control, server-side validation, verified Razorpay webhooks, private file uploads, tested backups, error monitoring and mobile performance. A backup will not be considered complete until it has been successfully restored during a test.

The operations team must have verified sitters, approved city-wise pricing, an active support number, area-specific emergency veterinary contacts, sitter payout rules, a cancellation policy and an incident-response process.

PetSaathi will not launch in all six cities at the same time. The first controlled pilot should begin in Ahmedabad, preferably Bopal, with dog walking, a small number of customers, a limited number of verified sitters and manual admin-controlled matching. Other cities such as Bengaluru, Pune, Mumbai, Gurugram and Surat will be launched later using city-specific strategies.

The booking flow will remain simple: choose the service, pet, date and time, address and then request or pay. Trust information will be visible throughout the journey, and repeat booking will be made easy after the Report Card.

City pages will be published only when PetSaathi has real service coverage, pricing, sitters and local information. This prevents misleading users and avoids creating low-value pages only for search ranking.

The final launch decision will use Green, Amber and Red status. Green means the controlled launch can proceed, Amber means the launch can continue with restrictions, and Red means new bookings must not begin until the critical issue is resolved.”

What Goes Wrong in Many MVP Builds

PetSaathi MVP — Correct Scope and Architecture 🐾

Executive correction

Your six mistakes are correct, but the first section mixes features to postpone with features required for the MVP.

Build during Phase 4

Authentication

Customer and Pet Profiles

Booking requests

Admin-controlled sitter assignment

Razorpay payment and verification

Sitter dashboard

Service start and completion

Pet Report Card

Customer review

Incident management

Role-based access control

Notifications and monitoring

Postpone until later phases

Full customer-sitter chat

Subscription engine

Wallet

Automatic recurring billing

Full GPS route tracking

AI sitter matching

Native Android/iOS apps

Pet product store

Insurance engine

Large public sitter marketplace

The correct MVP objective is not to build a small version of every future feature. It is to build one complete, reliable service journey:

Customer creates Pet Profile

↓

Customer requests service

↓

Admin reviews request

↓

Admin assigns eligible sitter

↓

Sitter accepts

↓

Customer pays

↓

Service is completed

↓

Sitter submits Report Card

↓

Customer reviews service

↓

Admin handles exceptions

Mistake 1 — Building too many features

Wrong approach

A founder tries to build:

Real-time chat

Subscriptions

Wallet

Full GPS tracking

AI recommendations

Referral engine

Product store

Native apps

Insurance

Loyalty points

Automated sitter matching

The result is usually a large, unfinished system in which the basic booking journey is still unreliable.

Correct approach

Complete the essential operational loop:

Pet Profile

Booking

Price calculation

Sitter assignment

Payment

Service execution

Report Card

Review

Admin control

Why this matters

A feature is useful only if it helps PetSaathi successfully deliver a real pet-care service.

For example:

A wallet is not useful when payment verification is unreliable.

AI matching is not useful when sitter permissions and availability are incomplete.

Live GPS is not useful when admins cannot resolve a sitter cancellation.

Native apps are not useful when the booking lifecycle is still unclear.

MVP feature test

Before adding any feature, ask:

Is it necessary to complete the first real booking?

Is it necessary for customer or pet safety?

Is it necessary to collect payment correctly?

Is it necessary for the admin team to operate the service?

Is there a simpler manual method for the pilot?

If the answer is no, the feature should normally move to a later phase.

Mistake 2 — Building customer screens but no Admin Dashboard

Wrong approach

The team creates:

Beautiful homepage

Animated sitter cards

Premium booking form

Attractive dashboards

But the team cannot:

Review bookings

Verify sitters

Assign sitters

Reconcile payments

Approve refunds

Review reports

Handle incidents

Suspend unsafe accounts

Correct approach

The Admin Dashboard is the operational brain of the MVP.

Customer interface = requests the service

Sitter interface = performs the service

Admin dashboard = controls and supervises the service

Minimum admin functions

The admin team must be able to:

Review customers and Pet Profiles

Review service-specific risk information

Approve and verify sitters

Enable sitter service permissions

Review booking requests

Assign and replace sitters

Track payment status

Review Report Cards

Moderate reviews

Create and resolve incidents

Manage pricing and service areas

Track audit history

Why manual administration is correct for the MVP

During the early pilot, PetSaathi will have limited data and a small number of sitters. Manual admin-controlled assignment allows the team to inspect:

Sitter availability

Travel distance

Pet size

Handling requirements

Risk controls

Verification expiry

Previous incidents

Customer preferences

This provides higher control than premature automatic matching.

Correct MVP principle

Automate repetitive record-keeping, but keep high-impact matching and safety decisions under authorised human control.

Mistake 3 — No role-based access control

Wrong approach

User is logged in

→ user may access protected record

Authentication only proves that a user is logged in. It does not prove that the user owns or is authorised to access a specific pet, booking, payment or report.

Next.js separates authentication, session management and authorization. Its current guidance also states that authentication and authorization must be checked inside every Server Function because those functions can be called directly, not only through visible UI controls.

Correct access model

Every protected request should check:

Authenticated?

↓

Account active?

↓

Correct role?

↓

Required permission?

↓

Owns or is assigned to resource?

↓

Action allowed in current state?

Customer access

A customer may:

View their own profile

Manage their own pets

View their own bookings

View their own payment status

View their own Report Cards

A customer may not:

Access another customer’s pet

Assign a sitter

Mark payment successful

Edit risk classification

View sitter earnings

Resolve an incident

Sitter access

A sitter may:

View their booking offers

View confirmed assignments

Access relevant assigned-pet instructions

Start and complete assigned services

Submit Report Cards

View their earnings

A sitter may not:

View another sitter’s bookings

View all customer information

Change prices

Confirm payment

Edit customer Pet Profiles

Change their own verification status

Admin access

Admin permission should also be separated:

Operations admin → booking assignment

Finance admin → payment and refund control

Safety admin → incidents and risk review

Verification admin → sitter approval

Support admin → customer assistance

OWASP recommends least privilege, deny-by-default authorization and permission checks on every request.

Mistake 4 — Trusting frontend payment success

Wrong approach

Razorpay Checkout displays success

↓

Frontend sends "paid = true"

↓

Booking becomes confirmed

A browser response may be modified, interrupted or replayed. The customer may also close the browser after a successful provider transaction.

Correct payment process

Backend calculates amount

↓

Backend creates Razorpay order

↓

Customer completes Checkout

↓

Frontend returns payment ID, order ID and signature

↓

Backend verifies signature

↓

Webhook/API confirms captured payment

↓

Backend validates amount and currency

↓

Booking becomes CONFIRMED

Razorpay states that payment signatures must be verified on the server before fulfilling the order. It also exposes payment.captured and order.paid webhook events when a payment is captured.

Confirmation conditions

signature_verified = true

payment_status = CAPTURED

payment_amount = booking.final_amount

payment_currency = booking.currency

provider_order_id = stored_order_id

booking_status = PAYMENT_PENDING

Only then:

PAYMENT_PENDING → CONFIRMED

Webhook requirements

The webhook handler must support:

Signature verification

Duplicate events

Delayed events

Events received out of order

Safe retries

Provider reconciliation

Razorpay recommends webhooks or server-to-server API checks to handle callback failures and verify payment details.

Mistake 5 — Building full GPS tracking too early

Wrong approach

The team spends several weeks implementing:

Background mobile tracking

Continuous route capture

Location streaming

Route playback

Geofencing

Battery optimisation

GPS fraud detection

Native-app permissions

Meanwhile, the platform still lacks dependable bookings, sitter assignment or incident handling.

Correct MVP approach

For the pilot, use simpler evidence:

Sitter start timestamp

Optional start location

Service-start photograph

Manual distance

Service-update photograph/video

Completion timestamp

Customer confirmation

WhatsApp live-location option where appropriate

Important limitation

Do not advertise manual proof as full live GPS tracking.

Use accurate language:

“Service updates and location proof are available for selected pilot services.”

Not:

“Every walk has continuous live GPS tracking.”

Move full GPS to a later phase when

Walking volume is meaningful

Operational need is proven

Users request the feature

Sitter consent and privacy rules are established

Battery and background-location behaviour can be tested

Native/mobile implementation resources are available

The database may remain GPS-ready by storing optional:

start_latitude

start_longitude

end_latitude

end_longitude

distance_metres

location_evidence_type

But continuous tracking does not need to be built yet.

Mistake 6 — Poor database structure

Wrong approach

One large table:

users

-----

id

name

email

password

role

pet_name

pet_breed

pet_medical_notes

sitter_bio

sitter_rating

booking_date

booking_price

payment_status

review

incident

This causes:

Repeated information

Empty and unrelated columns

Difficult permissions

Incorrect relationships

Lost history

Hard migrations

Unsafe updates

Correct structure

users

customer_profiles

pets

pet_behavior_profiles

pet_medical_profiles

pet_vaccination_records

pet_care_instructions

sitter_profiles

sitter_verification_checks

sitter_service_permissions

sitter_availability

bookings

booking_pets

booking_address_snapshots

booking_price_snapshots

booking_assignments

booking_status_history

payments

payment_events

refunds

booking_reports

report_media

reviews

incidents

sitter_earnings

payouts

Database protections

Use:

Primary keys

Foreign keys

Unique constraints

Check constraints

Transactions

Indexes

Version columns

Status-history records

PostgreSQL constraints protect valid data at database level, and foreign keys maintain relationships between records. Transactions and locking help coordinate concurrent updates such as two admins attempting to assign different sitters to the same booking.

Mistake 7 — Using one status field for everything

Wrong approach

booking_status:

PENDING

PAID

SITTER_ASSIGNED

COMPLETED

REFUNDED

REVIEWED

These values describe different business processes.

A booking may be completed while a partial refund is being processed. A customer may never submit a review, but the booking still needs to close.

Correct model

Booking status

REQUESTED

PENDING_ADMIN_REVIEW

SITTER_MATCHING

SITTER_ASSIGNED

PAYMENT_PENDING

CONFIRMED

SERVICE_STARTED

SERVICE_COMPLETED

REPORT_SUBMITTED

CLOSED

Payment status

CREATED

PENDING

AUTHORIZED

CAPTURED

FAILED

EXPIRED

REFUNDED

PARTIALLY_REFUNDED

Assignment status

OFFERED

VIEWED

ACCEPTED

DECLINED

EXPIRED

ASSIGNED

REMOVED

COMPLETED

NO_SHOW

Report status

DRAFT

SUBMITTED

ADMIN_REVIEW_REQUIRED

DELIVERED

AMENDED

Review status

NOT_ELIGIBLE

PENDING

SUBMITTED

SKIPPED

MODERATION_REQUIRED

PUBLISHED

Mistake 8 — No historical snapshots

Wrong approach

A booking reads live information directly from the current Pet Profile.

The customer later changes:

Pulling: Strong

to:

Pulling: No

The old booking then appears to have been made using the new information.

Correct approach

At booking time, preserve snapshots of:

Pet information

Behaviour and handling instructions

Medical instructions

Risk assessment

Address

Price

Cancellation-policy version

Sitter assignment

Customer declaration

Historical operational records must not change when the current profile changes.

Mistake 9 — No concurrency protection

Wrong approach

Two administrators assign two sitters at nearly the same time.

Or:

Customer cancels while payment confirms

Two sitters accept simultaneously

Duplicate webhook confirms twice

Report is submitted twice

Correct approach

Use:

Database transactions

Unique active-primary-assignment rule

Optimistic version field

Row locking where appropriate

Idempotency keys

Current-state validation

Example:

Load booking version 5

↓

Confirm status = SITTER_MATCHING

↓

Assign sitter

↓

Update where version = 5

↓

Set version = 6

If another transaction already changed the record, the second action must fail safely instead of overwriting it.

Mistake 10 — No audit history

Wrong approach

The database stores only:

booking.status = CANCELLED

The team cannot answer:

Who cancelled it?

Why was it cancelled?

What was its previous status?

Was payment already captured?

Was the customer notified?

Correct approach

Use status-history and audit records:

from_status

to_status

actor_type

actor_id

reason_code

notes

request_id

created_at

Security and administrative logs should record important business events while excluding passwords, tokens and sensitive information. OWASP recommends application-level security logging and generic client-facing error responses rather than exposing internal call stacks or system details.

Mistake 11 — Unsafe file uploads

Wrong approach

The application trusts:

filename = pet-photo.jpg

content-type = image/jpeg

Both values are supplied by the client and can be falsified.

Correct approach

For photos and videos:

Verify authentication and assignment

Allowlist extensions

Inspect content signatures

Enforce size limits

Generate storage filenames

Store files privately

Use short-lived access links

Compress or transcode safely

Scan files where available

Prevent executable files

Separate incident evidence from ordinary media

OWASP warns that browser-provided content types cannot be trusted and recommends layered upload controls.

Mistake 12 — No incident or exception flows

Wrong approach

The team builds only the successful path:

Book

Pay

Complete

Review

Real services also produce:

Sitter cancellation

Customer cancellation

No-show

Pet illness

Payment failure

Pet escape

Bite

Property damage

Replacement required

Refund required

Correct approach

Build controlled exception states:

CANCELLED

DECLINED

REPLACEMENT_REQUIRED

NO_SHOW

INCIDENT_HOLD

An MVP does not need every possible automation, but it does need a safe manual workflow for every serious exception.

Mistake 13 — Automating high-risk decisions too early

Wrong approach

AI automatically:

Approves pets

Rejects pets

Assigns risk colours

Selects sitters

Approves boarding

Diagnoses health conditions

Resolves incidents

Correct approach

For the MVP:

Structured data

↓

Deterministic warning flags

↓

Authorised admin review

↓

Service-specific decision

AI may later assist with:

Summarising notes

Identifying missing fields

Highlighting contradictory answers

Suggesting questions

It should not independently make medical or safety decisions in the pilot.

Mistake 14 — Launching too many cities

Wrong approach

Launch simultaneously in:

Ahmedabad

Surat

Mumbai

Pune

Bengaluru

Gurugram

This creates six separate supply, pricing, support, emergency and service-area problems.

Correct approach

Start with:

One city

One or two areas

One service

Two to four verified sitters

Three to five daily bookings

Manual matching

For PetSaathi, the strongest first pilot remains:

Ahmedabad

Initial area: Bopal

Initial service: Dog walking

Secondary service later: Home sitting

Boarding: Disabled initially

Correct Phase 4 MVP

P0 — Required

Authentication

Customer profile

Structured Pet Profile

Booking request

Admin booking review

Sitter verification

Manual sitter assignment

Server-side pricing

Razorpay order and verification

Sitter accept/reject

Service start/complete

Pet Report Card

Private media upload

Customer review

Incident management

Role-based permissions

Notifications

Audit logs

Monitoring

P1 — Useful after the core is stable

Sitter availability calendar

Backup sitter workflow

Repeat booking

Weekly-plan waitlist

Payout automation

More detailed analytics

Multilingual content

Basic location proof

Later phases

Full chat

Wallet

Subscription engine

Full live GPS

AI sitter matching

Native mobile apps

Insurance

Pet store

Large-scale public sitter marketplace

Definition of a successful MVP

PetSaathi has a successful MVP when it can safely complete this journey:

A real customer

creates a real Pet Profile

requests a real service

receives an eligible sitter

pays a verified amount

receives the completed service

receives a Report Card

and can obtain support when something goes wrong.

The number of features is not the success metric.

The important metrics are:

Booking completion

Payment success

Time to assign sitter

Sitter arrival

Report submission

Repeat booking

Refund rate

Incident rate

Customer trust

Operational workload

Simple explanation for professor

“Many MVP projects fail because the developers try to build every future feature at the beginning. They spend time on chat, subscriptions, AI, GPS, wallets and mobile apps before the basic service works properly.

For PetSaathi, the correct MVP should focus on the complete booking journey. The customer creates a Pet Profile and requests a service. The admin reviews the request and assigns a verified sitter. The sitter accepts the booking, the customer makes a verified payment, the sitter completes the service and submits a Pet Report Card. The customer can then submit a review, while the admin handles cancellations, refunds or incidents.

The Admin Dashboard is especially important because PetSaathi is not only a website. It is an operational service. The admin must control sitter verification, matching, payments, reports and safety incidents.

Role-based access is also necessary. A customer should access only their pets and bookings. A sitter should access only assigned services. Finance, operations and safety administrators should have different permissions.

Payment must never be confirmed only by the frontend. The backend must verify the Razorpay signature, payment capture, amount, currency and provider order before confirming the booking.

Full GPS tracking can be added later. During the MVP, timestamps, photos, optional location proof and manual distance are enough to test whether customers value the service.

Finally, the database must use separate tables for users, pets, sitters, bookings, payments, reports, reviews and incidents. It must also preserve status history and booking-time snapshots. This creates a smaller but reliable MVP that can support real bookings and can be expanded safely in later phases.”

PetSaathi Phase 4 — Security, Analytics, PWA and Final Approval

End-to-End Operating Model 🔐🐾

Executive decision

Your Phase 4 direction is fundamentally correct. I approve the five proposed rules, with one controlled qualification for prepaid bookings:

### Table 122

| Rule | Decision |
| --- | --- |
| Admin dashboard is P0 | Approved |
| Manual admin-controlled sitter matching | Approved |
| PWA only; no native app | Approved |
| Booking confirmed only after verified payment | Approved with controlled exceptions |
| Full GPS tracking moved to Phase 6 | Approved |

The Phase 4 win condition should be:

PetSaathi can process a real paid booking from customer request to sitter assignment, verified payment, service completion and Report Card without unsafe manual work, inconsistent records or unclear ownership.

1. Security and privacy architecture

PetSaathi will process several classes of sensitive information:

### Table 123

| Data class | Examples | Recommended protection |
| --- | --- | --- |
| Public | Service descriptions, public sitter display name | Publicly accessible |
| Personal | Name, phone, email, city | Authenticated and role-restricted |
| Operationally sensitive | Full address, access instructions, booking history | Booking- and assignment-restricted |
| Health and safety | Pet medical data, bite history, medication | Strongly restricted and audited |
| Verification | Sitter identity and police/KYC evidence | Verification-admin access only |
| Financial metadata | Amount, payment ID, refund status | Finance/admin restricted |
| Incident evidence | Photos, reports, witness notes | Safety-admin restricted |

The system should apply the following pattern:

User request

↓

Authentication

↓

Account status check

↓

Role and permission check

↓

Ownership or assignment check

↓

Resource-state check

↓

Validated business operation

↓

Audit and monitoring

Next.js currently recommends using an established authentication library instead of building complete authentication and session handling manually. It also states that authentication and authorization must be checked inside every server-side function because such functions can be called directly, not only through the visible interface.

1.1 Password and authentication security

Approved approach

Use a trusted authentication system such as:

Auth.js

Clerk

Supabase Auth

Another established provider that supports the required deployment model

Minimum requirements:

Secure password hashing

HTTP-only secure session cookies

Login throttling

Password-reset token expiry

Session revocation after password change

Account-status enforcement

MFA for privileged administrators

No passwords in logs or analytics

Do not build a custom encryption-based password system.

1.2 Role-based access control

The original rule says:

Role-based access: strict middleware

That is not sufficient by itself.

Middleware may block route navigation, but the backend must still check authorization for each operation.

Correct model

Middleware or protected layout

= first access gate

Server Action/API permission check

= authoritative access gate

Database ownership condition

= final data boundary

Customer

May access:

Their customer profile

Their pets

Their bookings

Their Report Cards

Their reviews

May not access:

Another customer’s records

Sitter earnings

Admin assignment tools

Payment reconciliation

Incident resolution

Sitter

May access:

Their profile

Offers sent to them

Their active assignments

Relevant assigned-pet instructions

Their Report Cards

Their earnings

May not access:

Other sitter assignments

Customer payment information

Unrelated customer data

Admin verification decisions

Admin

Admin rights must be separated:

Operations admin

Finance admin

Safety admin

Sitter-verification admin

Customer-support admin

Report reviewer

Super admin

OWASP recommends least privilege, deny-by-default behaviour and authorization checks on every request.

1.3 Admin access

Your original proposal says:

Admin access: only approved emails

An email allowlist is useful, but it is not a complete administrative security model.

Correct admin requirements

Invitation-only account creation

Approved email or organisation domain

Verified email

Explicit admin-role assignment

MFA

Active administrator status

Shorter session lifetime

Reauthentication for refunds, role changes and incident closure

Audit history

Immediate session revocation after suspension

An attacker who compromises one approved email should not automatically gain unrestricted platform access.

1.4 Payment-data protection

Use Razorpay Standard Checkout so that card-entry data is handled by Razorpay rather than PetSaathi.

PetSaathi may store

Razorpay order ID

Razorpay payment ID

Amount

Currency

Payment status

Signature-verification result

Capture timestamp

Refund amount/status

Webhook event ID/hash

PetSaathi must not store

Full card number

CVV

PIN

Raw banking credentials

UPI authentication credentials

Razorpay’s shared-responsibility guidance states that customer payment information should reach a merchant’s servers only when that merchant is PCI DSS certified. Razorpay’s hosted flow handles sensitive payment details and does not store secrets such as CVV or PIN.

1.5 Payment confirmation

The browser must not confirm the booking.

Correct payment process:

Backend calculates final amount

↓

Backend creates Razorpay order

↓

Customer completes Checkout

↓

Backend verifies Razorpay signature

↓

Webhook/API confirms captured payment

↓

Amount and currency checked

↓

Booking becomes CONFIRMED

Razorpay requires server-side signature verification and recommends verifying that payment reaches the captured state before fulfilling the order.

Webhook verification must use the raw request body, and webhook processing must handle duplicate, delayed and out-of-order events safely.

1.6 File-upload security

Compression alone does not make an upload safe.

For every pet image, sitter image, report photo or video:

Authenticate the uploader

Verify ownership or assignment

Allowlist file types

Check actual file signature

Enforce size and duration limits

Generate the storage filename

Store privately

Scan where available

Strip unnecessary metadata

Produce thumbnails or compressed versions

Use expiring viewing URLs

Prevent permanent public access

OWASP recommends checking authentication and authorization, allowlisting file types, limiting size and avoiding trust in browser-provided filenames and content types.

Suggested MVP limits:

### Table 124

| Media | Suggested rule |
| --- | --- |
| Images | JPEG, PNG or WebP; maximum 10 MB |
| Videos | MP4; maximum 100 MB |
| Report images | Maximum 10 |
| Report videos | Maximum 2 |
| Video duration | Configurable pilot limit |

Incident evidence may need to retain the original file separately from the compressed customer-facing version.

1.7 Database backup

“Backup enabled” is not enough.

A valid backup process must include:

Automated schedule

Encrypted storage

Separate backup location

Defined retention

Backup-failure monitoring

Restore instructions

Successful restore testing

Backup before production migrations

PostgreSQL identifies SQL dumps, filesystem backups and continuous archiving as the main backup approaches.

Recommended pilot baseline:

Provider-managed point-in-time recovery

+

daily backup/export

+

backup before every migration

+

monthly restore drill

A backup that has never been restored should be treated as unverified.

1.8 HTTPS and security headers

All production traffic must use HTTPS. OWASP notes that secure REST services should expose only HTTPS endpoints because credentials and tokens require transport confidentiality and integrity.

Also configure:

HSTS

Content Security Policy

X-Content-Type-Options

Referrer policy

Secure cookie flags

Frame restrictions

Strict CORS allowlists

Next.js specifically recommends Content Security Policy as protection against risks such as script injection and clickjacking.

1.9 Logs and monitoring

Log:

Login failures

Authorization denials

Booking transitions

Payment/webhook processing

Assignment changes

Report submission

Refund operations

Incident actions

Admin mutations

Do not log:

Passwords

Tokens

API secrets

Full addresses

Full emergency contacts

Complete medical notes

Government ID documents

Full banking information

Private media URLs

OWASP recommends application-level security logging but warns against logging credentials, tokens, financial details and sensitive personal information.

2. Privacy and legal readiness

The Digital Personal Data Protection Rules, 2025 were published in November 2025 with staged commencement. Rules 1, 2 and 17–21 took effect at publication; Rule 4 is scheduled one year after publication, and Rules 3, 5–16, 22 and 23 eighteen months after publication. As of July 13, 2026, many substantive provisions are therefore still within their staged implementation period.

PetSaathi should nevertheless design for the full model now.

Minimum Privacy Notice content

Legal identity of PetSaathi operator

Information collected

Why each category is collected

Who receives the information

Payment-provider use

WhatsApp/email-provider use

Analytics-provider use

Media use

Retention rules

Correction and deletion request process

Grievance contact

Effective date and version

Required legal pages

/privacy

/terms

/cancellation-refund-policy

/sitter-agreement

/cookie-analytics-notice

/safety

/contact-or-grievance

Each policy must be versioned.

Do not store only:

termsAccepted = true

Store:

policy code

policy version

accepted timestamp

acceptance source

A qualified Indian lawyer should review the policies before unrestricted paid public operation.

3. PWA decision

Approved: PWA-only for Phase 4

A PWA provides:

One frontend codebase

Home-screen installation

Standalone display

Mobile-friendly navigation

Faster deployment and updates

Future push-notification capability

Next.js App Router supports a web app manifest, service workers and home-screen installation.

Correct PWA scope

### Table 125

| Feature | Phase 4 decision |
| --- | --- |
| Installable application icon | Yes |
| App manifest | Yes |
| Standalone display | Yes |
| Responsive mobile layout | Yes |
| Theme and background colours | Yes |
| Mobile splash experience | Platform-generated where supported |
| Offline fallback page | Yes |
| Full offline operating mode | No |
| Push notifications | Later |
| Native Android/iOS application | Later |

Important correction: splash screen

You can configure:

name

short_name

icons

theme_color

background_color

display

start_url

The operating system/browser determines the final installation and splash-screen behaviour. Do not promise identical custom splash behaviour across Android and iOS.

3.1 Offline rules

Do not support offline completion for:

Booking submission

Payment

Sitter assignment

Start service

Complete service

Report submission

Refunds

Incident closure

When offline:

Display connection status

Disable authoritative actions

Preserve safe local drafts where appropriate

Revalidate with server after reconnecting

Never display an offline mutation as successful before server confirmation.

4. Analytics architecture

Important rule

GA4 and Clarity help understand behaviour, but PetSaathi’s database remains the source of truth for:

Bookings

Captured payments

Assignments

Completed services

Reports

Refunds

Incidents

Google prohibits sending personally identifiable information such as email addresses or personal mobile numbers to Google Analytics.

Do not send:

Customer name

Email

Phone

Full address

Pet medical notes

Bite details

Emergency contacts

Payment-provider IDs

Private media URLs

Sitter identity documents

4.1 Correct event design

Your proposed event list is useful, but some names should align with GA4 recommended events.

### Table 126

| Business action | Recommended event |
| --- | --- |
| Public page viewed | page_view |
| Book Trial CTA clicked | book_trial_click |
| Booking form opened | booking_form_started |
| Booking request submitted | booking_requested |
| Customer reaches payment | begin_checkout |
| Verified captured payment | purchase |
| Refund completed | refund |
| Customer account created | sign_up |
| Pet Profile created | pet_profile_created |
| Pet Profile completed | pet_profile_completed |
| Sitter application submitted | sitter_application_submitted and optionally generate_lead |
| Service completed | service_completed |
| Report viewed | report_viewed |
| Review submitted | review_submitted |
| Repeat booking started | repeat_booking_started |

Google recommends events such as sign_up, begin_checkout, purchase and refund for the relevant standard business actions.

Payment-event rule

Do not fire purchase from the Razorpay browser success callback.

Fire it only after:

Backend signature verified

+

payment captured

+

amount verified

+

booking/payment record committed

Use the booking public code as the transaction reference and deduplicate repeated events.

4.2 Correct funnel

Because PetSaathi uses manual matching, the funnel should include assignment before payment confirmation:

Visitor

↓

Book CTA clicked

↓

Booking form started

↓

Booking request submitted

↓

Request approved

↓

Eligible sitter assigned

↓

Payment started

↓

Payment captured

↓

Booking confirmed

↓

Service completed

↓

Report delivered

↓

Review or repeat booking

This distinction helps identify whether conversion is failing because of:

UX

Service-area availability

Sitter supply

Pricing

Payment

Service execution

4.3 Microsoft Clarity

Clarity may be useful on:

Homepage

Service pages

Pricing

Public sitter-application pages

Early booking-form screens

It should be disabled or strictly masked on:

/customer/pets/**

/customer/bookings/**

/sitter/**

/admin/**

/payment/**

/incident/**

Microsoft states that masked content is not uploaded to Clarity and that consent signals should be passed through its Consent API or a supported consent-management platform where required.

5. Correct success metrics

Your metrics are directionally good, but their denominator and timing must be defined.

Critical correction

You cannot require:

Repeat booking ≥25%

Customer rating ≥4.5

before entering Phase 5.

Those metrics require real customers and completed services, which are measured during the controlled-launch phase.

Use two separate gates.

5.1 Phase 4 exit gate: product readiness

Move from Phase 4 development into Phase 5 controlled launch when:

### Table 127

| Readiness metric | Required result |
| --- | --- |
| MVP deployed | Yes |
| Customer journey | Pass |
| Sitter journey | Pass |
| Admin journey | Pass |
| Test payment and webhook | Pass |
| Cross-user authorization tests | Pass |
| Critical incident drill | Pass |
| Production backup restore | Pass |
| Open Severity 0 bugs | 0 |
| Open Severity 1 bugs | 0 |
| Legal pages | Published and reviewed |
| Support coverage | Assigned |
| Verified pilot sitters | Available |
| Pilot area and pricing | Enabled |

“Near zero” is not appropriate for booking-blocking defects. It should be zero open critical blockers.

5.2 Phase 5 continuation and expansion metrics

After a meaningful pilot sample—recommended internally as at least 20–30 completed paid bookings—evaluate:

### Table 128

| Metric | Definition | Pilot target |
| --- | --- | --- |
| Booking-form completion | Requests submitted ÷ eligible booking-form starts | 60%+ stretch target |
| Payment success | Captured payments ÷ begin_checkout attempts | 80% minimum; 85%+ preferred |
| Assignment success | Requests assigned ÷ eligible approved requests | 90%+ |
| Report completion | Delivered reports ÷ completed services | 95% preferred; 90% minimum |
| Customer rating | Average from legitimate completed-booking reviews | 4.3–4.5+ with minimum sample |
| Repeat booking | Repeat customers ÷ customers eligible to repeat within defined period | 20–25%+ |
| Critical bugs | Open Sev 0/1 issues | 0 |
| Refund/dispute rate | Refunds or serious disputes ÷ completed paid bookings | Track and investigate |
| Incident rate | Safety incidents ÷ completed bookings | Track by severity |
| Support response | Requests answered inside pilot SLA | 90%+ |

These pilot numbers are internal operational targets, not universal industry standards.

5.3 Performance metric correction

“Page load under three seconds” is too broad.

Use Core Web Vitals at the 75th percentile:

LCP ≤ 2.5 seconds

INP ≤ 200 milliseconds

CLS ≤ 0.1

Measure mobile and desktop separately.

5.4 Mobile-usability metric

Replace “strong” with measurable checks:

Core flows completed on Android Chrome and iPhone Safari

No horizontal overflow

Forms usable with mobile keyboard

Payment works

Camera upload works

Tap targets are accessible

At least 90% UAT task completion

No critical mobile-only defect

6. Phase 4 deliverables

Approved required deliverables

### Table 129

| Deliverable | Required |
| --- | --- |
| Public website | Yes |
| PWA manifest and installation | Yes |
| Customer authentication | Yes |
| Customer dashboard | Yes |
| Structured Pet Profile | Yes |
| Booking request module | Yes |
| Server-side pricing | Yes |
| Razorpay payment verification | Yes |
| Sitter dashboard | Yes |
| Admin dashboard | Yes |
| Manual sitter assignment | Yes |
| Service start/completion | Yes |
| Report Card | Yes |
| Private media upload | Yes |
| Customer review | Yes |
| Incident management | Yes |
| Basic notifications | Yes |
| Role-based permissions | Yes |
| Audit history | Yes |
| Error monitoring | Yes |
| Analytics | Yes |
| Legal pages | Yes |
| Production deployment | Yes, initially invite-only/controlled |

7. Approval of the five upgrades

Upgrade 1 — Admin-first MVP

Decision: Approved

The Admin Dashboard is P0.

It must control:

Sitter approval

Pet-risk review

Booking review

Assignment

Payment reconciliation

Refunds

Report quality

Incidents

Pricing

Areas

Audit history

Customer visual polish should not delay critical operations.

Upgrade 2 — Manual matching

Decision: Approved

Recommended Phase 4 flow:

Customer requests

↓

Admin reviews eligibility

↓

Offers sent to eligible sitter

↓

Sitter accepts

↓

Admin confirms primary sitter

↓

Customer pays

↓

Booking confirmed

Automation may rank candidates, but it must not override:

Verification

Availability

Risk permission

Pet size

Travel range

Active restrictions

Upgrade 3 — PWA-only

Decision: Approved

Phase 4 should use:

Mobile-first responsive web application

Installable PWA

Home-screen icon

Standalone display

Safe offline fallback

Native apps should wait until there is evidence of:

Repeat usage

Need for background GPS

Need for native push

Stable product workflows

Sustainable mobile development capacity

Upgrade 4 — Prepaid booking

Decision: Approved with defined exceptions

For Phase 4 dog walking and home sitting:

Sitter assigned

+

final amount approved

+

payment captured and verified

=

booking confirmed

Do not confirm a normal booking before verified payment.

Controlled exceptions

An authorised administrator may handle:

Zero-value internal test booking

Compensation/recovery booking

Emergency service where payment cannot reasonably precede action

Approved promotional booking

Every override must include:

Admin permission

Reason code

Audit record

Payment responsibility

Customer communication

Boarding may later use deposit plus balance, but full prepayment is simpler for the Phase 4 walking/sitting pilot.

Upgrade 5 — GPS in Phase 6

Decision: Approved

Phase 4 evidence may include:

Start timestamp

Completion timestamp

Optional location check-in

Photo/video update

Manual walking distance

WhatsApp live location where appropriate and consented

Customer confirmation

Do not market this as continuous GPS route tracking.

Full GPS should wait until:

Booking volume proves the need

Sitter consent is defined

Background-location behaviour is tested

Battery impact is understood

Location retention and access policies exist

8. Improved Phase 4 final report

Phase 4 MVP Development Report

Project information

Project name:

Release version:

Pilot city:

Pilot area:

Pilot service:

MVP duration:

Report date:

Tech stack:

Deployment environment:

Production URL:

Module status

Public website:

PWA:

Customer authentication:

Customer dashboard:

Pet Profile:

Booking:

Pricing:

Payment:

Sitter dashboard:

Admin dashboard:

Sitter assignment:

Report Card:

Review:

Incident management:

Notifications:

Analytics:

Legal pages:

Monitoring:

Backups:

Use status values:

NOT_STARTED

IN_PROGRESS

READY_FOR_TEST

PASSED

PASSED_WITH_LIMITATIONS

BLOCKED

Quality and security

Unit tests:

Integration tests:

E2E tests:

Authorization tests:

Payment webhook tests:

File-upload tests:

Backup restore test:

Incident drill:

Mobile UAT:

Open Severity 0 bugs:

Open Severity 1 bugs:

Known limitations:

Pilot readiness

Verified sitters:

Enabled service areas:

Daily booking cap:

Support owner:

Safety owner:

Finance owner:

Emergency vet contacts verified:

Rollback tested:

Feature flags configured:

Decision

READY_FOR_CONTROLLED_PHASE_5

READY_WITH_RESTRICTIONS

FIX_MVP_BEFORE_LAUNCH

REBUILD_SPECIFIC_MODULE

Approvals

Product approval:

Technical approval:

Operations approval:

Safety approval:

Finance approval:

Legal review:

Mentor approval:

9. Final Phase 4 architecture

Mobile-first Next.js PWA

↓

Customer authentication

↓

Structured Pet Profile

↓

Booking request

↓

Admin-controlled review and matching

↓

Sitter acceptance

↓

Razorpay prepaid verification

↓

Confirmed service

↓

Sitter start and completion

↓

Private service updates

↓

Pet Report Card

↓

Customer review/repeat booking

↓

Admin incident, payment and quality control

Explicitly excluded

Native applications

Full GPS route tracking

AI final matching

AI risk decisions

Subscriptions

Wallet

Pet product store

Insurance engine

Large-scale public sitter marketplace

10. Final approval record

### Table 130

| Phase 4 rule | Final status |
| --- | --- |
| Admin Dashboard is P0 | APPROVED |
| Manual admin-controlled matching | APPROVED |
| PWA-only; no native applications | APPROVED |
| Verified prepaid confirmation | APPROVED WITH AUDITED EXCEPTIONS |
| Full GPS delayed until Phase 6 | APPROVED |

Final operating principle

Phase 4 is complete when PetSaathi can process one real booking safely, repeatedly and visibly—from customer request through verified payment and sitter service to Report Card and operational closure.

Phase 5 should then begin as a controlled one-area launch, not an unrestricted multi-city release.

## Representative rendered pages

- Page 1: `analysis/specs/PetSaathi_Phase_4/pages/page-1.png`

- Page 2: `analysis/specs/PetSaathi_Phase_4/pages/page-2.png`

- Page 3: `analysis/specs/PetSaathi_Phase_4/pages/page-3.png`

- Page 4: `analysis/specs/PetSaathi_Phase_4/pages/page-4.png`

- Page 5: `analysis/specs/PetSaathi_Phase_4/pages/page-5.png`

- Page 41: `analysis/specs/PetSaathi_Phase_4/pages/page-41.png`

- Page 81: `analysis/specs/PetSaathi_Phase_4/pages/page-81.png`

- Page 121: `analysis/specs/PetSaathi_Phase_4/pages/page-121.png`

- Page 161: `analysis/specs/PetSaathi_Phase_4/pages/page-161.png`

- Page 201: `analysis/specs/PetSaathi_Phase_4/pages/page-201.png`

- Page 241: `analysis/specs/PetSaathi_Phase_4/pages/page-241.png`

- Page 281: `analysis/specs/PetSaathi_Phase_4/pages/page-281.png`

- Page 321: `analysis/specs/PetSaathi_Phase_4/pages/page-321.png`

- Page 361: `analysis/specs/PetSaathi_Phase_4/pages/page-361.png`

- Page 401: `analysis/specs/PetSaathi_Phase_4/pages/page-401.png`

- Page 441: `analysis/specs/PetSaathi_Phase_4/pages/page-441.png`

- Page 481: `analysis/specs/PetSaathi_Phase_4/pages/page-481.png`

- Page 521: `analysis/specs/PetSaathi_Phase_4/pages/page-521.png`

- Page 561: `analysis/specs/PetSaathi_Phase_4/pages/page-561.png`

- Page 601: `analysis/specs/PetSaathi_Phase_4/pages/page-601.png`

- Page 641: `analysis/specs/PetSaathi_Phase_4/pages/page-641.png`

- Page 681: `analysis/specs/PetSaathi_Phase_4/pages/page-681.png`

- Page 721: `analysis/specs/PetSaathi_Phase_4/pages/page-721.png`

- Page 761: `analysis/specs/PetSaathi_Phase_4/pages/page-761.png`

- Page 801: `analysis/specs/PetSaathi_Phase_4/pages/page-801.png`

- Page 841: `analysis/specs/PetSaathi_Phase_4/pages/page-841.png`

- Page 881: `analysis/specs/PetSaathi_Phase_4/pages/page-881.png`

- Page 921: `analysis/specs/PetSaathi_Phase_4/pages/page-921.png`

- Page 960: `analysis/specs/PetSaathi_Phase_4/pages/page-960.png`

- Page 961: `analysis/specs/PetSaathi_Phase_4/pages/page-961.png`

- Page 962: `analysis/specs/PetSaathi_Phase_4/pages/page-962.png`
