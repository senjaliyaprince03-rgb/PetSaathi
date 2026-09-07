# PowerShell Script: Automated TypeScript Error Fixes for PetSaathi
# This script fixes all logger.error() signature mismatches

Write-Host "Fixing TypeScript compilation errors..." -ForegroundColor Cyan

# Pattern 1: Fix logger.error() calls - remove ternary, keep message
Write-Host "Fixing logger.error() ternary expressions..." -ForegroundColor Yellow
Get-ChildItem -Path src -Filter *.ts -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace 'logger\.error\(error instanceof Error \? error : "([^"]*)"', 'logger.error("$1"'
    Set-Content $_.FullName -Value $content -NoNewline
}

# Pattern 2: Remove 'event:' lines from logger context
Write-Host "Removing 'event:' keys from logger context..." -ForegroundColor Yellow
Get-ChildItem -Path src -Filter *.ts -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace ',?\s*event:\s*"[^"]*",?', ''
    Set-Content $_.FullName -Value $content -NoNewline
}

# Pattern 3: Fix IncidentStatus import
Write-Host "Fixing IncidentStatus import..." -ForegroundColor Yellow
$incidentFile = "src\app\api\admin\incidents\[id]\transition\route.ts"
if (Test-Path $incidentFile) {
    $content = Get-Content $incidentFile -Raw
    $content = $content -replace 'import \{ IncidentStatus \} from "@/modules/incidents/state-machine"', 'import { IncidentStatus } from "@prisma/client"'
    Set-Content $incidentFile -Value $content -NoNewline
}

# Pattern 4: Fix remaining logger.error with error parameter
Write-Host "Fixing logger.error() with error parameter..." -ForegroundColor Yellow
Get-ChildItem -Path src -Filter *.ts -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace 'logger\.error\(([^,]*), error instanceof Error \? error : new Error\(String\(error\)\), \{', 'logger.error($1, {'
    Set-Content $_.FullName -Value $content -NoNewline
}

# Pattern 5: Clean up double commas
Write-Host "Cleaning up double commas..." -ForegroundColor Yellow
Get-ChildItem -Path src -Filter *.ts -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace ',,', ','
    Set-Content $_.FullName -Value $content -NoNewline
}

# Pattern 6: Clean up trailing commas before closing braces
Get-ChildItem -Path src -Filter *.ts -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace ',\s*\}', '}'
    Set-Content $_.FullName -Value $content -NoNewline
}

Write-Host "`nDone! Running TypeScript compiler to verify..." -ForegroundColor Cyan
$output = npx tsc --noEmit 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ All TypeScript errors fixed!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some errors remain. Running detailed check..." -ForegroundColor Yellow
    npx tsc --noEmit 2>&1 | Select-String "error TS" | Select-Object -First 20
}
