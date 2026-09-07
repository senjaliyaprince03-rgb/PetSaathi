# PetSaathi DPDP Act 2023 Compliance & Data Privacy Architecture

## 1. Statutory Context
PetSaathi complies with India's **Digital Personal Data Protection Act, 2023 (DPDP Act)** as a Data Fiduciary. The platform processes personal data of pet parents, pet care sitters (Saathis), and society residents across Indian tier-1 and tier-2 cities.

## 2. Consent Architecture (`src/modules/privacy/dpdp.ts`)
- **Granular Consent Capture**: User consents are captured with explicit purpose codes:
  - `PHOTO_CAPTURE`: GPS walk photo uploads and pet progress cards.
  - `LOCATION_TRACKING`: Precise GPS breadcrumb tracking during active walks only.
  - `MARKETING_COMMUNICATION`: WhatsApp/SMS pet care updates and special offers.
  - `PET_HEALTH_RECORDS`: Medical and vaccination profiles for emergency vet care.
- **Revocability**: Users may revoke any consent at any time via `/api/privacy/consent`. Superseded or revoked consents are immediately archived with timestamp and reason.
- **Audit Logging**: Every consent grant and revocation writes an immutable audit record in the MongoDB `auditLog` collection.

## 3. Data Subject Rights (DSR) & Right to Erasure
- **Data Subject Requests**: Users can file requests via `POST /api/privacy/dsr` with types:
  - `ACCESS`: Export of all personal data held.
  - `CORRECTION`: Rectification of inaccurate personal information.
  - `ERASURE`: Full account deletion and PII redaction.
- **Automated Right to Erasure (`POST /api/privacy/erase-account`)**:
  1. Revokes all active consents immediately.
  2. Redacts user PII (`displayName` replaced with "Erased User", phone nulled, email anonymized).
  3. Purges physical delivery addresses from the database.
  4. Deactivates customer and sitter profile relations.
  5. Emits a DPDP statutory compliance audit entry.

## 4. GPS & Telemetry Data Retention
- Live GPS tracking breadcrumbs are retained at full fidelity for 30 days (`TRACKING_RETENTION_DAYS=30`) for safety and dispute resolution.
- After 30 days, automated retention jobs aggregate breadcrumbs into summarized distance/duration metrics and purge raw latitude/longitude points.
