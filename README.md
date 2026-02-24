# 🇸🇱 LeoneAI — AI-Powered Trading Assistant for Sierra Leone

> Professional trading intelligence built for Sierra Leonean traders. Trade forex, crypto, and more — priced and managed in Sierra Leone Leones (SLL).

![LeoneAI Banner](frontend-web/src/assets/images/logo.png)

## ✨ Features

| Feature            | Free      | Pro       | Premium            |
| ------------------ | --------- | --------- | ------------------ |
| Market Data        | Basic     | Real-time | Real-time          |
| Signals / Week     | 5         | Unlimited | Unlimited + Custom |
| Portfolio Tracking | ✅        | ✅        | ✅                 |
| Copy Trading       | ❌        | ✅        | ✅                 |
| AI Trading Bot     | ❌        | ❌        | ✅                 |
| Support            | Community | Priority  | 24/7 Dedicated     |

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+** (backend)
- **Node.js 18+** (frontend)
- **PostgreSQL 14+** or SQLite (for development)

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/leoneai-trading-assistant.git
cd leoneai-trading-assistant
```

### 2. Backend Setup

```bash
cd backend/api

# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate         # Windows
# source .venv/bin/activate    # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env: set DATABASE_URL, SECRET_KEY, etc.

# Run database migrations
alembic upgrade head

# Start backend server
uvicorn app.main:app --reload --port 8000
```

Backend API available at: **http://localhost:8000**  
Interactive docs: **http://localhost:8000/docs**

### 3. Frontend Setup

```bash
cd frontend-web

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend available at: **http://localhost:5173**

## 💳 Payment Methods Supported

| Method               | Type          | Region        |
| -------------------- | ------------- | ------------- |
| 🇸🇱 Orange Money      | Mobile Money  | Sierra Leone  |
| 🇸🇱 Afrimoney         | Mobile Money  | Sierra Leone  |
| 💳 PayPal            | International | Global        |
| 💳 Stripe            | International | Global        |
| 💳 Visa / Mastercard | Card          | Global        |
| 🏦 Bank Transfer     | Bank          | International |

## 🏗️ Project Structure

```
leoneai-trading-assistant/
├── backend/
│   ├── api/                    # FastAPI REST API
│   │   ├── app/
│   │   │   ├── api/v1/         # API endpoints
│   │   │   ├── models/         # SQLAlchemy models
│   │   │   ├── schemas/        # Pydantic schemas
│   │   │   └── services/       # Business logic
│   │   ├── alembic/            # Database migrations
│   │   └── requirements.txt
│   └── ai-engine/              # AI/ML signal generation
├── frontend-web/               # React + Vite SPA
│   ├── src/
│   │   ├── pages/              # Route pages
│   │   ├── components/         # Reusable components
│   │   ├── services/           # API service layer
│   │   ├── contexts/           # React context providers
│   │   └── assets/             # CSS, images
│   └── package.json
└── docs/                       # Documentation
```

## 🔒 Security

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on critical endpoints
- CORS configured for production domains

## 📄 Documentation

- [User Guide](docs/USER_GUIDE.md)
- [API Reference](docs/API_REFERENCE.md)
- [Developer Guide](docs/DEVELOPER_GUIDE.md)

## 📜 License

MIT License — see [LICENSE](LICENSE) for details.
