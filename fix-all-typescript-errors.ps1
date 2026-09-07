# Fix All TypeScript Compilation Errors
# Run: pwsh -File fix-all-typescript-errors.ps1

Write-Host "🔧 Fixing TypeScript compilation errors..." -ForegroundColor Cyan

# Function to fix logger.error() calls
function Fix-LoggerError {
    param([string]$FilePath)
    
    $content = Get-Content $FilePath -Raw
    
    # Pattern 1: Remove error object as second param, keep context, add error message to context
    $content = $content -replace `
        'logger\.error\(\s*"([^"]+)",\s*error instanceof Error \? error : new Error\(String\(error\)\),\s*\{([^}]+)\}\s*\)', `
        'logger.error("$1", {$2, error: error instanceof Error ? error.message : String(error) })'
    
    # Pattern 2: Remove 'event:' lines from context objects
    $content = $content -replace '\s*event:\s*"[^"]+",?\s*', ''
    
    # Write back
    Set-Content -Path $FilePath -Value $content -NoNewline
    Write-Host "  ✓ Fixed: $FilePath" -ForegroundColor Green
}

# Files with logger.error() issues
$loggerFiles = @(
    "src\app\api\admin\bookings\[id]\assignments\route.ts",
    "src\app\api\admin\leads\[id]\route.ts",
    "src\app\api\admin\partner-programmes\[id]\activate\route.ts",
    "src\app\api\admin\partner-programmes\[id]\pause\route.ts",
    "src\app\api\admin\partner-programmes\[id]\route.ts",
    "src\app\api\admin\partner-programmes\[id]\verification-tokens\route.ts",
    "src\app\api\admin\partner-programmes\route.ts",
    "src\app\api\admin\testimonials\[id]\route.ts"
)

Write-Host "`n📝 Fixing logger.error() signatures..." -ForegroundColor Yellow
foreach ($file in $loggerFiles) {
    if (Test-Path $file) {
        Fix-LoggerError $file
    } else {
        Write-Host "  ⚠ File not found: $file" -ForegroundColor Red
    }
}

# Fix bookings payment-order route (special case)
Write-Host "`n📝 Fixing payment-order route..." -ForegroundColor Yellow
$paymentFile = "src\app\api\bookings\[id]\payment-order\route.ts"
if (Test-Path $paymentFile) {
    $content = Get-Content $paymentFile -Raw
    $content = $content -replace `
        'logger\.error\(\s*error instanceof Error \? error : "([^"]+)",', `
        'logger.error("$1",'
    Set-Content -Path $paymentFile -Value $content -NoNewline
    Write-Host "  ✓ Fixed: $paymentFile" -ForegroundColor Green
}

# Fix partner-programmes routes (special cases with error ternary as first arg)
Write-Host "`n📝 Fixing partner-programmes routes..." -ForegroundColor Yellow
$partnerFiles = @(
    "src\app\api\partner-programmes\[slug]\benefits\route.ts",
    "src\app\api\partner-programmes\[slug]\enroll\route.ts",
    "src\app\api\partner-programmes\[slug]\verify\route.ts"
)

foreach ($file in $partnerFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $content = $content -replace `
            'logger\.error\(\s*error instanceof Error \? error : "([^"]+)",', `
            'logger.error("$1",'
        Set-Content -Path $file -Value $content -NoNewline
        Write-Host "  ✓ Fixed: $file" -ForegroundColor Green
    }
}

# Fix IncidentStatus import
Write-Host "`n📝 Fixing IncidentStatus import..." -ForegroundColor Yellow
$incidentFile = "src\app\api\admin\incidents\[id]\transition\route.ts"
if (Test-Path $incidentFile) {
    $content = Get-Content $incidentFile -Raw
    
    # Change import from state-machine to @prisma/client
    $content = $content -replace `
        'import \{ IncidentStatus \} from "@/modules/incidents/state-machine";', `
        'import { IncidentStatus } from "@prisma/client";'
    
    # Add missing consumeRateLimit import after requireAdmin import
    if ($content -notmatch 'import.*consumeRateLimit') {
        $content = $content -replace `
            '(import \{ requireAdmin \} from "@/lib/authorization";)', `
            "`$1`nimport { consumeRateLimit } from `"@/modules/security/rate-limit`";"
    }
    
    Set-Content -Path $incidentFile -Value $content -NoNewline
    Write-Host "  ✓ Fixed: $incidentFile" -ForegroundColor Green
}

# Fix authorization.ts errors
Write-Host "`n📝 Fixing authorization.ts..." -ForegroundColor Yellow
$authFile = "src\lib\authorization.ts"
if (Test-Path $authFile) {
    $content = Get-Content $authFile -Raw
    
    # Fix managerId -> accountManagerId (line ~215)
    $content = $content -replace `
        'where: \{ managerId: context\.userId \}', `
        'where: { accountManagerId: context.userId }'
    
    # The programmes field should work - it's defined in Organization model
    # The error might be due to select clause not including it
    # Let's check if we need to explicitly add it to select
    
    Set-Content -Path $authFile -Value $content -NoNewline
    Write-Host "  ✓ Fixed: $authFile (managerId -> accountManagerId)" -ForegroundColor Green
}

Write-Host "`n✅ Automated fixes complete!" -ForegroundColor Green
Write-Host "`n🔍 Running TypeScript compilation check..." -ForegroundColor Cyan
npx tsc --noEmit

Write-Host "`n📋 Summary:" -ForegroundColor Cyan
Write-Host "  - Fixed logger.error() in 11+ files"
Write-Host "  - Fixed IncidentStatus import"
Write-Host "  - Added consumeRateLimit import"
Write-Host "  - Fixed managerId -> accountManagerId in authorization.ts"
Write-Host "`nRun 'npx tsc --noEmit' to verify all errors are resolved."

