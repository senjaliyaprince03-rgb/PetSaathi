# TypeScript Compilation Fixes Required

## Status: 27 Errors Remaining

### Root Cause
Logger interface signature changed. Existing code uses logger.error() incorrectly.

### Fix Strategy
Replace all incorrect `logger.error(...)` calls with correct signature: `logger.error(message, context)`

### Files Requiring Manual Fixes (Approval Limit Reached)

#### Pattern 1: Remove `error instanceof Error ? error : ...` ternary
```typescript
// WRONG:
logger.error(error instanceof Error ? error : "ErrorName", { context });

// CORRECT:
logger.error("ErrorName", { context });
```

**Files:**
1. `src/app/api/admin/leads/[id]/route.ts:127`
2. `src/app/api/admin/bookings/[id]/assignments/route.ts:90`
3. `src/app/api/admin/community/memberships/[id]/route.ts:125`
4. `src/app/api/admin/partner-programmes/[id]/activate/route.ts:50`
5. `src/app/api/admin/partner-programmes/[id]/pause/route.ts:50`
6. `src/app/api/admin/partner-programmes/[id]/route.ts:103`
7. `src/app/api/admin/partner-programmes/[id]/verification-tokens/route.ts:93`
8. `src/app/api/admin/partner-programmes/route.ts:151`
9. `src/app/api/admin/partner-programmes/route.ts:198`
10. `src/app/api/admin/testimonials/[id]/route.ts:162`
11. `src/app/api/partner-programmes/[slug]/enroll/route.ts`
12. `src/app/api/partner-programmes/[slug]/benefits/route.ts`
13. `src/app/api/partner-programmes/[slug]/verify/route.ts`
14. `src/app/api/bookings/[id]/payment-order/route.ts:113`

#### Pattern 2: Remove 'event' key from context objects
```typescript
// WRONG:
logger.error("ErrorName", {
  event: "some.event.name",  // <- Remove this line
  userId: "123",
});

// CORRECT:
logger.error("ErrorName", {
  userId: "123",
});
```

**Files:** All files above that have `event:` in logger.error() context

#### Pattern 3: Fix IncidentStatus import
```typescript
// File: src/app/api/admin/incidents/[id]/transition/route.ts:10

// WRONG:
import { IncidentStatus } from "@/modules/incidents/state-machine";
const schema = z.object({
  toState: z.nativeEnum(IncidentStatus), // <- IncidentStatus is exported as 'export type'
});

// CORRECT:
import { IncidentStatus } from "@prisma/client";
const schema = z.object({
  toState: z.nativeEnum(IncidentStatus),
});
```

#### Pattern 4: Add missing import
```typescript
// File: src/app/api/admin/incidents/[id]/transition/route.ts:19

// Add this import at top:
import { consumeRateLimit } from "@/modules/security/rate-limit";
```

### Automated Fix Script

Run this script to fix all files at once:

```bash
# Fix Pattern 1: Remove error ternary, keep message only
find src -name "*.ts" -type f -exec sed -i 's/logger\.error(error instanceof Error ? error : "\([^"]*\)", {/logger.error("\1", {/g' {} +

# Fix Pattern 2: Remove 'event:' lines from logger.error context
find src -name "*.ts" -type f -exec sed -i '/logger\.error.*{/,/}/ { /event:/d; }' {} +
```

### Verification Command
```bash
npx tsc --noEmit
# Should show 0 errors after fixes
```

### Priority Order
1. Fix logger.error() signatures (14 files)
2. Fix IncidentStatus import (1 file)
3. Add consumeRateLimit import (1 file)
4. Re-run `npx tsc --noEmit` to verify

### Estimated Time
30 minutes for manual fixes across all 16 files.
