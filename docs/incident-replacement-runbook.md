# Incident, no-show and replacement runbook

This runbook describes the implemented control path. It does not replace local emergency services, veterinary care, the final cancellation/refund policy or the approved Safety SOP.

## Incident lifecycle

1. A booking owner, assigned Saathi or authorised administrator reports a factual concern from the booking workflow.
2. The server creates the incident, append-only first event, audit record and participant/Safety notifications in one serializable transaction. If the booking state permits it, the booking moves to `INCIDENT_HOLD`.
3. Safety records contact attempts, veterinary involvement where applicable, transport/monitoring updates and evidence notes. Uploaded files remain private and quarantined until the configured scanner confirms MIME type and promotes them.
4. The controlled incident state machine must move through triage, response/monitoring, immediate-risk resolution and review. Direct `REPORTED → CLOSED` changes are rejected.
5. High and critical incidents require at least one owned, time-bound corrective action. Completion requires a recorded evidence note.
6. Closure requires owner communication, a review event, no open corrective actions and an explicit booking recovery state when the booking is held.

Incident closure cannot directly close a booking or bypass the care-report quality gate. Safety may resume the prior care state or send the booking to `REPLACEMENT_REQUIRED`. Completed care still closes only through approved report review.

## Saathi holds

- Safety or Super Admin may place a reasoned, incident-linked hold.
- An active, unexpired hold removes the Saathi from matching and acceptance eligibility without rewriting the Saathi profile or service permissions.
- Holds may have an expiry. Expired holds are ignored by matching and are normalised to `EXPIRED` before a new hold is placed.
- Release requires a reason and creates incident timeline, audit and Saathi notification records.
- Do not use a safety hold as an unreviewed permanent suspension. Permanent status or service-permission changes remain separate verification/governance decisions.

## Saathi cancellation and no-show recovery

### Saathi cancellation

Before travel begins, the confirmed Saathi records a reason. The transaction:

- changes the old assignment to `CANCELLED`;
- records `CONFIRMED → SITTER_CANCELLED → REPLACEMENT_REQUIRED` history;
- preserves the captured payment and held capacity reservation;
- notifies the customer and Operations.

After travel or care begins, the Saathi must contact Operations and use the incident workflow where safety or welfare is involved.

### Verified no-show

At or after the scheduled start, Operations may record a no-show only after verifying the missed arrival. The transaction:

- changes the old assignment to `NO_SHOW`;
- records `CONFIRMED/SITTER_EN_ROUTE → NO_SHOW → REPLACEMENT_REQUIRED` history;
- creates a service event and audit record;
- preserves the captured payment and capacity reservation;
- notifies the customer, Saathi and Operations queue.

No automatic suspension, penalty, refund or compensation is inferred. Those outcomes require the approved policy and a documented review.

### Replacement approval

Operations offers only a currently approved, service-permitted, risk-eligible, conflict-free Saathi without an active safety hold. The offer is stored as `REPLACEMENT`. After acceptance, the customer must approve the replacement. The server verifies the original captured payment and returns the booking directly to `CONFIRMED`; it never creates a second payment request.

If no replacement is available, Operations must open support/refund review. Automated cancellation and compensation remain fail-closed until final policy values are supplied.

## Integrity controls

- PostgreSQL permits only one active primary-or-replacement assignment per booking.
- Each incident notification has one unique linked outbox item. Its incident record mirrors the queued, sending, sent, failed or read delivery state; `acknowledged_at` records an authenticated recipient reading the in-app notice, not owner-contact or safety-case closure evidence.
- Closed incidents require `closed_at` and `closed_by`; non-closed incidents may not carry closure metadata.
- A completed corrective action requires evidence.
- A Saathi may have only one active safety hold, and released/expired holds require release metadata.
- Every sensitive incident, corrective-action, hold, no-show, cancellation and assignment decision creates an audit record.
- Capacity remains `HELD` during incident and replacement recovery. It is consumed only after approved care-report closure, or released through a separately authorised cancellation/refund path.

## Production inputs still required

- Approved emergency escalation contacts and on-call ownership.
- Final definitions and response targets for each severity.
- Final cancellation, refund, compensation and service-credit policy.
- Production storage buckets, scanner provider and callback secret.
- Approved notification templates and WhatsApp/voice escalation policy.
