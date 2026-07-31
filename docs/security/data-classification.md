# Data Classification Policy

To ensure privacy, compliance, and user safety, PetSaathi classifies all data into one of the following five categories. All systems, databases, and APIs must handle data according to its classification.

## 1. Public Data
- **Definition:** Information that can be freely viewed by anyone, including unauthenticated users.
- **Examples:** General marketing pages, verified partner public profiles (first name, bio, aggregate ratings, services offered), public corporate benefit descriptions, aggregated anonymized statistics.
- **Handling:** Can be cached aggressively at the CDN edge. No access controls required.

## 2. Private Data
- **Definition:** User-specific information that is not public but carries low risk if exposed.
- **Examples:** Customer first name, basic booking history (dates/services), communication preferences, wallet balances (non-identifying metadata).
- **Handling:** Requires standard user authentication (session/JWT) and Row Level Security (RLS) ensuring a user can only view their own data.

## 3. Sensitive Data
- **Definition:** Detailed personal or pet information that requires strict access control.
- **Examples:** Full names, exact residential addresses, phone numbers, email addresses, pet medical records (vaccinations, allergies), emergency contact details, chat logs between partners and customers.
- **Handling:**
  - Accessible only to the data owner (Customer).
  - Conditionally accessible to the assigned Partner only during the lifecycle of an active booking.
  - Accessible to Support staff only when resolving an active ticket or dispute.
  - Must not be logged in plain text in application logs or APM tools (e.g., Sentry).

## 4. Financial Data
- **Definition:** Transactional data related to payments, refunds, and bank accounts.
- **Examples:** Payment gateway order IDs, refund status, partner payout account details, Razorpay signatures, billing addresses.
- **Handling:**
  - Must be transmitted strictly over TLS 1.2+.
  - Highly restricted access. Only FINANCE and SUPER_ADMIN roles can view complete transaction flows.
  - Partner bank details must be vaulted or tokenized where possible.

## 5. Safety-Incident Data
- **Definition:** Records pertaining to emergencies, injuries, legal disputes, or trust & safety violations.
- **Examples:** Incident reports, photographic evidence of injury, dispute resolution notes, partner suspension reasons.
- **Handling:**
  - Highly restricted. Accessible only to specialized SUPPORT/Safety operators and SUPER_ADMIN.
  - Immutable audit logs must track who viewed or updated these records.
  - Retained according to legal requirements, bypassing standard user deletion requests if an active investigation exists.
