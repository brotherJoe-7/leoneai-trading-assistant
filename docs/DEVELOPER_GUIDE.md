# LeoneAI Developer Guide

## Technology Stack

| Layer     | Technology                            |
| --------- | ------------------------------------- |
| Frontend  | React 18, Vite 4, CSS Modules         |
| Backend   | FastAPI, SQLAlchemy 2, Pydantic v2    |
| Database  | PostgreSQL (production), SQLite (dev) |
| Auth      | JWT (access + refresh tokens)         |
| AI Engine | Python (custom signal generation)     |

---

## Local Development Setup

### Backend

```bash
cd backend/api

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Copy and configure .env
cp .env.example .env
# Required vars: DATABASE_URL, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

# Apply migrations
alembic upgrade head

# Seed initial data (optional)
python seed.py

# Start server with hot-reload
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend-web
npm install
npm run dev   # http://localhost:5173
```

### Running Both Together (Windows)

Open two PowerShell terminals — one for backend, one for frontend.

---

## Project Architecture

### Backend Structure

```
backend/api/app/
├── api/v1/endpoints/       # Route handlers
│   ├── auth.py
│   ├── portfolio.py        # Deposit/withdraw/trade
│   ├── signals.py
│   ├── subscriptions.py
│   └── users.py
├── core/
│   ├── config.py           # Settings (reads .env)
│   └── security.py         # JWT creation/verification
├── db/
│   ├── base.py             # SQLAlchemy Base
│   └── session.py          # DB session factory
├── models/                 # ORM models
├── schemas/                # Pydantic request/response schemas
├── services/               # Business logic layer
└── main.py                 # App entry point, middleware, CORS
```

### Frontend Structure

```
frontend-web/src/
├── assets/styles/
│   ├── variables.css       # Design tokens (colors, spacing, radii)
│   └── global.css          # Base resets and scrollbar styles
├── components/
│   ├── common/             # Button, Card, Modal, etc.
│   └── layout/             # Header, Sidebar, AppLayout
├── contexts/
│   └── AuthContext.jsx     # Global auth state + updateUser()
├── pages/
│   ├── Dashboard/
│   ├── Signals/            # Live API + Follow Signal + toast
│   ├── Portfolio/          # Deposit/withdraw with 6 payment methods
│   ├── Learn/              # Accordion courses, glossary, FAQ
│   └── Subscription/       # Plan upgrade with payment selection
└── services/
    └── api.js              # Axios instance + all API service objects
```

---

## Key Design Decisions

### 1. JSON Body for Portfolio Operations

`/portfolio/deposit` and `/portfolio/withdraw` accept `application/json` bodies (Pydantic schemas), not query parameters. Always send a JSON body.

### 2. Centralized API Service (`api.js`)

All API calls go through the `api` Axios instance which:

- Automatically injects the JWT Bearer token from `localStorage`
- Handles 401 → refresh token → retry silently
- On refresh failure → clears storage and redirects to `/login`

### 3. In-Place Plan Updates

`AuthContext.updateUser(fields)` patches the user object in React state **and** localStorage without a page reload. Use this after subscription upgrades.

### 4. Signals Fallback Strategy

`Signals.jsx` calls `signalsAPI.getSignals()` on mount. If the API is down or returns an empty array, it falls back to `STATIC_SIGNALS` (hardcoded seed data) and shows an error banner. This ensures the page never breaks.

### 5. Color System

The design uses two CSS files:

- `variables.css` — all design tokens as CSS custom properties
- Component `.module.css` files — consume the tokens

**Brand primary:** `#1a56db` (blue) via `--colors-primary` and `--primary-blue`  
**Trading green:** `#22c55e` via `--primary-green` — used only for buy/profit indicators  
**Dark backgrounds:** `#0b0f1a` (body), `#131929` (surface), `#1e2a3d` (elevated)

---

## Adding a New API Endpoint

### 1. Backend — add the route

```python
# backend/api/app/api/v1/endpoints/my_feature.py
from fastapi import APIRouter, Depends
from app.api.deps import get_current_active_user

router = APIRouter()

@router.get("/my-feature")
async def get_my_feature(current_user = Depends(get_current_active_user)):
    return {"data": "..."}
```

### 2. Register the router

```python
# backend/api/app/api/v1/router.py
from .endpoints import my_feature
api_router.include_router(my_feature.router, prefix="/my-feature", tags=["My Feature"])
```

### 3. Frontend — add the API call

```javascript
// frontend-web/src/services/api.js
export const myFeatureAPI = {
  getData: async () => {
    const response = await api.get("/api/v1/my-feature");
    return response.data;
  },
};
```

---

## Database Migrations

```bash
# Create a new migration
alembic revision --autogenerate -m "add my_table"

# Apply all pending migrations
alembic upgrade head

# Roll back one migration
alembic downgrade -1
```

---

## Environment Variables

| Variable                      | Description                   | Example                  |
| ----------------------------- | ----------------------------- | ------------------------ |
| `DATABASE_URL`                | SQLAlchemy connection string  | `sqlite:///./leoneai.db` |
| `SECRET_KEY`                  | JWT signing key (keep secret) | `your-random-256bit-key` |
| `ALGORITHM`                   | JWT algorithm                 | `HS256`                  |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime                | `60`                     |
| `REFRESH_TOKEN_EXPIRE_DAYS`   | Refresh token lifetime        | `7`                      |
| `BACKEND_CORS_ORIGINS`        | Allowed frontend origins      | `http://localhost:5173`  |

---

## CI/CD Suggestions

### GitHub Actions (Recommended)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.11" }
      - run: pip install -r backend/api/requirements.txt
      - run: pytest backend/api/tests/ -v

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20" }
      - run: npm ci
        working-directory: frontend-web
      - run: npm run build
        working-directory: frontend-web
```

### Deployment Options

| Option           | Recommended For                          |
| ---------------- | ---------------------------------------- |
| **Railway**      | Full-stack with PostgreSQL, easy setup   |
| **Render**       | Free tier for backend API                |
| **Vercel**       | Static frontend deployments              |
| **VPS (Ubuntu)** | Full control — use nginx + uvicorn + pm2 |

### Production Checklist

- [ ] Set `SECRET_KEY` to a cryptographically random 256-bit string
- [ ] Use PostgreSQL (not SQLite) for production
- [ ] Enable HTTPS (Let's Encrypt via Certbot)
- [ ] Set `BACKEND_CORS_ORIGINS` to your exact frontend domain
- [ ] Configure rate limiting on auth endpoints
- [ ] Set up database backups (daily, automated)
- [ ] Add monitoring (Sentry or similar)

---

## Running Tests

```bash
# Backend
cd backend/api
pytest tests/ -v --cov=app

# Frontend (if Vitest is set up)
cd frontend-web
npm run test
```
