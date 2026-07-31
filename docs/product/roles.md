# Role Matrix

This document defines the application roles and their capabilities within PetSaathi. Roles are strictly controlled in the database and never inferred from unverified browser storage or JWT claims alone.

## Base Roles

### 1. CUSTOMER
- **Description:** A pet owner using PetSaathi to book services.
- **Capabilities:**
  - Create and manage pet profiles (sensitive data restricted to self and assigned partners).
  - Search and match with verified partners.
  - Create bookings, make payments, and request refunds.
  - Leave testimonials (for completed bookings only).
  - View personal data, wallet, and loyalty benefits.
  - Report safety incidents related to their bookings.

### 2. SITTER (Partner)
- **Description:** A verified care provider offering services on the platform (internally referred to as SITTER).
- **Capabilities:**
  - Complete onboarding workflow (identity, address, capacity, pricing).
  - Receive matching offers and accept/decline booking requests.
  - View assigned customer and pet profiles during active bookings.
  - Receive payouts.
  - Report safety incidents related to their bookings.
  - *Must undergo human approval before becoming visible in search.*

### 3. PARTNER_MANAGER
- **Description:** Operational staff responsible for the supply side of the marketplace.
- **Capabilities:**
  - Review, approve, suspend, or reject partner onboarding applications.
  - Verify partner documents and credentials.
  - Manage and adjust partner capacity limits if necessary.
  - Add or remove specific service eligibility for a partner.

### 4. SUPPORT
- **Description:** Customer success and safety response operators.
- **Capabilities:**
  - View bookings, chat histories, and transaction statuses to resolve customer issues.
  - Handle incident reports (review evidence, enforce corrective actions, process escalations).
  - Execute booking state overrides (requires mandatory reason, identity tracking, timestamp, and audit record).
  - Approve routine refund requests (up to a defined threshold).

### 5. FINANCE
- **Description:** Team responsible for managing payments, reconciliation, and large refunds.
- **Capabilities:**
  - Access the finance dashboard (pending, paid, failed, refunded, disputed payments).
  - Execute or approve high-value refund cases.
  - Perform payment reconciliation and investigate webhook/idempotency failures.
  - Process partner payouts and manage corporate wallets.

### 6. SUPER_ADMIN
- **Description:** Highest privilege level for platform governance.
- **Capabilities:**
  - Perform all actions available to other administrative roles.
  - Modify system-wide configuration.
  - Assign or revoke administrative roles.
  - *Actions heavily audited.*

## Access Control Principles
- **Least Privilege:** Users only have access to data required for their role. Sensitive pet data is restricted to the customer, the currently assigned partner, and authorized support personnel.
- **Audit Logging:** Every sensitive action (refunds, overrides, status changes, role assignments, incident handling) must be securely logged with the actor's identity and timestamp.
- **Recent Authentication:** High-risk actions (payout edits, role changes, high-value refunds, account deletion) require recent user authentication.
