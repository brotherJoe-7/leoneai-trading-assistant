# Start Backend Server
Write-Host "Starting LeoneAI Backend Server..." -ForegroundColor Green

# Navigate to backend directory
Set-Location -Path "backend\api"

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& ".venv\Scripts\Activate.ps1"

# Start uvicorn
Write-Host "Starting Uvicorn on port 8000..." -ForegroundColor Yellow
uvicorn app.main:app --reload --port 8000 --host 0.0.0.0 --log-level info
