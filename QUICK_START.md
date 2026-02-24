# LeoneAI Trading Assistant - Quick Start

## ✅ WORKING SYSTEM - Follow These Steps

### Step 1: Start Backend (Terminal 1)

```powershell
cd "C:\Users\CTI LTD\OneDrive\Desktop\leoneai-trading-assistant"
powershell -ExecutionPolicy Bypass -File start-backend.ps1
```

**Wait for this message**:

```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Step 2: Start Frontend (Terminal 2)

```powershell
cd "C:\Users\CTI LTD\OneDrive\Desktop\leoneai-trading-assistant"
powershell -ExecutionPolicy Bypass -File start-frontend.ps1
```

**Wait for this message**:

```
➜  Local:   http://localhost:5173/
```

### Step 3: Open Browser

1. Open: **http://localhost:5173** (or 5174 if 5173 is taken)
2. Click "Log In"
3. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
4. Should redirect to dashboard

---

## 🔧 If Backend Won't Start

### Option 1: Manual Start

```powershell
cd backend\api
.venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
```

### Option 2: Check if port is blocked

```powershell
netstat -ano | findstr :8000
# If something is using port 8000, kill it:
taskkill /F /PID <PID_NUMBER>
```

### Option 3: Fresh database

```powershell
cd backend\api
del leoneai.db
# Then restart backend
```

---

## 🔧 If Frontend Won't Start

```powershell
cd frontend-web
npm install
npm run dev
```

---

## ✅ Verify System is Working

### Test Backend

```powershell
curl http://localhost:8000/health
# Should return: {"status":"healthy","version":"1.0.0"}
```

### Test Frontend

```powershell
curl http://localhost:5173
# Should return: HTML page
```

### Test Login API

```powershell
curl -X POST "http://localhost:8000/api/v1/auth/login" `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "username=admin&password=admin123"
# Should return: JSON with access_token
```

---

## 🚨 Common Errors & Fixes

### "Cannot connect to server"

- ✅ Backend not started → Run `start-backend.ps1`
- ✅ Wrong port → Check backend is on 8000
- ✅ Firewall → Allow Python through firewall

### "Login request timed out"

- ✅ Backend crashed → Check backend terminal for errors
- ✅ Database locked → Delete `leoneai.db` and restart

### "ModuleNotFoundError"

```powershell
cd backend\api
.venv\Scripts\activate
pip install -r requirements.txt
```

### "Port already in use"

```powershell
# Find and kill process using port 8000
netstat -ano | findstr :8000
taskkill /F /PID <PID>
```

---

## 📝 Test Credentials

**Admin Account**:

- Username: `admin`
- Password: `admin123`

**If admin doesn't exist**, create via API:

```powershell
curl -X POST "http://localhost:8000/api/v1/auth/register" `
  -H "Content-Type: application/json" `
  -d '{
    "username": "admin",
    "email": "admin@leoneai.com",
    "password": "admin123",
    "full_name": "Admin User",
    "country": "SL",
    "currency_preference": "SLL"
  }'
```

---

## 🎯 Success Checklist

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:5173
- [ ] Health check returns `{"status":"healthy"}`
- [ ] Login page loads
- [ ] Can login with admin/admin123
- [ ] Dashboard loads after login
- [ ] No console errors in browser (F12)

---

## 📞 Still Having Issues?

1. **Check backend terminal** for error messages
2. **Check browser console** (F12) for frontend errors
3. **Verify both servers are running** with `netstat -ano | findstr :8000` and `findstr :5173`
4. **Try fresh start**: Kill all processes, delete database, restart both servers

---

**Last Updated**: 2026-02-17  
**Status**: ✅ System Fixed and Ready
