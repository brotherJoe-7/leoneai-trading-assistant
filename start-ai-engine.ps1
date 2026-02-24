# Start AI Engine
Write-Host "Starting LeoneAI AI Engine..." -ForegroundColor Green

# Navigate to backend directory
Set-Location -Path "backend\ai-engine"

# Run with API virtual environment python
Write-Host "Starting AI Engine..." -ForegroundColor Yellow
& "..\api\.venv\Scripts\python.exe" main_engine.py

Read-Host "Press Enter to exit..."
