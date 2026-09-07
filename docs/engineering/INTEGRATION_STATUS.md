# PetSaathi — External Integrations & Production Boundaries

**Status:** Documented Operational Boundaries  
**Auditor:** Lead Staff Engineer & DevOps Architect

---

## 1. External Integrations Reference Table

| External Service | Purpose | Environment Variables | Sandbox / Fallback Behavior | Production Requirement |
| :--- | :--- | :--- | :--- | :--- |
| **Razorpay** | Payment Gateway, Webhooks, AutoPay | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | Test mode (`rzp_test_*`) works natively for testing. | Live merchant KYC approval and production webhook secret. |
| **Resend / SMTP** | Email OTP & Transactional Alerts | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `SMTP_USER`, `SMTP_PASS` | Falls back to local console logging in development (`[DEV] OTP is...`). | Live Resend API key with verified domain (`petsaathi.in`). |
| **Meta WhatsApp** | WhatsApp Booking Confirmation & OTP | `WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` | Mock fallback logger when unset. | Approved Meta Business Manager account & message templates. |
| **NVIDIA NIM** | AI Chatbot & Care Matching | `NVIDIA_API_KEY`, `NVIDIA_BASE_URL` | Returns mock suggestions if key is absent. | NVIDIA Developer Account API key with NIM model access. |
| **Sentry** | Crash & Error Observability | `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN` | Disabled in local dev if unset. | Sentry.io project DSN. |
| **DigiLocker / NIC** | Aadhaar KYC Verification | `DIGILOCKER_CLIENT_ID`, `DIGILOCKER_CLIENT_SECRET`, `DIGILOCKER_REDIRECT_URI` | Manual document upload & admin review fallback active. | DigiLocker Partner Portal registration approval. |
| **ClearTax** | GST e-Invoicing (IRN) | `CLEARTAX_API_KEY`, `CLEARTAX_GSTIN`, `CLEARTAX_BASE_URL` | Mock IRN generator active when unset. | ClearTax GSP enterprise contract & API token. |
| **MyGate** | Society Gate Access Pre-Approval | `MYGATE_API_TOKEN`, `MYGATE_API_BASE` | Digital QR Gate Pass screen active for security guards. | Society commercial agreement with MyGate/NoBrokerHood. |
| **ClamAV** | Malware File Scanning | `CLAMAV_HOST`, `CLAMAV_PORT`, `SCANNER_CALLBACK_SECRET` | File extension/MIME validation and quarantine active. | Running ClamAV TCP daemon (`clamd` on port 3310). |
