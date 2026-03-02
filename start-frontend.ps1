# Start Frontend Server
Write-Host "Starting LeoneAI Frontend..." -ForegroundColor Green

# Start Vite dev server from the frontend directory
Write-Host "Starting Vite dev server on http://localhost:5173/" -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\frontend-web"
npm run dev
