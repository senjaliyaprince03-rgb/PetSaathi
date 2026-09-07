# PetSaathi Environment Configuration Reference

| Variable Name | Required | Default / Format | Description |
|---|---|---|---|
| `NODE_ENV` | Yes | `development` / `production` | Node execution runtime mode |
| `MONGODB_URI` | Yes | `mongodb+srv://...` | Primary MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | Yes | 32+ char random string | Session encryption and JWT decryption key |
| `NEXTAUTH_URL` | Yes | `http://localhost:3000` | Canonical origin for authentication callbacks |
| `NVIDIA_API_KEY` | Yes | `nvapi-...` | NVIDIA NIM AI API token |
| `RAZORPAY_KEY_ID` | Yes | `rzp_test_...` | Razorpay public key ID |
| `RAZORPAY_KEY_SECRET` | Yes | 24+ char string | Razorpay secret for HMAC verification |
| `RAZORPAY_WEBHOOK_SECRET` | Yes | 24+ char string | Secret for validating webhook signatures |
| `CRON_SECRET` | Yes | 32+ char string | Bearer token securing internal cron jobs |
| `SENTRY_DSN` | No | `https://...@sentry.io/...` | Sentry error tracking endpoint |
| `UPSTASH_REDIS_REST_URL` | No | `https://...` | Distributed rate limiting store |
