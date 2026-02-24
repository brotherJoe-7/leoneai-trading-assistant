# LeoneAI System Restart Guide

## Quick Start Commands

### 1. Stop All Processes

```powershell
# Kill all Python processes
taskkill /F /IM python.exe

# Kill all Node processes
taskkill /F /IM node.exe
```

### 2. Start Backend (Terminal 1)

```powershell
cd backend/api
.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000 --log-level info
```

**Expected Output**:

```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 3. Start Frontend (Terminal 2)

```powershell
cd frontend-web
npm run dev
```

**Expected Output**:

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 4. Verify System

```powershell
# Test backend
curl http://localhost:8000/health

# Test frontend
curl http://localhost:5173
```

## Troubleshooting

### Backend Won't Start

**Error**: `ModuleNotFoundError` or import errors

**Fix**:

```powershell
cd backend/api
.venv\Scripts\activate
pip install -r requirements.txt
```

### Database Errors

**Error**: `OperationalError` or database locked

**Fix**:

```powershell
cd backend/api
# Delete old database
del leoneai.db
# Restart - tables will be recreated
uvicorn app.main:app --reload --port 8000
```

### Port Already in Use

**Error**: `Address already in use`

**Fix**:

```powershell
# Find process using port 8000
netstat -ano | findstr :8000
# Kill the process (replace PID)
taskkill /F /PID <PID>
```

### Frontend Build Errors

**Error**: Module not found or dependency issues

**Fix**:

```powershell
cd frontend-web
# Clean install
rmdir /S /Q node_modules
del package-lock.json
npm install
npm run dev
```

## Login Test

Once both servers are running:

1. Open browser: `http://localhost:5173`
2. Click "Log In"
3. Use test credentials:
   - Username: `admin`
   - Password: `admin123`
4. Should redirect to dashboard within 2 seconds

## Common Issues

### "Login request timed out"

- ✅ Backend is not running
- ✅ Backend crashed during startup
- ✅ Database initialization failed

**Solution**: Check backend terminal for errors, restart with `--log-level debug`

### "Cannot connect to server"

- ✅ Backend not started
- ✅ Wrong port (should be 8000)
- ✅ Firewall blocking connection

**Solution**: Verify backend is running on port 8000

### Dashboard shows "Loading..." forever

- ✅ API endpoints returning errors
- ✅ Authentication token invalid
- ✅ Database empty (no user data)

**Solution**: Check browser console (F12) for API errors

## System Status Check

Run this to verify everything is working:

```powershell
# Backend health
curl http://localhost:8000/health
# Should return: {"status":"healthy","version":"1.0.0"}

# Frontend
curl http://localhost:5173
# Should return: HTML page

# API root
curl http://localhost:8000/
# Should return: {"message":"LeoneAI Trading API",...}
```

## Fresh Database Setup

If you need to reset everything:

```powershell
cd backend/api
.venv\Scripts\activate

# Delete database
del leoneai.db

# Run migrations (if you have alembic)
# alembic upgrade head

# Or just restart - tables auto-create
uvicorn app.main:app --reload --port 8000
```

Then create a test user via the API or register through the UI.
