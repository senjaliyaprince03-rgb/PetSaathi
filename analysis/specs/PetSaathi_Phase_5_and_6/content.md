# PetSaathi Phase 5 and 6

- Source: `DOCX/PetSaathi Phase 5 and 6.docx`
- Pages: 1169
- Ordered content blocks: 29007
- Embedded media: 4
- Comments: 0
- Tracked insertions: 0
- Tracked deletions: 0

## Ordered content

PetSaathi Phase 5 — Controlled Launch in One City Area 🚀🐾

Executive decision

A 45–60 day controlled launch is the correct next phase.

Phase 5 is not primarily a development phase. It is an operational validation phase where PetSaathi must prove that it can repeatedly:

Acquire a real pet parent.

Convert the user into a paid booking.

Assign an eligible sitter.

Deliver the service safely.

Send a useful Pet Report Card.

Resolve problems quickly.

Generate a repeat booking.

The launch should follow the same principle as a staged software rollout: expose the product to a limited cohort, monitor the result, halt expansion when important defects appear and increase exposure only after the previous cohort remains stable. Google Play formally supports percentage-based staged releases and the ability to halt a rollout; the same risk-control principle is appropriate for PetSaathi’s service rollout.

1. Phase 5 core goal

Launch PetSaathi in one tightly controlled geography, complete real paid bookings, measure service quality and prove that customers want to book again.

Phase 5 must answer six questions:

### Table 1

| Question | Evidence required |
| --- | --- |
| Will pet parents pay? | Verified paid bookings |
| Can suitable sitters be assigned? | High assignment success |
| Can services be delivered reliably? | High completion and low no-show rates |
| Do customers trust the experience? | Ratings, complaints and interviews |
| Will customers return? | Repeat bookings |
| Can the team operate it without chaos? | Support, report and incident performance |

2. Recommended initial launch configuration

Based on the decisions already made for PetSaathi:

City: Ahmedabad

Initial area: Bopal

Second area: Satellite, after validation

Initial service: Dog walking

Secondary service: Home pet sitting

Boarding: Disabled initially

Matching: Manual admin-controlled

Payment: Verified full prepayment

Risk acceptance: Green and selected Yellow cases

Initial sitters: 3–5 fully approved sitters

Initial booking cap: 3 bookings per day

Maximum after stability: 5–7 bookings per day

Why start with one area

A dense micro-area provides:

Faster sitter assignment

Lower sitter travel time

Better backup coverage

Easier customer support

More useful word-of-mouth

More repeat booking opportunities

Clearer pricing validation

The correct structure is:

One city

↓

One micro-area

↓

One primary service

↓

Limited sitter group

↓

Controlled daily capacity

↓

Quality proof

↓

Area expansion

Do not enable the entire city merely because addresses can technically be entered.

3. Recommended duration

15-day fast launch

Suitable only for:

Technical validation

Internal users

A few supervised bookings

Identifying obvious operational failures

It is generally too short to measure meaningful repeat behaviour.

30-day standard launch

Suitable for:

Early conversion measurement

Initial sitter performance

Basic channel testing

Customer interviews

Repeat demand may still be difficult to measure because many users will not yet have had enough time to book again.

45–60 day controlled launch — recommended

This gives PetSaathi time to measure:

Initial acquisition

Paid conversion

Service completion

Customer satisfaction

Sitter reliability

Repeat bookings

Support workload

Refunds and incidents

Differences between acquisition channels

GA4 Funnel Exploration can show where users succeed or abandon the journey, including movement from one-time purchase to repeat purchase.

4. Correct interpretation of the paid-booking target

Your target of 100–300 paid bookings should be treated as a range, not a single mandatory number.

Approximate booking pace

Over 45 days

100 bookings ≈ 2.2 paid bookings per day

300 bookings ≈ 6.7 paid bookings per day

Over 60 days

100 bookings ≈ 1.7 paid bookings per day

300 bookings = 5 paid bookings per day

Recommended target levels

### Table 2

| Level | Paid bookings | Meaning |
| --- | --- | --- |
| Minimum evidence | 100 | Enough to identify major operational patterns |
| Strong pilot | 150–200 | Better evidence for conversion and repeat behaviour |
| Stretch target | 300 | Attempt only when service quality remains stable |

Do not chase 300 bookings by accepting unsuitable pets, overloading sitters or expanding into unsupported areas.

One hundred high-quality bookings with strong repeat demand is more valuable than three hundred chaotic bookings with complaints, refunds and sitter failures.

5. Phase 5 controlled rollout stages

Stage 0 — Launch-readiness gate

Before accepting the first external booking, verify:

Customer, sitter and admin journeys pass

Live Razorpay payment is verified

Booking webhook is working

Notifications are delivering

Three or more approved sitters are active

Area pricing is approved

Support person is assigned

Emergency veterinary contacts are verified

Incident drill has been completed

Production backup and restore have been tested

No Severity 0 or Severity 1 defect remains

Google Cloud’s operational-readiness guidance recommends defining service-performance expectations, implementing monitoring and alerting, testing performance and planning capacity before production operation.

Stage 1 — Trusted concierge pilot

Duration

Days 1–7

Users

Team contacts

Friends or family with pets

Known apartment residents

Existing trusted referrals

Target

10–15 paid or tightly supervised bookings

Operating approach

Every booking is manually reviewed.

The team should personally verify:

Customer understands the service

Pet Profile is complete

Sitter is appropriate

Payment is captured

Service begins on time

Report Card is delivered

Customer is contacted afterward

Exit conditions

No critical authorization failure

No duplicate payment

No unexplained booking-state mismatch

90%+ completed service rate

100% Report Cards delivered

No unresolved serious incident

Customer understands booking statuses

If this stage fails, do not increase acquisition.

Stage 2 — Limited external pilot

Duration

Days 8–21

Users

Invited Bopal pet parents

Apartment-society contacts

Vet or pet-shop referrals

Small hyperlocal campaign audience

Cumulative target

25–50 paid bookings

Daily booking cap

3–4 bookings per day

Focus

Test real customer behaviour

Measure booking-form drop-off

Validate pricing

Measure assignment speed

Test sitter acceptance

Measure support burden

Identify repeated questions

Exit conditions

Assignment success at least 90%

Report Card delivery at least 95%

Support can manage active services

No-show rate below 5%

Payment reconciliation is stable

No unresolved severe incident

Stage 3 — Acquisition experiments

Duration

Days 22–35

Cumulative target

50–120 paid bookings

Test a small number of channels separately.

Recommended channels:

Customer referrals

Apartment-society partnerships

Veterinary clinic or pet-shop referrals

Google Business Profile

Hyperlocal Google Search campaigns

Meta ads that open a WhatsApp conversation

Local pet-parent communities

Google supports Business Profiles for service-area businesses that visit customers, explicitly including examples such as pet walkers. Service areas can be defined by city, postal code or locality.

Meta supports ads that open a WhatsApp conversation, which can be useful for an assisted-booking test rather than forcing every early user into a fully self-service flow.

Important acquisition rule

Do not launch all channels on the same day with one combined campaign.

Each lead must contain attribution such as:

source

campaign

area

service

referrer

first_contact_at

booking_id

Stage 4 — Repeat-demand validation

Duration

Days 36–50

Cumulative target

75–200 paid bookings

Focus

Same-sitter repeat booking

Second booking within 14 or 30 days

Weekly walking-plan waitlist

Referral behaviour

Service consistency

Sitter continuity

Customer reasons for not repeating

After each completed service, show:

Book the same sitter again

Repeat this service

Join weekly walking-plan waitlist

Refer another pet parent

Update care instructions

The system must still revalidate:

Sitter availability

Current pricing

Pet health information

Service-specific risk

Address

Payment

Active restrictions

Stage 5 — Final proof and decision

Duration

Days 51–60

Target

100–300 total paid bookings

Main tasks

Review all metrics

Interview customers

Interview sitters

Analyse acquisition channels

Analyse areas

Analyse services

Review incidents

Calculate unit economics

Review technical reliability

Decide whether Phase 6 may begin

6. End-to-end real booking flow

Step 1 — Customer acquisition

A customer discovers PetSaathi through:

Referral

Society partnership

Vet or pet-shop partner

Google search

Google Business Profile

Instagram/Facebook

WhatsApp campaign

Local event

Record the acquisition source before or during signup.

Step 2 — Customer onboarding

The customer:

Creates an account.

Verifies contact information.

Creates a Pet Profile.

Adds behaviour and care information.

Adds health and vaccination information.

Accepts current policies.

Admin or support assists only where necessary.

Step 3 — Booking request

The customer selects:

Service

Pet

Date and time

Address

Booking instructions

The backend:

Verifies ownership

Checks area availability

Checks Pet Profile completeness

Calculates price

Creates booking and snapshots

Places booking in review

Initial status:

REQUESTED

Step 4 — Admin review

Admin checks:

Area eligibility

Pet risk

Current health declaration

Required controls

Requested time

Sitter supply

Price

Possible results:

APPROVE_FOR_MATCHING

REQUEST_MORE_INFORMATION

PROPOSE_DIFFERENT_TIME

PROPOSE_DIFFERENT_SERVICE

DECLINE

Step 5 — Sitter matching

Admin identifies eligible sitters based on:

Service permission

Availability

Area and radius

Pet size

Risk permission

Verification validity

Schedule conflicts

Active restrictions

Offer flow:

Offer sent

↓

Sitter views

↓

Accepts or declines

↓

Admin confirms primary sitter

Matching remains human-controlled during Phase 5.

Step 6 — Payment

After the sitter and final price are approved:

PAYMENT_PENDING

The customer completes Razorpay Checkout.

The backend verifies:

Signature

Captured status

Order ID

Amount

Currency

Booking relationship

Only then:

CONFIRMED

Step 7 — Pre-service preparation

Send the customer:

Booking code

Confirmed sitter

Service time

Preparation instructions

Support contact

Cancellation summary

Send the sitter:

Necessary Pet Profile information

Address

Care instructions

Handling controls

Emergency information

Expected earning

Step 8 — Service delivery

The sitter:

Arrives.

Starts service.

Records start time.

Follows authorised care instructions.

Uploads updates.

Reports concerns immediately.

Completes the service.

Safely hands over or secures the pet.

Step 9 — Report Card

The sitter submits:

Start and end time

Food and water information

Toilet update

Mood

Activity/walk details

Photos or video

Notes

Concern status

Target:

Report delivered within 30 minutes after dog walking

Report delivered within 60 minutes after sitting

These are recommended internal operating targets, not external promises unless consistently achievable.

Step 10 — Customer feedback

After report delivery:

Ask for rating

Ask whether the customer would book again

Ask one short open-feedback question

Offer same-sitter rebooking

Offer referral action

Support should contact dissatisfied customers rather than simply collecting a low rating.

7. Correct metric definitions

Metrics are useful only when their numerator, denominator and time window are defined.

7.1 Paid bookings

Definition

Unique production bookings with:

payment_status = CAPTURED

and verified amount/currency

Exclude:

Test bookings

Zero-value internal bookings

Duplicate payment attempts

Booking requests that never reached payment

Track fully refunded bookings separately rather than deleting them from history.

Target

100–300 during the 45–60 day launch

7.2 Completed booking rate

Formula

Bookings reaching SERVICE_COMPLETED

÷

Confirmed bookings whose scheduled service time has passed

× 100

Exclude:

Future bookings

Bookings cancelled by the customer before the service window, if analysed separately

Track separately:

Customer cancellation

Sitter cancellation

Pet illness

Replacement failure

No-show

Incident termination

Target

90% minimum

95% preferred

7.3 Customer rating

Formula

Average overall rating

from eligible completed-booking reviews

Also display:

Number of reviews

Review response rate

Rating distribution

Service

Sitter

Area

Target

4.5+/5 stretch target

Do not make a scale decision from three five-star reviews.

Recommended minimum evidence:

At least 25 legitimate reviews

and at least 50% review response

A rating of 4.3 from 80 reviews may be more informative than 5.0 from four reviews.

7.4 Repeat customer rate

Correct definition

Customers completing a second paid booking

÷

Customers eligible to repeat within the selected time window

× 100

Recommended repeat window:

30 days after first completed service

A customer who completed their first booking yesterday should not yet be counted as a failed repeat customer.

Target

25–35%

GA4 includes repeat-purchaser and purchaser metrics when valid purchase events are sent, but PetSaathi’s database should remain the authoritative source for operational repeat-rate calculation.

7.5 Report Card delivery

Formula

Reports delivered to customers

÷

Completed services

× 100

Use delivered, not merely saved as draft or submitted by the sitter.

Target

95%+

Operationally:

100% should be the desired standard.

95% is the minimum expansion threshold.

Any missing report requires an assigned owner and reason.

7.6 Sitter no-show rate

Formula

Confirmed assigned bookings with sitter no-show

÷

Confirmed assigned bookings due

× 100

Target

Below 5%

However, also track the absolute number.

One no-show in twenty bookings already equals 5%.

Recommended operational target:

Zero unhandled no-shows

100% customer contact

100% replacement or refund decision

7.7 Refund and dispute rate

Formula

Paid bookings with refund or formal dispute

÷

Total paid bookings

× 100

Target

Below 5%

Separate refund reasons:

Customer changed plan

Sitter unavailable

No eligible replacement

Service-quality problem

Payment duplicate

Pet illness

Safety cancellation

Goodwill compensation

A refund caused by customer cancellation is operationally different from a refund caused by unsafe service.

7.8 Support response time

Do not measure only the average.

Track:

Median response time

90th percentile response time

Maximum response time

Recommended active-service target

Median: under 5 minutes

90th percentile: under 10 minutes

Non-active booking support

Urgent upcoming booking: under 30 minutes during operating hours

General enquiry: within one business day

The “under 10 minutes” target requires a staffed support rota whenever a booking is active.

7.9 Assignment success

Formula

Approved booking requests receiving eligible sitter assignment

÷

Approved booking requests

× 100

Target

90%+

Also track:

Median assignment time

Number of offers required

Decline reasons

Area

Service

Risk requirement

Time of day

8. Identifying the best acquisition channel

The best channel is not the one generating the most clicks.

Evaluate each channel using:

Qualified leads

Pet Profiles completed

Booking requests

Paid bookings

Customer acquisition cost

Cancellation rate

Completion rate

Repeat rate

Refund rate

Contribution margin

Example channel scorecard

### Table 3

| Channel | Leads | Paid bookings | Cost per paid customer | Repeat rate | Quality |
| --- | --- | --- | --- | --- | --- |
| Referrals | 30 | 15 | ₹100 | 40% | Strong |
| Society partnership | 45 | 18 | ₹180 | 33% | Strong |
| Click-to-WhatsApp ads | 100 | 12 | ₹550 | 17% | Needs work |
| Search ads | 40 | 10 | ₹420 | 20% | Moderate |

“Best channel identified” means

It has meaningful paid-booking volume

Acquisition cost is sustainable

Bookings complete successfully

Customers repeat

Refunds and incidents remain acceptable

Do not select a channel based on impressions or leads alone.

9. Identifying the best area

Evaluate each area using:

Demand

Paid booking density

Time to assign

Sitter travel time

Offer acceptance

Service completion

Repeat booking

Support cases

Refunds

Incidents

Contribution margin

Example

### Table 4

| Area | Paid bookings | Assignment time | Completion | Repeat | Decision |
| --- | --- | --- | --- | --- | --- |
| Bopal | 60 | 18 min | 95% | 32% | Expand |
| Satellite | 25 | 42 min | 88% | 20% | Improve supply |
| Distant area | 12 | 95 min | 75% | 8% | Disable temporarily |

The best area should provide both demand and operational density.

10. Identifying the best service

Evaluate services using:

Booking demand

Customer willingness to pay

Assignment success

Sitter availability

Service duration

Gross margin

Support effort

Incident rate

Repeat frequency

Likely pilot comparison

Dog walking

Advantages:

Frequent repeat potential

Short service duration

Easier trial product

Easier same-sitter continuity

Risks:

Time-sensitive

Strong leash handling

Weather

No-shows are highly visible

Home sitting

Advantages:

Higher booking value

Strong customer need during travel

Longer service window

Risks:

Home access

More care instructions

Higher trust requirement

Boarding

Advantages:

Higher transaction value

Risks:

Compatibility

Property suitability

Vaccination

Overnight care

Escape risk

Much greater operational complexity

Recommendation:

Dog walking = primary Phase 5 service

Home sitting = controlled secondary test

Boarding = remain disabled

11. Daily operating rhythm

Morning operations review

Review all bookings for the day

Confirm sitter availability

Confirm payments

Confirm Pet Profile and instructions

Check backup sitter options

Review support rota

Review open incidents

Before each service

Send reminder

Confirm sitter acknowledgement

Confirm customer preparation

Confirm address and access

Verify no new health or behaviour change

During each service

Monitor service start

Monitor delayed starts

Respond to support

Escalate concerns

Record replacements

After each service

Confirm service completion

Confirm Report Card

Confirm customer delivery

Release earning eligibility

Request feedback

Record operational issue

End-of-day review

Bookings requested

Bookings assigned

Payments captured

Services completed

Reports missing

Support response

Refunds

Incidents

Technical errors

12. Weekly review meeting

Every seven days, review:

Acquisition

Leads by channel

Conversion by channel

Acquisition cost

Area demand

Operations

Assignment rate

Assignment time

Sitter acceptance

No-shows

Late starts

Report delivery

Customer

Rating

Complaints

Repeat booking

Cancellation reasons

Interview findings

Finance

Revenue

Refunds

Sitter earnings

Contribution margin

Payment failures

Safety

Concerns

Incidents

Pet reassessments

Sitter restrictions

Technology

Errors

Slow pages

Webhook delay

Notification failures

Upload failures

Google’s reliability guidance recommends using explicit reliability policies to slow or stop new changes when service reliability deteriorates rather than continuing expansion regardless of user impact.

13. Expansion gates

Do not wait until Day 60 to notice a problem.

Use booking-volume gates.

Gate A — After 10 completed bookings

Required:

No critical payment defect

No cross-user access defect

All reports delivered

No unresolved serious incident

Gate B — After 25 completed bookings

Required:

Completion at least 90%

Assignment at least 90%

Report delivery at least 95%

Support P90 under 10 minutes during service

No-show below 5%

Then consider:

Increase booking cap from 3 to 4 per day

Gate C — After 50 completed bookings

Required:

Payment flow stable

At least two reliable acquisition sources

Sitter capacity remains sufficient

Ratings and interviews are positive

Repeat bookings begin appearing

Then consider:

Add Satellite

or

Add controlled home sitting

Do not expand area and service simultaneously unless the team can distinguish the cause of any performance change.

Gate D — After 100 paid bookings

Review:

Unit economics

Repeat rate

Best channel

Best area

Best service

Support scalability

Incident rate

Technical stability

Only then evaluate Phase 6.

14. Stop and pause conditions

Immediately pause new bookings when:

Payment capture is unreliable

Duplicate charges occur

Customer or sitter data is exposed

Confirmed bookings lack available sitters

Severe incident is uncontrolled

Support cannot respond to active services

Report Cards are consistently missing

Database integrity is uncertain

Incorrect pricing reaches customers

Sitter verification is unreliable

The pause should disable new requests, while preserving access to:

Active bookings

Report Cards

Support

Incident information

Refund status

15. Phase 5 team structure

For a small pilot, one person may hold more than one role, but responsibilities must remain explicit.

### Table 5

| Responsibility | Required owner |
| --- | --- |
| Booking operations | Operations lead |
| Sitter assignment | Operations/admin |
| Customer support | Support owner |
| Safety incidents | Safety owner |
| Payment reconciliation | Finance owner |
| Technical monitoring | Developer |
| Acquisition tests | Growth owner |
| Daily metrics | Product owner |

No active booking should run without a named operations and support owner.

16. Phase 5 dashboard

The daily dashboard should display:

New visitors

Qualified leads

Pet Profiles completed

Booking requests

Bookings approved

Bookings assigned

Payments started

Payments captured

Services scheduled today

Services started

Services completed

Reports delivered

Reviews submitted

Repeat bookings

Refunds

Open incidents

Notification failures

Technical errors

Funnel

Visitor

↓

Book CTA

↓

Booking form start

↓

Booking request

↓

Admin approval

↓

Sitter assignment

↓

Payment

↓

Booking confirmation

↓

Service completion

↓

Report delivery

↓

Review

↓

Repeat booking

Use GA4 to analyse funnel abandonment, but use PetSaathi database records for financial and operational decisions.

17. Correct Phase 6 entry criteria

Do not move to Phase 6 only because 60 days have passed.

Required minimum evidence

Volume

At least 100 verified paid bookings

Delivery quality

Completed booking rate ≥90%

Report delivery ≥95%

Assignment success ≥90%

Sitter no-show <5%

Customer quality

Rating close to or above 4.5

with a meaningful review sample

Repeat customer rate ≥25%

using an eligible 30-day cohort

Financial and service health

Refund/dispute rate <5%

No unresolved critical payment mismatch

Basic positive contribution path identified

Operational control

Support P90 under 10 minutes during active service

Incident process proven

Best area identified

Best service identified

Best acquisition channel identified

Technical control

No open Severity 0 or Severity 1 defects

No known cross-user access vulnerability

Payment/webhook reconciliation stable

Backups and monitoring working

18. Phase 6 decision outcomes

Decision A — Move to Phase 6

Use when:

Demand exists

Repeat demand exists

Quality is stable

Operations can scale

Unit economics show a reasonable path

Possible Phase 6 scope:

Full GPS tracking

More advanced sitter matching assistance

Recurring walking plans

Additional areas

Improved sitter scheduling

Enhanced notifications

Decision B — Extend Phase 5

Use when:

Customer satisfaction is strong

Volume is too small

Repeat cohort is immature

Acquisition evidence is incomplete

Extend the pilot without adding major features.

Decision C — Fix operations

Use when:

Demand exists

Assignment or sitter quality is weak

Reports are inconsistent

Support is overloaded

Do not expand marketing until operations improve.

Decision D — Fix conversion

Use when:

Traffic and leads exist

Booking or payment conversion is weak

Service delivery quality is good

Focus on pricing, trust, booking UX and payment friction.

Decision E — Rework the offer

Use when:

Users show interest but do not pay

Repeat demand is weak

Service does not solve an urgent problem

Acquisition cost is unsustainable

19. Phase 5 deliverables

Operational deliverables

One live service area

Verified sitter pool

Controlled daily booking capacity

Support rota

Emergency escalation

Sitter replacement process

Daily operations checklist

Incident drill

Customer follow-up process

Product deliverables

Production booking flow

Verified payment

Admin assignment

Sitter service workflow

Report Card

Review and repeat booking

Pilot metrics dashboard

Growth deliverables

Channel attribution

Acquisition experiments

Best channel analysis

Best area analysis

Best service analysis

Referral test

Society-partnership test

Reporting deliverables

Daily operations report

Weekly pilot review

Customer-interview summary

Sitter feedback summary

Incident summary

Financial summary

60-day Phase 5 report

Phase 6 decision

20. Phase 5 final report format

Phase 5 Controlled Launch Report

Project:

Launch city:

Launch areas:

Launch period:

Primary service:

Secondary service:

Number of active sitters:

Total pilot customers:

Funnel

Visitors:

Booking-form starts:

Booking requests:

Approved requests:

Assigned bookings:

Payment attempts:

Paid bookings:

Confirmed bookings:

Completed bookings:

Reports delivered:

Reviews:

Repeat bookings:

Performance

Booking completion:

Payment success:

Assignment success:

Average assignment time:

Report Card delivery:

Sitter no-show:

Customer rating:

Repeat customer rate:

Refund rate:

Incident rate:

Support response:

Acquisition

Channels tested:

Best channel:

Cost per paid customer:

Best area:

Best service:

Quality

Critical incidents:

Open incidents:

Severity 0 bugs:

Severity 1 bugs:

Known limitations:

Decision

MOVE_TO_PHASE_6

EXTEND_CONTROLLED_LAUNCH

FIX_OPERATIONS

FIX_CONVERSION

REWORK_OFFER

Final Phase 5 operating principle

Phase 5 must optimise for learning and safe repeatability, not maximum booking volume. PetSaathi should increase customers, services and areas only when the previous cohort proves that payment, assignment, service delivery, Report Cards, support and safety remain under control.

Simple explanation for professor

“Phase 5 is the controlled launch stage of PetSaathi. The platform will not launch across India. It will first launch in one city and one selected area, such as Bopal in Ahmedabad, with a limited number of verified sitters and a limited number of bookings per day.

A customer will create a Pet Profile and submit a booking request. The admin will review the pet information and find an eligible sitter. The sitter will accept the offer, the customer will complete verified payment and the booking will become confirmed. After the service, the sitter will submit a Pet Report Card and the customer can submit a review or book again.

The launch should continue for 45 to 60 days because this provides enough time to measure both first bookings and repeat bookings. The launch will begin with trusted customers and then gradually open to external users. Booking capacity will increase only when payment, sitter assignment, service completion, Report Cards and customer support remain stable.

The main target is 100 to 300 paid bookings, but the team should not chase volume by reducing service quality. Important metrics include booking completion, customer rating, repeat customers, sitter no-shows, refunds, Report Card delivery and support response time.

The best acquisition channel will be selected based on paid customers, acquisition cost, service quality and repeat demand—not only clicks or leads. The best area will be identified using booking density, sitter travel time, assignment success and repeat booking. The best service will be selected using demand, profitability, operational effort and customer retention.

PetSaathi should move to Phase 6 only when it has at least 100 real paid bookings, strong completion and Report Card rates, low no-shows and disputes, repeat customers, stable technical performance and a clearly identified best channel, area and service.”

PetSaathi Phase 5 — Launch Scope and Offer Strategy 🚀🐾

Executive decision

Your Phase 5 service mix is directionally correct, with two important adjustments:

Dog walking should be the primary launch service.

Pet boarding should not be publicly active from the first day. It should remain an invite-only beta that activates only after separate safety, property and operational checks pass.

Recommended launch scope:

### Table 6

| Service | Recommended launch status | Decision |
| --- | --- | --- |
| Dog walking | Active — primary service | Approve |
| In-home pet sitting | Active — controlled | Approve with limits |
| Pet boarding | Invite-only beta | Approve after beta gate |
| Emergency vet support | Partner referral and escalation | Approve with precise wording |
| Grooming | Partner-led experiment | Optional |
| Training | Not in Phase 5 | Defer |
| Pet taxi | Not in Phase 5 | Defer |

The Phase 5 operating principle should be:

Launch one reliable recurring service first, validate customer trust and repeat demand, and introduce higher-risk services only after the core operation remains stable.

1. Recommended Phase 5 service scope

1.1 Dog walking — Active primary service

Dog walking is the strongest service for testing recurring demand because customers may need it several times per week.

It also gives PetSaathi a relatively short, measurable service cycle:

Booking request

→ sitter assignment

→ payment

→ 30-minute walk

→ photo/update

→ Report Card

→ same-sitter rebooking

Launch configuration

Duration: 30 minutes initially

Area: Bopal

Pets per booking: One dog initially

Payment: Full prepayment

Matching: Manual admin-controlled

Risk: Green and selected Yellow cases

Service hours: Controlled morning and evening windows

Suitable pilot time slots

Morning: 6:30 AM–9:30 AM

Evening: 5:00 PM–8:00 PM

These windows should be adjusted according to weather, sitter availability and local demand rather than hard-coded permanently.

Required service evidence

Sitter check-in

Server-recorded start time

Photograph or short video

Water/toilet update

Manual walk duration

Optional manual distance

Completion time

Pet mood

Sitter note

Concern flag

Do not advertise continuous GPS tracking until that capability actually exists.

1.2 Pet sitting — Active, but controlled

Pet sitting can test a deeper level of trust because the caregiver may enter the customer’s home and remain responsible for feeding, water, play, medication or general supervision.

Start with:

Drop-in visit: 60 minutes

Extended sitting: Up to 2 hours

Daytime only

One household per booking

No overnight care initially

Do not include on day one

Overnight sitting

Complex medication administration

Pets with unstable medical conditions

Unreviewed bite history

Several unfamiliar pets together

Services requiring constant medical supervision

Required controls

Full customer address released only after assignment and confirmation

Home-entry instructions

Emergency contact

Relevant veterinary contact

Structured Pet Profile

Sitter permission for the pet type and care task

Start and completion evidence

Report Card

Pet sitting should initially remain lower-volume than dog walking because its operational and privacy requirements are greater.

1.3 Pet boarding — Invite-only controlled beta

Boarding has a higher transaction value, but it also creates significantly more operational exposure:

Overnight responsibility

Escape prevention

Other-pet compatibility

Feeding separation

Property suitability

Vaccination review

Sleeping arrangements

Emergency transport

Customer drop-off and collection

Longer incident exposure

Therefore:

Public boarding search: Disabled initially

Boarding application: Waitlist or Request Review

Actual bookings: Invite-only

Boarding beta activation gate

Do not accept a boarding booking until all these conditions are satisfied:

Sitter or host

Identity and address verified

Boarding property reviewed

Landlord or society permission where applicable

Secure doors, gates and windows

Approved pet capacity

No active safety restriction

Overnight caregiver available

Emergency transport plan

Suitable separation area

Pet

Current profile completed

Vaccination evidence reviewed under approved policy

Other-animal compatibility assessed

Separation-anxiety information available

Escape history reviewed

Food and sleep instructions complete

Meet-and-greet completed

Current-health declaration received

Booking

Emergency contacts

Veterinary clinic

Emergency clinic

Spending authorisation where supplied

Drop-off and pickup window

Food and medication handover

Written boarding controls

AVMA emergency-planning guidance recommends retaining veterinarian and 24-hour emergency-contact information, while its sitter-care guidance notes that many sitters, boarding services and veterinary clinics use emergency-care authorisation forms.

Recommended boarding beta restrictions

Maximum guest pets: One initially

Length: One night initially

Pet type: Dogs with completed assessment

Medication: No complex medication

Risk: Green only initially

Other resident pets: No contact unless separately approved

Bookings per host: One active beta booking

1.4 Emergency veterinary support — Partner referral and escalation

“Emergency vet support” must not imply that PetSaathi itself provides veterinary treatment.

Use precise customer-facing language:

PetSaathi maintains local veterinary and emergency-clinic contacts and can help customers and assigned sitters escalate urgent situations. Veterinary assessment and treatment are provided by independent qualified veterinary professionals.

PetSaathi should provide

Verified regular clinic contact

Verified emergency clinic contact

Operating hours

Address and map location

Last-verified date

Customer emergency contact

Emergency escalation procedure

Incident record

Transport information where available

PetSaathi should not

Diagnose the pet

Recommend medication changes

Promise treatment availability

Guarantee clinical outcomes

Present a general helpline as veterinary care

AVMA recommends contacting a veterinarian or emergency veterinary clinic immediately for urgent concerns and advises that any concern about an animal’s health warrants at least contacting a veterinary professional.

1.5 Grooming — Optional partner test

Grooming should not be built as a full internal module during early Phase 5.

Instead, use a partner-led experiment:

Customer requests grooming

→ PetSaathi sends qualified lead to approved partner

→ Partner confirms availability

→ Customer receives clear provider identity and price

→ PetSaathi records referral outcome

Measure

Grooming enquiries

Confirmed referrals

Customer satisfaction

Partner reliability

Support burden

Commission or referral economics

A current Ahmedabad marketplace page lists at-home grooming packages around ₹800–₹1,499, demonstrating that grooming is a materially different service and price category from basic walking or sitting.

Do not distract the core operations team by building grooming scheduling, groomer inventory and service customisation before dog walking is stable.

1.6 Training and pet taxi — Defer

Training

Training requires:

Trainer qualifications

Behavioural assessment

Multi-session programmes

Progress plans

Customer homework

Complex outcome expectations

Public Ahmedabad listings show training prices and programme structures far above simple walking transactions, reinforcing that training needs a separate operating model.

Pet taxi

Pet taxi requires:

Vehicle verification

Driver verification

Restraint and crate standards

Pickup and handover controls

Route operations

Transport incidents

Vehicle hygiene

Insurance and liability review

Neither belongs in the core Phase 5 launch.

2. Correct launch model

Your proposed launch journey is correct. It should operate as follows.

MVP live in controlled area

↓

Invite warm leads

↓

Customer sees launch offer

↓

Customer creates account and Pet Profile

↓

Customer requests booking

↓

Admin reviews pet, area and schedule

↓

Admin sends offer to eligible sitter

↓

Sitter accepts

↓

Admin confirms primary assignment

↓

Customer completes verified payment

↓

Booking confirmed

↓

Sitter performs service

↓

Report Card delivered

↓

Customer submits review

↓

Same-sitter repeat offered

↓

Performance measured daily

3. Step-by-step launch operation

Step 1 — Activate the MVP in one micro-area

Recommended initial configuration:

City: Ahmedabad

Area: Bopal

Primary service: Dog walking

Secondary service: One-hour in-home sitting

Boarding: Invite-only waitlist

Daily booking cap: Three

Active sitters: Three to five

Use feature flags so other cities, areas and services remain disabled without requiring a new deployment.

Step 2 — Invite warm leads

Start with customers from:

Personal and professional contacts

Apartment-society groups

Veterinary-clinic referrals

Pet-shop referrals

Existing pet-parent communities

Friends and family referrals

Warm leads are valuable because the team can speak to them directly and understand why they book, hesitate, cancel or repeat.

Every lead should record:

Acquisition source

Campaign or partner

Area

Pet type

Requested service

First contact date

Booking conversion

Repeat conversion

Step 3 — Present one clear launch offer

Do not display five competing offers on the first screen.

Primary offer:

₹99 first 30-minute dog walk

+ Pet Report Card

+ photo update

+ same-sitter repeat option

Customer should immediately understand:

What the service is

How long it lasts

Where it is available

What proof they receive

What the normal repeat price is

That assignment remains subject to PetSaathi review

Step 4 — Customer creates the Pet Profile

Before the first booking, collect:

Pet identity

Weight

Walking equipment

Pulling severity

Stranger response

Bite or escape history

Medical restrictions

Food allergies

Emergency contact

Veterinary information

Do not ask the customer to complete a twelve-step booking form. The Pet Profile should be reusable across bookings.

Step 5 — Admin reviews the request

The admin verifies:

Customer is inside the enabled area

Pet information is sufficient

Requested service is suitable

Time slot is available

Risk controls are clear

Price is correct

An eligible sitter is available

Possible results:

APPROVE_FOR_MATCHING

REQUEST_MORE_INFORMATION

PROPOSE_ALTERNATIVE_TIME

PROPOSE_ALTERNATIVE_SERVICE

DECLINE

Step 6 — Assign a verified sitter

The admin filters sitters using:

Service permission

Area and radius

Availability

Dog-size permission

Risk permission

Training status

Verification validity

Schedule conflicts

Active restrictions

The sitter receives only enough information to evaluate the offer before acceptance.

After acceptance and final assignment, the authorised sitter receives the full service instructions.

Step 7 — Collect payment

Payment begins only after:

Final price is locked

Service is approved

Sitter is assigned

Customer accepts the final booking details

The backend creates the Razorpay order and verifies the payment before the booking becomes confirmed.

Step 8 — Complete the service

The sitter:

Checks in.

Starts the service.

Follows Pet Profile instructions.

Sends an approved update.

Reports concerns immediately.

Completes the service.

Submits the Report Card.

Step 9 — Deliver the Report Card

For a walk, the customer should receive:

Start time

End time

Duration

Water update

Pee/poop update

Mood

Leash behaviour

Photo or short video

Sitter note

Concern status

The Report Card is not only a “nice feature.” It is evidence that the service was performed and a major trust mechanism for repeat bookings.

Step 10 — Collect review and offer repetition

After report delivery:

Rate the service

Would you book this sitter again?

Book the same sitter again

Repeat this service

Join the weekly-walk waitlist

Refer a pet parent

Do not force the customer to search again after a successful service.

4. Price validation

The proposed price range is plausible for a controlled pilot, but it must be treated as a pricing experiment rather than a fixed national tariff.

Public marketplace evidence is mixed: one Ahmedabad dog-walker listing starts around ₹90, while a broader India marketplace page describes common dog-walk prices of roughly ₹200–₹600 depending on duration, city and walker experience. The same marketplace states that in-home sitting may start around ₹100 per hour and boarding around ₹500 per night, while individual overnight listings can be around ₹750–₹850. These examples support testing your proposed range, but they are not a substitute for local unit-economics validation.

5. Recommended launch pricing

5.1 Dog walking

Primary acquisition offer

First 30-minute walk: ₹99

Normal repeat price: ₹149

This is the strongest initial offer because it:

Has a low first-use barrier

Is easy to understand

Tests a repeatable service

Allows a complete Report Card quickly

Creates an immediate same-sitter rebooking opportunity

Required offer restrictions

New customer only

One trial per household

One trial per pet

Bopal only

Selected time slots

Subject to Pet Profile review

No combination with another coupon

Prepaid

Limited pilot availability

Who bears the discount?

The sitter should receive an agreed minimum payout based on the service economics.

Do not reduce sitter compensation unpredictably because the platform chooses to run an acquisition promotion. The ₹50 difference between a ₹149 repeat price and a ₹99 trial price should be recorded as a platform acquisition expense unless the sitter explicitly accepts a transparent trial compensation arrangement.

5.2 One-hour pet sitting

Recommended pilot test:

First one-hour sitting visit: ₹249

Normal repeat price: ₹299

The lower end of ₹199 may be tested for a very limited society campaign, but it may leave insufficient room for:

Sitter travel

Sitter payout

Payment processing

Support

Report preparation

Acquisition cost

Refund risk

A ₹249 trial better maintains a premium safety position while remaining accessible.

5.3 Boarding beta

Recommended beta test:

Weekday beta: ₹799 per night

Weekend beta: ₹999 per night

However, boarding should not be advertised primarily through discounts.

Its offer should focus on:

Invite-only availability

One guest pet at a time

Property reviewed

Meet-and-greet

Photo/video updates

Structured daily Report Card

Emergency contacts

Controlled pickup and drop-off

Public Indian marketplace pages show boarding from around ₹500 per night, with individual public listings around ₹750–₹850, so ₹699–₹999 is a plausible test band.

The final price must still reflect the host property, city, weekend demand, pet needs and sitter compensation.

6. Walking packages

Important correction

Do not launch prepaid packages on the first day.

A pack introduces additional rules around:

Expiry

Unused walks

Refunds

Sitter availability

Replacement sitters

Rescheduling

Price changes

Customer credits

Accounting

It can accidentally become a small wallet or subscription system, which Phase 4 deliberately deferred.

Recommended activation sequence

First trial completed

↓

Customer completes second individual walk

↓

Customer indicates repeat need

↓

Offer fixed non-renewing starter pack

Activate packages only after approximately 20–30 successfully completed walks and evidence of repeat demand.

6.1 Five-walk starter pack

Recommended:

5 walks: ₹699

Effective price: approximately ₹140 per walk

Validity: 30 days

Compared with five individual ₹149 walks, this is a modest discount rather than an unsustainable giveaway.

Rules

No automatic renewal

One registered pet

Same service area

Subject to sitter availability

Same sitter preferred, not guaranteed

Rescheduling cutoff defined

Unused-credit treatment disclosed

No cash withdrawal or transfer

Current Pet Profile required

6.2 Ten-walk starter pack

Recommended:

10 walks: ₹1,299

Effective price: approximately ₹130 per walk

Validity: 45 days

This is a stronger repeat-demand test, but it should be offered only to customers who have already completed at least one or two successful walks.

Do not sell large packs before PetSaathi has demonstrated that it can consistently supply the same area and preferred time slots.

7. Society resident trial

Recommended:

₹99 first walk for verified residents

This should be a distinct campaign with a campaign code and defined society list.

Benefits

Higher geographic density

Lower sitter travel time

Easier word of mouth

Better replacement coverage

Potential for several recurring customers

Easier society-level trust building

Required data

Society

Tower/block

Campaign code

Number of leads

Trial bookings

Paid repeat bookings

Sitter travel time

Support cases

Do not count free leads or WhatsApp enquiries as successful acquisition. Measure paid trial completion and repeat booking.

8. Why very large discounts are dangerous

A very low price can create four problems:

Customers may question sitter quality.

The platform attracts discount-only users.

The sitter payout becomes unsustainable.

Repeat conversion falls when the normal price appears.

The right strategy is not “cheapest pet care.”

It is:

Low-risk first trial, visible verification, reliable service evidence and an easy repeat path.

9. Price transparency rules

Every offer must clearly display:

Launch price

Normal price after trial

Duration

Included service

Area

Eligibility

Availability

Cancellation rules

Taxes or additional charges where applicable

Expiry date

Do not show a fake crossed-out price that was never genuinely charged.

The Central Consumer Protection Authority has taken enforcement action over false or misleading price representations, and official consumer guidance identifies misleading prices and false “bargain price” claims as problematic practices.

Use:

Bopal launch offer: ₹99

Normal repeat price after trial: ₹149

Avoid:

₹599

Now only ₹99

84% OFF

unless ₹599 is a genuine, substantiated standard price for the same service.

10. Recommended offer funnel

Acquisition

Customer sees ₹99 trial

Trust confirmation

Verified sitter

Pet Profile review

Secure payment

Photo update

Report Card

Support contact

First conversion

Customer completes first walk

Immediate repeat action

Book same sitter again for ₹149

Repeat validation

Customer completes second walk

Package offer

5-walk or 10-walk starter pack

This sequence tests whether customers value the service—not only whether they respond to a low price.

11. Offer analytics

Every promotion should use a separate offer or campaign code.

Example:

TRIAL99_BOPAL

SOCIETY99_SAFAL

SITTING249_BOPAL

WALK5_699

WALK10_1299

Track for every offer

Landing-page visitors

CTA clicks

Pet Profiles completed

Booking requests

Requests approved

Sitters assigned

Payments started

Payments captured

Services completed

Reports delivered

Reviews received

14-day repeat

30-day repeat

Refunds

Incidents

Support minutes

Contribution margin

12. Offer success definitions

₹99 trial is successful when

Customers complete the service

Trial does not create excessive support load

Sitter payout remains viable

At least a meaningful percentage rebook at ₹149

Refunds and complaints remain low

Trial customers have similar or better ratings than other customers

Package is successful when

Customers use most purchased walks

Sitter capacity supports preferred slots

Package refunds remain low

Same-sitter continuity is achievable

Package customers remain profitable

Operational scheduling remains manageable

Boarding beta is successful when

All required assessments are completed

No escape, compatibility or safety failure occurs

Customer receives daily updates

Pickup and drop-off operate correctly

Host workload is sustainable

Emergency plan is available

Customer shows repeat intent

13. Unit-economics control

For every service, calculate:

Customer payment

− sitter compensation

− payment-processing expense

− promotion subsidy

− support cost

− media/storage cost

− refund or incident reserve

= booking contribution

Do not judge the trial offer only by revenue.

The trial may intentionally have a small or negative contribution, but the loss must be:

Known

Capped

Attributed to customer acquisition

Justified by repeat conversion

Recommended limits

Trial offer quantity: First 25–50 completed walks

Daily discounted slots: Limited

Campaign end date: Fixed

Maximum acquisition subsidy: Approved in advance

After the test, compare:

Acquisition cost

versus

30-day customer contribution

14. Operational launch stages

Stage 1 — First 10 bookings

Active:

Dog walking only

₹99 first-walk offer

Warm leads

Manual support

Three bookings per day maximum

Goal:

Validate the complete transaction

Identify service and Report Card problems

Stage 2 — Bookings 11–30

Add:

External society residents

One-hour pet sitting

Same-sitter rebooking

Basic referral offer

Goal:

Validate real customer trust

Measure sitter assignment capacity

Stage 3 — Bookings 31–60

Add only when stable:

Five-walk pack

Limited local advertisements

Second society

Additional sitter

Goal:

Test repeat revenue and operational density

Stage 4 — Bookings 61–100

Possible additions:

Ten-walk pack

Selected Satellite-area test

Invite-only boarding assessment

Grooming-partner referral

Do not add all four simultaneously. Introduce one change at a time so the team can identify what caused improvements or failures.

Stage 5 — After 100 paid bookings

Evaluate:

Best service

Best area

Best acquisition channel

Repeat rate

Refund rate

Incident rate

Sitter reliability

Contribution margin

Only then decide whether to:

Expand walking area

Expand sitting

Activate boarding beta

Increase package sales

Move toward Phase 6

15. Approved Phase 5 launch model

Active from launch

Dog walking

One-hour daytime pet sitting

Emergency partner referral

Manual sitter matching

Verified prepayment

Report Cards

Same-sitter repeat booking

Activate after operational evidence

5-walk pack

10-walk pack

Additional societies

Second micro-area

Grooming-partner test

Boarding invite-only beta

Not included

Training marketplace

Pet taxi

Public boarding at scale

Subscriptions

Automatic recurring billing

Wallet

AI sitter matching

Full GPS tracking

Native applications

Final pricing recommendation

### Table 7

| Offer | Recommended pilot price | Launch timing |
| --- | --- | --- |
| First 30-minute walk | ₹99 | Day one |
| Normal 30-minute repeat walk | ₹149 | After trial |
| First one-hour sitting | ₹249 | Controlled Stage 2 |
| Normal one-hour sitting | ₹299 | After trial |
| Five-walk pack | ₹699 | After repeat evidence |
| Ten-walk pack | ₹1,299 | After operational stability |
| Boarding beta | ₹799 weekday / ₹999 weekend | Invite-only after beta gate |
| Society first-walk trial | ₹99 | Approved societies only |

Best launch offer

₹99 first 30-minute dog walk in Bopal, including an assigned verified sitter, photo update, Pet Report Card and one-tap same-sitter rebooking.

This offer is approved as the primary Phase 5 acquisition test, subject to:

One trial per household and pet

Limited Bopal availability

Pet Profile approval

Full prepayment

Clear normal repeat price of ₹149

Minimum guaranteed sitter compensation

Fixed campaign quantity and end date

Simple explanation for professor

“During the controlled launch, PetSaathi will first focus on dog walking because it is a repeatable service and can generate recurring revenue. In-home pet sitting will also be available in a limited form, starting with one-hour daytime visits. Pet boarding will not be openly launched because it has higher safety and operational risks. It will remain an invite-only beta after property, pet, sitter and emergency checks are completed.

The launch process begins by inviting warm leads from local societies, veterinary clinics, pet shops and personal referrals. The customer creates a Pet Profile and submits a booking request. The admin reviews the request and assigns an eligible verified sitter. The customer then completes a backend-verified payment. After the service, the sitter submits a Pet Report Card containing the service time, care updates, photograph and notes. The customer can submit a review and book the same sitter again.

The recommended first offer is a ₹99 thirty-minute dog walk in Bopal. It includes a photo update, Pet Report Card and same-sitter repeat option. The normal repeat price will be shown clearly as ₹149. This offer will be limited to one trial per household and pet so that it cannot be misused.

Walking packages should not launch immediately because packages need expiry, refund and rescheduling rules. After PetSaathi completes approximately twenty to thirty successful walks and sees repeat demand, it can test a five-walk pack for ₹699 and later a ten-walk pack for ₹1,299.

Boarding may later be tested at approximately ₹799 to ₹999 per night, but only as an invite-only beta with one guest pet, meet-and-greet, property verification, emergency contacts and completed compatibility checks.

The team will track every step, including booking requests, sitter assignment, payment, service completion, Report Card delivery, reviews, repeat bookings, refunds, incidents and contribution margin. The objective is not simply to attract customers with a low price. The objective is to convert a safe first trial into a reliable repeat booking.”

PetSaathi Phase 5 — 30-Day Controlled Launch

Week 1: Soft Launch to Warm Users 🚀🐾

Executive decision

Week 1 should operate as a concierge-style production test, not a marketing campaign.

The objective is to prove that PetSaathi can complete a small number of real paid bookings safely and consistently:

Warm lead invited → Pet Profile completed → booking requested → admin review → sitter assigned → payment verified → service completed → Report Card delivered → customer feedback collected

A limited rollout reduces the number of users affected by defects and allows the team to stop expansion when payment, assignment, service quality or support metrics deteriorate. This follows the same risk-control logic as a canary release, where a product is exposed to a small cohort before broader rollout.

1. Week 1 core goal

Goal

Launch PetSaathi only to people who:

Previously showed interest

Live inside the active pilot area

Have a suitable pet for the current service

Can provide complete Pet Profile information

Understand that this is a controlled pilot

Agree to provide honest feedback

Recommended launch configuration

City: Ahmedabad

Area: Bopal

Primary service: 30-minute dog walking

Secondary service: Limited one-hour daytime pet sitting

Boarding: Disabled during Week 1

Active sitters: 3–5

Daily booking cap: 3 initially

Matching: Manual admin-controlled

Payment: Verified prepayment

Support: Human monitored

Do not activate public advertising, multiple cities, open boarding or large prepaid packages during the first week.

2. Correcting the Week 1 booking target

Your proposed target is:

20–40 paid bookings in seven days

That requires approximately:

20 bookings ÷ 7 days = 2.9 bookings per day

40 bookings ÷ 7 days = 5.7 bookings per day

Therefore:

A three-booking daily cap supports a maximum of 21 bookings.

A five-booking daily cap supports a maximum of 35 bookings.

Reaching 40 requires roughly six bookings every day, which is too aggressive for the first production week unless sitter supply and support capacity are already proven.

Recommended Week 1 target

### Table 8

| Level | Paid bookings | Interpretation |
| --- | --- | --- |
| Minimum acceptable | 15 | Enough to test major workflows |
| Target | 20–25 | Strong first-week result |
| Stretch | 30–35 | Only when quality stays stable |
| Not recommended | 40+ | Excessive first-week pressure |

The launch should optimise for successful completion, not maximum booking volume.

3. Warm-lead definition

A warm lead is not simply someone whose phone number appears in a spreadsheet.

Eligible warm leads

Previously completed a PetSaathi interest form

Asked about dog walking or pet sitting

Joined a project waitlist

Came through a trusted referral

Lives in Bopal or the exact enabled radius

Has directly agreed to receive launch communication

Lead classification

Hot lead

Requested a service recently

Lives in the launch area

Has an immediate pet-care need

Is willing to complete a booking within seven days

Warm lead

Expressed interest

May book in the next few weeks

Needs more explanation or timing flexibility

Unqualified lead

Outside the service area

Requested a disabled service

Has no immediate need

Cannot provide required Pet Profile information

Week 1 invitations should prioritise hot leads first.

4. Week 1 operating model

Final production checks

↓

Import and validate pilot data

↓

Invite small hot-lead cohort

↓

Create Pet Profiles

↓

Accept controlled booking requests

↓

Admin reviews every booking

↓

Verified sitter assigned

↓

Customer completes payment

↓

Service performed

↓

Report Card delivered

↓

Review and repeat intent collected

↓

Issues fixed before volume increases

Production launch planning should define expected service performance, monitoring, alerts and capacity before real traffic is introduced.

5. Day 1 — Final launch checklist

Objective

Confirm that PetSaathi is operationally and technically ready before inviting real customers.

Product checks

Homepage and launch-offer page work

Customer signup and login work

Pet Profile can be created and edited

Booking form works

Price is calculated on the server

Admin can review requests

Admin can assign a sitter

Customer can complete payment

Sitter can start and complete service

Sitter can submit the Report Card

Customer can view the report and submit a review

Admin can create and manage an incident

Payment checks

Razorpay live configuration is correct

Order is created from backend amount

Signature verification works

Webhook endpoint is enabled

payment.captured or order.paid updates the correct payment

Duplicate webhook does not create duplicate confirmation

Browser closure after payment is recoverable

Refund workflow has been tested

Razorpay documents that a captured payment results in payment.captured and order.paid events, and the booking should rely on authoritative server-side processing rather than the browser result alone.

Operations checks

Active sitter list confirmed

Sitter availability confirmed for seven days

Service radius confirmed

Pricing approved

Support number staffed

Emergency veterinary contacts rechecked

Replacement process documented

Incident-response owner assigned

Customer refund and cancellation rules available

Daily booking cap configured

Technical checks

Production backup completed

Restore process previously tested

Monitoring active

Sentry receives a test error

Notification queue is working

Private media upload is working

Admin access permissions are tested

No Severity 0 or Severity 1 bug remains

Day 1 output

Launch-readiness checklist: PASSED

or

Launch-readiness checklist: BLOCKED

No external invitation should be sent while a launch blocker remains unresolved.

6. Day 2 — Import leads and sitters

Objective

Prepare clean, permissioned and operationally usable pilot data.

Lead import fields

Lead source

Full name

Phone

Email

Area

Pet type

Requested service

Interest level

Consent/source of contact

Last interaction

Assigned support owner

Sitter import fields

Sitter ID

Name

Area

Service radius

Approved services

Dog-size permission

Risk permission

Availability

Verification status

Training status

Emergency contact

Payout readiness

Import process

Source spreadsheet

↓

Staging table

↓

Validate phone and email

↓

Detect duplicates

↓

Check area eligibility

↓

Check sitter evidence

↓

Import approved records

↓

Generate reconciliation report

Data rules

Do not import plaintext passwords.

Do not mark a sitter verified without evidence.

Do not assume marketing consent.

Do not change missing safety information to “No.”

Do not import customers outside the pilot area as immediately bookable.

Preserve the source record and import batch.

Segment the leads

Recommended first invitation cohort:

Cohort A: 5–8 highest-intent leads

Cohort B: Next 8–12 leads

Cohort C: Reserve list

Do not invite all warm leads at once. Cohort B should be invited only after Cohort A bookings remain stable.

Day 2 output

Validated lead list

Approved sitter roster

Import reconciliation report

First invitation cohort

7. Day 3 — Invite hot leads

Objective

Convert a small high-intent group into the first real booking requests.

Recommended invitation strategy

Begin with personalised WhatsApp or phone-assisted communication.

The message should explain:

PetSaathi’s service

Exact launch area

₹99 first-walk offer

Thirty-minute duration

Verified sitter assignment

Photo update and Report Card

Prepaid confirmation

Limited pilot availability

Normal repeat price

Invitation capacity

Invite approximately:

5–8 leads in the morning

Review response and system load

Invite another 5–8 only if stable

Do not invite 50 people to fill three daily booking slots.

Support process

When a lead responds:

Confirm the customer lives in the active area.

Confirm the requested service is enabled.

Help the customer create an account if needed.

Help complete the Pet Profile.

Explain that the initial submission is a request, not confirmation.

Confirm availability before payment.

Record unanswered questions.

Conversion tracking

Track:

Invitations sent

Messages delivered

Responses received

Accounts created

Pet Profiles completed

Booking forms started

Booking requests submitted

Approved bookings

Payments captured

GA4 Funnel Exploration can help identify where users abandon a multi-step process, but operational booking and payment records should come from the PetSaathi database.

Day 3 output

First qualified booking requests

Initial conversion data

Customer questions and objections

8. Day 4 — Run the first services

Objective

Validate the complete real-world service workflow.

Before each service

The operations admin should confirm:

Booking status is CONFIRMED

Payment status is CAPTURED

Assigned sitter remains available

Customer has not reported new pet-health information

Address and entry instructions are complete

Sitter has read the Pet Profile

Support owner is available

Emergency contact is available

Required walking equipment is ready

During each service

Monitor:

Sitter arrival

Service start timestamp

Customer handover

Delayed arrival

Photo or service update

Concern reports

Support messages

Service completion

After each service

Confirm:

Completion timestamp

Pet safely returned or secured

Report Card submitted

Report Card delivered to customer

Customer received notification

Sitter earning moved to the correct state

No unresolved concern exists

First-service rule

For the first three to five bookings, an operations team member should supervise the workflow actively from assignment through report delivery.

Day 4 output

First completed paid services

End-to-end operational observations

Service issue log

9. Day 5 — Collect reviews and quality feedback

Objective

Understand the actual customer experience, not merely collect five-star ratings.

Review request

Ask the customer to rate:

Sitter punctuality

Pet handling

Communication

Overall experience

Would book again?

Short interview questions

Ask:

Was it clear when the booking became confirmed?

Did you feel the sitter information was sufficient?

Did the service begin on time?

Was the Report Card useful?

Did anything make you uncomfortable?

Would you pay the normal ₹149 repeat price?

Would you prefer the same sitter next time?

What nearly stopped you from booking?

Rating interpretation

A target of 4.5+ is reasonable as a quality aspiration, but a first-week rating based on only ten reviews is statistically fragile.

Track:

Average rating

Number of reviews

Rating distribution

Review response rate

Would-book-again percentage

Common negative themes

Ten reviews with an average of 4.5 means more than a single average figure; the team should inspect every comment during Week 1.

Repeat interest

Separate:

Repeat interest

Customer says they intend to book again.

Repeat action

Customer starts or completes another paid booking.

Week 1 may realistically produce 5–10 customers expressing repeat interest, but actual repeat bookings should be tracked separately.

Day 5 output

10+ review goal

Customer interview notes

Repeat-intent list

Prioritised quality issues

10. Day 6 — Fix urgent issues

Objective

Resolve launch-blocking and trust-damaging problems before inviting more users.

Bug priorities

Severity 0 — Immediate pause

Cross-user access

Duplicate charge

Wrong customer booking confirmed

Data loss

Critical incident notification failure

Payment captured but untraceable

Severity 1 — Fix before more invitations

Booking cannot complete

Sitter cannot start service

Report cannot be delivered

Admin cannot assign correctly

Customer cannot view confirmed booking

Incorrect price displayed

Required notification missing

Severity 2 — Fix rapidly

Confusing status language

Mobile form difficulty

Slow dashboard

Incorrect validation message

Non-critical media-upload issue

Severity 3 — Backlog

Minor layout defect

Copy improvement

Small visual inconsistency

Fix process

Issue recorded

↓

Severity assigned

↓

Root cause identified

↓

Fix implemented

↓

Automated test added

↓

Staging retest

↓

Controlled production deployment

↓

Production verification

Do not deploy several unrelated risky features while stabilising the first live bookings.

Day 6 output

Urgent defects fixed

Retest evidence

Updated known-issues list

11. Day 7 — Weekly launch review

Objective

Determine whether the launch should expand, remain restricted or pause.

Review areas

Demand

Invitations sent

Response rate

Pet Profiles completed

Booking requests

Paid bookings

Main reasons for non-conversion

Operations

Assignment success

Time to assign

Sitter acceptance

Late starts

Completed bookings

Report delivery

Support workload

Customer quality

Average rating

Review response

Would-book-again rate

Repeat interest

Complaints

Refund requests

Sitter quality

Offer acceptance

On-time arrival

Report quality

Customer rating

Operational feedback

Technology

Payment errors

Webhook delays

Notification failures

Media-upload failures

Mobile defects

Sentry errors

Authorization denials

Safety

Concerns

Incidents

Pet-profile corrections

Sitter restrictions

Emergency escalations

Week 1 decision

Choose one:

EXPAND_TO_NEXT_COHORT

CONTINUE_AT_CURRENT_CAP

FIX_BEFORE_EXPANSION

PAUSE_NEW_BOOKINGS

A production launch should have defined monitoring and rollback decisions rather than relying on subjective optimism.

12. Week 1 metric definitions

Paid bookings

Unique production bookings with:

payment status = CAPTURED

and verified amount/currency

Exclude:

Internal test bookings

Duplicate attempts

Zero-value bookings

Requests not paid

Recommended target

20–25 target

30–35 stretch

Completed booking rate

Services reaching SERVICE_COMPLETED

÷

Confirmed services due during the week

× 100

Target

90% minimum

95% preferred

Do not include future bookings in the denominator.

Reviews

Eligible customer reviews submitted

Target

10+

Also aim for:

Review response rate ≥50% of completed services

Average rating

Average overall rating from eligible completed-service reviews

Target

4.5+/5 aspirational

Do not use the average alone; review the distribution and written feedback.

Repeat interest

Customers selecting “would book again”

or explicitly requesting another booking

Target

5–10 customers

Track actual repeat paid bookings separately.

Critical bugs

Target

Open Severity 0 bugs: 0

Open Severity 1 bugs: 0 before expansion

“Near zero” is not sufficient for security, payment or booking-blocking defects.

13. Additional Week 1 metrics

The original scorecard should include several operational metrics.

### Table 9

| Metric | Recommended target |
| --- | --- |
| Assignment success | 90%+ |
| Payment success | 80%+ of payment starts |
| Report Card delivery | 95%+ |
| Sitter no-show | Below 5%; preferably zero |
| Active-service support P90 | Under 10 minutes |
| Refund/dispute rate | Below 5% |
| Notification delivery | 95%+ |
| Unresolved serious incidents | 0 |

Assignment time

Measure:

Time of approved booking request

to

active primary sitter assignment

Suggested Week 1 internal target:

Median under 60 minutes during operating hours

The exact target should reflect the service lead time and the manually controlled launch model.

14. Daily dashboard

The team should review this dashboard each day:

Invitations sent

Responses

Accounts created

Pet Profiles completed

Booking requests

Approved requests

Sitter offers sent

Sitters assigned

Payments started

Payments captured

Services due

Services started

Services completed

Reports delivered

Reviews submitted

Repeat interest

Refunds

Incidents

Support tickets

Critical errors

Funnel

Invited lead

↓

Responded

↓

Pet Profile completed

↓

Booking requested

↓

Booking approved

↓

Sitter assigned

↓

Payment captured

↓

Service completed

↓

Report delivered

↓

Review

↓

Repeat interest

Use GA4 to understand user drop-off and the application database to verify operational outcomes.

15. Required team roles

Even in a small pilot, each responsibility must have an owner.

### Table 10

| Responsibility | Owner |
| --- | --- |
| Booking review | Operations admin |
| Sitter assignment | Operations admin |
| Customer communication | Support owner |
| Active-service monitoring | Duty operations owner |
| Payment reconciliation | Finance owner |
| Safety escalation | Safety owner |
| Technical monitoring | Developer |
| Daily metrics | Product owner |

One person may hold multiple roles, but the active duty owner must be visible for every service.

16. Week 1 pause conditions

Pause new invitations and booking creation when:

Duplicate payment occurs

Cross-customer or cross-sitter data access is discovered

Payment capture cannot be reconciled

Confirmed booking has no eligible sitter

Support cannot monitor active bookings

Serious incident remains uncontrolled

Report Cards consistently fail

Incorrect prices reach customers

Database integrity is uncertain

Sitter verification evidence is unreliable

Pausing new requests must not prevent existing customers from accessing:

Active bookings

Support

Report Cards

Refund status

Incident updates

17. Week 1 expansion gate

Proceed to Week 2 only when:

Required

At least 15–20 paid bookings completed or actively scheduled

Completion rate at least 90%

Report delivery at least 95%

Assignment success at least 90%

Zero unresolved critical bugs

Zero unresolved serious incidents

Payment reconciliation stable

Support process manageable

Quality evidence

At least ten customer reviews

Average rating close to or above 4.5

Five or more customers show real repeat interest

Main customer objections identified

Sitter feedback documented

Operational evidence

At least two reliable sitters

Backup sitter path tested

Daily cap respected

Support response target met

Every booking has a complete audit timeline

18. Week 1 final report format

Week 1 Soft-Launch Report

Launch dates:

City:

Area:

Active services:

Active sitters:

Booking cap:

Lead funnel

Warm leads imported:

Invitations sent:

Responses:

Accounts created:

Pet Profiles completed:

Booking requests:

Approved requests:

Paid bookings:

Service delivery

Confirmed bookings:

Completed bookings:

Cancelled bookings:

Sitter no-shows:

Late starts:

Report Cards delivered:

Customer feedback

Reviews submitted:

Average rating:

Would book again:

Repeat booking requests:

Main positive feedback:

Main negative feedback:

Operations and safety

Support requests:

Median support response:

P90 support response:

Refunds:

Concerns:

Incidents:

Technology

Payment failures:

Webhook errors:

Notification failures:

Media-upload failures:

Severity 0 bugs:

Severity 1 bugs:

Decision

EXPAND_TO_WEEK_2

CONTINUE_RESTRICTED

FIX_BEFORE_EXPANSION

PAUSE_LAUNCH

Recommended Week 1 targets

### Table 11

| Metric | Final recommendation |
| --- | --- |
| Paid bookings | 20–25 target; 30–35 stretch |
| Completed bookings | 90% minimum; 95% preferred |
| Reviews | 10+ |
| Review response rate | 50%+ |
| Average rating | 4.5+ aspirational |
| Repeat interest | 5–10 customers |
| Assignment success | 90%+ |
| Report Card delivery | 95%+ |
| Sitter no-show | Below 5%; preferably zero |
| Open critical bugs | Zero |
| Unresolved serious incidents | Zero |

Simple explanation for professor

“During the first week of the controlled launch, PetSaathi will be offered only to warm users who have already shown interest and live in the selected pilot area. The purpose is not to advertise to the entire city. The purpose is to test the complete service under real conditions with a limited number of customers.

On Day 1, the team will complete the final launch checklist. It will test customer signup, Pet Profiles, booking, admin assignment, Razorpay payment verification, sitter service actions, Report Cards, reviews, incident handling, backups and monitoring.

On Day 2, the team will import and validate warm leads and approved sitters. Duplicate records, unsupported areas and incomplete verification will be corrected before activation.

On Day 3, a small group of high-interest customers will receive personalised invitations. The invitations will explain the ₹99 trial walk, launch area, verified sitter, Report Card, payment requirement and normal repeat price.

On Day 4, the team will run the first real services. Every booking will be actively monitored from sitter assignment and payment through service completion and Report Card delivery.

On Day 5, customers will provide ratings and detailed feedback. The team will ask whether the customer understood the booking process, trusted the sitter, found the Report Card useful and would pay the normal repeat price.

On Day 6, all urgent technical and operational problems will be fixed. Security, payment and booking-blocking defects must be resolved before more users are invited.

On Day 7, the team will review paid bookings, completion rate, sitter assignment, payments, reports, ratings, repeat interest, support response, refunds, incidents and technical errors. It will then decide whether to expand, remain at the current limit, fix problems or pause new bookings.

The recommended Week 1 goal is twenty to twenty-five paid bookings, with thirty to thirty-five as a stretch target. The project should maintain at least ninety percent booking completion, ninety-five percent Report Card delivery, ten or more reviews, strong customer satisfaction and zero open critical bugs.”

PetSaathi Phase 5 — 30-Day Controlled Launch

Week 2: Society and Locality Push 🏢🐾

Executive decision

Week 2 should not become a broad citywide marketing campaign.

Its purpose is to identify one dense, operationally efficient micro-market where PetSaathi can repeatedly acquire customers, assign nearby sitters and deliver services without excessive travel or support effort.

The correct Week 2 principle is:

Concentrate demand around a small number of societies and neighbourhoods instead of collecting scattered leads across Ahmedabad.

The operational journey is:

Select priority micro-areas

↓

Approach societies and local partners

↓

Generate traceable leads

↓

Run limited society trials

↓

Convert trials into repeat bookings

↓

Measure booking density and service quality

↓

Select the strongest micro-market

1. Week 2 goal

Goal

Create booking density in Bopal and selected nearby localities by combining:

Apartment-society outreach

Veterinary clinic and pet-shop partnerships

Hyperlocal Instagram promotion

Responsible dog-park outreach

Society-specific trial bookings

Same-sitter repeat plans

Recommended active geography

Week 2 should still focus primarily on:

Primary zone: Bopal

Secondary test zone: South Bopal

Reserve zone: Satellite

Do not activate Satellite or another neighbourhood simply because leads appear there. A new area should be enabled only when PetSaathi has:

Sitter coverage

Approved pricing

Support coverage

Emergency contacts

Reasonable travel time

Enough potential bookings to justify activation

Google Business Profile allows service-area businesses to define specific service areas and recommends using accurate locations rather than representing an excessively broad territory.

2. Correct interpretation of the Week 2 target

Your target says:

Paid bookings: 40–80 total

This should mean cumulative total by the end of Day 14, not an additional 40–80 bookings during Week 2.

Assuming Week 1 produced approximately 20–25 paid bookings:

### Table 12

| Week 2 result | Additional bookings needed |
| --- | --- |
| 40 total | 15–20 |
| 60 total | 35–40 |
| 80 total | 55–60 |

The upper range is aggressive for a controlled launch.

Recommended cumulative target

Minimum: 40 total paid bookings

Target: 50–60 total paid bookings

Stretch: 70–80 total only if operations remain stable

To reach 80 total from 20 Week 1 bookings, PetSaathi would need approximately eight to nine additional paid bookings per day during Week 2. That should not be attempted unless sitter capacity, Report Card completion and support response are already reliable.

3. Week 2 end-to-end operating model

Identify high-potential societies

↓

Create partnership and poster materials

↓

Assign unique tracking codes

↓

Approach society management and residents

↓

Launch local digital and offline campaigns

↓

Collect qualified pet-parent leads

↓

Complete reusable Pet Profiles

↓

Run society-specific trial services

↓

Offer same-sitter rebooking

↓

Measure density, quality and economics

↓

Choose best micro-market

4. Prepare before Day 8

Before starting society outreach, prepare one professional launch kit.

Society partnership kit

Include:

One-page PetSaathi overview

Services available

Exact pilot area

Trial offer

Sitter-verification explanation

Service process

Sample Pet Report Card

Emergency escalation summary

Cancellation terms

Support number

QR code

Society campaign code

Contact person

Data/privacy summary

Recommended society message

PetSaathi should be positioned as:

A controlled local pet-care service offering verified dog walkers and pet sitters, prepaid booking, service updates, Pet Report Cards and assisted customer support.

Avoid claims such as:

100% safe

Zero-risk sitters

Guaranteed emergency treatment

Always available

Use precise trust language:

Identity verified

Training reviewed

Service permissions approved

Admin-controlled sitter assignment

Private service updates

5. Day 8 — Approach 10 societies

Objective

Create B2B-style partnerships with apartment societies that can produce several nearby pet-parent customers.

Society selection criteria

Prioritise societies with:

Large number of occupied homes

Visible pet-owner community

Existing pet WhatsApp group

Dog-walking activity

Security-controlled entry

Resident welfare association or management committee

Space for a small awareness event

Location inside the active sitter radius

One resident champion willing to coordinate

Society priority score

Score each society from 1 to 5 for:

Estimated pet households

Distance from available sitters

Management openness

Resident champion

Security/access simplicity

Expected booking frequency

Nearby backup sitter coverage

Example:

### Table 13

| Society | Pet demand | Sitter proximity | Management interest | Priority |
| --- | --- | --- | --- | --- |
| Society A | 5 | 5 | 4 | High |
| Society B | 3 | 4 | 2 | Medium |
| Society C | 2 | 2 | 1 | Low |

Who to approach

Society manager

Resident welfare association

Committee member

Pet-parent group administrator

Security supervisor where access procedures matter

Resident pet champion

What to request

Do not immediately ask for a permanent commercial agreement.

Request one low-risk activity:

Permission to share a digital flyer

Permission to place a poster

Introduction to resident pet group

One-hour pet-care awareness desk

Limited resident trial campaign

Society lead statuses

IDENTIFIED

CONTACTED

MEETING_REQUESTED

MEETING_COMPLETED

INTERESTED

TRIAL_APPROVED

NOT_INTERESTED

FOLLOW_UP_LATER

Society CRM fields

Society name

Area

Contact person

Role

Phone/email

Number of towers

Estimated households

Estimated pet households

Security process

Meeting date

Interest status

Trial date

Campaign code

Leads

Paid bookings

Repeat bookings

Day 8 target

Societies contacted: 10

Meetings or serious conversations: 4–6

Qualified interested societies: 2–3 initially

The weekly target of three to five interested societies remains reasonable if follow-ups continue through Day 14.

6. Day 9 — Vet clinic and pet-shop posters

Objective

Generate trusted offline referrals from businesses already serving pet owners.

Veterinary clinics and pet shops are valuable because customers already visit them for pet-related needs. However, PetSaathi should treat these partners as referral channels, not imply that a veterinary clinic medically endorses every sitter or service unless a formal, accurate arrangement exists.

Partner targets

Approach:

3–5 veterinary clinics

5–8 pet shops

2–3 grooming providers

Keep the initial test small enough to track each partner properly.

Poster structure

The poster should contain:

Headline

Need a trusted dog walker near Bopal?

Trust line

Verified caregivers • Prepaid booking • Photo update • Pet Report Card

Offer

First 30-minute walk: ₹99

Normal repeat price: ₹149

CTA

Scan to book

or WhatsApp PetSaathi

Limits

Bopal pilot area

Limited slots

Pet Profile review required

Tracking

Every clinic or shop needs its own:

QR code

Landing-page URL

Referral code

UTM campaign parameters

Google Analytics supports campaign parameters such as source, medium and campaign so referral links can be distinguished in acquisition reports.

Example:

utm_source=abc_vet

utm_medium=offline_poster

utm_campaign=bopal_phase5_week2

utm_content=dog_walk_trial99

Internal referral code:

VET_ABC_BOPAL

What to measure

Posters placed

QR scans

WhatsApp conversations

Qualified leads

Pet Profiles completed

Paid bookings

Repeat bookings

Partner commission, if applicable

Day 9 output

Partner list

Poster placements

Unique tracking links

First offline referral leads

7. Day 10 — Instagram local campaign

Objective

Generate a small number of geographically relevant digital leads without opening advertising to the whole city.

Meta Ads Manager supports geographic targeting, and ads can be configured to open a WhatsApp conversation directly.

Recommended campaign setup

Geographic scope

Target only:

Bopal

South Bopal

Small surrounding radius supported by sitters

Do not target all Ahmedabad during this test.

Campaign objective

Recommended options:

Click to WhatsApp

Landing-page conversion

Lead form only when follow-up capacity exists

Click-to-WhatsApp is appropriate for a concierge-style pilot because a customer can ask questions before completing the booking. Meta supports ads from Facebook and Instagram that open WhatsApp chats.

Recommended creative concepts

Creative A — Trust

Your pet deserves more than an unknown walker.

Book a verified local dog walker with updates and a Pet Report Card.

Creative B — Trial

First 30-minute dog walk in Bopal: ₹99

Limited pilot slots.

Creative C — Busy pet parent

Busy morning?

PetSaathi can help with a safe, structured dog walk near your home.

Required creative elements

Real or properly licensed pet imagery

Exact area

Exact service

Trial price

Normal price

Limited availability

Verification wording

Report Card benefit

Clear CTA

Budget rule

Use a small learning budget.

Example internal test:

₹500–₹1,000 per day

for 2–3 days

This is a proposed test budget, not a guaranteed acquisition formula. Stop or modify the campaign if it produces:

Mostly out-of-area leads

Poor lead quality

Unmanageable support volume

High cost without Pet Profile completion

Low payment conversion

Track separately

Ad impression

Ad click

WhatsApp conversation

Qualified lead

Pet Profile

Booking request

Paid booking

Completed service

Repeat booking

Do not judge the campaign using likes or video views alone.

8. Day 11 — Dog-park outreach

Objective

Speak directly with local pet parents and observe actual service needs.

Important conduct rules

Obtain permission where required

Do not interrupt people handling reactive dogs

Do not approach or touch pets without consent

Do not create crowding

Do not collect phone numbers without permission

Do not provide veterinary or behavioural diagnoses

Stop outreach immediately if park management objects

Outreach approach

Use a short conversational script:

We are running a small Bopal pilot for verified dog walking and pet sitting. Customers receive service updates and a Pet Report Card. May I give you the details or send the trial link?

Qualifying questions

Ask only a few questions:

Which area do you live in?

How often do you need help with pet care?

Is dog walking or sitting more useful?

What is your biggest concern when hiring a sitter?

Would you prefer the same caregiver repeatedly?

What time slots are most difficult?

Do not sell immediately to everyone

Classify interest:

IMMEDIATE_NEED

INTERESTED_LATER

REPEAT_WALKING_NEED

TRAVEL_SITTING_NEED

OUTSIDE_AREA

NOT_INTERESTED

Dog-park tracking code

Example:

DOGPARK_BOPAL_DAY11

Day 11 output

Direct customer conversations

Pain-point notes

Qualified lead list

Time-slot demand data

9. Day 12 — Run society trial offer

Objective

Convert society interest into geographically grouped paid bookings.

Recommended society offer

₹99 first 30-minute dog walk

for verified residents of participating societies

Include:

Verified assigned sitter

Photo update

Pet Report Card

Same-sitter repeat option

Prepaid confirmation

One trial per household and pet

Limited slots

Pet Profile approval

Group booking does not mean group walking

A society campaign can generate several bookings, but Phase 5 should not automatically combine unfamiliar dogs into one group walk.

Use:

Multiple private bookings in one society

Not:

Several unknown dogs walked together

unless compatibility, handling capability, insurance and service rules have been separately approved.

Society trial scheduling model

Example:

Society A:

6:30 AM

7:15 AM

8:00 AM

Society B:

5:30 PM

6:15 PM

7:00 PM

This creates route efficiency while keeping each service private.

Required coordination

Resident identity or unit verification

Security entry process

Customer contact

Pet Profile completed

Sitter arrival window

Buffer between bookings

Support person available

Backup sitter plan

Capacity rule

Do not schedule consecutive walks without travel and service buffers.

Example:

30-minute walk

+ 10-minute handover/report buffer

+ local movement time

Day 12 output

First society-based paid bookings

Grouped schedule

Society conversion data

Operational density test

10. Day 13 — Push repeat plans

Objective

Convert satisfied trial customers into recurring demand.

Do not push a package immediately after a poor or incomplete service. Repeat offers should be shown only when:

Service completed

Report delivered

No unresolved concern

Customer rated positively or expressed satisfaction

Sitter capacity exists

Repeat hierarchy

Option 1 — One-tap repeat

Book the same sitter again for ₹149

Option 2 — Repeat same schedule

Book another Tuesday 7:00 AM walk

Option 3 — Five-walk starter pack

5 walks for ₹699

Valid for 30 days

Option 4 — Weekly-plan waitlist

Join a recurring weekly-plan waitlist

Avoid automatic recurring billing during Phase 5.

Why same-sitter continuity matters operationally

It reduces the need for repeated handovers and lets both customer and sitter reuse familiar care instructions. This should be measured rather than assumed to work for every customer.

Repeat-plan eligibility

At least one successful service

Pet Profile still current

No open incident

Service area enabled

Sitter availability confirmed

Current pricing accepted

Repeat metrics

Track:

Trial customers

Repeat offer shown

Repeat offer clicked

Second booking requested

Second booking paid

Five-walk pack purchased

Same sitter retained

Day 13 output

Repeat booking requests

Package interest

Weekly-plan waitlist

Same-sitter demand

11. Day 14 — Review area density

Objective

Select the strongest micro-market using operational and financial evidence.

The “best area” should not simply be the locality with the highest number of enquiries.

It should produce:

Paid bookings

Short assignment times

Low sitter travel

High service completion

Repeat demand

Low support effort

Sustainable economics

Area-density scorecard

Measure each micro-area using:

### Table 14

| Metric | Why it matters |
| --- | --- |
| Qualified leads | Potential demand |
| Paid bookings | Real demand |
| Bookings per square kilometre | Density |
| Active customers per society | Concentration |
| Median sitter travel time | Operational efficiency |
| Median assignment time | Supply strength |
| Offer acceptance rate | Sitter suitability |
| Completion rate | Delivery reliability |
| Repeat rate | Retention |
| Refund rate | Quality/economic risk |
| Incident rate | Safety |
| Contribution per booking | Sustainability |

Recommended density metrics

Bookings per active society

Paid bookings from society

÷

Number of active participating societies

Customer concentration

Paid customers in top 3 societies

÷

Total paid customers

Sitter travel efficiency

Total sitter travel minutes

÷

Completed bookings

Area contribution

Customer payments

− sitter payouts

− discounts

− payment fees

− area acquisition cost

− support cost

Example area review

### Table 15

| Area | Paid bookings | Assignment time | Travel | Repeat intent | Decision |
| --- | --- | --- | --- | --- | --- |
| Bopal Core | 28 | 20 min | Low | High | Prioritise |
| South Bopal | 14 | 34 min | Medium | Medium | Continue |
| Satellite | 6 | 65 min | High | Unknown | Do not expand yet |

Day 14 decision

Choose one:

FOCUS_ON_BOPAL_CORE

EXPAND_WITHIN_BOPAL

ADD_ONE_NEW_SOCIETY_CLUSTER

TEST_SOUTH_BOPAL

DO_NOT_EXPAND

12. Society partnership model

Level 1 — Communication partner

Society allows:

Digital flyer

WhatsApp group message

Notice-board poster

Level 2 — Trial partner

Society allows:

Resident trial code

Pet-parent registration

Small awareness desk

Coordinated booking slots

Level 3 — Preferred society partner

Only after evidence:

Several recurring customers

Reliable security entry

Local sitter coverage

Low complaint rate

Possible benefits:

Resident-specific trial

Priority booking windows

Dedicated support contact

Society-level education events

Do not offer exclusivity, guaranteed sitter availability or major discounts before service capacity is proven.

13. Society outreach message

Opening

PetSaathi is running a controlled pet-care pilot in Bopal for dog walking and in-home pet sitting.

Trust proposition

Bookings are reviewed by our operations team, sitters are verified for their approved services, payment is handled online and customers receive service updates and a Pet Report Card.

Society offer

We would like to provide a limited ₹99 first-walk offer for interested pet parents in your society.

Request

We are requesting permission to share one digital flyer or conduct a small resident registration session.

Avoid

Claiming society endorsement before approval

Adding the society logo without permission

Saying “society-approved” when only poster placement was allowed

Promising unlimited availability

14. Lead attribution structure

Every Week 2 lead needs a source.

Recommended structure:

source_type

source_name

campaign_code

society_id

partner_id

area

first_contact_at

qualified_at

booking_id

Campaign examples

SOC_SAFAL_BOPAL_W2

VET_ABC_POSTER_W2

PETSHOP_XYZ_QR_W2

META_BOPAL_TRIAL99_W2

DOGPARK_BOPAL_W2

UTM-tagged URLs allow GA4 to distinguish campaign sources in acquisition reporting.

PetSaathi’s database should remain the authoritative record for paid bookings and repeat customers.

15. Week 2 daily dashboard

Monitor:

Societies contacted

Meetings completed

Interested societies

Trial societies

Vet partners

Pet-shop partners

Poster QR scans

Instagram leads

Dog-park conversations

Qualified leads

Pet Profiles

Booking requests

Paid bookings

Completed bookings

Repeat requests

Packages purchased

Refunds

Incidents

Support time

Sitter travel time

Channel funnel

Contact or impression

↓

QR scan / WhatsApp message

↓

Qualified lead

↓

Pet Profile completed

↓

Booking request

↓

Payment captured

↓

Service completed

↓

Repeat booking

16. Week 2 target definitions

Societies contacted

A society counts as contacted only when:

An identified decision-maker or coordinator receives the proposal

Contact is logged

Follow-up date exists

A poster left without speaking to anyone should not count as a qualified society contact.

Target

10–20 societies

Recommended:

10 high-quality contacts

rather than

20 untracked brochure drops

Interested societies

An interested society should have performed at least one meaningful action:

Requested a meeting

Allowed flyer distribution

Allowed group communication

Approved a trial

Named a resident coordinator

Target

3–5

Paid bookings

Definition:

Unique production bookings

with verified captured payment

Cumulative Week 2 target

40–60 recommended

70–80 stretch

Repeat customers

Definition:

Customers with a second paid booking

Do not count only:

“Would book again”

Package interest

Waitlist signup

Repeat CTA click

Track these separately as repeat intent.

Target

10–20 actual repeat customers

This may be ambitious by Day 14 because some Week 2 customers have not had enough time to repeat. Report both:

Actual second paid bookings

Repeat intent

Repeat offer clicks

Best area identified

This target is passed only when one area clearly leads on:

Paid demand

Assignment time

Travel efficiency

Completion

Repeat demand

Support effort

Economics

Do not choose the best area using lead volume alone.

17. Recommended Week 2 targets

### Table 16

| Metric | Recommended target |
| --- | --- |
| Societies contacted | 10–15 quality contacts |
| Interested societies | 3–5 |
| Trial societies | 1–3 |
| Partner locations | 5–10 |
| Cumulative paid bookings | 40–60 |
| Stretch paid bookings | 70–80 |
| Actual repeat customers | 8–15 realistic; 20 stretch |
| Report Card delivery | 95%+ |
| Booking completion | 90%+ |
| Assignment success | 90%+ |
| Sitter no-show | Below 5% |
| Best micro-market | Identified with evidence |
| Open critical bugs | 0 |
| Unresolved serious incidents | 0 |

18. Week 2 pause conditions

Pause campaigns or new society trials when:

Daily capacity is full

Assignment rate falls below 90%

Support response deteriorates

Sitter travel becomes excessive

Report delivery drops below 95%

Serious incident remains open

Incorrect pricing appears

Discounts create negative uncontrolled economics

Payment or notification reliability fails

Pause one acquisition channel rather than the whole product when the problem is channel-specific.

Example:

Instagram produces too many out-of-area leads

→ pause Instagram campaign

→ keep society referrals active

19. Week 2 expansion gate

Proceed to Week 3 only when:

Demand

At least 40 cumulative paid bookings

Three or more functioning lead sources

One or more societies generating paid bookings

Retention

Repeat interest clearly visible

Actual repeat paid bookings beginning

Same-sitter requests recorded

Operations

Assignment success at least 90%

Completion at least 90%

Report delivery at least 95%

Support remains manageable

No unresolved critical incident

Geography

Best micro-area identified

Travel and assignment data support the decision

A second area is not required merely to create volume

20. Week 2 final report format

Week 2 Society and Locality Report

Launch dates:

Active city:

Active areas:

Active services:

Active sitters:

Daily booking capacity:

Society outreach

Societies identified:

Societies contacted:

Meetings:

Interested societies:

Trial societies:

Resident leads:

Paid society bookings:

Repeat society customers:

Local partnerships

Vet clinics contacted:

Pet shops contacted:

Posters placed:

QR scans:

Partner leads:

Partner paid bookings:

Digital and direct outreach

Instagram spend:

Instagram leads:

Qualified digital leads:

Dog-park conversations:

Direct leads:

Paid bookings:

Booking performance

Cumulative paid bookings:

Completed bookings:

Assignment success:

Median assignment time:

Report Cards delivered:

Sitter no-shows:

Refunds:

Incidents:

Retention

Repeat intent:

Second paid bookings:

Same-sitter requests:

Five-walk packs:

Weekly-plan waitlist:

Area analysis

Best society:

Best channel:

Best micro-area:

Average sitter travel:

Contribution by area:

Decision

FOCUS_ON_WINNING_MICRO_AREA

CONTINUE_CURRENT_SCOPE

ADD_ONE_LOCALITY

FIX_SUPPLY

FIX_ACQUISITION

PAUSE_EXPANSION

Final Week 2 operating principle

Week 2 succeeds when PetSaathi creates a compact cluster of repeatable demand—not when it collects the largest possible number of scattered leads.

Simple explanation for professor

“During Week 2, PetSaathi will focus on creating booking density in selected localities rather than marketing across the whole city.

On Day 8, the team will contact ten to twenty apartment societies and present the controlled pet-care pilot. The goal is to identify three to five interested societies and obtain permission for posters, digital flyers, resident-group communication or a trial event.

On Day 9, PetSaathi will place trackable posters at selected veterinary clinics and pet shops. Each poster will have a unique QR code so the team can identify which partner generated each lead and paid booking.

On Day 10, a small Instagram campaign will target only Bopal and nearby supported areas. The advertisement may send users to the PetSaathi booking page or directly to WhatsApp for assisted onboarding. The campaign will be evaluated using qualified leads and paid bookings rather than likes or views.

On Day 11, the team will speak directly with pet parents at appropriate local dog parks. The outreach will be respectful and permission-based. The team will record common problems, preferred walking times and interest in repeat services.

On Day 12, one or more societies will receive a limited ₹99 resident trial offer. These will remain private individual walks, not group walks involving unfamiliar dogs. Scheduling several customers in the same society will reduce travel while maintaining safe one-to-one service.

On Day 13, customers who completed successful services will receive same-sitter rebooking options and, where appropriate, a five-walk starter pack or weekly-plan waitlist.

On Day 14, the team will compare Bopal and nearby micro-areas using paid bookings, assignment time, sitter travel, completion, repeat demand, support workload and contribution margin. The best area will be the one that provides both customer demand and operational efficiency.

By the end of Week 2, the recommended result is forty to sixty cumulative paid bookings, three to five interested societies, strong Report Card and completion rates, actual repeat bookings and one clearly identified micro-market for continued growth.”

PetSaathi Phase 5 — Week 3

Paid Acquisition and Repeat Plans 📈🐾

Executive decision

Week 3 should test whether PetSaathi can acquire customers beyond warm contacts and convert first-time trial users into repeat paid customers.

The correct growth loop is:

Local advertisement or referral

↓

Qualified pet-parent lead

↓

Pet Profile completed

↓

Booking request

↓

Eligible sitter assigned

↓

Payment captured

↓

Service completed

↓

Report Card delivered

↓

Second paid booking

↓

Repeat plan offered

The main Week 3 principle is:

Optimise for completed paid bookings and repeat customers—not clicks, messages, leads or package purchases alone.

1. Correcting the Week 3 targets

Your proposed target is:

Total paid bookings: 80–150

This should be interpreted as the cumulative total by the end of Day 21, not 80–150 additional bookings during Week 3.

If Week 2 ends with 40–60 paid bookings:

### Table 17

| End-of-Week-3 total | Additional bookings required |
| --- | --- |
| 80 | 20–40 |
| 100 | 40–60 |
| 120 | 60–80 |
| 150 | 90–110 |

Reaching 150 from a starting point of 60 requires approximately 13 additional paid bookings every day for seven days. That is too aggressive for a manually matched, controlled pilot unless sitter capacity and support coverage have already expanded significantly.

Recommended Week 3 target

Minimum cumulative result: 75–80 paid bookings

Target: 90–100 paid bookings

Stretch: 110–120 paid bookings

150: only if all quality gates remain stable

Do not increase advertising merely to reach 150 if assignment time, Report Card delivery or customer support deteriorates.

2. Week 3 operating scope

Geography

Keep campaigns limited to areas PetSaathi can genuinely serve:

Primary: Bopal

Secondary: South Bopal

Society clusters already validated

Satellite: only if formally enabled

Google Ads permits geographic targeting at sub-country and local-area levels. For a hyperlocal service, campaigns should target people physically in or regularly located in the service area rather than broadly targeting everyone who has merely shown interest in Ahmedabad.

Services promoted

Primary: 30-minute dog walking

Secondary: One-hour daytime pet sitting

Boarding: Invite-only beta, not broad acquisition

Daily capacity

Before activating campaigns, calculate:

Available sitter hours

− existing repeat bookings

− operational buffers

− backup capacity

= maximum new customer capacity

Do not buy 100 leads when the team can serve only ten new customers.

3. Week 3 day-by-day plan

Day 15 — Tracking and campaign preparation

Work

Confirm active areas

Confirm available sitter capacity

Confirm offer prices

Create campaign landing pages

Configure UTM parameters

Configure referral codes

Verify booking and purchase events

Create CAC dashboard

Define qualified-lead criteria

Set budget limits

Output

Campaign tracking ready

Channel-specific landing pages

CAC calculation model

Approved campaign budget

Day 16 — Launch Instagram local test

Work

Run two or three local creatives

Target only supported areas

Test click-to-WhatsApp versus booking landing page

Limit daily lead volume

Record qualified conversations

Pause low-quality creative quickly

Output

Instagram leads

Cost per qualified lead

Pet Profile conversions

Paid booking conversions

Day 17 — Launch Google Search test

Work

Create hyperlocal search campaign

Use service-and-area keywords

Add negative keywords

Configure location presence

Track booking requests and verified purchases

Review actual search terms daily

Output

High-intent search leads

Cost per booking request

Cost per paid customer

Search-term insights

Day 18 — Activate vet and pet-shop referrals

Work

Finalise referral terms

Assign unique partner codes

Train partner staff on the correct offer

Display posters or QR cards

Pay commission only after completed paid bookings

Avoid implying veterinary endorsement unless formally agreed

Output

Trusted referral leads

Partner conversion data

Completed referral bookings

Day 19 — Launch customer referral programme

Work

Create ₹100 promotional credit

Define fraud controls

Create referral links or codes

Add credit ledger

Publish terms

Notify satisfied customers only

Output

Customer referral programme

Trackable referral codes

Referral-credit ledger

Day 20 — Offer repeat plans

Work

Identify eligible repeat customers

Offer same-sitter booking first

Test five-walk plan

Test defined pet-sitting plan

Keep 20-walk plan restricted

Keep boarding invite-only

Output

Second paid bookings

Starter-plan purchases

Same-sitter retention

Recurring-demand evidence

Day 21 — Channel and retention review

Work

Calculate channel CAC

Review paid-booking quality

Review repeat cohorts

Review assignment load

Review refunds and incidents

Select winning channel

Pause poor-quality channels

Set Week 4 spending limits

Output

Best channel decision

CAC estimate

Repeat-rate report

Week 4 growth recommendation

4. Instagram local advertisements

Recommended budget

₹2,000–₹5,000 total

Duration: 5–7 days

Approximate daily budget: ₹300–₹700

This is an experimental budget, not a guaranteed customer-acquisition formula.

Recommended campaign structure

Campaign A — Click to WhatsApp

Suitable for users who need trust explanations before booking.

Meta supports advertisements that open a WhatsApp conversation directly from Facebook or Instagram.

Campaign B — Booking landing page

Suitable for users ready to:

Review the service

See pricing

Create a Pet Profile

Submit a booking request

Do not combine both journeys into one conversion measurement. Track them separately.

Instagram audience

Use:

Supported localities

Suitable age range

Pet-related interests where available

Existing website visitor retargeting only after sufficient consent and audience volume

Exclusion of existing customers where the objective is acquisition

Meta allows audience selection using location and available demographic, interest and behavioural controls, although targeting options can change over time.

Creative tests

Creative 1 — Trust

Busy today? Book a verified local dog walker in Bopal with a private photo update and Pet Report Card.

Creative 2 — Introductory offer

First 30-minute dog walk: ₹99.Normal repeat price: ₹149.

Creative 3 — Repeat benefit

Find a walker your dog knows. Book a first trial and request the same sitter next time.

Required offer details

Every ad should state:

Active area

Duration

Trial price

Normal price

Limited availability

Pet Profile review required

Prepayment requirement

Assignment subject to availability

India’s consumer-protection authorities have taken action against misleading pricing and hidden charges. The final payable price and material conditions should therefore be transparent throughout the ad, landing page and checkout.

Instagram success metrics

Do not stop at:

Impressions

Likes

Video views

Messages

Track:

Cost per WhatsApp conversation

Cost per qualified lead

Pet Profile completion rate

Booking-request rate

First paid booking rate

Service completion rate

Repeat booking rate

Refund and complaint rate

5. Google Search advertisements

Recommended budget

₹2,000–₹5,000 total

Duration: 5–7 days

Search demand in one micro-area may be limited. Do not force the platform to spend the complete budget if relevant search volume is low.

Why Google Search matters

Instagram often identifies interest.

Google Search can capture a user who is actively searching:

dog walker near me

dog walker Bopal

dog walking service Ahmedabad

pet sitter Bopal

pet sitting near me

Google Search campaigns can be geographically restricted and optimised around website actions such as enquiries, signups and purchases.

Recommended keyword groups

Dog walking

"dog walker bopal"

"dog walking bopal"

"dog walker near me"

"dog walking service ahmedabad"

"verified dog walker"

Pet sitting

"pet sitter bopal"

"pet sitting bopal"

"pet sitter near me"

"in home pet sitting ahmedabad"

Negative keywords

Initially exclude searches such as:

jobs

job vacancy

salary

course

training

free

adoption

rescue

government

grooming

pet taxi

veterinary job

Also exclude boarding if boarding is not publicly active.

Google Ads supports negative keywords so advertisers can prevent ads from showing for irrelevant searches.

Landing-page structure

A Google Search visitor should reach a page that matches the search.

Example:

/city/ahmedabad/dog-walking-bopal

The page should show:

Bopal availability

30-minute duration

₹99 introductory offer

₹149 normal price

Sitter-verification process

Pet Report Card

Booking steps

Support contact

Limited availability

Do not send a user searching “dog walker Bopal” to a generic homepage that also promotes grooming, boarding and training.

Google conversion setup

Track two different outcomes:

Secondary conversion

booking_requested

Primary conversion

verified first paid booking

A purchase or equivalent paid-booking conversion should fire only after PetSaathi confirms the captured payment on the backend.

Use the public booking code as a unique transaction ID so repeated page loads do not count the same purchase multiple times. Google Ads specifically supports unique transaction IDs to reduce duplicate conversion counting.

6. Vet and pet-shop referral programme

Referral model

The partner should earn commission only after:

New customer

↓

First paid booking captured

↓

Service completed

↓

No immediate reversal or fraud issue

↓

Partner commission becomes eligible

Do not pay for:

Poster scans

Form submissions

Duplicate leads

Cancelled bookings

Failed payments

Internal test bookings

Recommended commission test

Choose one model:

Fixed commission

₹100–₹150 per completed first booking

Percentage commission

10%–15% of the first completed booking

subject to a maximum cap

Fixed commission is simpler for the pilot.

Required partner controls

Written referral terms

Unique code

Commission ledger

Defined payout date

No false medical endorsement

No use of clinic logo without permission

No sharing customer medical information

Clear responsibility for customer consent

7. Society WhatsApp campaigns

Society WhatsApp can be the lowest-cost and highest-density channel, but it must remain permission-based.

Correct process

Society administrator approves message

↓

One clear message is shared

↓

Resident uses society-specific code

↓

PetSaathi qualifies the customer

↓

Booking follows normal safety process

Message example

PetSaathi is running a limited dog-walking pilot for residents of this society. The ₹99 first walk includes a verified assigned sitter, photo update and Pet Report Card. Normal repeat price: ₹149. Limited prepaid slots; Pet Profile review required.

Do not

Repeatedly spam the group

Add residents to another group without consent

Claim the society officially recommends PetSaathi unless it has done so

Publish sitter phone numbers

Accept unreviewed group-walk bookings

8. ₹100 customer referral credit

Recommended structure

Existing customer shares referral code

↓

New customer creates a different account

↓

New customer completes first paid service

↓

Referral validated

↓

Existing customer receives ₹100 service credit

Do not release the credit merely when the referred person signs up.

Credit rules

Value: ₹100

Type: Promotional service credit

Cash withdrawal: Not allowed

Transfer: Not allowed

Expiry: 30–60 days

Minimum booking value: Defined

Maximum credits per customer: Defined

Eligible services: Dog walking/pet sitting

This should be implemented as a promotional-credit ledger, not as a general wallet.

Anti-fraud checks

Block or review:

Same phone number

Same email

Same payment identity

Same user referring themselves

Repeated fake accounts at one address

Cancelled or refunded referred booking

Suspicious device or payment patterns

Referral metrics

Referral links created

Referral visitors

Referred Pet Profiles

Referred booking requests

Completed first bookings

Credits issued

Second booking rate

Referral CAC

9. Repeat plan pricing correction

Your proposed ranges are too broad.

If the ordinary repeat walk costs ₹149:

5 separate walks = ₹745

10 separate walks = ₹1,490

20 separate walks = ₹2,980

Therefore, plans priced at ₹999, ₹1,999 or ₹3,999 would be more expensive than purchasing walks individually. That would confuse customers unless the plan included materially different services.

Current public Ahmedabad listings show substantial price variation: examples range from approximately ₹90 for a short introductory walk to roughly ₹180–₹250 per walk depending on duration and caregiver. Another provider publicly lists monthly walking packages starting around ₹2,400. These figures support local pricing experimentation, but PetSaathi’s own standard rate and sitter economics must remain the primary basis.

10. Recommended dog-walking plans

Five-walk starter plan

Price: ₹699

Effective price: ₹139.80 per walk

Normal individual total: ₹745

Approximate saving: ₹46

Validity: 30 days

This is a modest discount appropriate for early repeat testing.

Ten-walk plan

Price: ₹1,299

Effective price: ₹129.90 per walk

Normal individual total: ₹1,490

Approximate saving: ₹191

Validity: 45 days

Offer this after at least one or two successfully completed walks.

Twenty-walk plan

Recommended:

Price: ₹2,499–₹2,599

Effective price: approximately ₹125–₹130 per walk

Normal individual total: ₹2,980

Validity: 60 days

Do not broadly sell this during early Week 3. A 20-walk commitment can create supply and refund obligations before PetSaathi has proven consistent sitter capacity.

11. Repeat-plan rules

Every plan must define:

Number of service credits

Duration of each service

Pet and household eligibility

Active area

Expiry

Cancellation cutoff

Rescheduling rules

No-show treatment

Refund treatment

Sitter replacement

Same-sitter preference

Whether unused credits expire

Whether credits may be paused

Recommended operating model

Plan purchased

↓

Service credits created

↓

Customer selects a date

↓

Availability and pet information revalidated

↓

One credit reserved

↓

Booking confirmed

↓

Credit consumed after service

Do not immediately deduct a credit when a customer merely opens the booking form.

Plan statuses

OFFERED

PURCHASED

ACTIVE

EXHAUSTED

EXPIRED

CANCELLED

REFUND_REVIEW

Important limitation

A plan is not a guaranteed sitter reservation unless specific time slots have been separately confirmed.

Use:

Same sitter preferred, subject to availability.

Not:

Your sitter is guaranteed for all ten walks.

12. Weekly pet-sitting plan

“Weekly pet sitting” is too ambiguous to price.

Define exactly what the customer receives.

Recommended first test

Four 60-minute home visits

Price: ₹1,099

Validity: 30 days

Normal individual price: 4 × ₹299 = ₹1,196

Possible launch offer:

Introductory first plan: ₹999

Standard repeat plan: ₹1,099

Included

One registered household

One or defined number of pets

Daytime visits

Food, water and routine care

Photo update

Report Card

Same sitter preferred

Not included

Overnight sitting

Complex medication

Emergency veterinary treatment

Unlimited visits

Automatic renewal

Boarding

13. Weekend boarding beta

Recommended price band:

Standard invite-only beta: ₹999–₹1,299 per night

Enhanced or premium-care case: ₹1,499+

₹1,999 only when additional services justify it

A current public Ahmedabad boarding listing shows approximately ₹1,000 per night, providing a useful market reference for the lower end of the beta test.

Boarding conditions

Invite-only

One guest pet initially

One-night maximum initially

Green risk only

Meet-and-greet required

Property approved

Compatibility reviewed

Vaccination policy satisfied

Emergency plan recorded

No automatic package discount

Boarding should not be promoted through broad paid acquisition during Week 3.

14. CAC calculation

Cost per qualified lead

Channel spend

÷

Qualified leads from that channel

A qualified lead should:

Live in the active service area

Have an eligible pet

Request an active service

Provide valid contact details

Express a realistic service date or need

Paid-media CAC

Instagram and Google ad spend

÷

New customers whose first paid service was completed

Referral CAC

Partner commissions

+ customer referral credits issued

÷

New completed first-time customers from referrals

Blended CAC

Paid advertising

+ referral commissions

+ referral credits

+ directly attributable campaign costs

÷

All new first-time paid customers

Do not use

Ad spend ÷ all leads

as CAC. That is cost per lead, not customer acquisition cost.

15. Interpreting the paid-lead target

Your combined paid-ad budget is:

Instagram: ₹2,000–₹5,000

Google: ₹2,000–₹5,000

Combined: ₹4,000–₹10,000

With a target of 50–100 paid-ad leads, the implied test range is approximately:

₹40–₹200 per lead

This is not a predicted market benchmark. It is the mathematical range produced by your budget and lead target.

The more important results are:

Cost per qualified lead

Cost per completed first booking

30-day repeat rate

Contribution after sitter payout

16. Best-channel decision

Do not identify the winner using the cheapest lead.

A channel qualifies as the best channel when it produces:

Meaningful volume

Acceptable CAC

High Pet Profile completion

High payment conversion

High service completion

Low refund/dispute rate

Strong repeat bookings

Sustainable support workload

Recommended minimum evidence

Before declaring a winner, seek at least:

5–10 completed paid customers from the channel

For stronger confidence:

15+ completed paid customers

Channel scorecard

### Table 18

| Metric | Instagram | Google Search | Vet/shop | Society | Customer referral |
| --- | --- | --- | --- | --- | --- |
| Spend |  |  |  |  |  |
| Qualified leads |  |  |  |  |  |
| Paid customers |  |  |  |  |  |
| CAC |  |  |  |  |  |
| Completion |  |  |  |  |  |
| Repeat rate |  |  |  |  |  |
| Refund rate |  |  |  |  |  |
| Contribution |  |  |  |  |  |

GA4’s Traffic Acquisition and campaign reporting can help compare where sessions and key events originated, while PetSaathi’s database should remain the authoritative source for paid bookings and completed services.

17. Repeat-customer target

Your target is:

Repeat customers: 25%+

The denominator must be cohort-based.

Correct formula

Customers completing a second paid booking

÷

Customers whose first completed booking occurred early enough to repeat

× 100

For Week 3, use an eligibility window such as:

First service completed at least 7–14 days earlier

Do not count a customer whose first service occurred yesterday as a non-repeat customer.

Track separately

Would book again

Repeat CTA clicked

Second booking requested

Second payment captured

Second service completed

Plan purchased

The strongest evidence is a second completed paid service, not stated interest.

18. Week 3 operational safeguards

Pause or reduce paid acquisition if:

Assignment success falls below 90%

Median assignment time rises sharply

Report delivery falls below 95%

Sitter no-show reaches 5%

Support cannot respond during services

Incorrect pricing is shown

Refund rate rises above 5%

Serious incident remains unresolved

Paid leads are mostly outside active areas

Sitter availability is exhausted

Channel-specific pause

Example:

Instagram generates many low-quality chats

→ pause Instagram

→ continue Search and society referrals

Do not pause every acquisition source because one channel performs poorly.

19. Recommended Week 3 targets

### Table 19

| Metric | Recommended target |
| --- | --- |
| Cumulative paid bookings | 90–100 |
| Minimum cumulative result | 75–80 |
| Stretch cumulative result | 110–120 |
| Paid-ad qualified leads | 50–100 |
| Actual repeat rate | 25%+ among eligible cohort |
| Report Card delivery | 95%+ |
| Assignment success | 90%+ |
| Booking completion | 90%+ |
| Sitter no-show | Below 5% |
| Refund/dispute rate | Below 5% |
| Best channel | Identified with paid-customer evidence |
| CAC | Calculated by channel and blended |
| Open critical bugs | 0 |
| Unresolved serious incidents | 0 |

20. Week 3 final report format

Paid acquisition

Instagram spend:

Instagram qualified leads:

Instagram paid customers:

Instagram CAC:

Google spend:

Google qualified leads:

Google paid customers:

Google CAC:

Partner commissions:

Partner paid customers:

Partner CAC:

Referral credits:

Referral paid customers:

Referral CAC:

Funnel

Ad/referral visitors:

Qualified leads:

Pet Profiles completed:

Booking requests:

Approved requests:

Sitters assigned:

Payments captured:

Services completed:

Reports delivered:

Repeat plans

Same-sitter repeat requests:

Second paid bookings:

5-walk plans sold:

10-walk plans sold:

20-walk plans sold:

Pet-sitting plans sold:

Boarding beta requests:

Quality

Booking completion:

Assignment success:

Report delivery:

Average rating:

Sitter no-show:

Refund rate:

Incidents:

Decision

SCALE_WINNING_CHANNEL

CONTINUE_TEST

PAUSE_PAID_ADS

FOCUS_ON_RETENTION

FIX_SUPPLY

FIX_CONVERSION

Final Week 3 operating principle

Paid acquisition is successful only when it produces customers who complete a safe service and return—not when it produces inexpensive clicks or WhatsApp messages.

Simple explanation for professor

“During Week 3, PetSaathi will test small paid marketing campaigns and convert first-time customers into repeat users.

The team will run a local Instagram campaign and a Google Search campaign with budgets between ₹2,000 and ₹5,000 each. The campaigns will target only areas where verified sitters are available. Instagram will test trust-based and ₹99 trial advertisements, while Google Search will focus on high-intent searches such as ‘dog walker Bopal’ and ‘pet sitter near me.’

PetSaathi will also continue referrals from veterinary clinics, pet shops and apartment societies. Partners will receive commission only after a referred customer completes a real paid booking. Existing satisfied customers may earn a ₹100 non-cash service credit after their referred customer completes the first service.

Every channel will be tracked from lead to Pet Profile, booking request, payment, service completion and repeat booking. Customer acquisition cost will be calculated using completed first-time paid customers, not only leads.

Repeat plans will be priced using the normal ₹149 walking price. The recommended five-walk plan is ₹699, the ten-walk plan is ₹1,299 and the twenty-walk plan should be approximately ₹2,499 to ₹2,599. Higher proposed prices would cost more than buying individual walks and therefore would not make sense.

A weekly pet-sitting plan must clearly define the number and duration of visits. A suitable test is four one-hour visits for approximately ₹1,099. Boarding will remain an invite-only beta rather than being promoted through broad paid advertisements.

By the end of Week 3, PetSaathi should aim for approximately ninety to one hundred cumulative paid bookings, fifty to one hundred qualified paid-ad leads and a repeat rate above twenty-five percent among customers who have had enough time to rebook. The winning channel will be selected using paid-customer CAC, service completion, repeat demand, refunds and contribution—not simply the cheapest lead.”

PetSaathi Phase 5 — Week 4

Optimization, Launch Report and Phase 6 Decision 📊🐾

Executive decision

This final period should not be used only to “push more bookings.” Its real purpose is to determine whether PetSaathi has found a repeatable and operationally safe service model.

The optimization process should follow:

Collect verified launch data

↓

Analyse demand and conversion

↓

Analyse sitter capacity and quality

↓

Calculate real contribution margin

↓

Review complaints and incidents

↓

Improve pricing and UX

↓

Run one controlled final booking push

↓

Create the launch report

↓

Make a documented go/no-go decision

Schedule correction

Days 22–30 contain nine days, not seven. A more accurate name is:

Week 4 — Optimization

Days 22–28

Phase 5 Review and Decision

Days 29–30

The final decision must not depend on opinions such as “the launch felt successful.” It should use predefined product, financial, operational, safety and reliability gates.

1. Main objective

By Day 30, PetSaathi should answer:

Which service has the strongest paid demand?

Which micro-area is operationally efficient?

Which sitters are reliable enough for expansion?

Which acquisition channel produces valuable customers?

Does each booking create acceptable contribution?

Why do customers abandon the booking flow?

Why do customers complain, cancel or request refunds?

Is repeat demand real?

Can the platform handle more volume safely?

Should Phase 6 begin, Phase 5 continue or part of the product be repaired?

2. Data-freeze and reporting rules

Before analysis begins, define the reporting window.

Example:

Launch period:

Day 1, 00:00 IST

to

Day 28, 23:59 IST

Use a fixed timezone:

Asia/Kolkata

Exclude from commercial metrics

Internal test bookings

Zero-value operational tests

Duplicate payment attempts

Staff bookings

Cancelled sandbox transactions

Fraudulent accounts

Data generated by automated testing

Preserve separately

Do not delete:

Fully refunded bookings

Cancelled bookings

Failed payment attempts

No-shows

Incidents

Complaints

These records are necessary for quality and financial analysis.

3. Single source of truth

Use different systems for different purposes.

PetSaathi database

Authoritative for:

Booking status

Payment status

Assignment

Service completion

Report delivery

Refunds

Reviews

Incidents

Repeat bookings

Sitter earnings

Razorpay records

Authoritative for:

Provider payment state

Captured amount

Fees

Settlement

Refund status

Settlement adjustments

Razorpay provides payment, settlement and reconciliation reports that can be used to compare provider transactions with PetSaathi’s internal records. Settlement details include credits, debits, fees, tax and adjustments.

GA4

Useful for:

Visitor behaviour

Channel acquisition

Booking-funnel abandonment

Device breakdown

Campaign performance

Cohort behaviour

GA4 Funnel Exploration is designed to show where users succeed or abandon a journey, while Cohort Exploration compares the behaviour of groups over time.

4. Day 22 — Analyse bookings and service demand

Objective

Determine what customers actually paid for—not merely what they clicked or asked about.

4.1 Booking funnel

Analyse this complete funnel:

Visitors

↓

Book CTA clicks

↓

Booking form starts

↓

Pet Profile completed

↓

Booking requests submitted

↓

Requests approved

↓

Sitter assigned

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

Review submitted

↓

Repeat paid booking

GA4’s funnel tools can reveal inefficient or abandoned steps, including the progression from first-time buyer to repeat buyer.

Conversion formulas

Booking-form completion

Booking requests submitted

÷

Eligible booking-form starts

× 100

Approval rate

Approved requests

÷

Booking requests submitted

× 100

Assignment success

Bookings receiving an eligible sitter

÷

Approved bookings

× 100

Payment conversion

Captured payments

÷

Payment attempts started

× 100

Service completion

Services completed

÷

Confirmed bookings due

× 100

End-to-end conversion

Completed paid services

÷

Eligible booking-form starts

× 100

4.2 Analyse demand by service

Compare:

Dog walking

Pet sitting

Boarding beta

Partner grooming referrals

For every service, measure:

Leads

Booking requests

Approved requests

Paid bookings

Completion rate

Average order value

Repeat bookings

Refund rate

Incident rate

Admin effort

Sitter availability

Example service scorecard

### Table 20

| Service | Requests | Paid | Completed | Repeat | Refunds | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| Dog walking | 100 | 72 | 69 | 28% | 3% | Strong |
| Pet sitting | 35 | 20 | 18 | 15% | 5% | Continue controlled |
| Boarding beta | 8 | 3 | 3 | Too early | 0% | Insufficient evidence |

Do not select the best service by revenue alone. A high-value service may also require disproportionate support and risk.

4.3 Analyse demand by micro-area

For each area or society cluster, compare:

Qualified leads

Paid customers

Paid bookings

Bookings per square kilometre

Median sitter travel time

Median assignment time

Completion rate

Repeat rate

Refunds

Incidents

Contribution margin

Best-area formula

The winning area should combine:

Strong paid demand

+ short sitter travel

+ fast assignment

+ high completion

+ repeat usage

+ acceptable support load

+ positive contribution

Do not select an area based only on lead volume.

4.4 Analyse demand by time slot

Compare:

Morning

Midday

Evening

Weekday

Weekend

For dog walking, track specific slots:

6:30–7:00 AM

7:00–7:30 AM

7:30–8:00 AM

5:30–6:00 PM

6:00–6:30 PM

6:30–7:00 PM

Measure:

Requests

Supply available

Fill rate

Sitter acceptance

Late starts

Repeat demand

This reveals whether PetSaathi has a general demand problem or only a shortage at specific times.

4.5 Analyse acquisition channels

Compare:

Warm leads

Society outreach

Vet referrals

Pet-shop referrals

Instagram

Google Search

Dog-park outreach

Customer referrals

For each channel:

Spend

Qualified leads

Pet Profiles completed

Paid customers

Completed first bookings

Second paid bookings

CAC

Refund rate

Contribution

Day 22 output

Service-demand report

Area-demand report

Booking-funnel report

Time-slot demand report

Channel-quality report

5. Day 23 — Analyse sitter performance

Objective

Identify which sitters can support expansion and where supply is weak.

5.1 Sitter scorecard

Measure:

Offers received

Offers viewed

Offers accepted

Offers declined

Acceptance rate

Assigned bookings

Completed bookings

On-time starts

Late starts

No-shows

Report completion

Average customer rating

Complaints

Incidents

Repeat requests

Cancellation rate

Formulas

Offer acceptance

Accepted offers

÷

Valid offers received

× 100

On-time rate

Define “on time” first, for example:

Started between 10 minutes early

and 5 minutes late

Then calculate:

On-time starts

÷

Completed assigned bookings

× 100

Report completion

Reports delivered

÷

Services completed by sitter

× 100

Sitter no-show

Confirmed assigned bookings marked no-show

÷

Confirmed assigned bookings due

× 100

Repeat-request rate

Customers requesting same sitter again

÷

Customers served by sitter and eligible to repeat

× 100

5.2 Do not rank sitters using rating alone

A sitter with a 5.0 rating from two bookings should not automatically rank above one with a 4.8 rating from 30 bookings.

Use a balanced review of:

Experience volume

Rating

On-time performance

No-show history

Report quality

Incident history

Pet-handling permissions

Repeat requests

Availability

Recommended performance categories

Reliable

High completion

Strong punctuality

Reports delivered consistently

No unresolved serious incident

Positive customer feedback

Needs coaching

Repeated late starts

Weak Report Card quality

Avoidable communication problems

Low offer response

Restricted

Expired verification

Repeated no-shows

Serious unresolved complaint

Unsafe handling concern

Policy breach

Insufficient data

Too few completed services for a reliable decision

5.3 Capacity analysis

For every sitter, calculate:

Declared available hours

− existing recurring commitments

− travel and service buffers

− reserved backup capacity

= available launch capacity

Do not treat all listed availability as sellable capacity.

Supply-demand heat map

Create a matrix:

### Table 21

| Time | Demand | Eligible sitters | Capacity status |
| --- | --- | --- | --- |
| 7:00 AM | 15 requests | 3 sitters | Shortage |
| 12:00 PM | 3 requests | 4 sitters | Excess |
| 6:00 PM | 12 requests | 2 sitters | Critical shortage |

Day 23 output

Sitter performance scorecards

Supply-demand heat map

Training/coaching list

Restriction list

Hiring or onboarding requirement

6. Day 24 — Analyse revenue and contribution margin

Objective

Determine whether PetSaathi creates a viable contribution from each service after real operating costs.

Revenue alone is not profit.

6.1 Revenue definitions

Gross booking value

Total value of verified paid bookings

before refunds

Net collected revenue

Captured customer payments

− completed refunds

Recognised service revenue

For internal launch reporting:

Revenue from services actually completed

Keep confirmed future bookings separate.

6.2 Booking contribution formula

Customer payment

− sitter compensation

− payment-processing cost

− discount subsidy

− referral commission

− directly attributable support cost

− media/storage cost

− refund and goodwill adjustment

= booking contribution

Example dog walk

Customer payment ₹149

Sitter payout −₹90

Payment expense −₹4

Support allocation −₹8

Media/storage allocation −₹2

-------------------------------------

Booking contribution ₹45

Example ₹99 trial

Customer payment ₹99

Sitter payout −₹90

Payment expense −₹3

Support allocation −₹8

Media/storage allocation −₹2

-------------------------------------

Booking contribution −₹4

A small controlled loss on an introductory trial may be acceptable when it generates profitable repeats. It must still be measured and capped.

6.3 Contribution by channel

30-day customer revenue

− sitter payouts

− payment costs

− refunds

− acquisition cost

− attributable support

= 30-day customer contribution

A channel with a low initial CAC may still be poor if its customers do not repeat or generate many refunds.

GA4’s User Lifetime analysis can compare sources and campaigns by longer-term user value, although PetSaathi’s operational database should remain authoritative for actual booking economics.

6.4 Reconcile payments and settlements

Compare:

PetSaathi captured-payment records

Razorpay payment reports

Razorpay refund records

Razorpay settlement reports

Bank credits

Required checks:

Every internal captured payment has a provider record

Every provider payment maps to one booking

Amount and currency match

Refund totals match

Settlement IDs are recorded

Fees and tax are recognised

Duplicate payments are resolved

Razorpay allows reports to be generated for payment transactions, settlements and reconciliation; settlements reflect captured amounts after applicable fees and adjustments.

Day 24 output

Revenue summary

Contribution by service

Contribution by area

Contribution by channel

Razorpay reconciliation report

Refund and settlement report

7. Day 25 — Analyse complaints and safety issues

Objective

Understand why customers were unhappy and whether any issue indicates a safety or process failure.

7.1 Separate complaints from incidents

Complaint

Examples:

Sitter was late

Report Card lacked detail

Customer disliked communication

Price was unclear

Photo was poor quality

Safety incident

Examples:

Bite

Escape

Pet injury

Medical emergency

Medication error

Serious access or security issue

Serious sitter/customer misconduct

Not every complaint is a safety incident, but complaints can reveal patterns that later create incidents.

7.2 Complaint categories

PUNCTUALITY

COMMUNICATION

PET_HANDLING

REPORT_QUALITY

PRICE_OR_BILLING

CANCELLATION

SITTER_MATCH

CUSTOMER_SUPPORT

APP_OR_WEBSITE

HOME_ACCESS

OTHER

Complaint-rate formula

Bookings with one or more substantiated complaints

÷

Completed bookings

× 100

Avoid counting five messages about one booking as five independent customer failures.

7.3 Root-cause analysis

For every repeated problem, ask:

What happened?

Why did it happen?

Why did the control not prevent it?

How many bookings were affected?

Could it happen again?

What corrective action is required?

Who owns the fix?

Example

Problem:

Three customers reported late sitters.

Immediate cause:

Travel time between bookings was too short.

Root cause:

Scheduling logic used service duration but not travel buffer.

Corrective action:

Add 15-minute area buffer and block overlapping assignments.

Owner:

Operations/Product

Deadline:

Before next campaign expansion

7.4 Corrective and preventive actions

Use:

Issue

Root cause

Immediate correction

Preventive change

Owner

Due date

Verification result

Possible actions:

Update booking copy

Add sitter coaching

Change time-slot buffer

Restrict a sitter

Reassess a pet

Improve equipment requirements

Change cancellation policy

Add admin checklist

Fix software validation

Day 25 output

Complaint taxonomy

Complaint-rate report

Incident summary

Root-cause analysis

Corrective-action register

Unresolved safety risks

8. Day 26 — Improve pricing and unit economics

Objective

Adjust pricing using real demand, cost and capacity evidence.

Do not increase or reduce every price simultaneously.

8.1 Pricing decision inputs

For every service:

Current price

Conversion rate

Sitter payout

Contribution

Time-slot demand

Area demand

Competitor reference

Refund rate

Repeat rate

Customer feedback

Capacity shortage

8.2 Pricing waterfall

Display:

Base price

Additional-pet fee

Peak-time fee

Area fee

Promotion

Tax where applicable

Final price

Do not hide mandatory fees until checkout.

8.3 Recommended dog-walking tests

Based on the existing pilot model:

Trial

First 30-minute walk: ₹99

Standard

Normal 30-minute walk: ₹149

High-demand slot experiment

Only if supply is genuinely constrained:

Selected peak slot: ₹169

This should be tested in one segment, not imposed across every booking.

Five-walk plan

₹699

Ten-walk plan

₹1,299

Do not sell the plan if the business cannot reserve enough capacity to fulfil it.

8.4 Pricing decision examples

Case A — High demand, supply shortage

Demand: Strong

Conversion: Strong

Capacity: Limited

Contribution: Low

Possible action:

Increase selected peak-time price

Recruit additional sitters

Limit introductory slots

Prioritise repeat customers

Case B — Strong leads, weak payment conversion

Demand: Apparent

Payment conversion: Weak

Customer feedback: Price concern

Possible action:

Improve value communication

Simplify fees

Test ₹129 versus ₹149 in one cohort

Avoid permanent price reduction before understanding trust friction

Case C — Good conversion, negative contribution

Possible action:

Reduce discount

Improve route density

Change sitter payout model transparently

Reduce support cost

Increase standard price

8.5 Pricing experiment rules

Each experiment needs:

Hypothesis

Audience

Area

Service

Original price

Test price

Start date

End date

Booking cap

Primary metric

Safety guardrails

Do not change prices for different users randomly without a documented rule.

Day 26 output

Updated price architecture

Pricing-test plan

Revised contribution forecast

Approved promotions

Retired promotions

9. Day 27 — Improve UX and reduce drop-offs

Objective

Repair the highest-impact friction in the customer, sitter and admin journeys.

9.1 Analyse the customer funnel

Break down abandonment by:

Device

Browser

Channel

Area

Service

New versus returning customer

Form step

Error code

GA4 Funnel Exploration supports segmentation and breakdowns that help identify where different user groups leave a process.

Example

### Table 22

| Step | Users | Drop-off |
| --- | --- | --- |
| Booking started | 100 | — |
| Pet selected | 92 | 8% |
| Time selected | 78 | 15% |
| Address entered | 62 | 21% |
| Request submitted | 58 | 6% |
| Payment started | 45 | 22% |
| Payment captured | 39 | 13% |

The largest drop occurs around address entry and payment readiness. Those steps should be investigated before redesigning unrelated pages.

9.2 Customer UX improvements

Possible improvements:

Reduce unnecessary form fields

Reuse saved Pet Profile information

Explain “request” versus “confirmed”

Show final price clearly

Show why admin review is required

Preserve form state after login

Improve error messages

Add WhatsApp assistance

Show unavailable time alternatives

Make same-sitter rebooking one tap

9.3 Sitter UX improvements

Review whether sitters can quickly see:

Offer expiry

Approximate area

Pet size and handling requirements

Expected earning

Start-service button

Emergency action

Report requirements

9.4 Admin UX improvements

Prioritise:

Unassigned bookings

Payments needing reconciliation

Services starting soon

Missing Report Cards

Open incidents

Do not spend Day 27 improving decorative animation while critical admin work remains hard to find.

9.5 Performance review

Measure public and authenticated pages separately.

Target Google’s current “good” Core Web Vitals thresholds at the 75th percentile:

LCP ≤ 2.5 seconds

INP ≤ 200 milliseconds

CLS ≤ 0.1

These metrics respectively cover loading, interaction responsiveness and visual stability.

Day 27 output

Prioritised UX issue list

Top funnel fixes deployed

Mobile fixes

Admin workflow improvements

Performance report

Before/after conversion comparison plan

10. Day 28 — Push final bookings responsibly

Objective

Complete the month with high-quality bookings without creating artificial or unsafe demand.

Priority audiences

Use this order:

Customers who completed one service but have not repeated

Customers who expressed repeat interest

Abandoned approved bookings

Customers with unused plan credits

Qualified leads from the winning area

Referrals from satisfied customers

Recommended final offers

Same-sitter repeat

Book your preferred sitter again at the standard price.

Five-walk plan

Five 30-minute walks for ₹699

Expiring pilot message

The Bopal launch trial is closing soon.

Limited verified-sitter slots remain.

Only use an expiry statement if the pilot offer genuinely has a documented end date or quantity.

Do not use

Extreme last-day discounts

Fake countdowns

Unavailable sitter promises

Boarding promotions without capacity

Citywide ads

Automatic plan enrolment

Misleading “last chance” claims

Capacity guard

Before sending offers:

Available sitter capacity

− confirmed bookings

− plan obligations

− backup capacity

= sellable final capacity

Day 28 output

Final repeat campaign

Recovered abandoned bookings

Plan conversions

Month-end completed-booking total

No capacity overload

11. Day 29 — Create the controlled-launch report

Objective

Produce one decision document containing product, operations, finance, safety and technical evidence.

Phase 5 Controlled Launch Report

A. Executive summary

Project:

Launch dates:

City:

Areas:

Services:

Active sitters:

Total customers:

Total paid bookings:

Total completed bookings:

Decision recommendation:

B. Booking funnel

Visitors:

Booking starts:

Pet Profiles completed:

Booking requests:

Approved requests:

Assigned bookings:

Payment attempts:

Captured payments:

Confirmed bookings:

Completed services:

Reports delivered:

Reviews:

Repeat paid bookings:

C. Service demand

### Table 23

| Service | Requests | Paid | Completed | Repeat | Contribution |
| --- | --- | --- | --- | --- | --- |
| Dog walking |  |  |  |  |  |
| Pet sitting |  |  |  |  |  |
| Boarding beta |  |  |  |  |  |

D. Area performance

Best area:

Best society cluster:

Paid booking density:

Median assignment time:

Median sitter travel:

Repeat rate:

Contribution per booking:

E. Acquisition

Channels tested:

Winning channel:

Qualified leads:

Paid customers:

CAC:

30-day repeat rate:

30-day customer contribution:

F. Sitter performance

Active sitters:

Offer acceptance:

Assignment completion:

On-time rate:

No-show rate:

Report completion:

Same-sitter requests:

Restricted sitters:

Additional supply required:

G. Finance

Gross booking value:

Net collected revenue:

Refunds:

Sitter payouts:

Marketing cost:

Payment expenses:

Support allocation:

Contribution:

Settlement reconciliation difference:

H. Quality and safety

Average rating:

Review sample:

Complaint rate:

Refund/dispute rate:

Incidents by severity:

Open incidents:

Corrective actions:

I. Technology

Open Severity 0 bugs:

Open Severity 1 bugs:

Payment mismatch:

Webhook failures:

Notification failures:

Media-upload failures:

Core Web Vitals:

Backup restore result:

J. Lessons

Best service:

Best area:

Best acquisition channel:

Best offer:

Main customer objection:

Main operational bottleneck:

Main technical bottleneck:

K. Recommendation

MOVE_TO_PHASE_6

EXTEND_PHASE_5

FIX_OPERATIONS

FIX_CONVERSION

REWORK_PRICING

PAUSE_LAUNCH

12. Day 30 — Go/no-go decision

Objective

Make a formal decision using predefined thresholds.

Google SRE guidance recommends using explicit service objectives and an error-budget policy to determine whether teams may continue launching changes or should pause and focus on reliability.

PetSaathi should use the same principle:

When reliability, safety or payment controls fall below the approved boundary, expansion stops even when demand is strong.

13. Phase 6 readiness scorecard

13.1 Demand

### Table 24

| Metric | Phase 6 gate |
| --- | --- |
| Verified paid bookings | 100 preferred minimum |
| Completed paid bookings | Meaningful operational sample |
| Best service identified | Yes |
| Best area identified | Yes |
| Best channel identified | Yes |

A result below 100 bookings does not automatically mean failure if the service has excellent repeat behaviour, but it usually means the evidence remains limited.

13.2 Service quality

### Table 25

| Metric | Gate |
| --- | --- |
| Booking completion | ≥90% |
| Assignment success | ≥90% |
| Report delivery | ≥95% |
| Sitter no-show | <5% |
| Refund/dispute rate | <5% |
| Customer rating | Around 4.5+ with meaningful sample |

Do not approve Phase 6 from an average rating based on only a few reviews.

13.3 Retention

Repeat formula

Customers completing a second paid booking

÷

Customers eligible to repeat

× 100

Recommended gate:

≥25% among a defined eligible cohort

Also review:

Same-sitter requests

Third booking

Plan usage

Unused or refunded plan credits

13.4 Operations

### Table 26

| Metric | Gate |
| --- | --- |
| Active-service support P90 | Under 10 minutes |
| Report backlog | Controlled |
| Replacement workflow | Tested |
| Serious incident backlog | 0 unresolved |
| Sitter capacity for next stage | Confirmed |
| Daily operations workload | Sustainable |

13.5 Finance

Required:

Booking contribution understood

Best service has a credible positive-contribution path

CAC calculated by channel

Refund exposure understood

Sitter payout process working

Razorpay and bank settlements reconciled

No unexplained duplicate payments

No material unresolved mismatch

Razorpay refunds can be created only against captured payments, and provider refund and settlement states should be reconciled independently from booking status.

13.6 Technology and security

Required:

Open Severity 0 defects = 0

Open Severity 1 defects = 0

Known cross-user access defects = 0

Unresolved payment mismatches = 0

Production backup restore = passed

Critical alerts = tested

Webhook processing = stable

Performance target:

LCP ≤2.5 seconds

INP ≤200 milliseconds

CLS ≤0.1

at the 75th percentile

14. Weighted decision model

Use a 100-point score.

### Table 27

| Category | Weight |
| --- | --- |
| Demand and retention | 25 |
| Service quality | 20 |
| Operations and sitter capacity | 20 |
| Finance and unit economics | 15 |
| Safety and compliance | 10 |
| Technology and security | 10 |

Decision ranges

85–100: Move to Phase 6

Only when there is no hard blocker.

70–84: Extend Phase 5

The model is promising, but more evidence or operational improvement is required.

50–69: Fix specific module

Demand may exist, but a major operating component is weak.

Below 50: No-go

Do not scale. Rework the offer or operating model.

Hard blockers override the score

Even a 90-point result cannot proceed when:

Critical security defect exists

Duplicate-charge issue remains

Serious incident is uncontrolled

Payment reconciliation is unreliable

No eligible sitter capacity exists

Mandatory legal or operational requirement is missing

15. Possible Day 30 decisions

Decision A — Move to Phase 6

Use when:

Demand is proven

Repeat demand is proven

Operations are stable

Quality targets pass

Contribution has a viable path

No hard blocker exists

Phase 6 should expand only one major dimension at a time

Choose one:

Add a new micro-area

or

Add deeper recurring plans

or

Build selected GPS capabilities

or

Improve matching assistance

Do not simultaneously:

Launch a new city

Build full GPS

Launch subscriptions

Automate matching

Add boarding at scale

Decision B — Extend Phase 5

Use when:

Customer quality is strong

Paid-booking sample is too small

Repeat cohort has not matured

Best channel is not yet clear

No major safety failure exists

Recommended extension:

14–30 additional days

without major feature expansion

Decision C — Fix operations

Use when:

Demand is strong

Assignment is slow

Sitter no-shows are high

Reports are missing

Support is overloaded

Incidents are recurring

Pause acquisition growth until operations recover.

Decision D — Fix conversion and UX

Use when:

Traffic and qualified leads are strong

Booking-form completion is weak

Payment conversion is weak

Service quality after purchase is strong

Focus on:

Trust communication

Pricing clarity

Form simplification

Availability

Payment recovery

Decision E — Rework pricing

Use when:

Customers pay

Services complete

Contribution is consistently negative

Repeat business does not recover acquisition cost

Do not solve negative economics only by cutting sitter pay.

Decision F — No-go or pause

Use when:

Safety is uncontrolled

Security is compromised

No repeat demand exists

Refunds or disputes are excessive

Operations cannot deliver reliably

Customers show interest but do not pay at sustainable prices

16. Recommended Day 30 targets

### Table 28

| Metric | Recommended threshold |
| --- | --- |
| Cumulative paid bookings | 90–120 realistic; 100+ preferred |
| Booking completion | ≥90% |
| Assignment success | ≥90% |
| Report delivery | ≥95% |
| Repeat customers | ≥25% of eligible cohort |
| Average rating | Around 4.5+ with meaningful sample |
| Sitter no-show | <5% |
| Refund/dispute rate | <5% |
| Active support P90 | <10 minutes |
| Open critical bugs | 0 |
| Unresolved serious incidents | 0 |
| Payment-reconciliation mismatch | 0 unresolved material mismatch |
| Best service/area/channel | Clearly identified |
| Unit economics | Credible positive path |

17. Final Phase 5 operating principle

The month is successful only when PetSaathi has learned how to acquire, assign, deliver and retain customers safely at a sustainable operating cost.

The final question is not:

“Did we reach the highest possible number of bookings?”

It is:

“Can we repeat the strongest service in the strongest area, using reliable sitters and a proven channel, without losing control of quality, safety or unit economics?”

Simple explanation for professor

“During the final stage of Phase 5, PetSaathi will analyse the controlled launch and decide whether the project is ready for Phase 6.

On Day 22, I will analyse booking demand by service, area, time slot and acquisition channel. I will study the complete funnel from website visitor to booking request, sitter assignment, payment, service completion, Report Card and repeat booking.

On Day 23, I will analyse sitter performance. The evaluation will include offer acceptance, punctuality, completed services, no-shows, Report Card quality, customer ratings, complaints and repeat-sitter requests. This will show which sitters are reliable and where additional supply is required.

On Day 24, I will calculate revenue and contribution margin. Customer payment will be compared with sitter payout, payment fees, discounts, referral costs, support costs, storage and refunds. Razorpay payment and settlement reports will also be reconciled with the PetSaathi database.

On Day 25, I will review complaints and incidents. Complaints will be grouped into punctuality, communication, handling, billing, Report Card and support issues. Serious safety incidents will be analysed separately. Repeated problems will receive a root-cause analysis and corrective action.

On Day 26, I will improve pricing using actual demand and cost data. Prices will not be changed randomly. Every test will have a clear audience, price, booking limit and success metric.

On Day 27, I will analyse booking drop-offs and improve the customer, sitter and admin experience. The largest points of abandonment will be fixed first. Mobile performance and Core Web Vitals will also be reviewed.

On Day 28, PetSaathi will run a controlled final booking push. The main focus will be existing satisfied customers, same-sitter repeat bookings, abandoned approved requests and qualified leads from the winning area. The team will not use fake scarcity or unsustainable discounts.

On Day 29, I will prepare a complete controlled-launch report covering bookings, services, areas, sitters, acquisition, revenue, margins, complaints, incidents, technology and repeat demand.

On Day 30, the project will receive a formal go/no-go decision. PetSaathi should move to Phase 6 only when it has strong paid demand, at least ninety percent booking completion and assignment success, ninety-five percent Report Card delivery, low no-shows and disputes, repeat customers, stable payment reconciliation, no critical defects and a clear path to positive unit economics.

The final decision may be to move to Phase 6, extend Phase 5, fix operations, improve conversion, revise pricing or pause the launch. Phase 6 should begin only when PetSaathi can repeat its strongest service safely and sustainably.”

PetSaathi Phase 5 — Daily Launch Operations and Funnel Management 🐾📊

Executive decision

The proposed schedule covers the main work, but it needs three corrections:

Add a pre-service readiness check before the first morning walk.

Do not make one person work continuously from 7:00 AM to 10:00 PM; use two overlapping operating shifts.

Correct the funnel order. Under PetSaathi’s approved manual-matching model, the sitter should normally be assigned before payment is collected and the booking is confirmed.

The correct daily operating loop is:

Prepare today’s services

↓

Monitor morning bookings

↓

Deliver and review Report Cards

↓

Follow up with customers

↓

Resolve sitter and payment issues

↓

Process new leads and booking requests

↓

Assign sitters for future services

↓

Run local acquisition

↓

Prepare evening bookings

↓

Monitor evening services

↓

Close reports, reviews and incidents

↓

Update dashboard

↓

Confirm next-day readiness

A production launch plan should assign clear owners, identify risks at each step and define contingency actions before problems occur.

1. Recommended operating shifts

The proposed operating day runs for approximately 15 hours. It should not depend on one person remaining continuously available.

Shift A — Morning operations

06:30 AM–02:30 PM

Responsible for:

Morning service preparation

Morning walk monitoring

Report Card review

Customer follow-up

Sitter issue resolution

New lead qualification

Handover to afternoon operations

Shift B — Afternoon and evening operations

02:00 PM–10:00 PM

Responsible for:

Booking assignments

Marketing and partner follow-ups

Evening readiness checks

Evening-service monitoring

Report Card closure

Dashboard update

Next-day preparation

Safety escalation owner

One named person should remain reachable whenever a PetSaathi service is active.

This person handles:

Pet injury

Bite or escape

Medical concern

Missing sitter

Serious customer complaint

Emergency veterinary escalation

Booking or payout hold

One person may perform multiple roles during a small pilot, but every active service must have a named operations owner and safety escalation owner.

2. Corrected daily operating schedule

Morning operations

### Table 29

| Time | Activity | Required output |
| --- | --- | --- |
| 06:30–07:00 | Pre-service readiness | All morning bookings confirmed |
| 07:00–09:00 | Monitor dog walks | Services started and completed safely |
| 09:00–10:00 | Check Report Cards | Reports delivered or correction requested |
| 10:00–11:00 | Customer follow-up | Feedback, complaints and repeat interest |
| 11:00–12:00 | Sitter issue review | Availability, delays and quality actions |

Afternoon operations

### Table 30

| Time | Activity | Required output |
| --- | --- | --- |
| 12:00–13:00 | New lead calls | Qualified leads and Pet Profile actions |
| 13:00–14:00 | Lunch and operational buffer | Unresolved morning issues closed |
| 14:00–15:00 | Booking review and assignments | Eligible sitter assigned |
| 15:00–16:00 | Marketing and outreach | Campaigns and lead sources updated |
| 16:00–17:00 | Society, vet and evening readiness | Partners followed up and evening services ready |

Evening operations

### Table 31

| Time | Activity | Required output |
| --- | --- | --- |
| 17:00–20:00 | Monitor evening services | Services delivered and exceptions handled |
| 20:00–21:00 | Report Cards and reviews | Reports delivered and feedback requested |
| 21:00–21:30 | Dashboard update | Daily metrics reconciled |
| 21:30–22:00 | Next-day booking check | Tomorrow’s services operationally ready |

3. Morning pre-service readiness

Time

06:30–07:00 AM

This is missing from the original schedule but is essential when services begin at 7:00 AM.

Check every morning booking

Booking status is CONFIRMED

Payment status is CAPTURED

Primary sitter remains active

Sitter has acknowledged the booking

Customer has received the reminder

Address and access instructions are complete

Pet Profile is available

No new health or behaviour issue was reported

Required equipment is ready

Support and escalation owners are available

Backup or replacement path is known

Readiness states

READY

CUSTOMER_CONFIRMATION_REQUIRED

SITTER_CONFIRMATION_REQUIRED

PAYMENT_REVIEW

SAFETY_REVIEW

REPLACEMENT_REQUIRED

CANCELLED

A booking should not be treated as ready merely because it appears on the calendar.

4. Monitoring morning dog walks

Time

07:00–09:00 AM

The operations dashboard should show:

Scheduled start

Assigned sitter

Customer and pet

Current booking status

Sitter check-in

Actual start time

Current delay

Concern status

Expected completion time

Normal sequence

CONFIRMED

↓

Sitter arrives

↓

SERVICE_STARTED

↓

Walk performed

↓

SERVICE_COMPLETED

↓

Report Card prepared

Example delay protocol

Five minutes late

Dashboard shows warning

Confirm sitter location or status

Ten minutes late

Contact sitter

Notify customer that the booking is being checked

Fifteen minutes late without reliable response

Escalate to operations lead

Review backup sitter

Record operational incident

Sitter unavailable

CONFIRMED

↓

REPLACEMENT_REQUIRED

↓

Replacement assigned

or

Booking cancelled and refund reviewed

These timing thresholds are recommended internal pilot rules and may be adjusted after operational evidence.

5. Report Card review

Time

09:00–10:00 AM

For every completed morning service, verify:

Actual start time

Actual end time

Duration

Water update

Toilet update

Mood

Leash behaviour

Photo or video

Sitter note

Concern indicator

Report states

DRAFT

SUBMITTED

ADMIN_REVIEW_REQUIRED

RETURNED_FOR_CORRECTION

DELIVERED

AMENDED

Recommended internal timing

For a dog walk:

Report submitted within 15 minutes

Report delivered within 30 minutes

For a longer pet-sitting service:

Report delivered within 60 minutes

Do not wait until the end of the day to discover that a customer never received a Report Card.

Concern handling

If the sitter reports:

Injury

Unusual illness

Escape attempt

Aggression

Equipment failure

Medication problem

the report should enter:

ADMIN_REVIEW_REQUIRED

and the relevant concern or incident workflow should begin immediately.

6. Customer follow-up

Time

10:00–11:00 AM

Prioritise customers who:

Completed their first service

Submitted a low rating

Reported a problem

Did not receive or view the Report Card

Expressed repeat interest

Abandoned an approved booking

First-service follow-up

Ask:

Did the sitter arrive on time?

Did you feel comfortable with the service?

Was the Report Card useful?

Was anything unclear?

Would you choose the same sitter again?

Would you pay the normal repeat price?

Is there anything PetSaathi should improve?

Follow-up outcomes

SATISFIED

REPEAT_INTEREST

SECOND_BOOKING_REQUESTED

COMPLAINT_REPORTED

SUPPORT_REQUIRED

REFUND_REVIEW

NO_RESPONSE

Do not pressure a dissatisfied customer to submit a positive public review. Resolve the issue first.

7. Sitter issue review

Time

11:00 AM–12:00 PM

Review:

Late starts

Declined offers

Missed notifications

Incomplete Report Cards

Media-upload problems

Customer complaints

Availability changes

Verification expiry

Sitter cancellations

Training needs

Issue outcomes

Routine coaching

Examples:

Report Card lacks detail

Sitter forgets to confirm availability

Customer communication needs improvement

Temporary restriction

Examples:

Repeated late starts

Expired verification

Repeated incomplete reports

Safety escalation

Examples:

Pet-handling concern

Serious complaint

Bite, escape or injury

False service evidence

Unauthorised person performed the service

Every action should record:

Sitter

Issue

Booking

Evidence

Action taken

Owner

Review date

8. New lead calls

Time

12:00–01:00 PM

Do not treat every phone number or WhatsApp message as a qualified lead.

Lead qualification

Confirm:

Customer lives in an enabled area

Requested service is active

Requested schedule is realistic

Pet type is supported

Customer is willing to complete a Pet Profile

Customer understands the pricing

Customer has a genuine service requirement

Lead states

NEW

CONTACTED

QUALIFIED

PET_PROFILE_REQUIRED

BOOKING_READY

OUTSIDE_AREA

UNSUPPORTED_SERVICE

FOLLOW_UP_LATER

NOT_INTERESTED

Output

Each qualified lead should have:

Lead source

Area

Service

Pet type

Desired date

Pet Profile status

Next action

Follow-up date

9. Booking review and sitter assignment

Time

02:00–03:00 PM

This block should process future bookings, not only same-day evening bookings.

Bookings for the next morning should ideally be assigned before the current evening ends.

Correct assignment flow

Booking request submitted

↓

Admin reviews area and Pet Profile

↓

Request approved

↓

Eligible sitters identified

↓

Offer sent

↓

Sitter accepts

↓

Admin assigns primary sitter

↓

Customer reviews final booking

↓

Payment started

↓

Payment captured

↓

Booking confirmed

Important correction

The user-provided funnel places payment before sitter assignment:

Payment completed

↓

Sitter assigned

That conflicts with PetSaathi’s approved Phase 4–5 operating model.

For the normal MVP flow, payment should occur after an eligible sitter and final price are available. Otherwise, PetSaathi may capture money for a booking it cannot fulfil.

Assignment checks

Sitter account active

Required service permission

Current verification

Pet-size permission

Risk permission

Correct service area

Sitter availability

No schedule conflict

Reasonable travel time

No active safety restriction

10. Marketing and outreach

Time

03:00–04:00 PM

Use this block for controlled acquisition, not constant campaign expansion.

Review:

Instagram campaign

Google Search campaign

Society WhatsApp messages

Partner QR scans

Customer referrals

Cost per qualified lead

Cost per completed customer

Booking capacity

Daily marketing decisions

CONTINUE

INCREASE_SLIGHTLY

CHANGE_CREATIVE

NARROW_AREA

PAUSE_CHANNEL

STOP_CAMPAIGN

Pause advertising when booking capacity is already full.

Do not generate leads that operations cannot serve safely.

11. Society and veterinary partner follow-up

Time

04:00–05:00 PM

Follow up with:

Society managers

Resident pet-group coordinators

Veterinary clinics

Pet shops

Grooming partners

Referral partners

Track

Contact made

Material shared

Trial approved

Poster active

Leads generated

Paid bookings

Repeat bookings

Partner commission

Next action

Evening readiness check

This time block should also confirm evening services:

Sitter acknowledgements

Customer readiness

Payment state

Access instructions

Replacement availability

12. Evening service operations

Time

05:00–08:00 PM

The same controls used for morning walks apply.

The dashboard should prioritise:

SERVICE_STARTING_SOON

SITTER_NOT_ACKNOWLEDGED

SERVICE_LATE

SERVICE_ACTIVE

CONCERN_REPORTED

SERVICE_OVERDUE

An operations team member should not be occupied with non-urgent marketing work while an active service has a safety or support problem.

13. Evening Report Cards and reviews

Time

08:00–09:00 PM

Review:

Services completed

Reports submitted

Reports missing

Media uploaded

Concerns

Customer notifications

Reviews requested

Sitter earnings status

Do not mark an earning eligible while:

Report is missing

Critical concern remains open

Assignment did not complete

Payment is unresolved

14. Daily dashboard update

Time

09:00–09:30 PM

The dashboard must use operational database data for bookings, assignments, payments and service results.

GA4 should be used for web and app journey analysis, including drop-off between funnel steps. Google’s Funnel Exploration is specifically designed to show the steps users take and where they succeed or abandon the journey.

Daily acquisition metrics

Website visitors

Book CTA clicks

Booking-form starts

Pet Profiles completed

Booking requests

Qualified leads

Booking metrics

Requests approved

Sitters assigned

Payments started

Payments captured

Bookings confirmed

Service metrics

Services due

Services started

Services completed

Late starts

No-shows

Report Cards delivered

Customer metrics

Reviews

Average rating

Complaints

Repeat requests

Second paid bookings

Control metrics

Refunds

Incidents

Payment mismatches

Notification failures

Critical technical errors

15. Next-day booking check

Time

09:30–10:00 PM

For every next-day booking, confirm:

Primary sitter assigned

Sitter acknowledged

Customer notified

Payment captured

Pet Profile complete

Address confirmed

Time and duration confirmed

Risk controls visible

Support owner assigned

Replacement path considered

Next-day readiness target

100% of tomorrow morning’s bookings reviewed before 10:00 PM

Bookings still unresolved should enter an exception queue:

SITTER_REQUIRED

PAYMENT_REQUIRED

CUSTOMER_INFORMATION_REQUIRED

SAFETY_REVIEW_REQUIRED

CANCELLATION_DECISION_REQUIRED

16. Corrected controlled-launch funnel

The original funnel combines marketing, operations and service delivery into one sequence. It is more useful to divide it into three connected funnels.

Funnel A — Acquisition and booking intent

Website visitor

↓

Book CTA clicked

↓

Booking form started

↓

Pet Profile completed

↓

Booking request submitted

Funnel B — Approval and payment

Booking request submitted

↓

Admin review passed

↓

Eligible sitter assigned

↓

Payment started

↓

Payment captured

↓

Booking confirmed

Razorpay states that once a payment is captured, the associated order is marked paid and payment.captured and order.paid webhook events may be generated. PetSaathi should treat the backend-confirmed captured state—not the browser callback—as the payment-completion point.

Funnel C — Fulfilment and retention

Booking confirmed

↓

Service started

↓

Service completed

↓

Report Card delivered

↓

Review submitted

↓

Second paid booking

17. Analytics event design

Recommended events:

### Table 32

| Business step | Analytics event |
| --- | --- |
| Public page viewed | page_view |
| Book CTA clicked | book_cta_click |
| Booking form opened | booking_form_started |
| Pet Profile completed | pet_profile_completed |
| Booking request submitted | booking_requested |
| Payment flow started | begin_checkout |
| Verified payment captured | purchase |
| Service completed | service_completed |
| Report viewed | report_viewed |
| Review submitted | review_submitted |
| Repeat booking paid | Another purchase with unique transaction ID |

Google recommends events including begin_checkout, purchase and refund for relevant commercial journeys.

Important event rule

Do not send:

purchase

when Razorpay Checkout only displays a client-side success response.

Send it after:

Payment signature verified

+ payment captured

+ amount and currency matched

+ internal payment committed

18. Funnel-target definitions

The proposed targets should be treated as internal pilot targets, not universal market benchmarks.

Performance will vary by:

Warm versus cold traffic

Society referrals versus paid ads

Mobile versus desktop

Dog walking versus pet sitting

Available time slots

Service area

Pricing

Segment every rate by acquisition channel.

18.1 Visitor to CTA click

Formula

Unique users clicking Book CTA

÷

Eligible public-page visitors

× 100

Proposed target

5–10%

This can be reasonable for a focused local landing page, but warm society or referral traffic may perform higher and cold advertising traffic may perform lower.

Diagnose low performance

Possible causes:

Weak headline

Unsupported area

Poor trust information

Unclear price

CTA below the fold

Slow mobile page

Wrong traffic source

18.2 CTA click to booking-form start

This step should be measured separately.

Formula

Booking-form starts

÷

Book CTA clicks

× 100

Suggested internal target

60–80%

A large loss here may indicate:

Login shown too early

Broken navigation

Slow form

Unexpected service-area restriction

CTA linked to the wrong page

18.3 Booking-form start to request submission

Formula

Valid booking requests

÷

Eligible booking-form starts

× 100

Target

30–50%

Possible reasons for abandonment:

Pet Profile too long

Customer cannot find a suitable time

Address not supported

Pricing appears too late

Too many required fields

Mobile validation problems

18.4 Booking request to admin approval

Formula

Approved booking requests

÷

Valid submitted requests

× 100

Suggested target

70–90%

Lower approval may indicate:

Advertising outside the service area

Incomplete Pet Profiles

Unsupported service requests

Poor sitter supply

Unsafe or incomplete information

18.5 Admin approval to sitter assignment

Formula

Approved bookings receiving an eligible sitter

÷

Approved bookings

× 100

Target

90%+

This is one of the most important operational metrics.

A low rate usually indicates:

Insufficient sitter supply

Wrong service radius

Time-slot concentration

Verification restrictions

Pet-handling requirements

Sitter declines

18.6 Sitter assignment to payment started

Formula

Customers starting checkout

÷

Bookings with final assigned sitter and price

× 100

Suggested target

70–90%

Possible abandonment causes:

Customer dislikes the assigned sitter

Price changed unexpectedly

Payment link arrived too late

Cancellation terms are unclear

Customer was only exploring

18.7 Payment started to payment completed

Formula

Verified captured payments

÷

Unique payment flows started

× 100

Target

70–85%

Track separately:

Customer abandoned checkout

Bank declined

UPI expired

Provider error

Duplicate attempt

Payment captured but browser closed

Internal reconciliation delay

GA4 defines checkout starts through begin_checkout and completed transactions through purchase, enabling these stages to be compared in reporting.

18.8 Paid booking to completed service

Formula

Completed services

÷

Confirmed paid bookings whose service time has passed

× 100

Target

90%+

Do not include future bookings in the denominator.

Track non-completion reasons separately:

CUSTOMER_CANCELLED

SITTER_CANCELLED

NO_SITTER_REPLACEMENT

CUSTOMER_NO_SHOW

SITTER_NO_SHOW

PET_UNWELL

SAFETY_CANCELLATION

WEATHER

INCIDENT

18.9 Completed service to Report Card

The original funnel omits this critical step.

Formula

Report Cards delivered

÷

Completed services

× 100

Target

95%+

This should be measured before review conversion.

18.10 Completed service to review

Formula

Eligible reviews submitted

÷

Completed services with Report Cards delivered

× 100

Target

50%+

Do not send repeated review reminders to customers with unresolved complaints.

18.11 Completed service to repeat booking

The original target is correct directionally but requires a time window.

Formula

Customers completing a second paid booking

÷

Customers eligible to repeat during the measurement window

× 100

Target

25%+

Recommended repeat window:

Within 30 days of the first completed service

A customer whose first service occurred yesterday should not be treated as a failed repeat customer.

Track separately:

Would book again

Repeat CTA clicked

Second booking requested

Second payment captured

Second service completed

Plan purchased

The strongest retention evidence is a second completed paid service.

19. Recommended final funnel targets

### Table 33

| Funnel step | Internal pilot target |
| --- | --- |
| Visitor → Book CTA | 5–10% |
| Book CTA → Form start | 60–80% |
| Form start → Booking request | 30–50% |
| Request → Admin approval | 70–90% |
| Approved → Sitter assigned | 90%+ |
| Assigned → Payment started | 70–90% |
| Payment started → Captured | 70–85% |
| Confirmed paid → Completed | 90%+ |
| Completed → Report delivered | 95%+ |
| Report delivered → Review | 50%+ |
| Eligible first-time customer → Second completed booking | 25%+ |

20. Daily funnel review

Each evening, compare actual results with targets.

Example

### Table 34

| Step | Actual | Target | Status |
| --- | --- | --- | --- |
| Visitors → CTA | 7% | 5–10% | Green |
| CTA → Form start | 55% | 60–80% | Amber |
| Form start → Submit | 24% | 30–50% | Red |
| Approved → Assignment | 93% | 90%+ | Green |
| Payment start → Captured | 78% | 70–85% | Green |
| Paid → Completed | 94% | 90%+ | Green |
| Completed → Report | 97% | 95%+ | Green |
| Report → Review | 42% | 50%+ | Amber |

Action rule

Do not redesign the whole application.

Fix the largest meaningful drop-off first:

Form start → Submit = Red

Investigate:

Which form step?

Which device?

Which traffic source?

Which validation error?

Which area?

Which service?

GA4 allows funnels to be segmented and broken down so different user groups and abandonment points can be compared.

21. Daily operational dashboard

Live services

Starting within 30 minutes

Active now

Late

Concern reported

Overdue completion

Action queues

Booking review required

Sitter assignment required

Payment pending

Payment reconciliation required

Report overdue

Customer complaint

Incident triage

Daily performance

Visitors

Booking requests

Paid bookings

Completed services

Report Cards

Reviews

Repeat bookings

Reliability

Payment errors

Notification failures

Upload failures

Authorization denials

Critical application errors

Monitoring should focus on actionable signals rather than creating alerts for every minor event. Google SRE’s monitoring guidance emphasises metrics and alerts that reveal service health and require meaningful action.

22. Daily close criteria

The operations day should not be considered closed until:

Every due service has a final status

Every active concern has an owner

Every completed service has a Report Card or documented exception

Payment mismatches are queued for review

Customer complaints are acknowledged

Tomorrow’s morning services are reviewed

Critical system errors are checked

Daily metrics are saved

End-of-day status

GREEN

All critical work closed

AMBER

Non-critical items remain with owners and deadlines

RED

Uncontrolled service, payment, safety or security problem

A red status should pause new booking acquisition until the immediate risk is controlled.

Final operating principle

PetSaathi’s daily schedule must connect operations and analytics. The team should not merely monitor bookings during the day and calculate marketing numbers at night. Every funnel drop-off must lead to an operational question, and every operational failure must appear in the launch metrics.

Simple explanation for professor

“PetSaathi’s daily controlled-launch schedule begins with a readiness check before the first service. The team confirms that the booking is paid, the sitter is assigned, the customer and sitter have received instructions and emergency support is available.

From 7:00 to 9:00 AM, the operations team monitors morning dog walks. It checks whether sitters arrive and start services on time. After the walks, the team reviews every Pet Report Card and makes sure it is delivered to the customer.

The team then follows up with customers, reviews sitter problems and contacts new leads. During the afternoon, it reviews new booking requests, assigns eligible sitters and conducts controlled marketing and society-partner follow-ups.

Before evening services begin, the team checks sitter acknowledgements, payments, addresses and Pet Profiles. Evening bookings are monitored in the same way as morning services. At the end of the day, the team verifies Report Cards, reviews, incidents, payments and next-day readiness.

The original funnel must be corrected because PetSaathi uses admin-controlled matching. A customer submits a booking request, the admin approves it, an eligible sitter is assigned and only then does the customer begin payment. The booking becomes confirmed after the backend verifies that payment was captured.

The complete funnel therefore has three parts. The acquisition funnel measures visitors, CTA clicks, form starts and submitted booking requests. The operations funnel measures admin approval, sitter assignment, payment and booking confirmation. The fulfilment funnel measures service completion, Report Card delivery, reviews and repeat bookings.

Each metric must have a clear formula. For example, payment success is captured payments divided by payment starts. Service completion is completed services divided by confirmed services whose scheduled time has passed. Repeat rate is customers completing a second paid booking divided by customers who have had enough time to repeat.

The recommended targets include ninety percent or higher sitter assignment, seventy to eighty-five percent payment success, ninety percent service completion, ninety-five percent Report Card delivery, fifty percent review submission and twenty-five percent repeat bookings among eligible customers.

Every evening, the team compares actual results with these targets and fixes the largest meaningful drop-off. This makes PetSaathi’s daily launch operation measurable, safe and ready for controlled expansion.”

PetSaathi Phase 5 — Marketing and Customer Support Plan

Hyperlocal acquisition, trust-building and launch operations 📣🐾

Executive decision

PetSaathi’s launch marketing should concentrate on one service area, one clear introductory offer and one measurable booking journey.

The recommended acquisition model is:

Instagram and Google discovery

↓

WhatsApp or local landing page

↓

Lead qualification

↓

Pet Profile completion

↓

Admin-reviewed booking request

↓

Eligible sitter assignment

↓

Verified payment

↓

Completed service

↓

Pet Report Card

↓

Review and repeat booking

The marketing promise must match the actual launch scope. Do not advertise unrestricted boarding, continuous GPS tracking, 24-hour veterinary treatment or guaranteed sitter availability unless those capabilities are genuinely operational.

1. Instagram local-launch strategy

Instagram should achieve three things:

Explain what PetSaathi does.

Make verification and service proof visible.

Move qualified local users into a booking or WhatsApp conversation.

Meta supports Reels advertising and ads that open a WhatsApp conversation directly. Its creative guidance recommends mobile-friendly vertical video, a fast opening hook and concise videos—often around 6–15 seconds for ads.

Recommended content pillars

### Table 35

| Pillar | Purpose | Share of content |
| --- | --- | --- |
| Trust and safety | Reduce fear | 30% |
| Service proof | Show real delivery | 25% |
| Pet-parent problems | Build relevance | 20% |
| Customer evidence | Build social proof | 15% |
| Offers and booking | Drive conversion | 10% |

Avoid turning every post into an advertisement. Most content should help users understand how the service works.

1.1 Sitter introduction Reels

Purpose

Show the human caregiver behind the service.

Recommended structure

0–2 seconds: Strong hook

2–7 seconds: Sitter introduction

7–12 seconds: Verification/service capability

12–15 seconds: Local CTA

Example script

“Meet Riya, a PetSaathi-approved dog walker serving Bopal. She is approved for dog walking and medium-to-large dogs. Every service includes structured updates and a Pet Report Card.”

Show

Display name

Approved services

Experience

Languages

Area served

Relevant verification badges

Pet-handling permission

Clear CTA

Do not show

Government-ID images

Police verification documents

Home address

Personal phone number

Bank details

Unsupported badges

Use precise language such as:

Identity verified

Training completed

Large-dog handling approved

Avoid:

100% safe

Completely risk-free

Best sitter in Ahmedabad

Indian consumer-protection guidance requires advertisements and endorsements to be non-misleading. Paid or otherwise material endorsements should also be transparently disclosed.

1.2 Dog-walk clips

Purpose

Provide evidence of the service experience.

Recommended clips:

Sitter preparing the leash

Safe handover

Short walking scene

Water update

Report Card preview

Customer-approved pet moment

Privacy rules

Obtain the pet owner’s consent.

Avoid house numbers, access codes and exact building entrances.

Avoid identifiable bystanders where possible.

Do not disclose the live route publicly.

Do not show private customer instructions.

Do not use service media for marketing unless marketing consent is separate from service consent.

Suggested caption

“Bruno’s evening walk included a structured handover, water update and Pet Report Card. Bopal pilot slots are limited.”

1.3 Pet Report Card demonstration

Purpose

Differentiate PetSaathi from an informal walker arrangement.

The demo may show:

Start and end time

Walk duration

Water update

Pee/poop update

Mood observation

Leash behaviour

Photo

Sitter note

Concern status

Use synthetic information or a fully redacted customer example.

CTA

“Know how your pet’s service went—even when you could not be there.”

Do not expose actual medical notes, phone numbers, addresses or emergency contacts.

1.4 Customer testimonials

Best format

A genuine customer explains:

What problem they had

Why they hesitated

What happened during the first booking

Whether the Report Card helped

Why they booked again

Example

“I was nervous about hiring a new walker, but I received a photo update and a proper report after the walk. I booked the same sitter again.”

Rules

Use only genuine experiences.

Preserve negative or qualified feedback.

Obtain written media permission.

Disclose any free service, discount or other benefit connected to the testimonial.

Never invent or materially rewrite a testimonial.

CCPA enforcement has included action against false or misleading testimonials.

Google-review warning

PetSaathi may request a genuine Google review, but it must not give a discount, free service or referral credit in exchange for posting, changing or removing a review. Google prohibits incentivised reviews and selective solicitation of only positive reviews.

The ₹100 referral credit must be connected to a completed referred booking, not to leaving a review.

1.5 “Before and after walk” content

Use this as an emotional observation—not as a behavioural or medical diagnosis.

Recommended wording:

Before the walk: Ready to go

After the walk: Resting after activity

Avoid:

Anxiety cured

Aggression reduced

Guaranteed happier pet

A short video cannot establish a clinical or behavioural outcome.

1.6 “Busy pet parent?” Reel

Hook

“Back-to-back meetings and your dog still needs a walk?”

Sequence

Problem

→ verified local walker

→ service update

→ Report Card

→ trial CTA

CTA

“Book a ₹99 first 30-minute walk in Bopal. Normal repeat price: ₹149.”

The ad and landing page should display the area, duration, restrictions and normal repeat price clearly to avoid misleading price claims. Indian consumer-protection authorities actively regulate false and misleading advertising.

1.7 “Travel without worry” boarding post

Do not use this content until boarding beta is operational.

Correct wording:

“Invite-only boarding beta with property review, meet-and-greet, daily updates and emergency-contact planning.”

Avoid:

“Travel completely worry-free—we guarantee your pet’s safety.”

Boarding posts should clearly state:

Invite-only beta

Supported pet type

Maximum stay

Meet-and-greet requirement

Compatibility review

Vaccination-policy requirement

Pricing

Availability limitations

1.8 Safety-checklist posts

Possible carousel:

How PetSaathi prepares a first booking

1. Customer completes Pet Profile

2. Admin reviews care and handling needs

3. Eligible sitter is selected

4. Customer completes verified payment

5. Sitter follows structured instructions

6. Customer receives a Pet Report Card

This is more credible than a vague “trusted and safe” statement.

2. Recommended Instagram publishing rhythm

Weekly organic schedule

### Table 36

| Day | Content |
| --- | --- |
| Monday | Busy pet-parent problem Reel |
| Tuesday | Sitter introduction |
| Wednesday | Safety or Pet Profile carousel |
| Thursday | Real service clip |
| Friday | Pet Report Card demonstration |
| Saturday | Customer testimonial |
| Sunday | Local availability and trial offer |

Stories

Use Stories for:

Today’s available slots

Polls about preferred walk times

FAQ answers

Behind-the-scenes operations

New sitter introduction

Society trial announcement

Customer-approved service updates

Paid creative tests

Test three clear concepts:

Trust creative

₹99 trial creative

Same-sitter repeat creative

Measure each from ad click through completed paid booking—not only likes or WhatsApp messages.

3. Society-launch strategy

The society approach should be positioned as a controlled resident service, not an unrestricted sales campaign.

Society proposition

PetSaathi is launching verified pet-care support for selected residents, including dog walking, in-home pet sitting and basic emergency-care coordination.

Resident benefits

Approved sitters for supported services

Photo/video updates

Pet Report Card

Online payment

Admin-controlled matching

Human launch support

Local veterinary escalation contacts

Limited trial pricing

Use “emergency-care coordination” rather than implying that PetSaathi itself provides veterinary treatment.

3.1 Society partnership levels

Level 1 — Communication partner

The society permits:

Digital flyer

Notice-board poster

Pet-group announcement

Level 2 — Trial partner

The society permits:

Resident-specific campaign code

Registration desk

Scheduled trial slots

Pet-parent awareness session

Level 3 — Preferred cluster

Activate only after evidence of:

Several repeat customers

Reliable security entry

Nearby sitter capacity

Low complaint rate

Manageable support demand

3.2 Society pitch deck

Keep it to six or seven slides:

Pet-parent problem

PetSaathi service model

Available services and areas

Verification and booking controls

Sample Report Card

Resident trial offer

Contact and next step

Request one simple next action

Share one flyer

Allow one poster

Introduce resident pet group

Approve one trial day

Do not begin by requesting a long-term exclusive agreement.

3.3 Society trial workflow

Society approves campaign

↓

Unique society code created

↓

Residents register

↓

Pet Profiles completed

↓

Bookings reviewed individually

↓

Private one-to-one services scheduled

↓

Reports delivered

↓

Repeat demand measured

A society campaign may group the schedule geographically, but it should not automatically become a group-dog-walking service.

3.4 Society tracking

Track:

Society contacted

Meeting completed

Trial approved

Resident leads

Qualified leads

Paid bookings

Completed bookings

Repeat bookings

Average sitter travel

Complaints

Contribution

The best society is not the one producing the most WhatsApp enquiries. It is the one producing dense, completed and repeatable bookings.

4. Veterinary clinic and pet-shop referrals

These channels can produce strong trust because they already interact with pet parents. However, PetSaathi must not imply a clinical recommendation unless the clinic has genuinely made one.

Recommended partner models

### Table 37

| Partner | Model |
| --- | --- |
| Vet clinic | Fixed referral commission after completed booking |
| Pet shop | QR/referral card and completed-booking commission |
| Groomer | Cross-referral pilot |
| Trainer | Specialist sitter or handling partnership after verification |

4.1 Recommended commission

Fixed model

₹100–₹150 per completed first booking

Test ₹200–₹300 only where customer value and contribution margin support it.

Commission eligibility

New customer

→ verified payment

→ service completed

→ no duplicate or fraud issue

→ commission eligible

Do not pay commission for:

Poster scans

Unqualified enquiries

Cancelled services

Failed payments

Duplicate customers

Refunded first bookings

4.2 Partner operating rules

Every partner should receive:

Written referral terms

Unique code or QR link

Description of active services

Correct area and prices

Approved marketing language

Commission calculation

Payment schedule

Privacy rules

Contact person

Prohibited partner claims

Vet-approved sitter

Medically guaranteed service

Emergency treatment included

100% safe

unless those exact statements are accurate and formally authorised.

If a partner or influencer is materially compensated for promotion, the relationship should be disclosed clearly rather than hidden.

5. Google search-intent strategy

Users searching for “dog walker in Bopal” or “pet sitter near me” demonstrate clearer service intent than a general social-media viewer.

PetSaathi should combine:

Google Business Profile

Genuine locality landing pages

Search advertising

Customer reviews from real experiences

Consistent business information

5.1 Google Business Profile

PetSaathi is likely to operate as a service-area business if caregivers visit customers and no staffed customer-facing storefront exists.

Google allows service-area businesses to specify cities, postal codes or other service areas. It advises using accurate service areas and generally allows up to 20 areas. A service-area business should use one legitimate profile rather than creating a separate profile for every locality.

Configure

Business name

Correct category

Support phone

Website

Operating hours

Real service areas

Service descriptions

Trial and normal prices where appropriate

Genuine photographs

Booking link

Google Business Profile also allows service businesses to list service names, descriptions and prices.

5.2 Local landing pages

Recommended pages:

/city/ahmedabad/dog-walking-bopal

/city/ahmedabad/pet-sitting-satellite

/city/ahmedabad/pet-boarding-south-bopal

Publish a page only when the service is genuinely available or clearly described as a waitlist/beta.

Required page structure

Hero

Verified dog walking in Bopal

Service summary

Duration

Trial price

Normal price

Area

Availability

Trust section

Sitter approval

Admin-controlled matching

Secure payment

Service updates

Report Card

Support

Process

Create Pet Profile

→ Request service

→ Sitter assigned

→ Pay

→ Receive service and report

Local information

Supported societies or postal areas

Available time slots

Local service limitations

Local emergency-clinic coordination

Local FAQs

CTA

Request a Bopal dog walk

5.3 Avoid doorway pages

Do not create 100 nearly identical pages by replacing only the neighbourhood name.

Google considers pages created primarily to rank for similar location searches without distinctive user value to be doorway or spam-like behaviour. Content should be created for users and accurately reflect real service availability.

Each local page should have genuinely different:

Availability

Pricing

Sitter coverage

Societies served

Operating hours

FAQs

Partner information

Local limitations

5.4 Structured data

Add:

Organization on the main site

LocalBusiness only where PetSaathi has an accurate local operating presence

BreadcrumbList on city and service pages

Google says structured data can help it understand business details, but the structured information must match visible page content.

5.5 Search-ad groups

Dog walking

dog walker Bopal

dog walking Bopal

dog walker near me

verified dog walker Ahmedabad

Pet sitting

pet sitter Satellite

pet sitting Ahmedabad

in-home pet sitter near me

Boarding

Run only when the controlled boarding beta has real availability.

Use negative keywords for:

jobs

salary

course

training

free

adoption

rescue

6. Customer-support architecture

During the controlled launch, support is part of the product—not an afterthought.

Recommended channels

### Table 38

| Channel | Use |
| --- | --- |
| WhatsApp | Main booking and service communication |
| Phone | Active-service emergencies |
| Email | Formal complaints, policies and documentation |
| In-app support | Later phase |
| Admin dashboard | Internal case ownership and history |

Meta supports ads and business experiences that move customers directly into WhatsApp conversations, making WhatsApp suitable for assisted onboarding during a controlled pilot.

7. Support priority levels

Priority 0 — Immediate safety emergency

Examples:

Pet missing

Serious injury

Bite requiring urgent help

Breathing difficulty

Sitter/customer immediate danger

Target

Acknowledgement: Immediate

Human escalation: Within 2 minutes

Use phone escalation, not only WhatsApp.

Priority 1 — Active-service issue

Examples:

Sitter has not arrived

Customer cannot contact sitter

Access problem

Pet behaviour concern

Service cannot continue

Target

Acknowledgement: Under 5 minutes

Owner assigned: Under 5 minutes

This is an internal launch SLA. It requires a staffed operations owner whenever a service is active.

Priority 2 — Upcoming booking question

Examples:

Time change

Address correction

Pet Profile update

Sitter information

Booking instructions

Target

Acknowledgement: Under 30 minutes during operating hours

Priority 3 — Payment issue

Examples:

Money deducted but booking not confirmed

Checkout failed

Duplicate payment concern

Payment status pending

Target

Acknowledgement: Under 15 minutes

Initial investigation: Under 1 hour

Do not tell the customer to pay again until the original attempt has been reconciled.

Priority 4 — Cancellation or refund

Target

Acknowledgement: Same operating day

Eligibility decision: Same day where evidence is complete

Provider processing: Communicated separately

Refund approval and money reaching the customer’s bank are different events.

Priority 5 — General enquiry

Target

Same operating day

or next business day if received after hours

8. Support-case workflow

Customer message received

↓

Identity and booking verified

↓

Category and priority selected

↓

Case owner assigned

↓

Immediate action taken

↓

Customer updated

↓

Resolution recorded

↓

Follow-up completed

↓

Case closed

Case statuses

NEW

TRIAGED

ASSIGNED

IN_PROGRESS

WAITING_FOR_CUSTOMER

WAITING_FOR_SITTER

WAITING_FOR_PROVIDER

RESOLVED

CLOSED

REOPENED

Required case fields

Case ID

Customer

Booking

Category

Priority

Channel

Description

Assigned owner

First-response time

Actions

Resolution

Refund/incident linkage

Closed time

Do not manage critical launch support exclusively through unstructured personal WhatsApp chats.

9. Support templates

Booking received

Your PetSaathi request has been received. Our team is reviewing sitter availability and your pet’s care requirements. The booking is not confirmed yet.

Sitter assigned

An eligible sitter has been assigned. Please review the booking details and complete payment to confirm the service.

Payment under verification

We are checking your payment. Please do not make another payment until we update you.

Sitter delayed

Your sitter is delayed, and our operations team is checking the situation. We will update you within five minutes.

Report delivered

Bruno’s Pet Report Card is ready. You can view the service update from your booking page.

Refund processing

Your refund has been approved and submitted for processing. Bank or payment-provider completion may take additional time.

10. Support privacy rules

Support staff should:

Verify the customer before discussing a booking.

Share only information needed for the case.

Avoid copying full medical information into WhatsApp.

Avoid sending identity documents through ordinary group chats.

Never ask for CVV, OTP, PIN or account password.

Keep exact addresses limited to authorised service conversations.

Move serious incidents into the restricted incident workflow.

11. Marketing and support dashboard

Marketing metrics

Content reach

Profile visits

WhatsApp conversations

Qualified leads

Pet Profiles

Booking requests

Paid customers

CAC

Completed services

Repeat customers

Society metrics

Societies contacted

Trials approved

Resident leads

Paid bookings

Repeat bookings

Bookings per society

Partner metrics

Partner leads

Completed first bookings

Commission owed

Repeat rate

Refund rate

Search metrics

Local page impressions

Search clicks

Booking requests

Paid bookings

Google Business actions

Support metrics

Cases by category

First-response median

First-response P90

Resolution time

Reopened cases

Active-service issues

Refund cases

Incidents

Customer satisfaction

12. Approved launch priorities

Build and run now

Instagram trust content

Local Instagram advertisements

Society partnerships

Vet and pet-shop referrals

Google Business Profile

Genuine Bopal/Satellite landing pages

WhatsApp-assisted onboarding

Phone emergency escalation

Formal support-case records

Run carefully

Customer testimonials

Before/after content

Referral commissions

Boarding promotion

Trainer partnerships

LocalBusiness structured data

Avoid

Fake reviews

Paid positive reviews

Generic copied city pages

Unsupported safety claims

Unclear referral relationships

Public customer addresses

Advertising unavailable services

Guaranteed veterinary outcomes

Final operating principle

PetSaathi marketing should make trust visible, but support must prove that trust after the customer books. Every marketing promise must correspond to a real operational control, and every acquisition channel must be measured through completed services and repeat bookings.

Simple explanation for professor

“PetSaathi’s launch marketing will use four main channels: Instagram, apartment societies, veterinary and pet-shop referrals, and Google Search.

Instagram will be used to introduce verified sitters, show service clips, explain the Pet Report Card, share genuine testimonials and present the ₹99 trial walk. Content will be short, local and mobile-friendly. Customer and pet media will be used only with permission, and private details such as addresses and medical information will not be shown.

For apartment societies, PetSaathi will offer a controlled resident programme. The society may allow a digital flyer, poster, resident-group message or trial-registration session. Residents will receive verified sitter assignment, private updates, a Pet Report Card and launch pricing. Society campaigns will create several private bookings in one locality rather than unsafe group walks involving unfamiliar dogs.

Veterinary clinics and pet shops will receive unique referral codes. Commission will become payable only when a new customer completes a genuine paid service. PetSaathi will not falsely claim that a veterinarian medically guarantees or endorses every sitter.

For Google Search, PetSaathi will create genuine locality pages such as ‘Dog Walker in Bopal’ and ‘Pet Sitter in Satellite.’ Each page will contain real service availability, pricing, sitter coverage, booking steps and local information. PetSaathi will not generate many copied locality pages purely to manipulate search rankings.

WhatsApp will be the primary customer-support channel, while phone support will be used for active-service emergencies and email for formal complaints and documentation. Active-service issues should receive an acknowledgement within five minutes, booking questions within thirty minutes, payment issues within one hour and refund questions on the same operating day.

Every support request will receive a category, priority, owner and case history. Marketing performance will be measured using qualified leads, paid bookings, completed services, customer-acquisition cost and repeat bookings. The objective is not merely to receive views or messages; it is to acquire customers who complete a safe service and book again.”

PetSaathi Phase 5 — Launch Quality, Sitter Capacity and Unit Economics 🛡️🐾

Executive decision

Your launch rules are strong, but they need measurable conditions and clear exception flows.

The approved launch principle is:

Do not accept a booking unless PetSaathi has the right sitter, service capacity, verified payment, adequate service evidence and a workable emergency plan.

The complete quality gate should run as follows:

Booking request

↓

Pet and service-risk review

↓

Area and travel-time validation

↓

Eligible sitter capacity check

↓

Provisional sitter acceptance

↓

Verified payment

↓

Booking confirmation

↓

Service evidence collected

↓

Report Card delivered

↓

Quality and financial review

1. Rule 1 — Do not accept pets beyond current capability

Correct interpretation

A Red assessment should mean manual specialist review, not “bad pet” or automatic permanent rejection.

The decision belongs to:

Pet

+ requested service

+ environment

+ current health

+ sitter capability

+ required controls

A pet may be:

Home sitting: Yellow

Dog walking: Red review

Shared boarding: Declined

AVMA guidance states that bite risk should be evaluated using the individual animal’s history and behaviour rather than breed alone. AAHA also recommends treating behavioural assessment as individual and continuing over time, especially where aggression or other concerning changes are reported.

Correct decision flow

Red service assessment

↓

Is a suitably qualified sitter available?

↓

Are required controls possible?

↓

Is current health information acceptable?

↓

Can PetSaathi supervise the booking safely?

Possible outcomes:

ACCEPT_WITH_CONTROLS

MANUAL_SPECIALIST_REVIEW

WAITLIST

ALTERNATIVE_SERVICE

DECLINE

Accept with controls only when

Examples:

Specialist or highly experienced sitter available

Meet-and-greet completed

Owner demonstrates equipment

Individual service rather than shared boarding

Safe muzzle/harness plan already professionally established

Veterinary or behaviour-professional information supplied

Emergency procedure documented

Operations team can actively monitor the booking

Waitlist when

Suitable sitter exists but is unavailable

Specialist review is still pending

Required information is incomplete

Safer time slot or service type may become available

Decline when

No qualified sitter exists

Customer refuses to disclose bite or incident history

Current serious illness is reported

Required safety controls cannot be implemented

Care requirements exceed approved sitter capability

The requested environment is unsuitable

PetSaathi cannot provide a safe operational response

Customer-facing message

Avoid:

Your pet is unsafe and rejected.

Use:

This service requires handling experience or safety controls that are not currently available in your area. We can place the request under review, suggest another service, or contact you when a suitable caregiver becomes available.

2. Rule 2 — Do not accept operationally distant bookings

A booking can be technically inside a city but still be operationally impractical.

Do not match using city name alone.

Use:

Area

Pincode

Coordinates

Expected travel time

Time of day

Sitter’s previous booking

Next booking location

Service duration

Transport method

Recommended pilot boundaries

For a hyperlocal dog-walking launch:

Preferred sitter radius: 3–5 km

Preferred travel time: 15–20 minutes

Maximum exceptional travel: defined by operations

Travel time should take priority over straight-line distance because congestion and society-entry delays may make a short physical distance operationally slow.

These are internal pilot recommendations and should be adjusted using real Ahmedabad data.

Booking decision flow

Customer submits address

↓

System validates active service area

↓

Eligible sitter travel times calculated

↓

Travel and schedule buffers checked

Possible results:

Accept

A sitter can reach the booking reliably without risking another assignment.

Offer another time

A sitter is nearby but unavailable at the requested hour.

Waitlist

The area is strategically supported, but no capacity is currently available.

Decline

The address is outside the active service boundary and there is no reliable sitter coverage.

Customer-facing message

PetSaathi does not currently have a suitable caregiver close enough to serve this booking reliably. We can offer another time, add the request to the area waitlist, or notify you when local coverage becomes available.

Why this matters

Accepting distant bookings causes:

Late sitter arrivals

Higher cancellations

Lower effective sitter earnings

Poor replacement coverage

Greater support workload

Unreliable repeat scheduling

Capacity planning and overload control are fundamental to service reliability; accepting work beyond practical capacity degrades the quality of the whole operation.

3. Rule 3 — Do not confirm unpaid bookings

Important sequence correction

PetSaathi should not normally collect money before it knows that the request is serviceable.

The recommended flow is:

Booking request submitted

↓

Admin review

↓

Eligible sitter accepts provisionally

↓

Final price locked

↓

Payment requested

↓

Payment captured and verified

↓

Booking confirmed

The sitter assignment can be held provisionally for a short payment window, but the booking remains unconfirmed.

Recommended payment states

NOT_REQUIRED

PAYMENT_PENDING

PAYMENT_PROCESSING

CAPTURED

FAILED

EXPIRED

REFUNDED

PARTIALLY_REFUNDED

Confirmation requirements

Active primary sitter exists

Final price is locked

Razorpay order matches booking

Signature verified on backend

Payment status = CAPTURED

Amount matches

Currency matches

No unresolved safety block

Only then:

PAYMENT_PENDING → CONFIRMED

Razorpay requires server-side verification of the Checkout signature. It also documents that a captured payment marks the order paid and generates events such as payment.captured and order.paid; webhook processing should validate the raw body and handle duplicate or out-of-order events safely.

Payment expiry

Example:

Payment window: 15–30 minutes

If payment is not completed:

PAYMENT_PENDING

↓

PAYMENT_EXPIRED

↓

Provisional sitter reservation released

The exact expiry should depend on how close the service is.

Controlled exceptions

An authorised admin may create an exception for:

Internal test booking

Compensation booking

Approved zero-value promotion

Emergency case where action cannot reasonably wait

Service recovery after a previous failure

Every exception requires:

Admin permission

Reason code

Audit record

Responsible payer

Customer communication

4. Rule 4 — Do not overload high-performing sitters

High ratings do not mean unlimited capacity.

Overloading top sitters can produce:

Late arrivals

Rushed handovers

Weak Report Cards

Missed updates

Sitter fatigue

Cancellations

Poor pet handling

Loss of same-sitter continuity

Required capacity fields

Each sitter profile should store:

Maximum bookings per day

Maximum consecutive bookings

Required buffer between services

Maximum walking minutes per shift

Supported time windows

Travel method

Service radius

Pet-size permissions

Risk permissions

Reserved backup status

Recommended initial controls

These should be tested rather than treated as universal rules:

Maximum consecutive walks: 2–3

Minimum operational buffer: 10–20 minutes

Target capacity utilisation: 70–80%

Reserved capacity: 20–30%

The remaining capacity protects against:

Travel delays

Customer handover delays

Replacement needs

Weather disruption

Service concerns

Urgent repeat-customer requests

Google’s operational guidance describes overload as harmful to both service performance and the people operating the system; capacity should be validated against the load the team can actually deliver.

Capacity status

AVAILABLE

LIMITED

FULL

BACKUP_ONLY

TEMPORARILY_UNAVAILABLE

SUSPENDED

A top sitter marked FULL should not receive additional offers simply because a high-value customer requests them.

Same-sitter continuity

PetSaathi may show:

Same sitter preferred, subject to availability.

Do not promise:

The same sitter is guaranteed for every booking.

5. Rule 5 — Every service requires verifiable proof

Service proof protects:

The customer

The sitter

PetSaathi operations

Payment and complaint review

Incident investigation

Minimum proof package

1. Arrival or check-in update

Record:

Arrival timestamp

Sitter identity

Booking ID

Optional location check

Handover status

A timestamped application check-in is preferable to relying only on a WhatsApp message.

2. Photo or video update

Recommended:

At least one private photo

or

one short private video

A documented exception may be allowed when:

Media would create a safety problem

The pet is distressed by the camera

Customer has declined non-essential media

An urgent incident prevents routine evidence

3. Structured Report Card

Must contain service-specific fields.

4. Completion confirmation

Record:

Actual end time

Pet handover or secured status

Sitter checkout

Concern status

Dog-walking proof

Arrival/check-in

Start time

One photo/video

Duration

Water update

Toilet update

Mood

Leash behaviour

End time

Completion confirmation

Pet-sitting proof

Arrival/check-in

Start condition

Food/water update

One or more media updates

Care tasks completed

Pet mood

End condition

Completion confirmation

Boarding proof

Check-in and handover

Daily care updates

Food and water

Medication where authorised

Pet behaviour

Sleeping/rest update

Daily media

Incident/concern status

Final checkout

Proof security

Service media must:

Be uploaded by an authorised assigned sitter

Use permitted file types

Have size limits

Remain in private storage

Be accessible only to authorised users

Use short-lived links

Be retained according to policy

OWASP recommends authentication and authorization for uploads, size restrictions and least-privilege file access.

Service proof must not automatically become marketing content. Public use of customer-owned pet photos or videos requires separate permission.

6. Launch sitter roster for two to three areas

Your proposed roster is a useful starting range, but headcount is less important than active time-slot capacity.

Recommended roster

### Table 39

| Sitter function | Suggested launch roster | Operational interpretation |
| --- | --- | --- |
| Dog walkers | 10–15 | Approximately 3–5 active per area |
| In-home pet sitters | 5–10 | Approximately 2–3 per area |
| Boarding hosts | 3–5 | Invite-only, separately property-approved |
| Backup capacity | 3–5 | Shared reserve; do not double-count |
| Emergency contacts | 2–3 | Verified veterinary/emergency resources |

Critical correction: backup sitters

“Backup sitter” should usually represent reserved capacity within the approved sitter pool, not a person who never receives ordinary work.

Example:

15 approved dog walkers

12 available for normal assignments

3 held partially in reserve

Do not report:

15 walkers + 3 backups = 18

when the backup sitters are already included among the 15.

Per-area minimum

Before activating an area, aim for:

At least 3 active dog walkers

At least 1–2 in-home sitters

At least 1 cross-area backup option

Verified emergency contacts

Operations coverage

One sitter is not real area coverage.

If that sitter becomes sick, cancels or is unsuitable for the pet, PetSaathi has no service resilience.

7. Capacity-based roster calculation

Use this formula rather than choosing headcount arbitrarily:

Required active sitters =

Peak confirmed service demand

÷

Safe services per sitter during peak period

÷

Target utilisation

Then add reserve capacity.

Example logic:

Peak demand: 12 walks

Safe peak capacity per sitter: 2 walks

Target utilisation: 80%

PetSaathi would need roughly eight actively available walkers, plus backup capacity.

Do not count a sitter as active capacity when

Verification has expired

Availability is not confirmed

Sitter is already committed elsewhere

Relevant service permission is absent

The sitter is outside the area

The sitter is marked backup-only

The sitter has an active restriction

8. Boarding host requirements

Three to five boarding hosts are sufficient only for an invite-only beta.

Each host requires separate approval for:

Identity

Property

Resident animals

Maximum capacity

Secure doors/windows

Sleeping arrangement

Feeding separation

Escape controls

Emergency transport

Society/landlord permission

Overnight caregiver presence

A host approved for one compatible dog is not automatically approved for:

Multiple guest pets

Cats

Reactive pets

Medication-heavy care

Long stays

Boarding host availability should be measured in approved pet-nights, not simply number of hosts.

9. Emergency support contacts

Maintain at least:

One regular local veterinary clinic

One emergency or extended-hours clinic

One alternative contact

Store:

Clinic name

Phone

Address

Operating hours

Map location

Last verified date

Areas served

Emergency capability

AVMA guidance recommends maintaining veterinarian, emergency hospital and authorised-care information before urgent situations occur.

These contacts do not replace a named PetSaathi safety owner during active services.

10. Daily sitter performance tracking

On-time rate

Formula

Services started inside approved arrival window

÷

Services due

× 100

Define the window, for example:

Up to 10 minutes early

and no more than 5 minutes late

Target

Minimum: 90%

Preferred: 95%+

Offer acceptance rate

Formula

Valid offers accepted

÷

Valid offers received

× 100

Target

80%+

This target is appropriate only when offers are well matched.

Do not punish a sitter for rejecting:

A pet beyond their permissions

An unreasonable travel distance

A scheduling conflict

An unsafe or incomplete request

A low acceptance rate may indicate poor admin matching rather than poor sitter commitment.

Cancellation rate

Formula

Accepted or confirmed bookings cancelled by sitter

÷

Accepted or confirmed sitter bookings

× 100

Target

Below 5%

Preferred: below 3%

Track reasons separately:

ILLNESS

TRANSPORT

SCHEDULE_CONFLICT

PET_INFORMATION_CONCERN

PERSONAL_EMERGENCY

SYSTEM_ERROR

OTHER

No-show rate

Track separately from cancellation.

Sitter no-show bookings

÷

Confirmed sitter bookings due

× 100

Recommended:

Target: 0–2%

Hard maximum: below 5%

A sitter who cancels responsibly in advance is operationally different from a no-show.

Report submission rate

Formula

Reports submitted within required window

÷

Services completed

× 100

Target

95%+

Desired standard: 100%

Customer rating

Target

4.5+/5

Also show:

Number of reviews

Rating distribution

Service count

Complaint history

A 5.0 score from two bookings should not outrank a 4.8 score from forty successful services automatically.

Repeat requests

Track:

Same-sitter preference

Second booking requested

Second booking paid

Second service completed

“Increasing” should be measured as a weekly trend or cohort percentage.

11. Recommended sitter dashboard scorecard

### Table 40

| Metric | Minimum target | Preferred |
| --- | --- | --- |
| On-time start | 90% | 95%+ |
| Offer acceptance | 80% | Based on targeted offers |
| Sitter cancellations | <5% | <3% |
| No-show | <5% | 0–2% |
| Report submission | 95% | 100% |
| Customer rating | 4.5+ | With meaningful sample |
| Same-sitter requests | Increasing | Cohort tracked |
| Unresolved serious incidents | 0 | 0 |

12. Unit economics definitions

Do not confuse gross margin, contribution margin and profit.

Platform gross margin

Customer payment

− sitter or host payout

= platform gross margin amount

Gross margin percentage:

Platform gross margin

÷ customer payment

× 100

Contribution

Platform gross margin

− payment-processing cost

− direct support cost

− promotional subsidy

− direct storage/media cost

− referral commission

− variable incident/refund reserve

= contribution

Contribution is not final company profit because it excludes fixed costs such as:

Salaries

Office costs

Development

Legal costs

General marketing

Insurance

Administration

13. Dog-walk example

### Table 41

| Item | Amount |
| --- | --- |
| Customer payment | ₹149 |
| Sitter payout | ₹100 |
| Platform gross margin | ₹49 |
| Direct support/payment cost | ₹10 |
| Contribution | ₹39 |

Result

Gross margin = 32.9%

Contribution margin = 26.2%

This fits the proposed dog-walking gross-margin target of 25–35%.

What remains missing

The ₹10 direct cost must realistically include or separate:

Payment fee

Customer support

Media/storage

Notifications

Referral commission

Promotion

Refund reserve

If ₹10 excludes these costs, the real contribution will be lower.

14. Ten-walk-pack example

### Table 42

| Item | Amount |
| --- | --- |
| Customer payment | ₹1,499 |
| Sitter payout | ₹1,000 |
| Platform gross margin | ₹499 |
| Direct support/payment cost | ₹80–₹120 |
| Contribution | ₹379–₹419 |

Result

Gross margin = 33.3%

Contribution margin = approximately 25.3–28.0%

Important pricing correction

Ten individual walks at ₹149 cost:

10 × ₹149 = ₹1,490

Therefore, a ₹1,499 “pack” costs ₹9 more than booking ten individual walks.

It is not a discount plan.

You have two options:

Option A — Reserved convenience plan

Keep ₹1,499, but include genuine additional value:

Preferred recurring time

Same-sitter priority

Simplified repeat booking

Longer validity

Priority rescheduling

Do not market it as “save money.”

Option B — Discounted starter pack

Use a lower price, such as:

₹1,299–₹1,399

But recalculate contribution carefully. A lower package price can make the plan less financially attractive unless recurring scheduling lowers travel, support or acquisition costs.

Service-credit rule

Track economics per completed walk.

Do not treat the full pack as operationally completed revenue before services have been delivered. Unused credits remain outstanding service obligations and may be subject to expiry or refund rules.

15. Boarding-beta example

### Table 43

| Item | Amount |
| --- | --- |
| Customer payment | ₹999 |
| Host payout | ₹750 |
| Platform gross margin | ₹249 |
| Support/risk cost | ₹50–₹100 |
| Contribution | ₹149–₹199 |

Result

Gross margin = 24.9%

Contribution margin = approximately 14.9–19.9%

The gross margin is within the proposed 20–30% range.

However, the contribution is relatively thin for a high-risk overnight service.

Boarding costs may also include

Meet-and-greet administration

Property assessment

Daily support

Additional media

Cleaning issue

Host replacement

Emergency transport

Incident reserve

Refund exposure

Longer customer communication

Recommendation

For boarding beta:

20% gross margin = absolute floor

25–30% = preferred minimum operating target

Positive contribution after a risk reserve = required

Do not lower the host payout merely to create margin. Adjust:

Customer price

Scope

Booking duration

Capacity

Included services

Operational efficiency

16. Pet-sitting margin

Recommended target:

Gross margin: 25–35%

Positive contribution after all direct costs

Pet sitting should include additional cost assumptions for:

Home access and handover

Longer service duration

Customer communication

Food/medication tasks

Report preparation

Travel time

A one-hour service with thirty minutes of unpaid travel may have worse economics than the margin table suggests.

Always calculate sitter payout against total committed time, not only the advertised service duration.

17. Approved launch-margin targets

### Table 44

| Service | Gross-margin target | Additional requirement |
| --- | --- | --- |
| Dog walking | 25–35% | Positive repeat-booking contribution |
| Pet sitting | 25–35% | Include travel and handling time |
| Boarding beta | 25–30% preferred | Risk reserve and positive contribution |
| Introductory trial | May be lower or negative | Capped and recovered through repeats |
| Repeat packs | 25%+ preferred | Fulfilment capacity must exist |

Trial-offer rule

A ₹99 first walk may produce little or negative contribution.

That is acceptable only when:

Number of trials is capped

Subsidy is measured

Trial-to-repeat conversion is tracked

Normal repeat bookings are profitable

Customer acquisition payback is understood

18. Daily quality-control workflow

Morning capacity review

↓

Pet and booking-risk checks

↓

Sitter availability confirmed

↓

Travel and workload checked

↓

Payments verified

↓

Services monitored

↓

Proof and reports reviewed

↓

Sitter metrics updated

↓

Contribution calculated

↓

Restrictions or pricing adjusted

19. Daily no-go conditions

Stop accepting new bookings when:

No qualified sitter is available

Red-risk case lacks required expertise

Travel time exceeds operational policy

Top sitters have reached safe capacity

Payment verification is unreliable

Required service proof is repeatedly missing

Emergency contacts are unavailable

Serious incident remains uncontrolled

Standard repeat bookings produce consistently negative contribution

Backup capacity has been consumed

Existing active bookings should remain accessible and supported during the pause.

20. Launch quality dashboard

Booking safety

Red reviews pending

Bookings declined for capability

Bookings waitlisted for sitter

Travel-distance rejections

Current-health blocks

Sitter capacity

Available sitters

Limited-capacity sitters

Full sitters

Backup capacity

Area shortages

Peak-time shortages

Service quality

On-time rate

Completion rate

Report delivery

Proof exceptions

Ratings

Complaints

Incidents

Finance

Average booking value

Average sitter payout

Gross margin

Contribution

Trial subsidy

Refund cost

Contribution by service

Final approval

### Table 45

| Launch rule | Decision |
| --- | --- |
| Do not accept unsupported Red-risk cases | Approved |
| Reject or waitlist operationally distant requests | Approved |
| Confirm only after verified payment | Approved |
| Prevent top-sitter overload | Approved |
| Require service proof | Approved with privacy-safe exceptions |
| 10–15 walkers for 2–3 areas | Reasonable if active capacity is verified |
| 5–10 pet sitters | Reasonable |
| 3–5 boarding hosts | Invite-only beta only |
| 3–5 backups | Use reserved capacity; avoid double-counting |
| 2–3 emergency contacts | Approved if verified and current |

Final operating principle

PetSaathi should reject demand before it sacrifices pet safety, sitter wellbeing, service evidence or financial control.

Simple explanation for professor

“During launch, PetSaathi will follow strict quality rules.

First, a high-risk pet will not be accepted automatically. If the pet requires specialist handling and a suitable sitter is not available, the booking will be waitlisted, changed to a safer service or politely declined. The system will assess the individual pet and requested service rather than making decisions only from breed.

Second, PetSaathi will not accept bookings that are too far from available sitters. It will check area, travel time, schedule and replacement availability. This prevents late arrivals and poor service quality.

Third, the booking will become confirmed only after an eligible sitter has accepted, the final price is locked and Razorpay payment is verified by the backend.

Fourth, high-performing sitters will not be overloaded. Each sitter will have a daily capacity, consecutive-booking limit, travel buffer and reserved backup capacity.

Fifth, every service will produce proof. This includes an arrival update, private photo or video, structured Pet Report Card and completion confirmation. Service media will remain private and will not be used for advertising without separate customer permission.

For two to three areas, PetSaathi may require approximately ten to fifteen dog walkers, five to ten pet sitters, three to five boarding hosts and shared backup capacity. However, active availability and geographic coverage matter more than total profile count.

The sitter dashboard will measure punctuality, offer acceptance, cancellation, no-shows, Report Card completion, ratings and repeat-sitter requests.

For a ₹149 dog walk with a ₹100 sitter payout, the platform gross margin is approximately thirty-three percent and the contribution after ₹10 direct cost is approximately twenty-six percent. The ₹1,499 ten-walk plan also has reasonable margin, but it is not a discount because ten separate ₹149 walks cost ₹1,490. It must either include additional value or use a lower package price.

The ₹999 boarding example produces approximately twenty-five percent gross margin, but only around fifteen to twenty percent contribution after direct support and risk costs. Therefore, boarding should remain a controlled beta with stronger pricing and safety review.

PetSaathi will stop accepting new bookings whenever sitter capacity, emergency support, payment verification, service proof or safety controls are insufficient.”

PetSaathi Phase 5 — Launch Quality Policy 🛡️🐾

Final decision

All five launch-quality rules should be approved.

The operating principle is:

PetSaathi must decline or delay demand before compromising pet safety, sitter wellbeing, payment integrity, service evidence or customer trust.

The complete booking gate should be:

Booking request

↓

Pet and service-risk review

↓

Service-area and travel check

↓

Eligible sitter and capacity check

↓

Sitter provisionally accepts

↓

Final price locked

↓

Payment captured and verified

↓

Booking confirmed

↓

Service delivered with proof

↓

Report Card delivered

↓

Quality and margin review

1. Do not accept unsupported high-risk pets

Correct rule

When a pet receives a Red risk assessment for a particular service, PetSaathi must not automatically assign an ordinary sitter.

Red should mean:

Specialist manual review is required before this service can proceed.

It must not mean:

The pet is permanently dangerous

Every service is rejected

The decision is based only on breed

The pet is morally labelled as “bad”

AVMA guidance states that bite risk should not be predicted from breed alone; the individual animal’s behaviour and history are more relevant.

Service-specific example

### Table 46

| Service | Possible result |
| --- | --- |
| Home sitting in the familiar home | Yellow |
| Walking with an unfamiliar sitter | Red review |
| Shared boarding | Decline |
| Individual care by a specialist | Accept with controls |

Decision process

Red assessment

↓

Is a qualified specialist available?

↓

Can required controls be implemented?

↓

Is customer information complete?

↓

Can PetSaathi support the service safely?

Possible outcomes:

ACCEPT_WITH_CONTROLS

REQUEST_MORE_INFORMATION

SPECIALIST_REVIEW

ALTERNATIVE_SERVICE

WAITLIST

DECLINE

Possible safety controls

Meet-and-greet before the booking

Specialist or highly experienced sitter

Individual service instead of shared boarding

Owner demonstrates harness or handling process

Quiet route

Same-sitter continuity

Veterinary or behaviour-professional information

Enhanced admin monitoring

Written emergency plan

Politely declining

Do not say:

Your pet is unsafe and rejected.

Use:

This service requires specialist handling or safety controls that are not currently available in your area. We can suggest another service, place the request on a waitlist or contact you when suitable support becomes available.

2. Do not accept far-away bookings

Correct rule

PetSaathi should accept a booking only when an eligible sitter can reach it reliably without risking another customer’s service.

Do not check only:

City = Ahmedabad

Check:

Area and pincode

Geographic coordinates

Estimated travel time

Traffic period

Society-entry delay

Sitter’s previous booking

Sitter’s next booking

Transport method

Required service buffer

Suggested launch limits

For hyperlocal walking:

Preferred radius: 3–5 km

Preferred travel time: 15–20 minutes

Exceptional distance: admin approval required

These should remain configurable and be adjusted using real Bopal and Ahmedabad data.

Booking outcomes

Accept

A qualified sitter can serve the booking reliably.

Offer another time

The area is supported, but the requested time cannot be served.

Waitlist

The area is strategically important, but current sitter capacity is insufficient.

Decline

The address is outside the reliable operating boundary.

Why this rule matters

Distant bookings increase:

Late arrivals

Sitter cancellations

Travel cost

Replacement difficulty

Support workload

Sitter fatigue

Risk of missing the next booking

Google’s reliability guidance explains that operational overload increases error risk and prevents teams from completing important work, reinforcing the need for capacity limits and reserved resources.

3. Do not confirm unpaid bookings

Important sequence correction

“Payment first” should not mean taking payment before PetSaathi knows whether the booking can be fulfilled.

The correct flow is:

Customer submits request

↓

Admin reviews eligibility

↓

Eligible sitter provisionally accepts

↓

Final amount locked

↓

Payment requested

↓

Backend verifies payment

↓

Booking confirmed

Payment states

UNPAID

PAYMENT_PENDING

PROCESSING

CAPTURED

FAILED

EXPIRED

PARTIALLY_REFUNDED

REFUNDED

Confirmation requirements

Before moving to CONFIRMED, verify:

Active primary sitter exists

Final amount is locked

Razorpay order matches booking

Payment signature is verified on the server

Payment status = CAPTURED

Amount matches

Currency matches

No unresolved safety block

Razorpay requires the payment signature to be verified on the server before fulfilling the order. Once a payment is captured, its order is marked paid and events such as payment.captured and order.paid are generated. Razorpay also recommends using webhooks or server-to-server verification to recover from browser callback failures.

Payment expiry

A provisional sitter reservation may remain active for:

15–30 minutes

If payment is not completed:

PAYMENT_PENDING

↓

PAYMENT_EXPIRED

↓

Provisional sitter reservation released

Controlled exceptions

Exceptions may include:

Internal test booking

Compensation booking

Approved zero-price promotion

Service-recovery booking

Emergency case where action cannot reasonably wait

Every exception must contain:

Authorising admin

Reason code

Payment responsibility

Customer communication

Audit record

4. Do not overbook top sitters

Why this is necessary

The most highly rated sitter is not necessarily the sitter with unlimited capacity.

Overloading top sitters causes:

Late arrival

Rushed service

Weak Report Cards

Missing updates

Fatigue

Cancellations

Handling mistakes

Poor repeat-customer experience

Capacity fields

Each sitter profile should store:

Maximum bookings per day

Maximum consecutive services

Maximum walking minutes

Minimum travel/report buffer

Service radius

Transport method

Available time windows

Pet-size permissions

Risk permissions

Backup status

Recommended pilot controls

Maximum consecutive walks: 2–3

Minimum buffer: 10–20 minutes

Planned utilisation: 70–80%

Reserved capacity: 20–30%

The reserve covers:

Traffic delays

Long customer handovers

Replacement requests

Weather issues

Active-service concerns

Urgent repeat bookings

Capacity and overload planning are core elements of dependable production operations.

Capacity statuses

AVAILABLE

LIMITED

FULL

BACKUP_ONLY

TEMPORARILY_UNAVAILABLE

SUSPENDED

Customer-facing wording:

Same sitter preferred, subject to availability.

Do not promise a guaranteed sitter unless the entire schedule is actually reserved.

5. Every service requires proof

Minimum evidence

Every service should contain:

Arrival update

Photo or short video

Structured Report Card

Completion confirmation

Arrival update

Record:

Booking ID

Assigned sitter

Arrival timestamp

Handover status

Optional authorised location check

Private photo or video

Recommended:

At least one private photo

or

one short private video

A documented exception may be permitted when:

Taking media is unsafe

The pet becomes distressed

The customer has declined optional media

An emergency interrupts routine proof

The environment prohibits photography

Completion confirmation

Record:

Actual end time

Pet returned or secured

Sitter checkout

Concern status

Dog-walking proof

Arrival

Start time

Photo/video

Duration

Water update

Pee/poop update

Mood

Leash behaviour

End time

Completion confirmation

Pet-sitting proof

Arrival

Initial pet condition

Food and water update

Care tasks completed

Photo/video

Mood

Final condition

Completion confirmation

Boarding proof

Check-in and handover

Daily food and water

Medication tasks where authorised

Daily behaviour/rest update

Private media

Concern status

Final checkout

Uploads should be restricted to authorised users, use allowlisted file types, enforce size limits, use application-generated filenames and remain in private storage. OWASP recommends these layered upload protections rather than trusting the filename or browser-provided content type.

Service evidence must not automatically be used for public marketing.

6. Sitter roster for two to three areas

Suggested roster

### Table 47

| Function | Planning range | Interpretation |
| --- | --- | --- |
| Dog walkers | 10–15 | Around 3–5 active per area |
| Pet sitters | 5–10 | Around 2–3 available per area |
| Boarding hosts | 3–5 | Invite-only, property-approved |
| Backup capacity | 3–5 | Reserve; do not double-count |
| Emergency contacts | 2–3 | Current veterinary/emergency contacts |

Backup-sitter correction

Suppose PetSaathi has:

15 approved dog walkers

12 available for normal assignments

3 partly reserved for backup

This is still 15 sitters, not 18.

Backup capacity should normally be a reserved part of the approved roster.

Minimum per active area

Before enabling an area, aim for:

At least 3 active dog walkers

At least 1–2 pet sitters

At least 1 cross-area backup option

Verified emergency contacts

Active operations coverage

One sitter does not represent reliable coverage because illness, cancellation or pet incompatibility can immediately remove all local supply.

7. Capacity-based roster calculation

Use:

Required active sitters

=

Peak service demand

÷ safe peak services per sitter

÷ target utilisation

Example:

Peak demand: 12 walks

Safe peak capacity per sitter: 2 walks

Target utilisation: 80%

Required capacity is approximately:

12 ÷ 2 ÷ 0.80 = 7.5

Therefore, approximately eight active walkers, plus appropriate reserve capacity, would be needed for that peak window.

Do not count a sitter as active capacity when:

Verification has expired

Availability is unconfirmed

They are outside the area

Their approved service does not match

They already have a conflict

They have an active restriction

They are backup-only

8. Boarding-host management

Three to five boarding hosts may support a small invite-only beta, provided each property is reviewed independently.

Required checks

Host identity

Property suitability

Resident animals

Secure doors and windows

Maximum capacity

Sleeping arrangement

Feeding separation

Escape prevention

Emergency transport

Overnight caregiver presence

Society/landlord permission where applicable

Measure boarding capacity as:

Approved pet-nights

not merely the number of host profiles.

A host approved for one Green-risk dog is not automatically approved for:

Multiple guests

Cats

Reactive animals

Complex medication

Long stays

Shared feeding

9. Emergency-support contacts

Maintain at least:

One regular veterinary clinic

One emergency or extended-hours clinic

One alternative contact

Store:

Clinic name

Phone

Address

Operating hours

Map location

Last verified date

Emergency capability

Emergency contacts do not replace a named PetSaathi safety owner while a service is active.

10. Daily sitter metrics

On-time rate

Services started inside the approved arrival window

÷ services due

× 100

Example window:

Up to 10 minutes early

No more than 5 minutes late

Target:

Minimum: 90%

Preferred: 95%+

Offer acceptance rate

Valid offers accepted

÷ valid offers received

× 100

Target:

80%+

A low rate may indicate poor matching rather than a bad sitter. Sitters should be able to reject unreasonable travel, unsupported risk or scheduling conflicts.

Cancellation rate

Accepted bookings cancelled by sitter

÷ accepted sitter bookings

× 100

Target:

Below 5%

Preferred: below 3%

No-show rate

Track separately:

Sitter no-shows

÷ confirmed sitter bookings due

× 100

Target:

Preferred: 0–2%

Hard maximum: below 5%

Report submission

Reports submitted within the required period

÷ completed services

× 100

Target:

Minimum: 95%

Desired: 100%

Customer rating

Target:

4.5+/5

Always show rating together with:

Number of reviews

Completed services

Rating distribution

Complaint history

Incident history

Repeat requests

Track separately:

Same-sitter preference

Second booking requested

Second payment captured

Second service completed

The strongest measure is the second completed paid service.

11. Unit-economics definitions

Gross margin

Customer payment

− sitter or host payout

= platform gross margin

Gross-margin percentage

Platform gross margin

÷ customer payment

× 100

Net contribution

Gross margin

− payment expense

− direct customer-support cost

− promotion subsidy

− referral commission

− storage and notification costs

− variable refund/incident reserve

= net contribution

Net contribution is not company profit because fixed development, legal, salary and administrative costs remain excluded.

12. Dog-walk economics

### Table 48

| Item | Amount |
| --- | --- |
| Customer pays | ₹149 |
| Sitter payout | ₹100 |
| Gross margin | ₹49 |
| Support/payment cost | ₹10 |
| Net contribution | ₹39 |

Result

Gross margin:

₹49 ÷ ₹149 = 32.9%

Contribution margin:

₹39 ÷ ₹149 = 26.2%

This fits the proposed 25–35% dog-walking gross-margin target.

Confirm whether the ₹10 genuinely includes:

Razorpay cost

Support time

Media storage

Notifications

Referral commission

Refund reserve

If not, the actual contribution is lower.

13. Ten-walk-pack economics

### Table 49

| Item | Amount |
| --- | --- |
| Customer pays | ₹1,499 |
| Sitter payout | ₹1,000 |
| Gross margin | ₹499 |
| Support/payment cost | ₹80–₹120 |
| Net contribution | ₹379–₹419 |

Result

Gross margin:

₹499 ÷ ₹1,499 = 33.3%

Contribution margin:

25.3%–28.0%

Critical pricing issue

Ten individual ₹149 walks cost:

10 × ₹149 = ₹1,490

The proposed ₹1,499 pack is ₹9 more expensive than individual purchases.

Therefore, it cannot be marketed as a discount.

Option A — Convenience plan

Keep ₹1,499 and include:

Preferred recurring time

Same-sitter priority

Simplified scheduling

Priority rescheduling

Longer validity

Option B — Discount plan

Test:

₹1,299–₹1,399

Then recalculate payout and contribution before approval.

Credit accounting

Track:

Credits sold

Credits reserved

Credits used

Credits expired

Credits refunded

Selling a plan creates future service obligations. All ten walks have not been operationally fulfilled on the purchase date.

14. Boarding-beta economics

### Table 50

| Item | Amount |
| --- | --- |
| Customer pays | ₹999 |
| Host payout | ₹750 |
| Gross margin | ₹249 |
| Support/risk cost | ₹50–₹100 |
| Net contribution | ₹149–₹199 |

Result

Gross margin:

₹249 ÷ ₹999 = 24.9%

Contribution margin:

14.9%–19.9%

The gross margin falls inside the proposed 20–30% range, but the contribution is thin for an overnight, higher-risk service.

Additional boarding costs may include:

Meet-and-greet

Property review

Daily support

Additional media

Cleaning problems

Replacement care

Emergency transport

Refund exposure

Incident reserve

Recommendation

Absolute gross-margin floor: 20%

Preferred gross margin: 25–30%

Positive contribution after risk reserve: mandatory

Do not improve margin by unfairly reducing host compensation. Adjust price, scope, capacity or operating efficiency.

15. Approved launch-margin targets

### Table 51

| Service | Gross-margin target | Additional rule |
| --- | --- | --- |
| Dog walking | 25–35% | Positive repeat contribution |
| Pet sitting | 25–35% | Include travel and handling time |
| Boarding | 25–30% preferred | Include risk reserve |
| Introductory trial | May be lower/negative | Cap and measure subsidy |
| Repeat package | 25%+ preferred | Capacity must support credits |

A ₹99 introductory walk may have little or negative contribution. That is acceptable only if:

Trial volume is capped

The subsidy is measured

Repeat conversion is tracked

Normal-price bookings are profitable

Acquisition payback is understood

16. Immediate no-go conditions

Pause new bookings when:

No suitably qualified sitter exists

A Red-risk case lacks specialist controls

Travel exceeds the service-area policy

Top sitters reach safe capacity

Payment verification is unreliable

Required service evidence repeatedly fails

Emergency support information is unavailable

A serious incident remains uncontrolled

Normal bookings have consistently negative contribution

Backup capacity is exhausted

Existing customers must still retain access to:

Active booking details

Customer support

Report Cards

Incident updates

Refund status

Final approval

### Table 52

| Rule | Decision |
| --- | --- |
| Do not accept unsupported Red-risk pets | Approved |
| Reject or waitlist distant requests | Approved |
| Confirm only after verified captured payment | Approved |
| Prevent top-sitter overload | Approved |
| Require service evidence | Approved with safety exceptions |
| 10–15 walkers across 2–3 areas | Reasonable if real capacity supports it |
| 5–10 pet sitters | Reasonable planning range |
| 3–5 boarding hosts | Invite-only beta only |
| 3–5 backup sitters | Use reserve capacity; avoid double-counting |
| 2–3 emergency contacts | Approved when regularly verified |

Final operating principle

PetSaathi should never accept more bookings than its sitter skills, travel limits, payment controls, emergency support and service-evidence systems can safely handle.

PetSaathi Phase 5 — City-Specific Controlled Launch Strategy 🐾🏙️

Executive decision

The six-city direction is reasonable, but these plans should be treated as market hypotheses, not fixed truths about every resident.

The correct rollout model is:

Select one city

↓

Enable one or two micro-areas

↓

Launch one hero service

↓

Recruit locally available sitters

↓

Run controlled paid bookings

↓

Measure repeat demand and operations

↓

Expand only after quality gates pass

PetSaathi should configure itself as a service-area business with accurate cities, postal codes or localities rather than claiming an entire metropolitan region. Google explicitly gives a pet walker as an example of a service-area business and permits up to 20 defined service areas.

1. Strategic comparison

### Table 53

| City | Recommended hero service | Price position | Main differentiator | Main operational risk |
| --- | --- | --- | --- | --- |
| Bengaluru | Dog walking | Mid-premium | App-like updates and verified sitters | Congestion and high UX expectations |
| Pune | Repeat dog-walking plans | Value-premium | Same-walker continuity | Traffic and price comparison |
| Mumbai | Hyperlocal dog walking | Premium | Same-locality sitter | Travel delays and fragmented coverage |
| Gurugram | Premium verified care | Premium | Precise verification and society support | Gate access and trust expectations |
| Ahmedabad | Walking + daytime sitting | Accessible premium | Trusted local caretakers | Customer education and supply depth |
| Surat | Daytime sitting first | Accessible | Family-oriented assisted care | Supply training and slower self-service adoption |

Important correction

Full continuous GPS should not be advertised during Phase 5 if it is scheduled for Phase 6.

Use:

Live booking status, private photo/video updates and GPS-ready service architecture.

Do not use:

Continuous live GPS tracking included.

2. Bengaluru launch

Recommended setup

### Table 54

| Item | Recommendation |
| --- | --- |
| Initial areas | Whitefield first; HSR second |
| Reserve area | Sarjapur Road after supply validation |
| Hero service | Thirty-minute dog walking |
| Price position | Mid-premium |
| Main channels | Instagram, large societies, dog-parent communities |
| Differentiator | Smooth app-like journey, private updates, verified sitters |
| Matching model | Strict micro-area and time-slot matching |

Bengaluru is a major technology and industrial centre, supporting the hypothesis that a polished digital journey and mobile-first onboarding may perform well. However, this must still be tested through actual booking conversion rather than assumed.

Bengaluru also recorded the highest congestion level among the Indian cities listed in TomTom’s 2025 index at 74.4%. This strongly supports micro-area sitter pools and substantial travel buffers.

Correct launch order

Whitefield society cluster

↓

Three to five local walkers

↓

Morning and evening slots

↓

Twenty to thirty completed walks

↓

HSR pilot

↓

Sarjapur Road only after coverage exists

Do not activate all three corridors simultaneously. Whitefield, HSR and Sarjapur Road can create separate travel and supply problems.

Customer proposition

Verified dog walkers for busy Bengaluru pet parents—with private service updates and a Pet Report Card.

“Busy tech professionals” can be used as one campaign audience, but the main homepage should not imply that only technology workers are eligible.

Product emphasis

Very fast mobile booking

Saved Pet Profiles

Transparent sitter availability

Private photo/video updates

Same-sitter rebooking

Accurate service-status timeline

Rapid notification delivery

Society-entry instructions

Pricing experiment

Example pilot positioning:

Trial walk: ₹149–₹199

Standard walk: ₹199–₹299

Repeat plan: priced after supply and CAC validation

These should be tested, not copied nationally.

Primary risks

Sitter delayed by traffic

Customer compares PetSaathi with established alternatives

High expectations for application performance

Large service radius introduced too early

Marketing claims GPS before it exists

Bengaluru go-live gate

At least three active walkers per micro-area

Backup capacity for peak times

Median sitter travel below the approved limit

Mobile Core Web Vitals pass

Payment and notifications stable

Same-sitter repeat availability demonstrated

3. Pune launch

Recommended setup

### Table 55

| Item | Recommendation |
| --- | --- |
| Initial area | Baner |
| Second area | Wakad |
| Later test | Kharadi |
| Hero service | Repeat dog-walking plans |
| Price position | Value plus trust |
| Main channels | Societies, pet shops, local digital campaigns |
| Differentiator | Same-walker continuity |
| Supply approach | Verified students plus professional walkers |

Pune is both an established IT centre and a major education and research hub. This supports testing younger sitter-supply channels, but students must pass the same verification, training and service-permission standards as every other sitter.

Pune’s 2025 average congestion level was 71.1%, with an average 10 km trip taking more than 33 minutes. That makes Baner, Wakad and Kharadi separate operational clusters rather than one sitter territory.

Customer proposition

Reliable daily dog-walking plans with the same trusted walker whenever available.

Do not promise the same walker unconditionally.

Use:

Same walker preferred and prioritised, subject to availability.

Launch model

First paid trial

↓

Second individual walk

↓

Same-walker preference recorded

↓

Five-walk starter plan

↓

Ten-walk plan after fulfilment stability

Avoid selling large monthly plans before sitter capacity has been proven.

Suggested plan architecture

### Table 56

| Plan | Purpose |
| --- | --- |
| One trial walk | Trust validation |
| Five-walk pack | Repeat-demand test |
| Ten-walk pack | Scheduling and retention test |
| Weekly recurring waitlist | Demand collection without automatic billing |

Student-sitter controls

Student supply may be useful, but PetSaathi should require:

Identity and contact verification

Background/police verification according to policy

Training

Schedule stability

Emergency contact

Service and pet-size permission

Minimum availability commitment

No substitution by an unapproved friend

Do not market “student sitter” as automatically cheaper or less professional.

Primary risks

Price-sensitive comparisons

Walk packs sold without fulfilment capacity

Evening travel delays

Student timetable changes

Customers misunderstanding same-sitter continuity

Pune go-live gate

At least three local walkers in Baner

At least one backup during peak slots

Five-walk packs can be fulfilled within validity

Cancellation rate below 5%

Same-walker repeat requests measured

Clear contribution after package discount

4. Mumbai launch

Recommended setup

### Table 57

| Item | Recommendation |
| --- | --- |
| First micro-market | Powai |
| Independent later tests | Bandra and Andheri West |
| Hero service | Hyperlocal dog walking |
| Price position | Premium |
| Main channels | Premium societies, resident referrals, dog-parent groups |
| Differentiator | Sitter from the same locality |
| Core control | Travel-time-based matching |

Mumbai should never be operated as one citywide sitter market.

The city recorded a 63.2% average congestion level in 2025, with average rush-hour speeds of about 17.6 km/h. MMRDA transport projects also explicitly address congestion and multimodal connectivity. These conditions support very small sitter radii and area-specific replacement pools.

Customer proposition

Verified walkers within your locality—designed to reduce long-distance delays.

Do not use:

No delays guaranteed.

Operational model

Powai sitter pool

≠

Bandra sitter pool

≠

Andheri West sitter pool

Cross-area assignment should be an exception, not the default.

Product requirements

Building and security instructions

Tower/wing information

Sitter travel-time calculation

Strict booking buffers

Exact address released only after confirmation

Backup sitter from the same micro-market

Delay alerts

Customer approval for replacement

Pricing logic

Premium pricing is justified only when PetSaathi can deliver:

Reliable arrival

Local backup

Strong verification

High-quality report

Fast active-service support

Do not charge a premium based only on the city name.

Boarding recommendation

Boarding should remain limited because:

Host-property validation is difficult

Travel for handover may be substantial

Residential restrictions differ

Emergency replacement is complex

Shared-space compatibility adds risk

Start with walking. Test daytime sitting only after the locality pool is stable.

Primary risks

Long-distance matching

High sitter travel cost

Multiple bookings scheduled too tightly

Difficult replacement

Premium price without premium reliability

Mumbai go-live gate

Independent sitter pool in selected locality

Median assignment time meets target

Average sitter travel time remains controlled

Replacement coverage exists

On-time rate reaches at least 95% for premium positioning

No broad “Mumbai-wide” availability claim

5. Gurugram launch

Recommended setup

### Table 58

| Item | Recommendation |
| --- | --- |
| Initial cluster | Sector 56/57 or one DLF cluster |
| Second cluster | Golf Course Road |
| Hero service | Premium verified walking and sitting |
| Price position | Premium |
| Main channels | Gated societies, employee communities, corporate partnerships |
| Differentiator | Exact verification badges and controlled matching |
| Operational focus | Society gate approval and support responsiveness |

Gurugram’s district administration describes the city as an IT/BPO and financial centre within the National Capital Region. That supports testing corporate and premium customer segments, although willingness to pay must still be proven through paid conversion.

Customer proposition

Premium pet-care support for selected gated communities, with precisely verified caregivers and responsive service assistance.

Verification language

Show exactly what has been reviewed:

Identity verified

Address verified

Police-verification document reviewed on [date]

Training completed

Large-dog handling approved

Avoid vague badges:

100% safe

Risk-free

Fully trusted

Society operating requirements

Before enabling a society:

Obtain management or resident-group approval where needed

Document gate-entry requirements

Register approved sitters if required

Record visitor timing restrictions

Identify parking and access issues

Assign resident or management contact

Prepare replacement-entry process

Emergency support

Emergency support can improve trust only when it is concrete:

Named local clinic

Emergency contact number

Operating hours

Map location

Last verification date

Clear statement that PetSaathi coordinates rather than diagnoses

Primary risks

“Police verified” displayed without valid documentation

Gate access delaying the service

Premium promises exceeding support capacity

Large geographic sectors treated as one area

Corporate campaigns producing more demand than available supply

Gurugram go-live gate

Society-entry procedures tested

Exact verification records available

Premium support rota staffed

Local veterinary escalation current

Three or more suitable caregivers in the cluster

High-value bookings have backup coverage

6. Ahmedabad launch

Recommended setup

### Table 59

| Item | Recommendation |
| --- | --- |
| First area | Bopal |
| Second area | South Bopal |
| Later area | Satellite |
| Hero services | Dog walking and one-hour daytime sitting |
| Price position | Accessible premium |
| Main channels | Societies, veterinary clinics, pet shops, referrals |
| Differentiator | Trusted local caretakers and assisted onboarding |
| Launch model | WhatsApp-supported, admin-controlled |

Ahmedabad Municipal Corporation recognises Bopal/South Bopal within its civic structure, and the area is appropriate for a tightly defined local pilot. Ahmedabad’s 2025 congestion level was lower than Bengaluru, Pune and Mumbai but still substantial at 49%, so locality-based matching remains necessary.

Customer proposition

Verified local pet caretakers for Ahmedabad families—with private updates and a complete Pet Report Card.

Recommended service order

Bopal dog walking

↓

Bopal daytime sitting

↓

South Bopal expansion

↓

Satellite only after sitter supply exists

Assisted onboarding

A trust-led launch may include:

WhatsApp explanation

Phone-assisted Pet Profile creation

Society registration sessions

Vet/pet-shop referral card

First-service follow-up

Gujarati and Hindi content after message testing

The assumption that offline trust and local referrals will outperform fully digital acquisition is a pilot hypothesis. Measure it against Instagram and Search conversions rather than treating it as established fact.

Pricing position

“Accessible premium” should mean:

Not the cheapest option

Transparent sitter payout

Verification visible

Report Card included

Support included

Trial price separated from normal price

Primary risks

Too much customer education required

Discount-led customers who do not repeat

Weak sitter density outside Bopal

Pet sitting introduced before home-access controls are ready

Local trust claims without concrete verification

Ahmedabad go-live gate

Bopal sitter pool operational

Vet and emergency contacts verified

Society and referral channels tracked

Assisted and self-service funnels compared

Repeat rate reaches target

South Bopal enabled only after Bopal capacity is stable

7. Surat launch

Recommended setup

### Table 60

| Item | Recommendation |
| --- | --- |
| First area | Vesu |
| Second test | Adajan |
| Later test | Citylight |
| Hero service | Daytime pet sitting |
| Secondary service | Dog walking |
| Boarding | Invite-only beta only |
| Price position | Accessible |
| Main channels | Referrals, pet shops, societies, WhatsApp |
| Differentiator | Family-oriented assisted care |

Surat Municipal Corporation describes Surat as a rapidly growing city, and its official records identify Adajan, Vesu and related areas as established or developing urban zones.

Customer proposition

Safe, structured pet care when your family is busy or travelling—with assisted booking and private service updates.

Important correction

Do not make boarding the primary public service on launch day.

Use this order:

Daytime sitting

↓

Walking

↓

Repeat local customers

↓

One-night invite-only boarding beta

Boarding requires substantially stronger controls than sitting:

Host-property review

Vaccination policy

Compatibility assessment

Overnight caregiver

Emergency transport

Feeding separation

Escape controls

Written handover

Assisted conversion

Test:

WhatsApp-first onboarding

Phone support

Pet-shop referral cards

Society coordinators

Family referral codes

In-person Pet Profile help

“Slower digital conversion” and “family referrals matter more” should be treated as hypotheses until channel data confirms them.

Sitter training emphasis

Home-entry protocol

Care-task checklist

Report Card quality

Customer communication

Handling fundamentals

Emergency escalation

Privacy in family homes

Primary risks

Public boarding launched too soon

Insufficient sitter training

Low prices that cannot support operations

Leads accepted outside a viable radius

Informal referrals bypassing platform records

Surat go-live gate

At least two trained daytime sitters in Vesu

Local emergency contacts verified

WhatsApp support staffed

Referral leads still pass normal safety review

Walking added only when local walker supply exists

Boarding remains invite-only until host checks pass

8. Recommended city rollout order

Based on PetSaathi’s existing preparation and the operational evidence available, my recommended sequence is:

1. Ahmedabad — Bopal

Why:

Existing project planning already centres on Ahmedabad

Pricing and launch workflow are defined

Lower traffic pressure than Bengaluru, Pune and Mumbai

Society and referral model can be tested locally

2. Pune — Baner

Why:

Strong case for repeat walking plans

Education and IT ecosystem may support both demand and sitter recruitment

Must remain hyperlocal because congestion is high

3. Gurugram or Bengaluru

Choose based on:

Verified sitter supply

Cost of acquisition

Society access

Local operations partner

Support capability

Bengaluru offers stronger digital-product testing, while Gurugram offers a stronger premium verification proposition.

4. Mumbai

Launch only after PetSaathi has mastered:

Hyperlocal supply

Sitter replacement

Premium support

Time-based matching

Mumbai’s congestion makes operational mistakes expensive.

5. Surat

Surat may be attractive for an assisted, referral-led launch, but PetSaathi should first validate sitter training and family-home service processes.

This order is a strategic inference, not a statement that one city has universally greater pet-care demand.

9. City activation checklist

Before enabling any new city, require:

Demand

At least 30 qualified local leads

Five to ten customers ready for a controlled pilot

Hero service identified

Price test approved

Supply

Three to five verified caregivers in the first micro-area

Backup coverage

Time-slot availability

Required service permissions

Operations

Local support owner

Service radius

Area pricing

Society-access process

Emergency contacts

Cancellation and replacement process

Product

City-area landing page

Accurate service availability

City-specific pricing

Local FAQs

No copied doorway page

Campaign and referral tracking

Safety

Pet-risk review process

Incident escalation

Private media rules

Veterinary coordination

Boarding disabled unless separately approved

10. Metrics to compare across cities

Use the same definitions in every city:

### Table 61

| Category | Metric |
| --- | --- |
| Acquisition | Cost per qualified lead |
| Conversion | Completed first booking per qualified lead |
| Supply | Assignment success |
| Logistics | Median sitter travel time |
| Service | Completion and on-time rates |
| Quality | Rating and complaint rate |
| Retention | Second completed booking |
| Safety | Incidents per completed booking |
| Finance | Contribution per booking |
| Density | Completed bookings per active micro-area |

A city should not be called successful because it generated many enquiries. It must produce safely completed and repeated paid services.

Final approved positioning

### Table 62

| City | Recommended message |
| --- | --- |
| Bengaluru | Verified dog walkers for busy Bengaluru pet parents—with private live updates and Report Cards. |
| Pune | Reliable repeat dog-walking plans with the same trusted walker whenever available. |
| Mumbai | Verified walkers within your locality—designed to minimise long-distance delays. |
| Gurugram | Premium pet-care support for selected gated communities, with precisely verified caregivers. |
| Ahmedabad | Verified local pet caretakers for Ahmedabad families. |
| Surat | Safe, assisted pet care when your family is busy or travelling. |

Final operating principle

PetSaathi should not copy one city’s strategy into another. Every city must begin as a separate micro-market with its own sitter pool, travel limits, pricing, trust message, acquisition channels and service-capacity gate.

PetSaathi Phase 5 — What Goes Wrong in Many Launches

Corrected rollout model and upgrade approvals 🚀🐾

Executive decision

Your overall diagnosis is correct, but Mistake 1 contains a wording error.

This:

Correct:

Bengaluru + Pune + Ahmedabad + Surat together

is actually the wrong approach.

The corrected version is:

Wrong:

Launch Bengaluru, Pune, Ahmedabad and Surat together.

Correct:

Launch one city, one or two nearby areas and one hero service first.

Expand only after payment, assignment, service quality and repeat demand are stable.

A staged launch limits the number of customers affected by failures and allows the team to stop expansion when problems appear. Google’s reliability guidance recommends gradually exposing small portions of real traffic and increasing only after the earlier stage proves stable.

1. Mistake — Launching too many cities

Wrong approach

Bengaluru

Pune

Ahmedabad

Surat

Mumbai

Gurugram

all launched together.

This creates several separate operational systems at once:

Different sitter pools

Different travel times

Different pricing

Different society-access procedures

Different veterinary contacts

Different customer expectations

Different acquisition channels

Different support requirements

A two-sided marketplace depends on matching suitable local supply with local demand. Research on marketplace location models shows that distance affects match quality, while sufficient concentrated activity is needed to maintain service availability.

Correct launch structure

One city

↓

One primary area

↓

One nearby secondary area

↓

One hero service

↓

Limited verified sitter pool

↓

Controlled daily capacity

Recommended PetSaathi starting scope:

City: Ahmedabad

Primary area: Bopal

Secondary area: South Bopal

Later test: Satellite

Hero service: Dog walking

Secondary service: Daytime pet sitting

Boarding: Invite-only beta

Google also advises service-area businesses to list the actual cities, postal codes or localities they genuinely serve rather than presenting an inaccurate operating region.

2. Mistake — Optimising for downloads and followers

Vanity metrics

These figures may indicate attention, but not business success:

Application installs

Instagram followers

Post likes

Video views

Landing-page visits

WhatsApp enquiries

They do not prove that PetSaathi can safely deliver a paid service.

Correct launch metrics

Track:

Verified paid bookings

Eligible sitter assignment

Completed services

Report Cards delivered

Customer ratings

Second paid bookings

Sitter punctuality

No-shows

Refunds

Incidents

Contribution per booking

Correct funnel

Visitor

↓

Book CTA clicked

↓

Booking form started

↓

Booking request submitted

↓

Admin approval

↓

Eligible sitter assigned

↓

Payment captured

↓

Service completed

↓

Report Card delivered

↓

Review

↓

Second paid booking

GA4 Funnel Exploration is designed to reveal where users abandon multi-stage journeys and specifically supports analysis of progression from one-time to repeat buyers.

Primary success metric

The strongest Phase 5 metric should be:

Number of customers who complete one paid service and then complete a second paid service within the defined repeat window.

A follower is not a customer.A lead is not a booking.A payment is not a completed service.Stated repeat interest is not repeat revenue.

3. Mistake — Offering only a one-time trial

Wrong approach

₹99 trial

↓

Service completed

↓

No obvious next action

The customer must then search again, repeat the booking process and reconsider every decision.

Correct retention ladder

First trial

↓

Same-sitter repeat booking

↓

Second individual service

↓

5-walk starter plan

↓

10-walk plan

↓

Recurring-plan waitlist

Important correction

Do not automatically push a package immediately after every trial regardless of service quality.

A repeat-plan offer should be shown only when:

Service was completed

Report Card was delivered

No unresolved incident exists

Customer did not submit a serious complaint

Sitter or equivalent capacity is available

Pet information remains current

Recommended post-service sequence

Immediately after a successful Report Card:

1. Book the same sitter again

2. Repeat this service

3. View 5-walk plan

4. Join weekly-plan waitlist

5. Refer a pet parent

The simplest retention action should be one more booking, not a large prepaid commitment.

4. Mistake — Assuming the application handles operations

Wrong assumption

Customer books

Application automatically manages everything

Founder checks dashboard occasionally

Pet care includes real-world variables that software alone cannot resolve:

Sitter late

Customer unavailable

Building security blocks entry

Pet behaviour differs from profile

Payment captured but booking not updated

Sitter cancellation

Pet illness

Missing Report Card

Complaint or incident

Correct launch operation

During Phase 5, every active service should have:

Named operations owner

Support contact

Safety escalation owner

Sitter status monitoring

Customer communication

Replacement procedure

Incident process

Support monitoring sequence

Service starting soon

↓

Sitter acknowledgement checked

↓

Arrival monitored

↓

Service start recorded

↓

Concern alerts monitored

↓

Service completion verified

↓

Report Card delivered

The platform should automate alerts and records, but humans should supervise exceptions and high-impact decisions during the controlled launch.

5. Mistake — Weak geographic density

Wrong structure

100 bookings

across

30 distant areas

This creates only about three bookings per area on average and fragments the sitter pool.

Likely consequences:

Long sitter travel

Slow matching

Weak backup coverage

High cancellation risk

Poor same-sitter continuity

Higher acquisition cost

Difficult society partnerships

Correct structure

100 bookings

across

2–3 nearby areas

Possible example:

Bopal: 50 bookings

South Bopal: 30 bookings

One nearby society cluster: 20 bookings

Concentrated activity increases the chance that the right sitter and customer can be matched within acceptable distance and time. Marketplace research similarly treats geographic distance and sufficient local transaction flow as central to match quality and availability.

Density metrics

Track:

Bookings per area

Completed bookings

÷ active areas

Bookings per society

Completed society bookings

÷ active partner societies

Travel efficiency

Total sitter travel minutes

÷ completed services

Match rate

Approved requests receiving eligible sitter

÷ approved requests

× 100

Same-sitter continuity

Repeat bookings served by preferred sitter

÷ repeat bookings requesting that sitter

× 100

6. Upgrade 1 — Restrict Phase 5 to two or three areas

Decision: Approved, with a narrower starting recommendation

Phase 5 should be restricted to one primary area plus one nearby secondary area initially.

Recommended progression:

Stage 1: Bopal

Stage 2: Bopal + South Bopal

Stage 3: Add Satellite only after capacity proof

Why this is important

It improves:

Sitter arrival reliability

Backup availability

Same-sitter repeat potential

Society booking density

Support efficiency

Local word of mouth

Contribution margin

Activation gate for a new area

Do not enable another area until it has:

At least 20–30 qualified leads or clear demand

Three or more suitable walkers

One or two suitable sitters

Backup coverage

Area pricing

Verified emergency contacts

Acceptable travel time

Operations owner

Real landing-page information

Google allows service-area businesses to define precise supported areas and remove those that are not actually served, reinforcing the need for accurate micro-market boundaries.

Final approval

Phase 5 geography:

Maximum 2 active areas initially

Third area only after formal expansion gate

7. Upgrade 2 — Trial-to-pack conversion system

Decision: Approved with modification

The conversion system should be mandatory in the product workflow, but purchasing a plan must never be mandatory for the customer.

Correct mandatory behaviour

After every successful eligible trial, the system must:

Check service completion

Check report delivery

Check unresolved concerns

Check future sitter capacity

Display a repeat action

Record whether the customer accepted or declined

Correct offer hierarchy

Book same sitter again

↓

Book one additional service

↓

5-walk plan

↓

10-walk plan

↓

Recurring-plan waitlist

Why not force a package immediately?

A trial customer may still need to validate:

Sitter compatibility

Schedule fit

Normal price

Customer support

Pet response

Report quality

A forced or aggressive package offer may increase refunds and create fulfilment obligations before sitter capacity is known.

Recommended eligibility

Five-walk plan

Offer after:

One successful completed service

or preferably

two completed services

Ten-walk plan

Offer after:

At least one successful repeat

and confirmed area capacity

Monthly or automatic recurring plan

Do not activate until:

Schedule fulfilment is stable

Cancellation rules work

Credit accounting works

Customer can pause or cancel

Sitter capacity is reliable

Payment mandates receive legal and technical review

Final approval

Make the repeat-offer workflow mandatory, but keep package purchase optional and capacity-controlled.

8. Upgrade 3 — Mandatory daily launch dashboard

Decision: Fully approved

The daily dashboard is a Phase 5 P0 requirement.

A weekly report is too late for problems such as:

Captured payment without confirmation

Missing sitter

High no-show rate

Report backlog

Support failure

Incorrect pricing

Refund spike

Active incident

Required dashboard sections

Acquisition

Visitors

CTA clicks

Booking-form starts

Qualified leads

Booking requests

Operations

Requests awaiting review

Approved requests

Unassigned bookings

Sitter offers

Confirmed services

Late services

Completed services

Payments

Payment attempts

Captured payments

Failed payments

Payment mismatches

Refunds

Service quality

On-time rate

Completion rate

Report delivery

Ratings

Complaints

No-shows

Incidents

Retention

Same-sitter requests

Second booking requests

Second paid bookings

Packages purchased

Credits consumed

Capacity

Available sitters

Full sitters

Backup capacity

Peak-slot shortages

Area shortages

Required alert examples

Payment captured but booking unconfirmed

Service starts within 30 minutes without sitter acknowledgement

Service overdue

Report missing

Sitter no-show

Serious complaint

Critical incident

Funnel tools can show where customer journeys fail, while staged-release guidance emphasises monitoring real behaviour before increasing exposure.

Final approval

Daily dashboard: Mandatory

Daily review owner: Required

End-of-day status: Green, Amber or Red

9. Upgrade 4 — Society-first launch channel

Decision: Approved as the default initial channel, not the only channel

A society-first strategy is appropriate for PetSaathi because societies can concentrate:

Customers

Sitters

Security procedures

Word of mouth

Repeat bookings

Local support

Correct channel order

1. Warm leads

2. Apartment societies

3. Vet and pet-shop referrals

4. Customer referrals

5. Hyperlocal Google Search

6. Small Instagram tests

Why societies can work

A functioning society cluster may produce:

Several customers

within one entry process

and one small travel radius

This can reduce:

Sitter travel time

Acquisition cost

Replacement difficulty

Support complexity

Important limitations

Society-first should not mean:

Only societies forever

Accepting group walks automatically

Claiming society endorsement without permission

Offering permanent discounts

Entering societies without documented access rules

Test against other channels

Compare societies with search, referrals and Instagram using:

Cost per completed customer

Booking density

Repeat rate

Travel time

Refund rate

Support workload

Contribution

If Google Search produces better repeat customers at sustainable CAC, it may become the stronger channel later.

Final approval

Use society partnerships as the default density-building channel, while continuing controlled comparison with referrals and paid search.

10. Upgrade 5 — Daily booking cap

Decision: Fully approved, but make it capacity-based

A booking cap is essential during a controlled launch.

Google’s reliability guidance recommends gradual rollout, limited initial exposure and stopping expansion when system or operational problems appear.

Problem with fixed caps

This proposed schedule:

### Table 63

| Stage | Proposed cap |
| --- | --- |
| Week 1 | 5–10/day |
| Week 2 | 10–20/day |
| Week 3 | 20–30/day |
| Week 4 | 30–40/day |

may be too aggressive if PetSaathi has only a few active sitters.

Forty daily bookings require substantial:

Peak-time sitter supply

Backup capacity

Support coverage

Report review

Payment reconciliation

Incident response

Correct cap formula

Sellable daily capacity

=

Sum of safe sitter capacity

− existing repeat commitments

− travel/report buffers

− backup reserve

− operational safety reserve

Example

Suppose:

5 active walkers

Safe capacity: 3 walks each

Total theoretical capacity: 15

Backup reserve: 3

Operational buffer: 2

Then:

Sellable capacity:

15 − 3 − 2 = 10 bookings

The cap should be approximately ten, not automatically twenty because the launch reached Week 2.

Recommended starting caps

### Table 64

| Stage | Recommended initial cap |
| --- | --- |
| Days 1–3 | 3–5 completed services/day |
| Days 4–7 | 5–8/day |
| Week 2 | 8–12/day if quality passes |
| Week 3 | 12–20/day if supply expands |
| Week 4 | Capacity-based; not automatically 30–40 |

Cap-expansion requirements

Increase the daily cap only when:

Assignment success ≥90%

Completion rate ≥90%

Report delivery ≥95%

Sitter no-show <5%

Support P90 <10 minutes during active services

No critical payment mismatch

No unresolved serious incident

Backup capacity remains available

Automatic cap reduction

Reduce the cap when:

Assignment time increases

Sitter utilisation exceeds safe level

Report backlog grows

Support response worsens

No-shows increase

Refunds increase

A serious incident occurs

Payment reconciliation fails

Final approval

Use a mandatory daily booking cap calculated from verified sitter and support capacity, not merely the calendar week.

11. Correct Phase 5 launch model

One city

↓

One or two active micro-markets

↓

Society and referral acquisition

↓

Capacity-based booking cap

↓

Admin-controlled matching

↓

Verified payment

↓

Service evidence and Report Card

↓

Daily dashboard review

↓

Same-sitter repeat

↓

Starter plan

↓

Expansion gate

12. Upgrade approval table

### Table 65

| Upgrade | Decision | Qualification |
| --- | --- | --- |
| Restrict launch to 2–3 areas | Approved | Start with 1–2; third area requires a gate |
| Trial-to-pack conversion | Approved with modification | Repeat offer mandatory; package purchase optional |
| Daily dashboard | Fully approved | P0 launch requirement |
| Society-first acquisition | Approved | Default initial channel, not the only channel |
| Daily booking cap | Fully approved | Must be capacity-based |

13. Revised mistakes summary

### Table 66

| Mistake | Correct model |
| --- | --- |
| Launch many cities | One city and one or two areas |
| Chase installs/followers | Measure completed and repeat paid bookings |
| Offer only a trial | Trial → repeat → starter plan |
| Ignore support | Monitor every active service |
| Spread demand widely | Concentrate bookings locally |
| No dashboard | Daily live operating dashboard |
| No capacity limit | Capacity-based daily booking cap |
| Expand by calendar | Expand only after quality gates |

Final operating principle

PetSaathi should scale density before geography, repeat bookings before downloads and operational reliability before advertising volume.

Simple explanation for professor

“Many marketplace launches fail because they open too many cities and track the wrong metrics. PetSaathi should not launch Bengaluru, Pune, Ahmedabad and Surat at the same time. It should begin in one city with one or two nearby areas.

The project should measure paid bookings, completed services, repeat customers, sitter punctuality, Report Cards and refunds instead of focusing mainly on application installs, followers or likes.

After a successful trial, the customer should receive an easy same-sitter repeat option. A five-walk or ten-walk plan may then be offered when PetSaathi has enough sitter capacity. The offer system should be mandatory, but customers should never be forced to purchase a package.

Support must monitor every active service during the controlled launch. The team should check sitter arrival, service progress, Report Card delivery, payments and incidents.

PetSaathi should also create local booking density. One hundred bookings across two or three nearby areas are more valuable than one hundred bookings scattered across thirty localities because local density reduces travel and improves sitter matching.

I approve restricting Phase 5 to two or three areas, using a mandatory daily dashboard, making society partnerships the default initial channel and setting a daily booking cap. The booking cap should be based on actual sitter and support capacity rather than increasing automatically every week.

PetSaathi should expand only when assignment, completion, Report Cards, support and safety metrics remain stable.”

PetSaathi Phase 5 — Launch Dashboard, Final Report and Phase 6 Decision 📊🐾

Executive decision

The proposed Phase 5 framework is approved, with five important refinements:

Start with one or two areas, not three on launch day.

Treat website traffic as useful only when it produces qualified local demand.

Calculate repeat rate only from customers who have had enough time to book again.

Use positive contribution margin, not gross margin alone, as the financial test.

Set daily booking limits from active sitter and support capacity—not from the week number.

The Phase 5 control loop should be:

Collect live operational data

↓

Detect payment, assignment or safety problems

↓

Control daily booking capacity

↓

Measure completed and repeat bookings

↓

Reconcile revenue and payouts

↓

Review performance by service, area and channel

↓

Create final launch report

↓

Move, extend, repair or pause

GA4 Funnel Exploration can show where users abandon a journey and how one-time buyers become repeat buyers, but PetSaathi’s database should remain the authoritative source for bookings, assignments, payments, services and reports.

1. Phase 5 dashboard architecture

Do not create one crowded screen containing every number.

Use three dashboard views.

A. Live operations dashboard

Used throughout the day for immediate actions:

Services starting soon

Active services

Late sitter arrivals

Unassigned bookings

Payment problems

Missing Report Cards

Open complaints

Active incidents

B. Daily business scorecard

Used at the end of each operating day:

Visitors

Qualified leads

Booking requests

Paid bookings

Completed services

Ratings

Repeat bookings

Revenue

Margins

Refunds

C. Seven-day and thirty-day trends

Used to determine whether performance is improving:

Channel conversion

Area density

Sitter reliability

Customer retention

Unit economics

Support workload

Technical stability

A daily metric without a trend can be misleading. For example, twelve paid bookings today may look positive, but not when assignment success has fallen from 95% to 70%.

2. Corrected dashboard targets

### Table 67

| Metric | Recommended interpretation | Target |
| --- | --- | --- |
| Website visitors | Qualified local traffic by channel | Increasing only with stable conversion |
| Booking requests | Valid requests inside enabled areas | 5–30/day, capacity-based |
| Paid bookings | Unique verified captured payments | 3–15/day, capacity-based |
| Booking completion | Completed ÷ confirmed bookings due | 90%+ |
| Report Cards | Delivered ÷ completed services | 95%+ |
| Average rating | Eligible completed-service reviews | 4.5+ with meaningful sample |
| Repeat customer rate | Second completed booking ÷ eligible customers | 25%+ |
| Sitter no-show rate | No-shows ÷ confirmed services due | Below 5%; ideally 0–2% |
| Refund/dispute rate | Affected paid bookings ÷ paid bookings | Below 5% |
| Support response | P90 for active-service issues | Under 10 minutes |
| Revenue | Captured, refunded and recognised separately | Daily reconciliation |
| Gross margin | Payment less sitter/host payout | 25%+ |
| Contribution margin | Gross margin less direct variable costs | Positive |

These targets are PetSaathi’s internal pilot standards, not universal pet-care industry benchmarks.

3. Website visitors

“Increasing” is not a sufficient target.

A large increase in traffic may be harmful when visitors:

Live outside the service area

Want unsupported services

Do not complete Pet Profiles

Cannot find available slots

Do not convert into paid bookings

Track visitors by

Area

Traffic source

Campaign

Service page

Device

New/returning user

Important conversions

Visitor → Book CTA

Book CTA → Booking form

Form → Valid booking request

Request → Paid booking

Paid booking → Completed service

GA4 supports building custom funnels to compare the number of users moving through each step and identify abandonment.

Correct traffic target

Increase qualified visitors from supported areas while maintaining or improving completed-booking conversion.

Do not spend more on traffic when sitter capacity is already full.

4. Booking requests

Definition

A valid booking request must contain:

Existing customer

Customer-owned Pet Profile

Active service

Supported area

Valid date and time

Service address

Required safety information

Server-calculated estimated price

Exclude:

Duplicate submissions

Internal tests

Unsupported areas

Incomplete abandoned drafts

Spam

Formula

Valid booking requests per day

Also track:

Requests awaiting information

Requests approved

Requests declined

Requests waitlisted

Target

5–30 valid requests per day

But the correct range depends on the stage:

### Table 68

| Launch stage | Practical request range |
| --- | --- |
| Early Week 1 | 5–10/day |
| Stable Week 2 | 10–20/day |
| Stable Week 3–4 | 15–30/day |

A request target should never exceed the team’s ability to review requests promptly.

5. Paid bookings

Definition

A paid booking should count only when:

Payment signature verified

Payment status = CAPTURED

Amount matches

Currency matches

Provider order matches booking

Internal payment record committed

Do not count:

Checkout opened

Payment authorised but not captured

Failed attempt

Browser success message

Duplicate attempt

Internal test

Razorpay advises using webhooks or server-to-server checks to handle browser callback failures and confirm payment details. Its webhook guidance also requires signature validation against the raw request body.

Analytics events

Use:

begin_checkout → payment starts

purchase → backend confirms captured payment

refund → refund is processed

These are GA4’s recommended event names for checkout, purchase and refund actions.

Target

3–15 verified paid bookings per day

That target must be limited by:

Active sitter capacity

Service time slots

Backup coverage

Support staffing

Report-review capacity

6. Completed-booking rate

Formula

Bookings reaching SERVICE_COMPLETED

÷

confirmed bookings whose scheduled service time has passed

× 100

Do not include future bookings in the denominator.

Target

90% minimum

95% preferred

Track non-completion reasons separately:

CUSTOMER_CANCELLED

SITTER_CANCELLED

SITTER_NO_SHOW

CUSTOMER_NO_SHOW

PET_UNWELL

NO_REPLACEMENT

SAFETY_CANCELLATION

WEATHER

INCIDENT

A 92% completion rate driven by customer cancellations is operationally different from the same rate caused by sitter no-shows.

7. Report Card completion

Correct metric

Measure delivered reports, not merely sitter drafts.

Formula

Report Cards delivered to customers

÷

completed services

× 100

Target

95% minimum

100% desired

The dashboard should distinguish:

DRAFT

SUBMITTED

RETURNED_FOR_CORRECTION

ADMIN_REVIEW_REQUIRED

DELIVERED

OVERDUE

Alert rule

Create an alert when:

Dog-walk report is not submitted within 15 minutes

or

not delivered within 30 minutes

These are recommended internal service levels and should be adjusted after observing real operations.

8. Customer rating

Target

4.5+/5

But always show the rating with:

Number of reviews

Review response rate

Rating distribution

Service type

Area

Sitter

Complaint rate

Do not approve Phase 6 because the platform has a 5.0 average from four reviews.

Recommended meaningful sample

At least 25 legitimate completed-booking reviews

A rating of 4.4 from 80 reviews may provide stronger evidence than 5.0 from five reviews.

9. Repeat customer rate

Correct formula

Customers completing a second paid service

÷

customers eligible to repeat within the selected window

× 100

Recommended window:

Within 30 days after first completed service

Do not count a customer whose first booking was yesterday as a failed repeat customer.

Track the retention ladder

Would book again

↓

Repeat CTA clicked

↓

Second booking requested

↓

Second payment captured

↓

Second service completed

↓

Five- or ten-walk plan purchased

The strongest evidence is the second completed paid service, not a statement of interest.

Target

25–35% among eligible customers

10. Sitter no-show and reliability

No-show rate

Confirmed bookings where sitter did not attend

÷

confirmed sitter bookings due

× 100

Target:

Below 5%

Preferred: 0–2%

Overall sitter reliability

Do not use one vague score.

Combine:

On-time rate

Accepted-booking completion

Sitter cancellation rate

No-show rate

Report submission

Customer rating

Complaint history

Incident history

Recommended Phase 6 reliability gate

At least 90% of due assignments completed correctly

Also require:

No-show below 5%

Reports at least 95%

No unresolved serious safety restriction

11. Refund and dispute rate

Formula

Paid bookings with a refund or formal dispute

÷

total paid bookings

× 100

Target

Below 5%

Separate reasons:

CUSTOMER_PLAN_CHANGED

PET_UNWELL

SITTER_UNAVAILABLE

NO_REPLACEMENT

QUALITY_FAILURE

PAYMENT_DUPLICATE

SAFETY_CANCELLATION

GOODWILL

Customer-requested cancellations should not be analysed in the same category as service-quality refunds.

12. Support response time

Do not use only an average. A few extremely slow responses can be hidden by many fast ones.

Measure:

Median first response

P90 first response

Maximum response

Resolution time

Active-service target

Median: under 5 minutes

P90: under 10 minutes

Other categories

### Table 69

| Category | Target |
| --- | --- |
| Active safety emergency | Immediate escalation |
| Active service issue | P90 under 10 minutes |
| Upcoming booking question | Under 30 minutes |
| Payment issue | Initial response under 15 minutes |
| Refund/cancellation | Same operating day |
| General enquiry | Same day or next business day |

The under-ten-minute target is achievable only when a named support owner is on duty whenever a service is active.

13. Revenue and payment reconciliation

Track these separately:

Gross booking value

Captured customer payments

Completed-service revenue

Refunds

Net collected amount

Sitter payouts

Provider fees

Settlement received

Daily reconciliation

Compare:

PetSaathi payment records

Razorpay payment records

Razorpay refunds

Razorpay settlement report

Bank settlement

Razorpay provides settlement reconciliation details covering payments, refunds, transfers and adjustments and also provides daily or monthly settlement reconciliation reports.

Dashboard alerts

Captured payment without confirmed booking

Internal payment without provider match

Refund amount greater than refundable balance

Settlement difference

Duplicate provider payment ID

14. Gross margin and contribution

Gross margin

Customer payment

− sitter or host payout

= platform gross margin

Gross-margin percentage

Platform gross margin

÷ customer payment

× 100

Contribution

Gross margin

− payment cost

− direct support

− promotion subsidy

− referral commission

− media and notification costs

− variable refund or incident reserve

= contribution

Target

Gross margin: 25%+

Contribution: positive

A service may have 30% gross margin but still lose money after support, promotions and refunds.

The Phase 6 financial gate should therefore be:

The winning service has a credible and repeatable path to positive contribution after all direct variable costs.

15. Daily dashboard layout

Top row — live control

Services today

Active now

Starting in 30 minutes

Late

Unassigned

Payment review

Open incidents

Acquisition

Visitors

Qualified local visitors

CTA clicks

Form starts

Valid booking requests

Conversion

Approved requests

Sitters assigned

Payment started

Payment captured

Bookings confirmed

Fulfilment

Services due

Services started

Services completed

Reports delivered

Late starts

No-shows

Customer

Reviews

Average rating

Complaints

Repeat requests

Second completed bookings

Financial

Captured revenue

Refunds

Sitter payouts

Gross margin

Contribution

Settlement difference

Reliability

Critical bugs

Webhook failures

Notification failures

Upload failures

Support P90

16. Dashboard status system

Use Green, Amber and Red states.

Green

Target achieved

No immediate action required

Amber

Metric near failure threshold

Named owner and corrective action required

Red

Immediate intervention or booking-cap reduction required

Example

### Table 70

| Metric | Green | Amber | Red |
| --- | --- | --- | --- |
| Assignment success | ≥90% | 80–89% | <80% |
| Completion | ≥90% | 85–89% | <85% |
| Report delivery | ≥95% | 90–94% | <90% |
| Sitter no-show | <3% | 3–5% | >5% |
| Refund/dispute | <3% | 3–5% | >5% |
| Active support P90 | <10 min | 10–15 min | >15 min |
| Critical bugs | 0 | — | 1+ |

Hard-stop alerts

Pause new bookings when:

Cross-user data access occurs

Duplicate charges occur

Captured payments cannot be reconciled

Serious incident remains uncontrolled

No eligible sitter capacity remains

Report delivery repeatedly fails

Backup capacity is exhausted

Google’s SRE guidance uses error budgets as a mechanism for stopping releases and prioritising reliability when service objectives are missed.

17. Improved Phase 5 final report

Phase 5 Controlled Launch Report

A. Project details

Project name:

Release version:

City:

Primary launch area:

Secondary launch area:

Launch duration:

Hero service:

Secondary service:

Active sitter count:

Peak active capacity:

B. Acquisition

Website visitors:

Qualified local visitors:

Booking CTA clicks:

Booking-form starts:

Valid booking requests:

Acquisition channels tested:

Best acquisition channel:

Qualified-lead cost:

Customer-acquisition cost:

C. Booking funnel

Requests submitted:

Requests approved:

Sitters assigned:

Payment attempts:

Captured payments:

Confirmed bookings:

Completed bookings:

Cancelled bookings:

No-shows:

D. Service quality

Completion rate:

Report Card delivery:

Reviews:

Average rating:

Complaint rate:

Refund/dispute rate:

Repeat customer rate:

Same-sitter requests:

E. Area analysis

Best area:

Best society cluster:

Paid bookings per area:

Median sitter travel:

Median assignment time:

Repeat rate by area:

Contribution by area:

F. Service analysis

Top service:

Paid bookings by service:

Average order value:

Completion by service:

Repeat rate by service:

Incident rate:

Contribution by service:

G. Sitter analysis

Active sitters:

On-time rate:

Offer acceptance:

Cancellation rate:

No-show rate:

Report completion:

Best-performing sitter type:

Restricted sitters:

Additional supply required:

H. Financial analysis

Gross booking value:

Captured revenue:

Refunds:

Net collected:

Sitter payouts:

Payment costs:

Referral costs:

Promotion costs:

Gross margin:

Contribution:

Settlement difference:

I. Operations and support

Support cases:

Median first response:

P90 first response:

Top customer objection:

Top operational issue:

Replacement bookings:

Report backlog:

J. Safety and technology

Critical incidents:

Open incidents:

Severity 0 defects:

Severity 1 defects:

Payment mismatches:

Webhook failures:

Backup restore result:

K. Product stability

Use current Core Web Vitals thresholds at the 75th percentile:

LCP ≤ 2.5 seconds

INP ≤ 200 milliseconds

CLS ≤ 0.1

These are Google’s current “good” thresholds and should be measured separately for mobile and desktop.

L. Decision

MOVE_TO_PHASE_6

EXTEND_CONTROLLED_LAUNCH

REPEAT_LAUNCH_IN_CURRENT_AREA

CHANGE_OR_REDUCE_AREA

FIX_OPERATIONS

FIX_MVP

PAUSE_LAUNCH

18. Phase 6 go/no-go criteria

Volume

### Table 71

| Requirement | Target |
| --- | --- |
| Verified paid bookings | 100 minimum preferred |
| Strong pilot evidence | 150–300 |
| Completed-booking sample | Operationally meaningful |

The upper target of 300 should remain a stretch target. It must not be pursued by weakening safety or overloading sitters.

Service quality

### Table 72

| Requirement | Gate |
| --- | --- |
| Booking completion | 90%+ |
| Report delivery | 95%+ |
| Average rating | Around 4.5+ with meaningful sample |
| Sitter reliability | 90%+ |
| Sitter no-show | Below 5% |
| Refund/dispute rate | Below 5% |

Retention

Repeat customer rate:

25–35% among customers eligible to repeat

Also inspect:

Third booking rate

Same-sitter continuity

Pack-credit usage

Plan refunds

Repeat contribution

Financial viability

Required:

Winning service has positive contribution

CAC is known by channel

Refund exposure is understood

Sitter payout works reliably

Provider settlements reconcile

“Revenue increased” is not sufficient.

Market evidence

Required:

Best area identified

Best service identified

Best channel identified

Primary customer objection identified

Operational bottleneck identified

Product and technical stability

Required:

Open Severity 0 defects = 0

Open Severity 1 defects = 0

Known cross-user access issues = 0

Unresolved material payment mismatches = 0

Backup restore = passed

Webhook processing = stable

Monitoring alerts = tested

Safety

Required:

Unresolved critical incidents = 0

Emergency process tested

Unsupported Red-risk cases blocked

Long-distance matching controlled

Service evidence available

Individual behaviour and history—not breed alone—should inform dog-risk decisions.

19. Go/no-go outcomes

Move to Phase 6

Choose this when:

At least 100 verified paid bookings provide meaningful evidence

Repeat demand is proven

Quality thresholds pass

Unit economics show a positive path

No hard blocker exists

Extend Phase 5

Choose this when:

Customer feedback is strong

Booking volume is still too small

Repeat cohorts need more time

Best channel or area remains uncertain

Recommended extension:

14–30 additional days

without major geographic expansion

Repeat the launch

Choose this when:

Initial execution was disrupted by technical or staffing problems

The product is now repaired

Demand evidence remains potentially valid

Change area

Choose this when:

Demand is weak in the current area

Sitter travel is excessive

Another nearby cluster has stronger qualified demand

The existing area cannot achieve local density

Fix MVP

Choose this when:

Payment, assignment, reports or permissions are unreliable

Funnel abandonment is caused by product defects

Operations cannot safely use the dashboard

Pause

Choose this when:

Safety remains uncontrolled

Payment integrity is uncertain

No sustainable demand exists

Unit economics are materially negative

Sitter supply is inadequate

20. Approval of the five Phase 5 rules

### Table 73

| Rule | Decision | Final qualification |
| --- | --- | --- |
| Launch only 2–3 areas | Approved with modification | Start with 1–2; add third only after a gate |
| Convert trials into 5/10-walk plans | Approved with modification | Mandatory repeat offer; package purchase optional |
| Daily launch dashboard | Fully approved | P0 launch requirement |
| Society-first launch channel | Approved | Default density channel, not the only channel |
| Daily booking cap | Fully approved | Must be based on actual sitter/support capacity |

21. Final recommended Phase 5 configuration

One city

One primary area

One nearby secondary area

One hero service

Admin-controlled matching

Verified prepaid confirmation

Capacity-based daily booking cap

Live service monitoring

Private service evidence

Report Cards

Same-sitter repeat flow

Starter plans

Society-first marketing

Daily operational dashboard

About the proposed 20–30 sitters

Twenty to thirty verified profiles may be a useful overall roster target, but headcount alone does not prove capacity.

Track:

Verified profiles

Active sitters today

Active sitters by area

Active sitters by time slot

Backup-only capacity

Service and risk permissions

Ten verified sitters who are unavailable during peak hours provide less useful capacity than five verified sitters consistently available within one micro-area.

Final Phase 5 win condition

Real customers repeatedly complete the entire journey: request, sitter assignment, verified payment, safe service, Report Card, positive feedback and another paid booking.

Simple explanation for professor

“PetSaathi’s Phase 5 dashboard will track the controlled launch every day.

The dashboard will contain three parts: live operations, daily business performance and seven- or thirty-day trends. Live operations will show unassigned bookings, active services, late sitters, payment problems, missing Report Cards and incidents.

Business metrics will include qualified website visitors, booking requests, verified paid bookings, completed services, customer ratings, repeat bookings, refunds, revenue and margins.

Website traffic will not be treated as success by itself. The traffic must come from areas PetSaathi serves and must convert into paid, completed bookings.

A paid booking will count only after Razorpay payment is captured and verified by the backend. Booking completion will be calculated from confirmed bookings whose service time has already passed. Report Card completion will be calculated from reports actually delivered to customers.

The repeat rate will use only customers who have had enough time to book again. A customer who completed their first service yesterday will not be counted as a failed repeat customer.

PetSaathi will track gross margin and contribution separately. Gross margin is customer payment minus sitter payout. Contribution also removes direct payment, support, promotion, referral and refund costs.

At the end of Phase 5, the project report will compare acquisition channels, areas, services, sitters, revenue, margins, complaints, incidents, technical stability and repeat demand.

PetSaathi should move to Phase 6 only when it has meaningful paid-booking volume, at least ninety percent service completion and sitter reliability, ninety-five percent Report Card delivery, low no-shows and disputes, repeat customers, positive unit economics and a stable MVP.

I approve the five main Phase 5 rules. PetSaathi should launch in a maximum of one or two areas initially, offer repeat plans after successful trials, use a mandatory daily dashboard, prioritise society-based acquisition and enforce a daily capacity-based booking limit.”

PetSaathi Phase 6 — Safety, Tracking, Automation and Reliability System 🛡️📍🐾

Executive decision

A 45-day Phase 6 is the correct recommendation after PetSaathi has completed approximately 100 or more verified paid bookings and identified its strongest service, area and sitter profile.

However, safety-critical fixes should never wait for the booking threshold. A serious gap involving pet escape, payment integrity, unauthorised data access or emergency handling must be corrected immediately.

The Phase 6 operating principle should be:

Automate routine work, preserve human control over safety decisions, and increase booking capacity only when reliability remains inside defined limits.

The progression is:

Phase 5

Controlled human-operated launch

↓

Phase 6

Measured safety and reliability system

↓

Later phases

Subscriptions, additional areas and larger booking volume

Google’s SRE guidance recommends defining service objectives, monitoring reliability and using error budgets to slow or halt feature rollout when operational quality falls below the agreed level. That approach fits PetSaathi particularly well because a service may be technically online while still failing customers operationally.

1. What Phase 6 must achieve

Phase 6 should convert PetSaathi from a founder-operated marketplace into a controlled operating system capable of handling more bookings without losing:

Pet safety

Sitter reliability

Customer visibility

Payment integrity

Report quality

Support responsiveness

Incident traceability

Data privacy

The system should answer these questions automatically or operationally:

Is the booking safe and serviceable?

Is the assigned sitter still eligible and available?

Did the sitter arrive and start the correct service?

Is the walk or care visit progressing normally?

Has the customer received important updates?

Is a backup sitter available if the primary sitter fails?

Has the Report Card been submitted on time?

Does an issue require support or safety escalation?

Is the platform staying within its reliability targets?

Should new bookings be slowed or paused?

2. Correct Phase 6 scope

Build during Phase 6

Service-specific safety controls

Incident-management system

Tracking-session system

Sitter check-in and checkout

Automated booking-state transitions

Backup and replacement sitter workflow

Notification orchestration

Report Card automation

Sitter reliability scoring

Operational SLO dashboard

Audit logs

Privacy and retention controls

Load and failure testing

Do not build yet

Autonomous AI sitter assignment

AI pet-risk approval or rejection

Medical diagnosis

Automatic incident resolution

Nationwide expansion

Complex insurance engine

Public customer-sitter chat platform

Unlimited subscriptions

Always-on sitter tracking

Full native customer applications unless justified

Automation should remove repetitive administrative work, not remove human judgment from Red-risk pets, medical concerns, serious complaints or emergency decisions.

3. Recommended Phase 6 architecture

Customer PWA

│

├── Booking status

├── Sitter updates

├── Private tracking view

├── Report Card

└── Emergency/support action

Sitter application or companion interface

│

├── Assignment acceptance

├── Check-in

├── Tracking session

├── Service updates

├── Check-out

└── Report submission

Admin operations dashboard

│

├── Live booking map

├── Late/missing sitter queue

├── Replacement workflow

├── Incident control

├── Notification failures

└── Reliability dashboard

Backend services

├── Booking workflow engine

├── Tracking service

├── Notification outbox

├── Incident service

├── Report service

├── Audit log

└── Reliability metrics

The server must remain authoritative for booking states, payments, assignments, incidents and completed-service evidence.

4. Phase 6 entry gate

A 45-day automation phase is appropriate when most of the following are true:

### Table 74

| Requirement | Recommended entry evidence |
| --- | --- |
| Verified paid bookings | 100+ preferred |
| Booking completion | 90%+ |
| Report Card delivery | 95%+ |
| Sitter assignment success | 90%+ |
| Repeat customer rate | 25%+ eligible cohort |
| Unresolved critical defects | 0 |
| Unresolved serious incidents | 0 |
| Best service identified | Yes |
| Best area identified | Yes |
| Daily operations process | Stable |
| Payment reconciliation | Stable |

Do not automate an unclear or unreliable workflow. Automation will amplify the defects already present in the manual process.

5. Safety system

5.1 Pre-booking safety gate

Before matching begins, the system should check:

Pet Profile complete?

Current-health declaration complete?

Service-specific assessment active?

Required vaccination evidence available?

Emergency contact available?

Veterinary contact available?

Required handling controls defined?

Possible results:

ELIGIBLE_STANDARD

ELIGIBLE_WITH_CONTROLS

ADMIN_REVIEW_REQUIRED

MORE_INFORMATION_REQUIRED

SERVICE_NOT_SUPPORTED

The software may generate deterministic warning flags, but an authorised administrator should retain the final decision for Yellow and Red cases.

5.2 Pre-service safety confirmation

Before each service, ask whether anything has changed:

Vomiting or diarrhoea

Breathing difficulty

Injury

Seizure activity

Unusual aggression

Refusal of food or water

New medication

Recent bite or escape

Possible infectious illness

A stored profile from weeks earlier is not sufficient for every future booking.

5.3 Emergency-authorisation record

For sitting and boarding, store:

Primary owner contact

Alternative emergency contact

Regular veterinarian

Emergency hospital

Who may authorise veterinary care

Optional spending-authorisation limit

Transport instructions

Relevant insurance or protection information, if applicable

AVMA guidance recommends preparing veterinarian and emergency-hospital contacts and notes that sitters, boarding providers and veterinary clinics commonly use emergency-care authorisation forms.

6. Incident-management system

Incident severity

Severity 0 — Immediate life or security emergency

Examples:

Pet missing

Serious injury

Breathing emergency

Major data breach

Immediate danger to a person

Expected action:

Immediate phone escalation

Emergency professional contacted

Operations command activated

New bookings may be paused

Severity 1 — Serious service safety incident

Examples:

Bite

Escape recovered

Medication error

Wrong pet or instructions

Serious sitter misconduct allegation

Severity 2 — Material operational failure

Examples:

Sitter no-show

Major delay

Incorrect service completion

Customer locked out

Missing required evidence

Severity 3 — Routine quality issue

Examples:

Weak Report Card

Minor communication problem

Non-critical late arrival

Incident workflow

Incident reported

↓

Severity assigned

↓

Incident commander or owner assigned

↓

Immediate customer/pet action recorded

↓

Booking and payout hold applied if required

↓

Evidence preserved

↓

Investigation completed

↓

Customer and sitter outcome recorded

↓

Pet/sitter reassessment triggered

↓

Corrective action verified

↓

Incident closed

Incident roles

Incident commander

Customer communication owner

Sitter communication owner

Safety reviewer

Technical investigator

Finance/refund reviewer

Final closure authority

The person handling customer communication should not simultaneously be expected to perform every investigation task during a serious event.

7. Live tracking system

7.1 Correct tracking scope

Phase 6 tracking should be limited to the authorised service window:

Tracking available shortly before service

↓

Tracking starts when sitter begins service

↓

Route points collected during authorised walk

↓

Tracking ends at service completion

↓

Customer access expires according to policy

Do not track sitters continuously between bookings or outside service time.

Location data is sensitive. Android and Apple require explicit location permissions, user-visible explanations and platform-specific background capabilities. Android advises requesting location only when the user interacts with the relevant feature and says background access should be used only when essential to core functionality. Apple similarly treats location as sensitive information controlled by the device owner.

7.2 PWA limitation

PetSaathi’s customer product can remain a PWA, but a dependable continuous background-tracking experience may require a native sitter companion application or native wrapper.

This is an engineering inference from the platform restrictions:

Android limits background-location frequency and requires specific background or foreground-service permissions.

Apple requires background-location capabilities and explicit authorisation.

PWA push and foreground web features are possible, but reliable continuous background location is not uniformly equivalent to native tracking across devices.

Recommended Phase 6 product split

Customer:

Continue with mobile-first PWA

Sitter:

Evaluate native Android companion app first

or

use foreground tracking with clearly stated limitations

Because the initial market is likely Android-heavy, a focused sitter-side Android application may be more valuable than building complete native customer applications.

7.3 Tracking-session states

NOT_REQUIRED

READY

STARTING

ACTIVE

PAUSED

SIGNAL_LOST

COMPLETED

FAILED

ADMIN_REVIEW_REQUIRED

Tracking record

Store:

Tracking session ID

Booking ID

Assigned sitter

Start and end time

Start and end coordinates

Route-point timestamps

Accuracy reading

Distance calculated

Signal gaps

Device/battery information where appropriate

Tracking status

Failure reason

Customer view

Show:

Service started

Last update time

Approximate active route where approved

Walk duration

Temporary signal issue

Service completed

Avoid showing:

Sitter’s location before the authorised window

Sitter’s onward route after service

Other customers’ addresses

Permanent location history

7.4 Tracking failure fallback

The booking must not collapse merely because GPS is temporarily unavailable.

GPS signal lost

↓

Sitter receives warning

↓

Manual service update requested

↓

Operations notified after configured timeout

↓

Photo/checkpoint evidence collected

↓

Report marked with tracking exception

Possible fallback evidence:

Start and end check-in

Timestamped photo

Manual distance

Customer handover

Operations note

Do not falsely display a complete route when tracking data contains gaps.

8. Location privacy and retention

Location should be collected for a specific stated purpose:

To verify and support the delivery of an active pet-care service, provide authorised customer visibility and investigate service or safety issues.

Phase 6 should include:

Purpose-specific notice

Contextual permission request

Access limited to assigned booking participants

Short-lived customer viewing links

Role-restricted administrative access

Configurable retention

Audit logs

Deletion or anonymisation process

No location points in general marketing analytics

India’s DPDP Act and the final DPDP Rules establish the framework for processing digital personal data and were issued with staged commencement provisions. PetSaathi should design its location notices, access rules and retention programme for the full privacy model even where particular provisions are still being phased in.

A qualified Indian privacy professional should review the final production implementation.

9. Booking automation

Automate these actions

Pet Profile completeness checks

Service-area validation

Schedule validation

Sitter eligibility filtering

Conflict detection

Offer expiration

Payment-link generation

Payment-expiry handling

Booking reminders

Late-service alerts

Missing-report alerts

Repeat-booking suggestions

Notification retries

Keep these under human control

Red-risk approval

Serious medical concern

Bite or incident assessment

High-risk boarding approval

Major refund dispute

Sitter suspension

Incident closure

Emergency treatment decisions

Automated booking flow

Booking submitted

↓

System validates required information

↓

Objective flags generated

↓

Standard case:

eligible sitter pool created automatically

Yellow/Red case:

admin review queue

↓

Offers sent according to approved policy

↓

Sitter accepts

↓

Assignment validated transactionally

↓

Payment requested

↓

Payment verified

↓

Booking confirmed

Automation must not allow two active primary sitters or permit a cancelled booking to start.

10. Backup sitter system

Assignment roles

PRIMARY

BACKUP

REPLACEMENT

SUPERVISOR

Offer states

OFFERED

VIEWED

ACCEPTED

DECLINED

EXPIRED

ASSIGNED

REMOVED

COMPLETED

NO_SHOW

Backup flow

Primary sitter delayed or cancels

↓

Booking enters REPLACEMENT_REQUIRED

↓

Prequalified backup pool loaded

↓

Replacement offer sent

↓

First eligible acceptance locked

↓

Admin/customer approval applied as required

↓

Instructions released

↓

Booking reconfirmed

Important controls

Customer informed immediately

Replacement must meet the same or stronger eligibility rules

Original sitter remains in assignment history

Payment is not duplicated

New sitter receives current instructions

Replacement reason is audited

Backup metrics

Bookings requiring replacement

Replacement success rate

Median replacement time

Customer acceptance rate

Bookings cancelled after replacement failure

11. Sitter reliability system

Do not create one unexplained “reliability score.”

Use transparent components:

Offer-response rate

Acceptance rate

On-time rate

Completion rate

Cancellation rate

No-show rate

Report timeliness

Customer rating

Same-sitter requests

Complaint history

Incident history

Verification status

Suggested sitter states

ACTIVE

ACTIVE_WITH_COACHING

LIMITED

PROBATION

TEMPORARILY_PAUSED

SAFETY_REVIEW

SUSPENDED

ARCHIVED

Avoid unfair scoring

Do not penalise a sitter for declining:

Excessive distance

A scheduling conflict

An unsupported pet size

Risk outside their permission

Missing safety information

The system should distinguish a bad assignment offer from an unreliable sitter.

12. Notification system

Notification events

Customer

Booking received

More information required

Sitter assigned

Payment required

Payment confirmed

Service reminder

Sitter arriving

Service started

Service concern

Service completed

Report Card ready

Review requested

Replacement sitter proposed

Refund update

Sitter

New offer

Offer expiring

Assignment confirmed

Upcoming service reminder

Required check-in

Late-start warning

Report overdue

Replacement request

Verification expiring

Admin

Unassigned booking

Sitter cancellation

Late service

Tracking signal lost

Payment mismatch

Missing report

Safety concern

Incident opened

Notification architecture

Business event committed

↓

Notification placed in outbox

↓

Worker selects channel

↓

Push/WhatsApp/email sent

↓

Provider result recorded

↓

Retry or fallback applied

Do not send notifications directly inside the critical booking transaction.

Channels

Push notification

WhatsApp

Email

SMS for selected critical cases

Phone for safety emergency

Firebase Cloud Messaging supports cross-platform push delivery and provides delivery reporting, but message acceptance does not guarantee that every device receives every notification immediately. PetSaathi should track delivery and retain fallback channels for operationally critical events.

A push notification must never be the only mechanism for a pet emergency.

13. Report Card automation

Automatically populate

Scheduled service

Actual start time

Actual end time

Duration

Tracking distance where available

Sitter identity

Booking and pet

Uploaded media

Tracking exception

Check-in and checkout

Sitter must confirm

Food and water

Toilet update

Mood

Behaviour

Care tasks

Sitter notes

Concern flag

Pet safely handed over or secured

Automated validation

Service completed?

Required fields present?

Required media present or exception recorded?

Concern flag checked?

Times logically valid?

Tracking/session matched?

Report automation flow

Service ends

↓

Draft generated automatically

↓

Sitter reviews and completes care fields

↓

Validation runs

↓

Concern-free report delivered

or

Concern report enters admin review

Do not use AI to diagnose illness or rewrite serious safety information in a way that changes its meaning.

AI may later:

Summarise long notes

Correct grammar without altering facts

Identify missing fields

Highlight contradictions

14. Reliability system and SLOs

Phase 6 should introduce formal Service Level Objectives.

Suggested internal SLOs

### Table 75

| Reliability indicator | Phase 6 target |
| --- | --- |
| Valid booking transition success | 99.5%+ |
| Captured-payment reconciliation | 100% by daily close |
| Sitter assignment success | 95%+ approved requests |
| Confirmed-service completion | 95%+ |
| Report Card delivery | 98%+ |
| Active-service support P90 | Under 10 minutes |
| Critical notification workflow | 99% accepted by provider plus fallback |
| Replacement success | 80%+ where backup exists |
| Tracking session starts | 95%+ of eligible walks |
| Open Severity 0 incidents | 0 |
| Cross-user access incidents | 0 |

These are proposed PetSaathi targets, not industry standards. They should be revised after observing actual reliability and operating cost.

Error-budget policy

Example:

Report delivery SLO: 98%

Monthly eligible services: 1,000

Permitted failed/late reports: 20

If the error budget is exhausted:

Pause feature expansion

Stop increasing the booking cap

Fix report workflow

Review sitter behaviour

Improve monitoring

Resume only after stability returns

Google SRE specifically recommends using error budgets to balance feature delivery with reliability and to stop or slow launches when reliability targets are exceeded.

15. Operational dashboard

Live booking control

Starting soon

Active

Late

Tracking lost

Replacement required

Incident active

Overdue completion

Safety

Yellow/Red reviews

Current-health blocks

Open incidents

Emergency escalations

Pet reassessments

Sitter safety restrictions

Tracking

Tracking eligible

Sessions started

Active sessions

Signal gaps

Failed sessions

Manual fallbacks

Average route freshness

Sitter reliability

On-time rate

Completion

Cancellation

No-show

Report timeliness

Repeat requests

Restrictions

Notifications

Queued

Sent

Provider accepted

Delivered where available

Failed

Retrying

Fallback used

System reliability

Booking transition failures

Payment mismatch

Webhook backlog

Database errors

Upload failures

API latency

Open critical defects

SLO indicators should appear prominently and generate actionable alerts, rather than creating alarms for every low-impact technical event.

16. Security architecture

Phase 6 introduces more sensitive data:

Live sitter location

Customer address

Pet health and behaviour

Emergency contacts

Incident evidence

Private service media

Sitter performance records

Required controls

Authentication for every user

Deny-by-default authorisation

Booking ownership/assignment checks

Role-restricted medical information

Safety-admin-only incident access

Private file storage

Expiring media URLs

Audit history

Sensitive-data redaction in logs

Location-data access logging

Administrative MFA

Reauthentication for serious actions

OWASP recommends least privilege, deny-by-default authorisation and access checks at every protected API endpoint. It also recommends security logging while excluding credentials, tokens and sensitive personal information.

17. 45-day Phase 6 execution plan

Days 1–5 — Reliability baseline

Work

Freeze Phase 6 scope

Define SLOs

Define error budgets

Map all current manual workflows

Review incidents and complaints from Phase 5

Define privacy requirements

Define tracking consent and retention

Output

Phase 6 requirements document

SLO and error-budget policy

Safety gap register

Data-flow map

Days 6–10 — Safety and incident system

Work

Create severity framework

Build incident table and dashboard

Add emergency-authorisation records

Add booking/payout holds

Add pet and sitter reassessment triggers

Run emergency simulations

Output

Incident-management module

Emergency workflow

Safety audit history

Incident drill results

Days 11–18 — Tracking MVP

Work

Build check-in/check-out

Create tracking-session records

Add sitter permissions

Add customer live-status view

Add route and signal-gap handling

Add manual fallback

Test battery and device behaviour

Output

Controlled tracking MVP

Tracking privacy notice

Fallback process

Device test matrix

Days 19–24 — Notification automation

Work

Implement notification outbox

Add push notifications

Add WhatsApp/email fallbacks

Add retries and deduplication

Record provider results

Configure critical escalation

Output

Notification service

Delivery dashboard

Fallback logic

Template library

Days 25–30 — Booking and replacement automation

Work

Automate completeness checks

Build sitter eligibility filters

Add offer expiration

Add transactional assignment

Build backup pool

Build replacement workflow

Protect payment and booking transitions

Output

Automated standard matching workflow

Backup sitter system

Replacement dashboard

Transition audit history

Days 31–35 — Report Card automation

Work

Generate report drafts

Import tracking times and distance

Validate required fields

Add overdue reminders

Route concern reports to safety review

Version report amendments

Output

Automated Report Card workflow

Missing-report alerts

Concern escalation

Version history

Days 36–40 — Reliability dashboards and load testing

Work

Build live operational dashboard

Add SLO indicators

Add error-budget views

Test concurrent booking assignment

Test notification spikes

Test payment/webhook duplication

Test location-session load

Output

Operations dashboard

Reliability dashboard

Load-test results

Capacity recommendation

Days 41–45 — Controlled rollout and drills

Work

Release to a small sitter cohort

Enable tracking for selected bookings

Monitor reliability daily

Run sitter cancellation drill

Run lost-pet simulation

Run provider-notification failure drill

Correct defects

Produce Phase 6 report

Output

Production-tested reliability system

Incident drill evidence

Tracking performance report

Phase 7 readiness decision

18. Fast versus deep versions

15–20 day version

Suitable only for:

Check-in/check-out

Basic tracking while app is foregrounded

Incident module

Automated reminders

Simple backup-sitter queue

It is not enough for a deeply tested background-location and high-volume reliability system.

30–45 day version

Recommended for:

Controlled tracking

Incident workflows

Notification outbox

Booking automation

Replacement workflow

SLO dashboard

Report automation

60–75 day version

Recommended before aggressive multi-city growth when Phase 6 includes:

Native sitter application

Background tracking across devices

Advanced route quality

Larger-scale notification infrastructure

Disaster recovery

Security assessment

High-volume load testing

Multiple operational teams

19. Phase 6 success metrics

### Table 76

| Metric | Recommended exit target |
| --- | --- |
| Tracking sessions successfully started | 95%+ |
| Eligible walks with usable tracking or fallback evidence | 98%+ |
| Assignment success | 95%+ |
| Replacement success where backup exists | 80%+ |
| Confirmed booking completion | 95%+ |
| Report Card delivery | 98%+ |
| Sitter no-show | Below 3% preferred |
| Active-service support P90 | Under 10 minutes |
| Critical notification fallback tested | Yes |
| Incident drill completion | 100% planned drills |
| Captured-payment reconciliation | 100% daily |
| Cross-user access defects | 0 |
| Open Severity 0/1 defects | 0 |
| Error-budget policy active | Yes |

20. Phase 6 final report format

Phase 6 Safety and Reliability Report

Project:

Release version:

City and areas:

Phase duration:

Bookings processed:

Tracking-eligible bookings:

Tracking sessions completed:

Manual tracking fallbacks:

Safety

Incidents by severity:

Emergency escalations:

Pet reassessments:

Sitter restrictions:

Incident response time:

Open incidents:

Automation

Bookings automatically validated:

Standard assignments automated:

Manual reviews:

Replacement requests:

Replacement success:

Invalid transitions blocked:

Tracking

Session-start success:

Average signal gaps:

Tracking failures:

Battery/device issues:

Customer tracking views:

Privacy complaints:

Notifications

Notifications queued:

Provider accepted:

Delivered where measurable:

Failures:

Retries:

Fallbacks:

Reports

Automatically generated drafts:

Reports delivered:

Overdue reports:

Reports requiring safety review:

Reliability

SLOs:

Error-budget consumption:

Payment mismatches:

Webhook failures:

Critical defects:

Load-test result:

Decision

READY_FOR_HIGHER_VOLUME

EXTEND_PHASE_6

FIX_TRACKING

FIX_AUTOMATION

FIX_SITTER_RELIABILITY

FIX_SAFETY_WORKFLOW

PAUSE_EXPANSION

21. Phase 6 go/no-go rule

Move forward only when:

Safety workflows have been tested

Incident ownership is clear

Tracking has transparent limitations and fallbacks

Booking automation cannot bypass risk controls

Backup replacement works

Critical notifications have fallbacks

Reports are delivered reliably

SLOs remain inside their error budgets

Location and medical data are access-controlled

No critical payment or security defect remains

Do not move forward simply because booking demand has increased.

Final recommendation

Approved

Phase 6 duration: 45 days

Entry point: approximately 100+ paid bookings

Primary objective: safety and reliability

Customer platform: continue PWA

Sitter tracking: evaluate native Android companion app

Matching: automate standard cases only

High-risk decisions: human controlled

Expansion: paused until SLOs pass

Final operating principle

Phase 6 succeeds when PetSaathi can absorb more bookings without increasing safety incidents, sitter failures, missing updates, payment mismatches or support chaos.

Simple explanation for professor

“Phase 6 will convert PetSaathi from a manually controlled launch into a safer and more reliable operating system.

The first improvement will be safety. Every booking will pass service-specific pet-risk, health, emergency-contact and sitter-capability checks. Serious cases will continue to receive human review.

The second improvement will be live service tracking. Tracking will begin only during the authorised service and stop when the service ends. Customers will see service status and route information where available. PetSaathi will not track sitters continuously outside bookings. Because continuous background tracking has mobile-platform restrictions, a native sitter-side application may be required while the customer product can remain a PWA.

The third improvement will be booking automation. The software will validate forms, service areas, schedules and standard sitter eligibility. It will send offers and reminders automatically, but Red-risk pets, medical concerns and incidents will remain under authorised human control.

The fourth improvement will be a backup-sitter system. When a sitter cancels or becomes unavailable, the booking will enter a replacement workflow and only another eligible sitter can be assigned.

The fifth improvement will be automated notifications and Report Cards. The system will create report drafts using start time, end time, duration and tracking data, while the sitter confirms food, water, behaviour, mood and concerns.

PetSaathi will also introduce reliability targets for assignment, service completion, reports, notifications, tracking and support. When performance falls below the target, booking growth and feature expansion will pause until reliability is restored.

The recommended duration is forty-five days after approximately one hundred paid bookings. At the end of Phase 6, PetSaathi should be able to support higher booking volume without increasing incidents, sitter no-shows, missing reports, payment errors or customer-support problems.”

PetSaathi Phase 6 — Success Targets and Phase 7 Readiness 🛡️📊🐾

Executive decision

Your Phase 6 targets are strong and should be approved as internal reliability objectives, with four corrections:

Measure percentiles and cohorts—not only averages.

Separate incident containment, service recovery, and root-cause closure.

Define automation coverage only for safe, standard bookings.

Measure workload reduction using actual staff time per booking, not perceived effort.

Google’s SRE guidance recommends using clearly defined Service Level Indicators and Objectives, then comparing actual performance against an error budget to decide whether expansion should continue or reliability work should take priority.

The Phase 6 decision loop should be:

Measure each reliability indicator

↓

Compare actual performance with target

↓

Check error-budget consumption

↓

Identify safety or reliability blockers

↓

Fix failed workflows

↓

Run controlled validation again

↓

Approve or delay Phase 7

1. Corrected Phase 6 targets

### Table 77

| Metric | Recommended Phase 7 gate |
| --- | --- |
| Report Card delivery | 98%+ |
| Sitter on-time rate | 95%+ |
| Tracking-session success | 90%+ of eligible services |
| Usable tracking or fallback evidence | 98%+ |
| Backup coverage | 80%+ of priority bookings |
| Active-service support response | P90 under 10 minutes; median under 5 |
| Refund/dispute rate | Below 5%; preferred below 3% |
| Critical incident containment | Immediate to under 30 minutes, severity-dependent |
| Routine incident operational resolution | Same day where feasible |
| Root-cause and corrective-action closure | Separate deadline based on severity |
| Repeat customer rate | 35%+ of eligible cohort |
| Customer rating | 4.6+/5 with meaningful sample |
| Standard booking automation coverage | 60–70% |
| Manual operational workload | 30–50% reduction from Phase 5 baseline |
| Open Severity 0/1 defects | 0 |
| Unresolved critical incidents | 0 |

These are recommended PetSaathi operating targets, not universal pet-care industry benchmarks.

2. Report Card completion — 98%+

Correct metric

Do not measure only whether the sitter clicked “Submit.”

Measure:

Report Cards delivered successfully

÷

Completed services requiring a Report Card

× 100

A report counts as delivered only when:

Required fields are complete

Media or an approved exception exists

Report validation passes

Any safety concern has been routed correctly

Customer access is available

Delivery status is recorded

Target

Minimum Phase 7 gate: 98%

Desired operating standard: 99%+

Separate statuses

DRAFT

AUTO_GENERATED

SITTER_COMPLETED

ADMIN_REVIEW_REQUIRED

RETURNED_FOR_CORRECTION

DELIVERED

OVERDUE

FAILED

Why 98% is appropriate

Phase 6 should automate report creation using booking, timing and tracking data, while the sitter confirms care observations. This should substantially improve reliability compared with Phase 5’s 95% target.

Error-budget example

With 1,000 completed services:

98% target

= maximum 20 late or missing reports

If more than 20 reports fail during the measurement period, the error budget is exhausted and report-related expansion should pause. Google SRE recommends using error budgets to make objective decisions about when to continue releasing features and when to prioritise reliability.

Track failure reasons

SITTER_DID_NOT_SUBMIT

MEDIA_UPLOAD_FAILED

VALIDATION_FAILED

SAFETY_REVIEW_PENDING

NOTIFICATION_FAILED

CUSTOMER_ACCESS_FAILED

SYSTEM_ERROR

A high submission rate with poor customer delivery is not success.

3. Sitter on-time rate — 95%+

Formula

Services started within the approved start window

÷

Confirmed services due

× 100

Define the window explicitly. For example:

Up to 10 minutes early

and no more than 5 minutes late

Target

Phase 7 gate: 95%+

Warning zone: 90–94.9%

Failure zone: below 90%

Track separately

Arrival time

Actual service start

Customer-caused delay

Society gate delay

Travel delay

Previous booking overrun

Sitter late without notice

Do not hide delay causes

A service should not be recorded as on time simply because the sitter pressed “Start” remotely.

Recommended controls:

Check-in proximity where authorised

Customer handover confirmation

Device timestamp

Admin exception record

Impossible-location validation

Sitter-level interpretation

Do not suspend a sitter based on one delay.

Review:

Number of completed bookings

Late-start frequency

Delay severity

Customer communication

Travel pattern

Society-entry problems

Repeated route scheduling issues

4. Active-service tracking — 90%+

Important definition

Tracking should apply only to services for which live tracking is required, mainly dog walking.

Do not include:

Home sitting where route tracking is irrelevant

Boarding

Services with a documented customer opt-out

Approved device-failure exceptions

Services where tracking would create a safety problem

Primary formula

Eligible services with tracking session successfully started

÷

All tracking-eligible services

× 100

Target

Tracking-session start: 90%+

However, session-start alone is not enough.

Use a second reliability metric:

Eligible services with usable route data

or approved fallback evidence

÷

Tracking-eligible services

× 100

Recommended target:

Usable tracking or fallback evidence: 98%+

Tracking states

READY

STARTING

ACTIVE

SIGNAL_WEAK

SIGNAL_LOST

FALLBACK_REQUIRED

COMPLETED

FAILED

ADMIN_REVIEW

Why fallback is mandatory

Android limits how frequently background applications can obtain location updates, and background location requires specific permissions and privacy controls. Device settings, battery optimisation and network conditions can therefore interrupt tracking even when the sitter follows the correct process.

Fallback evidence can include:

Verified start and end check-in

Timestamped private photo

Manual distance

Customer handover confirmation

Admin tracking-exception note

Do not display a continuous route when route data contains major gaps.

5. Backup sitter coverage — 80%+

Clarify the denominator

It may not be economically necessary to reserve a named backup for every low-risk booking.

Measure backup coverage primarily for priority bookings, such as:

Same-day services

High-value sitting

Yellow-risk care

First-time customer bookings

Recurring plan commitments

Services during peak periods

Bookings where cancellation would create a serious customer impact

Formula

Priority confirmed bookings with

at least one eligible replacement candidate

÷

all priority confirmed bookings

× 100

Target

80%+ priority-booking coverage

For high-risk or business-critical bookings, use:

100% backup coverage required

Coverage should mean more than a nearby profile

An eligible backup must:

Be active

Hold the correct service permission

Match pet size and risk requirements

Be within travel limits

Have no schedule conflict

Have current verification

Be reachable during the replacement window

Replacement metrics

Track:

Bookings requiring replacement

Eligible backups found

Backup offers accepted

Replacement successfully assigned

Customer accepted replacement

Service completed after replacement

Median replacement time

Recommended additional target:

Replacement success when eligible backup exists: 80%+

6. Customer-support response — under 5–10 minutes

Do not use only average response time

Use:

Median first-response time

P90 first-response time

Maximum response time

Time to operational action

Time to resolution

Averages can hide a small number of dangerously slow responses.

Recommended active-service objectives

Median first response: under 5 minutes

P90 first response: under 10 minutes

Critical safety escalation: immediate

Support severity model

### Table 78

| Priority | Example | First-response target |
| --- | --- | --- |
| P0 | Pet missing, serious injury, immediate danger | Immediate phone escalation |
| P1 | Sitter absent, pet concern during service | Median <5 min, P90 <10 min |
| P2 | Upcoming booking problem | Under 30 min |
| P3 | Payment reconciliation | Initial response under 15 min |
| P4 | Refund or cancellation | Same operating day |
| P5 | General question | Same day or next business day |

This target requires a named on-call or duty owner whenever a service is active. Google defines on-call as being available during a specified period and ready to diagnose, mitigate, fix or escalate incidents with the appropriate urgency.

Measure response and action separately

Example:

Customer message acknowledged in 3 minutes

but replacement started after 35 minutes

This should not be considered fully successful.

Track:

First acknowledgement

Owner assigned

Operational action initiated

Customer updated

Issue resolved

7. Refund and dispute rate — below 3–5%

Formula

Paid bookings with refund,

charge dispute or substantiated financial complaint

÷

all paid bookings

× 100

Targets

Maximum Phase 7 gate: below 5%

Preferred mature target: below 3%

Separate the causes

CUSTOMER_CANCELLED

PET_UNWELL

SITTER_UNAVAILABLE

NO_REPLACEMENT

SERVICE_QUALITY_FAILURE

PAYMENT_DUPLICATE

SAFETY_CANCELLATION

TECHNICAL_PAYMENT_ERROR

GOODWILL_COMPENSATION

FORMAL_PAYMENT_DISPUTE

A refund caused by a customer’s travel cancellation should not be interpreted like a refund caused by a sitter no-show.

Additional financial indicators

Track:

Full refunds

Partial refunds

Refund amount as percentage of revenue

Payment disputes

Duplicate payment cases

Refund processing time

Repeat usage after refund

Hard blocker

Phase 7 should not begin if:

Duplicate-charge defects remain

Captured payments cannot be reconciled

Refund state differs materially between PetSaathi and the provider

Formal dispute reasons are not understood

8. Incident resolution — “same day” needs correction

Why one target is insufficient

Not all incidents can or should be fully investigated and permanently closed on the same day.

Separate four clocks:

Time to acknowledge

Time to contain

Time to restore safe operation

Time to complete root-cause and corrective-action review

Google’s incident-management guidance emphasises formal roles, immediate mitigation, organised response and subsequent investigation and learning.

Recommended severity targets

Severity 0 — Critical emergency

Examples:

Pet missing

Life-threatening injury

Serious data breach

Immediate danger

Targets:

Acknowledge: immediate

Incident owner assigned: within 2 minutes

Containment action: immediate

Executive/safety escalation: immediate

Customer updates: scheduled frequently

Root-cause review: after immediate safety is restored

Severity 1 — Serious safety incident

Examples:

Bite

Escape recovered

Medication error

Serious misconduct claim

Targets:

Acknowledge: under 5 minutes

Contain or stabilise: under 30 minutes where feasible

Operational decision: same day

Formal investigation: within 1–3 business days

Corrective actions: deadline based on risk

Severity 2 — Material service failure

Examples:

No-show

Major delay

Missing evidence

Failed replacement

Targets:

Immediate operational response

Customer remedy: same day

Root-cause classification: within 1 business day

Severity 3 — Routine quality issue

Examples:

Weak report

Minor lateness

Communication problem

Targets:

Acknowledgement: same day

Resolution: same day or next business day

Correct Phase 7 gate

Use:

All critical incidents must be contained promptly, all affected customers must receive an operational decision the same day where feasible, and no Severity 0 or unresolved Severity 1 incident may remain open at the Phase 7 decision.

Do not force investigators to close serious cases prematurely merely to satisfy a same-day metric.

9. Repeat booking rate — 35%+

Correct cohort formula

Customers completing a second paid service

÷

customers eligible to repeat during the measurement window

× 100

Recommended eligibility window:

Customer’s first service was completed

at least 14–30 days earlier

Target

Phase 7 gate: 35%+

This is deliberately higher than Phase 5’s 25–35% target because Phase 6 should improve:

Sitter continuity

Service visibility

Report quality

Reliability

Repeat-booking automation

Support experience

Track the full retention ladder

Would book again

↓

Repeat CTA clicked

↓

Second booking requested

↓

Second payment captured

↓

Second service completed

↓

Third service completed

↓

Plan actively used

Do not use GA4 alone

GA4 provides repeat-purchaser and cohort tools, but PetSaathi’s database should remain the source of truth because GA4 cohort exploration is device-based and may not fully merge users across devices.

Recommended cohort views

14-day repeat

30-day repeat

Repeat by service

Repeat by area

Repeat by sitter

Repeat by acquisition channel

Repeat by first-service rating

10. Customer rating — 4.6+/5

Target

Average overall rating: 4.6+/5

Required qualification

The rating must be based on:

Completed legitimate bookings

Non-duplicate reviews

No staff/test reviews

Meaningful sample size

Transparent moderation

No incentives for positive ratings

Recommended minimum evidence:

At least 50 eligible customer reviews

For a smaller launch:

25 reviews may be provisionally acceptable,

but confidence remains limited

Do not use average alone

Track:

Number of reviews

Median rating

Rating distribution

Review response rate

Service-specific rating

Sitter-specific rating

Complaint rate

Would-book-again percentage

Example:

4.7 average from 12 reviews

is weaker evidence than:

4.6 average from 100 reviews

Rating should not override safety data

A sitter with strong ratings but:

Repeated late arrivals

Missing reports

Undisclosed substitutions

Serious safety complaint

should still enter review.

11. Booking automation coverage — 60–70%

Correct definition

Automation coverage should apply only to eligible standard bookings, not every booking.

Formula

Eligible standard bookings completed through

automated validation, candidate filtering,

offer handling, reminders and state transitions

÷

all eligible standard bookings

× 100

Target

60–70%

An automated standard booking may include

Pet Profile completeness validation

Service-area validation

Schedule validation

Sitter candidate filtering

Conflict check

Offer creation

Offer expiry

Payment-link generation

Payment confirmation

Reminders

Missing-report alerts

Repeat-offer creation

Cases excluded from automation denominator

Red-risk assessment

Active medical concern

Bite or serious incident history requiring review

High-risk boarding

Manual specialist matching

Serious complaint

Major refund dispute

Emergency care

Automation levels

Level 0 — Manual

Admin performs every step.

Level 1 — Assisted

System identifies missing information and eligible candidates.

Level 2 — Workflow automation

System sends offers, reminders and validates transitions.

Level 3 — Standard-case orchestration

Routine booking proceeds automatically within approved controls.

Level 4 — Autonomous safety decisions

Not approved for PetSaathi Phase 6.

Required guardrail

Automation must never bypass:

Service-specific risk controls

Verification status

Scheduling conflicts

Payment verification

Area limits

Admin review requirements

12. Manual admin workload reduction — 30–50%

Why this target is valuable

Phase 6 should reduce repetitive operational work so the team can focus on:

Safety

Complex matching

Customer care

Sitter coaching

Incident prevention

Expansion planning

Google SRE defines repetitive operational work as toil and recommends measuring it objectively so teams can prioritise automation that produces the greatest operational benefit.

Establish the Phase 5 baseline

Before claiming reduction, record:

Admin minutes per booking

Manual touches per booking

Messages sent per booking

Booking-status edits

Sitter calls

Payment checks

Report reminders

Support tickets

Replacement actions

Formula

Phase 5 manual minutes per booking

− Phase 6 manual minutes per booking

÷

Phase 5 manual minutes per booking

× 100

Example

Phase 5:

20 manual minutes per routine booking

Phase 6:

12 manual minutes per routine booking

Reduction:

(20 − 12) ÷ 20 = 40%

This meets the 30–50% target.

Do not measure only staff count

Automation may reduce workload while the number of staff remains unchanged because booking volume increased.

Better indicators:

Manual minutes per completed booking

Bookings managed per operations hour

Manual interventions per booking

Report reminders per 100 services

Payment checks per 100 bookings

Quality guardrail

Workload reduction is invalid if it causes:

More incidents

More incorrect assignments

Lower support quality

More refunds

Missing reports

Higher sitter complaints

13. Phase 6 scorecard

Safety and service

### Table 79

| Metric | Green | Amber | Red |
| --- | --- | --- | --- |
| Report Card delivery | ≥98% | 95–97.9% | <95% |
| On-time rate | ≥95% | 90–94.9% | <90% |
| Tracking-session success | ≥90% | 80–89.9% | <80% |
| Usable tracking/fallback | ≥98% | 95–97.9% | <95% |
| Priority backup coverage | ≥80% | 65–79.9% | <65% |
| Sitter no-show | <3% | 3–5% | >5% |

Customer and financial

### Table 80

| Metric | Green | Amber | Red |
| --- | --- | --- | --- |
| Support P90 | <10 min | 10–15 min | >15 min |
| Refund/dispute | <3% | 3–5% | >5% |
| Repeat rate | ≥35% | 25–34.9% | <25% |
| Rating | ≥4.6 | 4.3–4.59 | <4.3 |

Automation

### Table 81

| Metric | Green | Amber | Red |
| --- | --- | --- | --- |
| Eligible-booking automation | 60–70%+ | 40–59% | <40% |
| Manual workload reduction | 30–50%+ | 15–29% | <15% |
| Invalid automated transitions | 0 | — | 1+ |
| Safety controls bypassed | 0 | — | 1+ |

14. Hard blockers for Phase 7

Phase 7 must not start when any of these conditions exists:

Unresolved Severity 0 incident

Unresolved serious Severity 1 safety case

Known cross-user data exposure

Incorrect automated sitter assignment

Payment-capture reconciliation failure

Automation bypassed pet-risk controls

Tracking exposes location outside booking

Critical notification has no fallback

Backup system assigns an ineligible sitter

Open Severity 0 or Severity 1 software defect

A high aggregate score cannot override a safety or security blocker.

15. Weighted Phase 7 decision model

### Table 82

| Category | Weight |
| --- | --- |
| Safety and incident readiness | 25 |
| Service reliability | 20 |
| Sitter reliability and backup capacity | 15 |
| Customer trust and retention | 15 |
| Automation correctness | 15 |
| Operational efficiency | 10 |

Decision bands

85–100:

READY_FOR_PHASE_7

70–84:

EXTEND_PHASE_6

50–69:

FIX_FAILED_SYSTEMS

Below 50:

PAUSE_EXPANSION

Hard blockers override the numerical score.

16. Recommended Phase 6 measurement period

Do not approve Phase 7 based on one successful week.

Recommended evidence:

At least 30 consecutive operational days

or

at least 200–300 Phase 6 processed bookings

Use enough volume to include:

Morning and evening peaks

Multiple sitters

Replacement events

Tracking failures

Payment retries

Report exceptions

At least one incident drill

The exact threshold depends on booking volume, but the measurement period should expose the system to ordinary failure modes rather than only ideal test cases.

17. Final Phase 7 entry criteria

Move to Phase 7 only when:

Service reliability

Report Cards delivered ≥98%

Sitter on-time rate ≥95%

Confirmed service completion ≥95%

Tracking

Tracking starts ≥90% of eligible services

Tracking or approved fallback evidence ≥98%

No unauthorised location exposure

Backup and sitter reliability

Priority backup coverage ≥80%

Replacement success ≥80% when backup exists

Sitter no-show below 3–5%

Customer trust

Support P90 under 10 minutes

Repeat customer rate ≥35%

Customer rating ≥4.6 with meaningful sample

Refund/dispute rate below 5%, preferably below 3%

Incidents

Critical cases contained promptly

Same-day operational decisions where feasible

No unresolved Severity 0/1 case

Postmortem and corrective-action process active

Automation

60–70% of eligible standard bookings automated

No safety-control bypass

No invalid booking transitions

Operations

Manual work per booking reduced 30–50%

Workload reduction does not reduce quality

SLO and error-budget policy actively used

Final approval table

### Table 83

| Target | Decision | Correction |
| --- | --- | --- |
| Report Cards 98%+ | Approved | Measure delivered reports |
| On-time rate 95%+ | Approved | Define arrival/start window |
| Tracking 90%+ | Approved | Eligible services only; add 98% fallback evidence |
| Backup coverage 80%+ | Approved with modification | Priority bookings, not all bookings |
| Support under 5–10 min | Approved | Use median and P90 |
| Refund/disputes below 3–5% | Approved | Separate reasons and amounts |
| Incidents resolved same day | Modified | Same-day containment/decision; investigation may take longer |
| Repeat rate 35%+ | Approved | Eligible cohort and second completed booking |
| Rating 4.6+ | Approved | Require meaningful review sample |
| Automation 60–70% | Approved | Standard eligible bookings only |
| Manual workload reduced 30–50% | Approved | Measure minutes and touches per booking |

Final operating principle

Phase 6 is complete only when automation reduces work without hiding risk, tracking improves transparency without violating privacy, and higher booking volume does not weaken safety, support or service quality.

PetSaathi Phase 6 — Final Product Scope 🛡️📍⚙️

Executive decision

Most proposed modules belong in Phase 6, but two items require major correction:

Advanced AI matching: build only as an assisted recommendation system—not as autonomous final matching.

Full insurance engine: do not build internally during Phase 6. Prepare for a licensed insurance-partner integration instead.

There is also one important mobile-app correction:

The customer native app can remain later.

A small sitter companion app may be required during Phase 6 if PetSaathi wants dependable background walk tracking. Android and iOS both impose specific permissions, disclosures and background-execution requirements for location collection.

Final scope approval

### Table 84

| Module | Final Phase 6 decision |
| --- | --- |
| Live walk tracking | Build controlled basic version |
| Automated Report Cards | Build |
| Booking reminders | Build |
| Backup sitter system | Build |
| Incident management | Upgrade substantially |
| Sitter reliability score | Build as transparent scorecard |
| Customer notifications | Build with retries and fallbacks |
| Admin alert system | Build |
| Refund/cancellation workflow | Upgrade substantially |
| Sitter availability automation | Build |
| Advanced AI matching | Modify: assisted matching only |
| Full insurance engine | Defer/reject for Phase 6 |
| Native customer app | Later |
| Native sitter companion | Evaluate/build for tracking |

1. Phase 6 product principle

The product should automate routine, objective work, while preserving human control over safety-sensitive decisions.

Automate:

validation, reminders, eligibility filtering,

candidate ranking, status transitions,

notifications, reports and alerts

Human-controlled:

Red-risk cases, medical concerns,

serious incidents, sitter suspension,

high-risk boarding, major refunds

and final exception decisions

NIST’s AI Risk Management Framework recommends clearly defining human and AI roles, documenting oversight and identifying capabilities that require human supervision. This supports using AI as decision support rather than as the final authority for consequential safety decisions.

2. Live walk tracking — Build basic controlled version

Objective

Allow the customer and operations team to verify that an authorised walk:

Started

Is currently active

Has recent location evidence

Ended correctly

Produced a route or documented fallback

Tracking flow

Confirmed walking booking

↓

Sitter arrives

↓

Sitter starts service

↓

Tracking session begins

↓

Location points recorded

↓

Signal gaps monitored

↓

Service completed

↓

Tracking stops automatically

↓

Distance and times added to Report Card

Tracking-session states

READY

STARTING

ACTIVE

SIGNAL_WEAK

SIGNAL_LOST

FALLBACK_REQUIRED

COMPLETED

FAILED

ADMIN_REVIEW_REQUIRED

Basic version should include

Start and stop tracking

Sitter check-in and checkout

Last-known update time

Route points

Approximate distance

Signal-loss detection

Manual fallback

Customer tracking view

Operations tracking dashboard

Privacy notice and consent

Automatic tracking termination

Privacy rule

Tracking should operate only during the authorised service window. Do not continuously track the sitter before arrival, between bookings or after service completion.

Android requires foreground or background location permissions based on the use case, and background access must be justified as core functionality. Apple also requires the relevant background location capability and clear communication to the user when location updates continue in the background.

Failure fallback

Tracking signal lost

↓

Sitter notified

↓

Operations alerted after timeout

↓

Timestamped photo/checkpoint requested

↓

Start/end proof retained

↓

Report marked “tracking exception”

Never generate or display a complete-looking route when the actual location data contains large gaps.

3. Native mobile application — Split the decision

Customer application

Keep the customer experience as a mobile-first PWA during Phase 6.

It already supports:

Booking

Payment

Service-status viewing

Report Cards

Reviews

Customer support

Repeat booking

A full native customer app is not yet essential.

Sitter application

A focused native sitter application may become necessary for:

Background location

Reliable check-in/out

Battery-aware tracking

Push notifications

Camera/media uploads

Emergency actions

Offline evidence buffering

This can be a compact operational application rather than a complete customer marketplace app.

Recommended approach

Customer:

Continue PWA

Sitter:

Android companion application first

iOS sitter app:

Add when active sitter/device demand justifies it

Android limits background work and location collection, and Apple requires specific Core Location capabilities for background updates. These constraints make a native sitter-side implementation more dependable than assuming a web page will consistently track a walk in the background.

4. Automated Report Cards — Build

Objective

Reduce sitter work without removing sitter responsibility for reporting factual care observations.

Automatically populate

Booking ID

Pet

Sitter

Service

Scheduled time

Actual start

Actual end

Duration

Tracking distance

Route status

Uploaded media

Check-in/out

Tracking exception

Sitter must complete

Food update

Water update

Pee/poop update

Pet mood

Behaviour

Care tasks

Notes

Concern flag

Safe handover confirmation

Flow

Service completed

↓

Draft generated automatically

↓

Sitter checks factual details

↓

Sitter completes care observations

↓

Validation runs

↓

Normal report delivered automatically

or

Concern detected

↓

Admin/safety review

↓

Report delivered with approved handling

Validation rules

End time must be after start time.

Completed walk requires check-in and checkout.

Required fields depend on service.

Missing media requires an exception reason.

Concern cannot be silently removed.

Material amendments create a new version.

Target

Report Card delivery: 98%+

5. Booking reminders — Build

Customer reminders

Pet Profile incomplete

More information requested

Payment required

Payment expiring

Booking confirmed

Service tomorrow

Service starting soon

Replacement proposed

Report Card available

Review request

Repeat-booking suggestion

Sitter reminders

New offer

Offer expiring

Upcoming assignment

Acknowledge booking

Begin check-in

Tracking not started

Service overdue

Report overdue

Verification expiring

Reminder rules

Do not send every reminder to every user.

Use:

Event

+ booking status

+ user role

+ timing

+ previous delivery

+ required action

= notification decision

6. Customer notifications — Build with fallback

Channels

Push notification

WhatsApp

Email

SMS for selected critical cases

Phone for emergencies

Firebase Cloud Messaging supports Android, iOS and web messaging, including foreground and background notification handling. However, critical events should not depend on a single push channel because device state, platform processing and notification permissions can affect receipt.

Notification architecture

Booking or service event committed

↓

Notification-outbox record created

↓

Worker selects channel

↓

Message sent

↓

Provider response recorded

↓

Retry if required

↓

Fallback channel used

Important rule

Never send notifications inside the main booking transaction.

A failed WhatsApp or push message must not roll back a valid payment or booking assignment.

Critical fallback examples

### Table 85

| Event | Primary | Fallback |
| --- | --- | --- |
| Payment reminder | Push/WhatsApp | Email |
| Sitter delayed | Push/WhatsApp | Phone |
| Replacement required | Push/WhatsApp | Phone |
| Pet emergency | Phone | WhatsApp + emergency contacts |
| Report ready | Push | WhatsApp/email |

7. Admin alert system — Build

Alert categories

Booking

Booking unassigned

Offer expiring

Payment pending too long

Booking starts soon without acknowledgement

Invalid state transition attempted

Service

Sitter not arrived

Tracking not started

Signal lost

Service overdue

Completion missing

Report overdue

Safety

New bite or escape history

Active-health warning

Concern flag

Incident created

Emergency contact failed

Finance

Captured payment without confirmed booking

Duplicate payment

Refund failed

Settlement mismatch

Unresolved dispute

System

Notification queue backlog

Upload failures

Webhook processing error

API failure spike

Authorisation-denial anomaly

Alert states

OPEN

ACKNOWLEDGED

ASSIGNED

INVESTIGATING

MITIGATED

RESOLVED

SUPPRESSED_WITH_REASON

Avoid alerting admins for every low-impact technical event. Alerts should require an operational response.

8. Backup sitter system — Build

Assignment roles

PRIMARY

BACKUP

REPLACEMENT

SUPERVISOR

Backup coverage

The system should find eligible backup candidates based on:

Area

Travel time

Service permission

Pet size

Pet-risk permission

Availability

Verification

Schedule conflicts

Current capacity

Replacement flow

Primary sitter cancels or fails

↓

Booking enters REPLACEMENT_REQUIRED

↓

Eligible replacement pool generated

↓

Offers sent

↓

First valid acceptance transactionally locked

↓

Admin/customer approval where required

↓

New sitter receives instructions

↓

Booking reconfirmed

Safeguards

Do not assign an unverified substitute.

Do not allow the sitter to send a friend.

Preserve the original assignment record.

Do not charge the customer twice.

Revalidate risk controls.

Notify the customer immediately.

Record the replacement reason.

Targets

Priority booking backup coverage: 80%+

Replacement success where backup exists: 80%+

9. Incident management — Improve substantially

Required improvements

Severity levels

Incident commander

Evidence storage

Booking and payout holds

Customer communication timeline

Pet reassessment

Sitter reassessment

Corrective actions

Post-incident review

Audit trail

Severity

SEV-0: immediate life/security emergency

SEV-1: serious safety incident

SEV-2: material service failure

SEV-3: routine quality issue

Workflow

Incident created

↓

Severity assigned

↓

Owner assigned

↓

Immediate safety action

↓

Customer and sitter contacted

↓

Evidence preserved

↓

Booking/payout/refund decision

↓

Root cause reviewed

↓

Pet/sitter controls updated

↓

Corrective action verified

↓

Incident closed

“Same-day resolution” should mean same-day containment and operational decision where feasible. Serious investigations may require additional time.

10. Sitter reliability score — Build as a scorecard

Do not build

Reliability score: 87

with no explanation.

Build transparent components

On-time rate

Offer-response rate

Acceptance rate

Completion rate

Cancellation rate

No-show rate

Report timeliness

Customer rating

Same-sitter requests

Complaint rate

Incident severity

Verification status

Current workload

Example scorecard

Punctuality: 96%

Completion: 98%

Report delivery: 100%

Cancellation: 2%

No-show: 0%

Customer rating: 4.8

Repeat requests: 42%

Safety status: Clear

Suggested sitter statuses

ACTIVE

ACTIVE_WITH_COACHING

LIMITED

PROBATION

TEMPORARILY_PAUSED

SAFETY_REVIEW

SUSPENDED

ARCHIVED

Fairness rule

Do not punish a sitter for correctly declining:

A pet outside their permissions

An unsafe request

Excessive travel

Scheduling conflict

Missing care information

The assignment system must distinguish poor sitter reliability from poor-quality offers.

11. Sitter availability automation — Build

Availability model

Support:

Weekly recurring availability

Date-specific availability

Blocked periods

Leave

Maximum daily services

Maximum consecutive services

Travel buffers

Service-specific availability

Area-specific availability

Backup-only windows

Flow

Sitter defines recurring availability

↓

Adds exceptions and leave

↓

System subtracts accepted bookings

↓

System applies buffers and capacity

↓

Eligible slots become available for matching

Conflict rules

Block assignment when:

Service times overlap

Travel buffer is insufficient

Maximum daily capacity reached

Required break unavailable

Sitter is backup-only

Verification expired

Sitter is restricted

Customer promise

Availability is not a guarantee until assignment and payment are complete.

12. Refund and cancellation workflow — Improve substantially

Cancellation should record

Booking

Cancelled by

Reason

Cancellation time

Applicable policy version

Replacement attempted

Refund eligibility

Sitter compensation decision

Refund states

NOT_REQUIRED

REQUESTED

UNDER_REVIEW

APPROVED

PROCESSING

PROCESSED

PARTIALLY_PROCESSED

FAILED

REJECTED

Workflow

Booking cancelled

↓

Policy and reason evaluated

↓

Replacement considered

↓

Refund amount calculated

↓

Authorised approval

↓

Razorpay refund created

↓

Webhook/provider status tracked

↓

Customer notified

↓

Reconciliation completed

Razorpay allows full or partial refunds only against captured payments, and provider refund status should remain separate from booking cancellation status.

Critical rules

Use smallest currency units.

Prevent over-refunding.

Make the operation idempotent.

Record provider refund ID.

Handle failed refund retries.

Preserve approval history.

Do not claim that bank credit is complete merely because PetSaathi approved it.

13. Advanced AI matching — Do not build as autonomous matching

Final decision

Replace:

Advanced AI matching — Build

with:

Explainable assisted matching — Build

Autonomous final matching — Defer

Build now

Deterministic hard filters

Active verification

Service permission

Pet type and size

Risk permission

Area

Travel time

Availability

Schedule conflict

Current capacity

Active restriction

Explainable ranking

After hard filtering, rank candidates using:

Travel time

Same-sitter history

Relevant experience

On-time record

Customer preference

Pet-handling compatibility

Availability stability

Report reliability

Candidate output

Candidate: Riya

Rank: 1

Reasons:

• 12-minute estimated travel

• Previously served this pet

• Large-dog approved

• 97% on-time rate

• Available in requested slot

Optional AI assistance

AI may:

Summarise sitter and pet notes

Identify contradictory answers

Suggest follow-up questions

Rank already-eligible candidates

Explain ranking factors

Predict likely offer acceptance for operational planning

AI must not

Override risk restrictions

Approve Red-risk cases

Diagnose pet behaviour or illness

Assign an ineligible sitter

Ignore bite history

reject a customer autonomously

determine emergency care

approve shared boarding

NIST recommends defining human responsibilities, monitoring system limitations and ensuring oversight for AI used in operational contexts.

Required controls

Human override

Ranking explanation

Model/version recorded

Input-data version recorded

Bias and performance monitoring

Manual fallback

No sensitive factors without legitimate operational need

Audit of accepted and overridden recommendations

14. Full insurance engine — Do not build in Phase 6

Final decision

Replace:

Full insurance engine — Build

with:

Insurance-partner readiness — Research and design

Internal insurance underwriting engine — Do not build

Insurance products and insurance distribution are regulated activities in India. IRDAI maintains Insurance Products Regulations and separate regulatory frameworks for corporate agents, brokers and web aggregators. PetSaathi should not design, price, sell or underwrite its own insurance-like product without an appropriate licensed insurer/intermediary structure and specialist legal review.

Phase 6 may build

Insurance-partner requirements document

Customer-consent fields

Policy reference fields

Insurer contact details

Coverage-status display

Claims-intimation handoff

Incident evidence export

Partner API interface specification

Reconciliation fields

Customer disclosures

Example future partner flow

Customer views optional protection

↓

Licensed partner provides product information

↓

Customer consents and purchases through approved flow

↓

Policy reference returned to PetSaathi

↓

Covered incident occurs

↓

PetSaathi provides authorised evidence

↓

Licensed insurer/intermediary handles claim decision

PetSaathi must not independently

Underwrite risk

Promise claim approval

Set insurance premiums

Present an internal refund reserve as insurance

Issue policy documents

Decide regulated insurance claims

Market itself as an insurer without authorisation

Safer Phase 6 alternative

Create a clearly defined service-recovery policy, not insurance:

Full or partial refund

Rebooking

Goodwill credit

Emergency coordination

Documented compensation limits

Avoid calling it “insurance,” “coverage,” or “protection policy” unless the legal structure supports those claims.

15. Final Phase 6 priority order

P0 — Safety and core reliability

Incident-management upgrade

Live walk tracking MVP

Backup sitter system

Refund/cancellation upgrade

Admin alerts

Booking reminders

Customer notifications

P1 — Operational automation

Automated Report Cards

Availability automation

Transparent sitter reliability scorecard

Standard booking automation

P2 — Controlled intelligence

Explainable candidate ranking

Note summarisation

Contradiction detection

Operational predictions

Deferred

Autonomous AI matching

Full insurance engine

Native customer application

Multi-city automation

16. Recommended 45-day implementation order

Days 1–7 — Safety foundation

Incident workflow

Severity levels

Admin alerts

Booking and payout holds

Refund/cancellation states

Days 8–15 — Tracking

Sitter check-in/out

Tracking sessions

Signal-loss handling

Customer tracking view

Privacy controls

Device testing

Days 16–22 — Notifications and reminders

Notification outbox

Push/WhatsApp/email

Retries

Critical fallbacks

Delivery dashboard

Days 23–29 — Backup and availability

Availability calendar

Capacity calculation

Backup pool

Replacement workflow

Conflict controls

Days 30–35 — Reports and reliability

Automatic report drafts

Validation

Overdue alerts

Reliability scorecards

Coaching/restriction actions

Days 36–40 — Matching assistance

Hard eligibility rules

Candidate ranking

Explanation output

Human override

Audit history

Days 41–45 — Controlled rollout

Small sitter cohort

Failure drills

Tracking tests

Replacement tests

Refund tests

Reliability report

Insurance work during these 45 days should remain limited to legal discovery and partner-readiness documentation.

17. Definition of done

Tracking

Operates only during service

Permission and notice implemented

Signal-loss fallback works

Customer cannot see sitter outside authorised window

Data retention is defined

Automation

Invalid state transitions rejected

Standard cases automated

Yellow/Red cases remain controlled

Every automated action is auditable

Sitter operations

Availability prevents double-booking

Backup system enforces eligibility

Reliability components are explainable

No opaque automatic suspension

Notifications

Outbox and retry system work

Critical alerts have fallback

Duplicate notifications controlled

Delivery failures visible

Incidents and refunds

Severity and ownership clear

Evidence preserved

Booking and payout holds work

Refund state reconciles with Razorpay

Customer receives accurate updates

AI

Hard filters cannot be bypassed

Recommendations are explainable

Human override exists

High-risk decisions are not autonomous

Insurance

No unlicensed product is offered

Partner requirements are documented

Any future integration receives legal and regulatory review

Final approval table

### Table 86

| Proposed module | Final ruling |
| --- | --- |
| Live walk tracking | Approve |
| Automated Report Cards | Approve |
| Booking reminders | Approve |
| Backup sitter system | Approve |
| Incident management improvement | Approve — P0 |
| Sitter reliability score | Approve with transparent components |
| Customer notifications | Approve |
| Admin alert system | Approve — P0 |
| Refund/cancellation improvement | Approve — P0 |
| Sitter availability automation | Approve |
| Advanced AI matching | Modify: assisted and explainable only |
| Full insurance engine | Reject/defer |
| Native mobile app | Customer app later; sitter companion may be required now |

Final operating principle

Phase 6 should build the technology that prevents operational failure—not features that introduce new regulatory, safety or automation risk before the foundation is ready.

PetSaathi Phase 6 — Semi-Automated System Architecture ⚙️🐾

Executive decision

The proposed architecture is directionally correct, but the payment and sitter-assignment order should be changed.

Your current sequence is:

Customer books

→ Payment verified

→ Sitter assigned

→ Sitter confirms

This creates a risk: PetSaathi may capture payment before confirming that a suitable sitter is available.

The recommended production sequence is:

Customer submits booking request

↓

System validates pet, area, schedule and risk

↓

Admin/system identifies eligible sitters

↓

Sitter provisionally accepts

↓

Final price is locked

↓

Customer completes payment

↓

Backend verifies captured payment

↓

Booking becomes confirmed

↓

Reminders and service workflow begin

Razorpay requires server-side signature verification before fulfilment. Once a payment is captured, its order is marked paid and webhook events such as payment.captured and order.paid may be delivered. Razorpay also states that webhook events can be duplicated, so PetSaathi must process them idempotently.

1. Final end-to-end Phase 6 flow

Customer selects pet and service

↓

Booking request created

↓

Automated eligibility validation

↓

Manual review where required

↓

Eligible sitter candidates generated

↓

Sitter offer sent

↓

Sitter accepts provisionally

↓

Final amount locked

↓

Payment requested

↓

Payment captured and verified

↓

Booking confirmed

↓

Customer and sitter reminders scheduled

↓

Sitter checks in

↓

Service and tracking start

↓

Customer receives private updates

↓

Sitter completes service

↓

Report Card draft generated

↓

Sitter confirms observations

↓

Report Card delivered

↓

Customer review requested

↓

Sitter reliability metrics updated

↓

Repeat booking or plan offered

This creates a semi-automated marketplace: standard bookings move through automated controls, while safety-sensitive cases remain under authorised human supervision.

2. Main system components

Customer application

The customer-facing PWA should support:

Account and Pet Profiles

Booking requests

Sitter-assignment review

Payment

Booking status

Live service status

Private photos and videos

Report Cards

Reviews

Repeat booking

Customer support

Sitter application

The sitter interface should support:

Availability

Booking offers

Accept or decline

Pet instructions

Check-in and checkout

Service tracking

Media upload

Concern reporting

Report Card completion

Earnings

Performance information

A native Android sitter companion may be preferable for dependable background walk tracking. Android limits background-location behaviour and requires specific permissions when location continues outside the foreground experience.

Admin dashboard

The operations dashboard should support:

Booking review

Manual-risk review

Sitter assignment

Live-service monitoring

Replacement sitter workflow

Payment reconciliation

Report review

Customer complaints

Incident management

Refunds

Sitter restrictions

Reliability alerts

Backend services

Recommended logical components:

Authentication and authorisation

Pet Profile service

Booking workflow engine

Sitter-matching service

Payment service

Tracking service

Notification service

Report Card service

Review service

Reliability service

Incident service

Refund service

Audit-log service

These may initially remain inside one modular backend application. PetSaathi does not need complex microservices merely to claim scalability.

3. Booking creation

Customer journey

The customer selects:

Pet

Service

Date

Time

Duration

Address

Care instructions

The frontend sends only the selected inputs.

The server must calculate and validate:

Service availability

Area eligibility

Price

Pet Profile completeness

Service-specific risk

Date and time

Booking conflicts

Customer ownership of the pet

Initial status

REQUESTED

The customer should see:

Your request has been received. PetSaathi is checking your pet’s care requirements, service availability and eligible sitters. This is not yet a confirmed booking.

Required records

Create:

booking

booking_pet_snapshot

booking_address_snapshot

booking_instruction_snapshot

booking_price_estimate

booking_status_history

Snapshots ensure that later Pet Profile or address changes do not rewrite the information used for the original booking.

4. Automated booking validation

The workflow engine should perform deterministic checks.

Basic checks

Customer owns pet

Pet Profile exists

Service is active

Area is active

Schedule is valid

Address exists

Duration is permitted

Safety checks

Current-health confirmation exists

Service-specific risk assessment exists

Required controls are available

Vaccination policy is satisfied

Emergency information is complete

Possible validation results

STANDARD_MATCHING_ALLOWED

ADMIN_REVIEW_REQUIRED

MORE_INFORMATION_REQUIRED

SERVICE_UNAVAILABLE

DECLINED

Standard case

A Green-risk dog requesting walking in an active area may proceed to automated sitter candidate generation.

Manual case

Examples requiring authorised review:

Red-risk service assessment

Bite history needing clarification

Active symptoms

High-risk boarding

Complex medication

Serious previous incident

Customer-provided information contradiction

Automation must never bypass required business steps. OWASP identifies skipped or out-of-order workflow actions as business-logic security problems, so server-side transition guards are essential.

5. Sitter candidate generation

The system should first apply hard eligibility filters.

Hard filters

A sitter is excluded when:

Account is not active

Verification has expired

Service is not approved

Pet size exceeds permission

Pet risk exceeds permission

Area is outside the service radius

Travel time is too high

Sitter is unavailable

Another booking conflicts

Daily capacity is full

Safety restriction exists

Only after hard filtering should candidates be ranked.

Ranking factors

Travel time

Previous service with the pet

Relevant handling experience

On-time performance

Report Card reliability

Same-sitter preference

Current workload

Customer preference

Example ranking output

1. Riya S.

• 11-minute estimated travel

• Has served Bruno previously

• Large-dog approved

• 97% on-time rate

2. Aditi P.

• 15-minute estimated travel

• Strong-pulling experience

• Available backup

The candidate explanation should be visible to the admin. PetSaathi should avoid an unexplained black-box score.

6. Sitter offer and provisional acceptance

The system sends offers to selected sitters.

Offer record

offer_id

booking_id

sitter_id

offered_at

expires_at

viewed_at

response

response_reason

Offer statuses

OFFERED

VIEWED

ACCEPTED

DECLINED

EXPIRED

WITHDRAWN

After sitter acceptance

The system must recheck:

Booking is still available

Sitter remains eligible

No schedule conflict was created

No other sitter has become primary

Booking has not been cancelled

Then create a provisional primary assignment.

Concurrency protection

Two sitters may accept simultaneously. Assignment creation and booking-status change should therefore happen inside a database transaction with locking or version checks.

PostgreSQL provides transaction isolation and locking mechanisms to coordinate concurrent changes while preserving data integrity.

Example guard:

UPDATE bookings

SET

provisional_sitter_id = :sitter_id,

status = 'PAYMENT_PENDING',

version = version + 1

WHERE

id = :booking_id

AND status = 'SITTER_MATCHING'

AND version = :expected_version;

If zero rows are updated, another process changed the booking first.

7. Payment workflow

After a sitter provisionally accepts:

Final amount calculated

↓

Razorpay order created

↓

Customer opens checkout

↓

Payment attempted

↓

Backend verifies signature

↓

Webhook or API confirms captured state

↓

Booking becomes confirmed

Payment states

CREATED

PENDING

AUTHORIZED

CAPTURED

FAILED

EXPIRED

REFUNDED

PARTIALLY_REFUNDED

Confirmation guard

The booking may move from PAYMENT_PENDING to CONFIRMED only when:

Active provisional sitter exists

Payment status = CAPTURED

Signature verified = true

Payment amount = final booking amount

Currency = INR

Provider order belongs to booking

No unresolved safety block

Webhook idempotency

Store:

provider_event_id

event_type

received_at

payload_hash

processing_status

processed_at

Before processing a webhook, check whether its x-razorpay-event-id has already been handled. Razorpay explicitly documents duplicate webhook delivery as an expected scenario.

Payment timeout

If payment is not completed within the allowed period:

PAYMENT_PENDING

↓

PAYMENT_EXPIRED

↓

Provisional assignment released

↓

Sitter returns to available capacity

8. Booking confirmation

Once payment is verified:

booking.status = CONFIRMED

assignment.status = ASSIGNED

payment.status = CAPTURED

The customer receives:

Booking code

Pet

Service

Date and time

Assigned sitter

Amount paid

Address summary

Preparation instructions

Cancellation policy

Support contact

The sitter receives:

Pet identity and photograph

Exact address

Care instructions

Behaviour and handling controls

Relevant health information

Emergency contacts

Expected earnings

Check-in requirements

Access must be role- and booking-specific. OWASP recommends robust authorisation controls and HTTPS for protected APIs.

9. Automated reminders

The system creates reminder jobs immediately after confirmation.

Customer reminders

24 hours before service

2 hours before service

30 minutes before service

Content may include:

Prepare harness

Confirm access instructions

Report any health changes

Keep emergency contact available

Sitter reminders

24 hours before

2 hours before

30 minutes before

Check-in reminder

Tracking-start reminder

Report Card reminder

Reminder cancellation

If a booking is cancelled, replaced or rescheduled, outdated notification jobs must be cancelled or invalidated.

10. Notification architecture

Notifications should use a durable outbox.

Business event committed

↓

Outbox record created

↓

Notification worker reads event

↓

Channel selected

↓

Message sent

↓

Provider response stored

↓

Retry or fallback applied

Channels

Push notification

WhatsApp

Email

SMS for selected urgent events

Phone for emergencies

Why use an outbox

A valid booking transaction should not fail because a notification provider is temporarily unavailable.

Retry handling

FCM recommends appropriate timeouts, retry logic and exponential backoff when message requests fail or are throttled.

Message priority

Use normal priority for:

Report Card available

Review reminder

Future booking reminder

Use high priority only for legitimate time-sensitive user-visible events, such as:

Sitter delayed

Replacement required

Service concern

Firebase notes that background delivery of normal-priority messages may be delayed, while high priority is intended for time-sensitive user-visible content.

Critical safety events must also have a phone or human fallback.

11. Pre-service readiness

Before the service begins, the system checks:

Booking confirmed

Payment captured

Sitter still active

Sitter acknowledged

Customer reminder delivered

Pet Profile available

No new health block

Address complete

Tracking permission available

Possible states:

READY

CUSTOMER_ACTION_REQUIRED

SITTER_ACTION_REQUIRED

REPLACEMENT_REQUIRED

SAFETY_REVIEW

CANCELLED

A booking should not silently proceed when a mandatory readiness check fails.

12. Sitter check-in

The sitter arrives and selects:

I have arrived

The system records:

Check-in time

Sitter identity

Booking ID

Location accuracy where authorised

Customer handover status

Initial concern status

Check-in guards

Check-in should fail or require admin override when:

Booking is cancelled

Wrong sitter account is used

Service is too early or late

Sitter is far from the booking

Another sitter is assigned

Payment is unresolved

Safety hold exists

13. Service and tracking start

The sitter selects:

Start service

This transition should atomically:

Set booking = SERVICE_STARTED

Store actual start time

Start tracking session where required

Create service timeline event

Notify customer

Schedule overdue-service alert

Tracking scope

Tracking should:

Start only for the authorised booking

Operate during the service window

Stop at service completion

Be accessible only to authorised users

Preserve accuracy and signal-gap information

Background location is restricted by mobile platforms and can affect battery consumption, so PetSaathi should design for permission failures, signal loss and device limitations.

14. Customer live updates

The customer should see a private service timeline:

7:00 PM — Sitter arrived

7:04 PM — Walk started

7:12 PM — Photo update received

7:25 PM — Water break

7:34 PM — Walk completed

7:40 PM — Report Card ready

For tracking-enabled walks, show:

Service active

Last location update

Approximate route

Duration

Signal status

Do not expose:

Sitter location outside the booking

Other customer locations

Exact historical routes indefinitely

Background tracking after checkout

15. Photo and video updates

The sitter may upload media during the service.

Upload security

Validate:

User is the active assigned sitter

Booking is active

File type is allowlisted

File size is within limits

Filename is generated by the system

Media is stored privately

Customer access uses controlled links

OWASP recommends authenticated and authorised uploads, file-type validation, size limits and safe storage controls.

Media states

UPLOADING

PROCESSING

AVAILABLE

FAILED

QUARANTINED

DELETED

Service media must not automatically become public marketing content.

16. Live admin alerts

The admin system should detect exceptions.

Examples

Sitter has not checked in

Service started without tracking

Tracking signal lost

Service exceeded expected duration

Photo upload failed

Customer reported concern

Sitter submitted emergency flag

Alert states

OPEN

ACKNOWLEDGED

ASSIGNED

INVESTIGATING

MITIGATED

RESOLVED

Alerts should be actionable. Google SRE recommends monitoring latency, traffic, errors and saturation and alerting humans on conditions requiring intervention rather than every low-impact technical event.

17. Backup sitter workflow

If the primary sitter cancels or fails readiness:

Booking enters REPLACEMENT_REQUIRED

↓

Eligible replacement candidates generated

↓

Backup offers sent

↓

First valid acceptance locked

↓

Customer informed

↓

Replacement receives instructions

↓

Booking reconfirmed

Replacement guardrails

A replacement sitter must satisfy the same:

Service permission

Pet size permission

Risk permission

Availability

Travel limit

Verification

Workload limit

The original sitter remains in assignment history.

The system must never allow an assigned sitter to substitute an unapproved friend.

18. Service completion

The sitter selects:

Complete service

The system records:

Actual end time

Tracking end

Pet handover or secured status

Completion location where authorised

Initial completion notes

Concern flag

The booking moves:

SERVICE_STARTED

↓

SERVICE_COMPLETED

A completed physical service is not yet administratively closed.

19. Automated Report Card

After completion, the system generates a draft using:

Booking details

Scheduled time

Actual start and end

Duration

Tracking distance

Tracking exceptions

Uploaded media

Sitter identity

The sitter completes:

Food and water

Toilet update

Pet mood

Behaviour

Tasks completed

Notes

Concern

Handover condition

Normal flow

Draft created

↓

Sitter completes observations

↓

Validation passes

↓

Report delivered

Concern flow

Concern marked

↓

Report enters ADMIN_REVIEW_REQUIRED

↓

Operations/safety review

↓

Customer contacted

↓

Incident opened where necessary

20. Review workflow

After the Report Card is delivered, the customer may submit:

Punctuality rating

Pet-handling rating

Communication rating

Report-quality rating

Overall rating

Written comment

Would book again?

Same sitter requested?

Review eligibility

A review is allowed only when:

Booking belongs to customer

Service completed

Report delivered

Review not already submitted

A review should not permanently prevent booking closure.

21. Sitter reliability update

After every completed booking, update component metrics.

Components

Offer response

Offer acceptance

On-time performance

Service completion

Cancellation

No-show

Report timeliness

Customer rating

Same-sitter request

Complaint

Incident

Example

Riya S.

On-time rate: 96%

Completion rate: 99%

Report delivery: 98%

Cancellation rate: 2%

No-show rate: 0%

Rating: 4.8

Same-sitter requests: 41%

Avoid producing only one opaque value such as:

Reliability score: 87

Admins and sitters should understand why performance changed.

22. Repeat booking trigger

A repeat offer should be generated when:

Service completed

Report delivered

No serious unresolved incident

Customer has not opted out

Pet remains eligible

Area remains active

Offer order

Book same sitter again

↓

Repeat the same service

↓

Five-walk starter plan

↓

Ten-walk plan

↓

Recurring-plan waitlist

The same-sitter option remains subject to availability.

Repeat-offer timing

Possible sequence:

Immediately after Report Card

24-hour reminder

Seven-day reminder for eligible customers

Do not repeatedly message customers who complained, cancelled communication or have an unresolved safety issue.

23. Separate state machines

Do not store every process inside one booking_status field.

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

CANCELLED

DECLINED

REPLACEMENT_REQUIRED

INCIDENT_HOLD

Assignment status

OFFERED

ACCEPTED

DECLINED

EXPIRED

ASSIGNED

REMOVED

COMPLETED

NO_SHOW

Payment status

CREATED

PENDING

AUTHORIZED

CAPTURED

FAILED

EXPIRED

REFUNDED

PARTIALLY_REFUNDED

Tracking status

READY

ACTIVE

SIGNAL_LOST

FALLBACK_REQUIRED

COMPLETED

FAILED

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

These processes change independently. A booking can be completed while the review remains pending, or cancelled while a refund is still processing.

24. Event-driven architecture

Every important change should produce a domain event.

Examples:

booking.requested

booking.approved

sitter.offer_sent

sitter.offer_accepted

payment.captured

booking.confirmed

service.started

tracking.signal_lost

media.uploaded

service.completed

report.delivered

review.submitted

repeat_offer.created

incident.opened

Events may trigger:

Notifications

Audit history

Analytics

Alerts

Report generation

Reliability calculations

Event processing requirements

Unique event ID

Timestamp

Booking ID

Actor

Event type

Version

Processing status

Retry count

Consumers must be idempotent because payment, notification and background-processing events may be retried or delivered more than once. Razorpay specifically documents duplicate webhook delivery and unique event identifiers for deduplication.

25. Recommended database modules

Core

users

pets

pet_behavior_profiles

pet_medical_profiles

pet_risk_assessments

bookings

booking_pets

booking_snapshots

booking_status_history

Assignment

sitter_profiles

sitter_services

sitter_permissions

sitter_availability

booking_offers

booking_assignments

sitter_reliability_metrics

Service execution

service_sessions

tracking_sessions

tracking_points

service_updates

service_media

booking_reports

report_versions

Financial

payments

payment_events

refunds

payouts

payout_adjustments

Quality

reviews

complaints

incidents

incident_actions

sitter_restrictions

pet_reassessments

System control

notification_outbox

notification_deliveries

admin_alerts

audit_logs

workflow_events

26. Security rules

Customer

May access only:

Their own pets

Their own bookings

Assigned sitter information for confirmed bookings

Their own payments

Their own reports

Sitter

May access only:

Offers sent to them

Confirmed assignments

Necessary assigned-pet information

Service address after authorisation

Their own earnings and performance

Admin

Access should be separated:

Operations admin

Safety admin

Finance admin

Verification admin

Super admin

OWASP recommends deny-by-default access, least privilege and authorisation checks on protected APIs.

Audit events

Audit:

Risk assessment changed

Sitter assigned

Payment manually corrected

Refund approved

Incident severity changed

Sitter suspended

Report amended

Tracking data accessed

27. Failure paths

No sitter accepts

SITTER_MATCHING

↓

Offer pool exhausted

↓

Admin review

↓

Alternative time / waitlist / decline

Do not collect payment unless the business has clearly implemented a pay-before-matching model with reliable automatic refunds.

Payment captured but callback closes

Webhook or server-to-server verification should reconcile the payment and confirm the booking without requiring the browser to remain open. Razorpay recommends webhooks or API verification to handle callback failures.

Duplicate payment webhook

Check the provider event ID and existing payment state, then return success without repeating the transition.

Tracking fails

Tracking signal lost

↓

Sitter warning

↓

Manual evidence requested

↓

Admin alerted

↓

Report marked with exception

Sitter cancels

REPLACEMENT_REQUIRED

↓

Backup search

↓

Replacement or cancellation

↓

Refund decision

Serious concern

INCIDENT_HOLD

↓

Safety owner assigned

↓

Customer contacted

↓

Evidence preserved

↓

Service/refund/payout decision

28. Reliability dashboard

Track four technical signals:

Latency

Traffic

Errors

Saturation

Google SRE identifies these as core signals for monitoring distributed systems.

Business reliability indicators

Booking-transition success

Assignment success

Payment reconciliation

Tracking start success

Report delivery

Notification failure

Support response

Replacement success

Example alerts

Payment captured but booking not confirmed

Two active primary sitters

Confirmed booking without active sitter

Service started after cancellation

Tracking active after service completion

Report missing for completed service

Notification queue backlog

29. Definition of done

Phase 6 architecture is ready when:

Booking

Standard cases move automatically

Manual review cases cannot bypass review

Invalid transitions are blocked

History is preserved

Payment

Signature verified server-side

Captured status confirmed

Duplicate events handled safely

Payment mismatch alerts work

Assignment

Only eligible sitters receive offers

Simultaneous acceptance is safe

Replacement flow works

Original assignments remain auditable

Tracking

Starts and stops correctly

Operates only during service

Signal-loss fallback works

Customer access is restricted

Notifications

Durable outbox exists

Retries work

Critical fallback exists

Failed deliveries are visible

Reports

Draft is generated automatically

Sitter confirms observations

Concerns enter review

Customer receives the final report

Security

Customer sees only their own data

Sitter sees only active assignments

Private media is protected

Sensitive actions are audited

Final approved architecture

Customer submits request

↓

System validates standard rules

↓

Admin reviews exceptions

↓

Eligible sitter candidates generated

↓

Sitter provisionally accepts

↓

Final price locked

↓

Payment captured and verified

↓

Booking confirmed

↓

Automated reminders

↓

Sitter check-in

↓

Tracking and service begin

↓

Private customer updates

↓

Service completion

↓

Automated Report Card draft

↓

Sitter confirms report

↓

Customer receives report and review request

↓

Reliability scorecard updated

↓

Repeat offer generated

Final operating principle

PetSaathi becomes semi-automated when software handles repeatable validation, reminders, transitions, tracking, reporting and ranking—while authorised people retain control over safety, incidents, exceptions and high-risk decisions.

Simple explanation for professor

“In Phase 6, the PetSaathi platform will move from a mostly manual marketplace to a semi-automated system.

The customer first submits a booking request. The software checks the Pet Profile, service area, time, risk level and required information. Standard bookings can continue automatically, while complex or high-risk bookings go to an administrator.

The system then finds eligible sitters based on availability, travel distance, verification, experience and pet-handling permission. A sitter provisionally accepts the booking. After that, the final price is locked and the customer completes payment. The booking becomes confirmed only after the backend verifies that the payment was captured.

The system automatically sends reminders to the customer and sitter. When the sitter arrives, they check in and start the service. Tracking begins for eligible dog walks, and the customer receives private service and photo updates.

After the service, the system creates a Report Card draft using the booking time, tracking data and uploaded media. The sitter adds food, water, toilet, mood, behaviour and concern information. The final report is then delivered to the customer.

The customer can rate the service and request the same sitter again. The system updates the sitter’s punctuality, completion, reporting, rating and repeat-request metrics. It then offers the customer another booking or a walking plan.

Important processes such as payment, booking, assignment, tracking, reports and reviews will keep separate statuses. Every important action will also create an audit event.

This design automates routine work but keeps administrators responsible for Red-risk pets, emergencies, serious complaints, sitter restrictions and major refund decisions.”

PetSaathi Phase 6 — Live Dog-Walk Tracking Module 📍🐕‍🦺

Executive decision

Build a basic, privacy-controlled tracking system during Phase 6.

The Phase 6 version should provide:

Verified start and end events

Periodic GPS samples

Approximate route and distance

Private photo/video updates

Customer-visible service status

Signal-loss detection

Manual fallback evidence

Automatic Report Card data

Do not attempt to build an Uber-style map with second-by-second movement, advanced route reconstruction, geofencing, predictive arrival or permanent route history yet.

The correct product principle is:

Tracking provides structured service evidence and operational visibility. It does not provide perfect proof or guarantee that every GPS point is exact.

GPS readings include an accuracy radius. The W3C Geolocation specification defines accuracy as a 95%-confidence radius measured in metres, so every point should be stored with its accuracy value rather than treated as an exact coordinate.

1. Final end-to-end tracking flow

Confirmed dog-walking booking

↓

Pre-walk readiness check

↓

Sitter arrives at customer location

↓

Sitter selects “I Have Arrived”

↓

System records arrival time and location

↓

Customer handover confirmed

↓

Sitter selects “Start Walk”

↓

Tracking session created

↓

Periodic location samples captured

↓

Customer sees active service status

↓

Sitter uploads private photo/video updates

↓

Signal and service conditions monitored

↓

Sitter selects “End Walk”

↓

Final location sample captured

↓

Duration and approximate distance calculated

↓

Sitter confirms care observations

↓

Report Card generated

↓

Customer receives Report Card

The booking should remain separate from the tracking session. A booking can be valid even when GPS fails, provided an approved fallback process is followed.

2. Correct purpose of tracking

Customer trust

Tracking helps the pet parent understand:

The sitter arrived

The service started

The walk is active

The approximate route or movement was recorded

The service ended

The sitter provided updates

Operational control

Tracking helps PetSaathi detect:

Service not started

Sitter too far from the handover point

Tracking unexpectedly stopped

Walk ended unusually early

Service exceeded expected duration

Sitter forgot to check out

Route evidence requires review

Report automation

Tracking automatically supplies:

Actual start time

Actual end time

Walk duration

Approximate distance

Start and end positions

Number of accepted GPS points

Signal gaps

Tracking exception status

Safety support

Tracking may help during:

Delayed handover

Pet escape

Sitter communication failure

Customer complaint

Incident investigation

It must not be represented as a guarantee that emergencies cannot occur.

3. Recommended Phase 6 scope

Build now

Arrival confirmation

Start Walk action

End Walk action

Periodic GPS samples

Accuracy validation

Approximate distance

Private service timeline

Private media updates

Signal-loss warnings

Manual fallback process

Report Card integration

Admin tracking dashboard

Build later

Second-by-second live movement

Route snapping to roads

Advanced anti-spoofing

Predictive arrival

Automatic route quality scoring

Customer geofences

Multiple-pet route intelligence

Wearable integration

Heat maps

AI walk-quality analysis

4. Application strategy

Customer

The customer can continue using the PetSaathi PWA to:

View service status

See the latest approved location

View private updates

Receive the Report Card

Contact support

Sitter

A sitter-side native Android companion application is strongly recommended for dependable Phase 6 tracking.

Android limits location delivery when an application is operating only in the background. Background location also requires specific permission handling, while a foreground service can continue receiving updates when the screen is off under relevant conditions.

Apple similarly requires background-location capability and clear user communication when an application receives location updates in the background.

Recommended product split

Customer product:

Mobile-first PWA

Sitter operations:

Android companion application

iOS sitter application:

Add when sitter-device demand justifies it

A browser-only sitter implementation may be used for a limited pilot, but it should be described as foreground tracking and tested carefully when the browser is minimised or the phone is locked.

5. Permission and consent flow

Do not request continuous location permission immediately after installation.

Request it when the sitter activates the relevant tracking feature.

Recommended flow

Sitter opens confirmed dog-walk booking

↓

System explains why location is needed

↓

Sitter selects “Enable Walk Tracking”

↓

Operating-system permission requested

↓

Permission result stored

↓

Pre-service tracking test performed

Permission explanation

PetSaathi uses your location only to support and verify an active assigned dog walk. Tracking begins when you start the service and stops when you end it.

Android advises requesting background location only where the feature genuinely requires it and considering less intrusive alternatives when possible.

Permission states

NOT_REQUESTED

FOREGROUND_GRANTED

BACKGROUND_GRANTED

APPROXIMATE_ONLY

DENIED

PERMANENTLY_DENIED

SYSTEM_LOCATION_DISABLED

If permission is denied

Do not silently confirm full tracking.

Possible actions:

Request permission again with explanation

Use foreground-only tracking

Use manual proof workflow

Assign another tracking-capable sitter

Send booking to admin review

6. Pre-walk readiness check

Before displaying Start Walk, validate:

Booking status = CONFIRMED

Payment status = CAPTURED

Sitter is the active primary assignment

Service type = DOG_WALKING

Current time is inside permitted start window

No cancellation exists

No incident hold exists

Location services are available

Pet handover has been confirmed

Readiness states

READY

TOO_EARLY

TOO_LATE

PAYMENT_REVIEW

WRONG_SITTER

LOCATION_PERMISSION_REQUIRED

CUSTOMER_HANDOVER_REQUIRED

SAFETY_HOLD

CANCELLED

The server—not only the mobile interface—must enforce these rules.

7. Arrival confirmation

Arrival and walk start should remain separate events.

Arrival means

The sitter has reached the customer or approved handover location.

Record:

Arrival timestamp

Latitude

Longitude

Accuracy radius

Distance from service address

Sitter ID

Device/session ID

Customer handover result

Why arrival is separate

A sitter may:

Wait for the customer

Receive instructions

Attach the harness

Check the pet’s condition

Resolve an access issue

That time should not automatically count as walking duration.

Arrival validation

Example internal rule:

Accuracy must be acceptable

and

sitter must be within the configured handover radius

Possible initial radius:

50–150 metres

The radius should depend on:

Apartment size

GPS accuracy

High-rise effects

Society entrances

Customer-approved handover point

Never reject an arrival based only on one inaccurate location sample.

8. Starting the walk

When the sitter selects Start Walk, the backend should atomically:

Create tracking session

Set actual start time

Capture first accepted location

Set tracking status = ACTIVE

Set booking status = SERVICE_STARTED

Create audit event

Schedule overdue alerts

Notify customer

Start transaction

Either all critical actions succeed or none should be treated as committed.

A situation such as:

Booking = SERVICE_STARTED

Tracking session = missing

should create an immediate admin alert.

Customer message

Bruno’s walk has started. You will receive private updates during the service.

9. GPS sampling strategy

Do not collect maximum-frequency GPS continuously.

High-accuracy location uses more battery. Android recommends reserving high accuracy for foreground, real-time use cases and using balanced approaches where possible.

Recommended Phase 6 sampling

Active moving walk

Preferred interval: 15–30 seconds

Minimum displacement: 10–25 metres

Low movement or rest

Reduced update frequency

or

distance-based sampling

Server upload

Send small batches every 30–60 seconds

or after 3–5 accepted samples

These values are starting recommendations and must be tested across:

Device models

Android versions

Battery conditions

Network quality

Dense buildings

Parks

Narrow streets

Why batching helps

It reduces:

Network requests

Battery usage

Server write load

Failure risk from sending every point individually

The Android fused provider can deliver location updates through callbacks or pending intents, and cached or batched locations may require timestamp checking and ordering controls.

10. Location-point data model

Each accepted point should contain:

id

tracking_session_id

recorded_at_device

received_at_server

latitude

longitude

accuracy_metres

altitude

speed

heading

provider/source

is_mock_indicator

sequence_number

battery_level

network_state

validation_status

Essential fields

### Table 87

| Field | Purpose |
| --- | --- |
| Timestamp | Orders route points |
| Latitude/longitude | Route position |
| Accuracy | Determines point reliability |
| Sequence number | Detects missing or duplicate points |
| Device time | Shows when location was measured |
| Server receipt time | Shows upload delay |
| Speed | Helps detect impossible movement |
| Validation status | Keeps rejected points auditable |

Tracking session table

tracking_sessions

-----------------

id

booking_id

sitter_id

status

started_at

ended_at

start_location_id

end_location_id

accepted_point_count

rejected_point_count

distance_metres

tracking_gap_seconds

fallback_used

failure_reason

created_at

updated_at

11. Location-point validation

Do not use every received point directly.

Reject or quarantine points when

Latitude or longitude is invalid

Timestamp is missing

Point is older than the active session

Point belongs to another sitter or booking

Accuracy is extremely poor

Speed between points is impossible

Point creates an unrealistic jump

Sequence is duplicated

Tracking has already ended

Suggested accuracy handling

0–30 m:

Good

31–75 m:

Accept with caution

76–150 m:

Low confidence

Above 150 m:

Usually exclude from route distance

but retain for diagnostics

These are internal starting thresholds, not universal GPS guarantees.

The W3C specification requires accuracy to be represented as a radius in metres, making it possible to distinguish precise points from weak readings.

12. Route smoothing and distance calculation

Wrong approach

Add the distance between every raw point without filtering.

GPS drift can create artificial movement even while the sitter is stationary.

Correct Phase 6 process

Receive points

↓

Remove invalid samples

↓

Order by measurement time

↓

Remove major low-accuracy outliers

↓

Reject impossible jumps

↓

Build ordered route line

↓

Calculate approximate distance

Distance methods

Application calculation

Use the Haversine or geodesic distance between consecutive accepted points.

PostgreSQL/PostGIS calculation

Store the route as a geographic line and calculate its geodesic length.

PostGIS ST_Length calculates length for geographic line data using geodesic calculations and returns metres.

Important customer wording

Use:

Approximate distance: 1.8 km

Do not use:

Exact distance: 1.800 km

The displayed value should normally be rounded:

Below 1 km: nearest 50–100 metres

Above 1 km: one decimal place

13. Customer-visible live status

The Phase 6 customer interface does not require a constantly animated map.

Recommended status timeline

6:58 PM — Sitter arrived

7:03 PM — Walk started

7:12 PM — Photo update

7:18 PM — Last tracking update

7:33 PM — Walk completed

7:39 PM — Report Card ready

Tracking card

Show:

Service status

Start time

Elapsed time

Last successful update

Approximate distance

Signal state

Latest approved media

Support action

Signal wording

Normal

Tracking active · Updated 20 seconds ago

Delayed

Location update temporarily delayed. The walk remains active.

Fallback

Live location is unavailable. PetSaathi is collecting alternative service evidence.

Map design

A basic map may display:

Start marker

Recent accepted route

Latest accepted position

End marker after completion

Do not continuously expose exact customer-home coordinates after the service.

14. Photo and video updates

Media provides emotional and visual evidence, while GPS provides movement evidence.

Neither should replace the other completely.

Minimum walk-media rule

At least one private photo

or

one short private video

Upload controls

Validate:

Sitter is actively assigned

Booking is active

File type is permitted

File size is permitted

Upload timestamp belongs to the service period

Media is stored privately

Metadata is handled according to policy

Suggested limits

Photos:

JPEG, PNG or WebP

Compressed before or after upload

Videos:

Short clips

Configured duration and size limit

Privacy

Service media must not automatically be reused for:

Instagram

Advertisements

Public sitter profiles

Testimonials

Training datasets

Marketing consent should be separate.

15. Pee, poop and practical updates

Use structured values rather than only a note field.

Toilet update

PEE_NONE

PEE_ONCE

PEE_MULTIPLE

POOP_NONE

POOP_NORMAL

POOP_SOFT

POOP_DIARRHOEA

POOP_UNUSUAL

Customer-facing language should remain respectful and clear.

Water update

NOT_OFFERED

OFFERED_NOT_DRUNK

DRANK_SMALL_AMOUNT

DRANK_NORMAL_AMOUNT

DRANK_UNUSUAL_AMOUNT

Mood

CALM

PLAYFUL

ENERGETIC

TIRED

ANXIOUS

REACTIVE

UNUSUAL

These are sitter observations, not veterinary diagnoses.

16. Ending the walk

When the sitter selects End Walk, require:

Tracking session is active

Sitter is the assigned sitter

Service has reached minimum valid duration

Final location can be requested

Pet handover or secure-return process is available

The backend should:

Capture final point

Stop location requests

Set actual end time

Calculate duration

Calculate approximate distance

Set tracking status

Set booking = SERVICE_COMPLETED

Generate Report Card draft

Notify customer

Android’s fused-location documentation specifically advises removing location updates once they are no longer needed.

This is also a critical privacy rule: tracking must stop when the authorised service ends.

17. Minimum and maximum duration controls

Early completion

If a 30-minute walk is ended after eight minutes:

Require reason

Notify admin

Prevent automatic normal closure

Possible reasons:

PET_UNWELL

WEATHER

CUSTOMER_REQUEST

EQUIPMENT_FAILURE

SAFETY_CONCERN

PET_REFUSED_WALK

OTHER

Overdue walk

If a 30-minute walk continues significantly beyond the planned period:

Sitter receives reminder

Admin receives alert

Customer sees updated status

The system should not automatically end the service simply because the scheduled time passed.

18. Report Card generation

Automatically generated fields

Booking ID

Pet

Sitter

Scheduled duration

Actual start

Actual end

Actual duration

Approximate distance

Tracking status

Tracking gaps

Start and end evidence

Uploaded media

Sitter-completed fields

Water update

Pee update

Poop update

Mood

Leash behaviour

Interactions

Sitter note

Concern flag

Safe handover

Customer report example

Bruno’s Dog-Walk Report

Started: 7:03 PM

Completed: 7:34 PM

Duration: 31 minutes

Approximate distance: 1.8 km

Water: Drank a small amount

Pee: Once

Poop: Normal

Mood: Energetic and calm

Sitter note:

Bruno pulled slightly near the main road but settled on

the quieter internal route.

Tracking:

Completed with one short signal interruption.

19. Signal-loss workflow

Signal loss is expected occasionally and should not automatically mark the sitter as unreliable.

Detect

For example:

No valid point received for 2–3 expected intervals

Workflow

Signal delay detected

↓

Sitter receives warning

↓

Application retries

↓

Admin alerted after threshold

↓

Customer status changes to delayed

↓

Manual proof requested if delay continues

Fallback evidence

Timestamped photo

Manual checkpoint

Customer call

Start/end location

Sitter explanation

Admin review

Final status

COMPLETED

COMPLETED_WITH_GAPS

FALLBACK_VERIFIED

FAILED_REVIEW_REQUIRED

A tracking failure should not automatically mean the physical service did not happen.

20. Offline operation

The sitter application should tolerate temporary loss of internet.

Offline queue

Store locally:

GPS points

Media-upload references

Service updates

Start/end actions

Report draft

When connectivity returns:

Upload in order

Deduplicate by event ID

Preserve original device timestamps

Confirm server receipt

Important rule

Offline data must be encrypted where feasible and removed from the device after successful synchronisation according to retention policy.

21. Anti-fraud and integrity controls

Phase 6 requires basic integrity checks but not an excessive surveillance system.

Detect

Walk started far from customer location

Impossible speed

Identical repeated route points

Start and end at same point with claimed long distance

Device time manipulation

Multiple active walks from one sitter

Tracking continuing after booking completion

Media uploaded outside service window

Do not automatically punish

GPS errors, high-rise drift and network delays can create false positives.

Use:

Objective flag

↓

Admin review

↓

Evidence comparison

↓

Decision

Possible status:

NORMAL

QUALITY_REVIEW

INTEGRITY_REVIEW

INCIDENT_REVIEW

22. Privacy and data retention

Location data can reveal:

Customer home

Sitter movement

Service patterns

Daily routines

Nearby sensitive locations

It requires stronger controls than ordinary analytics.

India’s official DPDP Rules were published in November 2025 with an enforcement timeline, so PetSaathi should implement transparent notices, purpose limitation, role-based access and defined retention rather than retaining route history indefinitely.

Access

Customer

Can view the authorised route for their own booking.

Assigned sitter

Can view their own active or recent service record.

Operations admin

Can view tracking for service operations.

Safety admin

Can access retained tracking for an incident.

Marketing

No default access.

Suggested retention model

Customer live-view access:

Short period after service

Operational route data:

Configured limited retention

Incident-linked route:

Retained according to incident/legal policy

Analytics:

Aggregated distance and reliability data,

without raw personal route points

Exact periods should be approved through legal and operational review.

23. Suggested API structure

Tracking

POST /api/bookings/:id/arrival

POST /api/bookings/:id/tracking/start

POST /api/tracking/:sessionId/points

POST /api/bookings/:id/service-update

POST /api/bookings/:id/tracking/end

GET /api/bookings/:id/tracking/status

GET /api/bookings/:id/tracking/route

Media

POST /api/bookings/:id/media/presign

POST /api/bookings/:id/media/complete

DELETE /api/bookings/:id/media/:mediaId

Reports

GET /api/bookings/:id/report/draft

PUT /api/bookings/:id/report

POST /api/bookings/:id/report/submit

Admin

GET /api/admin/tracking/active

GET /api/admin/tracking/exceptions

POST /api/admin/tracking/:sessionId/review

POST /api/admin/bookings/:id/incident

24. Security rules

Every tracking request must validate:

Authenticated user

Correct user role

Active assignment or booking ownership

Tracking session belongs to booking

Booking state permits the action

Tracking session is active

Never trust a sitter-supplied:

Booking status

Sitter ID

Start time

Distance

Customer ID

These should be derived or validated by the server.

Route access

Use:

Server-side authorisation

Short-lived access tokens or signed URLs

No raw route coordinates in public URLs

Audit records for admin route access

Sensitive-data redaction from logs

25. Admin dashboard

Live tracking panel

Show:

Active walks

Starting soon

Missing check-in

Tracking not started

Signal delayed

Walk overdue

Fallback required

Incident active

Session detail

Show:

Booking

Pet

Sitter

Customer

Start time

Latest accepted point

Accuracy

Last update age

Distance

Battery/network signals where appropriate

Uploaded media

Alerts

Support actions

Admin actions

Contact sitter

Contact customer

Request manual proof

Mark fallback approved

Open incident

End tracking administratively

Escalate to safety

Admin ending of tracking should require a reason and audit record.

26. Monitoring and alerts

Product metrics

Tracking-eligible walks

Tracking sessions started

Sessions completed

Sessions with signal gaps

Fallback sessions

Failed sessions

Customer tracking views

Technical metrics

Location points received

Rejected point rate

Upload latency

API error rate

Batch size

Database write latency

Notification failures

Reliability targets

### Table 88

| Metric | Phase 6 target |
| --- | --- |
| Tracking sessions started | 90%+ eligible walks |
| Usable route or fallback evidence | 98%+ |
| Sessions ending correctly | 98%+ |
| Tracking after service completion | 0 |
| Cross-booking data exposure | 0 |
| Report draft generation | 99%+ |
| Manual fallback review | Same operating day |

27. Required test cases

Normal flow

Arrive

Start walk

Capture points

Upload photo

End walk

Generate report

Permissions

Permission denied

Approximate location only

Background permission missing

Location services disabled

Permission revoked during service

GPS quality

Poor accuracy

High-rise drift

Impossible coordinate jump

No movement

Rapid movement

Duplicate point

Connectivity

Internet lost after start

Points queued offline

Media upload fails

Application restarts

Duplicate batch uploaded

Service state

Start too early

Start cancelled booking

Wrong sitter starts

Two walks started simultaneously

End too early

Service overdue

Admin ends session

Privacy

Customer accesses another route

Former sitter accesses booking

Route remains visible after expiry

Tracking continues after service end

Raw location appears in logs

28. Definition of done

The Phase 6 basic tracking module is complete only when:

Sitter experience

Sitter can confirm arrival

Sitter can start and end the walk

Tracking continues under approved application conditions

Offline points synchronise correctly

Sitter sees clear permission and signal status

Tracking visibly stops at completion

Customer experience

Customer sees start and completion

Customer receives periodic status

Customer sees approximate distance

Customer sees private updates

Customer understands tracking limitations

Customer receives a Report Card

Operations

Admin sees active walks

Signal loss creates an alert

Fallback evidence can be approved

Early/late completion is reviewed

Incident workflow is connected

Security and privacy

Only authorised users see route data

Tracking occurs only during service

Raw route data has a retention policy

Access is audited

Cross-customer access tests pass

Reliability

90%+ eligible walks start tracking

98%+ have usable route or fallback evidence

Report drafts generate automatically

No tracking remains active after service completion

Final approved Phase 6 tracking model

Sitter arrives

↓

Arrival location recorded

↓

Customer handover confirmed

↓

Start Walk

↓

Periodic validated GPS samples

↓

Private photo/video update

↓

Customer sees status and latest update

↓

End Walk

↓

Tracking stops

↓

Duration and approximate distance calculated

↓

Sitter adds practical observations

↓

Report Card delivered

Final operating principle

Phase 6 tracking should be reliable enough to support trust and operations, but simple enough to handle weak GPS, battery limits, poor networks and real-world service exceptions without pretending that every route is perfectly precise.

Simple explanation for professor

“The Live Dog-Walk Tracking module will provide structured evidence that the service started, continued and ended.

The sitter first opens an assigned and confirmed booking. After reaching the customer, the sitter selects ‘I Have Arrived.’ The system records the arrival time, location and accuracy. Arrival and walk start remain separate because the sitter may need time for the pet handover.

When the sitter selects ‘Start Walk,’ the system records the start time and begins collecting periodic GPS locations. It will not collect location every second because that would consume more battery and network data. Instead, it will collect useful points at controlled time or distance intervals.

Every location point will contain latitude, longitude, timestamp and accuracy. Weak or impossible points will be excluded from the route calculation. The system will calculate an approximate distance after removing inaccurate jumps and GPS drift.

The customer will see a private status timeline, the latest tracking update and photo or video updates. The Phase 6 version does not need a perfect Uber-style animated map.

When the sitter selects ‘End Walk,’ location tracking stops immediately. The system records the final time and location, calculates duration and approximate distance and generates a Report Card draft.

The sitter then confirms water, toilet, mood, leash behaviour and any concerns. If GPS fails, PetSaathi will use fallback evidence such as start and end check-ins, a timestamped photo and an administrator review.

Tracking will occur only during the authorised service. It will not continuously monitor the sitter outside bookings. Raw location access will remain limited to the customer, assigned sitter and authorised operations or safety staff.”

PetSaathi Phase 6 — Automated Pet Report Card Module 🐾📋

Executive decision

Build the Automated Pet Report Card as a structured service record, not as a manually typed message or decorative PDF.

The system should:

Service completed

↓

Report draft generated from booking and tracking data

↓

Sitter completes care observations

↓

Server validates required fields

↓

Concern-free report delivered automatically

or

Concern report sent for admin/safety review

↓

Customer receives dashboard report

↓

WhatsApp/email/push notification sent

↓

Report preserved in booking history

The primary record should live securely inside the PetSaathi dashboard. WhatsApp, email and push notifications should inform the customer that the report is ready and link to the authenticated report rather than exposing sensitive pet, medical or address information directly in notification payloads. Firebase notes that its messages are not end-to-end encrypted and advises additional protection for sensitive data.

1. Main purpose

The Automated Report Card has four operational purposes:

Give customers evidence that the booked service was completed.

Reduce sitter and admin workload by automatically filling reliable booking data.

Create structured quality data for reviews, incidents and sitter performance.

Preserve an auditable service history under the correct booking and pet.

It should not:

Diagnose illness

Automatically declare a pet healthy

Hide sitter-reported concerns

Rewrite important observations into misleading positive language

Use service media publicly without separate permission

2. Correct report-generation flow

Step 1 — Service completion

When the sitter selects Complete Service, the backend records:

Actual end time

Service duration

Tracking status

Completion location where authorised

Pet handover or secured status

Initial concern response

The booking moves from:

SERVICE_STARTED

↓

SERVICE_COMPLETED

The physical service is complete, but the booking is not yet administratively closed.

Step 2 — Automatic draft generation

The system generates a draft using data already stored in the platform.

Automatically populated fields

Booking code

Pet name

Service type

Sitter name

Scheduled date

Actual start time

Actual end time

Actual duration

Approximate walking distance

Tracking status

Arrival/check-in

Completion/check-out

Uploaded photos/videos

These values should not be manually retyped by the sitter.

For example:

Start time comes from the service session.

End time comes from checkout.

Distance comes from validated GPS data.

Sitter name comes from the active assignment.

Pet name comes from the booking snapshot.

This reduces mistakes and prevents the sitter from changing important evidence after the service.

Step 3 — Sitter completes observations

The sitter then enters information that cannot be generated reliably by the system:

Water update

Food update

Pee/poop update

Mood

Behaviour

Tasks completed

Sitter note

Concern flag

Safe handover confirmation

The sitter should use structured options first, with an optional note for additional context.

Step 4 — Server-side validation

Before submission, the backend validates:

Booking belongs to the sitter

Service is completed

Report is linked to the correct booking

Required fields are present

Start time is before end time

Duration is valid

Required media exists or an exception is recorded

Concern response is completed

Safe handover is confirmed

Client-side validation improves usability, but the server must repeat every important validation.

Step 5 — Concern routing

No concern

Concern = NO

↓

Validation passes

↓

Report status = DELIVERED

↓

Customer notified

Concern reported

Concern = YES

↓

Report status = ADMIN_REVIEW_REQUIRED

↓

Operations/safety alert created

↓

Customer contacted where necessary

↓

Incident created if threshold is met

↓

Reviewed report delivered

The sitter’s original observation must remain preserved. Admin staff should not silently replace or soften it.

AVMA advises that health concerns should at minimum prompt veterinary consultation; PetSaathi should therefore escalate observations such as breathing difficulty, seizure activity, serious injury or unusual collapse rather than attempting to diagnose them.

3. Report status model

Use a separate report status rather than overloading the booking status.

DRAFT

AUTO_GENERATED

SITTER_IN_PROGRESS

SUBMITTED

ADMIN_REVIEW_REQUIRED

RETURNED_FOR_CORRECTION

DELIVERED

AMENDED

VOIDED

Meaning

AUTO_GENERATED

The system has created the initial report using booking and service data.

SITTER_IN_PROGRESS

The sitter is completing care observations.

SUBMITTED

The sitter has completed the required fields.

ADMIN_REVIEW_REQUIRED

A concern, contradiction or policy condition requires review.

RETURNED_FOR_CORRECTION

The sitter must correct missing or unclear information.

DELIVERED

The customer can access the approved report.

AMENDED

A later correction exists as a new version.

VOIDED

The report was invalidated through an authorised process, while its history remains available internally.

4. Service-specific report fields

Not every service should use the same form.

Recommended field matrix

### Table 89

| Field | Dog walk | Pet sitting | Boarding |
| --- | --- | --- | --- |
| Actual start time | Required | Required | Required |
| Actual end time | Required | Required | Required |
| Duration | Automatic | Automatic | Automatic |
| Approximate distance | Required when tracked | Not applicable | Not applicable |
| Tracking status | Required | Not applicable | Not applicable |
| Food update | Optional/service-dependent | Required when feeding is scheduled | Required |
| Water update | Required | Required | Required |
| Pee update | Required | Service-dependent | Required |
| Poop update | Required | Service-dependent | Required |
| Mood | Required | Required | Required |
| Behaviour | Required | Required | Required |
| Tasks completed | Optional | Required | Required |
| Photos/videos | Required or exception | Required or exception | Daily requirement or exception |
| Sitter note | Required | Required | Required |
| Concern flag | Required | Required | Required |
| Handover/security confirmation | Required | Required | Required |
| Medication update | Not normally applicable | Required when authorised | Required when authorised |
| Sleep/rest update | Not applicable | Optional | Required |
| Other-pet interaction | Optional | Service-dependent | Required where relevant |

5. Structured observation options

Water update

NOT_REQUIRED

OFFERED_NOT_DRUNK

DRANK_SMALL_AMOUNT

DRANK_NORMAL_AMOUNT

DRANK_UNUSUAL_AMOUNT

Customer-facing wording can remain simple:

Water: Drank a normal amount

Food update

NOT_SCHEDULED

FULL_MEAL_EATEN

MOST_MEAL_EATEN

PARTIAL_MEAL_EATEN

REFUSED_FOOD

VOMITED_AFTER_FOOD

OTHER

VOMITED_AFTER_FOOD should automatically activate the concern workflow.

Pee update

NONE_OBSERVED

ONCE

MULTIPLE_TIMES

UNUSUAL

Poop update

NONE_OBSERVED

NORMAL

SOFT

DIARRHOEA

CONSTIPATION_OBSERVED

UNUSUAL

These are sitter observations, not veterinary diagnoses.

Mood

CALM

HAPPY

PLAYFUL

ENERGETIC

RELAXED

TIRED

ANXIOUS

REACTIVE

UNUSUAL

Allow more than one where appropriate:

Mood: Energetic during the walk; relaxed after returning home.

Behaviour

For walking:

CALM_ON_LEASH

MILD_PULLING

STRONG_PULLING

LUNGED_AT_DOG

LUNGED_AT_PERSON

STARTLED_BY_TRAFFIC

ATTEMPTED_ESCAPE

REFUSED_TO_WALK

OTHER

For sitting or boarding:

FRIENDLY

CAUTIOUS

HIDING

SETTLED_AFTER_TIME

RESOURCE_GUARDING

SEPARATION_DISTRESS

DESTRUCTIVE_BEHAVIOUR

AGGRESSIVE_DISPLAY

OTHER

6. Concern classification

A simple concern = true/false is not enough.

Concern fields

concern_flag

concern_category

severity

description

immediate_action

customer_contacted

vet_contacted

incident_id

Concern categories

HEALTH

BEHAVIOUR

INJURY

ESCAPE_OR_LOSS

MEDICATION

FOOD_OR_ALLERGY

EQUIPMENT

PROPERTY_OR_ACCESS

CUSTOMER_INSTRUCTION

OTHER

Severity

LOW

MEDIUM

HIGH

CRITICAL

Examples

Low

Pet ate less than usual

Mild leash pulling

Slightly anxious initially

Medium

Repeated diarrhoea observation

Strong pulling created handling difficulty

Pet refused normal food

High

Bite or attempted bite

Injury

Medication error

Escape attempt

Critical

Pet missing

Breathing difficulty

Seizure

Serious injury

Immediate danger

A critical concern should trigger phone escalation and should not wait for ordinary Report Card delivery.

7. Customer-facing Report Card

Recommended design

Header

Pet Report Card 🐾

Service summary

Pet: Bruno

Service: 30-minute Dog Walk

Booking: BK-1001

Sitter: Riya

Date: 18 August 2026

Service evidence

Started: 7:30 AM

Completed: 8:02 AM

Duration: 32 minutes

Approximate distance: 1.4 km

Tracking: Completed

Care update

Water: Drank a small amount

Pee: Once

Poop: Normal

Mood: Happy and energetic

Behaviour: Calm on leash with mild pulling near traffic

Media

2 private photos

1 short video

Sitter note

Bruno was energetic and enjoyed the quieter internal route.

He pulled slightly near the main road but settled after moving

away from traffic.

Concern

Concern: None reported

Actions

Book Riya again

Request another walk

Leave a review

Contact support

8. Improved customer example

Pet Report Card 🐾

Pet: BrunoService: 30-minute Dog WalkBooking: BK-1001Sitter: RiyaDate: 18 August 2026

Walk summary

Start: 7:30 AM

End: 8:02 AM

Duration: 32 minutes

Approximate distance: 1.4 km

Tracking: Completed with no major gaps

Bruno’s update

Water: Drank a small amount

Pee: Once

Poop: Normal

Mood: Happy and energetic

Behaviour: Calm on leash; mild pulling near the main road

Concern: None reported

Sitter note

Bruno was energetic and enjoyed the walk. He pulled slightly near traffic but became calm after we moved to the quieter internal route. He returned home safely and was handed back to the owner.

Private service media

2 photos

1 short video

Next actions

Book Riya again

Schedule another dog walk

Leave a review

Contact support

9. Reports with concerns

A concern report should not use frightening or diagnostic language.

Example

Observation

Poop: Soft

Mood: Less energetic than usual

Food: Not applicable

Sitter note

Bruno walked more slowly than during the previous booking and passed soft stool once. He completed the walk and returned home safely.

Customer message

A care observation was reported during Bruno’s service. Please review the Report Card. Contact your veterinarian if the change continues or if you are concerned.

PetSaathi should not say:

Bruno has an infection.

The platform is recording an observation, not making a medical diagnosis.

10. Delivery channels

Dashboard

The dashboard is the canonical, complete report.

Benefits:

Authentication

Correct booking context

Media access control

Amendments and version history

Review and repeat actions

Audit history

Push notification

Example:

Bruno’s Pet Report Card is ready.

The notification should carry only a secure report identifier or deep link.

Firebase Cloud Messaging supports cross-platform notifications, but message-delivery statistics can be delayed or incomplete; PetSaathi should therefore record its own delivery attempts and not assume that a successful provider request means the customer viewed the report.

WhatsApp

Recommended message:

Bruno’s dog-walk Report Card is ready. View the complete private report in PetSaathi: [secure link]

Avoid including:

Full address

Medical history

Emergency contacts

Sensitive incident information

Publicly accessible media links

Email

Email may contain:

Pet name

Service

Date

Short summary

Secure dashboard link

The full report can be attached only when PetSaathi has deliberately designed secure PDF delivery and appropriate access/retention controls. A secure authenticated link is usually easier to revoke or update.

11. Notification reliability

Use a durable notification outbox.

Report delivered

↓

Notification event stored

↓

Push/WhatsApp/email worker processes event

↓

Provider response recorded

↓

Retry applied on temporary failure

↓

Fallback channel used where configured

Firebase recommends timeout handling and retry strategies for failed sends, including exponential backoff for appropriate errors.

Notification statuses

QUEUED

PROCESSING

PROVIDER_ACCEPTED

DELIVERED_WHERE_MEASURABLE

FAILED

RETRY_SCHEDULED

FALLBACK_SENT

EXPIRED

A notification failure must not remove the Report Card from the customer dashboard.

12. Data architecture

booking_reports

id

booking_id

pet_id

sitter_id

service_type

status

actual_start_at

actual_end_at

duration_minutes

distance_metres

tracking_status

concern_flag

concern_severity

submitted_at

delivered_at

current_version

created_at

updated_at

report_observations

report_id

food_status

water_status

pee_status

poop_status

mood_values

behaviour_values

tasks_completed

handover_status

sitter_note

report_media

id

report_id

booking_id

media_type

private_storage_key

uploaded_by

captured_at

processing_status

customer_visible

created_at

report_versions

id

report_id

version_number

snapshot

created_by

change_reason

created_at

report_delivery_attempts

id

report_id

customer_id

channel

status

provider_reference

attempt_count

last_attempt_at

delivered_at

failure_reason

13. Report versioning

Never overwrite a delivered report silently.

Correct amendment flow

Delivered report

↓

Correction requested

↓

Authorised user creates amendment

↓

Reason recorded

↓

New version created

↓

Customer notified

Display:

Version 2

Updated on 18 August 2026 at 9:15 AM

Reason: End time corrected after tracking reconciliation

Preserve the original version internally for audit and dispute handling.

Who may amend

Assigned sitter, before delivery

Operations admin, with a reason

Safety admin, for incident-related information

System, for validated automatic corrections

Customers should be able to report an error, but not directly modify the sitter’s service record.

14. Media privacy and security

Report photos and videos are private operational data.

Uploads should use:

Authenticated uploader

Booking-assignment validation

Allowed file extensions

File-content verification

Size and duration restrictions

Application-generated filenames

Private object storage

Expiring access links

Malware or content scanning where appropriate

OWASP recommends allowlisting permitted extensions, validating content type, renaming files, limiting size, storing files outside the public web root and restricting access to authorised users.

The platform must use HTTPS for APIs and media access.

15. Privacy and retention

The report may contain:

Customer identity

Pet behaviour

Pet-health observations

Home-service history

Location-derived information

Private photographs

Sitter performance information

PetSaathi should clearly explain:

Why the information is collected

Who can access it

How long it is retained

How customers request correction or deletion

When information may be retained for disputes or incidents

India’s DPDP Rules 2025 and their published enforcement timeline make purpose, access and retention controls an important part of production design.

Access rules

Customer

May view reports for their own completed bookings.

Sitter

May view reports they submitted, subject to retention and dispute policies.

Operations admin

May view ordinary service reports.

Safety admin

May access concern and incident-linked reports.

Marketing team

Should not receive automatic access to private report media or medical observations.

16. Automated wording rules

The system may format structured inputs into clear sentences.

Example inputs:

Mood = ENERGETIC

Behaviour = MILD_PULLING

Water = DRANK_SMALL_AMOUNT

Generated text:

Bruno was energetic during the walk. He pulled mildly on the leash and drank a small amount of water.

Safe automation

The formatter may:

Convert codes into readable text

Apply correct grammar

Format dates and times

Group service information

Generate a concise summary

Translate approved standard labels

Unsafe automation

It must not:

Invent observations

Remove a concern

Change “strong pulling” into “calm”

Diagnose anxiety, illness or injury

Claim the pet was happy when the sitter did not select that observation

Add unsupported positive statements

The original structured inputs should always remain available to authorised staff.

17. Suggested APIs

Sitter

GET /api/sitter/bookings/:bookingId/report/draft

PUT /api/sitter/bookings/:bookingId/report

POST /api/sitter/bookings/:bookingId/report/submit

POST /api/sitter/bookings/:bookingId/report/media

Customer

GET /api/customer/bookings/:bookingId/report

GET /api/customer/reports

POST /api/customer/bookings/:bookingId/review

POST /api/customer/bookings/:bookingId/report-issue

Admin

GET /api/admin/reports

GET /api/admin/reports/:reportId

POST /api/admin/reports/:reportId/return-for-correction

POST /api/admin/reports/:reportId/approve

POST /api/admin/reports/:reportId/amend

POST /api/admin/reports/:reportId/open-incident

18. Automation rules by service

Dog walking

Automatically add:

Start/end time

Duration

Approximate distance

Tracking status

Arrival/completion evidence

Media

Require sitter input:

Water

Pee/poop

Mood

Leash behaviour

Concern

Note

Handover

Pet sitting

Automatically add:

Arrival

Start/end time

Duration

Scheduled care tasks

Media

Require sitter input:

Food

Water

Toilet where relevant

Play/rest

Mood

Behaviour

Medication task where authorised

Home security

Concern

Note

Boarding

Use daily reports plus a final checkout report.

Daily update

Food

Water

Toilet

Mood

Behaviour

Rest/sleep

Medication

Other-pet interaction

Media

Concern

Final report

Stay start/end

Overall care summary

Medication record

Incident summary

Final condition

Customer handover

Do not wait until the end of a multi-day boarding stay before recording daily care.

19. Report quality controls

Completeness score

The system may calculate internal completeness:

Required fields complete

Required media present

Concern answered

Note supplied

Handover confirmed

Do not show a misleading public “quality score” to customers.

Contradiction rules

Examples:

Concern = NONE

but

Behaviour = ATTEMPTED_ESCAPE

Food = FULL_MEAL_EATEN

but

Note says pet refused all food

Service = 30-minute walk

but

Duration = 5 minutes

These should trigger:

ADMIN_REVIEW_REQUIRED

20. Operational metrics

Track:

### Table 90

| Metric | Phase 6 target |
| --- | --- |
| Reports automatically drafted | 99%+ completed services |
| Reports delivered | 98%+ |
| Reports delivered within SLA | 95%+ |
| Reports returned for correction | Monitored and decreasing |
| Concern reports reviewed | 100% |
| Missing required media | Below defined threshold |
| Report amendments | Monitored |
| Notification failures | Monitored with retries |
| Customer report views | Tracked |
| Repeat actions from reports | Tracked |

Recommended timing

Dog walking

Draft generated immediately

Sitter submission within 15 minutes

Customer delivery within 30 minutes

Pet sitting

Submission within 30 minutes

Customer delivery within 60 minutes

Boarding

Daily update at agreed time

Critical concern immediately

Final report after checkout

These are internal service targets and should be adjusted after real operating data.

21. Required test cases

Normal flow

Service completed

Draft generated

Sitter fills required fields

Report delivered

Customer opens report

Validation

Missing water update

Missing concern response

End time before start

No media and no exception

Note exceeds length

Invalid structured value

Concern handling

Low concern

Critical concern

Incident created

Customer contacted

Report held for review

Security

Customer accesses another customer’s report

Sitter edits another sitter’s report

Former sitter accesses removed assignment

Public media URL attempted

Admin without safety role accesses restricted concern

Reliability

Notification provider unavailable

Duplicate submit request

Report generator runs twice

Media processing delayed

Database transaction partially fails

Versioning

Sitter corrects draft

Admin amends delivered report

Customer sees latest version

Original version remains in audit history

22. Definition of done

The Automated Pet Report Card module is complete only when:

Automation

A draft is generated for every completed service.

Reliable fields are sourced from system records.

Service-specific forms are used.

Duplicate generation is idempotent.

Sitter experience

The sitter completes the form quickly.

Required fields are clear.

Drafts can be saved.

Concern reporting is prominent.

Submission confirmation is visible.

Customer experience

The report appears in booking history.

Mobile layout is clear.

Media remains private.

The customer receives a notification.

Repeat and review actions are available.

Safety

Concern reports cannot be auto-closed.

Critical observations trigger escalation.

Original sitter observations are preserved.

The platform does not diagnose the pet.

Security

Reports are access-controlled.

Uploads are validated.

Sensitive data is excluded from notification payloads.

Amendments and admin access are audited.

Reliability

Report delivery reaches 98% or more.

Failed notifications are retried.

The dashboard remains the source of truth.

Reports are not lost when a messaging provider fails.

Final approved flow

Sitter completes service

↓

System creates structured draft

↓

Tracking, timing and media added automatically

↓

Sitter adds care observations

↓

Server validates report

↓

Concern-free report delivered

or

Concern sent for safety review

↓

Customer receives dashboard report

↓

WhatsApp/email/push notification sent

↓

Report preserved in booking history

↓

Review and repeat-booking actions enabled

Final operating principle

The Report Card should automate formatting and verified service data while keeping the sitter responsible for factual care observations and keeping authorised people responsible for safety concerns.

PetSaathi Phase 6 — Booking Reminder and Escalation System ⏰🐾

Executive decision

Build the reminder module as a scheduled, multi-channel workflow with escalation, not as a collection of simple WhatsApp messages.

The correct operating model is:

Booking confirmed

↓

Reminder jobs created

↓

Customer and sitter receive role-specific updates

↓

Delivery and acknowledgement tracked

↓

Missing sitter confirmation creates admin alert

↓

Eligible backup sitters suggested

↓

Late or missing service start triggers escalation

Two important corrections:

“Sitter started service” and “service completed” are lifecycle notifications, not reminders.

A fixed 30-minute confirmation deadline is suitable only for bookings sufficiently far in the future. Urgent bookings need a shorter response deadline.

1. Reminder types

Separate notifications into four categories.

A. Transactional confirmation

Sent because an important booking event has occurred:

Booking confirmed

Sitter assigned

Payment verified

Booking rescheduled

Booking cancelled

Replacement sitter assigned

B. Scheduled reminder

Sent before an expected action:

Service tomorrow

Service in two hours

Service in one hour

Service in 30 minutes

Sitter must check in

Report Card overdue

C. Live service update

Generated by an actual service event:

Sitter arrived

Service started

Photo update available

Service completed

Report Card ready

D. Operational alert

Sent to administrators when expected behaviour does not occur:

Sitter has not acknowledged

Sitter has not checked in

Service has not started

Notification delivery failed

Backup sitter required

This separation prevents the platform from treating every message as the same type of communication.

2. Recommended customer reminder schedule

### Table 91

| Trigger | Timing | Purpose |
| --- | --- | --- |
| Booking confirmed | Immediately | Confirm sitter, time, service and payment |
| Pre-service reminder | Previous evening or 24 hours before | Let customer update health/access instructions |
| Final reminder | 1 hour before | Prepare pet, harness, keys and access |
| Sitter arrived | Event-based | Show that the sitter reached the location |
| Service started | Event-based | Confirm active service |
| Service completed | Event-based | Confirm physical service ended |
| Report Card ready | Event-based | Provide service record |
| Review request | After report delivery | Collect feedback |
| Repeat offer | After successful service | Encourage rebooking |

Why add a previous-day reminder?

A one-hour reminder is too late to resolve:

Changed access instructions

Pet illness

Incorrect address

Missing harness

Customer unavailability

New medication

Society gate permissions

The previous-day message should include a simple action:

Has anything changed about your pet’s health, behaviour, address access or care instructions?

3. Recommended sitter reminder schedule

### Table 92

| Trigger | Timing | Required action |
| --- | --- | --- |
| Booking offer | Immediately | Accept or decline |
| Final assignment | Immediately after payment confirmation | Acknowledge assignment |
| Service reminder | 2 hours before | Reconfirm availability and travel |
| Final travel reminder | 30 minutes before | Begin travel or confirm arrival plan |
| Check-in warning | 10–15 minutes before | Open booking and prepare check-in |
| Late-start warning | At scheduled time or grace threshold | Start service or contact support |
| Service-overdue reminder | Near expected end | Complete or explain extension |
| Report reminder | Immediately after completion | Submit Report Card |
| Report-overdue alert | 15–30 minutes after completion | Complete missing report |

A sitter accepting an offer and acknowledging a final paid assignment are related but separate actions:

Offer accepted provisionally

↓

Customer payment captured

↓

Booking confirmed

↓

Sitter acknowledges final assignment

4. Sitter confirmation deadline

Do not use one deadline for every booking

Use a dynamic deadline based on how soon the service starts.

### Table 93

| Time remaining before service | Confirmation deadline |
| --- | --- |
| More than 24 hours | Within 30 minutes |
| 2–24 hours | Within 15 minutes |
| Less than 2 hours | Within 5 minutes |
| Emergency booking | Immediate operations confirmation |

Confirmation workflow

Booking confirmed

↓

Sitter acknowledgement requested

↓

Deadline calculated

↓

Sitter acknowledges?

Yes

assignment_acknowledged = true

booking readiness = READY

No

Admin alert created

↓

Sitter contacted through fallback channel

↓

Eligible backup candidates generated

↓

Primary sitter given final short grace period

↓

Replacement or cancellation decision

Recommended states

PENDING_ACKNOWLEDGEMENT

ACKNOWLEDGED

ACKNOWLEDGEMENT_OVERDUE

REPLACEMENT_REVIEW

REPLACED

CANCELLED

5. Backup sitter suggestion

A missed confirmation should not immediately assign a random backup.

Eligibility filters

The suggested backup must have:

Active verification

Correct service permission

Required pet-size permission

Required risk permission

Availability

No schedule conflict

Safe travel time

Remaining workload capacity

No active restriction

Backup workflow

Primary acknowledgement overdue

↓

Eligible backups generated

↓

Admin sees ranked candidates

↓

Backup offers sent

↓

One valid acceptance locked

↓

Customer informed

↓

Replacement receives instructions

The original primary assignment must remain in history with the reason:

PRIMARY_NOT_ACKNOWLEDGED

Do not charge the customer again when replacing a sitter.

6. Service-not-started escalation

The system should compare the scheduled time with actual check-in and service-start events.

Example escalation policy

T−15 minutes

Confirm sitter app is active

Show check-in reminder

Scheduled start time

Mark booking as START_DUE

Notify sitter

T+5 minutes

Admin warning

Check sitter location or response

Notify customer that the service status is being checked

T+10 minutes

Operations owner assigned

Backup availability checked

Contact sitter by phone

T+15 minutes

Booking enters REPLACEMENT_REQUIRED or documented delay

Customer receives concrete update

Reliability event recorded

These thresholds are proposed operating rules and can be modified after observing actual travel and society-entry conditions.

7. Notification channels

Channel hierarchy

### Table 94

| Channel | Best use |
| --- | --- |
| WhatsApp | Confirmations, reminders and service updates |
| Push/Web Push | Timely app/PWA updates |
| SMS | Critical backup where WhatsApp/push fails |
| Email | Receipts, policies, Report Cards and formal records |
| In-app timeline | Canonical booking status |
| Phone | Urgent active-service or safety escalation |

Important correction about push notifications

Push does not necessarily need to wait for a native customer app. Standards-based Web Push can work in supported browsers and installed web apps, including Apple web apps, so PetSaathi may add PWA push during Phase 6 if useful. It should still remain an optional channel because users may deny notifications or use unsupported configurations.

“In-app notification” is not a reliable external reminder by itself because the customer must open the application to see it.

8. WhatsApp implementation

Booking confirmations and appointment-style reminders are normally suitable as utility messages because they follow a user’s booking action. Meta classifies utility templates as messages that follow up on user actions or requests.

Template requirement

Outside the active WhatsApp customer-service window, PetSaathi must use approved message templates rather than arbitrary free-form messages.

Recommended templates:

booking_confirmed

customer_service_reminder_1h

sitter_assignment_acknowledgement

sitter_service_reminder_2h

sitter_service_reminder_30m

service_started

service_completed

report_ready

replacement_proposed

Delivery tracking

Store provider message IDs and process WhatsApp status webhooks for states such as sent, delivered and read where available.

Do not interpret “API request accepted” as proof that the user read the message.

9. SMS backup and India compliance

SMS should be a fallback, not the default for every routine message.

For commercial or service communications in India, PetSaathi must follow applicable TRAI sender registration, consent and template requirements. TRAI states that senders need registered templates and customer consent structures for commercial communications, while the DLT framework is used for sender, consent and content-template records.

Use SMS mainly for:

Sitter assignment requiring immediate action

Service about to start and WhatsApp delivery failed

Replacement request

Active-service problem

Payment or cancellation action that cannot wait

Avoid putting sensitive content in SMS:

Incorrect:

Bruno has medication at [full address] and the key is under the door.

Correct:

Action required for booking BK-1001. Open PetSaathi or contact support.

10. Push notification rules

Use normal priority for non-urgent information:

Booking receipt

Report Card ready

Review reminder

Repeat offer

Use high priority only for genuinely time-sensitive, visible events:

Sitter delayed

Service starting soon

Replacement required

Active-service support update

Firebase states that normal-priority delivery may be delayed in battery-saving modes, while high-priority delivery is intended for time-sensitive user-visible content. Overusing high priority can lead to deprioritisation.

Message expiry

Time-sensitive reminders should have a short time-to-live.

Example:

30-minute service reminder:

TTL = 45 minutes

Service-start alert:

TTL = 10–15 minutes

Report ready:

TTL = 24 hours

Without a suitable expiry, a device that reconnects later might show an obsolete “service starts in 30 minutes” notification after the service has ended. FCM supports configurable message lifespans for this purpose.

11. System architecture

Booking event occurs

↓

Reminder scheduler calculates future jobs

↓

Jobs stored in database

↓

Worker selects due jobs

↓

Current booking state revalidated

↓

Notification outbox entry created

↓

Channel adapter sends message

↓

Provider result recorded

↓

Retry or fallback applied

↓

Escalation engine checks acknowledgement

Why revalidate before sending?

A reminder created three days earlier may no longer be valid because the booking was:

Cancelled

Rescheduled

Reassigned

Refunded

Completed early

Placed on incident hold

The worker must check current state immediately before transmission.

12. Required database tables

reminder_jobs

id

booking_id

recipient_user_id

recipient_role

reminder_type

scheduled_at

timezone

status

idempotency_key

cancelled_reason

created_at

processed_at

notification_outbox

id

event_type

booking_id

recipient_id

preferred_channel

template_code

payload

status

available_at

attempt_count

created_at

notification_deliveries

id

outbox_id

channel

provider_message_id

status

sent_at

delivered_at

read_at

failed_at

failure_code

assignment_acknowledgements

id

booking_id

assignment_id

requested_at

deadline_at

acknowledged_at

status

escalated_at

Reminder statuses

SCHEDULED

QUEUED

PROCESSING

SENT

DELIVERED

READ

FAILED

RETRY_SCHEDULED

CANCELLED

EXPIRED

Not every provider supports reliable read status, so DELIVERED or READ may be unavailable for some channels.

13. Idempotency and duplicate prevention

Each reminder should have a unique key such as:

booking_id

+ recipient_id

+ reminder_type

+ booking_schedule_version

Example:

BK-1001:ST-004:SITTER_30_MIN:VERSION_3

This prevents:

Duplicate WhatsApp messages

Two workers sending the same reminder

Old reminders firing after rescheduling

Repeated admin alerts

If a booking is rescheduled, increment its schedule version and cancel all jobs belonging to the previous version.

14. Reminder content rules

Every reminder should answer:

What happened?

What must the person do?

By when?

Where can they see secure details?

How can they get help?

Customer confirmation

Bruno’s dog walk is confirmed for 18 August at 7:30 AM with Riya. Payment has been verified. View preparation instructions in booking BK-1001.

Customer one-hour reminder

Bruno’s walk starts in one hour. Please keep the harness ready and update PetSaathi immediately if Bruno is unwell or the access instructions have changed.

Sitter two-hour reminder

Booking BK-1001 begins at 7:30 AM in Bopal. Please confirm your travel plan and review Bruno’s handling instructions.

Sitter 30-minute reminder

Bruno’s walk begins in 30 minutes. Open the assigned booking and prepare to check in on arrival.

Admin acknowledgement alert

Sitter acknowledgement is overdue for BK-1001. Service begins at 7:30 AM. Three eligible backup candidates are available.

Keep addresses, health records and emergency-contact details behind authenticated access rather than exposing them on device lock screens.

15. Customer notification preferences

Allow users to choose non-critical channels:

WhatsApp

Push

Email

SMS backup

However, essential service communications should be clearly distinguished from marketing.

Examples of essential service communication:

Payment confirmation

Service reminder

Replacement

Delay

Cancellation

Report availability

Examples of marketing:

Discount campaign

Promotional walking pack

Referral promotion

New service advertisement

Marketing consent should not be treated as consent for every service channel, and users should receive messages they reasonably expect. Meta’s integrity guidance likewise says businesses should message users who expect the communication, including appointment reminders.

16. Admin reminder dashboard

The admin dashboard should show:

Upcoming risk

Services starting within 2 hours

Sitters not acknowledged

Customers with missing instructions

Payment exceptions

Immediate attention

Services starting within 30 minutes

Sitter reminder delivery failed

No check-in

No service start

Replacement required

Notification health

WhatsApp failures

SMS fallback sent

Push tokens invalid

Email bounces

Retry queue

Provider outage

Admin actions

Call sitter

Send reminder again

Switch channel

Suggest backup

Replace sitter

Notify customer

Cancel booking

Open incident

17. Success metrics

### Table 95

| Metric | Phase 6 target |
| --- | --- |
| Booking-confirmation notification created | 99.9%+ |
| Pre-service reminders processed | 98%+ |
| Sitter final acknowledgement | 95%+ |
| Sitter acknowledgement before deadline | 90%+ |
| WhatsApp delivery where measurable | Monitor by template |
| Critical fallback triggered correctly | 98%+ |
| Duplicate reminder rate | Below 0.1% |
| Obsolete reminder after cancellation | 0 |
| Services started on time | 95%+ |
| Sitter no-shows | Below 3–5% |
| Admin alert created for missed acknowledgement | 100% |
| Backup suggestions generated when eligible | 95%+ |

Measure outcomes too:

Late arrivals before and after reminders

No-show reduction

Admin calls per booking

Customer support contacts

Replacement success

Manual reminder workload

The module is successful only when it improves operations—not merely when it sends more messages.

18. Required test cases

Scheduling

Booking created five days early

Booking created 45 minutes before service

Booking rescheduled

Booking timezone is correct

Daylight/date boundary

Duplicate job worker

Cancellation and replacement

Booking cancelled before reminder

Sitter replaced after reminder jobs exist

Customer changes time

Payment expires

Incident hold created

Delivery

WhatsApp delivered

WhatsApp template rejected

WhatsApp provider unavailable

SMS fallback works

Push permission denied

Push token expired

Email bounced

Acknowledgement

Sitter confirms on time

Sitter confirms after alert

No confirmation

Two backup sitters accept simultaneously

Primary confirms after replacement has begun

Service start

Starts on time

Starts late

Check-in exists but service does not start

Wrong sitter attempts to start

Cancelled booking attempts to start

Privacy

Sensitive pet details exposed in lock-screen message

Customer receives another booking’s reminder

Removed sitter receives future reminders

Full address appears in SMS logs

19. Definition of done

The reminder module is complete only when:

Scheduling

Every confirmed booking creates correct reminder jobs.

Rescheduling cancels obsolete jobs.

Cancellation suppresses future reminders.

Short-notice bookings use compressed schedules.

Delivery

WhatsApp utility templates are configured.

SMS fallback follows the required sender/template process.

Email and in-app timelines work.

Push supports appropriate priority and expiry.

Provider failures are retried safely.

Escalation

Missing sitter acknowledgement creates an admin alert.

Backup candidates are eligibility-filtered.

Missing check-in and late start are detected.

Customer receives accurate delay or replacement updates.

Security

Notifications contain minimal sensitive information.

Secure details require authentication.

Recipient and booking ownership are validated.

Notification activity is audited.

Reliability

Duplicate messages are prevented.

Stale reminders never fire after cancellation or rescheduling.

Provider acceptance is not confused with actual delivery.

Critical events have a second channel or human fallback.

Final approved reminder flow

Booking confirmed

↓

Customer confirmation sent

↓

Sitter final acknowledgement requested

↓

No acknowledgement by dynamic deadline?

├── No → Continue

└── Yes → Admin alert + backup suggestions

↓

Previous-day customer readiness reminder

↓

Two-hour sitter reminder

↓

One-hour customer reminder

↓

Thirty-minute sitter reminder

↓

Sitter checks in

↓

Service starts

↓

Customer receives start notification

↓

Service completes

↓

Customer receives completion and Report Card notifications

Final operating principle

A booking reminder system succeeds when it causes the correct person to take the correct action before a problem occurs—not merely when a message is sent.

PetSaathi Phase 6 — Backup Sitter and Service-Continuity System 🛡️🐾

Executive decision

Build the backup sitter system, but do not permanently reserve a named backup for every ordinary booking.

Use three coverage levels:

### Table 96

| Coverage level | Suitable bookings | Backup treatment |
| --- | --- | --- |
| Candidate coverage | Routine Green-risk walks | Eligible replacement pool is available |
| Soft standby | First booking, repeat plan, Yellow-risk service | One or more sitters are warned and rechecked before service |
| Hard standby | Boarding, high-value sitting, critical recurring booking | Named backup explicitly accepts standby responsibility |

The correct operating principle is:

A backup is useful only when they remain eligible, available, close enough and able to take over within the required recovery time.

Keeping spare capacity improves reliability when something goes wrong, but it also has a cost. PetSaathi should therefore reserve backup capacity according to booking impact rather than treating every service identically.

1. Correct booking responsibility structure

Every important confirmed booking should have these operational roles:

### Table 97

| Role | Responsibility |
| --- | --- |
| Primary sitter | Delivers the scheduled service |
| Backup candidate or standby sitter | Replaces the primary when required |
| Operations owner | Monitors readiness and makes replacement decisions |
| Safety escalation owner | Handles serious pet, customer or sitter concerns |
| Veterinary contact | Provides professional emergency-care support where required |

Important correction

The veterinary contact is not part of the sitter-assignment chain.

The vet or emergency clinic should be used for:

Illness or injury

Medication concern

Bite or escape incident

Veterinary advice or treatment

Emergency-care coordination

AVMA guidance recommends preparing veterinarian, emergency-hospital and care-authorisation information before the pet owner is away; many sitters, boarding facilities and clinics use emergency-authorisation forms for this purpose.

2. End-to-end backup workflow

Booking request submitted

↓

Pet, service and area reviewed

↓

Primary sitter candidates generated

↓

Primary sitter provisionally accepts

↓

Customer payment verified

↓

Booking confirmed

↓

Backup coverage level calculated

↓

Eligible replacement pool created

↓

Primary sitter acknowledges booking

↓

Pre-service readiness checks run

↓

Primary unavailable?

┌───────────┴───────────┐

No Yes

↓ ↓

Service proceeds REPLACEMENT_REQUIRED

↓

Backup eligibility rechecked

↓

Replacement offer sent

↓

Valid acceptance transactionally locked

↓

Customer informed

↓

Service reconfirmed

The operations owner must remain available during the active service window and be ready to diagnose, mitigate or escalate failures. This is the operational equivalent of an on-call role.

3. Backup coverage types

A. Candidate coverage

Use for:

Routine Green-risk dog walks

Normal daytime bookings

Areas with strong sitter density

Services with sufficient replacement time

The system stores a live list of eligible replacements, but no sitter is formally blocked from other work.

Example:

Booking BK-1001

Primary: Riya

Eligible backup pool: Aditi, Meera, Kavya

Named standby: None

Benefit

Low cost and flexible capacity.

Limitation

A candidate may no longer be available when an emergency occurs.

B. Soft standby

Use for:

First-time customer bookings

Yellow-risk walking

Weekly or package commitments

Peak-hour services

Bookings where customer trust is especially important

Sitter with a recent reliability concern

A sitter receives advance notice such as:

You are currently an eligible backup candidate for BK-1001 between 7:00 and 8:00 AM. This is not yet an assignment. Confirm whether you are likely to remain available.

The system should recheck the soft standby before the service.

Soft standby does not mean

The sitter is fully assigned

The sitter must refuse all other work

The sitter will receive the primary payout

The customer can see them as confirmed

C. Hard standby

Use selectively for:

Boarding

Overnight sitting

High-value bookings

Yellow-risk services with specialised handling

Critical recurring plans

Bookings where failure would leave a pet without care

Services with few replacement candidates

The backup sitter explicitly accepts a defined standby period.

Example:

Standby window: 18 August, 6:00 PM–10:00 PM

Response requirement: 5 minutes

Maximum arrival time: 30 minutes

Standby compensation: ₹X

Conversion payout: normal replacement payout

Compensation rule

If PetSaathi requires a sitter to remain genuinely available and decline other work, the standby arrangement should include transparent compensation.

Otherwise, “reserved backup” is only a label and not dependable capacity.

4. When to release the backup

The proposed flow says:

Primary confirms

↓

Backup released

That releases the backup too early.

Primary acknowledgement does not guarantee that the sitter will:

Remain healthy

Reach the customer

Pass the final readiness check

Avoid transport failure

Avoid a previous-booking delay

Correct release timing

Routine dog walk

Soft backup may be released after:

Primary checks in

+ location/readiness checks pass

+ service starts successfully

Pet sitting

Release after:

Primary enters the property

+ pet handover/access succeeds

+ service starts

Boarding

Do not release merely when boarding begins.

Maintain fallback capability through a defined higher-risk period, such as:

First handover and settling period

First few hours

First night

Entire stay for medically complex care, depending on policy

For multi-day boarding, the fallback may be another approved host, an emergency home sitter or a safe transfer plan—not necessarily one sitter remaining idle for the entire stay.

5. Backup eligibility rules

A backup must satisfy every hard rule applied to the primary sitter.

Required matching filters

Active sitter status

Current identity/verification status

Correct service approval

Correct pet-type permission

Correct pet-size permission

Service-specific risk permission

Required medication or handling capability

Availability during replacement window

Acceptable travel time

No overlapping booking

Daily workload capacity

No active safety restriction

Same area

“Same area” should mean practical response ability, not merely the same city field.

Use:

Current or planned location

Estimated travel duration

Society-entry delay

Traffic conditions

Transport method

Required arrival deadline

Same pet-risk level

A more precise rule is:

The backup must be approved for the required service-specific controls.

Example:

Pet walking assessment: Yellow

Required controls:

• large-dog approved

• strong-pulling experience

• owner harness demonstration

A sitter being generally marked “Yellow approved” is not enough if they lack the particular handling capability.

6. Reliability score use

Reliability should be a transparent scorecard, not a single mysterious number.

Useful components

On-time rate

Completed-assignment rate

Cancellation rate

No-show rate

Offer-response time

Report Card timeliness

Customer rating

Same-sitter requests

Complaint history

Incident history

Current workload

Example backup candidate

Aditi P.

Travel time: 12 minutes

Service approval: Dog walking

Large-dog handling: Approved

On-time rate: 97%

Cancellation rate: 1.8%

No-show rate: 0%

Report completion: 99%

Current capacity: Available

Do not select only by rating

A sitter with a 5.0 rating from two services may be less reliable evidence than a sitter with a 4.8 rating across forty completed assignments.

7. Backup state model

Use a separate standby or backup status.

IDENTIFIED

ELIGIBILITY_CONFIRMED

SOFT_STANDBY_OFFERED

SOFT_STANDBY_ACCEPTED

HARD_STANDBY_OFFERED

HARD_STANDBY_ACCEPTED

RELEASED

REPLACEMENT_OFFERED

REPLACEMENT_ACCEPTED

REPLACEMENT_ASSIGNED

DECLINED

EXPIRED

UNAVAILABLE

REMOVED

Primary assignment states

OFFERED

ACCEPTED_PROVISIONALLY

ASSIGNED

ACKNOWLEDGED

CHECKED_IN

SERVICE_STARTED

COMPLETED

CANCELLED

NO_SHOW

REMOVED

Booking exception states

REPLACEMENT_REVIEW

REPLACEMENT_REQUIRED

REPLACEMENT_IN_PROGRESS

RECONFIRMATION_REQUIRED

CANCELLED

INCIDENT_HOLD

Do not represent all of these inside one booking_status enum.

8. Pre-service readiness checks

Run automated checks at multiple points.

After confirmation

Primary sitter acknowledged

Backup coverage calculated

Emergency information complete

Customer instructions complete

Previous evening

Primary availability reconfirmed

Verification remains current

No schedule conflict

Backup candidates refreshed

Customer health/access update requested

Two hours before service

Primary travel plan confirmed

Phone/app reachable

Current location makes arrival feasible

No previous booking likely to overrun

Backup pool revalidated

Thirty minutes before service

Primary is preparing or travelling

Customer remains available

Hard standby remains responsive

Admin alert created when readiness is uncertain

9. Replacement triggers

The backup workflow may begin when:

Primary sitter cancels

Primary fails acknowledgement deadline

Primary is unreachable

Primary is likely to arrive too late

Verification expires or is revoked

Primary reports illness

Transport failure occurs

Previous booking overruns

Pet requirements change

Admin removes primary for safety

Customer rejects proposed primary

Do not replace automatically for

Minor temporary notification delay

One weak GPS reading

Customer has not yet answered a non-critical message

A sitter correctly reports arriving within the approved grace period

The system should generate objective flags; the operations owner decides when uncertainty remains.

10. Replacement process

Step 1 — Freeze unsafe transitions

When replacement begins:

booking.status = REPLACEMENT_REQUIRED

primary_assignment.status = REMOVED or CANCELLATION_PENDING

Prevent the original sitter from starting the service unless operations explicitly restores them.

Step 2 — Recalculate candidate pool

Do not rely only on a backup list generated days earlier.

Recheck current:

Availability

Travel time

Workload

Verification

Pet controls

Conflicts

Step 3 — Send time-limited offers

Example:

Offer expires in 3 minutes

Required arrival: 7:25 AM

Pet: Labrador, 28 kg

Controls: Strong-pulling experience required

Payout: ₹X

Step 4 — Lock the first valid acceptance

Two sitters may accept at the same time.

The database must guarantee that only one becomes the active replacement. PostgreSQL transactions and locks coordinate concurrent changes, while range exclusion constraints can prevent overlapping sitter assignments.

Step 5 — Customer approval

Customer approval should be required when:

Sitter identity changes after confirmation

Replacement affects arrival time

New caregiver has not served the pet

Booking contains sensitive home access

Policy promises customer approval

For urgent safety situations, policy may allow admin-led emergency replacement, but the customer must be informed immediately.

Step 6 — Reconfirm booking

Replacement assigned

↓

Instructions released securely

↓

Customer notified

↓

New start time confirmed

↓

Booking returns to CONFIRMED

11. Database design

booking_assignments

id

booking_id

sitter_id

role

status

offered_at

accepted_at

assigned_at

acknowledged_at

checked_in_at

removed_at

removal_reason

created_at

Roles:

PRIMARY

BACKUP

REPLACEMENT

SUPERVISOR

booking_backup_candidates

id

booking_id

sitter_id

coverage_type

eligibility_status

estimated_travel_minutes

eligibility_checked_at

standby_start_at

standby_end_at

standby_status

standby_compensation

released_at

release_reason

replacement_events

id

booking_id

original_assignment_id

trigger_code

triggered_at

triggered_by

operations_owner_id

replacement_deadline

outcome

resolved_at

backup_offer_events

id

replacement_event_id

sitter_id

offered_at

expires_at

viewed_at

response

response_reason

12. Concurrency and database protection

The application must prevent:

Two active primary sitters

Two active replacements

Same sitter accepting overlapping services

Primary starting after being removed

Backup assignment from stale eligibility data

Recommended protections

One active primary assignment

Use a partial unique index conceptually equivalent to:

CREATE UNIQUE INDEX one_active_primary_per_booking

ON booking_assignments (booking_id)

WHERE role IN ('PRIMARY', 'REPLACEMENT')

AND status IN ('ASSIGNED', 'ACKNOWLEDGED', 'CHECKED_IN', 'SERVICE_STARTED');

Prevent overlapping sitter schedules

PostgreSQL range types and exclusion constraints can enforce non-overlapping time ranges at the database layer instead of relying only on frontend checks.

Transactional replacement

Inside one transaction:

Lock booking

Recheck current state

Recheck sitter eligibility

Remove old active assignment

Assign replacement

Add status history

Create notifications

Commit

Explicit locking must be designed consistently because inconsistent lock ordering can create deadlocks.

13. Admin owner responsibilities

The admin owner is not merely a name stored on the booking.

They must:

Monitor primary acknowledgement

Review backup coverage

Respond to readiness alerts

Initiate replacement

Communicate with the customer

Verify new sitter eligibility

Make cancellation/refund decisions

Open an incident where required

Record final outcome

For a major service failure, clear command and communication responsibilities reduce confusion. Google’s incident-response guidance recommends explicit roles such as an incident commander, communications lead and operations lead.

During a small launch, one person may hold several roles, but responsibilities must still be explicit.

14. Customer communication

Primary cancellation

Your assigned sitter is no longer available. PetSaathi is reviewing qualified local replacements. Your booking is temporarily on hold, and we will update you shortly.

Replacement proposed

A verified replacement sitter, Aditi, is available for Bruno’s walk. Her estimated arrival is 7:20 AM. Please review and approve the updated assignment.

Replacement confirmed

Aditi is now confirmed for booking BK-1001. Your payment remains linked to the same booking, and no additional charge has been made.

No replacement available

We could not find a qualified sitter who could reach the service safely and on time. You may choose another time, join the priority waitlist or cancel for the applicable refund.

Do not claim “backup guaranteed” unless a hard-standby arrangement genuinely provides that guarantee.

15. Boarding backup strategy

Boarding needs a more detailed continuity plan than walking.

Primary boarding host failure before check-in

Possible options:

Approved replacement host

In-home pet sitter

Alternative date

Full cancellation/refund

Customer keeps the pet until a safe option exists

Host failure after check-in

The plan must define:

Who can transport the pet

Customer approval requirements

Replacement property

Resident-pet compatibility

Food and medication transfer

Veterinary records

Emergency contact

Handover evidence

Recommended boarding coverage

Named backup host or alternate care plan

+ operations owner

+ transport option

+ emergency veterinary contact

A backup host must not be used without:

Property approval

Capacity check

Resident-animal compatibility

Service-specific risk approval

Customer notification

Keep backup active longer

For boarding:

Revalidate at check-in

Maintain fallback through the initial settling window

Recheck daily for multi-day stays

Keep emergency transfer contacts available for the whole stay

16. Standby payout and fairness

Track these separately:

standby_fee

replacement_service_payout

travel_compensation

late-notice premium

cancelled-standby outcome

Recommended policy

Candidate coverage

No standby payment because no capacity is formally reserved.

Soft standby

Small fee or operational incentive may be appropriate when the sitter commits to fast availability.

Hard standby

Compensation should normally be provided because the sitter is reserving time and capacity.

Converted replacement

Once the sitter becomes the active replacement, normal service payout rules apply, possibly with an urgent-replacement premium.

This prevents PetSaathi from creating reliability by transferring all standby costs to sitters.

17. Metrics and targets

Coverage metrics

### Table 98

| Metric | Recommended target |
| --- | --- |
| Priority bookings with eligible backup coverage | 80%+ |
| Boarding/high-criticality coverage | 100% |
| Coverage revalidated before service | 95%+ |
| Backup candidate eligibility errors | 0 critical errors |

Replacement metrics

### Table 99

| Metric | Recommended target |
| --- | --- |
| Replacement success when eligible backup exists | 80%+ |
| Median replacement decision | Under 10 minutes |
| Replacement assigned before scheduled time | Increasing |
| Customer replacement acceptance | Tracked |
| Service completion after replacement | 90%+ |
| Double assignment | 0 |

Quality metrics

Primary cancellation rate

Primary acknowledgement failures

Replacement travel time

Customer complaints after replacement

Refunds after failed replacement

Backup sitter no-show

Emergency transfer incidents

18. Failure scenarios

Primary confirms, then cancels

Do not assume confirmation closed the continuity workflow.

Recheck candidate coverage and begin replacement.

Backup is no longer available

Remove the backup and rerun matching. Never show stale coverage as active.

Two backups accept

Use transactional assignment so only one succeeds. Inform the unsuccessful sitter immediately.

Primary arrives after replacement is assigned

The primary must not perform the service unless operations explicitly reverses the replacement before service start.

Replacement has lower capability

Do not assign them merely because they are available.

Offer another time, change service or cancel.

Customer does not approve replacement

According to policy:

Offer another sitter

Offer rescheduling

Process cancellation/refund

Record customer decision

No replacement exists

Do not send an unverified or inappropriate person.

WAITLIST

RESCHEDULE

ALTERNATIVE_SERVICE

CANCEL_AND_REFUND

are safer outcomes.

19. Monitoring and alerts

Alert when

Primary acknowledgement overdue

Primary cancels

Primary appears unable to arrive

Backup coverage disappears

Hard standby becomes unreachable

Replacement offer expires

No replacement accepted

Two active assignments detected

Boarding continuity plan incomplete

Dashboard views

Today’s continuity risk

Confirmed bookings

Primary readiness

Backup coverage level

Operations owner

Service start time

Replacement deadline

Replacement queue

Trigger

Time remaining

Candidates

Offers sent

Customer status

Refund exposure

Capacity

Available primary sitters

Soft standby sitters

Hard standby sitters

Backup-only windows

Area shortages

Monitoring capacity and hard resource limits is necessary for avoiding overload and unreliable promises.

20. Required test cases

Normal

Primary confirms

Candidate coverage exists

Service starts

Backups released correctly

Confirmation failures

Primary never acknowledges

Primary confirms late

Primary confirms after replacement started

Replacement

One backup accepts

Two backups accept simultaneously

Backup becomes unavailable

No backup exists

Customer rejects replacement

Scheduling

Backup has overlapping booking

Travel time becomes too high

Previous booking overruns

Sitter capacity becomes full

Boarding

Host cancels before handover

Host cannot continue after check-in

Replacement property unsuitable

Emergency transfer needed

Security

Unassigned sitter accesses customer address

Released backup retains sensitive instructions

Primary accesses booking after removal

Customer sees the wrong replacement profile

Finance

Standby payment created

Replacement payout calculated

Customer not charged twice

Cancellation refund processed

21. Definition of done

The backup sitter module is complete only when:

Coverage

Every priority booking receives a coverage classification.

Backup candidates are based on current eligibility.

Boarding has a documented continuity plan.

Stale backup coverage is automatically removed.

Replacement

Replacement can be initiated from readiness, cancellation or no-show alerts.

Only one active replacement can be assigned.

Eligibility is rechecked at acceptance.

Customer communication is automatic and accurate.

Operations

Every important booking has an operations owner.

The replacement deadline is visible.

Failed replacements lead to a controlled reschedule, waitlist or refund.

Serious failures can open an incident.

Security

Backup sitters receive only minimal information before assignment.

Exact address and sensitive pet information are released only when operationally justified.

Released or rejected backups lose access immediately.

Assignment changes are audited.

Fairness

Hard-standby expectations and compensation are documented.

Sitters are not penalised for declining unsuitable bookings.

Backup workload counts toward capacity.

Reliability

Priority backup coverage reaches at least 80%.

Critical boarding continuity reaches 100%.

Double assignment remains zero.

Replacement success is measured rather than assumed.

Final approved backup flow

Primary sitter assigned

↓

Booking risk and importance classified

↓

Candidate, soft or hard backup coverage created

↓

Primary acknowledges

↓

Backup remains active according to coverage policy

↓

Pre-service readiness checks

↓

Primary starts successfully?

┌─────────┴─────────┐

Yes No

↓ ↓

Backup released Replacement workflow

when policy allows ↓

Eligibility rechecked

↓

Backup accepts

↓

Customer informed

↓

Replacement assigned

↓

Service proceeds

Final operating principle

The backup system should reserve enough capacity to protect important services without unnecessarily blocking sitters or pretending that an unconfirmed candidate is a guaranteed replacement.

PetSaathi Phase 6 — Sitter Reliability Score System 📊🐾

Executive decision

Build the reliability system, but do not let one opaque number automatically decide who receives work or who is suspended.

The original formula needs four corrections:

Incident history should not be a normal 10% score component. A serious unresolved safety incident must override the score.

Customer rating should carry less weight because customer ratings can contain bias and are unreliable with small samples. A 2025 field study on a home-services platform found that five-star customer ratings produced racial disparities, while changing to a simpler two-option scale reduced that discrimination.

Acceptance rate must exclude unsuitable offers. Sitters should not be punished for rejecting unsafe, distant, conflicting or unauthorised bookings.

A score below 70 should trigger human review and a targeted improvement plan, not automatic suspension.

The correct model is:

Eligibility and safety gate

↓

Transparent performance score

↓

Confidence/sample-size check

↓

Human review for adverse action

↓

Coaching, restriction or promotion

1. Purpose of the reliability system

The score should help PetSaathi:

Rank eligible sitters for suitable bookings

Identify coaching requirements

Protect customers from repeated reliability failures

Recognise consistently strong sitters

Monitor punctuality, completion and reporting quality

Support backup-sitter selection

Detect declining performance early

The score should not:

Replace pet–sitter compatibility checks

Override service or risk permissions

Diagnose whether a sitter is “safe”

Punish sitters for declining unsuitable work

Suspend someone solely because of one customer rating

Hide the reason work access was reduced

2. Three-layer decision architecture

Layer 1 — Eligibility and safety gate

Before calculating ranking, check whether the sitter is currently allowed to receive the booking.

Identity verification current?

Training current?

Service permission active?

Pet-size permission valid?

Risk controls supported?

No schedule conflict?

No active safety restriction?

No unresolved critical incident?

Possible results:

ELIGIBLE

ELIGIBLE_WITH_LIMITS

COACHING_REQUIRED

SAFETY_REVIEW

TEMPORARILY_PAUSED

SUSPENDED

A sitter in SAFETY_REVIEW should not remain highly ranked merely because their numerical score is 94.

Layer 2 — Reliability score

Calculate a transparent score from objective operational components.

Layer 3 — Human action

Use the score to recommend an action, but require authorised human review before:

Suspending a sitter

Removing premium access

Permanently reducing work access

Recording a serious violation

Removing the sitter from the platform

NIST’s risk-management guidance emphasises transparency and actionable redress when automated outputs cause negative effects. PetSaathi should therefore show how the score was calculated and provide a process for correction or appeal.

3. Recommended production formula

Final score weights

### Table 100

| Component | Weight |
| --- | --- |
| On-time performance | 25% |
| Accepted-booking completion | 20% |
| Avoidable cancellations and no-shows | 10% |
| Report Card timeliness and quality | 15% |
| Adjusted customer experience | 15% |
| Offer response and eligible acceptance | 10% |
| Training and policy compliance | 5% |
| Total | 100% |

Separate safety override

Incident and safety status:

Not included as an ordinary weighted percentage

Instead, incident severity creates a separate modifier or restriction.

4. Overall score equation

Reliability Score =

Punctuality Score

+ Completion Score

+ Cancellation/No-show Score

+ Report Score

+ Customer Experience Score

+ Offer Response Score

+ Compliance Score

Each component must store:

Raw metric

Measurement window

Number of eligible records

Subscore

Excluded records

Reason for exclusion

Last calculated time

5. On-time performance — 25 points

Formula

On-time rate =

Services started inside approved window

÷ eligible services due

× 100

Recommended full-performance target:

95% on time = full 25 points

Possible calculation:

On-time subscore =

minimum(on-time rate ÷ 95%, 1)

× 25

Example

On-time rate = 91%

91 ÷ 95 × 25

= 23.95 points

Define “on time”

Example internal window:

Up to 10 minutes early

and no more than 5 minutes late

Exclude or classify separately

Customer unavailable

Society security delay outside sitter control

Address supplied incorrectly

Admin changed the schedule late

Previous PetSaathi booking overran due to an incident

Do not mark the sitter late merely because the app received an event slowly. Use the actual verified check-in and service-start timestamps.

6. Accepted-booking completion — 20 points

Formula

Completion rate =

Accepted bookings completed correctly

÷ accepted bookings due

× 100

Recommended target:

98% = full 20 points

Completion subscore =

minimum(completion rate ÷ 98%, 1)

× 20

A completed booking should require:

Sitter attended

Service started correctly

Service was physically completed

Pet was handed over or secured

No unauthorised substitution occurred

Required Report Card was submitted

Exclude

Customer cancellation

Pet became medically unfit for service

PetSaathi cancelled for safety

Force majeure under the approved policy

Booking incorrectly assigned by operations

7. Avoidable cancellations and no-shows — 10 points

Do not combine cancellations and no-shows as if they are equally serious.

Sitter-caused cancellation — 5 points

Avoidable cancellation rate =

Sitter-caused avoidable cancellations

÷ accepted bookings

× 100

Suggested scoring:

### Table 101

| Cancellation rate | Points |
| --- | --- |
| 0–1% | 5 |
| >1–3% | 4 |
| >3–5% | 2 |
| >5–10% | 1 |
| Above 10% | 0 |

No-show rate — 5 points

### Table 102

| No-show rate | Points |
| --- | --- |
| 0% | 5 |
| Above 0–1% | 3 |
| Above 1–3% | 1 |
| Above 3% | 0 |

A no-show is more serious than a properly communicated early cancellation.

Valid cancellation reasons

Examples that should not automatically reduce reliability:

MEDICAL_EMERGENCY

UNSAFE_OR_INCOMPLETE_PET_INFORMATION

PET_REQUIREMENT_OUTSIDE_PERMISSION

EXTREME_WEATHER_OR_FORCE_MAJEURE

ADMIN_ASSIGNMENT_ERROR

Examples likely to reduce reliability:

FORGOT_BOOKING

ACCEPTED_SCHEDULE_CONFLICT

UNREACHABLE_WITHOUT_NOTICE

PERSONAL_PLAN_CHANGE_AT_LAST_MINUTE

UNAPPROVED_SUBSTITUTION

8. Report Card timeliness and quality — 15 points

Timeliness — 10 points

On-time Report Card rate =

Reports submitted inside required window

÷ completed services

× 100

Recommended target:

98% = full 10 points

Quality and completeness — 5 points

Measure:

Required fields completed

Correct service data

Useful sitter note

Required private media or approved exception

Concern field completed

No contradictions

No repeated admin corrections

Suggested quality score:

### Table 103

| Report outcome | Points |
| --- | --- |
| Complete without correction | 5 |
| Minor correction occasionally | 4 |
| Repeated incomplete reports | 2–3 |
| Serious or misleading report | 0–1 |

Do not reward artificially long notes. A short accurate report is better than a long generic one.

9. Adjusted customer experience — 15 points

The original proposal assigns customer rating 20%. Reduce this to 15% and combine several signals.

Recommended split

### Table 104

| Signal | Points |
| --- | --- |
| Adjusted customer rating | 10 |
| Would-book-again or same-sitter request | 5 |

Why not rely only on star ratings?

Customer ratings may reflect factors unrelated to actual service quality, and low-volume sitters can move sharply because of one review. Research on platform-worker evaluations has found that rating-system design can amplify discriminatory outcomes.

Use structured review questions:

Was the sitter punctual?

Were instructions followed?

Was communication clear?

Was the pet handled appropriately?

Was the Report Card useful?

Would you book this sitter again?

Allow:

Not observed / Not applicable

so the customer is not forced to rate something they could not assess.

10. Sample-size-adjusted rating

A sitter with one 5-star review should not outrank a sitter with 100 reviews averaging 4.8.

Use a Bayesian-adjusted rating:

Adjusted Rating =

(n ÷ (n + m)) × sitter average

+

(m ÷ (n + m)) × platform average

Where:

n = number of eligible sitter reviews

m = prior-strength value, such as 10

platform average = average rating across comparable services

Example

Sitter rating = 5.0

Reviews = 2

Platform average = 4.6

Prior strength = 10

Adjusted Rating =

(2 ÷ 12 × 5.0)

+

(10 ÷ 12 × 4.6)

= approximately 4.67

This prevents two reviews from producing an unrealistically strong ranking. Statistical shrinkage is designed to stabilise estimates when groups have small or unequal samples.

Customer-rating subscore

Rating points =

Adjusted Rating ÷ 5

× 10

11. Repeat preference — 5 points

Track:

Would book again

Same-sitter requested

Second booking completed with sitter

A stronger metric is:

Same-sitter repeat rate =

Customers completing another booking with sitter

÷ customers eligible to repeat

× 100

Suggested target for full points:

50% same-sitter preference/repeat among eligible customers

Do not penalise sitters when:

Customer does not need another service

Sitter was unavailable

Customer moved outside the area

PetSaathi assigned another sitter for operational reasons

12. Offer response and acceptance — 10 points

Response timeliness — 5 points

Measure whether the sitter responds before the offer expires.

Response rate =

Offers responded to before deadline

÷ valid offers received

× 100

Eligible acceptance — 5 points

Eligible acceptance rate =

Suitable offers accepted

÷ suitable offers received

× 100

Exclude offers when

Travel is beyond approved radius

Booking conflicts with existing assignment

Service is outside sitter permission

Pet risk exceeds sitter approval

Information is incomplete

Sitter has marked themselves unavailable

Offered payout or duration is incorrect

Safety control cannot be met

A sitter must not lose points for refusing an unsafe or unsuitable assignment.

Low acceptance may reveal a matching-system problem, not sitter unreliability.

13. Training and policy compliance — 5 points

Award points for:

Required training current

Verification current

Availability kept updated

No unauthorised substitution

Privacy requirements followed

Customer and pet data handled correctly

Required equipment policy followed

Possible scoring:

### Table 105

| Status | Points |
| --- | --- |
| Fully current and compliant | 5 |
| Minor administrative item approaching expiry | 4 |
| Training or document update overdue | 2–3 |
| Material policy breach | 0–1 |

Expired mandatory verification should normally create an eligibility block independent of the numerical score.

14. Incident history — separate safety control

Do not use this model

No incidents = 10 points

One incident = 5 points

Two incidents = 0 points

Incidents vary enormously in severity and responsibility.

A minor Report Card correction is not equivalent to:

Pet escape

Bite

Medication error

Falsified service evidence

Unauthorised substitute

Serious privacy breach

Incident model

INCIDENT_REPORTED

↓

Evidence review

↓

Severity and responsibility determined

↓

Temporary controls applied

↓

Final outcome recorded

Severity actions

Severity 0 — Critical

Examples:

Pet missing

Deliberate falsification causing danger

Immediate threat

Major privacy/security violation

Action:

Immediate suspension

Safety investigation

No new bookings

Severity 1 — Serious

Examples:

Bite or injury linked to sitter conduct

Medication error

Unauthorised substitution

Serious negligence allegation

Action:

Temporary safety pause

Human investigation

Possible retraining, restriction or suspension

Severity 2 — Material operational issue

Examples:

Preventable no-show

Major lateness

Repeated failure to follow instructions

Action:

Score impact

Coaching

Booking limits

Severity 3 — Minor quality issue

Examples:

Weak note

Small communication issue

One minor delay

Action:

Coaching or observation

No automatic suspension

Responsibility status

UNREVIEWED

SITTER_RESPONSIBLE

PARTIALLY_RESPONSIBLE

NOT_SITTER_RESPONSIBLE

INCONCLUSIVE

Only reviewed findings should affect long-term work access.

15. New-sitter and sample-size rules

Do not present a full reliability score after one or two bookings.

Recommended lifecycle

### Table 106

| Completed bookings | Status |
| --- | --- |
| 0–4 | Onboarding |
| 5–9 | Provisional |
| 10–24 | Scored — limited confidence |
| 25+ | Established score |

New-sitter placement

A new sitter should not start at either:

0 — looks dangerous

or:

100 — appears premium

Use:

PROVISIONAL

and apply:

Lower-risk bookings

Limited concurrent assignments

Closer admin monitoring

Initial coaching review

Gradual access to complex services

16. Measurement window

Use recent performance while retaining serious lifetime events.

Recommended model

Operational score:

Rolling previous 90 days

Trend:

Previous 30 days compared with preceding 60 days

Safety record:

Lifetime, with reviewed outcomes

Customer rating:

Recent bookings with Bayesian adjustment

Why use a rolling period?

A sitter who improved after coaching should eventually recover. A sitter who performed well two years ago but is declining now should not remain Premium indefinitely.

17. Final score levels

### Table 107

| Score/status | Level | Recommended action |
| --- | --- | --- |
| Insufficient sample | Provisional | Controlled assignments |
| 90–100 | Premium candidate | Priority after compatibility checks |
| 80–89 | Reliable | Normal assignment access |
| 70–79 | Coaching required | Monitor and apply targeted coaching |
| 60–69 | Restricted | Reduce eligible services while reviewed |
| Below 60 | Performance review | Temporary pause may be considered |
| Any score + serious safety flag | Safety review | Safety controls override score |

Important correction

“Premium” should not mean automatically placed first for every booking.

Matching order should remain:

Eligibility

↓

Pet/service compatibility

↓

Availability

↓

Travel time

↓

Customer preference

↓

Reliability as ranking factor

A Premium small-dog walker must not outrank a Reliable sitter who is specifically approved for a strong-pulling 35 kg dog.

18. Score-drop workflow

The proposed workflow is:

Score below 70

↓

Admin alert

↓

Retraining

↓

Reduced access

Use a more precise flow:

Score crosses threshold

↓

System identifies which components fell

↓

Data-quality and sample-size check

↓

Open incidents or disputes reviewed

↓

Admin receives explanation

↓

Sitter receives score breakdown

↓

Targeted action selected

↓

Review period created

↓

Score recalculated after evidence period

19. Targeted actions by cause

Low punctuality

Possible action:

Reduce service radius

Increase travel buffer

Block consecutive bookings

Require earlier travel confirmation

Coaching on schedule planning

Low completion

Possible action:

Review accepted workload

Restrict complex services

Require manual admin assignment

Investigate cancellations

Low Report Card quality

Possible action:

Report Card training

Example reports

Temporary report review before delivery

Completion checklist

Low acceptance rate

First investigate:

Are offers too far away?

Is availability outdated?

Are payouts inappropriate?

Is the pet outside sitter capability?

Are notifications failing?

Do not restrict access until poor matching has been excluded.

Rating decline

Review:

Sample size

Specific structured categories

Repeated customer complaints

Bias or harassment concerns

Whether issue relates to sitter or platform operations

Safety concern

Use the incident workflow, not ordinary score coaching.

20. Human review and appeal

Before a major adverse action, provide the sitter:

Current score

Component breakdown

Measurement window

Bookings included

Records excluded

Triggering threshold

Proposed action

Method to report inaccurate data

Review deadline

NIST notes that transparency is important for meaningful redress when automated outputs lead to negative impacts.

Appeal flow

Sitter views score

↓

Requests correction or review

↓

Admin checks source booking records

↓

Incorrect information corrected

↓

Score recalculated

↓

Decision confirmed, changed or removed

Sitter performance records are personal data. India’s DPDP Act requires completeness, accuracy and consistency where personal data is used to make a decision affecting an individual, and provides rights relating to access, correction and grievance redressal.

21. Data architecture

sitter_score_snapshots

id

sitter_id

overall_score

confidence_level

calculation_version

window_start

window_end

calculated_at

status_level

safety_status

sitter_score_components

snapshot_id

component_code

raw_value

eligible_count

excluded_count

target_value

weight

subscore

explanation

sitter_performance_events

id

sitter_id

booking_id

event_type

event_value

responsibility_status

occurred_at

source

sitter_score_actions

id

sitter_id

snapshot_id

action_type

reason

approved_by

starts_at

ends_at

review_at

status

sitter_score_appeals

id

sitter_id

snapshot_id

reason

evidence

status

reviewed_by

decision

created_at

resolved_at

22. Score calculation workflow

Booking reaches final operational state

↓

Performance events generated

↓

Responsibility/exclusion rules applied

↓

Metrics aggregated for rolling window

↓

Small-sample adjustment applied

↓

Component scores calculated

↓

Safety gate checked

↓

New score version saved

↓

Previous score compared

↓

Threshold crossing detected

↓

Admin and sitter notified

The calculation must be:

Idempotent

Versioned

Reproducible

Auditable

Recalculable after data correction

Never overwrite the previous score without history.

23. Sitter dashboard

Show the sitter:

Reliability status: Reliable

Current score: 86

Confidence: Established

Measurement period: Last 90 days

Breakdown

On-time performance 23.8 / 25

Completion 19.2 / 20

Cancellation/no-show 9.0 / 10

Report Card 13.8 / 15

Customer experience 12.5 / 15

Offer response 4.5 / 10

Training/compliance 5.0 / 5

Useful explanation

Your offer-response score decreased because six eligible offers expired without a response. Declined offers outside your service area were excluded.

Improvement action

Respond to booking offers before they expire. Update your availability to avoid receiving unsuitable offers.

This is more useful than:

Your score dropped to 86.

24. Admin dashboard

Show

Score and level

Confidence/sample size

Thirty-day trend

Component breakdown

Service-specific performance

Area-specific punctuality

Customer-rating distribution

Cancellation reasons

Reviewed incident status

Current restrictions

Coaching history

Appeals

Alerts

Score falls below 80

Score falls below 70

Score drops by more than 10 points

No-show recorded

Report quality repeatedly fails

Critical verification expires

Safety incident opened

Possible rating-bias pattern detected

A sudden score drop should trigger investigation before automatic punishment.

25. Fairness controls

Monitor whether the scoring system produces unexplained differences across:

Service areas

Languages

New versus established sitters

Customer segments

Service types

Time slots

Do not use protected or operationally irrelevant attributes in ranking.

Customer-rating protections

Use verified completed bookings only

Ask structured service questions

Include “not applicable”

Use adjusted ratings

Detect retaliatory or abusive comments

Allow sitter response

Separate private complaint from public review

Do not act on an unreviewed serious allegation

Because rating-scale design itself can influence discriminatory outcomes, PetSaathi should test whether a simpler “service met expectations: yes/no” signal is more reliable than making a five-star average decisive.

26. Required tests

Calculation

Perfect performance

Low punctuality

One cancellation

One no-show

Missing report

Small review sample

Large review sample

Score crosses level boundary

Exclusions

Customer cancellation excluded

Unsafe booking decline excluded

Excessive-distance offer excluded

Admin scheduling error excluded

Force-majeure cancellation excluded

Incidents

Unreviewed allegation

Sitter found responsible

Sitter not responsible

Critical incident overrides high score

Incident outcome later corrected

Concurrency

Review and score update arrive together

Report amendment triggers recalculation

Booking reopened

Duplicate event received

Appeal accepted during recalculation

Security

Sitter views another sitter’s score

Ordinary admin changes safety finding

Customer accesses internal score

Audit record modified

Sensitive incident evidence exposed

Fairness

New sitter with two five-star reviews

Experienced sitter with hundreds of reviews

Customer repeatedly gives unusually low ratings

Rating pattern differs materially by area or customer group

27. Definition of done

The reliability system is complete only when:

Accuracy

Metrics use verified booking records.

Unsuitable offers are excluded.

Customer-caused failures are not assigned to sitters.

Small samples are adjusted.

Score calculation is reproducible.

Transparency

Sitters can view component scores.

Every restriction has a reason.

Calculation windows and targets are visible.

Score changes are versioned.

Safety

Critical incidents override numerical ranking.

Unreviewed allegations do not become permanent penalties.

Safety actions require authorised review.

Suspended sitters cannot receive offers.

Fairness

Customer ratings do not dominate.

Bias and sample-size effects are monitored.

Sitter appeal and correction processes exist.

Protected characteristics are not ranking features.

Operations

Low scores create targeted actions.

Coaching plans have review dates.

Premium status does not override booking compatibility.

Admins can explain every recommended action.

Final approved model

### Table 108

| Original proposal | Final decision |
| --- | --- |
| On-time arrival 25% | Approved |
| Booking acceptance 15% | Reduce and redefine to 10% |
| Completion rate 20% | Approved |
| Customer rating 20% | Reduce to adjusted 15% |
| Report Card quality 10% | Increase to 15% |
| Incident history 10% | Remove from weighted score; use safety override |
| Score below 70 triggers alert | Approved |
| Automatic retraining | Use targeted coaching after review |
| Automatic reduced access | Only after evidence and human review |
| Below 60 automatically remove | Reject; require performance/safety review |

Final operating principle

Use the reliability score to explain and improve performance—not to hide major livelihood decisions behind a number.

Simple explanation for professor

“The Sitter Reliability Score will help PetSaathi identify dependable sitters and detect performance problems.

The score will measure punctuality, completed bookings, cancellations, Report Card quality, customer experience, offer response and training compliance.

Customer ratings will not control the whole score because ratings may be biased and a new sitter may have only one or two reviews. PetSaathi will adjust ratings according to sample size and will also measure whether customers request the same sitter again.

Incident history will not be treated as a normal ten-percent score. A serious incident can require an immediate safety review even when the sitter’s numerical score is high.

New sitters will initially be marked Provisional. A stable score will require a meaningful number of completed bookings.

If a score falls below seventy, the system will identify the exact cause. For example, poor punctuality may require a smaller service radius, while weak Report Cards may require report training. A low acceptance rate will first be checked for unsuitable booking offers.

The sitter will be able to see the score breakdown, correct inaccurate data and request a review. Suspension or removal will require an authorised human decision rather than an automatic score rule.”

PetSaathi Phase 6 — Incident Management System 🚨🐾

Executive decision

Build Incident Management as a safety-control system, not merely a support-ticket form.

The system must:

Protect the pet, customer and sitter first

Create a permanent incident record

Assign severity and ownership quickly

Coordinate customer, veterinarian, backup sitter and emergency actions

Preserve evidence

Control booking, payment and sitter access

Complete follow-up and corrective actions

Prevent the same failure from recurring

The operating principle is:

Stabilise first, communicate clearly, preserve evidence, investigate factually and improve the system afterward.

A professional incident process requires a clear command structure, defined roles, a live working record and early escalation. Google’s incident-management guidance frames this around coordination, communication and control.

1. Correct end-to-end incident flow

Issue observed or reported

↓

Immediate danger check

↓

Incident record created

↓

Severity assigned

↓

Incident owner notified

↓

Pet/customer/sitter safety stabilised

↓

Customer contacted

↓

Vet, backup sitter or emergency support engaged

↓

Booking, payout or account holds applied if needed

↓

Evidence and timeline preserved

↓

Investigation completed

↓

Operational resolution recorded

↓

Customer follow-up completed

↓

Pet and sitter reassessed

↓

Corrective actions assigned

↓

Incident resolved and closed

Creating the ticket must not delay emergency action. For example, a lost pet, breathing difficulty or serious injury should trigger calls and physical response immediately while the record is being opened.

2. Incident categories

Your proposed categories are appropriate, but they should be structured more precisely.

### Table 109

| Category | Examples |
| --- | --- |
| Pet health | Vomiting, diarrhoea, limping, injury, heat-related symptoms, seizure, breathing concern |
| Pet behaviour | Growling, bite attempt, bite, escape attempt, severe anxiety, resource guarding |
| Sitter conduct | Late arrival, no-show, unsafe handling, unauthorised substitute, false service evidence |
| Customer information | Incorrect address, missing bite history, wrong medication instructions, inaccessible property |
| Property/security | Damage, missing item, lockout, door left open, unauthorised access |
| Service operations | Tracking failure, incomplete service, missing Report Card, wrong sitter assignment |
| Payment/financial | Duplicate charge, incorrect refund, payout hold, payment dispute |
| Privacy/security | Wrong customer sees media, address exposed, unauthorised access to medical details |
| Emergency | Lost pet, serious bite, accident, severe injury, immediate danger |

Incident subtype

Use a second field so reporting remains useful:

Incident category: PET_HEALTH

Incident subtype: VOMITING

or:

Incident category: SITTER_CONDUCT

Incident subtype: NO_SHOW

Do not rely only on free-text descriptions.

3. Severity model

Keep three customer-service levels, but define them by impact and urgency, not only incident type.

Level 1 — Minor concern

Meaning

A limited problem with no immediate safety threat and little or no lasting service impact.

Examples

Sitter arrived slightly late but informed the customer

One incomplete Report Card field

Pet appeared mildly cautious but settled

Tracking temporarily failed, but alternative proof exists

Minor property issue with no safety concern

Required response

Record incident

Notify relevant operations owner

Inform customer where appropriate

Correct the issue

Monitor for recurrence

Recommended internal SLA

Acknowledge within 15 minutes during operating hours

Operational resolution the same day

Close after customer follow-up where required

Level 2 — Moderate or material incident

Meaning

A meaningful service, health, behaviour or trust problem requiring active admin intervention.

Examples

Repeated vomiting without immediate collapse

Strong aggression or escape attempt

Sitter more than materially late

Sitter cancellation close to service

Customer provided materially incorrect instructions

Property damage

Failed medication task

Tracking and service proof both unavailable

Customer complaint involving possible unsafe handling

Required response

Assign incident owner

Contact customer

Stop or modify service if necessary

Consult veterinarian when medically indicated

Consider backup sitter

Preserve evidence

Apply payment/payout hold where appropriate

A veterinarian does not need to be called for every Level 2 property or payment issue. Veterinary escalation should depend on the pet’s symptoms, injury, behaviour and professional advice.

Recommended internal SLA

Acknowledge within five minutes

Contact the customer within ten minutes

Begin containment within 30 minutes

Make an operational decision the same day

Complete investigation within one to three business days where needed

Level 3 — Critical emergency

Meaning

There is immediate or potentially severe danger to the pet, a person, property or sensitive data.

Examples

Lost or escaped pet

Serious bite or attack

Breathing difficulty

Seizure activity

Collapse or unconsciousness

Serious injury or accident

Suspected heatstroke

Major medication error

Deliberate service falsification creating danger

Serious privacy or security breach

AVMA identifies circumstances such as breathing difficulty, severe bleeding, seizures, poisoning and serious trauma as requiring immediate veterinary consultation or care. PetSaathi must not attempt to diagnose these conditions through the application.

Required response

Immediate phone escalation

Incident commander assigned

Customer contacted

Veterinarian/emergency clinic contacted

Emergency transport or search process started

Booking placed on INCIDENT_HOLD

Sitter payout placed on hold if relevant

Frequent status updates issued

Evidence preserved

Recommended internal SLA

Acknowledge immediately

Assign incident command within two minutes

Begin emergency action immediately

Provide regular customer updates until stabilised

Do not close until the immediate danger is controlled and ownership of follow-up is clear

4. Severity assignment rules

Severity should consider:

Immediate danger

Pet-health impact

Human injury

Pet missing or unsecured

Service interruption

Customer impact

Likelihood of worsening

Number of people or bookings affected

Evidence of misconduct

Privacy or financial exposure

Severity can change

Example:

Initial severity: Level 1

Pet later begins repeated vomiting

Updated severity: Level 2

or:

Initial severity: Level 2 escape attempt

Pet is now missing

Updated severity: Level 3

Every severity change should record:

Previous level

New level

Changed by

Reason

Timestamp

Never overwrite the original classification without history.

5. Incident roles

For smaller incidents, one admin may hold several roles. For serious incidents, separate responsibilities.

### Table 110

| Role | Responsibility |
| --- | --- |
| Incident commander | Coordinates the response and makes high-level decisions |
| Operations lead | Handles sitter, booking, replacement and service actions |
| Customer communications lead | Provides clear updates to the pet parent |
| Safety reviewer | Reviews pet, sitter and incident evidence |
| Veterinary contact | Provides professional medical guidance when engaged |
| Finance owner | Handles refund, payout or compensation decisions |
| Technical owner | Investigates application, tracking or access-control failures |
| Recorder | Maintains timeline, decisions and evidence |

Defined incident-command, operations and communications roles prevent responders from working independently without coordination.

6. Detailed incident workflow

Step 1 — Report the issue

An incident may be reported by:

Customer

Sitter

Admin

Support staff

Automated monitoring

Veterinary partner

Payment or notification system

Reporting channels

Emergency phone action

In-app emergency button

Booking support action

Sitter concern form

Admin-created incident

Automated alert conversion

For Level 3 situations, the interface should prominently show:

Call PetSaathi emergency support now.

A form submission alone is insufficient for an immediate emergency.

Step 2 — Create the incident record

Create a public incident code such as:

INC-2026-00145

Initial status:

REPORTED

The record must preserve the reporter’s original description.

Do not automatically rewrite:

“The dog collapsed and was struggling to breathe.”

into:

“Pet appeared slightly unwell.”

Step 3 — Check immediate danger

Ask a short triage set:

Is the pet missing?

Is anyone injured?

Is the pet having difficulty breathing?

Is there serious bleeding?

Is the pet unconscious or having a seizure?

Is there immediate danger from traffic, heat or another animal?

Is emergency veterinary help already being contacted?

This is operational triage—not diagnosis.

If any critical condition is selected:

severity = LEVEL_3

status = ACTIVE_EMERGENCY

Step 4 — Assign ownership

Every incident needs one accountable owner.

incident_owner_id

incident_commander_id

communications_owner_id

Avoid vague ownership such as:

Assigned to: Operations Team

Use:

Assigned to: Admin user ADM-018

Step 5 — Contain the incident

Containment means preventing further harm.

Examples

Pet health

Stop strenuous activity

Move the pet to a safer environment where appropriate

Contact the customer

Follow veterinary instructions

Arrange transport if directed

Behaviour or bite

Separate animals or people safely

Stop the service

Contact customer and safety admin

Preserve incident details

Trigger pet and sitter reassessment

Lost pet

Record last-known location and time

Contact customer immediately

Keep one person coordinating

Begin the approved search protocol

Contact relevant local support

Preserve tracking and media evidence

Sitter no-show

Contact sitter

Activate replacement workflow

Inform customer

Cancel and refund if replacement fails

Privacy incident

Revoke unauthorised links or sessions

Restrict access

Preserve audit records

Notify security/privacy owner

Determine notification requirements

Step 6 — Communicate

Customer updates should state:

What is known

What PetSaathi is doing

What the customer needs to do

When the next update will arrive

Initial Level 2 message

We have opened incident INC-2026-00145 regarding Bruno’s service. Our operations team is reviewing the situation and has contacted the sitter. We will update you within ten minutes.

Level 3 message

This is being treated as an urgent safety incident. Our team is coordinating immediate action and contacting the relevant emergency support. We will keep you updated continuously. Please remain reachable by phone.

Do not speculate, blame the sitter or promise an outcome before facts are confirmed.

Step 7 — Engage external support

Depending on the incident:

Regular veterinarian

Emergency veterinary hospital

Backup sitter

Emergency transport

Society security

Police or other authorities where appropriate

Payment provider

Cybersecurity/privacy specialist

Store who was contacted, by whom, when and what instructions were received.

Step 8 — Preserve evidence

Possible evidence includes:

Sitter and customer statements

Photographs and videos

Tracking route

Start/end timestamps

Chat and notification history

Call summaries

Pet Profile snapshot

Booking instructions snapshot

Veterinary documents

Payment records

Access logs

CCTV reference where lawfully available

Evidence should be stored privately and linked through separate records—not placed in a public media_urls array.

Step 9 — Apply operational holds

An incident may trigger:

booking_status = INCIDENT_HOLD

payout_status = ON_HOLD

refund_status = UNDER_REVIEW

pet_profile_status = REASSESSMENT_REQUIRED

sitter_status = SAFETY_REVIEW

These states should remain separate.

A payout hold does not automatically mean the sitter is guilty. It protects the investigation and financial reconciliation.

Step 10 — Investigate

The investigation should answer:

What happened?

When did it happen?

Who was present?

What information was available before service?

Were instructions accurate?

Were required controls followed?

Did software, operations or communication fail?

Could the incident reasonably have been prevented?

Who or what contributed?

What corrective action is required?

Possible responsibility outcomes:

UNDETERMINED

SITTER_RESPONSIBLE

CUSTOMER_INFORMATION_CONTRIBUTED

PETSAATHI_PROCESS_FAILURE

TECHNICAL_FAILURE

THIRD_PARTY_FAILURE

MULTIPLE_CONTRIBUTORS

NO_POLICY_BREACH

Avoid designing every investigation around finding one person to blame.

7. Incident status model

Use:

REPORTED

TRIAGE_REQUIRED

ACTIVE

CONTAINMENT_IN_PROGRESS

CONTAINED

MONITORING

INVESTIGATING

CUSTOMER_FOLLOWUP

CORRECTIVE_ACTION_PENDING

RESOLVED

CLOSED

REOPENED

Contained

Immediate danger or service disruption is controlled.

Resolved

The operational outcome, customer remedy and required restrictions are decided.

Closed

Follow-up, documentation and corrective actions are completed or formally tracked.

An incident can be contained quickly but remain under investigation for several days.

8. Improved incident database

Your proposed table is a useful start, but it lacks ownership, timelines, action tracking and audit history.

incidents

id

public_code

booking_id

pet_id

sitter_id

reported_by_user_id

reporter_role

reported_channel

incident_category

incident_subtype

severity

status

title

original_description

current_summary

occurred_at

detected_at

reported_at

incident_owner_id

incident_commander_id

communications_owner_id

customer_contacted_at

vet_contacted_at

emergency_support_contacted_at

pet_status

human_injury_flag

property_damage_flag

privacy_or_security_flag

booking_hold_applied

payout_hold_applied

refund_review_required

immediate_action_summary

resolution_summary

root_cause_category

resolved_at

closed_at

created_at

updated_at

version

incident_timeline

id

incident_id

event_type

actor_user_id

actor_role

description

occurred_at

created_at

Examples:

INCIDENT_REPORTED

SEVERITY_CHANGED

CUSTOMER_CONTACTED

VET_CONTACTED

BACKUP_REQUESTED

PET_FOUND

PAYMENT_HOLD_APPLIED

INCIDENT_CONTAINED

incident_media

id

incident_id

storage_key

media_type

uploaded_by

captured_at

access_classification

processing_status

created_at

incident_actions

id

incident_id

action_type

description

owner_user_id

priority

due_at

status

completed_at

verification_notes

incident_communications

id

incident_id

recipient_type

recipient_id

channel

message_summary

sent_by

sent_at

delivery_status

incident_participants

incident_id

user_id

role

joined_at

left_at

incident_links

Link:

Refund

Payout hold

Complaint

Pet reassessment

Sitter restriction

Veterinary record

Technical defect

Corrective action

9. Incident timeline and audit integrity

Do not store only admin_notes as one editable text box.

Every important event should create an append-style timeline record. OWASP recommends maintaining audit trails for high-value transactions with controls against tampering or deletion, and notes that application logs are important for investigation and operational monitoring.

Audit:

Incident creation

Severity changes

Evidence access

Status transitions

Customer and vet contact

Booking/payout holds

Admin amendments

Incident closure

Reopening

Deletion or retention actions

10. Privacy and access

Incident records may contain highly sensitive information:

Customer address

Phone numbers

Pet medical observations

Human injuries

Allegations against sitters

Private media

Emergency contacts

Property information

Location history

The official Digital Personal Data Protection Rules, 2025 were published on November 14, 2025 with staged commencement materials. PetSaathi should therefore design incident access, retention, correction and breach processes around a formal privacy programme rather than treating incident notes as ordinary support data.

Role permissions

Customer

May view:

Customer-facing incident status

Actions requested from them

Final customer resolution

Their own submitted evidence

Sitter

May view:

Incidents involving their assignment

Information needed to respond

Decisions affecting their account

Appeal or clarification process

Operations admin

May manage routine operational incidents.

Safety admin

May access:

Pet health/behaviour evidence

Bite, escape and injury incidents

Sitter restrictions

Critical investigations

Finance admin

May access financial outcomes, not all medical details.

Marketing

No default incident access.

11. Customer, sitter and pet follow-up

Customer follow-up

Record:

Customer informed

Explanation provided

Refund or service recovery

Veterinary follow-up requested

Customer satisfaction after resolution

Further complaint or escalation

Pet reassessment

Trigger REASSESSMENT_REQUIRED after:

Bite

Escape

New serious aggression

Medical instability

New medication concern

Boarding compatibility failure

Sitter reassessment

Possible outcomes:

NO_ACTION

COACHING

RETRAINING_REQUIRED

SERVICE_LIMITED

PROBATION

TEMPORARY_PAUSE

SAFETY_REVIEW

SUSPENSION

REMOVAL

Do not automatically punish the sitter merely because an incident was reported. Use evidence and responsibility findings.

12. Resolution types

SERVICE_COMPLETED

SERVICE_STOPPED_SAFELY

PET_RETURNED_SAFELY

PET_RECEIVED_VETERINARY_CARE

REPLACEMENT_COMPLETED_SERVICE

CUSTOMER_REFUNDED

PARTIAL_REFUND

GOODWILL_CREDIT

PROPERTY_REPAIR_OR_COMPENSATION

SITTER_COACHING

SITTER_RESTRICTED

PET_REASSESSED

TECHNICAL_FIX_REQUIRED

NO_POLICY_BREACH_FOUND

Resolution should record both:

Operational outcome

Corrective/preventive outcome

Example:

Operational resolution:

Customer received a full refund.

Corrective action:

Reminder system changed to alert operations after

a sitter misses the acknowledgement deadline.

13. Post-incident review

Require a formal review for:

Every Level 3 incident

Repeated Level 2 incidents

Serious complaint involving safety

Lost pet

Bite or injury

Medication error

Major privacy incident

System failure affecting multiple bookings

The post-incident report should capture:

Summary

Customer and pet impact

Timeline

Immediate response

Contributing factors

Root cause

What worked

What failed

Corrective actions

Owners

Deadlines

Verification method

A useful postmortem records what happened, how the issue was mitigated, user impact and measurable follow-up actions. Google also recommends factual, non-blaming documentation with clear action ownership.

14. Incident drills

Do not wait for a real emergency to test the process.

Run simulations for:

Lost pet

Sitter no-show

Dog bite

Pet heat-related emergency

Boarding host unable to continue

Customer unreachable

Tracking and phone connectivity failure

Wrong customer sees private media

Duplicate payment during an incident

Incident-response practice and simulations help teams learn roles and communication processes before high-pressure events occur.

15. Dashboard design

Immediate attention

Active Level 3 incidents

Uncontained Level 2 incidents

Pet missing

Veterinary escalation pending

Customer not contacted

Incident owner missing

Operational review

New incidents

Incidents awaiting triage

Payout/refund holds

Open investigations

Customer follow-ups due

Corrective actions overdue

Trends

Incidents per 100 completed bookings

Incidents by category

Incidents by service

Incidents by sitter

Incidents by area

Repeat-incident rate

Median acknowledgement time

Median containment time

Reopened incidents

16. Incident success metrics

### Table 111

| Metric | Recommended Phase 6 target |
| --- | --- |
| Critical incidents acknowledged | 100% immediately |
| Incidents with assigned owner | 100% |
| Level 2 customer contact | Within 10 minutes |
| Level 3 emergency action | Immediate |
| Evidence/timeline completeness | 95%+ |
| Same-day operational decision | 95%+ where feasible |
| Unresolved Level 3 incidents at expansion decision | 0 |
| Corrective actions with owner and deadline | 100% |
| Overdue corrective actions | Near zero |
| Repeat preventable incidents | Decreasing |
| Unauthorised incident-data access | 0 |

Track incident rate by completed bookings, not only total incident count:

Incident rate =

Incidents

÷ completed bookings

× 100

Booking growth may increase the absolute incident count even while the rate improves.

17. Definition of done

The Incident Management System is ready only when:

Reporting

Customers and sitters can report issues quickly.

Emergency reporting is visible during active bookings.

Automated alerts can create incident records.

Original descriptions are preserved.

Triage

Severity criteria are documented.

Severity can be changed with history.

Level 3 incidents trigger immediate escalation.

Medical decisions remain with veterinary professionals.

Operations

Every incident has one accountable owner.

Booking, payout and refund holds work.

Backup sitter workflow can be activated.

Customer communications are timestamped.

Evidence

Media is private and access-controlled.

Tracking, booking and message evidence can be linked.

Timeline events are append-only or strongly audited.

Sensitive information is not exposed in general logs.

Resolution

Operational and root-cause outcomes are separate.

Customer follow-up is recorded.

Pet and sitter reassessments can be created.

Corrective actions have owners and deadlines.

Reliability

Emergency drills have passed.

No unresolved critical incident exists before expansion.

Repeat incident trends are monitored.

Incident metrics appear in the Phase 6 dashboard.

Final approved incident workflow

Sitter/customer/system reports concern

↓

Immediate emergency check

↓

Incident created

↓

Severity and owner assigned

↓

Pet and people stabilised

↓

Customer contacted

↓

Vet, backup or emergency support engaged

↓

Evidence and timeline preserved

↓

Booking/payment/payout controls applied

↓

Investigation completed

↓

Resolution and customer remedy recorded

↓

Pet/sitter reassessment

↓

Corrective actions assigned

↓

Follow-up and closure

Simple explanation for professor

“The Incident Management System will help PetSaathi respond professionally when a safety or service problem occurs.

An incident may involve pet health, behaviour, a sitter, customer instructions, property damage, payment, privacy or an emergency such as a bite or lost pet.

Incidents will have three severity levels. Level 1 is a minor issue that can be recorded and corrected. Level 2 is a material problem requiring active admin and customer contact, and veterinary help where medically necessary. Level 3 is a critical emergency requiring immediate phone escalation and professional support.

When an issue is reported, the system first checks whether anyone or the pet is in immediate danger. It then creates an incident code, assigns severity and gives the case to a named owner. The team contacts the customer and activates a veterinarian, backup sitter, emergency transport or other response when needed.

The system preserves photographs, tracking data, messages, instructions and actions in a secure incident timeline. It may place the booking, sitter payout or refund under review, but this does not automatically mean the sitter is guilty.

After the situation is stable, PetSaathi investigates what happened, records the resolution, follows up with the customer and reassesses the pet or sitter where required. Serious incidents also receive a post-incident review with corrective actions, owners and deadlines.

The objective is not only to close the complaint. It is to protect the pet, maintain customer trust and prevent the same failure from happening again.”

PetSaathi Phase 6 — Customer Trust Dashboard 🛡️🐾

Executive decision

Build the Customer Trust Dashboard as the customer’s single source of truth for every booking.

It should answer six questions immediately:

Is my booking confirmed?

Who is caring for my pet?

What verification has actually been completed?

What is happening during the service?

Who should I contact if something goes wrong?

Where can I find proof after the service?

The dashboard should not manufacture trust using vague badges or exaggerated promises. It should show specific, verifiable operational facts.

Customer opens dashboard

↓

Sees next required action

↓

Reviews assigned sitter and verification

↓

Follows service timeline

↓

Receives private updates

↓

Views Report Card

↓

Submits review

↓

Books the same sitter again

1. Dashboard information architecture

Use three main dashboard sections.

A. Current booking

The most urgent booking appears first.

Show:

Current status

Pet and service

Date and time

Assigned sitter

Next required action

Service address summary

Payment status

Emergency/support action

B. My pets and trusted sitters

Show:

Pet Profile status

Favourite sitters

Previous sitters

Same-sitter availability

Services previously completed

C. Booking history

Show:

Completed bookings

Report Cards

Reviews

Refunds or cancellations

Incident-related updates where applicable

Repeat-booking actions

Do not force customers to navigate through separate payment, tracking and report pages to understand one booking.

2. Recommended customer dashboard layout

Top card — Next booking

Bruno’s Dog Walk

Tomorrow · 7:30–8:00 AM

Bopal, Ahmedabad

Status: Confirmed

Sitter: Riya S.

Payment: Paid

Next action:

Keep Bruno’s harness ready and report any health changes.

Actions:

View booking

View sitter

Update instructions

Contact support

Cancel/reschedule

Active-service card

Bruno’s walk is in progress

Started: 7:32 AM

Last update: 2 minutes ago

Sitter: Riya

Tracking: Active

Actions:

View service timeline

View private updates

Contact support

Emergency help

Completed-service card

Bruno’s walk is complete

Duration: 31 minutes

Approximate distance: 1.4 km

Report Card: Ready

Actions:

View Report Card

Leave a review

Book Riya again

3. Customer-facing booking statuses

Your proposed statuses are useful for customers, but they should be treated as a display layer, not copied directly into one backend booking_status field.

Recommended customer statuses

REQUEST_RECEIVED

UNDER_REVIEW

FINDING_SITTER

PAYMENT_REQUIRED

CONFIRMED

SITTER_PREPARING

SITTER_ON_THE_WAY

SITTER_ARRIVED

SERVICE_STARTED

SERVICE_IN_PROGRESS

SERVICE_COMPLETED

REPORT_CARD_READY

CLOSED

CANCELLED

REPLACEMENT_IN_PROGRESS

SUPPORT_REVIEW

Important corrections

Review pending

Do not use REVIEW_PENDING as the main booking status.

The booking can close even if the customer never leaves a review.

Use:

Booking: CLOSED

Review: PENDING

Report Card ready

This is primarily a report state, but it can be displayed as the main customer milestone after service completion.

Service started and service in progress

These may share one backend booking state:

SERVICE_STARTED

The customer interface can derive:

Just started

In progress

Ending soon

from time and service events.

4. Customer-friendly status language

Internal status names should not be exposed directly.

### Table 112

| Internal condition | Customer wording |
| --- | --- |
| REQUESTED | Request received |
| PENDING_ADMIN_REVIEW | Under review |
| SITTER_MATCHING | Finding a suitable sitter |
| PAYMENT_PENDING | Payment required |
| CONFIRMED | Booking confirmed |
| Sitter travelling | Sitter on the way |
| Sitter checked in | Sitter arrived |
| SERVICE_STARTED | Service in progress |
| SERVICE_COMPLETED | Service completed |
| Report delivered | Report Card ready |
| REPLACEMENT_REQUIRED | Finding a replacement sitter |
| INCIDENT_HOLD | PetSaathi support is reviewing this service |
| CANCELLED | Booking cancelled |

Avoid alarming technical language such as:

INCIDENT_HOLD

RISK_YELLOW

PAYMENT_WEBHOOK_PENDING

The customer should receive truthful but understandable language.

5. Active booking status card

Every active booking card should contain:

Booking identity

Public booking code

Pet

Service

Scheduled time

Duration

Area

Current state

Clear status label

Status explanation

Last updated time

Next expected event

Next action

Examples:

Complete payment

Confirm access instructions

Prepare the pet’s harness

Review replacement sitter

Contact support

View Report Card

Service readiness

Display:

Payment verified

Sitter assigned

Pet instructions available

Emergency contact available

Do not show a reassuring green state when a required action remains incomplete.

6. Assigned sitter profile

The sitter profile should build trust without exposing unnecessary personal information.

Show

Display name

Profile photograph

Approved service

Experience summary

Service area

Languages

Completed PetSaathi bookings

Adjusted customer rating

Same-sitter repeat rate

Verification badges

Relevant handling approvals

Short introduction

Example

Riya S.

Dog Walking · Bopal

4.8 rating · 42 completed services

Approved for:

• Dog walking

• Medium and large dogs

• Strong-pulling handling

Languages:

Gujarati, Hindi, English

Do not show

Full legal ID number

Government-ID photograph

Home address

Personal emergency contact

Police document

Bank details

Unrelated incident information

Customer addresses from previous bookings

OWASP recommends least-privilege and deny-by-default access, meaning the customer and sitter should receive only the information needed for their current relationship.

7. Verification badges

Correct badge model

A badge should state exactly what PetSaathi checked.

Recommended badges:

Identity verified

Phone verified

Address reviewed

Police-verification document reviewed

Pet-care training completed

Dog-walking approved

Large-dog handling approved

Boarding property approved

Include verification metadata

Where useful, show:

Verified by PetSaathi

Reviewed: July 2026

Renewal due: July 2027

Do not use vague badges

Avoid:

100% safe

Completely trusted

Risk-free sitter

Best verified sitter

Police approved

unless those exact claims are legally and factually supportable.

India’s consumer-protection framework prohibits misleading advertising and expects claims presented to consumers to be transparent and accurate. Verification claims should therefore correspond to real evidence and a current review status.

Expired verification

If required verification expires:

Badge becomes hidden or marked expired

New assignments are blocked

Existing booking enters review

Admin receives alert

Do not continue showing a valid-looking badge after expiration.

8. Emergency and support contact

The dashboard should distinguish ordinary support from genuine emergencies.

Normal support

Show:

Chat on WhatsApp

Call support

Report a booking problem

Payment help

Active-service emergency

Show a prominent action:

Emergency help

When selected, display:

PetSaathi emergency support number

Booking code

Customer’s emergency contacts

Veterinary clinic details where configured

Clear instruction to call appropriate emergency services when immediate danger exists

Do not imply

PetSaathi is a veterinary hospital

PetSaathi diagnoses illness

Emergency support guarantees a medical outcome

Every veterinarian is available continuously

Use:

PetSaathi can help coordinate the booking response and contact the emergency information saved for your pet.

9. Service timeline

The service timeline provides transparency without requiring the customer to constantly watch a map.

Example timeline

7:18 AM — Sitter on the way

7:28 AM — Sitter arrived

7:32 AM — Walk started

7:43 AM — Photo update received

7:58 AM — Water update

8:03 AM — Walk completed

8:09 AM — Report Card ready

Timeline event sources

Events should come from:

Booking workflow

Sitter application

Tracking service

Media service

Report service

Admin actions

Notification system

Every event should record

event ID

booking ID

event type

timestamp

actor

customer-facing text

visibility

source

Accessibility

Dynamic timeline and status changes must be announced to users of assistive technology without unexpectedly moving keyboard focus. WCAG requires status messages to be programmatically identifiable; WAI recommends mechanisms such as role="status", live regions and role="log" for sequential updates.

Example:

<section aria-labelledby="service-timeline-heading">

<h2 id="service-timeline-heading">Service timeline</h2>

<ol

aria-live="polite"

aria-relevant="additions"

role="log"

>

<!-- Timeline events -->

</ol>

</section>

For a non-urgent update:

<p role="status">

Bruno’s walk started at 7:32 AM.

</p>

For an urgent active-service issue, use an appropriate alert mechanism without repeatedly interrupting the user.

10. Live service information

During an active walk, show:

Service status

Start time

Elapsed duration

Last tracking update

Approximate active route

Latest private media

Signal status

Support action

Normal tracking state

Tracking active · Updated 25 seconds ago

Delayed tracking

The latest location update is temporarily delayed. The service remains active.

Fallback state

Live location is unavailable. PetSaathi is collecting alternative service evidence.

Do not falsely show:

Tracking active

when the latest location point is stale or the tracking session has failed.

11. Customer notifications inside the dashboard

The dashboard should maintain a persistent notification centre.

Recommended categories:

Booking

Payment

Sitter

Service

Report Card

Support

Refund

Security

Notification example

Sitter assigned

Riya has been assigned to Bruno’s walk.

Today · 4:15 PM

Notification states

UNREAD

READ

ACTION_REQUIRED

RESOLVED

EXPIRED

A notification such as “complete payment” should become expired after the booking is paid, cancelled or payment times out.

12. Report Card history

Every completed booking should remain visible under:

My bookings

→ Completed

→ Report Card

Report history card

Show:

Pet

Service

Sitter

Date

Duration

Distance where relevant

Main care summary

Concern status

Report version

Media count

Example

18 August 2026

Bruno · Dog Walk with Riya

Duration: 32 minutes

Approximate distance: 1.4 km

Mood: Happy and energetic

Concern: None reported

View Report Card

Amendments

If a report is corrected:

Updated Report Card

Version 2 · Updated 18 August at 9:15 AM

Reason: End time corrected after tracking reconciliation

Never silently overwrite the previous report.

13. Favourite sitter option

Customers should be able to mark a sitter as preferred after a completed, eligible service.

Recommended action

Add to favourites

or:

Prefer Riya for future bookings

Important wording

Favourite does not mean guaranteed.

Show:

PetSaathi will prioritise Riya when she is eligible and available.

Eligibility

A customer may favourite a sitter when:

Service completed

No active safety restriction

Sitter remains active

Customer owns the booking

Favourite record

customer_id

sitter_id

pet_id optional

service_type optional

created_at

priority

status

Why pet-specific preference matters

A customer may prefer:

Riya for Bruno’s walks

Aditi for cat sitting

Another host for boarding

Therefore, preference should support:

Customer + pet + service

rather than only a universal favourite sitter.

14. Repeat booking button

The strongest repeat action is:

Book the same sitter again

Pre-filled repeat booking

The system may pre-fill:

Pet

Service

Duration

Address

Previous sitter preference

Previous care instructions

The customer must still confirm:

Date and time

Current health

Temporary instructions

Price

Payment

Repeat flow

Customer selects “Book Riya again”

↓

Previous booking copied as draft

↓

Customer chooses new date/time

↓

Current pet and safety information checked

↓

Riya’s availability checked

↓

If unavailable, customer chooses:

• another suitable sitter

• another time

• waitlist

↓

Payment and confirmation

Do not automatically copy

Old medical status as current

Temporary access code

One-time feeding instructions

Previous incident state

Expired risk assessment

Outdated price

15. Review flow

After the Report Card is delivered, show:

How was Bruno’s service?

Collect:

Punctuality

Communication

Pet handling

Report quality

Overall experience

Would book again?

Same sitter requested?

Private support concern

Separate public and private feedback

The customer should be able to:

Leave a public review

Report a private problem

A serious complaint should not need to be written publicly to receive support.

Review state

NOT_ELIGIBLE

PENDING

SUBMITTED

SKIPPED

MODERATION_REQUIRED

PUBLISHED

The booking may close even if the review remains pending.

16. Trust and safety panel

Add a compact panel explaining how the booking is controlled.

Example:

How PetSaathi protects this booking

✓ Pet Profile reviewed

✓ Eligible sitter assigned

✓ Payment verified

✓ Private service updates

✓ Report Card after service

✓ Human support during active service

Only show checks that are actually true for the specific booking.

Do not show:

✓ Police-verified sitter

when only identity verification has been completed.

17. Booking problem and incident view

When a booking has a delay, replacement or incident, do not hide it behind a generic spinner.

Replacement state

We are finding a replacement sitter

Primary sitter became unavailable.

PetSaathi is reviewing qualified local caregivers.

Next update: within 10 minutes.

Actions:

Contact support

Choose another time

Cancel according to policy

Support review

PetSaathi support is reviewing this service

Incident: INC-2026-00145

Owner contacted: Yes

Next update: 8:20 PM

Show customer-relevant information without exposing:

Internal accusations

Unverified incident conclusions

Sitter private information

Security investigation details

18. Customer data access and privacy

The dashboard combines sensitive data:

Home address

Customer phone

Pet behaviour

Health observations

Emergency contacts

Sitter identity

Tracking route

Private media

Incident history

Access rules

A customer may access only:

Their own account

Their own pets

Their own bookings

Assigned sitter data relevant to those bookings

Their own payments

Their own reports and service media

Their own customer-facing incidents

Every API request should validate both authentication and resource ownership. OWASP identifies broken access control as a major risk and recommends deny-by-default and least-privilege authorization.

Privacy controls

Implement:

HTTPS

Server-side authorization

Short-lived media URLs

Tracking access expiration

Audit logs for sensitive access

Masked emergency details outside active service

No sensitive data in analytics

Clear correction and deletion process

Defined retention periods

India’s official DPDP Rules were published on November 14, 2025, with an enforcement timeline and later corrigendum. PetSaathi should maintain clear notices explaining what data is used, why it is needed and who can access it.

19. Technical data model

Customer dashboard booking view

Create a backend read model or API response that combines:

Booking

Pet snapshot

Assigned sitter

Sitter verification summary

Payment status

Service session

Tracking summary

Timeline events

Report status

Review status

Support/incident state

Repeat eligibility

Do not make the frontend call fifteen unrelated endpoints before it can show one booking card.

Example response structure

{

"bookingCode": "BK-1001",

"displayStatus": "SERVICE_IN_PROGRESS",

"statusMessage": "Bruno's walk is in progress.",

"lastUpdatedAt": "2026-08-18T07:48:00+05:30",

"nextAction": null,

"pet": {

"name": "Bruno",

"photoUrl": "signed-private-url"

},

"sitter": {

"displayName": "Riya S.",

"photoUrl": "signed-private-url",

"rating": 4.8,

"completedBookings": 42,

"badges": [

"IDENTITY_VERIFIED",

"TRAINING_COMPLETED",

"LARGE_DOG_APPROVED"

]

},

"service": {

"type": "DOG_WALKING",

"scheduledStartAt": "2026-08-18T07:30:00+05:30",

"actualStartAt": "2026-08-18T07:32:00+05:30",

"trackingStatus": "ACTIVE"

},

"reportStatus": "NOT_READY",

"reviewStatus": "NOT_ELIGIBLE",

"repeatEligible": false

}

20. Suggested API structure

Dashboard

GET /api/customer/dashboard

GET /api/customer/bookings/active

GET /api/customer/bookings/:bookingId

Sitter profile

GET /api/customer/bookings/:bookingId/sitter

GET /api/customer/sitters/:sitterId/public-profile

Timeline and tracking

GET /api/customer/bookings/:bookingId/timeline

GET /api/customer/bookings/:bookingId/tracking

Reports

GET /api/customer/bookings/:bookingId/report

GET /api/customer/reports

Favourites and repeat booking

POST /api/customer/sitters/:sitterId/favorite

DELETE /api/customer/sitters/:sitterId/favorite

POST /api/customer/bookings/:bookingId/repeat

Support

POST /api/customer/bookings/:bookingId/support

POST /api/customer/bookings/:bookingId/emergency

GET /api/customer/incidents/:incidentId

21. Dashboard accessibility

The dashboard must not depend only on colour.

Incorrect

Green = confirmed

Orange = pending

Red = problem

Correct

Use:

Icon

Text label

Short explanation

Colour as additional signal

Example:

✓ Confirmed

Your sitter and payment are confirmed.

Required accessibility behaviour

Keyboard-accessible actions

Visible focus indicator

Meaningful button labels

Alternative text for sitter and pet images

Text alternatives for map status

Dynamic updates announced to screen readers

Accessible modal/dialog handling

No status conveyed by colour alone

Adequate contrast

Touch targets suitable for mobile use

WCAG 2.2 requires dynamic status messages to be programmatically available to assistive technologies; accessible names, roles and values are also necessary for interactive components.

22. Customer trust metrics

Track whether the dashboard improves actual customer behaviour.

### Table 113

| Metric | Phase 6 target |
| --- | --- |
| Active booking dashboard views | Increasing |
| Customers viewing sitter profile | Tracked |
| Report Card view rate | 80%+ |
| Service-status support questions | Decreasing |
| Same-sitter requests | Increasing |
| Repeat booking rate | 35%+ eligible cohort |
| Favourite sitter usage | Tracked |
| Active-service support response | P90 under 10 minutes |
| Incorrect status displayed | 0 critical cases |
| Cross-customer data exposure | 0 |
| Verification-badge inaccuracies | 0 |
| Accessibility-critical defects | 0 |

Important interpretation

More dashboard views are not automatically better.

Success means:

Fewer “Where is my sitter?” messages

Fewer “Was my booking confirmed?” messages

More Report Card views

More confident repeat booking

Fewer disputes caused by unclear information

23. Required test cases

Status

Request under review

Payment pending

Sitter assigned

Sitter replaced

Service late

Service active

Tracking lost

Report ready

Booking cancelled

Incident under review

Sitter profile

Current badges

Expired badge

Removed sitter

Replacement sitter

Sitter suspended after confirmation

Security

Customer opens another customer’s booking

Old signed media URL reused

Customer accesses sitter private documents

Favourite endpoint uses another customer ID

Tracking remains accessible after retention window

Timeline

Events delivered out of order

Duplicate event

Timeline update while page is open

Screen reader announces new status

Cancelled event invalidates old reminder

Repeat booking

Favourite sitter available

Favourite sitter unavailable

Pet risk changed

Price changed

Previous instructions expired

Customer repeats a booking linked to an incident

Accessibility

Keyboard-only navigation

Screen-reader status announcements

High zoom

Colour-blind simulation

Reduced motion

Mobile touch controls

24. Definition of done

The Customer Trust Dashboard is ready only when:

Clarity

Customer can understand booking state immediately.

Every status includes a short explanation.

The next action is visible.

Payment, sitter and service states cannot contradict each other.

Trust

Assigned sitter profile is visible.

Verification badges are specific and current.

Report Cards and service history are accessible.

Emergency support is easy to find.

Transparency

Service timeline is timestamped.

Tracking delays are shown honestly.

Replacement and cancellation states are clear.

Report amendments are visible.

Retention

Customer can favourite a sitter.

Repeat booking is pre-filled safely.

Same-sitter preference is not presented as a guarantee.

Reviews and private complaints are separated.

Security

Customers can access only their own information.

Sitter private documents remain hidden.

Media and tracking use controlled access.

Sensitive actions are audited.

Accessibility

Status changes work with assistive technologies.

Colour is not the only indicator.

Buttons and timeline are keyboard accessible.

Critical accessibility tests pass.

Final approved customer journey

Customer logs in

↓

Sees next booking and required action

↓

Reviews assigned sitter and exact verification

↓

Receives confirmation and readiness information

↓

Follows sitter arrival and service timeline

↓

Views tracking and private media where available

↓

Receives completion status

↓

Opens Report Card

↓

Leaves review or private concern

↓

Favourites sitter

↓

Books same sitter again

Final operating principle

Customer trust should come from accurate status, specific verification, transparent service evidence and fast human support—not from decorative badges or promises that the platform cannot prove.

Top of Form

PetSaathi Phase 6 — Admin Operations Command Center 🎛️🐾

Executive decision

Build the Admin Operations Dashboard as a real-time command center, not merely an analytics page.

It should help the operations team:

See which bookings need attention now.

Detect late or missing sitter actions.

Monitor active services.

Resolve payment and Report Card exceptions.

Activate replacement sitters.

Escalate safety incidents.

Control refunds and payouts.

Understand daily capacity and financial performance.

The dashboard should prioritise actionable exceptions, while healthy bookings remain visible but less prominent. Google’s SRE guidance recommends paging humans only for situations requiring immediate action, routing important but non-urgent problems into work queues, and retaining routine information on dashboards.

Booking and service events

↓

Rules and monitoring evaluate risk

↓

Admin alerts created

↓

Alert prioritised and assigned

↓

Admin takes controlled action

↓

Customer/sitter notified

↓

Outcome and audit history recorded

1. Dashboard structure

Use four operational layers.

A. Command header

Show the most urgent platform condition:

Operations status: GREEN / AMBER / RED

Active services: 8

Bookings at risk: 3

Open safety incidents: 1

Unassigned urgent bookings: 2

Support P90: 7 minutes

Green

Operations are within target and no critical intervention is required.

Amber

One or more metrics are approaching failure thresholds.

Red

A safety, payment, capacity or service-continuity issue requires immediate action.

B. Live operations board

Used continuously during service hours:

Services starting soon

Active services

Late arrivals

Tracking failures

Replacement-required bookings

Open incidents

Missing customer or sitter actions

C. Exception queues

Separate operational work by type:

Booking review

Payment review

Report Card review

Incident review

Replacement queue

Refund queue

Sitter-performance review

D. Daily business summary

Used for end-of-day reconciliation:

Paid and completed bookings

Revenue and refunds

Sitter payouts

Gross margin and contribution

Completion and Report Card rates

Customer ratings

Repeat bookings

2. Recommended dashboard widgets

### Table 114

| Widget | Main purpose | Primary action |
| --- | --- | --- |
| Today’s bookings | Daily workload and readiness | Open booking |
| Starting soon | Prevent missed services | Check readiness |
| Services in progress | Live monitoring | View timeline |
| Late sitter alerts | Recover delayed bookings | Contact/replace |
| Payment exceptions | Protect revenue and confirmation | Reconcile |
| Report Cards pending | Protect customer trust | Remind/review |
| Incident alerts | Control safety response | Open incident |
| Backup required | Recover service continuity | Assign replacement |
| Sitter capacity | Avoid overload | Adjust assignment |
| High-performing sitters | Find reliable eligible supply | View availability |
| Sitter review queue | Coaching and risk control | Review evidence |
| Support queue | Track unresolved customer issues | Assign owner |
| Revenue today | Financial control | Reconcile |
| Refunds and disputes | Financial risk | Review case |
| Notification health | Detect communication failure | Retry/fallback |
| Platform reliability | Detect technical failures | Escalate |

3. Today’s bookings widget

Show

Booking code

Pet

Service

Scheduled time

Area

Customer

Primary sitter

Backup coverage

Booking status

Payment status

Risk/control summary

Next required action

Group bookings by time

Starting in 0–30 minutes

Starting in 30–120 minutes

Later today

Completed

Cancelled

Example

BK-1001 · Bruno’s Dog Walk

7:30–8:00 AM · Bopal

Primary: Riya

Payment: Captured

Readiness: Sitter acknowledgement missing

Risk: Yellow · strong-pulling controls

Action:

Contact sitter

View backup candidates

Open booking

Healthy bookings should not visually compete with bookings requiring intervention.

4. Services-in-progress widget

This is the live operational view.

Show

Booking code

Pet and sitter

Actual start time

Expected end time

Elapsed duration

Tracking status

Last update age

Latest media update

Concern flag

Support owner

Example

BK-1012 · Bruno

Dog walk with Riya

Started: 7:32 AM

Elapsed: 18 minutes

Tracking: Active

Last point: 22 seconds ago

Concern: None

Warning conditions

Tracking signal missing

Service significantly overdue

Sitter stopped responding

Concern submitted

Customer requested support

Service started without valid check-in

The widget should display only operationally meaningful signals, rather than every low-level technical event. Google recommends monitoring user-visible symptoms and actionable failures while avoiding noisy alerts that operators cannot meaningfully act upon.

5. Late-sitter alert system

Trigger stages

Before service

T−30 min:

Sitter has not opened or acknowledged booking

T−15 min:

Travel/readiness status missing

Scheduled start:

No valid arrival/check-in

T+5 min:

Late-start warning

T+10 min:

Operations intervention required

T+15 min:

Replacement review or documented delay

These should remain configurable by city, service and society-entry conditions.

Alert content

LATE START ALERT

Booking: BK-1001

Scheduled: 7:30 AM

Primary sitter: Riya

Check-in: Missing

Customer notified: No

Eligible backups: 3

Admin actions

Call sitter

Send reminder

Notify customer

Allow documented delay

Start replacement

Cancel and refund

Open incident

False-positive protection

Do not mark the sitter responsible automatically when:

The customer is unavailable.

Society security delays access.

The address is incorrect.

The customer requested a delayed start.

A previous PetSaathi incident caused the delay.

The alert identifies an operational exception; responsibility requires review.

6. Payment operations widget

Do not label every unpaid request simply as “revenue pending.”

Separate:

Payment required

Payment processing

Payment captured

Payment failed

Captured but booking not confirmed

Duplicate attempt

Refund processing

Payment dispute

Settlement mismatch

Critical alerts

Captured payment without confirmation

PAYMENT RECONCILIATION ALERT

Payment: CAPTURED

Booking: PAYMENT_PENDING

Amount: ₹149

Age: 3 minutes

This requires immediate reconciliation because Razorpay records a captured payment and marks its associated order paid through events such as payment.captured and order.paid.

Payment failed

PAYMENT ISSUE

Booking: BK-1001

Payment attempt: Failed

Customer retry available: Yes

Sitter reservation expires in: 12 minutes

Razorpay supports the payment.failed webhook, which allows the platform to record the failure and notify the customer accurately.

Refund failed

Razorpay provides separate refund events such as refund.created, refund.processed and refund.failed; the dashboard should therefore track refund progress independently from booking cancellation.

Financial actions

Fetch provider status

Retry internal processing

Release sitter reservation

Send payment retry link

Approve refund

Retry refund

Escalate dispute

7. Report Card pending widget

Show

Completed booking

Service completion time

Sitter

Report status

Time overdue

Missing fields

Concern status

Delivery status

Alert stages

Service completed:

Draft generated

+15 minutes:

Sitter reminder

+30 minutes:

Report pending alert

+60 minutes:

Admin intervention

Concern submitted:

Immediate safety review

Example

REPORT PENDING

Booking: BK-1042

Service completed: 42 minutes ago

Sitter: Aditi

Missing:

• Behaviour update

• Handover confirmation

Admin actions

Remind sitter

Open draft

Return for correction

Approve documented exception

Contact customer

Open incident

A Report Card should count as complete only after it is valid and available to the customer—not merely because a sitter pressed Submit.

8. Incident-alert widget

Incident alerts must appear above ordinary operational alerts.

Show

Incident code

Severity

Pet and booking

Incident type

Time since report

Incident owner

Customer contacted?

Vet contacted?

Current containment state

Next action

Example

SAFETY ALERT · LEVEL 3

INC-2026-00145

Type: Lost pet

Booking: BK-1102

Reported: 2 minutes ago

Incident commander: Unassigned

Customer contacted: Yes

Last-known location: Available

Immediate actions

Assign incident commander

Call customer

Call sitter

Open tracking route

Contact veterinary/emergency support

Start approved search procedure

Hold booking/payout

Page-worthy critical alerts should reach the responsible on-call owner, while moderate incidents may enter an urgent work queue. Google SRE distinguishes immediate human paging from ticket-level and informational alerts to prevent alert fatigue.

9. Backup-required widget

Trigger when

Primary sitter cancels.

Sitter acknowledgement expires.

Sitter is unreachable.

Sitter will be materially late.

Verification becomes invalid.

Customer rejects the assigned sitter.

A prior booking is overrunning.

A safety restriction is applied.

Show

Booking

Original sitter

Reason

Service start time

Time remaining

Backup coverage level

Eligible candidates

Customer status

Refund exposure

Example

BACKUP REQUIRED

BK-1028 · Pet Sitting

Starts in: 45 minutes

Primary unavailable: Illness

Eligible replacements: 2

Customer informed: Yes

Admin actions

Send backup offers

Assign accepted replacement

Request customer approval

Offer another time

Cancel and refund

Open incident

Only sitters passing current service, availability, travel, risk and capacity rules should appear as eligible backups.

10. High-performing sitter widget

Rename Top Sitters to:

Eligible High-Performing Sitters

This avoids presenting a simplistic leaderboard.

Show

Service permissions

Current area

Current availability

On-time rate

Completion rate

Cancellation/no-show rate

Report Card rate

Adjusted customer rating

Same-sitter requests

Current capacity

Do not rank only by overall score

Matching order should remain:

Eligibility

→ pet and service compatibility

→ availability

→ travel time

→ workload

→ customer preference

→ reliability ranking

A highly rated small-dog walker must not be recommended for a large, strong-pulling dog without the required handling approval.

Privacy

This widget should be internal. Do not expose comparative sitter rankings publicly.

11. Low-score sitter widget

Rename Low-Score Sitters to:

Sitter Review and Coaching Queue

A low numerical score is not proof of risk.

Show

Sitter

Current status

Score and confidence

Main declining components

Number of eligible bookings

Open incidents

Verification expiry

Existing coaching plan

Review deadline

Example

Riya S. · Coaching Review

Score: 72

Confidence: Established

Main issue: On-time rate declined to 84%

Safety incidents: None

Suggested action: Reduce radius and review scheduling

Actions

Review booking evidence

Exclude customer-caused delays

Create coaching plan

Reduce service radius

Limit consecutive bookings

Require retraining

Temporarily restrict a service

Start safety review

Suspension or removal should require evidence and authorised human review, particularly where the system uses performance data to affect the sitter’s access to work.

12. Revenue-today widget

Do not display one number called “Revenue today.”

Show a financial waterfall:

### Table 115

| Metric | Meaning |
| --- | --- |
| Gross booking value | Total customer value booked |
| Captured payments | Successfully collected payments |
| Completed-service revenue | Value of services delivered |
| Refunds | Processed or pending returns |
| Net collected | Captured less processed refunds |
| Sitter payouts | Amount owed or paid |
| Provider costs | Payment fees |
| Gross margin | Payment minus sitter payout |
| Contribution | Margin minus direct variable costs |
| Settlement difference | Provider/bank reconciliation gap |

Example

TODAY’S FINANCIALS

Captured payments ₹8,940

Completed-service value ₹7,450

Refunds processed ₹299

Sitter payouts ₹5,100

Gross margin ₹2,350

Direct variable costs ₹410

Contribution ₹1,940

Revenue tracking should reconcile provider webhooks, internal payment records and settlement information—not rely only on frontend payment-success callbacks. Razorpay exposes payment, refund and dispute events for this purpose.

13. Alert priority levels

Use four operational priorities.

P0 — Immediate safety or security emergency

Examples:

Pet missing

Serious injury

Critical data exposure

Two customers viewing each other’s records

Response:

Immediate paging

Incident command

Potential booking pause

P1 — Active-service failure

Examples:

Sitter no-show

Tracking and communication lost

Replacement required

Captured payment not attached to booking

Response:

Immediate operations alert

Named owner

Response within minutes

P2 — Time-sensitive workflow exception

Examples:

Report Card overdue

Sitter acknowledgement missing

Payment reservation expiring

Refund failed

Response:

Urgent operations queue

Same-shift resolution

P3 — Quality or informational review

Examples:

Rating declined

Repeated minor lateness

Sitter verification approaching expiry

Response:

Review queue

No immediate paging

14. Alert lifecycle

OPEN

ACKNOWLEDGED

ASSIGNED

INVESTIGATING

MITIGATED

RESOLVED

CLOSED

SUPPRESSED_WITH_REASON

Every alert should include:

Alert ID

Alert type

Priority

Related booking/incident/payment

Trigger rule

First observed time

Last observed time

Assigned admin

Recommended action

Current status

Deduplication

Do not generate a new alert every minute for the same unresolved late booking.

Use a deduplication key such as:

booking_id

+ alert_type

+ workflow_version

Google’s practical alerting guidance recommends deduplicating related alerts and suppressing dependent alerts when a higher-level root alert already explains the failure.

Example:

Primary alert:

Sitter no-show

Suppress:

Service not started

Tracking not started

Photo update missing

The dependent alerts remain in history but should not create separate urgent pages.

15. Actionable alert design

Every alert must answer:

What happened?

Which customer, sitter, pet or booking is affected?

How urgent is it?

What evidence triggered the alert?

What should the admin do next?

What happens if no action is taken?

Poor alert

Booking problem detected.

Good alert

LATE START · P1

BK-1001 was scheduled for 7:30 AM.

No arrival or check-in has been received as of 7:38 AM.

Primary sitter: Riya

Customer informed: No

Eligible backups: 3

Recommended action:

Call primary sitter and begin replacement review.

16. Admin roles and permissions

Do not give every administrator full control.

Operations admin

May:

Review bookings

Contact customers and sitters

Assign or replace sitters

Manage ordinary service exceptions

Safety admin

May:

View health and behaviour concerns

Manage incidents

Apply sitter or pet safety restrictions

Access incident evidence

Finance admin

May:

Reconcile payments

Approve eligible refunds

Review payouts and disputes

Verification admin

May:

Review sitter documents

Manage verification status

Renew badges and permissions

Support admin

May:

Respond to customer questions

View limited booking information

Escalate incidents and finance issues

Super admin

Reserved for highly privileged system administration.

PostgreSQL Row-Level Security can restrict which rows a database role may read or modify, but database owners and roles with BYPASSRLS can bypass those rules. Such privileges should therefore be tightly controlled rather than granted to ordinary application roles.

OWASP likewise recommends deny-by-default authorisation and automated testing of the full role/action matrix.

17. Sensitive admin actions

Require elevated permission, reason and reauthentication for:

Manually confirming payment

Assigning an otherwise ineligible sitter

Overriding a safety restriction

Approving a large refund

Closing a serious incident

Suspending a sitter

Changing a delivered Report Card

Accessing raw tracking data

Exporting incident evidence

Required audit record

Actor

Role

Action

Target

Previous value

New value

Reason

Timestamp

Request ID

IP/device context where appropriate

OWASP recommends application-level security logging and audit trails for important state changes, while excluding secrets, credentials and unnecessary sensitive data from logs.

18. Dashboard data architecture

Create purpose-built read models rather than assembling the command center through dozens of slow frontend calls.

admin_operations_summary

May contain aggregated values such as:

business_date

total_bookings

starting_soon

active_services

late_services

unassigned_bookings

payment_exceptions

pending_reports

open_incidents

replacement_required

captured_amount

refund_amount

gross_margin

admin_alerts

id

alert_type

priority

booking_id

incident_id

payment_id

sitter_id

trigger_code

title

description

status

assigned_to

first_detected_at

last_detected_at

acknowledged_at

resolved_at

deduplication_key

admin_action_history

id

admin_user_id

action_type

resource_type

resource_id

previous_state

new_state

reason_code

reason_text

created_at

request_id

operations_shift_assignments

id

admin_user_id

role

shift_start

shift_end

service_areas

status

This makes it possible to show who owns active alerts during each operating period.

19. Suggested API structure

Summary

GET /api/admin/operations/summary

GET /api/admin/operations/live

GET /api/admin/operations/capacity

Bookings

GET /api/admin/bookings/today

GET /api/admin/bookings/at-risk

POST /api/admin/bookings/:id/contact-sitter

POST /api/admin/bookings/:id/start-replacement

POST /api/admin/bookings/:id/document-delay

Alerts

GET /api/admin/alerts

POST /api/admin/alerts/:id/acknowledge

POST /api/admin/alerts/:id/assign

POST /api/admin/alerts/:id/mitigate

POST /api/admin/alerts/:id/resolve

Finance

GET /api/admin/payments/exceptions

POST /api/admin/payments/:id/reconcile

GET /api/admin/refunds/pending

POST /api/admin/refunds/:id/approve

Reports

GET /api/admin/reports/pending

POST /api/admin/reports/:id/remind

POST /api/admin/reports/:id/return-for-correction

Incidents

GET /api/admin/incidents/active

POST /api/admin/incidents/:id/assign

POST /api/admin/incidents/:id/escalate

POST /api/admin/incidents/:id/add-action

Sitters

GET /api/admin/sitters/capacity

GET /api/admin/sitters/performance-review

POST /api/admin/sitters/:id/create-coaching-plan

POST /api/admin/sitters/:id/restrict

20. Dashboard filtering

Provide filters for:

City

Area

Service

Scheduled date/time

Booking status

Alert priority

Payment status

Risk level

Sitter

Operations owner

Incident severity

Saved views

Useful presets:

My active alerts

Starting in 30 minutes

Bopal morning operations

Unassigned Yellow-risk bookings

Refunds requiring finance approval

Report Cards overdue over 30 minutes

21. Real-time update model

Use event-driven updates where beneficial.

Examples:

booking.confirmed

sitter.acknowledgement_overdue

service.started

service.start_overdue

tracking.signal_lost

payment.captured

payment.failed

report.overdue

incident.opened

replacement.required

The dashboard may receive updates through:

WebSocket

Server-Sent Events

Short controlled polling

Background event consumers

A failed real-time channel must fall back to periodic refresh; the command center should never silently freeze while showing old data.

Always display:

Last updated: 10:42:18 AM

22. Platform reliability widget

Monitor the infrastructure supporting operations.

Google’s four common monitoring signals are:

Latency

Traffic

Errors

Saturation

These help operators understand whether a failure is isolated to one booking or represents a wider system problem.

Show

API error rate

API latency

Database connection saturation

Webhook backlog

Notification queue backlog

Media-upload failures

Tracking-ingestion delay

Payment-event failures

Open critical defects

Example

Notification queue: 1,842 pending

Oldest queued event: 14 minutes

Status: RED

This is more useful than a generic “notification service unhealthy” message.

23. Dashboard success metrics

### Table 116

| Metric | Recommended Phase 6 target |
| --- | --- |
| Critical alert acknowledgement | Immediate/under 2 minutes |
| P1 operational alert acknowledgement | Under 5 minutes |
| Alert ownership | 100% P0/P1 alerts |
| Late-start intervention | Under 5–10 minutes |
| Report Card delivery | 98%+ |
| Payment reconciliation | 100% by daily close |
| Replacement success with eligible backup | 80%+ |
| Sitter on-time rate | 95%+ |
| Active-service support P90 | Under 10 minutes |
| Duplicate critical alerts | Near zero |
| Unassigned critical alert | 0 |
| Cross-role unauthorised admin access | 0 |
| Sensitive action without audit record | 0 |

24. Required tests

Live operations

Normal booking starts on time

Sitter late

Sitter no-show

Tracking fails

Service runs overtime

Customer submits concern

Payments

Payment captured normally

Payment failed

Duplicate webhook

Captured payment not linked to booking

Refund fails

Dispute created

Reports

Report submitted on time

Report overdue

Concern report submitted

Notification fails

Report corrected

Replacement

Backup found

Two backups accept simultaneously

No backup available

Customer rejects replacement

Primary returns after replacement assignment

Alerts

Duplicate event received

Root alert suppresses dependent alerts

Alert owner unavailable

Alert reopened

Alert manually suppressed with reason

Permissions

Support admin attempts refund approval

Finance admin opens private health evidence

Operations admin closes Level 3 incident

Verification admin assigns sitter

Ordinary admin bypasses safety restriction

Reliability

WebSocket disconnects

Dashboard shows stale data

Event queue delayed

Database temporarily unavailable

Notification provider fails

25. Definition of done

The Admin Operations Dashboard is complete only when:

Visibility

Today’s bookings and active services are accurate.

At-risk bookings are prioritised.

Every widget shows its last update time.

Payment, booking and service states cannot contradict silently.

Alerts

Alerts are prioritised and actionable.

Duplicate alerts are deduplicated.

Critical alerts reach the correct duty owner.

Every P0/P1 alert receives ownership.

Operations

Admin can contact users, replace sitters and manage delays.

Backup candidates are eligibility-filtered.

Report Card exceptions are resolvable.

Incident workflows are integrated.

Finance

Captured payments reconcile with bookings.

Refund states reflect provider progress.

Revenue, payouts and margin are separated.

Financial overrides require authorisation and auditing.

Security

Admin permissions are role-specific.

Sensitive information is restricted.

High-impact actions require reasons.

Complete audit records exist.

APIs use HTTPS and server-side authorisation.

Reliability

Live updates have a fallback.

Platform health is visible.

Critical queue failures create alerts.

Stale or frozen dashboard data is detectable.

Final approved command-center flow

System receives booking, payment and service events

↓

Dashboard updates operational state

↓

Rules identify exceptions

↓

Alerts prioritised as P0–P3

↓

Alert assigned to named admin

↓

Admin contacts customer/sitter or triggers workflow

↓

Replacement, refund, report or incident action completed

↓

Customer receives accurate update

↓

Alert resolved with audit history

↓

Daily quality and financial reconciliation

Final operating principle

The Admin Operations Dashboard should make normal services quiet and operational failures impossible to ignore.

Simple explanation for professor

“The Admin Operations Dashboard will work as PetSaathi’s command center.

It will show today’s bookings, services currently running, late sitters, payment problems, pending Report Cards, incidents, replacement requests, sitter capacity and daily financial performance.

The dashboard will not show every event as an emergency. Safety and active-service failures will receive high-priority alerts, while routine quality issues will enter review queues.

For example, if a sitter does not start a booking on time, the dashboard will display the booking, scheduled time, assigned sitter, customer-notification status and eligible backup sitters. The admin can contact the sitter, inform the customer or start the replacement workflow.

Payment states will remain separate from booking states. The dashboard will detect cases where payment was captured but the booking was not confirmed, failed payments, refund failures and disputes.

Pending Report Cards will show how long the report has been overdue and which required fields are missing. Safety concerns in a report will enter the incident workflow immediately.

High-performing sitters will be shown only after service eligibility, location, availability and workload checks. Low-performing sitters will enter a coaching and review queue rather than being automatically suspended by one score.

Administrators will have separate permissions. Operations staff will manage bookings, safety staff will manage incidents, finance staff will manage refunds and verification staff will manage sitter documents. Sensitive actions will require a reason and will be stored in an audit history.

The dashboard succeeds when normal bookings require little attention, while every safety, reliability, payment or service-continuity problem is detected quickly and assigned to the correct person.”

PetSaathi Phase 6 — Cancellation and Refund Automation 💳🐾

Executive decision

Build the module as a policy recommendation engine with admin-approved money movement.

The system may automatically:

Detect who cancelled.

Calculate the applicable policy window.

Estimate the refundable amount.

Calculate sitter compensation.

Suggest credit or rescheduling options.

Create an approval request.

Track Razorpay refund progress.

However, during Phase 6, an authorised admin should approve the final financial action before money is returned.

Cancellation requested

↓

System captures reason and timing

↓

Applicable policy version selected

↓

Refund, credit and sitter impact calculated

↓

Admin reviews recommendation

↓

Refund approved or rejected

↓

Razorpay refund initiated

↓

Webhook updates refund status

↓

Customer and sitter notified

↓

Finance reconciliation completed

1. Important legal and fairness correction

The proposed time windows—12 hours, 3–12 hours and under 3 hours—are PetSaathi business-policy choices, not universal legal limits.

PetSaathi must clearly display its cancellation and refund policy before payment and record the customer’s explicit agreement. India’s E-Commerce Rules require clear consumer information, explicit affirmative consent and timely processing of accepted refund requests. They also state that an e-commerce entity should not impose cancellation charges on customers unless similar charges are borne by the entity when it cancels unilaterally.

This makes a completely one-sided policy risky:

Customer cancels → customer loses ₹100

Platform cancels → only original ₹100 is returned

A more balanced structure is:

Customer late cancellation

→ disclosed cancellation deduction

PetSaathi or sitter cancellation

→ full refund

+ equivalent service-recovery credit or compensation

The exact policy should receive review from qualified Indian consumer-law counsel before production launch.

2. Recommended Phase 6 cancellation policy

Customer-initiated cancellation

### Table 117

| Cancellation time | Recommended default |
| --- | --- |
| 12+ hours before service | Full refund to original payment method |
| 3–12 hours before service | Partial refund; disclosed late-cancellation deduction |
| Under 3 hours | Manual review; partial/no refund depending on circumstances |
| After sitter arrival | Manual review; sitter travel/time compensation considered |
| After service starts | Normally no ordinary cancellation; use incident/service-adjustment process |

Recommended customer options

Where appropriate, offer:

Refund to original payment method

Reschedule without refund

PetSaathi account credit

Alternative sitter

Alternative service time

Credit should not silently replace a cash refund. The customer should actively choose credit when both options are legally and commercially available.

3. Suggested pilot percentages

These are starting commercial recommendations—not fixed legal requirements.

### Table 118

| Window | Customer refund | Possible sitter compensation |
| --- | --- | --- |
| 12+ hours | 100% | None |
| 3–12 hours | 50–75% | 25–50% of sitter payout |
| Under 3 hours | 0–50% after review | 50–80% of sitter payout |
| Customer no-show | Case-specific | Up to full agreed payout |
| Sitter cancellation | 100% or replacement | No payout; reliability event |
| Platform failure | 100% | Sitter treatment based on cause |
| Unsafe/inaccurate information | Manual review | Based on work already performed |

Use one consistent published policy version during the pilot. Do not change percentages after a booking has already been paid.

4. Full-refund exceptions

Even inside the late-cancellation window, a full refund or generous credit may be appropriate when:

Pet has a documented medical emergency.

Customer or immediate family has a serious emergency.

Extreme weather makes the service unsafe.

Society or government restrictions block access.

PetSaathi cannot provide the agreed sitter or replacement.

Service area or system information was incorrect.

Duplicate payment occurred.

PetSaathi cancelled for operational reasons.

Safety information supplied by PetSaathi was materially wrong.

A serious incident prevents the service.

Store supporting evidence only when proportionate and genuinely needed.

5. Sitter-initiated cancellation

Correct workflow

Sitter requests cancellation

↓

Reason and availability recorded

↓

Booking enters REPLACEMENT_REQUIRED

↓

Eligible backup sitters generated

↓

Customer receives replacement proposal

Replacement succeeds

New sitter assigned

↓

Customer approves where required

↓

Existing payment stays linked

↓

Booking reconfirmed

Replacement fails

Booking cancelled

↓

Full refund approved

↓

Optional service-recovery credit

↓

Sitter reliability event created

Do not refund first if a safe replacement can be provided promptly and the customer agrees to it.

Customer choices

The customer should be able to:

Accept the replacement.

Select another time.

Decline the replacement and receive the applicable refund.

Contact support.

6. Platform-initiated cancellation

Examples include:

No eligible sitter.

Payment or system failure.

Service-area problem.

Verification failure discovered after confirmation.

PetSaathi operational error.

Unsafe conditions created by incorrect platform information.

Recommended outcome:

Full refund

+ transparent explanation

+ optional goodwill/service credit

When PetSaathi imposes late-cancellation charges on customers, it should adopt a meaningfully symmetrical remedy when PetSaathi cancels, consistent with the E-Commerce Rules’ cancellation-charge principle.

7. Safety-related cancellation

Safety cancellations need a separate path.

Examples

Newly disclosed bite history.

Active vomiting or breathing concern.

Unsafe collar or harness.

Customer refuses mandatory safety controls.

Boarding vaccination or compatibility requirement not met.

Property presents danger.

Sitter discovers materially incorrect instructions.

Possible outcomes:

RESCHEDULE_AFTER_REVIEW

CHANGE_SERVICE

REQUEST_VETERINARY_CLEARANCE

WAITLIST

CANCEL_WITH_FULL_REFUND

CANCEL_WITH_PARTIAL_REFUND

CANCEL_WITHOUT_REFUND_AFTER_REVIEW

Do not automatically apply “no refund” merely because the word “safety” was selected. The admin must determine who caused the unsafe condition and whether PetSaathi had already incurred valid service costs.

8. Separate state machines

Do not use one status field for cancellation, refund and credit.

Booking status

CONFIRMED

REPLACEMENT_REQUIRED

CANCELLED

INCIDENT_HOLD

CLOSED

Cancellation status

REQUESTED

UNDER_REVIEW

APPROVED

DECLINED

WITHDRAWN

COMPLETED

Refund status

Use:

NOT_REQUIRED

REQUESTED

UNDER_REVIEW

APPROVED

REJECTED

PROCESSING

PROCESSED

PARTIALLY_PROCESSED

FAILED

Prefer PROCESSED rather than REFUNDED because it clearly represents the payment-provider result.

Credit status

NOT_APPLICABLE

OFFERED

ACCEPTED

ISSUED

PARTIALLY_USED

USED

EXPIRED

REVOKED

Sitter-payout status

NOT_ELIGIBLE

PENDING

ON_HOLD

APPROVED

PROCESSING

PAID

ADJUSTED

REJECTED

Example combined state:

Booking: CANCELLED

Cancellation: COMPLETED

Refund: PROCESSING

Credit: NOT_APPLICABLE

Sitter payout: APPROVED

9. Correct refund workflow

Step 1 — Customer submits cancellation

Collect:

Booking ID

Cancellation reason

Optional explanation

Requested outcome

Customer confirmation

The backend records the exact cancellation timestamp.

Step 2 — Freeze the booking

Immediately prevent:

Service start

New media upload

Automatic Report Card creation

New payout finalisation

Obsolete reminders

The system may temporarily preserve a primary or backup sitter while the cancellation is being confirmed.

Step 3 — Select policy version

Use the policy that applied when the booking was confirmed.

policy_version = CANCELLATION_POLICY_2026_01

Never apply a newer, less favourable policy retroactively.

Step 4 — Generate recommendation

The system calculates:

Time remaining

Cancellation actor

Reason category

Payment captured?

Service started?

Sitter checked in?

Replacement possible?

Previous refund amount

Maximum refundable balance

Suggested refund

Suggested credit

Suggested sitter payout

Approval level required

Step 5 — Admin review

The admin can:

Approve recommendation

Change amount with reason

Request more information

Offer rescheduling

Offer credit

Reject request

Escalate to safety/finance

Any override needs an audit explanation.

Step 6 — Initiate Razorpay refund

Razorpay permits full and partial refunds only against captured payments. Refund amounts are sent in the smallest currency unit, and idempotent refund requests are supported.

Example:

₹149 full refund = 14900 paise

₹75 partial refund = 7500 paise

Step 7 — Track provider events

Razorpay exposes refund events including:

refund.created

refund.processed

refund.failed

refund.speed_changed

PetSaathi should validate webhook signatures, store the provider event ID and update the internal refund record idempotently.

Step 8 — Notify customer accurately

Do not say:

Your money has reached your bank.

when PetSaathi only created the refund.

Use:

Processing

Your refund of ₹149 has been initiated. We will update the booking when the payment provider confirms processing.

Processed

Razorpay has processed your refund of ₹149. Your bank may require additional time to display the amount.

Normal Razorpay refunds are generally described as taking approximately five to seven working days, although actual receipt can depend on the payment method and banking system.

10. Partial refund handling

A partial refund should create a separate refund record.

Example:

Captured amount: ₹299

Approved refund: ₹199

Retained cancellation amount: ₹100

Razorpay supports partial refunds, and the associated payment may remain in the captured state until the full captured amount has been refunded. PetSaathi must therefore rely on its refund records and amount_refunded, not assume that payment.status = captured means no refund occurred.

Multiple partial refunds

Prevent the sum of all processed and in-progress refunds from exceeding the captured payment.

Maximum new refund =

Captured amount

− processed refunds

− currently processing refunds

11. Idempotency and double-refund protection

Refund actions are financially sensitive.

Use an idempotency key such as:

refund:{booking_id}:{approval_id}:{amount}

Example:

refund:BK-1001:RFA-0042:14900

Inside the transaction:

Lock payment/refund balance

Confirm payment is captured

Confirm approval remains valid

Confirm refundable balance

Create refund request record

Commit

Call provider using idempotency key

If an admin double-clicks or a worker retries, the customer must not receive two refunds.

Razorpay explicitly supports idempotency for refund requests.

12. Refund approval controls

Suggested authority levels

### Table 119

| Refund type | Approval |
| --- | --- |
| Standard policy refund | Operations admin |
| Policy override | Senior operations admin |
| High-value refund | Finance admin |
| Incident-related refund | Safety + finance review |
| Refund above captured balance | Blocked |
| Manual payment correction | Finance admin with reauthentication |

Required admin information

Show:

Original payment

Previously refunded amount

Remaining refundable balance

Policy recommendation

Requested refund

Sitter compensation

Customer history

Incident linkage

Reason for override

Admin control must not mean arbitrary decisions. Similar circumstances should receive similar treatment.

13. Cancellation reason codes

Customer reasons

CUSTOMER_PLAN_CHANGED

PET_UNWELL

CUSTOMER_EMERGENCY

ADDRESS_OR_ACCESS_PROBLEM

WEATHER_CONCERN

PET_NOT_AVAILABLE

BOOKED_BY_MISTAKE

DUPLICATE_BOOKING

OTHER

Sitter reasons

SITTER_ILLNESS

TRANSPORT_FAILURE

PERSONAL_EMERGENCY

SCHEDULE_CONFLICT

PET_INFORMATION_CONCERN

UNSAFE_CONDITION

OTHER

Platform reasons

NO_ELIGIBLE_SITTER

TECHNICAL_FAILURE

SERVICE_AREA_ERROR

VERIFICATION_FAILURE

PAYMENT_SYSTEM_FAILURE

SAFETY_RESTRICTION

OPERATIONAL_ERROR

OTHER

Do not expose internal blame prematurely

Customer-facing:

Your booking was cancelled because a suitable sitter was unavailable.

Internal:

NO_ELIGIBLE_SITTER_AFTER_PRIMARY_CANCELLATION

14. Credits and wallet-like balances

For Phase 6, use a simple service-credit ledger, not a complex consumer wallet.

Credit record

credit_id

customer_id

source_booking_id

amount

reason

issued_at

expires_at

remaining_amount

status

Important controls

Customer actively accepts credit where required.

Expiry is shown before acceptance.

Credit cannot be silently substituted for a legal cash refund.

Credit usage is auditable.

Refund and credit cannot exceed the authorised remedy.

Promotional credit and refundable customer funds remain distinguishable.

Avoid calling this a “wallet” until legal, accounting and payment implications have been reviewed.

15. Sitter compensation

Customer cancellation rules affect sitter trust too.

Compensation factors

Time remaining

Travel already begun?

Sitter arrived?

Service preparations completed?

Opportunity cost

Cancellation cause

Sitter responsibility

Example

### Table 120

| Scenario | Suggested treatment |
| --- | --- |
| Customer cancels 18 hours before | No sitter payout |
| Customer cancels 5 hours before | Partial compensation |
| Customer cancels after sitter travels | Travel + partial service compensation |
| Customer no-show | High or full compensation |
| Sitter cancels avoidably | No payout |
| Platform cancels after sitter commitment | Standby/service-recovery compensation |
| Safety issue caused by incorrect customer disclosure | Admin decision based on work incurred |

Do not deduct the customer’s entire cancellation amount and keep all of it as platform revenue when the sitter lost reserved time.

16. Boarding cancellation policy

Boarding should not automatically use the same policy as a 30-minute walk.

Boarding may involve:

Reserved property capacity.

Meet-and-greet work.

Multi-day calendar blocking.

Lost alternative bookings.

Feeding and preparation.

Host standby.

Deposit and balance payments.

Example boarding structure

Deposit at confirmation

Balance before check-in

Possible policy:

### Table 121

| Time before check-in | Outcome |
| --- | --- |
| 72+ hours | Full/major refund |
| 24–72 hours | Partial refund |
| Under 24 hours | Manual review or limited refund |
| Host/platform cancellation | Full refund plus recovery assistance |
| Pet-health emergency | Evidence-based exception |

This separate policy must be disclosed before boarding payment.

17. Customer cancellation interface

The cancellation flow should be easy to find and understand.

View booking

↓

Cancel or reschedule

↓

See calculated outcome

↓

Choose refund, credit or reschedule

↓

Confirm cancellation

Before confirmation, show:

Refund to original payment method: ₹199

Cancellation deduction: ₹100

Estimated processing method: Razorpay refund

Sitter assignment will be released

Do not:

Hide the cancellation button.

Force customers to call for every ordinary cancellation.

Show a misleading “full refund” when only credit is offered.

Preselect account credit.

Add undisclosed fees at the final step.

PetSaathi should avoid manipulative or unnecessarily difficult cancellation designs, consistent with India’s consumer-protection approach to dark patterns and informed consent.

18. Recommended database schema

booking_cancellations

id

booking_id

cancelled_by_user_id

cancelled_by_role

reason_code

reason_text

requested_at

effective_at

policy_version

scheduled_start_snapshot

hours_before_service

replacement_attempted

status

reviewed_by

reviewed_at

decision_notes

refund_requests

id

booking_id

payment_id

cancellation_id

requested_amount

recommended_amount

approved_amount

currency

status

reason_code

requested_by

approved_by

approved_at

provider

provider_refund_id

idempotency_key

created_at

updated_at

refund_events

id

refund_id

provider_event_id

event_type

payload_hash

provider_status

received_at

processed_at

processing_status

error_message

customer_credits

id

customer_id

booking_id

amount

remaining_amount

reason_code

status

issued_at

expires_at

created_by

cancellation_policy_versions

id

version_code

service_type

effective_from

effective_until

rules_json

approved_by

created_at

19. Admin dashboard

Refund queue

Show:

Booking

Customer

Service

Cancellation actor

Scheduled start

Cancellation time

Policy version

Payment amount

Recommended refund

Requested refund

Sitter compensation

Current status

Alerts

Refund waiting for approval

Refund approved but not submitted

Refund processing too long

Refund failed

Refund exceeds available balance

Cancelled booking still has active sitter

Customer received credit and full refund

Sitter payout conflicts with cancellation result

Admin actions

Approve

Approve partial

Reject with reason

Offer reschedule

Offer credit

Escalate to finance

Retry failed refund

Contact customer

20. Customer-facing refund status

Use plain language.

### Table 122

| Internal state | Customer wording |
| --- | --- |
| REQUESTED | Cancellation request received |
| UNDER_REVIEW | Refund being reviewed |
| APPROVED | Refund approved |
| PROCESSING | Refund initiated |
| PROCESSED | Refund processed |
| PARTIALLY_PROCESSED | Partial refund processed |
| FAILED | Refund needs attention |
| REJECTED | Refund request not approved |
| Credit issued | PetSaathi credit available |

Always show:

Amount

Destination

Request date

Current state

Refund reference when available

Support action

21. Required tests

Policy calculation

Cancellation exactly 12 hours before.

Cancellation exactly 3 hours before.

Customer and server time zones differ.

Service rescheduled before cancellation.

Policy version changed after payment.

Boarding uses a different policy.

Payment

Full refund.

Partial refund.

Multiple partial refunds.

Refund exceeds balance.

Payment not captured.

Duplicate refund request.

Provider timeout.

refund.failed webhook.

Out-of-order webhook.

Actors

Customer cancellation.

Sitter cancellation.

Admin cancellation.

System cancellation.

Safety cancellation.

Customer no-show.

Replacement

Replacement accepted.

Customer rejects replacement.

No replacement exists.

Original sitter returns after cancellation.

Payment remains attached to replacement.

Security

Support admin approves high-value refund.

Customer requests refund for another booking.

Sitter changes refund amount.

Refund webhook signature invalid.

Credit issued twice.

Sensitive payment data appears in logs.

Fairness

Two identical cases receive identical recommendations.

Admin override requires a reason.

Sitter/platform cancellation produces symmetrical remedy.

Customer can choose cash instead of credit where applicable.

Cancellation policy was visible before payment.

22. Success metrics

### Table 123

| Metric | Recommended Phase 6 target |
| --- | --- |
| Policy-calculation accuracy | 99%+ |
| Refunds with admin approval | 100% |
| Refunds exceeding captured balance | 0 |
| Duplicate refunds | 0 |
| Accepted refund submitted promptly | 95%+ |
| Provider refund failures | Monitored and retried |
| Cancellation decisions with policy version | 100% |
| Admin overrides with reason | 100% |
| Refund/dispute rate | Below 3–5% |
| Platform/sitter cancellation recovery | 95%+ |
| Customer credit without consent | 0 |
| Cancelled bookings with active service | 0 |

23. Definition of done

The module is complete only when:

Policy

Rules are service-specific and versioned.

Customers see the policy before payment.

Customer, sitter and platform cancellations are separated.

Exceptions and symmetry have been legally reviewed.

Automation

The system calculates recommendations consistently.

Admin approves financial movement.

Invalid refund amounts are blocked.

Cancellation stops obsolete reminders and service actions.

Payments

Only captured payments are refunded.

Full and partial refunds work.

Refund requests are idempotent.

Razorpay webhooks update final status.

Provider and internal records reconcile.

Customer experience

Cancellation is easy to find.

Refund amount is shown before confirmation.

Credit is optional and clearly described.

Refund status remains visible.

Customer receives a usable reference.

Sitter fairness

Sitter compensation is calculated separately.

Late customer cancellations recognise reserved time.

Avoidable sitter cancellations affect reliability.

Platform failures do not shift the entire loss to sitters.

Security

Refund approval is role-controlled.

High-value actions require stronger approval.

Every override is audited.

Payment credentials and sensitive details stay out of logs.

Final approved Phase 6 flow

Customer/sitter/admin requests cancellation

↓

Booking and service state validated

↓

Policy version and timing calculated

↓

Replacement or rescheduling considered

↓

System recommends:

• customer refund

• account credit

• sitter compensation

↓

Admin reviews and approves

↓

Booking cancelled

↓

Razorpay refund initiated idempotently

↓

Refund webhook received

↓

Refund marked processed or failed

↓

Customer and sitter notified

↓

Finance reconciles payment, refund and payout

Final operating principle

Automate policy calculation and tracking, but retain authorised human control over Phase 6 refund approvals until PetSaathi has enough evidence that its rules, exceptions and payment workflows are consistently fair and reliable.

Top of Form

Bottom of Form

PetSaathi Phase 6 — Repeat Booking Automation 🔁🐾

Executive decision

Build repeat-booking automation, but do not restrict repeat offers only to customers who submit a 4- or 5-star rating.

Many satisfied customers may not leave a review. The correct decision should use the complete service outcome:

Service completed successfully

↓

Report Card delivered

↓

No unresolved complaint or incident

↓

Pet and service remain eligible

↓

Sitter/area capacity checked

↓

Customer receives repeat options

Customer rating should modify the workflow:

### Table 124

| Customer response | System action |
| --- | --- |
| 4–5 stars | Show normal repeat and plan offers |
| No rating | Show a gentle repeat option |
| 3 stars | Ask for feedback before aggressive package promotion |
| 1–2 stars | Suppress sales offers and open service-recovery workflow |
| Private complaint | Suppress promotion until resolved |
| Serious incident | Block repeat automation |

The central operating principle is:

Offer the next useful service after a successful experience, but never prioritise revenue over service recovery, sitter capacity or customer consent.

1. Correct end-to-end flow

Service completed

↓

Automated Report Card generated

↓

Sitter submits observations

↓

Report delivered to customer

↓

Customer receives review request

↓

System evaluates repeat eligibility

↓

Customer sees:

• Book same sitter again

• Repeat same service

• View a suitable starter pack

↓

Customer selects date/time or plan

↓

Pet safety information revalidated

↓

Sitter and area capacity checked

↓

Current price displayed

↓

Payment captured and verified

↓

New booking or plan created

A previous successful booking should make the next booking easier, but it must not bypass:

Current pet-health confirmation

Sitter availability

Service-area validation

Updated pricing

Payment verification

Risk reassessment

Customer confirmation

2. Repeat-offer eligibility

A repeat offer may be generated only when all required conditions pass.

Required conditions

booking.status = CLOSED

report.status = DELIVERED

payment.status = CAPTURED

incident_status = NONE_OR_RESOLVED

customer_marketing_preference permits message

pet_profile_status = ACTIVE

service_area = ACTIVE

Also check:

No unresolved refund dispute

No serious complaint

No active pet reassessment

No sitter safety restriction

The service is still offered

Future capacity exists

Customer has not opted out of promotional messages

Repeat eligibility states

PENDING_SERVICE_COMPLETION

PENDING_REPORT

ELIGIBLE

SUPPRESSED_LOW_RATING

SUPPRESSED_COMPLAINT

SUPPRESSED_INCIDENT

SUPPRESSED_CAPACITY

SUPPRESSED_CUSTOMER_OPT_OUT

OFFER_SENT

OFFER_VIEWED

OFFER_ACCEPTED

OFFER_DECLINED

OFFER_EXPIRED

3. Offer hierarchy

Do not immediately push the most expensive package.

Use a progressive ladder:

Book same sitter once

↓

Five-service starter pack

↓

Ten-service continuity pack

↓

Recurring schedule or monthly plan

Why this order works

A first-time customer may still need to confirm:

Pet–sitter compatibility

Service consistency

Customer support quality

Schedule suitability

Normal pricing

Report Card usefulness

A single repeat booking is a lower-risk commitment than a large prepaid plan.

4. Recommended trigger ladder

First successful dog walk

Primary offer

Book Riya again

Secondary offer

View five-walk starter pack

Do not force the customer to buy a pack immediately.

Recommended card:

Bruno enjoyed his first walk with Riya. Book the same sitter again or save time with a five-walk starter plan.

Three completed walks

Offer:

Five-walk pack

or

Ten-walk continuity pack

At this point, PetSaathi has more evidence about:

Pet–sitter compatibility

Preferred time slot

Customer retention

Sitter reliability

Area capacity

The system should display a ten-walk offer only when the relevant sitter pool can reasonably fulfil those future credits.

Ten completed walks

Offer:

Recurring weekly schedule

Monthly walking plan

Preferred-sitter continuity

During Phase 6, the safer approach is:

Customer selects a recurring schedule, but individual bookings are still generated and confirmed according to availability.

Do not automatically enrol the customer into recurring billing merely because ten walks were completed.

Successful pet-sitting booking

Offer:

Book the same sitter again

Weekly sitting plan

Travel-care reminder

A weekly sitting plan should be offered only when the customer’s behaviour indicates genuine recurring demand.

Example trigger:

At least two sitting bookings completed

within the previous 45 days

Successful boarding stay

Do not automatically sell a generic “weekend travel plan.”

Offer:

Book the same approved host again

Save preferred boarding details

Join holiday/festival boarding priority list

Set a future travel-care reminder

Request boarding dates

Boarding requires fresh checks for:

Current health

Vaccination policy

Host capacity

Other-pet compatibility

Stay duration

Feeding and medication instructions

A previous boarding stay does not permanently approve all future stays.

5. Rating and feedback logic

Four- or five-star review

Actions:

Thank customer

Show same-sitter repeat

Show eligible plan

Ask whether sitter should be favourited

No review

After an appropriate delay:

Show repeat option in dashboard

Send one gentle reminder

Do not repeatedly message

Google Analytics supports building repeat-purchaser audiences from customers with multiple purchase events within a configured period, but PetSaathi’s own booking database should remain the authoritative source for completed repeat services.

Three-star review

Use:

Ask what could be improved

Allow normal single repeat where appropriate

Suppress aggressive prepaid package promotion

Send case to quality-review queue if structured ratings are weak

One- or two-star review

Create quality alert

Suppress repeat campaign

Contact customer

Review sitter and booking evidence

Resolve complaint/refund

Re-enable offers only after resolution

Never show:

Sorry you had a poor experience. Buy ten walks now and save!

6. Same-sitter repeat booking

Customer experience

The strongest CTA should be:

Book Riya again

The repeat form may pre-fill:

Pet

Service

Duration

Address

Preferred sitter

Routine instructions

The customer must reconfirm:

Date and time

Current pet health

Temporary instructions

Address access

Current price

Availability outcomes

Sitter available

Continue to booking confirmation.

Sitter unavailable

Offer:

Choose another time

Wait for Riya

View suitable verified sitters

Sitter no longer eligible

Do not reveal confidential restrictions.

Use:

Riya is not currently available for this service. PetSaathi can help find another suitable caregiver.

Important wording

Preferred sitter, subject to eligibility and availability.

Do not promise guaranteed continuity unless capacity has actually been reserved.

7. Five- and ten-walk packs

A pack should be represented as a set of service credits.

Example

Plan: Five 30-minute walks

Credits issued: 5

Credits remaining: 5

Validity: 45 days

Supported area: Bopal

Preferred sitter: Riya, subject to availability

Required plan information

Before payment, clearly show:

Number of credits

Included service and duration

Price

Saving or added benefit

Validity period

Supported areas

Cancellation rules

Refund rules

Sitter continuity conditions

Whether credits are transferable

What happens when the preferred sitter is unavailable

Pack pricing rule

A package must either:

Cost less than the same services purchased individually, or

Provide clearly stated additional value.

Example additional value:

Reserved recurring slot

Priority rescheduling

Same-sitter preference

Longer validity

Reduced booking steps

Do not call a pack a “saving” when the package costs more than the individual services.

8. Credit ledger

Do not store only:

walks_remaining = 4

Use an auditable credit ledger.

service_plans

id

customer_id

pet_id

plan_type

service_type

credits_purchased

credits_remaining

amount_paid

valid_from

expires_at

status

preferred_sitter_id

created_at

service_credit_events

id

plan_id

booking_id

event_type

credit_change

balance_after

reason

created_at

Event types:

CREDITS_ISSUED

CREDIT_RESERVED

CREDIT_CONSUMED

CREDIT_RELEASED

CREDIT_EXPIRED

CREDIT_REFUNDED

MANUAL_ADJUSTMENT

Booking flow using credit

Customer requests walk

↓

Credit temporarily reserved

↓

Sitter assigned

↓

Booking confirmed

↓

Service completed

↓

Credit consumed

If the booking is cancelled according to policy:

Reserved credit released

or

Credit deducted according to cancellation policy

9. Monthly and recurring plans

Phase 6 recommendation

Build recurring scheduling assistance, not fully automatic subscription renewal by default.

Recommended initial model:

Customer chooses weekly schedule

↓

System creates future booking requests

↓

Capacity checked for each occurrence

↓

Customer pays using pack credits

or confirms each payment

Recurring billing later

If PetSaathi introduces automatic recurring billing, the customer must explicitly authorise the subscription, understand the billing schedule and have simple pause and cancellation controls.

Razorpay Subscriptions supports plans, scheduled automated charges, authentication transactions and subscription actions including update, pause, resume and cancellation. It also produces subscription invoices and webhook events.

Required subscription protections

No preselected auto-renewal

Clear renewal price

Billing frequency shown

Upcoming-charge reminder

Simple pause

Simple cancellation

Failed-payment handling

Visible subscription status

No hidden conversion from pack to subscription

No charging after cancellation becomes effective

The Central Consumer Protection Authority has specifically identified subscription traps among dark-pattern risks and issued a 2025 advisory asking e-commerce platforms to perform self-audits for such practices.

10. Customer communication rules

Immediately after successful service

Send:

Bruno’s Report Card is ready. You can review the service or book Riya again from your PetSaathi dashboard.

After high rating

Thank you for rating Bruno’s walk. Riya can be prioritised for future eligible bookings. You can book another walk or view the five-walk starter plan.

Three-day follow-up

Only when no repeat action occurred:

Need another walk for Bruno? Rebook the same service in a few steps.

Frequency limits

Recommended:

Immediate report notification: 1

Review reminder: maximum 1–2

Repeat offer: maximum 1 per completed service

Plan reminder: maximum 1 additional message

Stop promotional reminders when:

Customer opts out

Customer declines the offer

Complaint is open

Refund is pending

Pet is inactive

Plan capacity is unavailable

11. Avoiding manipulative conversion

Do not use:

Preselected plans

Hidden auto-renewal

Fake countdown timers

False limited availability

Difficult cancellation

Confirm-shaming

Automatically converting one-time purchases into subscriptions

Hiding individual booking options

Use neutral choices:

Book once

View five-walk pack

Not now

The Consumer Protection E-Commerce Rules require clear information and affirmative consumer consent, while India’s dark-pattern framework targets designs that manipulate customers into unintended purchases or subscriptions.

12. Automation architecture

booking.closed event

↓

Repeat eligibility worker runs

↓

Report, complaint, incident and rating checked

↓

Capacity and product eligibility checked

↓

Offer recommendation generated

↓

Offer saved

↓

Dashboard card displayed

↓

Notification scheduled

↓

Customer response recorded

↓

New booking/plan flow started

Domain events

service.completed

report.delivered

review.submitted

incident.opened

incident.resolved

repeat_offer.eligible

repeat_offer.created

repeat_offer.viewed

repeat_offer.accepted

plan.purchased

credit.consumed

subscription.paused

subscription.cancelled

Every consumer should be idempotent so duplicate events do not create duplicate offers or plans.

13. Offer recommendation rules

Example rules engine

IF

service = DOG_WALKING

AND completed_walk_count = 1

AND open_complaint = false

THEN

offer = SAME_SITTER_REPEAT + FIVE_WALK_PACK

IF

completed_walk_count >= 3

AND repeat_completion_rate is healthy

AND local_capacity_available = true

THEN

offer = TEN_WALK_PACK

IF

completed_walk_count >= 10

AND customer typically books weekly

AND recurring_capacity_available = true

THEN

offer = WEEKLY_RECURRING_PLAN

IF

rating <= 2

OR active_incident = true

THEN

offer = NONE

action = SERVICE_RECOVERY

14. Recommended database tables

repeat_offer_rules

id

rule_code

service_type

minimum_completed_services

maximum_days_since_service

required_rating_condition

capacity_required

offer_type

priority

is_active

version

repeat_offers

id

customer_id

pet_id

source_booking_id

preferred_sitter_id

offer_type

status

generated_at

expires_at

rule_version

suppression_reason

recurring_service_schedules

id

customer_id

pet_id

service_type

preferred_sitter_id

day_of_week

start_time

duration_minutes

frequency

start_date

end_date

status

customer_offer_preferences

customer_id

repeat_booking_enabled

plan_offers_enabled

whatsapp_allowed

email_allowed

push_allowed

last_updated_at

15. Analytics

Track:

report_viewed

review_started

review_submitted

repeat_offer_created

repeat_offer_viewed

repeat_offer_selected

repeat_booking_started

repeat_booking_paid

plan_viewed

plan_purchased

plan_credit_used

subscription_started

subscription_paused

subscription_cancelled

For confirmed payments, use GA4’s recommended purchase event with a unique transaction ID. GA4 can deduplicate purchase events using that transaction ID, and refunds should use the corresponding recommended refund event.

PetSaathi’s database remains the source of truth for:

Paid repeat bookings

Completed repeat services

Active plan credits

Refunds

Subscription status

16. Success metrics

### Table 125

| Metric | Recommended Phase 6 target |
| --- | --- |
| Eligible completed services evaluated | 99%+ |
| Duplicate offers | Near zero |
| Repeat-offer view rate | Tracked |
| Same-sitter repeat request | Increasing |
| Second completed booking rate | 35%+ eligible cohort |
| Five-walk plan conversion | Tracked by area/channel |
| Plan-credit utilisation | 70%+ before expiry preferred |
| Plan refund rate | Below defined threshold |
| Repeat contribution margin | Positive |
| Offer sent during unresolved complaint | 0 |
| Unauthorised subscription enrolment | 0 |
| Cancellation/pause success | 100% valid requests |

Most important metric

Customers completing a second paid service

÷

customers eligible to repeat

× 100

Do not treat:

Offer clicks

Pack purchases

Stated interest

as equivalent to a completed repeat service.

17. Required tests

Eligibility

Five-star review

No review

Three-star review

One-star complaint

Open incident

Resolved incident

Sitter suspended

Service discontinued

Area capacity full

Offers

First completed walk

Third completed walk

Tenth completed walk

Boarding completed

Sitting completed

Duplicate completion event

Offer expires

Customer opts out

Same sitter

Available

Unavailable

No longer eligible

Outside area

Schedule conflict

Customer selects another time

Packs

Credit issued

Credit reserved

Booking cancelled

Credit released

Credit consumed

Credit expires

Partial refund

Price changed

Recurring plans

Explicit customer consent

Payment authentication fails

Scheduled charge succeeds

Charge fails

Pause request

Cancellation

Plan price update

Sitter unavailable for one occurrence

Security

Customer purchases plan for another customer’s pet

Credits applied to unsupported service

Sitter changes package pricing

Duplicate purchase event

Cancelled subscription continues charging

18. Definition of done

The module is complete only when:

Eligibility

Offers are generated only after successful eligible services.

Poor ratings and incidents suppress promotion.

Capacity is checked before packages are promoted.

Current Pet Profile information is revalidated.

Customer experience

Same-sitter repeat is the primary CTA.

One-time booking remains available.

Package terms are clearly shown.

Customer can decline offers.

Promotional frequency is controlled.

Credits

Plan credits use an auditable ledger.

Credits cannot be double-spent.

Cancellation and expiry policies work.

The customer can see remaining credits and validity.

Recurring billing

Customer explicitly authorises recurring charges.

Renewal terms are visible.

Pause and cancellation are simple.

No customer is automatically enrolled.

Payment-provider events reconcile correctly.

Analytics

Offers, purchases and completed repeats are separately measured.

Transaction IDs prevent duplicate analytics purchases.

Database metrics remain authoritative.

Repeat rate uses an eligible customer cohort.

Final approved trigger model

### Table 126

| Customer milestone | Recommended offer |
| --- | --- |
| First successful walk | Same-sitter repeat + optional five-walk plan |
| Three completed walks | Five- or ten-walk continuity plan |
| Ten completed walks | Opt-in weekly/monthly recurring schedule |
| Successful pet sitting | Same sitter + weekly plan when repeat pattern exists |
| Successful boarding | Same host preference + travel-care reminder |
| Rating 4–5 | Normal offers |
| No rating | Gentle repeat option |
| Rating 3 | Feedback-first workflow |
| Rating 1–2 | Service recovery; no promotion |
| Open incident/complaint | Suppress all repeat offers |

Final operating principle

Repeat automation should make a successful service easier to repeat—not pressure an unhappy customer, oversell unavailable capacity or silently convert a one-time booking into a subscription.

PetSaathi Phase 6 — Production-Ready Database Additions 🗄️🐾

Executive decision

Your proposed tables are a good starting point, but they are too simplified for safe Phase 6 operations.

The main corrections are:

Store GPS points as spatial data with accuracy, sequence and device/server timestamps.

Separate notification intent, provider delivery attempts and user preferences.

Store reliability scores as versioned snapshots with transparent components.

Use general booking-assignment records instead of one rigid primary/backup row.

Separate cancellation requests, refund approvals, provider refund events and customer credits.

Add database constraints so duplicate active sessions, overlapping assignments and excessive refunds cannot be created accidentally.

PostgreSQL supports primary keys, foreign keys, checks, unique constraints, partial unique indexes and exclusion constraints. These should enforce important business rules in the database rather than relying only on frontend code.

1. Recommended Phase 6 database map

Existing tables

├── users

├── pets

├── sitter_profiles

├── bookings

├── booking_assignments

├── payments

├── booking_reports

├── reviews

└── incidents

New tracking tables

├── tracking_sessions

└── tracking_points

New notification tables

├── notification_outbox

├── notification_deliveries

├── notification_preferences

└── device_push_tokens

New sitter-performance tables

├── sitter_reliability_snapshots

├── sitter_reliability_components

├── sitter_performance_events

└── sitter_score_actions

New continuity tables

├── booking_backup_candidates

├── replacement_events

└── backup_offer_events

New cancellation and finance tables

├── booking_cancellations

├── refund_requests

├── refund_events

├── customer_credits

└── cancellation_policy_versions

New control tables

├── workflow_events

└── admin_audit_logs

2. Tracking sessions

Your proposed table is:

tracking_sessions

- id

- booking_id

- sitter_id

- started_at

- ended_at

- start_lat

- start_lng

- end_lat

- end_lng

- total_distance

- status

This is directionally correct, but it needs stronger service, privacy and failure information.

Recommended table

CREATE TABLE tracking_sessions (

id UUID PRIMARY KEY,

booking_id UUID NOT NULL

REFERENCES bookings(id),

sitter_id UUID NOT NULL

REFERENCES sitter_profiles(id),

status VARCHAR(40) NOT NULL

CHECK (status IN (

'READY',

'STARTING',

'ACTIVE',

'SIGNAL_WEAK',

'SIGNAL_LOST',

'FALLBACK_REQUIRED',

'COMPLETED',

'COMPLETED_WITH_GAPS',

'FAILED',

'ADMIN_REVIEW_REQUIRED'

)),

started_at TIMESTAMPTZ,

ended_at TIMESTAMPTZ,

start_location GEOGRAPHY(POINT, 4326),

end_location GEOGRAPHY(POINT, 4326),

start_accuracy_metres NUMERIC(8,2),

end_accuracy_metres NUMERIC(8,2),

total_distance_metres INTEGER

CHECK (total_distance_metres IS NULL

OR total_distance_metres >= 0),

accepted_point_count INTEGER NOT NULL DEFAULT 0

CHECK (accepted_point_count >= 0),

rejected_point_count INTEGER NOT NULL DEFAULT 0

CHECK (rejected_point_count >= 0),

largest_tracking_gap_seconds INTEGER

CHECK (largest_tracking_gap_seconds IS NULL

OR largest_tracking_gap_seconds >= 0),

fallback_used BOOLEAN NOT NULL DEFAULT FALSE,

failure_reason VARCHAR(100),

consent_version VARCHAR(50),

location_permission_mode VARCHAR(40),

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

CHECK (

ended_at IS NULL

OR started_at IS NULL

OR ended_at >= started_at

)

);

Why use GEOGRAPHY(POINT, 4326)?

Latitude and longitude represent locations on Earth rather than ordinary flat Cartesian coordinates. PostGIS supports geographic points and can calculate route length in metres when geographic data is used. ST_Length returns geodesic length for geography-based line data.

Keep start and end locations

Even though the points also exist in tracking_points, retaining summary start/end locations is useful for:

Fast booking summaries

Arrival and completion checks

Report Card generation

Incident investigation

Avoiding repeated point-table scans

These values should still be produced from validated tracking records rather than blindly trusting sitter input.

3. Tracking points

Your proposed structure lacks accuracy, order, duplicate protection and upload-delay information.

Recommended table

CREATE TABLE tracking_points (

id BIGSERIAL PRIMARY KEY,

tracking_session_id UUID NOT NULL

REFERENCES tracking_sessions(id)

ON DELETE CASCADE,

sequence_number INTEGER NOT NULL

CHECK (sequence_number >= 0),

location GEOGRAPHY(POINT, 4326) NOT NULL,

accuracy_metres NUMERIC(8,2) NOT NULL

CHECK (accuracy_metres >= 0),

altitude_metres NUMERIC(9,2),

speed_metres_per_second NUMERIC(8,3)

CHECK (

speed_metres_per_second IS NULL

OR speed_metres_per_second >= 0

),

heading_degrees NUMERIC(6,2)

CHECK (

heading_degrees IS NULL

OR (

heading_degrees >= 0

AND heading_degrees < 360

)

),

recorded_at_device TIMESTAMPTZ NOT NULL,

received_at_server TIMESTAMPTZ NOT NULL DEFAULT NOW(),

device_id UUID,

source VARCHAR(30),

battery_percentage SMALLINT

CHECK (

battery_percentage IS NULL

OR battery_percentage BETWEEN 0 AND 100

),

network_state VARCHAR(30),

validation_status VARCHAR(30) NOT NULL DEFAULT 'PENDING'

CHECK (validation_status IN (

'PENDING',

'ACCEPTED',

'LOW_ACCURACY',

'DUPLICATE',

'IMPOSSIBLE_JUMP',

'STALE',

'REJECTED'

)),

rejection_reason VARCHAR(100),

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

UNIQUE (tracking_session_id, sequence_number)

);

Why both timestamps?

recorded_at_device

shows when the device measured the location.

received_at_server

shows when PetSaathi received it.

This allows the system to distinguish:

Live points

Delayed offline uploads

Out-of-order batches

Device clock problems

Network failures

Required indexes

CREATE INDEX tracking_points_session_time_idx

ON tracking_points (

tracking_session_id,

recorded_at_device

);

CREATE INDEX tracking_points_location_gist_idx

ON tracking_points

USING GIST (location);

CREATE INDEX tracking_points_pending_validation_idx

ON tracking_points (tracking_session_id, recorded_at_device)

WHERE validation_status = 'PENDING';

Partial indexes contain only rows matching a predicate and are useful for frequently queried subsets such as pending records. PostgreSQL supports both partial and unique partial indexes.

4. Prevent multiple active tracking sessions

A booking must not have two active walk-tracking sessions simultaneously.

CREATE UNIQUE INDEX one_active_tracking_session_per_booking

ON tracking_sessions (booking_id)

WHERE status IN (

'STARTING',

'ACTIVE',

'SIGNAL_WEAK',

'SIGNAL_LOST',

'FALLBACK_REQUIRED'

);

This protects against:

Sitter tapping “Start Walk” twice

Duplicate API requests

Two devices starting one booking

Worker retries creating another session

A unique partial index enforces uniqueness only among rows that match its condition.

5. Route and distance calculation

Do not treat total_distance as a sitter-entered field.

Recommended process:

Validated tracking points

↓

Ordered by device timestamp

↓

Duplicate and inaccurate points removed

↓

LineString generated

↓

Geodesic distance calculated

↓

Distance stored in metres

Example PostGIS calculation:

SELECT ST_Length(

ST_MakeLine(location::geometry ORDER BY recorded_at_device)

::geography

)

FROM tracking_points

WHERE tracking_session_id = $1

AND validation_status = 'ACCEPTED';

PostGIS provides ST_MakeLine to create a line from ordered points and ST_Length to calculate the length of linear geographic data.

Store:

total_distance_metres = 1435

Display:

Approximate distance: 1.4 km

6. Notifications

Your proposed table:

notifications

- id

- user_id

- booking_id

- type

- channel

- status

- sent_at

mixes three separate concepts:

The message PetSaathi intends to send

Each provider delivery attempt

What the customer or sitter prefers to receive

These should be separate.

7. Notification outbox

This table represents the business message that must be delivered.

CREATE TABLE notification_outbox (

id UUID PRIMARY KEY,

event_id UUID,

booking_id UUID

REFERENCES bookings(id),

recipient_user_id UUID NOT NULL

REFERENCES users(id),

notification_type VARCHAR(60) NOT NULL,

template_code VARCHAR(80) NOT NULL,

preferred_channel VARCHAR(20),

priority VARCHAR(20) NOT NULL DEFAULT 'NORMAL'

CHECK (priority IN (

'NORMAL',

'HIGH',

'CRITICAL'

)),

payload JSONB NOT NULL,

status VARCHAR(30) NOT NULL DEFAULT 'QUEUED'

CHECK (status IN (

'QUEUED',

'PROCESSING',

'SENT',

'PARTIALLY_DELIVERED',

'DELIVERED',

'FAILED',

'EXPIRED',

'CANCELLED'

)),

available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

expires_at TIMESTAMPTZ,

attempt_count INTEGER NOT NULL DEFAULT 0

CHECK (attempt_count >= 0),

next_attempt_at TIMESTAMPTZ,

idempotency_key VARCHAR(200) NOT NULL UNIQUE,

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

processed_at TIMESTAMPTZ

);

Example idempotency key:

BK-1001:CUSTOMER:SERVICE_STARTED:VERSION-4

This prevents two workers from creating duplicate customer messages.

8. Notification delivery attempts

One logical notification may try WhatsApp first, SMS second and email third.

CREATE TABLE notification_deliveries (

id UUID PRIMARY KEY,

outbox_id UUID NOT NULL

REFERENCES notification_outbox(id)

ON DELETE CASCADE,

channel VARCHAR(20) NOT NULL

CHECK (channel IN (

'WHATSAPP',

'SMS',

'EMAIL',

'PUSH',

'IN_APP'

)),

provider VARCHAR(40),

provider_message_id VARCHAR(255),

status VARCHAR(40) NOT NULL

CHECK (status IN (

'CREATED',

'SUBMITTED',

'PROVIDER_ACCEPTED',

'DELIVERED',

'READ',

'FAILED',

'BOUNCED',

'EXPIRED'

)),

attempt_number INTEGER NOT NULL

CHECK (attempt_number > 0),

sent_at TIMESTAMPTZ,

delivered_at TIMESTAMPTZ,

read_at TIMESTAMPTZ,

failed_at TIMESTAMPTZ,

failure_code VARCHAR(100),

failure_description TEXT,

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

UNIQUE (outbox_id, channel, attempt_number)

);

FCM provides aggregate and exported delivery data, but provider acceptance does not always equal user receipt or message view. PetSaathi should therefore preserve its own send attempts and delivery statuses where each provider makes them available.

9. Notification preferences

CREATE TABLE notification_preferences (

user_id UUID PRIMARY KEY

REFERENCES users(id),

whatsapp_enabled BOOLEAN NOT NULL DEFAULT TRUE,

sms_enabled BOOLEAN NOT NULL DEFAULT TRUE,

email_enabled BOOLEAN NOT NULL DEFAULT TRUE,

push_enabled BOOLEAN NOT NULL DEFAULT FALSE,

service_updates_enabled BOOLEAN NOT NULL DEFAULT TRUE,

report_updates_enabled BOOLEAN NOT NULL DEFAULT TRUE,

repeat_offers_enabled BOOLEAN NOT NULL DEFAULT TRUE,

marketing_enabled BOOLEAN NOT NULL DEFAULT FALSE,

preferred_language VARCHAR(10),

quiet_hours_start TIME,

quiet_hours_end TIME,

updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

Critical active-service and safety communication should be treated separately from marketing preferences according to PetSaathi’s lawful communication policy.

10. Push device tokens

Do not store push tokens directly in the users table because one user may have several devices.

CREATE TABLE device_push_tokens (

id UUID PRIMARY KEY,

user_id UUID NOT NULL

REFERENCES users(id),

platform VARCHAR(20) NOT NULL

CHECK (platform IN (

'ANDROID',

'IOS',

'WEB'

)),

token TEXT NOT NULL UNIQUE,

device_identifier VARCHAR(255),

is_active BOOLEAN NOT NULL DEFAULT TRUE,

last_seen_at TIMESTAMPTZ,

invalidated_at TIMESTAMPTZ,

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

Firebase recommends actively managing registration tokens so invalid or stale tokens do not continue receiving send attempts.

11. Sitter reliability scores

Your proposed table:

sitter_reliability_scores

- on_time_score

- completion_score

- rating_score

- report_quality_score

- incident_score

- total_score

has three weaknesses:

It overwrites previous calculations.

It cannot explain the raw data behind each score.

incident_score incorrectly treats all incidents as equivalent.

Use versioned snapshots plus component records.

12. Reliability snapshots

CREATE TABLE sitter_reliability_snapshots (

id UUID PRIMARY KEY,

sitter_id UUID NOT NULL

REFERENCES sitter_profiles(id),

calculation_version VARCHAR(40) NOT NULL,

window_start DATE NOT NULL,

window_end DATE NOT NULL,

confidence_level VARCHAR(30) NOT NULL

CHECK (confidence_level IN (

'ONBOARDING',

'PROVISIONAL',

'LIMITED',

'ESTABLISHED'

)),

total_score NUMERIC(5,2)

CHECK (

total_score IS NULL

OR total_score BETWEEN 0 AND 100

),

score_level VARCHAR(30)

CHECK (score_level IN (

'PROVISIONAL',

'PREMIUM_CANDIDATE',

'RELIABLE',

'COACHING_REQUIRED',

'RESTRICTED',

'PERFORMANCE_REVIEW'

)),

safety_status VARCHAR(30) NOT NULL

CHECK (safety_status IN (

'CLEAR',

'MONITORING',

'SAFETY_REVIEW',

'TEMPORARILY_PAUSED',

'SUSPENDED'

)),

eligible_booking_count INTEGER NOT NULL DEFAULT 0,

completed_booking_count INTEGER NOT NULL DEFAULT 0,

review_count INTEGER NOT NULL DEFAULT 0,

calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

UNIQUE (

sitter_id,

calculation_version,

window_start,

window_end

)

);

Never overwrite the previous score. Create a new snapshot.

13. Reliability components

CREATE TABLE sitter_reliability_components (

id UUID PRIMARY KEY,

snapshot_id UUID NOT NULL

REFERENCES sitter_reliability_snapshots(id)

ON DELETE CASCADE,

component_code VARCHAR(50) NOT NULL

CHECK (component_code IN (

'ON_TIME',

'COMPLETION',

'CANCELLATION',

'NO_SHOW',

'REPORT_TIMELINESS',

'REPORT_QUALITY',

'CUSTOMER_EXPERIENCE',

'OFFER_RESPONSE',

'ELIGIBLE_ACCEPTANCE',

'TRAINING_COMPLIANCE'

)),

raw_numerator NUMERIC(12,4),

raw_denominator NUMERIC(12,4),

raw_value NUMERIC(12,4),

target_value NUMERIC(12,4),

weight_percentage NUMERIC(5,2)

CHECK (

weight_percentage >= 0

AND weight_percentage <= 100

),

subscore NUMERIC(5,2)

CHECK (

subscore >= 0

AND subscore <= 100

),

eligible_record_count INTEGER NOT NULL DEFAULT 0,

excluded_record_count INTEGER NOT NULL DEFAULT 0,

explanation TEXT,

UNIQUE (snapshot_id, component_code)

);

14. Incident history should remain separate

Do not store:

incident_score = 7.5

as though a minor late Report Card and a lost-pet incident were comparable.

Instead, use the existing incidents table and add reviewed responsibility fields:

ALTER TABLE incidents

ADD COLUMN responsibility_status VARCHAR(40)

CHECK (responsibility_status IN (

'UNREVIEWED',

'SITTER_RESPONSIBLE',

'PARTIALLY_RESPONSIBLE',

'NOT_SITTER_RESPONSIBLE',

'INCONCLUSIVE'

));

Also add:

ALTER TABLE incidents

ADD COLUMN safety_effect VARCHAR(40)

CHECK (safety_effect IN (

'NONE',

'COACHING',

'SERVICE_LIMIT',

'PROBATION',

'TEMPORARY_PAUSE',

'SAFETY_REVIEW',

'SUSPENSION'

));

A serious incident can override ranking regardless of the sitter’s numerical reliability score.

15. Performance events

Store the events used to calculate the score.

CREATE TABLE sitter_performance_events (

id UUID PRIMARY KEY,

sitter_id UUID NOT NULL

REFERENCES sitter_profiles(id),

booking_id UUID

REFERENCES bookings(id),

incident_id UUID

REFERENCES incidents(id),

event_type VARCHAR(60) NOT NULL,

event_value NUMERIC(12,4),

responsibility_status VARCHAR(40),

occurred_at TIMESTAMPTZ NOT NULL,

source VARCHAR(40) NOT NULL,

excluded_from_score BOOLEAN NOT NULL DEFAULT FALSE,

exclusion_reason VARCHAR(100),

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

Examples:

SERVICE_STARTED_ON_TIME

SITTER_CAUSED_CANCELLATION

CUSTOMER_CAUSED_DELAY

REPORT_SUBMITTED_ON_TIME

NO_SHOW

CUSTOMER_REBOOKED_SITTER

This makes recalculation possible after an appeal or responsibility correction.

16. Backup assignments

Your proposed structure:

backup_assignments

- booking_id

- primary_sitter_id

- backup_sitter_id

- status

is too rigid because:

A booking may have multiple backup candidates.

Primary sitters already belong in booking_assignments.

A backup may be candidate-only, soft standby or hard standby.

A backup may later become a replacement.

Use a unified assignment table plus a backup-candidate table.

17. Booking assignments

Recommended existing/updated structure:

CREATE TABLE booking_assignments (

id UUID PRIMARY KEY,

booking_id UUID NOT NULL

REFERENCES bookings(id),

sitter_id UUID NOT NULL

REFERENCES sitter_profiles(id),

role VARCHAR(30) NOT NULL

CHECK (role IN (

'PRIMARY',

'BACKUP',

'REPLACEMENT',

'SUPERVISOR'

)),

status VARCHAR(30) NOT NULL

CHECK (status IN (

'OFFERED',

'VIEWED',

'ACCEPTED',

'ASSIGNED',

'ACKNOWLEDGED',

'CHECKED_IN',

'SERVICE_STARTED',

'COMPLETED',

'DECLINED',

'EXPIRED',

'REMOVED',

'NO_SHOW'

)),

service_window TSTZRANGE NOT NULL,

offered_at TIMESTAMPTZ,

accepted_at TIMESTAMPTZ,

assigned_at TIMESTAMPTZ,

acknowledged_at TIMESTAMPTZ,

checked_in_at TIMESTAMPTZ,

removed_at TIMESTAMPTZ,

removal_reason VARCHAR(100),

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

18. Prevent two active primary sitters

CREATE UNIQUE INDEX one_active_primary_assignment

ON booking_assignments (booking_id)

WHERE role IN ('PRIMARY', 'REPLACEMENT')

AND status IN (

'ASSIGNED',

'ACKNOWLEDGED',

'CHECKED_IN',

'SERVICE_STARTED'

);

19. Prevent sitter double-booking

PostgreSQL range types and exclusion constraints can enforce non-overlapping reservation periods.

Example:

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE booking_assignments

ADD CONSTRAINT sitter_no_overlapping_active_assignments

EXCLUDE USING GIST (

sitter_id WITH =,

service_window WITH &&

)

WHERE (

status IN (

'ASSIGNED',

'ACKNOWLEDGED',

'CHECKED_IN',

'SERVICE_STARTED'

)

);

This prevents one sitter from being actively assigned to overlapping bookings.

20. Backup candidates

CREATE TABLE booking_backup_candidates (

id UUID PRIMARY KEY,

booking_id UUID NOT NULL

REFERENCES bookings(id),

sitter_id UUID NOT NULL

REFERENCES sitter_profiles(id),

coverage_type VARCHAR(30) NOT NULL

CHECK (coverage_type IN (

'CANDIDATE',

'SOFT_STANDBY',

'HARD_STANDBY'

)),

status VARCHAR(30) NOT NULL

CHECK (status IN (

'IDENTIFIED',

'ELIGIBILITY_CONFIRMED',

'OFFERED',

'ACCEPTED',

'DECLINED',

'EXPIRED',

'RELEASED',

'UNAVAILABLE',

'CONVERTED_TO_REPLACEMENT'

)),

estimated_travel_minutes INTEGER

CHECK (

estimated_travel_minutes IS NULL

OR estimated_travel_minutes >= 0

),

eligibility_checked_at TIMESTAMPTZ,

standby_start_at TIMESTAMPTZ,

standby_end_at TIMESTAMPTZ,

standby_compensation_paise INTEGER

CHECK (

standby_compensation_paise IS NULL

OR standby_compensation_paise >= 0

),

released_at TIMESTAMPTZ,

release_reason VARCHAR(100),

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

UNIQUE (booking_id, sitter_id)

);

Money should be stored as integer paise:

₹149 = 14900 paise

This avoids floating-point currency errors.

21. Replacement events

CREATE TABLE replacement_events (

id UUID PRIMARY KEY,

booking_id UUID NOT NULL

REFERENCES bookings(id),

original_assignment_id UUID

REFERENCES booking_assignments(id),

trigger_code VARCHAR(60) NOT NULL,

triggered_by_user_id UUID

REFERENCES users(id),

operations_owner_id UUID

REFERENCES users(id),

triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

replacement_deadline_at TIMESTAMPTZ,

status VARCHAR(30) NOT NULL

CHECK (status IN (

'OPEN',

'CANDIDATES_GENERATED',

'OFFERS_SENT',

'REPLACEMENT_ASSIGNED',

'FAILED',

'CANCELLED',

'RESOLVED'

)),

replacement_assignment_id UUID

REFERENCES booking_assignments(id),

resolution_notes TEXT,

resolved_at TIMESTAMPTZ

);

This preserves why replacement happened rather than simply overwriting backup_sitter_id.

22. Cancellation and refund requests

Your proposed table combines cancellation policy, approval and payment-provider activity.

Use separate tables.

23. Booking cancellations

CREATE TABLE booking_cancellations (

id UUID PRIMARY KEY,

booking_id UUID NOT NULL

REFERENCES bookings(id),

requested_by_user_id UUID

REFERENCES users(id),

requested_by_role VARCHAR(30) NOT NULL,

reason_code VARCHAR(60) NOT NULL,

reason_text TEXT,

status VARCHAR(30) NOT NULL

CHECK (status IN (

'REQUESTED',

'UNDER_REVIEW',

'APPROVED',

'DECLINED',

'WITHDRAWN',

'COMPLETED'

)),

policy_version VARCHAR(50) NOT NULL,

scheduled_start_snapshot TIMESTAMPTZ NOT NULL,

requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

effective_at TIMESTAMPTZ,

replacement_attempted BOOLEAN NOT NULL DEFAULT FALSE,

reviewed_by_user_id UUID

REFERENCES users(id),

reviewed_at TIMESTAMPTZ,

decision_notes TEXT,

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

24. Refund requests

CREATE TABLE refund_requests (

id UUID PRIMARY KEY,

booking_id UUID NOT NULL

REFERENCES bookings(id),

payment_id UUID NOT NULL

REFERENCES payments(id),

cancellation_id UUID

REFERENCES booking_cancellations(id),

requested_by_user_id UUID

REFERENCES users(id),

reason_code VARCHAR(60) NOT NULL,

reason_text TEXT,

currency CHAR(3) NOT NULL DEFAULT 'INR',

requested_amount_paise INTEGER NOT NULL

CHECK (requested_amount_paise > 0),

recommended_amount_paise INTEGER

CHECK (

recommended_amount_paise IS NULL

OR recommended_amount_paise >= 0

),

approved_amount_paise INTEGER

CHECK (

approved_amount_paise IS NULL

OR approved_amount_paise >= 0

),

status VARCHAR(40) NOT NULL

CHECK (status IN (

'REQUESTED',

'UNDER_REVIEW',

'APPROVED',

'REJECTED',

'PROCESSING',

'PROCESSED',

'PARTIALLY_PROCESSED',

'FAILED'

)),

approved_by_user_id UUID

REFERENCES users(id),

approved_at TIMESTAMPTZ,

provider VARCHAR(40),

provider_refund_id VARCHAR(255),

idempotency_key VARCHAR(255) NOT NULL UNIQUE,

admin_notes TEXT,

failure_code VARCHAR(100),

failure_description TEXT,

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

processed_at TIMESTAMPTZ

);

Razorpay permits full and partial refunds only for captured payments. It also supports idempotent refund requests, which helps prevent duplicated money movement when requests are retried.

25. Refund events

CREATE TABLE refund_events (

id UUID PRIMARY KEY,

refund_request_id UUID

REFERENCES refund_requests(id),

provider_event_id VARCHAR(255) NOT NULL UNIQUE,

event_type VARCHAR(60) NOT NULL,

provider_status VARCHAR(40),

payload_hash VARCHAR(128),

processing_status VARCHAR(30) NOT NULL

CHECK (processing_status IN (

'RECEIVED',

'PROCESSING',

'PROCESSED',

'IGNORED_DUPLICATE',

'FAILED'

)),

received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

processed_at TIMESTAMPTZ,

error_message TEXT

);

Razorpay exposes refund events including refund.created, refund.processed and refund.failed; these should update internal refund progress without changing the booking lifecycle incorrectly.

26. Prevent over-refunding

Before approving or submitting a refund:

Available refundable balance =

Captured payment amount

− processed refunds

− refunds currently processing

Use a transaction and lock the payment/refund rows before calculating the remaining balance.

Recommended database-level check is difficult across multiple rows, so enforce it in a serializable transaction or using a locked aggregate workflow.

The operation should:

Lock payment row

↓

Calculate refunded and processing total

↓

Confirm requested refund is within balance

↓

Create refund request

↓

Commit

27. Customer credits

Do not represent credits as a refund status.

CREATE TABLE customer_credits (

id UUID PRIMARY KEY,

customer_id UUID NOT NULL

REFERENCES users(id),

source_booking_id UUID

REFERENCES bookings(id),

source_cancellation_id UUID

REFERENCES booking_cancellations(id),

amount_paise INTEGER NOT NULL

CHECK (amount_paise > 0),

remaining_amount_paise INTEGER NOT NULL

CHECK (

remaining_amount_paise >= 0

AND remaining_amount_paise <= amount_paise

),

reason_code VARCHAR(60) NOT NULL,

status VARCHAR(30) NOT NULL

CHECK (status IN (

'OFFERED',

'ACCEPTED',

'ISSUED',

'PARTIALLY_USED',

'USED',

'EXPIRED',

'REVOKED'

)),

issued_at TIMESTAMPTZ,

expires_at TIMESTAMPTZ,

created_by_user_id UUID

REFERENCES users(id),

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

A customer credit and a cash refund may have different legal and accounting treatment, so they should remain distinct.

28. Policy versioning

CREATE TABLE cancellation_policy_versions (

id UUID PRIMARY KEY,

version_code VARCHAR(50) NOT NULL UNIQUE,

service_type VARCHAR(40) NOT NULL,

rules JSONB NOT NULL,

effective_from TIMESTAMPTZ NOT NULL,

effective_until TIMESTAMPTZ,

approved_by_user_id UUID

REFERENCES users(id),

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

CHECK (

effective_until IS NULL

OR effective_until > effective_from

)

);

Every confirmed booking should store the applicable policy version so a later policy change does not retroactively alter the customer’s entitlement.

29. Workflow events

Phase 6 is event-driven. Preserve important business events.

CREATE TABLE workflow_events (

id UUID PRIMARY KEY,

aggregate_type VARCHAR(40) NOT NULL,

aggregate_id UUID NOT NULL,

event_type VARCHAR(80) NOT NULL,

event_version INTEGER NOT NULL,

actor_user_id UUID

REFERENCES users(id),

actor_type VARCHAR(30) NOT NULL,

payload JSONB,

occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

idempotency_key VARCHAR(255) UNIQUE

);

Examples:

tracking.started

tracking.signal_lost

service.completed

report.delivered

sitter.score_calculated

replacement.required

refund.approved

refund.processed

30. Admin audit logs

CREATE TABLE admin_audit_logs (

id UUID PRIMARY KEY,

admin_user_id UUID NOT NULL

REFERENCES users(id),

action_type VARCHAR(80) NOT NULL,

resource_type VARCHAR(50) NOT NULL,

resource_id UUID NOT NULL,

previous_state JSONB,

new_state JSONB,

reason_code VARCHAR(60),

reason_text TEXT,

request_id VARCHAR(255),

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

Audit:

Manual refund changes

Sitter restrictions

Reliability score overrides

Tracking access

Replacement assignment

Incident severity changes

Report Card amendments

31. Row-level access

Sensitive tables include:

Tracking points

Sitter scores

Incident evidence

Refund approvals

Customer credits

PostgreSQL Row-Level Security can restrict which rows a role may select or update, but database owners and roles with bypass privileges may evade those policies. Privileged roles therefore need tight controls.

Typical application rules:

Customer:

Own bookings, reports and customer-facing tracking

Sitter:

Only assigned booking and own tracking session

Operations admin:

Operational records

Safety admin:

Incident and restricted pet information

Finance admin:

Payments, refunds and credits

Ordinary support:

No raw payment or medical access

Application-layer authorisation remains necessary even when RLS is used.

32. Index strategy

Add indexes based on actual query patterns.

Recommended examples:

CREATE INDEX active_tracking_sessions_idx

ON tracking_sessions (status, started_at)

WHERE status IN ('ACTIVE', 'SIGNAL_WEAK', 'SIGNAL_LOST');

CREATE INDEX notifications_due_idx

ON notification_outbox (available_at)

WHERE status = 'QUEUED';

CREATE INDEX active_refunds_idx

ON refund_requests (status, created_at)

WHERE status IN (

'REQUESTED',

'UNDER_REVIEW',

'APPROVED',

'PROCESSING',

'FAILED'

);

CREATE INDEX current_sitter_scores_idx

ON sitter_reliability_snapshots (

sitter_id,

calculated_at DESC

);

CREATE INDEX open_replacements_idx

ON replacement_events (

status,

replacement_deadline_at

)

WHERE status NOT IN ('RESOLVED', 'CANCELLED');

Indexes improve retrieval but also add storage and write overhead, so they should match real operational queries rather than be added to every column.

33. Tracking-point volume and partitioning

Tracking points may become the largest Phase 6 table.

Example:

15-second interval

× 30-minute walk

= approximately 120 points per walk

At 10,000 walks:

approximately 1.2 million tracking points

Do not partition prematurely, but prepare for time-based partitioning when volume or retention operations justify it.

Possible later design:

CREATE TABLE tracking_points (

...

) PARTITION BY RANGE (recorded_at_device);

Then create monthly partitions.

PostgreSQL supports declarative range partitioning, but it adds schema and maintenance complexity and should be introduced when operational volume warrants it.

34. Final table decisions

### Table 127

| Proposed table | Final recommendation |
| --- | --- |
| tracking_sessions | Approve with spatial, accuracy and failure fields |
| tracking_points | Approve with sequence, validation and timestamps |
| notifications | Split into outbox, deliveries, preferences and tokens |
| sitter_reliability_scores | Split into versioned snapshots and components |
| incident_score | Remove; use separate safety override |
| backup_assignments | Replace with assignments, candidates and replacement events |
| refund_requests | Expand and link to payment/cancellation |
| Credit status in refund | Move to separate customer-credit table |
| Provider refund progress | Store in refund-event table |
| Policy rules | Store as immutable versioned policies |

35. Minimum Phase 6 migration order

Step 1 — Tracking

tracking_sessions

tracking_points

tracking indexes

active-session constraint

Step 2 — Notifications

notification_outbox

notification_deliveries

notification_preferences

device_push_tokens

Step 3 — Booking continuity

booking_assignments upgrade

booking_backup_candidates

replacement_events

backup_offer_events

Step 4 — Reliability

sitter_performance_events

sitter_reliability_snapshots

sitter_reliability_components

sitter_score_actions

Step 5 — Cancellation and refunds

booking_cancellations

refund_requests

refund_events

customer_credits

cancellation_policy_versions

Step 6 — Controls

workflow_events

admin_audit_logs

row-level policies

operational indexes

36. Definition of done

The Phase 6 database is ready only when:

Tracking

Only one active tracking session can exist per booking.

GPS points retain accuracy, ordering and source timestamps.

Route distance is server-calculated.

Tracking stops and is auditable.

Location data access is restricted.

Notifications

Business messages are stored before provider delivery.

Multiple delivery channels and retries are recorded.

Duplicate notifications are prevented.

User preferences and device tokens are separate.

Provider failure does not lose the notification.

Reliability

Scores are versioned.

Components are explainable.

Small sample confidence is stored.

Incident safety states override ranking.

Score calculations can be reproduced.

Backup assignments

Multiple candidates are supported.

Primary, backup and replacement roles are historical.

Two active primary sitters cannot exist.

Sitter schedule overlap is blocked.

Replacement reasons and outcomes remain auditable.

Refunds

Cancellation and refund states remain separate.

Only captured payments can be refunded.

Duplicate refund submission is prevented.

Full and partial refunds are supported.

Refund provider events are reconciled.

Credits remain separate from cash refunds.

Integrity

Foreign keys connect all related records.

Checks prevent invalid amounts and times.

Critical uniqueness rules exist in the database.

Administrative changes are audited.

Important status history is never silently overwritten.

Final operating principle

Phase 6 database design should store not only the current result, but also the evidence, workflow history, responsible actor and external-provider state that produced that result.

PetSaathi Phase 6 — Production-Ready API Additions 🔌🐾

Executive decision

Your proposed API groups are correct, but several endpoint designs should be modified before implementation.

The most important changes are:

### Table 128

| Proposed design | Production correction |
| --- | --- |
| Track points directly through booking ID | Create a tracking session and submit points to that session |
| Submit one GPS point per request | Support validated batches of points |
| Public /notifications/send endpoint | Keep sending internal; expose only user inbox and provider webhooks |
| /notifications/user/:id | Use /me/notifications to reduce object-access risk |
| Synchronous reliability recalculation | Create an asynchronous recalculation job |
| risk-list | Rename to performance-review or safety-review queue |
| PUT .../switch-to-backup | Create a controlled replacement event and assignment |
| Arbitrary incident status updates | Permit only defined state transitions |
| Direct refund from booking endpoint | Separate cancellation request, refund approval and provider processing |
| Generic notification webhook | Use provider-specific webhook endpoints |
| No versioning | Prefix the API with /api/v1 |

HTTP methods should reflect their meaning: GET reads resources, POST creates resources or initiates commands, PUT replaces an identified resource, and PATCH partially modifies one. Actions such as “start walk,” “approve refund,” or “resolve incident” should normally use controlled POST commands rather than misleading PUT requests.

1. Final recommended API structure

/api/v1

├── /bookings

├── /tracking-sessions

├── /me/notifications

├── /admin/sitters

├── /admin/bookings

├── /admin/replacement-events

├── /incidents

├── /admin/incidents

├── /cancellations

├── /refund-requests

├── /admin/refund-requests

├── /webhooks

└── /internal

Use route namespaces for clarity, but do not rely on /admin in the URL as the security control. Every administrative function must independently verify the authenticated user’s role and permission. OWASP specifically warns that regular users may gain access to administrative functions when function-level authorisation is missing.

2. Tracking APIs

Proposed version

POST /api/bookings/:id/start-tracking

POST /api/bookings/:id/track-point

POST /api/bookings/:id/end-tracking

GET /api/bookings/:id/tracking

Recommended version

POST /api/v1/bookings/:bookingId/tracking-sessions

POST /api/v1/tracking-sessions/:sessionId/points/batch

POST /api/v1/tracking-sessions/:sessionId/complete

GET /api/v1/bookings/:bookingId/tracking

GET /api/v1/admin/tracking-sessions/:sessionId

The tracking session should be a separate resource because a booking and its tracking lifecycle are not identical.

2.1 Start tracking

POST /api/v1/bookings/BK-1001/tracking-sessions

Idempotency-Key: walk-start-device-event-98342

Request

{

"deviceId": "DEVICE-0291",

"recordedAt": "2026-08-18T07:32:10+05:30",

"location": {

"latitude": 23.0304,

"longitude": 72.4652,

"accuracyMetres": 18.5

},

"permissionMode": "BACKGROUND_GRANTED",

"expectedBookingVersion": 12

}

Server validations

The server must confirm:

Booking is confirmed

Payment is captured

Authenticated sitter is the active assignment

Service type requires tracking

No cancellation or incident hold exists

Current time is inside the allowed start window

No other active tracking session exists

Location permission information is present

Successful response

201 Created

Location: /api/v1/tracking-sessions/TS-1001

{

"trackingSessionId": "TS-1001",

"bookingId": "BK-1001",

"status": "ACTIVE",

"startedAt": "2026-08-18T07:32:10+05:30",

"nextRecommendedUploadSeconds": 30

}

Important idempotency rule

If the sitter taps Start Walk twice with the same idempotency key, the server should return the original session rather than creating another session.

2.2 Submit tracking points

Do not send every point through:

POST /bookings/:id/track-point

One request per GPS point can create excessive network and database traffic. APIs should impose limits on request frequency, batch size, payload size and database operations because unrestricted resource consumption can produce denial-of-service and cost problems.

Use batches:

POST /api/v1/tracking-sessions/TS-1001/points/batch

Request

{

"batchId": "BATCH-00029",

"points": [

{

"sequenceNumber": 31,

"recordedAt": "2026-08-18T07:40:00+05:30",

"latitude": 23.0308,

"longitude": 72.4661,

"accuracyMetres": 14.2,

"speedMetresPerSecond": 1.4

},

{

"sequenceNumber": 32,

"recordedAt": "2026-08-18T07:40:20+05:30",

"latitude": 23.0310,

"longitude": 72.4664,

"accuracyMetres": 16.0,

"speedMetresPerSecond": 1.2

}

]

}

Recommended limits

Maximum points per batch: 100

Maximum body size: configured explicitly

Maximum upload frequency: controlled

Duplicate sequence numbers: ignored or rejected

Points after session completion: rejected

Very old points: marked stale

Impossible coordinate jumps: quarantined

Response

{

"accepted": 2,

"rejected": 0,

"lastAcceptedSequence": 32,

"trackingStatus": "ACTIVE"

}

A repeated batchId should return the previously processed result.

2.3 End tracking

POST /api/v1/tracking-sessions/TS-1001/complete

Idempotency-Key: walk-end-device-event-84911

Request

{

"recordedAt": "2026-08-18T08:02:20+05:30",

"location": {

"latitude": 23.0305,

"longitude": 72.4653,

"accuracyMetres": 21.4

},

"petReturnedSafely": true,

"expectedSessionVersion": 8

}

Server actions

Accept final location

Stop active session

Reject future tracking points

Calculate approximate distance

Calculate duration

Update booking to SERVICE_COMPLETED

Generate Report Card draft

Create customer notification event

Response

{

"trackingSessionId": "TS-1001",

"status": "COMPLETED",

"startedAt": "2026-08-18T07:32:10+05:30",

"endedAt": "2026-08-18T08:02:20+05:30",

"durationSeconds": 1810,

"approximateDistanceMetres": 1435,

"reportDraftId": "RPT-0044"

}

If the session was already completed with the same idempotency key, return the same result.

2.4 Read tracking

GET /api/v1/bookings/BK-1001/tracking

The response must depend on the caller’s role.

Customer response

{

"status": "ACTIVE",

"startedAt": "2026-08-18T07:32:10+05:30",

"lastUpdatedAt": "2026-08-18T07:48:40+05:30",

"approximateDistanceMetres": 820,

"signalStatus": "NORMAL",

"route": {

"precision": "CUSTOMER_SAFE",

"points": []

}

}

Admin response

May include:

Accepted and rejected points

Accuracy

Device timestamp

Upload delays

Signal gaps

Failure reasons

Audit events

The customer should not receive raw diagnostics or unnecessary sitter-location history.

Every API receiving a booking or session ID must perform object-level authorisation, not merely trust that an authenticated user supplied a valid UUID. OWASP identifies manipulation of object identifiers as a widespread API access-control weakness.

3. Notification APIs

Proposed version

POST /api/notifications/send

GET /api/notifications/user/:id

POST /api/notifications/webhook

Problems

Public notification sending

A public /notifications/send endpoint could allow:

Spam

SMS or WhatsApp cost abuse

Customer harassment

Duplicate service messages

Exposure of arbitrary recipients

Unrestricted use of third-party quotas

User ID in the route

GET /notifications/user/:id

creates an avoidable object-authorisation risk. A user may alter :id and attempt to read another person’s notifications.

Generic webhook

Different providers use different signatures, event formats and secrets. A single generic webhook endpoint is harder to validate safely.

Recommended notification APIs

GET /api/v1/me/notifications

PATCH /api/v1/me/notifications/:notificationId

POST /api/v1/internal/notification-events

POST /api/v1/admin/notifications/test

POST /api/v1/webhooks/whatsapp/:provider

POST /api/v1/webhooks/email/:provider

POST /api/v1/webhooks/sms/:provider

3.1 User notification inbox

GET /api/v1/me/notifications?status=UNREAD&limit=20&cursor=...

Response

{

"items": [

{

"id": "NOT-101",

"type": "SERVICE_STARTED",

"bookingId": "BK-1001",

"title": "Bruno’s walk has started",

"createdAt": "2026-08-18T07:32:12+05:30",

"readAt": null,

"action": {

"type": "OPEN_BOOKING",

"resourceId": "BK-1001"

}

}

],

"nextCursor": "CURSOR-XYZ"

}

Use server-derived identity from the authentication session rather than accepting a user ID.

3.2 Mark notification as read

PATCH /api/v1/me/notifications/NOT-101

{

"read": true

}

Response:

200 OK

{

"id": "NOT-101",

"readAt": "2026-08-18T07:40:00+05:30"

}

3.3 Internal notification events

Routine application code should not directly call WhatsApp, email or FCM.

Use an internal command:

POST /api/v1/internal/notification-events

{

"eventId": "EVT-9001",

"eventType": "SERVICE_STARTED",

"recipientUserId": "USR-001",

"bookingId": "BK-1001",

"priority": "HIGH",

"templateData": {

"petName": "Bruno"

}

}

This endpoint should be accessible only to trusted backend services, not customer browsers or sitter apps.

The event should create an outbox record. A background worker then sends the message through FCM, WhatsApp, email or SMS.

FCM sending is a server-side operation made through the HTTP v1 endpoint using OAuth credentials or an appropriate service account. Client applications should never receive the server credential or call a PetSaathi “send arbitrary notification” endpoint.

3.4 Provider webhooks

Use provider-specific routes:

POST /api/v1/webhooks/whatsapp/meta

POST /api/v1/webhooks/email/provider-name

POST /api/v1/webhooks/sms/provider-name

Each handler should:

Read raw request body

Validate provider signature

Check timestamp/replay controls

Deduplicate provider event ID

Store event

Return quickly

Process asynchronously

Do not use the webhook route to send notifications. Webhooks receive delivery or provider events.

4. Reliability APIs

Proposed version

GET /api/admin/sitters/:id/reliability

POST /api/admin/sitters/:id/recalculate-score

GET /api/admin/sitters/risk-list

Recommended version

GET /api/v1/admin/sitters/:sitterId/reliability

GET /api/v1/admin/sitters/:sitterId/reliability/history

POST /api/v1/admin/sitters/:sitterId/reliability-recalculations

GET /api/v1/admin/sitter-performance-reviews

GET /api/v1/admin/sitter-safety-reviews

4.1 Get current reliability

GET /api/v1/admin/sitters/ST-004/reliability

Response

{

"sitterId": "ST-004",

"score": 86.4,

"level": "RELIABLE",

"confidence": "ESTABLISHED",

"window": {

"from": "2026-05-18",

"to": "2026-08-18"

},

"components": [

{

"code": "ON_TIME",

"weight": 25,

"rawValue": 0.96,

"subscore": 25

},

{

"code": "COMPLETION",

"weight": 20,

"rawValue": 0.98,

"subscore": 20

}

],

"safetyStatus": "CLEAR",

"calculatedAt": "2026-08-18T04:00:00Z"

}

Do not return private complaint text, customer identities or unrelated incident evidence through this summary endpoint.

4.2 Recalculate reliability asynchronously

Score recalculation may aggregate many bookings, reports, reviews and incident outcomes. Do not block an admin request while performing the full calculation.

POST /api/v1/admin/sitters/ST-004/reliability-recalculations

Idempotency-Key: score-recalc-ST-004-2026-08-18

{

"reason": "INCIDENT_OUTCOME_CORRECTED",

"calculationVersion": "V3",

"windowDays": 90

}

Response:

202 Accepted

{

"jobId": "JOB-8871",

"status": "QUEUED",

"statusUrl": "/api/v1/admin/jobs/JOB-8871"

}

The job creates a new score snapshot; it should not overwrite history.

4.3 Replace risk-list

Avoid:

GET /admin/sitters/risk-list

The name is ambiguous and could combine performance issues with actual safety restrictions.

Use separate queues:

GET /api/v1/admin/sitter-performance-reviews?level=COACHING_REQUIRED

GET /api/v1/admin/sitter-safety-reviews?status=OPEN

Performance-review queue

Contains:

Low punctuality

Repeated report problems

High avoidable cancellation rate

Availability inconsistencies

Safety-review queue

Contains:

Serious incident

Verification expiry

Unsafe handling concern

Privacy breach

Unauthorised substitution

A performance score should not silently replace the incident and safety process.

5. Backup sitter APIs

Proposed version

POST /api/admin/bookings/:id/assign-backup

GET /api/admin/bookings/:id/backup-options

PUT /api/admin/bookings/:id/switch-to-backup

Recommended version

GET /api/v1/admin/bookings/:bookingId/backup-candidates

POST /api/v1/admin/bookings/:bookingId/backup-standbys

POST /api/v1/admin/bookings/:bookingId/replacement-events

GET /api/v1/admin/replacement-events/:eventId

POST /api/v1/admin/replacement-events/:eventId/offers

POST /api/v1/admin/replacement-events/:eventId/assign

POST /api/v1/admin/bookings/:bookingId/backup-standbys/:standbyId/release

5.1 Retrieve backup candidates

GET /api/v1/admin/bookings/BK-1001/backup-candidates?limit=10

Response

{

"bookingId": "BK-1001",

"generatedAt": "2026-08-18T06:50:00+05:30",

"candidates": [

{

"sitterId": "ST-009",

"displayName": "Aditi P.",

"estimatedTravelMinutes": 12,

"serviceEligible": true,

"riskControlsMatched": true,

"scheduleAvailable": true,

"onTimeRate": 0.97,

"noShowRate": 0,

"availabilityValidUntil": "2026-08-18T07:15:00+05:30"

}

]

}

Candidates should be revalidated when selected. A cached list generated earlier is not sufficient for final assignment.

5.2 Create standby coverage

POST /api/v1/admin/bookings/BK-1001/backup-standbys

Idempotency-Key: standby-BK-1001-ST-009

{

"sitterId": "ST-009",

"coverageType": "SOFT_STANDBY",

"standbyStartAt": "2026-08-18T07:00:00+05:30",

"standbyEndAt": "2026-08-18T08:15:00+05:30",

"reason": "FIRST_TIME_CUSTOMER"

}

Response:

201 Created

5.3 Start replacement process

Do not “switch” the sitter directly.

POST /api/v1/admin/bookings/BK-1001/replacement-events

Idempotency-Key: replacement-BK-1001-primary-no-response

{

"triggerCode": "PRIMARY_NOT_ACKNOWLEDGED",

"originalAssignmentId": "ASG-001",

"replacementDeadlineAt": "2026-08-18T07:15:00+05:30",

"expectedBookingVersion": 19

}

Response:

201 Created

{

"replacementEventId": "REP-4001",

"status": "OPEN",

"bookingStatus": "REPLACEMENT_REQUIRED"

}

5.4 Assign accepted replacement

POST /api/v1/admin/replacement-events/REP-4001/assign

Idempotency-Key: replacement-assign-REP-4001-ST-009

{

"sitterId": "ST-009",

"acceptedOfferId": "OFF-901",

"customerApprovalId": "APR-221",

"expectedBookingVersion": 20

}

This must run transactionally:

Lock booking

Confirm replacement event remains open

Recheck sitter eligibility

Confirm no schedule conflict

Remove old active assignment

Create replacement assignment

Update booking

Create status history

Create notifications

Commit

If another replacement was already assigned, return:

409 Conflict

Reservation and replacement flows are sensitive business operations and should be protected against automated abuse, duplicate submissions and stale-state changes. OWASP specifically identifies reservation-style workflows as sensitive business flows.

6. Incident APIs

Proposed version

POST /api/incidents

GET /api/admin/incidents

PUT /api/admin/incidents/:id/status

PUT /api/admin/incidents/:id/resolve

Recommended version

POST /api/v1/bookings/:bookingId/incidents

POST /api/v1/internal/incidents

GET /api/v1/me/incidents/:incidentId

GET /api/v1/admin/incidents

GET /api/v1/admin/incidents/:incidentId

POST /api/v1/admin/incidents/:incidentId/transitions

POST /api/v1/admin/incidents/:incidentId/resolutions

POST /api/v1/admin/incidents/:incidentId/actions

POST /api/v1/admin/incidents/:incidentId/evidence/presign

6.1 Report booking incident

POST /api/v1/bookings/BK-1001/incidents

Idempotency-Key: incident-device-report-44911

Request

{

"category": "PET_HEALTH",

"subtype": "VOMITING",

"description": "Bruno vomited once after the walk.",

"occurredAt": "2026-08-18T08:00:00+05:30",

"immediateDanger": false

}

The server derives:

Reporter identity

Reporter role

Pet

Sitter

Booking

Current service state

The client must not be allowed to choose:

Final severity

Incident owner

Sitter responsibility

Refund result

Sitter restriction

Incident resolution

These are controlled server or admin fields.

Response:

201 Created

{

"incidentId": "INC-2026-00145",

"status": "TRIAGE_REQUIRED",

"message": "The incident has been reported to PetSaathi support."

}

For a critical emergency, the UI must also instruct the user to call emergency support. An API request is not a substitute for immediate physical or veterinary action.

6.2 List incidents

GET /api/v1/admin/incidents

?severity=LEVEL_3

&status=ACTIVE

&limit=25

&cursor=...

Responses must be paginated and field-filtered. OWASP notes that APIs should limit the number of records and operations processed per request to reduce resource-consumption risk.

6.3 Transition incident state

Avoid an unrestricted endpoint such as:

PUT /incidents/:id/status

That could permit invalid changes such as:

REPORTED → CLOSED

Use:

POST /api/v1/admin/incidents/INC-2026-00145/transitions

Idempotency-Key: incident-transition-INC-145-contained

{

"toStatus": "CONTAINED",

"reasonCode": "PET_RECEIVED_VETERINARY_CARE",

"notes": "Owner and veterinary clinic confirmed the pet is stable.",

"expectedIncidentVersion": 6

}

The backend must validate whether the current transition is allowed.

Example:

REPORTED

→ TRIAGE_REQUIRED

→ ACTIVE

→ CONTAINMENT_IN_PROGRESS

→ CONTAINED

→ INVESTIGATING

→ RESOLVED

→ CLOSED

Return 409 Conflict for stale versions or invalid transitions.

6.4 Resolve incident

POST /api/v1/admin/incidents/INC-2026-00145/resolutions

{

"operationalOutcome": "PET_RECEIVED_VETERINARY_CARE",

"customerRemedy": "FULL_REFUND",

"responsibilityStatus": "INCONCLUSIVE",

"rootCauseCategory": "PET_HEALTH_EVENT",

"resolutionSummary": "Pet was assessed by the customer’s veterinarian.",

"correctiveActions": [

{

"type": "PET_REASSESSMENT_REQUIRED",

"ownerUserId": "ADM-018",

"dueAt": "2026-08-19T18:00:00+05:30"

}

],

"expectedIncidentVersion": 9

}

Resolution should create a record rather than silently overwriting the original incident description.

7. Refund APIs

Proposed version

POST /api/bookings/:id/refund-request

GET /api/admin/refunds

PUT /api/admin/refunds/:id/approve

PUT /api/admin/refunds/:id/reject

Recommended version

POST /api/v1/bookings/:bookingId/cancellations

POST /api/v1/bookings/:bookingId/refund-requests

GET /api/v1/me/refund-requests/:refundRequestId

GET /api/v1/admin/refund-requests

GET /api/v1/admin/refund-requests/:refundRequestId

POST /api/v1/admin/refund-requests/:refundRequestId/approve

POST /api/v1/admin/refund-requests/:refundRequestId/reject

POST /api/v1/webhooks/razorpay

Cancellation and refund are separate workflows. A booking may be cancelled without requiring a refund, or a refund may be created because of a payment error or incident.

7.1 Create cancellation

POST /api/v1/bookings/BK-1001/cancellations

Idempotency-Key: cancel-BK-1001-customer-001

{

"reasonCode": "CUSTOMER_PLAN_CHANGED",

"requestedOutcome": "REFUND_ORIGINAL_METHOD"

}

Response:

201 Created

{

"cancellationId": "CAN-1001",

"status": "UNDER_REVIEW",

"policyVersion": "CANCELLATION-2026-01",

"recommendedRefundAmountPaise": 7450

}

7.2 Create refund request

POST /api/v1/bookings/BK-1001/refund-requests

Idempotency-Key: refund-request-BK-1001-001

{

"cancellationId": "CAN-1001",

"reasonCode": "CUSTOMER_CANCELLATION",

"amountRequestedPaise": 7450

}

The server must verify:

Customer owns booking

Payment was captured

Refundable balance exists

No duplicate request exists

Amount does not exceed remaining balance

Policy version applies

7.3 Approve refund

POST /api/v1/admin/refund-requests/RFR-1001/approve

Idempotency-Key: approve-refund-RFR-1001-7450

{

"approvedAmountPaise": 7450,

"reasonCode": "POLICY_PARTIAL_REFUND",

"expectedRefundVersion": 3

}

Response:

202 Accepted

{

"refundRequestId": "RFR-1001",

"status": "PROCESSING",

"providerSubmissionJobId": "JOB-8829"

}

Admin approval should not immediately set:

status = REFUNDED

It should queue the Razorpay request. Provider events later update the record to PROCESSED or FAILED.

Razorpay supports idempotent refund requests so a request may be retried safely without creating a duplicate refund. The same key and identical request body must be reused for retries.

7.4 Reject refund

POST /api/v1/admin/refund-requests/RFR-1001/reject

{

"reasonCode": "OUTSIDE_POLICY_AND_NO_EXCEPTION",

"customerExplanation": "The request falls outside the applicable cancellation policy.",

"expectedRefundVersion": 3

}

Response:

{

"refundRequestId": "RFR-1001",

"status": "REJECTED"

}

A rejection must require an auditable reason.

7.5 Razorpay webhook

POST /api/v1/webhooks/razorpay

The handler must:

Read the raw request body

Validate Razorpay webhook signature

Store provider event ID

Deduplicate repeated events

Handle out-of-order events

Return 2xx quickly

Process financial changes asynchronously

Razorpay explicitly recommends validating and testing webhooks and accounting for idempotency and event ordering.

Do not expose this endpoint behind normal user authentication. It should authenticate the provider request through the webhook signature.

8. API authorisation matrix

### Table 129

| API group | Customer | Sitter | Operations admin | Safety admin | Finance admin |
| --- | --- | --- | --- | --- | --- |
| Start/end own assigned tracking | No | Yes | Exceptional override | Exceptional | No |
| View customer-safe tracking | Own booking | Assigned booking | Yes | Yes | No |
| Read own notifications | Yes | Yes | Own only | Own only | Own only |
| Recalculate sitter score | No | No | Limited | Yes | No |
| Assign backup | No | No | Yes | Yes | No |
| Report incident | Own booking | Assigned booking | Yes | Yes | Limited |
| Resolve serious incident | No | No | No | Yes | No |
| Request refund | Own booking | No | Assisted | Incident-linked | Assisted |
| Approve refund | No | No | Small policy refunds | Incident recommendation | Yes |

Every endpoint needs both:

Function-level authorisation:

Can this role call this endpoint?

Object-level authorisation:

Can this user act on this exact booking, incident or refund?

OWASP treats failures in these two layers as distinct major API risks.

9. Idempotency requirements

Require an Idempotency-Key on important command endpoints:

Start tracking

Complete tracking

Create incident

Create cancellation

Create refund request

Approve refund

Create replacement event

Assign replacement

Send manual admin notification

Store:

idempotency_key

authenticated_actor

endpoint

request_hash

first_response_status

first_response_body

created_at

expires_at

Rule

When the same key is reused:

Same request body

Return the original response.

Different request body

Return:

409 Conflict

This protects against:

Double taps

Network retries

Worker retries

Duplicate webhook processing

Two refund approvals

Multiple replacement assignments

10. Concurrency control

Many Phase 6 actions can happen simultaneously:

Sitter starts while customer cancels

Two backup sitters accept

Admin resolves while new incident evidence arrives

Refund approval occurs twice

Tracking completion retries

Score recalculation overlaps with incident correction

Use an integer version on stateful resources.

Request example:

{

"expectedBookingVersion": 20

}

Database update:

UPDATE bookings

SET

status = 'REPLACEMENT_REQUIRED',

version = version + 1

WHERE

id = $1

AND version = $2

AND status = 'CONFIRMED';

If no row updates, return:

409 Conflict

Do not silently overwrite newer state.

11. Standard response codes

### Table 130

| Status | Use |
| --- | --- |
| 200 OK | Successful read or synchronous command |
| 201 Created | New tracking session, incident or cancellation |
| 202 Accepted | Background score calculation or refund submission |
| 204 No Content | Successful action with no response body |
| 400 Bad Request | Malformed JSON or invalid syntax |
| 401 Unauthorized | Missing or invalid authentication |
| 403 Forbidden | Authenticated but not permitted |
| 404 Not Found | Resource unavailable to caller |
| 409 Conflict | Stale version, duplicate state or invalid transition |
| 422 Unprocessable Content | Valid JSON but failed business validation |
| 429 Too Many Requests | Rate or quota exceeded |
| 500 | Unexpected internal failure |
| 503 Service Unavailable | Temporary dependency or service failure |

12. Standard error format

Use application/problem+json based on RFC 9457, which defines a machine-readable error format for HTTP APIs.

Example:

409 Conflict

Content-Type: application/problem+json

{

"type": "https://api.petsaathi.in/problems/booking-state-conflict",

"title": "Booking state conflict",

"status": 409,

"detail": "The booking was modified by another operation.",

"instance": "/api/v1/bookings/BK-1001",

"code": "BOOKING_VERSION_MISMATCH",

"expectedVersion": 20,

"currentVersion": 21,

"requestId": "REQ-88821"

}

Do not expose:

Stack traces

SQL queries

Provider secrets

Internal file paths

Other customer IDs

Raw payment credentials

13. Rate limits and abuse protection

Apply different limits by endpoint.

Tracking

Start session: very low frequency

Point batches: controlled by active session and device

Maximum points per batch: fixed

Maximum body size: fixed

Only one active session per booking

Notifications

No public arbitrary-send endpoint

Manual admin sends limited

Per-recipient frequency caps

Per-channel spending controls

Template allowlist

Incidents

Authenticated booking participant only

Duplicate-report detection

Media-size limits

Emergency reports never silently rate-limited

Abuse flags for repeated false submissions

Refunds

One active request per eligible payment/cancellation

Admin approval rate-controlled

Maximum amount validated

Reauthentication for high-value action

Reliability recalculation

One active job per sitter/version

Admin-only

Queue-based

Maximum date window

OWASP lists both resource consumption and unrestricted access to sensitive business flows as major API risks, particularly where APIs can generate provider costs or reserve scarce capacity.

14. Pagination and filtering

Every administrative list must be paginated.

Use cursor pagination:

GET /api/v1/admin/incidents

?status=ACTIVE

&severity=LEVEL_2

&limit=25

&cursor=eyJpZCI6...

Response:

{

"items": [],

"nextCursor": "CURSOR-002",

"hasMore": true

}

Set a maximum:

Default limit: 25

Maximum limit: 100

Do not permit:

limit=1000000

15. Field allowlists

Never bind the complete request body directly to database models.

For example, a sitter reporting an incident may submit:

category

subtype

description

occurredAt

immediateDanger

They must not submit:

severity = LEVEL_1

sitterResponsible = false

refundAmount = 0

status = CLOSED

OWASP warns that unauthorised access to object properties can allow users to modify internal fields such as prices or account restrictions.

Create explicit request DTOs and response DTOs for each role.

16. Webhook rules

Every provider webhook should follow the same internal process:

Receive raw request

↓

Verify signature

↓

Check timestamp/replay rules

↓

Create provider-event record

↓

Return success quickly

↓

Process event asynchronously

↓

Update internal resource idempotently

Webhook event record

{

"provider": "RAZORPAY",

"providerEventId": "event_123",

"eventType": "refund.processed",

"payloadHash": "sha256...",

"receivedAt": "2026-08-18T09:00:00Z",

"processingStatus": "RECEIVED"

}

Never trust a webhook event solely because the endpoint is difficult to guess.

17. Auditing requirements

Audit all high-impact API calls:

Tracking manually ended by admin

Reliability recalculation requested

Backup assigned

Primary sitter removed

Incident severity changed

Incident resolved

Refund approved

Refund rejected

Financial amount overridden

Customer credit created

Audit record:

{

"actorUserId": "ADM-018",

"actorRole": "FINANCE_ADMIN",

"action": "REFUND_APPROVED",

"resourceType": "REFUND_REQUEST",

"resourceId": "RFR-1001",

"previousState": {

"status": "UNDER_REVIEW"

},

"newState": {

"status": "APPROVED",

"amountPaise": 7450

},

"reasonCode": "POLICY_PARTIAL_REFUND",

"requestId": "REQ-19182",

"occurredAt": "2026-08-18T08:12:00Z"

}

18. Final approved Phase 6 API list

Tracking

POST /api/v1/bookings/:bookingId/tracking-sessions

POST /api/v1/tracking-sessions/:sessionId/points/batch

POST /api/v1/tracking-sessions/:sessionId/complete

GET /api/v1/bookings/:bookingId/tracking

GET /api/v1/admin/tracking-sessions/:sessionId

Notifications

GET /api/v1/me/notifications

PATCH /api/v1/me/notifications/:notificationId

POST /api/v1/internal/notification-events

POST /api/v1/admin/notifications/test

POST /api/v1/webhooks/whatsapp/:provider

POST /api/v1/webhooks/email/:provider

POST /api/v1/webhooks/sms/:provider

Reliability

GET /api/v1/admin/sitters/:sitterId/reliability

GET /api/v1/admin/sitters/:sitterId/reliability/history

POST /api/v1/admin/sitters/:sitterId/reliability-recalculations

GET /api/v1/admin/sitter-performance-reviews

GET /api/v1/admin/sitter-safety-reviews

Backup and replacement

GET /api/v1/admin/bookings/:bookingId/backup-candidates

POST /api/v1/admin/bookings/:bookingId/backup-standbys

POST /api/v1/admin/bookings/:bookingId/replacement-events

GET /api/v1/admin/replacement-events/:eventId

POST /api/v1/admin/replacement-events/:eventId/offers

POST /api/v1/admin/replacement-events/:eventId/assign

POST /api/v1/admin/bookings/:bookingId/backup-standbys/:standbyId/release

Incidents

POST /api/v1/bookings/:bookingId/incidents

POST /api/v1/internal/incidents

GET /api/v1/me/incidents/:incidentId

GET /api/v1/admin/incidents

GET /api/v1/admin/incidents/:incidentId

POST /api/v1/admin/incidents/:incidentId/transitions

POST /api/v1/admin/incidents/:incidentId/actions

POST /api/v1/admin/incidents/:incidentId/resolutions

POST /api/v1/admin/incidents/:incidentId/evidence/presign

Cancellation and refunds

POST /api/v1/bookings/:bookingId/cancellations

POST /api/v1/bookings/:bookingId/refund-requests

GET /api/v1/me/refund-requests/:refundRequestId

GET /api/v1/admin/refund-requests

GET /api/v1/admin/refund-requests/:refundRequestId

POST /api/v1/admin/refund-requests/:refundRequestId/approve

POST /api/v1/admin/refund-requests/:refundRequestId/reject

POST /api/v1/webhooks/razorpay

19. Recommended implementation order

Step 1 — Shared API controls

Authentication

Role authorisation

Object authorisation

Idempotency

Problem-detail errors

Request IDs

Audit logs

Rate limits

API versioning

Step 2 — Tracking

Start session

Batch points

Complete session

Role-safe tracking response

Step 3 — Incidents

Report incident

Admin queue

State transitions

Resolution

Evidence uploads

Step 4 — Replacement

Candidates

Standby coverage

Replacement event

Transactional assignment

Step 5 — Notifications

Outbox events

User inbox

Provider sending

Provider webhook processing

Step 6 — Refunds

Cancellation

Refund request

Approval

Razorpay integration

Webhook reconciliation

Step 7 — Reliability

Read score

Score history

Asynchronous recalculation

Performance and safety queues

20. Definition of done

The Phase 6 API layer is ready only when:

Security

Every resource ID receives object-level authorisation.

Every admin endpoint receives role-level authorisation.

Sensitive response fields are role-filtered.

Request DTOs allow only approved fields.

Webhook signatures are verified.

Reliability

State-changing commands support idempotency.

Duplicate requests do not create duplicate records.

Stale writes return 409 Conflict.

Background jobs return 202 Accepted.

Provider events can arrive more than once or out of order.

Tracking

Only the active sitter can start tracking.

Only one active session exists per booking.

Point uploads are batched and limited.

Completed sessions reject future points.

Customer and admin tracking responses differ appropriately.

Notifications

Users can view only their own notifications.

Arbitrary notification sending is not public.

Provider attempts and failures are recorded.

Critical communications support fallback channels.

Replacement

Candidates are revalidated at assignment time.

Two backups cannot become active simultaneously.

Assignment changes occur transactionally.

The customer is informed accurately.

Incidents

Reporters cannot assign final severity or responsibility.

Status transitions follow a controlled state machine.

Original evidence is preserved.

Serious resolution actions require the correct admin role.

Refunds

Cancellation and refund are separate.

Refund amounts cannot exceed captured balance.

Admin approval does not falsely mean provider completion.

Razorpay requests and webhooks are idempotent.

Every financial override is audited.

Final operating principle

Phase 6 APIs should model business workflows as controlled, auditable resources—not expose direct buttons that let clients arbitrarily change tracking, incidents, assignments or money states.

PetSaathi Phase 6 — Technical Architecture ⚙️🐾

Executive decision

Your proposed stack is appropriate for Phase 6:

Next.js + TypeScript

PostgreSQL + PostGIS

Prisma

Inngest

Razorpay

WhatsApp API

Mappls or Google Maps

Cloudinary

Sentry

However, use each tool for a specific responsibility:

Next.js: UI, authenticated APIs, webhooks and admin dashboard

PostgreSQL: authoritative business state

PostGIS: location points, distance and geospatial queries

Prisma: application-level database access and transactions

Inngest: durable background workflows, reminders and retries

Razorpay: payment collection and refunds

WhatsApp/SMS/email: customer communication channels

Mappls or Google Maps: map rendering, geocoding and route calculations

Cloudinary: private image/video processing

Sentry: application errors, traces and performance monitoring

Database audit logs: security and business-action history

The core principle should be:

PostgreSQL stores the truth, Next.js validates requests, Inngest handles delayed work, and external providers deliver specialised services.

1. Final recommended architecture

Customer PWA Sitter application

│ │

└──────────────┬────────────────┘

↓

Next.js application

UI + Route Handlers + Auth

│

┌────────────┼────────────┐

↓ ↓ ↓

PostgreSQL Event emission File upload

+ PostGIS to Inngest signed URLs

+ Prisma │ │

│ ↓ ↓

│ Background jobs Cloudinary

│

├── Razorpay webhooks

├── WhatsApp provider

├── SMS provider

├── Email provider

├── Maps provider

└── Sentry/structured logs

Next.js Route Handlers support standard HTTP methods and can receive third-party webhook requests inside the App Router.

2. Application architecture: modular monolith

Do not begin Phase 6 with separate microservices.

Build one well-structured Next.js codebase containing distinct domain modules:

src/

├── app/

│ ├── api/

│ ├── customer/

│ ├── sitter/

│ └── admin/

│

├── modules/

│ ├── auth/

│ ├── pets/

│ ├── bookings/

│ ├── assignments/

│ ├── payments/

│ ├── tracking/

│ ├── notifications/

│ ├── reports/

│ ├── incidents/

│ ├── refunds/

│ └── reliability/

│

├── inngest/

│ ├── client.ts

│ └── functions/

│

├── infrastructure/

│ ├── database/

│ ├── maps/

│ ├── media/

│ ├── messaging/

│ └── observability/

│

└── shared/

├── security/

├── validation/

├── errors/

└── audit/

This gives PetSaathi clear module boundaries without the deployment and monitoring overhead of distributed microservices.

3. Background jobs: choose Inngest for Phase 6

Recommended decision

Use Inngest as the primary background-workflow system.

Inngest integrates directly with Next.js, supports event-triggered background functions, delayed execution, cron scheduling, retries, concurrency controls and execution history without requiring PetSaathi to manage a separate Redis queue and worker fleet.

Suitable Inngest workloads

Booking reminders

Sitter acknowledgement deadlines

Payment reconciliation

Report Card generation

Report overdue reminders

Replacement escalation

Refund processing

Incident follow-up

Reliability recalculation

Repeat booking offers

Daily operational summaries

Example events

booking/requested

booking/confirmed

booking/cancelled

sitter/acknowledgement-overdue

payment/captured

payment/failed

service/started

service/completed

report/submitted

incident/opened

refund/approved

review/submitted

Example event flow

booking/confirmed

↓

Inngest function receives event

↓

Schedule 24-hour reminder

↓

Schedule 2-hour sitter reminder

↓

Schedule 1-hour customer reminder

↓

Schedule 30-minute sitter reminder

↓

Each reminder independently rechecks booking state

Inngest supports scheduled functions with timezone-aware cron schedules and also supports scheduling individual jobs independently, giving each job its own retry and execution history.

4. Where BullMQ would be better

BullMQ is a valid alternative when PetSaathi wants:

Full control over worker infrastructure

Self-hosted Redis queues

Very high-volume job processing

Custom worker processes

Fine-grained queue priorities

Dedicated processing outside serverless limits

BullMQ supports delayed jobs, retries, concurrency and scheduled jobs, but requires Redis and worker operations that PetSaathi must deploy and monitor. Current BullMQ versions use Job Schedulers for recurring work.

Recommendation

Phase 6:

Inngest

Later, if workload justifies it:

BullMQ for specialised high-throughput queues

Do not run Inngest, BullMQ and Trigger.dev simultaneously during the MVP. Multiple queue systems create unnecessary operational complexity and make retries, monitoring and ownership harder to understand.

5. Where Trigger.dev would be better

Trigger.dev is particularly suitable for long-running TypeScript tasks, compute-heavy workflows, media processing, AI tasks and workflows requiring detailed task observability. It provides official Next.js integration and supports retries, queues, concurrency and long-running tasks.

Use Trigger.dev instead of—or later alongside—Inngest only if PetSaathi introduces workloads such as:

Long video-processing pipelines

Large document generation

Complex AI evaluations

Long-running browser automation

Heavy data import/export

For Phase 6 reminders, payment events, report generation and workflow automation, Inngest is the simpler fit.

6. Critical correction: do not send GPS points through Inngest

Live tracking points should follow a direct ingestion path:

Sitter device

↓

Next.js tracking endpoint

↓

Authentication and session validation

↓

Batch validation

↓

PostgreSQL/PostGIS

Do not create one background job for every GPS point.

A 30-minute walk sampled every 15 seconds creates approximately 120 points. Sending every point through a durable workflow engine would increase job volume, delay and cost without improving the basic tracking result.

Use Inngest only for tracking-related follow-up:

Tracking signal lost

Tracking session overdue

Generate route summary

Generate Report Card

Delete expired tracking records

Send tracking exception alert

7. PostgreSQL, PostGIS and Prisma

PostgreSQL as source of truth

Store these authoritative states in PostgreSQL:

Booking status

Assignment status

Payment/refund status

Tracking session

Report Card

Incident

Notification outbox

Sitter reliability snapshots

Audit history

PostGIS

Use PostGIS for:

Tracking-point storage

Nearby sitter searches

Service-radius checks

Route lines

Geodesic distance

Area-based matching

PostGIS can create route lines from ordered points and calculate geographic line length in metres.

Prisma

Use Prisma for ordinary database access, validation-friendly models and transactional workflows. For concurrent operations, include a version field and use optimistic concurrency control so a stale process cannot overwrite a newer booking state. Prisma documents version fields as a standard optimistic-concurrency approach.

Example:

const result = await prisma.booking.updateMany({

where: {

id: bookingId,

version: expectedVersion,

status: "SITTER_MATCHING",

},

data: {

status: "SITTER_ASSIGNED",

version: { increment: 1 },

},

});

if (result.count !== 1) {

throw new BookingStateConflictError();

}

For PostGIS-specific operations that Prisma does not model conveniently, use reviewed parameterised SQL rather than moving all spatial logic into application code.

8. Transactional outbox pattern

Do not send WhatsApp messages or Inngest events before the database transaction succeeds.

Use:

Database transaction begins

↓

Booking state changes

↓

Status history created

↓

Outbox event created

↓

Transaction commits

↓

Outbox dispatcher sends event

↓

Inngest/notification provider processes it

Example

booking.status = CONFIRMED

payment.status = CAPTURED

assignment.status = ASSIGNED

outbox.event = booking/confirmed

If WhatsApp is temporarily unavailable, the confirmed booking must remain valid.

9. Payment architecture

Recommended flow

Customer checkout

↓

Razorpay order

↓

Frontend receives payment response

↓

Backend verifies payment signature

↓

Webhook confirms provider event

↓

Database transaction reconciles payment

↓

booking/confirmed event emitted

Razorpay requires server-side signature verification before fulfilling an order. Its webhooks provide event notifications for payments, refunds, settlements and disputes.

Webhook endpoint

POST /api/v1/webhooks/razorpay

The handler should:

Read the raw request body.

Verify the Razorpay signature.

Store the provider event ID.

Return a successful response quickly.

Process the event asynchronously and idempotently.

Razorpay specifically warns that webhook-signature validation must use the raw request body rather than a parsed or transformed payload.

Do not perform inside the webhook request

Send WhatsApp

Generate PDF

Calculate reliability score

Run large reconciliation query

Queue those actions after the event has been stored.

10. WhatsApp architecture

Create one internal messaging interface:

interface MessagingProvider {

sendTemplate(input: TemplateMessage): Promise<DeliveryResult>;

sendText(input: TextMessage): Promise<DeliveryResult>;

verifyWebhook(request: Request): Promise<VerifiedWebhookEvent>;

}

Then implement adapters such as:

Meta Cloud API adapter

Interakt adapter

WATI adapter

Recommended vendor decision

Use Interakt or WATI when:

You need faster onboarding

Non-technical staff need template management

You want a provider dashboard

You need operational support

Use direct Meta Cloud API when:

You want greater technical control

You want fewer vendor-specific dependencies

Your engineering team can manage templates, webhooks and delivery reporting

Messaging volume makes direct integration commercially sensible

Keep PetSaathi’s business workflows independent of the chosen provider:

booking.confirmed

↓

Notification service

↓

WhatsApp provider adapter

This allows a future provider change without rewriting booking logic.

11. SMS fallback

For an India-focused launch, MSG91 is a practical SMS fallback because its documentation covers Indian DLT entity, header and message-template registration.

Indian organisations sending transactional or promotional SMS must complete the relevant DLT registration and use approved sender IDs and templates.

Use SMS for:

Critical sitter acknowledgement

Replacement alert

Service-start failure

Payment action

Emergency support callback

Do not use SMS for every ordinary dashboard update; it increases messaging costs and customer noise.

12. Maps: Google Maps versus Mappls

Mappls recommendation

For an India-first pilot, test Mappls/MapmyIndia as the primary provider.

Mappls offers mapping, geocoding, route/navigation and mobility/tracking APIs, with products specifically positioned for Indian location use cases.

Use it for:

Address search

Geocoding

Service-area maps

Sitter-distance estimates

Customer route display

Indian locality and POI matching

Google Maps recommendation

Google Maps offers broad developer tooling, Routes and Route Matrix APIs, real-time traffic options and Roads APIs such as route snapping. Its services use usage-based billing and quotas that should be configured to control cost.

Correct selection method

Do not choose based only on brand familiarity.

Run a pilot comparison using approximately 50–100 real addresses across:

Bopal

South Bopal

Satellite

Society entrances

Pet shops

Veterinary clinics

Apartment towers

Measure:

Address-search accuracy

Building and society coverage

Travel-time accuracy

Route quality

SDK stability

Cost per booking

Customer map experience

Recommended Phase 6 decision

Primary provider:

Mappls if Ahmedabad address quality performs better

Alternative:

Google Maps if developer experience and route quality are materially stronger

Avoid using two map providers in the same booking flow unless there is a clear fallback requirement.

13. Media architecture

Recommended: Cloudinary

Use Cloudinary when Phase 6 requires:

Photo resizing

Image compression

Format optimisation

Video compression

Short video delivery

Thumbnails

Private or signed delivery

Multiple output sizes

Cloudinary supports dynamic image transformations and on-the-fly video format, dimension and quality optimisation.

Upload flow

Sitter requests signed upload parameters

↓

Device uploads directly to Cloudinary

↓

Cloudinary processes media

↓

Webhook confirms asset

↓

PetSaathi stores asset reference

↓

Customer receives controlled access

Do not route large video files through the Next.js server unless necessary.

MongoDB Atlas alternative

MongoDB GridFS storage supports on-the-fly image resizing and optimisation, but its documented image transformations are a Pro-plan feature and do not replace a complete video-processing system.

Recommendation

Images only and already using MongoDB Atlas:

MongoDB GridFS storage may be enough

Images + short service videos:

Cloudinary is stronger for Phase 6

14. Error tracking and logging

Sentry

Use Sentry for:

Unhandled exceptions

API failures

Frontend errors

Performance traces

Slow database/API paths

Release regressions

Source-mapped stack traces

Sentry provides dedicated Next.js integration covering errors, tracing, logs and source-map configuration.

Tag errors with operational context:

Sentry.setTags({

module: "refunds",

bookingId,

paymentProvider: "razorpay",

});

Never include:

Full customer address

Medical notes

Raw payment payload

Emergency phone number

Access token

Webhook secret

Structured application logs

Use structured JSON logs for:

Request ID

Booking ID

Module

Event

Duration

Result

Retry count

Provider reference

Sentry can now receive structured Next.js logs, while Better Stack provides a dedicated Next.js logging client and live-tail functionality.

Recommended observability decision

Lean Phase 6

Sentry:

Errors + traces

PostgreSQL:

Business audit logs

Provider dashboards:

Razorpay, Inngest, Cloudinary

Add Better Stack/Axiom when:

Log volume grows

Operators need central live search

Multi-provider event diagnosis becomes difficult

Longer log retention is required

Do not confuse Sentry logs with your permanent business audit trail. Refund approvals, sitter restrictions and incident decisions belong in an immutable or strongly audited database record.

15. Admin alerts

Admin alerts should originate from PetSaathi’s alert engine:

System detects condition

↓

admin_alert record created

↓

Alert assigned priority

↓

Inngest workflow runs

↓

Slack/WhatsApp/email delivered

Channels are delivery mechanisms—not the source of truth.

Recommended priority routing

### Table 131

| Priority | Delivery |
| --- | --- |
| P0 safety emergency | Phone + WhatsApp + admin dashboard |
| P1 active-service failure | WhatsApp/Slack + dashboard |
| P2 operational exception | Dashboard + Slack/email |
| P3 review item | Dashboard queue |

Examples:

Pet missing:

P0

Sitter no-show:

P1

Report Card overdue:

P2

Sitter score decline:

P3

16. Real-time dashboard architecture

Do not force every customer and admin client to query the database every second.

Use:

Database change/event

↓

Dashboard read model updated

↓

Server-Sent Events, WebSocket or controlled polling

↓

Admin/customer UI refreshes

Recommended initial choice:

Customer dashboard:

30–60 second polling plus event notifications

Admin active-service dashboard:

Server-Sent Events or 10–15 second polling

GPS route:

Controlled refresh, not every raw point

A fallback polling strategy is essential so the dashboard does not silently freeze when a real-time connection disconnects.

17. Suggested Inngest functions

bookingConfirmed

scheduleBookingReminders

sitterAcknowledgementDeadline

serviceStartDeadline

trackingSignalLost

generateReportCardDraft

reportSubmissionDeadline

processNotificationOutbox

processPaymentWebhookEvent

processRefundApproval

checkRefundStatus

startReplacementWorkflow

incidentFollowUp

recalculateSitterReliability

generateRepeatOffer

dailyOperationsSummary

deleteExpiredTrackingData

Example workflow

export const bookingConfirmed = inngest.createFunction(

{

id: "booking-confirmed",

retries: 5,

},

{ event: "booking/confirmed" },

async ({ event, step }) => {

const booking = await step.run("load-booking", async () => {

return getConfirmedBooking(event.data.bookingId);

});

await step.sendEvent("schedule-reminders", {

name: "booking/reminders.requested",

data: {

bookingId: booking.id,

scheduledStartAt: booking.scheduledStartAt,

},

});

await step.sendEvent("send-confirmation", {

name: "notification/requested",

data: {

bookingId: booking.id,

recipientUserId: booking.customerId,

template: "BOOKING_CONFIRMED",

},

});

},

);

Each step must remain idempotent because providers, networks and background workflows can retry.

18. Deployment topology

Recommended Phase 6 deployment

Vercel

├── Next.js customer PWA

├── Sitter web interface

├── Admin dashboard

├── API Route Handlers

└── Inngest serve endpoint

Managed PostgreSQL

├── Business data

├── PostGIS

├── Audit logs

└── Notification outbox

Inngest Cloud

├── Durable workflows

├── Reminders

├── Retries

└── Scheduled jobs

External services

├── Razorpay

├── WhatsApp provider

├── MSG91

├── Mappls/Google Maps

├── Cloudinary

└── Sentry

Inngest can host its function endpoints alongside a Next.js application deployed to Vercel.

19. Security boundaries

Public endpoints

Customer booking requests

Customer cancellation requests

Sitter service actions

Authenticated tracking uploads

Provider webhook endpoints

Razorpay

WhatsApp

SMS

Email

Cloudinary

Verify provider signatures and preserve raw payload requirements.

Internal endpoints

Notification event creation

Reliability recalculation

Report generation

Retention cleanup

Internal endpoints must use service authentication and must not be callable from browsers.

Admin endpoints

Require:

Authenticated admin

Role permission

Object permission

Reason for sensitive action

Audit event

Reauthentication for critical financial/safety actions

20. Failure isolation

A strong architecture should ensure:

### Table 132

| Failure | What should still work |
| --- | --- |
| WhatsApp unavailable | Booking remains confirmed; use SMS/email fallback |
| Inngest temporarily delayed | Booking state remains safe in PostgreSQL |
| Map provider unavailable | Service can use manual evidence and cached address |
| Cloudinary processing delayed | Report remains pending, not lost |
| Sentry unavailable | Application continues operating |
| Razorpay webhook duplicated | Payment handled once |
| GPS signal unavailable | Fallback service evidence |
| Admin Slack unavailable | Alerts remain visible in admin dashboard |

No external provider should be allowed to become the only copy of essential booking information.

21. Final stack approval

### Table 133

| Need | Final recommendation |
| --- | --- |
| Frontend and API | Next.js + TypeScript |
| Database | PostgreSQL + PostGIS |
| ORM | Prisma |
| Background jobs | Inngest |
| Scheduling | Inngest delayed jobs and cron |
| Payments | Razorpay with verified webhooks |
| WhatsApp | Provider adapter; Meta/Interakt/WATI |
| SMS | MSG91 for India fallback |
| Maps | Evaluate Mappls first; Google alternative |
| Media | Cloudinary |
| Errors/tracing | Sentry |
| Structured logs | Sentry Logs initially; Better Stack/Axiom later if needed |
| Audit trail | PostgreSQL audit tables |
| Admin alerts | Dashboard first; WhatsApp/Slack/email delivery |
| High-throughput queue later | BullMQ only when justified |
| Long compute-heavy jobs later | Trigger.dev if justified |

22. Recommended implementation order

Step 1 — Core infrastructure

PostgreSQL/PostGIS

Prisma migrations

Authentication and RBAC

Business audit logs

Sentry

Step 2 — Event foundation

Inngest client

Event naming convention

Outbox dispatcher

Idempotency records

Retry strategy

Step 3 — Payment reliability

Razorpay raw webhook

Signature verification

Payment event table

Booking reconciliation

Refund workflow

Step 4 — Notifications

Notification outbox

WhatsApp adapter

MSG91 fallback

Email

Delivery events

Step 5 — Tracking and media

Tracking ingestion API

PostGIS points

Route summaries

Cloudinary direct uploads

Customer status view

Step 6 — Automation

Booking reminders

Report Card generation

Replacement workflow

Incident follow-up

Reliability scores

Repeat offers

Step 7 — Operational hardening

Load testing

Provider failure simulations

Webhook duplication tests

Queue-delay tests

Data-retention jobs

Admin alert drills

Definition of done

The Phase 6 technical architecture is ready only when:

Workflows

Background tasks survive request termination.

Retries do not duplicate money, assignments or messages.

Scheduled reminders recheck current booking state.

Failed provider calls have controlled fallbacks.

Payments

Signatures are verified server-side.

Webhooks use raw bodies.

Duplicate and out-of-order events are safe.

Refund approvals and processing are separate.

Tracking

GPS points use a direct batch-ingestion path.

PostGIS stores and calculates location information.

Tracking failure does not destroy the booking.

Route access remains private.

Notifications

Business logic is independent of the provider.

WhatsApp, SMS and email delivery attempts are recorded.

Critical messages support fallback channels.

DLT requirements are handled for Indian SMS.

Observability

Errors and traces reach Sentry.

Structured logs contain request and booking context.

Sensitive data is removed.

Financial and safety actions have permanent audit records.

Scalability

PostgreSQL remains authoritative.

Inngest handles durable asynchronous work.

Large media bypasses the application server.

External dependencies are isolated behind adapters.

BullMQ or Trigger.dev is introduced only when measurable workload requires it.

Final operating principle

Use Inngest to orchestrate business workflows, not to replace the database or absorb every real-time event. PostgreSQL owns state, webhooks report external facts, and every third-party service remains replaceable behind a controlled adapter.

PetSaathi Phase 6 — Week 1 Execution Plan 🛡️⚙️🐾

Executive decision

Week 1 should be treated as a design and risk-control sprint, not a coding sprint.

The purpose is to convert Phase 5 operating evidence into:

Prioritised safety fixes

A measurable sitter-reliability model

Automatable booking workflows

A controlled GPS specification

A complete notification and escalation map

A safe database migration plan

A development-ready backlog

The correct sequence is:

Phase 5 evidence

↓

Safety and operational analysis

↓

Requirements and control decisions

↓

Data and event architecture

↓

Prioritised implementation backlog

↓

Phase 6 development begins

Do not start building tracking, scores or automation before their rules, failure paths and ownership are defined.

1. Week 1 success criteria

Week 1 is complete only when the team can answer:

What failed or nearly failed during Phase 5?

Which failures require product, policy, training or operational fixes?

How will sitter reliability be calculated fairly?

Which booking steps can safely be automated?

What exactly will basic GPS tracking collect?

Which message is sent to whom, through which channel and when?

Which tables, fields, constraints and migrations are required?

What will be built first, by whom and how will it be tested?

2. Day 1 — Review Phase 5 incidents

Goal

Understand every meaningful safety, service and operational failure before building automation.

Inputs

Collect:

Incident records

Customer complaints

Refund reasons

Sitter cancellations

No-shows

Late arrivals

Failed replacements

Tracking or evidence gaps

Missing Report Cards

Payment discrepancies

Support conversations

Low-rating reviews

Near misses

A near miss is important even when no customer harm occurred. For example:

Primary sitter became unreachable

but

backup arrived before the service time

The service succeeded, but the underlying reliability weakness still needs investigation.

Review method

For each incident, record:

What happened?

When did it happen?

How was it detected?

What was the customer impact?

What was the pet/sitter impact?

What contained the issue?

What contributed to it?

Could it happen again?

What control was missing?

Who owns the corrective action?

Use a blameless review process. Google’s SRE guidance recommends analysing contributing causes and creating concrete action items rather than treating a postmortem as punishment. It also recommends consistent templates because standardised records make trend analysis easier.

Classification model

Classify each finding under one primary domain:

### Table 134

| Domain | Example |
| --- | --- |
| Pet safety | Bite history was incomplete |
| Sitter reliability | Sitter acknowledged but did not travel |
| Customer information | Wrong access instructions |
| Matching | Sitter lacked large-dog experience |
| Booking workflow | Unpaid booking remained active |
| Communication | Customer was not informed about delay |
| Report Card | Concern was not escalated |
| Payment/refund | Captured payment was not reconciled |
| Technical | Notification or API failed |
| Policy | Cancellation outcome was inconsistent |
| Training | Sitter did not follow handover procedure |

Root-cause levels

Do not stop at:

Sitter was late.

Analyse deeper:

Sitter was late

↓

Previous booking was scheduled too close

↓

No travel buffer was applied

↓

Availability model did not include travel time

↓

Assignment system allowed an impossible schedule

The likely corrective action is not only “warn the sitter.” It may require a scheduling constraint.

Day 1 output: Safety Gap Register

### Table 135

| Field | Example |
| --- | --- |
| Gap ID | SAFE-001 |
| Incident/booking | INC-145 / BK-1001 |
| Category | Sitter reliability |
| Severity | High |
| Finding | No readiness check before service |
| Root cause | Assignment acknowledged but travel not confirmed |
| Existing control | Two-hour reminder |
| Missing control | Thirty-minute travel readiness |
| Recommended action | Add readiness state and alert |
| Owner | Operations/product |
| Priority | P0 |
| Due phase | Phase 6 |
| Verification | Simulated late-start test |

End-of-day acceptance criteria

Every Phase 5 incident has been reviewed.

Duplicate incidents are grouped.

Systemic patterns are identified.

Every serious incident has an owner.

P0 safety actions are separated from minor UX improvements.

No finding is written only as “human error.”

3. Day 2 — Review sitter reliability and finalise the score model

Goal

Create a transparent and fair reliability model that helps assignment decisions without allowing one number to override safety or compatibility.

Inputs

Use Phase 5 data for:

Scheduled and actual arrival time

Service start time

Completed bookings

Sitter cancellations

No-shows

Offer responses

Report Card submission

Customer ratings

Same-sitter requests

Reviewed incidents

Training and verification status

Final score components

Recommended Phase 6 model:

### Table 136

| Factor | Weight |
| --- | --- |
| On-time performance | 25% |
| Accepted-booking completion | 20% |
| Avoidable cancellation/no-show | 10% |
| Report Card timeliness and quality | 15% |
| Adjusted customer experience | 15% |
| Eligible offer response/acceptance | 10% |
| Training and policy compliance | 5% |

Separate safety status

Incident history should not be reduced to a routine 10% component.

Use:

Reliability score: 88

Safety status: CLEAR

or:

Reliability score: 94

Safety status: SAFETY_REVIEW

The safety status must override booking placement when a serious incident is unresolved.

Required exclusions

Do not penalise a sitter when:

Customer cancelled.

Address was incorrect.

Society entry caused a documented delay.

Booking was outside the sitter’s approved radius.

Pet risk exceeded the sitter’s permission.

Operations created a scheduling conflict.

Sitter correctly rejected an unsafe service.

Sample-size rules

Recommended confidence levels:

### Table 137

| Completed bookings | Confidence |
| --- | --- |
| 0–4 | Onboarding |
| 5–9 | Provisional |
| 10–24 | Limited |
| 25+ | Established |

Do not mark a new sitter “Premium” because they received one five-star review.

Human-control rule

The score may recommend:

More assignments

Coaching

Reduced service radius

Report training

Temporary service restriction

Performance review

It should not automatically:

Permanently suspend a sitter

Conclude responsibility for an incident

Override service permissions

Assign high-risk pets

NIST’s AI and automated-risk guidance recommends clearly defining human roles, oversight and the limits of automated systems used in operational decision-making.

Day 2 output: Reliability Model Specification

It should include:

Formula version

Measurement window

Component weights

Raw metric formulas

Inclusion rules

Exclusion rules

Sample-size handling

Safety override

Threshold actions

Appeal/correction flow

Recalculation triggers

Example sitter result

Sitter: Riya S.

Window: Previous 90 days

Completed bookings: 31

Confidence: Established

On-time 23.7 / 25

Completion 19.6 / 20

Cancellation/no-show 9.0 / 10

Report quality 14.1 / 15

Customer experience 13.2 / 15

Offer response 8.5 / 10

Training/compliance 5.0 / 5

Total: 93.1

Level: Premium candidate

Safety status: Clear

End-of-day acceptance criteria

Every factor has an exact formula.

Every metric has a source table or event.

Exclusion rules are documented.

New sitters are handled separately.

Incident safety status is separated from score.

Score thresholds have human-reviewed actions.

Sitters can understand and challenge incorrect data.

4. Day 3 — Review booking delays and identify automation needs

Goal

Find where bookings become slow, uncertain or dependent on repetitive admin work.

Reconstruct the complete booking timeline

For each delayed booking, collect:

Request submitted

Admin review started

Candidate search started

Offers sent

Sitter accepted

Customer approved

Payment started

Payment captured

Booking confirmed

Sitter acknowledged

Sitter arrived

Service started

Calculate stage delays

Example:

### Table 138

| Stage | Target | Actual | Delay |
| --- | --- | --- | --- |
| Request → review | 10 min | 35 min | 25 min |
| Review → sitter offer | 10 min | 20 min | 10 min |
| Offer → acceptance | 15 min | 8 min | None |
| Acceptance → payment | 20 min | 90 min | 70 min |
| Confirmation → acknowledgement | 30 min | Missing | Critical |

Delay categories

Customer delay

Missing Pet Profile

Payment not completed

Address incomplete

Customer did not approve sitter

Sitter delay

Offer not viewed

Acknowledgement missing

Travel confirmation missing

Late check-in

Admin delay

Risk review waiting

No booking owner

Manual sitter search

Refund approval queue

System delay

Notification failed

Payment webhook delayed

Report generation failed

Dashboard did not refresh

Supply delay

No eligible sitter

Excessive travel distance

Capacity full

Required skill unavailable

Automation opportunity matrix

### Table 139

| Process | Automate? | Phase 6 treatment |
| --- | --- | --- |
| Profile completeness | Yes | Automatic validation |
| Sitter eligibility filters | Yes | Deterministic filters |
| Red-risk approval | No | Human safety review |
| Offer expiration | Yes | Scheduled workflow |
| Payment confirmation | Yes | Verified webhook |
| Sitter acknowledgement deadline | Yes | Reminder + alert |
| Backup assignment | Assisted | Candidate generation; human approval |
| Critical refund | No | Admin/finance approval |
| Report reminder | Yes | Scheduled reminder |
| Incident resolution | No | Human-controlled |

Automation priority formula

Score each opportunity using:

Frequency

× operational impact

× time saved

× safety value

÷ implementation complexity

Day 3 output: Automation Requirements Matrix

Each entry should contain:

Workflow

Current manual step

Failure observed

Proposed trigger

Automated action

Human checkpoint

Timeout

Fallback

Audit event

Success metric

Example

Workflow:

Sitter acknowledgement

Trigger:

Booking confirmed

Automated action:

Request acknowledgement

Timeout:

30 minutes for bookings more than 24 hours away

Fallback:

Create admin alert and generate backup candidates

Human checkpoint:

Admin decides whether to replace sitter

Success metric:

95% acknowledgement before deadline

End-of-day acceptance criteria

Every major booking delay has a reason code.

Automation and human-review steps are clearly separated.

Timeout values are defined.

Fallbacks exist for failed automation.

Every workflow has an owner and success metric.

No automation bypasses safety, payment or authorisation controls.

5. Day 4 — Finalise live-tracking requirements

Goal

Lock the Phase 6 GPS scope before technical implementation begins.

Approved basic scope

Build:

Sitter arrival

Start Walk

Periodic GPS samples

Signal quality

End Walk

Approximate duration

Approximate distance

Customer-visible service status

Tracking failure fallback

Report Card integration

Do not build yet:

Second-by-second Uber-style animation

Advanced road snapping

AI route-quality analysis

Wearable integration

Predictive arrival

Permanent route history

Define the tracking lifecycle

READY

STARTING

ACTIVE

SIGNAL_WEAK

SIGNAL_LOST

FALLBACK_REQUIRED

COMPLETED

COMPLETED_WITH_GAPS

FAILED

ADMIN_REVIEW_REQUIRED

Data specification

Each point should include:

Session ID

Sequence number

Latitude

Longitude

Accuracy

Device-recorded timestamp

Server-received timestamp

Speed where available

Validation status

Sampling starting point

For initial testing:

Sample approximately every 15–30 seconds

or after meaningful movement

Upload batches approximately every 30–60 seconds

These values are starting assumptions and should be tested on real devices and routes.

Permission and privacy decisions

Define:

When permission is requested

Foreground versus background behaviour

What happens when permission is denied

When tracking starts

When tracking stops

Who can access route data

How long raw points are retained

What the customer sees

How fallback evidence works

Android distinguishes foreground, background and approximate location permissions. It also limits background-location frequency under certain conditions, so the design must handle denied permissions, weak signals and operating-system restrictions.

Required failure paths

Location permission denied

Location service disabled

Approximate location only

Network unavailable

Application terminated

Battery optimisation

GPS drift

No valid point received

Sitter ends walk early

Tracking remains active after service

Fallback evidence

When GPS fails:

Arrival check-in

Start/end timestamps

Timestamped media

Manual checkpoint

Customer handover confirmation

Sitter explanation

Admin review

Day 4 output: GPS Scope Specification

It should contain:

User flows

Permission flow

Tracking states

Point schema

Sampling rules

Validation rules

Customer display

Admin display

Fallback workflow

Privacy notice

Retention proposal

Device test matrix

Acceptance tests

End-of-day acceptance criteria

Tracking begins and ends through controlled server actions.

Only the assigned sitter can start it.

Only one session can be active per booking.

Raw GPS points are never treated as perfectly accurate.

The customer sees honest signal status.

Tracking failure does not automatically mean service failure.

Tracking outside the authorised booking window is prohibited.

6. Day 5 — Finalise notifications and reminders

Goal

Define every important message and escalation before implementing WhatsApp, SMS, email, push or in-app notifications.

Build a notification map

For every event define:

Trigger

Recipient

Purpose

Timing

Primary channel

Fallback channel

Template

Required action

Expiry

Escalation

Suppression conditions

Example notification matrix

### Table 140

| Trigger | Recipient | Primary | Fallback | Action |
| --- | --- | --- | --- | --- |
| Booking confirmed | Customer | WhatsApp | Email | View booking |
| Assignment confirmed | Sitter | WhatsApp/push | SMS | Acknowledge |
| Service in two hours | Sitter | Push/WhatsApp | SMS | Confirm travel |
| Service in one hour | Customer | WhatsApp | Push | Prepare pet |
| Start overdue | Admin | Dashboard/WhatsApp | Phone | Investigate |
| Service started | Customer | Push/WhatsApp | In-app | View status |
| Report ready | Customer | Push/email | WhatsApp | View report |
| Incident created | Admin | Dashboard + phone | WhatsApp | Respond |

Priority model

Normal

Report Card ready

Review request

Repeat offer

Next-day reminder

High

Service starting soon

Sitter delayed

Replacement required

Customer action needed

Critical

Pet missing

Serious incident

Unreachable active sitter

Sensitive-data exposure

FCM recommends normal priority for less time-sensitive updates and high priority only for time-sensitive, user-visible messages. Background delivery of normal-priority messages may be delayed.

Message expiry

Examples:

30-minute reminder:

Expire after approximately 45 minutes

Start-overdue alert:

Expire after the workflow is resolved

Report ready:

Remain valid longer

Repeat offer:

Expire according to commercial policy

Reminder orchestration

Each reminder should be its own scheduled job with independent retries and visibility. Inngest supports durable event- or schedule-triggered functions, retries and independently scheduled jobs.

Suppression rules

Do not send a scheduled reminder when the booking has been:

Cancelled

Rescheduled

Replaced

Completed

Placed under incident review

Already acted upon

The worker must recheck the latest database state immediately before sending.

Day 5 output: Notification and Escalation Map

Required sections:

Event catalogue

Customer messages

Sitter messages

Admin alerts

Channel priorities

Fallback rules

Template codes

Message expiry

Quiet-hour rules

Retry policy

Suppression rules

Delivery tracking

End-of-day acceptance criteria

Every critical event has a fallback channel.

No public API can send arbitrary messages.

Marketing and service messages are separated.

Stale reminders are suppressed.

Sensitive details are excluded from lock-screen messages.

Missing sitter acknowledgement produces an admin alert.

Notification-provider failure cannot corrupt a valid booking.

7. Day 6 — Plan the database updates and migration

Goal

Convert all approved requirements into a safe schema and deployment strategy.

Required schema groups

Tracking

tracking_sessions

tracking_points

Notifications

notification_outbox

notification_deliveries

notification_preferences

device_push_tokens

Reliability

sitter_performance_events

sitter_reliability_snapshots

sitter_reliability_components

sitter_score_actions

Backup and replacement

booking_backup_candidates

replacement_events

backup_offer_events

Cancellation and refund

booking_cancellations

refund_requests

refund_events

customer_credits

cancellation_policy_versions

Control and audit

workflow_events

admin_alerts

admin_audit_logs

Migration-planning process

1. Create an ERD

Show:

Primary keys

Foreign keys

One-to-many relationships

Historical/versioned relationships

Delete/restrict behaviour

Ownership and access

2. Define constraints

Examples:

Only one active tracking session per booking

Only one active primary/replacement assignment

Refund amount cannot be negative

End time cannot precede start time

Reliability score must be between 0 and 100

Tracking sequence is unique within a session

3. Identify backfills

Examples:

Existing incidents need categories.

Existing sitter metrics may need initial snapshots.

Existing bookings need policy-version values.

Existing notification history may remain legacy data.

Existing assignment rows may need role conversion.

4. Use expand-and-contract migrations

Safer pattern:

Add new nullable field/table

↓

Deploy compatible application code

↓

Backfill existing records

↓

Validate data

↓

Add constraints

↓

Stop reading old field

↓

Remove old field in later migration

Avoid trying to rename, transform and delete critical production fields in one release.

5. Create rollback and recovery plans

For each migration record:

How to detect failure

Whether rollback is safe

How to restore backup

How application compatibility is maintained

How migration status is reconciled

Prisma recommends applying production migrations through prisma migrate deploy, generally as part of CI/CD rather than manually from a developer machine. Prisma’s migration directory acts as the source of truth for schema history.

6. Plan indexes carefully

Indexes should support real queries such as:

Active tracking sessions

Due notifications

Open incidents

Replacement deadlines

Current reliability snapshot

Pending refunds

PostgreSQL notes that indexes improve retrieval but also add write and storage overhead, so they should be selected around actual access patterns.

7. Define access controls

Sensitive tables include:

Tracking points

Incident evidence

Reliability actions

Refund approvals

Customer credits

PostgreSQL Row-Level Security can restrict which rows a database role can read or modify, while API endpoints must still enforce object-level and function-level authorisation.

Day 6 output: Database Migration Plan

Include:

Updated ERD

Table specifications

Enums/status values

Constraints

Indexes

Migration sequence

Backfill scripts

Compatibility strategy

Rollback/recovery plan

Data-retention plan

Role/access matrix

Staging verification checklist

End-of-day acceptance criteria

Every new field has a clear purpose.

Current and historical states are separated.

Financial amounts use integer paise.

Critical rules have database constraints.

Migration order avoids destructive first steps.

Existing production records have a backfill strategy.

Staging and production deployment procedures are documented.

8. Day 7 — Create the sprint backlog

Goal

Turn the approved requirements into a development-ready Phase 6 plan.

Backlog hierarchy

Epics

E1 — Incident and safety controls

E2 — Notification and reminder engine

E3 — Backup and replacement workflow

E4 — Live walk tracking

E5 — Automated Report Cards

E6 — Sitter reliability

E7 — Cancellation and refund improvement

E8 — Admin operations dashboard

User story example

As an assigned sitter,

I want to start a tracking session for a confirmed dog walk,

so the customer can see that the service has begun.

Acceptance criteria

Only the active assigned sitter can start tracking.

Booking must be confirmed.

Payment must be captured.

No cancellation or incident hold may exist.

Only one tracking session may be active.

The start operation must be idempotent.

A timeline and audit event must be created.

Priority model

P0 — Required before higher volume

Incident escalation

Admin alerts

Sitter acknowledgement

Replacement workflow

Payment reconciliation

Tracking privacy controls

P1 — Core reliability improvements

Basic tracking

Automated Report Card

Notification engine

Reliability score

Refund workflow

P2 — Optimisation

Advanced ranking

Rich analytics

Sophisticated repeat offers

Additional dashboard visualisations

Story readiness checklist

A story is ready only when it has:

Problem statement

User/actor

Business rule

Input/output

API impact

Database impact

Authorisation rule

Failure paths

Acceptance criteria

Test cases

Dependencies

Estimate

Owner

Test categories

Every major story should define:

Normal path

Invalid state

Duplicate request

Concurrent action

Provider failure

Permission failure

Security test

Audit verification

Recovery test

OWASP recommends object-level authorisation checks whenever APIs access records through user-supplied identifiers, making security acceptance criteria necessary for every booking, sitter, incident and refund API.

Day 7 output: Development-Ready Sprint Backlog

Recommended fields:

### Table 141

| Field | Purpose |
| --- | --- |
| Story ID | Unique reference |
| Epic | Parent module |
| Priority | P0/P1/P2 |
| User story | Intended value |
| Acceptance criteria | Completion conditions |
| Dependencies | Required preceding work |
| API/database impact | Technical scope |
| Security requirement | Authorisation and privacy |
| Estimate | Relative effort |
| Owner | Responsible developer |
| Test owner | QA responsibility |
| Status | Ready/blocked |

End-of-day acceptance criteria

P0 dependencies are identified.

Database work precedes dependent API work.

Every story is testable.

Security and audit requirements are included.

Provider integrations have failure stories.

Work fits the available development capacity.

No story is labelled “build tracking” without smaller implementable tasks.

9. Final Week 1 deliverables

1. Safety Audit

Contains:

Incident inventory

Near-miss inventory

Root-cause categories

Missing controls

P0/P1/P2 corrective actions

Owners and deadlines

Verification method

2. Reliability Formula

Contains:

Score components

Weights

Source data

Exclusions

Confidence levels

Safety override

Threshold actions

Appeal flow

3. Notification Flow

Contains:

Event catalogue

Recipient map

Channel strategy

Timing

Template codes

Fallbacks

Expiration

Escalations

Suppression rules

4. GPS Scope

Contains:

User flow

Permissions

Tracking states

Sampling assumptions

Point schema

Accuracy handling

Customer status

Failure fallback

Privacy and retention

5. Database Migration Plan

Contains:

ERD

Tables

Constraints

Indexes

Backfills

Migration order

Rollback plan

Access rules

Staging tests

6. Admin Alert Plan

Contains:

### Table 142

| Priority | Example | Required response |
| --- | --- | --- |
| P0 | Lost pet, serious injury | Immediate incident command |
| P1 | No-show, replacement required | Response within minutes |
| P2 | Report overdue, refund failed | Same-shift action |
| P3 | Reliability decline | Review queue |

Every alert should define:

Trigger

Priority

Owner

Delivery channel

Deduplication key

Recommended action

Escalation timeout

Resolution condition

7. Sprint Backlog

Contains:

Epics

Stories

Acceptance criteria

Dependencies

Owners

Estimates

Test plan

Definition of done

10. Week 1 decision gates

Do not begin Week 2 implementation unless these gates pass.

Safety gate

All serious Phase 5 incidents are reviewed.

No critical action lacks an owner.

Incident and emergency flows are approved.

Product gate

Basic tracking scope is frozen.

Advanced GPS features are excluded.

Notification timing and escalation are approved.

Reliability score rules are reproducible.

Technical gate

Database migration order is safe.

API and event names are defined.

Idempotency strategy is documented.

Provider failures have fallbacks.

Security permissions are mapped.

Delivery gate

P0 stories fit the next sprint.

Dependencies are sequenced.

Acceptance tests are written.

No unresolved architectural blocker remains.

11. Common Week 1 mistakes

Mistake 1 — Coding before reviewing incidents

Wrong:

Begin GPS implementation on Day 1

Correct:

Understand Phase 5 failures

→ define controls

→ build only the required tracking scope

Mistake 2 — Creating an unexplained score

Wrong:

Riya = 72

Correct:

Riya = 72

Main cause: punctuality

Excluded: two customer-caused delays

Action: reduce radius and review after 10 bookings

Mistake 3 — Automating every decision

Wrong:

Low score → automatic suspension

Red pet → automatic rejection

Sitter late → automatic replacement

Correct:

System detects and recommends

Authorised person reviews consequential cases

Mistake 4 — Designing notifications as text only

Wrong:

“Send reminder 30 minutes before”

Correct:

Trigger + recipient + template + channel

+ expiry + fallback + suppression + escalation

Mistake 5 — Treating schema changes as only Prisma-model edits

Correct migration planning must include:

Existing production data

Backfill

Compatibility

Constraints

Indexes

Deployment

Failure recovery

Final Week 1 plan

### Table 143

| Day | Primary decision | Final output |
| --- | --- | --- |
| Day 1 | What safety and operational failures must be fixed? | Safety Gap Register |
| Day 2 | How should sitter reliability be measured fairly? | Reliability Model v1 |
| Day 3 | Which booking steps can safely be automated? | Automation Matrix |
| Day 4 | What is included in basic GPS tracking? | GPS Scope Specification |
| Day 5 | Who receives which message and escalation? | Notification and Alert Map |
| Day 6 | How will data structures change safely? | Database Migration Plan |
| Day 7 | What will the development team build next? | Prioritised Sprint Backlog |

Final operating principle

Week 1 should remove ambiguity. By the end of the week, every Phase 6 feature must have a business rule, responsible actor, data model, failure path, security control and measurable acceptance criterion.

Simple explanation for professor

“During the first week of Phase 6, we will not immediately start coding all the new features. We will first study the real problems found during the controlled launch.

On Day 1, we will review incidents, complaints, delays, refunds and near misses to find safety gaps. On Day 2, we will create a fair sitter-reliability formula using punctuality, completion, cancellations, Report Card quality and customer experience. Serious incidents will remain separate from the numerical score.

On Day 3, we will study every stage of the booking process and decide which repetitive steps can be automated. Safety reviews, serious incidents and major refunds will remain human-controlled.

On Day 4, we will finalise the basic GPS scope. It will include start and end locations, periodic location points, approximate distance, signal-loss handling and privacy rules. We will not build a complex Uber-style tracking system yet.

On Day 5, we will define all customer, sitter and admin notifications, including timing, channel, fallback and escalation. On Day 6, we will prepare the new database tables, constraints, indexes, backfills and migration sequence.

Finally, on Day 7, we will convert all approved requirements into a development backlog with priorities, dependencies, acceptance criteria and test cases. The final result will be a build-ready Phase 6 plan with fewer safety, architecture and workflow risks.”

PetSaathi Phase 6 — Week 2 Execution Plan

Booking Reminders, Notifications and Admin Alerts ⏰🐾

Executive decision

Week 2 should build a durable notification and escalation engine, not a collection of direct WhatsApp API calls.

The correct architecture is:

Booking/payment/service event

↓

Database transaction commits

↓

Notification or reminder job recorded

↓

Inngest executes at the required time

↓

Current booking state is revalidated

↓

Primary channel sends message

↓

Delivery result is recorded

↓

Fallback or admin escalation runs when required

Inngest functions are designed for durable background work triggered by events, schedules or webhooks. Their steps persist state and can retry independently after temporary failures. Inngest also supports delayed execution, timezone-aware schedules, cancellation, concurrency and throttling.

Important changes to the original plan

Your seven-day structure is correct, but Week 2 should also include:

Event naming and notification templates

Transactional outbox processing

Idempotency and duplicate protection

Cancellation of obsolete reminders

Delivery-status webhooks

Dynamic sitter acknowledgement deadlines

Notification fallback rules

Alert priority, ownership and deduplication

Provider-outage and stale-message testing

Without these controls, reminders may be delivered twice, sent after cancellation, or fail silently.

Week 2 completion flow

Day 8

Build durable job and event foundation

↓

Day 9

Send booking-confirmation events

↓

Day 10

Implement sitter acknowledgement and reminders

↓

Day 11

Implement customer readiness reminders

↓

Day 12

Implement payment reminders and payment alerts

↓

Day 13

Build admin alert center and escalation rules

↓

Day 14

Test normal, failure, duplicate and cancellation paths

Day 8 — Set up the background job system

Goal

Create the automation foundation on which all reminders, alerts and follow-up workflows will run.

Recommended stack

Use:

Next.js

PostgreSQL

Prisma

Inngest

Notification outbox

Provider adapters

Inngest integrates with Next.js and supports background functions with execution history. Jobs can be triggered by events or scheduled for a future time without keeping a server request open.

Day 8 implementation tasks

1. Create the Inngest client

Suggested structure:

src/

├── inngest/

│ ├── client.ts

│ ├── events.ts

│ └── functions/

│ ├── booking-confirmed.ts

│ ├── booking-reminders.ts

│ ├── payment-reminders.ts

│ ├── sitter-acknowledgement.ts

│ └── admin-alerts.ts

2. Define the event catalogue

Use consistent event names:

booking/confirmed

booking/rescheduled

booking/cancelled

booking/replacement-required

sitter/acknowledgement-requested

sitter/acknowledgement-overdue

sitter/checkin-overdue

service/start-overdue

payment/pending

payment/captured

payment/failed

payment/expired

notification/requested

notification/delivery-failed

report/overdue

incident/opened

Every event should contain:

eventId

bookingId

actorId

eventVersion

occurredAt

correlationId

3. Implement the transactional outbox

Inside the same database transaction:

Update booking/payment status

+

Create status history

+

Create outbox event

↓

Commit

After commit, an outbox dispatcher sends the event to Inngest.

This prevents a valid booking from becoming dependent on WhatsApp, email or Inngest being available at that exact moment.

4. Add idempotency

Use a unique key such as:

BK-1001:CUSTOMER:BOOKING_CONFIRMED:VERSION-4

The same event or retry must not create another message.

5. Configure retries and flow control

Use retries for temporary failures such as:

Network timeout

Provider 5xx response

Temporary database connection issue

Messaging-provider rate limit

Inngest retries failed steps independently. Concurrency limits control how much work runs simultaneously, while throttling controls how many new runs start over a time period.

Suggested controls:

WhatsApp sending:

Throttle according to provider limits

SMS sending:

Concurrency and daily budget control

Payment reconciliation:

One active workflow per payment

Booking reminder flow:

One current flow per booking schedule version

6. Support reminder cancellation

When a booking is cancelled, rescheduled or replaced, outdated jobs must stop.

Inngest supports cancelling active or sleeping functions through events. This is suitable for cancelling reminder workflows when a newer customer action supersedes them.

Example:

booking/cancelled

↓

Cancel:

• customer pre-service reminder

• sitter reminder

• payment-expiry reminder

• service-start check

7. Configure failure visibility

Every function should expose:

Run ID

Booking ID

Current step

Retry count

Last error

Next retry

Final failure

A permanently failed workflow should create an admin alert rather than disappearing.

Day 8 output

Automation foundation

Inngest connected to Next.js

Event catalogue

Outbox dispatcher

Idempotency table

Retry policy

Cancellation rules

Flow controls

Failure dashboard

Local and staging test setup

Day 8 acceptance criteria

A test event reliably starts a background function.

A failed step retries without repeating completed steps.

Duplicate events create only one logical notification.

A cancellation event stops a sleeping reminder.

Jobs contain booking and request correlation IDs.

Permanent failures create an admin-visible record.

Day 9 — Booking confirmation notifications

Goal

Notify the customer and sitter only after the booking is truly confirmed.

Confirmation guard

Send confirmation only when:

booking.status = CONFIRMED

payment.status = CAPTURED

active primary sitter exists

no unresolved safety block exists

Razorpay exposes payment.captured and order.paid events when a payment has been captured and the associated order is paid. It also exposes payment.failed for failed attempts.

Do not trigger confirmation from only the frontend success callback.

Customer confirmation message

Include:

Booking code

Pet name

Service

Date and time

Assigned sitter

Amount paid

Preparation action

Secure booking link

Example:

Bruno’s dog walk is confirmed for 18 August at 7:30 AM with Riya. Your payment has been verified. View preparation instructions in booking BK-1001.

Sitter confirmation message

Include:

Booking code

Service

Time

General locality

Required acknowledgement deadline

Secure assignment link

Do not include the full customer address in lock-screen text.

WhatsApp template treatment

Booking confirmations and service reminders are normally appropriate as utility messages because utility templates are designed for messages sent in response to user actions or requests. WhatsApp template messages must use approved templates when required by the platform’s messaging rules.

Recommended templates:

booking_confirmed_customer

booking_confirmed_sitter

sitter_acknowledgement_required

booking_rescheduled

booking_cancelled

replacement_confirmed

Delivery status

Record:

QUEUED

PROVIDER_ACCEPTED

SENT

DELIVERED

READ

FAILED

EXPIRED

Meta’s WhatsApp webhooks can provide status events for business-sent messages.

Do not equate:

Provider accepted

with:

Customer read the message

Day 9 output

Customer confirmation workflow

Sitter assignment-confirmation workflow

Approved template catalogue

WhatsApp status webhook

Email receipt fallback

In-app booking timeline event

Delivery-status storage

Day 9 acceptance criteria

Confirmation is never sent before captured payment.

Duplicate payment.captured events do not duplicate messages.

Customer and sitter receive different role-appropriate content.

Full addresses and medical data are absent from lock-screen messages.

Delivery and failure statuses appear in the admin dashboard.

Cancellation immediately invalidates the confirmation workflow’s future reminders.

Day 10 — Sitter reminder and acknowledgement system

Goal

Reduce no-shows, forgotten assignments and late arrivals.

Sitter workflow

Booking confirmed

↓

Final acknowledgement requested

↓

Acknowledgement deadline calculated

↓

Two-hour reminder

↓

Thirty-minute travel reminder

↓

Check-in readiness check

↓

Late-start escalation when required

Dynamic acknowledgement deadlines

### Table 144

| Time remaining | Suggested deadline |
| --- | --- |
| More than 24 hours | 30 minutes |
| 2–24 hours | 15 minutes |
| Under 2 hours | 5 minutes |
| Emergency service | Immediate admin confirmation |

Sitter messages

Final acknowledgement

Booking BK-1001 is confirmed. Please acknowledge the assignment within 30 minutes.

Two-hour reminder

Bruno’s walk begins in two hours. Review the handling instructions and confirm your travel plan.

Thirty-minute reminder

Bruno’s walk begins in 30 minutes. Open the assignment and prepare to check in on arrival.

Start overdue

Booking BK-1001 has reached its scheduled start time. Check in or contact PetSaathi support immediately.

Acknowledgement states

PENDING

ACKNOWLEDGED

OVERDUE

ESCALATED

REPLACEMENT_REVIEW

REPLACED

Escalation flow

No acknowledgement by deadline

↓

Send final sitter reminder

↓

Create P1 admin alert

↓

Generate eligible backup candidates

↓

Admin contacts sitter

↓

Replace, reschedule or cancel

Reminder cancellation

Cancel sitter reminders when:

Sitter is removed

Replacement is assigned

Booking is cancelled

Booking is rescheduled

Service already started

A new schedule version should invalidate all jobs belonging to the older schedule.

Day 10 output

Assignment acknowledgement workflow

Dynamic deadlines

Two-hour reminder

Thirty-minute reminder

Start-due validation

Overdue acknowledgement alert

Backup-candidate trigger

Sitter reminder audit history

Day 10 acceptance criteria

A sitter can acknowledge only their own assignment.

Acknowledgement after replacement does not restore the old assignment.

Short-notice bookings use shorter deadlines.

Obsolete sitter reminders never reach a removed sitter.

Missing acknowledgement creates one deduplicated alert.

Provider failure triggers an appropriate fallback.

Day 11 — Customer reminder system

Goal

Prepare the customer and pet before service while reducing avoidable support problems.

Recommended reminder flow

Booking confirmed

↓

Previous-day readiness reminder

↓

One-hour preparation reminder

↓

Sitter arrived event

↓

Service started event

↓

Service completed event

↓

Report Card available event

“Service started” and “service completed” are event notifications, not scheduled reminders.

Previous-day reminder

Purpose:

Confirm pet health

Confirm address/access

Confirm harness, food or keys

Capture changed care instructions

Prevent last-minute service failure

Suggested content:

Bruno’s walk is scheduled for tomorrow at 7:30 AM. Please update PetSaathi if his health, behaviour or access instructions have changed.

One-hour reminder

Bruno’s walk begins in one hour. Please keep his harness ready and ensure the sitter can access the handover location.

Suppression rules

Do not send when:

Booking cancelled

Booking rescheduled

Replacement awaiting approval

Payment no longer valid

Incident hold active

Service already started

Customer opted out of non-essential channel

Channel policy

Suggested order:

WhatsApp

↓

Push or in-app

↓

Email

↓

SMS only for important fallback

For FCM, normal priority may be delayed while an application is backgrounded. High priority is intended for genuinely time-sensitive, user-visible messages. Message TTL should also be limited so an old “service begins in 30 minutes” alert is not delivered after the service ends.

Suggested TTL:

### Table 145

| Message | TTL |
| --- | --- |
| 1-hour reminder | 75 minutes |
| Sitter arrived | 30 minutes |
| Service started | 30 minutes |
| Report ready | 24 hours |
| Review request | Several days |

Day 11 output

Previous-day readiness reminder

One-hour preparation reminder

Service lifecycle notifications

State-based suppression

Customer notification preferences

TTL and priority policy

Customer-visible notification centre

Day 11 acceptance criteria

A cancelled booking sends no preparation reminder.

A rescheduled booking sends only the new schedule’s messages.

Time-sensitive messages expire correctly.

Customer support and emergency links are available.

Sensitive care instructions remain behind authenticated access.

Message frequency remains limited and non-repetitive.

Day 12 — Payment reminder and revenue-protection workflow

Goal

Help customers complete valid pending payments without confirming unpaid bookings or sending misleading messages.

Payment reminder flow

Sitter provisionally accepted

↓

Final amount locked

↓

Razorpay order created

↓

Booking enters PAYMENT_PENDING

↓

Payment reminder scheduled

↓

Payment captured?

┌────────┴────────┐

Yes No

↓ ↓

Cancel reminder Final reminder

Confirm booking ↓

Payment expires

↓

Release provisional sitter

Trigger rules

Payment reminders should be sent only when:

booking.status = PAYMENT_PENDING

payment.status is CREATED/PENDING/FAILED

payment order has not expired

active provisional assignment exists

customer has not cancelled

Payment messages

Initial request

Riya is available for Bruno’s walk. Complete payment to confirm booking BK-1001.

Failed payment

Your payment for BK-1001 was not completed. No booking confirmation has been issued. You can retry securely from your dashboard.

Final reminder

Payment for BK-1001 expires in 15 minutes. The sitter reservation will be released if payment is not completed.

Expired

The payment window for BK-1001 has expired, and the provisional sitter reservation has been released.

Razorpay’s payment.failed webhook can be used to record a failed attempt and notify the customer accurately.

Important controls

Do not:

Confirm a booking because a reminder link was clicked.

Trust a customer-supplied payment status.

Send repeated reminders after captured payment.

Keep a sitter reserved indefinitely.

Expose provider error details that confuse customers.

Reservation timeout

Suggested:

Normal future booking:

15–30-minute payment window

High-demand immediate booking:

5–10-minute payment window

The exact rule should depend on sitter supply and service lead time.

Payment alert types

PAYMENT_REQUIRED

PAYMENT_FAILED

PAYMENT_WINDOW_EXPIRING

PAYMENT_EXPIRED

CAPTURED_NOT_CONFIRMED

AMOUNT_MISMATCH

DUPLICATE_ATTEMPT

CAPTURED_NOT_CONFIRMED is a high-priority reconciliation alert because money has been captured but the expected booking transition did not complete.

Day 12 output

Payment-reminder workflow

Failed-payment notification

Expiry workflow

Reservation release

Captured-but-unconfirmed alert

Razorpay webhook reconciliation

Customer retry action

Payment notification audit history

Day 12 acceptance criteria

A captured payment cancels every pending-payment reminder.

A failed attempt does not mark the booking confirmed.

Duplicate webhooks do not send duplicate confirmation.

An expired order releases the provisional sitter.

Captured payment without booking confirmation creates a P1 alert.

Payment reminder links lead only to secure server-created orders.

Day 13 — Admin alert and notification centre

Goal

Make service and payment risks visible to a named operations owner.

Admin alert priorities

P0 — Critical safety emergency

Examples:

Pet missing

Serious injury

Major privacy exposure

Delivery:

Dashboard

Phone

WhatsApp

P1 — Active booking at risk

Examples:

Sitter acknowledgement overdue

Service not started

No-show suspected

Replacement required

Captured payment not confirmed

Delivery:

Dashboard

WhatsApp or Slack

Human acknowledgement required

P2 — Time-sensitive workflow exception

Examples:

Report Card overdue

Payment expiring

Refund failed

Notification fallback exhausted

Delivery:

Admin notification centre

Email/Slack where appropriate

P3 — Review item

Examples:

Delivery-rate decline

Repeated minor lateness

Invalid push tokens

Template approaching review or expiry

Delivery:

Dashboard review queue

Alert record

Each alert should contain:

Alert ID

Priority

Trigger

Booking/payment/user

First detected time

Last detected time

Assigned owner

Current status

Recommended action

Escalation deadline

Resolution condition

Deduplication key

Alert lifecycle

OPEN

ACKNOWLEDGED

ASSIGNED

INVESTIGATING

MITIGATED

RESOLVED

CLOSED

SUPPRESSED_WITH_REASON

Deduplication

One sitter no-show can generate several symptoms:

No check-in

Service not started

Tracking not started

Customer received no start notification

Create one root alert:

SITTER_NO_SHOW_SUSPECTED

and suppress or group dependent alerts.

Notification centre views

Immediate attention

P0/P1 alerts

Unassigned alerts

Service starts within 30 minutes

Replacement deadlines

Workflow exceptions

Payment failures

Report Cards overdue

Notification delivery failures

Refund failures

Delivery health

WhatsApp failures

SMS fallback usage

Email bounces

Invalid push tokens

Inngest failures

Oldest queued message

SMS backup readiness

When SMS is used in India, entity registration, sender/header registration and approved message templates are required under DLT-provider workflows; the approved template ID must be passed with the SMS request.

Day 13 output

Admin notification centre

P0–P3 priority model

Alert assignment

Acknowledgement and resolution workflow

Root-alert deduplication

Escalation channels

Provider-health view

Alert audit records

Day 13 acceptance criteria

Every P0/P1 alert has a named owner.

Duplicate trigger events do not create duplicate alerts.

Dependent symptoms are grouped under the root incident.

An alert cannot be closed without a reason or resolution condition.

Provider outages remain visible in the dashboard.

Notification failure does not change valid booking state.

Day 14 — Test the complete notification system

Goal

Prove the workflows remain reliable when events are duplicated, delayed, cancelled, rescheduled or delivered out of order.

Test categories

1. Normal booking journey

Payment captured

→ Booking confirmed

→ Customer confirmation

→ Sitter acknowledgement

→ Pre-service reminders

→ Service start update

→ Completion update

Expected:

Exactly one message per logical event

Correct recipient and template

Correct audit history

2. Cancellation

Test cancellation:

Before previous-day reminder

After previous-day reminder

Before one-hour reminder

While a reminder is processing

After service begins

Expected:

Future obsolete reminders stop

Already valid past messages remain in history

Customer receives cancellation confirmation

3. Rescheduling

Test:

7:30 AM booking

→ rescheduled to 9:00 AM

Expected:

Old schedule jobs cancelled

New schedule version created

Only new reminders sent

4. Duplicate events

Simulate:

Duplicate payment.captured

Duplicate booking.confirmed

Repeated WhatsApp status webhook

Worker retry after provider timeout

Expected:

One booking confirmation

One logical notification

Provider attempts may be multiple, but no duplicate customer-visible message

5. Out-of-order payment events

Example:

payment.failed received

then

payment.captured received

Expected:

Latest verified provider state reconciled correctly

No incorrect “payment failed permanently” message

Booking confirmed only after capture validation

6. Provider outage

Test:

WhatsApp unavailable

SMS provider unavailable

Email bounce

FCM invalid token

Inngest delayed

Database temporarily unavailable

Expected:

Retry

→ fallback where appropriate

→ admin alert after exhaustion

7. Sitter acknowledgement

Test:

Acknowledges on time

Acknowledges after deadline

Never acknowledges

Removed before acknowledging

Tries to acknowledge after replacement

8. Payment reminders

Test:

Payment succeeds before first reminder

Payment succeeds after failed attempt

Payment expires

Amount mismatch

Customer opens old payment link

Provisional sitter becomes unavailable

9. Time and scheduling

Test:

Asia/Kolkata timezone

Booking crosses midnight

Reminder generated in UTC but displayed in IST

Booking created after its normal reminder time

Short-notice booking

Server restart or deployment during sleeping workflow

Inngest’s delayed functions pause without holding compute and resume at later timestamps, including across redeployments or server restarts.

10. Channel compliance

Test:

Approved WhatsApp utility template

Rejected template

Missing template variable

DLT SMS template mismatch

Customer opted out of marketing

Critical service notification still follows policy

Sensitive content absent from lock screen

Day 14 test artefacts

Unit test report

Integration test report

End-to-end notification test

Provider webhook fixtures

Duplicate-event test

Rescheduling test

Fallback-channel test

Alert-escalation drill

Open defect list

Launch-readiness decision

Week 2 deliverables

1. Automated reminder engine

Includes:

Event-triggered jobs

Scheduled jobs

Retries

Cancellation

Idempotency

State revalidation

Audit history

2. Booking confirmation alerts

Includes:

Customer confirmation

Sitter final assignment

Delivery tracking

Secure dashboard links

Cancellation and reschedule handling

3. Sitter reminder system

Includes:

Dynamic acknowledgement deadline

Two-hour reminder

Thirty-minute reminder

Late-start detection

Backup-candidate escalation

4. Customer reminder system

Includes:

Previous-day readiness reminder

One-hour preparation reminder

Service lifecycle notifications

Notification preferences

Suppression rules

5. Payment alerts

Includes:

Payment required

Payment failed

Payment expiring

Payment expired

Captured-but-unconfirmed alert

Sitter-reservation release

6. Late-service alerts

Includes:

Acknowledgement overdue

No travel readiness

No check-in

Service start overdue

Replacement required

7. Admin notification centre

Includes:

Priority queues

Named alert owner

Deduplication

Provider-health monitoring

Escalation deadlines

Resolution history

Week 2 success metrics

### Table 146

| Metric | Initial Phase 6 target |
| --- | --- |
| Confirmed bookings creating reminder flow | 99%+ |
| Duplicate customer-visible messages | Below 0.1% |
| Obsolete reminders after cancellation | 0 |
| Sitter acknowledgement before deadline | 90%+ |
| Services starting on time | 95%+ |
| Payment reminders cancelled after capture | 100% |
| Captured-but-unconfirmed alerts detected | 100% |
| P0/P1 alerts assigned to owner | 100% |
| Failed messages retried or escalated | 98%+ |
| Critical notification fallback available | 100% |
| Cross-customer message exposure | 0 |

Week 2 definition of done

Week 2 is complete only when:

Automation

Background jobs survive request completion and deployment.

Every reminder has an idempotency key.

Retry behaviour is visible.

Obsolete reminder flows can be cancelled.

Rate and concurrency controls protect providers.

Booking notifications

Confirmation is triggered only after verified payment.

Customer and sitter receive role-appropriate information.

Delivery events are stored.

Sensitive details remain behind authentication.

Sitter reliability

Final acknowledgement is mandatory.

Missing acknowledgement creates a P1 alert.

Late-start monitoring works.

Replacement candidates can be generated.

Customer experience

Customers receive preparation reminders.

Health and access changes can be reported.

Messages have sensible priority and expiry.

Customers are not spammed after completing an action.

Payments

Failed and captured payments are distinguished.

Payment reminders stop after capture.

Payment expiry releases reservations.

Reconciliation exceptions reach operations.

Admin operations

Alerts have priority, ownership and resolution.

Duplicate alerts are suppressed.

Provider health is visible.

Critical failures support fallback channels.

Testing

Normal and abnormal paths pass.

Duplicate and out-of-order events are safe.

Cancellation and rescheduling tests pass.

Provider outages do not corrupt booking state.

Timezone and short-notice booking tests pass.

Final Week 2 plan

### Table 147

| Day | Primary result |
| --- | --- |
| Day 8 | Durable Inngest and outbox foundation |
| Day 9 | Verified booking-confirmation notifications |
| Day 10 | Sitter acknowledgement and late-start prevention |
| Day 11 | Customer readiness and lifecycle notifications |
| Day 12 | Payment reminders and reconciliation alerts |
| Day 13 | Prioritised admin notification centre |
| Day 14 | Tested, retry-safe and cancellation-safe workflows |

Final operating principle

A reminder system is successful only when the right person receives a timely, accurate and actionable message—and when missing action automatically becomes visible to the correct operations owner.

PetSaathi Phase 6 — Week 3 Execution Plan

Tracking and Automated Report Cards 📍🐕📋

Executive decision

Week 3 should deliver one complete, reliable dog-walk journey:

Confirmed booking

↓

Sitter arrives

↓

Start Walk

↓

Periodic GPS points captured

↓

Private photo/video updates

↓

End Walk

↓

Duration and approximate distance calculated

↓

Report Card draft generated

↓

Sitter completes care observations

↓

Customer receives the final report

The week is not complete merely because coordinates appear on a map. The system must also handle:

Permission denial

Weak GPS accuracy

Temporary loss of internet

Duplicate start/end actions

Incorrect or impossible points

Media upload failure

Early service completion

Tracking that does not stop

Report Card concerns

Customer data privacy

GPS coordinates must always include their accuracy value. The Geolocation specification represents accuracy in metres, so a location should be treated as an estimated area rather than a perfectly exact point.

Week 3 implementation sequence

### Table 148

| Day | Main objective | Final output |
| --- | --- | --- |
| Day 15 | Create tracking data architecture | Tracking database ready |
| Day 16 | Build controlled start/end workflow | Sitter service controls |
| Day 17 | Capture and upload GPS points | Basic route collection |
| Day 18 | Validate route and calculate proof | Duration and distance summary |
| Day 19 | Generate structured Report Card | Automated customer report |
| Day 20 | Secure and optimise media uploads | Private photo/video evidence |
| Day 21 | Test the complete walk journey | Tracking-ready release candidate |

Day 15 — Tracking session database

Goal

Create the database foundation for:

One authorised tracking session per dog-walk booking

Ordered GPS points

Signal-gap detection

Route calculation

Tracking audit history

Report Card generation

Required tables

tracking_sessions

Recommended fields:

id

booking_id

sitter_id

status

started_at

ended_at

start_location

end_location

start_accuracy_metres

end_accuracy_metres

total_distance_metres

accepted_point_count

rejected_point_count

largest_tracking_gap_seconds

fallback_used

failure_reason

permission_mode

created_at

updated_at

version

Recommended states

READY

STARTING

ACTIVE

SIGNAL_WEAK

SIGNAL_LOST

FALLBACK_REQUIRED

COMPLETED

COMPLETED_WITH_GAPS

FAILED

ADMIN_REVIEW_REQUIRED

Important constraints

The database should enforce:

Only one active session per booking

End time cannot precede start time

Distance cannot be negative

Point counts cannot be negative

Booking and sitter must exist

Session belongs to the active assigned sitter

Active-session uniqueness

A partial unique index should prevent two active tracking sessions for the same booking:

CREATE UNIQUE INDEX one_active_tracking_session_per_booking

ON tracking_sessions (booking_id)

WHERE status IN (

'STARTING',

'ACTIVE',

'SIGNAL_WEAK',

'SIGNAL_LOST',

'FALLBACK_REQUIRED'

);

tracking_points

Recommended fields:

id

tracking_session_id

sequence_number

location

accuracy_metres

speed_metres_per_second

heading_degrees

recorded_at_device

received_at_server

device_id

network_state

battery_percentage

validation_status

rejection_reason

created_at

Why two timestamps?

recorded_at_device tells PetSaathi when the position was measured.

received_at_server tells PetSaathi when it reached the backend.

This distinction is essential when the sitter temporarily loses internet and uploads points later.

Point validation states

PENDING

ACCEPTED

LOW_ACCURACY

DUPLICATE

STALE

IMPOSSIBLE_JUMP

OUTSIDE_SESSION

REJECTED

Point uniqueness

UNIQUE (tracking_session_id, sequence_number)

This prevents the same offline point from being inserted repeatedly.

Use PostGIS

Store locations using:

GEOGRAPHY(POINT, 4326)

rather than unrelated decimal columns when possible.

PostGIS can build an ordered LineString from GPS points using ST_MakeLine. Its ST_Length function calculates geography lengths using geodesic calculations and returns the result in metres.

Day 15 output

Prisma migration

PostGIS extension enabled

tracking_sessions

tracking_points

Spatial and operational indexes

One-active-session constraint

Tracking status enums

Seed/test fixtures

Rollback plan

Day 15 acceptance criteria

Two active sessions cannot exist for one booking.

Duplicate sequence numbers are rejected.

Tracking points retain device and server timestamps.

Location accuracy is mandatory.

Invalid distance and time values are blocked.

A session can be linked back to its booking, sitter and Report Card.

Day 16 — Start and end service buttons

Goal

Build the sitter-facing workflow for starting and ending an authorised service.

The buttons must be controlled backend actions, not simple frontend status changes.

Sitter flow

Open assigned booking

↓

Review pet and safety instructions

↓

Confirm arrival

↓

Confirm handover

↓

Start Walk

↓

Tracking becomes active

↓

End Walk

↓

Confirm pet returned safely

↓

Report Card draft opens

Separate arrival from walk start

I Have Arrived and Start Walk should remain separate.

The sitter may need time to:

Enter the society

Meet the customer

Review changed instructions

Attach the harness

Check the pet’s current condition

Resolve an access problem

Arrival time should not automatically count as walking time.

Start Walk validation

When the sitter taps Start Walk, the backend should verify:

User is authenticated

User is the current active sitter

Booking status is CONFIRMED

Payment status is CAPTURED

Service type is DOG_WALKING

Current time is within permitted window

Customer handover is complete

No cancellation exists

No incident hold exists

No other tracking session is active

Required location permission is available

Start transaction

The operation should atomically:

Create tracking session

Record start time and location

Set tracking status to ACTIVE

Set booking status to SERVICE_STARTED

Create booking timeline event

Create audit record

Notify customer

Schedule tracking-overdue checks

If the session is created but the booking update fails, the complete transaction should roll back.

Idempotency

Repeated taps must not create repeated sessions.

Require an idempotency key:

start-walk:{bookingId}:{deviceEventId}

The same key should return the existing successful result.

End Walk validation

Before ending:

Tracking session is active

Caller is the active assigned sitter

Booking has not been cancelled

Minimum service duration is checked

Final position is requested

Pet handover or secure return is confirmed

End transaction

The backend should:

Capture final point

Stop location updates

Record end time

Set tracking session to processing/completed

Calculate duration

Schedule distance calculation

Set booking to SERVICE_COMPLETED

Create Report Card draft

Notify customer

Location requests must stop when the service ends. Android documentation advises removing location updates once they are no longer required, which is important for both battery usage and privacy.

Early completion

If a 30-minute booking ends after eight minutes:

Require a reason

Do not close normally

Create admin alert

Show completion as pending review

Possible reasons:

PET_UNWELL

PET_REFUSED_WALK

CUSTOMER_REQUEST

WEATHER_OR_HEAT

EQUIPMENT_FAILURE

SAFETY_CONCERN

ACCESS_PROBLEM

OTHER

Day 16 output

Arrival button

Start Walk button

End Walk button

Server-side transition guards

Idempotency

Service timeline events

Customer start/completion notifications

Early-completion review path

Day 16 acceptance criteria

The wrong sitter cannot start the service.

A cancelled or unpaid booking cannot start.

Double-tapping does not create duplicate sessions.

End Walk stops tracking.

An early ending requires an explanation.

Every action records actor, timestamp and booking version.

Day 17 — GPS point capture

Goal

Capture enough location evidence to support trust and operations without attempting a perfect real-time Uber-style system.

Recommended Phase 6 approach

Location sample created on device

↓

Stored in local queue

↓

Small ordered batch prepared

↓

Batch sent to tracking API

↓

Server validates session and points

↓

Accepted points stored in PostGIS

↓

Customer status updated periodically

Android location strategy

For a dedicated sitter Android application, use the fused location provider to request regular updates. Android officially supports regular location updates through requestLocationUpdates().

Continuous tracking while the screen is locked or the app is backgrounded must account for Android permission and foreground-service rules. Android distinguishes foreground, background and approximate-location permissions, and background-only applications can receive much less frequent updates.

For an active dog walk:

Use a visible foreground service when required.

Show an ongoing system notification.

Explain that tracking is active.

Stop the foreground service when the walk ends.

Foreground services are designed for user-noticeable ongoing work and display a visible notification to the user.

Proposed sampling starting point

These are pilot assumptions, not universal rules:

Location request:

Approximately every 15–30 seconds

Minimum meaningful movement:

Approximately 10–25 metres

Server upload:

Every 30–60 seconds

or after 3–5 queued points

The final settings should be determined through real-device testing across:

High-rise societies

Open parks

Narrow roads

Weak mobile networks

Budget Android devices

Battery-saving mode

Android recommends balancing update frequency and accuracy against battery consumption and provides location-request controls for this purpose.

Batch API

Use:

POST /api/v1/tracking-sessions/:sessionId/points/batch

Example:

{

"batchId": "BAT-0041",

"points": [

{

"sequenceNumber": 31,

"recordedAt": "2026-08-18T07:40:00+05:30",

"latitude": 23.0308,

"longitude": 72.4661,

"accuracyMetres": 14.2,

"speedMetresPerSecond": 1.4

}

]

}

Offline queue

When the internet is unavailable:

Keep points in encrypted/local app storage

Preserve original timestamps

Retry after connectivity returns

Upload in sequence order

Deduplicate by batch and sequence ID

Delete local copy after confirmed synchronisation

Customer update frequency

Do not send every raw point to the customer.

The dashboard can update:

Latest accepted position

Service status

Approximate elapsed time

Last tracking update

Signal status

every controlled interval.

Day 17 output

Location-permission flow

Foreground-service design

GPS sampling

Local offline queue

Batch upload endpoint

Point validation pipeline

Signal-gap detector

Customer tracking-status read model

Day 17 acceptance criteria

Location is collected only during an active authorised session.

Every point includes accuracy.

Offline points retain their original timestamps.

Duplicate batches are safe.

Tracking continues through temporary network loss.

Customer does not receive raw diagnostic data.

Permission denial activates a clear fallback path.

Day 18 — Duration and distance calculation

Goal

Generate trustworthy approximate walk proof from validated session data.

Duration calculation

Use backend-recorded timestamps:

duration_seconds =

ended_at − started_at

Do not accept a sitter-entered duration.

Display:

Duration: 31 minutes

Store the precise internal value:

duration_seconds: 1864

GPS point validation

Before distance calculation:

Load session points

↓

Sort by device-recorded timestamp

↓

Remove duplicates

↓

Exclude pre-start and post-end points

↓

Evaluate accuracy

↓

Reject impossible jumps

↓

Detect large signal gaps

↓

Build ordered route

Proposed accuracy bands

These are internal pilot thresholds:

### Table 149

| Accuracy radius | Treatment |
| --- | --- |
| 0–30 m | Good |
| 31–75 m | Accept with caution |
| 76–150 m | Low-confidence point |
| Above 150 m | Usually excluded from distance |

Never treat these bands as proof that a point is definitely correct or incorrect.

Impossible movement detection

Compare consecutive points for:

Distance

Time difference

Implied speed

Accuracy values

Example:

Two points are 4 kilometres apart

but only 10 seconds apart

That point should not be counted as normal dog-walking movement.

It should be retained internally as:

IMPOSSIBLE_JUMP

rather than deleted without history.

Route construction

Use accepted, ordered points:

ST_MakeLine(location::geometry ORDER BY recorded_at_device)

ST_MakeLine requires ordered input when constructing a route from a rowset.

Then calculate:

ST_Length(route::geography)

For geography values, PostGIS returns length in metres using geodesic calculations.

Customer wording

Correct:

Approximate distance: 1.4 km

Avoid:

Exact distance: 1.435000 km

GPS drift, signal loss and accuracy limits make false precision misleading.

Tracking outcome

Recommended final states:

COMPLETED

COMPLETED_WITH_GAPS

FALLBACK_VERIFIED

FAILED_REVIEW_REQUIRED

Completed with gaps

Use when:

Service start/end are valid

Most of the route is usable

One or more significant signal gaps occurred

Fallback verified

Use when GPS was not usable, but service evidence includes:

Valid arrival

Start/end events

Timestamped media

Customer handover

Admin review

Day 18 output

Duration calculation

Point filtering

Route construction

Approximate distance calculation

Signal-gap summary

Tracking-completion states

Customer-safe route summary

Admin diagnostic view

Day 18 acceptance criteria

Raw GPS drift is not directly added to distance.

Distance is server-calculated.

Weak and rejected points remain auditable.

Customer sees approximate wording.

A failed GPS session does not automatically accuse the sitter.

Tracking summary is ready for Report Card generation.

Day 19 — Report Card auto-generation

Goal

Automatically create a clean Report Card from system evidence and sitter observations.

Generation flow

Service completed

↓

System creates Report Card draft

↓

Booking and tracking data inserted

↓

Sitter completes structured observations

↓

Server validates required fields

↓

No concern?

├── Yes → Deliver to customer

└── No → Admin/safety review

Automatically populated fields

The system should insert:

Booking code

Pet name

Service type

Sitter name

Scheduled time

Actual start time

Actual end time

Actual duration

Approximate distance

Tracking result

Media count

Arrival/completion evidence

The sitter should not manually retype this information.

Sitter-completed fields

Water update

Pee update

Poop update

Mood

Leash behaviour

Interactions

Care tasks

Safe handover

Concern flag

Sitter note

Structured values

Water

NOT_OFFERED

OFFERED_NOT_DRUNK

DRANK_SMALL_AMOUNT

DRANK_NORMAL_AMOUNT

DRANK_UNUSUAL_AMOUNT

Mood

CALM

HAPPY

PLAYFUL

ENERGETIC

TIRED

ANXIOUS

REACTIVE

UNUSUAL

Leash behaviour

CALM_ON_LEASH

MILD_PULLING

STRONG_PULLING

LUNGED

STARTLED

ATTEMPTED_ESCAPE

REFUSED_TO_WALK

OTHER

These are sitter observations, not veterinary diagnoses.

Report states

AUTO_GENERATED

SITTER_IN_PROGRESS

SUBMITTED

ADMIN_REVIEW_REQUIRED

RETURNED_FOR_CORRECTION

DELIVERED

AMENDED

Concern routing

A concern such as:

Injury

Bite

Escape attempt

Vomiting

Breathing concern

Severe diarrhoea

Unsafe handling

Medication issue

must prevent ordinary automatic delivery where safety review is required.

Concern selected

↓

Report enters ADMIN_REVIEW_REQUIRED

↓

Admin alert created

↓

Incident created when threshold is met

Customer report example

Pet Report Card 🐾

Pet: BrunoService: 30-minute Dog WalkSitter: RiyaDate: 18 August 2026

Started: 7:30 AMCompleted: 8:02 AMDuration: 32 minutesApproximate distance: 1.4 kmTracking: Completed

Water: Drank a small amountPee: OncePoop: NormalMood: Happy and energeticBehaviour: Calm on leash with mild pulling near trafficConcern: None reported

Sitter note:Bruno was energetic and enjoyed the quieter route. He pulled slightly near the main road but settled after moving away from traffic.

Day 19 output

Automatic report-draft function

Service-specific Report Card schema

Structured sitter form

Concern-routing rules

Customer report endpoint

Mobile customer report view

Report versioning

Report delivery notification

Day 19 acceptance criteria

Every completed normal service creates one draft.

Duplicate completion events do not create duplicate reports.

System evidence cannot be casually edited by the sitter.

Required fields depend on service type.

Concern reports enter review.

Delivered reports remain versioned and auditable.

Customer accesses reports only for their own bookings.

Day 20 — Media upload improvement

Goal

Provide private, compressed service photos and videos without overloading the Next.js server.

Recommended upload architecture

Sitter requests signed upload permission

↓

Backend verifies active booking assignment

↓

Backend generates short-lived signature

↓

Device uploads directly to Cloudinary

↓

Cloudinary processes media

↓

Upload completion is verified

↓

PetSaathi stores media reference

↓

Customer receives private access

Cloudinary supports signed uploads, with the signature generated on the server. Its API secret must never be exposed to the client.

Upload restrictions

Recommended initial policy:

Images

JPEG

PNG

WebP

Configured maximum file size

Maximum number per service

Videos

MP4 or approved mobile format

Short duration

Configured maximum size

Maximum number per service

Cloudinary can transform and optimise both images and videos, including resizing, changing formats and reducing delivery size.

Security validation

Validate:

Authenticated sitter

Active assignment

Correct booking

Active or recently completed service

Allowed file type

Allowed file size

Maximum media count

Generated asset identifier

No arbitrary public folder

OWASP recommends allowlisting extensions, checking content types, limiting file size, generating safe filenames, restricting upload permissions and storing uploads away from direct public access.

Media states

UPLOAD_REQUESTED

UPLOADING

PROCESSING

AVAILABLE

FAILED

QUARANTINED

DELETED

Private delivery

Use:

Authenticated assets

Signed or controlled delivery URLs

Short-lived access where practical

Booking ownership checks

Audit records for sensitive access

Cloudinary supports signed delivery controls for private or authenticated assets.

Privacy rules

Service media must not automatically become:

Marketing content

Social-media posts

Public sitter portfolio

Training data

Public testimonials

Separate marketing consent is required.

Day 20 output

Signed upload endpoint

Direct device-to-cloud upload

Format and size restrictions

Compression/transformation presets

Media processing webhook

Private customer delivery

Failed-upload retry

Media audit records

Day 20 acceptance criteria

API secrets never reach the client.

Unassigned sitters cannot upload to a booking.

Invalid formats and oversized files are blocked.

Failed media processing does not lose the Report Card.

Private media cannot be accessed through a permanent public URL.

Customer sees only media from their booking.

Marketing use remains separate from service evidence.

Day 21 — End-to-end dog-walk testing

Goal

Prove that tracking, media, service completion and Report Card generation work together under normal and failure conditions.

Normal-flow test

Booking confirmed

↓

Sitter arrives

↓

Start Walk

↓

GPS batches uploaded

↓

Photo uploaded

↓

End Walk

↓

Duration and distance calculated

↓

Report draft generated

↓

Sitter completes observations

↓

Customer views report

Expected:

One session

One final route summary

One Report Card

Correct customer notification

No remaining active tracking process

Required test groups

1. Authorisation tests

Another sitter tries to start the booking.

Customer calls the tracking-write API.

Removed sitter submits points.

Sitter accesses another customer’s route.

Customer accesses another customer’s Report Card.

Expected:

403 or 404

No state change

Audit/security event where appropriate

2. State tests

Start before payment.

Start cancelled booking.

Start too early.

Double-tap Start Walk.

Double-tap End Walk.

End without active session.

Customer cancellation during walk.

Incident hold during walk.

3. GPS tests

Accurate route.

High-rise GPS drift.

No movement.

Impossible coordinate jump.

Duplicate points.

Out-of-order points.

Approximate location only.

GPS disabled.

Permission revoked.

Tracking gap.

App killed and reopened.

4. Network tests

Internet lost after service start.

Points queue offline.

Media upload fails halfway.

Points synchronise after reconnection.

End Walk occurs offline.

Duplicate offline batch arrives.

5. Distance tests

Normal route.

Stationary GPS drift.

One low-accuracy point.

Large impossible jump.

Only start and end positions.

Route contains a ten-minute gap.

Distance calculation retries.

6. Report Card tests

All fields complete.

Required field missing.

Concern marked.

Concern contradicts “none.”

Tracking failed but fallback evidence exists.

Report generated twice.

Report amended after delivery.

Customer opens old version.

7. Media tests

Valid photo.

Valid short video.

Unsupported file type.

Oversized video.

Fake extension.

Upload from removed sitter.

Signed upload expires.

Media processing delayed.

Private URL shared after expiry.

8. Privacy tests

Tracking continues after End Walk.

Raw coordinates appear in application logs.

Media uses a public permanent URL.

Former sitter accesses route.

Customer sees another pet’s media.

Admin without correct role opens tracking diagnostics.

9. Device matrix

Test at least:

Current Android version

One older supported Android version

Budget Android phone

Mid-range phone

Battery-saver mode

Weak network

High-rise locality

Open outdoor route

Android background and foreground-service behaviour varies by operating-system conditions, making real-device testing necessary rather than relying only on browser or simulator testing.

Day 21 output

End-to-end QA report

GPS accuracy findings

Battery-impact findings

Route-calculation test results

Permission test results

Media security test

Report Card validation test

Open defect list

Release decision

Day 21 acceptance criteria

Start and End Walk work idempotently.

No tracking continues after service completion.

Offline points synchronise without duplication.

Distance ignores major invalid jumps.

Report Card drafts generate reliably.

Concern reports enter review.

Private media remains access-controlled.

Customer views the correct report.

Critical tracking failure creates an admin alert.

Week 3 deliverables

1. Start Walk and End Walk

Includes:

Arrival and handover state

Server-side validation

Idempotent start/end

Service timeline

Tracking shutdown

Early-completion handling

2. Basic GPS route

Includes:

Periodic points

Accuracy values

Offline queue

Batch uploads

Signal-gap detection

Customer-safe route status

3. Automatic duration and distance

Includes:

Backend timestamps

Point validation

Route construction

Approximate geodesic distance

Tracking-quality summary

Fallback state

4. Automated Report Card

Includes:

Automatically populated evidence

Structured sitter observations

Concern workflow

Version history

Customer delivery

Review and repeat-booking actions

5. Media proof

Includes:

Signed uploads

Image/video optimisation

File validation

Private storage

Retry handling

Booking-level access control

6. Customer report view

Shows:

Pet and sitter

Service date

Start and end

Duration

Approximate distance

Water and toilet update

Mood and behaviour

Private media

Sitter note

Concern status

Tracking-quality status

Week 3 success metrics

### Table 150

| Metric | Initial target |
| --- | --- |
| Eligible walks starting tracking | 90%+ |
| Sessions ending correctly | 98%+ |
| Tracking active after completion | 0 |
| Duplicate active sessions | 0 |
| Usable route or fallback evidence | 98%+ |
| Report drafts generated | 99%+ completed walks |
| Reports delivered within SLA | 95%+ |
| Concern reports reviewed | 100% |
| Unauthorised route access | 0 |
| Invalid media publicly accessible | 0 |
| Duplicate Report Cards | Near zero |

Week 3 definition of done

Week 3 is complete only when:

Tracking

Only an assigned sitter can start tracking.

One booking cannot have multiple active sessions.

GPS points include accuracy and timestamps.

Offline capture and later synchronisation work.

Tracking ends automatically and visibly.

Walk proof

Duration comes from server-controlled events.

Distance comes from filtered, ordered points.

The system uses “approximate distance.”

Signal gaps and fallback evidence are recorded.

Tracking failure does not automatically become sitter misconduct.

Report Cards

Drafts are generated automatically.

Sitter observations remain factual and structured.

Safety concerns cannot be silently auto-delivered.

Delivered reports are versioned.

Customers can access only their reports.

Media

Uploads are signed and authorised.

Format and size restrictions work.

Images and videos are optimised.

Media remains private.

Failed uploads have a recovery path.

Testing

Normal, offline and failure flows pass.

Location-permission scenarios pass.

Duplicate requests are safe.

Privacy tests pass.

Open critical defects equal zero.

Final Week 3 operating flow

Sitter arrives

↓

Handover confirmed

↓

Start Walk

↓

Tracking session created

↓

Validated GPS batches stored

↓

Private media uploaded

↓

End Walk

↓

Tracking stopped

↓

Duration and approximate distance calculated

↓

Report Card draft generated

↓

Sitter completes care observations

↓

Concern review where required

↓

Customer receives final Report Card

Final operating principle

Week 3 succeeds when PetSaathi can prove a dog walk through controlled service events, usable location evidence, private media and a clear Report Card—without pretending that GPS is perfectly accurate or allowing tracking to continue beyond the authorised service.

PetSaathi Phase 6 — Week 4 Execution Plan

Backup Sitter System and Reliability Scoring 🛡️📊🐾

Executive decision

Week 4 should deliver two connected but independent systems:

Service-continuity system: finds and assigns a qualified replacement when the primary sitter cannot complete a booking.

Performance-governance system: measures sitter reliability, identifies declining performance and supports coaching or restrictions.

They must not be merged into one rule such as:

Highest score = automatic backup sitter

The correct decision order is:

Service eligibility

↓

Pet and risk-control compatibility

↓

Schedule availability

↓

Travel feasibility

↓

Current workload

↓

Customer preference

↓

Reliability score as ranking support

↓

Admin-controlled final assignment

A sitter with a score of 97 must still be rejected as a backup when they lack the service permission, handling capability, time availability or travel feasibility required by that booking.

Critical corrections to the original Week 4 plan

Your seven-day structure is strong, but four changes are required.

1. Do not create one rigid backup_assignments table

A booking may have:

Several backup candidates

One soft-standby sitter

One hard-standby sitter

A replacement sitter

A previous primary sitter

Several historical offers

Use:

booking_assignments

booking_backup_candidates

replacement_events

backup_offer_events

This preserves the complete assignment history.

2. Do not implement “switch to backup” as a direct status update

Changing a primary sitter is a multi-record transaction. It must:

Lock or version-check the booking

Revalidate the backup

Prevent schedule conflicts

Remove the old active assignment

Create the replacement assignment

Update the booking state

Record history

Notify the customer

Revoke the old sitter’s access

PostgreSQL locking and transactions can coordinate concurrent updates, while Prisma supports optimistic concurrency control through a version field that detects whether a record changed between reading and updating.

3. Separate reliability from safety

Use:

Reliability score: 86

Safety status: CLEAR

or:

Reliability score: 94

Safety status: SAFETY_REVIEW

A serious unresolved incident must override a high score.

4. Rename “sitter risk dashboard”

Use two clearer queues:

Sitter Performance Review

Sitter Safety Review

A low punctuality score is a performance concern; a bite, lost-pet event or unsafe-handling allegation is a safety matter. They need different evidence, permissions and outcomes.

Week 4 execution sequence

### Table 151

| Day | Main objective | Output |
| --- | --- | --- |
| Day 22 | Create continuity data architecture | Backup database ready |
| Day 23 | Generate eligible backup options | Admin candidate tool |
| Day 24 | Execute safe sitter replacement | Recovery workflow |
| Day 25 | Calculate versioned reliability scores | Reliability engine |
| Day 26 | Detect decline and trigger review | Quality-control alerts |
| Day 27 | Build performance and safety dashboard | Admin visibility |
| Day 28 | Test concurrency, failure and fairness | Recovery-ready release |

Day 22 — Backup sitter schema

Goal

Create database structures supporting:

Primary assignments

Multiple backup candidates

Soft and hard standby

Replacement offers

Historical assignments

Sitter-access revocation

Customer approval

Replacement audit history

1. booking_assignments

This table should remain the authoritative assignment record.

booking_assignments

- id

- booking_id

- sitter_id

- role

- status

- service_window

- offered_at

- accepted_at

- assigned_at

- acknowledged_at

- checked_in_at

- service_started_at

- completed_at

- removed_at

- removal_reason

- created_at

- updated_at

Roles

PRIMARY

BACKUP

REPLACEMENT

SUPERVISOR

Assignment statuses

OFFERED

VIEWED

ACCEPTED

ASSIGNED

ACKNOWLEDGED

CHECKED_IN

SERVICE_STARTED

COMPLETED

DECLINED

EXPIRED

REMOVED

NO_SHOW

2. Prevent multiple active primary sitters

Use a partial unique index for active assignment states:

CREATE UNIQUE INDEX one_active_primary_assignment

ON booking_assignments (booking_id)

WHERE role IN ('PRIMARY', 'REPLACEMENT')

AND status IN (

'ASSIGNED',

'ACKNOWLEDGED',

'CHECKED_IN',

'SERVICE_STARTED'

);

PostgreSQL partial indexes contain only rows matching a predicate and can be used as partial unique indexes, allowing uniqueness to be enforced only for active records.

3. Prevent sitter double-booking

Store the protected service interval as:

service_window TSTZRANGE

Then use an exclusion constraint:

ALTER TABLE booking_assignments

ADD CONSTRAINT sitter_no_overlapping_active_assignments

EXCLUDE USING GIST (

sitter_id WITH =,

service_window WITH &&

)

WHERE (

status IN (

'ASSIGNED',

'ACKNOWLEDGED',

'CHECKED_IN',

'SERVICE_STARTED'

)

);

PostgreSQL range types and exclusion constraints are specifically suited to rules such as preventing overlapping reservation periods.

Important standby decision

A hard standby may need to block the sitter’s capacity.

A candidate backup should normally not block their schedule because no firm capacity has been reserved.

4. booking_backup_candidates

booking_backup_candidates

- id

- booking_id

- sitter_id

- coverage_type

- status

- eligibility_snapshot

- estimated_travel_minutes

- reliability_snapshot_id

- eligibility_checked_at

- offer_expires_at

- standby_start_at

- standby_end_at

- standby_compensation_paise

- released_at

- release_reason

- created_at

Coverage types

CANDIDATE

SOFT_STANDBY

HARD_STANDBY

Candidate statuses

IDENTIFIED

ELIGIBILITY_CONFIRMED

OFFERED

ACCEPTED

DECLINED

EXPIRED

UNAVAILABLE

RELEASED

CONVERTED_TO_REPLACEMENT

5. replacement_events

replacement_events

- id

- booking_id

- original_assignment_id

- trigger_code

- triggered_by

- triggered_at

- operations_owner_id

- replacement_deadline_at

- status

- replacement_assignment_id

- customer_approval_status

- customer_approved_at

- resolution_code

- resolved_at

Statuses

OPEN

CANDIDATES_GENERATED

OFFERS_SENT

AWAITING_CUSTOMER_APPROVAL

REPLACEMENT_ASSIGNED

FAILED

CANCELLED

RESOLVED

Trigger codes

PRIMARY_CANCELLED

PRIMARY_NOT_ACKNOWLEDGED

PRIMARY_UNREACHABLE

PRIMARY_LATE

PRIMARY_NO_SHOW

VERIFICATION_INVALID

CUSTOMER_REJECTED_PRIMARY

SAFETY_RESTRICTION

PREVIOUS_BOOKING_OVERRUN

ADMIN_REMOVED_PRIMARY

6. backup_offer_events

backup_offer_events

- id

- replacement_event_id

- sitter_id

- offered_at

- expires_at

- viewed_at

- responded_at

- response

- decline_reason

- eligibility_version

Responses:

ACCEPTED

DECLINED

EXPIRED

WITHDRAWN

INVALIDATED

7. Access revocation

When the primary sitter is removed, revoke access to:

Exact address

Customer phone

Pet medical instructions

Emergency contacts

Tracking session

Media upload

Start-service API

Report Card submission

Every API receiving booking, assignment or sitter IDs must verify both the caller’s function permission and their access to that exact object. OWASP identifies broken object-level and function-level authorisation as major API risks, and recommends deny-by-default access with explicit role grants.

Day 22 output

Assignment schema update

Backup-candidate table

Replacement-event table

Offer-history table

Active-primary uniqueness rule

Schedule-overlap protection

Sitter-access revocation rules

Prisma migrations and rollback plan

Seed data for candidate, standby and replacement scenarios

Day 22 acceptance criteria

One booking cannot have two active primary sitters.

One sitter cannot receive overlapping active assignments.

Several backup candidates can exist.

Candidate, standby and replacement states remain distinct.

Historical primary and replacement assignments are preserved.

Removed sitters lose access immediately.

Financial standby amounts use integer paise.

Day 23 — Backup suggestion logic

Goal

Generate safe, explainable replacement candidates for an administrator.

The system should generate options; it should not automatically assign the highest-ranked person.

1. Hard eligibility filters

A sitter must pass all relevant filters.

Sitter account active

Identity and required verification current

Service permission active

Pet species permitted

Pet size permitted

Service-specific risk controls supported

Required handling or medication skills present

Available for the entire service window

No overlapping assignment

Travel time within limit

Workload capacity available

No active safety restriction

Boarding property approved where applicable

Failing any hard filter means:

NOT_ELIGIBLE

Reliability score cannot override a failed hard filter.

2. Service-specific controls

Do not match using only:

Pet risk = Yellow

Sitter supports Yellow

Match the actual controls.

Example:

Pet: Bruno

Service: Dog walking

Required controls:

- large-dog handling

- strong-pulling experience

- customer handover

- quiet initial route

Eligible backup:

Large-dog approved = Yes

Strong-pulling experience = Yes

Area radius = Valid

Schedule = Available

3. Travel feasibility

Use:

Estimated travel time

Required arrival time

Society-entry buffer

Current or planned sitter location

Transport method

Traffic allowance

A same-city sitter may still be operationally unsuitable.

Example:

Booking begins in 20 minutes

Sitter travel estimate = 35 minutes

Result = NOT_FEASIBLE

4. Capacity and workload

Check:

Bookings completed today

Current active assignment

Following booking

Required recovery or travel time

Maximum daily workload

Hard-standby commitments

Do not overload the most reliable sitter repeatedly.

5. Ranking eligible candidates

Once hard filters pass, rank using a transparent score.

Suggested model:

### Table 152

| Factor | Suggested contribution |
| --- | --- |
| Travel feasibility | 30% |
| Required skill/control match | 25% |
| Reliability score | 20% |
| Current workload | 10% |
| Customer/same-pet history | 10% |
| Standby status | 5% |

This is a candidate ranking, not the sitter’s global reliability score.

6. Candidate explanation

The admin tool should explain why each candidate is recommended.

Example:

Aditi P.

Estimated travel: 12 minutes

Service permission: Dog walking

Large-dog handling: Approved

Strong-pulling experience: Approved

Reliability: 91 · Established

On-time rate: 97%

Current workload: 1 booking today

Previous service with Bruno: No

Also show exclusion reasons:

Meera — unavailable during service window

Kavya — travel time exceeds replacement limit

Riya — safety review active

7. Candidate snapshot

Eligibility may change between suggestion and assignment.

Store:

verification version

reliability snapshot ID

schedule version

pet assessment version

travel estimate timestamp

required controls

At final assignment, recheck live eligibility instead of trusting the earlier snapshot.

Day 23 output

Hard-filter engine

Control-matching rules

Travel-feasibility check

Workload check

Candidate-ranking model

Candidate explanation API

Exclusion-reason catalogue

Admin backup-options screen

Day 23 acceptance criteria

Ineligible sitters never appear as valid candidates.

Reasons are visible for inclusion and exclusion.

Reliability is only one ranking factor.

Stale candidates are marked with an expiry.

Candidate information is revalidated before assignment.

Admins cannot bypass hard filters without elevated permission and a reason.

Day 24 — Switch-to-backup flow

Goal

Replace the primary sitter safely without creating two active sitters, losing booking history or confusing the customer.

Rename the feature:

Replacement workflow

rather than:

Switch to backup

because the process may involve several candidates, offers and customer approval.

1. Replacement start

Primary failure detected

↓

Replacement event created

↓

Booking enters REPLACEMENT_REQUIRED

↓

Old primary start permissions frozen

↓

Candidate pool generated

The original sitter should not be able to start the service while replacement is in progress unless an authorised admin explicitly restores the assignment.

2. Offer strategy

For urgent replacements, offers may be:

Sequential

Offer Candidate 1

Wait 2–3 minutes

Then Candidate 2

Benefits:

Less sitter confusion

Stronger control

Controlled parallel

Offer top 2–3 eligible sitters

First valid acceptance wins

Benefits:

Faster emergency recovery

Risk:

Two sitters may accept simultaneously

Use a transactional lock or optimistic concurrency check so only one replacement assignment succeeds. PostgreSQL supports explicit locking and transaction isolation, while Prisma’s version-field approach allows stale writes to be rejected rather than overwriting newer state.

3. Transactional replacement

The transaction should:

Lock/version-check booking

↓

Confirm replacement event is OPEN

↓

Revalidate chosen sitter

↓

Check schedule conflict again

↓

Remove old active assignment

↓

Create REPLACEMENT assignment

↓

Update booking sitter/readiness state

↓

Add assignment and status history

↓

Create customer/sitter notifications

↓

Commit

Pseudocode:

await prisma.$transaction(async (tx) => {

const booking = await tx.booking.findUniqueOrThrow({

where: { id: bookingId },

});

if (

booking.version !== expectedVersion ||

booking.status !== "REPLACEMENT_REQUIRED"

) {

throw new BookingStateConflictError();

}

await validateReplacementEligibility(tx, {

bookingId,

sitterId,

});

await tx.bookingAssignment.updateMany({

where: {

bookingId,

role: { in: ["PRIMARY", "REPLACEMENT"] },

status: {

in: [

"ASSIGNED",

"ACKNOWLEDGED",

"CHECKED_IN",

],

},

},

data: {

status: "REMOVED",

removedAt: new Date(),

removalReason: triggerCode,

},

});

const replacement = await tx.bookingAssignment.create({

data: {

bookingId,

sitterId,

role: "REPLACEMENT",

status: "ASSIGNED",

serviceWindow,

},

});

const updated = await tx.booking.updateMany({

where: {

id: bookingId,

version: expectedVersion,

status: "REPLACEMENT_REQUIRED",

},

data: {

status: "CONFIRMED",

version: { increment: 1 },

},

});

if (updated.count !== 1) {

throw new BookingStateConflictError();

}

await createAssignmentHistory(tx, replacement);

await createNotificationOutboxEvents(tx, replacement);

});

4. Customer approval

Require customer approval when:

Sitter identity changes after confirmation

Exact home access is involved

The customer has not met the new sitter

Arrival time changes materially

Policy promises approval

Customer choices:

Approve replacement

Choose another time

Request another candidate

Cancel according to policy

For an urgent active-service failure, PetSaathi may need an emergency rule, but the customer must be contacted immediately.

5. Information release

Before assignment, a backup candidate may receive only:

Service type

Approximate locality

Time

Pet type and size

Required handling controls

Proposed payout

After assignment and customer approval, release:

Exact address

Full care instructions

Relevant health information

Emergency contacts

Access instructions

6. Customer messaging

Replacement in progress

Your assigned sitter is no longer available. PetSaathi is reviewing qualified local replacements for booking BK-1001.

Replacement proposed

Aditi is available for Bruno’s walk and can arrive by 7:20 AM. Review the updated sitter profile and approve the replacement.

Replacement confirmed

Aditi is now confirmed for BK-1001. Your existing payment remains linked to the booking, and no additional charge has been made.

Replacement unavailable

We could not find an eligible sitter who could arrive safely and on time. You can reschedule, join the priority waitlist or cancel for the applicable refund.

7. Failure outcomes

REPLACEMENT_ASSIGNED

RESCHEDULED

WAITLISTED

ALTERNATIVE_SERVICE_ACCEPTED

CANCELLED_FULL_REFUND

CANCELLED_POLICY_REFUND

Never assign an unqualified person merely to avoid cancellation.

Day 24 output

Replacement-event creation

Offer workflow

Customer-approval flow

Transactional sitter change

Old-sitter access revocation

Replacement notifications

Reschedule/cancel fallback

Complete assignment audit history

Day 24 acceptance criteria

Two simultaneous acceptances create only one replacement.

Old primary access is revoked.

Replacement is fully revalidated.

Customer receives clear information.

No second charge is created.

Assignment history remains complete.

Failed replacement leads to controlled rescheduling or refund.

Day 25 — Sitter reliability calculation

Goal

Create a reproducible, versioned and explainable reliability engine.

1. Final recommended score

### Table 153

| Component | Weight |
| --- | --- |
| On-time performance | 25% |
| Accepted-booking completion | 20% |
| Avoidable cancellations/no-shows | 10% |
| Report Card timeliness and quality | 15% |
| Adjusted customer experience | 15% |
| Eligible-offer response | 10% |
| Training and policy compliance | 5% |
| Total | 100% |

Safety incidents remain outside the normal weighted score.

2. Required raw events

The engine should calculate from structured performance events.

SERVICE_STARTED_ON_TIME

SERVICE_STARTED_LATE

BOOKING_COMPLETED

SITTER_CAUSED_CANCELLATION

CUSTOMER_CAUSED_CANCELLATION

NO_SHOW

REPORT_SUBMITTED_ON_TIME

REPORT_CORRECTION_REQUIRED

CUSTOMER_RATING_RECEIVED

SAME_SITTER_REQUESTED

OFFER_ACCEPTED

OFFER_DECLINED

OFFER_EXPIRED

TRAINING_EXPIRED

Every event should record:

sitter

booking

event type

event value

occurred at

responsibility status

included/excluded

exclusion reason

3. Measurement window

Recommended:

Operational score: rolling 90 days

Trend: recent 30 days versus previous 60 days

Safety status: reviewed lifetime incidents

This permits improvement after coaching while still preserving serious historical safety findings.

4. Sample-size confidence

### Table 154

| Completed bookings | Confidence |
| --- | --- |
| 0–4 | Onboarding |
| 5–9 | Provisional |
| 10–24 | Limited |
| 25+ | Established |

Do not rank a two-booking sitter above a forty-booking sitter solely because their average rating is marginally higher.

5. Customer-rating adjustment

Use an adjusted rating so very small samples move toward the platform average:

Adjusted rating =

(n / (n + m)) × sitter average

+

(m / (n + m)) × platform average

Where:

n = eligible review count

m = prior-strength value

Platform average is calculated across comparable services

This is a design recommendation to reduce small-sample volatility, not a guarantee of fairness by itself.

6. Score snapshot

Do not overwrite one row.

Create:

sitter_reliability_snapshots

- id

- sitter_id

- calculation_version

- window_start

- window_end

- total_score

- score_level

- confidence_level

- safety_status

- eligible_booking_count

- completed_booking_count

- review_count

- calculated_at

And:

sitter_reliability_components

- snapshot_id

- component_code

- raw_value

- numerator

- denominator

- weight

- subscore

- eligible_count

- excluded_count

- explanation

7. Human oversight

The engine may recommend:

Premium candidate

Normal access

Coaching

Reduced service radius

Manual assignment only

Temporary service restriction

Performance review

It should not independently:

Determine fault for an incident

Permanently remove a sitter

Override service permissions

Close a safety investigation

As a governance pattern, NIST emphasises clearly differentiated human and automated roles, accountability, transparency and appropriate oversight when automated systems contribute to consequential decisions.

8. Reliability levels

### Table 155

| Score/status | Level | Action |
| --- | --- | --- |
| Insufficient evidence | Provisional | Controlled assignments |
| 90–100 | Premium candidate | Priority after compatibility checks |
| 80–89 | Reliable | Normal access |
| 70–79 | Coaching required | Targeted improvement |
| 60–69 | Restricted review | Limited services after review |
| Below 60 | Performance review | Temporary pause may be considered |
| Any score + safety flag | Safety review | Safety process overrides score |

Day 25 output

Performance-event processor

Reliability formula v1

Ninety-day calculation job

Confidence model

Adjusted rating

Versioned snapshots

Safety override

Score explanation endpoint

Historical score endpoint

Day 25 acceptance criteria

The same input data produces the same result.

Excluded events show a reason.

Customer-caused failures do not penalise sitters.

Small samples are labelled.

Old scores remain available.

Safety status is independent.

The sitter can receive an understandable breakdown.

Day 26 — Low-score sitter alerts

Goal

Detect meaningful decline without creating noisy or unfair automatic punishments.

Rename this feature:

Sitter performance alerts

1. Alert triggers

Do not alert only when the total score falls below 70.

Use:

Score crosses below 80

Score crosses below 70

Score falls by 10+ points

On-time rate falls below target

No-show recorded

Avoidable cancellation rate rises

Report quality fails repeatedly

Training expires

Safety incident opens

Verification expires

2. Separate alerts

Performance alert

Examples:

On-time rate decline

Report Card failures

Offer non-response

Repeated avoidable cancellation

Safety alert

Examples:

Serious incident

Unsafe handling

Lost pet

Unauthorised substitution

Privacy breach

Compliance alert

Examples:

Identity verification expired

Training expired

Boarding property approval expired

3. Alert workflow

Threshold crossed

↓

Check sample size

↓

Check data quality

↓

Check responsibility/exclusions

↓

Create review alert

↓

Assign admin owner

↓

Show recommended action

↓

Admin reviews evidence

↓

Coaching/restriction/no action

↓

Review date scheduled

4. Avoid repeated alerts

Use a deduplication key:

sitter_id

+ alert_type

+ score_calculation_version

Do not generate the same “score below 70” alert every night.

5. Targeted action

Punctuality problem

Reduce radius

Add travel buffer

Stop consecutive bookings

Require earlier readiness confirmation

Report problem

Report Card retraining

Mandatory report review

Service-specific checklist

Acceptance problem

First check:

Wrong-area offers

Incorrect availability

Low payout

Notification failure

Unsuitable pet requirements

No-show

Immediate review

Temporary manual assignment

Possible safety or reliability restriction

6. Sitter notification

The sitter should receive:

Current score

Main changed component

Measurement period

Included records

Excluded records

Required action

Review date

Correction or appeal route

Example:

Your current reliability score is 74. The main decline is on-time performance, which decreased to 84% during the last 90 days. Two customer-caused access delays were excluded. Your service radius will be reviewed with operations.

Do not send:

You are a risky sitter.

Day 26 output

Threshold-crossing detector

Trend alerts

Performance/safety/compliance categories

Alert deduplication

Admin assignment

Suggested corrective actions

Sitter explanation

Review and appeal workflow

Day 26 acceptance criteria

One low review cannot trigger automatic suspension.

Small samples do not create high-confidence alerts.

Safety alerts bypass normal score thresholds.

Identical alerts are deduplicated.

Every restriction requires an authorised decision.

Sitters can challenge inaccurate data.

Day 27 — Sitter performance dashboard

Goal

Give authorised administrators a clear view of performance, safety and availability without combining everything into a misleading leaderboard.

1. Dashboard sections

A. Summary

Current reliability score

Confidence level

Safety status

Verification status

Current service permissions

Active restrictions

Last calculation time

B. Component breakdown

On-time performance

Completion rate

Avoidable cancellations

No-show rate

Report Card timeliness

Report quality

Customer experience

Offer response

Training compliance

C. Trend

Show:

Current 30 days

Previous 30 days

Previous 90 days

Highlight meaningful changes.

D. Evidence

Included bookings

Excluded bookings

Cancellation reasons

Delays

Report corrections

Review distribution

Same-sitter requests

E. Safety

Open incidents

Reviewed incident outcomes

Restrictions

Retraining

Appeal state

F. Assignment readiness

Available services

Permitted pet sizes

Risk controls

Service radius

Current workload

Next booking

Backup eligibility

2. Dashboard views

High-performing eligible sitters

Do not display a simple global leaderboard.

Filter by:

Service

Area

Pet type

Handling controls

Current availability

Workload

Performance-review queue

Show:

Score

Confidence

Primary declining factor

Open coaching plan

Review deadline

Safety-review queue

Show:

Incident severity

Current restriction

Assigned reviewer

Next safety action

Expiring compliance

Show:

Verification expiry

Training expiry

Boarding property expiry

3. Access control

Operations admin

May see:

Operational metrics

Assignment readiness

Basic score breakdown

Safety admin

May see:

Incident evidence

Safety restrictions

Serious complaints

Verification admin

May see:

Verification and training status

Finance admin

Should not automatically receive pet incident or detailed performance evidence.

Sitter

May view their own customer-safe breakdown and appeal information.

OWASP recommends object-level checks for every API using resource identifiers and explicit function-level grants for administrative capabilities; putting a route under /admin is not itself an authorisation control.

4. Dashboard actions

Create coaching plan

Reduce service radius

Require retraining

Change service permission

Require manual assignment

Apply temporary restriction

Open safety review

Correct source event

Recalculate score

Review appeal

Sensitive actions require:

Correct admin role

Reason

Effective date

Review date

Audit history

Optional second approval for severe actions

5. Alert design

Alerts should be actionable and based on user-facing operational symptoms rather than creating noise from every internal signal. Google SRE guidance recommends timely, actionable alerts and warns that repeated noisy alerts can overwhelm responders.

Example:

PERFORMANCE REVIEW

Sitter: Riya S.

Score: 72 · Established

Primary issue: On-time rate 84%

Affected bookings: 5 of 31

Safety incidents: None

Suggested actions:

- Reduce service radius

- Add 20-minute travel buffer

- Review after 10 bookings

Day 27 output

Sitter summary dashboard

Score component view

Trend charts

Performance-review queue

Safety-review queue

Compliance-expiry queue

Evidence drill-down

Coaching/restriction actions

Sitter self-view

Day 27 acceptance criteria

Score and safety status are separate.

Confidence/sample size is visible.

Every component can be traced to source events.

Admin permissions are role-specific.

Restrictions show reason and review date.

A sitter can see and challenge their own relevant data.

Customer identities are not unnecessarily exposed in score views.

Day 28 — Failure-case testing

Goal

Prove the backup and reliability systems remain correct when multiple people act simultaneously, data changes, or unusual cases occur.

1. Backup eligibility tests

Same area but travel time too long

Correct area but wrong service permission

Large-dog permission missing

Required medication skill missing

Backup currently assigned elsewhere

Verification expired

Sitter under safety review

Hard standby already committed

Customer’s pet information changed

Expected:

Candidate excluded with an explainable reason

2. Concurrent acceptance tests

Scenario:

Backup A accepts

Backup B accepts milliseconds later

Expected:

One assignment succeeds

Second receives 409 Conflict or offer-invalidated result

Only one customer confirmation

No overlapping active assignment

Both responses appear in history

3. Primary returns during replacement

Scenario:

Primary becomes reachable

after replacement has been assigned

Expected:

Primary cannot start service

Admin may not silently restore them

Customer sees only confirmed replacement

Old assignment remains removed

4. Customer-decision tests

Customer approves replacement

Customer rejects replacement

Customer does not respond

Customer requests a different time

Customer cancels

Urgent active-service replacement

5. No-backup tests

Expected options:

Reschedule

Waitlist

Alternative service

Cancellation and refund

Never assign a sitter who fails hard eligibility.

6. Schedule-concurrency tests

Backup has a new booking after candidate generation

Two admins select the same sitter

Previous booking overruns

Hard standby conflicts with primary assignment

Time window changes during assignment

7. Reliability calculation tests

Perfect performance

One avoidable cancellation

One customer-caused cancellation

One no-show

Missing Report Cards

New sitter with two reviews

Established sitter with forty reviews

Incident marked not sitter-responsible

Incident changed from unreviewed to responsible

Duplicate performance event

Reopened booking

8. Fairness and explanation tests

Excluded event is not counted

Score can be reproduced

Customer-caused delay is removed

Score explanation matches data

Sitter appeal corrects an event

Old snapshots remain unchanged

New score version is created

9. Security tests

Customer attempts replacement API

Sitter assigns themselves as backup

Operations admin tries to close safety review

Another sitter reads performance data

User changes sitter ID in request

Client sends safetyStatus = CLEAR

Client modifies total score

Removed sitter accesses customer instructions

OWASP warns that manipulating object identifiers can expose or alter another user’s resources, and that sensitive business operations must be protected from unauthorised or excessive access.

10. Load and recovery tests

Generate candidates for 100 urgent bookings

Recalculate many sitter scores

Retry failed replacement notification

Database transaction times out

Candidate API called repeatedly

Reliability job runs twice

Admin dashboard loads during recalculation

Apply limits to candidate generation and recalculation endpoints because expensive searches and repeated jobs consume database, CPU and third-party resources. OWASP lists unrestricted resource consumption as a major API risk.

Day 28 output

Backup-flow QA report

Concurrency test results

Score-validation report

Authorisation test report

Failure-recovery drill

Fairness/explanation test

Open defect list

Release decision

Day 28 acceptance criteria

Two active replacements cannot exist.

Schedule overlap is prevented.

Candidate eligibility is rechecked.

Removed sitter access is revoked.

Score calculations are reproducible.

Incident responsibility affects only approved outcomes.

No serious action is taken solely by score.

Critical security tests pass.

No unresolved P0/P1 defects remain.

Week 4 deliverables

1. Backup sitter system

Includes:

Candidate generation

Soft/hard standby

Eligibility snapshots

Replacement events

Offer expiry

Customer approval

Transactional assignment

Access revocation

Failure fallback

2. Reliability score

Includes:

Versioned calculation

Component breakdown

Ninety-day window

Sample-size confidence

Exclusion rules

Adjusted customer rating

Safety override

Historical snapshots

3. Performance and safety dashboard

Replace “sitter risk dashboard” with:

Performance Review dashboard

Safety Review dashboard

Compliance and verification dashboard

4. Admin assignment alerts

Includes:

Primary cancellation

Acknowledgement overdue

Likely late arrival

No-show

Backup candidate unavailable

Replacement deadline approaching

No eligible replacement

Concurrent assignment conflict

Week 4 success metrics

### Table 156

| Metric | Initial target |
| --- | --- |
| Priority bookings with backup coverage | 80%+ |
| Boarding/high-criticality continuity plan | 100% |
| Replacement candidate generation | Under operational SLA |
| Replacement success where eligible supply exists | 80%+ |
| Two active primary/replacement assignments | 0 |
| Sitter double-booking | 0 |
| Removed-sitter unauthorised access | 0 |
| Reliability scores reproducible | 100% |
| Score components traceable | 100% |
| Performance actions with human approval | 100% |
| Duplicate alerts | Near zero |
| Safety restrictions overridden by score | 0 |

Week 4 definition of done

Backup data

Multiple candidates are supported.

Assignment history is preserved.

Active-primary uniqueness is enforced.

Overlapping sitter schedules are blocked.

Candidate eligibility snapshots exist.

Suggestion logic

Hard filters run before ranking.

Service-specific controls are matched.

Travel and workload are considered.

Inclusion and exclusion reasons are explainable.

Eligibility is rechecked during assignment.

Replacement

Replacement is transactional.

Concurrent acceptances are safe.

Customer approval is recorded.

Old-sitter access is revoked.

Failed replacement has controlled alternatives.

Reliability

Score is versioned and reproducible.

Sample-size confidence is visible.

Customer-caused events are excluded.

Safety incidents remain separate.

Sitters receive a correction or appeal path.

Dashboard

Performance, safety and compliance are separated.

Every metric links to source evidence.

Sensitive details are role-restricted.

Actions require reasons and audit records.

Alerts have named owners and deadlines.

Testing

Concurrency tests pass.

Access-control tests pass.

No-backup scenarios work.

Calculation edge cases pass.

No critical defect remains unresolved.

Final Week 4 operating flow

Primary sitter assigned

↓

Backup coverage evaluated

↓

Eligible candidates generated

↓

Primary remains ready?

┌──────────┴──────────┐

Yes No

↓ ↓

Service proceeds Replacement event

↓ ↓

Backup released Candidate revalidation

when appropriate ↓

Offer accepted

↓

Customer approval

↓

Transactional assignment

↓

Service reconfirmed

Parallel performance flow:

Booking and service events

↓

Performance events recorded

↓

Rolling metrics calculated

↓

Reliability snapshot created

↓

Safety status checked separately

↓

Threshold or trend alert

↓

Human review

↓

Coaching, restriction or no action

Final operating principle

Week 4 succeeds when PetSaathi can recover from a primary sitter failure without creating unsafe or duplicate assignments, while using transparent performance data to improve sitter quality without replacing safety review or human judgement.

Simple explanation for professor

“During Week 4, we will develop the backup-sitter and sitter-reliability systems.

First, we will create database tables for primary sitters, backup candidates, standby sitters, replacement offers and assignment history. The database will prevent two active sitters from being assigned to the same booking and will also prevent one sitter from receiving overlapping bookings.

Next, the system will suggest backup sitters using strict eligibility conditions. It will check the sitter’s service permission, pet-handling capability, availability, travel time, workload, verification and safety status. Reliability score will help rank eligible sitters, but it will not override these safety rules.

If the primary sitter becomes unavailable, PetSaathi will open a replacement workflow. The system will recheck the backup, send an offer, obtain customer approval where required and replace the sitter through one secure database transaction. The old sitter will lose access to the customer’s address and pet instructions.

We will also create a sitter-reliability score using punctuality, completed bookings, avoidable cancellations, Report Card quality, customer experience, offer response and training compliance. Serious incidents will remain separate from the numerical score and can place the sitter under safety review.

Finally, the admin dashboard will show performance trends, coaching requirements, open safety reviews and expiring verifications. A low score will create a review alert, but suspension or removal will require an authorised human decision.

The main outcome of Week 4 will be a reliable recovery process that protects customers when a sitter cancels and a transparent quality-control system that helps improve sitter performance.”

PetSaathi Phase 6 — Week 5 Execution Plan

Incident, Refund and Service-Quality Workflows 🚨💳🐾

Executive decision

Week 5 should connect five operational systems:

Safety incident

↓

Customer complaint

↓

Booking/payment controls

↓

Refund or service-recovery decision

↓

Review and quality signals

↓

Corrective action

These systems must share information but remain separate.

For example:

Incident status: INVESTIGATING

Booking status: INCIDENT_HOLD

Refund status: UNDER_REVIEW

Complaint status: OPEN

Review status: MODERATION_REQUIRED

Do not simplify all five into one generic support-ticket status.

The correct Week 5 principle is:

Protect the pet and customer first, preserve evidence, apply policy consistently, move money only after authorised approval, and use complaints to improve the service rather than merely close tickets.

Week 5 execution sequence

### Table 157

| Day | Main objective | Output |
| --- | --- | --- |
| Day 29 | Improve structured incident reporting | Reliable safety data |
| Day 30 | Build severity and escalation workflow | Controlled incident response |
| Day 31 | Create refund-request and approval process | Admin refund workflow |
| Day 32 | Implement versioned cancellation rules | Consistent policy engine |
| Day 33 | Build customer complaint dashboard | Support command centre |
| Day 34 | Connect reviews to quality workflows | Actionable service data |
| Day 35 | Test all safety and financial paths | QA-tested release candidate |

Day 29 — Incident form improvements

Goal

Replace one unstructured incident-description box with a guided safety-reporting flow.

The form should help the reporter communicate facts without asking them to diagnose the pet or decide who is responsible.

1. Incident entry points

An incident may be reported through:

Customer booking page

Sitter active-service screen

Admin booking screen

Emergency support workflow

Automated service alert

Report Card concern flag

During an active service, show two distinct actions:

Report a concern

Emergency help

An emergency action should display the support phone number and immediate instructions rather than relying only on a submitted form.

2. Reporter-specific forms

Customer form

Ask:

What happened?

Is the pet or any person currently unsafe?

When did it happen?

Is the sitter still present?

Was veterinary help contacted?

Do you have relevant photographs or videos?

What immediate help is required?

Sitter form

Ask:

What did you observe?

What was the pet doing immediately before the event?

Were care instructions being followed?

What immediate action was taken?

Was the owner contacted?

Was a veterinarian or emergency clinic contacted?

Is the service continuing or stopped?

Is backup help required?

Admin form

Allow:

Linking existing support messages

Linking tracking and Report Card evidence

Assigning an initial triage level

Assigning an incident owner

Applying temporary booking or payout controls

3. Structured incident categories

Use a controlled category and subtype.

Pet health

VOMITING

DIARRHOEA

LIMPING

INJURY

BREATHING_CONCERN

SEIZURE_ACTIVITY

HEAT_RELATED_CONCERN

UNUSUAL_LETHARGY

REFUSED_FOOD_OR_WATER

OTHER_HEALTH_CONCERN

Pet behaviour

GROWLING

SNAPPING

BITE_ATTEMPT

BITE

ESCAPE_ATTEMPT

PET_MISSING

RESOURCE_GUARDING

SEVERE_ANXIETY

OTHER_BEHAVIOUR_CONCERN

Sitter performance or conduct

LATE_ARRIVAL

NO_SHOW

UNSAFE_HANDLING

INSTRUCTIONS_NOT_FOLLOWED

UNAUTHORISED_SUBSTITUTE

SERVICE_EVIDENCE_MISSING

POOR_COMMUNICATION

OTHER_SITTER_ISSUE

Customer or property issue

INCORRECT_INSTRUCTIONS

MISSING_SAFETY_INFORMATION

CUSTOMER_UNREACHABLE

ACCESS_DENIED

PROPERTY_DAMAGE

MISSING_ITEM

UNSAFE_PROPERTY_CONDITION

Technical, payment or privacy issue

TRACKING_FAILURE

MEDIA_EXPOSURE

WRONG_CUSTOMER_DATA

DUPLICATE_PAYMENT

REFUND_FAILURE

ACCOUNT_ACCESS_CONCERN

4. Immediate-danger questions

Ask a small triage set before the full form:

Is the pet missing?

Is anyone seriously injured?

Is the pet having difficulty breathing?

Is there serious bleeding?

Is the pet unconscious or having a seizure?

Is the pet in traffic, extreme heat or another immediate danger?

These are routing questions, not medical diagnosis.

If any answer indicates immediate danger:

incident.initial_priority = CRITICAL

incident.status = ACTIVE_EMERGENCY

and the interface should instruct the reporter to call emergency support.

5. Preserve the original report

Store:

original_description

submitted_category

submitted_at

submitted_by

source_channel

Do not let an admin silently replace the original statement.

A separate field may contain the current operational summary:

current_summary

This prevents the reporter’s wording from being lost while still allowing administrators to maintain a concise incident overview.

6. Evidence uploads

Allow:

Photos

Short videos

Veterinary records

Screenshots

Audio or call-summary references where lawful and operationally appropriate

Evidence should be private and role-controlled.

Avoid one generic response that returns the entire incident database record to every user. OWASP warns that object-level and property-level authorisation failures can expose another user’s records or sensitive internal fields.

Customer-visible fields

Incident code

Current customer-facing status

Latest approved update

Actions required from customer

Resolution summary

Internal-only fields

Unverified allegations

Sitter-performance recommendation

Internal legal notes

Security investigation

Raw admin discussion

Other customers’ information

Day 29 output

Customer incident form

Sitter incident form

Emergency triage

Structured category and subtype

Evidence-upload flow

Original-report preservation

Booking and Report Card linkage

Role-filtered incident API responses

Day 29 acceptance criteria

A report can be submitted in fewer than two minutes.

Critical answers create immediate escalation.

The reporter cannot set final responsibility or resolution.

Original descriptions remain unchanged.

Evidence is private and access-controlled.

Customer, sitter and admin responses expose different fields.

Duplicate submissions are linked or deduplicated safely.

Day 30 — Incident severity and escalation workflow

Goal

Create a controlled state machine for triage, containment, investigation and closure.

Google’s incident-management guidance emphasises timely alerts, actionable response, clear ownership and learning after the event. Its postmortem guidance recommends factual, blameless analysis focused on root causes and corrective actions rather than individual blame.

1. Severity model

Level 1 — Minor concern

Examples:

Slight delay

Missing Report Card field

Mild communication problem

Temporary tracking issue with alternative proof

Pet briefly cautious but settled

Response:

Record

Notify operations

Correct issue

Monitor recurrence

Level 2 — Material incident

Examples:

Repeated vomiting

Escape attempt

Significant lateness

Property damage

Medication task not completed

Possible unsafe handling

Missing service proof

Customer supplied materially incorrect instructions

Response:

Named incident owner

Customer contact

Service decision

Evidence preservation

Vet or backup engagement where relevant

Possible payment/payout hold

Level 3 — Critical emergency

Examples:

Pet missing

Serious bite

Major injury

Breathing difficulty

Seizure or collapse

Major privacy breach

Deliberate service falsification creating danger

Response:

Immediate incident command

Phone escalation

Customer contact

Emergency or veterinary coordination

Booking and payout controls

Frequent status updates

2. Incident status model

Use:

REPORTED

TRIAGE_REQUIRED

ACTIVE

CONTAINMENT_IN_PROGRESS

CONTAINED

MONITORING

INVESTIGATING

CUSTOMER_FOLLOWUP

CORRECTIVE_ACTION_PENDING

RESOLVED

CLOSED

REOPENED

Contained

The immediate danger or disruption is controlled.

Resolved

An operational outcome has been decided.

Closed

Customer follow-up, evidence, documentation and corrective actions are complete or formally assigned.

Do not jump directly:

REPORTED → CLOSED

3. Escalation roles

For Level 2 and Level 3 incidents, assign:

### Table 158

| Role | Responsibility |
| --- | --- |
| Incident owner | Accountable for completion |
| Incident commander | Coordinates critical response |
| Operations lead | Booking, sitter and backup actions |
| Communications owner | Customer and stakeholder updates |
| Safety reviewer | Behaviour, medical and handling review |
| Finance owner | Refund, credit and payout decisions |
| Technical owner | Application, tracking or access failure |

In a small Phase 6 team, one person may hold multiple roles, but ownership must still be explicit.

4. Automatic controls

Depending on severity and category, the system may recommend or apply:

booking_status = INCIDENT_HOLD

payout_status = ON_HOLD

refund_status = UNDER_REVIEW

pet_profile_status = REASSESSMENT_REQUIRED

sitter_status = SAFETY_REVIEW

tracking_access = RESTRICTED

These remain independent states.

A payout hold means “do not release funds before review”; it does not prove the sitter is responsible.

5. Escalation timers

Recommended internal targets:

### Table 159

| Severity | Initial acknowledgement | Customer contact |
| --- | --- | --- |
| Level 1 | Within 15 minutes during service hours | As appropriate |
| Level 2 | Within 5 minutes | Within 10 minutes |
| Level 3 | Immediate | Immediate |

These are PetSaathi operational targets, not statutory deadlines.

6. Incident timeline

Every action should create an append-only or strongly audited timeline event:

INCIDENT_REPORTED

SEVERITY_ASSIGNED

SEVERITY_CHANGED

CUSTOMER_CONTACTED

VET_CONTACTED

SERVICE_STOPPED

BACKUP_REQUESTED

PET_FOUND

REFUND_REVIEW_STARTED

INCIDENT_CONTAINED

INVESTIGATION_COMPLETED

CORRECTIVE_ACTION_CREATED

INCIDENT_RESOLVED

Avoid one editable admin_notes field as the only record.

7. Post-incident review

Require a formal review for:

Every Level 3 incident

Lost pet

Bite or significant injury

Major medication error

Serious privacy event

Repeated Level 2 incident

System failure affecting several bookings

The review should contain:

Summary

Impact

Timeline

Detection

Immediate response

Contributing factors

Root cause

What worked

What failed

Corrective actions

Owners

Deadlines

Verification method

Google’s postmortem model treats the postmortem as a record of impact, mitigation, root causes and follow-up actions, while recommending a consistent format to support trend analysis.

Day 30 output

Severity rules

Incident state machine

Escalation timers

Incident-command roles

Booking and payout hold integration

Incident timeline

Customer-update templates

Post-incident review template

Day 30 acceptance criteria

Critical reports notify the responsible team immediately.

Every Level 2/3 incident has a named owner.

Severity changes preserve history.

Invalid status transitions are rejected.

The customer receives periodic approved updates.

Resolution does not erase original evidence.

Every serious incident produces corrective actions.

Day 31 — Refund-request module

Goal

Create an admin-controlled refund workflow that separates customer requests, internal approval and Razorpay processing.

1. Refund lifecycle

Customer/admin requests refund

↓

Refund request created

↓

Payment and refundable balance validated

↓

Policy recommendation generated

↓

Admin or finance approval

↓

Razorpay refund submitted

↓

Webhook confirms final result

↓

Customer notified

↓

Finance reconciliation

2. Refund statuses

Use:

REQUESTED

UNDER_REVIEW

APPROVED

REJECTED

PROCESSING

PROCESSED

PARTIALLY_PROCESSED

FAILED

CANCELLED

Do not set:

REFUNDED

when an administrator merely approves the refund.

Razorpay documents separate refund events for creation, successful processing and failure, and recommends the processed webhook as the reliable final status signal.

3. Refund request fields

id

booking_id

payment_id

cancellation_id

incident_id

requested_by

requested_amount_paise

recommended_amount_paise

approved_amount_paise

currency

reason_code

customer_explanation

internal_reason

policy_version

status

approved_by

approved_at

provider

provider_refund_id

idempotency_key

created_at

processed_at

failure_code

Store money in integer paise:

₹149 = 14900

4. Refund guards

Before approval:

Payment must be captured

Booking must belong to the customer

Refundable balance must exist

Requested amount must not exceed balance

No duplicate active request

Policy version must be known

Approval role must be authorised

Calculate:

Available refundable balance =

Captured amount

− processed refunds

− refunds currently processing

5. Idempotency

Every Razorpay refund submission should use a stable idempotency key.

Razorpay supports idempotent normal and instant refund requests, allowing the same request to be retried without creating another refund.

Example:

refund_BK1001_RFR0042_14900

The application should also reject reuse of the same key with a different amount or request body.

6. Provider status

Use Razorpay’s webhook events:

refund.created

refund.processed

refund.failed

refund.speed_changed

The webhook handler should:

Validate the signature

Store provider event ID

Deduplicate repeated events

Update the internal refund

Notify customer only with accurate language

Create an admin alert on failure

Razorpay notes that normal refunds may take several business days to appear depending on the bank and payment mode; PetSaathi should therefore distinguish “processed by provider” from “visible in the customer’s account.”

7. Customer wording

Under review

Your refund request has been received and is being reviewed.

Approved

Your refund of ₹149 has been approved and will now be submitted to the payment provider.

Processing

Your refund has been initiated. We will update this booking when processing is confirmed.

Processed

Razorpay has processed your refund. Your bank or payment provider may require additional time to display it.

Failed

The payment provider could not process the refund. PetSaathi’s finance team has been notified.

Day 31 output

Customer refund-request form

Admin refund queue

Approval/rejection actions

Refundable-balance calculation

Razorpay refund submission

Webhook reconciliation

Failure retry/escalation

Customer refund-status view

Complete financial audit history

Day 31 acceptance criteria

Only captured payments can be refunded.

Refunds cannot exceed the remaining balance.

Duplicate submissions do not move money twice.

Admin approval and provider completion remain separate.

A provider failure creates a finance alert.

The customer can see amount, status and reference.

Every override includes a reason.

Day 32 — Cancellation rule engine

Goal

Apply consistent cancellation recommendations while retaining authorised human review for exceptional cases.

The proposed time windows are business-policy choices, not universal legal requirements. The policy must be displayed clearly before purchase and linked to the booking’s stored policy version.

India’s Consumer Protection (E-Commerce) Rules require clear consumer information and state that cancellation charges should not be imposed on consumers unless similar charges are also borne by the e-commerce entity when it cancels unilaterally.

1. Recommended policy structure

Dog walking and ordinary pet sitting

### Table 160

| Time before service | Default recommendation |
| --- | --- |
| 12+ hours | Full refund |
| 3–12 hours | Partial refund |
| Under 3 hours | Manual review |
| After sitter arrival | Manual review with sitter compensation |
| After service start | Incident/service-adjustment workflow |

Boarding

Use a separate policy because hosts reserve capacity for longer periods.

Possible initial windows:

### Table 161

| Time before check-in | Default recommendation |
| --- | --- |
| 72+ hours | Full or substantial refund |
| 24–72 hours | Partial refund |
| Under 24 hours | Manual review |
| Host/platform cancellation | Full refund plus recovery support |

These percentages and windows should be approved by PetSaathi’s business and legal advisers before production.

2. Policy inputs

The rule engine should consider:

Service type

Scheduled start

Cancellation timestamp

Cancellation actor

Cancellation reason

Payment amount

Sitter travel state

Sitter arrival state

Service start state

Replacement availability

Incident linkage

Customer emergency exception

Applicable policy version

3. Policy outputs

The engine recommends:

Customer refundable amount

Customer credit option

Sitter compensation

Platform-retained amount

Replacement attempt required?

Approval level

Required evidence

Explanation code

The engine should not directly submit a Razorpay refund.

4. Cancellation actors

Customer cancellation

Possible outcomes:

FULL_REFUND

PARTIAL_REFUND

CREDIT_OPTION

RESCHEDULE

NO_REFUND_AFTER_REVIEW

Sitter cancellation

REPLACEMENT_REQUIRED

FULL_REFUND_IF_REPLACEMENT_FAILS

SERVICE_RECOVERY_CREDIT

SITTER_RELIABILITY_EVENT

Platform cancellation

FULL_REFUND

OPTIONAL_GOODWILL_CREDIT

SITTER_COMPENSATION_REVIEW

Safety cancellation

MANUAL_REVIEW

PET_REASSESSMENT

ALTERNATIVE_SERVICE

VETERINARY_CLEARANCE_REQUIRED

5. Policy versioning

Store on every confirmed booking:

cancellation_policy_version

Example:

CANCEL-WALK-2026-01

Never apply a later, less favourable policy to an already confirmed booking.

6. Consumer experience

Before the customer confirms cancellation, show:

Original amount: ₹299

Estimated refund: ₹199

Cancellation deduction: ₹100

Sitter compensation impact: handled by PetSaathi

Refund method: original payment method

Do not:

Hide the cancellation control

Preselect service credit

Make cancellation substantially harder than booking

Show a fake urgency timer

Describe credit as a cash refund

India’s dark-pattern guidelines identify manipulative designs, including subscription and cancellation traps, as consumer-protection concerns.

Day 32 output

Policy-version table

Service-specific rules

Cancellation recommendation engine

Sitter compensation recommendation

Exception handling

Customer outcome preview

Admin override with reason

Cancellation audit history

Day 32 acceptance criteria

Identical cases produce identical recommendations.

Service-specific policies are supported.

Policies cannot change retroactively.

Customer, sitter and platform cancellations are separated.

Credit is not silently substituted for cash.

Exceptional cases require review.

All financial actions remain admin-controlled in Phase 6.

Day 33 — Customer complaint dashboard

Goal

Give support staff one place to acknowledge, investigate, resolve and learn from customer complaints.

1. Complaint versus incident

Not every complaint is an incident.

Complaint

Examples:

Sitter communication was weak

Customer disliked the Report Card

Refund explanation was unclear

Customer expected another service

Incident

Examples:

Pet injury

Bite

Lost pet

Unsafe handling

Serious privacy issue

A complaint may be escalated into an incident, but both records should remain linked.

2. Complaint categories

BOOKING

SITTER

PAYMENT

REFUND

REPORT_CARD

COMMUNICATION

SERVICE_QUALITY

PROPERTY

PRIVACY

SAFETY

OTHER

3. Complaint states

NEW

ACKNOWLEDGED

ASSIGNED

CUSTOMER_RESPONSE_REQUIRED

SITTER_RESPONSE_REQUIRED

INVESTIGATING

ESCALATED_TO_INCIDENT

RESOLUTION_PROPOSED

RESOLVED

CLOSED

REOPENED

4. Required fields

id

public_code

customer_id

booking_id

sitter_id

incident_id

category

priority

subject

original_description

current_summary

status

assigned_to

first_response_at

resolution_due_at

resolution_code

resolved_at

closed_at

5. Grievance service levels

PetSaathi may set faster internal targets, but the customer grievance system should at minimum support the formal e-commerce grievance obligations.

Official consumer information states that an e-commerce entity should acknowledge a consumer grievance within 48 hours and redress it within one month.

Recommended PetSaathi operational targets:

### Table 162

| Complaint type | Initial response |
| --- | --- |
| Active-service safety issue | Under 5 minutes |
| Active booking problem | Under 10 minutes |
| Payment problem | Under 1 hour |
| Refund/cancellation question | Same day |
| General service complaint | Same day |

These targets are internal and should be monitored separately from statutory deadlines.

6. Dashboard layout

Immediate attention

Active-service complaints

Safety complaints

Customer awaiting urgent response

Complaint nearing SLA breach

Unassigned complaint

Investigation queue

Waiting for sitter response

Waiting for customer evidence

Payment/refund verification

Report Card dispute

Repeat sitter complaint

Resolution queue

Refund proposed

Credit proposed

Apology/rebooking proposed

Coaching action required

Incident follow-up required

7. Customer history

Show only relevant context:

Previous completed bookings

Prior complaints

Previous refunds

Favourite sitters

Current open bookings

Communication preference

Avoid displaying unnecessary medical, identity or financial fields to ordinary support users. OWASP recommends explicit object and property-level authorisation rather than returning full backend objects and filtering only in the frontend.

8. Resolution codes

EXPLANATION_PROVIDED

BOOKING_RESCHEDULED

REPLACEMENT_ASSIGNED

FULL_REFUND

PARTIAL_REFUND

SERVICE_CREDIT

SITTER_COACHING

REPORT_CORRECTED

PET_REASSESSMENT

SAFETY_REVIEW_OPENED

NO_POLICY_BREACH_FOUND

CUSTOMER_WITHDREW

Resolution should include:

Customer-facing explanation

Internal finding

Financial remedy

Operational action

Preventive action

9. Reopening

Allow reopening when:

Customer reports that the promised remedy did not occur

Refund failed

New evidence appears

Repeat issue occurs

Customer disputes the resolution

Preserve the original resolution and create a reopening event.

Day 33 output

Complaint intake

Complaint dashboard

Priority and ownership

SLA timers

Customer/sitter response requests

Complaint-to-incident escalation

Resolution catalogue

Reopen workflow

Customer-facing complaint-status page

Day 33 acceptance criteria

Every complaint receives a public code.

Every urgent complaint has an owner.

Complaint and incident records are not confused.

Acknowledgement and resolution deadlines are visible.

Refund and incident information is linked safely.

Ordinary support users see only required data.

Customer can see status without internal allegations.

Day 34 — Review and rating triggers

Goal

Convert verified service feedback into quality signals without allowing one review to automatically punish a sitter.

1. Eligibility

A review may be created only when:

Booking belongs to customer

Service completed

Report Card delivered or authorised exception exists

Booking has not already received a final customer review

Review should not be enabled for:

Requested booking

Cancelled pre-service booking

Unpaid request

Service never started

Unrelated customer

2. Review workflow

Service completed

↓

Report Card delivered

↓

Review status becomes PENDING

↓

Customer submits rating or skips

↓

Quality rules evaluate response

↓

Normal publication or support escalation

The booking can close while the review remains pending.

3. Structured ratings

Collect:

### Table 163

| Item | Scale |
| --- | --- |
| Punctuality | 1–5 / not observed |
| Communication | 1–5 / not observed |
| Pet handling | 1–5 / not observed |
| Instructions followed | 1–5 / not observed |
| Report Card quality | 1–5 / not observed |
| Overall experience | 1–5 |
| Would book again? | Yes / no / unsure |

Also offer:

Public review

Private feedback

Report a safety concern

Do not require the customer to publish a complaint publicly to receive support.

4. Rating triggers

Rating 4–5

Thank customer

Update rating metrics

Allow normal moderation/publication

Show same-sitter repeat action

Rating 3

Ask what could improve

Create quality-review item when structured fields are weak

Do not aggressively promote a large prepaid plan

Rating 1–2

Create quality alert

Suppress automated repeat promotion

Invite private support contact

Link complaint workflow

Review sitter and booking evidence

Safety concern selected

Create incident triage

Do not publish sensitive allegation automatically

Notify safety team

Preserve booking evidence

5. Review moderation

Moderate for:

Personal phone/address disclosure

Threats or harassment

Discriminatory content

Unverified medical claims

Unrelated commercial promotion

Sensitive incident information

Moderation should not remove legitimate negative feedback simply because it is commercially uncomfortable.

6. Score integration

A submitted review should create performance events, but:

One rating should not automatically suspend a sitter.

Small sample sizes should remain visible.

A review linked to an active dispute may be held from scoring until investigation.

Structured service fields should carry more operational value than vague text alone.

Serious safety claims should use the incident workflow.

7. Review status

NOT_ELIGIBLE

PENDING

SUBMITTED

SKIPPED

MODERATION_REQUIRED

PUBLISHED

WITHHELD_FOR_SAFETY

AMENDED

REMOVED_WITH_REASON

Day 34 output

Review eligibility trigger

Review form

Public/private feedback split

Low-rating quality alert

Safety-concern incident linkage

Moderation queue

Reliability-score event

Repeat-offer suppression rules

Day 34 acceptance criteria

Only completed eligible bookings can be reviewed.

One booking receives one active final review.

Customer can submit private feedback.

Low ratings create support action, not automatic punishment.

Safety concerns reach incident triage.

Sensitive data is not published.

Review changes are audited.

Day 35 — Full QA testing

Goal

Prove that safety, complaint, cancellation and refund flows remain consistent under ordinary, exceptional and adversarial conditions.

1. Incident tests

Customer reports minor concern

Sitter reports serious health issue

Pet missing

Duplicate report from customer and sitter

Severity increases

Severity decreases with reason

Customer unreachable

Incident owner unavailable

Incident reopened

Evidence upload fails

Incident linked to Report Card concern

Expected:

Correct severity recommendation

Named owner

Controlled transitions

Evidence preservation

Correct customer communication

2. Complaint tests

General complaint

Active-service complaint

Refund complaint

Complaint escalated to incident

Complaint reassigned

SLA approaching breach

Complaint reopened

Customer attempts to view another complaint

Ordinary support user opens restricted safety evidence

3. Cancellation-rule tests

Test boundaries:

Exactly 12 hours before

Just below 12 hours

Exactly 3 hours before

Just below 3 hours

After sitter arrival

After service start

Also test:

Customer medical emergency

Sitter cancellation

Platform failure

Boarding policy

Rescheduled booking

Policy changed after payment

Timezone conversion

Duplicate cancellation request

Expected:

Correct stored policy version

Correct recommendation

No retrospective policy change

Manual review where required

4. Refund tests

Full refund

Partial refund

Two partial refunds

Amount above remaining balance

Payment not captured

Duplicate approval

Razorpay timeout

Duplicate webhook

Out-of-order webhook

refund.failed

Retry using same idempotency key

Credit plus cash refund

Refund linked to incident

Expected:

No duplicate money movement

Correct final state

Accurate customer message

Full audit history

5. Review tests

Five-star review

Three-star feedback

One-star complaint

Safety concern

Duplicate submission

Review for cancelled booking

Another customer tries to review

Private feedback

Sensitive information in comment

Review amended after moderation

6. Concurrency tests

Simulate:

Customer cancels while service starts

Admin approves refund while incident opens

Two admins approve the same refund

Complaint is resolved while customer reopens it

Review submitted while booking is reopened

Sitter payout processes while payout hold is applied

Expected:

Stale operations return a conflict

Money does not move twice

Incident holds take priority

History remains complete

7. Security tests

Every endpoint using booking, incident, complaint, review or refund IDs must verify ownership and role.

OWASP identifies manipulated object IDs and unauthorised access to sensitive object properties or administrative functions as core API risks.

Test:

Customer accesses another incident

Sitter reads unrelated complaint

Support admin approves refund

Finance admin edits incident responsibility

Client sends refund.status = PROCESSED

Client changes incident severity

Customer changes approved refund amount

API returns internal admin notes

User enumerates sequential complaint IDs

8. Audit tests

Confirm audit records for:

Severity change

Incident resolution

Complaint closure

Refund approval/rejection

Cancellation override

Review removal

Payout hold

Safety restriction

Data export

Day 35 output

Full QA report

Security test report

Financial reconciliation report

Incident drill report

Consumer-policy test report

Open-defect list

Corrective patches

Week 5 release decision

Day 35 acceptance criteria

No unresolved critical safety defect.

Duplicate refunds are impossible.

Cross-customer data exposure is zero.

Invalid incident transitions are blocked.

Cancellation boundary tests pass.

Complaint deadlines are monitored.

Low-rating workflows work correctly.

Audit records exist for every sensitive action.

Week 5 deliverables

1. Incident dashboard

Includes:

Structured incident intake

Severity and triage

Named ownership

Timeline

Evidence

Customer updates

Booking/payout controls

Corrective actions

Post-incident review

2. Refund workflow

Includes:

Refund request

Policy recommendation

Admin approval

Razorpay submission

Idempotency

Webhook reconciliation

Failure handling

Customer status

3. Cancellation rules

Includes:

Service-specific windows

Customer/sitter/platform actors

Versioned policy

Exception review

Sitter compensation

Customer outcome preview

4. Complaint tracking

Includes:

Complaint intake

Priority

SLA

Ownership

Customer/sitter responses

Incident escalation

Resolution

Reopening

5. Review quality triggers

Includes:

Completed-booking eligibility

Structured ratings

Public/private feedback

Low-rating alert

Safety concern escalation

Moderation

Score integration

Repeat-offer suppression

Week 5 success metrics

### Table 164

| Metric | Initial target |
| --- | --- |
| Level 2/3 incidents with named owner | 100% |
| Critical incidents acknowledged | Immediate |
| Active-service customer contact | Under 5–10 minutes |
| Complaints acknowledged within internal SLA | 95%+ |
| Statutory grievance deadlines tracked | 100% |
| Refund requests with policy version | 100% |
| Duplicate refunds | 0 |
| Refunds exceeding captured balance | 0 |
| Provider refund failures detected | 100% |
| Reviews from ineligible bookings | 0 |
| Low-rating cases reaching review queue | 100% |
| Cross-role data exposure | 0 |

Week 5 definition of done

Incidents

Structured reporting works for customers and sitters.

Emergency triage is visible.

Severity and state transitions are controlled.

Every serious incident has ownership and a timeline.

Post-incident corrective actions are tracked.

Refunds

Requests, approvals and provider processing are separate.

Only captured payments can be refunded.

Idempotency prevents duplicate money movement.

Partial and full refunds work.

Provider failures create finance alerts.

Cancellation

Rules are service-specific and versioned.

Customer, sitter and platform cases are separated.

Refund, credit and sitter compensation are calculated independently.

Customers see the estimated outcome before confirmation.

Exceptions remain human-controlled.

Complaints

Complaints are distinct from incidents.

Deadlines and ownership are visible.

Customers receive status updates.

Complaints can escalate and reopen.

Resolutions contain customer and preventive actions.

Reviews

Only eligible completed services can be reviewed.

Private complaints are supported.

Low ratings generate quality action.

Safety concerns create triage.

One rating cannot automatically impose a serious sitter penalty.

Security and QA

Object and function authorisation tests pass.

Sensitive fields are role-filtered.

Financial and safety actions are audited.

Concurrency and duplicate-event tests pass.

No P0/P1 defects remain unresolved.

Final Week 5 operating flow

Customer or sitter reports a problem

↓

Complaint or incident created

↓

Severity and ownership assigned

↓

Service and safety controls applied

↓

Customer contacted

↓

Cancellation/refund recommendation calculated

↓

Admin or finance approval

↓

Provider refund processed

↓

Complaint and incident resolution recorded

↓

Review and reliability signals updated

↓

Corrective action prevents recurrence

Final operating principle

Week 5 succeeds when PetSaathi can respond to a safety concern, complaint or cancellation consistently from first report through customer communication, financial resolution, quality review and preventive action—without losing evidence, moving money twice or allowing sensitive decisions to be made by unauthorised users.

Simple explanation for professor

“During Week 5, we will improve how PetSaathi handles incidents, customer complaints, cancellations, refunds and ratings.

First, we will create structured incident forms. Instead of writing everything in one text box, customers and sitters will select the incident type, describe what happened and indicate whether the pet or any person is currently unsafe.

Next, incidents will be divided into three levels. Minor concerns will be recorded and corrected, moderate incidents will require active admin and customer contact, and critical emergencies will receive immediate escalation.

We will then create the refund module. A refund request will first be checked against the payment and cancellation policy. An authorised admin will approve the amount, and Razorpay will process the money. The system will wait for the provider’s final refund event before marking the refund as processed.

The cancellation engine will apply consistent rules based on the service type, cancellation time and who cancelled. Customer, sitter and platform cancellations will have different workflows, and every booking will retain the policy version that applied when it was confirmed.

The complaint dashboard will help support staff assign complaints, track response deadlines, communicate with customers and escalate safety issues into incidents.

Finally, customer ratings will be collected only after completed services. Low ratings will create a quality-review task, while serious safety feedback will create an incident review. A single negative rating will not automatically suspend a sitter.

The final result will be a tested system that protects customers, treats sitters fairly, processes refunds safely and uses complaints to improve PetSaathi’s service quality.”

PetSaathi Phase 6 — Week 6 Execution Plan

Optimization, Training, Pilot Validation and Launch Readiness 🚀🐾

Executive decision

Week 6 should be treated as a 10-day production-readiness gate, not another feature-development sprint.

No major functionality should be added unless it fixes a launch-blocking defect. The purpose is to verify that the systems built in Weeks 1–5 are:

Fast enough for real mobile users

Secure and privacy-conscious

Understandable to customers and sitters

Operable by the admin team

Stable under actual bookings

Measurable through agreed service-level indicators

Reversible when a deployment or automation fails

Google’s launch-readiness guidance recommends using structured launch checklists, explicit ownership, operational training, rollback controls and objective sign-off rather than relying on informal confidence. Canary releases should expose a controlled group first and evaluate reliability before wider rollout.

Performance and security validation

↓

Admin and sitter training

↓

Customer communication testing

↓

Controlled 20-booking pilot

↓

Issue correction and retesting

↓

Metrics and operational review

↓

SOP publication

↓

Go / Conditional Go / No-Go decision

Week 6 completion standard

Phase 6 should move to Phase 7 only when PetSaathi can demonstrate:

A customer can book and pay

↓

An eligible sitter is assigned

↓

Reminders work

↓

The service starts and tracks correctly

↓

A Report Card is delivered

↓

Incidents and replacements can be handled

↓

Refunds can be processed safely

↓

Every important action is visible to operations

The team should be able to operate this flow without developers manually correcting database records.

Day 36 — Performance optimization

Goal

Make the customer, sitter and admin experiences responsive on real mobile devices and realistic Indian network conditions.

Performance work should begin with measurement rather than random code changes.

1. Establish the performance baseline

Test these journeys:

### Table 165

| Journey | Critical pages |
| --- | --- |
| Customer booking | Home → pet → schedule → payment |
| Customer active service | Dashboard → booking → tracking |
| Sitter service | Assignment → pet details → Start Walk |
| Report Card | Submit report → media → customer view |
| Admin operations | Dashboard → alert → booking action |
| Incident response | Incident queue → evidence → action |

Measure:

Initial page load

API response time

JavaScript transferred

Image/video payload

Database query duration

Error rate

Slowest user interaction

Mobile memory behaviour

2. Core Web Vitals targets

Use the official “good” thresholds at the 75th percentile:

### Table 166

| Metric | Target |
| --- | --- |
| Largest Contentful Paint | ≤ 2.5 seconds |
| Interaction to Next Paint | ≤ 200 ms |
| Cumulative Layout Shift | ≤ 0.1 |

These thresholds measure loading performance, interaction responsiveness and visual stability. Field data should be reviewed separately for mobile and desktop users.

3. Recommended PetSaathi application targets

These are internal Phase 6 targets:

### Table 167

| Operation | Target |
| --- | --- |
| Normal read API, p95 | Under 500 ms |
| Important command API, p95 | Under 800 ms |
| Admin dashboard initial data | Under 2 seconds |
| Start Walk response | Under 1 second normally |
| Tracking-point batch acceptance | Under 1 second |
| Customer booking page | Under 3 seconds on mobile |
| Report Card first render | Under 2.5 seconds |
| Error rate on core APIs | Below 1% |
| Database pool saturation | No sustained saturation |

A slightly slower response may be acceptable for controlled financial or safety operations, but the interface must show a clear processing state.

4. Frontend optimization

Implement:

Server-render critical public content

Reduce unnecessary client components

Dynamically load maps and heavy admin modules

Reserve image dimensions to avoid layout shift

Optimise hero and sitter images

Paginate histories and admin tables

Virtualise very large operational lists

Avoid unnecessary JavaScript libraries

Cache stable service and city information

Current web performance guidance recommends making the LCP resource discoverable and prioritised, reducing unnecessary JavaScript, avoiding long main-thread tasks and explicitly sizing visual content to reduce layout shifts.

5. Media optimization

For customer and sitter media:

Generate thumbnails

Avoid loading original videos in list cards

Use modern image formats where supported

Load media only when visible

Compress uploads before or during cloud processing

Keep raw media behind authenticated access

Set reasonable upload-size limits

6. Database optimization

Review:

Slow query log

Missing indexes

N+1 Prisma queries

Large JSON payloads

Unbounded admin lists

Tracking-point queries

Current reliability-score lookup

Open incident/refund queues

Likely high-value indexes include:

bookings(status, scheduled_start_at)

booking_assignments(sitter_id, status)

tracking_sessions(booking_id, status)

notification_outbox(status, available_at)

incidents(status, severity)

refund_requests(status, created_at)

7. Third-party loading

Maps, analytics, error monitoring and chat widgets should not block the booking interface.

Load them according to user need:

Map library:

Load on tracking/address pages

Analytics:

Load after essential application code

Support widget:

Load after primary dashboard content

Heavy admin charts:

Load after operational alert lists

Day 36 output

Performance baseline

Core Web Vitals report

Slow-page list

Slow-query list

Bundle-size report

Optimized media strategy

Performance regression tests

Before/after comparison

Day 36 acceptance criteria

Core booking pages meet agreed mobile targets.

No major page has an obvious layout shift.

Maps and media do not block critical controls.

Admin lists are paginated.

Start Walk and payment actions provide immediate feedback.

No known query creates sustained database overload.

Core Web Vitals are measured in production or pilot field data, not only Lighthouse.

Day 37 — Security and privacy review

Goal

Verify that the system protects customer addresses, pet records, sitter information, location data, payments, incidents and administrative functions.

Use OWASP ASVS as the security-verification baseline and OWASP’s API Security guidance for endpoint-level testing. ASVS provides a structured set of testable web-application security controls rather than relying on an informal checklist.

1. Authentication review

Verify:

Secure session cookies

Session expiry

Logout invalidation

Password or identity-provider controls

MFA for privileged admins

Account lockout/rate protection

No authentication secrets in client bundles

2. Role and object authorization

Test every sensitive route against:

Customer

Sitter

Support admin

Operations admin

Safety admin

Finance admin

Verification admin

Unauthenticated user

Examples:

Customer A cannot view Customer B’s booking.

Sitter cannot start an unassigned booking.

Removed sitter cannot read exact address.

Support admin cannot approve a refund.

Finance admin cannot change incident responsibility.

Operations admin cannot bypass a serious safety hold.

3. API input and workflow protection

Verify:

Request-schema validation

Property allowlists

Booking-state transition validation

Idempotency for commands

Optimistic concurrency

Rate limits

Payload-size limits

Pagination limits

Secure error responses

No frontend-controlled price, risk or payment state

4. Payment security

Verify:

Razorpay keys stored only server-side

Payment signatures verified

Webhook signatures verified from raw payload

Duplicate webhooks handled idempotently

Refund amount checked against captured balance

No card data stored by PetSaathi

Financial overrides audited

5. Location privacy

Verify:

Tracking starts only for an authorised active service

Tracking stops after completion

Removed sitters lose access

Customers see only their bookings

Raw locations do not enter general application logs

Tracking links expire

Retention rules are documented

Admin access is audited

6. File-upload security

Verify:

Allowed file formats

Content-type validation

Size and duration limits

Randomized storage names

Signed uploads

Private delivery

Malware or suspicious-file handling where appropriate

No executable uploads

7. Admin security

Require stronger controls for:

Refund approval

Sitter suspension

Safety override

Incident closure

Exporting sensitive data

Viewing raw tracking evidence

Changing a delivered Report Card

Each action should require:

Correct role

Reason

Timestamp

Audit event

Reauthentication where risk is high

8. Privacy readiness

The final Digital Personal Data Protection Rules, 2025 were published on November 14, 2025 with staged commencement provisions. PetSaathi should map its notices, access controls, retention, correction, grievance and breach-response processes against the requirements applicable at launch, with legal review for the exact commencement stage.

Review:

Privacy notice

Data-purpose explanations

Marketing consent

Location-tracking notice

Customer correction process

Media usage consent

Data-retention schedule

Incident/breach escalation

Vendor data-processing responsibilities

Day 37 output

ASVS-based security checklist

API authorization test report

Payment-security report

Tracking-privacy review

File-upload review

Admin-permission matrix

Privacy gap register

P0–P3 security defect list

Day 37 acceptance criteria

No critical cross-user access vulnerability exists.

No client can modify payment, risk or refund state directly.

Webhook verification passes.

Tracking is inaccessible after authorization ends.

Admin actions are role-controlled and audited.

Secrets are absent from code and logs.

All P0/P1 security defects are fixed before the pilot.

Day 38 — Admin training

Goal

Train administrators to operate the system during normal bookings, delays, incidents and financial exceptions.

Admin training should be practical. Reading documentation alone is insufficient.

1. Role-based training tracks

Operations administrator

Train on:

Booking review

Sitter assignment

Backup candidate selection

Replacement workflow

Late-service intervention

Customer updates

Report Card follow-up

Safety administrator

Train on:

Incident triage

Severity assignment

Containment

Evidence handling

Pet/sitter reassessment

Corrective actions

Incident closure

Finance administrator

Train on:

Captured-payment verification

Refund recommendation review

Refund approval

Provider status

Failed-refund handling

Payout holds

Daily reconciliation

Support administrator

Train on:

Complaint intake

Customer communication

SLA management

Escalation

Refund-status explanation

Privacy-conscious data access

2. Admin simulation exercises

Run at least these scenarios:

Sitter does not acknowledge.

Sitter is 15 minutes late.

Primary sitter cancels.

Payment is captured but booking remains pending.

Report Card is overdue.

Customer reports vomiting.

Pet escapes.

Customer requests a partial refund.

WhatsApp delivery fails.

Customer submits a one-star safety complaint.

3. Training evaluation

Each admin should demonstrate:

Correct queue selection

Correct escalation priority

Correct customer message

Correct role usage

Correct audit reason

Correct incident or refund state

Do not grant production privileges solely because someone attended the training.

4. Access certification

At completion, record:

Admin

Approved role

Completed modules

Simulation results

Approver

Access start

Access review date

Day 38 output

Role-specific training decks

Admin sandbox scenarios

Response scripts

Escalation contact sheet

Permission certification

Training-assessment results

Retraining list

Day 38 acceptance criteria

Every launch-shift admin passes the required scenarios.

Every P0/P1 alert has an understood owner.

Finance and safety permissions remain separated.

Administrators know when not to override automation.

Backup escalation coverage exists for each operating shift.

No untrained user receives high-risk production access.

Day 39 — Sitter training update

Goal

Prepare sitters for the new Phase 6 tracking, notification, Report Card, incident and replacement workflows.

1. Required modules

Booking readiness

Review assignment

Acknowledge before deadline

Keep availability accurate

Prepare travel

Contact support before lateness becomes a no-show

Pet safety

Read Pet Profile and controls

Follow food, handling and medication restrictions

Stop service when conditions are unsafe

Never diagnose or change medication

Report behaviour and health observations factually

Start and End Walk

Confirm arrival

Confirm handover

Enable location permission

Start only after authorization

End only after pet is safely returned

Stop tracking after service

GPS and privacy

Tracking is for the assigned service only

Do not share customer routes or addresses

Do not use screenshots or media outside PetSaathi

Report permission or signal failure honestly

Use fallback evidence when instructed

Report Card

Use structured observations

Avoid generic copied notes

Report concerns accurately

Do not hide negative events

Submit within required time

Incident response

Protect the pet first

Contact PetSaathi

Contact the owner according to workflow

Follow veterinary instructions

Preserve evidence

Do not admit liability or blame someone before review

2. Practical sitter drills

Require sitters to complete:

Accept and acknowledge booking

Start a test walk

Upload GPS points

Submit one image

End the walk

Complete Report Card

Report a mock concern

Respond to a replacement offer

3. Training certification

Possible statuses:

NOT_STARTED

IN_PROGRESS

COMPLETED

ASSESSMENT_REQUIRED

PASSED

RETRAINING_REQUIRED

EXPIRED

Advanced permissions should depend on relevant training:

### Table 168

| Permission | Training |
| --- | --- |
| Dog walking | Tracking and handling |
| Large dogs | Large-dog handling |
| Yellow-control assignments | Advanced safety |
| Medication tasks | Approved medication process |
| Boarding | Host/property and emergency training |

Day 39 output

Updated sitter handbook

Short video or interactive modules

Tracking practice booking

Report Card examples

Incident quick-reference guide

Sitter assessment

Retraining queue

Permission update process

Day 39 acceptance criteria

Every pilot sitter completes training.

Every pilot sitter performs a successful practice flow.

Sitters understand tracking privacy.

Sitters can identify emergency escalation.

Sitters know replacement and cancellation rules.

Failed assessments prevent the related service permission.

Day 40 — Customer communication and UX test

Goal

Confirm that customers understand booking, payment, sitter assignment, tracking, incidents, refunds and privacy without needing staff explanations.

1. Test the essential customer questions

A customer should immediately understand:

Is my booking confirmed?

Has my payment succeeded?

Who is my sitter?

What verification was performed?

What happens if the sitter cancels?

When does location tracking start?

Who can see the route?

How do I report an emergency?

When will the Report Card arrive?

How does cancellation affect my refund?

2. Test communication surfaces

Review:

Booking confirmation

Payment failure

Sitter assigned

Sitter replacement

Previous-day reminder

Service started

Tracking signal lost

Report Card ready

Incident update

Refund processing

Refund failure

Review request

3. Content rules

Every communication should be:

Accurate

Actionable

Short enough for mobile

Free of internal status codes

Clear about what happens next

Honest about delays

Consistent across dashboard, WhatsApp and email

4. UX testing group

Test with:

New pet parent

Repeat customer

Less technical user

Hindi/Gujarati-speaking user where possible

Customer using a lower-cost Android phone

Customer on slower mobile data

Customer with accessibility needs

5. Customer-task testing

Ask testers to perform:

Confirm whether a booking is paid.

Find sitter verification.

Update pet instructions.

Locate emergency support.

Read the tracking status.

View the Report Card.

Cancel and understand the refund outcome.

Open a complaint.

Rebook the same sitter.

Record:

Task completion

Time taken

Wrong clicks

Questions asked

Misunderstandings

Drop-off point

Confidence rating

Day 40 output

Customer communication inventory

Message consistency report

Usability-test results

Accessibility findings

Confusing-language list

Updated customer templates

UX defect backlog

Day 40 acceptance criteria

Test users distinguish requested from confirmed bookings.

Payment and refund states are understood.

Emergency support is easy to find.

Customers understand that GPS distance is approximate.

Customers understand that a preferred sitter is not guaranteed.

Critical actions work on mobile without staff assistance.

No P0/P1 communication defect remains.

Day 41 — Pilot automation with 20 bookings

Goal

Run a controlled production canary using real bookings, real customers, trained sitters and active operational monitoring.

Twenty bookings are sufficient for a focused operational pilot, but not for proving long-term statistical reliability. Treat them as a canary cohort intended to reveal workflow and operational failures before broader exposure. Google’s canary guidance recommends evaluating a limited release against reliability measures and maintaining the ability to stop or roll back when the new path causes unacceptable impact.

1. Pilot cohort

Recommended composition:

### Table 169

| Service type | Suggested bookings |
| --- | --- |
| Standard dog walks | 12 |
| Yellow-control dog walks | 3 |
| Pet sitting | 3 |
| Controlled boarding or longer sitting | 2 |

Adjust according to actual launch scope. Do not include an unsafe booking merely to test an edge case.

2. Staged rollout

Use:

Batch 1: 5 bookings

↓

Review defects

↓

Batch 2: 5 bookings

↓

Review defects

↓

Batch 3: 10 bookings

Do not run all 20 simultaneously on the first day.

3. Pilot requirements

Every booking must have:

Named operations owner

Primary sitter

Backup coverage or documented fallback

Verified payment

Correct Pet Profile

Notification flow

Tracking where applicable

Report Card requirement

Support contact

Incident and refund readiness

4. Live pilot dashboard

Track each booking:

Requested

Admin-reviewed

Sitter assigned

Payment captured

Sitter acknowledged

Reminders delivered

Service started

Tracking active

Service completed

Report submitted

Customer notified

Review received

Repeat requested

5. Stop conditions

Pause the pilot when any of these occur:

Cross-customer data exposure

Duplicate payment or refund

Unauthorized tracking

Pet missing or serious unresolved incident

Two active sitters on one booking

System confirms unpaid booking

Multiple customers receive wrong messages

Core booking API becomes unavailable

Admin cannot identify active services

Also pause when repeated P1 failures indicate a systemic defect:

Several reminders fail

Tracking does not stop

Report generation repeatedly fails

Replacement assignments conflict

Payment state is inconsistent

Day 41 output

Twenty-booking pilot register

Per-booking timeline

Notification delivery report

Tracking results

Report Card completion

Incident/refund log

Automation intervention count

Customer and sitter feedback

Stop/go decisions by batch

Day 41 acceptance criteria

Every pilot booking has an owner.

No unpaid booking is confirmed.

No unauthorized sitter starts a service.

Every completed service produces a report or documented exception.

Every automation failure is visible to operations.

No P0 defect is ignored to complete the sample.

Day 42 — Fix automation issues

Goal

Correct the problems discovered in the pilot and prove that the corrections work.

1. Classify defects

P0 — Stop launch

Examples:

Data exposure

Duplicate refund

Unsafe assignment

Tracking after completion

Payment confirmation error

Lost incident record

P1 — Must fix before Phase 7

Examples:

Reminder consistently missing

Replacement workflow failing

Admin alert not delivered

Report Card not generated

Customer cannot reach support

P2 — Fix soon or document mitigation

Examples:

Slow dashboard

Confusing wording

Occasional noncritical notification delay

Weak dashboard filtering

P3 — Optimization backlog

Examples:

Cosmetic alignment

Nonessential analytics

Minor animation

2. Root-cause correction

Do not only patch the visible symptom.

Example:

Symptom:

Customer received two service-start messages

Weak fix:

Hide the second message in UI

Correct fix:

Add event idempotency and unique notification key

3. Regression testing

Every fix must include:

Reproduction test

Automated test

Normal-path test

Failure-path test

Authorization test where relevant

Audit-event verification

4. Controlled redeployment

Deploy corrected automation to:

Internal test booking

↓

Two pilot bookings

↓

Remaining pilot or staging workflows

Use release monitoring and rollback criteria. Google’s production-maturity guidance treats automated verification, canary deployment and demonstrated rollback capability as important aspects of production readiness.

Day 42 output

Defect triage

Root-cause reports

Corrected workflows

Regression-test suite

Redeployment notes

Remaining-risk register

Deferred-issue list

Day 42 acceptance criteria

All P0 defects are fixed and retested.

All P1 defects are fixed or the release remains blocked.

Every fix has regression coverage.

No manual database correction remains part of the normal flow.

Rollback has been tested for critical changes.

Deferred P2/P3 issues have owners and deadlines.

Day 43 — Final metrics review and launch report

Goal

Compare actual pilot performance with the approved Phase 6 targets.

1. Customer journey metrics

Track:

### Table 170

| Metric | Phase 6 target |
| --- | --- |
| Booking flow completion | Stable/improving |
| Payment success | 80%+ of started payments |
| Completed services | 90%+ |
| Report Cards delivered | 98%+ |
| Customer rating | 4.6+ |
| Repeat-booking interest | 35%+ target |
| Support response during service | Under 5–10 minutes |

2. Sitter metrics

### Table 171

| Metric | Target |
| --- | --- |
| Acknowledgement on time | 95%+ |
| On-time service start | 95%+ |
| Avoidable cancellation | Low/decreasing |
| No-show rate | Below 3–5% |
| Report Card completion | 98%+ |
| Training completion | 100% pilot sitters |
| Tracking success/fallback evidence | 98%+ |

3. Automation metrics

### Table 172

| Metric | Target |
| --- | --- |
| Eligible reminders scheduled | 99%+ |
| Obsolete reminders sent | 0 |
| Duplicate customer notifications | Near zero |
| Booking automation coverage | 60–70% |
| Admin workload reduction | 30–50% target |
| Failed jobs visible to operations | 100% |
| Replacement coverage | 80%+ important bookings |

4. Safety and finance metrics

### Table 173

| Metric | Target |
| --- | --- |
| Critical incidents without owner | 0 |
| Same-day incident decision | 100% where feasible |
| Duplicate refunds | 0 |
| Refunds above available balance | 0 |
| Captured payment without reconciliation | 0 unresolved |
| Unauthorised data access | 0 |
| Unauthorised tracking | 0 |

5. Reliability measures

Define Phase 7 operational SLOs and a small error budget.

Example:

Booking-state correctness:

99.9%

Notification workflow execution:

99%

Report generation:

98% within SLA

Critical admin-alert delivery:

99.9%

Tracking session clean termination:

99%

SRE practice uses service-level objectives and error budgets to balance continued delivery with the need to stop and improve reliability when the allowed failure level is being consumed too quickly.

Day 43 output

Phase 6 metrics dashboard

Pilot results

Target-versus-actual report

Incident and defect summary

Automation coverage report

Performance report

Security status

Residual-risk register

Preliminary go/no-go recommendation

Day 43 acceptance criteria

Every launch metric has a source and owner.

Missing data is not represented as success.

Averages are accompanied by counts.

Critical metrics are separated from cosmetic metrics.

Phase 7 targets are based on actual pilot evidence.

The team agrees on remaining launch blockers.

Day 44 — Standard Operating Procedure updates

Goal

Convert the tested workflows into operational documents that can be followed consistently during real services.

Required SOPs

Booking operations

Review booking

Assign sitter

Verify payment

Confirm customer

Monitor readiness

Close booking

Sitter delay and no-show

Contact sitter

Notify customer

Generate backup candidates

Assign replacement

Reschedule/cancel

Record reliability event

Active-service monitoring

Service start

Tracking health

Customer support

Overdue completion

Missing Report Card

Incident response

Triage

Severity

Incident command

Customer communication

Emergency coordination

Evidence

Closure

Post-incident review

Cancellation and refunds

Determine actor

Apply policy version

Calculate recommendation

Obtain approval

Submit Razorpay refund

Monitor provider status

Notify customer

Reconcile finance

Data and privacy request

Verify requester

Locate records

Restrict internal access

Correct or process request

Record outcome

Provider outage

Separate SOPs for:

Razorpay unavailable

WhatsApp unavailable

SMS unavailable

Maps unavailable

Cloudinary unavailable

Inngest delayed

Database incident

SOP format

Every procedure should state:

Purpose

Trigger

Owner

Prerequisites

Steps

Decision points

Escalation

Customer communication

Audit requirements

Completion condition

Related templates

Last reviewed date

Quick-reference versions

Create one-page guides for:

Lost pet

Sitter no-show

Payment captured but unconfirmed

Tracking failure

Refund failed

Serious customer complaint

Day 44 output

Approved operational SOP library

Emergency quick-reference guides

Role responsibility matrix

Escalation directory

Customer-message library

Change-control process

SOP acknowledgement records

Day 44 acceptance criteria

Every core workflow has a named owner.

Staff can follow procedures without developer intervention.

SOPs match the actual product.

Emergency contacts are verified.

Documents have version numbers and review dates.

Contradictory or obsolete procedures are removed.

All launch personnel acknowledge the relevant SOPs.

Day 45 — Go/no-go decision

Goal

Make an evidence-based decision about Phase 7 readiness.

The meeting should include:

Product owner

Engineering lead

Operations lead

Safety owner

Finance owner

Customer-support owner

Security/privacy representative

Pilot coordinator

1. Decision options

GO

Phase 7 may begin with controlled volume when:

No open P0 defects

No open launch-blocking P1 defects

Security review passed

Pilot metrics acceptable

Admin and sitter training complete

Incident/refund workflows tested

Rollback available

SOPs approved

CONDITIONAL GO

Limited launch may proceed with:

Booking cap

Restricted service areas

Selected sitters

Selected services

Manual oversight

Specific P2 mitigations

Daily launch review

Example:

Go for dog walking in Bopal and South Bopal

Do not launch boarding yet

Maximum 10 bookings per day

Manual admin confirmation retained

NO-GO

Phase 7 should not begin when:

A critical security issue is open

Payment or refund correctness is uncertain

Tracking continues without authorization

Serious incidents cannot be handled

Admin coverage is incomplete

Booking status becomes inconsistent

Replacement workflow is unsafe

Core performance is unusable on target phones

Pilot required repeated developer/database intervention

2. Hard launch blockers

### Table 174

| Area | Blocker |
| --- | --- |
| Security | Cross-user or privilege vulnerability |
| Payment | Duplicate charge/refund or unreconciled capture |
| Safety | Incident workflow unavailable |
| Tracking | Location captured outside service authorization |
| Assignment | Two active primary sitters possible |
| Operations | No owner for active P0/P1 alerts |
| Reports | Completed service cannot produce evidence |
| Recovery | No rollback or manual fallback |
| Training | Operators or sitters unprepared |

3. Conditional launch controls

When the decision is Conditional Go, document:

Allowed cities/areas

Allowed services

Approved sitters

Maximum daily bookings

Required manual checkpoints

Enhanced support hours

Known limitations

Stop conditions

Review date

4. Rollback and kill switches

Prepare controls for:

Disable automatic replacement

Disable new tracking sessions

Pause automated repeat offers

Pause new payments

Return booking matching to manual mode

Disable one notification channel

Stop boarding bookings

Cap daily bookings

Reliable-launch guidance recommends anticipating failure modes, using launch controls or kill switches and retaining the ability to reduce exposure when reliability falls outside acceptable limits.

5. Final sign-off record

Decision:

GO / CONDITIONAL_GO / NO_GO

Decision date

Approved scope

Booking cap

Open risks

Required mitigations

Stop conditions

Review date

Approvers

Day 45 output

Signed go/no-go decision

Approved Phase 7 scope

Launch caps and stop conditions

Rollback plan

Residual-risk acceptance

Phase 7 monitoring calendar

First-week operational roster

Final Week 6 deliverables

1. Optimized application

Includes:

Mobile performance improvements

Reduced bundle and media payload

Optimized database queries

Core Web Vitals monitoring

Performance regression checks

2. Security-ready system

Includes:

Authentication review

RBAC and object authorization

Payment/webhook security

Tracking privacy

File-upload protection

Admin audit controls

Privacy gap remediation

3. Trained operations team

Includes:

Role-specific certification

Incident and refund simulations

Alert ownership

Shift and escalation coverage

Production access approval

4. Trained sitter cohort

Includes:

Tracking training

Pet-safety procedures

Report Card quality

Incident escalation

Privacy expectations

Passed practical assessment

5. Customer-tested communication

Includes:

Booking and payment clarity

Tracking explanation

Replacement messages

Incident support

Cancellation/refund communication

Mobile usability validation

6. Twenty-booking canary

Includes:

Staged batches

Named owners

Stop conditions

Timeline evidence

Customer/sitter feedback

Automation intervention count

7. Launch-readiness report

Includes:

Performance status

Security status

Operational metrics

Safety results

Finance results

Training completion

Open risks

Known limitations

Launch recommendation

8. SOP library

Includes:

Booking

Delays/no-shows

Tracking

Incidents

Refunds

Complaints

Provider outages

Privacy requests

Emergency response

Week 6 success metrics

### Table 175

| Metric | Required result |
| --- | --- |
| Open P0 defects | 0 |
| Open launch-blocking P1 defects | 0 |
| Cross-user data exposure | 0 |
| Duplicate charges/refunds | 0 |
| Pilot service completion | 90%+ |
| Report Card delivery | 98%+ |
| Sitter on-time rate | 95%+ target |
| Tracking or fallback proof | 98%+ |
| P0/P1 alerts with owner | 100% |
| Pilot sitter training | 100% |
| Admin launch-role certification | 100% |
| Rollback controls tested | Yes |
| SOPs approved | Yes |

Week 6 definition of done

Week 6 is complete only when:

Performance

Mobile booking and service pages meet agreed targets.

Core Web Vitals are measured.

Slow queries and major bundle issues are corrected.

Maps, media and admin dashboards remain usable under pilot load.

Security

Critical authorization tests pass.

Webhook and refund controls pass.

Sensitive location and incident data are protected.

High-risk admin actions are audited.

No P0/P1 security defect remains open.

People

Admins pass role-specific simulations.

Sitters complete practical training.

Customer support can explain every important state.

Every operating shift has clear escalation coverage.

Pilot

Twenty bookings run in controlled batches.

Stop conditions are enforced.

Every automation failure is visible.

No normal workflow depends on manual database editing.

Documentation

SOPs match production behaviour.

Emergency guides are available.

Owners and escalation routes are current.

Documents are versioned and acknowledged.

Decision

Metrics are reviewed honestly.

Remaining risks are documented.

Launch scope and booking caps are explicit.

Rollback controls have been tested.

An authorised group signs the final decision.

Final Week 6 operating flow

Optimize the system

↓

Review security and privacy

↓

Train admins

↓

Train sitters

↓

Test customer communication

↓

Run 5 pilot bookings

↓

Review

↓

Run 5 more

↓

Review

↓

Run final 10

↓

Fix and retest defects

↓

Review final metrics

↓

Approve SOPs

↓

GO / CONDITIONAL GO / NO-GO

Final operating principle

Phase 6 is complete only when PetSaathi is not merely feature-complete, but operationally understandable, measurable, secure, recoverable and proven through controlled real bookings.

Simple explanation for professor

“Week 6 is the final launch-readiness stage of Phase 6.

First, we will improve the speed of the customer, sitter and admin applications. We will test important pages on mobile devices, optimise images, videos, maps and database queries, and measure page loading and interaction performance.

Next, we will perform a security review. We will check login security, role permissions, payment verification, file uploads, GPS privacy and admin access. Customers must not be able to access another customer’s booking, and sitters must not access bookings that are not assigned to them.

After that, the admin team and sitter team will receive practical training. Administrators will practise delays, replacement sitters, incidents and refunds. Sitters will practise booking acknowledgement, GPS tracking, Report Cards and emergency reporting.

We will then test customer messages to confirm that customers understand whether their booking is confirmed, whether payment succeeded, who the sitter is, when tracking starts and how cancellation affects their refund.

The new automation will first be tested through twenty controlled bookings in smaller batches. Every booking will have an operations owner, a trained sitter and active monitoring. If a critical safety, security or payment problem appears, the pilot will stop.

After fixing and retesting the issues, we will compare the results with our targets for punctuality, completed services, tracking, Report Cards, refunds, support and customer ratings.

Finally, we will update all operational procedures and make a Go, Conditional Go or No-Go decision. A Conditional Go may allow only selected areas, services and booking limits. Phase 7 will begin only when there are no critical defects and the team can operate the complete service without manual chaos.”

PetSaathi Phase 6 — City-Specific Strategy 🐾🏙️

Executive decision

The proposed city strategies are directionally strong, but statements such as “Bengaluru users expect app-like reliability” or “Surat users prefer phone support” should be treated as launch hypotheses, not permanent facts.

PetSaathi should use:

One common safety and booking platform

+

City-specific configuration

+

Area-level operating rules

+

Measured customer behaviour

Do not build six separate products or hard-code city behaviour into frontend components.

1. Universal Phase 6 foundation

Every city must receive the same core protections:

Verified booking and payment states

Admin-controlled sitter assignment

Service-specific Pet Profile assessment

Sitter acknowledgement and reminders

Backup-sitter workflow

Start/end service controls

Basic GPS evidence for walks

Automated Report Cards

Structured incidents

Admin-controlled refunds

Role-based access

Audit history

City configuration should change:

Active services

Service radius

Maximum travel time

Backup requirements

Notification channel priority

Society-access requirements

Plan and package structure

Language options

Report Card style

Boarding controls

2. Configuration-driven city architecture

Create a city-policy layer instead of writing logic such as:

if (city === "Mumbai") {

radius = 2;

}

Use structured configuration:

city_service_policies

- city_id

- service_type

- active

- maximum_travel_minutes

- preferred_radius_km

- arrival_buffer_minutes

- backup_required

- hard_standby_required

- society_access_required

- tracking_required

- primary_notification_channel

- supported_locales

- package_rules

- cancellation_policy_version

- report_template

Also add area-level configuration:

service_areas

- city_id

- area_name

- polygon

- active

- service_capacity

- active_sitter_count

- maximum_daily_bookings

- peak_time_buffer

- emergency_contact_reference

The final assignment decision should use actual travel duration, not city name alone. Both Mappls Distance Matrix and Google Compute Route Matrix can calculate travel distance and duration between multiple origins and destinations.

3. Bengaluru strategy

Recommended Phase 6 focus

Automation reliability

Fast operational notifications

Strong live-service status

Basic GPS proof

Same-sitter rebooking

Quick support escalation

Bengaluru’s 2025 TomTom data reported a 74.4% average congestion level, approximately 36 minutes for a 10-kilometre trip and a rush-hour average speed of 13.9 km/h. This supports tight service areas, travel-time validation and proactive late-start alerts rather than broad city-wide matching.

Build strongly

Live status

Show:

Booking confirmed

Sitter acknowledged

Sitter preparing

Sitter on the way

Sitter arrived

Walk started

Walk in progress

Walk completed

Report Card ready

Each status must come from a real event, not an estimated frontend animation.

GPS proof

Use:

Start location

Periodic points

End location

Approximate distance

Signal quality

Customer-visible timeline

Do not use second-by-second tracking. Android notes that continuous background location affects battery life and recommends carefully controlling frequency and background behaviour.

Same-sitter repeat booking

After a successful service:

View Report Card

↓

Book Riya again

↓

Select date/time

↓

Revalidate sitter availability

↓

Confirm payment

Do not promise the same sitter until availability and eligibility are checked.

Bengaluru KPIs

Tracking-session success

Service-start punctuality

Notification latency

Support response time

Same-sitter repeat rate

Customer dashboard usage

Tracking-related support contacts

4. Pune strategy

Recommended Phase 6 focus

Walking-plan automation

Same-sitter scheduling

Package-credit tracking

Sitter punctuality

Reliability coaching

Pune’s 2025 traffic report recorded 71.1% average congestion, approximately 33 minutes and 20 seconds for a 10-kilometre trip, and a rush-hour average speed of 15.1 km/h. Sitter travel buffers and locality-based scheduling are therefore necessary even for package customers.

Important correction

Do not make “student sitter” a reliability category.

A sitter should be evaluated using:

Verification

Training

Availability accuracy

On-time performance

Completion rate

Report quality

Customer experience

Incident findings

Education or student status should not automatically increase or reduce assignment priority.

Ten-walk pack model

Use a credit ledger:

Plan purchased: 10 walks

Credits issued: 10

Credits reserved: 1

Credits remaining: 9

Validity: 60 days

Preferred sitter: subject to availability

Each credit event should be recorded:

CREDIT_ISSUED

CREDIT_RESERVED

CREDIT_CONSUMED

CREDIT_RELEASED

CREDIT_EXPIRED

CREDIT_REFUNDED

Regular sitter schedule

Customer selects:

Monday, Wednesday, Friday

7:00 AM

↓

System checks preferred sitter

↓

Individual future booking requests created

↓

Availability checked for each occurrence

↓

Backup options generated

Do not create ten confirmed bookings without verifying future capacity.

Pune KPIs

Trial-to-five-walk conversion

Five-to-ten-walk conversion

Credit utilisation

Same-sitter fulfilment

Package cancellation rate

Punctuality by area

Expired unused credits

Repeat contribution margin

5. Mumbai strategy

Recommended Phase 6 focus

Hyperlocal matching

Travel-time limits

Late-start prevention

Backup coverage

Local sitter density

Mumbai’s 2025 TomTom data reported 63.2% average congestion and approximately 28 minutes and 51 seconds for a 10-kilometre journey. During the worst recorded evening period, only about 3.8 kilometres could be covered in 15 minutes.

Replace fixed radius with ETA rules

The proposed “backup within one or two kilometres” rule is too rigid.

Two kilometres may take:

8 minutes in one locality

25 minutes in another

Longer during rain or peak traffic

Use:

maximum_backup_travel_minutes

rather than only:

maximum_backup_distance_km

Mappls and Google both provide traffic-aware or route-duration tools that can support ETA-based candidate filtering.

Matching guard

Sitter passes service eligibility

↓

Route ETA calculated

↓

Society-entry buffer added

↓

Previous booking end time checked

↓

Required arrival time calculated

↓

Candidate accepted or rejected

Late-start alerts

Suggested stages:

T−30:

Readiness missing

T−15:

Travel status missing

Scheduled start:

No arrival

T+5:

Late-start warning

T+10:

Replacement review

T+15:

Customer remedy decision

These values should be tuned from pilot data.

Mumbai KPIs

Median sitter travel time

Late-start rate

Replacement time

Locality-level sitter density

Bookings rejected due to ETA

Customer cancellation caused by delay

Same-locality assignment percentage

Sitter utilisation without overbooking

6. Gurugram strategy

Recommended Phase 6 focus

Verifiable trust

Society access readiness

Emergency coordination

Premium service reporting

Strong incident escalation

The statement that Gurugram customers expect premium safety should be tested through conversion and interview data. The product architecture should nevertheless support gated-society operations because access failure can prevent an otherwise valid booking.

Verification badges

Use factual badges:

Identity verified

Phone verified

Police-verification document reviewed

Pet-care training completed

Large-dog handling approved

Boarding property approved

Society access approved

Avoid:

100% safe

Risk-free sitter

Completely trusted

Every badge should have:

verification_type

reviewed_at

expires_at

reviewed_by

status

Society access profile

Store:

Society name

Tower/block

Gate process

Visitor approval requirement

Sitter registration requirement

Allowed entry timings

Pet lift requirement

Security contact

Last verified date

Emergency support

Customer dashboard should show:

PetSaathi support

Saved emergency contact

Regular veterinarian

Emergency clinic

Booking code

Active incident status

PetSaathi must describe this as coordination support, not veterinary diagnosis.

Premium Report Card

Premium should mean better evidence and clarity:

Verified start/end

Care checklist

Photos/videos

Mood and behaviour

Feeding/water confirmation

Concern status

Clear human note

Amendment history

It should not mean decorative PDF styling without stronger operational data.

Gurugram KPIs

Society-entry failure rate

Verification badge views

Badge-to-booking conversion

Emergency-contact completeness

Incident acknowledgement time

Premium-service repeat rate

Customer support satisfaction

7. Ahmedabad strategy

Recommended Phase 6 focus

WhatsApp-first service communication

Local trust visibility

Simple status language

Family-friendly Report Cards

Admin-supported onboarding

Ahmedabad’s 2025 traffic report recorded 49% average congestion and approximately 28 minutes and 59 seconds for a 10-kilometre journey. Although this is lower than Bengaluru or Pune, area-level matching and travel buffers are still necessary.

WhatsApp-first architecture

WhatsApp should deliver:

Booking confirmation

Payment reminder

Sitter assignment

Service-start update

Report Card notification

Replacement update

Refund status

Meta defines utility templates as messages responding to a user action or request, including confirmations, status updates and reminders. Its Template Library includes common utility use cases such as payment reminders and delivery-style updates.

Do not send the complete private Pet Profile or sensitive incident details directly in WhatsApp.

Use:

Your Pet Report Card is ready.

View securely in PetSaathi.

Family-friendly updates

Example:

Bruno’s walk has started safely with Riya. You will receive a photo update and Report Card after the service.

Avoid technical wording:

Tracking session TS-928 entered ACTIVE state.

Local caretaker badge

Use only when supported by facts:

Lives/operates in Bopal

Serves this area regularly

Completed 18 local bookings

Society access verified

Do not use “local trusted caretaker” without defining what was verified.

Hindi and Gujarati support

Treat localization as an experiment.

Measure:

Language selected

Booking completion by locale

Support requests by language

Report Card language preference

WhatsApp engagement

Customer comprehension

Do not translate only the homepage. Critical states, policies, refund explanations and emergency instructions must also be translated before claiming full language support.

Ahmedabad KPIs

WhatsApp delivery and read rate

Dashboard click-through

Booking completion after WhatsApp reminder

Support-assisted booking rate

Local-sitter conversion

Repeat booking

Language preference

Trust-related customer objections

8. Surat strategy

Recommended Phase 6 focus

Simple booking journey

Phone/WhatsApp support

Admin-assisted booking

Sitter training

Controlled boarding

Daily boarding reports

The assumption that Surat has slower digital adoption should be validated locally rather than embedded permanently into the product.

Admin-assisted booking

The support agent may help create a booking, but the system must record:

booking_source = ADMIN_ASSISTED

assisting_admin_id

customer_confirmation_at

policy_version

payment_consent

instructions_confirmed_at

Admin assistance must not bypass customer consent or payment verification.

Controlled boarding flow

Boarding request

↓

Pet Profile completeness

↓

Vaccination and health review

↓

Compatibility review

↓

Host/property approval

↓

Meet-and-greet when required

↓

Deposit/payment

↓

Check-in confirmation

↓

Daily boarding updates

↓

Checkout and handover

Boarding daily report

Show:

Feeding

Water

Toilet

Medication

Mood

Behaviour

Sleep/rest

Photos/videos

Concern flag

Sitter note

A serious concern should open incident triage instead of waiting for the next daily report.

Pickup and drop confirmation

Record separately:

PICKUP_SCHEDULED

SITTER_ARRIVED

PET_RECEIVED

BOARDING_STARTED

RETURN_STARTED

PET_HANDED_OVER

CUSTOMER_CONFIRMED_RETURN

Surat KPIs

Assisted-booking conversion

WhatsApp-to-payment conversion

Boarding-report completion

Pickup/drop punctuality

Boarding incident rate

Sitter training completion

Customer support contacts per booking

Repeat boarding requests

9. What is wrong in many Phase 6 builds

Mistake 1 — Advanced GPS too early

Wrong

Constant high-frequency streaming

Live animated route

Road snapping

Real-time predictive movement

Heavy battery usage

Correct

Start location

Periodic GPS points

End location

Approximate duration

Approximate distance

Signal status

Photo/video evidence

Android supports regular fused-location updates, but background location can significantly affect battery life. Sampling, batching and foreground-service behaviour should be controlled carefully.

Production rule

Tracking quality should be:

COMPLETED

COMPLETED_WITH_GAPS

FALLBACK_VERIFIED

ADMIN_REVIEW_REQUIRED

Do not automatically accuse a sitter because GPS failed.

Mistake 2 — No backup-sitter system

Wrong

Primary sitter cancels

↓

Admin manually searches WhatsApp contacts

↓

Customer waits without updates

Correct

Primary becomes unavailable

↓

Replacement event created

↓

Eligible candidates generated

↓

Travel and schedule revalidated

↓

Offer accepted

↓

Customer approves

↓

Replacement assigned transactionally

Every important booking should have a continuity plan, but not every ordinary booking must reserve and pay a hard-standby sitter.

Use:

Candidate backup for routine bookings

Soft standby for higher-risk bookings

Hard standby for exceptional, premium or critical bookings

Mistake 3 — Notifications without escalation

Wrong

Reminder sent

↓

No response

↓

Nothing happens

Correct

Reminder sent

↓

Acknowledgement deadline

↓

No response

↓

Admin alert

↓

Backup options generated

↓

Contact, replace, reschedule or cancel

WhatsApp, push or SMS delivery is not the same as workflow completion.

The system must track:

Message delivered?

Action completed?

Deadline passed?

Admin notified?

Mistake 4 — Manual Report Cards

Wrong

An administrator copies sitter notes, images and timing data into a formatted report after every service.

Correct

Service completed

↓

System adds booking and tracking facts

↓

Sitter adds structured care observations

↓

Validation runs

↓

Concern routes to review

↓

Report delivered automatically

Automatically populate:

Start/end time

Duration

Distance

Sitter

Pet

Media

Tracking state

Require sitter input for:

Water

Toilet

Mood

Behaviour

Concern

Human note

Mistake 5 — Incidents remain in WhatsApp chats

Wrong

“Dog looked unwell”

buried inside a support conversation

Correct

Create:

Incident ID

Booking

Pet

Sitter

Category

Subtype

Severity

Original description

Evidence

Owner

Timeline

Resolution

Corrective action

WhatsApp may be a reporting channel, but the database must hold the authoritative incident record.

10. Recommended rollout priority

Do not activate every city-specific configuration simultaneously.

Stage 1 — One launch city

Validate:

Notifications

Tracking

Backup workflow

Report Cards

Incidents

Refunds

Reliability scoring

Stage 2 — Second city with a different operating challenge

Example:

Ahmedabad:

WhatsApp and trust workflow

or

Mumbai:

Hyperlocal travel and backup workflow

Stage 3 — Package-heavy market

Example:

Pune:

Walking plans and credit management

Stage 4 — Premium and boarding variants

Example:

Gurugram:

Society and premium safety controls

Surat:

Assisted booking and boarding reports

Bengaluru should be activated only when the app’s responsiveness, tracking and operational alerts can satisfy a demanding, congestion-heavy operating environment.

11. City experiment framework

For every city-specific feature, define:

Hypothesis

Target customer

Active areas

Feature configuration

Success metric

Failure threshold

Pilot duration

Decision

Example

Hypothesis:

Ahmedabad customers receiving WhatsApp Report Card

notifications will view reports more often.

Experiment:

50 completed bookings

Control:

In-app + email

Variant:

WhatsApp utility notification + secure report link

Success:

15% higher Report Card view rate

Failure:

Higher support complaints or opt-outs

This converts assumptions into evidence.

12. City readiness matrix

### Table 176

| City | Primary Phase 6 system | Hard requirement before launch |
| --- | --- | --- |
| Bengaluru | Automation and tracking | Stable status, alerts and support |
| Pune | Plans and scheduling | Credit ledger and capacity control |
| Mumbai | Hyperlocal assignment | ETA matching and backup recovery |
| Gurugram | Verification and society access | Accurate badges and escalation |
| Ahmedabad | WhatsApp-first operations | Approved templates and secure links |
| Surat | Assisted booking and boarding | Admin consent flow and daily reports |

13. Definition of done

The city-specific Phase 6 system is ready only when:

Configuration

City and area rules are stored in configuration.

City logic is not scattered across frontend components.

Policy changes are versioned.

Area capacity can be enabled or paused.

Matching

Travel duration is used alongside distance.

Sitter permissions remain mandatory.

City configuration cannot override safety rules.

Backup candidates are revalidated before assignment.

Notifications

Each city has a primary and fallback channel.

Failed customer action creates escalation.

WhatsApp templates are properly categorised.

Sensitive data remains behind authenticated access.

Tracking

Basic tracking works without excessive battery use.

Tracking is restricted to active services.

GPS failure has a fallback.

Customer sees approximate, honest proof.

Reporting

Report Cards are automatically structured.

City-specific tone does not alter safety facts.

Boarding and walking reports remain service-specific.

Concerns create incident review.

Measurement

Every city hypothesis has a metric.

Behaviour is measured by area and service.

Unsupported assumptions are removed.

Expansion depends on completed bookings, quality and repeat demand.

Final operating principle

Build one trustworthy PetSaathi operating system, then configure it for each city’s measured travel, communication and service conditions. Do not turn untested city assumptions into permanent product rules.PetSaathi Phase 6 — Final Upgrade Decisions and Approved Deliverables 🐾🛡️

Executive decision

All five upgrades are valuable, but only Upgrades 1 and 2 should be approved exactly as proposed.

Upgrades 3, 4 and 5 require modifications:

### Table 177

| Upgrade | Decision | Final treatment |
| --- | --- | --- |
| Basic GPS tracking | Approve | Basic evidence tracking only |
| Automated Report Cards | Approve | Mandatory for completed services |
| Backup sitter | Approve with modification | Mandatory continuity plan, not always a reserved person |
| Reliability score | Approve with safeguards | Influences ranking; never decides eligibility alone |
| Incident tickets | Approve with classification change | Safety incidents mandatory; ordinary complaints use separate records |

The final Phase 6 principle should be:

Automate routine operations, preserve human control over safety and financial decisions, and ensure every important failure becomes structured, visible and auditable.

Upgrade 1 — Basic GPS tracking

Decision: Approve

Phase 6 should use:

Start location

↓

Periodic GPS points

↓

Signal-quality monitoring

↓

End location

↓

Approximate duration and distance

↓

Report Card evidence

Do not build an Uber-style live-tracking system during this phase.

Why this is the correct scope

Basic tracking provides enough evidence to answer:

Did the walk start?

When did it start and finish?

Was movement recorded?

What was the approximate distance?

Were there major GPS gaps?

Did the sitter submit supporting media?

High-frequency background location can consume significant battery, and Android explicitly recommends controlling update frequency, stopping location updates when they are no longer needed and requesting background access only when the feature genuinely requires it. Android also restricts background collection and foreground-service startup under modern OS versions.

Approved tracking scope

Build now

Assigned-sitter authorization

Arrival confirmation

Start Walk

Start location

Periodic points every configured interval

Offline point queue

End location

End Walk

Server-calculated duration

Approximate distance

Signal-gap reporting

Customer-visible tracking status

Admin diagnostic view

Do not build yet

Second-by-second map animation

Predictive ETA

Complex road snapping

Continuous route streaming

AI route-quality scoring

Wearable-device integration

Permanent customer access to exact routes

Required tracking states

READY

STARTING

ACTIVE

SIGNAL_WEAK

SIGNAL_LOST

FALLBACK_REQUIRED

COMPLETED

COMPLETED_WITH_GAPS

FAILED

ADMIN_REVIEW_REQUIRED

Required privacy controls

Tracking starts only after an authorised service begins.

Only the assigned sitter can submit points.

Tracking stops immediately when service ends.

Customers see only their own booking.

Raw coordinates do not appear in general application logs.

Removed sitters lose access.

Old tracking data follows a documented retention policy.

Media and routes are not automatically used for marketing.

Customer wording

Use:

Approximate distance: 1.4 km

Do not use:

Exact distance: 1.435272 km

GPS positions include an accuracy radius and are not perfectly exact.

Approval statement

Approved: Phase 6 will implement basic GPS tracking using start/end locations, periodic GPS points, approximate distance, duration and fallback evidence. Full live-map tracking is deferred.

Upgrade 2 — Automated Report Card generator

Decision: Approve and make mandatory

Every successfully completed service should produce:

An automatically generated Report Card draft

Structured sitter observations

Customer delivery

Safety escalation when a concern is reported

The Report Card should not require an administrator to manually copy timing, media and sitter notes into a document.

Correct generation flow

Service completed

↓

System creates draft

↓

Booking facts added automatically

↓

Tracking facts added automatically

↓

Sitter adds structured observations

↓

Validation runs

↓

Concern check

↓

Customer delivery or admin review

Automatically populated fields

The sitter should not manually enter:

Booking ID

Pet

Service type

Sitter

Scheduled time

Actual start time

Actual end time

Duration

Approximate distance

Tracking quality

Uploaded media

Sitter-provided fields

The sitter should complete:

Food update

Water update

Pee/poop update

Mood

Behaviour

Leash behaviour

Medication task

Safe handover

Concern flag

Human note

Service-specific requirements

### Table 178

| Field | Dog walking | Pet sitting | Boarding |
| --- | --- | --- | --- |
| Start/end time | Required | Required | Required |
| Duration | Required | Required | Required |
| Approximate distance | Required when available | No | No |
| Water | Required | Required | Required |
| Food | Optional | Required where scheduled | Required |
| Toilet | Required | Optional/conditional | Required |
| Mood/behaviour | Required | Required | Required |
| Media | Required by policy | Required | Daily minimum |
| Concern | Required | Required | Required |
| Sitter note | Required | Required | Required |

Mandatory does not mean automatic customer delivery in every case

The Report Card draft should always be created, but delivery may pause when:

Injury is reported

Pet escaped or attempted to escape

Bite occurred

Serious illness was observed

Medication task failed

Tracking or timestamps materially conflict

Sitter reports unsafe conditions

An incident is already active

In those cases:

Report status = ADMIN_REVIEW_REQUIRED

Approved Report Card states

AUTO_GENERATED

SITTER_IN_PROGRESS

SUBMITTED

ADMIN_REVIEW_REQUIRED

RETURNED_FOR_CORRECTION

DELIVERED

AMENDED

Important completion rule

A booking should not normally become operationally complete until:

Service completed

+

Report Card delivered

+

No unresolved critical incident

A documented admin exception may be used when the sitter cannot submit the report, but the reason must be audited.

Approval statement

Approved: Automated Report Cards will be mandatory for every completed service. The system will generate the format automatically, while the sitter supplies structured care observations. Safety concerns will require review before normal delivery.

Upgrade 3 — Backup sitter for high-priority bookings

Decision: Approve with modification

Do not make a physically reserved backup sitter mandatory for every listed booking. Instead, make a continuity plan mandatory.

There are three levels:

### Table 179

| Coverage | Meaning |
| --- | --- |
| Candidate coverage | Eligible replacements identified |
| Soft standby | Sitter informed and potentially available |
| Hard standby | Capacity formally reserved, possibly compensated |

Why the distinction matters

Hard standby has real operational cost:

The sitter may need to reject another booking.

A time window is reserved.

Compensation may be required.

Supply utilisation decreases.

Several bookings may compete for the same backup.

Therefore, mandatory hard standby should be limited to bookings where service failure would create substantial customer, safety or financial impact.

Approved coverage rules

Boarding

Mandatory continuity plan: Yes

Recommended:

Primary host

Backup host or alternative care plan

Operations owner

Emergency contact

Vet/emergency-clinic reference

Use hard standby when:

Stay is high value

Pet has controlled medical needs

Customer is travelling and cannot return quickly

Festival demand is high

Host capacity is difficult to replace

First-time customer booking

Mandatory candidate coverage: Yes

A reserved backup is not always necessary.

Require:

Two or more eligible replacement candidates where supply permits

Named operations owner

Faster escalation

Confirmation monitoring

Premium booking

Mandatory coverage: Yes

Premium service may include:

Priority replacement search

Soft standby

Shorter support SLA

Stronger evidence/reporting

Service-recovery credit

Do not advertise “backup sitter guaranteed” unless actual capacity has been reserved.

Morning/evening peak walks

Mandatory candidate coverage: Conditional

Apply when:

Locality has sufficient sitter supply

Customer is new

Primary sitter has limited history

Booking is recurring or commercially important

Service time is hard to reschedule

Traffic or weather creates elevated delay risk

Final coverage matrix

### Table 180

| Booking type | Candidate backup | Soft standby | Hard standby |
| --- | --- | --- | --- |
| Normal established-customer walk | Recommended | No | No |
| First booking | Required where supply exists | Optional | No |
| Peak recurring walk | Required | Conditional | No |
| Premium walk/sitting | Required | Recommended | Conditional |
| Boarding | Required | Recommended | High-risk cases |
| Medically complex care | Required | Recommended | Case-specific |
| Critical travel booking | Required | Required | Consider |

Correct replacement flow

Primary fails readiness check

↓

Replacement event created

↓

Backup candidates revalidated

↓

Offer sent

↓

Eligible sitter accepts

↓

Customer approves where required

↓

Assignment changes transactionally

↓

Old sitter access revoked

Important safeguards

A backup must pass the same checks as a primary sitter:

Service permission

Pet-size permission

Required handling controls

Medication capability

Verification status

Safety status

Availability

Travel feasibility

Workload capacity

No schedule conflict

The highest-rated available person is not automatically the correct replacement.

Approval statement

Approved with modification: Every high-priority booking will require a documented continuity plan. Candidate or standby coverage will be selected according to service risk and operational importance; a hard-reserved backup will not be mandatory for every booking.

Upgrade 4 — Reliability score affects bookings

Decision: Approve with strong safeguards

A sitter’s reliability score should influence:

Candidate ranking

Assignment priority

Manual-review requirements

Booking limits

Coaching

Service-radius decisions

It must not independently decide:

Whether the sitter is safe

Whether the sitter is permitted for a service

Responsibility for an incident

Permanent suspension

Eligibility for a high-risk pet

Whether another required control can be ignored

NIST’s risk-management guidance recommends explicitly identifying where human oversight is required, documenting automated-system limitations and establishing governance around consequential automated decisions.

Correct assignment order

1. Service eligibility

2. Verification status

3. Pet and handling compatibility

4. Safety restrictions

5. Schedule availability

6. Travel feasibility

7. Workload capacity

8. Customer preference

9. Reliability ranking

10. Human review where required

Reliability is number nine—not number one.

Recommended score components

### Table 181

| Component | Weight |
| --- | --- |
| On-time performance | 25% |
| Accepted-booking completion | 20% |
| Avoidable cancellation/no-show | 10% |
| Report Card timeliness/quality | 15% |
| Adjusted customer experience | 15% |
| Eligible-offer response | 10% |
| Training and policy compliance | 5% |

Keep safety separate

Use:

Reliability score: 91

Safety status: CLEAR

or:

Reliability score: 94

Safety status: SAFETY_REVIEW

The second sitter must not receive normal assignments while the serious safety review remains open.

Approved reliability levels

### Table 182

| Score | Operational level | Default treatment |
| --- | --- | --- |
| Insufficient history | Provisional | Controlled assignments |
| 90–100 | Premium candidate | Higher ranking after eligibility |
| 80–89 | Reliable | Normal assignment |
| 70–79 | Coaching required | Reduced priority or targeted limits |
| 60–69 | Performance review | Manual assignments |
| Below 60 | Restricted review | Temporary pause may be considered |
| Any score + safety hold | Safety review | Score does not override hold |

Important modification to the proposal

Do not simply say:

Low-score sitters receive fewer bookings automatically.

Use:

Score declines

↓

Confidence/sample size checked

↓

Cause examined

↓

Customer-caused events excluded

↓

Performance-review alert

↓

Targeted action

Possible targeted actions:

Reduce service radius

Add travel buffer

Limit consecutive bookings

Require Report Card retraining

Pause premium services

Move to manual assignment

Schedule coaching

Review after next ten bookings

Minimum sample requirements

### Table 183

| Completed bookings | Confidence |
| --- | --- |
| 0–4 | Onboarding |
| 5–9 | Provisional |
| 10–24 | Limited |
| 25+ | Established |

A sitter with one five-star booking should not automatically outrank an established sitter with dozens of strong completed services.

Appeal and correction

The sitter should be able to see:

Measurement period

Score components

Included bookings

Excluded bookings

Main reason for decline

Required improvement

Review date

Correction/appeal action

Approval statement

Approved with safeguards: Reliability scores will influence ranking and booking priority only after service eligibility, safety, availability and compatibility checks. Low scores will trigger evidence-based coaching or review, not automatic permanent punishment.

Upgrade 5 — Mandatory incident tickets

Decision: Approve with classification modification

Every material safety issue must become an incident ticket.

However, not every ordinary complaint, small delay or minor service problem should become a safety incident.

Use three related record types:

Operational exception

Customer complaint

Safety incident

Google SRE guidance recommends structured incident-management processes, clear ownership and documented post-incident analysis so organisations can understand contributing causes and implement preventive action. Consistent incident templates also make trend analysis possible.

1. Operational exception

Examples:

Sitter acknowledgement late

Report Card overdue

WhatsApp failed

Payment link expired

GPS signal weak

Minor schedule adjustment

Record as:

booking_exception

admin_alert

workflow_event

Escalate to incident only if the exception creates safety, serious service or repeated reliability risk.

2. Customer complaint

Examples:

Communication was poor

Customer disliked the update quality

Refund explanation was confusing

Sitter was slightly late

Customer expected different service

Create:

complaint ticket

A complaint can be linked to an incident if safety information emerges.

3. Mandatory safety incident

Create an incident ticket for:

Pet injury

Bite or attempted serious bite

Pet missing or escape

Medical emergency

Severe illness observed

Medication error

Unsafe handling

Sitter no-show affecting pet safety

Serious customer misinformation

Property danger

Unauthorized sitter substitution

Serious privacy exposure

Service falsification

Repeated major service failure

Late-arrival correction

The proposal says any late arrival must become an incident.

Modify it:

### Table 184

| Late event | Record type |
| --- | --- |
| Two minutes late, customer informed | Performance event |
| Repeated avoidable lateness | Complaint/performance alert |
| Fifteen minutes late with no communication | Operational incident or complaint |
| No-show leaving pet without care | Safety/service incident |
| Delay causes medication or health risk | Safety incident |

Mandatory incident fields

Incident ID

Booking

Pet

Sitter

Reporter

Original description

Category

Subtype

Severity

Immediate-danger state

Evidence

Incident owner

Customer-contact status

Timeline

Containment

Resolution

Corrective actions

Incident states

REPORTED

TRIAGE_REQUIRED

ACTIVE

CONTAINMENT_IN_PROGRESS

CONTAINED

INVESTIGATING

CUSTOMER_FOLLOWUP

CORRECTIVE_ACTION_PENDING

RESOLVED

CLOSED

REOPENED

WhatsApp role

WhatsApp may be used to:

Receive initial reports

Notify operations

Communicate with customer/sitter

Share secure record links

It must not remain the authoritative incident database.

WhatsApp report

↓

Structured incident created

↓

Incident ID returned

↓

Timeline and evidence preserved

Post-incident review

Require formal review for:

Level 3 incident

Lost pet

Serious bite

Significant injury

Major medication failure

Serious privacy event

Repeated Level 2 issue

Systemic failure affecting multiple bookings

The review should record:

Impact

Timeline

Detection

Response

Contributing factors

Root cause

What worked

What failed

Corrective actions

Owners

Deadlines

Verification

Approval statement

Approved with modification: Structured incident ticketing will be mandatory for all safety issues and material service failures. Ordinary complaints and minor operational exceptions will use separate records, with escalation into an incident when safety or material service risk is identified.

Final approved Phase 6 decisions

### Table 185

| Rule | Official decision |
| --- | --- |
| Basic GPS instead of full live map | Approve |
| Automated Report Card generator | Approve — mandatory |
| Backup coverage for high-priority bookings | Approve — risk-based continuity plan |
| Reliability score affects assignment priority | Approve — ranking support with human oversight |
| Structured incident tickets | Approve — mandatory for safety/material failures |

Updated Phase 6 final deliverables

P0 — Required for Phase 7 readiness

### Table 186

| Deliverable | Decision |
| --- | --- |
| Automated booking reminders | Required |
| Admin alert system | Required |
| Automated Report Card | Required |
| Backup/replacement workflow | Required |
| Incident dashboard | Required |
| Cancellation/refund workflow | Required |
| Customer trust dashboard | Required |
| Support SOP | Required |
| Safety SOP | Required |
| Payment and webhook reconciliation | Required |
| Role-based access and audit logs | Required |

P1 — Required for controlled scale

### Table 187

| Deliverable | Decision |
| --- | --- |
| Basic GPS tracking | Required for dog walking |
| Sitter reliability score | Required |
| Sitter performance dashboard | Required |
| Backup candidate coverage | Required for priority bookings |
| Report Card media workflow | Required |
| Notification fallback | Required |
| Incident postmortem workflow | Required for serious cases |

Deferred beyond Phase 6

Full Uber-style tracking

Automatic high-risk sitter assignment

AI safety decisions

AI incident responsibility decisions

Automatic permanent sitter suspension

Fully automated refunds

Universal hard-reserved backup sitter

Native mobile apps solely for visual polish

Final architecture

Customer booking

↓

Payment verified

↓

Eligible primary sitter assigned

↓

Continuity coverage evaluated

↓

Notifications and readiness checks

↓

Start service

↓

Basic tracking and media evidence

↓

End service

↓

Automated Report Card

↓

Customer review

↓

Reliability data updated

↓

Repeat booking offer

Exception path:

Missed acknowledgement / delay / complaint

↓

Operational exception created

↓

Admin alert

↓

Backup or support action

Safety path:

Injury / escape / bite / emergency

↓

Mandatory incident ticket

↓

Severity and owner assigned

↓

Containment

↓

Customer and emergency coordination

↓

Refund/payout review

↓

Resolution and corrective actions

Phase 6 definition of done

Phase 6 is ready only when:

Tracking

Basic GPS works for authorised walks.

Only one session can be active.

Tracking stops after completion.

Distance is labelled approximate.

Failure has a fallback workflow.

Report Cards

Every completed service creates a draft.

Structured inputs are mandatory.

Safety concerns pause normal delivery.

Customers can view private reports.

Report changes are versioned.

Backup coverage

High-priority bookings have continuity plans.

Candidates pass full eligibility checks.

Replacement is transactional.

Old sitter access is revoked.

Failed replacement has refund/reschedule options.

Reliability

Scores are explainable and versioned.

Sample size is visible.

Customer-caused events are excluded.

Safety status remains separate.

Consequential decisions retain human review.

Incidents

Safety incidents receive structured tickets.

Complaints and exceptions remain separately classified.

Critical incidents receive immediate ownership.

Original evidence is preserved.

Corrective actions are tracked.

Operations

Alerts escalate after missing action.

Admins can identify at-risk bookings.

Refund and cancellation states remain separate.

SOPs match the production system.

No critical workflow depends on WhatsApp memory or manual database editing.

Final operating principle

Approve automation where it improves consistency and evidence; retain human control where a decision affects safety, money, access to work or customer rights.

Simple explanation for professor

“Five upgrades were proposed for Phase 6.

First, basic GPS tracking is approved. The system will record the start location, periodic location points, end location, duration and approximate distance. We will not build a complex Uber-style live map because it would increase battery usage and development complexity.

Second, automated Report Cards are approved and will be mandatory. The system will automatically add the booking, sitter, start time, end time, duration, tracking and media. The sitter will add structured information about water, toilet updates, mood, behaviour and concerns.

Third, backup-sitter support is approved with a modification. Every high-priority booking will have a continuity plan, but PetSaathi will not reserve and pay a backup for every normal booking. Boarding, premium and critical bookings may use stronger standby coverage.

Fourth, the reliability score is approved, but it will not control safety decisions alone. It will help rank eligible sitters. Service permission, pet compatibility, availability, distance and safety status will always be checked before the score.

Finally, structured incident tickets are approved. Pet injuries, bites, escape, medical emergencies and serious service failures must become incident records. Small delays or ordinary complaints will use separate complaint or operational-exception records and will be escalated only when they create a significant risk.

These decisions allow Phase 6 to improve trust, automation and service quality without creating unsafe fully automated decisions.”

PetSaathi Phase 6 — Dashboard, Final Report and Phase 7 Decision Framework 📊🐾

Executive decision

Your Phase 6 dashboard and deliverables are fundamentally correct, but the release decision should not be based on simple daily percentages alone.

PetSaathi should operate with three measurement layers:

Daily operations: What requires attention now?

Rolling quality: Is reliability improving over 7, 14 and 30 days?

Phase 7 release gate: Is the platform safe and stable enough for society partnerships?

Google’s SRE guidance recommends defining service-level indicators around the reliability customers actually experience, setting explicit objectives, and using the resulting error budget to decide when expansion should pause in favour of reliability work.

Daily operational dashboard

↓

Rolling 7/30-day quality trends

↓

Safety, finance and security blockers

↓

Minimum sample-size review

↓

GO / CONDITIONAL GO / NO-GO

1. Correct Phase 6 dashboard structure

A. Live operations

This section answers:

What is happening today, and where must an admin intervene?

Show:

Today’s confirmed bookings

Services starting in 30 minutes

Active tracked walks

Missing sitter acknowledgements

Late-service alerts

Backup required

Open P0/P1 incidents

Payment exceptions

Pending Report Cards

Failed notification workflows

B. Reliability and quality

This section answers:

Are services becoming more consistent?

Show rolling:

7-day result

30-day result

Previous-period comparison

Target

Sample size

Trend

Main failure reason

C. Safety and finance

Show:

Incidents by severity

Incident response and resolution times

Refund requests

Refund failures

Refund disputes

Captured payments awaiting reconciliation

Payouts on hold

Open safety reviews

Razorpay exposes distinct refund lifecycle events, including refund.created, refund.processed and refund.failed. The provider’s processed event—not merely admin approval—should determine final refund completion.

D. Phase 7 readiness

Show each requirement as:

PASS

AT RISK

FAIL

INSUFFICIENT DATA

Do not display a green result when the denominator is too small to support a meaningful conclusion.

2. Correct definitions for daily metrics

Metric 1 — Active bookings tracked

Proposed target

90%+

Correct denominator

Use only bookings that:

Require GPS tracking

Reached SERVICE_STARTED

Were not converted to a non-tracked service

Were not cancelled before tracking began

Usually this means dog-walking bookings—not all PetSaathi bookings.

Recommended formula

Tracked-service rate =

Bookings with:

• valid start event

• valid end event

• usable GPS route OR approved fallback evidence

÷

All tracking-required services that started

× 100

Track three separate results

### Table 188

| Metric | Meaning |
| --- | --- |
| Tracking initiated | Valid session started |
| Usable route | Enough accepted GPS evidence |
| Proof coverage | Route or approved fallback evidence |

Recommended launch targets:

Tracking initiated: 95%+

Usable route: 90%+

Route or fallback proof: 98%+

Do not count a session as successful merely because a tracking_sessions row exists.

Additional safety metric

Tracking active after service completion = 0

Android warns that background location can significantly affect battery life and recommends applying timeouts and stopping updates when they are no longer needed.

Metric 2 — Report Cards generated

Proposed target

98%+

Important correction

Measure customer-delivered reports, not only generated drafts.

Use:

Report Card completion rate =

Completed services with a valid Report Card delivered

within the defined SLA

÷

All completed services requiring a Report Card

excluding authorised documented exceptions

× 100

Track the funnel:

Draft generated

→ Sitter submitted

→ Validated

→ Delivered

→ Customer viewed

Recommended targets:

### Table 189

| Stage | Target |
| --- | --- |
| Draft generated | 99%+ |
| Sitter submitted | 98%+ |
| Delivered within SLA | 98%+ |
| Concern correctly routed | 100% |

A safety-related report paused for admin review is not a failure if it was correctly routed and delivered after review.

Metric 3 — Sitter on-time rate

Proposed target

95%+

Correct definition

Define on-time using a configured grace period.

Example:

Dog walking:

actual check-in or approved arrival

within 5 minutes of scheduled start

Boarding/pickup:

service-specific grace period

Formula

On-time rate =

Eligible bookings starting within the approved window

÷

All completed or attempted eligible bookings

× 100

Exclude verified delays caused by:

Customer unavailable

Incorrect customer address

Society security delay

Customer-requested postponement

Platform scheduling failure

Active emergency response

Also track:

Median delay

P90 delay

Late over 10 minutes

No-show rate

Averages alone can hide severe long-tail failures. Google SRE recommends using percentiles because median and higher-order percentiles reveal different parts of the customer experience.

Metric 4 — Reminder delivery success

Proposed target

95%+

Important correction

“Delivery success” contains several different events:

Workflow created

Job executed

Provider accepted

Message delivered

Customer acted

These must not be combined.

Track:

### Table 190

| Metric | Suggested target |
| --- | --- |
| Eligible reminder workflows created | 99%+ |
| Jobs executed before deadline | 99%+ |
| Primary-channel provider acceptance | 98%+ |
| Confirmed delivery where supported | 95%+ |
| Critical fallback success | 99%+ |
| Obsolete reminders after cancellation | 0 |
| Duplicate customer-visible reminders | Near zero |

The most meaningful business metric is:

Required action completed before deadline

For example, a WhatsApp message may be delivered successfully while the sitter still fails to acknowledge the booking.

Metric 5 — Admin alerts resolved

Proposed target

Same day

Required modification

Different alert severities require different SLAs.

### Table 191

| Priority | Example | Acknowledge | Target mitigation |
| --- | --- | --- | --- |
| P0 | Lost pet, serious injury | Immediate | Immediate containment |
| P1 | No-show, replacement required | Under 5 minutes | Same service window |
| P2 | Report overdue, refund failed | Under 30 minutes | Same shift/day |
| P3 | Reliability decline | One business day | Scheduled review |

Track:

Time to acknowledge

Time to assign

Time to mitigate

Time to resolve

Unowned alert count

Reopened alert count

Google SRE recommends that urgent alerts be actionable and tied to meaningful customer-impacting conditions; less urgent work should go to ticket or review queues instead of paging humans unnecessarily.

The mandatory metric is:

Unowned P0/P1 alerts = 0

Metric 6 — Incidents created properly

Proposed target

100%

Correct definition

Not every complaint or two-minute delay should be classified as a safety incident.

Use:

Incident-record completeness =

Qualifying safety/material failures

converted into structured incident records within SLA

÷

All identified qualifying events

× 100

Qualifying events include:

Pet injury

Bite

Pet missing or escape

Medical emergency

Unsafe handling

No-show creating pet-care risk

Serious privacy exposure

Medication failure

Deliberate service falsification

Material repeated service failure

Track separately:

Operational exceptions

Customer complaints

Safety incidents

Required targets:

### Table 192

| Control | Target |
| --- | --- |
| Qualifying incidents ticketed | 100% |
| Level 2/3 incidents with owner | 100% |
| Original evidence preserved | 100% |
| Serious incidents with corrective actions | 100% |

Metric 7 — Refund disputes

Proposed target

Below 3–5%

Important correction

Separate three metrics:

Refund request rate

Refund requests ÷ paid bookings

Refund dispute rate

Escalated refund complaints or payment disputes

÷ paid bookings

Refund processing failure rate

Provider-failed refund attempts

÷ approved refund submissions

Recommended targets:

### Table 193

| Metric | Target |
| --- | --- |
| Refund/dispute rate | Below 3–5% |
| Duplicate refunds | 0 |
| Refund above available balance | 0 |
| Approved refunds submitted promptly | 95%+ |
| Provider failures detected | 100% |
| Unreconciled processed refunds | 0 |

Razorpay supports idempotent refund requests, allowing safe retries without creating multiple refunds. Its webhook guidance also requires handling duplicate and potentially out-of-order events carefully.

Metric 8 — Backup-sitter coverage

Proposed target

80%+ priority bookings

Correct definition

A booking is covered only when the continuity plan is currently usable.

Backup-coverage rate =

Priority bookings with:

• at least one eligible candidate,

• soft standby,

• hard standby,

or approved alternative recovery plan

÷

All priority bookings

× 100

The candidate must still be:

Verified

Service eligible

Risk-control compatible

Available

Within travel-time limit

Free from schedule conflict

Outside an active safety restriction

Suggested target:

### Table 194

| Booking | Target |
| --- | --- |
| Boarding | 100% continuity plan |
| Medical/high-risk care | 100% |
| Premium bookings | 90%+ |
| Other priority bookings | 80%+ |

Do not count an outdated candidate list generated several days earlier as active coverage.

Metric 9 — Customer rating

Proposed target

4.6+

Required safeguards

Display:

Average rating

Median rating

Rating distribution

Review count

Review response rate

Service type

Area

New vs repeat customer

Example:

Average rating: 4.7

Reviews: 12

Review response: 34%

is not equivalent to:

Average rating: 4.7

Reviews: 240

Review response: 68%

Recommended gate:

4.6+ with a meaningful eligible sample

and no unresolved pattern of serious complaints

A high average rating must not override open safety failures.

Metric 10 — Repeat-booking rate

Proposed target

35%+

Correct cohort definition

Do not calculate repeat rate from today’s completed bookings because many customers have not yet had enough time to return.

Use:

Repeat booking rate =

Eligible first-time customers

who completed another paid service

within 30 or 60 days

÷

All first-time customers whose repeat window has matured

× 100

Track separately:

Repeat request

Repeat payment

Second service completed

Same-sitter repeat

Package purchase

Package credit used

The strongest metric is:

Second paid service completed

A five-walk package purchase is not successful retention if the customer never uses the credits.

3. Additional metrics missing from the dashboard

Admin workload reduction

This should be an official Phase 6 metric.

Admin workload reduction =

Phase 5 median admin minutes per completed booking

− Phase 6 median admin minutes per completed booking

÷ Phase 5 median

× 100

Measure separately:

Assignment time

Reminder follow-up

Report Card administration

Refund handling

Incident administration

Customer support contacts

Target:

30%+ reduction

without reducing safety or customer satisfaction

Google SRE defines toil as repetitive operational work that can be automated and encourages measuring and reducing it while maintaining reliable service.

Automation intervention rate

Bookings requiring manual correction

÷ total bookings

This shows where “automation” still depends on hidden admin labour.

Booking-state correctness

Target:

99.9%+

Examples of incorrect state:

Paid but still payment pending

Cancelled but tracking active

Two active primary sitters

Completed service with no report workflow

Refund processed but internal ledger unchanged

Security metrics

Add:

Cross-user data exposure: 0

Unauthorised tracking sessions: 0

Sensitive admin action without audit record: 0

Invalid role access accepted: 0

OWASP recommends object-level authorization checks whenever an API uses a user-supplied record identifier, and separately warns about broken function-level authorization for privileged administrative actions.

4. Recommended dashboard scorecard

### Table 195

| Metric | Target | Hard gate? |
| --- | --- | --- |
| Tracking initiated | 95%+ | Yes for dog walks |
| Route or approved fallback proof | 98%+ | Yes |
| Report Card delivered | 98%+ | Yes |
| Sitter on-time rate | 95%+ | Yes |
| No-show rate | Below 3–5% | Yes |
| Reminder workflow execution | 99%+ | Yes |
| Critical fallback success | 99%+ | Yes |
| Unowned P0/P1 alerts | 0 | Yes |
| Qualifying incidents ticketed | 100% | Yes |
| Duplicate refunds | 0 | Yes |
| Backup coverage for priority bookings | 80%+ | Yes |
| Boarding continuity plan | 100% | Yes |
| Customer rating | 4.6+ | Conditional |
| Completed-repeat rate | 35%+ | Growth gate |
| Admin workload reduction | 30%+ | Operational gate |
| Cross-user access incidents | 0 | Absolute gate |

5. Improved Phase 6 final report format

Phase 6 Safety and Automation Report

A. Report identity

Project name:

City:

Active areas:

Report period:

Phase 6 duration:

Prepared by:

Approved by:

Report version:

B. Scope

Active services:

Number of active sitters:

Number of trained sitters:

Number of admins:

Number of priority bookings:

GPS-required services:

C. Booking performance

Total booking requests:

Paid bookings:

Confirmed bookings:

Completed bookings:

Cancelled bookings:

No-shows:

Replacement-required bookings:

Successful replacements:

D. Tracking performance

Tracking-required bookings:

Tracking sessions started:

Tracking initiated rate:

Usable GPS routes:

Completed-with-gaps:

Approved fallback evidence:

Tracking active after completion:

Average tracking gap:

E. Report Card performance

Report drafts generated:

Reports submitted:

Reports delivered:

Reports delivered within SLA:

Reports requiring admin review:

Concern-linked reports:

Average report-delivery time:

F. Notifications and alerts

Reminder workflows scheduled:

Reminder jobs executed:

Primary-channel delivery rate:

Fallback usage:

Duplicate notifications:

Obsolete reminders:

P0 alerts:

P1 alerts:

Unowned P0/P1 alerts:

Median alert acknowledgement:

P90 alert acknowledgement:

G. Sitter reliability

Average sitter on-time rate:

Median delay:

P90 delay:

No-show rate:

Avoidable cancellation rate:

Report Card completion:

Sitters under coaching:

Sitters under safety review:

Most common reliability issue:

H. Continuity and backups

Priority bookings:

Bookings with candidate coverage:

Soft standby:

Hard standby:

Successful replacements:

Failed replacement attempts:

Boarding continuity coverage:

I. Incidents and complaints

Operational exceptions:

Customer complaints:

Level 1 incidents:

Level 2 incidents:

Level 3 incidents:

Average acknowledgement time:

Average containment time:

Average resolution time:

Reopened incidents:

Corrective actions overdue:

Top safety issue:

Use median and P90 response times in addition to averages, because extreme cases can be hidden by an average.

J. Refunds and cancellations

Cancellation requests:

Refund requests:

Approved refunds:

Processed refunds:

Partial refunds:

Failed refunds:

Refund disputes:

Duplicate refunds:

Average processing time:

Top cancellation reason:

K. Customer outcomes

Average customer rating:

Review count:

Review response rate:

Same-sitter repeat requests:

Second paid services:

30-day repeat rate:

60-day repeat rate:

Top customer complaint:

L. Operational efficiency

Phase 5 admin minutes per booking:

Phase 6 admin minutes per booking:

Admin workload reduction:

Bookings needing manual correction:

Top automation improvement:

Top remaining manual task:

M. Technical and security results

Core API error rate:

Tracking API error rate:

Background-job failure rate:

Unreconciled provider events:

Cross-user access findings:

Unauthorised admin actions:

Open P0 defects:

Open P1 defects:

Rollback tested:

N. Final assessment

Top automation improvement:

Top safety issue:

Top sitter reliability issue:

Top technical risk:

Top operational risk:

Known limitations:

Residual risks:

O. Decision

GO TO PHASE 7

CONDITIONAL GO

FIX AUTOMATION

IMPROVE SAFETY

REPEAT PHASE 6

NO-GO

Approved launch areas:

Approved services:

Maximum bookings per day:

Required manual controls:

Stop conditions:

Next review date:

6. Correct Phase 7 go/no-go criteria

Hard technical and safety gates

Phase 7 must not begin when any of these are unresolved:

Cross-customer data access

Unauthorised location tracking

Duplicate payment or refund risk

Two active primary sitters for one booking

Uncontrolled serious incident

No owner for critical alerts

Payment and booking states cannot be reconciled

Tracking cannot be stopped reliably

Report Card workflow regularly loses service evidence

Admins cannot perform replacement or refund procedures

P0 defects remain open

Required system gates

### Table 196

| Requirement | Required result |
| --- | --- |
| Service tracking stable | Pass |
| Report Card automation | Pass |
| Sitter reliability snapshots active | Pass |
| Backup/replacement workflow | Pass |
| Incident dashboard | Pass |
| Refund/cancellation workflow | Pass |
| Admin alert ownership | Pass |
| Role authorization and audit | Pass |
| Rollback/kill switches | Pass |
| SOP and training | Pass |

Operational targets

### Table 197

| Requirement | Target |
| --- | --- |
| Sitter on-time rate | 95%+ |
| Report Cards delivered | 98%+ |
| Priority backup coverage | 80%+ |
| Qualifying incidents ticketed | 100% |
| Admin workload reduction | 30%+ |
| No-show rate | Below 3–5% |
| Refund dispute rate | Below 3–5% |

Growth targets

### Table 198

| Requirement | Target |
| --- | --- |
| Customer rating | 4.6+ |
| Repeat booking | 35%+ |

Important correction

Customer rating and repeat rate should not be treated as absolute technical launch blockers when the sample is still small.

Example:

Rating: 4.8

Reviews: 8

Repeat window matured: 12 customers

This is insufficient data, not a clear Phase 7 pass.

If safety and operations pass but retention data is immature, use:

CONDITIONAL GO

with limited society pilots and booking caps.

7. Phase 7 decision model

GO

Approve when:

All hard gates pass

No P0 or launch-blocking P1 defect remains

Operational metrics meet targets

Rating and repeat data have reasonable sample sizes

Admin team can operate without developer intervention

SOPs and rollback controls are tested

CONDITIONAL GO

Use when:

Safety and financial controls pass

Automation is stable

Growth sample is still limited

Some P2 issues remain

More society-specific evidence is needed

Example controls:

One city

Two societies

Dog walking only

Maximum 10 bookings/day

Manual approval for boarding

Daily operations review

Two-week checkpoint

FIX AUTOMATION

Use when:

Reminders fail frequently

Report Cards require routine manual rebuilding

Job retries are invisible

Tracking does not end cleanly

Booking states require developer correction

IMPROVE SAFETY

Use when:

Serious incidents lack ownership

Incident data is incomplete

Unsafe sitters remain assignable

Backup eligibility is not enforced

Tracking privacy is uncertain

REPEAT PHASE 6

Use when the system works in testing but has not been demonstrated on enough real bookings.

NO-GO

Use when any serious security, safety, assignment or financial-integrity issue remains.

8. Approval of the five Phase 6 rules

### Table 199

| Rule | Decision |
| --- | --- |
| Basic GPS tracking first | Approve |
| Automated Report Card generator | Approve — mandatory |
| Backup sitter for high-priority bookings | Approve as risk-based continuity coverage |
| Reliability score affects booking priority | Approve as a ranking input with human oversight |
| Incident ticketing mandatory | Approve for safety and material failures |

Conditions attached to approval

Basic GPS

Start/end events

Periodic points

Approximate distance

Approved fallback evidence

No tracking after service

Automated Report Cards

Required for every completed service

Customer delivery measured

Concern reports routed to safety review

Reports remain versioned

Backup coverage

Eligibility checked

Availability revalidated

Hard standby only where justified

Old sitter access revoked after replacement

Reliability score

Never overrides safety or service permissions

Uses sample-size confidence

Excludes customer-caused failures

Serious action requires human review

Incident ticketing

Mandatory for safety and material service failures

Complaints and routine exceptions remain separate

Every serious incident has an owner and corrective actions

9. Final approved Phase 6 recommendation

Build:

Semi-automated booking operations

+

Basic GPS proof

+

Automated Report Cards

+

Sitter acknowledgement and reminders

+

Risk-based backup coverage

+

Transparent sitter reliability scoring

+

Structured incidents and complaints

+

Admin-controlled refunds

+

Operational alerts

+

Customer trust dashboard

Do not build yet:

Uber-style continuous maps

Fully automatic sitter suspension

Fully automatic refund decisions

AI safety or incident decisions

Universal hard-reserved backups

Multi-city expansion before operational stability

Final Phase 6 win condition

PetSaathi can safely process a larger number of bookings from payment through service proof, Report Card, incident handling and repeat booking—without the founder manually supervising every normal service.

The correct signal is not that admins do nothing. The correct signal is:

Routine services run automatically

Exceptions become visible immediately

High-risk decisions remain human-controlled

Every important action is auditable

Final operating principle

Move to Phase 7 only when PetSaathi’s safety, payment, tracking and recovery systems are demonstrably reliable. Customer-growth metrics guide the size of the society rollout, but they must never override unresolved safety or security failures.

Because Phase 7 will involve live society partnerships, a daily automated readiness summary could track these gates and alert you immediately when any metric moves from Pass to At Risk.

Bottom of Form

## Representative rendered pages

- Page 1: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-1.png`

- Page 2: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-2.png`

- Page 3: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-3.png`

- Page 4: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-4.png`

- Page 5: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-5.png`

- Page 41: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-41.png`

- Page 81: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-81.png`

- Page 121: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-121.png`

- Page 161: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-161.png`

- Page 201: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-201.png`

- Page 241: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-241.png`

- Page 281: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-281.png`

- Page 321: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-321.png`

- Page 361: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-361.png`

- Page 401: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-401.png`

- Page 441: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-441.png`

- Page 481: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-481.png`

- Page 521: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-521.png`

- Page 561: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-561.png`

- Page 601: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-601.png`

- Page 641: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-641.png`

- Page 681: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-681.png`

- Page 721: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-721.png`

- Page 761: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-761.png`

- Page 801: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-801.png`

- Page 841: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-841.png`

- Page 881: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-881.png`

- Page 921: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-921.png`

- Page 961: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-961.png`

- Page 1001: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-1001.png`

- Page 1041: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-1041.png`

- Page 1081: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-1081.png`

- Page 1121: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-1121.png`

- Page 1161: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-1161.png`

- Page 1167: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-1167.png`

- Page 1168: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-1168.png`

- Page 1169: `analysis/specs/PetSaathi_Phase_5_and_6/pages/page-1169.png`
