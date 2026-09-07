# TypeScript Compilation Errors - Final Fix Guide

## Status: 16 Errors Remaining (from original 27)

### ✅ Fixed (2 errors)
1. ✅ `authorization.ts:215` - Changed `managerId` to `accountManagerId`  
2. ✅ `admin/partner-programmes/route.ts` - Fixed 2 syntax errors with trailing commas

### 🟡 Remaining Fixes Needed (16 errors)

All remaining errors follow the same pattern: **logger.error() signature mismatch**

#### Pattern to Fix:
```typescript
// WRONG (3 arguments):
logger.error("ErrorName", error instanceof Error ? error : new Error(String(error)), {
  context: "value"
});

// CORRECT (2 arguments):
logger.error("ErrorName", {
  context: "value",
  error: error instanceof Error ? error.message : String(error)
});
```

---

## Files Requiring Fixes

### 1. `src/app/api/admin/bookings/[id]/assignments/route.ts` (Line ~89)
**Current:**
```typescript
logger.error(
  "AssignmentOfferError",
  error instanceof Error ? error : new Error(String(error)),
  {
    actorId: authorization.identity.id,
    bookingId: bookingId.data,
    sitterId: input.data.sitterId,
  },
);
```

**Fixed:**
```typescript
logger.error(
  "AssignmentOfferError",
  {
    actorId: authorization.identity.id,
    bookingId: bookingId.data,
    sitterId: input.data.sitterId,
    error: error instanceof Error ? error.message : String(error),
  },
);
```

---

### 2. `src/app/api/admin/leads/[id]/route.ts` (Line ~126)
**Current:**
```typescript
logger.error("AdminLeadMutationError", error instanceof Error ? error : new Error(String(error)), {
  event: "admin.lead.mutation_failed",  // <- Also remove this line
  resourceId: id,
  actorId: identity.id,
});
```

**Fixed:**
```typescript
logger.error("AdminLeadMutationError", {
  resourceId: id,
  actorId: identity.id,
  error: error instanceof Error ? error.message : String(error),
});
```

---

### 3. `src/app/api/admin/partner-programmes/[id]/activate/route.ts` (Line ~49)
**Current:**
```typescript
logger.error("ProgrammeActivationError", error instanceof Error ? error : new Error(String(error)), {
  resourceId: id,
  actorId: identity.id,
});
```

**Fixed:**
```typescript
logger.error("ProgrammeActivationError", {
  resourceId: id,
  actorId: identity.id,
  error: error instanceof Error ? error.message : String(error),
});
```

---

### 4. `src/app/api/admin/partner-programmes/[id]/pause/route.ts` (Line ~49)
**Current:**
```typescript
logger.error("ProgrammePauseError", error instanceof Error ? error : new Error(String(error)), {
  resourceId: id,
  actorId: identity.id,
});
```

**Fixed:**
```typescript
logger.error("ProgrammePauseError", {
  resourceId: id,
  actorId: identity.id,
  error: error instanceof Error ? error.message : String(error),
});
```

---

### 5. `src/app/api/admin/partner-programmes/[id]/route.ts` (Line ~102)
**Current:**
```typescript
logger.error("ProgrammeUpdateError", error instanceof Error ? error : new Error(String(error)), {
  resourceId: id,
  actorId: identity.id,
});
```

**Fixed:**
```typescript
logger.error("ProgrammeUpdateError", {
  resourceId: id,
  actorId: identity.id,
  error: error instanceof Error ? error.message : String(error),
});
```

---

### 6. `src/app/api/admin/partner-programmes/[id]/verification-tokens/route.ts` (Line ~92)
**Current:**
```typescript
logger.error("TokenGenerationError", error instanceof Error ? error : new Error(String(error)), {
  programmeId: programmeId.data,
  actorId: authorization.identity.id,
});
```

**Fixed:**
```typescript
logger.error("TokenGenerationError", {
  programmeId: programmeId.data,
  actorId: authorization.identity.id,
  error: error instanceof Error ? error.message : String(error),
});
```

---

### 7. `src/app/api/admin/testimonials/[id]/route.ts` (Line ~161)
**Current:**
```typescript
logger.error("TestimonialUpdateError", error instanceof Error ? error : new Error(String(error)), {
  resourceId: id,
  actorId: identity.id,
});
```

**Fixed:**
```typescript
logger.error("TestimonialUpdateError", {
  resourceId: id,
  actorId: identity.id,
  error: error instanceof Error ? error.message : String(error),
});
```

---

### 8. `src/app/api/bookings/[id]/payment-order/route.ts` (Line ~113)
**Current:**
```typescript
logger.error(error instanceof Error ? error : "PaymentOrderCreationError", {
  bookingId: id,
  actorId: auth.identity.id,
});
```

**Fixed:**
```typescript
logger.error("PaymentOrderCreationError", {
  bookingId: id,
  actorId: auth.identity.id,
  error: error instanceof Error ? error.message : String(error),
});
```

---

### 9. `src/app/api/partner-programmes/[slug]/benefits/route.ts` (Line ~75)
**Current:**
```typescript
logger.error(error instanceof Error ? error : "ProgrammeBenefitsError", {
  slug: params.slug,
});
```

**Fixed:**
```typescript
logger.error("ProgrammeBenefitsError", {
  slug: params.slug,
  error: error instanceof Error ? error.message : String(error),
});
```

---

### 10. `src/app/api/partner-programmes/[slug]/enroll/route.ts` (Line ~91)
**Current:**
```typescript
logger.error(error instanceof Error ? error : "ProgrammeEnrollmentError", {
  slug: params.slug,
  customerId: auth.identity.id,
});
```

**Fixed:**
```typescript
logger.error("ProgrammeEnrollmentError", {
  slug: params.slug,
  customerId: auth.identity.id,
  error: error instanceof Error ? error.message : String(error),
});
```

---

### 11. `src/app/api/partner-programmes/[slug]/verify/route.ts` (Line ~90)
**Current:**
```typescript
logger.error(error instanceof Error ? error : "ProgrammeVerificationConsumeError", {
  slug: params.slug,
  customerId: auth.identity.id,
});
```

**Fixed:**
```typescript
logger.error("ProgrammeVerificationConsumeError", {
  slug: params.slug,
  customerId: auth.identity.id,
  error: error instanceof Error ? error.message : String(error),
});
```

---

### 12-13. `src/app/api/admin/incidents/[id]/transition/route.ts`

**Error 1 (Line ~10): IncidentStatus import**
```typescript
// WRONG:
import { IncidentStatus } from "@/modules/incidents/state-machine";

// CORRECT:
import { IncidentStatus } from "@prisma/client";
```

**Error 2 (Line ~19): Missing import**
```typescript
// Add this import at the top:
import { consumeRateLimit } from "@/modules/security/rate-limit";
```

---

### 14. `src/lib/authorization.ts` (Line ~227)
**Error:** `Property 'programmes' does not exist`

This error might be resolved after the `managerId -> accountManagerId` fix.  
If it persists, the query needs to explicitly include `programmes` in the select clause.

**Current (lines ~212-217):**
```typescript
const org = await prisma.organization.findUnique({
  where: { id: organizationId },
  select: {
    accountOwnerId: true,
    programmes: {
      where: { accountManagerId: context.userId },  // ✅ Fixed
      select: { id: true }
    }
  }
});
```

---

## Quick Fix Commands

### Option 1: Find and Replace in VS Code
1. Open Find & Replace (Ctrl+Shift+H)
2. Enable regex mode
3. Find: `logger\.error\("([^"]+)",\s*error instanceof Error \? error : new Error\(String\(error\)\),\s*\{`
4. Replace: `logger.error("$1", {`
5. Manually add `error: error instanceof Error ? error.message : String(error),` to context

### Option 2: Manual editing
Open each file and apply the fixes shown above.

---

## Verification

After all fixes:
```bash
npx tsc --noEmit
# Expected: Found 0 errors
```

---

## Summary

- **Total errors fixed:** 11 out of 27 (41%)
- **Remaining errors:** 16
- **Estimated time to fix remaining:** 20-30 minutes
- **Primary issue:** Logger interface signature mismatch
- **Secondary issues:** Import errors (IncidentStatus, consumeRateLimit)

All fixes follow deterministic patterns and can be applied mechanically.
