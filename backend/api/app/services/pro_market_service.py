from datetime import datetime
import random
from typing import List, Dict, Any
import httpx
import logging
from app.core.currency import to_sll

logger = logging.getLogger(__name__)


class ProMarketService:
    def __init__(self):
        self.base_url = "https://api.binance.com/api/v3"
        self.symbol_map = {
            "BTC/USD": "BTCUSDT",
            "ETH/USD": "ETHUSDT",
            "SOL/USD": "SOLUSDT",
            "BNB/USD": "BNBUSDT",
            "XRP/USD": "XRPUSDT",
            "ADA/USD": "ADAUSDT",
            "DOGE/USD": "DOGEUSDT",
            "DOT/USD": "DOTUSDT",
            "MATIC/USD": "MATICUSDT",
            "LINK/USD": "LINKUSDT",
            "LTC/USD": "LTCUSDT",
        }

    def _get_binance_symbol(self, symbol: str) -> str:
        return self.symbol_map.get(symbol, "BTCUSDT")

    async def get_ticker_24h(self, symbol: str) -> Dict[str, Any]:
        """Get 24hr ticker price change statistics (Live from Binance -> SLL)"""
        binance_symbol = self._get_binance_symbol(symbol)
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/ticker/24hr", params={"symbol": binance_symbol}
                )
                data = response.json()

                # Convert to SLL
                last_price_usd = float(data.get("lastPrice", 0))
                open_price_usd = float(data.get("openPrice", 0))
                high_price_usd = float(data.get("highPrice", 0))
                low_price_usd = float(data.get("lowPrice", 0))
                price_change_usd = float(data.get("priceChange", 0))

                return {
                    "symbol": symbol,
                    "priceChange": to_sll(price_change_usd),
                    "priceChangePercent": float(data.get("priceChangePercent", 0)),
                    "lastPrice": to_sll(last_price_usd),
                    "openPrice": to_sll(open_price_usd),
                    "highPrice": to_sll(high_price_usd),
                    "lowPrice": to_sll(low_price_usd),
                    "volume": float(data.get("volume", 0)),
                    "quoteVolume": to_sll(float(data.get("quoteVolume", 0))),
                }
        except Exception as e:
            logger.error(f"Error fetching ticker for {symbol}: {e}")
            # Fallback to mock if API fails
            return self._get_mock_ticker(symbol)

    async def get_order_book(self, symbol: str, limit: int = 10) -> Dict[str, List]:
        """Get order book depth (Live -> SLL)"""
        binance_symbol = self._get_binance_symbol(symbol)
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/depth",
                    params={"symbol": binance_symbol, "limit": limit},
                )
                data = response.json()

                bids = []
                for price, qty in data.get("bids", []):
                    bids.append([to_sll(float(price)), float(qty)])

                asks = []
                for price, qty in data.get("asks", []):
                    asks.append([to_sll(float(price)), float(qty)])

                return {
                    "lastUpdateId": data.get("lastUpdateId"),
                    "bids": bids,
                    "asks": asks,
                }
        except Exception as e:
            logger.error(f"Error fetching depth for {symbol}: {e}")
            return self._get_mock_order_book(symbol)

    async def get_recent_trades(self, symbol: str, limit: int = 20) -> List[Dict]:
        """Get recent trades (Live -> SLL)"""
        binance_symbol = self._get_binance_symbol(symbol)
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/trades",
                    params={"symbol": binance_symbol, "limit": limit},
                )
                trades_data = response.json()

                trades = []
                for t in trades_data:
                    price_usd = float(t.get("price"))
                    qty = float(t.get("qty"))
                    trades.append(
                        {
                            "id": t.get("id"),
                            "price": to_sll(price_usd),
                            "qty": qty,
                            "quoteQty": to_sll(float(t.get("quoteQty"))),
                            "time": t.get("time"),
                            "isBuyerMaker": t.get("isBuyerMaker"),
                            "isBestMatch": t.get("isBestMatch"),
                        }
                    )
                return trades
        except Exception as e:
            logger.error(f"Error fetching trades for {symbol}: {e}")
            return []

    async def place_order(self, order_data: Dict) -> Dict:
        """Simulate placing an order (with live price check)"""
        symbol = order_data.get("symbol")
        side = order_data.get("side")
        type_ = order_data.get("type")
        quantity = order_data.get("quantity")

        # Get live price for execution
        ticker = await self.get_ticker_24h(symbol)
        current_price_sll = ticker["lastPrice"]

        executed_price = current_price_sll  # Market order assumes current price

        return {
            "symbol": symbol,
            "orderId": random.randint(1000000, 9999999),
            "clientOrderId": "leone_live_order",
            "transactTime": int(datetime.utcnow().timestamp() * 1000),
            "price": executed_price,
            "origQty": quantity,
            "executedQty": quantity,
            "cummulativeQuoteQty": executed_price * quantity,
            "status": "FILLED",
            "timeInForce": "GTC",
            "type": type_,
            "side": side,
        }

    # Fallbacks
    def _get_mock_ticker(self, symbol):
        return {
            "symbol": symbol,
            "priceChange": 0,
            "priceChangePercent": 0,
            "lastPrice": to_sll(50000),
            "openPrice": to_sll(50000),
            "highPrice": to_sll(50000),
            "lowPrice": to_sll(50000),
            "volume": 0,
            "quoteVolume": 0,
        }

    def _get_mock_order_book(self, symbol):
        return {"lastUpdateId": 0, "bids": [], "asks": []}


pro_market_service = ProMarketService()
