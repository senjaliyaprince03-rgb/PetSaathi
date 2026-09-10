Stop-Process -Name node -Force -ErrorAction SilentlyContinue
Start-Job { npm run start } | Out-Null
Start-Sleep -Seconds 10
node run-lh-local.js phase24
Stop-Process -Name node -Force -ErrorAction SilentlyContinue

git checkout HEAD~1
npm run build
Start-Job { npm run start } | Out-Null
Start-Sleep -Seconds 10
node run-lh-local.js baseline
Stop-Process -Name node -Force -ErrorAction SilentlyContinue

git checkout main
