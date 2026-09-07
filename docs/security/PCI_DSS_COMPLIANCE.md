# PetSaathi PCI-DSS Compliance & Payment Security Architecture

## 1. Executive Summary
PetSaathi operates under **PCI-DSS SAQ A** (Self-Assessment Questionnaire A) scope. 
- **Zero Cardholder Data (CHD)** or **Sensitive Authentication Data (SAD)** ever touches, transits, or resides on PetSaathi servers or databases.
- All payment capture is delegated exclusively to **Razorpay** (a PCI-DSS Level 1 certified Service Provider) via client-side hosted fields and standard checkout popups.

## 2. Architecture & Data Flow

```
+------------------+         1. Create Order          +-------------------+
|  PetSaathi App   | -------------------------------> | PetSaathi Backend |
| (Customer Browser|                                  |   (Next.js API)   |
|   / Mobile)      | <------------------------------- +-------------------+
+------------------+         2. Order ID (INR)                  |
        |                                                       | 3. Razorpay Orders API
        | 4. Launch Checkout Modal                              v
        |    (Direct iframe to Razorpay)              +-------------------+
        +-------------------------------------------> |     Razorpay      |
        |                                             |  (PCI Level 1)    |
        | <------------------------------------------ +-------------------+
        |    5. Tokenized Payment ID + Signature                |
        |                                                       |
        v                                                       | 6. Signed Webhook
+-------------------+                                           |    (HMAC SHA256)
| PetSaathi Backend | <-----------------------------------------+
| (Webhook Handler) |
+-------------------+
        |
        | 7. Signature Verified & Event Idempotently Claimed
        v
+-------------------+
|   MongoDB Atlas   | (Stores ONLY: providerPaymentId, providerOrderId, status, amountPaise)
+-------------------+
```

## 3. Compliance Controls Checklist

| Control Requirement | PetSaathi Implementation | Compliance Status |
| :--- | :--- | :---: |
| **Card Data Storage** | NEVER stored. Card number, CVV, expiry dates never enter backend memory or databases. | ✅ Compliant |
| **Webhook Signature Verification** | Validated via `crypto.createHmac("sha256", secret)` against raw body buffer before JSON parsing. | ✅ Compliant |
| **Replay & Idempotency Protection** | Compound unique index on `(provider, providerEventId)` and atomic attempt-claimer CAS. | ✅ Compliant |
| **TLS / Transport Security** | Strict TLS 1.3/1.2 enforced. Strict-Transport-Security (HSTS) with 2-year preload. | ✅ Compliant |
| **Live Credential Management** | `NEXT_PUBLIC_RAZORPAY_KEY_ID` (starts with `rzp_live_`) and `RAZORPAY_KEY_SECRET` loaded via environment variables. | ✅ Compliant |

## 4. Disaster Recovery & Reconciliation
- If a webhook delivery is delayed or dropped, the periodic reconciliation cron (`/api/jobs/reconciliation`) cross-checks unconfirmed orders with Razorpay's Orders API to guarantee consistency.
