$ErrorActionPreference = 'Continue'
Write-Host '=== PetSaathi End-to-End Validation ===' -ForegroundColor Cyan

Write-Host 'STEP 1 & 2 - Dependencies & Linting' -ForegroundColor Green
npm outdated
npx tsc --noEmit
npx eslint . --ext .ts,.tsx,.js,.jsx

Write-Host 'STEP 3 - Database' -ForegroundColor Green
npx prisma validate
npx prisma generate

Write-Host 'STEP 4 - Tests' -ForegroundColor Green
npm run test
npm run test:coverage

Write-Host 'STEP 7 - Build' -ForegroundColor Green
npm run build

Write-Host 'STEP 11 - Security' -ForegroundColor Green
npm audit --audit-level=moderate
Select-String -Path 'src\**\*' -Pattern 'sk-|api_key|secret|password|token' -Recurse | Select-Object Filename, LineNumber -First 5

Write-Host '=== VALIDATION COMPLETE ===' -ForegroundColor Cyan
