# PetSaathi Phase 2 and 3

- Source: `DOCX/PetSaathi Phase 2 and 3.docx`
- Pages: 618
- Ordered content blocks: 13481
- Embedded media: 0
- Comments: 0
- Tracked insertions: 0
- Tracked deletions: 0

## Ordered content

PetSaathi Phase 2 — Manual Pilot / Concierge MVP 🐾

Main purpose of Phase 2

At this stage, PetSaathi should not build a complete marketplace application.

Instead, the business should operate manually like a premium pet-care service company. Customers submit requests through forms or WhatsApp, the operations team manually selects an appropriate sitter, payments are collected through a payment link, and service updates are delivered manually.

However, every customer, pet, sitter, booking, payment, report and complaint should be recorded in a structured format. This allows the manual operating system to become the blueprint for the future software platform.

Google Forms can collect structured responses and store them in a linked Google Sheet. Razorpay Payment Links can contain an amount, expiry date and unique reference ID, making them suitable for connecting payments with manual booking records.

1. Difference Between Phase 1 and Phase 2

Phase 1 — Validate Customer Interest

During Phase 1, PetSaathi tested whether:

Pet parents experience a real care problem.

Customers understand the proposed service.

Customers trust the service concept.

People are willing to pay a trial amount.

Potential sitters are available.

One area has enough customer interest.

The main question was:

“Will customers consider paying for PetSaathi?”

Phase 2 — Validate Real Operations

During Phase 2, PetSaathi must actually complete paid bookings.

The main question becomes:

“Can PetSaathi repeatedly deliver a safe, reliable and financially workable service?”

Phase 2 should test:

Whether bookings can be completed safely

Whether sitters arrive on time

Whether customer instructions are followed

Whether customers trust the assigned sitter

Whether service updates are useful

Whether customers book again

Whether sitter payouts and operational costs leave a margin

Whether cancellations, complaints and emergencies can be handled correctly

Simple explanation

“Phase 1 proves that customers are interested. Phase 2 proves that PetSaathi can operate as a real business.”

2. Phase 2 Duration

### Table 1

| Version | Duration | Suitable Use |
| --- | --- | --- |
| Fast pilot | 15 days | Very small test in one locality |
| Standard pilot | 30 days | Recommended operational validation |
| Deep pilot | 45–60 days | Stronger evidence before full MVP development |

Fast 15-Day Pilot

A 15-day pilot may be suitable when:

Only one small area is being tested.

Only dog walking is active.

The team wants to complete a small number of services.

Phase 1 already produced strong demand.

The limitation is that 15 days may not provide enough time to observe repeat bookings, sitter reliability and cancellation patterns.

Standard 30-Day Pilot

A 30-day pilot is the recommended option.

It provides enough time to test:

Weekday and weekend demand

Morning and evening walks

Multiple sitters

Customer follow-ups

Repeat bookings

Sitter cancellations

Service complaints

Payment and payout cycles

Society-level demand

Recommended decision

Run PetSaathi manually for 30 days in one city and only two or three nearby areas.

Deep 45–60-Day Pilot

A longer pilot may be appropriate when:

Boarding is being tested.

The team wants repeat-booking evidence.

More than one society is involved.

Sitter performance needs longer observation.

Unit economics remain uncertain.

Phase 2 results will be used before investing heavily in software.

The stated durations are internal planning choices rather than universal industry standards.

3. Main Phase 2 Rule — Do Not Automate Too Early

Wrong approach

Build the complete application → launch it → discover operational problems

This approach may lead to building features for processes that later need to change.

For example, the team may build:

Automatic sitter matching

Complex live tracking

Customer dashboards

Sitter dashboards

Automated payouts

Cancellation logic

Incident-management systems

before understanding how these activities work during real bookings.

Correct approach

Complete bookings manually → observe repeated problems → document the workflow → automate proven processes

For example:

Manually match the first 20 customers with sitters.

Record why each match was accepted or rejected.

Identify the information required for safe matching.

Create a repeatable matching rule.

Build automatic matching only after the rule is supported by evidence.

Simple explanation

“Manual operation helps PetSaathi learn what the software truly needs to do.”

4. Official Phase 2 Service Scope

The recommended Phase 2 scope is:

Dog walking + pet sitting + controlled boarding beta

PetSaathi should resist the temptation to add several unrelated services during the pilot.

4.1 Dog Walking — Active

Dog walking should be fully active during Phase 2 because it is relatively easy to test repeatedly.

It can help PetSaathi measure:

Repeat booking behaviour

Morning and evening demand

Sitter punctuality

Walk duration

Customer satisfaction

Same-sitter preference

Monthly-plan interest

Suggested options

30-minute dog walk

60-minute dog walk

One-time trial walk

Five-walk starter package

Monthly walking plan after repeat demand is proven

Required service proof

Arrival confirmation

Start and end time

Photograph or approved update

Approximate distance

Toilet and water information

Short walk report

4.2 Pet Sitting — Active

Pet sitting should also remain active because it tests a deeper level of customer trust.

The sitter may enter the customer’s home and follow feeding, water, companionship or care instructions.

The service can help PetSaathi measure:

Trust in the assigned sitter

Home-access concerns

Customer communication

Instruction-following quality

Longer-service demand

Travel-related demand

Repeat-sitter preference

Suggested services

One-hour home visit

Feeding visit

Cat-sitting visit

Two-to-four-hour sitting

Weekend sitting

Travel-period home visits

Required service proof

Arrival and departure confirmation

Food and water update

Pet mood

Toilet or litter update

Photograph or video

Final report card

Confirmation that the home was secured

4.3 Pet Boarding — Controlled Beta Only

Boarding should not be offered openly through every sitter profile.

It involves greater responsibility because the pet remains at another property for several hours or overnight.

Boarding should be limited to:

Home-assessed sitters

Known and experienced pet parents

Selected partner boarding homes

Applicants who provide home photographs

Applicants who complete a video or physical home check

Providers who accept capacity limits

Providers who accept the emergency protocol

Providers whose local operating requirements have been reviewed

Boarding checks

Confirm:

Property type

Landlord or society permission

Secure doors and windows

Balcony and terrace safety

Existing pets

Children in the home

Maximum pet capacity

Sleeping arrangement

Isolation space

Emergency transport

Nearby veterinarian

Supervision arrangements

Vaccination requirements

Boarding must also be reviewed city by city because local and state requirements may differ.

Simple explanation

“Boarding remains a controlled beta because it carries higher safety, property and regulatory risk.”

4.4 Grooming — Partner Test Only

PetSaathi should not build its own grooming operation during Phase 2.

Instead, it may test:

Referral partnerships

Society grooming camps

Introductory packages

Customer cross-referrals

Partner-quality feedback

The grooming provider remains responsible for delivering the grooming service.

PetSaathi should record whether grooming referrals create useful customer demand without distracting from the main service.

4.5 Veterinary Support — Emergency Partner Only

Veterinary support should function as a safety and referral relationship.

PetSaathi should not represent itself as a veterinary-service provider.

The partner process may include:

Preferred veterinarian details

Emergency clinic list

Operating hours

Contact procedure

Transport procedure

Customer payment responsibility

Emergency-information sharing

4.6 Pet Taxi — Not Yet

Pet taxi should remain outside Phase 2 because it introduces:

Vehicle requirements

Driver verification

Pet-restraint requirements

Transport scheduling

Route delays

Additional liability

Higher coordination complexity

4.7 Pet Training — Not Yet

Training may become a future premium service, but it requires:

Qualified trainers

Behaviour-assessment procedures

Training-plan management

Progress tracking

Clear handling standards

Stronger outcome expectations

It should not be added until walking and sitting operations are stable.

5. Phase 2 Manual Operating Model

The manual marketplace should operate through the following sequence:

Customer requests service↓Admin reviews customer and pet details↓Admin manually matches an appropriate sitter↓Customer reviews service and sitter information↓Customer pays↓Booking is confirmed↓Sitter completes the service↓Sitter sends proof and report↓Admin sends the customer report card↓Customer submits review↓Repeat booking is offered

This process is the manual version of the future marketplace engine.

6. Step-by-Step Booking Operation

Step 1 — Customer Requests a Service

The customer submits a request through:

WhatsApp Business

Customer booking form

Society campaign

Referral link

Direct customer-support call

The request should record:

Customer name

Area

Society

Pet

Required service

Date

Preferred time

Expected frequency

Basic behaviour information

The request is initially marked as New Lead.

Step 2 — Admin Checks the Pet Details

Before searching for a sitter, the admin should verify:

Pet type

Breed

Age

Weight

Vaccination status

Health conditions

Bite history

Escape history

Behaviour around strangers

Behaviour around other animals

Special equipment

Feeding or walking instructions

Emergency contact

Preferred veterinarian

Incomplete pet information should move the booking to Pet Details Pending.

The booking should not proceed merely because a customer has paid.

Step 3 — Admin Matches the Sitter Manually

The sitter should be selected using:

Approved service type

Service area

Travel distance

Availability

Pet-size experience

Behaviour-handling experience

Customer preference

Sitter rating

Cancellation history

Expected payout

The admin should record why the sitter was selected.

Example matching note

“Sitter ST-004 selected because she lives 1.4 kilometres from the customer, is available at 7:30 AM, is approved for medium-dog walking and has completed three successful trial walks.”

This decision history can later help design the automatic matching system.

Step 4 — Customer Reviews the Match

The customer should receive:

Sitter’s first name

Profile photograph

Relevant experience

Approved service

Completed verification stages

Proposed date and time

Complete price

Service inclusions

Cancellation conditions

Only accurate verification labels should be used.

Step 5 — Customer Pays

The customer receives a payment link containing:

Booking reference

Service description

Amount

Expiry

Customer reference

Payment status

Razorpay allows a unique reference ID and expiry to be added to Payment Links, and captured-payment details can be retrieved after successful payment.

Suggested reference:

BK-001-WALK-PP-008

Step 6 — Booking Is Confirmed

After payment, the customer and sitter should receive a formal booking confirmation.

The confirmation should include:

Booking ID

Customer name

Pet name

Sitter name

Service

Date

Start and end time

Address or meeting point

Price

Payment status

Service instructions

Emergency contact

Cancellation procedure

Google Calendar can be used to create an event containing the booking title, time and relevant event details. The event should remain private and should not expose unnecessary customer information.

Step 7 — Sitter Starts the Service

The sitter checks in through WhatsApp or the service report form.

The sitter records:

Arrival time

Start time

Equipment check

Pet condition

Any changed instruction

Location-sharing status where included

For a walking service, live location should be shared only when the customer has agreed and only for the relevant service period. WhatsApp allows users to share real-time location for a selected duration and control or stop the sharing.

Step 8 — Sitter Sends Proof

Proof may include:

Arrival photograph

Service photograph

Live location

Route screenshot

Feeding update

Video update

Completion photograph

The sitter should avoid capturing:

Customer family members

Private documents

Unnecessary home interiors

Society access information

Exact addresses in public media

Customer-specific media should be sent through a private conversation, not through a general sitter group.

Step 9 — Sitter Completes the Service Report

The sitter submits:

Actual start time

Actual end time

Service duration

Distance, where relevant

Food and water

Toilet activity

Pet mood

Behaviour

Instructions completed

Photographs

Health concerns

Incident status

Sitter notes

Step 10 — Admin Sends the Pet Report Card

The admin reviews the sitter’s submission before sending the final customer report.

This quality-control step can catch:

Missing photographs

Incorrect service duration

Incomplete notes

Possible health concerns

Contradictory information

Unreported incidents

Step 11 — Customer Reviews the Service

The review form should collect:

Sitter punctuality

Sitter behaviour

Communication

Quality of updates

Report-card usefulness

Overall rating

Repeat-booking intention

Same-sitter preference

Improvement suggestions

The review should be connected to the booking ID.

Step 12 — Repeat Booking Is Offered

A satisfied customer may receive:

Same-sitter rebooking

Five-walk package

Weekly schedule

Monthly plan

Weekend sitting package

A repeat offer should be made only after confirming future sitter availability.

7. Phase 2 Team Requirements

The pilot can begin with a small team.

### Table 2

| Responsibility | Initial Owner |
| --- | --- |
| Founder and administrator | Founder |
| Customer support | Founder or one assistant |
| Sitter recruitment and management | Founder |
| Booking coordination | Founder or operations assistant |
| Emergency coordination | Founder plus veterinary contacts |
| Marketing | Founder |
| Technology and data | Founder |

Founder / Admin

The founder manages:

Booking approval

Pricing

Sitter assignment

Payment confirmation

Customer escalation

Refund decisions

KPI review

Customer Support

Customer support handles:

Enquiries

Booking confirmations

Service reminders

Customer updates

Complaint intake

Review requests

Sitter Manager

The sitter manager handles:

Sitter availability

Interview and verification status

Booking assignments

Training

Performance reviews

Warnings and suspensions

Operations Coordinator

The coordinator handles:

Daily schedule

Overlapping bookings

Service starts and completions

Backup sitters

Missing reports

Late arrivals

Emergency Contact

The emergency coordinator maintains:

Customer emergency details

Veterinary contacts

Incident logs

Transport options

Escalation timeline

Lean-team warning

The statement that one person can manage the first 100 bookings is a planning hypothesis.

Whether this is realistic depends on:

Booking volume per day

Service duration

Travel patterns

Number of sitters

Customer-support demand

Incidents

Whether bookings occur simultaneously

The founder should measure administrative time per booking. If coordination quality begins to decline, support should be added before reaching an arbitrary booking number.

8. Phase 2 Tool Stack

### Table 3

| Function | Suggested Tool |
| --- | --- |
| Booking requests | WhatsApp Business and Google Forms/Tally |
| Customer CRM | Google Sheets or Airtable |
| Sitter CRM | Google Sheets or Airtable |
| Booking tracker | Google Sheets or Airtable |
| Payment | Razorpay Payment Links or business UPI |
| Scheduling | Google Calendar |
| Sitter communication | Private WhatsApp chats |
| Customer communication | WhatsApp Business |
| Temporary walk tracking | WhatsApp Live Location |
| Service reports | Structured form |
| Customer report card | WhatsApp template or Google Doc |
| Reviews | Google Form |
| Testimonials | Consent-based text or media |
| Analytics | Manual KPI dashboard |

Google Forms and Sheets

Google Forms can collect structured responses, and the responses can be stored in a new or existing Google Sheet. Collaborator access must be reviewed carefully because a form collaborator may also have access to the linked response spreadsheet.

Use separate forms for:

Customer booking requests

Pet profiles

Sitter applications

Service reports

Customer reviews

Incident reports

Do not enable public response summaries for forms containing customer or sitter information because response summaries can expose submitted answers to other responders.

WhatsApp Business

The WhatsApp Business app is designed for small businesses and provides messaging and business-profile tools for professional customer communication.

Use it for:

New enquiries

Booking confirmations

Service reminders

Customer updates

Quick replies

Review requests

Avoid placing customer addresses, medical information or incident details in general WhatsApp groups.

Razorpay Payment Links

Payment Links are useful because PetSaathi can accept payments without building a complete checkout system.

Use:

One unique reference per booking

Clear service description

Correct amount

Defined expiry

Payment-status tracking

Refund reference

Google Calendar

Google Calendar can be used to record:

Service time

Sitter assignment

Booking ID

Reminder

Travel buffer

Follow-up task

Create a separate private PetSaathi operations calendar instead of placing sensitive booking details in a personal or public calendar. Google Calendar allows separate calendars and event details to be created and managed.

WhatsApp Live Location

WhatsApp Live Location may be used temporarily for dog-walking trials.

It should not become the permanent tracking architecture.

Use it only when:

The sitter agrees

The customer agrees

The walk has started

The sharing duration is appropriate

Sharing stops after the service

9. Database Thinking During the Manual Pilot

Although PetSaathi is using spreadsheets, information should be structured like a relational database.

This means:

Every record receives a unique ID.

Information is not unnecessarily repeated.

Related records are connected using IDs.

Status values use standard options.

Dates and money use consistent formats.

Sensitive records have restricted access.

9.1 Customers Table

This table stores pet-parent information.

Suggested fields:

Customer ID

Full name

Mobile number

WhatsApp number

Email

City

Area

Society

Preferred language

Contact permission

Account or lead status

Created date

Example ID:

PP-001

9.2 Pets Table

Each pet receives a separate record.

Suggested fields:

Pet ID

Customer ID

Pet name

Species

Breed

Age

Weight

Vaccination status

Medical conditions

Behaviour notes

Bite history

Escape history

Feeding instructions

Walking instructions

Veterinary contact

Example:

PET-001 belongs to PP-001.

This structure supports customers who own more than one pet.

9.3 Sitters Table

Suggested fields:

Sitter ID

Full name

City

Area

Contact information

Experience

Approved services

Availability

Travel radius

Verification level

Training status

Average rating

Cancellation rate

Account status

9.4 Bookings Table

This is the central operational table.

Suggested fields:

Booking ID

Customer ID

Pet ID

Sitter ID

Service

Date

Start time

End time

Location

Customer price

Sitter payout

Booking status

Payment status

Report status

Review status

Incident flag

9.5 Payments Table

Suggested fields:

Payment ID

Booking ID

Customer amount

Payment-link reference

Payment date

Payment status

Refund amount

Refund status

Sitter payout

Payout date

Platform contribution

Do not store complete UPI credentials, PINs or card details.

9.6 Reports Table

Suggested fields:

Report ID

Booking ID

Sitter ID

Start time

End time

Distance

Food and water

Toilet information

Mood

Behaviour

Health concern

Media references

Sitter note

Submission time

9.7 Reviews Table

Suggested fields:

Review ID

Booking ID

Customer ID

Sitter ID

Rating

Review text

Same-sitter request

Repeat-booking interest

Testimonial consent

Submission date

9.8 Incidents Table

Suggested fields:

Incident ID

Booking ID

Reported by

Incident category

Severity

Time

Description

Immediate action

Customer contacted

Veterinarian contacted

Evidence

Investigation status

Resolution

Refund or compensation

Closure date

9.9 Societies Table

Suggested fields:

Society ID

Society name

City

Area

Contact person

Estimated pet families

Partnership status

Survey permission

Pilot interest

Meeting date

Next action

9.10 Partners Table

Suggested fields:

Partner ID

Partner type

Organisation name

Area

Contact person

Services

Operating hours

Emergency availability

Referral agreement

Status

Next follow-up

10. Data-Protection Basics

The CRM may contain names, phone numbers, addresses, pet-health information, sitter documents, live-location information and emergency contacts.

India’s Digital Personal Data Protection Act covers lawful processing of digital personal data. The final Digital Personal Data Protection Rules, 2025 use a phased commencement schedule, so PetSaathi should review the specific provisions in force when the pilot begins and design its system for clear notices, controlled access, security and appropriate retention.

Minimum operational protections should include:

Collect only information needed for the service.

Explain why each category is collected.

Restrict spreadsheet and document access.

Keep identity documents outside general CRM views.

Do not share complete customer addresses before assignment.

Stop live location after the service.

Separate service-photo consent from marketing consent.

Define data-retention periods.

Remove access when a team member leaves.

Maintain an incident-response procedure.

These documents should be reviewed by an appropriate Indian legal professional before scaling paid operations.

11. Booking Lifecycle

The following status flow should become the standard Phase 2 booking lifecycle.

### Table 4

| Status | Meaning |
| --- | --- |
| New Lead | Customer requested information or service |
| Contacted | Admin communicated with the customer |
| Pet Details Pending | Required pet information is incomplete |
| Sitter Matching | Admin is searching for a suitable sitter |
| Sitter Assigned | A proposed sitter has been selected |
| Payment Pending | Payment link has been sent |
| Confirmed | Required payment has been received |
| Service Started | Sitter formally began the service |
| Service Completed | Sitter finished the service |
| Report Sent | Customer received the service report |
| Review Requested | Customer was asked for feedback |
| Closed | Booking and follow-up are complete |
| Repeat Offered | Customer received another booking offer |
| Cancelled | Booking was cancelled |
| Refunded | Applicable refund was processed |

New Lead

A customer has submitted a request, but the team has not yet reviewed it.

No sitter should be reserved permanently at this stage.

Contacted

The admin has spoken with or messaged the customer.

The team should record:

Contact date

Communication channel

Customer response

Next action

Pet Details Pending

The customer has not provided all the information required for safe service delivery.

Examples include:

Missing behaviour information

Missing emergency contact

Unclear vaccination status

Incomplete address

Unknown pet size

Sitter Matching

The team is reviewing suitable sitters.

The admin should compare:

Area

Availability

Approved service

Experience

Travel time

Payout

Customer preferences

Sitter Assigned

A sitter has been proposed and has accepted the booking.

The customer should still review the sitter and service terms.

Payment Pending

The complete price and payment link have been sent.

The booking is not yet fully confirmed.

A time limit may be applied so that a sitter is not blocked indefinitely.

Confirmed

The required payment has been received, the sitter is assigned and the customer has received confirmation.

This is the point at which the service becomes operationally committed.

Service Started

The sitter has arrived and begun the service.

Record:

Actual start time

Arrival confirmation

Tracking status

Pet condition

Service Completed

The sitter has completed the agreed service.

The booking should not be marked complete until:

The pet has been safely returned or secured.

The end time is recorded.

Required evidence is submitted.

Any incident is reported.

Report Sent

The admin or sitter has sent the completed pet report card to the customer.

Review Requested

The customer has received a review link or structured feedback request.

Closed

The booking is financially and operationally complete.

There should be:

No unresolved payment

No missing report

No open complaint

No unresolved incident

Repeat Offered

A follow-up service or package has been offered.

This status may occur before or after closure, but the operational workflow should define one consistent rule.

Cancelled

The record should state:

Who cancelled

When cancellation occurred

Reason

Refund eligibility

Sitter compensation

Replacement attempt

Refunded

The agreed refund has been completed.

Record:

Refund amount

Refund date

Payment reference

Reason

Authorising person

12. Recommended Additional Statuses

The proposed flow is strong, but Phase 2 may also require:

Sitter Declined

Sitter Replacement Required

Customer Confirmation Pending

Service Paused

Incident Open

Dispute Open

Refund Pending

Sitter Payout Pending

Sitter Paid

Customer No-Show

Sitter No-Show

These can be introduced when actual operations demonstrate a need.

13. Booking Status Transition Rules

The future system should not permit every status to change into any other status.

Examples:

New Lead may move to Contacted or Cancelled.

Contacted may move to Pet Details Pending or Sitter Matching.

Sitter Assigned may move to Payment Pending.

Payment Pending may move to Confirmed, Cancelled or Expired.

Confirmed may move to Service Started or Cancelled.

Service Started may move to Service Completed or Incident Open.

Service Completed may move to Report Sent.

Report Sent may move to Review Requested.

Review Requested may move to Closed or Repeat Offered.

Every transition should record:

Previous status

New status

Date and time

Person making the change

Reason

Notes

This history can later become a booking_status_history database table.

14. Phase 2 Success Metrics

The 30-day manual pilot should measure more than booking volume.

Demand

Booking requests

Qualified requests

Paid bookings

Completed bookings

Repeat-booking requests

Service demand by area

Service demand by time slot

Sitter Reliability

Booking acceptance rate

On-time arrival rate

Sitter cancellation rate

Report completion rate

Customer rating

Repeat-sitter requests

Incident count

Customer Trust

Meet-and-greet requests

Safety objections

Same-sitter preference

Review rating

Referral rate

Complaint rate

Operations

Average time to assign a sitter

Average support time per booking

Replacement-sitter rate

Report-card delivery time

Refund-processing time

Number of manual errors

Finance

Customer price

Sitter payout

Payment cost

Support cost

Refund cost

Contribution per booking

Contribution by service

Customer-acquisition cost

15. Phase 2 Go / No-Go Conditions

Move toward software MVP when:

Paid bookings are completed repeatedly.

Customers request repeat services.

One or two areas show density.

Sitters arrive reliably.

Service reports are completed consistently.

Pricing provides a plausible positive contribution.

Common complaints can be addressed with a defined process.

Manual coordination has identifiable bottlenecks.

The team knows which steps should be automated first.

Extend the manual pilot when:

Demand is strong but repeat usage is unclear.

Customer satisfaction is good but sitter supply is weak.

One service performs well but another remains uncertain.

Unit economics require more evidence.

Boarding requires additional checks.

The sample of completed bookings is still too small.

Do not build the full MVP when:

Bookings remain mostly unpaid.

Customers use the service once only because of heavy discounts.

Sitters repeatedly cancel or arrive late.

Safety incidents remain unresolved.

Demand remains geographically scattered.

Customer price cannot support sitter payouts.

The operations team cannot complete services consistently.

Final Recommended Phase 2 Structure

### Table 5

| Decision Area | Recommendation |
| --- | --- |
| Duration | 30-day manual pilot |
| Geography | One city and two or three nearby areas |
| Core services | Dog walking and pet sitting |
| Boarding | Controlled beta only |
| Grooming | Partner test |
| Veterinary support | Emergency/referral partner |
| Customer channel | WhatsApp Business plus structured forms |
| Operations | Manual admin matching |
| Payments | Booking-linked payment links |
| Scheduling | Private operations calendar |
| Tracking | Temporary, consent-based live location |
| Reports | Structured sitter form and customer report card |
| Data | Separate linked CRM tables |
| Automation | Only after a process is repeatedly validated |

Simple explanation for professor

“Phase 2 is the PetSaathi Manual Pilot or Concierge MVP. At this stage, I will not build a complete application. I will manage real paid bookings manually using WhatsApp, structured forms, spreadsheets, payment links and Google Calendar. Dog walking and pet sitting will remain active, while boarding will be offered only as a controlled beta through carefully checked providers. Every customer, pet, sitter, booking, payment, report, review and incident will receive a separate structured record. The booking will move through defined statuses from New Lead to Closed or Repeat Offered. During the 30-day pilot, I will measure sitter punctuality, customer trust, repeat bookings, complaints, cancellations, refunds and contribution per booking. The future software will automate only the processes that have been proven through real manual operations.”

PetSaathi Phase 2 — Week 1, Day 1: Operations Setup

Main goal of Day 1

The purpose of Day 1 is to create the complete manual operating system required to accept, manage and complete PetSaathi’s first paid bookings.

By the end of the day, the team should have:

A final list of active services

A structured booking tracker

A separate payment tracker

A sitter-payout calculation sheet

A standard pet report card

Clear cancellation and refund rules

A documented emergency protocol

A successfully completed internal dry run

These documents and trackers should be prepared before accepting live bookings. The team should first prove that one booking can move safely from request to completion without missing important information.

Day 1 Schedule

### Table 6

| Time | Task | Required Output |
| --- | --- | --- |
| 09:00–09:30 | Finalise active services | Walking, sitting and controlled boarding-beta scope |
| 09:30–10:30 | Create booking tracker | Operational booking sheet |
| 10:30–11:30 | Create payment tracker | Customer-payment and refund records |
| 11:30–12:30 | Create sitter-payout sheet | Transparent payout calculations |
| 12:30–13:30 | Lunch | — |
| 13:30–14:30 | Create report-card template | WhatsApp-ready customer update |
| 14:30–15:30 | Create cancellation/refund rules | Basic written policy |
| 15:30–16:30 | Create emergency protocol | Incident-escalation flow |
| 16:30–18:00 | Test the complete booking flow | Internal dry run and issue list |

09:00–09:30 — Finalise the Active Services

During this session, I will define exactly which services PetSaathi can safely deliver during the manual pilot.

The official Phase 2 scope should remain limited to:

Dog walking

Pet sitting

Controlled pet-boarding beta

Other services should remain outside the core pilot until walking and sitting operations are stable.

Service 1: Dog Walking — Active

Dog walking should be available as a normal Phase 2 service.

Suggested service options

30-minute dog walk

60-minute dog walk

One-time trial walk

Five-walk starter package

Monthly walking plan after repeat demand is confirmed

Every walking booking should include

Confirmed date and time

Assigned sitter

Pet behaviour details

Harness or collar instructions

Arrival confirmation

Actual start and end time

Photograph or agreed update

Approximate distance

Toilet and water update

Final walk report

Walking restrictions

PetSaathi may decline or delay a booking when:

The dog has undisclosed bite behaviour.

The dog has serious escape tendencies.

The equipment is unsafe.

The sitter is not experienced with the pet’s size or behaviour.

Extreme weather makes the walk unsafe.

Emergency information is incomplete.

Output

A standard walking-service definition explaining duration, inclusions, exclusions and safety requirements.

Service 2: Pet Sitting — Active

Pet sitting should be available for customers who require care inside their home.

Suggested sitting options

One-hour home visit

Feeding and companionship visit

Cat-sitting visit

Two-to-four-hour sitting

Weekend sitting

Multiple visits during travel

Every sitting booking should include

Home-access instructions

Approved rooms or areas

Feeding instructions

Drinking-water instructions

Toilet or litter requirements

Pet behaviour details

Arrival and departure confirmation

Photograph or video update

Final service report

Confirmation that the home was secured

Sitting restrictions

The sitter must not:

Invite another person into the customer’s home.

Enter unrelated private areas.

provide unapproved food or treatment.

publish customer-home photographs.

leave the property unlocked.

transfer the booking to another person.

Output

A standard pet-sitting definition with clear home-access, privacy and reporting rules.

Service 3: Pet Boarding — Controlled Beta

Boarding should not be publicly available through every sitter.

It should be offered only through:

Home-assessed boarding hosts

Approved partner boarding homes

Experienced pet parents who pass the required checks

Providers who accept capacity limits

Providers who accept the emergency protocol

Providers whose premises meet PetSaathi’s safety requirements

Boarding approval should check

Property type

Society or landlord permission

Secure doors, windows and balconies

Existing pets

Children in the home

Sleeping arrangements

Maximum boarding capacity

Supervision availability

Emergency transport

Veterinary access

Vaccination requirements

Separation space for incompatible animals

Boarding status wording

Use:

Controlled boarding beta available after provider, pet and location review.

Do not use:

Safe boarding guaranteed for every pet.

Output

A restricted boarding-beta policy stating who may provide the service and when PetSaathi may reject the booking.

Final service-scope table

### Table 7

| Service | Status | Initial priority |
| --- | --- | --- |
| 30-minute dog walk | Active | High |
| 60-minute dog walk | Active | Medium |
| One-hour pet sitting | Active | High |
| Extended pet sitting | Active with review | Medium |
| Cat sitting | Active where suitable | Medium |
| Boarding | Controlled beta | Restricted |
| Grooming | Partner referral only | Not core |
| Veterinary support | Emergency/referral only | Not a PetSaathi medical service |
| Pet taxi | Not active | Future |
| Training | Not active | Future |

Simple explanation for professor

“I limited Phase 2 to dog walking, pet sitting and controlled boarding. This prevents the team from managing too many different operational risks at the same time.”

09:30–10:30 — Create the Booking Tracker

During this session, I will create the main booking sheet used to monitor every service from the initial request to closure.

The tracker should function like the future bookings database table.

Every booking must receive a unique booking ID.

Example

BK-0001

Recommended booking-tracker columns

Identification

Booking ID

Date request received

Customer ID

Pet ID

Sitter ID

Society ID, where relevant

Lead source

Service information

Service type

Service duration

Booking date

Scheduled start time

Scheduled end time

Area

Society

Service address status

Number of pets

Pet and safety status

Pet details complete

Behaviour reviewed

Vaccination information received

Bite history checked

Escape history checked

Emergency contact received

Veterinarian information received

Meet-and-greet required

Risk level

Matching information

Matching started

Proposed sitter

Sitter availability confirmed

Sitter accepted

Customer approved sitter

Backup sitter

Matching notes

Financial information

Customer price

Payment status

Payment ID

Sitter payout

Refund status

Service operation

Booking status

Actual arrival time

Actual start time

Actual end time

Update received

Report received

Incident flag

Customer notified

Completion information

Report sent

Review requested

Review received

Rating

Repeat offered

Repeat accepted

Closure date

Final notes

Standard booking statuses

Create a controlled dropdown containing:

New Lead

Contacted

Pet Details Pending

Sitter Matching

Sitter Assigned

Customer Approval Pending

Payment Pending

Confirmed

Service Started

Service Completed

Report Sent

Review Requested

Repeat Offered

Closed

Cancelled

Incident Open

Refund Pending

Refunded

Google Sheets supports controlled in-cell dropdown lists through its data-validation feature. Dropdowns reduce inconsistent entries such as “complete,” “completed,” and “done” appearing as separate statuses.

Booking-status rules

A booking should not jump directly from New Lead to Confirmed.

The normal flow should be:

New Lead→ Contacted→ Pet Details Pending or Sitter Matching→ Sitter Assigned→ Customer Approval Pending→ Payment Pending→ Confirmed→ Service Started→ Service Completed→ Report Sent→ Review Requested→ Closed or Repeat Offered

Example booking record

### Table 8

| Field | Example |
| --- | --- |
| Booking ID | BK-0001 |
| Customer ID | PP-0012 |
| Pet ID | PET-0015 |
| Sitter ID | ST-0004 |
| Service | 30-minute dog walk |
| Area | Vesu |
| Date | 20 July |
| Time | 7:30–8:00 AM |
| Customer price | ₹149 |
| Payment status | Paid |
| Booking status | Confirmed |
| Risk level | Low |
| Report status | Pending |
| Review status | Not requested |

Booking sheet quality rules

Use one row for one booking.

Do not combine several bookings in one row.

Do not delete cancelled bookings.

Do not overwrite the original price after a refund.

Use standard date and time formats.

Record who changed important statuses.

Restrict complete address access.

Separate operational notes from customer-visible notes.

Use booking IDs in all payment and report records.

Output

A booking tracker that clearly shows the current state and next action for every service.

Simple explanation for professor

“I created one structured booking record for every service so the team can see what has been completed, what is pending and who is responsible for the next action.”

10:30–11:30 — Create the Payment Tracker

During this session, I will create a separate sheet for customer payments, refunds and settlement reconciliation.

The payment tracker should not be merged completely into the booking tracker because one booking may have several financial events, such as:

Initial deposit

Remaining balance

Partial refund

Full refund

Adjustment

Additional-pet charge

Razorpay Payment Links allow businesses to accept payments without a website or application, and their status can be tracked after creation.

Recommended payment-tracker columns

Payment identification

Payment ID

Booking ID

Customer ID

Payment-link ID

Payment reference

Payment method

Payment provider

Amount details

Service amount

Additional charges

Discount

Total amount requested

Amount received

Payment fee

Tax on payment fee, where applicable

Net settlement expected

Status information

Link-created date

Link expiry date

Payment status

Payment date

Payment confirmation source

Settlement status

Settlement date

Refund information

Refund requested

Refund reason

Refund type

Refund amount

Refund initiated date

Refund reference

Refund status

Expected customer-credit date

Actual completion date

Approved by

Recommended payment statuses

Not Created

Link Created

Sent

Pending

Paid

Failed

Expired

Cancelled

Partially Refunded

Refund Pending

Fully Refunded

Disputed

A booking should be marked as Confirmed only after the payment provider confirms successful payment.

Payment reference format

Use a unique reference such as:

BK0001-WALK-PP0012

This helps connect the payment with:

The booking

The customer

The service

Razorpay supports full and partial refunds for captured payments. Refunds can be created through the Dashboard or APIs.

Razorpay states that normal refunds may take approximately five to ten business days to appear in the customer’s account, depending on the payment method and bank. PetSaathi should therefore distinguish between refund initiated and refund completed.

Settlement reconciliation

The team should compare:

Customer amount paid

Payment-provider fee

Tax or adjustment

Amount settled to PetSaathi

Settlement date

Sitter payout

Remaining platform contribution

Razorpay’s settlement dashboard provides settlement totals, fees, taxes and adjustments.

Example payment record

### Table 9

| Field | Example |
| --- | --- |
| Payment ID | PAY-0001 |
| Booking ID | BK-0001 |
| Customer amount | ₹149 |
| Payment status | Paid |
| Paid date | 20 July |
| Refund status | Not applicable |
| Settlement status | Pending |
| Sitter payout | ₹105 |
| Expected contribution | ₹44 before other costs |

Output

A payment tracker that distinguishes payment, settlement, refund and sitter-payout events.

Simple explanation for professor

“I created a separate financial tracker so customer payments, gateway settlements, refunds and sitter earnings can be reconciled correctly.”

11:30–12:30 — Create the Sitter-Payout Sheet

During this session, I will define exactly how sitter earnings are calculated and when they become payable.

The sitter should see the expected payout before accepting a booking.

Recommended payout-sheet columns

Identification

Payout ID

Booking ID

Sitter ID

Sitter name

Service

Service date

Calculation

Customer price

Discount funded by PetSaathi

Platform commission

Base sitter payout

Additional-pet payout

Travel allowance

Peak-time incentive

Bonus

Penalty or adjustment

Final sitter payout

Completion controls

Service completed

Report submitted

Incident open

Complaint open

Payout eligible

Payout status

Payout date

Transaction reference

Approved by

Basic payout formula

A simple pilot formula may be:

Final payout = Base payout + approved add-ons + travel allowance + bonus − valid adjustments

Example

### Table 10

| Item | Amount |
| --- | --- |
| Customer price | ₹149 |
| Base sitter payout | ₹105 |
| Travel allowance | ₹10 |
| Performance bonus | ₹5 |
| Adjustment | ₹0 |
| Final payout | ₹120 |
| Remaining gross platform amount | ₹29 |

The remaining amount is not automatically profit because payment fees, customer support, marketing and refund costs still have to be deducted.

Payout eligibility rules

A sitter becomes eligible for payment when:

The service was completed.

The actual start and end times were recorded.

Required updates were submitted.

The report card was completed.

No serious undisclosed incident exists.

The booking was not fraudulent.

The correct sitter completed the service.

Payment should not be withheld merely because a customer has not yet submitted a review.

Suggested payout statuses

Not Eligible

Pending Service

Pending Report

On Hold — Incident

Approved

Processing

Paid

Failed

Adjusted

Cancellation compensation

The payout sheet should also record whether the sitter is entitled to compensation when:

The customer cancels shortly before the service.

The sitter arrives but the customer is unavailable.

The pet is not safely available for service.

Building access is not provided.

The booking cannot proceed because of incorrect customer information.

The amount should follow the written cancellation policy rather than being decided differently for every booking.

Sitter-payout transparency message

Booking payout: ₹[amount]Service: [service]Duration: [duration]Additional payout: [amount or none]Payout condition: Service and required report must be completed.Expected payout date: [date or payout cycle]

Output

A sitter-payout system that is understandable, traceable and consistent across bookings.

Simple explanation for professor

“I created a separate payout sheet so every sitter knows the expected earnings and the team can verify when the payment becomes due.”

12:30–13:30 — Lunch Break

I will take a lunch break after completing the service, booking, payment and payout structures.

Before leaving, I will check that:

Booking IDs link correctly with payments.

Payment IDs link correctly with refunds.

Booking IDs link correctly with sitter payouts.

Status names are consistent.

Sample calculations are correct.

Sensitive information is not unnecessarily visible.

13:30–14:30 — Create the Pet Report-Card Template

During this session, I will create one structured report that the sitter completes after every service.

The report should be short enough for daily use but detailed enough to provide service proof and identify problems.

PetSaathi Pet Report Card

Booking ID:Pet name:Customer ID:Sitter:Service:Date:

Service Timing

Scheduled start:Actual start:Actual end:Total duration:Delay: Yes/NoDelay reason:

Walk Information

Complete this section for dog walking.

Approximate distance:Route or location update: Shared/Not included/FailedPee: Yes/NoPoop: Yes/NoWaste collected: Yes/NoWater break: Yes/NoLeash behaviour: Calm/Pulling/Reactive/OtherInteractions with other animals:

Sitting Information

Complete this section for pet sitting.

Food provided: Yes/No/Not requiredWater refreshed: Yes/NoToilet or litter update:Play or companionship:Home secured after service: Yes/NoInstructions completed: Yes/No

Pet Condition

Mood:Energy level:Behaviour:Visible health concern:Unusual event:Incident reported: Yes/No

Media

Photographs attached: Yes/NoVideo attached: Yes/NoLocation proof attached: Yes/No/Not required

Sitter Note

[Write a short factual observation without making a medical diagnosis.]

Completion

Report submitted at:Admin reviewed:Customer notified:

WhatsApp-ready report example

PetSaathi Report Card 🐾

Pet: BrunoService: 30-minute dog walkTime: 7:31 AM–8:01 AMDistance: Approximately 1.2 kmPee: YesPoop: YesWater break: YesMood: Happy and active

Sitter note: Bruno walked calmly and responded well to leash guidance. No unusual behaviour was observed during the walk.

Photos are attached.Booking ID: BK-0001

Report-card quality rules

The sitter should:

Use factual language.

Record actual times.

Report missing instructions.

disclose unexpected behaviour.

avoid medical diagnoses.

attach only relevant media.

submit the report promptly.

report serious concerns immediately instead of waiting until the service ends.

Output

A report-card template ready for WhatsApp and CRM storage.

Simple explanation for professor

“I created a standard report that gives customers clear evidence about the service and gives PetSaathi consistent operational data.”

14:30–15:30 — Create Cancellation and Refund Rules

During this session, I will prepare a basic written policy covering cancellations by the customer, sitter and PetSaathi.

The policy should be shown before the customer pays.

India’s Consumer Protection (E-Commerce) Rules state that an e-commerce entity should not impose cancellation charges on a consumer unless similar charges are also borne by the entity when it cancels unilaterally. The policy should therefore be balanced and clearly explain both customer and provider cancellation consequences.

Final legal wording should be reviewed by an Indian lawyer before wider commercial use.

Customer cancellation

More than 24 hours before service

Full refund or full booking credit

Clearly disclose whether any non-recoverable payment-processing cost applies

Between 6 and 24 hours

Proposed 50% refund

Remaining amount may fund sitter compensation and administrative cost

Less than 6 hours

No automatic cash refund

Partial credit may be considered for documented emergencies

Customer no-show or access failure

When the sitter arrives but cannot access the pet:

The sitter waits for the stated period.

PetSaathi attempts to contact the customer.

Arrival proof is recorded.

The booking may be treated as a customer no-show.

The sitter may receive the approved cancellation payout.

Sitter cancellation

When the sitter cancels:

Inform the customer immediately.

Attempt to find an approved replacement.

Obtain customer approval for the replacement.

Do not increase the price without approval.

Provide a full refund when no suitable replacement is found.

Record the cancellation against sitter performance.

Repeated sitter cancellations may lead to:

Coaching

Warning

Temporary suspension

Lower booking priority

Removal from the platform

PetSaathi cancellation

PetSaathi may cancel when:

No suitable sitter is available.

Required pet information is missing.

The pet or environment presents an unacceptable safety risk.

Payment has failed.

Severe weather prevents safe service.

A legal or operational problem prevents delivery.

When PetSaathi cancels after accepting payment, the customer should generally receive a full refund for the undelivered service.

Complaint-related refund

When a customer reports that the service was incomplete or materially different:

Open a complaint record.

Preserve payment and payout status.

Review messages, times, photographs and reports.

Obtain the sitter’s explanation.

Obtain the customer’s explanation.

Decide whether a full refund, partial refund, credit or no refund applies.

document the reason.

Refund communication template

Your refund of ₹[amount] for booking [Booking ID] was initiated on [date].

Reason: [reason]Refund reference: [reference]Current status: Refund initiated

Depending on the payment method and bank, the amount may take several business days to appear in your account.

Output

A clear policy covering customer cancellation, sitter cancellation, no-shows, service failure and complaints.

Simple explanation for professor

“I created consistent cancellation and refund rules so customers and sitters understand the financial result before accepting a booking.”

15:30–16:30 — Create the Emergency Protocol

During this session, I will define what the sitter and PetSaathi team must do during a serious pet or property incident.

The sitter should not attempt to diagnose a medical condition.

The American Veterinary Medical Association advises contacting the regular veterinarian or a local veterinary emergency hospital during an emergency so the facility can prepare for the animal’s arrival.

Events that activate the protocol

Pet escapes

Vehicle accident

Animal bite

Serious bleeding

Breathing difficulty

Seizure

Collapse or unconsciousness

Suspected poisoning

Heat-related illness

Serious allergic reaction

Fire, flood or unsafe property

Human injury

Theft or home-security incident

Emergency escalation flow

Step 1: Protect immediate safety

The sitter should move the pet away from immediate danger only when this can be done safely.

Step 2: Contact PetSaathi

The sitter should call the emergency operations contact immediately.

A WhatsApp text alone may be insufficient for a serious event.

Step 3: Contact the customer

Call the pet parent.

When the customer cannot be reached, contact the registered emergency person.

Step 4: Contact veterinary support

Call:

The pet’s regular veterinarian

The approved emergency clinic

Another nearby veterinary hospital if necessary

Step 5: Follow professional guidance

The sitter should follow veterinary instructions within their actual training and authority.

Step 6: Arrange transport

Use the agreed safe transport method.

Step 7: Record the incident

Record:

Booking ID

Incident time

Location

What happened

Pet condition

Immediate action

People contacted

Veterinary instructions

Transport details

Expenses

Photographs where appropriate

Current outcome

Step 8: Review after the incident

Send a written incident summary.

Place the booking under review.

Hold payout only where a legitimate investigation requires it.

Review safety compliance.

decide whether training or suspension is required.

update the protocol where necessary.

Lost-pet procedure

When a pet escapes:

Report it immediately.

State the last known location and time.

Contact PetSaathi and the owner.

Search the immediate area safely.

Check gates, guards and CCTV access.

Contact local animal-support resources where required.

Give the owner regular updates.

Maintain a complete timeline.

The sitter must never delay reporting because they fear disciplinary action.

Emergency-contact card

Every active booking should have:

Pet parent’s primary number

Secondary emergency contact

Regular veterinarian

Emergency clinic

PetSaathi emergency number

Pet medical summary

Transport authorisation

Spending-authorisation limit

Output

A step-by-step emergency procedure available to the admin and every assigned sitter.

Simple explanation for professor

“I created a clear emergency flow so the sitter knows who to contact, what actions are allowed and what information must be recorded.”

16:30–18:00 — Test the Complete Booking Flow Internally

During this session, I will simulate one or more bookings without involving a real customer or pet.

The purpose is to find process failures before the first live booking.

Dry Run 1 — Successful Dog-Walking Booking

Scenario

Customer: Test Customer A

Pet: Bruno

Service: 30-minute dog walk

Price: ₹149

Sitter: Test Sitter 1

Date: Tomorrow

Time: 7:30 AM

Steps to test

Customer request enters the booking tracker.

Customer and pet IDs are assigned.

Pet information is reviewed.

Booking moves to Sitter Matching.

Suitable sitter is selected.

Sitter accepts the test booking.

Customer receives sitter information.

Payment link is created using the booking reference.

Test payment status is simulated.

Booking moves to Confirmed.

Calendar reminder is created.

Sitter check-in is simulated.

Photo/update process is tested.

Report card is submitted.

Customer report is sent.

Review request is tested.

Payout calculation is checked.

Booking moves to Closed.

Dry Run 2 — Customer Cancellation

Scenario

The customer cancels three hours before the service.

Test:

Cancellation-policy classification

Refund amount

Sitter compensation

Payment-tracker update

Booking-status update

Customer message

Sitter message

Refund reference

CRM notes

Dry Run 3 — Sitter Cancellation

Scenario

The sitter cancels one hour before the booking.

Test:

Customer notification

Backup-sitter search

Replacement approval

Original sitter-performance record

Refund process when no replacement exists

Operations escalation

Dry Run 4 — Emergency Incident

Scenario

During the walk, the pet develops breathing difficulty.

Test:

Sitter emergency call

Customer contact

Emergency-contact fallback

Veterinarian contact

Booking marked Incident Open

Incident form

Report handling

Payment and payout review

Post-incident communication

Dry Run 5 — Payment Failure

Scenario

The customer opens the payment link, but the payment fails.

Test:

Payment remains unpaid.

Booking does not become confirmed.

Sitter is not incorrectly dispatched.

Customer receives a retry option.

Expired links are not reused.

Payment status matches the booking status.

Internal testing checklist

Booking tracker

Unique booking ID works.

Status dropdowns work.

Required fields are visible.

Cancelled records remain available.

Customer and sitter IDs link correctly.

Payment tracker

Payment reference matches booking ID.

Paid and pending statuses are distinct.

Settlement fields work.

Partial refund can be recorded.

Full refund can be recorded.

Payout sheet

Base payout calculates correctly.

Add-ons work.

Cancellation compensation works.

Incident hold works.

Final payment reference can be stored.

Report card

WhatsApp version is readable.

Sitter form captures required information.

Missing fields are identifiable.

Media links are accessible only to authorised people.

Cancellation policy

Customer cancellation works.

Sitter cancellation works.

PetSaathi cancellation works.

No-show scenarios are covered.

Emergency process

Contact numbers are available.

Escalation sequence is understood.

Incident record is created.

Team members know their responsibilities.

Dry-Run Issue Log

### Table 11

| Issue ID | Process | Problem | Severity | Fix | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- |
| DR-001 | Payment | Booking marked confirmed before payment confirmation | Critical | Change status rule | Founder | Open |
| DR-002 | Report | Water-break field missing | Medium | Add field | Operations | Fixed |
| DR-003 | Emergency | Backup vet number unavailable | Critical | Add second clinic | Founder | Open |

Dry-run completion criteria

The internal test is complete when:

The booking can be created.

The sitter can be assigned.

Payment can be tracked.

The service can be started and completed.

The report can be sent.

The payout can be calculated.

Cancellation can be processed.

A refund can be recorded.

An incident can be escalated.

No critical issue remains open.

Output

A tested manual booking system and a prioritised list of corrections.

Simple explanation for professor

“I simulated successful bookings, cancellations, payment failures and emergencies so that process errors could be corrected before serving real customers.”

Final Day 1 Deliverables

At the end of Day 1, PetSaathi should have:

### Table 12

| Deliverable | Required Status |
| --- | --- |
| Active service scope | Approved |
| Booking tracker | Ready |
| Payment tracker | Ready |
| Sitter-payout sheet | Ready |
| Pet report-card template | Ready |
| Cancellation/refund policy | Draft complete |
| Emergency protocol | Draft complete |
| Successful booking dry run | Completed |
| Cancellation dry run | Completed |
| Emergency dry run | Completed |
| Critical issues | Resolved before launch |

Day 1 Readiness Decision

Ready for first bookings

Proceed when:

Service scope is clear.

Booking and payment records work.

Sitter payouts calculate correctly.

Customer terms are ready.

Emergency contacts are verified.

Dry-run issues are resolved.

No critical operational gap remains.

Conditional readiness

Proceed only with low-risk dog-walking bookings when:

Walking is ready but sitting or boarding is incomplete.

A limited number of trained sitters is available.

Emergency and refund processes work.

Services remain geographically restricted.

Not ready

Do not accept paid bookings when:

Payment cannot be reconciled.

Refund rules are unclear.

Emergency contacts are missing.

Sitter assignment is unverified.

Pet-risk information is incomplete.

The dry run reveals unresolved critical failures.

Simple Explanation for Professor

“On the first day of Phase 2, I created the operating system required for PetSaathi’s manual pilot. I first limited the active services to dog walking, pet sitting and controlled boarding. I then created separate trackers for bookings, customer payments and sitter payouts. After lunch, I prepared a standard pet report card, cancellation and refund rules, and an emergency escalation procedure. Finally, I tested the complete booking process internally by simulating a successful service, customer cancellation, sitter cancellation, failed payment and pet emergency. PetSaathi will accept its first live booking only after the dry run is complete and no critical operational issue remains.”

PetSaathi Phase 2 — Week 1, Day 2: Sitter Shortlisting and Operations Setup 🐾

Main goal of Day 2

The purpose of Day 2 is to convert the sitter applications collected during Phase 1 into a small, dependable group of caregivers who can support real Phase 2 bookings.

By the end of the day, PetSaathi should have:

Reviewed every sitter application

Interviewed the most suitable applicants

Assigned an internal screening level to each applicant

Collected accurate availability information

Approved each sitter only for suitable services

Created a controlled communication channel for operations

Recorded rejection, hold and next-step reasons

A sitter should not become bookable merely because they completed an application form. Established marketplaces separate profile submission, manual review, background checks and final approval. Rover, for example, manually reviews sitter profiles and treats profile approval and background checking as distinct stages. Its profile badges also identify specific completed steps rather than presenting every applicant as generally “verified.”

Day 2 Schedule

### Table 13

| Time | Task | Expected output |
| --- | --- | --- |
| 09:00–10:00 | Review sitter applications | Initial shortlist |
| 10:00–12:00 | Call or video-interview sitters | Trust and suitability screening |
| 12:00–13:00 | Mark sitter levels | L1, L2 or L3 classification |
| 13:00–14:00 | Lunch | — |
| 14:00–15:30 | Collect availability | Schedule matrix |
| 15:30–16:30 | Assign service types | Walking, sitting or boarding approval |
| 16:30–18:00 | Create sitter WhatsApp channel | Controlled operations communication |

09:00–10:00 — Review Sitter Applications

During this session, I will review every sitter application using the same criteria.

The purpose is to identify applicants who are suitable for an interview and remove applications that are incomplete, geographically unsuitable or potentially unsafe.

1. Check whether the application is complete

I will confirm that the applicant has provided:

Full legal name

Age

Phone number

City and area

Occupation

Pet-care experience

Requested services

Availability

Expected earnings

Verification readiness

Emergency contact

Reason for applying

An application with missing information should be marked Incomplete, not immediately rejected.

The applicant may receive one clear request to provide the missing information.

2. Check the applicant’s location

The applicant should live inside or reasonably close to the selected Phase 2 areas.

For example, when PetSaathi is operating in Vesu, Adajan and Citylight, the review should consider:

Applicant’s home area

Normal travel route

Mode of transport

Maximum travel distance

Travel time during morning and evening periods

Expected travel cost

A sitter living far away may appear suitable but may later become unreliable because of travel delays and poor booking economics.

3. Review the applicant’s actual experience

The application should contain specific examples.

A strong answer may explain:

“I have cared for my neighbour’s Labrador three mornings each week for eight months. I handled feeding, thirty-minute walks and basic updates.”

A weak answer may only say:

“I love animals.”

Loving animals is positive, but it does not prove that the applicant can safely manage another person’s pet.

I will look for experience involving:

Walking dogs

Caring for another person’s pet

Feeding and water routines

Cat care

Senior-pet care

Nervous or anxious pets

Large or strong dogs

Animal-rescue work

Fostering

Pet boarding

Handling an unexpected incident

4. Compare requested services with experience

Applicants should not automatically receive all the services they select.

For example:

A first-time applicant may be suitable for small-dog walking.

The same applicant may not be suitable for overnight boarding.

A calm, experienced pet owner may be suitable for home visits.

A boarding applicant requires additional property and safety checks.

The application review should identify the services that can be discussed during the interview.

5. Review availability and commitment

I will check whether the applicant’s availability matches actual customer demand.

Important periods may include:

Early morning

Late morning

Afternoon

Evening

Weekends

Public holidays

Travel seasons

I will also check whether the applicant’s college, job or family schedule allows them to arrive reliably.

6. Review verification readiness

The applicant should state whether they are willing to provide:

Government-issued identity proof

Current address proof

References

Video interview participation

Practical assessment participation

Training completion

Boarding-home evidence, where relevant

An identity check should not be described as a complete criminal or background check. PetBacker’s policy, for example, states that its marketplace does not universally check providers’ background records and is partly reputation based. PetSaathi should therefore use exact labels describing the checks it has genuinely completed.

7. Identify early warning signs

The application should be placed on hold or rejected when there are serious concerns such as:

Contradictory personal information

False experience claims

Refusal to provide reasonable verification

Intention to send another person for bookings

Support for harsh or violent handling

Unwillingness to report incidents

Unclear availability

Unrealistic boarding capacity

Refusal to follow customer instructions

Poor or disrespectful communication

Initial application statuses

Each application should receive one of these statuses:

### Table 14

| Status | Meaning |
| --- | --- |
| Interview shortlist | Suitable for an interview |
| Conditional shortlist | Requires clarification |
| Incomplete | Missing required information |
| Hold | Potentially suitable later |
| Service-area mismatch | Too far from active areas |
| Rejected | Does not meet current requirements |

Output

A documented initial shortlist showing which applicants should proceed to an interview and why.

Simple explanation for professor

“I reviewed each sitter application according to location, experience, availability, verification readiness and safety indicators. Only applicants who met the basic requirements were invited to the next stage.”

10:00–12:00 — Call or Video-Interview Sitters

During this session, I will interview shortlisted applicants.

A video interview is preferable for the main screening because it provides a stronger opportunity to evaluate communication, professionalism and judgement.

The interview should not be treated as casual conversation. Every applicant should receive the same core questions so the results can be compared fairly.

Pet-care platforms similarly recommend direct discussion before a booking because the conversation helps evaluate the sitter’s knowledge, personality and ability to understand a pet’s requirements.

Recommended interview duration

Each interview should take approximately 20–30 minutes.

Boarding applicants may require a longer discussion because their home environment and supervision arrangements must also be reviewed.

Interview introduction

I will begin with:

“Thank you for applying to become a PetSaathi caregiver. This interview will help us understand your experience, availability, communication and safety judgement. The interview does not guarantee approval. Sitters are approved only for services they are currently qualified to provide.”

Section 1: Motivation

Ask:

Why do you want to become a PetSaathi sitter?

What do you enjoy about caring for animals?

What type of pet-care work are you expecting?

Are you looking for occasional work or regular bookings?

What would make you stop accepting bookings?

A suitable applicant should demonstrate realistic expectations and responsibility.

Section 2: Experience

Ask:

Which animals have you cared for?

Have you cared for pets belonging to another person?

What tasks did you complete?

Which dog sizes are you comfortable handling?

Have you managed cats?

Have you handled an anxious or reactive pet?

Tell us about the most difficult pet-care situation you have faced.

Can you provide a reference who can confirm your experience?

The interviewer should ask follow-up questions when the answers are vague.

Section 3: Dog-walking judgement

Ask:

What would you check before leaving the customer’s property?

What would you do if the harness appeared loose?

How would you manage a dog that pulls strongly?

What would you do if an unleashed dog approached?

What would you do if the pet escaped?

Would you ever remove the leash in an open area?

How would you handle extreme heat or heavy rain?

A strong answer should prioritise prevention, communication and immediate incident reporting.

Section 4: Pet-sitting judgement

Ask:

What would you do when entering a customer’s home for the first time?

How would you protect the customer’s key?

Would you invite another person into the home?

What would you do if the pet refused food?

What would you do if the customer’s instructions were unclear?

How would you confirm that the property was secure before leaving?

What information would you include in the final report?

Section 5: Emergency scenarios

Ask:

What would you do if a pet had breathing difficulty?

What would you do if a dog was injured during a walk?

What would you do if the owner did not answer during an emergency?

What would you do if a pet bit you?

What would you do if you lost access to the customer’s home?

What would you do if you could not attend a confirmed booking?

The applicant should understand that serious health concerns require immediate escalation to PetSaathi, the customer and an appropriate veterinarian.

Section 6: Reliability

Ask:

How will you make sure that you arrive on time?

How much travel time will you keep between bookings?

What happens if your phone battery becomes low?

What happens if your transport is unavailable?

How many bookings can you safely complete in one day?

Are you willing to update your availability regularly?

Are you willing to accept performance monitoring during probation?

Section 7: Communication

Ask:

Are you comfortable sending arrival and completion updates?

Can you submit a structured report card?

How would you handle an unhappy customer?

What would you do if a customer asked you to ignore a safety rule?

Would you accept a direct cash booking outside PetSaathi?

Can you communicate professionally in the customer’s preferred language?

Established pet-care services commonly use photographs and walk reports as part of the service process. PetBacker, for example, advertises photo updates and real-time dog-walk reports as caregiver tools.

Section 8: Boarding questions

For boarding applicants, ask:

Do you own or rent the property?

Does the landlord or society allow pet boarding?

Who else lives in the property?

Are there children in the home?

Are other pets present?

How many guest pets can be handled safely?

Are doors, windows and balconies secure?

Where will the pet sleep?

Can incompatible pets be separated?

How long will pets be left unsupervised?

Is emergency transport available?

Are you willing to complete a video or physical home assessment?

Answers should be recorded but should not replace an actual home-safety assessment.

Interview scoring

A proposed scorecard may use:

### Table 15

| Criterion | Maximum score |
| --- | --- |
| Relevant experience | 20 |
| Safety judgement | 25 |
| Reliability | 15 |
| Communication | 15 |
| Location and travel suitability | 10 |
| Verification readiness | 10 |
| Professional attitude | 5 |
| Total | 100 |

Suggested interpretation

75–100: Strong candidate

60–74: Conditional candidate

40–59: Hold for additional assessment

Below 40: Do not approve currently

These are PetSaathi’s internal decision thresholds, not recognised industry standards.

Output

Structured interview notes, scores, red flags and recommended next steps for each applicant.

Simple explanation for professor

“I interviewed shortlisted sitters using the same questions about experience, safety, emergencies, reliability and customer communication. This made the selection process more consistent and fair.”

12:00–13:00 — Mark Sitter Levels: L1, L2 and L3

During this session, I will assign an internal PetSaathi screening level to each suitable sitter.

The levels should communicate what the sitter has completed. They should not imply that all risks have been removed.

Rover’s badge system similarly associates badges with specific actions, such as completing a background check or passing a training quiz. This supports the principle that each PetSaathi level should correspond to defined evidence.

Important rule

The L1, L2 and L3 system is an internal PetSaathi classification. It is not a government certification or a universally recognised pet-care standard.

L1 — Basic Screened Applicant

An applicant may receive L1 status after completing:

Full application

Contact verification

Basic identity review

Initial interview

Service-area review

Availability confirmation

Basic safety-question review

L1 permissions

An L1 applicant may:

Complete training

Attend practical assessments

Participate in a supervised meet-and-greet

Be considered for limited trial assignments after approval

An L1 applicant should not automatically be publicly advertised as a fully approved sitter.

Suggested profile wording

Basic screening completed

Do not use:

Fully verified sitter

L2 — Service-Approved Sitter

A sitter may receive L2 status after completing:

L1 requirements

Reference check

Required training

Practical service assessment

Service-specific approval

Terms and safety agreement

Probationary booking approval

L2 permissions

An L2 sitter may accept bookings only for approved services.

Examples:

Approved for small- and medium-dog walking

Approved for cat sitting

Approved for one-hour home visits

Not approved for boarding

Not approved for reactive dogs

Suggested profile wording

Approved for dog walking

or:

Approved for home pet sitting

L3 — Proven or Trusted Sitter

L3 should be awarded only after the sitter demonstrates reliable performance through real bookings.

A proposed L3 requirement may include:

Several successfully completed bookings

Consistently punctual arrival

Required reports completed

Strong customer feedback

Low cancellation rate

No unresolved serious incident

Continued compliance with PetSaathi rules

Additional service assessment where applicable

PetSaathi may initially require five completed bookings and a strong customer rating, but this number should be treated as an internal pilot rule and reviewed after more data is collected.

L3 permissions

An L3 sitter may receive:

Higher booking priority

Repeat-customer assignments

Package bookings

More complex pets within demonstrated capability

Additional service opportunities

Performance incentives

Suggested profile wording

Proven PetSaathi sitter

The profile should still display the sitter’s actual approved services and completed checks.

Suggested level table

### Table 16

| Level | Meaning | Booking access |
| --- | --- | --- |
| L1 | Basic screening completed | Training and assessment stage |
| L2 | Approved for named services | Eligible for selected bookings |
| L3 | Demonstrated reliable performance | Priority and repeat bookings |

Additional statuses

The CRM should also support:

Applicant

Incomplete

On hold

Rejected

Suspended

Inactive

These statuses should remain separate from the L1–L3 level.

Output

Every suitable applicant receives a clearly defined level and a documented explanation.

Simple explanation for professor

“I created three internal sitter levels. L1 means basic screening has been completed, L2 means the sitter is approved for specific services, and L3 means the sitter has demonstrated reliable performance through completed bookings.”

13:00–14:00 — Lunch Break

I will take a lunch break after completing the application review, interviews and initial sitter classification.

Before leaving, I will save:

Interview notes

Interview scores

Level decisions

Rejection reasons

Additional-check requirements

Sitter consent and verification status

No new sitter should be added to operations merely because the interview appeared positive. All required records should be complete first.

14:00–15:30 — Collect Sitter Availability

During this session, I will create a schedule matrix showing when and where every sitter can work.

A sitter saying “I am flexible” is not sufficient. PetSaathi needs specific days, times and travel limits.

Information to collect

For every sitter, record:

Available days

Earliest starting time

Latest ending time

Morning availability

Afternoon availability

Evening availability

Weekend availability

Festival availability

Overnight availability

Maximum bookings per day

Maximum consecutive bookings

Required travel buffer

Primary service area

Secondary service area

Maximum travel radius

Mode of transport

Temporary blocked dates

Recurring commitments

Availability matrix example

### Table 17

| Sitter | Area | Monday morning | Monday evening | Tuesday morning | Weekend | Max bookings |
| --- | --- | --- | --- | --- | --- | --- |
| ST-001 | Vesu | 7:00–10:00 | 5:00–8:00 | 7:00–10:00 | Yes | 4 |
| ST-002 | Adajan | Unavailable | 6:00–9:00 | Unavailable | Yes | 2 |
| ST-003 | Citylight | 8:00–11:00 | 4:00–7:00 | 8:00–11:00 | No | 3 |

Separate recurring and temporary availability

Recurring availability

This is the sitter’s normal weekly schedule.

Example:

Monday to Friday, 7:00–10:00 AM.

Temporary availability

This applies only to a specific date or period.

Example:

Available all day from 10–15 August.

The two should not be mixed.

Add travel buffers

PetSaathi should prevent back-to-back assignments that do not allow enough travel time.

For example:

Booking A ends at 8:00 AM.

Booking B begins three kilometres away at 8:00 AM.

The sitter cannot safely complete both.

The schedule should include:

Travel time

Building-entry time

Customer handover time

Report-submission time

Weather delays

Track capacity

For each sitter, record a safe daily limit.

A sitter may have free time but may not be able to handle six strong dogs in one day without fatigue.

Capacity should consider:

Physical difficulty

Travel

Pet behaviour

Service duration

Weather

Report requirements

Other employment or study

Availability confirmation rule

The sitter should confirm availability:

At the beginning of each week

Before every assignment

Whenever their regular schedule changes

An availability entry does not automatically mean the sitter has accepted a booking.

Output

A weekly schedule matrix showing sitter availability, service areas, travel limits and capacity.

Simple explanation for professor

“I collected specific days, times and locations from every sitter so the operations team could assign bookings without creating timing or travel conflicts.”

15:30–16:30 — Assign Service Types

During this session, I will approve each sitter only for the services they are currently able to deliver safely.

A single sitter may have different approval statuses for different services.

Dog-walking approval

The sitter should demonstrate:

Safe leash and harness checking

Controlled door and gate handling

Ability to manage the approved dog size

Safe road crossing

Understanding of escape prevention

Ability to provide walk updates

Appropriate physical capability

Knowledge of incident escalation

Possible approval categories

Small-dog walking

Small- and medium-dog walking

Large-dog walking

Senior-dog walking

Multi-dog walking

Reactive-dog walking

Reactive or difficult dogs should require additional experience.

Pet-sitting approval

The sitter should demonstrate:

Respect for customer privacy

Ability to follow written instructions

Feeding and water routines

Home-entry and security awareness

Cat or dog behaviour knowledge

Communication ability

Report-card completion

Emergency escalation awareness

Possible approval categories

Dog home visits

Cat home visits

Feeding visits

Extended sitting

Senior-pet sitting

Special-care sitting

Boarding approval

Boarding approval requires more than a successful interview.

The applicant should complete:

Identity and address checks

Home photographs

Video or physical home inspection

Society or landlord permission review

Door, window and balcony check

Existing-pet review

Capacity decision

Emergency transport check

Veterinary-access check

Supervision-plan review

Local compliance review

Boarding should remain Pending until these checks have been completed.

Service-assignment table

### Table 18

| Sitter | Walking | Sitting | Boarding | Notes |
| --- | --- | --- | --- | --- |
| ST-001 | Approved: medium dogs | Approved: home visits | Not approved | Strong morning availability |
| ST-002 | Approved: small dogs | Training pending | Not requested | Student sitter |
| ST-003 | Not requested | Approved: cat sitting | Home check pending | Boarding remains unavailable |

Do not assign based only on sitter preference

An applicant may want to provide boarding because it offers higher earnings.

That preference does not prove that the home or supervision arrangement is suitable.

Similarly, owning a large dog does not automatically prove that the applicant can safely walk every large or reactive dog.

Output

A service-permission matrix showing exactly what each sitter may and may not provide.

Simple explanation for professor

“I assigned service permissions according to demonstrated ability. A sitter approved for walking was not automatically approved for sitting or boarding.”

16:30–18:00 — Create the Sitter WhatsApp Operations Channel

During this session, I will create a controlled WhatsApp communication channel for approved or shortlisted sitters.

Important privacy warning

In a normal WhatsApp group, members can see the phone numbers of other group members. WhatsApp’s official privacy guidance states that group members’ phone numbers cannot currently be hidden from one another.

Therefore, PetSaathi should obtain sitter agreement before adding them to the group.

The group should not contain:

Customer phone numbers

Complete customer addresses

Pet medical documents

Identity documents

Payment information

Home-access codes

Private customer photographs

Complaint evidence

Sensitive booking information should be shared through private chats with the assigned sitter.

Recommended channel structure

Channel 1: PetSaathi Sitter Announcements

Purpose:

General operating notices

Training reminders

Availability deadlines

Weather alerts

Policy updates

Open service-area notices

Only admins should normally post.

Channel 2: Private sitter chats

Purpose:

Individual booking offers

Customer instructions

Service location

Pet behaviour information

Payment and payout details

Incident discussions

Performance feedback

This structure is safer than placing every operational detail in one general group.

Group name

PetSaathi Sitter Operations — [City]

Example:

PetSaathi Sitter Operations — Ahmedabad

Group description

This group is for approved PetSaathi operational announcements, availability reminders, training notices and general updates.

Do not post customer names, addresses, phone numbers, access codes, health information, payment details or booking photographs. Individual booking information will be sent privately.

Respectful and professional communication is required.

Admin controls

PetSaathi should:

Limit administrator rights

Enable approval for new members

Remove inactive or suspended sitters

Avoid public invitation links

Review the member list regularly

Use two-step verification on the business account

Record who added each member

WhatsApp allows group administrators to turn on Approve New Members, meaning admins must approve people requesting to join.

Group rules

Rule 1: Protect customer privacy

Do not share customer information in the general group.

Rule 2: Do not claim a booking without assignment

A sitter should not assume a booking is theirs merely because an availability request is posted.

Rule 3: Respond using defined codes

For example:

AVAILABLE

NOT AVAILABLE

NEED DETAILS

The admin should still assign the booking privately.

Rule 4: No unauthorised substitutes

A sitter must not ask another group member to complete their assigned booking.

Rule 5: Report delays privately

The sitter should immediately contact operations when a delay may affect a confirmed service.

Rule 6: No direct customer solicitation

Sitters must not use group information to contact customers independently.

Rule 7: No customer media

Pet photographs or videos should be shared only through the approved booking conversation.

Rule 8: Respectful communication

Harassment, aggressive language, spam and unrelated promotions are not permitted.

Welcome message

Welcome to the PetSaathi Sitter Operations channel. 🐾

This channel is used for general announcements, training reminders and availability notices.

Individual booking information will be shared privately with the selected sitter.

Please read the group rules and reply AGREE to confirm that you understand the privacy, safety and communication requirements.

Availability reminder template

Weekly availability update

Please submit your availability for [date range] by [deadline].

Include:

Available days

Morning and evening time slots

Service areas

Services available

Blocked dates

Do not post customer or booking information in this group.

Booking-opportunity notice

A general notice may say:

Availability check — Vesu

Service: 30-minute dog walkDate: [date]Approximate time: 7:00–8:00 AMApproved category required: Medium-dog walking

Eligible sitters may reply AVAILABLE. Full details will be shared privately after selection.

This allows availability checking without exposing the customer’s identity or complete location.

Output

A privacy-conscious WhatsApp operations structure with clear rules, controlled membership and private booking communication.

Simple explanation for professor

“I created a WhatsApp channel for general sitter operations, but I kept customer addresses, pet details and booking information in private chats because group members can see each other’s phone numbers and group content.”

End-of-Day 2 Dashboard

At the end of Day 2, I should prepare the following report:

### Table 19

| Metric | Result |
| --- | --- |
| Applications reviewed | [Enter result] |
| Applicants shortlisted | [Enter result] |
| Interviews completed | [Enter result] |
| L1 sitters | [Enter result] |
| L2 sitters | [Enter result] |
| L3 sitters | [Enter result] |
| Walking-approved sitters | [Enter result] |
| Sitting-approved sitters | [Enter result] |
| Boarding checks pending | [Enter result] |
| Morning availability | [Enter result] |
| Evening availability | [Enter result] |
| Weekend availability | [Enter result] |
| Rejected applications | [Enter result] |
| Applications on hold | [Enter result] |
| WhatsApp members added | [Enter result] |

Day 2 Success Checklist

Day 2 is complete when:

Every application has been reviewed.

Interview candidates have documented scores.

Rejection and hold reasons are recorded.

L1, L2 and L3 definitions are written.

Every approved sitter has service-specific permissions.

Availability is stored in a weekly matrix.

Travel buffers and capacity limits are recorded.

Boarding remains unavailable until additional checks are complete.

The WhatsApp channel has clear rules.

Sitters have agreed before being added to the group.

Customer information is not shared in the general group.

Every sitter has a defined next action.

Final Day 2 Output

At the end of Day 2, PetSaathi should have:

A screened sitter shortlist

Completed interview records

L1, L2 and L3 classifications

A sitter-availability matrix

A service-approval matrix

A controlled WhatsApp announcements channel

Private communication rules for individual bookings

A list of training, verification and home-assessment tasks still pending

Simple Explanation for Professor

“On the second day of Phase 2, I reviewed all sitter applications and shortlisted applicants according to location, experience, availability and safety requirements. I then conducted structured video interviews to evaluate their judgement, reliability and communication. After the interviews, I classified the applicants into three internal levels: L1 for basic screening, L2 for service-specific approval and L3 for proven performance. I collected detailed availability and created a schedule matrix. I then approved each sitter only for suitable services such as walking, sitting or controlled boarding. Finally, I created a WhatsApp operations channel for announcements and availability updates. Sensitive customer and booking information will remain in private chats rather than the group.”

PetSaathi Phase 2 — Week 1, Day 3: First Paid-Booking Push 🐾

Main goal of Day 3

The purpose of Day 3 is to convert the strongest Phase 1 leads into real, paid and operationally deliverable bookings.

The team should not contact every lead with the same offer. It should prioritise customers who:

Live in the active service areas

Need a service soon

Have already shown interest

Accept the approximate price

Have provided enough pet information

Have permitted follow-up communication

Can be matched with an available sitter

WhatsApp states that businesses should contact customers with promotional messages after the customer has opted in, and messages should remain expected and relevant. PetSaathi should therefore contact leads who requested information or agreed to receive further updates rather than sending repeated offers to people who declined.

Before taking payment, PetSaathi must clearly communicate the service, duration, price, inclusions, cancellation conditions and current sitter-confirmation status. Indian consumer-protection principles recognise the customer’s right to be informed about a service’s quality, standard and price.

Day 3 schedule

### Table 20

| Time | Task | Main output |
| --- | --- | --- |
| 09:00–10:00 | Contact hot leads from Phase 1 | Qualified booking attempts |
| 10:00–12:00 | Offer trial walking or sitting | Customer conversions |
| 12:00–13:00 | Send payment links | Genuine paid tests |
| 13:00–14:00 | Lunch | — |
| 14:00–16:00 | Match sitters to bookings | Confirmed service matches |
| 16:00–17:00 | Confirm instructions | Complete pet-care details |
| 17:00–18:00 | Prepare next-day service list | Operational schedule |

09:00–10:00 — Contact Hot Leads from Phase 1

During this session, I will review the Phase 1 CRM and contact customers who have the strongest probability of booking.

The objective is not simply to send twenty messages. The objective is to begin specific booking conversations with customers who can realistically be served.

What is a hot lead?

A hot lead should meet most of the following conditions:

The customer lives in one of the selected pilot areas.

The customer needs dog walking or pet sitting within the next 30 days.

The customer has selected a service.

The customer accepts the approximate trial price.

The customer has provided a preferred date or time.

The customer has shared basic pet details.

The customer is willing to review a sitter match.

The customer has allowed PetSaathi to follow up.

The customer previously requested a payment link or trial information.

A person should not be marked as hot merely because they liked an Instagram post or said that PetSaathi was a good idea.

Step 1: Prepare the priority list

I will create a filtered list containing:

### Table 21

| Field | Purpose |
| --- | --- |
| Lead ID | Unique customer reference |
| Customer name | Personalised communication |
| Area | Confirms service coverage |
| Pet | Matching context |
| Service requested | Walking or sitting |
| Preferred date | Booking urgency |
| Preferred time | Sitter availability |
| Accepted budget | Price compatibility |
| Main trust concern | Required reassurance |
| Follow-up permission | Communication consent |
| Last interaction | Conversation context |
| Next recommended action | Booking, meeting or information |

The highest-priority customers should be contacted first.

Step 2: Review previous conversation notes

Before messaging the customer, I will review what they previously said.

For example:

A customer concerned about strangers should receive sitter-screening information.

A customer concerned about price should receive the complete trial inclusions.

A customer who requested the same walker should receive continuity information.

A customer travelling next weekend should receive an availability-focused message.

The follow-up should address the customer’s actual requirement instead of repeating the original marketing message.

Recommended first follow-up message

Hello [Name],

Thank you for speaking with us during the PetSaathi validation phase.

We are now accepting a limited number of paid pilot bookings in [Area]. Based on your earlier requirement, we may be able to arrange:

Service: [30-minute dog walk/one-hour pet sitting]Preferred period: [Date or time]Pilot price: ₹[Amount]

Would you like us to check sitter availability for your pet?

Please reply:1 — Yes, check availability2 — Share more details3 — Not required currently

This message does not falsely claim that the sitter is already confirmed.

Contact statuses

Every lead should be marked as:

Contacted

Interested in booking

Needs additional information

Preferred date received

Sitter check required

Call scheduled

Interested later

No response

Not interested

Follow-up not permitted

Output

A prioritised set of genuine booking attempts with clear customer responses and next actions.

Simple explanation for professor

“I contacted the strongest Phase 1 leads who lived in the active areas, needed a service soon and had already shown willingness to pay.”

10:00–12:00 — Offer Trial Walking or Pet Sitting

During this session, I will present a specific trial offer to each qualified customer.

The offer should contain one service, one duration, one price and one next action.

Offer 1: Trial Dog Walk

Suggested offer

30-minute dog-walking pilot

Possible trial price:

₹99 for a defined introductory experiment, or

₹149 when that price performed better during Phase 1

The exact amount should follow the approved Day 13 pricing result rather than being changed separately for every customer.

The offer should explain that it includes:

One assigned service-approved walker

A 30-minute service

Arrival confirmation

Start and completion confirmation

One agreed photograph or update

Toilet and water information

A short walk report

Trial-walk message

Hello [Name],

PetSaathi has a limited 30-minute dog-walking pilot available in [Area].

Pilot price: ₹[Amount]

The service includes:• An assigned walking-approved sitter• Arrival and completion confirmation• One service update• Toilet and water information• A short Pet Report Card

Would you like to select a preferred date and time?

Offer 2: Pet-Sitting Trial

Suggested offer

One-hour home pet-sitting pilot for ₹199, subject to the approved pricing result and sitter availability.

The offer may include:

Arrival and departure confirmation

Feeding or water support

Companionship or playtime

Toilet or litter update

One photograph or video

Final sitting report

Confirmation that the home was secured

Pet-sitting message

Hello [Name],

PetSaathi is offering a limited one-hour home pet-sitting pilot in [Area].

Pilot price: ₹199

The visit may include feeding, fresh water, companionship, one service update and a final report, according to your written instructions.

Would you like us to check a suitable sitter for [date/time]?

Do not offer both services unnecessarily

A customer who needs daily walking should receive the walking offer.

A customer preparing for travel or requiring home care should receive the sitting offer.

Sending every service to every customer can create confusion and weaken the response.

Qualification questions before conversion

Before treating the customer as a booking candidate, I will confirm:

Which service is required?

What date is preferred?

What start time is preferred?

Where is the service location?

What type of pet is involved?

What is the pet’s age and approximate weight?

Does the pet have bite, aggression or escape history?

Are there any medical or mobility concerns?

Has the customer accepted the approximate price?

Is the customer willing to review the sitter details before confirmation?

Meet-and-greet option

For a first sitting booking, a strong dog, an anxious pet or a customer with major trust concerns, PetSaathi should offer a video introduction or meet-and-greet before final confirmation.

Rover recommends meet-and-greets as an opportunity for the sitter, owner and pet to assess suitability and share information about the pet’s needs and behaviour before the service.

Conversion statuses

After the offer, record:

Offer accepted

Preferred date provided

Sitter information requested

Meet-and-greet requested

Price objection

Safety objection

Timing mismatch

Service not currently required

Offer declined

Output

Specific dog-walking and pet-sitting offers presented to qualified customers, with booking intent recorded.

Simple explanation for professor

“I presented a clear service, duration, price and list of inclusions instead of asking customers only whether they were generally interested.”

12:00–13:00 — Send Payment Links

During this session, I will send payment links to customers whose service requirements are suitable and whose requested time has at least provisional sitter availability.

Important sequencing correction

PetSaathi should not collect a non-refundable full payment when no suitable sitter or time slot is available.

The correct sequence is:

Confirm the customer’s basic requirement.

Check provisional sitter availability.

Explain the current match status.

Share the price and cancellation conditions.

Send the appropriate payment link.

When the sitter is not yet provisionally available, PetSaathi may use a clearly refundable priority reservation instead of collecting the full service amount.

Option A: Full trial payment

Use a full payment link when:

The service is supported.

The customer’s area is active.

A suitable sitter is provisionally available.

The customer has accepted the price.

The pet does not present an unresolved risk.

The cancellation and refund rules have been shared.

Option B: Refundable priority reservation

Use a ₹49 reservation only when:

The customer wants a future slot.

Final sitter allocation is still pending.

The refund rules are clearly communicated.

The amount will be adjusted against the final booking.

PetSaathi will refund it when it cannot provide the promised service.

The message must state that payment does not create a final booking until the sitter and time are confirmed.

Payment-link information

Every link should contain:

Booking or reservation reference

Customer reference

Service name

Amount

Link expiry

Short service description

Internal notes where required

Razorpay Payment Links support unique reference IDs and expiry dates. Their status can also be tracked through the Razorpay dashboard, helping PetSaathi connect a link to the correct booking and distinguish pending, paid and expired links.

Recommended reference format

BK-0012-WALK-PP-0045

or:

RES-PP0045-2026-08-10

Full-payment message

Hello [Name],

We have provisionally identified a suitable sitter for your PetSaathi trial.

Service: 30-minute dog walkPreferred date: [Date]Preferred time: [Time]Amount: ₹149Booking reference: BK-0012

Please review the cancellation and refund conditions before paying: [Policy link or summary]

Payment link: [Link]

The booking will be marked confirmed after successful payment and final sitter confirmation.

Reservation-payment message

Hello [Name],

You may reserve priority for your preferred PetSaathi service period by paying a refundable ₹49 amount.

This amount will be adjusted against the final booking. If PetSaathi cannot provide a suitable sitter, it will be refunded according to the stated policy.

A final booking is created only after the sitter, date, time and complete price are confirmed.

Reservation link: [Link]

Payment statuses to record

Link not created

Link created

Link sent

Opened

Payment pending

Paid

Failed

Expired

Cancelled

Refund pending

Refunded

A booking should not be marked Confirmed merely because the link was sent.

Output

Traceable payment links connected to customer and booking references, producing genuine paid tests.

Simple explanation for professor

“I sent payment links only after checking the service requirement and provisional availability, and I linked every payment to a unique booking reference.”

13:00–14:00 — Lunch Break

During the lunch period, I will not conduct new booking activity.

Before taking the break, I will verify:

Which customers received offers

Which payment links were sent

Which links were paid

Which links remain pending

Which time slots require sitters

Which customers requested a meet-and-greet

Which pet-risk details remain incomplete

The booking tracker and payment tracker should show the same status.

14:00–16:00 — Match Sitters to Bookings

During this session, I will finalise the sitter match for each viable customer request.

Matching should not be based only on which sitter replies first. It should be based on safety, capability, location, availability and customer requirements.

Matching criteria

For every booking, compare:

Service approval

The sitter must be approved for the requested service.

For example:

A walking-approved sitter can receive a walking assignment.

A sitting-approved sitter can receive a home-visit assignment.

A sitter with pending boarding checks cannot receive boarding.

Location

Check:

Distance from customer

Expected travel time

Mode of transport

Building-entry time

Travel buffer before and after other bookings

Availability

Confirm:

Date

Start time

Required duration

Travel buffer

Maximum daily capacity

Other confirmed bookings

Pet suitability

Review:

Pet type

Size

Age

Strength

Behaviour

Bite history

Escape history

Medical concerns

Special-care requirements

Sitter performance

Review:

Current level

Punctuality

Cancellation history

Customer rating

Report-completion record

Current warnings or restrictions

Sitter-match score

A practical internal score may be:

### Table 22

| Criterion | Maximum points |
| --- | --- |
| Service approval | 25 |
| Pet-handling suitability | 20 |
| Availability | 15 |
| Locality and travel time | 15 |
| Reliability | 10 |
| Customer preference | 5 |
| Previous relationship with pet | 5 |
| Payout compatibility | 5 |
| Total | 100 |

This is an internal decision aid, not an industry-standard certification.

Sitter booking offer

Hello [Sitter Name],

A PetSaathi booking is available for your review.

Booking ID: BK-0012Service: 30-minute dog walkArea: [Area only initially]Date: [Date]Time: [Time]Pet: Medium-sized dogRelevant note: Pulls moderately on leashPayout: ₹[Amount]

Please reply:ACCEPT — I am available and suitableDECLINE — I am unavailableNEED DETAILS — I require clarification

Do not treat the booking as assigned until PetSaathi sends confirmation.

Sitter acceptance

The sitter should explicitly confirm:

Availability

Service capability

Travel ability

Payout acceptance

Understanding of the pet notes

Ability to provide the required updates

Silence should not be treated as acceptance.

Customer approval

After sitter acceptance, the customer should receive:

Sitter’s first name

Relevant experience

Approved service

Accurate screening status

Proposed time

Final price

Meet-and-greet option where appropriate

The customer should approve the sitter before the booking becomes final.

Backup sitter

For each confirmed booking, record a possible backup when supply allows.

The backup sitter should not receive the complete customer information unless replacement becomes necessary.

Output

Suitable sitters matched with viable bookings, with sitter and customer acceptance documented.

Simple explanation for professor

“I matched sitters according to service approval, pet requirements, location, availability and reliability instead of assigning the first available applicant.”

16:00–17:00 — Confirm Pet and Service Instructions

During this session, I will collect and reconfirm every instruction required to complete the service safely.

The information collected during Phase 1 may be outdated or incomplete, so the customer must confirm the final details for the specific booking.

Customer details

Confirm:

Customer name

Primary contact number

Secondary emergency contact

Service address

Society entry process

Preferred communication method

Pet identity

Confirm:

Pet name

Species

Breed

Age

Weight

Photograph

Behaviour

Confirm:

Behaviour with strangers

Behaviour with other animals

Pulling behaviour

Bite or aggression history

Escape history

Anxiety triggers

Resource guarding

Reaction to lifts, traffic and loud sounds

Health

Confirm:

Vaccination status

Current illness

Recent injury

Allergies

Medication

Mobility limitation

Heat sensitivity

Veterinary contact

Dog-walking instructions

Confirm:

Harness or collar type

Leash location

Approved route

Areas to avoid

Whether interaction with other dogs is allowed

Toilet-cleanup supplies

Water requirements

Home entry and exit procedure

Pet-sitting instructions

Confirm:

Food quantity

Feeding time

Water requirements

Litter or toilet process

Play instructions

Rooms the sitter may access

Rooms that remain restricted

Key or access process

Door, window and alarm instructions

Confirmation procedure before departure

Instruction confirmation message

Hello [Customer Name],

Please confirm that the following information is correct for booking [Booking ID]:

Pet: [Name, type and breed]Service: [Service]Date and time: [Details]Sitter: [First name]Main instructions: [Summary]Behaviour notes: [Summary]Emergency contact: [Name/last digits]Veterinarian: [Clinic/name]

Please reply CONFIRMED or send any required correction before [deadline].

Sitter instruction sheet

The sitter should receive a concise operational version containing:

Booking ID

Service

Date and time

Location after assignment

Pet identity

Important behaviour

Equipment instructions

Service tasks

Emergency contacts

Required updates

Report-card deadline

Only information necessary for the booking should be shared.

Output

A complete, customer-confirmed instruction set attached to every booking.

Simple explanation for professor

“I reconfirmed the pet’s health, behaviour, equipment, home access and emergency information before finalising the service.”

17:00–18:00 — Prepare the Next-Day Service List

During the final session, I will create a single operational schedule for all services planned for the next day.

The schedule should allow the founder or operations coordinator to understand the complete day without searching across multiple chats.

Daily service-list columns

### Table 23

| Field | Purpose |
| --- | --- |
| Booking ID | Unique service reference |
| Customer ID | Links customer record |
| Pet name | Pet identification |
| Service | Walking or sitting |
| Area | Travel planning |
| Scheduled time | Service commitment |
| Sitter | Assigned caregiver |
| Backup sitter | Contingency |
| Payment status | Confirms financial readiness |
| Instructions confirmed | Safety control |
| Meet-and-greet status | Trust check |
| Reminder sent | Communication control |
| Emergency information | Availability check |
| Current booking status | Operational position |
| Next action | Remaining task |

Example next-day schedule

### Table 24

| Time | Booking | Area | Service | Sitter | Status |
| --- | --- | --- | --- | --- | --- |
| 7:30–8:00 AM | BK-0012 | Vesu | 30-minute walk | ST-004 | Confirmed |
| 9:00–10:00 AM | BK-0014 | Citylight | Pet sitting | ST-007 | Instructions pending |
| 6:00–6:30 PM | BK-0015 | Vesu | 30-minute walk | ST-002 | Payment pending |

A booking with pending instructions or payment should not appear as operationally ready.

Final readiness checks

For every next-day booking, confirm:

Payment received

Sitter explicitly accepted

Customer approved the sitter

Pet details complete

Instructions confirmed

Emergency contact available

Service location confirmed

Arrival method confirmed

Required equipment available

Report-card link ready

Customer and sitter reminders sent

Backup process understood

Customer reminder

Hello [Name],

This is a reminder for your PetSaathi booking tomorrow.

Booking ID: [ID]Pet: [Name]Service: [Service]Time: [Time]Sitter: [First name]

Please inform us immediately if your pet’s health, behaviour or access instructions have changed.

Sitter reminder

Hello [Sitter Name],

This is a reminder for booking [Booking ID] tomorrow.

Service: [Service]Time: [Time]Area: [Area]Reporting time: [Time]

Please confirm:1. Available2. Instructions reviewed3. Phone charged and internet available4. Travel plan ready

Output

A complete next-day operations list containing only paid, matched and instruction-ready services.

Simple explanation for professor

“I prepared a single daily schedule showing each booking, sitter, payment status, instructions and remaining action so the next day’s services could be managed without confusion.”

End-of-Day 3 dashboard

At the end of Day 3, I should prepare this report:

### Table 25

| Metric | Result |
| --- | --- |
| Hot leads contacted | [Enter result] |
| Customers who responded | [Enter result] |
| Trial offers sent | [Enter result] |
| Preferred dates received | [Enter result] |
| Payment links sent | [Enter result] |
| Full payments received | [Enter result] |
| Reservations received | [Enter result] |
| Sitters matched | [Enter result] |
| Customer approvals received | [Enter result] |
| Meet-and-greets scheduled | [Enter result] |
| Confirmed next-day services | [Enter result] |
| Main payment objection | [Enter result] |
| Main trust objection | [Enter result] |

Day 3 success checklist

Day 3 is complete when:

Only qualified, opted-in leads have been contacted.

Each customer received a specific service offer.

Prices and inclusions were clearly communicated.

Provisional sitter availability was checked before full payment.

Each payment link has a unique reference.

Paid and unpaid links are recorded separately.

Every assigned sitter explicitly accepted.

Customers approved their sitter match.

Pet and emergency details were reconfirmed.

Only ready bookings were added to the next-day schedule.

No unsupported safety or verification claim was made.

No booking was treated as confirmed solely because a payment link was sent.

Final Day 3 output

At the end of Day 3, PetSaathi should have:

A list of contacted hot leads

Clear trial offers

Genuine payment results

Matched customers and sitters

Complete pet-care instructions

Confirmed next-day bookings

Customer and sitter reminders

A record of payment, trust and availability objections

Simple explanation for professor

“On the third day of Phase 2, I contacted the strongest customer leads from Phase 1 and offered specific paid dog-walking or pet-sitting trials. I checked provisional sitter availability before sending full payment links and connected every payment to a unique booking reference. After payment, I matched each customer with a service-approved sitter according to the pet’s needs, location and schedule. I then reconfirmed the pet’s health, behaviour, equipment and emergency instructions. Finally, I prepared the next-day operations list containing only paid, matched and instruction-ready bookings.”PetSaathi Phase 2 — Days 4–7: Run the First Services Manually 🐾

Main goal of Days 4–7

The purpose of Days 4–7 is to complete the first real PetSaathi services safely and consistently.

During these four days, the team should validate whether:

Sitters arrive on time.

Customers receive the promised updates.

Pet instructions are followed correctly.

Walk and sitting reports are completed.

Operational problems can be handled quickly.

Customers are satisfied with the service.

Customers are interested in booking again.

Each booking produces a workable financial contribution.

The daily schedule should be repeated from Day 4 to Day 7. However, the team should improve the process each evening based on the problems observed during that day.

Daily Operating Schedule

### Table 26

| Time | Task | Required output |
| --- | --- | --- |
| 07:00–09:00 | Morning dog-walk operations | Completed morning services |
| 09:00–10:00 | Check reports and customer updates | Verified service records |
| 10:00–11:00 | Collect customer feedback | Ratings and improvement notes |
| 11:00–13:00 | Conduct new-customer calls | Qualified booking opportunities |
| 13:00–14:00 | Lunch | — |
| 14:00–16:00 | Coordinate sitters | Evening and next-day readiness |
| 16:00–19:00 | Evening walks and pet sitting | Completed evening services |
| 19:00–20:00 | Send pet report cards | Customer-facing reports |
| 20:00–21:00 | Update CRM and booking tracker | Accurate daily records |

Before 07:00 — Daily Readiness Check

Although the formal schedule begins at 07:00, the operations coordinator should review the day’s bookings before services begin.

For every morning booking, confirm:

The booking has a unique booking ID.

Customer payment has been received.

The assigned sitter has accepted the booking.

The customer has approved the sitter.

Pet health and behaviour details are complete.

The service address or meeting point is confirmed.

Emergency contacts are available.

The sitter has reviewed the instructions.

Required equipment is available.

The report-card link or template is ready.

A backup process exists if the sitter cancels.

A booking should not begin when the pet information, sitter assignment or emergency contacts are incomplete.

07:00–09:00 — Morning Dog-Walk Operations

During this period, PetSaathi will supervise the first morning dog-walking services.

Morning operations are important because daily or recurring dog-walking demand may be concentrated before customers leave for work.

Step 1: Confirm sitter departure

Before travelling, the sitter should confirm:

They are available.

Their phone is charged.

Internet access is working.

The route to the customer is understood.

The pet instructions have been reviewed.

The required reporting process is understood.

Sitter confirmation message

Good morning [Sitter Name].

Please confirm that you are ready for booking [Booking ID].

Reply:1 — Available and travelling2 — Delay expected3 — Emergency or unable to attend

A possible delay should be reported before the scheduled start time, not after the customer begins asking for an update.

Step 2: Record arrival

When the sitter reaches the service location, they should send an arrival confirmation.

The operations tracker should record:

Scheduled arrival time

Actual arrival time

Delay in minutes

Reason for delay

Customer informed

Service-start status

Arrival message

I have arrived for booking [Booking ID] at [time]. I am completing the equipment and pet-safety check before starting the walk.

Step 3: Check the pet and equipment

Before leaving the property, the sitter should confirm:

The correct pet has been identified.

The pet appears suitable to begin the service.

The collar or harness is secure.

The leash is not damaged.

Gates and doors can be controlled safely.

The weather is suitable.

Water is available when required.

The owner has not changed any important instructions.

If the equipment is unsafe, the sitter should pause the service and contact PetSaathi rather than improvising.

Step 4: Start the service formally

The sitter should record the actual start time.

When location sharing is part of the service, it should begin only when the walk begins and stop after the service is complete. WhatsApp allows live location to be shared for a selected duration and allows the sender to control or stop the sharing.

Location tracking should be used only when:

It was included in the booking.

The sitter agreed to share it.

The customer was informed.

The sharing period is limited to the service.

The location is sent privately rather than to a general group.

Step 5: Monitor the service

During the walk, the sitter should record relevant events such as:

Start time

Route or location status

Approximate distance

Pee

Poop

Waste collected

Water break

Pet mood

Pulling or reactive behaviour

Interaction with animals or people

Any health or safety concern

Structured pet-care platforms use similar fields. Rover Cards allow sitters to record photographs, pee, poop, food and water events, while the walking-map function records total time and distance.

Step 6: End the service safely

At the end of the walk, the sitter should:

Return the pet to the approved person or secure location.

Remove or store equipment according to instructions.

Check that the door and gate are secure.

Record the actual end time.

Send completion confirmation.

Submit the report within the required period.

Report any incident immediately.

Completion message

Booking [Booking ID] was completed at [time].

The pet has been returned safely and the detailed report will follow shortly.

Output

Completed morning walks with verified start and end times, customer updates and service evidence.

Simple explanation for professor

“I supervised the morning dog-walking services by checking sitter arrival, pet safety, service timing, location updates and successful completion.”

09:00–10:00 — Check Reports and Customer Updates

During this session, the operations coordinator will review every morning service report before closing the operational part of the booking.

The team should not assume that a service was completed correctly merely because the sitter sent a photograph.

Report review checklist

For every booking, check:

Actual start time is present.

Actual end time is present.

Service duration is correct.

Required photograph is attached.

Distance is recorded where applicable.

Pee and poop information is complete.

Water-break information is complete.

Pet mood is recorded.

Behaviour notes are factual.

Any unusual event is explained.

Customer received the required update.

The pet was returned or secured safely.

Incident status is marked.

Review the sitter’s language

The report should contain observations rather than medical conclusions.

Suitable wording

“Bruno slowed down during the last five minutes and continued normally after a short water break.”

Unsuitable wording

“Bruno has a heart condition.”

The sitter should report symptoms or observed behaviour. Medical diagnosis should be left to a qualified veterinary professional.

Resolve missing information

When a report is incomplete, the operations coordinator should contact the sitter immediately.

Missing-report message

Hello [Sitter Name],

The report for booking [Booking ID] is missing the following information:

[Missing field]

[Missing photograph or note]

Please update it by [time].

Repeated incomplete reports should affect sitter-performance evaluation.

Check customer communication

The team should confirm that the customer received:

Arrival confirmation

Relevant service update

Completion confirmation

Notice of any delay

Notice of any concern

The customer should not first discover a problem several hours after the service.

Output

Verified morning reports, completed customer updates and a list of any missing information.

Simple explanation for professor

“I reviewed the sitter reports and confirmed that the customer received accurate timing, activity, photo and safety information.”

10:00–11:00 — Collect Customer Feedback

During this session, PetSaathi will request feedback from customers whose services have been completed.

The purpose is to understand whether the service matched the customer’s expectations and whether the customer would book again.

Feedback should measure

Ask the customer to rate:

Booking experience

Sitter punctuality

Sitter professionalism

Pet handling

Communication

Quality of updates

Report-card usefulness

Overall satisfaction

A five-point scale may be used:

Very poor

Poor

Acceptable

Good

Excellent

Recommended feedback questions

Did the sitter arrive at the expected time?

Did you feel comfortable with the assigned sitter?

Were the service updates useful?

Was the report card clear?

Did your pet appear comfortable after the service?

Was any instruction missed?

What should PetSaathi improve?

Would you book the same sitter again?

Would you pay the regular expected price?

Would you recommend PetSaathi to another pet parent?

Feedback request message

Hello [Customer Name],

Thank you for completing your PetSaathi service.

Please share your honest feedback through this short form:[Feedback link]

Your response will help us improve sitter quality, service updates and future bookings.

The customer should be asked for an honest review, not specifically a positive review.

Handle negative feedback immediately

When the customer reports a serious problem:

Acknowledge the concern.

Open a complaint record.

Collect the customer’s explanation.

Preserve messages, reports and relevant evidence.

Obtain the sitter’s explanation.

Determine whether a safety, service or communication failure occurred.

Apply the complaint or refund policy.

Record the resolution.

The Consumer Protection (E-Commerce) Rules require e-commerce entities to provide relevant information about refunds, returns, grievance handling and other service terms. PetSaathi should therefore maintain a clear complaint and resolution process rather than handling each problem informally.

Output

Customer ratings, repeat-booking intentions, complaints and service-improvement notes.

Simple explanation for professor

“I collected customer feedback to measure sitter punctuality, communication, service quality and willingness to book again.”

11:00–13:00 — New-Customer Calls

During this session, PetSaathi will contact qualified new leads and convert available capacity into future bookings.

The team should prioritise customers who:

Live in the active areas

Need service within the next 30 days

Have given permission for follow-up

Match available sitter time slots

Have a suitable pet requirement

Accept the approximate price range

Call structure

Step 1: Introduce the purpose

Hello [Name], I am calling from PetSaathi regarding your interest in [dog walking/pet sitting]. I would like to confirm your requirement and check whether we have suitable availability in your area.

Step 2: Confirm the requirement

Ask:

Which service is required?

What date is needed?

What time is preferred?

How often will the service be needed?

Which area or society is involved?

What type of pet is involved?

Has the customer used a similar service before?

Step 3: Confirm the main concern

Ask:

Is your main concern sitter trust, price, availability or pet safety?

Would you prefer to meet the sitter first?

Would you prefer the same sitter for repeated bookings?

Which service update is most valuable to you?

Step 4: Present a specific offer

Do not ask only:

“Are you interested?”

Ask:

“We have a 30-minute dog-walking slot available in [Area] at [time] for ₹[amount]. It includes arrival confirmation, an agreed update and a final report. Would you like us to review your pet details for this slot?”

Step 5: Record the outcome

Mark the lead as:

Qualified

Pet details required

Sitter availability check

Meet-and-greet requested

Payment-ready

Interested later

Price objection

Trust objection

Not suitable

Not interested

Do not contact again

Output

New qualified booking requests, scheduled follow-ups and clearly recorded objections.

Simple explanation for professor

“I used the late morning period to speak with new customers and convert available sitter capacity into future paid bookings.”

13:00–14:00 — Lunch Break

During this period, the team will pause non-emergency work.

Before the break, the operations coordinator should verify that:

Morning services are complete.

Missing reports have been requested.

Serious complaints have been escalated.

Afternoon sitter availability is known.

Evening customers have received confirmation.

Emergency contact coverage remains active.

No booking-related emergency should be delayed because it occurs during the lunch period.

14:00–16:00 — Sitter Coordination

During this session, the operations team will prepare sitters for evening services and future bookings.

The purpose is to prevent last-minute cancellations, timing conflicts and incomplete instructions.

Review sitter availability

Confirm:

Evening availability

Next-day morning availability

Travel limitations

Blocked dates

Maximum daily booking capacity

Phone and internet availability

Service-specific approval

Review sitter performance

For sitters who completed morning services, record:

Arrival punctuality

Service completion

Report submission

Quality of updates

Customer feedback

Any warning or coaching requirement

Eligibility for additional bookings

A sitter with an unresolved safety complaint should not automatically receive another booking.

Confirm evening assignments

For every evening service, confirm:

The sitter has accepted.

The customer has approved the sitter.

Payment is complete.

Pet instructions are final.

Travel time is realistic.

Service equipment is available.

The sitter has no overlapping booking.

A backup option exists where possible.

Prepare next-day matches

Use the remaining time to identify sitters for the following morning.

The team should consider:

Customer area

Sitter locality

Pet size and behaviour

Approved service

Arrival reliability

Same-sitter preference

Travel buffer

Payout compatibility

Coach sitters where needed

Examples of coaching topics include:

Improving report quality

Sending updates at the correct time

Avoiding vague observations

Reporting delays earlier

Maintaining customer privacy

Following equipment checks

Communicating professionally

Output

Confirmed evening assignments, updated availability and provisional next-day sitter matches.

Simple explanation for professor

“I coordinated sitter availability, reviewed morning performance and confirmed that the evening assignments were operationally ready.”

16:00–19:00 — Evening Dog Walks and Pet Sitting

During this period, PetSaathi will supervise evening walks and home pet-sitting visits.

The same basic rules used for morning walks should apply:

Record arrival.

Confirm the pet and instructions.

Start the service formally.

Send required updates.

Report concerns immediately.

Record the end time.

Secure the pet and property.

Submit the report.

Additional checks for evening walks

The sitter should consider:

Reduced visibility

Traffic

Society-entry restrictions

Safe walking routes

Reflective or visible equipment

Weather

Crowded common areas

Interaction with other dogs

The route should remain within the approved service area.

Additional checks for pet sitting

At the beginning of a home visit, the sitter should confirm:

The entry method works.

The correct pet is present.

Doors and windows are secure.

Food and water instructions are clear.

Restricted rooms are understood.

Emergency details are accessible.

Before leaving, the sitter should confirm:

Food and water tasks are complete.

Toilet or litter tasks are complete.

The pet is secure.

Doors and windows are secured.

Keys are returned or stored correctly.

The customer receives departure confirmation.

Privacy rule

Photographs, videos, addresses, live locations and customer instructions are personal operational information.

They should be shared only with authorised people and used only for the required service purpose. India’s Digital Personal Data Protection Act establishes a framework for processing digital personal data for lawful purposes while recognising individuals’ right to protect their information.

Customer photographs should not be reused for Instagram or promotional material unless separate marketing permission has been obtained.

Emergency handling

If a pet becomes injured, seriously ill, lost or unsafe:

Stop the normal service process.

Protect the pet from immediate danger when safe.

Call PetSaathi operations.

Contact the customer.

Contact the registered emergency person if needed.

Contact the veterinarian or emergency hospital.

Follow professional instructions.

Record the incident timeline.

AVMA pet first-aid guidance emphasises knowing when and how to seek emergency veterinary care and maintaining emergency-contact information.

Output

Completed evening walking and sitting services with accurate timing, updates and incident handling.

Simple explanation for professor

“I supervised the evening walks and sitting visits while checking timing, home security, customer communication and pet safety.”

19:00–20:00 — Send Pet Report Cards

During this session, the operations coordinator will review and send the final customer-facing reports.

A report card should be sent only after checking it for accuracy and completeness.

Dog-walking report card

PetSaathi Pet Report Card 🐾

Booking ID: [ID]Pet: [Pet name]Service: 30-minute dog walkScheduled time: [Time]Actual time: [Start–End]Distance: Approximately [distance]Pee: Yes/NoPoop: Yes/NoWater break: Yes/NoMood: [Mood]Behaviour: [Short observation]

Sitter note: [Factual summary]

Photos or videos are attached where included.

Pet-sitting report card

PetSaathi Pet-Sitting Report 🐾

Booking ID: [ID]Pet: [Pet name]Visit time: [Start–End]Food provided: Yes/No/Not requiredWater refreshed: Yes/NoToilet or litter update: [Details]Play or companionship: [Details]Pet mood: [Mood]Home secured: Yes

Sitter note: [Factual summary]

Photos or videos are attached where included.

Report delivery target

PetSaathi may set an internal target such as sending the final report within 30–60 minutes after service completion.

This is an internal operating target, not a legal or industry requirement.

The actual delivery time should be measured so the future software can automate reminders when reports are late.

Output

Accurate and customer-friendly report cards sent for every completed service.

Simple explanation for professor

“I reviewed the sitter’s information and sent the customer a structured report showing what happened during the service.”

20:00–21:00 — Update the CRM and Booking Tracker

During the final daily session, the team will update every operational and financial record.

This step is essential because decisions made through WhatsApp chats alone are difficult to analyse later.

Booking tracker updates

For every service, record:

Booking status

Scheduled time

Actual start and end time

Sitter ID

Service completion

Report status

Customer-update status

Incident status

Review-request status

Repeat-offer status

Final notes

Payment and payout updates

Record:

Customer payment status

Payment reference

Refund requirement

Sitter payout eligibility

Final sitter payout

Payout status

Platform contribution

Sitter-performance updates

Record:

Arrival punctuality

Cancellation

Report completion

Communication quality

Customer rating

Same-sitter request

Complaint or incident

Coaching required

Customer updates

Record:

Overall rating

Main feedback

Repeat-booking interest

Referral interest

Complaint status

Preferred future service

Next follow-up date

Daily issue log

Every problem should receive an issue ID.

### Table 27

| Field | Example |
| --- | --- |
| Issue ID | OPS-014 |
| Booking ID | BK-0023 |
| Issue | Sitter arrived 18 minutes late |
| Severity | Medium |
| Customer informed | Yes |
| Immediate resolution | Walk extended |
| Root cause | Travel buffer too short |
| Preventive action | Add 20-minute buffer |
| Owner | Operations |
| Status | Closed |

End-of-day status check

Before finishing, confirm:

All completed bookings have reports.

All customer payments are recorded.

All sitter payouts are calculated.

Open incidents have responsible owners.

Next-day services are scheduled.

Customers requiring follow-up are identified.

Sensitive information remains access-controlled.

Cancelled bookings are retained for analysis.

No important decision remains only inside a private chat.

Output

A fully updated CRM, booking tracker, payout sheet and issue log.

Simple explanation for professor

“I updated all customer, sitter, booking, payment and incident records so the next day’s operations could begin with accurate information.”

Day-by-Day Focus

Day 4 — Process Validation

The first day should use a small number of low-risk bookings.

The team should focus on:

Checking that every status works

Ensuring reports arrive

Measuring communication time

Finding missing fields

Identifying sitter-training gaps

Do not overload the operations team on the first live day.

Day 5 — Correct the First Problems

Review Day 4 and improve:

Reminder timing

Sitter travel buffers

Customer instructions

Report-card fields

Payment reconciliation

Customer updates

The goal is to determine whether the same mistakes occur again after correction.

Day 6 — Test Repeatability

The team should attempt to complete several services using the improved workflow.

Measure whether:

Another sitter can follow the same process

Reports remain consistent

Customers receive updates on time

Operations can handle overlapping services

Backup sitters are available

Day 7 — First Operational Review

At the end of Day 7, review:

Total bookings completed

On-time arrival rate

Sitter cancellation rate

Report-card completion

Average customer rating

Complaints

Incidents

Refunds

Repeat requests

Contribution per booking

Administrative time per booking

Days 4–7 KPI Dashboard

### Table 28

| KPI | Meaning |
| --- | --- |
| Services scheduled | Total confirmed work |
| Services completed | Successfully delivered bookings |
| On-time arrival rate | Sitter reliability |
| Service-completion rate | Operational success |
| Report-card completion rate | Process compliance |
| Update-completion rate | Customer communication |
| Average customer rating | Satisfaction |
| Same-sitter request rate | Trust and continuity |
| Repeat-booking interest | Retention potential |
| Complaint rate | Quality problems |
| Cancellation rate | Booking instability |
| Incident count | Safety performance |
| Refund rate | Financial or service failure |
| Average support time | Manual operational workload |
| Contribution per booking | Financial viability |

Operational Success Conditions by Day 7

The first service period is working when:

Most confirmed bookings are completed.

Sitters arrive consistently on time.

Customers receive the promised updates.

Every completed booking has a report card.

Serious incidents are handled through the protocol.

Customer complaints are documented and resolved.

Some customers request the same sitter or another booking.

Sitter payouts and customer payments are reconciled.

One or more areas show repeatable demand.

The operations team can clearly identify what should be improved.

Warning Conditions

Pause or reduce bookings when:

Sitters repeatedly fail to arrive.

Pet details remain incomplete.

Reports are consistently missing.

Customers receive incorrect information.

The team cannot monitor simultaneous bookings.

Emergency contacts are unavailable.

Serious incidents remain unresolved.

The customer price cannot cover basic service delivery.

Sensitive customer data is being shared carelessly.

The process depends entirely on memory or unrecorded chats.

Simple Explanation for Professor

“From Day 4 to Day 7, I operated PetSaathi’s first real services manually. In the morning, I supervised dog walks and checked sitter arrival, pet safety, service timing and customer updates. I then reviewed the reports and collected customer feedback. During the late morning, I contacted new customers and qualified future bookings. In the afternoon, I coordinated sitter availability and prepared evening assignments. I supervised evening dog walks and pet-sitting visits, after which I sent structured pet report cards to customers. At the end of every day, I updated the CRM, booking tracker, payment records, sitter payouts and incident log. This four-day process tested whether PetSaathi could complete paid bookings safely, consistently and repeatedly before building a full application.”

PetSaathi Phase 2 — Week 1 Review and Week 2 Reliability Plan 🐾

Overall purpose

At the end of Week 1, PetSaathi should determine whether the manual booking process can deliver real services with acceptable quality.

During Week 2, the objective changes from completing isolated trial bookings to creating a repeatable, reliable service system.

The transition should be:

Trial booking → successful service → satisfied customer → repeat plan → recurring revenue

Established pet-care marketplaces also treat ratings, repeat customers, response rates and cancellations as important quality indicators. Rover’s current Star Sitter criteria, for example, include repeat customers, a high average rating and prompt responses. Rover also records last-minute sitter cancellations so pet parents can evaluate reliability. These examples support tracking the same categories, but PetSaathi’s exact thresholds remain internal pilot targets rather than industry standards.

Part 1 — Week 1 Success Targets

### Table 29

| Metric | Week 1 target |
| --- | --- |
| Paid bookings | 10–20 |
| Completed bookings | 8–18 |
| Customer rating | 4.5 or higher |
| Sitter no-shows | Maximum 0–1 |
| Refund rate | Below 5% |
| Repeat interest | At least 5 users |

These targets should be reviewed together. Achieving twenty payments is not enough when several services fail, customers request refunds or sitters do not arrive.

1. Paid Bookings — Target: 10–20

What this metric means

PetSaathi should receive payment for approximately ten to twenty genuine service bookings during Week 1.

A paid booking should count only when:

The customer selected a specific service.

The service date or time was agreed.

The customer accepted the price.

Payment was successfully received.

The payment was linked to a booking ID.

A suitable sitter was available or provisionally assigned.

The following should not be counted as paid bookings:

Payment links that were only sent

Failed transactions

Verbal promises to pay

Free services

Internal test payments

Refundable reservations with no genuine service requirement

Razorpay Payment Links have trackable lifecycle states, allowing PetSaathi to distinguish links that are created, pending, paid, cancelled or expired. The payment tracker should use the confirmed payment state rather than assuming that a link sent to a customer has converted.

Why the target matters

Ten to twenty paid bookings provide enough early activity to test:

Customer payment behaviour

Sitter availability

Morning and evening demand

Report-card completion

Customer complaints

Repeat-booking interest

Basic contribution per booking

How to interpret the result

### Table 30

| Actual result | Interpretation |
| --- | --- |
| 15–20 paid bookings | Strong initial demand, subject to service quality |
| 10–14 paid bookings | Minimum target achieved |
| 5–9 paid bookings | Promising but weak conversion |
| Fewer than 5 | Payment demand remains insufficient |

Simple explanation

“Paid bookings show that customers are willing to spend real money on PetSaathi rather than only expressing interest.”

2. Completed Bookings — Target: 8–18

What this metric means

A booking should be counted as completed only when:

The sitter arrived.

The agreed service was delivered.

The start and end times were recorded.

The pet was safely returned or secured.

Required updates were submitted.

The report card was completed.

Any incident was reported.

The customer received completion confirmation.

A paid booking that is scheduled for a future date should remain under Confirmed, not Completed.

Booking completion rate

Use the following formula:

Completed bookings ÷ Paid bookings × 100

Example:

If PetSaathi receives 15 paid bookings and completes 13, the completion rate is:

13 ÷ 15 × 100 = 86.7%

Reasons a booking may not be completed

Record the reason separately:

Customer cancellation

Sitter cancellation

Sitter no-show

Customer no-show

Unsafe pet equipment

Incomplete pet information

Payment issue

Weather or emergency

Service rescheduled

This distinction matters because a customer cancellation is different from a sitter reliability failure.

Recommended Week 1 objective

PetSaathi should aim to complete most confirmed bookings, but the pilot should not force an unsafe service merely to achieve a numerical target.

Simple explanation

“Completed bookings prove that PetSaathi can convert payments into successfully delivered services.”

3. Customer Rating — Target: 4.5 or Higher

What this metric means

The average rating from completed bookings should be at least 4.5 out of 5.

A five-point review may measure:

Booking experience

Sitter punctuality

Sitter professionalism

Pet handling

Communication

Quality of updates

Report-card usefulness

Overall satisfaction

Reviews should be requested after the service is complete. Rover similarly allows reviews after completed booked services, while PetBacker displays reviews from pet owners after completed jobs as a customer trust feature.

Average rating formula

Total rating points ÷ Number of reviews received

Example:

If five customers provide ratings of 5, 5, 4, 4 and 5:

23 ÷ 5 = 4.6

Important small-sample warning

During Week 1, one poor review can change the average considerably.

Therefore, PetSaathi should analyse:

The average rating

The number of reviews

The lowest rating

The reason behind low ratings

Rating by sitter

Rating by service

Rating by area

Rating interpretation

### Table 31

| Average rating | Interpretation |
| --- | --- |
| 4.7–5.0 | Strong early satisfaction |
| 4.5–4.69 | Target achieved |
| 4.0–4.49 | Service quality requires improvement |
| Below 4.0 | Pause expansion and investigate |

Rover currently requires a 4.9 or higher average as one condition for its Star Sitter designation. PetSaathi does not need to copy this threshold, but it demonstrates that mature platforms use high ratings as one element of provider-quality assessment.

Simple explanation

“A rating of 4.5 or above suggests that customers were generally satisfied, but the team must also investigate the reasons behind every low rating.”

4. Sitter No-Shows — Maximum: 0–1

What this metric means

A sitter no-show occurs when:

The sitter accepted a confirmed booking.

The sitter did not arrive.

The sitter did not provide sufficient advance notice.

No approved replacement completed the service.

A sitter who reports a genuine emergency in advance should be recorded as a sitter cancellation, not automatically as a no-show.

Why no-shows are critical

A no-show can cause:

Customer loss

Pet-care disruption

Refunds

Emergency replacement work

Negative reviews

Damage to customer trust

Rover publicly records certain last-minute sitter cancellations to help customers understand whether cancellation is an isolated event or part of a pattern. This supports maintaining a transparent internal reliability record for every PetSaathi sitter.

No-show rate

Sitter no-shows ÷ Confirmed bookings × 100

Required action after a no-show

Contact the customer immediately.

Attempt to arrange an approved replacement.

Provide a full refund when the service cannot be delivered.

Record the incident against the sitter.

Ask the sitter for a written explanation.

Review whether warning, suspension or removal is appropriate.

Identify whether the failure resulted from scheduling, communication or sitter conduct.

Recommended rule

Zero no-shows: Expected standard

One no-show: Serious investigation required

More than one: Sitter process or supply quality is not ready to scale

Simple explanation

“A sitter no-show is one of the most serious reliability failures because the customer may be depending on the service at a specific time.”

5. Refund Rate — Target: Below 5%

What this metric means

The refund rate shows how often paid bookings required full or partial refunds.

Use:

Refunded bookings ÷ Paid bookings × 100

Alternatively, track financial refund rate:

Total amount refunded ÷ Total amount collected × 100

PetSaathi should calculate both because a partial refund affects money differently from a fully cancelled booking.

Refund reasons should be separated

Sitter cancellation

Sitter no-show

Customer cancellation

Incomplete service

Service-quality complaint

Duplicate payment

Payment error

Safety concern

PetSaathi unable to provide a sitter

Goodwill adjustment

Razorpay supports full and partial refunds for captured payments and allows refund activity to be tracked separately from the original payment. PetSaathi should record refund requested, refund initiated and refund completed as separate statuses.

Small-sample warning

With only ten to twenty Week 1 bookings, one refund may move the percentage significantly.

Therefore, the team should examine the reason for every refund rather than treating the percentage alone as the final judgement.

Interpretation

### Table 32

| Result | Interpretation |
| --- | --- |
| No refunds | Positive, but verify that complaints were not ignored |
| Below 5% | Target achieved |
| 5–10% | Investigate the main causes |
| Above 10% | Significant service or operational problem |

Simple explanation

“The refund rate shows how often PetSaathi failed to deliver the service according to the agreed conditions.”

6. Repeat Interest — Target: At Least 5 Users

What this metric means

Repeat interest means that at least five customers indicate that they may use PetSaathi again.

Strong repeat signals include:

Requesting another date

Asking for the same sitter

Asking about a walking package

Selecting a weekly schedule

Paying for another service

Purchasing a multi-service pack

The signals should be separated into levels.

### Table 33

| Repeat level | Meaning |
| --- | --- |
| Verbal interest | Customer says they may book again |
| Date requested | Customer suggests another service date |
| Repeat offer accepted | Customer agrees to a specific plan |
| Repeat payment | Customer pays for another booking or package |

A repeat payment is stronger than a positive answer to a feedback question.

Recurring service is an established model for dog walking and drop-in care. Rover, for example, supports services that automatically repeat every week until cancelled. This supports testing structured walking or sitting plans once manual operations are stable.

Simple explanation

“Repeat interest shows whether customers see PetSaathi as an ongoing service rather than a one-time discounted experiment.”

Week 1 Review Dashboard

At the end of Week 1, complete this table:

### Table 34

| Metric | Target | Actual | Status | Main reason | Action |
| --- | --- | --- | --- | --- | --- |
| Paid bookings | 10–20 | — | Green/Amber/Red | — | — |
| Completed bookings | 8–18 | — | Green/Amber/Red | — | — |
| Completion rate | Track | — | — | — | — |
| Customer rating | 4.5+ | — | — | — | — |
| Sitter no-shows | 0–1 | — | — | — | — |
| Refund rate | Below 5% | — | — | — | — |
| Repeat-interest users | 5+ | — | — | — | — |

Part 2 — Week 2: Improve Reliability and Repeat Bookings

Main goal

The purpose of Week 2 is to move PetSaathi from random, one-time trials into a more predictable service model.

The Week 2 operating goal is:

Deliver consistent services with the best sitters and convert satisfied customers into repeat customers.

The team should not increase booking volume until the main Week 1 problems have been identified.

Week 2 Main Actions

### Table 35

| Action | Main purpose |
| --- | --- |
| Identify the best sitters | Build dependable supply |
| Offer repeat plans | Create recurring revenue |
| Fix operational problems | Improve reliability |
| Create a backup-sitter list | Reduce cancellations |
| Improve report cards | Strengthen customer trust |
| Collect testimonials | Build credible marketing evidence |

Action 1 — Identify the Best Sitters

What this means

PetSaathi should compare sitters using actual service performance rather than application quality alone.

A sitter who interviews well may still perform poorly during live bookings.

Sitter-performance metrics

Track:

Bookings accepted

Bookings completed

On-time arrivals

Late arrivals

Cancellations

No-shows

Report-card completion

Quality of updates

Customer rating

Customer complaints

Same-sitter requests

Repeat bookings

Incident count

Suggested sitter score

### Table 36

| Criterion | Weight |
| --- | --- |
| Safety compliance | 25% |
| Punctuality | 15% |
| Service completion | 15% |
| Customer rating | 15% |
| Communication | 10% |
| Report completion | 10% |
| Cancellation performance | 5% |
| Repeat requests | 5% |

Sitter categories after review

Preferred sitter

The sitter has strong punctuality, communication, ratings and process compliance.

Active sitter

The sitter performs adequately and may continue receiving suitable bookings.

Probation sitter

The sitter requires coaching or closer monitoring.

Suspended sitter

The sitter has a serious or repeated performance problem and should not receive new bookings until review.

Availability should also remain current. Rover advises sitters to maintain an accurate service calendar, and its platform uses confirmed availability to show that a caregiver has reviewed their schedule.

Output

A ranked list of five to ten dependable sitters with approved services, areas and time slots.

Action 2 — Offer Repeat Plans

What this means

Satisfied customers should receive a structured plan rather than being asked to make a new manual booking every time.

Repeat plans may improve:

Customer convenience

Sitter scheduling

Same-sitter continuity

Predictable demand

Cash flow

Retention

Eligibility for repeat offers

Offer a repeat plan when:

The first service was completed successfully.

The customer provided positive or acceptable feedback.

No serious complaint remains open.

The sitter is willing and available.

The customer has a recurring requirement.

The package price remains financially workable.

Repeat-plan message

Hello [Name],

Thank you for using PetSaathi. Since you indicated that you need regular [walking/sitting], we can prepare a repeat plan with scheduled service dates.

The plan can include the same preferred sitter, subject to availability, and the usual updates and report cards.

Would you like to review the available package options?

Important wording correction

Avoid promising a same-walker guarantee unless PetSaathi can genuinely guarantee it.

A safer pilot phrase is:

Same-walker preference

or:

Dedicated walker plan, with approved backup support when the primary walker is unavailable

Output

Repeat plans offered to satisfied and suitable customers.

Action 3 — Fix Operational Problems

What this means

Every Week 1 problem should be converted into a documented correction.

Examples include:

### Table 37

| Week 1 problem | Week 2 correction |
| --- | --- |
| Sitter arrived late | Increase travel buffer |
| Report submitted late | Introduce report deadline and reminder |
| Customer instructions incomplete | Add mandatory confirmation checklist |
| Payment not linked to booking | Require booking ID in payment reference |
| Customer missed sitter introduction | Send confirmation template earlier |
| Two bookings overlapped | Add calendar conflict check |
| Customer did not receive update | Add update-completion field |
| Refund was delayed | Create refund owner and deadline |

Root-cause process

For every significant problem, record:

What happened?

Why did it happen?

Was it a one-time or repeated issue?

Who was responsible for correction?

What process must change?

How will the fix be tested?

Did the issue happen again?

Output

An updated operating procedure based on actual booking failures.

Action 4 — Create a Backup-Sitter List

What this means

Every active area and important time slot should have alternative sitters.

The purpose is to reduce service failure when the primary sitter becomes unavailable.

Backup list fields

Sitter ID

Area

Approved services

Pet-size capability

Morning availability

Evening availability

Weekend availability

Maximum travel distance

Emergency availability

Current bookings

Reliability level

Last availability confirmation

Backup structure

For each area, identify:

Primary walking sitters

Secondary walking sitters

Pet-sitting backups

Weekend sitters

Emergency replacements

Important restriction

The backup sitter should still:

Hold the correct service approval

Review the pet instructions

Accept the booking

Be approved by the customer

Receive the correct payout

Follow the same reporting rules

Replacement support is already used as a trust mechanism in established marketplaces. Rover, for example, states that it will attempt to assist customers when a sitter cancels close to the booking.

Output

A location- and service-specific backup list ready for operational use.

Action 5 — Improve Report Cards

What this means

The report card should be improved using customer feedback and sitter experience.

PetBacker publicly highlights GPS walk reports, photographs, videos and post-service reviews as customer trust features. Rover Cards similarly support photos, walk time, distance, toilet information, food and water updates. These examples support using a structured PetSaathi report rather than sending an unorganised WhatsApp message.

Possible improvements

Add:

Scheduled and actual time

Late-arrival reason

Distance

Route status

Pee and poop update

Water break

Food update

Pet mood

Behaviour

Health concern

Instructions completed

Media attached

Customer notification time

Incident status

Keep the report usable

The report should not become so long that sitters fail to complete it.

Use conditional sections:

Walking fields for walking services

Sitting fields for sitting services

Boarding fields for boarding services

Output

A shorter, clearer and more consistent report-card process.

Action 6 — Collect Testimonials

What this means

PetSaathi should request testimonial permission from customers who completed real services.

A testimonial should be based on a genuine booking.

Testimonial questions

Ask:

Which service did you use?

What problem were you trying to solve?

What did PetSaathi do well?

How did you feel about the sitter?

Were the updates useful?

Would you use PetSaathi again?

May we publish your comment?

May we display your first name, area or pet photograph?

Separate review and marketing consent

A customer may submit a private review without agreeing to public marketing use.

Use separate fields:

Service review submitted

Testimonial publication permitted

Pet photograph permitted

Customer name permitted

Area permitted

Output

Three to five genuine, consent-based testimonials from completed customers.

Part 3 — Repeat Booking Offers

The proposed package prices below should be treated as pricing experiments, not permanent prices.

Before launch, each plan must define:

Number of services

Duration of every service

Validity period

Supported area

Number of pets

Sitter payout

Cancellation rules

Expiry and unused-service rules

Same-sitter conditions

1. Five-Walk Pack — ₹699–₹999

Purpose

This package is suitable for customers who want to test regular walking without committing to a full monthly plan.

Example structure

Five 30-minute walks

Valid for 14 or 30 days

One dog included

Same preferred walker where available

Arrival and completion updates

Report card after each walk

Price interpretation

At ₹699, the approximate customer price is ₹139.80 per walk.

At ₹999, the approximate customer price is ₹199.80 per walk.

The selected price should depend on:

Local trial result

Sitter payout

Travel cost

Service duration

Customer demand

Included support

Important rule

The package should not be heavily discounted if the discount creates negative contribution.

2. Ten-Walk Pack — ₹1,299–₹1,999

Purpose

This package is suitable for customers with recurring weekly or near-daily demand.

Example structure

Ten 30-minute walks

Valid for 30 or 45 days

Scheduled time slots

Same preferred walker

Approved backup sitter

Report card after every service

Price interpretation

At ₹1,299, the approximate price is ₹129.90 per walk.

At ₹1,999, the approximate price is ₹199.90 per walk.

Operational requirement

PetSaathi should not sell more packages than its sitter capacity can support.

Before payment, reserve:

Expected service dates

Primary sitter capacity

Backup availability

Customer area

Travel buffer

3. Weekly Sitting Pack — ₹999–₹1,999

Important clarification

This package cannot be published until PetSaathi defines exactly what “weekly sitting” includes.

Possible structures include:

Option A

Three one-hour visits per week

Option B

Five 30-minute feeding visits

Option C

One three-hour sitting session plus one short visit

Each structure has different sitter time, travel cost and customer value.

Required details

State:

Number of visits

Duration per visit

Service days

Feeding or companionship tasks

Travel area

Pet count

Validity period

4. Weekend Boarding Beta — ₹999–₹1,999 per Night

Purpose

This offer may test limited overnight demand.

Restrictions

Boarding should remain available only through:

Home-assessed providers

Approved partner boarding homes

Capacity-controlled hosts

Providers following the emergency protocol

Locations where local requirements have been reviewed

Price should account for:

Provider payout

Overnight responsibility

Food responsibilities

Support

Emergency risk

Platform margin

Additional pets

Special-care requirements

Do not publish boarding as widely available when only one or two approved hosts exist.

5. Same-Walker Premium Add-On

Recommended name

Use:

Preferred Walker Continuity

rather than an unconditional “same walker guarantee.”

What it can include

Priority scheduling with the customer’s preferred walker

Fixed recurring time slot

Earlier renewal opportunity

Approved backup sitter when unavailable

Advance notice of sitter changes

Conditions

The customer should understand that:

The preferred walker may become unavailable because of illness or emergency.

PetSaathi will provide notice.

A customer-approved backup may be offered.

The customer may reschedule or receive the applicable refund when no suitable replacement exists.

Part 4 — Week 2 Daily Schedule

### Table 38

| Time | Task |
| --- | --- |
| 08:00–09:00 | Review previous-day bookings |
| 09:00–10:00 | Call satisfied customers |
| 10:00–11:00 | Offer repeat plans |
| 11:00–12:00 | Review sitter performance |
| 12:00–13:00 | Handle new leads |
| 13:00–14:00 | Lunch |
| 14:00–16:00 | Run scheduled services |
| 16:00–17:00 | Collect testimonials |
| 17:00–19:00 | Evening service operations |
| 19:00–20:00 | Update the dashboard |

08:00–09:00 — Review Previous-Day Bookings

During this hour, review:

Services scheduled

Services completed

Late arrivals

Missing reports

Customer ratings

Complaints

Refunds

Sitter payouts

Repeat interest

Open incidents

Required output

A daily issue list and clear operational priorities.

09:00–10:00 — Call Satisfied Customers

Contact customers who:

Rated the service positively

Requested the same sitter

Mentioned recurring requirements

Had no unresolved complaint

Permitted follow-up communication

Call objective

Understand:

How frequently they need the service

Preferred days and times

Whether they want the same sitter

Whether they would purchase a package

Which package length feels suitable

What price they accept

Required output

A list of customers suitable for repeat plans.

10:00–11:00 — Offer Repeat Plans

Provide only the plan that fits the customer’s requirement.

Examples:

Weekly walker → five-walk pack

Near-daily walker → ten-walk pack

Travel customer → sitting package

Weekend traveller → controlled boarding enquiry

Record:

Plan offered

Price

Customer response

Objection

Payment status

Preferred sitter

Proposed dates

Required output

Structured repeat offers and paid-package opportunities.

11:00–12:00 — Sitter Performance Review

Review each active sitter’s:

Punctuality

Completion rate

Reports

Customer rating

Cancellations

Complaints

Same-sitter requests

Availability

Coaching needs

Decisions

Increase booking priority

Continue normally

Limit approved services

Provide coaching

Place on probation

Suspend temporarily

Required output

An updated sitter ranking and service-permission list.

12:00–13:00 — Handle New Leads

Continue customer acquisition, but prioritise the active areas and available service slots.

The team should avoid accepting demand it cannot deliver.

Required output

Qualified future bookings without overloading supply.

14:00–16:00 — Run Scheduled Services

Manage:

Arrival confirmation

Service start

Customer updates

Completion

Reports

Emergencies

Cancellations

The Week 2 objective is consistency, not only volume.

Required output

Successfully completed daytime services.

16:00–17:00 — Collect Testimonials

Contact suitable customers after:

The service is complete.

Feedback is positive.

No complaint is open.

Marketing permission is requested separately.

Required output

Consent-based customer testimonials and approved media.

17:00–19:00 — Evening Service Operations

Monitor evening walks and sitting services.

Give particular attention to:

Traffic delays

Sitter travel buffers

Reduced visibility

Overlapping services

Customer handover

Home security

Required output

Completed evening bookings and service reports.

19:00–20:00 — Update Dashboard

Update:

Total bookings

Repeat bookings

Paid packs

Sitter rankings

Customer ratings

Refunds

No-shows

Testimonials

Contribution

Open problems

Required output

A current management dashboard ready for the next day.

Part 5 — Week 2 Success Targets

### Table 39

| Metric | Target |
| --- | --- |
| Total bookings | 30–50 |
| Repeat customers | 10 or more |
| Repeat rate | 20–30% |
| Best sitters identified | 5–10 |
| Testimonials | 3–5 |
| Paid packs sold | 3–5 |

These are internal operating targets and should be interpreted according to the number of customers, service capacity and local demand.

1. Total Bookings — Target: 30–50

Clarify whether this is cumulative

The preferred definition is:

Thirty to fifty cumulative Phase 2 bookings by the end of Week 2.

This prevents confusion about whether Week 2 alone must generate thirty to fifty new services.

Track separately:

Bookings requested

Bookings paid

Bookings confirmed

Bookings completed

Bookings cancelled

Capacity warning

Do not increase booking volume when:

Reports are late.

Sitters are overloaded.

No backup is available.

Complaints remain unresolved.

The founder cannot monitor active services.

2. Repeat Customers — Target: 10 or More

A repeat customer should count only after completing or paying for another booking.

Record separately:

Repeat interest

Repeat booking requested

Repeat booking paid

Repeat service completed

Simple explanation

“Ten repeat customers demonstrate that the service is providing ongoing value rather than only attracting trial users.”

3. Repeat Rate — Target: 20–30%

Recommended formula

Customers who make a second paid booking ÷ Customers eligible to book again × 100

Do not include customers whose first service ended too recently for a repeat need.

Example

If forty customers completed a first service and ten purchased another service:

10 ÷ 40 × 100 = 25%

The target is achieved.

4. Best Sitters Identified — Target: 5–10

The best sitters should demonstrate:

Safe service delivery

Strong punctuality

Complete reports

Good customer reviews

Low cancellation

Professional communication

Repeat customer requests

The target should not be reached by lowering standards merely to name ten sitters.

5. Testimonials — Target: 3–5

Testimonials should be:

From real completed customers

Accurate

Voluntary

Used with permission

Connected internally to a booking record

Edited only for clarity without changing meaning

6. Paid Packs Sold — Target: 3–5

A package should count as sold only when:

The package structure is clear.

The customer accepted the terms.

Payment was received.

Service capacity exists.

The package is connected to a customer and pet record.

Track:

Package ID

Customer ID

Package type

Number of included services

Amount paid

Services used

Remaining balance

Expiry

Assigned sitter

Refund or cancellation status

Week 2 Decision Rules

Green — Continue and prepare Week 3

Continue when:

Services are completed reliably.

Repeat customers are emerging.

Five or more dependable sitters are identified.

Paid packages are selling.

Customer ratings remain strong.

Refunds and no-shows remain controlled.

Amber — Continue with corrections

Continue cautiously when:

Trial demand is strong but repeat bookings are low.

Customers want packages but sitter capacity is insufficient.

Service quality is good but reports remain inconsistent.

Repeat customers exist only in one area.

One or two sitters handle most bookings.

Red — Pause growth

Pause new promotions when:

No-shows increase.

Refunds rise.

Ratings decline.

Reports are missing.

Sitters are overloaded.

Customers reject normal prices after discounted trials.

Repeat demand is absent.

Final Week 2 Output

By the end of Week 2, PetSaathi should have:

A clear Week 1 performance report

Five to ten preferred sitters

An approved backup-sitter list

Corrected operating procedures

Improved report cards

Repeat-plan offers

Three to five paid packages

Ten or more repeat customers

Three to five approved testimonials

A dashboard showing booking, quality, retention and financial results

Simple Explanation for Professor

“At the end of Week 1, I will evaluate whether PetSaathi achieved ten to twenty paid bookings, completed most of those services, maintained an average customer rating above 4.5, limited sitter no-shows, controlled refunds and generated repeat interest. During Week 2, I will focus on reliability and retention. I will identify the best sitters, create a backup-sitter list, correct operational problems, improve report cards and offer structured repeat plans to satisfied customers. The package prices will remain experiments and will be tested against sitter payouts and operating costs. By the end of Week 2, the target is thirty to fifty cumulative bookings, at least ten repeat customers, a repeat rate of twenty to thirty percent, five to ten dependable sitters, three to five testimonials and three to five paid packages.”

PetSaathi Phase 2 — Week 3: Society and Micro-Market Density 🐾

Main goal of Week 3

The purpose of Week 3 is to concentrate customers, sitters and partners inside a small operating zone instead of accepting bookings across distant parts of a city.

The statement that a pet-care marketplace becomes profitable only when users and sitters are close is too absolute. A better statement is:

Geographical density can improve marketplace liquidity, reduce travel and customer-acquisition costs, increase sitter utilisation and make replacements easier. However, density alone does not guarantee profitability.

For marketplaces with local network effects, performance should be measured market by market because network density can affect acquisition costs, organic growth and unit economics. Additional supply in another city may provide little value to a customer who needs a sitter nearby.

1. What Micro-Market Density Means

A micro-market is a small geographical operating area containing enough customers and sitters to support frequent bookings.

For PetSaathi, a micro-market may be:

Three nearby apartment societies

One residential neighbourhood

A cluster within a two-to-three-kilometre radius

Several societies sharing the same sitter pool

One area supported by nearby veterinary and grooming partners

Weak operating pattern

One booking in Whitefield, one in Andheri, one in Bopal and one in Wakad.

These bookings are located in completely different cities and cannot share sitters, backup capacity, local referrals or operational support.

Strong operating pattern

Twenty bookings from three nearby societies in one area.

This concentration can make it easier to:

Assign nearby sitters

Reduce travel time

Schedule consecutive walks

Provide backup sitters

Build local referrals

Offer society-specific time slots

Lower acquisition costs

Create repeat customer habits

Simple explanation

“Instead of spreading operations across the whole city, PetSaathi should build one strong local cluster where customers and sitters are close to each other.”

2. Week 3 Operating Principle

PetSaathi should select one primary area using Week 1 and Week 2 data.

The area should demonstrate:

Paid customer demand

Repeat-booking interest

Several suitable sitters

Short travel distances

Apartment-society density

Veterinary support

Low cancellation risk

Workable contribution per booking

The selected area should then receive most Week 3 outreach, sitter availability and marketing effort.

Example

Suppose the current results are:

### Table 40

| Area | Paid bookings | Active sitters | Repeat interest | Average travel time |
| --- | --- | --- | --- | --- |
| Vesu | 14 | 5 | 8 customers | 12 minutes |
| Adajan | 6 | 2 | 2 customers | 25 minutes |
| Citylight | 4 | 1 | 1 customer | 28 minutes |

Vesu should probably become the primary Week 3 micro-market because it has the strongest combination of demand, supply and travel efficiency.

3. Society Outreach Strategy

PetSaathi should approach several people around a society, but each contact has a different role.

3.1 Apartment Managers

The apartment manager may help PetSaathi understand:

Entry requirements

Vendor-registration rules

Common-area availability

Event permissions

Resident communication procedures

Security and visitor processes

The manager may not personally approve the pilot. They may need permission from the RWA or management committee.

Recommended request

“Could you guide us regarding the correct person and approval process for sharing a voluntary pet-care pilot with residents?”

3.2 RWA or Committee Members

RWA members are important because they may have authority to:

Review the pilot proposal

Approve resident communication

Permit a society meeting

Allow an awareness event

Define operating conditions

Introduce PetSaathi to pet-parent representatives

PetSaathi should present itself as an optional service for interested residents, not as an authority that controls society pet rules.

The Animal Welfare Board of India has issued guidance concerning pet dogs, caregivers, RWAs and apartment-owner associations. Current AWBI material continues to refer to those RWA/AOA guidelines, so society plans should respect animal-welfare guidance as well as applicable local rules.

3.3 Security Office

Security personnel may help explain:

Visitor-entry processes

Approved entry gates

Sitter identity requirements

Service-time restrictions

Parking or waiting rules

Emergency-access procedures

However, security staff should not be treated as the final decision-maker unless the society has expressly authorised them.

PetSaathi should not ask the security office to provide residents’ private phone numbers.

3.4 Pet-Parent Groups

Existing pet-parent groups can provide direct access to the target users.

PetSaathi may use these groups to:

Share a voluntary survey

Invite residents to an information session

Collect walking-time preferences

Recruit customers for a limited trial

Identify common local pet-care problems

Participation should remain voluntary.

3.5 Society WhatsApp Administrators

The administrator may circulate an approved message or opt-in form.

PetSaathi should avoid collecting an entire resident contact list. WhatsApp’s business guidance requires customer opt-in before personalised marketing messages are initiated.

Better process

Society admin posts the PetSaathi invitation.

Interested residents open the form or message PetSaathi.

PetSaathi records their communication permission.

Only opted-in residents receive follow-up messages.

3.6 Local Pet Shops Near Societies

Nearby pet shops may help with:

Brochure placement

Customer referrals

Resident-event promotion

Local service awareness

Sitter referrals

Introductions to pet-owning customers

The relationship should be documented so customers understand whether the shop is only referring PetSaathi or formally participating in the service.

4. Improved Society Pitch

Original message

“We are running a verified pet-care pilot for your society: dog walking, pet sitting, and emergency pet-care support with photo updates.”

The original message is understandable, but two phrases require caution.

“Verified pet care”

This is too broad unless every sitter has completed a defined verification process.

Use exact descriptions such as:

Identity checked

Interview completed

Reference checked

Approved for dog walking

Training completed

“Emergency pet-care support”

This may sound like PetSaathi guarantees emergency veterinary treatment.

A more accurate phrase is:

Emergency escalation process

Veterinary referral support

Defined emergency-contact procedure

Recommended society message

Hello [Name],

PetSaathi is running a limited pet-care pilot for residents of [Society/Area].

The pilot includes:

Dog walking

Home pet sitting

Screened and service-approved caregivers

Photo or service updates

Pet Report Cards

A documented emergency-escalation process

We would like to discuss a voluntary resident survey and a small society-specific pilot.

Could we schedule a 15-minute meeting with the appropriate manager or committee representative?

This version communicates the offer without claiming universal safety, guaranteed availability or automatic society approval.

5. Society Pilot Packages

Package 1 — Basic Community Support

Original offer

Free WhatsApp group plus verified walker list

Recommended correction

Use:

Free opt-in pet-care information channel plus an approved walker directory

A normal WhatsApp group may expose member phone numbers to other participants. WhatsApp Communities offer greater phone-number privacy in some contexts, and announcement groups can be configured so only community administrators post announcements.

Basic package may include

Opt-in announcement channel

Pet-care FAQs

Approved walker directory

Emergency clinic information

Service-area updates

Resident-interest survey

Important limitation

The directory should show each sitter’s actual status, such as:

Approved for small-dog walking

Interview completed

Three completed bookings

Rating based on completed services

Do not present an applicant as generally “verified” without explaining what was checked.

Package 2 — ₹99 First Walk

Purpose

The trial offer reduces the first-purchase barrier and measures actual payment demand inside the society.

Suggested inclusions

One 30-minute walk

One approved walker

Arrival and completion confirmation

One photo or update

Toilet and water information

Short report card

Conditions to define

Supported dates and times

One dog included

Applicable society or area

Pet-safety review

Sitter availability

Cancellation conditions

Whether the offer is limited to first-time users

Recommended wording

“Eligible residents may book one 30-minute introductory walk for ₹99, subject to pet review and sitter availability.”

Package 3 — Premium Society Pilot

Original offer

Society-specific sitter slots

Meaning

PetSaathi reserves certain sitter time periods for customers within the participating society.

Example

7:00–9:00 AM walking window

5:00–8:00 PM walking window

Weekend sitting slots

One preferred walker

One approved backup sitter

Benefits

Shorter sitter travel

Better punctuality

Easier same-walker continuity

Faster replacement

More predictable booking capacity

Important wording

Do not promise guaranteed availability unless sufficient sitter capacity has been reserved.

Use:

“Priority society-specific service slots, subject to confirmed capacity.”

Package 4 — Pet-Care Awareness Event

The event may be used to:

Explain dog walking and pet sitting

Introduce PetSaathi’s screening process

Collect resident requirements

Provide pet-safety education

Introduce a veterinary or grooming partner

Recruit local sitters

Accept trial registrations

Event requirements

Confirm:

Society permission

Venue

Date and time

Expected attendance

Pet-attendance policy

Safety and cleaning rules

Partner responsibilities

Photography consent

Registration process

The event should not be advertised as a veterinary camp unless a qualified veterinary professional has agreed to participate.

Package 5 — Monthly Walking Plan

Purpose

This package converts trial users into recurring customers.

Possible structure

Eight, ten or twenty walks

Fixed time window

Same-walker preference

Approved backup walker

Report after every walk

Defined validity period

Information to specify

Number of walks

Duration of each walk

Package price

Expiry date

Supported time slots

Additional-pet charge

Cancellation and rescheduling rules

Unused-walk policy

Primary and backup sitter arrangements

Important rule

PetSaathi should confirm sitter capacity before selling monthly packages.

6. Recommended Week 3 Execution Plan

Day 1 — Select the Primary Micro-Market

Analyse:

Paid bookings by area

Repeat customers by area

Available sitters

Average travel time

Society density

Partner coverage

Contribution per booking

Output

One primary area and one secondary waitlist area.

Day 2 — Prepare Society Assets

Create:

One-page society proposal

Resident opt-in form

Society-specific brochure

Trial-walk offer

Event proposal

Service and safety FAQ

Partner contact sheet

Output

A complete society outreach package.

Days 3–4 — Contact 20 Societies

Prioritise societies that:

Are inside the selected area

Have significant residential density

Appear to have several pet-owning households

Are close to approved sitters

Have suitable service-entry processes

Can support recurring morning or evening demand

Output

Twenty documented society outreach attempts.

Day 5 — Conduct Meetings

During each meeting, explain:

PetSaathi’s services

Sitter screening stages

Resident opt-in process

Pilot pricing

Report-card process

Emergency escalation

Society responsibilities

Next-step options

Output

Meeting notes and decisions from authorised representatives.

Day 6 — Launch the First Society Pilot

Begin with one to three societies that agreed to a specific action.

Possible first actions include:

Sharing the resident form

Opening trial registration

Holding an information session

Reserving walking slots

Starting a five-customer pilot

Output

Paid society-level booking requests.

Day 7 — Review Density

Measure:

Leads per society

Paid bookings per society

Repeat customers

Sitter travel time

Booking completion

Society complaints

Customer rating

Contribution per booking

Output

A Week 3 density and partnership report.

7. Week 3 Targets Explained

### Table 41

| Metric | Target |
| --- | --- |
| Societies contacted | 20 |
| Society meetings | 5 |
| Interested societies | 3 |
| Society bookings | 20 or more |
| Repeat society customers | 10 or more |

These are PetSaathi’s internal operating targets, not universal industry benchmarks.

7.1 Societies Contacted — Target: 20

A society should be counted as contacted only when:

The message reaches an appropriate representative.

A call is completed.

A formal email or proposal is sent to the correct person.

An in-person introduction occurs.

The representative acknowledges the request.

Simply saving a society’s telephone number should not count.

Record

Society ID

Society name

Area

Contact person

Position

Contact channel

Contact date

Response

Next action

7.2 Society Meetings — Target: 5

A meeting should involve someone with influence or decision-making authority, such as:

Society manager

RWA president

RWA secretary

Committee member

Community manager

Authorised pet committee representative

The meeting may be:

In person

Video call

Structured telephone call

A casual conversation with a security guard should not be counted as a society meeting.

7.3 Interested Societies — Target: 3

A society should be classified as interested only after agreeing to a concrete next action.

Examples include:

Share the resident survey

Schedule a committee presentation

Approve an awareness event

Open trial registration

Discuss society-specific time slots

Identify a resident coordinator

Accepting a brochure alone is not sufficient.

7.4 Society Bookings — Target: 20 or More

A society booking should be counted when a resident has:

Selected a service

Provided pet details

Chosen a date or service period

Accepted the price

Completed payment or the approved reservation

Received a booking ID

Leads and survey responses should not be counted as bookings.

Track bookings by society:

### Table 42

| Society | Leads | Paid bookings | Completed bookings |
| --- | --- | --- | --- |
| Society A | 18 | 9 | 8 |
| Society B | 12 | 7 | 6 |
| Society C | 10 | 5 | 4 |

7.5 Repeat Society Customers — Target: 10 or More

A repeat customer should count only after making a second paid booking or purchasing a repeat package.

Separate:

Repeat interest

Repeat booking requested

Repeat booking paid

Repeat service completed

Ten genuine repeat society customers would provide stronger density evidence than twenty one-time heavily discounted trials.

8. Week 3 Conversion Metrics

Contact-to-Meeting Rate

Formula:

Society meetings ÷ Societies contacted × 100

Example:

5 ÷ 20 × 100 = 25%

Meeting-to-Interest Rate

Formula:

Interested societies ÷ Society meetings × 100

Example:

3 ÷ 5 × 100 = 60%

Society Booking Conversion

Formula:

Paid society bookings ÷ Society resident leads × 100

Repeat Society Rate

Formula:

Residents making a second paid booking ÷ Residents completing a first booking × 100

Local Sitter Utilisation

Formula:

Completed sitter service hours ÷ Available sitter hours × 100

This shows whether increased density is creating useful work for nearby sitters.

Average Sitter Travel Time

Record travel time for each booking and calculate:

Total sitter travel minutes ÷ Completed bookings

The goal is to see whether society concentration reduces operational movement.

9. Society CRM Structure

The society CRM should include:

Society ID

Society name

City

Area

Number of flats

Estimated pet-owning homes

Authorised contact

Contact role

First contact date

Meeting date

Survey permission

Event permission

Pilot status

Resident leads

Paid bookings

Repeat customers

Assigned sitters

Backup sitters

Main objection

Complaint status

Next follow-up

Do not collect or use residents’ personal information beyond what is needed for the stated service purpose. India’s DPDP framework recognises individuals’ right to protect their digital personal data and requires personal-data processing to have a lawful purpose.

10. Society Outreach Safety and Trust Rules

PetSaathi should follow these rules:

Obtain management or RWA permission before presenting a society-approved pilot.

Use resident opt-in, rather than requesting complete phone lists.

Explain sitter checks accurately, instead of using vague verification claims.

Do not promise guaranteed emergency medical care.

Do not claim society endorsement until it has been formally provided.

Share addresses only with the assigned sitter.

Keep resident and pet information outside general WhatsApp groups.

Define cancellation and refund conditions before payment.

Confirm sitter capacity before selling monthly packages.

Maintain an authorised escalation contact for society-related complaints.

11. Week 3 Decision Framework

Green — Micro-Market Strategy Is Working

Continue when:

Three societies agree to real next steps.

Twenty or more paid society bookings are generated.

At least ten residents make repeat bookings.

Sitter travel time declines.

Customer ratings remain strong.

Local sitter availability is sufficient.

Society complaints remain manageable.

Decision

Concentrate Week 4 growth in the same area.

Amber — Demand Exists but Density Is Incomplete

Use an amber status when:

Meetings occur but resident registrations are low.

One society performs strongly but the others do not.

Customer demand exists but sitter capacity is limited.

Residents want monthly plans but time slots are unavailable.

Society approvals take longer than expected.

Decision

Continue with the strongest society and revise the offer for the others.

Red — Society Strategy Is Not Working

Use a red status when:

Society representatives repeatedly reject the offer.

Resident opt-ins remain very low.

Paid bookings do not follow meetings.

Sitters cannot serve the selected societies.

Society rules make delivery impractical.

Customer prices cannot cover service delivery.

Privacy or safety requirements cannot be maintained.

Decision

Do not continue contacting societies only to achieve a numerical target. Test another micro-market or acquisition channel.

Final Week 3 Output

By the end of Week 3, PetSaathi should have:

One clearly selected micro-market

Twenty society contacts

Five formal society meetings

Three societies with concrete next actions

Twenty or more paid society bookings

Ten or more repeat society customers

A society-specific sitter and backup list

A resident opt-in process

Society package pricing

Customer and sitter density measurements

A decision about whether to deepen, modify or stop the society strategy

Simple explanation for professor

“During Week 3, I will concentrate PetSaathi’s operations inside one small geographical area instead of accepting scattered bookings across the city. I will approach apartment managers, RWA members, resident pet groups, WhatsApp administrators and nearby pet shops. Each society will receive a voluntary and clearly defined pilot offer, such as a first dog walk, reserved sitter slots, an awareness event or a monthly walking plan. Residents will opt in directly rather than PetSaathi collecting private contact lists. The target is to contact twenty societies, hold five meetings, identify three interested societies, generate at least twenty paid society bookings and obtain ten repeat society customers. The result will show whether local customer and sitter density can make PetSaathi more reliable and operationally efficient.”

PetSaathi Phase 2 — Week 4: Pilot Review and Phase 3 Decision 🐾

Main goal of Week 4

The purpose of Week 4 is to determine whether PetSaathi’s manual pilot has produced a business model that is safe, repeatable, financially workable and suitable for software automation.

The team should not move to Phase 3 simply because several bookings were completed. It must establish that:

Customers are willing to pay the expected normal price.

Customers return after the first discounted trial.

Sitters deliver services reliably.

One micro-market contains concentrated demand and supply.

Each core service has workable unit economics.

Customer-support work is manageable.

Safety incidents are controlled and properly investigated.

The manual process is stable enough to convert into software requirements.

Stripe describes product-market fit as the degree to which a product solves an important customer problem, with customer acquisition and retention providing important evidence. Sustainable scaling also requires strong unit economics and a repeatable way to meet demand.

The numbers used in the review should come from the booking, payment, payout, customer, sitter, review and incident records. The framework below explains how to analyse each task.

Week 4 tasks and outputs

### Table 43

| Task | Final output |
| --- | --- |
| Calculate unit economics | Contribution earned from each service |
| Review sitter performance | Preferred, active, probation and suspended sitters |
| Review customer feedback | Main problems, objections and requested improvements |
| Review city and area density | Primary micro-market |
| Review service demand | Core, secondary and restricted services |
| Review support workload | Manual operating effort per booking |
| Review safety issues | Current risk level and corrective actions |
| Decide Phase 3 readiness | Go, conditional go or no-go |

1. Calculate Unit Economics

Purpose

This task determines whether each booking creates financial value or loses money.

The expression “profit per service” should be used carefully. During the pilot, the first calculation should normally be the contribution per booking, because final net profit also depends on monthly fixed costs such as salaries, software, office expenses and legal costs.

Stripe defines contribution margin as the selling price minus variable costs and uses it to calculate the number of sales required to cover fixed costs.

Contribution formula

For each service, calculate:

Customer payment− sitter payout− payment-processing cost− sitter travel support− customer-support cost− refund or replacement cost− other variable service costs= contribution per booking

Contribution-margin percentage

Use:

Contribution per booking ÷ Customer payment × 100

Illustrative dog-walking example

### Table 44

| Item | Illustrative amount |
| --- | --- |
| Customer payment | ₹199 |
| Sitter payout | ₹125 |
| Payment cost | ₹5 |
| Operations and support cost | ₹20 |
| Travel or replacement reserve | ₹10 |
| Contribution per booking | ₹39 |
| Contribution margin | 19.6% |

These figures are only an example. PetSaathi must use its actual payment, payout and operating records.

Costs that must not be ignored

Sitter payout

Record the full amount paid or owed to the sitter, including:

Base payout

Travel allowance

Peak-time incentive

Additional-pet payout

Cancellation compensation

Performance bonus

Payment cost

Use the amount deducted by the payment provider rather than an estimated percentage.

Razorpay’s settlement information can show settlement amounts, fees, taxes and adjustments, while its refund system distinguishes full and partial refunds.

Operations cost

Calculate how much administrative time is spent on:

Customer qualification

Pet-detail checks

Sitter matching

Payment follow-up

Booking confirmation

Service monitoring

Report-card preparation

Review requests

Complaint resolution

A simple calculation is:

Admin minutes per booking ÷ 60 × hourly operations cost

For example, if one booking requires 30 minutes of administrative work and the estimated operations cost is ₹200 per hour:

30 ÷ 60 × ₹200 = ₹100 operational cost

Refund and service-failure cost

Include:

Full refunds

Partial refunds

Free replacement services

Customer credits

Sitter cancellation payments

Emergency transport subsidies

Goodwill compensation

Do not record a refund only when the customer receives the money. Track:

Refund requested

Refund approved

Refund initiated

Refund completed

Razorpay supports both full and partial refunds, and normal refunds may require several working days to reach the customer.

Customer-acquisition cost

Calculate the cost of acquiring a paying customer:

Marketing and outreach spending ÷ New paying customers

Calculate CAC separately for:

Instagram

Society outreach

Referrals

Veterinarian or groomer referrals

Paid advertisements

Offline events

A society customer acquired through one event may have a different CAC from an individual customer acquired through paid social advertising.

Analyse services separately

Do not combine walking, sitting and boarding into one average.

### Table 45

| Metric | Dog walking | Pet sitting | Boarding |
| --- | --- | --- | --- |
| Average customer price | — | — | — |
| Average sitter payout | — | — | — |
| Average support cost | — | — | — |
| Refund cost | — | — | — |
| Contribution per booking | — | — | — |
| Contribution margin | — | — | — |
| Repeat-booking rate | — | — | — |
| Incident rate | — | — | — |

A service with high revenue may still be unattractive if its support workload, refund rate or safety risk is excessive.

Unit-economics decision

Green

Core service has positive contribution at the expected normal price.

Repeat customers improve customer-level economics.

Contribution remains positive after normal support costs.

The result does not depend entirely on unpaid founder labour.

Amber

Contribution is positive before support costs but weak afterward.

Discounted trials lose money, but repeat bookings could become positive.

One area is profitable while other areas are not.

Additional pricing or payout tests are required.

Red

Every completed service loses money at realistic pricing.

Customers refuse the price required for positive contribution.

Sitter payout cannot be reduced without damaging supply.

Refunds and replacement costs remove the margin.

Operations require excessive manual labour.

Output

A service-level financial table showing the actual contribution, margin and break-even assumptions.

2. Review Sitter Performance

Purpose

This task identifies which sitters can support growth and which sitters create operational or safety risk.

Application quality and interview performance are no longer sufficient. Week 4 decisions should be based mainly on real booking performance.

Rover’s current sitter-quality criteria use measures including ratings, repeat customers, response behaviour and late cancellations. This supports evaluating PetSaathi sitters using several performance dimensions rather than customer rating alone.

Sitter metrics

### Table 46

| Metric | Meaning |
| --- | --- |
| Booking acceptance rate | How frequently suitable assignments are accepted |
| Completion rate | How many accepted bookings are completed |
| On-time arrival rate | Reliability |
| Cancellation rate | Booking instability |
| No-show count | Severe reliability failure |
| Report completion rate | Process discipline |
| Update completion rate | Customer communication |
| Average customer rating | Satisfaction |
| Same-sitter requests | Customer trust |
| Repeat bookings | Long-term value |
| Complaint rate | Service-quality problems |
| Incident rate | Safety performance |

Key formulas

On-time rate

On-time arrivals ÷ Completed bookings × 100

Define “on time” before calculating it. For example, arrival within the agreed service window.

Cancellation rate

Sitter-cancelled bookings ÷ Sitter-accepted bookings × 100

Report completion rate

Complete reports ÷ Completed bookings × 100

Repeat-request rate

Customers requesting the sitter again ÷ Customers served by the sitter × 100

Proposed sitter categories

Preferred sitter

A preferred sitter:

Follows safety procedures

Arrives reliably

Completes reports

Communicates professionally

Receives strong reviews

Generates repeat requests

Has no unresolved serious incident

Preferred sitters should receive repeat and package bookings first.

Active sitter

The sitter performs acceptably but has less experience or booking history.

The sitter may continue receiving bookings matching their approved service and capability.

Probation sitter

The sitter requires closer supervision because of:

Repeated lateness

Incomplete reports

Communication problems

Minor policy violations

Weak customer feedback

A written improvement requirement should be established.

Suspended sitter

Do not assign new bookings when there is:

A no-show without sufficient explanation

Serious dishonest information

Unsafe handling

Unauthorised substitution

Failure to report an incident

Customer-data misuse

An unresolved serious complaint

Do not rely on tiny samples

A sitter with one five-star review should not automatically be ranked above a sitter who completed fifteen reliable bookings with a 4.8 average.

The review should show both:

Performance percentage

Number of completed bookings

Output

A sitter performance report showing preferred sitters, active sitters, probation cases, suspensions and training actions.

3. Review Customer Feedback

Purpose

This task identifies what customers valued, what created dissatisfaction and what prevented repeat bookings.

Customer feedback should be combined from:

Review forms

WhatsApp conversations

Complaint records

Cancellation reasons

Repeat-booking requests

Refund requests

Society feedback

Support-call notes

Standard feedback categories

Classify comments under consistent categories:

Sitter trust

Sitter punctuality

Pet handling

Service updates

Report-card quality

Price

Availability

Same-sitter continuity

Customer support

Payment and refund experience

Emergency confidence

Home privacy

Booking convenience

Analyse each problem in three ways

Frequency

How many customers mentioned it?

Severity

How serious was the problem?

Commercial impact

Did the issue cause:

Lost payment

Cancellation

Refund

Negative review

Failure to repeat

Society complaint

Example

### Table 47

| Pain point | Mentions | Bookings affected | Severity | Required action |
| --- | --- | --- | --- | --- |
| Sitter changed unexpectedly | 8 | 5 | High | Preferred-sitter and backup policy |
| Report arrived late | 12 | 2 | Medium | Automated report reminder |
| Price felt high | 7 | 3 | Medium | Improve package/value explanation |
| Emergency process unclear | 4 | 4 | High | Add clear escalation explanation |

The most frequently mentioned problem is not necessarily the most important. A less frequent safety issue may deserve higher priority than a common visual complaint.

Identify positive feedback too

Record what customers valued, such as:

Same sitter

Photo updates

Quick WhatsApp response

Clear report card

Local walker

Reliable timing

Meet-and-greet option

Simple payment

These positive signals help define PetSaathi’s actual value proposition.

Output

A ranked customer pain-point list and a corresponding product or operations improvement plan.

4. Review City and Area Density

Purpose

This task identifies the best micro-market for further growth.

Local marketplaces should be analysed market by market because customer density can affect customer-acquisition costs, organic growth and unit economics.

Area metrics

For each locality or society cluster, calculate:

Customer leads

Paid customers

Completed bookings

Repeat customers

Active sitters

Backup sitters

Average sitter travel time

Average time to match a sitter

Customer-acquisition cost

Contribution per booking

Cancellation rate

Society partnerships

Customer rating

Area comparison example

### Table 48

| Metric | Area A | Area B | Area C |
| --- | --- | --- | --- |
| Paid customers | 22 | 11 | 8 |
| Completed bookings | 38 | 16 | 10 |
| Repeat customers | 12 | 4 | 1 |
| Active sitters | 6 | 3 | 2 |
| Average travel time | 12 min | 25 min | 31 min |
| Contribution per booking | ₹65 | ₹32 | ₹5 |
| Society partners | 3 | 1 | 0 |

Area A would be the stronger candidate because customer demand, sitter supply and economics overlap.

Micro-market classification

Primary micro-market

The area with:

Concentrated paid demand

Repeat customers

Reliable sitter supply

Short travel distances

Good contribution

Society support

Secondary micro-market

The area has promising demand but requires more supply or partnerships.

Waitlist area

The area produces scattered enquiries but cannot currently be served efficiently.

Exit or pause area

The area has weak payment conversion, long travel distances and no repeat activity.

Output

One primary launch cluster, one optional secondary cluster and a clear list of areas that should remain paused.

5. Review Service Demand

Purpose

This task determines which services should form the Phase 3 product.

Do not rank services only by enquiries. Compare the complete funnel.

Service funnel

For each service, record:

Enquiries

Qualified requests

Offers sent

Payments

Completed bookings

Repeat bookings

Refunds

Complaints

Contribution

Support workload

Comparison template

### Table 49

| Metric | Walking | Sitting | Boarding |
| --- | --- | --- | --- |
| Enquiries | — | — | — |
| Paid bookings | — | — | — |
| Payment conversion | — | — | — |
| Completed services | — | — | — |
| Repeat rate | — | — | — |
| Average rating | — | — | — |
| Contribution | — | — | — |
| Support minutes | — | — | — |
| Incident rate | — | — | — |

Service decisions

Core service

The service with the strongest combination of:

Paid demand

Repeat use

Sitter supply

Positive contribution

Reliable delivery

Manageable safety risk

Secondary service

A service with valid demand but lower frequency, supply or margin.

It may remain available without becoming the central MVP focus.

Controlled beta

A service that has revenue potential but higher safety or operating complexity.

Boarding may remain controlled even when demand is high.

Pause

Pause a service when:

Demand does not convert into payment.

Suitable providers are unavailable.

Safety controls are incomplete.

Support costs exceed the contribution.

Regulations or permissions remain unclear.

Output

A decision naming the Phase 3 core service, secondary service and restricted services.

6. Review Support Workload

Purpose

This task determines whether PetSaathi’s manual operating model can scale and which processes should be automated first.

The team should measure time rather than relying on the founder’s general impression that operations are “busy.”

Measure time by activity

### Table 50

| Activity | Minutes per booking |
| --- | --- |
| Customer qualification | — |
| Pet-detail review | — |
| Sitter search | — |
| Sitter and customer confirmation | — |
| Payment follow-up | — |
| Calendar scheduling | — |
| Active service monitoring | — |
| Report-card review | — |
| Review or repeat follow-up | — |
| Complaint resolution | — |

Important workload metrics

Average support time per booking

Total support minutes ÷ Completed bookings

Matching time

Measure the time between:

Customer qualification

Suitable sitter assignment

Report delay

Measure:

Service completion time

Customer report delivery time

After-hours support rate

Bookings requiring out-of-hours support ÷ Completed bookings × 100

Manual-error rate

Track errors such as:

Wrong sitter details

Incorrect payment status

Double booking

Missing report

Wrong customer message

Overlapping sitter schedules

Unrecorded refund

Concurrent booking capacity

Determine how many live services one operations person can monitor safely at the same time.

Identify automation priorities

Phase 3 should automate the activities that are:

Frequent

Repetitive

Rules-based

Time-consuming

Error-prone

Likely candidates may include:

Booking intake

Pet-profile storage

Sitter availability

Conflict checking

Payment-status updates

Booking reminders

Report submission

Admin dashboard

Status notifications

Do not automate rare or unstable processes before their rules are understood.

Output

A support-workload report showing administrative minutes, bottlenecks, manual errors and recommended automation priorities.

7. Review Safety Issues

Purpose

This task determines whether PetSaathi’s safety controls are effective enough to continue.

Safety analysis should include both actual incidents and near misses.

Incident categories

Pet escape

Bite or scratch

Injury

Illness or medical emergency

Unsafe equipment

Incorrect feeding or medication

Home-access problem

Lost key

Property damage

Sitter no-show

Privacy or data exposure

Boarding conflict

Failure to follow emergency protocol

Proposed severity levels

### Table 51

| Level | Meaning | Example |
| --- | --- | --- |
| S0 | No safety concern | Normal service |
| S1 | Minor issue | Small delay or incomplete update |
| S2 | Significant issue | Equipment failure caught before service |
| S3 | Serious incident | Bite, injury or pet temporarily missing |
| S4 | Critical incident | Severe injury, prolonged loss or major legal exposure |

These levels are PetSaathi’s internal risk classifications.

Review every significant incident

The incident review should record:

What happened

When it happened

Who was involved

Customer and pet impact

Immediate response

Veterinary involvement

Root cause

Contributing factors

Policy followed or missed

Corrective action

Action owner

Completion deadline

Google’s incident-review guidance recommends factual, non-blaming postmortems that identify root causes and preventive actions. The same principle can be adapted for PetSaathi’s safety reviews: the objective is to prevent recurrence, not merely blame one person.

AVMA emergency guidance also emphasises advance preparation and knowing when and how to seek veterinary assistance.

Hard safety stop conditions

Do not expand operations when:

A serious incident remains unresolved.

Sitters hide incidents.

Emergency contacts are not working.

Boarding homes are not properly assessed.

Customer pet-risk information is repeatedly missing.

Unauthorised substitutes are used.

The team cannot monitor concurrent bookings safely.

The same preventable incident continues after corrective action.

Output

An incident summary, risk level, root-cause analysis and list of mandatory corrective actions.

8. Decide Phase 3 Readiness

Purpose

This task decides whether PetSaathi should build a focused software MVP.

Phase 3 should not mean building the entire marketplace. It should automate only the processes that have been validated through the manual pilot.

Hard readiness gates

PetSaathi should normally pass all of the following:

Demand gate

Customers paid for real services.

The main service has repeat customers.

Demand continues beyond introductory discounts.

Economics gate

The core service has positive contribution, or a credible path to positive contribution at the normal price.

Sitter payouts remain attractive enough to maintain supply.

CAC is reasonable relative to repeat contribution.

Supply gate

Several reliable sitters are available in the primary micro-market.

Backup sitter coverage exists.

No-shows and cancellations are controlled.

Density gate

One area or society cluster contains meaningful customer and sitter concentration.

Travel and matching performance are improving.

Operations gate

The booking lifecycle is documented.

Routine bookings follow a consistent process.

Support workload is measurable.

The team knows which manual tasks should be automated.

Safety gate

No unresolved critical safety incident exists.

Sitters understand the emergency process.

Incident reporting and corrective-action systems work.

Retention gate

Customers make repeat bookings or buy packages.

Strong results are not produced only by one-time discounts.

A high repeat-purchase ratio is useful marketplace evidence because it shows customers continue to find value in the offering.

Phase 3 decision outcomes

GO — Build a Focused MVP

Choose Go when:

The core service has paid and repeat demand.

Unit economics are positive or clearly improvable.

One micro-market has density.

Reliable sitter supply exists.

Operations are stable.

Safety risks are controlled.

Manual workload has clear automation opportunities.

Phase 3 should initially build

Customer and pet profiles

Sitter profiles and service permissions

Sitter availability

Booking requests

Admin matching dashboard

Payment-status tracking

Booking lifecycle

Service reports

Reviews

Incident flags

Notifications

Live chat, advanced algorithms and complex nationwide features should wait unless the pilot proved they are necessary.

CONDITIONAL GO — Extend the Manual Pilot

Choose Conditional Go when:

Demand is promising but repeat use is still uncertain.

One service works but another remains unclear.

Unit economics are close to positive.

Operations work only with heavy founder involvement.

Sitter supply is concentrated among too few people.

The safety process requires correction.

One micro-market is promising but still small.

Action

Extend the manual pilot by another two to four weeks and test only the unresolved assumptions.

NO-GO — Do Not Build Phase 3 Yet

Choose No-Go when:

Customers do not repeat.

Normal pricing does not convert.

Core services have consistently negative economics.

Sitters are unreliable.

Demand remains scattered.

Support workload is excessive.

Serious safety problems remain unresolved.

Booking processes continue changing every day.

Software would automate a process that is not yet working.

A no-go decision means the present model needs revision. It does not necessarily mean the PetSaathi idea must be abandoned.

Recommended Phase 3 Readiness Scorecard

### Table 52

| Area | Green | Amber | Red |
| --- | --- | --- | --- |
| Demand | Strong paid and repeat use | Paid use but weak repeat | Mostly interest or discounts |
| Economics | Positive contribution | Near break-even | Consistently negative |
| Sitters | Reliable pool and backups | Limited dependable supply | Frequent failures |
| Density | Strong micro-market | Early cluster | Scattered city-wide |
| Operations | Repeatable workflow | Founder-heavy but workable | Unstable process |
| Safety | No unresolved critical risk | Corrective work pending | Serious unresolved issues |
| Retention | Repeat bookings and packs | Verbal repeat interest | No repeat behaviour |

Decision rule

All hard gates green: Go

Mostly green with one or two amber areas: Conditional Go

Economics, safety or repeat demand red: No-Go

Do not average away a critical red safety result by achieving strong marketing numbers.

Recommended Week 4 Review Schedule

### Table 53

| Day | Main review | Output |
| --- | --- | --- |
| Day 1 | Clean records and calculate unit economics | Financial model |
| Day 2 | Review sitter performance and customer feedback | Quality report |
| Day 3 | Review micro-market density and service demand | Market focus |
| Day 4 | Review support workload and safety incidents | Operations and risk report |
| Day 5 | Conduct final leadership review | Phase 3 decision |
| Day 6 | Prepare approved Phase 3 scope or extension plan | Product roadmap |
| Day 7 | Communicate decisions to sitters, partners and team | Pilot closure plan |

Final Week 4 Validation Report

The report should contain:

Pilot summary

City tested

Areas tested

Pilot duration

Paid bookings

Completed bookings

Repeat customers

Total revenue

Total sitter payouts

Total refunds

Total contribution

Best-performing market

Primary area

Strongest societies

Active customers

Reliable sitters

Average travel time

Contribution per booking

Service decision

Core Phase 3 service

Secondary service

Controlled-beta service

Services to pause

Sitter decision

Preferred sitters

Active sitters

Probation sitters

Suspended sitters

Backup coverage

Customer findings

Top positive feature

Main pain point

Main trust concern

Main reason for repeat use

Main reason for cancellation

Operations findings

Support minutes per booking

Matching time

Report delivery time

Manual error count

Main automation priority

Safety findings

Incident count

Severity levels

Root causes

Corrective actions

Open safety risks

Final decision

Select one:

Move to Phase 3

Extend Phase 2

Change primary service

Change micro-market

Revise pricing and repeat pilot

Pause development

Simple explanation for professor

“During Week 4, I will review whether PetSaathi’s manual pilot can become a scalable business. I will first calculate the contribution earned from dog walking, pet sitting and boarding after deducting sitter payouts, payment costs, support work, refunds and other variable expenses. I will then compare sitter performance using punctuality, completion, ratings, cancellations, reports and repeat requests. Customer feedback will be grouped according to frequency, severity and business impact. I will compare different areas to identify the micro-market with the strongest demand, sitter availability and unit economics. I will also determine which service has the best combination of paid demand, repeat use, margin and manageable risk. Finally, I will measure the manual support effort and review every safety incident. PetSaathi should move to Phase 3 only when demand, economics, sitter reliability, local density, operations and safety are strong enough. Otherwise, the manual pilot should be extended or revised before software development begins.”

PetSaathi Phase 2 — Pilot Mistakes, Mandatory Rules and Phase 3 Gates 🐾

Overall assessment

Your Phase 2 direction is correct: operate manually, restrict risk, collect structured data and automate only after the workflow becomes reliable.

However, some rules need refinement. The strongest version of Phase 2 is:

A prepaid, manually operated pet-care pilot in one micro-market, using service-approved sitters, structured pet-risk checks, documented fallback coverage, report cards and performance scoring.

1. Mistake: Accepting Every Booking

Wrong approach

PetSaathi accepts:

Every pet

Every location

Every time slot

Every service

Every customer request

This may increase booking volume temporarily, but it creates operational and safety problems.

For example, a sitter approved for small dogs should not automatically handle a large reactive dog. Similarly, accepting a booking far outside the active area may create late arrival, excessive travel cost and no backup coverage.

Correct approach

Accept a booking only when:

The area is currently supported.

A service-approved sitter is available.

The pet’s behaviour and health information are complete.

The sitter has the required handling experience.

Travel time is manageable.

Emergency details are available.

Payment and cancellation conditions are accepted.

The service can be completed safely.

Recommended booking decision

Every request should receive one of these outcomes:

### Table 54

| Decision | Meaning |
| --- | --- |
| Accept | Safe, serviceable and financially workable |
| Accept with conditions | Meet-and-greet, specialised sitter or extra controls required |
| Waitlist | Demand exists but no suitable capacity is available |
| Decline | The booking cannot currently be completed safely or reliably |

Key principle

During Phase 2, quality, safety and repeatability are more important than booking volume.

2. Mistake: Having No Backup Sitter

Wrong approach

One sitter is assigned, but no replacement procedure exists.

If that sitter cancels or does not arrive, PetSaathi has only two options:

Fail the service

Search randomly at the last minute

Both outcomes damage customer trust.

Established pet-care platforms treat replacement support as an important protection. Rover states that when a sitter cancels close to the service date, it will attempt to help the customer find a replacement.

Correct approach

Every confirmed booking must have a fallback plan containing:

Primary sitter

Backup coverage

Operations escalation contact

Customer-notification process

Replacement approval process

Refund process if no replacement is possible

Important practical correction

A separately named backup sitter does not need to be permanently reserved for every ordinary dog walk. Doing that could block too much supply.

Use two backup models:

Named backup sitter

Mandatory for:

Boarding

Overnight sitting

High-risk pets

Recurring premium packages

Important travel-related bookings

Services where failure would leave the pet unattended

Backup coverage pool

Acceptable for standard walking bookings when:

Two or more approved local sitters are available.

Their availability is current.

PetSaathi has a defined replacement-response time.

The customer must approve the replacement.

Decision

Approve with modification.

The official rule should be:

Every booking must have documented fallback coverage. A named backup sitter is mandatory for high-risk, boarding, overnight and continuity-critical bookings.

3. Mistake: Manual Work Without Data

Correction to your wording

Your section currently says:

“Correct: Everything happens on WhatsApp, no tracking.”

This should be labelled Wrong, not correct.

Wrong approach

All decisions remain inside:

WhatsApp chats

Personal memory

Phone calls

Unstructured notes

This makes it difficult to determine:

Which customer paid

Which sitter accepted

Why a sitter was selected

Whether a refund was completed

Which sitter performs best

Which area has demand

Whether the business earns contribution

Correct approach

WhatsApp should be the communication layer, while the CRM remains the system of record.

Every booking should create or update:

Customer record

Pet record

Sitter record

Booking record

Payment record

Report card

Review record

Incident record

Sitter score

Repeat-booking status

Structured service records are consistent with established marketplace operations. Rover Cards, for example, can record photographs, routes, total distance, toilet breaks, food and water activity.

Recommended rule

A booking action is not operationally complete until it is recorded in the appropriate CRM table.

Examples:

WhatsApp payment screenshot received → update payment status.

Sitter accepts through chat → update sitter assignment.

Customer complains by phone → open complaint or incident record.

Report sent through WhatsApp → mark report delivered.

4. Mistake: Weak Sitter Onboarding

Wrong approach

Anyone who likes animals is allowed to become a sitter.

Loving pets is useful, but it does not prove that a person can:

Arrive reliably

Handle a strong dog

Follow home instructions

Protect customer privacy

Respond to an emergency

Complete accurate reports

Communicate professionally

Correct approach

Every sitter should pass clearly defined stages:

Application submitted

Identity information reviewed

Interview completed

References reviewed where required

Basic training completed

Practical service assessment completed

Approved for specific services

Probation bookings completed

Performance reviewed continuously

PetBacker’s provider process also separates service registration and identity-document verification, and its policies permit further background checks using submitted information.

Service-specific approval

A sitter should not receive one general approval covering everything.

Use labels such as:

Approved for small-dog walking

Approved for medium-dog walking

Approved for cat home visits

Approved for one-hour pet sitting

Boarding assessment pending

Not approved for reactive dogs

Required safety override

A good average score must never cancel out a serious violation.

Immediately pause a sitter after credible evidence of:

Abuse or unsafe handling

Unauthorised substitution

Hiding an escape or injury

Customer-data misuse

Falsified reports

Serious home-security violation

Repeated no-shows

Rover similarly treats last-minute sitter cancellations as important enough to create a visible record on the provider’s profile.

5. Mistake: Opening Boarding Too Early

Wrong approach

Every approved walker or sitter can immediately offer home boarding.

Boarding has additional risks:

Overnight supervision

Secure premises

Existing pets

Children in the home

Escape prevention

Feeding and medication

Emergency transport

Capacity limits

Society or landlord permissions

Local regulatory requirements

Correct approach

Boarding should remain a controlled beta and be available only through:

Home-assessed hosts

Approved partner boarding facilities

Providers with secure premises

Providers with emergency transport

Providers who accept capacity limits

Providers who complete boarding-specific training

Locations whose legal and society conditions have been checked

A boarding applicant should not be approved only from photographs. Use a video assessment or physical inspection where practical.

Proposed Upgrade 1 — Backup Sitter Rule

Recommended policy

Every confirmed booking must contain:

Primary sitter

Fallback method

Operations escalation contact

Replacement or refund process

Why it matters

Without fallback coverage, one cancellation can produce:

Service failure

Customer refund

Negative review

Pet-care disruption

Loss of repeat demand

Final decision

Approved with conditions.

A named backup is mandatory for high-risk or continuity-critical services. Standard walking may use a verified local backup pool.

Proposed Upgrade 2 — Sitter Scorecard

Recommended policy

Score the sitter after every completed booking.

Your proposed score is useful:

### Table 55

| Factor | Maximum points |
| --- | --- |
| On-time arrival | 20 |
| Communication | 20 |
| Pet handling | 25 |
| Report quality | 15 |
| Customer rating | 20 |
| Total | 100 |

Recommended improvements

Store both:

Individual booking score

Rolling average from the latest five or ten bookings

This prevents one excellent or poor service from permanently defining the sitter.

Sitter grades

### Table 56

| Grade | Score | Action |
| --- | --- | --- |
| A | 85–100 | Priority bookings |
| B | 70–84 | Remain active |
| C | 50–69 | Retraining and probation |
| D | Below 50 | Pause and formal review |

Safety rule

A critical safety incident overrides the numerical score.

Final decision

Approved. Make sitter scoring mandatory after every completed booking.

Proposed Upgrade 3 — Pet Risk Classification

Recommended policy

A pet suitability review should be mandatory before matching.

However, avoid permanently describing animals as simply “good,” “bad” or “aggressive.” Risk may change according to the service, environment and sitter.

Use:

### Table 57

| Level | Meaning | Operational response |
| --- | --- | --- |
| Green | Routine handling requirements | Standard approved sitter |
| Yellow | Additional handling or anxiety considerations | Experienced sitter and additional instructions |
| Red | Serious behavioural, medical or environmental concern | Specialist review; do not auto-accept |

Risk categories to record separately

Behaviour risk

Bite history

Reactivity

Resource guarding

Separation anxiety

Fear of strangers

Handling risk

Strong pulling

Escape history

Large size

Equipment problems

Multi-pet handling

Medical risk

Seizures

Breathing problems

Mobility limitations

Medication

Recent injury

Environmental risk

Unsafe balcony

Unsecured gate

Extreme weather

Other incompatible pets

Difficult society entry

Important rule

A red classification should mean:

“Manual safety review required.”

It should not automatically mean the pet is permanently banned.

Final decision

Approved with modification.

Make pet risk assessment mandatory, but use service-specific risk factors and separate behavioural, medical and environmental flags.

Proposed Upgrade 4 — No Unpaid Confirmed Bookings

Recommended policy

A standard consumer booking should become Confirmed only after successful payment.

Before payment, the booking may be:

Sitter Matching

Sitter Proposed

Customer Approval Pending

Payment Pending

Provisionally Held

Razorpay Payment Links can include an amount, description, unique reference ID and expiry date, allowing each payment request to be connected to its booking.

Allowed exceptions

Exceptions should never depend on the founder informally deciding that someone seems trustworthy.

Use written exception categories:

Approved repeat customer with a defined credit limit

Corporate account

Society invoicing agreement

Emergency booking approved by an authorised manager

Promotional service intentionally funded by PetSaathi

Every exception should record:

Person approving it

Amount

Payment deadline

Reason

Collection status

Cancellation fairness

Cancellation fees and refund conditions must be disclosed before payment. India’s Consumer Protection (E-Commerce) Rules state that a consumer should not be charged for cancellation unless similar charges are borne by the entity when it cancels unilaterally.

Final decision

Approved.

The official rule should be:

Standard bookings are prepaid. Pay-later service is allowed only under a documented exception policy.

Corrected Phase 2 Daily Dashboard

### Table 58

| Metric | Recommended target | Important clarification |
| --- | --- | --- |
| New qualified leads | 5–20 per day | Do not count irrelevant enquiries |
| Paid bookings | 1–5 per day | Must remain within sitter capacity |
| Confirmed-booking completion | 95%+ preferred | Record customer and sitter cancellations separately |
| Customer rating | 4.5+ | Show rating count as well as average |
| Sitter on-time rate | 95%+ preferred | Define the permitted arrival window |
| Sitter no-show rate | As close to 0% as possible | One no-show requires investigation |
| Refund rate | Below 5% | Separate full and partial refunds |
| Repeat paid-booking rate | 20–30%+ | Use customers eligible to repeat |
| Report-card delivery | 100% | Track delivery time |
| Payment before confirmation | 100% standard bookings | Exclude documented credit cases |
| Critical unresolved incidents | 0 | Do not average critical incidents into a percentage |

Important incident-metric correction

“Incident rate below 3%” is not sufficient by itself.

For example:

Three minor late updates may be manageable.

One serious pet escape may require an operational pause.

Track both:

Incident frequency

Incident severity

Corrected Phase 3 Go/No-Go Criteria

### Table 59

| Metric | Recommended gate |
| --- | --- |
| Total paid bookings | 50–100 |
| Paid repeat-customer rate | 20%+ |
| Average customer rating | 4.5+ |
| Review coverage | Preferably 60%+ of completed bookings |
| Approved active sitters | 10–25 overall |
| Reliable sitters in core area | At least 5–10 |
| Sitter no-show rate | Below 2%, ideally 0 |
| Sitter cancellation rate | Track separately; preferably below 5% |
| Refund rate | Below 5% |
| Core micro-market identified | Yes |
| Core service identified | Yes |
| Contribution at normal price | Positive |
| Repeatable booking SOP | Yes |
| Backup coverage | Yes |
| Unresolved critical incidents | 0 |
| Genuine testimonials | At least 3 |

Important correction

A sitter no-show target of below 5–10% is too permissive.

At 100 bookings, this could mean five to ten customers receiving no service. That is not suitable for a premium trust-based pet-care business.

Phase 2 Final Report — Improved Format

Business scope

City

Areas

Pilot duration

Active services

Controlled-beta services

Demand

Total leads

Qualified leads

Paid bookings

Completed bookings

Repeat customers

Paid packages

Cancellation rate

Supply

Total sitter applications

Approved sitters

Active sitters

Preferred sitters

Sitter no-shows

Sitter cancellations

Backup coverage

Quality and safety

Average rating

Number of reviews

Report-card completion rate

Complaints

Incidents by severity

Refunds

Open corrective actions

Market evidence

Most requested service

Highest-converting service

Strongest repeat service

Best micro-market

Best acquisition channel

Main customer concern

Finance

Total revenue

Total sitter payouts

Gross margin

Payment costs

Variable support costs

Refund costs

Net contribution

Contribution per service

Customer-acquisition cost

“Net contribution” should not be called final net profit unless fixed expenses, salaries, technology, legal costs and overheads have also been deducted.

Final decision

Select one:

Move to Phase 3

Extend Phase 2

Change area

Change primary service

Revise pricing

Pause the pilot

Final Approval Decision

### Table 60

| Proposed rule | Decision | Official wording |
| --- | --- | --- |
| Backup sitter for every booking | Approve with modification | Every booking requires documented fallback coverage; named backup required for high-risk and continuity-critical bookings |
| Sitter scorecard after every booking | Approve | Record booking-level score, rolling average and safety overrides |
| Pet risk classification | Approve with modification | Mandatory service-specific behavioural, medical, handling and environmental risk assessment |
| Payment before confirmation | Approve | Standard bookings are prepaid; exceptions require a written credit policy |

Final Phase 2 Recommendation

PetSaathi should operate as:

A premium manual pet-care service in one micro-market using structured CRM records, service-approved sitters, prepaid bookings, pet-risk checks, fallback coverage, service report cards and continuous sitter scoring.

The Phase 2 win condition should be:

50–100 genuine paid bookings, positive contribution at normal prices, an average rating of at least 4.5, at least 20% paid repeat customers, a reliable local sitter pool and no unresolved critical safety incident.

Simple explanation for professor

“Many Phase 2 pilots fail because founders accept every booking, depend on one sitter, keep information only in WhatsApp, approve untrained caregivers and introduce boarding too early. PetSaathi will instead accept only safe and manageable bookings. Every booking will have documented fallback coverage, and high-risk services will require a named backup sitter. Sitters will receive a performance score after every service, while serious safety problems will override the score. Every pet will receive a service-specific risk assessment before matching. Standard bookings will be confirmed only after payment, except for documented institutional or repeat-customer credit arrangements. PetSaathi should move to Phase 3 only after proving paid demand, repeat use, sitter reliability, positive unit economics, local market density and safe operations.”

PetSaathi Phase 3 — Sitter Onboarding, Verification, Training and Trust System 🐾

Core goal of Phase 3

The main goal of Phase 3 is to build a dependable and evidence-based sitter network before PetSaathi increases its booking volume or develops a complete marketplace application.

Phase 3 should answer one central question:

Can PetSaathi consistently recruit, assess, train, approve and monitor caregivers who can safely provide specific pet-care services?

A sitter should not be described as “verified” merely because they submitted an identity document. Identity checking, reference checking, background checking, training, practical assessment and final profile approval are different stages. Rover, for example, manually reviews sitter profiles and states that a background check is only one component of the broader approval process. PetBacker similarly separates identity-document verification, testimonials and an introductory test.

How Phase 3 differs from the earlier phases

Phase 1 — Demand validation

In Phase 1, PetSaathi tested whether:

Pet parents experience a genuine problem.

Customers understand the service.

Customers are interested in walking, sitting or boarding.

Customers are willing to pay.

Potential sitters and partners exist.

The main question was:

“Is there customer demand?”

Phase 2 — Operational validation

In Phase 2, PetSaathi manually completed paid bookings and tested whether:

Sitters arrived on time.

Services could be completed safely.

Customers received updates and reports.

Complaints and cancellations could be handled.

Customers booked again.

The service produced a positive contribution.

The main question was:

“Can the service be delivered reliably?”

Phase 3 — Trust and supply validation

In Phase 3, PetSaathi creates a formal system for:

Recruiting sitters

Screening applicants

Verifying submitted information

Training caregivers

Approving service permissions

Matching sitters with suitable pets

Monitoring performance

Suspending unsafe or unreliable providers

The main question becomes:

“Can PetSaathi build and maintain a reliable caregiver network at scale?”

This phase does not automatically transform the business into a scalable marketplace. However, it creates the supply-side trust system required before marketplace growth becomes responsible.

Phase 3 objectives explained

1. Build verified sitter supply

PetSaathi should create a consistent verification process for every applicant.

Recommended verification stages

Application completed

Phone and email confirmed

Government-issued identity document reviewed

Selfie or identity comparison completed

Current address information reviewed

References contacted where required

Video interview completed

Training modules completed

Practical service assessment passed

Approved for named services

The word “verified” should always describe the exact check completed.

Use:

Identity checked

Address information reviewed

Reference checked

Interview completed

Training completed

Approved for dog walking

Avoid unsupported phrases such as:

Completely verified

Guaranteed safe

Zero-risk caregiver

Fully police verified

PetBacker itself distinguishes verification badges and “trust points,” while its policy also warns that it does not universally check every provider’s background record. This demonstrates why PetSaathi must define every badge precisely.

2. Create sitter categories

A sitter should not receive one general approval for all pet-care services.

PetSaathi should classify sitters according to what they can safely provide.

Service categories

Small-dog walking

Medium-dog walking

Large-dog walking

Cat home visits

Dog home visits

Extended pet sitting

Senior-pet care

Multiple-pet care

Controlled boarding

Emergency backup availability

Experience categories

New probationary sitter

Experienced pet owner

Professional dog walker

Veterinary or animal-care student

Experienced home sitter

Boarding host

Specialist caregiver

Important rule

A sitter may be approved for one category and restricted from another.

For example:

“Approved for small- and medium-dog walking. Pet sitting assessment pending. Not approved for boarding.”

This makes matching safer and prevents the platform from treating every sitter as interchangeable.

3. Create a formal training system

Training should prepare sitters for real operational situations, not merely test whether they like animals.

Mandatory training modules

Module 1: Pet handling basics

Safe approach to unfamiliar pets

Body-language warning signs

Avoiding forced interaction

Leash and harness checks

Door and gate control

Escape prevention

Module 2: Dog-walking safety

Road-crossing procedures

Handling pulling

Avoiding unsafe off-leash activity

Managing interactions with unfamiliar dogs

Heat and weather precautions

Start and end confirmation

Module 3: Home pet-sitting

Customer privacy

Key and access handling

Approved rooms

Feeding and water instructions

Home-security checks

Arrival and departure reporting

Module 4: Communication and reporting

Customer updates

Photo and video standards

Report-card completion

Factual observations

Avoiding medical diagnosis

Reporting delays honestly

Module 5: Emergency escalation

Escape

Injury

Bite

Breathing difficulty

Collapse or seizure

Suspected poisoning

Customer not responding

Veterinary escalation

Module 6: Platform conduct

No unauthorised substitutes

No direct customer solicitation

No sharing customer information

No unapproved feeding or medication

No false reports

No hiding incidents

A sitter must complete 100% of mandatory modules relevant to their approved service. The 80% target should measure overall cohort completion, not allow individual sitters to skip required safety modules.

4. Build a trust-badge system

Badges should communicate specific evidence to customers.

Rover’s badges, for example, distinguish a completed background check from passing a knowledge quiz. PetSaathi should follow the same evidence-specific principle rather than using one vague “verified” badge.

Recommended PetSaathi badges

### Table 61

| Badge | Exact meaning |
| --- | --- |
| Identity Checked | Required identity evidence was reviewed |
| Interview Completed | Structured video interview was completed |
| Reference Checked | At least one reference was contacted |
| Training Completed | Required training modules were passed |
| Walking Approved | Practical walking assessment was passed |
| Sitting Approved | Home-sitting assessment was passed |
| Boarding Home Assessed | Boarding premises were separately assessed |
| Proven Sitter | Minimum completed-booking and performance requirements achieved |
| Emergency Backup | Sitter agreed to defined backup availability |

Badge governance rules

Every badge should have:

A written definition

Required evidence

Approval date

Approving administrator

Expiry or recheck date where appropriate

Suspension conditions

A badge should be removed or suspended when its underlying evidence is no longer valid.

5. Introduce pet-risk matching

Pet risk classification should guide matching, but it should not label pets permanently as “good” or “bad.”

Green risk

Routine care requirements.

Examples:

Calm behaviour

No known bite history

Standard walking equipment

No significant medical concern

Match: Standard service-approved sitter.

Yellow risk

Additional handling or supervision is required.

Examples:

Strong pulling

Anxiety

Fear of strangers

Escape tendency

Senior-pet mobility limitations

Medication instructions

Match: Experienced sitter, additional briefing and possibly a meet-and-greet.

Red risk

Serious behavioural, medical or environmental concerns require manual review.

Examples:

Recent bite incident

Severe aggression

Significant escape history

Uncontrolled medical condition

Unsafe equipment

Serious boarding incompatibility

Match: Specialist review, veterinarian input where appropriate, or decline the service.

Risk should be divided into separate fields

Behaviour risk

Medical risk

Handling risk

Environmental risk

Home-access risk

Boarding compatibility

A meet-and-greet can help assess the pet, sitter and home environment before the booking. Rover similarly encourages pre-service meetings to discuss a pet’s needs and behaviour and to check compatibility.

6. Create a sitter scorecard

Every approved sitter should receive a score after each completed booking.

Recommended score

### Table 62

| Factor | Maximum points |
| --- | --- |
| Safety and pet handling | 25 |
| On-time arrival | 15 |
| Communication | 15 |
| Instruction compliance | 15 |
| Report quality | 10 |
| Customer rating | 15 |
| Reliability and cancellation record | 5 |
| Total | 100 |

Grades

### Table 63

| Grade | Score | Action |
| --- | --- | --- |
| A | 85–100 | Priority assignments |
| B | 70–84 | Remain active |
| C | 50–69 | Coaching and probation |
| D | Below 50 | Pause and formal review |

Use a rolling score

The platform should store:

Score for each booking

Average of the latest five bookings

Lifetime average

Number of completed bookings

Customer-rating sample size

A sitter with one five-star booking should not automatically outrank someone with twenty consistently reliable services.

Mandatory safety override

A critical safety or integrity issue overrides the numerical score.

Immediately pause a sitter for credible evidence of:

Abuse or reckless handling

Unauthorised substitution

Hiding an escape or injury

Falsifying a report

Customer-data misuse

Serious home-security breach

Repeated unexplained no-shows

7. Formalise the emergency protocol

Every sitter should know the escalation sequence before receiving bookings.

Recommended emergency sequence

Protect the pet from immediate danger where safely possible.

Call PetSaathi operations.

Contact the pet parent.

Contact the registered emergency person when required.

Contact the veterinarian or emergency clinic.

Follow professional veterinary guidance.

Arrange authorised transport where necessary.

Record times, actions, contacts and outcomes.

Open an incident investigation.

The sitter must report serious incidents immediately. They should never delay reporting because they fear losing their platform status.

8. Introduce booking-quality control

Before each sitter is assigned, the admin should verify:

Sitter is currently active

Sitter is approved for the selected service

Pet risk matches sitter capability

Availability is confirmed

Travel time is realistic

No schedule conflict exists

Customer instructions are complete

Emergency contacts are available

Sitter has accepted the payout

Customer has approved the sitter

After service, the admin should verify:

Start and end time

Required updates

Report completeness

Incident status

Customer feedback

Sitter score

Payout eligibility

9. Create the admin approval workflow

The sitter workflow should use controlled statuses.

Recommended status flow

Application Received→ Application Review→ Interview Shortlist→ Interview Completed→ Verification Pending→ Training Pending→ Practical Assessment→ Conditional Approval→ Probation→ Service Approved→ Active

Alternative statuses:

Incomplete

On hold

Rejected

Suspended

Inactive

Reverification required

Two-person approval

For higher-risk permissions such as boarding or complex-pet care, use two approvals where operationally possible:

Operations approval

Safety or senior-admin approval

10. Build database-ready sitter architecture

Even when Phase 3 uses spreadsheets or Airtable, the information should be structured like a future database.

Core tables

### Table 64

| Table | Purpose |
| --- | --- |
| Sitter Applications | Original applicant information |
| Sitters | Approved profile and status |
| Sitter Services | Services each sitter may provide |
| Verification Checks | Individual checks and outcomes |
| Training Modules | Training completion and scores |
| Practical Assessments | Service demonstrations |
| Availability | Dates, times and areas |
| Sitter Scores | Booking-level performance |
| Reviews | Customer feedback |
| Incidents | Safety and conduct cases |
| Badges | Awarded trust indicators |
| Boarding Homes | Separate property assessments |
| Status History | Every approval or suspension change |

Identity documents should not be placed inside a widely accessible general CRM. India’s DPDP Act recognises individuals’ rights concerning digital personal data, and the final DPDP Rules were published with a staged enforcement schedule. PetSaathi should therefore design clear notices, access controls, retention periods and secure document handling from the beginning.

Phase 3 duration

### Table 65

| Version | Duration | Suitable situation |
| --- | --- | --- |
| Fast setup | 15 days | Existing small sitter pool and one limited service |
| Standard system | 30 days | Recommended for walking, sitting and controlled boarding |
| Deep trust system | 45–60 days | Larger supply pool, boarding assessments and stronger verification |

Recommended duration: 30 days

A practical 30-day structure is:

Week 1 — Design the system

Finalise application

Define verification checks

Create training modules

Create badges and service permissions

Build admin workflow

Week 2 — Recruit and screen

Source applicants

Review applications

Conduct interviews

Verify information

Shortlist candidates

Week 3 — Train and assess

Deliver training

Conduct quizzes

Run practical assessments

Assess boarding homes

Classify service permissions

Week 4 — Probation and approval

Run supervised or low-risk bookings

Score sitter performance

Review incidents

Award final approvals

Build backup coverage

Phase 3 success targets explained

### Table 66

| Metric | Proposed target | Correct interpretation |
| --- | --- | --- |
| Sitter applications | 100+ | Total completed, non-duplicate applications |
| Shortlisted sitters | 40–50 | Applicants suitable for interviews and checks |
| Approved sitters | 20–30 | Sitters approved for at least one named service |
| Premium boarding sitters | 5–10 | Separately home-assessed boarding providers |
| Emergency backup sitters | 5+ | Available backups in active areas and time slots |
| Training completion | 80%+ | Cohort completion; each approved sitter completes all mandatory modules |
| Average sitter score | 80+/100 | Rolling performance with minimum booking sample |
| Customer rating | 4.5+/5 | Combined with sufficient review coverage |
| Sitter no-show rate | Proposed below 5–10% | Should be much closer to zero |
| Incident rate | Proposed below 3% | Must also be measured by severity |

Important correction: no-show target

A no-show rate of 5–10% is too high for a trust-based premium service.

At 100 bookings:

5% means five customers receive no sitter.

10% means ten customers receive no sitter.

Recommended target

Operational target: 0%

Maximum warning threshold: below 2%

Any unexplained no-show: mandatory investigation

Repeated no-show: suspension

Sitter cancellations and no-shows should be recorded separately.

Important correction: incident target

An incident rate below 3% cannot be the only safety measure.

One severe pet escape or serious injury may be more important than several minor reporting issues.

Track incidents by severity

### Table 67

| Level | Example |
| --- | --- |
| S0 | No issue |
| S1 | Minor operational deviation |
| S2 | Significant near miss |
| S3 | Serious injury, bite or temporary loss |
| S4 | Critical injury, prolonged loss or major security event |

Recommended safety gate

Unresolved S3/S4 incidents: 0

Incident reporting completion: 100%

Corrective actions completed before expansion

No repeated preventable incident

Recommended official Phase 3 gates

PetSaathi should move to Phase 4 only when:

At least 20 sitters are approved for specific services.

The primary micro-market has sufficient walking and sitting coverage.

Boarding providers pass separate home assessments.

Mandatory training completion is 100% for active sitters.

At least five reliable backup sitters cover important locations and time periods.

Average sitter performance is at least 80/100.

Customer rating is at least 4.5, with a meaningful number of reviews.

The no-show rate is close to zero.

No critical safety incident remains unresolved.

Every trust badge has a clear definition and supporting evidence.

Sitter data and documents are stored through controlled access.

The admin approval and suspension process works consistently.

Final corrected Phase 3 recommendation

PetSaathi should build:

A structured sitter trust system that separates application, identity checks, interviews, training, practical assessment, service-specific approval, probation and continuous performance monitoring.

It should not simply build:

A large database of people who claim to love pets.

Simple explanation for professor

“Phase 3 creates PetSaathi’s sitter trust system. During this phase, applicants are not approved only because they submit identity documents or say that they love animals. Each applicant passes through application review, identity checks, interviews, training, practical assessment and service-specific approval. Sitters are categorised according to the services and pet types they can safely handle. Customers see badges describing the exact checks completed. Every pet receives a risk assessment before matching, and every sitter receives a score after completed bookings. Boarding providers undergo an additional home assessment. The recommended duration is thirty days. PetSaathi should move to Phase 4 only after it has a reliable local sitter pool, strong training completion, high customer ratings, near-zero no-shows and no unresolved critical safety incidents.”

PetSaathi Phase 3 — Main Principle, Sitter Categories and Verification Workflow 🐾

Core Phase 3 principle

Pet enthusiasm is useful, but it is not sufficient evidence of sitter capability.

Wrong approach

“I like dogs, so I can become a sitter.”

This statement only shows personal interest in animals. It does not prove that the applicant can:

Arrive on time

Handle an unfamiliar pet

Use a leash or harness safely

Protect the customer’s home and personal information

Follow feeding and care instructions

Recognise warning signs

Report incidents honestly

Complete service updates and report cards

Respond correctly during an emergency

Correct approach

“I have completed the required identity checks, interview, training and practical assessment. I am approved only for defined services and pet categories. My availability, incidents and service performance are continuously monitored.”

This wording is stronger than saying only that a person is “verified.”

Identity verification, background checking, training and final profile approval are separate processes. Rover, for example, manually reviews sitter profiles and explains that a background check is only one part of its overall profile-review process. PetBacker also separates identification checks, testimonials and its sitter-introduction test.

Important correction to the proposed sentence

Your sentence says:

“I am verified, trained, location-matched, service-scoped, risk-rated and performance-tracked.”

A more precise version is:

“I have completed defined screening and training stages, I am approved for specific services, I am matched according to location and pet requirements, and my ongoing performance and incident history are monitored.”

“Risk-rated” should generally describe the booking or pet-service situation, not permanently label the sitter or pet as dangerous.

Why pet sitting is an operational service

Pet sitting is emotional because customers care deeply about their animals. However, it is also operationally demanding and safety-sensitive.

A sitter may be responsible for:

Entering a customer’s home

Handling keys or access codes

Walking an unfamiliar dog

Following food and water instructions

Managing interactions with other animals

Protecting the pet from escape

Sending accurate service updates

Escalating illness or injury

Securing the home after the visit

Protecting customer and pet information

Therefore, PetSaathi should approve sitters using evidence, not personality alone.

Part 1 — Sitter Categories

Sitters should be placed into categories according to their demonstrated abilities. A sitter may belong to more than one category, but each category requires separate approval.

1. Walker

Allowed services

30-minute dog walks

60-minute dog walks

Repeat walking plans

Toilet-relief walks

Minimum requirements

Your proposed requirement of “basic ID plus training” is not sufficient by itself.

The recommended minimum is:

Identity checked

Structured interview completed

Basic safety training passed

Practical leash and harness assessment passed

Approved dog-size category assigned

Active-area and travel limit recorded

Emergency-escalation process understood

Possible walking permissions

Small dogs

Medium dogs

Large dogs

Senior dogs

Multiple dogs

Reactive dogs

Approval for small dogs should not automatically permit the sitter to walk large or reactive dogs.

2. Home Sitter

Allowed services

Pet care in the owner’s home

Feeding and water visits

Companionship visits

Cat sitting

Extended daytime sitting

Travel-period home visits

Minimum requirements

Identity checked

Video interview completed

References reviewed where required

Home-access and privacy training completed

Feeding and care-instruction module passed

Home-security checklist understood

Practical sitting scenario passed

Emergency-escalation process understood

Home sitters require stronger privacy and conduct controls because they may enter a customer’s private residence.

3. Boarding Host

Allowed services

Daycare at the host’s home

Overnight boarding

Multi-day boarding within approved capacity

Minimum requirements

All relevant sitter checks completed

Address information reviewed

Home photographs collected

Video or physical home assessment completed

Doors, windows and balcony safety reviewed

Existing pets and family members recorded

Maximum boarding capacity assigned

Separation arrangements reviewed

Emergency transport confirmed

Nearby veterinary support identified

Society or landlord restrictions checked

Boarding-specific agreement signed

PetBacker uses a separate check-in form for boarding to document the animal’s condition and service details, illustrating why boarding requires additional controls beyond ordinary sitter onboarding.

Important rule

A person should not receive boarding approval only because they own a large house or love pets.

Boarding approval belongs to both:

The person

The property

4. Cat Sitter

Allowed services

Cat home visits

Feeding and water

Litter cleaning

Companionship

Multi-visit travel support

Minimum requirements

Cat-handling experience

Understanding of escape prevention

Knowledge of litter and feeding routines

Ability to identify stress-related behaviour

Home-access and privacy training

Cat-specific scenario assessment

A dog walker should not automatically become a cat sitter. Cat behaviour, movement and home-care risks are different.

5. Senior Pet Sitter

Allowed services

Senior-pet companionship

Slow or assisted walks

Feeding and water support

Mobility-sensitive sitting

Care according to written owner instructions

Minimum requirements

Demonstrated senior-pet experience

Advanced behaviour-observation training

Mobility and fall-risk awareness

Emergency escalation training

Ability to follow detailed written instructions

Additional customer briefing or meet-and-greet

Important limitation

The “Senior Pet Sitter” category should not imply that the sitter is a veterinary professional.

Medication or specialised medical tasks should be permitted only when they are appropriate, clearly authorised and within the sitter’s demonstrated training.

6. Emergency Backup Sitter

Allowed services

Last-minute replacement walks

Urgent home visits

Replacement for a cancelled sitter

Temporary continuity support

Minimum requirements

High punctuality and completion record

Strong communication history

Current availability

Ability to travel within the defined micro-market

Approval for the required service

Emergency protocol training

Low cancellation and no-show history

Important correction

“Emergency backup” means the sitter is available for urgent replacement care. It does not mean that the sitter is qualified to provide veterinary emergency treatment.

7. Premium Sitter

Allowed services

Only the services for which the sitter has separately qualified.

“Premium” should not mean automatic approval for every service.

Recommended requirements

At least ten successful completed bookings

Average customer rating above the defined threshold

High report-completion rate

High on-time-arrival rate

Low cancellation rate

No unresolved serious incident

Repeat-customer requests

Current training and verification records

Recommended customer-facing description

Proven PetSaathi sitter with ten or more successfully completed bookings and a strong performance record.

The profile should show both the rating and sample size—for example, 4.8/5 from 16 completed bookings.

PetBacker labels reviews as verified when they come from pet parents who hired the provider through the platform. PetSaathi can follow the same principle by connecting displayed reviews to completed booking IDs.

8. Partner Professional

Veterinarians, groomers and trainers should not be stored as ordinary sitter categories.

They should be maintained in a separate Partner Professionals system.

Partner types

Registered veterinarian

Grooming business

Dog trainer

Boarding facility

Pet-transport partner

Verification

For a veterinary professional, record:

Professional name

Clinic or organisation

Registration number

Relevant veterinary council

Service area

Operating hours

Emergency availability

The Veterinary Council of India maintains the Indian Veterinary Practitioners Register and the statutory registration framework for veterinary practitioners.

For groomers and trainers, verify the business identity, qualifications or experience claimed, references, service location and relevant insurance or licences where applicable.

Recommended Sitter Category Table

### Table 68

| Category | Approved services | Main approval requirement |
| --- | --- | --- |
| Walker | Dog walking | Identity, interview, training and practical walk assessment |
| Home Sitter | Care in customer’s home | Privacy, home-access and sitting assessment |
| Boarding Host | Care in sitter’s home | Person checks plus separate property assessment |
| Cat Sitter | Cat home visits | Cat-specific handling experience |
| Senior Pet Sitter | Senior-pet care | Advanced experience and escalation awareness |
| Emergency Backup | Urgent replacement care | Strong reliability and current local availability |
| Premium Sitter | Approved services only | Proven bookings, high performance and no unresolved serious incident |
| Partner Professional | Vet, grooming or training | External professional or business verification |

Part 2 — Verification Levels and Badges

Your L0–L8 structure is useful, but the levels should not be treated as a single ladder where every sitter must always reach L8.

For example:

A strong dog walker may reach Premium status without needing Home Verification.

Home Verification applies specifically to boarding.

Emergency readiness is an operational permission, not a higher version of boarding approval.

It is therefore better to use:

Application status

Verification badges

Service permissions

Performance tier

These should be stored separately.

L0 — Applicant

Requirement

Application submitted

User-visible?

No.

Meaning

The person has expressed interest but has not been screened.

Allowed activity

Complete missing fields

Attend initial call

Submit required information

An L0 applicant must not be shown to customers.

L1 — Phone and WhatsApp Confirmed

Requirement

Phone number confirmed

WhatsApp communication confirmed

Basic contact details reviewed

User-visible?

Normally no.

Important correction

“Phone verified” only proves control of the number at that time. It does not prove identity, trustworthiness or sitter capability.

L2 — Identity Checked

Requirement

Government-issued identity evidence reviewed

Name and photograph compared

Required selfie or live identity step completed

Verification date recorded

User-visible?

Yes, using the wording:

Identity Checked

Avoid displaying identity-document numbers or copies.

PetBacker’s identification process requires identity documents and a selfie with identification, and it instructs providers to use the dedicated verification flow rather than support chat for privacy.

L3 — Interview Completed

Requirement

Structured phone or video interview completed

Interview score recorded

Red flags recorded

Service interests discussed

User-visible?

Yes.

Recommended badge

Video Interview Completed

This badge proves that an interview occurred. It does not by itself prove that every answer was accurate.

L4 — Training Completed

Requirement

All mandatory modules for the assigned service completed

Safety quiz passed

Required practical assessment passed

User-visible?

Yes.

Recommended badge

Pet Safety Training Passed

A quiz-only badge should be distinguished from a practical assessment.

Rover similarly differentiates its background-check badge from a knowledge-quiz badge, demonstrating why each badge should represent a specific completed step.

L5 — Background Check Completed

Requirement

Defined background or police-verification process completed

Scope of the check recorded

Provider or authority recorded

Date recorded

Result reviewed by an authorised administrator

Recheck or expiry date set where necessary

User-visible?

Yes, but only when genuinely completed.

Recommended wording

Background Check Completed — [Month/Year]

or:

Police Verification Document Reviewed — [Month/Year]

Important warning

Do not treat:

ID verification

Address proof

A reference call

A certificate uploaded by the sitter

as automatically equivalent to a comprehensive criminal-background check.

Background checks may be jurisdiction-specific and may not be available or identical everywhere. Rover also states that passing a background check is only one stage of its wider profile-review process.

L6 — Boarding Home Assessed

Requirement

Boarding address confirmed

Photographs reviewed

Video or physical inspection completed

Home-safety checklist passed

Existing pets and residents recorded

Capacity assigned

Emergency transport confirmed

Local permission issues reviewed

User-visible?

Yes, only on boarding profiles.

Recommended wording

Boarding Home Assessed

“Home Verified” may be interpreted too broadly. “Assessed” more accurately indicates that PetSaathi reviewed the property against a defined checklist.

The badge should have a reassessment date, especially after:

Change of address

New resident or pet

Property modification

Serious boarding incident

Long period of inactivity

L7 — Proven or Premium Sitter

Requirement

A proposed minimum is:

Ten or more completed bookings

Average rating of at least 4.5

Strong on-time rate

High report completion

Controlled cancellation rate

No unresolved serious incident

User-visible?

Yes.

Recommended badge

Proven PetSaathi Sitter

The threshold of ten bookings is an internal PetSaathi rule, not an industry standard.

L8 — Emergency Protocol Trained / Backup Ready

Recommended correction

Do not use one badge called Emergency Ready. Customers may interpret it as medical or veterinary qualification.

Separate it into two operational badges:

Emergency Protocol Trained

The sitter completed:

Incident-reporting training

Escape procedure

Injury escalation

Customer-contact escalation

Veterinary-referral procedure

Backup Availability Approved

The sitter:

Agreed to urgent replacement rules

Maintains current availability

Has a strong reliability history

Covers a defined area and time window

User-visible?

“Emergency Protocol Trained” may be visible with a clear explanation.

“Backup Availability Approved” may remain internal because availability changes frequently.

Recommended Public Badge Example

A sitter profile may display:

✅ Identity Checked✅ Video Interview Completed✅ Pet Safety Training Passed✅ Approved for Medium-Dog Walking✅ Boarding Home Assessed — where applicable⭐ 4.8/5 from 16 completed PetSaathi bookings

This is more trustworthy than displaying:

✅ Fully Verified

Every badge should be clickable or accompanied by a short explanation of what it means.

PetBacker also uses individual trust points and badges representing separate verification activities rather than one universal proof of safety.

Part 3 — Corrected Phase 3 Workflow

1. Sitter Application

The applicant submits:

Identity details

Contact information

Location

Experience

Requested services

Availability

Expected earnings

References

Verification readiness

Boarding details where relevant

Status: Application Received

2. Initial Screening

The admin checks:

Completeness

Service-area suitability

Minimum age requirement

Relevant experience

Availability

Obvious inconsistencies

Basic communication quality

Possible outcomes:

Interview Shortlist

Information Required

Hold

Area Mismatch

Rejected

3. Phone Confirmation

The admin confirms:

Applicant identity information

Availability

Service interest

Area

Earnings expectations

Willingness to follow verification and training

Status: Phone Screening Completed

4. Structured Video Interview

The interview should examine:

Motivation

Real experience

Safety judgement

Reliability

Customer privacy

Emergency scenarios

Communication

Service-specific capability

PetBacker also recommends speaking directly with a sitter to understand experience, personality and suitability before hiring.

5. Document Verification

Review the documents required for the applicable checks.

Possible records include:

Identity check

Address-information review

Reference checks

Background-check result

Professional qualification

Boarding-property information

Identity documents should be stored in a restricted document system, not in an open operations spreadsheet.

India’s current digital-personal-data framework includes the DPDP Act and the Digital Personal Data Protection Rules, 2025. PetSaathi should use clear collection notices, restricted access, retention controls and documented purposes when processing sitter documents and personal data.

6. Service Eligibility Decision

Before training, determine which services the applicant may pursue.

Example:

Eligible for small- and medium-dog walking training.Cat sitting requires additional assessment.Boarding is not currently eligible.

This prevents applicants from training for services for which they have an obvious location, property or experience mismatch.

7. Training Modules

Assign only the modules relevant to the requested service.

Track:

Module ID

Completion date

Quiz score

Trainer

Attempts

Expiry or refresher date

Mandatory modules should be completed fully before service approval.

8. Safety Quiz

The quiz should test judgement using realistic scenarios.

Examples include:

Loose harness

Escaped pet

Bite incident

Pet refusing food

Customer unreachable

Sitter delay

Unapproved medication request

Unsafe weather

A sitter should not pass merely by memorising definitions. Scenario-based questions are more useful.

9. Practical Assessment

Examples include:

Harness and leash check

Safe door exit

Controlled walking

Customer-update simulation

Report-card completion

Home-entry and departure checklist

Boarding-home walkthrough

Status: Practical Assessment Passed or Failed

10. Trial or Probation Booking

The sitter receives a low-risk booking or supervised service appropriate to their approved category.

Track:

Punctuality

Instruction compliance

Pet handling

Communication

Report quality

Customer feedback

Incident status

11. Performance Score

The probation service receives the standard sitter score.

A passing score should not override a critical safety failure.

12. Final Approval

The administrator assigns:

Active status

Approved service categories

Approved pet-size categories

Service areas

Maximum booking capacity

Public badges

Probation or full approval status

Higher-risk permissions such as boarding should ideally require a second administrator or safety reviewer.

13. Ongoing Monitoring

Approval is not permanent.

Monitor:

Ratings

Late arrivals

Cancellations

No-shows

Report completion

Customer complaints

Incidents

Expired documents

Training refreshers

Boarding-property changes

Possible ongoing statuses include:

Active

Coaching Required

Probation

Temporarily Paused

Suspended

Reverification Required

Inactive

Future Admin Dashboard Workflow

The Phase 3 system should display one sitter pipeline:

Application Received→ Screening→ Interview→ Verification→ Training→ Assessment→ Probation→ Approved→ Active Monitoring

For each applicant, the administrator should see:

Current stage

Missing requirements

Verification evidence

Training progress

Service eligibility

Risk or red-flag notes

Interview score

Practical-assessment result

Approved badges

Performance history

Incident history

Next action

Responsible administrator

Final Recommended Architecture

Do not store everything in one sitter record.

Use separate data structures for:

Sitter profile

Application

Identity checks

Background checks

References

Training modules

Quiz attempts

Practical assessments

Service permissions

Boarding-home assessments

Public badges

Availability

Booking scores

Reviews

Incidents

Status history

This separation makes the future platform more auditable and prevents a generic “verified” field from hiding important differences.

Final Corrected Principle

PetSaathi does not approve people merely because they love animals. Every sitter passes through structured screening, evidence-based checks, service-specific training, practical assessment and probation. Sitters are approved only for defined services and pet categories. Public badges describe the exact checks completed, while ratings, punctuality, cancellations, reports and incidents are continuously monitored.

Simple explanation for professor

“Phase 3 creates PetSaathi’s sitter trust engine. An applicant is not approved only because they like pets. The person must complete an application, initial screening, phone confirmation, structured video interview, document checks, service-specific training, a safety quiz and a practical assessment. After a probation booking, the sitter receives a performance score and may be approved for selected services such as walking, home sitting or controlled boarding. Each public badge explains a specific completed check, such as identity verification, interview completion or safety training. Boarding hosts undergo a separate property assessment. Premium status is earned through successful bookings, strong ratings and reliable performance. Sitters remain under continuous monitoring after approval, and serious safety incidents override any numerical score.”

PetSaathi Phase 3 — Sitter Application and Screening System 🐾

Main purpose

The sitter application form should help PetSaathi determine whether an applicant is suitable for further screening. It should not automatically approve the person as a sitter.

The complete process should remain:

Application → Initial screening → Phone call → Video interview → Document checks → Training → Practical assessment → Probation booking → Service-specific approval

Established pet-care platforms also separate application, identity checks, background checks and final profile approval. Rover manually reviews sitter profiles and treats background checking as only one component of the approval process. PetBacker uses a dedicated identity-verification flow and specifically advises applicants not to send identification documents through ordinary support chat.

1. Recommended Sitter Application Form

The form should be divided into sections so applicants can understand why each category of information is required.

Section A — Personal and Contact Information

### Table 69

| Field | Recommended type | Explanation |
| --- | --- | --- |
| Full legal name | Text | This is required to match the applicant with identity records later. |
| Preferred name | Text, optional | This is the name PetSaathi may use in normal communication and on the public profile. |
| Phone number | Phone | This is used for screening calls and urgent operational communication. |
| WhatsApp number | Phone | This is used for booking instructions, availability and service updates. |
| Email address | Email | This is useful for training records, agreements and formal communication. |
| City | Dropdown | This determines whether the applicant is located in an active PetSaathi city. |
| Area or locality | Text/dropdown | This supports hyperlocal matching and travel-time calculations. |
| PIN code | Text with six-digit validation | This helps standardise local-area and service-radius information. |
| Age eligibility | “Are you 18 or older?” | This is clearer and less intrusive than collecting an exact age at the first stage. |
| Gender | Optional dropdown | This may support an explicit customer comfort request, particularly for home visits, but it should not be used as a general quality score. Include “Prefer not to say.” |
| Current occupation or primary commitment | Text | This helps understand the applicant’s schedule, but occupation should not be treated as proof of reliability. |
| Preferred language | Multi-select | This helps match sitters with customers who prefer communication in a particular language. |

Age recommendation

PetSaathi should normally accept only applicants aged 18 or above, unless Indian legal advice supports a different model.

The DPDP Act defines a child as a person below eighteen. The 2025 Rules also define an adult as someone who has completed eighteen years, while several substantive rules have phased commencement dates. An 18+ sitter policy therefore avoids additional child-consent and contracting complexity during the pilot.

Section B — Location and Availability

### Table 70

| Field | Recommended type | Explanation |
| --- | --- | --- |
| Primary service area | Dropdown | This identifies the applicant’s main working locality. |
| Secondary service areas | Multi-select | This records other nearby areas the sitter can realistically serve. |
| Maximum travel distance | Dropdown | This prevents assignments that create excessive delays or travel costs. |
| Mode of transport | Multi-select | This helps estimate travel reliability and time between bookings. |
| Available days | Multi-select | The applicant should select exact weekdays rather than writing “flexible.” |
| Available time slots | Morning/afternoon/evening/night | This helps PetSaathi compare supply with actual customer demand. |
| Weekend availability | Yes/no/specific slots | Weekend demand may differ from weekday demand. |
| Overnight availability | Yes/no | This should be collected only from sitting or boarding applicants. |
| Maximum bookings per day | Number | This prevents overbooking and sitter fatigue. |
| Repeat-booking availability | Yes/no | This shows whether the sitter can support regular walking or sitting plans. |

Important operational rule

The applicant’s availability should be treated as provisional. PetSaathi must still obtain a separate acceptance for every booking.

Section C — Pet-Care Experience

### Table 71

| Field | Recommended type | Explanation |
| --- | --- | --- |
| Years of pet-care experience | Dropdown | This gives a basic experience indicator. |
| Description of experience | Paragraph | The applicant should describe specific pets, duties and time periods. |
| Own a pet? | Yes/no | This is an experience signal, but owning a pet does not automatically qualify someone as a sitter. |
| Pet types handled | Dog/cat/bird/other | This helps assign relevant service categories. |
| Dog sizes handled | Small/medium/large/giant | This is more useful than one general “large dog” question. |
| Experience caring for another person’s pet | Yes/no with details | Caring for one’s own pet and caring for a customer’s pet involve different responsibilities. |
| Anxious-pet experience | Yes/no with example | Anxiety and aggression should be assessed separately. |
| Reactive or bite-risk experience | Yes/no with example | This identifies applicants who may be considered for higher-risk pets after additional assessment. |
| Senior-pet experience | Yes/no with details | This helps identify candidates for older or mobility-limited animals. |
| Medication experience | Yes/no with details | This should only record experience; it does not provide medical authorisation. |
| References available | Yes/no | References may help verify relevant experience and reliability. |

Better experience question

Instead of asking only:

“Tell us about your pet experience.”

Use:

“Describe one pet you cared for, who owned the pet, how long you provided care, what duties you performed and any difficult situation you handled.”

This encourages evidence-based answers rather than general statements such as “I love animals.”

Section D — Service Interests

### Table 72

| Field | Recommended type | Explanation |
| --- | --- | --- |
| Services requested | Multi-select | The applicant may select walking, home sitting, cat visits, extended sitting or boarding. |
| Preferred pet types | Multi-select | This helps limit assignments to appropriate animals. |
| Comfortable dog sizes | Multi-select | Applicants should be approved only for sizes they can demonstrate they can manage. |
| Comfortable with anxious pets | Yes/no/with conditions | An anxious pet does not necessarily require the same skills as an aggressive pet. |
| Comfortable with reactive pets | Yes/no/experienced only | A “yes” answer must still be tested through interview and practical assessment. |
| Expected payout | Service-specific ranges | Ask separately for a 30-minute walk, one-hour sitting visit and overnight boarding. |
| Willing to accept probation bookings | Yes/no | This shows whether the applicant accepts closer monitoring during the initial period. |

Important rule

Selecting a service means:

“I want to be assessed for this service.”

It does not mean:

“I am approved to provide this service.”

Section E — Verification and Interview Readiness

### Table 73

| Field | Recommended type | Explanation |
| --- | --- | --- |
| Can provide identity proof? | Yes/no | This confirms readiness for identity checking. |
| Can provide address information? | Yes/no | This may be required for home access or boarding checks. |
| Can provide references? | Yes/no | This supports experience and reliability checks. |
| Can attend a video interview? | Yes/no | A structured interview is part of the screening process. |
| Can attend practical assessment? | Yes/no | Walking and sitting approval should include a practical evaluation. |
| Can complete safety training? | Yes/no | Training is mandatory before service approval. |
| Can share an introduction video? | Yes/no, optional | This may improve profile presentation but should not be a mandatory trust test. |
| Willing to complete applicable background checks? | Yes/no | The form should not describe an identity check as a complete background check. |

Identity-document handling

The initial public application should normally ask whether the applicant can provide documents.

Actual copies should be collected later from shortlisted candidates through a restricted verification process. PetBacker likewise directs providers to submit identification through its dedicated verification mechanism rather than ordinary chat.

Section F — Boarding Questions

These questions should appear only when the applicant selects home boarding.

### Table 74

| Field | Recommended type | Explanation |
| --- | --- | --- |
| Own or rent the property? | Dropdown | This helps identify permission requirements. |
| Landlord or society permits boarding? | Yes/no/unknown | Boarding may be restricted by the property or society. |
| Type of home | Flat/house/other | This supports the property-safety assessment. |
| Existing pets | Yes/no with details | Existing animals may affect boarding compatibility. |
| Children or other residents | Yes/no with details | All household members affect the boarding environment. |
| Maximum pets requested | Number | This will later be reviewed and may be reduced. |
| Secure doors and windows | Yes/no | This is an initial declaration, not proof. |
| Balcony or terrace present | Yes/no | Additional safety checks may be needed. |
| Emergency transport available | Yes/no | This is important during urgent veterinary situations. |
| Can provide home photographs? | Yes/no | Photographs support screening but are not enough for approval. |
| Can attend a video home assessment? | Yes/no | A dedicated walkthrough is stronger than casual photographs. |
| Willing to accept a physical inspection? | Yes/no where applicable | Higher-risk boarding approval may require an on-site review. |

Important correction

An applicant who refuses home photographs should be rejected only for boarding eligibility, not automatically rejected from dog walking or home sitting.

A boarding property should be assessed separately from the sitter’s normal video interview.

Section G — Emergency Contact

Use separate fields:

Emergency-contact name

Relationship to applicant

Phone number

Alternative number

Confirmation that the contact may be approached during an emergency

To minimise unnecessary data collection, PetSaathi may collect the full emergency-contact details after the applicant reaches the shortlist rather than during the first public enquiry form.

Section H — Declarations and Consent

One general agreement checkbox is not sufficient.

Use separate checkboxes for:

Accuracy declaration“I confirm that the information submitted is accurate.”

Verification acknowledgement“I understand that PetSaathi may verify the information and documents I provide.”

Operational terms“I agree to follow PetSaathi’s safety, privacy, reporting and booking rules if approved.”

Privacy notice acknowledgement“I have read how my personal information will be collected, used, stored and shared.”

Profile-publication consent“I permit approved profile information to be shown to customers.”This should apply only after approval.

Marketing-media consent — optional“I permit my introduction video or images to be used for marketing.”This should not be mandatory for becoming a sitter.

The DPDP Act requires consent to be specific, informed, unambiguous and based on a clear affirmative action. It also requires the person to be told what data is collected and why. Therefore, identity verification, operational processing and marketing consent should not be combined into one blanket checkbox.

2. Stage 1 — Application-Form Screening

The first screening stage should separate unsuitable applications from applications that merely need clarification.

Recommended decision categories

### Table 75

| Decision | Meaning |
| --- | --- |
| Proceed to phone screening | Basic requirements are met |
| Information required | Important information is missing |
| Service restricted | Suitable for some services but not others |
| Area waitlist | Applicant lives outside the current micro-market |
| Hold | Good profile, but no current availability or demand |
| Reject | Serious mismatch, dishonesty or safety concern |

Reason 1: Location is too far from target areas

Correct action

Mark the applicant as:

Area mismatch or future-area waitlist

Do not describe them as a poor sitter merely because PetSaathi does not currently operate near them.

Reason 2: Pet experience is unclear

Correct action

Request one clarification or discuss the experience during the phone call.

Reject only when:

The applicant cannot provide any relevant example.

Their claims are inconsistent.

They misrepresent their experience.

Reason 3: No useful availability

Correct action

Place the applicant on hold when their schedule does not match current demand.

For example, a person available only at midday may still become useful later, even if PetSaathi currently needs morning walkers.

Reason 4: Unwilling to verify identity

Correct action

Do not approve the applicant for customer bookings.

Identity-check readiness is a basic trust requirement. However, PetSaathi should first explain:

What will be collected

Why it is required

Who can access it

How it will be stored

Reason 5: Unrealistic payout expectation

Correct action

Mark this as:

Payout mismatch

It does not necessarily indicate a poor-quality applicant.

The team may:

Explain the current payout model.

Discuss different services.

Place the applicant on hold.

Reject only when no workable arrangement exists.

Reason 6: Poor communication

“Poor communication” must be defined objectively.

Possible indicators include:

Repeatedly ignoring clear questions

Providing contradictory information

Using abusive language

Missing scheduled calls without notice

Refusing to follow basic instructions

Accent, grammar quality or speaking style should not be treated as proof of poor reliability.

Reason 7: Boarding applicant refuses property checks

Correct action

Mark:

Boarding not eligible

The applicant may still be assessed for walking or home sitting.

Reason 8: Applicant rejects basic safety rules

Pause or reject when the applicant states that they would:

Walk dogs off-leash without approval

Use harsh physical punishment

Hide an incident

Send another person for the booking

Feed pets without permission

Ignore owner instructions

Share customer information publicly

These are genuine trust and safety concerns.

3. Stage 2 — Phone Screening

The phone call should normally last approximately 10–15 minutes.

Its purpose is to confirm the application, evaluate basic communication and decide whether the person should receive a video interview.

PetBacker advises customers to talk with sitters to understand their experience, knowledge and suitability before hiring them.

Question 1: Why do you want to become a pet sitter?

What this tests

Motivation

Expectations

Attitude toward responsibility

Understanding of the work

Positive indicators

The applicant discusses:

Caring responsibly for animals

Flexible but reliable work

Relevant experience

Learning and training

Clear availability

Warning indicators

“This looks like easy money.”

“I can bring my friend when I am busy.”

“I do not need training because I already love dogs.”

Question 2: What pets have you handled previously?

Ask for:

Pet type

Pet size

Pet owner

Length of care

Duties performed

Difficult situations

Specific examples are more useful than general statements.

Question 3: Have you handled large dogs?

Follow up with:

Which breeds or approximate weights?

Who owned the dog?

How often did you handle it?

What equipment did you use?

What would you do if the dog pulled strongly?

A “yes” answer should not create large-dog approval without a practical assessment.

Question 4: Have you handled anxious or reactive pets?

Separate the concepts:

Anxiety

Fear

Leash reactivity

Resource guarding

Bite history

Ask the applicant to explain how they maintained distance, avoided force and followed owner guidance.

Question 5: What would you do if a dog pulled strongly on the leash?

A suitable answer should include:

Maintaining control without violent correction

Avoiding unsafe roads or crowded routes

Following owner instructions

Pausing when necessary

Contacting operations when the sitter cannot manage the dog safely

Question 6: What would you do if a pet vomited?

A suitable response should include:

Keep the pet safe.

Observe and record what happened.

Contact PetSaathi and the customer.

Follow the agreed emergency process.

Contact veterinary support when symptoms are serious or continuing.

Avoid diagnosing the condition or giving unapproved medication.

Question 7: Are you comfortable sending updates and photographs?

Confirm whether the applicant can:

Send arrival confirmation

Send agreed private updates

Complete a report card

Avoid exposing customer information

Keep service media out of public channels

Question 8: Can you be punctual for morning and evening bookings?

Ask:

How will you travel?

What travel buffer will you keep?

What other commitments do you have?

What will you do if delayed?

How early will you inform operations?

Question 9: Are you available for repeat bookings?

This identifies candidates who may support:

Daily walking

Weekly sitting

Same-sitter continuity

Monthly service packages

Question 10: Can you follow owner instructions strictly?

The correct answer should recognise one exception:

A sitter should follow lawful and safe instructions but should refuse or escalate an instruction that creates a serious pet, human or property risk.

For example, a sitter should not follow an instruction to walk a high-risk dog off-leash in an unsecured area.

Additional mandatory phone questions

Add:

What would you do if a pet escaped?

What would you do if you could not attend a confirmed service?

Would you ever send another person in your place?

How would you protect a customer’s key or access code?

What would you do if the customer asked you to hide a service problem?

4. Stage 3 — Structured Video Interview

The video interview should usually last 20–30 minutes.

It should use consistent questions and a written scorecard.

Communication

Observe whether the applicant:

Answers questions clearly

Listens before responding

Communicates respectfully

Admits when they do not know something

Can explain an incident calmly

Do not score a candidate mainly on accent, appearance or advanced English ability.

Confidence

Confidence should mean:

Calm decision-making

Realistic understanding of ability

Willingness to ask for help

Ability to recognise personal limits

Overconfidence may be a warning sign.

For example:

“I can handle every dog.”

is less trustworthy than:

“I am comfortable with small and medium dogs, but I would need additional assessment before handling a large reactive dog.”

Safety awareness

Use scenarios involving:

Loose harness

Dog escape

Bite incident

Vomiting or breathing difficulty

Customer not answering

Unsafe weather

Unapproved food

Sitter running late

The applicant should prioritise prevention, immediate reporting and escalation.

Availability

The schedule should be realistic.

Confirm:

Work or college hours

Travel requirements

Morning and evening availability

Weekend commitments

Maximum bookings per day

Recurring blocked periods

Cleanliness and boarding

Do not judge the suitability of a boarding home from the background visible during an ordinary interview.

Instead, create a separate, consent-based boarding-home assessment covering:

Floors and sleeping areas

Doors and windows

Balcony safety

Existing pets

Food storage

Waste management

Separation space

Emergency exits

Maximum capacity

The video interview assesses the applicant. The boarding assessment evaluates the property.

Professionalism

Observe whether the applicant:

Attends on time

Has reviewed the process

Provides consistent information

Understands customer privacy

Accepts service reporting

Responds appropriately to corrections

Understands that approval is service-specific

Trust

Avoid scoring “trust” only by intuition or whether the person “feels reliable.”

Use evidence such as:

Consistency between the form and interview

Specific experience examples

Willingness to complete checks

Honest acknowledgement of limitations

Appropriate safety responses

Punctual interview attendance

Reference availability

Absence of serious contradictions

5. Recommended Video-Interview Scorecard

### Table 76

| Criterion | Maximum points |
| --- | --- |
| Relevant pet-care experience | 15 |
| Safety judgement | 25 |
| Reliability and availability | 15 |
| Communication | 15 |
| Service-specific suitability | 10 |
| Privacy and professionalism | 10 |
| Verification and training readiness | 10 |
| Total | 100 |

Suggested decision thresholds

### Table 77

| Score | Decision |
| --- | --- |
| 75–100 | Proceed to verification and training |
| 60–74 | Conditional progress or additional assessment |
| 40–59 | Hold or restrict service eligibility |
| Below 40 | Do not proceed currently |

A critical safety or integrity concern should override the numerical score.

6. Final Screening Outcomes

After the video interview, assign one of these results:

Proceed to identity verification

Proceed to walking training

Proceed to sitting training

Boarding-home assessment required

Additional reference required

Practical assessment required

Limited-service candidate

Hold for future area or schedule

Rejected

Investigation required

A rejected or restricted candidate should have a short, factual internal reason.

Examples:

Service-area mismatch

Availability mismatch

Experience not demonstrated

Unsafe scenario response

Information inconsistency

Verification declined

Boarding property unsuitable

Professional-conduct concern

Phase 3 Application Success Checklist

The application and screening system is ready when:

The form separates personal, experience, service and verification information.

Applicants must normally be at least eighteen.

Gender is optional and not used as a general quality score.

Availability includes exact days, times and travel limits.

Anxious and aggressive-pet experience are recorded separately.

Payout expectations are collected per service.

Identity documents are not uploaded through an open public form or ordinary WhatsApp chat.

Boarding questions appear only for boarding applicants.

Home photographs are followed by a proper property assessment.

Privacy, operational and marketing consent are separated.

Stage 1 decisions distinguish rejection from hold or service restriction.

Phone and video questions use consistent scoring.

Safety concerns override numerical results.

Final approval remains dependent on training and practical assessment.

Simple explanation for professor

“The PetSaathi sitter application form collects the applicant’s identity, contact details, location, availability, pet-care experience, requested services and willingness to complete verification and training. The form itself does not approve the applicant. During Stage 1, I review the application for service-area fit, experience, availability, communication and safety readiness. During Stage 2, I conduct a phone call to confirm motivation, pet-handling experience, punctuality and basic emergency judgement. During Stage 3, I conduct a structured video interview and score the applicant on experience, safety, reliability, communication, professionalism and verification readiness. Boarding candidates complete a separate home assessment. Applicants who pass these stages proceed to document verification, training and practical assessment before receiving service-specific approval.”

PetSaathi Phase 3 — Boarding Verification, Pet-Risk Classification and Matching Logic 🐾

Core operating principle

Boarding should remain a controlled service, not an open marketplace category.

A sitter should become a boarding host only after PetSaathi verifies both:

The caregiver’s suitability, and

The property’s suitability for the specific pet.

A trustworthy person can still have an unsuitable boarding environment. Similarly, a well-maintained property does not prove that the host can safely manage animals.

There is also an important legal limitation: boarding rules can differ by state and city. Tamil Nadu’s February 2026 policy requires boarding facilities to register, renew registration every two years and operate as commercial establishments; it expressly states that home boarding is not allowed. Therefore, PetSaathi must not use the home-host boarding model in Tamil Nadu under that policy. The policy also requires pet and owner records, current vaccination information and CCTV coverage with footage retention requirements. These rules are specific to Tamil Nadu and should not automatically be applied to every Indian state.

Part 1 — Boarding Host Verification

Correct approval sequence

A boarding applicant should move through the following stages:

Sitter screening→ Identity and interview checks→ Boarding eligibility review→ Property photographs→ Live video walkthrough→ Permission and household review→ Safety inspection→ Emergency-plan review→ Pet-specific compatibility test→ Controlled trial→ Final boarding approval

Boarding approval should belong to a particular host at a particular address. If the host changes address, the property approval should expire and a new assessment should be completed.

Boarding requirements explained

### Table 78

| Requirement | Status | Proper interpretation |
| --- | --- | --- |
| Identity checked | Mandatory | Confirm the host’s identity through an approved process |
| Video interview | Mandatory | Evaluate experience, judgement and communication |
| Home photographs | Mandatory | Initial evidence of the property layout |
| Live video walkthrough | Mandatory | Verify that photographs represent the current property |
| Pet-safe area | Mandatory | Confirm suitable sleeping, feeding and activity spaces |
| Secure balconies, gates and windows | Mandatory | Prevent escape, falls and unauthorised access |
| Household consent | Mandatory | Every adult resident should understand and accept boarding activity |
| Existing pets disclosed | Mandatory | Required for compatibility and separation planning |
| Vaccination policy accepted | Mandatory | Host must enforce the veterinarian-approved health policy |
| Emergency veterinarian identified | Mandatory | Record the clinic, contact details, hours and route |
| Trial assessment completed | Mandatory | Test the host under controlled, low-risk conditions |
| Local legal permission checked | Mandatory | Confirm state, municipal, landlord and society restrictions |
| Maximum capacity assigned | Mandatory | Prevent overcrowding and unsafe simultaneous bookings |
| Emergency transport available | Mandatory | Establish how an animal will reach veterinary care |
| Incident and evacuation plan | Mandatory | Cover fire, flood, escape, bite and medical emergencies |

1. Identity checked

The host’s government-issued identity evidence should be reviewed through a restricted process.

Record:

Verification type

Date completed

Person who reviewed it

Result

Reverification date, where appropriate

Do not expose complete identity documents to customers or ordinary operations staff.

The customer-facing badge should say “Identity Checked”, not “completely verified.”

2. Video interview completed

The interview should assess:

Previous boarding or pet-care experience

Understanding of dog and cat behaviour

Daily supervision plan

Emergency judgement

Communication ability

Willingness to follow capacity limits

Attitude toward customer instructions

Incident-reporting honesty

Ask scenario questions such as:

What would you do if two boarded dogs became incompatible?

What would you do if a pet stopped eating?

What would you do if an animal escaped?

How long might a boarded pet remain alone?

Who cares for the animals when you leave the property?

What happens if you become unavailable?

A positive personality should not replace evidence of safe judgement.

3. Home photographs collected

Request photographs of:

Entrance and exit

Doors and gates

Windows

Balcony or terrace

Sleeping area

Feeding area

Activity area

Kitchen and food-storage area

Existing-pet area

Separation or isolation area

Dangerous objects or chemicals

Building exterior where relevant

Photographs are preliminary evidence. They can be old, incomplete or taken from favourable angles, so they cannot replace the live walkthrough.

Because identity documents and interior home photographs are personal data, PetSaathi should explain why they are collected, restrict access and retain them only as long as needed for the defined purpose. India’s DPDP framework recognises both individuals’ data-protection rights and lawful processing needs.

4. Live home walkthrough completed

The host should conduct a real-time video walkthrough.

The assessor should ask the host to show:

The complete route from the entrance to the pet area

Door and gate locks

Balcony railings and gaps

Window screens

Electrical cables

Cleaning chemicals

Plants that may be dangerous

Waste-disposal arrangements

Sleeping and resting areas

Separation arrangements

Existing pets

Water availability

Emergency exits

A home should be reassessed after:

A change of address

Major renovation

A new household member

A new resident animal

A serious boarding incident

A long period of inactivity

Basic pet-proofing should include securing windows and screens, covering hazardous gaps, controlling electrical cords and removing toxic plants or poison sources.

5. Pet-safe space available

A boarding property should contain separate functional areas for:

Rest and sleep

Feeding

Drinking water

Toilet or waste management

Play or exercise

Temporary separation

Safe handover

The environment should have suitable:

Ventilation

Lighting

Temperature

Flooring

Cleaning arrangements

Noise control

Tamil Nadu’s current policy illustrates how detailed formal boarding requirements can become: it includes standards relating to accommodation, exercise space, temperature control, lighting, ventilation, cleanliness, fencing, double-door entry and flooring. Those exact rules apply in Tamil Nadu, but they provide a useful warning that a few home photographs are not a sufficient boarding assessment.

6. No dangerous balcony, gate or window gaps

The assessor should check whether:

A small dog or cat could pass through a railing gap.

The main door opens directly onto a road.

A pet could escape when another resident enters.

Window screens can be pushed out.

A balcony door can be opened accidentally.

Shared terraces are accessible.

Society gates remain open.

Delivery staff regularly enter the home.

Where the escape risk is material, require:

Secondary barriers

Safety mesh

Double-door procedures

Baby gates

Leash-before-door-opening rules

Separate handover zones

A property with an unresolved escape or fall risk should not receive boarding approval.

7. Household and property permission

“Family consent” should be expanded into a formal household declaration.

Confirm:

Every adult resident knows boarding will occur.

Children’s contact with guest pets will be supervised.

Domestic workers understand door and feeding rules.

The landlord permits the activity, where applicable.

The housing society or RWA does not prohibit the operation.

No resident has an undisclosed allergy or serious objection.

Someone is responsible when the main host is unavailable.

A verbal statement from only the applicant is weaker than a signed household declaration.

8. Existing pets disclosed

Record for every resident animal:

Species and breed

Age and sex

Sterilisation status

Vaccination status

Behaviour with unfamiliar animals

Resource guarding

Bite or conflict history

Feeding arrangement

Sleeping arrangement

Ability to remain separated

Do not introduce guest pets directly without a compatibility plan.

A host who fails to disclose an existing animal should be paused because this affects both safety and customer consent.

9. Vaccination and health policy accepted

PetSaathi should establish its boarding health policy with a registered veterinarian rather than inventing one general vaccine list.

The policy should define:

Required vaccinations

Acceptable proof

Validity periods

Parasite-control expectations

Current-illness exclusion

Recent infectious-disease exposure

Isolation procedures

Cleaning and disinfection rules

Vaccination is a central preventive-health measure, and higher-density environments such as shelters, foster settings and boarding facilities require stronger infectious-disease controls.

A customer who lacks current vaccination information should not automatically be rejected from walking or home sitting, but the pet should not enter multi-animal boarding until the applicable boarding-health policy is satisfied.

10. Emergency veterinarian and transport identified

Record:

Primary veterinarian

Backup emergency clinic

Telephone numbers

Operating hours

Distance

Expected travel time

Transport method

Who can authorise treatment

Customer spending instructions

The phrase “nearby veterinarian” should not mean only a pin saved on a map. PetSaathi should confirm that the clinic is active, understands the type of referral and can be contacted.

Where a veterinary partnership is claimed, check the practitioner’s registration through the relevant State Veterinary Council or the Veterinary Council of India register.

11. Controlled trial completed

The host should complete a low-risk trial before receiving ordinary boarding bookings.

The trial may involve:

A meet-and-greet

A short daytime stay

One compatible pet

No overlapping guest animals

Increased admin monitoring

Scheduled updates

A post-trial property check

Customer and host feedback

The trial should evaluate:

Handover

Pet settling

Supervision

Feeding

Resident-pet compatibility

Updates

Home security

Incident reporting

Pickup

Passing one trial should not remove future monitoring.

Part 2 — Improved Home Verification Checklist

### Table 79

| Area | What to inspect | Approval condition |
| --- | --- | --- |
| Entrance | Main door, gate, locks and handover process | Secure and controlled |
| Secondary barrier | Lobby, baby gate or double-door arrangement | Required where escape risk exists |
| Balcony/terrace | Railings, gaps, doors and access | No unresolved fall or escape risk |
| Windows | Screens, locks and openings | Secure for the smallest accepted pet |
| Flooring | Slipping, sharp surfaces and cleaning | Safe, durable and hygienic |
| Rest area | Quiet sleeping and recovery space | Available and suitable |
| Separation area | Isolation from resident or guest pets | Required for conflict or illness |
| Feeding area | Bowls, food storage and separation | Hygienic and controlled |
| Water | Clean water and backup supply | Continuously available |
| Other pets | Details, vaccination and behaviour | Fully disclosed and assessed |
| Children | Ages and supervision plan | Clearly controlled |
| Dangerous items | Medicines, chemicals, cords and plants | Removed or inaccessible |
| Temperature | Ventilation, cooling and shade | Appropriate for accepted pets |
| Waste | Toilet, cleaning and disposal plan | Documented and hygienic |
| Capacity | Maximum guest pets | Assigned by PetSaathi |
| Supervision | Time pets may remain alone | Within approved limit |
| Emergency vet | Clinic and travel time | Verified and documented |
| Transport | Vehicle or emergency arrangement | Available |
| Fire/flood plan | Evacuation and pet-control method | Written and practical |
| Legal permission | State, municipal, landlord and society status | Cleared before activation |

Part 3 — Pet-Risk Classification

Make it mandatory, but service-specific

A pet-risk assessment should be completed before matching.

However, the system should assess the booking risk, not permanently label the animal as good or bad.

The same dog might be:

Green for a familiar home-sitting visit

Yellow for a walk with a new sitter

Red for group boarding with unfamiliar animals

Risk must therefore consider:

The pet

The requested service

The environment

The sitter

Other animals

Medical conditions

Green — Routine booking

Examples

Calm with unfamiliar caregivers

No known bite history

Standard equipment

No significant medical requirement

Comfortable with the requested service

Matching rule

Match with a sitter approved for the relevant service and pet category.

A green classification does not mean zero risk. Normal safety checks still apply.

Yellow — Additional controls required

Examples

Strong leash pulling

Stranger anxiety

Separation distress

Escape tendency

Resource guarding

Senior mobility limitations

Medication instructions

Uncertain compatibility with other animals

Matching rule

Require some or all of the following:

Experienced sitter

Meet-and-greet

Detailed written instructions

Stronger equipment

Individual service rather than group care

Reduced route or service duration

Admin monitoring

Backup plan

Red — Manual safety review

Examples

Recent bite incident

Serious aggression

Uncontrolled seizures

Severe respiratory or cardiac concern

Repeated escape incidents

Unsafe or broken equipment

Serious incompatibility with resident animals

Customer unwilling to disclose relevant history

Matching rule

A red classification means:

Do not auto-match.

Possible decisions are:

Require veterinary guidance

Require behaviour-professional assessment

Use a specially experienced caregiver

Modify the service

Provide individual rather than group care

Decline the booking when safe delivery cannot be established

“Red” should not automatically mean permanent rejection, but safety must override booking volume.

Part 4 — Pet-Risk Questions Explained

1. Has your pet ever bitten or seriously injured anyone?

Ask follow-up questions:

When did it happen?

Who or what was bitten?

What triggered the event?

Was skin broken?

Has it happened more than once?

What management plan is currently used?

Do not accept only “yes” or “no.”

2. Does your dog pull strongly during walks?

Confirm:

Dog’s approximate weight

Equipment used

Triggers

Owner’s normal handling method

Whether the dog lunges

Whether the owner can demonstrate the routine

A 30-kilogram dog that pulls strongly may require a sitter approved for large-dog and yellow-risk walking.

3. Is your pet anxious with strangers?

Ask what anxiety looks like:

Hiding

Barking

Growling

Freezing

Attempting to escape

Refusing food

Snapping

Destructive behaviour

The behaviour, not only the word “anxious,” determines the control required.

4. Is your pet comfortable with other animals?

Ask separately about:

Dogs

Cats

Small animals

Resident pets

Food-time interactions

Same-sex or opposite-sex animals

Indoor and outdoor encounters

“Friendly at the park” does not automatically prove suitability for shared boarding.

5. Does your pet have medical conditions?

Collect:

Diagnosis reported by owner

Current symptoms

Medication

Mobility limitations

Seizure or collapse history

Breathing or cardiac concerns

Veterinarian details

Emergency instructions

Sitters should follow instructions and report observations; they should not diagnose the pet.

6. Is the pet currently vaccinated?

Record:

Vaccine type

Date

Certificate or veterinarian record

Next due date

Medical exemption, if any

A veterinarian should define which evidence is required for each service.

7. Is the pet neutered or spayed?

This information may affect:

Group compatibility

Heat-cycle management

Pregnancy risk

Resident-pet interactions

It should not automatically determine acceptance for every service.

8. Are there food restrictions or allergies?

Ask about:

Approved food

Treats

Human food

Allergies

Food guarding

Feeding separation

Emergency response to exposure

No host or sitter should give unapproved food.

9. Is there any emergency history?

Ask about:

Seizures

Collapse

Heat-related illness

Allergic reactions

Escape

Bites

Surgery

Emergency hospitalisation

Record what the owner and veterinarian instructed during the previous incident.

Additional mandatory questions

Add:

Has the pet ever escaped from a caregiver or property?

Does the pet guard food, toys or resting places?

Is the pet comfortable being touched near the collar, paws and food?

How long can the pet remain alone?

Has the pet boarded previously?

How did the pet react?

Is the pet currently ill, coughing, vomiting or experiencing diarrhoea?

Is the pet receiving medication?

Is the pet afraid of lifts, traffic, children or loud noises?

Does the pet require a crate, muzzle or specialised equipment?

Are there behaviours that were not covered by the form?

Part 5 — Corrected Matching Logic

Do not rely on weighted scoring alone

Safety requirements should be applied as hard filters before scoring.

A highly rated nearby sitter should not be selected when they are not approved for the pet’s size or risk category.

Stage 1: Mandatory eligibility filters

A sitter remains eligible only when:

The sitter is active and not suspended.

The sitter is approved for the requested service.

The sitter is approved for the pet’s size or type.

The sitter can handle the assessed risk level.

The sitter is available at the requested time.

Travel is operationally possible.

No schedule conflict exists.

The sitter accepts the booking and payout.

Boarding-property approval is current, where relevant.

Failure of any hard gate removes the sitter from the shortlist.

Stage 2: Rank eligible sitters

A practical ranking model is:

### Table 80

| Factor | Weight | Explanation |
| --- | --- | --- |
| Risk and pet compatibility | 25% | Experience with the pet’s handling requirements |
| Service capability | 20% | Approval for the exact service and pet category |
| Travel and locality | 20% | Arrival reliability and operational efficiency |
| Availability fit | 15% | Exact time plus travel buffer |
| Performance and reliability | 10% | Punctuality, cancellations, reports and ratings |
| Customer continuity/preference | 5% | Same sitter, language or justified comfort preference |
| Payout and price fit | 5% | Booking remains economically workable |

Why distance should not dominate

Your original system gives distance 25%.

Proximity matters, but it should not outweigh safety capability. A beginner living 500 metres away should not rank above an experienced large-dog walker living two kilometres away when the pet pulls strongly.

Customer gender preference

Gender preference may be considered when the customer explicitly raises a home-access or personal-comfort concern.

It should:

Remain a low-weight preference

Never replace capability

Not be inferred automatically

Include a “no preference” option

Be handled consistently and respectfully

Rating correction

Do not evaluate only the average star rating.

Use:

Rating

Number of completed bookings

Recent performance

No-show history

Cancellation rate

Incident history

Same-sitter requests

A 5.0 rating from one booking is weaker evidence than a 4.8 rating from thirty completed bookings.

Part 6 — Example Matching Decision

Customer request

City: Pune

Area: Baner

Pet: Labrador

Weight: Approximately 30 kilograms

Service: 30-minute walk

Risk: Yellow

Reason: Pulls strongly on leash

Time: 7:00 AM

Mandatory sitter requirements

The sitter must:

Be approved for dog walking

Be approved for large dogs

Have experience with strong pulling

Be available before 7:00 AM with travel buffer

Live within an operationally reasonable distance

Have no active safety restriction

Accept the approved walking equipment

Understand the escape and incident protocol

Additional controls

Before the first service:

Conduct a meet-and-greet.

Ask the owner to demonstrate the equipment.

Inspect the collar, harness and leash.

Confirm triggers and preferred route.

Avoid crowded or high-traffic areas initially.

Record an emergency contact.

Keep the first walk individual.

Monitor the first service closely.

Do not assign

Do not assign:

A new unassessed sitter

A sitter approved only for small dogs

A sitter uncomfortable with leash pulling

A sitter whose travel time makes punctuality doubtful

A sitter with a relevant unresolved incident

Example ranking

### Table 81

| Candidate | Decision |
| --- | --- |
| Beginner sitter, 500 metres away, small-dog approval | Ineligible |
| Experienced large-dog walker, 2 km away, available at 7 AM | Strong candidate |
| High-rated sitter, 4 km away, unavailable before 8 AM | Ineligible |
| Large-dog walker, 2.5 km away, recent no-show under review | Hold |
| Experienced walker, 3 km away, strong reliability and yellow-risk approval | Strong backup |

An 80+ matching score may be required after all hard gates are passed. The score must not make an otherwise ineligible sitter acceptable.

Final Approval Rules

A boarding booking should proceed only when:

The host is individually approved.

The property approval is current.

Local boarding rules permit the model.

Household consent is documented.

Capacity is available.

Resident animals are compatible or can be separated.

Health and vaccination requirements are met.

Emergency transport and veterinary contacts are confirmed.

The customer accepts the terms.

The pet-risk assessment matches the host’s capability.

A handover and emergency plan exists.

Simple explanation for professor

“PetSaathi should not allow open home boarding because boarding involves overnight supervision, property safety, other animals, health risks and emergency responsibility. A boarding host must pass identity checks, an interview, a property walkthrough, household-permission checks and a controlled trial. The property must have secure doors, windows and balconies, clean resting and feeding areas, capacity limits, separation arrangements and emergency transport. Every pet must receive a service-specific risk classification before matching. Green bookings may use normally approved sitters, yellow bookings require experienced sitters and additional controls, and red bookings require manual specialist review or rejection. Sitter selection should first apply mandatory safety filters and only then rank eligible caregivers by compatibility, service approval, locality, availability and performance. This prevents a nearby but inexperienced sitter from being assigned to a large or higher-risk pet.”

PetSaathi Phase 3 — Sitter Training Modules 🐾

Training-system objective

The purpose of the training system is to ensure that every approved sitter understands PetSaathi’s minimum requirements for:

Pet safety

Customer privacy

Service execution

Communication

Incident escalation

Report-card completion

Your proposed 5–15-minute module format is suitable for short microlearning lessons. However, watching a short video should not be treated as sufficient proof that a sitter can safely perform a service.

The complete training process should be:

Short lesson → knowledge quiz → scenario exercise → practical assessment → service-specific approval

Dog-walking, emergency-handling and boarding permissions should require practical assessment in addition to digital training.

Recommended Training Structure

### Table 82

| Module | Digital duration | Required for | Additional assessment |
| --- | --- | --- | --- |
| 1. Pet-Care Basics | 10 minutes | All sitters | SOP acknowledgement |
| 2. Dog-Walking Safety | 15 minutes | Walkers | Practical walking assessment |
| 3. Pet-Sitting Safety | 12 minutes | Home sitters | Home-entry scenario |
| 4. Boarding Safety | 15 minutes | Boarding hosts | Property assessment and trial |
| 5. Emergency Handling | 15 minutes | All active sitters | Emergency simulation |
| 6. Customer Communication | 10 minutes | All sitters | Message and report exercise |

The six digital modules require approximately 72 minutes in total. Practical assessments should be scheduled separately.

Module 1 — Pet-Care Basics

Duration

Approximately 10 minutes

Required for

Every sitter applicant who reaches the training stage.

Main learning objective

By the end of this module, the sitter should understand that PetSaathi services must be delivered according to confirmed customer instructions, safety rules and reporting requirements.

Topic 1: Pet-parent expectations

Customers expect the sitter to:

Arrive within the agreed time window.

Care for the correct pet.

Follow the written instructions.

Communicate delays promptly.

Send the promised updates.

Protect the pet and the customer’s property.

Report concerns honestly.

Complete the service report.

A sitter should never assume that caring for one pet is identical to caring for another pet.

The sitter must review:

The pet’s normal routine

Feeding instructions

Behaviour information

Exercise requirements

Emergency contact

Veterinary contact

Clear instructions, routine information, feeding directions, behavioural details and emergency contacts are recognised as essential when another person cares for a pet.

Topic 2: Punctuality

The sitter must:

Review the location before leaving.

Include travel and building-entry time.

Keep their phone charged.

Notify operations before the service time if a delay is likely.

Never silently miss a booking.

Correct behaviour

“I may be ten minutes late because of traffic. I informed PetSaathi before the scheduled time.”

Incorrect behaviour

“I arrived late and only explained after the customer complained.”

Repeated lateness should affect the sitter’s reliability score.

Topic 3: Hygiene

The sitter should:

Wash or sanitise hands before handling food.

Use clean bowls and approved equipment.

Collect dog waste.

Keep food separate between pets.

Avoid cross-contaminating feeding equipment.

Follow the customer’s cleaning instructions.

Inform operations when the environment appears unsafe or unhygienic.

For boarding services, cleanliness, suitable facilities, behavioural monitoring and adequate separation are central parts of responsible care.

Topic 4: Following instructions

The sitter must follow instructions relating to:

Food quantity

Walk duration

Approved route

Restricted rooms

Pet interactions

Harness or collar

Water

Medication

Key handling

Service updates

However, the sitter should not follow an instruction that creates an immediate and serious safety risk.

Example

If a customer asks the sitter to remove the leash in an unsecured area, the sitter should decline the unsafe request and contact PetSaathi.

Topic 5: No unauthorised feeding

The sitter must not provide:

Human food

Treats

Supplements

Medication

Food belonging to another animal

unless the customer has approved it in the booking instructions.

This rule protects pets with:

Allergies

Food restrictions

Medical diets

Sensitive digestion

Resource guarding

Topic 6: No unauthorised off-leash walking

The sitter should not remove the leash unless:

The service specifically permits it.

The location is legally and operationally appropriate.

The customer has approved it.

PetSaathi’s safety policy permits it.

The pet and sitter have been assessed for it.

For the Phase 3 pilot, the recommended default rule is:

All dog-walking services remain on leash.

Topic 7: No route changes without a valid reason

The sitter should follow the agreed route or service zone.

A route may be changed when:

The road is unsafe.

There is aggressive animal activity.

Construction blocks the route.

Weather conditions become dangerous.

The customer or PetSaathi approves a change.

The sitter should inform the customer or operations about a significant route change.

Module 1 knowledge check

Ask:

Can a sitter feed a treat because the pet appears hungry?

What should a sitter do when they expect to arrive late?

Can the sitter remove the leash when the park appears empty?

What should happen when a customer instruction appears unsafe?

Passing standard

Recommended quiz score: 80% or higher

All safety-critical questions must be answered correctly.

Module 2 — Dog-Walking Safety

Duration

Approximately 15 minutes, followed by a practical walking assessment.

Required for

Every applicant seeking dog-walking approval.

Main learning objective

The sitter should be able to begin, conduct and complete a walk while controlling escape, traffic, weather and interaction risks.

Topic 1: Pre-walk safety check

Before leaving the property, the sitter should confirm:

Correct pet

Collar or harness is secure

Leash is undamaged

Identification information is present where applicable

Gate and door can be controlled

Weather is suitable

Route is understood

Customer instructions are unchanged

Water and waste bags are available

If the harness is loose or damaged, the sitter should not begin the walk until the problem is resolved.

Topic 2: Leash handling

The sitter should:

Hold the leash securely.

Avoid wrapping it tightly around the wrist or fingers.

Maintain enough distance from traffic.

Avoid sudden pulling or harsh corrections.

Use only customer-approved equipment.

Maintain control when opening doors and gates.

Request additional assessment when the dog’s strength exceeds the sitter’s ability.

A sitter approved for small dogs should not automatically handle a large dog that pulls strongly.

Topic 3: Crossing roads

Before crossing, the sitter should:

Shorten the leash to a controllable length.

Stop at the edge of the road.

Check traffic in every direction.

Prevent the dog from entering the road first.

Cross directly and without using a phone.

Move away from the road before lengthening the leash.

The sitter should not record videos, type messages or review the route while crossing.

Topic 4: Avoiding unfamiliar free-roaming dogs

The sitter should:

Avoid approaching unfamiliar dogs.

Increase distance early.

Change direction when necessary.

Avoid narrow spaces that prevent escape.

Not allow nose-to-nose interaction without approval.

Contact operations when the route repeatedly presents animal conflict risk.

Avoiding uncontrolled interaction with unfamiliar dogs can reduce the risk of conflict, disease exposure and injury. ASPCA guidance similarly recommends caution around unfamiliar animals rather than assuming every dog will welcome an interaction.

Topic 5: Avoiding crowded areas

Crowded locations may increase the risk of:

Leash entanglement

Sudden contact with children

Unfamiliar dog interactions

Noise-related fear

Escape

Traffic exposure

The sitter should use quieter routes for anxious, reactive or inexperienced pets.

Topic 6: Water and heat safety

The sitter should monitor:

Heavy panting

Excessive drooling

Weakness

Confusion

Vomiting or diarrhoea

Unusual gum colour

Difficulty continuing the walk

These can be warning signs of heat-related illness. The sitter should stop the activity, move the pet to a cooler location, contact PetSaathi and the customer, and seek urgent veterinary guidance when symptoms are serious.

The sitter should not force a pet to finish the planned distance when the animal shows distress.

Topic 7: Waste cleanup

The sitter should:

Carry adequate waste bags.

Collect faeces promptly.

Dispose of bags appropriately.

Report diarrhoea, blood or unusual stool.

Follow society and local cleanliness requirements.

Topic 8: Live-location sharing

When live location is included:

Start sharing only when the walk begins.

Share it privately with the authorised customer or PetSaathi operations.

Use the agreed sharing duration.

Stop it when the walk is complete.

Do not share it in a general sitter group.

WhatsApp lets the sender choose the duration of live-location sharing and stop sharing at any time.

Live location should be presented as a service update, not as a guarantee that every safety risk has been removed.

Topic 9: Walk-start and end proof

At the start, the sitter should record:

Arrival time

Actual start time

Equipment check

Start confirmation

Photograph where included

At the end, the sitter should record:

Actual end time

Approximate distance

Pee and poop update

Water update

Mood and behaviour

End confirmation

Photograph where included

Safe return of the pet

Practical assessment

The applicant should demonstrate:

Secure door exit

Harness and leash inspection

Controlled road crossing

Safe direction change

Response to a pulling dog

Start and completion update

Waste handling

Emergency call procedure

Approval rule

Digital completion alone does not create walking approval.

Module 3 — Pet-Sitting Safety

Duration

Approximately 12 minutes, followed by a home-entry scenario assessment.

Required for

Applicants seeking home-sitting or home-visit approval.

Main learning objective

The sitter should be able to care for the pet while protecting the customer’s privacy, access credentials and property.

Topic 1: Entering the customer’s home

Before entry, the sitter should confirm:

Correct booking and address

Entry method

Customer instructions

Alarm or access process

Rooms that may be entered

Pet location

Emergency contacts

The sitter should send an arrival update immediately after entering.

Topic 2: Respecting privacy

The sitter must not:

Enter unauthorised rooms.

Open cupboards unrelated to pet care.

Photograph personal documents.

Share the customer’s address.

Invite another person into the home.

Post home photographs publicly.

copy or retain access codes unnecessarily.

Service photos should focus on the pet and care activity, not the customer’s private property.

Topic 3: Food and water instructions

The sitter should:

Use only approved food.

Follow the stated portion.

Refresh water when instructed.

Keep different animals’ food separate.

Report refusal to eat.

Report vomiting, diarrhoea or unusual drinking.

Never improvise medication or supplements.

Caregivers should receive detailed information about routine, food, health, behaviour, medication and veterinary contacts before assuming responsibility for a pet.

Topic 4: Play and rest balance

The sitter should follow the pet’s:

Age

Energy level

Health

routine

Customer instructions

A sitter should not force play when the pet is hiding, sleeping, anxious or showing discomfort.

Pets should have access to a calm space and should be allowed to withdraw from interaction when needed.

Topic 5: Medication only under approved instructions

The sitter may assist only when:

The customer has provided written instructions.

The task is within the sitter’s approved capability.

The medication and dose are clearly identified.

Timing is recorded.

The sitter is comfortable and trained.

PetSaathi permits the task.

The sitter must never:

Change the dose.

Give another pet’s medicine.

Diagnose a condition.

Start an unapproved treatment.

Force a task that cannot be completed safely.

When medication is missed, vomited or refused, contact PetSaathi and the customer rather than guessing.

Topic 6: Photo and video updates

Updates should show:

The correct pet

Feeding or water where relevant

Safe activity

General condition

Completion of instructions

The sitter should avoid showing:

Personal documents

Family photographs

Security systems

Access codes

Unnecessary rooms

Exact address information

Topic 7: Exit confirmation

Before leaving, the sitter should confirm:

Pet is secure.

Food and water tasks are complete.

Toilet or litter duties are complete.

Restricted doors remain closed.

Windows and gates are secure.

Appliances used for pet care are safe.

Key has been returned or stored properly.

Alarm process is complete.

Customer receives departure confirmation.

Pet-sitting assessment scenario

The sitter arrives and discovers that the customer’s instructions say the cat is in the bedroom, but the bedroom is listed as a restricted room.

The correct action is to pause, contact PetSaathi or the customer and obtain clarification. The sitter should not ignore the restriction or leave without checking.

Module 4 — Boarding Safety

Duration

Approximately 15 minutes, plus property assessment and a controlled trial.

Required for

Boarding-host candidates only.

Main learning objective

The host should understand that boarding approval applies to both the caregiver and the approved property.

Boarding providers need a suitable environment, behavioural monitoring, records, separation capacity and emergency procedures.

Topic 1: Home preparation

Before the pet arrives, the host should:

Secure doors, windows and balconies.

Remove accessible chemicals and dangerous objects.

Prepare sleeping and resting areas.

Prepare clean feeding and water areas.

Confirm separation space.

Review existing-pet arrangements.

confirm emergency transport.

check that household members understand the rules.

Topic 2: Pet introduction

Guest pets should not be placed immediately with unfamiliar resident animals.

The host should:

Follow the approved introduction plan.

Maintain physical control.

Observe body language.

Keep feeding items separate.

Provide individual resources.

Stop interaction when stress or aggression appears.

Maintain separation where compatibility is uncertain.

Gradual, supervised introductions and separate resources can reduce conflict and stress when unfamiliar animals share an environment.

Topic 3: Feeding schedule

The host must:

Label each pet’s food.

Follow the customer’s schedule.

Feed pets separately where required.

Record whether the pet ate.

Store food safely.

Prevent access to another pet’s food.

report refusal, vomiting or guarding.

Topic 4: Sleeping arrangements

Each pet should have an approved, comfortable resting space.

The host should know:

Where the pet normally sleeps

Whether a crate is used

Whether the pet can sleep near other animals

Whether the pet becomes anxious alone

Where the pet can be separated safely

A crate or separate room should be used as a safe resting area, not as punishment or continuous confinement.

Topic 5: Separation anxiety

Possible signs include:

Repeated pacing

Whining

Excessive barking

Destructive behaviour

Refusal to eat

Toileting indoors

Attempting to escape

The host should:

Follow the pet’s normal routine.

Provide familiar items.

Reduce unnecessary changes.

Inform the customer.

Avoid punishment.

Escalate persistent or severe distress.

Maintaining familiar routines and providing familiar-smelling items may help pets adjust when cared for away from their owners.

Topic 6: Preventing pet fights

The host should:

Never force interaction.

Feed animals separately.

Remove high-value toys when necessary.

supervise shared activity.

Maintain separation options.

Avoid exceeding approved capacity.

Watch for guarding, stiffness, staring, growling or blocking.

Aggression and resource guarding can escalate to biting or chasing. These behaviours require active management rather than assumptions that the animals will “work it out.”

Topic 7: Emergency escalation

The host should have immediate access to:

PetSaathi operations number

Pet-parent number

Emergency contact

Primary veterinarian

Emergency clinic

Transport method

Pet’s medical information

Boarding training does not replace home verification. The candidate must still pass:

Property walkthrough

Capacity review

Household consent check

Existing-pet review

Local compliance review

Controlled trial

Module 5 — Emergency Handling

Duration

Approximately 15 minutes, plus a mandatory emergency simulation.

Required for

Every active sitter.

Main learning objective

The sitter should recognise urgent warning signs, protect the pet from immediate danger and activate the escalation process without attempting an unauthorised diagnosis.

First aid is temporary support. It does not replace examination or treatment by a veterinarian. Serious injuries or illness require contact with the pet’s veterinarian or an emergency veterinary hospital.

Universal emergency sequence

For every serious incident:

Stop the normal service.

Move away from immediate danger when safe.

Call PetSaathi operations.

Contact the pet parent.

Contact the emergency contact if required.

Contact the veterinarian or emergency clinic.

Follow professional instructions.

Arrange authorised transport.

Record times, actions and observations.

Submit an incident report.

A WhatsApp message alone is insufficient for a life-threatening event. The sitter should call.

Topic 1: Vomiting

Record:

Number of episodes

Approximate time

Contents if safely observable

Other symptoms

Food or medication recently provided

Pet’s alertness

Escalate urgently when vomiting is repeated or occurs with:

Collapse

Severe weakness

Blood

Breathing difficulty

Swollen abdomen

Suspected poisoning

Seizure

Significant pain

The sitter should not provide food, medicine or home remedies unless instructed by a veterinarian or authorised customer protocol.

Topic 2: Injury

The sitter should:

Move the pet away from danger.

Avoid unnecessary movement.

Contact operations and the owner.

Contact veterinary care.

Prevent licking or further injury where safely possible.

Use first-aid measures only within training.

A poorly applied bandage or splint can worsen an injury, so untrained sitters should not improvise complex treatment.

Topic 3: Lost pet

Immediately:

Record the last known time and location.

Call operations and the customer.

Search the immediate safe area.

Inform security personnel where relevant.

Check exits and CCTV availability.

Share accurate information with the authorised search team.

Continue timestamped updates.

Do not conceal or delay reporting.

The sitter should never prioritise avoiding disciplinary action over reporting the escape.

Topic 4: Bite incident

The sitter should:

Separate people and animals safely.

Avoid placing hands between fighting animals.

Contact PetSaathi.

Inform the customer.

Seek medical care for injured people.

Seek veterinary care for injured animals.

Preserve factual details.

complete an incident report.

The sitter should not minimise a bite or pressure the injured person not to report it.

Topic 5: Aggression

Warning signs may include:

Stiff posture

Fixed stare

Growling

Lunging

Snapping

Resource guarding

Blocking access

Repeated attempts to bite

The sitter should increase distance, avoid punishment and contact operations when the situation cannot be controlled safely. Aggression is a serious behaviour issue that may require professional behavioural or veterinary support.

Topic 6: Breathing difficulty

Possible urgent signs include:

Laboured breathing

Repeated gasping

Blue, grey or unusually pale gums

Collapse

Severe weakness

Neck extended to breathe

Inability to settle

The sitter should minimise exertion and stress and seek urgent veterinary guidance.

Topic 7: Heatstroke

Possible signs include:

Rapid or heavy panting

Excessive drooling

Weakness

Confusion

Vomiting or diarrhoea

Abnormal gum colour

Collapse

The sitter should:

Stop exercise.

Move to a cooler area.

Contact the customer, PetSaathi and a veterinarian.

Begin veterinarian-directed cooling.

Arrange urgent transport.

Heatstroke is an emergency and should not be handled only by giving water and waiting.

Topic 8: Accident during a walk

For a traffic or other major accident:

Protect the scene without endangering yourself.

Keep the pet from escaping.

Call operations and the customer.

Contact emergency veterinary care.

Avoid unnecessary movement.

Record location and time.

Identify witnesses where possible.

preserve evidence without delaying treatment.

Emergency simulation

Each sitter should complete at least one scenario such as:

A dog begins breathing heavily, becomes weak and lies down during an afternoon walk.

The sitter must demonstrate the correct call order, immediate action and incident documentation.

Module 6 — Customer Communication

Duration

Approximately 10 minutes

Required for

Every sitter.

Main learning objective

The sitter should communicate clearly, calmly and factually without making unsupported promises or diagnoses.

Topic 1: Polite and professional messaging

Messages should be:

Short

Respectful

Specific

Timely

Factual

Good message

“I have arrived for booking BK-021 at 7:28 AM. Bruno’s harness is secure, and we are beginning the walk.”

Poor message

“Reached.”

Topic 2: Standard update format

Use:

Booking ID:Pet:Status: Arrived/Started/CompletedTime:Update:Concern: None/DetailsNext step:

This prevents important details from being lost in informal chat.

Topic 3: When to call admin

The sitter should call immediately for:

Pet escape

Injury

Bite

Breathing difficulty

Collapse or seizure

Unsafe customer instruction

Aggressive behaviour that cannot be controlled

Inability to enter or secure the property

Expected no-show or major delay

Lost key

Unauthorised person requesting the pet

Serious customer conflict

Routine updates can remain in the booking communication channel.

Topic 4: What not to say

The sitter should not say:

“Your pet is completely safe.”

“I guarantee nothing will happen.”

“Your pet definitely has a medical condition.”

“Do not tell PetSaathi.”

“I can send my friend instead.”

“This is not my responsibility.”

“The customer is wrong.”

Use factual alternatives.

Example

Instead of:

“Your dog has a heart problem.”

Write:

“The dog slowed down, was breathing more heavily than expected and required a rest. I contacted operations and the customer.”

Topic 5: Complaint handling

When the customer complains, the sitter should:

Listen without arguing.

Acknowledge the concern.

Avoid admitting unsupported facts.

Avoid deleting messages.

Contact PetSaathi.

Provide a factual timeline.

preserve photographs and reports.

Allow the admin to manage refunds or formal resolution.

Recommended response

“Thank you for raising this. I am informing PetSaathi operations so the booking details and service record can be reviewed promptly.”

Topic 6: Report-card quality

A good report card should be:

Submitted on time

Complete

Factual

Easy to read

Consistent with photographs and timestamps

Clear about unusual behaviour

Free from unsupported medical statements

The report should include only relevant information.

Training Assessment Framework

1. Module quiz

Each module should contain:

Five to ten questions

Scenario-based questions

At least one safety-critical question

Immediate explanations after incorrect answers

2. Recommended passing criteria

### Table 83

| Assessment | Requirement |
| --- | --- |
| General module quiz | 80% or higher |
| Safety-critical questions | 100% correct |
| Practical assessment | Pass |
| Emergency simulation | Pass |
| Boarding property assessment | Pass for boarding only |

A candidate who fails a module may repeat the lesson and quiz.

Repeated unsafe answers should trigger trainer review rather than unlimited automatic retries.

Training Records for the Future Database

Each completion should create a record containing:

Training record ID

Sitter ID

Module ID

Module version

Start date

Completion date

Quiz score

Number of attempts

Practical-assessment result

Trainer or reviewer

Expiry or refresher date

Current status

Suggested training statuses

Not Assigned

Assigned

In Progress

Quiz Failed

Quiz Passed

Practical Assessment Pending

Completed

Refresher Required

Suspended

Service-Approval Rules

Walker approval requires

Module 1 completed

Module 2 completed

Module 5 completed

Module 6 completed

Practical walking assessment passed

Home-sitter approval requires

Module 1 completed

Module 3 completed

Module 5 completed

Module 6 completed

Home-entry scenario passed

Boarding approval requires

Modules 1, 3, 4, 5 and 6 completed

Boarding-home assessment passed

Controlled trial passed

Local requirements reviewed

Completing all videos does not create automatic approval.

Simple Explanation for Professor

“PetSaathi’s training system uses six short digital modules followed by quizzes and practical assessments. The first module teaches general responsibilities such as punctuality, hygiene, following instructions and avoiding unauthorised food or off-leash activity. The dog-walking module covers leash handling, road safety, unfamiliar animals, heat, live location and walk reports. The pet-sitting module covers home access, privacy, feeding, medication instructions, updates and secure departure. Boarding candidates receive additional training on home preparation, pet introductions, feeding, sleeping, separation and emergency escalation. Every sitter completes emergency training covering vomiting, injury, lost pets, bites, aggression, breathing difficulty, heatstroke and accidents. The final module teaches professional customer communication, complaint handling and report-card quality. A sitter is approved only after passing the required quizzes, practical assessment and emergency simulation—not merely after watching the training videos.”

PetSaathi Phase 3 — Training Quiz, Sitter Agreement, Payouts and Reliability Controls 🐾

Overall assessment

The proposed system is directionally strong, but several rules need correction before they become official:

A sitter should not pass merely by obtaining 70% when the missed questions concern escapes, bites, unsafe feeding or emergency escalation.

Quiz completion should not replace practical assessment.

“Platform margin” should be renamed gross spread or gross margin before operating costs.

The anti-poaching clause must be narrowly drafted. A broad post-termination restriction may be unenforceable under Indian law.

Serious complaints should trigger investigation and temporary restriction, not automatic guilt.

Safety violations must override the numerical sitter score.

The agreement must address current gig-worker, payout, tax, privacy and grievance requirements.

Part 1 — Sitter Training Quiz

Purpose of the quiz

The quiz should establish that a sitter understands:

PetSaathi’s safety rules

Service-specific responsibilities

Customer privacy

Payment rules

Incident reporting

Emergency escalation

Report-card requirements

The correct approval sequence should be:

Training module → quiz → scenario assessment → practical assessment → probation booking → service-specific approval

A quiz proves knowledge. It does not prove that the sitter can physically control a large dog, secure a customer’s home or manage a boarding property.

Recommended passing scores

Your proposed scores are:

### Table 84

| Training level | Proposed score |
| --- | --- |
| Basic walker | 70% |
| Home sitter | 75% |
| Boarding host | 80% |
| Emergency backup sitter | 85% |

The main weakness is that a walker receiving 70% could answer three of ten questions incorrectly, including potentially serious safety questions.

Recommended official standard

### Table 85

| Training level | Overall quiz score | Safety-critical questions | Additional requirement |
| --- | --- | --- | --- |
| Basic walker | 80% | 100% correct | Practical walking assessment |
| Home sitter | 80% | 100% correct | Home-entry/privacy scenario |
| Boarding host | 85% | 100% correct | Property assessment and trial |
| Emergency backup sitter | 90% | 100% correct | Emergency simulation |
| Refresher training | 80% | 100% correct | Required after defined incidents |

These percentages are proposed PetSaathi standards, not statutory or industry-mandated thresholds.

Safety-critical questions

The sitter should fail the assessment when they answer any of these incorrectly:

What should you do when a pet escapes?

May you send another person instead of yourself?

May you hide an injury or bite?

May you administer unapproved medication?

What should you do when a pet has difficulty breathing?

May you walk a dog off-leash in an unsecured public place?

What should you do when you cannot attend a confirmed booking?

May you share a customer’s address or access code?

May you accept a booking outside your approved service category?

The sitter may repeat the module, but repeated unsafe responses should trigger trainer review rather than unlimited automatic attempts.

Part 2 — Correcting the Example Questions

Question 1

Proposed question

Should you remove the dog’s leash in a public area?

Correct answer

No, unless PetSaathi has an expressly approved off-leash service in a lawful, secure location and all relevant conditions have been satisfied. During the Phase 3 pilot, the default is always on-leash walking.

This prevents the sitter from interpreting customer permission alone as sufficient.

AVMA guidance recommends obeying leash laws and monitoring pets for signs such as breathing difficulty, lameness or rapid fatigue during walks.

Question 2

Proposed question

Can you feed a pet biscuits without owner approval?

Correct answer

No. Only approved food, treats, supplements or medication may be given.

The sitter must consider:

Allergies

Medical diets

Digestive problems

Food guarding

Interaction with medication

Question 3

Proposed question

What should you do if the pet vomits?

Proposed answer

Inform the admin or owner immediately.

Improved answer

Stop normal activity, observe the pet, record the time and relevant symptoms, and promptly notify PetSaathi and the customer. Seek urgent veterinary guidance when vomiting is repeated, contains blood or occurs with weakness, collapse, breathing difficulty, severe pain, abdominal swelling, suspected poisoning or other serious symptoms. Do not provide medicine or a home remedy without authorisation.

One isolated vomiting episode and repeated vomiting with collapse should not be treated as identical events.

AVMA states that pet first aid is temporary assistance and does not replace veterinary treatment; its emergency guidance identifies vomiting or diarrhoea alongside weakness, confusion and abnormal breathing as possible heatstroke signs.

Question 4

Proposed question

Should you send a photo update after service?

Improved answer

Yes, when the booking includes a photo update and the customer has permitted service photographs. Send it privately through the authorised booking channel and avoid showing addresses, access codes, family photographs or unrelated parts of the home.

Photo submission should test both reporting and privacy.

Question 5

Proposed question

Can you accept cash directly from the customer secretly?

Better question

A customer offers to pay you directly instead of through PetSaathi. What should you do?

Correct answer

Decline the direct payment, explain that payment must use PetSaathi’s approved process, and report the request to operations.

The word “secretly” makes the answer too obvious. A scenario-based question tests judgement more effectively.

Major pet-care platforms use similar platform-payment policies. Rover states that off-platform payments leave it without a booking record and may remove platform protections; PetBacker also requires platform payment and may suspend providers who solicit outside payment. These are examples of marketplace controls, not legal rules PetSaathi can copy without defining its own services and protections.

Question 6

Proposed question

What should you do if you are late?

Correct answer

Notify PetSaathi immediately when a delay becomes likely, provide an honest estimated arrival time and wait for instructions. The customer should be informed through the approved process.

The sitter should not wait until after the scheduled time.

Question 7

Proposed question

Can you change the walking route without permission?

Correct answer

Normally no. However, the sitter may leave the route when necessary to avoid immediate danger, blocked roads, hostile animals, unsafe crowds, extreme weather or another material risk. The sitter must then notify PetSaathi and the customer.

A rigid “never change the route” rule could force the sitter to remain in an unsafe situation.

Recommended Quiz Format

Question distribution

A 20-question service quiz could contain:

### Table 86

| Question category | Number |
| --- | --- |
| General conduct | 4 |
| Service execution | 5 |
| Safety and emergency | 6 |
| Communication and privacy | 3 |
| Payments and platform rules | 2 |
| Total | 20 |

Use a mixture of:

Multiple-choice questions

Short scenarios

Correct sequencing

“Select all that apply”

One short written incident response

Example scenario questions

Escape scenario

The dog slips through the society gate. What are your first three actions?

Correct elements:

Begin immediate safe containment or search.

Call PetSaathi operations and the customer.

Record the last known location and time and activate the escape protocol.

The sitter must not delay reporting while attempting to solve the problem privately.

Replacement scenario

You become ill one hour before a booking. May your friend complete the service?

Correct answer:

No. Contact PetSaathi immediately. Only an approved, customer-authorised replacement may complete the service.

Privacy scenario

The customer’s access code is visible in a WhatsApp group. What should you do?

Correct answer:

Report the exposure, request deletion from the group and use only the approved restricted channel. Do not forward or retain the code.

Quiz Administration Rules

Each quiz record should contain:

Sitter ID

Training module

Module version

Quiz version

Date and time

Score

Safety-critical answers

Number of attempts

Reviewer

Practical-assessment requirement

Final result

Recommended statuses:

Assigned → Started → Failed → Retraining Required → Passed → Practical Pending → Fully Completed

A sitter should retake the current module when the training content materially changes.

Part 3 — Sitter Agreement

Required agreement sections

The agreement should cover:

### Table 87

| Section | What it should establish |
| --- | --- |
| Parties and definitions | Who PetSaathi and the provider are |
| Provider status | Legal relationship and applicable obligations |
| Approved services | What the sitter may and may not provide |
| Booking acceptance | How individual services become binding |
| Timing and attendance | Punctuality and delay reporting |
| Safety obligations | Handling, feeding, equipment and emergency rules |
| Customer instructions | Requirement to follow safe written instructions |
| Payment and payout | Price, payout, deductions and timing |
| Cancellations | Customer, sitter and platform cancellation rules |
| Platform transactions | Approved payment and communication process |
| Confidentiality | Customer, pet, home and business information |
| Data and media | Photos, videos, documents and privacy |
| Incidents and damage | Mandatory reporting and investigation |
| Insurance and liability | Actual coverage and exclusions |
| Training and scoring | Assessments and performance monitoring |
| Suspension and termination | Grounds, investigation and appeal |
| Grievance process | How the sitter challenges a decision |
| Governing law and disputes | Applicable law and dispute process |

The final contract should be reviewed by an India-qualified lawyer before it is used operationally.

Role and legal status

The agreement should clearly describe whether the sitter is intended to operate as:

An independent service provider

A gig or platform worker

A contractor

An employee

Merely writing “independent contractor” does not resolve the legal classification when PetSaathi exercises extensive control over scheduling, pricing, supervision, exclusivity and working methods.

The Code on Social Security, 2020 has been in force since 21 November 2025 and expressly provides for gig and platform workers. Section 114 allows social-security schemes and requires specified aggregators to contribute between 1% and 2% of annual turnover, subject to a cap of 5% of amounts paid or payable to gig and platform workers. PetSaathi must determine with counsel whether its operating model and service category fall within these provisions.

Bengaluru-specific warning

The Karnataka Platform Based Gig Workers (Social Security and Welfare) Act, 2025 is deemed effective from 30 May 2025 and applies to covered digital platforms operating in Karnataka. It includes platform registration, worker information, payout transparency, grievance mechanisms and a welfare fee of 1%–5% of gig-worker payout at a rate to be notified. A Bengaluru pilot therefore requires a Karnataka-specific compliance review rather than only a generic sitter contract.

Part 4 — Anti-Poaching and Non-Circumvention

Proposed clause

The sitter cannot take direct bookings from platform customers for a defined period after being introduced through the platform.

Legal concern

This should not be inserted as a broad, indefinite non-compete clause.

Section 27 of the Indian Contract Act states that an agreement restraining a person from exercising a lawful profession, trade or business is void to that extent, except for the limited statutory goodwill exception. The Supreme Court reiterated in 2025 that restrictions operating during an agreement are treated differently from restrictions imposed after termination, and broad post-termination restraints face serious enforceability problems.

Recommended approach

Use a narrowly drafted non-circumvention and platform-introduced customer clause, rather than a broad anti-competition clause.

It should focus on:

Bookings generated through PetSaathi

Customers whose contact information was supplied by PetSaathi

Concealed direct payments for those bookings

Misuse of confidential lead or customer data

Cancellation of a platform booking to recreate it privately

False pricing or records intended to avoid platform fees

It should not prohibit the sitter from:

Performing all pet-care work in the market

Working for competing platforms generally

Serving customers independently obtained without PetSaathi data

Continuing their lawful occupation after leaving PetSaathi

Safer operational wording

During the term of this agreement, and to the extent permitted by applicable law, the Service Provider shall not intentionally divert, conceal or convert a booking introduced, arranged or actively managed by PetSaathi into an unrecorded direct transaction. The Service Provider shall not misuse PetSaathi customer data, cancel or misrepresent a booking to avoid approved platform charges, or request undisclosed payment from a platform-introduced customer. Any post-termination restriction must be interpreted narrowly and only to the extent enforceable under applicable law.

The actual duration, remedy and scope require legal drafting.

Avoid excessive penalties

Do not automatically impose an arbitrary fine such as ten times the booking value.

A remedy should be:

Connected to a genuine loss

Proportionate

Clearly disclosed

Supported by evidence

Reviewed for enforceability

The sitter should have a process to challenge an allegation.

Part 5 — Off-Platform Payment Rule

Recommended official rule

All customer payments for PetSaathi-arranged bookings must use an approved PetSaathi payment method. Sitters must not request, conceal or accept unrecorded payments, charges, deposits or extensions relating to such bookings.

This should cover:

Cash

Personal UPI

Bank transfer

Hidden additional charges

Reduced platform booking followed by private payment

Private extensions of a platform booking

Tips, unless PetSaathi has an approved tip policy

The rule is commercially reasonable because on-platform payment maintains:

Booking records

Payout records

Refund evidence

Review eligibility

Complaint handling

Tax and accounting records

Incident traceability

Rover and PetBacker both require platform-arranged services to be paid through their systems and link platform payment with transaction records and support mechanisms.

PetSaathi must not say that on-platform payment provides “insurance” or a “guarantee” unless those protections genuinely exist and their terms are disclosed.

Part 6 — Sitter Payout Structure

Correct terminology

Your table currently calls the difference between the customer price and sitter payout “platform margin.”

A clearer term is:

Gross spread before variable costs

It is not final profit because PetSaathi may still incur:

Payment-processing costs

Refunds

Replacement services

Support labour

Bonuses

Travel support

Marketing

Gig-worker welfare contributions

Taxes

Insurance

Technology and fixed overhead

Corrected financial table

### Table 88

| Service | Customer price | Sitter payout | Gross spread | Gross-spread percentage |
| --- | --- | --- | --- | --- |
| 30-minute walk | ₹149 | ₹100–₹110 | ₹39–₹49 | 26.2%–32.9% |
| 60-minute walk | ₹299 | ₹200–₹220 | ₹79–₹99 | 26.4%–33.1% |
| One-hour sitting | ₹299 | ₹200–₹220 | ₹79–₹99 | 26.4%–33.1% |
| Boarding per night | ₹999 | ₹700–₹800 | ₹199–₹299 | 19.9%–29.9% |

Contribution formula

Use:

Customer price− sitter payout− payment cost− support cost− bonus allocation− refund/replacement reserve− applicable welfare or statutory cost= contribution per booking

Example

For a ₹149 walk:

### Table 89

| Item | Amount |
| --- | --- |
| Customer payment | ₹149 |
| Sitter payout | ₹105 |
| Gross spread | ₹44 |
| Payment processing | ₹4 |
| Support allocation | ₹12 |
| Bonus/risk reserve | ₹5 |
| Contribution | ₹23 |

The actual contribution percentage would be approximately 15.4%, not the apparent 29.5% gross spread.

Payout timing

### Table 90

| Provider type | Recommended payout timing |
| --- | --- |
| New/probation sitter | Weekly after service verification |
| Regular walker | Weekly |
| High-volume recurring walker | Weekly or twice monthly |
| Boarding host | After checkout and completion review |
| Emergency backup sitter | Normal payout plus approved emergency premium |
| Disputed booking | Hold only the disputed amount pending review |

Monthly payout may be too slow for individual walkers and could reduce supply reliability.

Rover releases provider funds after completed services, while PetBacker reports releasing or making provider funds withdrawable only after booking completion. PetSaathi may choose its own schedule, but the payout trigger and dispute period must be clearly disclosed.

Payout ledger fields

Record:

Booking ID

Sitter ID

Service date

Base payout

Additional-pet payout

Travel support

Peak-time amount

Emergency premium

Bonus

Deduction

Deduction reason

Tax treatment

Payment status

Payout date

Bank reference

Dispute status

Razorpay Route supports linked accounts, split payments, transfers, reversals and settlement reconciliation for one-to-many marketplace models. This may become useful when PetSaathi moves from manual payouts to automated marketplace settlement.

Tax warning

From 1 April 2026, payments and credits are governed by the Income Tax Act, 2025. The Income Tax Department states that TDS rates and monetary thresholds were retained during the transition, but the applicable provision depends on the nature of the payment, payer, payee and contract. PetSaathi should have an accountant determine the correct withholding and documentation rather than promising sitters that the table amount will always equal their bank receipt.

The agreement should state:

Whether the payout is inclusive or exclusive of applicable tax

Whether TDS may be deducted

What documentation the sitter must provide

When payout statements or certificates will be issued

How statutory welfare amounts are treated

Part 7 — Bonus System

Recommended bonus structure

### Table 91

| Bonus | Recommended condition |
| --- | --- |
| Reliability bonus | Defined number of completed, on-time bookings with no unresolved incident |
| Customer-experience bonus | Minimum review sample and strong average rating |
| Repeat-service bonus | Same customer completes another paid booking with that sitter |
| Emergency premium | Sitter accepts and safely completes an approved urgent replacement |
| Peak-slot premium | Approved high-demand time or area |
| Quality bonus | Complete and timely reports across a defined period |

On-time bonus

Instead of:

On-time bonus after 20 successful bookings

Use:

Bonus after 20 completed bookings with at least a 95% on-time rate, no unexplained no-show, complete reports and no unresolved serious incident.

This prevents a sitter from receiving the bonus after nineteen late bookings and one timely booking.

Five-star bonus

Instead of rewarding exactly ten five-star bookings, use:

Minimum ten rated bookings

Average rating threshold

Review coverage requirement

No confirmed manipulation

No unresolved serious complaint

A sitter should not pressure customers for five stars.

Repeat-customer bonus

Pay the bonus only when:

The second booking is paid.

The service is completed.

The customer independently requested or accepted the sitter.

The repeat transaction remains recorded through PetSaathi.

Emergency premium

The premium should compensate for:

Short notice

Additional travel

Difficult timing

Higher disruption

It must not encourage sitters to accept services outside their capability.

Premium badge

A premium badge is not a cash bonus. It is a performance status.

Recommended criteria:

At least ten completed bookings

Rating of 4.5 or higher

Strong on-time and report rates

Low cancellation rate

No unexplained no-show

No unresolved serious incident

Current training and verification

Part 8 — Sitter Scorecard

Assessment of the proposed score

### Table 92

| Factor | Proposed score |
| --- | --- |
| On-time arrival | 20 |
| Communication | 15 |
| Pet handling | 25 |
| Update/report quality | 15 |
| Customer rating | 20 |
| Admin reliability | 5 |
| Total | 100 |

This is workable, but “admin reliability” is vague, and customer rating has a relatively high influence despite possible small samples and customer bias.

Recommended scorecard

### Table 93

| Factor | Maximum points |
| --- | --- |
| Safety and pet handling | 25 |
| On-time arrival | 15 |
| Communication | 15 |
| Instruction compliance | 15 |
| Update/report quality | 10 |
| Customer rating | 15 |
| Reliability and cancellation record | 5 |
| Total | 100 |

Why instruction compliance should be separate

A sitter could handle the pet calmly but still:

Use the wrong food

Enter a restricted room

Change the agreed service

Ignore medication instructions

Miss a required update

Pet handling and instruction compliance therefore measure different risks.

Score types

Store:

Booking-level score

Latest-five-booking average

Latest-ten-booking average

Lifetime average

Total completed bookings

Rating sample size

Incident-adjusted status

Do not publicly rank a sitter from one booking alone.

Recommended interpretation

### Table 94

| Score | Grade | Action |
| --- | --- | --- |
| 90–100 | A+ | Premium review eligibility |
| 80–89 | A | Priority for suitable bookings |
| 70–79 | B | Active with normal monitoring |
| 60–69 | C | Coaching, restricted volume or probation |
| Below 60 | D | Pause and formal review |

A Grade D from one poor but non-safety booking should trigger review, not necessarily permanent removal.

Safety override

Immediately pause new bookings where credible evidence indicates:

Pet abuse or reckless handling

Pet escape concealed by the sitter

Serious injury not reported

Unauthorised substitution

False service evidence

Customer-address or access-code misuse

Theft

Deliberate off-platform diversion

Service performed outside approval

Serious intoxication during service

Repeated unexplained no-shows

The sitter’s 95/100 historical average must not neutralise a serious safety incident.

Part 9 — Reliability Rules

1. Two late arrivals in ten bookings

Approve this as a warning trigger, but define “late.”

Recommended definition:

The sitter arrived outside the confirmed service window without approved notice or a documented exceptional cause.

Use escalating action:

### Table 95

| Pattern | Action |
| --- | --- |
| First minor late arrival | Coaching and record |
| Two avoidable late arrivals in ten bookings | Reliability warning |
| Three avoidable late arrivals | Probation or reduced priority |
| Repeated lateness after coaching | Temporary pause |

2. One no-show without a valid reason

Recommended action:

Immediate temporary pause and investigation.

A no-show means:

A confirmed booking was accepted.

The sitter did not attend.

Adequate advance notice was not provided.

No approved replacement completed the service.

The sitter should not automatically be permanently removed before the facts are established, but they should receive no new booking until review.

Established platforms also treat provider cancellations as serious reliability events and maintain replacement or refund processes.

3. Poor communication

Replace this vague phrase with measurable events:

Did not acknowledge booking assignment

Failed to report expected delay

Missed required arrival update

Did not respond during an active service

Used abusive or threatening language

Failed to respond to an incident investigation

Repeatedly submitted incomplete messages or reports

Accent, grammar or English fluency should not be treated as poor reliability when communication remains understandable and professional.

4. Repeatedly missing report cards

Suggested escalation:

First missing report: reminder and coaching

Second within five bookings: warning

Third: pause until reporting retraining is completed

A missing report connected to a hidden incident is a more serious integrity violation and should not use only progressive coaching.

5. Unsafe pet handling

Temporarily pause immediately when the allegation is credible.

Investigate:

Booking instructions

Photos or video

Customer statement

Sitter statement

Witnesses

Medical or veterinary documentation

Previous history

Possible outcomes:

No violation established

Coaching

Service restriction

Retraining and reassessment

Suspension

Permanent removal

6. Serious customer complaint

Use:

Temporarily restrict relevant bookings pending investigation.

A complaint is not automatically proven, but serious allegations should not be ignored while the sitter continues receiving similar bookings.

7. Attempting to divert a customer

Investigate whether the sitter:

Requested private payment

Cancelled and recreated the booking privately

Shared a personal QR code

Asked the customer to understate the platform booking

Used customer information obtained through PetSaathi

Offered hidden discounts to remove the booking from PetSaathi

Apply the contract only to the extent legally valid. Avoid characterising ordinary independent work unrelated to PetSaathi leads as poaching.

8. Hiding an incident

This should be a critical integrity violation.

Possible examples:

Pet temporarily escaped but was recovered.

Pet was injured.

A bite occurred.

The sitter damaged the property.

The wrong food or medicine was provided.

Another person performed the service.

The sitter left the pet unattended contrary to instructions.

Immediate pause is appropriate because the problem is not only the incident—it is the concealment.

9. Accepting a service outside eligibility

Examples include:

Small-dog walker accepting a large reactive dog

Home sitter independently accepting boarding

Unassessed boarding property accepting a pet

Sitter without medication approval accepting a specialised medication task

Recommended action:

Stop or reassign the booking where possible.

Pause the relevant permission.

Investigate how the booking bypassed the matching controls.

Retrain the sitter and admin where necessary.

This may indicate both sitter misconduct and an admin-system failure.

Recommended Suspension and Appeal Workflow

Use:

Concern Reported→ Temporary Safety Hold→ Evidence Collected→ Sitter Response→ Review Decision→ Corrective Action→ Reinstatement/Restriction/Suspension/Removal

Every decision should record:

Allegation

Evidence

Severity

Sitter response

Decision-maker

Action

Effective date

Appeal process

Reinstatement conditions

Karnataka’s gig-worker legislation includes grievance rights concerning payouts, deductions and termination and requires covered platforms to maintain an internal dispute-resolution process. Even outside Karnataka, a documented process is better than unexplained deactivation.

Final Approval Decisions

### Table 96

| Proposed element | Decision | Required correction |
| --- | --- | --- |
| Service-specific quiz scores | Approve with modification | Raise minimums and require 100% on critical safety questions |
| Quiz before approval | Approve | Add scenario and practical assessment |
| Sitter agreement | Approve | Include labour, tax, privacy, grievance and service-scope clauses |
| Anti-poaching clause | Approve only after redrafting | Use narrow non-circumvention language and legal review |
| No off-platform payments | Approve | Define approved payments, tips and extensions |
| Proposed payout ranges | Approve as experiments | Treat difference as gross spread, not profit |
| Weekly payouts | Approve | Provide transparent ledger and dispute rules |
| Bonus system | Approve with controls | Tie bonuses to safety, sample size and completed bookings |
| Scorecard after every booking | Approve | Use rolling scores and safety overrides |
| Immediate pause for serious risk | Approve | Use investigation and appeal workflow |
| Automatic removal from one complaint | Reject | Temporarily pause and investigate first |

Final Operating Principle

A sitter is approved only after completing the required training, passing the knowledge and safety assessments, demonstrating practical capability and accepting the sitter agreement. Every payout is linked to a completed booking, every performance decision is recorded, and every serious safety issue overrides the numerical score. Platform-introduced bookings must remain recorded and paid through PetSaathi, but any restriction on a sitter’s future lawful work must be narrow, proportionate and legally reviewed.

Simple explanation for professor

“PetSaathi will require every sitter to complete a service-specific training quiz, but the quiz alone will not provide approval. Basic walkers and home sitters should score at least eighty percent, boarding hosts eighty-five percent and emergency backup sitters ninety percent. Every safety-critical question must be answered correctly, followed by a practical or scenario assessment. The sitter agreement will define approved services, payments, safety responsibilities, confidentiality, cancellations, incident reporting and suspension procedures. Off-platform payments and intentional diversion of PetSaathi bookings will be prohibited, but the agreement will not broadly prevent sitters from carrying on their lawful occupation. Payout figures will be treated as gross spreads rather than final profit because support, payment, refund, bonus, tax and statutory costs must still be deducted. Sitters will receive a score after every booking, while serious safety or integrity problems will trigger an immediate temporary pause and formal investigation.”

PetSaathi Phase 3 — Emergency Protocol and Future Data Architecture 🐾

Overall assessment

The proposed emergency system has the correct foundation:

Detection → escalation → veterinary decision → incident record → customer follow-up

However, three corrections are essential:

Symptoms cannot always be assigned a fixed severity. Vomiting may be minor or life-threatening depending on repetition, blood, weakness, breathing difficulty, suspected poisoning or heat exposure.

Level 3 response must not wait for the admin. The sitter should contact emergency veterinary support immediately while the owner and PetSaathi are notified in parallel.

The database requires more separation and history tables. One incidents table is insufficient for notifications, evidence, veterinary actions, expenses, corrective actions and audit history.

Veterinary first aid is temporary support and does not replace professional veterinary diagnosis or treatment. PetSaathi’s final clinical thresholds should be approved by a registered veterinary practitioner whose credentials can be checked through the Veterinary Council of India framework.

Part 1 — Corrected Emergency Levels

Recommended classification principle

Severity should depend on:

The observed symptom

Duration and repetition

Pet’s age and medical history

Level of consciousness

Breathing condition

Bleeding or injury

Suspected poisoning

Whether the pet is missing

Whether a human or another animal is injured

Instructions previously provided by the veterinarian

The sitter does not diagnose the illness. The sitter records observations and follows the escalation protocol.

Level 1 — Monitor and Notify

Typical situations

Mild anxiety without aggression or breathing difficulty

One missed meal in an otherwise alert and stable pet

Mild temporary restlessness

Small change in routine

Minor service-related concern with no immediate health threat

Required action

Keep the pet comfortable.

Record the observation.

Notify the owner through the approved channel.

Notify PetSaathi if the behaviour continues or worsens.

Follow the owner’s existing written instructions.

Escalate immediately if a red-flag symptom appears.

Proposed internal response target

Owner update: within 15 minutes

Report-card note: mandatory

Continued observation: until service completion or further instructions

Important correction

“Pet not eating” should not automatically remain Level 1.

It should be upgraded when:

The pet has a relevant medical condition.

Medication depends on food.

The pet is weak or unusually quiet.

Vomiting, diarrhoea or pain is present.

The veterinarian’s instructions require urgent action.

The refusal continues beyond the period defined in the pet’s care plan.

Level 2 — Urgent Assessment

Typical situations

A single vomiting episode with the pet currently stable

Minor wound or superficial injury

Heavy anxiety or prolonged distress

Repeated refusal of food where medical risk is uncertain

Mild lameness

Possible ingestion of an unapproved item without severe symptoms

Non-critical medication error

Pet and sitter unable to continue the normal service safely

Required action

Stop the normal service activity.

Move the pet to a safe and calm location.

Call PetSaathi operations.

Contact the owner.

Contact the designated veterinarian for triage when required.

Photograph or record the condition when safe and appropriate.

Follow veterinary instructions.

Do not provide medicine, food or home treatment without authorisation.

Create an incident record immediately.

Proposed internal response target

Admin notification: within five minutes

Owner notification: within five minutes

Veterinary triage: as soon as required, preferably within ten minutes

Incident record opened: before the sitter ends the service

When vomiting becomes Level 3

Escalate immediately when vomiting is:

Repeated

Associated with blood

Associated with collapse or severe weakness

Accompanied by breathing difficulty

Associated with abdominal swelling or severe pain

Connected to suspected poisoning

Accompanied by abnormal coordination or seizure

Associated with possible heatstroke

Heatstroke signs can include vomiting, drooling, rapid panting, distress, loss of coordination, collapse or unconsciousness. It is an emergency rather than a routine Level 2 issue.

Level 3 — Critical Emergency

Typical situations

Pet lost or escaped

Road accident

Active seizure

Repeated seizures

Seizure lasting approximately five minutes or longer

Bite causing injury

Major bleeding

Collapse or unconsciousness

Serious breathing difficulty

Suspected poisoning

Heatstroke

Severe allergic reaction

Serious fall

Major animal fight

Pet unable to stand

Life-threatening deterioration

Status epilepticus is generally defined as seizure activity lasting more than five minutes or repeated seizures without complete recovery between them. During a seizure, the handler should clear dangerous objects, avoid restraining the animal and keep hands away from the mouth.

Required action

Protect the pet and people from immediate danger.

Call the emergency veterinarian or clinic immediately.

Activate emergency transport where instructed.

Notify the owner and PetSaathi in parallel.

Follow veterinary instructions.

Record the timeline without delaying care.

Preserve relevant evidence.

Open a Level 3 incident record.

Assign an incident manager.

Conduct a formal post-incident review.

Critical rule

The sitter must not wait for the admin to answer before contacting emergency veterinary support when delay may threaten life or safety.

The booking record should already contain:

Owner’s veterinarian

Emergency clinic

Emergency-contact person

Transport preference

Treatment authorisation

Emergency spending limit or decision process

Recommended Emergency-Level Table

### Table 97

| Level | Condition | Primary response |
| --- | --- | --- |
| Level 1 | Stable, mild concern without emergency signs | Observe, document and notify owner |
| Level 2 | Urgent concern requiring owner/admin review or veterinary triage | Stop service, call owner/admin and obtain veterinary advice |
| Level 3 | Immediate threat to life, safety or pet custody | Emergency vet/transport immediately; notify owner and admin in parallel |

Hard escalation triggers

Irrespective of the original level, immediately escalate for:

Breathing difficulty

Collapse

Unconsciousness

Seizure

Pet escape

Serious bite

Uncontrolled bleeding

Traffic accident

Suspected poison

Heatstroke signs

Rapid deterioration

Part 2 — Corrected Emergency Flow

Original weakness

The proposed sequence is entirely serial:

Sitter calls admin → admin calls owner → admin calls vet

This can create unnecessary delay if:

The admin does not answer.

The owner does not answer.

The sitter is already near a veterinary clinic.

The pet has breathing difficulty, heatstroke or seizure.

Emergency transport is immediately available.

Recommended flow

Sitter detects issue

↓

Make scene safe and stop normal service

↓

Assign provisional severity

↓

┌───────────────────────┬────────────────────────┐

│ Level 1 │ Level 2 │

│ Notify owner │ Call admin + owner │

│ Observe and document │ Vet triage if required │

└───────────────────────┴────────────────────────┘

↓

Level 3:

Call emergency vet / activate transport immediately

↓

Notify owner and admin in parallel

↓

Follow veterinary direction

↓

Create or update incident record

↓

Monitor until formal handover

↓

Customer follow-up and post-incident review

Emergency Roles

Sitter

The sitter is responsible for:

Detecting and reporting the issue

Stopping unsafe activity

Providing factual observations

Initiating emergency contact when required

Following veterinary instructions

Remaining with the pet where safe

Recording the immediate timeline

Avoiding diagnosis or unauthorised medicine

Admin or Incident Manager

The admin is responsible for:

Coordinating calls

Confirming owner notification

Locating the approved veterinarian

Arranging transport

Recording authorisations

Updating stakeholders

Maintaining the incident timeline

Assigning follow-up actions

Pet Parent

The pet parent is responsible for:

Providing accurate medical and behavioural information

Maintaining current emergency contacts

Providing veterinarian details

Giving emergency treatment and spending instructions

Responding promptly where possible

Veterinarian

The veterinarian determines:

Whether monitoring is sufficient

Whether the pet requires examination

Immediate first-aid instructions

Transport urgency

Treatment requirements

PetSaathi and its sitters should not present operational judgement as veterinary diagnosis.

Emergency Contact Fallback Order

Every booking should store this order:

Primary pet parent

Secondary pet parent or authorised contact

Regular veterinarian

Emergency veterinary clinic

PetSaathi incident manager

For a Level 3 event, the veterinarian and owner may be contacted simultaneously rather than sequentially.

Part 3 — Incident Report Structure

Your current incident fields are a good minimum, but the production system should capture five categories:

Identification

Event timeline

Observations and evidence

Response and authorisation

Resolution and prevention

A. Incident identification

### Table 98

| Field | Example |
| --- | --- |
| Incident ID | INC-001 |
| Booking ID | BK-020 |
| Pet ID | PET-010 |
| Sitter ID | ST-004 |
| Customer ID | CUS-012 |
| Incident type | Vomiting |
| Severity | Level 2 |
| Current status | Monitoring |
| Service type | Boarding |
| Service phase | After feeding |

B. Timeline fields

Use complete timestamps rather than one general “time” field.

### Table 99

| Field | Purpose |
| --- | --- |
| Occurred at | When the event probably started |
| Detected at | When the sitter first noticed it |
| Reported at | When PetSaathi was informed |
| Owner notified at | Owner-contact timestamp |
| Vet contacted at | Veterinary-contact timestamp |
| Transport started at | Departure for clinic |
| Vet arrival at | Clinic-arrival timestamp |
| Resolved at | Immediate emergency ended |
| Closed at | Investigation formally closed |

This permits calculation of:

Detection-to-report time

Report-to-owner time

Report-to-veterinarian time

Transport time

Total incident duration

C. Observation fields

The sitter should record observations, not diagnoses.

### Table 100

| Field | Example |
| --- | --- |
| Initial observation | Pet vomited after evening meal |
| Number of episodes | 1 |
| Conscious and responsive | Yes |
| Breathing concern | No |
| Bleeding | No |
| Mobility | Normal |
| Behaviour | Quiet but responsive |
| Food provided | Normal approved food |
| Medication provided | None |
| Possible trigger | Unknown |
| Pre-existing condition | None reported |

Use structured boolean or selectable fields for critical warning signs so they can be searched quickly.

D. Evidence

Store:

Photographs

Videos

Live-location reference

Call notes

Vet instructions

Customer messages

Medical invoice

Witness statement

Do not store large media files directly inside ordinary database rows. Store them in private object storage and place only controlled object references and metadata in the database.

E. Notifications

Create a separate notification record for every contact attempt.

### Table 101

| Field | Example |
| --- | --- |
| Contact type | Owner |
| Contact person | Primary owner |
| Method | Phone |
| Attempted at | 7:47 PM |
| Connected | Yes |
| Response | Approved veterinary call |
| Recorded by | Admin-02 |

This is better than one field such as owner_informed = true because it preserves who was contacted, when and what was authorised.

F. Veterinary and transport response

Record:

Veterinarian or clinic contacted

Practitioner registration information where relevant

Triage advice

Clinic visit required

Transport provider

Person accompanying pet

Owner approval

Emergency spending approval

Treatment summary supplied by clinic

Expenses

Reimbursement or payment status

G. Resolution

### Table 102

| Field | Example |
| --- | --- |
| Immediate resolution | Monitored after veterinary advice |
| Pet status | Stable |
| Service continued | No |
| Pet handed to | Owner |
| Refund required | Under review |
| Follow-up due | Next morning |
| Incident owner | Operations Lead |
| Resolution approved by | Safety Admin |

H. Post-incident review

Add:

Root cause

Contributing factors

Policy followed

Policy missed

Preventability

Sitter action

Admin action

Customer-data issue

Training required

Corrective action

Action owner

Completion deadline

Final review date

A useful post-incident review requires concrete corrective actions with an owner, priority and measurable completion state.

Recommended Incident Status Flow

Reported

→ Triaging

→ Active Response

→ Vet Contacted

→ Transporting

→ Monitoring

→ Immediate Issue Resolved

→ Review Pending

→ Corrective Action Open

→ Closed

Severity and status must remain separate.

For example:

Severity: Level 3

Status: Closed

This means the event was serious but has completed review.

Part 4 — Corrected Phase 3 Data Architecture

Main architectural principle

Do not create one large table containing customer, sitter, booking, risk, verification, payment and incident data.

Use:

Normalised relational tables for core business records

Versioned records for changing assessments

History tables for status changes

Private object storage for documents and media

Audit records for sensitive administrative actions

jsonb only for controlled flexible data

PostgreSQL supports primary keys, unique constraints, foreign keys and exclusion constraints that can enforce important integrity rules at the database layer.

1. Identity and Roles

users

Stores the basic authenticated identity.

Suggested fields:

id

email

phone

status

created_at

last_login_at

Do not place every customer and sitter attribute here.

user_roles

Allows one person to hold more than one role.

Fields:

user_id

role

assigned_at

revoked_at

Possible roles:

Customer

Sitter

Admin

Safety Admin

Partner

Trainer

customer_profiles

Stores customer-specific information.

sitter_profiles

Stores sitter-specific information.

A person may be both a customer and sitter without requiring duplicate login accounts.

2. Customer and Pet Ownership

pet_profiles

Suggested fields:

id

name

species

breed

date_of_birth

approximate_weight

sex

neutered_status

photo_asset_id

status

pet_owners

Use a relationship table rather than placing only one customer_id inside the pet.

Fields:

pet_id

customer_id

relationship

is_primary

can_authorize_treatment

can_authorize_spending

This supports families with multiple authorised owners.

pet_emergency_contacts

Fields:

pet_id

contact_name

relationship

phone

priority

can_authorize_treatment

pet_medical_profiles

Store medical details separately because access should be more restricted.

Fields may include:

Conditions

Medications

Allergies

Regular veterinarian

Emergency clinic

Emergency instructions

Last updated date

3. Pet-Risk Architecture

Do not store only one risk_level

A pet’s risk may differ by service.

A dog may be:

Green for home sitting

Yellow for dog walking

Red for group boarding

pet_risk_assessments

Suggested fields:

id

pet_id

service_type_id

overall_level

behaviour_level

medical_level

handling_level

environment_level

boarding_compatibility_level

assessed_by

assessment_source

effective_from

expires_at

status

notes

Every reassessment should create a new version rather than overwriting history.

pet_risk_factors

Examples:

Bite history

Strong pulling

Escape history

Separation anxiety

Seizure history

Food guarding

Medication requirement

Other-pet incompatibility

This permits precise matching instead of relying only on “yellow.”

4. Sitter Architecture

sitter_profiles

Contains:

User ID

Public name

City and locality

Travel radius

Biography

Current status

Experience summary

Public rating summary

sitter_verifications

Use one record per verification check.

Fields:

id

sitter_id

verification_type

status

provider

submitted_at

reviewed_at

reviewed_by

expires_at

evidence_asset_id

rejection_reason

Verification types include:

Identity

Address

Interview

Reference

Background check

Boarding-home assessment

sitter_service_permissions

Suggested fields:

sitter_id

service_type_id

pet_species

maximum_dog_size

maximum_risk_level

status

approved_at

approved_by

expires_at

This is stronger than a basic table saying only “walker = true.”

5. Training Architecture

Do not store all training information in one sitter_training row.

Use:

training_modules

Module identity

Name

Service category

Mandatory status

training_module_versions

Version number

Content reference

Effective date

Passing score

Safety-critical questions

sitter_training_attempts

Sitter

Module version

Started at

Completed at

Score

Attempt number

Critical-question result

Final status

practical_assessments

Assessment type

Assessor

Date

Result

Component scores

Notes

Reassessment requirement

This proves which version of training the sitter actually completed.

6. Availability and Scheduling

sitter_availability_rules

For recurring availability:

Weekday

Start time

End time

Effective dates

Service area

sitter_availability_exceptions

For:

Leave

Temporary unavailability

One-time extra availability

Blocked dates

booking_assignments

Supports primary and backup sitters.

Fields:

booking_id

sitter_id

assignment_role

status

offered_at

accepted_at

customer_approved_at

cancelled_at

Assignment roles:

Primary

Named backup

Replacement

Supervisor

PostgreSQL range types and exclusion constraints can be used to prevent overlapping confirmed assignments for the same sitter.

7. Booking Architecture

bookings

Core fields:

id

customer_id

pet_id

service_type_id

scheduled_start

scheduled_end

service_address_id

price

status

risk_assessment_id

created_at

booking_status_history

Never depend solely on the current status.

Fields:

booking_id

old_status

new_status

changed_at

changed_by

reason

Possible statuses:

Requested

Qualified

Matching

Payment Pending

Confirmed

In Progress

Completed

Customer Cancelled

Sitter Cancelled

No-Show

Incident Hold

Refunded

Closed

booking_instructions

Store structured instructions separately from general notes.

8. Booking Reports

booking_reports

Suggested fields:

Booking ID

Actual start

Actual end

Report submitted at

Mood

Behaviour

Food update

Water update

Pee update

Poop update

Distance

Concern flag

Incident ID

Sitter note

Service-specific optional information may be stored in a validated jsonb field, while frequently queried fields should remain proper columns.

PostgreSQL’s jsonb format is efficient for processing and indexing flexible structured data, but it should not replace relational fields required for integrity and reporting.

9. Incident Architecture

A production incident system should use several tables.

incidents

The main incident record.

incident_events

An append-only timeline:

Incident detected

Admin called

Owner connected

Vet contacted

Transport started

Pet handed over

Incident resolved

incident_notifications

Every call, message and unsuccessful contact attempt.

incident_attachments

Private references to photographs, videos, invoices and documents.

incident_vet_actions

Veterinary clinic, advice and treatment information.

incident_expenses

Transport, veterinary costs, refunds and compensation.

incident_corrective_actions

Action

Owner

Priority

Deadline

Status

Evidence of completion

incident_reviews

Post-incident findings, root causes and final decision.

Do not permit an admin to silently rewrite the historical timeline. Append corrections with author and timestamp.

Audit records should make it possible to determine who changed what and when. Immutable audit-style records are a standard mechanism for preserving this accountability.

10. Payments and Payouts

Separate customer payments from sitter payouts.

payments

Booking ID

Customer amount

Provider

Provider transaction ID

Status

Paid at

Refund status

refunds

Payment ID

Amount

Reason

Initiated at

Completed at

payouts

Sitter ID

Booking ID

Base payout

Bonus

Adjustment

Deduction

Final amount

Status

Paid at

One payment may have one or more refunds, and one booking may produce multiple payout adjustments.

11. Reviews and Scores

reviews

Booking ID

Customer ID

Sitter ID

Rating

Comment

Submitted at

Publication permission

Moderation status

Recommended constraint:

One customer review per completed booking.

sitter_booking_scores

Store booking-level components:

Punctuality

Communication

Handling

Instruction compliance

Report quality

Customer rating contribution

Admin reliability

Safety override

Calculate rolling averages separately rather than overwriting past scores.

12. Partner and Veterinary Tables

partner_organizations

Stores:

Clinic

Groomer

Trainer

Boarding facility

Transport provider

veterinary_practitioners

Stores:

Practitioner name

Clinic

Registration reference

Verification date

Contact details

Emergency availability

service_areas

Defines:

City

Locality

PIN codes

Geographic boundaries

Active or paused status

Part 5 — Recommended Relationship Map

users

├── customer_profiles

├── sitter_profiles

└── user_roles

customer_profiles

└── pet_owners ── pet_profiles

├── pet_medical_profiles

├── pet_emergency_contacts

└── pet_risk_assessments

└── pet_risk_factors

sitter_profiles

├── sitter_verifications

├── sitter_service_permissions

├── sitter_availability_rules

├── sitter_training_attempts

├── practical_assessments

└── sitter_booking_scores

bookings

├── booking_assignments

├── booking_status_history

├── booking_reports

├── payments

├── payouts

├── reviews

└── incidents

├── incident_events

├── incident_notifications

├── incident_attachments

├── incident_vet_actions

├── incident_expenses

└── incident_corrective_actions

Part 6 — Important Database Constraints

Recommended constraints include:

Booking end time must be after start time.

Sitter cannot receive overlapping confirmed bookings.

Review requires a completed booking.

Payout requires an assigned sitter.

Boarding assignment requires a current boarding-home approval.

A suspended sitter cannot accept a booking.

A Level 3 incident cannot be closed without a final review.

A verification badge cannot be public when its record is expired or rejected.

A risk assessment must identify the applicable service.

Primary sitter assignment must be unique per active booking.

Incident timestamps cannot occur before booking creation without an explicit correction record.

Use database constraints for enforceable facts, not only front-end validation. PostgreSQL recommends unique, exclusion and foreign-key constraints for cross-row and cross-table integrity.

Part 7 — Security and Privacy Architecture

The following information requires restricted handling:

Customer addresses

Home access instructions

Emergency contacts

Pet medical information

Sitter identity documents

Boarding-home photographs

Live locations

Incident evidence

Recommended controls

Private object storage

Time-limited signed access links

Role-based access

Separate medical-data permissions

Encryption in transit and at rest

Access logs

Retention and deletion rules

No identity documents in WhatsApp groups

No public media URLs

No production data in developer test environments

Redacted support views

PostgreSQL row-level security can restrict which rows a database role may read or modify. Its documentation also warns that integrity constraints can bypass row-security checks, so policies must be designed and tested carefully.

India’s DPDP Act requires reasonable security safeguards and notification when a personal-data breach occurs. The final DPDP Rules were published in November 2025 with a staged enforcement timeline, so PetSaathi should design consent, access, retention, security and breach processes into the architecture now rather than adding them later.

Final Approval Decisions

### Table 103

| Proposed element | Decision | Correction |
| --- | --- | --- |
| Three emergency levels | Approve with modification | Use red-flag overrides and pet-specific care plans |
| Level 1 mild concerns | Approve | Escalate when medical context increases risk |
| Vomiting automatically Level 2 | Modify | Severity depends on repetition and accompanying symptoms |
| Seizure as Level 3 | Approve | Add seizure-safety instructions and immediate veterinary escalation |
| Serial admin-first flow | Reject | Level 3 requires direct veterinary action with parallel notifications |
| Incident report fields | Approve and expand | Add timeline, notifications, authorisations, vet response and corrective actions |
| Proposed main tables | Approve as foundation | Add history, assignments, contacts, evidence and audit tables |
| One users table for customers/sitters | Modify | Keep shared identity with separate roles and profiles |
| One sitter score table | Modify | Store booking-level scores and calculated rolling summaries |
| One pet risk profile | Modify | Version assessments and make them service-specific |
| Media inside database | Reject | Store private object references and metadata |
| Incident history editable | Reject | Use append-only timeline and auditable corrections |

Final Operating Principle

PetSaathi’s emergency system should classify incidents according to current symptoms, pet history and red-flag conditions. Sitters must stop unsafe activity, record factual observations and escalate without attempting diagnosis. Critical emergencies require immediate veterinary contact and transport action while the owner and admin are notified in parallel. The platform database should preserve the complete booking, risk, communication, veterinary and corrective-action history through normalised, access-controlled and auditable records.

Simple explanation for professor

“PetSaathi will use three emergency levels, but the level will not depend only on one symptom. Mild concerns may be observed and reported, urgent concerns require the owner, admin and veterinarian to be contacted, and critical incidents such as a lost pet, accident, breathing difficulty, seizure or heatstroke require immediate veterinary escalation. A sitter will not wait for the admin when delay could threaten the pet. Every incident will record the exact timeline, observations, calls, veterinary instructions, transport, expenses, resolution and corrective actions. The future database will separate users, sitters, pets, service permissions, training, risks, bookings, assignments, reports, incidents, payments, payouts and reviews. Historical records will not be overwritten, and sensitive identity, medical, location and home information will be protected through restricted access and audit logs.”

PetSaathi Phase 3 — Backend Enums and Admin Dashboard Architecture 🐾

Overall assessment

The proposed backend structure is a strong starting point, but the current enums mix several different concepts:

Recruitment workflow

Operational account status

Verification evidence

Training completion

Service permission

Performance tier

Partner type

Booking-risk decision

These concepts should not be represented by one linear enum.

The four most important corrections are:

### Table 104

| Proposed design | Problem | Correct design |
| --- | --- | --- |
| One sitter-status enum for the entire lifecycle | Application progress and active-account status become mixed | Separate application status from operational status |
| L0–L8 verification ladder | Home assessment, premium status and emergency readiness are independent dimensions | Store individual verification checks and badges |
| Vet/grooming inside service eligibility | Professionals are partners, not sitter-service permissions | Create separate partner types |
| REJECTED inside pet-risk enum | Rejection is a business decision, not a risk level | Separate risk classification from booking decision |

1. Should These Be Database Enums?

Recommended rule

Use native database enums only for values that are unlikely to change.

PostgreSQL enums are suitable for stable sets, but existing enum values cannot be removed or reordered without dropping and recreating the enum type. PostgreSQL supports adding and renaming values, but frequently changing workflows are generally easier to manage through lookup tables or constrained text fields.

Suitable native enums

These may be stable enough for native enums:

assignment_role

risk_colour

verification_result

incident_severity

user_role

Better as lookup tables

These are likely to change as PetSaathi learns:

Sitter application stages

Service types

Training modules

Badge definitions

Verification types

Rejection reasons

Suspension reasons

Partner categories

A lookup table allows PetSaathi to:

Add new states without a database-type migration

Deactivate an obsolete value without deleting historical data

Control display names

Define ordering

Store explanations

Attach permissions

Support multiple languages

Recommended pattern

application_statuses

--------------------

code

display_name

sort_order

is_terminal

is_active

description

Then store:

sitter_applications.status_code

→ application_statuses.code

Foreign keys and check constraints should enforce valid relationships. PostgreSQL supports check, not-null, unique, primary-key, foreign-key and exclusion constraints for this purpose.

2. Corrected Sitter Status Architecture

Problem with the original enum

Your proposed enum is:

APPLIED

SCREENING

INTERVIEW_SCHEDULED

INTERVIEWED

DOCUMENT_PENDING

DOCUMENT_VERIFIED

TRAINING_PENDING

TRAINING_COMPLETED

TRIAL_ACTIVE

APPROVED

PAUSED

REJECTED

REMOVED

This combines three independent processes:

Application progress

Approval decision

Current operational availability

For example, an approved sitter whose identity document expires should not be moved backward from APPROVED to DOCUMENT_PENDING. Instead, the sitter remains historically approved but becomes operationally restricted until reverification is completed.

A. Application-status enum

Use this only for the recruitment and onboarding application.

DRAFT

SUBMITTED

UNDER_REVIEW

PHONE_SCREENING

INTERVIEW_SCHEDULED

INTERVIEW_COMPLETED

VERIFICATION_PENDING

TRAINING_PENDING

PRACTICAL_ASSESSMENT_PENDING

PROBATION_PENDING

PROBATION_ACTIVE

APPROVED

REJECTED

WITHDRAWN

ON_HOLD

Meaning of each status

### Table 105

| Status | Meaning |
| --- | --- |
| DRAFT | Applicant has started but not submitted the form |
| SUBMITTED | Complete application received |
| UNDER_REVIEW | Initial form screening underway |
| PHONE_SCREENING | Basic call is pending or in progress |
| INTERVIEW_SCHEDULED | Video interview has been scheduled |
| INTERVIEW_COMPLETED | Structured interview finished |
| VERIFICATION_PENDING | Required checks remain incomplete |
| TRAINING_PENDING | Required training remains incomplete |
| PRACTICAL_ASSESSMENT_PENDING | Physical or scenario assessment remains |
| PROBATION_PENDING | Candidate is ready for a trial assignment |
| PROBATION_ACTIVE | Probation bookings are underway |
| APPROVED | Onboarding application successfully completed |
| REJECTED | Application was declined |
| WITHDRAWN | Applicant voluntarily stopped the process |
| ON_HOLD | Application is suitable but delayed because of area, capacity or availability |

Important correction

Do not use DOCUMENT_VERIFIED as the entire application status.

A sitter may have:

Identity passed

Address information pending

Reference failed

Background check expired

Home assessment not applicable

Verification must therefore be stored as multiple check records.

B. Operational sitter-status enum

After approval, maintain a separate operational status.

ACTIVE

INACTIVE

PAUSED_BY_SITTER

SUSPENDED

REVERIFICATION_REQUIRED

RETRAINING_REQUIRED

UNDER_INVESTIGATION

REMOVED

### Table 106

| Status | Meaning |
| --- | --- |
| ACTIVE | Eligible to receive approved bookings |
| INACTIVE | Not currently accepting work |
| PAUSED_BY_SITTER | Sitter voluntarily paused availability |
| SUSPENDED | Admin temporarily blocked assignments |
| REVERIFICATION_REQUIRED | A required check expired or must be repeated |
| RETRAINING_REQUIRED | Required refresher or corrective training is incomplete |
| UNDER_INVESTIGATION | Relevant permissions are temporarily restricted during review |
| REMOVED | Provider relationship ended |

Why this separation matters

A sitter may simultaneously be:

Application status: APPROVED

Operational status: REVERIFICATION_REQUIRED

That accurately reflects both historical approval and the current restriction.

C. Availability status

Availability should not be represented by the sitter’s operational status.

Use availability records such as:

AVAILABLE

UNAVAILABLE

TENTATIVE

BOOKED

LEAVE

An active sitter may be unavailable on Tuesday without becoming an inactive provider.

3. Status-Transition Controls

The backend should not allow arbitrary movement between states.

Example valid transitions

SUBMITTED

→ UNDER_REVIEW

→ PHONE_SCREENING

→ INTERVIEW_SCHEDULED

→ INTERVIEW_COMPLETED

→ VERIFICATION_PENDING

→ TRAINING_PENDING

→ PRACTICAL_ASSESSMENT_PENDING

→ PROBATION_ACTIVE

→ APPROVED

Alternative outcomes may include:

UNDER_REVIEW → ON_HOLD

UNDER_REVIEW → REJECTED

INTERVIEW_COMPLETED → REJECTED

VERIFICATION_PENDING → REJECTED

ANY NON-TERMINAL STATUS → WITHDRAWN

Example invalid transitions

Do not allow:

SUBMITTED → APPROVED

REJECTED → ACTIVE

TRAINING_PENDING → INTERVIEW_SCHEDULED

REMOVED → ACTIVE

A previously removed sitter should normally require a new reinstatement-review process rather than a direct status change.

Transition table

allowed_application_transitions

-------------------------------

from_status

to_status

required_role

requires_reason

requires_second_approval

For every status change, create an append-only history record:

sitter_status_history

---------------------

id

sitter_id

status_type

old_status

new_status

changed_by

changed_at

reason_code

notes

The current status may be cached on the main sitter profile for fast dashboard queries, but the history table should remain the audit source.

4. Corrected Verification Architecture

Why the L0–L8 ladder is problematic

Your proposed structure is:

L0_APPLICANT

L1_PHONE_VERIFIED

L2_ID_VERIFIED

L3_INTERVIEWED

L4_TRAINED

L5_BACKGROUND_CHECKED

L6_HOME_VERIFIED

L7_PREMIUM

L8_EMERGENCY_READY

This appears to mean that every sitter moves upward through every level. That is not true operationally.

For example:

A walker does not need a boarding-home assessment.

A home-assessed boarding host may still be new and not premium.

A premium walker may never provide boarding.

Emergency backup availability may expire weekly.

Training and background checks may require different renewal periods.

Correct model

Use three separate structures:

Verification checks

Public trust badges

Performance or capability tiers

A. Verification-type enum

PHONE

EMAIL

IDENTITY

ADDRESS_INFORMATION

VIDEO_INTERVIEW

REFERENCE

BACKGROUND_CHECK

TRAINING

PRACTICAL_WALKING_ASSESSMENT

HOME_SITTING_ASSESSMENT

BOARDING_HOME_ASSESSMENT

EMERGENCY_PROTOCOL_ASSESSMENT

PROFESSIONAL_CREDENTIAL

B. Verification-status enum

NOT_STARTED

NOT_REQUIRED

PENDING_SUBMISSION

SUBMITTED

UNDER_REVIEW

PASSED

FAILED

EXPIRED

REVOKED

C. Verification record

sitter_verification_checks

--------------------------

id

sitter_id

verification_type

status

provider

submitted_at

reviewed_at

reviewed_by

valid_from

expires_at

evidence_asset_id

failure_reason

internal_notes

This structure answers exact questions:

Which check was completed?

Who reviewed it?

When was it completed?

What evidence supports it?

Is it still valid?

Was it revoked?

5. Public Trust Badges

Badges should be generated from valid evidence, not entered manually as decorative labels.

Recommended badge types

IDENTITY_CHECKED

VIDEO_INTERVIEW_COMPLETED

REFERENCE_CHECKED

PET_SAFETY_TRAINED

DOG_WALKING_APPROVED

HOME_SITTING_APPROVED

BOARDING_HOME_ASSESSED

BACKGROUND_CHECK_COMPLETED

PROVEN_SITTER

EMERGENCY_PROTOCOL_TRAINED

Badge record

sitter_badges

-------------

id

sitter_id

badge_type

awarded_at

awarded_by

source_verification_id

expires_at

revoked_at

revocation_reason

is_public

Badge-generation rules

Example:

IDENTITY_CHECKED

requires:

verification_type = IDENTITY

status = PASSED

expires_at > current_date, when expiry applies

Example:

PROVEN_SITTER

requires:

completed_bookings >= 10

average_rating >= 4.5

on_time_rate >= configured threshold

unresolved_serious_incidents = 0

Public profile example

✅ Identity Checked

✅ Video Interview Completed

✅ Pet Safety Training Passed

✅ Approved for Large-Dog Walking

⭐ 4.8/5 from 18 completed bookings

Avoid showing internal labels such as L4 or L7 to customers. Customers need the evidence meaning, not the database code.

6. Corrected Service-Eligibility Architecture

Problem with the original enum

Your proposed values are:

DOG_WALKING

PET_SITTING

PET_BOARDING

CAT_SITTING

SENIOR_PET_CARE

EMERGENCY_BACKUP

GROOMING_PARTNER

VET_PARTNER

These values represent three different things:

Customer services

Dog walking

Pet sitting

Boarding

Cat sitting

Senior-pet care

Operational assignment capability

Emergency backup

External partner types

Grooming partner

Veterinary partner

They should be separated.

A. Service-type catalogue

DOG_WALKING

HOME_PET_SITTING

PET_BOARDING

CAT_HOME_VISIT

SENIOR_PET_CARE

PET_DAYCARE

Prefer a service_types lookup table so new services can be added later without changing a native database enum.

service_types

-------------

id

code

display_name

requires_home_assessment

requires_practical_assessment

risk_category

is_active

B. Service-permission status

PENDING

PROBATION

APPROVED

RESTRICTED

SUSPENDED

EXPIRED

REVOKED

C. Sitter service permission

sitter_service_permissions

--------------------------

id

sitter_id

service_type_id

status

pet_species

maximum_dog_size

maximum_risk_level

maximum_pet_count

service_area_id

approved_at

approved_by

expires_at

restriction_notes

This allows one sitter to be:

Dog walking: APPROVED

Home sitting: PROBATION

Boarding: NOT APPROVED

Large dogs: RESTRICTED

Yellow-risk walks: APPROVED

Red-risk pets: NOT APPROVED

D. Emergency backup capability

Do not treat emergency backup as a customer service.

Use a capability or assignment-role structure.

Assignment-role enum

PRIMARY

NAMED_BACKUP

REPLACEMENT

SUPERVISOR

Backup-capability fields

sitter_backup_capabilities

--------------------------

sitter_id

service_type_id

service_area_id

available_for_urgent_requests

minimum_notice_minutes

active_from

active_until

reliability_approved

A sitter can be emergency-protocol trained but unavailable as a backup on a particular day.

E. Partner types

Use a separate system:

VETERINARY_CLINIC

VETERINARY_PRACTITIONER

GROOMING_BUSINESS

PET_TRAINER

BOARDING_FACILITY

PET_TRANSPORT_PROVIDER

PET_SHOP

These belong in:

partner_organizations

partner_professionals

partner_verifications

partner_service_areas

A veterinarian is not a premium version of a sitter.

7. Corrected Pet-Risk Architecture

Problem with the original enum

Your proposed enum is:

GREEN

YELLOW

RED

REJECTED

REJECTED is not a risk level. It is a decision made after evaluating the risk and available controls.

Recommended risk-level enum

UNASSESSED

GREEN

YELLOW

RED

### Table 107

| Level | Meaning |
| --- | --- |
| UNASSESSED | Required assessment has not been completed |
| GREEN | Routine service controls are sufficient |
| YELLOW | Additional capability or controls are required |
| RED | Manual specialist review is required |

Separate booking-decision enum

ACCEPT_STANDARD

ACCEPT_WITH_CONTROLS

MANUAL_REVIEW

WAITLIST

DECLINE

Example

A pet may have:

Risk level: RED

Booking decision: ACCEPT_WITH_CONTROLS

This may occur when:

An experienced specialist is available.

A veterinarian-approved plan exists.

The service is modified.

The booking is individual rather than group-based.

Another red-risk booking may result in:

Risk level: RED

Booking decision: DECLINE

because PetSaathi lacks a suitable provider.

Risk must be service-specific

Do not keep only one permanent risk level per pet.

Use:

pet_risk_assessments

--------------------

id

pet_id

service_type_id

overall_level

behaviour_level

medical_level

handling_level

environment_level

other_pet_compatibility_level

assessed_by

effective_from

expires_at

status

The same pet may be:

### Table 108

| Service | Risk |
| --- | --- |
| Home sitting | Green |
| Dog walking | Yellow |
| Shared boarding | Red |

8. Recommended Exact Backend Enums

Stable enums

Verification result

NOT_STARTED

NOT_REQUIRED

PENDING_SUBMISSION

SUBMITTED

UNDER_REVIEW

PASSED

FAILED

EXPIRED

REVOKED

Operational status

ACTIVE

INACTIVE

PAUSED_BY_SITTER

SUSPENDED

REVERIFICATION_REQUIRED

RETRAINING_REQUIRED

UNDER_INVESTIGATION

REMOVED

Service-permission status

PENDING

PROBATION

APPROVED

RESTRICTED

SUSPENDED

EXPIRED

REVOKED

Pet-risk level

UNASSESSED

GREEN

YELLOW

RED

Booking-risk decision

ACCEPT_STANDARD

ACCEPT_WITH_CONTROLS

MANUAL_REVIEW

WAITLIST

DECLINE

Assignment role

PRIMARY

NAMED_BACKUP

REPLACEMENT

SUPERVISOR

Interview result

PENDING

PASS

CONDITIONAL_PASS

FAIL

NO_SHOW

RESCHEDULED

Training status

NOT_ASSIGNED

ASSIGNED

IN_PROGRESS

QUIZ_FAILED

QUIZ_PASSED

PRACTICAL_PENDING

COMPLETED

EXPIRED

REFRESHER_REQUIRED

Incident restriction status

NO_RESTRICTION

LIMITED_SERVICES

TEMPORARY_HOLD

SUSPENDED

REMOVED

9. Recommended Core Tables

users

user_roles

sitter_applications

sitter_application_status_history

sitter_profiles

sitter_operational_status_history

verification_types

sitter_verification_checks

sitter_badges

service_types

sitter_service_permissions

sitter_backup_capabilities

training_modules

training_module_versions

sitter_training_attempts

practical_assessments

sitter_availability_rules

sitter_availability_exceptions

booking_assignments

pet_profiles

pet_risk_assessments

pet_risk_factors

sitter_booking_scores

reviews

incidents

incident_events

payouts

payout_adjustments

service_areas

partner_organizations

partner_professionals

admin_audit_log

10. Phase 3 Admin Dashboard Modules

You do not need to build a complete commercial dashboard during Phase 3. However, the information architecture and permission model should be designed now.

Recommended module list

### Table 109

| Module | Main function |
| --- | --- |
| Application Inbox | Review and triage new applications |
| Verification Workbench | Review documents and verification checks |
| Interview Scheduler | Arrange and evaluate phone/video interviews |
| Training and Assessment | Monitor quizzes and practical assessments |
| Service Permission Matrix | Approve exact sitter capabilities |
| Availability and Capacity | Review usable sitter supply |
| Performance Scorecards | Monitor quality and reliability |
| Incident and Safety Centre | Manage incidents and restrictions |
| Payout and Reconciliation | Track provider payments |
| Supply Density Map | Compare sitter coverage by micro-market |
| Audit and Admin History | Review sensitive administrative actions |
| Configuration | Manage thresholds, services and badge rules |

Module 1 — Application Inbox

Purpose

Provide one queue for new and incomplete sitter applications.

Main views

New applications

Incomplete applications

Priority-area applicants

Area mismatch

On hold

Rejected

Withdrawn

Filters

City

Locality

PIN code

Requested service

Availability

Pet experience

Application age

Current stage

Assigned reviewer

Application card

Display:

Applicant name

Locality

Services requested

Relevant experience

Availability

Application age

Missing information

Risk flags

Assigned reviewer

Next required action

Admin actions

Move to phone screening

Request additional information

Place on hold

Restrict boarding eligibility

Reject with reason

Assign reviewer

Schedule follow-up

Required metrics

Applications received

Completion rate

Screening-to-interview conversion

Rejection reasons

Average screening time

Applicants by area

Module 2 — Verification Workbench

Purpose

Review each verification requirement independently.

Queues

Identity pending

Reference pending

Background check pending

Address review pending

Expiring checks

Failed checks

Boarding-home assessment pending

Verification card

Show:

Applicant

Verification type

Status

Submission date

Reviewer

Evidence access

Expiry date

Conflict or mismatch warning

Prior attempts

Admin actions

Pass

Fail

Request resubmission

Mark not required

Set expiry

Revoke

Escalate for senior review

Security requirement

Identity documents, home photographs, addresses and background-check information should not be visible to every operations employee.

PostgreSQL row-level security can restrict which rows a user may view, insert, update or delete according to policies. This can support separate access for verification reviewers, operations personnel, safety staff and finance users.

Because the system processes identity, contact, location and potentially incident information, access should be purpose-limited and logged. India’s DPDP Act governs lawful processing of digital personal data, and the final DPDP Rules, 2025 have staged commencement dates.

Module 3 — Interview Tracker

Purpose

Schedule, conduct and score structured interviews.

Views

Phone calls pending

Video interviews scheduled

Interviews completed

Candidate no-shows

Rescheduling required

Conditional passes

Failed interviews

Interview record

Store:

Interview type

Scheduled time

Interviewer

Attendance

Question set version

Component scores

Red flags

Candidate limitations

Recommended services

Final result

Recording consent status

Important rule

Do not store only:

interviewed = true

Store the interview outcome and evidence.

Useful metrics

Interview attendance rate

Pass rate

Average score

Common failure reason

Time from application to interview

Interviewer completion workload

Module 4 — Training and Assessment Tracker

Purpose

Track training completion at module-version level.

Dashboard views

Training not assigned

Training overdue

Quiz failed

Quiz passed

Practical assessment pending

Refresher required

Training expired

Fully completed

Sitter training record

Display:

Assigned modules

Required modules by service

Module version

Attempts

Quiz score

Safety-critical question result

Practical result

Trainer notes

Expiry date

Refresher deadline

Automation rules

Examples:

When DOG_WALKING permission is requested:

assign Modules 1, 2, 5 and 6

When BOARDING permission is requested:

assign Modules 1, 3, 4, 5 and 6

require home assessment

require controlled trial

Passing training should not automatically activate a service permission. It should make the candidate eligible for final approval.

Module 5 — Service-Eligibility Matrix

Purpose

Show exactly what every sitter may provide.

Recommended matrix

### Table 110

| Sitter | Walking | Home sitting | Boarding | Cat care | Senior care | Large dogs | Yellow risk |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ST-001 | Approved | Probation | Not eligible | Approved | Restricted | Approved | Approved |
| ST-002 | Approved | Approved | Pending home check | Pending | Approved | Restricted | Restricted |

Admin actions

Approve permission

Restrict pet size

Restrict risk level

Set capacity

Add service area

Set expiry

Suspend one service

Require reassessment

Critical rule

Suspending boarding should not automatically suspend dog walking unless the incident affects both permissions.

Module 6 — Sitter Scorecard

Purpose

Measure real booking performance after approval.

Main scorecard

Show:

Completed bookings

Latest-five score

Latest-ten score

Lifetime score

Customer rating and review count

On-time rate

Cancellation rate

No-show count

Report completion

Repeat requests

Incident count

Current grade

Safety override

Views

Premium candidates

Reliable active sitters

Coaching required

Probation

Safety restriction

Inactive

Performance decline

Important design rule

Do not calculate one permanent number and overwrite it.

Store every booking-level score, then calculate:

Recent average

Lifetime average

Service-specific average

Area-specific performance

Trend

Module 7 — Incident and Safety Centre

Purpose

Provide a single operational view for active incidents, investigations and corrective actions.

Priority views

Active Level 3 incidents

Active Level 2 incidents

Owner not yet reached

Veterinarian not yet reached

Investigation pending

Corrective action overdue

Sitter under temporary hold

Repeat incident pattern

Incident card

Show:

Incident ID

Booking

Pet

Sitter

Severity

Current status

Detected time

Owner notification

Vet contact

Pet condition

Incident manager

Restriction applied

Next action

Safety action controls

Activate temporary hold

Suspend selected service

Suspend all assignments

Assign incident manager

Add timeline event

Upload evidence

Record veterinary instruction

Create corrective action

Close after review

A Level 3 incident should not be closable until the required final review and corrective-action decision are recorded.

Module 8 — Payout Tracker

Purpose

Track what PetSaathi owes, has approved and has paid.

Views

Pending service verification

Ready for payout

Payout scheduled

Paid

Failed payout

Disputed

Held because of incident

Bonus pending

Record fields

Booking ID

Sitter

Base payout

Travel support

Emergency premium

Bonus

Deduction

Final amount

Approval

Payment reference

Paid date

Dispute status

Important control

Do not hold all sitter earnings because one booking is disputed. Hold only the affected amount unless a broader lawful restriction applies.

Module 9 — Availability and Capacity Board

Purpose

Answer:

“Which approved sitter can actually take this booking?”

Views

Calendar

Service-area list

Morning capacity

Evening capacity

Weekend availability

Boarding capacity

Emergency backup availability

Uncovered time slots

Required controls

Recurring availability

One-time exceptions

Leave

Travel buffer

Maximum daily bookings

Existing assignments

Service permission

Area restrictions

PostgreSQL range types combined with exclusion constraints can enforce non-overlapping time intervals, such as preventing the same sitter from holding overlapping confirmed assignments.

Module 10 — City and Area Supply Map

Purpose

Show whether PetSaathi has enough reliable sitter supply in each micro-market.

Map layers

Active sitters

Approved walkers

Approved home sitters

Boarding hosts

Emergency backup coverage

Customer demand

Paid bookings

Unserved requests

Incident concentration

Society clusters

Recommended metrics by locality

Approved sitters

Active sitter hours

Demand requests

Completed bookings

Supply-to-demand ratio

Backup coverage

Average travel distance

Average matching time

Cancellation rate

Sitter utilisation

Contribution per booking

Geographic implementation

Store service coordinates using a spatial type and use radius filtering for operational matching.

PostGIS’s ST_DWithin determines whether locations fall within a selected distance and can use a spatial index, making it suitable for queries such as finding approved sitters within two or three kilometres of a booking.

Privacy rule

The admin map should not display exact sitter or customer home addresses to users who do not require them.

Possible display levels:

### Table 111

| Role | Location precision |
| --- | --- |
| Growth analyst | Locality or aggregated grid |
| Recruiter | Locality and approximate radius |
| Operations matcher | Required operational address |
| Public customer | Approximate area only |
| Safety admin | Exact location when incident access is justified |

Module 11 — Audit and Admin History

This is missing from the proposed dashboard and should be mandatory.

Purpose

Record sensitive administrative decisions.

Track:

Who approved a sitter

Who reviewed an identity document

Who changed a service permission

Who suspended or reinstated a sitter

Who accessed incident evidence

Who edited a payout

Who awarded or removed a badge

Who changed a pet-risk assessment

Audit record

admin_audit_log

---------------

id

actor_user_id

action_type

entity_type

entity_id

previous_value

new_value

reason

created_at

ip_or_session_reference

Audit records should not be editable through normal admin screens.

Module 12 — Rules and Configuration

Purpose

Prevent important rules from being hidden inside application code.

Store configurable values such as:

Quiz passing scores

Badge requirements

Premium-sitter thresholds

Document validity periods

Maximum service radius

Late-arrival threshold

No-show escalation rule

Risk-matching limits

Training refresher periods

Boarding capacity defaults

Every configuration change should be versioned.

Example:

policy_configurations

---------------------

policy_code

version

effective_from

value

changed_by

change_reason

This ensures historical decisions can be evaluated using the policy that applied at the time.

11. Phase 3 Dashboard Access Roles

### Table 112

| Role | Main access |
| --- | --- |
| Recruitment Admin | Applications and interview scheduling |
| Verification Reviewer | Restricted verification documents |
| Trainer | Training, quizzes and practical assessments |
| Operations Admin | Permissions, availability and booking assignments |
| Safety Admin | Risk profiles, incidents and restrictions |
| Finance Admin | Payouts and financial adjustments |
| Growth Analyst | Aggregated supply and area metrics |
| Super Admin | Configuration and senior approvals |

Access restrictions

An operations employee matching a dog walker should not automatically see:

Full identity-document copy

Background-check evidence

Bank details

Complete boarding-home photographs

Unrelated incident medical records

A finance employee processing a payout does not need access to a customer’s door code or pet medical history.

Row-level security and database privileges can support restrictions by user, row and operation, but application-level authorisation and audit logging remain necessary as well.

12. Minimum Dashboard to Build During Phase 3

Do not build every visual feature immediately.

Phase 3 operational MVP

Build these first:

Application Inbox

Verification Workbench

Interview Tracker

Training Tracker

Service-Permission Matrix

Availability Board

Scorecard

Incident Log

Audit History

Spreadsheet or Airtable phase

Airtable, Sheets or another controlled no-code system may support the pilot, provided that:

Status fields are standardised.

Sensitive documents are stored separately.

Access is role-restricted.

Status changes are logged.

Record IDs are stable.

Historical records are not overwritten.

The data can later be migrated.

Build later

These may wait until the workflow is validated:

Advanced interactive supply map

Automated scoring engine

Automatic badge awarding

Predictive demand forecasting

Algorithmic sitter ranking

Fully automated verification provider integrations

Recommended Final Architecture

Sitter application

↓

Application-status workflow

↓

Individual verification checks

↓

Training attempts and practical assessments

↓

Service-specific permissions

↓

Probation bookings

↓

Operational sitter status

↓

Booking-level scores and incidents

↓

Evidence-based public badges

↓

Continuous reverification and monitoring

Final Approval Decisions

### Table 113

| Proposed item | Decision | Required correction |
| --- | --- | --- |
| Sitter-status enum | Approve with restructuring | Separate application and operational statuses |
| DOCUMENT_VERIFIED status | Replace | Store separate verification checks |
| L0–L8 verification ladder | Reject as one linear enum | Use verification types, statuses and badges |
| L7_PREMIUM | Move | Performance tier, not verification level |
| L8_EMERGENCY_READY | Move | Training/capability and current availability |
| Service eligibility enum | Approve partly | Keep customer services only |
| EMERGENCY_BACKUP service | Move | Backup capability or assignment role |
| GROOMING_PARTNER and VET_PARTNER | Move | Separate partner architecture |
| Green/yellow/red risk | Approve | Add UNASSESSED |
| REJECTED risk | Remove | Use a separate booking-decision enum |
| Proposed dashboard modules | Approve and expand | Add audit, access control and configuration |
| Supply-density map | Approve | Use aggregated views and spatial-radius queries |
| Full dashboard during Phase 3 | Not necessary | Build operational modules first |

Final Backend Principle

Application progress, verification evidence, training, service permission, operating status, performance tier and availability are separate dimensions. PetSaathi should never reduce them to one “sitter level.” Every approval should be supported by a specific record, every status change should be auditable, and every service permission should state exactly which pets, risks, areas and services the sitter may handle.

Simple Explanation for Professor

“PetSaathi’s future backend should not use one enum to represent the entire sitter journey. I will separate application status, operational status, verification checks, training completion, service eligibility, public badges and performance levels. Identity verification, interviews, training, background checks and boarding-home assessments will each have their own records and expiry dates. Premium status will depend on actual booking performance rather than verification level. Emergency backup will be treated as an operational capability, while veterinarians and groomers will be managed as external partners. Pet risk will use green, yellow and red classifications, but acceptance or rejection will be recorded as a separate booking decision. The Phase 3 admin dashboard will manage applications, verification, interviews, training, service permissions, availability, sitter performance, incidents, payouts and geographical supply. Sensitive information will be restricted according to staff role, and every important administrative action will be recorded in an audit history.”

PetSaathi Phase 3 — Week 1 Execution Plan: Sitter Pipeline Setup 🐾

Core goal of Week 1

The goal of Week 1 is to create the complete sitter onboarding system before recruiting or approving sitters at scale.

This week is not mainly about onboarding hundreds of sitters. It is about building the operating framework that will later decide:

Who can apply, who gets rejected, who gets verified, who gets trained, who receives badges, who gets approved, and who must be paused.

Established pet-care platforms also separate profile review, background checks, badges and approval. Rover states that sitter profiles are manually reviewed against quality standards, and its badges distinguish specific checks such as background check completion and training quiz completion. PetSaathi should follow the same principle: every trust claim must be connected to a specific completed step.

Correct meaning of “Week 1 complete”

By the end of Week 1, PetSaathi should have a ready-to-use sitter onboarding operating system, not merely a few notes.

The final Week 1 output should include:

Sitter approval and rejection criteria

Sitter application form

CRM or Airtable/Sheet structure

Phone interview script

Video interview scorecard

Verification and badge framework

Training module outline

Quiz structure

Sitter scorecard

Approval workflow

Rejection, pause and suspension rules

Admin checklist for every sitter stage

Important correction

Your Week 1 target table says:

### Table 114

| Metric | Target |
| --- | --- |
| Application form ready | Yes |
| CRM ready | Yes |
| Interview script ready | Yes |
| Training outline ready | Yes |
| Scorecard ready | Yes |

This is correct, but it is incomplete.

Add these two targets:

### Table 115

| Additional metric | Target |
| --- | --- |
| Verification and badge rules ready | Yes |
| Approval/rejection workflow ready | Yes |

Without these, PetSaathi may collect applications but still approve sitters inconsistently.

Week 1 Overview

### Table 116

| Day | Focus | Main output |
| --- | --- | --- |
| Day 1 | Sitter criteria | Approval, rejection and service-scope rules |
| Day 2 | Forms and CRM | Sitter application form and tracking system |
| Day 3 | Interview script | Phone and video interview process |
| Day 4 | Verification levels | Badge and verification framework |
| Day 5 | Training content outline | Module list, quiz structure and emergency training plan |
| Day 6 | Sitter scorecard | Performance scoring and reliability system |
| Day 7 | Final review | Complete onboarding workflow |

Day 1 — Sitter Criteria

Goal

Create clear rules for who can proceed, who should be paused, who should be rejected and which services each sitter may eventually provide.

Why this matters

PetSaathi should not approve people only because they like animals.

The correct standard is:

A sitter must be screened, verified, trained, service-scoped, risk-matched and performance-tracked.

Day 1 tasks

Create criteria for:

Minimum eligibility

Service-specific approval

Rejection reasons

Pause reasons

Boarding-specific restrictions

Emergency-backup requirements

Premium sitter requirements

Minimum eligibility criteria

A sitter should normally be required to have:

Valid contact number

WhatsApp access

Active service-area availability

Willingness to attend interview

Willingness to provide identity proof

Willingness to complete training

Basic communication reliability

Agreement to PetSaathi safety rules

Agreement to no off-platform payment

Agreement to incident reporting

Because PetSaathi will process identity, contact and possibly home-verification data, the application system should collect only necessary information, provide a clear purpose and restrict access to sensitive documents. India’s DPDP Act provides the core legal framework for digital personal-data processing.

Service-specific criteria

### Table 117

| Service | Minimum criteria |
| --- | --- |
| Dog walking | ID readiness, interview, walking training, leash-handling assessment |
| Home pet sitting | ID readiness, interview, privacy training, home-entry rules |
| Cat sitting | Cat-handling experience and escape-prevention awareness |
| Senior pet care | Advanced experience and emergency-escalation awareness |
| Boarding host | Person checks plus separate home verification |
| Emergency backup | High reliability, current availability and emergency training |
| Premium sitter | Proven completed bookings, strong rating and no unresolved serious incident |

Rejection or pause reasons

### Table 118

| Issue | Decision |
| --- | --- |
| Outside current service area | Waitlist or hold |
| No useful availability | Hold |
| Refuses identity verification | Reject for now |
| Refuses safety rules | Reject |
| Wants boarding but refuses home assessment | Reject for boarding only |
| Unrealistic payout expectation | Hold or reject after discussion |
| Poor reliability during screening | Hold or reject |
| Unsafe pet-handling attitude | Reject |
| Willing to hide incidents | Reject |
| Wants to send substitute person | Reject |

Day 1 output

A written Sitter Eligibility and Rejection Policy.

Acceptance criteria

Day 1 is complete only when PetSaathi can answer:

Who may apply?

Who may proceed to interview?

Who must be rejected?

Who can be approved for walking?

Who can be approved for home sitting?

Who can be approved for boarding?

Who can become an emergency backup?

Which safety issues override all other scores?

Day 2 — Forms and CRM

Goal

Create the sitter application form and the CRM structure that will track every applicant from application to approval.

Why this matters

A WhatsApp-based onboarding process without CRM tracking will become messy very quickly.

The CRM should become the future admin dashboard blueprint.

Sitter application form sections

The form should contain:

Personal details

Full name

Phone number

WhatsApp number

Email

City

Area/locality

PIN code

Age eligibility confirmation

Gender, preferably optional

Occupation or current commitment

Availability

Available days

Available time slots

Weekend availability

Repeat-booking availability

Travel radius

Mode of transport

Pet experience

Pet-care experience

Own pet status

Dog/cat experience

Large-dog comfort

Anxious-pet comfort

Senior-pet experience

Medication experience, if any

Service interest

Dog walking

Home pet sitting

Cat sitting

Senior pet care

Boarding

Emergency backup

Verification readiness

Can provide ID proof

Can attend video interview

Can complete training

Can share references

Can attend practical assessment

Boarding-only fields

Can share home photos

Can attend home video walkthrough

Existing pets at home

Family consent

Balcony/gate/window safety

Emergency vet nearby

Transport availability

Consent and declarations

Use separate checkboxes for:

Accuracy of information

Verification acknowledgement

Training agreement

Privacy notice acknowledgement

Profile-publication consent

Optional marketing-media consent

CRM tables for Week 1

At minimum, create these sheets or Airtable tables:

### Table 119

| Table | Purpose |
| --- | --- |
| Sitter Applications | Raw applicant data |
| Sitter Profiles | Approved or shortlisted sitter profiles |
| Verification Checks | ID, interview, reference, background, home checks |
| Training Tracker | Module and quiz completion |
| Service Permissions | What each sitter is allowed to do |
| Availability | Day/time/location capacity |
| Sitter Scorecard | Performance after bookings |
| Incidents | Complaints, safety issues and emergency records |
| Status History | Every stage change |
| Admin Notes | Internal screening notes |

Day 2 output

A working application form and CRM tracker.

Acceptance criteria

Day 2 is complete only when:

A test sitter can submit the form.

The form creates a CRM record.

The CRM has standard statuses.

Sensitive document collection is not happening casually through WhatsApp.

Every applicant has a unique sitter application ID.

The admin can see the applicant’s current stage.

Day 3 — Interview Script

Goal

Create standard phone and video interview processes.

Why this matters

Without a standard script, different applicants will be judged differently.

The interview should test:

Motivation

Real pet experience

Safety judgement

Reliability

Communication

Privacy awareness

Service suitability

PetBacker advises pet parents to speak directly with sitters to understand experience, knowledge and suitability before hiring. PetSaathi should make that principle internal and structured instead of informal.

Phone interview structure

The phone call should last around 10–15 minutes.

Questions

Ask:

Why do you want to become a pet sitter?

What pets have you handled before?

Have you handled large dogs?

Have you handled anxious or reactive pets?

What would you do if a dog pulls strongly on the leash?

What would you do if a pet vomits?

Are you comfortable sending updates and photos?

Can you be punctual for morning/evening slots?

Are you available for repeat bookings?

Can you follow owner instructions strictly?

What would you do if a pet escaped?

What would you do if you could not attend a confirmed booking?

Would you ever send another person in your place?

How would you protect a customer’s key or access code?

Video interview structure

The video interview should last around 20–30 minutes.

### Table 120

| Check | What to observe |
| --- | --- |
| Communication | Clear, polite, responsible |
| Confidence | Calm but not overconfident |
| Safety awareness | Understands risk and escalation |
| Availability | Realistic schedule |
| Professionalism | Can represent PetSaathi |
| Trust evidence | Consistent answers and willingness to verify |
| Service fit | Suitable for walking, sitting or boarding |

Video interview scorecard

### Table 121

| Factor | Score |
| --- | --- |
| Pet-care experience | 15 |
| Safety judgement | 25 |
| Reliability and availability | 15 |
| Communication | 15 |
| Service-specific suitability | 10 |
| Privacy and professionalism | 10 |
| Verification readiness | 10 |
| Total | 100 |

Decision thresholds

### Table 122

| Score | Decision |
| --- | --- |
| 75–100 | Proceed to verification and training |
| 60–74 | Conditional progress |
| 40–59 | Hold or restrict service |
| Below 40 | Reject for now |

A serious safety red flag should override the score.

Day 3 output

A complete phone script, video script and interview scorecard.

Day 4 — Verification Levels and Badge Framework

Goal

Define what each sitter badge means and what evidence is required.

Why this matters

PetSaathi should avoid vague claims like:

“Fully verified sitter.”

Instead, use evidence-specific badges.

Rover’s badge model separates background-check completion from training quiz completion, which shows why each trust signal should have a precise meaning.

Recommended badges

### Table 123

| Badge | Requirement | Customer-visible? |
| --- | --- | --- |
| Phone Confirmed | Phone/WhatsApp confirmed | No |
| Identity Checked | Government ID reviewed | Yes |
| Video Interview Completed | Structured interview completed | Yes |
| Pet Safety Training Passed | Training and quiz passed | Yes |
| Dog Walking Approved | Walking assessment passed | Yes |
| Home Sitting Approved | Sitting process approved | Yes |
| Boarding Home Assessed | Home walkthrough and checklist passed | Yes |
| Background Check Completed | Actual check completed where available | Yes |
| Proven Sitter | 10+ successful bookings and strong score | Yes |
| Emergency Protocol Trained | Emergency module and simulation passed | Yes |

Important correction

Do not use one simple ladder such as:

L0 → L1 → L2 → L3 → L4 → L5 → L6 → L7 → L8

because a sitter may be:

Trained for walking

Not approved for boarding

Premium for walking

Not emergency-backup available

So the backend should store:

Verification checks

Badges

Service permissions

Performance tier

Operational status

as separate records.

Day 4 output

A written Verification and Trust Badge Policy.

Acceptance criteria

Day 4 is complete only when:

Every badge has a definition.

Every badge has evidence requirements.

Every badge has an approval owner.

Public and internal badges are separated.

Expiry or recheck rules are defined where needed.

Day 5 — Training Content Outline

Goal

Create the training curriculum before onboarding sitters.

Training duration

Each module should be 5–15 minutes, followed by a quiz or assessment.

Recommended modules

### Table 124

| Module | Required for | Duration |
| --- | --- | --- |
| Pet-care basics | All sitters | 10 min |
| Dog-walking safety | Walkers | 15 min |
| Pet-sitting safety | Home sitters | 12 min |
| Boarding safety | Boarding hosts | 15 min |
| Emergency handling | All sitters | 15 min |
| Customer communication | All sitters | 10 min |

Module 1 — Pet-care basics

Topics:

Pet-parent expectations

Punctuality

Hygiene

Following instructions

No unauthorised feeding

No off-leash walking

No route change without permission

Module 2 — Dog-walking safety

Topics:

Leash handling

Road crossing

Avoiding street dogs

Avoiding crowded areas

Water breaks

Poop cleanup

Live location

Start/end proof

Module 3 — Pet-sitting safety

Topics:

Entering owner’s home

Privacy

Food and water instructions

Play/rest balance

Medication only if approved

Photos/videos

Exit confirmation

Module 4 — Boarding safety

Topics:

Home preparation

Pet introduction

Feeding schedule

Sleeping arrangement

Separation anxiety

Avoiding pet fights

Emergency escalation

Module 5 — Emergency handling

Topics:

Vomiting

Injury

Lost pet

Bite incident

Aggression

Breathing issue

Heatstroke

Accident during walk

Urgent vet contact

Pet first aid should be treated as temporary assistance and should not replace veterinary care. The AVMA advises preparation for emergencies and veterinary contact when urgent care is needed.

Module 6 — Customer communication

Topics:

Polite messaging

Update format

When to call admin

What not to say

Complaint handling

Report-card quality

Day 5 output

A complete training module outline and quiz plan.

Acceptance criteria

Day 5 is complete only when:

Each module has a title.

Each module has a duration.

Each module has learning objectives.

Each module has quiz questions.

Safety-critical questions are identified.

Practical assessments are defined for walking, sitting and boarding.

Day 6 — Sitter Scorecard

Goal

Create the performance system that will track sitter quality after bookings begin.

Recommended scorecard

### Table 125

| Factor | Score |
| --- | --- |
| Safety and pet handling | 25 |
| On-time arrival | 15 |
| Communication | 15 |
| Instruction compliance | 15 |
| Update/report quality | 10 |
| Customer rating | 15 |
| Reliability and cancellation record | 5 |
| Total | 100 |

Score interpretation

### Table 126

| Score | Grade | Action |
| --- | --- | --- |
| 90–100 | A+ | Premium review eligibility |
| 80–89 | A | More suitable bookings |
| 70–79 | B | Active but monitor |
| 60–69 | C | Coaching or retraining |
| Below 60 | D | Pause and formal review |

Safety override

The scorecard must not allow a serious safety issue to be hidden by a good average score.

Immediately pause or investigate when there is:

Pet escape hidden by sitter

Bite or injury not reported

Unsafe handling

Unauthorised substitute

Off-platform payment attempt

Customer-data misuse

Boarding outside approval

Serious customer complaint

No-show without valid reason

Day 6 output

A complete Sitter Performance Scorecard.

Acceptance criteria

Day 6 is complete only when:

Each factor has a score definition.

Grade rules are clear.

Retraining triggers are clear.

Pause triggers are clear.

Safety override is written.

Rolling average logic is defined.

Scorecard is linked to booking records.

Day 7 — Final Onboarding Workflow Review

Goal

Connect all Week 1 materials into one complete onboarding workflow.

Final workflow

Application submitted

↓

Form screening

↓

Phone screening

↓

Video interview

↓

Verification checks

↓

Service eligibility decision

↓

Training assigned

↓

Quiz completed

↓

Practical assessment

↓

Trial/probation booking

↓

Score review

↓

Final approval

↓

Ongoing monitoring

Day 7 checklist

Review whether the system answers:

### Table 127

| Question | Must be clear? |
| --- | --- |
| Who can apply? | Yes |
| Who gets rejected? | Yes |
| Who gets paused? | Yes |
| Who can walk dogs? | Yes |
| Who can enter customer homes? | Yes |
| Who can board pets? | Yes |
| Which badges are public? | Yes |
| Which training modules are mandatory? | Yes |
| How is performance scored? | Yes |
| When is a sitter paused? | Yes |
| Who approves final onboarding? | Yes |
| Where is every decision recorded? | Yes |

Day 7 output

A final document called:

PetSaathi Sitter Onboarding SOP — Version 1

Corrected Week 1 Target Table

### Table 128

| Metric | Target | Definition of ready |
| --- | --- | --- |
| Application form ready | Yes | Test application can be submitted and recorded |
| CRM ready | Yes | Every sitter stage can be tracked |
| Interview script ready | Yes | Phone and video scripts are standardised |
| Training outline ready | Yes | Modules, quizzes and assessments are mapped |
| Scorecard ready | Yes | Performance score and pause rules are defined |
| Verification framework ready | Yes | Badge rules and evidence requirements are written |
| Approval workflow ready | Yes | Final onboarding sequence is documented |

Week 1 final deliverables

By the end of Week 1, PetSaathi should have:

Sitter criteria document

Application form

CRM/Airtable/Sheet structure

Phone interview script

Video interview scorecard

Verification and badge framework

Training module outline

Quiz structure

Sitter scorecard

Pause/rejection rules

Final onboarding SOP

Common Week 1 mistakes to avoid

Mistake 1 — Building only the form

A form without screening rules only collects data. It does not create a trust system.

Mistake 2 — Calling every applicant “verified”

Identity checked, interviewed, trained and background checked are different claims.

Mistake 3 — Mixing walking, sitting and boarding

A sitter approved for walking should not automatically be approved for boarding.

Mistake 4 — Forgetting privacy

Identity documents, addresses, boarding-home photos and incident records should not be stored casually in open WhatsApp groups or unrestricted sheets.

Mistake 5 — Ignoring rejection rules

A strong onboarding system must define both approval and rejection.

Mistake 6 — Treating training as only videos

Training should include quizzes, scenario checks and practical assessment.

Final Week 1 decision rule

Week 1 is successful when PetSaathi can confidently say:

“We have a complete sitter onboarding system. Every applicant can now move through a defined pipeline from application to screening, interview, verification, training, assessment, approval and ongoing monitoring.”

It is not necessary to approve many sitters in Week 1. The main output is the system that will safely approve sitters in Weeks 2–4.

Simple explanation for professor

“During Week 1 of Phase 3, I will create PetSaathi’s complete sitter onboarding system. On Day 1, I will define who can apply, who must be rejected and which services require special approval. On Day 2, I will create the application form and CRM tracker. On Day 3, I will prepare the phone and video interview scripts. On Day 4, I will define verification badges such as identity checked, video interviewed, safety trained and boarding-home assessed. On Day 5, I will prepare the training module outline. On Day 6, I will create the sitter scorecard and reliability rules. On Day 7, I will combine everything into one onboarding SOP. The target for Week 1 is not to onboard many sitters, but to build the complete system that will allow PetSaathi to onboard sitters safely and consistently.”PetSaathi Phase 3 — Week 2: Sitter Recruitment 🐾

Core goal

Week 2 should create a large but relevant sitter pipeline for the city and micro-markets selected during Phase 2.

The objective is not merely:

“Collect 100 names.”

The correct objective is:

Generate at least 100 complete, non-duplicate sitter applications; identify approximately 40–50 applicants suitable for serious screening; and prepare the strongest candidates for interviews, verification and training.

Established pet-care platforms do not publish a profile immediately after a person expresses interest. Rover’s onboarding separates service selection, availability, pet preferences, profile information, a safety quiz, identity/background checks and manual profile review. PetBacker similarly separates service registration from identity-document verification. PetSaathi should therefore treat recruitment as the start of onboarding, not approval.

1. Important target correction

There is a mismatch between these two statements:

Goal: Shortlist 40–50 applicants

Week 2 table: Shortlist 30–40 applicants

The solution is to define two different shortlist stages.

Initial shortlist

Applicants who pass:

Application completeness

Area suitability

Availability review

Minimum experience review

Identity-verification willingness

Initial phone screening

Target: 40–50 applicants

Final training shortlist

Applicants who also pass:

Video interview

Safety-scenario questions

Verification-readiness review

Service-eligibility decision

Target: approximately 25–35 applicants

This structure is consistent with the later Phase 3 target of approving approximately 20–30 sitters.

Corrected Week 2 recruitment funnel

### Table 129

| Funnel stage | Recommended target | Definition |
| --- | --- | --- |
| Raw applications | 110–130 | All form submissions received |
| Valid applications | 100+ | Complete, unique and relevant applications |
| Form-eligible applicants | 60–70 | Meet area, availability and minimum criteria |
| Phone screened | 60 | Actual completed screening calls |
| Initial shortlist | 40–50 | Suitable for structured video interview |
| Video interviews scheduled | 40–45 | Confirmed interview slots |
| Video interviews completed | 30–40 | Interview actually attended |
| Final training shortlist | 25–35 | Eligible for checks and training |
| Immediate rejection | Track | Serious mismatch or safety concern |
| Hold/waitlist | Track | Suitable later but not currently usable |

Why raw and valid applications must be separated

An application should not count toward the target when it is:

A duplicate

Empty or substantially incomplete

From outside all planned service locations

Submitted as a joke or test

Missing permission to be contacted

Clearly unrelated to pet care

Generated by automated spam

The Week 2 headline should therefore say:

100 valid applications, not merely 100 form submissions.

2. Daily recruitment schedule

### Table 130

| Time | Main activity |
| --- | --- |
| 09:00–10:00 | Publish sitter-recruitment content |
| 10:00–11:30 | Contact colleges, communities and pet groups |
| 11:30–12:30 | Review and classify applications |
| 12:30–13:30 | Lunch |
| 13:30–15:30 | Conduct applicant phone screens |
| 15:30–16:30 | Update CRM and follow-up actions |
| 16:30–18:00 | Schedule video interviews |

The schedule should operate for each active recruitment day, but the exact volume should change according to the size of the backlog.

09:00–10:00 — Publish recruitment content

Purpose

Use the first hour to generate new applicants and keep the recruitment campaign visible.

Activities

During this time, the recruitment team should:

Publish one recruitment post or short video.

Share area-specific openings.

Respond to comments and questions.

Repost approved candidate or pet-care content.

Update links and application deadlines.

Review the previous day’s channel performance.

Stop or modify posts generating irrelevant applications.

Meta supports lead ads with instant forms across Instagram and Facebook, and the forms can collect and qualify candidate information. PetSaathi can therefore use either its own application form or a Meta form that passes the applicant into the CRM.

Recommended content themes

Rotate several messages rather than posting the same advertisement daily:

### Table 131

| Content theme | Example purpose |
| --- | --- |
| Flexible pet-care work | Generate initial interest |
| What a PetSaathi sitter does | Set realistic expectations |
| Sitter safety standards | Filter casual applicants |
| Area-specific requirement | Improve locality fit |
| Walking versus home sitting | Clarify service categories |
| Training opportunity | Attract applicants willing to learn |
| Boarding-host requirements | Filter unsuitable homes |
| Application deadline | Create urgency |

Output

New applicant traffic

Application clicks

Completed applications

Source data for each candidate

Recommended recruitment post

Become a PetSaathi Pet-Care Provider 🐾

We are recruiting responsible pet-care providers in [area/city] for:

Dog walking

Home pet sitting

Cat home visits

Controlled home boarding

Emergency backup care

Applicants must be willing to complete a structured interview, identity checks, safety training and a service-specific assessment.

Loving animals is important, but reliability, punctuality and safety are essential.

Location: [Areas]Typical slots: [Morning/evening/weekend]Indicative payout: [Transparent range]Apply: [Form link]

Submitting the application does not guarantee approval.

Do not advertise every position as “premium” or “verified” before screening has occurred.

10:00–11:30 — Contact colleges, pet groups and local communities

Purpose

This block is for active recruitment rather than waiting for applicants to discover PetSaathi.

Daily activity target

The team could aim to contact:

Three to five colleges or student groups

Two to three pet-parent or animal-welfare communities

Two apartment or neighbourhood groups

Two pet-industry contacts

Previous referrals requiring follow-up

The exact volume is an internal experiment, not an industry benchmark.

Information to send

Each organisation should receive:

Brief introduction to PetSaathi

Roles being recruited

Service areas

Time requirements

Indicative payout

Screening and training explanation

Application link

Contact person

Deadline

Request for permission before repeated follow-ups

WhatsApp outreach rule

PetSaathi should not scrape telephone numbers or repeatedly message community members who did not expect recruitment messages. Current WhatsApp business guidance emphasises that recipients should understand the business sending the communication, expect the message category and be able to stop further messaging; businesses must also comply with applicable local notice and consent rules.

Output

A recruitment outreach log recording:

Organisation contacted

Contact person

Channel

Date

Message sent

Permission status

Response

Applications generated

Next follow-up

11:30–12:30 — Review applications

Purpose

Classify new applications before phone calls begin.

Application review checklist

Review:

### Table 132

| Area | Question |
| --- | --- |
| Completeness | Has the applicant provided the required information? |
| Location | Is the applicant within or near an active micro-market? |
| Availability | Do the available hours match customer demand? |
| Service interest | Which services does the person want to offer? |
| Experience | Has the applicant described specific pet-care experience? |
| Communication | Are answers understandable and consistent? |
| Verification | Will the person complete identity checks and interviews? |
| Safety attitude | Does the applicant accept fundamental safety rules? |
| Payout fit | Is the expected payout within a testable range? |
| Boarding eligibility | Will the applicant complete a separate home assessment? |

Application outcome

Assign one of the following:

Proceed to phone screen

Information required

Area waitlist

Availability hold

Service restricted

Payout mismatch

Reject

Duplicate

Spam

Important distinction

Do not reject potentially capable applicants merely because they:

Have limited English fluency

Do not use polished grammar

Are from a particular occupation

Are not currently pet owners

Cannot provide home boarding

Assess communication ability and service suitability objectively.

Output

A clean phone-screening queue for the afternoon.

13:30–15:30 — Call interested applicants

Purpose

Confirm that the applicant is genuine, available and appropriate for a video interview.

Call capacity

A 10–15-minute call plus note-taking generally permits approximately:

Six to eight complete calls in two hours

Fewer calls when applicants require clarification

More attempts when many calls are unanswered

Do not count unanswered calls as completed phone screens.

Phone-screen questions

Ask:

Why are you interested in pet-care work?

Which locality do you live in?

Which areas can you reach reliably?

Which days and times are you consistently available?

Which pets have you personally handled?

Have you cared for someone else’s pet?

Which services do you want to provide?

What dog sizes can you safely handle?

What would you do if a dog pulled strongly?

What would you do if a pet vomited?

What would you do if you could not attend a booking?

Would you send another person in your place?

Are you willing to complete verification and training?

What payout do you expect for the selected service?

Are you available for repeat bookings?

Phone-screen result

Use:

### Table 133

| Result | Action |
| --- | --- |
| Pass | Invite to video interview |
| Conditional pass | Request information or restrict services |
| Hold | Suitable but no current demand/availability |
| Fail | Record factual reason |
| Unreachable | Make limited follow-up attempts |
| Withdrawn | Close the application |

Output

Completed screening notes and an initial shortlist.

15:30–16:30 — Update the CRM

Purpose

Make the CRM the system of record.

A candidate should not be considered screened merely because a call happened. The result must be recorded.

Required updates

For each applicant, update:

Application ID

Recruitment source

Source campaign

Current status

Phone-screen date

Reviewer

Call outcome

Area suitability

Service suitability

Availability

Experience summary

Payout expectation

Safety concerns

Missing information

Video-interview decision

Next action

Follow-up date

Daily quality checks

The team should also:

Merge duplicates.

Correct invalid contact details.

Close withdrawn applications.

Review overdue follow-ups.

Check that interview slots do not overlap.

Review channel conversion.

Restrict sensitive applicant information.

India’s final Digital Personal Data Protection Rules were published in November 2025 with staged commencement provisions. PetSaathi should nevertheless design recruitment around necessary collection, clear purpose, limited retention, restricted access and reasonable security rather than storing applicant IDs or home information across unrestricted chats and spreadsheets.

Output

An accurate recruitment dashboard with no unrecorded applicant decisions.

16:30–18:00 — Schedule video interviews

Purpose

Convert phone-qualified applicants into confirmed interview appointments.

Scheduling process

Offer two or three time options.

Record the candidate’s selected slot.

Send the interview link.

Explain the approximate duration.

Explain what will be assessed.

Tell the candidate what information to prepare.

Send a reminder before the interview.

Record cancellations and no-shows.

Reschedule only according to the defined policy.

Interview invitation template

Hi [Name], thank you for completing the PetSaathi phone screening. 🐾

We would like to invite you to a structured video interview for the [service category] role.

Date: [Date]Time: [Time]Expected duration: 20–30 minutesLink: [Meeting link]

The discussion will cover your pet-care experience, availability, safety judgement, communication and service preferences.

This interview is one stage of the onboarding process and does not guarantee final approval. Please confirm your attendance by [deadline].

Output

A confirmed interview calendar and reminder queue.

3. Recruitment-channel analysis

The “best for” descriptions in the original plan should be treated as hypotheses to test, not fixed truths.

For example:

Instagram does not automatically produce responsible students.

A veterinary student is not automatically a premium sitter.

A pet-shop employee is not automatically trained in home sitting.

A pet parent is not automatically suitable for boarding.

A homemaker is not automatically available or reliable.

Evaluate candidates individually.

Channel 1 — Instagram

Potential value

Instagram may help PetSaathi reach:

Students

Young professionals

Existing pet-content audiences

Part-time workers

People interested in flexible work

Meta’s lead-generation tools can run across Instagram and Facebook and collect candidate information through instant forms.

Recommended tactics

Use:

Reels explaining sitter responsibilities

Locality-specific posts

“Day in the life” content

Payout examples with clear conditions

Training-process content

Stories with the application link

Lead forms containing preliminary qualification questions

Risk

Attractive “earn while playing with pets” content may generate many casual applicants.

Correction

The message should include:

“This is safety-sensitive paid work requiring punctuality, screening, training and service reporting.”

Metrics

Track:

Application cost

Completion rate

Locality fit

Phone-screen pass rate

Interview attendance

Final approval rate

Channel 2 — WhatsApp groups

Potential value

WhatsApp groups may provide highly local referrals through:

Apartment groups

Resident pet groups

College groups

Animal-welfare groups

Existing customer communities

Recommended method

Ask the administrator to share one approved message rather than entering the group and repeatedly messaging members.

Applicants should contact PetSaathi or open the application form voluntarily.

Risk

Spam complaints

Duplicate applications

Unclear permission

Personal-number exposure

Group administrators claiming unofficial endorsement

Rule

Do not describe a society or group as a PetSaathi partner unless an authorised representative has agreed.

Channel 3 — General colleges

Potential value

Colleges may provide candidates who have:

Morning or evening availability

Local travel capacity

Interest in part-time work

Access to multiple neighbourhoods

Important correction

Do not assume students are naturally suitable as dog walkers.

Applicants still need:

Minimum age eligibility

Reliable transport

Service-specific availability

Identity checks

Safety training

Practical assessments

Examination-period availability planning

Recommended contacts

Approach:

Placement or career cells

Student-affairs departments

Entrepreneurship cells

Animal-welfare clubs

NSS/community-service units

Approved student-group administrators

Risk

Class schedules, examinations and vacations may reduce long-term reliability.

Required question

“Will your availability remain stable during examinations, holidays and internship periods?”

Channel 4 — Veterinary colleges

Potential value

Veterinary students may have relevant academic or animal-handling exposure.

However:

Veterinary-college attendance does not automatically make an applicant a premium sitter, registered veterinarian or medical-care provider.

Use the Veterinary Council of India’s official recognised-college list when identifying legitimate veterinary institutions for outreach. The VCI’s current site maintains recognised and provisionally recognised college information.

Suitable recruitment possibilities

Veterinary students may be assessed for:

Senior-pet support

Higher-observation sitting

Emergency-protocol backup

Training support

Standard walking and sitting

Restrictions

They should not:

Diagnose pets through PetSaathi

Prescribe medication

Present themselves as registered veterinarians unless actually registered

Replace a veterinary partner

Better channel label

Replace:

“Vet colleges — premium sitters”

with:

“Veterinary colleges — applicants with potentially relevant animal-care education, subject to the full screening and service-approval process.”

Channel 5 — Pet shops

Potential value

Pet-shop owners or staff may know:

Experienced pet handlers

Pet parents seeking part-time work

Local groomers

Community volunteers

Boarding providers

People already active in the pet ecosystem

Recommended approach

Ask for:

Referral-post permission

Brochure placement

Staff referrals

Introductions to known caregivers

Risk

Retail experience does not prove:

Home-entry professionalism

Leash-handling ability

Emergency judgement

Boarding suitability

Every referral must enter the standard pipeline.

Channel 6 — Dog trainers

Potential value

Responsible dog trainers may refer:

Experienced handlers

Assistant trainers

Walkers familiar with stronger dogs

Candidates suitable for yellow-risk assessments

Important distinction

A trainer referral is evidence worth reviewing, not final verification.

Potential partner role

Professional trainers may also be managed separately as:

Training partners

Behaviour-consultation partners

Practical-assessment partners

They should not be placed inside the ordinary sitter category without the applicable sitter onboarding.

Channel 7 — Existing pet parents

Potential value

Existing customers may refer candidates with:

Demonstrated pet-care routines

Local community trust

Availability for nearby services

Familiarity with PetSaathi’s reporting expectations

Boarding correction

A customer who owns pets and has extra space does not automatically qualify as a boarding host.

They must still complete:

Identity screening

Interview

Boarding training

Household-consent review

Property photographs

Live property walkthrough

Existing-pet disclosure

Capacity assessment

Controlled trial

Best use

Existing pet parents can be a strong referral source, but not an automatic approval source.

Channel 8 — Apartment societies

Potential value

Society recruitment supports hyperlocal density because residents may serve customers in the same or nearby buildings.

Suitable roles

Morning walkers

Evening walkers

Cat-visit sitters

Emergency replacements

Home sitters

Carefully assessed boarding hosts

Benefits

Possible operational advantages include:

Short travel time

Easier building access

Local backup capacity

Better recurring-slot availability

These are hypotheses that must be confirmed through actual attendance, completion and retention data.

Recruitment method

Use:

Society-approved notices

Resident opt-in forms

Pet-parent groups

Awareness events

Resident coordinator referrals

Channel 9 — Homemaker and community groups

Potential value

Some community members may have suitable daytime or recurring availability.

Important wording correction

Avoid assuming that all homemakers are automatically:

Available

Suitable for boarding

Experienced with pets

Financially motivated

Reliable

Recruit them under the same criteria as every other applicant.

Potential roles

Depending on individual capability:

Home visits

Cat sitting

Daytime pet sitting

Controlled boarding

Emergency local backup

Additional boarding questions

Ask about:

Household consent

Children

Existing pets

Property permissions

Time the pet may be alone

Home-security controls

Emergency transport

4. Channel-priority matrix

Use local Phase 2 data to prioritise the channels rather than contacting every channel equally.

### Table 134

| Channel | Expected application volume | Expected quality | Locality strength | Effort |
| --- | --- | --- | --- | --- |
| Instagram | High | Variable | Medium | Medium |
| WhatsApp communities | Medium–high | Variable | High | Medium |
| General colleges | Medium | Variable | Medium | High |
| Veterinary colleges | Low–medium | Potentially relevant | Medium | High |
| Pet shops | Low–medium | Referral-dependent | High | Medium |
| Dog trainers | Low | Potentially high | Medium | Medium |
| Existing pet parents | Low–medium | Referral-dependent | High | Low |
| Apartment societies | Medium | Potentially strong | Very high | High |
| Community/homemaker groups | Medium | Variable | High | Medium |

These ratings are planning assumptions. Week 2 must replace them with observed data.

5. Recruitment-source tracking

Every applicant should have:

source_channel

source_campaign

referrer_id

first_touch_date

application_date

area

service_interest

screening_result

interview_result

training_result

approval_result

Important channel metrics

Valid-application rate

Valid applications ÷ Raw applications × 100

Phone-screen pass rate

Initial shortlist ÷ Phone screens completed × 100

Interview attendance rate

Video interviews completed ÷ Video interviews scheduled × 100

Final-shortlist rate

Final training shortlist ÷ Video interviews completed × 100

Approval rate

Approved sitters ÷ Valid applications × 100

Cost per valid applicant

Channel spending ÷ Valid applications from the channel

Cost per approved sitter

Channel spending ÷ Approved sitters from the channel

Meta similarly recommends evaluating messaging or lead campaigns using metrics such as qualified leads, cost per qualified lead and conversions rather than only people reached.

6. Application review scoring

Use an internal application score only for prioritisation. It should not automatically approve or reject candidates.

### Table 135

| Factor | Maximum points |
| --- | --- |
| Active-area proximity | 20 |
| Availability fit | 20 |
| Relevant pet experience | 20 |
| Service demand fit | 15 |
| Communication completeness | 10 |
| Verification readiness | 10 |
| Repeat-booking availability | 5 |
| Total | 100 |

Suggested interpretation

### Table 136

| Score | Action |
| --- | --- |
| 75–100 | Priority phone screening |
| 60–74 | Standard screening |
| 40–59 | Clarification or hold |
| Below 40 | Low priority or reject after review |

Safety override

Reject or stop the process irrespective of score when the applicant clearly states they would:

Use harsh or abusive handling

Hide an incident

Send an unauthorised substitute

Walk dogs off-leash against policy

Feed or medicate without permission

Misuse customer access information

Refuse all required verification

Accept bookings outside approved capability

7. CRM recruitment stages

Use clear and non-overlapping statuses:

APPLICATION_SUBMITTED

APPLICATION_UNDER_REVIEW

INFORMATION_REQUIRED

PHONE_SCREEN_SCHEDULED

PHONE_SCREEN_COMPLETED

INITIAL_SHORTLIST

VIDEO_INTERVIEW_SCHEDULED

VIDEO_INTERVIEW_COMPLETED

FINAL_SHORTLIST

VERIFICATION_PENDING

TRAINING_PENDING

ON_HOLD

AREA_WAITLIST

REJECTED

WITHDRAWN

Do not use:

APPROVED

during Week 2 unless verification, training, practical assessment and probation requirements have actually been completed.

8. Daily recruitment dashboard

### Table 137

| Metric | Today | Week total | Target |
| --- | --- | --- | --- |
| Raw applications | — | — | 110–130 |
| Valid applications | — | — | 100+ |
| Applications reviewed | — | — | 100% within SLA |
| Phone calls attempted | — | — | Track |
| Phone screens completed | — | — | 60 |
| Initial shortlist | — | — | 40–50 |
| Video interviews scheduled | — | — | 40–45 |
| Video interviews completed | — | — | 30–40 |
| Final shortlist | — | — | 25–35 |
| Duplicate/spam applications | — | — | Track |
| Candidates on hold | — | — | Track |
| Candidate withdrawals | — | — | Track |

Add service-supply targets

The overall application total is not sufficient. Track the required mix.

### Table 138

| Candidate type | Example pipeline target |
| --- | --- |
| Dog-walking candidates | 40–50 |
| Home-sitting candidates | 25–35 |
| Cat-care candidates | 10–20 |
| Boarding applicants | 10–15 |
| Emergency-backup applicants | 10–15 |
| Candidates within core micro-market | At least 60% |

One person may apply for several categories, so these counts may overlap.

9. Week 2 quality gates

Week 2 should not be considered successful merely because 100 forms were received.

It should pass these checks:

Most candidates come from active or adjacent areas.

Morning and evening walking supply exists.

Applicants understand that the role requires screening and training.

Payout expectations are documented.

Boarding applicants accept property assessment.

Applicant-data access is controlled.

Every applicant has a recorded source.

Phone-screen outcomes are stored.

Video interviews are scheduled only for qualified applicants.

No applicant is publicly described as approved or verified prematurely.

10. Week 2 decision framework

Green — Recruitment pipeline is working

Use green status when:

At least 100 valid applications are received.

At least 60 phone screens are completed.

Approximately 40–50 candidates pass initial screening.

Approximately 30–40 video interviews can be completed.

Candidate supply is concentrated around the selected micro-market.

Required service categories have enough candidates.

Applicants accept verification and training requirements.

Decision

Proceed to Week 3 verification, training and practical assessments.

Amber — Volume exists, but quality or location is weak

Use amber when:

More than 100 applications arrive, but most are outside the active area.

Many applicants are unavailable during required time slots.

Dog walkers are plentiful, but sitting or backup supply is weak.

Payout expectations are consistently incompatible.

Interview attendance is poor.

Most candidates resist training or verification.

Decision

Do not lower standards. Change channel targeting, recruitment wording or locality focus.

Red — Recruitment system is producing unusable leads

Use red when:

Application volume remains low after several channels are tested.

Applicants are mostly outside the service area.

Serious safety attitudes repeatedly appear.

Candidate information cannot be tracked accurately.

Recruiters approve applicants informally.

Identity documents are being collected through unsafe channels.

Boarding applicants are being accepted without property review.

Decision

Pause scale recruitment and correct the channel, offer or onboarding process.

Corrected Week 2 target table

### Table 139

| Metric | Recommended target |
| --- | --- |
| Valid sitter applications | 100+ |
| Form-eligible applicants | 60–70 |
| Phone screens completed | 60 |
| Initial shortlist | 40–50 |
| Video interviews scheduled | 40–45 |
| Video interviews completed | 30–40 |
| Final training shortlist | 25–35 |
| Application source captured | 100% |
| Screening decision recorded | 100% |
| Premature approvals | 0 |

Week 2 final deliverables

By the end of Week 2, PetSaathi should have:

At least 100 valid sitter applications

A channel-level recruitment report

Sixty completed phone screens

Forty to fifty initially shortlisted candidates

A confirmed video-interview calendar

Twenty-five to thirty-five strong training candidates

A service and area supply-gap report

A clean CRM with every decision recorded

A list of rejected, held and waitlisted applicants

A recruitment-channel plan for the next hiring cycle

Simple explanation for professor

“During Week 2 of Phase 3, PetSaathi will recruit sitter applicants through Instagram, WhatsApp communities, colleges, recognised veterinary colleges, pet shops, trainers, existing customers and apartment societies. The objective is to obtain at least one hundred valid and non-duplicate applications rather than only collecting contact details. Every morning, recruitment content will be published and community organisations will be contacted. Applications will then be reviewed, applicants will receive structured phone calls, and suitable candidates will be scheduled for video interviews. I will distinguish an initial shortlist of forty to fifty people from a final training shortlist of approximately twenty-five to thirty-five people. Veterinary students, pet parents and society residents will not receive automatic premium status; every person must complete the same safety, verification and service-approval process. The CRM will track the candidate’s source, location, availability, service interest, interview result and next action so that Week 3 can focus on verification, training and practical assessment.”

PetSaathi Phase 3 — Week 3: Verification and Training 🐾

Core goal

The purpose of Week 3 is to convert the strongest shortlisted applicants into verified, trained and trial-ready sitter candidates.

The original goal says:

“Convert shortlisted sitters into approved service providers.”

That is slightly premature. A candidate should not receive full approval before completing a practical assessment and successful probation booking.

The more accurate Week 3 objective is:

Complete required verification, interviews, service-specific training and quizzes so suitable candidates can receive conditional approval for controlled trial bookings.

The correct progression is:

Final shortlist → verification → training → quiz → practical assessment → conditional approval → probation booking → final service approval

Large pet-care platforms also separate background checks from profile approval and manual review; completing one check does not automatically make a sitter active.

Important corrections before Week 3 begins

1. Document collection should not automatically equal verification

Receiving a document means only:

Document submitted

It does not mean:

Identity verified

Each check should have a separate status:

Not requested

Requested

Submitted

Under review

Passed

Failed

Resubmission required

Expired

Revoked

2. Do not collect full sensitive documents from every applicant too early

Document collection should normally be limited to candidates who:

Passed initial application screening

Completed the phone screen

Are inside the target service areas

Have usable availability

Agreed to the privacy and verification notice

Are likely to proceed to training

PetSaathi should explain what information is collected, why it is required, who can access it and how long it will be retained. India’s DPDP Act and the final DPDP Rules, 2025 form the current digital-personal-data framework, with the Rules using staged commencement provisions.

3. Do not require ordinary WhatsApp submission of identity documents

Identity documents should be submitted through:

A restricted upload form

A secure verification provider

A private document-storage workflow

An administrator-controlled verification portal

They should not be stored in:

General WhatsApp groups

Unrestricted Google Sheets

Public Drive folders

Interview notes

Sitter-profile photographs

Where Aadhaar is voluntarily used, privacy-preserving options such as Masked Aadhaar or Aadhaar Paperless Offline e-KYC should be considered. UIDAI states that offline e-KYC is voluntary, does not expose the Aadhaar number itself and lets the holder choose certain data to share; Masked Aadhaar hides the first eight digits.

4. Boarding candidates are not approved boarding hosts yet

The target of five to ten boarding candidates should mean:

Five to ten candidates eligible for a separate home assessment.

They still need:

Household consent

Property photographs

Live walkthrough

Property-permission review

Existing-pet disclosure

Boarding training

Home-safety checklist

Controlled trial stay

5. Emergency backup status cannot be awarded from a quiz alone

During Week 3, candidates may become:

Emergency-protocol-trained backup candidates

Final emergency-backup status should normally require evidence of:

Strong punctuality

Reliable communication

Relevant service approval

Ability to travel quickly within the micro-market

Successful probation bookings

No unresolved serious incident

Current availability

Corrected Week 3 funnel

### Table 140

| Stage | Recommended target | Correct meaning |
| --- | --- | --- |
| Final shortlisted candidates | 30–40 | Eligible for verification and training |
| Verification requests issued | 30+ | Secure requests sent |
| Required documents submitted | 30+ | Documents received, not automatically passed |
| Core checks passed | 25–30 | Identity/interview and applicable checks completed |
| Training started | 25–30 | Relevant modules assigned |
| Mandatory training completed | 25+ | All required modules for proposed service completed |
| Quiz passed | 20–25 | Overall and critical-question thresholds passed |
| Practical assessment ready | 15–25 | Eligible for walking, sitting or boarding assessment |
| Trial-ready candidates | 15–20 | Conditional approval for controlled test bookings |
| Boarding assessment candidates | 5–10 | Not yet boarding-approved |
| Emergency-backup candidates | 5+ | Protocol-trained; reliability approval pending |

These numbers are PetSaathi’s internal operating targets, not universal marketplace benchmarks.

Week 3 plan

### Table 141

| Day | Focus | Final output |
| --- | --- | --- |
| Day 15 | Document collection | Secure verification records |
| Day 16 | Video interviews | Structured suitability decisions |
| Day 17 | Modules 1–2 | Basics and walking knowledge |
| Day 18 | Modules 3–4 | Sitting and boarding knowledge |
| Day 19 | Modules 5–6 | Emergency and communication knowledge |
| Day 20 | Quiz and evaluation | Pass, retrain, restrict or reject decisions |
| Day 21 | Trial assignment planning | Controlled probation-booking plan |

Day 15 — Document Collection and Verification Intake

Main goal

Securely collect the evidence needed to complete each shortlisted candidate’s applicable checks.

Day 15 should be divided into:

Document request

Document submission

Completeness review

Authenticity or consistency review

Verification decision

Documents and information to request

A. Identity evidence

Request one acceptable form according to PetSaathi’s documented verification policy.

Record:

Name shown

Photograph match

Age eligibility

Document type

Last four characters or internal reference

Review date

Reviewer

Verification result

Avoid storing complete document numbers in the general sitter CRM.

B. Current-address information

Collect only what is necessary for:

Service-area matching

Travel assessment

Emergency communication

Boarding-property assessment

For ordinary walkers, locality and a verified contact address may be sufficient under the internal policy.

For boarding hosts, the exact approved property address is essential because boarding approval belongs to a specific host at a specific property.

C. Reference information

Where references are required, collect:

Reference name

Relationship

Contact details

How long they have known the candidate

Pet-care experience they can confirm

Permission to contact them

A reference should be classified as:

Professional

Pet-care customer

Previous employer

Academic

Personal

A personal reference should not be represented as professional pet-care verification.

D. Emergency contact

Collect:

Name

Relationship

Telephone number

Alternative contact number

Permission to contact during an emergency

E. Boarding-only information

Boarding applicants may also submit:

Current property address

Owner or renter status

Landlord or society-permission status

Household declaration

Existing-pet details

Initial home photographs

Emergency-transport information

Full home approval should not occur from photographs alone.

F. Payout information

Bank or payout details should preferably be collected only after the candidate receives conditional approval or before their first paid trial.

This reduces unnecessary storage of financial information for candidates who will not proceed.

Verification checklist

### Table 142

| Verification item | What the reviewer checks |
| --- | --- |
| Name consistency | Application and identity evidence match |
| Photo consistency | Applicant resembles submitted evidence |
| Age eligibility | Candidate satisfies the platform requirement |
| Phone consistency | Submitted contact belongs to the applicant |
| Address consistency | Area and submitted address are reasonably consistent |
| Reference consistency | Experience claims can be supported where required |
| Document quality | Evidence is readable and complete |
| Expiry | Document remains valid where expiry applies |
| Tampering concerns | No obvious alteration or inconsistency |
| Consent | Candidate accepted the verification notice |

Document result options

Passed

Failed

Resubmission required

Additional evidence required

Manual senior review

Not required for selected service

Day 15 output

By the end of the day, PetSaathi should have:

Thirty or more secure verification submissions

A verification status for every requested check

A missing-document follow-up list

A list of inconsistencies requiring interview clarification

Boarding candidates separated from ordinary sitter applicants

Day 16 — Structured Video Interviews

Main goal

Complete the remaining video interviews and make evidence-based suitability decisions.

The term “trust assessment” should not mean judging whether someone merely “looks trustworthy.”

Trust should be evaluated using:

Consistency of information

Specific experience examples

Safety judgement

Honest recognition of limitations

Willingness to follow procedures

Communication reliability

Verification cooperation

Behaviour during scheduling

Responses to difficult scenarios

Rover’s current sitter process includes manual review rather than relying only on a completed background check, supporting a multi-factor review approach.

Interview structure

Part 1 — Confirm the application

Verify:

Name and locality

Availability

Requested services

Experience

Travel radius

Payout expectations

Verification readiness

Part 2 — Service scenarios

Walking applicant

Ask:

“A 30-kilogram dog begins pulling strongly toward another dog. What do you do?”

A suitable answer should include:

Maintaining safe distance

Avoiding forced interaction

Changing direction safely

Following owner instructions

Escalating when the dog exceeds the sitter’s capability

Home-sitting applicant

Ask:

“You enter the customer’s home, but the pet is inside a room marked as restricted. What do you do?”

Expected response:

Do not enter without clarification

Contact the customer or admin

Record the delay

Protect home privacy

Boarding applicant

Ask:

“A guest dog begins guarding food from your resident dog. What do you do?”

Expected response:

Separate the animals

Remove shared resources safely

Notify PetSaathi

Follow the compatibility plan

Avoid forcing interaction

Emergency candidate

Ask:

“A dog becomes weak, pants heavily and vomits during a walk. What do you do?”

Expected response:

Stop the walk

Move to a safer, cooler location

Call operations, the customer and veterinary support

Follow professional instructions

Arrange transport when directed

AVMA identifies heavy panting, weakness, confusion, vomiting and abnormal gum colour among potential heatstroke warning signs and advises contacting veterinary care during emergencies.

Video-interview scorecard

### Table 143

| Factor | Maximum score |
| --- | --- |
| Relevant pet-care experience | 15 |
| Safety judgement | 25 |
| Reliability and availability | 15 |
| Communication | 15 |
| Service-specific suitability | 10 |
| Privacy and professionalism | 10 |
| Verification and training readiness | 10 |
| Total | 100 |

Recommended results

### Table 144

| Score | Result |
| --- | --- |
| 75–100 | Proceed |
| 60–74 | Conditional progress |
| 40–59 | Hold or restrict services |
| Below 40 | Do not proceed currently |

A serious integrity or safety concern overrides the numerical result.

Day 16 output

Completed interview records

Interview scores

Proposed service categories

Restrictions

Rejection or hold reasons

Final training cohort

Day 17 — Training Modules 1 and 2

Modules covered

Pet-care basics

Dog-walking safety

Main objective

Teach universal sitter conduct and prepare walker candidates for practical assessment.

Module 1 — Pet-care basics

Required for

All candidates.

Topics

Pet-parent expectations

Punctuality

Hygiene

Following written instructions

No unauthorised food

No unauthorised medication

No unauthorised substitutes

Customer privacy

Incident honesty

Service reporting

Completion requirement

The candidate should:

Watch or attend the complete module

Acknowledge the safety rules

Complete practice questions

Demonstrate understanding through a short scenario

Module 2 — Dog-walking safety

Required for

Walker candidates and relevant emergency-backup candidates.

Topics

Collar, harness and leash inspection

Safe door and gate exit

Road crossing

Pulling and reactivity

Avoiding uncontrolled animal interactions

Crowded areas

Hot surfaces and weather

Water breaks

Waste cleanup

Live location

Start and end evidence

Pet escape response

ASPCA recommends keeping dogs on a leash, preventing them from ingesting unknown items, providing water, cleaning up waste and monitoring for heatstroke signs such as excessive panting, breathing difficulty, weakness or collapse.

Day 17 assessment

Use a short practice quiz, but do not make the final pass/fail decision until Day 20.

Record:

Attendance

Completion

Questions asked

Difficult topics

Practice result

Practical-assessment requirement

Day 17 output

Module 1 completion records

Module 2 completion records

List of walker candidates needing extra coaching

Practical-walk assessment list

Day 18 — Training Modules 3 and 4

Modules covered

Home pet-sitting safety

Boarding safety

Important rule

Candidates should receive only the modules applicable to their proposed services.

A walker who is not pursuing sitting or boarding does not need boarding approval training during the initial cycle.

Module 3 — Home pet-sitting safety

Required for

Home sitters

Cat sitters

Senior-pet sitters

Relevant emergency backups

Topics

Home access

Key and access-code protection

Restricted rooms

Customer privacy

Feeding and water

Litter and toilet tasks

Medication only under approved instructions

Pet observation

Arrival updates

Departure confirmation

Home-security checklist

Scenario requirement

The candidate should complete a simulated:

Arrival message

Home-entry checklist

Pet update

Exit confirmation

Module 4 — Boarding safety

Required for

Boarding candidates only.

Topics

Home preparation

Door, gate and balcony safety

Guest-pet introduction

Existing-pet compatibility

Separate feeding

Sleeping arrangements

Separation space

Cleaning and hygiene

Capacity limits

Separation anxiety

Conflict prevention

Emergency transport

Incident escalation

Important limitation

Completing Module 4 does not create boarding permission.

Boarding still requires:

Property assessment

Household consent

Local-permission review

Controlled trial

Final admin approval

Day 18 output

Home-sitting training records

Boarding-training records

Candidates requiring home-entry assessment

Candidates eligible for boarding-home assessment

Candidates restricted from boarding

Day 19 — Training Modules 5 and 6

Modules covered

Emergency handling

Customer communication

Module 5 — Emergency handling

Required for

Every sitter seeking active service approval.

Topics

Mild versus urgent concerns

Vomiting

Injury

Pet escape

Bite incident

Aggression

Seizure

Breathing difficulty

Heatstroke

Road accident

Veterinary contact

Emergency transport

Incident reporting

Mandatory principle

The sitter should understand:

First aid is temporary assistance and does not replace veterinary diagnosis or treatment.

For severe emergencies, the sitter should not wait passively for the admin when delay threatens the pet. Veterinary support, the owner and operations may need to be contacted in parallel. AVMA guidance similarly stresses that first aid does not replace veterinary care and advises contacting a veterinarian or emergency hospital after serious events such as seizures.

Emergency simulation

Every candidate should complete one scenario.

Example:

“A dog collapses during a walk, is conscious but cannot stand and is breathing abnormally.”

The candidate should demonstrate:

Stopping the service

Making the environment safe

Calling veterinary support

Contacting the customer and operations

Arranging authorised transport

Recording the timeline

Module 6 — Customer communication

Required for

Every sitter.

Topics

Professional messages

Arrival updates

Start and completion confirmation

Reporting delays

Factual language

Privacy in photographs

Complaint handling

When to call rather than message

Report-card quality

What not to promise

Practice task

Ask the candidate to prepare:

An arrival message

A delay message

A normal completion update

An incident update

A Pet Report Card

Day 19 output

Emergency-training completion

Simulation results

Communication exercises

Candidates needing retraining

Candidates restricted from emergency-backup consideration

Day 20 — Quiz and Evaluation

Main goal

Determine whether candidates have retained the required knowledge and are ready for practical assessment.

Recommended standards

### Table 145

| Candidate type | Overall score | Critical safety questions |
| --- | --- | --- |
| Walker | 80% | 100% |
| Home sitter | 80% | 100% |
| Boarding candidate | 85% | 100% |
| Emergency-backup candidate | 90% | 100% |

These thresholds are internal PetSaathi standards.

Safety-critical questions

A candidate should not pass when they incorrectly answer questions about:

Pet escape

Serious breathing difficulty

Bite reporting

Sending an unauthorised substitute

Hiding an incident

Giving unapproved medication

Customer-access information

Off-leash walking

Taking a booking outside approval

Contacting veterinary help in a critical emergency

Evaluation outcomes

### Table 146

| Result | Action |
| --- | --- |
| Pass | Proceed to practical assessment/trial planning |
| Pass with restriction | Limit services or pet categories |
| Retraining required | Reassign failed modules |
| Practical review required | Knowledge passed but capability uncertain |
| Hold | Candidate is currently unavailable or incomplete |
| Fail | Do not proceed in the current cycle |

Retake policy

A candidate may receive:

One structured retraining attempt

A second quiz using different questions

Human review after repeated failure

Unlimited automatic retakes may allow memorisation without understanding.

Day 20 output

Quiz results

Safety-critical question results

Service restrictions

Retraining list

Trial-ready candidate list

Failed or held candidates

Day 21 — Trial Assignment Planning

Main goal

Create controlled probation bookings for candidates who passed the required checks and training.

Day 21 should not involve randomly assigning candidates to normal customers.

Trial-booking eligibility

A candidate should be trial-ready only when:

Required identity check passed

Interview passed

Mandatory modules completed

Quiz threshold passed

Safety-critical questions passed

Applicable practical preparation completed

Service permission is set to PROBATION

Candidate availability is confirmed

Customer agrees to the trial arrangement

Admin monitoring is available

Suitable probation bookings

Choose:

Green-risk pets

Existing cooperative customers

Short-duration services

Local bookings

Daytime bookings where practical

Pets with clear instructions

Services with an experienced backup

Bookings close to veterinary and operational support

Avoid using probation candidates for:

Red-risk pets

Recent bite-history pets

Large pulling dogs without assessed capability

Medication-intensive care

Overnight care as the first service

Complex multi-pet households

High-stakes travel bookings

Unsupervised boarding as the first assignment

Trial assignment record

Record:

Candidate sitter ID

Booking ID

Approved trial service

Pet-risk level

Customer consent

Primary supervisor

Backup sitter

Start and end time

Monitoring plan

Required updates

Assessment criteria

Incident-escalation contact

Trial evaluation criteria

### Table 147

| Factor | Maximum points |
| --- | --- |
| Safety and pet handling | 25 |
| On-time arrival | 15 |
| Communication | 15 |
| Instruction compliance | 15 |
| Report quality | 10 |
| Customer rating | 15 |
| Reliability | 5 |
| Total | 100 |

A critical safety failure overrides the score.

Day 21 output

Trial booking roster

Customer-consent list

Primary and backup assignments

Supervisor list

Trial evaluation form

Candidates remaining in training

Candidates not proceeding

Week 3 CRM workflow

Use the following statuses:

FINAL_SHORTLIST

→ VERIFICATION_REQUESTED

→ VERIFICATION_SUBMITTED

→ VERIFICATION_UNDER_REVIEW

→ VERIFICATION_PASSED

→ TRAINING_ASSIGNED

→ TRAINING_IN_PROGRESS

→ QUIZ_PENDING

→ QUIZ_PASSED

→ PRACTICAL_ASSESSMENT_PENDING

→ PROBATION_READY

→ PROBATION_ACTIVE

Alternative outcomes:

RESUBMISSION_REQUIRED

RETRAINING_REQUIRED

SERVICE_RESTRICTED

ON_HOLD

REJECTED

WITHDRAWN

Do not mark a candidate APPROVED merely because the quiz was passed.

Corrected Week 3 targets

### Table 148

| Metric | Recommended target | Definition |
| --- | --- | --- |
| Required documents submitted | 30+ | Secure and complete submissions |
| Core verifications passed | 25–30 | Applicable checks reviewed and passed |
| Training completed | 25+ | All assigned mandatory modules completed |
| Quiz passed | 20–25 | Overall score and critical questions passed |
| Practical-assessment ready | 15–25 | Eligible for relevant demonstration |
| Trial-ready candidates | 15–20 | Conditional probation permission |
| Boarding-home assessment candidates | 5–10 | Training completed; home approval pending |
| Emergency-protocol-trained candidates | 5+ | Emergency module and simulation passed |
| Fully approved sitters | Not yet final | Approval follows successful trials |

Week 3 daily dashboard

### Table 149

| Metric | Day total | Week total | Target |
| --- | --- | --- | --- |
| Document requests sent | — | — | 30+ |
| Complete submissions | — | — | 30+ |
| Verification passes | — | — | 25–30 |
| Verification failures | — | — | Track |
| Interviews completed | — | — | All remaining finalists |
| Training started | — | — | 25–30 |
| Training completed | — | — | 25+ |
| Quiz attempts | — | — | Track |
| Quiz passes | — | — | 20–25 |
| Retraining required | — | — | Track |
| Trial-ready candidates | — | — | 15–20 |
| Boarding candidates | — | — | 5–10 |
| Emergency candidates | — | — | 5+ |

Week 3 quality gates

Week 3 is successful only when:

Sensitive documents are collected securely.

Each verification check has a separate result.

Interview decisions use evidence and structured scoring.

Training completion is linked to module versions.

Safety-critical quiz questions are all answered correctly.

Walking candidates are scheduled for practical assessment.

Boarding candidates are scheduled for property assessment.

Emergency candidates pass an emergency simulation.

Service permissions remain probationary.

Trial assignments use low-risk pets and customer consent.

No candidate receives full public approval prematurely.

Week 3 decision framework

Green — Ready for controlled trials

Use green status when:

Twenty-five or more candidates complete training.

Twenty or more candidates pass the quiz.

Verification results are substantially complete.

Candidates cover the required areas and services.

Walking and sitting practical assessments are ready.

Boarding candidates accept property verification.

At least five candidates pass emergency simulations.

Decision

Proceed to controlled probation services.

Amber — Candidates exist, but gaps remain

Use amber when:

Document submission is high but verification failures are significant.

Training is completed but quiz performance is weak.

Walking supply is strong but home-sitting supply is low.

Boarding candidates refuse home assessment.

Candidates pass knowledge tests but practical ability is uncertain.

Most candidates are outside the primary micro-market.

Decision

Retrain, restrict service permissions and recruit specifically for missing categories.

Red — Do not start trials

Use red status when:

Identity or information inconsistencies are widespread.

Candidates repeatedly fail critical safety questions.

Emergency escalation is misunderstood.

Applicants believe substitutes are acceptable.

Documents are being stored insecurely.

Boarding applicants are being approved without property review.

Admins are bypassing the defined workflow.

No experienced backup exists for probation bookings.

Decision

Pause trial assignments and correct the verification or training system.

Week 3 final deliverables

By the end of Week 3, PetSaathi should have:

A complete verification register

Secure identity and address review records

Completed structured interview scorecards

Training records for all assigned modules

Quiz and safety-question results

Practical-assessment queues

Five to ten boarding-home assessment candidates

Five or more emergency-protocol-trained candidates

Fifteen to twenty trial-ready sitters

A controlled probation-booking plan

A rejected, restricted, retraining and hold list

A Week 4 trial and final-approval schedule

Final Week 3 principle

Week 3 should not transform applicants directly into permanently approved sitters. It should convert shortlisted applicants into verified, trained and assessed candidates who are eligible for carefully controlled probation bookings. Full approval is earned only after the candidate demonstrates safe and reliable performance in real services.

Simple explanation for professor

“During Week 3, PetSaathi will verify and train the shortlisted sitter candidates. First, required identity and address information will be collected through a restricted process rather than ordinary WhatsApp. Each document will be separately reviewed and marked as submitted, passed, failed or requiring resubmission. Candidates will then complete structured video interviews that assess experience, safety judgement, reliability and service suitability. Over three days, they will complete modules covering pet-care basics, dog walking, home sitting, boarding, emergency handling and customer communication. Candidates must pass a service-specific quiz and answer every critical safety question correctly. Those who pass will not immediately become fully approved sitters. They will receive conditional probation status and be assigned only to controlled, low-risk trial bookings. Boarding candidates will still require a separate home assessment, while emergency-backup candidates must demonstrate reliability during actual bookings before receiving final backup status.”

PetSaathi Phase 3 — Week 4: Trial Bookings and Final Approval 🐾

Core goal

Week 4 should test whether trained candidates can apply PetSaathi’s rules during real, controlled pet-care services.

The week should answer:

Can this candidate deliver the approved service safely, punctually and professionally with a real pet and customer?

The correct progression is:

Training passed → practical assessment passed → controlled trial → performance review → probationary approval → ongoing monitoring

A training certificate or successful interview is not enough. Established marketplaces also separate checks from final approval: Rover manually reviews sitter profiles, and a completed background check is only one part of its profile-review process.

Important corrections to the proposed Week 4 plan

1. One trial should provide probationary approval, not unrestricted approval

One successful service is useful evidence, but it cannot establish long-term reliability.

A better approval structure is:

### Table 150

| Stage | Meaning |
| --- | --- |
| Trial-ready | Cleared to perform one controlled test service |
| Probation approved | Passed the trial and may receive limited low-risk bookings |
| Fully service-approved | Completed several reliable services with acceptable scores |
| Premium | Earned later through sustained performance |

Recommended rule

One controlled trial: minimum for probationary service approval

Three successful services: preferred minimum for ordinary active approval

Ten or more successful services: possible eligibility for Proven/Premium status

These are PetSaathi’s internal rules, not universal industry standards.

2. Boarding approval needs more than one daycare test

A controlled daycare trial is a useful first step, but it does not fully test:

Overnight supervision

Night-time anxiety

Sleeping arrangements

Early-morning routines

Long-duration feeding

Household behaviour after several hours

Emergency handling outside normal daytime hours

Therefore, Week 4 should produce:

Boarding Beta Approved

rather than unrestricted boarding approval.

A boarding host should normally complete:

Host verification

Property assessment

Controlled daycare trial

Post-trial review

Controlled overnight beta

Final boarding decision

PetBacker’s boarding check-in form records the animal’s condition and existing abnormalities at handover, creating useful evidence if a dispute arises. PetSaathi should use a similar signed or digitally acknowledged handover record for every boarding trial.

3. An emergency drill does not prove operational reliability

A simulation can prove that the candidate understands:

Who to call

What information to provide

When veterinary escalation is required

How to document an incident

It does not prove that the person:

Arrives reliably

Accepts urgent work

Can travel quickly

Responds to calls consistently

Performs safely under real pressure

Final emergency-backup status should require:

Emergency simulation passed

Approval for the underlying service

Strong punctuality history

Current local availability

Reliable phone response

No unresolved serious incident

During Week 4, the candidate may be classified as:

Emergency Protocol Trained — Backup Approval Pending

4. The numerical targets need overlap rules

The proposed targets are:

### Table 151

| Metric | Target |
| --- | --- |
| Trial bookings completed | 20–30 |
| Approved walkers | 15–20 |
| Approved sitters | 10–15 |
| Approved boarding hosts | 5–10 |

If these represent unique people, 20–30 trials cannot produce 30–45 separately approved providers when each person must complete at least one trial.

The target works only when categories overlap. For example, the same person may be approved for both walking and home sitting.

The dashboard should therefore report:

Unique trial candidates

Service permissions awarded

Unique approved providers

Candidates holding multiple permissions

Corrected Week 4 funnel

### Table 152

| Stage | Recommended target | Meaning |
| --- | --- | --- |
| Trial-ready candidates | 20–30 | Passed verification, training and quiz |
| Controlled trials scheduled | 25–35 | Includes rescheduled or second assessments |
| Unique candidates completing trials | 20–30 | At least one completed trial each |
| Probation-approved providers | 15–25 | Allowed limited low-risk bookings |
| Walking permissions awarded | 15–20 | May overlap with sitting |
| Home-sitting permissions awarded | 8–15 | May overlap with walking |
| Boarding-beta permissions | 3–7 | Property assessed and daycare trial passed |
| Emergency-protocol-trained candidates | 5+ | Final backup status may remain pending |
| Candidates requiring retrial | Track | Additional evidence needed |
| Paused or rejected candidates | Documented | Decision and reason recorded |

Approving five to ten boarding hosts in one week may be ambitious unless all property assessments were already completed during Week 3.

Part 1 — Rules for Every Trial Booking

A trial booking should be treated as a genuine service, not as an informal demonstration.

Mandatory conditions

Before a trial begins:

The candidate’s required identity check has passed.

The structured interview has passed.

Required training modules are complete.

The service-specific quiz has passed.

Every critical safety question was answered correctly.

The practical assessment has passed or is incorporated into the supervised trial.

The pet-risk assessment is complete.

The candidate holds PROBATION permission for the exact service.

The customer has been told that this is a monitored trial.

The customer has explicitly agreed.

A qualified backup or supervisor is available.

Emergency information is complete.

The sitter’s payout has been agreed.

The booking is recorded in the CRM.

A Meet & Greet should ordinarily occur before a first trial, especially for home sitting, boarding, large dogs or anxious pets. Rover describes Meet & Greets as an important opportunity for the owner, sitter and pet to assess suitability and discuss behaviour, routines and expectations before a service.

Suitable pets for trials

Prefer:

Green-risk pets

Existing cooperative customers

Clear routines

Stable health

No recent bite history

No complex medication

No unresolved severe separation anxiety

Safe and functioning equipment

Short local services

Avoid:

Red-risk pets

Recent aggression incidents

Severe medical needs

Uncontrolled seizures

Large pulling dogs for beginner walkers

High-risk travel bookings

Complex multi-pet homes

First-time overnight boarding without a daycare test

Customer disclosure

Use a clear message:

Hi [Name],

[Sitter First Name] has completed PetSaathi’s screening, training and service assessment and is now completing a monitored probation booking.

PetSaathi operations will supervise the service process, and an approved backup will be available. Your normal service updates and Pet Report Card will be provided.

Please confirm that you agree to this trial arrangement.

Do not describe the candidate as fully proven before the trial is complete.

Trial sitter compensation

The candidate should receive the agreed payout when the service is completed, even though it is a trial.

Payment may be reduced only when:

The reduced trial payout was disclosed in advance.

It remains reasonable for the required work.

The candidate accepted it before the assignment.

The reduction is not applied after the service because of an arbitrary score.

Part 2 — Dog-Walker Trial

Minimum trial

One monitored or supervised dog walk

Recommended duration

20–30 minutes for the first assessment

Green-risk dog

Familiar local route

One dog only

Daylight where practical

Meaning of supervised or monitored

Possible formats include:

Direct supervision

An assessor observes:

Handover

Equipment check

Door exit

Initial walking control

Road crossing

Pet return

Remote monitoring

The sitter provides:

Arrival confirmation

Start photograph

Live location

Mid-service update where required

End confirmation

Report card

Hybrid supervision

The assessor watches the start and handover, while operations monitors the remainder remotely.

Direct supervision is preferable where the candidate has limited experience or the dog is large.

Dog-walking trial checklist

Before the walk

The candidate must:

Arrive within the confirmed window.

Introduce themselves professionally.

Confirm the correct pet.

Review instructions.

Check collar, harness and leash.

Confirm emergency information.

Check weather and route conditions.

Start the agreed location update.

During the walk

Observe whether the candidate:

Maintains leash control

Avoids unsafe off-leash activity

Crosses roads safely

Avoids uncontrolled interactions

Manages pulling calmly

Responds to stress signals

Provides water where appropriate

Collects waste

Avoids phone distraction

Follows the authorised route unless safety requires a change

After the walk

The candidate must:

Return the correct pet safely.

Secure the pet before leaving.

Stop location sharing.

Record start and finish times.

Report distance and toilet activity.

Send the agreed photographs.

Report any unusual behaviour.

Complete the report card.

Dog-walker pass criteria

Recommended minimum:

Trial score: 80/100 or higher

Safety and handling section: at least 20/25

No critical safety failure

Customer rating: preferably 4/5 or higher

Report completed

No material instruction violation

Trial failure examples

Removes leash without approval

Uses unsafe or harsh handling

Fails to secure a gate

Ignores a damaged harness

Conceals a problem

Allows an unauthorised substitute

Leaves the pet unattended

Misses the service without sufficient notice

Part 3 — Home-Sitter Trial

Minimum trial

One short sitting or home-visit session

Recommended duration

30–60 minutes

Green-risk pet

Clear feeding or companionship instructions

No complex medication during the first trial

Customer or authorised person available at initial handover where practical

Trial tasks

The sitter should demonstrate:

Correct arrival message

Secure home entry

Respect for restricted areas

Pet identification

Food and water tasks

Calm pet interaction

Appropriate photograph or video update

Accurate behaviour observation

Secure exit

Key or access-code handling

Departure confirmation

Complete report card

Privacy assessment

The candidate must not:

Enter unauthorised rooms

Photograph personal documents

show access codes in photographs

Invite another person inside

Share the customer’s address

Post service media publicly

Retain keys or access data beyond the booking requirement

Home-sitter pass criteria

Recommended minimum:

Trial score: 80/100 or higher

Instruction compliance: at least 12/15

Privacy and access rules followed

Customer rating: preferably 4/5 or higher

Complete arrival and exit confirmations

No serious safety or integrity concern

Part 4 — Boarding-Host Trial

Minimum Week 4 trial

One controlled daycare stay or short known-customer beta

A known or existing customer can make coordination easier, but the host must still be assessed objectively.

Pre-trial requirements

The host must already have:

Identity check completed

Interview passed

Boarding training passed

Home photographs reviewed

Live home walkthrough completed

Household consent

Existing pets disclosed

Property-risk checklist passed

Capacity assigned

Emergency transport confirmed

Veterinary clinic identified

Health and vaccination policy accepted

Trial-pet selection

Use:

One green-risk pet

Known vaccination and health information

No recent infectious symptoms

No serious aggression

Demonstrated compatibility with household conditions

Clear feeding and routine instructions

Boarding check-in

At handover, record:

Pet’s visible condition

Existing scratches or injuries

Food and medication

Behaviour

Equipment

Emergency contacts

Pickup details

Owner authorisations

A formal boarding check-in record helps establish the pet’s condition and agreed instructions at handover. PetBacker similarly recommends documenting abnormalities and having the owner acknowledge the check-in information.

Trial-day monitoring

Require:

Handover photograph

Settling update

Food and water update

Behaviour update

Existing-pet interaction update

Rest update

Incident status

Pickup confirmation

Post-service report

Boarding-host pass criteria

Recommended minimum:

Home-safety checklist passed

Daycare trial score: 85/100 or higher

No unsafe animal mixing

Feeding and separation rules followed

Updates completed

Customer rating preferably 4.5/5 or higher

No serious incident

Host accepts capacity limits

Week 4 boarding decision

Possible outcomes:

### Table 153

| Decision | Meaning |
| --- | --- |
| Boarding Beta Approved | May receive one controlled booking at a time |
| Daycare Only | Overnight boarding not yet approved |
| Overnight Trial Required | Daycare passed; overnight test still pending |
| Property Correction Required | Specific safety issue must be fixed |
| Boarding Rejected | Property or host is unsuitable |
| Other Services Allowed | Candidate may still walk or sit |

Do not publicly list the host as unrestricted until the overnight and operational requirements are satisfied.

Part 5 — Emergency-Backup Drill

Minimum assessment

One structured simulated emergency drill

The drill should test decisions rather than memorised definitions.

Recommended scenarios

Scenario A — Pet escape

The sitter must explain:

Immediate safe search

Last-known-location recording

Owner and admin calls

Society/security contact

Accurate update process

Incident record

Scenario B — Heat-related emergency

The sitter must:

Stop activity

Move the pet to a safer environment

Contact veterinary support

Notify the owner and admin

Follow veterinary instructions

Arrange transport when required

Scenario C — Bite incident

The sitter must:

Separate safely

Avoid placing hands between fighting animals

Seek medical or veterinary assistance

Notify all relevant parties

Preserve evidence

Report the incident honestly

Scenario D — Sitter cannot attend

The correct response is:

Contact PetSaathi immediately.

Do not send a friend.

Provide availability and location information.

Support the approved replacement process.

AVMA guidance emphasises contacting a veterinarian or emergency hospital during emergencies and recognises first aid as temporary assistance rather than a substitute for veterinary care.

Emergency-drill pass criteria

Simulation score: 90% or higher

All critical actions completed

Correct call order

No attempt to diagnose or provide unapproved medication

Accurate incident documentation

Calm, factual communication

Week 4 outcome

Passing the simulation earns:

Emergency Protocol Trained

It does not alone earn:

Emergency Backup Approved

Final backup eligibility should depend on actual service reliability and current availability.

Part 6 — Trial Scorecard

Use the same structured scorecard across services, with service-specific subcriteria.

### Table 154

| Factor | Maximum points |
| --- | --- |
| Safety and pet handling | 25 |
| On-time arrival | 15 |
| Communication | 15 |
| Instruction compliance | 15 |
| Update and report quality | 10 |
| Customer rating | 15 |
| Administrative reliability | 5 |
| Total | 100 |

Scoring details

Safety and pet handling — 25

Assess:

Equipment checks

Pet control

Escape prevention

Calm interaction

Risk recognition

Emergency response

On-time arrival — 15

15: On time

12: Minor delay communicated in advance

5–10: Avoidable delay

0: Unexplained no-show

Communication — 15

Assess:

Confirmation

Arrival update

Service updates

Delay reporting

Professional language

Responsiveness

Instruction compliance — 15

Assess:

Food

Water

Route

Restricted areas

Pet interaction

Medication rules

Customer-specific requirements

Report quality — 10

Assess:

Timeliness

Completeness

Accuracy

Required photographs

Clear factual language

Customer rating — 15

Suggested conversion:

### Table 155

| Customer rating | Score contribution |
| --- | --- |
| 5 | 15 |
| 4 | 12 |
| 3 | 9 |
| 2 | 5 |
| 1 | 0 |

Administrative reliability — 5

Assess:

CRM or form completion

Payout acknowledgement

Booking confirmation

Availability accuracy

Cooperation with review

Safety override

A candidate fails or is immediately paused irrespective of total points when there is credible evidence of:

Abuse or reckless handling

Pet escape caused by serious non-compliance

Concealed injury or incident

Unauthorised substitute

Falsified photographs, timing or report

Customer-data misuse

Theft or home-security violation

Unapproved off-leash activity

Undisclosed direct payment

Service performed outside eligibility

Serious intoxication during service

A high numerical score must never offset a critical safety or integrity failure.

Part 7 — Final Approval Decisions

Each candidate should receive one formal outcome.

1. Service Approved — Probation

Use when:

Trial passed

Score meets the threshold

No critical incident exists

Candidate may handle only low-risk bookings

Booking volume remains limited

Suggested restrictions:

Maximum two or three bookings per week

Green-risk pets only

One pet at a time

Limited service area

Report reviewed after every service

2. Fully Service Approved

Use after the candidate demonstrates:

Several successful services

Consistent punctuality

Complete reports

Acceptable customer ratings

No serious unresolved incident

Accurate availability

Week 4 may produce some fully approved candidates if they already completed legitimate pilot services during Phase 2. New applicants should normally remain under probation after one trial.

3. Approved with Restrictions

Examples:

Small dogs only

Cat visits only

No large dogs

No yellow-risk pets

Daytime sitting only

Daycare only

No medication tasks

One pet at a time

Specific localities only

4. Retrial Required

Use when:

Candidate was safe but nervous

Report quality was inadequate

Customer instructions were partly missed

Practical capability remains uncertain

Trial conditions were unsuitable for a fair assessment

A retrial should not be used to overlook a serious safety failure.

5. Retraining Required

Use when:

Emergency process was misunderstood

Communication was poor

Reporting was incomplete

Privacy procedures were weak

Route or handover rules were not followed

The sitter should complete targeted training before another trial.

6. Paused

Use when:

An incident requires investigation

Documents expire

Candidate becomes unavailable

A complaint remains unresolved

Property corrections are required

Candidate cannot currently meet service requirements

7. Rejected or Removed

Use when:

Serious dishonesty is established

Unsafe handling is confirmed

The candidate refuses essential rules

An incident was intentionally concealed

Customer information was deliberately misused

The boarding property remains materially unsafe

Unauthorised substitution occurred

Repeated retraining fails to correct essential behaviour

Every rejection should have a factual internal reason.

Part 8 — Recommended Week 4 Schedule

Day 22 — Final trial preparation

Tasks

Confirm trial-ready candidate list.

Confirm customer consent.

Match green-risk pets.

Confirm primary and backup assignments.

Review emergency contacts.

Create trial scorecards.

Check service permissions.

Schedule supervisors.

Output

Complete trial roster.

Day 23 — Dog-walking trials

Tasks

Conduct supervised or monitored walks.

Assess equipment handling.

Monitor location updates.

Review reports.

Obtain customer feedback.

Output

Walking assessment results and retrial list.

Day 24 — Home-sitting trials

Tasks

Conduct short sitting sessions.

Test arrival and departure processes.

Review privacy compliance.

Check feeding, water and report completion.

Output

Home-sitting assessment results.

Day 25 — Boarding daycare trials

Tasks

Complete formal check-in.

Monitor introduction and settling.

Review feeding and separation.

Conduct pickup and property review.

Output

Boarding-beta decisions and property corrections.

Day 26 — Emergency drills and second trials

Tasks

Conduct emergency simulations.

Run approved retrials.

Test backup response times.

Review incident-form completion.

Output

Emergency-protocol results and final assessment evidence.

Day 27 — Approval committee review

Review every candidate’s:

Verification status

Interview result

Training completion

Quiz result

Practical assessment

Trial score

Customer feedback

Incident status

Proposed service permission

Required restrictions

Higher-risk permissions such as boarding should ideally require two reviewers.

Output

Approval, restriction, retraining, pause or rejection decision.

Day 28 — Final roster and communication

Tasks

Update service permissions.

Publish only valid badges.

Inform approved sitters.

Inform restricted candidates.

Send retraining plans.

Close rejected applications.

Build area and availability roster.

Prepare Phase 4 supply report.

Output

Final sitter roster and Phase 3 completion report.

Part 9 — Corrected Week 4 Targets

### Table 156

| Metric | Original target | Recommended interpretation |
| --- | --- | --- |
| Trial bookings completed | 20–30 | Unique controlled services completed |
| Unique candidates tested | Not specified | 20–30 |
| Walking permissions | 15–20 | Mostly probationary initially |
| Home-sitting permissions | 10–15 | May overlap with walkers |
| Boarding permissions | 5–10 | Prefer 3–7 boarding-beta approvals |
| Emergency drills passed | Not specified | 5+ |
| Retrials completed | Track | Record separately |
| Critical unresolved incidents | Not specified | 0 |
| Paused/rejected candidates | Documented | 100% with reason |
| Final roster | Ready | Includes areas, services and restrictions |

Part 10 — Final Sitter Roster

The final roster should contain:

### Table 157

| Field | Purpose |
| --- | --- |
| Sitter ID | Unique provider record |
| Public name | Customer-facing name |
| City and area | Local matching |
| Operational status | Active, probation, paused or suspended |
| Approved services | Walking, sitting or boarding beta |
| Approved pet types | Dog, cat or other |
| Dog-size permission | Small, medium or large |
| Maximum risk level | Green or yellow |
| Travel radius | Hyperlocal matching |
| Available days and times | Scheduling |
| Trial score | Initial performance |
| Rolling score | Ongoing quality |
| Customer rating | Booking-based feedback |
| Verification badges | Exact completed checks |
| Training status | Current modules |
| Boarding property status | Where applicable |
| Backup availability | Current operational capability |
| Restrictions | Important matching limits |
| Last review date | Monitoring |
| Next reassessment | Compliance |

Customer reviews displayed as verified should be connected to genuine completed bookings. PetBacker similarly labels reviews from customers who hired the provider through the platform as verified reviews.

Part 11 — Week 4 Dashboard

Track:

### Table 158

| Metric | Today | Week total | Target |
| --- | --- | --- | --- |
| Trials scheduled | — | — | 25–35 |
| Trials completed | — | — | 20–30 |
| Customer trial consent | — | — | 100% |
| Trial reports completed | — | — | 100% |
| Trial rating received | — | — | Track |
| Trial pass rate | — | — | Track |
| Walking permissions | — | — | 15–20 |
| Sitting permissions | — | — | 8–15 |
| Boarding-beta approvals | — | — | 3–7 |
| Emergency simulations passed | — | — | 5+ |
| Retraining required | — | — | Track |
| Retrial required | — | — | Track |
| Paused/rejected | — | — | Documented |
| Critical incidents | — | — | 0 unresolved |

Part 12 — Approval Quality Metrics

Trial pass rate

Candidates passing trial ÷ Candidates completing trial × 100

A very low pass rate may indicate weak recruitment or training.

A near-100% pass rate may indicate that assessments are too easy or failures are not being documented honestly.

Trial customer-rating average

Total customer rating points ÷ Trial reviews received

Show:

Average rating

Number of ratings

Lowest rating

Main reason for dissatisfaction

Report-completion rate

Complete trial reports ÷ Completed trials × 100

Target:

100%

A missing report may indicate poor process discipline, even when the pet-care task appeared acceptable.

Trial incident rate

Track:

Number of incidents

Severity

Preventability

Candidate involved

Corrective action

Do not rely only on one overall incident percentage.

Approval yield

Probation-approved candidates ÷ Trial candidates × 100

This measures whether recruitment and training are producing usable providers.

Reliability monitoring after approval

Final approval is not permanent.

Continue tracking:

Lateness

Cancellations

No-shows

Report completion

Customer ratings

Repeat requests

Complaints

Incidents

Availability accuracy

Rover records last-minute sitter cancellations on provider profiles because short-notice cancellations can materially disrupt customers, illustrating why reliability should remain visible after initial approval.

Week 4 decision framework

Green — Phase 3 succeeds

Use green status when:

At least 20 controlled trials are completed.

Most candidates follow safety and reporting requirements.

Fifteen or more walkers receive probationary approval.

Home-sitting supply is sufficient in the core area.

Several boarding properties pass controlled testing.

At least five candidates pass emergency simulations.

No critical incident remains unresolved.

Every decision is documented.

The final roster covers important locations and time slots.

Decision

Close Phase 3 and move to the next controlled growth or product-development stage.

Amber — Supply exists but remains fragile

Use amber when:

Candidates pass training but struggle during real services.

Report cards are frequently late or incomplete.

Approved sitters are concentrated in one time slot.

Boarding properties need corrections.

Customer ratings are acceptable but inconsistent.

Most providers remain dependent on close founder supervision.

Emergency backup coverage is weak.

Decision

Extend probation for one to two weeks and test only unresolved capabilities.

Red — Do not scale sitter supply

Use red status when:

Candidates ignore safety instructions.

Critical quiz knowledge is not applied.

Trial customers are not told about probation status.

Serious incidents are hidden.

Boarding hosts bypass property assessment.

Reports or service evidence are falsified.

No backup coverage exists.

Approval decisions are made informally.

Sitters are approved only to achieve numerical targets.

Decision

Pause new bookings, correct the training and approval system, and repeat controlled trials.

Final Phase 3 outputs

By the end of Week 4, PetSaathi should have:

Twenty to thirty completed controlled trials

Walking, sitting and boarding assessment records

Customer feedback linked to real trial bookings

Final trial scores

Service-specific probation permissions

Boarding-beta host approvals

Emergency simulation results

Retraining and retrial plans

Documented pauses and rejections

A location-based active sitter roster

A backup coverage list

A Phase 3 trust-system report

A decision on readiness for Phase 4

Final operating principle

Training teaches the sitter what to do; controlled trials determine whether the sitter can actually do it. One successful trial may create probationary service permission, but full trust is earned through repeated safe bookings, reliable attendance, accurate reports and honest incident handling. Boarding remains a controlled beta until both the host and property succeed under real operating conditions.

Simple explanation for professor

“During Week 4, PetSaathi will test trained sitter candidates through real but controlled services. Dog walkers will complete monitored walks, home sitters will complete short sitting sessions, boarding candidates will complete controlled daycare trials, and emergency candidates will complete realistic simulations. Every trial will use a suitable low-risk pet, customer consent, clear instructions, an approved backup and an assessment scorecard. Candidates will be evaluated on safety, punctuality, communication, instruction compliance, report quality and customer feedback. One successful trial will normally produce probationary approval rather than unrestricted approval. Boarding candidates will receive only controlled beta permission until they also demonstrate safe overnight operations. At the end of the week, every candidate will be approved, restricted, assigned retraining, paused or rejected with a documented reason, and PetSaathi will produce a final service- and area-specific sitter roster.”

PetSaathi Phase 3 — City-Specific Sitter Strategy 🐾

Overall assessment

Your city-level direction is sensible, but statements such as “good sitter supply,” “lower competition,” “price-sensitive customers,” “strong referral culture” and “family-style boarding will work” should not yet be treated as proven facts.

Public listings confirm that pet walking, sitting and boarding services already exist in all six cities. They do not establish:

The number of genuinely active sitters

Their verification quality

Their locality coverage

Their response rate

Their reliability

Customer willingness to pay

Actual competition intensity

Supply during the required morning and evening slots

The correct approach is:

Use each city strategy as a market hypothesis, then validate it through applications, interviews, trial bookings, repeat bookings, travel time and unit economics.

A city may have hundreds of nominal provider profiles but still lack reliable sitters in one specific locality at 7:00 AM.

Major corrections to the proposed strategy

1. Do not launch three disconnected areas simultaneously

For each city, the three listed localities should form a research shortlist, not the immediate operating footprint.

A better sequence is:

Compare all three areas.

Select one primary micro-market.

Build sufficient sitter and backup coverage there.

Open the second locality only after the first is stable.

For example, PetSaathi should not immediately operate independently across Whitefield, HSR and Sarjapur Road. It should first choose the cluster with the strongest overlap of:

Qualified customer leads

Sitter applications

Repeat demand

Short travel time

Society partnerships

Positive contribution

2. “Verified” must describe exact checks

City positioning should not simply say:

“Verified walkers.”

Use evidence-specific claims such as:

Identity checked

Video interview completed

Pet-safety training passed

Practical walking assessment passed

Approved for large-dog walking

Boarding home assessed

Background-check process completed, where actually applicable

No check makes pet care risk-free.

3. Recruitment sources are hypotheses

College students, homemakers, pet parents, trainers and apartment residents may all produce useful applicants. None should receive automatic approval because of their occupation or background.

Every applicant must enter the same pipeline:

Application → screening → interview → checks → training → practical assessment → controlled trial → probation

4. Use traffic data to set locality rules

Travel time is a major operational risk in Bengaluru, Pune, Mumbai and Ahmedabad. In 2025, TomTom reported average 10-kilometre travel times of approximately 36 minutes in Bengaluru, 33 minutes in Pune, 29 minutes in Mumbai and 29 minutes in Ahmedabad. This supports hyperlocal matching, but it does not establish one universal radius for every time, neighbourhood or transport mode.

PetSaathi should therefore measure:

Actual distance

Actual travel minutes

Time of day

Building-entry time

Parking or security delay

Mode of transport

Buffer required between bookings

Recommended city-level operating model

### Table 159

| City | Primary service hypothesis | Main supply hypothesis | Critical operating constraint |
| --- | --- | --- | --- |
| Bengaluru | Recurring dog walking | Apartment residents and trained part-time walkers | Congestion and strong existing competition |
| Pune | Walking packages | Students, residents and recurring part-time providers | Traffic, schedule continuity and price fit |
| Mumbai | Same-locality walking and home sitting | Building/locality-based providers | Travel time and fragmented locality coverage |
| Gurugram | Safety-led walking and premium sitting | Society residents and formally screened providers | Gate access, customer trust and documentation |
| Ahmedabad | Home sitting and local walking | Community referrals and locality-based caregivers | Customer education and proving organised-service value |
| Surat | Home sitting and controlled boarding | Referral-led local candidates | Building enough trained, responsive supply |

These remain validation hypotheses.

1. Bengaluru Strategy

Proposed focus

Research areas: Whitefield, HSR and Sarjapur Road

Primary service: Dog walking

Secondary service: Home pet sitting

Boarding: Controlled beta only

Positioning: Professionally operated, transparent local care

What public evidence supports

Bengaluru has active organised pet-care competition, including public sitting and walking listings in and around Whitefield. Current listings advertise home visits, walking, medication support and photo updates, demonstrating that PetSaathi would be entering an existing service market rather than creating a completely new category.

Bengaluru’s 2025 TomTom data showed a 74.4% average congestion level and an average 10-kilometre journey time of about 36 minutes. This strongly supports locality-based sitter pools and substantial travel buffers.

Claims that still require testing

The following should remain hypotheses:

“Bengaluru has good sitter supply.”

“Students and pet lovers are widely available at the required hours.”

“Customers will pay a premium for verification.”

“Whitefield will outperform HSR or Sarjapur.”

“Existing pet parents will become suitable boarding hosts.”

Public listings indicate market activity, not reliable supply.

Recommended sitter sources

Apartment residents

Potential advantages:

Shorter travel

Familiarity with building-entry procedures

Same-society backup capacity

Possibility of recurring time slots

Risks:

Society permission

Conflicts with personal schedules

Informal direct-booking diversion

Limited availability outside one building

College students and young professionals

Potentially useful for:

Morning walks

Evening walks

Weekend services

Part-time backup coverage

Required controls:

Examination and holiday availability

Stable transport

Minimum age

Practical walking assessment

Repeat-slot commitment

Existing pet parents

Potentially useful as:

Walkers

Cat sitters

Home sitters

Boarding applicants

Owning a pet is only an experience signal. Boarding still requires property assessment, household consent and a controlled trial.

Trainers

Use trainers as:

Candidate referral sources

Practical-assessment partners

Behaviour-support partners

Large-dog handling trainers

Do not automatically describe a trainer referral as a premium sitter.

Recommended operating radius

Do not set one permanent radius for all Bengaluru bookings.

Test:

### Table 160

| Situation | Starting rule |
| --- | --- |
| Recurring peak-hour walk | Prefer sitter within 1–2 km |
| Off-peak home visit | Up to 3 km if travel time is reliable |
| Emergency backup | Must meet a defined response-time threshold |
| Boarding | Distance may be wider, but transport and handover cost must be included |

The primary metric should be door-to-door travel minutes, not only kilometres.

Recommended Bengaluru action

Start with one apartment-heavy micro-market inside Whitefield, HSR or Sarjapur Road. Recruit at least five dependable walkers and two backups before actively selling recurring packages.

Minimum launch supply

Five probation or approved walkers

Two home sitters

Two backup-capable walkers

One partner veterinarian or emergency clinic relationship

No open boarding until property assessments are complete

Bengaluru positioning

Local, service-approved walkers with structured updates, report cards and backup support.

Avoid relying only on “premium verified care,” because existing providers already make professional-care and verification claims.

2. Pune Strategy

Proposed focus

Research areas: Baner, Wakad and Kharadi

Primary service: Recurring walking plans

Secondary service: Weekend or travel-period home sitting

Boarding: Controlled beta

Positioning: Reliable daily pet-care plans

What public evidence supports

Current public listings show dog-walking and sitting activity in Pune, including Kharadi and Baner-area services. This confirms both customer-category awareness and existing provider competition.

Pune’s 2025 congestion level was reported at 71.1%, with an average 10-kilometre journey taking approximately 33 minutes. This means recurring walkers should be recruited inside or immediately adjacent to the chosen micro-market rather than travelling across the city for individual ₹149–₹299 services.

Claims that require testing

Do not yet assume:

Students will be consistently available.

Customers are more price-sensitive than Bengaluru customers.

Walking packages will outperform pay-per-service bookings.

Baner, Wakad and Kharadi have similar supply.

Homemakers are the strongest source of sitters.

Pet parents will accept boarding at private homes.

Test these through conversion and performance data.

Recommended sitter sources

Students

Potential role:

Morning and evening walkers

Weekend sitters

Short-radius backup supply

Main risk:

Classes, examinations, holidays and internships can affect continuity.

Track:

Stable availability for the next eight weeks

Examination blackout dates

Transport method

Ability to support fixed repeat bookings

Apartment residents

May provide stronger recurring reliability than applicants commuting across Pune.

Use society-based recruitment for:

Same-society walkers

Cat visits

Short home-sitting sessions

Backup care

Community members with daytime availability

Do not recruit using gender or occupation assumptions. Recruit based on:

Demonstrated pet experience

Time availability

Privacy awareness

Locality

Training completion

Service trial performance

Groomers and trainers

Treat them mainly as:

Candidate referral sources

External partners

Practical-assessment resources

Do not merge grooming services into sitter approval.

Pune repeat-walking model

The correct supply design is not simply “find many walkers.”

Build small recurring pods:

### Table 161

| Pod role | Minimum |
| --- | --- |
| Primary walkers | 3–5 |
| Backup walkers | 2 |
| Home sitters | 2 |
| Weekend-capable sitters | 2 |
| Emergency-protocol-trained candidates | 1–2 |

Each recurring package should have:

Primary sitter

Defined backup coverage

Fixed or bounded time slot

Travel buffer

Advance leave process

Replacement and refund procedure

Recommended Pune action

Choose one of Baner, Wakad or Kharadi using lead density and sitter availability. Build a recurring walking network there before adding the other areas.

Package validation

Compare:

Single walk

Five-walk pack

Ten-walk pack

Fixed weekly slot

Same-sitter preference package

Do not assume the lowest price wins. Measure:

Purchase conversion

Repeat rate

Sitter payout

Support minutes

Contribution

Cancellation rate

3. Mumbai Strategy

Proposed focus

Research areas: Powai, Bandra and Andheri West

Primary service: Hyperlocal walking

Secondary service: Home pet sitting

Boarding: Very limited

Positioning: Same-locality service reliability

What public evidence supports

Mumbai’s 2025 TomTom data showed an average congestion level of 63.2%, an average 10-kilometre travel time of approximately 29 minutes and substantially slower movement during evening congestion. A hyperlocal operating model is therefore strongly justified for short, time-sensitive dog walks.

However, “smaller homes” and “limited boarding supply” should not be treated as universal city facts. Property size and boarding suitability must be measured applicant by applicant and locality by locality.

Correct interpretation of the 1–2 km rule

The proposed strict rule is:

“A sitter must be within one to two kilometres.”

This is a sensible starting constraint for recurring walks, but it should not be an unconditional city-wide rule.

Use:

For routine peak-time walking, prioritise sitters within two kilometres or within a tested maximum door-to-door travel time.

Possible exceptions:

The sitter is already working in the same building cluster.

Public transport gives a faster and more reliable route.

The sitter has exceptional capability required for a particular pet.

The booking is off-peak.

The customer accepts a wider arrival window.

A nearby beginner is unsafe for the pet, while a more distant specialist is qualified.

Safety capability must override proximity.

Recommended sitter sources

Same-building or nearby residents

This is the most strategically relevant source to test because it may reduce:

Travel cost

Late arrival

Security-entry uncertainty

Backup response time

It may also enable consecutive bookings within one building cluster.

Existing pet parents

Useful as a referral source for:

Local walkers

Cat sitters

Home-sitting candidates

Controlled boarding candidates

They must still complete the full screening process.

Trainers

Potentially useful for:

Large dogs

Pulling dogs

Yellow-risk walking

Practical assessments

Trainer candidates should not automatically receive approval for home entry or boarding.

Groomers

Manage as:

Referral partners

External service partners

Potential experienced-handler applicants

Service permissions must remain separate.

Mumbai locality-cluster model

Do not treat Powai, Bandra and Andheri West as one operating area.

Each should have a separate:

Sitter roster

Backup pool

Customer-acquisition budget

Travel-time analysis

Pricing model

Partner network

Society-entry process

A Bandra sitter should not routinely serve Powai walking bookings merely because both are within Mumbai.

Recommended Mumbai action

Launch one building or society cluster with at least three primary walkers and two local backups before expanding beyond that cluster.

Mumbai approval condition

Do not activate a locality until PetSaathi has:

Three walkers covering core slots

Two backup-capable sitters

One home sitter

Security-entry instructions

An average planned travel time below the chosen threshold

Positive contribution after local travel cost

4. Gurugram Strategy

Proposed focus

Research areas: DLF phases, Golf Course Road and Sectors 56–57

Primary service: Safety-led dog walking

Secondary service: Premium home sitting

Boarding: Controlled beta

Positioning: Transparent screening and society-compatible service

What public evidence supports

Current public platforms advertise dog walking, sitting, daycare and boarding in and around Sector 57, DLF areas and Golf Course Road, showing an established competitive market rather than an unmet category.

Gurugram Police maintains processes for employee, servant, tenant and vendor verification. This means an applicable police-verification workflow may be operationally available, but PetSaathi must confirm the appropriate category and procedure with Gurugram Police or local counsel before marketing a sitter as “police verified.”

Important verification correction

Do not say:

“Every Gurugram sitter is police verified.”

unless every relevant sitter completed the applicable official process and the result remains current.

Use:

Identity Checked

Police Verification Document Reviewed

Background Check Completed

Date of check

Scope of check

Police verification should be one trust signal, not a guarantee of future behaviour or pet-handling competence.

Society security strategy

Before launching inside a society, obtain:

Authorised point of contact

Visitor-entry process

Required identity information

Sitter registration process

Allowed entry times

Vehicle rules

Emergency-entry procedure

Replacement-sitter procedure

Do not assume one society’s rules apply to another.

Society-approved sitter list

A society list should mean:

The society has accepted PetSaathi’s defined entry or pilot process.

It should not imply that:

The society guarantees sitter quality.

The society is legally responsible for PetSaathi.

Every resident has endorsed the service.

PetSaathi has exclusive rights.

Recommended sitter sources

Society residents

Potential advantages:

Local familiarity

Shorter entry and travel time

Easier backup coverage

Screened local walkers

Their profile should show exact checks, not only the word “verified.”

Existing pet parents

May become:

Local referral sources

Sitters

Boarding applicants

They still require assessment.

Trainers

May support:

Premium handling

Large-dog assessment

Reactive-dog consultation

Practical training

Recommended Gurugram action

Build one society-specific sitter roster in a DLF, Golf Course Road or Sector 56–57 cluster, using precise verification labels and documented gate-access procedures.

Minimum society roster

Three approved or probation walkers

Two backups

Two home sitters

One emergency-protocol-trained provider

One boarding-beta host only after property assessment

One verified veterinary referral contact

5. Ahmedabad Strategy

Proposed focus

Research areas: Satellite, Bopal and South Bopal

Primary service: Home pet sitting

Secondary service: Dog walking

Boarding: Controlled beta

Positioning: Structured local care with transparent screening

What public evidence supports

Current listings show walking, sitting and broader pet-care services in Ahmedabad, including South Bopal and Satellite. This means the claim of “lower competition” cannot be assumed without a detailed local competitor and provider audit.

Ahmedabad also had a reported average 10-kilometre travel time of about 29 minutes in 2025, so hyperlocal matching remains relevant even though congestion was lower than Bengaluru or Pune in the same dataset.

Claims requiring validation

Test rather than assume:

Customers prefer offline acquisition.

Family referrals produce higher trust.

Home sitting will outperform walking.

Family-style boarding has substantial demand.

Ahmedabad has materially lower competition.

Customers need extensive education about paid pet sitting.

Recommended sitter sources

Community and society referrals

Potentially valuable because referrals provide a traceable introduction.

However, referral does not replace:

ID checking

Interview

Training

Practical assessment

Trial booking

Applicants with daytime availability

Recruit based on availability and capability, not labels such as “homemaker.”

Potential service fit:

Cat visits

Feeding visits

Home sitting

Daytime companionship

Controlled boarding

Students

Potential role:

Morning or evening walks

Weekend visits

Backup coverage

Test continuity during examinations and holidays.

Veterinary clinics and pet shops

Use as:

Customer referral sources

Applicant referral sources

Emergency contacts

Awareness partners

Their referral should not become automatic credibility certification.

Recommended Ahmedabad positioning

Avoid simply saying:

“Trusted local caretakers.”

Use:

Local caregivers approved for specific services, with defined checks, service reports and an emergency-escalation process.

This gives the customer concrete reasons for choosing PetSaathi over an informal referral.

Recommended Ahmedabad action

Compare Satellite, Bopal and South Bopal, but launch first in the cluster producing the strongest combination of home-sitting enquiries, qualified local candidates and repeat demand.

Key validation test

Compare two acquisition messages:

Trust message

Screened local sitter with report card and structured updates.

Convenience message

Local pet sitting when family members are busy or travelling.

Measure:

Lead conversion

Paid conversion

Customer questions

Main trust objection

Repeat interest

6. Surat Strategy

Proposed focus

Research areas: Vesu, Adajan and Citylight

Primary service: Home pet sitting

Secondary service: Controlled boarding

Walking: Selective local test

Positioning: Reliable local care for families and travellers

What public evidence supports

Current online listings show pet-care activity in Surat, including walking services in Adajan and Citylight, pet sitting, and boarding or broader pet-care businesses in Vesu. This indicates that organised and semi-organised alternatives already exist.

These listings do not prove that digital sitter supply is low or that referrals dominate purchasing behaviour. Search-result volume is not a reliable estimate of the true market.

Claims requiring validation

Treat these as hypotheses:

Digital acquisition will be slower.

Local referrals will outperform Instagram.

Families with pets will become suitable boarding hosts.

Customers will pay premium prices for verification.

Vesu will outperform Adajan or Citylight.

Significant sitter training gaps exist.

Recommended sitter sources

Existing customer and community referrals

Track whether referred applicants produce better:

Interview attendance

Training completion

Trial scores

Retention

No-show performance

Do not assume referral quality without measuring it.

Pet shops

Use them for:

Application-form distribution

Candidate referrals

Event promotion

Customer education

Record which shop generated each applicant.

Pet-owning households

Potential candidate roles:

Home sitters

Cat sitters

Boarding hosts

Backup caregivers

Boarding requires a full property and household assessment.

Students

Potential role:

Local walking

Weekend visits

Short-duration sitting

Require stable schedules and transport.

Recommended Surat action

Begin with one small cluster in Vesu, Adajan or Citylight, recruit through both referral and digital channels, and compare candidate quality rather than assuming one channel will win.

Recommended launch gate

Do not activate the selected area until PetSaathi has:

Three trained walking or sitting providers

Two backup candidates

At least one experienced home sitter

One emergency veterinary contact

Ten or more paid customer leads or strong booking evidence

Trial scores and service permissions recorded

Cross-City Sitter Recruitment Experiment

For every applicant, record:

City

Locality

Recruitment source

Referral source

Services requested

Availability

Travel radius

Application result

Phone-screen result

Interview result

Verification result

Training result

Trial score

Approval status

First-booking completion

Thirty-day retention

Channel metrics

Valid application rate

Valid applications ÷ Total submissions × 100

Interview pass rate

Applicants passing interview ÷ Interviews completed × 100

Training completion rate

Candidates completing mandatory training ÷ Candidates assigned training × 100

Trial pass rate

Candidates receiving probation permission ÷ Candidates completing trials × 100

Cost per approved sitter

Recruitment-channel cost ÷ Sitters receiving service permission

Thirty-day active rate

Approved sitters completing at least one booking within 30 days ÷ Approved sitters

A source that produces fifty applications but only one reliable sitter may be worse than a source producing ten applications and five reliable sitters.

City-Level Sitter Supply Dashboard

### Table 162

| Metric | Bengaluru | Pune | Mumbai | Gurugram | Ahmedabad | Surat |
| --- | --- | --- | --- | --- | --- | --- |
| Valid applications | — | — | — | — | — | — |
| Core-area applications | — | — | — | — | — | — |
| Interviews passed | — | — | — | — | — | — |
| Training completed | — | — | — | — | — | — |
| Trial passed | — | — | — | — | — | — |
| Approved walkers | — | — | — | — | — | — |
| Approved home sitters | — | — | — | — | — | — |
| Boarding-beta hosts | — | — | — | — | — | — |
| Backup coverage | — | — | — | — | — | — |
| Average sitter travel time | — | — | — | — | — | — |
| Cost per approved sitter | — | — | — | — | — | — |
| Thirty-day active rate | — | — | — | — | — | — |

Recommended city-selection scorecard

Before selecting the first city, score each location using actual evidence.

### Table 163

| Factor | Weight |
| --- | --- |
| Existing paid customer demand | 20% |
| Repeat-booking evidence | 15% |
| Qualified sitter applications | 15% |
| Reliable local sitter coverage | 15% |
| Travel and density economics | 15% |
| Customer acquisition cost | 10% |
| Partner and emergency coverage | 5% |
| Operational/legal readiness | 5% |
| Total | 100% |

Do not select a city only because it is large

A smaller city or neighbourhood may be a stronger pilot when it has:

Lower sitter travel

Better referrals

Strong repeat use

Easier operations

Reliable partners

Positive contribution

Likewise, a large market may be unattractive if customer acquisition is expensive and bookings are geographically scattered.

Corrected city strategy table

### Table 164

| City | Recommended first experiment | Recruitment priority | Main control |
| --- | --- | --- | --- |
| Bengaluru | Recurring walks in one apartment cluster | Residents, local part-time walkers, referrals | Travel-time limits and professional service evidence |
| Pune | Five- and ten-walk packages in one locality | Students, society residents, local caregivers | Schedule stability and package economics |
| Mumbai | Same-building or same-locality walking | Residents, pet-parent referrals, experienced handlers | Strict locality and door-to-door travel control |
| Gurugram | Society-specific safety-led pilot | Residents, screened walkers, trainers | Gate permissions and precise verification claims |
| Ahmedabad | Home-sitting and walking comparison | Society/community referrals, students, clinics | Customer education and trust conversion |
| Surat | Referral-versus-digital sitter test | Local networks, pet shops, pet parents, students | Training quality and measured channel performance |

Final recommendations by city

Bengaluru

Approve the strategy with modification.

Focus on one micro-market, not all three areas. Emphasise operational professionalism, local supply and reliable backup coverage rather than only generic verification.

Pune

Approve the recurring-walking hypothesis.

Test walking packages, but measure student schedule stability, travel time and normal-price conversion.

Mumbai

Approve the hyperlocal principle.

Use a one-to-two-kilometre preference for routine peak-hour walks, but apply service capability as a hard filter before distance.

Gurugram

Approve the society and documentation strategy.

Use official verification processes where applicable, but never present police or KYC checks as a complete safety guarantee.

Ahmedabad

Approve as a test, not a confirmed low-competition opportunity.

Public listings show active services. PetSaathi must prove whether structured home sitting, local trust and offline partnerships create an advantage.

Surat

Approve the slow, controlled approach.

Do not assume digital weakness or referral dominance. Run both channels and compare the quality and cost of approved sitters.

Final operating principle

PetSaathi should not create six different safety standards for six cities. The core verification, training, trial and incident rules must remain consistent. City customisation should affect locality selection, recruitment channels, travel limits, service mix, pricing tests and customer communication—not the minimum trust standard.

Simple explanation for professor

“PetSaathi will use one common sitter-verification and safety system across all cities, but its recruitment and operating strategy will change according to local conditions. Bengaluru and Pune require hyperlocal sitter pools because traffic can make distant low-value bookings unreliable. Mumbai requires an even more locality-focused model for routine walks. Gurugram should use society-specific access processes and precise verification evidence. Ahmedabad and Surat may benefit from local referrals and offline partnerships, but these assumptions must be tested rather than accepted as facts. In every city, college students, homemakers, pet parents, trainers and apartment residents will be treated only as recruitment sources. They will not receive automatic approval. PetSaathi will select one micro-market, recruit primary and backup sitters, conduct controlled trials and expand only after demand, sitter reliability, travel time and contribution are proven.”

PetSaathi Phase 3 — What Is Wrong in Many Sitter Systems 🐾

Overall assessment

The five mistakes you identified are real structural weaknesses. However, the corrected system should be more precise:

A safe sitter marketplace requires separate controls for identity, capability, service permission, pet compatibility, property suitability, booking performance and transaction integrity.

No single badge, rating or agreement can replace these controls.

Mistake 1 — One-Level Verification

Wrong approach

“The sitter’s ID was checked, so the sitter is verified.”

An identity check may help establish that the applicant is the person named in the submitted document. It does not establish that the applicant:

Can handle a dog safely

Understands pet behaviour

Will arrive on time

Can enter a customer’s home responsibly

Can complete an accurate report

Understands emergency escalation

Is suitable for boarding

Will disclose incidents honestly

Mature pet-care platforms separate these trust signals. Rover, for example, displays different badges for completing a background check and passing its knowledge quiz, while profile approval also involves a manual review. Rover explicitly states that a background check is only part of the profile-review process.

Correct approach

A sitter should pass through several independent layers:

Identity check

Structured interview

Service-specific training

Safety quiz

Practical assessment

Service-eligibility decision

Controlled trial

Probation

Booking-level scorecard

Ongoing incident and reliability monitoring

Correct verification model

### Table 165

| Dimension | Question answered |
| --- | --- |
| Identity | Is this applicant’s identity evidence acceptable? |
| Interview | Does the applicant demonstrate responsible judgement? |
| Training | Has the applicant learned PetSaathi’s procedures? |
| Practical assessment | Can the applicant apply those procedures? |
| Service permission | Which exact services may they provide? |
| Pet permission | Which species, sizes and risk levels may they handle? |
| Property assessment | Is the boarding location suitable? |
| Performance | How reliably do they perform during real bookings? |
| Integrity | Do they report problems honestly and follow payment/privacy rules? |

Recommended public profile

A customer-facing profile may display:

✅ Identity Checked✅ Video Interview Completed✅ Pet Safety Training Passed✅ Approved for Medium-Dog Walking✅ Boarding Home Assessed — where applicable⭐ 4.8/5 from 16 completed bookings

Avoid:

✅ Fully Verified

“Fully verified” implies a universal safety guarantee that no screening process can provide.

Important backend correction

Do not store one field such as:

is_verified = true

Use separate records:

identity_check = PASSED

video_interview = COMPLETED

walking_training = PASSED

walking_assessment = PASSED

boarding_home_assessment = NOT_APPLICABLE

operational_status = ACTIVE

Final rule

Identity verification confirms identity evidence. Service approval requires training, assessment and ongoing performance evidence.

Mistake 2 — Treating Every Sitter as Suitable for Every Pet

Wrong approach

“The sitter is approved, so they can handle any dog, cat or service.”

This ignores substantial differences involving:

Pet species

Dog size and strength

Anxiety

Bite history

Leash pulling

Escape history

Medical needs

Medication

Senior-pet mobility

Multi-pet households

Boarding compatibility

Customer-home access

Sitter experience

A sitter may be excellent with calm cats but unsuitable for large pulling dogs. Another sitter may be a capable walker but unsuitable for entering customers’ homes.

Rover allows sitters to maintain service-specific pet preferences so that requests are more likely to match their capabilities, demonstrating the value of matching according to provider preferences rather than treating supply as interchangeable.

Correct matching formula

Your proposed principle is correct:

Pet risk + sitter skill + distance + service type = match

However, PetSaathi should use hard eligibility filters first, followed by a ranking score.

Stage 1 — Mandatory eligibility filters

Remove a sitter from consideration when any of these conditions fail:

Operational status is active.

Sitter is approved for the requested service.

Sitter is approved for the pet species.

Dog-size permission is sufficient.

Risk permission is sufficient.

Required training remains current.

Availability matches the booking.

No conflicting booking exists.

Travel time is operationally realistic.

Boarding-property approval is current where required.

Sitter accepts the assignment and payout.

Customer accepts the proposed sitter.

A high rating must not override a failed hard filter.

Example

A sitter is:

500 metres away

Rated 5.0

Approved only for small dogs

The customer has:

A 30-kilogram Labrador

Strong leash pulling

A Yellow walking-risk classification

The sitter is ineligible, even though they are nearby and highly rated.

Stage 2 — Rank eligible sitters

After applying hard filters, rank the remaining candidates.

### Table 166

| Factor | Suggested weight |
| --- | --- |
| Pet-risk compatibility | 25% |
| Exact service capability | 20% |
| Locality and travel reliability | 20% |
| Availability fit | 15% |
| Performance and reliability | 10% |
| Customer continuity or justified preference | 5% |
| Payout and unit-economics fit | 5% |

Weights should remain configurable and be tested against actual booking outcomes.

Pet risk should be service-specific

Do not permanently label a pet with one universal risk colour.

The same dog may be:

### Table 167

| Service | Risk |
| --- | --- |
| Sitting inside its familiar home | Green |
| Walking with a new sitter | Yellow |
| Group boarding with unfamiliar dogs | Red |

Recommended fields include:

Behaviour risk

Medical risk

Handling risk

Escape risk

Environmental risk

Other-pet compatibility

Service-specific overall risk

Correct matching outcome

Every request should receive one of these decisions:

### Table 168

| Decision | Meaning |
| --- | --- |
| Accept standard | Normal approved sitter is sufficient |
| Accept with controls | Experienced sitter, meet-and-greet or additional controls required |
| Manual review | Specialist assessment is required |
| Waitlist | Suitable care exists but not at the requested time |
| Decline | PetSaathi cannot currently deliver the service safely |

Final rule

A sitter is never approved for “all pets.” Approval must specify the service, pet type, size, risk level, locality and any restrictions.

Mistake 3 — Boarding Without Home Verification

Wrong approach

“The person is an approved sitter, so they can provide boarding at home.”

Boarding introduces risks not present in a routine walk:

Overnight supervision

Escape through doors, gates or balconies

Resident-pet conflict

Children and household members

Feeding separation

Property capacity

Infectious illness

Emergency transport

Night-time distress

Society or landlord restrictions

Fire or evacuation emergencies

A safe person may have an unsafe property. A suitable property may have an unsuitable host.

Animal-welfare boarding guidance commonly evaluates the care environment, accommodation, supervision and facility standards separately from the individual caregiver.

Correct approach

Boarding permission must belong to:

A specific approved host at a specific assessed address

It should expire or require reassessment when:

The host changes address.

The property is renovated.

A new resident pet arrives.

Household circumstances change.

A serious incident occurs.

The host remains inactive for a long period.

Boarding approval requirements

### Table 169

| Requirement | Mandatory? |
| --- | --- |
| Identity check | Yes |
| Structured interview | Yes |
| Boarding training | Yes |
| Property photographs | Yes |
| Live video or physical walkthrough | Yes |
| Household consent | Yes |
| Landlord/society permission review | Where applicable |
| Secure entrance and windows | Yes |
| Balcony and gate assessment | Yes |
| Resident pets disclosed | Yes |
| Children/household members disclosed | Yes |
| Separate feeding capability | Yes |
| Separation area | Yes |
| Maximum capacity assigned | Yes |
| Health/vaccination policy accepted | Yes |
| Emergency clinic identified | Yes |
| Emergency transport available | Yes |
| Controlled daycare trial | Yes |
| Controlled overnight beta | Before unrestricted overnight approval |

Better badge terminology

Instead of:

Home Verified

Use:

Boarding Home Assessed

“Assessed” accurately communicates that the property was checked against a defined standard. It does not claim that the home is permanently risk-free.

Boarding status model

### Table 170

| Status | Meaning |
| --- | --- |
| Not eligible | Boarding requirements not met |
| Home assessment pending | Property checks incomplete |
| Property correction required | Specific defect must be corrected |
| Daycare beta approved | Short daytime bookings only |
| Overnight beta approved | Limited overnight services |
| Boarding approved | Defined boarding services permitted |
| Suspended | Boarding temporarily blocked |
| Reassessment required | Property or circumstances changed |

Final rule

An approved walker or home sitter is not automatically an approved boarding host. Both the person and the property require separate approval.

Mistake 4 — No Sitter Performance Tracking

Wrong approach

Customer feedback remains inside informal WhatsApp messages:

“Good service”

“Sitter was nice”

“Arrived late”

“My dog liked her”

This information is difficult to compare, audit or use for matching.

It also creates recency and memory bias. An admin may remember one friendly sitter while overlooking repeated late reports or cancellations.

Correct approach

Every completed booking should generate structured sitter-performance data.

Established marketplace systems use objective operational signals in addition to star ratings. Rover’s current Star Sitter criteria include repeat customers, average rating, response rate, booking conversion and last-minute cancellations. Rover also creates public records for certain late sitter cancellations.

Recommended scorecard

### Table 171

| Factor | Maximum points |
| --- | --- |
| Safety and pet handling | 25 |
| On-time arrival | 15 |
| Communication | 15 |
| Instruction compliance | 15 |
| Report quality | 10 |
| Customer rating | 15 |
| Cancellation and admin reliability | 5 |
| Total | 100 |

Data generated after each booking

Record:

Scheduled arrival

Actual arrival

Scheduled completion

Actual completion

Sitter cancellation

No-show

Required updates sent

Report submitted

Customer rating

Customer comment

Same-sitter request

Complaint

Incident

Instruction violation

Final sitter score

Structured service records can include photographs, route, distance, toilet activity, food and water information; Rover Cards provide one example of this type of standardised service record.

Use several score views

Do not overwrite sitter history with one current number.

Store:

Booking-level score

Latest-five-booking average

Latest-ten-booking average

Lifetime average

Service-specific average

Customer-rating sample size

Incident count

Trend direction

Example

### Table 172

| Sitter | Rating | Reviews | Latest-5 score | No-shows | Interpretation |
| --- | --- | --- | --- | --- | --- |
| A | 5.0 | 1 | 82 | 0 | Promising but insufficient sample |
| B | 4.8 | 25 | 91 | 0 | Strong proven performance |
| C | 4.9 | 12 | 68 | 1 | Rating strong, operational reliability weak |

Customer rating is not the whole score

A customer may give five stars even when:

The sitter submitted the report late.

The sitter arrived outside the expected window.

PetSaathi had to perform substantial support work.

An instruction was missed.

The sitter’s availability was inaccurate.

Conversely, a customer complaint may require investigation rather than automatic sitter punishment.

Rover links reviews to booked services and permits both the customer and provider to submit feedback after a booking, illustrating why reviews should be linked to actual booking records.

Safety override

A numerical score must never compensate for a serious safety or integrity violation.

Immediately pause relevant permissions when credible evidence indicates:

Abuse or reckless handling

Pet escape concealed by the sitter

Serious injury not reported

Unauthorised substitution

Falsified service evidence

Customer-address or access-code misuse

Theft

Boarding outside an assessed property

Service accepted outside eligibility

Deliberate off-platform diversion

Final rule

Every booking creates objective performance data, while serious safety incidents operate outside the score and trigger investigation.

Mistake 5 — No Anti-Poaching or Transaction-Integrity System

Wrong approach

After the first booking:

Customer receives the sitter’s number.

Sitter offers a lower private price.

Future bookings move outside PetSaathi.

PetSaathi loses revenue and booking history.

No report or incident data is created.

Customer support and refunds become difficult.

The sitter’s performance history becomes incomplete.

Major marketplaces require platform-arranged bookings to remain paid through their systems. Rover explains that off-platform payment leaves it without a booking record and may lead to account suspension; its deactivation policy also identifies deliberate fee avoidance as prohibited conduct.

However, PetSaathi should not depend only on punishment.

Correct anti-circumvention strategy

Use five layers:

Layer 1 — Make repeat booking easier on PetSaathi

Provide:

One-click or WhatsApp-assisted repeat booking

Same-sitter preference

Recurring schedules

Five- and ten-service packages

Stored pet instructions

Automatic report history

Simplified payment

Replacement support

A customer should not move outside the platform merely because rebooking is inconvenient.

Layer 2 — Give customers continuing value

On-platform bookings should provide genuine benefits such as:

Service record

Payment receipt

Report card

Customer support

Approved replacement process

Refund process

Review eligibility

Incident history

Package balance

Same-sitter continuity

Do not claim insurance, guarantees or emergency protection unless PetSaathi actually provides them under disclosed terms.

Layer 3 — Give sitters continuing value

Sitters should receive:

Reliable booking demand

Timely payouts

Repeat-customer bonuses

Premium status

Training

Local scheduling

Customer-support assistance

Replacement coordination

Transparent score history

Fair dispute and appeal processes

A sitter who receives no value beyond the first introduction has a stronger incentive to leave.

Layer 4 — Prohibit concealed diversion

The sitter agreement should prohibit:

Requesting private payment for a PetSaathi booking

Sharing a personal UPI code for a platform service

Cancelling a platform booking and recreating it privately

Hiding booking extensions

Misusing customer contact information

Falsifying the booking value

Moving active recurring bookings outside PetSaathi to avoid fees

The prohibition should focus on platform-introduced bookings and misuse of platform data, not on preventing the sitter from carrying on all independent pet-care work.

Layer 5 — Maintain a limited audit trail

PetSaathi may record:

Booking messages sent through its own system

Payment status

Modification requests

Rebooking activity

Cancellation reasons

Customer reports of private solicitation

Sitter reports of customer direct-payment requests

Do not conduct secret or disproportionate surveillance.

Where communications or personal information are stored and analysed, PetSaathi should provide a clear notice explaining the purpose, access and retention. India’s DPDP framework governs the processing of digital personal data for lawful purposes.

Important legal correction to “anti-poaching”

A broad clause such as:

“The sitter may not provide pet-care services to any customer for two years after leaving PetSaathi.”

may be legally problematic.

Section 27 of the Indian Contract Act states that agreements restraining a person from exercising a lawful profession, trade or business are void to that extent, subject to the statutory exception stated in the section.

PetSaathi should therefore use a lawyer-reviewed, narrowly framed non-circumvention and confidentiality clause, not a broad occupational ban.

Better policy principle

During an active PetSaathi booking or recurring service, a sitter must not intentionally divert the transaction, conceal direct payment or misuse customer data obtained through PetSaathi. Nothing should be drafted as a general prohibition on the sitter’s lawful independent work beyond what applicable law permits.

Incentives are more durable than punishment

A wallet or subscription may help, but it should not become the only control.

A stronger retention system combines:

Competitive package prices

Easy repeat booking

Trusted payment records

Same-sitter continuity

Fast sitter payouts

Loyalty benefits

Replacement support

Transparent dispute handling

Fair platform fees

Corrected Five-Control Framework

### Table 173

| Control layer | Primary purpose |
| --- | --- |
| Verification | Establish what checks were completed |
| Service permission | Define what the sitter may do |
| Matching | Assign the right sitter to the right pet |
| Performance monitoring | Measure real booking quality |
| Transaction integrity | Keep platform-arranged services recorded and supportable |

A sitter system fails when any of these layers is missing.

Recommended Backend Rules

Verification

A sitter cannot become ACTIVE unless required verification,

training and practical-assessment records are passed.

Matching

A booking cannot be assigned when the sitter lacks the required

service, pet-size or risk permission.

Boarding

A boarding booking cannot be confirmed unless the host and current

property have active boarding approval.

Scorecard

A completed booking must create a report, customer-feedback status

and booking-level sitter score.

Off-platform control

A booking introduced and managed through PetSaathi must use an

approved payment and booking record unless an authorised exception exists.

Safety

A critical incident may suspend permissions regardless of the

sitter's average score.

Recommended Dashboard Metrics

### Table 174

| Metric | Why it matters |
| --- | --- |
| Identity-check pass rate | Verification quality |
| Training completion rate | Candidate readiness |
| Practical-assessment pass rate | Demonstrated capability |
| Service permissions by type | Usable sitter supply |
| Risk-compatible matching rate | Matching safety |
| Average sitter travel time | Locality efficiency |
| On-time rate | Reliability |
| Report completion rate | Operational discipline |
| Repeat same-sitter rate | Customer confidence |
| Sitter cancellation rate | Supply stability |
| No-show rate | Critical reliability |
| Incident rate by severity | Safety |
| Off-platform solicitation reports | Transaction leakage |
| Repeat bookings retained on platform | Platform value |

Final Approval of the Five Principles

### Table 175

| Proposed principle | Decision | Required refinement |
| --- | --- | --- |
| ID alone is insufficient | Approve | Separate every verification and capability check |
| Match sitter to pet risk and skill | Approve | Apply hard safety filters before weighted ranking |
| Boarding requires home verification | Approve with wording change | Use “Boarding Home Assessed” and assess host plus property |
| Score every booking | Approve | Use objective fields, rolling averages and safety overrides |
| Add anti-poaching controls | Approve with legal limits | Focus on active bookings, data misuse, platform value and narrow non-circumvention |

Final Operating Principle

PetSaathi should never represent identity checking as complete sitter approval, never treat sitters as interchangeable, never permit boarding without assessing the specific property, never rely only on casual ratings, and never expect a broad anti-poaching clause to protect the marketplace. Trust must be created through specific checks, service permissions, pet-compatible matching, real booking data, strong repeat-booking value and a legally reviewed transaction-integrity policy.

Simple explanation for professor

“Many sitter platforms fail because they treat an ID check as complete verification, assign any sitter to any pet, allow boarding without assessing the home, rely on informal WhatsApp feedback and lose customers to direct off-platform bookings. PetSaathi will use a layered system. Identity, interview, training, practical assessment and service eligibility will be recorded separately. Matching will first check whether the sitter is qualified for the service, pet size and risk level before considering distance and ratings. Boarding will be allowed only when both the host and the specific property have passed assessment. Every completed booking will create structured performance data, while serious safety problems will override the score. PetSaathi will also encourage repeat bookings through convenience, packages, sitter continuity and support. Its agreement will prohibit concealed diversion of platform bookings, but it will not broadly prevent sitters from carrying out lawful independent work.”

PetSaathi Phase 3 — Decision on the Five Proposed Upgrades 🐾

Executive decision

### Table 176

| Proposed upgrade | Decision | Official treatment |
| --- | --- | --- |
| L0–L8 sitter verification levels | Reject as one mandatory linear ladder | Replace with separate onboarding status, verification badges, service permissions and performance tiers |
| Mandatory pet-risk classification | Approve with modification | Use UNASSESSED, GREEN, YELLOW, RED; keep acceptance or rejection as a separate booking decision |
| Separate boarding-host approval | Approve | Make person-and-property approval mandatory before boarding |
| Sitter anti-poaching agreement | Approve with substantial legal redrafting | Use a narrow non-circumvention and transaction-integrity clause |
| Mandatory sitter-training quiz | Approve with modification | Quiz, critical-question pass and practical assessment required before activation |

Upgrade 1 — Mandatory L0–L8 Sitter Levels

Proposed approach

L0 Applicant

L1 Phone Verified

L2 ID Verified

L3 Interviewed

L4 Trained

L5 Background Checked

L6 Home Verified

L7 Premium

L8 Emergency Ready

Decision: Do not make this official as one linear verification ladder

The concept is visually simple, but it combines several independent dimensions:

### Table 177

| Proposed level | Actual dimension |
| --- | --- |
| Applicant | Application stage |
| Phone verified | Contact verification |
| ID verified | Identity verification |
| Interviewed | Screening activity |
| Trained | Training status |
| Background checked | Separate verification check |
| Home verified | Boarding-property assessment |
| Premium | Performance tier |
| Emergency ready | Training plus operational capability |

A walker does not need a boarding-home assessment. A boarding host may have an assessed home but still lack enough completed bookings for premium status. A premium walker may not currently be available as an emergency backup.

Rover’s current system similarly distinguishes individual badges—for example, background-check completion and passing its Rover 101 knowledge quiz—while sitter profiles also undergo a separate manual approval review. A background check is described as only one part of profile approval.

Official replacement

Use four separate systems.

1. Onboarding status

APPLIED

SCREENING

INTERVIEW_SCHEDULED

INTERVIEW_COMPLETED

VERIFICATION_PENDING

TRAINING_PENDING

PRACTICAL_ASSESSMENT_PENDING

PROBATION

APPROVED

ON_HOLD

REJECTED

2. Evidence-based badges

PHONE_CONFIRMED

IDENTITY_CHECKED

VIDEO_INTERVIEW_COMPLETED

REFERENCE_CHECKED

BACKGROUND_CHECK_COMPLETED

PET_SAFETY_TRAINING_PASSED

BOARDING_HOME_ASSESSED

3. Service permissions

DOG_WALKING

HOME_PET_SITTING

CAT_HOME_VISIT

BOARDING_BETA

SENIOR_PET_CARE

Each permission should also state pet size, risk level, locality and restrictions.

4. Performance tiers

NEW

ACTIVE

PROVEN

PREMIUM

“Emergency backup” should be an operational capability based on current availability and reliability, not the final level of identity verification.

Final ruling

Reject L0–L8 as the official backend source of truth.

It may be retained as a simple presentation diagram for explaining the broad journey, but the database and admin workflow must store the underlying checks separately.

Upgrade 2 — Mandatory Pet-Risk Classification

Decision: Approve with modification

Every pet should receive a service-specific risk assessment before sitter matching.

However, the risk values should be:

UNASSESSED

GREEN

YELLOW

RED

Do not use:

REJECTED

as a risk level.

Rejection is a business decision taken after PetSaathi compares the risk with available controls and sitter capability.

Separate booking decisions

Use:

ACCEPT_STANDARD

ACCEPT_WITH_CONTROLS

MANUAL_REVIEW

WAITLIST

DECLINE

Example

A red-risk pet could be:

Accepted with a specialist sitter and veterinary care plan

Changed from group boarding to individual home sitting

Placed under manual review

Declined because no suitable caregiver is available

Therefore:

Red does not automatically mean rejected, and green does not mean risk-free.

Risk must be service-specific

The same pet could have different assessments:

### Table 178

| Service | Risk |
| --- | --- |
| Home sitting in its familiar environment | Green |
| Walking with a new sitter | Yellow |
| Boarding with unfamiliar pets | Red |

Mandatory risk dimensions

Record:

Behaviour risk

Medical risk

Handling risk

Escape risk

Environmental risk

Compatibility with other animals

Service-specific overall risk

Data-protection requirement

Pet medical history, behavioural information, customer addresses and emergency details are personal and sensitive operational records. PetSaathi should collect only information required for the stated purpose, restrict access and maintain retention and deletion rules. India’s DPDP Act provides the core framework for lawful digital-personal-data processing, and the final DPDP Rules, 2025 were published with phased commencement dates.

Official rule

No booking may proceed to sitter matching until the applicable pet-risk assessment has been completed.

Exceptions should exist only for true emergencies handled through a documented manual escalation process.

Upgrade 3 — Boarding-Host Approval System

Decision: Approve and make mandatory

Boarding is materially different from walking or visiting a pet in the owner’s home because the provider controls the environment for an extended period.

Approval must apply to:

A specified host at a specified property address.

It should not apply generally to the person across every home they may use.

Minimum boarding approval requirements

### Table 179

| Requirement | Mandatory |
| --- | --- |
| Identity checked | Yes |
| Structured video interview | Yes |
| Boarding-specific training passed | Yes |
| Home photographs reviewed | Yes |
| Live video or physical walkthrough | Yes |
| Secure entrance, windows and balcony | Yes |
| Household consent | Yes |
| Existing pets disclosed | Yes |
| Children and other residents disclosed | Yes |
| Separate feeding arrangement | Yes |
| Pet-separation area | Yes |
| Maximum capacity assigned | Yes |
| Health and vaccination policy accepted | Yes |
| Emergency clinic mapped | Yes |
| Emergency transport confirmed | Yes |
| Local property/society requirements reviewed | Yes |
| Controlled daycare trial | Yes |
| Controlled overnight beta before full approval | Yes |

Recommended badge wording

Use:

Boarding Home Assessed

Do not use:

Home Fully Verified

“Assessed” accurately states that PetSaathi reviewed the property against its current checklist. It does not imply that the home is permanently safe under every circumstance.

Reassessment triggers

Boarding approval should be suspended or reassessed after:

Change of address

Major property renovation

New household resident

New resident pet

Serious complaint or incident

Material change in capacity

Extended inactivity

Expiry of required verification evidence

The Animal Welfare Board of India is the statutory advisory body on animal-welfare laws and publishes guidance covering pet owners, caregivers and related welfare matters; PetSaathi should additionally check the applicable state, municipal, property and society requirements before activating boarding in any locality.

Official rule

No boarding booking may be confirmed unless both the host approval and the current property approval are active.

Upgrade 4 — Sitter Anti-Poaching Agreement

Decision: Approve only after substantial redrafting

The commercial concern is valid. PetSaathi should prevent a sitter from using customer information obtained through the platform to secretly divert an active or recurring booking.

However, a broad clause such as:

“The sitter cannot work directly with any PetSaathi customer for two years after leaving the platform.”

may be legally vulnerable.

Section 27 of the Indian Contract Act states that an agreement restraining a person from exercising a lawful profession, trade or business is void to that extent, subject to the limited statutory exception contained in the section.

Use a narrow non-circumvention clause

The sitter agreement should prohibit:

Requesting direct payment for a PetSaathi booking

Sharing a personal UPI code for an active platform service

Cancelling a platform booking and recreating it privately

Concealing an extension or repeat service

Misusing customer phone numbers, addresses or booking data

Falsifying the booking price to avoid platform charges

Taking a substitute or additional payment that is not recorded

Soliciting an active recurring PetSaathi customer to move the same engagement off-platform

The clause should not prohibit

All independent pet-care work

Work for competing platforms generally

Customers independently acquired without PetSaathi information

The sitter’s lawful profession after leaving PetSaathi

Personal relationships that existed before the PetSaathi introduction

Suggested policy wording

During the provider relationship, the sitter must not intentionally divert, conceal or convert an active booking, repeat plan or customer relationship introduced and managed through PetSaathi into an unrecorded direct transaction. The sitter must not misuse customer information supplied by PetSaathi or request undisclosed payment relating to a PetSaathi service. Any restriction after termination will apply only to the extent permitted by applicable law.

This wording still needs review by an India-qualified lawyer before contractual use.

Commercial controls are equally important

A contract alone will not prevent leakage. PetSaathi must provide continuing value through:

Easy repeat booking

Same-sitter preference

Packages and subscriptions

Fast sitter payouts

Replacement support

Report history

Customer service

Fair dispute resolution

Repeat-booking bonuses

Official rule

All PetSaathi-arranged services must remain recorded and paid through an approved PetSaathi process, subject to documented exceptions.

Upgrade 5 — Mandatory Sitter-Training Quiz

Decision: Approve with modification

No sitter should become operationally active without passing the relevant training assessment.

Rover’s current badge system separately recognises completion of a background check and passing its knowledge quiz, illustrating that knowledge assessment can serve as one distinct trust signal rather than replacing the entire approval process.

Quiz alone is insufficient

The required process should be:

Training module completed

→ Quiz passed

→ All critical safety questions passed

→ Practical assessment passed

→ Controlled trial completed

→ Probation permission granted

Recommended passing standards

### Table 180

| Sitter type | Overall score | Critical safety questions |
| --- | --- | --- |
| Dog walker | 80% | 100% correct |
| Home sitter | 80% | 100% correct |
| Boarding candidate | 85% | 100% correct |
| Emergency-backup candidate | 90% | 100% correct |

These are internal PetSaathi standards rather than legal or universal industry requirements.

Safety-critical questions

A wrong answer should prevent activation when it concerns:

Pet escape

Bite or injury reporting

Serious breathing difficulty

Heatstroke or seizure escalation

Unapproved medication

Sending an unauthorised substitute

Concealing an incident

Customer-address or access-code privacy

Off-leash walking against policy

Accepting a service outside permission

Retake rule

Allow:

One targeted retraining attempt

A new quiz with different questions

Trainer review after repeated failure

Do not allow unlimited immediate retries that encourage answer memorisation.

Official rule

No sitter may receive active service permission until all mandatory modules, quiz requirements, critical safety questions and applicable practical assessments have been passed.

Passing the quiz makes the candidate eligible for trial service; it does not automatically create full approval.

Final Official Decisions

### Table 181

| Rule | Final decision | Official wording |
| --- | --- | --- |
| L0–L8 levels | Not approved as a linear verification system | Store onboarding status, badges, service permissions and performance tiers separately |
| Pet-risk classification | Approved | Mandatory service-specific UNASSESSED/GREEN/YELLOW/RED assessment before matching |
| Boarding-host approval | Approved | Separate host-and-property approval required before boarding |
| Anti-poaching rule | Conditionally approved | Use narrow, lawyer-reviewed non-circumvention and platform-transaction clauses |
| Training quiz | Approved | Mandatory quiz, critical-question pass and practical assessment before trial activation |

Recommended Phase 3 Official Policy

PetSaathi will use a layered sitter trust system rather than one universal verification level. Each sitter’s application status, identity checks, interviews, training, service permissions, property assessments, performance and current operational status will be stored independently. Every pet will receive a service-specific risk assessment before matching. Boarding will require separate approval of both the host and the specified property. Platform-arranged bookings must remain recorded and paid through PetSaathi, using a narrowly drafted and legally reviewed transaction-integrity clause. No sitter will become active without passing required training, safety questions, practical assessment and controlled trial requirements.

Simple explanation for professor

“I approve four of the five recommendations, although several require modification. Pet-risk assessment, separate boarding approval and mandatory training assessments should become official Phase 3 rules. The anti-poaching policy should also be included, but it must be written as a narrow non-circumvention rule rather than a broad ban on the sitter’s future work. I do not recommend using L0 to L8 as one official verification ladder because it combines application stages, identity checks, training, home assessment, performance and emergency availability. These should be stored separately. This architecture is clearer, safer and more suitable for PetSaathi’s future admin dashboard and application.”

PetSaathi Phase 3 — Final Deliverables, Exit Report and Phase 4 Decision 🐾

Executive decision

Phase 3 should be approved as PetSaathi’s sitter trust-system phase, with one major architectural correction:

Do not make L0–L8 a single official verification ladder.

Application progress, verification evidence, training, service permissions, boarding-property approval, emergency capability and performance status are independent dimensions. Mature platforms similarly separate background-check badges, knowledge-quiz badges and manual profile approval rather than treating one check as complete approval.

Final ruling on the five proposed rules

### Table 182

| Proposed rule | Decision | Official treatment |
| --- | --- | --- |
| L0–L8 sitter verification levels | Reject as the backend source of truth | May be used only as a simplified presentation diagram |
| Pet-risk classification | Approve with modification | Mandatory UNASSESSED/GREEN/YELLOW/RED assessment; acceptance is a separate decision |
| Separate boarding-host approval | Approve | Both the host and the specific property must be approved |
| Anti-poaching sitter agreement | Conditionally approve | Use a narrow, lawyer-reviewed non-circumvention clause |
| Training quiz before approval | Approve | Mandatory quiz, critical safety pass, practical assessment and controlled trial |

1. Final Phase 3 Deliverables

Your proposed list is strong, but several items need renamed or upgraded.

### Table 183

| Deliverable | Status | Definition of completion |
| --- | --- | --- |
| Sitter application form | Required | Tested form, unique application IDs, consent notices and source tracking |
| Sitter CRM | Required | Tracks application, checks, training, permissions, trials, scores and status history |
| Sitter interview script | Required | Standard phone and video questions with scoring and red-flag rules |
| Sitter verification levels | Replace | Use separate verification checks, public badges, onboarding status and performance tier |
| Sitter training modules | Required | Versioned modules with learning objectives and assigned service categories |
| Sitter quiz | Mandatory | Not merely recommended; includes critical safety questions |
| Sitter agreement | Required | Lawyer-reviewed provider terms, transaction rules, privacy and grievance process |
| Boarding-host checklist | Required for boarding | Host checks, property assessment, household consent, capacity and trial approval |
| Pet-risk classification | Required | Service-specific behavioural, medical, handling and environmental assessment |
| Sitter scorecard | Required | Booking-level scores, rolling performance and safety overrides |
| Emergency protocol | Required | Severity rules, veterinary escalation, incident reporting and corrective actions |
| Sitter payout model | Required | Service payouts, bonuses, deductions, timing and dispute handling |
| Final approved sitter roster | Required | Current service permissions, areas, availability, restrictions and backup status |

Additional mandatory deliverables

The following items are missing from the original list.

Service-permission matrix

It should state exactly what every sitter may provide:

Service type

Pet species

Maximum dog size

Maximum risk level

Approved locality

Maximum pet count

Medication restrictions

Boarding capacity

Permission status and expiry

Trial and probation register

For every candidate, record:

Trial booking

Pet-risk level

Customer consent

Supervisor or backup

Trial score

Customer rating

Incident result

Final approval decision

Availability and backup-coverage matrix

The roster must show whether usable capacity exists for:

Morning walks

Evening walks

Weekend sitting

Boarding

Emergency replacements

Primary micro-market coverage

Privacy and document-retention policy

This should cover identity documents, address information, home photographs, customer locations, incident evidence and pet medical information.

India notified the DPDP Rules in November 2025 with staged commencement of the Act’s provisions. PetSaathi should therefore design purpose limitation, restricted access, security, retention and deletion into the system before Phase 4 rather than retrofitting them later.

Admin approval and audit history

Record:

Who approved the sitter

Who reviewed each check

Who awarded a badge

Who changed a service permission

Who suspended or reinstated a sitter

Why the decision was made

When it became effective

Suspension, investigation and appeal SOP

Every serious complaint should follow:

Concern reported → temporary restriction → evidence collected → sitter response → decision → corrective action → reinstatement/restriction/removal

2. Correct Verification Architecture

Do not use this as one official ladder

L0 Applicant

L1 Phone Verified

L2 ID Verified

L3 Interviewed

L4 Trained

L5 Background Checked

L6 Home Verified

L7 Premium

L8 Emergency Ready

The ladder incorrectly implies that:

Every sitter must have a boarding-home assessment.

Home assessment is “higher” than background checking.

Premium is a verification check.

Emergency availability is permanent.

A sitter must complete every preceding level.

Use four independent systems

A. Onboarding status

SUBMITTED

UNDER_REVIEW

PHONE_SCREENING

INTERVIEW_SCHEDULED

INTERVIEW_COMPLETED

VERIFICATION_PENDING

TRAINING_PENDING

PRACTICAL_ASSESSMENT_PENDING

PROBATION_ACTIVE

APPROVED

ON_HOLD

REJECTED

WITHDRAWN

B. Verification badges

PHONE_CONFIRMED

IDENTITY_CHECKED

VIDEO_INTERVIEW_COMPLETED

REFERENCE_CHECKED

BACKGROUND_CHECK_COMPLETED

PET_SAFETY_TRAINING_PASSED

BOARDING_HOME_ASSESSED

C. Service permissions

DOG_WALKING

HOME_PET_SITTING

CAT_HOME_VISIT

SENIOR_PET_CARE

BOARDING_DAYCARE_BETA

BOARDING_OVERNIGHT_BETA

D. Performance tiers

NEW

PROBATION

ACTIVE

PROVEN

PREMIUM

Emergency backup should be recorded as a current operational capability, not a permanent verification level.

3. Revised Phase 3 Final Report Format

Phase 3 Sitter Trust System Report

A. Pilot scope

### Table 184

| Field | Result |
| --- | --- |
| City | — |
| Primary micro-market | — |
| Secondary areas tested | — |
| Phase 3 duration | — |
| Services assessed | — |
| Boarding status | Not offered / daycare beta / overnight beta |
| Report date | — |

B. Recruitment funnel

### Table 185

| Metric | Result | Definition |
| --- | --- | --- |
| Raw applications | — | All submissions |
| Valid applications | — | Complete, unique and relevant |
| Phone screens completed | — | Calls actually completed |
| Video interviews completed | — | Interviews actually attended |
| Final shortlist | — | Candidates selected for checks and training |
| Withdrawn applicants | — | Candidate voluntarily exited |
| Rejected applicants | — | Application formally declined |
| Applicants on hold | — | Potentially suitable later |

“Total applications” should not include duplicate, spam or substantially incomplete submissions.

C. Verification results

### Table 186

| Check | Requested | Submitted | Passed | Failed | Pending |
| --- | --- | --- | --- | --- | --- |
| Phone confirmation | — | — | — | — | — |
| Identity check | — | — | — | — | — |
| Address-information review | — | — | — | — | — |
| Video interview | — | — | — | — | — |
| Reference check | — | — | — | — | — |
| Background check | — | — | — | — | — |
| Boarding-home assessment | — | — | — | — | — |

“Documents collected” must remain separate from “checks passed.”

D. Training results

### Table 187

| Metric | Result |
| --- | --- |
| Candidates assigned training | — |
| Mandatory training completed | — |
| Training-completion rate | — |
| Quiz attempts | — |
| Quiz passes | — |
| Critical-safety failures | — |
| Practical assessments passed | — |
| Emergency simulations passed | — |
| Retraining required | — |

Correct training-completion formula

Candidates completing every assigned mandatory module ÷ Candidates assigned training × 100

Every active sitter must complete 100% of the modules required for their service. The 80% target applies to cohort conversion, not to how much of an individual sitter’s mandatory training they may skip.

E. Trial and approval results

### Table 188

| Metric | Result |
| --- | --- |
| Controlled trials scheduled | — |
| Controlled trials completed | — |
| Unique candidates tested | — |
| Trial pass rate | — |
| Retrials required | — |
| Probation-approved providers | — |
| Fully approved providers | — |

Service permissions awarded

### Table 189

| Permission | Number |
| --- | --- |
| Approved walkers | — |
| Approved home sitters | — |
| Approved cat sitters | — |
| Approved senior-pet sitters | — |
| Daycare-beta boarding hosts | — |
| Overnight-beta boarding hosts | — |
| Emergency-backup providers | — |

These numbers may overlap because one person may hold several permissions. Report both:

Unique approved providers

Total service permissions awarded

F. Performance results

### Table 190

| Metric | Result |
| --- | --- |
| Average booking-level sitter score | — |
| Latest-five average by sitter | — |
| Average customer rating | — |
| Number of customer ratings | — |
| Review coverage | — |
| On-time rate | — |
| Report-completion rate | — |
| Sitter cancellation rate | — |
| Sitter no-show rate | — |
| Same-sitter repeat requests | — |

Do not report a 4.8 rating without also reporting the number of reviews.

G. Safety and incident results

### Table 191

| Metric | Result |
| --- | --- |
| Total incidents | — |
| Level 1 incidents | — |
| Level 2 incidents | — |
| Level 3 critical incidents | — |
| Near misses | — |
| Incidents reported on time | — |
| Open investigations | — |
| Overdue corrective actions | — |
| Unresolved critical incidents | — |

Pet first aid should remain temporary assistance; critical symptoms require veterinary consultation or emergency care. The final protocol should therefore be reviewed by a registered veterinarian, with practitioner credentials checked through the applicable council or VCI register.

H. Supply and capacity results

### Table 192

| Metric | Result |
| --- | --- |
| Active sitters in primary area | — |
| Morning walking capacity | — |
| Evening walking capacity | — |
| Weekend sitting capacity | — |
| Boarding-beta capacity | — |
| Backup coverage by service | — |
| Average sitter travel time | — |
| Uncovered time slots | — |
| Projected 30-day booking capacity | — |

I. Commercial results

### Table 193

| Metric | Result |
| --- | --- |
| Recruitment cost | — |
| Cost per valid applicant | — |
| Cost per trial-ready candidate | — |
| Cost per approved active sitter | — |
| Average sitter payout | — |
| Trial-booking contribution | — |
| Best recruitment source | — |
| Highest-quality sitter source | — |

“Top sitter source” should be based on cost per approved and active sitter, not the channel that produced the most forms.

J. Main findings

### Table 194

| Finding | Result |
| --- | --- |
| Strongest sitter source | — |
| Best micro-market | — |
| Strongest service supply | — |
| Largest supply gap | — |
| Top pet-risk issue | — |
| Top sitter-safety issue | — |
| Main training weakness | — |
| Main operational bottleneck | — |
| Main data-quality problem | — |
| Main legal/compliance issue | — |

K. Final decision

Select one:

Move to Phase 4

Conditional move to Phase 4

Extend probation and trials

Repeat Phase 3 recruitment

Improve training

Change primary micro-market

Remove or postpone boarding

Pause product development

Every decision should include:

Reasons

Failed gates

Corrective actions

Responsible owner

Deadline

Reassessment date

4. Corrected Go/No-Go Criteria for Phase 4

A. Hard safety and governance gates

PetSaathi should not move to Phase 4 unless all of these are satisfied.

### Table 195

| Hard gate | Requirement |
| --- | --- |
| Critical incidents | Zero unresolved critical incidents |
| Incident reporting | 100% of incidents formally recorded |
| Corrective actions | No overdue critical corrective action |
| Active-sitter training | 100% of required modules completed |
| Critical quiz questions | 100% passed |
| Service permissions | Mapped for every active sitter |
| Pet-risk process | Operational before matching |
| Boarding controls | Current host-and-property approval for every boarding provider |
| Emergency process | Tested through simulation or incident drill |
| Sensitive-data access | Restricted by staff role |
| Admin decisions | Approval and suspension history auditable |

Boarding legality must also be reviewed for the specific state and locality. Requirements can differ materially: for example, Tamil Nadu’s February 2026 policy regulates boarding facilities and expressly states that home boarding is not allowed there.

B. Supply gates

### Table 196

| Metric | Recommended gate |
| --- | --- |
| Unique approved or probation-active providers | 20–30 target |
| Approved walkers | At least 15 |
| Approved home sitters | At least 8–10 |
| Reliable providers in primary micro-market | At least 10–15 |
| Emergency-backup providers | At least 5 |
| Uncovered critical time slots | None or documented limits |
| Backup coverage | Available for every active core service |

Boarding correction

“Five or more approved boarding hosts” should be a hard gate only when boarding is included in the Phase 4 MVP.

When Phase 4 launches walking and home sitting first, PetSaathi should not delay the core product solely because it has fewer than five boarding hosts. Boarding can remain a separate controlled beta.

A safer boarding target is:

Three to five daycare-beta hosts initially

Fewer hosts with strong controls are preferable to ten weakly assessed hosts

Overnight approval only after a successful daycare test and overnight beta

C. Quality gates

### Table 197

| Metric | Recommended gate |
| --- | --- |
| Average customer rating | 4.5 or higher |
| Minimum review sample | Preferably at least 20 completed-service reviews |
| Report completion | 100% target |
| Sitter on-time rate | 95% or higher |
| Trial/probation pass quality | No approval solely to meet numerical targets |
| Serious complaint status | No unresolved high-severity complaint |

D. Reliability gates

The proposed 5–10% no-show threshold is rejected.

At 100 bookings:

A 5% no-show rate means five customers receive no service.

A 10% rate means ten customers receive no service.

That is incompatible with a safety-sensitive premium-care proposition.

### Table 198

| Reliability metric | Correct gate |
| --- | --- |
| Sitter no-show target | 0% |
| Maximum warning threshold | Below 2% |
| Unexplained no-shows | Every case investigated |
| Sitter cancellation rate | Track separately; preferably below 5% |
| Repeat unexplained no-show | Suspension or removal review |

For comparison, Rover’s current top-tier Star Sitter criteria require last-minute cancellations at 2% or less, and severe safety concerns may independently affect status. A PetSaathi no-show should be treated even more seriously than an ordinary cancellation.

E. Data-quality gates

### Table 199

| Metric | Requirement |
| --- | --- |
| Unique sitter IDs | 100% |
| Recruitment source captured | 100% |
| Verification records complete | 100% of active sitters |
| Service permissions mapped | 100% |
| Training records linked | 100% |
| Trial results linked | 100% |
| Status history recorded | 100% |
| Critical CRM completeness | At least 95% |
| Duplicate active profiles | 0 |
| Expired evidence producing public badges | 0 |

F. Cross-phase business gates

Phase 3 should not be evaluated in isolation. Phase 4 also requires the Phase 2 evidence to remain valid.

### Table 200

| Business gate | Requirement |
| --- | --- |
| Core service identified | Yes |
| Primary micro-market identified | Yes |
| Paid customer demand | Demonstrated |
| Repeat demand | Demonstrated |
| Contribution at normal price | Positive or credibly near-positive |
| Support workload | Measured |
| Booking SOP | Stable |
| Customer and sitter demand overlap | Present in the same locality |

Building a PWA cannot fix negative unit economics, weak demand or an unsafe boarding model.

5. Correct Phase 3 Win Condition

The proposed win condition is directionally correct:

“Enough trusted sitters to safely complete 100+ future bookings in one city without quality collapse.”

It should be made measurable.

Official win condition

PetSaathi has a service-specific, area-specific sitter roster capable of supporting at least 100 projected bookings over the next 30 days, plus approximately 20% operational headroom, while maintaining backup coverage, required training, a 4.5+ rating target, near-zero no-shows, complete report cards and no unresolved critical safety incident.

Capacity calculation

Do not calculate capacity from headcount alone.

For each sitter, record:

Approved service

Available weekly slots

Area

Maximum daily bookings

Travel buffer

Existing commitments

Risk and size permissions

Backup availability

Then calculate:

Usable monthly capacity= sum of approved sitter slots− existing commitments− travel conflicts− leave/unavailability− safety reserve

For a target of 100 monthly bookings, the roster should preferably offer approximately 120 usable service slots, rather than exactly 100, so cancellations, leave and uneven time-slot demand do not immediately cause service failure.

Quality-collapse warning signs

The 100-booking capacity test fails when:

Most capacity depends on two or three sitters.

Morning demand exceeds available slots.

No backup exists for recurring customers.

Boarding capacity is counted before property approval.

Sitters are approved outside the primary area.

Report completion declines as volume rises.

Founder intervention is required for every routine booking.

Contribution becomes negative because of travel or support work.

6. Final Decision on the Five Rules

Rule 1 — L0–L8 verification levels

Decision: Reject as the official system

Use L0–L8 only as a simple visual explanation, not in the database or operational decision process.

Official replacement

Onboarding status

Verification checks

Public badges

Service permissions

Operational status

Performance tier

Current backup capability

Rule 2 — Pet-risk classification

Decision: Approve

Official values:

UNASSESSED

GREEN

YELLOW

RED

Separate booking decisions:

ACCEPT_STANDARD

ACCEPT_WITH_CONTROLS

MANUAL_REVIEW

WAITLIST

DECLINE

No booking should enter automatic matching while the pet remains UNASSESSED.

Rule 3 — Separate boarding-host approval

Decision: Approve

Boarding permission must be tied to:

The approved host

The approved address

Capacity

Household conditions

Resident pets

Service type

Current assessment date

A normal sitter approval cannot create boarding permission.

Rule 4 — Anti-poaching agreement

Decision: Conditionally approve

Use a narrow non-circumvention clause covering:

Active PetSaathi bookings

Recurring PetSaathi plans

Undisclosed direct payment

Booking-value concealment

Misuse of customer data

Cancelling and recreating a booking privately

Do not impose a broad ban on the sitter’s future lawful profession or all independent work. Section 27 of the Indian Contract Act states that restraints on lawful trade, profession or business are void to that extent, subject to the statutory exception. Final wording requires review by an India-qualified lawyer.

Rule 5 — Training quiz before approval

Decision: Approve

Official sequence:

Mandatory modules completed

→ Quiz passed

→ Critical questions passed

→ Practical assessment passed

→ Controlled trial passed

→ Probation permission

→ Ongoing performance monitoring

The quiz is mandatory, but it is not sufficient by itself. Rover’s current process also combines a safety quiz with profile information, testimonials, background checking and manual review rather than treating the quiz as complete approval.

7. Recommended Phase 4 Entry Decision

Move to Phase 4

Proceed when:

All hard safety and data gates pass.

One core micro-market has sufficient provider coverage.

Walking and sitting capacity can support the projected booking volume.

Phase 2 demand and unit economics remain valid.

Routine workflows no longer change every day.

Manual operations clearly identify what should be automated.

Conditional move

Proceed with a restricted PWA build when:

Walking and sitting are validated.

Boarding is not ready.

Some providers remain on probation.

The core booking flow is stable.

Remaining gaps can be isolated from the MVP.

In this case, boarding should remain admin-only or disabled.

Do not move

Pause Phase 4 when:

Serious safety actions remain open.

Pet risk is not consistently recorded.

Verification claims are vague.

Sitters lack exact service permissions.

No-show performance is poor.

Supply remains geographically scattered.

The CRM cannot produce reliable reports.

A full app is being used to avoid fixing the manual process.

8. Phase 4 MVP Scope

The first PWA should automate only proven Phase 2 and Phase 3 workflows.

Customer flow

Customer account

Pet profile

Pet-risk questionnaire

Service request

Sitter proposal

Price and payment

Booking status

Service updates

Pet Report Card

Rating

Repeat booking

Sitter flow

Profile and evidence-specific badges

Service permissions

Availability

Booking offer

Accept or decline

Service checklist

Incident escalation

Report submission

Payout ledger

Admin flow

Sitter onboarding

Verification queue

Training status

Service-permission matrix

Manual matching

Booking operations

Incident centre

Payout approval

Audit history

Area-capacity dashboard

Features to postpone

Open self-service boarding

Fully automatic matching

AI-based risk decisions

Public sitter ranking based on tiny samples

Complex wallet system

Nationwide launch

Unrestricted in-app direct communication

Advanced subscription architecture before package demand is proven

Final Phase 3 Recommendation

PetSaathi should complete Phase 3 with:

A layered sitter trust system containing evidence-specific verification checks, service permissions, pet-risk matching, mandatory training, safety assessments, controlled trials, scorecards, payout rules, emergency procedures, boarding-property approval and auditable admin decisions.

The final output should not merely be a list of “verified sitters.” It should be a roster showing:

Who the sitter is

What checks were completed

Which services they may provide

Which pets they may handle

Where and when they are available

How they performed

What restrictions apply

Whether backup coverage exists

Simple explanation for professor

“At the end of Phase 3, PetSaathi will have a complete sitter trust system rather than only a database of applicants. The system will contain the sitter application form, CRM, interviews, verification records, training, quiz results, practical assessments, service permissions, trial scores, boarding-home checks, pet-risk matching, emergency procedures, payout rules and a final active roster. I do not recommend making L0 to L8 the official verification architecture because those levels combine different concepts. Instead, application status, identity checks, training, service permissions, property approval and performance will be stored separately. Pet-risk classification, boarding-host approval and training assessments will be mandatory. The anti-poaching provision will be written narrowly as a non-circumvention rule and reviewed legally. PetSaathi will move to Phase 4 only when it has sufficient hyperlocal capacity, near-zero no-shows, strong customer ratings, complete safety records, clean CRM data and enough reliable sitter availability to support at least one hundred projected bookings without operational or quality failure.”

## Representative rendered pages

- Page 1: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-1.png`

- Page 2: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-2.png`

- Page 3: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-3.png`

- Page 4: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-4.png`

- Page 5: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-5.png`

- Page 41: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-41.png`

- Page 81: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-81.png`

- Page 121: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-121.png`

- Page 161: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-161.png`

- Page 201: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-201.png`

- Page 241: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-241.png`

- Page 281: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-281.png`

- Page 321: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-321.png`

- Page 361: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-361.png`

- Page 401: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-401.png`

- Page 441: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-441.png`

- Page 481: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-481.png`

- Page 521: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-521.png`

- Page 561: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-561.png`

- Page 601: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-601.png`

- Page 616: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-616.png`

- Page 617: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-617.png`

- Page 618: `analysis/specs/PetSaathi_Phase_2_and_3/pages/page-618.png`
