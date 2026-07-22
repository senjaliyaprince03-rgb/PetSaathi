# Pricing, capacity and reconciliation runbook

This workflow is intentionally fail-closed. Seed data contains no commercial price, no launch area and no daily capacity. A customer can submit a booking only after three independently audited records exist.

## Roles and approval sequence

1. **Super Admin — market scope:** open `/admin/catalog`, create the city/locality and list every permitted six-digit PIN code. Choose `ACTIVE` only after the launch evidence is approved. PIN codes cannot overlap across non-closed areas in the same city.
2. **Finance Admin — immutable economics:** create a global fallback or area-specific price version. Enter the customer subtotal, Saathi amount, tax percentage, effective time, optional expiry and approval reason. Existing versions are never edited or deleted.
3. **Operations Admin — daily capacity:** select the active area, active service and India service date. Set the maximum supported bookings and record the roster/operating reason. Set an unreserved day to `0` to close it.

Area-specific prices take precedence over global prices. Within a scope, the latest effective version wins. A submitted booking includes the price-version ID the customer saw; the server rejects the request if a newer version became effective before commit.

## Booking transaction invariant

The booking endpoint uses a serializable PostgreSQL transaction. It rechecks pet/address ownership, active city and area, approved price, price-version ID and area/service/date capacity. One atomic commit then:

- increments the capacity counter only when `reserved + 1 <= maximum`;
- creates the booking and initial status history;
- records the accepted immutable `price_quote` with subtotal, tax, total and version breakdown;
- creates a one-to-one `capacity_reservation` hold.

Any failure rolls back all four records. Placeholder `service_types.base_price_paise` values are zero and never used for customer quotes or payment orders.

## Cancellation and rollback

- Before financial commitment, the customer may cancel online. The same transaction marks the booking `CUSTOMER_CANCELLED`, releases its capacity reservation and decrements the capacity counter.
- Once a payment is authorized/captured or disputed, cancellation fails closed and directs the customer to support so cancellation and refund policy are reviewed together.
- To stop a market immediately, Super Admin changes its area to `DRAFT` with a reason. This blocks new bookings without mutating historical quotes.
- To close a future unreserved service day, Operations sets its maximum to `0`. A maximum can never be set below existing reservations.
- Never delete or edit a price version. Correct a future price by approving a new version, and pause the area while Finance reviews any material error.

## Razorpay statement reconciliation

Finance opens `/admin/finance` and creates a half-open provider period: start is included, end is excluded. PetSaathi snapshots internal captured payments, completed refunds, paid payouts and net cash. Finance then enters the totals from the Razorpay statement plus its reference/review note.

The run becomes:

- `SUCCEEDED` when captured, refunded, paid-out and net totals all match;
- `FAILED` when any difference remains, preserving expected, actual and difference records for investigation.

Do not mark a failed run as successful by adjusting the statement inputs. Correct the underlying payment/refund/payout record through its controlled workflow, then create a non-overlapping reviewed period or follow the approved finance incident process.

## Owner inputs still required

| Input | Owner | Required before activation |
| --- | --- | --- |
| Customer subtotal by service/area | Product + Finance | Yes |
| Saathi payout amount by service/area | Operations + Finance | Yes |
| GST/tax basis points and invoice treatment | Finance + legal/tax adviser | Yes |
| Cancellation and refund windows | Product + Legal + Operations | Yes |
| Launch city, localities and PIN-code evidence | Operations | Yes |
| Daily capacity by service and roster | Operations | Yes |
| Razorpay production credentials and statement process | Finance + Engineering | Yes |

No secret value belongs in this document or source control. Configure provider secrets only in the approved Vercel, GitHub and Supabase secret stores listed in the deployment documentation.
