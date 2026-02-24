import os
from dotenv import load_dotenv

load_dotenv()

# Engine Settings
AI_UPDATE_INTERVAL = int(os.getenv("AI_UPDATE_INTERVAL", 300))  # 5 minutes
AI_CONFIDENCE_THRESHOLD = int(os.getenv("AI_CONFIDENCE_THRESHOLD", 70))

# API Keys
COINGECKO_API_KEY = os.getenv("COINGECKO_API_KEY")
ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ai_engine.db")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Markets to analyze
CRYPTO_MARKETS = ["bitcoin", "ethereum", "ripple", "cardano"]
FOREX_PAIRS = ["USD/SLL", "EUR/USD", "GBP/USD"]
STOCKS = ["AAPL", "GOOGL", "TSLA", "MSFT"]