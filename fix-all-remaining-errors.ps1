# Fix All Remaining TypeScript Errors - Complete Solution
# Run: pwsh -File fix-all-remaining-errors.ps1

Write-Host "🔧 Fixing all remaining TypeScript errors..." -ForegroundColor Cyan

$ErrorActionPreference = "Stop"
$files = @()

# File 1: assignments route
$file1 = "src\app\api\admin\bookings\[id]\assignments\route.ts"
if (Test-Path $file1) {
    $content = Get-Content $file1 -Raw
    $content = $content -replace `
        'logger\.error\(\s*"AssignmentOfferError",\s*error instanceof Error \? error : new Error\(String\(error\)\),\s*\{([^}]+)\}\s*\);', `
        'logger.error("AssignmentOfferError", {$1, error: error instanceof Error ? error.message : String(error) });'
    Set-Content -Path $file1 -Value $content -NoNewline
    Write-Host "✓ Fixed: $file1" -ForegroundColor Green
    $files += $file1
}

# File 2: leads route
$file2 = "src\app\api\admin\leads\[id]\route.ts"
if (Test-Path $file2) {
    $content = Get-Content $file2 -Raw
    $content = $content -replace `
        'logger\.error\("AdminLeadMutationError",\s*error instanceof Error \? error : new Error\(String\(error\)\),\s*\{[^}]*event:[^,]*,([^}]+)\}\s*\);', `
        'logger.error("AdminLeadMutationError", {$1, error: error instanceof Error ? error.message : String(error) });'
    Set-Content -Path $file2 -Value $content -NoNewline
    Write-Host "✓ Fixed: $file2" -ForegroundColor Green
    $files += $file2
}

# Files 3-7: partner-programmes admin routes
$partnerAdminFiles = @(
    "src\app\api\admin\partner-programmes\[id]\activate\route.ts",
    "src\app\api\admin\partner-programmes\[id]\pause\route.ts",
    "src\app\api\admin\partner-programmes\[id]\route.ts",
    "src\app\api\admin\partner-programmes\[id]\verification-tokens\route.ts"
)

foreach ($file in $partnerAdminFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        # Generic pattern for all partner-programmes admin files
        $content = $content -replace `
            'logger\.error\("([^"]+)",\s*error instanceof Error \? error : new Error\(String\(error\)\),\s*\{([^}]+)\}\s*\);', `
            'logger.error("$1", {$2, error: error instanceof Error ? error.message : String(error) });'
        Set-Content -Path $file -Value $content -NoNewline
        Write-Host "✓ Fixed: $file" -ForegroundColor Green
        $files += $file
    }
}

# File 8: testimonials route
$file8 = "src\app\api\admin\testimonials\[id]\route.ts"
if (Test-Path $file8) {
    $content = Get-Content $file8 -Raw
    $content = $content -replace `
        'logger\.error\("TestimonialUpdateError",\s*error instanceof Error \? error : new Error\(String\(error\)\),\s*\{([^}]+)\}\s*\);', `
        'logger.error("TestimonialUpdateError", {$1, error: error instanceof Error ? error.message : String(error) });'
    Set-Content -Path $file8 -Value $content -NoNewline
    Write-Host "✓ Fixed: $file8" -ForegroundColor Green
    $files += $file8
}

# File 9: payment-order route (error ternary in first argument)
$file9 = "src\app\api\bookings\[id]\payment-order\route.ts"
if (Test-Path $file9) {
    $content = Get-Content $file9 -Raw
    $content = $content -replace `
        'logger\.error\(\s*error instanceof Error \? error : "PaymentOrderCreationError",\s*\{([^}]+)\}\s*\);', `
        'logger.error("PaymentOrderCreationError", {$1, error: error instanceof Error ? error.message : String(error) });'
    Set-Content -Path $file9 -Value $content -NoNewline
    Write-Host "✓ Fixed: $file9" -ForegroundColor Green
    $files += $file9
}

# Files 10-12: partner-programmes public routes
$partnerPublicFiles = @(
    @{Path="src\app\api\partner-programmes\[slug]\benefits\route.ts"; Error="ProgrammeBenefitsError"},
    @{Path="src\app\api\partner-programmes\[slug]\enroll\route.ts"; Error="ProgrammeEnrollmentError"},
    @{Path="src\app\api\partner-programmes\[slug]\verify\route.ts"; Error="ProgrammeVerificationConsumeError"}
)

foreach ($fileInfo in $partnerPublicFiles) {
    if (Test-Path $fileInfo.Path) {
        $content = Get-Content $fileInfo.Path -Raw
        $errorName = $fileInfo.Error
        $content = $content -replace `
            "logger\.error\(\s*error instanceof Error \? error : `"$errorName`",\s*\{([^}]+)\}\s*\);", `
            "logger.error(`"$errorName`", {`$1, error: error instanceof Error ? error.message : String(error) });"
        Set-Content -Path $fileInfo.Path -Value $content -NoNewline
        Write-Host "✓ Fixed: $($fileInfo.Path)" -ForegroundColor Green
        $files += $fileInfo.Path
    }
}

# File 13: incidents transition route - Fix imports
$file13 = "src\app\api\admin\incidents\[id]\transition\route.ts"
if (Test-Path $file13) {
    $content = Get-Content $file13 -Raw
    
    # Fix IncidentStatus import
    $content = $content -replace `
        'import \{ IncidentStatus \} from "@/modules/incidents/state-machine";', `
        'import { IncidentStatus } from "@prisma/client";'
    
    # Add consumeRateLimit import if not present
    if ($content -notmatch 'consumeRateLimit') {
        $content = $content -replace `
            '(import \{ logger \} from "@/lib/logger";)', `
            '$1`nimport { consumeRateLimit } from "@/modules/security/rate-limit";'
    }
    
    Set-Content -Path $file13 -Value $content -NoNewline
    Write-Host "✓ Fixed: $file13" -ForegroundColor Green
    $files += $file13
}

Write-Host "`n✅ Fixed $($files.Count) files!" -ForegroundColor Green

# Run TypeScript check
Write-Host "`n🔍 Running TypeScript compilation check..." -ForegroundColor Cyan
$output = npx tsc --noEmit 2>&1
$errorCount = ($output | Select-String "error TS" | Measure-Object).Count

if ($errorCount -eq 0) {
    Write-Host "✅ SUCCESS! All TypeScript errors fixed!" -ForegroundColor Green
    Write-Host "Found 0 errors" -ForegroundColor Green
} else {
    Write-Host "⚠ $errorCount errors remaining" -ForegroundColor Yellow
    Write-Host "`nRemaining errors:" -ForegroundColor Yellow
    $output | Select-String "error TS"
}

Write-Host "`n📋 Summary:" -ForegroundColor Cyan
Write-Host "  Files fixed: $($files.Count)"
Write-Host "  TypeScript errors: $errorCount"
Write-Host "`nRun 'npx tsc --noEmit' to verify."
