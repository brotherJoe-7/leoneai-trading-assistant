# LeoneAI Trading API

FastAPI backend for LeoneAI Trading Assistant.

## Features
- User authentication (JWT)
- Market data endpoints
- Trading signals API
- Portfolio management
- WebSocket streaming
- Sierra Leone Leone conversion

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration

### Market Data
- `GET /api/v1/market/prices/{symbol}` - Get current price
- `GET /api/v1/market/history/{symbol}` - Get historical data

### Trading Signals
- `GET /api/v1/signals/` - Get recent signals
- `POST /api/v1/signals/webhook` - Webhook for AI engine

### Portfolio
- `GET /api/v1/portfolio/` - Get portfolio summary
- `POST /api/v1/portfolio/trade` - Execute trade

## Development

1. Install dependencies:
   ```bash
   pip install -r requirements.txt