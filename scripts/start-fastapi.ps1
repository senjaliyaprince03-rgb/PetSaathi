$ErrorActionPreference = "Stop"

Set-Location -Path "C:\Users\Prince\Downloads\PetSaathi\api-service"

if (-not (Test-Path "venv")) {
    Write-Host "Creating Python Virtual Environment..."
    python -m venv venv
}

Write-Host "Activating Virtual Environment..."
.\venv\Scripts\Activate.ps1

Write-Host "Installing Dependencies..."
pip install -r requirements.txt

Write-Host "Starting FastAPI Server on Port 8000..."
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
