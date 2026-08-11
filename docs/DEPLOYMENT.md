# PetSaathi Deployment Guide

## Vercel Deploy Steps
1. Push your code to the `main` branch.
2. Go to your Vercel Dashboard and click "Import Project".
3. Select your GitHub repository.
4. Set the Framework Preset to Next.js.
5. Expand "Environment Variables" and paste the contents of your `.env.local` (ensure you use production keys).
6. Click Deploy.

## Rollback Procedure
1. Go to Vercel Dashboard -> Deployments.
2. Find the last known good deployment.
3. Click the three dots -> "Promote to Production".
4. If database schema changes caused the issue, you may need to revert the schema manually or restore a MongoDB backup.

## Environment Variable Checklist
- [ ] `MONGODB_URI`
- [ ] `AUTH_SECRET`
- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `RESEND_API_KEY`
- [ ] `RESEND_FROM_EMAIL`
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- [ ] `RAZORPAY_KEY_SECRET`
- [ ] `RAZORPAY_WEBHOOK_SECRET`
- [ ] `NEXT_PUBLIC_SENTRY_DSN`
