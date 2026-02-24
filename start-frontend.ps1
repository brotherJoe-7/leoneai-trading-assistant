# Start Frontend Server
Write-Host "Starting LeoneAI Frontend..." -ForegroundColor Green

# Navigate to frontend directory
Set-Location -Path "frontend-web"

# Start Vite dev server
Write-Host "Starting Vite dev server..." -ForegroundColor Yellow
npm run dev
