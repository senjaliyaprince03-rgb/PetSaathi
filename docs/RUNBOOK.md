# PetSaathi Runbook

## Incident Response

### Database Down (ECONNREFUSED)
1. **Symptom**: 500 errors across the site, API routes failing with Prisma Client Initialization errors.
2. **Action**: 
   - Check MongoDB Atlas Status Page.
   - Check Atlas Network Access (IP Whitelist) - ensure `0.0.0.0/0` is allowed for Vercel.
   - Check if `MONGODB_URI` environment variable is correct in Vercel.

### Payment Failures (Razorpay)
1. **Symptom**: Bookings stuck in "PAYMENT_PENDING" state, webhooks failing.
2. **Action**:
   - Check Razorpay Dashboard for webhook failures.
   - Verify `RAZORPAY_WEBHOOK_SECRET` in Vercel matches Razorpay dashboard.
   - Check Sentry for signature validation errors.

### Email Bounces (Resend)
1. **Symptom**: Users not receiving OTPs or booking confirmations.
2. **Action**:
   - Check Resend Dashboard for bounce rates.
   - Verify Domain DNS records (SPF, DKIM, DMARC) are still valid.
   - Ensure `RESEND_FROM_EMAIL` matches the verified domain.
