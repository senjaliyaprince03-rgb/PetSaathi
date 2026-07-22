CREATE UNIQUE INDEX "one_active_primary_assignment_per_booking"
ON public.booking_assignments (booking_id)
WHERE type = 'PRIMARY'::public."AssignmentType"
  AND status IN (
    'ACCEPTED'::public."AssignmentStatus",
    'CUSTOMER_APPROVED'::public."AssignmentStatus",
    'ACTIVE'::public."AssignmentStatus"
  );

ALTER TABLE public.bookings
ADD CONSTRAINT "booking_time_window_valid"
CHECK (scheduled_end > scheduled_start);

ALTER TABLE public.payments
ADD CONSTRAINT "payment_amount_positive"
CHECK (amount_paise > 0);

ALTER TABLE public.payouts
ADD CONSTRAINT "payout_amount_nonnegative"
CHECK (amount_paise + adjustment_paise >= 0);
