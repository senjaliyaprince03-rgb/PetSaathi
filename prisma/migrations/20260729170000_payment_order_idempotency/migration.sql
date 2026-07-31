CREATE UNIQUE INDEX "payments_one_active_order_per_booking_idx"
ON "payments" ("booking_id")
WHERE "status" IN ('CREATED', 'PENDING', 'AUTHORIZED', 'CAPTURED');
