# PetSaathi Security Architecture

This document describes the security controls, threat model, and secure development practices for PetSaathi.

## Table of Contents

1. [Threat Model](#threat-model)
2. [Authentication & Authorization](#authentication--authorization)
3. [Data Protection](#data-protection)
4. [Rate Limiting](#rate-limiting)
5. [Upload Security](#upload-security)
6. [GPS Validation](#gps-validation)
7. [Payment Security](#payment-security)
8. [Multi-Tenancy Isolation](#multi-tenancy-isolation)
9. [API Security](#api-security)
10. [AI Security](#ai-security)
11. [Incident Response](#incident-response)

---

## Threat Model

### Assets

1. **Customer data**: PII, pet information, payment details
2. **Sitter data**: Identity documents, background checks, financial information
3. **Location data**: Real-time GPS tracking of Saathis during bookings
4. **Payment transactions**: Razorpay payment IDs, refund operations
5. **Business logic**: Booking state machines, pricing algorithms

### Threat Actors

1. **External attackers**: Credential stuffing, SQL injection, XSS, CSRF
2. **Malicious users**: IDOR attacks, privilege escalation, fraudulent bookings
3. **Compromised Saathis**: Unauthorized access to customer data
4. **Insider threats**: Admin abuse, data exfiltration

### Security Goals

1. **Confidentiality**: Protect PII and financial data
2. **Integrity**: Prevent unauthorized modification of bookings, payments, profiles
3. **Availability**: Mitigate DoS attacks with rate limiting
4. **Accountability**: Audit logging for sensitive operations

---

## Authentication & Authorization

### Authentication

**Implementation**: NextAuth.js v4 with phone OTP

- **Session management**: HTTP-only secure cookies
- **OTP delivery**: Email (SMTP) and SMS (webhook)
- **Session duration**: 30 days (configurable via `AUTH_SESSION_DAYS`)
- **Rate limiting**: 5 OTP requests per phone number per hour

**Code reference**:
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/lib/rate-limit.ts`

### Authorization

**RBAC Model**:

Roles: `CUSTOMER`, `SITTER`, `OPERATIONS_ADMIN`, `VERIFICATION_ADMIN`, `SAFETY_ADMIN`, `FINANCE_ADMIN`, `CONTENT_ADMIN`, `SOCIETY_MANAGER`, `PARTNER_MANAGER`, `CITY_MANAGER`, `OPERATOR`, `SUPER_ADMIN`

**Authorization Helpers** (`src/lib/authorization.ts`):

```typescript
import { authorizeBookingAccess, authorizePetAccess } from '@/lib/authorization';

const auth = await getAuthContext(request);
const canAccess = await authorizeBookingAccess(bookingId, auth.userId, auth.roles);
if (!canAccess) {
  return new Response("Forbidden", { status: 403 });
}
```

**IDOR Prevention Rules**:

1. **Never trust client-supplied IDs**: Always verify ownership server-side
2. **Use authorization helpers**: All resource access must call `authorize*Access()`
3. **Tenant scoping**: Multi-tenant resources must include tenant ID in authorization checks

**Code reference**:
- `src/lib/authorization.ts`
- `src/lib/auth-context.ts`

---

## Data Protection

### Encryption

**At Rest**:
- MongoDB Atlas: Encryption at rest enabled by default (AES-256)
- Uploaded files: GridFS objects encrypted with MongoDB encryption

**In Transit**:
- TLS 1.3 for all HTTPS traffic
- MongoDB: TLS required for Atlas connections

### PII Handling

**Sensitive fields** (require special handling):
- Phone numbers: Used for authentication, never exposed in public APIs
- Aadhaar numbers: Masked after verification (e.g., `XXXX1234`)
- Payment details: Never stored directly (Razorpay tokens only)

**Data retention**:
- GPS tracking points: 30 days (configurable via `TRACKING_RETENTION_DAYS`)
- Quarantined uploads: 24 hours before deletion
- Soft-deleted user accounts: 90 days before permanent deletion

**Code reference**:
- `src/app/api/jobs/tracking-retention/route.ts`
- `src/app/api/jobs/upload-retention/route.ts`

---

## Rate Limiting

**Implementation**: `rate-limiter-flexible` with Upstash Redis (production) or in-memory (development)

**Limits**:

| Endpoint | Limit | Window | Bypass |
|----------|-------|--------|--------|
| OTP requests | 5 | 1 hour | None |
| Login attempts | 10 | 1 hour | None |
| Payment creation | 10 | 1 hour | None |
| File uploads | 20 | 1 hour | None |
| GPS tracking | 100 | 1 hour | None |
| AI inference | 100 | 1 hour | None |

**Code reference**:
- `src/lib/rate-limit.ts`
- `ai/security.mjs`

---

## Upload Security

### Threat: Malware, Path Traversal, DoS

**Controls**:

1. **File type validation**: MIME type whitelist (images, PDFs only)
2. **File size limits**: 10MB max per upload
3. **Path traversal prevention**: Reject filenames with `..` or `/`
4. **Virus scanning**: ClamAV integration (optional, adapter pattern)
5. **Quarantine workflow**: All uploads start in `QUARANTINED` status

**Upload Flow**:

```
1. Client requests signed PUT URL → /api/uploads
2. Server validates user authorization + quota
3. Server generates HMAC-signed temporary URL (5-minute TTL)
4. Client uploads directly to GridFS
5. Server marks upload as QUARANTINED
6. Scanner service processes upload → callback with scan result
7. Upload promoted to CLEAN or rejected
```

**Code reference**:
- `src/modules/security/upload-validation.ts`
- `src/modules/security/scanner-adapter.ts`

---

## GPS Validation

### Threat: GPS Spoofing, Impossible Speed

**Controls**:

1. **Geographic bounds**: India only (8-37°N, 68-97°E)
2. **Speed validation**: Max 120 km/h between consecutive points
3. **Timestamp freshness**: Max 5 minutes age
4. **Haversine distance**: Accurate distance calculation

**Code reference**:
- `src/modules/tracking/validation.ts`

---

## Payment Security

### Threat: Double Capture, Replay Attacks, Refund Fraud

**Controls**:

1. **Idempotency**: All payment operations use unique `requestId`
2. **Signature verification**: Razorpay webhook signatures validated
3. **Duplicate detection**: Prevent double capture with transaction log
4. **State machine enforcement**: Invalid state transitions rejected
5. **Refund validation**: Cannot refund more than captured amount

**Payment State Machine**:

```
CREATED → AUTHORIZED → CAPTURED → SETTLED
                   ↘ FAILED
```

**Code reference**:
- `src/modules/payments/state-machine.ts`
- `src/modules/payments/integrity.ts`

---

## Multi-Tenancy Isolation

### Threat: Cross-Tenant Data Leakage

**Tenant Resolution**:

```typescript
import { resolveTenantFromHost } from '@/lib/tenancy';

const tenant = resolveTenantFromHost(request.headers.get("host"));
// Subdomain routing: acme.petsaathi.com → tenant="acme"
```

**Tenant Scoping**:

```typescript
import { tenantScopedWhere } from '@/lib/tenancy';

const bookings = await db.booking.findMany({
  where: tenantScopedWhere({ status: "CONFIRMED" }, tenantId),
});
```

**SUPER_ADMIN Bypass**:

- `SUPER_ADMIN` role can access all tenants
- Required for platform-level operations

**Code reference**:
- `src/lib/tenancy.ts`

---

## API Security

### 1. CSRF Protection

**Implementation**: Next.js `sameSite: "lax"` cookies + `X-CSRF-Token` header

### 2. Input Validation

**Zod schemas** for all API inputs:

```typescript
import { z } from 'zod';

const createBookingSchema = z.object({
  petId: z.string().uuid(),
  serviceTypeId: z.string().uuid(),
  scheduledStart: z.string().datetime(),
});
```

### 3. Error Handling

**Never expose internal errors to clients**:

```typescript
try {
  // Business logic
} catch (error) {
  logger.error("Payment capture failed", { bookingId, error });
  return new Response("Internal server error", { status: 500 });
}
```

### 4. Webhook Authentication

**Razorpay**: Signature verification using `RAZORPAY_WEBHOOK_SECRET`
**Cron jobs**: Bearer token using `CRON_SECRET`
**Scanner callbacks**: HMAC signature using `SCANNER_CALLBACK_SECRET`

**Code reference**:
- `src/app/api/webhooks/razorpay/route.ts`
- `src/lib/cron-auth.ts`

---

## AI Security

### Threat: Prompt Injection, PII Leakage, Token Abuse

**Controls**:

1. **Prompt injection detection**: Pattern-based detection of system role impersonation
2. **PII sanitization**: Automatic redaction of emails, phone numbers, Aadhaar, credit cards
3. **Rate limiting**: 100 requests per user per hour
4. **Prompt size limits**: Max 50,000 characters
5. **Response sanitization**: Filter API keys, environment variables, file paths

**Code reference**:
- `ai/security.mjs`
- `ai/router.mjs`

---

## Incident Response

### Incident Severity Levels

| Severity | Auto-Action | Example |
|----------|-------------|---------|
| `CRITICAL` | Sitter hold + immediate escalation | Pet injury requiring vet |
| `HIGH` | Sitter hold + escalation | Property damage |
| `MEDIUM` | Escalation | Customer complaint |
| `LOW` | Logged | Service delay |

### Sitter Hold

**Automatic hold** for `CRITICAL` and `HIGH` incidents:

```typescript
import { requiresAutomaticSitterHold } from '@/modules/incidents/state-machine';

if (requiresAutomaticSitterHold(severity)) {
  await db.sitterHold.create({
    data: { sitterId, incidentId, reason: "AUTO_HOLD" },
  });
}
```

**Code reference**:
- `src/modules/incidents/state-machine.ts`

---

## Security Checklist for Developers

### Before Merging Code

- [ ] All user inputs validated with Zod schemas
- [ ] Authorization checks for all resource access
- [ ] Rate limiting applied to expensive operations
- [ ] Secrets never hardcoded (use environment variables)
- [ ] Error messages do not expose internal state
- [ ] Audit logging for sensitive operations
- [ ] SQL injection prevented (Prisma parameterized queries)
- [ ] XSS prevented (React auto-escapes by default, verify `dangerouslySetInnerHTML` usage)

### Before Deploying

- [ ] `.env.example` updated with new variables
- [ ] Database migrations tested on staging
- [ ] Rate limits configured for production load
- [ ] Secrets rotated if they may have leaked
- [ ] Sentry error tracking enabled
- [ ] Structured logging enabled (`LOG_LEVEL=info`)

---

## Reporting Security Vulnerabilities

**DO NOT** open public GitHub issues for security vulnerabilities.

Email: security@petsaathi.com

We aim to acknowledge reports within 48 hours and provide a fix timeline within 7 days.

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Prisma Security](https://www.prisma.io/docs/guides/performance-and-optimization/security)
