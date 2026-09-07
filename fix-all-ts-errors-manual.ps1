# Manual Fix for All TypeScript Errors
# This script directly fixes each file

Write-Host "🔧 Starting manual TypeScript fixes..." -ForegroundColor Cyan

# Get the full path
$rootPath = Get-Location

# Fix files one by one
$files = @(
    @{
        Path = "$rootPath\src\app\api\admin\bookings\[id]\assignments\route.ts"
        Old = '    logger.error(
      "AssignmentOfferError",
      error instanceof Error ? error : new Error(String(error)),
      {
        actorId: authorization.identity.id,
        bookingId: bookingId.data,
        sitterId: input.data.sitterId,
      },
    );'
        New = '    logger.error(
      "AssignmentOfferError",
      {
        actorId: authorization.identity.id,
        bookingId: bookingId.data,
        sitterId: input.data.sitterId,
        error: error instanceof Error ? error.message : String(error),
      },
    );'
    },
    @{
        Path = "$rootPath\src\app\api\admin\leads\[id]\route.ts"
        Old = '    logger.error("AdminLeadMutationError", error instanceof Error ? error : new Error(String(error)), {
      event: "admin.lead.mutation_failed",
      resourceId: id,
      actorId: identity.id,
    });'
        New = '    logger.error("AdminLeadMutationError", {
      resourceId: id,
      actorId: identity.id,
      error: error instanceof Error ? error.message : String(error),
    });'
    }
)

foreach ($file in $files) {
    if (Test-Path $file.Path) {
        $content = Get-Content $file.Path -Raw
        $content = $content.Replace($file.Old, $file.New)
        Set-Content -Path $file.Path -Value $content -NoNewline
        Write-Host "✓ Fixed: $($file.Path)" -ForegroundColor Green
    } else {
        Write-Host "⚠ Not found: $($file.Path)" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Done! Run 'npx tsc --noEmit' to verify." -ForegroundColor Green
