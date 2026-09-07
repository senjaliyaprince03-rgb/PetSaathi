#!/bin/bash
# Automated TypeScript Error Fixes for PetSaathi
# This script fixes all logger.error() signature mismatches

echo "Fixing TypeScript compilation errors..."

# Pattern 1: Remove 'error instanceof Error ? error : "ErrorName"' - keep message only
echo "Fixing logger.error() ternary expressions..."
find src -name "*.ts" -type f -exec sed -i 's/logger\.error(error instanceof Error ? error : "\([^"]*\)"/logger.error("\1"/g' {} +

# Pattern 2: Remove 'event:' lines from logger.error context objects
echo "Removing 'event:' keys from logger context..."
find src -name "*.ts" -type f -exec perl -i -pe 's/,?\s*event:\s*"[^"]*",?//g' {} +

# Pattern 3: Fix IncidentStatus import
echo "Fixing IncidentStatus import..."
sed -i 's/import { IncidentStatus } from "@\/modules\/incidents\/state-machine"/import { IncidentStatus } from "@prisma\/client"/g' src/app/api/admin/incidents/\[id\]/transition/route.ts

# Pattern 4: Add missing consumeRateLimit import (if not present)
if ! grep -q "import.*consumeRateLimit" src/app/api/admin/incidents/\[id\]/transition/route.ts; then
  echo "Adding consumeRateLimit import..."
  sed -i '1 i\import { consumeRateLimit } from "@/modules/security/rate-limit";' src/app/api/admin/incidents/\[id\]/transition/route.ts
fi

# Pattern 5: Fix remaining logger.error with error object parameter
echo "Fixing logger.error() with error parameter..."
find src -name "*.ts" -type f -exec sed -i 's/logger\.error(\([^,]*\), error instanceof Error ? error : new Error(String(error)), {/logger.error(\1, {/g' {} +

# Pattern 6: Clean up double commas
echo "Cleaning up double commas..."
find src -name "*.ts" -type f -exec sed -i 's/,,/,/g' {} +

# Pattern 7: Clean up trailing commas before closing braces
find src -name "*.ts" -type f -exec sed -i 's/,\s*}/}/g' {} +

echo "Done! Running TypeScript compiler to verify..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
  echo "✅ All TypeScript errors fixed!"
else
  echo "⚠️  Some errors remain. Running detailed check..."
  npx tsc --noEmit 2>&1 | grep "error TS" | head -20
fi
